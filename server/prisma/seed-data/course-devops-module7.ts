/**
 * DevOps Complete Course — Module 7: Kubernetes — Architecture, Pods & the
 * Reconciliation Loop, lessons 1-3.
 *
 * Lesson 1: Why orchestration — the problems Kubernetes solves that a single host
 *           with Compose cannot (self-healing, bin-packing, rollout, discovery,
 *           scaling). PROSE + realistic output.
 * Lesson 2: The control plane & the node — apiserver / etcd / scheduler /
 *           controller-manager, kubelet, kube-proxy, the container runtime.
 *           PROSE + realistic `kubectl` output.
 * Lesson 3: Desired vs actual — the reconciliation loop, the object model
 *           (apiVersion/kind/metadata/spec/status), declarative `kubectl apply`.
 *           VERIFIED against a real single-node cluster (kind) where one is up;
 *           `kubectl explain` runs offline.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_7: CourseLesson[] = [
  {
    slug: 'ops-why-orchestration',
    title: 'Why Orchestration',
    titleHi: 'Orchestration Kyun',
    description: 'A single host with Compose restarts a crashed container and runs a fixed number of replicas, and for many services that is enough. Orchestration exists for the things it cannot do: reschedule work when a whole machine dies, pack many services efficiently across a fleet, roll out a new version one replica at a time with automatic rollback, and give every service a stable name and a load-balanced address.',
    descriptionHi: 'Compose ke saath ek single host ek crashed container ko restart karta hai aur ek fixed number ke replicas chalata hai, aur bahut si services ke liye wo kaafi hai. Orchestration un cheezon ke liye exist karta hai jo ye nahi kar sakta: kaam reschedule karna jab ek poori machine marti hai, ek fleet ke across bahut si services efficiently pack karna, ek naya version ek-ek replica karke roll out karna automatic rollback ke saath, aur har service ko ek stable naam aur ek load-balanced address dena.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**One shopkeeper who reopens after a power cut, versus a retail chain\'s operations centre.** The shopkeeper (Compose + `restart: unless-stopped`) flips the breaker back on when the lights go out — genuinely useful, and enough for one shop. But if the *building* floods, the shop is shut until someone fixes the building; there is no second location that automatically takes the customers, no head office that redistributes staff to the busy branches, no procedure to change every shop\'s window display overnight without closing any of them, and no switchboard that always connects "the bakery" to whichever bakery is currently open. An operations centre (Kubernetes) is exactly that missing layer: it watches every branch, moves work and staff around failures, changes displays a few branches at a time while watching sales, and keeps a directory that always resolves to a working location.',
      hi: '**Ek shopkeeper jo ek power cut ke baad reopen karta hai, versus ek retail chain ka operations centre.** Shopkeeper (Compose + `restart: unless-stopped`) breaker wapas on karta hai jab lights jaati hain — genuinely useful, aur ek shop ke liye kaafi. Par agar *building* mein flood aati hai, shop tab tak shut hai jab tak koi building fix nahi karta; koi second location nahi jo automatically customers leti hai, koi head office nahi jo busy branches ko staff redistribute karta hai, koi procedure nahi har shop ka window display overnight badalne ke liye bina kisi ko band kiye, aur koi switchboard nahi jo hamesha "the bakery" ko jo bhi bakery currently open hai usse connect karta hai. Ek operations centre (Kubernetes) exactly wo missing layer hai.',
    },

    simple: `**COMPOSE ON ONE HOST does: restart a crashed container · run a fixed replica count ·
service-name DNS on one box · a manual deploy. That covers a LOT of real services.**

**ORCHESTRATION (Kubernetes, Nomad, ECS, Swarm) adds the things one host can't:**
\`\`\`
1. SELF-HEALING ACROSS NODES   a node dies -> its Pods are rescheduled onto healthy
                               nodes automatically, no human. (one host: everything on
                               it is just down.)
2. BIN-PACKING / SCHEDULING    you declare "this Pod needs 0.5 CPU + 512Mi"; the
                               scheduler places it on a node that has room, across a
                               fleet of 3 / 30 / 300 machines. (one host: it fits or it doesn't.)
3. DECLARATIVE ROLLOUTS        "move from v1 to v2": update N replicas at a time, wait
                               for each to pass its readiness probe, stop + roll back
                               automatically if they don't. (one host: manual + coarse.)
4. SERVICE DISCOVERY + LB      every Service gets a STABLE virtual IP + DNS name that
                               load-balances across its current healthy Pods, wherever
                               they are. (one host: Compose DNS, no cross-host LB.)
5. HORIZONTAL AUTOSCALING      add/remove Pods based on CPU / latency / a custom metric.
                               (one host: '--scale' is a number you set by hand.)
6. CONFIG / SECRET / STORAGE   ConfigMaps, Secrets, PersistentVolumes as first-class
   AS API OBJECTS              cluster resources, decoupled from any node.
7. MULTI-TENANCY               namespaces + RBAC + quotas + NetworkPolicy so many teams
                               share one cluster safely.
\`\`\`

**THE ONE IDEA UNDERNEATH ALL OF IT — the RECONCILIATION LOOP (Lesson 3):**
\`\`\`
you POST a desired state to the API   ("I want 3 replicas of app:v2")
   -> stored in etcd
   -> a CONTROLLER notices actual != desired
   -> it takes ONE step toward desired  (create a Pod / delete a Pod / ...)
   -> repeat forever.
\`\`\`
Everything — Deployments, self-healing, autoscaling, rollouts — is a controller
running this loop on a different kind of object. You describe the destination;
the system continuously drives toward it.

**THE COST (be honest about it):**
\`\`\`
- a control plane to run (or pay a cloud to run: EKS/GKE/AKS ~ $70/mo + nodes)
- YAML, and lots of it (Deployment + Service + Ingress + ConfigMap + ... per app)
- new failure modes: scheduling, networking (CNI), DNS, admission webhooks, etcd
- version upgrades every ~4 months; API deprecations
- you now operate a distributed system to run your distributed system
\`\`\`

**WHEN IT'S WORTH IT:** you genuinely need #1-#5 above — automatic survival of node
failure, scheduling across a real fleet, safe automated rollouts, cross-node LB,
autoscaling — OR many teams need self-service. If not, a single host (Module 6) or a
PaaS is less to operate. **Adopt K8s when its problems are your problems, not before.**`,

    simpleHi: `**COMPOSE EK HOST PAR karta hai: ek crashed container restart · ek fixed replica count ·
ek box par service-name DNS · ek manual deploy. Ye BAHUT si real services cover karta hai.**

**ORCHESTRATION (Kubernetes, Nomad, ECS, Swarm) wo cheezein add karta hai jo ek host nahi kar sakta:**
\`\`\`
1. NODES KE ACROSS SELF-HEALING   ek node marta hai -> iske Pods healthy nodes par
                                  automatically rescheduled, koi human nahi.
2. BIN-PACKING / SCHEDULING       aap declare karte ho "is Pod ko 0.5 CPU + 512Mi chahiye";
                                  scheduler ise ek node par place karta hai jiske paas room hai.
3. DECLARATIVE ROLLOUTS           "v1 se v2 par jao": ek baar mein N replicas update karo, har
                                  ek ke readiness probe pass karne ka wait karo, na karein to
                                  automatically roll back karo.
4. SERVICE DISCOVERY + LB         har Service ko ek STABLE virtual IP + DNS naam milta hai jo
                                  iske current healthy Pods ke across load-balance karta hai.
5. HORIZONTAL AUTOSCALING         CPU / latency / ek custom metric ke basis par Pods add/remove.
6. CONFIG / SECRET / STORAGE      ConfigMaps, Secrets, PersistentVolumes as first-class cluster resources.
   AS API OBJECTS
7. MULTI-TENANCY                  namespaces + RBAC + quotas + NetworkPolicy.
\`\`\`

**IN SAB KE NEECHE EK IDEA — RECONCILIATION LOOP (Lesson 3):**
\`\`\`
aap API ko ek desired state POST karte ho   ("main app:v2 ke 3 replicas chahta hoon")
   -> etcd mein stored
   -> ek CONTROLLER notice karta hai actual != desired
   -> ye desired ki taraf EK step leta hai  (ek Pod banao / ek Pod delete karo / ...)
   -> forever repeat.
\`\`\`
Sab kuch — Deployments, self-healing, autoscaling, rollouts — ek controller hai jo ye loop
ek alag kind ke object par chala raha hai.

**COST:**
\`\`\`
- ek control plane chalane ke liye (ya ek cloud ko pay karo: EKS/GKE/AKS ~ $70/mo + nodes)
- YAML, aur bahut sara
- naye failure modes: scheduling, networking (CNI), DNS, admission webhooks, etcd
- version upgrades har ~4 months; API deprecations
- aap ab ek distributed system operate karte ho apne distributed system ko chalane ke liye
\`\`\`

**KAB WORTH HAI:** aapko genuinely upar ke #1-#5 chahiye — node failure ka automatic survival,
ek real fleet ke across scheduling, safe automated rollouts, cross-node LB, autoscaling — YA kai
teams ko self-service chahiye. Warna, ek single host (Module 6) ya ek PaaS kam operate karne ka hai.`,

    content: `## What a single host already does

Module 6 established that a single host running Compose gives you: a crashed container restarted by \`restart: unless-stopped\`; a fixed number of replicas via \`--scale\` or \`replicas:\`; service discovery by name on that host; health-gated startup ordering; resource limits; and a deploy that recreates only what changed. For a large fraction of services — including production, revenue-generating ones — that is genuinely enough, and it is far less to operate than a cluster.

## What it fundamentally cannot do

Orchestration platforms — Kubernetes, HashiCorp Nomad, AWS ECS, Docker Swarm — exist for the capabilities that are impossible on one host because they require coordinating *many* hosts.

### 1. Self-healing across nodes

On one host, if the host fails — hardware fault, kernel panic, the VM is terminated — every service on it is down until a person notices and acts. There is nowhere else for the work to go. An orchestrator runs your workloads across a set of nodes and continuously watches them; when a node stops responding, the orchestrator **reschedules that node's workloads onto the remaining healthy nodes automatically**, with no human involved. The service degrades briefly and recovers on its own.

### 2. Bin-packing and scheduling

On one host, a workload either fits in the host's CPU and memory or it does not. An orchestrator has a **scheduler**: you declare what each workload needs (\`0.5\` CPU, \`512Mi\` of memory), and the scheduler finds a node in the fleet that has room and places it there, packing workloads efficiently across 3, 30, or 300 machines. Adding capacity is adding a node; the scheduler starts using it.

### 3. Declarative rollouts

On one host, deploying a new version is recreating containers — coarse, and without built-in health gating across replicas or automatic rollback. An orchestrator makes a rollout a **declarative operation**: you change the desired version, and the platform updates replicas a controlled number at a time, waits for each new replica to pass its readiness check before proceeding, and — if the new replicas fail their checks — stops and rolls back to the previous version automatically. (Module 11 goes deep on strategies.)

### 4. Service discovery and load balancing across nodes

On one host, Compose's embedded DNS resolves service names, but there is no built-in load balancer across replicas and certainly not across hosts. An orchestrator gives every logical service a **stable virtual address and DNS name** that automatically load-balances across whichever healthy instances of that service currently exist, on whatever nodes they happen to be running. The address does not change when instances are rescheduled.

### 5. Horizontal autoscaling

On one host, the replica count is a number you set by hand. An orchestrator can **adjust the number of replicas automatically** based on observed CPU utilisation, request latency, queue depth, or a custom metric, adding instances under load and removing them when load falls — and, with a cluster autoscaler, adding and removing *nodes* to fit.

### 6. Configuration, secrets, and storage as API objects

An orchestrator models configuration (\`ConfigMap\`), secrets (\`Secret\`), and persistent storage (\`PersistentVolume\` / \`PersistentVolumeClaim\`) as **first-class cluster resources**, decoupled from any particular node, so a workload that is rescheduled to a different node still gets its config and its data.

### 7. Multi-tenancy

An orchestrator provides **namespaces** to partition a cluster, **role-based access control** to limit who can do what, **resource quotas** to bound each team's consumption, and **network policy** to control which workloads may talk to which — so many teams can share one cluster without interfering with each other.

## The single idea underneath all of it

Every one of those capabilities is implemented the same way: a **reconciliation loop** (Lesson 3). You submit a description of the **desired state** to the platform's API — "I want three replicas of this application at version 2". The platform stores it, and a **controller** — a small program whose entire job is one kind of object — continuously compares the **actual state** of the cluster to the desired state and takes one corrective step at a time: create a missing replica, delete an extra one, start rolling an update, move a Pod off a failed node. It never stops; it is always driving actual toward desired.

Self-healing is a controller noticing a Pod is gone and creating a replacement. A rollout is a controller changing which version the replicas should run, a few at a time. Autoscaling is a controller adjusting the desired replica count from a metric. You describe the destination; controllers continuously drive there.

## The cost

Adopting an orchestrator is not free:

- **A control plane to operate** — the API server, the datastore, the scheduler, the controllers — or a bill to a cloud provider to operate it for you (a managed Kubernetes control plane is roughly seventy dollars a month before you add any nodes).
- **A large amount of YAML** — a typical application is a Deployment, a Service, an Ingress, one or more ConfigMaps and Secrets, and often more.
- **New failure modes** — scheduling problems, the cluster network plugin (CNI), cluster DNS, admission webhooks, the datastore. Debugging shifts from "read the app log" to "why is this Pod Pending" and "why can this Pod not resolve that Service".
- **An upgrade cadence** — Kubernetes releases roughly every four months and supports a version for about a year, with periodic API removals that require manifest changes.
- **Operational weight** — you are now running a distributed system in order to run your distributed system.

## When it is worth it

The honest test: do you have a concrete, present need for the capabilities above? A service that must survive a node failure automatically with no human in the loop; workloads to schedule across a real fleet; frequent deploys that need safe automated rollout and rollback; load that varies enough to require autoscaling; multiple teams that need to self-serve. If several of those are true, an orchestrator earns its cost. If none are — one host has capacity, a brief reboot is acceptable, one or two people operate a predictable workload — a single host (Module 6) or a platform-as-a-service is much less to run. The failure mode to avoid is adopting Kubernetes to pre-empt scale you do not have yet, and taking on all of its operational surface to run a handful of services a single machine handled fine.

The rest of Modules 7–9 assumes you have made that decision and teaches Kubernetes specifically, because it is the orchestrator the industry has standardised on. Nomad and ECS solve the same problems with less surface area and are legitimate choices; Swarm is the lightest step up from Compose. The concepts — desired state, reconciliation, scheduling, services, rollouts — transfer across all of them.`,

    contentHi: `## Ek single host already kya karta hai

Module 6 ne establish kiya ki Compose chalane wala ek single host aapko deta hai: \`restart: unless-stopped\` se restart hone wala ek crashed container; \`--scale\` ya \`replicas:\` se ek fixed number ke replicas; us host par naam se service discovery; health-gated startup ordering; resource limits; aur ek deploy jo sirf jo badla wo recreate karta hai. Services ke ek bade fraction ke liye wo genuinely kaafi hai.

## Ye fundamentally kya nahi kar sakta

Orchestration platforms — Kubernetes, Nomad, AWS ECS, Docker Swarm — un capabilities ke liye exist karte hain jo ek host par impossible hain kyunki unhe *kai* hosts coordinate karne ki zaroorat hai.

**1. Nodes ke across self-healing.** Ek host par, agar host fail hota hai, uspar har service down hai jab tak ek person act nahi karta. Ek orchestrator jab ek node respond karna band karta hai, us node ke workloads ko baaki healthy nodes par **automatically reschedule** karta hai.

**2. Bin-packing aur scheduling.** Ek orchestrator ke paas ek **scheduler** hai: aap declare karte ho har workload ko kya chahiye (\`0.5\` CPU, \`512Mi\`), aur scheduler fleet mein ek node dhoondta hai jiske paas room hai.

**3. Declarative rollouts.** Ek orchestrator ek rollout ko ek **declarative operation** banata hai: aap desired version badalte ho, aur platform ek controlled number ek baar mein replicas update karta hai, har naye replica ke readiness check pass karne ka wait karta hai, aur — agar naye replicas fail karte hain — automatically previous version par roll back karta hai.

**4. Service discovery aur load balancing nodes ke across.** Ek orchestrator har logical service ko ek **stable virtual address aur DNS naam** deta hai jo automatically us service ke current healthy instances ke across load-balance karta hai.

**5. Horizontal autoscaling.** Ek orchestrator observed CPU utilisation, request latency, queue depth, ya ek custom metric ke basis par **replicas ki sankhya automatically adjust** kar sakta hai.

**6. Configuration, secrets, aur storage as API objects.** Ek orchestrator configuration (\`ConfigMap\`), secrets (\`Secret\`), aur persistent storage ko **first-class cluster resources** ke roop mein model karta hai.

**7. Multi-tenancy.** **Namespaces**, **RBAC**, **resource quotas**, aur **network policy**.

## In sab ke neeche ek idea

Un capabilities mein se har ek same tarike se implemented hai: ek **reconciliation loop** (Lesson 3). Aap **desired state** ka ek description platform ke API ko submit karte ho. Platform ise store karta hai, aur ek **controller** continuously cluster ke **actual state** ko desired state se compare karta hai aur ek baar mein ek corrective step leta hai. Ye kabhi nahi rukta.

## Cost

- **Ek control plane operate karne ke liye** — ya ek cloud provider ko bill (~$70/month).
- **YAML ki ek badi maatra**.
- **Naye failure modes** — scheduling, CNI, cluster DNS, admission webhooks, datastore.
- **Ek upgrade cadence** — har ~4 months.
- **Operational weight** — aap ab ek distributed system chala rahe ho apne distributed system ko chalane ke liye.

## Kab worth hai

Honest test: kya aapke paas upar ke capabilities ke liye ek concrete, present need hai? Agar kai true hain, ek orchestrator apni cost earn karta hai. Agar koi nahi — ek host ke paas capacity hai, ek brief reboot acceptable hai — ek single host ya ek PaaS bahut kam chalane ka hai. Avoid karne wala failure mode Kubernetes ko wo scale pre-empt karne ke liye adopt karna hai jo aapke paas abhi tak nahi hai.`,

    examples: [
      {
        title: 'The capability gap, side by side',
        titleHi: 'Capability gap, side by side',
        code: `SCENARIO                          COMPOSE (1 host)              KUBERNETES (a cluster)
--------------------------------  ---------------------------  ---------------------------
a container's process crashes     restarted by 'restart:'      Pod restarted by the kubelet
                                  unless-stopped                (same idea)

the HOST dies (kernel panic /     everything on it is DOWN     Pods rescheduled onto other
 disk / VM terminated)             until a human acts           nodes automatically (~minutes)

deploy app v1 -> v2               recreate the container;      rolling update: N at a time,
                                  brief downtime unless you    each gated on readiness, auto-
                                  hand-roll 2 replicas         rollback if a check fails

3 replicas of an HTTP service     you must configure the       Service = 1 stable VIP that
 across the fleet                  reverse proxy as an          load-balances across all
                                  upstream pool                 healthy Pods, any node

load doubles at 9am               you SSH in and raise         HorizontalPodAutoscaler adds
                                  '--scale' by hand            replicas from a CPU target

need 40 services, 6 teams,        one big compose file,        namespaces + RBAC + quotas +
 isolation between teams           no isolation                 NetworkPolicy per team`,
        output: `Every row where Compose says "a human acts" or "you configure" or "you SSH in" is a row where an orchestrator has a controller doing it automatically. That automation is the entire value proposition - and the entire cost, because those controllers, the API they read, and the datastore they write are the control plane you now operate.`,
        explain: 'Reading the table top to bottom, the first row is a tie: both a single host and a cluster restart a process that crashes, and for that failure mode Compose is not missing anything. Every row below it is a capability that requires coordinating more than one machine, which a single host cannot do by definition. When the host itself fails, Compose has nowhere to move the work; a cluster reschedules it onto surviving nodes. A version rollout on one host is a blunt recreate; on a cluster it is a controlled sequence gated on health with automatic reversal. Load balancing across replicas on multiple nodes needs a stable address that tracks a changing set of backends, which is what a Service provides and what a reverse proxy on one host only approximates for that host. Scaling with load is manual on one host and driven by a metric on a cluster. And running many services for many teams safely needs partitioning and access control that a single shared configuration file does not offer. The pattern across all of it is that the orchestrator replaces a human action or a manual configuration step with a controller that performs it continuously — which is the value, and also why the control plane those controllers run in is the thing you take on when you adopt one.',
        explainHi: 'Table ko upar se neeche padhte hue, pehla row ek tie hai: ek single host aur ek cluster dono ek crash hone wale process ko restart karte hain, aur us failure mode ke liye Compose kuch miss nahi kar raha. Iske neeche har row ek capability hai jise ek se zyada machine coordinate karne ki zaroorat hai. Jab host khud fail hota hai, Compose ke paas kaam move karne ke liye kahin nahi; ek cluster ise surviving nodes par reschedule karta hai. Ek host par ek version rollout ek blunt recreate hai; ek cluster par ye ek controlled sequence hai jo health par gated hai automatic reversal ke saath. Sab ke across pattern ye hai ki orchestrator ek human action ya ek manual configuration step ko ek controller se replace karta hai jo ise continuously perform karta hai.',
      },
      {
        title: 'One reconciliation loop, many controllers',
        titleHi: 'Ek reconciliation loop, kai controllers',
        code: `# the shape every Kubernetes feature shares:
#
#   loop forever:
#     desired = read desired state from the API   (what YOU declared)
#     actual  = observe the real world
#     if actual != desired:
#         take ONE step to close the gap
#
# and the controllers that run it, each on a different object:

DEPLOYMENT CONTROLLER   desired: "9 Pods of nginx:1.27, spread over the ReplicaSets I manage"
                        step:    create/delete Pods; during a rollout, shift Pods from
                                 the old ReplicaSet to the new one, a few at a time

NODE CONTROLLER         desired: "every node is responsive"
                        step:    a node stopped heartbeating 40s ago -> mark its Pods for
                                 eviction so other controllers reschedule them

HPA CONTROLLER          desired: "average CPU across the Pods == 60%"
                        step:    CPU is at 85% -> raise the Deployment's replica count

JOB CONTROLLER          desired: "this batch task completes successfully once"
                        step:    no Pod running and not yet succeeded -> create a Pod;
                                 Pod failed -> create another (up to backoffLimit)

PV CONTROLLER           desired: "every PersistentVolumeClaim is bound to a volume"
                        step:    an unbound claim exists -> provision a volume and bind it`,
        output: `Kubernetes is not one program with special cases for self-healing, rollouts, and scaling. It is a set of small controllers, each watching one kind of object, each running the identical loop - read desired, observe actual, take one step to close the gap - forever. "Self-healing" is the node and ReplicaSet controllers doing their normal job when a node disappears. Learning Kubernetes is largely learning which controller owns which object and what its desired-vs-actual comparison is.`,
        explain: 'The reconciliation loop is a single pattern, and the whole system is built by running that pattern many times over different objects. Each controller has a narrow responsibility defined entirely by what its desired state is and what one step toward it looks like. The Deployment controller\'s desired state is a count and a template of Pods, spread across the ReplicaSets it owns; its step is to create or remove Pods and, during an update, to move desired count from the old ReplicaSet to the new one gradually. The node controller\'s desired state is simply that nodes respond; its step, when one goes silent, is to mark its Pods so that other controllers treat them as needing replacement. The autoscaler\'s desired state is a target value for a metric; its step is to change a replica count. None of these controllers knows about the others directly - they coordinate only through the shared objects in the datastore, each reacting to changes the others make. This is why the behaviour that looks like intelligent orchestration - a node fails and minutes later the service is healthy again elsewhere - is really several independent loops each taking their next small step, and why understanding Kubernetes means learning the objects and which loop watches each one.',
        explainHi: 'Reconciliation loop ek single pattern hai, aur poora system us pattern ko kai baar alag objects par chalakar banaya gaya hai. Har controller ki ek narrow responsibility hai jo poori tarah is se defined hai ki iska desired state kya hai aur iski taraf ek step kaisa dikhta hai. Deployment controller ka desired state Pods ka ek count aur ek template hai; iska step Pods create ya remove karna hai aur, ek update ke dauran, desired count ko purane ReplicaSet se naye par gradually move karna hai. Node controller ka desired state simply ye hai ki nodes respond karte hain. Inmein se koi bhi controller doosron ke baare mein directly nahi jaanta - wo sirf datastore mein shared objects ke through coordinate karte hain. Isliye jo behaviour intelligent orchestration jaisa dikhta hai wo really kai independent loops hain jo apna agla chhota step le rahe hain.',
      },
    ],

    mistakes: [
      {
        wrong: `# adopting Kubernetes to solve "the host might reboot" or "we might scale"
# before: 1 VM, compose.yaml, 2 engineers, 4 services, a 90-second reboot blip
//         once a quarter that nobody actually minds.
# after:  a managed control plane bill, an ingress controller, cert-manager,
//         Helm charts, a CNI, RBAC, PodSecurity, node pools, cluster upgrades
//         every 4 months, a staging cluster, and one engineer who now owns all
//         of it and is on-call for it. deploys got SLOWER. the reboot blip is
//         "solved" and nothing else improved.`,
        right: `# match the tool to the concrete need:
#   reboot downtime unacceptable   -> 2 app replicas + proxy LB on ONE host,
//                                     or Docker Swarm (~1 day to learn, multi-host,
//                                     rolling deploys, a real per-service LB VIP)
#   MUST survive node failure with no human, across a real fleet  -> managed K8s
//                                     (EKS/GKE/AKS) or a PaaS (Cloud Run / Fly) —
//                                     and budget for the operational cost
#   "might need to scale someday"   -> NOT a current problem. revisit when it is.
# a boring single host + backups + IaC is a valid answer for years.`,
        why: 'Kubernetes provides automatic rescheduling on node failure, scheduling across a fleet, health-gated rollouts with rollback, cross-node load balancing, autoscaling, and multi-team isolation, and it delivers those by introducing a control plane, a cluster network, an ingress layer, a certificate manager, a packaging tool, an access-control model, and a version-upgrade treadmill, every one of which must be operated and kept current. Taking all of that on to run a small number of services that a single host was handling adequately trades a small, well-understood operational surface for a much larger one, concentrates the knowledge in whoever built it, tends to make deployments slower rather than faster, and puts an engineer on call for a stack of components that exist only to solve problems the deployment did not have. The disciplined path is to name the specific capability that is actually missing and choose the smallest thing that supplies it: additional replicas behind the existing proxy to remove reboot downtime, Docker Swarm or a small managed platform to survive a host failure, and a full orchestrator only when several of these needs are simultaneously real. Anticipated future scale is not a present need.',
        whyHi: 'Kubernetes node failure par automatic rescheduling, ek fleet ke across scheduling, rollback ke saath health-gated rollouts, cross-node load balancing, autoscaling, aur multi-team isolation provide karta hai, aur ye unhe ek control plane, ek cluster network, ek ingress layer, ek certificate manager, ek packaging tool, ek access-control model, aur ek version-upgrade treadmill introduce karke deliver karta hai. Un sab ko lena ek chhoti sankhya ki services chalane ke liye jinhe ek single host adequately handle kar raha tha ek chhote, well-understood operational surface ko ek bahut bade ke liye trade karta hai. Disciplined path wo specific capability name karna hai jo actually missing hai aur sabse chhoti cheez choose karna jo ise supply karti hai.',
      },
      {
        wrong: `# thinking Kubernetes "runs your containers for you" like a smarter Docker
# expectation: kubectl apply, and k8s figures everything out
# reality: YOU still write the readiness probe (or a bad rollout ships broken
//   Pods), YOU set resource requests (or the scheduler bin-packs blindly and
//   nodes thrash), YOU configure the Ingress + TLS, YOU pick a CNI, YOU set
//   PodDisruptionBudgets (or a node drain takes your service down), YOU write
//   NetworkPolicy (or it's a flat network). k8s automates the LOOP, not the DESIGN.`,
        right: `# Kubernetes gives you a reconciliation engine + a set of objects. the
# operational correctness is still your job:
#   - readiness/liveness probes that actually reflect readiness (Module 8)
#   - resource requests from real measurements + limits (Module 8)
#   - PodDisruptionBudgets so voluntary disruptions don't over-evict (Module 9)
#   - Ingress + cert-manager for TLS (Module 8)
#   - NetworkPolicy default-deny (Module 9)
# k8s reconciles whatever you declare toward whatever you declared — including
# a broken desired state. it is a powerful engine, not a substitute for design.`,
        why: 'Kubernetes automates the process of continuously driving the cluster toward a declared desired state, but it does not decide what that desired state should be or whether it is correct. The platform will faithfully reconcile toward a Deployment with no readiness probe, which means a rollout will replace healthy Pods with new ones that are not actually ready and route traffic to them. It will schedule Pods that declare no resource requests, which means the scheduler cannot reason about capacity and nodes become overcommitted and unstable. It will run with a flat network unless network policies are written, expose nothing unless an Ingress and certificates are configured, and evict more Pods than a service can afford to lose during a node drain unless a disruption budget says otherwise. Every one of those is a design decision the operator must make and express in the manifests. The value Kubernetes adds is the reconciliation engine and a consistent object model; the operational correctness of what runs on it — the probes, the resource declarations, the disruption budgets, the network and ingress configuration — remains the responsibility of whoever writes the manifests, and Modules 8 and 9 are largely about getting those right.',
        whyHi: 'Kubernetes cluster ko ek declared desired state ki taraf continuously drive karne ke process ko automate karta hai, par ye decide nahi karta ki wo desired state kya hona chahiye ya ye correct hai ya nahi. Platform faithfully ek Deployment ki taraf reconcile karega jiska koi readiness probe nahi, jiska matlab ek rollout healthy Pods ko naye se replace karega jo actually ready nahi hain. Ye Pods schedule karega jo koi resource requests declare nahi karte, jiska matlab scheduler capacity ke baare mein reason nahi kar sakta. Unmein se har ek ek design decision hai jo operator ko lena chahiye aur manifests mein express karna chahiye. Kubernetes jo value add karta hai wo reconciliation engine aur ek consistent object model hai; uspar jo chalta hai uski operational correctness manifests likhne wale ki responsibility rehti hai.',
      },
    ],

    realWorld: [
      {
        en: '**A 4-person team on EKS for 18 months to run 5 services** — spent roughly one engineer-week per month on cluster upkeep (upgrades, cert-manager, a CNI CVE, a stuck finalizer). Moved to Cloud Run; the same 5 services now take near-zero ops and deploy faster.',
        hi: '**Ek 4-person team 18 mahine EKS par 5 services chalane ke liye** — roughly ek engineer-week per month cluster upkeep par kharch kiya. Cloud Run par move kiya.',
      },
      {
        en: '**A company that DID need Kubernetes** — 300 microservices, 40 teams, thousands of deploys a week, hard multi-tenant isolation, autoscaling from 50 to 500 nodes daily. Compose or a PaaS genuinely could not do this; the control-plane cost is a rounding error at that scale.',
        hi: '**Ek company jise Kubernetes CHAHIYE tha** — 300 microservices, 40 teams, ek week mein hazaaron deploys. Compose ya ek PaaS genuinely ye nahi kar sakte the.',
      },
      {
        en: '**A "self-healing" incident that self-healed** — a spot node was reclaimed mid-afternoon; within 90 seconds the ReplicaSet controller had replacement Pods scheduled on other nodes and the Service was routing to them. No page, no human. This is the capability you pay the control-plane tax for.',
        hi: '**Ek "self-healing" incident jo self-heal hua** — ek spot node mid-afternoon reclaim hua; 90 seconds mein replacement Pods doosre nodes par scheduled the.',
      },
    ],

    interviewQA: [
      {
        q: 'What does an orchestrator like Kubernetes do that a single host running Compose cannot?',
        qHi: 'Kubernetes jaisa ek orchestrator kya karta hai jo Compose chalane wala ek single host nahi kar sakta?',
        a: 'A single host restarts a crashed container and runs a fixed number of replicas, and for many services that is sufficient. What it cannot do are the things that require coordinating multiple machines. First, self-healing across nodes: when the host itself fails, everything on it is down until a person acts, whereas an orchestrator reschedules that host\'s workloads onto healthy nodes automatically. Second, scheduling: an orchestrator has a scheduler that places each workload on a node in the fleet that has room for its declared CPU and memory needs, packing many workloads across many machines. Third, declarative rollouts: changing the desired version triggers a controlled update, a few replicas at a time, each gated on a readiness check, with automatic rollback if the new replicas fail. Fourth, service discovery and load balancing across nodes: every service gets a stable virtual address that load-balances across its current healthy instances wherever they run. Fifth, horizontal autoscaling driven by a metric rather than a number set by hand. Sixth, configuration, secrets, and persistent storage modelled as cluster resources decoupled from any node. And seventh, multi-tenancy through namespaces, access control, quotas, and network policy. Underneath all of it is one mechanism: a reconciliation loop where controllers continuously compare actual state to a declared desired state and take one corrective step at a time.',
        aHi: 'Ek single host ek crashed container ko restart karta hai aur ek fixed number ke replicas chalata hai, aur bahut si services ke liye wo sufficient hai. Jo ye nahi kar sakta wo wo cheezein hain jinhe multiple machines coordinate karne ki zaroorat hai. Pehla, nodes ke across self-healing: jab host khud fail hota hai, uspar sab kuch down hai jab tak ek person act nahi karta, jabki ek orchestrator us host ke workloads ko healthy nodes par automatically reschedule karta hai. Doosra, scheduling: ek orchestrator ke paas ek scheduler hai. Teesra, declarative rollouts. Chautha, service discovery aur load balancing nodes ke across. Paanchva, horizontal autoscaling. Chhatha, configuration, secrets, aur persistent storage as cluster resources. Aur saatva, multi-tenancy. In sab ke neeche ek mechanism hai: ek reconciliation loop.',
      },
      {
        q: 'When should a team NOT adopt Kubernetes, and what is the failure mode of adopting it too early?',
        qHi: 'Ek team ko Kubernetes kab NAHI adopt karna chahiye, aur ise bahut jaldi adopt karne ka failure mode kya hai?',
        a: 'A team should not adopt Kubernetes when it does not have a concrete present need for what Kubernetes provides. If one host has enough capacity, a brief planned reboot is acceptable, one or two people operate a workload whose load is predictable, and there is no requirement to survive a host failure with no human in the loop or to isolate many teams, then a single host with backups and infrastructure as code, or a platform-as-a-service, is substantially less to operate. The failure mode of adopting it early is that Kubernetes brings a control plane, a cluster network plugin, an ingress layer, a certificate manager, a packaging tool, an access-control model, and an upgrade cadence of roughly every four months with periodic API removals, and all of that has to be operated and kept current regardless of how few services run on it. A small team ends up spending a meaningful fraction of its time on cluster upkeep, deployments often get slower because there is more machinery in the path, the knowledge concentrates in whoever set it up, and an engineer is on call for components that exist only to solve problems the deployment did not have. Anticipated future scale is not a present need; the disciplined approach is to identify the specific missing capability and choose the smallest thing that provides it, revisiting the decision when the situation actually changes.',
        aHi: 'Ek team ko Kubernetes tab nahi adopt karna chahiye jab iske paas Kubernetes jo provide karta hai uske liye ek concrete present need nahi hai. Agar ek host ke paas kaafi capacity hai, ek brief planned reboot acceptable hai, ek ya do log ek predictable load waala workload operate karte hain, aur ek host failure ko bina human ke survive karne ya kai teams isolate karne ki koi requirement nahi hai, to ek single host backups aur infrastructure as code ke saath, ya ek platform-as-a-service, substantially kam operate karne ka hai. Ise jaldi adopt karne ka failure mode ye hai ki Kubernetes ek control plane, ek CNI, ek ingress layer, ek certificate manager, ek packaging tool, ek access-control model, aur ~4 months ki ek upgrade cadence laata hai. Ek chhoti team apne time ka ek meaningful fraction cluster upkeep par kharch karti hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list the 5 capabilities an orchestrator has that a single Compose host cannot, and for each, name the concrete scenario where it matters.',
        taskHi: 'Ek comment mein, 5 capabilities list karo jo ek orchestrator ke paas hain jo ek single Compose host nahi kar sakta.',
        hint: '(1) SELF-HEALING ACROSS NODES — the host dies (kernel panic / disk / VM terminated) → an orchestrator reschedules its Pods onto healthy nodes automatically; Compose: everything on that host is down until a human acts. (2) BIN-PACKING / SCHEDULING — you have 40 services and 8 machines → the scheduler places each Pod on a node with room for its declared CPU/mem; Compose: one host, it fits or it doesn\'t. (3) DECLARATIVE ROLLOUTS — deploy v1→v2 → N replicas at a time, each gated on a readiness probe, auto-rollback on failure; Compose: recreate = coarse + manual. (4) SERVICE DISCOVERY + CROSS-NODE LB — 3 replicas of an HTTP service on 3 nodes → a Service is 1 stable VIP that load-balances across all healthy Pods anywhere; Compose: you hand-configure the reverse proxy as an upstream pool. (5) HORIZONTAL AUTOSCALING — load doubles at 9am → an HPA adds replicas from a CPU/latency target; Compose: `--scale` is a number you SSH in and change.',
        hintHi: '(1) NODES KE ACROSS SELF-HEALING — host marta hai → orchestrator iske Pods healthy nodes par automatically reschedule karta hai. (2) BIN-PACKING / SCHEDULING — 40 services, 8 machines → scheduler har Pod ko ek node par place karta hai jiske paas room hai. (3) DECLARATIVE ROLLOUTS — v1→v2 → ek baar mein N replicas, har ek readiness probe par gated, failure par auto-rollback. (4) SERVICE DISCOVERY + CROSS-NODE LB — ek Service ek stable VIP hai jo saare healthy Pods ke across load-balance karta hai. (5) HORIZONTAL AUTOSCALING — load double hota hai → ek HPA CPU/latency target se replicas add karta hai.',
      },
      {
        task: 'In a comment, describe the reconciliation loop in 4 lines, then explain how "self-healing", "a rolling deploy", and "autoscaling" are each just that loop on a different object.',
        taskHi: 'Ek comment mein, reconciliation loop ko 4 lines mein describe karo.',
        hint: 'Loop: (1) read DESIRED state from the API (what you declared); (2) OBSERVE actual state of the world; (3) if actual ≠ desired, take ONE step to close the gap; (4) repeat forever. SELF-HEALING = the ReplicaSet controller\'s desired is "N Pods matching this template"; a Pod vanishes (node died) → actual is N-1 → it creates one. A ROLLING DEPLOY = the Deployment controller\'s desired shifts from "N Pods of v1" to "N Pods of v2"; each step it moves a few Pods from the old ReplicaSet to the new, waiting for readiness. AUTOSCALING = the HPA controller\'s desired is "avg CPU == 60%"; observed CPU is 85% → it raises the Deployment\'s replica count, which the ReplicaSet controller then reconciles. Same loop, different objects and different desired-vs-actual comparison.',
        hintHi: 'Loop: (1) API se DESIRED state padho; (2) actual state OBSERVE karo; (3) agar actual ≠ desired, gap band karne ke liye EK step lo; (4) forever repeat. SELF-HEALING = ReplicaSet controller ka desired "N Pods" hai; ek Pod vanish hota hai → actual N-1 → ye ek banata hai. ROLLING DEPLOY = Deployment controller ka desired "N Pods of v1" se "N Pods of v2" shift hota hai. AUTOSCALING = HPA controller ka desired "avg CPU == 60%" hai. Same loop, alag objects.',
      },
      {
        task: 'In a comment, list four concrete costs of running Kubernetes, and write the one-sentence test for whether a team should adopt it.',
        taskHi: 'Ek comment mein, Kubernetes chalane ki chaar concrete costs list karo.',
        hint: 'Costs: (1) a CONTROL PLANE to operate (or ~$70/mo to a cloud for a managed one, before nodes); (2) a LOT of YAML — a typical app is a Deployment + Service + Ingress + ConfigMap(s) + Secret(s) + more; (3) NEW FAILURE MODES — scheduling ("why is this Pod Pending"), the CNI, cluster DNS, admission webhooks, etcd — debugging shifts from "read the app log"; (4) an UPGRADE CADENCE — a release every ~4 months, ~1 year of support, periodic API removals that force manifest changes; (plus: you now operate a distributed system to run your distributed system). THE TEST: adopt Kubernetes only when you have a concrete PRESENT need for automatic node-failure survival / fleet scheduling / safe automated rollouts / cross-node LB / autoscaling / multi-team self-service — not to pre-empt scale you don\'t have yet.',
        hintHi: 'Costs: (1) ek CONTROL PLANE operate karne ke liye (ya ~$70/mo ek cloud ko); (2) BAHUT sara YAML; (3) NAYE FAILURE MODES — scheduling, CNI, cluster DNS, admission webhooks, etcd; (4) ek UPGRADE CADENCE — har ~4 months, periodic API removals. THE TEST: Kubernetes tabhi adopt karo jab aapke paas automatic node-failure survival / fleet scheduling / safe automated rollouts / cross-node LB / autoscaling / multi-team self-service ke liye ek concrete PRESENT need hai — wo scale pre-empt karne ke liye nahi jo aapke paas abhi nahi hai.',
      },
    ],

    keyTakeaways: [
      'A single Compose host ALREADY does: restart a crashed container (`restart: unless-stopped`), a fixed replica count, service-name DNS on that box, health-gated startup, resource limits, a deploy that recreates only what changed. For a LARGE fraction of real (incl. revenue) services that is genuinely enough and far less to operate than a cluster.',
      'ORCHESTRATION (Kubernetes / Nomad / ECS / Swarm) adds ONLY what needs coordinating MANY hosts: (1) SELF-HEALING ACROSS NODES — a node dies → its Pods are rescheduled onto healthy nodes automatically, no human (one host: everything on it is just DOWN); (2) BIN-PACKING / SCHEDULING — declare each workload\'s CPU/mem, the scheduler places it on a node with room across a fleet of 3/30/300; (3) DECLARATIVE ROLLOUTS — N replicas at a time, each gated on readiness, auto-rollback on failure; (4) SERVICE DISCOVERY + CROSS-NODE LB — every Service = a STABLE virtual IP + DNS name load-balancing across its current healthy Pods anywhere; (5) HORIZONTAL AUTOSCALING — replicas from a metric, not a hand-set number; (6) CONFIG / SECRET / STORAGE as first-class API objects decoupled from any node; (7) MULTI-TENANCY — namespaces + RBAC + quotas + NetworkPolicy.',
      'THE ONE IDEA under ALL of it: the RECONCILIATION LOOP. You POST a DESIRED state to the API → stored in etcd → a CONTROLLER (a small program owning ONE kind of object) continuously compares ACTUAL to DESIRED and takes ONE step to close the gap → forever. Self-healing = the ReplicaSet/node controllers doing their normal job when a node vanishes. A rolling deploy = the Deployment controller shifting desired count from the old ReplicaSet to the new, a few at a time. Autoscaling = the HPA controller changing a replica count from a metric. Learning Kubernetes ≈ learning which controller owns which object and what its desired-vs-actual comparison is.',
      'KUBERNETES AUTOMATES THE LOOP, NOT THE DESIGN. It faithfully reconciles toward whatever you declare — including a BROKEN desired state: no readiness probe → a rollout ships not-ready Pods and routes to them; no resource requests → the scheduler bin-packs blindly and nodes thrash; no NetworkPolicy → a flat network; no PodDisruptionBudget → a node drain over-evicts your service. The probes, resource declarations, disruption budgets, Ingress+TLS, and network policy are all YOUR job (Modules 8-9).',
      'THE COST is real: a control plane to run (or ~$70/mo managed + nodes); a LOT of YAML per app; new failure modes (scheduling / CNI / cluster DNS / admission webhooks / etcd); a ~4-month upgrade cadence with API removals; you now operate a distributed system to run your distributed system. ADOPT IT when its problems are YOUR problems — a concrete PRESENT need for automatic node-failure survival / fleet scheduling / safe automated rollouts / cross-node LB / autoscaling / many-team self-service. NOT to pre-empt scale you don\'t have. The middle ground (Swarm / Nomad / a PaaS like Cloud Run / Fly) is often right and often skipped. The concepts — desired state, reconciliation, scheduling, services, rollouts — transfer across all orchestrators.',
    ],
    keyTakeawaysHi: [
      'Ek single Compose host ALREADY karta hai: ek crashed container restart, ek fixed replica count, us box par service-name DNS, health-gated startup, resource limits, ek deploy jo sirf jo badla wo recreate karta hai. Real services ke ek BADE fraction ke liye wo genuinely kaafi hai aur ek cluster se bahut kam operate karne ka hai.',
      'ORCHESTRATION (Kubernetes / Nomad / ECS / Swarm) SIRF wo add karta hai jise KAI hosts coordinate karne ki zaroorat hai: (1) NODES KE ACROSS SELF-HEALING; (2) BIN-PACKING / SCHEDULING; (3) DECLARATIVE ROLLOUTS — ek baar mein N replicas, har ek readiness par gated, auto-rollback; (4) SERVICE DISCOVERY + CROSS-NODE LB — har Service = ek STABLE virtual IP + DNS naam; (5) HORIZONTAL AUTOSCALING; (6) CONFIG / SECRET / STORAGE as first-class API objects; (7) MULTI-TENANCY.',
      'IN SAB KE NEECHE EK IDEA: RECONCILIATION LOOP. Aap API ko ek DESIRED state POST karte ho → etcd mein stored → ek CONTROLLER (ek small program jo ONE kind ke object ko own karta hai) continuously ACTUAL ko DESIRED se compare karta hai aur gap band karne ke liye EK step leta hai → forever. Kubernetes seekhna ≈ seekhna ki kaunsa controller kaunse object ko own karta hai.',
      'KUBERNETES LOOP AUTOMATE KARTA HAI, DESIGN NAHI. Ye faithfully aapke declared kisi bhi cheez ki taraf reconcile karta hai — ek BROKEN desired state include: koi readiness probe nahi → ek rollout not-ready Pods ship karta hai; koi resource requests nahi → scheduler blindly bin-pack karta hai. Probes, resource declarations, disruption budgets, Ingress+TLS, aur network policy sab AAPKA kaam hai.',
      'COST real hai: ek control plane chalane ke liye (ya ~$70/mo managed + nodes); per app BAHUT sara YAML; naye failure modes; ek ~4-month upgrade cadence. ISE ADOPT karo jab iske problems AAPKE problems hain — automatic node-failure survival / fleet scheduling / safe automated rollouts / cross-node LB / autoscaling / many-team self-service ke liye ek concrete PRESENT need. Middle ground (Swarm / Nomad / ek PaaS) aksar sahi hai.',
    ],
  },

  {
    slug: 'ops-the-control-plane-and-the-node',
    title: 'The Control Plane & the Node',
    titleHi: 'Control Plane Aur Node',
    description: 'A Kubernetes cluster is a control plane — the API server, the datastore, the scheduler, and the controllers — plus a set of worker nodes, each running a kubelet that starts containers and a network proxy that implements Services. Every component talks only through the API server, and every component is replaceable.',
    descriptionHi: 'Ek Kubernetes cluster ek control plane hai — API server, datastore, scheduler, aur controllers — plus worker nodes ka ek set, har ek ek kubelet chalata hai jo containers start karta hai aur ek network proxy jo Services implement karta hai. Har component sirf API server ke through baat karta hai, aur har component replaceable hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**An airline\'s operations centre and its ground crews.** The operations centre is the control plane: a single flight-plan database that is the only source of truth (etcd), a front desk that is the only way to read or change any plan (the API server), a dispatcher who assigns each aircraft to a gate with room (the scheduler), and a room full of specialists each watching one thing — crew rest, fuel, maintenance — and filing changes when reality drifts from the plan (the controllers). Out at each airport, a ground crew (the kubelet on a node) reads the plans for its airport off the front desk and physically makes them happen — pushing back aircraft, loading bags — and reports back what actually occurred. The specialists never talk to the ground crews directly; everything goes through the front desk and the shared database.',
      hi: '**Ek airline ka operations centre aur iski ground crews.** Operations centre control plane hai: ek single flight-plan database jo ekmatra source of truth hai (etcd), ek front desk jo kisi bhi plan ko read ya change karne ka ekmatra tarika hai (API server), ek dispatcher jo har aircraft ko ek gate assign karta hai jiske paas room hai (scheduler), aur specialists se bhara ek room har ek ek cheez dekh raha — crew rest, fuel, maintenance — aur changes file kar raha jab reality plan se drift karti hai (controllers). Har airport par, ek ground crew (ek node par kubelet) apne airport ke plans front desk se read karta hai aur unhe physically hone deta hai. Specialists kabhi ground crews se directly baat nahi karte; sab kuch front desk aur shared database ke through jaata hai.',
    },

    simple: `**A CLUSTER = CONTROL PLANE (the brain) + WORKER NODES (the muscle).**
On managed K8s (EKS/GKE/AKS) the cloud runs the control plane; you manage nodes.

**CONTROL-PLANE COMPONENTS (usually on dedicated "control-plane" nodes):**
\`\`\`
kube-apiserver     the ONLY door. every read/write goes through it. REST + watch.
                   authn -> authz (RBAC) -> admission (validate/mutate/webhooks) -> etcd.
                   the only component that talks to etcd.
etcd               the datastore. a consistent, watchable key-value store (Raft).
                   holds the ENTIRE cluster state. lose it unrecoverably = lose the cluster.
                   -> BACK IT UP (snapshots). run 3 or 5 for quorum.
kube-scheduler     watches for Pods with no node assigned. picks a node:
                   filter (does it fit? taints? affinity? ports?) -> score (spread? least
                   loaded?) -> bind the Pod to the winning node. it only DECIDES; the
                   kubelet acts.
kube-controller-   ONE process running ~30 controllers: Deployment, ReplicaSet, Node,
manager            Job, EndpointSlice, ServiceAccount, PV, ... each a reconcile loop.
cloud-controller-  cloud-specific bits: provision a LoadBalancer, attach a disk, label
manager            nodes with zone/instance-type, delete Node objects for deleted VMs.
\`\`\`

**WORKER-NODE COMPONENTS (on EVERY node, control-plane nodes included):**
\`\`\`
kubelet            the node agent. watches the apiserver for Pods bound to THIS node;
                   tells the container runtime to pull images + start containers; runs
                   liveness/readiness/startup probes; reports Pod + node status back.
                   NOT a container itself — a host process/systemd unit.
container runtime  containerd (or CRI-O) via the CRI. actually runs the containers
                   (using runc / a sandbox). Docker Engine is no longer used directly.
kube-proxy         programs the node's iptables/IPVS (or an eBPF CNI replaces it) so that
                   a packet to a Service's ClusterIP is DNAT'd to one of its Pod IPs.
CNI plugin         (Calico / Cilium / flannel / the cloud's) gives every Pod a routable
                   IP and wires pod-to-pod traffic across nodes. NetworkPolicy enforcement.
\`\`\`

**THE GOLDEN RULE: everything goes through the API server.**
\`\`\`
kubectl -> apiserver.   scheduler -> apiserver (watch Pods, write bindings).
controllers -> apiserver (watch objects, write objects).   kubelet -> apiserver
(watch its Pods, write status).   NOTHING talks to anything else directly.
\`\`\`
This is why the API is the extension point (CRDs + custom controllers = "operators"),
why \`kubectl auth can-i\` and the audit log see every action, and why a component can
crash and restart without the others noticing.

**NODE LIFECYCLE:** kubelet registers a Node object -> posts heartbeats (Lease) ->
if heartbeats stop ~40s, the node-controller marks it NotReady -> after a grace period
its Pods are marked for eviction -> other controllers reschedule them elsewhere.

**WHAT RUNS WHERE:** \`kubectl get pods -n kube-system\` shows the cluster's own components
running AS Pods (apiserver, etcd, scheduler, controller-manager as static Pods; CoreDNS,
kube-proxy, the CNI as DaemonSets/Deployments). Kubernetes runs itself on Kubernetes.`,

    simpleHi: `**EK CLUSTER = CONTROL PLANE (dimaag) + WORKER NODES (muscle).**
Managed K8s (EKS/GKE/AKS) par cloud control plane chalata hai; aap nodes manage karte ho.

**CONTROL-PLANE COMPONENTS:**
\`\`\`
kube-apiserver     EKMATRA door. har read/write iske through. authn -> authz (RBAC) ->
                   admission -> etcd. etcd se baat karne wala ekmatra component.
etcd               datastore. ek consistent, watchable key-value store (Raft). POORA
                   cluster state rakhta hai. ise unrecoverably lose karo = cluster lose.
                   -> BACK IT UP. quorum ke liye 3 ya 5 chalao.
kube-scheduler     bina node assigned Pods ke liye watch karta hai: filter (fit hota hai?
                   taints? affinity?) -> score -> Pod ko winning node se bind karo.
                   ye sirf DECIDE karta hai; kubelet act karta hai.
kube-controller-   ONE process ~30 controllers chala raha: Deployment, ReplicaSet, Node,
manager            Job, EndpointSlice, ... har ek ek reconcile loop.
cloud-controller-  cloud-specific: ek LoadBalancer provision karo, ek disk attach karo.
manager
\`\`\`

**WORKER-NODE COMPONENTS (HAR node par):**
\`\`\`
kubelet            node agent. apiserver ko IS node se bound Pods ke liye watch karta hai;
                   container runtime ko images pull + containers start karne ko kehta hai;
                   probes chalata hai; Pod + node status wapas report karta hai.
container runtime  containerd (ya CRI-O) CRI ke through. actually containers chalata hai.
kube-proxy         node ke iptables/IPVS program karta hai taaki ek Service ke ClusterIP
                   ka ek packet iske ek Pod IP par DNAT ho.
CNI plugin         (Calico / Cilium / flannel) har Pod ko ek routable IP deta hai aur
                   pod-to-pod traffic nodes ke across wire karta hai.
\`\`\`

**GOLDEN RULE: sab kuch API server ke through jaata hai.** kubectl, scheduler, controllers,
kubelet — sab apiserver ko watch karte hain aur apiserver ko likhte hain. KUCH bhi kisi
doosri cheez se directly baat nahi karta.

**NODE LIFECYCLE:** kubelet ek Node object register karta hai -> heartbeats post karta hai ->
agar heartbeats ~40s rukte hain, node-controller ise NotReady mark karta hai -> ek grace
period ke baad iske Pods eviction ke liye marked -> doosre controllers unhe reschedule karte hain.`,

    content: `## The two halves

A Kubernetes cluster has a **control plane** — the components that hold the desired state and drive the cluster toward it — and a set of **worker nodes** — the machines that actually run your Pods. On a managed offering (Amazon EKS, Google GKE, Azure AKS) the cloud provider operates the control plane and you only manage nodes; on a self-managed cluster you run both, typically with the control-plane components on dedicated nodes.

## Control-plane components

### kube-apiserver

The **only** way to read or change anything in the cluster. It is a REST API over the cluster's objects, plus a **watch** mechanism that streams changes to clients. Every request goes through a pipeline: **authentication** (who are you — a client certificate, a token, an OIDC identity), **authorization** (are you allowed — RBAC checks your roles), **admission control** (should this specific object be allowed, possibly mutated — resource-quota checks, defaulting, and custom validating/mutating webhooks), and finally **persistence** to etcd. The API server is the only component that talks to etcd; everything else talks to the API server. It is stateless and horizontally scalable — you run several behind a load balancer.

### etcd

The **datastore**. A distributed key-value store that is strongly consistent (it uses the Raft consensus algorithm) and supports watches. It holds the **entire state of the cluster** — every object, every field. Losing etcd irrecoverably means losing the cluster: the workloads keep running for a while, but nothing can be changed and the control plane cannot rebuild its view. This is why etcd must be **backed up** with regular snapshots, and why it is run as a cluster of 3 or 5 members so a minority can fail without losing quorum.

### kube-scheduler

Watches for Pods that have been created but not yet assigned to a node (\`spec.nodeName\` is empty). For each, it runs a two-phase decision:

1. **Filtering** — eliminate nodes the Pod cannot run on: not enough allocatable CPU or memory, a taint the Pod does not tolerate, node affinity rules that do not match, a host port already in use, a volume that cannot be attached there.
2. **Scoring** — rank the remaining nodes: spread Pods of the same workload across nodes and zones, prefer less-loaded nodes, honour affinity/anti-affinity preferences, keep Pods near their data.

It then **binds** the Pod to the highest-scoring node by writing \`spec.nodeName\`. The scheduler only decides; it never starts a container. If no node passes filtering, the Pod stays **Pending** and the scheduler retries.

### kube-controller-manager

A single process running roughly thirty **controllers**, each a reconciliation loop (Lesson 3) for one kind of object: the Deployment controller, the ReplicaSet controller, the Node controller, the Job controller, the EndpointSlice controller (which keeps the list of a Service's healthy Pod IPs current), the ServiceAccount and token controllers, the PersistentVolume controller, and more. They are bundled into one binary for operational simplicity but are logically independent.

### cloud-controller-manager

The controllers that need to call a cloud provider's API: creating a real load balancer when you create a \`Service\` of type \`LoadBalancer\`, attaching a block device for a \`PersistentVolume\`, labelling nodes with their zone and instance type, and removing a \`Node\` object when the underlying VM is deleted. Separating these out is what lets the same Kubernetes run on any cloud or on bare metal.

## Worker-node components

These run on **every** node, including control-plane nodes.

### kubelet

The **node agent**. It watches the API server for Pods bound to *its* node and makes them real: it tells the container runtime to pull the images and start the containers with the right configuration, mounts volumes, runs the **liveness, readiness, and startup probes** and acts on the results (restart a container that fails liveness, remove a Pod from Service endpoints when it fails readiness), and continuously **reports the status** of its Pods and the node back to the API server. The kubelet is not itself a container — it is a process on the host, usually a systemd unit.

### The container runtime

The kubelet does not run containers directly; it talks to a **container runtime** through the **Container Runtime Interface (CRI)**. In practice this is **containerd** or **CRI-O**, which in turn use a low-level runtime like \`runc\` (or a sandboxed one like gVisor or Kata) to create the actual namespaced, cgrouped process (Module 5). Docker Engine is no longer used directly by Kubernetes; the "dockershim" that bridged them was removed in 1.24.

### kube-proxy

Programs the node's packet-forwarding rules — \`iptables\` or IPVS, or an eBPF datapath if a CNI like Cilium replaces kube-proxy — so that a packet sent to a **Service's virtual IP** is rewritten (destination NAT) to the IP of one of that Service's healthy backend Pods, load-balanced. This is how a stable Service address works even as the set of Pods behind it changes.

### The CNI plugin

The **Container Network Interface** plugin — Calico, Cilium, flannel, or the cloud provider's — gives every Pod its own **routable IP address** and wires up pod-to-pod traffic so that a Pod on one node can reach a Pod on another directly, without NAT. The CNI plugin is also what enforces **NetworkPolicy** (Module 9). Kubernetes does not ship a network implementation; you choose one.

## The golden rule: everything through the API server

No component talks to any other component directly. \`kubectl\` calls the API server. The scheduler watches the API server for unscheduled Pods and writes bindings back to it. Each controller watches the API server for its objects and writes updated objects back. The kubelet watches the API server for its Pods and writes their status back. They coordinate **only** through objects in etcd, mediated by the API server.

This design has large consequences:

- **The API is the extension point.** You can define your own object types (**CustomResourceDefinitions**) and write your own controllers that reconcile them — this pattern is called an **operator**, and it is how databases, message queues, and cert-manager are run on Kubernetes.
- **Every action is observable and controllable.** RBAC (\`kubectl auth can-i\`), the audit log, and admission webhooks all sit in the one request path and see everything.
- **Components are decoupled and replaceable.** Any component can crash and restart, or be swapped for an alternative implementation, without the others needing to know, because they only ever read and write shared state.

## Node lifecycle

When a node joins, its kubelet **registers a \`Node\` object** with the API server and then posts periodic **heartbeats** (a lightweight \`Lease\` object updated every few seconds). If the heartbeats stop for about forty seconds, the **node controller** marks the node \`NotReady\`. After a further grace period (five minutes by default), the node controller marks the node's Pods for deletion, and the ReplicaSet / Deployment / StatefulSet controllers that own those Pods create replacements on other nodes. This is the mechanism behind "self-healing across nodes" from Lesson 1 — it is several controllers each doing their ordinary reconciliation once the node's absence is recorded.

## Kubernetes runs itself on Kubernetes

Run \`kubectl get pods -n kube-system\` and you see the cluster's own components running **as Pods**: the API server, etcd, scheduler, and controller-manager as **static Pods** (defined by manifest files the kubelet reads directly from disk, so they can start before the API server exists), and CoreDNS, kube-proxy, and the CNI agent as regular Deployments and DaemonSets managed through the API like anything else.`,

    contentHi: `## Do halves

Ek Kubernetes cluster ke paas ek **control plane** hai — components jo desired state rakhte hain aur cluster ko iski taraf drive karte hain — aur **worker nodes** ka ek set — machines jo actually aapke Pods chalati hain. Ek managed offering (EKS, GKE, AKS) par cloud provider control plane operate karta hai aur aap sirf nodes manage karte ho.

## Control-plane components

**kube-apiserver** — cluster mein kuch bhi read ya change karne ka **ekmatra** tarika. Har request ek pipeline ke through jaati hai: **authentication** -> **authorization** (RBAC) -> **admission control** (validating/mutating webhooks) -> etcd mein **persistence**. API server ekmatra component hai jo etcd se baat karta hai.

**etcd** — **datastore**. Ek distributed key-value store jo strongly consistent hai (Raft) aur watches support karta hai. Ye cluster ka **poora state** rakhta hai. etcd ko irrecoverably lose karna matlab cluster lose karna. Isliye etcd ko regular snapshots se **backed up** hona chahiye, aur ise 3 ya 5 members ke ek cluster ke roop mein chalaya jaata hai.

**kube-scheduler** — un Pods ke liye watch karta hai jo created hain par abhi ek node ko assigned nahi. Har ek ke liye ek two-phase decision: **Filtering** (un nodes ko eliminate karo jinpar Pod nahi chal sakta) -> **Scoring** (baaki nodes ko rank karo). Phir ye Pod ko highest-scoring node se **bind** karta hai. Scheduler sirf decide karta hai; ye kabhi ek container start nahi karta.

**kube-controller-manager** — ek single process roughly tees **controllers** chala raha, har ek ek reconciliation loop.

**cloud-controller-manager** — wo controllers jinhe ek cloud provider ki API call karne ki zaroorat hai.

## Worker-node components

**kubelet** — **node agent**. Ye API server ko *iske* node se bound Pods ke liye watch karta hai aur unhe real banata hai: container runtime ko images pull aur containers start karne ko kehta hai, **probes** chalata hai, aur continuously apne Pods aur node ka **status report** karta hai wapas API server ko. Kubelet khud ek container nahi hai — ye host par ek process hai, usually ek systemd unit.

**container runtime** — kubelet containers ko directly nahi chalata; ye **CRI** ke through ek **container runtime** se baat karta hai. Practice mein ye **containerd** ya **CRI-O** hai.

**kube-proxy** — node ke packet-forwarding rules program karta hai taaki ek **Service ke virtual IP** ko bheja gaya ek packet us Service ke ek healthy backend Pod ke IP par rewrite ho.

**CNI plugin** — har Pod ko iska apna **routable IP** deta hai aur pod-to-pod traffic wire karta hai. **NetworkPolicy** bhi enforce karta hai.

## Golden rule: sab kuch API server ke through

Koi component kisi doosre component se directly baat nahi karta. Wo **sirf** etcd mein objects ke through coordinate karte hain, API server dwara mediated.

- **API extension point hai.** Aap apne khud ke object types (**CRDs**) define kar sakte ho aur apne khud ke controllers likh sakte ho — is pattern ko ek **operator** kehte hain.
- **Har action observable aur controllable hai.** RBAC, audit log, aur admission webhooks sab ek request path mein baithte hain.
- **Components decoupled aur replaceable hain.**

## Node lifecycle

Jab ek node join karta hai, iska kubelet ek **\`Node\` object register** karta hai aur phir periodic **heartbeats** post karta hai. Agar heartbeats ~40 seconds rukte hain, **node controller** node ko \`NotReady\` mark karta hai. Ek aur grace period ke baad, node controller node ke Pods ko deletion ke liye mark karta hai, aur controllers jo un Pods ko own karte hain doosre nodes par replacements banate hain.

## Kubernetes khud ko Kubernetes par chalata hai

\`kubectl get pods -n kube-system\` chalao aur aap cluster ke apne components ko **Pods ke roop mein** chalte dekhte ho.`,

    examples: [
      {
        title: 'The request path: kubectl -> apiserver -> etcd, and back out via watches',
        titleHi: 'Request path: kubectl -> apiserver -> etcd, aur watches ke through wapas bahar',
        code: `# every actor watches the API server and writes back to it. NOTHING is peer-to-peer.
#
#   you:         kubectl apply -f deploy.yaml
#                    |
#                    v
#   [ kube-apiserver ]  authn -> authz(RBAC) -> admission(webhooks) -> write to etcd
#                    |                                                     |
#           (watch stream)                                          (watch stream)
#           /        |         \\                                          |
#  Deployment   ReplicaSet   scheduler                                 kubelet
#  controller   controller   (sees a Pod                          (sees a Pod bound to
#  (creates a   (creates 3   with no node ->                       MY node -> tells
#   ReplicaSet)  Pod objs)    picks one ->                          containerd to run
#                             writes .nodeName)                     it; reports status)
#
# result flows the SAME way in reverse: kubelet writes Pod status -> apiserver ->
# etcd -> watch -> ReplicaSet controller updates its status -> ... -> 'kubectl get'
# reads the final rolled-up status.

# consequences you can see:
kubectl auth can-i create deployments        # RBAC is in the ONE path -> one check
kubectl get events --sort-by=.lastTimestamp  # controllers narrate their steps here
kubectl get deploy web -o yaml               # .spec = what you want, .status = what IS`,
        output: `Because every component reads and writes the same objects through the one API server and never contacts another component directly:
- a controller, the scheduler, or the kubelet can crash and restart with no coordination - it just resumes watching;
- RBAC, the audit log, and admission webhooks sit in the single request path and therefore see and can gate every change;
- you extend Kubernetes by adding object types (CRDs) and controllers that watch them (operators), using the exact same machinery.`,
        explain: 'The diagram traces one apply through the system. The command sends the object to the API server, which authenticates the caller, checks with RBAC whether they may perform this action, runs it through admission control where quotas are enforced and webhooks may validate or modify it, and writes the result to etcd. From there, every interested component learns about the change through a watch stream rather than by being called: the Deployment controller sees a new Deployment and creates a ReplicaSet, the ReplicaSet controller sees that and creates the Pod objects, the scheduler sees Pods with no node and assigns each one, and the kubelet on the chosen node sees a Pod assigned to it and starts the containers. Status flows back the same way — the kubelet writes what actually happened, and that propagates up through the controllers until a get command reads the final picture. Nothing in this path is a direct component-to-component call; every interaction is a read or a write of a shared object. That is what makes the components independently restartable, makes every action visible to the single set of policy checks in the request path, and makes the API itself the way you extend the system.',
        explainHi: 'Diagram ek apply ko system ke through trace karta hai. Command object ko API server ko bhejta hai, jo caller ko authenticate karta hai, RBAC se check karta hai ki wo ye action perform kar sakte hain ya nahi, ise admission control ke through chalata hai, aur result ko etcd mein likhta hai. Wahan se, har interested component change ke baare mein ek watch stream ke through seekhta hai bajaay call kiye jaane ke: Deployment controller ek naya Deployment dekhta hai aur ek ReplicaSet banata hai, ReplicaSet controller wo dekhta hai aur Pod objects banata hai, scheduler bina node ke Pods dekhta hai aur har ek ko assign karta hai, aur chosen node par kubelet ise assigned ek Pod dekhta hai aur containers start karta hai. Is path mein kuch bhi ek direct component-to-component call nahi hai.',
      },
      {
        title: 'kube-system: the cluster runs its own components as Pods',
        titleHi: 'kube-system: cluster apne components ko Pods ke roop mein chalata hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"

echo "--- the node(s) ---"
kubectl get nodes -o custom-columns=NAME:.metadata.name,STATUS:.status.conditions[-1].type,ROLE:'.metadata.labels.kubernetes\\.io/role',K8S:.status.nodeInfo.kubeletVersion --no-headers | sed 's/  */ /g'

