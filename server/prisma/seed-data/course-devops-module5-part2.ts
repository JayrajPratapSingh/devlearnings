/**
 * DevOps Complete Course — Module 5: Containers — Images, Layers & the Runtime, lessons 4-6.
 *
 * Lesson 4: Multi-stage builds & base images — build vs runtime stages; distroless,
 *           alpine, slim, scratch; non-root USER; HEALTHCHECK; image size & CVE
 *           surface. VERIFIED against a real Docker build where a daemon is up.
 * Lesson 5: Tags, digests & registries — why `latest` is a trap; digests; the OCI
 *           spec; registry auth; layer dedup. VERIFIED (digest pinning) where possible.
 * Lesson 6: The runtime & BuildKit — `docker run` flags (ports, volumes, env,
 *           resource limits, --user, --read-only), lifecycle, restart policies;
 *           BuildKit, cache mounts, secrets. VERIFIED where a daemon is up.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_5_PART2: CourseLesson[] = [
  {
    slug: 'ops-multi-stage-builds-and-base-images',
    title: 'Multi-Stage Builds & Base Images',
    titleHi: 'Multi-Stage Builds Aur Base Images',
    description: 'A multi-stage build compiles and assembles in one stage and copies only the finished artifact into a clean, minimal final stage — so build tools, source, and caches never ship. The base image you choose for that final stage sets the floor for image size, attack surface, and CVE count.',
    descriptionHi: 'Ek multi-stage build ek stage mein compile aur assemble karता hai aur sirf finished artifact ko ek clean, minimal final stage mein copy karता hai — to build tools, source, aur caches kabhi ship nahi karते. Jo base image aap us final stage ke liye choose karते ho wo image size, attack surface, aur CVE count ka floor set karता hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A workshop and a display case.** You need a full workshop — heavy tools, raw timber, sawdust, glue — to build the chair. But you do not ship the workshop to the customer; you carry the finished chair into a clean display case and send that. A multi-stage build is exactly this: the first stage is the messy workshop (compiler, dev headers, package manager, your whole source tree), the last stage is the display case (a minimal base image with just the runtime), and \`COPY --from=build\` carries only the finished chair across. Everything left in the workshop — including any offcut with your address written on it (a leaked secret, a build token) — never leaves the building.',
      hi: '**Ek workshop aur ek display case.** Aapको chair banाने ke liye ek full workshop chahिए — heavy tools, raw timber, sawdust, glue. Par aap workshop customer ko ship nahi karते; aap finished chair ko ek clean display case mein le jाते ho aur wo bhejते ho. Ek multi-stage build exactly yahi hai: pehla stage messy workshop hai (compiler, dev headers, package manager, aapка poora source tree), aakhiri stage display case hai (ek minimal base image sirf runtime ke saath), aur \`COPY --from=build\` sirf finished chair ko across le jата hai. Workshop mein bacha sab кुछ — jismें koi offcut jispar aapка address likhа hai (ek leaked secret) — kabhi building nahi chhoड़ता.',
    },

    simple: `**MULTI-STAGE BUILD — multiple FROM lines, only the LAST one ships:**
\`\`\`
# ---- stage 1: build (has the compiler, dev deps, source — NONE of this ships) ----
FROM golang:1.22 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/app ./cmd/app

# ---- stage 2: final (tiny; only the compiled binary) ----
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/app /app
USER nonroot
ENTRYPOINT ["/app"]
\`\`\`
Result: a ~10 MB image with ONE file, no shell, no package manager, no build tools,
no source, no leaked build secrets. vs a ~900 MB single-stage image.

**COPY --from=<stage|image>**  pull a path out of an earlier stage (by name or index)
or even out of another image:  \`COPY --from=nginx:1.27 /etc/nginx/mime.types /etc/\`

**BASE IMAGE CHOICES (final stage), smallest / safest first:**
\`\`\`
scratch          0 bytes. nothing. only for a fully static binary (Go, Rust). no shell, no libc, no certs*.
distroless       ~2-20 MB. libc + CA certs + tzdata + your lang runtime. NO shell, NO package manager.
                 -> smallest CVE surface for a real app. debug with the ':debug' tag.
alpine           ~5-10 MB. musl libc + busybox + apk. tiny, has a shell. WATCH: musl != glibc
                 (DNS quirks, some prebuilt wheels/binaries don't work; occasional perf cliffs).
*-slim (debian)  ~30-80 MB. glibc, minimal Debian, apt available. safest "just works" default.
full (debian/ubuntu) ~120-300 MB. everything. only as a BUILD stage, not a final image.
\`\`\`
*scratch/distroless: copy CA certs in if your app makes HTTPS calls (distroless includes them).

**SMALLER IMAGE = fewer CVEs to triage, faster pulls, faster cold starts, less to attack.**

**HARDEN THE FINAL STAGE:**
\`\`\`
USER 10001:10001         run as a non-root, high UID (not 'root', not UID 0)
                         (distroless ':nonroot' / a 'RUN adduser' in the build stage + COPY --chown)
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \\
  CMD ["/app","healthcheck"]   # exit 0 = healthy. distroless has no curl — use an app subcommand.
# also: --read-only rootfs at runtime, drop capabilities, no-new-privileges (Lesson 6)
\`\`\`

**PIN THE BASE:**  \`FROM golang:1.22.3@sha256:...\`  — a tag can be re-pushed; a digest can't.`,

    simpleHi: `**MULTI-STAGE BUILD — multiple FROM lines, sirf AAKHIRI ship hoता hai:**
\`\`\`
# ---- stage 1: build (compiler, dev deps, source — ye KUCH nahi ship hoता) ----
FROM golang:1.22 AS build
...
RUN CGO_ENABLED=0 go build -o /out/app ./cmd/app

# ---- stage 2: final (tiny; sirf compiled binary) ----
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/app /app
USER nonroot
ENTRYPOINT ["/app"]
\`\`\`
Result: ~10 MB image EK file ke saath, koi shell nahi, koi package manager nahi, koi build tools nahi,
koi source nahi, koi leaked build secrets nahi. vs ~900 MB single-stage image.

**COPY --from=<stage|image>**  ek earlier stage se ek path bahar nikalो (name ya index se) ya
ek doosri image se bhi.

**BASE IMAGE CHOICES (final stage), smallest / safest first:**
\`\`\`
scratch          0 bytes. kुछ nahi. sirf ek fully static binary (Go, Rust) ke liye. koi shell/libc/certs nahi.
distroless       ~2-20 MB. libc + CA certs + tzdata + aapका lang runtime. KOI shell nahi, KOI package manager nahi.
                 -> ek real app ke liye smallest CVE surface. ':debug' tag se debug karो.
alpine           ~5-10 MB. musl libc + busybox + apk. tiny, ek shell hai. DHYAAN: musl != glibc.
*-slim (debian)  ~30-80 MB. glibc, minimal Debian, apt. safest "just works" default.
full (debian/ubuntu) ~120-300 MB. sirf ek BUILD stage ke roop mein.
\`\`\`

**CHHOTA IMAGE = kम CVEs triage karने ko, faster pulls, faster cold starts, kम attack karने ko.**

**FINAL STAGE HARDEN KARO:**
\`\`\`
USER 10001:10001         ek non-root, high UID ke roop mein run karो
HEALTHCHECK --interval=30s ... CMD [...]   # exit 0 = healthy. distroless mein curl nahi — ek app subcommand use karो.
\`\`\`

**BASE PIN KARO:**  \`FROM golang:1.22.3@sha256:...\`  — ek tag re-push ho sakта hai; ek digest nahi.`,

    content: `## The problem: a build needs tools the runtime does not

To build an application you need a compiler or interpreter, development headers, a package manager, and your entire source tree. To *run* it you need only the compiled artifact (or the interpreter plus the app files) and its runtime dependencies. A single-stage Dockerfile ships all of it: the resulting image is large, carries every build tool as attack surface and as CVEs to track, and — because of layer immutability (Lesson 2) — still contains any secret or intermediate file even if a later instruction deleted it.

## Multi-stage builds

A **multi-stage build** uses multiple \`FROM\` instructions in one Dockerfile. Each \`FROM\` starts a new **stage** with its own base and its own filesystem. **Only the last stage becomes the image**; earlier stages are used during the build and then discarded. \`COPY --from=<stage>\` pulls specific files out of an earlier stage into the current one.

\`\`\`
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build            # produces /app/dist

FROM nginx:1.27-alpine       # the final image: just a web server
COPY --from=build /app/dist /usr/share/nginx/html
\`\`\`

The final image contains nginx and the built static files — a few tens of megabytes. It does **not** contain Node, npm, \`node_modules\`, the TypeScript source, or the build cache. For a compiled language the effect is starker:

\`\`\`
FROM golang:1.22 AS build              # ~800 MB with the toolchain
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/app ./cmd/app

FROM gcr.io/distroless/static-debian12:nonroot   # ~2 MB
COPY --from=build /out/app /app
USER nonroot
ENTRYPOINT ["/app"]
\`\`\`

The final image is the ~2 MB distroless base plus one statically linked binary — perhaps 12 MB total, versus ~900 MB for a naive single-stage build.

Other multi-stage capabilities:

- **\`COPY --from=<image>\`** — copy out of an arbitrary image, not just a stage: \`COPY --from=curlimages/curl /usr/bin/curl /usr/bin/curl\`.
- **Named intermediate targets** — \`docker build --target build .\` stops at the \`build\` stage, useful for CI test runs against the full toolchain.
- **A test stage** — \`FROM build AS test\` / \`RUN npm test\`, so tests run inside the build without bloating the final image.
- **Parallel stages** — independent stages build concurrently under BuildKit.

## Base image choices for the final stage

The base of the final stage sets the minimum size, the set of packages that will show up in vulnerability scans, and what tooling exists inside a running container. From smallest and most locked-down to largest:

| Base | Size | Contains | Use when |
|---|---|---|---|
| **\`scratch\`** | 0 | nothing at all | your artifact is a **fully static** binary (Go with \`CGO_ENABLED=0\`, Rust with musl). No shell, no libc, no CA certificates, no timezone data — you copy in whatever you need. |
| **distroless** (\`gcr.io/distroless/*\`) | 2–25 MB | glibc, CA certs, tzdata, and (for language variants) the runtime — **no shell, no package manager** | production images for most apps. Smallest realistic CVE surface. Debug with the \`:debug\` tag, which adds busybox. |
| **alpine** | 5–10 MB | musl libc, busybox, \`apk\` | you want tiny **and** a shell. Caveat: **musl is not glibc** — DNS resolution differs, some precompiled binaries and Python wheels do not work, and a few workloads hit performance cliffs. Test thoroughly. |
| **\`*-slim\`** (\`debian:12-slim\`, \`python:3.12-slim\`) | 30–80 MB | glibc, a minimal Debian, \`apt\` | the safe default when you need \`apt\` at runtime or compatibility matters more than the last few megabytes. |
| **full** (\`debian\`, \`ubuntu\`, \`python:3.12\`) | 120–350 MB | a complete distro | only as a **build stage**. Never a final image. |

## Why smaller is better beyond size

- **Fewer CVEs to triage.** Every package in the image can have a vulnerability. A scanner run against a full Debian image reports dozens to hundreds of findings — mostly in packages your app never calls, but each still needs a decision. A distroless image reports a handful.
- **Faster pulls and cold starts.** A smaller image transfers faster on deploy and on autoscale, so a scale-up event responds sooner.
- **Smaller attack surface.** No shell means an attacker who gets code execution cannot drop into an interactive shell or run standard tooling. No package manager means they cannot install more.
- **Less to keep patched.** Fewer packages means fewer base-image updates to chase.

## Hardening the final stage

- **Run as non-root.** Containers run as root by default, and a root process that escapes its namespace is root on the host. Use \`USER\` with a **non-zero UID** — either a distroless \`:nonroot\` variant, or in the build stage \`RUN adduser -u 10001 app\` and then \`COPY --from=build --chown=10001:10001 ...\` and \`USER 10001\`. A numeric UID (not a name) works even on \`scratch\` and satisfies orchestrator policies that require \`runAsNonRoot\`.
- **HEALTHCHECK.** \`HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 CMD [...]\`. The command's exit code is the health signal (0 healthy, 1 unhealthy). On distroless there is no \`curl\` — build a health subcommand into your binary (\`CMD ["/app","healthcheck"]\`) or copy a tiny checker in. Note that Kubernetes ignores the image's \`HEALTHCHECK\` and uses its own probes, but Compose and plain Docker use it.
- **Drop what you don't need at runtime** — covered in Lesson 6 (\`--read-only\`, \`--cap-drop\`, \`--security-opt no-new-privileges\`).

## Pin the base by digest

\`FROM python:3.12-slim\` resolves to whatever \`3.12-slim\` points at *now*, which changes as the maintainers re-push it. \`FROM python:3.12-slim@sha256:...\` locks to an exact image, so a build is reproducible and a base change is a deliberate, reviewed diff. Tools like Renovate and Dependabot can propose digest bumps as PRs.`,

    contentHi: `## Problem: ek build ko tools chahiye jo runtime ko nahi

Ek application build karने ke liye aapको ek compiler ya interpreter, development headers, ek package manager, aur aapका poora source tree chahiye. Ise *run* karने ke liye aapको sirf compiled artifact aur iski runtime dependencies chahiye. Ek single-stage Dockerfile sab кुछ ship karता hai: resulting image large hai, har build tool ko attack surface aur CVEs ke roop mein carry karता hai, aur — layer immutability ki wajah se — abhi bhi koi secret ya intermediate file contain karता hai chahे ek later instruction ne ise delete kiya.

## Multi-stage builds

Ek **multi-stage build** ek Dockerfile mein multiple \`FROM\` instructions istemal karता hai. Har \`FROM\` ek naya **stage** start karता hai apne base aur apni filesystem ke saath. **Sirf aakhiri stage image banता hai**; earlier stages build ke dauran istemal aur phir discarded hote hain. \`COPY --from=<stage>\` ek earlier stage se specific files current mein pull karता hai.

Ek compiled language ke liye effect starker hai: final image ~2 MB distroless base plus ek statically linked binary hai — shायद 12 MB total, versus ek naive single-stage build ke liye ~900 MB.

Doosri capabilities: **\`COPY --from=<image>\`** (ek arbitrary image se copy karो); **named intermediate targets** (\`docker build --target build\`); **ek test stage** (\`FROM build AS test\`); **parallel stages** (BuildKit ke under concurrently build).

## Base image choices

| Base | Size | Contains | Use when |
|---|---|---|---|
| **\`scratch\`** | 0 | kुछ nahi | aapка artifact ek **fully static** binary hai (Go, Rust). Koi shell/libc/certs nahi. |
| **distroless** | 2-25 MB | glibc, CA certs, tzdata, runtime — **koi shell nahi, koi package manager nahi** | zyaादातर apps ke liye production images. Smallest CVE surface. \`:debug\` tag se debug karो. |
| **alpine** | 5-10 MB | musl libc, busybox, \`apk\` | aapको tiny **aur** ek shell chahिए. Caveat: **musl glibc nahi hai**. |
| **\`*-slim\`** | 30-80 MB | glibc, minimal Debian, \`apt\` | safe default jab aapको \`apt\` chahिए ya compatibility matter karती hai. |
| **full** | 120-350 MB | ek complete distro | sirf ek **build stage** ke roop mein. |

## Kyun chhoटा better hai

- **Kम CVEs triage karने ko.** Image mein har package ki ek vulnerability ho sakती hai.
- **Faster pulls aur cold starts.**
- **Smaller attack surface.** Koi shell nahi matlab ek attacker ek interactive shell mein drop nahi kar sakта.
- **Patched rakhने ke liye kम.**

## Final stage harden karना

- **Non-root ke roop mein run karो.** \`USER\` ek **non-zero UID** ke saath istemal karो. Ek numeric UID (ek name nahi) \`scratch\` par bhi kaam karता hai.
- **HEALTHCHECK.** Command ka exit code health signal hai. Distroless par koi \`curl\` nahi — apne binary mein ek health subcommand build karो. Kubernetes image ka \`HEALTHCHECK\` ignore karता hai aur apni probes use karता hai.

## Base ko digest se pin karो

\`FROM python:3.12-slim\` jo bhi \`3.12-slim\` *ab* point karता hai use resolve karता hai. \`FROM python:3.12-slim@sha256:...\` ek exact image lock karता hai.`,

    examples: [
      {
        title: 'Single-stage vs multi-stage: same app, 30x smaller',
        titleHi: 'Single-stage vs multi-stage: same app, 30x chhota',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
printf 'package main\\nimport "fmt"\\nfunc main(){ fmt.Println("hello from a container") }\\n' > main.go
printf 'module hello\\n\\ngo 1.22\\n' > go.mod

# single-stage: the final image IS the Go toolchain image + the binary
printf 'FROM golang:1.22-alpine\\nWORKDIR /src\\nCOPY . .\\nRUN go build -o /app .\\nCMD ["/app"]\\n' > Dockerfile.single
# multi-stage: build in the toolchain image, copy just the static binary onto scratch
printf 'FROM golang:1.22-alpine AS build\\nWORKDIR /src\\nCOPY . .\\nRUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /app .\\nFROM scratch\\nCOPY --from=build /app /app\\nCMD ["/app"]\\n' > Dockerfile.multi

docker build -q -f Dockerfile.single -t sz-single . >/dev/null
docker build -q -f Dockerfile.multi  -t sz-multi  . >/dev/null
s=$(docker image inspect sz-single --format '{{.Size}}')
m=$(docker image inspect sz-multi  --format '{{.Size}}')

echo "single-stage: hundreds of MB (ships the whole Go toolchain + source)"
echo "multi-stage:  a few MB (only the static binary, on scratch)"
[ "$m" -lt $(( s / 50 )) ] && echo "measured: the multi-stage image is >50x smaller than the single-stage one"
echo "both run identically:"
docker run --rm sz-single
docker run --rm sz-multi
docker rmi -f sz-single sz-multi >/dev/null 2>&1 || true`,
        output: `single-stage: hundreds of MB (ships the whole Go toolchain + source)
multi-stage:  a few MB (only the static binary, on scratch)
measured: the multi-stage image is >50x smaller than the single-stage one
both run identically:
hello from a container
hello from a container`,
        explain: 'The same trivial program is built two ways. The single-stage build uses the Go toolchain image as its base and never leaves it, so the final image is that entire image — hundreds of megabytes of compiler, standard library source, and tooling — plus the compiled binary and the copied source. The multi-stage build does the compilation in a first stage that also uses the toolchain image, then starts a second stage from scratch, the empty base, and copies only the finished binary into it. Because the binary is statically linked it needs nothing else at runtime: no libc, no shell, no operating-system files. The final image is that one file, a few megabytes, and the measurement confirms it is more than fifty times smaller. Both containers run the program and produce identical output, because the runtime needs only the binary; everything the build needed was in the discarded first stage. The size difference is not a marginal optimisation — it is the difference between an image that pulls in seconds and one that takes a minute, between a vulnerability scan with hundreds of findings and one with zero, and between an image an attacker can explore with a shell and one with no shell to find.',
        explainHi: 'Wahi trivial program do tarike se built hai. Single-stage build Go toolchain image ko apne base ke roop mein istemal karता hai aur ise kabhi nahi chhoड़ता, to final image wo poori image hai — lagभag आठ sौ assी megabytes ka compiler aur tooling — plus compiled binary. Multi-stage build compilation ek pehle stage mein karता hai jo bhi toolchain image istemal karता hai, phir scratch se ek doosरा stage start karता hai, empty base, aur sirf finished binary ko ismें copy karता hai. Kyunki binary statically linked hai ise runtime par kुछ aur nahi chahिए. Final image wo ek file hai, do megabytes se kम. Dono containers program run karते hain aur identical output produce karते hain. Size difference ek marginal optimisation nahi hai — ye ek image jo seconds mein pull hoती hai aur ek jo ek minute leता hai ke beech ka difference hai.',
      },
      {
        title: 'Running as non-root, and what breaks if you do not',
        titleHi: 'Non-root ke roop mein run karna, aur agar aap nahi karte to kya toota hai',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > Dockerfile <<'EOF'
FROM alpine:3.20
RUN adduser -D -u 10001 app
USER app
WORKDIR /home/app
EOF
docker build -q -t nonroot . >/dev/null

echo "--- identity inside the container ---"
docker run --rm nonroot id

echo "--- can write to a dir it owns ---"
docker run --rm nonroot sh -c 'echo ok > f && echo "wrote ./f"'

echo "--- CANNOT write to a root-owned path ---"
docker run --rm nonroot sh -c 'echo x > /etc/hosts' 2>/dev/null \\
  && echo "wrote (unexpected)" || echo "denied: /etc/hosts is root-owned"

echo "--- CANNOT install packages (apk needs root) ---"
docker run --rm nonroot apk add --no-cache curl 2>&1 | grep -oE 'ERROR:.*Permission denied' | head -1
docker rmi -f nonroot >/dev/null 2>&1 || true`,
        output: `--- identity inside the container ---
uid=10001(app) gid=10001(app) groups=10001(app)
--- can write to a dir it owns ---
wrote ./f
--- CANNOT write to a root-owned path ---
denied: /etc/hosts is root-owned
--- CANNOT install packages (apk needs root) ---
ERROR: Unable to lock database: Permission denied`,
        explain: 'The image creates a dedicated user with a high numeric id and switches to that user for everything that follows, so inside the container the process runs as that unprivileged user, not as root. It can write to a directory it owns, which is where the application should keep any files it needs to create at runtime. It cannot write to files owned by root, such as the hosts file, so a compromised process cannot tamper with the container\'s own system configuration. It also cannot use the package manager, because installing packages requires writing to root-owned system directories and lock files — which is exactly why the image is built with everything it needs at build time and then runs as a non-privileged user. The reason this matters is that container isolation rests on the host kernel, and a process running as root inside the container is root in its user namespace; if it finds a way out through a kernel bug, it is root on the host. Running as a non-root user removes that escalation path and is required by most orchestrator security policies. The user should be given as a numeric id, not only a name, so a policy check can verify it is non-zero without resolving names inside the image.',
        explainHi: 'Image ek dedicated user banata hai ek high numeric id ke saath aur uske baad sab kuch ke liye us user par switch karta hai, to container ke andar process us unprivileged user ke roop mein run karta hai, root ke roop mein nahi. Ye ek directory mein write kar sakta hai jise ye own karta hai. Ye root ke owned files mein write nahi kar sakta, jaise hosts file, to ek compromised process container ki apni system configuration se tamper nahi kar sakta. Ye package manager bhi use nahi kar sakta, kyunki packages install karne ke liye root-owned system directories aur lock files mein write karna padta hai (jo image ko build time par sab kuch ke saath banane aur phir ek non-privileged user ke roop mein run karne ka point hai). Ye kyun matter karta hai: container isolation host kernel par rests karta hai, aur container ke andar root ke roop mein run karta ek process apne user namespace mein root hai; agar ye ek kernel bug ke through bahar nikalta hai, ye host par root hai. Non-root user ke roop mein run karna us escalation path ko remove karta hai aur zyadatar orchestrator security policies dwara required hai. User ko ek numeric id ke roop mein dena chahiye, sirf ek naam nahi, taaki ek policy check verify kar sake ki ye non-zero hai bina naam resolve kiye.',
      },
    ],

    mistakes: [
      {
        wrong: `# shipping the build stage as the final image
FROM node:20
WORKDIR /app
COPY . .
RUN npm ci && npm run build
CMD ["node", "dist/server.js"]
# -> 1.1 GB image. contains: full Node, npm, ALL of node_modules (incl. devDependencies
//    — the entire TypeScript compiler, test framework, linters), the .ts source,
//    the build cache. every one is CVE surface. cold starts and pulls are slow.`,
        right: `FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci                          # all deps, incl. dev, needed to build
COPY . .
RUN npm run build                   # -> dist/

FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev               # PROD deps only

FROM gcr.io/distroless/nodejs20-debian12:nonroot
WORKDIR /app
COPY --from=deps  /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD ["dist/server.js"]
# -> ~180 MB. no npm, no dev deps, no source, no shell. runs as nonroot.`,
        why: 'Building an application and running it need different things. The build needs the full language toolchain, the package manager, every development dependency such as compilers, test frameworks, and linters, and the source code. Running it needs only the built output and the production dependencies. A Dockerfile with a single stage keeps all of the build-time material in the final image, so the image is large, slow to transfer, slow to start, and carries a large set of packages that a vulnerability scanner will flag, most of which the running application never touches but each of which still requires triage. A multi-stage build performs the build in an earlier stage, resolves the production-only dependencies in another, and assembles a final image from a minimal base containing just the built output and the production dependencies. The final image is a fraction of the size, has a small and mostly relevant set of packages, starts faster, and — on a shell-less base — gives an attacker who achieves code execution nothing to pivot with.',
        whyHi: 'Ek application build karना aur ise run karना alag cheezें chahिए. Build ko full language toolchain, package manager, har development dependency, aur source code chahिए. Ise run karने ke liye sirf built output aur production dependencies chahिए. Ek single stage wala Dockerfile saara build-time material final image mein rakhता hai, to image large hai, transfer karने mein slow, start karने mein slow, aur packages ka ek large set carry karता hai jo ek vulnerability scanner flag karega. Ek multi-stage build build ko ek earlier stage mein perform karता hai, production-only dependencies ko ek doosरे mein resolve karта hai, aur ek minimal base se ek final image assemble karता hai. Final image size ka ek fraction hai, faster start hoती hai.',
      },
      {
        wrong: `# switching to alpine "for size" without testing the runtime differences
FROM python:3.12-alpine
RUN pip install pandas numpy psycopg2-binary   # -> compiles from source for ~15 min
                                                #    (no musl wheels) OR fails outright
# and later, in prod: intermittent DNS failures because musl's resolver doesn't
# read /etc/resolv.conf 'search' domains the same way glibc does.`,
        right: `# default to *-slim (glibc, apt) unless you've verified alpine works for YOUR stack:
FROM python:3.12-slim
RUN pip install --no-cache-dir pandas numpy psycopg2-binary   # prebuilt glibc wheels, seconds
# choose alpine only after testing: dependency install works, DNS resolves in your
# network, no perf regression, and you actually need the ~40 MB it saves.
# for the very smallest: distroless python, with deps built in a slim 'build' stage.`,
        why: 'Alpine is small because it uses musl as its C library and busybox for core utilities instead of the more common glibc and GNU coreutils. Most of the time this is invisible, but the differences are real and surface in specific ways. Many Python packages and other ecosystems distribute precompiled binaries built against glibc; on alpine these do not apply, so the package manager falls back to compiling from source, which is slow and needs a full build toolchain in the image, or fails if build dependencies are missing. musl\'s DNS resolver also behaves differently from glibc\'s in areas like search-domain handling and concurrent lookups, which can cause intermittent resolution failures that are hard to diagnose. And a few workloads have hit performance differences in memory allocation. None of this means alpine is wrong, but choosing it purely for image size without validating that the dependency installation works, that DNS resolves correctly in the target network, and that there is no performance regression trades a small size saving for a class of subtle production problems. The slim Debian variants keep glibc and apt and are the safer default; the smallest images come from distroless with dependencies built in a separate stage.',
        whyHi: 'Alpine small hai kyunki ye apni C library ke roop mein musl aur core utilities ke liye busybox istemal karता hai zyada common glibc aur GNU coreutils ke bजaay. Zyaादातر samay ye invisible hai, par differences real hain. Bahut se Python packages glibc ke against built precompiled binaries distribute karте hain; alpine par ye apply nahi hote, to package manager source se compile karने par fall back karता hai, jo slow hai. musl ka DNS resolver bhi glibc se alag behave karता hai search-domain handling jaisे areas mein, jo intermittent resolution failures cause kar sakта hai. Ise purely image size ke liye choose karना ek small size saving ko subtle production problems ki ek class ke liye trade karता hai. Slim Debian variants safer default hain.',
      },
      {
        wrong: `# leaving the final image running as root "because it works"
FROM node:20-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
CMD ["node", "dist/server.js"]        # no USER -> runs as root (UID 0)
# -> a code-exec bug in the app is now root INSIDE the container. combined with any
//    container-escape primitive (kernel bug, a misconfigured mount, a bad capability)
//    that's root on the HOST. also: k8s 'runAsNonRoot: true' policies reject it.`,
        right: `FROM node:20-slim
RUN groupadd -r app && useradd -r -g app -u 10001 app
WORKDIR /app
COPY --from=build --chown=10001:10001 /app/dist ./dist
USER 10001:10001                      # numeric UID: works with runAsNonRoot policy checks
CMD ["node", "dist/server.js"]
# app listens on a HIGH port (e.g. 3000); a proxy/orchestrator maps 80/443 to it.
# combine with Lesson 6: --read-only, --cap-drop=ALL, --security-opt no-new-privileges.`,
        why: 'A container process runs as root by default, and that root is root within the container\'s user namespace with the container\'s capabilities. This is more privilege than an application needs, and it is dangerous in combination with any weakness in the isolation. Container isolation depends on the host kernel being correct and on the runtime configuration being sound; a kernel vulnerability, a host path mounted into the container, or an over-broad capability can give a process a way to act outside the container, and a process that is already root has far more it can do with that opening than an unprivileged one. Running the application as a dedicated non-root user with a fixed numeric id removes this: the process cannot modify the container\'s system files, cannot bind privileged ports, and if it does escape it does so without root. Most orchestrators can enforce a policy that rejects containers running as root, and that policy check needs a numeric id so it can confirm the id is non-zero. The application should listen on a non-privileged port and rely on a proxy or the platform to expose the standard ports.',
        whyHi: 'Ek container process default se root ke roop mein run karता hai, aur wo root container ke user namespace mein root hai container ki capabilities ke saath. Ye ek application ki zaroorat se zyada privilege hai, aur isolation mein kisi bhi weakness ke combination mein ye dangerous hai. Container isolation host kernel ke correct hone par depend karता hai; ek kernel vulnerability, container mein mounted ek host path, ya ek over-broad capability ek process ko container ke bahar act karने ka ek raasta de sakта hai, aur ek process jo pehle se root hai us opening ke saath ek unprivileged wale se kahीं zyada kar sakта hai. Application ko ek dedicated non-root user ke roop mein ek fixed numeric id ke saath run karना ise remove karता hai. Zyaादातर orchestrators ek policy enforce kar sakते hain jo root ke roop mein run karते containers ko reject karती hai.',
      },
    ],

    realWorld: [
      {
        en: '**A 1.3 GB Node image → 190 MB** via a three-stage build (build / prod-deps / distroless final). Deploy time dropped from ~90 s to ~15 s per pod, and the weekly CVE-triage list went from ~140 findings to ~6.',
        hi: '**Ek 1.3 GB Node image → 190 MB** ek three-stage build ke through. Deploy time ~90 s se ~15 s per pod par gira, aur weekly CVE-triage list ~140 findings se ~6 par.',
      },
      {
        en: '**An alpine migration reverted after a week** — `psycopg2-binary` had no musl wheel so it compiled from source (adding 200 MB of build tools), and musl\'s resolver caused ~0.5% of DB connections to fail DNS. Back to `python:3.12-slim`.',
        hi: '**Ek alpine migration ek hafte baad reverted** — `psycopg2-binary` ka koi musl wheel nahi tha, aur musl ke resolver ne ~0.5% DB connections ko DNS fail karवाया.',
      },
      {
        en: '**A container-escape in a pentest went from "read one file" to "root on the node"** only because the app ran as UID 0. After adding `USER 10001` + `runAsNonRoot` + `cap-drop=ALL`, the same primitive got the tester nothing useful.',
        hi: '**Ek pentest mein ek container-escape "ek file padhो" se "node par root" par gaya** sirf kyunki app UID 0 ke roop mein run karता tha. `USER 10001` + `runAsNonRoot` add karने ke baad, same primitive ne kुछ useful nahi diya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a multi-stage build and what specific problems does it solve?',
        qHi: 'Ek multi-stage build kya hai aur ye kaunसी specific problems solve karता hai?',
        a: 'A multi-stage build is a Dockerfile with more than one FROM instruction, where each FROM starts a new stage with its own base image and filesystem, only the final stage becomes the published image, and COPY with a from flag pulls selected files out of an earlier stage into a later one. It solves three linked problems of a single-stage build. First, size: building needs the full toolchain, the package manager, every development dependency, and the source, but running needs only the built artifact and the production dependencies, so a single stage ships hundreds of megabytes of material the runtime never uses. Second, attack surface and vulnerability noise: every package in the final image is something a scanner flags and something an attacker could use, and a build image is full of packages the application never calls; a minimal final stage from distroless or scratch has almost none. Third, secret and intermediate leakage: because layers are immutable, anything written during the build stays in the image even if a later instruction deletes it, but with a multi-stage build the sensitive step runs in an earlier stage and only its clean output is copied forward, so build secrets and intermediate files never exist in the final image. The typical shape is a build stage on the toolchain image, optionally a stage that resolves production-only dependencies, and a final stage on a minimal base that copies in just the artifact and runs it as a non-root user.',
        aHi: 'Ek multi-stage build ek Dockerfile hai ek se zyada FROM instruction ke saath, jahaan har FROM ek naya stage start karता hai apne base image aur filesystem ke saath, sirf final stage published image banता hai, aur COPY ek from flag ke saath ek earlier stage se selected files ek later mein pull karта hai. Ye ek single-stage build ki teen linked problems solve karता hai. Pehla, size: building ko full toolchain chahिए par running ko sirf built artifact chahिए. Doosra, attack surface aur vulnerability noise: final image mein har package ek scanner flag karता hai; ek minimal final stage se distroless ya scratch ke paas lagभag koi nahi. Teesra, secret aur intermediate leakage: kyunki layers immutable hain, build ke dauran likhा kुछ bhi image mein rehता hai, par ek multi-stage build ke saath sensitive step ek earlier stage mein run karता hai aur sirf iska clean output forward copy hoता hai.',
      },
      {
        q: 'Compare scratch, distroless, alpine, and slim base images. When would you use each?',
        qHi: 'scratch, distroless, alpine, aur slim base images compare karो. Aap har ek kab istemal karोge?',
        a: 'Scratch is the empty base — nothing at all, not even a C library or a shell. You use it only when your artifact is a fully static binary that needs nothing from an operating system, typically a Go binary built with cgo disabled or a Rust binary against musl; you copy in CA certificates and timezone data yourself if the app needs them. Distroless images contain a C library, CA certificates, timezone data, and for language variants the language runtime, but deliberately no shell and no package manager. They are the smallest realistic choice for a real application, they minimise the vulnerability-scan surface, and an attacker who gets code execution finds no shell to use; you debug them with a special debug tag that adds busybox. Alpine is small because it uses musl instead of glibc and busybox instead of GNU tools, and it does include a shell and a package manager. It is a good choice when you want small and also want a shell, but musl differs from glibc in DNS resolution and in whether precompiled binaries and Python wheels work, so it needs testing before adoption. The slim Debian variants keep glibc and the apt package manager on a trimmed Debian base; they are larger than alpine but avoid the compatibility surprises, and they are the safe default when compatibility matters more than the last tens of megabytes. Full distro images are only appropriate as a build stage, never as a final image.',
        aHi: 'Scratch empty base hai — kुछ bhi nahi, ek C library ya ek shell bhi nahi. Aap ise sirf tab istemal karते ho jab aapका artifact ek fully static binary hai. Distroless images mein ek C library, CA certificates, timezone data, aur language variants ke liye language runtime hai, par deliberately koi shell nahi aur koi package manager nahi. Wo ek real application ke liye smallest realistic choice hain, wo vulnerability-scan surface minimise karते hain. Alpine small hai kyunki ye glibc ke bजaay musl istemal karता hai, aur ismें ek shell aur ek package manager hai. Ye ek achhी choice hai jab aapको small aur ek shell chahिए, par musl glibc se DNS resolution mein differ karता hai, to ise adoption se pehle testing chahिए. Slim Debian variants glibc aur apt ko ek trimmed Debian base par rakhते hain; wo alpine se larger hain par compatibility surprises avoid karते hain, aur wo safe default hain. Full distro images sirf ek build stage ke roop mein appropriate hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write a 3-stage Dockerfile for a TypeScript Node service (build → prod-deps → distroless final) and list four things the final image does NOT contain that a single-stage image would.',
        taskHi: 'Ek comment mein, ek TypeScript Node service ke liye ek 3-stage Dockerfile likho.',
        hint: '```\nFROM node:20 AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build          # -> dist/\n\nFROM node:20-slim AS deps\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev       # prod deps only\n\nFROM gcr.io/distroless/nodejs20-debian12:nonroot\nWORKDIR /app\nCOPY --from=deps  /app/node_modules ./node_modules\nCOPY --from=build /app/dist ./dist\nCMD ["dist/server.js"]\n```\nThe final image does NOT contain: (1) npm / the package manager; (2) devDependencies (TypeScript compiler, test framework, linters, types); (3) the `.ts` source + build cache; (4) a shell / apt / OS tooling. Also: it runs as nonroot, not root.',
        hintHi: '3 stages: `build` (node:20, `npm ci`, `npm run build`) → `deps` (node:20-slim, `npm ci --omit=dev`) → final (distroless nodejs, `COPY --from=deps node_modules`, `COPY --from=build dist`). Final image mein NAHI: (1) npm; (2) devDependencies (TS compiler, test framework); (3) `.ts` source + build cache; (4) shell/apt. Aur: nonroot ke roop mein run karता hai.',
      },
      {
        task: 'In a comment, explain why "just use alpine for a smaller image" can backfire for a Python data app, covering the wheel problem and the DNS problem, and what the safer default is.',
        taskHi: 'Ek comment mein, samjhाओ kyun "ek smaller image ke liye alpine use karो" ek Python data app ke liye backfire kar sakта hai.',
        hint: 'Alpine uses musl libc (not glibc) + busybox. WHEEL problem: PyPI packages like pandas/numpy/psycopg2-binary ship precompiled wheels built against glibc — on alpine those don\'t apply, so pip compiles from source (~10-15 min, and needs a full build toolchain baked in, adding ~200 MB) or fails if build deps are missing. DNS problem: musl\'s resolver handles `/etc/resolv.conf` `search` domains and concurrent lookups differently from glibc → intermittent, hard-to-diagnose resolution failures in some networks. Safer default: `python:3.12-slim` (glibc + apt, prebuilt wheels work in seconds, no DNS surprises). Choose alpine only after verifying your deps install, DNS resolves in the target network, and there\'s no perf regression — and for the very smallest, use distroless-python with deps built in a slim build stage.',
        hintHi: 'Alpine musl libc (glibc nahi) + busybox use karता hai. WHEEL problem: pandas/numpy/psycopg2-binary glibc ke against precompiled wheels ship karते hain — alpine par pip source se compile karता hai (~15 min, ~200 MB build tools) ya fail. DNS problem: musl ka resolver `search` domains alag handle karता hai → intermittent failures. Safer default: `python:3.12-slim`. Alpine sirf testing ke baad choose karो.',
      },
      {
        task: 'In a comment, explain why running a container as root is dangerous, what a numeric `USER 10001` fixes, why the app must then listen on a high port, and how it combines with `runAsNonRoot` policies.',
        taskHi: 'Ek comment mein, samjhाओ kyun ek container ko root ke roop mein run karना dangerous hai.',
        hint: 'Containers run as root (UID 0) by default; that root has the container\'s capabilities in the container\'s user namespace. A code-exec bug is then root INSIDE the container, and combined with ANY isolation weakness (kernel bug, a host path mounted in, an over-broad capability) it can become root on the HOST. `USER 10001:10001` (a dedicated non-root user) means the process can\'t modify the container\'s system files, can\'t bind ports <1024, and if it escapes it does so without root — removing the escalation path. It must be a NUMERIC uid (not a name) so an orchestrator\'s `runAsNonRoot: true` policy can verify it\'s non-zero without name resolution; a name-only `USER` is rejected by that check. Because a non-root process can\'t bind <1024, the app listens on a high port (3000/8080) and a proxy or the orchestrator maps 80/443 to it. Combine with `--read-only`, `--cap-drop=ALL`, `--security-opt no-new-privileges` (Lesson 6).',
        hintHi: 'Containers default se root (UID 0) ke roop mein run karते hain. Ek code-exec bug phir container ke ANDAR root hai, aur KISI bhi isolation weakness ke combination mein HOST par root ban sakта hai. `USER 10001:10001` matlab process system files modify nahi kar sakта, <1024 ports bind nahi kar sakта, aur agar escape karता hai to bina root. Ek NUMERIC uid honा chahिए taki `runAsNonRoot: true` policy verify kar sake. App ek high port (3000/8080) par listen karता hai; ek proxy 80/443 map karता hai.',
      },
    ],

    keyTakeaways: [
      'A MULTI-STAGE build = multiple `FROM` instructions; each starts a new STAGE with its own base + filesystem; ONLY THE LAST STAGE becomes the image (earlier stages are discarded after the build). `COPY --from=<stage|image>` pulls selected files forward. It solves 3 linked problems: SIZE (build needs the toolchain + dev deps + source; runtime needs only the artifact + prod deps), ATTACK SURFACE + CVE NOISE (every package in the final image is scanner-flagged and attacker-usable), and SECRET/INTERMEDIATE LEAKAGE (immutable layers keep anything written during the build even if "deleted" — but a multi-stage build runs the sensitive step in an earlier stage and copies only its clean output). Also: `--target` stops at a named stage; `FROM build AS test` runs tests without bloating the final image.',
      'BASE IMAGE for the FINAL stage sets the floor for size, CVE count, and in-container tooling. Smallest/safest first: `scratch` (0 bytes — only for a FULLY STATIC binary: Go `CGO_ENABLED=0`, Rust+musl; no shell/libc/certs — copy in what you need); DISTROLESS (~2-25 MB — libc + CA certs + tzdata + lang runtime, NO shell, NO package manager — smallest realistic CVE surface for a real app; debug with `:debug`); ALPINE (~5-10 MB — musl+busybox+apk, HAS a shell — but musl≠glibc: precompiled wheels/binaries may not work, DNS resolves differently, occasional perf cliffs — TEST before adopting); `*-slim` (~30-80 MB — glibc + minimal Debian + apt — the safe "just works" default); FULL distro (~120-350 MB — only as a BUILD stage, never a final image).',
      'SMALLER IMAGE beyond size: FEWER CVEs to triage (a full-Debian scan = dozens-to-hundreds of findings, mostly in packages the app never calls; distroless = a handful); FASTER pulls + cold starts (scale-up responds sooner); SMALLER ATTACK SURFACE (no shell = an attacker with code-exec has nothing to pivot with; no package manager = they can\'t install more); LESS to keep patched.',
      'HARDEN THE FINAL STAGE: (1) RUN AS NON-ROOT — containers run as root (UID 0) by default; a code-exec bug is then root IN the container, and combined with any isolation weakness → root on the HOST. Use `USER` with a NON-ZERO NUMERIC uid (`USER 10001:10001`) — a numeric id (not a name) satisfies orchestrator `runAsNonRoot` policy checks; works even on `scratch`; use a distroless `:nonroot` variant or `RUN adduser` in the build stage + `COPY --from=build --chown=10001:10001`. The app then listens on a HIGH port (3000/8080) and a proxy/orchestrator maps 80/443. (2) HEALTHCHECK `--interval=30s --timeout=3s --start-period=20s --retries=3 CMD [...]` — exit 0 = healthy; distroless has no `curl` so build a health subcommand into your binary; NOTE Kubernetes ignores the image `HEALTHCHECK` and uses its own probes (Compose + plain Docker use it).',
      'PIN THE BASE BY DIGEST: `FROM python:3.12-slim@sha256:...` — a tag can be silently re-pushed, a digest can\'t, so the build is reproducible and a base change is a deliberate reviewed diff (Renovate/Dependabot can propose digest bumps). Combine the non-root final stage with runtime hardening (Lesson 6): `--read-only`, `--cap-drop=ALL`, `--security-opt no-new-privileges`.',
    ],
    keyTakeawaysHi: [
      'Ek MULTI-STAGE build = multiple `FROM` instructions; har ek ek naya STAGE start karта hai apne base + filesystem ke saath; SIRF AAKHIRI STAGE image banता hai. `COPY --from=<stage|image>` selected files forward pull karता hai. Ye 3 linked problems solve karता hai: SIZE, ATTACK SURFACE + CVE NOISE, aur SECRET/INTERMEDIATE LEAKAGE (immutable layers build ke dauran likhा kुछ bhi rakhते hain — par ek multi-stage build sensitive step ek earlier stage mein run karता hai).',
      'FINAL stage ke liye BASE IMAGE size, CVE count, aur in-container tooling ka floor set karता hai. Smallest/safest pehle: `scratch` (0 bytes — sirf ek FULLY STATIC binary ke liye); DISTROLESS (~2-25 MB — libc + CA certs + runtime, KOI shell nahi, KOI package manager nahi); ALPINE (~5-10 MB — musl+busybox, ek shell HAI — par musl≠glibc: wheels/binaries kaam nahi kar sakते, DNS alag — TEST karो); `*-slim` (~30-80 MB — glibc + apt — safe default); FULL distro (sirf ek BUILD stage ke roop mein).',
      'CHHOTA IMAGE size se aage: KAM CVEs triage karने ko; FASTER pulls + cold starts; SMALLER ATTACK SURFACE (koi shell nahi = pivot karने ko kुछ nahi); PATCHED rakhने ke liye kम.',
      'FINAL STAGE HARDEN KARO: (1) NON-ROOT KE ROOP MEIN RUN KARO — containers default se root (UID 0); ek code-exec bug phir container mein root, aur kisi bhi isolation weakness ke saath → HOST par root. `USER` ek NON-ZERO NUMERIC uid ke saath (`USER 10001:10001`) — ek numeric id `runAsNonRoot` policy checks satisfy karता hai. App ek HIGH port par listen karता hai. (2) HEALTHCHECK — exit 0 = healthy; distroless mein `curl` nahi; Kubernetes image `HEALTHCHECK` ignore karта hai aur apni probes use karता hai.',
      'BASE KO DIGEST SE PIN KARO: `FROM python:3.12-slim@sha256:...` — ek tag silently re-push ho sakта hai, ek digest nahi. Non-root final stage ko runtime hardening ke saath combine karो (Lesson 6): `--read-only`, `--cap-drop=ALL`, `--security-opt no-new-privileges`.',
    ],
  },

  {
    slug: 'ops-tags-digests-and-registries',
    title: 'Tags, Digests & Registries',
    titleHi: 'Tags, Digests Aur Registries',
    description: 'A tag is a mutable pointer to an image; a digest is an immutable content hash. Deploying by tag means you cannot be sure what actually ran; deploying by digest means the exact bytes are pinned. Registries store images as content-addressed layers plus a manifest, and dedupe everything on push and pull.',
    descriptionHi: 'Ek tag ek image ka ek mutable pointer hai; ek digest ek immutable content hash hai. Tag se deploy karना matlab aap sure nahi ho sakते ki actually kya run hua; digest se deploy karना matlab exact bytes pinned hain. Registries images ko content-addressed layers plus ek manifest ke roop mein store karते hain, aur push aur pull par sab кुछ dedupe karते hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A tag is a name on a mailbox; a digest is the fingerprint of the person inside.** "Apartment 3B" (the tag \`v1.4\`) reliably gets your letter to a door — but the tenant can change without the label changing. If you need to be certain you are talking to the same person you met last week, you check their fingerprint (the digest \`sha256:…\`), which cannot be reassigned. \`latest\` is the worst kind of mailbox label — "whoever moved in most recently" — so a letter addressed to \`latest\` reaches a different person every few weeks and you have no record of who. Production deploys address the fingerprint; the human-friendly name is just for finding the building.',
      hi: '**Ek tag ek mailbox par ek naam hai; ek digest andar wale wyakti ka fingerprint hai.** "Apartment 3B" (tag \`v1.4\`) reliably aapका letter ek door tak pahunchता hai — par tenant label badle bina change ho sakта hai. Agar aapको certain honा hai ki aap same person se baat kar rahे ho jise aap pichle hafte mile, aap unka fingerprint (digest \`sha256:…\`) check karते ho, jo reassign nahi ho sakता. \`latest\` sabse bura kind ka mailbox label hai — "jo bhi sabse recently move in hua" — to \`latest\` ko addressed ek letter har kुछ hafte ek alag person tak pahunchता hai. Production deploys fingerprint ko address karते hain.',
    },

    simple: `**TAG vs DIGEST:**
\`\`\`
TAG      myapp:1.4.0   — a MUTABLE, human-readable pointer. can be moved to a different
         image at any time ('docker push myapp:1.4.0' again overwrites it). NO guarantee
         that the myapp:1.4.0 you pulled today == the one you pulled last week.
DIGEST   myapp@sha256:9f2a...  — an IMMUTABLE content hash of the image MANIFEST.
         a given digest ALWAYS refers to the exact same bytes. cannot be reassigned.
\`\`\`

**WHY \`latest\` IS A TRAP:**
\`\`\`
- 'latest' is just a tag with no special meaning — it is NOT auto-updated, it points at
  whatever was last pushed WITHOUT a tag (or explicitly tagged 'latest')
- 'docker run myapp' (no tag) = 'myapp:latest' — silently pulls a moving target
- two nodes pulling 'latest' minutes apart can run DIFFERENT code
- a rollback to 'latest' rolls back to... now. there is nothing to roll back to.
- CI that builds + pushes 'latest' and deploys 'latest' has NO record of what shipped
-> ALWAYS deploy an immutable reference: a version tag you never reuse, or (best) a digest
\`\`\`

**AN IMAGE REFERENCE:**  \`[registry/]namespace/repo[:tag][@sha256:digest]\`
\`\`\`
ghcr.io/acme/api:1.4.0
ghcr.io/acme/api:1.4.0@sha256:9f2a...      (tag for humans + digest for the machine)
123456789.dkr.ecr.eu-west-1.amazonaws.com/api@sha256:9f2a...
\`\`\`
No registry -> Docker Hub (\`docker.io/library/<name>\` for official images).

**WHAT A REGISTRY STORES (the OCI model):**
\`\`\`
- BLOBS: the layer tarballs + the config JSON, each stored + addressed by its sha256
- a MANIFEST: JSON listing the config digest + the ordered layer digests + sizes;
  the image's DIGEST is the sha256 of this manifest
- a MANIFEST LIST / INDEX: for multi-arch — maps linux/amd64, linux/arm64 -> per-arch manifests
- TAGS: mutable name -> manifest-digest mappings
\`\`\`

**PUSH / PULL are DEDUPLICATED:**
\`\`\`
push  -> for each layer, ask the registry "have this sha256?" — upload only the ones it lacks
pull  -> download only the layers not already in the local store; verify each against its digest
\`\`\`

**REGISTRIES:**  Docker Hub · GHCR (github) · ECR (aws) · Artifact Registry (gcp) · ACR (azure) ·
Harbor / Zot / distribution (self-host). Auth: \`docker login\`; CI uses a token / OIDC / IAM role.
Private images need pull credentials on every node (a k8s imagePullSecret, an ECR helper, ...).

**IMMUTABLE TAGS:** some registries can mark a repo's tags immutable — a re-push of an
existing tag is REJECTED. Turn this on; it makes \`v1.4.0\` mean one thing forever.`,

    simpleHi: `**TAG vs DIGEST:**
\`\`\`
TAG      myapp:1.4.0   — ek MUTABLE, human-readable pointer. kisi bhi samay ek alag image par
         move ho sakта hai. KOI guarantee nahi ki aaj pulled myapp:1.4.0 == pichle hafte wala.
DIGEST   myapp@sha256:9f2a...  — image MANIFEST ka ek IMMUTABLE content hash.
         ek diya gaya digest HAMESHA exact same bytes refer karता hai. reassign nahi ho sakता.
\`\`\`

**\`latest\` EK TRAP KYUN HAI:**
\`\`\`
- 'latest' bस ek tag hai bina special meaning ke — ye auto-updated NAHI hai
- 'docker run myapp' (no tag) = 'myapp:latest' — silently ek moving target pull karता hai
- minutes apart 'latest' pull karने wale do nodes DIFFERENT code run kar sakते hain
- 'latest' par ek rollback... ab par rollback karता hai. rollback karने ko kुछ nahi.
- CI jo 'latest' build + push aur deploy karता hai ka KOI record nahi ki kya shipped
-> HAMESHA ek immutable reference deploy karो: ek version tag jo aap kabhi reuse nahi karते, ya (best) ek digest
\`\`\`

**EK IMAGE REFERENCE:**  \`[registry/]namespace/repo[:tag][@sha256:digest]\`
No registry -> Docker Hub.

**EK REGISTRY KYA STORE KARTA HAI (OCI model):**
\`\`\`
- BLOBS: layer tarballs + config JSON, har ek apne sha256 se stored + addressed
- ek MANIFEST: JSON jo config digest + ordered layer digests + sizes list karता hai;
  image ka DIGEST is manifest ka sha256 hai
- ek MANIFEST LIST / INDEX: multi-arch ke liye — linux/amd64, linux/arm64 -> per-arch manifests
- TAGS: mutable name -> manifest-digest mappings
\`\`\`

**PUSH / PULL DEDUPLICATED hain:**
\`\`\`
push  -> har layer ke liye, registry se poochо "ye sha256 hai?" — sirf jo iske paas nahi wo upload karो
pull  -> sirf wo layers download karो jo local store mein nahi; har ek ko iske digest ke against verify karो
\`\`\`

**REGISTRIES:**  Docker Hub · GHCR · ECR · Artifact Registry · ACR · Harbor (self-host).
Auth: \`docker login\`; CI ek token / OIDC / IAM role use karता hai.

**IMMUTABLE TAGS:** kुछ registries ek repo ke tags ko immutable mark kar sakती hain — ek
existing tag ka ek re-push REJECTED hoता hai. Ise on karो.`,

    content: `## Tags versus digests

A **tag** is a human-readable label that a registry maps to an image manifest — \`myapp:1.4.0\`, \`nginx:1.27-alpine\`, \`postgres:16\`. The mapping is **mutable**: pushing to the same tag again repoints it at a new manifest, and the old one is left dangling. There is no guarantee that \`myapp:1.4.0\` refers to the same image today as it did yesterday.

A **digest** is the **SHA-256 hash of the image's manifest** — \`sha256:9f2a3c...\`. Because the manifest lists the config and every layer by their own hashes, the digest transitively covers the entire image content. A digest is **immutable**: \`myapp@sha256:9f2a3c...\` refers to exactly one set of bytes, forever, and cannot be reassigned. If those bytes change, the digest changes.

You can reference an image by tag, by digest, or by both: \`ghcr.io/acme/api:1.4.0@sha256:9f2a3c...\` — the tag is for humans reading the deploy config, the digest is what actually gets pulled.

## Why "latest" is a trap

\`latest\` is **not special**. It is an ordinary tag. The registry does not auto-update it; it points at whatever image was most recently pushed either with no tag or with the explicit tag \`latest\`. The problems:

- **\`docker run myapp\` with no tag means \`myapp:latest\`.** You are pulling a moving target without saying so.
- **Two machines that pull \`latest\` at different times can run different code.** An autoscale event or a node replacement an hour after a deploy silently picks up a newer image than the rest of the fleet.
- **There is nothing to roll back to.** "Roll back to \`latest\`" is meaningless — \`latest\` is now. A rollback needs a previous immutable reference, and if you only ever used \`latest\`, there isn't one you can name with confidence.
- **No provenance.** If CI builds \`latest\`, pushes \`latest\`, and deploys \`latest\`, then "what is running in production" has no answer beyond "whatever the last pipeline produced", and correlating an incident to a commit is guesswork.

The rule: **deploy an immutable reference.** At minimum, a version tag that your pipeline never reuses (\`1.4.0\`, or \`1.4.0-<git-sha>\`, or a monotonic build number). Better, **the digest** — resolve the tag to a digest at build time and deploy \`repo@sha256:...\`, so the deployed artifact is pinned to the exact bytes regardless of what happens to any tag afterward.

## An image reference

\`\`\`
[registry-host[:port]/]namespace/repository[:tag][@sha256:digest]
\`\`\`

- No registry host → **Docker Hub** (\`docker.io\`). Official images live under \`library\` (\`docker.io/library/nginx\`), which is why \`nginx\` alone works.
- \`ghcr.io/acme/api:1.4.0\` — GitHub Container Registry, org \`acme\`, repo \`api\`, tag \`1.4.0\`.
- \`123456789012.dkr.ecr.eu-west-1.amazonaws.com/api@sha256:...\` — Amazon ECR, pinned by digest.

## What a registry stores — the OCI model

The **OCI (Open Container Initiative)** image spec, which Docker and every other tool now follow, defines an image as:

- **Blobs** — content-addressed objects, each named by its own SHA-256. There is one blob per **layer** (a compressed tarball of that layer's filesystem changes) and one blob for the **image config** (the JSON with env, entrypoint, the ordered \`diff_ids\`, etc.).
- **A manifest** — a small JSON document listing the config blob's digest and size, and the ordered list of layer blob digests and sizes, plus the media types. **The image's digest is the SHA-256 of this manifest document.**
- **A manifest list / image index** — for **multi-architecture** images: a JSON document mapping platforms (\`linux/amd64\`, \`linux/arm64\`, \`windows/amd64\`) to per-architecture manifest digests. When you pull \`node:20\` on an ARM Mac and on an x86 server, the client reads the index and fetches the manifest for its own platform. \`docker buildx build --platform=linux/amd64,linux/arm64\` produces one.
- **Tags** — the mutable name-to-manifest-digest mappings, stored separately.

## Push and pull are deduplicated

Because everything is content-addressed:

- **Push:** for each layer and the config, the client asks the registry "do you already have the blob with this digest?" and uploads only the ones the registry is missing. Pushing a rebuild where only your top layer changed uploads one small blob and a new manifest.
- **Pull:** the client downloads only the blobs it does not already have in its local store, and **verifies each downloaded blob against its digest** — a corrupted or tampered layer fails the check. Pulling a new tag of an image whose base layers you already have transfers only the changed layers.

This is why images that share a base are cheap to move around, and why a registry's storage is far smaller than the sum of its images' sizes.

## Registries and authentication

- **Docker Hub** — the default; rate-limits anonymous and free-tier pulls, which bites CI.
- **GHCR** — GitHub Container Registry, tied to GitHub repos and Actions.
- **Amazon ECR / Google Artifact Registry / Azure ACR** — cloud-native, integrate with the cloud's IAM.
- **Harbor, Zot, the CNCF \`distribution\` project** — self-hosted, for on-prem or air-gapped or policy reasons (image signing, scanning, replication).

Authentication is \`docker login <registry>\`, which stores a credential. In CI you use a short-lived token, an OIDC exchange, or a cloud IAM role rather than a static password. **Pulling a private image requires credentials on every node that runs it** — in Kubernetes an \`imagePullSecret\`, in ECR a credential helper, in Compose a prior \`docker login\`.

## Immutable tags

Several registries (ECR, GHCR, Harbor, GAR) can configure a repository so that **once a tag is pushed it cannot be overwritten** — a second push to an existing tag is rejected. Enabling this makes \`v1.4.0\` permanently mean one image, which restores most of the guarantee a digest gives while keeping tags readable. Turn it on for anything you deploy from.`,

    contentHi: `## Tags versus digests

Ek **tag** ek human-readable label hai jise ek registry ek image manifest par map karता hai. Mapping **mutable** hai: same tag par phir se push karна ise ek naye manifest par repoint karता hai. Koi guarantee nahi ki \`myapp:1.4.0\` aaj wahi image refer karता hai jo kal karta tha.

Ek **digest** image ke manifest ka **SHA-256 hash** hai. Kyunki manifest config aur har layer ko unke apne hashes se list karता hai, digest transitively poore image content ko cover karता hai. Ek digest **immutable** hai: \`myapp@sha256:...\` exactly ek set of bytes refer karता hai, hamesha ke liye.

## \`latest\` ek trap kyun hai

\`latest\` **special nahi hai**. Ye ek ordinary tag hai. Registry ise auto-update nahi karता; ye jo bhi image sabse recently push hui use point karता hai. Problems: **\`docker run myapp\` bina tag ke matlab \`myapp:latest\`**; **do machines jo alag times par \`latest\` pull karती hain alag code run kar sakती hain**; **rollback karने ko kुछ nahi**; **koi provenance nahi**.

Rule: **ek immutable reference deploy karो.** At minimum, ek version tag jo aapki pipeline kabhi reuse nahi karती. Better, **digest** — build time par tag ko ek digest par resolve karो aur \`repo@sha256:...\` deploy karो.

## Ek image reference

\`\`\`
[registry-host[:port]/]namespace/repository[:tag][@sha256:digest]
\`\`\`
Koi registry host nahi → **Docker Hub**. Official images \`library\` ke under.

## Ek registry kya store karता hai — OCI model

**OCI** image spec ek image ko define karता hai: **Blobs** (content-addressed objects, har ek apne SHA-256 se named — ek blob per layer + ek config blob); **ek manifest** (ek small JSON jo config blob ka digest aur ordered layer blob digests list karता hai — **image ka digest is manifest ka SHA-256 hai**); **ek manifest list / image index** (multi-architecture ke liye — platforms ko per-architecture manifest digests par map karता hai); **tags** (mutable name-to-manifest-digest mappings).

## Push aur pull deduplicated hain

**Push:** har layer ke liye client registry se poochता hai "kya aapke paas is digest wala blob already hai?" aur sirf missing wale upload karता hai. **Pull:** client sirf wo blobs download karता hai jo iske paas nahi hain, aur **har downloaded blob ko iske digest ke against verify karता hai**.

## Registries aur authentication

**Docker Hub** (default; anonymous pulls rate-limit karता hai), **GHCR**, **ECR / Artifact Registry / ACR** (cloud IAM ke saath integrate), **Harbor** (self-hosted). Authentication \`docker login\` hai. **Ek private image pull karने ke liye har node par credentials chahिए jo ise run karता hai.**

## Immutable tags

Kई registries ek repository configure kar sakती hain taki **ek baar ek tag push hone ke baad ise overwrite nahi kiya ja sakта**. Ise enable karना \`v1.4.0\` ko permanently ek image mean karवाता hai. Jo bhi aap deploy karते ho uske liye ise on karो.`,

    examples: [
      {
        title: 'The same tag, two different images — pin the digest',
        titleHi: 'Same tag, do alag images — digest pin karo',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
mkv() { printf 'FROM alpine:3.20\\nCMD ["echo","I am version %s"]\\n' "$1" > Dockerfile; docker build -q -t app:release . >/dev/null; }

mkv 1
docker tag app:release app:1.0.0            # pin THIS exact build with an immutable version tag
d1=$(docker image inspect app:release --format '{{.Id}}')
echo "app:release  -> $(docker run --rm app:release)"

mkv 2                                        # someone rebuilds and reuses the 'release' tag
d2=$(docker image inspect app:release --format '{{.Id}}')
echo "app:release  -> $(docker run --rm app:release)   (SAME tag, different image now)"
[ "$d1" != "$d2" ] && echo "the floating tag 'app:release' moved to a new image id"

echo "--- the pinned tag still resolves to the ORIGINAL bytes ---"
echo "app:1.0.0    -> $(docker run --rm app:1.0.0)"
docker rmi -f app:release app:1.0.0 >/dev/null 2>&1 || true`,
        output: `app:release  -> I am version 1
app:release  -> I am version 2   (SAME tag, different image now)
the floating tag 'app:release' moved to a new image id
--- the pinned tag still resolves to the ORIGINAL bytes ---
app:1.0.0    -> I am version 1`,
        explain: 'An image is built and given a tag, and running that tag produces the first version\'s output. The image is then rebuilt with different content and given the exact same tag. Running the tag now produces the second version\'s output, because the tag is only a name that points at a manifest and re-tagging repointed it. Nothing about the floating tag records that it changed or what it used to point at, and on a modern engine the now-untagged first image can even be garbage-collected. But the first build was also given an immutable version tag before the rebuild, and that tag still resolves to the original bytes. This is the core reason production deployments should not be specified by a plain reused tag: between the moment a deployment manifest is written and the moment a node pulls the image, or between one node pulling and another node pulling later, the tag can be moved, and the deployment then runs something other than what was reviewed and tested. Deploying by digest, or by a version tag that the pipeline is configured never to overwrite, removes this gap: the reference names an exact image and cannot be silently redirected.',
        explainHi: 'Ek image built hai aur ek tag di jाती hai, aur us tag ko run karna pehle version ka output produce karता hai. Image phir alag content ke saath rebuild hoती hai aur exact same tag di jाती hai. Tag ko ab run karна doosरे version ka output produce karта hai, kyunki tag sirf ek naam hai jo ek manifest par point karता hai aur re-tagging ne ise repoint kiya. Tag ke baare mein kुछ record nahi karता ki ye badla ya ye kis par point karता tha. Do builds ke alag image identifiers hain, aur kisi bhi identifier ko directly reference karna hamesha wo specific image run karता hai chahे koi tag ab kahin bhi point kare. Ye core reason hai ki production deployments ko ek plain tag se specify nahi honा chahिए: deployment manifest likhे jaने ke moment aur ek node ke image pull karने ke moment ke beech, tag move ho sakта hai.',
      },
      {
        title: 'Push/pull deduplication: only changed layers move',
        titleHi: 'Push/pull deduplication: sirf changed layers move hote hain',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
build() {
  { echo 'FROM alpine:3.20'
    echo 'RUN apk add --no-cache curl'
    echo 'COPY app.txt /app.txt'; } > Dockerfile
  echo "$1" > app.txt
  docker build -q -t "dedup:$1" . >/dev/null
}
layers() { docker image inspect "dedup:$1" --format '{{range .RootFS.Layers}}{{println .}}{{end}}'; }

build v1
build v2                                    # identical Dockerfile; only app.txt content differs
echo "v1 has $(layers v1 | grep -c .) layers; v2 has $(layers v2 | grep -c .) layers"
shared=$(comm -12 <(layers v1 | sort) <(layers v2 | sort) | grep -c .)
echo "$shared of them are byte-identical (content-addressed) - only the COPY app.txt layer differs"
echo "-> pushing v2 uploads ONLY that one changed layer; the base + 'apk add curl' layers already exist in the registry"
docker rmi -f dedup:v1 dedup:v2 >/dev/null 2>&1 || true`,
        output: `v1 has 3 layers; v2 has 3 layers
2 of them are byte-identical (content-addressed) - only the COPY app.txt layer differs
-> pushing v2 uploads ONLY that one changed layer; the base + 'apk add curl' layers already exist in the registry`,
        explain: 'The image has three layers: the base, a layer that installs a package, and a layer that copies one small file. The layer digests are listed for the first build. Only the small file is then changed and the image rebuilt. The digests of the first two layers are identical to before, because their inputs did not change and they are content-addressed, while the third layer has a new digest because its copied content differs. When this second image is pushed to a registry, the client checks each layer\'s digest against what the registry already holds, finds the first two already present from the first push, and uploads only the third layer plus a new manifest that references the two existing digests and the one new one. A pull works symmetrically: a client that already has the base and package layers from any other image downloads only the changed layer. This content-addressed deduplication is why a registry storing many versions of an image, and many images sharing a base, uses far less space than the sum of the image sizes, and why redeploying after a code change transfers kilobytes rather than the whole image.',
        explainHi: 'Image ke teen layers hain: base, ek layer jo ek package install karता hai, aur ek layer jo ek small file copy karता hai. Layer digests pehle build ke liye listed hain. Phir sirf small file change hoती hai aur image rebuild hoती hai. Pehle do layers ke digests pehle jaisे identical hain, kyunki unke inputs change nahi hue aur wo content-addressed hain, jabki teesरी layer ka ek naya digest hai kyunki iska copied content differ karता hai. Jab ye doosरी image ek registry par push hoती hai, client har layer ke digest ko check karता hai jo registry already rakhता hai, pehle do ko already present paता hai, aur sirf teesरी layer plus ek naya manifest upload karता hai. Ek pull symmetrically kaam karता hai. Ye content-addressed deduplication hai kyunki ek registry jo ek image ke kई versions store karता hai us image sizes ke sum se kahीं kम space istemal karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# deploying ':latest' (or a reused tag) to production
# CI:   docker build -t myco/api:latest .  &&  docker push myco/api:latest
# k8s:  image: myco/api:latest    (+ imagePullPolicy: Always)
# -> pod A started at 10:00 pulled build #340. pod B autoscaled at 11:30 pulled
//    build #341 (someone merged). the fleet is now split across two versions.
//    an incident at 12:00: "what's running?" -> nobody can say. rollback: to what?`,
        right: `# CI builds an IMMUTABLE tag AND resolves it to a digest; deploy the digest:
#   TAG=1.4.0-$(git rev-parse --short HEAD)
#   docker build -t myco/api:$TAG .
#   docker push myco/api:$TAG
#   DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' myco/api:$TAG)
#   # -> deploy  image: myco/api@sha256:...   (the whole fleet runs identical bytes)
# turn on registry 'immutable tags' so a tag can never be re-pushed.
# keep old tags/digests -> rollback = redeploy the previous digest.`,
        why: 'A tag is a mutable pointer, so deploying by a tag that is reused — \`latest\` or any version tag the pipeline overwrites — means the image a node actually runs depends on when that node resolved the tag. Nodes that start at different times, whether from a rolling deploy, an autoscale event, or a node replacement, can resolve the same tag to different images, leaving the fleet running a mix of versions with nothing recording which node has which. During an incident there is then no reliable answer to what code is in production, and a rollback has no defined target because the tag that was deployed now points somewhere else. Building an immutable reference fixes this: a version tag that includes the commit and is never reused, and ideally resolving that tag to the image digest at build time and deploying the digest, so every node pulls exactly the same bytes and the deployed reference is a permanent record. Registry immutable-tag settings enforce that a tag cannot be re-pushed, and keeping old digests available makes rollback a redeploy of a known previous reference.',
        whyHi: 'Ek tag ek mutable pointer hai, to ek reused tag se deploy karना — \`latest\` ya koi version tag jo pipeline overwrite karती hai — matlab ek node actually jo image run karता hai wo is par depend karता hai ki us node ne tag kab resolve kiya. Nodes jo alag times par start hote hain same tag ko alag images par resolve kar sakते hain, fleet ko versions ke ek mix par running chhoड़te hue. Ek incident ke dauran phir koi reliable answer nahi hai ki production mein kya code hai, aur ek rollback ka koi defined target nahi hai. Ek immutable reference build karना ise fix karता hai: ek version tag jo commit include karता hai aur kabhi reuse nahi hota, aur ideally build time par us tag ko image digest par resolve karна aur digest deploy karना. Registry immutable-tag settings enforce karти hain ki ek tag re-push nahi ho sakта.',
      },
      {
        wrong: `# 'FROM node:20' in a Dockerfile and expecting reproducible builds
FROM node:20
# -> 'node:20' is re-pushed by the maintainers regularly (minor version bumps,
//    base-OS patches). the same Dockerfile built today and next month produces
//    different base layers, different installed system packages, sometimes a
//    different Node patch version. a "reproducible" build isn't.`,
        right: `# pin the base by digest; let a bot propose bumps as reviewable PRs:
FROM node:20.11.1-slim@sha256:2a4e0b3f...    # exact bytes, forever
# Renovate / Dependabot open a PR when node:20.11.x moves -> you review the
# base-image diff (changelog, CVE fixes) and merge deliberately.
# CI can also record the resolved base digest in the build metadata / SBOM.`,
        why: 'A tag on a base image is maintained by its publishers and is re-pushed whenever they release a new build under that tag — a patch release of the language, a rebuild against a patched base operating system, an update to bundled tools. So a Dockerfile that names the base by a tag does not pin the base: the same Dockerfile produces different images over time as the tag moves, which undermines reproducibility and means a base change arrives silently without review. Pinning the base by its digest fixes the reference to an exact image that cannot change, so the build is reproducible and any base update is an explicit change to the Dockerfile. Because base updates do contain important fixes, the pin should be paired with an automated dependency tool that opens a pull request when the tag moves, so the maintainer reviews what changed — the changelog, the security fixes — and adopts the new base deliberately rather than by accident.',
        whyHi: 'Ek base image par ek tag iske publishers dwara maintained hai aur jab bhi wo us tag ke under ek naya build release karते hain re-pushed hoता hai. To ek Dockerfile jo base ko ek tag se name karता hai base ko pin nahi karता: same Dockerfile samay ke saath alag images produce karता hai. Base ko iske digest se pin karना reference ko ek exact image par fix karता hai jo change nahi ho sakती, to build reproducible hai aur koi bhi base update Dockerfile ka ek explicit change hai. Kyunki base updates mein important fixes hote hain, pin ko ek automated dependency tool ke saath pair karना chahिए jo ek pull request kholता hai jab tag move hoता hai.',
      },
      {
        wrong: `# forgetting that a private image needs pull credentials on EVERY node
# works on the dev's machine (they ran 'docker login ghcr.io' months ago)
# deploy to the cluster -> pods stuck 'ImagePullBackOff':
#   Failed to pull image "ghcr.io/acme/api@sha256:...": ... 401 Unauthorized
# "but it pulls fine locally!" — yes, because YOUR machine has the credential.`,
        right: `# give every node/namespace that runs the image a way to authenticate:
#   k8s:  create an imagePullSecret, reference it in the Pod spec (or the
//         ServiceAccount); or use a cloud credential (ECR/GAR/ACR node identity)
#   ECR:  the ecr-credential-helper on nodes, or IRSA / node IAM role
#   Compose on a host: 'docker login' on THAT host (stored in ~/.docker/config.json)
# and: CI needs its own registry credential (a scoped token / OIDC), not a person's.`,
        why: 'Pulling an image from a private repository requires the puller to present credentials the registry accepts, and those credentials are held per machine and per user. An image reference that works from a developer\'s workstation works because that workstation has a stored login for the registry; the cluster nodes that will actually run the image have no such login unless one is configured for them. Without it, every attempt to pull the image is rejected as unauthorised and the workload never starts. The fix is to provision registry credentials wherever the image is pulled: in Kubernetes an image-pull secret attached to the pod or its service account, or the node\'s own cloud identity if the registry is the cloud provider\'s; on a plain host running Compose, a login performed on that host; and in the CI system, its own scoped credential rather than a person\'s. The credential should be the minimum scope needed and, in automation, short-lived or identity-based rather than a static secret.',
        whyHi: 'Ek private repository se ek image pull karने ke liye puller ko wo credentials present karने padते hain jo registry accept karता hai, aur wo credentials per machine aur per user held hain. Ek image reference jo ek developer ke workstation se kaam karता hai kaam karता hai kyunki us workstation ke paas registry ke liye ek stored login hai; cluster nodes jo actually image run karेंge unke paas aisा koi login nahi hai jab tak unke liye ek configure nahi kiya jाता. Iske bina, image pull karने ka har attempt unauthorised ke roop mein rejected hoता hai. Fix jahaan bhi image pull hoती hai wahaan registry credentials provision karना hai: Kubernetes mein ek image-pull secret, ya node ki apni cloud identity; ek plain host par ek login; aur CI system mein iska apna scoped credential.',
      },
    ],

    realWorld: [
      {
        en: '**A fleet split across two versions of `:latest` during an incident** — the on-call could not determine what was running or where to roll back. The team moved to `image: repo@sha256:...` resolved in CI, and enabled ECR immutable tags. "What\'s running" became `kubectl get pods -o ...` reading a digest.',
        hi: '**Ek incident ke dauran `:latest` ke do versions ke across ek fleet split** — on-call ye determine nahi kar saka ki kya run ho raha tha. Team `image: repo@sha256:...` par move hui.',
      },
      {
        en: '**A "reproducible" build that wasn\'t** — `FROM python:3.11` silently moved from 3.11.4 to 3.11.9 across a month, and a behaviour change in a stdlib module broke a date parser in prod. Pinning `FROM python:3.11.9-slim@sha256:...` + Renovate PRs for bumps ended the surprises.',
        hi: '**Ek "reproducible" build jo nahi tha** — `FROM python:3.11` silently 3.11.4 se 3.11.9 par move hua, aur ek stdlib module mein ek behaviour change ne prod mein ek date parser toड़ा.',
      },
      {
        en: '**A cluster-wide `ImagePullBackOff`** after moving a repo from public to private — nobody had added an `imagePullSecret`. The fix was a secret on the namespace\'s default ServiceAccount; the lesson was a checklist item for repo-visibility changes.',
        hi: '**Ek cluster-wide `ImagePullBackOff`** ek repo ko public se private move karने ke baad — kisi ne ek `imagePullSecret` add nahi kiya tha.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a tag and a digest, and why should production deploy by digest?',
        qHi: 'Ek tag aur ek digest ke beech kya difference hai, aur production ko digest se kyun deploy karना chahिए?',
        a: 'A tag is a human-readable name that a registry maps to an image, and the mapping is mutable: pushing to the same tag again repoints it at a different image, and there is no record on the tag of what it used to point at. A digest is the SHA-256 hash of the image\'s manifest, and because the manifest lists the config and every layer by their own hashes, the digest covers the entire image content and is immutable — a given digest always refers to exactly the same bytes and cannot be reassigned. Production should deploy by digest because a tag-based deployment runs whatever the tag points at when each node resolves it, and nodes resolve at different times during a rolling deploy, an autoscale event, or a node replacement, so the fleet can end up running a mix of versions with no record of which node has which. During an incident that means there is no reliable answer to what is in production, and a rollback has no defined target because the deployed tag now points elsewhere. Resolving the tag to a digest at build time and deploying the digest pins every node to identical bytes and makes the deployed reference a permanent, precise record. A readable version tag can still be carried alongside the digest for humans.',
        aHi: 'Ek tag ek human-readable naam hai jise ek registry ek image par map karता hai, aur mapping mutable hai: same tag par phir se push karna ise ek alag image par repoint karта hai. Ek digest image ke manifest ka SHA-256 hash hai, aur kyunki manifest config aur har layer ko unke apne hashes se list karता hai, digest poore image content ko cover karता hai aur immutable hai. Production ko digest se deploy karna chahिए kyunki ek tag-based deployment jo bhi tag point karता hai wo run karता hai jab har node ise resolve karता hai, aur nodes alag times par resolve karते hain, to fleet versions ke ek mix par running end ho sakта hai. Ek incident ke dauran iska matlab koi reliable answer nahi hai. Build time par tag ko ek digest par resolve karना har node ko identical bytes par pin karता hai.',
      },
      {
        q: 'What does a registry actually store, and how do push and pull avoid re-transferring data?',
        qHi: 'Ek registry actually kya store karता hai, aur push aur pull data re-transfer karने se kaise bachते hain?',
        a: 'Under the OCI image spec, a registry stores an image as a set of blobs plus a manifest. Each blob is content-addressed, named by its own SHA-256: there is one blob per layer, a compressed archive of that layer\'s filesystem changes, and one blob for the image config, the JSON with the environment, entrypoint, and the ordered layer list. The manifest is a small JSON document that lists the config blob\'s digest and the ordered layer blob digests with their sizes and media types, and the image\'s digest is the hash of this manifest. For multi-architecture images there is also a manifest list, or image index, mapping platforms to per-architecture manifest digests. Tags are stored separately as mutable mappings from a name to a manifest digest. Because everything is content-addressed, transfers are deduplicated. On push, the client asks the registry for each blob whether it already holds that digest and uploads only the ones it is missing, so pushing a rebuild where only the top layer changed uploads one small blob and a new manifest. On pull, the client downloads only the blobs not already in its local store and verifies each downloaded blob against its digest, so a corrupted or tampered layer is detected. Images that share a base therefore move cheaply, and a registry\'s storage is much smaller than the sum of its images\' nominal sizes.',
        aHi: 'OCI image spec ke under, ek registry ek image ko blobs plus ek manifest ke set ke roop mein store karता hai. Har blob content-addressed hai, apne SHA-256 se named: ek blob per layer, us layer ke filesystem changes ka ek compressed archive, aur ek blob image config ke liye. Manifest ek small JSON document hai jo config blob ka digest aur ordered layer blob digests list karता hai, aur image ka digest is manifest ka hash hai. Multi-architecture images ke liye ek manifest list bhi hai. Tags separately stored hain mutable mappings ke roop mein. Kyunki sab кुछ content-addressed hai, transfers deduplicated hain. Push par, client registry se har blob ke liye poochता hai ki ye us digest ko already rakhता hai ya nahi. Pull par, client sirf wo blobs download karता hai jo local store mein nahi hain aur har downloaded blob ko iske digest ke against verify karता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain 4 concrete problems with deploying `:latest` (or any reused tag) to production, and write the CI steps that produce and deploy an immutable reference instead.',
        taskHi: 'Ek comment mein, `:latest` deploy karने ki 4 concrete problems samjhाओ.',
        hint: 'Problems: (1) `docker run myapp` with no tag = `:latest` — a moving target pulled silently. (2) nodes that pull at different times (rolling deploy / autoscale / node replacement) run DIFFERENT code → the fleet splits across versions. (3) nothing to roll back to — "roll back to `:latest`" = "roll back to now". (4) no provenance — CI that builds+pushes+deploys `:latest` has no record of what shipped; can\'t correlate an incident to a commit. CI steps: `TAG=1.4.0-$(git rev-parse --short HEAD)`; `docker build -t repo:$TAG .`; `docker push repo:$TAG`; `DIGEST=$(docker inspect --format="{{index .RepoDigests 0}}" repo:$TAG)`; deploy `image: repo@sha256:...`. Enable registry immutable tags; keep old digests so rollback = redeploy a previous digest.',
        hintHi: 'Problems: (1) `docker run myapp` bina tag = `:latest` — moving target. (2) alag times par pull karने wale nodes DIFFERENT code run karте hain → fleet split. (3) rollback karने ko kुछ nahi. (4) koi provenance nahi. CI steps: `TAG=1.4.0-$(git rev-parse --short HEAD)`; `docker build/push repo:$TAG`; `DIGEST=$(docker inspect --format="{{index .RepoDigests 0}}" repo:$TAG)`; deploy `image: repo@sha256:...`. Registry immutable tags enable karो.',
      },
      {
        task: 'In a comment, describe the OCI image model (blobs, manifest, manifest list, tags) and explain what "the image digest" is a hash of.',
        taskHi: 'Ek comment mein, OCI image model describe karो.',
        hint: 'BLOBS: content-addressed objects each named by its own sha256 — one per LAYER (a compressed tarball of that layer\'s fs changes) + one for the CONFIG (JSON: env, entrypoint, workdir, ordered diff_ids). MANIFEST: a small JSON listing the config blob digest+size and the ORDERED layer blob digests+sizes+media types. THE IMAGE DIGEST = sha256 of this manifest document (which, because it references config + layers by their hashes, transitively covers the entire image content). MANIFEST LIST / IMAGE INDEX: for multi-arch — maps `linux/amd64`, `linux/arm64`, etc. → per-arch manifest digests; the client reads it and fetches the manifest for its platform (`docker buildx --platform=...` produces one). TAGS: stored separately as MUTABLE name → manifest-digest mappings.',
        hintHi: 'BLOBS: content-addressed objects har ek apne sha256 se named — ek per LAYER + ek CONFIG ke liye. MANIFEST: ek small JSON jo config blob digest+size aur ORDERED layer blob digests list karता hai. IMAGE DIGEST = is manifest document ka sha256 (jo config + layers ko unke hashes se reference karता hai, to poore image content ko transitively cover karता hai). MANIFEST LIST: multi-arch ke liye — platforms → per-arch manifest digests. TAGS: separately stored MUTABLE name → manifest-digest mappings.',
      },
      {
        task: 'In a comment, explain why `FROM node:20` breaks reproducible builds, why pinning by digest fixes it, and why you still need a bot like Renovate.',
        taskHi: 'Ek comment mein, samjhाओ kyun `FROM node:20` reproducible builds ko todता hai.',
        hint: '`node:20` is a TAG maintained by the publishers — it\'s re-pushed regularly (Node patch bumps, base-OS security patches, tool updates). So the same Dockerfile built today vs next month gets DIFFERENT base layers, different system packages, sometimes a different Node patch version → the build is not reproducible, and a base change arrives silently with no review. Pinning `FROM node:20.11.1-slim@sha256:2a4e...` fixes the reference to exact bytes that can never change → reproducible, and any base update is now an explicit reviewable diff to the Dockerfile. But base updates carry real security fixes, so you still want Renovate/Dependabot to open a PR when the tag moves → you review the changelog + CVE fixes and adopt the new base DELIBERATELY, not by accident and not never.',
        hintHi: '`node:20` ek TAG hai jo publishers dwara maintained — ye regularly re-pushed hoता hai. To same Dockerfile aaj vs agle mahine DIFFERENT base layers paता hai → build reproducible nahi, aur ek base change silently aata hai. `FROM node:20.11.1-slim@sha256:...` reference ko exact bytes par fix karता hai → reproducible. Par base updates mein real security fixes hote hain, to aapको abhi bhi Renovate chahिए jo ek PR kholता hai jab tag move hoता hai → aap changelog review karके naya base DELIBERATELY adopt karते ho.',
      },
    ],

    keyTakeaways: [
      'A TAG (`myapp:1.4.0`) is a MUTABLE, human-readable pointer — re-pushing the same tag repoints it at a different image with NO record of the change; the `myapp:1.4.0` you pull today may not be the one you pulled last week. A DIGEST (`myapp@sha256:9f2a...`) is the IMMUTABLE SHA-256 of the image MANIFEST (which references the config + every layer by hash, so it transitively covers all image content) — a given digest ALWAYS refers to the exact same bytes and cannot be reassigned. Reference both: `repo:1.4.0@sha256:...` (tag for humans, digest for the machine).',
      '`latest` IS A TRAP: it\'s an ordinary tag with NO special meaning (not auto-updated — it points at whatever was last pushed untagged or as `latest`). `docker run myapp` (no tag) = `myapp:latest`. Concrete failures: nodes pulling at different times (rolling deploy / autoscale / node replacement) run DIFFERENT code → the fleet splits; nothing to roll back to ("roll back to latest" = "to now"); CI that builds+pushes+deploys `latest` has NO provenance record of what shipped. RULE: deploy an IMMUTABLE reference — at minimum a version tag the pipeline NEVER reuses (`1.4.0-<git-sha>`), best a DIGEST resolved at build time (`repo@sha256:...`). Enable the registry\'s "immutable tags" setting so a re-push of an existing tag is REJECTED.',
      'IMAGE REFERENCE: `[registry-host[:port]/]namespace/repository[:tag][@sha256:digest]`. No registry host → Docker Hub (`docker.io`); official images live under `library/` (so `nginx` = `docker.io/library/nginx`).',
      'THE OCI MODEL — a registry stores an image as: BLOBS (content-addressed by sha256 — one per LAYER + one CONFIG blob), a MANIFEST (small JSON: config digest + ordered layer digests + sizes; THE IMAGE DIGEST = sha256 of this manifest), a MANIFEST LIST / IMAGE INDEX (multi-arch — maps `linux/amd64`/`linux/arm64`/… → per-arch manifests; `docker buildx --platform=...` produces one), and TAGS (mutable name → manifest-digest mappings, stored separately). PUSH/PULL are DEDUPLICATED: push asks the registry "have this sha256?" per blob and uploads only what it lacks (a rebuild of just the top layer = one small blob + a new manifest); pull downloads only blobs not already local AND verifies each against its digest (a tampered/corrupted layer fails). So a registry\'s storage ≪ the sum of its image sizes.',
      'REGISTRIES: Docker Hub (default; rate-limits anonymous pulls — bites CI), GHCR, ECR / Google Artifact Registry / Azure ACR (integrate with cloud IAM), Harbor/Zot/`distribution` (self-hosted). Auth = `docker login <registry>`; CI uses a short-lived token / OIDC / cloud IAM role, NOT a static password or a person\'s credential. A PRIVATE image needs pull credentials on EVERY node that runs it — a k8s `imagePullSecret` (on the pod or its ServiceAccount), an ECR credential helper / node IAM role, or a prior `docker login` on that host — "works locally" just means YOUR machine has the credential. PIN BASE IMAGES BY DIGEST too (`FROM node:20.11.1-slim@sha256:...`): a base tag is re-pushed by its maintainers regularly, so a tag-based `FROM` makes builds non-reproducible — pair the digest pin with Renovate/Dependabot to get reviewable base-bump PRs.',
    ],
    keyTakeawaysHi: [
      'Ek TAG (`myapp:1.4.0`) ek MUTABLE, human-readable pointer hai — same tag re-push karna ise ek alag image par repoint karता hai BINA change ke record ke. Ek DIGEST (`myapp@sha256:9f2a...`) image MANIFEST ka IMMUTABLE SHA-256 hai — ek diya gaya digest HAMESHA exact same bytes refer karता hai. Dono reference karो: `repo:1.4.0@sha256:...`.',
      '`latest` EK TRAP HAI: ye ek ordinary tag hai BINA special meaning ke (auto-updated NAHI). `docker run myapp` (no tag) = `myapp:latest`. Failures: alag times par pull karने wale nodes DIFFERENT code run karте hain → fleet split; rollback karने ko kुछ nahi; koi provenance nahi. RULE: ek IMMUTABLE reference deploy karो — at minimum ek version tag jo pipeline KABHI reuse nahi karती, best ek DIGEST. Registry "immutable tags" setting enable karो.',
      'IMAGE REFERENCE: `[registry-host[:port]/]namespace/repository[:tag][@sha256:digest]`. No registry host → Docker Hub; official images `library/` ke under.',
      'OCI MODEL — ek registry ek image store karता hai: BLOBS (sha256 se content-addressed — ek per LAYER + ek CONFIG blob), ek MANIFEST (small JSON: config digest + ordered layer digests; IMAGE DIGEST = is manifest ka sha256), ek MANIFEST LIST (multi-arch), aur TAGS (mutable name → manifest-digest mappings). PUSH/PULL DEDUPLICATED hain: push registry se "ye sha256 hai?" per blob poochता hai; pull sirf missing blobs download karता hai AUR har ek ko iske digest ke against verify karता hai.',
      'REGISTRIES: Docker Hub (default; anonymous pulls rate-limit — CI ko bites), GHCR, ECR / GAR / ACR (cloud IAM), Harbor (self-hosted). Auth = `docker login`; CI ek short-lived token / OIDC / IAM role use karता hai. Ek PRIVATE image ko HAR node par pull credentials chahिए jo ise run karta hai — ek k8s `imagePullSecret`, ek ECR credential helper, ya ek prior `docker login`. BASE IMAGES ko bhi DIGEST se PIN karो — ek base tag regularly re-pushed hoता hai, to ek tag-based `FROM` builds ko non-reproducible banаता hai; digest pin ko Renovate ke saath pair karो.',
    ],
  },

  {
    slug: 'ops-the-runtime-and-buildkit',
    title: 'The Runtime & BuildKit',
    titleHi: 'Runtime Aur BuildKit',
    description: '`docker run` flags map directly onto the kernel features from Lesson 1: `--memory` and `--cpus` are cgroups, `--user` and `--cap-drop` are privilege, `-p` and `-v` and `-e` wire the container to the outside. BuildKit is the modern builder — parallel stages, cache mounts, and secret mounts.',
    descriptionHi: '`docker run` flags directly Lesson 1 ke kernel features par map karते hain: `--memory` aur `--cpus` cgroups hain, `--user` aur `--cap-drop` privilege hain, `-p` aur `-v` aur `-e` container ko bahar se wire karते hain. BuildKit modern builder hai — parallel stages, cache mounts, aur secret mounts.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**Moving into a serviced apartment: the lease terms are the `docker run` flags.** How much power and water you may draw (`--memory`, `--cpus` — the cgroup limits). Which of the building\'s master keys you get, if any (`--cap-drop`, `--security-opt` — capabilities). Which utility lines are connected to your unit (`-p` publishes a port, `-v` mounts storage, `-e` sets the thermostat). Whether the walls are fixed or you can knock through them (`--read-only`). Who the lease is in the name of (`--user`). You sign these terms once, at move-in — you cannot renegotiate a running container\'s lease; you end it and sign a new one. BuildKit, meanwhile, is the contractor who builds the apartment: the old contractor did one wall at a time and threw away the scaffolding each day; BuildKit builds independent walls in parallel and keeps a locked shed of reusable materials (cache mounts) and a safe for the blueprints that never gets built into the walls (secret mounts).',
      hi: '**Ek serviced apartment mein move in karna: lease terms `docker run` flags hain.** Aap kitni power aur water draw kar sakте ho (`--memory`, `--cpus` — cgroup limits). Building ke kaunसे master keys aapको milते hain, agar koi (`--cap-drop`, `--security-opt`). Kaunसी utility lines aapke unit se connected hain (`-p` ek port publish karता hai, `-v` storage mount karता hai, `-e` thermostat set karता hai). Deewारें fixed hain ya aap unke through knock kar sakते ho (`--read-only`). Lease kiske naam mein hai (`--user`). Aap ye terms ek baar sign karते ho, move-in par — aap ek running container ki lease renegotiate nahi kar sakते. BuildKit contractor hai jo apartment banаता hai: purana contractor ek baar mein ek deewार karता tha; BuildKit independent deewारें parallel mein banаता hai aur reusable materials ka ek locked shed rakhता hai (cache mounts).',
    },

    simple: `**\`docker run\` FLAGS map onto Lesson 1's kernel features:**
\`\`\`
RESOURCE (cgroups):
  --memory 512m --memory-swap 512m   hard RAM cap (breach -> OOM kill, exit 137)
  --cpus 1.5                          1.5 cores of CPU time (quota)
  --pids-limit 200                    max processes (fork-bomb guard)

NETWORK (net namespace):
  -p 8080:80                          publish container :80 as host :8080 (DNAT)
  -p 127.0.0.1:8080:80               ...bound to loopback only
  --network mynet                     attach to a user-defined network (DNS by container name)
  --network none / host               no network / share the host's stack (no isolation)

STORAGE (mnt namespace):
  -v /host/path:/data                 bind-mount a host dir (dev; exact host path)
  -v myvol:/data                      named volume (managed by docker; survives the container)
  --mount type=tmpfs,dst=/tmp         in-memory scratch
  --read-only                         rootfs is read-only (+ --tmpfs /tmp for writable scratch)

IDENTITY / PRIVILEGE:
  --user 10001:10001                 run as this UID:GID (override the image's USER)
  --cap-drop ALL --cap-add NET_BIND_SERVICE   drop all capabilities, add back only what's needed
  --security-opt no-new-privileges    a child can never gain more privs than its parent
  --security-opt seccomp=profile.json  custom syscall filter

CONFIG / LIFECYCLE:
  -e KEY=val / --env-file .env        runtime env (this is where secrets/config go, NOT the image)
  --restart unless-stopped            restart policy: no | on-failure[:N] | always | unless-stopped
  --rm                                delete the container (and its writable layer) on exit
  --name api / -d / -it               name / detached / interactive+tty
  --init                              run a tiny init as PID 1 to reap zombies + forward signals
\`\`\`

**CONTAINER LIFECYCLE:**  created -> running -> (paused) -> exited -> removed.
\`docker ps\` (running) · \`docker ps -a\` (all) · \`logs\` · \`exec\` · \`inspect\` · \`stats\` · \`stop\`(SIGTERM+10s+SIGKILL) · \`kill\` · \`rm\`.

**BUILDKIT (default builder since Docker 23; \`docker buildx\`):**
\`\`\`
- builds independent stages IN PARALLEL; skips stages not needed for the target
- CACHE MOUNTS:  RUN --mount=type=cache,target=/root/.npm  npm ci
    -> the package cache PERSISTS across builds even when the layer rebuilds
- SECRET MOUNTS: RUN --mount=type=secret,id=tok ...   (file present only during that RUN, never in a layer)
- SSH FORWARDING: RUN --mount=type=ssh  git clone git@...   (agent forwarded, no key in the image)
- BIND MOUNTS:   RUN --mount=type=bind,source=.,target=/src ...   (read build context without a COPY layer)
- multi-platform (--platform), inline/registry cache export (--cache-to/--cache-from for CI)
- needs a first line:  # syntax=docker/dockerfile:1
\`\`\``,

    simpleHi: `**\`docker run\` FLAGS Lesson 1 ke kernel features par map karते hain:**
\`\`\`
RESOURCE (cgroups):
  --memory 512m --memory-swap 512m   hard RAM cap (breach -> OOM kill, exit 137)
  --cpus 1.5                          1.5 cores
  --pids-limit 200                    max processes

NETWORK (net namespace):
  -p 8080:80                          container :80 ko host :8080 ke roop mein publish (DNAT)
  -p 127.0.0.1:8080:80               ...sirf loopback par bound
  --network mynet                     ek user-defined network se attach (container name se DNS)
  --network none / host               koi network nahi / host ka stack share (koi isolation nahi)

STORAGE (mnt namespace):
  -v /host/path:/data                 ek host dir bind-mount (dev)
  -v myvol:/data                      named volume (docker managed; container ke baad survive karta hai)
  --read-only                         rootfs read-only (+ --tmpfs /tmp writable scratch ke liye)

IDENTITY / PRIVILEGE:
  --user 10001:10001                 is UID:GID ke roop mein run karो
  --cap-drop ALL --cap-add NET_BIND_SERVICE   saari capabilities drop, sirf zaroori wapas add
  --security-opt no-new-privileges    ek child kabhi apne parent se zyada privs nahi pa sakта

CONFIG / LIFECYCLE:
  -e KEY=val / --env-file .env        runtime env (secrets/config YAHAN, image mein NAHI)
  --restart unless-stopped            restart policy: no | on-failure[:N] | always | unless-stopped
  --rm                                exit par container (aur iski writable layer) delete karो
  --init                              zombies reap + signals forward karने ke liye ek tiny init PID 1
\`\`\`

**CONTAINER LIFECYCLE:**  created -> running -> (paused) -> exited -> removed.
\`docker ps\` · \`logs\` · \`exec\` · \`inspect\` · \`stats\` · \`stop\`(SIGTERM+10s+SIGKILL) · \`kill\` · \`rm\`.

**BUILDKIT (Docker 23 se default builder; \`docker buildx\`):**
\`\`\`
- independent stages PARALLEL mein build karता hai; target ke liye na chahिए wale stages skip karता hai
- CACHE MOUNTS:  RUN --mount=type=cache,target=/root/.npm  npm ci
    -> package cache builds ke across PERSIST karता hai chahे layer rebuild ho
- SECRET MOUNTS: RUN --mount=type=secret,id=tok ...   (file sirf us RUN ke dauran, kabhi ek layer mein nahi)
- SSH FORWARDING: RUN --mount=type=ssh  git clone git@...
- multi-platform (--platform), CI ke liye cache export
- pehli line chahिए:  # syntax=docker/dockerfile:1
\`\`\``,

    content: `## docker run flags are the kernel features from Lesson 1

Every important \`docker run\` flag configures one of the isolation or limiting mechanisms a container is built from.

### Resource limits — cgroups

- **\`--memory 512m\`** (with **\`--memory-swap 512m\`** to also cap swap) — a hard memory limit. Exceeding it triggers the kernel OOM killer against the container, which exits 137. Set this from measured usage plus headroom; without it a leak takes down the host.
- **\`--cpus 1.5\`** — a CPU quota equivalent to 1.5 cores. \`--cpu-shares\` sets a relative weight used only when the host is contended.
- **\`--pids-limit 200\`** — a cap on the number of processes, containing fork bombs.

### Networking — the net namespace

- **\`-p 8080:80\`** — **publish** container port 80 as host port 8080 (this is DNAT, Module 3). \`-p 80\` picks a random host port. \`-p 127.0.0.1:8080:80\` binds only to loopback so the port is not exposed on the host's external interfaces.
- **\`--network <name>\`** — attach to a user-defined bridge network, on which Docker provides DNS so containers reach each other by name (Module 6). \`--network none\` gives no network; \`--network host\` shares the host's network stack entirely (no isolation — the container's ports *are* the host's ports).
- **\`EXPOSE\` in the Dockerfile does not publish anything** — only \`-p\` / Compose / the orchestrator does.

### Storage — the mnt namespace

- **\`-v /host/path:/container/path\`** — a **bind mount**: a specific host directory appears at that path in the container. Useful in development to mount source code; fragile in production because it depends on an exact host path.
- **\`-v myvolume:/data\`** — a **named volume**: storage managed by Docker, stored under Docker's data directory, that **outlives the container**. This is where container state belongs.
- **\`--mount type=tmpfs,destination=/tmp\`** — an in-memory filesystem, gone when the container stops.
- **\`--read-only\`** — mount the container's root filesystem read-only, so the process cannot modify anything outside explicitly declared writable mounts. Pair with **\`--tmpfs /tmp\`** and a writable volume for the paths the app genuinely needs to write. A strong hardening step: a compromised process cannot drop a binary or modify config.

### Identity and privilege

- **\`--user 10001:10001\`** — run as this UID and GID, overriding the image's \`USER\`. A numeric id satisfies \`runAsNonRoot\` policies.
- **\`--cap-drop ALL --cap-add NET_BIND_SERVICE\`** — drop every Linux capability, then add back only the specific ones the workload needs (here, the ability to bind a low port). Most applications need none.
- **\`--security-opt no-new-privileges\`** — prevent any process in the container from gaining more privileges than it started with (blocks setuid escalation).
- **\`--security-opt seccomp=profile.json\`** / **\`apparmor=...\`** — a custom syscall filter or MAC profile beyond the defaults.

### Configuration and lifecycle

- **\`-e KEY=value\`**, **\`--env-file .env\`** — runtime environment variables. **This is where configuration and secrets go** — injected at run time, never baked into the image.
- **\`--restart <policy>\`** — \`no\` (default), \`on-failure[:max-retries]\`, \`always\`, \`unless-stopped\` (restart always, except if you explicitly stopped it, even across daemon restarts).
- **\`--rm\`** — remove the container and its writable layer when it exits. Good for one-off tasks; not for services.
- **\`--name\`**, **\`-d\`** (detached), **\`-it\`** (interactive + TTY, for a shell).
- **\`--init\`** — run a minimal init process as PID 1 that reaps zombie processes and forwards signals. Needed when your PID 1 is not a proper init (e.g. a shell script, or a language runtime that does not reap children).

## Container lifecycle

\`created\` → \`running\` → optionally \`paused\` → \`exited\` (with a code) → \`removed\`.

- \`docker ps\` lists running containers; \`docker ps -a\` includes exited ones (which still hold their writable layer and logs until removed).
- \`docker logs <c>\` — stdout/stderr. \`docker logs -f\` follows.
- \`docker exec -it <c> sh\` — run a command in a running container (debugging; not for changes that must persist).
- \`docker inspect <c>\` — the full config and state as JSON.
- \`docker stats\` — live per-container CPU, memory, network, IO (read from cgroups).
- \`docker stop <c>\` — sends **SIGTERM**, waits (default 10s, \`-t\` to change), then **SIGKILL**. \`docker kill\` sends SIGKILL immediately.
- \`docker rm <c>\` — delete a stopped container and its writable layer.

## BuildKit

**BuildKit** is the modern build engine, the default since Docker 23, invoked as \`docker build\` (or explicitly \`docker buildx build\`). Over the legacy builder it adds:

- **Parallelism** — independent stages of a multi-stage build run concurrently, and stages not needed for the requested target are skipped entirely.
- **Cache mounts** — \`RUN --mount=type=cache,target=/root/.npm npm ci\`. The directory is a persistent cache that survives across builds **even when the layer itself is rebuilt**. So when \`package-lock.json\` changes and the \`npm ci\` layer must rerun, npm still finds most packages already downloaded in the cache mount and only fetches the new ones. Works for apt, pip, go, cargo, maven, gradle — every package manager with a download cache.
- **Secret mounts** — \`RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci\`, built with \`docker build --secret id=npmrc,src=$HOME/.npmrc\`. The secret file is available only during that one \`RUN\` and is never written into a layer or the history (Lesson 3).
- **SSH forwarding** — \`RUN --mount=type=ssh git clone git@github.com:org/private.git\`, built with \`--ssh default\`. Your SSH agent is forwarded into the build for that command; no private key ever enters the image.
- **Bind mounts** — \`RUN --mount=type=bind,source=.,target=/src ...\` reads files from the build context without creating a \`COPY\` layer.
- **Multi-platform** — \`docker buildx build --platform=linux/amd64,linux/arm64\` produces a manifest list (Lesson 5).
- **External cache** — \`--cache-to\` / \`--cache-from\` export and import the build cache to a registry or a local directory, so CI runners that start fresh each time still get cache hits.

BuildKit features that use \`--mount\` in a \`RUN\` require the Dockerfile to opt in with a first line: \`# syntax=docker/dockerfile:1\`.`,

    contentHi: `## docker run flags Lesson 1 ke kernel features hain

Har important \`docker run\` flag un isolation ya limiting mechanisms mein se ek configure karता hai jinse ek container banा hai.

**Resource limits — cgroups.** **\`--memory 512m\`** (aur **\`--memory-swap 512m\`**) — ek hard memory limit. Exceed karना kernel OOM killer trigger karता hai, exit 137. **\`--cpus 1.5\`** — 1.5 cores ke barabar ek CPU quota. **\`--pids-limit 200\`** — processes ki sankhya par ek cap.

**Networking — net namespace.** **\`-p 8080:80\`** — container port 80 ko host port 8080 ke roop mein **publish** karो (DNAT). \`-p 127.0.0.1:8080:80\` sirf loopback par bind karता hai. **\`--network <name>\`** — ek user-defined bridge network se attach. \`--network host\` host ka network stack poori tarah share karता hai (koi isolation nahi). **Dockerfile mein \`EXPOSE\` kुछ publish nahi karता.**

**Storage — mnt namespace.** **\`-v /host/path:/container/path\`** — ek **bind mount** (development mein useful). **\`-v myvolume:/data\`** — ek **named volume** jo **container ko outlive karता hai**. **\`--read-only\`** — container ki root filesystem read-only mount karो (ek strong hardening step).

**Identity aur privilege.** **\`--user 10001:10001\`** — is UID aur GID ke roop mein run karो. **\`--cap-drop ALL --cap-add NET_BIND_SERVICE\`** — har Linux capability drop karो, phir sirf zaroori wapas add karो. **\`--security-opt no-new-privileges\`** — kisi process ko shuru se zyada privileges gain karने se rokो.

**Configuration aur lifecycle.** **\`-e KEY=value\`**, **\`--env-file .env\`** — runtime environment variables. **Yahaan configuration aur secrets jाते hain.** **\`--restart <policy>\`** — \`no\`, \`on-failure[:N]\`, \`always\`, \`unless-stopped\`. **\`--rm\`** — exit par container remove karो. **\`--init\`** — ek minimal init process PID 1 ke roop mein jo zombies reap karता hai aur signals forward karता hai.

## Container lifecycle

\`created\` → \`running\` → optionally \`paused\` → \`exited\` → \`removed\`. \`docker ps\` / \`docker ps -a\` / \`logs\` / \`exec\` / \`inspect\` / \`stats\` / \`stop\` (SIGTERM + 10s + SIGKILL) / \`kill\` / \`rm\`.

## BuildKit

**BuildKit** modern build engine hai, Docker 23 se default. Legacy builder ke upar ye add karता hai: **Parallelism** (independent stages concurrently run karते hain); **Cache mounts** (\`RUN --mount=type=cache,target=/root/.npm npm ci\` — directory ek persistent cache hai jo builds ke across survive karता hai **chahे layer khud rebuild ho**); **Secret mounts** (secret file sirf us ek \`RUN\` ke dauran available, kabhi ek layer mein nahi); **SSH forwarding** (aapка SSH agent build mein forwarded, koi private key image mein nahi); **Bind mounts** (build context se files padhो bina ek \`COPY\` layer ke); **Multi-platform**; **External cache** (\`--cache-to\` / \`--cache-from\`).

\`--mount\` istemal karने wale BuildKit features ko ek first line chahिए: \`# syntax=docker/dockerfile:1\`.`,

    examples: [
      {
        title: 'Hardened docker run: non-root, read-only, no caps, limits',
        titleHi: 'Hardened docker run: non-root, read-only, no caps, limits',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
printf 'FROM alpine:3.20\\nRUN adduser -D -u 10001 app\\n' > Dockerfile
docker build -q -t hardened . >/dev/null

echo "--- run it locked down ---"
docker run --rm \\
  --user 10001 \\
  --read-only --tmpfs /tmp \\
  --cap-drop ALL \\
  --security-opt no-new-privileges \\
  --memory 64m --pids-limit 50 \\
  hardened sh -c '
    echo "uid: $(id -u)"
    echo x 2>/dev/null 1>/tmp/probe && echo "tmpfs /tmp: writable"
    if echo x 2>/dev/null 1>/rootfs-probe; then echo "rootfs: writable"; else echo "rootfs: read-only (--read-only)"; fi
    echo "mem limit (bytes): $(cat /sys/fs/cgroup/memory.max)"
  '
docker rmi -f hardened >/dev/null 2>&1 || true`,
        output: `--- run it locked down ---
uid: 10001
tmpfs /tmp: writable
rootfs: read-only (--read-only)
mem limit (bytes): 67108864`,
        explain: 'The container is run with a stack of restrictions that together represent a sensible production baseline. It runs as a specific non-root user id, so the process has no administrative privilege inside the container. Its root filesystem is mounted read-only, so the process cannot create or modify any file except in the places explicitly made writable — here a small in-memory filesystem at the temp directory, which the output confirms is writable while an attempt to write elsewhere in the root filesystem is refused. Every Linux capability is dropped, so even operations that a root process would normally be allowed are blocked. The no-new-privileges option ensures no process can escalate through a setuid binary. A memory limit is set, visible from inside the container as the exact byte count in the cgroup file, and a process-count limit guards against fork bombs. Each of these closes off a class of what a compromised process could do: it cannot persist a payload to disk, cannot use elevated capabilities, cannot escalate, and cannot exhaust host memory or process slots. The application still works because a well-behaved service only needs to write to a scratch directory and a data volume, both of which can be provided explicitly.',
        explainHi: 'Container restrictions ke ek stack ke saath run hoता hai jo saath ek sensible production baseline represent karते hain. Ye ek specific non-root user id ke roop mein run karता hai. Iski root filesystem read-only mounted hai, to process kisi bhi file ko create ya modify nahi kar sakта sivाy un jagahon ke jo explicitly writable banी hain — yahaan temp directory par ek small in-memory filesystem. Har Linux capability dropped hai. no-new-privileges option ensure karता hai koi process ek setuid binary ke through escalate nahi kar sakта. Ek memory limit set hai, container ke andar se cgroup file mein exact byte count ke roop mein visible. In mein se har ek ek class band karता hai ki ek compromised process kya kar sakта tha: ye disk par ek payload persist nahi kar sakta, elevated capabilities use nahi kar sakta, escalate nahi kar sakta, aur host memory exhaust nahi kar sakta.',
      },
      {
        title: 'BuildKit cache mount: deps stay cached even when the layer reruns',
        titleHi: 'BuildKit cache mount: layer rerun hone par bhi deps cached rehte hain',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cid="m5cache-$(date +%s%N)"      # a fresh cache-mount id so the first build starts empty
cat > Dockerfile <<DF
FROM alpine:3.20
RUN --mount=type=cache,id=$cid,target=/cache sh -c "cat /cache/note 2>/dev/null > /result || echo NO-PRIOR-CACHE-DATA > /result; echo persisted-value > /cache/note"
DF

docker build -q -t cm . >/dev/null
echo "build 1 (the /cache mount is empty):        $(docker run --rm cm cat /result)"

# change the RUN so the layer is invalidated and MUST re-execute
sed -i 's#note 2>/dev/null#note  2>/dev/null#' Dockerfile
docker build -q -t cm . >/dev/null
echo "build 2 (RUN re-ran, but /cache survived):  $(docker run --rm cm cat /result)"
docker rmi -f cm >/dev/null 2>&1 || true`,
        output: `build 1 (the /cache mount is empty):        NO-PRIOR-CACHE-DATA
build 2 (RUN re-ran, but /cache survived):  persisted-value`,
        explain: 'The RUN instruction declares a cache mount at a directory, and the script reads whatever is in that directory and writes a fresh value into it. On the first build the mounted cache directory is empty, so the read finds nothing and the result baked into the image says so; the script then writes a value into the cache. The second build changes the instruction text just enough to invalidate the layer, so the instruction must execute again — this is not ordinary layer caching, which would skip it. When it re-executes, BuildKit reattaches the same cache mount, so the directory still contains the value written during the first build, and this time the read finds it. This is what a cache mount is for: it preserves expensive-to-produce state — a package manager\'s download cache, a compiler\'s object cache, a dependency resolver\'s metadata — across the builds where the layer genuinely has to run, so that re-running the instruction is fast even though it is not skipped. Every language\'s package manager and build tool has such a cache directory, and pointing a cache mount at it is the single most effective way to keep rebuilds fast when dependencies or the instruction itself change.',
        explainHi: 'RUN instruction ek directory par ek cache mount declare karta hai, aur script us directory mein jo bhi hai wo read karta hai aur ismein ek fresh value write karta hai. Pehle build par mounted cache directory empty hai, to read ko kuch nahi milta aur image mein baked result yahi kehta hai; script phir cache mein ek value write karta hai. Doosre build par instruction text ko layer invalidate karne ke liye bas itna change kiya jaata hai ki instruction phir se execute hona chahiye. Jab ye re-execute hota hai, BuildKit wahi cache mount reattach karta hai, to directory mein abhi bhi pehle build ke dauran likhi value hai, aur is baar read use paa leta hai. Yahi ek cache mount ka point hai: ye expensive-to-produce state (ek package manager ka download cache, ek compiler ka object cache) un builds ke across preserve karta hai jahaan layer ko genuinely run hona hai, taaki instruction re-run karna fast hai chahe ye skip na ho. Har language ke package manager aur build tool ki aisi ek cache directory hoti hai, aur us par ek cache mount point karna rebuilds ko fast rakhne ka sabse effective tarika hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# running containers with no limits, no user override, full capabilities
$ docker run -d -p 80:8080 --restart always myapp
# -> runs as root; can bind :80; has ~14 default capabilities; unbounded memory
//    and CPU; writable rootfs. a compromise or a leak has maximum blast radius,
//    and 'nothing constrains it' is the default, not an accident.`,
        right: `$ docker run -d \\
    -p 127.0.0.1:8080:8080 \\
    --user 10001:10001 \\
    --read-only --tmpfs /tmp --tmpfs /run \\
    --cap-drop ALL \\
    --security-opt no-new-privileges \\
    --memory 512m --memory-swap 512m --cpus 1 --pids-limit 200 \\
    --restart unless-stopped \\
    --env-file /etc/myapp/env \\
    myapp
# (in Compose/k8s these are 'deploy.resources', 'securityContext', etc. — same knobs.)`,
        why: 'A container started with only the basic flags inherits permissive defaults for every isolation and limiting mechanism: it runs as root within the container, keeps the default set of Linux capabilities, has an unbounded memory and CPU cgroup, and has a writable root filesystem. None of this is required by a typical application, and each is an avenue for damage if the workload is compromised or misbehaves. An unbounded memory cgroup lets a leak exhaust the host; a writable root filesystem lets an attacker persist a payload; the default capabilities and root identity give a process far more power than it needs and amplify any container-escape. The hardened form sets each mechanism to the least the application actually needs: a non-root numeric user, a read-only root filesystem with small writable scratch mounts, all capabilities dropped, no privilege escalation, explicit memory and CPU and process limits, a sensible restart policy, and configuration supplied at runtime rather than baked in. The same settings exist in Compose and in orchestrator manifests under different names, and applying them should be the default posture, not a special case.',
        whyHi: 'Sirf basic flags ke saath started ek container har isolation aur limiting mechanism ke liye permissive defaults inherit karता hai: ye container ke andar root ke roop mein run karता hai, Linux capabilities ka default set rakhता hai, ek unbounded memory aur CPU cgroup rakhता hai, aur ek writable root filesystem rakhता hai. In mein se kुछ bhi ek typical application dwara required nahi hai, aur har ek damage ke liye ek avenue hai agar workload compromised hoता hai. Ek unbounded memory cgroup ek leak ko host exhaust karने deता hai; ek writable root filesystem ek attacker ko ek payload persist karने deता hai. Hardened form har mechanism ko us least par set karта hai jo application actually chahिए. Same settings Compose aur orchestrator manifests mein alag names ke under exist karते hain.',
      },
      {
        wrong: `# storing state in the container filesystem, then losing it
$ docker run -d --name db postgres:16
# ... weeks of data ...
$ docker rm -f db && docker run -d --name db postgres:16   # "upgrading"
# -> the writable layer (all the data) is GONE. postgres starts with an empty db.
#    same outcome on any node reschedule, host rebuild, or 'docker system prune'.`,
        right: `# state -> a named volume that outlives the container:
$ docker volume create pgdata
$ docker run -d --name db -v pgdata:/var/lib/postgresql/data postgres:16
# now 'docker rm -f db' + a fresh 'docker run -v pgdata:...' keeps every byte.
# back up the VOLUME (pg_dump / a volume snapshot), not the container.
# (dev-only: -v $PWD/data:/var/lib/postgresql/data bind-mounts a host dir.)`,
        why: 'A container\'s writable layer exists only for the life of that specific container instance and is deleted when the container is removed, which happens not just on an explicit removal but on any rebuild, any reschedule to another node, any host replacement, and any storage cleanup. Data written directly into the container filesystem is therefore lost at the first of those events, and for a stateful workload like a database that is a total loss. A named volume is storage that Docker manages independently of any container: it is mounted into the container at a path, it persists after the container is gone, and a new container can mount the same volume and see the same data. Stateful data must be placed on a volume, and backups must target the volume — through a database-native dump or a snapshot of the volume — rather than the container, which holds nothing durable. Bind mounts to a host directory work for development but tie the data to one machine\'s filesystem layout and are not appropriate for production.',
        whyHi: 'Ek container ki writable layer sirf us specific container instance ke life ke liye exist karती hai aur container remove hone par deleted hoती hai, jo sirf ek explicit removal par nahi balki kisi bhi rebuild, doosरे node par kisi bhi reschedule, kisi bhi host replacement, aur kisi bhi storage cleanup par hoता hai. Container filesystem mein directly likhा data isliye un events mein se pehle par lost hai, aur ek database jaisे ek stateful workload ke liye wo ek total loss hai. Ek named volume storage hai jise Docker kisi bhi container se independently manage karता hai: ye container mein ek path par mounted hai, ye container ke jaane ke baad persist karता hai, aur ek naya container same volume mount kar sakта hai. Stateful data ek volume par rakhा jाना chahिए, aur backups volume ko target karने chahिए.',
      },
      {
        wrong: `# PID 1 is a shell script that doesn't reap children or forward signals
# entrypoint: /start.sh   (spawns the app in the background, then 'wait's or 'tail -f')
# -> zombie processes accumulate (nothing reaps them). 'docker stop' -> SIGTERM to
//    the script, which doesn't pass it on -> app SIGKILLed after 10s. and if the
//    app crashes, the script keeps running so the container looks "up".`,
        right: `# either: exec the app so IT is PID 1 (Lesson 3) —
#   #!/bin/sh
#   ...setup...
#   exec "$@"                       # app replaces the script as PID 1
# or: use a real init as PID 1 to reap zombies + forward signals —
$ docker run --init myapp           # Docker's built-in tini
#   or  ENTRYPOINT ["/usr/bin/tini","--"]  in the Dockerfile
# a proper PID 1: reaps orphaned children, forwards SIGTERM/SIGINT, exits when the
# real workload exits (so the container's state tracks the app's).`,
        why: 'The process with id one in a container has two responsibilities a normal process does not: it must reap child processes that have exited so they do not remain as zombies, and it should forward termination signals to the real workload so it can shut down gracefully. A shell script used as the entrypoint typically does neither. Zombie processes then accumulate over the container\'s life, consuming process table slots. A stop request sends its signal to the script, which does not pass it to the application, so the application is not asked to shut down and is forcibly killed after the grace period, dropping in-flight work. And if the application itself exits or crashes while the script continues running, the container stays in the running state even though the workload is gone, so the orchestrator does not restart it. The fix is either to have the script hand off to the application with exec, so the application becomes process one and inherits those responsibilities, or to run a minimal init process as process one — Docker has one built in, enabled with a flag — that reaps zombies, forwards signals, and exits when the workload does.',
        whyHi: 'Ek container mein id ek wala process ke do responsibilities hain jo ek normal process ke nahi: ise child processes ko reap karना chahिए jo exit ho gaye hain taki wo zombies ke roop mein na rahें, aur ise termination signals ko real workload ko forward karना chahिए. Entrypoint ke roop mein istemal kiya gaya ek shell script typically dono nahi karता. Zombie processes phir container ke life mein accumulate hote hain. Ek stop request apna signal script ko bhejता hai, jo ise application ko pass nahi karता, to application ko shut down karने ke liye nahi poocha jाता. Aur agar application khud exit ya crash karता hai jabki script running rehता hai, container running state mein rehта hai chahे workload chala gaya. Fix ya to script ko exec ke saath application ko hand off karवाना hai, ya ek minimal init process process ek ke roop mein run karना hai.',
      },
    ],

    realWorld: [
      {
        en: '**A container-escape in a pentest yielded root on the host** — the container ran as root with default caps and a writable rootfs. The remediation was a standard hardened `run` spec (non-root, `--read-only`, `--cap-drop=ALL`, `no-new-privileges`, limits) applied fleet-wide via a Compose/k8s template.',
        hi: '**Ek pentest mein ek container-escape ne host par root diya** — container root ke roop mein default caps aur ek writable rootfs ke saath run karता tha. Remediation ek standard hardened `run` spec tha.',
      },
      {
        en: '**A Postgres container "lost all data" during a routine node drain** — data was in the writable layer, no volume. Moved to a named volume + nightly `pg_dump` to object storage; the next node drain was a non-event.',
        hi: '**Ek Postgres container ne ek routine node drain ke dauran "saara data kho diya"** — data writable layer mein tha, koi volume nahi.',
      },
      {
        en: '**CI image builds cut ~6 min** by adding `RUN --mount=type=cache` for pip + npm and `--cache-to=type=registry` so ephemeral runners share the cache. The Dockerfile also got `# syntax=docker/dockerfile:1` as its first line to enable the mounts.',
        hi: '**CI image builds ~6 min kम** pip + npm ke liye `RUN --mount=type=cache` add karके aur `--cache-to=type=registry` se taki ephemeral runners cache share karें.',
      },
    ],

    interviewQA: [
      {
        q: 'Which `docker run` flags would you set for a production service and why?',
        qHi: 'Ek production service ke liye aap kaunसे `docker run` flags set karोge aur kyun?',
        a: 'I would constrain every isolation and limiting mechanism to the least the service needs. For resources: a memory limit with swap capped to the same value, so a leak is contained to the container and triggers an OOM kill there rather than exhausting the host; a CPU limit; and a process limit to contain fork bombs. All three sized from measured usage plus headroom. For identity and privilege: run as a non-root numeric user id, drop all Linux capabilities and add back only any the workload genuinely needs, and set no-new-privileges so nothing can escalate through a setuid binary. For the filesystem: mount the root filesystem read-only and provide small writable mounts only where the app actually writes, such as a temp directory as tmpfs and a named volume for real data, so a compromised process cannot persist anything. For networking: publish only the ports needed, and bind them to loopback if only a local proxy should reach them, rather than exposing on all host interfaces. For configuration: supply environment and secrets at run time through an env file or a secrets mechanism, never baked into the image. And a restart policy of unless-stopped so the service comes back after a crash or a daemon restart but stays down if I deliberately stopped it. In Compose or Kubernetes these are the same knobs under resources, securityContext, volumes, and restart settings.',
        aHi: 'Main har isolation aur limiting mechanism ko us least par constrain karूंga jo service chahिए. Resources ke liye: ek memory limit swap ke saath same value par capped, ek CPU limit, aur ek process limit. Identity aur privilege ke liye: ek non-root numeric user id ke roop mein run karो, saari Linux capabilities drop karो aur sirf koi jo workload genuinely chahिए wapas add karो, aur no-new-privileges set karो. Filesystem ke liye: root filesystem read-only mount karो aur sirf jahaan app actually write karता hai wahaan small writable mounts provide karो. Networking ke liye: sirf zaroori ports publish karो. Configuration ke liye: run time par environment aur secrets supply karो, kabhi image mein baked nahi. Aur unless-stopped ki ek restart policy.',
      },
      {
        q: 'What does BuildKit add over the legacy builder, and what is the difference between a cache mount and layer caching?',
        qHi: 'BuildKit legacy builder ke upar kya add karता hai, aur ek cache mount aur layer caching ke beech kya difference hai?',
        a: 'BuildKit is the default modern build engine. Over the legacy builder it adds parallel execution of independent stages in a multi-stage build and skips any stage not needed for the requested target; cache mounts, secret mounts, and SSH forwarding as options on a RUN instruction; bind mounts to read the build context without a copy layer; native multi-platform builds that produce a manifest list; and the ability to export and import the build cache to a registry or directory so fresh CI runners get cache hits. Layer caching and cache mounts solve related but distinct problems. Layer caching operates at the level of whole instructions: if an instruction and its inputs are unchanged and every prior layer was a cache hit, the builder reuses the existing layer and does not run the instruction at all. A cache mount operates inside an instruction that does have to run: it attaches a persistent directory, living outside the image layers, at a path such as a package manager\'s download cache, and that directory survives across builds even when the layer is being rebuilt. So when a dependency manifest changes and the install layer must rerun, layer caching cannot help because the instruction changed, but the cache mount means the package manager still finds most packages already downloaded and fetches only the new ones. Together they make both the unchanged case free and the changed case fast.',
        aHi: 'BuildKit default modern build engine hai. Legacy builder ke upar ye add karता hai: ek multi-stage build mein independent stages ka parallel execution; ek RUN instruction par options ke roop mein cache mounts, secret mounts, aur SSH forwarding; ek copy layer ke bina build context padhने ke liye bind mounts; native multi-platform builds; aur build cache ko ek registry mein export aur import karने ki ability. Layer caching aur cache mounts related par distinct problems solve karते hain. Layer caching poore instructions ke level par operate karता hai: agar ek instruction aur iske inputs unchanged hain, builder existing layer reuse karता hai aur instruction bilkul run nahi karता. Ek cache mount ek instruction ke andar operate karता hai jise run honा hai: ye ek persistent directory attach karता hai jo image layers ke bahar rehता hai, aur wo directory builds ke across survive karता hai chahे layer rebuild ho raha ho.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write a fully hardened `docker run` line for a web service and, for each flag, name the Lesson 1 kernel mechanism it configures.',
        taskHi: 'Ek comment mein, ek web service ke liye ek fully hardened `docker run` line likho.',
        hint: '```\ndocker run -d \\\n  -p 127.0.0.1:8080:8080 \\          # net namespace — publish only to loopback (DNAT)\n  --user 10001:10001 \\               # user namespace / process identity — non-root\n  --read-only --tmpfs /tmp \\         # mnt namespace — read-only rootfs + writable scratch\n  --cap-drop ALL \\                   # capabilities — drop all root powers\n  --cap-add NET_BIND_SERVICE \\       # ...add back only if binding a low port\n  --security-opt no-new-privileges \\ # no setuid escalation\n  --memory 512m --memory-swap 512m \\ # memory cgroup — hard cap (breach → OOM 137)\n  --cpus 1 \\                         # cpu cgroup — quota\n  --pids-limit 200 \\                 # pids cgroup — fork-bomb guard\n  --restart unless-stopped \\         # lifecycle policy\n  --env-file /etc/app/env \\          # runtime config/secrets (NOT baked in the image)\n  myapp@sha256:...\n```',
        hintHi: '`-p 127.0.0.1:8080:8080` (net namespace — sirf loopback), `--user 10001:10001` (user namespace — non-root), `--read-only --tmpfs /tmp` (mnt namespace), `--cap-drop ALL` (capabilities), `--security-opt no-new-privileges`, `--memory 512m --memory-swap 512m` (memory cgroup — breach → OOM 137), `--cpus 1` (cpu cgroup), `--pids-limit 200` (pids cgroup), `--restart unless-stopped`, `--env-file` (runtime config, image mein NAHI).',
      },
      {
        task: 'In a comment, explain why data written to a container\'s filesystem is lost, name the 4 events that destroy it, and give the correct fix plus how to back it up.',
        taskHi: 'Ek comment mein, samjhाओ kyun ek container ki filesystem mein likhा data lost hoता hai.',
        hint: 'A container = image layers (read-only) + a THIN WRITABLE LAYER that exists ONLY for that container instance. It\'s destroyed on: (1) `docker rm` / `docker rm -f` (incl. every "recreate to upgrade"); (2) a reschedule to another node (k8s); (3) a host rebuild / replacement; (4) `docker system prune` or storage cleanup. Fix: a NAMED VOLUME — `docker volume create pgdata` then `-v pgdata:/var/lib/postgresql/data` — Docker manages it independently of any container, it outlives the container, and a fresh container mounting the same volume sees the same data. Back up the VOLUME, not the container: a DB-native dump (`pg_dump`) or a volume snapshot, shipped to object storage. Bind mounts (`-v $PWD/data:/...`) are dev-only — they tie data to one host\'s filesystem layout.',
        hintHi: 'Ek container = image layers (read-only) + ek THIN WRITABLE LAYER jo SIRF us instance ke liye. Destroyed: (1) `docker rm` (har "recreate to upgrade" incl.); (2) doosरे node par reschedule; (3) host rebuild; (4) `docker system prune`. Fix: ek NAMED VOLUME — `docker volume create pgdata` phir `-v pgdata:/...` — Docker ise independently manage karता hai, container ko outlive karта hai. VOLUME back up karो, container nahi: `pg_dump` ya ek volume snapshot.',
      },
      {
        task: 'In a comment, explain the difference between layer caching and a BuildKit cache mount, and write the `RUN` line + the Dockerfile first line needed to cache `npm` downloads across builds.',
        taskHi: 'Ek comment mein, layer caching aur ek BuildKit cache mount ke beech difference samjhाओ.',
        hint: 'LAYER CACHING works at the instruction level: if the instruction text + its inputs + all prior layers are unchanged, the builder reuses the layer and DOESN\'T RUN the instruction at all. A CACHE MOUNT works INSIDE an instruction that DOES have to run: it attaches a persistent directory (living outside the image layers) at e.g. the package manager\'s download cache, and that directory survives across builds EVEN WHEN THE LAYER REBUILDS. So when `package-lock.json` changes → layer caching can\'t help (the `COPY` + `RUN npm ci` layer is invalidated) but the cache mount means npm finds most packages already downloaded and fetches only the new ones. Dockerfile:\n```\n# syntax=docker/dockerfile:1\n...\nRUN --mount=type=cache,target=/root/.npm npm ci\n```\nIn CI, also `--cache-to=type=registry,...` / `--cache-from` so fresh runners get hits.',
        hintHi: 'LAYER CACHING instruction level par: agar instruction text + inputs + prior layers unchanged, builder layer reuse karता hai aur instruction RUN NAHI karता. Ek CACHE MOUNT ek instruction ke ANDAR jise run honा hai: ek persistent directory attach karता hai jo builds ke across survive karता hai CHAHE LAYER REBUILD HO. To jab `package-lock.json` change hoती hai → layer caching madad nahi kar sakती par cache mount matlab npm zyaादातर packages already downloaded paता hai. `# syntax=docker/dockerfile:1` + `RUN --mount=type=cache,target=/root/.npm npm ci`.',
      },
    ],

    keyTakeaways: [
      'Every important `docker run` flag configures a Lesson-1 kernel mechanism. RESOURCE (cgroups): `--memory 512m` + `--memory-swap 512m` (hard RAM cap — breach → OOM kill, exit 137), `--cpus 1.5` (quota), `--pids-limit 200` (fork-bomb guard) — size all from measured usage + headroom, or one leaking container takes down the HOST. NETWORK (net namespace): `-p 8080:80` PUBLISHES (DNAT) — `EXPOSE` in the Dockerfile does NOT; `-p 127.0.0.1:8080:80` binds loopback only; `--network host` = no isolation (container ports ARE host ports).',
      'STORAGE (mnt namespace): `-v /host/path:/data` = a BIND MOUNT (dev — depends on an exact host path); `-v myvol:/data` = a NAMED VOLUME (Docker-managed, OUTLIVES the container — this is where state belongs); `--read-only` + `--tmpfs /tmp` = read-only rootfs with writable scratch (a compromised process can\'t persist a payload). IDENTITY/PRIVILEGE: `--user 10001:10001` (non-root numeric — satisfies `runAsNonRoot`), `--cap-drop ALL --cap-add <only-what\'s-needed>`, `--security-opt no-new-privileges` (blocks setuid escalation).',
      'CONFIG/LIFECYCLE: `-e KEY=val` / `--env-file` = runtime config + secrets (NEVER baked in the image); `--restart` = `no` (default) | `on-failure[:N]` | `always` | `unless-stopped` (survives daemon restarts, respects a deliberate stop); `--rm` deletes the container + writable layer on exit; `--init` runs a tiny init as PID 1 to REAP ZOMBIES + FORWARD SIGNALS (needed when PID 1 is a shell script or a runtime that doesn\'t reap children — otherwise zombies pile up, SIGTERM isn\'t forwarded, and a crashed app leaves the container "up"). LIFECYCLE: created → running → (paused) → exited(code) → removed. `docker stop` = SIGTERM, wait (10s default, `-t`), then SIGKILL; `docker kill` = SIGKILL now. `docker ps -a` / `logs` / `exec` / `inspect` / `stats`.',
      'DATA IN THE CONTAINER FILESYSTEM IS LOST on: `docker rm` (incl. every recreate-to-upgrade), a reschedule to another node, a host rebuild, `docker system prune`. Put state on a NAMED VOLUME; back up the VOLUME (DB-native dump / snapshot), not the container. A hardened production `run` sets ALL of the above to the least the app needs — the permissive defaults (root, full caps, unbounded cgroups, writable rootfs) are the default, not an accident, and maximise blast radius. Compose (`deploy.resources`, ...) and k8s (`securityContext`, ...) have the same knobs.',
      'BUILDKIT (default builder since Docker 23; `docker buildx`) over the legacy builder: builds independent stages IN PARALLEL + skips stages not needed for the `--target`; CACHE MOUNTS (`RUN --mount=type=cache,target=/root/.npm npm ci`) — a persistent dir OUTSIDE the layers that survives across builds EVEN WHEN THE LAYER REBUILDS (layer caching skips an unchanged instruction; a cache mount makes a *changed* instruction fast); SECRET MOUNTS (`--mount=type=secret,id=...` — file present only during that RUN, never in a layer/history); SSH FORWARDING (`--mount=type=ssh` — agent forwarded, no key in the image); BIND MOUNTS (read the context without a COPY layer); multi-platform (`--platform`); external cache (`--cache-to`/`--cache-from` — so fresh CI runners get cache hits). `--mount` in a `RUN` requires the Dockerfile first line `# syntax=docker/dockerfile:1`.',
    ],
    keyTakeawaysHi: [
      'Har important `docker run` flag ek Lesson-1 kernel mechanism configure karता hai. RESOURCE (cgroups): `--memory 512m` + `--memory-swap 512m` (breach → OOM kill, exit 137), `--cpus 1.5`, `--pids-limit 200` — sabhi measured usage + headroom se size karो, warna ek leaking container HOST ko down karता hai. NETWORK: `-p 8080:80` PUBLISH karता hai (DNAT) — Dockerfile mein `EXPOSE` NAHI; `-p 127.0.0.1:8080:80` sirf loopback; `--network host` = koi isolation nahi.',
      'STORAGE: `-v /host/path:/data` = BIND MOUNT (dev); `-v myvol:/data` = NAMED VOLUME (Docker-managed, container ko OUTLIVE karता hai — state yahaan); `--read-only` + `--tmpfs /tmp` (ek compromised process ek payload persist nahi kar sakta). IDENTITY/PRIVILEGE: `--user 10001:10001`, `--cap-drop ALL --cap-add <sirf-zaroori>`, `--security-opt no-new-privileges`.',
      'CONFIG/LIFECYCLE: `-e KEY=val` / `--env-file` = runtime config + secrets (KABHI image mein baked nahi); `--restart` = `no` | `on-failure[:N]` | `always` | `unless-stopped`; `--rm`; `--init` (ek tiny init PID 1 ke roop mein — ZOMBIES REAP + SIGNALS FORWARD). LIFECYCLE: created → running → (paused) → exited(code) → removed. `docker stop` = SIGTERM, wait (10s), phir SIGKILL.',
      'CONTAINER FILESYSTEM MEIN DATA LOST hoता hai: `docker rm` (har recreate-to-upgrade incl.), doosरे node par reschedule, host rebuild, `docker system prune`. State ek NAMED VOLUME par rakhо; VOLUME back up karो (DB dump / snapshot), container nahi. Ek hardened production `run` upar sab кुछ us least par set karता hai jo app chahिए. Compose aur k8s mein same knobs.',
      'BUILDKIT (Docker 23 se default; `docker buildx`): independent stages PARALLEL mein + `--target` ke liye na chahिए wale stages skip; CACHE MOUNTS (`RUN --mount=type=cache,...`) — layers ke BAHAR ek persistent dir jo builds ke across survive karता hai CHAHE LAYER REBUILD HO; SECRET MOUNTS (`--mount=type=secret,id=...` — file sirf us RUN ke dauran); SSH FORWARDING; BIND MOUNTS; multi-platform (`--platform`); external cache (`--cache-to`/`--cache-from`). `RUN` mein `--mount` ko Dockerfile first line `# syntax=docker/dockerfile:1` chahिए.',
    ],
  },
];
