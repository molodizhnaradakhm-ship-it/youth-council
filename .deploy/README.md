## Deploy (example)

This is an example deployment setup using a shared **Traefik** instance (external network: `traefik-network`).

It is provided as a template. Adjust service names, domains, images/build steps, and environment variables for this repo.

### First run on a server

```bash
cd .deploy
bash setup.sh
```

Fill in values in:
- `env.traefik.prod` — domains for Traefik (`WEB_GREEN_DOMAIN`, `WEB_GOLD_DOMAIN`, `WEB_YOUTH_COUNCIL_LANDING_DOMAIN`; host only, no `https://`)
- `env.web.prod` — public web variables (including `NEXT_PUBLIC_*` for the landing app when building `youth-council-landing-web`)

### Start

```bash
docker compose -f docker-compose.prod.yml \
  --env-file env.traefik.prod \
  --env-file env.web.prod \
  up -d --build
```


