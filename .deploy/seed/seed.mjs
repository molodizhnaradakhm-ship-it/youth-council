import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const deployDir = path.join(repoRoot, '.deploy');
const defaultDevEnvFile = path.join(deployDir, 'env.dev');
const defaultProdEnvFile = path.join(deployDir, 'env.web.prod');
const seedDir = path.join(deployDir, 'seed-data');
const mongoArchive = path.join(seedDir, 'mongo.archive.gz');
const minioDir = path.join(seedDir, 'minio');

function run(cmd, opts = {}) {
  const res = spawnSync(cmd, {
    shell: true,
    stdio: 'inherit',
    ...opts,
  });
  if (res.status !== 0) {
    throw new Error(`Command failed (${res.status}): ${cmd}`);
  }
}

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function parseEnv(filePath) {
  const out = {};
  const txt = fs.readFileSync(filePath, 'utf8');
  for (const line of txt.split(/\r?\n/)) {
    const l = line.trim();
    if (!l || l.startsWith('#')) continue;
    const idx = l.indexOf('=');
    if (idx === -1) continue;
    const key = l.slice(0, idx).trim();
    let val = l.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function ensureDirs() {
  fs.mkdirSync(seedDir, { recursive: true });
  fs.mkdirSync(minioDir, { recursive: true });
}

function containerIdByName(name) {
  // Prefer exact container name (compose sets container_name)
  try {
    return sh(`docker ps -q --filter "name=^/${name}$"`);
  } catch {
    return '';
  }
}

function pickArgValue(argv, flag) {
  const idx = argv.indexOf(flag);
  if (idx === -1) return null;
  const val = argv[idx + 1];
  if (!val || val.startsWith('-')) return null;
  return val;
}

function getConfigFromArgs() {
  const argv = process.argv.slice(2);
  const envNameRaw = pickArgValue(argv, '--env');
  const envName = envNameRaw === 'prod' ? 'prod' : 'dev';

  const envFileArg = pickArgValue(argv, '--env-file');
  const envFile =
    envFileArg ||
    (envName === 'prod'
      ? // Prod env files are typically present only on the server.
        defaultProdEnvFile
      : defaultDevEnvFile);

  const mongoContainerArg = pickArgValue(argv, '--mongo-container');
  const minioContainerArg = pickArgValue(argv, '--minio-container');

  const mongoContainer =
    mongoContainerArg || (envName === 'prod' ? 'youth-council-landing-mongo' : 'youth-council-landing-mongo-dev');
  const minioContainer =
    minioContainerArg || (envName === 'prod' ? 'youth-council-landing-minio' : 'youth-council-landing-minio-dev');

  // Optional Mongo namespace rewrite for restores (e.g. smarty-landing.* -> youth-council.*)
  // mongorestore flags: --nsFrom <pattern> --nsTo <replacement>
  const nsFrom = pickArgValue(argv, '--ns-from');
  const nsTo = pickArgValue(argv, '--ns-to');

  return { envName, envFile, mongoContainer, minioContainer, nsFrom, nsTo };
}

function getContainerNetworks(containerId) {
  const raw = sh(`docker inspect ${containerId} --format "{{json .NetworkSettings.Networks}}"`);
  const obj = JSON.parse(raw || '{}');
  return Object.keys(obj);
}

function usage() {
  console.log(
    [
      'Usage:',
      '  node .deploy/seed/seed.mjs backup [--env dev|prod] [--env-file <path>]',
      '  node .deploy/seed/seed.mjs seed [--env dev|prod] [--env-file <path>] --yes',
      '  (or: SEED=true node .deploy/seed/seed.mjs seed)',
      '',
      'Overrides (optional):',
      '  --mongo-container <name>   (defaults: youth-council-landing-mongo-dev / youth-council-landing-mongo)',
      '  --minio-container <name>   (defaults: youth-council-landing-minio-dev / youth-council-landing-minio)',
      '  --ns-from <pattern>        (mongorestore namespace rewrite source, e.g. smarty-landing.*)',
      '  --ns-to <pattern>          (mongorestore namespace rewrite target, e.g. youth-council.*)',
      '',
      'What it does:',
      '  backup: creates .deploy/seed-data/mongo.archive.gz and .deploy/seed-data/minio/**',
      '  seed: restores Mongo dump + mirrors MinIO objects from seed-data into the running MinIO',
    ].join('\n'),
  );
}

async function backup() {
  ensureDirs();
  const { envFile, mongoContainer, minioContainer } = getConfigFromArgs();
  if (!fs.existsSync(envFile)) {
    throw new Error(`Env file not found: ${envFile}. Use --env-file to point to the correct file.`);
  }
  const env = parseEnv(envFile);

  const mongoId = containerIdByName(mongoContainer);
  const minioId = containerIdByName(minioContainer);
  if (!mongoId) throw new Error(`Mongo container not running: ${mongoContainer}`);
  if (!minioId) throw new Error(`MinIO container not running: ${minioContainer}`);

  // Mongo dump (gzip archive)
  console.log('\n== Mongo: mongodump → archive ==\n');
  run(`docker exec ${mongoId} sh -lc "mongodump --archive=/tmp/seed.archive.gz --gzip"`);
  run(`docker cp ${mongoId}:/tmp/seed.archive.gz "${mongoArchive}"`);
  run(`docker exec ${mongoId} sh -lc "rm -f /tmp/seed.archive.gz"`);

  // MinIO mirror via mc container (does not require mc on host)
  const bucket = env.S3_BUCKET;
  const accessKey = env.S3_ACCESS_KEY_ID || env.MINIO_ROOT_USER;
  const secretKey = env.S3_SECRET_ACCESS_KEY || env.MINIO_ROOT_PASSWORD;
  const endpoint = env.S3_ENDPOINT || 'http://minio:9000';
  if (!bucket) throw new Error('S3_BUCKET is missing in .deploy/env.dev');
  if (!accessKey || !secretKey) throw new Error('MinIO credentials missing in .deploy/env.dev');

  const networks = getContainerNetworks(minioId);
  const network = networks[0];
  if (!network) throw new Error('Could not determine docker network for MinIO container');

  console.log('\n== MinIO: mc mirror bucket → local folder ==\n');
  const minioDirPosix = minioDir.replace(/\\/g, '/');
  run(
    `docker run --rm --network ${network} -v "${minioDirPosix}:/seed" --entrypoint /bin/sh minio/mc -lc ` +
      `"mc alias set src ${endpoint} ${accessKey} ${secretKey} --api s3v4; mc mirror --overwrite src/${bucket} /seed/${bucket}"`,
  );

  console.log(`\nBackup completed:\n- ${mongoArchive}\n- ${path.join(minioDir, bucket)}\n`);
}

function seedConfirmed() {
  const argv = process.argv.slice(2);
  return (
    String(process.env.SEED || '').toLowerCase() === 'true' ||
    argv.includes('--yes') ||
    argv.includes('--confirm')
  );
}

async function seed() {
  const { envFile, mongoContainer, minioContainer, nsFrom, nsTo } = getConfigFromArgs();
  if (!fs.existsSync(envFile)) {
    throw new Error(`Env file not found: ${envFile}. Use --env-file to point to the correct file.`);
  }
  const env = parseEnv(envFile);
  if (!seedConfirmed()) {
    console.log('Seed skipped. Run with --yes (or SEED=true) to execute (drops Mongo, overwrites MinIO).');
    return;
  }

  const mongoId = containerIdByName(mongoContainer);
  const minioId = containerIdByName(minioContainer);
  if (!mongoId) throw new Error(`Mongo container not running: ${mongoContainer}`);
  if (!minioId) throw new Error(`MinIO container not running: ${minioContainer}`);

  if (!fs.existsSync(mongoArchive)) {
    throw new Error(`Mongo archive not found: ${mongoArchive}. Run backup first.`);
  }

  const bucket = env.S3_BUCKET;
  const accessKey = env.S3_ACCESS_KEY_ID || env.MINIO_ROOT_USER;
  const secretKey = env.S3_SECRET_ACCESS_KEY || env.MINIO_ROOT_PASSWORD;
  const endpoint = env.S3_ENDPOINT || 'http://minio:9000';
  if (!bucket) throw new Error(`S3_BUCKET is missing in ${envFile}`);
  if (!accessKey || !secretKey) throw new Error(`MinIO credentials missing in ${envFile}`);

  const bucketPath = path.join(minioDir, bucket);
  if (!fs.existsSync(bucketPath)) {
    throw new Error(`MinIO bucket backup not found: ${bucketPath}. Run backup first.`);
  }

  console.log('\n== Mongo: restore archive ==\n');
  // Copy archive into container and restore (drop existing)
  run(`docker cp "${mongoArchive}" ${mongoId}:/tmp/seed.archive.gz`);
  // Important: don't inject quotes here (command is already wrapped by sh -lc "...").
  // Patterns like smarty-landing.* have no spaces and are safe without shell quoting.
  const rewriteArgs = nsFrom && nsTo ? ` --nsFrom=${nsFrom} --nsTo=${nsTo}` : '';
  if ((nsFrom && !nsTo) || (!nsFrom && nsTo)) {
    throw new Error('Both --ns-from and --ns-to must be provided together.');
  }
  run(
    `docker exec ${mongoId} sh -lc ` +
      `"mongorestore --archive=/tmp/seed.archive.gz --gzip --drop${rewriteArgs}"`,
  );
  run(`docker exec ${mongoId} sh -lc "rm -f /tmp/seed.archive.gz"`);

  console.log('\n== MinIO: mirror local folder → bucket ==\n');
  const networks = getContainerNetworks(minioId);
  const network = networks[0];
  if (!network) throw new Error('Could not determine docker network for MinIO container');
  const bucketPathPosix = bucketPath.replace(/\\/g, '/');
  run(
    `docker run --rm --network ${network} -v "${bucketPathPosix}:/seed" --entrypoint /bin/sh minio/mc -lc ` +
      `"mc alias set dst ${endpoint} ${accessKey} ${secretKey} --api s3v4; mc mb -p dst/${bucket} || true; mc mirror --overwrite /seed dst/${bucket}"`,
  );

  console.log('\nSeed completed.\n');
}

const cmd = process.argv[2];
if (!cmd || cmd === '-h' || cmd === '--help') {
  usage();
  process.exit(0);
}

if (cmd === 'backup') {
  await backup();
} else if (cmd === 'seed') {
  await seed();
} else {
  usage();
  process.exit(1);
}

