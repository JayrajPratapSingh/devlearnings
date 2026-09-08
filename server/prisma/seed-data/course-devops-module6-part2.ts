/**
 * DevOps Complete Course — Module 6: Docker Compose & Single-Host Deployment, lessons 4-6.
 *
 * Lesson 4: Volumes, persistence & backup — named volumes vs bind mounts vs tmpfs,
 *           what survives `down` vs `down -v`, backing up and restoring a volume.
 *           VERIFIED against a real `docker compose`.
 * Lesson 5: A real single-host production stack — Caddy + app + Postgres, network
 *           segmentation, resource limits, restart, logging. VERIFIED.
 * Lesson 6: Operating it & when you've outgrown Compose — the lifecycle commands,
 *           the deploy loop, `--scale`, and the hard limits of one host. VERIFIED +
 *           prose for the multi-host boundary.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_6_PART2: CourseLesson[] = [
  {
    slug: 'ops-compose-volumes-persistence-and-backup',
    title: 'Volumes, Persistence & Backup',
    titleHi: 'Volumes, Persistence Aur Backup',
    description: 'A container\'s own filesystem is thrown away when the container is removed, so anything that must survive — a database\'s data, uploaded files — lives in a volume. Named volumes are Docker-managed and portable; bind mounts map a host directory in; and neither is a backup, which you take by streaming the volume through a throwaway container.',
    descriptionHi: 'Ek container ki apni filesystem tab thrown away hoti hai jab container remove hota hai, to jo kuch survive karna chahiye — ek database ka data, uploaded files — ek volume mein rehta hai. Named volumes Docker-managed aur portable hain; bind mounts ek host directory ko map karte hain; aur na hi ek backup hai, jise aap ek volume ko ek throwaway container ke through stream karke lete ho.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A hotel room versus the safe bolted to its floor.** The room (the container\'s writable layer) is made up fresh for every guest — anything you leave on the desk is gone at checkout. The safe (a volume) is attached to the building, not the room: change guests, redecorate the room, even knock it down and rebuild it, and the safe\'s contents stay. But the safe is still *in the building*: if the building burns down (the disk fails, or someone runs `down -v`), the safe goes with it. A backup is taking the contents of the safe *out of the building* to a different location entirely — which is a separate deliberate act, not something the safe does for you.',
      hi: '**Ek hotel room versus iske floor par bolted safe.** Room (container ki writable layer) har guest ke liye fresh banaya jaata hai — jo kuch aap desk par chhodte ho wo checkout par gone hai. Safe (ek volume) building se attached hai, room se nahi: guests badlo, room redecorate karo, even ise knock down karke rebuild karo, aur safe ke contents stay karte hain. Par safe abhi bhi *building mein* hai: agar building jal jaati hai (disk fail hoti hai, ya koi `down -v` chalata hai), safe iske saath jaata hai. Ek backup safe ke contents ko *building ke bahar* ek poori tarah alag location par le jaana hai — ek separate deliberate act.',
    },

    simple: `**A CONTAINER'S FILESYSTEM IS DISPOSABLE.** The thin writable layer is deleted with the
container. Anything that must outlive a container -> a VOLUME.

**THREE mount types:**
\`\`\`
NAMED VOLUME    volumes: [ "pgdata:/var/lib/postgresql/data" ]   + top-level  volumes: { pgdata: }
               - Docker-managed storage under /var/lib/docker/volumes/<project>_pgdata
               - survives 'down', recreation, image updates. deleted only by 'down -v' / 'volume rm'
               - portable, backup-able, the DEFAULT choice for app data (DB, uploads)

BIND MOUNT     volumes: [ "./config:/etc/app:ro" ]  or  [ "/opt/data:/data" ]
               - maps an EXACT host path into the container. you manage it.
               - great for: config files IN, source code IN (dev live-reload), host logs OUT
               - fragile for data: tied to one host's layout, permission/uid mismatches,
                 slow on macOS/Windows (it crosses the VM boundary)

TMPFS          tmpfs: [ /tmp ]   or   volumes: [ "type=tmpfs,target=/cache" ]
               - RAM-backed, nothing written to disk, gone when the container stops
               - for scratch space / secrets you don't want on disk
\`\`\`

**LONG-FORM mount syntax (clearer, more options):**
\`\`\`yaml
volumes:
  - type: volume
    source: pgdata
    target: /var/lib/postgresql/data
  - type: bind
    source: ./nginx.conf
    target: /etc/nginx/nginx.conf
    read_only: true
\`\`\`

**WHAT SURVIVES WHAT:**
\`\`\`
container crash / restart          -> volume data: KEPT
docker compose down                -> volume data: KEPT   (containers + network removed)
docker compose down -v             -> volume data: DELETED  <-- the DATA-LOSS command
docker compose up (image changed)  -> volume data: KEPT   (container recreated, volume re-attached)
disk failure / VM reset            -> volume data: GONE  (it lives on that one disk)
\`\`\`

**A VOLUME IS NOT A BACKUP.** It is on one disk, on one host, deletable by one flag.
Back it up by mounting it into a throwaway container and streaming it out:
\`\`\`bash
# backup:  tar the volume's contents to an archive
docker run --rm -v myproj_pgdata:/data:ro -v "$PWD":/backup alpine \\
  tar czf /backup/pgdata-$(date +%F).tgz -C /data .

# restore:  wipe + untar into the volume
docker run --rm -v myproj_pgdata:/data -v "$PWD":/backup alpine \\
  sh -c 'rm -rf /data/* && tar xzf /backup/pgdata-2026-09-08.tgz -C /data'
\`\`\`
For a database, prefer a DB-native dump (\`pg_dump\`, \`mysqldump\`) — consistent, portable
across versions. A raw volume tar of a *running* database can be inconsistent.

**AND: test the restore.** A backup you have never restored is a hope, not a backup.`,

    simpleHi: `**EK CONTAINER KI FILESYSTEM DISPOSABLE HAI.** Thin writable layer container ke saath deleted.
Jo kuch ek container ko outlive karna chahiye -> ek VOLUME.

**TEEN mount types:**
\`\`\`
NAMED VOLUME    volumes: [ "pgdata:/var/lib/postgresql/data" ]   + top-level  volumes: { pgdata: }
               - Docker-managed storage. 'down' survive karta hai. sirf 'down -v' se deleted.
               - portable, backup-able, app data ke liye DEFAULT choice

BIND MOUNT     volumes: [ "./config:/etc/app:ro" ]
               - ek EXACT host path ko container mein map karta hai. aap manage karte ho.
               - config files IN, source code IN (dev), host logs OUT ke liye great
               - data ke liye fragile: ek host ke layout se tied, permission mismatches, macOS/Windows par slow

TMPFS          tmpfs: [ /tmp ]
               - RAM-backed, disk par kuch nahi, container stop hone par gone
\`\`\`

**KYA KYA SURVIVE KARTA HAI:**
\`\`\`
container crash / restart          -> volume data: KEPT
docker compose down                -> volume data: KEPT
docker compose down -v             -> volume data: DELETED  <-- DATA-LOSS command
docker compose up (image changed)  -> volume data: KEPT
disk failure / VM reset            -> volume data: GONE
\`\`\`

**EK VOLUME EK BACKUP NAHI HAI.** Ye ek disk par, ek host par, ek flag se deletable hai.
Ise ek throwaway container mein mount karke stream out karke back up karo:
\`\`\`bash
docker run --rm -v myproj_pgdata:/data:ro -v "$PWD":/backup alpine \\
  tar czf /backup/pgdata-$(date +%F).tgz -C /data .
\`\`\`
Ek database ke liye, ek DB-native dump prefer karo (\`pg_dump\`, \`mysqldump\`) — consistent.

**AUR: restore test karo.** Ek backup jo aapne kabhi restore nahi kiya ek hope hai, ek backup nahi.`,

    content: `## The container filesystem is disposable

A container is the image's read-only layers plus one thin writable layer on top (Module 5). Everything the process writes — logs, temp files, and, if you are not careful, your database's data files — goes into that writable layer, and the writable layer is **deleted when the container is removed**. Containers are removed constantly: every image update, every config change, every \`docker compose down\`. So the rule is: **anything that must survive a container's removal goes in a volume, never in the container's filesystem.**

## Three ways to mount storage

### Named volume

\`\`\`yaml
services:
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
\`\`\`

A **named volume** is storage Docker creates and manages, stored under Docker's own directory on the host (\`/var/lib/docker/volumes/<project>_pgdata/_data\` on Linux). You declare it under the top-level \`volumes:\` key and mount it into a service. Its lifecycle is independent of any container: it survives container recreation, image updates, and \`docker compose down\`; it is deleted only by \`docker compose down -v\`, \`docker volume rm\`, or \`docker volume prune\`. This is the **default choice for application data** — a database's data directory, a user-uploads directory, anything the app must not lose.

### Bind mount

\`\`\`yaml
volumes:
  - ./nginx.conf:/etc/nginx/nginx.conf:ro     # a config file IN, read-only
  - ./src:/app/src                            # source IN, for dev live-reload
  - /var/log/myapp:/app/logs                  # logs OUT to a known host path
\`\`\`

A **bind mount** maps a **specific path on the host** into the container. You manage the host path entirely; Docker just mounts it. Bind mounts are ideal for **injecting** configuration files, for mounting **source code** into a dev container so edits are picked up without rebuilding, and for writing **logs** to a host location. They are a poor choice for primary data: the path is tied to one host's directory layout so the stack is not portable, the user and group IDs inside the container may not match the host's file ownership, and on macOS and Windows every read and write crosses the Docker VM boundary and is markedly slower.

### tmpfs

\`\`\`yaml
services:
  app:
    tmpfs:
      - /tmp
      - /run
\`\`\`

A **tmpfs mount** is backed by RAM. Nothing is written to disk, and the contents vanish when the container stops. Use it for scratch space that should be fast and ephemeral, or for sensitive material you do not want to hit disk.

### Long form

The list-of-strings syntax (\`"source:target:options"\`) is terse but limited. The long form is clearer and exposes more options:

\`\`\`yaml
volumes:
  - type: volume
    source: pgdata
    target: /var/lib/postgresql/data
  - type: bind
    source: ./nginx.conf
    target: /etc/nginx/nginx.conf
    read_only: true
  - type: tmpfs
    target: /cache
    tmpfs: { size: 100000000 }
\`\`\`

## What survives what

| Event | Named volume data |
|---|---|
| Container crashes / is restarted | **kept** |
| Container is recreated (image or config changed) | **kept** — the new container re-attaches the same volume |
| \`docker compose down\` | **kept** — containers and the network are removed, volumes are not |
| \`docker compose down -v\` | **DELETED** — this is the data-loss command |
| \`docker volume rm\` / \`docker volume prune\` | **DELETED** |
| The host's disk fails, or the Docker VM is reset | **gone** — the volume lives on that one disk |

The one to internalise: \`docker compose down\` is safe for data, \`docker compose down -v\` is not. The \`-v\` flag is convenient in local development to reset to a clean state, and catastrophic if run against a production stack out of habit.

## A volume is not a backup

A volume protects data from container churn. It does **not** protect it from:

- the disk it sits on failing;
- someone running \`down -v\` or \`volume prune\`;
- a bad migration or an application bug corrupting the data;
- ransomware or a compromised host.

For that you need a **backup**: a copy of the data somewhere else — another disk, another host, object storage — taken on a schedule and retained.

### Backing up a raw volume

Mount the volume into a short-lived container that does nothing but archive it:

\`\`\`bash
docker run --rm \\
  -v myproj_pgdata:/data:ro \\
  -v "$PWD/backups":/backup \\
  alpine:3.20 \\
  tar czf /backup/pgdata-$(date +%F).tgz -C /data .
\`\`\`

Restore reverses it:

\`\`\`bash
docker compose stop db
docker run --rm -v myproj_pgdata:/data -v "$PWD/backups":/backup alpine:3.20 \\
  sh -c 'rm -rf /data/* && tar xzf /backup/pgdata-2026-09-08.tgz -C /data'
docker compose start db
\`\`\`

### For a database, prefer a native dump

A raw filesystem copy of a **running** database can be internally inconsistent — a page half-written, a transaction in flight. Databases provide a consistent export instead: \`pg_dump\` / \`pg_dumpall\` for PostgreSQL, \`mysqldump\` for MySQL, \`mongodump\` for MongoDB. Run it against the running service:

\`\`\`bash
docker compose exec -T db pg_dump -U postgres appdb | gzip > backup-$(date +%F).sql.gz
\`\`\`

A native dump is also portable across storage-engine and even major-version changes, which a raw data-directory copy is not.

### Test the restore

The single most important thing about backups: **a backup you have never restored is not a backup, it is a hope.** Backup jobs fail silently, archives get corrupted, the restore procedure has a step nobody remembers. Restore your backup into a scratch environment on a schedule — monthly at least — and confirm the data is intact. A restore drill that fails on a Tuesday afternoon is a finding; one that fails during an incident is a disaster.`,

    contentHi: `## Container filesystem disposable hai

Ek container image ki read-only layers plus upar ek thin writable layer hai (Module 5). Jo kuch process likhta hai wo us writable layer mein jaata hai, aur writable layer **tab deleted hoti hai jab container remove hota hai**. Containers constantly remove hote hain. To rule: **jo kuch ek container ke removal ko survive karna chahiye ek volume mein jaata hai, kabhi container ki filesystem mein nahi.**

## Storage mount karne ke teen tarike

**Named volume** — storage jo Docker banata aur manage karta hai. Iska lifecycle kisi container se independent hai: ye container recreation, image updates, aur \`docker compose down\` survive karta hai; sirf \`docker compose down -v\` se deleted. **Application data ke liye default choice.**

**Bind mount** — **host par ek specific path** ko container mein map karta hai. Configuration files **inject** karne ke liye ideal, ek dev container mein **source code** mount karne ke liye, aur **logs** ek host location par likhne ke liye. Primary data ke liye poor choice: path ek host ke layout se tied, uid mismatches, macOS/Windows par slow.

**tmpfs mount** — RAM se backed. Disk par kuch nahi likha, contents container stop hone par vanish. Fast aur ephemeral scratch space ke liye.

## Kya kya survive karta hai

- Container crash / recreate / \`docker compose down\` → volume data **KEPT**.
- \`docker compose down -v\` → **DELETED** (ye data-loss command hai).
- Host ki disk fail hoti hai → **gone**.

\`docker compose down\` data ke liye safe hai, \`docker compose down -v\` nahi.

## Ek volume ek backup nahi hai

Ek volume data ko container churn se protect karta hai. Ye ise disk fail hone se, koi \`down -v\` chalane se, ek bad migration se, ransomware se protect **nahi** karta. Uske liye aapko ek **backup** chahiye: data ki ek copy kahin aur.

**Ek raw volume back up karna:** volume ko ek short-lived container mein mount karo jo ise archive karne ke alawa kuch nahi karta.

**Ek database ke liye, ek native dump prefer karo:** ek **running** database ki ek raw filesystem copy internally inconsistent ho sakti hai. Databases ek consistent export provide karte hain: \`pg_dump\`, \`mysqldump\`, \`mongodump\`.

**Restore test karo:** backups ke baare mein sabse important cheez: **ek backup jo aapne kabhi restore nahi kiya ek backup nahi hai, ek hope hai.** Apna backup ek scratch environment mein ek schedule par restore karo — kam se kam monthly.`,

    examples: [
      {
        title: 'A named volume survives `down`, is wiped by `down -v`',
        titleHi: 'Ek named volume `down` survive karta hai, `down -v` se wiped',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > compose.yaml <<'EOF'
name: persist
services:
  db:
    image: alpine:3.20
    command: ["sh", "-c", "date +%s >> /var/lib/db/log; sleep 300"]
    volumes: [ "dbdata:/var/lib/db" ]
volumes:
  dbdata:
EOF

docker compose up -d >/dev/null 2>&1
echo "rows after first start:                $(docker compose exec -T db sh -c 'wc -l < /var/lib/db/log' | tr -d ' ')"

docker compose down >/dev/null 2>&1        # NOTE: no -v
docker compose up -d >/dev/null 2>&1
echo "rows after 'down' + 'up' (volume kept):  $(docker compose exec -T db sh -c 'wc -l < /var/lib/db/log' | tr -d ' ')"

docker compose down -v >/dev/null 2>&1     # NOTE: -v
docker compose up -d >/dev/null 2>&1
echo "rows after 'down -v' + 'up' (wiped):     $(docker compose exec -T db sh -c 'wc -l < /var/lib/db/log' | tr -d ' ')"
docker compose down -v >/dev/null 2>&1 || true`,
        output: `rows after first start:                1
rows after 'down' + 'up' (volume kept):  2
rows after 'down -v' + 'up' (wiped):     1`,
        explain: 'The service appends a line to a file inside a named volume every time it starts. After the first start the file has one line. Running down without the volume flag removes the container and the network but leaves the volume, so bringing the stack up again attaches the same volume to a fresh container, the start-up append adds a second line, and the count is two — the earlier data survived the teardown. Running down with the volume flag deletes the named volume along with the containers, so the next up creates a brand-new empty volume, the append writes the first line again, and the count is back to one. This is the practical meaning of the volume flag: it is the difference between resetting a local stack to a clean state and destroying production data. Because the two commands differ by three characters and the destructive one is a common habit from local development, running down with the volume flag against a real deployment is a recurring cause of data-loss incidents.',
        explainHi: 'Service har baar start hone par ek named volume ke andar ek file mein ek line append karti hai. Pehle start ke baad file mein ek line hai. down ko volume flag ke bina chalana container aur network remove karta hai par volume chhodta hai, to stack ko phir up karna wahi volume ek fresh container se attach karta hai, start-up append ek doosri line add karta hai, aur count do hai — earlier data teardown survive kiya. down ko volume flag ke saath chalana named volume ko containers ke saath delete karta hai, to agla up ek brand-new empty volume banata hai, append pehli line phir likhta hai, aur count wapas ek hai. Ye volume flag ka practical meaning hai: ye ek local stack ko clean state mein reset karne aur production data destroy karne ke beech ka difference hai.',
      },
      {
        title: 'Back up and restore a volume with a throwaway container',
        titleHi: 'Ek throwaway container se ek volume back up aur restore karo',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > compose.yaml <<'EOF'
name: bkp
services:
  db:
    image: alpine:3.20
    command: ["sleep", "300"]
    volumes: [ "pgdata:/var/lib/db" ]
volumes:
  pgdata:
EOF
docker volume create bkp_archive >/dev/null
docker compose up -d >/dev/null 2>&1
docker compose exec -T db sh -c 'echo IMPORTANT-ROW > /var/lib/db/table.dat'

# BACKUP: stream the volume into a tar inside a separate archive volume
docker run --rm -v bkp_pgdata:/src:ro -v bkp_archive:/arc alpine:3.20 \\
  tar czf /arc/pgdata.tgz -C /src .
echo "archive contents: $(docker run --rm -v bkp_archive:/arc alpine:3.20 tar tzf /arc/pgdata.tgz | tr '\\n' ' ')"

# DATA LOSS
docker compose down -v >/dev/null 2>&1
docker compose up -d >/dev/null 2>&1
echo "after 'down -v' + 'up':  $(docker compose exec -T db sh -c 'cat /var/lib/db/table.dat 2>/dev/null || echo DATA-GONE')"

# RESTORE: untar the archive back into the (new, empty) volume
docker run --rm -v bkp_pgdata:/src -v bkp_archive:/arc:ro alpine:3.20 \\
  tar xzf /arc/pgdata.tgz -C /src
echo "after restore:           $(docker compose exec -T db sh -c 'cat /var/lib/db/table.dat')"
docker compose down -v >/dev/null 2>&1 || true
docker volume rm bkp_archive >/dev/null 2>&1 || true`,
        output: `archive contents: ./ ./table.dat
after 'down -v' + 'up':  DATA-GONE
after restore:           IMPORTANT-ROW`,
        explain: 'A separate, long-lived archive volume is created to hold backups. The database service writes a row into its data volume. The backup step runs a short-lived container that mounts the data volume read-only and the archive volume writable, and does nothing but create a compressed tar of the data volume\'s contents inside the archive volume; listing the tar confirms it captured the file. The data is then deliberately destroyed by tearing the stack down with the volume flag and bringing it back up, which produces a fresh empty data volume — the row is gone. The restore step runs another short-lived container that mounts the new data volume writable and the archive volume read-only, and extracts the tar back into the data volume; the row is present again. The pattern is that neither the backup nor the restore involves the database service itself or any tool inside its image — a generic small image with tar is enough, because a Docker volume is just a directory that any container can mount. For a database in particular a logical dump taken through the database\'s own tools is preferable for consistency, but the volume-tar pattern is the general mechanism for any volume, and the archive must be copied off the host to be a real backup.',
        explainHi: 'Backups rakhne ke liye ek separate, long-lived archive volume banaya jaata hai. Database service apne data volume mein ek row likhti hai. Backup step ek short-lived container chalata hai jo data volume ko read-only aur archive volume ko writable mount karta hai, aur data volume ke contents ka ek compressed tar archive volume ke andar banane ke alawa kuch nahi karta. Data phir deliberately destroy hota hai stack ko volume flag ke saath tear down karke aur wapas up karke. Restore step ek doosra short-lived container chalata hai jo new data volume ko writable aur archive volume ko read-only mount karta hai, aur tar ko wapas data volume mein extract karta hai; row phir present hai. Pattern ye hai ki na backup na restore database service khud ya iski image ke andar kisi tool ko involve karta hai — tar wali ek generic small image kaafi hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a database with NO volume — data in the container's writable layer
services:
  db:
    image: postgres:16
    environment: { POSTGRES_PASSWORD: x }
    # (no volumes:)
# -> works fine... until the first 'docker compose down', or image update, or
//    'docker compose up --force-recreate'. the container is replaced, the
//    writable layer is discarded, and every row is gone. silently.`,
        right: `services:
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_PASSWORD_FILE: /run/secrets/db_pw }
    volumes:
      - pgdata:/var/lib/postgresql/data     # <- the EXACT path the image writes to
volumes:
  pgdata:
# check the image's docs / Dockerfile for WHERE it stores data (VOLUME instruction).
# then: a scheduled 'pg_dump' to off-host storage, and a tested restore.`,
        why: 'A container stores everything it writes in a writable layer that exists only for the life of that container instance, and a database service with no volume mounted at its data directory keeps its entire dataset there. Nothing looks wrong while the container runs, and simple testing does not reveal the problem. But the container is replaced whenever the stack is torn down, whenever the image is updated, and whenever a recreate is forced, and each of those discards the writable layer and everything in it. The dataset is lost with no error, because from the database\'s point of view it simply started with an empty data directory. The fix is to mount a named volume at exactly the path the database image writes its data to, which the image\'s documentation or its Dockerfile\'s VOLUME instruction identifies, so that the data lives independently of any container. Separately, because a volume is still only local storage on one host, a real deployment also needs scheduled logical dumps copied to storage elsewhere and a restore procedure that has been tested.',
        whyHi: 'Ek container jo kuch likhta hai wo ek writable layer mein store karta hai jo sirf us container instance ke life ke liye exist karta hai, aur bina ek volume ke ek database service apna poora dataset wahan rakhti hai. Kuch galat nahi dikhta jabki container chalta hai. Par container replace hota hai jab bhi stack tear down hota hai, jab bhi image update hoti hai. Dataset bina ek error ke lost ho jaata hai. Fix exactly us path par ek named volume mount karna hai jahan database image apna data likhti hai. Alag se, kyunki ek volume abhi bhi sirf ek host par local storage hai, ek real deployment ko scheduled logical dumps kahin aur copy chahiye aur ek restore procedure jo tested hai.',
      },
      {
        wrong: `# 'docker compose down -v' out of muscle memory on a prod host
$ ssh prod
$ cd /opt/myapp
$ docker compose down -v && docker compose up -d     # <- "restart the stack"
# -> the '-v' just deleted the postgres volume, the redis volume, and the
//    uploads volume. 'up -d' starts a stack with three empty volumes.
//    the database re-runs initdb. every customer's data is gone.`,
        right: `# to restart a stack, you NEVER need -v:
$ docker compose down && docker compose up -d       # or:
$ docker compose restart                            # or:
$ docker compose up -d --force-recreate
# '-v' is a LOCAL-DEV reset. on a prod host, treat it like 'rm -rf /var/lib':
#   - don't type it from memory
#   - a wrapper script that refuses -v outside dev, or 'external: true' volumes
//     (compose won't delete a volume it didn't create)`,
        why: 'The volume flag on the down command deletes every named volume the project defined, in addition to removing the containers and network. In local development this is a useful way to return to a completely clean state, and it becomes a reflex. Run with that reflex against a production stack, the flag destroys the database volume, any cache volume, and any uploads volume in a single command, and the following up recreates the stack with empty volumes, so the database initialises from scratch and all persistent data is gone. Restarting a stack never requires the flag: down without it followed by up, or the restart subcommand, or up with force-recreate, all restart the services while leaving volumes intact. The safeguards are to not type the destructive form from memory on a server, to use a wrapper that rejects the flag outside development, and to declare production volumes as external, which are volumes Compose references but did not create and therefore will not delete.',
        whyHi: 'down command par volume flag har named volume delete karta hai jo project ne define kiya, containers aur network remove karne ke alawa. Local development mein ye ek completely clean state par wapas jaane ka ek useful tarika hai, aur ye ek reflex ban jaata hai. Us reflex ke saath ek production stack par chalao, flag database volume, koi cache volume, aur koi uploads volume ko ek single command mein destroy karta hai, aur following up stack ko empty volumes ke saath recreate karta hai. Ek stack restart karne ko kabhi flag ki zaroorat nahi. Safeguards ek server par destructive form ko memory se type na karna hai, ek wrapper use karna jo flag ko development ke bahar reject karta hai, aur production volumes ko external declare karna.',
      },
      {
        wrong: `# "we have volumes, so the data is safe" — no off-host backup, no restore test
# 14 months in: the cloud VM's disk has a hardware fault. the volume is on it.
# there is a nightly 'tar' cron... writing to ANOTHER directory ON THE SAME DISK.
# and nobody has ever restored it. it turns out the cron broke 4 months ago
//   (disk full) and was writing 0-byte files.`,
        right: `# a real backup is: OFF the host, TESTED, and MONITORED.
#   - stream 'pg_dump' (consistent) to object storage (S3/GCS/B2), nightly + retention
#   - or 'docker run ... tar ... | aws s3 cp - s3://...'  for non-DB volumes
#   - ALERT if a backup job fails or the latest archive is older than N hours / too small
#   - RESTORE into a scratch env monthly and diff a known row. put it on the calendar.
# backup ≠ replica: a replica faithfully copies your corruption/DROP TABLE too.`,
        why: 'A volume keeps data across container churn but provides no protection against the loss of the disk it occupies, against accidental or malicious deletion, or against the data being corrupted by a bug or a bad migration. Treating volumes as sufficient leads to a backup arrangement that is not really a backup: an archive written to another location on the same disk fails with the disk, a job that has never been exercised may have silently stopped working long ago, and an archive nobody has restored may be unusable when it is finally needed. A real backup is stored on separate infrastructure entirely, ideally in object storage in another location; it is monitored, with an alert when a run fails or the newest archive is too old or implausibly small; and it is restored on a schedule into a throwaway environment where the contents are verified, so the restore procedure and the archives are both known to work before an emergency. A replica of the database is not a substitute, because a replica copies every change faithfully, including the accidental deletion or corruption you would need the backup to recover from.',
        whyHi: 'Ek volume data ko container churn ke across rakhta hai par us disk ke loss ke against koi protection nahi deta jise ye occupy karta hai, accidental ya malicious deletion ke against, ya data ke ek bug se corrupt hone ke against. Volumes ko sufficient treat karna ek backup arrangement ki taraf le jaata hai jo really ek backup nahi hai: usi disk par ek doosri location par likha ek archive disk ke saath fail hota hai, ek job jo kabhi exercise nahi hui silently kaam karna band kar sakti hai. Ek real backup poori tarah separate infrastructure par store hota hai; ye monitored hai; aur ye ek schedule par ek throwaway environment mein restore hota hai. Database ka ek replica ek substitute nahi hai, kyunki ek replica har change faithfully copy karta hai, accidental deletion include.',
      },
    ],

    realWorld: [
      {
        en: '**A Postgres service that ran for months, then lost everything on a routine image bump** — no `volumes:` entry, data was in the writable layer. Now every stateful service has a named volume and a `pg_dump` to S3 with a restore drill on the first of the month.',
        hi: '**Ek Postgres service jo mahine chali, phir ek routine image bump par sab kuch kho diya** — koi `volumes:` entry nahi.',
      },
      {
        en: '**`docker compose down -v` typed from muscle memory on the prod box** during a "quick restart" — wiped the DB, Redis, and uploads volumes. Recovery took the last night\'s dump plus 6 hours. Volumes are now `external: true` in prod so Compose can\'t delete them.',
        hi: '**Prod box par muscle memory se type kiya `docker compose down -v`** ek "quick restart" ke dauran — DB, Redis, aur uploads volumes wipe kiye.',
      },
      {
        en: '**A backup cron that had been writing 0-byte files for 4 months** (disk full), discovered only when a restore was finally attempted after a disk failure. Added size + age + success alerting on the backup job.',
        hi: '**Ek backup cron jo 4 mahine se 0-byte files likh raha tha** (disk full), sirf tab discover hua jab ek restore attempt kiya gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'What are named volumes, bind mounts, and tmpfs, and when do you use each?',
        qHi: 'Named volumes, bind mounts, aur tmpfs kya hain, aur aap har ek kab use karte ho?',
        a: 'All three attach storage to a container, but they differ in where the storage lives and who manages it. A named volume is storage that Docker creates and manages in its own area on the host; you declare it in the Compose file and mount it into a service, and its lifecycle is independent of any container, so it survives recreation, image updates, and a plain down, and is removed only by down with the volume flag or an explicit volume removal. It is the default for application data — a database\'s data directory, uploaded files — because it is portable and can be backed up generically. A bind mount maps a specific directory or file on the host into the container; you own the host path entirely and Docker just mounts it. Bind mounts are for injecting configuration files, for mounting source code into a development container so changes are picked up live, and for directing logs to a known host path. They are a poor choice for primary data because the stack becomes tied to one host\'s directory layout, user and group IDs may not line up, and on macOS and Windows the mount crosses the Docker virtual machine boundary and is slow. A tmpfs mount is backed by memory: nothing is written to disk and the contents disappear when the container stops, which suits fast ephemeral scratch space or sensitive data you do not want persisted.',
        aHi: 'Teenon storage ko ek container se attach karte hain, par wo differ karte hain ki storage kahan rehta hai aur kaun manage karta hai. Ek named volume storage hai jo Docker apne area mein host par banata aur manage karta hai; iska lifecycle kisi container se independent hai, to ye recreation, image updates, aur ek plain down survive karta hai. Ye application data ke liye default hai. Ek bind mount host par ek specific directory ya file ko container mein map karta hai; aap host path poori tarah own karte ho. Bind mounts configuration files inject karne ke liye, ek development container mein source code mount karne ke liye, aur logs ko ek known host path par direct karne ke liye hain. Wo primary data ke liye poor choice hain. Ek tmpfs mount memory se backed hai: disk par kuch nahi likha jaata aur contents container stop hone par disappear hote hain.',
      },
      {
        q: 'Why is a volume not a backup, and what does a real backup arrangement look like?',
        qHi: 'Ek volume ek backup kyun nahi hai, aur ek real backup arrangement kaisa dikhta hai?',
        a: 'A volume keeps data alive across the removal and recreation of containers, which is what containers do constantly, but that is the only thing it protects against. The volume sits on one disk on one host, so it is lost if that disk fails or the host is destroyed. It is deleted by a single command — down with the volume flag, or a volume prune — which is easy to run by accident because it is a common local-development habit. And it offers no protection against the data itself being corrupted by an application bug, a bad migration, ransomware, or a compromised host, because the volume faithfully stores whatever is written to it. A real backup is a copy of the data on separate infrastructure, ideally object storage in a different location, taken on a schedule with a retention policy. For a database it should be a logical dump taken through the database\'s own tools, which is internally consistent and portable across versions, rather than a raw copy of a running data directory. The backup job must be monitored, with an alert if a run fails or the newest archive is too old or suspiciously small, because backup jobs fail silently. And the restore must be exercised on a schedule into a throwaway environment, because a backup that has never been restored may be corrupt or missing a step, and the time to discover that is not during an incident. A database replica is not a backup, because it copies every change including the destructive one you would be recovering from.',
        aHi: 'Ek volume data ko containers ke removal aur recreation ke across alive rakhta hai, par wo ekmatra cheez hai jiske against ye protect karta hai. Volume ek host par ek disk par baithta hai, to ye lost ho jaata hai agar wo disk fail hoti hai. Ye ek single command se deleted hota hai — down volume flag ke saath — jo galti se chalana aasan hai. Aur ye data ke khud ek application bug, ek bad migration, ransomware se corrupt hone ke against koi protection nahi deta. Ek real backup separate infrastructure par data ki ek copy hai, ideally ek alag location mein object storage. Ek database ke liye ye database ke apne tools ke through liya ek logical dump hona chahiye. Backup job monitored hona chahiye. Aur restore ek schedule par ek throwaway environment mein exercise hona chahiye. Ek database replica ek backup nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, contrast named volume / bind mount / tmpfs on: who manages the storage, lifecycle, portability, and one good use for each. Then say which one a Postgres data directory should use and why.',
        taskHi: 'Ek comment mein, named volume / bind mount / tmpfs ko contrast karo.',
        hint: 'NAMED VOLUME: Docker manages it (under its own dir); lifecycle independent of containers (survives recreation/image update/`down`, killed by `down -v`); portable (no host-path dependency); backup-able generically. Use: application DATA. BIND MOUNT: YOU manage the exact host path; lifecycle = whatever you do to that dir; NOT portable (tied to one host\'s layout, uid mismatches, slow on macOS/Win). Use: config files IN, source code IN (dev live-reload), logs OUT. TMPFS: RAM-backed, Docker manages; gone when the container stops; not portable, not persistent. Use: fast ephemeral scratch, secrets you don\'t want on disk. Postgres data dir → NAMED VOLUME: it must survive container recreation and image bumps, be portable, and be backup-able — a bind mount would tie it to one host and hit uid/permission issues; the writable layer would lose it on every recreate.',
        hintHi: 'NAMED VOLUME: Docker manage karta hai; lifecycle containers se independent (`down` survive, `down -v` se marta hai); portable; backup-able. Use: application DATA. BIND MOUNT: AAP exact host path manage karte ho; NOT portable (uid mismatches, macOS/Win par slow). Use: config files IN, source code IN (dev), logs OUT. TMPFS: RAM-backed; container stop par gone. Use: fast ephemeral scratch. Postgres data dir → NAMED VOLUME: ise container recreation aur image bumps survive karna chahiye, portable hona, aur backup-able.',
      },
      {
        task: 'In a comment, list exactly what `docker compose down` keeps vs removes, and what `docker compose down -v` additionally removes. Then give three ways to restart a stack that do NOT risk data.',
        taskHi: 'Ek comment mein, `docker compose down` kya keep vs remove karta hai list karo.',
        hint: '`docker compose down`: REMOVES the containers and the default network; KEEPS named volumes and images. `docker compose down -v`: ALSO deletes every named volume the project declared (the data-loss command — `initdb` re-runs, all rows gone). Safe restarts (never need `-v`): (1) `docker compose down && docker compose up -d`; (2) `docker compose restart` (restarts processes, containers/volumes untouched); (3) `docker compose up -d --force-recreate` (new containers, same volumes re-attached). Protect prod: don\'t type `-v` from memory; declare prod volumes `external: true` so Compose won\'t delete them; wrap the command to refuse `-v` outside dev.',
        hintHi: '`docker compose down`: containers aur default network REMOVE karta hai; named volumes aur images KEEP karta hai. `docker compose down -v`: har named volume BHI delete karta hai (data-loss command). Safe restarts (`-v` kabhi nahi chahiye): (1) `down && up -d`; (2) `docker compose restart`; (3) `up -d --force-recreate`. Prod protect karo: `-v` memory se type mat karo; prod volumes `external: true` declare karo.',
      },
      {
        task: 'In a comment, write the two `docker run` commands to back up and restore a named volume `app_uploads` using a throwaway `alpine` container, explain why a DB should use `pg_dump` instead, and list the three properties a real backup must have.',
        taskHi: 'Ek comment mein, ek named volume back up aur restore karne ke do `docker run` commands likho.',
        hint: 'Backup: `docker run --rm -v app_uploads:/data:ro -v "$PWD/backups":/backup alpine:3.20 tar czf /backup/uploads-$(date +%F).tgz -C /data .`  Restore: `docker compose stop <svc>; docker run --rm -v app_uploads:/data -v "$PWD/backups":/backup alpine:3.20 sh -c \'rm -rf /data/* && tar xzf /backup/uploads-2026-09-08.tgz -C /data\'; docker compose start <svc>`. Works because a volume is just a directory any container can mount — no tool from the app image needed. A DB should use `pg_dump` (`docker compose exec -T db pg_dump -U postgres appdb | gzip > b.sql.gz`) because a raw tar of a RUNNING database can be internally inconsistent (half-written page, in-flight txn), and a logical dump is portable across engine/major-version changes. Three properties of a real backup: (1) OFF the host (another disk/host/object storage — not the same disk); (2) TESTED (restored into a scratch env on a schedule, data verified); (3) MONITORED (alert on job failure / stale / too-small archive). And backup ≠ replica (a replica copies your `DROP TABLE` too).',
        hintHi: 'Backup: `docker run --rm -v app_uploads:/data:ro -v "$PWD/backups":/backup alpine:3.20 tar czf /backup/uploads-$(date +%F).tgz -C /data .`  Restore: stop svc, `docker run --rm -v app_uploads:/data ... sh -c "rm -rf /data/* && tar xzf ..."`, start svc. DB ko `pg_dump` use karna chahiye kyunki ek RUNNING database ka ek raw tar internally inconsistent ho sakta hai. Ek real backup ke teen properties: (1) OFF the host; (2) TESTED; (3) MONITORED. Aur backup ≠ replica.',
      },
    ],

    keyTakeaways: [
      'A container\'s writable layer is DELETED when the container is removed — and containers are removed constantly (image update, config change, `down`, `--force-recreate`). RULE: anything that must survive a container\'s removal goes in a VOLUME, never the container filesystem. THREE mount types: NAMED VOLUME (`volumes: ["pgdata:/path"]` + top-level `volumes: {pgdata:}`) — Docker-managed, survives recreation/`down`, the DEFAULT for app data. BIND MOUNT (`./conf:/etc/app:ro`) — maps an EXACT host path in, YOU manage it; great for config IN / source IN (dev) / logs OUT, poor for data (host-layout-tied, uid mismatches, slow on macOS/Win). TMPFS (`tmpfs: [/tmp]`) — RAM-backed, gone on stop; scratch / on-disk-secret avoidance.',
      'WHAT SURVIVES WHAT: container crash/restart/recreate (image or config changed) → volume data KEPT (new container re-attaches the same volume). `docker compose down` → KEPT (removes containers + network only). `docker compose down -v` → DELETED — THE data-loss command (`initdb` re-runs, all rows gone). `docker volume rm`/`prune` → DELETED. Host disk fails / VM reset → GONE (the volume lives on that one disk). Restarting a stack NEVER needs `-v`: `down && up -d`, `docker compose restart`, or `up -d --force-recreate`. On prod: don\'t type `-v` from muscle memory; declare prod volumes `external: true` so Compose can\'t delete them.',
      'A VOLUME IS NOT A BACKUP. It protects against container churn ONLY — not disk failure, not `down -v`/`prune`, not a bad migration / app bug / ransomware corrupting the data, not a compromised host. A real backup = a copy of the data ELSEWHERE (another disk/host/object storage), on a schedule, retained.',
      'BACK UP A RAW VOLUME with a throwaway container: `docker run --rm -v proj_vol:/data:ro -v "$PWD":/backup alpine tar czf /backup/vol-$(date +%F).tgz -C /data .` (works because a volume is just a directory any container can mount — no tool from the app image needed). RESTORE reverses it (`rm -rf /data/* && tar xzf ...`). For a DATABASE prefer a NATIVE DUMP (`pg_dump`, `mysqldump`, `mongodump`) — a raw tar of a RUNNING db can be internally inconsistent, and a logical dump is portable across engine/major-version changes: `docker compose exec -T db pg_dump -U postgres appdb | gzip > b.sql.gz`.',
      'THREE properties of a real backup: (1) OFF the host — not another directory on the same disk; (2) TESTED — restored into a scratch env on a schedule (monthly+) with the data verified, because backup jobs fail SILENTLY (corrupted archive, cron broke months ago, 0-byte files); (3) MONITORED — alert on job failure / stale archive / implausibly small archive. And backup ≠ replica: a replica faithfully copies your `DROP TABLE` and your corruption too. "A backup you have never restored is a hope, not a backup."',
    ],
    keyTakeawaysHi: [
      'Ek container ki writable layer tab DELETED hoti hai jab container remove hota hai — aur containers constantly remove hote hain. RULE: jo kuch ek container ke removal ko survive karna chahiye ek VOLUME mein jaata hai. TEEN mount types: NAMED VOLUME — Docker-managed, recreation/`down` survive, app data ke liye DEFAULT. BIND MOUNT — ek EXACT host path map karta hai, AAP manage karte ho; config IN / source IN (dev) / logs OUT ke liye great, data ke liye poor. TMPFS — RAM-backed, stop par gone.',
      'KYA KYA SURVIVE KARTA HAI: container crash/restart/recreate → volume data KEPT. `docker compose down` → KEPT. `docker compose down -v` → DELETED — data-loss command. Host disk fails → GONE. Ek stack restart karne ko KABHI `-v` nahi chahiye: `down && up -d`, `docker compose restart`, ya `up -d --force-recreate`. Prod par: `-v` muscle memory se type mat karo; prod volumes `external: true` declare karo.',
      'EK VOLUME EK BACKUP NAHI HAI. Ye SIRF container churn ke against protect karta hai — disk failure nahi, `down -v` nahi, ek bad migration / app bug / ransomware nahi. Ek real backup = data ki ek copy KAHIN AUR (another disk/host/object storage), ek schedule par, retained.',
      'EK RAW VOLUME BACK UP KARO ek throwaway container se: `docker run --rm -v proj_vol:/data:ro -v "$PWD":/backup alpine tar czf /backup/vol-$(date +%F).tgz -C /data .` (kaam karta hai kyunki ek volume bas ek directory hai jise koi container mount kar sakta hai). RESTORE ise reverse karta hai. Ek DATABASE ke liye ek NATIVE DUMP prefer karo (`pg_dump`) — ek RUNNING db ka ek raw tar internally inconsistent ho sakta hai.',
      'Ek real backup ke TEEN properties: (1) OFF the host; (2) TESTED — ek schedule par ek scratch env mein restored, data verified, kyunki backup jobs SILENTLY fail hote hain; (3) MONITORED — job failure / stale archive par alert. Aur backup ≠ replica: ek replica aapka `DROP TABLE` bhi faithfully copy karta hai. "Ek backup jo aapne kabhi restore nahi kiya ek hope hai, ek backup nahi."',
    ],
  },

  {
    slug: 'ops-a-real-single-host-production-stack',
    title: 'A Real Single-Host Production Stack',
    titleHi: 'Ek Real Single-Host Production Stack',
    description: 'A production Compose stack is the same primitives with the production details filled in: a reverse proxy that terminates TLS and is the only published port, network segmentation so the proxy cannot reach the database, resource limits so one service cannot starve the host, `restart: unless-stopped`, bounded logging, and health-gated startup.',
    descriptionHi: 'Ek production Compose stack wahi primitives hai production details ke saath filled in: ek reverse proxy jo TLS terminate karta hai aur ekmatra published port hai, network segmentation taaki proxy database tak nahi pahunch sakta, resource limits taaki ek service host ko starve nahi kar sakti, `restart: unless-stopped`, bounded logging, aur health-gated startup.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**A small shop versus the same shop fitted out to actually open to the public.** The stock and the till (app and database) are the same. What makes it a real shop is the front-of-house fit-out: one lockable front door that everyone comes through and where IDs are checked (the reverse proxy, TLS, the single published port); a staff-only back area customers cannot wander into (the backend network the database sits on, unreachable from the front); a fuse box that trips one circuit instead of blacking out the street (per-service resource limits); a night-latch that re-locks the door if it blows open (`restart: unless-stopped`); and a bin that gets emptied instead of overflowing into the aisle (log rotation).',
      hi: '**Ek chhoti shop versus wahi shop public ke liye actually open hone ke liye fitted out.** Stock aur till (app aur database) same hain. Jo ise ek real shop banata hai wo front-of-house fit-out hai: ek lockable front door jahan sab aate hain aur IDs check hoti hain (reverse proxy, TLS, single published port); ek staff-only back area jahan customers nahi ghoom sakte (backend network jahan database baithta hai, front se unreachable); ek fuse box jo poori street ko black out karne ke bajaay ek circuit trip karta hai (per-service resource limits); ek night-latch jo door ko re-lock karta hai agar ye blow open hota hai (`restart: unless-stopped`); aur ek bin jo aisle mein overflow hone ke bajaay empty hota hai (log rotation).',
    },

    simple: `**THE SHAPE OF A PROD SINGLE-HOST STACK:**
\`\`\`
        internet :80/:443
             |
        [ proxy ]  Caddy/Traefik/nginx  — TLS termination, the ONLY published ports
             |  (frontend network)
        [  app  ]  your service, 2+ replicas optional, health-checked
             |  (backend network)
        [  db   ]  Postgres — named volume, NO published port, backend network only
\`\`\`

**PRODUCTION DETAILS every service needs (dev usually skips these):**
\`\`\`yaml
services:
  app:
    image: myco/app:1.6.3          # a PINNED tag or digest — never :latest (Module 5)
    restart: unless-stopped        # survive crashes + host reboots
    healthcheck: { test: [...], interval: 10s, retries: 3, start_period: 20s }
    deploy:
      resources:
        limits:   { cpus: "1.0", memory: 512M }    # one leak can't take the host
        reservations: { memory: 256M }
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }   # cap disk use — default is UNBOUNDED
    depends_on:
      db: { condition: service_healthy }
    networks: [ frontend, backend ]
\`\`\`

**NETWORK SEGMENTATION — least privilege for services:**
\`\`\`yaml
services:
  proxy: { networks: [ frontend ] }              # can reach: app.  NOT db.
  app:   { networks: [ frontend, backend ] }     # bridges the two tiers
  db:    { networks: [ backend ] }               # reachable only from app
networks:
  frontend:
  backend:
    # internal: true   -> backend has NO route to the internet at all (even outbound)
\`\`\`
If the proxy is compromised, it still cannot open a socket to the database.

**TLS — let the proxy do it.** Caddy: automatic HTTPS via ACME with two lines.
\`\`\`
# Caddyfile
api.example.com {
    reverse_proxy app:3000
}
\`\`\`
Caddy gets + renews the Let's Encrypt cert automatically (needs :80 + :443 reachable
and a real DNS record). Traefik and nginx-proxy + acme-companion do the same.

**SECRETS — not in the compose file.** Use \`env_file:\` (gitignored) for a single host,
or Docker secrets (\`secrets:\` -> a file at \`/run/secrets/<name>\`, not an env var).

**THE DEPLOY (Lesson 6):**  \`git pull && docker compose pull && docker compose up -d --wait\`
— pulls new images, recreates only changed services, blocks until healthy.

**PUT THE HOST UNDER IaC too** (Module 12): the VM, its firewall (only 22/80/443),
Docker install, the compose dir, and a systemd unit or \`restart: unless-stopped\` so the
stack comes back after a reboot. The compose file is the app; the host is also code.`,

    simpleHi: `**EK PROD SINGLE-HOST STACK KI SHAPE:**
\`\`\`
        internet :80/:443
             |
        [ proxy ]  Caddy/Traefik/nginx  — TLS termination, ekmatra published ports
             |  (frontend network)
        [  app  ]  aapki service, health-checked
             |  (backend network)
        [  db   ]  Postgres — named volume, KOI published port nahi, sirf backend network
\`\`\`

**PRODUCTION DETAILS har service ko chahiye (dev usually skip karta hai):**
\`\`\`yaml
services:
  app:
    image: myco/app:1.6.3          # ek PINNED tag ya digest — kabhi :latest nahi
    restart: unless-stopped
    healthcheck: { test: [...], interval: 10s, retries: 3, start_period: 20s }
    deploy:
      resources:
        limits: { cpus: "1.0", memory: 512M }    # ek leak host ko nahi le sakti
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }   # disk use cap — default UNBOUNDED hai
    depends_on:
      db: { condition: service_healthy }
\`\`\`

**NETWORK SEGMENTATION — services ke liye least privilege:**
\`\`\`yaml
services:
  proxy: { networks: [ frontend ] }              # reach kar sakta hai: app.  db NAHI.
  app:   { networks: [ frontend, backend ] }
  db:    { networks: [ backend ] }               # sirf app se reachable
networks:
  frontend:
  backend:
    # internal: true   -> backend ka internet tak KOI route nahi
\`\`\`
Agar proxy compromised hai, ye phir bhi database ko ek socket nahi khol sakta.

**TLS — proxy ko karne do.** Caddy: automatic HTTPS ACME ke through do lines mein.
Caddy Let's Encrypt cert automatically leta + renew karta hai.

**SECRETS — compose file mein nahi.** \`env_file:\` (gitignored) ek single host ke liye, ya
Docker secrets (\`secrets:\` -> \`/run/secrets/<name>\` par ek file).

**THE DEPLOY:**  \`git pull && docker compose pull && docker compose up -d --wait\`.

**HOST KO BHI IaC KE UNDER RAKHO** (Module 12): VM, iska firewall (sirf 22/80/443), Docker
install, compose dir, aur ek systemd unit taaki stack reboot ke baad wapas aata hai.`,

    content: `## Same primitives, production details filled in

A production single-host stack uses exactly the services, networks, and volumes from Lessons 1–4. What separates it from a dev stack is a set of details that dev leaves out because they do not matter on a laptop and do matter on a server exposed to the internet.

### The topology

Three tiers:

- **A reverse proxy** (Caddy, Traefik, or nginx) is the front door. It is the **only service that publishes ports** — 80 and 443 — and it **terminates TLS**, so certificates live in one place and backends speak plain HTTP internally. It routes by hostname and path to the app.
- **The app** — your service. It publishes no host port; the proxy reaches it on the private network. Optionally run more than one replica (\`--scale\`, Lesson 6) for zero-downtime restarts, with the proxy load-balancing across them.
- **The database** — Postgres or similar, on a **named volume**, publishing **no host port**, on the backend network only.

### Production details on every service

\`\`\`yaml
services:
  app:
    image: registry.example.com/myco/app:1.6.3   # pinned — never :latest
    restart: unless-stopped
    depends_on:
      db: { condition: service_healthy }
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/healthz"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 20s
    deploy:
      resources:
        limits:       { cpus: "1.0", memory: 512M }
        reservations: { memory: 256M }
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }
    networks: [frontend, backend]
\`\`\`

- **Pinned image tag or digest** — a specific version, so a redeploy is reproducible and a rollback is a known target (Module 5).
- **\`restart: unless-stopped\`** — the service recovers from a crash and from a host reboot, but respects a deliberate stop.
- **\`healthcheck\`** — so \`docker compose ps\` and \`--wait\` and the proxy all know the real state, not just "the container exists".
- **\`deploy.resources.limits\`** — a memory and CPU cap. Without it, one service's leak or runaway consumes the whole host, and the host OOM killer starts killing *other* services (Module 5). With it, the fault is contained to the offending service.
- **\`logging\` options** — the default \`json-file\` driver keeps **all** logs forever; a chatty service will fill the disk and take the host down. \`max-size\` + \`max-file\` bound it. (Or ship logs to a collector — Module 15.)

### Network segmentation

\`\`\`yaml
services:
  proxy: { image: caddy:2-alpine, ports: ["80:80","443:443"], networks: [frontend] }
  app:   { networks: [frontend, backend] }
  db:    { image: postgres:16-alpine, volumes: ["pgdata:/var/lib/postgresql/data"], networks: [backend] }
networks:
  frontend:
  backend:
    internal: true      # optional: no route to the internet, not even outbound
volumes:
  pgdata:
\`\`\`

By putting the proxy only on \`frontend\`, the app on both, and the database only on \`backend\`, the proxy **cannot open a connection to the database at all** — there is no network path. If the proxy is compromised through some vulnerability, the blast radius stops at the app tier. Marking \`backend\` as \`internal: true\` additionally denies the database any outbound internet access, so a compromised database container cannot exfiltrate data or pull down a second-stage payload.

### TLS

Let the proxy handle certificates. Caddy does automatic HTTPS with essentially no configuration:

\`\`\`
# Caddyfile
api.example.com {
    reverse_proxy app:3000
}
\`\`\`

On first request for \`api.example.com\`, Caddy obtains a Let's Encrypt certificate over ACME, serves HTTPS, redirects HTTP to HTTPS, and renews the certificate automatically before it expires. It needs ports 80 and 443 reachable from the internet and a DNS record pointing at the host. Traefik does the same with labels; nginx does it with the \`nginx-proxy\` + \`acme-companion\` pair or with Certbot.

### Secrets

Do **not** put credentials in the committed Compose file. For a single host:

- **\`env_file:\`** pointing at a file that is \`.gitignore\`d and deployed out of band — the simple, common pattern.
- **Docker secrets** — declare \`secrets:\` at the top level (from a file or an external secret), reference them per service, and Compose mounts each as a file at \`/run/secrets/<name>\`. A file, not an environment variable, so it does not leak into \`docker inspect\`, child process environments, or crash dumps. Many official images accept \`*_FILE\` variants (\`POSTGRES_PASSWORD_FILE\`) for exactly this.

For anything beyond one host, use a real secret manager (Module 19).

## The host is also code

A production Compose deployment is not just the Compose file. The host it runs on — the VM, its firewall rules (allow only 22, 80, 443 inbound), the Docker installation, the directory holding the Compose file and env file, and a mechanism to bring the stack up after a reboot — should itself be defined as code (Module 12: cloud-init or user-data for the first boot, Terraform or a config-management tool for the rest). \`restart: unless-stopped\` handles the containers across a reboot as long as the Docker daemon starts on boot, which it does by default; some teams also add a small systemd unit that runs \`docker compose up -d\` so the stack is explicitly owned by the init system.

## When this is the right choice

A single host running a Compose stack with pinned images, resource limits, health checks, network segmentation, TLS at the proxy, off-host database backups, and the host under IaC is a **legitimate production architecture** for a great many services. It is cheap, it is simple to reason about, one person can hold all of it in their head, and it has no distributed-systems failure modes. Its ceiling — no automatic survival of a host failure, no rolling deploys across replicas on multiple machines, no autoscaling — is real, and Lesson 6 is about recognising when you have hit it. But reaching for Kubernetes before you have hit it trades a set of problems you have for a much larger set of problems you have signed up to operate.`,

    contentHi: `## Same primitives, production details filled in

Ek production single-host stack exactly Lessons 1-4 se services, networks, aur volumes use karta hai. Jo ise ek dev stack se alag karta hai wo details ka ek set hai jise dev chhod deta hai kyunki wo ek laptop par matter nahi karte aur ek internet ko exposed server par matter karte hain.

### Topology

Teen tiers: **ek reverse proxy** (Caddy, Traefik, ya nginx) front door hai. Ye **ekmatra service hai jo ports publish karti hai** — 80 aur 443 — aur ye **TLS terminate karti hai**. **App** — koi host port publish nahi karti; proxy ise private network par reach karta hai. **Database** — ek **named volume** par, **koi host port** publish nahi, sirf backend network par.

### Har service par production details

**Pinned image tag ya digest** (kabhi :latest nahi); **\`restart: unless-stopped\`**; **\`healthcheck\`**; **\`deploy.resources.limits\`** (ek memory aur CPU cap — iske bina, ek service ka leak poore host ko consume karta hai); **\`logging\` options** (default \`json-file\` driver **saare** logs forever rakhta hai; ek chatty service disk bhar dega — \`max-size\` + \`max-file\` ise bound karo).

### Network segmentation

Proxy ko sirf \`frontend\` par, app ko dono par, aur database ko sirf \`backend\` par rakhkar, proxy **database ko ek connection bilkul nahi khol sakta** — koi network path nahi. Agar proxy compromised hai, blast radius app tier par rukta hai. \`backend\` ko \`internal: true\` mark karna additionally database ko koi outbound internet access deny karta hai.

### TLS

Proxy ko certificates handle karne do. Caddy essentially bina configuration ke automatic HTTPS karta hai: ye ek Let's Encrypt certificate ACME par obtain karta hai, HTTPS serve karta hai, aur certificate automatically renew karta hai.

### Secrets

Credentials ko committed Compose file mein **na** rakho. Ek single host ke liye: **\`env_file:\`** ek file ki taraf jo \`.gitignore\`d hai, ya **Docker secrets** (\`/run/secrets/<name>\` par ek file, ek environment variable nahi).

## Host bhi code hai

Ek production Compose deployment sirf Compose file nahi hai. Wo host jispar ye chalta hai — VM, iske firewall rules (sirf 22, 80, 443 inbound allow), Docker installation, aur ek reboot ke baad stack ko up karne ka mechanism — khud code ke roop mein defined hona chahiye (Module 12).

## Jab ye sahi choice hai

Ek single host jo pinned images, resource limits, health checks, network segmentation, proxy par TLS, off-host database backups, aur host IaC ke under ke saath ek Compose stack chalata hai bahut si services ke liye ek **legitimate production architecture** hai. Iska ceiling — ek host failure ka koi automatic survival nahi, multiple machines par replicas ke across koi rolling deploys nahi, koi autoscaling nahi — real hai. Par ise hit karne se pehle Kubernetes ke liye reach karna ek aise problems ke set ko trade karta hai jo aapke paas hain ek bahut bade set ke liye jise aapne operate karne ke liye sign up kiya hai.`,

    examples: [
      {
        title: 'Network segmentation: the proxy tier cannot reach the database',
        titleHi: 'Network segmentation: proxy tier database tak nahi pahunch sakta',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > compose.yaml <<'EOF'
name: tiers
services:
  proxy:
    image: alpine:3.20
    command: ["sleep", "300"]
    networks: [ frontend ]
  app:
    image: caddy:2-alpine
    networks: [ frontend, backend ]
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:80"]
      interval: 1s
      retries: 20
  db:
    image: caddy:2-alpine
    networks: [ backend ]
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:80"]
      interval: 1s
      retries: 20
networks:
  frontend:
  backend:
EOF

docker compose up -d --wait >/dev/null 2>&1
echo "proxy -> app  (both on 'frontend'):    $(docker compose exec -T proxy sh -c 'wget -qO- --timeout=3 http://app/  >/dev/null 2>&1 && echo REACHABLE || echo blocked')"
echo "proxy -> db   ('db' is backend-only):  $(docker compose exec -T proxy sh -c 'wget -qO- --timeout=3 http://db/   >/dev/null 2>&1 && echo REACHABLE || echo "BLOCKED (no network path)"')"
docker compose down -v >/dev/null 2>&1 || true`,
        output: `proxy -> app  (both on 'frontend'):    REACHABLE
proxy -> db   ('db' is backend-only):  BLOCKED (no network path)`,
        explain: 'Two networks are declared, and each service joins only the networks it needs. The proxy is on the frontend network only, the app is on both, and the database is on the backend network only. From inside the proxy container, a request to the app succeeds because both share the frontend network and the app is discoverable on it by name. A request from the proxy to the database, however, cannot even be attempted meaningfully: the database is not on any network the proxy is attached to, so the name does not resolve to a reachable address and there is no route. This is network-level least privilege for services. The proxy needs to talk only to the app, so that is the only path it has; if the proxy is compromised through a vulnerability in it or in something it depends on, the attacker gains a foothold with no direct line to the database. Adding the internal flag to the backend network would further prevent the database from making any outbound internet connection, closing the path a compromised database container would use to exfiltrate data or fetch additional tooling.',
        explainHi: 'Do networks declared hain, aur har service sirf wo networks join karti hai jinki use zaroorat hai. Proxy sirf frontend network par hai, app dono par, aur database sirf backend network par. Proxy container ke andar se, app ko ek request succeed karti hai kyunki dono frontend network share karte hain. Proxy se database ko ek request, hालांकि, meaningfully attempt bhi nahi ki ja sakti: database kisi network par nahi hai jispar proxy attached hai, to naam ek reachable address ko resolve nahi karta aur koi route nahi hai. Ye services ke liye network-level least privilege hai. Agar proxy compromised hai, attacker ek foothold gain karta hai database ke koi direct line ke bina. backend network mein internal flag add karna further database ko koi outbound internet connection banane se prevent karega.',
      },
      {
        title: 'The production details, shown resolved by `docker compose config`',
        titleHi: 'Production details, `docker compose config` se resolved dikhaye',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > compose.yaml <<'EOF'
name: prod
services:
  app:
    image: registry.example.com/myco/app:1.6.3
    restart: unless-stopped
    deploy:
      resources:
        limits:       { cpus: "1.0", memory: 512M }
        reservations: { memory: 256M }
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/healthz"]
      interval: 10s
      start_period: 20s
EOF

echo "--- the resolved production knobs ---"
docker compose config 2>/dev/null \\
  | grep -E 'image:|restart:|cpus:|memory:|max-size:|max-file:|driver: json-file'`,
        output: `--- the resolved production knobs ---
          cpus: 1
          memory: "536870912"
          memory: "268435456"
    image: registry.example.com/myco/app:1.6.3
      driver: json-file
        max-file: "3"
        max-size: 10m
    restart: unless-stopped`,
        explain: 'The service declares the details that separate a production configuration from a development one, and the config command shows them fully resolved. The image reference is a specific pinned version from a private registry, so a deploy pulls exactly that build and a rollback names a specific previous one. The restart policy is unless-stopped, so the service comes back after a crash or a host reboot but not after a deliberate stop. The resource limits are shown normalised to raw numbers — the CPU value as a plain number of cores, the memory values as bytes — and they cap what the service can consume so a fault in it cannot exhaust the host and trigger the kernel to kill unrelated services. The logging options bound the on-disk log size, which matters because the default driver otherwise retains every log line indefinitely and a verbose or looping service will fill the disk. Reading this resolved output before a deploy confirms that every service actually carries these settings rather than silently inheriting unbounded defaults.',
        explainHi: 'Service wo details declare karti hai jo ek production configuration ko ek development se alag karti hain, aur config command unhe fully resolved dikhata hai. Image reference ek private registry se ek specific pinned version hai. Restart policy unless-stopped hai. Resource limits raw numbers mein normalised dikhaye jaate hain — CPU value cores ki ek plain sankhya ke roop mein, memory values bytes ke roop mein — aur wo cap karte hain ki service kya consume kar sakti hai. Logging options on-disk log size ko bound karte hain, jo matter karta hai kyunki default driver warna har log line indefinitely retain karta hai. Ek deploy se pehle is resolved output ko padhna confirm karta hai ki har service actually ye settings carry karti hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a prod stack with no resource limits and the default logging driver
services:
  app:   { image: myco/app:latest }        # :latest AND no limits AND no logging opts
  worker: { image: myco/worker:latest }
# 3 weeks later: worker has a slow memory leak. it grows to 6GB on an 8GB host.
#   the host OOM killer picks a victim by its own heuristics -> kills 'app'.
#   also: app logs a stack trace per request under load -> /var/lib/docker fills
//   -> the WHOLE Docker daemon wedges. every service down. from a log file.`,
        why: 'A container with no memory limit can consume as much of the host\'s memory as it is able to allocate, so a leak or a runaway in one service grows without bound until the host as a whole is out of memory. At that point the kernel\'s out-of-memory killer intervenes at the host level and chooses which process to terminate by its own scoring, which frequently is not the offending service — so a leak in a background worker takes down the user-facing app. A memory and CPU limit on each service confines the consequence of such a fault to that service: its own limit is reached first, the kernel kills a process within it, and the rest of the host is unaffected. Separately, the default logging driver writes every line a container emits to a file with no size limit, so a service that logs heavily, especially one stuck in an error loop, grows that file until the disk is full, and a full disk on the Docker data directory can wedge the entire daemon and take every service down. Bounding the log size with the max-size and max-file options, or shipping logs off the host to a collector, prevents a log file from becoming an outage.',
        right: `services:
  app:
    image: myco/app:1.6.3                   # pinned
    deploy: { resources: { limits: { cpus: "1.0", memory: 512M } } }
    logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }
  worker:
    image: myco/worker:1.6.3
    deploy: { resources: { limits: { memory: 1G } } }
    logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }
# now: a worker leak hits 1G -> the kernel OOM-kills the WORKER (exit 137), app is fine.
#      logs are capped at 30MB/service. add monitoring on memory + disk trending up.`,
        whyHi: 'Bina ek memory limit ke ek container host ki utni memory consume kar sakta hai jitni ye allocate kar sakta hai, to ek service mein ek leak bina bound ke grow karta hai jab tak host as a whole memory se bahar nahi hai. Us point par kernel ka out-of-memory killer host level par intervene karta hai aur apni scoring se choose karta hai ki kaunsa process terminate kare, jo frequently offending service nahi hai. Har service par ek memory aur CPU limit aise ek fault ke consequence ko us service tak confine karta hai. Alag se, default logging driver har line ko ek file mein bina ek size limit ke likhta hai, to ek service jo heavily log karti hai us file ko grow karti hai jab tak disk full nahi hai, aur Docker data directory par ek full disk poore daemon ko wedge kar sakta hai.',
      },
      {
        wrong: `# putting every service on the default network and publishing the DB port
services:
  proxy: { image: caddy, ports: ["443:443"] }
  app:   { image: myco/app }
  db:    { image: postgres:16, ports: ["5432:5432"] }   # "so I can connect with a GUI"
# -> all three on one network: the proxy CAN reach the DB directly. and 5432 is
//    open on the host. a proxy vuln, or anything that reaches the host on 5432,
//    is one hop from the database.`,
        right: `services:
  proxy: { image: caddy:2-alpine, ports: ["80:80","443:443"], networks: [frontend] }
  app:   { image: myco/app:1.6.3, networks: [frontend, backend] }
  db:    { image: postgres:16-alpine, networks: [backend],
           volumes: ["pgdata:/var/lib/postgresql/data"] }   # NO ports:
networks: { frontend: {}, backend: { internal: true } }
volumes:  { pgdata: {} }
# proxy has NO path to db. db has NO outbound internet. GUI access:
#   docker compose exec db psql   — or an SSH tunnel for a session.`,
        why: 'When every service shares one network, each service can open a connection to every other, so the reverse proxy — the component most exposed to untrusted input — has a direct network path to the database. Segmenting into a frontend network shared by the proxy and app and a backend network shared by the app and database removes that path entirely: the proxy is not attached to any network the database is on, so a compromised proxy has no route to attempt. Marking the backend network internal additionally strips the database of outbound internet access, which is the route a compromised database container would use to send data out or download further tooling. Publishing the database port to the host is a separate exposure: it makes the database reachable by any process on the host and, depending on the host firewall, by other machines, when the only component that needs the database — the app — already reaches it over the private network. Direct access for a database GUI should be a temporary measure through the exec command or an SSH tunnel, not a standing published port.',
        whyHi: 'Jab har service ek network share karti hai, har service har doosri ko ek connection khol sakti hai, to reverse proxy — untrusted input ko sabse exposed component — ke paas database ka ek direct network path hai. Ek frontend network (proxy aur app) aur ek backend network (app aur database) mein segment karna us path ko poori tarah remove karta hai. Backend network ko internal mark karna additionally database ko outbound internet access se strip karta hai. Database port ko host par publish karna ek separate exposure hai: ye database ko host par kisi bhi process se reachable banata hai jab ekmatra component jise database chahiye — app — ise already private network par reach karta hai. Ek database GUI ke liye direct access exec command ya ek SSH tunnel ke through ek temporary measure hona chahiye.',
      },
      {
        wrong: `# secrets in the committed compose file, or passed as plain env vars
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: "S3cr3t!prod"       # <- in git, forever
  app:
    environment:
      STRIPE_SECRET_KEY: "sk_live_abc123"    # <- also in 'docker inspect', child env, crash dumps`,
        right: `services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password   # image supports *_FILE
    secrets: [ db_password ]
  app:
    env_file: [ ./app.env ]        # gitignored; deployed out of band
secrets:
  db_password:
    file: ./secrets/db_password    # gitignored; or 'external: true' from an external store
# a Docker secret is mounted as a FILE at /run/secrets/<name>, not an env var —
# it doesn't show in 'docker inspect', child process environments, or core dumps.`,
        why: 'A credential written into the Compose file is committed to the repository and stays in its history permanently, readable by everyone with access and by anything that ever clones the repo. A credential passed as a plain environment variable is visible in the output of docker inspect on the container, is inherited by every child process the container spawns, and appears in crash dumps and some logging, so it leaks well beyond the one process that needs it. For a single host, keeping secrets in a file that is excluded from version control and delivered to the host separately keeps them out of the repository, and using the Docker secrets mechanism goes further: each secret is mounted into the container as a file under a well-known path rather than injected as an environment variable, so it is not exposed through inspection, child environments, or dumps. Many official images accept a file-valued variant of their password variable specifically to support this. Anything beyond one host warrants a dedicated secret manager with access control, rotation, and audit.',
        whyHi: 'Compose file mein likha ek credential repository mein commit hota hai aur iske history mein permanently rehta hai. Ek plain environment variable ke roop mein pass kiya ek credential container par docker inspect ke output mein visible hai, container jo har child process spawn karta hai usse inherited hai, aur crash dumps mein appear karta hai. Ek single host ke liye, secrets ko ek file mein rakhna jo version control se excluded hai unhe repository se bahar rakhta hai, aur Docker secrets mechanism use karna aage jaata hai: har secret container mein ek file ke roop mein mount hota hai ek well-known path ke under ek environment variable ke roop mein inject hone ke bajaay. Ek host se aage kuch bhi ek dedicated secret manager warrant karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**A background worker\'s slow leak OOM-killed the user-facing app** on an unlimited-memory prod stack — the kernel picked the wrong victim. Adding `deploy.resources.limits.memory` to every service made the next leak a contained `exit 137` on the worker with an alert, not an outage.',
        hi: '**Ek background worker ke slow leak ne user-facing app ko OOM-kill kiya** ek unlimited-memory prod stack par — kernel ne galat victim picka.',
      },
      {
        en: '**The whole Docker daemon wedged because `/var/lib/docker` filled with logs** — one service in an error loop, default `json-file` driver, no `max-size`. Every service went down. Now `max-size: 10m, max-file: 3` is in a shared `x-logging` anchor applied to every service.',
        hi: '**Poora Docker daemon wedge hua kyunki `/var/lib/docker` logs se bhar gaya** — ek service ek error loop mein, default `json-file` driver, koi `max-size` nahi.',
      },
      {
        en: '**A pen test walked from a proxy SSRF straight to the Postgres port** — flat network, `5432` published. Re-architected into frontend/backend networks with `internal: true` on backend and no published DB port; the same SSRF now hits a dead end.',
        hi: '**Ek pen test ek proxy SSRF se seedhe Postgres port tak gaya** — flat network, `5432` published. frontend/backend networks mein re-architect kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What does a production single-host Compose stack have that a dev one usually does not?',
        qHi: 'Ek production single-host Compose stack mein kya hota hai jo ek dev wale mein usually nahi hota?',
        a: 'The same services, networks, and volumes, with a set of production details filled in. Image references are pinned to specific versions or digests rather than a moving tag, so a deploy is reproducible and a rollback has a definite target. Every long-running service has a restart policy of unless-stopped so it recovers from crashes and host reboots but respects a deliberate stop, and a healthcheck so the process listing, the wait flag, and the proxy all know its real state. Every service has resource limits on CPU and memory, so a leak or runaway is contained to that service instead of exhausting the host and causing the kernel to kill unrelated ones. Every service has bounded logging — a size and file-count cap on the log driver — so a chatty or looping service cannot fill the disk and wedge the daemon. The network is segmented into tiers: a reverse proxy that is the only service publishing ports and that terminates TLS, on a frontend network with the app; the database on a backend network only, with no published port, so the proxy has no path to it, and optionally the backend network marked internal to deny the database outbound internet. Secrets are kept out of the committed file, in a gitignored env file or as Docker secrets mounted as files. And the host itself — its firewall, Docker install, and reboot behaviour — is defined as code, because the deployment is more than the Compose file.',
        aHi: 'Same services, networks, aur volumes, production details ke ek set ke saath filled in. Image references specific versions ya digests par pinned hain. Har long-running service ki ek restart policy unless-stopped hai aur ek healthcheck. Har service par CPU aur memory par resource limits hain, to ek leak us service tak contained hai. Har service par bounded logging hai. Network tiers mein segmented hai: ek reverse proxy jo ekmatra service hai jo ports publish karti hai aur jo TLS terminate karti hai; database sirf ek backend network par, koi published port nahi, to proxy ke paas iska koi path nahi. Secrets committed file se bahar rakhe jaate hain. Aur host khud code ke roop mein defined hai.',
      },
      {
        q: 'Explain network segmentation in a Compose stack and what it protects against.',
        qHi: 'Ek Compose stack mein network segmentation samjhao aur ye kiske against protect karta hai.',
        a: 'By default every service in a Compose project joins one network and can therefore open a connection to every other service. Segmentation means declaring multiple networks and attaching each service only to the ones it needs. The typical shape is a frontend network shared by the reverse proxy and the app, and a backend network shared by the app and the database. The proxy is on frontend only, the database on backend only, and the app bridges both. The effect is that the proxy has no network path to the database at all — the database is not on any network the proxy is attached to, so there is nothing to connect to. This matters because the proxy is the component most exposed to untrusted traffic and therefore the most likely to be compromised through a vulnerability in it or a library it uses; segmentation means a compromised proxy cannot reach the database directly, so the attacker\'s foothold is limited to the app tier. Marking the backend network as internal adds a second protection: it removes the database\'s route to the internet, including outbound, so a compromised database container cannot send data out or download additional tooling. It is least privilege applied at the network layer — each service can talk only to what it genuinely needs to talk to.',
        aHi: 'Default se ek Compose project mein har service ek network join karti hai aur isliye har doosri service ko ek connection khol sakti hai. Segmentation ka matlab multiple networks declare karna aur har service ko sirf un networks se attach karna jinki use zaroorat hai. Typical shape ek frontend network hai jo reverse proxy aur app share karte hain, aur ek backend network jo app aur database share karte hain. Effect ye hai ki proxy ke paas database ka koi network path bilkul nahi hai. Ye matter karta hai kyunki proxy untrusted traffic ko sabse exposed component hai. Backend network ko internal mark karna ek doosri protection add karta hai: ye database ka internet ka route remove karta hai. Ye network layer par applied least privilege hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, draw the three-tier prod topology (proxy / app / db) with which networks each is on and which one publishes ports, and list the five per-service production settings every service should carry.',
        taskHi: 'Ek comment mein, three-tier prod topology banao.',
        hint: 'proxy: on `frontend` only; the ONLY service with `ports:` (`80:80`, `443:443`); terminates TLS. app: on `frontend` + `backend` (bridges the tiers); no published port — the proxy reaches it by name. db: on `backend` only; no published port; a named volume for data; (`backend` optionally `internal: true` → no outbound internet). Five per-service prod settings: (1) PINNED image tag/digest (never `:latest`); (2) `restart: unless-stopped`; (3) `healthcheck:` (so `ps`/`--wait`/the proxy see real state); (4) `deploy.resources.limits` (cpus + memory — a leak can\'t take the host, the kernel OOM-kills the offender not a bystander); (5) `logging.options` `max-size` + `max-file` (the default `json-file` keeps ALL logs → a chatty service fills the disk and wedges the daemon).',
        hintHi: 'proxy: sirf `frontend` par; EKMATRA service `ports:` ke saath (`80:80`, `443:443`); TLS terminate karta hai. app: `frontend` + `backend` par; koi published port nahi. db: sirf `backend` par; koi published port nahi; ek named volume; (`backend` optionally `internal: true`). Paanch per-service prod settings: (1) PINNED image tag/digest; (2) `restart: unless-stopped`; (3) `healthcheck:`; (4) `deploy.resources.limits` (cpus + memory); (5) `logging.options` `max-size` + `max-file`.',
      },
      {
        task: 'In a comment, explain why a prod stack with no resource limits and the default logging driver has two independent ways to take the whole host down, and how each is fixed.',
        taskHi: 'Ek comment mein, samjhao kyun bina resource limits aur default logging driver wale ek prod stack ke paas poore host ko down karne ke do independent tarike hain.',
        hint: 'Way 1 — MEMORY: no `deploy.resources.limits.memory` → one service\'s leak/runaway grows unbounded until the HOST is out of memory → the kernel OOM-killer picks a victim by its own scoring, often NOT the offender (a background worker leak kills the user-facing app). Fix: a `memory` (and `cpus`) limit per service → the offender hits ITS limit first, gets `exit 137`, everyone else is fine; + alert on memory trending up. Way 2 — DISK/LOGS: the default `json-file` driver keeps EVERY log line forever with no cap → a service stuck in an error loop fills `/var/lib/docker` → a full disk there wedges the ENTIRE Docker daemon → all services down. Fix: `logging.options: { max-size: "10m", max-file: "3" }` per service (or ship logs to a collector); + alert on disk trending up.',
        hintHi: 'Way 1 — MEMORY: koi `deploy.resources.limits.memory` nahi → ek service ka leak unbounded grow karta hai jab tak HOST memory se bahar nahi → kernel OOM-killer ek victim picka hai, aksar offender NAHI. Fix: per service ek `memory` (aur `cpus`) limit → offender apni limit pehle hit karta hai, `exit 137`. Way 2 — DISK/LOGS: default `json-file` driver HAR log line forever rakhta hai bina cap → ek error loop mein ek service `/var/lib/docker` bhar deti hai → wahan ek full disk POORE Docker daemon ko wedge karta hai. Fix: per service `logging.options: { max-size: "10m", max-file: "3" }`.',
      },
      {
        task: 'In a comment, explain why segmenting into frontend/backend networks + `internal: true` on backend limits the blast radius of a compromised reverse proxy, and why secrets should be Docker secrets (files) rather than plain env vars.',
        taskHi: 'Ek comment mein, samjhao kyun frontend/backend networks mein segment karna ek compromised reverse proxy ke blast radius ko limit karta hai.',
        hint: 'Flat network → every service can connect to every other → the proxy (most exposed to untrusted input, most likely to be popped via an SSRF or a library CVE) has a DIRECT path to the DB. Segmented: proxy on `frontend` only, db on `backend` only, app bridges → the proxy is on NO network the db is attached to → no route, the name doesn\'t even resolve → a compromised proxy is stuck at the app tier. `internal: true` on `backend` also removes the db\'s OUTBOUND internet → a compromised db container can\'t exfiltrate data or pull a second-stage payload. Secrets as Docker secrets (mounted as a FILE at `/run/secrets/<name>`) rather than plain env vars because an env var shows up in `docker inspect`, is inherited by every child process the container spawns, and lands in crash dumps / some logs — it leaks far beyond the one process that needs it. Many images take `*_FILE` variants (`POSTGRES_PASSWORD_FILE`) for exactly this. And never in the committed compose file — that\'s git history forever.',
        hintHi: 'Flat network → har service har doosri se connect kar sakti hai → proxy (untrusted input ko sabse exposed) ke paas DB ka ek DIRECT path hai. Segmented: proxy sirf `frontend` par, db sirf `backend` par, app bridges → proxy KISI network par nahi hai jispar db attached hai → koi route nahi → ek compromised proxy app tier par stuck hai. `backend` par `internal: true` db ka OUTBOUND internet bhi remove karta hai. Secrets Docker secrets ke roop mein (`/run/secrets/<name>` par ek FILE) plain env vars ke bajaay kyunki ek env var `docker inspect` mein dikhta hai, har child process ko inherited hai, aur crash dumps mein land karta hai.',
      },
    ],

    keyTakeaways: [
      'A PROD single-host stack = the SAME services/networks/volumes as dev, with the production details filled in. TOPOLOGY: 3 tiers — a REVERSE PROXY (Caddy/Traefik/nginx) that is the ONLY service publishing ports (80/443) and terminates TLS, on a `frontend` network with the app; the APP on `frontend`+`backend`, no published port; the DATABASE on `backend` ONLY, a named volume, NO published port.',
      'FIVE per-service PRODUCTION settings dev usually skips: (1) a PINNED image tag/digest (never `:latest` — reproducible deploy, definite rollback target); (2) `restart: unless-stopped` (survives crash + host reboot, respects a deliberate stop); (3) `healthcheck:` (so `ps` / `--wait` / the proxy know real state); (4) `deploy.resources.limits` cpus + memory (a leak is contained to the offender — the kernel OOM-kills IT (`exit 137`), not a bystander); (5) `logging.options` `max-size` + `max-file` (the default `json-file` driver keeps ALL logs forever → a chatty/looping service fills the disk and WEDGES THE WHOLE DAEMON).',
      'NETWORK SEGMENTATION = network-layer least privilege. Put the proxy on `frontend` only, the app on both, the db on `backend` only → the proxy has NO network path to the db (name doesn\'t resolve, no route). A compromised proxy (SSRF, library CVE — it\'s the most exposed component) is stuck at the app tier. `internal: true` on `backend` also strips the db\'s OUTBOUND internet → a compromised db container can\'t exfiltrate or pull a second-stage payload.',
      'TLS: let the proxy do it. Caddy = automatic HTTPS in ~2 lines (`api.example.com { reverse_proxy app:3000 }`) — it obtains + renews a Let\'s Encrypt cert over ACME (needs :80/:443 reachable + a real DNS record). SECRETS: NOT in the committed compose file (git history forever). Single host → `env_file:` (gitignored, deployed out of band) or DOCKER SECRETS: declared `secrets:`, mounted as a FILE at `/run/secrets/<name>` (NOT an env var — an env var leaks into `docker inspect`, child process envs, crash dumps). Many images accept `*_FILE` variants (`POSTGRES_PASSWORD_FILE`).',
      'THE HOST IS ALSO CODE (Module 12): the VM, its firewall (inbound: ONLY 22/80/443), Docker install, the compose dir + env file, and a reboot-recovery mechanism (`restart: unless-stopped` + Docker starting on boot, or a small systemd unit running `docker compose up -d`). WHEN THIS IS RIGHT: a single host with pinned images + limits + healthchecks + segmentation + proxy-TLS + OFF-HOST DB backups + the host under IaC is a LEGITIMATE production architecture for a great many services — cheap, simple, one head can hold it, no distributed-systems failure modes. Its ceiling (no automatic host-failure survival, no cross-machine rolling deploys, no autoscaling) is real — Lesson 6 is recognising when you\'ve hit it. Reaching for Kubernetes BEFORE you have trades your problems for a much larger set you\'ve signed up to operate.',
    ],
    keyTakeawaysHi: [
      'Ek PROD single-host stack = dev jaise SAME services/networks/volumes, production details ke saath filled in. TOPOLOGY: 3 tiers — ek REVERSE PROXY jo EKMATRA service hai jo ports (80/443) publish karti hai aur TLS terminate karti hai, ek `frontend` network par app ke saath; APP `frontend`+`backend` par, koi published port nahi; DATABASE sirf `backend` par, ek named volume, KOI published port nahi.',
      'PAANCH per-service PRODUCTION settings jo dev usually skip karta hai: (1) ek PINNED image tag/digest (kabhi `:latest` nahi); (2) `restart: unless-stopped`; (3) `healthcheck:`; (4) `deploy.resources.limits` cpus + memory (ek leak offender tak contained — kernel USE OOM-kill karta hai, ek bystander ko nahi); (5) `logging.options` `max-size` + `max-file` (default `json-file` driver SAARE logs forever rakhta hai → ek chatty service disk bhar deti hai aur POORE DAEMON ko WEDGE karti hai).',
      'NETWORK SEGMENTATION = network-layer least privilege. Proxy ko sirf `frontend` par, app ko dono par, db ko sirf `backend` par rakho → proxy ke paas db ka KOI network path nahi. Ek compromised proxy app tier par stuck hai. `backend` par `internal: true` db ka OUTBOUND internet bhi strip karta hai.',
      'TLS: proxy ko karne do. Caddy = ~2 lines mein automatic HTTPS — ye ek Let\'s Encrypt cert ACME par obtain + renew karta hai. SECRETS: committed compose file mein NAHI. Single host → `env_file:` (gitignored) ya DOCKER SECRETS: `/run/secrets/<name>` par ek FILE (ek env var NAHI — ek env var `docker inspect`, child process envs, crash dumps mein leak karta hai). Bahut images `*_FILE` variants accept karti hain.',
      'HOST BHI CODE HAI (Module 12): VM, iska firewall (inbound: SIRF 22/80/443), Docker install, compose dir + env file, aur ek reboot-recovery mechanism. JAB YE SAHI HAI: ek single host pinned images + limits + healthchecks + segmentation + proxy-TLS + OFF-HOST DB backups + host IaC ke under ke saath bahut si services ke liye ek LEGITIMATE production architecture hai. Iska ceiling (koi automatic host-failure survival nahi, koi cross-machine rolling deploys nahi, koi autoscaling nahi) real hai. Ise hit karne se PEHLE Kubernetes ke liye reach karna aapke problems ko ek bahut bade set ke liye trade karta hai.',
    ],
  },

  {
    slug: 'ops-operating-compose-and-outgrowing-it',
    title: 'Operating It & When You\'ve Outgrown Compose',
    titleHi: 'Ise Operate Karna Aur Jab Aap Compose Se Aage Badh Gaye',
    description: 'Day to day, a Compose deployment is a handful of commands: `up`, `down`, `logs`, `exec`, `ps`, and a deploy that is `pull` then `up -d`. It scales up on one host with `--scale` but has hard ceilings — no cross-host scheduling, no health-gated rolling deploys, no self-healing when the host dies. Knowing exactly where those ceilings are tells you when to move and when not to.',
    descriptionHi: 'Din pratidin, ek Compose deployment kuch commands hai: `up`, `down`, `logs`, `exec`, `ps`, aur ek deploy jo `pull` phir `up -d` hai. Ye ek host par `--scale` se scale up karta hai par iske hard ceilings hain — koi cross-host scheduling nahi, koi health-gated rolling deploys nahi, koi self-healing nahi jab host marta hai. Wo ceilings exactly kahan hain jaanna aapko batata hai kab move karna hai aur kab nahi.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A food truck versus a restaurant chain.** A food truck (Compose on one host) is run by two people with a short list of daily routines: open up, restock, serve, clean, close. It is a real, profitable business and most food trucks should stay food trucks. The limits are physical: one truck, one location, one generator — if the truck breaks down, you are closed until it is fixed, and you cannot serve two neighbourhoods at once. A restaurant chain (Kubernetes) solves those exact problems — many locations, staff who cover for each other, a head office that reopens a branch automatically — at the cost of an entire management layer that a food truck neither needs nor could afford to run.',
      hi: '**Ek food truck versus ek restaurant chain.** Ek food truck (Compose ek host par) do log chalate hain daily routines ki ek short list ke saath: open up, restock, serve, clean, close. Ye ek real, profitable business hai aur zyaadatar food trucks ko food trucks rehna chahiye. Limits physical hain: ek truck, ek location, ek generator — agar truck breaks down, aap tab tak closed ho jab tak ise fix nahi kiya jaata, aur aap ek saath do neighbourhoods serve nahi kar sakte. Ek restaurant chain (Kubernetes) un exact problems ko solve karta hai — kai locations, staff jo ek doosre ke liye cover karta hai, ek head office jo ek branch automatically reopen karta hai — ek poore management layer ki cost par jise ek food truck na chahiye na afford kar sakta.',
    },

    simple: `**THE DAILY COMMANDS:**
\`\`\`
docker compose up -d [--wait]         start / apply changes (only recreates what changed)
docker compose down [--rmi local]     stop + remove containers & network (NOT volumes; no -v!)
docker compose ps [-a]               what's running + health + ports
docker compose logs -f [--tail 100] SERVICE   follow logs (all services if none named)
docker compose exec SERVICE sh       a shell IN a running container (debug, psql, etc.)
docker compose run --rm SERVICE CMD   a ONE-OFF container (migrations, a REPL) — own lifecycle
docker compose restart [SERVICE]     restart process(es), keep containers & volumes
docker compose stop / start          stop/start without removing
docker compose top / stats           processes / live CPU+mem per container
docker compose config               the resolved file (always run before a new-env 'up')
docker compose pull                  fetch newer images for the pinned tags
docker compose cp SERVICE:/path ./   copy files in/out
\`\`\`

**THE DEPLOY LOOP (single host):**
\`\`\`bash
cd /opt/myapp
git pull                              # new compose.yaml / config (if versioned here)
docker compose pull                   # pull the new image tags
docker compose up -d --wait           # recreate ONLY changed services, block until healthy
docker compose ps                     # confirm
# rollback = set the old tag, 'docker compose up -d' again
\`\`\`
Only services whose image/config/env changed are recreated — the rest keep running,
so an app deploy doesn't bounce the database.

**SCALING ON ONE HOST:**
\`\`\`
docker compose up -d --scale worker=4        # 4 replicas of 'worker' on THIS host
# or in the file:   deploy: { replicas: 4 }
\`\`\`
- works for stateless workers pulling from a queue (no LB needed)
- for HTTP: the reverse proxy (Caddy/Traefik/nginx) must load-balance across replicas —
  Compose does NOT do this for you (Swarm mode does; plain Compose doesn't)
- you can briefly run old+new replicas for a near-zero-downtime app deploy, but it's
  manual and coarse — no automatic health-gated rollout

**THE HARD CEILINGS — what Compose fundamentally does NOT do:**
\`\`\`
CROSS-HOST         one compose = one host. no scheduling work across a fleet.
HOST FAILURE       host dies -> everything on it is down until a human acts. no failover.
ROLLING DEPLOY     no health-gated, one-replica-at-a-time rollout with auto-rollback
                   across machines (Lesson: Module 11 / K8s Deployments).
AUTOSCALING        no scaling on CPU/latency/queue-depth. --scale is a manual number.
SERVICE MESH / RBAC / NetworkPolicy / secrets rotation / multi-tenant isolation — no.
\`\`\`

**WHEN TO MOVE (and when NOT):**
\`\`\`
STAY on Compose if:  1 host is enough, a few minutes of downtime for a host reboot is
                     acceptable, one/two people operate it, load is predictable.
MOVE when:  you need automatic survival of a host failure · zero-downtime deploys across
            many machines · autoscaling · many teams self-serving · >~5-10 hosts of capacity.
MIDDLE GROUND:  Docker Swarm (Compose-like, multi-host, rolling deploys — simpler than K8s),
               Nomad, or a PaaS (Fly/Render/Railway/App Runner) that runs your compose-ish
               spec for you.
\`\`\`
Do NOT adopt Kubernetes to avoid a 2-minute reboot. Adopt it when its problems are your problems.`,

    simpleHi: `**DAILY COMMANDS:**
\`\`\`
docker compose up -d [--wait]         start / changes apply (sirf jo badla recreate)
docker compose down                   stop + remove containers & network (volumes NAHI; koi -v nahi!)
docker compose ps [-a]               kya chal raha hai + health + ports
docker compose logs -f SERVICE       logs follow karo
docker compose exec SERVICE sh       ek running container mein ek shell
docker compose run --rm SERVICE CMD   ek ONE-OFF container (migrations, ek REPL)
docker compose restart [SERVICE]     process(es) restart, containers & volumes keep
docker compose config               resolved file (naye-env 'up' se pehle hamesha chalao)
docker compose pull                  pinned tags ke liye newer images fetch karo
\`\`\`

**DEPLOY LOOP (single host):**
\`\`\`bash
cd /opt/myapp
git pull
docker compose pull
docker compose up -d --wait           # SIRF changed services recreate, healthy tak block
docker compose ps
# rollback = purana tag set karo, phir se 'docker compose up -d'
\`\`\`
Sirf wo services jinki image/config/env badli recreate hoti hain — baaki chalti rehti hain.

**EK HOST PAR SCALING:**
\`\`\`
docker compose up -d --scale worker=4        # 'worker' ke 4 replicas IS host par
\`\`\`
- ek queue se pull karne wale stateless workers ke liye kaam karta hai (koi LB nahi)
- HTTP ke liye: reverse proxy ko replicas ke across load-balance karna chahiye — Compose ye NAHI karta

**HARD CEILINGS — Compose jo fundamentally NAHI karta:**
\`\`\`
CROSS-HOST         ek compose = ek host. koi fleet ke across scheduling nahi.
HOST FAILURE       host marta hai -> uspar sab kuch down jab tak ek human act nahi karta. koi failover nahi.
ROLLING DEPLOY     koi health-gated, one-replica-at-a-time rollout auto-rollback ke saath nahi.
AUTOSCALING        CPU/latency/queue-depth par koi scaling nahi. --scale ek manual number hai.
SERVICE MESH / RBAC / NetworkPolicy / secrets rotation — nahi.
\`\`\`

**KAB MOVE KARNA (aur kab NAHI):**
\`\`\`
Compose par RAHO agar:  1 host kaafi hai, ek host reboot ke liye kuch minutes ka downtime acceptable hai,
                        ek/do log operate karte hain, load predictable hai.
MOVE karo jab:  aapko ek host failure ka automatic survival chahiye · kai machines ke across zero-downtime
                deploys · autoscaling · kai teams self-serving · >~5-10 hosts ki capacity.
MIDDLE GROUND:  Docker Swarm, Nomad, ya ek PaaS (Fly/Render/Railway).
\`\`\`
Ek 2-minute reboot avoid karne ke liye Kubernetes adopt MAT karo.`,

    content: `## The daily commands

Operating a Compose deployment is a small, stable set of commands:

- **\`docker compose up -d [--wait]\`** — bring the stack to the state the file describes. Compose recreates only the services whose image, configuration, or environment changed; everything else keeps running. With \`--wait\`, the command blocks until every service is running and healthy.
- **\`docker compose down\`** — stop and remove the containers and the default network. **Not** the volumes — do not add \`-v\` on a real deployment (Lesson 4).
- **\`docker compose ps\`** — the running services, their health, and published ports. \`-a\` includes stopped ones.
- **\`docker compose logs -f --tail 100 SERVICE\`** — follow a service's logs. With no service name, all of them, interleaved and colour-coded.
- **\`docker compose exec SERVICE sh\`** — a shell inside a *running* container. This is how you inspect a live service, run \`psql\` against the database, or check a file.
- **\`docker compose run --rm SERVICE CMD\`** — a *new, one-off* container from a service's definition, with its own lifecycle, removed when it exits. For database migrations, a one-time data fix, a REPL. Not the same as \`exec\`, which enters an existing container.
- **\`docker compose restart\` / \`stop\` / \`start\`** — restart, stop, or start services without removing them.
- **\`docker compose top\` / \`stats\`** — the processes in each container / live CPU and memory per container.
- **\`docker compose pull\`** — fetch newer images for the tags in the file.
- **\`docker compose config\`** — the resolved file. Run it before every \`up\` in a new environment.

## The deploy loop

On a single host where the Compose file and config are checked out in a directory, a deploy is:

\`\`\`bash
cd /opt/myapp
git pull                       # updated compose.yaml, Caddyfile, migration scripts
docker compose pull            # pull the image tags referenced (now pointing at the new build)
docker compose up -d --wait    # reconcile: recreate only changed services, wait for healthy
docker compose ps              # confirm
\`\`\`

Because \`up\` recreates only what changed, deploying a new app image does not restart the database or the proxy — they are untouched. A **rollback** is symmetric: point the app's image tag back at the previous version (in the file or via a variable) and run \`docker compose up -d\` again.

For **near-zero-downtime** on the app itself, you can run two replicas, deploy by recreating them one at a time (\`docker compose up -d --no-deps --scale app=2 app\` patterns), and rely on the proxy to keep sending traffic to the healthy one. This works but it is manual and blunt — there is no built-in "roll one replica, check its health, roll the next, roll back automatically if a check fails". That is what Module 11's deployment strategies and Kubernetes Deployments provide.

## Scaling on one host

\`docker compose up -d --scale worker=4\` runs four containers for the \`worker\` service, all on the one host. In the file, \`deploy: { replicas: 4 }\` does the same.

- For **stateless workers** that pull jobs from a queue, this is genuinely useful — four workers process the queue in parallel, no load balancer needed, and you can raise or lower the number.
- For an **HTTP service**, replicas alone do nothing unless something distributes requests across them. Plain Compose does **not** load-balance; you need the reverse proxy (Caddy, Traefik, nginx) configured to treat the replicas as an upstream pool. (Docker Swarm mode *does* provide a built-in virtual IP that load-balances across replicas — plain \`docker compose\` does not.)
- All replicas share the one host's CPU, memory, and disk, so scaling is bounded by that host.

## The hard ceilings

These are not tuning problems; they are things Compose is not built to do:

- **Cross-host scheduling.** One Compose project runs on one Docker host. There is no scheduler placing containers across a fleet of machines, no bin-packing, no "this host is full, use another".
- **Host-failure survival.** If the host goes down — hardware fault, kernel panic, someone trips over the power cable — every service on it is down until a person notices and acts. There is no other node to reschedule onto, because Compose has no concept of other nodes.
- **Health-gated rolling deploys across machines.** No "update one replica, wait for its healthcheck, update the next, and if a healthcheck fails, stop and roll back automatically" — across a set of hosts.
- **Autoscaling.** \`--scale\` is a number you set. Nothing adjusts it based on CPU, request latency, or queue depth.
- **The platform features.** Service mesh, fine-grained RBAC, NetworkPolicy beyond simple network segmentation, automatic secret rotation, multi-tenant isolation, per-namespace quotas — none of this exists in Compose.

## When to move, and when not to

**Stay on Compose** when: one host has enough capacity; a few minutes of downtime for a planned host reboot or an occasional unplanned one is acceptable; one or two people operate it; the load is predictable enough that manual scaling is fine. This describes a large fraction of real services, including revenue-generating ones. A well-run single host with backups is not a compromise, it is an appropriate choice.

**Move** when you have a concrete need Compose cannot meet: the service must survive a host failure automatically with no human in the loop; you need zero-downtime deploys with automatic rollback across many machines; load varies enough that you need autoscaling; multiple teams need to self-serve deployments; you have grown past what one machine (even a large one) can hold.

**The middle ground** is often the right answer and is frequently skipped:

- **Docker Swarm** — built into Docker, uses a Compose-like file, adds multi-host scheduling, a built-in load-balancing mesh, rolling updates with health checks and rollback, and secrets. Far simpler to operate than Kubernetes. Less momentum in the ecosystem, but a legitimate step.
- **Nomad** — HashiCorp's scheduler; simpler than Kubernetes, runs containers and also plain binaries.
- **A PaaS** — Fly.io, Render, Railway, AWS App Runner, Google Cloud Run: you hand over a container (or a compose-like spec) and they run it across their infrastructure with health checks, rolling deploys, and scaling. You give up some control and pay a margin; you skip operating the platform.

The failure mode to avoid is adopting Kubernetes to solve a problem you do not have — "we might need to scale one day" — and taking on the cluster, the control plane, the upgrades, the RBAC, the networking, and the on-call for all of it, to run three services that a single host handled fine. Adopt the tool when its problems are the problems you actually have.`,

    contentHi: `## Daily commands

Ek Compose deployment operate karna commands ka ek small, stable set hai:
- **\`docker compose up -d [--wait]\`** — stack ko us state par lao jo file describe karti hai. Compose sirf un services ko recreate karta hai jinki image, configuration, ya environment badli.
- **\`docker compose down\`** — containers aur default network stop aur remove karo. **Volumes nahi** — ek real deployment par \`-v\` add mat karo.
- **\`docker compose ps\`** — running services, unki health, aur published ports.
- **\`docker compose logs -f --tail 100 SERVICE\`** — ek service ke logs follow karo.
- **\`docker compose exec SERVICE sh\`** — ek *running* container ke andar ek shell.
- **\`docker compose run --rm SERVICE CMD\`** — ek service ki definition se ek *naya, one-off* container. Database migrations, ek one-time data fix ke liye.
- **\`docker compose config\`** — resolved file. Har \`up\` se pehle ek naye environment mein chalao.

## Deploy loop

\`\`\`bash
cd /opt/myapp
git pull
docker compose pull
docker compose up -d --wait    # reconcile: sirf changed services recreate, healthy ka wait
docker compose ps
\`\`\`

Kyunki \`up\` sirf jo badla wo recreate karta hai, ek naya app image deploy karna database ya proxy ko restart nahi karta. Ek **rollback** symmetric hai: app ka image tag wapas previous version par point karo aur \`docker compose up -d\` phir chalao.

## Ek host par scaling

\`docker compose up -d --scale worker=4\` \`worker\` service ke liye chaar containers chalata hai, sab ek host par.
- **Stateless workers** ke liye jo ek queue se jobs pull karte hain, ye genuinely useful hai.
- Ek **HTTP service** ke liye, replicas akele kuch nahi karte jab tak kuch unke across requests distribute nahi karta. Plain Compose load-balance **nahi** karta.

## Hard ceilings

- **Cross-host scheduling.** Ek Compose project ek Docker host par chalta hai.
- **Host-failure survival.** Agar host down jaata hai, uspar har service down hai jab tak ek person notice nahi karta.
- **Health-gated rolling deploys machines ke across.** Nahi.
- **Autoscaling.** \`--scale\` ek number hai jo aap set karte ho.
- **Platform features.** Service mesh, fine-grained RBAC, automatic secret rotation — Compose mein nahi.

## Kab move karna, aur kab nahi

**Compose par raho** jab: ek host ke paas kaafi capacity hai; ek planned host reboot ke liye kuch minutes ka downtime acceptable hai; ek ya do log operate karte hain. Ye real services ka ek bada fraction describe karta hai.

**Move karo** jab aapke paas ek concrete need hai jo Compose meet nahi kar sakta: service ko ek host failure automatically survive karna chahiye; aapko kai machines ke across automatic rollback ke saath zero-downtime deploys chahiye; load kaafi vary karta hai ki aapko autoscaling chahiye.

**Middle ground** aksar sahi answer hai aur frequently skip kiya jaata hai: **Docker Swarm** (Docker mein built-in, ek Compose-like file, multi-host scheduling add karta hai, Kubernetes se kahin simpler), **Nomad**, ya **ek PaaS** (Fly.io, Render, Railway, Cloud Run).

Avoid karne wala failure mode Kubernetes ko ek aisi problem solve karne ke liye adopt karna hai jo aapke paas nahi hai — "hum kabhi scale karne ki zaroorat pad sakti hai" — aur cluster, control plane, upgrades, RBAC, networking, aur uske liye on-call lena, teen services chalane ke liye jinhe ek single host fine handle karta tha.`,

    examples: [
      {
        title: 'The deploy loop: `up` recreates only what changed',
        titleHi: 'Deploy loop: `up` sirf jo badla wo recreate karta hai',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > compose.yaml <<'EOF'
name: dep
services:
  api:
    image: alpine:3.20
    command: ["sleep", "300"]
  db:
    image: alpine:3.20
    command: ["sleep", "300"]
EOF
docker compose up -d >/dev/null 2>&1
api1=$(docker inspect --format '{{.Id}}' dep-api-1)
db1=$(docker inspect --format '{{.Id}}' dep-db-1)

# a deploy that changes ONLY the api service (new command == new config)
cat > compose.yaml <<'EOF'
name: dep
services:
  api:
    image: alpine:3.20
    command: ["sleep", "999"]
  db:
    image: alpine:3.20
    command: ["sleep", "300"]
EOF
docker compose up -d 2>&1 | grep -E 'Recreate|Running|Started' | sed -E 's/^ *//; s/ +/ /g'

