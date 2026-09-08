/**
 * DevOps Complete Course — Module 5: Containers — Images, Layers & the Runtime, lessons 1-3.
 *
 * Lesson 1: What a container really is — namespaces, cgroups, the overlay
 *           filesystem; a process, not a VM; image vs container vs registry. PROSE
 *           (Linux-primitive concepts) + verified `docker run` if a daemon is up.
 * Lesson 2: The image & its layers — stacked, content-addressed, shared layers;
 *           the union filesystem; copy-on-write; `docker history`. VERIFIED against
 *           a real Docker build when the daemon is available.
 * Lesson 3: The Dockerfile — every instruction, layer-cache ordering,
 *           `.dockerignore`, ENTRYPOINT vs CMD, ARG vs ENV. VERIFIED where a daemon
 *           is up; otherwise realistic `docker build` output.
 *
 * Examples whose `code` begins with "# VERIFY" run against a real Docker
 * (scratchpad/verify-docker.mjs) when the daemon is reachable; otherwise they
 * are treated as prose and the shown output is realistic hand-written output.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_5: CourseLesson[] = [
  {
    slug: 'ops-what-a-container-really-is',
    title: 'What a Container Really Is',
    titleHi: 'Ek Container Actually Kya Hai',
    description: 'A container is a normal Linux process with a restricted view of the system: its own filesystem, process tree, and network, enforced by namespaces, and a cap on CPU and memory, enforced by cgroups. It is not a virtual machine — there is no guest kernel, no hardware emulation, and almost no overhead.',
    descriptionHi: 'Ek container ek normal Linux process hai system ke ek restricted view ke saath: iska apna filesystem, process tree, aur network, namespaces dwara enforced, aur CPU aur memory par ek cap, cgroups dwara enforced. Ye ek virtual machine nahi hai — koi guest kernel nahi, koi hardware emulation nahi, aur lagभag koi overhead nahi.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 1,

    analogy: {
      en: '**A VM is a separate house on the plot; a container is a lockable room in the existing house.** The VM brings its own foundation, plumbing, and electrical system (a full guest OS and kernel, virtualised hardware) — solid isolation, but you build a whole house each time. The container is a room partitioned off inside the house you already have: it gets its own door, its own labelled boxes, its own phone line (namespaces give it a private filesystem, process list, network), and a meter that cuts its power if it draws too much (cgroups limit CPU and memory). But it shares the house\'s foundation and wiring — the host kernel. Adding a room is fast and cheap; adding a house is neither. The trade-off is that everyone in the house shares one structural frame, so a crack in the frame (a kernel vulnerability) affects every room.',
      hi: '**Ek VM plot par ek separate ghar hai; ek container existing ghar mein ek lockable kamra hai.** VM apni foundation, plumbing, aur electrical system laता hai (ek full guest OS aur kernel, virtualised hardware) — solid isolation, par aap har baar ek poora ghar banाते ho. Container us ghar ke andar ek kamra hai jo aapke paas pehle se hai: ise apna door milता hai, apne labelled boxes, apni phone line (namespaces ise ek private filesystem, process list, network dete hain), aur ek meter jo iski power kaat deता hai agar ye zyada draw karता hai (cgroups CPU aur memory limit karते hain). Par ye ghar ki foundation aur wiring share karता hai — host kernel. Ek kamra add karना fast aur cheap hai; ek ghar add karना koi nahi. Trade-off ye hai ki ghar mein har koi ek structural frame share karता hai.',
    },

    simple: `**A CONTAINER = a process + a restricted VIEW of the machine. Not a VM.**
\`\`\`
        VIRTUAL MACHINE                      CONTAINER
  ┌────────────────────────┐         ┌────────────────────────┐
  │ app                    │         │ app                    │
  │ libs                   │         │ libs                   │
  │ GUEST KERNEL           │         │  (uses the HOST kernel) │
  │ virtual hardware       │         └────────────────────────┘
  ├────────────────────────┤              ↕ namespaces + cgroups
  │ hypervisor             │         ┌────────────────────────┐
  │ HOST kernel + hardware │         │ HOST kernel + hardware  │
  └────────────────────────┘         └────────────────────────┘
  boot: ~seconds, ~GBs RAM           start: ~milliseconds, ~MBs
  strong isolation (own kernel)      shared kernel = weaker isolation
\`\`\`

**THREE LINUX KERNEL FEATURES do all the work:**
\`\`\`
NAMESPACES  give a process a PRIVATE view of a global resource:
  mnt   its own filesystem mounts (this is how it gets a different "/" — the image)
  pid   its own process tree (its main process is PID 1; can't see host processes)
  net   its own network stack (own interfaces, routing, ports, localhost)
  uts   its own hostname
  ipc   its own shared-memory / semaphores
  user  map container UID 0 (root) to an unprivileged host UID  (rootless / userns)
  cgroup its own view of the cgroup hierarchy

CGROUPS (control groups)  LIMIT and ACCOUNT resource use:
  cpu (shares / quota) · memory (limit + OOM kill) · pids (max) · io (bandwidth) · devices

CAPABILITIES + seccomp + AppArmor/SELinux  DROP privileges the process doesn't need
  (a container by default can't load kernel modules, change the clock, etc.)
\`\`\`

**IMAGE vs CONTAINER vs REGISTRY:**
\`\`\`
IMAGE      a read-only, layered filesystem snapshot + metadata (env, entrypoint, ...).
           immutable. identified by a content digest (sha256:...). like a class.
CONTAINER  a running (or stopped) instance of an image: the image's layers + a thin
           writable layer on top + the namespaces/cgroups. like an object.
REGISTRY   a server that stores and serves images by name:tag / digest
           (Docker Hub, GHCR, ECR, GCR, Harbor). 'docker push' / 'docker pull'.
\`\`\`

**WHAT A CONTAINER IS *NOT*:**
\`\`\`
- not a VM: no guest kernel, no hardware emulation, ~0 overhead, shares the host kernel
- not a security boundary as strong as a VM: kernel exploit -> escape. for hostile
  multi-tenant workloads use a VM or a sandbox (gVisor, Kata, Firecracker).
- not persistent: the writable layer is destroyed with the container. state -> volumes.
- not "one process forever": it's whatever PID 1 runs; when PID 1 exits, the container stops.
\`\`\`

**On macOS / Windows there is a hidden Linux VM** (Docker Desktop / colima / WSL2) —
containers are a Linux-kernel feature, so a Linux kernel must exist somewhere.`,

    simpleHi: `**Ek CONTAINER = ek process + machine ka ek restricted VIEW. Ek VM nahi.**
\`\`\`
  VM: app + libs + GUEST KERNEL + virtual hardware / hypervisor / HOST kernel
      boot ~seconds, ~GBs RAM, strong isolation (apna kernel)
  CONTAINER: app + libs  (HOST kernel use karता hai) + namespaces + cgroups
      start ~milliseconds, ~MBs, shared kernel = weaker isolation
\`\`\`

**TEEN LINUX KERNEL FEATURES saara kaam karते hain:**
\`\`\`
NAMESPACES  ek process ko ek global resource ka ek PRIVATE view dete hain:
  mnt (apne filesystem mounts — aise ise ek alag "/" milता hai = image) · pid (apna process tree,
  main process PID 1) · net (apna network stack, ports, localhost) · uts (apna hostname) ·
  ipc (apni shared-memory) · user (container root ko ek unprivileged host UID par map karो) · cgroup

CGROUPS  resource use ko LIMIT aur ACCOUNT karते hain:
  cpu · memory (limit + OOM kill) · pids (max) · io · devices

CAPABILITIES + seccomp + AppArmor/SELinux  wo privileges DROP karते hain jo process ko nahi chahिए
\`\`\`

**IMAGE vs CONTAINER vs REGISTRY:**
\`\`\`
IMAGE      ek read-only, layered filesystem snapshot + metadata. immutable. ek content digest
           (sha256:...) se identified. ek class ki tarah.
CONTAINER  ek image ka ek running (ya stopped) instance: image ke layers + upar ek thin writable
           layer + namespaces/cgroups. ek object ki tarah.
REGISTRY   ek server jo images ko name:tag / digest se store aur serve karता hai
           (Docker Hub, GHCR, ECR). 'docker push' / 'docker pull'.
\`\`\`

**Ek container jo NAHI hai:**
\`\`\`
- ek VM nahi: koi guest kernel nahi, ~0 overhead, host kernel share karता hai
- ek VM jitni strong security boundary nahi: kernel exploit -> escape. hostile multi-tenant
  ke liye ek VM ya sandbox (gVisor, Kata, Firecracker) use karो.
- persistent nahi: writable layer container ke saath destroy hoती hai. state -> volumes.
- "hamesha ek process" nahi: ye jo bhi PID 1 run karता hai; PID 1 exit -> container stops.
\`\`\`

**macOS / Windows par ek hidden Linux VM hai** (Docker Desktop / WSL2) — containers ek
Linux-kernel feature hain, to ek Linux kernel kahin exist karना chahिए.`,

    content: `## A container is a process

When you run a container, no machine boots. The container runtime (\`containerd\` / \`runc\`, or CRI-O, or Podman) starts an **ordinary Linux process** on the host and, before that process runs your program, wraps it in a set of kernel features that restrict what it can see and use. From the host's point of view it is just a process in \`ps\`. From the process's own point of view it has a whole machine to itself.

Three groups of kernel features do this.

### Namespaces — a private view of a global resource

A namespace takes something the kernel normally presents as one global thing and gives a process its own isolated instance of it. The important ones:

- **Mount (\`mnt\`)** — the process gets its own set of filesystem mounts. This is how a container has a *different root filesystem* from the host: the runtime mounts the image's layers as \`/\` for the container. Everything the process sees under \`/\` is the image, not the host.
- **PID** — the process gets its own process-number space. The container's main process is **PID 1**, and it cannot see any process outside its namespace. \`ps\` inside the container lists only the container's processes.
- **Network (\`net\`)** — its own network stack: its own interfaces, IP address, routing table, port numbers, and \`localhost\`. A port "inside" the container is not a port on the host unless you publish it.
- **UTS** — its own hostname and domain name.
- **IPC** — its own System V IPC / POSIX message queues and shared memory.
- **User (\`user\`)** — maps user and group IDs between the container and the host, so that **UID 0 (root) inside the container maps to an unprivileged UID on the host**. This is the basis of rootless containers.
- **Cgroup** — its own view of the cgroup tree.

A container is typically a process running in a fresh instance of *all* of these at once.

### Cgroups — limit and account resource usage

**Control groups** put a process (and its children) into a group whose total resource consumption the kernel meters and caps:

- **CPU** — a share (relative weight when contended) and/or a hard quota (e.g. "40ms of CPU per 100ms period" = 0.4 cores).
- **Memory** — a hard limit; exceeding it triggers the kernel **OOM killer** against processes in that cgroup (this is why a container "just dies" with exit code 137 = 128 + SIGKILL(9)).
- **PIDs** — a maximum number of processes, to contain fork bombs.
- **IO** — read/write bandwidth and IOPS limits per block device.
- **Devices** — which device nodes the group may access.

Cgroups are also how tools report per-container CPU and memory usage.

### Capabilities, seccomp, LSMs — drop privilege

Beyond isolation, a container runtime **removes privileges the workload does not need**:

- **Linux capabilities** — root's powers are split into ~40 capabilities (bind low ports, change file ownership, load kernel modules, set the system clock, …). A container gets a small default subset; the dangerous ones are dropped.
- **seccomp** — a syscall filter; the default profile blocks ~44 of the ~350 syscalls (obscure or dangerous ones).
- **AppArmor / SELinux** — mandatory access control profiles further restricting file and capability access.

## Container versus virtual machine

| | Virtual machine | Container |
|---|---|---|
| Isolation unit | a full virtual computer | a group of namespaced, cgrouped processes |
| Kernel | its own **guest kernel** | **shares the host kernel** |
| Hardware | virtualised (CPU, disk, NIC) | none — direct syscalls to the host kernel |
| Boot / start | seconds to a minute | milliseconds |
| Memory overhead | hundreds of MB to GB per VM | kilobytes to a few MB |
| Image size | GB (a whole OS) | MB (just the app + its libs) |
| Density on a host | tens | hundreds to thousands |
| Isolation strength | strong — a separate kernel and hardware boundary | weaker — one kernel bug can breach it |

A container is not a lightweight VM; it is a different mechanism. There is no emulation and no second kernel, which is why it is so cheap, and also why the isolation is only as strong as the host kernel. For workloads you do not trust — running arbitrary user-submitted code, hard multi-tenancy — you use a VM per tenant, or a sandboxed runtime that puts a thin kernel or a syscall interceptor back in the path: **gVisor** (a user-space kernel), **Kata Containers** / **Firecracker** (a micro-VM per container).

## Image, container, registry

- An **image** is an immutable, read-only bundle: a stack of filesystem **layers** plus a JSON **config** (the default command, environment variables, working directory, exposed ports, the user to run as). It is identified by a **content digest** — \`sha256:…\` computed over its manifest — and usually also by human tags like \`nginx:1.27\`. Think of it as a class.
- A **container** is a running or stopped **instance** of an image: the image's read-only layers, plus a **thin writable layer** on top for any changes the process makes, plus the namespaces and cgroups. Think of it as an object. Many containers can run from one image, each with its own writable layer.
- A **registry** is a server that stores images and serves them by name and tag or digest: Docker Hub, GitHub Container Registry (GHCR), Amazon ECR, Google Artifact Registry, or a self-hosted one like Harbor. \`docker pull nginx:1.27\` fetches the layers; \`docker push myapp:1.4.0\` uploads them.

## What a container is not

- **Not a VM** — no guest kernel, no hardware emulation, near-zero overhead, shares the host kernel.
- **Not persistent** — the writable layer is deleted when the container is removed. Anything that must survive a restart goes in a **volume** (Module 6) — a directory bind-mounted from the host or a managed volume — not in the container's filesystem.
- **Not multi-process by nature** — a container runs whatever its **PID 1** runs. When PID 1 exits, the container stops. The convention is one main process per container; running several needs a supervisor as PID 1, which is usually a sign the workloads should be separate containers.
- **Not a strong security boundary** by VM standards — treat container isolation as defence in depth, not as a wall you would put a hostile tenant behind.

## On macOS and Windows

Containers are a **Linux kernel** feature. On macOS and Windows, Docker Desktop (or Colima, Rancher Desktop, Podman machine, WSL2) runs a **lightweight Linux VM**, and your containers run inside *that*. The \`docker\` CLI on your Mac talks to the Docker daemon in the VM. This is why file-sharing performance between the host and containers is a recurring concern on those platforms, and why "it works on my Mac" and "it works in CI on Linux" can still differ.`,

    contentHi: `## Ek container ek process hai

Jab aap ek container run karते ho, koi machine boot nahi hoती. Container runtime (\`containerd\` / \`runc\`) host par ek **ordinary Linux process** start karता hai aur, us process ke aapका program run karने se pehle, ise kernel features ke ek set mein wrap karता hai jo restrict karते hain ki ye kya dekh aur use kar sakта hai.

**Namespaces — ek global resource ka ek private view.** **Mount** (apna root filesystem — image ki layers \`/\` ke roop mein mounted); **PID** (apna process-number space, main process **PID 1**); **Network** (apna network stack, interfaces, ports, \`localhost\`); **UTS** (apna hostname); **IPC**; **User** (container root ko ek unprivileged host UID par map karता hai); **Cgroup**.

**Cgroups — resource use limit aur account karते hain.** **CPU** (ek share aur/ya ek hard quota); **Memory** (ek hard limit; exceed karना kernel **OOM killer** trigger karता hai — exit code 137); **PIDs** (ek maximum); **IO**; **Devices**.

**Capabilities, seccomp, LSMs — privilege drop karते hain.** Root ke powers ~40 capabilities mein split hain; ek container ek small default subset paता hai. **seccomp** ek syscall filter hai. **AppArmor / SELinux** mandatory access control profiles hain.

## Container versus virtual machine

| | Virtual machine | Container |
|---|---|---|
| Kernel | apna **guest kernel** | **host kernel share karता hai** |
| Hardware | virtualised | koi nahi — host kernel ko direct syscalls |
| Start | seconds | milliseconds |
| Overhead | sौ MB se GB | KB se kुछ MB |
| Isolation | strong | weaker — ek kernel bug ise breach kar sakта hai |

Ek container ek lightweight VM nahi hai; ye ek alag mechanism hai. Jin workloads par aap trust nahi karते, aap per tenant ek VM use karते ho, ya ek sandboxed runtime: **gVisor**, **Kata Containers** / **Firecracker**.

## Image, container, registry

- Ek **image** ek immutable, read-only bundle hai: filesystem **layers** ka ek stack plus ek JSON **config**. Ek **content digest** (\`sha256:…\`) se identified. Ek class ki tarah.
- Ek **container** ek image ka ek running/stopped **instance** hai: image ke read-only layers, plus upar ek **thin writable layer**, plus namespaces aur cgroups. Ek object ki tarah.
- Ek **registry** ek server hai jo images ko name aur tag/digest se store aur serve karता hai.

## Ek container jo nahi hai

- **Ek VM nahi** — koi guest kernel nahi, near-zero overhead.
- **Persistent nahi** — writable layer container remove hone par deleted. Jo survive karना chahिए wo ek **volume** mein jाता hai.
- **Nature se multi-process nahi** — ek container jo bhi iska **PID 1** run karता hai wo run karта hai. PID 1 exit -> container stops.
- **Ek strong security boundary nahi** VM standards se.

## macOS aur Windows par

Containers ek **Linux kernel** feature hain. macOS aur Windows par, Docker Desktop ek **lightweight Linux VM** run karता hai, aur aapke containers *us* ke andar run karते hain.`,

    examples: [
      {
        title: 'A container is a host process with a private view',
        titleHi: 'Ek container ek host process hai ek private view ke saath',
        code: `# VERIFY
exec 2>&1
# run a container that just sleeps, then look at it from BOTH sides
docker run -d --name demo --rm alpine:3.20 sleep 300 >/dev/null

echo "--- inside: its main process is PID 1 ---"
docker exec demo sh -c 'ps -o pid=,comm= | tr -s " " | sed "s/^ //"' | grep sleep
docker exec demo sh -c 'echo "root fs (from the image): $(ls / | tr "\\n" " ")"'

echo "--- from the host: the SAME program is an ordinary process ---"
hp=$(docker inspect -f '{{.State.Pid}}' demo)
[ "$hp" -gt 1 ] && echo "host PID is an ordinary number > 1 (not 1)"

echo "--- the OS files come from the image; the kernel is the host's ---"
docker exec demo grep PRETTY_NAME /etc/os-release

docker stop demo >/dev/null 2>&1 || true`,
        output: `--- inside: its main process is PID 1 ---
1 sleep
root fs (from the image): bin dev etc home lib media mnt opt proc root run sbin srv sys tmp usr var
--- from the host: the SAME program is an ordinary process ---
host PID is an ordinary number > 1 (not 1)
--- the OS files come from the image; the kernel is the host's ---
PRETTY_NAME="Alpine Linux v3.20"`,
        explain: 'The container runs a single trivial command, and looking at it from inside and outside makes the mechanism visible. Inside, the process list shows only one process, the sleep command, numbered as PID 1 — the PID namespace gives the container its own process-number space starting at one, and hides every process outside it. The hostname is the container id because the UTS namespace gave it its own hostname. The root directory contains a complete Linux userland — bin, etc, usr, var and so on — none of which is the host\'s: the mount namespace has the image\'s layers mounted as this process\'s root filesystem, so its view of the entire filesystem is the image. From the host, the very same running program is an ordinary process with a normal host PID, and if you inspect it with the host\'s process tools it is simply a sleep command among all the others; there is no virtual machine, no second kernel, just one process the kernel has placed in a set of private namespaces and a resource-capped cgroup. Reading the operating-system release file inside the container shows Alpine even if the host is Ubuntu, because that file comes from the image, while the kernel answering every system call is the host\'s.',
        explainHi: 'Container ek single trivial command run karता hai, aur ise andar aur bahar se dekhना mechanism ko visible banаता hai. Andar, process list sirf ek process dikhती hai, sleep command, PID 1 ke roop mein numbered — PID namespace container ko iska apna process-number space deта hai jo ek se shuru hoता hai, aur iske bahar har process chhupाता hai. Hostname container id hai kyunki UTS namespace ne ise apna hostname diya. Root directory ek complete Linux userland contain karती hai — inmें se koi bhi host ka nahi hai: mount namespace ne image ki layers ko is process ki root filesystem ke roop mein mounted kiya. Host se, wahi running program ek ordinary process hai ek normal host PID ke saath. Container ke andar OS release file Alpine dikhती hai chahे host Ubuntu ho, kyunki wo file image se aati hai, jabki har system call ka answer deने wala kernel host ka hai.',
      },
      {
        title: 'A memory cgroup limit kills the container (exit 137)',
        titleHi: 'Ek memory cgroup limit container ko kill karta hai (exit 137)',
        code: `# VERIFY
exec 2>&1
# cap the container at 32 MiB, then have PID 1 try to allocate ~200 MB
echo "memory limit seen inside the container:"
docker run --rm --memory=32m --memory-swap=32m alpine:3.20 cat /sys/fs/cgroup/memory.max
echo "now allocate ~200MB against that 32MB cap:"
docker run --rm --memory=32m --memory-swap=32m python:3.12-alpine \\
  python -c 'x = bytearray(200 * 1024 * 1024)' 2>/dev/null
echo "container exit code: $?"`,
        output: `memory limit seen inside the container:
33554432
now allocate ~200MB against that 32MB cap:
container exit code: 137`,
        explain: 'The container is started with a memory limit of thirty-two mebibytes, which the runtime enforces by placing the container\'s processes in a cgroup with that cap. Read from inside the container, the cgroup memory-max file reports exactly that number of bytes, because the container sees its own cgroup view. The command then tries to allocate a two-hundred-megabyte buffer in the main process. Because the cgroup cannot grow past its limit and swap is also capped, the kernel\'s out-of-memory killer selects a process in that cgroup and terminates it with an uncatchable kill signal, and since the process being killed is the container\'s PID 1 the whole container goes down. The exit code is one hundred thirty-seven, which is the convention for a process killed by a signal: one hundred twenty-eight plus the signal number, and the kill signal is nine, so one hundred thirty-seven. Seeing exit code one hundred thirty-seven from a container is almost always this: the workload exceeded its memory limit and was killed by the kernel, not a bug in the application\'s own error handling. The fix is either to raise the limit or to reduce the workload\'s memory use.',
        explainHi: 'Container ek memory limit battis mebibytes ke saath start hoता hai, jise runtime container ke processes ko us cap wale ek cgroup mein rakhकar enforce karता hai. Container ke andar se read kiya, cgroup memory-max file exactly wo bytes ki sankhya report karती hai. Command phir do sौ million bytes memory ke through pull karने ki koshish karता hai. Kyunki cgroup apni limit se aage nahi badh sakта aur swap bhi capped hai, kernel ka out-of-memory killer us cgroup mein ek process select karता hai aur ise ek uncatchable kill signal se terminate karता hai. Exit code ek sौ saड़तीस hai, jo ek signal se killed ek process ki convention hai: ek sौ atthaइस plus signal number, aur kill signal nau hai. Ek container se exit code 137 dekhना lagभag hamesha yahi hai: workload ne apni memory limit exceed ki aur kernel dwara killed hua.',
      },
    ],

    mistakes: [
      {
        wrong: `# thinking a container is a small VM and treating it like one
# - SSHing into a running container to "fix" it and expecting the fix to persist
#   -> the writable layer is thrown away when the container is recreated
# - running systemd + sshd + cron + the app all in one container as PID 1
#   -> now you're maintaining a tiny distro; the app's crash doesn't stop the container
# - assuming container isolation is as strong as a VM and running untrusted code in it`,
        right: `# a container is a PROCESS with a restricted view. treat it as immutable + disposable:
# - fix the IMAGE (edit the Dockerfile, rebuild, redeploy) — never patch a running container
# - one main process per container; PID 1 IS the app; if PID 1 exits, the container stops
# - persistent state -> a VOLUME, not the container filesystem
# - untrusted / hostile workloads -> a VM per tenant, or gVisor / Kata / Firecracker`,
        why: 'A container shares the host kernel and is built from an immutable image plus a thin writable layer that exists only for the lifetime of that specific container instance, so the mental model of a small long-lived virtual machine leads to several concrete mistakes. Changes made by connecting to a running container and editing files land in the disposable writable layer and vanish the moment the container is replaced during the next deploy or restart, so fixes must be made to the image and rolled out, never applied in place. Running an init system and several daemons inside one container recreates a miniature operating system that someone has to keep patched and reason about, and it breaks the useful property that the container\'s lifecycle tracks the application\'s: with the app as one child of an init process, the app can crash while the container keeps running and the orchestrator sees nothing wrong. And because the isolation rests entirely on the correctness of the shared host kernel, a container is not a sufficient boundary for code you do not trust; that requires either a real virtual machine per tenant or a sandboxed runtime that reintroduces a kernel boundary.',
        whyHi: 'Ek container host kernel share karता hai aur ek immutable image plus ek thin writable layer se banा hai jo sirf us specific container instance ke lifetime ke liye exist karता hai, to ek chhoटी long-lived virtual machine ka mental model kई concrete mistakes ki taraf le jата hai. Ek running container se connect karके files edit karके kiye gaye changes disposable writable layer mein land karते hain aur us moment vanish ho jाते hain jab container agle deploy ke dauран replace hoता hai, to fixes image mein kiye jाने chahिए aur rolled out. Ek container ke andar ek init system aur kई daemons run karना ek miniature operating system recreate karता hai jise kisi ko patched rakhना padता hai, aur ye us useful property ko todता hai ki container ka lifecycle application ka track karता hai. Aur kyunki isolation poori tarah shared host kernel ki correctness par rests karता hai, ek container un code ke liye ek sufficient boundary nahi hai jispar aap trust nahi karते.',
      },
      {
        wrong: `# not setting resource limits, then blaming "Docker" when one container
# starves the host
$ docker run -d myapp        # no --memory, no --cpus
# -> a memory leak in myapp grows until it consumes all host RAM; the host OOM
//    killer starts killing OTHER containers and host processes semi-randomly.
//    "Docker crashed the box" — no, an unbounded cgroup did.`,
        right: `# always set limits (Compose 'deploy.resources', k8s 'requests/limits', or flags):
$ docker run -d --memory=512m --cpus=1.0 --pids-limit=200 myapp
# now a leak in myapp is contained: myapp's cgroup hits 512m -> the kernel OOM-kills
# a process IN THAT CGROUP (exit 137), the host and other containers are unaffected.
# size limits from real measurements + headroom, and alert on approaching them.`,
        why: 'Without an explicit limit, a container\'s cgroup has no cap, so the container can consume as much memory, CPU, or process slots as the host has. A fault in one workload — a memory leak, a runaway loop, a fork storm — then grows until it exhausts a host-wide resource, at which point the kernel\'s protective mechanisms act at the host level: the out-of-memory killer chooses victims across all processes on the machine by its own heuristics, so it may kill unrelated containers or host services, and the failure looks like the whole machine misbehaving rather than one workload. Setting a memory and CPU limit, and ideally a process limit, confines the consequences of such a fault to the offending container: its cgroup reaches its own cap first, the kernel kills a process within that cgroup, and everything else on the host continues normally. The limits should be derived from measured usage plus headroom, and monitoring should alert when a container trends toward its limit so the underlying problem can be addressed before the kill.',
        whyHi: 'Ek explicit limit ke bina, ek container ke cgroup ka koi cap nahi hai, to container utna memory, CPU, ya process slots consume kar sakта hai jitna host ke paas hai. Ek workload mein ek fault — ek memory leak, ek runaway loop, ek fork storm — phir badhता hai jab tak ye ek host-wide resource exhaust nahi karता, jis point par kernel ke protective mechanisms host level par act karते hain: out-of-memory killer machine par saare processes ke across victims choose karता hai apni heuristics se, to ye unrelated containers ya host services ko kill kar sakта hai. Ek memory aur CPU limit set karना aisे fault ke consequences ko offending container tak confine karता hai: iska cgroup pehle apna cap reach karता hai, kernel us cgroup ke andar ek process kill karता hai, aur host par baaki sab кुछ normally continue karता hai.',
      },
      {
        wrong: `# expecting "it runs in my container on my Mac" to mean "it runs on the Linux host"
# - the image was built FROM node:20 on an Apple Silicon Mac -> it's an arm64 image
#   -> deployed to an amd64 Linux node: "exec format error" (or slow qemu emulation)
# - the app calls a Linux syscall that Docker Desktop's VM kernel has but the
#   old prod kernel doesn't -> works locally, fails in prod`,
        right: `# be explicit about the target platform, and match prod's kernel/arch:
$ docker build --platform=linux/amd64 -t myapp:1.4 .          # or buildx multi-arch
$ docker buildx build --platform=linux/amd64,linux/arm64 --push -t myapp:1.4 .
# run the same image CI runs; pin the base image by digest; test on a Linux runner
# that matches prod, not only on the Mac's Docker Desktop VM.`,
        why: 'On macOS and Windows a container does not run on the host operating system; it runs inside a Linux virtual machine that the container tooling manages, so "it works in my container locally" means it works against that VM\'s kernel and on that VM\'s CPU architecture. Two gaps follow. First, architecture: an image built on an Apple Silicon machine defaults to the arm64 architecture, and deploying it to an x86-64 Linux server either fails outright with an execution-format error or runs under slow emulation, so the build must explicitly target the production architecture or produce a multi-architecture image. Second, kernel: the local Linux VM usually runs a recent kernel, and code that depends on a newer system call or kernel feature will work locally and fail on an older production kernel. Closing the gap means building for the production platform explicitly, pinning the base image so the same one is used everywhere, and validating on a Linux environment that matches production rather than trusting the local VM.',
        whyHi: 'macOS aur Windows par ek container host operating system par run nahi karता; ye ek Linux virtual machine ke andar run karता hai jise container tooling manage karता hai, to "ye locally mere container mein kaam karता hai" ka matlab ye us VM ke kernel ke against aur us VM ke CPU architecture par kaam karता hai. Do gaps follow karते hain. Pehla, architecture: ek Apple Silicon machine par banी ek image arm64 architecture default karती hai, aur ise ek x86-64 Linux server par deploy karना ya to ek execution-format error se outright fail hoता hai ya slow emulation ke under run karता hai. Doosra, kernel: local Linux VM usually ek recent kernel run karता hai, aur ek newer system call par depend karता code locally kaam karega aur ek older production kernel par fail hoga. Gap band karना matlab production platform ke liye explicitly build karना.',
      },
    ],

    realWorld: [
      {
        en: '**"Docker keeps crashing our build server"** turned out to be one CI job\'s container with no memory limit leaking until the host OOM-killer culled unrelated jobs. Adding `--memory` / `--cpus` to every job container made failures local and legible (exit 137 on the leaking job only).',
        hi: '**"Docker hamare build server ko crash karता rehता hai"** ek CI job ke container ka bina memory limit ke leak karना nikла jab tak host OOM-killer unrelated jobs ko cull nahi karता.',
      },
      {
        en: '**An "exec format error" in production** every deploy from one engineer\'s laptop — they built on an M2 Mac (arm64) and prod was amd64. Switched the team to `docker buildx` multi-arch builds in CI; laptop builds became local-only.',
        hi: '**Production mein ek "exec format error"** ek engineer ke laptop se har deploy — unhone ek M2 Mac (arm64) par build kiya aur prod amd64 tha.',
      },
      {
        en: '**A multi-tenant platform running customer code in plain containers had an escape** via a kernel bug. Migrated the untrusted tier to gVisor (then Firecracker micro-VMs) — same container images, a real kernel boundary underneath.',
        hi: '**Ek multi-tenant platform jo customer code ko plain containers mein run karता tha ek escape hua** ek kernel bug ke through. Untrusted tier ko gVisor par migrate kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'How is a container different from a virtual machine, and what kernel features make containers work?',
        qHi: 'Ek container ek virtual machine se kaise alag hai, aur kaunसे kernel features containers ko kaam karवाते hain?',
        a: 'A virtual machine is a full virtual computer: it runs its own guest kernel on virtualised hardware provided by a hypervisor, so it boots in seconds, costs hundreds of megabytes to gigabytes of memory, and is isolated by a hardware and kernel boundary. A container is not a computer at all; it is one or more ordinary processes on the host, running directly against the host kernel, that the runtime has wrapped in kernel features restricting what they can see and use. There is no guest kernel and no emulation, so a container starts in milliseconds, adds almost no memory overhead, and packs hundreds to a host. The trade-off is that isolation depends entirely on the host kernel being correct, so it is weaker than a VM\'s. Three groups of kernel features do the work. Namespaces give a process a private instance of something the kernel normally shares: a mount namespace for its own root filesystem, which is how it gets the image\'s files as its filesystem; a PID namespace so its main process is PID 1 and it cannot see host processes; a network namespace with its own interfaces and ports; plus UTS, IPC, user, and cgroup namespaces. Cgroups meter and cap the group\'s resource use: a CPU quota, a memory limit whose breach triggers the OOM killer, a process-count limit, IO bandwidth. And capabilities, seccomp, and an LSM profile drop privileges and restrict system calls the workload does not need.',
        aHi: 'Ek virtual machine ek full virtual computer hai: ye apna guest kernel virtualised hardware par run karता hai, to ye seconds mein boot hoता hai, sौ MB se GB memory cost karता hai. Ek container ek computer bilkul nahi hai; ye host par ek ya zyada ordinary processes hain, host kernel ke against directly run karते hue, jinhe runtime ne kernel features mein wrap kiya hai. Koi guest kernel nahi aur koi emulation nahi, to ek container milliseconds mein start hoता hai. Trade-off ye hai ki isolation poori tarah host kernel ke correct hone par depend karता hai. Teen groups of kernel features kaam karते hain. Namespaces ek process ko kुछ ka ek private instance dete hain: ek mount namespace apni root filesystem ke liye; ek PID namespace taki iska main process PID 1 hai; ek network namespace apne interfaces ke saath; plus UTS, IPC, user, cgroup. Cgroups group ke resource use ko meter aur cap karते hain. Aur capabilities, seccomp, aur ek LSM profile privileges drop karते hain.',
      },
      {
        q: 'What is the difference between an image, a container, and a registry?',
        qHi: 'Ek image, ek container, aur ek registry ke beech kya difference hai?',
        a: 'An image is an immutable, read-only artifact: a stack of filesystem layers plus a configuration blob that records the default command, environment variables, working directory, exposed ports, and the user to run as. It is identified by a content digest computed over its manifest, and usually also carries human-readable tags. It is the template. A container is a running or stopped instance created from an image: it takes the image\'s read-only layers, adds a thin writable layer on top for any changes the process makes during its life, and wraps the whole thing in the namespaces and cgroups that isolate and limit it. Many containers can be created from a single image, each with its own independent writable layer, and that writable layer is discarded when the container is removed, which is why containers are treated as disposable and persistent data goes into volumes instead. A registry is a server that stores images and serves them by repository name and tag or by digest — Docker Hub, GitHub Container Registry, cloud registries like ECR, or self-hosted ones like Harbor. Pushing uploads an image\'s layers and manifest to the registry; pulling downloads them. Layers are content-addressed, so a layer already present is not re-uploaded or re-downloaded, which is why images that share a base are cheap to distribute.',
        aHi: 'Ek image ek immutable, read-only artifact hai: filesystem layers ka ek stack plus ek configuration blob jo default command, environment variables, working directory, exposed ports, aur run karने ke liye user record karता hai. Ek content digest se identified. Ye template hai. Ek container ek image se banाya gaya ek running/stopped instance hai: ye image ke read-only layers leта hai, upar ek thin writable layer add karता hai, aur poori cheez ko namespaces aur cgroups mein wrap karता hai. Ek single image se kई containers banाye ja sakते hain, har ek apni independent writable layer ke saath, aur wo writable layer container remove hone par discarded hoती hai. Ek registry ek server hai jo images store karता hai aur unhe repository name aur tag ya digest se serve karта hai. Layers content-addressed hain, to ek layer jo already present hai re-upload nahi hoती.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, draw the VM vs container stack, and list the three groups of kernel features that make a container, with one concrete thing each provides.',
        taskHi: 'Ek comment mein, VM vs container stack banाओ.',
        hint: 'VM: app / libs / GUEST KERNEL / virtual hardware / hypervisor / host kernel+hw. Container: app / libs → (uses the HOST kernel directly) + namespaces + cgroups → host kernel+hw. Three groups: (1) NAMESPACES — a private view of a global resource: mnt (own root fs = the image), pid (own process tree, main = PID 1), net (own interfaces/ports/localhost), uts (own hostname), ipc, user (map container root → unprivileged host UID), cgroup. (2) CGROUPS — limit + account: cpu quota, memory limit (breach → OOM kill, exit 137), pids max, io bandwidth. (3) CAPABILITIES + seccomp + AppArmor/SELinux — drop privileges/syscalls the workload doesn\'t need.',
        hintHi: 'VM: app / libs / GUEST KERNEL / virtual hardware / hypervisor. Container: app / libs → (HOST kernel directly) + namespaces + cgroups. Teen groups: (1) NAMESPACES — mnt (own root fs = image), pid (PID 1), net (own ports/localhost), uts, ipc, user, cgroup. (2) CGROUPS — cpu quota, memory limit (breach → OOM kill, exit 137), pids, io. (3) CAPABILITIES + seccomp + AppArmor/SELinux.',
      },
      {
        task: 'In a comment, explain what exit code 137 from a container almost always means, why it happens, and the fix. Then explain why patching a running container never persists.',
        taskHi: 'Ek comment mein, ek container se exit code 137 ka lagभag hamesha kya matlab hai samjhाओ.',
        hint: '137 = 128 + 9 (SIGKILL). Almost always: the container hit its memory cgroup limit (`--memory` / k8s limit), so the kernel OOM-killer terminated a process in that cgroup with an uncatchable signal — not an app bug. Fix: raise the limit, or reduce the workload\'s memory use; size limits from measured usage + headroom and alert before the kill. Patching a running container never persists because a container = the image\'s read-only layers + a THIN WRITABLE LAYER that exists only for that container instance and is discarded when the container is removed/recreated (every deploy, restart, node move). Fixes go in the IMAGE (edit Dockerfile → rebuild → redeploy).',
        hintHi: '137 = 128 + 9 (SIGKILL). Lagभag hamesha: container ne apni memory cgroup limit hit ki, to kernel OOM-killer ne us cgroup mein ek process ko ek uncatchable signal se terminate kiya — ek app bug nahi. Fix: limit raise karो, ya memory use kम karो. Ek running container patch karना kabhi persist nahi karता kyunki container = image ke read-only layers + ek THIN WRITABLE LAYER jo sirf us instance ke liye hai aur remove/recreate par discarded. Fixes IMAGE mein jाते hain.',
      },
      {
        task: 'In a comment, explain why "it works in my container on my Mac" does not guarantee it works on a Linux host, covering both the architecture gap and the kernel gap, and how to close each.',
        taskHi: 'Ek comment mein, samjhाओ kyun "mere Mac par mere container mein kaam karता hai" ek Linux host par kaam karने ki guarantee nahi deता.',
        hint: 'On macOS/Windows containers run inside a Linux VM (Docker Desktop / WSL2 / colima) — so "works locally" = works against THAT VM\'s kernel + CPU arch. ARCHITECTURE gap: a build on Apple Silicon defaults to arm64; deployed to an amd64 Linux node → "exec format error" or slow qemu emulation. Close it: `docker build --platform=linux/amd64` or `docker buildx build --platform=linux/amd64,linux/arm64 --push`. KERNEL gap: the local VM runs a recent kernel; code using a newer syscall/feature works locally, fails on an older prod kernel. Close it: pin the base image by digest, run the exact image CI runs, and validate on a Linux runner that matches prod — not only on the Mac.',
        hintHi: 'macOS/Windows par containers ek Linux VM ke andar run karते hain — to "locally works" = us VM ke kernel + CPU arch ke against. ARCHITECTURE gap: Apple Silicon par ek build arm64 default karता hai; amd64 Linux node par → "exec format error". Close: `docker build --platform=linux/amd64` ya `buildx --platform=...`. KERNEL gap: local VM ek recent kernel run karता hai; ek newer syscall use karता code locally works, older prod kernel par fails. Close: base image ko digest se pin karो, exact CI image run karो, prod-matching Linux runner par validate karो.',
      },
    ],

    keyTakeaways: [
      'A CONTAINER = one or more ordinary HOST PROCESSES with a restricted VIEW of the machine, running DIRECTLY against the HOST KERNEL — NOT a VM (no guest kernel, no hardware emulation, ~0 overhead, starts in ms, packs hundreds per host). The trade-off: isolation is only as strong as the host kernel, so it\'s WEAKER than a VM. On macOS/Windows there is a hidden Linux VM (Docker Desktop / WSL2) because containers are a Linux-kernel feature.',
      'THREE GROUPS OF KERNEL FEATURES make a container: (1) NAMESPACES — a private view of a global resource: MOUNT (its own root fs — this is how the image becomes its `/`), PID (its main process is PID 1, can\'t see host processes), NET (own interfaces/ports/localhost — a container port isn\'t a host port unless published), UTS (own hostname), IPC, USER (map container root → an unprivileged host UID — rootless), CGROUP. (2) CGROUPS — meter + CAP resource use: CPU (share + quota), MEMORY (hard limit; breach → kernel OOM killer → exit 137), PIDS (max), IO, devices. (3) CAPABILITIES + seccomp + AppArmor/SELinux — drop root powers and block syscalls the workload doesn\'t need.',
      'IMAGE vs CONTAINER vs REGISTRY: an IMAGE is an immutable read-only stack of filesystem LAYERS + a JSON config (default command, env, workdir, ports, user), identified by a content DIGEST (`sha256:…`) — the template/class. A CONTAINER is a running/stopped INSTANCE = the image\'s read-only layers + a THIN WRITABLE LAYER on top + namespaces/cgroups — the object; many containers per image, each writable layer independent and DISCARDED when the container is removed. A REGISTRY (Docker Hub, GHCR, ECR, Harbor) stores + serves images by name:tag / digest; `push`/`pull`; layers are content-addressed so shared layers transfer once.',
      'A container is NOT: a VM; a strong security boundary (kernel exploit → escape — for untrusted/hostile multi-tenant workloads use a VM per tenant or gVisor / Kata / Firecracker); PERSISTENT (the writable layer dies with the container — state goes in a VOLUME, never the container fs; NEVER patch a running container, fixes go in the IMAGE → rebuild → redeploy); "one process forever" (it runs whatever PID 1 runs — when PID 1 exits, the container STOPS; convention is one main process per container).',
      'EXIT CODE 137 from a container = 128 + 9 (SIGKILL), almost always the memory cgroup limit hit → the kernel OOM-killed a process in that cgroup (not an app bug) — raise the limit or cut memory use. ALWAYS set resource limits (`--memory` / `--cpus` / `--pids-limit`, or Compose `deploy.resources`, or k8s requests/limits) — an unbounded cgroup lets one leaking container exhaust host RAM and the HOST OOM-killer then culls unrelated containers. And match prod when building: `docker build --platform=linux/amd64` (or `buildx` multi-arch) — an arm64 image from an Apple Silicon Mac gives "exec format error" on an amd64 node; pin base images by digest and validate on a Linux runner that matches prod.',
    ],
    keyTakeawaysHi: [
      'Ek CONTAINER = machine ke ek restricted VIEW ke saath ek ya zyada ordinary HOST PROCESSES, HOST KERNEL ke against DIRECTLY run karते hue — ek VM NAHI (koi guest kernel nahi, ~0 overhead, ms mein start, per host sौ). Trade-off: isolation sirf host kernel jitna strong hai. macOS/Windows par ek hidden Linux VM hai kyunki containers ek Linux-kernel feature hain.',
      'TEEN GROUPS OF KERNEL FEATURES: (1) NAMESPACES — ek global resource ka private view: MOUNT (apni root fs — aise image iska `/` banता hai), PID (main process PID 1), NET (apne ports/localhost), UTS, IPC, USER (container root → unprivileged host UID), CGROUP. (2) CGROUPS — resource use meter + CAP: CPU, MEMORY (hard limit; breach → OOM killer → exit 137), PIDS, IO. (3) CAPABILITIES + seccomp + AppArmor/SELinux.',
      'IMAGE vs CONTAINER vs REGISTRY: ek IMAGE ek immutable read-only LAYERS ka stack + ek JSON config, ek content DIGEST se identified — template/class. Ek CONTAINER ek running/stopped INSTANCE = image ke read-only layers + ek THIN WRITABLE LAYER + namespaces/cgroups — object; per image kई containers, har writable layer independent aur remove hone par DISCARDED. Ek REGISTRY images ko name:tag / digest se store + serve karता hai; layers content-addressed.',
      'Ek container NAHI hai: ek VM; ek strong security boundary (kernel exploit → escape — untrusted multi-tenant ke liye per tenant ek VM ya gVisor / Kata / Firecracker); PERSISTENT (writable layer container ke saath marता hai — state ek VOLUME mein; ek running container KABHI patch mat karो, fixes IMAGE mein → rebuild → redeploy); "hamesha ek process" (ye jo PID 1 run karता hai; PID 1 exit → container STOPS).',
      'EXIT CODE 137 = 128 + 9 (SIGKILL), lagभag hamesha memory cgroup limit hit → kernel ne us cgroup mein ek process OOM-kill kiya (ek app bug nahi) — limit raise karो ya memory use kम karो. HAMESHA resource limits set karो (`--memory` / `--cpus` / `--pids-limit`) — ek unbounded cgroup ek leaking container ko host RAM exhaust karने deता hai aur HOST OOM-killer phir unrelated containers ko cull karता hai. Build karte samay prod match karो: `docker build --platform=linux/amd64` — ek Apple Silicon Mac se ek arm64 image ek amd64 node par "exec format error" deता hai.',
    ],
  },

  {
    slug: 'ops-the-image-and-its-layers',
    title: 'The Image & Its Layers',
    titleHi: 'Image Aur Iski Layers',
    description: 'An image is a stack of read-only layers, each the filesystem changes from one build step, each content-addressed and shared between images. A container adds one thin writable layer on top and the union filesystem merges them into a single view with copy-on-write.',
    descriptionHi: 'Ek image read-only layers ka ek stack hai, har ek ek build step se filesystem changes, har ek content-addressed aur images ke beech shared. Ek container upar ek thin writable layer add karता hai aur union filesystem unhe copy-on-write ke saath ek single view mein merge karता hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A stack of transparent sheets on an overhead projector.** Each sheet (layer) has only the marks that step added or erased. Lay them in order and the projected image is the combined result — that is the union filesystem. A new drawing that starts from the same first three sheets just reuses those exact sheets; you only draw the ones that differ (shared, content-addressed layers). When someone writes on the projected image, they cannot touch the fixed sheets underneath — a fresh blank sheet is placed on top and the writing goes there (the container\'s writable layer, copy-on-write). Reorder the lower sheets and every drawing built on them has to be redrawn from that point down — which is exactly why Dockerfile instruction order controls the build cache.',
      hi: '**Ek overhead projector par transparent sheets ka ek stack.** Har sheet (layer) par sirf wo marks hain jo us step ne add ya erase kiye. Unhe order mein lagाओ aur projected image combined result hai — wo union filesystem hai. Ek naya drawing jo same pehle teen sheets se shuru hoता hai bस un exact sheets ko reuse karता hai; aap sirf wo draw karते ho jo differ karती hain (shared, content-addressed layers). Jab koi projected image par likhता hai, wo neeche ki fixed sheets ko touch nahi kar sakта — ek fresh blank sheet upar rakhी jाती hai aur writing wahaan jाती hai (container ki writable layer, copy-on-write). Lower sheets ko reorder karो aur un par banी har drawing ko us point se neeche redraw karना padता hai.',
    },

    simple: `**AN IMAGE = an ordered stack of read-only LAYERS + a config JSON.**
\`\`\`
  ┌─────────────────────────────┐  layer 4  COPY . /app         (your source)
  ├─────────────────────────────┤  layer 3  RUN npm ci          (node_modules)
  ├─────────────────────────────┤  layer 2  COPY package*.json   (manifests)
  ├─────────────────────────────┤  layer 1  FROM node:20-slim    (the base, itself layers)
  └─────────────────────────────┘
  each layer = a tarball of the filesystem CHANGES that step made (added/modified/
  deleted files), stored + named by the sha256 of its content (content-addressed).
\`\`\`

**THE UNION / OVERLAY FILESYSTEM merges the stack into one view:**
\`\`\`
- higher layers WIN: a file in layer 4 shadows the same path in layer 1
- a deleted file is recorded as a "whiteout" marker in the upper layer (the bytes in
  the lower layer are STILL THERE — deleting a secret in a later RUN does NOT remove it)
- the merged result is what the process sees as "/"
\`\`\`

**COPY-ON-WRITE + the container's writable layer:**
\`\`\`
- all image layers are READ-ONLY and SHARED between every container from that image
- the container gets ONE thin writable layer on top
- read a file  -> served from whichever layer has it, no copy
- modify a file -> it is COPIED UP into the writable layer first, then changed there
- the writable layer (and all its changes) is DELETED when the container is removed
\`\`\`

**LAYER SHARING makes images cheap to store + transfer:**
\`\`\`
- 10 images all FROM node:20-slim  ->  the node:20-slim layers are stored ONCE on disk
- docker pull  -> only downloads layers you don't already have
- docker push  -> only uploads layers the registry doesn't already have
- change ONE line of source -> only the top layer(s) rebuild + re-transfer; the
  base + dependencies layers are reused from cache
\`\`\`

**INSPECT:**
\`\`\`
docker history <image>          layers, sizes, and the instruction that made each
docker image inspect <image>    the config: env, entrypoint, cmd, layers (diff_ids), digest
docker image ls                 sizes (SHARED layers are counted once on disk)
dive <image>  /  docker sbom    per-layer file changes / the software bill of materials
\`\`\`

**KEY CONSEQUENCES:**
\`\`\`
- image size ~= sum of layer sizes; a file added in one layer and deleted in the next
  still costs its bytes (both layers ship). clean up WITHIN the same RUN.
- secrets / build tokens in ANY layer are in the final image forever (even if "removed"
  later) -> use build secrets / multi-stage, never COPY a .env or ARG a token into a layer
- layer ORDER = cache efficiency (Lesson 3)
\`\`\``,

    simpleHi: `**EK IMAGE = read-only LAYERS ka ek ordered stack + ek config JSON.**
\`\`\`
  layer 4  COPY . /app         (aapका source)
  layer 3  RUN npm ci          (node_modules)
  layer 2  COPY package*.json   (manifests)
  layer 1  FROM node:20-slim    (base, khud layers)
  har layer = us step ne jo filesystem CHANGES kiye unka ek tarball, iske content
  ke sha256 se stored + named (content-addressed).
\`\`\`

**UNION / OVERLAY FILESYSTEM stack ko ek view mein merge karता hai:**
\`\`\`
- higher layers JEETTE hain: layer 4 mein ek file layer 1 mein same path ko shadow karती hai
- ek deleted file upper layer mein ek "whiteout" marker ke roop mein recorded (lower layer
  mein bytes ABHI BHI wahaan hain — ek later RUN mein ek secret delete karना ise REMOVE NAHI karता)
- merged result wo hai jo process "/" ke roop mein dekhता hai
\`\`\`

**COPY-ON-WRITE + container ki writable layer:**
\`\`\`
- saari image layers READ-ONLY aur us image ke har container ke beech SHARED
- container ko upar EK thin writable layer milती hai
- ek file read karो -> jismें hai us layer se served, koi copy nahi
- ek file modify karो -> ise pehle writable layer mein COPIED UP kiya jाता hai, phir wahaan changed
- writable layer (aur iske saare changes) container remove hone par DELETED
\`\`\`

**LAYER SHARING images ko store + transfer karना cheap banаता hai:**
\`\`\`
- 10 images sab FROM node:20-slim -> node:20-slim layers disk par EK BAAR stored
- docker pull -> sirf wo layers download karता hai jo aapke paas nahi hain
- docker push -> sirf wo layers upload karता hai jo registry ke paas nahi hain
- source ki EK line change karो -> sirf top layer(s) rebuild + re-transfer
\`\`\`

**INSPECT:**  \`docker history <image>\` · \`docker image inspect <image>\` · \`docker image ls\` · \`dive <image>\`

**KEY CONSEQUENCES:**
\`\`\`
- image size ~= layer sizes ka sum; ek layer mein add ki gayi aur agli mein delete ki gayi file
  abhi bhi apne bytes cost karती hai. same RUN ke ANDAR clean up karो.
- KISI bhi layer mein secrets / build tokens final image mein hamesha ke liye hain (chahे "removed")
  -> build secrets / multi-stage use karो, kabhi ek .env COPY ya ek token ARG mat karो
- layer ORDER = cache efficiency (Lesson 3)
\`\`\``,

    content: `## An image is a stack of layers

An image is not a single filesystem blob. It is an **ordered list of layers**, plus a JSON **config** object. Each layer is the set of **filesystem changes** — files added, files modified, files deleted — made by one step of the build. The first layer is the base image's content (which is itself a stack of layers), and each subsequent \`RUN\`, \`COPY\`, or \`ADD\` instruction in the Dockerfile produces one more layer on top.

Each layer is stored as a compressed archive and **named by the SHA-256 hash of its contents** — it is content-addressed. Two layers with byte-identical content are the same layer, stored once, no matter which images reference them.

The config records everything that is not filesystem: the default command and entrypoint, environment variables, working directory, exposed ports, the user to run as, and the ordered list of layer digests (\`diff_ids\`) that make up the image. The image's own **digest** is a hash over its manifest, which lists the config and the layers.

## The union filesystem

When a container starts, the runtime stacks the image's layers and presents them as a single directory tree using a **union (overlay) filesystem** — on Linux, \`overlayfs\`. The rules:

- **Upper layers shadow lower ones.** If \`/app/config.json\` exists in layer 2 and is replaced in layer 4, the process sees layer 4's version. Only the topmost occurrence of each path is visible.
- **Deletions are whiteouts.** Removing a file in a later layer does not remove the bytes from the earlier layer — it cannot, the earlier layer is immutable and shared. Instead the later layer records a special **whiteout** entry that hides the path in the merged view. **The deleted file's bytes still ship inside the image.**
- The merged tree is what the container process sees as \`/\`.

## Copy-on-write and the writable layer

All of the image's layers are **read-only** and are **shared** by every container started from that image. Each container gets exactly one additional layer: a **thin writable layer** on top.

- **Reading** a file: the union filesystem finds it in whichever layer has it and serves it directly. No copying.
- **Writing** to a file that lives in a read-only layer: the file is first **copied up** into the writable layer, and the modification is made to that copy. The original in the lower layer is untouched (and still there for other containers).
- **Creating** a new file: it goes straight into the writable layer.
- When the container is **removed**, its writable layer — and every change in it — is destroyed. This is why container filesystems are ephemeral and why persistent data must live in a **volume**.

Copy-on-write is why starting a container is nearly free regardless of image size: nothing is copied, the layers are just stacked.

## Layer sharing makes images cheap

Because layers are content-addressed and read-only:

- **On disk:** ten images all built \`FROM node:20-slim\` store the \`node:20-slim\` layers **once**. \`docker image ls\` shows each image's full size, but the actual disk usage is far less because of sharing — \`docker system df\` shows the real number.
- **On pull:** the client downloads only the layers it does not already have locally. Pulling a new tag of an image whose base you already have transfers just the changed layers.
- **On push:** the client uploads only the layers the registry does not already have. Pushing a rebuild where only your source changed uploads just the top layer.
- **On rebuild:** if an instruction and all its inputs are unchanged, its layer is taken from the **build cache** and not recomputed (Lesson 3). Changing one line of application source rebuilds only the layers from that \`COPY\` down.

## Inspecting an image

- \`docker history <image>\` — the layers from bottom to top, each with its size and the build instruction (often truncated) that created it. The fastest way to see where an image's size comes from.
- \`docker image inspect <image>\` — the full config: environment, entrypoint, command, working directory, the layer \`diff_ids\`, the image digest, architecture and OS.
- \`docker image ls\` / \`docker system df\` — sizes, with \`system df\` distinguishing shared from unique bytes.
- \`dive <image>\` — an interactive view of what each layer added, changed, or wasted.
- \`docker sbom\` / \`syft\` — the software bill of materials: every package in the image, for vulnerability scanning (Module 18).

## Consequences you must internalise

- **Image size is roughly the sum of the layer sizes.** A large file that is created in one layer and deleted in the next still costs its full size, because both layers are part of the image and both are shipped. To actually shrink an image you must add and remove within a **single \`RUN\`** (or use a multi-stage build, Lesson 4).
- **Anything written into any layer is permanent in that image.** A secret, a token, a private key, a \`.env\` file that is \`COPY\`d in and then deleted in a later step is still fully recoverable from the earlier layer by anyone who has the image. Build-time secrets must use \`--secret\` mounts or a multi-stage build where the secret never lands in the final stage — never \`COPY\` or \`ARG\` a credential into a layer.
- **Layer order determines cache efficiency**, which determines build speed (Lesson 3).`,

    contentHi: `## Ek image layers ka ek stack hai

Ek image ek single filesystem blob nahi hai. Ye **layers ki ek ordered list** hai, plus ek JSON **config** object. Har layer **filesystem changes** ka set hai — files added, modified, deleted — jo build ke ek step ne kiye. Pehla layer base image ka content hai, aur har subsequent \`RUN\`, \`COPY\`, ya \`ADD\` instruction upar ek aur layer produce karता hai.

Har layer ek compressed archive ke roop mein stored aur **iske contents ke SHA-256 hash se named** hai — ye content-addressed hai. Byte-identical content wali do layers same layer hain, ek baar stored.

Config wo sab кुछ record karता hai jo filesystem nahi hai: default command aur entrypoint, environment variables, working directory, exposed ports, run karने ke liye user, aur layer digests ki ordered list.

## Union filesystem

Jab ek container start hoता hai, runtime image ki layers ko stack karता hai aur unhe ek **union (overlay) filesystem** istemal karके ek single directory tree ke roop mein present karता hai. Rules:
- **Upper layers lower ones ko shadow karती hain.**
- **Deletions whiteouts hain.** Ek later layer mein ek file remove karना earlier layer se bytes remove nahi karता. Instead later layer ek special **whiteout** entry record karता hai. **Deleted file ke bytes abhi bhi image ke andar ship karते hain.**
- Merged tree wo hai jo container process \`/\` ke roop mein dekhता hai.

## Copy-on-write aur writable layer

Saari image layers **read-only** hain aur us image se started har container dwara **shared** hain. Har container exactly ek additional layer paта hai: upar ek **thin writable layer**.
- **Reading** ek file: union filesystem ise jismें hai us layer mein dhoondता hai aur directly serve karता hai. Koi copying nahi.
- **Writing** ek read-only layer mein rehने wali file: file pehle writable layer mein **copied up** hoती hai, aur modification us copy par kiya jाता hai.
- Jab container **removed** hoता hai, iski writable layer — aur ismें har change — destroyed hoती hai.

## Layer sharing images ko cheap banаता hai

- **Disk par:** das images sab \`FROM node:20-slim\` \`node:20-slim\` layers ko **ek baar** store karती hain.
- **Pull par:** client sirf wo layers download karता hai jo iske paas already nahi hain.
- **Push par:** client sirf wo layers upload karता hai jo registry ke paas already nahi hain.
- **Rebuild par:** agar ek instruction aur iske saare inputs unchanged hain, iski layer **build cache** se li jाती hai.

## Ek image inspect karना

\`docker history <image>\` (layers bottom se top, sizes + instructions) · \`docker image inspect <image>\` (full config) · \`docker system df\` (shared vs unique bytes) · \`dive <image>\` (per-layer changes) · \`docker sbom\` / \`syft\` (software bill of materials).

## Consequences

- **Image size roughly layer sizes ka sum hai.** Ek layer mein created aur agli mein deleted ek large file abhi bhi apna full size cost karती hai. Actually ek image shrink karने ke liye aapको ek **single \`RUN\`** ke andar add aur remove karना chahिए.
- **Kisi bhi layer mein likhा gaya kुछ bhi us image mein permanent hai.** Ek secret jo \`COPY\`d hai aur phir ek later step mein deleted hai abhi bhi earlier layer se poori tarah recoverable hai. Build-time secrets ko \`--secret\` mounts ya ek multi-stage build istemal karना chahिए.
- **Layer order cache efficiency determine karता hai.**`,

    examples: [
      {
        title: 'docker history: seeing the layers and where the size is',
        titleHi: 'docker history: layers aur size kahaan hai dekhna',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
# 3 layers: base, one that writes a 20MB *incompressible* file, one that deletes it
printf 'FROM alpine:3.20\\nRUN head -c 20000000 /dev/urandom > /big.bin\\nRUN rm /big.bin\\n' > Dockerfile
docker build -q -t layers-demo . >/dev/null

h=$(docker history --format '{{.Size}} <= {{.CreatedBy}}' layers-demo)
echo "$h" | grep -qE '^(19|20|21)MB .*head -c 20000000' \\
  && echo "the write step produced a ~20MB layer"
echo "$h" | grep -qE '^[0-9.]+kB .*rm /big\\.bin' \\
  && echo "the rm step produced a tiny (~4kB) WHITEOUT layer - the 20MB below it stays"

sz=$(docker image inspect layers-demo --format '{{.Size}}')
[ "$sz" -gt 20000000 ] \\
  && echo "final image is >20MB: the removed file still ships (base ~8MB + ~20MB dead weight)"
docker rmi -f layers-demo >/dev/null 2>&1 || true`,
        output: `the write step produced a ~20MB layer
the rm step produced a tiny (~4kB) WHITEOUT layer - the 20MB below it stays
final image is >20MB: the removed file still ships (base ~8MB + ~20MB dead weight)`,
        explain: 'The build has two instructions on top of the base: one writes a twenty-megabyte file, the next deletes it. The file is filled from a source of random bytes on purpose, because random data does not compress, so the layer it produces genuinely costs twenty megabytes — a file of zeros would compress away and hide the effect. The history output lists the layers newest first, each with the size it contributed and the command that produced it. The write instruction shows a twenty-megabyte layer. The delete instruction shows a layer of only a few kilobytes — but the file\'s bytes are not gone. The deletion is recorded as a whiteout in that small new layer, which hides the path in the merged view; the twenty-megabyte layer beneath is immutable and still part of the image, so it is still stored and still transferred on every pull and push. The total image size confirms it: the base is around eight megabytes, and the image is over twenty more than that, the extra being the deleted file that still ships. To actually avoid the cost, the file would have to be created and removed within a single RUN instruction, so that the layer that instruction produces already reflects the file\'s absence, or the work would be done in an earlier stage of a multi-stage build whose output is not carried forward.',
        explainHi: 'Build mein base ke upar chaar instructions hain. History output layers ko newest first list karта hai, har ek us size ke saath jo isne contribute kiya aur command jisne ise produce kiya. Jis instruction ne ek bees-megabyte file likhी ek bees-megabyte layer dikhता hai. Agla instruction us file ko delete karता hai, aur iski layer zero bytes dikhती hai — par file ke bytes gaye nahi hain. Deletion naye layer mein ek whiteout ke roop mein recorded hai jo merged view mein path ko chhupाता hai; neeche bees-megabyte layer immutable hai aur abhi bhi image ka part hai, to ye abhi bhi stored aur abhi bhi har pull aur push par transferred hai. Total image size ise confirm karता hai. Cost avoid karने ke liye, file ko ek single RUN instruction ke andar created aur removed honा padता, ya kaam ek multi-stage build ke ek earlier stage mein kiya jата.',
      },
      {
        title: 'Copy-on-write: image layers are shared, the writable layer is not',
        titleHi: 'Copy-on-write: image layers shared hain, writable layer nahi',
        code: `# VERIFY
exec 2>&1
docker run -d --name c1 --rm alpine:3.20 sleep 200 >/dev/null
docker run -d --name c2 --rm alpine:3.20 sleep 200 >/dev/null

id1=$(docker inspect -f '{{.Image}}' c1); id2=$(docker inspect -f '{{.Image}}' c2)
[ "$id1" = "$id2" ] && echo "both containers are backed by the SAME read-only image layers"

echo "--- c1 writes a file: it lands in c1's writable layer ONLY ---"
docker exec c1 sh -c 'echo hi > /note.txt; cat /note.txt'
docker exec c2 sh -c 'cat /note.txt 2>/dev/null || echo "c2: no such file - writable layers are per-container"'

echo "--- c1 MODIFIES an image file: copied-up into c1's layer, c2 untouched ---"
docker exec c1 sh -c 'echo ID=tampered > /etc/os-release; cat /etc/os-release'
docker exec c2 sh -c 'grep "^ID=alpine" /etc/os-release'

docker stop c1 c2 >/dev/null 2>&1 || true`,
        output: `both containers are backed by the SAME read-only image layers
--- c1 writes a file: it lands in c1's writable layer ONLY ---
hi
c2: no such file - writable layers are per-container
--- c1 MODIFIES an image file: copied-up into c1's layer, c2 untouched ---
ID=tampered
ID=alpine`,
        explain: 'Two containers are started from the same image. Both read the same operating-system file, which lives in a read-only image layer that both containers share; there is one copy of it on disk regardless of how many containers use it. When the first container creates a new file, that file is written into that container\'s own thin writable layer, and the second container, which has a different writable layer, does not see it — writable layers are per-container and isolated. When the first container appends to a file that came from a read-only image layer, the union filesystem copies the file up into the first container\'s writable layer and applies the change there; the original in the shared image layer is untouched, so the second container still reads the unmodified version. When either container is removed, its writable layer and everything in it is discarded, while the shared image layers persist for any other container. This is the mechanism that lets many containers run from one image with almost no per-container disk cost, and it is also why any state a container needs to keep must be placed in a volume rather than written into its filesystem.',
        explainHi: 'Do containers same image se started hain. Dono same operating-system file read karते hain, jo ek read-only image layer mein rehती hai jo dono containers share karते hain; disk par iski ek copy hai chahे kitne bhi containers ise use karें. Jab pehla container ek naya file create karता hai, wo file us container ki apni thin writable layer mein written hoती hai, aur doosरा container, jiski ek alag writable layer hai, ise nahi dekhता. Jab pehla container ek file mein append karта hai jo ek read-only image layer se aayी, union filesystem file ko pehle container ki writable layer mein copy up karता hai aur change wahaan apply karता hai; shared image layer mein original untouched hai. Jab bhi container removed hoता hai, iski writable layer discarded hoती hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# "cleaning up" in a later RUN and expecting the image to shrink
RUN apt-get update && apt-get install -y build-essential   # +400 MB layer
RUN ./compile.sh                                            # builds the binary
RUN apt-get purge -y build-essential && apt-get clean      # "removes" 400 MB
# -> the image is STILL ~400 MB bigger. the install layer is immutable; the purge
//    layer just whiteouts the files. every pull/push carries the 400 MB.`,
        right: `# do install + use + cleanup in ONE layer, so the layer that's stored already
# reflects the cleanup:
RUN apt-get update && apt-get install -y --no-install-recommends build-essential \\
 && ./compile.sh \\
 && apt-get purge -y build-essential && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*
# BETTER: a multi-stage build (Lesson 4) — compile in a 'builder' stage, COPY only
# the finished binary into a tiny final stage. the build tools never enter the final image.`,
        why: 'Each Dockerfile instruction produces one immutable layer containing the filesystem changes that instruction made, and the image is the whole ordered stack of those layers. Installing a large set of build tools in one instruction creates a layer that holds all those files. A later instruction that removes them creates a new layer on top which records the removal as a whiteout, hiding the files in the merged view, but the earlier layer with the files still in it is unchanged and remains part of the image, so it is still counted in the image size and still transferred on every pull and push. The removal saves nothing in distribution terms. To make the saved space real, the installation, the use of the tools, and their removal must all happen inside a single instruction, so that the one layer that instruction produces already contains only the end state with the tools gone. The cleaner approach is a multi-stage build, where the heavy tooling is confined to an earlier build stage and only the finished artifact is copied into the final image, so the tools are never in a layer of the shipped image at all.',
        whyHi: 'Har Dockerfile instruction ek immutable layer produce karता hai jismें wo filesystem changes hain jo us instruction ne kiye, aur image un layers ka poora ordered stack hai. Ek instruction mein build tools ka ek large set install karना ek layer create karता hai jo wo saari files rakhती hai. Ek later instruction jo unhe remove karता hai upar ek naya layer create karता hai jo removal ko ek whiteout ke roop mein record karता hai, par earlier layer jismें files hain unchanged hai aur image ka part rehता hai, to ye abhi bhi image size mein counted hai. Saved space ko real banाने ke liye, installation, tools ka use, aur unka removal sab ek single instruction ke andar honा chahिए. Cleaner approach ek multi-stage build hai.',
      },
      {
        wrong: `# COPYing a secret in, using it, then deleting it in a later step
COPY .npmrc /root/.npmrc          # contains a private registry auth token
RUN npm ci
RUN rm /root/.npmrc               # "gone"
# -> 'docker history' shows the COPY layer. anyone with the image runs
//    'docker save | tar x' (or 'dive') and reads the token straight out of that
//    layer. rotating the token is now mandatory.`,
        right: `# use a BuildKit secret mount — the file is available during one RUN, never in a layer:
# syntax=docker/dockerfile:1
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc  npm ci
#   built with:  docker build --secret id=npmrc,src=$HOME/.npmrc .
# OR a multi-stage build where npm ci runs in the builder and only node_modules
# (or the built app) is COPYd forward — the .npmrc never reaches the final stage.`,
        why: 'A file brought into the image with a copy instruction becomes part of that instruction\'s layer, which is immutable and permanently included in the image. Deleting the file in a subsequent instruction only adds a whiteout in a higher layer; the original layer, with the file\'s full contents, is still present and is extractable by anyone who can pull the image, using ordinary tools to unpack the layers. A credential handled this way is therefore compromised the moment the image is distributed, and it must be rotated. The correct mechanisms keep the secret out of every layer. A build secret mount makes the file available only within the single instruction that needs it and never writes it into a layer. A multi-stage build performs the step that needs the secret in an earlier stage and copies forward only the resulting artifact, so the secret file never exists in the final image. Passing a secret as a build argument is also unsafe, because build arguments are recorded in the image history.',
        whyHi: 'Ek file jo ek copy instruction ke saath image mein laayी gayी us instruction ki layer ka part ban jати hai, jo immutable aur permanently image mein included hai. File ko ek subsequent instruction mein delete karना sirf ek higher layer mein ek whiteout add karता hai; original layer, file ke full contents ke saath, abhi bhi present hai aur kisi bhi wyakti dwara extractable hai jo image pull kar sakта hai. Is tarah handle kiया gaya ek credential isliye us moment compromised hai jab image distributed hoती hai, aur ise rotate honा chahिए. Correct mechanisms secret ko har layer se bahar rakhते hain. Ek build secret mount file ko sirf us single instruction ke andar available banаता hai. Ek multi-stage build us step ko ek earlier stage mein perform karता hai. Ek secret ko ek build argument ke roop mein pass karना bhi unsafe hai.',
      },
      {
        wrong: `# assuming 'docker image ls' sizes add up to disk usage, and being confused
$ docker image ls
myapp:1.0   980MB
myapp:1.1   985MB
myapp:1.2   985MB
# "3 GB of images?!" -> panics, deletes tags, breaks a rollback path.
# actually: they share the ~950 MB base + deps layers; real disk use is ~1 GB.`,
        right: `# 'docker image ls' shows each image's LOGICAL size (all its layers).
# for ACTUAL disk usage, accounting for shared layers:
$ docker system df            # TYPE / TOTAL / ACTIVE / RECLAIMABLE
$ docker system df -v         # per-image "Shared" vs "Unique" size
# only 'RECLAIMABLE' space is freed by pruning; deleting one of three images
# sharing a base frees only that image's UNIQUE layers (~5 MB here), not 985 MB.`,
        why: 'The size shown for an image in the image list is the total of all the layers that make up that image, counted as if that image were the only thing on the system. Because layers are content-addressed and shared, several images built from the same base share the bytes of that base: those bytes exist once on disk but are included in every one of those images\' reported sizes. Adding the listed sizes therefore overcounts, sometimes by a large factor, and acting on that inflated number — deleting images to reclaim space that was never separately occupied — removes useful tags, such as a previous version kept for rollback, without freeing much. The command that reports real usage distinguishes, per image, the space that is unique to it from the space it shares with others, and separately reports how much space pruning would actually reclaim. Deleting one image among several that share a base frees only that image\'s unique layers.',
        whyHi: 'Image list mein ek image ke liye dikhाya gaya size us image ko banाने wali saari layers ka total hai, aise counted jaise wo image system par ekmatra cheez ho. Kyunki layers content-addressed aur shared hain, same base se banी kई images us base ke bytes share karती hain: wo bytes disk par ek baar exist karते hain par un images mein se har ek ke reported sizes mein included hain. Listed sizes add karना isliye overcount karता hai, aur us inflated number par act karна useful tags remove karता hai bina zyada free kiye. Jo command real usage report karता hai wo per image distinguish karता hai ki iske liye kya unique hai aur kya ye doosरों ke saath share karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A 1.8 GB image shrunk to 180 MB** — `docker history` showed a 1.2 GB layer from `apt install` of build tools that a later `apt purge` "removed". Moving the compile into a multi-stage builder and copying only the binary forward fixed it.',
        hi: '**Ek 1.8 GB image 180 MB par shrink hui** — `docker history` ne ek 1.2 GB layer dikhाya build tools ke `apt install` se jise ek later `apt purge` ne "removed".',
      },
      {
        en: '**A private-registry token leaked in a public image** — `COPY .npmrc` then `rm`. A researcher pulled the image, ran `dive`, read the token from the COPY layer. Post-incident: all builds moved to `--mount=type=secret`, the token rotated, and a CI check that greps layers for credential patterns.',
        hi: '**Ek public image mein ek private-registry token leak** — `COPY .npmrc` phir `rm`. Ek researcher ne image pull ki, `dive` chalाya, COPY layer se token padhा.',
      },
      {
        en: '**A panicked "we\'re out of disk, delete old images"** deleted the last-known-good rollback tag — which shared 95% of its layers with current, so it freed almost nothing. `docker system df -v` afterwards showed the real reclaimable space was in dangling build cache, cleared with `docker builder prune`.',
        hi: '**Ek panicked "disk khatam, purani images delete karो"** ne last-known-good rollback tag delete kiya — jisne 95% layers current ke saath share kiye, to lagभag kुछ free nahi hua.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a layer, how does the union filesystem present them, and what happens when a container writes a file?',
        qHi: 'Ek layer kya hai, union filesystem unhe kaise present karता hai, aur jab ek container ek file write karта hai to kya hoता hai?',
        a: 'A layer is the set of filesystem changes — files added, modified, or deleted — produced by one build step, stored as a compressed archive and named by the SHA-256 hash of its contents, so identical layers are stored once and shared across images. An image is an ordered stack of these layers plus a config object. When a container starts, the runtime stacks the image\'s read-only layers and presents them as a single directory tree through a union or overlay filesystem. In the merged view, an upper layer\'s version of a path shadows any lower layer\'s version, so only the topmost occurrence of each file is visible. A deletion in a later layer is recorded as a whiteout entry that hides the path in the merged view but does not and cannot remove the bytes from the earlier immutable layer, so a deleted file still occupies space in the image. On top of the read-only layers, each container gets one thin writable layer. Reading a file serves it directly from whichever layer holds it, with no copy. Writing to a file that lives in a read-only layer triggers copy-on-write: the file is copied up into the container\'s writable layer and the change is applied there, leaving the original untouched and still shared with other containers. Creating a new file writes it straight to the writable layer. When the container is removed, its writable layer and all its changes are discarded.',
        aHi: 'Ek layer filesystem changes ka set hai — files added, modified, deleted — jo ek build step ne produce kiye, ek compressed archive ke roop mein stored aur iske contents ke SHA-256 hash se named, to identical layers ek baar stored aur images ke across shared hote hain. Ek image in layers ka ek ordered stack plus ek config object hai. Jab ek container start hoता hai, runtime image ki read-only layers ko stack karता hai aur unhe ek union filesystem ke through ek single directory tree ke roop mein present karता hai. Merged view mein, ek upper layer ki ek path ki version kisi lower layer ki version ko shadow karती hai. Ek later layer mein ek deletion ek whiteout entry ke roop mein recorded hai jo path ko chhupाता hai par earlier immutable layer se bytes remove nahi karता. Read-only layers ke upar, har container ek thin writable layer paता hai. Ek read-only layer mein rehने wali file mein writing copy-on-write trigger karती hai. Jab container removed hoता hai, iski writable layer discarded hoती hai.',
      },
      {
        q: 'Why does deleting a file or a secret in a later Dockerfile instruction not remove it from the image, and what should you do instead?',
        qHi: 'Ek later Dockerfile instruction mein ek file ya ek secret delete karना ise image se kyun remove nahi karता, aur aapको iske bजaay kya karना chahिए?',
        a: 'Because each instruction produces its own immutable layer, and the image is the full stack of all of them. When one instruction adds a file, that file is in that instruction\'s layer. When a later instruction deletes it, that only adds a whiteout to a higher layer, which hides the path in the merged filesystem view but leaves the earlier layer, with the file\'s full contents, unchanged and still part of the image. The image size still includes those bytes, every pull and push still transfers them, and anyone with the image can unpack the layers with ordinary tools and read the file. For a large build dependency, the fix is to install it, use it, and remove it all within a single instruction, so the one layer that instruction produces already reflects the removal, or better to use a multi-stage build where the dependency lives only in an earlier stage and is never copied into the final image. For a secret, the same applies but rotation is also mandatory once the image has been distributed. The correct handling is a build secret mount, which exposes the secret only during the instruction that needs it and never writes it to a layer, or a multi-stage build where the step needing the secret runs in an earlier stage and only its output is carried forward. Passing the secret as a build argument is also unsafe because build arguments are visible in the image history.',
        aHi: 'Kyunki har instruction apni immutable layer produce karता hai, aur image un sabhi ka full stack hai. Jab ek instruction ek file add karता hai, wo file us instruction ki layer mein hai. Jab ek later instruction ise delete karता hai, wo sirf ek higher layer mein ek whiteout add karता hai, jo merged view mein path ko chhupाता hai par earlier layer, file ke full contents ke saath, unchanged aur image ka part rehता hai. Image size abhi bhi wo bytes include karta hai, har pull aur push abhi bhi unhe transfer karता hai. Ek large build dependency ke liye, fix ise ek single instruction ke andar install, use, aur remove karna hai, ya better ek multi-stage build use karна. Ek secret ke liye, wahi apply hoता hai par rotation bhi mandatory hai. Correct handling ek build secret mount hai, ya ek multi-stage build. Ek secret ko ek build argument ke roop mein pass karना bhi unsafe hai kyunki build arguments image history mein visible hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain what a layer is, how it is named, and why 10 images all `FROM node:20-slim` do not use 10× the disk of one.',
        taskHi: 'Ek comment mein, ek layer kya hai samjhाओ.',
        hint: 'A layer = the set of filesystem changes (files added/modified/deleted) made by one build step, stored as a compressed archive and NAMED BY THE SHA-256 of its contents (content-addressed). Byte-identical layers are the SAME layer. So 10 images `FROM node:20-slim` all reference the exact same `node:20-slim` layer digests → those layers are stored ONCE on disk; only each image\'s own top layers are unique. Same on the wire: `docker pull` downloads only layers you don\'t have, `docker push` uploads only layers the registry doesn\'t have. `docker image ls` shows each image\'s LOGICAL size (overcounts shared bytes); `docker system df -v` shows real Shared vs Unique.',
        hintHi: 'Ek layer = ek build step ne jo filesystem changes kiye unka set, ek compressed archive ke roop mein stored aur iske contents ke SHA-256 se NAMED (content-addressed). Byte-identical layers SAME layer hain. To 10 images `FROM node:20-slim` sab same layer digests reference karती hain → wo layers disk par EK BAAR stored; sirf har image ki apni top layers unique. `docker image ls` LOGICAL size dikhता hai; `docker system df -v` real Shared vs Unique.',
      },
      {
        task: 'A Dockerfile does `RUN apt install -y build-essential`, then `RUN make`, then `RUN apt purge -y build-essential`. In a comment, explain why the final image is still ~400 MB bigger, and give the two correct fixes.',
        taskHi: 'Ek Dockerfile `apt install build-essential`, phir `make`, phir `apt purge` karता hai. Final image ~400 MB bada kyun hai?',
        hint: 'Each RUN = one immutable layer. The install layer holds the ~400 MB of tools. The purge layer just adds whiteouts hiding those files in the merged view — the install layer underneath is unchanged and still part of the image, so its 400 MB is still counted and still transferred on every pull/push. Fixes: (1) do install + use + purge in ONE `RUN` (`&&`-chained, plus `rm -rf /var/lib/apt/lists/*`) so the single layer it produces already reflects the cleanup; (2) BETTER — a multi-stage build: `make` in a `builder` stage, then `COPY --from=builder /path/to/binary` into a tiny final stage, so the build tools never enter a layer of the shipped image.',
        hintHi: 'Har RUN = ek immutable layer. Install layer ~400 MB tools rakhती hai. Purge layer sirf whiteouts add karता hai — install layer neeche unchanged aur image ka part. Fixes: (1) install + use + purge ONE `RUN` mein (`&&`-chained + `rm -rf /var/lib/apt/lists/*`); (2) BETTER — multi-stage build: `make` ek `builder` stage mein, phir `COPY --from=builder` ek tiny final stage mein.',
      },
      {
        task: 'In a comment, explain why `COPY .npmrc` (with an auth token) then `RUN rm /root/.npmrc` leaks the token, how an attacker extracts it, and the two correct ways to use a build secret.',
        taskHi: 'Ek comment mein, samjhाओ kyun `COPY .npmrc` phir `RUN rm` token leak karता hai.',
        hint: 'The `COPY` creates an immutable layer containing the full `.npmrc` (token and all). The `rm` only whiteouts it in a higher layer — the COPY layer is untouched and shipped in the image. An attacker: `docker pull` the image, then `docker save` + untar (or `dive`, or `docker history --no-trunc`) to read the token straight out of the COPY layer. Once distributed, the token MUST be rotated. Correct ways: (1) BuildKit secret mount — `RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci`, built with `docker build --secret id=npmrc,src=$HOME/.npmrc .` — the file exists only during that one RUN, never in a layer; (2) multi-stage — run `npm ci` in the builder stage and `COPY --from=builder` only `node_modules` / the built app forward, so `.npmrc` never reaches the final stage. NEVER `ARG` a token (build args are in the image history).',
        hintHi: '`COPY` ek immutable layer create karта hai jismें full `.npmrc` hai. `rm` sirf ek higher layer mein whiteout karता hai — COPY layer untouched aur image mein shipped. Attacker: `docker pull` phir `docker save` + untar (ya `dive`) COPY layer se token padhने ke liye. Token ROTATE honा chahिए. Correct: (1) BuildKit secret mount — `RUN --mount=type=secret,id=npmrc,...`; (2) multi-stage — `npm ci` builder mein, `COPY --from=builder` sirf `node_modules` forward. KABHI `ARG` token mat karो.',
      },
    ],

    keyTakeaways: [
      'An IMAGE = an ordered stack of read-only LAYERS + a JSON config (default cmd/entrypoint, env, workdir, ports, user). Each LAYER = the filesystem CHANGES (files added/modified/deleted) made by ONE build step (`FROM`/`RUN`/`COPY`/`ADD`), stored as a compressed archive and NAMED BY THE SHA-256 of its contents (content-addressed) — so byte-identical layers are stored ONCE and shared across every image that references them.',
      'The UNION / OVERLAY FILESYSTEM merges the layer stack into one `/` view: HIGHER layers shadow lower ones (only the topmost occurrence of each path is visible); a DELETION in a later layer is a WHITEOUT marker that hides the path but CANNOT remove the bytes from the immutable lower layer — the deleted file STILL SHIPS inside the image.',
      'COPY-ON-WRITE: all image layers are READ-ONLY and SHARED by every container from that image; each container gets ONE THIN WRITABLE LAYER on top. Read → served from whichever layer has it, no copy. Modify a file from a read-only layer → it\'s COPIED UP into the writable layer first, then changed there (the original is untouched, still shared). The writable layer + all its changes are DESTROYED when the container is removed → container filesystems are ephemeral, persistent state goes in a VOLUME. Starting a container is nearly free regardless of image size (nothing is copied, layers are just stacked).',
      'LAYER SHARING makes images cheap: 10 images `FROM node:20-slim` store that base ONCE on disk; `docker pull` downloads only layers you lack; `docker push` uploads only layers the registry lacks; a one-line source change rebuilds + re-transfers only the top layer(s). `docker image ls` shows each image\'s LOGICAL size (overcounts shared bytes) — use `docker system df -v` for real Shared vs Unique, and only `RECLAIMABLE` space is freed by pruning.',
      'IMAGE SIZE ≈ sum of layer sizes: a file created in one layer and deleted in the next STILL costs its bytes (both layers ship) → to actually shrink, add + use + remove within a SINGLE `RUN`, or use a multi-stage build. ANYTHING written into ANY layer is PERMANENT in that image and fully extractable (`docker save` + untar, `dive`, `docker history --no-trunc`) even if "removed" later → NEVER `COPY` a `.env`/secret or `ARG` a token into a layer; use a BuildKit `--mount=type=secret` (available during one RUN, never in a layer) or a multi-stage build where the secret never reaches the final stage — and ROTATE any secret that was ever in a distributed image. INSPECT: `docker history` (layers + sizes + instructions), `docker image inspect` (config + digest), `dive` (per-layer changes), `docker sbom`/`syft` (package list).',
    ],
    keyTakeawaysHi: [
      'Ek IMAGE = read-only LAYERS ka ek ordered stack + ek JSON config. Har LAYER = ONE build step ne jo filesystem CHANGES kiye, ek compressed archive ke roop mein stored aur iske contents ke SHA-256 se NAMED (content-addressed) — to byte-identical layers EK BAAR stored aur har image ke across shared.',
      'UNION / OVERLAY FILESYSTEM layer stack ko ek `/` view mein merge karता hai: HIGHER layers lower ones ko shadow karती hain; ek later layer mein ek DELETION ek WHITEOUT marker hai jo path chhupाता hai par immutable lower layer se bytes REMOVE NAHI kar sakта — deleted file ABHI BHI image ke andar ship karती hai.',
      'COPY-ON-WRITE: saari image layers READ-ONLY aur us image ke har container dwara SHARED; har container upar EK THIN WRITABLE LAYER paता hai. Read → jismें hai us layer se served. Ek read-only layer se ek file modify karो → ise pehle writable layer mein COPIED UP kiya jाता hai. Writable layer container remove hone par DESTROYED → state ek VOLUME mein.',
      'LAYER SHARING images ko cheap banаता hai: 10 images `FROM node:20-slim` us base ko EK BAAR store karती hain; `docker pull` sirf missing layers download karता hai; `docker push` sirf missing layers upload karता hai. `docker image ls` LOGICAL size dikhता hai (shared bytes overcount) — real ke liye `docker system df -v`.',
      'IMAGE SIZE ≈ layer sizes ka sum: ek layer mein created aur agli mein deleted ek file ABHI BHI apne bytes cost karती hai → actually shrink karने ke liye ek SINGLE `RUN` ke andar add + use + remove karो, ya ek multi-stage build. KISI bhi layer mein likhा kुछ bhi us image mein PERMANENT hai aur fully extractable (`docker save` + untar, `dive`) chahे "removed" → KABHI ek `.env`/secret `COPY` ya ek token `ARG` mat karो; ek BuildKit `--mount=type=secret` ya ek multi-stage build use karो — aur ROTATE karो. INSPECT: `docker history`, `docker image inspect`, `dive`, `docker sbom`.',
    ],
  },

  {
    slug: 'ops-the-dockerfile',
    title: 'The Dockerfile',
    titleHi: 'Dockerfile',
    description: 'A Dockerfile is a recipe: each instruction runs in order and most produce a layer. The single biggest skill is ordering instructions so the expensive, rarely-changing steps sit below the cheap, frequently-changing ones, so the build cache does most of the work on every rebuild.',
    descriptionHi: 'Ek Dockerfile ek recipe hai: har instruction order mein chalता hai aur zyaादातर ek layer produce karते hain. Single biggest skill instructions ko order karna hai taki expensive, rarely-changing steps cheap, frequently-changing ones ke neeche baithें, taki build cache har rebuild par zyaादातर kaam kare.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 3,

    analogy: {
      en: '**A cooking recipe where you can freeze the dish at any step and resume from there next time — but only if nothing before that step changed.** If your recipe is "chop onions, simmer stock for two hours, add the herb of the day", then changing the herb means re-chopping and re-simmering every time, because the change is near the top and everything after it is invalidated. Reorder it to "simmer stock for two hours, chop onions, add the herb of the day" and now changing the herb resumes from a frozen two-hour stock — seconds instead of hours. In a Dockerfile the two-hour simmer is `RUN npm ci` / `pip install`; the herb of the day is `COPY . .` (your source). Put the dependency install *above* the source copy, keyed only on the manifest files, and every rebuild after a code change skips straight to the cheap part.',
      hi: '**Ek cooking recipe jahaan aap kisi bhi step par dish freeze kar sakते ho aur agli baar wahaan se resume kar sakते ho — par sirf agar us step se pehle kuch nahi badla.** Agar aapki recipe "pyaz kaato, stock do ghante simmer karo, aaj ka herb add karo" hai, to herb change karna matlab har baar re-chop aur re-simmer, kyunki change top ke paas hai aur iske baad sab кुछ invalidated hai. Ise reorder karो "stock do ghante simmer karो, pyaz kaato, aaj ka herb add karो" aur ab herb change karna ek frozen do-ghante stock se resume karता hai. Ek Dockerfile mein do-ghante simmer `RUN npm ci` / `pip install` hai; aaj ka herb `COPY . .` (aapका source) hai. Dependency install ko source copy ke *upar* rakho, sirf manifest files par keyed, aur ek code change ke baad har rebuild seedha cheap part par skip karता hai.',
    },

    simple: `**A DOCKERFILE is instructions, run top-to-bottom. Most produce one LAYER.**
\`\`\`
FROM <image>[:tag|@digest] [AS name]   base image / start a build stage. (pin by digest for repeatability)
RUN <cmd>                              execute in a shell; result -> a layer
COPY <src> <dst>                       copy from build context -> image layer  (prefer over ADD)
ADD <src> <dst>                        COPY + auto-extract tar + fetch URLs (use ADD only for those)
WORKDIR /path                          set + create the cwd for later instructions
ENV KEY=value                          env var, baked into the image + present at runtime
ARG KEY[=default]                      BUILD-time variable (--build-arg); NOT in the running container
EXPOSE 8080                            documentation only (does NOT publish the port)
USER appuser[:group]                   run subsequent RUN + the container as this user (not root!)
ENTRYPOINT ["exe","arg"]               the fixed command
CMD ["arg"]                            default args to ENTRYPOINT, OR the default command
HEALTHCHECK --interval= CMD ...        how the runtime tests liveness
LABEL org.opencontainers.image.source= metadata (source repo, version, ...)
VOLUME /data                           declare a mount point (anonymous volume if not overridden)
\`\`\`

**LAYER CACHING — the #1 thing to get right:**
\`\`\`
- for RUN/COPY/ADD, the cache key = the instruction text + (for COPY/ADD) a hash of the
  copied files + the cache state of every PRIOR layer
- change an instruction OR its inputs -> that layer AND EVERY LAYER AFTER IT rebuilds
- so: put STABLE, EXPENSIVE steps FIRST; VOLATILE, CHEAP steps LAST
\`\`\`
\`\`\`
# BAD  (any source change re-runs npm ci)      # GOOD  (npm ci cached until deps change)
COPY . .                                        COPY package.json package-lock.json ./
RUN npm ci                                      RUN npm ci
                                                COPY . .
\`\`\`

**.dockerignore — exclude junk from the build context (like .gitignore):**
\`\`\`
node_modules      .git       *.log       .env       dist       coverage      **/__pycache__
# smaller context = faster "sending build context", and COPY . . won't pull in secrets/cruft
\`\`\`

**ENTRYPOINT vs CMD, exec vs shell form:**
\`\`\`
EXEC form   ["node","server.js"]   -> runs directly as PID 1. signals (SIGTERM) reach it. USE THIS.
SHELL form  node server.js          -> runs as  /bin/sh -c "node server.js"  -> sh is PID 1,
                                       your process is a child, SIGTERM hits sh, not your app.
ENTRYPOINT = the thing that always runs ; CMD = default args (overridable on 'docker run')
  ENTRYPOINT ["python","app.py"]  + CMD ["--port","8080"]   ->  docker run img --port 9000
\`\`\`

**ARG vs ENV:**  ARG = build only (git SHA, version, base tag), gone at runtime, visible in history
(never a secret). ENV = baked in, present at runtime, also visible in history (never a secret).

**RUN in shell form** chains with \`&&\` and cleans up in ONE layer; use \`\\\` line continuations.
**Pin the base by digest** (\`FROM node:20.11.1-slim@sha256:...\`) for reproducible builds.`,

    simpleHi: `**Ek DOCKERFILE instructions hain, top-to-bottom run. Zyaादातर ek LAYER produce karте hain.**
\`\`\`
FROM <image>[:tag|@digest] [AS name]   base image / ek build stage. (repeatability ke liye digest se pin karो)
RUN <cmd>                              ek shell mein execute; result -> ek layer
COPY <src> <dst>                       build context se copy -> image layer  (ADD se prefer karो)
ADD <src> <dst>                        COPY + auto-extract tar + URLs fetch (sirf unke liye ADD use karो)
WORKDIR /path                          later instructions ke liye cwd set + create karो
ENV KEY=value                          env var, image mein baked + runtime par present
ARG KEY[=default]                      BUILD-time variable (--build-arg); running container mein NAHI
EXPOSE 8080                            documentation only (port publish NAHI karता)
USER appuser[:group]                   subsequent RUN + container ko is user ke roop mein run karो (root nahi!)
ENTRYPOINT ["exe","arg"]               fixed command
CMD ["arg"]                            ENTRYPOINT ko default args, YA default command
HEALTHCHECK --interval= CMD ...        runtime liveness kaise test karता hai
\`\`\`

**LAYER CACHING — #1 cheez sahi karने ki:**
\`\`\`
- RUN/COPY/ADD ke liye, cache key = instruction text + (COPY/ADD ke liye) copied files ka hash
  + har PRIOR layer ki cache state
- ek instruction YA iske inputs change karो -> wo layer AUR ISKE BAAD HAR LAYER rebuild
- to: STABLE, EXPENSIVE steps PEHLE; VOLATILE, CHEAP steps LAST
\`\`\`
\`\`\`
# BAD  (koi bhi source change npm ci re-run karता hai)    # GOOD
COPY . .                                                   COPY package.json package-lock.json ./
RUN npm ci                                                 RUN npm ci
                                                           COPY . .
\`\`\`

**.dockerignore — build context se junk exclude karो (.gitignore ki tarah):**
\`\`\`
node_modules  .git  *.log  .env  dist  coverage  **/__pycache__
\`\`\`

**ENTRYPOINT vs CMD, exec vs shell form:**
\`\`\`
EXEC form   ["node","server.js"]  -> directly PID 1 ke roop mein run. signals (SIGTERM) ise pahunchते hain. YE USE KARO.
SHELL form  node server.js         -> /bin/sh -c "node server.js" ke roop mein -> sh PID 1, aapका process ek child,
                                      SIGTERM sh ko hit karता hai, aapke app ko nahi.
ENTRYPOINT = wo jo hamesha run hoता hai ; CMD = default args (docker run par overridable)
\`\`\`

**ARG vs ENV:**  ARG = build only, runtime par gone, history mein visible (kabhi secret nahi).
ENV = baked in, runtime par present, history mein visible (kabhi secret nahi).

**Base ko digest se pin karो** reproducible builds ke liye.`,

    content: `## Instructions

A Dockerfile is executed top to bottom. The instructions you use constantly:

- **\`FROM <image>[:tag] [AS name]\`** — the base image, and optionally names a build stage (Lesson 4). Pinning by digest — \`FROM node:20.11.1-slim@sha256:...\` — makes the build reproducible: the same Dockerfile produces the same base even if the tag is later re-pushed.
- **\`RUN <command>\`** — executes a command in a new layer. In **shell form** (\`RUN apt-get update\`) it runs via \`/bin/sh -c\`; in **exec form** (\`RUN ["apt-get", "update"]\`) it runs directly. Shell form is normal for \`RUN\` because you want \`&&\`, pipes, and variable expansion.
- **\`COPY <src>... <dst>\`** — copies files from the **build context** (the directory sent to the builder) into the image. Prefer it for all local file copying.
- **\`ADD <src> <dst>\`** — like \`COPY\` but also auto-extracts local tar archives and can fetch URLs. Use \`ADD\` only when you specifically want those behaviours; otherwise \`COPY\`.
- **\`WORKDIR /path\`** — sets the working directory for subsequent instructions, creating it if needed. Use it instead of \`RUN cd ...\`.
- **\`ENV KEY=value\`** — sets an environment variable that is baked into the image and present in the running container.
- **\`ARG KEY[=default]\`** — declares a **build-time** variable, settable with \`--build-arg\`. It is **not** present in the running container, but it **is** recorded in \`docker history\` — never put a secret in an \`ARG\`.
- **\`EXPOSE <port>\`** — documents which port the app listens on. It does **not** publish the port; that is \`docker run -p\` or Compose.
- **\`USER <name>[:<group>]\`** — runs subsequent \`RUN\` instructions and the final container process as this user. Containers run as root by default; a hardened image creates a non-root user and switches to it.
- **\`ENTRYPOINT\`** and **\`CMD\`** — the command to run (below).
- **\`HEALTHCHECK [options] CMD <command>\`** — a command the runtime periodically runs to decide whether the container is healthy (Lesson 4).
- **\`LABEL key=value\`** — metadata. The \`org.opencontainers.image.*\` labels (source repo, revision, version) are the standard.
- **\`VOLUME /path\`** — marks a path as expected to hold external data; if not bound at run time, Docker creates an anonymous volume. Often better to leave volume decisions to \`docker run\` / Compose.
- **\`SHELL ["/bin/bash", "-c"]\`** — changes the shell used by shell-form \`RUN\`.

## Layer caching — the thing to get right

Every \`RUN\`, \`COPY\`, and \`ADD\` produces a layer, and the builder maintains a **cache** of layers from previous builds. For a given instruction, the cache is reused only if:

1. the **instruction text** is identical, and
2. for \`COPY\`/\`ADD\`, the **contents of the copied files** are identical (a hash), and
3. **every layer before it** was also a cache hit.

The moment one instruction misses the cache, that layer and **every layer after it** are rebuilt. So the ordering rule is: **instructions that change rarely and cost a lot go near the top; instructions that change often and cost little go near the bottom.**

The canonical example is dependency installation versus source copying:

\`\`\`
# SLOW on every code change:                # FAST — deps cached until the manifest changes:
FROM node:20-slim                            FROM node:20-slim
WORKDIR /app                                 WORKDIR /app
COPY . .                                     COPY package.json package-lock.json ./
RUN npm ci        # ← re-runs every time     RUN npm ci        # ← cached across code changes
CMD ["node","server.js"]                     COPY . .          # ← the only layer a code change busts
                                             CMD ["node","server.js"]
\`\`\`

On the left, editing any source file changes the \`COPY . .\` layer, so \`npm ci\` — which can take minutes — re-runs. On the right, \`npm ci\` depends only on the two manifest files; a code change busts only the final \`COPY . .\`, and the build finishes in seconds. The same pattern applies to \`pip install -r requirements.txt\`, \`go mod download\`, \`bundle install\`, \`mvn dependency:go-offline\`, and Cargo.

BuildKit adds **cache mounts** — \`RUN --mount=type=cache,target=/root/.npm npm ci\` — which persist a package manager's download cache across builds even when the layer itself is rebuilt (Lesson 6).

## .dockerignore

The **build context** is the set of files sent to the builder when you run \`docker build .\`. Without a \`.dockerignore\`, that includes \`node_modules\`, \`.git\`, build outputs, logs, and any \`.env\` — slow to transfer, and a \`COPY . .\` would pull all of it into the image. A \`.dockerignore\` works like \`.gitignore\`:

\`\`\`
.git
node_modules
dist
build
coverage
*.log
.env
.env.*
**/__pycache__
Dockerfile
.dockerignore
\`\`\`

This keeps the context small (faster builds), keeps secrets and local cruft out of the image, and makes \`COPY . .\` safe.

## ENTRYPOINT versus CMD, exec versus shell form

**Exec form** — \`["node", "server.js"]\` — runs the executable **directly**, as PID 1 of the container. Signals from \`docker stop\` / the orchestrator (SIGTERM) are delivered to it, so it can shut down gracefully (Module 2).

**Shell form** — \`node server.js\` — is run as \`/bin/sh -c "node server.js"\`. Now **\`sh\` is PID 1** and your process is its child. SIGTERM goes to \`sh\`, which does not forward it, so your app is not told to shut down and is eventually SIGKILLed after the grace period — dropping in-flight requests on every deploy. **Always use exec form** for \`ENTRYPOINT\` and \`CMD\`.

**\`ENTRYPOINT\`** is the command that always runs. **\`CMD\`** provides default arguments to it, or — if there is no \`ENTRYPOINT\` — is itself the default command. Anything after the image name in \`docker run\` **replaces \`CMD\`** but is appended to \`ENTRYPOINT\`:

\`\`\`
ENTRYPOINT ["python", "app.py"]
CMD ["--port", "8080"]
# docker run myapp                 -> python app.py --port 8080
# docker run myapp --port 9000     -> python app.py --port 9000
# docker run --entrypoint sh myapp -> sh   (entrypoint overridden for debugging)
\`\`\`

A common pattern is \`ENTRYPOINT ["/entrypoint.sh"]\` where the script does setup and then \`exec "$@"\` to hand off to \`CMD\` as PID 1.

## ARG versus ENV

- **\`ARG\`** exists only during the build. Use it for the git SHA, a version string, a base-image tag, a feature toggle for the build. It is gone in the running container. It is visible in \`docker history\`, so **never** a secret.
- **\`ENV\`** is baked into the image and present at runtime. Use it for defaults the app reads (\`NODE_ENV=production\`, \`PORT=8080\`). Also visible in \`docker history\` — **never** a secret. Real runtime configuration and secrets are injected at \`docker run\` / Compose / orchestrator time, not baked into the image.

## RUN hygiene

- Chain related commands in one \`RUN\` with \`&&\` and \`\\\` continuations, so the layer reflects the end state (Lesson 2) and you get fewer layers.
- Clean package-manager caches in the same \`RUN\`: \`rm -rf /var/lib/apt/lists/*\`, \`npm cache clean --force\`, \`pip\`'s \`--no-cache-dir\`.
- Use \`--no-install-recommends\` (apt) and equivalent to avoid pulling optional extras.`,

    contentHi: `## Instructions

Ek Dockerfile top se bottom execute hoता hai. Jo instructions aap constantly istemal karते ho:

- **\`FROM <image>[:tag] [AS name]\`** — base image, aur optionally ek build stage name karता hai. Digest se pin karना build ko reproducible banаता hai.
- **\`RUN <command>\`** — ek naye layer mein ek command execute karта hai. **Shell form** (\`RUN apt-get update\`) \`/bin/sh -c\` ke through run hoता hai.
- **\`COPY <src>... <dst>\`** — **build context** se files ko image mein copy karता hai. Saare local file copying ke liye ise prefer karो.
- **\`ADD <src> <dst>\`** — \`COPY\` ki tarah par local tar archives bhi auto-extract karता hai aur URLs fetch kar sakта hai. \`ADD\` sirf tab use karो jab aapको wo behaviours specifically chahिए.
- **\`WORKDIR /path\`** — subsequent instructions ke liye working directory set karता hai.
- **\`ENV KEY=value\`** — ek environment variable jo image mein baked aur running container mein present hai.
- **\`ARG KEY[=default]\`** — ek **build-time** variable. Running container mein **nahi** hai, par \`docker history\` mein recorded HAI — kabhi ek secret nahi.
- **\`EXPOSE <port>\`** — documents karता hai. Port publish **nahi** karता.
- **\`USER <name>[:<group>]\`** — subsequent \`RUN\` instructions aur final container process ko is user ke roop mein run karता hai. Containers default se root ke roop mein run karते hain.
- **\`ENTRYPOINT\`** aur **\`CMD\`** — run karने ke liye command.
- **\`HEALTHCHECK\`** — ek command jo runtime periodically decide karने ke liye run karता hai ki container healthy hai ya nahi.

## Layer caching — sahi karने ki cheez

Har \`RUN\`, \`COPY\`, aur \`ADD\` ek layer produce karता hai, aur builder previous builds se layers ka ek **cache** maintain karता hai. Ek diye gaye instruction ke liye, cache reuse hoता hai sirf agar: (1) **instruction text** identical hai, (2) \`COPY\`/\`ADD\` ke liye **copied files ke contents** identical hain, (3) **iske pehle har layer** bhi ek cache hit tha.

Jis moment ek instruction cache miss karता hai, wo layer aur **iske baad har layer** rebuild hoते hain. To ordering rule: **jo instructions kम change hoते hain aur zyada cost karते hain top ke paas jाते hain; jo instructions aksar change hote hain aur kम cost karते hain bottom ke paas jाते hain.**

Canonical example dependency installation versus source copying hai:

\`\`\`
# har code change par SLOW:              # FAST — deps cached jab tak manifest change nahi:
COPY . .                                  COPY package.json package-lock.json ./
RUN npm ci                                RUN npm ci
                                          COPY . .
\`\`\`

## .dockerignore

**Build context** wo files ka set hai jo builder ko bheja jाता hai. Ek \`.dockerignore\` ke bina, ismें \`node_modules\`, \`.git\`, build outputs, logs, aur koi \`.env\` sh_amil hai. Ek \`.dockerignore\` \`.gitignore\` ki tarah kaam karta hai aur context ko small rakhता hai, secrets ko image se bahar rakhता hai.

## ENTRYPOINT versus CMD, exec versus shell form

**Exec form** — \`["node", "server.js"]\` — executable ko **directly** run karता hai, container ke PID 1 ke roop mein. \`docker stop\` se signals (SIGTERM) ise deliver hote hain.

**Shell form** — \`node server.js\` — \`/bin/sh -c "node server.js"\` ke roop mein run hoता hai. Ab **\`sh\` PID 1 hai** aur aapका process iska child hai. SIGTERM \`sh\` ko jाता hai, jo ise forward nahi karता. **Hamesha exec form use karो.**

**\`ENTRYPOINT\`** wo command hai jo hamesha run hoता hai. **\`CMD\`** ise default arguments provide karता hai. \`docker run\` mein image name ke baad kुछ bhi **\`CMD\` ko replace karता hai** par \`ENTRYPOINT\` ko appended hoता hai.

## ARG versus ENV

- **\`ARG\`** sirf build ke dauран exist karता hai. Running container mein gone. \`docker history\` mein visible — **kabhi** ek secret nahi.
- **\`ENV\`** image mein baked aur runtime par present. \`docker history\` mein visible — **kabhi** ek secret nahi. Real runtime configuration aur secrets \`docker run\` / Compose / orchestrator time par injected hote hain.

## RUN hygiene

Related commands ko ek \`RUN\` mein \`&&\` aur \`\\\` continuations ke saath chain karो. Package-manager caches ko same \`RUN\` mein clean karो.`,

    examples: [
      {
        title: 'Layer-cache ordering: dependency install above source copy',
        titleHi: 'Layer-cache ordering: source copy ke upar dependency install',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > Dockerfile <<'EOF'
FROM alpine:3.20
WORKDIR /app
COPY package.json ./
RUN echo DEPS-INSTALL-RAN && mkdir -p node_modules
COPY . .
EOF
n=$(date +%s%N)                 # nonce so the first build is genuinely cold
echo "v1-$n" > package.json
echo a > server.js

# does the dependency-install step actually execute this build?
# (its marker only prints on the real "#N <secs> DEPS-INSTALL-RAN" line, not the step header)
ran() { docker build --progress=plain -t cachedemo-$n . 2>&1 | grep -cE '^#[0-9]+ [0-9]+\\.[0-9]+ DEPS-INSTALL-RAN'; }

echo "build 1 (cold)               - dep install ran: $(ran)"
echo b > server.js
echo "build 2 (edited server.js)   - dep install ran: $(ran)"
echo "v2-$n" > package.json
echo "build 3 (edited package.json) - dep install ran: $(ran)"
docker rmi -f cachedemo-$n >/dev/null 2>&1 || true`,
        output: `build 1 (cold)               - dep install ran: 1
build 2 (edited server.js)   - dep install ran: 0
build 3 (edited package.json) - dep install ran: 1`,
        explain: 'The Dockerfile copies the dependency manifest, runs the install, and only then copies the rest of the source. On the first build every step executes. On the second build, only the application source file changed, and because the copy of the manifest and the install step come before the copy of the full source, their cache entries are still valid: the builder reports them as cached and re-runs only the final source copy, so the build is nearly instant. On the third build the manifest itself changed, which invalidates the layer that copies it, and by the rule that a cache miss invalidates that layer and everything after it, the install step runs again. This is the entire reason for the ordering. If the full source were copied before the install, then any change to any file would invalidate the install layer and the install would run on every build, which for a real dependency tree means minutes of waiting on every code change. Placing the expensive, rarely-changing install above the cheap, frequently-changing source copy is the single most impactful Dockerfile optimisation.',
        explainHi: 'Dockerfile dependency manifest copy karता hai, install run karता hai, aur sirf tab baaki source copy karता hai. Pehle build par har step execute hoता hai. Doosरे build par, sirf application source file change hui, aur kyunki manifest ki copy aur install step full source ki copy se pehle aate hain, unki cache entries abhi bhi valid hain: builder unhe cached report karता hai aur sirf final source copy re-run karता hai. Teesरे build par manifest khud change hui, jo ise copy karने wali layer ko invalidate karती hai, aur is rule se ki ek cache miss us layer aur iske baad sab кुछ invalidate karता hai, install step phir se run hoता hai. Ye ordering ka poora reason hai. Agar full source install se pehle copy hoता, to kisi bhi file mein koi bhi change install layer ko invalidate karता.',
      },
      {
        title: 'exec form vs shell form: which PID 1 gets SIGTERM',
        titleHi: 'exec form vs shell form: kaunसा PID 1 SIGTERM paता hai',
        code: `# VERIFY
exec 2>&1
d=$(mktemp -d); cd "$d"
cat > app.sh <<'EOF'
#!/bin/sh
trap 'echo GOT-SIGTERM; exit 0' TERM
echo up; while :; do sleep 1; done
EOF
chmod +x app.sh

# --- SHELL form: 'CMD /app.sh || true' keeps /bin/sh as PID 1 ---
printf 'FROM alpine:3.20\\nCOPY app.sh /app.sh\\nCMD /app.sh || true\\n' > Dockerfile
docker build -q -t sig-shell . >/dev/null
docker run -d --name ct-shell sig-shell >/dev/null; sleep 1
t0=$(date +%s%N); docker stop -t 5 ct-shell >/dev/null; t1=$(date +%s%N); ms=$(( (t1 - t0) / 1000000 ))
echo "shell form: PID 1 = $(docker inspect -f '{{.Path}}' ct-shell)"
[ "$ms" -ge 4000 ] && echo "  docker stop WAITED for the kill timeout (~5s) - sh (PID 1) ignored SIGTERM"
[ "$(docker logs ct-shell 2>&1 | grep -c GOT-SIGTERM)" -eq 0 ] && echo "  app.sh NEVER saw SIGTERM - it was SIGKILLed (sh did not forward it)"
docker rm ct-shell >/dev/null

# --- EXEC form: 'CMD ["/app.sh"]' makes app.sh itself PID 1 ---
printf 'FROM alpine:3.20\\nCOPY app.sh /app.sh\\nCMD ["/app.sh"]\\n' > Dockerfile
docker build -q -t sig-exec . >/dev/null
docker run -d --name ct-exec sig-exec >/dev/null; sleep 1
t0=$(date +%s%N); docker stop -t 5 ct-exec >/dev/null; t1=$(date +%s%N); ms=$(( (t1 - t0) / 1000000 ))
echo "exec form:  PID 1 = $(docker inspect -f '{{.Path}}' ct-exec)"
[ "$ms" -le 2500 ] && echo "  docker stop returned promptly (~1s)"
[ "$(docker logs ct-exec 2>&1 | grep -c GOT-SIGTERM)" -eq 1 ] && echo "  app.sh (PID 1) got SIGTERM and its trap ran - clean exit"
docker rm ct-exec >/dev/null
docker rmi -f sig-shell sig-exec >/dev/null 2>&1 || true`,
        output: `shell form: PID 1 = /bin/sh
  docker stop WAITED for the kill timeout (~5s) - sh (PID 1) ignored SIGTERM
  app.sh NEVER saw SIGTERM - it was SIGKILLed (sh did not forward it)
exec form:  PID 1 = /app.sh
  docker stop returned promptly (~1s)
  app.sh (PID 1) got SIGTERM and its trap ran - clean exit`,
        explain: 'Both images run the same script, which installs a handler for the termination signal that prints a message and exits cleanly. The only difference is the form of the command instruction. With the shell form, the container\'s PID 1 is the shell, and the script runs as a child process. When the container is stopped, the termination signal is delivered to PID 1, the shell, which does not forward it to its child, so the script never sees the signal, never runs its handler, and is forcibly killed when the grace period expires — which is why the stop takes the full timeout and the clean-shutdown message never appears. With the exec form, the script itself is PID 1, the termination signal is delivered directly to it, its handler runs, it prints the message and exits immediately, and the stop completes at once. In a real service this is the difference between every deploy dropping the requests that were in flight and every deploy draining cleanly. The rule that follows is to always write the entrypoint and command in exec form, as a JSON array, so the application process is PID 1 and receives signals.',
        explainHi: 'Dono images same script run karते hain, jo termination signal ke liye ek handler install karta hai jo ek message print karta hai aur cleanly exit karता hai. Ekmatra difference command instruction ka form hai. Shell form ke saath, container ka PID 1 shell hai, aur script ek child process ke roop mein run karता hai. Jab container stop hoता hai, termination signal PID 1 ko deliver hoता hai, shell, jo ise apne child ko forward nahi karता, to script kabhi signal nahi dekhता, kabhi apna handler run nahi karता, aur forcibly killed hoता hai jab grace period expire hoता hai. Exec form ke saath, script khud PID 1 hai, termination signal ise directly deliver hoता hai, iska handler run karता hai. Ek real service mein ye har deploy ke in-flight requests drop karने aur har deploy ke cleanly drain karने ke beech ka difference hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# COPY . . before installing dependencies
FROM python:3.12-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt      # ← re-runs on EVERY source edit
CMD ["python", "-m", "myapp"]
# -> a one-character code change = a full 'pip install' (minutes). CI builds crawl.`,
        right: `FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt   # ← cached until requirements.txt changes
COPY . .
CMD ["python", "-m", "myapp"]
# a code change now busts only the final COPY; the build is seconds.
# + BuildKit: RUN --mount=type=cache,target=/root/.cache/pip pip install ...`,
        why: 'The build cache reuses a layer only when the instruction and its inputs are unchanged and every prior layer was also cached, and a cache miss forces that layer and all subsequent layers to rebuild. Copying the entire source tree before installing dependencies means the dependency-install layer sits below a copy that changes whenever any file changes, so almost every build invalidates the copy and therefore re-runs the install. For a real project the install is the slowest step, often minutes, so this makes every rebuild slow regardless of how small the code change was. Copying only the dependency manifest first, running the install, and copying the rest of the source afterward puts the expensive step below only the manifest, which changes rarely. A code change then invalidates just the final source copy, and the install is served from cache. The pattern is the same across ecosystems, and BuildKit cache mounts can additionally preserve the package manager\'s own download cache across the times the layer does rebuild.',
        whyHi: 'Build cache ek layer reuse karता hai sirf jab instruction aur iske inputs unchanged hain aur har prior layer bhi cached tha, aur ek cache miss us layer aur saare subsequent layers ko rebuild karवाता hai. Dependencies install karने se pehle poora source tree copy karना matlab dependency-install layer ek copy ke neeche baithता hai jo tab change hoती hai jab bhi koi file change hoती hai, to lagभag har build copy ko invalidate karता hai aur isliye install re-run karता hai. Ek real project ke liye install sabse slow step hai, aksar minutes. Pehle sirf dependency manifest copy karна, install run karना, aur baad mein baaki source copy karना expensive step ko sirf manifest ke neeche rakhता hai. Ek code change phir sirf final source copy ko invalidate karता hai.',
      },
      {
        wrong: `# CMD in shell form (or ENTRYPOINT in shell form)
CMD npm start
# -> container PID 1 is /bin/sh; 'npm start' is a grandchild.
#    'docker stop' / k8s SIGTERM -> hits sh -> not forwarded -> your app is never
//    told to shut down -> SIGKILL after 10s -> every deploy drops in-flight requests
//    and skips cleanup (flush, close DB pools, deregister).`,
        right: `# exec form (JSON array) so YOUR process is PID 1 and gets the signal:
CMD ["node", "server.js"]
# if you truly need a shell (env expansion, multiple commands), use an entrypoint
# script that ends with 'exec "$@"' — 'exec' REPLACES the shell so your app becomes PID 1:
#   #!/bin/sh
#   set -e
#   ./wait-for-db.sh
#   exec "$@"                 # <- app takes over PID 1
# and handle SIGTERM in the app (Module 2): stop accepting, drain, exit.`,
        why: 'When a command is given in shell form, the container runtime runs it through a shell, so the shell becomes process one of the container and the actual application is a child of that shell. Termination signals from a stop command or an orchestrator are sent to process one. A shell does not propagate those signals to its children by default, so the application is never notified that it should shut down. It continues running until the grace period elapses and is then forcibly killed. For a service this means every intentional stop — every deploy, every scale-down, every node drain — terminates the application abruptly, abandoning in-flight requests and skipping any cleanup such as flushing buffers, closing connection pools, or deregistering from a load balancer. Writing the command in exec form, as a JSON array, makes the application itself process one, so it receives the termination signal directly and can shut down cleanly. When a shell genuinely is needed for setup, the script should finish by using exec to replace itself with the application, so the application still ends up as process one.',
        whyHi: 'Jab ek command shell form mein diya jाता hai, container runtime ise ek shell ke through run karता hai, to shell container ka process ek ban jата hai aur actual application us shell ka ek child hai. Ek stop command ya ek orchestrator se termination signals process ek ko bheje jाते hain. Ek shell default se un signals ko apne children ko propagate nahi karता, to application ko kabhi notify nahi kiया jाता ki ise shut down honा chahिए. Ye grace period elapse hone tak run karता rehта hai aur phir forcibly killed hoता hai. Ek service ke liye iska matlab har intentional stop application ko abruptly terminate karता hai. Command ko exec form mein likhना application ko khud process ek banаता hai. Jab ek shell genuinely setup ke liye chahिए, script ko exec istemal karके khud ko application se replace karके finish karना chahिए.',
      },
      {
        wrong: `# passing a secret via ARG or ENV
ARG GITHUB_TOKEN
RUN git clone https://$GITHUB_TOKEN@github.com/org/private-repo
# or:
ENV DB_PASSWORD=super-secret-value
# -> 'docker history --no-trunc' prints the ARG value and the ENV line verbatim.
//    the token / password is in the image, forever, for anyone who pulls it.`,
        right: `# build-time secret: BuildKit --secret (never written to a layer or history):
# syntax=docker/dockerfile:1
RUN --mount=type=secret,id=gh_token \\
    GITHUB_TOKEN=$(cat /run/secrets/gh_token) git clone https://$GITHUB_TOKEN@github.com/...
#   docker build --secret id=gh_token,env=GITHUB_TOKEN .
# runtime secret: inject at run time, not build time —
#   docker run --env-file <(...) ...   OR  -e DB_PASSWORD=...  OR a secrets manager / k8s Secret
# and NEVER bake real config into ENV; ENV is for non-sensitive defaults only.`,
        why: 'Build arguments and environment variables declared in a Dockerfile are both recorded in the image metadata and are visible to anyone who inspects the image history, printed verbatim. A credential passed as a build argument to clone a private repository, or a password set as an environment variable, is therefore embedded in the distributed image permanently and is trivially readable, so it is compromised as soon as the image leaves the build machine and must be rotated. Build-time secrets should use the dedicated secret-mount mechanism, which makes the secret available as a file only within the single instruction that needs it and never writes it into any layer or into the history. Runtime secrets and real configuration should not be in the image at all; they are supplied when the container starts, through environment variables set at run time, an environment file, or an integration with a secrets manager or the orchestrator\'s secret objects. Environment variables baked with the environment instruction are appropriate only for non-sensitive defaults that are genuinely part of the image.',
        whyHi: 'Ek Dockerfile mein declared build arguments aur environment variables dono image metadata mein recorded hain aur kisi bhi wyakti ko visible hain jo image history inspect karता hai, verbatim printed. Ek private repository clone karने ke liye ek build argument ke roop mein pass kiya gaya ek credential, ya ek environment variable ke roop mein set kiya gaya ek password, isliye distributed image mein permanently embedded hai aur trivially readable hai, to ye us moment compromised hai jab image build machine chhoड़ती hai aur ise rotate honा chahिए. Build-time secrets ko dedicated secret-mount mechanism istemal karना chahिए, jo secret ko ek file ke roop mein sirf us single instruction ke andar available banаता hai. Runtime secrets aur real configuration image mein bilkul nahi honे chahिए.',
      },
    ],

    realWorld: [
      {
        en: '**CI image builds went from ~9 min to ~40 s on code-only changes** by moving `COPY . .` below the dependency install and adding a BuildKit `--mount=type=cache` for the package manager. No code change; pure Dockerfile ordering.',
        hi: '**CI image builds code-only changes par ~9 min se ~40 s par gaye** `COPY . .` ko dependency install ke neeche move karके aur ek BuildKit `--mount=type=cache` add karके.',
      },
      {
        en: '**Every deploy showed a burst of 502s** — the Dockerfile had `CMD npm start` (shell form), so SIGTERM hit `sh`, not Node; the app was SIGKILLed mid-request. Changing to `CMD ["node","dist/server.js"]` + a SIGTERM handler made deploys silent.',
        hi: '**Har deploy ek 502s ka burst dikhता tha** — Dockerfile mein `CMD npm start` (shell form) tha, to SIGTERM `sh` ko hit karता tha, Node ko nahi.',
      },
      {
        en: '**A cloud key leaked via `ENV AWS_SECRET_ACCESS_KEY`** in a base image shared across teams — found by a scanner reading `docker history`. All secrets moved to runtime injection; a CI gate now fails any image whose history contains credential-shaped strings.',
        hi: '**Ek cloud key `ENV AWS_SECRET_ACCESS_KEY` ke through leak** teams ke across shared ek base image mein — ek scanner ne `docker history` padhकar dhoondा.',
      },
    ],

    interviewQA: [
      {
        q: 'How does the Docker build cache work, and how do you order a Dockerfile to exploit it?',
        qHi: 'Docker build cache kaise kaam karता hai, aur aap ek Dockerfile ko ise exploit karने ke liye kaise order karते ho?',
        a: 'Every RUN, COPY, and ADD instruction produces a layer, and the builder keeps a cache of layers from previous builds. For a given instruction the cached layer is reused only if three conditions hold: the instruction text is byte-identical, for COPY and ADD the contents of the files being copied are identical by hash, and every layer before this one was also a cache hit. As soon as one instruction misses, that layer and every layer after it are rebuilt, because each layer is computed on top of the previous one. The ordering strategy that follows is to place instructions that change rarely and cost a lot near the top, and instructions that change frequently and cost little near the bottom. The standard application is dependencies versus source. You copy only the dependency manifest first, run the install, and copy the rest of the source afterward. The install layer then depends only on the manifest, which changes rarely, so a normal code change invalidates only the final source copy and the install is served from cache, turning a multi-minute rebuild into a few seconds. The same shape applies to every language\'s package manager. BuildKit cache mounts go further, persisting the package manager\'s own download cache across the builds where the layer itself does have to rebuild.',
        aHi: 'Har RUN, COPY, aur ADD instruction ek layer produce karता hai, aur builder previous builds se layers ka ek cache rakhता hai. Ek diye gaye instruction ke liye cached layer reuse hoता hai sirf agar teen conditions hold karती hain: instruction text byte-identical hai, COPY aur ADD ke liye copy ki jа rahी files ke contents hash se identical hain, aur is se pehle har layer bhi ek cache hit tha. Jaise hi ek instruction miss karता hai, wo layer aur iske baad har layer rebuild hoते hain. Jo ordering strategy follow karती hai wo un instructions ko top ke paas rakhना hai jo kम change hote hain aur zyada cost karते hain, aur un instructions ko bottom ke paas jo aksar change hote hain aur kम cost karते hain. Standard application dependencies versus source hai. Aap pehle sirf dependency manifest copy karते ho, install run karते ho, aur baad mein baaki source copy karते ho.',
      },
      {
        q: 'Explain exec form versus shell form for CMD/ENTRYPOINT, and ARG versus ENV.',
        qHi: 'CMD/ENTRYPOINT ke liye exec form versus shell form, aur ARG versus ENV samjhाओ.',
        a: 'Exec form is a JSON array, like a command written as a list of strings. The runtime executes that program directly, so it becomes process one of the container and receives signals from a stop command or an orchestrator, allowing a graceful shutdown. Shell form is a plain string; the runtime runs it through a shell, so the shell is process one and the real application is its child. A shell does not forward termination signals to its children, so the application is never told to stop and is forcibly killed after the grace period, dropping in-flight work on every deploy. Exec form should always be used; when a shell is genuinely needed for setup, the script should end by using exec to replace itself with the application so the application still becomes process one. ARG and ENV are both build-visible and neither may hold a secret, because both appear in the image history. ARG is a build-time variable, set with a build flag, used for things like a version string or a base tag; it does not exist in the running container. ENV is baked into the image and is present at runtime, used for non-sensitive defaults the application reads. Real runtime configuration and secrets are injected when the container starts, not baked into the image.',
        aHi: 'Exec form ek JSON array hai, ek command jo strings ki ek list ke roop mein likhी. Runtime us program ko directly execute karता hai, to ye container ka process ek ban jата hai aur ek stop command se signals receive karता hai, ek graceful shutdown allow karता hai. Shell form ek plain string hai; runtime ise ek shell ke through run karता hai, to shell process ek hai aur real application iska child hai. Ek shell termination signals ko apne children ko forward nahi karता. Exec form hamesha use honा chahिए. ARG aur ENV dono build-visible hain aur koi bhi ek secret nahi rakh sakта, kyunki dono image history mein appear karते hain. ARG ek build-time variable hai; ye running container mein exist nahi karता. ENV image mein baked hai aur runtime par present hai. Real runtime configuration aur secrets container start hone par injected hote hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, rewrite this Dockerfile for cache efficiency and explain what a one-line code change costs before and after:\n```\nFROM node:20-slim\nWORKDIR /app\nCOPY . .\nRUN npm ci\nCMD ["node","server.js"]\n```',
        taskHi: 'Ek comment mein, is Dockerfile ko cache efficiency ke liye rewrite karो.',
        hint: 'Rewrite:\n```\nFROM node:20-slim\nWORKDIR /app\nCOPY package.json package-lock.json ./\nRUN npm ci\nCOPY . .\nCMD ["node","server.js"]\n```\nBefore: `COPY . .` is above `RUN npm ci`, so ANY file change invalidates the `COPY . .` layer → `npm ci` (minutes) re-runs on every build. After: `npm ci` depends only on the two manifest files; a code change busts only the final `COPY . .` → build is seconds, install served from cache. Bonus: `RUN --mount=type=cache,target=/root/.npm npm ci` keeps npm\'s download cache even when the layer does rebuild.',
        hintHi: 'Rewrite: `COPY package.json package-lock.json ./` → `RUN npm ci` → `COPY . .`. Before: `COPY . .` `RUN npm ci` ke upar, to KOI bhi file change `COPY . .` layer invalidate karता hai → `npm ci` (minutes) har build par re-run. After: `npm ci` sirf manifest files par depend karता hai; ek code change sirf final `COPY . .` bust karता hai → build seconds. Bonus: `RUN --mount=type=cache,target=/root/.npm`.',
      },
      {
        task: 'In a comment, explain the difference between `CMD ["node","server.js"]` and `CMD node server.js` for what happens on `docker stop`, and what an entrypoint script must do to not break it.',
        taskHi: 'Ek comment mein, `CMD ["node","server.js"]` aur `CMD node server.js` ke beech difference samjhाओ.',
        hint: 'EXEC form `["node","server.js"]`: node runs directly as PID 1 → `docker stop`/k8s SIGTERM is delivered to node → it can run its shutdown handler (stop accepting, drain in-flight, close pools) and exit; stop is fast and clean. SHELL form `node server.js`: runs as `/bin/sh -c "node server.js"` → `sh` is PID 1, node is its child → SIGTERM hits `sh`, which does NOT forward it → node is never told to stop → SIGKILL after the ~10s grace period → in-flight requests dropped, no cleanup, every deploy. An entrypoint script (needed for env expansion / setup) must end with `exec "$@"` — `exec` REPLACES the shell process with the app, so the app becomes PID 1 and receives signals. Without `exec`, the script stays PID 1 and you have the shell-form problem again.',
        hintHi: 'EXEC form `["node","server.js"]`: node directly PID 1 → SIGTERM node ko → shutdown handler run kar sakта hai; stop fast + clean. SHELL form `node server.js`: `/bin/sh -c` ke roop mein → `sh` PID 1, node child → SIGTERM `sh` ko, forward NAHI → SIGKILL ~10s baad → in-flight dropped. Ek entrypoint script `exec "$@"` se end honा chahिए — `exec` shell ko app se REPLACE karता hai, to app PID 1 ban jата hai.',
      },
      {
        task: 'In a comment, explain why `ARG TOKEN` + `RUN git clone https://$TOKEN@...` leaks the token, why `ENV DB_PASSWORD=...` is just as bad, and the correct mechanism for each of a build-time secret and a runtime secret.',
        taskHi: 'Ek comment mein, samjhाओ kyun `ARG TOKEN` + `RUN git clone` token leak karता hai.',
        hint: 'Both `ARG` values and `ENV` lines are recorded in the image metadata and printed verbatim by `docker history --no-trunc` — anyone who pulls the image reads them. So the token / password is in the distributed image forever and must be rotated. BUILD-TIME secret → BuildKit secret mount: `RUN --mount=type=secret,id=tok ...` reading `/run/secrets/tok`, built with `docker build --secret id=tok,env=TOKEN .` — the value is a file present only during that one RUN, never in a layer or history. RUNTIME secret → inject when the container starts, not at build: `docker run -e DB_PASSWORD=...` / `--env-file` / a secrets manager / a k8s Secret. `ENV` is only for non-sensitive defaults (`NODE_ENV=production`, `PORT=8080`).',
        hintHi: '`ARG` values aur `ENV` lines dono image metadata mein recorded aur `docker history --no-trunc` se verbatim printed — koi bhi jo image pull karता hai unhe padhता hai. Token/password distributed image mein hamesha ke liye, rotate honा chahिए. BUILD-TIME secret → BuildKit secret mount: `RUN --mount=type=secret,id=tok ...`. RUNTIME secret → container start hone par inject karो: `docker run -e ...` / `--env-file` / secrets manager / k8s Secret. `ENV` sirf non-sensitive defaults ke liye.',
      },
    ],

    keyTakeaways: [
      'A DOCKERFILE runs instructions top-to-bottom; most produce ONE LAYER. Core set: `FROM` (base / build stage — PIN BY DIGEST for repeatability), `RUN` (execute → a layer), `COPY` (build context → image; prefer over `ADD`), `ADD` (COPY + tar-extract + URL fetch — only for those), `WORKDIR` (set+create cwd), `ENV` (baked in, present at runtime), `ARG` (BUILD-time only, gone at runtime), `EXPOSE` (docs only — does NOT publish), `USER` (run as non-root!), `ENTRYPOINT`/`CMD`, `HEALTHCHECK`, `LABEL`.',
      'LAYER CACHING is the #1 thing to get right. For `RUN`/`COPY`/`ADD` the cache key = the instruction text + (for COPY/ADD) a hash of the copied files + the cache state of EVERY PRIOR layer. A miss on one instruction rebuilds that layer AND EVERY LAYER AFTER IT. So order: STABLE + EXPENSIVE steps FIRST, VOLATILE + CHEAP steps LAST. The canonical win: `COPY` only the dependency manifest → `RUN` the install → `COPY . .` the source — so a code change busts only the final `COPY` and the (minutes-long) install stays cached. Same for pip / go mod / bundle / mvn / cargo. BuildKit `RUN --mount=type=cache,target=...` persists the package manager\'s download cache across rebuilds.',
      '`.dockerignore` (like `.gitignore`) excludes junk from the BUILD CONTEXT (`node_modules`, `.git`, `dist`, `*.log`, `.env*`, `__pycache__`) → smaller/faster context AND `COPY . .` won\'t pull secrets or cruft into the image.',
      'EXEC form `["node","server.js"]` runs the process DIRECTLY as PID 1 → SIGTERM reaches it → graceful shutdown. SHELL form `node server.js` runs as `/bin/sh -c "..."` → `sh` is PID 1, your app is a child, SIGTERM hits `sh` (not forwarded) → app SIGKILLed after the grace period → every deploy drops in-flight requests + skips cleanup. ALWAYS use exec form; if you need a shell/entrypoint script, end it with `exec "$@"` so the app becomes PID 1. ENTRYPOINT = the fixed command; CMD = default args to it (or the default command). Args after the image name on `docker run` REPLACE CMD but are APPENDED to ENTRYPOINT.',
      'ARG = build-time only (git SHA, version, base tag) — gone at runtime, VISIBLE in `docker history`. ENV = baked in, present at runtime — ALSO visible in history. NEITHER may hold a secret. BUILD-time secret → BuildKit `RUN --mount=type=secret,id=...` (a file present during one RUN only, never in a layer/history), built with `docker build --secret ...`. RUNTIME secret + real config → injected when the container STARTS (`-e` / `--env-file` / a secrets manager / a k8s Secret), never baked in. Any secret ever in a distributed image (via ARG/ENV/`COPY`) MUST be rotated. RUN hygiene: chain related commands in ONE `RUN` with `&&` + `\\`, clean package caches in the same RUN (`rm -rf /var/lib/apt/lists/*`, `--no-cache-dir`), use `--no-install-recommends`.',
    ],
    keyTakeawaysHi: [
      'Ek DOCKERFILE instructions ko top-to-bottom run karता hai; zyaादातर ONE LAYER produce karте hain. Core set: `FROM` (base — DIGEST SE PIN karो), `RUN` (execute → ek layer), `COPY` (`ADD` se prefer), `ADD` (sirf tar-extract + URL fetch ke liye), `WORKDIR`, `ENV` (runtime par present), `ARG` (BUILD-time only), `EXPOSE` (docs only), `USER` (non-root!), `ENTRYPOINT`/`CMD`, `HEALTHCHECK`.',
      'LAYER CACHING #1 cheez hai. `RUN`/`COPY`/`ADD` ke liye cache key = instruction text + (COPY/ADD ke liye) copied files ka hash + HAR PRIOR layer ki cache state. Ek instruction par ek miss us layer AUR ISKE BAAD HAR LAYER ko rebuild karता hai. To order: STABLE + EXPENSIVE PEHLE, VOLATILE + CHEAP LAST. Canonical win: sirf dependency manifest `COPY` → install `RUN` → `COPY . .` source. BuildKit `RUN --mount=type=cache` package manager cache persist karता hai.',
      '`.dockerignore` (`.gitignore` ki tarah) BUILD CONTEXT se junk exclude karता hai (`node_modules`, `.git`, `dist`, `*.log`, `.env*`) → smaller context AUR `COPY . .` secrets nahi laayेga.',
      'EXEC form `["node","server.js"]` process ko DIRECTLY PID 1 ke roop mein run karता hai → SIGTERM ise pahunchता hai → graceful shutdown. SHELL form `node server.js` `/bin/sh -c` ke roop mein → `sh` PID 1, app child, SIGTERM `sh` ko (forward NAHI) → app SIGKILLed → har deploy in-flight requests drop. HAMESHA exec form; ek entrypoint script `exec "$@"` se end karो. ENTRYPOINT = fixed command; CMD = default args. `docker run` par image name ke baad args CMD ko REPLACE karте hain par ENTRYPOINT ko APPENDED.',
      'ARG = build-time only, runtime par gone, `docker history` mein VISIBLE. ENV = baked in, runtime par present, history mein bhi visible. KOI bhi ek secret nahi rakh sakта. BUILD-time secret → BuildKit `RUN --mount=type=secret,id=...`. RUNTIME secret + real config → container START hone par injected, kabhi baked in nahi. Koi bhi secret jo ek distributed image mein tha ROTATE honा chahिए. RUN hygiene: related commands ek `RUN` mein `&&` + `\\` se chain karो, package caches same RUN mein clean karो.',
    ],
  },
];