echo "--- the control plane + node agents, running AS Pods in kube-system ---"
for c in kube-apiserver etcd kube-scheduler kube-controller-manager coredns kube-proxy kindnet; do
  n=$(kubectl get pods -n kube-system --no-headers 2>/dev/null | grep -c "^$c")
  [ "$n" -gt 0 ] && echo "$c: $n pod(s)"
done

echo "--- kubelet + the container runtime are NOT pods (they're host processes) ---"
kubectl get pods -n kube-system --no-headers | grep -cE 'kubelet|containerd' | sed 's/^/kubelet\\/containerd pods: /'`,
        output: `--- the node(s) ---
devprep-control-plane Ready <none> v1.31.0
--- the control plane + node agents, running AS Pods in kube-system ---
kube-apiserver: 1 pod(s)
etcd: 1 pod(s)
kube-scheduler: 1 pod(s)
kube-controller-manager: 1 pod(s)
coredns: 2 pod(s)
kube-proxy: 1 pod(s)
kindnet: 1 pod(s)
--- kubelet + the container runtime are NOT pods (they're host processes) ---
kubelet/containerd pods: 0`,
        explain: 'Listing the pods in the kube-system namespace shows the cluster hosting its own machinery. The API server, etcd, the scheduler, and the controller-manager each appear as a pod; on this single-node cluster there is one of each, and on a production cluster there would be several for redundancy. These four are static pods — the kubelet reads their manifests directly from a directory on disk and runs them without involving the API server, which is necessary because the API server is one of them and cannot schedule itself. CoreDNS, which provides in-cluster DNS, and kube-proxy and the network plugin agent, which implement Service routing and pod networking, run as ordinary managed workloads. What does not appear in the list is the kubelet or the container runtime, because those are not containers at all — they are processes running directly on each node\'s host operating system, and they are what starts every pod including the static ones. The practical takeaway is that almost everything in Kubernetes is a normal object you can inspect with the same commands you use for your own workloads, and the small set of things that are not are the bootstrap pieces that have to exist before the object model does.',
        explainHi: 'kube-system namespace mein pods list karna cluster ko apni khud ki machinery host karte dikhata hai. API server, etcd, scheduler, aur controller-manager har ek ek pod ke roop mein appear karte hain; is single-node cluster par har ek ka ek hai. Ye chaar static pods hain — kubelet unke manifests directly disk par ek directory se read karta hai aur unhe API server ko involve kiye bina chalata hai, jo necessary hai kyunki API server unmein se ek hai aur khud ko schedule nahi kar sakta. CoreDNS, aur kube-proxy aur network plugin agent, ordinary managed workloads ke roop mein chalte hain. Jo list mein appear nahi hota wo kubelet ya container runtime hai, kyunki wo containers bilkul nahi hain — wo processes hain jo har node ke host operating system par directly chalti hain.',
      },
    ],

    mistakes: [
      {
        wrong: `# not backing up etcd — "the cluster is the backup"
# the etcd data directory lives on the control-plane node's disk. that disk
# fails, or an upgrade corrupts etcd, or a bad 'kubectl delete' with a wide
# selector wipes a namespace.
# -> the running Pods limp on for a while, but you cannot deploy, scale, or
//    change anything, and there is NO WAY to reconstruct the object graph.
//    on managed K8s the provider backs up etcd; self-managed, it's on you.`,
        right: `# snapshot etcd on a schedule, store the snapshots OFF the control-plane node:
$ ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-$(date +%F).db \\
    --endpoints=https://127.0.0.1:2379 \\
    --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
    --cert=... --key=...
# + copy /backup off-host (S3/GCS). + test a restore into a scratch cluster.
# also back up the manifests (they're in git anyway — GitOps, Module 20) so you
# can re-apply; etcd restore recovers cluster-generated state you can't re-derive.`,
        why: 'etcd holds the complete state of a Kubernetes cluster — every object and every field, including state the cluster generated that is not in your manifests, such as assigned Pod IPs, ServiceAccount tokens, resource UIDs, and the bound status of PersistentVolumeClaims. The data lives on disk on the control-plane node or nodes. If that data is lost — a disk failure, a corrupting upgrade, an accidental deletion with a broad selector — the workloads that are already running continue for a time, but the control plane has no view of what should be running, so nothing can be deployed, scaled, or reconfigured, and there is no mechanism to rebuild the object graph from the running containers. On a managed offering the provider snapshots etcd as part of the service. On a self-managed cluster it is the operator\'s responsibility: take snapshots on a schedule with the etcd client, store them off the control-plane node, and periodically restore one into a throwaway cluster to confirm the procedure works. Keeping the manifests in version control is necessary but not sufficient, because re-applying them does not restore the cluster-generated state that only an etcd restore recovers.',
        whyHi: 'etcd ek Kubernetes cluster ka complete state rakhta hai — har object aur har field, us state include jo cluster ne generate kiya aur jo aapke manifests mein nahi hai, jaise assigned Pod IPs, ServiceAccount tokens, resource UIDs. Data control-plane node ya nodes par disk par rehta hai. Agar wo data lose hota hai, jo workloads already chal rahe hain wo kuch samay continue karte hain, par control plane ke paas koi view nahi hai ki kya chal raha hona chahiye, to kuch deploy, scale, ya reconfigure nahi ho sakta. Ek managed offering par provider etcd snapshot karta hai. Ek self-managed cluster par ye operator ki responsibility hai: ek schedule par snapshots lo, unhe control-plane node se off store karo, aur periodically ek ko ek throwaway cluster mein restore karo.',
      },
      {
        wrong: `# debugging a Pending Pod by restarting the kubelet or the scheduler
# a Pod sits in Pending for 10 minutes. panic-restart kubelet on every node.
# then restart kube-scheduler. still Pending.
# -> the kubelet isn't involved yet (no node assigned = no kubelet to act).
//    and the scheduler already told you why, in the Pod's events:
//      "0/3 nodes are available: 3 Insufficient cpu."
//    the fix is resource requests / cluster capacity, not a restart.`,
        right: `# a Pending Pod means the SCHEDULER couldn't place it. ask it why:
$ kubectl describe pod <name>        # -> Events: the exact filter that failed
#   "Insufficient cpu/memory"        -> lower requests, or add nodes / autoscale
#   "node(s) had untolerated taint"  -> add a toleration, or target other nodes
#   "node(s) didn't match affinity"  -> fix nodeAffinity / topology constraints
#   "pod has unbound PersistentVolumeClaims" -> the PVC/StorageClass problem
# the kubelet only enters the picture AFTER a node is assigned (ContainerCreating).`,
        why: 'A Pod in the Pending phase has been accepted by the API server but has not been assigned to a node, which means the scheduler has looked at it and either has not finished or has determined that no node can run it. The kubelet has no role at this stage, because there is no node binding for any kubelet to act on, so restarting kubelets accomplishes nothing. Restarting the scheduler also does not help, because the scheduler is not stuck — it has already evaluated the Pod against every node and recorded the reason it could not place it, as an event attached to the Pod. Describing the Pod shows those events, and they name the specific filter that eliminated every node: insufficient CPU or memory against the Pod\'s requests, a taint the Pod does not tolerate, a node-affinity or topology rule that no node satisfies, or a volume claim that cannot be bound. Each of those has a real fix — adjust the resource requests, add capacity or enable autoscaling, add a toleration, correct the affinity rules, resolve the storage problem — and none of them is a restart. The kubelet only becomes relevant once a node has been assigned and the Pod moves to ContainerCreating, at which point kubelet and runtime events become the thing to read.',
        whyHi: 'Pending phase mein ek Pod API server dwara accept kiya gaya hai par ek node ko assigned nahi kiya gaya, jiska matlab scheduler ne ise dekha hai aur ya to finish nahi kiya ya determine kiya ki koi node ise nahi chala sakta. Kubelet ka is stage par koi role nahi hai, kyunki kisi kubelet ke act karne ke liye koi node binding nahi hai. Scheduler ko restart karna bhi madad nahi karta, kyunki scheduler stuck nahi hai — isne already Pod ko har node ke against evaluate kiya hai aur reason record kiya hai ki ye ise place nahi kar saka, Pod se attached ek event ke roop mein. Pod ko describe karna wo events dikhata hai. Unmein se har ek ka ek real fix hai, aur unmein se koi ek restart nahi hai.',
      },
    ],

    realWorld: [
      {
        en: '**A self-managed cluster lost its single etcd node\'s disk** — no snapshots. Running workloads kept serving for hours, but no deploy or scale worked, and rebuilding meant re-applying every manifest AND manually recreating Secrets, PVCs, and ServiceAccount bindings from memory. Now: hourly etcd snapshots to S3 + a quarterly restore drill.',
        hi: '**Ek self-managed cluster ne apne single etcd node ki disk kho di** — koi snapshots nahi. Running workloads ghanton serve karte rahe, par koi deploy ya scale kaam nahi kiya.',
      },
      {
        en: '**Two hours lost restarting kubelets on a Pending Pod** — `kubectl describe pod` said `Insufficient cpu` in the first line of Events. The Pod requested 4 CPU on 2-CPU nodes. Lowering the request fixed it instantly. "describe the object" is now step one.',
        hi: '**Ek Pending Pod par kubelets restart karne mein do ghante lost** — `kubectl describe pod` ne Events ki pehli line mein `Insufficient cpu` kaha.',
      },
      {
        en: '**A CNI upgrade that broke pod-to-pod traffic across nodes** while pods on the same node were fine — narrowed to the CNI because the API server, scheduler, and kubelet were all healthy and only cross-node packets dropped. Rollback of the CNI DaemonSet restored it.',
        hi: '**Ek CNI upgrade jisne nodes ke across pod-to-pod traffic toda** jabki same node par pods fine the.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through what each control-plane component does and how a `kubectl apply` flows through them.',
        qHi: 'Har control-plane component kya karta hai aur ek `kubectl apply` unke through kaise flow karta hai walk through karo.',
        a: 'The API server is the single entry point: every read and write goes through it, over a REST interface with a watch mechanism for streaming changes. etcd is the datastore behind it, a strongly consistent distributed key-value store holding the entire cluster state; the API server is the only thing that talks to etcd. The scheduler watches for Pods with no assigned node and, for each, filters out nodes that cannot run it and scores the rest, then binds the Pod to the best node. The controller-manager runs about thirty controllers, each a reconciliation loop for one object kind — Deployment, ReplicaSet, Node, Job, EndpointSlice, and so on. The cloud-controller-manager holds the controllers that call the cloud provider, such as creating a load balancer or attaching a disk. When you run kubectl apply with a Deployment, the object goes to the API server, which authenticates you, checks RBAC for authorization, runs admission control where quotas and validating or mutating webhooks apply, and writes the Deployment to etcd. The Deployment controller sees it via a watch and creates a ReplicaSet; the ReplicaSet controller sees that and creates Pod objects; the scheduler sees Pods with no node and assigns each one by writing the node name; the kubelet on each assigned node sees its Pod and tells the container runtime to start the containers. Status flows back the same route: the kubelet writes actual status, which propagates up through the controllers until kubectl get reads the rolled-up result.',
        aHi: 'API server single entry point hai: har read aur write iske through jaata hai. etcd iske peeche datastore hai, ek strongly consistent distributed key-value store jo poora cluster state rakhta hai; API server ekmatra cheez hai jo etcd se baat karti hai. Scheduler bina assigned node ke Pods ke liye watch karta hai aur, har ek ke liye, un nodes ko filter out karta hai jo ise nahi chala sakte aur baaki ko score karta hai. Controller-manager ~30 controllers chalata hai. Cloud-controller-manager wo controllers rakhta hai jo cloud provider ko call karte hain. Jab aap ek Deployment ke saath kubectl apply chalate ho, object API server ko jaata hai, jo aapko authenticate karta hai, authorization ke liye RBAC check karta hai, admission control chalata hai, aur Deployment ko etcd mein likhta hai. Deployment controller ise ek watch ke through dekhta hai aur ek ReplicaSet banata hai; ReplicaSet controller wo dekhta hai aur Pod objects banata hai; scheduler bina node ke Pods dekhta hai; kubelet apne Pod dekhta hai aur containers start karta hai.',
      },
      {
        q: 'What is on a worker node, and why does "everything goes through the API server" matter?',
        qHi: 'Ek worker node par kya hai, aur "sab kuch API server ke through jaata hai" kyun matter karta hai?',
        a: 'Every node runs three things beyond the workloads. The kubelet is the node agent: it watches the API server for Pods bound to its node, tells the container runtime to pull images and start containers, mounts volumes, runs the liveness, readiness, and startup probes and acts on them, and reports Pod and node status back to the API server. It is a host process, not a container. The container runtime, containerd or CRI-O, is what the kubelet drives through the Container Runtime Interface to actually create the namespaced, cgrouped processes; Docker Engine is not used directly anymore. kube-proxy programs the node\'s packet forwarding, iptables or IPVS or an eBPF datapath, so a packet to a Service\'s virtual IP is redirected to one of its backend Pod IPs. And a CNI plugin gives each Pod a routable IP and connects pod-to-pod traffic across nodes, and enforces NetworkPolicy. The rule that everything goes through the API server matters for three reasons. It makes components independently restartable: any of them can crash and resume by re-watching, because none holds state the others depend on directly. It puts every action through one policy path: RBAC, the audit log, and admission webhooks all sit in the single request pipeline and see every change. And it makes the API the extension mechanism: you define custom resource types and write controllers that watch them, the operator pattern, using the same machinery Kubernetes uses for its built-in objects.',
        aHi: 'Har node workloads ke alawa teen cheezein chalata hai. Kubelet node agent hai: ye API server ko iske node se bound Pods ke liye watch karta hai, container runtime ko images pull aur containers start karne ko kehta hai, probes chalata hai, aur Pod aur node status wapas report karta hai. Ye ek host process hai, ek container nahi. Container runtime, containerd ya CRI-O, wo hai jise kubelet CRI ke through drive karta hai actually namespaced, cgrouped processes banane ke liye. kube-proxy node ka packet forwarding program karta hai. Aur ek CNI plugin har Pod ko ek routable IP deta hai. Rule ki sab kuch API server ke through jaata hai teen reasons ke liye matter karta hai: ye components ko independently restartable banata hai; ye har action ko ek policy path ke through daalta hai; aur ye API ko extension mechanism banata hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, name the five control-plane components and the four worker-node components, with one line on what each does. Mark which components are NOT containers.',
        taskHi: 'Ek comment mein, paanch control-plane components aur chaar worker-node components name karo.',
        hint: 'CONTROL PLANE: kube-apiserver (the ONLY door — authn→authz(RBAC)→admission→etcd; only thing that talks to etcd); etcd (the datastore — consistent watchable KV, holds the WHOLE cluster state, back it up); kube-scheduler (watches unassigned Pods → filter nodes that don\'t fit → score → bind; only DECIDES); kube-controller-manager (~30 controllers, each a reconcile loop — Deployment/ReplicaSet/Node/Job/EndpointSlice/...); cloud-controller-manager (cloud calls — LoadBalancer, attach disk, label nodes). WORKER NODE (every node): kubelet (node agent — watches its Pods, drives the runtime, runs probes, reports status — a HOST PROCESS, not a container); container runtime (containerd/CRI-O via CRI — actually runs containers); kube-proxy (programs iptables/IPVS so a Service ClusterIP → a backend Pod IP); CNI plugin (Calico/Cilium/flannel — routable Pod IPs, cross-node pod traffic, NetworkPolicy). NOT containers: the kubelet and the container runtime (host processes/systemd units).',
        hintHi: 'CONTROL PLANE: kube-apiserver (EKMATRA door); etcd (datastore — POORA cluster state, back it up); kube-scheduler (unassigned Pods → filter → score → bind); kube-controller-manager (~30 reconcile loops); cloud-controller-manager (cloud calls). WORKER NODE: kubelet (node agent — HOST PROCESS, container nahi); container runtime (containerd/CRI-O); kube-proxy (Service ClusterIP → Pod IP); CNI plugin (routable Pod IPs, NetworkPolicy). NOT containers: kubelet aur container runtime.',
      },
      {
        task: 'In a comment, trace a `kubectl apply -f deploy.yaml` (a Deployment, replicas: 3) through every component to running containers, and then trace status back out.',
        taskHi: 'Ek comment mein, ek `kubectl apply` ko har component ke through running containers tak trace karo.',
        hint: 'FORWARD: (1) `kubectl` → apiserver; (2) apiserver: authn → authz (RBAC: may you create Deployments?) → admission (quota checks, mutating/validating webhooks) → write the Deployment to etcd; (3) Deployment controller (watching) sees it → creates a ReplicaSet object; (4) ReplicaSet controller sees the RS → creates 3 Pod objects (no `.spec.nodeName`); (5) scheduler sees 3 unbound Pods → for each: filter nodes → score → writes `.spec.nodeName`; (6) the kubelet on each chosen node sees "a Pod bound to me" → tells containerd (via CRI) to pull the image + start the container(s), mounts volumes, starts probes. BACK: kubelet writes Pod `.status` (phase, conditions, containerStatuses) → apiserver → etcd → watch → ReplicaSet controller rolls up `.status.readyReplicas` → Deployment controller rolls up `.status.availableReplicas` / conditions → `kubectl get deploy` reads the final `.status`. NOTHING is peer-to-peer — every step is a watch/read + a write of a shared object.',
        hintHi: 'FORWARD: (1) `kubectl` → apiserver; (2) apiserver: authn → authz (RBAC) → admission (webhooks) → Deployment ko etcd mein write; (3) Deployment controller → ek ReplicaSet banata hai; (4) ReplicaSet controller → 3 Pod objects banata hai; (5) scheduler → har Pod ke liye filter → score → `.spec.nodeName` write; (6) chosen node par kubelet → containerd ko image pull + container start karne ko kehta hai. BACK: kubelet Pod `.status` write karta hai → apiserver → etcd → watch → controllers roll up → `kubectl get`. KUCH bhi peer-to-peer nahi.',
      },
      {
        task: 'In a comment, explain why restarting the kubelet or scheduler does nothing for a Pending Pod, what actually tells you why it is Pending, and list four common reasons.',
        taskHi: 'Ek comment mein, samjhao kyun ek Pending Pod ke liye kubelet ya scheduler restart karna kuch nahi karta.',
        hint: 'A Pending Pod has been accepted by the apiserver but NOT bound to a node → the SCHEDULER couldn\'t place it (or hasn\'t finished). The kubelet has NO role yet — there\'s no node binding for any kubelet to act on, so restarting kubelets does nothing. Restarting the scheduler does nothing either — it\'s not stuck, it already evaluated the Pod against every node and RECORDED WHY as an event on the Pod. `kubectl describe pod <name>` → the Events section names the exact filter that failed. Four common reasons: (1) `Insufficient cpu`/`Insufficient memory` — the Pod\'s resource requests exceed any node\'s allocatable → lower requests or add capacity/autoscale; (2) `node(s) had untolerated taint` → add a toleration or target other nodes; (3) `node(s) didn\'t match Pod\'s node affinity/selector` → fix nodeAffinity/topology; (4) `pod has unbound immediate PersistentVolumeClaims` → the PVC/StorageClass isn\'t provisioning. The kubelet only matters AFTER a node is assigned (ContainerCreating → then read kubelet/runtime events).',
        hintHi: 'Ek Pending Pod apiserver dwara accept kiya gaya par ek node ko bound NAHI → SCHEDULER ise place nahi kar saka. Kubelet ka abhi KOI role nahi — kisi kubelet ke act karne ke liye koi node binding nahi. Scheduler restart karna bhi kuch nahi karta — ye stuck nahi hai, isne already reason RECORD kiya hai Pod par ek event ke roop mein. `kubectl describe pod <name>` → Events section exact filter name karta hai jo fail hua. Chaar reasons: (1) `Insufficient cpu`/`memory`; (2) `untolerated taint`; (3) `didn\'t match node affinity/selector`; (4) `unbound PersistentVolumeClaims`. Kubelet sirf ek node assigned hone ke BAAD matter karta hai.',
      },
    ],

    keyTakeaways: [
      'A CLUSTER = CONTROL PLANE (the brain) + WORKER NODES (the muscle). On managed K8s (EKS/GKE/AKS) the cloud runs + backs up the control plane; you manage nodes. CONTROL-PLANE COMPONENTS: kube-apiserver (the ONLY door — every read/write goes authn → authz(RBAC) → admission(quota + validating/mutating webhooks) → etcd; the ONLY component that talks to etcd; stateless, horizontally scalable); etcd (the datastore — a strongly-consistent (Raft) watchable KV store holding the ENTIRE cluster state; lose it unrecoverably = lose the cluster → SNAPSHOT IT, run 3/5 for quorum); kube-scheduler (watches Pods with no `.spec.nodeName` → FILTER nodes that can\'t fit (CPU/mem/taints/affinity/ports/volumes) → SCORE the rest (spread, least-loaded) → BIND to the winner; it only DECIDES, never starts a container; no node passes → Pod stays Pending); kube-controller-manager (~30 controllers in one process, each a reconcile loop — Deployment, ReplicaSet, Node, Job, EndpointSlice, ServiceAccount, PV, ...); cloud-controller-manager (cloud API calls — provision a LoadBalancer, attach a disk, label nodes with zone/type, delete Node objects for dead VMs).',
      'WORKER-NODE COMPONENTS (on EVERY node): kubelet (the node agent — watches the apiserver for Pods bound to THIS node, tells the runtime to pull images + start containers, mounts volumes, runs liveness/readiness/startup probes + acts on them, reports Pod + node status back; it is a HOST PROCESS / systemd unit, NOT a container); the container runtime (containerd or CRI-O via the CRI → runc/a sandbox; Docker Engine is no longer used directly — the dockershim was removed in 1.24); kube-proxy (programs the node\'s iptables/IPVS — or an eBPF CNI replaces it — so a packet to a Service\'s ClusterIP is DNAT\'d to one of its healthy Pod IPs); the CNI plugin (Calico/Cilium/flannel/cloud — gives every Pod a routable IP, wires cross-node pod-to-pod traffic without NAT, enforces NetworkPolicy; K8s ships NO network implementation — you choose one).',
      'THE GOLDEN RULE: EVERYTHING goes through the API server — NOTHING is peer-to-peer. `kubectl`, the scheduler, every controller, and every kubelet all WATCH the apiserver and WRITE back to it; they coordinate ONLY through shared objects in etcd. Consequences: (1) components are independently restartable — any can crash and resume by re-watching, none holds state another depends on directly; (2) every action passes through ONE policy path — RBAC (`kubectl auth can-i`), the audit log, and admission webhooks all sit in the single request pipeline and see + can gate every change; (3) the API IS the extension point — define CustomResourceDefinitions + write controllers that reconcile them (the "operator" pattern — how databases, queues, cert-manager run on K8s).',
      'A `kubectl apply` (Deployment, replicas: 3) flows: kubectl → apiserver (authn→authz→admission→etcd) → Deployment controller (watch) creates a ReplicaSet → ReplicaSet controller creates 3 Pod objects (no nodeName) → scheduler filters+scores+binds each (writes nodeName) → the kubelet on each node sees its Pod → containerd pulls + starts the containers. STATUS flows back the SAME way in reverse: kubelet writes Pod `.status` → apiserver → etcd → watch → controllers roll up `.status` → `kubectl get` reads the final rolled-up picture. `.spec` = what you want; `.status` = what IS.',
      'BACK UP etcd (self-managed) — it holds cluster-generated state you CANNOT re-derive from your manifests (assigned Pod IPs, ServiceAccount tokens, resource UIDs, PVC bindings): `etcdctl snapshot save`, store OFF the control-plane node, TEST a restore. NODE LIFECYCLE: kubelet registers a Node object → posts heartbeats (a Lease) → heartbeats stop ~40s → node-controller marks it NotReady → after a grace period (~5min) its Pods are marked for eviction → the owning controllers reschedule them elsewhere (THIS is "self-healing across nodes" — several controllers each doing their ordinary reconcile). DEBUG a PENDING Pod with `kubectl describe pod` (the Events name the exact failed filter — `Insufficient cpu`, `untolerated taint`, `didn\'t match affinity`, `unbound PVC`), NOT by restarting the kubelet (not involved yet — no node assigned) or the scheduler (not stuck — it already recorded why). `kubectl get pods -n kube-system` shows the cluster running its OWN components as Pods (apiserver/etcd/scheduler/controller-manager as static Pods; CoreDNS/kube-proxy/CNI as DaemonSets/Deployments).',
    ],
    keyTakeawaysHi: [
      'EK CLUSTER = CONTROL PLANE (dimaag) + WORKER NODES (muscle). Managed K8s par cloud control plane chalata + back up karta hai. CONTROL-PLANE COMPONENTS: kube-apiserver (EKMATRA door — har read/write authn → authz(RBAC) → admission → etcd; etcd se baat karne wala EKMATRA component); etcd (datastore — strongly-consistent (Raft) watchable KV, POORA cluster state; ise unrecoverably lose karo = cluster lose → SNAPSHOT karo); kube-scheduler (bina nodeName ke Pods watch karta hai → FILTER → SCORE → BIND; sirf DECIDE karta hai); kube-controller-manager (~30 reconcile loops ek process mein); cloud-controller-manager (cloud API calls).',
      'WORKER-NODE COMPONENTS (HAR node par): kubelet (node agent — IS node se bound Pods watch karta hai, runtime ko images pull + containers start karne ko kehta hai, probes chalata hai, status report karta hai; ek HOST PROCESS, container NAHI); container runtime (containerd ya CRI-O CRI ke through; Docker Engine ab directly use nahi hota); kube-proxy (node ke iptables/IPVS program karta hai taaki ek Service ClusterIP ka packet ek Pod IP par DNAT ho); CNI plugin (Calico/Cilium/flannel — har Pod ko ek routable IP, cross-node pod traffic, NetworkPolicy).',
      'GOLDEN RULE: SAB KUCH API server ke through jaata hai — KUCH bhi peer-to-peer nahi. `kubectl`, scheduler, har controller, aur har kubelet sab apiserver ko WATCH karte hain aur ise WRITE karte hain. Consequences: (1) components independently restartable hain; (2) har action ek policy path se guzarta hai — RBAC, audit log, admission webhooks; (3) API extension point HAI — CRDs + controllers ("operator" pattern).',
      'Ek `kubectl apply` flow: kubectl → apiserver (authn→authz→admission→etcd) → Deployment controller ek ReplicaSet banata hai → ReplicaSet controller 3 Pod objects banata hai → scheduler har ek ko filter+score+bind karta hai → har node par kubelet apne Pod ko dekhta hai → containerd containers pull + start karta hai. STATUS wapas SAME way reverse mein flow karta hai. `.spec` = jo aap chahte ho; `.status` = jo HAI.',
      'etcd BACK UP karo (self-managed) — ye cluster-generated state rakhta hai jo aap apne manifests se re-derive NAHI kar sakte. NODE LIFECYCLE: kubelet ek Node object register karta hai → heartbeats post karta hai → heartbeats ~40s rukte hain → node-controller ise NotReady mark karta hai → ek grace period ke baad iske Pods eviction ke liye marked → owning controllers unhe kahin aur reschedule karte hain (YE "self-healing across nodes" hai). Ek PENDING Pod ko `kubectl describe pod` se DEBUG karo (Events exact failed filter name karte hain), kubelet (abhi involved nahi) ya scheduler (stuck nahi) restart karke NAHI.',
    ],
  },

  {
    slug: 'ops-desired-vs-actual-the-reconciliation-loop',
    title: 'Desired vs Actual — the Reconciliation Loop',
    titleHi: 'Desired vs Actual — Reconciliation Loop',
    description: 'Every Kubernetes object has the same shape: `apiVersion` and `kind` say what it is, `metadata` names it, `spec` is the state you want, and `status` is the state that currently is. You `kubectl apply` the spec, and a controller runs forever, taking one step at a time to make status match spec.',
    descriptionHi: 'Har Kubernetes object ki same shape hai: `apiVersion` aur `kind` batate hain ye kya hai, `metadata` ise name karta hai, `spec` wo state hai jo aap chahte ho, aur `status` wo state hai jo currently hai. Aap `kubectl apply` se spec deploy karte ho, aur ek controller forever chalta hai, ek baar mein ek step lete hue status ko spec se match karwane ke liye.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 3,

    analogy: {
      en: '**A thermostat.** You set a target — 21°C (\`spec\`). The thermostat reads the room — 18°C (\`status\`). It does not calculate a heating schedule; it just runs a loop: compare target to actual, and if actual is lower, turn the heat on; check again in a moment. Open a window and the temperature drops — the thermostat notices on its next check and turns the heat back on, without you touching anything. That is the whole model. In Kubernetes you write the target ("3 replicas of this image") into an object\'s `spec`, and a controller runs the thermostat loop forever: observe `status`, compare to `spec`, take one corrective step, repeat. Delete a Pod and the controller notices on its next pass and creates a replacement — you did not ask it to; it is just closing the gap it always closes.',
      hi: '**Ek thermostat.** Aap ek target set karte ho — 21°C (\`spec\`). Thermostat room padhta hai — 18°C (\`status\`). Ye ek heating schedule calculate nahi karta; ye bas ek loop chalata hai: target ko actual se compare karo, aur agar actual kam hai, heat on karo; ek moment mein phir check karo. Ek window kholo aur temperature girta hai — thermostat apne agle check par notice karta hai aur heat wapas on karta hai. Ye poora model hai. Kubernetes mein aap target ("is image ke 3 replicas") ek object ke \`spec\` mein likhte ho, aur ek controller thermostat loop forever chalata hai. Ek Pod delete karo aur controller apne agle pass par notice karta hai aur ek replacement banata hai.',
    },

    simple: `**EVERY object has the SAME 4-part shape:**
\`\`\`yaml
apiVersion: apps/v1        # which API group + version defines this kind
kind: Deployment          # WHAT this object is
metadata:
  name: web               # its name (unique within its kind + namespace)
  namespace: default
  labels: { app: web }    # key/value tags — how selectors find it (Lesson 6)
spec:                     # DESIRED state — what YOU declare. you write this.
  replicas: 3
  selector: { matchLabels: { app: web } }
  template: { ... pod spec ... }
status:                   # ACTUAL state — what the controller OBSERVES. read-only.
  replicas: 3
  readyReplicas: 3
  conditions: [ { type: Available, status: "True" } ]
\`\`\`
You edit \`spec\`. The system writes \`status\`. \`kubectl get\` shows a rollup of \`status\`.

**THE RECONCILIATION LOOP (every controller, forever):**
\`\`\`
1. WATCH the API server for its object kind
2. read DESIRED   = obj.spec
3. observe ACTUAL  = the real world (other objects, node state, metrics)
4. diff. if actual != desired:
5.    take ONE step toward desired   (create/update/delete a child object)
6. write observed reality into obj.status
7. -> back to 1.  (also: re-run every ~N minutes even with no events — "resync")
\`\`\`

**DECLARATIVE, not imperative:**
\`\`\`
IMPERATIVE (fragile):  kubectl create ... ; kubectl scale ... ; kubectl set image ...
                       — a sequence of commands; state lives in your shell history;
                       re-running fails ("already exists"); no record of intent.
DECLARATIVE (the way): kubectl apply -f ./k8s/     — the files ARE the desired state.
                       apply is idempotent (diffs + patches). the files are in git.
                       'kubectl diff -f' shows what apply WOULD change.
\`\`\`
\`kubectl apply\` stores your submitted config as an annotation, so next apply computes a
3-way merge (last-applied vs live vs new) — it removes fields you deleted from the file.
(Server-Side Apply is the newer mechanism with per-field ownership.)

**LEVEL-TRIGGERED, not edge-triggered:** controllers act on the *current state*, not on
*events*. A missed event doesn't matter — the next observation sees the true gap and
closes it. This is why Kubernetes is self-correcting and why "just delete the Pod" works.

**SELF-HEALING falls out of this for free:**
\`\`\`
ReplicaSet.spec.replicas = 3.   you 'kubectl delete pod web-x'.
-> ReplicaSet controller's next pass: actual = 2, desired = 3 -> create 1 Pod.
you never asked it to "heal". it's just closing the gap it always closes.
\`\`\`
The corollary: you cannot fix things by editing a controller-managed child directly —
edit a Pod that a ReplicaSet owns and the controller reverts it. Edit the \`spec\` that owns it.

**INSPECT:** \`kubectl explain <kind>.spec.<field>\` (the schema, offline) · \`kubectl get
<kind> -o yaml\` (spec + status) · \`kubectl describe\` (status + events) · \`kubectl diff -f\` ·
\`kubectl get <kind> -w\` (watch changes live).`,

    simpleHi: `**HAR object ki SAME 4-part shape hai:**
\`\`\`yaml
apiVersion: apps/v1        # kaunsa API group + version is kind ko define karta hai
kind: Deployment          # ye object KYA hai
metadata:
  name: web               # iska naam
  labels: { app: web }    # key/value tags — selectors ise kaise dhoondhte hain
spec:                     # DESIRED state — jo AAP declare karte ho. aap ye likhte ho.
  replicas: 3
status:                   # ACTUAL state — jo controller OBSERVE karta hai. read-only.
  readyReplicas: 3
\`\`\`
Aap \`spec\` edit karte ho. System \`status\` likhta hai.

**RECONCILIATION LOOP (har controller, forever):**
\`\`\`
1. API server ko iske object kind ke liye WATCH karo
2. DESIRED padho   = obj.spec
3. ACTUAL observe karo  = real world
4. diff. agar actual != desired:
5.    desired ki taraf EK step lo   (ek child object create/update/delete)
6. observed reality ko obj.status mein likho
7. -> wapas 1.  (aur: har ~N minutes re-run karo even bina events ke — "resync")
\`\`\`

**DECLARATIVE, imperative nahi:**
\`\`\`
IMPERATIVE (fragile):  kubectl create ... ; kubectl scale ... — commands ka ek sequence;
                       re-running fail hota hai; intent ka koi record nahi.
DECLARATIVE (the way): kubectl apply -f ./k8s/  — files desired state HAIN. apply idempotent hai.
                       files git mein hain. 'kubectl diff -f' dikhata hai apply KYA change karega.
\`\`\`

**LEVEL-TRIGGERED, edge-triggered nahi:** controllers *current state* par act karte hain, *events*
par nahi. Ek missed event matter nahi karta. Isliy Kubernetes self-correcting hai.

**SELF-HEALING is se free milta hai:**
\`\`\`
ReplicaSet.spec.replicas = 3.   aap 'kubectl delete pod web-x' karte ho.
-> ReplicaSet controller ka agla pass: actual = 2, desired = 3 -> 1 Pod banao.
aapne ise kabhi "heal" karne ko nahi kaha. ye bas wo gap band kar raha jo ye hamesha band karta hai.
\`\`\`
Corollary: aap ek controller-managed child ko directly edit karke cheezein fix nahi kar sakte —
ek Pod edit karo jo ek ReplicaSet own karta hai aur controller ise revert karta hai.

**INSPECT:** \`kubectl explain <kind>.spec.<field>\` (schema, offline) · \`kubectl get <kind> -o yaml\` ·
\`kubectl describe\` (status + events) · \`kubectl diff -f\` · \`kubectl get <kind> -w\`.`,

    content: `## One shape for every object

Every object in Kubernetes — a Pod, a Deployment, a Service, a ConfigMap, a Node, or a custom resource you define — has the same four top-level parts:

- **\`apiVersion\`** — the API group and version that defines this kind, such as \`v1\` (the core group), \`apps/v1\`, or \`networking.k8s.io/v1\`. This is how the API evolves: a kind can exist at \`v1beta1\` and later \`v1\` with different fields.
- **\`kind\`** — what the object is: \`Pod\`, \`Deployment\`, \`Service\`.
- **\`metadata\`** — identity and organisation: \`name\` (unique within the kind and namespace), \`namespace\`, \`labels\` (key/value tags that selectors match on — Lesson 6), \`annotations\` (non-identifying metadata), and system-managed fields like \`uid\`, \`creationTimestamp\`, \`resourceVersion\`, and \`ownerReferences\`.
- **\`spec\`** — the **desired state**. This is the part you write. For a Deployment it is the replica count, the Pod template, the update strategy. The API server validates it against the schema on write.
- **\`status\`** — the **actual state**, as observed and written by the controller responsible for this object. You do not write \`status\`; you read it. For a Deployment it is \`replicas\`, \`readyReplicas\`, \`updatedReplicas\`, and \`conditions\` (a list of \`{type, status, reason, message}\` such as \`Available: True\` or \`Progressing: False\`).

A few kinds have no \`spec\` and \`status\` split — a ConfigMap or Secret is just \`data\` — but the objects that represent running things all follow this pattern, and it is the single most important thing to internalise: **you declare \`spec\`, the system reports \`status\`, and a controller works continuously to make the second match the first.**

## The reconciliation loop

Each controller runs the same loop, forever, for its kind of object:

1. **Watch** the API server for objects of its kind (and for related objects it cares about).
2. For each object, read the **desired state** from \`spec\`.
3. **Observe the actual state** — which may mean listing child objects (a ReplicaSet lists its Pods), reading node conditions, or querying a metrics API.
4. **Compare.** If actual already equals desired, do nothing.
5. If not, take **one step** toward desired — create a missing child, delete an extra one, update a field, begin a rollout increment.
6. Write what it observed into the object's **\`status\`**.
7. Repeat. Additionally, most controllers **resync** on a timer (every few minutes) even with no events, so a bug or a missed notification cannot leave things permanently wrong.

The loop is deliberately simple. A controller does not plan a sequence of actions; it looks at the world as it is right now and takes the single next step. Complex behaviour — a rolling update, a node drain, an autoscale event — emerges from running this loop repeatedly as the situation changes.

## Declarative, not imperative

Kubernetes can be driven imperatively — \`kubectl create deployment\`, \`kubectl scale\`, \`kubectl set image\`, \`kubectl expose\` — and this is fine for experimentation. But it does not scale as a way of running systems: each command is a step whose only record is your shell history, re-running a command fails because the object already exists, and there is no single artifact that says what the cluster is supposed to look like.

The declarative approach is to write the desired state as **manifest files** and apply them:

\`\`\`bash
kubectl apply -f ./k8s/           # apply every manifest in the directory
kubectl diff -f ./k8s/            # show what apply WOULD change, without applying
\`\`\`

- \`kubectl apply\` is **idempotent** — applying the same files again is a no-op; applying changed files patches only the differences.
- The manifest files are **committed to version control**, so the desired state is versioned, reviewable, and the source of truth (which is what GitOps, Module 20, builds on).
- \`kubectl diff\` gives you a plan before you apply, the way \`terraform plan\` does.

### How \`apply\` computes the change

\`kubectl apply\` records the configuration you submitted as an annotation on the object (\`kubectl.kubernetes.io/last-applied-configuration\`). On the next apply it performs a **three-way merge**: it compares the last-applied config, the live object, and your new file. This is what lets \`apply\` **remove** a field you deleted from your manifest (it was in last-applied but not in the new file) while **preserving** fields that other actors set on the live object (they are not in last-applied at all). The newer mechanism, **Server-Side Apply**, moves this logic to the API server and tracks ownership per field, so multiple controllers and users can each own different parts of one object without conflict.

## Level-triggered, not edge-triggered

Controllers are **level-triggered**: they act on the **current state of the world**, not on the **events** that changed it. If a controller misses an event — it was restarting, the watch connection dropped — it does not matter, because its next observation sees the true current gap and closes it. An edge-triggered system, which acts on "a Pod was deleted" rather than "there are 2 Pods and I want 3", would be permanently wrong after a missed event.

This is why Kubernetes is **self-correcting** and why the common debugging move "just delete the Pod and let it come back" works: deleting the Pod changes the actual state, the owning controller observes the new gap on its next pass, and it creates a replacement — cleanly, from the desired spec, with none of whatever was wrong with the old one.

## Self-healing is a consequence, not a feature

There is no "self-healing" component. A ReplicaSet's \`spec.replicas\` is 3. You delete one of its Pods. On its next reconciliation pass the ReplicaSet controller lists the Pods matching its selector, counts 2, compares to the desired 3, and creates one Pod from the template. It is doing exactly what it always does — closing the gap between actual and desired — and "self-healing" is just the name we give to that behaviour when the gap was caused by a failure rather than by you.

The important corollary: **you cannot make a durable change by editing a controller-managed child object directly.** If you \`kubectl edit\` a Pod that a ReplicaSet owns, the ReplicaSet controller's next pass will see a Pod that does not match its template and — depending on the field — either ignore your change or replace the Pod. To change what runs, you edit the object that *owns* it: the Deployment, whose template flows down to a new ReplicaSet and new Pods.

## Inspecting objects

- **\`kubectl explain <kind>\`** — the schema of a kind and its fields, read from the API server, works without any object existing. \`kubectl explain deployment.spec.strategy\` drills into a specific field. This is the reference you use while writing manifests.
- **\`kubectl get <kind> <name> -o yaml\`** — the full object, both \`spec\` and \`status\`.
- **\`kubectl describe <kind> <name>\`** — a human-readable summary plus the **events** attached to the object, which is where controllers narrate what they did and why something is stuck.
- **\`kubectl diff -f <file>\`** — the change \`apply\` would make.
- **\`kubectl get <kind> -w\`** — watch, printing a line every time an object of that kind changes, so you can see a rollout or a scale-up happen live.`,

    contentHi: `## Har object ke liye ek shape

Kubernetes mein har object — ek Pod, Deployment, Service, ConfigMap, Node, ya ek custom resource — ke paas same chaar top-level parts hain:
- **\`apiVersion\`** — API group aur version jo is kind ko define karta hai (\`v1\`, \`apps/v1\`).
- **\`kind\`** — object kya hai.
- **\`metadata\`** — identity: \`name\`, \`namespace\`, \`labels\` (selectors jinpar match karte hain), \`annotations\`, aur system-managed fields.
- **\`spec\`** — **desired state**. Ye wo part hai jo aap likhte ho.
- **\`status\`** — **actual state**, jaise responsible controller dwara observed aur written. Aap \`status\` nahi likhte; aap ise padhte ho.

Sabse important cheez: **aap \`spec\` declare karte ho, system \`status\` report karta hai, aur ek controller continuously kaam karta hai doosre ko pehle se match karwane ke liye.**

## Reconciliation loop

Har controller apne kind ke object ke liye same loop, forever chalata hai:
1. API server ko iske kind ke objects ke liye **Watch** karo.
2. Har object ke liye, \`spec\` se **desired state** padho.
3. **Actual state observe karo**.
4. **Compare karo.** Agar actual already desired ke barabar hai, kuch mat karo.
5. Agar nahi, desired ki taraf **ek step** lo.
6. Jo observe kiya wo object ke **\`status\`** mein likho.
7. Repeat. Additionally, zyaadatar controllers ek timer par **resync** karte hain.

## Declarative, imperative nahi

Declarative approach desired state ko **manifest files** ke roop mein likhna aur unhe apply karna hai:
\`\`\`bash
kubectl apply -f ./k8s/           # directory mein har manifest apply karo
kubectl diff -f ./k8s/            # dikhao apply KYA change karega
\`\`\`
- \`kubectl apply\` **idempotent** hai.
- Manifest files **version control mein committed** hain (GitOps, Module 20).
- \`kubectl diff\` aapko apply se pehle ek plan deta hai.

\`kubectl apply\` aapki submitted config ko ek annotation ke roop mein record karta hai, to next apply ek **three-way merge** compute karta hai — ye us field ko **remove** karta hai jo aapne apne manifest se delete kiya.

## Level-triggered, edge-triggered nahi

Controllers **level-triggered** hain: wo **duniya ke current state** par act karte hain, **events** par nahi. Agar ek controller ek event miss karta hai, ye matter nahi karta, kyunki iski agli observation true current gap dekhti hai aur ise band karti hai. Isliye Kubernetes **self-correcting** hai aur "bas Pod delete karo aur ise wapas aane do" kaam karta hai.

## Self-healing ek consequence hai, ek feature nahi

Koi "self-healing" component nahi hai. Ek ReplicaSet ka \`spec.replicas\` 3 hai. Aap iske ek Pod ko delete karte ho. Iske agle reconciliation pass par ReplicaSet controller apne selector se matching Pods list karta hai, 2 count karta hai, desired 3 se compare karta hai, aur template se ek Pod banata hai.

Important corollary: **aap ek controller-managed child object ko directly edit karke ek durable change nahi bana sakte.** Jo chalta hai use change karne ke liye, aap us object ko edit karte ho jo ise *own* karta hai.

## Objects inspect karna

- **\`kubectl explain <kind>\`** — ek kind ka schema, bina kisi object ke kaam karta hai.
- **\`kubectl get <kind> <name> -o yaml\`** — full object, \`spec\` aur \`status\` dono.
- **\`kubectl describe <kind> <name>\`** — ek human-readable summary plus **events**.
- **\`kubectl diff -f <file>\`** — jo change \`apply\` karega.
- **\`kubectl get <kind> -w\`** — watch.`,

    examples: [
      {
        title: 'spec vs status, and the reconciliation loop closing a gap you opened',
        titleHi: 'spec vs status, aur reconciliation loop ek gap band karta hai jo aapne khola',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m7l3-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

cat <<EOF | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: apps/v1
kind: Deployment
metadata: { name: web, labels: { app: web } }
spec:
  replicas: 3
  selector: { matchLabels: { app: web } }
  template:
    metadata: { labels: { app: web } }
    spec:
      containers:
        - name: web
          image: registry.k8s.io/pause:3.10
EOF
kubectl -n "$ns" rollout status deploy/web --timeout=90s >/dev/null

echo "--- spec (what you asked for) vs status (what the controller observed) ---"
kubectl -n "$ns" get deploy web -o jsonpath='spec.replicas={.spec.replicas}  status.readyReplicas={.status.readyReplicas}  available={.status.conditions[?(@.type=="Available")].status}{"\\n"}'

echo "--- you open a gap: delete one Pod by hand ---"
victim=$(kubectl -n "$ns" get pods -l app=web -o name | head -1)
kubectl -n "$ns" delete "$victim" --now >/dev/null
echo "deleted 1 of 3"

echo "--- the ReplicaSet controller's next pass closes it (no one asked it to 'heal') ---"
kubectl -n "$ns" rollout status deploy/web --timeout=90s >/dev/null
kubectl -n "$ns" get deploy web -o jsonpath='pods now ready = {.status.readyReplicas}/{.spec.replicas}{"\\n"}'

echo "--- editing a controller-owned Pod does NOT stick: the owner reconciles it away ---"
p=$(kubectl -n "$ns" get pods -l app=web -o name | head -1)
kubectl -n "$ns" label "$p" purpose=manual-edit >/dev/null
kubectl -n "$ns" delete "$p" --now >/dev/null   # controller recreates from the TEMPLATE (no label)
kubectl -n "$ns" rollout status deploy/web --timeout=90s >/dev/null
echo "pods carrying the hand-added label: $(kubectl -n "$ns" get pods -l purpose=manual-edit --no-headers 2>/dev/null | grep -c . )"`,
        output: `--- spec (what you asked for) vs status (what the controller observed) ---
spec.replicas=3  status.readyReplicas=3  available=True
--- you open a gap: delete one Pod by hand ---
deleted 1 of 3
--- the ReplicaSet controller's next pass closes it (no one asked it to 'heal') ---
pods now ready = 3/3
--- editing a controller-owned Pod does NOT stick: the owner reconciles it away ---
pods carrying the hand-added label: 0`,
        explain: 'The Deployment is applied with a desired replica count of three. After the rollout completes, reading the object shows the split clearly: the spec field holds the three you asked for, and the status field holds what the controller has observed to be true — three ready replicas and an Available condition of true. You did not write the status; the controller did, by counting real Pods. Deleting one Pod by hand changes the actual state without changing the spec, so there is now a gap: the ReplicaSet that the Deployment owns wants three Pods matching its selector and can see only two. On its next reconciliation pass it creates one Pod from the template, and the count returns to three. Nothing invoked a healing routine; the controller ran the same compare-and-close-the-gap step it always runs, and the gap happened to be caused by a deletion. The last part shows the corollary: a label added directly to a running Pod is not part of the Deployment\'s template, so when that Pod is replaced the new one is created from the template and does not carry the label. Durable changes are made to the owning object\'s spec, which flows down; changes made to managed children are transient.',
        explainHi: 'Deployment ek desired replica count teen ke saath applied hai. Rollout complete hone ke baad, object padhna split clearly dikhata hai: spec field wo teen rakhta hai jo aapne maanga, aur status field wo rakhta hai jo controller ne true observe kiya. Aapne status nahi likha; controller ne, real Pods count karke. Ek Pod haath se delete karna actual state ko spec badle bina badalta hai, to ab ek gap hai. Iske agle reconciliation pass par ye template se ek Pod banata hai, aur count teen par wapas aata hai. Kuch bhi ek healing routine invoke nahi kiya. Aakhiri part corollary dikhata hai: ek running Pod mein directly add kiya ek label Deployment ke template ka part nahi hai, to jab wo Pod replace hota hai naya template se banaya jaata hai aur label carry nahi karta.',
      },
      {
        title: 'Declarative apply: idempotent, three-way merge, diff before apply',
        titleHi: 'Declarative apply: idempotent, three-way merge, apply se pehle diff',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m7l3b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT
cd "$(mktemp -d)"

cat > cm.yaml <<EOF
apiVersion: v1
kind: ConfigMap
metadata: { name: app-config }
data:
  LOG_LEVEL: info
  FEATURE_X: "off"
EOF

kubectl -n "$ns" apply -f cm.yaml
echo "--- apply the SAME file again: idempotent, no change ---"
kubectl -n "$ns" apply -f cm.yaml

echo "--- another actor adds a key directly (simulating a controller / a person) ---"
kubectl -n "$ns" patch configmap app-config --type merge -p '{"data":{"INJECTED":"by-someone-else"}}' >/dev/null

echo "--- edit the file: change one key, DELETE another, then diff before applying ---"
sed -i 's/LOG_LEVEL: info/LOG_LEVEL: debug/; /FEATURE_X/d' cm.yaml
kubectl -n "$ns" diff -f cm.yaml | grep -E '^[+-] ' | grep -vE 'last-applied|resourceVersion'

echo "--- apply: 3-way merge -> LOG_LEVEL changed, FEATURE_X removed, INJECTED KEPT ---"
kubectl -n "$ns" apply -f cm.yaml >/dev/null
kubectl -n "$ns" get configmap app-config -o jsonpath='{.data}{"\\n"}'`,
        output: `configmap/app-config created
--- apply the SAME file again: idempotent, no change ---
configmap/app-config unchanged
--- another actor adds a key directly (simulating a controller / a person) ---
--- edit the file: change one key, DELETE another, then diff before applying ---
-  FEATURE_X: "off"
-  LOG_LEVEL: info
+  LOG_LEVEL: debug
--- apply: 3-way merge -> LOG_LEVEL changed, FEATURE_X removed, INJECTED KEPT ---
{"INJECTED":"by-someone-else","LOG_LEVEL":"debug"}`,
        explain: 'The first apply creates the object. Applying the identical file again reports the object as unchanged, because apply is idempotent — it compares and finds nothing to do. Then a second actor patches a key directly into the live object, which is what happens in reality when a controller or another person modifies something. The manifest file is then edited: one key changed, one key deleted. Running diff against the file shows exactly what apply would do — remove the deleted key, change the modified one — which is the plan-before-you-act step. When apply runs, it performs a three-way merge between the configuration it last applied, the current live object, and the new file. The key you changed is updated. The key you deleted from the file is removed, because apply can see it was in the last-applied config but is not in the new file, so your intent was to remove it. And the key the other actor injected is left alone, because it was never in any version of your file, so apply has no basis to remove it. This is the behaviour that makes declarative management safe when more than one thing writes to an object: apply only touches what you have expressed an opinion about.',
        explainHi: 'Pehla apply object banata hai. Identical file ko phir apply karna object ko unchanged report karta hai, kyunki apply idempotent hai. Phir ek doosra actor ek key ko directly live object mein patch karta hai. Manifest file phir edit ki jaati hai: ek key changed, ek key deleted. File ke against diff chalana exactly dikhata hai apply kya karega. Jab apply chalta hai, ye ek three-way merge perform karta hai: jo config isne last applied kiya, current live object, aur naya file. Jo key aapne change ki wo update hoti hai. Jo key aapne file se delete ki wo remove hoti hai, kyunki apply dekh sakta hai ye last-applied config mein thi par naye file mein nahi. Aur jo key doosre actor ne inject ki wo akeli chhodi jaati hai, kyunki ye aapke file ke kisi version mein kabhi nahi thi.',
      },
      {
        title: 'kubectl explain: the object schema, offline',
        titleHi: 'kubectl explain: object schema, offline',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"

echo "--- the 4 top-level fields of every object ---"
kubectl explain deployment 2>&1 | grep -E '^[[:space:]]+(apiVersion|kind|metadata|spec|status)[[:space:]]' | sed -E 's/^[[:space:]]+//; s/[[:space:]]+/ /g'

echo "--- drill into a spec field ---"
kubectl explain deployment.spec.strategy.type 2>&1 | grep -A2 '^DESCRIPTION' | head -3

echo "--- status is a separate subtree, written by the controller ---"
kubectl explain deployment.status.conditions --recursive=false 2>&1 | grep -E '^FIELD: conditions'`,
        output: `--- the 4 top-level fields of every object ---
apiVersion <string>
kind <string>
metadata <ObjectMeta>
spec <DeploymentSpec>
status <DeploymentStatus>
--- drill into a spec field ---
DESCRIPTION:
    Type of deployment. Can be "Recreate" or "RollingUpdate". Default is
    RollingUpdate.
--- status is a separate subtree, written by the controller ---
FIELD: conditions <[]DeploymentCondition>`,
        explain: 'The explain command reads the API schema from the server and prints the fields of a kind and their types, and it works whether or not any object of that kind exists, so it is the reference to reach for while writing a manifest rather than searching documentation. Asking about a Deployment shows the same top-level shape every object has: apiVersion and kind as strings, metadata as a structured type, and then spec and status as separate structured subtrees. Drilling into a path within spec shows the description and allowed values for that one field, here the strategy type with its two valid options and its default. Asking about a path within status shows that status has its own set of fields, populated by the controller, distinct from anything you write. The consistent takeaway is that you author spec and read status, and explain is how you learn what belongs in spec for any kind without leaving the terminal.',
        explainHi: 'explain command server se API schema padhta hai aur ek kind ke fields aur unke types print karta hai, aur ye kaam karta hai chahe us kind ka koi object exist kare ya nahi. Ek Deployment ke baare mein poochna wahi top-level shape dikhata hai jo har object ke paas hai: apiVersion aur kind strings ke roop mein, metadata ek structured type ke roop mein, aur phir spec aur status alag structured subtrees ke roop mein. spec ke andar ek path mein drill karna us ek field ke liye description aur allowed values dikhata hai. status ke andar ek path ke baare mein poochna dikhata hai ki status ke apne fields ka set hai, controller dwara populated. Consistent takeaway ye hai ki aap spec author karte ho aur status padhte ho.',
      },
    ],

    mistakes: [
      {
        wrong: `# running a system imperatively: a runbook of kubectl commands
$ kubectl create deployment api --image=myco/api:1.4
$ kubectl scale deployment api --replicas=4
$ kubectl set env deployment api LOG_LEVEL=info
$ kubectl expose deployment api --port=80 --target-port=3000
# -> months later, nobody can say what the cluster SHOULD look like. re-running
//    the runbook fails ("already exists"). the actual state has drifted from
//    everyone's memory. a rebuild is archaeology. code review sees nothing.`,
        right: `# write the desired state as files, commit them, apply the directory:
#   k8s/api/deployment.yaml   (image, replicas, env, resources, probes)
#   k8s/api/service.yaml
$ kubectl diff -f k8s/api/     # the plan
$ kubectl apply -f k8s/api/    # idempotent; re-run any time; patches only diffs
# the files ARE the source of truth: versioned, reviewable, diffable. this is
# what GitOps (Module 20) automates — a controller applies the git repo for you.`,
        why: 'Driving a cluster with a sequence of imperative commands means the desired state exists only as the commands that were run, recorded at best in a runbook and at worst in shell history. That has several failure modes. Re-running the sequence does not work, because commands that create objects fail once the objects exist, so the runbook is not a way to reproduce the state. There is no single artifact a person can read to know what the cluster is supposed to contain, so the actual state gradually diverges from anyone\'s mental model and a rebuild becomes a reconstruction from fragments. And because the changes are commands rather than files, they cannot be reviewed before they take effect. The declarative alternative writes the desired state as manifest files, applies the whole set with a command that is idempotent and patches only differences, and keeps the files in version control. The files are then the authoritative description of the cluster: they can be diffed against the live state before applying, reviewed like any code change, and re-applied at any time to converge the cluster back to them. GitOps extends this by having a controller in the cluster apply the repository automatically.',
        whyHi: 'Ek cluster ko imperative commands ke ek sequence se drive karne ka matlab desired state sirf un commands ke roop mein exist karta hai jo run kiye gaye. Uske kai failure modes hain. Sequence ko re-run karna kaam nahi karta, kyunki objects create karne wale commands objects exist hone ke baad fail ho jaate hain. Koi single artifact nahi hai jise ek person padh sakta hai ki cluster ko kya contain karna chahiye. Aur kyunki changes commands hain files nahi, unhe effect lene se pehle review nahi kiya ja sakta. Declarative alternative desired state ko manifest files ke roop mein likhta hai, poore set ko ek command se apply karta hai jo idempotent hai, aur files ko version control mein rakhta hai. Files phir cluster ka authoritative description hain.',
      },
      {
        wrong: `# "fixing" a broken Pod by editing it directly
$ kubectl edit pod api-7d9f-abcde        # bump a limit, add an env var, whatever
# it works for ~30 seconds. then:
#   - the ReplicaSet controller sees a Pod that doesn't match its template
//    (for immutable fields) and can't reconcile -> or the Pod restarts /
//    reschedules and your edit is GONE, because the new Pod is built from the
//    Deployment's template, which you never touched.`,
        right: `# change the object that OWNS the Pod. the change flows down:
$ kubectl edit deployment api            # or edit k8s/api/deployment.yaml + apply
#   -> Deployment updates its template
#   -> a NEW ReplicaSet is created with the new template
#   -> Pods are rolled from old RS to new RS
# to iterate fast on ONE Pod for debugging, use a throwaway:
$ kubectl run debug --rm -it --image=... --restart=Never -- sh
$ kubectl debug pod/api-... -it --image=busybox --target=api   # ephemeral container`,
        why: 'A Pod created by a ReplicaSet is a managed child: the ReplicaSet controller\'s reconciliation compares the Pods it owns to the template in its spec, and the Pod\'s identity and much of its configuration are considered fixed once created. Editing such a Pod directly has no lasting effect. Many fields are immutable and the edit is rejected outright. For the fields that can be changed, the edit persists only until the Pod is replaced — which happens on any node failure, eviction, or rollout — and the replacement is built fresh from the Deployment\'s template, which the direct edit never modified, so the change is lost. The correct place to make a change that should stick is the object that owns the Pod, normally the Deployment: editing its template causes a new ReplicaSet to be created with the new template and the Pods to be rolled over to it. For fast iteration on a single container while debugging, the tools are a throwaway Pod created with run and removed on exit, or an ephemeral debug container attached to a running Pod, neither of which fights the controllers.',
        whyHi: 'Ek ReplicaSet dwara banaya gaya ek Pod ek managed child hai: ReplicaSet controller ki reconciliation un Pods ko compare karti hai jo ye own karta hai iske spec mein template se, aur Pod ki identity aur iski configuration ka bahut kuch create hone ke baad fixed maana jaata hai. Aise Pod ko directly edit karne ka koi lasting effect nahi hai. Bahut se fields immutable hain aur edit outright reject hoti hai. Jo fields change ho sakte hain unke liye, edit sirf tab tak persist karti hai jab tak Pod replace nahi hota — jo kisi node failure, eviction, ya rollout par hota hai — aur replacement Deployment ke template se fresh banaya jaata hai. Ek change karne ki correct jagah jo stick honi chahiye wo object hai jo Pod ko own karta hai.',
      },
      {
        wrong: `# expecting 'kubectl apply' to remove a resource you deleted from your files
$ ls k8s/          # was: deployment.yaml service.yaml hpa.yaml
$ rm k8s/hpa.yaml  # decided we don't want the autoscaler anymore
$ kubectl apply -f k8s/
# -> the Deployment + Service are updated. the HPA is STILL RUNNING. 'apply'
//    only acts on the files it's GIVEN; it has no idea a file used to exist.`,
        right: `# apply doesn't delete what's no longer in your files. options:
#   - explicit:  kubectl delete hpa <name>   (or 'kubectl delete -f old-hpa.yaml')
#   - pruning:   kubectl apply -f k8s/ --prune -l app=api   (deletes labelled
//                objects not in the apply set — powerful, use with a tight label)
#   - GitOps (Argo CD / Flux): the controller tracks the whole desired set and
//                prunes removed resources automatically (Module 20).`,
        why: 'kubectl apply reconciles the objects described in the files it is given toward those files; it does not maintain a notion of a complete desired set, so it cannot know that a resource which is no longer in your files used to be there and should now be deleted. Removing a manifest from a directory and re-applying the directory therefore leaves the corresponding live object running untouched. Removing it requires an explicit action: deleting the object by name or from its old manifest, or using the prune option, which deletes objects that carry a given label but are not present in the current apply set — effective but sharp, since a mismatched label selector can delete more than intended. The general solution is GitOps: a controller such as Argo CD or Flux is given the entire repository as the desired set, tracks every resource it has created, and when a resource disappears from the repository the controller deletes it from the cluster, closing exactly this gap.',
        whyHi: 'kubectl apply un objects ko reconcile karta hai jo iske diye gaye files mein described hain un files ki taraf; ye ek complete desired set ka notion maintain nahi karta, to ye nahi jaan sakta ki ek resource jo ab aapke files mein nahi hai pehle tha aur ab delete hona chahiye. Ek directory se ek manifest hataana aur directory ko re-apply karna isliye corresponding live object ko untouched running chhod deta hai. Ise hataane ke liye ek explicit action chahiye: object ko name se ya iske purane manifest se delete karna, ya prune option use karna. General solution GitOps hai: Argo CD ya Flux jaisa ek controller poore repository ko desired set ke roop mein diya jaata hai aur jab ek resource repository se disappear hota hai controller ise cluster se delete karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**A team that ran everything via `kubectl` commands in a wiki page** could not answer "what\'s deployed" during an incident — the page was months stale and re-running it errored. Migrated to `kubectl apply -f k8s/` from git; the repo became the answer, and later Argo CD applied it automatically.',
        hi: '**Ek team jo sab kuch ek wiki page mein `kubectl` commands ke through chalati thi** ek incident ke dauran "kya deployed hai" answer nahi kar saki.',
      },
      {
        en: '**An engineer `kubectl edit`-ed a Pod\'s memory limit to stop OOM kills** — it worked until the next node scale-down replaced the Pod from the unchanged Deployment template and the OOM kills came back. The fix was one line in `deployment.yaml`.',
        hi: '**Ek engineer ne OOM kills rokne ke liye ek Pod ki memory limit `kubectl edit` ki** — ye tab tak kaam kiya jab tak agle node scale-down ne Pod ko unchanged Deployment template se replace nahi kiya.',
      },
      {
        en: '**A deleted `HPA.yaml` that kept autoscaling for 3 weeks** because `kubectl apply -f k8s/` never removes what\'s absent from the files. A confusing "why does replicas keep changing" until someone ran `kubectl get hpa` and found the orphan.',
        hi: '**Ek deleted `HPA.yaml` jo 3 hafte autoscale karta raha** kyunki `kubectl apply -f k8s/` kabhi wo nahi hataata jo files se absent hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Describe the shape of a Kubernetes object and the reconciliation loop.',
        qHi: 'Ek Kubernetes object ki shape aur reconciliation loop describe karo.',
        a: 'Every object has four top-level parts. apiVersion and kind identify what it is and which API version defines it. metadata carries identity and organisation — the name, the namespace, labels that selectors match on, annotations, and system-managed fields like the uid and owner references. spec is the desired state, the part you write; for a Deployment it is the replica count, the Pod template, the update strategy. status is the actual state, written by the controller responsible for the object and read-only to you; for a Deployment it is the observed replica counts and a set of conditions. The single idea is that you declare spec and the system reports status. The reconciliation loop is how status is made to match spec. Each controller watches the API server for its kind of object, and for each object it reads the desired state from spec, observes the actual state by listing child objects or reading node conditions or metrics, compares the two, and if they differ takes exactly one step toward desired — creating a missing child, deleting an extra one, updating a field. It then writes what it observed into status and repeats, and most controllers also resync on a timer so a missed event cannot leave things permanently wrong. Controllers do not plan sequences; complex behaviour like a rolling update emerges from running this one-step loop repeatedly as the situation changes.',
        aHi: 'Har object ke chaar top-level parts hain. apiVersion aur kind identify karte hain ye kya hai. metadata identity carry karta hai — name, namespace, labels jinpar selectors match karte hain, annotations, aur system-managed fields. spec desired state hai, wo part jo aap likhte ho. status actual state hai, responsible controller dwara written aur aapke liye read-only. Single idea ye hai ki aap spec declare karte ho aur system status report karta hai. Reconciliation loop wo hai jisse status ko spec se match karwaya jaata hai. Har controller apne kind ke object ke liye API server ko watch karta hai, aur har object ke liye ye spec se desired state padhta hai, actual state observe karta hai, dono ko compare karta hai, aur agar wo differ karte hain desired ki taraf exactly ek step leta hai. Phir ye jo observe kiya wo status mein likhta hai aur repeat karta hai.',
      },
      {
        q: 'Why is "self-healing" not a feature, and why can\'t you fix a problem by editing a Pod directly?',
        qHi: '"Self-healing" ek feature kyun nahi hai, aur aap ek Pod ko directly edit karke ek problem kyun fix nahi kar sakte?',
        a: 'There is no self-healing component. When you delete a Pod that a ReplicaSet owns, the ReplicaSet controller on its next reconciliation pass lists the Pods matching its selector, counts one fewer than its spec asks for, and creates a replacement from the template. It is running the same compare-actual-to-desired-and-close-the-gap step it always runs; self-healing is just the name for that behaviour when the gap was caused by a failure rather than by an operator. This works because controllers are level-triggered — they act on the current state, not on the events that produced it — so a missed notification does not matter, the next observation sees the true gap. The corollary is that editing a controller-managed child object directly does not produce a durable change. A Pod owned by a ReplicaSet has an identity and configuration that are treated as fixed; many fields are immutable and the edit is rejected, and for fields that can change, the edit lasts only until the Pod is replaced by a node failure, an eviction, or a rollout, at which point the replacement is built from the Deployment\'s template, which the direct edit never touched. To make a change that persists you edit the object that owns the Pod — the Deployment — and its updated template flows down to a new ReplicaSet and new Pods. For debugging a single container quickly, you use a throwaway Pod or an ephemeral debug container instead of fighting the controller.',
        aHi: 'Koi self-healing component nahi hai. Jab aap ek Pod delete karte ho jo ek ReplicaSet own karta hai, ReplicaSet controller apne agle reconciliation pass par apne selector se matching Pods list karta hai, iske spec se ek kam count karta hai, aur template se ek replacement banata hai. Ye wahi compare-actual-to-desired step chala raha hai jo ye hamesha chalata hai. Ye kaam karta hai kyunki controllers level-triggered hain. Corollary ye hai ki ek controller-managed child object ko directly edit karna ek durable change produce nahi karta. Ek ReplicaSet dwara owned ek Pod ki ek identity hai jo fixed treat ki jaati hai; bahut se fields immutable hain, aur jo fields change ho sakte hain unke liye edit sirf tab tak lasts karti hai jab tak Pod replace nahi hota. Ek change karne ke liye jo persist kare aap us object ko edit karte ho jo Pod ko own karta hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write out the 4 top-level fields of every Kubernetes object with one line each, and say precisely which one YOU write and which one the SYSTEM writes.',
        taskHi: 'Ek comment mein, har Kubernetes object ke 4 top-level fields likho.',
        hint: '`apiVersion` — the API group + version that defines this kind (`v1`, `apps/v1`, `networking.k8s.io/v1`); this is how the API evolves (`v1beta1` → `v1`). `kind` — what the object IS (`Pod`, `Deployment`, `Service`). `metadata` — identity + organisation: `name` (unique per kind+namespace), `namespace`, `labels` (tags selectors match on), `annotations` (non-identifying), + system-managed `uid`/`creationTimestamp`/`resourceVersion`/`ownerReferences`. `spec` — the DESIRED state; YOU write this; the API server validates it against the schema. `status` — the ACTUAL observed state; the CONTROLLER writes this, it\'s read-only to you (e.g. `readyReplicas`, `conditions: [{type: Available, status: "True"}]`). The whole model: you declare `spec`, the system reports `status`, a controller works forever to make status match spec.',
        hintHi: '`apiVersion` — API group + version jo is kind ko define karta hai. `kind` — object KYA hai. `metadata` — identity: `name`, `namespace`, `labels`, `annotations`, + system-managed fields. `spec` — DESIRED state; AAP ye likhte ho. `status` — ACTUAL observed state; CONTROLLER ye likhta hai, aapke liye read-only. Poora model: aap `spec` declare karte ho, system `status` report karta hai, ek controller forever kaam karta hai status ko spec se match karwane ke liye.',
      },
      {
        task: 'In a comment, write the 7-step reconciliation loop, then explain "level-triggered not edge-triggered" and why it makes `kubectl delete pod` a safe fix.',
        taskHi: 'Ek comment mein, 7-step reconciliation loop likho.',
        hint: 'LOOP (every controller, forever): (1) WATCH the apiserver for its object kind (+ related objects); (2) read DESIRED = `obj.spec`; (3) observe ACTUAL = the real world (child objects, node state, metrics); (4) compare — if actual == desired, do nothing; (5) else take ONE step toward desired (create/delete/update a child); (6) write observed reality into `obj.status`; (7) → back to 1 (+ resync on a timer every ~N min even with no events). LEVEL-TRIGGERED: the controller acts on the CURRENT STATE, not on the EVENT that changed it ("there are 2 Pods, I want 3" — not "a Pod was deleted"). A missed event (controller restarting, watch dropped) doesn\'t matter — the next observation sees the true gap and closes it. That\'s why `kubectl delete pod` is a safe fix: it changes actual state; the owning controller\'s next pass sees the gap and rebuilds the Pod CLEANLY from the desired spec — none of whatever was wrong with the old one carries over.',
        hintHi: 'LOOP: (1) apiserver ko iske object kind ke liye WATCH karo; (2) DESIRED padho = `obj.spec`; (3) ACTUAL observe karo = real world; (4) compare — agar actual == desired, kuch mat karo; (5) warna desired ki taraf EK step lo; (6) observed reality ko `obj.status` mein likho; (7) → wapas 1 (+ timer par resync). LEVEL-TRIGGERED: controller CURRENT STATE par act karta hai, EVENT par nahi. Ek missed event matter nahi karta. Isliye `kubectl delete pod` ek safe fix hai: ye actual state badalta hai; owning controller ka agla pass gap dekhta hai aur Pod ko desired spec se CLEANLY rebuild karta hai.',
      },
      {
        task: 'In a comment, contrast imperative vs declarative cluster management, explain what `kubectl apply`\'s 3-way merge does with a field you deleted from your file vs a field another actor added, and explain why `apply` does NOT delete a resource whose file you removed.',
        taskHi: 'Ek comment mein, imperative vs declarative cluster management contrast karo.',
        hint: 'IMPERATIVE (`kubectl create`/`scale`/`set image`/`expose`): a sequence of commands; state lives in shell history / a wiki; re-running fails ("already exists"); no artifact says what the cluster SHOULD be; no code review. DECLARATIVE (`kubectl apply -f ./k8s/`): the files ARE the desired state — idempotent (re-run anytime, patches only diffs), versioned in git, `kubectl diff -f` shows the plan first. 3-WAY MERGE (last-applied annotation vs live vs new file): a field you DELETED from your file → apply sees it was in last-applied but not the new file → REMOVES it from the live object. A field ANOTHER ACTOR added directly → it was never in ANY version of your file → apply has no basis to touch it → KEPT. Why `apply` doesn\'t delete a removed file: `apply` only acts on the files it\'s GIVEN — it has no notion of a complete desired set, so it can\'t know a resource used to exist. Remove it explicitly (`kubectl delete`), or `--prune -l <tight-label>`, or use GitOps (Argo CD/Flux tracks the whole set and prunes).',
        hintHi: 'IMPERATIVE (`kubectl create`/`scale`/...): commands ka ek sequence; re-running fail hota hai; koi artifact nahi jo cluster ko kya hona chahiye bataye. DECLARATIVE (`kubectl apply -f ./k8s/`): files desired state HAIN — idempotent, git mein versioned, `kubectl diff -f` plan dikhata hai. 3-WAY MERGE: ek field jo aapne file se DELETE ki → apply ise REMOVE karta hai. Ek field jo DOOSRE ACTOR ne add ki → KEPT. `apply` ek removed file ko delete kyun nahi karta: `apply` sirf diye gaye files par act karta hai. Explicitly hataao (`kubectl delete`), ya `--prune -l`, ya GitOps.',
      },
    ],

    keyTakeaways: [
      'EVERY Kubernetes object has the SAME 4-part shape: `apiVersion` (the API group+version defining this kind — how the API evolves, `v1beta1`→`v1`), `kind` (WHAT it is), `metadata` (identity: `name`, `namespace`, `labels` selectors match on, `annotations`, + system-managed `uid`/`ownerReferences`/`resourceVersion`), `spec` (the DESIRED state — YOU write this, the apiserver validates it), `status` (the ACTUAL observed state — the CONTROLLER writes this, read-only to you: `readyReplicas`, `conditions: [{type, status, reason, message}]`). THE MODEL: you declare `spec`, the system reports `status`, a controller works forever to make status match spec.',
      'THE RECONCILIATION LOOP (every controller, forever): (1) WATCH the apiserver for its kind; (2) read DESIRED = `obj.spec`; (3) observe ACTUAL = the real world (child objects, node state, metrics); (4) compare — equal → do nothing; (5) else take ONE step toward desired (create/delete/update a child); (6) write observed reality into `obj.status`; (7) repeat (+ RESYNC on a timer every few min even with no events, so a bug/missed event can\'t leave things permanently wrong). Controllers DON\'T plan sequences — complex behaviour (a rolling update, a node drain, an autoscale) EMERGES from running this one-step loop repeatedly as the situation changes.',
      'LEVEL-TRIGGERED, not edge-triggered: a controller acts on the CURRENT STATE ("there are 2 Pods, I want 3"), NOT on the EVENT that changed it ("a Pod was deleted"). A missed event doesn\'t matter — the next observation sees the true gap and closes it. This is why K8s is SELF-CORRECTING and why `kubectl delete pod` is a safe fix: it changes actual state, the owning controller\'s next pass rebuilds the Pod CLEANLY from the desired spec (none of the old Pod\'s problems carry over). SELF-HEALING is NOT a feature — it\'s the ReplicaSet controller doing its ordinary compare-and-close-the-gap step when the gap was caused by a failure. COROLLARY: you CANNOT make a durable change by `kubectl edit`-ing a controller-managed child (a Pod owned by a ReplicaSet) — immutable fields reject it, mutable ones last only until the Pod is replaced (node failure / eviction / rollout) and rebuilt from the unchanged owner template. Edit the object that OWNS it (the Deployment); for fast single-container debugging use a throwaway `kubectl run --rm` Pod or `kubectl debug` ephemeral container.',
      'DECLARATIVE beats imperative for running systems. IMPERATIVE (`kubectl create`/`scale`/`set image`/`expose`) = a command sequence with state in shell history / a stale wiki; re-running fails ("already exists"); no artifact of intent; no code review. DECLARATIVE (`kubectl apply -f ./k8s/`) = the files ARE the desired state — idempotent (re-run anytime, patches only diffs), versioned in git, `kubectl diff -f` shows the plan first. This is what GitOps (Module 20) automates.',
      '`kubectl apply` computes a 3-WAY MERGE (the `last-applied-configuration` annotation vs the live object vs your new file): a field you DELETED from your file is REMOVED from the live object (it was in last-applied, not in the new file); a field ANOTHER ACTOR added directly is KEPT (it was never in any version of your file). Server-Side Apply is the newer mechanism with per-field ownership. But `apply` does NOT delete a resource whose FILE you removed — it only acts on the files it\'s GIVEN, with no notion of a complete desired set. Remove it explicitly (`kubectl delete -f`), or `kubectl apply --prune -l <tight-label>`, or use GitOps which tracks the whole set. INSPECT: `kubectl explain <kind>.spec.<field>` (the schema, works offline / no object needed), `kubectl get <kind> -o yaml` (spec + status), `kubectl describe` (status + EVENTS — where controllers narrate), `kubectl diff -f`, `kubectl get <kind> -w` (watch changes live).',
    ],
    keyTakeawaysHi: [
      'HAR Kubernetes object ki SAME 4-part shape hai: `apiVersion` (API group+version jo is kind ko define karta hai), `kind` (ye KYA hai), `metadata` (identity: `name`, `namespace`, `labels`, `annotations`, + system-managed fields), `spec` (DESIRED state — AAP ye likhte ho), `status` (ACTUAL observed state — CONTROLLER ye likhta hai, aapke liye read-only). MODEL: aap `spec` declare karte ho, system `status` report karta hai, ek controller forever kaam karta hai.',
      'RECONCILIATION LOOP (har controller, forever): (1) apiserver ko iske kind ke liye WATCH karo; (2) DESIRED padho = `obj.spec`; (3) ACTUAL observe karo = real world; (4) compare — equal → kuch mat karo; (5) warna desired ki taraf EK step lo; (6) observed reality ko `obj.status` mein likho; (7) repeat (+ timer par RESYNC). Controllers sequences PLAN nahi karte — complex behaviour is one-step loop ko repeatedly chalane se EMERGE hota hai.',
      'LEVEL-TRIGGERED, edge-triggered nahi: ek controller CURRENT STATE par act karta hai, EVENT par nahi. Ek missed event matter nahi karta. Isliye K8s SELF-CORRECTING hai aur `kubectl delete pod` ek safe fix hai. SELF-HEALING ek feature NAHI hai — ye ReplicaSet controller ka apna ordinary step hai. COROLLARY: aap ek controller-managed child ko `kubectl edit` karke ek durable change NAHI bana sakte — us object ko edit karo jo ise OWN karta hai (Deployment).',
      'DECLARATIVE running systems ke liye imperative se behtar hai. IMPERATIVE (`kubectl create`/`scale`/...) = ek command sequence; re-running fail hota hai; intent ka koi artifact nahi. DECLARATIVE (`kubectl apply -f ./k8s/`) = files desired state HAIN — idempotent, git mein versioned, `kubectl diff -f` pehle plan dikhata hai. Ye GitOps automate karta hai.',
      '`kubectl apply` ek 3-WAY MERGE compute karta hai: ek field jo aapne file se DELETE ki live object se REMOVE hoti hai; ek field jo DOOSRE ACTOR ne add ki KEPT rehti hai. Par `apply` ek resource ko DELETE NAHI karta jiski FILE aapne hataayi — ye sirf diye gaye files par act karta hai. Explicitly hataao, ya `--prune -l`, ya GitOps. INSPECT: `kubectl explain <kind>.spec.<field>` (offline), `kubectl get -o yaml`, `kubectl describe` (status + EVENTS), `kubectl diff -f`, `kubectl get -w`.',
    ],
  },
];