api2=$(docker inspect --format '{{.Id}}' dep-api-1)
db2=$(docker inspect --format '{{.Id}}' dep-db-1)
[ "$api1" != "$api2" ] && echo "api: RECREATED (its config changed)"
[ "$db1" = "$db2" ] && echo "db:  left running, untouched (no downtime for unchanged services)"
docker compose down -v >/dev/null 2>&1 || true`,
        output: `Container dep-db-1 Running
Container dep-api-1 Recreate
Container dep-api-1 Recreated
Container dep-api-1 Started
api: RECREATED (its config changed)
db:  left running, untouched (no downtime for unchanged services)`,
        explain: 'Two services are started and their container identifiers recorded. The Compose file is then edited so that only one service\'s definition changes. Running the up command again makes Compose compare the desired state in the file to what is running: the unchanged service is reported as already running and is left exactly as it is, while the changed service is recreated — a new container with a new identifier replaces the old one. Comparing the identifiers before and after confirms it: the edited service has a new container, the untouched service has the same one throughout. This is why a routine deploy on a Compose host does not cause unnecessary disruption. Pushing a new application image and running up recreates the application container and nothing else; the database and the reverse proxy, whose definitions did not change, keep running without interruption. A rollback works the same way in reverse — restore the previous image tag and run up, and only the application container is recreated again.',
        explainHi: 'Do services start hoti hain aur unke container identifiers record hote hain. Compose file phir edit hoti hai taaki sirf ek service ki definition badle. up command phir chalana Compose ko file mein desired state ko running se compare karwata hai: unchanged service already running report hoti hai aur exactly waise chhodi jaati hai, jabki changed service recreate hoti hai. Identifiers ko before aur after compare karna ise confirm karta hai. Isliye ek Compose host par ek routine deploy unnecessary disruption cause nahi karta. Ek naya application image push karna aur up chalana application container ko recreate karta hai aur kuch nahi; database aur reverse proxy, jinki definitions nahi badli, bina interruption ke chalti rehti hain.',
      },
      {
        title: '--scale runs N replicas on ONE host; Compose does not load-balance them',
        titleHi: '--scale ek host par N replicas chalata hai; Compose unhe load-balance nahi karta',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > compose.yaml <<'EOF'
name: scale
services:
  worker:
    image: alpine:3.20
    command: ["sleep", "300"]
EOF

docker compose up -d --scale worker=4 >/dev/null 2>&1
echo "replicas of 'worker', all on this single host:"
docker compose ps --format '{{.Name}}' worker | sort
echo "count: $(docker compose ps -q worker | grep -c .)"
echo
echo "note: for a QUEUE worker this is real parallelism (each pulls jobs independently)."
echo "for an HTTP service, the reverse proxy must be told these 4 are an upstream POOL -"
echo "plain 'docker compose' does NOT create a load-balancing VIP across replicas."
docker compose down -v >/dev/null 2>&1 || true`,
        output: `replicas of 'worker', all on this single host:
scale-worker-1
scale-worker-2
scale-worker-3
scale-worker-4
count: 4

note: for a QUEUE worker this is real parallelism (each pulls jobs independently).
for an HTTP service, the reverse proxy must be told these 4 are an upstream POOL -
plain 'docker compose' does NOT create a load-balancing VIP across replicas.`,
        explain: 'The scale option starts the requested number of containers for one service, and the process listing shows all four, each with the project prefix and an index. They are all on the same Docker host, sharing its CPU, memory, and disk, so this is scaling within one machine, not across machines. For a worker that pulls tasks from a queue, running several is straightforwardly useful: each replica connects to the queue independently and processes tasks in parallel, and the number can be raised or lowered as the backlog demands, with no load balancer involved because the queue is the distribution mechanism. For a service that receives inbound HTTP requests, running several replicas accomplishes nothing on its own, because a client connects to one address and something has to spread connections across the replicas. Plain Compose does not do this — it does not create a virtual address that balances across a service\'s containers. The reverse proxy in front has to be configured to treat the replicas as a pool of upstreams. Docker Swarm mode does provide a built-in balancing virtual IP per service; plain docker compose does not, and this is a common source of confusion.',
        explainHi: 'Scale option ek service ke liye requested number ke containers start karta hai, aur process listing chaaron dikhata hai. Wo sab same Docker host par hain, iski CPU, memory, aur disk share karte hain, to ye ek machine ke andar scaling hai, machines ke across nahi. Ek worker ke liye jo ek queue se tasks pull karta hai, kai chalana straightforwardly useful hai: har replica queue se independently connect hota hai aur tasks parallel mein process karta hai. Ek service ke liye jo inbound HTTP requests receive karti hai, kai replicas chalana apne aap kuch accomplish nahi karta, kyunki ek client ek address se connect hota hai aur kuch ko replicas ke across connections spread karna hai. Plain Compose ye nahi karta. Saamne reverse proxy ko replicas ko upstreams ke ek pool ke roop mein treat karne ke liye configure karna hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# --scale an HTTP service and expect traffic to spread across replicas
