# Deployment

DevPrep IDE, deployed as Docker containers on a single AWS EC2 instance, with
**push-to-`production` auto-deploy** via GitHub Actions.

```
                          ┌─────────────────── EC2 (t3.micro, Docker) ───────────────────┐
  git push production           │                                                              │
      │                   │   caddy  ──/api/*──▶  server (Express)  ──▶  postgres        │
      ▼                   │     │                    ▲                     (volume)       │
  GitHub Actions          │     └──everything else──▶ client (nginx + static React)      │
   ├─ build server image ─┼────────────────────────────────────────────────┐             │
   ├─ build client image ─┼──▶  GHCR (ghcr.io/you/devprep-*)  ◀── docker compose pull    │
   └─ ssh: compose pull + up -d ─────────────────────────────────────────────┘           │
                          └──────────────────────────────────────────────────────────────┘
```

The in-browser **code-execution sandbox is not deployed yet** — it needs the
Docker socket and is added later (see the last section). Everything else — all
courses, DSA problems, question bank, progress, mock interviews — works.

---

## 0. What you need

- The GitHub account you'll push this repo to
- Your AWS account (you already have one, with the ₹-billing UPI method + $100 credit)
- ~40 minutes the first time
- **Optional:** a domain name (for HTTPS). You can go live on the raw IP first.

Cost: a `t3.micro` in Mumbai is about **$8–9/month** if you ever exceed the free
allowance — your **$100 credit covers roughly a year**. Set the budget alert in
step 3 so you're warned before AutoPay ever charges your UPI.

---

## 1. Learn the stack locally first (Docker Desktop)

Do this before touching AWS — it's the same stack, and it's where you'll learn
Docker hands-on.

```bash
cd "D:/Personal Practices/NextJs/devprep-ide"

cp .env.production.example .env.production
```

Edit `.env.production` for local use:

```ini
SITE_ADDRESS=:80
CLIENT_ORIGIN=http://localhost
POSTGRES_PASSWORD=anything-for-local
JWT_ACCESS_SECRET=<run the generator below>
JWT_REFRESH_SECRET=<run it again, different value>
```

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Build and run the whole thing:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up --build
```

Watch what happens: `postgres` starts → `migrate` pushes the schema and seeds →
`server` starts → `client` and `caddy` start. Open **http://localhost**, create
an account, click into the DSA course.

Useful commands while it runs:

```bash
docker compose -f docker-compose.prod.yml ps           # what's running
docker compose -f docker-compose.prod.yml logs -f server
docker compose -f docker-compose.prod.yml down          # stop (keeps the DB volume)
docker compose -f docker-compose.prod.yml down -v       # stop and WIPE the DB
```

When this works locally, the server deploy is basically the same commands on a
remote machine.

---

## 2. Push to GitHub

Already done — the repo is **`JayrajPratapSingh/devlearnings`**, branch
**`production`**. From here on, every deploy is just:

```bash
git add -A && git commit -m "..." && git push
```

Pushing to `production` triggers `.github/workflows/ci.yml` (typecheck + build)
and `.github/workflows/deploy.yml`. The **deploy job fails until step 6** (no
server to SSH into yet) — that's expected.

---

## 3. AWS: budget alert + free-tier check (5 min)

1. **Billing → Payment preferences →** set payment currency to **INR** (clears the warning).
2. **Billing → Budgets → Create budget → "Zero spend budget"** (or set ₹500) →
   enter your email. Free. Emails you the moment a charge is about to land.
3. **Billing → Free Tier** — note whether you have credit-based ($100) or the
   older hours-based tier. Either way, one small instance is fine.

---

## 4. AWS: launch the EC2 instance (10 min)

**EC2 → Launch instance**

| Field | Value |
|---|---|
| Name | `devprep` |
| AMI | **Amazon Linux 2023** (free-tier eligible) |
| Instance type | **t3.micro** (free-tier eligible in ap-south-1) |
| Key pair | **Create new** → name `devprep-key` → **.pem** → download and keep it safe |
| Network → Auto-assign public IP | **Enable** |
| Firewall (security group) | Create new, allow: **SSH 22** from *My IP*; **HTTP 80** from *Anywhere*; **HTTPS 443** from *Anywhere* |
| Storage | 20 GiB gp3 (still free-tier; 30 GiB is the cap) |

Launch. On the instance page, copy the **Public IPv4 address** (e.g. `13.234.56.78`).

**Allocate an Elastic IP** (so the address doesn't change on reboot):
EC2 → Elastic IPs → Allocate → Associate with the `devprep` instance. Use *this*
IP everywhere below.

---

## 5. First-time server setup (10 min)

From your machine (Git Bash), SSH in — replace the path and IP:

```bash
ssh -i ~/Downloads/devprep-key.pem ec2-user@YOUR_ELASTIC_IP
```

(If it complains about key permissions on Windows, run from Git Bash:
`chmod 600 ~/Downloads/devprep-key.pem`.)

On the server, run the setup script (installs Docker, adds swap, clones the repo):

```bash
curl -fsSL https://raw.githubusercontent.com/JayrajPratapSingh/devlearnings/production/deploy/ec2-setup.sh \
  | bash -s -- https://github.com/JayrajPratapSingh/devlearnings.git
