#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Setting up deploy environment..."

for env_file in env.traefik.prod env.web.prod; do
  if [ ! -f "$SCRIPT_DIR/$env_file" ]; then
    cp "$SCRIPT_DIR/$env_file.example" "$SCRIPT_DIR/$env_file"
    echo "$env_file created from example — fill in your values"
  else
    echo "$env_file already exists, skipping"
  fi
done

echo ""
echo "Setup complete."
echo ""
echo "Next steps:"
echo "  1. Edit .deploy/env.traefik.prod — set WEB_DOMAIN (host only, no https://)"
echo "  2. Edit .deploy/env.web.prod     — set web public vars"
echo "  3. Run docker compose (see .deploy/README.md)"