$ docker compose up -d --scale api=3
$ curl http://localhost:8080/           # all requests hit ONE of the three
# -> 'ports: ["8080:80"]' on a scaled service: Compose maps the host port to
//    ONE replica (and warns / errors on the port conflict). there is no VIP.
//    the other two replicas get zero traffic.`,
        right: `# put a reverse proxy in front and let IT balance across the replicas:
services:
  proxy:
    image: caddy:2-alpine
    ports: ["8080:80"]
    # Caddyfile:  :80 { reverse_proxy api:80 }   <- Caddy resolves ALL A records for 'api'
  api:
    image: myco/api
    # NO ports: on api — the proxy reaches all replicas on the private net
$ docker compose up -d --scale api=3     # proxy now round-robins across api-1/2/3
# (or move to Swarm/K8s, which give a real per-service load-balanced VIP.)`,
        why: 'Scaling a service to several replicas creates several containers, but nothing in plain Compose distributes inbound connections among them. A published port maps a single host port to a single container port, so on a scaled service Compose can only forward the host port to one of the replicas, and it warns or fails on the conflict; the other replicas receive no external traffic at all. There is no virtual address in front of the service that balances across its containers. To actually use multiple replicas of an HTTP service, a load balancer has to sit in front, and the natural choice is the reverse proxy that is already terminating TLS: configured with the service name as its upstream, a proxy like Caddy resolves all of the replica addresses and distributes requests across them, so scaling the service up or down changes the pool the proxy balances over. The replicas themselves publish no host port; the proxy reaches them on the private network. An orchestrator such as Swarm or Kubernetes provides this differently, with a stable per-service virtual address that load-balances across the current replicas automatically, which is one of the concrete things you gain by moving to one.',
        whyHi: 'Ek service ko kai replicas mein scale karna kai containers banata hai, par plain Compose mein kuch bhi inbound connections unmein distribute nahi karta. Ek published port ek single host port ko ek single container port par map karta hai, to ek scaled service par Compose sirf host port ko replicas mein se ek ko forward kar sakta hai. Service ke saamne koi virtual address nahi hai jo iske containers ke across balance karta hai. Ek HTTP service ke multiple replicas ko actually use karne ke liye, ek load balancer ko saamne baithna hai, aur natural choice wo reverse proxy hai jo already TLS terminate kar raha hai: service name ko iske upstream ke roop mein configured, Caddy jaisa ek proxy saare replica addresses resolve karta hai aur requests unmein distribute karta hai. Swarm ya Kubernetes jaisa ek orchestrator ise alag deta hai, ek stable per-service virtual address ke saath.',
      },
      {
        wrong: `# adopting Kubernetes for 3 services because "we should be on k8s"
# before:  1 VM, compose.yaml, 2 people, deploy = 'git pull && compose up -d'.
//          occasional 90-second downtime on a host reboot. everyone fine with it.
# after:   a managed control plane, an ingress controller, cert-manager, Helm
//          charts, RBAC, a CNI, node upgrades every 3 months, a staging cluster,
//          and now ONE person understands the whole thing and they're on-call
//          forever. deploys are slower. the 90-second reboot problem is "solved".`,
        right: `# match the tool to the problem you ACTUALLY have:
#   - reboot downtime unacceptable?  -> 2 app replicas + proxy LB on ONE host,
//      or Docker Swarm (multi-host, rolling deploys, ~1 day to learn)
#   - real need to survive host failure automatically? -> THEN a managed K8s
//      (EKS/GKE) or a PaaS (Cloud Run / Fly) — and accept the operational cost
#   - "might need to scale someday" is NOT a current problem. revisit when it is.
# the boring single host + backups + IaC is a valid answer for years.`,
        why: 'Kubernetes solves cross-host scheduling, automatic rescheduling on node failure, health-gated rolling deploys across replicas, autoscaling, and multi-team self-service, and it does so by introducing a control plane, a networking layer, an ingress layer, a certificate manager, a packaging tool, a permissions model, and a cluster-upgrade cadence, all of which have to be operated and kept current. Taking that on to run a handful of services that a single host was handling adequately trades a small, well-understood operational surface for a large one, concentrates the knowledge in whoever set it up, slows down deploys, and puts someone on call for a stack of components that exist only to solve problems the deployment did not have. The disciplined approach is to identify the specific capability that is actually missing — surviving a host reboot with no downtime, or surviving a host failure with no human intervention, or scaling automatically with load — and choose the smallest thing that provides it: multiple replicas behind the existing proxy for the first, Docker Swarm or a small managed platform for the second, and only a full orchestrator when several of these needs are real at once. A single host with backups and infrastructure as code remains a correct answer for a long time.',
        whyHi: 'Kubernetes cross-host scheduling, node failure par automatic rescheduling, replicas ke across health-gated rolling deploys, autoscaling, aur multi-team self-service solve karta hai, aur ye ek control plane, ek networking layer, ek ingress layer, ek certificate manager, ek packaging tool, ek permissions model, aur ek cluster-upgrade cadence introduce karke aisa karta hai. Ek handful services chalane ke liye jinhe ek single host adequately handle kar raha tha wo lena ek small, well-understood operational surface ko ek bade ke liye trade karta hai. Disciplined approach wo specific capability identify karna hai jo actually missing hai aur sabse chhoti cheez choose karna jo ise provide karti hai. Backups aur infrastructure as code ke saath ek single host ek lambe samay ke liye ek correct answer rehta hai.',
      },
      {
        wrong: `# treating the single host as pet infrastructure — nothing about it is code
# the VM was clicked together in the console 2 years ago. Docker was installed
# by hand. the firewall rules are "whatever they were". the compose dir is at
# /home/ubuntu/app. there is no record of how to rebuild this host.
# -> the disk fails. rebuilding takes 2 days of archaeology and guesswork,
//    and the new host is subtly different.`,
        right: `# the host is code too (Module 12):
#   - the VM + firewall (inbound 22/80/443 only) + disk in Terraform
#   - Docker + the compose dir + the systemd unit in cloud-init / user-data
//     or a small Ansible playbook
#   - the compose.yaml + Caddyfile in git; secrets deployed out of band
#   - off-host DB backups + a documented, TESTED restore
# now "rebuild the host" is: terraform apply + restore the backup. ~30 min.`,
        why: 'A single-host deployment concentrates everything in one machine, which makes it essential that the machine can be recreated quickly and exactly. When the host is assembled by hand — created through a console, software installed interactively, firewall rules adjusted ad hoc, files placed in arbitrary locations — there is no description of how it was built, so recreating it after a disk failure or a compromise is a slow reconstruction from memory and from whatever is still readable, and the result differs from the original in ways that surface later as bugs. Defining the host as code removes this: the virtual machine, its disk, and its firewall rules in an infrastructure-as-code tool; the Docker installation, the directory layout, and the mechanism that starts the stack on boot in first-boot configuration or a small configuration-management playbook; the Compose file and proxy configuration in version control; and database backups stored off the host with a tested restore. Recreating the host then becomes applying the infrastructure definition and restoring the backup, a bounded operation of well under an hour, and the new host is identical to the old one by construction.',
        whyHi: 'Ek single-host deployment sab kuch ek machine mein concentrate karta hai, jo ise essential banata hai ki machine ko jaldi aur exactly recreate kiya ja sake. Jab host haath se assemble hota hai — ek console ke through created, software interactively installed, firewall rules ad hoc adjusted — koi description nahi hai ki ise kaise banaya gaya, to ek disk failure ke baad ise recreate karna memory se ek slow reconstruction hai. Host ko code ke roop mein define karna ise remove karta hai: virtual machine, iski disk, aur iske firewall rules ek infrastructure-as-code tool mein; Docker installation aur boot par stack start karne ka mechanism first-boot configuration mein; Compose file version control mein; aur database backups host se off. Host ko recreate karna phir infrastructure definition apply karna aur backup restore karna ban jaata hai.',
      },
    ],

    realWorld: [
      {
        en: '**A team that spent a quarter migrating 4 services to EKS** to solve occasional 2-minute reboot downtime — then spent every quarter after on node upgrades, cert-manager breakage, and Helm. In hindsight: 2 replicas + Caddy on the existing VM, or Swarm, would have solved it in a day.',
        hi: '**Ek team jisne 4 services ko EKS par migrate karne mein ek quarter bitaya** occasional 2-minute reboot downtime solve karne ke liye — phir har quarter node upgrades par bitaya.',
      },
      {
        en: '**A `--scale api=3` that quietly ran 3 replicas, 2 of which got zero traffic** — `ports:` on the service mapped the host port to one. Fixed by moving the port to a Caddy proxy configured with `reverse_proxy api:3000` as an upstream pool.',
        hi: '**Ek `--scale api=3` jo quietly 3 replicas chalata tha, jinmein se 2 ko zero traffic milta tha** — service par `ports:`.',
      },
      {
        en: '**A hand-built prod host whose disk failed** — rebuild took 2 days because nobody knew the exact Docker version, kernel params, or firewall rules. Rebuilt as Terraform + cloud-init + a `pg_dump` restore; the next rebuild drill took 25 minutes.',
        hi: '**Ek hand-built prod host jiski disk fail hui** — rebuild mein 2 din lage kyunki koi exact Docker version nahi jaanta tha. Terraform + cloud-init ke roop mein rebuild kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What does a Compose deploy look like on a single host, and how does a rollback work?',
        qHi: 'Ek single host par ek Compose deploy kaisa dikhta hai, aur ek rollback kaise kaam karta hai?',
        a: 'The Compose file and any associated configuration are checked out in a directory on the host. A deploy pulls the updated files with a version-control update, pulls the new container images that the file\'s tags now point at, and runs the up command with the wait flag. Compose compares the desired state in the file to what is currently running and recreates only the services whose image, configuration, or environment changed, leaving everything else running untouched; the wait flag holds the command until every service is up and passing its healthcheck. So deploying a new application build recreates the application container and does not disturb the database or the reverse proxy. Confirmation is the process listing. A rollback is symmetric and just as simple: point the application\'s image tag back at the previous version, either by editing the file or through a variable, and run the up command again — Compose recreates only the application container, back to the earlier image. Because the previous images are still pinned by tag and present locally or in the registry, this is fast and deterministic. For near-zero downtime on the application itself you can run more than one replica and recreate them one at a time behind the proxy, but Compose has no automatic health-gated rolling update with rollback across machines.',
        aHi: 'Compose file aur koi associated configuration host par ek directory mein checked out hain. Ek deploy updated files ko ek version-control update se pull karta hai, naye container images pull karta hai, aur up command ko wait flag ke saath chalata hai. Compose file mein desired state ko currently running se compare karta hai aur sirf un services ko recreate karta hai jinki image, configuration, ya environment badli. To ek naya application build deploy karna application container ko recreate karta hai aur database ya reverse proxy ko disturb nahi karta. Ek rollback symmetric aur utna hi simple hai: application ke image tag ko wapas previous version par point karo aur up command phir chalao — Compose sirf application container ko recreate karta hai.',
      },
      {
        q: 'What can Compose fundamentally not do, and how do you decide whether to move off it?',
        qHi: 'Compose fundamentally kya nahi kar sakta, aur aap kaise decide karte ho ki isse move karna hai ya nahi?',
        a: 'Compose runs on one Docker host, and several things follow from that. It has no scheduler placing containers across a fleet, so it cannot use more than one machine\'s capacity. If the host fails, every service on it is down until a person intervenes, because there is no other node to reschedule onto. It has no health-gated rolling deploy that updates replicas one at a time across machines with automatic rollback on a failed check. Its scaling is a manual number you set, not something driven by CPU, latency, or queue depth. And it lacks the platform layer — service mesh, fine-grained access control, network policy, secret rotation, multi-tenant isolation. The decision to move should be driven by a concrete capability you actually need and lack: automatic survival of a host failure with no human in the loop, zero-downtime deploys with rollback across many machines, autoscaling under variable load, or multiple teams needing to self-serve. If instead the situation is that one host has enough capacity, a planned reboot\'s downtime is acceptable, and one or two people operate a predictable workload, staying on Compose with good backups and the host defined as code is the correct choice, not a compromise. When a real need does appear, the middle ground is often right and often skipped: Docker Swarm or Nomad for multi-host scheduling with far less complexity than Kubernetes, or a platform-as-a-service that runs the containers for you. Adopting Kubernetes to pre-empt a problem you do not have trades a small operational surface for a large one.',
        aHi: 'Compose ek Docker host par chalta hai. Iske paas ek fleet ke across containers place karne wala koi scheduler nahi. Agar host fail hota hai, uspar har service down hai jab tak ek person intervene nahi karta. Iske paas ek health-gated rolling deploy nahi hai. Iski scaling ek manual number hai. Aur ismein platform layer ki kami hai. Move karne ka decision ek concrete capability se driven hona chahiye jo aapko actually chahiye aur nahi hai: ek host failure ka automatic survival, kai machines ke across rollback ke saath zero-downtime deploys, variable load ke under autoscaling. Agar iske bajaay situation ye hai ki ek host ke paas kaafi capacity hai aur ek/do log ek predictable workload operate karte hain, Compose par rehna good backups aur host code ke roop mein defined ke saath correct choice hai. Jab ek real need appear karti hai, middle ground aksar sahi hai: Docker Swarm ya Nomad, ya ek platform-as-a-service.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write the single-host deploy loop (the exact commands) and explain what `docker compose up -d` does NOT recreate and why that matters. Then say how a rollback works.',
        taskHi: 'Ek comment mein, single-host deploy loop likho.',
        hint: '```\ncd /opt/myapp\ngit pull                     # updated compose.yaml / Caddyfile / migrations\ndocker compose pull          # fetch the new image tags\ndocker compose up -d --wait  # reconcile + block until healthy\ndocker compose ps           # confirm\n```\n`up` recreates ONLY services whose image / config / environment changed — the DB, the proxy, any unchanged service keep running untouched, so an app deploy causes no DB or proxy downtime. Rollback: set the app\'s image tag back to the previous version (in the file or a var) and `docker compose up -d` again → only the app container is recreated, back to the old image. Fast + deterministic because the old image is still pinned by tag and present locally/in the registry.',
        hintHi: '`cd /opt/myapp; git pull; docker compose pull; docker compose up -d --wait; docker compose ps`. `up` SIRF wo services recreate karta hai jinki image / config / environment badli — DB, proxy, koi unchanged service chalti rehti hai, to ek app deploy koi DB ya proxy downtime cause nahi karta. Rollback: app ka image tag wapas previous version par set karo aur phir se `docker compose up -d` → sirf app container recreate hota hai.',
      },
      {
        task: 'In a comment, explain why `docker compose up -d --scale api=3` does not spread HTTP traffic across the 3 replicas, what does, and which orchestrators give you a per-service load-balanced VIP for free.',
        taskHi: 'Ek comment mein, samjhao kyun `--scale api=3` HTTP traffic ko 3 replicas ke across spread nahi karta.',
        hint: 'Plain Compose has NO virtual IP / load balancer in front of a service — `ports: ["8080:80"]` maps the host port to ONE replica (and warns/errors on the conflict); the other 2 get zero traffic. What spreads traffic: a REVERSE PROXY in front (Caddy `reverse_proxy api:3000`, nginx/Traefik upstream pool) — configured with the service name, it resolves all replica addresses and round-robins; the replicas themselves publish NO host port. `--scale` IS real parallelism for QUEUE workers (each pulls jobs independently, no LB needed). Docker SWARM mode and KUBERNETES both give a stable per-service virtual address that auto-load-balances across the current replicas — that\'s one concrete thing you gain by moving to one.',
        hintHi: 'Plain Compose ke paas ek service ke saamne KOI virtual IP / load balancer NAHI hai — `ports: ["8080:80"]` host port ko EK replica par map karta hai; baaki 2 ko zero traffic. Traffic kya spread karta hai: saamne ek REVERSE PROXY (Caddy `reverse_proxy api:3000`) — service name ke saath configured, ye saare replica addresses resolve karta hai aur round-robins. `--scale` QUEUE workers ke liye real parallelism HAI. Docker SWARM mode aur KUBERNETES dono ek stable per-service virtual address dete hain.',
      },
      {
        task: 'In a comment, list the four hard ceilings of Compose, give the "stay" criteria and the "move" criteria, and name three middle-ground options between Compose and full Kubernetes.',
        taskHi: 'Ek comment mein, Compose ke chaar hard ceilings list karo.',
        hint: 'HARD CEILINGS: (1) CROSS-HOST — one compose = one host, no scheduling across a fleet; (2) HOST-FAILURE SURVIVAL — host dies → everything on it down until a human acts, no failover; (3) HEALTH-GATED ROLLING DEPLOY across machines with auto-rollback — none; (4) AUTOSCALING on CPU/latency/queue-depth — `--scale` is a manual number. (also: no service mesh / fine-grained RBAC / NetworkPolicy / secret rotation / multi-tenant isolation.) STAY if: 1 host has capacity, a few min of reboot downtime is acceptable, 1-2 people operate it, load is predictable. MOVE when: you need automatic host-failure survival with no human, zero-downtime deploys + rollback across many machines, autoscaling, or many teams self-serving. MIDDLE GROUND: Docker Swarm (Compose-like, multi-host, rolling deploys, ~1 day to learn), Nomad (HashiCorp scheduler, containers + binaries), a PaaS (Fly / Render / Railway / Cloud Run / App Runner). Don\'t adopt Kubernetes to avoid a 2-minute reboot.',
        hintHi: 'HARD CEILINGS: (1) CROSS-HOST — ek compose = ek host; (2) HOST-FAILURE SURVIVAL — host marta hai → sab down jab tak human act nahi karta, koi failover nahi; (3) machines ke across auto-rollback ke saath HEALTH-GATED ROLLING DEPLOY — koi nahi; (4) CPU/latency/queue-depth par AUTOSCALING — `--scale` ek manual number hai. STAY agar: 1 host ke paas capacity, kuch min reboot downtime acceptable, 1-2 log operate, load predictable. MOVE jab: aapko automatic host-failure survival, kai machines ke across zero-downtime deploys + rollback, autoscaling chahiye. MIDDLE GROUND: Docker Swarm, Nomad, ek PaaS (Fly / Render / Railway / Cloud Run).',
      },
    ],

    keyTakeaways: [
      'DAILY COMMANDS: `up -d [--wait]` (reconcile — recreates ONLY changed services), `down` (remove containers+network, KEEP volumes — no `-v`!), `ps [-a]`, `logs -f --tail N SERVICE`, `exec SERVICE sh` (shell in a RUNNING container), `run --rm SERVICE CMD` (a NEW one-off container — migrations, a REPL — its own lifecycle, ≠ `exec`), `restart`/`stop`/`start`, `top`/`stats`, `pull`, `config` (run before every new-env `up`), `cp`.',
      'THE DEPLOY LOOP (single host): `cd /opt/app && git pull && docker compose pull && docker compose up -d --wait && docker compose ps`. `up` recreates ONLY services whose image/config/env changed → the DB and proxy keep running, an app deploy causes them no downtime. ROLLBACK is symmetric: point the app\'s image tag back to the previous version, `docker compose up -d` again — only the app container is recreated (fast + deterministic; the old image is still pinned + present).',
      'SCALING ON ONE HOST: `docker compose up -d --scale worker=4` (or `deploy: {replicas: 4}`) — all 4 on THIS host, sharing its CPU/mem/disk. Real parallelism for QUEUE workers (each pulls jobs independently, no LB). For an HTTP service, replicas alone do NOTHING — plain Compose has NO load-balancing VIP; `ports:` maps the host port to ONE replica. You need the REVERSE PROXY configured to treat the replicas as an upstream pool (Caddy `reverse_proxy api:3000`). Docker Swarm + Kubernetes give a per-service load-balanced VIP for free.',
      'THE HARD CEILINGS (things Compose is NOT built to do): (1) CROSS-HOST SCHEDULING — one compose = one host; (2) HOST-FAILURE SURVIVAL — host dies → everything on it is down until a human acts, no other node to reschedule onto; (3) HEALTH-GATED ROLLING DEPLOYS across machines with automatic rollback; (4) AUTOSCALING on CPU/latency/queue-depth (`--scale` is a manual number); plus the platform layer — service mesh, fine-grained RBAC, NetworkPolicy, secret rotation, multi-tenant isolation.',
      'STAY on Compose if: 1 host has capacity, a few minutes of downtime for a host reboot is acceptable, 1-2 people operate it, load is predictable — this is a LEGITIMATE production architecture for a large fraction of real (incl. revenue) services. MOVE when you have a CONCRETE need: automatic host-failure survival with no human, zero-downtime deploys + rollback across many machines, autoscaling, many teams self-serving, or > one machine\'s capacity. THE MIDDLE GROUND (often right, often skipped): Docker SWARM (built into Docker, Compose-like file, multi-host + rolling deploys + LB mesh + secrets, ~1 day to learn), NOMAD, or a PaaS (Fly / Render / Railway / Cloud Run / App Runner). Do NOT adopt Kubernetes to avoid a 2-minute reboot — take on the control plane / ingress / cert-manager / RBAC / node upgrades / on-call only when its problems are actually YOUR problems. And the HOST IS CODE too (VM + firewall + Docker + compose dir + reboot recovery in IaC) so "rebuild the host" is `terraform apply` + restore, ~30 min, not 2 days of archaeology.',
    ],
    keyTakeawaysHi: [
      'DAILY COMMANDS: `up -d [--wait]` (reconcile — SIRF changed services recreate), `down` (containers+network remove, volumes KEEP — koi `-v` nahi!), `ps [-a]`, `logs -f --tail N SERVICE`, `exec SERVICE sh` (ek RUNNING container mein shell), `run --rm SERVICE CMD` (ek NAYA one-off container — migrations — ≠ `exec`), `restart`/`stop`/`start`, `top`/`stats`, `pull`, `config` (har new-env `up` se pehle chalao).',
      'DEPLOY LOOP (single host): `cd /opt/app && git pull && docker compose pull && docker compose up -d --wait && docker compose ps`. `up` SIRF wo services recreate karta hai jinki image/config/env badli → DB aur proxy chalti rehti hain. ROLLBACK symmetric hai: app ka image tag wapas previous version par point karo, phir se `docker compose up -d`.',
      'EK HOST PAR SCALING: `docker compose up -d --scale worker=4` — sab 4 IS host par. QUEUE workers ke liye real parallelism. Ek HTTP service ke liye, replicas akele KUCH nahi karte — plain Compose ke paas KOI load-balancing VIP nahi; `ports:` host port ko EK replica par map karta hai. Aapko REVERSE PROXY chahiye replicas ko ek upstream pool ke roop mein treat karne ke liye. Docker Swarm + Kubernetes ek per-service load-balanced VIP free dete hain.',
      'HARD CEILINGS: (1) CROSS-HOST SCHEDULING — ek compose = ek host; (2) HOST-FAILURE SURVIVAL — host marta hai → sab down jab tak human act nahi karta; (3) machines ke across automatic rollback ke saath HEALTH-GATED ROLLING DEPLOYS; (4) CPU/latency/queue-depth par AUTOSCALING; plus platform layer — service mesh, fine-grained RBAC, NetworkPolicy, secret rotation.',
      'Compose par RAHO agar: 1 host ke paas capacity, ek host reboot ke liye kuch minutes downtime acceptable, 1-2 log operate, load predictable — ye real services ke ek bade fraction ke liye ek LEGITIMATE production architecture hai. MOVE karo jab aapke paas ek CONCRETE need hai. MIDDLE GROUND (aksar sahi, aksar skip): Docker SWARM, NOMAD, ya ek PaaS (Fly / Render / Railway / Cloud Run). Ek 2-minute reboot avoid karne ke liye Kubernetes adopt MAT karo. Aur HOST BHI CODE hai — to "rebuild the host" `terraform apply` + restore hai, ~30 min.',
    ],
  },
];