```

Then **log out and back in** (`exit`, then SSH again) so the `docker` group applies.

### Configure the environment

```bash
cd /opt/devprep
cp .env.production.example .env.production
nano .env.production
```

Set at least:

```ini
SITE_ADDRESS=:80
CLIENT_ORIGIN=http://YOUR_ELASTIC_IP
POSTGRES_PASSWORD=<long random>
JWT_ACCESS_SECRET=<32-byte hex>
JWT_REFRESH_SECRET=<different 32-byte hex>
```

Generate secrets right on the box: `openssl rand -hex 32`

### Log in to GHCR (so the server can pull your private images)

Create a token: GitHub → Settings → Developer settings → **Personal access
tokens → Tokens (classic)** → Generate → scope **`read:packages`** → copy it.

```bash
echo 'YOUR_PAT' | docker login ghcr.io -u YOUR-GITHUB-USERNAME --password-stdin
```

### First deploy — build on the box this one time

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Give it a few minutes (1 GB RAM builds slowly — the swap covers it). Then:

```bash
curl -s localhost/health          # {"ok":true,...}
docker compose -f docker-compose.prod.yml ps
```

Open **http://YOUR_ELASTIC_IP** in a browser. You're live.

---

## 6. Wire up auto-deploy (5 min)

In your GitHub repo → **Settings → Secrets and variables → Actions → New
repository secret**, add:

| Secret | Value |
|---|---|
| `SSH_HOST` | your Elastic IP |
| `SSH_USER` | `ec2-user` |
| `SSH_KEY` | the **entire contents** of `devprep-key.pem` (including the BEGIN/END lines) |

Now every push to `production`:

1. CI typechecks and builds all three workspaces
2. `deploy.yml` builds the `server` + `client` images and pushes them to GHCR
3. It SSHes into the box, `git pull`s, `docker compose pull`, `up -d`

Test it: make a trivial change, `git push`, watch **Actions** tab. The site
updates in ~2–4 minutes.

> The `migrate` service re-runs `prisma db push` + the seed on every deploy, so
> content and schema changes ship automatically. It's idempotent and never
> touches user data.

---

## 7. Backups (5 min)

On the server:

```bash
chmod +x /opt/devprep/deploy/backup.sh
crontab -e
```

Add:

```
0 2 * * *  /opt/devprep/deploy/backup.sh >> /var/log/devprep-backup.log 2>&1
```

That dumps Postgres nightly to `/opt/devprep/backups/`, keeping 14 days.

**To also copy to S3** (recommended — survives the instance dying):

1. S3 → create a bucket, e.g. `devprep-backups-yourname` (block all public access)
2. IAM → attach an instance role to the EC2 with `s3:PutObject` on that bucket,
   *or* run `aws configure` on the box with an access key
3. `echo 'S3_BUCKET=s3://devprep-backups-yourname' | sudo tee -a /etc/environment`

**Restore:**

```bash
gunzip -c backups/devprep-2026-08-29.sql.gz | \
  docker compose -f docker-compose.prod.yml exec -T postgres psql -U devprep -d devprep
```

That's the practical "replica" for a personal project — cheaper and more useful
than a live standby. Add a real read-replica later only if you actually need one.

---

## 8. Add a domain + HTTPS (later, 10 min)

1. Buy a domain (or use one you own). In its DNS, add an **A record**:
   `devprep.yourdomain.com  →  YOUR_ELASTIC_IP`
2. On the server, edit `/opt/devprep/.env.production`:
   ```ini
   SITE_ADDRESS=devprep.yourdomain.com
   CLIENT_ORIGIN=https://devprep.yourdomain.com
   ACME_EMAIL=you@realmail.com
   ```
3. ```bash
   cd /opt/devprep
   docker compose --env-file .env.production -f docker-compose.prod.yml up -d
   ```
4. Caddy fetches a Let's Encrypt certificate automatically within a minute.
   Visit **https://devprep.yourdomain.com**.

No cert renewal to manage — Caddy handles it.

---

## 9. Adding the code-execution sandbox (later)

The `execution-service` runs untrusted code by starting **sibling Docker
containers** via the host's Docker socket. To add it:

1. Build its runner images on the box:
   `cd /opt/devprep && npm --workspace @devprep/execution-service run images:build`
   (or add a compose service that does it)
2. Add an `execution-service` block to `docker-compose.prod.yml` that mounts
   `/var/run/docker.sock` and set `SANDBOX_DRIVER=docker`
3. Set `EXECUTION_SERVICE_TOKEN` (same value) for both `server` and
   `execution-service` in `.env.production`
4. `t3.micro` (1 GB) is tight for this — consider bumping to `t3.small` (2 GB,
   ~$17/mo) before enabling it, or cap `MAX_CONCURRENT_EXECUTIONS=1`

This is deliberately deferred so you can get everything else live now.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Deploy job: `permission denied (publickey)` | `SSH_KEY` secret must be the full `.pem` including BEGIN/END lines; `SSH_USER` is `ec2-user` on Amazon Linux |
| `docker compose pull` → `denied` on the server | `docker login ghcr.io` with a PAT that has `read:packages` |
| Site loads but API calls 502 | `docker compose logs server` — usually a bad value in `.env.production` (the server refuses to boot on invalid config) |
| `migrate` exits with a Postgres connection error | `postgres` wasn't healthy yet; `docker compose up -d` again — it retries. Check `docker compose logs postgres` |
| Build killed / OOM on the box | Confirm swap is on: `swapon --show`. Or let GitHub Actions build (don't use `--build` on the server after the first time) |
| Out of disk | `docker system prune -af` and check `backups/` size |
| Forgot a password in-app | `docker compose exec server node dist/../scripts/...` — or just re-register; it's your instance |

**Logs:** `docker compose -f /opt/devprep/docker-compose.prod.yml logs -f [service]`
