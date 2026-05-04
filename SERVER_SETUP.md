# Server Setup Guide

Complete guide for setting up a production server for youth-council.io.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Server Requirements](#server-requirements)
- [Initial Server Setup](#initial-server-setup)
- [Install Docker](#install-docker)
- [Setup Directory Structure](#setup-directory-structure)
- [Configure MongoDB](#configure-mongodb)
- [Configure Traefik (Reverse Proxy)](#configure-traefik-reverse-proxy)
- [Setup SSL Certificates](#setup-ssl-certificates)
- [Configure Environment Variables](#configure-environment-variables)
- [Setup Backups](#setup-backups)
- [Security Hardening](#security-hardening)
- [Monitoring](#monitoring)

## Prerequisites

- Root or sudo access to a Linux server
- Domain name configured with DNS
- Basic knowledge of Linux command line
- SSH key pair for secure access

## Server Requirements

### Minimum Specifications

- **OS**: Ubuntu 22.04 LTS or Debian 11+
- **CPU**: 2 cores
- **RAM**: 4 GB
- **Storage**: 50 GB SSD
- **Network**: Static IP address

### Recommended Specifications

- **OS**: Ubuntu 22.04 LTS
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 100 GB SSD
- **Network**: Static IP with firewall

## Initial Server Setup

### 1. Connect to Server

```bash
ssh root@your-server-ip
```

### 2. Update System

```bash
apt update && apt upgrade -y
```

### 3. Set Hostname

```bash
hostnamectl set-hostname youth-council-prod
echo "127.0.0.1 youth-council-prod" >> /etc/hosts
```

### 4. Configure Timezone

```bash
timedatectl set-timezone Europe/Kiev
# or your timezone
timedatectl set-timezone UTC
```

### 5. Create Non-Root User (Optional but Recommended)

```bash
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy

# Setup SSH key for deploy user
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

### 6. Configure Firewall

```bash
# Install UFW
apt install ufw -y

# Configure rules
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable
ufw status
```

## Install Docker

### 1. Install Docker Engine

```bash
# Remove old versions
apt remove docker docker-engine docker.io containerd runc

# Install prerequisites
apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Setup repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### 2. Configure Docker

```bash
# Enable Docker service
systemctl enable docker
systemctl start docker

# Add user to docker group (if using non-root user)
usermod -aG docker deploy

# Configure Docker daemon
cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

# Restart Docker
systemctl restart docker
```

## Setup Directory Structure

```bash
# Create main directory
mkdir -p /var/www/youth-council
cd /var/www/youth-council

# Create subdirectories
mkdir -p {cms,web,mongo,traefik,backups}
mkdir -p traefik/{dynamic,letsencrypt}
mkdir -p mongo/mongodb-data
mkdir -p backups/mongo

# Set permissions
chown -R deploy:deploy /var/www/youth-council  # if using deploy user
chmod -R 755 /var/www/youth-council
```

## Configure MongoDB

### 1. Create MongoDB Docker Compose

Create `/var/www/smarty-landing/mongo/docker-compose.mongo.yml`:

```yaml
version: '3.8'

services:
  mongo:
    image: mongo:7
    container_name: mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: smarty-landing
    volumes:
      - ./mongodb-data:/data/db
      - ../backups/mongo:/backups
    networks:
      - smarty-landing-network
    ports:
      - '127.0.0.1:27017:27017'
    command: --quiet

networks:
  smarty-landing-network:
    external: true
```

### 2. Create MongoDB Environment File

Create `/var/www/smarty-landing/mongo/.env`:

```env
MONGO_ROOT_PASSWORD=your-secure-password-here
```

**Generate secure password:**

```bash
openssl rand -base64 32
```

### 3. Create Docker Network

```bash
docker network create smarty-landing-network
```

### 4. Start MongoDB

```bash
cd /var/www/smarty-landing/mongo
docker compose up -d

# Check status
docker ps
docker logs mongo
```

### 5. Create Application Database User

```bash
# Connect to MongoDB
docker exec -it mongo mongosh -u admin -p

# In MongoDB shell:
use smarty-landing

db.createUser({
  user: "smarty_landing_user",
  pwd: "another-secure-password",
  roles: [
    { role: "readWrite", db: "smarty-landing" }
  ]
})

exit
```

Save the database credentials for later use in CMS configuration.

## Configure Traefik (Reverse Proxy)

### 1. Create Traefik Configuration

Create `/var/www/smarty-landing/traefik/traefik.yml`:

```yaml
global:
  checkNewVersion: true
  sendAnonymousUsage: false

api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ':80'
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https

  websecure:
    address: ':443'
    http:
      tls:
        certResolver: letsencrypt

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@smarty-landing.io
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

providers:
  docker:
    endpoint: 'unix:///var/run/docker.sock'
    exposedByDefault: false
    network: smarty-landing-network
  file:
    directory: /dynamic
    watch: true

log:
  level: INFO
  format: json

accessLog:
  format: json
```

### 2. Create Dynamic Configuration

Create `/var/www/smarty-landing/traefik/dynamic/traefik.yml`:

```yaml
http:
  middlewares:
    security-headers:
      headers:
        frameDeny: true
        contentTypeNosniff: true
        browserXssFilter: true
        referrerPolicy: 'strict-origin-when-cross-origin'
        customResponseHeaders:
          X-Robots-Tag: 'none,noarchive,nosnippet,notranslate,noimageindex'
        customFrameOptionsValue: 'SAMEORIGIN'

    rate-limit:
      rateLimit:
        average: 100
        burst: 50

    compress:
      compress: {}

tls:
  options:
    default:
      minVersion: VersionTLS12
      cipherSuites:
        - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
```

### 3. Create Traefik Docker Compose

Create `/var/www/smarty-landing/traefik/docker-compose.traefik.yml`:

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: always
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./dynamic:/dynamic:ro
      - ./letsencrypt:/letsencrypt
    networks:
      - smarty-landing-network
    labels:
      - 'traefik.enable=true'
      - 'traefik.http.routers.dashboard.rule=Host(`traefik.smarty-landing.io`)'
      - 'traefik.http.routers.dashboard.service=api@internal'
      - 'traefik.http.routers.dashboard.entrypoints=websecure'
      - 'traefik.http.routers.dashboard.tls.certresolver=letsencrypt'
      - 'traefik.http.routers.dashboard.middlewares=auth'
      - 'traefik.http.middlewares.auth.basicauth.users=${TRAEFIK_DASHBOARD_AUTH}'

networks:
  smarty-landing-network:
    external: true
```

### 4. Generate Dashboard Password

```bash
# Install apache2-utils
apt install apache2-utils -y

# Generate password (replace 'admin' and 'your-password')
echo $(htpasswd -nb admin your-password)

# Copy the output and add to .env file
```

Create `/var/www/smarty-landing/traefik/.env`:

```env
TRAEFIK_DASHBOARD_AUTH=admin:$apr1$xyz...
```

### 5. Create acme.json File

```bash
touch /var/www/smarty-landing/traefik/letsencrypt/acme.json
chmod 600 /var/www/smarty-landing/traefik/letsencrypt/acme.json
```

### 6. Start Traefik

```bash
cd /var/www/smarty-landing/traefik
docker compose up -d

# Check logs
docker logs traefik -f
```

## Setup SSL Certificates

SSL certificates are automatically generated by Traefik using Let's Encrypt.

### Verify SSL Setup

After deploying your applications (see DEPLOYMENT.md), check:

```bash
# Check certificate file
ls -la /var/www/smarty-landing/traefik/letsencrypt/

# Test SSL
curl -I https://smarty-landing.io
curl -I https://cms.smarty-landing.io

# Check SSL rating
# Visit: https://www.ssllabs.com/ssltest/
```

## Configure Environment Variables

### 1. Create Main .env File

Create `/var/www/smarty-landing/.env`:

```env
# Environment
NODE_ENV=production

# MongoDB
MONGO_ROOT_PASSWORD=your-mongo-root-password
DATABASE_URI=mongodb://smarty_landing_user:your-db-password@mongo:27017/smarty-landing

# Payload CMS
PAYLOAD_SECRET=your-payload-secret-64-chars-long

# URLs
NEXT_PUBLIC_SERVER_URL=https://cms.smarty-landing.io
NEXT_PUBLIC_SITE_URL=https://smarty-landing.io
NEXT_PUBLIC_CMS_URL=https://cms.smarty-landing.io
NEXT_PUBLIC_URL=https://smarty-landing.io

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Smarty Landing
SMTP_FROM_ADDRESS=noreply@smarty-landing.io

# Traefik
TRAEFIK_DASHBOARD_AUTH=admin:$apr1$xyz...
```

### 2. Secure the File

```bash
chmod 600 /var/www/smarty-landing/.env
chown deploy:deploy /var/www/smarty-landing/.env
```

## Setup Backups

### 1. Create Backup Script

Create `/var/www/smarty-landing/backup-mongo.sh`:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/var/www/smarty-landing/backups/mongo"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${TIMESTAMP}"
RETENTION_DAYS=7

# Create backup
echo "Starting MongoDB backup: ${BACKUP_NAME}"
docker exec mongo mongodump \
  --archive=/backups/${BACKUP_NAME}.archive \
  --gzip \
  --db=smarty-landing

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "Backup completed successfully"

  # Delete old backups
  find ${BACKUP_DIR} -name "backup_*.archive" -mtime +${RETENTION_DAYS} -delete
  echo "Old backups cleaned up (retention: ${RETENTION_DAYS} days)"
else
  echo "Backup failed!"
  exit 1
fi
```

### 2. Make Script Executable

```bash
chmod +x /var/www/smarty-landing/backup-mongo.sh
```

### 3. Setup Cron Job

```bash
# Edit crontab
crontab -e

# Add daily backup at 3 AM
0 3 * * * /var/www/smarty-landing/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1
```

### 4. Test Backup

```bash
/var/www/smarty-landing/backup-mongo.sh
ls -lh /var/www/smarty-landing/backups/mongo/
```

### 5. Restore from Backup (if needed)

```bash
# List available backups
ls -lh /var/www/smarty-landing/backups/mongo/

# Restore specific backup
docker exec mongo mongorestore \
  --archive=/backups/backup_YYYYMMDD_HHMMSS.archive \
  --gzip \
  --drop
```

## Security Hardening

### 1. SSH Security

Edit `/etc/ssh/sshd_config`:

```bash
# Disable root login
PermitRootLogin no

# Disable password authentication
PasswordAuthentication no

# Use SSH keys only
PubkeyAuthentication yes

# Disable empty passwords
PermitEmptyPasswords no

# Change default port (optional)
Port 2222
```

Restart SSH:

```bash
systemctl restart sshd
```

### 2. Install Fail2Ban

```bash
apt install fail2ban -y

# Configure
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit configuration
nano /etc/fail2ban/jail.local
```

Add:

```ini
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[traefik-auth]
enabled = true
port = http,https
filter = traefik-auth
logpath = /var/log/traefik/access.log
maxretry = 5
bantime = 3600
```

Start Fail2Ban:

```bash
systemctl enable fail2ban
systemctl start fail2ban
systemctl status fail2ban
```

### 3. Auto-Updates

```bash
apt install unattended-upgrades -y
dpkg-reconfigure -plow unattended-upgrades
```

### 4. Docker Security

Create `/etc/docker/daemon.json`:

```json
{
  "live-restore": true,
  "userland-proxy": false,
  "no-new-privileges": true,
  "icc": false,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:

```bash
systemctl restart docker
```

## Monitoring

### 1. Install Basic Monitoring Tools

```bash
apt install -y htop ncdu iotop nethogs
```

### 2. Docker Stats

```bash
# Real-time container stats
docker stats

# Disk usage
docker system df

# Check logs
docker logs <container-name> --tail 100 -f
```

### 3. Setup Logging

Create `/etc/logrotate.d/docker`:

```
/var/lib/docker/containers/*/*.log {
  rotate 7
  daily
  compress
  size=10M
  missingok
  delaycompress
  copytruncate
}
```

### 4. Health Check Script

Create `/var/www/smarty-landing/health-check.sh`:

```bash
#!/bin/bash

# Check services
services=("traefik" "mongo" "cms" "web")

for service in "${services[@]}"; do
  if docker ps | grep -q $service; then
    echo "✓ $service is running"
  else
    echo "✗ $service is not running"
    # Send alert (integrate with your notification system)
  fi
done

# Check disk space
disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $disk_usage -gt 80 ]; then
  echo "⚠ Warning: Disk usage is ${disk_usage}%"
fi

# Check memory
mem_usage=$(free | grep Mem | awk '{print ($3/$2) * 100.0}' | cut -d. -f1)
if [ $mem_usage -gt 90 ]; then
  echo "⚠ Warning: Memory usage is ${mem_usage}%"
fi
```

Make executable:

```bash
chmod +x /var/www/smarty-landing/health-check.sh
```

Add to crontab (every 5 minutes):

```bash
*/5 * * * * /var/www/smarty-landing/health-check.sh >> /var/log/health-check.log 2>&1
```

## Verification Checklist

Before proceeding to deployment:

- [ ] Server is updated and secured
- [ ] Firewall is configured
- [ ] Docker is installed and running
- [ ] Directory structure is created
- [ ] MongoDB is running and accessible
- [ ] Database users are created
- [ ] Traefik is configured and running
- [ ] SSL certificates directory is set up
- [ ] Environment variables are configured
- [ ] Backup script is tested and scheduled
- [ ] Security hardening is applied
- [ ] Monitoring is set up
- [ ] DNS records are pointing to server
- [ ] SSH access is secured

## Next Steps

Once the server is set up, proceed to [DEPLOYMENT.md](./DEPLOYMENT.md) to configure CI/CD and deploy your applications.

## Common Issues

### MongoDB Connection Refused

```bash
# Check if MongoDB is running
docker ps | grep mongo

# Check logs
docker logs mongo

# Restart MongoDB
cd /var/www/smarty-landing/mongo
docker compose restart
```

### Traefik Not Generating Certificates

```bash
# Check Traefik logs
docker logs traefik

# Verify DNS is pointing to server
dig smarty-landing.io
dig cms.smarty-landing.io

# Check acme.json permissions
ls -la /var/www/smarty-landing/traefik/letsencrypt/acme.json
# Should be -rw------- (600)
```

### Disk Space Issues

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a
docker volume prune

# Clean old backups
find /var/www/smarty-landing/backups/mongo -mtime +7 -delete
```

## Support

For issues with server setup:

- Check logs: `docker logs <container-name>`
- Review configuration files
- Verify firewall rules: `ufw status`
- Check DNS: `dig your-domain.com`
