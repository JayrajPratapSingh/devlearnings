#!/usr/bin/env bash
# One-time setup for a fresh EC2 instance (Amazon Linux 2023 or Ubuntu).
#
#   1. SSH in:   ssh -i your-key.pem ec2-user@<PUBLIC_IP>     (ubuntu@ on Ubuntu)
#   2. Run:      curl -fsSL https://raw.githubusercontent.com/<you>/devprep-ide/main/deploy/ec2-setup.sh | bash -s -- https://github.com/<you>/devprep-ide.git
#      (or copy this file over and: bash ec2-setup.sh <repo-url>)
#
# After it finishes: log out and back in (so the docker group applies), then
# follow DEPLOYMENT.md from "Configure the environment".
set -euo pipefail

REPO_URL="${1:-}"
APP_DIR="/opt/devprep"

if [[ -z "$REPO_URL" ]]; then
  echo "usage: bash ec2-setup.sh <git-repo-url>" >&2
  exit 1
fi

echo "==> Installing Docker"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"

echo "==> Ensuring the compose plugin is present"
docker compose version >/dev/null 2>&1 || {
  sudo mkdir -p /usr/local/lib/docker/cli-plugins
  ARCH="$(uname -m)"; [[ "$ARCH" == "aarch64" ]] && ARCH="aarch64" || ARCH="x86_64"
  sudo curl -fsSL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-${ARCH}" \
    -o /usr/local/lib/docker/cli-plugins/docker-compose
  sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
}

echo "==> Adding 2 GB swap (t3.micro has only 1 GB RAM)"
if [[ ! -f /swapfile ]]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo "==> Cloning the repo to $APP_DIR"
sudo mkdir -p "$APP_DIR"
sudo chown "$USER:$USER" "$APP_DIR"
if [[ -d "$APP_DIR/.git" ]]; then
  git -C "$APP_DIR" pull --ff-only
else
  git clone "$REPO_URL" "$APP_DIR"
fi

echo
echo "==> Done. Next steps:"
echo "   1. Log out and back in (applies the 'docker' group)."
echo "   2. cd $APP_DIR"
echo "   3. cp .env.production.example .env.production   &&   edit it"
echo "   4. docker login ghcr.io    (username = your GitHub name, password = a PAT with read:packages)"
echo "   5. First deploy will happen automatically on your next push to main,"
echo "      or run it now:  docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build"
