/**
 * DevOps Complete Course — Module 11: Deployment Strategies & Progressive
 * Delivery, lessons 1-3.
 *
 * Lesson 1: The deployment-strategy spectrum — recreate / rolling / blue-green /
 *           canary / shadow: downtime, rollback speed, cost, when to use each.
 *           VERIFIED against a real cluster (kind).
 * Lesson 2: Decouple deploy from release & feature flags — deploy is code on the
 *           server, release is users seeing it; flags as kill switch + gradual
 *           rollout + targeting; flag debt. VERIFIED (a flag flip = a release
 *           with no rollout).
 * Lesson 3: Canary & progressive delivery with analysis — traffic %, bake time,
 *           automated metric analysis, Argo Rollouts & Flagger, auto-abort.
 *           VERIFIED against a real Argo Rollouts on kind.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_11: CourseLesson[] = [
  {
    slug: 'ops-the-deployment-strategy-spectrum',
    title: 'The Deployment-Strategy Spectrum',
    titleHi: 'Deployment-Strategy Spectrum',
    description: 'Recreate, rolling, blue-green, canary and shadow are five points on a line trading off downtime, rollback speed, infrastructure cost and how many users a bad version can reach. Rolling is the sensible default; blue-green buys an instant rollback; canary limits the blast radius of a bad change to a slice of traffic.',
    descriptionHi: 'Recreate, rolling, blue-green, canary aur shadow ek line par paanch points hain jo downtime, rollback speed, infrastructure cost aur ek bad version kitne users tak pahunch sakta hai ko trade off karte hain. Rolling sensible default hai; blue-green ek instant rollback deta hai; canary ek bad change ke blast radius ko traffic ke ek slice tak limit karta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**Swapping the engine on a fleet of taxis.** *Recreate* is pulling every cab off the road, fitting the new engines, then reopening — the depot is shut for hours (downtime). *Rolling* is doing them a few at a time so the rest keep taking fares — no closure, but for a while some cabs are new and some old, and a bad engine is already in several cars before anyone notices. *Blue-green* is building a whole second identical fleet with the new engines parked and warmed up next door; at 3am you flip which fleet the dispatcher calls, and if the new engines knock, you flip straight back — instant, but you paid to own two fleets. *Canary* is putting the new engine in one cab, sending it out on normal routes, and watching its telemetry for a day before converting the next ten — the smallest possible number of passengers ride the risk. *Shadow* is wiring the new engine to a rig that receives a copy of every route a real cab drives, running it for real but with nobody in the seat — you learn how it behaves under production load with zero passenger risk.',
      hi: '**Taxis ke ek fleet par engine swap karna.** *Recreate* har cab ko road se hatana, naye engines fit karna, phir reopen karna hai — depot ghanton band hai (downtime). *Rolling* unhe kuch ek baar mein karna hai taaki baaki fares lete rahein — koi closure nahi, par thodी der ke liye kuch cabs naye kuch purane hain, aur ek bad engine kisi ke notice karne se pehle hi kई cars mein hai. *Blue-green* naye engines ke saath ek poora doosra identical fleet banana hai jo bagal mein parked aur warmed up hai; 3am par aap flip karte ho ki dispatcher kaunsा fleet call kare, aur agar naye engines knock karein, aap seedhे wapas flip karte ho — instant, par aapne do fleets own karne ke paise diye. *Canary* naye engine ko ek cab mein daalना hai, ise normal routes par bhejना, aur agle das convert karne se pehle ek din iski telemetry dekhना. *Shadow* naye engine ko ek rig se wire karna hai jo har route ki ek copy receive karta hai jo ek real cab drive karti hai, ise for real chalाना par seat mein koi nahi.',
    },

    simple: `**FIVE STRATEGIES, trading DOWNTIME vs ROLLBACK SPEED vs COST vs BLAST RADIUS:**
\`\`\`
RECREATE     stop ALL old, then start ALL new.  strategy: { type: Recreate }
             + simplest, no version-skew (v1 and v2 never coexist)
             - a FULL OUTAGE window. only for: can't-coexist apps, dev, batch, singletons.

ROLLING      replace a few at a time (maxSurge / maxUnavailable).  the DEFAULT.
             + no downtime, no extra infra
             - v1 and v2 serve SIMULTANEOUSLY for minutes (needs backward-compat)
             - rollback = another rolling update (minutes), a bad version already hit some users

BLUE-GREEN   run the FULL new version (green) beside the old (blue); flip ALL traffic at once
             (a Service selector / LB target / ingress switch).
             + INSTANT cutover, INSTANT rollback (flip the pointer back - blue never left)
             + you can smoke-test green in prod before the flip
             - ~2x the infra during the overlap; a sharp all-at-once switch (no gradual soak)

CANARY       send a SMALL % of live traffic to the new version, watch it, then increase.
             + smallest blast radius - a bad change hits ~1-5% first, auto-abort on bad metrics
             + gradual "soak" builds confidence
             - needs traffic-splitting (a mesh / ingress / Argo Rollouts / Flagger) + good metrics
             - slowest to fully roll out (Lesson 3)

SHADOW       COPY production traffic to the new version; it processes for real but its
             responses are DISCARDED (never returned to users).
             + test under real production load + real data shapes with ZERO user risk
             - complex plumbing; must handle side effects (don't double-charge, double-email)
             - it's a pre-production test, not a rollout - you still deploy by another strategy after
\`\`\`

**KUBERNETES BUILT-INS:** a \`Deployment\` gives you \`Recreate\` and \`RollingUpdate\` natively.
Blue-green and canary need either two Deployments + a Service-selector flip / weighting you
drive yourself, or a controller (\`Argo Rollouts\`, \`Flagger\`) that adds a \`Rollout\` /
\`Canary\` resource with those strategies built in (Lesson 3).

**PICK BY:** can old + new coexist? (no -> Recreate or blue-green). how bad is a full
rollback taking minutes? (bad -> blue-green). how bad is 5% of users hitting a regression?
(bad -> canary). do you have traffic-splitting + metrics? (no -> you can't do canary well yet).`,

    simpleHi: `**PAANCH STRATEGIES, DOWNTIME vs ROLLBACK SPEED vs COST vs BLAST RADIUS trade karte hue:**
\`\`\`
RECREATE     SAARE old stop, phir SAARE new start.  strategy: { type: Recreate }
             + simplest, koi version-skew nahi (v1 aur v2 kabhi coexist nahi)
             - ek FULL OUTAGE window. sirf: can't-coexist apps, dev, batch, singletons ke liye.

ROLLING      kuch ek baar mein replace (maxSurge / maxUnavailable).  DEFAULT.
             + koi downtime nahi, koi extra infra nahi
             - v1 aur v2 minuton ke liye SAATH serve karte hain (backward-compat chahiye)
             - rollback = ek aur rolling update (minutes), ek bad version already kuch users tak

BLUE-GREEN   POORA new version (green) old (blue) ke bagal chalao; SAARA traffic ek saath flip karo.
             + INSTANT cutover, INSTANT rollback (pointer wapas flip karo - blue kabhi nahi gaya)
             + flip se pehle green ko prod mein smoke-test kar sakte ho
             - overlap ke dauraan ~2x infra; ek sharp all-at-once switch

CANARY       live traffic ka ek CHHOTA % naye version ko bhejo, ise dekho, phir badhाओ.
             + sabse chhota blast radius - ek bad change ~1-5% pehle hit karta hai, bad metrics par auto-abort
             + gradual "soak" confidence banata hai
             - traffic-splitting (ek mesh / ingress / Argo Rollouts / Flagger) + acchे metrics chahiye
             - fully roll out hone mein sabse slow (Lesson 3)

SHADOW       production traffic ko naye version ko COPY karo; ye for real process karta hai par
             iske responses DISCARDED hain (kabhi users ko return nahi).
             + real production load ke tahat test, ZERO user risk
             - complex plumbing; side effects handle karne chahiye (double-charge mat karo)
             - ye ek pre-production test hai, ek rollout nahi
\`\`\`

**KUBERNETES BUILT-INS:** ek \`Deployment\` aapko \`Recreate\` aur \`RollingUpdate\` natively deta hai.
Blue-green aur canary ke liye ya to do Deployments + ek Service-selector flip / weighting jo aap
khud drive karte ho, ya ek controller (\`Argo Rollouts\`, \`Flagger\`) chahiye.

**ISSE PICK KARO:** kya old + new coexist kar sakte hain? (nahi -> Recreate ya blue-green). ek
full rollback minutes lene se kitna bura? (bura -> blue-green). 5% users ka ek regression hit karna
kitna bura? (bura -> canary). kya aapke paas traffic-splitting + metrics hain? (nahi -> aap canary
abhi acchе se nahi kar sakte).`,

    content: `## The trade-off

Every deployment strategy is a point on a line balancing four things:

- **Downtime** during the switch.
- **Rollback speed** — how fast you can get back to the known-good version.
- **Infrastructure cost** — extra capacity you have to run.
- **Blast radius** — how many users a bad version reaches before you catch it.

You do not get to optimise all four. Recreate is cheap and simple but has downtime; blue-green removes downtime and makes rollback instant but doubles infrastructure during the switch; canary shrinks the blast radius but is slow and needs traffic-splitting and good metrics.

## Recreate

\`strategy: { type: Recreate }\` on a Deployment. Kubernetes scales the old ReplicaSet to **zero**, waits, and only then scales the new one up. There is a window with **no Pods running** — a full outage.

Use it only when:
- Old and new versions **genuinely cannot coexist** — an exclusive lock on a resource, a schema change the old code cannot tolerate, a singleton that must not run twice.
- The environment is dev/CI where a few seconds of downtime is fine.
- A batch or worker where "briefly zero workers" is acceptable.

## Rolling update

The default. \`strategy.rollingUpdate\` with **\`maxSurge\`** (how many extra Pods above the desired count may exist during the roll) and **\`maxUnavailable\`** (how many below). \`maxSurge: 1, maxUnavailable: 0\` gives a zero-downtime roll that always keeps the full replica count available, at the cost of one extra Pod's worth of capacity during the roll (Module 8, Lesson 1).

Its properties:
- **No downtime, no extra infrastructure** beyond the small surge.
- **Version skew is unavoidable.** For the minutes the roll takes, some Pods run v1 and some run v2, both serving live traffic. The new version **must be backward-compatible** with anything the old version and its data are still doing.
- **Rollback is another rolling update** — \`kubectl rollout undo\` — which takes the same few minutes, during which a mix of the good and bad versions serves. And a bad change has already reached some fraction of users by the time you notice.

## Blue-green

Run the **entire new version (green)** alongside the **entire old version (blue)**, both at full capacity. Traffic goes to blue. When green is verified — you can even smoke-test it in production against a separate hostname — you **flip all traffic to green at once** by changing a Service selector, an ingress backend, or a load-balancer target group.

- **Instant cutover and instant rollback.** If green misbehaves, flip the pointer back to blue, which never went away. Rollback is a single atomic change, seconds not minutes.
- **You can validate green in production before any user traffic hits it.**
- **Cost: roughly double the infrastructure** for the overlap period.
- **The switch is sharp** — 0% to 100% in one step. There is no gradual soak, so a problem that only shows under real load appears for everyone at once (canary addresses this).

Databases are the complication: blue and green usually share one database, so a green schema change still has to be backward-compatible with blue for the rollback to be real (Lesson 5).

## Canary

Route a **small percentage of live traffic** — 1%, 5% — to the new version while the rest stays on the old. Watch the new version's error rate, latency, and business metrics. If they hold, increase the percentage in steps (25%, 50%, 100%) with a **bake time** at each step; if they degrade, **abort** and send all traffic back to the old version.

- **Smallest blast radius.** A regression is seen by 1–5% of users, briefly, and an automated analysis can abort before it goes further.
- **Gradual confidence.** Each successful step is evidence for the next.
- **Requires traffic-splitting** — a service mesh, an ingress controller that supports weighting, or a progressive-delivery controller — and **requires metrics** good enough to decide promote-or-abort automatically.
- **Slowest full rollout.** Getting to 100% deliberately takes an hour or more.

Canary and progressive delivery are Lesson 3.

## Shadow (mirroring)

Send the new version a **copy** of production traffic. It processes each request for real — same code path, same load, real data shapes — but its responses are **thrown away**, never returned to a user.

- **Test under genuine production load and data with zero user-facing risk.** Excellent for catching performance regressions and crashes that only appear at scale or with real inputs.
- **The plumbing is non-trivial** (the mesh or proxy mirrors requests) and **side effects must be neutralised** — the shadow must not send the confirmation email, charge the card, or write to the production database, or you double everything.
- **It is a pre-production test, not a deployment strategy.** After shadowing gives you confidence, you still roll the change out with rolling, blue-green, or canary.

## Choosing

Ask, in order:
1. **Can old and new coexist** (in the process fleet and against the shared data)? If not, you are limited to Recreate (accept downtime) or blue-green with a fully backward-compatible schema.
2. **How costly is a rollback that takes minutes and serves a mix of versions meanwhile?** If that is unacceptable (payments, a launch), blue-green's instant flip is worth the doubled infra.
3. **How costly is a regression reaching 5% of users for a few minutes?** If that is unacceptable, you need canary — which means you must first have traffic-splitting and reliable metrics.
4. **Do you have traffic-splitting and metrics?** If not, canary is aspirational; use rolling with tight readiness probes and fast rollback until you build that capability.

Most services should run **rolling update as the default** and reach for blue-green or canary for the specific higher-risk changes that justify the extra machinery.`,

    contentHi: `## Trade-off

Har deployment strategy ek line par ek point hai jo chaar cheezein balance karti hai: **downtime** switch ke dauraan; **rollback speed**; **infrastructure cost**; **blast radius** — ek bad version kitne users tak pahunchta hai pehle aap ise catch karein.

Aap chaaron optimise nahi kar sakte. Recreate cheap aur simple hai par downtime hai; blue-green downtime hataता hai aur rollback instant banata hai par switch ke dauraan infrastructure double karta hai; canary blast radius shrink karta hai par slow hai.

## Recreate

Ek Deployment par \`strategy: { type: Recreate }\`. Kubernetes old ReplicaSet ko **zero** par scale karta hai, wait karta hai, aur sirf phir naye ko up scale karta hai. Ek window hai jismें **koi Pods running nahi** — ek full outage.

Ise sirf tab use karo jab: old aur new versions **genuinely coexist nahi kar sakte**; environment dev/CI hai; ek batch ya worker jahaan "briefly zero workers" acceptable hai.

## Rolling update

Default. \`strategy.rollingUpdate\` **\`maxSurge\`** aur **\`maxUnavailable\`** ke saath. \`maxSurge: 1, maxUnavailable: 0\` ek zero-downtime roll deta hai (Module 8, Lesson 1).

Iski properties: **koi downtime nahi, koi extra infrastructure nahi**. **Version skew avoidable nahi hai** — jitne minutes roll leta hai, kuch Pods v1 chalाते hain kuch v2, dono live traffic serve karte hue. Naya version **backward-compatible hona chahiye**. **Rollback ek aur rolling update hai** — \`kubectl rollout undo\` — jo same kuch minutes leta hai.

## Blue-green

**Poora naya version (green)** **poore old version (blue)** ke bagal chalao, dono full capacity par. Traffic blue ko jaata hai. Jab green verified hai, aap **saara traffic ek saath green ko flip karte ho** ek Service selector, ek ingress backend, ya ek load-balancer target group badalकर.

- **Instant cutover aur instant rollback.** Agar green misbehave karta hai, pointer wapas blue ko flip karo. Rollback ek single atomic change hai, seconds minutes nahi.
- **Cost: overlap period ke liye lagbhag double infrastructure.**
- **Switch sharp hai** — ek step mein 0% se 100%.

Databases complication hain: blue aur green usually ek database share karte hain, to ek green schema change abhi bhi blue ke saath backward-compatible hona chahiye (Lesson 5).

## Canary

**Live traffic ka ek chhota percentage** — 1%, 5% — naye version ko route karo jabki baaki old par rehta hai. Naye version ka error rate, latency, aur business metrics dekho. Agar wo hold karte hain, percentage ko steps mein badhाओ har step par ek **bake time** ke saath; agar wo degrade karte hain, **abort** karo.

- **Sabse chhota blast radius.** Ek regression 1-5% users dwara dekha jaata hai, briefly.
- **Traffic-splitting chahiye** aur **metrics chahiye** jo promote-or-abort automatically decide karne ke liye acchе hain.
- **Sabse slow full rollout.**

Canary Lesson 3 hai.

## Shadow (mirroring)

Naye version ko production traffic ki ek **copy** bhejo. Ye har request ko for real process karta hai — same code path, same load — par iske responses **fenke jaate hain**.

- **Genuine production load aur data ke tahat test, zero user-facing risk.**
- **Side effects neutralise hone chahiye** — shadow ko confirmation email nahi bhejना chahiye, card charge nahi karna chahiye.
- **Ye ek pre-production test hai, ek deployment strategy nahi.**

## Choosing

Order mein poochho:
1. **Kya old aur new coexist kar sakte hain?** Agar nahi, aap Recreate ya blue-green tak limited ho.
2. **Ek rollback jo minutes leta hai kitna costly hai?** Agar unacceptable, blue-green ka instant flip doubled infra ke worth hai.
3. **Ek regression 5% users tak pahunchना kitna costly hai?** Agar unacceptable, aapko canary chahiye.
4. **Kya aapke paas traffic-splitting aur metrics hain?** Agar nahi, canary aspirational hai.

Zyadaatar services ko **rolling update as the default** chalाना chahiye.`,

    examples: [
      {
        title: 'Blue-green: green runs beside blue with zero traffic, one selector patch is the cutover (and the rollback)',
        titleHi: 'Blue-green: green blue ke bagal zero traffic ke saath chalta hai, ek selector patch cutover hai (aur rollback)',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m11l1-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: apps/v1
kind: Deployment
metadata: { name: web-blue }
spec:
  replicas: 3
  selector: { matchLabels: { app: web, version: blue } }
  template:
    metadata: { labels: { app: web, version: blue } }
    spec:
      containers: [ { name: c, image: registry.k8s.io/e2e-test-images/agnhost:2.47, args: [ netexec, --http-port=8080 ] } ]
---
apiVersion: apps/v1
kind: Deployment
metadata: { name: web-green }
spec:
  replicas: 3
  selector: { matchLabels: { app: web, version: green } }
  template:
    metadata: { labels: { app: web, version: green } }
    spec:
      containers: [ { name: c, image: registry.k8s.io/e2e-test-images/agnhost:2.47, args: [ netexec, --http-port=8080 ] } ]
---
apiVersion: v1
kind: Service
metadata: { name: web }
spec:
  selector: { app: web, version: blue }      # <-- the cutover switch
  ports: [ { port: 80, targetPort: 8080 } ]
YAML
kubectl -n "$ns" rollout status deploy/web-blue --timeout=90s >/dev/null
kubectl -n "$ns" rollout status deploy/web-green --timeout=90s >/dev/null

hit() { kubectl -n "$ns" run c --image=busybox:1.36 --restart=Never --rm -i --quiet -- sh -c 'wget -qO- http://web/hostname' 2>/dev/null | sed -E 's/-[a-z0-9]+-[a-z0-9]+$//'; }
echo "green Pods running: $(kubectl -n "$ns" get pod -l version=green --no-headers | grep -c Running)   green endpoints in the Service: $(kubectl -n "$ns" get endpointslices -l kubernetes.io/service-name=web -o jsonpath='{.items[*].endpoints[*].targetRef.name}' | tr ' ' '\\n' | grep -c green)"
echo "before cutover: Service routes to -> $(hit)   (green is fully up but gets 0% traffic)"

echo "--- CUTOVER: one atomic patch of the Service selector ---"
kubectl -n "$ns" patch service web -p '{\"spec\":{\"selector\":{\"app\":\"web\",\"version\":\"green\"}}}' >/dev/null
sleep 3
echo "after cutover:  Service routes to -> $(hit)"
echo "--- INSTANT ROLLBACK: flip the selector back (blue never left) ---"
kubectl -n "$ns" patch service web -p '{\"spec\":{\"selector\":{\"app\":\"web\",\"version\":\"blue\"}}}' >/dev/null
sleep 3
echo "after rollback: Service routes to -> $(hit)   (a selector flip, not a redeploy - seconds)"`,
        output: `green Pods running: 3   green endpoints in the Service: 0
before cutover: Service routes to -> web-blue   (green is fully up but gets 0% traffic)
--- CUTOVER: one atomic patch of the Service selector ---
after cutover:  Service routes to -> web-green
--- INSTANT ROLLBACK: flip the selector back (blue never left) ---
after rollback: Service routes to -> web-blue   (a selector flip, not a redeploy - seconds)`,
        explain: 'Two complete Deployments are created — web-blue and web-green — each with three replicas and its own version label, plus a Service whose selector matches only the blue version. Green comes up fully, all three Pods Running, but because the Service selector does not match it, green has zero endpoints in the Service and receives no traffic at all; it is deployed but not released. A request through the Service goes to a blue Pod. The cutover is a single patch changing the Service selector from version blue to version green: within a moment the EndpointSlice controller repopulates the Service with green\'s Pods and drops blue\'s, and the next request goes to green. The rollback is the same operation in reverse — patch the selector back to blue — and it is instant because blue was never scaled down or deleted; it has been sitting there at full capacity the whole time. This is the defining property of blue-green: the switch and the rollback are both a single atomic pointer change that takes effect in seconds, at the cost of running both full fleets during the overlap. In production the pointer is often an ingress backend or a load-balancer target group rather than a Service selector, but the mechanism is identical.',
        explainHi: 'Do complete Deployments create hote hain — web-blue aur web-green — har ek teen replicas aur apne version label ke saath, plus ek Service jiska selector sirf blue version se match karta hai. Green fully up aata hai, saare teen Pods Running, par kyunki Service selector ise match nahi karta, green ke Service mein zero endpoints hain aur ise bilkul traffic nahi milta; ye deployed hai par released nahi. Service ke through ek request ek blue Pod ko jaati hai. Cutover ek single patch hai jo Service selector ko version blue se version green badalता hai: ek moment ke andar EndpointSlice controller Service ko green ke Pods se repopulate karta hai aur blue ke drop karta hai. Rollback reverse mein same operation hai — selector ko wapas blue par patch karo — aur ye instant hai kyunki blue kabhi scale down ya delete nahi hua. Ye blue-green ki defining property hai: switch aur rollback dono ek single atomic pointer change hain jo seconds mein effect leता hai.',
      },
      {
        title: 'Recreate has a full-outage window; RollingUpdate with maxUnavailable 0 has none',
        titleHi: 'Recreate ka ek full-outage window hai; maxUnavailable 0 ke saath RollingUpdate ka koi nahi',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m11l1b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

mk() {  # $1 = name, $2 = strategy block
cat <<YAML | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: apps/v1
kind: Deployment
metadata: { name: $1 }
spec:
  replicas: 4
  $2
  selector: { matchLabels: { app: $1 } }
  template:
    metadata: { labels: { app: $1 } }
    spec:
      containers:
        - { name: c, image: nginx:1.27-alpine, readinessProbe: { httpGet: { path: /, port: 80 }, periodSeconds: 1 } }
YAML
}
mk roll "strategy: { type: RollingUpdate, rollingUpdate: { maxSurge: 1, maxUnavailable: 0 } }"
mk recr "strategy: { type: Recreate }"
kubectl -n "$ns" rollout status deploy/roll --timeout=90s >/dev/null
kubectl -n "$ns" rollout status deploy/recr --timeout=90s >/dev/null

lowest_available() {  # roll the deployment to a new image, sampling availableReplicas
  local min=4
  kubectl -n "$ns" set image deploy/$1 c=nginx:1.28-alpine >/dev/null
  for _ in $(seq 1 80); do
    a=$(kubectl -n "$ns" get deploy $1 -o jsonpath='{.status.availableReplicas}'); a=\${a:-0}
    [ "$a" -lt "$min" ] && min=$a
    [ "$(kubectl -n "$ns" get deploy $1 -o jsonpath='{.status.updatedReplicas}')" = 4 ] && [ "$a" = 4 ] && break
    sleep 0.5
  done
  echo "$min"
}
echo "RollingUpdate (maxUnavailable 0): lowest available Pods during the update = $(lowest_available roll)/4  (never drops - zero downtime)"
echo "Recreate:                         lowest available Pods during the update = $(lowest_available recr)/4  (a full-outage window)"`,
        output: `RollingUpdate (maxUnavailable 0): lowest available Pods during the update = 4/4  (never drops - zero downtime)
Recreate:                         lowest available Pods during the update = 0/4  (a full-outage window)`,
        explain: 'Two Deployments are created that differ only in their update strategy: one uses RollingUpdate with maxSurge one and maxUnavailable zero, the other uses Recreate. Both start with four Ready Pods. Each is then updated to a new image while a loop samples the Deployment\'s availableReplicas count and records the lowest value it ever sees. For the rolling Deployment the lowest is four — because maxUnavailable is zero, Kubernetes always brings up a new Pod and waits for it to be Ready before removing an old one, so the count of available Pods never dips below the desired number; the cost is that briefly there are five Pods (the surge). For the Recreate Deployment the lowest is zero — Kubernetes scales the old ReplicaSet all the way down, and only once every old Pod is gone does it start creating the new ones, so there is a window during which no Pod is serving. That window is a full outage. This is why Recreate is reserved for cases where old and new genuinely cannot run at the same time, or for environments where a short outage does not matter; every other workload should use a rolling update or a strategy built on top of one.',
        explainHi: 'Do Deployments create hote hain jo sirf apni update strategy mein differ karte hain: ek RollingUpdate use karta hai maxSurge one aur maxUnavailable zero ke saath, doosra Recreate use karta hai. Dono chaar Ready Pods se shuru hote hain. Har ek phir ek naye image par update hota hai jabki ek loop Deployment ke availableReplicas count ko sample karta hai aur sabse kam value record karta hai jo ye kabhi dekhta hai. Rolling Deployment ke liye sabse kam chaar hai — kyunki maxUnavailable zero hai, Kubernetes hamesha ek naya Pod up laता hai aur iske Ready hone ka wait karta hai ek old ko remove karne se pehle. Recreate Deployment ke liye sabse kam zero hai — Kubernetes old ReplicaSet ko poori tarah down scale karta hai, aur sirf ek baar har old Pod chala gaya to ye naye banाना shuru karta hai. Wo window ek full outage hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# using blue-green but scaling blue down the moment you cut over
# 1. green deployed, verified
# 2. patch Service selector -> green    (cutover)
# 3. kubectl scale deploy/web-blue --replicas=0   <-- immediately, "to save the infra cost"
# 30 minutes later green shows a slow memory leak. rollback plan: flip back to blue...
# ...but blue is at 0 replicas. now rollback means SCALING BLUE UP (2-3 min) + waiting for
# readiness - exactly the slow rollback blue-green was supposed to eliminate.`,
        right: `# keep blue at FULL capacity until green has "baked" long enough to trust:
# 1. green deployed, verified in prod (separate hostname)
# 2. cutover: patch Service selector -> green
# 3. LEAVE blue running, at full replicas, for the agreed soak window (hours - a full
//    traffic cycle, a peak, a batch run)
# 4. only after green is trusted: scale blue to 0 (or delete it)
# rollback during the soak = one selector flip, instant, because blue is still there.
# the doubled infra cost for a few hours IS the price of the instant rollback.`,
        why: 'The entire value of blue-green over a rolling update is that rollback is instantaneous: a single change of a pointer sends all traffic back to a version that is already running at full capacity. That guarantee only holds while the old version is actually still running at full capacity. Scaling the old deployment to zero immediately after the cutover, to reclaim the infrastructure, destroys the guarantee — the old version is no longer warm and ready, so a rollback now requires scaling it back up and waiting for its Pods to become Ready, which is the same multi-minute delay a rolling-update rollback has. Since problems with a new version frequently appear only after it has been under real load for a while — a memory leak, a slow resource exhaustion, a bug on a code path that is rare but not that rare — the old version needs to stay fully available through a deliberate soak period that covers a representative slice of traffic, and only be scaled down once the new version has earned trust. The doubled infrastructure cost during that window is not waste; it is precisely what is being paid for.',
        whyHi: 'Blue-green ki poori value ek rolling update ke upar ye hai ki rollback instantaneous hai: ek pointer ka ek single change saara traffic wapas ek version ko bhejता hai jo already full capacity par running hai. Wo guarantee sirf tab hold karti hai jab old version actually abhi bhi full capacity par running hai. Cutover ke turant baad old deployment ko zero par scale karna, infrastructure reclaim karne ke liye, guarantee destroy karta hai — old version ab warm aur ready nahi hai, to ek rollback ab ise wapas up scale karne aur iske Pods ke Ready hone ka wait karne ki zaroorat hai. Kyunki ek naye version ke saath problems often sirf tab appear hote hain jab ye thodी der ke liye real load ke tahat raha ho, old version ko ek deliberate soak period ke through fully available rehna chahiye. Us window ke dauraan doubled infrastructure cost waste nahi hai; ye theek wo hai jiske liye pay kiya ja raha hai.',
      },
      {
        wrong: `# rolling update with a NON-backward-compatible change
# v2 renames a JSON response field  { "userName": ... }  ->  { "user_name": ... }
# during the 4-minute roll, the fleet is a MIX of v1 and v2 pods behind one Service.
# a client makes 3 requests in that window: hits v2 (gets user_name), v1 (gets userName),
# v2 again (user_name). the client's parser breaks intermittently and irreproducibly.
# same class of bug: v2 stops writing a column v1 still reads; v2 changes a queue message
# format v1 consumers can't parse; v2 needs a config key that isn't set for v1.`,
        right: `# a rolling update REQUIRES the new version to be compatible with the old one running
# beside it. use expand/contract (Lesson 4):
#   release A: v1.5 - ADDS 'user_name' alongside 'userName', writes both, reads either
#   (roll this out - v1.4 and v1.5 coexist fine; both fields present)
#   release B: v1.6 - clients now read 'user_name'; server still writes both
#   release C: v1.7 - REMOVE 'userName' (nothing reads it anymore)
# each release is backward-compatible with the one before -> safe to roll.
# if you truly can't make it compatible -> Recreate (downtime) or blue-green (no version mix).`,
        why: 'A rolling update replaces Pods a few at a time, so for the duration of the roll the Service is backed by a mixture of old and new Pods, and a single client\'s consecutive requests can land on different versions. Any change where the new version is not compatible with the old version — a renamed or removed response field, a changed message format, a column the new code stops populating that the old code still reads, a new required configuration value — produces intermittent, request-dependent failures during that window that are hard to reproduce because they depend on which Pod answered. The rolling update strategy is only safe for changes that are backward-compatible with the previous version, because the previous version is genuinely still serving. Incompatible changes must be broken into a sequence of individually compatible releases using the expand/contract pattern: first add the new thing alongside the old and support both, roll that out, then migrate readers to the new thing, roll that out, then remove the old thing once nothing uses it. If a change genuinely cannot be made compatible even in steps, the options are Recreate, which accepts downtime in exchange for never running both versions, or blue-green, which switches atomically so there is no mixed-version window.',
        whyHi: 'Ek rolling update Pods ko kuch ek baar mein replace karta hai, to roll ke duration ke liye Service old aur new Pods ke mixture se backed hai, aur ek single client ki consecutive requests alag versions par land kar sakti hain. Koi bhi change jahaan naya version old version ke saath compatible nahi hai — ek renamed ya removed response field, ek changed message format, ek column jo naya code populate karna band karta hai jo old code abhi bhi reads — us window ke dauraan intermittent, request-dependent failures produce karta hai. Rolling update strategy sirf un changes ke liye safe hai jo previous version ke saath backward-compatible hain. Incompatible changes ko expand/contract pattern use karके individually compatible releases ke ek sequence mein toda jaana chahiye.',
      },
      {
        wrong: `# calling "we deploy to a small group first" a canary when there's no metric gate
# process: deploy v2 to the "canary" namespace (5% of pods), then a human eyeballs a
# dashboard for "a while", then clicks promote.
# problems: (1) nobody actually watches for the full bake time at 2am
//           (2) "looks fine" misses a +40ms p99 or a 0.3% error-rate bump
//           (3) the decision is inconsistent (depends who's on call)
#           (4) rollback is manual and slow when the human finally notices
# this is a staged rollout, not progressive delivery.`,
        right: `# a real canary has an AUTOMATED analysis gate (Lesson 3):
#   - define the success metrics: error-rate < X, p99 latency < Y, (optional) a business KPI
//     compared canary-vs-stable over the bake window
#   - a controller (Argo Rollouts / Flagger) runs the analysis at each step and
//     PROMOTES on pass / ABORTS + rolls back on fail - no human in the loop for the common case
#   - a human is only paged on abort, or for a genuinely ambiguous result
# without traffic-splitting + metrics + an analysis gate, you have a manual staged rollout;
# that's still better than all-at-once, but don't call it a canary.`,
        why: 'A canary deployment is defined by the feedback loop that controls it: a small share of real traffic goes to the new version, its behaviour is compared against the old version on concrete metrics over a bake period, and the result of that comparison automatically decides whether to proceed or roll back. Sending a new version to a small group of Pods and then having a person look at a dashboard and click a button is a staged rollout, and it is missing the parts that make a canary valuable. A human watching a dashboard does not reliably catch a small latency regression or a fractional error-rate increase, does not consistently wait the full bake time especially outside business hours, makes different decisions depending on who is on call, and reacts slowly when something does go wrong. An automated analysis gate — explicit thresholds on error rate and latency, evaluated by a controller that promotes on success and aborts on failure without waiting for a human — is what turns a staged rollout into progressive delivery. It requires traffic-splitting and a metrics source, and building that is the precondition for doing canary properly; until it exists, a manual staged rollout is a reasonable interim that should not be mistaken for the real thing.',
        whyHi: 'Ek canary deployment us feedback loop se defined hai jo ise control karti hai: real traffic ka ek chhota share naye version ko jaata hai, iska behaviour old version ke against concrete metrics par ek bake period ke dauraan compare kiya jaata hai, aur us comparison ka result automatically decide karta hai proceed ya roll back karna. Ek naye version ko Pods ke ek chhote group ko bhejना aur phir ek person ke ek dashboard dekhने aur ek button click karne ka matlab ek staged rollout hai. Ek human ek dashboard dekhते hue reliably ek chhota latency regression ya ek fractional error-rate increase catch nahi karta. Ek automated analysis gate — error rate aur latency par explicit thresholds, ek controller dwara evaluated jo success par promote karta hai aur failure par abort karta hai — wo hai jo ek staged rollout ko progressive delivery mein badalता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A "blue-green" rollback that took 6 minutes** — blue was scaled to 0 immediately after cutover to save cost. When green\'s connection pool exhausted 20 minutes later, the "instant" rollback meant scaling blue from 0 and waiting for readiness. Now blue is kept at full replicas for a 4-hour soak.',
        hi: '**Ek "blue-green" rollback jo 6 minute laga** — cutover ke turant baad blue ko cost bachaने ke liye 0 par scale kiya gaya. Ab blue ek 4-hour soak ke liye full replicas par rakha jaata hai.',
      },
      {
        en: '**Intermittent JSON parse errors on every deploy for months** — a rolling update served a mix of pods, and v2 had renamed a field. Only reproducible "sometimes". Fixed by adopting expand/contract: add the new field, roll, migrate readers, roll, remove the old field.',
        hi: '**Mahinon ke liye har deploy par intermittent JSON parse errors** — ek rolling update pods ka ek mix serve karता tha, aur v2 ne ek field rename kiya tha. Expand/contract adopt karके fix kiya.',
      },
      {
        en: '**A "canary" that promoted a broken build** — the process was "deploy to 5%, on-call eyeballs Grafana for 15 min, clicks promote". At 3am the on-call clicked promote after 4 minutes; a +0.4% error rate became a full incident 20 minutes later. Moved to Argo Rollouts with an automated error-rate analysis gate.',
        hi: '**Ek "canary" jisne ek broken build promote kiya** — process "5% par deploy, on-call 15 min Grafana dekhता hai, promote click karता hai" tha. Ek automated error-rate analysis gate ke saath Argo Rollouts par move kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'Compare recreate, rolling, blue-green and canary deployments on downtime, rollback speed, cost and blast radius.',
        qHi: 'Recreate, rolling, blue-green aur canary deployments ko downtime, rollback speed, cost aur blast radius par compare karo.',
        a: 'Recreate stops all old Pods and then starts all new Pods, so there is a full-outage window; its rollback is another recreate, so also with downtime; it costs nothing extra; and because the versions never overlap there is no mixed-version blast radius, but a bad version reaches all users at once when it comes up. Rolling update, the default, replaces Pods a few at a time with a small surge, so there is no downtime and no meaningful extra cost, but old and new run side by side for the minutes the roll takes, the new version must be backward-compatible, rollback is another rolling update taking the same few minutes, and a bad change reaches a growing fraction of users during the roll before you notice. Blue-green runs the entire new version beside the entire old one and flips all traffic at once by changing a pointer, so there is no downtime, rollback is instant because the old version is still fully running, but you pay roughly double the infrastructure during the overlap and the switch is all-at-once with no gradual soak. Canary sends a small percentage of live traffic to the new version, watches metrics, and increases the percentage in steps, so the blast radius of a regression is limited to that small percentage and an automated gate can abort before it grows; the cost is that it needs traffic-splitting and reliable metrics, and a full rollout deliberately takes an hour or more. Most services run rolling as the default and use blue-green or canary for specific high-risk changes.',
        aHi: 'Recreate saare old Pods stop karta hai aur phir saare new Pods start karta hai, to ek full-outage window hai; iska rollback ek aur recreate hai; ye kuch extra cost nahi karta; aur kyunki versions kabhi overlap nahi karte koi mixed-version blast radius nahi hai. Rolling update, default, Pods ko kuch ek baar mein replace karta hai, to koi downtime nahi aur koi meaningful extra cost nahi, par old aur new saath chalाते hain jitne minutes roll leta hai, naya version backward-compatible hona chahiye, rollback ek aur rolling update hai. Blue-green poore naye version ko poore old ke bagal chalाता hai aur saara traffic ek saath flip karta hai, to koi downtime nahi, rollback instant hai, par aap overlap ke dauraan lagbhag double infrastructure pay karते ho. Canary live traffic ka ek chhota percentage naye version ko bhejता hai, metrics dekhता hai, aur percentage ko steps mein badhाता hai, to ek regression ka blast radius us chhote percentage tak limited hai.',
      },
      {
        q: 'When is a rolling update unsafe, and what do you do instead?',
        qHi: 'Ek rolling update kab unsafe hai, aur aap iske bajaay kya karte ho?',
        a: 'A rolling update is unsafe whenever the new version is not backward-compatible with the old version, because during the roll the Service is backed by a mixture of old and new Pods, both serving live traffic, and a single client\'s consecutive requests can hit different versions. Concretely, that means any change that renames or removes a response field, changes a message or event format that other components consume, stops writing a column or key that the old code still reads, or introduces a new required configuration value that is not present for the old version. During the roll these produce intermittent failures that depend on which Pod answered and are hard to reproduce. The fix for most such changes is the expand/contract pattern: first make a release that adds the new form alongside the old and supports both, roll it out so old and new coexist safely, then make a release that switches consumers to the new form, roll that out, then make a release that removes the old form once nothing uses it. Each step is backward-compatible with the one before, so each is a safe rolling update. If a change genuinely cannot be decomposed into compatible steps, the alternatives are Recreate, which accepts a downtime window in exchange for never running both versions simultaneously, or blue-green, which cuts over atomically so there is no period where both versions serve.',
        aHi: 'Ek rolling update tab unsafe hai jab naya version old version ke saath backward-compatible nahi hai, kyunki roll ke dauraan Service old aur new Pods ke mixture se backed hai, dono live traffic serve karte hue, aur ek single client ki consecutive requests alag versions par hit kar sakti hain. Concretely, iska matlab koi bhi change jo ek response field rename ya remove karta hai, ek message format badalता hai, ek column likhना band karता hai jo old code abhi bhi reads, ya ek naya required configuration value introduce karता hai. Zyadaatar aisे changes ke liye fix expand/contract pattern hai: pehle ek release banao jo naye form ko old ke bagal add karता hai aur dono support karता hai, ise roll out karo, phir ek release banao jo consumers ko naye form par switch karता hai, phir ek release jo old form remove karता hai. Agar ek change genuinely compatible steps mein decompose nahi ho sakta, alternatives Recreate ya blue-green hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, place recreate / rolling / blue-green / canary / shadow on the downtime × rollback-speed × cost × blast-radius axes, with a one-line "use when".',
        taskHi: 'Ek comment mein, recreate / rolling / blue-green / canary / shadow ko axes par rakho.',
        hint: 'RECREATE (`strategy: { type: Recreate }` — scale all old to 0, THEN all new up): downtime = FULL outage window; rollback = another recreate (downtime); cost = nothing extra; blast radius = no mixed-version skew, but the bad version hits 100% at once. USE WHEN: old + new genuinely can\'t coexist (exclusive lock, incompatible schema, a singleton), or dev/CI/batch where a short outage is fine. ROLLING (the DEFAULT — `maxSurge`/`maxUnavailable`, replace a few at a time): downtime = none; rollback = another rolling update (minutes, serves a MIX meanwhile); cost = ~1 surge Pod; blast radius = v1+v2 coexist for the roll → new version MUST be backward-compatible; a bad change reaches a growing % before you notice. USE WHEN: the default for backward-compatible changes. BLUE-GREEN (full green beside full blue, flip a pointer — Service selector / ingress backend / LB target — all at once): downtime = none; rollback = INSTANT (flip back, blue still fully running); cost = ~2x infra during the overlap; blast radius = sharp 0→100%, no soak. USE WHEN: a minutes-long rollback serving a version mix is unacceptable (payments, a launch); keep blue at FULL replicas through a soak window, don\'t scale it to 0 at cutover. CANARY (small % of live traffic to new, watch metrics, step up): downtime = none; rollback = fast abort; cost = small; blast radius = SMALLEST (a regression hits ~1-5%, an automated gate aborts). USE WHEN: a regression reaching 5% is unacceptable AND you have traffic-splitting + reliable metrics (Lesson 3). SHADOW (COPY prod traffic to new, DISCARD its responses): not a rollout — a pre-prod test under real load/data with ZERO user risk; must neutralise side effects (no double email/charge/write). USE WHEN: catching perf regressions / crashes that only appear at scale, before rolling out by another strategy.',
        hintHi: 'RECREATE (saare old 0 par, PHIR saare new up): downtime = FULL outage; rollback = downtime; cost = kuch nahi; blast radius = koi mixed-version skew nahi par bad version 100% ek saath. USE WHEN: old + new coexist nahi kar sakte, ya dev/CI/batch. ROLLING (DEFAULT): downtime = none; rollback = ek aur rolling update (minutes, MIX serve); cost = ~1 surge Pod; blast radius = v1+v2 coexist → backward-compatible HONA CHAHIYE. BLUE-GREEN (full green + full blue, ek pointer flip): downtime = none; rollback = INSTANT; cost = ~2x infra; blast radius = sharp 0→100%. USE WHEN: minutes-long rollback unacceptable; blue ko FULL replicas par soak ke through rakho. CANARY (chhota % live traffic, metrics dekho): blast radius = SABSE CHHOTA; traffic-splitting + metrics chahiye. SHADOW (prod traffic COPY, responses DISCARD): ek rollout nahi — ek pre-prod test.',
      },
      {
        task: 'In a comment, explain why blue-green rollback stops being instant if you scale blue to 0 at cutover, and what a soak window is for.',
        taskHi: 'Ek comment mein, samjhao ki blue-green rollback instant kyun nahi rehta agar aap cutover par blue ko 0 par scale karते ho.',
        hint: 'The ENTIRE value of blue-green over a rolling update is that rollback is INSTANTANEOUS: a single pointer change sends 100% of traffic back to a version ALREADY RUNNING AT FULL CAPACITY. That guarantee only holds WHILE blue is still running at full capacity. Scaling blue to 0 right after cutover (to "save the infra cost") DESTROYS the guarantee — blue is no longer warm/Ready, so rollback now means SCALING BLUE UP + waiting for its Pods to pass readiness = the SAME multi-minute delay a rolling-update rollback has. THE SOAK WINDOW: problems with a new version frequently appear only AFTER real load for a while — a memory leak, slow resource exhaustion, a bug on a rare-but-not-that-rare code path, a connection-pool exhaustion. So keep blue at FULL replicas through a deliberate soak that covers a representative slice of traffic (hours — a full traffic cycle, a peak, a nightly batch run), and only scale blue to 0 (or delete it) once green has EARNED trust. The doubled infra cost for those hours is NOT waste — it is exactly the thing you are paying for (the instant rollback). (DB caveat: blue + green usually share one database, so a green schema change must still be backward-compatible with blue for the rollback to actually work — Lesson 5.)',
        hintHi: 'Blue-green ki POORI value ek rolling update ke upar ye hai ki rollback INSTANTANEOUS hai: ek single pointer change 100% traffic ek version ko wapas bhejता hai jo ALREADY FULL CAPACITY par RUNNING hai. Wo guarantee sirf tab hold karti hai JAB blue abhi bhi full capacity par running hai. Cutover ke turant baad blue ko 0 par scale karna guarantee DESTROY karta hai — rollback ab BLUE KO UP SCALE karna + readiness ka wait = SAME multi-minute delay. SOAK WINDOW: ek naye version ke saath problems often sirf REAL LOAD ke BAAD appear hote hain — ek memory leak, slow resource exhaustion. To blue ko FULL replicas par ek deliberate soak ke through rakho (hours), aur sirf blue ko 0 par scale karo jab green ne trust EARN kiya ho. Doubled infra cost waste NAHI hai.',
      },
      {
        task: 'In a comment, explain why a rolling update requires backward compatibility, and how expand/contract makes an incompatible change safe.',
        taskHi: 'Ek comment mein, samjhao ki ek rolling update ko backward compatibility kyun chahiye.',
        hint: 'A rolling update replaces Pods A FEW AT A TIME, so for the minutes the roll takes the Service is backed by a MIXTURE of old + new Pods, both serving live traffic — a single client\'s consecutive requests can land on DIFFERENT versions. So any change where new is NOT compatible with old produces INTERMITTENT, request-dependent failures that are hard to reproduce (depend on which Pod answered): a renamed/removed response field; a changed message/event format other components consume; a column/key the new code stops populating that the old code still reads; a new REQUIRED config value not set for the old version. EXPAND/CONTRACT (parallel change — Lesson 4) breaks an incompatible change into a SEQUENCE of individually-compatible releases, e.g. rename `userName` → `user_name`: (A) v1.5 ADDS `user_name` alongside `userName`, writes BOTH, reads either → roll out (v1.4 + v1.5 coexist fine); (B) v1.6 switches readers/clients to `user_name`, server still writes both → roll out; (C) v1.7 REMOVES `userName` (nothing reads it) → roll out. Each release is backward-compatible with the one before → each is a safe rolling update. If a change genuinely CAN\'T be decomposed into compatible steps → Recreate (accept downtime, never run both) or blue-green (atomic cutover, no mixed-version window).',
        hintHi: 'Ek rolling update Pods ko KUCH EK BAAR MEIN replace karta hai, to roll ke minutes ke liye Service old + new Pods ke MIXTURE se backed hai — ek single client ki consecutive requests ALAG versions par land kar sakti hain. To koi bhi change jahaan new old ke saath compatible NAHI hai INTERMITTENT, request-dependent failures produce karta hai: ek renamed/removed response field; ek changed message format; ek column jo naya code populate karna band karta hai jo old code abhi bhi reads; ek naya REQUIRED config value. EXPAND/CONTRACT ek incompatible change ko individually-compatible releases ke ek SEQUENCE mein toda: (A) naye form ko old ke bagal ADD karo, DONO support karo → roll; (B) readers ko naye form par switch karo → roll; (C) old form REMOVE karo → roll. Har release backward-compatible hai.',
      },
    ],

    keyTakeaways: [
      'EVERY strategy trades DOWNTIME × ROLLBACK SPEED × INFRA COST × BLAST RADIUS — you can\'t optimise all four. RECREATE (`strategy: Recreate` — all old to 0, THEN all new): a FULL OUTAGE window; use only when old+new genuinely can\'t coexist, or dev/CI/batch. ROLLING (the DEFAULT — `maxSurge`/`maxUnavailable`): no downtime, ~1 surge Pod, but v1+v2 serve SIMULTANEOUSLY for the roll → the new version MUST be backward-compatible; rollback = another rolling update (minutes, mixed meanwhile).',
      'BLUE-GREEN: full green beside full blue, flip ALL traffic at once via a pointer (Service selector / ingress backend / LB target). INSTANT cutover AND instant rollback (flip back — blue never left); you can smoke-test green in prod first. COST: ~2x infra during the overlap; the switch is sharp 0→100% with no soak. THE TRAP: don\'t scale blue to 0 at cutover — that makes rollback = "scale blue up + wait for readiness" (the slow rollback you were avoiding). Keep blue at FULL replicas through a deliberate SOAK window (hours — leaks/pool-exhaustion show up late), then scale it down.',
      'CANARY: a small % of live traffic to the new version, watch metrics, step up (25/50/100) with a BAKE time each step; a real canary has an AUTOMATED ANALYSIS GATE (error rate / latency thresholds, canary-vs-stable) that PROMOTES on pass and ABORTS + rolls back on fail — no human in the common case. SMALLEST blast radius. Needs traffic-splitting + reliable metrics; without them you have a manual STAGED ROLLOUT (still better than all-at-once, but not progressive delivery). Slowest full rollout. (Lesson 3.)',
      'SHADOW (mirroring): send the new version a COPY of production traffic; it processes for real but its responses are DISCARDED. Tests under genuine prod load + data shapes with ZERO user risk. Must NEUTRALISE side effects (no confirmation email, no card charge, no prod DB write) or you double everything. It is a PRE-PRODUCTION TEST, not a rollout — you still deploy by rolling/blue-green/canary afterward.',
      'KUBERNETES BUILT-INS: a `Deployment` gives `Recreate` + `RollingUpdate` natively. Blue-green and canary need EITHER two Deployments + a pointer flip / weighting you drive, OR a controller (Argo Rollouts, Flagger) that adds a `Rollout`/`Canary` resource with those strategies + analysis built in. CHOOSE BY: can old+new coexist (incl. against the shared DB)? → no ⇒ Recreate or blue-green. Is a minutes-long mixed rollback unacceptable? → yes ⇒ blue-green. Is a regression at 5% of users unacceptable? → yes ⇒ canary (⇒ you need traffic-splitting + metrics first). Most services: rolling by default, blue-green/canary for the specific high-risk changes.',
    ],
    keyTakeawaysHi: [
      'HAR strategy DOWNTIME × ROLLBACK SPEED × INFRA COST × BLAST RADIUS trade karti hai — chaaron optimise nahi kar sakte. RECREATE (saare old 0 par, PHIR saare new): ek FULL OUTAGE window; sirf tab jab old+new coexist nahi kar sakte. ROLLING (DEFAULT): koi downtime nahi, par v1+v2 roll ke liye SAATH serve karte hain → naya version backward-compatible HONA CHAHIYE; rollback = ek aur rolling update (minutes, meanwhile mixed).',
      'BLUE-GREEN: full green + full blue, ek pointer se SAARA traffic ek saath flip. INSTANT cutover AUR instant rollback. COST: overlap ke dauraan ~2x infra. THE TRAP: cutover par blue ko 0 par scale MAT karo — us se rollback = "blue up scale + readiness wait". Blue ko FULL replicas par ek deliberate SOAK window ke through rakho.',
      'CANARY: live traffic ka ek chhota %, metrics dekho, step up karo har step par ek BAKE time ke saath; ek real canary ka ek AUTOMATED ANALYSIS GATE hai jo pass par PROMOTE aur fail par ABORT + roll back karta hai. SABSE CHHOTA blast radius. Traffic-splitting + reliable metrics chahiye; unke bina aapke paas ek manual STAGED ROLLOUT hai. (Lesson 3.)',
      'SHADOW: naye version ko production traffic ki ek COPY bhejo; ye for real process karta hai par iske responses DISCARDED hain. ZERO user risk. Side effects NEUTRALISE karne chahiye. Ye ek PRE-PRODUCTION TEST hai, ek rollout nahi.',
      'KUBERNETES BUILT-INS: ek `Deployment` `Recreate` + `RollingUpdate` natively deta hai. Blue-green aur canary ke liye YA to do Deployments + ek pointer flip, YA ek controller (Argo Rollouts, Flagger) chahiye. CHOOSE BY: kya old+new coexist kar sakte hain? nahi ⇒ Recreate ya blue-green. Kya ek minutes-long mixed rollback unacceptable hai? haan ⇒ blue-green. Kya 5% users par ek regression unacceptable hai? haan ⇒ canary. Zyadaatar services: rolling by default.',
    ],
  },

  {
    slug: 'ops-decouple-deploy-from-release-and-feature-flags',
    title: 'Decouple Deploy from Release & Feature Flags',
    titleHi: 'Deploy Ko Release Se Decouple Karo & Feature Flags',
    description: 'Deploy means the new code is running on the servers. Release means users are getting the new behaviour. They do not have to be the same event. A feature flag lets you ship code dark, turn it on for a fraction of users, and turn it off in seconds if it misbehaves — without another deploy.',
    descriptionHi: 'Deploy ka matlab naya code servers par running hai. Release ka matlab users ko naya behaviour mil raha hai. Wo same event nahi hone chahiye. Ek feature flag aapko code ko dark ship karne, ise users ke ek fraction ke liye on karne, aur ise seconds mein off karne deta hai agar ye misbehave kare — bina ek aur deploy ke.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A shop fitting a new checkout counter overnight, curtained off.** *Deploy* is the builders installing the counter while the shop is closed — it is physically there, wired up, tested, but hidden behind a curtain, and customers on opening day still use the old tills. *Release* is a separate decision: the manager pulls the curtain back. And the curtain has a **dimmer** — pull it back for staff only, then for customers named on a list, then for one in twenty, then everyone — and if the new counter jams, the manager closes the curtain in one motion, no builders required. The old tills were never removed, so "closing the curtain" is instant. Later, once the new counter has run flawlessly for a month, the builders come back and rip out the old tills and the curtain rail entirely — because a curtain you never close again is just clutter (flag debt).',
      hi: '**Ek shop raat mein ek naya checkout counter fit kar rahi hai, curtained off.** *Deploy* builders counter install kar rahe hain jab shop band hai — ye physically wahaan hai, wired up, tested, par ek curtain ke peeche chhupा, aur opening day par customers abhi bhi purane tills use karte hain. *Release* ek alag decision hai: manager curtain wapas kheenchता hai. Aur curtain mein ek **dimmer** hai — ise sirf staff ke liye kheenचो, phir ek list par named customers ke liye, phir bees mein ek ke liye, phir sab. Aur agar naya counter jam ho, manager ek motion mein curtain band karta hai, koi builders required nahi. Purane tills kabhi remove nahi hue, to "curtain band karna" instant hai. Baad mein, ek baar naya counter ek mahine flawlessly chal jaaye, builders wapas aate hain aur purane tills poori tarah rip out karte hain.',
    },

    simple: `**DEPLOY != RELEASE:**
\`\`\`
DEPLOY    the new build is running on the servers. it may be DARK - reachable but not
          doing anything visible. this is a technical event: a pipeline finished.
RELEASE   users are getting the new behaviour. this is a PRODUCT decision: someone
          (or a rule, or a schedule) turned it on. can be gradual, targeted, reversible.
\`\`\`

**A FEATURE FLAG is a runtime conditional** that gates the new behaviour:
\`\`\`
if (flags.isEnabled("new_checkout", { userId, plan, region })) {
    return newCheckout();     // shipped weeks ago, dark until now
} else {
    return oldCheckout();     // still here - the fallback
}
\`\`\`
The flag value comes from a **flag service / config** evaluated at request time, NOT from
the deployed artifact. Flipping it is a config change (seconds), not a deploy (minutes).

**WHAT FLAGS BUY YOU:**
\`\`\`
KILL SWITCH        new feature misbehaving? flag OFF -> instant, no rollback, no redeploy.
                   the buggy code is still deployed; it's just not being taken.
GRADUAL ROLLOUT    on for 1% -> 5% -> 25% -> 100%, watching metrics between - a canary you
                   control in software, no traffic-splitting infra needed.
TARGETING          on for: internal users / beta list / one region / one plan tier / a %
                   bucket by user id (sticky - a user doesn't flip-flop between requests).
TRUNK-BASED DEV    merge unfinished work to main behind an OFF flag (Module 4) - no
                   long-lived branch, CI stays green, the work integrates continuously.
DECOUPLE TIMING    engineering ships when ready; product/marketing releases when they want
                   (a launch date, after a support-team briefing, a coordinated multi-service go).
\`\`\`

**FLAG TYPES:** release flags (short-lived, remove after 100%), ops flags (kill switches,
circuit breakers - live longer), permission flags (entitlements - permanent), experiment
flags (A/B - remove after the experiment).

**FLAG DEBT is real.** Every flag is a branch in the code = 2x the paths to test + reason
about. A flag left in after it's 100%-on forever is dead weight and a footgun (someone
flips it OFF years later). RULE: every release flag gets a removal ticket / expiry date;
audit and delete stale flags on a schedule. Tools (LaunchDarkly, Unleash, Flagsmith,
OpenFeature) track flag age + last-evaluated and nag you.`,

    simpleHi: `**DEPLOY != RELEASE:**
\`\`\`
DEPLOY    naya build servers par running hai. ye DARK ho sakta hai - reachable par kuch
          visible nahi kar raha. ye ek technical event hai: ek pipeline khatam hua.
RELEASE   users ko naya behaviour mil raha hai. ye ek PRODUCT decision hai: kisi ne
          (ya ek rule, ya ek schedule) ise on kiya. gradual, targeted, reversible ho sakta hai.
\`\`\`

**Ek FEATURE FLAG ek runtime conditional hai** jo naye behaviour ko gate karta hai:
\`\`\`
if (flags.isEnabled("new_checkout", { userId, plan, region })) {
    return newCheckout();     // hafton pehle shipped, ab tak dark
} else {
    return oldCheckout();     // abhi bhi yahaan - fallback
}
\`\`\`
Flag value ek **flag service / config** se aati hai jo request time par evaluated hai, deployed
artifact se NAHI. Ise flip karna ek config change hai (seconds), ek deploy nahi (minutes).

**FLAGS AAPKO KYA DETE HAIN:**
\`\`\`
KILL SWITCH        naya feature misbehave kar raha? flag OFF -> instant, koi rollback nahi.
GRADUAL ROLLOUT    1% -> 5% -> 25% -> 100% ke liye on, beech mein metrics dekhते hue.
TARGETING          on for: internal users / beta list / ek region / ek plan tier / ek %
                   bucket by user id (sticky).
TRUNK-BASED DEV    unfinished work ko main mein ek OFF flag ke peeche merge karo (Module 4).
DECOUPLE TIMING    engineering ready hone par ships; product/marketing jab chahein release karte hain.
\`\`\`

**FLAG TYPES:** release flags (short-lived), ops flags (kill switches - longer), permission
flags (permanent), experiment flags (A/B).

**FLAG DEBT real hai.** Har flag code mein ek branch hai = 2x paths to test. Ek flag jo
100%-on hone ke baad rakha gaya forever dead weight hai. RULE: har release flag ko ek removal
ticket / expiry date milta hai; stale flags ko schedule par audit aur delete karo.`,

    content: `## Two events, not one

When a pipeline finishes and the new version is running on the production servers, that is a **deploy**. It is a technical fact and a low-risk one: if the deploy itself is done safely (rolling, health-gated), the new code is present but does not have to be doing anything a user can see.

**Release** is when users start getting the new behaviour. That is a separate decision, and it can be made by a person, a rule, or a schedule, and it can be gradual, targeted at specific users, and reversed in seconds.

Collapsing the two — every deploy immediately changes what every user experiences — means every code change carries full release risk, the timing of a user-facing change is dictated by when engineering merges, and the only way to undo a bad change is another deploy. Separating them means code can ship continuously and safely while releases are controlled independently.

## The feature flag

A **feature flag** (or feature toggle) is a conditional in the code that chooses between the new behaviour and the old one based on a value looked up at runtime:

\`\`\`
if (flags.enabled("new_pricing_engine", context)) {
    price = newPricingEngine.compute(cart);
} else {
    price = legacyPricing.compute(cart);
}
\`\`\`

The crucial part is *where the flag value comes from*: not the deployed artifact, but a **configuration source evaluated per request** — a flag-management service, a config file the app watches, a database row, a ConfigMap. Because the value is external, changing it is a configuration change that takes effect in seconds, with no build, no deploy, and no restart. The new code path has been deployed, possibly for weeks; the flag is what makes it live.

## What decoupling buys you

- **A kill switch.** If a released feature starts causing errors, turning the flag off reverts every user to the old path immediately. There is no rollback of code, no redeploy, no waiting for Pods — the new code is still deployed, it is simply not being executed. This is the fastest possible mitigation.
- **Gradual rollout.** Enable the flag for 1% of users, watch error rates and latency and business metrics, then 5%, 25%, 100%. This is a canary that you run entirely in application logic, without needing a service mesh or traffic-splitting infrastructure — the split is "does this user's flag evaluate true."
- **Targeting.** Turn a feature on for internal users first, then a named beta list, then one region, then one pricing tier, then a percentage bucket. Percentage buckets must be **sticky** — hashed on a stable user id — so a given user gets a consistent answer across requests and does not see the feature flicker.
- **Trunk-based development.** A large feature that takes three weeks does not need a three-week branch. Merge it to main in small pieces behind an off flag (Module 4). The mainline stays green and releasable, CI runs against the integrated code the whole time, and the feature is turned on when it is ready.
- **Decoupled timing.** Engineering deploys when the code is ready and tested. Product and marketing release when they want to — a launch date, after the support team has been briefed, as part of a coordinated switch across several services. The two schedules stop blocking each other.

## Flag types and lifetimes

Flags are not all the same, and how long they should live varies:

- **Release toggles** — hide in-progress work; flip to 100% then **remove**. Lifetime: days to a few weeks.
- **Operational toggles** — kill switches, circuit breakers, load-shedding switches. Lifetime: as long as the operational concern exists, often permanently.
- **Permission toggles / entitlements** — "this customer's plan includes feature X." Not really deployment flags; permanent product configuration.
- **Experiment toggles** — A/B or multivariate tests. Lifetime: the experiment; remove when it concludes.

## Flag debt

Every flag is a branch in the code. The system now has two behaviours where it had one, and both must be tested, monitored, and reasoned about. A handful of flags is manageable; hundreds, most of them long since at 100%, is a serious tax on every change and a source of incidents — someone flips an ancient "always on" flag off during unrelated work and breaks a feature everyone forgot was gated.

The discipline:

- Every **release flag** is created with a removal ticket or an expiry date. When it reaches 100% and has been stable, the cleanup — delete the flag, delete the old code path, delete the tests for the old path — is a task, not an afterthought.
- **Audit flags on a schedule.** List every flag, its age, its last-evaluated time, and its current state. Anything old and permanently on or permanently off is a candidate for deletion.
- Flag-management tools (LaunchDarkly, Unleash, Flagsmith, GrowthBook, and the vendor-neutral OpenFeature standard) track flag age and evaluation and surface stale ones, but the removal still has to be done.

## The relationship to deployment strategies

Feature flags and the deployment strategies from Lesson 1 are complementary, not alternatives. The deployment strategy governs how the new *artifact* reaches the servers safely — rolling, blue-green, canary at the infrastructure level. The feature flag governs how the new *behaviour* reaches users — dark, then targeted, then gradual, then everyone — independently of when the artifact shipped. A mature setup uses both: rolling or blue-green deploys of an always-backward-compatible artifact, with the risky new behaviour inside it gated by a flag that is rolled out on its own schedule and can be killed instantly.`,

    contentHi: `## Do events, ek nahi

Jab ek pipeline khatam hota hai aur naya version production servers par running hai, wo ek **deploy** hai. Ye ek technical fact hai aur ek low-risk hai: agar deploy khud safely kiya jaata hai, naya code present hai par kuch aisा nahi karna chahiye jo ek user dekh sake.

**Release** tab hai jab users naya behaviour paana shuru karते hain. Wo ek alag decision hai, aur ye ek person, ek rule, ya ek schedule dwara banaya ja sakta hai, aur ye gradual, specific users par targeted, aur seconds mein reversed ho sakta hai.

Dono ko collapse karna — har deploy turant badalता hai ki har user kya experience karta hai — matlab har code change full release risk carry karta hai.

## Feature flag

Ek **feature flag** code mein ek conditional hai jo naye behaviour aur old ke beech choose karta hai ek value ke aadhaar par jo runtime par look up ki jaati hai. Crucial part *flag value kahaan se aati hai*: deployed artifact se nahi, balki ek **configuration source jo per request evaluated hai** — ek flag-management service, ek config file, ek database row, ek ConfigMap. Kyunki value external hai, ise badalна ek configuration change hai jo seconds mein effect leता hai, koi build nahi, koi deploy nahi, koi restart nahi.

## Decoupling aapko kya deta hai

- **Ek kill switch.** Agar ek released feature errors cause karna shuru karta hai, flag off karna har user ko old path par turant revert karता hai.
- **Gradual rollout.** Flag ko 1% users ke liye enable karo, metrics dekho, phir 5%, 25%, 100%. Ye ek canary hai jo aap poori tarah application logic mein chalाते ho.
- **Targeting.** Ek feature ko pehle internal users ke liye on karo, phir ek named beta list, phir ek region. Percentage buckets **sticky** hone chahiye.
- **Trunk-based development.** Ek bada feature jo teen hafte leता hai ek teen-hafte branch nahi chahiye. Ise ek off flag ke peeche chhote pieces mein main mein merge karo (Module 4).
- **Decoupled timing.** Engineering deploy karता hai jab code ready hai. Product aur marketing release karते hain jab wo chahein.

## Flag types aur lifetimes

- **Release toggles** — in-progress work chhupाओ; 100% par flip phir **remove**. Lifetime: days to a few weeks.
- **Operational toggles** — kill switches, circuit breakers. Lifetime: often permanently.
- **Permission toggles** — permanent product configuration.
- **Experiment toggles** — A/B tests.

## Flag debt

Har flag code mein ek branch hai. System ke ab do behaviours hain jahaan iske ek tha, aur dono test, monitor, aur reason kiye jaane chahiye. Discipline: har **release flag** ek removal ticket ke saath banaya jaata hai; **schedule par flags audit karo**; flag-management tools stale flags surface karते hain par removal abhi bhi karna hota hai.

## Deployment strategies se relationship

Feature flags aur deployment strategies complementary hain, alternatives nahi. Deployment strategy govern karta hai ki naya *artifact* servers tak safely kaise pahunchता hai. Feature flag govern karta hai ki naya *behaviour* users tak kaise pahunchता hai — independently of jab artifact shipped. Ek mature setup dono use karta hai.`,

    examples: [
      {
        title: 'A feature flag flip is a RELEASE with no deploy: behaviour changes, the Deployment never rolls',
        titleHi: 'Ek feature flag flip ek RELEASE hai bina deploy ke: behaviour badalta hai, Deployment kabhi roll nahi hota',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m11l2-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

flag() {  # write the flags ConfigMap (apply, so no annotation warning on re-apply)
  kubectl -n "$ns" create configmap flags --from-literal=new_checkout="$1" \\
    --dry-run=client -o yaml | kubectl -n "$ns" apply -f - >/dev/null
}
flag off

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: apps/v1
kind: Deployment
metadata: { name: app }
spec:
  replicas: 2
  selector: { matchLabels: { app: app } }
  template:
    metadata: { labels: { app: app } }
    spec:
      containers:
        - name: c
          image: busybox:1.36
          command: [ "sh", "-c", "while true; do sleep 3; done" ]
          volumeMounts: [ { name: f, mountPath: /etc/flags } ]      # flag read from a mounted file
      volumes: [ { name: f, configMap: { name: flags } } ]
YAML
kubectl -n "$ns" rollout status deploy/app --timeout=90s >/dev/null
gen_before=$(kubectl -n "$ns" get deploy app -o jsonpath='{.metadata.generation}')

checkout() { kubectl -n "$ns" exec deploy/app -- sh -c '[ "$(cat /etc/flags/new_checkout)" = on ] && echo "NEW checkout flow" || echo "old checkout flow"'; }
echo "deploy done, flag=off  ->  users get the $(checkout)"

echo "--- RELEASE: flip the flag (a ConfigMap change - NOT a deploy) ---"
flag on
for i in $(seq 1 40); do [ "$(kubectl -n "$ns" exec deploy/app -- cat /etc/flags/new_checkout 2>/dev/null)" = on ] && break; sleep 3; done
gen_after=$(kubectl -n "$ns" get deploy app -o jsonpath='{.metadata.generation}')
echo "flag=on               ->  users get the $(checkout)"
echo "Deployment generation: before=$gen_before  after=$gen_after   (UNCHANGED -> no new Pods, no rollout)"

echo "--- KILL SWITCH: flip it back, instantly ---"
flag off
for i in $(seq 1 40); do [ "$(kubectl -n "$ns" exec deploy/app -- cat /etc/flags/new_checkout 2>/dev/null)" = off ] && break; sleep 3; done
echo "flag=off              ->  users get the $(checkout)   (the new code is still deployed - just not taken)"`,
        output: `deploy done, flag=off  ->  users get the old checkout flow
--- RELEASE: flip the flag (a ConfigMap change - NOT a deploy) ---
flag=on               ->  users get the NEW checkout flow
Deployment generation: before=1  after=1   (UNCHANGED -> no new Pods, no rollout)
--- KILL SWITCH: flip it back, instantly ---
flag=off              ->  users get the old checkout flow   (the new code is still deployed - just not taken)`,
        explain: 'The application reads a flag from a file that is mounted from a ConfigMap, and its behaviour — old checkout versus new checkout — is chosen by that flag\'s value at the moment of the request, not baked into the image. The Deployment is created with the flag off and reports the old behaviour. The flag is then flipped on by updating the ConfigMap; after the kubelet syncs the mounted file, the same running Pods report the new behaviour. Critically, the Deployment\'s generation number is unchanged between before and after — nothing about the Deployment spec was modified, so no new ReplicaSet was created and no Pods were replaced. The release happened with zero deployment activity. Flipping the flag back to off is equally instant and equally free of any rollout; the new code path is still sitting in the running containers, it is simply no longer the branch that executes. This is the kill switch: the fastest possible way to stop a bad feature, because there is nothing to roll back. In production the flag would usually come from a dedicated flag service evaluated per request rather than a mounted file, which also enables per-user targeting and percentage rollouts, but the principle is identical — the behaviour is controlled by external configuration, independently of the deployed artifact.',
        explainHi: 'Application ek flag ko ek file se padhता hai jo ek ConfigMap se mounted hai, aur iska behaviour — old checkout versus new checkout — us flag ki value dwara request ke moment par chuna jaata hai, image mein baked nahi. Deployment flag off ke saath create hota hai aur old behaviour report karta hai. Flag phir ConfigMap update karके on flip hota hai; kubelet ke mounted file sync karne ke baad, same running Pods naya behaviour report karते hain. Critically, Deployment ka generation number before aur after ke beech unchanged hai — Deployment spec ke baare mein kuch modify nahi hua, to koi naya ReplicaSet create nahi hua aur koi Pods replace nahi hue. Release zero deployment activity ke saath hua. Flag ko wapas off flip karna equally instant hai. Ye kill switch hai: ek bad feature ko rokne ka fastest possible tarika.',
      },
      {
        title: 'A percentage rollout must be STICKY: hashing the user id keeps a user on one side',
        titleHi: 'Ek percentage rollout STICKY hona chahiye: user id ko hash karna ek user ko ek side par rakhता hai',
        code: `# VERIFY
exec 2>&1
# a self-contained model of a sticky percentage flag (the logic a flag service runs)
enabled() {  # $1 = userId, $2 = rolloutPercent  -> "on" / "off", STABLE per user
  # FNV-1a-ish hash of the user id -> 0..99 bucket
  local s="$1" h=2166136261 i c
  for i in $(seq 0 $(( \${#s} - 1 ))); do
    c=$(printf '%d' "'\${s:$i:1}")
    h=$(( (h ^ c) * 16777619 & 0xFFFFFFFF ))
  done
  local bucket=$(( h % 100 ))
  [ "$bucket" -lt "$2" ] && echo on || echo off
}

echo "--- rollout at 50%: each user checked 3 times -> a STABLE answer ---"
on=0
for u in alice bob carol dave erin frank grace heidi ivan judy mallory niaj olivia peggy sybil trent; do
  a=$(enabled "$u" 50); b=$(enabled "$u" 50); c=$(enabled "$u" 50)
  [ "$a" = "$b" ] && [ "$b" = "$c" ] || echo "  UNSTABLE for $u !!"
  printf '  %-8s -> %s\\n' "$u" "$a"
  [ "$a" = on ] && on=$((on+1))
done
echo "users enabled: $on / 16   (a fixed slice - NOT re-rolled per request)"

echo "--- widen 50% -> 80%: everyone who was on STAYS on ---"
kept=1
for u in alice bob carol dave erin frank grace heidi ivan judy mallory niaj olivia peggy sybil trent; do
  [ "$(enabled "$u" 50)" = on ] && [ "$(enabled "$u" 80)" = off ] && kept=0
done
[ "$kept" = 1 ] && echo "monotonic: no user enabled at 50% got DISABLED at 80%"`,
        output: `--- rollout at 50%: each user checked 3 times -> a STABLE answer ---
  alice    -> off
  bob      -> on
  carol    -> off
  dave     -> off
  erin     -> on
  frank    -> off
  grace    -> on
  heidi    -> on
  ivan     -> on
  judy     -> off
  mallory  -> on
  niaj     -> off
  olivia   -> off
  peggy    -> off
  sybil    -> on
  trent    -> on
users enabled: 8 / 16   (a fixed slice - NOT re-rolled per request)
--- widen 50% -> 80%: everyone who was on STAYS on ---
monotonic: no user enabled at 50% got DISABLED at 80%`,
        explain: 'This is a self-contained model of the logic a feature-flag service runs when it evaluates a percentage rollout. The enabled function hashes the user id to a stable number in the range zero to ninety-nine, and the flag is on for that user if their bucket is below the rollout percentage. Because the bucket is derived deterministically from the user id, calling the function three times for the same user always returns the same answer — the test checks this and would print a warning if any user\'s result varied. This stickiness is the point: if the flag were evaluated with a fresh random number per request, a user at a 50% rollout would see the new feature on roughly half their requests and the old one otherwise, so the UI would flicker, a multi-step flow would switch implementations mid-way, and metrics would be meaningless. Hashing the id also makes the rollout monotonic: widening from 50% to 80% only adds users whose bucket is between 50 and 80, and never removes anyone who was already below 50, which the second check confirms. A real flag service does the same thing with a better hash and lets you salt it per flag so different flags bucket users independently, but the mechanism — deterministic hash of a stable key, compared against a threshold — is exactly this.',
        explainHi: 'Ye ek feature-flag service jo logic chalाता hai jab ye ek percentage rollout evaluate karता hai uska ek self-contained model hai. enabled function user id ko zero se ninety-nine range mein ek stable number par hash karता hai, aur flag us user ke liye on hai agar unka bucket rollout percentage se neeche hai. Kyunki bucket user id se deterministically derived hai, same user ke liye function ko teen baar call karna hamesha same answer return karता hai. Ye stickiness point hai: agar flag ek fresh random number ke saath per request evaluated hota, ek user ek 20% rollout par naya feature lagbhag paanch mein ek request on dekhता aur old otherwise, to UI flicker karता, ek multi-step flow mid-way implementations switch karता, aur metrics meaningless hote. Id ko hash karna rollout ko monotonic bhi banata hai: 20% se 60% widen karna sirf un users ko add karता hai jinka bucket 20 aur 60 ke beech hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a percentage rollout evaluated with a fresh random number per request
def new_checkout_enabled():
    return random.random() < ROLLOUT_PERCENT / 100   # <-- re-rolled EVERY call
# at 30% rollout, one user's session:
#   GET /cart      -> new UI      (roll: 0.12)
#   POST /cart/add -> OLD backend (roll: 0.88)   <-- mismatched with the UI they're on
#   GET /checkout  -> new UI again (roll: 0.05)
# the flow breaks; the user hits errors; your "new checkout conversion" metric is noise.`,
        right: `# STICKY: hash a stable key (user id / session id / account id), compare to the threshold
def new_checkout_enabled(user_id):
    bucket = crc32(f"new_checkout:{user_id}".encode()) % 100   # 0..99, deterministic
    return bucket < ROLLOUT_PERCENT
# now the same user is ALWAYS on the same side for this flag, across every request and
# every server. widening the % only ADDS users (monotonic). metrics compare like-for-like.
# real flag services do exactly this + let you pick the bucketing key + salt per flag.`,
        why: 'A percentage rollout is meant to put a fixed, consistent slice of users on the new behaviour so that their experience is coherent and the metrics comparing the two groups are valid. Evaluating the flag with a fresh random draw on every request destroys both properties. A single user\'s consecutive requests land on different sides of the flag, so a multi-request flow — a form that posts to a handler, a wizard with several steps, a page that makes several API calls — can render with the new UI while its backend calls hit the old implementation or vice versa, producing broken behaviour and errors that are hard to reproduce. And because the assignment is re-randomised constantly, there is no stable "treatment group" and "control group", so any metric that compares new-checkout users to old-checkout users is measuring noise. The fix is to make the decision a deterministic function of a stable identifier: hash the user id, or session id, or account id, into a bucket in a fixed range and compare that bucket to the rollout threshold. The same user then always evaluates to the same side for that flag, on every server and every request; increasing the percentage only moves additional users from off to on and never the reverse; and the two groups are stable enough to measure.',
        whyHi: 'Ek percentage rollout ka matlab users ka ek fixed, consistent slice naye behaviour par rakhना hai taaki unka experience coherent ho aur do groups ko compare karne wale metrics valid hon. Flag ko har request par ek fresh random draw ke saath evaluate karna dono properties destroy karता hai. Ek single user ki consecutive requests flag ke alag sides par land karती hain, to ek multi-request flow naye UI ke saath render ho sakta hai jabki iski backend calls old implementation par hit karती hain. Aur kyunki assignment constantly re-randomised hai, koi stable "treatment group" aur "control group" nahi hai. Fix decision ko ek stable identifier ka ek deterministic function banaना hai: user id, ya session id, ko ek fixed range mein ek bucket mein hash karo aur us bucket ko rollout threshold se compare karo.',
      },
      {
        wrong: `# treating every deploy as a release: no flags, feature ships the instant it merges
# a 3-week feature is developed on a long-lived branch, merged, and deployed - all at once,
# to 100% of users, on whatever random Tuesday the branch happened to be ready.
# problems: the branch rots for 3 weeks (merge conflicts, integration surprises);
//           CI never tested the integrated code until the end;
//           the launch date is dictated by when a developer clicked merge;
//           the only "off switch" for a bad launch is an emergency rollback deploy.`,
        right: `# decouple: merge small + often behind an OFF flag; release separately
# week 1-3: merge the feature to main in small PRs, each behind flags.new_x (default OFF)
#   -> main stays green + releasable the whole time (trunk-based dev, Module 4)
#   -> CI runs against the fully integrated code continuously
# then, when engineering AND product are ready:
#   flag ON for internal -> beta list -> 5% -> 25% -> 100%, watching metrics
#   bad? flag OFF (seconds). the launch date is a product decision, not a merge accident.`,
        why: 'Binding release to deploy forces a large feature down the long-lived-branch path: because merging to the mainline would expose unfinished work to users, the work has to stay on a branch until it is entirely done, and that branch then diverges from the mainline for the whole development period, accumulating merge conflicts and hiding integration problems that only surface when it finally lands. It also means the moment a user-visible change goes live is determined by when a developer completes and merges the branch, rather than by any product or business consideration, and the only mechanism to withdraw a change that turns out to be bad is an emergency rollback deployment. Decoupling removes all of this. The feature is merged to the mainline continuously in small pieces, each gated by a flag that defaults to off, so the mainline never contains user-visible unfinished work while still containing and continuously testing the integrated code. The release is then a separate, deliberate act: turn the flag on for a widening set of users on a schedule that product controls, watching metrics at each step, with an instant off switch if something goes wrong. Engineering ships continuously; the business decides when users see it.',
        whyHi: 'Release ko deploy se bind karna ek bade feature ko long-lived-branch path par force karता hai: kyunki mainline mein merge karna users ko unfinished work expose karega, work ko ek branch par rehना chahiye jab tak ye poori tarah done na ho, aur wo branch phir poore development period ke liye mainline se diverge karता hai, merge conflicts accumulate karता hai aur integration problems chhupाता hai. Ye ye bhi matlab hai ki ek user-visible change ka live jaane ka moment us se determined hai jab ek developer branch complete aur merge karता hai. Decoupling ye sab hataता hai. Feature ko mainline mein continuously chhote pieces mein merge kiya jaata hai, har ek ek flag se gated jo off default karता hai. Release phir ek alag, deliberate act hai.',
      },
      {
        wrong: `# a codebase with 340 feature flags, ~300 of them at 100%-on for over a year
# every function has 2-4 nested 'if flag.enabled(...)' branches
# - tests must cover the 2^n combinations, or (in practice) only the "all default" path
# - a new dev can't tell which branch is "the real code" and which is dead
# - an ops incident: someone disables flag 'legacy_v2_pricing' (name suggests it's old!)
//   during unrelated work -> it was actually gating the CURRENT pricing -> outage
# the flags that were supposed to reduce risk are now the biggest source of it.`,
        right: `# flag hygiene as a standing practice:
#   - EVERY release flag is created with an owner + a removal ticket + an expiry date
#   - a flag at 100% (or 0%) and stable for N weeks -> scheduled cleanup:
//       delete the flag, delete the now-dead code path, delete the tests for it
#   - a recurring (e.g. monthly) flag audit: list all flags + age + last-evaluated + state;
//       anything stale gets a cleanup PR
#   - keep OPERATIONAL flags (kill switches) - those are meant to live; name them clearly
#   - flag tools (LaunchDarkly / Unleash / Flagsmith / OpenFeature) report flag age + staleness`,
        why: 'A feature flag introduces a second code path, and while the flag is being rolled out that branching is a deliberate, temporary cost that buys safety. Once the flag has been at a fixed value for a long time — permanently on because the feature launched successfully, or permanently off because it was abandoned — the branch is no longer buying anything; it is pure liability. Every such flag doubles the state space that tests should cover, which in practice means the untested combinations grow until only the default configuration is really exercised. Every such flag makes the code harder to read, because a newcomer cannot tell which side of the conditional is the current behaviour and which is vestigial. And every such flag is an operational hazard: a flag whose name has drifted out of sync with reality, or that is simply forgotten, can be toggled during unrelated work and take down a feature that everyone assumed was hard-wired. The mitigation is to treat flag removal as a required part of the flag\'s lifecycle rather than an optional tidy-up: create each release flag with an owner and an expiry, clean it up — flag, dead code, and stale tests together — once it has been stable, and run a periodic audit that surfaces every flag\'s age and state so the stale ones get removed. Operational flags that are meant to be permanent are kept, but named so their purpose is unmistakable.',
        whyHi: 'Ek feature flag ek doosra code path introduce karता hai, aur jab flag roll out ho raha hai wo branching ek deliberate, temporary cost hai jo safety buy karता hai. Ek baar flag ek fixed value par lambे samay se raha hai — permanently on kyunki feature successfully launch hua, ya permanently off kyunki ise abandon kiya gaya — branch ab kuch buy nahi kar raha; ye pure liability hai. Har aisा flag us state space ko double karता hai jise tests cover karne chahiye. Har aisा flag code ko padhने mein harder banata hai. Aur har aisा flag ek operational hazard hai: ek flag jiska naam reality se out of sync drift ho gaya ho unrelated work ke dauraan toggle kiya ja sakta hai aur ek feature ko down le ja sakta hai. Mitigation flag removal ko flag ke lifecycle ka ek required part treat karना hai.',
      },
    ],

    realWorld: [
      {
        en: '**A checkout bug fixed in 8 seconds** — a released pricing change miscalculated tax for one country. The on-call flipped `new_tax_engine` off from a phone; every user was back on the old engine instantly, no rollback deploy, and the fix went out through the normal pipeline the next morning.',
        hi: '**Ek checkout bug 8 seconds mein fixed** — ek released pricing change ne ek country ke liye tax miscalculate kiya. On-call ne ek phone se `new_tax_engine` off flip kiya.',
      },
      {
        en: '**A "flickering" A/B test with garbage results** — the flag re-rolled `Math.random()` per request, so users bounced between variants mid-session. The "winning" variant was noise. Switched to `hash(userId) % 100 < pct`; results became stable and the real winner was the *other* one.',
        hi: '**Ek "flickering" A/B test garbage results ke saath** — flag per request `Math.random()` re-roll karता tha. `hash(userId) % 100 < pct` par switch kiya.',
      },
      {
        en: '**An outage from disabling a flag named `legacy_checkout_v2`** — an engineer cleaning up "old" flags turned it off; it was actually gating the *current* checkout (the name was two rewrites stale). Now every flag has an owner, an expiry, and a mandatory description, and cleanup happens via audit not guesswork.',
        hi: '**`legacy_checkout_v2` naam ke ek flag ko disable karne se ek outage** — ek engineer "old" flags clean karते hue ise off kiya; ye actually *current* checkout gate kar raha tha.',
      },
    ],

    interviewQA: [
      {
        q: 'What does it mean to decouple deploy from release, and what does a feature flag give you?',
        qHi: 'Deploy ko release se decouple karne ka kya matlab hai, aur ek feature flag aapko kya deta hai?',
        a: 'Deploy is the technical event of the new build running on the production servers; release is when users actually get the new behaviour. Decoupling them means the new code can be present, tested, and reachable in production while doing nothing a user can see, and the decision to expose it is made separately — by a person, a rule, or a schedule — and can be gradual, targeted, and reversed in seconds. A feature flag is the mechanism: a conditional in the code that picks between the new path and the old one based on a value looked up at request time from an external configuration source, not from the deployed artifact. Because the value is external, flipping it is a config change that takes effect immediately with no build, deploy, or restart. What that buys you: a kill switch, where turning a flag off instantly reverts every user to the old path with no rollback because the old code is still there; a gradual rollout done in application logic — 1%, 5%, 25%, 100% — without needing traffic-splitting infrastructure; targeting, so a feature goes to internal users then a beta list then one region then a percentage bucket, with the percentage bucketed stickily on a hashed user id; trunk-based development, where a long feature is merged to main in small pieces behind an off flag so the mainline stays green and releasable; and decoupled timing, so engineering deploys when ready and the business releases when it wants.',
        aHi: 'Deploy naya build production servers par running hone ka technical event hai; release tab hai jab users actually naya behaviour paate hain. Unhe decouple karne ka matlab naya code present, tested, aur production mein reachable ho sakta hai jabki kuch aisा nahi kar raha jo ek user dekh sake, aur ise expose karne ka decision separately banaya jaata hai. Ek feature flag mechanism hai: code mein ek conditional jo naye path aur old ke beech choose karता hai ek value ke aadhaar par jo request time par ek external configuration source se look up ki jaati hai. Ye aapko deta hai: ek kill switch; ek gradual rollout jo application logic mein kiya jaata hai; targeting; trunk-based development; aur decoupled timing.',
      },
      {
        q: 'Why must a percentage-based feature rollout be sticky, and how do you implement that?',
        qHi: 'Ek percentage-based feature rollout sticky kyun hona chahiye, aur aap use kaise implement karte ho?',
        a: 'A percentage rollout is meant to put a fixed, coherent slice of users on the new behaviour so that each user\'s experience is consistent and the metrics comparing the new-behaviour group to the old-behaviour group are meaningful. If the flag is evaluated with a fresh random number on every request, neither holds. A single user\'s consecutive requests land on different sides of the flag, so a flow that spans multiple requests — a form and its handler, a multi-step wizard, a page making several API calls — can render with the new UI while its backend calls hit the old code, producing broken behaviour and hard-to-reproduce errors. And because the assignment is constantly re-randomised, there is no stable treatment and control group, so comparative metrics are just noise. The implementation is to make the decision a deterministic function of a stable key: take the user id, or session id, or account id, hash it — often combined with the flag name so different flags bucket independently — into a number in a fixed range like 0 to 99, and enable the flag if that number is below the rollout percentage. The same user then always evaluates to the same side for that flag on every server and every request, widening the percentage only moves users from off to on and never back, and the two groups are stable enough to measure. Every real flag service does exactly this.',
        aHi: 'Ek percentage rollout ka matlab users ka ek fixed, coherent slice naye behaviour par rakhना hai taaki har user ka experience consistent ho aur metrics meaningful hon. Agar flag har request par ek fresh random number ke saath evaluated hai, koi bhi hold nahi karता. Ek single user ki consecutive requests flag ke alag sides par land karती hain, to ek flow jo multiple requests span karता hai naye UI ke saath render ho sakta hai jabki iski backend calls old code par hit karती hain. Aur kyunki assignment constantly re-randomised hai, koi stable treatment aur control group nahi hai. Implementation decision ko ek stable key ka ek deterministic function banaना hai: user id ko lo, ise hash karo — often flag name ke saath combined — ek fixed range mein ek number mein, aur flag enable karo agar wo number rollout percentage se neeche hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define deploy vs release, explain what a feature flag is and where its value comes from, and list the five things decoupling buys you.',
        taskHi: 'Ek comment mein, deploy vs release define karo.',
        hint: 'DEPLOY = the new build is RUNNING on the production servers — a technical event (a pipeline finished); low-risk if done safely (rolling / health-gated); the code may be DARK (reachable but doing nothing visible). RELEASE = users are GETTING the new behaviour — a PRODUCT decision (a person / a rule / a schedule turned it on); can be gradual, targeted, reversible in seconds. Collapsing them → every code change carries full release risk, the timing of a user-facing change is dictated by when engineering merges, and the only undo is another deploy. A FEATURE FLAG = a runtime conditional (`if flags.enabled("x", ctx) { new } else { old }`) that gates the new behaviour. THE CRUCIAL PART: the flag value comes from an EXTERNAL config source evaluated PER REQUEST (a flag service / a watched config file / a DB row / a ConfigMap) — NOT from the deployed artifact → flipping it is a config change (seconds), no build / deploy / restart. WHAT DECOUPLING BUYS: (1) KILL SWITCH — flag OFF instantly reverts every user, no rollback (old code still deployed, just not executed); (2) GRADUAL ROLLOUT — 1→5→25→100% in app logic, watching metrics, no traffic-splitting infra needed; (3) TARGETING — internal → beta list → one region → one plan tier → a % bucket (sticky, hashed on a stable id); (4) TRUNK-BASED DEV — merge a long feature to main in small pieces behind an OFF flag → mainline stays green + releasable, CI tests the integrated code continuously (Module 4); (5) DECOUPLED TIMING — engineering deploys when ready, product/marketing release when they want (launch date, support briefing, coordinated multi-service go).',
        hintHi: 'DEPLOY = naya build production servers par RUNNING hai — ek technical event; code DARK ho sakta hai. RELEASE = users naya behaviour PAA rahe hain — ek PRODUCT decision. Unhe collapse karna → har code change full release risk carry karता hai. Ek FEATURE FLAG = ek runtime conditional. CRUCIAL PART: flag value ek EXTERNAL config source se aati hai jo PER REQUEST evaluated hai — deployed artifact se NAHI → ise flip karna ek config change hai (seconds). DECOUPLING KYA DETA HAI: (1) KILL SWITCH — flag OFF instantly revert karता hai; (2) GRADUAL ROLLOUT — app logic mein 1→5→25→100%; (3) TARGETING — sticky, hashed on a stable id; (4) TRUNK-BASED DEV; (5) DECOUPLED TIMING.',
      },
      {
        task: 'In a comment, explain why a percentage rollout must be sticky, the two things a per-request random evaluation breaks, and the deterministic-hash implementation.',
        taskHi: 'Ek comment mein, samjhao ki ek percentage rollout sticky kyun hona chahiye.',
        hint: 'A percentage rollout should put a FIXED, COHERENT slice of users on the new behaviour. Evaluating the flag with a FRESH `random()` per request breaks TWO things: (1) COHERENCE — a single user\'s consecutive requests land on DIFFERENT sides → a multi-request flow (a form + its handler, a wizard, a page making several API calls) renders with the new UI while its backend calls hit the old code (or vice versa) → broken behaviour + hard-to-reproduce errors, and the UI visibly FLICKERS between variants; (2) MEASURABILITY — the assignment is constantly re-randomised → no stable "treatment group" / "control group" → any metric comparing new-vs-old users is NOISE (a "winning" A/B variant that is actually random). IMPLEMENTATION — make the decision a DETERMINISTIC function of a STABLE key: `bucket = hash(flagName + ":" + userId) % 100` (0..99), `enabled = bucket < rolloutPercent`. Combining the flag name into the hash makes different flags bucket users INDEPENDENTLY (a user in the first 10% of flag A isn\'t automatically in the first 10% of flag B). Properties you get: the same user ALWAYS evaluates to the same side for that flag, on every server + every request; widening the % is MONOTONIC (only moves users off→on, never back); the two groups are stable enough to measure. Use session id / account id instead of user id where that\'s the right unit. Every real flag service (LaunchDarkly / Unleash / Flagsmith / OpenFeature) does exactly this.',
        hintHi: 'Ek percentage rollout ko users ka ek FIXED, COHERENT slice naye behaviour par rakhना chahiye. Flag ko har request par ek FRESH `random()` ke saath evaluate karna DO cheezein todता hai: (1) COHERENCE — ek single user ki consecutive requests ALAG sides par land karती hain → ek multi-request flow naye UI ke saath render hota hai jabki backend calls old code par → broken behaviour, UI FLICKER karता hai; (2) MEASURABILITY — assignment constantly re-randomised → koi stable "treatment"/"control" group nahi → metrics NOISE hain. IMPLEMENTATION — decision ko ek STABLE key ka ek DETERMINISTIC function banao: `bucket = hash(flagName + ":" + userId) % 100`, `enabled = bucket < rolloutPercent`. Properties: same user HAMESHA same side; widening MONOTONIC hai; groups measurable hain.',
      },
      {
        task: 'In a comment, list the flag types and their lifetimes, explain flag debt, and give the hygiene practice that controls it.',
        taskHi: 'Ek comment mein, flag types aur unke lifetimes list karo.',
        hint: 'FLAG TYPES + LIFETIMES: RELEASE toggles (hide in-progress work; flip to 100% then REMOVE — lifetime: days to a few weeks); OPERATIONAL toggles (kill switches, circuit breakers, load-shedding — lifetime: as long as the operational concern exists, often permanent — KEEP these, name them clearly); PERMISSION toggles / entitlements ("this plan includes feature X" — not really a deployment flag, permanent product config); EXPERIMENT toggles (A/B / multivariate — lifetime: the experiment, remove when it concludes). FLAG DEBT: every flag is a BRANCH in the code — the system now has 2 behaviours where it had 1, both must be tested + monitored + reasoned about. A flag stuck at 100%-on (or 0%-off) for a long time buys NOTHING and is pure liability: (a) it doubles the state space tests should cover → in practice only the "all-default" path stays exercised; (b) a newcomer can\'t tell which side is the real code vs vestigial; (c) it\'s an operational hazard — a flag whose name has drifted stale, or is simply forgotten, gets toggled during unrelated work → takes down a feature everyone assumed was hard-wired (real incident: disabling `legacy_checkout_v2` which actually gated the CURRENT checkout). HYGIENE: EVERY release flag is created with an OWNER + a removal ticket + an EXPIRY date; a flag at 100%/0% and stable for N weeks → scheduled cleanup = delete the flag + the now-dead code path + the tests for it (all together, a task not an afterthought); a recurring (monthly) AUDIT listing every flag + age + last-evaluated + state → stale ones get a cleanup PR. Flag tools track age/staleness and nag you, but the removal still has to be DONE.',
        hintHi: 'FLAG TYPES + LIFETIMES: RELEASE toggles (100% par flip phir REMOVE — days to weeks); OPERATIONAL toggles (kill switches — often permanent, KEEP karo); PERMISSION toggles (permanent product config); EXPERIMENT toggles (A/B — experiment ke baad remove). FLAG DEBT: har flag code mein ek BRANCH hai — system ke ab 2 behaviours hain, dono test + monitor kiye jaane chahiye. Ek flag jo lambे samay se 100%-on atka hai KUCH nahi buy karता: (a) test state space double; (b) newcomer real code nahi bata sakta; (c) ek operational hazard. HYGIENE: HAR release flag ek OWNER + removal ticket + EXPIRY date ke saath banaya jaata hai; stable flags → scheduled cleanup (flag + dead code + tests saath); ek recurring AUDIT.',
      },
    ],

    keyTakeaways: [
      'DEPLOY (the new build is RUNNING on the servers — a technical event, may be DARK) != RELEASE (users are GETTING the new behaviour — a product decision, gradual/targeted/reversible). Collapsing them makes every code change carry full release risk, ties user-facing timing to merges, and makes the only undo another deploy. A FEATURE FLAG is a runtime conditional gating the new behaviour whose value comes from an EXTERNAL config source evaluated PER REQUEST (flag service / watched file / DB row / ConfigMap) — NOT the deployed artifact → flipping it is a config change (seconds), no build/deploy/restart.',
      'DECOUPLING BUYS: (1) KILL SWITCH — flag OFF instantly reverts every user, NO rollback (the old code is still deployed, just not executed) — the fastest possible mitigation; (2) GRADUAL ROLLOUT in app logic (1→5→25→100%, watch metrics between) — a canary with no traffic-splitting infra; (3) TARGETING — internal → beta list → one region → one plan → a % bucket; (4) TRUNK-BASED DEV — merge a long feature to main in small pieces behind an OFF flag (Module 4); (5) DECOUPLED TIMING — engineering deploys when ready, the business releases when it wants.',
      'A PERCENTAGE ROLLOUT MUST BE STICKY: evaluating the flag with a fresh `random()` per request breaks (a) COHERENCE — one user\'s consecutive requests hit different sides → multi-step flows break, the UI flickers — and (b) MEASURABILITY — no stable treatment/control group → comparative metrics are noise. IMPLEMENT as `bucket = hash(flagName + ":" + stableId) % 100; enabled = bucket < pct` → the same user always gets the same answer, widening the % is MONOTONIC (only off→on), the groups are measurable. Combining the flag name into the hash makes flags bucket users independently.',
      'FLAG TYPES + LIFETIMES: RELEASE toggles (flip to 100% then REMOVE — days/weeks); OPERATIONAL toggles (kill switches, circuit breakers — often permanent, KEEP + name clearly); PERMISSION toggles / entitlements (permanent product config); EXPERIMENT toggles (remove when the test concludes).',
      'FLAG DEBT IS REAL: every flag is a code branch — 2 behaviours where there was 1, both to test/monitor/reason about. A flag stuck at 100%/0% for months buys nothing and is a liability: it doubles the test state space (so only the default path stays exercised), it makes the code unreadable (which side is real?), and it is an operational hazard (toggling a stale-named or forgotten flag takes down a feature everyone thought was hard-wired). HYGIENE: every release flag gets an owner + a removal ticket + an expiry; a stable flag → scheduled cleanup = delete the flag + the dead code path + its tests together; run a periodic audit of every flag\'s age + state. Deployment strategies (Lesson 1) and feature flags are COMPLEMENTARY — the strategy governs how the ARTIFACT reaches servers safely; the flag governs how the BEHAVIOUR reaches users.',
    ],
    keyTakeawaysHi: [
      'DEPLOY (naya build servers par RUNNING hai — ek technical event, DARK ho sakta hai) != RELEASE (users naya behaviour PAA rahe hain — ek product decision). Unhe collapse karna har code change ko full release risk carry karvाता hai. Ek FEATURE FLAG ek runtime conditional hai jiski value ek EXTERNAL config source se aati hai jo PER REQUEST evaluated hai — deployed artifact se NAHI → ise flip karna ek config change hai (seconds).',
      'DECOUPLING KYA DETA HAI: (1) KILL SWITCH — flag OFF instantly revert karता hai, KOI rollback nahi; (2) GRADUAL ROLLOUT app logic mein; (3) TARGETING; (4) TRUNK-BASED DEV — ek OFF flag ke peeche chhote pieces mein merge; (5) DECOUPLED TIMING.',
      'EK PERCENTAGE ROLLOUT STICKY HONA CHAHIYE: flag ko har request par ek fresh `random()` ke saath evaluate karna (a) COHERENCE — ek user ki consecutive requests alag sides par → multi-step flows toot jaate hain — aur (b) MEASURABILITY — koi stable treatment/control group nahi → metrics noise. IMPLEMENT: `bucket = hash(flagName + ":" + stableId) % 100; enabled = bucket < pct` → same user hamesha same answer, widening MONOTONIC hai.',
      'FLAG TYPES + LIFETIMES: RELEASE toggles (100% par flip phir REMOVE); OPERATIONAL toggles (kill switches — often permanent, KEEP karo); PERMISSION toggles (permanent); EXPERIMENT toggles (test ke baad remove).',
      'FLAG DEBT REAL HAI: har flag ek code branch hai — 2 behaviours, dono test/monitor. Ek flag jo mahinon se 100%/0% atka hai kuch nahi buy karता aur ek liability hai. HYGIENE: har release flag ko ek owner + removal ticket + expiry milta hai; ek stable flag → scheduled cleanup (flag + dead code + tests saath); ek periodic audit. Deployment strategies (Lesson 1) aur feature flags COMPLEMENTARY hain.',
    ],
  },

  {
    slug: 'ops-canary-and-progressive-delivery-with-analysis',
    title: 'Canary & Progressive Delivery with Analysis',
    titleHi: 'Canary & Progressive Delivery with Analysis',
    description: 'A real canary is not "deploy to a few Pods and eyeball a dashboard." It is a control loop: route a small, growing share of traffic to the new version, compare its metrics against the stable version over a bake period, and let an automated analysis decide — promote on pass, abort and roll back on fail. Argo Rollouts and Flagger implement exactly this.',
    descriptionHi: 'Ek real canary "kuch Pods par deploy karo aur ek dashboard eyeball karo" nahi hai. Ye ek control loop hai: traffic ka ek chhota, growing share naye version ko route karo, iske metrics ko stable version ke against ek bake period ke dauraan compare karo, aur ek automated analysis ko decide karne do — pass par promote, fail par abort aur roll back. Argo Rollouts aur Flagger theek yahi implement karte hain.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A new drug going through a dose-escalation trial.** You do not give it to everyone and watch the news. You give it to a tiny cohort at a low dose, and a protocol — written in advance — defines exactly which vitals to watch, for how long, and what reading triggers a halt. If the cohort is fine after the observation window, the protocol *automatically* moves to the next dose and a larger cohort; if a monitored value crosses a threshold, the trial stops that arm immediately and everyone reverts to standard care — no committee meeting, no waiting for someone to notice. The **canary weight** is the dose, the **bake time** is the observation window, the **analysis** is the protocol\'s stopping rules, and the **automatic promote/abort** is the trial running itself. A human is only called in for an ambiguous result.',
      hi: '**Ek nayi drug ek dose-escalation trial se guzar rahi hai.** Aap ise sabko nahi dete aur news dekhते ho. Aap ise ek tiny cohort ko ek low dose par dete ho, aur ek protocol — pehle likha gaya — exactly define karता hai ki kaunse vitals dekhने hain, kitni der ke liye, aur kaunसी reading ek halt trigger karती hai. Agar cohort observation window ke baad theek hai, protocol *automatically* agle dose par move karता hai; agar ek monitored value ek threshold cross karती hai, trial us arm ko turant stop karता hai. **Canary weight** dose hai, **bake time** observation window hai, **analysis** protocol ke stopping rules hain, aur **automatic promote/abort** trial ka khud chalना hai.',
    },

    simple: `**A CANARY IS A CONTROL LOOP, not a staging step:**
\`\`\`
   +-> route SMALL % of live traffic to new version (setWeight: 5)
   |
   +-> BAKE: hold for N minutes, gathering metrics for canary AND stable
   |
   +-> ANALYSIS: compare canary vs stable on defined metrics over the window
   |        error-rate(canary) <= error-rate(stable) + tolerance ?
   |        p95-latency(canary) <= threshold ?
   |        (optional) a business KPI within bounds ?
   |
   +-- PASS --> increase the weight (5 -> 25 -> 50 -> 100), repeat
   +-- FAIL --> ABORT: weight back to 0, all traffic to stable, page a human
\`\`\`

**ARGO ROLLOUTS** — a \`Rollout\` replaces a \`Deployment\` and adds canary/blue-green natively:
\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  replicas: 10
  strategy:
    canary:
      canaryService: web-canary          # (with a mesh / ingress) split real traffic
      stableService: web-stable
      steps:
        - setWeight: 5
        - pause: { duration: 10m }
        - analysis:                        # <- the automated gate
            templates: [ { templateName: success-rate } ]
        - setWeight: 25
        - pause: { duration: 10m }
        - setWeight: 50
        - pause: { duration: 10m }
        - setWeight: 100
      # analysis: { templates: [...] }     # or run analysis CONTINUOUSLY through all steps
\`\`\`
- \`kubectl argo rollouts get rollout web\` — watch the steps; \`... promote\` past a \`pause: {}\`;
  \`... abort\` to roll back; \`... promote --full\` to skip remaining steps.
- \`AnalysisTemplate\` defines the metric query (Prometheus, Datadog, a web check, a Job) +
  the success condition + failure/inconclusive limits. On failure the Rollout **auto-aborts**.

**FLAGGER** does the same job driven by annotations on a normal \`Deployment\` + a \`Canary\`
resource; it manages the traffic shift (via a mesh / ingress) and the metric checks, and
**auto-rolls-back** on breach. Argo Rollouts owns the workload object; Flagger sits beside it.

**PREREQUISITES (without these, you have a manual staged rollout, not progressive delivery):**
\`\`\`
1. TRAFFIC SPLITTING   a mesh (Istio/Linkerd), an ingress that weights (nginx/Traefik/Gateway
                       API), or SMI - to send exactly X% to the canary. (weight-by-replica-count
                       is a rough approximation Argo can do with no mesh.)
2. METRICS             a real source (Prometheus/Datadog/CloudWatch) with canary + stable
                       labelled separately, and queries that are meaningful at low traffic.
3. SLOs / THRESHOLDS   defined IN ADVANCE - what error rate / latency is "still fine".
\`\`\`

**vs FEATURE FLAGS (Lesson 2):** a flag canary splits in *application logic* (per-user, no
infra); an infra canary splits *traffic* (per-request, needs a mesh). Use flags for feature
behaviour, infra canary for whole-service version rollouts (a new build, a runtime upgrade).`,

    simpleHi: `**EK CANARY EK CONTROL LOOP HAI, ek staging step nahi:**
\`\`\`
   +-> live traffic ka CHHOTA % naye version ko route karo (setWeight: 5)
   +-> BAKE: N minutes hold karo, canary AUR stable ke liye metrics gather karte hue
   +-> ANALYSIS: window ke dauraan canary vs stable ko defined metrics par compare karo
   |        error-rate(canary) <= error-rate(stable) + tolerance ?
   |        p95-latency(canary) <= threshold ?
   +-- PASS --> weight badhाओ (5 -> 25 -> 50 -> 100), repeat
   +-- FAIL --> ABORT: weight wapas 0, saara traffic stable ko, ek human ko page karo
\`\`\`

**ARGO ROLLOUTS** — ek \`Rollout\` ek \`Deployment\` ko replace karता hai aur canary/blue-green natively add karता hai:
\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      steps:
        - setWeight: 5
        - pause: { duration: 10m }
        - analysis: { templates: [ { templateName: success-rate } ] }   # <- automated gate
        - setWeight: 25
        - pause: { duration: 10m }
        - setWeight: 50
        - setWeight: 100
\`\`\`
- \`kubectl argo rollouts get rollout web\` — steps watch karo; \`... promote\` ek \`pause: {}\` ke paar;
  \`... abort\` roll back karne ko.
- \`AnalysisTemplate\` metric query (Prometheus, Datadog) + success condition + failure limits define
  karता hai. Failure par Rollout **auto-aborts**.

**FLAGGER** same job karता hai ek normal \`Deployment\` par annotations + ek \`Canary\` resource se driven;
ye traffic shift aur metric checks manage karता hai, aur breach par **auto-rolls-back**.

**PREREQUISITES (inke bina, aapke paas ek manual staged rollout hai, progressive delivery nahi):**
\`\`\`
1. TRAFFIC SPLITTING   ek mesh (Istio/Linkerd), ek ingress jo weights karता hai, ya SMI.
2. METRICS             ek real source, canary + stable alag labelled, aur low traffic par meaningful queries.
3. SLOs / THRESHOLDS   PEHLE define kiye — kaunसा error rate / latency "still fine" hai.
\`\`\`

**vs FEATURE FLAGS (Lesson 2):** ek flag canary *application logic* mein split karता hai
(per-user, koi infra nahi); ek infra canary *traffic* split karता hai (per-request, ek mesh chahiye).
Flags feature behaviour ke liye use karo, infra canary whole-service version rollouts ke liye.`,

    content: `## What makes it a canary

Lesson 1 introduced canary as sending a small percentage of live traffic to the new version, watching, and increasing. This lesson is about the "watching and increasing" part being **automatic and rule-based**, which is what separates progressive delivery from a manual staged rollout.

A canary is a control loop with four repeating stages:

1. **Set the weight.** Route a defined percentage of live traffic to the new version — start small, 1% to 5%.
2. **Bake.** Hold that weight for a period — long enough to accumulate a statistically useful number of requests through the canary. Ten minutes at low traffic, less at high traffic.
3. **Analyse.** Compare the canary against the stable version over the bake window on a defined set of metrics: error rate, latency percentiles, and optionally a business signal. The comparison uses thresholds and tolerances set in advance.
4. **Decide.** If the analysis passes, increase the weight and loop. If it fails, **abort**: set the weight back to zero, send all traffic to stable, and notify a human.

The decision in stage 4 is made by software, not a person watching a dashboard. That is the whole point — a human does not reliably catch a small regression, does not consistently wait the full bake, and reacts slowly.

## Argo Rollouts

**Argo Rollouts** replaces the \`Deployment\` object with a \`Rollout\` object that has canary and blue-green strategies built in. The \`Rollout\` spec looks like a Deployment plus a \`strategy.canary\` block with **\`steps\`**:

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata: { name: web }
spec:
  replicas: 10
  selector: { matchLabels: { app: web } }
  strategy:
    canary:
      canaryService: web-canary
      stableService: web-stable
      trafficRouting:
        nginx: { stableIngress: web }      # or istio, smi, gatewayAPI, ...
      steps:
        - setWeight: 5
        - pause: { duration: 10m }
        - analysis: { templates: [ { templateName: success-rate } ] }
        - setWeight: 25
        - pause: { duration: 10m }
        - setWeight: 50
        - pause: { duration: 10m }
        - setWeight: 100
  template: { ... }                          # the pod template, as in a Deployment
\`\`\`

- **\`setWeight: N\`** — shift N% of traffic to the canary. With \`trafficRouting\` configured against a mesh or ingress, this is a real request-level split; without it, Argo Rollouts approximates the weight by the **ratio of canary to stable replica counts**, which is coarser but needs no mesh.
- **\`pause: { duration: 10m }\`** — bake. **\`pause: {}\`** with no duration — pause **indefinitely** until a human runs \`kubectl argo rollouts promote web\`.
- **\`analysis\`** as a step runs an \`AnalysisRun\` once at that point and blocks on the result; \`analysis\` at the \`canary\` level (not inside \`steps\`) runs **continuously in the background** through the whole rollout and aborts the moment it fails.

The plugin \`kubectl argo rollouts\` gives \`get rollout web\` (a live view of the steps and weights), \`promote web\` (advance past a pause), \`promote web --full\` (skip all remaining steps), and \`abort web\` (send everything back to stable). A \`Rollout\` also appears with a \`status.phase\` of \`Progressing\`, \`Paused\`, \`Healthy\`, or \`Degraded\`.

## AnalysisTemplate — the automated gate

An **\`AnalysisTemplate\`** defines what "passing" means:

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata: { name: success-rate }
spec:
  metrics:
    - name: success-rate
      interval: 1m
      successCondition: result[0] >= 0.99         # >= 99% success
      failureLimit: 3                             # 3 failed intervals -> the metric fails
      provider:
        prometheus:
          address: http://prometheus.monitoring:9090
          query: |
            sum(rate(http_requests_total{service="web-canary",code!~"5.."}[2m]))
            /
            sum(rate(http_requests_total{service="web-canary"}[2m]))
\`\`\`

Providers include **Prometheus**, **Datadog**, **New Relic**, **CloudWatch**, a **web** request (hit an endpoint, check the response), and a **Job** (run arbitrary checks in a Pod). \`successCondition\` and \`failureCondition\` are expressions over the query result; \`failureLimit\` and \`inconclusiveLimit\` bound how many bad or ambiguous readings are tolerated before the metric is declared failed. When an analysis fails, the Rollout automatically aborts and rolls back to stable — no human required for the common failure case.

## Flagger

**Flagger** achieves the same outcome with a different shape. You keep a normal \`Deployment\` and add a **\`Canary\`** custom resource that references it and declares the analysis:

\`\`\`yaml
apiVersion: flagger.app/v1beta1
kind: Canary
spec:
  targetRef: { kind: Deployment, name: web }
  service: { port: 80 }
  analysis:
    interval: 1m
    threshold: 5                # 5 failed checks -> rollback
    maxWeight: 50
    stepWeight: 10
    metrics:
      - name: request-success-rate
        thresholdRange: { min: 99 }
      - name: request-duration
        thresholdRange: { max: 500 }
\`\`\`

Flagger watches the Deployment; when its pod template changes it creates a canary Deployment, then drives the traffic weight up in \`stepWeight\` increments, running the metric checks at each \`interval\`, and on breach it **scales the canary to zero and leaves the stable version serving** — an automatic rollback. Argo Rollouts *is* the workload controller; Flagger *orchestrates* around a stock Deployment. Both integrate with the same set of meshes and ingress controllers for traffic shifting.

## Prerequisites

Progressive delivery has hard dependencies. Without them you can still do a manual staged rollout, but not an automated canary:

1. **Traffic splitting.** Something that can send exactly X% of requests to the canary: a service mesh (Istio, Linkerd), an ingress controller with weighting (nginx, Traefik), the Gateway API, or SMI. Argo Rollouts can approximate with replica ratios and no mesh, which is a reasonable starting point.
2. **Metrics.** A real metrics source — Prometheus, Datadog, CloudWatch — where the canary and stable versions are labelled distinctly so their metrics can be compared, and query expressions that are meaningful at the low request volume a 5% canary sees.
3. **Thresholds defined in advance.** What error rate, what latency, over what window, counts as "the canary is fine." Deciding this during an incident defeats the purpose.

## Canary vs feature flags

A feature flag (Lesson 2) and an infrastructure canary both do a gradual rollout, but at different layers. The flag splits in **application logic** — per user, evaluated in the process, no infrastructure needed — and is right for gating a **feature's behaviour**. The infra canary splits **traffic** — per request, needs a mesh or weighting ingress — and is right for rolling out a **whole new version of a service**: a new build, a base-image upgrade, a dependency bump, a config change that ships in the artifact. A mature setup uses both: infra canary the artifact, and gate the risky new behaviour inside it with a flag.`,

    contentHi: `## Ise ek canary kya banata hai

Lesson 1 ne canary ko live traffic ka ek chhota percentage naye version ko bhejने, dekhने, aur badhाने ke roop mein introduce kiya. Ye lesson "dekhने aur badhाने" wale part ke **automatic aur rule-based** hone ke baare mein hai, jo progressive delivery ko ek manual staged rollout se separate karता hai.

Ek canary chaar repeating stages ke saath ek control loop hai:
1. **Weight set karo.** Live traffic ka ek defined percentage naye version ko route karo — chhota shuru karo, 1% se 5%.
2. **Bake.** Us weight ko ek period ke liye hold karo — canary ke through ek statistically useful number of requests accumulate karne ke liye kaafi lamba.
3. **Analyse.** Canary ko stable version ke against bake window ke dauraan ek defined set of metrics par compare karo: error rate, latency percentiles.
4. **Decide.** Agar analysis pass hota hai, weight badhाओ aur loop karo. Agar fail hota hai, **abort**: weight wapas zero, saara traffic stable ko, aur ek human ko notify karo.

Stage 4 mein decision software dwara banaya jaata hai, ek dashboard dekhने wale person dwara nahi.

## Argo Rollouts

**Argo Rollouts** \`Deployment\` object ko ek \`Rollout\` object se replace karता hai jismें canary aur blue-green strategies built in hain. \`Rollout\` spec ek Deployment plus ek \`strategy.canary\` block **\`steps\`** ke saath jaisा dikhता hai:
- **\`setWeight: N\`** — N% traffic canary ko shift karo. \`trafficRouting\` ke saa mesh ya ingress ke against configured, ye ek real request-level split hai; iske bina, Argo Rollouts weight ko **canary aur stable replica counts ke ratio** se approximate karता hai.
- **\`pause: { duration: 10m }\`** — bake. **\`pause: {}\`** bina duration ke — **indefinitely** pause jab tak ek human \`kubectl argo rollouts promote web\` na chalाye.
- **\`analysis\`** ek step ke roop mein ek \`AnalysisRun\` ek baar chalाता hai; \`analysis\` \`canary\` level par (steps ke andar nahi) poore rollout ke through **background mein continuously** chalता hai.

Plugin \`kubectl argo rollouts\` deta hai \`get rollout web\`, \`promote web\`, \`promote web --full\`, aur \`abort web\`.

## AnalysisTemplate — automated gate

Ek **\`AnalysisTemplate\`** define karता hai ki "passing" ka kya matlab hai. Providers mein **Prometheus**, **Datadog**, **CloudWatch**, ek **web** request, aur ek **Job** shamil hain. Jab ek analysis fail hota hai, Rollout automatically aborts aur stable par roll back karता hai.

## Flagger

**Flagger** same outcome ek alag shape ke saath achieve karता hai. Aap ek normal \`Deployment\` rakhते ho aur ek **\`Canary\`** custom resource add karते ho jo ise reference karता hai aur analysis declare karता hai. Flagger Deployment watch karता hai; jab iska pod template badalता hai ye ek canary Deployment banाता hai, phir traffic weight ko \`stepWeight\` increments mein up drive karता hai, aur breach par ye **canary ko zero par scale karता hai** — ek automatic rollback.

## Prerequisites

Progressive delivery ki hard dependencies hain:
1. **Traffic splitting.** Kuch jo exactly X% requests canary ko bhej sake: ek service mesh, ek weighting ingress, Gateway API, ya SMI.
2. **Metrics.** Ek real metrics source jahaan canary aur stable versions alag labelled hain.
3. **Thresholds pehle define kiye.** Kaunसा error rate, kaunसी latency "the canary is fine" count hota hai.

## Canary vs feature flags

Ek feature flag (Lesson 2) aur ek infrastructure canary dono ek gradual rollout karते hain, par alag layers par. Flag **application logic** mein split karता hai — per user — aur ek **feature ke behaviour** ko gate karne ke liye sahi hai. Infra canary **traffic** split karता hai — per request — aur ek **service ke poore naye version** ko roll out karne ke liye sahi hai.`,

    examples: [
      {
        title: 'An Argo Rollouts canary: ships v2 to 25%, pauses for analysis, promotes on pass',
        titleHi: 'Ek Argo Rollouts canary: v2 ko 25% par ships karता hai, analysis ke liye pause karता hai, pass par promote',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m11l3-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata: { name: web }
spec:
  replicas: 4
  selector: { matchLabels: { app: web } }
  strategy:
    canary:
      steps:                          # (no mesh here -> weight is approximated by replica ratio)
        - setWeight: 25
        - pause: {}                    # PAUSE INDEFINITELY - wait for analysis / a human to promote
        - setWeight: 50
        - pause: { duration: 5 }
        - setWeight: 100
  template:
    metadata: { labels: { app: web } }
    spec:
      containers: [ { name: c, image: nginx:1.27-alpine } ]
YAML
kubectl argo rollouts status web -n "$ns" --timeout 90s >/dev/null 2>&1
v2c() { kubectl -n "$ns" get pod -l app=web -o jsonpath='{.items[*].spec.containers[0].image}' | tr ' ' '\\n' | grep -c '1.28'; }
ph() { kubectl -n "$ns" get rollout web -o jsonpath='{.status.phase}'; }
img() { kubectl -n "$ns" get rollout web -o jsonpath='{.spec.template.spec.containers[0].image}'; }
echo "v1 rolled out: phase=$(ph)  image=$(img)"

echo "--- ship v2 -> canary goes to step 1 (setWeight 25) and PAUSES ---"
kubectl argo rollouts set image web -n "$ns" c=nginx:1.28-alpine >/dev/null
sleep 15
echo "  phase=$(ph)  currentStep=$(kubectl -n "$ns" get rollout web -o jsonpath='{.status.currentStepIndex}')  Pods on v2=$(v2c)/4   (25% weight = 1 of 4)"

echo "--- analysis passes (or a human runs 'kubectl argo rollouts promote web') ---"
kubectl argo rollouts promote web -n "$ns" >/dev/null
kubectl argo rollouts status web -n "$ns" --timeout 120s >/dev/null 2>&1 || true
echo "  final: phase=$(ph)  image=$(img)  Pods on v2=$(v2c)/4"`,
        output: `v1 rolled out: phase=Healthy  image=nginx:1.27-alpine
--- ship v2 -> canary goes to step 1 (setWeight 25) and PAUSES ---
  phase=Paused  currentStep=1  Pods on v2=1/4   (25% weight = 1 of 4)
--- analysis passes (or a human runs 'kubectl argo rollouts promote web') ---
  final: phase=Healthy  image=nginx:1.28-alpine  Pods on v2=4/4`,
        explain: 'A Rollout object is created in place of a Deployment, with a canary strategy whose steps are: shift 25% of traffic to the canary, pause indefinitely, then 50%, a short bake, then 100%. Because there is no service mesh configured here, Argo Rollouts approximates the 25% weight by running one canary Pod against three stable Pods. The initial rollout of v1 completes and the Rollout reports Healthy. The image is then changed to v2 — the equivalent of a new build landing. The controller does not roll all Pods; it creates one canary Pod on v2, leaves three on v1, moves to step one, and stops there because the step is a pause with no duration. The output confirms the Rollout is Paused at step one with exactly one of four Pods on the new version. At this point an AnalysisTemplate would be evaluating the canary\'s metrics against the stable version; here the promotion is done manually with the plugin, standing in for a passing analysis. Once promoted, the Rollout proceeds through the remaining steps, shifting more Pods to v2 with the short bake between, until all four are on v2 and it reports Healthy again. The defining feature is that the rollout stopped and waited for a decision partway through, with only a small fraction of capacity exposed to the new version while that decision was pending.',
        explainHi: 'Ek Rollout object ek Deployment ke bajaay create hota hai, ek canary strategy ke saath jiske steps hain: 25% traffic canary ko shift karo, indefinitely pause karo, phir 50%, ek short bake, phir 100%. Kyunki yahaan koi service mesh configured nahi hai, Argo Rollouts 25% weight ko ek canary Pod ko teen stable Pods ke against chalाकर approximate karता hai. v1 ka initial rollout complete hota hai. Image phir v2 par change hota hai. Controller saare Pods roll nahi karता; ye v2 par ek canary Pod banाता hai, teen ko v1 par chhodता hai, step one par move karता hai, aur wahaan rukता hai kyunki step ek pause hai bina duration ke. Is point par ek AnalysisTemplate canary ke metrics ko stable version ke against evaluate kar raha hoगा; yahaan promotion manually kiya jaata hai. Ek baar promoted, Rollout remaining steps ke through proceed karता hai.',
      },
      {
        title: 'The analysis fails: Argo Rollouts auto-aborts and rolls back — no bad version keeps serving',
        titleHi: 'Analysis fail hota hai: Argo Rollouts auto-aborts aur roll back karता hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m11l3b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata: { name: web }
spec:
  replicas: 4
  selector: { matchLabels: { app: web } }
  strategy:
    canary:
      steps: [ { setWeight: 25 }, { pause: {} } ]
  template:
    metadata: { labels: { app: web } }
    spec:
      containers: [ { name: c, image: nginx:1.27-alpine } ]
YAML
kubectl argo rollouts status web -n "$ns" --timeout 90s >/dev/null 2>&1
v2c() { kubectl -n "$ns" get pod -l app=web -o jsonpath='{.items[*].spec.containers[0].image}' | tr ' ' '\\n' | grep -c '1.28'; }
runimg() { kubectl -n "$ns" get pod -l app=web -o jsonpath='{.items[0].spec.containers[0].image}'; }

kubectl argo rollouts set image web -n "$ns" c=nginx:1.28-alpine >/dev/null
sleep 15
echo "canary in progress: step $(kubectl -n "$ns" get rollout web -o jsonpath='{.status.currentStepIndex}'), $(v2c) of 4 Pods on v2 (25%)"

echo "--- the AnalysisRun fails (error rate on the canary breached its threshold) -> auto-abort ---"
kubectl argo rollouts abort web -n "$ns" >/dev/null       # what the failed analysis triggers automatically
for i in $(seq 1 25); do [ "$(v2c)" = 0 ] && break; sleep 2; done
echo "  after auto-abort: Pods on the canary version = $(v2c)/4   running image = $(runimg)"
echo "  (all traffic is back on the stable version - the canary never grew past 25%, and shrank to 0)"`,
        output: `canary in progress: step 1, 1 of 4 Pods on v2 (25%)
--- the AnalysisRun fails (error rate on the canary breached its threshold) -> auto-abort ---
  after auto-abort: Pods on the canary version = 0/4   running image = nginx:1.27-alpine
  (all traffic is back on the stable version - the canary never grew past 25%, and shrank to 0)`,
        explain: 'The Rollout ships v2 as a canary at 25%, which as before means one Pod on the new version and three on the old. The rollout is in progress at the first step. In a real setup an AnalysisRun attached to the canary would now be querying a metrics backend for the canary\'s error rate and latency and comparing them against thresholds; if a metric breaches its failure condition enough times, the analysis is declared failed. That failure automatically triggers an abort, which is what the example does explicitly with the plugin. The abort scales the canary back to zero and restores the stable version to full capacity: after it completes, zero of the four Pods are on v2 and the running image is back to v1. The rollout is left in a stopped, aborted state pointing at the last stable version, waiting for a human to investigate. The key properties are that the bad version was only ever exposed to a small slice of traffic, the decision to roll back was made by the analysis without a person being in the loop, and the rollback happened in seconds rather than requiring an emergency deploy. This is the difference between progressive delivery and a manual staged rollout — the loop that decides is automated.',
        explainHi: 'Rollout v2 ko 25% par ek canary ke roop mein ships karता hai, jo pehle jaisा matlab naye version par ek Pod aur old par teen. Rollout pehle step par in progress hai. Ek real setup mein canary se attached ek AnalysisRun ab canary ke error rate aur latency ke liye ek metrics backend query kar raha hoga aur unhe thresholds ke against compare kar raha hoga; agar ek metric apni failure condition ko kaafi baar breach karता hai, analysis failed declare hota hai. Wo failure automatically ek abort trigger karता hai. Abort canary ko wapas zero par scale karता hai aur stable version ko full capacity par restore karता hai: iske complete hone ke baad, chaar Pods mein se zero v2 par hain aur running image wapas v1 hai. Key properties ye hain ki bad version sirf traffic ke ek chhote slice ke exposed tha, roll back ka decision analysis dwara banaya gaya bina ek person ke loop mein hone ke, aur rollback seconds mein hua.',
      },
    ],

    mistakes: [
      {
        wrong: `# an analysis query that is meaningless at canary traffic volume
successCondition: result[0] < 0.01      # "canary error rate below 1%"
query: |
  sum(rate(http_errors{service="web-canary"}[1m]))
  /
  sum(rate(http_requests{service="web-canary"}[1m]))
# the canary gets 5% of 40 req/s = 2 req/s. in a 1m window that's ~120 requests.
# ONE error = 0.83% (pass). TWO errors = 1.67% (fail). the metric swings wildly on
# single-request noise -> the canary aborts randomly, or passes a genuinely broken build.`,
        right: `# make the analysis statistically sound for the volume the canary actually sees:
#   - LONGER windows / more intervals:  rate(...[5m]), interval: 1m, failureLimit: 3
//     (require 3 consecutive bad readings, not 1, before failing)
#   - COMPARE canary vs stable, don't use an absolute threshold:
//     successCondition: canaryErrorRate <= stableErrorRate * 1.1   (10% worse is the limit)
#   - for very low traffic: raise the canary weight (25% not 5%), or bake much longer, or
//     use a synthetic load generator against the canary during the bake
#   - include a request-count guard: inconclusive if the canary saw < N requests this window`,
        why: 'A canary analysis is a statistical test, and like any statistical test it needs enough samples to distinguish a real effect from noise. At a 5% canary weight on a modestly-trafficked service, the canary might see only a hundred or so requests in a one-minute analysis window, and at that scale a single failed request moves the error rate by nearly a percentage point. An absolute threshold like "error rate below 1%" then flips between pass and fail on the difference of one request, so the analysis either aborts healthy canaries on random noise or, if tuned loose enough to avoid that, fails to catch a build that is genuinely a few percent worse. The corrections are to give the analysis more data and to compare rather than threshold. More data means longer metric windows, requiring several consecutive bad intervals before declaring failure, and for very low traffic either raising the canary weight, baking much longer, or driving synthetic load through the canary during the bake. Comparing means the success condition is expressed relative to the stable version — the canary\'s error rate must not exceed the stable version\'s by more than a set margin — which cancels out fluctuations that affect both. A guard that marks the analysis inconclusive when the canary saw too few requests in a window prevents a decision being made on insufficient evidence.',
        whyHi: 'Ek canary analysis ek statistical test hai, aur kisi bhi statistical test ki tarah ise noise se ek real effect distinguish karne ke liye kaafi samples chahiye. Ek modestly-trafficked service par ek 5% canary weight par, canary ek one-minute analysis window mein sirf ek sau ya kuch requests dekh sakta hai, aur us scale par ek single failed request error rate ko lagbhag ek percentage point move karता hai. Ek absolute threshold jaise "error rate below 1%" phir ek request ke difference par pass aur fail ke beech flip karता hai. Corrections analysis ko zyada data dena aur threshold ke bajaay compare karna hain. Zyada data ka matlab longer metric windows, failure declare karne se pehle kई consecutive bad intervals require karna. Compare karne ka matlab success condition stable version ke relative express ki jaati hai.',
      },
      {
        wrong: `# treating Argo Rollouts / Flagger as "install it and you have canary deploys"
# reality after installing Argo Rollouts:
#   - no trafficRouting configured -> "25%" is really "1 of 4 replicas" (coarse, and
//     at replicas: 3 you can't even express 10%)
#   - no AnalysisTemplate -> every step is just a timed pause; nothing checks metrics;
//     "promote" is still a human clicking
#   - Prometheus isn't scraping the canary/stable services separately -> the analysis
//     query returns nothing -> analysis is "inconclusive" forever
# you have a fancier Deployment, not progressive delivery.`,
        right: `# progressive delivery = the controller + THREE things it depends on:
#   1. TRAFFIC ROUTING: a mesh (Istio/Linkerd) or a weighting ingress (nginx/Traefik) or
//      Gateway API, wired into the Rollout's trafficRouting - so setWeight is real
#   2. METRICS: Prometheus (etc.) scraping web-canary and web-stable with distinct labels,
//      + AnalysisTemplates with queries that work at low volume (compare-to-stable, long windows)
#   3. SLOs: the error-rate / latency thresholds agreed BEFORE the rollout, in the template
# THEN a Rollout with setWeight + analysis steps actually gates on real signal, and
# abort/rollback is automatic. the controller is necessary but not sufficient.`,
        why: 'Argo Rollouts and Flagger are controllers that orchestrate a canary, but the canary they orchestrate is only as good as the inputs it is given, and installing the controller provides none of those inputs. Without a traffic-routing integration the weight is approximated by the ratio of replica counts, which cannot express fine-grained percentages and is not a true per-request split, so a 5% canary is not actually possible on a small deployment. Without AnalysisTemplates the steps are just timed pauses that advance on a schedule or a manual promote, with nothing examining metrics, so the automated decision that defines progressive delivery is absent. And without a metrics backend that scrapes the canary and stable versions under distinct labels, any analysis query returns no data and the analysis can never conclude. The controller is one of four components. The other three — a real traffic-splitting mechanism, a metrics source with the canary and stable properly labelled and queries that are valid at canary volume, and error-rate and latency thresholds decided in advance — are what turn the controller from a more elaborate deployment object into an actual automated canary that gates on production signal and rolls itself back.',
        whyHi: 'Argo Rollouts aur Flagger controllers hain jo ek canary orchestrate karते hain, par jo canary wo orchestrate karते hain wo sirf utna acha hai jitne inputs ise diye jaate hain, aur controller install karna un inputs mein se koi provide nahi karता. Ek traffic-routing integration ke bina weight replica counts ke ratio se approximate hota hai, jo fine-grained percentages express nahi kar sakta. AnalysisTemplates ke bina steps sirf timed pauses hain, metrics ko examine karne wала kuch nahi. Aur ek metrics backend ke bina jo canary aur stable versions ko distinct labels ke tahat scrape karता hai, koi bhi analysis query koi data return nahi karता. Controller chaar components mein se ek hai. Doosre teen — ek real traffic-splitting mechanism, ek metrics source, aur thresholds jo pehle decide kiye — wo hain jo controller ko ek actual automated canary mein badalते hain.',
      },
      {
        wrong: `# using an infra canary where a feature flag was the right tool (and vice versa)
# case A: a risky new PRICING ALGORITHM. team sets up an Argo Rollouts canary on the
#   whole pricing-service deployment. but the old + new algorithm ship in the SAME binary
#   now - the canary can only test "the new build", not "algorithm A vs algorithm B", and
#   can't target by customer tier. a flag inside the service was the fit.
# case B: a RUNTIME UPGRADE (Node 18 -> 20) + a rewritten HTTP layer. team puts it behind
#   a feature flag. but there's no "if (flag) use Node 20" - the runtime is the whole
#   process. an infra canary on the deployment was the fit.`,
        right: `# match the layer to the change:
# FEATURE FLAG (app logic, per-user, no infra):  a feature's BEHAVIOUR - a new algorithm,
#   a redesigned flow, an experiment - especially when you want per-tier / per-region targeting
#   or an instant kill switch without touching the deployment.
# INFRA CANARY (traffic, per-request, needs mesh+metrics):  a whole new VERSION of the
#   service - a new build, a base-image / runtime upgrade, a dependency bump, a framework
#   change, a config baked into the artifact - things that aren't a single 'if' in the code.
# MATURE: infra-canary the artifact AND gate the risky behaviour inside it with a flag.`,
        why: 'A feature flag and an infrastructure canary both perform a gradual rollout, but they operate at different layers and are suited to different kinds of change. A feature flag is a branch inside the running process, chosen per request from external configuration, so it can select between two behaviours that both exist in the same binary and can target the choice by user, tier, or region, and it can be flipped off instantly without any deployment activity. That makes it the right tool for a change that is fundamentally a behavioural alternative — a new algorithm, a redesigned flow, an A/B experiment — where both options must coexist in the code and fine-grained targeting or an instant kill switch matters. An infrastructure canary shifts a share of traffic between two running versions of the whole service, so it is the right tool for a change that is not expressible as a conditional in the code at all — a new build, a language-runtime upgrade, a rewritten HTTP layer, a dependency or framework change, a configuration value compiled into the artifact. Using a flag for the second kind fails because there is no single branch point to gate; using a canary for the first kind fails because the canary can only compare whole builds, not the two behaviours within one build, and cannot target by customer attribute. The mature approach combines them: roll the artifact out with an infrastructure canary, and gate the risky new behaviour inside that artifact with a flag on its own schedule.',
        whyHi: 'Ek feature flag aur ek infrastructure canary dono ek gradual rollout perform karते hain, par wo alag layers par operate karते hain aur alag kinds ke change ke liye suited hain. Ek feature flag running process ke andar ek branch hai, per request external configuration se chuna gaya, to ye do behaviours ke beech select kar sakta hai jo dono same binary mein exist karते hain aur choice ko user, tier, ya region se target kar sakta hai. Wo ise ek change ke liye sahi tool banata hai jo fundamentally ek behavioural alternative hai. Ek infrastructure canary poore service ke do running versions ke beech traffic ka ek share shift karता hai, to ye ek change ke liye sahi tool hai jo code mein ek conditional ke roop mein express nahi hoता — ek naya build, ek language-runtime upgrade. Mature approach unhe combine karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A canary that aborted itself every third deploy** — the analysis query used an absolute `errorRate < 0.5%` on a canary getting ~80 req/min. A single 500 in a bad minute (0.7ms of a real db blip) failed it. Rewrote as `canaryRate <= stableRate * 1.2` over 5m windows with `failureLimit: 3`; the false aborts stopped.',
        hi: '**Ek canary jo har teesre deploy khud ko abort karता tha** — analysis query ek absolute `errorRate < 0.5%` use karती thi. `canaryRate <= stableRate * 1.2` ke roop mein rewrite kiya.',
      },
      {
        en: '**"We have Argo Rollouts, so we do canary deploys"** — no mesh, no AnalysisTemplate, no per-service Prometheus labels. Every rollout was `setWeight` steps with `pause: { duration: 10m }` and an on-call clicking promote. A quarter of eng time later it was a real canary: Linkerd for routing, a compare-to-stable success-rate template, SLO thresholds in review.',
        hi: '**"Humare paas Argo Rollouts hai, to hum canary deploys karते hain"** — koi mesh nahi, koi AnalysisTemplate nahi. Ek quarter baad ye ek real canary tha.',
      },
      {
        en: '**A pricing A/B test run as an infra canary** — the team canaried the whole pricing service to test algorithm B, but B shipped in the same build as A, so the canary could only say "this build is healthy", not "B converts better", and couldn\'t target by plan tier. Moved the A/B into a feature flag; kept the infra canary for the build rollout.',
        hi: '**Ek pricing A/B test ek infra canary ke roop mein chalाया gaya** — team ne poore pricing service ko canary kiya, par B same build mein A ke saath shipped tha. A/B ko ek feature flag mein move kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What distinguishes a real canary (progressive delivery) from a manual staged rollout?',
        qHi: 'Ek real canary (progressive delivery) ko ek manual staged rollout se kya distinguish karता hai?',
        a: 'A staged rollout sends the new version to a small group and then a person watches a dashboard and decides whether to proceed. A real canary replaces the person with an automated control loop. The loop routes a small, growing percentage of live traffic to the new version, bakes at each weight for a period long enough to gather meaningful metrics, runs an analysis that compares the canary against the stable version on defined metrics — error rate, latency percentiles, sometimes a business signal — using thresholds set in advance, and then automatically promotes to the next weight on a pass or aborts and rolls everything back to stable on a fail. A human is only involved for a genuinely ambiguous result or after an abort. This matters because a person watching a dashboard does not reliably detect a small latency regression or a fractional error-rate increase, does not consistently wait the full bake especially at 3am, makes inconsistent decisions depending on who is on call, and reacts slowly when something goes wrong. Tools like Argo Rollouts and Flagger implement the loop, but they depend on three things being in place: a traffic-splitting mechanism so the weight is a real per-request split, a metrics source with the canary and stable labelled distinctly and queries valid at canary volume, and agreed error-rate and latency thresholds. Without those you have the controller but still only a manual staged rollout.',
        aHi: 'Ek staged rollout naye version ko ek chhote group ko bhejता hai aur phir ek person ek dashboard dekhता hai aur decide karता hai proceed karna hai ya nahi. Ek real canary person ko ek automated control loop se replace karता hai. Loop live traffic ka ek chhota, growing percentage naye version ko route karता hai, har weight par ek period ke liye bake karता hai, ek analysis chalाता hai jo canary ko stable version ke against defined metrics par compare karता hai thresholds ke saath jo pehle set kiye, aur phir automatically ek pass par agle weight par promote karता hai ya ek fail par sab kuch stable par roll back karता hai. Ek human sirf ek genuinely ambiguous result ke liye involved hai. Tools jaise Argo Rollouts aur Flagger loop implement karते hain, par wo teen cheezon par depend karते hain: ek traffic-splitting mechanism, ek metrics source, aur agreed thresholds.',
      },
      {
        q: 'How do Argo Rollouts and Flagger differ, and what does an AnalysisTemplate do?',
        qHi: 'Argo Rollouts aur Flagger kaise differ karते hain, aur ek AnalysisTemplate kya karता hai?',
        a: 'Both automate a canary or blue-green rollout with metric-based analysis and automatic rollback, and both integrate with the same meshes and ingress controllers for traffic shifting. The structural difference is what owns the workload. Argo Rollouts replaces the Deployment object entirely with a Rollout object that has the canary and blue-green strategies, steps, weights, pauses, and analysis built into its spec; you manage the Rollout instead of a Deployment. Flagger keeps a normal Deployment and adds a separate Canary custom resource that references it and declares the analysis parameters; Flagger watches the Deployment, and when its pod template changes it creates and drives a canary around it. So Argo Rollouts is the workload controller and Flagger orchestrates alongside a stock Deployment. An AnalysisTemplate, in the Argo Rollouts model, defines what passing means: a set of metrics, each with a provider — Prometheus, Datadog, CloudWatch, a web request, or a Job — a query, a success condition and optionally a failure condition expressed over the query result, and limits on how many failed or inconclusive readings are tolerated before the metric is declared failed. A Rollout references analysis templates either as a step, which runs once at that point and blocks, or at the canary level, which runs continuously in the background through the whole rollout. When the analysis fails, the Rollout aborts and rolls back to the stable version automatically. Flagger expresses the equivalent inline in the Canary resource as a list of metrics with threshold ranges.',
        aHi: 'Dono ek canary ya blue-green rollout ko metric-based analysis aur automatic rollback ke saath automate karते hain. Structural difference ye hai ki workload kya own karता hai. Argo Rollouts Deployment object ko poori tarah ek Rollout object se replace karता hai jismें canary aur blue-green strategies, steps, weights, pauses, aur analysis iske spec mein built in hain. Flagger ek normal Deployment rakhता hai aur ek separate Canary custom resource add karता hai. Ek AnalysisTemplate define karता hai ki passing ka kya matlab hai: metrics ka ek set, har ek ek provider ke saath — Prometheus, Datadog, ek web request, ya ek Job — ek query, ek success condition. Jab analysis fail hota hai, Rollout aborts aur stable version par automatically roll back karता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, describe the four-stage canary control loop and the three prerequisites without which you only have a manual staged rollout.',
        taskHi: 'Ek comment mein, chaar-stage canary control loop describe karo.',
        hint: 'THE LOOP (repeating): (1) SET THE WEIGHT — route a defined % of LIVE traffic to the new version, start small (1-5%). (2) BAKE — hold that weight long enough to accumulate a statistically useful number of requests THROUGH the canary (~10m at low traffic, less at high). (3) ANALYSE — compare CANARY vs STABLE over the bake window on defined metrics: error rate, latency percentiles, optionally a business KPI — using thresholds/tolerances set IN ADVANCE (and expressed RELATIVE to stable, not as absolutes). (4) DECIDE — PASS → increase the weight (5→25→50→100) and loop; FAIL → ABORT: weight back to 0, all traffic to stable, page a human. Stage 4 is made by SOFTWARE, not a person watching a dashboard — that\'s the whole point (a human misses a small regression, doesn\'t wait the full bake at 3am, decides inconsistently, reacts slowly). THREE PREREQUISITES (without these = a manual STAGED ROLLOUT, better than all-at-once but NOT progressive delivery): (1) TRAFFIC SPLITTING — a mesh (Istio/Linkerd), a weighting ingress (nginx/Traefik), Gateway API, or SMI, so `setWeight` is a real per-request split (Argo Rollouts can approximate with replica ratios + no mesh — coarse, can\'t do 10% at replicas: 3). (2) METRICS — a real source (Prometheus/Datadog/CloudWatch) scraping canary + stable with DISTINCT labels, and queries valid at the LOW volume a 5% canary sees (long windows, `failureLimit: 3`, compare-to-stable). (3) SLOs/THRESHOLDS — the error-rate / latency limits agreed BEFORE the rollout (deciding during an incident defeats the purpose).',
        hintHi: 'THE LOOP: (1) WEIGHT SET KARO — LIVE traffic ka ek defined % naye version ko route karo (1-5%). (2) BAKE — us weight ko kaafi der hold karo. (3) ANALYSE — CANARY vs STABLE ko bake window ke dauraan defined metrics par compare karo, thresholds ke saath jo PEHLE set kiye. (4) DECIDE — PASS → weight badhाओ aur loop; FAIL → ABORT. Stage 4 SOFTWARE dwara banaya jaata hai. TEEN PREREQUISITES (inke bina = ek manual STAGED ROLLOUT): (1) TRAFFIC SPLITTING; (2) METRICS — canary + stable DISTINCT labels ke saath; (3) SLOs/THRESHOLDS — PEHLE agreed.',
      },
      {
        task: 'In a comment, explain what Argo Rollouts and Flagger each are, the difference between them, and how a step-level vs canary-level `analysis` differs.',
        taskHi: 'Ek comment mein, Argo Rollouts aur Flagger samjhao.',
        hint: 'Both automate canary/blue-green with metric analysis + automatic rollback; both integrate with the same meshes/ingresses for traffic shifting. THE DIFFERENCE = what owns the workload. ARGO ROLLOUTS: REPLACES the `Deployment` with a `Rollout` object (`apiVersion: argoproj.io/v1alpha1`) that has `strategy.canary` (or `.blueGreen`) with `steps`, `setWeight`, `pause`, `analysis`, `canaryService`/`stableService`/`trafficRouting` built into its spec — you manage the Rollout instead of a Deployment. Plugin: `kubectl argo rollouts get rollout <n>` (live step/weight view), `promote <n>` (past a `pause: {}`), `promote <n> --full` (skip remaining steps), `abort <n>` (all traffic → stable). `.status.phase` = `Progressing`/`Paused`/`Healthy`/`Degraded`. FLAGGER: keeps a NORMAL `Deployment` + a separate `Canary` custom resource (`flagger.app/v1beta1`) referencing it via `targetRef`, with `analysis` (interval, threshold, maxWeight, stepWeight, metrics with `thresholdRange`) declared inline. Flagger watches the Deployment; on a pod-template change it creates + drives a canary Deployment, steps the weight up, runs checks each interval, and on breach scales the canary to 0 leaving stable serving. → Argo Rollouts IS the workload controller; Flagger ORCHESTRATES around a stock Deployment. STEP-LEVEL `analysis` (inside `steps:`) = runs an `AnalysisRun` ONCE at that point and BLOCKS on the result. CANARY-LEVEL `analysis` (under `strategy.canary`, not in steps) = runs CONTINUOUSLY in the background through the WHOLE rollout and aborts the moment it fails. `AnalysisTemplate`: `metrics` each with a `provider` (prometheus/datadog/newRelic/cloudwatch/web/job), a `query`, `successCondition`/`failureCondition` expressions over the result, `failureLimit`/`inconclusiveLimit`. Failure → the Rollout auto-aborts + rolls back.',
        hintHi: 'Dono canary/blue-green ko metric analysis + automatic rollback ke saath automate karते hain. THE DIFFERENCE = workload kya own karता hai. ARGO ROLLOUTS: `Deployment` ko ek `Rollout` object se REPLACE karता hai jismें `strategy.canary` `steps`, `setWeight`, `pause`, `analysis` built in hain. Plugin: `kubectl argo rollouts get/promote/abort`. FLAGGER: ek NORMAL `Deployment` + ek separate `Canary` resource rakhता hai; Flagger Deployment watch karता hai, canary drive karता hai, breach par canary ko 0 par scale karता hai. STEP-LEVEL `analysis` = us point par EK BAAR chalता hai aur BLOCK karता hai. CANARY-LEVEL `analysis` = poore rollout ke through CONTINUOUSLY background mein chalता hai.',
      },
      {
        task: 'In a comment, explain when to use a feature flag vs an infrastructure canary, and why using the wrong one fails.',
        taskHi: 'Ek comment mein, samjhao ki feature flag vs infrastructure canary kab use karna hai.',
        hint: 'Both do a gradual rollout, at DIFFERENT LAYERS. FEATURE FLAG (Lesson 2) = a branch INSIDE the running process, chosen PER REQUEST from external config → selects between two behaviours that BOTH exist in the same binary; can target by user / tier / region; instant kill switch with NO deployment activity. Right for: a feature\'s BEHAVIOUR — a new algorithm, a redesigned flow, an A/B experiment — especially with per-tier/per-region targeting or an instant off-switch. INFRA CANARY = shifts a % of TRAFFIC between two RUNNING VERSIONS of the whole service (per request, needs mesh + metrics). Right for: a change NOT expressible as an `if` in the code — a new build, a base-image / language-runtime upgrade, a rewritten HTTP layer, a dependency / framework bump, a config compiled into the artifact. WRONG-TOOL FAILURES: (a) a flag for a runtime upgrade (Node 18→20) → there\'s no single branch point; the runtime is the whole process. (b) an infra canary for a pricing A/B → the old + new algorithm ship in the SAME build, so the canary can only say "this build is healthy", NOT "algorithm B converts better", and can\'t target by plan tier. MATURE SETUP: infra-canary the ARTIFACT (rolling/blue-green/canary of an always-backward-compatible build) AND gate the risky new BEHAVIOUR inside it with a flag on its own schedule + instant kill.',
        hintHi: 'Dono ek gradual rollout karते hain, ALAG LAYERS par. FEATURE FLAG = running process ke ANDAR ek branch, PER REQUEST external config se chuna → do behaviours ke beech select karता hai jo DONO same binary mein exist karते hain; user/tier/region se target kar sakta hai; instant kill switch. Right for: ek feature ka BEHAVIOUR. INFRA CANARY = poore service ke do RUNNING VERSIONS ke beech TRAFFIC ka % shift karता hai. Right for: ek change jo code mein ek `if` ke roop mein express NAHI hoता — ek naya build, ek runtime upgrade. WRONG-TOOL: (a) ek flag ek runtime upgrade ke liye → koi single branch point nahi. (b) ek infra canary ek pricing A/B ke liye → old + new algorithm SAME build mein. MATURE: infra-canary the ARTIFACT AND flag the risky BEHAVIOUR inside it.',
      },
    ],

    keyTakeaways: [
      'A REAL CANARY IS A CONTROL LOOP, not "deploy to a few Pods + eyeball a dashboard": (1) SET WEIGHT (small % of LIVE traffic to new, start 1-5%); (2) BAKE (hold long enough for a statistically useful request count); (3) ANALYSE (compare CANARY vs STABLE on error rate / latency / a KPI over the window, thresholds set IN ADVANCE, expressed RELATIVE to stable); (4) DECIDE — PASS → raise the weight + loop; FAIL → ABORT (weight → 0, all traffic to stable, page a human). Stage 4 is done by SOFTWARE — a human misses small regressions, skips the bake at 3am, decides inconsistently, reacts slowly.',
      'ARGO ROLLOUTS: a `Rollout` object REPLACES the `Deployment` — `strategy.canary` with `steps` (`setWeight`, `pause: { duration }` = timed bake, `pause: {}` = wait indefinitely for `promote`), `canaryService`/`stableService`/`trafficRouting`. `kubectl argo rollouts get/promote/promote --full/abort`; `.status.phase` = `Progressing`/`Paused`/`Healthy`/`Degraded`. With a mesh/ingress `setWeight` is a real per-request split; WITHOUT one it\'s approximated by the canary:stable REPLICA RATIO (coarse — can\'t do 10% at replicas: 3).',
      'ANALYSISTEMPLATE = the automated gate: `metrics`, each with a `provider` (prometheus / datadog / newRelic / cloudwatch / web request / Job), a `query`, `successCondition`/`failureCondition` over the result, `failureLimit`/`inconclusiveLimit`. STEP-LEVEL `analysis` (in `steps:`) runs ONCE at that point and blocks; CANARY-LEVEL `analysis` runs CONTINUOUSLY in the background and aborts the instant it fails. On failure the Rollout AUTO-ABORTS + rolls back to stable — no human for the common case.',
      'FLAGGER does the same job with a different shape: keeps a NORMAL `Deployment` + a separate `Canary` resource (`targetRef`, inline `analysis` with `stepWeight`/`maxWeight`/`interval`/`threshold`/`metrics` `thresholdRange`). Flagger watches the Deployment, creates + drives a canary on a pod-template change, checks metrics each interval, and on breach scales the canary to 0 (stable keeps serving). ARGO ROLLOUTS *is* the workload controller; FLAGGER *orchestrates* around a stock Deployment. Both use the same meshes/ingresses.',
      'PREREQUISITES — without ALL THREE you have a manual STAGED ROLLOUT (still better than all-at-once), not progressive delivery: (1) TRAFFIC SPLITTING (a mesh / weighting ingress / Gateway API / SMI); (2) METRICS (a real source scraping canary + stable with DISTINCT labels, queries valid at LOW canary volume — long windows, compare-to-stable, `failureLimit` > 1); (3) SLOs/THRESHOLDS agreed BEFORE the rollout. CANARY vs FEATURE FLAG (Lesson 2): a FLAG splits in APP LOGIC (per-user, no infra) — for a feature\'s BEHAVIOUR; an INFRA CANARY splits TRAFFIC (per-request, needs mesh) — for a whole new VERSION of a service (a build / runtime / dependency change not expressible as an `if`). Mature: infra-canary the artifact AND flag the risky behaviour inside it.',
    ],
    keyTakeawaysHi: [
      'EK REAL CANARY EK CONTROL LOOP HAI: (1) WEIGHT SET (LIVE traffic ka chhota % naye ko, 1-5%); (2) BAKE (kaafi der hold); (3) ANALYSE (CANARY vs STABLE ko error rate / latency par window ke dauraan compare, thresholds PEHLE set, stable ke RELATIVE); (4) DECIDE — PASS → weight badhाओ + loop; FAIL → ABORT. Stage 4 SOFTWARE dwara — ek human small regressions miss karता hai, 3am par bake skip karता hai.',
      'ARGO ROLLOUTS: ek `Rollout` object `Deployment` ko REPLACE karता hai — `strategy.canary` `steps` ke saath (`setWeight`, `pause: { duration }` = timed bake, `pause: {}` = `promote` ke liye indefinitely wait). `kubectl argo rollouts get/promote/abort`; `.status.phase`. Ek mesh ke saath `setWeight` ek real split hai; iske BINA ye canary:stable REPLICA RATIO se approximated hai.',
      'ANALYSISTEMPLATE = automated gate: `metrics`, har ek ek `provider` (prometheus/datadog/web/Job), ek `query`, `successCondition`/`failureCondition`, `failureLimit`. STEP-LEVEL `analysis` EK BAAR chalता hai aur block karता hai; CANARY-LEVEL `analysis` CONTINUOUSLY background mein chalता hai. Failure par Rollout AUTO-ABORTS + roll back karता hai.',
      'FLAGGER same job ek alag shape ke saath: ek NORMAL `Deployment` + ek separate `Canary` resource rakhता hai. Flagger Deployment watch karता hai, ek canary drive karता hai, breach par canary ko 0 par scale karता hai. ARGO ROLLOUTS *hai* workload controller; FLAGGER *orchestrates* ek stock Deployment ke aas-paas.',
      'PREREQUISITES — TEENON ke bina ek manual STAGED ROLLOUT hai, progressive delivery nahi: (1) TRAFFIC SPLITTING; (2) METRICS (canary + stable DISTINCT labels, low volume par valid queries); (3) SLOs/THRESHOLDS PEHLE agreed. CANARY vs FEATURE FLAG: ek FLAG APP LOGIC mein split karता hai (per-user) — ek feature ke BEHAVIOUR ke liye; ek INFRA CANARY TRAFFIC split karता hai (per-request, mesh chahiye) — ek service ke poore naye VERSION ke liye. Mature: infra-canary the artifact AND flag the risky behaviour inside it.',
    ],
  },
];
