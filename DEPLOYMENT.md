# CI/CD Deployment Guide

Complete guide for deploying youth-council.io using GitHub Actions CI/CD pipeline.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [GitHub Secrets Setup](#github-secrets-setup)
- [Workflow Configuration](#workflow-configuration)
- [Deployment Process](#deployment-process)
- [Docker Compose Files](#docker-compose-files)
- [Manual Deployment](#manual-deployment)
- [Rollback Procedure](#rollback-procedure)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Overview

The project uses GitHub Actions for automated deployment to two environments:

- **Staging** - Deployed on push to `staging` branch
- **Production** - Deployed on push to `main` branch

## Architecture

### Environments

#### Staging Server

- **Server**: Existing staging server
- **IP**: Your staging server IP
- **Domains**:
  - `staging.youth-council.io` (Web)
  - `cms.staging.youth-council.io` (CMS)
- **Branch**: `staging`

#### Production Server

- **Server**: Production server
- **IP**: Your production server IP
- **Domains**:
  - `youth-council.io` (Web)
  - `cms.youth-council.io` (CMS)
- **Branch**: `main`

### Services

Each environment runs:

- **CMS Service** - Payload CMS with Next.js backend
- **CMS Jobs Service** - Background jobs processor
- **Web Service** - Next.js frontend
- **MongoDB** - Database (shared across services)
- **Traefik** - Reverse proxy with automatic SSL

## Prerequisites

Before setting up CI/CD:

1. ✅ Complete [Server Setup](./SERVER_SETUP.md)
2. ✅ MongoDB is running
3. ✅ Traefik is configured
4. ✅ DNS records are set
5. ✅ SSH access is configured
6. ✅ Docker is installed on servers

## GitHub Secrets Setup

Navigate to your repository settings (replace owner/repo):
`https://github.com/youth-council/youth-council/settings/secrets/actions`

### Staging Environment Secrets

Add the following secrets:

| Secret Name                   | Description          | Example                           |
| ----------------------------- | -------------------- | --------------------------------- |
| `STAGING_SSH_HOST`            | Staging server IP    | `YOUR_STAGING_IP`                 |
| `STAGING_SSH_USERNAME`        | SSH username         | `root` or `deploy`                |
| `STAGING_SSH_PRIVATE_KEY`     | SSH private key      | Contents of `~/.ssh/id_rsa`       |
| `STAGING_SSH_PORT`            | SSH port             | `22`                              |
| `STAGING_DEPLOY_PATH`         | Deployment directory | `/var/www/youth-council`               |
| `STAGING_NEXT_PUBLIC_CMS_URL` | CMS URL              | `https://cms.staging.youth-council.io` |
| `STAGING_NEXT_PUBLIC_URL`     | Web URL              | `https://staging.youth-council.io`     |

### Production Environment Secrets

| Secret Name                | Description          | Example                     |
| -------------------------- | -------------------- | --------------------------- |
| `PROD_SSH_HOST`            | Production server IP | `YOUR_PROD_IP`              |
| `PROD_SSH_USERNAME`        | SSH username         | `root` or `deploy`          |
| `PROD_SSH_PRIVATE_KEY`     | SSH private key      | Contents of `~/.ssh/id_rsa` |
| `PROD_SSH_PORT`            | SSH port             | `22`                        |
| `PROD_DEPLOY_PATH`         | Deployment directory | `/var/www/youth-council`         |
| `PROD_NEXT_PUBLIC_CMS_URL` | CMS URL              | `https://cms.youth-council.io`   |
| `PROD_NEXT_PUBLIC_URL`     | Web URL              | `https://youth-council.io`       |

### Generating SSH Key (if needed)

```bash
# Generate new SSH key pair
ssh-keygen -t ed25519 -C "github-actions@youth-council.io" -f ~/.ssh/github-actions

# Copy public key to server
ssh-copy-id -i ~/.ssh/github-actions.pub user@server-ip

# Copy private key content for GitHub secret
cat ~/.ssh/github-actions
# Copy the entire output including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ...
# -----END OPENSSH PRIVATE KEY-----
```

## Workflow Configuration

The project includes two GitHub Actions workflows:

### 1. CMS Workflow (`.github/workflows/build-cms.yaml`)

**Triggers on:**

- Push to `staging` or `main` branches
- Changes in:
  - `apps/cms/**`
  - `Dockerfile`
  - `Dockerfile.jobs`

**Actions:**

1. Checkout code
2. Build CMS Docker image
3. Build CMS Jobs Docker image
4. Save images as tar files
5. Transfer to server via SCP
6. Load and deploy images
7. Clean up old images

### 2. Web Workflow (`.github/workflows/build-web.yaml`)

**Triggers on:**

- Push to `staging` or `main` branches
- Changes in:
  - `apps/web/**`
  - `DockerfileWeb`

**Actions:**

1. Checkout code
2. Build Web Docker image
3. Save image as tar file
4. Transfer to server via SCP
5. Load and deploy image
6. Clean up old images

## Deployment Process

### Deploying to Staging

```bash
# Switch to staging branch
git checkout staging

# Make your changes
# ...

# Commit and push
git add .
git commit -m "feat: add new feature"
git push origin staging
```

**What happens automatically:**

1. GitHub Actions detects push to `staging`
2. Determines which services changed (CMS/Web)
3. Builds Docker images
4. Transfers images to staging server
5. Loads images on server
6. Restarts affected containers
7. Cleans up old images
8. Sends status notification

**Monitoring the deployment:**

1. Go to GitHub repository
2. Click on **Actions** tab
3. Select the running workflow
4. Monitor each step in real-time

### Deploying to Production

```bash
# Switch to main branch
git checkout main

# Merge staging (or create PR on GitHub)
git merge staging

# Push to main
git push origin main
```

**Important:** Always test on staging before deploying to production!

### Deployment Timeline

- **Build Time**: 3-5 minutes
- **Transfer Time**: 1-2 minutes
- **Deployment Time**: 30-60 seconds
- **Total**: ~5-8 minutes

## Docker Compose Files

### CMS Docker Compose

Location: `/var/www/smarty-landing/cms/docker-compose.cms.yml`

```yaml
version: '3.8'

services:
  cms:
    image: smarty-landing-cms:latest
    container_name: cms
    restart: always
    env_file:
      - ../.env
    networks:
      - smarty-landing-network
    depends_on:
      - mongo
    labels:
      - 'traefik.enable=true'
      - 'traefik.http.routers.cms.rule=Host(`cms.smarty-landing.io`)'
      - 'traefik.http.routers.cms.entrypoints=websecure'
      - 'traefik.http.routers.cms.tls.certresolver=letsencrypt'
      - 'traefik.http.services.cms.loadbalancer.server.port=3000'

networks:
  smarty-landing-network:
    external: true
```

### Web Docker Compose

Location: `/var/www/smarty-landing/web/docker-compose.web.yml`

```yaml
version: '3.8'

services:
  web:
    image: smarty-landing-web:latest
    container_name: web
    restart: always
    environment:
      - NEXT_PUBLIC_CMS_URL=${NEXT_PUBLIC_CMS_URL}
      - NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}
      - NODE_ENV=production
    networks:
      - smarty-landing-network
    labels:
      - 'traefik.enable=true'
      - 'traefik.http.routers.web.rule=Host(`smarty-landing.io`, `www.smarty-landing.io`)'
      - 'traefik.http.routers.web.entrypoints=websecure'
      - 'traefik.http.routers.web.tls.certresolver=letsencrypt'
      - 'traefik.http.services.web.loadbalancer.server.port=3000'
      - 'traefik.http.middlewares.web-redirect.redirectregex.regex=^https://www.smarty-landing.io/(.*)'
      - 'traefik.http.middlewares.web-redirect.redirectregex.replacement=https://smarty-landing.io/$${1}'
      - 'traefik.http.routers.web.middlewares=web-redirect'

networks:
  smarty-landing-network:
    external: true
```

## Manual Deployment

If you need to deploy manually without GitHub Actions:

### 1. Build Images Locally

```bash
# CMS
docker build -f Dockerfile -t smarty-landing-cms:latest .

# Web
docker build -f DockerfileWeb -t smarty-landing-web:latest .
```

### 2. Save Images

```bash
docker save smarty-landing-cms:latest | gzip > cms.tar.gz
docker save smarty-landing-web:latest | gzip > web.tar.gz
```

### 3. Transfer to Server

```bash
scp cms.tar.gz user@server:/var/www/smarty-landing/cms/
scp web.tar.gz user@server:/var/www/smarty-landing/web/
```

### 4. Load and Deploy on Server

```bash
# SSH to server
ssh user@server

cd /var/www/smarty-landing

# Load CMS images
cd cms
gunzip -c cms.tar.gz | docker load
docker compose -f docker-compose.cms.yml up -d

# Load Web image
cd ../web
gunzip -c web.tar.gz | docker load
docker compose -f docker-compose.web.yml up -d

# Verify
docker ps
```

### 5. Clean Up

```bash
# On server
rm -f /var/www/smarty-landing/cms/cms*.tar.gz
rm -f /var/www/smarty-landing/web/web.tar.gz

# Clean old images
docker image prune -f
```

## Rollback Procedure

### Quick Rollback Using Previous Image

```bash
# SSH to server
ssh user@server

# List available images
docker images | grep smarty-landing

# Find the previous image (identified by IMAGE ID or tag)
# Tag it as latest
docker tag <PREVIOUS_IMAGE_ID> smarty-landing-cms:latest
docker tag <PREVIOUS_IMAGE_ID> smarty-landing-web:latest

# Restart containers
cd /var/www/smarty-landing
docker compose -f cms/docker-compose.cms.yml up -d
docker compose -f web/docker-compose.web.yml up -d
```

### Rollback by Redeploying Previous Commit

```bash
# Locally
git log --oneline  # Find the commit to rollback to

# Create rollback branch
git checkout -b rollback/<commit-hash> <commit-hash>

# Push to trigger deployment
git push origin rollback/<commit-hash>:staging
# or
git push origin rollback/<commit-hash>:main
```

### Rollback by Keeping Old Images

To keep old images for quick rollback:

Modify the workflow to tag images with commit SHA:

```yaml
# In .github/workflows/build-cms.yaml
- name: Build CMS
  run: |
    docker build -f Dockerfile \
      -t smarty-landing-cms:latest \
      -t smarty-landing-cms:${{ github.sha }} \
      .
```

Then on server, you can quickly switch:

```bash
docker tag smarty-landing-cms:<old-sha> smarty-landing-cms:latest
docker compose up -d
```

## Monitoring

### Checking Deployment Status

**On GitHub:**

1. Go to **Actions** tab
2. View workflow run
3. Check logs for each step

**On Server:**

```bash
# Check running containers
docker ps

# Check container logs
docker logs cms --tail 50 -f
docker logs web --tail 50 -f

# Check container stats
docker stats

# Check Traefik logs
docker logs traefik --tail 50 -f
```

### Health Checks

```bash
# CMS Health
curl https://cms.smarty-landing.io/api/health
curl https://cms.staging.smarty-landing.io/api/health

# Web Health
curl -I https://smarty-landing.io
curl -I https://staging.smarty-landing.io

# Check SSL
echo | openssl s_client -servername smarty-landing.io -connect smarty-landing.io:443 2>/dev/null | openssl x509 -noout -dates
```

### Automated Monitoring Script

Create `/var/www/smarty-landing/monitor-deployment.sh`:

```bash
#!/bin/bash

SERVICES=("cms" "web" "mongo" "traefik")
URLS=("https://smarty-landing.io" "https://cms.smarty-landing.io")

echo "=== Container Status ==="
for service in "${SERVICES[@]}"; do
  if docker ps --format "{{.Names}}" | grep -q "^${service}$"; then
    status=$(docker inspect -f '{{.State.Status}}' $service)
    echo "✓ $service: $status"
  else
    echo "✗ $service: not running"
  fi
done

echo -e "\n=== URL Health Checks ==="
for url in "${URLS[@]}"; do
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$http_code" -eq 200 ]; then
    echo "✓ $url: $http_code"
  else
    echo "✗ $url: $http_code"
  fi
done

echo -e "\n=== Disk Usage ==="
df -h /var/www/smarty-landing

echo -e "\n=== Memory Usage ==="
free -h

echo -e "\n=== Recent Errors ==="
docker logs cms --tail 5 2>&1 | grep -i error || echo "No errors"
docker logs web --tail 5 2>&1 | grep -i error || echo "No errors"
```

## Troubleshooting

### Workflow Fails at Build Step

**Problem:** Docker build fails

**Solution:**

```bash
# Check Dockerfile syntax
docker build -f Dockerfile --no-cache .

# Check build context size
du -sh .

# Check if .dockerignore exists
cat .dockerignore
```

### Workflow Fails at SCP Step

**Problem:** Cannot transfer files to server

**Solution:**

```bash
# Verify SSH key is correct
ssh -i ~/.ssh/github-actions user@server

# Check firewall
ufw status

# Check disk space on server
df -h

# Check permissions
ls -la /var/www/smarty-landing
```

### Container Fails to Start

**Problem:** Container exits immediately after deployment

**Solution:**

```bash
# Check logs
docker logs cms --tail 100

# Check environment variables
docker exec cms env

# Check if database is accessible
docker exec cms nc -zv mongo 27017

# Restart with manual command
docker run --rm -it --env-file /var/www/smarty-landing/.env smarty-landing-cms:latest sh
```

### SSL Certificate Not Generated

**Problem:** HTTPS not working

**Solution:**

```bash
# Check Traefik logs
docker logs traefik | grep -i acme

# Verify DNS
dig smarty-landing.io
dig cms.smarty-landing.io

# Check acme.json
ls -la /var/www/smarty-landing/traefik/letsencrypt/acme.json
cat /var/www/smarty-landing/traefik/letsencrypt/acme.json

# Restart Traefik
cd /var/www/smarty-landing/traefik
docker compose restart
```

### Database Connection Issues

**Problem:** CMS cannot connect to MongoDB

**Solution:**

```bash
# Check if MongoDB is running
docker ps | grep mongo

# Test connection from CMS container
docker exec cms nc -zv mongo 27017

# Check MongoDB logs
docker logs mongo --tail 100

# Verify credentials
docker exec -it mongo mongosh -u admin -p
```

### Out of Disk Space

**Problem:** Server runs out of space

**Solution:**

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a -f
docker volume prune -f

# Remove old backups
find /var/www/smarty-landing/backups/mongo -mtime +7 -delete

# Check largest directories
du -h /var/www/smarty-landing | sort -rh | head -10
```

## Best Practices

### 1. Always Test on Staging First

```bash
# Merge to staging first
git checkout staging
git merge feature-branch
git push origin staging

# Wait for deployment and test
# Then merge to main
git checkout main
git merge staging
git push origin main
```

### 2. Use Feature Branches

```bash
# Create feature branch
git checkout -b feature/new-feature

# Develop and commit
git commit -m "feat: add new feature"

# Create PR to staging
git push origin feature/new-feature
# Then create PR on GitHub
```

### 3. Tag Releases

```bash
# After successful production deployment
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 4. Monitor After Deployment

```bash
# Keep logs open for 5-10 minutes after deployment
ssh user@server
docker logs cms -f
docker logs web -f
```

### 5. Keep Environment Variables Synced

```bash
# Verify .env on server matches your expectations
ssh user@server
cat /var/www/smarty-landing/.env
```

## Deployment Checklist

### Before Deployment

- [ ] Code is tested locally
- [ ] Tests pass
- [ ] Build succeeds locally
- [ ] Staging deployment successful
- [ ] Staging testing complete
- [ ] Database migrations (if any) are prepared
- [ ] Backup created
- [ ] Team notified

### After Deployment

- [ ] All containers are running
- [ ] Health checks pass
- [ ] SSL certificates valid
- [ ] Website loads correctly
- [ ] CMS admin accessible
- [ ] API endpoints working
- [ ] Monitor logs for errors
- [ ] Performance metrics normal
- [ ] Backup created post-deployment

## Support

For deployment issues:

- Check GitHub Actions logs
- Check Docker logs on server: `docker logs <container>`
- Check Traefik dashboard: `https://traefik.smarty-landing.io`
- Review [Server Setup](./SERVER_SETUP.md) guide
- Contact DevOps team

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
