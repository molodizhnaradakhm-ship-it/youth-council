## Seed / Backup (youth-council)

This folder contains a simple backup/restore script that works with the **running dev containers** from `.deploy/docker-compose.dev.yml`.

### What it backs up
- **MongoDB**: `mongodump` archive (gzip)
- **MinIO**: mirrors the configured bucket into a local folder

### Where output goes
- `.deploy/seed-data/mongo.archive.gz`
- `.deploy/seed-data/minio/<bucket>/**`

### Requirements
- Docker running
- Containers up (from `.deploy/docker-compose.dev.yml`)
- `.deploy/env.dev` contains MinIO + Mongo settings (defaults already there)

### Commands
From repo root (also exposed as pnpm scripts at the monorepo root):

```bash
pnpm seed:backup
pnpm seed:restore
```

Equivalent `node` invocations:

```bash
node .deploy/seed/seed.mjs backup
node .deploy/seed/seed.mjs seed --yes
# or: SEED=true node .deploy/seed/seed.mjs seed
```

Notes:
- `seed` **drops** Mongo collections (`mongorestore --drop`).
- MinIO restore uses `mc mirror --overwrite`.

