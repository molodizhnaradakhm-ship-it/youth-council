import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const deployDir = path.join(repoRoot, '.deploy');
const composeFile = path.join(deployDir, 'docker-compose.dev.yml');
const envFile = path.join(deployDir, 'env.dev');
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

function getContainerNetworks(containerId) {
  const raw = sh(`docker inspect ${containerId} --format "{{json .NetworkSettings.Networks}}"`);
  const obj = JSON.parse(raw || '{}');
  return Object.keys(obj);
}

function usage() {
  console.log(
    [
      'Usage:',
      '  node .deploy/seed/seed.mjs backup',
      '  node .deploy/seed/seed.mjs seed --yes',
      '  (or: SEED=true node .deploy/seed/seed.mjs seed)',
      '',
      'What it does:',
      '  backup: creates .deploy/seed-data/mongo.archive.gz and .deploy/seed-data/minio/**',
      '  seed: restores Mongo dump + mirrors MinIO objects from seed-data into the running MinIO',
    ].join('\n'),
  );
}

async function backup() {
  ensureDirs();
  const env = parseEnv(envFile);

  const mongoContainer = 'youth-council-landing-mongo-dev';
  const minioContainer = 'youth-council-landing-minio-dev';

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
  const env = parseEnv(envFile);
  if (!seedConfirmed()) {
    console.log('Seed skipped. Run with --yes (or SEED=true) to execute (drops Mongo, overwrites MinIO).');
    return;
  }

  const mongoContainer = 'youth-council-landing-mongo-dev';
  const minioContainer = 'youth-council-landing-minio-dev';

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
  if (!bucket) throw new Error('S3_BUCKET is missing in .deploy/env.dev');
  if (!accessKey || !secretKey) throw new Error('MinIO credentials missing in .deploy/env.dev');

  const bucketPath = path.join(minioDir, bucket);
  if (!fs.existsSync(bucketPath)) {
    throw new Error(`MinIO bucket backup not found: ${bucketPath}. Run backup first.`);
  }

  console.log('\n== Mongo: restore archive ==\n');
  // Copy archive into container and restore (drop existing)
  run(`docker cp "${mongoArchive}" ${mongoId}:/tmp/seed.archive.gz`);
  run(`docker exec ${mongoId} sh -lc "mongorestore --archive=/tmp/seed.archive.gz --gzip --drop"`);
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

