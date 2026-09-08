/**
 * DevOps Complete Course — Module 6: Docker Compose & Single-Host Deployment, lessons 1-3.
 *
 * Lesson 1: The Compose file & the model — services / networks / volumes, one file for a
 *           multi-container app, the default network + service-name DNS, `docker compose
 *           config`. VERIFIED against a real `docker compose`.
 * Lesson 2: Dependencies, health & startup order — `depends_on` (short vs `condition:
 *           service_healthy`), healthchecks, `--wait`, restart policies. VERIFIED.
 * Lesson 3: Configuration — env, env_file, `${VAR}` interpolation + `.env`, profiles,
 *           override files (map-merge vs list-append), dev-vs-prod files. VERIFIED.
 *
 * Examples whose `code` begins with "# VERIFY" run against a real `docker compose`
 * (scratchpad/verify-bash.mjs) when a daemon is reachable; otherwise they are treated
 * as prose with realistic output.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_6: CourseLesson[] = [
  {
    slug: 'ops-the-compose-file-and-the-model',
    title: 'The Compose File & the Model',
    titleHi: 'Compose File Aur Model',
    description: 'One YAML file describes a whole multi-container application — every service, the networks that connect them, and the volumes that hold their data — and `docker compose up` brings the lot up together. Services find each other by name over a private network, and `docker compose config` shows you exactly what the file expands to.',
    descriptionHi: 'Ek YAML file ek poore multi-container application ko describe karti hai — har service, wo networks jo unhe connect karte hain, aur wo volumes jo unka data rakhte hain — aur `docker compose up` sabko ek saath laता hai. Services ek doosre ko ek private network par naam se dhoondte hain, aur `docker compose config` aapko exactly dikhता hai ki file kya expand karti hai.',
    difficulty: 'EASY',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A stage play\'s cast-and-set sheet versus hiring each actor by phone one at a time.** Running containers by hand with long `docker run` commands is phoning each actor separately: you have to remember every flag, every port, every link, in the right order, every time. A Compose file is the single sheet that lists the whole production — who is in it (services), the corridors connecting the dressing rooms (networks), the props cupboards that survive between shows (volumes) — and one call ("places, everyone") brings the entire cast on. Anyone can read the sheet and stage the identical show. And `docker compose config` is the sheet with every abbreviation spelled out, so there is no argument later about what "the usual setup" meant.',
      hi: '**Ek stage play ki cast-and-set sheet versus har actor ko phone se ek-ek karke hire karna.** Lambe `docker run` commands se haath se containers chalana har actor ko alag phone karna hai: aapko har flag, har port, har link, sahi order mein, har baar yaad rakhna padta hai. Ek Compose file wo single sheet hai jo poore production ko list karti hai — ismein kaun hai (services), dressing rooms ko connect karne wale corridors (networks), wo props cupboards jo shows ke beech survive karte hain (volumes) — aur ek call poori cast ko le aati hai. Koi bhi sheet padh sakta hai aur identical show stage kar sakta hai. Aur `docker compose config` wo sheet hai jismein har abbreviation spelled out hai.',
    },

    simple: `**docker run x5 (fragile, unrepeatable)   ->   ONE compose file + \`docker compose up\`**
\`\`\`yaml
# compose.yaml   (also: docker-compose.yml — both work; "compose.yaml" is preferred)
name: blog                        # the PROJECT name (prefixes container/network/volume names)

services:                         # each service = one container (or N, with --scale / replicas)
  web:
    image: caddy:2-alpine
    ports: [ "8080:80" ]          # HOST:CONTAINER  — publish a port to the host
    depends_on: [ app ]           # start order (NOT "wait until ready" — see Lesson 2)
  app:
    build: ./app                  # build from a Dockerfile instead of pulling an image
    environment:
      DATABASE_URL: postgres://db:5432/blog
    restart: unless-stopped
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_PASSWORD: secret }
    volumes: [ "pgdata:/var/lib/postgresql/data" ]   # named volume -> persistence

networks:                          # optional; a "default" network is created automatically
  # (custom networks in Lesson 5 — for segmentation)
volumes:
  pgdata:                          # declare the named volume
\`\`\`

**THE MODEL — three kinds of top-level thing:**
\`\`\`
SERVICES   the containers. image OR build, ports, env, volumes, depends_on, healthcheck,
           deploy.resources (limits), restart, command, networks.
NETWORKS   how services talk. by default ALL services join one auto-created bridge network
           named "<project>_default". add custom networks to isolate tiers (Lesson 5).
VOLUMES    named, managed persistent storage (survives the container). declared here,
           mounted into services. (bind mounts + tmpfs too — Lesson 4.)
\`\`\`

**SERVICE DISCOVERY — services reach each other by SERVICE NAME:**
\`\`\`
- Compose runs an embedded DNS on the network; "db" resolves to the db container's IP
- so the app connects to  postgres://db:5432/...  — no IPs, no links, no /etc/hosts
- a published port (ports:) is only for HOST -> container; service-to-service uses the
  container port directly on the private network (no publish needed, and safer)
\`\`\`

**THE LIFECYCLE (Lesson 6 goes deeper):**
\`\`\`
docker compose up -d        create + start everything (-d = detached)
docker compose up -d --wait  ...and block until every service is running/healthy
docker compose ps           what's running, and health
docker compose logs -f web   follow one service's logs
docker compose down          stop + remove containers + the default network (KEEPS volumes)
docker compose down -v       ...and DELETE the named volumes (DATA LOSS)
docker compose config       print the fully-resolved, canonical file (merges + interpolates)
\`\`\`

**\`docker compose config\` is your friend:** it shows the file after variable interpolation,
override merging, and short-form -> long-form expansion. Run it before every \`up\` in a
new environment — it catches a missing \`.env\` var or a bad merge before anything starts.`,

    simpleHi: `**docker run x5 (fragile)   ->   ONE compose file + \`docker compose up\`**
\`\`\`yaml
name: blog                        # PROJECT name (container/network/volume names prefix karta hai)
services:
  web:
    image: caddy:2-alpine
    ports: [ "8080:80" ]          # HOST:CONTAINER
    depends_on: [ app ]           # start order (NOT "wait until ready")
  app:
    build: ./app
    environment:
      DATABASE_URL: postgres://db:5432/blog
    restart: unless-stopped
  db:
    image: postgres:16-alpine
    volumes: [ "pgdata:/var/lib/postgresql/data" ]
volumes:
  pgdata:
\`\`\`

**MODEL — teen top-level cheezein:** SERVICES (containers) · NETWORKS (default se sab ek
auto-created bridge "<project>_default" join karte hain) · VOLUMES (named persistent storage).

**SERVICE DISCOVERY — services ek doosre ko SERVICE NAME se dhoondte hain:**
\`\`\`
- Compose network par ek embedded DNS chalata hai; "db" db container ke IP ko resolve karta hai
- app connect karta hai  postgres://db:5432/...  — koi IPs nahi, koi links nahi
- ek published port (ports:) sirf HOST -> container ke liye; service-to-service private network
  par container port directly use karta hai (publish ki zaroorat nahi, aur safer)
\`\`\`

**LIFECYCLE:**
\`\`\`
docker compose up -d          sab create + start (-d = detached)
docker compose up -d --wait   ...aur block karo jab tak har service running/healthy
docker compose ps             kya chal raha hai
docker compose logs -f web    ek service ke logs follow karo
docker compose down           stop + remove (volumes KEEPS)
docker compose down -v        ...aur named volumes DELETE (DATA LOSS)
docker compose config         fully-resolved canonical file print karo
\`\`\`

**\`docker compose config\` aapka dost hai:** ye file ko variable interpolation, override merging,
aur short-form -> long-form expansion ke baad dikhata hai. Har \`up\` se pehle ek naye environment
mein chalao.`,

    content: `## From \`docker run\` to a file

Running a real application means running several containers that must talk to each other: an app, a database, a cache, a reverse proxy. Doing that with individual \`docker run\` commands means a long, fragile, undocumented shell script — every port, every environment variable, every network, every volume, in the right order, re-typed correctly each time.

**Docker Compose** replaces that with **one declarative file**. The file lists the containers (as *services*), the networks that connect them, and the volumes that persist their data, and \`docker compose up\` reconciles reality to the file: it creates what is missing, recreates what changed, and leaves the rest alone. The file is committed to the repository, so the whole stack is versioned, reviewable, and reproducible by anyone with \`git clone && docker compose up\`.

The file is \`compose.yaml\` (the current name) or \`docker-compose.yml\` (the older name; still works). Compose reads \`compose.yaml\`, then \`compose.override.yaml\` if present (Lesson 3).

## The three top-level sections

### services

Each **service** is a container specification. The common keys:

- **\`image:\`** — pull a prebuilt image — **or** **\`build:\`** — build from a Dockerfile (a path, or \`{context:, dockerfile:, args:}\`). One or the other.
- **\`ports:\`** — publish a container port to the host, \`"HOST:CONTAINER"\`. Only needed for traffic **from the host**; services talk to each other without publishing.
- **\`environment:\`** / **\`env_file:\`** — environment variables (Lesson 3).
- **\`volumes:\`** — mount named volumes, host paths, or tmpfs into the container (Lesson 4).
- **\`depends_on:\`** — start ordering, optionally gated on health (Lesson 2).
- **\`healthcheck:\`** — how Compose decides the service is *ready* (Lesson 2).
- **\`restart:\`** — what to do when the container exits (Lesson 2).
- **\`command:\`** / **\`entrypoint:\`** — override the image's default.
- **\`deploy.resources.limits:\`** — CPU and memory caps (Lesson 5).
- **\`networks:\`** — which networks this service joins (default: all of them).

### networks

By default Compose creates **one bridge network** named \`<project>_default\` and attaches every service to it. That is enough for most stacks. You add **custom networks** to isolate tiers — a \`frontend\` network the reverse proxy and app share, a \`backend\` network the app and database share, so the reverse proxy cannot reach the database directly (Lesson 5).

### volumes

**Named volumes** are Docker-managed persistent storage. You declare a volume under the top-level \`volumes:\` key and mount it into services with \`volumes: ["name:/path/in/container"]\`. The data survives \`docker compose down\`, container recreation, and image updates; it is deleted only by \`docker compose down -v\` or \`docker volume rm\` (Lesson 4).

## The project name

Compose derives a **project name** — from the \`name:\` key in the file, or the \`-p\` flag, or (default) the directory name — and prefixes every container, network, and volume with it: \`blog-web-1\`, \`blog_default\`, \`blog_pgdata\`. This is what keeps two copies of the same stack (say, in two directories) from colliding, and it is what \`docker compose down\` uses to know which resources are "ours".

## Service discovery: talk by name

The single most important thing Compose gives you over raw \`docker run\`: **services on the same network reach each other by service name.** Compose runs an embedded DNS server on each network; a lookup of \`db\` from any service on that network resolves to the \`db\` container's current IP address.

So the app's configuration is \`DATABASE_URL=postgres://db:5432/blog\` — a name, not an IP. When the database container is recreated with a new IP, the name still resolves. There are no \`--link\` flags (deprecated), no editing \`/etc/hosts\`, no service registry to run.

A **published port** (\`ports:\`) is a *separate* concern: it maps a container port to a port on the **host**, for traffic coming from outside the Compose network — your browser, a load balancer, \`curl\` from the host. Service-to-service traffic uses the container's own port on the private network and needs no \`ports:\` entry at all. Publishing a database's port to the host when only the app needs it is a common and unnecessary exposure.

## \`docker compose config\`

\`docker compose config\` prints the **fully resolved** Compose file: after \`.env\` and shell variables are interpolated, after \`compose.override.yaml\` and any \`-f\` files are merged, and after every short-form value is expanded to its canonical long form. Reading it answers "what will actually run" without running anything:

- \`ports: ["8080:80"]\` expands to \`{mode: ingress, target: 80, published: "8080", protocol: tcp}\`.
- \`depends_on: [app]\` expands to \`{app: {condition: service_started, required: true}}\`.
- \`\${DB_HOST:-localhost}\` is replaced with the actual value, and Compose warns if a variable with no default is unset.
- the implicit \`default\` network is shown explicitly.

Run \`docker compose config\` in every new environment before \`up\` — it is the cheapest way to catch a missing environment variable, a typo in an override, or a merge that did not do what you expected.

## What Compose is for

Compose is built for **one host**: your laptop for local development, and a single server for a small production deployment (Lesson 5). It is excellent at both. It is *not* a multi-host orchestrator — no scheduling across machines, no rolling updates with health gating across replicas, no self-healing when a node dies. When you need those, you move to Kubernetes or Nomad (Modules 7–9), but a great many services never need to, and starting with Compose on one box is a legitimate, boring, correct choice (Lesson 6).`,

    contentHi: `## \`docker run\` se ek file tak

Ek real application chalana matlab kई containers chalana jo ek doosre se baat karein: ek app, ek database, ek cache, ek reverse proxy. Ise individual \`docker run\` commands se karna matlab ek lamba, fragile, undocumented shell script.

**Docker Compose** ise **ek declarative file** se replace karta hai. File containers (as *services*), networks, aur volumes list karti hai, aur \`docker compose up\` reality ko file se reconcile karta hai. File repository mein commit hoti hai, to poora stack versioned, reviewable, aur reproducible hai.

## Teen top-level sections

**services** — har service ek container specification hai. Common keys: **\`image:\`** ya **\`build:\`**; **\`ports:\`** (\`"HOST:CONTAINER"\` — sirf host se traffic ke liye); **\`environment:\`**/**\`env_file:\`**; **\`volumes:\`**; **\`depends_on:\`**; **\`healthcheck:\`**; **\`restart:\`**; **\`command:\`**; **\`deploy.resources.limits:\`**; **\`networks:\`**.

**networks** — default se Compose ek bridge network \`<project>_default\` banata hai aur har service ko attach karta hai. Custom networks tiers isolate karne ke liye (Lesson 5).

**volumes** — **Named volumes** Docker-managed persistent storage hain. Top-level \`volumes:\` key ke under declare karo, services mein mount karo. Data \`docker compose down\` survive karta hai; sirf \`docker compose down -v\` se deleted.

## Project name

Compose ek **project name** derive karta hai (\`name:\` key se, ya \`-p\` flag, ya directory name) aur har container, network, aur volume ko prefix karta hai: \`blog-web-1\`, \`blog_default\`.

## Service discovery: naam se baat karo

Sabse important cheez jo Compose deta hai: **same network par services ek doosre ko service name se dhoondte hain.** Compose har network par ek embedded DNS server chalata hai; kisi service se \`db\` ka lookup \`db\` container ke current IP ko resolve karta hai.

To app ki configuration \`DATABASE_URL=postgres://db:5432/blog\` hai — ek naam, ek IP nahi. Ek **published port** (\`ports:\`) ek *alag* concern hai: ye ek container port ko **host** par ek port par map karta hai. Service-to-service traffic private network par container ke apne port ka use karta hai aur koi \`ports:\` entry nahi chahiye.

## \`docker compose config\`

\`docker compose config\` **fully resolved** Compose file print karta hai: \`.env\` aur shell variables interpolate hone ke baad, \`compose.override.yaml\` merge hone ke baad, aur har short-form value canonical long form mein expand hone ke baad. Har naye environment mein \`up\` se pehle chalao — ye ek missing environment variable ya ek bad merge catch karne ka sabse cheap tarika hai.

## Compose kis liye hai

Compose **ek host** ke liye banaya gaya hai: local development ke liye aapka laptop, aur ek small production deployment ke liye ek single server (Lesson 5). Ye ek multi-host orchestrator NAHI hai. Jab aapko wo chahiye, aap Kubernetes ya Nomad par jaate ho, par bahut si services ko kabhi zaroorat nahi.`,

    examples: [
      {
        title: 'docker compose config: what the file really expands to',
        titleHi: 'docker compose config: file really kya expand karti hai',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > compose.yaml <<'EOF'
name: blog
services:
  web:
    image: caddy:2-alpine
    ports: [ "8080:80" ]
    depends_on: [ app ]
  app:
    image: alpine:3.20
    environment: [ "DATABASE_URL=postgres://db:5432/blog" ]
    restart: unless-stopped
EOF

echo "--- short forms in the file expand to canonical long forms ---"
docker compose config 2>/dev/null \\
  | grep -E 'condition:|target: 80|published:|DATABASE_URL:|restart:|name: blog_default'`,
        output: `--- short forms in the file expand to canonical long forms ---
      DATABASE_URL: postgres://db:5432/blog
    restart: unless-stopped
        condition: service_started
        target: 80
        published: "8080"
    name: blog_default`,
        explain: 'The Compose file is written in a compact form, and the config command shows what that form means once fully resolved. The list under depends_on, written as a bare service name, becomes a mapping with an explicit condition of service-started, which is the ordering-only behaviour and not a readiness wait. The port mapping, written as a single host-colon-container string, becomes a structured entry naming the target container port, the published host port as a string, and the protocol. The environment written as a list of name-equals-value strings becomes a mapping. And a network section that was not written at all appears, because Compose always creates a default network for the project and attaches every service to it, with the name formed from the project name. Reading this output before bringing the stack up in an unfamiliar environment is the cheapest possible check: it confirms the ports, the dependencies, the resolved variable values, and the networks are what you intended, and it fails loudly on a missing variable rather than starting a half-configured stack.',
        explainHi: 'Compose file ek compact form mein likhi hai, aur config command dikhata hai ki wo form kya matlab hai jab fully resolved. depends_on ke under list, ek bare service name ke roop mein likhi, ek mapping ban jati hai ek explicit condition service-started ke saath, jo ordering-only behaviour hai aur ek readiness wait nahi. Port mapping, ek single host-colon-container string ke roop mein likhi, ek structured entry ban jati hai. environment jo name-equals-value strings ki ek list ke roop mein likhi hai ek mapping ban jati hai. Aur ek network section jo bilkul nahi likha tha appear hota hai, kyunki Compose hamesha project ke liye ek default network banata hai. Is output ko ek unfamiliar environment mein stack up karne se pehle padhna sabse cheap possible check hai.',
      },
      {
        title: 'One file, up together, and services find each other by name',
        titleHi: 'Ek file, ek saath up, aur services ek doosre ko naam se dhoondte hain',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > compose.yaml <<'EOF'
name: shop
services:
  db:
    image: caddy:2-alpine
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:80"]
      interval: 1s
      retries: 20
  app:
    image: alpine:3.20
    command: ["sleep", "300"]
    depends_on:
      db:
        condition: service_healthy
EOF

docker compose up -d --wait >/dev/null 2>&1 && echo "compose up --wait: every service is up (exit 0)"
docker compose ps --format 'table {{.Service}}\\t{{.Image}}\\t{{.State}}'

echo "--- 'app' resolves the name 'db' on the compose network and reaches it ---"
docker compose exec -T app sh -c 'wget -qO- http://db/ >/dev/null 2>&1 && echo "app -> http://db  OK (service discovery by name, no IPs)"'

docker compose down -v >/dev/null 2>&1 || true`,
        output: `compose up --wait: every service is up (exit 0)
SERVICE   IMAGE            STATE
app       alpine:3.20      running
db        caddy:2-alpine   running
--- 'app' resolves the name 'db' on the compose network and reaches it ---
app -> http://db  OK (service discovery by name, no IPs)`,
        explain: 'A single file describes both services, and one command starts them. The wait flag makes the command block until every service is either running or, for a service with a healthcheck, passing it — so when the command returns successfully, the stack is genuinely ready, not merely started. The process listing confirms both containers are running, each named with the project prefix. The important step is the last one: from inside the app container, a request to the bare name "db" succeeds. Compose attached both services to the project\'s default network and runs a DNS resolver on it, so "db" resolves to the database container\'s current address without any IP being written anywhere, without link flags, and without a hosts-file edit. This is why an application\'s configuration refers to its dependencies by service name — the name is stable across container recreation while the address is not. Note also that the database here publishes no host port; the app reaches it on the private network using the container port directly, which is both simpler and safer than exposing the database to the host.',
        explainHi: 'Ek single file dono services ko describe karti hai, aur ek command unhe start karta hai. wait flag command ko block karta hai jab tak har service ya to running hai ya, ek healthcheck wali service ke liye, ise pass kar rahi hai — to jab command successfully return karta hai, stack genuinely ready hai, sirf started nahi. Process listing confirm karta hai dono containers running hain. Important step aakhiri hai: app container ke andar se, bare name "db" ko ek request succeed karti hai. Compose ne dono services ko project ke default network par attach kiya aur ispar ek DNS resolver chalata hai, to "db" database container ke current address ko resolve karta hai bina kisi IP ke kahin likhe. Isliye ek application ki configuration apni dependencies ko service name se refer karti hai — naam container recreation ke across stable hai jabki address nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `# recreating "the usual docker run commands" as a shell script and calling it done
$ cat deploy.sh
docker network create appnet
docker run -d --name db --network appnet -e POSTGRES_PASSWORD=x postgres:16
docker run -d --name app --network appnet -e DATABASE_URL=... -p 3000:3000 myapp
docker run -d --name proxy --network appnet -p 80:80 -p 443:443 caddy
# -> order-dependent, no health gating, "was it -p 3000:3000 or 3000:8080?",
#    no single 'what is deployed' view, every change is a manual re-run, and the
#    next person has to reverse-engineer the topology from three commands.`,
        right: `# put it in compose.yaml — declarative, versioned, one command:
#   services: { db:..., app:..., proxy:... }
#   volumes:  { pgdata: }
# then:  docker compose up -d --wait   (idempotent: only changed services recreate)
#        docker compose config          (the canonical 'what is deployed')
#        docker compose down            (clean teardown, knows what's 'ours')
# the file IS the documentation, the deploy script, and the review artifact.`,
        why: 'A shell script of docker run commands and a Compose file describe the same containers, but the script is a sequence of imperative steps while the file is a declaration of desired state, and that difference matters in practice. The script must be run in the right order, has no built-in way to wait for a dependency to become ready before starting the next thing, and offers no single place to see the whole topology — the ports, the environment, the volumes are scattered across separate commands and easy to get subtly wrong on a re-type. Re-running it usually means tearing everything down first, because the commands fail if the containers already exist. The Compose file instead states what should be running, and the up command reconciles the current state to it, recreating only what changed and leaving the rest untouched, so a routine deploy is a single idempotent command. The file is committed alongside the code, so it is versioned, diffable in review, and is itself the documentation of how the pieces fit together. The config command turns it into the authoritative answer to what is deployed, and down uses the project name to tear down exactly the resources the file created and nothing else.',
        whyHi: 'docker run commands ka ek shell script aur ek Compose file same containers describe karte hain, par script imperative steps ka ek sequence hai jabki file desired state ka ek declaration hai. Script ko sahi order mein chalana chahiye, ek dependency ke ready hone ka wait karne ka koi built-in tarika nahi hai, aur poori topology dekhne ki koi single jagah nahi deta — ports, environment, volumes alag commands mein scattered hain. Ise re-run karna usually matlab pehle sab kuch tear down karna. Compose file iske bajaay batati hai ki kya running hona chahiye, aur up command current state ko ise reconcile karta hai, sirf jo badla wo recreate karke. File code ke saath commit hoti hai, to ye versioned, review mein diffable hai, aur khud documentation hai.',
      },
      {
        wrong: `# publishing every service's port to the host "so I can reach them"
services:
  db:
    image: postgres:16
    ports: [ "5432:5432" ]        # <- the DB is now reachable from the host / LAN
  redis:
    image: redis:7
    ports: [ "6379:6379" ]        # <- so is Redis, with no auth by default
  app:
    ports: [ "3000:3000" ]
# -> only 'app' needs a host port. db and redis are now attack surface: anything
#    that can reach the host on 5432/6379 talks straight to them.`,
        right: `# publish ONLY what must be reached from outside the compose network:
services:
  db:    { image: postgres:16 }            # no ports: — the app reaches it as 'db:5432'
  redis: { image: redis:7 }                # no ports: — 'redis:6379' on the private net
  app:   { image: myapp, ports: [ "3000:3000" ] }   # the only public entrypoint
# to debug the db from your laptop temporarily:
#   docker compose exec db psql ...        # exec INTO it, no published port
#   docker compose run --rm -p 5432 db ... # or publish just for one session`,
        why: 'A published port maps a container port to a port on the host, making the service reachable by anything that can reach the host on that port — other processes on the machine, and depending on the host firewall, other machines on the network. Services inside a Compose project already reach each other over the private network by name and container port, so publishing a database or cache port is only useful for connecting to it from the host directly, which is a debugging convenience, not a runtime need. Publishing it permanently turns an internal component into external attack surface: a database or a cache with default or weak authentication, directly addressable, is exactly the kind of exposure that turns a minor foothold into a full compromise. The correct default is to publish only the one service that genuinely receives traffic from outside — usually the reverse proxy or the app — and to reach the others for debugging by executing a client inside the network with the exec command, or by publishing a port for a single throwaway session when actually needed.',
        whyHi: 'Ek published port ek container port ko host par ek port par map karta hai, service ko kisi bhi cheez ke liye reachable banata hai jo us port par host tak pahunch sakti hai. Ek Compose project ke andar services already ek doosre ko private network par naam aur container port se reach karti hain, to ek database ya cache port publish karna sirf ise host se directly connect karne ke liye useful hai, jo ek debugging convenience hai, ek runtime need nahi. Ise permanently publish karna ek internal component ko external attack surface mein badalta hai: ek database ya cache jo default ya weak authentication ke saath directly addressable hai wo exactly wo exposure hai jo ek minor foothold ko ek full compromise mein badalta hai. Correct default sirf ek service publish karna hai jo genuinely bahar se traffic receive karti hai.',
      },
      {
        wrong: `# assuming 'docker compose up' in a new environment will "just work"
$ git clone repo && cd repo && docker compose up -d
# -> app crashes on boot: DATABASE_URL is "postgres://db:5432/" — the DB NAME
#    came from \${DB_NAME} in compose.yaml, and there's no .env here, and no
#    default, so it interpolated to empty. you find out from a crash loop.`,
        right: `# run 'docker compose config' FIRST — it interpolates and validates, no containers:
$ docker compose config | grep DATABASE_URL
#   -> WARN: The "DB_NAME" variable is not set. Defaulting to a blank string.
#      DATABASE_URL: postgres://db:5432/
# fix: provide .env (and commit .env.example), or give defaults: \${DB_NAME:-blog}
# only then:  docker compose up -d --wait`,
        why: 'A Compose file frequently contains variable references that are filled in from a local environment file or the shell, and those values are not part of the repository — often deliberately, because some are secrets. When the stack is brought up in an environment that does not have them, and the file does not supply defaults, each unset variable interpolates to an empty string, and the containers start with malformed configuration. The failure then surfaces as a runtime crash, possibly a crash loop, with a symptom several steps removed from the cause. The config command resolves all interpolation and merging without starting anything and prints a warning for every referenced variable that is unset and has no default, so running it first turns a confusing runtime failure into an explicit, immediate message about exactly which variable is missing. The accompanying good practices are to commit an example environment file documenting every variable the stack needs, and to give sensible defaults in the file itself for everything that is not a secret.',
        whyHi: 'Ek Compose file mein aksar variable references hote hain jo ek local environment file ya shell se bhare jaate hain, aur wo values repository ka part nahi hain — aksar deliberately, kyunki kuch secrets hain. Jab stack ek aise environment mein up hota hai jiske paas wo nahi hain, aur file defaults nahi deti, har unset variable ek empty string mein interpolate hota hai, aur containers malformed configuration ke saath start hote hain. Failure phir ek runtime crash ke roop mein surface hoti hai. config command saara interpolation aur merging resolve karta hai bina kuch start kiye aur har referenced variable ke liye ek warning print karta hai jo unset hai. Iske saath good practices ek example environment file commit karna hai.',
      },
    ],

    realWorld: [
      {
        en: '**A "deploy" that was a 60-line `deploy.sh` of `docker run` commands** — nobody could say what was running or safely change one service. Converting it to a `compose.yaml` made `docker compose config` the source of truth and every change a reviewable diff.',
        hi: '**Ek "deploy" jo `docker run` commands ka ek 60-line `deploy.sh` tha** — koi nahi bata sakta tha kya running hai. Ise ek `compose.yaml` mein convert karna.',
      },
      {
        en: '**A Postgres port published to `0.0.0.0:5432` on a cloud VM** found in a scan — an attacker was brute-forcing it within hours of the VM getting a public IP. The `ports:` line was there "for debugging". Removed it; used `docker compose exec db psql` instead.',
        hi: '**Ek cloud VM par `0.0.0.0:5432` par published ek Postgres port** ek scan mein mila — ek attacker ise brute-force kar raha tha.',
      },
      {
        en: '**`docker compose config` in CI as a required check** — it caught a `${STRIPE_KEY}` with no default and no `.env.example` entry before the change ever reached an environment that would have crash-looped on it.',
        hi: '**CI mein ek required check ke roop mein `docker compose config`** — isne ek `${STRIPE_KEY}` catch kiya jiska koi default nahi tha.',
      },
    ],

    interviewQA: [
      {
        q: 'What does Docker Compose give you over a script of `docker run` commands?',
        qHi: 'Docker Compose aapko `docker run` commands ke ek script ke upar kya deta hai?',
        a: 'Compose replaces an imperative sequence of steps with a single declarative file describing desired state. The file lists the services, the networks connecting them, and the volumes persisting their data, and the up command reconciles the running containers to that description — creating what is missing, recreating what changed, and leaving the rest alone — so a routine deploy is one idempotent command rather than a teardown and rebuild. Because it is a file committed with the code, the whole stack is versioned, diffable in code review, and reproducible by anyone who clones the repository. Compose also handles things a script does not: an embedded DNS server on each network so services reach each other by name rather than by IP, start-ordering with an option to wait for a dependency to pass its healthcheck before starting the next service, a project name that namespaces all the resources so multiple copies do not collide and teardown knows exactly what to remove, and a config subcommand that prints the fully resolved file after variable interpolation and override merging, which is both the authoritative statement of what is deployed and a pre-flight check that fails loudly on a missing variable. The trade-off is that Compose targets a single host; it is not a multi-host scheduler.',
        aHi: 'Compose steps ke ek imperative sequence ko ek single declarative file se replace karta hai jo desired state describe karti hai. File services, networks, aur volumes list karti hai, aur up command running containers ko us description se reconcile karta hai — jo missing hai wo banaकर, jo badla wo recreate karke — to ek routine deploy ek idempotent command hai. Kyunki ye code ke saath commit ki gayi ek file hai, poora stack versioned, code review mein diffable, aur reproducible hai. Compose wo cheezein bhi handle karta hai jo ek script nahi karta: har network par ek embedded DNS server, start-ordering ek option ke saath ek dependency ke healthcheck pass karne ka wait karne ke liye, ek project name jo saare resources ko namespace karta hai, aur ek config subcommand jo fully resolved file print karta hai. Trade-off ye hai ki Compose ek single host target karta hai.',
      },
      {
        q: 'How do services in a Compose stack find and reach each other, and how is that different from a published port?',
        qHi: 'Ek Compose stack mein services ek doosre ko kaise dhoondti aur reach karti hain, aur wo ek published port se kaise alag hai?',
        a: 'Compose attaches every service to a network — by default one automatically created bridge network named after the project — and runs an embedded DNS resolver on it. A lookup of a service name from any other service on the same network returns that service\'s current container IP, so an application addresses its database as the name "db" on the database\'s port, and the name keeps resolving correctly even after the database container is recreated with a different IP. There are no link flags and no hosts-file editing. A published port is a different mechanism for a different purpose: it maps a container port to a port on the host machine, so that traffic originating outside the Compose network — a browser, a load balancer, a client on the host — can reach the service. Service-to-service traffic never needs a published port, because it flows over the private network using the container port directly. The practical consequence is that only the services that genuinely receive external traffic, typically just the reverse proxy or the app, should publish a port; publishing a database or cache port exposes an internal component to the host and whatever can reach the host, for no runtime benefit.',
        aHi: 'Compose har service ko ek network par attach karta hai — default se ek automatically created bridge network jo project ke naam par hai — aur ispar ek embedded DNS resolver chalata hai. Kisi doosri service se ek service name ka lookup us service ka current container IP return karta hai, to ek application apne database ko naam "db" se address karta hai, aur naam correctly resolve hota rehta hai even after database container ek alag IP ke saath recreate hota hai. Ek published port ek alag purpose ke liye ek alag mechanism hai: ye ek container port ko host machine par ek port par map karta hai, taaki Compose network ke bahar se originate hone wala traffic service ko reach kar sake. Service-to-service traffic ko kabhi ek published port ki zaroorat nahi. Practical consequence ye hai ki sirf wo services jo genuinely external traffic receive karti hain ek port publish karein.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write a minimal `compose.yaml` for a web app: a `caddy` reverse proxy publishing port 80, an `app` service built from `./app` that depends on `db`, and a `postgres:16` `db` with a named volume for its data. Mark which port is published and why the others are not.',
        taskHi: 'Ek comment mein, ek web app ke liye ek minimal `compose.yaml` likho.',
        hint: '```\nname: myapp\nservices:\n  web:\n    image: caddy:2-alpine\n    ports: ["80:80"]        # <- the ONLY published port: external traffic enters here\n    depends_on: [app]\n  app:\n    build: ./app\n    environment: { DATABASE_URL: "postgres://db:5432/myapp" }   # reaches db by SERVICE NAME\n    restart: unless-stopped\n  db:\n    image: postgres:16-alpine\n    environment: { POSTGRES_PASSWORD: secret }\n    volumes: ["pgdata:/var/lib/postgresql/data"]   # named volume -> data survives down/recreate\nvolumes:\n  pgdata:\n```\napp and db publish NO host port — they talk over the auto-created `myapp_default` network by name+container-port. Publishing db:5432 would expose it to the host for no reason.',
        hintHi: '`web` (caddy, `ports: ["80:80"]` — SIRF yahi published), `app` (`build: ./app`, `DATABASE_URL: postgres://db:5432/myapp` — db ko SERVICE NAME se reach karta hai, `depends_on: [app]`), `db` (postgres:16-alpine, `volumes: ["pgdata:/var/lib/postgresql/data"]`). `volumes: { pgdata: }`. app aur db KOI host port publish nahi karte — wo `myapp_default` network par naam+container-port se baat karte hain.',
      },
      {
        task: 'In a comment, explain what `docker compose config` does, list four things it expands or resolves, and why you should run it before `up` in a new environment.',
        taskHi: 'Ek comment mein, `docker compose config` kya karta hai samjhao.',
        hint: 'It prints the FULLY RESOLVED compose file without starting anything: after (1) `${VAR}` / `.env` interpolation (and it WARNS on any referenced var that is unset with no default), (2) merging `compose.override.yaml` and every `-f` file, (3) expanding short forms to canonical long forms — `ports: ["8080:80"]` → `{target: 80, published: "8080", protocol: tcp}`, `depends_on: [app]` → `{app: {condition: service_started}}`, env list → env map, (4) making the implicit `default` network explicit with its `<project>_default` name. Run it in a new environment first because it turns a confusing runtime crash-loop (empty interpolated var, bad merge) into an explicit "variable X is not set" message before any container starts. Good as a required CI check.',
        hintHi: 'Ye FULLY RESOLVED compose file print karta hai bina kuch start kiye: (1) `${VAR}` / `.env` interpolation ke baad (aur ye WARN karta hai kisi referenced var par jo unset hai bina default), (2) `compose.override.yaml` aur har `-f` file merge karne ke baad, (3) short forms ko canonical long forms mein expand karne ke baad, (4) implicit `default` network ko explicit banane ke baad. Naye environment mein pehle chalao kyunki ye ek confusing runtime crash-loop ko ek explicit "variable X is not set" message mein badalta hai.',
      },
      {
        task: 'In a comment, explain the difference between a service reaching another service (e.g. `app` → `db`) and a client on the host reaching a service, and why publishing a database port is usually a mistake.',
        taskHi: 'Ek comment mein, ek service ke ek doosri service ko reach karne aur host par ek client ke ek service ko reach karne ke beech difference samjhao.',
        hint: 'Service → service: over the private compose network, by SERVICE NAME + CONTAINER port (`postgres://db:5432/...`). Compose runs an embedded DNS so `db` resolves to the db container\'s current IP; no `ports:` entry needed, and the name survives container recreation. Host → service: needs a PUBLISHED port (`ports: ["HOST:CONTAINER"]`) which maps the container port onto the host machine, reachable by anything that can reach the host on that port. Publishing a DB port is usually a mistake because only the app needs the DB and it already has it via the private network — a published `5432` turns an internal component into attack surface (default/weak auth, directly addressable from the host and possibly the LAN). Debug instead with `docker compose exec db psql` or a one-off `docker compose run --rm -p 5432 db`.',
        hintHi: 'Service → service: private compose network par, SERVICE NAME + CONTAINER port se (`postgres://db:5432/...`). Compose ek embedded DNS chalata hai to `db` resolve hota hai; koi `ports:` entry nahi chahiye. Host → service: ek PUBLISHED port chahiye (`ports: ["HOST:CONTAINER"]`) jo container port ko host machine par map karta hai. Ek DB port publish karna usually ek mistake hai kyunki sirf app ko DB chahiye aur ise already private network se milta hai — ek published `5432` ek internal component ko attack surface mein badalta hai. Iske bajaay `docker compose exec db psql` se debug karo.',
      },
    ],

    keyTakeaways: [
      'Docker Compose replaces a fragile script of `docker run` commands with ONE declarative `compose.yaml` (or `docker-compose.yml`) describing DESIRED STATE. `docker compose up` reconciles reality to the file — creates what\'s missing, recreates what CHANGED, leaves the rest alone — so a deploy is one idempotent command. The file is committed → the whole stack is versioned, review-diffable, and reproducible with `git clone && docker compose up`.',
      'THREE top-level sections: SERVICES (each = a container: `image:` OR `build:`, `ports:`, `environment:`/`env_file:`, `volumes:`, `depends_on:`, `healthcheck:`, `restart:`, `command:`, `deploy.resources.limits:`, `networks:`). NETWORKS (default: one auto-created bridge `<project>_default` that ALL services join; add custom networks to isolate tiers — Lesson 5). VOLUMES (named, Docker-managed persistent storage — declared here, mounted into services; survives `down`, killed by `down -v`). The PROJECT NAME (from `name:`, `-p`, or the dir) prefixes every container/network/volume so copies don\'t collide and `down` knows what\'s "ours".',
      'SERVICE DISCOVERY: Compose runs an embedded DNS on each network, so services reach each other by SERVICE NAME + container port (`postgres://db:5432/blog` — a name, not an IP; it keeps resolving after the container is recreated with a new IP). No `--link`, no `/etc/hosts`. A PUBLISHED port (`ports: ["HOST:CONTAINER"]`) is a SEPARATE concern — it maps a container port onto the HOST for traffic from OUTSIDE the compose network (browser, LB, host `curl`). Service-to-service needs NO `ports:` entry. Publishing a DB/cache port when only the app needs it = needless attack surface; debug with `docker compose exec` instead.',
      '`docker compose config` prints the FULLY RESOLVED file WITHOUT starting anything: after `${VAR}`/`.env` interpolation (WARNS on any unset var with no default), after merging `compose.override.yaml` + every `-f` file, after expanding short forms → canonical long forms (`ports: ["8080:80"]` → `{target: 80, published: "8080", protocol: tcp}`; `depends_on: [app]` → `{app: {condition: service_started}}`), and it shows the implicit `default` network explicitly. RUN IT before every `up` in a new environment / as a CI check — it turns a confusing runtime crash-loop (empty interpolated var, bad merge) into an explicit message before any container starts.',
      'LIFECYCLE: `docker compose up -d` (create+start detached), `up -d --wait` (block until every service is running/healthy), `ps` (what\'s running + health), `logs -f <svc>` (follow), `down` (stop+remove containers+default network, KEEPS volumes), `down -v` (ALSO deletes named volumes = DATA LOSS), `config` (canonical file). Compose is built for ONE HOST — laptop dev + a single small-prod server (both excellent). It is NOT a multi-host scheduler (no cross-node scheduling, no health-gated rolling updates across replicas, no self-healing when a node dies) — that\'s Kubernetes/Nomad (Modules 7-9), but many services never need it and "Compose on one box" is a legitimate, boring, correct choice.',
    ],
    keyTakeawaysHi: [
      'Docker Compose `docker run` commands ke ek fragile script ko ONE declarative `compose.yaml` se replace karta hai jo DESIRED STATE describe karti hai. `docker compose up` reality ko file se reconcile karta hai — jo missing hai wo banata hai, jo BADLA wo recreate karta hai, baaki ko chhodta hai. File commit hoti hai → poora stack versioned, review-diffable, reproducible.',
      'TEEN top-level sections: SERVICES (har ek = ek container: `image:` YA `build:`, `ports:`, `environment:`, `volumes:`, `depends_on:`, `healthcheck:`, `restart:`, `deploy.resources.limits:`). NETWORKS (default: ek auto-created bridge `<project>_default` jo SAB services join karte hain; custom networks tiers isolate karne ke liye). VOLUMES (named, Docker-managed persistent storage — `down` survive karta hai, `down -v` se marta hai). PROJECT NAME (`name:`/`-p`/dir se) har container/network/volume ko prefix karta hai.',
      'SERVICE DISCOVERY: Compose har network par ek embedded DNS chalata hai, to services ek doosre ko SERVICE NAME + container port se reach karti hain (`postgres://db:5432/blog` — ek naam, ek IP nahi). Koi `--link` nahi, koi `/etc/hosts` nahi. Ek PUBLISHED port (`ports: ["HOST:CONTAINER"]`) ek ALAG concern hai — ye ek container port ko HOST par map karta hai compose network ke BAHAR se traffic ke liye. Service-to-service ko KOI `ports:` entry nahi chahiye. Ek DB/cache port publish karna jab sirf app ko chahiye = needless attack surface.',
      '`docker compose config` FULLY RESOLVED file print karta hai BINA kuch start kiye: `${VAR}`/`.env` interpolation ke baad (kisi unset var par WARN), `compose.override.yaml` + har `-f` file merge karne ke baad, short forms → canonical long forms expand karne ke baad, aur implicit `default` network explicitly dikhata hai. Har `up` se pehle ek naye environment mein / ek CI check ke roop mein CHALAO.',
      'LIFECYCLE: `up -d` (create+start detached), `up -d --wait` (block jab tak har service running/healthy), `ps`, `logs -f <svc>`, `down` (stop+remove, volumes KEEPS), `down -v` (named volumes BHI delete = DATA LOSS), `config`. Compose ONE HOST ke liye banaya gaya hai — laptop dev + ek single small-prod server. Ye ek multi-host scheduler NAHI hai — wo Kubernetes/Nomad hai, par bahut si services ko kabhi zaroorat nahi.',
    ],
  },

  {
    slug: 'ops-compose-dependencies-health-and-startup-order',
    title: 'Dependencies, Health & Startup Order',
    titleHi: 'Dependencies, Health Aur Startup Order',
    description: '`depends_on` on its own only orders container *starts* — it does not wait for a service to be ready. `condition: service_healthy` plus a real healthcheck is what makes "start the app after the database can actually accept queries" true. Restart policies decide what happens when a container exits.',
    descriptionHi: '`depends_on` akela sirf container *starts* order karta hai — ye ek service ke ready hone ka wait nahi karta. `condition: service_healthy` plus ek real healthcheck wo hai jo "app ko database ke actually queries accept kar sakne ke baad start karo" ko true banata hai. Restart policies decide karti hain ki jab ek container exit karta hai to kya hota hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**Telling the kitchen to start plating "after" the oven is on, versus after the food is actually cooked.** Plain `depends_on` is "start the oven first, then start plating" — the sequence is right, but the oven being *switched on* is not the same as the roast being *ready*, and the plates go out with raw food. `condition: service_healthy` is "do not plate until the meat thermometer reads done" — an actual check of readiness, not just of existence. The healthcheck is that thermometer: a probe the service passes only when it can really do its job. And the restart policy is the rule for a dropped tray: pick it up and re-serve (`unless-stopped`), or after three drops assume the waiter is the problem and stop asking them (`on-failure:3`).',
      hi: '**Kitchen ko batana ki plating "oven on hone ke baad" shuru karo, versus food ke actually cook hone ke baad.** Plain `depends_on` "pehle oven start karo, phir plating" hai — sequence sahi hai, par oven ka *switched on* hona roast ke *ready* hone jaisa nahi hai, aur plates raw food ke saath jaate hain. `condition: service_healthy` "meat thermometer done padhne tak plate mat karo" hai — readiness ka ek actual check. Healthcheck wo thermometer hai. Aur restart policy ek gire tray ke liye rule hai: ise uthao aur re-serve karo (`unless-stopped`), ya teen drops ke baad maan lo waiter problem hai (`on-failure:3`).',
    },

    simple: `**\`depends_on\` — SHORT form only orders STARTS, does NOT wait for readiness:**
\`\`\`yaml
services:
  app:
    depends_on: [ db ]        # Compose starts 'db' BEFORE 'app'. that's ALL it does.
                              # 'db' container is "started" the instant its process launches —
                              # Postgres still needs ~1-3s to accept connections. app races it
                              # and crashes with "connection refused" on boot.
\`\`\`

**\`depends_on\` — LONG form with a CONDITION actually waits:**
\`\`\`yaml
services:
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]   # the readiness probe
      interval: 2s
      timeout: 3s
      retries: 15
      start_period: 5s        # grace window: failures here don't count
  app:
    depends_on:
      db:
        condition: service_healthy     # app starts only after db's healthcheck PASSES
      cache:
        condition: service_started     # (the old behaviour, explicitly)
      migrate:
        condition: service_completed_successfully   # wait for a one-shot job to exit 0
\`\`\`
conditions:  \`service_started\` · \`service_healthy\` · \`service_completed_successfully\`

**HEALTHCHECK anatomy:**
\`\`\`
test:          ["CMD", "binary", "arg"]        exec form, no shell
               ["CMD-SHELL", "cmd || other"]   run via /bin/sh -c
interval:      time between checks (default 30s)
timeout:       a single check must finish within this (default 30s)
retries:       consecutive failures before "unhealthy" (default 3)
start_period:  startup grace — failures don't count toward retries, but a PASS
               inside it flips to healthy immediately (default 0s)
\`\`\`
\`docker compose ps\` shows \`(healthy)\` / \`(unhealthy)\` / \`(health: starting)\`.
\`docker compose up --wait\` blocks until every service is healthy (or running, if no healthcheck).

**RESTART POLICIES — what to do when the container EXITS:**
\`\`\`
no                (default)     never restart
on-failure        restart only on non-zero exit, forever
on-failure:3      ...at most 3 times, then give up (container stays 'exited')
always            restart on ANY exit, even exit 0; and on daemon/host restart
unless-stopped    like 'always', BUT not if you explicitly 'docker compose stop' it
\`\`\`
For a long-running service: \`unless-stopped\`. For a batch job that should run once: \`no\`
(or \`on-failure\` if a transient failure is worth retrying).

**Restart is NOT self-healing across nodes** — it restarts the container ON THE SAME HOST.
If the host dies, nothing restarts it. That's the Compose ceiling (Lesson 6).`,

    simpleHi: `**\`depends_on\` — SHORT form sirf STARTS order karta hai, readiness ka wait NAHI:**
\`\`\`yaml
services:
  app:
    depends_on: [ db ]        # Compose 'db' ko 'app' se PEHLE start karta hai. bas.
                              # 'db' container "started" hai jis instant iska process launch hota hai —
                              # Postgres ko abhi ~1-3s chahiye connections accept karne ke liye.
\`\`\`

**\`depends_on\` — LONG form ek CONDITION ke saath actually wait karta hai:**
\`\`\`yaml
services:
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 2s
      retries: 15
      start_period: 5s
  app:
    depends_on:
      db:
        condition: service_healthy               # app sirf db ka healthcheck PASS hone ke baad start
      migrate:
        condition: service_completed_successfully  # ek one-shot job ke exit 0 ka wait
\`\`\`
conditions:  \`service_started\` · \`service_healthy\` · \`service_completed_successfully\`

**HEALTHCHECK anatomy:** \`test:\` (\`["CMD",...]\` exec / \`["CMD-SHELL","..."]\` shell) · \`interval:\`
(checks ke beech, default 30s) · \`timeout:\` (default 30s) · \`retries:\` ("unhealthy" se pehle
consecutive failures, default 3) · \`start_period:\` (startup grace — failures count nahi hote).
\`docker compose ps\` \`(healthy)\`/\`(unhealthy)\`/\`(health: starting)\` dikhata hai.
\`docker compose up --wait\` block karta hai jab tak har service healthy (ya running, agar no healthcheck).

**RESTART POLICIES — jab container EXIT kare to kya karo:**
\`\`\`
no                (default)     kabhi restart nahi
on-failure        sirf non-zero exit par, forever
on-failure:3      ...max 3 baar, phir give up (container 'exited' rehta hai)
always            KISI bhi exit par restart, even exit 0; aur daemon/host restart par
unless-stopped    'always' jaisa, PAR nahi agar aapne explicitly 'docker compose stop' kiya
\`\`\`
Ek long-running service ke liye: \`unless-stopped\`. Ek batch job ke liye jo ek baar chale: \`no\`.

**Restart nodes ke across self-healing NAHI hai** — ye container ko USI HOST par restart karta hai.
Agar host mar jaata hai, kuch ise restart nahi karta. Wo Compose ceiling hai (Lesson 6).`,

    content: `## \`depends_on\` orders starts, not readiness

The short form of \`depends_on\` is a list of service names, and it does exactly one thing: it makes Compose **start those services before this one**, and stop them after. It says nothing about whether the dependency is *ready to be used*.

A container is "started" the moment its main process begins executing. A PostgreSQL container is started in a few hundred milliseconds, but PostgreSQL itself then spends one to three seconds initialising before it accepts connections; on first run, with an empty data directory, it runs initdb and takes longer. An app that connects to the database in its startup code, ordered after the database only by the short \`depends_on\`, will very often lose the race and crash with "connection refused". Sometimes it works — on a warm machine, on a subsequent run — which makes the failure intermittent and confusing.

## \`condition:\` makes it wait

The long form of \`depends_on\` is a mapping from each dependency to a **condition**:

- **\`service_started\`** — the old behaviour, made explicit: proceed as soon as the dependency's container has started.
- **\`service_healthy\`** — proceed only when the dependency's **healthcheck is passing**. This is what you want for a database, a message broker, any service the app must actually talk to on boot.
- **\`service_completed_successfully\`** — proceed only when the dependency's container has **exited with status 0**. This is for one-shot jobs: a database migration service that runs migrations and exits, a fixture loader, an asset builder. The app waits for it to finish.

\`\`\`yaml
services:
  migrate:
    image: myapp
    command: ["./migrate"]        # runs, then exits
  app:
    image: myapp
    depends_on:
      db:      { condition: service_healthy }
      migrate: { condition: service_completed_successfully }
\`\`\`

Here Compose starts \`db\`, waits for it to be healthy, then runs \`migrate\` to completion, then starts \`app\`.

## The healthcheck

\`service_healthy\` needs the dependency to *have* a healthcheck. A healthcheck is a command Compose runs inside the container on a schedule; the service is **healthy** when it exits 0, **unhealthy** after a number of consecutive failures.

\`\`\`yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres -d appdb"]
  interval: 2s          # run the check every 2 seconds
  timeout: 3s           # each check must complete within 3 seconds or it counts as a failure
  retries: 15           # 15 consecutive failures -> unhealthy
  start_period: 10s     # for the first 10s, failures do NOT count toward 'retries';
                        # a success during this window flips straight to healthy
\`\`\`

- **\`test\`** — \`["CMD", ...]\` runs the command directly (no shell); \`["CMD-SHELL", "..."]\` runs it via \`/bin/sh -c\` so you can use pipes and \`||\`. \`["NONE"]\` disables a healthcheck inherited from the image.
- The command must exist **in the image**. \`curl\` is often not present in minimal images; \`wget\` (busybox) usually is; database images ship their own readiness tools (\`pg_isready\`, \`mysqladmin ping\`, \`redis-cli ping\`).
- **\`start_period\`** is the important tuning knob: it is the expected startup time during which failures are ignored, so a slow-starting service does not get marked unhealthy before it has had a chance to come up.

Many official images (Postgres, MySQL, Redis, RabbitMQ) now ship a **built-in healthcheck**, so \`condition: service_healthy\` works without you writing one — but check, because some do not, and a missing healthcheck makes \`service_healthy\` wait forever.

## \`docker compose up --wait\`

Without \`--wait\`, \`docker compose up -d\` returns as soon as the containers are *created and started*. With \`--wait\`, it blocks until every service is **running and (if it has a healthcheck) healthy**, and it exits non-zero if any service becomes unhealthy or exits within the timeout. This is what you use in a deploy script or CI: \`docker compose up -d --wait\` means "the stack is actually up" when the command returns, not "the containers exist".

## Restart policies

\`restart:\` controls what the Docker daemon does when a container's main process **exits**:

| Value | Restarts on… | Notes |
|---|---|---|
| \`no\` | never | the default |
| \`on-failure\` | non-zero exit only | retries forever |
| \`on-failure:N\` | non-zero exit, up to **N** times | then the container stays \`exited\`; the count resets if the container runs long enough |
| \`always\` | **any** exit (including 0), plus daemon start | a container that exits 0 will be restarted immediately — usually not what you want |
| \`unless-stopped\` | any exit, plus daemon start — **unless** you ran \`docker compose stop\` on it | the sensible choice for a long-running service |

For a **long-running service** (web server, worker), use \`unless-stopped\`: it survives crashes and host reboots, but respects a deliberate stop. For a **one-shot job** (migration, backup), use \`no\` — or \`on-failure\` if a transient failure (network blip) is worth an automatic retry, but be careful that the job is idempotent.

\`on-failure:N\` is useful for catching a genuinely broken service: if it has failed N times in quick succession, restarting again will not help, and leaving it \`exited\` makes the failure visible instead of hiding it behind an endless restart loop that looks like the service is "running".

## The ceiling

The restart policy restarts the container **on the same host**. It is not orchestration: if the container is fine but the *host* goes down, nothing brings the service up elsewhere, because Compose has no concept of "elsewhere". Health-gated startup ordering and restart-on-failure are real reliability features for a single box, and for many services a single box with \`restart: unless-stopped\` and good backups is enough — but the moment you need a service to survive a host failure automatically, you have reached the edge of what Compose does (Lesson 6, Modules 7–9).`,

    contentHi: `## \`depends_on\` starts order karta hai, readiness nahi

\`depends_on\` ka short form service names ki ek list hai, aur ye exactly ek cheez karta hai: ye Compose ko **un services ko is se pehle start** karwata hai. Ye nahi batata ki dependency *use karne ke liye ready* hai ya nahi.

Ek container "started" hai jis moment iska main process execute karna shuru karta hai. Ek PostgreSQL container kuch sौ milliseconds mein started hai, par PostgreSQL khud phir ek se teen seconds initialising mein bitata hai connections accept karne se pehle. Ek app jo apne startup code mein database se connect karta hai, database ke baad sirf short \`depends_on\` se ordered, aksar race haar jaata hai aur "connection refused" se crash karta hai.

## \`condition:\` ise wait karwata hai

\`depends_on\` ka long form har dependency se ek **condition** ki ek mapping hai:
- **\`service_started\`** — purana behaviour, explicit.
- **\`service_healthy\`** — sirf jab dependency ka **healthcheck pass kar raha hai**. Ye aapko ek database, ek message broker ke liye chahiye.
- **\`service_completed_successfully\`** — sirf jab dependency ka container **status 0 ke saath exit** ho chuka hai. Ye one-shot jobs ke liye hai: ek database migration service.

## Healthcheck

Ek healthcheck ek command hai jo Compose container ke andar ek schedule par chalata hai; service **healthy** hai jab ye exit 0 karta hai, **unhealthy** kai consecutive failures ke baad.

- **\`test\`** — \`["CMD", ...]\` command directly chalata hai; \`["CMD-SHELL", "..."]\` ise \`/bin/sh -c\` se chalata hai.
- Command **image mein** exist karna chahiye. \`curl\` aksar minimal images mein present nahi; \`wget\` (busybox) usually hai; database images apne readiness tools ship karte hain (\`pg_isready\`, \`redis-cli ping\`).
- **\`start_period\`** important tuning knob hai: ye expected startup time hai jiske dauran failures ignore hote hain.

Kai official images (Postgres, MySQL, Redis) ab ek **built-in healthcheck** ship karte hain.

## \`docker compose up --wait\`

\`--wait\` ke bina, \`docker compose up -d\` return karta hai jaise hi containers *created aur started* hain. \`--wait\` ke saath, ye block karta hai jab tak har service **running aur (agar iska healthcheck hai) healthy** hai. Ise ek deploy script ya CI mein use karo.

## Restart policies

\`restart:\` control karta hai ki jab ek container ka main process **exit** karta hai to Docker daemon kya karta hai: \`no\` (default), \`on-failure\` (non-zero exit par, forever), \`on-failure:N\` (max N baar), \`always\` (**koi bhi** exit par), \`unless-stopped\` (\`always\` jaisa, par nahi agar aapne \`docker compose stop\` kiya).

Ek **long-running service** ke liye \`unless-stopped\` use karo. Ek **one-shot job** ke liye \`no\`.

## Ceiling

Restart policy container ko **usi host par** restart karta hai. Ye orchestration nahi hai: agar *host* down ho jaata hai, kuch service ko kahin aur up nahi karta. Bahut si services ke liye ek single box \`restart: unless-stopped\` aur good backups ke saath kaafi hai — par jis moment aapko ek service ko ek host failure automatically survive karne ki zaroorat hai, aap Compose ke edge par pahunch gaye ho.`,

    examples: [
      {
        title: 'condition: service_healthy — the app waits for a real readiness probe',
        titleHi: 'condition: service_healthy — app ek real readiness probe ka wait karta hai',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > compose.yaml <<'EOF'
name: gate
services:
  db:
    image: caddy:2-alpine
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:80"]
      interval: 1s
      timeout: 2s
      retries: 20
      start_period: 2s
  app:
    image: alpine:3.20
    command: ["sh", "-c", "echo 'app booted - db was already healthy' && sleep 300"]
    depends_on:
      db:
        condition: service_healthy
EOF

docker compose up -d --wait >/dev/null 2>&1 && echo "up --wait returned 0 -> the whole stack is READY, not just started"
echo "--- db health, then the app's boot log ---"
docker compose ps db --format '{{.Service}} {{.Health}}'
docker compose logs app --no-log-prefix
docker compose down -v >/dev/null 2>&1 || true`,
        output: `up --wait returned 0 -> the whole stack is READY, not just started
--- db health, then the app's boot log ---
db healthy
app booted - db was already healthy`,
        explain: 'The database service declares a healthcheck: a command run inside its container every second that succeeds only when the service is answering requests. The app declares a dependency on the database with the condition that the database be healthy, not merely started. When the stack is brought up with the wait flag, Compose starts the database, then repeatedly runs its healthcheck, and does not start the app until the healthcheck passes; the wait flag then holds the command until every service is up, so a zero exit means the stack is genuinely ready. The process listing confirms the database is in the healthy state, and the app\'s log line, which its startup command prints, shows it ran only after that point. Contrast this with a plain dependency list, which would start the app the instant the database container\'s process launched, before the database could accept a connection, causing the app to fail on boot on a cold machine and succeed on a warm one — the classic intermittent startup bug that this condition eliminates.',
        explainHi: 'Database service ek healthcheck declare karta hai: ek command jo iske container ke andar har second chalti hai jo sirf tab succeed karti hai jab service requests answer kar rahi hai. App database par ek dependency declare karta hai is condition ke saath ki database healthy ho, sirf started nahi. Jab stack wait flag ke saath up hota hai, Compose database start karta hai, phir baar-baar iska healthcheck chalata hai, aur app ko start nahi karta jab tak healthcheck pass nahi karta. Process listing confirm karta hai database healthy state mein hai, aur app ki log line dikhati hai ye sirf us point ke baad chali. Ise ek plain dependency list se contrast karo, jo app ko us instant start karti jab database container ka process launch hota, database ke ek connection accept karne se pehle.',
      },
      {
        title: 'Restart policy: on-failure:3 retries a broken service, then stops',
        titleHi: 'Restart policy: on-failure:3 ek broken service retry karta hai, phir ruk jaata hai',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > compose.yaml <<'EOF'
name: rst
services:
  flaky:
    image: alpine:3.20
    restart: "on-failure:3"
    command: ["sh", "-c", "echo boot; exit 1"]
EOF

docker compose up -d >/dev/null 2>&1
# wait for the restart policy to give up (Docker backs off between restarts)
for _ in $(seq 1 30); do
  [ "$(docker inspect --format '{{.State.Status}}' rst-flaky-1 2>/dev/null)" = exited ] && break
  sleep 1
done
echo "final restart count: $(docker inspect --format '{{.RestartCount}}' rst-flaky-1)"
echo "final status:        $(docker inspect --format '{{.State.Status}}' rst-flaky-1)"
echo "boot attempts logged: $(docker compose logs flaky --no-log-prefix 2>&1 | grep -c '^boot')"
docker compose down -v >/dev/null 2>&1 || true`,
        output: `final restart count: 3
final status:        exited
boot attempts logged: 4`,
        explain: 'The service is configured to restart on a non-zero exit, but at most three times. Its command prints a line and then exits with a failure code immediately. Compose starts it once; it fails; the daemon restarts it; it fails again; and this continues until the restart count reaches the configured limit of three, after which the daemon stops restarting it and the container is left in the exited state. The log therefore contains the boot line four times: the original run plus three restarts. This bounded policy is deliberately different from an unlimited on-failure or an always policy. A service that has failed several times in immediate succession is not going to be fixed by trying again; an unlimited restart loop would keep it in a state that looks superficially like "running" while it is actually cycling, hiding the problem. Leaving the container exited after a few attempts makes the failure visible in the process listing and in monitoring, which is the behaviour you want for catching a genuinely broken deployment rather than papering over it.',
        explainHi: 'Service ek non-zero exit par restart karne ke liye configured hai, par max teen baar. Iska command ek line print karta hai aur phir turant ek failure code ke saath exit karta hai. Compose ise ek baar start karta hai; ye fail hota hai; daemon ise restart karta hai; ye phir fail hota hai; aur ye continue hota hai jab tak restart count configured limit teen tak nahi pahunchta, jiske baad daemon ise restart karna band karta hai aur container exited state mein chhoda jaata hai. Log isliye boot line chaar baar contain karta hai. Ye bounded policy deliberately ek unlimited on-failure ya ek always policy se alag hai. Ek service jo immediate succession mein kai baar fail hui hai phir try karne se fix nahi hogi.',
      },
    ],

    mistakes: [
      {
        wrong: `# depends_on: [db]  and expecting the app to wait for Postgres to be ready
services:
  app:
    image: myapp
    depends_on: [ db ]        # <- ordering ONLY
  db:
    image: postgres:16
# -> on a cold machine: 'db' container starts, app starts 200ms later, app's
//    connection pool tries to connect -> "connection refused" -> app exits.
//    on a warm machine it happens to work. "works on my machine, fails in CI."`,
        right: `services:
  db:
    image: postgres:16-alpine    # ships a built-in healthcheck (verify: docker inspect)
    # or add one:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 2s
      retries: 15
      start_period: 5s
  app:
    image: myapp
    depends_on:
      db: { condition: service_healthy }   # <- wait for READY, not just started
# ALSO: the app should retry its DB connection on boot anyway — healthchecks
# reduce the race, app-level retry eliminates it (and covers mid-run blips).`,
        why: 'The short form of depends_on establishes only the order in which containers are started and stopped; it does not check that a dependency is able to serve requests. A container counts as started as soon as its process begins, but a database then needs time to initialise before it accepts connections, and on first run with an empty data directory it needs considerably more. An app ordered after the database by the short form still begins its own startup, including connecting to the database, while the database is still initialising, so on a machine where the database is slow to come up the connection is refused and the app fails. On a machine where the database happens to be ready in time it works, which makes the bug appear only sometimes and often only in certain environments. The long form with the healthy condition makes Compose wait for the database\'s healthcheck to pass before starting the app, which removes the race at startup. It is still good practice for the app to retry its database connection with backoff regardless, because that also handles the database briefly becoming unavailable while the app is already running, which no startup ordering can address.',
        whyHi: 'depends_on ka short form sirf wo order establish karta hai jismein containers start aur stop hote hain; ye check nahi karta ki ek dependency requests serve kar sakti hai. Ek container started count hota hai jaise hi iska process shuru hota hai, par ek database phir time chahiye initialise hone ke liye connections accept karne se pehle. Ek app jo short form se database ke baad ordered hai phir bhi apni startup shuru karti hai, database se connect karna include, jabki database abhi bhi initialising hai. Ek machine par jahan database ready hone mein slow hai connection refuse hoti hai aur app fail hoti hai. Long form healthy condition ke saath Compose ko database ke healthcheck ke pass hone ka wait karwata hai. App ke liye phir bhi apna database connection backoff ke saath retry karna good practice hai.',
      },
      {
        wrong: `# a healthcheck that uses a tool the image doesn't have
services:
  api:
    image: node:20-alpine
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
# -> node:20-alpine has NO curl. every check fails with "curl: not found".
//    after 'retries' the service is 'unhealthy' FOREVER, and anything with
//    'condition: service_healthy' on it waits forever. the app never starts.`,
        right: `# use a tool that IS in the image, or add one, or use the language runtime:
healthcheck:
  # busybox wget is in alpine images:
  test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/health"]
  # OR use node itself (always present):
  # test: ["CMD-SHELL", "node -e \\"fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1))\\""]
  interval: 5s
  timeout: 3s
  retries: 3
  start_period: 20s          # node apps take a few seconds to listen
# verify: docker compose up, then 'docker compose ps' — it should reach (healthy)`,
        why: 'A healthcheck is a command executed inside the container, so the command and everything it invokes must be present in the image. Minimal base images deliberately exclude common tools; an Alpine-based image typically has the BusyBox applets, which include a limited wget, but not curl, and a distroless or scratch image may have no shell or utilities at all. A healthcheck that calls a missing tool fails on every run with a not-found error, the service is marked unhealthy once the retry count is exhausted, and it never recovers because the check can never succeed. Any service that depends on this one with the healthy condition then waits indefinitely, and the stack never finishes starting. The fix is to write the check using something known to be in the image: the BusyBox wget for a simple HTTP probe on Alpine, the database\'s own bundled readiness tool for a database, or the application\'s language runtime, which is always present, to make the request. After adding a healthcheck, bringing the stack up and watching the process listing reach the healthy state confirms the check actually works.',
        whyHi: 'Ek healthcheck ek command hai jo container ke andar execute hoti hai, to command aur jo kuch ye invoke karti hai wo image mein present hona chahiye. Minimal base images deliberately common tools exclude karte hain; ek Alpine-based image mein typically BusyBox applets hote hain, jismein ek limited wget include hai, par curl nahi. Ek healthcheck jo ek missing tool call karta hai har run par ek not-found error se fail hota hai, service unhealthy mark hoti hai, aur ye kabhi recover nahi hoti. Koi bhi service jo is par healthy condition ke saath depend karti hai phir indefinitely wait karti hai. Fix check ko kisi aisi cheez se likhna hai jo image mein known ho: Alpine par BusyBox wget, ek database ke liye iska apna bundled readiness tool, ya application ka language runtime.',
      },
      {
        wrong: `# restart: always on a one-shot job, or 'no' on a service that must stay up
services:
  backup:
    image: mytools
    command: ["./run-backup"]     # runs, exits 0
    restart: always               # <- restarts the backup IMMEDIATELY, forever.
                                  #    a backup loop hammering the DB and filling disk.
  web:
    image: myapp
    # no restart: policy -> 'no' -> if the app crashes once at 3am, it stays down
    #                                until someone notices. no auto-recovery.`,
        right: `services:
  backup:
    command: ["./run-backup"]
    restart: "on-failure"          # only re-run if it FAILED; a successful run exits and stays exited
    # (or restart: no, and schedule it with a cron / an external scheduler)
  web:
    image: myapp
    restart: unless-stopped       # survives crashes + host reboots; respects 'compose stop'
    healthcheck: { test: [...], ... }   # + so 'ps' and monitoring see real health`,
        why: 'The restart policy has to match the nature of the workload. A job that is supposed to run once and finish exits with a success code when it is done; an always policy restarts it on any exit including success, so it runs again immediately and forever, which for a backup or migration job means continuous load on the database, filling disk, or repeated side effects. Such a job wants either no restart, with scheduling handled externally, or on-failure, so that only a genuine error triggers a re-run. A long-running service has the opposite requirement: with no policy, the default is not to restart, so a single crash leaves it down until a human intervenes, losing the automatic recovery that a single-host deployment can and should provide. Such a service wants unless-stopped, which restarts it after a crash and after a host reboot but not after a deliberate stop, combined with a healthcheck so that its actual state is visible rather than assumed from the fact that a container exists.',
        whyHi: 'Restart policy ko workload ki nature se match karna chahiye. Ek job jo ek baar chalne aur finish hone waala hai jab ye done hota hai ek success code ke saath exit karta hai; ek always policy ise kisi bhi exit par restart karta hai success include, to ye turant aur forever phir chalta hai, jo ek backup ya migration job ke liye matlab database par continuous load, disk bharna, ya repeated side effects. Aise job ko ya to no restart chahiye, scheduling externally handled, ya on-failure. Ek long-running service ka opposite requirement hai: no policy ke saath, default restart na karna hai, to ek single crash ise down chhodta hai. Aise service ko unless-stopped chahiye, ek healthcheck ke saath combined.',
      },
    ],

    realWorld: [
      {
        en: '**"App crashes on boot in CI but not locally"** — `depends_on: [db]` with no condition; CI\'s cold containers lost the race to Postgres init every time. `condition: service_healthy` + a `pg_isready` healthcheck made it deterministic.',
        hi: '**"App CI mein boot par crash hoti hai par locally nahi"** — `depends_on: [db]` bina condition; CI ke cold containers har baar Postgres init se race haar jaate the.',
      },
      {
        en: '**A `condition: service_healthy` that waited forever** — the image\'s healthcheck ran `curl`, which wasn\'t installed. Switched to `wget --spider`; the stack came up in seconds.',
        hi: '**Ek `condition: service_healthy` jo forever wait karta tha** — image ka healthcheck `curl` chalata tha, jo installed nahi tha.',
      },
      {
        en: '**A backup container with `restart: always`** ran the backup script in a tight loop for a weekend, filling the disk and 10x-ing the DB load, before anyone looked. Changed to `restart: "on-failure"` and moved scheduling to a host cron.',
        hi: '**Ek backup container `restart: always` ke saath** ek weekend backup script ko ek tight loop mein chalata raha, disk bharta aur DB load 10x karta.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is `depends_on` alone not enough to make an app wait for its database, and what makes it work?',
        qHi: '`depends_on` akela ek app ko iske database ka wait karwane ke liye kaafi kyun nahi hai, aur kya ise kaam karwata hai?',
        a: 'The short form of depends_on only controls the order in which Compose starts and stops containers; it does not verify that a dependency is ready to handle requests. A container is considered started the moment its main process begins, but a database needs additional time after that to initialise before it accepts connections, and more still on a first run that has to create its data directory. An app that the short form places after the database still runs its own startup code, including opening database connections, while the database is mid-initialisation, so on a machine where the database is slow the connection is refused and the app crashes, while on a machine where the database is quick it works — an intermittent, environment-dependent failure. The fix is the long form of depends_on, which maps the dependency to a condition. With the condition set to service healthy, Compose waits until the database\'s healthcheck is passing before it starts the app. That requires the database to have a healthcheck, which many official images now include but some do not, and a missing healthcheck makes the condition wait forever. It is still recommended that the app retry its database connection with backoff regardless, because startup ordering does nothing for the database becoming briefly unavailable while the app is already running.',
        aHi: 'depends_on ka short form sirf wo order control karta hai jismein Compose containers start aur stop karta hai; ye verify nahi karta ki ek dependency requests handle karne ke liye ready hai. Ek container started consider hota hai jis moment iska main process shuru hota hai, par ek database ko uske baad additional time chahiye initialise hone ke liye connections accept karne se pehle. Ek app jo short form database ke baad rakhta hai phir bhi apna startup code chalata hai jabki database mid-initialisation hai. Fix depends_on ka long form hai, jo dependency ko ek condition se map karta hai. Condition service healthy set hone ke saath, Compose database ke healthcheck ke pass hone tak wait karta hai. Uske liye database ko ek healthcheck chahiye. App ke liye phir bhi apna database connection backoff ke saath retry karna recommended hai.',
      },
      {
        q: 'Walk through the restart policies and when you would use each.',
        qHi: 'Restart policies walk through karo aur aap har ek kab use karoge.',
        a: 'There are five. "No" is the default and never restarts the container, appropriate for a job that runs once and whose failure should be handled by re-running it deliberately. "On-failure" restarts only when the container exits with a non-zero status, and repeats indefinitely, which suits a one-shot job where a transient error such as a network blip is worth an automatic retry, provided the job is idempotent. "On-failure" with a numeric limit restarts on non-zero exit up to that many times and then leaves the container in the exited state, which is the right choice for catching a genuinely broken service: if it has failed several times in a row, retrying will not help, and leaving it exited surfaces the failure rather than hiding it in an endless loop that looks like the service is running. "Always" restarts the container on any exit, including a successful one, and also when the daemon starts; restarting on a zero exit is rarely wanted, so this is mostly a legacy choice. "Unless-stopped" behaves like always — restart on any exit and on daemon start — except that it does not restart a container you explicitly stopped, which makes it the sensible default for a long-running service: it recovers from crashes and host reboots but respects a deliberate stop. In all cases the restart happens on the same host; it is not failover to another machine.',
        aHi: 'Paanch hain. "No" default hai aur kabhi container restart nahi karta, ek job ke liye appropriate jo ek baar chalti hai. "On-failure" sirf tab restart karta hai jab container ek non-zero status ke saath exit karta hai, aur indefinitely repeat karta hai, ek one-shot job ke liye jahan ek transient error ek automatic retry ke worth hai. "On-failure" ek numeric limit ke saath non-zero exit par utni baar restart karta hai aur phir container ko exited state mein chhodta hai, ek genuinely broken service catch karne ke liye sahi choice. "Always" container ko kisi bhi exit par restart karta hai, ek successful bhi include. "Unless-stopped" always jaisa behave karta hai except ye ek container ko restart nahi karta jise aapne explicitly stop kiya, ek long-running service ke liye sensible default. Sab cases mein restart usi host par hota hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain the difference between `depends_on: [db]` and `depends_on: { db: { condition: service_healthy } }`, and list the three conditions and what each waits for.',
        taskHi: 'Ek comment mein, `depends_on: [db]` aur `depends_on: { db: { condition: service_healthy } }` ke beech difference samjhao.',
        hint: '`depends_on: [db]` (short form) = ORDERING ONLY: Compose starts `db` before this service, stops it after — nothing about readiness. A container is "started" the instant its process launches, so the app races the database\'s init (~1-3s for Postgres, more on first run) and crashes with "connection refused" on cold machines. `depends_on: { db: { condition: X } }` (long form) waits per condition: `service_started` = old behaviour (process launched); `service_healthy` = the dependency\'s HEALTHCHECK is passing (needs the dep to HAVE a healthcheck, else waits forever); `service_completed_successfully` = the dependency\'s container EXITED 0 (for one-shot jobs — a migration/seed step the app must wait for).',
        hintHi: '`depends_on: [db]` (short) = SIRF ORDERING: Compose `db` ko is service se pehle start karta hai — readiness ke baare mein kuch nahi. Ek container "started" hai jis instant iska process launch hota hai, to app database ke init se race karti hai aur "connection refused" se crash karti hai. `depends_on: { db: { condition: X } }` (long) per condition wait karta hai: `service_started` = purana behaviour; `service_healthy` = dependency ka HEALTHCHECK pass ho raha hai (dep ke paas ek healthcheck HONA chahiye); `service_completed_successfully` = dependency ka container EXITED 0 (one-shot jobs ke liye).',
      },
      {
        task: 'In a comment, write a healthcheck for a Node app on `node:20-alpine` that listens on port 3000 with a `/health` route. State which tools are/aren\'t available and tune `start_period`, `interval`, `retries`.',
        taskHi: 'Ek comment mein, `node:20-alpine` par ek Node app ke liye ek healthcheck likho.',
        hint: '`node:20-alpine` has NO `curl` (common mistake). It DOES have busybox `wget` and, always, `node` itself. e.g.\n```\nhealthcheck:\n  test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/health"]\n  interval: 5s\n  timeout: 3s\n  retries: 3\n  start_period: 20s   # node apps take a few seconds to bind; failures here don\'t count\n```\n`start_period` ~15-30s so a slow boot isn\'t marked unhealthy; `interval` 5-10s (not 1s — that\'s wasteful in prod); `retries` 3 → unhealthy after ~15s of consecutive failures. Verify: `docker compose up -d`, then `docker compose ps` should show `(healthy)`.',
        hintHi: '`node:20-alpine` mein KOI `curl` nahi (common mistake). Ismein busybox `wget` hai aur, hamesha, `node` khud. `test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/health"]`, `interval: 5s`, `timeout: 3s`, `retries: 3`, `start_period: 20s` (node apps ko bind hone mein kuch seconds lagte hain). Verify: `docker compose ps` `(healthy)` dikhana chahiye.',
      },
      {
        task: 'In a comment, pick a restart policy for each and justify: (a) a Postgres database, (b) a nightly backup script that exits 0 on success, (c) a web API, (d) a DB migration job run before the app. Then state the one thing NO restart policy can do.',
        taskHi: 'Ek comment mein, har ek ke liye ek restart policy pick karo aur justify karo.',
        hint: '(a) Postgres → `unless-stopped`: survives crashes + host reboots, respects a deliberate `compose stop`. (b) nightly backup → `no` (schedule via host cron / an external scheduler) or `on-failure` (retry a transient failure) — NEVER `always` (it would re-run the backup in a tight loop forever). (c) web API → `unless-stopped` + a healthcheck. (d) migration job → `no` (run once via `depends_on: condition: service_completed_successfully`) or `on-failure` if idempotent and a blip is worth retrying — NOT `always`. The one thing NO restart policy can do: bring the service up on ANOTHER host when THIS host dies — restart only ever restarts the container on the same machine. That\'s the Compose ceiling.',
        hintHi: '(a) Postgres → `unless-stopped`. (b) nightly backup → `no` (host cron se schedule) ya `on-failure` — KABHI `always` nahi (ek tight loop mein forever re-run). (c) web API → `unless-stopped` + ek healthcheck. (d) migration job → `no` ya `on-failure` agar idempotent — `always` NAHI. Wo ek cheez jo KOI restart policy nahi kar sakti: service ko DOOSRE host par up karna jab YE host mar jaata hai — restart sirf usi machine par container restart karta hai. Wo Compose ceiling hai.',
      },
    ],

    keyTakeaways: [
      '`depends_on: [db]` (SHORT form) = ORDERING ONLY — Compose starts `db` before this service and stops it after, and that is ALL. A container counts as "started" the instant its process launches, but Postgres needs ~1-3s more to accept connections (more on first run / initdb), so the app races it and crashes with "connection refused" on a cold machine while working on a warm one — the classic intermittent "works locally, fails in CI" startup bug.',
      '`depends_on: { <dep>: { condition: X } }` (LONG form) actually WAITS. Conditions: `service_started` (old behaviour, explicit), `service_healthy` (the dep\'s HEALTHCHECK is passing — the dep MUST have a healthcheck or this waits forever), `service_completed_successfully` (the dep\'s container EXITED 0 — for one-shot jobs like a migration/seed step the app must wait for). App-level connection retry with backoff is STILL good practice — it also covers mid-run blips that no startup ordering can.',
      'HEALTHCHECK: `test:` (`["CMD",...]` = exec, no shell; `["CMD-SHELL","..."]` = via `/bin/sh -c`; `["NONE"]` disables an inherited one) · `interval:` (between checks, default 30s) · `timeout:` (per check, default 30s) · `retries:` (consecutive failures → `unhealthy`, default 3) · `start_period:` (startup grace — failures here DON\'T count toward retries, but a PASS flips to healthy immediately). The command MUST exist IN THE IMAGE — `curl` is usually ABSENT from minimal images; busybox `wget` is in alpine; DB images ship `pg_isready` / `redis-cli ping` / `mysqladmin ping`; or use the language runtime. `docker compose ps` shows `(healthy)`/`(unhealthy)`/`(health: starting)`; `docker compose up -d --wait` blocks until every service is running + healthy (exit non-zero if any goes unhealthy).',
      'RESTART POLICIES (what the daemon does when the main process EXITS): `no` (default — never), `on-failure` (non-zero exit only, forever), `on-failure:N` (non-zero exit, at most N times, then stays `exited` — good for catching a genuinely broken service instead of hiding it in an endless loop), `always` (ANY exit incl. 0, plus daemon start — restarting on exit 0 is rarely wanted), `unless-stopped` (like `always` but NOT after a deliberate `docker compose stop` — the sensible default for a long-running service).',
      'MATCH the policy to the workload: long-running service → `unless-stopped` + a healthcheck; one-shot job (backup, migration) → `no` (schedule externally) or `on-failure` if idempotent — NEVER `always` (it re-runs the job in a tight loop forever). THE CEILING: a restart policy restarts the container ON THE SAME HOST — it is NOT orchestration. If the host dies, nothing brings the service up elsewhere, because Compose has no concept of "elsewhere". Health-gated ordering + `restart: unless-stopped` + good backups is genuinely enough for many single-box services; needing automatic survival of a host failure is where you\'ve outgrown Compose (Lesson 6).',
    ],
    keyTakeawaysHi: [
      '`depends_on: [db]` (SHORT form) = SIRF ORDERING — Compose `db` ko is service se pehle start karta hai aur baad mein stop, aur bas. Ek container "started" hai jis instant iska process launch hota hai, par Postgres ko ~1-3s aur chahiye connections accept karne ke liye, to app race karti hai aur "connection refused" se crash karti hai ek cold machine par — classic "works locally, fails in CI" bug.',
      '`depends_on: { <dep>: { condition: X } }` (LONG form) actually WAIT karta hai. Conditions: `service_started`, `service_healthy` (dep ka HEALTHCHECK pass ho raha hai — dep ke paas ek healthcheck HONA chahiye warna forever wait), `service_completed_successfully` (dep ka container EXITED 0 — one-shot jobs ke liye). App-level connection retry backoff ke saath ABHI BHI good practice hai.',
      'HEALTHCHECK: `test:` (`["CMD",...]` = exec; `["CMD-SHELL","..."]` = `/bin/sh -c` se; `["NONE"]` disable) · `interval:` (default 30s) · `timeout:` (default 30s) · `retries:` (consecutive failures → `unhealthy`, default 3) · `start_period:` (startup grace — failures count NAHI hote). Command IMAGE mein HONA chahiye — `curl` usually minimal images se ABSENT; busybox `wget` alpine mein; DB images `pg_isready`/`redis-cli ping` ship karte hain. `docker compose up -d --wait` block karta hai jab tak har service running + healthy.',
      'RESTART POLICIES (jab main process EXIT kare): `no` (default), `on-failure` (non-zero exit, forever), `on-failure:N` (non-zero exit, max N baar, phir `exited` rehta hai — ek genuinely broken service catch karne ke liye), `always` (KOI bhi exit incl. 0), `unless-stopped` (`always` jaisa par NAHI ek deliberate `docker compose stop` ke baad — ek long-running service ke liye sensible default).',
      'Policy ko workload se MATCH karo: long-running service → `unless-stopped` + ek healthcheck; one-shot job → `no` ya `on-failure` agar idempotent — KABHI `always` nahi. THE CEILING: ek restart policy container ko USI HOST par restart karta hai — ye orchestration NAHI hai. Agar host mar jaata hai, kuch service ko kahin aur up nahi karta. Health-gated ordering + `restart: unless-stopped` + good backups bahut si single-box services ke liye genuinely kaafi hai.',
    ],
  },

  {
    slug: 'ops-compose-configuration-env-profiles-and-overrides',
    title: 'Configuration: Env, Profiles & Override Files',
    titleHi: 'Configuration: Env, Profiles Aur Override Files',
    description: 'The same Compose stack has to run on a laptop and on a production server with different ports, image tags, and secrets. Compose handles that with `${VAR}` interpolation from a `.env` file, `env_file:` for the container\'s own environment, `profiles:` to switch optional services on and off, and a layered `compose.override.yaml` that merges on top of the base.',
    descriptionHi: 'Wahi Compose stack ek laptop par aur ek production server par alag ports, image tags, aur secrets ke saath chalna chahiye. Compose ise `${VAR}` interpolation ek `.env` file se, `env_file:` container ke apne environment ke liye, `profiles:` optional services on aur off switch karne ke liye, aur ek layered `compose.override.yaml` jo base ke upar merge hoti hai, se handle karta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**A recipe printed once, with the quantities left as blanks you fill in from a card clipped to the fridge.** The recipe (the base `compose.yaml`) is the same for a dinner party and a weeknight; the card (`.env`) says "tonight: 2 people, mild". Some steps only apply to the fancy version, so they are printed on a separate insert you slot in only when you want them (`profiles`). And your partner keeps a sticky note on the recipe with their own tweaks — "we always use the big pan, and add extra garlic" — laid over the top without rewriting the recipe (`compose.override.yaml`). Two important rules of the sticky note: a *replacement* value (the pan) overrides the recipe outright, but a *list* item (extra garlic) gets **added to** the recipe list, not swapped for it.',
      hi: '**Ek recipe ek baar printed, quantities blanks ke roop mein chhodi jo aap fridge par clipped ek card se bharte ho.** Recipe (base `compose.yaml`) ek dinner party aur ek weeknight ke liye same hai; card (`.env`) kehta hai "aaj raat: 2 log, mild". Kuch steps sirf fancy version par apply hote hain, to wo ek separate insert par printed hain jo aap sirf tab slot karte ho jab chahiye (`profiles`). Aur aapka partner recipe par ek sticky note rakhta hai apne tweaks ke saath — "hum hamesha bada pan use karte hain, aur extra garlic dalte hain" (`compose.override.yaml`). Do important rules: ek *replacement* value (pan) recipe ko outright override karti hai, par ek *list* item (extra garlic) recipe ki list mein **add** hota hai, iske liye swap nahi.',
    },

    simple: `**FOUR configuration mechanisms — do not confuse them:**
\`\`\`
1. \${VAR} INTERPOLATION   substitutes into the compose FILE itself, from the shell
                          or a .env file next to compose.yaml. affects the file.
2. environment: / env_file: sets variables INSIDE the container's process. affects
                          the running app, not the compose file.
3. profiles:              tags a service so it only starts when its profile is active.
4. compose.override.yaml  a second file merged on top of the base automatically.
\`\`\`

**1. \`\${VAR}\` INTERPOLATION — fills in the compose file:**
\`\`\`yaml
services:
  web:
    image: myapp:\${TAG:-latest}          # \${VAR} , \${VAR:-default} , \${VAR:?error if unset}
    ports: [ "\${WEB_PORT:-8080}:80" ]
\`\`\`
\`\`\`
# .env  (same dir as compose.yaml; auto-loaded; NOT committed if it holds secrets)
TAG=1.4.2
WEB_PORT=3000
\`\`\`
- \`docker compose config\` shows the resolved result and WARNS on any unset var with no default
- override the .env: shell env wins over .env  (\`TAG=1.5 docker compose up\`)
- pick a different file:  \`docker compose --env-file .env.prod up\`
- commit a \`.env.example\` documenting every variable; never commit real secrets

**2. \`environment:\` / \`env_file:\` — the CONTAINER's environment:**
\`\`\`yaml
services:
  app:
    environment:                # inline (interpolated from the shell/.env too)
      NODE_ENV: production
      DATABASE_URL: postgres://db:5432/\${DB_NAME}
    env_file:
      - ./app.env               # a file of KEY=VALUE lines, loaded into the container
      - path: ./secrets.env     # long form; 'required: false' = ok if missing
        required: false
\`\`\`
precedence (highest wins): \`environment:\` > \`env_file:\` (later files > earlier) > image \`ENV\`.

**3. \`profiles:\` — optional services, off by default:**
\`\`\`yaml
services:
  app: { image: myapp }                    # no profile -> ALWAYS starts
  adminer:
    image: adminer
    profiles: [ debug ]                     # starts only with the 'debug' profile
  loadtest:
    image: k6
    profiles: [ perf ]
\`\`\`
\`docker compose up\`                 -> just app
\`docker compose --profile debug up\` -> app + adminer
\`COMPOSE_PROFILES=debug,perf docker compose up\` -> all three

**4. \`compose.override.yaml\` — layered config, auto-merged:**
\`\`\`
docker compose up   ==   docker compose -f compose.yaml -f compose.override.yaml up
\`\`\`
- base \`compose.yaml\` = the shared definition; \`compose.override.yaml\` = local/dev tweaks
- for prod, DON'T use the auto-override:  \`docker compose -f compose.yaml -f compose.prod.yaml up\`

**MERGE RULES (this trips everyone up):**
\`\`\`
scalars & maps  -> the later file REPLACES / MERGES KEY-BY-KEY
                   (image:, environment: TIER, restart: ...)
SEQUENCES       -> the later file's list is APPENDED, not replaced
                   (ports:, volumes:, command args, dns:, ...)
\`\`\`
So an override adding \`ports: ["3000:80"]\` gives you BOTH 8080 and 3000, not just 3000.
To truly replace a list, use \`!reset\` / \`!override\` tags, or restructure.`,

    simpleHi: `**CHAAR configuration mechanisms — inhe confuse mat karo:**
\`\`\`
1. \${VAR} INTERPOLATION   compose FILE mein substitute karta hai, shell ya ek .env file se.
2. environment: / env_file: container ke process ke ANDAR variables set karta hai.
3. profiles:              ek service tag karta hai taaki ye sirf tab start ho jab iska profile active hai.
4. compose.override.yaml  ek doosri file jo base ke upar automatically merge hoti hai.
\`\`\`

**1. \`\${VAR}\` INTERPOLATION:**
\`\`\`yaml
services:
  web:
    image: myapp:\${TAG:-latest}          # \${VAR} , \${VAR:-default} , \${VAR:?error}
    ports: [ "\${WEB_PORT:-8080}:80" ]
\`\`\`
\`# .env\` file (compose.yaml ke saath; auto-loaded; secrets ho to commit NAHI).
- \`docker compose config\` resolved result dikhata hai aur kisi unset var par WARN karta hai
- shell env .env ke upar wins; \`docker compose --env-file .env.prod up\` alag file
- ek \`.env.example\` commit karo; kabhi real secrets commit mat karo

**2. \`environment:\` / \`env_file:\` — CONTAINER ka environment:**
precedence (highest wins): \`environment:\` > \`env_file:\` (later files > earlier) > image \`ENV\`.

**3. \`profiles:\` — optional services, default se off:**
\`\`\`yaml
services:
  app: { image: myapp }                    # koi profile nahi -> HAMESHA start
  adminer: { image: adminer, profiles: [ debug ] }   # sirf 'debug' profile ke saath
\`\`\`
\`docker compose up\` -> sirf app · \`docker compose --profile debug up\` -> app + adminer

**4. \`compose.override.yaml\` — layered config, auto-merged:**
\`\`\`
docker compose up   ==   docker compose -f compose.yaml -f compose.override.yaml up
\`\`\`
prod ke liye auto-override use MAT karo: \`docker compose -f compose.yaml -f compose.prod.yaml up\`.

**MERGE RULES (ye sabko trip karta hai):**
\`\`\`
scalars & maps  -> later file REPLACE / KEY-BY-KEY MERGE karti hai
SEQUENCES       -> later file ki list APPEND hoti hai, replace nahi (ports:, volumes:, ...)
\`\`\`
To ek override jo \`ports: ["3000:80"]\` add karta hai aapko DONO 8080 aur 3000 deta hai.`,

    content: `## Four different things

Compose configuration confuses people because four separate mechanisms all touch "settings":

1. **\`\${VAR}\` interpolation** substitutes values **into the Compose file** before Compose parses it. The source is the shell environment and a \`.env\` file. This is how you parameterise the file — an image tag, a port, a hostname.
2. **\`environment:\` and \`env_file:\`** set environment variables **inside the container's process**. This is how the application is configured at runtime.
3. **\`profiles:\`** tag services as optional so they start only when their profile is activated.
4. **\`compose.override.yaml\`** is a second Compose file that Compose merges on top of the base automatically.

They are independent. A \`.env\` file feeds interpolation, not the container — a variable in \`.env\` does not appear inside the container unless you also reference it in an \`environment:\` entry.

## \`\${VAR}\` interpolation and \`.env\`

Anywhere in the Compose file you can write \`\${VAR}\`, and Compose substitutes the value before parsing:

- \`\${VAR}\` — the value, or empty string with a warning if unset.
- \`\${VAR:-default}\` — the value, or \`default\` if unset **or empty**.
- \`\${VAR-default}\` — the value, or \`default\` only if **unset** (empty stays empty).
- \`\${VAR:?message}\` — the value, or **abort** with \`message\` if unset or empty. Use this for values that have no safe default.

The values come from the shell environment and from a **\`.env\` file** in the same directory as the Compose file, which Compose loads automatically. Shell environment wins over \`.env\`. You can point at a different env file with \`--env-file .env.production\`.

\`\`\`yaml
services:
  web:
    image: \${REGISTRY:-docker.io}/myapp:\${TAG:?set TAG to a released version}
    ports: ["\${WEB_PORT:-8080}:80"]
    environment:
      SENTRY_DSN: \${SENTRY_DSN}          # interpolation feeds an environment: entry
\`\`\`

Rules of thumb: commit a **\`.env.example\`** listing every variable with a comment and a safe placeholder; add \`.env\` to \`.gitignore\` if it will hold secrets; run \`docker compose config\` to see the resolved file and catch any unset variable before \`up\`.

## \`environment:\` and \`env_file:\`

These set the variables the **application** sees:

- **\`environment:\`** — a map or a list of \`KEY=VALUE\`, defined inline. Values here are themselves interpolated from the shell/\`.env\`.
- **\`env_file:\`** — one or more files of \`KEY=VALUE\` lines, whose contents are loaded into the container's environment. The long form \`{path:, required:}\` lets a file be optional.

Precedence, highest first: \`environment:\` in the Compose file, then \`env_file:\` (with later files overriding earlier ones), then \`ENV\` baked into the image. So an inline \`environment:\` entry always wins over the same key in an \`env_file:\`.

Keep secrets out of \`environment:\` in the committed file. For a single host, an \`env_file:\` that is not committed is the common pattern; for anything more, use Docker secrets or an external secret manager (Module 19).

## \`profiles:\`

A service with a \`profiles:\` list starts **only** when one of its profiles is active; a service with no \`profiles:\` key always starts. Profiles are activated with \`--profile NAME\` (repeatable) or the \`COMPOSE_PROFILES\` environment variable (comma-separated).

\`\`\`yaml
services:
  app:     { image: myapp }                       # always
  db:      { image: postgres:16-alpine }           # always
  adminer: { image: adminer, profiles: [tools] }   # only with --profile tools
  seed:    { image: myapp, command: [./seed],
            profiles: [setup] }                    # only with --profile setup
\`\`\`

Use profiles for things that are part of the stack conceptually but not always wanted: a database admin UI, a one-off data seeder, a load-testing container, monitoring sidecars in local dev. A service referenced by \`depends_on\` from an always-on service is pulled in automatically even if its own profile is not active.

## \`compose.override.yaml\`

When you run \`docker compose\` with no \`-f\` flag, Compose loads \`compose.yaml\` **and then** \`compose.override.yaml\` if it exists, merging the second on top of the first. \`docker compose up\` is exactly \`docker compose -f compose.yaml -f compose.override.yaml up\`.

The intended split: \`compose.yaml\` holds the definition shared by everyone; \`compose.override.yaml\` holds local development conveniences — a bind mount of your source for live reload, an exposed debugger port, \`build:\` instead of \`image:\`, relaxed resource limits. \`compose.override.yaml\` is often gitignored or committed as a shared dev default.

For **production** you do **not** want the dev override applied, so you name the prod layer explicitly and pass both files: \`docker compose -f compose.yaml -f compose.prod.yaml up -d\`. The prod layer adds \`restart:\`, resource limits, real image tags, and logging config.

## Merge rules — the part that surprises people

When two Compose files are merged:

- **Scalars** (\`image:\`, \`restart:\`, \`user:\`) — the later file's value **replaces** the earlier one.
- **Maps** (\`environment:\`, \`labels:\`, \`deploy:\`) — merged **key by key**; the later file adds new keys and overrides matching ones, keeping the rest.
- **Sequences** (\`ports:\`, \`volumes:\`, \`command:\` when a list, \`dns:\`, \`expose:\`) — the later file's list is **appended** to the earlier one, **not replaced**.

The sequence rule is the surprise. If the base has \`ports: ["8080:80"]\` and the override has \`ports: ["3000:80"]\`, the merged service publishes **both** 8080 and 3000. If the base runs \`command: ["server", "--port", "80"]\` and the override adds \`command: ["--verbose"]\`, you get \`["server", "--port", "80", "--verbose"]\` — sometimes what you want, often not.

To replace a list rather than append, Compose supports the \`!reset\` and \`!override\` YAML tags (\`ports: !override ["3000:80"]\`), or you restructure so the value lives in only one file. Always confirm the result with \`docker compose config\` — it shows exactly what the merge produced.`,

    contentHi: `## Chaar alag cheezein

Compose configuration logon ko confuse karta hai kyunki chaar separate mechanisms sab "settings" ko touch karte hain:
1. **\`\${VAR}\` interpolation** values ko **Compose file mein** substitute karta hai parse hone se pehle. Source shell environment aur ek \`.env\` file hai.
2. **\`environment:\` aur \`env_file:\`** environment variables ko **container ke process ke andar** set karte hain.
3. **\`profiles:\`** services ko optional tag karte hain taaki wo sirf tab start hon jab unka profile activated hai.
4. **\`compose.override.yaml\`** ek doosri Compose file hai jo Compose base ke upar automatically merge karta hai.

Ye independent hain. Ek \`.env\` file interpolation feed karti hai, container nahi.

## \`\${VAR}\` interpolation aur \`.env\`

- \`\${VAR}\` — value, ya empty string ek warning ke saath agar unset.
- \`\${VAR:-default}\` — value, ya \`default\` agar unset **ya empty**.
- \`\${VAR:?message}\` — value, ya **abort** \`message\` ke saath agar unset ya empty.

Values shell environment se aur ek **\`.env\` file** se aati hain jo Compose automatically load karta hai. Shell environment \`.env\` ke upar wins karta hai.

Rules: ek **\`.env.example\`** commit karo; \`.env\` ko \`.gitignore\` mein add karo agar ye secrets rakhegi; \`docker compose config\` chalao resolved file dekhne ke liye.

## \`environment:\` aur \`env_file:\`

Ye wo variables set karte hain jo **application** dekhti hai. Precedence, highest first: Compose file mein \`environment:\`, phir \`env_file:\` (later files earlier ko override), phir image mein baked \`ENV\`.

## \`profiles:\`

Ek \`profiles:\` list wali service **sirf** tab start hoti hai jab iska ek profile active hai; \`profiles:\` key ke bina ek service hamesha start hoti hai. Profiles \`--profile NAME\` ya \`COMPOSE_PROFILES\` se activated hote hain.

## \`compose.override.yaml\`

Jab aap \`docker compose\` bina \`-f\` flag ke chalate ho, Compose \`compose.yaml\` **aur phir** \`compose.override.yaml\` load karta hai. Intended split: \`compose.yaml\` shared definition; \`compose.override.yaml\` local development conveniences. **Production** ke liye aap dev override apply NAHI chahte, to prod layer explicitly name karo: \`docker compose -f compose.yaml -f compose.prod.yaml up -d\`.

## Merge rules — wo part jo logon ko surprise karta hai

- **Scalars** (\`image:\`, \`restart:\`) — later file ki value earlier ko **replace** karti hai.
- **Maps** (\`environment:\`, \`labels:\`) — **key by key** merged.
- **Sequences** (\`ports:\`, \`volumes:\`, \`command:\`) — later file ki list earlier mein **appended** hoti hai, **replace nahi**.

Sequence rule surprise hai. Agar base mein \`ports: ["8080:80"]\` hai aur override mein \`ports: ["3000:80"]\`, merged service **dono** 8080 aur 3000 publish karti hai. Ek list replace karne ke liye, \`!reset\` / \`!override\` YAML tags use karo. Hamesha \`docker compose config\` se result confirm karo.`,

    examples: [
      {
        title: 'Interpolation: ${VAR}, .env, defaults, and shell override',
        titleHi: 'Interpolation: ${VAR}, .env, defaults, aur shell override',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > compose.yaml <<'EOF'
name: cfg
services:
  web:
    image: nginx:\${NGINX_TAG:-1.27}-alpine
    ports: [ "\${WEB_PORT:-8080}:80" ]
    environment:
      TIER: \${TIER:-prod}
EOF
printf 'NGINX_TAG=1.25\\nWEB_PORT=3000\\n' > .env

echo "--- .env is auto-loaded; defaults fill the rest ---"
docker compose config 2>/dev/null | grep -E 'image:|published:|TIER:'

echo "--- a shell variable overrides the .env file ---"
NGINX_TAG=1.26 docker compose config 2>/dev/null | grep -E 'image:'

echo "--- an unset var with no default -> a warning ---"
sed -i 's/TIER:-prod/TIER/' compose.yaml
docker compose config 2>&1 >/dev/null \\
  | sed -E 's/^time="[^"]*" level=warning msg="(.*)"$/WARN: \\1/; s/\\\\"/"/g' | head -1`,
        output: `--- .env is auto-loaded; defaults fill the rest ---
      TIER: prod
    image: nginx:1.25-alpine
        published: "3000"
--- a shell variable overrides the .env file ---
    image: nginx:1.26-alpine
--- an unset var with no default -> a warning ---
WARN: The "TIER" variable is not set. Defaulting to a blank string.`,
        explain: 'The Compose file uses variable references with defaults. Compose automatically reads a dot-env file in the same directory, so the image tag and the published port come from that file, while the tier, which the file does not set, falls back to the default written in the reference. The config command shows the fully substituted result without starting anything. Setting a variable in the shell before the command takes precedence over the dot-env file, so the image tag changes accordingly. Finally, removing the default from one reference and leaving that variable unset produces a warning: Compose does not fail, it substitutes an empty string and tells you, which is why running config before bringing a stack up in a new environment catches exactly this class of problem — a variable that is set in one place and forgotten in another would otherwise surface as a container starting with a blank value and misbehaving.',
        explainHi: 'Compose file defaults ke saath variable references use karti hai. Compose automatically ek dot-env file same directory mein padhta hai, to image tag aur published port us file se aate hain, jabki tier, jo file set nahi karti, reference mein likhe default par fall back karta hai. config command fully substituted result dikhata hai bina kuch start kiye. Command se pehle shell mein ek variable set karna dot-env file ke upar precedence leta hai. Aakhir mein, ek reference se default hataana aur us variable ko unset chhodna ek warning produce karta hai: Compose fail nahi hota, ye ek empty string substitute karta hai aur aapko batata hai.',
      },
      {
        title: 'Override merge: scalars replace, maps merge, sequences APPEND',
        titleHi: 'Override merge: scalars replace, maps merge, sequences APPEND',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > compose.yaml <<'EOF'
name: mrg
services:
  web:
    image: caddy:2-alpine
    ports: [ "8080:80" ]
    environment:
      TIER: prod
      LOG_LEVEL: warn
EOF
cat > compose.override.yaml <<'EOF'
services:
  web:
    image: caddy:2.8-alpine          # scalar -> REPLACES
    ports: [ "3000:80" ]             # sequence -> APPENDS (you get BOTH ports!)
    environment:
      TIER: dev                      # map key -> REPLACES this key
      DEBUG: "true"                   # map key -> ADDED
EOF

echo "--- docker compose config = base + override merged (override auto-loaded) ---"
docker compose config 2>/dev/null | grep -E 'image:|published:|TIER:|LOG_LEVEL:|DEBUG:'`,
        output: `--- docker compose config = base + override merged (override auto-loaded) ---
      DEBUG: "true"
      LOG_LEVEL: warn
      TIER: dev
    image: caddy:2.8-alpine
        published: "8080"
        published: "3000"`,
        explain: 'The base file and the override file both define the same service, and running Compose with no file flag merges the override on top of the base. The image key is a scalar, so the override\'s value replaces the base\'s entirely. The environment key is a map, so the two are merged key by key: the tier key appears in both and the override\'s value wins, the log-level key is only in the base and is kept, and the debug key is only in the override and is added. The ports key is a sequence, and this is where the behaviour catches people out: the override\'s list is appended to the base\'s rather than replacing it, so the merged service publishes both the original port and the one the override added. If the intent was to change the published port from one value to another, this merge instead exposes the service on both, which in production could be an unintended extra listener. The config output makes the result explicit, which is why it should be checked whenever override files are in play.',
        explainHi: 'Base file aur override file dono same service define karti hain, aur Compose ko bina file flag ke chalana override ko base ke upar merge karta hai. image key ek scalar hai, to override ki value base ki ko poori tarah replace karti hai. environment key ek map hai, to dono key by key merged hain: tier key dono mein appear hoti hai aur override ki value wins karti hai, log-level key sirf base mein hai aur kept hai, aur debug key sirf override mein hai aur added hai. ports key ek sequence hai, aur yahan behaviour logon ko catch karta hai: override ki list base ki mein appended hai replace ke bajaay, to merged service dono ports publish karti hai. config output result ko explicit banata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# putting a value in .env and expecting the container to see it
# .env:
DATABASE_URL=postgres://db:5432/blog
# compose.yaml:
services:
  app:
    image: myapp
    # (no environment: / env_file:)
# -> the app calls process.env.DATABASE_URL -> undefined. .env feeds the COMPOSE
//    FILE's \${...} interpolation, NOT the container's environment. two different
//    things that happen to use the same filename convention.`,
        right: `# .env feeds interpolation; you still have to pass it INTO the container:
services:
  app:
    image: myapp
    environment:
      DATABASE_URL: \${DATABASE_URL}     # <- explicitly plumb it through
    # OR, for a whole file of them:
    env_file:
      - ./app.env                        # KEY=VALUE lines loaded into the container
# verify: docker compose config  (shows the resolved 'environment:' block)`,
        why: 'The dot-env file and the container environment are separate systems that share a naming convention. The dot-env file next to the Compose file is read by Compose itself and used only to fill in variable references in the Compose file — it parameterises the file, nothing more. The variables an application sees at runtime come from the container\'s environment, which Compose populates from the environment and env-file keys of the service. A value placed only in the dot-env file, with no corresponding environment entry, is available for interpolation into the Compose file but never reaches the container, so an application reading it finds nothing. To pass a value through, it must be referenced in an environment entry, which can itself be an interpolation of the dot-env value, or the whole set can be loaded with an env-file key pointing at a file of key-value pairs. Running config shows the resolved environment block for each service and confirms what the container will actually receive.',
        whyHi: 'Dot-env file aur container environment separate systems hain jo ek naming convention share karte hain. Compose file ke saath dot-env file Compose khud padhta hai aur sirf Compose file mein variable references bharne ke liye use karta hai — ye file ko parameterise karta hai, aur kuch nahi. Wo variables jo ek application runtime par dekhti hai container ke environment se aate hain, jise Compose service ke environment aur env-file keys se populate karta hai. Ek value jo sirf dot-env file mein rakhi hai, bina ek corresponding environment entry ke, interpolation ke liye available hai par container tak kabhi nahi pahunchti. Ise pass karne ke liye, ise ek environment entry mein reference karna chahiye.',
      },
      {
        wrong: `# an override that meant to CHANGE the port but ADDED one
# compose.yaml:      ports: [ "8080:80" ]
# compose.prod.yaml: ports: [ "443:80" ]        # "run on 443 in prod"
$ docker compose -f compose.yaml -f compose.prod.yaml config | grep published
#   published: "8080"
#   published: "443"
# -> prod now ALSO listens on 8080, unauthenticated, alongside 443. sequences
//    APPEND on merge; they don't replace.`,
        right: `# option A — restructure so ports: lives in ONLY ONE file:
#   compose.yaml has NO ports:; each of compose.dev.yaml / compose.prod.yaml sets it.
# option B — use the !override tag to replace instead of append:
#   compose.prod.yaml:
#     services:
#       web:
#         ports: !override [ "443:80" ]
# always: docker compose ... config | grep published   <- confirm before deploy`,
        why: 'Compose merges two files by type of value. Scalar values and map entries in a later file override matching ones in an earlier file, but sequence values are appended rather than replaced. A ports list is a sequence, so an override file that specifies a different port mapping does not swap the base file\'s mapping for its own — it adds its mapping to the list, and the merged service publishes both. In a production layer this means the service ends up listening on the port the base file used for local development as well as the intended production port, which can be an unintended and unauthenticated entry point. There are two ways to avoid it. One is to structure the files so that the ports key is defined in exactly one of them, with the base file omitting it and each environment-specific file supplying it. The other is to use the override tag on the sequence in the later file, which tells Compose to replace rather than append. In both cases, checking the resolved configuration for the published ports before deploying confirms the result.',
        whyHi: 'Compose do files ko value ke type se merge karta hai. Ek later file mein scalar values aur map entries earlier file mein matching ones ko override karti hain, par sequence values append hoti hain replace ke bajaay. Ek ports list ek sequence hai, to ek override file jo ek alag port mapping specify karti hai base file ki mapping ko apni se swap nahi karti — ye apni mapping list mein add karti hai, aur merged service dono publish karti hai. Ek production layer mein iska matlab service us port par bhi listen karti hai jo base file ne local development ke liye use kiya. Do tarike hain: ek files ko aise structure karna ki ports key exactly ek mein defined ho; doosra later file mein sequence par override tag use karna.',
      },
      {
        wrong: `# committing .env with real secrets, or having no .env.example at all
$ cat .gitignore | grep env    # (nothing)
$ git log --oneline .env       # .env with STRIPE_SECRET_KEY=sk_live_... is in history
# AND: a new dev clones the repo, 'docker compose up', app crashes on 6 missing
//     vars they have to discover one crash at a time.`,
        right: `# .gitignore:  .env  .env.*  !.env.example
# commit .env.example with EVERY variable, documented, safe placeholders:
#   # Stripe — get from the dashboard, use a test key locally
#   STRIPE_SECRET_KEY=sk_test_xxx
#   DB_NAME=blog
# a new dev: cp .env.example .env, fill in, 'docker compose config' to verify.
# real secrets: never in git — even in history. if leaked, ROTATE them.`,
        why: 'A dot-env file typically holds the environment-specific and sensitive values a stack needs, and it is not meant to be committed when it contains real credentials, because anything committed to a repository remains in its history even after later removal and is exposed to everyone with read access. At the same time, a repository with no example env file gives a new contributor no way to know which variables the stack requires; they discover them one at a time as the application crashes on each missing value. The resolution is to ignore the real dot-env file and its environment-specific variants in version control while committing an example file that lists every variable the stack uses, with a short comment on where each value comes from and a safe placeholder or test value. A new contributor copies the example to a real dot-env file and fills in the blanks, then verifies with the config command. If a real secret has already been committed, removing it from the current file is not sufficient — it is still in the history and must be treated as compromised and rotated.',
        whyHi: 'Ek dot-env file typically ek stack ke environment-specific aur sensitive values rakhti hai, aur ise commit nahi kiya jaana chahiye jab ismein real credentials hon, kyunki ek repository mein commit ki gayi koi bhi cheez iske history mein rehti hai later removal ke baad bhi. Saath hi, bina ek example env file wala ek repository ek naye contributor ko koi tarika nahi deta ki kaunse variables stack ko chahiye. Resolution real dot-env file ko version control mein ignore karna hai jabki ek example file commit karna jo har variable list karti hai. Agar ek real secret already committed hai, ise current file se hataana sufficient nahi — ye abhi bhi history mein hai aur ise compromised treat karke rotate karna chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**A new hire\'s first day lost to `docker compose up` crash-looping** on six env vars with no `.env.example`. The team added `.env.example` and a `docker compose config` step to the README; onboarding dropped to minutes.',
        hi: '**Ek naye hire ka pehla din `docker compose up` crash-looping par lost** chhah env vars par bina `.env.example`.',
      },
      {
        en: '**A prod service quietly listening on the dev port 8080 as well as 443** — the prod override\'s `ports:` appended instead of replacing. Found in a port scan. Fixed with `ports: !override [...]` and a `config | grep published` gate in the deploy pipeline.',
        hi: '**Ek prod service quietly dev port 8080 par bhi listen kar rahi thi** — prod override ka `ports:` append hua replace ke bajaay.',
      },
      {
        en: '**`STRIPE_SECRET_KEY=sk_live_...` in `.env` in git history** for eight months. Rotated the key, added `.env*` to `.gitignore` with a `!.env.example` exception, and added a secret-scanner to CI.',
        hi: '**`.env` mein `STRIPE_SECRET_KEY=sk_live_...` git history mein** aath mahine ke liye. Key rotate ki.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a `.env` file and the `environment:` key in a Compose service?',
        qHi: 'Ek `.env` file aur ek Compose service mein `environment:` key ke beech kya difference hai?',
        a: 'They operate on different things despite the similar name. A dot-env file in the same directory as the Compose file is read by Compose itself, and its values are used only to substitute the variable references written in the Compose file — it parameterises the file so that an image tag, a port, or a hostname can be set without editing the file. It does not put anything into any container. The environment key of a service, by contrast, defines the environment variables that the container\'s process actually receives at runtime, which is what the application reads. The two connect only if you make them: an environment entry can be written as an interpolation of a dot-env value, which passes that value through into the container. A value placed only in the dot-env file, with no matching environment entry, is available for interpolation but never reaches the container, so an application looking for it finds nothing. There is also an env-file key on a service, which loads a whole file of key-value pairs into the container\'s environment; that file is a different file from the dot-env file Compose uses for interpolation, even though both are conventionally named with a dot-env pattern.',
        aHi: 'Wo alag cheezon par operate karte hain similar naam ke bawajood. Compose file ke saath ek dot-env file Compose khud padhta hai, aur iski values sirf Compose file mein likhi variable references substitute karne ke liye use hoti hain — ye file ko parameterise karta hai. Ye kisi container mein kuch nahi daalta. Ek service ki environment key, iske विपरीत, wo environment variables define karti hai jo container ka process runtime par actually receive karta hai, jo application padhti hai. Dono connect sirf tab hote hain jab aap unhe karte ho: ek environment entry ek dot-env value ke interpolation ke roop mein likhi ja sakti hai. Ek value jo sirf dot-env file mein rakhi hai container tak kabhi nahi pahunchti.',
      },
      {
        q: 'How does Compose merge two files, and what surprises people about it?',
        qHi: 'Compose do files ko kaise merge karta hai, aur ismein logon ko kya surprise karta hai?',
        a: 'When Compose combines files — the automatic base plus override, or several files passed with the file flag — it merges by the type of each value. A scalar value, such as an image name or a restart policy, in a later file replaces the same key in an earlier file. A map, such as the environment or labels block, is merged key by key: keys only in the earlier file are kept, keys only in the later file are added, and keys in both take the later file\'s value. The surprise is sequences. A list value, such as ports, volumes, a list-form command, or dns, is not replaced by a later file — the later file\'s entries are appended to the earlier file\'s list. So an override that specifies a ports list does not swap the base\'s port mapping for its own; the merged service ends up with both. In a production override this can leave a service listening on the port the base used for local development as well as the intended one. To replace a list instead of appending, Compose provides the reset and override YAML tags, or you structure the files so the list is defined in only one of them. Checking the merged result with the config subcommand shows exactly what the merge produced and is the reliable way to catch this.',
        aHi: 'Jab Compose files combine karta hai — automatic base plus override, ya file flag ke saath pass ki gayi kai files — ye har value ke type se merge karta hai. Ek later file mein ek scalar value earlier file mein same key ko replace karti hai. Ek map key by key merged hai. Surprise sequences hai. Ek list value, jaise ports, volumes, ek list-form command, ek later file se replace NAHI hoti — later file ki entries earlier file ki list mein appended hoti hain. To ek override jo ek ports list specify karta hai base ki port mapping ko apni se swap nahi karta; merged service dono ke saath end hoti hai. Ek list replace karne ke liye Compose reset aur override YAML tags provide karta hai. config subcommand se merged result check karna reliable tarika hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, name the four Compose configuration mechanisms and, in one line each, say what each affects. Then explain why a value in `.env` does not automatically appear inside a container.',
        taskHi: 'Ek comment mein, chaar Compose configuration mechanisms name karo.',
        hint: '(1) `${VAR}` INTERPOLATION — substitutes into the compose FILE before parsing, from the shell + a `.env` file (`${VAR}`, `${VAR:-default}`, `${VAR:?error}`). (2) `environment:` / `env_file:` — sets vars INSIDE the container\'s process (what the app reads); precedence `environment:` > `env_file:` (later wins) > image `ENV`. (3) `profiles:` — tags a service so it only starts when its profile is active (`--profile X` / `COMPOSE_PROFILES`). (4) `compose.override.yaml` — a second file auto-merged on top of the base. A `.env` value doesn\'t reach the container because `.env` feeds interpolation of the FILE, not the container — you must also reference it in an `environment:` entry (`FOO: ${FOO}`) or load it via `env_file:`.',
        hintHi: '(1) `${VAR}` INTERPOLATION — compose FILE mein substitute, shell + ek `.env` file se. (2) `environment:` / `env_file:` — container ke process ke ANDAR vars set karta hai; precedence `environment:` > `env_file:` > image `ENV`. (3) `profiles:` — ek service tag karta hai taaki ye sirf tab start ho jab iska profile active hai. (4) `compose.override.yaml` — ek doosri file base ke upar auto-merged. Ek `.env` value container tak nahi pahunchti kyunki `.env` FILE ka interpolation feed karti hai, container ka nahi.',
      },
      {
        task: 'In a comment, state the three merge rules (scalar, map, sequence) and work through: base has `ports: ["8080:80"]` and `environment: {TIER: prod, LOG: warn}`; override has `ports: ["443:80"]` and `environment: {TIER: dev, DEBUG: "1"}`. What does the merged service have?',
        taskHi: 'Ek comment mein, teen merge rules batao aur ek example work karo.',
        hint: 'Rules: SCALAR (`image:`, `restart:`) → later REPLACES. MAP (`environment:`, `labels:`) → merged KEY BY KEY (later wins on conflicts, others kept). SEQUENCE (`ports:`, `volumes:`, list `command:`, `dns:`) → later is APPENDED, not replaced. Merged result: `ports: ["8080:80", "443:80"]` (BOTH — sequence append; likely a bug if you meant to switch to 443); `environment: {TIER: dev, LOG: warn, DEBUG: "1"}` (TIER overridden, LOG kept, DEBUG added). Fix a ports swap with `ports: !override ["443:80"]` or by putting `ports:` in only one file. Always verify with `docker compose config`.',
        hintHi: 'Rules: SCALAR → later REPLACE. MAP → KEY BY KEY merged. SEQUENCE → later APPEND, replace nahi. Merged result: `ports: ["8080:80", "443:80"]` (DONO — sequence append; bug agar aap 443 par switch karna chahte the); `environment: {TIER: dev, LOG: warn, DEBUG: "1"}`. Ports swap fix karo `ports: !override ["443:80"]` se. Hamesha `docker compose config` se verify karo.',
      },
      {
        task: 'In a comment, write the `.gitignore` lines and describe the `.env.example` workflow that lets a new dev get the stack running without committing secrets, and say what to do if a real secret was already committed.',
        taskHi: 'Ek comment mein, `.gitignore` lines likho jo ek naye dev ko stack running karne dete hain bina secrets commit kiye.',
        hint: '`.gitignore`:\n```\n.env\n.env.*\n!.env.example\n```\nCommit `.env.example` with EVERY variable the stack needs, each with a comment (where the value comes from) and a SAFE placeholder / test value (`STRIPE_SECRET_KEY=sk_test_xxx`, `DB_NAME=blog`). New dev: `cp .env.example .env`, fill in real values, `docker compose config` to verify nothing is unset, then `docker compose up`. Optionally make `docker compose config` a required CI check. If a real secret was already committed: removing it from the current file is NOT enough — it\'s in git history forever. Treat it as compromised: ROTATE the credential immediately, then scrub history if feasible and add a secret scanner to CI.',
        hintHi: '`.gitignore`: `.env`, `.env.*`, `!.env.example`. `.env.example` commit karo HAR variable ke saath, ek comment aur ek SAFE placeholder / test value ke saath. Naya dev: `cp .env.example .env`, real values bharo, `docker compose config` se verify karo, phir `docker compose up`. Agar ek real secret already committed tha: ise current file se hataana KAAFI NAHI — ye git history mein forever hai. Ise compromised treat karo: credential turant ROTATE karo, phir history scrub karo aur CI mein ek secret scanner add karo.',
      },
    ],

    keyTakeaways: [
      'FOUR distinct config mechanisms — don\'t conflate them: (1) `${VAR}` INTERPOLATION substitutes into the compose FILE before parsing, sourced from the shell + an auto-loaded `.env` in the same dir (`${VAR}`, `${VAR:-default}` = default if unset OR empty, `${VAR-default}` = default only if unset, `${VAR:?msg}` = ABORT if unset/empty). (2) `environment:` / `env_file:` set vars INSIDE the container process (what the app reads). (3) `profiles:` gate optional services. (4) `compose.override.yaml` = a second file auto-merged on the base.',
      'A `.env` value does NOT reach the container by itself — `.env` feeds interpolation of the FILE, not the container environment. You must ALSO reference it (`environment: { FOO: ${FOO} }`) or load a file via `env_file:`. CONTAINER env precedence (highest wins): `environment:` > `env_file:` (later files > earlier) > image `ENV`. Shell env beats `.env` for interpolation. `--env-file .env.prod` picks a different interpolation source. `docker compose config` shows the resolved result and WARNS on any unset var with no default — run it before every `up` in a new environment.',
      '`profiles:` — a service WITH a `profiles:` list starts ONLY when one of its profiles is active (`--profile NAME`, repeatable, or `COMPOSE_PROFILES=a,b`); a service with NO `profiles:` key ALWAYS starts. Use for things that are part of the stack but not always wanted: an admin UI, a one-off seeder, a load-tester, dev-only monitoring. A profiled service pulled in by `depends_on` from an always-on service starts anyway.',
      '`compose.override.yaml` is auto-loaded on top of `compose.yaml` — `docker compose up` == `docker compose -f compose.yaml -f compose.override.yaml up`. Intended split: `compose.yaml` = shared definition; `compose.override.yaml` = LOCAL DEV tweaks (source bind mount, debugger port, `build:` over `image:`). For PROD, do NOT rely on the auto-override — name it explicitly: `docker compose -f compose.yaml -f compose.prod.yaml up -d`.',
      'MERGE RULES (the part that surprises everyone): SCALARS (`image:`, `restart:`, `user:`) → the later file REPLACES. MAPS (`environment:`, `labels:`, `deploy:`) → merged KEY BY KEY (later wins per-key, others kept). SEQUENCES (`ports:`, `volumes:`, list-form `command:`, `dns:`, `expose:`) → the later list is APPENDED, NOT replaced — so a prod override adding `ports: ["443:80"]` leaves the service on BOTH 443 and the base\'s 8080 (a real, unauthenticated extra listener). To replace a list: `ports: !override [...]`, or structure so the key lives in only one file. ALWAYS confirm with `docker compose config`. And: `.gitignore` the real `.env` (`.env`, `.env.*`, `!.env.example`), commit a documented `.env.example`; a secret ever committed is in history forever — ROTATE it.',
    ],
    keyTakeawaysHi: [
      'CHAAR distinct config mechanisms — inhe conflate mat karo: (1) `${VAR}` INTERPOLATION compose FILE mein substitute karta hai parse hone se pehle, shell + ek auto-loaded `.env` se (`${VAR:-default}` = default agar unset YA empty, `${VAR:?msg}` = ABORT). (2) `environment:` / `env_file:` container process ke ANDAR vars set karte hain. (3) `profiles:` optional services gate karte hain. (4) `compose.override.yaml` = ek doosri file base par auto-merged.',
      'Ek `.env` value khud container tak NAHI pahunchti — `.env` FILE ka interpolation feed karti hai. Aapko ise BHI reference karna chahiye (`environment: { FOO: ${FOO} }`) ya `env_file:` se load karna. CONTAINER env precedence: `environment:` > `env_file:` (later > earlier) > image `ENV`. Shell env interpolation ke liye `.env` ko beat karta hai. `docker compose config` resolved result dikhata hai aur kisi unset var par WARN karta hai — har `up` se pehle chalao.',
      '`profiles:` — ek `profiles:` list WALI service SIRF tab start hoti hai jab iska ek profile active hai (`--profile NAME` ya `COMPOSE_PROFILES=a,b`); `profiles:` key ke BINA ek service HAMESHA start hoti hai. Un cheezon ke liye jo stack ka part hain par hamesha nahi chahiye: ek admin UI, ek one-off seeder, ek load-tester.',
      '`compose.override.yaml` `compose.yaml` ke upar auto-loaded hai. Intended split: `compose.yaml` = shared definition; `compose.override.yaml` = LOCAL DEV tweaks. PROD ke liye auto-override par rely mat karo — ise explicitly name karo: `docker compose -f compose.yaml -f compose.prod.yaml up -d`.',
      'MERGE RULES (wo part jo sabko surprise karta hai): SCALARS → later file REPLACE karti hai. MAPS → KEY BY KEY merged. SEQUENCES (`ports:`, `volumes:`, list `command:`) → later list APPEND hoti hai, replace NAHI — to ek prod override jo `ports: ["443:80"]` add karta hai service ko DONO 443 aur base ke 8080 par chhodta hai. Ek list replace karne ke liye: `ports: !override [...]`. HAMESHA `docker compose config` se confirm karo. Aur: real `.env` ko `.gitignore` karo, ek documented `.env.example` commit karo; ek committed secret history mein forever hai — ROTATE karo.',
    ],
  },
];
