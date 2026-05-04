## Deploy (example)

This is an example deployment setup using a shared **Traefik** instance (external network: `traefik-network`).

It is provided as a template. Adjust service names, domains, images/build steps, and environment variables for this repo.

### First run on a server

```bash
cd .deploy
bash setup.sh
```

Fill in values in:
- `env.traefik.prod` — hostnames for Traefik (no `https://`): `WEB_YOUTH_COUNCIL_LANDING_DOMAIN`, `WEB_CMS_DOMAIN`, `WEB_MINIO_S3_DOMAIN`, `WEB_MINIO_CONSOLE_DOMAIN`, plus `TRAEFIK_ACME_EMAIL`
- `env.web.prod` — app secrets and public URLs (`NEXT_PUBLIC_*`, `CMS_URL`, `S3_*`, `MINIO_*`, etc.); public URLs must match the Traefik hosts

### Start

```bash
docker compose -f docker-compose.prod.yml \
  --env-file env.traefik.prod \
  --env-file env.web.prod \
  up -d --build
```

Notes:
- `docker-compose.prod.yml` now includes a `traefik` service. Set `TRAEFIK_ACME_EMAIL` in `env.traefik.prod` so Let's Encrypt can issue certificates.


