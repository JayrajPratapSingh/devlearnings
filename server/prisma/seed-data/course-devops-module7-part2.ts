/**
 * DevOps Complete Course — Module 7: Kubernetes — Architecture, Pods & the
 * Reconciliation Loop, lessons 4-6.
 *
 * Lesson 4: Pods — the atom of scheduling; multi-container Pods, init containers,
 *           sidecars, the shared network + volumes, lifecycle & restartPolicy, why
 *           you rarely create a bare Pod. VERIFIED against a real cluster (kind).
 * Lesson 5: kubectl essentials — apply/get/describe/logs/exec/port-forward/run,
 *           -o / -w / --dry-run / explain, contexts. VERIFIED.
 * Lesson 6: Namespaces, labels, selectors & annotations — partitioning, how
 *           controllers find their objects, the label conventions. VERIFIED.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_7_PART2: CourseLesson[] = [
  {
    slug: 'ops-pods-the-atom-of-scheduling',
    title: 'Pods — the Atom of Scheduling',
    titleHi: 'Pods — Scheduling Ka Atom',
    description: 'A Pod is one or more containers that are always scheduled together onto one node, sharing a network identity and able to share volumes. Init containers run to completion first, in order; sidecars run alongside the main container. You almost never create a bare Pod — a controller creates them for you.',
    descriptionHi: 'Ek Pod ek ya zyada containers hain jo hamesha ek node par saath scheduled hote hain, ek network identity share karte hain aur volumes share kar sakte hain. Init containers pehle order mein completion tak chalte hain; sidecars main container ke saath chalte hain. Aap lagbhag kabhi ek bare Pod nahi banate — ek controller aapke liye unhe banata hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A shared hotel suite versus separate rooms.** Two guests who must work together — a translator and a diplomat — get one suite (a Pod), not two rooms down the hall. They share the suite\'s phone line and street address (the Pod\'s network namespace and IP: both containers are reachable on the same IP, and talk to each other over `localhost`), and they can leave documents on the shared desk in the lounge (a shared volume). Housekeeping either makes up the whole suite or none of it (the Pod is scheduled and deleted as a unit). Before either guest can start, a setup crew comes in first and fully finishes preparing the room — stocking it, testing the safe — and only leaves when done (an init container: runs to completion before the app containers start). And a personal assistant stays in the suite the whole time handling logistics (a sidecar: runs alongside).',
      hi: '**Ek shared hotel suite versus separate rooms.** Do guests jinhe saath kaam karna hai — ek translator aur ek diplomat — ek suite (ek Pod) milti hai, hall ke neeche do rooms nahi. Wo suite ki phone line aur street address share karte hain (Pod ka network namespace aur IP: dono containers same IP par reachable hain, aur ek doosre se `localhost` par baat karte hain), aur wo lounge mein shared desk par documents chhod sakte hain (ek shared volume). Housekeeping ya to poori suite banati hai ya iska koi nahi (Pod ek unit ke roop mein scheduled aur deleted hota hai). Dono guests ke start hone se pehle, ek setup crew pehle aati hai aur room prepare karna fully finish karti hai (ek init container: app containers ke start hone se pehle completion tak chalta hai). Aur ek personal assistant poore samay suite mein rehta hai logistics handle karta (ek sidecar: saath chalta hai).',
    },

    simple: `**A POD = 1+ containers that are ALWAYS co-located on ONE node + share a network identity.**
It is the smallest thing Kubernetes schedules. Not a container — a Pod.

**WHAT THE CONTAINERS IN A POD SHARE:**
\`\`\`
NETWORK namespace   ONE IP for the whole Pod. containers reach each other on
                    localhost:<port>. two containers CANNOT bind the same port.
IPC namespace       shared shared-memory / semaphores (opt-in on some setups)
VOLUMES             any volume in pod.spec.volumes can be mounted into MULTIPLE
                    containers -> a way to pass files between them (e.g. emptyDir)
LIFECYCLE           scheduled together, deleted together, live/die as a unit
NOT shared: the filesystem (each container has its own image rootfs), the PID
namespace (by default), CPU/memory limits (per-container)
\`\`\`

**THREE KINDS OF CONTAINER IN A POD:**
\`\`\`
init containers    run ONE AT A TIME, IN ORDER, to completion (exit 0), BEFORE any
                   app container starts. use for: wait-for-dependency, run a schema
                   migration, fetch config/secrets, fix volume permissions. a failed
                   init container -> Pod restarts it (per restartPolicy).
app containers     the main workload. usually ONE. run concurrently if more than one.
sidecar containers a helper that runs FOR THE LIFE of the app container, alongside it:
                   a log shipper, a metrics exporter, a service-mesh proxy, a config
                   reloader. (modern k8s: a native "sidecar" = an initContainer with
                   restartPolicy: Always — starts before app containers, stops after.)
\`\`\`

**POD LIFECYCLE — phase (a coarse summary) + conditions (the detail):**
\`\`\`
Pending      accepted, not all containers running (scheduling / image pull / init)
Running      bound to a node, >=1 container running
Succeeded    all containers exited 0 and won't restart
Failed       all containers terminated, >=1 non-zero and won't restart
Unknown      the node is unreachable
conditions:  PodScheduled · Initialized · ContainersReady · Ready
\`\`\`

**restartPolicy (applies to CONTAINERS within the Pod):**
\`\`\`
Always       (default) restart any container that exits, forever. for Deployments.
OnFailure    restart only on non-zero exit. for Jobs that should retry.
Never        never restart a container. for run-once Jobs.
\`\`\`
A container that keeps crashing -> \`CrashLoopBackOff\` (exponential backoff: 10s, 20s,
40s ... capped at 5m). \`kubectl logs <pod> -c <ctr> --previous\` shows the last crash.

**YOU RARELY WRITE A BARE POD.** A bare Pod is not rescheduled if its node dies, not
replaced if it's deleted, has no rollout. You write a **Deployment** (Module 8) whose
template is a Pod spec, and its controllers create + manage the Pods. Bare Pods are for
one-off debugging (\`kubectl run --rm -it\`).

**INSPECT:** \`kubectl describe pod\` (events + per-container state + probe results) ·
\`kubectl logs <pod> [-c <ctr>] [-f] [--previous]\` · \`kubectl get pod -o wide\` (node + IP) ·
\`kubectl exec -it <pod> -c <ctr> -- sh\`.`,

    simpleHi: `**EK POD = 1+ containers jo HAMESHA ONE node par co-located hain + ek network identity share karte hain.**
Ye sabse chhoti cheez hai jo Kubernetes schedule karta hai. Ek container nahi — ek Pod.

**EK POD MEIN CONTAINERS KYA SHARE KARTE HAIN:**
\`\`\`
NETWORK namespace   poore Pod ke liye ONE IP. containers ek doosre ko localhost:<port> par
                    reach karte hain. do containers same port bind NAHI kar sakte.
VOLUMES             pod.spec.volumes mein koi bhi volume MULTIPLE containers mein mount ho sakta hai
LIFECYCLE           saath scheduled, saath deleted, ek unit ke roop mein live/die
NOT shared: filesystem (har container ka apna image rootfs), PID namespace (by default),
CPU/memory limits (per-container)
\`\`\`

**EK POD MEIN TEEN KINDS OF CONTAINER:**
\`\`\`
init containers    ONE AT A TIME, IN ORDER, completion tak (exit 0), kisi app container ke
                   start hone se PEHLE chalte hain. use: wait-for-dependency, schema migration,
                   config/secrets fetch, volume permissions fix.
app containers     main workload. usually ONE.
sidecar containers ek helper jo app container ke LIFE ke liye chalta hai, iske saath:
                   ek log shipper, metrics exporter, service-mesh proxy. (modern k8s: ek
                   native "sidecar" = ek initContainer with restartPolicy: Always.)
\`\`\`

**POD LIFECYCLE — phase + conditions:**
\`\`\`
Pending      accepted, saare containers running nahi (scheduling / image pull / init)
Running      ek node se bound, >=1 container running
Succeeded    saare containers exit 0 aur restart nahi karenge
Failed       saare containers terminated, >=1 non-zero
conditions:  PodScheduled · Initialized · ContainersReady · Ready
\`\`\`

**restartPolicy (Pod ke andar CONTAINERS par applies):**
\`\`\`
Always       (default) forever restart. Deployments ke liye.
OnFailure    sirf non-zero exit par. retry karne wale Jobs ke liye.
Never        kabhi restart nahi. run-once Jobs ke liye.
\`\`\`
Ek container jo crash karta rehta hai -> \`CrashLoopBackOff\` (exponential backoff). \`kubectl logs
<pod> -c <ctr> --previous\` last crash dikhata hai.

**AAP KABHI-KABHI EK BARE POD LIKHTE HO.** Ek bare Pod reschedule nahi hota agar iska node marta hai.
Aap ek **Deployment** (Module 8) likhte ho jiska template ek Pod spec hai.`,

    content: `## The Pod is the unit, not the container

Kubernetes does not schedule containers; it schedules **Pods**. A Pod is a group of one or more containers that Kubernetes guarantees will always run **on the same node**, that share a single network identity, and that are created, scheduled, and deleted as one unit. Most Pods have exactly one container, and for those a Pod is a thin wrapper. The Pod abstraction earns its place when a workload genuinely needs two or more tightly-coupled processes co-located.

### What the containers in a Pod share

- **A network namespace.** The whole Pod has **one IP address**. Every container in the Pod sees the same network interfaces and the same \`localhost\`, so containers in a Pod talk to each other over \`localhost:<port>\` with no service discovery. The consequence: two containers in one Pod **cannot bind the same port**.
- **Volumes.** Any volume declared in \`pod.spec.volumes\` can be mounted into **more than one** container in the Pod, which is how containers in a Pod pass files to each other — most commonly an \`emptyDir\` (a scratch directory that lives as long as the Pod).
- **IPC**, optionally the **PID namespace** (so containers can see each other's processes), and the Pod's **lifecycle** — they are scheduled together and terminated together.

### What they do **not** share

- **The filesystem root.** Each container has its own image and its own root filesystem; a shared volume is the only way to share files.
- **CPU and memory limits.** Requests and limits are set **per container**, and the Pod's total is the sum.
- **The PID namespace by default** (each container is PID 1 in its own view).

## Three kinds of container

### init containers

Listed under \`spec.initContainers\`, they run **before** any app container, **one at a time**, **in the order listed**, and each must **exit 0** before the next starts. If one fails, the kubelet restarts it according to the Pod's \`restartPolicy\`, and the app containers do not start until all init containers have succeeded. Uses:

- **Wait for a dependency** — loop until the database's port answers, so the app container starts against a ready dependency (an alternative to app-level retry).
- **Run a one-time setup** — apply schema migrations, seed a cache, generate a config file from a template.
- **Fetch secrets or config** — pull from a vault into a shared \`emptyDir\` that the app container then reads.
- **Fix permissions** — \`chown\` a mounted volume so the non-root app user can write to it.

### app containers

The workload. Usually one. If there are several under \`spec.containers\` they start roughly together and run concurrently for the life of the Pod.

### sidecar containers

A helper container that runs **for the whole life of the main container**, alongside it: a log-shipping agent that tails the app's log file from a shared volume, a metrics exporter that translates the app's internal stats to Prometheus format, a service-mesh proxy (Envoy) that intercepts the Pod's traffic, a config reloader that watches a mounted ConfigMap and signals the app on change.

Historically a sidecar was just another entry under \`spec.containers\`, which had two problems: it started at the same time as the app (races), and it did not stop until the app stopped (a Job with a mesh sidecar would never complete). Modern Kubernetes (1.28+, stable in 1.33) has a **native sidecar**: an entry under \`spec.initContainers\` with \`restartPolicy: Always\`. It starts **before** the app containers (so the proxy is ready first), keeps running while they run, and is terminated **after** them.

## Pod lifecycle

A Pod has a **phase** — a deliberately coarse, one-word summary:

| Phase | Meaning |
|---|---|
| **Pending** | accepted by the API server, but not all containers are running — waiting to be scheduled, pulling images, or running init containers |
| **Running** | bound to a node, and at least one container is running (or starting/restarting) |
| **Succeeded** | all containers have terminated with exit 0 and will not be restarted |
| **Failed** | all containers have terminated, at least one with a non-zero exit, and will not be restarted |
| **Unknown** | the node hosting the Pod is unreachable |

The phase is too coarse to act on; the detail is in the **conditions**, each \`{type, status}\`:

- **PodScheduled** — a node has been assigned.
- **Initialized** — all init containers have completed successfully.
- **ContainersReady** — every app container passes its readiness probe.
- **Ready** — the Pod is ready to serve; it is added to Service endpoints only when this is \`True\`.

## restartPolicy

Set on the Pod, applied to the **containers within it** by the kubelet:

- **\`Always\`** (the default) — restart any container that exits, regardless of exit code, forever. This is correct for a long-running service and is what a Deployment's Pods use.
- **\`OnFailure\`** — restart a container only if it exits non-zero. For a Job whose task should be retried on transient failure.
- **\`Never\`** — never restart a container. For a run-once Job.

A container that exits and is restarted, then exits again quickly, enters **CrashLoopBackOff**: the kubelet waits an exponentially increasing delay before each restart — 10 seconds, then 20, 40, and so on, capped at 5 minutes — to avoid hammering a broken container. The Pod\'s status shows \`CrashLoopBackOff\` and the restart count climbs. \`kubectl logs <pod> -c <container> --previous\` shows the log from the **crashed** instance, which is where the actual error is.

## You almost never write a bare Pod

A Pod you create directly is not managed by anything. If its node fails, it is **not rescheduled** — it is just gone. If you delete it, nothing **replaces** it. It has no concept of a **rollout** or a **rollback**. It does not scale.

In practice you write a **Deployment** (Module 8), whose \`spec.template\` is a Pod spec, and the Deployment and ReplicaSet controllers create and manage the actual Pods — rescheduling them on node failure, replacing them when deleted, rolling them over on an update. Other controllers wrap Pods for other purposes: a **StatefulSet** for Pods with stable identities and storage, a **DaemonSet** for one Pod per node, a **Job** for run-to-completion tasks (Module 9).

Bare Pods are appropriate for exactly one thing: **one-off interactive debugging**, with \`kubectl run debug --rm -it --image=... --restart=Never -- sh\`, which creates a Pod, drops you into a shell, and deletes it when you exit.

## Inspecting a Pod

- **\`kubectl describe pod <name>\`** — the events (scheduling, image pulls, probe failures, restarts), the per-container state (Running / Waiting with a reason / Terminated with an exit code), and the probe configuration and results.
- **\`kubectl logs <pod> [-c <container>] [-f] [--previous]\`** — a container's stdout/stderr; \`-c\` selects a container in a multi-container Pod, \`-f\` follows, \`--previous\` reads the last terminated instance.
- **\`kubectl get pod <name> -o wide\`** — adds the node and the Pod IP.
- **\`kubectl exec -it <pod> -c <container> -- sh\`** — a shell inside a running container.`,

    contentHi: `## Pod unit hai, container nahi

Kubernetes containers schedule nahi karta; ye **Pods** schedule karta hai. Ek Pod ek ya zyada containers ka ek group hai jo Kubernetes guarantee karta hai hamesha **same node par** chalega, jo ek single network identity share karte hain, aur jo ek unit ke roop mein created, scheduled, aur deleted hote hain. Zyaadatar Pods ke paas exactly ek container hota hai.

**Ek Pod mein containers kya share karte hain:** **Ek network namespace** (poore Pod ke paas **ek IP address** hai; ek Pod mein containers ek doosre se \`localhost:<port>\` par baat karte hain; do containers **same port bind nahi kar sakte**). **Volumes** (\`pod.spec.volumes\` mein koi bhi volume **ek se zyada** containers mein mount ho sakta hai — aksar ek \`emptyDir\`). **IPC**, optionally **PID namespace**, aur Pod ka **lifecycle**.

**Wo kya NAHI share karte:** **Filesystem root** (har container ka apna image). **CPU aur memory limits** (**per container**). **PID namespace by default**.

## Teen kinds of container

**init containers** — \`spec.initContainers\` ke under, wo kisi app container se **pehle** chalte hain, **ek baar mein ek**, **listed order mein**, aur har ek ko agla start hone se pehle **exit 0** karna chahiye. Uses: **wait for a dependency**, **run a one-time setup** (schema migrations), **fetch secrets/config**, **fix permissions**.

**app containers** — workload. Usually ek.

**sidecar containers** — ek helper container jo main container ke **poore life ke liye** chalta hai, iske saath: ek log-shipping agent, ek metrics exporter, ek service-mesh proxy. Modern Kubernetes ke paas ek **native sidecar** hai: \`spec.initContainers\` ke under ek entry with \`restartPolicy: Always\`. Ye app containers se **pehle** start hota hai, unke chalne ke dauran chalta rehta hai, aur unke **baad** terminated hota hai.

## Pod lifecycle

Ek Pod ke paas ek **phase** hai: **Pending** (accepted, saare containers running nahi), **Running** (ek node se bound, >=1 container running), **Succeeded** (saare exit 0), **Failed** (saare terminated, >=1 non-zero), **Unknown** (node unreachable). Detail **conditions** mein hai: **PodScheduled**, **Initialized**, **ContainersReady**, **Ready** (Pod sirf tab Service endpoints mein add hota hai jab ye \`True\` hai).

## restartPolicy

Pod par set, kubelet dwara **iske andar containers** par applied: **\`Always\`** (default — forever restart; Deployments), **\`OnFailure\`** (sirf non-zero exit par; retry karne wale Jobs), **\`Never\`** (kabhi nahi; run-once Jobs). Ek container jo crash karta rehta hai **CrashLoopBackOff** mein enter karta hai (exponential backoff, 5m par capped). \`kubectl logs <pod> -c <container> --previous\` **crashed** instance se log dikhata hai.

## Aap lagbhag kabhi ek bare Pod nahi likhte

Ek Pod jo aap directly banate ho kisi cheez dwara managed nahi hai. Agar iska node fail hota hai, ye **reschedule nahi hota**. Aap ek **Deployment** (Module 8) likhte ho, jiska \`spec.template\` ek Pod spec hai. Bare Pods exactly ek cheez ke liye appropriate hain: **one-off interactive debugging**, \`kubectl run debug --rm -it --image=... --restart=Never -- sh\` ke saath.`,

    examples: [
      {
        title: 'A multi-container Pod: shared IP, shared volume, init runs first',
        titleHi: 'Ek multi-container Pod: shared IP, shared volume, init pehle chalta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m7l4-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

cat <<EOF | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Pod
metadata: { name: multi, labels: { app: multi } }
spec:
  initContainers:
    - name: setup
      image: busybox:1.36
      command: ["sh","-c","echo 'prepared by init' > /work/data.txt"]
      volumeMounts: [ { name: work, mountPath: /work } ]
  containers:
    - name: app
      image: busybox:1.36
      command: ["sh","-c","httpd -f -p 8080 -h /work"]   # serves /work on :8080
      volumeMounts: [ { name: work, mountPath: /work } ]
    - name: helper
      image: busybox:1.36
      command: ["sh","-c","sleep 3600"]
  volumes: [ { name: work, emptyDir: {} } ]
EOF
kubectl -n "$ns" wait --for=condition=Ready pod/multi --timeout=90s >/dev/null

echo "--- both containers are in ONE Pod, on ONE node, sharing ONE IP ---"
kubectl -n "$ns" get pod multi -o jsonpath='containers={range .spec.containers[*]}{.name},{end} node={.spec.nodeName} podIP={.status.podIP}{"\\n"}' | sed -E 's/podIP=[0-9.]+/podIP=<ip>/'

echo "--- 'helper' reaches 'app' over localhost (same network namespace) ---"
kubectl -n "$ns" exec multi -c helper -- wget -qO- http://localhost:8080/data.txt

echo "--- and it's reading the file the INIT container wrote into the shared volume ---"
kubectl -n "$ns" exec multi -c app -- cat /work/data.txt`,
        output: `--- both containers are in ONE Pod, on ONE node, sharing ONE IP ---
containers=app,helper, node=devprep-control-plane podIP=<ip>
--- 'helper' reaches 'app' over localhost (same network namespace) ---
prepared by init
--- and it's reading the file the INIT container wrote into the shared volume ---
prepared by init`,
        explain: 'The Pod has one init container and two app containers. The init container runs first and to completion, writing a file into a volume; only after it exits does the kubelet start the app containers. Reading the Pod object confirms the two app containers are a single unit: they are listed together, they are on one node, and they share one Pod IP. The helper container then reaches the app container by connecting to localhost on the app\'s port, with no service or DNS involved, because both containers share the Pod\'s network namespace and therefore the same loopback interface — which is also why they could not both listen on port 8080. The content the helper retrieves is the file the init container wrote, which the app container is serving; the init container, the app container, and the helper all mounted the same volume, so a file created by one is visible to the others. This is the entire multi-container Pod model: co-scheduling, a shared network identity, and shared volumes, used sparingly for genuinely coupled processes.',
        explainHi: 'Pod ke paas ek init container aur do app containers hain. Init container pehle aur completion tak chalta hai, ek volume mein ek file likhta hai; sirf iske exit hone ke baad kubelet app containers start karta hai. Pod object padhna confirm karta hai do app containers ek single unit hain: wo saath listed hain, ek node par hain, aur ek Pod IP share karte hain. Helper container phir app container ko localhost par app ke port par connect karke reach karta hai, koi service ya DNS involved nahi, kyunki dono containers Pod ka network namespace share karte hain — jo ye bhi hai ki wo dono port 8080 par listen nahi kar sakte the. Jo content helper retrieve karta hai wo file hai jo init container ne likhi.',
      },
      {
        title: 'CrashLoopBackOff: a broken container, backoff, and --previous',
        titleHi: 'CrashLoopBackOff: ek broken container, backoff, aur --previous',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m7l4b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

kubectl -n "$ns" run crasher --image=busybox:1.36 --restart=Always \\
  -- sh -c 'echo "starting up..."; echo "config error: missing DB_URL"; sleep 2; exit 1' >/dev/null

# wait until the kubelet has actually put it into CrashLoopBackOff (backs off between restarts)
for _ in $(seq 1 40); do
  wr=$(kubectl -n "$ns" get pod crasher -o jsonpath='{.status.containerStatuses[0].state.waiting.reason}' 2>/dev/null)
  [ "$wr" = CrashLoopBackOff ] && break
  sleep 2
done

echo "--- the Pod's container state ---"
kubectl -n "$ns" get pod crasher -o jsonpath='phase={.status.phase} waitingReason={.status.containerStatuses[0].state.waiting.reason} restarts>={.status.containerStatuses[0].restartCount}{"\\n"}' \\
  | sed -E 's/restarts>=[0-9]+/restarts>=1/'

echo "--- 'kubectl logs' shows the CURRENT (waiting) container: little/nothing yet ---"
kubectl -n "$ns" logs crasher 2>&1 | head -1

echo "--- 'kubectl logs --previous' shows the LAST CRASH: the real error ---"
kubectl -n "$ns" logs crasher --previous 2>&1 | grep -E 'starting up|missing DB_URL'`,
        output: `--- the Pod's container state ---
phase=Running waitingReason=CrashLoopBackOff restarts>=1
--- 'kubectl logs' shows the CURRENT (waiting) container: little/nothing yet ---
starting up...
--- 'kubectl logs --previous' shows the LAST CRASH: the real error ---
starting up...
config error: missing DB_URL`,
        explain: 'The container is configured to print a line, write an error to stderr, and exit non-zero. With the default restart policy the kubelet restarts it, it fails again immediately, and after a couple of quick failures the kubelet applies an exponentially increasing delay between restarts and reports the container state as CrashLoopBackOff. The Pod phase is still Running, because the phase is a coarse summary and a Pod with a container that is repeatedly restarting is not Failed; the useful signal is the container state\'s waiting reason. The important operational detail is which log a plain logs command shows: it shows the current container instance, which during a backoff has either just started or not started, so it contains little or nothing. Adding the previous flag shows the log from the instance that most recently terminated, which is where the actual failure output is — here the error message written to stderr before the non-zero exit. For any CrashLoopBackOff, the previous flag is how you see why it crashed rather than watching it crash again.',
        explainHi: 'Container ek line print karne, stderr par ek error likhne, aur non-zero exit karne ke liye configured hai. Default restart policy ke saath kubelet ise restart karta hai, ye phir turant fail hota hai, aur kuch quick failures ke baad kubelet restarts ke beech ek exponentially increasing delay apply karta hai aur container state ko CrashLoopBackOff report karta hai. Pod phase abhi bhi Running hai, kyunki phase ek coarse summary hai. Important operational detail ye hai ki ek plain logs command kaunsa log dikhata hai: ye current container instance dikhata hai, jo ek backoff ke dauran ya to abhi start hua ya start nahi hua. Previous flag add karna us instance se log dikhata hai jo sabse recently terminated hua — jahan actual failure output hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# creating a bare Pod for a real workload
$ kubectl run api --image=myco/api:1.4 --port=3000
# it runs! ...until:
#   - the node it's on is drained for an upgrade -> the Pod is DELETED, not
//    moved. your service is down and stays down.
#   - you 'kubectl delete pod api' by mistake -> nothing recreates it.
#   - you want to ship v1.5 -> there's no rollout; you delete + recreate by hand.`,
        right: `# write a Deployment; its template IS the Pod spec, and controllers manage the Pods:
apiVersion: apps/v1
kind: Deployment
metadata: { name: api }
spec:
  replicas: 3
  selector: { matchLabels: { app: api } }
  template:
    metadata: { labels: { app: api } }
    spec:
      containers: [ { name: api, image: myco/api:1.4, ports: [ { containerPort: 3000 } ] } ]
# now: node drain -> Pods rescheduled. deleted Pod -> replaced. v1.5 -> rolling update.
# bare Pods are ONLY for: kubectl run debug --rm -it --image=... --restart=Never -- sh`,
        why: 'A Pod created on its own is not owned by any controller, so nothing watches it or acts on its behalf. When the node it is running on is removed from service — a routine event during cluster upgrades and scale-downs — the Pod is deleted along with the node and is not recreated anywhere, because there is no controller with a desired state that includes it. If the Pod is deleted by accident, the same applies: it simply ceases to exist. There is no mechanism to update its image in a controlled way, so a new version means manually deleting and recreating, with downtime. A Deployment solves all of this: its spec contains a Pod template and a replica count as desired state, and its controllers continuously ensure that many Pods matching the template exist, recreating them when they are lost and rolling them over to a new template when the Deployment is updated. Writing the workload as a Deployment, with the Pod spec as the Deployment\'s template, is the normal way to run anything. Bare Pods are reserved for short-lived interactive debugging where the lack of management is the point.',
        whyHi: 'Ek Pod jo apne aap banaya gaya kisi controller dwara owned nahi hai, to kuch bhi ise watch nahi karta ya iske behalf par act nahi karta. Jab wo node jispar ye chal raha hai service se remove hota hai — cluster upgrades aur scale-downs ke dauran ek routine event — Pod node ke saath delete ho jaata hai aur kahin recreate nahi hota. Agar Pod galti se delete hota hai, wahi applies. Iski image ko ek controlled way mein update karne ka koi mechanism nahi hai. Ek Deployment ye sab solve karta hai: iska spec ek Pod template aur ek replica count desired state ke roop mein contain karta hai, aur iske controllers continuously ensure karte hain ki template se matching bahut se Pods exist karein.',
      },
      {
        wrong: `# a Job that never completes because its sidecar never exits
apiVersion: batch/v1
kind: Job
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migrate
          image: myco/migrate:1.4    # runs migrations, exits 0
        - name: mesh-proxy
          image: envoyproxy/envoy    # runs forever
# -> the 'migrate' container finishes. the Job waits for ALL containers to
//    terminate. 'mesh-proxy' never does. the Job is stuck "1 running" forever.`,
        right: `# make the proxy a NATIVE SIDECAR (initContainer + restartPolicy: Always):
spec:
  template:
    spec:
      restartPolicy: Never
      initContainers:
        - name: mesh-proxy
          image: envoyproxy/envoy
          restartPolicy: Always      # <- this makes it a sidecar
      containers:
        - name: migrate
          image: myco/migrate:1.4
# native sidecars start BEFORE the app container and are terminated AFTER it
# exits -> the Job's main container finishes, the sidecar is stopped, Job completes.`,
        why: 'A Job is complete when its Pod\'s containers have all terminated successfully. A helper container placed in the ordinary containers list runs for the life of the Pod and does not exit on its own, so a Job that includes such a helper — a service-mesh proxy, a log shipper, a metrics agent — never reaches the state where all containers have terminated, and it stays running indefinitely with the main task long finished. The same design also causes a startup race in a normal Pod, because an ordinary helper container starts at the same time as the app container rather than before it, so the app may begin before the proxy is ready to carry its traffic. The native sidecar mechanism fixes both: a container listed under initContainers with its restart policy set to Always is started before the regular containers, kept running alongside them, and terminated after they exit. For a Job this means the main container runs to completion, the sidecar is then stopped by the kubelet, all containers have terminated, and the Job completes. For a normal Pod it means the sidecar is ready before the app starts.',
        whyHi: 'Ek Job complete hai jab iske Pod ke containers sab successfully terminated ho gaye. Ek helper container jo ordinary containers list mein rakha gaya Pod ke life ke liye chalta hai aur apne aap exit nahi karta, to ek Job jo aise helper ko include karta hai kabhi us state par nahi pahunchta jahan saare containers terminated ho gaye. Same design ek normal Pod mein ek startup race bhi cause karta hai, kyunki ek ordinary helper container app container ke saath start hota hai iske pehle nahi. Native sidecar mechanism dono fix karta hai: ek container jo initContainers ke under listed hai iski restart policy Always set ke saath regular containers se pehle start hota hai, unke saath chalta rehta hai, aur unke exit hone ke baad terminated hota hai.',
      },
      {
        wrong: `# two containers in one Pod both trying to listen on :8080
spec:
  containers:
    - { name: app,     image: myco/app }       # listens on :8080
    - { name: metrics, image: myco/metrics }   # ALSO listens on :8080
# -> the second container to start gets "bind: address already in use" and
//    crashes. containers in a Pod SHARE the network namespace = ONE localhost.`,
        right: `# they share one network namespace -> pick distinct ports:
spec:
  containers:
    - { name: app,     image: myco/app,     ports: [ { containerPort: 8080 } ] }
    - { name: metrics, image: myco/metrics, ports: [ { containerPort: 9090 } ] }
# each is reachable on the Pod IP at its own port; they reach each other on
# localhost:8080 / localhost:9090. (if you truly need same-port isolation,
# they belong in separate Pods.)`,
        why: 'Containers in the same Pod share a single network namespace, which means they share one set of network interfaces and one loopback address. A listening socket bound to a port occupies that port for the whole namespace, so if one container binds a port, another container in the same Pod attempting to bind the same port fails with an address-in-use error and does not start. This is a direct consequence of the Pod\'s shared network identity, the same property that lets the containers reach each other over localhost without any service discovery. The resolution is to assign each container a distinct port; each is then independently reachable on the Pod\'s single IP at its own port, and they communicate with each other over localhost using those ports. If two components genuinely must both use the same fixed port and cannot be reconfigured, that is a signal they should not be in the same Pod — separate Pods have separate network namespaces and separate IPs.',
        whyHi: 'Same Pod mein containers ek single network namespace share karte hain, jiska matlab wo ek set of network interfaces aur ek loopback address share karte hain. Ek port se bound ek listening socket us port ko poore namespace ke liye occupy karta hai, to agar ek container ek port bind karta hai, same Pod mein ek doosra container same port bind karne ki koshish kar raha fail hota hai ek address-in-use error ke saath aur start nahi hota. Resolution har container ko ek distinct port assign karna hai. Agar do components genuinely dono same fixed port use karna chahiye aur reconfigure nahi ho sakte, wo ek signal hai ki wo same Pod mein nahi hone chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**A bare `kubectl run` Pod that vanished during a node pool upgrade** — the "temporary" API someone stood up two months earlier had no Deployment. Node drained, Pod deleted, an integration broke silently. Everything is a Deployment/StatefulSet/DaemonSet now; bare Pods are blocked by an admission policy except in a `debug` namespace.',
        hi: '**Ek bare `kubectl run` Pod jo ek node pool upgrade ke dauran vanish hua** — jo "temporary" API kisi ne do mahine pehle stand up kiya iska koi Deployment nahi tha.',
      },
      {
        en: '**A migration Job stuck at "1 active" for 6 hours** — an Envoy sidecar in the `containers` list never exited. Switched it to a native sidecar (`initContainers` + `restartPolicy: Always`); the Job completes cleanly now.',
        hi: '**Ek migration Job 6 ghante "1 active" par stuck** — `containers` list mein ek Envoy sidecar kabhi exit nahi hua.',
      },
      {
        en: '**A CrashLoopBackOff nobody could diagnose from `kubectl logs`** (empty — the container barely started) until someone ran `kubectl logs --previous` and saw `FATAL: config file not found` from the last crash. `--previous` is now the first thing the runbook says to run.',
        hi: '**Ek CrashLoopBackOff jise koi `kubectl logs` se diagnose nahi kar saka** jab tak kisi ne `kubectl logs --previous` nahi chalaya aur last crash se `FATAL: config file not found` dekha.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a Pod, what do the containers in it share, and when would you put more than one container in a Pod?',
        qHi: 'Ek Pod kya hai, ismein containers kya share karte hain, aur aap ek Pod mein ek se zyada container kab rakhoge?',
        a: 'A Pod is the smallest unit Kubernetes schedules: one or more containers that are guaranteed to run on the same node and are created, scheduled, and deleted together. The containers in a Pod share a network namespace, which means the whole Pod has one IP address and the containers reach each other over localhost with no service discovery, and as a consequence two containers in a Pod cannot bind the same port. They can share volumes: any volume declared on the Pod can be mounted into more than one container, which is how they pass files, commonly through an emptyDir scratch directory. They also share IPC and the Pod lifecycle, and optionally the PID namespace. They do not share a filesystem root — each container has its own image — and resource requests and limits are set per container. You put more than one container in a Pod only when the processes are genuinely tightly coupled and must be co-located: a main container plus a sidecar that supports it for its whole life, such as a log-shipping agent reading the app\'s log file from a shared volume, a metrics exporter, or a service-mesh proxy; or a main container preceded by init containers that run to completion first, in order, to wait for a dependency, run a migration, fetch config, or fix volume permissions. If two components are only loosely related, they belong in separate Pods.',
        aHi: 'Ek Pod sabse chhoti unit hai jo Kubernetes schedule karta hai: ek ya zyada containers jo same node par chalne ki guarantee hai aur saath created, scheduled, aur deleted hote hain. Ek Pod mein containers ek network namespace share karte hain, jiska matlab poore Pod ke paas ek IP address hai aur containers ek doosre ko localhost par reach karte hain, aur ek consequence ke roop mein ek Pod mein do containers same port bind nahi kar sakte. Wo volumes share kar sakte hain. Wo IPC aur Pod lifecycle bhi share karte hain. Wo ek filesystem root share nahi karte. Aap ek Pod mein ek se zyada container tabhi rakhte ho jab processes genuinely tightly coupled hain: ek main container plus ek sidecar, ya init containers jo pehle completion tak chalte hain.',
      },
      {
        q: 'Explain restartPolicy, CrashLoopBackOff, and why `kubectl logs --previous` matters.',
        qHi: 'restartPolicy, CrashLoopBackOff, aur `kubectl logs --previous` kyun matter karta hai samjhao.',
        a: 'restartPolicy is set on the Pod and applied by the kubelet to the containers within it. Always, the default, restarts any container that exits regardless of exit code, and is what a long-running service and a Deployment\'s Pods use. OnFailure restarts a container only on a non-zero exit, for a Job whose task should be retried. Never does not restart a container, for a run-once Job. When a container with a restart policy that restarts it exits, is restarted, and exits again quickly, the kubelet does not restart it immediately every time; it waits an exponentially increasing delay — ten seconds, then twenty, forty, and so on up to a five-minute cap — and reports the container state as CrashLoopBackOff. The Pod phase stays Running because the phase is coarse; the signal is the container state\'s waiting reason. The reason kubectl logs --previous matters is that a plain kubectl logs shows the current container instance, and during a backoff that instance has just started or not started at all, so its log is empty or nearly so. The --previous flag shows the log from the instance that most recently terminated, which is where the actual error that caused the crash was written. For any CrashLoopBackOff, --previous is how you find out why it is crashing without waiting to watch it crash again.',
        aHi: 'restartPolicy Pod par set hoti hai aur kubelet dwara iske andar containers par applied hoti hai. Always, default, kisi bhi container ko restart karti hai jo exit hota hai. OnFailure sirf ek non-zero exit par restart karti hai. Never ek container ko restart nahi karti. Jab ek container jo restart policy ise restart karta hai exit hota hai, restart hota hai, aur phir turant exit hota hai, kubelet ise har baar turant restart nahi karta; ye ek exponentially increasing delay wait karta hai aur container state ko CrashLoopBackOff report karta hai. `kubectl logs --previous` isliye matter karta hai kyunki ek plain `kubectl logs` current container instance dikhata hai, aur ek backoff ke dauran wo instance abhi start hua ya start nahi hua. `--previous` flag us instance se log dikhata hai jo sabse recently terminated hua — jahan actual error likha gaya.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list what containers in a Pod DO share and what they do NOT, and explain the concrete consequence of the shared network namespace.',
        taskHi: 'Ek comment mein, list karo Pod mein containers kya SHARE karte hain aur kya NAHI.',
        hint: 'SHARE: the NETWORK namespace (ONE Pod IP; containers talk over `localhost:<port>` with no DNS); VOLUMES (any `pod.spec.volumes` entry can mount into MULTIPLE containers — pass files, e.g. `emptyDir`); IPC; the LIFECYCLE (scheduled together, deleted together, live/die as a unit); optionally the PID namespace. DO NOT SHARE: the filesystem root (each container has its own image rootfs — a shared volume is the ONLY way to share files); CPU/memory requests+limits (per-CONTAINER, Pod total = the sum); the PID namespace by default. CONSEQUENCE of the shared network namespace: two containers in one Pod CANNOT bind the same port — the second gets "bind: address already in use" and crashes. Give them distinct ports, or if they truly need the same port, they belong in separate Pods (separate namespaces → separate IPs).',
        hintHi: 'SHARE: NETWORK namespace (ONE Pod IP; `localhost:<port>` par baat, no DNS); VOLUMES (koi bhi `pod.spec.volumes` entry MULTIPLE containers mein mount ho sakti hai — `emptyDir`); IPC; LIFECYCLE (saath scheduled/deleted); optionally PID namespace. NAHI SHARE: filesystem root (har container ka apna image); CPU/memory requests+limits (per-CONTAINER); PID namespace by default. CONSEQUENCE: do containers same port bind NAHI kar sakte — doosre ko "bind: address already in use" milta hai. Distinct ports do, ya separate Pods.',
      },
      {
        task: 'In a comment, define init containers vs sidecars, and explain why an old-style sidecar in a Job\'s `containers` list makes the Job hang forever — and the native-sidecar fix.',
        taskHi: 'Ek comment mein, init containers vs sidecars define karo.',
        hint: 'INIT CONTAINERS (`spec.initContainers`): run ONE AT A TIME, IN ORDER, to completion (exit 0), BEFORE any app container starts; a failure → restarted per `restartPolicy`, app containers wait. Uses: wait-for-a-dependency, run a schema migration, fetch config/secrets into a shared `emptyDir`, `chown` a volume for a non-root user. SIDECARS: a helper that runs FOR THE LIFE of the main container, alongside it — a log shipper, metrics exporter, mesh proxy, config reloader. OLD STYLE (just another `containers` entry): (a) starts at the SAME time as the app → races; (b) never exits on its own → a JOB (which is done only when ALL containers terminate) hangs forever with the main task long finished. NATIVE SIDECAR (K8s 1.28+, stable 1.33): an entry under `initContainers` with `restartPolicy: Always` → starts BEFORE the app containers (proxy ready first), runs alongside, terminated AFTER them → the Job\'s main container completes, the kubelet stops the sidecar, all containers terminate, Job completes.',
        hintHi: 'INIT CONTAINERS: ONE AT A TIME, IN ORDER, completion tak, kisi app container se PEHLE; failure → `restartPolicy` per restarted. Uses: wait-for-dependency, schema migration, config/secrets fetch, `chown` a volume. SIDECARS: ek helper jo main container ke LIFE ke liye chalta hai. OLD STYLE (ek `containers` entry): (a) app ke SAATH start → races; (b) apne aap kabhi exit nahi → ek JOB forever hangs. NATIVE SIDECAR (K8s 1.28+): `initContainers` ke under `restartPolicy: Always` ke saath ek entry → app se PEHLE start, saath chalta hai, unke BAAD terminated → Job completes.',
      },
      {
        task: 'In a comment, explain why you almost never create a bare Pod for a real workload (3 concrete failures), what you write instead, and the one legitimate use of a bare Pod.',
        taskHi: 'Ek comment mein, samjhao kyun aap lagbhag kabhi ek real workload ke liye ek bare Pod nahi banate.',
        hint: 'A bare Pod is owned by NO controller → nothing watches it or acts for it. Three concrete failures: (1) its node is DRAINED for an upgrade → the Pod is DELETED, not moved → your service is down and stays down; (2) someone `kubectl delete pod` by mistake → NOTHING recreates it; (3) you want to ship a new version → there\'s NO rollout/rollback — you delete + recreate by hand with downtime. Also: it doesn\'t scale. INSTEAD write a DEPLOYMENT (Module 8) whose `spec.template` IS a Pod spec + a `replicas` count → the Deployment + ReplicaSet controllers reschedule Pods on node failure, replace deleted ones, and roll them over on an update. (Other wrappers: StatefulSet for stable identity+storage, DaemonSet for one-per-node, Job for run-to-completion.) The ONE legitimate bare-Pod use: one-off interactive debugging — `kubectl run debug --rm -it --image=... --restart=Never -- sh` (creates a Pod, gives you a shell, deletes it on exit).',
        hintHi: 'Ek bare Pod kisi controller dwara owned NAHI → kuch bhi ise watch nahi karta. Teen failures: (1) iska node DRAINED hota hai → Pod DELETED, moved nahi → service down; (2) koi `kubectl delete pod` galti se → KUCH ise recreate nahi karta; (3) ek naya version → KOI rollout/rollback nahi. INSTEAD ek DEPLOYMENT likho jiska `spec.template` ek Pod spec HAI + ek `replicas` count. ONE legitimate use: one-off interactive debugging — `kubectl run debug --rm -it --image=... --restart=Never -- sh`.',
      },
    ],

    keyTakeaways: [
      'A POD = 1+ containers ALWAYS co-scheduled onto ONE node, sharing ONE network identity, created/scheduled/deleted as a UNIT. It is the smallest thing K8s schedules — NOT a container, a Pod. Most Pods have exactly one container. SHARED: the NETWORK namespace (ONE Pod IP; containers reach each other over `localhost:<port>` with NO service discovery → two containers CANNOT bind the same port), VOLUMES (any `pod.spec.volumes` entry mounts into MULTIPLE containers — the way they pass files, usually an `emptyDir`), IPC, the LIFECYCLE, optionally the PID namespace. NOT SHARED: the filesystem root (each container has its own image rootfs), CPU/memory requests+limits (per-CONTAINER, Pod total = sum), the PID namespace by default.',
      'THREE KINDS OF CONTAINER: INIT CONTAINERS (`spec.initContainers`) run ONE AT A TIME, IN ORDER, to completion (exit 0), BEFORE any app container — wait-for-a-dependency, run a migration, fetch config/secrets into a shared `emptyDir`, `chown` a volume. APP CONTAINERS — the workload, usually ONE. SIDECARS — a helper that runs FOR THE LIFE of the main container (log shipper, metrics exporter, mesh proxy, config reloader). Old-style (just another `containers` entry) races the app on startup AND never exits → a JOB hangs forever. NATIVE SIDECAR (K8s 1.28+, stable 1.33) = an `initContainers` entry with `restartPolicy: Always` → starts BEFORE the app containers, runs alongside, terminated AFTER them.',
      'POD LIFECYCLE — PHASE (coarse: Pending = accepted, not all running / Running = ≥1 container running / Succeeded = all exited 0 / Failed = all terminated, ≥1 non-zero / Unknown = node unreachable) is too coarse to act on. The detail is in CONDITIONS: PodScheduled → Initialized (all init containers done) → ContainersReady → Ready (the Pod is added to Service endpoints ONLY when Ready == True).',
      'restartPolicy is set on the Pod, applied by the kubelet to the CONTAINERS within it: `Always` (default — restart any exit, forever — Deployments), `OnFailure` (only non-zero — retrying Jobs), `Never` (never — run-once Jobs). A container that exits→restarts→exits fast enters CRASHLOOPBACKOFF (exponential backoff: 10s, 20s, 40s ... capped at 5m); the Pod phase stays Running — the signal is `.status.containerStatuses[].state.waiting.reason`. `kubectl logs <pod>` shows the CURRENT (barely-started) instance = empty/useless; `kubectl logs <pod> -c <ctr> --previous` shows the LAST CRASH = the real error.',
      'YOU ALMOST NEVER WRITE A BARE POD. A bare Pod is owned by no controller → NOT rescheduled if its node drains/dies (it\'s just DELETED), NOT replaced if deleted, has NO rollout/rollback, doesn\'t scale. Write a DEPLOYMENT (Module 8) whose `spec.template` IS a Pod spec + a `replicas` count — its controllers reschedule, replace, and roll Pods over. (Other wrappers: StatefulSet, DaemonSet, Job — Module 9.) Bare Pods are for exactly ONE thing: one-off interactive debugging — `kubectl run debug --rm -it --image=... --restart=Never -- sh`. INSPECT a Pod: `kubectl describe pod` (events + per-container state + probe results), `kubectl logs <pod> [-c <ctr>] [-f] [--previous]`, `kubectl get pod -o wide` (node + IP), `kubectl exec -it <pod> -c <ctr> -- sh`.',
    ],
    keyTakeawaysHi: [
      'EK POD = 1+ containers HAMESHA ONE node par co-scheduled, ONE network identity share karte, ek UNIT ke roop mein created/scheduled/deleted. Ye sabse chhoti cheez hai jo K8s schedule karta hai — ek container NAHI, ek Pod. SHARED: NETWORK namespace (ONE Pod IP; `localhost:<port>` par baat, NO service discovery → do containers same port NAHI bind kar sakte), VOLUMES (koi bhi `pod.spec.volumes` entry MULTIPLE containers mein mount hoti hai), IPC, LIFECYCLE. NOT SHARED: filesystem root, CPU/memory limits (per-CONTAINER), PID namespace by default.',
      'TEEN KINDS OF CONTAINER: INIT CONTAINERS (`spec.initContainers`) ONE AT A TIME, IN ORDER, completion tak, kisi app container se PEHLE. APP CONTAINERS — workload, usually ONE. SIDECARS — ek helper jo main container ke LIFE ke liye chalta hai. Old-style startup par app se races AUR kabhi exit nahi → ek JOB forever hangs. NATIVE SIDECAR (K8s 1.28+) = ek `initContainers` entry with `restartPolicy: Always`.',
      'POD LIFECYCLE — PHASE (coarse: Pending / Running / Succeeded / Failed / Unknown) act karne ke liye bahut coarse hai. Detail CONDITIONS mein hai: PodScheduled → Initialized → ContainersReady → Ready (Pod SIRF tab Service endpoints mein add hota hai jab Ready == True).',
      'restartPolicy Pod par set hoti hai, kubelet dwara iske andar CONTAINERS par applied: `Always` (default — Deployments), `OnFailure` (retrying Jobs), `Never` (run-once Jobs). Ek container jo exit→restarts→exits fast CRASHLOOPBACKOFF mein enter karta hai (exponential backoff, 5m par capped). `kubectl logs <pod>` CURRENT instance dikhata hai = empty; `kubectl logs <pod> -c <ctr> --previous` LAST CRASH dikhata hai = real error.',
      'AAP LAGBHAG KABHI EK BARE POD NAHI LIKHTE. Ek bare Pod kisi controller dwara owned nahi → node drain/die par reschedule NAHI hota, delete hone par replace NAHI hota, koi rollout/rollback NAHI. Ek DEPLOYMENT (Module 8) likho jiska `spec.template` ek Pod spec HAI + ek `replicas` count. Bare Pods exactly ONE cheez ke liye: one-off interactive debugging — `kubectl run debug --rm -it --image=... --restart=Never -- sh`. INSPECT: `kubectl describe pod`, `kubectl logs [-c] [-f] [--previous]`, `kubectl get pod -o wide`, `kubectl exec -it`.',
    ],
  },

  {
    slug: 'ops-kubectl-essentials',
    title: 'kubectl Essentials',
    titleHi: 'kubectl Essentials',
    description: '`kubectl` is a thin client over the API server: it reads objects (`get`, `describe`), applies desired state (`apply`), and gives you windows into running Pods (`logs`, `exec`, `port-forward`). A handful of flags — `-o`, `-w`, `--dry-run`, `-n`, `--context` — and a habit of `describe` before anything else cover most day-to-day work.',
    descriptionHi: '`kubectl` API server ke upar ek thin client hai: ye objects padhta hai (`get`, `describe`), desired state apply karta hai (`apply`), aur aapko running Pods mein windows deta hai (`logs`, `exec`, `port-forward`). Kuch flags — `-o`, `-w`, `--dry-run`, `-n`, `--context` — aur kisi bhi cheez se pehle `describe` ki ek habit zyaadatar din-pratidin ke kaam ko cover karti hain.',
    difficulty: 'EASY',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A remote control for a machine you cannot touch.** Every button on it just sends a message to the machine\'s single control port (the API server) — there is no button that reaches inside directly. Some buttons ask for a readout (`get` for the summary, `describe` for the full panel with the warning lights and the last few events). One button submits a new settings sheet and the machine adjusts itself to match (`apply`). A few buttons open a temporary viewport into one component while it runs (`logs`, `exec`, `port-forward`) — close as soon as you\'re done. And there is a "show me what this would do" switch (`--dry-run`) you flip before pressing anything you are not sure about.',
      hi: '**Ek machine ke liye ek remote control jise aap touch nahi kar sakte.** Ispar har button bas machine ke single control port (API server) ko ek message bhejta hai — koi button nahi jo directly andar pahunchta hai. Kuch buttons ek readout maangte hain (`get` summary ke liye, `describe` full panel ke liye warning lights aur last few events ke saath). Ek button ek naya settings sheet submit karta hai aur machine khud ko match karne ke liye adjust karti hai (`apply`). Kuch buttons ek component mein ek temporary viewport kholte hain jab tak ye chalta hai (`logs`, `exec`, `port-forward`) — jaise hi aap done ho close karo. Aur ek "mujhe dikhao ye kya karega" switch (`--dry-run`) hai jise aap kuch bhi press karne se pehle flip karte ho jiske baare mein sure nahi ho.',
    },

    simple: `**kubectl talks ONLY to the API server. Every command is a REST call.** Config lives in
\`~/.kube/config\`: clusters + users + CONTEXTS (a context = cluster + user + default namespace).

**READ:**
\`\`\`
kubectl get <kind> [name]              a table. -A = all namespaces. -o wide = +node/IP.
kubectl get <kind> -o yaml|json         the full object (spec + status)
kubectl get <kind> -o jsonpath='{...}'  pull one field, for scripts
kubectl get <kind> -w                   WATCH: print a line on every change
kubectl describe <kind> <name>          human summary + EVENTS + per-container state
kubectl explain <kind>.spec.<field>     the schema (offline-ish, no object needed)
kubectl api-resources                   every kind, its short name, apiVersion, namespaced?
kubectl get events --sort-by=.lastTimestamp   what the controllers have been doing
\`\`\`

**WRITE (declarative — prefer this):**
\`\`\`
kubectl apply -f file.yaml | -f dir/ | -k overlay/    reconcile toward the file(s)
kubectl diff  -f dir/                                 what apply WOULD change
kubectl delete -f file.yaml | <kind> <name> | -l <sel>
\`\`\`
**WRITE (imperative — for scaffolding + quick fixes):**
\`\`\`
kubectl create deployment web --image=nginx --dry-run=client -o yaml > web.yaml   # scaffold!
kubectl scale deploy/web --replicas=5
kubectl set image deploy/web web=nginx:1.28
kubectl rollout restart deploy/web        # re-roll pods (e.g. to pick up a changed Secret)
kubectl label / annotate / patch / edit <kind> <name>
\`\`\`

**WINDOWS INTO RUNNING PODS:**
\`\`\`
kubectl logs <pod> [-c ctr] [-f] [--previous] [--since=1h] [--tail=100]
kubectl logs -l app=web --max-log-requests=10       logs from ALL pods matching a label
kubectl exec -it <pod> [-c ctr] -- sh               a shell inside a container
kubectl debug <pod> -it --image=busybox --target=app   ephemeral debug container (no shell in the image? this)
kubectl cp <pod>:/path ./local                       copy files
kubectl port-forward <pod>|svc/<name> 8080:80        tunnel a local port to the Pod/Service
\`\`\`

**FLAGS you'll use constantly:**
\`\`\`
-n <ns>            target a namespace   |  -A / --all-namespaces
--context <name>   target a cluster     |  kubectl config get-contexts / use-context
--dry-run=client   render locally, don't send  |  --dry-run=server  (send, validate, don't persist)
-o yaml|json|wide|name|jsonpath|custom-columns|go-template
-l <selector>      label selector: app=web,env!=prod,'tier in (a,b)'
--field-selector   e.g. status.phase=Running , metadata.namespace=default
-w / --watch       |  -v=6..9  raw HTTP request/response (debug RBAC/API issues)
\`\`\`

**THE HABIT: \`kubectl describe <kind> <name>\` FIRST.** The Events section at the bottom
is where controllers, the scheduler, and the kubelet say exactly what happened and why
something is stuck — before you guess, before you restart anything.

**SCAFFOLD, DON'T HAND-WRITE:** \`kubectl create <kind> ... --dry-run=client -o yaml\`
generates a valid skeleton you then edit + commit. \`kubectl explain\` fills in the fields.`,

    simpleHi: `**kubectl SIRF API server se baat karta hai. Har command ek REST call hai.** Config
\`~/.kube/config\` mein rehti hai: clusters + users + CONTEXTS (ek context = cluster + user + default namespace).

**READ:**
\`\`\`
kubectl get <kind> [name]              ek table. -A = all namespaces. -o wide = +node/IP.
kubectl get <kind> -o yaml|json         full object (spec + status)
kubectl get <kind> -o jsonpath='{...}'  ek field pull karo, scripts ke liye
kubectl get <kind> -w                   WATCH: har change par ek line print
kubectl describe <kind> <name>          human summary + EVENTS + per-container state
kubectl explain <kind>.spec.<field>     schema (offline-ish)
kubectl get events --sort-by=.lastTimestamp   controllers kya kar rahe hain
\`\`\`

**WRITE (declarative — ise prefer karo):**
\`\`\`
kubectl apply -f file.yaml | -f dir/ | -k overlay/    file(s) ki taraf reconcile
kubectl diff  -f dir/                                 apply KYA change karega
kubectl delete -f file.yaml | <kind> <name> | -l <sel>
\`\`\`
**WRITE (imperative — scaffolding + quick fixes ke liye):**
\`\`\`
kubectl create deployment web --image=nginx --dry-run=client -o yaml > web.yaml   # scaffold!
kubectl scale deploy/web --replicas=5
kubectl set image deploy/web web=nginx:1.28
kubectl rollout restart deploy/web        # pods re-roll (ek changed Secret pick karne ke liye)
kubectl label / annotate / patch / edit <kind> <name>
\`\`\`

**RUNNING PODS MEIN WINDOWS:**
\`\`\`
kubectl logs <pod> [-c ctr] [-f] [--previous] [--since=1h] [--tail=100]
kubectl exec -it <pod> [-c ctr] -- sh               ek container ke andar ek shell
kubectl debug <pod> -it --image=busybox --target=app   ephemeral debug container
kubectl cp <pod>:/path ./local                       files copy karo
kubectl port-forward <pod>|svc/<name> 8080:80        ek local port ko Pod/Service se tunnel
\`\`\`

**FLAGS:**
\`\`\`
-n <ns>            ek namespace target karo   |  -A / --all-namespaces
--context <name>   ek cluster target karo     |  kubectl config get-contexts / use-context
--dry-run=client   locally render, bhejo mat  |  --dry-run=server  (bhejo, validate, persist mat)
-o yaml|json|wide|name|jsonpath|custom-columns
-l <selector>      label selector: app=web,env!=prod,'tier in (a,b)'
-w / --watch       |  -v=6..9  raw HTTP
\`\`\`

**THE HABIT: \`kubectl describe <kind> <name>\` PEHLE.** Bottom par Events section wo jagah hai
jahan controllers, scheduler, aur kubelet exactly kehte hain kya hua aur kuch kyun stuck hai.

**SCAFFOLD, HAND-WRITE MAT KARO:** \`kubectl create <kind> ... --dry-run=client -o yaml\` ek valid
skeleton generate karta hai jise aap phir edit + commit karte ho.`,

    content: `## kubectl is a REST client

Every \`kubectl\` command translates to one or more HTTP calls to the API server; \`kubectl\` holds no state of its own. Its configuration is \`~/.kube/config\` (or files listed in \`$KUBECONFIG\`), which defines **clusters** (an API server URL and its CA), **users** (credentials — a client cert, a token, an exec plugin for cloud auth), and **contexts**. A **context** is a named triple of (cluster, user, default namespace); \`kubectl config get-contexts\` lists them, \`kubectl config use-context <name>\` switches, and \`--context <name>\` overrides for one command. Getting the wrong context is how people run a command against production thinking it was staging — check it.

## Reading

- **\`kubectl get <kind> [name]\`** — a table. \`-A\` / \`--all-namespaces\` spans namespaces. \`-o wide\` adds columns like the node and Pod IP. \`-o yaml\` / \`-o json\` prints the whole object. \`-o name\` prints \`kind/name\` (useful to pipe). \`-o jsonpath='{.status.phase}'\` or \`-o custom-columns=NAME:.metadata.name,NODE:.spec.nodeName\` extract specific fields for scripts.
- **\`kubectl get <kind> -w\`** — **watch**: prints a line every time an object of that kind is added, changed, or removed. This is how you see a rollout or a scale-up progress live.
- **\`kubectl describe <kind> <name>\`** — a human-readable rendering plus, at the bottom, the **Events** attached to the object: what the scheduler decided, what images were pulled, which probes failed, how many times a container restarted. **This is the first command to run for anything that is not working.**
- **\`kubectl explain <kind>.spec.<field>\`** — the schema, read from the API server, for writing manifests.
- **\`kubectl api-resources\`** — every kind the cluster knows, its short name (\`deploy\`, \`svc\`, \`po\`), its apiVersion, and whether it is namespaced.
- **\`kubectl get events --sort-by=.lastTimestamp -A\`** — a cluster-wide feed of what the controllers have been doing, newest last.

## Writing

**Declarative** is the default for anything real:

- **\`kubectl apply -f file.yaml\`**, **\`-f dir/\`** (every manifest in a directory), or **\`-k overlay/\`** (a Kustomize overlay) — reconcile the cluster toward the files.
- **\`kubectl diff -f dir/\`** — the change \`apply\` would make, as a diff.
- **\`kubectl delete -f file.yaml\`**, or by \`<kind> <name>\`, or by \`-l <selector>\`.

**Imperative** commands are for two things: **scaffolding** manifests, and **quick one-off changes** you will then also make in the file:

- **\`kubectl create <kind> ... --dry-run=client -o yaml\`** — generate a valid manifest skeleton. \`kubectl create deployment web --image=nginx --dry-run=client -o yaml > web.yaml\` gives you a correct Deployment to edit, rather than typing one from memory.
- **\`kubectl scale deploy/web --replicas=5\`**, **\`kubectl set image deploy/web web=nginx:1.28\`**, **\`kubectl set env deploy/web LOG_LEVEL=debug\`** — targeted spec changes.
- **\`kubectl rollout restart deploy/web\`** — trigger a rolling replacement of the Pods without changing the spec, which is how you make Pods pick up a changed ConfigMap or Secret that is mounted as env vars.
- **\`kubectl label\`**, **\`kubectl annotate\`**, **\`kubectl patch\`** (a targeted merge/JSON patch), **\`kubectl edit\`** (opens the live object in \`$EDITOR\`; convenient, but the change is not in your files — treat it as temporary).

## Windows into running Pods

These are the commands that reach *through* the API server into a running container:

- **\`kubectl logs <pod> [-c <container>]\`** — stdout/stderr. \`-f\` follows, \`--previous\` reads the last terminated instance, \`--since=1h\` / \`--tail=100\` bound the output, \`-l app=web\` reads from every Pod matching a label (with \`--max-log-requests\` to raise the default limit of 5).
- **\`kubectl exec -it <pod> [-c <container>] -- sh\`** — a shell (or any command) inside a running container.
- **\`kubectl debug <pod> -it --image=busybox --target=<container>\`** — attaches an **ephemeral container** sharing the target's namespaces, for when the app image has no shell or tools (a distroless or scratch image). \`kubectl debug node/<node> -it --image=busybox\` gives you a Pod on a specific node with host access.
- **\`kubectl cp <pod>:/path/in/container ./local\`** — copy files in or out (needs \`tar\` in the container).
- **\`kubectl port-forward <pod>\`** or **\`svc/<name>\` \`8080:80\`** — open a tunnel from a local port to a Pod or Service port, so you can reach an internal service from your laptop without exposing it. The tunnel lasts as long as the command runs.

## Flags you will use constantly

- **\`-n <namespace>\`** — every command defaults to the context's namespace; \`-n\` overrides it, \`-A\` spans all.
- **\`--dry-run=client\`** — render the object locally and print it, sending nothing. **\`--dry-run=server\`** — send it to the API server, which runs validation and admission (including webhooks) and returns the result it *would* have persisted, without persisting. Server dry-run catches errors client dry-run cannot.
- **\`-o <format>\`** — \`yaml\`, \`json\`, \`wide\`, \`name\`, \`jsonpath=\`, \`custom-columns=\`, \`go-template=\`.
- **\`-l <selector>\`** — a label selector: \`app=web\`, \`env!=prod\`, \`'tier in (frontend,api)'\`, \`'!deprecated'\` (has no such label). **\`--field-selector\`** filters on a few non-label fields like \`status.phase=Running\`.
- **\`-w\`** — watch. **\`-v=6\`** through **\`-v=9\`** — print the underlying HTTP requests and responses, which is how you debug an RBAC denial or an unexpected API error.

## The two habits

1. **\`describe\` before you guess.** Whatever is wrong — a Pending Pod, a failing rollout, a Service with no endpoints — \`kubectl describe\` on the object shows the events that explain it. Restarting things or editing YAML before reading the events wastes time.
2. **Scaffold, don\'t hand-write.** \`kubectl create ... --dry-run=client -o yaml\` plus \`kubectl explain\` gets you a correct manifest far faster and with fewer errors than writing YAML from memory, and the result goes into version control.`,

    contentHi: `## kubectl ek REST client hai

Har \`kubectl\` command ek ya zyada HTTP calls mein translate hota hai API server ko. Iski configuration \`~/.kube/config\` hai, jo **clusters**, **users**, aur **contexts** define karti hai. Ek **context** (cluster, user, default namespace) ka ek named triple hai. Galat context paana wo tarika hai jisse log production ke against ek command chalate hain sochte hue ye staging tha — ise check karo.

## Reading

- **\`kubectl get <kind> [name]\`** — ek table. \`-A\` namespaces span karta hai. \`-o wide\` node aur Pod IP jaisi columns add karta hai. \`-o yaml\` poora object print karta hai. \`-o jsonpath='{...}'\` specific fields extract karta hai.
- **\`kubectl get <kind> -w\`** — **watch**: har baar ek object change hone par ek line print.
- **\`kubectl describe <kind> <name>\`** — ek human-readable rendering plus bottom par **Events**: scheduler ne kya decide kiya, kaunse images pull hue, kaunse probes fail hue. **Ye pehla command hai jo kisi bhi cheez ke liye chalana hai jo kaam nahi kar rahi.**
- **\`kubectl explain <kind>.spec.<field>\`** — schema.
- **\`kubectl get events --sort-by=.lastTimestamp -A\`** — cluster-wide feed.

## Writing

**Declarative** default hai: \`kubectl apply -f file.yaml | -f dir/ | -k overlay/\`, \`kubectl diff -f dir/\`, \`kubectl delete\`.

**Imperative** commands do cheezon ke liye hain: **scaffolding** manifests, aur **quick one-off changes**:
- **\`kubectl create <kind> ... --dry-run=client -o yaml\`** — ek valid manifest skeleton generate karta hai.
- **\`kubectl scale\`**, **\`kubectl set image\`**, **\`kubectl set env\`** — targeted spec changes.
- **\`kubectl rollout restart deploy/web\`** — spec badle bina Pods ka ek rolling replacement trigger karta hai.

## Running Pods mein windows

- **\`kubectl logs <pod> [-c <container>] [-f] [--previous] [--since=1h] [--tail=100]\`**.
- **\`kubectl exec -it <pod> [-c <container>] -- sh\`** — ek running container ke andar ek shell.
- **\`kubectl debug <pod> -it --image=busybox --target=<container>\`** — ek **ephemeral container** attach karta hai, jab app image ke paas koi shell nahi.
- **\`kubectl cp <pod>:/path ./local\`** — files copy karo.
- **\`kubectl port-forward <pod>|svc/<name> 8080:80\`** — ek local port se ek Pod/Service port tak ek tunnel.

## Flags

- **\`-n <namespace>\`** / **\`-A\`**.
- **\`--dry-run=client\`** (locally render) / **\`--dry-run=server\`** (send, validate + admission, don't persist — client dry-run se zyada errors catch karta hai).
- **\`-o yaml|json|wide|name|jsonpath|custom-columns\`**.
- **\`-l <selector>\`**: \`app=web\`, \`env!=prod\`, \`'tier in (a,b)'\`.
- **\`-w\`** watch, **\`-v=6..9\`** raw HTTP.

## Do habits

1. **Guess karne se pehle \`describe\`.** Jo bhi galat hai, us object par \`kubectl describe\` events dikhata hai jo ise explain karte hain.
2. **Scaffold, hand-write mat karo.** \`kubectl create ... --dry-run=client -o yaml\` plus \`kubectl explain\` aapko ek correct manifest bahut faster deta hai.`,

    examples: [
      {
        title: 'get / describe / -o jsonpath / -w — the read commands',
        titleHi: 'get / describe / -o jsonpath / -w — read commands',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m7l5-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

kubectl -n "$ns" create deployment web --image=registry.k8s.io/pause:3.10 --replicas=2 >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=90s >/dev/null

echo "--- get: a table (default) ---"
kubectl -n "$ns" get deploy web --no-headers | awk '{print $1, $2}'

echo "--- get -o jsonpath: one field, for scripts ---"
kubectl -n "$ns" get deploy web -o jsonpath='desired={.spec.replicas} ready={.status.readyReplicas}{"\\n"}'

echo "--- get -o wide on pods: adds NODE and IP ---"
kubectl -n "$ns" get pods -o wide --no-headers | awk '{print "pod on node", $7, "ip", $6}' | sed -E 's/ip [0-9.]+/ip <ip>/' | sort -u

echo "--- describe: the Events section is the point ---"
kubectl -n "$ns" describe deploy web | grep -oE 'Scaled up replica set web-[a-z0-9]+ to 2' | head -1 | sed -E 's/web-[a-z0-9]+/web-<hash>/'`,
        output: `--- get: a table (default) ---
web 2/2
--- get -o jsonpath: one field, for scripts ---
desired=2 ready=2
--- get -o wide on pods: adds NODE and IP ---
pod on node devprep-control-plane ip <ip>
--- describe: the Events section is the point ---
Scaled up replica set web-<hash> to 2`,
        explain: 'The four read commands cover most inspection. Plain get returns a table with the columns Kubernetes considers most relevant for that kind — for a Deployment, the ready-versus-desired count. Adding an output format of jsonpath pulls out a specific field or two, which is what you use in scripts and automation rather than parsing the table. Adding wide to get on pods adds columns that are hidden by default, notably the node the Pod landed on and its Pod IP, which are the first things you want when a Pod is misbehaving. And describe renders a full human-readable view of the object followed by its events; the events are the part that matters, because they are where the controllers, the scheduler, and the kubelet record what they did and why — here, the Deployment controller scaling its ReplicaSet up to the requested count. For anything that is not in the state you expect, describe and its events are where the explanation is.',
        explainHi: 'Chaar read commands zyaadatar inspection cover karte hain. Plain get un columns ke saath ek table return karta hai jo Kubernetes us kind ke liye sabse relevant maanta hai. jsonpath ka ek output format add karna ek specific field ya do pull karta hai, jo aap scripts mein use karte ho. get par pods par wide add karna wo columns add karta hai jo default se hidden hain, notably wo node jispar Pod landed aur iska Pod IP. Aur describe object ka ek full human-readable view render karta hai iske events ke baad; events wo part hai jo matter karta hai, kyunki wo wahan hain jahan controllers, scheduler, aur kubelet record karte hain unhone kya kiya aur kyun.',
      },
      {
        title: '--dry-run: scaffold a manifest, catch an error before applying',
        titleHi: '--dry-run: ek manifest scaffold karo, apply se pehle ek error catch karo',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m7l5b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT
cd "$(mktemp -d)"

echo "--- scaffold a valid Deployment manifest (client dry-run: nothing is sent) ---"
kubectl create deployment api --image=nginx:1.27-alpine --replicas=3 \\
  --dry-run=client -o yaml > api.yaml
grep -E '^kind:|replicas:|image:' api.yaml

echo "--- introduce a mistake: a negative replica count ---"
sed -i 's/replicas: 3/replicas: -1/' api.yaml

echo "--- client dry-run: local render only, does NOT catch it ---"
kubectl -n "$ns" apply -f api.yaml --dry-run=client >/dev/null 2>&1 && echo "client dry-run: accepted (it doesn't validate against the server)"

echo "--- server dry-run: the API server validates + runs admission, WITHOUT persisting ---"
kubectl -n "$ns" apply -f api.yaml --dry-run=server 2>&1 | grep -oiE 'Invalid value' | head -1

echo "--- nothing was created ---"
echo "deployments in ns: $(kubectl -n "$ns" get deploy -o name 2>/dev/null | grep -c .)"`,
        output: `--- scaffold a valid Deployment manifest (client dry-run: nothing is sent) ---
kind: Deployment
  replicas: 3
      - image: nginx:1.27-alpine
--- introduce a mistake: a negative replica count ---
--- client dry-run: local render only, does NOT catch it ---
client dry-run: accepted (it doesn't validate against the server)
--- server dry-run: the API server validates + runs admission, WITHOUT persisting ---
Invalid value
--- nothing was created ---
deployments in ns: 0`,
        explain: 'The create command with a client dry-run and YAML output is the scaffolding pattern: it produces a syntactically correct, schema-valid manifest for the requested kind, which you redirect to a file, edit, and commit, rather than writing the boilerplate from memory. The two dry-run modes then differ in how much checking they do. Client dry-run only renders the object locally and prints it; it does not contact the server, so it cannot catch anything that depends on server-side validation or admission — a negative replica count passes. Server dry-run sends the object to the API server, which runs the full pipeline including schema validation and admission webhooks and returns exactly what it would have stored, but discards it instead of persisting. That is where the invalid value is rejected. Confirming afterward that no Deployment exists shows that neither dry-run created anything. The practical rule is to scaffold with client dry-run and to validate a manifest with server dry-run before a real apply, especially in a cluster with admission webhooks that enforce policy.',
        explainHi: 'create command ek client dry-run aur YAML output ke saath scaffolding pattern hai: ye requested kind ke liye ek syntactically correct, schema-valid manifest produce karta hai, jise aap ek file mein redirect karte ho, edit karte ho, aur commit karte ho. Do dry-run modes phir differ karte hain ki wo kitni checking karte hain. Client dry-run sirf object ko locally render karta hai aur print karta hai; ye server se contact nahi karta, to ye kuch bhi catch nahi kar sakta jo server-side validation par depend karta hai. Server dry-run object ko API server ko bhejta hai, jo full pipeline chalata hai schema validation aur admission webhooks include, aur exactly wo return karta hai jo isne store kiya hota, par ise persist karne ke bajaay discard karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# running a command against the wrong cluster
$ kubectl delete deployment payments        # meant to run this in STAGING
# ...but your current context is 'prod'. payments is now deleted in production.
# kubectl uses whatever context is current in ~/.kube/config — it does NOT warn.`,
        right: `# make the current context visible and explicit:
$ kubectl config current-context             # check before any write
$ kubectl config get-contexts                # * marks the current one
# per-command targeting removes the ambiguity:
$ kubectl --context staging -n payments delete deployment payments
# tools: 'kubectx'/'kubens' to switch fast; a shell prompt segment (kube-ps1,
# starship) that ALWAYS shows context+namespace; a different terminal colour
# for prod. many teams also require '--context' on all prod-touching scripts.`,
        why: 'kubectl acts against whichever context is marked current in the kubeconfig, and it does not prompt or warn about which cluster that is. A command typed with staging in mind but executed while the current context points at production runs against production, and for a destructive command the effect is immediate and real. The mitigations are to make the current target continuously visible and to make it explicit per command. A shell prompt segment that always shows the context and namespace means the target is on screen whenever a command is typed. Passing the context and namespace explicitly on every command that changes state removes the dependency on whatever happens to be current. Switching tools such as kubectx and kubens make deliberate switches fast and visible, and a distinct terminal appearance for production sessions adds a sensory cue. For automation, requiring the context flag on any script that can touch production prevents a script from inheriting an unexpected current context.',
        whyHi: 'kubectl uske against act karta hai jo bhi context kubeconfig mein current mark hai, aur ye prompt ya warn nahi karta ki wo cluster kaunsa hai. Ek command jo staging ko dhyan mein rakhkar typed hui par production par point karte current context ke saath executed hui production ke against chalti hai, aur ek destructive command ke liye effect immediate aur real hai. Mitigations current target ko continuously visible banana aur ise per command explicit banana hain. Ek shell prompt segment jo hamesha context aur namespace dikhata hai. Har command par context aur namespace explicitly pass karna. kubectx aur kubens jaise tools.',
      },
      {
        wrong: `# diagnosing a broken Pod by restarting it before reading anything
$ kubectl delete pod api-xyz            # "turn it off and on again"
# it comes back... Pending. delete again. Pending. delete the Deployment,
# re-apply. still Pending. an hour gone.
# meanwhile 'kubectl describe pod api-xyz' said, in line 1 of Events:
#   "0/3 nodes available: 3 Insufficient memory"`,
        right: `# describe FIRST. the Events section names the exact cause:
$ kubectl describe pod api-xyz | sed -n '/Events:/,$p'
# common causes and their events:
#   Insufficient cpu/memory      -> requests too high / add capacity
#   ImagePullBackOff             -> bad image name / missing pull secret ('describe' shows which)
#   CrashLoopBackOff             -> kubectl logs --previous
#   FailedScheduling ... taint   -> add a toleration
#   Unschedulable ... PVC        -> the StorageClass / PVC isn't binding
# then act on the actual cause.`,
        why: 'Deleting and recreating a Pod is only a fix when the problem was specific to that Pod instance — a wedged process, a corrupted local state — and the fresh Pod comes up clean. When the problem is anything structural — the Pod cannot be scheduled because no node has room, the image name is wrong, a volume claim will not bind, a probe is misconfigured — recreating the Pod reproduces the exact same failure, because the new Pod is built from the same unchanged spec. The events attached to the object record precisely which of these it is: the scheduler writes the filter that eliminated every node, the kubelet writes the image pull error or the probe failure, the controllers write what they attempted. Running describe and reading the events first identifies the real cause in seconds and points at a specific fix, whereas restarting first wastes time reproducing a failure that was already explained.',
        whyHi: 'Ek Pod ko delete aur recreate karna sirf tab ek fix hai jab problem us Pod instance ke liye specific thi — ek wedged process, ek corrupted local state — aur fresh Pod clean up aata hai. Jab problem kuch bhi structural hai — Pod schedule nahi ho sakta kyunki kisi node ke paas room nahi, image name galat hai, ek volume claim bind nahi hoga, ek probe misconfigured hai — Pod ko recreate karna exact same failure reproduce karta hai, kyunki naya Pod same unchanged spec se banaya jaata hai. Object se attached events precisely record karte hain inmein se kaunsa hai. describe chalana aur events pehle padhna real cause ko seconds mein identify karta hai.',
      },
      {
        wrong: `# leaving 'kubectl edit' changes in the cluster and forgetting them
$ kubectl edit deployment api        # bump memory limit to stop OOM, save, done
# 3 weeks later someone runs 'kubectl apply -f k8s/' from the (unchanged) repo
# -> the memory limit reverts to the file's value. OOM kills return. nobody
//    connects it to the edit made weeks ago, because it was never in a file.`,
        right: `# 'kubectl edit' / 'kubectl scale' / 'kubectl patch' are for URGENT temporary
# changes only. immediately after, make the SAME change in the manifest + commit:
$ kubectl edit deployment api        # stop the bleeding NOW
$ vim k8s/api/deployment.yaml         # then: encode it properly
$ git commit -am 'api: raise memory limit to 512Mi (was OOMing)'
$ kubectl apply -f k8s/api/           # re-converge; now the cluster == the repo
# a live change that isn't in git is drift waiting to be silently reverted.`,
        why: 'When manifest files in version control are the source of truth and applied to the cluster, any change made directly to a live object that is not reflected in the files is drift: the cluster and the repository now disagree, and the next apply of the repository will overwrite the live change with the file\'s value. A memory limit raised by an in-place edit reverts on the next apply, the problem it fixed returns, and because the change was never recorded in a file there is nothing linking the regression to the edit, so it is diagnosed from scratch. Direct edits are legitimate for stopping an active incident quickly, but the change must then be made in the manifest and committed, and the manifest re-applied, so that the cluster state and the repository converge and the change is durable and attributable. A live modification that is not in the files should be treated as a temporary measure with a required follow-up, not a completed change.',
        whyHi: 'Jab version control mein manifest files source of truth hain aur cluster par applied hain, ek live object ko directly kiya gaya koi bhi change jo files mein reflected nahi hai wo drift hai: cluster aur repository ab disagree karte hain, aur repository ka agla apply live change ko file ki value se overwrite karega. Ek in-place edit se raised ek memory limit agle apply par reverts, jo problem isne fix ki wo returns, aur kyunki change kabhi ek file mein record nahi hua regression ko edit se link karne wala kuch nahi hai. Direct edits ek active incident ko jaldi rokne ke liye legitimate hain, par change phir manifest mein banaya jaana chahiye aur committed.',
      },
    ],

    realWorld: [
      {
        en: '**`kubectl delete namespace` run against prod instead of a dev cluster** — the terminal had been on `prod` since the morning. Recovery took the etcd backup. Now every engineer runs `kube-ps1` (context+namespace in the prompt) and prod is a red terminal theme.',
        hi: '**`kubectl delete namespace` ek dev cluster ke bajaay prod ke against run hua** — terminal subah se `prod` par tha.',
      },
      {
        en: '**A Pending Pod "fixed" by re-applying the Deployment five times** before someone read `kubectl describe pod` — `Insufficient cpu`, the Pod requested 8 cores on 4-core nodes. A one-character edit to `requests.cpu` fixed it.',
        hi: '**Ek Pending Pod jo Deployment ko paanch baar re-apply karke "fix" kiya gaya** jab tak kisi ne `kubectl describe pod` nahi padha.',
      },
      {
        en: '**A `--dry-run=server` in CI caught a policy-webhook rejection** ("image not from an allowed registry") before the merge, instead of a failed rollout after. Server dry-run on every manifest is now a required PR check.',
        hi: '**CI mein ek `--dry-run=server` ne ek policy-webhook rejection catch kiya** merge se pehle, ek failed rollout ke bajaay.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a kubectl context, and why is getting it wrong dangerous?',
        qHi: 'Ek kubectl context kya hai, aur ise galat paana khatarnak kyun hai?',
        a: 'A context is a named combination of three things in the kubeconfig file: a cluster, which is an API server URL and its CA certificate; a user, which is the credentials to authenticate as; and a default namespace. kubectl always operates against whichever context is marked current, and it does not prompt or warn about which cluster that is. The danger is that a command typed with one environment in mind — say, a delete intended for staging — executes against whatever the current context points at, and if that is production the effect is immediate and, for a destructive command, real. The mitigations are to keep the current target visible and to make it explicit. A shell prompt segment that always shows the context and namespace puts the target on screen whenever a command is typed. Passing the context and namespace flags explicitly on any command that changes state removes the reliance on the current setting. Fast switchers like kubectx and kubens make deliberate changes visible, a distinct terminal appearance for production adds a cue, and requiring the context flag in any automation that can touch production stops a script from inheriting an unexpected current context.',
        aHi: 'Ek context kubeconfig file mein teen cheezon ka ek named combination hai: ek cluster (ek API server URL aur iska CA certificate); ek user (authenticate karne ke credentials); aur ek default namespace. kubectl hamesha uske against operate karta hai jo bhi context current mark hai, aur ye prompt ya warn nahi karta ki wo cluster kaunsa hai. Danger ye hai ki ek command jo ek environment ko dhyan mein rakhkar typed hui — say, staging ke liye ek delete — uske against executes jo bhi current context point karta hai, aur agar wo production hai effect immediate aur real hai. Mitigations current target ko visible rakhna aur ise explicit banana hain.',
      },
      {
        q: 'Give the sequence of kubectl commands you would run to diagnose a Pod that will not become Ready.',
        qHi: 'Un kubectl commands ka sequence do jo aap ek Pod diagnose karne ke liye chalaoge jo Ready nahi ho raha.',
        a: 'First, kubectl get pod with wide output, to see the phase, the node, the Pod IP, and the restart count at a glance. Then, and this is the key step, kubectl describe pod, and read the Events section at the bottom: the scheduler, kubelet, and controllers record there exactly what happened. If the phase is Pending, the events name the scheduling filter that failed — insufficient CPU or memory against the Pod\'s requests, an untolerated taint, an unmatched affinity rule, or an unbound volume claim — and each has a specific fix that is not a restart. If the events show ImagePullBackOff, they also show the exact image reference and the pull error, usually a wrong name or tag or a missing pull secret. If the container is in CrashLoopBackOff, the next command is kubectl logs on the pod with the previous flag, because a plain logs shows the current instance which during a backoff has barely started, while previous shows the log from the last crash where the real error is. If the Pod is Running but not Ready, describe shows the readiness probe configuration and its recent failures, and kubectl logs shows what the app is doing. Only after the events and logs point at a cause do you act, and the action matches the cause rather than being a blanket restart.',
        aHi: 'Pehle, kubectl get pod wide output ke saath, phase, node, Pod IP, aur restart count ek glance mein dekhne ke liye. Phir, aur ye key step hai, kubectl describe pod, aur bottom par Events section padho. Agar phase Pending hai, events us scheduling filter ko name karte hain jo fail hua. Agar events ImagePullBackOff dikhate hain, wo exact image reference aur pull error bhi dikhate hain. Agar container CrashLoopBackOff mein hai, agla command pod par kubectl logs previous flag ke saath hai. Agar Pod Running hai par Ready nahi, describe readiness probe configuration aur iske recent failures dikhata hai. Sirf events aur logs ke ek cause par point karne ke baad aap act karte ho.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list the read commands (get with its useful `-o` options, describe, explain, get -w, get events) and say precisely what each is best for.',
        taskHi: 'Ek comment mein, read commands list karo.',
        hint: '`kubectl get <kind> [name]` — a TABLE with the columns K8s thinks matter; `-A` = all namespaces; `-o wide` = +NODE +Pod IP (first thing you want on a broken Pod); `-o yaml`/`json` = the full object (spec+status); `-o name` = `kind/name` to pipe; `-o jsonpath=...` / `-o custom-columns=...` = pull specific fields for scripts. `kubectl get <kind> -w` — WATCH: a line on every add/change/delete → see a rollout progress live. `kubectl describe <kind> <name>` — human render + the EVENTS section at the bottom (scheduler decisions, image pulls, probe failures, restarts) → the FIRST command for anything broken. `kubectl explain <kind>.spec.<field>` — the schema, for writing manifests (works without any object). `kubectl get events --sort-by=.lastTimestamp -A` — a cluster-wide feed of what the controllers have been doing. `kubectl api-resources` — every kind + its short name + apiVersion + namespaced?.',
        hintHi: '`kubectl get <kind> [name]` — ek TABLE; `-A` = all namespaces; `-o wide` = +NODE +Pod IP; `-o yaml`/`json` = full object; `-o jsonpath` = scripts ke liye. `kubectl get <kind> -w` — WATCH. `kubectl describe <kind> <name>` — human render + EVENTS section → kisi bhi broken cheez ke liye PEHLA command. `kubectl explain <kind>.spec.<field>` — schema. `kubectl get events --sort-by=.lastTimestamp -A` — cluster-wide feed.',
      },
      {
        task: 'In a comment, explain the difference between `--dry-run=client` and `--dry-run=server`, and give the "scaffold a manifest" one-liner.',
        taskHi: 'Ek comment mein, `--dry-run=client` aur `--dry-run=server` ke beech difference samjhao.',
        hint: '`--dry-run=client` — renders the object LOCALLY and prints it, sends NOTHING to the server → can\'t catch anything needing server-side validation or admission (a negative replica count, a policy-webhook rule, a name collision) — it just formats. `--dry-run=server` — SENDS the object; the API server runs the FULL pipeline (schema validation + admission incl. webhooks) and returns exactly what it WOULD have persisted, but discards it (nothing is created). Use server dry-run to validate a manifest before a real apply, especially with policy webhooks. SCAFFOLD one-liner: `kubectl create deployment web --image=nginx:1.27-alpine --replicas=3 --dry-run=client -o yaml > web.yaml` → a correct, schema-valid skeleton you then edit + commit, instead of typing YAML from memory (`kubectl explain` fills in the fields you add).',
        hintHi: '`--dry-run=client` — object ko LOCALLY render karta hai aur print karta hai, server ko KUCH nahi bhejta → server-side validation ya admission ki zaroorat wali koi cheez catch nahi kar sakta. `--dry-run=server` — object BHEJTA hai; API server FULL pipeline chalata hai (schema validation + admission incl. webhooks) aur exactly wo return karta hai jo isne persist kiya HOTA, par discard karta hai. SCAFFOLD: `kubectl create deployment web --image=nginx --replicas=3 --dry-run=client -o yaml > web.yaml`.',
      },
      {
        task: 'In a comment, list the "window into a running Pod" commands, and give the two operating habits from this lesson with a one-line justification each.',
        taskHi: 'Ek comment mein, "window into a running Pod" commands list karo.',
        hint: 'WINDOWS: `kubectl logs <pod> [-c ctr] [-f] [--previous] [--since=1h] [--tail=100]` (+ `-l app=web --max-log-requests=N` for all matching pods); `kubectl exec -it <pod> [-c ctr] -- sh` (a shell/command inside a running container); `kubectl debug <pod> -it --image=busybox --target=<ctr>` (an EPHEMERAL container sharing the target\'s namespaces — for a distroless/scratch image with no shell); `kubectl cp <pod>:/path ./local` (copy files, needs `tar` in the container); `kubectl port-forward <pod>|svc/<name> 8080:80` (tunnel a local port to a Pod/Service, lasts while the command runs). HABITS: (1) `describe` BEFORE you guess — the Events section names the exact cause (scheduler filter, image error, probe failure), so restarting/editing before reading wastes time reproducing an already-explained failure; (2) SCAFFOLD, don\'t hand-write — `kubectl create ... --dry-run=client -o yaml` + `kubectl explain` produces a correct manifest faster and with fewer errors than YAML from memory, and it goes into git.',
        hintHi: 'WINDOWS: `kubectl logs [-c] [-f] [--previous] [--since] [--tail]`; `kubectl exec -it <pod> [-c] -- sh`; `kubectl debug <pod> -it --image=busybox --target=<ctr>` (EPHEMERAL container — distroless image ke liye); `kubectl cp`; `kubectl port-forward <pod>|svc/<name> 8080:80`. HABITS: (1) guess karne se PEHLE `describe` — Events section exact cause name karta hai; (2) SCAFFOLD, hand-write mat karo — `kubectl create ... --dry-run=client -o yaml` + `kubectl explain`.',
      },
    ],

    keyTakeaways: [
      'kubectl is a THIN REST CLIENT over the API server — every command is HTTP calls, it holds no state. Config is `~/.kube/config`: clusters + users + CONTEXTS. A CONTEXT = (cluster, user, default namespace); `kubectl config current-context` / `get-contexts` (* = current) / `use-context`. GETTING THE CONTEXT WRONG is how people delete prod thinking it was staging — kubectl does NOT warn. Make it visible (a `kube-ps1`/starship prompt segment always showing context+namespace; a red terminal for prod) and explicit (`--context X -n Y` on every state-changing command; require `--context` in prod automation).',
      'READ: `kubectl get <kind> [name]` (a table; `-A` all namespaces; `-o wide` +node/IP; `-o yaml`/`json` full object; `-o jsonpath=`/`-o custom-columns=` pull fields for scripts; `-o name` to pipe). `kubectl get <kind> -w` (WATCH — a line per change, see a rollout live). `kubectl describe <kind> <name>` (human render + the EVENTS section — scheduler/kubelet/controller narration). `kubectl explain <kind>.spec.<field>` (the schema, for writing manifests). `kubectl get events --sort-by=.lastTimestamp -A` (cluster-wide activity feed). `kubectl api-resources` (every kind + short name + apiVersion + namespaced?).',
      'WRITE — DECLARATIVE (prefer): `kubectl apply -f file|-f dir/|-k overlay/`, `kubectl diff -f dir/` (the plan), `kubectl delete -f|<kind> <name>|-l <sel>`. WRITE — IMPERATIVE (for SCAFFOLDING + urgent one-offs): `kubectl create <kind> ... --dry-run=client -o yaml > x.yaml` (generate a valid skeleton — DON\'T hand-write YAML), `kubectl scale`, `kubectl set image`/`set env`, `kubectl rollout restart deploy/x` (re-roll Pods without a spec change — e.g. to pick up a changed Secret), `kubectl label`/`annotate`/`patch`/`edit`. Any `kubectl edit`/`scale`/`patch` on a real workload is a TEMPORARY measure — immediately make the same change in the manifest + commit + re-apply, or it\'s DRIFT that the next `apply` silently reverts.',
      'WINDOWS INTO RUNNING PODS (reach THROUGH the apiserver): `kubectl logs <pod> [-c ctr] [-f] [--previous] [--since=1h] [--tail=N]` (+ `-l <sel> --max-log-requests=N` for all matching); `kubectl exec -it <pod> [-c ctr] -- sh` (a shell inside a container); `kubectl debug <pod> -it --image=busybox --target=<ctr>` (an EPHEMERAL container — for a distroless/scratch image with no shell; also `kubectl debug node/<node>` for host access); `kubectl cp <pod>:/path ./local`; `kubectl port-forward <pod>|svc/<name> 8080:80` (tunnel a local port, lasts while the command runs). FLAGS you\'ll use constantly: `-n <ns>`/`-A`, `--context`, `--dry-run=client` (local render only) vs `--dry-run=server` (send → full validation + admission webhooks → return what it WOULD persist, don\'t persist — catches what client can\'t), `-o yaml|json|wide|name|jsonpath|custom-columns`, `-l <selector>` (`app=web,env!=prod,\'tier in (a,b)\'`), `--field-selector status.phase=Running`, `-w`, `-v=6..9` (raw HTTP — debug RBAC/API errors).',
      'THE TWO HABITS: (1) `describe` BEFORE you guess — for a Pending Pod / failing rollout / Service with no endpoints, the EVENTS section names the exact cause (`Insufficient cpu/memory` → fix requests or add capacity; `ImagePullBackOff` → wrong image/missing pull secret, `describe` shows which; `CrashLoopBackOff` → `kubectl logs --previous`; `FailedScheduling ... taint` → add a toleration; `unbound PVC` → the StorageClass). Restarting or editing YAML before reading the events wastes time reproducing an already-explained failure — recreating a Pod only helps if the problem was specific to that instance, not structural. (2) SCAFFOLD, don\'t hand-write — `kubectl create ... --dry-run=client -o yaml` + `kubectl explain` gets a correct manifest faster and with fewer errors than YAML from memory, and it goes into version control.',
    ],
    keyTakeawaysHi: [
      'kubectl API server ke upar ek THIN REST CLIENT hai — har command HTTP calls hai. Config `~/.kube/config`: clusters + users + CONTEXTS. Ek CONTEXT = (cluster, user, default namespace). CONTEXT GALAT PAANA wo tarika hai jisse log prod delete karte hain sochte staging tha — kubectl WARN nahi karta. Ise visible (`kube-ps1` prompt; prod ke liye red terminal) aur explicit (`--context X -n Y` har state-changing command par) banao.',
      'READ: `kubectl get <kind> [name]` (ek table; `-A`; `-o wide` +node/IP; `-o yaml`/`json`; `-o jsonpath=` scripts ke liye). `kubectl get <kind> -w` (WATCH). `kubectl describe <kind> <name>` (human render + EVENTS section). `kubectl explain <kind>.spec.<field>` (schema). `kubectl get events --sort-by=.lastTimestamp -A`.',
      'WRITE — DECLARATIVE (prefer): `kubectl apply -f|-k`, `kubectl diff -f` (plan), `kubectl delete`. WRITE — IMPERATIVE (SCAFFOLDING + urgent one-offs): `kubectl create <kind> ... --dry-run=client -o yaml > x.yaml`, `kubectl scale`, `kubectl set image`, `kubectl rollout restart deploy/x`, `kubectl patch`/`edit`. Koi bhi `kubectl edit`/`scale` ek real workload par ek TEMPORARY measure hai — turant same change manifest mein karo + commit + re-apply, warna ye DRIFT hai.',
      'RUNNING PODS MEIN WINDOWS: `kubectl logs [-c] [-f] [--previous] [--since] [--tail]`; `kubectl exec -it <pod> [-c] -- sh`; `kubectl debug <pod> -it --image=busybox --target=<ctr>` (EPHEMERAL container — distroless image ke liye); `kubectl cp`; `kubectl port-forward <pod>|svc/<name> 8080:80`. FLAGS: `-n`/`-A`, `--context`, `--dry-run=client` vs `--dry-run=server` (full validation + admission), `-o yaml|json|wide|jsonpath`, `-l <selector>`, `-w`, `-v=6..9`.',
      'DO HABITS: (1) guess karne se PEHLE `describe` — EVENTS section exact cause name karta hai (`Insufficient cpu` → requests fix karo; `ImagePullBackOff` → wrong image; `CrashLoopBackOff` → `kubectl logs --previous`). YAML edit/restart karne se pehle events padho. (2) SCAFFOLD, hand-write mat karo — `kubectl create ... --dry-run=client -o yaml` + `kubectl explain`.',
    ],
  },

  {
    slug: 'ops-namespaces-labels-selectors-and-annotations',
    title: 'Namespaces, Labels, Selectors & Annotations',
    titleHi: 'Namespaces, Labels, Selectors Aur Annotations',
    description: 'Namespaces partition a cluster into virtual sub-clusters for teams and environments, and are where quotas and access control attach. Labels are key/value tags that selectors match on — this is how a Service finds its Pods and a Deployment owns its ReplicaSet. Annotations hold non-identifying metadata for tools.',
    descriptionHi: 'Namespaces ek cluster ko teams aur environments ke liye virtual sub-clusters mein partition karte hain, aur wo jagah hain jahan quotas aur access control attach hote hain. Labels key/value tags hain jinpar selectors match karte hain — ye wo hai jaise ek Service apne Pods dhoondhta hai aur ek Deployment apne ReplicaSet ko own karta hai. Annotations tools ke liye non-identifying metadata rakhte hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**An office building.** Namespaces are the floors leased to different tenants: each tenant\'s reception only lists their own staff (`kubectl get pods` is per-namespace), the building sets a power and space budget per floor (ResourceQuota, LimitRange), and the lobby security desk decides who can badge onto which floor (RBAC). Labels are the coloured stickers on every desk, laptop, and chair — "team: payments", "env: prod", "owner: alice" — and a request like "collect every prod laptop from the payments team" is a label selector; the stickers are how anything gets grouped or found. Annotations are the asset-tag serial numbers and the notes taped under the desk — real information, read by the facilities software and the movers, but not something you\'d ever say "give me all desks where the note says X".',
      hi: '**Ek office building.** Namespaces alag tenants ko leased floors hain: har tenant ka reception sirf unke apne staff ko list karta hai (`kubectl get pods` per-namespace hai), building per floor ek power aur space budget set karti hai (ResourceQuota, LimitRange), aur lobby security desk decide karta hai kaun kaunse floor par badge kar sakta hai (RBAC). Labels har desk, laptop, aur chair par coloured stickers hain — "team: payments", "env: prod", "owner: alice" — aur ek request jaise "payments team se har prod laptop collect karo" ek label selector hai. Annotations asset-tag serial numbers aur desk ke neeche tape ki notes hain — real information, facilities software dwara read, par kuch aisa nahi jispar aap kabhi kahoge "mujhe har desk do jahan note X kehta hai".',
    },

    simple: `**NAMESPACES — virtual sub-clusters within one physical cluster:**
\`\`\`
- scope: MOST objects are namespaced (Pods, Deployments, Services, ConfigMaps, Secrets,
  PVCs, RoleBindings). some are CLUSTER-scoped (Nodes, PersistentVolumes, Namespaces,
  ClusterRoles, StorageClasses, CRDs). 'kubectl api-resources --namespaced=false' lists them.
- 'kubectl get pods' shows ONLY the current namespace. -A / --all-namespaces spans all.
- names are unique PER namespace+kind (two 'web' Deployments in two namespaces = fine).
- what attaches to a namespace: ResourceQuota (total cpu/mem/object counts), LimitRange
  (default + max per Pod/container), RBAC RoleBindings, NetworkPolicy, a default
  ServiceAccount.
- cross-namespace DNS: <svc>.<namespace>.svc.cluster.local  (same-namespace: just <svc>)
- the four built-ins: default, kube-system (cluster components), kube-public,
  kube-node-lease. DON'T deploy into 'default' or 'kube-system'.
- USE FOR: per-team, per-environment (dev/staging in one cluster), per-tenant.
  NOT a security boundary by itself — pair with RBAC + NetworkPolicy + quotas.
\`\`\`

**LABELS — identifying key/value pairs that selectors query:**
\`\`\`yaml
metadata:
  labels:
    app.kubernetes.io/name: web        # the recommended common labels:
    app.kubernetes.io/instance: web-prod
    app.kubernetes.io/component: frontend
    app.kubernetes.io/part-of: shop
    app.kubernetes.io/managed-by: helm
    env: prod
    team: payments
\`\`\`
key: optional \`prefix/\` + name (<=63 chars each). value <=63 chars, alnum + \`-_.\`.

**SELECTORS — how labels are queried:**
\`\`\`
EQUALITY:  app=web , env!=prod , app=web,env=prod   (comma = AND)
SET-BASED: 'env in (prod,staging)' , 'tier notin (cache)' , 'app' (has the key) ,
           '!deprecated' (does NOT have the key)
\`\`\`
- \`kubectl get pods -l 'app=web,env=prod'\`
- a Service's \`spec.selector\` picks the Pods it load-balances over
- a Deployment's \`spec.selector.matchLabels\` MUST match its \`template.metadata.labels\`
  (and is IMMUTABLE after creation — pick it carefully)
- a ReplicaSet counts "Pods matching my selector" — that's the reconciliation input

**ANNOTATIONS — non-identifying metadata, NOT queryable by selectors:**
\`\`\`yaml
metadata:
  annotations:
    kubernetes.io/change-cause: "deploy v1.4.2"         # shows in 'rollout history'
    prometheus.io/scrape: "true"                         # tool config
    nginx.ingress.kubernetes.io/rewrite-target: /        # Ingress controller behaviour
    kubectl.kubernetes.io/last-applied-configuration: .. # apply's 3-way-merge base
\`\`\`
value can be large + structured (JSON). used by controllers, Ingress controllers,
cert-manager, CI systems, \`kubectl\`. no length-63 limit, no querying.

**LABELS vs ANNOTATIONS:** if something needs to SELECT/GROUP by it -> label.
If it's data FOR A TOOL to read -> annotation. (owner, env, app -> labels.
git-sha, changelog URL, last-applied config, controller tuning -> annotations.)`,

    simpleHi: `**NAMESPACES — ek physical cluster ke andar virtual sub-clusters:**
\`\`\`
- scope: ZYAADATAR objects namespaced hain (Pods, Deployments, Services, ConfigMaps, Secrets).
  kuch CLUSTER-scoped hain (Nodes, PersistentVolumes, Namespaces, ClusterRoles, StorageClasses).
- 'kubectl get pods' SIRF current namespace dikhata hai. -A saare span karta hai.
- names PER namespace+kind unique hain.
- namespace se kya attach hota hai: ResourceQuota, LimitRange, RBAC RoleBindings, NetworkPolicy.
- cross-namespace DNS: <svc>.<namespace>.svc.cluster.local
- chaar built-ins: default, kube-system, kube-public, kube-node-lease. 'default' ya
  'kube-system' mein deploy MAT karo.
- USE FOR: per-team, per-environment, per-tenant. Akele ek security boundary NAHI.
\`\`\`

**LABELS — identifying key/value pairs jinpar selectors query karte hain:**
\`\`\`yaml
metadata:
  labels:
    app.kubernetes.io/name: web
    env: prod
    team: payments
\`\`\`
key: optional \`prefix/\` + name. value <=63 chars.

**SELECTORS — labels kaise query hote hain:**
\`\`\`
EQUALITY:  app=web , env!=prod , app=web,env=prod   (comma = AND)
SET-BASED: 'env in (prod,staging)' , 'app' (key hai) , '!deprecated' (key NAHI hai)
\`\`\`
- ek Service ka \`spec.selector\` wo Pods pick karta hai jinpar ye load-balance karta hai
- ek Deployment ka \`spec.selector.matchLabels\` iske \`template.metadata.labels\` se MATCH karna chahiye
  (aur creation ke baad IMMUTABLE hai)
- ek ReplicaSet "mere selector se matching Pods" count karta hai

**ANNOTATIONS — non-identifying metadata, selectors dwara query NAHI:**
\`\`\`yaml
metadata:
  annotations:
    kubernetes.io/change-cause: "deploy v1.4.2"
    prometheus.io/scrape: "true"
\`\`\`
value bada + structured (JSON) ho sakti hai. controllers, Ingress controllers, cert-manager
dwara used. koi length-63 limit nahi, koi querying nahi.

**LABELS vs ANNOTATIONS:** agar kuch ko iske dwara SELECT/GROUP karna hai -> label.
Agar ye ek TOOL ke padhne ke liye data hai -> annotation.`,

    content: `## Namespaces

A **namespace** partitions one physical cluster into virtual sub-clusters. Most objects live in a namespace — Pods, Deployments, Services, ConfigMaps, Secrets, PersistentVolumeClaims, Roles and RoleBindings. A smaller set is **cluster-scoped** and exists outside any namespace — Nodes, PersistentVolumes, StorageClasses, Namespaces themselves, ClusterRoles and ClusterRoleBindings, and CustomResourceDefinitions. \`kubectl api-resources --namespaced=false\` lists the cluster-scoped kinds.

Consequences of namespacing:

- **\`kubectl get\` is scoped to one namespace** — the context's default, or the one given with \`-n\`. \`-A\` spans all. Forgetting this is why "my Pod isn't there" is often "you're looking in the wrong namespace".
- **Names are unique per namespace and kind.** Two Deployments called \`web\` in two namespaces do not conflict.
- **Policy attaches to the namespace.** A **ResourceQuota** caps the namespace's total CPU, memory, and object counts. A **LimitRange** sets default and maximum requests/limits for Pods and containers in the namespace. **RBAC RoleBindings** grant permissions within the namespace. A **NetworkPolicy** controls traffic to and from Pods in the namespace. Each namespace gets a **default ServiceAccount**.
- **DNS crosses namespaces explicitly.** A Service \`api\` in namespace \`shop\` is \`api\` from within \`shop\`, and \`api.shop\` or the full \`api.shop.svc.cluster.local\` from anywhere.

The four built-in namespaces: **\`default\`** (where objects go with no namespace specified — do not use it for real workloads), **\`kube-system\`** (the cluster's own components — never deploy here), **\`kube-public\`** (world-readable cluster info), **\`kube-node-lease\`** (node heartbeat objects).

Use namespaces for **per-team**, **per-environment** (running dev and staging in one cluster), and **per-tenant** separation. A namespace by itself is **not a security boundary** — Pods in different namespaces can still reach each other on the pod network unless a NetworkPolicy stops them, and a compromised Pod's blast radius depends on RBAC and the ServiceAccount, not the namespace. Namespaces are the *unit* that RBAC, quotas, and NetworkPolicy attach to; security comes from configuring those.

## Labels

A **label** is a key/value pair under \`metadata.labels\`, meant to carry **identifying** information that you will want to **select or group by**. The key is an optional DNS-subdomain prefix and a name (\`app.kubernetes.io/name\`), each part at most 63 characters; the value is at most 63 characters of alphanumerics plus \`-\`, \`_\`, \`.\`.

Kubernetes recommends a set of **common labels** so tools can understand any workload:

\`\`\`yaml
labels:
  app.kubernetes.io/name: web            # the application
  app.kubernetes.io/instance: web-prod   # this specific deployment of it
  app.kubernetes.io/version: "1.4.2"
  app.kubernetes.io/component: frontend  # its role within the app
  app.kubernetes.io/part-of: shop        # the larger system
  app.kubernetes.io/managed-by: helm     # what deploys it
\`\`\`

Plus your own organisational labels: \`env: prod\`, \`team: payments\`, \`tier: api\`, \`cost-center: 4021\`.

## Selectors

A **selector** is a query over labels. Two syntaxes:

- **Equality-based**: \`app=web\`, \`env!=prod\`, and comma-separated terms are ANDed: \`app=web,env=prod,tier=frontend\`.
- **Set-based**: \`env in (prod, staging)\`, \`tier notin (cache, queue)\`, \`app\` (the key exists, any value), \`!deprecated\` (the key does not exist).

Selectors appear in three critical places:

1. **\`kubectl ... -l <selector>\`** — filter what you list or act on: \`kubectl get pods -l 'app=web,env=prod'\`, \`kubectl delete pods -l 'app=web,tier=canary'\`.
2. **A Service's \`spec.selector\`** — the Service load-balances over exactly the Pods matching this selector, wherever they are, and its endpoint list updates automatically as matching Pods come and go (Module 8).
3. **A workload controller's \`spec.selector\`** — a Deployment, ReplicaSet, or StatefulSet identifies "its" Pods by this selector. For a Deployment, \`spec.selector.matchLabels\` **must** be a subset of \`spec.template.metadata.labels\` (the labels it stamps on the Pods it creates), and it is **immutable after creation** — changing it means deleting and recreating the Deployment, so choose it to be stable and specific from the start (include \`app\` and often \`env\`, not a version that will change).

The reconciliation input for a ReplicaSet is literally "count the Pods matching my selector and compare to my replica count". This is why a stray Pod that happens to carry the same labels gets **adopted** by a ReplicaSet, and why two workloads with overlapping selectors fight over the same Pods.

## Annotations

An **annotation** is also a key/value pair, under \`metadata.annotations\`, but for **non-identifying** metadata that tools read and that you would never select on. There is no 63-character limit on the value, and the value is often large and structured (a JSON blob).

Common uses:

- **\`kubernetes.io/change-cause\`** — a description of why a change was made, shown in \`kubectl rollout history\`.
- **Controller configuration** — \`prometheus.io/scrape: "true"\` and \`prometheus.io/port\` tell Prometheus to scrape a Pod; \`nginx.ingress.kubernetes.io/*\` annotations configure per-Ingress behaviour; \`cert-manager.io/cluster-issuer\` tells cert-manager which issuer to use.
- **System bookkeeping** — \`kubectl.kubernetes.io/last-applied-configuration\` (the base for \`kubectl apply\`'s three-way merge), \`deployment.kubernetes.io/revision\` (the ReplicaSet revision number).
- **Your own tooling** — the git SHA of the build, a link to the CI run, the PR number, an on-call owner.

## Labels or annotations?

The test: **will you ever want to find, group, or route by this?** If yes, it is a label — \`app\`, \`env\`, \`team\`, \`tier\`, \`component\`. If it is information *for a tool or a human to read* about the object, it is an annotation — the git SHA, the changelog URL, the last-applied config, an Ingress controller tuning knob, a Prometheus scrape flag. Putting selectable information in an annotation means you cannot query it; putting large or free-form data in a label breaks the length limit and pollutes the label space that selectors operate over.`,

    contentHi: `## Namespaces

Ek **namespace** ek physical cluster ko virtual sub-clusters mein partition karta hai. Zyaadatar objects ek namespace mein rehte hain — Pods, Deployments, Services, ConfigMaps, Secrets. Ek chhota set **cluster-scoped** hai aur kisi namespace ke bahar exist karta hai — Nodes, PersistentVolumes, StorageClasses, Namespaces khud, ClusterRoles, CRDs.

Consequences: **\`kubectl get\` ek namespace ko scoped hai** (\`-A\` saare span karta hai). **Names per namespace aur kind unique hain.** **Policy namespace se attach hoti hai** — ek **ResourceQuota** total CPU/memory/object counts cap karta hai; ek **LimitRange** default aur maximum requests/limits set karta hai; **RBAC RoleBindings** permissions grant karte hain; ek **NetworkPolicy** traffic control karti hai. **DNS namespaces ko explicitly cross karta hai** (\`api.shop.svc.cluster.local\`).

Chaar built-in namespaces: **\`default\`** (real workloads ke liye use MAT karo), **\`kube-system\`** (cluster ke apne components — kabhi yahan deploy mat karo), **\`kube-public\`**, **\`kube-node-lease\`**.

Namespaces **per-team**, **per-environment**, aur **per-tenant** separation ke liye use karo. Ek namespace apne aap **ek security boundary NAHI** hai — alag namespaces mein Pods abhi bhi ek doosre ko pod network par reach kar sakte hain jab tak ek NetworkPolicy unhe rokti nahi.

## Labels

Ek **label** \`metadata.labels\` ke under ek key/value pair hai, **identifying** information carry karne ke liye jisse aap **select ya group** karna chahoge. Kubernetes ek set of **common labels** recommend karta hai (\`app.kubernetes.io/name\`, \`app.kubernetes.io/instance\`, etc.) plus aapke apne organisational labels (\`env: prod\`, \`team: payments\`).

## Selectors

Ek **selector** labels ke upar ek query hai: **Equality-based** (\`app=web\`, \`env!=prod\`, comma = AND) ya **Set-based** (\`env in (prod, staging)\`, \`app\` (key hai), \`!deprecated\` (key nahi hai)).

Selectors teen critical jagahon par appear hote hain: **\`kubectl ... -l <selector>\`**; **ek Service ka \`spec.selector\`** (wo Pods pick karta hai jinpar ye load-balance karta hai); **ek workload controller ka \`spec.selector\`** (ek Deployment iske \`spec.selector.matchLabels\` ko iske \`template.metadata.labels\` se **match karna chahiye** aur ye **creation ke baad IMMUTABLE** hai).

## Annotations

Ek **annotation** bhi ek key/value pair hai, \`metadata.annotations\` ke under, par **non-identifying** metadata ke liye jo tools padhte hain. Value par koi 63-character limit nahi. Common uses: **\`kubernetes.io/change-cause\`**, **controller configuration** (\`prometheus.io/scrape\`, \`nginx.ingress.kubernetes.io/*\`), **system bookkeeping** (\`last-applied-configuration\`), **aapki apni tooling** (git SHA, CI run link).

## Labels ya annotations?

Test: **kya aap kabhi ise find, group, ya route karna chahoge?** Agar haan, ye ek label hai. Agar ye ek tool ya human ke padhne ke liye information hai, ye ek annotation hai.`,

    examples: [
      {
        title: 'Namespaces partition; selectors query within (and across) them',
        titleHi: 'Namespaces partition karte hain; selectors query karte hain',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
a="m7l6a-$$"; b="m7l6b-$$"
kubectl create namespace "$a" >/dev/null; kubectl create namespace "$b" >/dev/null
trap 'kubectl delete namespace "$a" "$b" --wait=false >/dev/null 2>&1' EXIT

kubectl -n "$a" run web-1 --image=registry.k8s.io/pause:3.10 --labels='app=web,env=prod'    -- >/dev/null
kubectl -n "$a" run web-2 --image=registry.k8s.io/pause:3.10 --labels='app=web,env=staging' -- >/dev/null
kubectl -n "$b" run web-3 --image=registry.k8s.io/pause:3.10 --labels='app=web,env=prod'    -- >/dev/null

echo "--- 'get pods' is per-namespace ---"
echo "ns A: $(kubectl -n "$a" get pods --no-headers | wc -l)   ns B: $(kubectl -n "$b" get pods --no-headers | wc -l)"

echo "--- equality selector within ns A: app=web AND env=prod ---"
kubectl -n "$a" get pods -l 'app=web,env=prod' -o name

echo "--- negation within ns A: env != prod ---"
kubectl -n "$a" get pods -l 'env!=prod' -o name

echo "--- set-based, across ALL namespaces: env in (prod) ---"
kubectl get pods -A -l 'app=web,env in (prod)' --no-headers | grep -cE "$a|$b" | sed 's/^/prod web pods in our 2 namespaces: /'`,
        output: `--- 'get pods' is per-namespace ---
ns A: 2   ns B: 1
--- equality selector within ns A: app=web AND env=prod ---
pod/web-1
--- negation within ns A: env != prod ---
pod/web-2
--- set-based, across ALL namespaces: env in (prod) ---
prod web pods in our 2 namespaces: 2`,
        explain: 'Two namespaces are created and three Pods are placed across them, each carrying an app label and an env label. Listing Pods in one namespace shows only that namespace\'s Pods, because get is scoped to a single namespace unless told otherwise — the same name can exist in both namespaces without conflict. Within a namespace, an equality selector with two comma-separated terms matches Pods that have both labels with those exact values, so app equals web and env equals prod selects the one prod Pod. A negation selector matches Pods whose env label is anything other than prod, or is absent. Adding the all-namespaces flag makes the same selector span every namespace, and a set-based term expressing membership in a list behaves like equality here but generalises to multiple values. The consistent point is that namespaces are the partition and labels are the cross-cutting grouping: you scope by namespace and you select by label, and the two compose.',
        explainHi: 'Do namespaces banaye jaate hain aur teen Pods unke across rakhe jaate hain, har ek ek app label aur ek env label carry karta hai. Ek namespace mein Pods list karna sirf us namespace ke Pods dikhata hai, kyunki get ek single namespace ko scoped hai jab tak warna nahi bataya jaata. Ek namespace ke andar, do comma-separated terms ke saath ek equality selector un Pods se match karta hai jinke paas dono labels un exact values ke saath hain. Ek negation selector un Pods se match karta hai jinka env label prod ke alawa kuch bhi hai. All-namespaces flag add karna same selector ko har namespace span karwata hai. Consistent point ye hai ki namespaces partition hain aur labels cross-cutting grouping hain.',
      },
      {
        title: 'A Service finds its Pods by selector; a mismatch = zero endpoints',
        titleHi: 'Ek Service selector se apne Pods dhoondhta hai; ek mismatch = zero endpoints',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m7l6c-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

cat <<EOF | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: apps/v1
kind: Deployment
metadata: { name: web }
spec:
  replicas: 2
  selector: { matchLabels: { app: web } }
  template:
    metadata: { labels: { app: web } }        # <- the Pods get label app=web
    spec:
      containers: [ { name: web, image: registry.k8s.io/pause:3.10 } ]
---
apiVersion: v1
kind: Service
metadata: { name: web }
spec:
  selector: { app: web }                       # <- MATCHES the Pods -> endpoints
  ports: [ { port: 80, targetPort: 80 } ]
---
apiVersion: v1
kind: Service
metadata: { name: web-typo }
spec:
  selector: { app: wEb }                        # <- typo. matches NOTHING.
  ports: [ { port: 80, targetPort: 80 } ]
EOF
kubectl -n "$ns" rollout status deploy/web --timeout=90s >/dev/null

ok_ep=$(kubectl -n "$ns" get endpoints web -o jsonpath='{.subsets[0].addresses[*].ip}' | tr ' ' '\\n' | grep -c .)
echo "--- the correct Service has endpoints (the 2 Pod IPs) ---"
echo "web endpoints: $ok_ep"

bad_ep=$(kubectl -n "$ns" get endpoints web-typo -o jsonpath='{.subsets[*].addresses[*].ip}')
echo "--- the mismatched Service has ZERO endpoints -> 'connection refused' for clients ---"
echo "web-typo endpoints: \${bad_ep:-<none>}"`,
        output: `--- the correct Service has endpoints (the 2 Pod IPs) ---
web endpoints: 2
--- the mismatched Service has ZERO endpoints -> 'connection refused' for clients ---
web-typo endpoints: <none>`,
        explain: 'The Deployment stamps the label app equals web onto every Pod it creates, because that is what its template says. The first Service declares a selector of app equals web, which matches those Pods, so the EndpointSlice controller keeps the Service\'s endpoint list populated with the current Pod IPs — two of them here — and traffic to the Service is load-balanced to the Pods. The second Service declares a selector with a capitalisation typo, which matches no Pod at all, so its endpoint list stays empty. A Service with no endpoints is not an error that surfaces anywhere obvious: the Service exists, it has a stable virtual IP, and DNS resolves its name, but every connection to it is refused because there is no backend to forward to. This is one of the most common Kubernetes debugging situations, and the diagnosis is always the same: compare the Service\'s selector to the labels actually on the Pods, because they must match exactly, and check the endpoints object to see whether the match is producing backends.',
        explainHi: 'Deployment har Pod par jo ye banata hai label app equals web stamp karta hai, kyunki iska template yahi kehta hai. Pehli Service app equals web ka ek selector declare karti hai, jo un Pods se match karta hai, to EndpointSlice controller Service ki endpoint list ko current Pod IPs se populated rakhta hai. Doosri Service ek capitalisation typo ke saath ek selector declare karti hai, jo kisi Pod se match nahi karta, to iski endpoint list empty rehti hai. Bina endpoints ke ek Service ek error nahi hai jo kahin obvious surface karta hai: Service exist karti hai, iska ek stable virtual IP hai, aur DNS iska naam resolve karta hai, par ise har connection refuse hota hai. Diagnosis hamesha same hai: Service ke selector ko Pods par actually labels se compare karo.',
      },
    ],

    mistakes: [
      {
        wrong: `# deploying everything into 'default', or worse, into 'kube-system'
$ kubectl apply -f k8s/          # no namespace anywhere in the manifests
# -> everything lands in 'default'. no quota, no per-team RBAC, no NetworkPolicy
//    scoping, dev and prod workloads intermixed, 'kubectl get pods' is a wall.
# and 'kubectl -n kube-system apply ...' puts your app next to etcd + the
# apiserver, where a quota breach or a bad NetworkPolicy can hurt the cluster.`,
        right: `# a namespace per team/env/tenant, set in the manifests (or via kustomize/helm):
apiVersion: v1
kind: Namespace
metadata: { name: shop-prod, labels: { team: shop, env: prod } }
---
# then every object: metadata.namespace: shop-prod  (or 'kubectl apply -n shop-prod')
# + a ResourceQuota + LimitRange + default-deny NetworkPolicy + RoleBindings on it.
# NEVER deploy workloads into 'default' or 'kube-system'.`,
        why: 'The default namespace is where objects go when no namespace is specified, and it has no quota, no dedicated access-control bindings, and no network policy unless someone adds them, so workloads placed there run without the guardrails that a purpose-made namespace carries. Mixing every team\'s and every environment\'s workloads into one namespace also makes listing and reasoning about them hard and removes the natural unit that RBAC and quotas attach to. Deploying into kube-system is worse: that namespace holds the cluster\'s own control-plane and node components, and an application there shares fate with them — a resource quota exhausted by the app, or a network policy or admission rule scoped to the namespace, can affect the components the cluster depends on. The correct structure is a namespace per team, environment, or tenant, created explicitly with its own resource quota, limit range, default-deny network policy, and role bindings, and every workload manifest either carrying its namespace or being applied with the namespace flag. The four built-in namespaces are for the system\'s use, not yours.',
        whyHi: 'Default namespace wo hai jahan objects jaate hain jab koi namespace specified nahi hai, aur iske paas koi quota nahi, koi dedicated access-control bindings nahi, aur koi network policy nahi jab tak koi unhe add nahi karta, to wahan rakhe workloads guardrails ke bina chalte hain. Har team ke aur har environment ke workloads ko ek namespace mein mix karna unhe list karna aur reason karna mushkil banata hai. kube-system mein deploy karna bura hai: wo namespace cluster ke apne control-plane aur node components rakhta hai. Correct structure per team, environment, ya tenant ek namespace hai, explicitly banaya gaya iske apne resource quota, limit range, default-deny network policy, aur role bindings ke saath.',
      },
      {
        wrong: `# a Deployment selector that doesn't match its own Pod template
spec:
  selector:
    matchLabels: { app: web, version: v1 }     # <- selector wants version: v1
  template:
    metadata:
      labels: { app: web }                      # <- Pods only get app: web
# -> 'kubectl apply' is REJECTED: "selector does not match template labels".
# and if you ever CHANGE the selector on a live Deployment:
#   -> also rejected: spec.selector is immutable after creation.`,
        right: `# selector.matchLabels MUST be a subset of template.metadata.labels:
spec:
  selector:
    matchLabels: { app: web }                   # stable, specific enough to be unique
  template:
    metadata:
      labels: { app: web, version: v1, env: prod }   # template can have MORE
# choose the selector at creation to be STABLE (app, maybe env) — never a version
# or a hash that will change. changing it later = delete + recreate the Deployment.`,
        why: 'A Deployment identifies the Pods it manages by its selector, and the Pods it creates carry the labels in its template, so the API server enforces at write time that the selector is satisfied by the template\'s labels — otherwise the Deployment would create Pods it does not recognise as its own and would loop creating more. A selector requiring a label the template does not set is rejected on apply. Separately, the selector is immutable once the Deployment exists, because changing which Pods a controller claims to own, while it is running, would orphan the current Pods and potentially cause it to adopt others. Attempting to change it is also rejected. The practical guidance is to make the selector a small, stable set of labels chosen at creation — typically the application name and perhaps the environment — that will never need to change, and to let the template carry additional labels like the version. If the selector genuinely must change, the only path is to delete the Deployment and create a new one, which is a disruptive operation to be avoided by choosing well initially.',
        whyHi: 'Ek Deployment un Pods ko iske selector se identify karta hai jo ye manage karta hai, aur jo Pods ye banata hai wo iske template mein labels carry karte hain, to API server write time par enforce karta hai ki selector template ke labels se satisfied hai. Ek selector jo ek label require karta hai jo template set nahi karta apply par reject hota hai. Alag se, selector Deployment exist hone ke baad immutable hai, kyunki ek controller kaunse Pods own karne ka dava karta hai wo change karna, jab ye chal raha hai, current Pods ko orphan karega. Practical guidance selector ko labels ka ek chhota, stable set banana hai jo creation par chosen hai. Agar selector genuinely change hona chahiye, ekmatra path Deployment ko delete karna aur ek naya banana hai.',
      },
      {
        wrong: `# storing selectable data in an annotation, or free-form data in a label
metadata:
  annotations:
    env: prod                # <- can't 'kubectl get -l env=prod' on an annotation
    team: payments
  labels:
    git-commit-message: "fix: handle the null case in checkout (#4821)"   # <- 63-char
                                                                          #  limit + spaces
    changelog-url: "https://github.com/org/repo/releases/tag/v1.4.2"       # <- invalid chars`,
        right: `metadata:
  labels:                            # identifying + queryable, short, restricted charset
    app.kubernetes.io/name: checkout
    env: prod
    team: payments
    version: "1.4.2"
  annotations:                       # data for tools/humans, any size/charset, not queryable
    git-commit: "a1b2c3d"
    git-commit-message: "fix: handle the null case in checkout (#4821)"
    changelog-url: "https://github.com/org/repo/releases/tag/v1.4.2"
    kubernetes.io/change-cause: "checkout v1.4.2"`,
        why: 'Labels and annotations are both key/value metadata but serve different purposes, and putting information in the wrong one causes concrete problems. Labels are indexed and selectable, with a restricted character set and a 63-character limit on values, because they are designed for querying and grouping and the constraints keep that fast and unambiguous. An environment or team value belongs in a label so it can be used in a selector; placed in an annotation it is invisible to every selector-based operation. Conversely, a commit message, a URL, or any free-form or long text placed in a label either violates the character restrictions and is rejected, or, if it fits, adds noise to the label space that every selector must now scan past. Annotations have no length or character constraints and are not indexed for selection, which is exactly right for data that tools and people read but that is never used to find or route to an object. The rule is to ask whether you will ever select, group, or route by the value: if so it is a label, if not it is an annotation.',
        whyHi: 'Labels aur annotations dono key/value metadata hain par alag purposes serve karte hain, aur galat mein information rakhna concrete problems cause karta hai. Labels indexed aur selectable hain, ek restricted character set aur values par ek 63-character limit ke saath, kyunki wo querying aur grouping ke liye designed hain. Ek environment ya team value ek label mein belong karti hai taaki ise ek selector mein use kiya ja sake; ek annotation mein rakhi ye har selector-based operation ko invisible hai. Iske विपरीत, ek commit message, ek URL, ya koi free-form text ek label mein rakha ya to character restrictions violate karta hai aur reject hota hai, ya label space mein noise add karta hai. Rule ye poochna hai ki kya aap kabhi value se select, group, ya route karoge.',
      },
    ],

    realWorld: [
      {
        en: '**A `kubectl get pods` that "showed nothing"** for 20 minutes of confusion — the Deployment was fine, in namespace `payments`, and the engineer\'s context defaulted to `default`. `kubens payments` (or `-n`) and it was all there. Now `kube-ps1` shows the namespace in everyone\'s prompt.',
        hi: '**Ek `kubectl get pods` jo "kuch nahi dikhata tha"** 20 minute confusion ke liye — Deployment fine tha, namespace `payments` mein.',
      },
      {
        en: '**A Service with zero endpoints in prod** — the Deployment template labelled Pods `app: api` but the Service selector said `app: api-service`. Traffic got `connection refused`. The fix was one word; the lesson was "always check `kubectl get endpoints` when a Service seems down".',
        hi: '**Prod mein zero endpoints wali ek Service** — Deployment template ne Pods ko `app: api` labelled kiya par Service selector ne `app: api-service` kaha.',
      },
      {
        en: '**An immutable-selector wall during a refactor** — someone tried to change a Deployment\'s `selector.matchLabels` from `{app: web}` to `{app: web, tier: frontend}` and `kubectl apply` rejected it. Had to delete + recreate the Deployment (a brief outage). Selectors are now `{app, env}` only, chosen once.',
        hi: '**Ek refactor ke dauran ek immutable-selector wall** — kisi ne ek Deployment ka `selector.matchLabels` change karne ki koshish ki aur `kubectl apply` ne reject kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a namespace for, and why is it not a security boundary on its own?',
        qHi: 'Ek namespace kis liye hai, aur ye apne aap ek security boundary kyun nahi hai?',
        a: 'A namespace partitions one physical cluster into virtual sub-clusters. Most objects are namespaced — Pods, Deployments, Services, ConfigMaps, Secrets, RoleBindings — while a smaller set is cluster-scoped, such as Nodes, PersistentVolumes, StorageClasses, and ClusterRoles. Namespacing means kubectl get is scoped to one namespace unless you pass the all-namespaces flag, names are unique only within a namespace and kind, and policy objects attach to the namespace: a ResourceQuota caps its total CPU, memory, and object counts; a LimitRange sets default and maximum requests and limits; RBAC RoleBindings grant permissions within it; a NetworkPolicy controls its Pods\' traffic. You use namespaces to separate teams, environments, and tenants. It is not a security boundary by itself because the isolation it provides is organisational, not enforced: Pods in different namespaces share the pod network and can reach each other unless a NetworkPolicy stops them, and a compromised Pod\'s reach is determined by its ServiceAccount and the RBAC bound to it, not by which namespace it sits in. The namespace is the unit that quotas, RBAC, and NetworkPolicy attach to; the actual security comes from configuring those consistently on every namespace.',
        aHi: 'Ek namespace ek physical cluster ko virtual sub-clusters mein partition karta hai. Zyaadatar objects namespaced hain, jabki ek chhota set cluster-scoped hai, jaise Nodes, PersistentVolumes, ClusterRoles. Namespacing ka matlab kubectl get ek namespace ko scoped hai jab tak aap all-namespaces flag pass nahi karte, names sirf ek namespace aur kind ke andar unique hain, aur policy objects namespace se attach hote hain: ek ResourceQuota iski total CPU/memory/object counts cap karta hai; ek LimitRange default aur maximum requests aur limits set karta hai; RBAC RoleBindings ismein permissions grant karte hain; ek NetworkPolicy iske Pods ka traffic control karti hai. Ye apne aap ek security boundary nahi hai kyunki jo isolation ye provide karta hai wo organisational hai, enforced nahi.',
      },
      {
        q: 'Explain labels versus annotations and the three places a label selector matters.',
        qHi: 'Labels versus annotations samjhao aur teen jagahen jahan ek label selector matter karta hai.',
        a: 'Both are key/value metadata under an object\'s metadata, but they serve different purposes. Labels carry identifying information you will want to select or group by; they have a restricted character set and a 63-character limit on values, because they are indexed for fast querying. Annotations carry non-identifying metadata that tools and people read — a git SHA, a changelog URL, a controller tuning flag, the last-applied configuration — with no length or character constraints and no indexing for selection. The test for which to use is whether you will ever find, group, or route by the value: if yes it is a label, if no it is an annotation. A label selector is a query over labels, either equality-based with comma-ANDed terms or set-based with in, notin, existence, and non-existence. It matters in three places. First, kubectl with the label flag, to filter what you list or act on. Second, a Service\'s selector, which defines exactly the Pods the Service load-balances over, with the endpoint list updated automatically as matching Pods appear and disappear. Third, a workload controller\'s selector — a Deployment, ReplicaSet, or StatefulSet uses it to identify the Pods it owns, it must be satisfied by the labels in the controller\'s Pod template, and for a Deployment it is immutable after creation, so it should be a small stable set like the app name and environment.',
        aHi: 'Dono ek object ke metadata ke under key/value metadata hain, par alag purposes serve karte hain. Labels identifying information carry karte hain jisse aap select ya group karna chahoge; unke paas ek restricted character set aur values par ek 63-character limit hai, kyunki wo fast querying ke liye indexed hain. Annotations non-identifying metadata carry karte hain jo tools aur log padhte hain, koi length ya character constraints nahi. Test ye hai ki kya aap kabhi value se find, group, ya route karoge. Ek label selector labels ke upar ek query hai. Ye teen jagahon par matter karta hai: kubectl label flag ke saath; ek Service ka selector (wo Pods define karta hai jinpar ye load-balance karta hai); ek workload controller ka selector (ek Deployment ise iske owned Pods identify karne ke liye use karta hai, ye creation ke baad immutable hai).',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain what namespaces scope, name the 4 built-ins (and which 2 you must never deploy into), list 4 things that attach to a namespace, and give the cross-namespace DNS form.',
        taskHi: 'Ek comment mein, namespaces kya scope karte hain samjhao.',
        hint: 'Namespaces partition ONE physical cluster into virtual sub-clusters. MOST objects are namespaced (Pods, Deployments, Services, ConfigMaps, Secrets, PVCs, RoleBindings); some are CLUSTER-scoped (Nodes, PersistentVolumes, Namespaces, ClusterRoles, StorageClasses, CRDs — `kubectl api-resources --namespaced=false`). `kubectl get` shows ONLY the current namespace unless `-A`. Names are unique per namespace+kind. 4 BUILT-INS: `default` (objects with no namespace — NEVER deploy real workloads here), `kube-system` (cluster components — NEVER deploy here), `kube-public` (world-readable info), `kube-node-lease` (node heartbeats). ATTACHES TO A NAMESPACE: ResourceQuota (total cpu/mem/object counts), LimitRange (default+max per Pod/container), RBAC RoleBindings, NetworkPolicy, a default ServiceAccount. CROSS-NAMESPACE DNS: `<svc>.<namespace>.svc.cluster.local` (same-namespace: just `<svc>`). NOT a security boundary alone — pair with RBAC + NetworkPolicy + quotas.',
        hintHi: 'Namespaces ONE physical cluster ko virtual sub-clusters mein partition karte hain. ZYAADATAR objects namespaced; kuch CLUSTER-scoped (Nodes, PVs, ClusterRoles, StorageClasses). `kubectl get` SIRF current namespace dikhata hai. 4 BUILT-INS: `default` (NEVER real workloads), `kube-system` (NEVER), `kube-public`, `kube-node-lease`. ATTACHES: ResourceQuota, LimitRange, RBAC RoleBindings, NetworkPolicy, default ServiceAccount. CROSS-NAMESPACE DNS: `<svc>.<namespace>.svc.cluster.local`.',
      },
      {
        task: 'In a comment, write the equality and set-based selector syntaxes with an example of each, and name the three places selectors matter (with the immutability rule for one of them).',
        taskHi: 'Ek comment mein, equality aur set-based selector syntaxes likho.',
        hint: 'EQUALITY-BASED: `app=web`, `env!=prod`, comma-ANDed → `app=web,env=prod,tier=frontend`. SET-BASED: `env in (prod,staging)`, `tier notin (cache,queue)`, `app` (the key exists, any value), `!deprecated` (the key does NOT exist). THREE PLACES: (1) `kubectl ... -l <selector>` — filter what you list/act on (`kubectl get pods -l app=web,env=prod`, `kubectl delete pods -l tier=canary`); (2) a SERVICE\'s `spec.selector` — the exact Pods it load-balances over, endpoint list auto-updated as matching Pods come/go; (3) a WORKLOAD CONTROLLER\'s `spec.selector` (Deployment/ReplicaSet/StatefulSet) — how it identifies "its" Pods; `spec.selector.matchLabels` MUST be a subset of `spec.template.metadata.labels`, AND for a Deployment it is IMMUTABLE after creation (changing it = delete + recreate the Deployment). So pick the selector to be stable + specific from the start (`app`, maybe `env` — never a version/hash that changes).',
        hintHi: 'EQUALITY-BASED: `app=web`, `env!=prod`, comma-ANDed. SET-BASED: `env in (prod,staging)`, `app` (key hai), `!deprecated` (key nahi hai). TEEN JAGAHEN: (1) `kubectl ... -l <selector>`; (2) ek SERVICE ka `spec.selector` — wo Pods jinpar ye load-balance karta hai; (3) ek WORKLOAD CONTROLLER ka `spec.selector` — `matchLabels` `template.metadata.labels` ka subset HONA chahiye, AUR ek Deployment ke liye ye creation ke baad IMMUTABLE hai (change = delete + recreate).',
      },
      {
        task: 'In a comment, give the test for label-vs-annotation, sort these into the right bucket, and explain the failure mode of getting each wrong: `env`, `team`, `app`, git-SHA, changelog URL, `kubernetes.io/change-cause`, `prometheus.io/scrape`, a commit message.',
        taskHi: 'Ek comment mein, label-vs-annotation ke liye test do.',
        hint: 'TEST: will you ever FIND / GROUP / ROUTE by this value? → LABEL. Is it data FOR A TOOL / HUMAN to read about the object? → ANNOTATION. LABELS: `env`, `team`, `app` (all selectable — you\'ll `-l env=prod`, a Service selects `app=`, RBAC/NetworkPolicy target `team=`). ANNOTATIONS: git-SHA, changelog URL, `kubernetes.io/change-cause` (shows in `rollout history`), `prometheus.io/scrape` (Prometheus reads it), a commit message (long, has spaces/punctuation). FAILURE MODES: selectable data (env/team) in an ANNOTATION → invisible to every `-l` query, every Service selector, every RBAC/NetworkPolicy match. Free-form/long data (commit message, URL) in a LABEL → either REJECTED (invalid chars: spaces, `/`, `:`; or >63 chars) or, if it squeaks through, pollutes the label space every selector must scan. Annotations have no length/charset limit and aren\'t indexed — exactly right for read-only tool data.',
        hintHi: 'TEST: kya aap kabhi is value se FIND / GROUP / ROUTE karoge? → LABEL. Kya ye ek TOOL / HUMAN ke padhne ke liye data hai? → ANNOTATION. LABELS: `env`, `team`, `app`. ANNOTATIONS: git-SHA, changelog URL, `kubernetes.io/change-cause`, `prometheus.io/scrape`, ek commit message. FAILURE MODES: selectable data (env/team) ek ANNOTATION mein → har `-l` query ko invisible. Free-form/long data (commit message, URL) ek LABEL mein → ya REJECTED (invalid chars ya >63 chars) ya label space pollute karta hai.',
      },
    ],

    keyTakeaways: [
      'NAMESPACES partition ONE physical cluster into virtual sub-clusters. MOST objects are namespaced (Pods, Deployments, Services, ConfigMaps, Secrets, PVCs, RoleBindings); a smaller set is CLUSTER-scoped (Nodes, PersistentVolumes, Namespaces, ClusterRoles, StorageClasses, CRDs — `kubectl api-resources --namespaced=false`). `kubectl get` shows ONLY the current namespace unless `-A`; names are unique per namespace+kind. ATTACHES to a namespace: ResourceQuota (total cpu/mem/object counts), LimitRange (default+max per Pod/container), RBAC RoleBindings, NetworkPolicy, a default ServiceAccount. Cross-namespace DNS: `<svc>.<namespace>.svc.cluster.local` (same-ns: just `<svc>`). The 4 built-ins: `default`, `kube-system`, `kube-public`, `kube-node-lease` — NEVER deploy workloads into `default` or `kube-system`. Use namespaces per team / per env / per tenant. A namespace is NOT a security boundary by itself — it\'s the UNIT that RBAC + NetworkPolicy + quotas attach to; security comes from configuring those.',
      'LABELS are key/value pairs under `metadata.labels` for IDENTIFYING info you\'ll SELECT or GROUP by. Key = optional `prefix/` + name (≤63 chars each); value ≤63 chars, alnum + `-_.`. The recommended common set: `app.kubernetes.io/name`, `/instance`, `/version`, `/component`, `/part-of`, `/managed-by` — plus your own `env`, `team`, `tier`, `cost-center`.',
      'SELECTORS query labels. EQUALITY-BASED: `app=web`, `env!=prod`, comma = AND (`app=web,env=prod`). SET-BASED: `env in (prod,staging)`, `tier notin (cache)`, `app` (key exists), `!deprecated` (key absent). Selectors matter in THREE places: (1) `kubectl ... -l <selector>` — filter what you list/act on; (2) a SERVICE\'s `spec.selector` — the exact Pods it load-balances over, endpoints auto-updated as matching Pods come/go; (3) a WORKLOAD CONTROLLER\'s `spec.selector` — how a Deployment/ReplicaSet/StatefulSet identifies "its" Pods. `spec.selector.matchLabels` MUST be a subset of `spec.template.metadata.labels`, AND for a Deployment it is IMMUTABLE after creation (changing it = delete + recreate → outage). Pick it STABLE + specific from the start (`app`, maybe `env` — never a version/hash). A ReplicaSet\'s reconciliation input is literally "count Pods matching my selector vs my replica count" — which is why a stray Pod with matching labels gets ADOPTED and two workloads with overlapping selectors fight.',
      'ANNOTATIONS are key/value pairs under `metadata.annotations` for NON-identifying metadata that TOOLS read — NOT queryable by selectors, no 63-char limit, value can be large + structured (JSON). Uses: `kubernetes.io/change-cause` (shows in `kubectl rollout history`), controller config (`prometheus.io/scrape`, `nginx.ingress.kubernetes.io/*`, `cert-manager.io/cluster-issuer`), system bookkeeping (`kubectl.kubernetes.io/last-applied-configuration`, `deployment.kubernetes.io/revision`), your own tooling (git SHA, CI run URL, PR number, on-call owner).',
      'LABEL vs ANNOTATION — the test: will you ever FIND / GROUP / ROUTE by it? → LABEL (`app`, `env`, `team`, `tier`, `component`). Is it data FOR A TOOL / HUMAN to read? → ANNOTATION (git SHA, changelog URL, last-applied config, an Ingress tuning knob, a Prometheus flag, a commit message). FAILURE MODES: selectable data (`env`, `team`) in an ANNOTATION → invisible to every `-l` query, Service selector, RBAC/NetworkPolicy match. Free-form/long data (commit message, URL) in a LABEL → REJECTED (invalid chars: spaces, `/`, `:`; or >63 chars) or pollutes the label space every selector scans. A Service with a selector that doesn\'t exactly match the Pods\' labels → ZERO endpoints → every client gets "connection refused" with no obvious error (the Service exists, has a VIP, DNS resolves) — always `kubectl get endpoints <svc>` and compare the selector to the actual Pod labels.',
    ],
    keyTakeawaysHi: [
      'NAMESPACES ONE physical cluster ko virtual sub-clusters mein partition karte hain. ZYAADATAR objects namespaced; ek chhota set CLUSTER-scoped (Nodes, PVs, ClusterRoles, StorageClasses, CRDs). `kubectl get` SIRF current namespace dikhata hai jab tak `-A` nahi. ATTACHES: ResourceQuota, LimitRange, RBAC RoleBindings, NetworkPolicy, default ServiceAccount. Cross-namespace DNS: `<svc>.<namespace>.svc.cluster.local`. 4 built-ins: `default`, `kube-system`, `kube-public`, `kube-node-lease` — `default` ya `kube-system` mein workloads KABHI deploy mat karo. Ek namespace apne aap ek security boundary NAHI — ye UNIT hai jispar RBAC + NetworkPolicy + quotas attach hote hain.',
      'LABELS `metadata.labels` ke under key/value pairs hain IDENTIFYING info ke liye jisse aap SELECT ya GROUP karoge. Key ≤63 chars; value ≤63 chars. Recommended common set: `app.kubernetes.io/name`, `/instance`, `/component`, `/part-of`, `/managed-by` — plus aapke `env`, `team`, `tier`.',
      'SELECTORS labels query karte hain. EQUALITY-BASED: `app=web`, `env!=prod`, comma = AND. SET-BASED: `env in (prod,staging)`, `app` (key hai), `!deprecated` (key nahi hai). TEEN jagahen: (1) `kubectl ... -l <selector>`; (2) ek SERVICE ka `spec.selector`; (3) ek WORKLOAD CONTROLLER ka `spec.selector`. `matchLabels` `template.metadata.labels` ka subset HONA chahiye, AUR ek Deployment ke liye ye creation ke baad IMMUTABLE hai. Ise STABLE + specific choose karo (`app`, maybe `env`).',
      'ANNOTATIONS `metadata.annotations` ke under key/value pairs hain NON-identifying metadata ke liye jo TOOLS padhte hain — selectors dwara queryable NAHI, koi 63-char limit nahi. Uses: `kubernetes.io/change-cause`, controller config (`prometheus.io/scrape`, `nginx.ingress.kubernetes.io/*`), system bookkeeping (`last-applied-configuration`), aapki apni tooling (git SHA, CI run URL).',
      'LABEL vs ANNOTATION — test: kya aap kabhi is se FIND / GROUP / ROUTE karoge? → LABEL. Kya ye ek TOOL / HUMAN ke padhne ke liye data hai? → ANNOTATION. FAILURE MODES: selectable data ek ANNOTATION mein → har `-l` query ko invisible. Free-form/long data ek LABEL mein → REJECTED ya label space pollute karta hai. Ek Service jiska selector Pods ke labels se exactly match nahi karta → ZERO endpoints → har client ko "connection refused" bina ek obvious error ke — hamesha `kubectl get endpoints <svc>` aur selector ko actual Pod labels se compare karo.',
    ],
  },
];
