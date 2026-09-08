/**
 * DevOps Complete Course — Module 9: Kubernetes — Scaling, Scheduling, Storage
 * & Production Ops, lessons 1-3.
 *
 * Lesson 1: Autoscaling — HPA, VPA & the Cluster Autoscaler; how metrics-server
 *           feeds the HPA loop, targets, scale behaviour/stabilisation, KEDA.
 *           VERIFIED against a real cluster (kind + metrics-server).
 * Lesson 2: Scheduling — the filter/score cycle, nodeSelector/affinity,
 *           pod (anti-)affinity, taints & tolerations, topologySpreadConstraints.
 *           VERIFIED.
 * Lesson 3: Disruptions — voluntary vs involuntary, PodDisruptionBudgets, drain
 *           & the eviction API, PriorityClass & preemption, graceful shutdown.
 *           VERIFIED.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_9: CourseLesson[] = [
  {
    slug: 'ops-autoscaling-hpa-vpa-and-the-cluster-autoscaler',
    title: 'Autoscaling — HPA, VPA & the Cluster Autoscaler',
    titleHi: 'Autoscaling — HPA, VPA & Cluster Autoscaler',
    description: 'Three autoscalers operate at different levels. The HorizontalPodAutoscaler changes how many Pods a workload has based on a metric; the VerticalPodAutoscaler changes each Pod\'s requests and limits; the Cluster Autoscaler adds and removes nodes when Pods cannot be scheduled. They compose, but the HPA and VPA must not fight over the same metric.',
    descriptionHi: 'Teen autoscalers alag levels par operate karte hain. HorizontalPodAutoscaler ek metric ke aadhaar par badalta hai ki ek workload ke paas kitne Pods hain; VerticalPodAutoscaler har Pod ke requests aur limits badalta hai; Cluster Autoscaler nodes add aur remove karta hai jab Pods schedule nahi ho sakte. Ye compose karte hain, par HPA aur VPA ko same metric par nahi ladna chahiye.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A call centre that scales three different ways.** When calls pile up, the floor manager opens more identical desks and routes calls across them — that is the **HorizontalPodAutoscaler**: same work, more copies, driven by a live signal (queue depth, CPU). Separately, a workforce analyst notices a particular role consistently needs a bigger monitor and a faster machine than it was given, and revises the standard equipment spec for that role — that is the **VerticalPodAutoscaler**: right-sizing each unit, not adding units. And when every desk in the building is full and there is nowhere to put desk number forty-one, facilities leases another floor; when a floor sits nearly empty for a while, they give it up — that is the **Cluster Autoscaler**: it changes the building, not the staffing, and only reacts to people who are standing around with nowhere to sit (unschedulable Pods).',
      hi: '**Ek call centre jo teen alag tarikon se scale karta hai.** Jab calls pile up hoti hain, floor manager zyada identical desks kholta hai aur calls unmein route karta hai — wo **HorizontalPodAutoscaler** hai: same kaam, zyada copies, ek live signal se driven. Alag se, ek workforce analyst notice karta hai ki ek particular role ko consistently ek bade monitor aur ek tez machine ki zaroorat hai, aur us role ke liye standard equipment spec revise karta hai — wo **VerticalPodAutoscaler** hai: har unit ko right-size karna, units add nahi karna. Aur jab building mein har desk bhara hai aur desk number iktalees rakhne ke liye kahin jagah nahi, facilities ek aur floor lease karti hai; jab ek floor thodi der ke liye lagbhag khaali baithta hai, wo ise chhod dete hain — wo **Cluster Autoscaler** hai: ye building badalta hai, staffing nahi.',
    },

    simple: `**THREE AUTOSCALERS, THREE LEVELS. they compose; HPA and VPA must not share a metric.**
\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: web }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: web }   # what to scale
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 60 }   # 60% of the CPU REQUEST
  behavior:                                # optional: shape how fast it reacts
    scaleUp:   { stabilizationWindowSeconds: 0,   policies: [ { type: Percent, value: 100, periodSeconds: 15 } ] }
    scaleDown: { stabilizationWindowSeconds: 300, policies: [ { type: Pods,    value: 1,   periodSeconds: 60 } ] }
\`\`\`

**HPA — HorizontalPodAutoscaler (more/fewer Pods):**
\`\`\`
- a control loop in the controller-manager, every ~15s:
    desiredReplicas = ceil( currentReplicas * currentMetric / targetMetric )
- READS METRICS from the metrics API: 'metrics-server' for cpu/memory (Utilization =
  % of the Pod's REQUEST — so a CPU request is MANDATORY), or a custom/external metrics
  adapter (Prometheus Adapter, KEDA) for RPS, queue depth, lag, ...
- edits the Deployment's '.spec.replicas' (the 'scale' subresource). the Deployment
  then does a normal rollout to the new count.
- scaleDown has a default 300s STABILISATION WINDOW (uses the highest recommendation
  over the window) so it doesn't flap; scaleUp reacts fast.
- NEVER set '.spec.replicas' in a manifest that an HPA targets — 'apply' fights the HPA.
\`\`\`

**VPA — VerticalPodAutoscaler (right-size requests/limits):** a separate add-on. Watches
real usage, recommends (and optionally auto-applies) new \`requests\`/\`limits\`. Applying a
change **recreates the Pod** (until in-place resize, KEP-1287, is GA). **Do not run VPA and
HPA on the same resource** — they chase each other. Common split: VPA for memory, HPA for CPU.

**CLUSTER AUTOSCALER (more/fewer nodes):** watches for Pods stuck **Pending** because no
node has room, and adds a node (via the cloud's node group / Karpenter); removes a node
that has been under-used and whose Pods fit elsewhere. Reacts to *unschedulable Pods*, not
to CPU. On managed clusters it is a component you enable, not something you install per se.

**KEDA** (event-driven autoscaling) extends the HPA with 60+ scalers (Kafka lag, SQS depth,
cron, Prometheus query, ...) and can scale **to zero** — the HPA alone cannot go below 1.`,

    simpleHi: `**TEEN AUTOSCALERS, TEEN LEVELS. ye compose karte hain; HPA aur VPA ko ek metric share nahi karna chahiye.**
\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: web }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: web }
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 60 }   # CPU REQUEST ka 60%
\`\`\`

**HPA (zyada/kam Pods):**
\`\`\`
- controller-manager mein ek control loop, har ~15s:
    desiredReplicas = ceil( currentReplicas * currentMetric / targetMetric )
- metrics API se METRICS PADHTA hai: cpu/memory ke liye 'metrics-server' (Utilization =
  Pod ke REQUEST ka % — to ek CPU request ZAROORI hai), ya ek custom/external metrics
  adapter (Prometheus Adapter, KEDA) RPS, queue depth, lag ke liye.
- Deployment ke '.spec.replicas' ko edit karta hai (scale subresource). Deployment phir
  naye count par ek normal rollout karta hai.
- scaleDown ka ek default 300s STABILISATION WINDOW hota hai; scaleUp fast react karta hai.
- ek HPA jo target karta hai us manifest mein KABHI '.spec.replicas' set mat karo.
\`\`\`

**VPA (requests/limits right-size karo):** ek alag add-on. Real usage watch karta hai,
naye \`requests\`/\`limits\` recommend (aur optionally auto-apply) karta hai. Ek change apply
karna **Pod ko recreate karta hai**. **VPA aur HPA ko same resource par mat chalao**.

**CLUSTER AUTOSCALER (zyada/kam nodes):** un Pods ke liye watch karta hai jo **Pending**
atke hain kyunki kisi node ke paas jagah nahi, aur ek node add karta hai; ek under-used
node remove karta hai. *Unschedulable Pods* par react karta hai, CPU par nahi.

**KEDA** (event-driven autoscaling) HPA ko 60+ scalers se extend karta hai (Kafka lag, SQS
depth, cron, ...) aur **zero tak** scale kar sakta hai — HPA akela 1 se neeche nahi ja sakta.`,

    content: `## The three autoscalers

Kubernetes autoscaling happens at three independent levels, and it helps to keep them straight:

| | changes | driven by | mechanism |
|---|---|---|---|
| **HorizontalPodAutoscaler** | replica **count** | a metric (CPU, memory, custom, external) | edits \`.spec.replicas\` |
| **VerticalPodAutoscaler** | each Pod's **requests/limits** | historical real usage | recreates Pods with new resources |
| **Cluster Autoscaler** | number of **nodes** | Pods stuck **Pending** | adds/removes nodes via the cloud |

They compose — an HPA adds Pods, those Pods do not fit, the Cluster Autoscaler adds a node — but the HPA and VPA must not target the same resource, or they will chase each other.

## HorizontalPodAutoscaler

The HPA is a control loop in the controller-manager that runs roughly every 15 seconds. Each cycle it:

1. **Reads the current metric** from the metrics API. For \`type: Resource\` (CPU or memory) this comes from **metrics-server**, a lightweight cluster add-on that scrapes the kubelet's summary API. \`Utilization\` is expressed as a **percentage of the Pod's request**, which is why a workload targeted by a CPU-utilization HPA **must** set a CPU request — with no request there is no denominator and the HPA reports \`<unknown>\` and does nothing. For \`type: Pods\` / \`type: External\` (requests per second, queue depth, consumer lag, messages in a topic) the number comes from a **custom or external metrics adapter** such as the Prometheus Adapter or KEDA.
2. **Computes the desired replica count**: \`desiredReplicas = ceil(currentReplicas × currentMetricValue / targetMetricValue)\`. A tolerance (default 10%) suppresses tiny adjustments.
3. **Writes the new count** to the target's \`scale\` subresource — for a Deployment, \`.spec.replicas\`. The Deployment controller then performs an ordinary rolling update to reach it.

### Behaviour tuning

The \`behavior\` block shapes reaction speed separately for up and down:

- **\`stabilizationWindowSeconds\`** — the HPA considers all recommendations over this window and picks the one that keeps the most Pods. For **scale-down** the default is **300 seconds**, which stops the replica count flapping when load is spiky. For **scale-up** the default is 0 — it reacts immediately.
- **\`policies\`** — rate limits: "at most +100% or +4 Pods every 15s", "at most −1 Pod every 60s".

### The manifest-replicas trap

If an HPA targets a Deployment, the HPA **owns** \`.spec.replicas\`. Leaving \`replicas: 3\` in the manifest and running \`kubectl apply\` (or Argo CD / Flux syncing) sets it back to 3 on every apply, and the HPA immediately corrects it — permanent churn. Remove \`replicas\` from any manifest that an HPA (or a GitOps controller plus an HPA) manages.

## VerticalPodAutoscaler

The VPA is a separate add-on (not built in) with three parts: a **recommender** that watches real CPU and memory usage and computes recommended requests, an **updater** that evicts Pods whose requests are far from the recommendation, and an **admission controller** that rewrites the requests on the recreated Pod. Modes are \`Off\` (recommend only — very useful just for the numbers), \`Initial\` (set on creation only), and \`Auto\` (actively evict and resize). Because changing a running Pod's requests currently means **recreating it**, \`Auto\` mode causes disruර්ption; in-place Pod resize (KEP-1287) removes this once it is generally available.

**VPA and HPA must not manage the same signal.** If both react to CPU, the VPA raises the request, which lowers the measured utilisation percentage, which makes the HPA scale in, which raises per-Pod load, which makes the VPA raise the request again. The standard safe split is VPA on memory and HPA on CPU or a custom metric, or VPA in \`Off\` mode purely for right-sizing guidance.

## Cluster Autoscaler

The Cluster Autoscaler operates on **nodes**. It watches for Pods that are **Pending** specifically because no node has enough allocatable room for their requests, and asks the cloud provider to add a node to the appropriate node group. It also finds nodes that have been under-utilised for a period and whose Pods could run elsewhere, drains them, and removes them. It reacts to **unschedulable Pods**, not to CPU graphs — which is why accurate requests matter: a Pod that requests far more than it uses makes the cluster scale out sooner than it needs to, and a Pod that requests too little can get a node evicted from under it. On AWS, **Karpenter** is a popular alternative that provisions right-sized nodes directly rather than scaling fixed node groups.

## KEDA and scaling to zero

A plain HPA cannot scale below \`minReplicas: 1\`. **KEDA** (Kubernetes Event-Driven Autoscaling) installs a component that manages an HPA for you and adds 60+ **scalers** — Kafka consumer lag, SQS/RabbitMQ queue depth, a Prometheus query, cron windows, cloud queue metrics — and, crucially, can scale a Deployment **to zero** when there is no work and back to one on the first event. For request-driven HTTP workloads, Knative fills a similar role.`,

    contentHi: `## Teen autoscalers

Kubernetes autoscaling teen independent levels par hoti hai:

| | badalta hai | driven by | mechanism |
|---|---|---|---|
| **HorizontalPodAutoscaler** | replica **count** | ek metric (CPU, memory, custom) | \`.spec.replicas\` edit karta hai |
| **VerticalPodAutoscaler** | har Pod ke **requests/limits** | historical real usage | naye resources ke saath Pods recreate karta hai |
| **Cluster Autoscaler** | **nodes** ki sankhya | Pods jo **Pending** atke hain | cloud ke through nodes add/remove karta hai |

Ye compose karte hain — ek HPA Pods add karta hai, wo Pods fit nahi hote, Cluster Autoscaler ek node add karta hai — par HPA aur VPA ko same resource target nahi karna chahiye.

## HorizontalPodAutoscaler

HPA controller-manager mein ek control loop hai jo lagbhag har 15 seconds chalta hai. Har cycle:
1. **Current metric padhta hai** metrics API se. \`type: Resource\` (CPU ya memory) ke liye ye **metrics-server** se aata hai. \`Utilization\` **Pod ke request ke ek percentage** ke roop mein express hota hai, isliye ek CPU-utilization HPA se targeted workload ko ek CPU request **zaroor** set karna chahiye — bina request ke koi denominator nahi hai aur HPA \`<unknown>\` report karta hai.
2. **Desired replica count compute karta hai**: \`desiredReplicas = ceil(currentReplicas × currentMetricValue / targetMetricValue)\`.
3. **Naya count likhta hai** target ke \`scale\` subresource par. Deployment controller phir ek ordinary rolling update karta hai.

### Behaviour tuning

\`behavior\` block up aur down ke liye alag reaction speed shape karta hai:
- **\`stabilizationWindowSeconds\`** — **scale-down** ke liye default **300 seconds** hai, jo load spiky hone par replica count ko flap hone se rokta hai. **scale-up** ke liye default 0 hai.
- **\`policies\`** — rate limits.

### Manifest-replicas trap

Agar ek HPA ek Deployment target karta hai, HPA \`.spec.replicas\` ko **own** karta hai. Manifest mein \`replicas: 3\` chhodna aur \`kubectl apply\` chalana ise har apply par 3 par wapas set karta hai — permanent churn. Kisi bhi manifest se \`replicas\` hatao jise ek HPA manage karta hai.

## VerticalPodAutoscaler

VPA ek alag add-on hai teen parts ke saath: ek **recommender**, ek **updater** jo un Pods ko evict karta hai jinke requests recommendation se door hain, aur ek **admission controller** jo recreated Pod par requests rewrite karta hai. Modes \`Off\` (sirf recommend), \`Initial\`, aur \`Auto\` hain. Kyunki ek running Pod ke requests badalne ka matlab currently ise **recreate karna** hai, \`Auto\` mode disruption causes karta hai.

**VPA aur HPA ko same signal manage nahi karna chahiye.** Agar dono CPU par react karte hain, VPA request badhaata hai, jo measured utilisation percentage kam karta hai, jo HPA ko scale in karvaata hai — ek loop. Standard safe split VPA memory par aur HPA CPU par hai.

## Cluster Autoscaler

Cluster Autoscaler **nodes** par operate karta hai. Un Pods ke liye watch karta hai jo **Pending** hain kyunki kisi node ke paas unke requests ke liye kaafi room nahi, aur cloud provider se ek node add karne ko kehta hai. Ye **unschedulable Pods** par react karta hai, CPU graphs par nahi — isliye accurate requests matter karte hain. AWS par, **Karpenter** ek popular alternative hai.

## KEDA aur zero tak scaling

Ek plain HPA \`minReplicas: 1\` se neeche scale nahi kar sakta. **KEDA** ek component install karta hai jo aapke liye ek HPA manage karta hai aur 60+ **scalers** add karta hai — Kafka consumer lag, SQS/RabbitMQ queue depth, ek Prometheus query, cron windows — aur, crucially, ek Deployment ko **zero tak** scale kar sakta hai jab koi kaam nahi hai.`,

    examples: [
      {
        title: 'An HPA scales a Deployment out under CPU load (metrics-server → the HPA loop)',
        titleHi: 'Ek HPA CPU load ke tahat ek Deployment ko scale out karta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m9l1-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

kubectl -n "$ns" apply -f - >/dev/null <<'YAML'
apiVersion: apps/v1
kind: Deployment
metadata: { name: php }
spec:
  replicas: 1
  selector: { matchLabels: { app: php } }
  template:
    metadata: { labels: { app: php } }
    spec:
      containers:
        - name: web
          image: registry.k8s.io/hpa-example      # each GET / burns ~150ms of CPU
          ports: [ { containerPort: 80 } ]
          resources: { requests: { cpu: 100m }, limits: { cpu: 250m } }
---
apiVersion: v1
kind: Service
metadata: { name: php }
spec: { selector: { app: php }, ports: [ { port: 80 } ] }
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: php }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: php }
  minReplicas: 1
  maxReplicas: 5
  behavior: { scaleUp: { stabilizationWindowSeconds: 0 } }
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 50 } }
YAML
kubectl -n "$ns" rollout status deploy/php --timeout=120s >/dev/null

echo "HPA: $(kubectl -n "$ns" get hpa php -o jsonpath='{.spec.minReplicas}-{.spec.maxReplicas} replicas, scale when avg CPU > {.spec.metrics[0].resource.target.averageUtilization}% of the request')"
echo "idle: $(kubectl -n "$ns" get deploy php -o jsonpath='{.status.replicas}') replica"

# sustained CPU load from 3 client Pods hammering the Service
kubectl -n "$ns" apply -f - >/dev/null <<'YAML'
apiVersion: apps/v1
kind: Deployment
metadata: { name: load }
spec:
  replicas: 3
  selector: { matchLabels: { app: load } }
  template:
    metadata: { labels: { app: load } }
    spec:
      containers:
        - name: c
          image: busybox:1.36
          command: [ "sh", "-c", "while true; do wget -q -O- http://php >/dev/null 2>&1; done" ]
YAML

hi=1
for i in $(seq 1 16); do
  r=$(kubectl -n "$ns" get deploy php -o jsonpath='{.status.replicas}')
  [ "\${r:-1}" -gt "$hi" ] && hi=$r
  [ "$hi" -ge 3 ] && break
  sleep 15
done
kubectl -n "$ns" delete deploy load --wait=false >/dev/null
[ "$hi" -ge 3 ] && echo "under load: the HPA scaled the Deployment UP toward its max (from the min of 1)"
echo "(after load stops, the HPA scales back in once its scaleDown stabilisation window - default 300s - passes.)"`,
        output: `HPA: 1-5 replicas, scale when avg CPU > 50% of the request
idle: 1 replica
under load: the HPA scaled the Deployment UP toward its max (from the min of 1)
(after load stops, the HPA scales back in once its scaleDown stabilisation window - default 300s - passes.)`,
        explain: 'A Deployment of one Pod runs an image where every HTTP request performs a fixed chunk of CPU-bound work, and it declares a CPU request of 100 millicores. An autoscaling/v2 HorizontalPodAutoscaler targets it with a range of one to five replicas and a goal of keeping average CPU at 50 percent of the request. At rest the Deployment sits at its minimum of one. Three client Pods are then started, each looping HTTP requests against the Service as fast as it can, which drives the single backend Pod far above its CPU request. The HPA control loop reads that utilisation from metrics-server every 15 seconds, computes that the current one replica at several hundred percent utilisation needs to become several replicas to bring the average down to 50 percent, and writes the higher number to the Deployment, which rolls out the new Pods. The loop records that the replica count climbed above the minimum while the load was applied. The scale-up path reacts within a cycle or two because its stabilisation window is zero; the scale-down path, not exercised here, waits out a 300-second stabilisation window by default so a brief lull does not immediately tear Pods down.',
        explainHi: 'Ek Pod ka ek Deployment ek image chalata hai jahan har HTTP request CPU-bound kaam ka ek fixed chunk perform karta hai, aur ye 100 millicores ka ek CPU request declare karta hai. Ek autoscaling/v2 HorizontalPodAutoscaler ise ek se paanch replicas ki range aur average CPU ko request ke 50 percent par rakhne ke goal ke saath target karta hai. Rest par Deployment apne minimum ek par baithta hai. Teen client Pods phir start hote hain, har ek Service ke against jitni tez ho sake HTTP requests loop karta hai, jo single backend Pod ko iske CPU request se kaafi upar drive karta hai. HPA control loop us utilisation ko metrics-server se har 15 seconds padhta hai, compute karta hai ki current ek replica ko kai replicas banna chahiye, aur higher number Deployment ko likhta hai. Scale-up path ek cycle ya do ke andar react karta hai; scale-down path default se ek 300-second stabilisation window wait karta hai.',
      },
      {
        title: 'A CPU-utilization HPA with no CPU request on the Pod reports <unknown> and never scales',
        titleHi: 'Ek CPU-utilization HPA bina Pod par CPU request ke <unknown> report karta hai aur kabhi scale nahi karta',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m9l1b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

# a Deployment with NO resources block at all
kubectl -n "$ns" create deployment web --image=registry.k8s.io/hpa-example --replicas=1 >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=120s >/dev/null

kubectl -n "$ns" apply -f - >/dev/null <<'YAML'
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: web }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: web }
  minReplicas: 1
  maxReplicas: 5
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 50 } }
YAML

sleep 45
echo "TARGETS column: $(kubectl -n "$ns" get hpa web --no-headers | sed -E 's/ +/ /g' | cut -d' ' -f4)"
echo "ScalingActive:  $(kubectl -n "$ns" get hpa web -o jsonpath='{.status.conditions[?(@.type=="ScalingActive")].status}') / $(kubectl -n "$ns" get hpa web -o jsonpath='{.status.conditions[?(@.type=="ScalingActive")].reason}')"
kubectl -n "$ns" describe hpa web 2>&1 | grep -oE 'the HPA was unable to compute the replica count.*missing request' | head -1
echo "-> Utilization is a % of the Pod's CPU REQUEST; with no request there is no denominator."`,
        output: `TARGETS column: <unknown>/50%
ScalingActive:  False / FailedGetResourceMetric
the HPA was unable to compute the replica count: failed to get cpu utilization: missing request
-> Utilization is a % of the Pod's CPU REQUEST; with no request there is no denominator.`,
        explain: 'The Deployment is created with no resources block, so its container has neither a CPU request nor a limit. A HorizontalPodAutoscaler is then pointed at it with a target of 50 percent CPU utilisation. Because Utilisation is defined as the ratio of measured CPU to the container\'s CPU request, and there is no request, the HPA has no denominator to divide by. Its status shows the target as unknown over fifty percent, its ScalingActive condition goes to false with the reason that it failed to get the resource metric, and the events spell out that the request for CPU is missing on the container. In this state the HPA is inert: it will never scale the Deployment up or down no matter what the real load is. The fix is simply to add a CPU request to the container. This is the single most common reason a freshly created HPA does nothing, and \`kubectl get hpa\` showing \`<unknown>\` in the targets column is the immediate tell.',
        explainHi: 'Deployment bina resources block ke create hota hai, to iske container ke paas na ek CPU request hai na ek limit. Ek HorizontalPodAutoscaler phir ise 50 percent CPU utilisation ke target ke saath point kiya jaata hai. Kyunki Utilisation measured CPU ka container ke CPU request se ratio define hota hai, aur koi request nahi hai, HPA ke paas divide karne ke liye koi denominator nahi hai. Iska status target ko unknown over fifty percent dikhaata hai, iski ScalingActive condition false ho jaati hai is reason ke saath ki ise resource metric nahi mila. Is state mein HPA inert hai: ye kabhi Deployment ko scale nahi karega chahe real load kuch bhi ho. Fix bas container par ek CPU request add karna hai. Ye ek freshly created HPA ke kuch na karne ka sabse common reason hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# leaving 'replicas:' in a manifest that an HPA also manages
# deployment.yaml (committed to git, synced by Argo CD):
spec:
  replicas: 3            # <-- and there is also an HPA with minReplicas: 3, maxReplicas: 30
# every 'kubectl apply' / Argo sync sets replicas back to 3;
# the HPA (which owns .spec.replicas) immediately re-scales to whatever load demands;
# Argo shows the Deployment as perpetually "OutOfSync"; you get scale-to-3 sawtooth spikes.`,
        right: `# an HPA OWNS .spec.replicas. remove it from the manifest entirely:
spec:
  # replicas: managed by the HorizontalPodAutoscaler - do NOT set here
  selector: { ... }
  template: { ... }
# for Argo CD, also ignore the field so it doesn't report drift:
#   spec.ignoreDifferences: [ { group: apps, kind: Deployment, jsonPointers: [ /spec/replicas ] } ]
# the HPA's minReplicas is now the effective floor.`,
        why: 'When a HorizontalPodAutoscaler targets a Deployment, it continuously writes the replica count to the Deployment\'s scale subresource, which is the same \`.spec.replicas\` field a manifest sets. If the manifest also specifies \`replicas\`, then every reconciliation of that manifest — a manual \`kubectl apply\`, or a GitOps controller syncing the desired state — resets the count to the hardcoded value, and the HPA, which is evaluating load on its own loop, overwrites it again within seconds. The result is a Deployment that oscillates between the manifest value and the load-appropriate value, a GitOps tool that never reports the resource as synced because the live replica count keeps diverging from git, and unnecessary Pod churn. The correct arrangement is to remove \`replicas\` from any manifest that an HPA manages so there is a single writer, and, for GitOps tools, to additionally tell them to ignore that field so live changes by the HPA are not treated as drift. The HPA\'s \`minReplicas\` then serves as the floor that \`replicas\` used to provide.',
        whyHi: 'Jab ek HorizontalPodAutoscaler ek Deployment target karta hai, ye continuously replica count ko Deployment ke scale subresource par likhta hai, jo wahi \`.spec.replicas\` field hai jo ek manifest set karta hai. Agar manifest bhi \`replicas\` specify karta hai, to us manifest ka har reconciliation — ek manual \`kubectl apply\`, ya ek GitOps controller — count ko hardcoded value par reset karta hai, aur HPA, jo apne loop par load evaluate kar raha hai, ise seconds ke andar dobara overwrite karta hai. Result ek Deployment hai jo manifest value aur load-appropriate value ke beech oscillate karta hai. Correct arrangement kisi bhi manifest se \`replicas\` hatana hai jise ek HPA manage karta hai.',
      },
      {
        wrong: `# running VPA in Auto mode AND an HPA, both on CPU
# VPA: updateMode Auto, resource cpu
# HPA: averageUtilization 70 on cpu
# the loop: high CPU -> HPA adds Pods AND VPA raises the CPU request ->
#   bigger request lowers the utilization % -> HPA scales back IN ->
#   fewer Pods -> per-Pod CPU rises -> VPA raises the request again -> ...
# replica count and Pod size both oscillate; Pods are recreated constantly.`,
        right: `# split the signals — never let HPA and VPA both act on the same resource:
#   HPA  on CPU  (or on a custom metric: RPS, queue depth, p95 latency)
#   VPA  on MEMORY only, OR VPA in updateMode: "Off" (recommendations only, applied by humans)
# a common production setup:
#   - HPA: scaleTargetRef=Deployment, metric = requests-per-second per Pod (Prometheus Adapter)
#   - VPA: updateMode Off, used monthly to right-size the memory request from the recommender
# the multidimensional autoscaler (in-place) is the future here; not GA yet.`,
        why: 'A HorizontalPodAutoscaler and a VerticalPodAutoscaler configured against the same resource form a feedback loop with opposite effects. The HPA drives utilisation toward its target by changing the number of Pods; the VPA drives it by changing each Pod\'s request. When CPU is high, the HPA adds Pods to spread the load, while the VPA independently raises the CPU request because it sees sustained high usage. A higher request lowers the measured utilisation percentage — the same absolute CPU is now a smaller fraction of a bigger request — so the HPA now sees low utilisation and removes Pods, concentrating load back onto fewer Pods, which the VPA responds to by raising the request further. Neither controller converges, the replica count and the Pod size both oscillate, and because applying a VPA change recreates the Pod, the workload churns continuously. The rule is that exactly one autoscaler may act on any given signal: use the HPA for the dimension you scale horizontally, typically CPU or a request-rate metric, and restrict the VPA to memory or to recommendation-only mode.',
        whyHi: 'Same resource ke against configured ek HorizontalPodAutoscaler aur ek VerticalPodAutoscaler opposite effects ke saath ek feedback loop banate hain. HPA utilisation ko iske target ki taraf Pods ki sankhya badalकर drive karta hai; VPA ise har Pod ke request badalकर drive karta hai. Jab CPU high hai, HPA load spread karne ke liye Pods add karta hai, jabki VPA independently CPU request badhaata hai. Ek higher request measured utilisation percentage kam karta hai — to HPA ab low utilisation dekhta hai aur Pods remove karta hai, load ko wapas fewer Pods par concentrate karte hue, jisppar VPA request aur badhaकर respond karta hai. Koi bhi controller converge nahi karta. Rule ye hai ki theek ek autoscaler kisi bhi diye gaye signal par act kar sakta hai.',
      },
      {
        wrong: `# expecting the Cluster Autoscaler to react to CPU / a dashboard
# "the nodes are at 85% CPU, why isn't the cluster autoscaler adding nodes?"
# it won't. it doesn't look at node CPU at all.
# also: Pods with NO requests -> the scheduler thinks they're free -> packs them onto
#   nodes that are actually full -> real OOM/CPU-starvation, and CA still sees "room".`,
        right: `# the Cluster Autoscaler reacts to UNSCHEDULABLE PODS, driven by REQUESTS:
#   - a Pod is Pending because no node has room for its requests -> CA adds a node
#   - a node is <50% utilised (by requests) for ~10m and its Pods fit elsewhere -> CA removes it
# so: set accurate requests on every Pod. that is what the scheduler and CA both use.
#   under-request -> nodes look full of "free" Pods, real starvation, no scale-up
#   over-request  -> cluster scales out earlier and larger than the real workload needs
# node CPU/memory dashboards are for humans; the CA math is 100% requests-based.`,
        why: 'The Cluster Autoscaler makes its decisions entirely from Pod resource requests and scheduling status, not from observed node utilisation. It scales the cluster up when it finds Pods that are Pending specifically because the scheduler could not fit their requests on any existing node, and it scales down when a node has been below a utilisation threshold — calculated from the sum of requests, not measured usage — for a sustained period and its Pods can be placed elsewhere. A node sitting at high actual CPU does not trigger a scale-up if the Pods on it are within their requested amounts, and conversely a node full of Pods that request far more than they use looks "full" to the autoscaler even though it is nearly idle. The practical consequence is that request accuracy is what makes cluster autoscaling behave: Pods that under-request let the scheduler overcommit a node into real resource starvation while the autoscaler still believes there is capacity, and Pods that over-request make the cluster add nodes and grow the bill ahead of real demand. Node dashboards remain useful for humans, but they are not an input to the autoscaler.',
        whyHi: 'Cluster Autoscaler apne decisions poori tarah Pod resource requests aur scheduling status se banata hai, observed node utilisation se nahi. Ye cluster ko scale up karta hai jab ise wo Pods milte hain jo Pending hain specifically kyunki scheduler unke requests ko kisi existing node par fit nahi kar saka, aur ye scale down karta hai jab ek node ek utilisation threshold ke neeche — requests ke sum se calculated, measured usage se nahi — ek sustained period ke liye raha hai. High actual CPU par baitha ek node ek scale-up trigger nahi karta agar us par Pods apne requested amounts ke andar hain. Practical consequence ye hai ki request accuracy wo hai jo cluster autoscaling ko behave karvaati hai.',
      },
    ],

    realWorld: [
      {
        en: '**A service that "wouldn\'t autoscale" for two sprints** — the HPA showed `cpu: <unknown>/70%` the whole time because a base-image bump had dropped the `resources.requests` block. Re-adding `requests.cpu` fixed it in one line; nobody had checked `kubectl get hpa`.',
        hi: '**Ek service jo do sprints ke liye "autoscale nahi hoti thi"** — HPA poore samay `cpu: <unknown>/70%` dikhaata tha kyunki ek base-image bump ne `resources.requests` block gira diya tha. `requests.cpu` dobara add karna.',
      },
      {
        en: '**A GitOps "OutOfSync" alert that fired every few minutes for a month** — the Deployment manifest still had `replicas: 4` and an HPA managed the same Deployment. Removing the field + an Argo `ignoreDifferences` on `/spec/replicas` silenced it.',
        hi: '**Ek GitOps "OutOfSync" alert jo ek mahine ke liye har kuch minute fire hota tha** — Deployment manifest mein abhi bhi `replicas: 4` tha aur ek HPA same Deployment manage karta tha. Field hatana + ek Argo `ignoreDifferences`.',
      },
      {
        en: '**A cluster that scaled to 60 nodes overnight then couldn\'t scale back** — a batch job\'s Pods requested `cpu: "4"` but used `~200m`; the Cluster Autoscaler added nodes for the requests and, because each node still looked "50% requested", never removed them. Right-sizing the request to `500m` cut the node count by 70%.',
        hi: '**Ek cluster jo raat mein 60 nodes tak scale hua phir wapas scale nahi kar saka** — ek batch job ke Pods ne `cpu: "4"` request kiya par `~200m` use kiya; Cluster Autoscaler ne requests ke liye nodes add kiye aur kabhi remove nahi kiye. Request ko `500m` par right-size karna.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through exactly how a CPU-based HorizontalPodAutoscaler decides to change the replica count.',
        qHi: 'Bilkul samjhao ki ek CPU-based HorizontalPodAutoscaler replica count badalne ka decision kaise leta hai.',
        a: 'The HPA is a control loop in the controller-manager that runs about every 15 seconds. Each iteration it reads the current CPU for every Pod of the target from the metrics API, which for CPU and memory is served by metrics-server scraping the kubelets. It expresses that as Utilisation, meaning the measured CPU as a percentage of the sum of the Pods\' CPU requests — so the target workload must declare a CPU request, or there is no denominator and the HPA reports the metric as unknown and does nothing. It then computes the desired replica count as the ceiling of the current replica count times the current metric value divided by the target metric value, with a small tolerance, default ten percent, that suppresses tiny changes. If the desired count differs, it writes it to the target\'s scale subresource, which for a Deployment is spec.replicas, and the Deployment controller performs a normal rolling update to reach it. The behavior block tunes reaction speed: scale-up has a zero-second stabilisation window by default so it reacts immediately, while scale-down has a 300-second window during which the HPA uses the highest recommendation seen, so a brief dip in load does not immediately remove Pods. minReplicas and maxReplicas bound the result, and because the HPA owns spec.replicas, that field must not also be set in the manifest.',
        aHi: 'HPA controller-manager mein ek control loop hai jo lagbhag har 15 seconds chalta hai. Har iteration ye target ke har Pod ke liye current CPU metrics API se padhta hai, jo CPU aur memory ke liye metrics-server dwara serve hota hai. Ye ise Utilisation ke roop mein express karta hai, matlab measured CPU Pods ke CPU requests ke sum ke ek percentage ke roop mein — to target workload ko ek CPU request declare karna chahiye. Ye phir desired replica count ko current replica count times current metric value divided by target metric value ki ceiling ke roop mein compute karta hai. Agar desired count alag hai, ye ise target ke scale subresource par likhta hai. behavior block reaction speed tune karta hai: scale-up ka default se ek zero-second stabilisation window hai, jabki scale-down ka ek 300-second window hai.',
      },
      {
        q: 'What is the difference between the HPA, the VPA, and the Cluster Autoscaler, and which can safely run together?',
        qHi: 'HPA, VPA, aur Cluster Autoscaler mein kya farak hai, aur kaunse safely saath chal sakte hain?',
        a: 'They act at three levels. The HorizontalPodAutoscaler changes the number of Pod replicas of a workload based on a metric — CPU or memory from metrics-server, or a custom or external metric like requests per second or queue depth through an adapter — by editing the target\'s replica count. The VerticalPodAutoscaler changes each Pod\'s CPU and memory requests and limits based on observed historical usage, and applying a change currently recreates the Pod. The Cluster Autoscaler changes the number of nodes: it adds a node when Pods are Pending because their requests do not fit anywhere, and removes a node that has been under-utilised by request sum and whose Pods can move. The HPA and the Cluster Autoscaler compose naturally and are almost always run together — the HPA adds Pods, and if they do not fit the Cluster Autoscaler adds a node. The HPA and the VPA must not both act on the same resource, because the VPA raising a request lowers the utilisation percentage the HPA reads, and they oscillate; the safe combination is the HPA on CPU or a custom metric and the VPA on memory only, or the VPA in recommendation-only mode. The VPA and the Cluster Autoscaler coexist fine.',
        aHi: 'Ye teen levels par act karte hain. HorizontalPodAutoscaler ek metric ke aadhaar par ek workload ke Pod replicas ki sankhya badalta hai. VerticalPodAutoscaler observed historical usage ke aadhaar par har Pod ke CPU aur memory requests aur limits badalta hai, aur ek change apply karna currently Pod ko recreate karta hai. Cluster Autoscaler nodes ki sankhya badalta hai: ye ek node add karta hai jab Pods Pending hain kyunki unke requests kahin fit nahi hote. HPA aur Cluster Autoscaler naturally compose karte hain aur lagbhag hamesha saath chalते hain. HPA aur VPA ko same resource par act nahi karna chahiye, kyunki VPA ka ek request badhana HPA jo utilisation percentage padhta hai ise kam karta hai, aur ye oscillate karte hain. VPA aur Cluster Autoscaler theek coexist karते hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write the HPA replica formula and list every reason a newly created CPU HPA might sit doing nothing.',
        taskHi: 'Ek comment mein, HPA replica formula likho aur har reason list karo ki ek naya CPU HPA kuch na kare.',
        hint: 'FORMULA: `desiredReplicas = ceil( currentReplicas * currentMetricValue / targetMetricValue )`, clamped to `[minReplicas, maxReplicas]`, with a ~10% tolerance that suppresses tiny changes. The loop runs ~every 15s in the controller-manager. WHY A NEW CPU HPA DOES NOTHING: (1) **no CPU `request` on the container** — `Utilization` is `measuredCPU / sum(requests)`; no request → no denominator → `kubectl get hpa` shows `cpu: <unknown>/50%`, `ScalingActive=False / FailedGetResourceMetric`. THE #1 cause. (2) **metrics-server not installed / not ready** — same `<unknown>`; check `kubectl top pods` works. (3) load simply isn\'t crossing the target (utilisation genuinely below the threshold). (4) already at `maxReplicas` (scale-up) or `minReplicas` (scale-down). (5) inside the **scaleDown stabilisation window** (default 300s) — it\'s using the highest recent recommendation, so it waits. (6) `.spec.replicas` still in the manifest and a GitOps/`kubectl apply` loop keeps resetting it, fighting the HPA. (7) the target ref is wrong (name/kind/apiVersion mismatch) → `AbleToScale=False`.',
        hintHi: 'FORMULA: `desiredReplicas = ceil( currentReplicas * currentMetricValue / targetMetricValue )`, `[minReplicas, maxReplicas]` tak clamped, ~10% tolerance ke saath. Loop controller-manager mein ~har 15s chalta hai. KYUN EK NAYA CPU HPA KUCH NAHI KARTA: (1) **container par koi CPU `request` nahi** — `Utilization` `measuredCPU / sum(requests)` hai; koi request nahi → koi denominator nahi → `kubectl get hpa` `cpu: <unknown>/50%` dikhaata hai. #1 cause. (2) **metrics-server install nahi / ready nahi** — same `<unknown>`. (3) load target cross nahi kar raha. (4) pehle se `maxReplicas` par. (5) **scaleDown stabilisation window** ke andar (default 300s). (6) `.spec.replicas` abhi bhi manifest mein aur ek GitOps loop ise reset karta rehta hai. (7) target ref galat hai.',
      },
      {
        task: 'In a comment, explain why an HPA and a VPA must not both act on CPU, tracing the oscillation step by step, and give the standard safe split.',
        taskHi: 'Ek comment mein, samjhao ki ek HPA aur ek VPA dono CPU par act kyun nahi karne chahiye.',
        hint: 'Both drive CPU utilisation toward a target but with OPPOSITE levers: the HPA changes the Pod COUNT, the VPA changes each Pod\'s REQUEST. OSCILLATION: (1) CPU is high → HPA adds Pods to spread load, AND independently the VPA sees sustained high usage and RAISES the cpu request; (2) a bigger request means the same absolute CPU is now a SMALLER fraction of the request → measured `Utilization%` drops; (3) the HPA now sees low utilisation → scales IN (removes Pods); (4) fewer Pods → per-Pod CPU rises again → VPA raises the request further → back to (2). Neither converges; replica count AND Pod size both flap; and because a VPA change RECREATES the Pod (until in-place resize / KEP-1287 is GA), the workload churns constantly. SAFE SPLIT: exactly one autoscaler per signal. HPA on CPU (or a custom metric — RPS, queue depth, p95 latency); VPA on MEMORY only, OR VPA in `updateMode: "Off"` (recommendations only, a human applies them, e.g. monthly right-sizing). HPA + Cluster Autoscaler compose fine; VPA + Cluster Autoscaler compose fine.',
        hintHi: 'Dono CPU utilisation ko ek target ki taraf drive karte hain par OPPOSITE levers ke saath: HPA Pod COUNT badalta hai, VPA har Pod ka REQUEST badalta hai. OSCILLATION: (1) CPU high → HPA Pods add karta hai, AUR VPA cpu request BADHAATA hai; (2) ek bada request matlab same absolute CPU ab request ka ek CHHOTA fraction hai → `Utilization%` girta hai; (3) HPA ab low utilisation dekhta hai → scale IN karta hai; (4) fewer Pods → per-Pod CPU phir badhta hai → VPA request aur badhaata hai → wapas (2). Koi converge nahi karta. SAFE SPLIT: per signal theek ek autoscaler. HPA CPU par (ya ek custom metric); VPA sirf MEMORY par, YA VPA `updateMode: "Off"` mein.',
      },
      {
        task: 'In a comment, describe what the Cluster Autoscaler actually reacts to (and does not), and why accurate Pod requests are what make it work.',
        taskHi: 'Ek comment mein, batao ki Cluster Autoscaler actually kis par react karta hai.',
        hint: 'The Cluster Autoscaler operates on NODES and its math is 100% based on Pod `requests` + scheduling status — it does NOT look at node CPU/memory dashboards at all. SCALE UP: a Pod is `Pending` specifically because the scheduler could not fit its `requests` on ANY existing node → the CA asks the cloud node group (or Karpenter) to add a node. SCALE DOWN: a node has been below a utilisation threshold (sum of `requests`, NOT measured usage) for ~10 min AND all its Pods can be rescheduled elsewhere → the CA drains and removes it. WHY REQUESTS MUST BE ACCURATE: under-request → the scheduler packs "free-looking" Pods onto a node that is actually full → real CPU starvation / OOM while the CA still thinks there is capacity and won\'t scale up. Over-request → nodes look "full" of Pods that are actually idle → the CA adds nodes and grows the bill ahead of real demand, and never scales back down because every node still looks "50% requested". Node dashboards are for humans; requests are the autoscaler\'s only input. (AWS: Karpenter provisions right-sized nodes directly instead of scaling fixed groups.)',
        hintHi: 'Cluster Autoscaler NODES par operate karta hai aur iski math 100% Pod `requests` + scheduling status par based hai — ye node CPU/memory dashboards bilkul nahi dekhta. SCALE UP: ek Pod `Pending` hai specifically kyunki scheduler iske `requests` ko KISI existing node par fit nahi kar saka → CA ek node add karta hai. SCALE DOWN: ek node ~10 min ke liye ek utilisation threshold (`requests` ka sum, measured usage NAHI) ke neeche raha AUR iske saare Pods kahin aur reschedule ho sakte hain → CA ise remove karta hai. KYUN REQUESTS ACCURATE HONE CHAHIYE: under-request → scheduler ek node ko overcommit karta hai → real starvation jabki CA sochta hai capacity hai. Over-request → nodes "full" dikhte hain jabki idle → CA nodes add karta hai demand se pehle.',
      },
    ],

    keyTakeaways: [
      'THREE AUTOSCALERS, THREE LEVELS: HPA changes the replica COUNT (metric-driven, edits `.spec.replicas`); VPA changes each Pod\'s REQUESTS/LIMITS (usage-driven, recreates the Pod to apply); CLUSTER AUTOSCALER changes the number of NODES (reacts to `Pending` Pods, via the cloud node group / Karpenter). HPA + Cluster Autoscaler compose and are nearly always run together. HPA + VPA must NOT act on the same resource.',
      'HPA MECHANICS: a controller-manager loop, ~every 15s: `desiredReplicas = ceil(currentReplicas * currentMetric / targetMetric)`, clamped to `[minReplicas, maxReplicas]`, ~10% tolerance. Reads cpu/memory from METRICS-SERVER; `Utilization` = % of the Pod\'s REQUEST → **a CPU request is MANDATORY** or the HPA shows `cpu: <unknown>/X%` and does nothing (the #1 "my HPA won\'t scale" cause). Custom/external metrics (RPS, queue depth, lag) need an adapter (Prometheus Adapter, KEDA).',
      'HPA `behavior`: scale-UP has a 0s stabilisation window by default (reacts fast); scale-DOWN has a 300s window (uses the highest recent recommendation → won\'t flap on a brief lull). `policies` rate-limit the change (e.g. +100%/15s, -1 Pod/60s). THE MANIFEST TRAP: an HPA OWNS `.spec.replicas` — leaving `replicas:` in a manifest that `kubectl apply` / Argo CD re-syncs causes permanent sawtooth churn + perpetual "OutOfSync". Remove the field; add an Argo `ignoreDifferences` on `/spec/replicas`.',
      'VPA (separate add-on): recommender + updater + admission controller. Modes `Off` (recommend only — useful just for the numbers), `Initial`, `Auto` (evict + resize → disruptive until in-place resize / KEP-1287 is GA). VPA + HPA on the SAME signal (both on CPU) OSCILLATE: VPA raises the request → utilisation % drops → HPA scales in → per-Pod load rises → VPA raises the request again. Safe split: HPA on CPU / a custom metric, VPA on MEMORY only (or `Off`).',
      'CLUSTER AUTOSCALER is 100% REQUESTS-BASED, not node dashboards: scales UP on Pods `Pending` because their requests fit nowhere; scales DOWN on a node under a request-sum threshold for ~10m whose Pods can move. So request accuracy is everything — under-request → real starvation while the CA sees "capacity"; over-request → nodes added ahead of demand + never removed. KEDA extends the HPA with 60+ event scalers (Kafka lag, SQS depth, cron, PromQL) and can scale TO ZERO (a plain HPA can\'t go below `minReplicas: 1`).',
    ],
    keyTakeawaysHi: [
      'TEEN AUTOSCALERS, TEEN LEVELS: HPA replica COUNT badalta hai (metric-driven, `.spec.replicas` edit karta hai); VPA har Pod ke REQUESTS/LIMITS badalta hai (usage-driven, apply karne ke liye Pod recreate karta hai); CLUSTER AUTOSCALER NODES ki sankhya badalta hai (`Pending` Pods par react karta hai). HPA + Cluster Autoscaler compose karte hain. HPA + VPA ko same resource par act NAHI karna chahiye.',
      'HPA MECHANICS: ek controller-manager loop, ~har 15s: `desiredReplicas = ceil(currentReplicas * currentMetric / targetMetric)`, `[minReplicas, maxReplicas]` tak clamped. cpu/memory METRICS-SERVER se padhta hai; `Utilization` = Pod ke REQUEST ka % → **ek CPU request ZAROORI hai** ya HPA `cpu: <unknown>/X%` dikhaata hai aur kuch nahi karta (#1 "mera HPA scale nahi karta" cause).',
      'HPA `behavior`: scale-UP ka default se ek 0s stabilisation window hai (fast react karta hai); scale-DOWN ka ek 300s window hai (highest recent recommendation use karta hai). MANIFEST TRAP: ek HPA `.spec.replicas` ko OWN karta hai — ek manifest mein `replicas:` chhodna jise `kubectl apply` / Argo CD re-sync karta hai permanent sawtooth churn causes karta hai. Field hatao.',
      'VPA (alag add-on): recommender + updater + admission controller. Modes `Off` (sirf recommend), `Initial`, `Auto` (evict + resize → disruptive). VPA + HPA SAME signal par OSCILLATE karte hain: VPA request badhaata hai → utilisation % girta hai → HPA scale in karta hai → per-Pod load badhta hai → VPA request phir badhaata hai. Safe split: HPA CPU par, VPA sirf MEMORY par (ya `Off`).',
      'CLUSTER AUTOSCALER 100% REQUESTS-BASED hai, node dashboards nahi: Pods `Pending` hone par scale UP karta hai kyunki unke requests kahin fit nahi; ek node par scale DOWN karta hai jo ~10m ke liye ek request-sum threshold ke neeche hai. To request accuracy sab kuch hai. KEDA HPA ko 60+ event scalers se extend karta hai aur ZERO tak scale kar sakta hai (ek plain HPA `minReplicas: 1` se neeche nahi ja sakta).',
    ],
  },

  {
    slug: 'ops-scheduling-affinity-taints-and-tolerations',
    title: 'Scheduling — Affinity, Taints & Tolerations',
    titleHi: 'Scheduling — Affinity, Taints & Tolerations',
    description: 'The scheduler places each Pod by running two phases: filter out every node that cannot run it, then score the survivors and pick the best. nodeSelector and affinity express where a Pod wants to go; taints let a node repel Pods that do not explicitly tolerate it; topology spread keeps replicas from clustering on one node or zone.',
    descriptionHi: 'Scheduler har Pod ko do phases chalाकर place karta hai: har node ko filter out karo jo ise nahi chala sakta, phir survivors ko score karo aur best chuno. nodeSelector aur affinity express karte hain ki ek Pod kahan jaana chahta hai; taints ek node ko un Pods ko repel karne dete hain jo ise explicitly tolerate nahi karte; topology spread replicas ko ek node ya zone par clustering se rokta hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Seating guests at a wedding.** The planner works in two passes. First a hard filter: this table is nut-free only, that section is wheelchair-accessible, the head table seats exactly eight — any seat that breaks a hard rule is off the list entirely (**filtering** on requests, nodeSelector, required affinity, taints). Then, among the seats that remain, a soft score: put people near friends, spread the loud uncle away from the elderly relatives, balance each table (**scoring** on preferred affinity, spread, least-loaded). **Taints** are a table that has put up a "reserved — bridal party only" sign: you cannot sit there unless your place card specifically says bridal party (a matching **toleration**). And a **topology spread constraint** is the rule "don\'t seat all the groom\'s college friends at one table" — distribute them so one table going home early doesn\'t empty a whole friend group.',
      hi: '**Ek shaadi mein guests ko bithana.** Planner do passes mein kaam karta hai. Pehle ek hard filter: ye table sirf nut-free hai, wo section wheelchair-accessible hai, head table theek aath ke liye hai — koi bhi seat jo ek hard rule todती hai poori tarah list se bahar hai (**filtering** requests, nodeSelector, required affinity, taints par). Phir, bachi hui seats mein, ek soft score: logon ko doston ke paas rakho, har table balance karo (**scoring** preferred affinity, spread, least-loaded par). **Taints** ek table hai jisne ek "reserved — bridal party only" sign lagaya hai: aap wahan nahi baith sakte jab tak aapka place card specifically bridal party na kahे (ek matching **toleration**). Aur ek **topology spread constraint** ye rule hai "groom ke saare college friends ko ek table par mat bithao".',
    },

    simple: `**THE SCHEDULER: for each pending Pod, FILTER nodes, then SCORE the survivors, then bind.**
\`\`\`yaml
spec:
  # 1. nodeSelector — the simplest hard requirement (exact label match)
  nodeSelector: { disktype: ssd }

  # 2. affinity — richer rules
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:      # HARD (filter)
        nodeSelectorTerms:
          - matchExpressions: [ { key: topology.kubernetes.io/zone, operator: In, values: [ us-east-1a, us-east-1b ] } ]
      preferredDuringSchedulingIgnoredDuringExecution:      # SOFT (score), weight 1-100
        - weight: 80
          preference: { matchExpressions: [ { key: node.kubernetes.io/instance-type, operator: In, values: [ c6i.large ] } ] }
    podAntiAffinity:                                        # keep replicas apart
      preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 100
          podAffinityTerm:
            labelSelector: { matchLabels: { app: web } }
            topologyKey: kubernetes.io/hostname             # "not on the same node"

  # 3. tolerations — permission to land on a tainted node
  tolerations:
    - { key: dedicated, operator: Equal, value: gpu, effect: NoSchedule }

  # 4. topologySpreadConstraints — even distribution
  topologySpreadConstraints:
    - maxSkew: 1
      topologyKey: topology.kubernetes.io/zone
      whenUnsatisfiable: DoNotSchedule       # or ScheduleAnyway (best-effort)
      labelSelector: { matchLabels: { app: web } }
\`\`\`

**TAINTS live on the NODE; TOLERATIONS live on the POD:**
\`\`\`
kubectl taint nodes node1 dedicated=gpu:NoSchedule
  effect NoSchedule        — don't schedule new Pods here unless they tolerate it
  effect PreferNoSchedule  — soft: avoid if possible
  effect NoExecute         — also EVICT running Pods that don't tolerate it (with an
                             optional tolerationSeconds grace period)
a Pod with NO matching toleration is simply never placed on that node.
control-plane nodes are tainted 'node-role.kubernetes.io/control-plane:NoSchedule' by default.
\`\`\`

**AFFINITY (Pod chooses node) vs TAINT (node repels Pod) — you usually want BOTH** for a
dedicated pool: taint the nodes so only tolerating Pods land, AND add node affinity so those
Pods *only* go there (a toleration alone doesn't force it).

**\`required\` = filter (Pending forever if unmet). \`preferred\` = score (best-effort, still schedules).**
The \`IgnoredDuringExecution\` half means: once a Pod is running, later label changes don't move it.`,

    simpleHi: `**SCHEDULER: har pending Pod ke liye, nodes FILTER karo, phir survivors SCORE karo, phir bind karo.**
\`\`\`yaml
spec:
  # 1. nodeSelector — sabse simple hard requirement (exact label match)
  nodeSelector: { disktype: ssd }

  # 2. affinity — richer rules
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:      # HARD (filter)
        nodeSelectorTerms:
          - matchExpressions: [ { key: topology.kubernetes.io/zone, operator: In, values: [ us-east-1a ] } ]
      preferredDuringSchedulingIgnoredDuringExecution:      # SOFT (score), weight 1-100
        - weight: 80
          preference: { matchExpressions: [ { key: node.kubernetes.io/instance-type, operator: In, values: [ c6i.large ] } ] }
    podAntiAffinity:                                        # replicas ko alag rakho
      preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 100
          podAffinityTerm:
            labelSelector: { matchLabels: { app: web } }
            topologyKey: kubernetes.io/hostname             # "same node par nahi"

  # 3. tolerations — ek tainted node par land karne ki permission
  tolerations:
    - { key: dedicated, operator: Equal, value: gpu, effect: NoSchedule }

  # 4. topologySpreadConstraints — even distribution
  topologySpreadConstraints:
    - maxSkew: 1
      topologyKey: topology.kubernetes.io/zone
      whenUnsatisfiable: DoNotSchedule       # ya ScheduleAnyway (best-effort)
      labelSelector: { matchLabels: { app: web } }
\`\`\`

**TAINTS NODE par rehti hain; TOLERATIONS POD par:**
\`\`\`
kubectl taint nodes node1 dedicated=gpu:NoSchedule
  effect NoSchedule        — naye Pods yahan schedule mat karo jab tak wo tolerate na karein
  effect PreferNoSchedule  — soft: possible ho to avoid karo
  effect NoExecute         — running Pods ko bhi EVICT karo jo tolerate nahi karte
ek Pod bina matching toleration ke us node par kabhi place nahi hota.
control-plane nodes default se tainted hote hain.
\`\`\`

**AFFINITY (Pod node chunta hai) vs TAINT (node Pod ko repel karta hai) — aap usually DONO
chahte ho** ek dedicated pool ke liye: nodes ko taint karo taaki sirf tolerating Pods land
karein, AUR node affinity add karo taaki wo Pods *sirf* wahan jaayein.

**\`required\` = filter (unmet ho to Pending forever). \`preferred\` = score (best-effort, phir bhi schedule hota hai).**`,

    content: `## How the scheduler places a Pod

The scheduler watches for Pods with no \`nodeName\` set. For each one it runs a two-phase cycle:

1. **Filtering (predicates).** Eliminate every node that *cannot* run the Pod: not enough allocatable CPU/memory for the Pod's **requests**, a \`nodeSelector\` or **required** node affinity that does not match the node's labels, a **taint** the Pod does not tolerate, no free host port the Pod needs, a volume that cannot attach in the node's zone, and so on. If zero nodes survive, the Pod stays **Pending** with a \`FailedScheduling\` event listing why each node was rejected.
2. **Scoring (priorities).** Rank the surviving nodes 0–100 across several plugins — spread across zones, **preferred** affinity, least-requested or most-requested (bin-packing), image locality (the node already has the image), inter-Pod affinity — combine the weighted scores, and pick the highest. Ties are broken randomly.
3. **Binding.** Write \`nodeName\` onto the Pod. The kubelet on that node then starts it.

Everything below is just different ways to influence phase 1 (hard) or phase 2 (soft).

## nodeSelector and node affinity

\`nodeSelector\` is a map of label key/values that a node must have — the simplest hard rule. **Node affinity** generalises it:

- **\`requiredDuringSchedulingIgnoredDuringExecution\`** — a hard filter. Supports operators \`In\`, \`NotIn\`, \`Exists\`, \`DoesNotExist\`, \`Gt\`, \`Lt\`. If nothing matches, the Pod is Pending indefinitely.
- **\`preferredDuringSchedulingIgnoredDuringExecution\`** — a list of soft preferences, each with a \`weight\` of 1–100 added to the node's score if it matches. The Pod still schedules somewhere if no preferred node is available.

The \`IgnoredDuringExecution\` suffix means the rule is only evaluated at scheduling time; relabelling a node later does not evict Pods already running on it. (A \`RequiredDuringExecution\` variant that *would* evict is a long-standing proposal, not implemented.)

## Inter-Pod affinity and anti-affinity

These place a Pod relative to *other Pods* rather than to node labels, using a \`topologyKey\` — a node label that defines the domain ("same node", "same zone"):

- **\`podAffinity\`** — schedule me near Pods matching this selector (co-locate a cache with its app).
- **\`podAntiAffinity\`** — schedule me *away* from Pods matching this selector. The classic use is \`topologyKey: kubernetes.io/hostname\` with a selector for the workload's own label, so replicas land on different nodes and a single node failure does not take out the whole service. Use \`preferred\` unless you have more nodes than replicas, or the Pods will be Pending.

Required inter-Pod affinity is expensive to evaluate on large clusters — prefer \`preferred\`, or **topology spread constraints**, which were designed to replace most anti-affinity use.

## Taints and tolerations

A **taint** is set on a node and repels Pods; a **toleration** is set on a Pod and lets it ignore a specific taint. This is the inverse of affinity: affinity is a Pod choosing nodes, a taint is a node rejecting Pods.

\`\`\`
kubectl taint nodes node1 dedicated=gpu:NoSchedule
\`\`\`

Three effects:

- **\`NoSchedule\`** — the scheduler will not place a new Pod here unless it tolerates the taint.
- **\`PreferNoSchedule\`** — a soft version; the scheduler avoids the node if it can.
- **\`NoExecute\`** — as \`NoSchedule\`, and additionally **evicts** already-running Pods that do not tolerate it. A toleration can set \`tolerationSeconds\` to stay for a grace period before eviction — this is how the node controller handles a node going \`NotReady\` (Pods are tainted \`node.kubernetes.io/not-ready:NoExecute\` and evicted after, by default, 300 seconds).

Kubernetes taints nodes automatically: control-plane nodes get \`node-role.kubernetes.io/control-plane:NoSchedule\`, and a node under memory or disk pressure, or not ready, gets the corresponding \`NoExecute\` / \`NoSchedule\` taint.

### Dedicated node pools need a taint *and* affinity

To reserve a pool of nodes (GPU nodes, a tenant's nodes) for specific workloads you need **both**: taint the nodes so untolerating Pods are kept off, **and** give the intended Pods node affinity for the pool's label so they are kept *on* it. A toleration alone only grants permission to land there — it does not stop the Pod being scheduled onto an ordinary node instead.

## Topology spread constraints

\`topologySpreadConstraints\` control how evenly a set of Pods is distributed across a topology domain:

- **\`topologyKey\`** — the node label defining the domain (\`kubernetes.io/hostname\`, \`topology.kubernetes.io/zone\`).
- **\`maxSkew\`** — the maximum allowed difference between the most-populated and least-populated domain.
- **\`whenUnsatisfiable\`** — \`DoNotSchedule\` (hard: stay Pending rather than break the skew) or \`ScheduleAnyway\` (soft: prefer to satisfy it, but schedule regardless).
- **\`labelSelector\`** — which Pods are counted toward the skew.

This is the modern, cheaper way to say "spread my replicas across zones and nodes" and largely replaces \`preferred\` pod anti-affinity for that purpose. Kubernetes also applies default cluster-level spread constraints for hostname and zone unless you override them.

## PriorityClass and preemption

A **PriorityClass** assigns an integer priority to a Pod. When a high-priority Pod is Pending and cannot be scheduled, the scheduler may **preempt** — evict — lower-priority Pods on a node to make room, respecting their PodDisruptionBudgets and grace periods where possible. This is how you guarantee that critical system workloads or paying-customer traffic win a capacity crunch over batch jobs. \`preemptionPolicy: Never\` makes a Pod high-priority for queue ordering but unwilling to evict others.`,

    contentHi: `## Scheduler ek Pod ko kaise place karta hai

Scheduler un Pods ke liye watch karta hai jinka koi \`nodeName\` set nahi hai. Har ek ke liye ye ek do-phase cycle chalata hai:
1. **Filtering (predicates).** Har node ko eliminate karo jo Pod ko *nahi* chala sakta: Pod ke **requests** ke liye kaafi allocatable CPU/memory nahi, ek \`nodeSelector\` ya **required** node affinity jo node ke labels se match nahi karta, ek **taint** jise Pod tolerate nahi karta. Agar zero nodes bachte hain, Pod **Pending** rehta hai.
2. **Scoring (priorities).** Bache hue nodes ko 0-100 rank karo kai plugins mein — zones mein spread, **preferred** affinity, least-requested ya most-requested (bin-packing), image locality — weighted scores combine karo, aur highest chuno.
3. **Binding.** Pod par \`nodeName\` likho.

## nodeSelector aur node affinity

\`nodeSelector\` label key/values ka ek map hai jo ek node ke paas hone chahiye. **Node affinity** ise generalise karta hai:
- **\`requiredDuringSchedulingIgnoredDuringExecution\`** — ek hard filter. Agar kuch match nahi karta, Pod indefinitely Pending hai.
- **\`preferredDuringSchedulingIgnoredDuringExecution\`** — soft preferences ki ek list, har ek ek \`weight\` 1-100 ke saath.

\`IgnoredDuringExecution\` suffix ka matlab hai rule sirf scheduling time par evaluate hota hai; ek node ko baad mein relabel karna us par already running Pods ko evict nahi karta.

## Inter-Pod affinity aur anti-affinity

Ye ek Pod ko node labels ke bajaay *doosre Pods* ke relative place karte hain, ek \`topologyKey\` use karके:
- **\`podAffinity\`** — is selector se matching Pods ke paas schedule karo.
- **\`podAntiAffinity\`** — is selector se matching Pods se *door* schedule karo. Classic use \`topologyKey: kubernetes.io/hostname\` hai workload ke apne label ke selector ke saath, taaki replicas alag nodes par land karein.

## Taints aur tolerations

Ek **taint** ek node par set hota hai aur Pods ko repel karta hai; ek **toleration** ek Pod par set hota hai. Ye affinity ka inverse hai.

Teen effects:
- **\`NoSchedule\`** — scheduler yahan ek naya Pod place nahi karega jab tak wo taint tolerate na kare.
- **\`PreferNoSchedule\`** — ek soft version.
- **\`NoExecute\`** — \`NoSchedule\` jaisa, aur additionally already-running Pods ko **evict** karta hai jo ise tolerate nahi karte.

Kubernetes automatically nodes ko taint karta hai: control-plane nodes ko \`node-role.kubernetes.io/control-plane:NoSchedule\` milta hai.

### Dedicated node pools ko ek taint *aur* affinity chahiye

Ek pool of nodes reserve karne ke liye aapko **dono** chahiye: nodes ko taint karo, **aur** intended Pods ko pool ke label ke liye node affinity do. Ek toleration akela sirf wahan land karne ki permission deta hai — ye Pod ko ek ordinary node par schedule hone se nahi rokta.

## Topology spread constraints

\`topologySpreadConstraints\` control karte hain ki ek set of Pods ek topology domain mein kitni evenly distributed hai:
- **\`maxSkew\`** — most-populated aur least-populated domain ke beech maximum allowed difference.
- **\`whenUnsatisfiable\`** — \`DoNotSchedule\` (hard) ya \`ScheduleAnyway\` (soft).

Ye "mere replicas ko zones aur nodes mein spread karo" kehne ka modern, sasta tarika hai.

## PriorityClass aur preemption

Ek **PriorityClass** ek Pod ko ek integer priority assign karta hai. Jab ek high-priority Pod Pending hai aur schedule nahi ho sakta, scheduler **preempt** kar sakta hai — ek node par lower-priority Pods ko evict karke jagah banane ke liye. Isi tarah aap guarantee karte ho ki critical system workloads ya paying-customer traffic ek capacity crunch mein batch jobs se jeete.`,

    examples: [
      {
        title: 'A taint repels a Pod with no toleration; adding the toleration lets it schedule',
        titleHi: 'Ek taint bina toleration ke ek Pod ko repel karta hai; toleration add karne se ye schedule hota hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m9l2-$$"; kubectl create namespace "$ns" >/dev/null
node=$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1; kubectl taint nodes "$node" demo- >/dev/null 2>&1' EXIT

kubectl taint nodes "$node" demo=true:NoSchedule --overwrite >/dev/null
echo "tainted the only node: demo=true:NoSchedule"

kubectl -n "$ns" run notol --image=registry.k8s.io/pause:3.9 >/dev/null
sleep 6
echo "Pod with NO toleration:  phase=$(kubectl -n "$ns" get pod notol -o jsonpath='{.status.phase}')  reason=$(kubectl -n "$ns" get pod notol -o jsonpath='{.status.conditions[?(@.type=="PodScheduled")].reason}')"
kubectl -n "$ns" describe pod notol 2>&1 | grep -oE '[0-9]+/[0-9]+ nodes are available.*untolerated taint[^.]*' | head -1

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Pod
metadata: { name: tol }
spec:
  tolerations: [ { key: demo, operator: Equal, value: "true", effect: NoSchedule } ]
  containers: [ { name: c, image: registry.k8s.io/pause:3.9 } ]
YAML
kubectl -n "$ns" wait --for=condition=Ready pod/tol --timeout=60s >/dev/null && echo "Pod WITH a matching toleration: Running"
kubectl taint nodes "$node" demo- >/dev/null
echo "(taint removed)"`,
        output: `tainted the only node: demo=true:NoSchedule
Pod with NO toleration:  phase=Pending  reason=Unschedulable
0/1 nodes are available: 1 node(s) had untolerated taint {demo: true}
Pod WITH a matching toleration: Running
(taint removed)`,
        explain: 'The cluster\'s single node is tainted with the key demo, value true, and effect NoSchedule. A Pod is then created with no tolerations. The scheduler runs its filter phase, finds that the only node carries a taint the Pod does not tolerate, eliminates it, and has nowhere left to place the Pod, so the Pod stays Pending with an Unschedulable condition and an event stating that one node had an untolerated taint. A second Pod is created that is identical except for a toleration whose key, value, and effect exactly match the taint. For that Pod the filter phase no longer eliminates the node — the toleration cancels the taint — so it is scheduled and reaches Running. The key mental model is that a taint is a property of the node that pushes Pods away by default, and a toleration is explicit permission on the Pod to ignore one specific taint; it grants the Pod the ability to be placed there but, as the next mistake shows, does not by itself pull the Pod toward the tainted node.',
        explainHi: 'Cluster ka single node key demo, value true, aur effect NoSchedule ke saath tainted hai. Ek Pod phir bina tolerations ke create hota hai. Scheduler apna filter phase chalata hai, paata hai ki ekmatra node ek taint carry karta hai jise Pod tolerate nahi karta, ise eliminate karta hai, aur Pod ko place karne ke liye kahin nahi bachta, to Pod Pending rehta hai. Ek doosra Pod create hota hai jo ek toleration ke alawa identical hai jiska key, value, aur effect exactly taint se match karta hai. Us Pod ke liye filter phase ab node ko eliminate nahi karta — toleration taint ko cancel karta hai — to ye scheduled hota hai aur Running pahunchta hai. Ek taint node ki ek property hai jo Pods ko default se door dhakelta hai, aur ek toleration Pod par explicit permission hai ek specific taint ko ignore karne ki.',
      },
      {
        title: 'Required node affinity for a label no node has → Pending until the node is labelled',
        titleHi: 'Ek label ke liye required node affinity jo kisi node ke paas nahi → Pending jab tak node labelled na ho',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m9l2b-$$"; kubectl create namespace "$ns" >/dev/null
node=$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1; kubectl label node "$node" disktype- >/dev/null 2>&1' EXIT

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Pod
metadata: { name: needs-ssd }
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions: [ { key: disktype, operator: In, values: [ ssd ] } ]
  containers: [ { name: c, image: registry.k8s.io/pause:3.9 } ]
YAML
sleep 6
echo "required affinity, no node has disktype=ssd:  phase=$(kubectl -n "$ns" get pod needs-ssd -o jsonpath='{.status.phase}')"
kubectl -n "$ns" describe pod needs-ssd 2>&1 | grep -oE "[0-9]+/[0-9]+ nodes are available.*didn't match Pod's node affinity/selector" | head -1

kubectl label node "$node" disktype=ssd --overwrite >/dev/null
echo "--- label the node disktype=ssd ---"
kubectl -n "$ns" wait --for=condition=Ready pod/needs-ssd --timeout=60s >/dev/null && echo "now: Running (the same Pod - required affinity is IgnoredDuringExecution, re-evaluated only while Pending)"
kubectl label node "$node" disktype- >/dev/null
echo "(label removed)"`,
        output: `required affinity, no node has disktype=ssd:  phase=Pending
0/1 nodes are available: 1 node(s) didn't match Pod's node affinity/selector
--- label the node disktype=ssd ---
now: Running (the same Pod - required affinity is IgnoredDuringExecution, re-evaluated only while Pending)
(label removed)`,
        explain: 'A Pod declares a required node affinity for the label disktype equal to ssd. No node in the cluster carries that label, so during the filter phase every node is eliminated and the Pod stays Pending, with an event reporting that the available node did not match the Pod\'s node affinity. The node is then labelled disktype equal to ssd. Because the Pod is still Pending, the scheduler is still trying to place it, re-runs the filter phase, now finds the node matches, and binds the Pod, which reaches Running. The important subtlety is the IgnoredDuringExecution part of the field name: the affinity rule is only consulted while the scheduler is choosing a node. Once a Pod is running on a node, later removing or changing that label does not evict it — which is why the last step removes the label with the Pod already Running and nothing happens to the Pod. A required affinity therefore acts as a hard gate at placement time and has no effect afterwards.',
        explainHi: 'Ek Pod label disktype equal to ssd ke liye ek required node affinity declare karta hai. Cluster mein koi node wo label carry nahi karta, to filter phase ke dauraan har node eliminate hota hai aur Pod Pending rehta hai. Node phir disktype equal to ssd labelled hota hai. Kyunki Pod abhi bhi Pending hai, scheduler abhi bhi ise place karne ki koshish kar raha hai, filter phase re-run karta hai, ab paata hai ki node match karta hai, aur Pod bind karta hai. Important subtlety field name ka IgnoredDuringExecution part hai: affinity rule sirf tab consult hota hai jab scheduler ek node choose kar raha hai. Ek baar ek Pod ek node par run kar raha hai, us label ko baad mein remove ya change karna ise evict nahi karta.',
      },
    ],

    mistakes: [
      {
        wrong: `# a dedicated GPU node pool set up with ONLY a taint (or ONLY a toleration)
# nodes: kubectl taint nodes gpu-1 gpu-2 gpu-3  nvidia.com/gpu=true:NoSchedule
# gpu workload Pod:
spec:
  tolerations: [ { key: nvidia.com/gpu, operator: Exists, effect: NoSchedule } ]
  # ...no nodeAffinity / nodeSelector for the gpu pool
# the toleration lets it land on a GPU node — but ALSO lets it land on any NORMAL node,
# and the scheduler's bin-packing will often put it on a cheaper normal node.
# result: GPU nodes sit half-empty; GPU Pods run on non-GPU nodes and fail at runtime.`,
        right: `# a dedicated pool needs BOTH directions:
# 1. TAINT the pool so Pods without the toleration are kept OFF:
#    kubectl taint nodes gpu-1..3  nvidia.com/gpu=true:NoSchedule
# 2. LABEL the pool and give the intended Pods node affinity so they are kept ON:
kubectl label nodes gpu-1..3  pool=gpu
spec:
  tolerations: [ { key: nvidia.com/gpu, operator: Exists, effect: NoSchedule } ]
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms: [ { matchExpressions: [ { key: pool, operator: In, values: [ gpu ] } ] } ]
# now: non-GPU Pods can't get on (taint), and GPU Pods can't go anywhere else (affinity).`,
        why: 'A taint and a toleration only control one direction: the taint keeps Pods that do not tolerate it off the node, and the toleration is the exception that lets a specific Pod through. Neither one attracts a Pod to the node. A Pod that merely tolerates the pool\'s taint is therefore free to be scheduled anywhere the scheduler prefers, and the scheduler\'s scoring, which favours packing Pods onto already-used or cheaper nodes, will frequently place it outside the pool. The consequence for a specialised pool is that its expensive nodes sit underused while the workloads that need them run on ordinary nodes and fail when they try to use hardware that is not there. Reserving a pool correctly requires both halves: the taint on the nodes so that unrelated Pods cannot land there, and a matching node label plus required node affinity on the intended Pods so that they can land nowhere else. With both in place the pool is exclusive in both directions.',
        whyHi: 'Ek taint aur ek toleration sirf ek direction control karte hain: taint un Pods ko node se door rakhta hai jo ise tolerate nahi karte, aur toleration exception hai jo ek specific Pod ko through hone deta hai. Koi bhi ek Pod ko node ki taraf attract nahi karta. Ek Pod jo sirf pool ke taint ko tolerate karta hai isliye free hai kahin bhi schedule hone ke liye jahan scheduler prefer karta hai, aur scheduler ki scoring ise often pool ke bahar place karegi. Ek specialised pool ke liye consequence ye hai ki iske expensive nodes underused baithte hain. Ek pool ko sahi se reserve karne ke liye dono halves chahiye: nodes par taint, aur intended Pods par ek matching node label plus required node affinity.',
      },
      {
        wrong: `# required pod anti-affinity with more replicas than nodes
spec:
  replicas: 6
  template:
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:      # HARD
            - labelSelector: { matchLabels: { app: web } }
              topologyKey: kubernetes.io/hostname               # one web Pod PER NODE
# cluster has 4 nodes. 4 Pods schedule (one per node), the other 2 are Pending FOREVER.
# a rollout can now also deadlock: new Pod can't schedule until an old one on "its" node goes.`,
        right: `# use SOFT anti-affinity, or (better) topologySpreadConstraints:
spec:
  template:
    spec:
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: ScheduleAnyway        # spread, but don't get stuck
          labelSelector: { matchLabels: { app: web } }
# or soft anti-affinity: preferredDuringScheduling..., weight: 100
# both say "spread across nodes" without making replicas > nodes impossible.
# use HARD (DoNotSchedule) only when you truly have capacity and one-per-domain is a rule.`,
        why: 'Required pod anti-affinity keyed on the hostname label is an absolute rule that no two Pods matching the selector may share a node. If the workload has more replicas than the cluster has eligible nodes, the rule cannot be satisfied for the surplus replicas, and they remain Pending indefinitely because the scheduler will not break a hard constraint. The same rule can deadlock a rolling update: a new Pod cannot be placed on a node until the old Pod occupying that node is removed, but the rollout will not remove the old Pod until the new one is ready, so the update stalls. Soft anti-affinity avoids both problems by expressing the spread as a scoring preference that the scheduler honours when it can and ignores when it must, so replicas still schedule. Topology spread constraints are better still: they let you specify the exact allowed imbalance with maxSkew and choose whether exceeding it blocks scheduling or merely deprioritises a node, and they were designed specifically to replace anti-affinity for even distribution. A hard one-per-node rule is only appropriate when the cluster genuinely has more eligible nodes than replicas and strict separation is a real requirement.',
        whyHi: 'Hostname label par keyed required pod anti-affinity ek absolute rule hai ki selector se matching koi do Pods ek node share nahi kar sakte. Agar workload ke paas cluster ke eligible nodes se zyada replicas hain, rule surplus replicas ke liye satisfy nahi ho sakta, aur wo indefinitely Pending rehte hain. Wahi rule ek rolling update ko deadlock kar sakta hai: ek naya Pod ek node par place nahi ho sakta jab tak us node par ka old Pod remove na ho, par rollout old Pod ko remove nahi karega jab tak naya ready na ho. Soft anti-affinity dono problems avoid karta hai. Topology spread constraints aur behtar hain: wo aapko maxSkew ke saath exact allowed imbalance specify karne dete hain.',
      },
      {
        wrong: `# expecting a node-label change to move already-running Pods
$ kubectl label node node3 workload-  # remove the label some Pods had required affinity for
# ...the Pods on node3 keep running there. nothing moves.
# "but the affinity says they require workload=batch and node3 no longer has it!"
# every affinity field ends in ...IgnoredDuringExecution — it's scheduling-time only.`,
        right: `# affinity / nodeSelector are evaluated ONLY when the scheduler picks a node.
# to actually move running Pods after a topology change you must recreate them:
#   kubectl rollout restart deployment/<name>     # rolling, respects PDB
#   or cordon + drain the node (kubectl drain node3) so Pods are evicted & rescheduled
# NoExecute TAINTS are the exception — they DO evict non-tolerating running Pods:
#   kubectl taint nodes node3 workload=batch:NoExecute
# (this is how the node controller evicts Pods from a NotReady node after tolerationSeconds.)`,
        why: 'Every node affinity and nodeSelector rule carries the implicit or explicit qualifier IgnoredDuringExecution, meaning it is consulted only while the scheduler is deciding where to place a Pod. Once a Pod is bound to a node and running, the scheduler is no longer involved, and changes to node labels — including removing the very label the Pod\'s required affinity matched — have no effect on that Pod. It continues running where it is. Moving already-running Pods in response to a topology or labelling change therefore requires actively recreating them, either with a rolling restart of the controller so replacements are scheduled fresh against the current labels, or by draining the node so its Pods are evicted and rescheduled elsewhere. The one mechanism that does act on running Pods is a NoExecute taint: applying it evicts every Pod on the node that does not tolerate it, after any tolerationSeconds grace, and this is exactly how the control plane clears Pods off a node that has gone NotReady.',
        whyHi: 'Har node affinity aur nodeSelector rule implicit ya explicit qualifier IgnoredDuringExecution carry karta hai, matlab ye sirf tab consult hota hai jab scheduler decide kar raha hai ki ek Pod kahan place kare. Ek baar ek Pod ek node se bound aur running hai, scheduler ab involved nahi hai, aur node labels mein changes — us bilkul label ko remove karna sameth jise Pod ki required affinity matched — us Pod par koi effect nahi karte. Already-running Pods ko move karne ke liye unhe actively recreate karna chahiye. Ek mechanism jo running Pods par act karta hai wo ek NoExecute taint hai.',
      },
    ],

    realWorld: [
      {
        en: '**A $4k/month GPU pool running at 15% utilisation** — the training Pods only had a toleration for the GPU taint, no node affinity, so the scheduler bin-packed most of them onto cheap CPU nodes where the CUDA calls failed. Adding `nodeAffinity` for the pool label fixed utilisation and the runtime errors together.',
        hi: '**Ek $4k/month GPU pool jo 15% utilisation par chal raha tha** — training Pods ke paas sirf GPU taint ke liye ek toleration tha, koi node affinity nahi. Pool label ke liye `nodeAffinity` add karna.',
      },
      {
        en: '**A rollout that hung for 40 minutes every deploy** — `requiredDuringScheduling` pod anti-affinity on hostname with `replicas: 8` on an 8-node cluster meant a new Pod could never schedule until its old counterpart was already gone. Switched to `topologySpreadConstraints` with `ScheduleAnyway` and rollouts went back to seconds.',
        hi: '**Ek rollout jo har deploy 40 minute hang hota tha** — 8-node cluster par `replicas: 8` ke saath hostname par `requiredDuringScheduling` pod anti-affinity. `topologySpreadConstraints` par switch kiya.',
      },
      {
        en: '**All three replicas of a service on one node, which then rebooted → full outage** — the team assumed the scheduler spreads replicas automatically. It does *prefer* to, but under bin-packing pressure it had stacked them. An explicit `topologySpreadConstraints` (maxSkew 1 over hostname and zone) made the spread a rule.',
        hi: '**Ek service ke teenon replicas ek node par, jo phir reboot hua → full outage** — team ne maana ki scheduler automatically replicas spread karta hai. Ek explicit `topologySpreadConstraints`.',
      },
    ],

    interviewQA: [
      {
        q: 'Describe the two phases the scheduler runs for each Pod, and give an example of what happens in each.',
        qHi: 'Scheduler har Pod ke liye jo do phases chalata hai unhe describe karo.',
        a: 'The scheduler processes one pending Pod at a time in a filter-then-score cycle. The filter phase, also called predicates, eliminates every node that cannot run the Pod: not enough allocatable CPU or memory for the Pod\'s requests, a nodeSelector or required node affinity that the node\'s labels do not satisfy, a taint the Pod has no matching toleration for, a required host port already in use, a volume that cannot be attached in the node\'s zone, and similar hard constraints. If every node is filtered out, the Pod stays Pending and gets a FailedScheduling event that lists, per node, the reason it was rejected. The score phase, also called priorities, ranks the nodes that survived filtering on a 0 to 100 scale using several plugins — spreading Pods of the same workload across nodes and zones, matching preferred affinity, bin-packing toward more-used nodes or balancing toward less-used ones depending on configuration, preferring nodes that already have the container image, honouring inter-Pod affinity — then sums the weighted scores and picks the highest, breaking ties at random. Finally it binds the Pod by writing nodeName, and the kubelet on that node starts it. nodeSelector and required affinity and taints act in the filter phase; preferred affinity and topology spread with ScheduleAnyway act in the score phase.',
        aHi: 'Scheduler ek pending Pod ek baar mein process karta hai ek filter-then-score cycle mein. Filter phase har node ko eliminate karta hai jo Pod ko nahi chala sakta: Pod ke requests ke liye kaafi allocatable CPU ya memory nahi, ek nodeSelector ya required node affinity jise node ke labels satisfy nahi karte, ek taint jiske liye Pod ke paas koi matching toleration nahi. Agar har node filter out ho jaata hai, Pod Pending rehta hai. Score phase un nodes ko rank karta hai jo filtering se bache 0 se 100 scale par kai plugins use karke — same workload ke Pods ko nodes aur zones mein spread karna, preferred affinity match karna, bin-packing. Phir ye weighted scores sum karta hai aur highest chunta hai. nodeSelector aur required affinity aur taints filter phase mein act karte hain; preferred affinity score phase mein.',
      },
      {
        q: 'How do you dedicate a pool of nodes to one workload, and why isn\'t a taint alone enough?',
        qHi: 'Aap ek pool of nodes ko ek workload ke liye kaise dedicate karte ho, aur ek taint akela kaafi kyun nahi hai?',
        a: 'You need to control both directions. First, taint every node in the pool, for example with a key like dedicated equal to teamA and effect NoSchedule. That stops any Pod that does not carry a matching toleration from being scheduled onto those nodes — it keeps everyone else out. Second, label the pool nodes with something like pool equal to teamA and give the intended workload both the matching toleration and a required node affinity for that pool label. The toleration lets the workload past the taint, and the affinity forces it to run only on nodes with the pool label. A taint alone is not enough because a taint plus a toleration only grants permission to be on the tainted nodes; it does not prevent the tolerating Pod from being scheduled somewhere else. The scheduler\'s scoring will often place a Pod that could go on the pool onto an ordinary node instead, especially under bin-packing, so without the affinity the dedicated nodes end up underused and the workload runs outside the pool. With the taint keeping others out and the affinity keeping the workload in, the pool is exclusive both ways.',
        aHi: 'Aapko dono directions control karni hain. Pehle, pool mein har node ko taint karo, jaise ek key dedicated equal to teamA aur effect NoSchedule ke saath. Ye kisi bhi Pod ko jo ek matching toleration carry nahi karta un nodes par schedule hone se rokta hai. Doosre, pool nodes ko kuch pool equal to teamA jaise label karo aur intended workload ko matching toleration aur us pool label ke liye ek required node affinity dono do. Toleration workload ko taint ke paar jaane deta hai, aur affinity ise sirf pool label wale nodes par run karne ke liye force karta hai. Ek taint akela kaafi nahi hai kyunki ek taint plus ek toleration sirf tainted nodes par hone ki permission deta hai; ye tolerating Pod ko kahin aur schedule hone se nahi rokta.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, contrast affinity and taints/tolerations by direction, and state what `required` vs `preferred` and `...IgnoredDuringExecution` each mean.',
        taskHi: 'Ek comment mein, affinity aur taints/tolerations ka contrast direction se karo.',
        hint: 'DIRECTION: **affinity / nodeSelector** = the POD chooses NODES (a Pod expressing where it wants to go, by node label or by other Pods\' locations). **taint** = the NODE repels PODS (a node property that pushes Pods away by default); a **toleration** = an exception on the Pod that cancels ONE specific taint. Neither a toleration nor a taint ATTRACTS — a tolerating Pod can still be scheduled elsewhere, so a dedicated pool needs a taint (keep others out) AND node affinity (keep the workload in). REQUIRED vs PREFERRED: `requiredDuringScheduling...` = a HARD filter — unmet → Pod `Pending` forever; supports `In/NotIn/Exists/DoesNotExist/Gt/Lt`. `preferredDuringScheduling...` = a SOFT score contribution, each with `weight` 1-100 added to a node\'s score if matched; the Pod still schedules if no preferred node exists. `...IgnoredDuringExecution` (every affinity field ends this way) = the rule is evaluated ONLY at scheduling time; relabelling a node later does NOT evict Pods already running on it. The one thing that DOES evict running Pods is a `NoExecute` TAINT (after optional `tolerationSeconds`).',
        hintHi: 'DIRECTION: **affinity / nodeSelector** = POD NODES chunta hai. **taint** = NODE PODS ko repel karta hai; ek **toleration** = Pod par ek exception jo EK specific taint cancel karta hai. Koi bhi ATTRACT nahi karta — ek tolerating Pod phir bhi kahin aur schedule ho sakta hai, to ek dedicated pool ko ek taint (baaki ko bahar rakho) AUR node affinity (workload ko andar rakho) chahiye. REQUIRED vs PREFERRED: `requiredDuringScheduling...` = ek HARD filter — unmet → Pod `Pending` forever. `preferredDuringScheduling...` = ek SOFT score contribution, `weight` 1-100. `...IgnoredDuringExecution` = rule SIRF scheduling time par evaluate hota hai; ek node ko baad mein relabel karna already running Pods ko evict NAHI karta. Jo cheez running Pods ko evict KARTI hai wo ek `NoExecute` TAINT hai.',
      },
      {
        task: 'In a comment, explain why `requiredDuringScheduling` pod anti-affinity on hostname is dangerous when replicas ≥ nodes, including the rollout deadlock, and what to use instead.',
        taskHi: 'Ek comment mein, samjhao ki hostname par `requiredDuringScheduling` pod anti-affinity replicas ≥ nodes hone par khatarnak kyun hai.',
        hint: 'Required pod anti-affinity with `topologyKey: kubernetes.io/hostname` + a selector for the workload\'s own label = an ABSOLUTE rule: no two matching Pods may share a node. If `replicas > eligible nodes`, the surplus replicas can NEVER satisfy it → `Pending` indefinitely (the scheduler won\'t break a hard constraint). ROLLOUT DEADLOCK: during a rolling update a NEW Pod can\'t be placed on a node until the OLD Pod on "its" node is gone — but the rollout won\'t remove the old Pod until the new one is Ready → the update stalls (can be 30-40 min or forever). USE INSTEAD: (1) SOFT anti-affinity — `preferredDuringScheduling...`, `weight: 100` — spread as a scoring preference the scheduler honours when it can, ignores when it must; or (2) BETTER: `topologySpreadConstraints` with `maxSkew: 1`, `topologyKey: kubernetes.io/hostname` (and/or zone), `whenUnsatisfiable: ScheduleAnyway` — designed exactly for even distribution, lets you set the precise allowed imbalance. Reserve HARD (`DoNotSchedule` / required) for when you genuinely have more eligible nodes than replicas AND one-per-domain is a real rule.',
        hintHi: '`topologyKey: kubernetes.io/hostname` + workload ke apne label ke selector ke saath required pod anti-affinity = ek ABSOLUTE rule: koi do matching Pods ek node share nahi kar sakte. Agar `replicas > eligible nodes`, surplus replicas ise KABHI satisfy nahi kar sakte → `Pending` indefinitely. ROLLOUT DEADLOCK: ek rolling update ke dauraan ek NAYA Pod ek node par place nahi ho sakta jab tak us node par ka OLD Pod na jaaye — par rollout old Pod ko remove nahi karega jab tak naya Ready na ho → update stall. USE INSTEAD: (1) SOFT anti-affinity; ya (2) BEHTAR: `topologySpreadConstraints` `maxSkew: 1`, `whenUnsatisfiable: ScheduleAnyway` ke saath.',
      },
      {
        task: 'In a comment, describe the three taint effects and explain how the node controller uses NoExecute when a node goes NotReady.',
        taskHi: 'Ek comment mein, teen taint effects describe karo.',
        hint: 'THREE EFFECTS of `kubectl taint nodes <n> key=value:<effect>`: **NoSchedule** — the scheduler won\'t place a NEW Pod here unless it has a matching toleration; existing Pods stay. **PreferNoSchedule** — soft version: the scheduler AVOIDS the node if it can, but will use it rather than leave a Pod Pending. **NoExecute** — like NoSchedule for new Pods, AND it EVICTS already-running Pods that don\'t tolerate it; a toleration may set `tolerationSeconds: N` to stay N seconds before eviction (omit → stay forever). NODE-NOTREADY FLOW: when a node stops heartbeating, the node controller adds `node.kubernetes.io/not-ready:NoExecute` (and `unreachable:NoExecute`) to it. Every Pod gets a default toleration for these with `tolerationSeconds: 300`, so Pods keep running for 5 minutes (riding out a brief blip), then are evicted and rescheduled onto healthy nodes. Kubernetes also auto-taints for `memory-pressure`, `disk-pressure`, `pid-pressure`, `unschedulable`; and control-plane nodes carry `node-role.kubernetes.io/control-plane:NoSchedule` by default.',
        hintHi: 'TEEN EFFECTS: **NoSchedule** — scheduler yahan ek NAYA Pod place nahi karega jab tak iske paas ek matching toleration na ho; existing Pods rehte hain. **PreferNoSchedule** — soft version. **NoExecute** — new Pods ke liye NoSchedule jaisa, AUR already-running Pods ko EVICT karta hai jo ise tolerate nahi karte; ek toleration `tolerationSeconds: N` set kar sakta hai. NODE-NOTREADY FLOW: jab ek node heartbeat karna band karta hai, node controller ise `node.kubernetes.io/not-ready:NoExecute` add karta hai. Har Pod ko in ke liye ek default toleration milta hai `tolerationSeconds: 300` ke saath, to Pods 5 minute run karte rehte hain phir evict hote hain.',
      },
    ],

    keyTakeaways: [
      'THE SCHEDULER runs a two-phase cycle per pending Pod: (1) FILTER (predicates) — eliminate every node that CANNOT run it: insufficient allocatable CPU/memory for the Pod\'s REQUESTS, unmatched `nodeSelector` / required node affinity, an untolerated taint, a taken hostPort, a zone-mismatched volume. Zero survivors → `Pending` + a `FailedScheduling` event per node. (2) SCORE (priorities) — rank survivors 0-100 (spread, preferred affinity, bin-pack, image locality, inter-Pod affinity), sum weighted scores, pick the highest. (3) BIND — write `nodeName`.',
      'AFFINITY = the POD chooses NODES. `nodeSelector` (exact label map, hard). `nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution` = HARD filter (`In/NotIn/Exists/DoesNotExist/Gt/Lt`; unmet → Pending forever). `...preferred...` = SOFT, `weight` 1-100 added to a node\'s score, still schedules if unmet. `podAffinity`/`podAntiAffinity` place a Pod relative to OTHER Pods via a `topologyKey` (a node label = the domain: hostname / zone). EVERY affinity field is `...IgnoredDuringExecution` → evaluated ONLY at scheduling time; relabelling a node later does NOT move running Pods.',
      'TAINT = the NODE repels PODS (lives on the node); TOLERATION = an exception on the POD cancelling ONE specific taint. Effects: `NoSchedule` (no new non-tolerating Pods), `PreferNoSchedule` (soft avoid), `NoExecute` (also EVICTS running non-tolerating Pods, after optional `tolerationSeconds`). Kubernetes auto-taints: control-plane (`node-role.kubernetes.io/control-plane:NoSchedule`), and `not-ready`/`unreachable`/`*-pressure` `:NoExecute` (every Pod tolerates not-ready/unreachable for 300s → the 5-min grace before eviction from a dead node).',
      'A DEDICATED NODE POOL needs BOTH directions: TAINT the nodes (keeps non-tolerating Pods OFF) AND node AFFINITY on the intended Pods for the pool\'s label (keeps them ON — a toleration alone only grants permission; the scheduler\'s bin-packing will otherwise place tolerating Pods on cheaper ordinary nodes, leaving the pool underused and its workloads failing on missing hardware).',
      'SPREADING REPLICAS: prefer `topologySpreadConstraints` (`maxSkew`, `topologyKey`, `whenUnsatisfiable: DoNotSchedule` hard | `ScheduleAnyway` soft, `labelSelector`) — designed to replace `preferred` pod anti-affinity for even distribution. NEVER use `requiredDuringScheduling` pod anti-affinity on hostname when replicas ≥ nodes: surplus replicas stay Pending forever AND rollouts deadlock (new Pod can\'t schedule until the old one on "its" node is gone, which won\'t happen until the new one is Ready). PRIORITYCLASS + PREEMPTION: a high-priority Pending Pod can evict lower-priority Pods (respecting PDBs/grace) to get scheduled — how critical workloads win a capacity crunch.',
    ],
    keyTakeawaysHi: [
      'SCHEDULER per pending Pod ek two-phase cycle chalata hai: (1) FILTER — har node ko eliminate karo jo ise NAHI chala sakta: Pod ke REQUESTS ke liye insufficient allocatable CPU/memory, unmatched `nodeSelector` / required node affinity, ek untolerated taint. Zero survivors → `Pending`. (2) SCORE — survivors ko 0-100 rank karo, weighted scores sum karo, highest chuno. (3) BIND — `nodeName` likho.',
      'AFFINITY = POD NODES chunta hai. `nodeAffinity.required...` = HARD filter (unmet → Pending forever). `...preferred...` = SOFT, `weight` 1-100. `podAffinity`/`podAntiAffinity` ek Pod ko DOOSRE Pods ke relative place karte hain ek `topologyKey` ke through. HAR affinity field `...IgnoredDuringExecution` hai → SIRF scheduling time par evaluate hota hai; ek node ko baad mein relabel karna running Pods ko NAHI move karta.',
      'TAINT = NODE PODS ko repel karta hai (node par rehta hai); TOLERATION = POD par ek exception jo EK specific taint cancel karta hai. Effects: `NoSchedule`, `PreferNoSchedule` (soft), `NoExecute` (running non-tolerating Pods ko bhi EVICT karta hai). Kubernetes auto-taints: control-plane, aur `not-ready`/`*-pressure` `:NoExecute` (har Pod not-ready ko 300s tolerate karta hai → dead node se eviction se pehle 5-min grace).',
      'EK DEDICATED NODE POOL ko DONO directions chahiye: nodes ko TAINT karo (non-tolerating Pods ko OFF rakhta hai) AUR intended Pods par pool ke label ke liye node AFFINITY (unhe ON rakhta hai — ek toleration akela sirf permission deta hai; scheduler ki bin-packing warna tolerating Pods ko cheaper ordinary nodes par place karegi).',
      'REPLICAS SPREAD KARNA: `topologySpreadConstraints` prefer karo (`maxSkew`, `topologyKey`, `whenUnsatisfiable`). KABHI `requiredDuringScheduling` pod anti-affinity hostname par use MAT karo jab replicas ≥ nodes: surplus replicas forever Pending rehte hain AUR rollouts deadlock hote hain. PRIORITYCLASS + PREEMPTION: ek high-priority Pending Pod lower-priority Pods ko evict kar sakta hai schedule hone ke liye.',
    ],
  },

  {
    slug: 'ops-disruptions-pdb-and-graceful-node-operations',
    title: 'Disruptions — PodDisruptionBudgets & Graceful Node Ops',
    titleHi: 'Disruptions — PodDisruptionBudgets & Graceful Node Ops',
    description: 'A pod dying because a node crashed is an involuntary disruption — nothing can prevent it. A pod evicted because someone drained the node for an upgrade is a voluntary disruption, and a PodDisruptionBudget lets you cap how many of those happen at once. Combined with graceful termination, this is how a cluster is upgraded with zero user-visible downtime.',
    descriptionHi: 'Ek pod marna kyunki ek node crash hua ek involuntary disruption hai — kuch ise rok nahi sakta. Ek pod evicted hona kyunki kisi ne ek upgrade ke liye node drain kiya ek voluntary disruption hai, aur ek PodDisruptionBudget aapko cap karne deta hai ki unmein se kitne ek saath hote hain. Graceful termination ke saath combined, isi tarah ek cluster zero user-visible downtime ke saath upgrade hota hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**A hospital ward during a planned renovation.** Involuntary disruption is a pipe bursting — it happens without warning and you just deal with it. Voluntary disruption is the facilities team wanting to close a wing to repaint it: planned, necessary, and something you can *schedule around*. The ward\'s rule — "at least four nurses must be on the floor at all times" — is the **PodDisruptionBudget**. When facilities asks to pull a nurse for the renovation, the charge nurse checks the count: if pulling them would drop below four, the request waits until someone else is back (the **eviction API returns 429**). The renovation still happens, just one wing at a time. And when a nurse does hand off, they don\'t vanish mid-task — they finish the current patient, brief their replacement, then leave (**graceful termination**: SIGTERM, `preStop`, drain, then exit within the grace period).',
      hi: '**Ek planned renovation ke dauraan ek hospital ward.** Involuntary disruption ek pipe phatna hai — ye bina warning ke hota hai. Voluntary disruption facilities team ka ek wing band karke ise repaint karna chahna hai: planned, necessary, aur kuch jiske aas-paas aap *schedule kar sakte ho*. Ward ka rule — "har samay kam se kam chaar nurses floor par hone chahiye" — **PodDisruptionBudget** hai. Jab facilities renovation ke liye ek nurse pull karne ko kehta hai, charge nurse count check karta hai: agar unhe pull karna chaar se neeche gira dega, request wait karti hai (**eviction API 429 return karta hai**). Renovation phir bhi hota hai, bas ek wing ek baar mein. Aur jab ek nurse handoff karta hai, wo mid-task gायab nahi hota — current patient khatam karta hai, apne replacement ko brief karta hai, phir chala jaata hai (**graceful termination**).',
    },

    simple: `**INVOLUNTARY disruption (can't prevent) vs VOLUNTARY disruption (a PDB caps the rate).**
\`\`\`
INVOLUNTARY   node crash / kernel panic / hardware failure / OOM kill / network partition
              -> no API call, no eviction, the Pod is just gone. mitigate with replicas
                 across nodes+zones, not with a PDB.
VOLUNTARY     kubectl drain (node upgrade), cluster-autoscaler scale-down, a rollout,
              'kubectl delete pod' via the EVICTION API
              -> goes through the eviction subresource -> the PDB is checked.
\`\`\`

**PodDisruptionBudget — a floor (or ceiling) on voluntary disruptions:**
\`\`\`yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: web }
spec:
  selector: { matchLabels: { app: web } }
  minAvailable: 2            # OR: maxUnavailable: 1   (pick one)
  # minAvailable can be a number or a % ("80%")
\`\`\`
\`\`\`
status.disruptionsAllowed = how many Pods may be evicted RIGHT NOW without breaking the budget
  healthy=3, minAvailable=3  -> disruptionsAllowed=0  -> every eviction request gets HTTP 429
  healthy=4, minAvailable=3  -> disruptionsAllowed=1
'kubectl drain' calls the eviction API per Pod, so it BLOCKS/retries until the PDB allows it.
a PDB with minAvailable == replicas makes the node UNDRAINABLE -> always leave headroom.
\`\`\`

**\`kubectl drain <node>\`** = \`cordon\` (mark unschedulable) + evict every Pod (respecting PDBs
and grace periods). DaemonSet Pods need \`--ignore-daemonsets\`; bare Pods need \`--force\`.
This is the front half of every node upgrade.

**GRACEFUL TERMINATION** when a Pod is told to stop:
\`\`\`
1. Pod -> Terminating, removed from Service endpoints (stops getting new traffic)
2. preStop hook runs (if any) — e.g. 'sleep 15' to let load balancers catch up
3. SIGTERM to PID 1 — the app should stop accepting, drain in-flight, exit
4. wait up to terminationGracePeriodSeconds (default 30)
5. still alive? SIGKILL.
\`\`\`

**PriorityClass + preemption:** a high-priority Pending Pod can evict lower-priority Pods to
get scheduled (respecting their PDBs + grace). This is how critical Pods win a capacity crunch.`,

    simpleHi: `**INVOLUNTARY disruption (rok nahi sakte) vs VOLUNTARY disruption (ek PDB rate cap karta hai).**
\`\`\`
INVOLUNTARY   node crash / kernel panic / hardware failure / OOM kill / network partition
              -> koi API call nahi, koi eviction nahi, Pod bas chala gaya. replicas se
                 mitigate karo nodes+zones ke across, ek PDB se nahi.
VOLUNTARY     kubectl drain (node upgrade), cluster-autoscaler scale-down, ek rollout,
              EVICTION API ke through 'kubectl delete pod'
              -> eviction subresource ke through jaata hai -> PDB check hota hai.
\`\`\`

**PodDisruptionBudget — voluntary disruptions par ek floor (ya ceiling):**
\`\`\`yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: web }
spec:
  selector: { matchLabels: { app: web } }
  minAvailable: 2            # YA: maxUnavailable: 1   (ek chuno)
\`\`\`
\`\`\`
status.disruptionsAllowed = kitne Pods ABHI evict ho sakte hain budget tode bina
  healthy=3, minAvailable=3  -> disruptionsAllowed=0  -> har eviction request ko HTTP 429
  healthy=4, minAvailable=3  -> disruptionsAllowed=1
'kubectl drain' per Pod eviction API call karta hai, to ye BLOCK/retry karta hai jab tak PDB allow na kare.
ek PDB jismein minAvailable == replicas node ko UNDRAINABLE banata hai -> hamesha headroom chhodo.
\`\`\`

**\`kubectl drain <node>\`** = \`cordon\` + har Pod evict karo (PDBs aur grace periods respect karke).
DaemonSet Pods ko \`--ignore-daemonsets\` chahiye; bare Pods ko \`--force\`.

**GRACEFUL TERMINATION** jab ek Pod ko stop karne ko kaha jaata hai:
\`\`\`
1. Pod -> Terminating, Service endpoints se removed (naya traffic milna band)
2. preStop hook chalta hai (agar koi) — jaise 'sleep 15'
3. PID 1 ko SIGTERM — app ko accept karna band, in-flight drain, exit karna chahiye
4. terminationGracePeriodSeconds tak wait (default 30)
5. abhi bhi alive? SIGKILL.
\`\`\``,

    content: `## Two kinds of disruption

A running Pod can stop for two fundamentally different reasons:

- **Involuntary disruption** — the node hardware fails, the kernel panics, the machine runs out of memory and the kernel OOM-kills the Pod, the network partitions the node away, a cloud provider reclaims a spot instance. There is no API request and no eviction flow; the Pod is simply gone. You cannot budget for these — you mitigate them by running multiple replicas spread across nodes and failure domains so that losing one does not lose the service.
- **Voluntary disruption** — something *deliberately* removes the Pod: an operator runs \`kubectl drain\` to empty a node for a kernel upgrade, the Cluster Autoscaler scales a node down, a Deployment rollout replaces Pods, or someone evicts a Pod through the API. These go through the **eviction subresource**, and that is where a PodDisruptionBudget applies.

## PodDisruptionBudget

A **PodDisruptionBudget** (PDB) constrains how many Pods of a set may be voluntarily disrupted at the same time. It selects Pods with a label selector and specifies **either**:

- **\`minAvailable\`** — at least this many (a number, or a percentage of the selector's total) must remain available, or
- **\`maxUnavailable\`** — at most this many may be unavailable at once.

The eviction API enforces it. Its status carries **\`disruptionsAllowed\`** — the number of Pods that could be evicted right now without violating the budget. If a workload has three healthy Pods and \`minAvailable: 3\`, \`disruptionsAllowed\` is 0, and any call to the eviction endpoint returns **HTTP 429 Too Many Requests** with a message that evicting would violate the budget. Give the workload four Pods and \`disruptionsAllowed\` becomes 1: one eviction succeeds, the count drops to 0, and the next must wait until a replacement Pod is running and healthy again.

### The undrainable-node trap

If you set \`minAvailable\` equal to the replica count (or \`maxUnavailable: 0\`), \`disruptionsAllowed\` is permanently 0, and **no Pod of that workload can ever be evicted**. A \`kubectl drain\` of any node running one of those Pods will retry forever and never complete, blocking the node upgrade. Always leave headroom: \`minAvailable\` should be at least one below the replica count, or expressed as a percentage that rounds to leave room (for \`replicas: 3\`, \`maxUnavailable: 1\` or \`minAvailable: "60%"\`).

A PDB also does nothing for a workload with **one replica** — the choice there is between "can't drain the node" and "accept the brief outage", and the honest answer is usually to run two replicas.

## Draining a node

\`kubectl drain <node>\` is the standard way to take a node out of service for maintenance. It:

1. **Cordons** the node (\`kubectl cordon\`) — marks it \`unschedulable\` so no new Pods land on it.
2. **Evicts** every Pod on it through the eviction API, one workload at a time, honouring each Pod's PodDisruptionBudget (blocking and retrying when \`disruptionsAllowed\` is 0) and \`terminationGracePeriodSeconds\`.

Flags you almost always need: \`--ignore-daemonsets\` (DaemonSet Pods are managed per-node and will be recreated, so drain skips them by default but errors unless you pass this), \`--delete-emptydir-data\` (acknowledge that \`emptyDir\` contents are lost), and \`--force\` (evict Pods not backed by a controller — a bare Pod has no replacement, so this is a data-loss acknowledgement). After maintenance, \`kubectl uncordon <node>\` makes it schedulable again. A managed control plane runs this exact flow for you during a node-pool upgrade.

## Graceful termination

When a Pod is deleted — by an eviction, a rollout, a scale-down — it does not vanish. The sequence is:

1. The Pod's \`deletionTimestamp\` is set; it moves to **Terminating** and is **removed from all Service EndpointSlices**, so it stops receiving new connections almost immediately.
2. If a **\`preStop\`** lifecycle hook is defined, it runs to completion first. A common pattern is \`preStop: exec: sleep 10\` — a short pause so that in-flight requests finish and external load balancers, which learn about endpoint removal asynchronously, stop routing to this Pod before the process exits.
3. The container runtime sends **SIGTERM** to PID 1. A well-behaved application stops accepting new work, finishes in-flight requests, flushes, and exits.
4. Kubernetes waits up to **\`terminationGracePeriodSeconds\`** (default **30**) for the container to exit on its own.
5. If it is still running when the grace period expires, it gets **SIGKILL**.

Two common bugs: the application does not trap SIGTERM (many processes ignore it when PID 1 under a shell — run the binary directly or use \`exec\` in the entrypoint), and the grace period is shorter than the longest in-flight request, so long requests are killed. Set \`terminationGracePeriodSeconds\` above your longest expected request plus the \`preStop\` sleep.

## PriorityClass and preemption

A **PriorityClass** is a cluster-scoped object mapping a name to an integer. A Pod that references it inherits that priority. When a Pod with high priority is Pending and the scheduler cannot find room, it may **preempt**: pick a node where evicting one or more lower-priority Pods would let the pending Pod fit, and evict them — going through graceful termination and respecting their PodDisruptionBudgets where it can. This guarantees that, under capacity pressure, a critical control-plane add-on or a revenue-serving workload is scheduled ahead of a batch job. Kubernetes ships two built-in high PriorityClasses, \`system-cluster-critical\` and \`system-node-critical\`, for its own components. Setting \`preemptionPolicy: Never\` on a PriorityClass gives a Pod a high scheduling-queue position without letting it evict anything.`,

    contentHi: `## Do tarah ki disruption

Ek running Pod do fundamentally alag reasons se ruk sakta hai:
- **Involuntary disruption** — node hardware fail hota hai, kernel panic karta hai, machine memory se bahar ho jaati hai aur kernel Pod ko OOM-kill karta hai, network node ko partition karta hai, ek cloud provider ek spot instance reclaim karta hai. Koi API request nahi aur koi eviction flow nahi; Pod bas chala gaya. Aap inke liye budget nahi kar sakte — aap unhe multiple replicas chalाकर mitigate karte ho nodes aur failure domains ke across spread.
- **Voluntary disruption** — kuch *deliberately* Pod ko remove karta hai: ek operator ek kernel upgrade ke liye ek node empty karne ko \`kubectl drain\` chalata hai, Cluster Autoscaler ek node scale down karta hai, ek Deployment rollout Pods replace karta hai. Ye **eviction subresource** ke through jaate hain, aur wahan ek PodDisruptionBudget apply hota hai.

## PodDisruptionBudget

Ek **PodDisruptionBudget** (PDB) constrain karta hai ki ek set ke kitne Pods ek saath voluntarily disrupted ho sakte hain. Ye **ya to**:
- **\`minAvailable\`** — kam se kam itne (ek number, ya selector ke total ka ek percentage) available rehne chahiye, ya
- **\`maxUnavailable\`** — ek saath maximum itne unavailable ho sakte hain.

Eviction API ise enforce karta hai. Iska status **\`disruptionsAllowed\`** carry karta hai — un Pods ki sankhya jo abhi evict ho sakte hain budget violate kiye bina. Agar ek workload ke paas teen healthy Pods hain aur \`minAvailable: 3\`, \`disruptionsAllowed\` 0 hai, aur eviction endpoint par koi bhi call **HTTP 429** return karta hai.

### Undrainable-node trap

Agar aap \`minAvailable\` ko replica count ke barabar set karte ho (ya \`maxUnavailable: 0\`), \`disruptionsAllowed\` permanently 0 hai, aur **us workload ka koi Pod kabhi evict nahi ho sakta**. Kisi bhi node ka \`kubectl drain\` jo unmein se ek Pod chala raha hai forever retry karega. Hamesha headroom chhodo.

Ek PDB ek **ek replica** wale workload ke liye bhi kuch nahi karta.

## Ek node drain karna

\`kubectl drain <node>\` maintenance ke liye ek node ko service se bahar lene ka standard tarika hai. Ye:
1. Node ko **cordon** karta hai — ise \`unschedulable\` mark karta hai.
2. Iske har Pod ko eviction API ke through **evict** karta hai, ek workload ek baar mein, har Pod ke PodDisruptionBudget ko honour karke.

Flags jo aapko lagbhag hamesha chahiye: \`--ignore-daemonsets\`, \`--delete-emptydir-data\`, aur \`--force\`. Maintenance ke baad, \`kubectl uncordon <node>\`.

## Graceful termination

Jab ek Pod delete hota hai, ye gायab nahi hota. Sequence:
1. Pod ka \`deletionTimestamp\` set hota hai; ye **Terminating** ho jaata hai aur **saare Service EndpointSlices se removed** hai.
2. Agar ek **\`preStop\`** hook defined hai, ye pehle completion tak chalta hai. Ek common pattern \`preStop: exec: sleep 10\` hai.
3. Container runtime PID 1 ko **SIGTERM** bhejta hai.
4. Kubernetes **\`terminationGracePeriodSeconds\`** (default **30**) tak wait karta hai.
5. Agar ye abhi bhi run kar raha hai jab grace period expire hota hai, ise **SIGKILL** milta hai.

Do common bugs: application SIGTERM trap nahi karta, aur grace period sabse lambe in-flight request se chhota hai. \`terminationGracePeriodSeconds\` ko apne sabse lambe expected request plus \`preStop\` sleep se upar set karo.

## PriorityClass aur preemption

Ek **PriorityClass** ek cluster-scoped object hai jo ek naam ko ek integer par map karta hai. Jab ek high-priority Pod Pending hai aur scheduler room nahi dhoondh sakta, ye **preempt** kar sakta hai: ek node chuno jahan ek ya zyada lower-priority Pods ko evict karna pending Pod ko fit hone dega. Isi tarah, capacity pressure ke tahat, ek critical workload ek batch job se pehle scheduled hota hai.`,

    examples: [
      {
        title: 'A PDB with disruptionsAllowed=0 makes the eviction API return 429; headroom lets it through',
        titleHi: 'disruptionsAllowed=0 wala ek PDB eviction API ko 429 return karvaata hai; headroom ise through jaane deta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m9l3-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1; kill \${PROXY:-0} 2>/dev/null' EXIT

kubectl -n "$ns" create deployment web --image=registry.k8s.io/pause:3.9 --replicas=3 >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=60s >/dev/null
kubectl -n "$ns" create poddisruptionbudget web-pdb --selector=app=web --min-available=3 >/dev/null
sleep 2
echo "replicas=3, PDB minAvailable=3  ->  disruptionsAllowed = $(kubectl -n "$ns" get pdb web-pdb -o jsonpath='{.status.disruptionsAllowed}')"

port=$(( (RANDOM % 20000) + 20000 ))
kubectl proxy --port=$port >/dev/null 2>&1 & PROXY=$!
sleep 3
pod=$(kubectl -n "$ns" get pod -l app=web -o jsonpath='{.items[0].metadata.name}')
echo "--- evict a Pod via the eviction API (this is exactly what 'kubectl drain' does) ---"
body=$(curl -s -w '\\nHTTPCODE:%{http_code}' -XPOST -H 'Content-Type: application/json' \\
  -d "{\\"apiVersion\\":\\"policy/v1\\",\\"kind\\":\\"Eviction\\",\\"metadata\\":{\\"name\\":\\"$pod\\"}}" \\
  "http://127.0.0.1:$port/api/v1/namespaces/$ns/pods/$pod/eviction")
code=$(printf '%s\\n' "$body" | sed -n 's/^HTTPCODE://p')
msg=$(printf '%s\\n' "$body" | grep -oE '"message": *"[^"]*"' | head -1 | cut -d'"' -f4)
echo "HTTP $code  ($msg)"

echo "--- give it headroom: scale to 4 ---"
kubectl -n "$ns" scale deployment web --replicas=4 >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=60s >/dev/null
sleep 2
echo "replicas=4, PDB minAvailable=3  ->  disruptionsAllowed = $(kubectl -n "$ns" get pdb web-pdb -o jsonpath='{.status.disruptionsAllowed}')"
pod=$(kubectl -n "$ns" get pod -l app=web -o jsonpath='{.items[0].metadata.name}')
code=$(curl -s -o /dev/null -w '%{http_code}' -XPOST -H 'Content-Type: application/json' \\
  -d "{\\"apiVersion\\":\\"policy/v1\\",\\"kind\\":\\"Eviction\\",\\"metadata\\":{\\"name\\":\\"$pod\\"}}" \\
  "http://127.0.0.1:$port/api/v1/namespaces/$ns/pods/$pod/eviction")
echo "evict one Pod now  ->  HTTP $code"`,
        output: `replicas=3, PDB minAvailable=3  ->  disruptionsAllowed = 0
--- evict a Pod via the eviction API (this is exactly what 'kubectl drain' does) ---
HTTP 429  (Cannot evict pod as it would violate the pod's disruption budget.)
--- give it headroom: scale to 4 ---
replicas=4, PDB minAvailable=3  ->  disruptionsAllowed = 1
evict one Pod now  ->  HTTP 201`,
        explain: 'A Deployment runs three Pods and a PodDisruptionBudget requires that at least three of them stay available. Because there are exactly three and all are healthy, the budget has no slack: its disruptionsAllowed field is zero. A POST to the pod\'s eviction subresource — the same call that kubectl drain issues for every Pod on a node — is rejected with HTTP 429 and a message that the eviction would violate the disruption budget. This is the mechanism that makes a node drain wait: drain keeps retrying the eviction until the budget permits it. The Deployment is then scaled to four Pods. Now three-must-stay leaves room for one to go, disruptionsAllowed becomes one, and the same eviction call succeeds with HTTP 201. The lesson for operations is that a PDB whose minAvailable equals the replica count is not a safety margin, it is a lock: it makes every node running one of those Pods impossible to drain. A correct PDB always leaves at least one Pod of headroom.',
        explainHi: 'Ek Deployment teen Pods chalata hai aur ek PodDisruptionBudget require karta hai ki unmein se kam se kam teen available rehne chahiye. Kyunki theek teen hain aur sab healthy hain, budget mein koi slack nahi: iska disruptionsAllowed field zero hai. Pod ke eviction subresource par ek POST — wahi call jo kubectl drain ek node ke har Pod ke liye issue karta hai — HTTP 429 se reject hota hai aur ek message ke saath ki eviction disruption budget violate karega. Ye wo mechanism hai jo ek node drain ko wait karvaata hai. Deployment phir chaar Pods par scale hota hai. Ab teen-must-stay ek ke jaane ke liye room chhodta hai, disruptionsAllowed ek ho jaata hai, aur wahi eviction call HTTP 201 se succeed karta hai. Operations ke liye lesson ye hai ki ek PDB jiska minAvailable replica count ke barabar hai ek safety margin nahi hai, ye ek lock hai.',
      },
      {
        title: 'Graceful termination: a Pod leaves Service endpoints first, then gets SIGTERM, then the grace deadline',
        titleHi: 'Graceful termination: ek Pod pehle Service endpoints chhodta hai, phir SIGTERM paata hai, phir grace deadline',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m9l3b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

# a Pod that logs SIGTERM and then keeps running for 20s (ignores it), grace period 10s
cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Pod
metadata: { name: slow, labels: { app: slow } }
spec:
  terminationGracePeriodSeconds: 10
  containers:
    - name: c
      image: busybox:1.36
      command: [ "sh", "-c", "trap 'echo GOT-SIGTERM; sleep 20' TERM; echo started; while true; do sleep 1; done" ]
YAML
kubectl -n "$ns" expose pod slow --port=80 >/dev/null
kubectl -n "$ns" wait --for=condition=Ready pod/slow --timeout=60s >/dev/null
echo "ready: Service endpoints = $(kubectl -n "$ns" get endpointslices -l kubernetes.io/service-name=slow -o jsonpath='{.items[*].endpoints[*].conditions.ready}')"

kubectl -n "$ns" delete pod slow --wait=false >/dev/null
sleep 4
r=$(kubectl -n "$ns" get endpointslices -l kubernetes.io/service-name=slow -o jsonpath='{.items[*].endpoints[*].conditions.ready}' | tr -d ' ')
echo "just after 'delete': phase=$(kubectl -n "$ns" get pod slow -o jsonpath='{.status.phase}')  endpoint ready=\${r:-<removed>}  (kube-proxy stops sending NEW connections)"
echo "container saw: $(kubectl -n "$ns" logs slow | grep -c GOT-SIGTERM) SIGTERM"

# the app ignores SIGTERM for 20s but the grace period is only 10s -> SIGKILL wins
kubectl -n "$ns" wait --for=delete pod/slow --timeout=60s >/dev/null
echo "Pod gone well before the 20s the app asked for: the 10s grace period expired -> SIGKILL"`,
        output: `ready: Service endpoints = true
just after 'delete': phase=Running  endpoint ready=false  (kube-proxy stops sending NEW connections)
container saw: 1 SIGTERM
Pod gone well before the 20s the app asked for: the 10s grace period expired -> SIGKILL`,
        explain: 'The Pod backs a Service and its container installs a SIGTERM handler that logs a line and then sleeps for twenty seconds, deliberately taking longer to shut down than the ten-second grace period allows. When the Pod is deleted, two things happen almost immediately: it enters Terminating, and its endpoint in the Service EndpointSlice is marked not-ready, so kube-proxy stops sending it new connections even though the process is still running. The container then receives SIGTERM and its handler runs, which the log confirms. Kubernetes waits for the pod\'s terminationGracePeriodSeconds, which is set to ten. The application wanted twenty seconds, but the grace period is the hard limit, so once it expires the container is sent SIGKILL and the Pod is gone — well before the twenty seconds it asked for. The practical rule is to set terminationGracePeriodSeconds comfortably above the longest request the app needs to finish plus any preStop delay, and to make sure the application actually handles SIGTERM by draining rather than ignoring it.',
        explainHi: 'Pod ek Service ko back karta hai aur iska container ek SIGTERM handler install karta hai jo ek line log karta hai aur phir bees seconds sleep karta hai, jaan-boojhkar dus-second grace period se zyada samay leता hai shut down hone mein. Jab Pod delete hota hai, do cheezein lagbhag turant hoti hain: ye Terminating ho jaata hai, aur ye Service EndpointSlice se removed hai, to naya traffic turant aana band ho jaata hai halaanki process abhi bhi run kar raha hai. Container phir SIGTERM receive karta hai aur iska handler chalta hai. Kubernetes pod ke terminationGracePeriodSeconds tak wait karta hai, jo dus set hai. Application bees seconds chahta tha, par grace period hard limit hai, to dus seconds par container ko SIGKILL bheja jaata hai. Practical rule terminationGracePeriodSeconds ko sabse lambe request se comfortably upar set karna hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a PDB with minAvailable == replicas -> the node becomes undrainable
spec:
  replicas: 2
---
apiVersion: policy/v1
kind: PodDisruptionBudget
spec:
  minAvailable: 2          # <-- == replicas. disruptionsAllowed is permanently 0.
  selector: { matchLabels: { app: api } }
# now 'kubectl drain node-7' (which has an api Pod) retries the eviction FOREVER:
#   evicting pod api-xxx: Cannot evict pod as it would violate the pod's disruption budget
# the cluster upgrade is stuck. and you can't lower the PDB during an incident without
# a scramble to figure out what's safe.`,
        right: `# always leave headroom: minAvailable < replicas (or maxUnavailable >= 1)
spec:
  replicas: 3
---
apiVersion: policy/v1
kind: PodDisruptionBudget
spec:
  maxUnavailable: 1        # or minAvailable: 2  (with replicas: 3)
  selector: { matchLabels: { app: api } }
# now one Pod at a time can be evicted; drain proceeds one node at a time; the service
# stays at >= 2 Pods throughout. for replicas: 2, maxUnavailable: 1 is the only sane choice.
# a 1-replica workload can't have a useful PDB at all -> run 2.`,
        why: 'A PodDisruptionBudget with minAvailable equal to the number of replicas, or maxUnavailable of zero, allows zero voluntary disruptions at all times, because evicting any Pod would drop the available count below the required minimum. The eviction API therefore rejects every eviction request for that workload indefinitely. Since kubectl drain works by calling the eviction API for each Pod and retrying until it succeeds, a drain of any node hosting one of these Pods never completes, and the node cannot be taken out of service for a kernel patch, a hardware repair, or an autoscaler scale-down. The cluster upgrade process stalls on that node. The correct configuration always leaves at least one Pod of slack: for three replicas, allow one unavailable; for two replicas, one unavailable is the only value that permits maintenance at all while still keeping one Pod serving. A workload with a single replica cannot be protected by a PDB in any useful way, because the only options are blocking all maintenance or allowing the sole Pod to be removed — the real fix is to run two replicas.',
        whyHi: 'Ek PodDisruptionBudget jismein minAvailable replicas ki sankhya ke barabar hai, ya maxUnavailable zero, har samay zero voluntary disruptions allow karta hai, kyunki kisi bhi Pod ko evict karna available count ko required minimum se neeche gira dega. Eviction API isliye us workload ke liye har eviction request ko indefinitely reject karta hai. Kyunki kubectl drain har Pod ke liye eviction API call karke aur succeed hone tak retry karke kaam karta hai, in Pods mein se ek ko host karne wale kisi bhi node ka drain kabhi complete nahi hota. Correct configuration hamesha kam se kam ek Pod ka slack chhodta hai.',
      },
      {
        wrong: `# assuming a PDB protects against node crashes
# "we have a PodDisruptionBudget with minAvailable: 2, so we're safe if a node dies"
# NO. a node crash is an INVOLUNTARY disruption:
#   - no eviction API call is made
#   - the PDB is never consulted
#   - the Pods on that node are just gone until the controller reschedules them
# if all 3 replicas happened to be on the crashed node, you're at 0 and the PDB did nothing.`,
        right: `# a PDB ONLY limits VOLUNTARY disruptions (drain, autoscaler, rollout via eviction).
# for INVOLUNTARY disruptions (node/hardware/kernel/OOM/spot-reclaim), you need:
#   - multiple replicas (>= 2, ideally >= 3)
#   - spread across nodes:  topologySpreadConstraints (topologyKey: kubernetes.io/hostname)
#   - spread across zones:  topologySpreadConstraints (topologyKey: topology.kubernetes.io/zone)
#   - fast reschedule: sane resource requests so replacements fit somewhere immediately
# the PDB and the spread work together: spread limits the blast radius of an involuntary
# loss, the PDB limits how fast voluntary ops chip away at what's left.`,
        why: 'A PodDisruptionBudget is enforced solely by the eviction subresource of the API. It is consulted when something calls that endpoint — a node drain, the Cluster Autoscaler removing a node, a controller using eviction during a rollout. An involuntary disruption such as a node kernel panic, a hardware failure, an out-of-memory kill, or a cloud provider reclaiming a spot instance does not involve any API call at all: the Pods on that node simply stop, and the PDB is never in the path. Relying on a PDB for resilience against node loss is therefore a category error. If the replicas of a workload all happen to be scheduled on the node that fails, the service goes to zero regardless of what the PDB says. Protection against involuntary disruption comes from running several replicas and spreading them across nodes and availability zones with topology spread constraints, so that any single node or zone failure removes only a fraction of the Pods. The PDB is complementary: once the replicas are spread, the PDB ensures that planned operations do not remove too many of the survivors at once.',
        whyHi: 'Ek PodDisruptionBudget sirf API ke eviction subresource dwara enforce hota hai. Ye tab consult hota hai jab kuch us endpoint ko call karta hai — ek node drain, Cluster Autoscaler ek node remove karna, ek controller rollout ke dauraan eviction use karna. Ek involuntary disruption jaise ek node kernel panic, ek hardware failure, ek out-of-memory kill, koi API call involve nahi karta: us node par Pods bas ruk jaate hain, aur PDB kabhi path mein nahi hai. Node loss ke against resilience ke liye ek PDB par rely karna isliye ek category error hai. Involuntary disruption ke against protection kai replicas chalाकर aur unhe nodes aur availability zones ke across spread karके aati hai.',
      },
      {
        wrong: `# a short grace period + an app that ignores SIGTERM -> dropped requests on every deploy
spec:
  terminationGracePeriodSeconds: 5      # too short
  containers:
    - name: api
      command: [ "sh", "-c", "node server.js" ]   # 'sh' is PID 1; it doesn't forward SIGTERM
# every rollout: sh gets SIGTERM, ignores it, node.js never hears it, 5s later everything
# gets SIGKILL mid-request. users see 502s / connection resets on every deploy.`,
        right: `# 1. make the app actually receive SIGTERM (be PID 1, or forward signals):
containers:
  - name: api
    command: [ "node", "server.js" ]        # node is PID 1, gets SIGTERM directly
    # (or use 'exec node server.js' in an entrypoint script, or tini as init)
# 2. handle it: stop accepting, finish in-flight, close the server, then exit.
# 3. size the grace period above (longest request + preStop):
    lifecycle: { preStop: { exec: { command: [ "sh", "-c", "sleep 10" ] } } }  # LB catch-up
spec:
  terminationGracePeriodSeconds: 45         # 10s preStop + ~30s max request + margin`,
        why: 'Graceful shutdown depends on the application process actually receiving SIGTERM and acting on it within the grace period. Two things break this. First, if the container\'s entrypoint is a shell that then launches the real process as a child, the shell is PID 1 and receives the signal, most shells do not forward it, and the real process never learns it should stop; it is then killed abruptly by SIGKILL when the grace period ends. Running the application binary directly as PID 1, or using exec in the entrypoint script so it replaces the shell, or adding a minimal init like tini, ensures the signal reaches it. Second, if terminationGracePeriodSeconds is shorter than the time the application needs to finish in-flight requests, those requests are cut off by SIGKILL. Because a Pod is removed from Service endpoints when termination begins but external load balancers learn this asynchronously, a short preStop sleep is also commonly added so traffic stops arriving before the process exits. The grace period should be set to at least the preStop delay plus the longest expected request duration plus a margin.',
        whyHi: 'Graceful shutdown application process ke actually SIGTERM receive karne aur grace period ke andar us par act karne par depend karta hai. Do cheezein ise todती hain. Pehla, agar container ka entrypoint ek shell hai jo phir real process ko ek child ke roop mein launch karta hai, shell PID 1 hai aur signal receive karta hai, zyadaatar shells ise forward nahi karte, aur real process kabhi nahi seekhta ki ise stop hona chahiye. Application binary ko directly PID 1 ke roop mein chalana ise ensure karta hai. Doosra, agar terminationGracePeriodSeconds application ko in-flight requests khatam karne ke liye chahiye samay se chhota hai, wo requests SIGKILL se cut off hote hain. Grace period kam se kam preStop delay plus sabse lambe expected request duration plus ek margin set hona chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**A cluster upgrade that stalled for a weekend** — a platform team had templated every Deployment with a PDB of `minAvailable: 100%`. Every node with a workload Pod was undrainable. The fix was a scripted patch to `maxUnavailable: 1` across the fleet before the drain could proceed.',
        hi: '**Ek cluster upgrade jo ek weekend ke liye ruka** — ek platform team ne har Deployment ko `minAvailable: 100%` ke ek PDB ke saath templated kiya tha. Har node undrainable tha.',
      },
      {
        en: '**"We lost the whole service when one node rebooted, but we have a PDB!"** — the PDB was `minAvailable: 2` on 3 replicas, but all 3 were on the rebooted node (no spread constraint). A node crash is involuntary; the PDB was never in the path. Added `topologySpreadConstraints` over hostname and zone.',
        hi: '**"Ek node reboot hone par humne poori service khoyi, par humare paas ek PDB hai!"** — PDB 3 replicas par `minAvailable: 2` tha, par teenों reboot hue node par the. Ek node crash involuntary hai.',
      },
      {
        en: '**502s on every single deploy for a year** — the Node app ran as `sh -c "npm start"`, so `sh` was PID 1 and swallowed SIGTERM; `npm` never propagated it either. Pods were SIGKILLed mid-request after the 30s grace. Switching the command to `node dist/server.js` + a real SIGTERM handler + `preStop: sleep 5` ended it.',
        hi: '**Ek saal ke liye har single deploy par 502s** — Node app `sh -c "npm start"` ke roop mein chalti thi, to `sh` PID 1 tha aur SIGTERM nigal gaya. Command ko `node dist/server.js` par switch karna.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a voluntary and an involuntary disruption, and what does a PodDisruptionBudget actually protect?',
        qHi: 'Ek voluntary aur ek involuntary disruption mein kya farak hai, aur ek PodDisruptionBudget actually kya protect karta hai?',
        a: 'An involuntary disruption is a Pod stopping for a reason outside anyone\'s control flow: the node\'s hardware fails, the kernel panics, the machine runs out of memory and the kernel OOM-kills the Pod, the node is partitioned off the network, or a cloud provider reclaims a spot instance. There is no API request and no eviction; the Pod is simply gone. A voluntary disruption is a Pod being deliberately removed through the eviction subresource of the API: an operator draining a node for maintenance, the Cluster Autoscaler removing an underused node, or a controller evicting Pods during an operation. A PodDisruptionBudget is enforced only by that eviction path. It specifies either minAvailable or maxUnavailable for a labelled set of Pods, and the eviction API refuses an eviction that would breach it, returning HTTP 429. So a PDB limits how quickly voluntary operations can remove Pods — it makes a node drain proceed one Pod at a time and wait for replacements — but it does nothing for involuntary disruptions, which never touch the eviction API. Resilience against node loss comes from running multiple replicas spread across nodes and zones; the PDB then ensures planned work does not compound the risk by taking down too many at once.',
        aHi: 'Ek involuntary disruption ek Pod ka rukna hai kisi ke control flow ke bahar ek reason se: node ka hardware fail hota hai, kernel panic karta hai, machine memory se bahar ho jaati hai aur kernel Pod ko OOM-kill karta hai, ya ek cloud provider ek spot instance reclaim karta hai. Koi API request nahi aur koi eviction nahi. Ek voluntary disruption ek Pod ka deliberately API ke eviction subresource ke through remove hona hai: ek operator ek node drain karna, Cluster Autoscaler ek underused node remove karna. Ek PodDisruptionBudget sirf us eviction path dwara enforce hota hai. Ye ek labelled set of Pods ke liye ya to minAvailable ya maxUnavailable specify karta hai, aur eviction API ek eviction refuse karta hai jo ise breach karega, HTTP 429 return karke. To ek PDB limit karta hai ki voluntary operations kitni jaldi Pods remove kar sakte hain — par ye involuntary disruptions ke liye kuch nahi karta.',
      },
      {
        q: 'Walk through what happens between "kubectl delete pod" and the container actually stopping.',
        qHi: '"kubectl delete pod" aur container ke actually rukne ke beech kya hota hai, samjhao.',
        a: 'The Pod gets a deletionTimestamp and moves to Terminating. Almost immediately it is removed from every Service EndpointSlice it was part of, so kube-proxy stops sending it new connections — existing connections are not cut. If the Pod defines a preStop lifecycle hook, the kubelet runs it to completion before anything else; a common use is a short sleep so that external load balancers, which learn about the endpoint removal asynchronously, stop routing to the Pod before its process goes away. Then the container runtime sends SIGTERM to PID 1 of each container. A well-behaved application catches this, stops accepting new work, finishes in-flight requests, flushes state, and exits. Kubernetes waits up to terminationGracePeriodSeconds, default 30, for the container to exit on its own. If it is still running when that deadline passes, the runtime sends SIGKILL and the container is forcibly stopped. Once all containers are gone the Pod object is deleted. The two things that commonly go wrong are the application not receiving SIGTERM because a shell is PID 1 and does not forward it, and the grace period being shorter than the longest in-flight request so requests are killed; the fix is to run the app as PID 1 or forward signals, and to set the grace period above the preStop delay plus the maximum request time.',
        aHi: 'Pod ko ek deletionTimestamp milta hai aur ye Terminating ho jaata hai. Lagbhag turant ye har Service EndpointSlice se removed hai jiska ye part tha, to kube-proxy ise naye connections bhejना band karta hai. Agar Pod ek preStop lifecycle hook define karta hai, kubelet ise kisi aur cheez se pehle completion tak chalata hai. Phir container runtime har container ke PID 1 ko SIGTERM bhejta hai. Ek well-behaved application ise catch karta hai, naya kaam accept karna band karta hai, in-flight requests khatam karta hai, aur exit karta hai. Kubernetes terminationGracePeriodSeconds tak wait karta hai, default 30. Agar ye abhi bhi run kar raha hai jab wo deadline guzarti hai, runtime SIGKILL bhejta hai. Do cheezein jo commonly galat hoti hain: application SIGTERM receive nahi karta kyunki ek shell PID 1 hai, aur grace period sabse lambe in-flight request se chhota hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define voluntary vs involuntary disruption with examples, and explain exactly how a PDB affects `kubectl drain`.',
        taskHi: 'Ek comment mein, voluntary vs involuntary disruption define karo.',
        hint: 'INVOLUNTARY = the Pod stops outside any control flow: node hardware failure, kernel panic, kernel OOM-kill, network partition, cloud spot-instance reclaim. NO API call, NO eviction, the PDB is NEVER consulted. Mitigate with replicas spread across nodes+zones (`topologySpreadConstraints`), NOT with a PDB. VOLUNTARY = something deliberately removes the Pod via the API\'s EVICTION SUBRESOURCE: `kubectl drain` (node maintenance), Cluster Autoscaler scale-down, a controller evicting during a rollout. HOW A PDB AFFECTS DRAIN: `kubectl drain <node>` = `cordon` (mark unschedulable) + POST to `.../pods/<name>/eviction` for every Pod on the node, one workload at a time. The eviction API checks the Pod\'s PDB: if `status.disruptionsAllowed == 0` (e.g. healthy == minAvailable) it returns HTTP 429 "Cannot evict pod as it would violate the pod\'s disruption budget", and drain RETRIES until a replacement Pod is Ready and the budget allows it. So `minAvailable == replicas` (or `maxUnavailable: 0`) → `disruptionsAllowed` permanently 0 → the node is UNDRAINABLE → cluster upgrade stuck. Always leave ≥1 Pod of headroom; a 1-replica workload can\'t have a useful PDB → run 2.',
        hintHi: 'INVOLUNTARY = Pod kisi control flow ke bahar rukta hai: node hardware failure, kernel panic, OOM-kill, network partition, spot-instance reclaim. KOI API call nahi, KOI eviction nahi, PDB KABHI consult nahi hota. VOLUNTARY = kuch deliberately Pod ko API ke EVICTION SUBRESOURCE ke through remove karta hai: `kubectl drain`, Cluster Autoscaler scale-down, ek rollout. PDB DRAIN KO KAISE AFFECT KARTA HAI: `kubectl drain <node>` = `cordon` + har Pod ke liye eviction POST. Eviction API Pod ka PDB check karta hai: agar `disruptionsAllowed == 0` ye HTTP 429 return karta hai, aur drain RETRY karta hai. To `minAvailable == replicas` → node UNDRAINABLE. Hamesha ≥1 Pod headroom chhodo.',
      },
      {
        task: 'In a comment, list the graceful-termination sequence step by step, with the default grace period, and the two bugs that break it.',
        taskHi: 'Ek comment mein, graceful-termination sequence step by step list karo.',
        hint: 'When a Pod is deleted (eviction / rollout / scale-down): (1) `deletionTimestamp` set → Pod → `Terminating`, and it is REMOVED FROM ALL Service EndpointSlices immediately → kube-proxy stops sending NEW connections (existing ones aren\'t cut). (2) `preStop` lifecycle hook runs to completion, if defined — commonly `exec: sleep 5-15` so external LBs (which learn endpoint removal ASYNC) stop routing before the process exits. (3) container runtime sends SIGTERM to PID 1 of each container → a good app stops accepting, finishes in-flight, flushes, exits. (4) Kubernetes waits up to `terminationGracePeriodSeconds` (DEFAULT 30). (5) still running at the deadline → SIGKILL. TWO BUGS: (a) the app never RECEIVES SIGTERM — a shell (`sh -c "..."`) is PID 1 and doesn\'t forward it → run the binary directly as PID 1, or `exec` in the entrypoint, or use `tini`. (b) grace period < longest in-flight request → requests killed mid-flight → set `terminationGracePeriodSeconds` ≥ preStop delay + max request duration + margin.',
        hintHi: 'Jab ek Pod delete hota hai: (1) `deletionTimestamp` set → Pod → `Terminating`, aur ye turant SAARE Service EndpointSlices se REMOVED hai → kube-proxy NAYE connections bhejना band karta hai. (2) `preStop` hook completion tak chalta hai, agar defined — commonly `exec: sleep 5-15`. (3) container runtime PID 1 ko SIGTERM bhejta hai. (4) Kubernetes `terminationGracePeriodSeconds` (DEFAULT 30) tak wait karta hai. (5) deadline par abhi bhi running → SIGKILL. DO BUGS: (a) app SIGTERM RECEIVE nahi karta — ek shell PID 1 hai aur ise forward nahi karta → binary ko directly PID 1 chalao. (b) grace period < sabse lamba in-flight request → requests killed → `terminationGracePeriodSeconds` ≥ preStop delay + max request duration + margin set karo.',
      },
      {
        task: 'In a comment, explain the undrainable-node trap and how to size a PDB correctly for replicas of 1, 2, and 3.',
        taskHi: 'Ek comment mein, undrainable-node trap samjhao.',
        hint: 'THE TRAP: a PDB with `minAvailable == replicas` (or `maxUnavailable: 0`, or `minAvailable: "100%"`) means `disruptionsAllowed` is PERMANENTLY 0 → the eviction API rejects EVERY eviction for that workload forever → `kubectl drain` of any node running one of its Pods retries indefinitely and never completes → the cluster upgrade / node repair / autoscaler scale-down is STUCK, often discovered mid-maintenance-window. SIZING: replicas 3 → `maxUnavailable: 1` (or `minAvailable: 2`): drain takes one Pod at a time, service stays ≥ 2. replicas 2 → `maxUnavailable: 1` is the ONLY workable value — it still keeps 1 Pod serving during maintenance; `minAvailable: 2` would be undrainable. replicas 1 → a PDB can\'t help: either it blocks ALL maintenance (`minAvailable: 1`) or it permits removing the only Pod (`maxUnavailable: 1`) — the real fix is to run 2 replicas. RULE: always leave ≥ 1 Pod of headroom, and prefer `maxUnavailable` (scales with replica count) over a fixed `minAvailable` number.',
        hintHi: 'TRAP: ek PDB `minAvailable == replicas` (ya `maxUnavailable: 0`, ya `minAvailable: "100%"`) ke saath matlab `disruptionsAllowed` PERMANENTLY 0 hai → eviction API us workload ke liye HAR eviction forever reject karta hai → `kubectl drain` indefinitely retry karta hai → cluster upgrade STUCK. SIZING: replicas 3 → `maxUnavailable: 1`: drain ek Pod ek baar mein, service ≥ 2 rehti hai. replicas 2 → `maxUnavailable: 1` EKMATRA workable value hai. replicas 1 → ek PDB help nahi kar sakta — real fix 2 replicas chalana hai. RULE: hamesha ≥ 1 Pod headroom chhodo, aur fixed `minAvailable` number ke bajaay `maxUnavailable` prefer karo.',
      },
    ],

    keyTakeaways: [
      'TWO DISRUPTION TYPES: INVOLUNTARY (node crash / kernel panic / OOM-kill / network partition / spot reclaim) — NO API call, NO eviction, the PDB is NEVER consulted; mitigate with replicas spread across nodes+zones. VOLUNTARY (`kubectl drain`, Cluster Autoscaler scale-down, a rollout, an API eviction) — goes through the EVICTION SUBRESOURCE, where the PDB applies. A PDB does NOT protect against node loss.',
      'A PODDISRUPTIONBUDGET (`policy/v1`) selects Pods by label and sets EITHER `minAvailable` (number or %) OR `maxUnavailable`. `status.disruptionsAllowed` = how many can be evicted RIGHT NOW; when it\'s 0 (healthy == minAvailable) the eviction API returns HTTP 429 "would violate the pod\'s disruption budget". `kubectl drain` calls eviction per Pod and RETRIES until the budget allows it — so a PDB makes a drain proceed one Pod at a time, waiting for replacements.',
      'THE UNDRAINABLE-NODE TRAP: `minAvailable == replicas` (or `maxUnavailable: 0` or `minAvailable: "100%"`) → `disruptionsAllowed` permanently 0 → every node running one of those Pods is impossible to drain → cluster upgrades stall. Always leave ≥ 1 Pod of headroom: replicas 3 → `maxUnavailable: 1`; replicas 2 → `maxUnavailable: 1` (the only workable value); replicas 1 → a PDB can\'t help, run 2. Prefer `maxUnavailable` (scales with the replica count).',
      '`kubectl drain <node>` = `cordon` (mark unschedulable) + evict every Pod via the eviction API, honouring PDBs and grace periods. Needs `--ignore-daemonsets` (DS Pods are per-node), `--delete-emptydir-data` (acknowledge data loss), `--force` (evict controller-less bare Pods). `kubectl uncordon` after. Managed control planes run this exact flow for node-pool upgrades.',
      'GRACEFUL TERMINATION on Pod delete: (1) → `Terminating` + removed from ALL Service EndpointSlices (new traffic stops at once). (2) `preStop` hook runs to completion (often `sleep 5-15` for LB catch-up). (3) SIGTERM to PID 1 — app drains in-flight + exits. (4) wait `terminationGracePeriodSeconds` (default 30). (5) still alive → SIGKILL. TWO BUGS: a shell as PID 1 swallows SIGTERM (run the binary directly / `exec` / `tini`); grace period < longest request → requests killed (set it above preStop + max request). PRIORITYCLASS + PREEMPTION: a high-priority Pending Pod can evict lower-priority Pods (respecting their PDBs + grace) to get scheduled.',
    ],
    keyTakeawaysHi: [
      'DO DISRUPTION TYPES: INVOLUNTARY (node crash / kernel panic / OOM-kill / network partition / spot reclaim) — KOI API call nahi, KOI eviction nahi, PDB KABHI consult nahi hota; replicas se mitigate karo nodes+zones ke across spread. VOLUNTARY (`kubectl drain`, autoscaler scale-down, ek rollout, ek API eviction) — EVICTION SUBRESOURCE ke through jaata hai, jahan PDB apply hota hai. Ek PDB node loss ke against protect NAHI karta.',
      'EK PODDISRUPTIONBUDGET (`policy/v1`) Pods ko label se select karta hai aur YA `minAvailable` (number ya %) YA `maxUnavailable` set karta hai. `status.disruptionsAllowed` = kitne ABHI evict ho sakte hain; jab ye 0 hai eviction API HTTP 429 return karta hai. `kubectl drain` per Pod eviction call karta hai aur RETRY karta hai jab tak budget allow na kare.',
      'UNDRAINABLE-NODE TRAP: `minAvailable == replicas` → `disruptionsAllowed` permanently 0 → un Pods ko chalane wala har node drain karna impossible → cluster upgrades stall. Hamesha ≥ 1 Pod headroom chhodo: replicas 3 → `maxUnavailable: 1`; replicas 2 → `maxUnavailable: 1` (ekmatra workable value); replicas 1 → ek PDB help nahi kar sakta, 2 chalao.',
      '`kubectl drain <node>` = `cordon` + eviction API ke through har Pod evict karo, PDBs aur grace periods honour karke. `--ignore-daemonsets`, `--delete-emptydir-data`, `--force` chahiye. Baad mein `kubectl uncordon`. Managed control planes node-pool upgrades ke liye yahi flow chalate hain.',
      'GRACEFUL TERMINATION Pod delete par: (1) → `Terminating` + SAARE Service EndpointSlices se removed. (2) `preStop` hook completion tak chalta hai. (3) PID 1 ko SIGTERM. (4) `terminationGracePeriodSeconds` (default 30) tak wait. (5) abhi bhi alive → SIGKILL. DO BUGS: ek shell PID 1 SIGTERM nigal jaata hai; grace period < sabse lamba request → requests killed. PRIORITYCLASS + PREEMPTION: ek high-priority Pending Pod lower-priority Pods ko evict kar sakta hai schedule hone ke liye.',
    ],
  },
];
