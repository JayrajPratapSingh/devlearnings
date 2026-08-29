#!/usr/bin/env bash
# Nightly Postgres backup -> local file (+ optional S3 upload).
#
# Install as a cron job on the server:
#   crontab -e
#   0 2 * * *  /opt/devprep/deploy/backup.sh >> /var/log/devprep-backup.log 2>&1
#
# Restore a dump:
#   gunzip -c devprep-YYYY-MM-DD.sql.gz | \
#     docker compose -f /opt/devprep/docker-compose.prod.yml exec -T postgres \
#       psql -U devprep -d devprep
set -euo pipefail

APP_DIR="/opt/devprep"
BACKUP_DIR="$APP_DIR/backups"
KEEP_DAYS=14
STAMP="$(date +%F)"
FILE="$BACKUP_DIR/devprep-$STAMP.sql.gz"

# Optional: set these (e.g. in /etc/environment) to also push to S3.
#   S3_BUCKET=s3://your-bucket/devprep-backups
S3_BUCKET="${S3_BUCKET:-}"

mkdir -p "$BACKUP_DIR"

# shellcheck disable=SC1091
set -a; source "$APP_DIR/.env.production"; set +a

echo "[$(date -Is)] dumping database -> $FILE"
docker compose --env-file "$APP_DIR/.env.production" \
  -f "$APP_DIR/docker-compose.prod.yml" exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --clean --if-exists \
  | gzip > "$FILE"

echo "[$(date -Is)] pruning local backups older than $KEEP_DAYS days"
find "$BACKUP_DIR" -name 'devprep-*.sql.gz' -mtime "+$KEEP_DAYS" -delete

if [[ -n "$S3_BUCKET" ]] && command -v aws >/dev/null 2>&1; then
  echo "[$(date -Is)] uploading to $S3_BUCKET"
  aws s3 cp "$FILE" "$S3_BUCKET/"
fi

echo "[$(date -Is)] backup complete"
