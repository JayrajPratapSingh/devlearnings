/**
 * DevOps Complete Course — Module 8: Kubernetes — Deployments, Services, Ingress
 * & Config, lessons 1-3.
 *
 * Lesson 1: ReplicaSet -> Deployment -> rollout & rollback — the ownership chain,
 *           RollingUpdate vs Recreate, maxSurge/maxUnavailable, revision history,
 *           `rollout status/undo/pause/resume`. VERIFIED against a real cluster.
 * Lesson 2: Services — ClusterIP / NodePort / LoadBalancer / headless, how
 *           EndpointSlices + kube-proxy route a stable VIP to changing Pods,
 *           in-cluster DNS. VERIFIED.
 * Lesson 3: Ingress & the IngressController — L7 host/path routing, TLS
 *           termination, why Ingress needs a controller, IngressClass, a note on
 *           Gateway API. VERIFIED against a real ingress-nginx.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_8: CourseLesson[] = [
  {
    slug: 'ops-replicaset-deployment-rollout-and-rollback',
    title: 'ReplicaSet, Deployment, Rollout & Rollback',
    titleHi: 'ReplicaSet, Deployment, Rollout Aur Rollback',
    description: 'A ReplicaSet keeps N identical Pods running. A Deployment owns ReplicaSets and turns "change the Pod template" into a controlled rollout: it creates a new ReplicaSet and shifts Pods from old to new a few at a time, gated on readiness, and keeps the old ones so `rollout undo` is instant.',
    descriptionHi: 'Ek ReplicaSet N identical Pods running rakhta hai. Ek Deployment ReplicaSets ko own karta hai aur "Pod template change karo" ko ek controlled rollout mein badalta hai: ye ek naya ReplicaSet banata hai aur Pods ko old se new ek baar mein kuch shift karta hai, readiness par gated, aur old ones rakhta hai taaki `rollout undo` instant hai.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 1,

    analogy: {
      en: '**Replacing the crew of a running ferry without stopping the ferry.** A ReplicaSet is the standing order "there must always be 20 deckhands on duty" — someone quits, someone is hired, the count holds. A Deployment is the supervisor who runs a shift change to a new uniform: they do not send everyone home at once (that is `Recreate` — the ferry stops). They bring two new-uniform deckhands aboard (`maxSurge`), wait until each is checked in and working (the readiness probe), then send two old-uniform ones home (`maxUnavailable`), and repeat until the whole crew is swapped. The old-uniform roster is kept on file, so if the new uniforms turn out to be defective, one call puts the old crew straight back (`rollout undo`).',
      hi: '**Ek running ferry ki crew replace karna bina ferry rokei.** Ek ReplicaSet standing order hai "hamesha 20 deckhands duty par hone chahiye" — koi chhodta hai, koi hire hota hai, count hold karta hai. Ek Deployment supervisor hai jo ek naye uniform mein ek shift change chalata hai: wo sabko ek saath ghar nahi bhejte (wo `Recreate` hai — ferry rukti hai). Wo do new-uniform deckhands aboard laate hain (`maxSurge`), har ek ke check in aur working hone tak wait karte hain (readiness probe), phir do old-uniform ghar bhejte hain (`maxUnavailable`), aur repeat karte hain jab tak poori crew swap nahi ho jaati. Old-uniform roster file par rakha jaata hai, to agar new uniforms defective nikalte hain, ek call old crew ko wapas rakhta hai (`rollout undo`).',
    },

    simple: `**THE OWNERSHIP CHAIN:**
\`\`\`
Deployment  --owns-->  ReplicaSet(s)  --owns-->  Pods
  you edit .spec.template ────────────► a NEW ReplicaSet is created with it
\`\`\`
\`ownerReferences\` on each child link it up; delete a Deployment -> its ReplicaSets ->
its Pods are garbage-collected (cascading delete).

**ReplicaSet — keeps a fixed count of identical Pods:**
\`\`\`yaml
spec:
  replicas: 3
  selector: { matchLabels: { app: web } }      # "the Pods I own match this"
  template: { metadata: { labels: { app: web } }, spec: { ... } }
\`\`\`
reconcile loop: count Pods matching the selector; create/delete to reach \`replicas\`.
You almost never create one directly — a Deployment manages it.

**Deployment — a ReplicaSet manager that does ROLLOUTS:**
\`\`\`yaml
spec:
  replicas: 4
  revisionHistoryLimit: 10          # keep the last 10 ReplicaSets for rollback
  strategy:
    type: RollingUpdate            # or 'Recreate'
    rollingUpdate:
      maxSurge: 25%                # extra Pods allowed ABOVE replicas during a roll
      maxUnavailable: 25%          # Pods allowed BELOW replicas during a roll
  minReadySeconds: 10             # a new Pod must stay Ready this long to "count"
  progressDeadlineSeconds: 600    # no progress for this long -> Progressing=False (stuck)
  template: { ... the Pod spec ... }
\`\`\`

**WHAT A ROLLING UPDATE ACTUALLY DOES** (you \`kubectl set image\` / \`apply\` a new template):
\`\`\`
1. Deployment creates ReplicaSet-v2 (replicas: 0), keeps ReplicaSet-v1 (replicas: 4)
2. scale v2 up toward maxSurge; scale v1 down within maxUnavailable
3. each new v2 Pod must pass its READINESS probe (+ minReadySeconds) before the next step
4. repeat: v2 up, v1 down ... until v2=4, v1=0
5. v1 is kept at replicas:0 (in history) for rollback
if a v2 Pod never becomes Ready -> the rollout STALLS (does not auto-rollback; you do)
\`\`\`

**Recreate strategy:** scale v1 to 0 (full downtime), THEN scale v2 up. Use only when two
versions genuinely cannot run at once (a schema the old code can't tolerate, a singleton lock).

**COMMANDS:**
\`\`\`
kubectl set image deploy/web web=myco/web:1.5    # change the image (triggers a roll)
kubectl rollout status deploy/web                # watch it, exit 0 when done / non-0 if stuck
kubectl rollout history deploy/web               # the revisions
kubectl rollout history deploy/web --revision=3  # the template of revision 3
kubectl rollout undo deploy/web                  # -> previous revision (instant: scale RS's)
kubectl rollout undo deploy/web --to-revision=3
kubectl rollout pause deploy/web / resume        # batch several edits, then resume = one roll
kubectl rollout restart deploy/web               # roll all Pods (new pods, same template)
\`\`\`
Add \`--record\` (deprecated) or set the \`kubernetes.io/change-cause\` annotation so
\`rollout history\` shows WHY each revision happened.

**KEY POINTS:**
\`\`\`
- rollout undo is FAST because the old ReplicaSet still exists at replicas:0 — undo just
  scales it back up and the new one down. no image re-pull, no rebuild.
- a stalled rollout does NOT roll back by itself. \`rollout status\` returns non-zero; a
  CI/CD pipeline should gate on it and call \`rollout undo\` (Module 11 automates this).
- \`spec.selector\` is IMMUTABLE (Module 7). \`replicas\` is ignored if an HPA owns it (Module 9).
- scaling (\`kubectl scale\`) is NOT a rollout — same template, just more/fewer Pods.
\`\`\``,

    simpleHi: `**OWNERSHIP CHAIN:**
\`\`\`
Deployment  --owns-->  ReplicaSet(s)  --owns-->  Pods
  aap .spec.template edit karte ho ──────► ek NAYA ReplicaSet iske saath banta hai
\`\`\`
Har child par \`ownerReferences\` ise link up karti hain; ek Deployment delete karo -> iske
ReplicaSets -> iske Pods garbage-collected (cascading delete).

**ReplicaSet — identical Pods ka ek fixed count rakhta hai:**
\`\`\`yaml
spec:
  replicas: 3
  selector: { matchLabels: { app: web } }
  template: { metadata: { labels: { app: web } }, spec: { ... } }
\`\`\`
reconcile loop: selector se matching Pods count karo; \`replicas\` reach karne ke liye create/delete.

**Deployment — ek ReplicaSet manager jo ROLLOUTS karta hai:**
\`\`\`yaml
spec:
  replicas: 4
  revisionHistoryLimit: 10
  strategy:
    type: RollingUpdate            # ya 'Recreate'
    rollingUpdate:
      maxSurge: 25%                # roll ke dauran replicas ke UPAR allowed extra Pods
      maxUnavailable: 25%          # roll ke dauran replicas ke NEECHE allowed Pods
  minReadySeconds: 10
  progressDeadlineSeconds: 600
  template: { ... Pod spec ... }
\`\`\`

**EK ROLLING UPDATE ACTUALLY KYA KARTA HAI:**
\`\`\`
1. Deployment ReplicaSet-v2 (replicas: 0) banata hai, ReplicaSet-v1 (replicas: 4) rakhta hai
2. v2 ko maxSurge ki taraf scale up karo; v1 ko maxUnavailable ke andar scale down karo
3. har naya v2 Pod agle step se pehle apni READINESS probe (+ minReadySeconds) pass karna chahiye
4. repeat: v2 up, v1 down ... jab tak v2=4, v1=0
5. v1 ko replicas:0 par rakha jaata hai (history mein) rollback ke liye
agar ek v2 Pod kabhi Ready nahi hota -> rollout STALLS (auto-rollback nahi; aap karte ho)
\`\`\`

**Recreate strategy:** v1 ko 0 par scale karo (full downtime), PHIR v2 up. Sirf tab jab do
versions genuinely ek saath nahi chal sakte.

**COMMANDS:**
\`\`\`
kubectl set image deploy/web web=myco/web:1.5
kubectl rollout status deploy/web                # done par exit 0 / stuck par non-0
kubectl rollout history deploy/web
kubectl rollout undo deploy/web                  # -> previous revision (instant: RS's scale)
kubectl rollout undo deploy/web --to-revision=3
kubectl rollout pause deploy/web / resume
kubectl rollout restart deploy/web
\`\`\`

**KEY POINTS:**
\`\`\`
- rollout undo FAST hai kyunki old ReplicaSet abhi bhi replicas:0 par exist karta hai
- ek stalled rollout khud roll back NAHI hota. \`rollout status\` non-zero return karta hai
- \`spec.selector\` IMMUTABLE hai. \`replicas\` ignore hota hai agar ek HPA ise own karta hai
- scaling (\`kubectl scale\`) ek rollout NAHI hai — same template, bas zyada/kam Pods
\`\`\``,

    content: `## The ownership chain

Three objects, each owning the next:

- A **Deployment** describes the desired application: a replica count and a **Pod template** (\`spec.template\`), plus an update strategy.
- A **ReplicaSet** keeps a fixed number of Pods that match its selector running. A Deployment creates one ReplicaSet per version of its template.
- **Pods** are the running instances.

Each child object carries an **\`ownerReference\`** pointing at its parent. This is how \`kubectl get\` shows the tree, how a **cascading delete** works (delete the Deployment and its ReplicaSets and their Pods are garbage-collected), and how a controller knows which children are "its own".

## ReplicaSet

\`\`\`yaml
apiVersion: apps/v1
kind: ReplicaSet
spec:
  replicas: 3
  selector:
    matchLabels: { app: web }
  template:
    metadata: { labels: { app: web } }    # must satisfy the selector
    spec:
      containers: [ { name: web, image: nginx:1.27 } ]
\`\`\`

Its reconciliation loop is exactly: list Pods matching \`selector\`, count them, and create or delete Pods (from \`template\`) until the count equals \`replicas\`. That is the whole controller. You almost never write a ReplicaSet directly — a Deployment manages them for you and adds the thing a bare ReplicaSet lacks: updates.

## Deployment

A Deployment adds rollout logic on top of ReplicaSets:

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: web }
spec:
  replicas: 4
  revisionHistoryLimit: 10
  selector: { matchLabels: { app: web } }
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1              # or a %: how many Pods ABOVE replicas during the roll
      maxUnavailable: 1        # or a %: how many Pods BELOW replicas during the roll
  minReadySeconds: 10
  progressDeadlineSeconds: 600
  template:
    metadata: { labels: { app: web } }
    spec:
      containers: [ { name: web, image: myco/web:1.4 } ]
\`\`\`

- **\`revisionHistoryLimit\`** — how many old ReplicaSets to keep (scaled to zero) for rollback. Default 10.
- **\`strategy.type\`** — \`RollingUpdate\` (the default, no downtime) or \`Recreate\` (full downtime).
- **\`maxSurge\`** / **\`maxUnavailable\`** — the two knobs that control how aggressive the roll is. \`maxSurge: 25%, maxUnavailable: 0\` means "never dip below full capacity, add up to 25% extra while rolling" — safest, needs spare cluster capacity. \`maxUnavailable: 25%, maxSurge: 0\` means "never exceed the replica count, tolerate 25% down" — no extra capacity needed, brief reduced capacity.
- **\`minReadySeconds\`** — a new Pod must be Ready continuously for this long before the rollout treats it as available and proceeds. Guards against a Pod that passes readiness then immediately crashes.
- **\`progressDeadlineSeconds\`** — if the rollout makes no progress for this long, the Deployment's \`Progressing\` condition goes \`False\` with reason \`ProgressDeadlineExceeded\`, and \`kubectl rollout status\` returns non-zero. The rollout is not rolled back; it is marked stuck.

## What a rolling update does, step by step

You change the Pod template — \`kubectl set image\`, \`kubectl apply\` with a new image, \`kubectl edit\`. The Deployment controller:

1. Computes a hash of the new template and creates a **new ReplicaSet** for it at \`replicas: 0\`, leaving the **old ReplicaSet** at its current count.
2. Scales the new ReplicaSet **up** by \`maxSurge\` and the old one **down** by \`maxUnavailable\`, respecting both bounds so total Pods stay within \`[replicas - maxUnavailable, replicas + maxSurge]\`.
3. Waits for each new Pod to become **Ready** (pass its readiness probe) and stay ready for \`minReadySeconds\` before counting it and taking the next step.
4. Repeats step 2–3 until the new ReplicaSet is at \`replicas\` and the old one is at 0.
5. Leaves the old ReplicaSet at \`replicas: 0\` in the revision history.

If a new Pod **never becomes Ready** — a bad image, a failing readiness probe, a missing config — the rollout **stalls** at whatever fraction it reached. It does **not** automatically roll back. \`kubectl rollout status\` blocks and then returns non-zero when the progress deadline is hit. Reverting is your action (or your pipeline's — Module 11).

## Recreate

\`strategy.type: Recreate\` scales the old ReplicaSet to **0** — accepting **full downtime** — and only then scales the new one up. Use it only when the old and new versions genuinely cannot coexist: a schema change the old code cannot tolerate (though expand/contract usually avoids this — Module 11), a workload that holds an exclusive lock, a stateful singleton. For a normal stateless service, RollingUpdate with a readiness probe is correct.

## Rollout commands

\`\`\`bash
kubectl set image deployment/web web=myco/web:1.5     # change the image -> triggers a roll
kubectl rollout status deployment/web                 # follow it; exit 0 done, non-0 stuck
kubectl rollout history deployment/web                # list revisions + their change-cause
kubectl rollout history deployment/web --revision=3   # show revision 3's Pod template
kubectl rollout undo deployment/web                   # roll back to the previous revision
kubectl rollout undo deployment/web --to-revision=3   # roll back to a specific one
kubectl rollout pause deployment/web                  # stop reconciling template changes
kubectl rollout resume deployment/web                 # apply all changes since pause as ONE roll
kubectl rollout restart deployment/web                # roll every Pod (new Pods, same template)
\`\`\`

- **\`rollout undo\` is fast** because the target ReplicaSet still exists at \`replicas: 0\`. Undo scales it back up and the current one down — a rolling update in reverse, no image pull, no rebuild.
- **\`rollout restart\`** is how you force every Pod to be recreated without changing the spec — to pick up a rotated Secret mounted as env vars, to clear a leak, to re-pull a mutable tag. It bumps a template annotation, which counts as a template change and triggers a normal rolling update.
- **\`rollout pause\`** lets you make several edits (image, env, resources) and have them roll out together as one update when you \`resume\`, instead of one roll per edit.
- Record **why** each revision happened by setting the \`kubernetes.io/change-cause\` annotation on the Deployment (the old \`--record\` flag is deprecated); it shows in \`rollout history\`.

## What is not a rollout

**Scaling** — \`kubectl scale deployment/web --replicas=6\`, or an HPA changing the count (Module 9) — changes \`replicas\` on the **current** ReplicaSet. The template is unchanged, so no new ReplicaSet is created and no Pods are replaced; more are simply added or removed. Also note: if a **HorizontalPodAutoscaler** targets the Deployment, the \`replicas\` field in your manifest is ignored after creation — the HPA owns it, and setting it in the manifest just causes churn.`,

    contentHi: `## Ownership chain

Teen objects, har ek agle ko owning: ek **Deployment** desired application describe karta hai (ek replica count aur ek **Pod template**, plus ek update strategy); ek **ReplicaSet** iske selector se matching Pods ka ek fixed number running rakhta hai (ek Deployment apne template ke har version ke liye ek ReplicaSet banata hai); **Pods** running instances hain.

Har child object ek **\`ownerReference\`** carry karta hai jo iske parent par point karti hai. Ye **cascading delete** kaise kaam karta hai (Deployment delete karo aur iske ReplicaSets aur unke Pods garbage-collected).

## ReplicaSet

Iska reconciliation loop exactly hai: \`selector\` se matching Pods list karo, count karo, aur Pods (\`template\` se) create ya delete karo jab tak count \`replicas\` ke barabar nahi. Aap lagbhag kabhi ek ReplicaSet directly nahi likhte.

## Deployment

Ek Deployment ReplicaSets ke upar rollout logic add karta hai:
- **\`revisionHistoryLimit\`** — rollback ke liye kitne old ReplicaSets rakhne hain (zero par scaled). Default 10.
- **\`strategy.type\`** — \`RollingUpdate\` (default, no downtime) ya \`Recreate\` (full downtime).
- **\`maxSurge\`** / **\`maxUnavailable\`** — do knobs jo control karte hain ki roll kitna aggressive hai.
- **\`minReadySeconds\`** — ek naya Pod is long ke liye continuously Ready hona chahiye is se pehle ki rollout ise available treat kare.
- **\`progressDeadlineSeconds\`** — agar rollout is long ke liye koi progress nahi karta, Deployment ka \`Progressing\` condition \`False\` ho jaata hai, aur \`kubectl rollout status\` non-zero return karta hai. Rollout roll back NAHI hota; ise stuck mark kiya jaata hai.

## Ek rolling update kya karta hai

Aap Pod template change karte ho. Deployment controller: (1) naye template ke liye ek **naya ReplicaSet** \`replicas: 0\` par banata hai; (2) naye ReplicaSet ko \`maxSurge\` se **up** aur old ko \`maxUnavailable\` se **down** scale karta hai; (3) har naye Pod ke **Ready** hone ka wait karta hai (+ \`minReadySeconds\`); (4) repeat jab tak naya ReplicaSet \`replicas\` par aur old 0 par nahi; (5) old ReplicaSet ko \`replicas: 0\` par history mein chhodta hai.

Agar ek naya Pod **kabhi Ready nahi hota**, rollout **stalls**. Ye **automatically roll back NAHI** karta.

## Recreate

\`strategy.type: Recreate\` old ReplicaSet ko **0** par scale karta hai — **full downtime** accept karke — aur sirf phir naye ko up scale karta hai. Ise sirf tab use karo jab old aur new versions genuinely coexist nahi kar sakte.

## Rollout commands

- **\`rollout undo\` fast hai** kyunki target ReplicaSet abhi bhi \`replicas: 0\` par exist karta hai.
- **\`rollout restart\`** har Pod ko spec badle bina recreate karne ke liye — ek rotated Secret pick karne ke liye jo env vars ke roop mein mounted hai.
- **\`rollout pause\`** aapko kai edits karne deta hai aur unhe ek update ke roop mein roll out karne deta hai jab aap \`resume\` karte ho.

## Jo ek rollout nahi hai

**Scaling** — \`kubectl scale\` ya ek HPA — **current** ReplicaSet par \`replicas\` change karta hai. Template unchanged hai, to koi naya ReplicaSet nahi banta aur koi Pods replace nahi hote. Agar ek **HPA** Deployment ko target karta hai, aapke manifest mein \`replicas\` field creation ke baad ignore hota hai.`,

    examples: [
      {
        title: 'A rolling update: new ReplicaSet created, old kept at 0, undo is instant',
        titleHi: 'Ek rolling update: naya ReplicaSet banta hai, old 0 par rakha jaata hai, undo instant',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m8l1-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

kubectl -n "$ns" create deployment web --image=nginx:1.27-alpine --replicas=3 >/dev/null
kubectl -n "$ns" annotate deployment web kubernetes.io/change-cause="initial nginx:1.27" >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=120s >/dev/null

echo "--- after v1: one ReplicaSet, 3 Pods ---"
kubectl -n "$ns" get rs -o custom-columns=NAME:.metadata.name,DESIRED:.spec.replicas,READY:.status.readyReplicas --no-headers | sed -E 's/web-[a-z0-9]+/web-<hash>/; s/ +/ /g'

echo "--- roll to v2 (a new image = a new Pod template) ---"
kubectl -n "$ns" set image deploy/web nginx=nginx:1.28-alpine >/dev/null
kubectl -n "$ns" annotate deployment web kubernetes.io/change-cause="bump to nginx:1.28" --overwrite >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=120s >/dev/null

echo "--- now TWO ReplicaSets: v2 at 3, v1 kept at 0 (for rollback) ---"
kubectl -n "$ns" get rs --sort-by=.metadata.creationTimestamp -o custom-columns=DESIRED:.spec.replicas,READY:.status.readyReplicas --no-headers | sed -E 's/ +/ /g'

echo "--- rollout history ---"
kubectl -n "$ns" rollout history deploy/web | grep -E '^[12]'

echo "--- undo: scales v1 back up, v2 down. no image re-pull. ---"
kubectl -n "$ns" rollout undo deploy/web >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=120s >/dev/null
echo "image after undo: $(kubectl -n "$ns" get deploy web -o jsonpath='{.spec.template.spec.containers[0].image}')"`,
        output: `--- after v1: one ReplicaSet, 3 Pods ---
web-<hash> 3 3
--- roll to v2 (a new image = a new Pod template) ---
--- now TWO ReplicaSets: v2 at 3, v1 kept at 0 (for rollback) ---
0 <none>
3 3
--- rollout history ---
1         initial nginx:1.27
2         bump to nginx:1.28
--- undo: scales v1 back up, v2 down. no image re-pull. ---
image after undo: nginx:1.27-alpine`,
        explain: 'The Deployment starts with one ReplicaSet holding three Pods. Changing the container image changes the Pod template, and the Deployment controller responds by creating a second ReplicaSet for the new template and rolling Pods from the first to the second a controlled number at a time, waiting for each new Pod to pass its readiness check before proceeding. When the rollout finishes, the new ReplicaSet holds all three Pods and the old one is kept at zero replicas rather than being deleted. That retained old ReplicaSet is what makes rollback fast: the history lists both revisions with the change-cause annotations that were set, and undo does not fetch or build anything — it simply scales the old ReplicaSet back up and the new one down, which is a rolling update in reverse. The image on the Deployment returns to the previous version. Keeping the previous ReplicaSets, up to the history limit, is the mechanism behind instant rollback, and setting a change-cause on each revision is what makes the history readable when you need to choose which revision to go back to.',
        explainHi: 'Deployment ek ReplicaSet ke saath shuru hota hai jo teen Pods rakhta hai. Container image change karna Pod template change karta hai, aur Deployment controller naye template ke liye ek doosra ReplicaSet banaकर respond karta hai aur Pods ko pehle se doosre mein ek controlled number ek baar mein roll karta hai. Jab rollout finish hota hai, naya ReplicaSet saare teen Pods rakhta hai aur old ko zero replicas par rakha jaata hai delete kiye jaane ke bajaay. Wo retained old ReplicaSet wo hai jo rollback ko fast banata hai: history dono revisions ko change-cause annotations ke saath list karta hai, aur undo kuch fetch ya build nahi karta — ye simply old ReplicaSet ko wapas up aur naye ko down scale karta hai.',
      },
      {
        title: 'A stalled rollout does NOT auto-roll-back — you (or the pipeline) do',
        titleHi: 'Ek stalled rollout auto-roll-back NAHI karta — aap (ya pipeline) karte ho',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m8l1b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

kubectl -n "$ns" create deployment web --image=nginx:1.27-alpine --replicas=3 >/dev/null
# tighten the progress deadline so the demo doesn't take 10 minutes
kubectl -n "$ns" patch deploy web --type=merge -p '{"spec":{"progressDeadlineSeconds":30}}' >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=120s >/dev/null

echo "--- roll to a BAD image (does not exist) ---"
kubectl -n "$ns" set image deploy/web nginx=nginx:this-tag-does-not-exist-9999 >/dev/null

echo "--- rollout status blocks, then FAILS (exit non-zero) ---"
kubectl -n "$ns" rollout status deploy/web --timeout=90s >/tmp/rs.$$ 2>&1; rc=$?
grep -v '^Waiting for deployment' /tmp/rs.$$; echo "rollout status exit code: $rc"

echo "--- the old Pods are STILL SERVING (maxUnavailable protected them); the deployment is stuck ---"
kubectl -n "$ns" get deploy web -o jsonpath='ready={.status.readyReplicas}/{.spec.replicas}  progressing={.status.conditions[?(@.type=="Progressing")].reason}{"\\n"}'

echo "--- YOU roll it back (a pipeline would do this on the non-zero exit) ---"
kubectl -n "$ns" rollout undo deploy/web >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=120s >/dev/null
echo "recovered: $(kubectl -n "$ns" get deploy web -o jsonpath='{.status.readyReplicas}/{.spec.replicas} on {.spec.template.spec.containers[0].image}')"`,
        output: `--- roll to a BAD image (does not exist) ---
--- rollout status blocks, then FAILS (exit non-zero) ---
error: deployment "web" exceeded its progress deadline
rollout status exit code: 1
--- the old Pods are STILL SERVING (maxUnavailable protected them); the deployment is stuck ---
ready=3/3  progressing=ProgressDeadlineExceeded
--- YOU roll it back (a pipeline would do this on the non-zero exit) ---
recovered: 3/3 on nginx:1.27-alpine`,
        explain: 'The Deployment is updated to an image tag that does not exist, so the new Pods can never pull their image and never become Ready. The rolling update starts, brings up one new Pod which sits in an image-pull error, and cannot proceed because that Pod does not pass readiness. Crucially, the old Pods are not removed, because the default rollout bounds keep the deployment from dropping below its available count while the new Pods are not ready — so the service stays fully up on the old version throughout. After the progress deadline passes with no forward movement, the Deployment\'s Progressing condition is set to False with the reason that the deadline was exceeded, and the rollout status command, which had been blocking, exits with a non-zero status. Kubernetes does not undo the change on its own; the Deployment simply stays in the stuck state, still serving the old version. Recovering is an explicit action — running undo, which scales the good old ReplicaSet back to full and the broken new one to zero. In a delivery pipeline this is automated: the deploy step runs rollout status, and a non-zero exit triggers an automatic rollout undo, which is one of the building blocks of safe automated deployment covered in Module 11.',
        explainHi: 'Deployment ko ek image tag par update kiya jaata hai jo exist nahi karta, to naye Pods kabhi apni image pull nahi kar sakte aur kabhi Ready nahi hote. Rolling update shuru hota hai, ek naya Pod up laata hai jo ek image-pull error mein baithta hai, aur proceed nahi kar sakta. Crucially, old Pods remove nahi hote, kyunki default rollout bounds deployment ko iske available count ke neeche girne se rokte hain jab naye Pods ready nahi hain — to service poore samay old version par fully up rehti hai. Progress deadline bina forward movement ke guzarne ke baad, Deployment ka Progressing condition False set hota hai, aur rollout status command non-zero status ke saath exit karta hai. Kubernetes apne aap change undo nahi karta. Recover karna ek explicit action hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a Deployment with no readiness probe, then a rolling update
spec:
  # no readinessProbe on the container
  template: { ... }
# roll to v2. the Deployment considers a v2 Pod "available" the MOMENT its
# container process starts — before the app has connected to the DB, warmed
# caches, or bound its port. it scales down v1 Pods against not-yet-working v2
# Pods -> requests hit v2 -> 502s for the ~10s each Pod takes to be truly ready.
# and a v2 that starts then crash-loops still "counts" briefly -> partial outage.`,
        right: `spec:
  minReadySeconds: 10          # a Pod must be Ready this long before it "counts"
  template:
    spec:
      containers:
        - name: web
          readinessProbe:      # gate the rollout on ACTUAL readiness
            httpGet: { path: /readyz, port: 8080 }
            periodSeconds: 5
            failureThreshold: 3
          startupProbe:        # for slow starters: don't let liveness kill it during boot
            httpGet: { path: /readyz, port: 8080 }
            failureThreshold: 30
            periodSeconds: 2
# now the roll advances only as fast as new Pods become genuinely ready, and a
# broken v2 stalls the roll instead of taking traffic.`,
        why: 'A rolling update advances by bringing up new Pods and, once they are considered available, scaling down old ones. Without a readiness probe, a Pod is considered available as soon as its container process has started, which for a real application is well before it can serve requests — it still has to establish database connections, load configuration, warm caches, and begin listening. During that window the Deployment has already started removing old Pods that could serve, and the Service routes traffic to the new Pods that cannot, producing errors for every request that lands on a not-yet-ready Pod. A new version that starts and then immediately crash-loops is also briefly counted as available, so the rollout makes partial progress into a broken state. Adding a readiness probe that reflects genuine readiness makes the rollout advance only as fast as new Pods can actually serve, and makes a broken new version stall the rollout with the old version still fully up rather than partially replacing it. A minimum-ready duration guards against a Pod that flaps ready then unready, and a startup probe gives a slow-booting application time to come up without its liveness probe killing it first.',
        whyHi: 'Ek rolling update naye Pods up laकर aur, ek baar wo available maane jaate hain, old ones ko scale down karke advance karta hai. Bina ek readiness probe ke, ek Pod available maana jaata hai jaise hi iska container process start ho jaata hai, jo ek real application ke liye requests serve kar sakne se kaafi pehle hai. Us window ke dauran Deployment ne already old Pods remove karna shuru kar diya hai jo serve kar sakte the, aur Service traffic ko naye Pods par route karta hai jo nahi kar sakte, har request ke liye errors produce karte hain jo ek not-yet-ready Pod par land karti hai. Ek readiness probe add karna jo genuine readiness reflect karta hai rollout ko sirf utni fast advance karवाता hai jitni naye Pods actually serve kar sakte hain.',
      },
      {
        wrong: `# using 'kubectl edit' / 'kubectl scale' on a Deployment that an HPA owns
$ kubectl scale deployment web --replicas=10     # "we need more capacity"
# ...30 seconds later the HPA scales it back to 3 (its computed target).
# and if 'replicas: 10' is now also in your committed manifest, every 'apply'
# fights the HPA -> constant scale up / scale down churn, thrashing Pods.`,
        right: `# if an HPA targets the Deployment, it OWNS .spec.replicas. so:
#   - remove 'replicas:' from the Deployment manifest entirely (or set it once
//     as the initial value and never touch it again)
#   - change capacity by tuning the HPA: min/maxReplicas, the target metric/value
$ kubectl edit hpa web           # raise maxReplicas, lower the CPU target, etc.
# 'kubectl scale' on an HPA-owned Deployment is only useful to force an
# immediate floor while you edit the HPA — it will be overridden.`,
        why: 'A HorizontalPodAutoscaler continuously computes a desired replica count for its target from a metric and writes that count onto the target\'s replicas field. Once an HPA is attached, that field is under the HPA\'s control: any value you set on it, whether through a scale command or through applying a manifest, is transient and will be replaced by the HPA\'s next computation within its sync interval. Setting a replica count manually therefore has no lasting effect, and leaving a replicas value in a manifest that is periodically re-applied creates a persistent conflict, because each apply asserts one number and the HPA immediately asserts another, causing the Deployment to scale up and down repeatedly and churn Pods. The correct approach is to let the HPA own the field entirely: remove replicas from the manifest, or set it only as an initial value that is never updated, and adjust capacity by changing the HPA\'s minimum and maximum bounds and its target metric value. A manual scale is only meaningful as a temporary floor while the HPA configuration is being edited, and even then it is overridden on the next sync.',
        whyHi: 'Ek HPA continuously ek metric se apne target ke liye ek desired replica count compute karta hai aur wo count target ke replicas field par likhta hai. Ek baar ek HPA attached hai, wo field HPA ke control mein hai: koi bhi value jo aap ispar set karte ho transient hai aur HPA ki agli computation se replace ki jaayegi. Ek replica count manually set karna isliye koi lasting effect nahi rakhta, aur ek manifest mein ek replicas value chhodna jo periodically re-applied hai ek persistent conflict banata hai. Correct approach HPA ko field poori tarah own karne dena hai: manifest se replicas hataao, aur capacity ko HPA ke bounds aur iske target metric value change karke adjust karo.',
      },
      {
        wrong: `# expecting Kubernetes to auto-roll-back a failed deployment
$ kubectl apply -f deploy-v2.yaml     # v2 has a bug; Pods crash-loop
# ...wait... "it'll roll back automatically, right?"
# -> NO. the rollout stalls at 'ProgressDeadlineExceeded'. the old Pods keep
//    serving (good), but the Deployment is stuck in a half-rolled state
//    indefinitely, and 'kubectl get deploy' shows it as not fully available.
//    nothing reverts it until a human or a pipeline runs 'rollout undo'.`,
        right: `# gate every deploy on 'rollout status' and roll back on failure:
$ kubectl apply -f deploy-v2.yaml
$ kubectl rollout status deployment/web --timeout=5m || {
    echo "rollout failed — rolling back"
    kubectl rollout undo deployment/web
    exit 1
  }
# this 3-line pattern is the core of a safe deploy step. Module 11 covers the
# richer versions (canary analysis, Argo Rollouts) but this is the baseline.`,
        why: 'Kubernetes does not automatically roll back a Deployment whose rollout fails. When new Pods do not become ready, the rolling update stops making progress and, after the progress deadline, the Deployment records a failed Progressing condition, but it remains in whatever partially-updated state it reached. The default rollout bounds usually keep the old Pods serving, so the application stays up, but the Deployment is now stuck: it will not complete on its own and it will not revert on its own. The recovery is always an explicit rollout undo, and the reliable way to ensure it happens is to make it part of the deployment procedure. A deploy step applies the manifest, then runs rollout status with a timeout; if that command exits non-zero, the step runs rollout undo and fails. This small pattern turns a stuck deployment into an automatic recovery to the last known-good version, and it is the foundation that the more sophisticated progressive-delivery mechanisms in Module 11 build on.',
        whyHi: 'Kubernetes ek Deployment ko automatically roll back nahi karta jiska rollout fail hota hai. Jab naye Pods ready nahi hote, rolling update progress karna band kar deta hai aur, progress deadline ke baad, Deployment ek failed Progressing condition record karta hai, par ye jo bhi partially-updated state ise mila usmein rehta hai. Default rollout bounds usually old Pods ko serving rakhte hain, to application up rehta hai, par Deployment ab stuck hai: ye apne aap complete nahi hoga aur apne aap revert nahi hoga. Recovery hamesha ek explicit rollout undo hai, aur ise ensure karne ka reliable tarika ise deployment procedure ka part banana hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every deploy showed a 10-15 second burst of 502s** until a `readinessProbe` on `/readyz` was added — before that, the rollout scaled down old Pods against new Pods whose Node app had started but not yet connected to Postgres. With the probe, deploys became invisible.',
        hi: '**Har deploy ek 10-15 second 502s ka burst dikhata tha** jab tak `/readyz` par ek `readinessProbe` add nahi hui.',
      },
      {
        en: '**A Deployment thrashing between 3 and 12 replicas every minute** — `replicas: 12` was in the committed manifest and an HPA also owned it; `kubectl apply` in CD and the HPA fought on every sync. Removed `replicas:` from the manifest; the churn stopped.',
        hi: '**Ek Deployment har minute 3 aur 12 replicas ke beech thrash kar raha** — `replicas: 12` committed manifest mein tha aur ek HPA bhi ise own karta tha.',
      },
      {
        en: '**A broken image deployed on a Friday, left "rolling out" over the weekend** — the old Pods kept serving so nobody paged, but Monday\'s deploy was blocked because the Deployment was still stuck at `ProgressDeadlineExceeded`. CI now runs `rollout status || rollout undo`.',
        hi: '**Ek broken image Friday ko deployed, weekend ke dauran "rolling out" chhoda gaya** — old Pods serving rahe to koi page nahi hua.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the Deployment → ReplicaSet → Pod chain and what happens step by step during a rolling update.',
        qHi: 'Deployment → ReplicaSet → Pod chain aur ek rolling update ke dauran step by step kya hota hai samjhao.',
        a: 'A Deployment describes the desired application as a replica count and a Pod template plus an update strategy. It creates a ReplicaSet for each distinct version of that template, and each ReplicaSet keeps a fixed number of Pods matching its selector running by creating or deleting Pods until the count matches. Pods carry an owner reference to their ReplicaSet, and ReplicaSets to their Deployment, which is how cascading deletes and ownership work. During a rolling update, triggered by changing the template, the Deployment controller computes a hash of the new template and creates a new ReplicaSet for it at zero replicas, leaving the old ReplicaSet at its current count. It then scales the new ReplicaSet up by the max-surge amount and the old one down by the max-unavailable amount, keeping the total Pod count within the band those two bounds define. Before taking each next step it waits for the new Pods to pass their readiness probe and stay ready for the minimum-ready duration. It repeats until the new ReplicaSet is at the full replica count and the old one is at zero. The old ReplicaSet is kept at zero replicas in the revision history rather than deleted, up to the history limit, which is what makes rollback fast — undo just scales the old one back up and the new one down.',
        aHi: 'Ek Deployment desired application ko ek replica count aur ek Pod template plus ek update strategy ke roop mein describe karta hai. Ye us template ke har distinct version ke liye ek ReplicaSet banata hai, aur har ReplicaSet iske selector se matching Pods ka ek fixed number running rakhta hai. Pods apne ReplicaSet ko ek owner reference carry karte hain, aur ReplicaSets apne Deployment ko. Ek rolling update ke dauran, Deployment controller naye template ka ek hash compute karta hai aur iske liye ek naya ReplicaSet zero replicas par banata hai. Ye phir naye ReplicaSet ko max-surge amount se up aur old ko max-unavailable amount se down scale karta hai. Har agle step lene se pehle ye naye Pods ke readiness probe pass karne ka wait karta hai. Ye repeat karta hai jab tak naya ReplicaSet full replica count par aur old zero par nahi. Old ReplicaSet ko zero replicas par history mein rakha jaata hai.',
      },
      {
        q: 'Does Kubernetes automatically roll back a failed rollout? How should a deploy be gated?',
        qHi: 'Kya Kubernetes ek failed rollout ko automatically roll back karta hai? Ek deploy kaise gated hona chahiye?',
        a: 'No, Kubernetes does not automatically roll back. When the new Pods in a rollout never become ready — a bad image, a failing readiness probe, missing configuration — the rolling update stops making progress. After the progress deadline elapses without forward movement, the Deployment sets its Progressing condition to False with the reason that the deadline was exceeded, and the rollout-status command returns a non-zero exit code. But the Deployment stays in whatever partially-updated state it reached; it does not complete and it does not revert. The default rollout bounds usually keep the old Pods running, so the application remains available on the old version, but the Deployment is stuck and further deploys are blocked. Recovery requires an explicit rollout undo, which scales the last good ReplicaSet back up and the broken one down. The reliable way to make this happen is to gate the deploy on rollout status: the deploy step applies the manifest, then runs rollout status with a timeout, and if that exits non-zero it runs rollout undo and fails the step. That three-line pattern gives an automatic recovery to the last known-good version and is the baseline that the progressive-delivery approaches in Module 11 extend.',
        aHi: 'Nahi, Kubernetes automatically roll back nahi karta. Jab ek rollout mein naye Pods kabhi ready nahi hote, rolling update progress karna band kar deta hai. Progress deadline bina forward movement ke elapse hone ke baad, Deployment apne Progressing condition ko False set karta hai, aur rollout-status command ek non-zero exit code return karta hai. Par Deployment jo bhi partially-updated state ise mila usmein rehta hai. Default rollout bounds usually old Pods ko running rakhte hain, to application old version par available rehta hai, par Deployment stuck hai. Recovery ke liye ek explicit rollout undo chahiye. Ise hone ka reliable tarika deploy ko rollout status par gate karna hai: deploy step manifest apply karta hai, phir rollout status ek timeout ke saath chalata hai, aur agar wo non-zero exit karta hai ye rollout undo chalata hai aur step fail karta hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, draw the Deployment→ReplicaSet→Pod ownership chain, and explain what `maxSurge`, `maxUnavailable`, `minReadySeconds`, and `progressDeadlineSeconds` each control.',
        taskHi: 'Ek comment mein, Deployment→ReplicaSet→Pod ownership chain banao.',
        hint: 'Deployment --owns--> ReplicaSet(s) --owns--> Pods (each child has an `ownerReference` up; deleting the Deployment cascade-deletes down). The Deployment holds a replica count + Pod template + strategy; it creates ONE ReplicaSet per distinct template version; each ReplicaSet just keeps `replicas` Pods matching its selector running. `maxSurge` = how many Pods ABOVE `replicas` are allowed during a roll (needs spare cluster capacity; `25%,0` = safest, never dips below full). `maxUnavailable` = how many BELOW `replicas` are allowed during a roll (`25%,0` surge = no extra capacity, brief reduced capacity). `minReadySeconds` = a new Pod must stay Ready this long before the rollout counts it as available + proceeds (guards against a Pod that flaps ready→crash). `progressDeadlineSeconds` = no forward progress for this long → `Progressing=False`, reason `ProgressDeadlineExceeded`, `rollout status` exits non-zero (the rollout is marked STUCK, NOT rolled back).',
        hintHi: 'Deployment --owns--> ReplicaSet(s) --owns--> Pods (har child ka ek `ownerReference` up; Deployment delete karna cascade-delete karta hai). `maxSurge` = roll ke dauran `replicas` ke UPAR kitne Pods allowed. `maxUnavailable` = roll ke dauran `replicas` ke NEECHE kitne allowed. `minReadySeconds` = ek naya Pod is long ke liye Ready rehna chahiye is se pehle ki rollout ise available count kare. `progressDeadlineSeconds` = is long ke liye koi progress nahi → `Progressing=False`, `rollout status` non-zero exit (STUCK, roll back NAHI).',
      },
      {
        task: 'In a comment, walk through a rolling update step by step (v1 3 replicas → v2), then explain why `rollout undo` is instant and what `rollout restart` is for.',
        taskHi: 'Ek comment mein, ek rolling update ko step by step walk karo.',
        hint: 'v1: ReplicaSet-A (replicas: 3, holds 3 Pods). You `kubectl set image` / `apply` a new template → (1) the Deployment hashes the new template + creates ReplicaSet-B at replicas: 0, leaves A at 3; (2) scales B UP by `maxSurge` + A DOWN by `maxUnavailable`, keeping total in `[3-maxUnavailable, 3+maxSurge]`; (3) each new B Pod must pass its READINESS probe + stay ready `minReadySeconds` before the next step; (4) repeat 2-3 until B=3, A=0; (5) A is kept at replicas: 0 in history (up to `revisionHistoryLimit`). `rollout undo` is INSTANT because the old ReplicaSet A still exists at 0 — undo just scales A back up + B down (a rolling update in reverse), NO image pull, NO rebuild. `rollout restart` = force every Pod to be recreated WITHOUT a spec change (bumps a template annotation → a normal rolling update) — used to pick up a rotated Secret mounted as env vars, clear a leak, or re-pull a mutable tag.',
        hintHi: 'v1: ReplicaSet-A (replicas: 3). Aap naya template `set image`/`apply` karte ho → (1) Deployment naye template ko hash karta hai + ReplicaSet-B replicas: 0 par banata hai; (2) B ko `maxSurge` se UP + A ko `maxUnavailable` se DOWN scale karta hai; (3) har naya B Pod READINESS probe pass karna chahiye + `minReadySeconds` ready rehna; (4) repeat jab tak B=3, A=0; (5) A ko replicas: 0 par history mein rakha jaata hai. `rollout undo` INSTANT hai kyunki old ReplicaSet A abhi bhi 0 par exist karta hai. `rollout restart` = har Pod ko spec badle bina recreate karo.',
      },
      {
        task: 'In a comment, explain: does K8s auto-roll-back a failed deploy? What actually happens to a Deployment when its new Pods crash-loop, and what is the 3-line deploy-gating pattern?',
        taskHi: 'Ek comment mein, samjhao: kya K8s ek failed deploy ko auto-roll-back karta hai?',
        hint: 'NO — K8s does NOT auto-roll-back. When the new Pods never become Ready (bad image, failing readiness probe, missing config), the rolling update STALLS at whatever fraction it reached. After `progressDeadlineSeconds` with no progress → `Progressing=False`, reason `ProgressDeadlineExceeded`, `kubectl rollout status` exits non-zero. The default rollout bounds usually keep the OLD Pods serving (so the app stays up + nobody pages), but the Deployment is STUCK in a half-rolled state indefinitely and further deploys are blocked. Recovery is ALWAYS an explicit `kubectl rollout undo` (scales the last-good ReplicaSet back up, the broken one down). THE 3-LINE PATTERN: `kubectl apply -f deploy.yaml` → `kubectl rollout status deploy/web --timeout=5m || { kubectl rollout undo deploy/web; exit 1; }`. This is the baseline of a safe deploy step; Module 11 covers the richer versions (canary analysis, Argo Rollouts).',
        hintHi: 'NAHI — K8s auto-roll-back NAHI karta. Jab naye Pods kabhi Ready nahi hote, rolling update STALLS. `progressDeadlineSeconds` ke baad bina progress → `Progressing=False`, `kubectl rollout status` non-zero exit. Default rollout bounds usually OLD Pods ko serving rakhte hain, par Deployment STUCK hai aur further deploys blocked hain. Recovery HAMESHA ek explicit `kubectl rollout undo` hai. 3-LINE PATTERN: `kubectl apply` → `kubectl rollout status deploy/web --timeout=5m || { kubectl rollout undo deploy/web; exit 1; }`.',
      },
    ],

    keyTakeaways: [
      'OWNERSHIP CHAIN: Deployment --owns--> ReplicaSet(s) --owns--> Pods, linked by `ownerReferences` (deleting the Deployment cascade-deletes down). A REPLICASET\'s entire controller = "list Pods matching my selector, create/delete until the count == `replicas`" — you almost never write one directly. A DEPLOYMENT manages ReplicaSets and adds what a bare ReplicaSet lacks: ROLLOUTS. It creates ONE ReplicaSet per distinct Pod-template version.',
      'ROLLING UPDATE (you change `spec.template` — `set image` / `apply` / `edit`): (1) the Deployment hashes the new template + creates a NEW ReplicaSet at `replicas: 0`, keeps the old at its count; (2) scales new UP by `maxSurge`, old DOWN by `maxUnavailable`, keeping total Pods in `[replicas-maxUnavailable, replicas+maxSurge]`; (3) each new Pod must pass its READINESS probe + stay ready `minReadySeconds` before the next step; (4) repeat until new=`replicas`, old=0; (5) the old ReplicaSet is KEPT at `replicas: 0` in history (up to `revisionHistoryLimit`, default 10). `maxSurge: 25%, maxUnavailable: 0` = safest (never below full, needs spare capacity); `maxUnavailable: 25%, maxSurge: 0` = no extra capacity, brief reduced capacity. RECREATE strategy = scale old to 0 (FULL DOWNTIME) THEN scale new up — only when two versions genuinely can\'t coexist.',
      'A STALLED ROLLOUT DOES NOT AUTO-ROLL-BACK. If a new Pod never becomes Ready (bad image, failing probe, missing config), the roll stalls at whatever fraction it reached; after `progressDeadlineSeconds` with no progress → `Progressing=False` / reason `ProgressDeadlineExceeded` / `kubectl rollout status` exits NON-ZERO. The default bounds usually keep the OLD Pods serving (app stays up, nobody pages) but the Deployment is STUCK indefinitely and further deploys are blocked. Recovery is ALWAYS an explicit `kubectl rollout undo`. THE 3-LINE DEPLOY GATE: `kubectl apply -f x.yaml` → `kubectl rollout status deploy/web --timeout=5m || { kubectl rollout undo deploy/web; exit 1; }` — the baseline of a safe deploy step (Module 11 = the richer versions).',
      'ROLLOUT COMMANDS: `kubectl set image deploy/web c=img:tag` (triggers a roll), `kubectl rollout status deploy/web` (follow; exit 0 done / non-0 stuck), `kubectl rollout history deploy/web [--revision=N]`, `kubectl rollout undo deploy/web [--to-revision=N]` (INSTANT — the target ReplicaSet still exists at `replicas: 0`, undo just scales it back up + the current down, NO image pull), `kubectl rollout pause`/`resume` (batch several edits → ONE roll), `kubectl rollout restart deploy/web` (recreate every Pod WITHOUT a spec change — to pick up a rotated Secret mounted as env vars, clear a leak, re-pull a mutable tag). Set `kubernetes.io/change-cause` on the Deployment so `rollout history` shows WHY each revision happened (`--record` is deprecated).',
      'ALWAYS put a READINESS PROBE on a Deployment\'s container — without it a Pod is "available" the instant its process starts (before it\'s connected to the DB / warmed caches / bound its port), so a roll scales down working old Pods against not-yet-working new ones → 502s per Pod for ~10s, and a crash-looping new version makes partial progress. Add `minReadySeconds` (guards a ready→crash flap) and a `startupProbe` for slow starters. NOT A ROLLOUT: `kubectl scale` (or an HPA changing the count) — same template, no new ReplicaSet, just more/fewer Pods on the CURRENT one. `spec.selector` is IMMUTABLE. If an HPA targets the Deployment it OWNS `.spec.replicas` — remove `replicas:` from the manifest (or set it once, never touch it) or `apply` fights the HPA every sync → constant scale-up/down churn.',
    ],
    keyTakeawaysHi: [
      'OWNERSHIP CHAIN: Deployment --owns--> ReplicaSet(s) --owns--> Pods, `ownerReferences` se linked (Deployment delete karna cascade-delete karta hai). Ek REPLICASET ka poora controller = "selector se matching Pods list karo, create/delete jab tak count == `replicas`" — aap lagbhag kabhi ek directly nahi likhte. Ek DEPLOYMENT ReplicaSets manage karta hai aur ROLLOUTS add karta hai. Ye har distinct Pod-template version ke liye ONE ReplicaSet banata hai.',
      'ROLLING UPDATE (aap `spec.template` change karte ho): (1) Deployment naye template ko hash karta hai + ek NAYA ReplicaSet `replicas: 0` par banata hai; (2) new ko `maxSurge` se UP, old ko `maxUnavailable` se DOWN scale karta hai; (3) har naya Pod READINESS probe pass karna chahiye + `minReadySeconds` ready rehna; (4) repeat jab tak new=`replicas`, old=0; (5) old ReplicaSet ko `replicas: 0` par history mein RAKHA jaata hai. RECREATE strategy = old ko 0 par scale karo (FULL DOWNTIME) PHIR new up.',
      'EK STALLED ROLLOUT AUTO-ROLL-BACK NAHI KARTA. Agar ek naya Pod kabhi Ready nahi hota, roll stalls; `progressDeadlineSeconds` ke baad → `Progressing=False` / `kubectl rollout status` NON-ZERO exit. Default bounds usually OLD Pods ko serving rakhte hain par Deployment STUCK hai. Recovery HAMESHA ek explicit `kubectl rollout undo` hai. 3-LINE DEPLOY GATE: `kubectl apply -f x.yaml` → `kubectl rollout status deploy/web --timeout=5m || { kubectl rollout undo deploy/web; exit 1; }`.',
      'ROLLOUT COMMANDS: `kubectl set image` (roll trigger), `kubectl rollout status` (exit 0 done / non-0 stuck), `kubectl rollout history [--revision=N]`, `kubectl rollout undo [--to-revision=N]` (INSTANT — target ReplicaSet abhi bhi `replicas: 0` par exist karta hai), `kubectl rollout pause`/`resume` (kai edits → ONE roll), `kubectl rollout restart` (har Pod recreate karo BINA spec change — ek rotated Secret pick karne ke liye). `kubernetes.io/change-cause` set karo taaki `rollout history` WHY dikhaye.',
      'HAMESHA ek Deployment ke container par ek READINESS PROBE rakho — iske bina ek Pod "available" hai jis instant iska process start hota hai, to ek roll working old Pods ko not-yet-working new ones ke against scale down karta hai → per Pod ~10s ke liye 502s. `minReadySeconds` add karo + slow starters ke liye ek `startupProbe`. NOT A ROLLOUT: `kubectl scale` (ya ek HPA) — same template, koi naya ReplicaSet nahi. `spec.selector` IMMUTABLE hai. Agar ek HPA Deployment ko target karta hai, ye `.spec.replicas` OWN karta hai — manifest se `replicas:` hataao warna `apply` HPA se fight karta hai → constant churn.',
    ],
  },

  {
    slug: 'ops-services-clusterip-nodeport-loadbalancer-headless',
    title: 'Services — ClusterIP, NodePort, LoadBalancer, Headless',
    titleHi: 'Services — ClusterIP, NodePort, LoadBalancer, Headless',
    description: 'Pods come and go with new IPs; a Service is the stable name and virtual IP in front of them. An EndpointSlice controller keeps the Service\'s backend list in sync with the Pods its selector matches, and kube-proxy programs each node so a packet to the Service IP is load-balanced to one of those Pods.',
    descriptionHi: 'Pods naye IPs ke saath aate-jaate hain; ek Service unke saamne stable naam aur virtual IP hai. Ek EndpointSlice controller Service ki backend list ko un Pods ke saath sync mein rakhta hai jinse iska selector match karta hai, aur kube-proxy har node ko program karta hai taaki Service IP ka ek packet un Pods mein se ek par load-balanced ho.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A department\'s single published phone number versus every employee\'s mobile.** Employees join, leave, swap desks — their mobile numbers (Pod IPs) change constantly, and you would never print them. The department number (the Service\'s ClusterIP and DNS name) is stable and is what everyone calls. Behind it, a switchboard operator keeps a live list of who is currently on shift and reachable (the EndpointSlice — updated automatically as Pods pass and fail their readiness check) and connects each call to one of them (kube-proxy load-balancing). ClusterIP is an internal extension only staff can dial; NodePort also opens a direct outside line on a fixed high number at every office door; LoadBalancer puts a real receptionist out front with a public number; headless skips the switchboard and just reads you the list of current mobile numbers so you can call a specific person.',
      hi: '**Ek department ka single published phone number versus har employee ka mobile.** Employees join karte hain, chhodte hain, desks swap karte hain — unke mobile numbers (Pod IPs) constantly change hote hain. Department number (Service ka ClusterIP aur DNS name) stable hai aur wo hai jise sab call karte hain. Iske peeche, ek switchboard operator ek live list rakhta hai ki kaun currently shift par aur reachable hai (EndpointSlice — automatically updated jaise Pods apna readiness check pass aur fail karte hain) aur har call ko unmein se ek se connect karta hai (kube-proxy load-balancing). ClusterIP ek internal extension hai; NodePort har office door par ek fixed high number par ek direct outside line bhi kholta hai; LoadBalancer ek real receptionist saamne rakhta hai ek public number ke saath; headless switchboard skip karta hai aur bas aapko current mobile numbers ki list padhta hai.',
    },

    simple: `**A SERVICE = a stable name + virtual IP that load-balances to a changing set of Pods.**
\`\`\`yaml
apiVersion: v1
kind: Service
metadata: { name: web }              # DNS: web.<ns>.svc.cluster.local  (same-ns: 'web')
spec:
  selector: { app: web }             # -> the Pods this Service targets (Module 7)
  ports:
    - name: http
      port: 80                        # the Service port (what clients connect to)
      targetPort: 8080                # the container port (or a named port)
  type: ClusterIP                     # the default
\`\`\`

**HOW IT ROUTES (no proxy Pod in the path):**
\`\`\`
1. the ENDPOINTSLICE controller watches Pods matching the selector; for each Pod that
   is READY it adds (podIP, port) to an EndpointSlice object. not-ready Pods are excluded.
2. KUBE-PROXY on every node watches Services + EndpointSlices and programs the node's
   iptables/IPVS (or an eBPF CNI): "packets to <ClusterIP>:80 -> DNAT to a random ready
   endpoint:8080". connection-level load balancing, done in the kernel.
3. a client connects to the ClusterIP (or resolves the name via CoreDNS to the ClusterIP).
\`\`\`
The ClusterIP is virtual — nothing listens on it; it only exists as forwarding rules.

**THE FOUR TYPES:**
\`\`\`
ClusterIP     (default) a cluster-internal VIP. reachable ONLY from inside the cluster.
              this is what service-to-service traffic uses.
NodePort      ClusterIP + opens the SAME high port (30000-32767) on EVERY node's IP.
              <anyNodeIP>:<nodePort> -> the Service. crude external access; mostly a
              building block for LoadBalancer / bare-metal setups.
LoadBalancer  NodePort + asks the cloud (via the cloud-controller-manager) to provision
              a real external load balancer pointing at the NodePorts. gives you a public
              IP/hostname. one LB per Service = $$ -> use Ingress (Lesson 3) for HTTP.
ExternalName  no selector, no proxying — just a CNAME. 'db.prod' -> 'rds.amazonaws.com'.
\`\`\`

**HEADLESS SERVICE (\`clusterIP: None\`):** no VIP, no load balancing. DNS returns the
**A records of all ready Pods** directly. For clients that do their own balancing or need
per-Pod addressing: databases, StatefulSets (each Pod gets \`<pod>.<svc>.<ns>.svc...\`),
peer discovery.

**KEY BEHAVIOURS:**
\`\`\`
- only READY Pods get traffic (the readiness probe gates Service membership — Module 7/8)
- 'kubectl get endpointslices -l kubernetes.io/service-name=web' shows the real backends.
  ZERO endpoints -> the selector doesn't match any ready Pod -> clients get connection refused.
- sessionAffinity: ClientIP  pins a client IP to one Pod (crude; prefer stateless Pods)
- externalTrafficPolicy: Local  (NodePort/LB) preserves the client source IP but only
  routes to Pods on the receiving node (can imbalance)
- Service ports can be NAMED; targetPort can reference a container's named port
\`\`\``,

    simpleHi: `**EK SERVICE = ek stable naam + virtual IP jo Pods ke ek changing set par load-balance karta hai.**
\`\`\`yaml
apiVersion: v1
kind: Service
metadata: { name: web }              # DNS: web.<ns>.svc.cluster.local  (same-ns: 'web')
spec:
  selector: { app: web }             # -> wo Pods jinhe ye Service target karta hai
  ports:
    - name: http
      port: 80                        # Service port (clients jispar connect karte hain)
      targetPort: 8080                # container port
  type: ClusterIP                     # default
\`\`\`

**YE KAISE ROUTE KARTA HAI (path mein koi proxy Pod nahi):**
\`\`\`
1. ENDPOINTSLICE controller selector se matching Pods watch karta hai; har READY Pod ke liye
   ye (podIP, port) ko ek EndpointSlice object mein add karta hai. not-ready Pods excluded.
2. har node par KUBE-PROXY Services + EndpointSlices watch karta hai aur node ke iptables/IPVS
   program karta hai: "<ClusterIP>:80 ke packets -> ek random ready endpoint:8080 par DNAT".
3. ek client ClusterIP se connect karta hai (ya CoreDNS ke through naam resolve karta hai).
\`\`\`
ClusterIP virtual hai — ispar kuch listen nahi karta; ye sirf forwarding rules ke roop mein exist karta hai.

**CHAAR TYPES:**
\`\`\`
ClusterIP     (default) ek cluster-internal VIP. SIRF cluster ke andar se reachable.
NodePort      ClusterIP + har node ke IP par SAME high port (30000-32767) kholta hai.
LoadBalancer  NodePort + cloud se ek real external load balancer provision karne ko kehta hai.
              ek public IP/hostname. per Service ek LB = $$ -> HTTP ke liye Ingress use karo.
ExternalName  koi selector nahi, koi proxying nahi — bas ek CNAME.
\`\`\`

**HEADLESS SERVICE (\`clusterIP: None\`):** koi VIP nahi, koi load balancing nahi. DNS
**saare ready Pods ke A records** directly return karta hai. Databases, StatefulSets ke liye.

**KEY BEHAVIOURS:**
\`\`\`
- sirf READY Pods ko traffic milta hai
- 'kubectl get endpointslices -l kubernetes.io/service-name=web' real backends dikhata hai.
  ZERO endpoints -> selector kisi ready Pod se match nahi karta -> clients connection refused
- sessionAffinity: ClientIP  ek client IP ko ek Pod par pin karta hai
- externalTrafficPolicy: Local  client source IP preserve karta hai par sirf receiving node ke Pods par route karta hai
\`\`\``,

    content: `## The problem a Service solves

Pods are ephemeral. A Deployment replaces them on every update, the scheduler moves them on node failure, an HPA adds and removes them — and each new Pod gets a new IP from the pod network. Nothing can address a workload by Pod IP. A **Service** is the stable identity in front of a set of Pods: a name, a DNS entry, and (usually) a virtual IP that does not change for the life of the Service, load-balancing across whichever Pods currently back it.

## How a Service routes traffic

There is no proxy Pod in the data path. Routing is done by two controllers and the kernel:

1. **The EndpointSlice controller** watches Pods matching the Service's \`selector\`. For every Pod that is **Ready** (passing its readiness probe), it records \`(podIP, port)\` in an **EndpointSlice** object (older clusters used a single **Endpoints** object; EndpointSlices scale better). Pods that are not ready are **excluded** — this is how the readiness probe gates whether a Pod receives traffic.
2. **kube-proxy**, running on every node, watches Services and EndpointSlices and programs that node's packet-forwarding layer — \`iptables\` rules, IPVS virtual servers, or an eBPF datapath if the CNI (Cilium) replaces kube-proxy. The rule is: a packet destined for \`<ClusterIP>:<port>\` is **destination-NAT'd** to one of the ready endpoint IPs and ports, chosen per connection (roughly randomly, or round-robin with IPVS).
3. A client either connects directly to the ClusterIP, or resolves the Service's DNS name through **CoreDNS**, which returns the ClusterIP.

The ClusterIP is **virtual** — no process listens on it, no interface has it. It exists only as forwarding rules on every node, which is why it is fast (kernel-level, no extra hop) and why you cannot \`ping\` it or \`curl\` it from outside the cluster.

## DNS

CoreDNS gives every Service a name:

- \`web\` — from a Pod in the **same namespace**.
- \`web.shop\` — from any namespace.
- \`web.shop.svc.cluster.local\` — the fully-qualified form.

A Pod's \`/etc/resolv.conf\` has a search list (\`<ns>.svc.cluster.local\`, \`svc.cluster.local\`, \`cluster.local\`) so the short forms resolve. Named ports also get SRV records.

## The four types

### ClusterIP (the default)

A virtual IP reachable **only from inside the cluster** — from other Pods, and from the nodes. This is what all service-to-service traffic uses. An app's config points at \`postgres://db:5432\` and \`db\` is a ClusterIP Service.

### NodePort

A ClusterIP **plus** a port in the range 30000–32767 opened on **every node's IP**. A packet to \`<anyNodeIP>:<nodePort>\` is forwarded to the Service and load-balanced to a Pod, on any node. It is a blunt way to expose something externally — you must know a node IP, the port is high and arbitrary, and there is no TLS or hostname routing. In practice NodePort is a **building block**: it is what a LoadBalancer Service uses under the hood, and what bare-metal load balancers and some ingress setups target.

### LoadBalancer

A NodePort **plus** a request to the infrastructure — via the cloud-controller-manager on a cloud, or MetalLB on bare metal — to **provision a real external load balancer** that forwards to the NodePorts. You get a stable public IP or hostname in \`status.loadBalancer\`. The cost: on a cloud, **one external load balancer per Service**, each with its own bill and its own IP. For HTTP APIs this does not scale — you use **one** LoadBalancer (or NodePort) for an **Ingress controller** and route many hostnames and paths through it (Lesson 3).

### ExternalName

No selector, no proxying, no ClusterIP. It is a CNAME: \`db.prod.svc.cluster.local\` resolves to \`my-rds.abc123.us-east-1.rds.amazonaws.com\`. Used to give an external dependency an in-cluster name so application config does not need to change between environments.

## Headless Services

Set \`spec.clusterIP: None\` and the Service has **no virtual IP and no load balancing**. Instead, a DNS query for the Service name returns the **A/AAAA records of all ready backing Pods** directly. This is for:

- **Clients that load-balance themselves** — a database driver with its own connection pool and pool-aware routing.
- **Per-Pod addressing** — a **StatefulSet** paired with a headless Service gives each Pod a stable DNS name \`<pod-name>.<service>.<ns>.svc.cluster.local\`, which is how database replicas find each other and how a client addresses a specific replica.
- **Peer discovery** — a clustered application (Kafka, Elasticsearch, etcd) whose members need to enumerate each other.

## Key behaviours to know

- **Only Ready Pods are endpoints.** A Pod that fails its readiness probe is removed from the EndpointSlice and stops receiving new connections; when it passes again it is added back. This is the mechanism behind graceful rollouts and graceful shutdown.
- **Zero endpoints = connection refused.** If the selector matches no ready Pod — a label typo (Module 7), all Pods failing readiness, a scaled-to-zero Deployment — the Service still exists with a ClusterIP and DNS name, but every connection is refused because there is nothing to forward to. Always check \`kubectl get endpointslices -l kubernetes.io/service-name=<svc>\` when a Service seems down.
- **\`sessionAffinity: ClientIP\`** pins connections from one client IP to one Pod for a timeout. It is coarse (per source IP, so everyone behind one NAT gets the same Pod) and a sign the Pods should be stateless instead.
- **\`externalTrafficPolicy: Local\`** on a NodePort or LoadBalancer preserves the client's real source IP (the default \`Cluster\` NATs it away) but only routes to Pods on the node that received the packet, which can create imbalance if Pods are unevenly spread.
- **\`publishNotReadyAddresses: true\`** on a headless Service includes not-ready Pods in DNS — needed for StatefulSet peer discovery during startup.`,

    contentHi: `## Ek Service jo problem solve karta hai

Pods ephemeral hain. Ek Deployment unhe har update par replace karta hai, scheduler unhe node failure par move karta hai, ek HPA unhe add aur remove karta hai — aur har naya Pod pod network se ek naya IP paata hai. Kuch bhi ek workload ko Pod IP se address nahi kar sakta. Ek **Service** Pods ke ek set ke saamne stable identity hai: ek naam, ek DNS entry, aur (usually) ek virtual IP jo Service ke life ke liye nahi badalta.

## Ek Service traffic kaise route karta hai

Data path mein koi proxy Pod nahi hai. Routing do controllers aur kernel dwara ki jaati hai:
1. **EndpointSlice controller** Service ke \`selector\` se matching Pods watch karta hai. Har **Ready** Pod ke liye, ye \`(podIP, port)\` ko ek **EndpointSlice** object mein record karta hai. Jo Pods ready nahi hain wo **excluded** hain.
2. **kube-proxy**, har node par running, Services aur EndpointSlices watch karta hai aur us node ki packet-forwarding layer program karta hai. Rule: \`<ClusterIP>:<port>\` ke liye destined ek packet ready endpoint IPs mein se ek par **destination-NAT'd** hota hai.
3. Ek client ya to directly ClusterIP se connect karta hai, ya **CoreDNS** ke through Service ka DNS name resolve karta hai.

ClusterIP **virtual** hai — koi process ispar listen nahi karta. Ye sirf har node par forwarding rules ke roop mein exist karta hai.

## DNS

CoreDNS har Service ko ek naam deta hai: \`web\` (same namespace se), \`web.shop\` (kisi namespace se), \`web.shop.svc.cluster.local\` (fully-qualified).

## Chaar types

**ClusterIP (default):** ek virtual IP **sirf cluster ke andar se reachable**. Ye wo hai jo saara service-to-service traffic use karta hai.

**NodePort:** ek ClusterIP **plus** 30000-32767 range mein ek port **har node ke IP** par khola gaya. Ye externally kuch expose karne ka ek blunt tarika hai. Practice mein NodePort ek **building block** hai.

**LoadBalancer:** ek NodePort **plus** infrastructure se ek request — ek cloud par cloud-controller-manager ke through — ek **real external load balancer provision** karne ke liye. Cost: ek cloud par, **per Service ek external load balancer**. HTTP APIs ke liye ye scale nahi karta — aap ek **Ingress controller** ke liye **ek** LoadBalancer use karte ho.

**ExternalName:** koi selector nahi, koi proxying nahi. Ye ek CNAME hai.

## Headless Services

\`spec.clusterIP: None\` set karo aur Service ke paas **koi virtual IP nahi aur koi load balancing nahi**. Iske bajaay, Service name ke liye ek DNS query **saare ready backing Pods ke A/AAAA records** directly return karti hai. Ye databases, **StatefulSet** (har Pod ko ek stable DNS name \`<pod-name>.<service>.<ns>.svc.cluster.local\`), aur peer discovery ke liye hai.

## Key behaviours

- **Sirf Ready Pods endpoints hain.** Ek Pod jo apni readiness probe fail karta hai EndpointSlice se remove hota hai.
- **Zero endpoints = connection refused.** Agar selector kisi ready Pod se match nahi karta, Service abhi bhi exist karta hai par har connection refused hota hai. Hamesha \`kubectl get endpointslices\` check karo.
- **\`sessionAffinity: ClientIP\`** ek client IP se connections ko ek Pod par pin karta hai.
- **\`externalTrafficPolicy: Local\`** client ka real source IP preserve karta hai par sirf receiving node ke Pods par route karta hai.`,

    examples: [
      {
        title: 'ClusterIP: a stable VIP, EndpointSlice tracks ready Pods, DNS resolves the name',
        titleHi: 'ClusterIP: ek stable VIP, EndpointSlice ready Pods track karta hai, DNS naam resolve karta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m8l2-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

kubectl -n "$ns" create deployment web --image=registry.k8s.io/e2e-test-images/agnhost:2.47 --replicas=3 -- /agnhost netexec --http-port=8080 >/dev/null
kubectl -n "$ns" expose deployment web --port=80 --target-port=8080 >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=120s >/dev/null

echo "--- the Service has a stable ClusterIP + a DNS name ---"
kubectl -n "$ns" get svc web -o jsonpath='type={.spec.type} clusterIP={.spec.clusterIP}{"\\n"}' | sed -E 's/clusterIP=[0-9.]+/clusterIP=<vip>/'

echo "--- the EndpointSlice tracks the 3 READY Pod IPs ---"
kubectl -n "$ns" get endpointslices -l kubernetes.io/service-name=web -o jsonpath='{range .items[*]}{.endpoints[*].conditions.ready}{"\\n"}{end}' | tr ' ' '\\n' | grep -c true | sed 's/^/ready endpoints: /'

echo "--- from a client Pod: DNS resolves 'web' and traffic reaches a backend ---"
kubectl -n "$ns" run c --image=busybox:1.36 --restart=Never --rm -i --quiet -- \\
  sh -c 'sleep 2; nslookup web 2>/dev/null | grep -q "^Address" && echo "DNS: web resolved"; wget -qO- http://web/hostname | grep -q web && echo "HTTP: reached a web-* Pod via the Service VIP"'

echo "--- scale the Deployment to 0 -> the Service has ZERO ready endpoints -> connections refused ---"
kubectl -n "$ns" scale deploy/web --replicas=0 >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=60s >/dev/null
for i in $(seq 1 30); do
  n=$(kubectl -n "$ns" get endpointslices -l kubernetes.io/service-name=web -o jsonpath='{range .items[*]}{.endpoints[*].conditions.ready}{end}' | grep -c true)
  [ "$n" = 0 ] && break
  sleep 2
done
kubectl -n "$ns" get endpointslices -l kubernetes.io/service-name=web -o jsonpath='{range .items[*]}{.endpoints[*].conditions.ready}{end}' | grep -c true | sed 's/^/ready endpoints now: /'`,
        output: `--- the Service has a stable ClusterIP + a DNS name ---
type=ClusterIP clusterIP=<vip>
--- the EndpointSlice tracks the 3 READY Pod IPs ---
ready endpoints: 3
--- from a client Pod: DNS resolves 'web' and traffic reaches a backend ---
DNS: web resolved
HTTP: reached a web-* Pod via the Service VIP
--- scale the Deployment to 0 -> the Service has ZERO ready endpoints -> connections refused ---
ready endpoints now: 0`,
        explain: 'A Deployment of three Pods is exposed with a ClusterIP Service. The Service is given a virtual IP and a DNS name that stay fixed regardless of what happens to the Pods. The EndpointSlice controller populates an EndpointSlice with the addresses of the three Pods, and it lists them as ready because they are passing their default readiness state. From a separate client Pod, the Service name resolves through cluster DNS and an HTTP request to it reaches one of the backend Pods, confirming that the virtual IP forwards to a real endpoint. The last step scales the Deployment to zero replicas, so there are no Pods for the selector to match: the EndpointSlice controller empties the ready set and the Service now has zero ready endpoints. The Service object still exists with its ClusterIP and DNS name, but any connection to it is refused, because kube-proxy has no endpoint to forward to. A scaled-to-zero Deployment, a label typo between the Service selector and the Pods, or every Pod failing its readiness probe all produce the same symptom, and the diagnostic is always to look at the Service\'s EndpointSlices and check whether the selector is matching ready Pods.',
        explainHi: 'Teen Pods ka ek Deployment ek ClusterIP Service se exposed hai. Service ko ek virtual IP aur ek DNS name diya jaata hai jo Pods ke saath jo bhi hota hai uski parwah kiye bina fixed rehte hain. EndpointSlice controller ek EndpointSlice ko teen Pods ke addresses se populate karta hai. Ek separate client Pod se, Service name cluster DNS ke through resolve hota hai aur ek HTTP request ise ek backend Pod tak pahunchti hai. Aakhiri step Deployment ko zero replicas par scale karta hai, to selector ke match karne ke liye koi Pods nahi hain: EndpointSlice controller ready set ko khaali kar deta hai aur Service ke ab zero ready endpoints hain. Service object abhi bhi apne ClusterIP aur DNS name ke saath exist karta hai, par ise koi bhi connection refused hota hai. Ek scaled-to-zero Deployment, Service selector aur Pods ke beech ek label typo, ya har Pod ka readiness probe fail karna sab same symptom produce karte hain.',
      },
      {
        title: 'Headless Service: no VIP, DNS returns every ready Pod IP directly',
        titleHi: 'Headless Service: koi VIP nahi, DNS har ready Pod IP directly return karta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m8l2b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

kubectl -n "$ns" create deployment api --image=registry.k8s.io/e2e-test-images/agnhost:2.47 --replicas=3 -- /agnhost netexec --http-port=8080 >/dev/null
kubectl -n "$ns" rollout status deploy/api --timeout=120s >/dev/null

cat <<EOF | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Service
metadata: { name: api-clusterip }
spec: { selector: { app: api }, ports: [ { port: 80, targetPort: 8080 } ] }
---
apiVersion: v1
kind: Service
metadata: { name: api-headless }
spec:
  clusterIP: None                     # <- headless
  selector: { app: api }
  ports: [ { port: 80, targetPort: 8080 } ]
EOF
sleep 3

echo "--- ClusterIP Service: a single VIP ---"
kubectl -n "$ns" get svc api-clusterip -o jsonpath='clusterIP={.spec.clusterIP}{"\\n"}' | grep -qE '[0-9]+\\.[0-9]+' && echo "api-clusterip -> one virtual IP"

echo "--- headless Service: clusterIP is None ---"
kubectl -n "$ns" get svc api-headless -o jsonpath='clusterIP={.spec.clusterIP}{"\\n"}'

echo "--- DNS: 'api-clusterip' returns 1 address (the VIP); 'api-headless' returns 3 (the Pods) ---"
kubectl -n "$ns" run c --image=busybox:1.36 --restart=Never --rm -i --quiet -- sh -c '
  echo "api-clusterip -> $(nslookup api-clusterip 2>/dev/null | grep -c "^Address: .*[0-9]") address(es)"
  echo "api-headless  -> $(nslookup api-headless  2>/dev/null | grep -c "^Address: .*[0-9]") address(es)"
'`,
        output: `--- ClusterIP Service: a single VIP ---
api-clusterip -> one virtual IP
--- headless Service: clusterIP is None ---
clusterIP=None
--- DNS: 'api-clusterip' returns 1 address (the VIP); 'api-headless' returns 3 (the Pods) ---
api-clusterip -> 1 address(es)
api-headless  -> 3 address(es)`,
        explain: 'The same three Pods are fronted by two Services. The first is an ordinary ClusterIP Service: it has one virtual IP, and a DNS lookup of its name returns that single address, behind which kube-proxy load-balances to the Pods. The second sets the cluster IP to none, which makes it headless: it has no virtual IP at all, and a DNS lookup of its name returns the addresses of all ready backing Pods directly, with no forwarding layer in between. The practical difference is who does the load balancing. With the ClusterIP Service, the client connects to one address and the kernel spreads connections. With the headless Service, the client receives the full list of Pod addresses and must choose among them itself. That is what you want when the client is a database driver with its own pool, or when each Pod needs to be individually addressable, which is why a StatefulSet is paired with a headless Service so that each replica gets a stable per-Pod DNS name.',
        explainHi: 'Wahi teen Pods do Services dwara fronted hain. Pehla ek ordinary ClusterIP Service hai: iska ek virtual IP hai, aur iske name ka ek DNS lookup wo single address return karta hai. Doosra cluster IP ko none set karta hai, jo ise headless banata hai: iska koi virtual IP bilkul nahi hai, aur iske name ka ek DNS lookup saare ready backing Pods ke addresses directly return karta hai. Practical difference ye hai ki load balancing kaun karta hai. ClusterIP Service ke saath, client ek address se connect karta hai aur kernel connections spread karta hai. Headless Service ke saath, client Pod addresses ki poori list receive karta hai aur unmein se khud choose karna chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `# one LoadBalancer Service per HTTP API
services:
  api-a: { type: LoadBalancer, ... }     # -> a cloud LB, a public IP, ~$18/mo
  api-b: { type: LoadBalancer, ... }     # -> another LB, another IP, ~$18/mo
  api-c: { type: LoadBalancer, ... }     # -> ...and another. 20 APIs = 20 LBs.
# -> 20 external load balancers, 20 public IPs, 20 bills, 20 sets of TLS certs to
//    manage, and no shared hostname/path routing. this does not scale.`,
        right: `# ONE LoadBalancer for an Ingress controller; route everything through it (Lesson 3):
#   ingress-nginx (or Traefik, or the cloud's) = 1 LoadBalancer Service, 1 public IP
#   Ingress objects: api-a.example.com -> svc api-a (ClusterIP)
//                    api-b.example.com -> svc api-b (ClusterIP)
//                    example.com/c/*   -> svc api-c (ClusterIP)
#   the backing Services are all ClusterIP. TLS terminates once at the controller.
# LoadBalancer Service is right for NON-HTTP (a TCP database proxy, a game server).`,
        why: 'A LoadBalancer Service on a cloud provisions a dedicated external load balancer with its own public address and its own cost, and it operates at the transport layer, so it has no notion of hostnames or URL paths. Creating one per HTTP API therefore multiplies the number of external load balancers, public addresses, and bills by the number of APIs, and leaves every API on a separate address with its own TLS configuration and no way to route by hostname or path. The scalable arrangement for HTTP is a single LoadBalancer Service in front of an ingress controller, with the many application Services left as internal ClusterIP Services. Ingress objects then declare that a given hostname or path maps to a given Service, the controller consults them to route each request, and TLS is terminated once at the controller. A LoadBalancer Service remains the right choice for traffic that is not HTTP and cannot be routed by an ingress controller, such as a raw TCP endpoint for a database or a game server.',
        whyHi: 'Ek cloud par ek LoadBalancer Service ek dedicated external load balancer provision karta hai apne apne public address aur apni apni cost ke saath, aur ye transport layer par operate karta hai, to iske paas hostnames ya URL paths ka koi notion nahi hai. Per HTTP API ek banana isliye external load balancers, public addresses, aur bills ki sankhya ko APIs ki sankhya se multiply karta hai. HTTP ke liye scalable arrangement ek ingress controller ke saamne ek single LoadBalancer Service hai, jabki kai application Services internal ClusterIP Services ke roop mein chhode jaate hain. Ingress objects phir declare karte hain ki ek diya gaya hostname ya path ek diye gaye Service par map karta hai.',
      },
      {
        wrong: `# a Service with a selector that matches no ready Pod, and blaming DNS
$ kubectl get svc api        # exists, has a ClusterIP
$ kubectl run c --rm -it --image=curlimages/curl -- curl http://api
#   curl: (7) Failed to connect to api port 80: Connection refused
# -> "DNS is broken" / "the Service is broken" -> hours poking at CoreDNS.
# the ClusterIP resolves fine. there is just NOTHING behind it.`,
        right: `# a Service with 0 ready endpoints refuses connections. check the endpoints FIRST:
$ kubectl get endpointslices -l kubernetes.io/service-name=api
#   NAME         ADDRESSTYPE   ENDPOINTS   PORTS
#   api-abc12    IPv4          <none>      <none>          <- ZERO endpoints
# now find out why:
#   - does the Service selector match the Pods' labels EXACTLY? (Module 7)
#   - are the Pods READY?  kubectl get pods -l <selector>   (a failing readiness probe
//     removes a Pod from the Service)
#   - is the Deployment scaled to 0?
#   - is targetPort correct (name or number the container actually listens on)?`,
        why: 'A Service always has a ClusterIP and a DNS name once created, so the name resolving and the connection being refused are consistent with the Service working correctly and simply having nothing to forward to. The refusal happens because kube-proxy\'s forwarding rules for that ClusterIP have no endpoint to send the packet to, which is the case whenever the Service\'s EndpointSlice contains no ready addresses. The direct way to see this is to list the EndpointSlices for the Service; an empty endpoint list is the confirmation. The reasons it is empty are a small set: the Service\'s selector does not exactly match the labels on the Pods, the Pods exist but are failing their readiness probe and so are excluded, the workload is scaled to zero, or the Service\'s target port does not correspond to a port the container actually listens on. Checking the EndpointSlice first turns what is often diagnosed as a DNS or cluster-networking problem into a specific, quickly-fixed labelling or readiness issue.',
        whyHi: 'Ek Service ke paas hamesha ek ClusterIP aur ek DNS name hota hai ek baar created, to name resolve hona aur connection refused hona Service ke correctly kaam karne aur simply kuch forward karne ke liye na hone ke consistent hai. Refusal hota hai kyunki us ClusterIP ke liye kube-proxy ke forwarding rules ke paas packet bhejne ke liye koi endpoint nahi hai, jo tab case hai jab bhi Service ke EndpointSlice mein koi ready addresses nahi hain. Ise dekhne ka direct tarika Service ke liye EndpointSlices list karna hai; ek empty endpoint list confirmation hai. Reasons: selector Pods ke labels se exactly match nahi karta, Pods readiness probe fail kar rahe hain, workload zero par scaled hai, ya target port sahi nahi hai.',
      },
      {
        wrong: `# using NodePort for real external traffic
spec:
  type: NodePort
  ports: [ { port: 80, targetPort: 8080, nodePort: 31500 } ]
# clients: http://<some-node-ip>:31500
# -> you have to know a node IP (which changes as nodes are replaced), the port
//    is a weird high number, there's no TLS, no hostname routing, and if that
//    node is drained your hardcoded IP is dead. also anyone who can reach a node
//    on 31500 hits your Service, bypassing any ingress-level auth/WAF.`,
        right: `# NodePort is a BUILDING BLOCK, not an endpoint for clients:
#   - on a cloud:  use type: LoadBalancer (which creates a NodePort under the hood
//                  and puts a real LB + stable IP in front) — or Ingress for HTTP
#   - bare metal:  MetalLB gives you LoadBalancer semantics; or an external LB /
//                  HAProxy in front of the NodePorts, managed as infra
#   - HTTP:        one Ingress controller (Lesson 3), everything else ClusterIP
# direct NodePort access is fine for a quick test or an internal-only debug path.`,
        why: 'A NodePort opens the same port on every node and forwards it to the Service, which makes the Service reachable from outside the cluster but with several properties that are wrong for production client traffic. Clients must target a specific node\'s IP address, and node IPs are not stable — nodes are replaced during upgrades and scaling, so a hardcoded node IP becomes a dead address. The port is a high arbitrary number rather than 80 or 443. There is no TLS termination and no ability to route by hostname or path, so many services cannot share one entry point. And because the port is open on every node, anything that can reach a node on that port reaches the Service directly, bypassing whatever authentication, rate limiting, or filtering an ingress layer would apply. NodePort is intended as a mechanism that other things build on: a cloud LoadBalancer Service creates a NodePort internally and places a managed load balancer with a stable address in front of it, a bare-metal setup uses MetalLB or an external load balancer for the same effect, and HTTP traffic goes through an ingress controller. Direct NodePort access is reasonable only for a throwaway test or an internal debugging path.',
        whyHi: 'Ek NodePort har node par same port kholta hai aur ise Service par forward karta hai, jo Service ko cluster ke bahar se reachable banata hai par kai properties ke saath jo production client traffic ke liye galat hain. Clients ko ek specific node ka IP address target karna chahiye, aur node IPs stable nahi hain. Port ek high arbitrary number hai. Koi TLS termination aur hostname ya path se route karne ki koi ability nahi hai. Aur kyunki port har node par open hai, kuch bhi jo us port par ek node tak pahunch sakta hai Service ko directly reach karta hai, kisi bhi ingress-level auth ko bypass karke. NodePort ek mechanism ke roop mein intended hai jispar doosri cheezein build karti hain.',
      },
    ],

    realWorld: [
      {
        en: '**A cloud bill with 34 load balancers on it** — one per microservice, each a `type: LoadBalancer` Service. Consolidated to a single ingress-nginx LoadBalancer + 34 ClusterIP Services + Ingress objects; the LB line item dropped ~97%.',
        hi: '**Ek cloud bill jispar 34 load balancers** — per microservice ek. Ek single ingress-nginx LoadBalancer + 34 ClusterIP Services par consolidate kiya.',
      },
      {
        en: '**A "DNS outage" that was a label typo** — a Deployment\'s Pods were labelled `app: checkout-svc` and the Service selector said `app: checkout`. Two hours on CoreDNS before someone ran `kubectl get endpointslices` and saw `<none>`.',
        hi: '**Ek "DNS outage" jo ek label typo tha** — ek Deployment ke Pods `app: checkout-svc` labelled the aur Service selector ne `app: checkout` kaha.',
      },
      {
        en: '**A StatefulSet database whose replicas couldn\'t find each other** — it had a normal ClusterIP Service, so every peer lookup returned the one VIP. Adding a headless Service (`clusterIP: None`) gave each Pod `db-0.db.ns.svc...` and the cluster formed.',
        hi: '**Ek StatefulSet database jiske replicas ek doosre ko nahi dhoondh sake** — iska ek normal ClusterIP Service tha. Ek headless Service add karna.',
      },
    ],

    interviewQA: [
      {
        q: 'How does a ClusterIP Service actually route a packet to a Pod?',
        qHi: 'Ek ClusterIP Service actually ek packet ko ek Pod tak kaise route karta hai?',
        a: 'There is no proxy process in the data path. Two controllers and the kernel do the work. The EndpointSlice controller watches the Pods that match the Service\'s selector, and for every Pod that is passing its readiness probe it records the Pod\'s IP and port in an EndpointSlice object; Pods that are not ready are excluded, which is how readiness gates traffic. kube-proxy runs on every node, watches Services and EndpointSlices, and programs that node\'s packet-forwarding layer — iptables rules, IPVS, or an eBPF datapath depending on the setup — with a rule that a packet destined for the Service\'s ClusterIP and port is destination-NAT\'d to one of the ready endpoint addresses, chosen per connection. A client either connects straight to the ClusterIP or resolves the Service\'s DNS name through CoreDNS, which returns the ClusterIP. The ClusterIP itself is virtual: no process listens on it and no interface holds it, it exists only as those forwarding rules on every node, which is why it is fast and why it cannot be reached from outside the cluster. If the EndpointSlice has no ready endpoints, the Service still has its ClusterIP and name but every connection is refused, because there is nothing to forward to.',
        aHi: 'Data path mein koi proxy process nahi hai. Do controllers aur kernel kaam karte hain. EndpointSlice controller un Pods ko watch karta hai jo Service ke selector se match karte hain, aur har Pod ke liye jo apni readiness probe pass kar raha hai ye Pod ka IP aur port ek EndpointSlice object mein record karta hai; jo Pods ready nahi hain wo excluded hain. kube-proxy har node par run karta hai, Services aur EndpointSlices watch karta hai, aur us node ki packet-forwarding layer ko ek rule ke saath program karta hai ki Service ke ClusterIP aur port ke liye destined ek packet ready endpoint addresses mein se ek par destination-NAT\'d hota hai. ClusterIP khud virtual hai: koi process ispar listen nahi karta.',
      },
      {
        q: 'Compare ClusterIP, NodePort, LoadBalancer, and headless Services, and say when each is right.',
        qHi: 'ClusterIP, NodePort, LoadBalancer, aur headless Services compare karo.',
        a: 'ClusterIP is the default: a virtual IP reachable only from inside the cluster, load-balancing across the Service\'s ready Pods. It is what all service-to-service traffic uses and is the right type for anything that does not need to be reached from outside. NodePort is a ClusterIP plus the same high port, in the 30000 to 32767 range, opened on every node\'s IP, so an external client can hit any node on that port. It is crude — you must know a node IP, the port is arbitrary, there is no TLS or hostname routing — and in practice it is a building block rather than a client endpoint. LoadBalancer is a NodePort plus a request to the cloud, or to MetalLB on bare metal, to provision a real external load balancer with a stable public address in front of the node ports. It is right for non-HTTP external traffic like a database proxy or a game server, but creating one per HTTP API multiplies load balancers and bills, so HTTP should go through a single LoadBalancer in front of an ingress controller with the application Services left as ClusterIP. Headless, set with a cluster IP of none, has no virtual IP and no load balancing; a DNS query returns the addresses of all ready Pods directly, for clients that balance themselves or need per-Pod addressing, which is why StatefulSets pair with a headless Service to give each replica a stable name.',
        aHi: 'ClusterIP default hai: ek virtual IP sirf cluster ke andar se reachable, Service ke ready Pods ke across load-balancing. NodePort ek ClusterIP plus same high port hai, har node ke IP par khola gaya. Ye crude hai aur practice mein ek building block hai. LoadBalancer ek NodePort plus cloud se ek request hai ek real external load balancer provision karne ke liye. Ye non-HTTP external traffic ke liye sahi hai, par per HTTP API ek banana load balancers aur bills ko multiply karta hai, to HTTP ek ingress controller ke saamne ek single LoadBalancer ke through jaana chahiye. Headless, cluster IP none ke saath set, ka koi virtual IP nahi hai; ek DNS query saare ready Pods ke addresses directly return karti hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain the roles of the EndpointSlice controller and kube-proxy in routing a ClusterIP Service, and why the ClusterIP is called "virtual".',
        taskHi: 'Ek comment mein, ek ClusterIP Service ko route karne mein EndpointSlice controller aur kube-proxy ke roles samjhao.',
        hint: 'NO proxy Pod is in the data path. (1) The ENDPOINTSLICE controller watches Pods matching the Service `selector`; for every Pod that is READY (passing its readiness probe) it records `(podIP, port)` in an EndpointSlice object — NOT-ready Pods are excluded (this is how readiness gates Service membership). (2) KUBE-PROXY runs on EVERY node, watches Services + EndpointSlices, and programs that node\'s kernel packet-forwarding (iptables / IPVS / an eBPF CNI datapath) with: "a packet to `<ClusterIP>:<port>` → DNAT to a random ready endpoint:`<targetPort>`", per-connection. (3) A client connects to the ClusterIP directly, or resolves the name via CoreDNS → the ClusterIP. The ClusterIP is "VIRTUAL" because NO process listens on it and NO interface holds it — it exists ONLY as forwarding rules on every node. That\'s why it\'s fast (kernel-level, no extra hop) and why you can\'t `ping`/`curl` it from OUTSIDE the cluster.',
        hintHi: 'Data path mein KOI proxy Pod nahi. (1) ENDPOINTSLICE controller `selector` se matching Pods watch karta hai; har READY Pod ke liye `(podIP, port)` ek EndpointSlice object mein record karta hai — NOT-ready Pods excluded. (2) KUBE-PROXY HAR node par run karta hai, Services + EndpointSlices watch karta hai, aur us node ki kernel packet-forwarding program karta hai: "`<ClusterIP>:<port>` ka packet → ek random ready endpoint par DNAT". (3) Client ClusterIP se connect karta hai ya CoreDNS ke through naam resolve karta hai. ClusterIP "VIRTUAL" hai kyunki KOI process ispar listen nahi karta — ye SIRF forwarding rules ke roop mein exist karta hai.',
      },
      {
        task: 'In a comment, describe all four Service types + headless, and for each give one concrete "use this when...".',
        taskHi: 'Ek comment mein, chaaron Service types + headless describe karo.',
        hint: 'CLUSTERIP (default) — a cluster-internal VIP, reachable ONLY from inside; use for ALL service-to-service traffic (`postgres://db:5432` where `db` is a ClusterIP). NODEPORT — ClusterIP + the SAME high port (30000-32767) on EVERY node IP; use as a BUILDING BLOCK (what LoadBalancer/bare-metal LBs target) or a quick internal test — NOT a client endpoint (node IPs change, no TLS, no hostname routing). LOADBALANCER — NodePort + the cloud (or MetalLB) provisions a REAL external LB with a stable public IP; use for NON-HTTP external traffic (a TCP DB proxy, a game server) — for HTTP use ONE LB for an Ingress controller, not one per API (per-Service LBs multiply IPs + bills). EXTERNALNAME — no selector, no proxy, just a CNAME (`db.prod` → `rds.amazonaws.com`); use to give an external dependency an in-cluster name so config doesn\'t change between envs. HEADLESS (`clusterIP: None`) — no VIP, no LB; DNS returns the A records of ALL ready Pods directly; use when the client balances itself (a DB driver pool) or needs per-Pod addressing (a StatefulSet — each Pod gets `<pod>.<svc>.<ns>.svc...`, peer discovery).',
        hintHi: 'CLUSTERIP (default) — ek cluster-internal VIP, SIRF andar se reachable; SAARA service-to-service traffic. NODEPORT — ClusterIP + har node IP par SAME high port; ek BUILDING BLOCK ke roop mein — NOT a client endpoint. LOADBALANCER — NodePort + cloud ek REAL external LB provision karta hai; NON-HTTP external traffic ke liye — HTTP ke liye ek Ingress controller ke liye EK LB. EXTERNALNAME — koi selector nahi, bas ek CNAME. HEADLESS (`clusterIP: None`) — koi VIP nahi; DNS SAARE ready Pods ke A records directly return karta hai; jab client khud balance karta hai ya per-Pod addressing chahiye (StatefulSet).',
      },
      {
        task: 'A Service resolves but every connection is "refused". In a comment, explain why the Service still "works" in that state, the ONE command to run first, and the 4 common causes.',
        taskHi: 'Ek Service resolve hoti hai par har connection "refused" hai. Kyun?',
        hint: 'A Service ALWAYS has a ClusterIP + DNS name once created, so name-resolving + connection-refused is fully consistent with the Service working and simply having NOTHING to forward to. kube-proxy\'s rules for that ClusterIP have no endpoint → the connection is refused. RUN FIRST: `kubectl get endpointslices -l kubernetes.io/service-name=<svc>` (or `kubectl get endpoints <svc>`) → an empty ENDPOINTS list is the confirmation. 4 COMMON CAUSES: (1) the Service `selector` doesn\'t EXACTLY match the Pods\' labels (a typo, wrong key/value — Module 7); (2) the Pods exist but are FAILING their readiness probe → excluded from the EndpointSlice (`kubectl get pods -l <selector>` — check READY); (3) the Deployment is scaled to 0; (4) `targetPort` is wrong — it must be the port (number or NAME) the container ACTUALLY listens on. Checking the EndpointSlice first turns "DNS/cluster networking is broken" (hours on CoreDNS) into a specific, 1-line-fix labelling/readiness issue.',
        hintHi: 'Ek Service ke paas HAMESHA ek ClusterIP + DNS name hota hai, to name-resolving + connection-refused Service ke kaam karne aur simply KUCH forward karne ke liye na hone ke consistent hai. RUN FIRST: `kubectl get endpointslices -l kubernetes.io/service-name=<svc>` → ek empty ENDPOINTS list confirmation hai. 4 CAUSES: (1) `selector` Pods ke labels se EXACTLY match nahi karta; (2) Pods readiness probe FAIL kar rahe hain → excluded; (3) Deployment 0 par scaled; (4) `targetPort` galat hai. EndpointSlice pehle check karna "DNS broken" ko ek 1-line-fix labelling issue mein badalta hai.',
      },
    ],

    keyTakeaways: [
      'A SERVICE = a STABLE name + (usually) a virtual IP in front of a CHANGING set of Pods. HOW IT ROUTES (no proxy Pod in the path): (1) the ENDPOINTSLICE controller watches Pods matching `spec.selector`, adds `(podIP, port)` to an EndpointSlice for each READY Pod (not-ready = excluded — this is how the readiness probe gates traffic); (2) KUBE-PROXY on EVERY node watches Services + EndpointSlices and programs the node\'s iptables/IPVS/eBPF: "packet to `<ClusterIP>:<port>` → DNAT to a random ready endpoint", per-connection, in the KERNEL; (3) the client connects to the ClusterIP or resolves the name via CoreDNS. The ClusterIP is VIRTUAL — nothing listens on it, it\'s only forwarding rules on every node (fast, and unreachable from OUTSIDE the cluster).',
      'DNS (CoreDNS): `web` (same namespace) / `web.shop` (any namespace) / `web.shop.svc.cluster.local` (FQDN). A Pod\'s `/etc/resolv.conf` search list makes the short forms work. THE FOUR TYPES: CLUSTERIP (default — internal-only VIP; ALL service-to-service traffic). NODEPORT (ClusterIP + the SAME high port 30000-32767 on EVERY node IP — crude external access; really a BUILDING BLOCK, not a client endpoint: node IPs change, no TLS, no hostname routing, bypasses ingress auth). LOADBALANCER (NodePort + the cloud/MetalLB provisions a REAL external LB with a stable public IP — right for NON-HTTP; but ONE LB per HTTP API = multiplied IPs + bills → use ONE LB for an Ingress controller instead). EXTERNALNAME (no selector, no proxy — just a CNAME, e.g. `db.prod` → `rds.amazonaws.com`).',
      'HEADLESS SERVICE (`spec.clusterIP: None`) — NO virtual IP, NO load balancing. DNS returns the A/AAAA records of ALL ready backing Pods DIRECTLY. Use when: the client load-balances itself (a DB driver with its own pool); per-Pod addressing is needed (a STATEFULSET + headless Service → each Pod gets a stable `<pod-name>.<service>.<ns>.svc.cluster.local`); peer discovery (Kafka/ES/etcd members enumerate each other). `publishNotReadyAddresses: true` includes not-ready Pods in DNS (StatefulSet startup peer discovery).',
      'ONLY READY PODS ARE ENDPOINTS — a Pod failing its readiness probe is removed from the EndpointSlice and stops getting NEW connections; passes again → added back (this is the mechanism behind graceful rollouts + graceful shutdown). ZERO ENDPOINTS = CONNECTION REFUSED: if the selector matches no ready Pod (a label typo, all Pods failing readiness, a scaled-to-0 Deployment, a wrong `targetPort`), the Service STILL exists with a ClusterIP + DNS name, but every connection is refused. When a Service seems down, RUN FIRST: `kubectl get endpointslices -l kubernetes.io/service-name=<svc>` — an empty list is the answer, and it turns a suspected "DNS/cluster-networking" outage into a 1-line labelling/readiness fix.',
      'OTHER BEHAVIOURS: `port` = the Service port (clients connect here); `targetPort` = the container port (number or a NAMED port). `sessionAffinity: ClientIP` pins a source IP to one Pod for a timeout — coarse (everyone behind one NAT → same Pod), a sign the Pods should be stateless. `externalTrafficPolicy: Local` (NodePort/LB) preserves the client\'s real source IP (default `Cluster` NATs it away) but only routes to Pods on the RECEIVING node → can imbalance if Pods are unevenly spread. Service ports can be NAMED. A CLOUD BILL WITH 30+ LOAD BALANCERS is the classic "one `type: LoadBalancer` per microservice" anti-pattern — consolidate to one Ingress-controller LoadBalancer + N ClusterIP Services.',
    ],
    keyTakeawaysHi: [
      'EK SERVICE = ek STABLE name + (usually) ek virtual IP ek CHANGING set of Pods ke saamne. YE KAISE ROUTE KARTA HAI (path mein koi proxy Pod nahi): (1) ENDPOINTSLICE controller `spec.selector` se matching Pods watch karta hai, har READY Pod ke liye `(podIP, port)` ek EndpointSlice mein add karta hai (not-ready = excluded); (2) HAR node par KUBE-PROXY Services + EndpointSlices watch karta hai aur node ki iptables/IPVS/eBPF program karta hai: "`<ClusterIP>:<port>` ka packet → ek random ready endpoint par DNAT", KERNEL mein; (3) client ClusterIP se connect karta hai ya CoreDNS ke through naam resolve karta hai. ClusterIP VIRTUAL hai — ispar kuch listen nahi karta.',
      'DNS (CoreDNS): `web` / `web.shop` / `web.shop.svc.cluster.local`. CHAAR TYPES: CLUSTERIP (default — internal-only VIP). NODEPORT (ClusterIP + har node IP par SAME high port — crude; really a BUILDING BLOCK). LOADBALANCER (NodePort + cloud ek REAL external LB provision karta hai — NON-HTTP ke liye sahi; par per HTTP API ek = multiplied bills → ek Ingress controller ke liye EK LB). EXTERNALNAME (koi selector nahi — bas ek CNAME).',
      'HEADLESS SERVICE (`spec.clusterIP: None`) — KOI virtual IP nahi, KOI load balancing nahi. DNS SAARE ready backing Pods ke A/AAAA records DIRECTLY return karta hai. Use jab: client khud load-balance karta hai; per-Pod addressing chahiye (STATEFULSET + headless Service → har Pod ko ek stable `<pod-name>.<service>.<ns>.svc.cluster.local`); peer discovery.',
      'SIRF READY PODS ENDPOINTS HAIN — ek Pod jo readiness probe fail karta hai EndpointSlice se remove hota hai. ZERO ENDPOINTS = CONNECTION REFUSED: agar selector kisi ready Pod se match nahi karta, Service ABHI BHI exist karta hai par har connection refused hota hai. Jab ek Service down lagti hai, RUN FIRST: `kubectl get endpointslices -l kubernetes.io/service-name=<svc>` — ek empty list answer hai.',
      'OTHER BEHAVIOURS: `port` = Service port; `targetPort` = container port (number ya ek NAMED port). `sessionAffinity: ClientIP` ek source IP ko ek Pod par pin karta hai — coarse. `externalTrafficPolicy: Local` client ka real source IP preserve karta hai par sirf RECEIVING node ke Pods par route karta hai. 30+ LOAD BALANCERS WALA CLOUD BILL classic "per microservice ek `type: LoadBalancer`" anti-pattern hai.',
    ],
  },

  {
    slug: 'ops-ingress-and-the-ingress-controller',
    title: 'Ingress & the IngressController — L7 Routing and TLS',
    titleHi: 'Ingress & IngressController — L7 Routing aur TLS',
    description: 'A Service can only route by IP and port. An Ingress is an HTTP-aware rule set — route by hostname and URL path, terminate TLS, all through one external entry point. But an Ingress object does nothing on its own: it is just configuration that an Ingress controller (nginx, Traefik, a cloud LB controller) reads and turns into a real reverse proxy.',
    descriptionHi: 'Ek Service sirf IP aur port se route kar sakti hai. Ek Ingress ek HTTP-aware rule set hai — hostname aur URL path se route karo, TLS terminate karo, sab ek external entry point ke through. Par ek Ingress object apne aap kuch nahi karta: ye sirf configuration hai jise ek Ingress controller (nginx, Traefik, ek cloud LB controller) padhta hai aur ek real reverse proxy mein badalta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**The building lobby versus the individual office doors.** A LoadBalancer Service is a private street entrance for one tenant — give every tenant their own and you have thirty entrances, thirty security desks, thirty street addresses. An Ingress is the shared lobby: one street address, one security desk, one set of front doors. The receptionist reads the name on each visitor\'s badge ("I\'m here for Accounting" = the `Host` header, "delivery for the mailroom" = the URL path) and directs them to the right internal office (a ClusterIP Service). The receptionist also checks IDs at the door so nobody upstairs has to (TLS termination). But the lobby is just a desk and a rulebook until you hire a receptionist to sit there and follow it — the **Ingress object is the rulebook, the Ingress controller is the receptionist**. Post the rulebook with no one at the desk and visitors just stand outside.',
      hi: '**Building lobby versus individual office doors.** Ek LoadBalancer Service ek tenant ke liye ek private street entrance hai — har tenant ko apna do aur aapke paas tees entrances, tees security desks hain. Ek Ingress shared lobby hai: ek street address, ek security desk, ek set front doors. Receptionist har visitor ke badge par naam padhta hai ("main Accounting ke liye aaya hoon" = `Host` header, "mailroom ke liye delivery" = URL path) aur unhe sahi internal office (ek ClusterIP Service) par direct karta hai. Receptionist door par IDs bhi check karta hai (TLS termination). Par lobby sirf ek desk aur ek rulebook hai jab tak aap ek receptionist hire na karo — **Ingress object rulebook hai, Ingress controller receptionist hai**. Rulebook post karo desk par koi na ho, aur visitors bas bahar khade rehte hain.',
    },

    simple: `**AN INGRESS = HTTP routing rules. AN INGRESS CONTROLLER = the proxy that enforces them.**
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: site
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2      # controller-specific knobs
spec:
  ingressClassName: nginx                # WHICH controller should act on this
  tls:
    - hosts: [ shop.example.com ]
      secretName: shop-tls               # a kubernetes.io/tls Secret (cert + key)
  rules:
    - host: shop.example.com             # route by Host header
      http:
        paths:
          - path: /                       # route by URL path
            pathType: Prefix
            backend:
              service: { name: shop, port: { number: 80 } }   # -> a ClusterIP Service
    - host: api.example.com
      http:
        paths:
          - path: /v1(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service: { name: api, port: { number: 80 } }
\`\`\`

**THE TWO-PART MODEL:**
\`\`\`
Ingress object        just an API resource. declarative HTTP rules. does NOTHING alone.
Ingress CONTROLLER    a Deployment (ingress-nginx / Traefik / HAProxy / cloud) that:
                        - watches Ingress objects cluster-wide
                        - generates a reverse-proxy config from them (nginx.conf, ...)
                        - is itself exposed by ONE Service type=LoadBalancer (or NodePort)
                      no controller installed  ->  Ingress objects are inert, you get 404s
\`\`\`

**WHAT IT GIVES YOU OVER A Service:**
\`\`\`
- host-based routing      shop.example.com and api.example.com -> ONE IP, different Services
- path-based routing      /  -> web ,  /api -> api        (longest matching prefix wins)
- TLS termination         HTTPS terminates at the controller; cert stored in a Secret
- ONE LoadBalancer        many hostnames/apps behind a single cloud LB + public IP
- L7 features             redirects, rewrites, auth, rate limits (via annotations)
\`\`\`

**\`pathType\`:**
\`\`\`
Prefix                    /foo matches /foo and /foo/bar   (element-wise, not string)
Exact                     /foo matches ONLY /foo
ImplementationSpecific    up to the controller (nginx: regex, needs use-regex/rewrite)
\`\`\`

**IngressClass:** \`spec.ingressClassName: nginx\` tells the nginx controller "this one is
mine" and every other controller to ignore it. One cluster can run several (e.g. an
\`internal\` and an \`external\` nginx). A default IngressClass (annotation
\`ingressclass.kubernetes.io/is-default-class: "true"\`) claims Ingresses that name none.

**GATEWAY API** is the successor: \`Gateway\` + \`HTTPRoute\` CRDs, role-split (infra team owns
the Gateway, app teams own routes), typed rules instead of annotation soup. Ingress is
stable and everywhere; Gateway API is the direction of travel.`,

    simpleHi: `**EK INGRESS = HTTP routing rules. EK INGRESS CONTROLLER = wo proxy jo unhe enforce karta hai.**
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: site
spec:
  ingressClassName: nginx                # KAUNSA controller ispar act kare
  tls:
    - hosts: [ shop.example.com ]
      secretName: shop-tls               # ek kubernetes.io/tls Secret (cert + key)
  rules:
    - host: shop.example.com             # Host header se route
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service: { name: shop, port: { number: 80 } }   # -> ek ClusterIP Service
\`\`\`

**DO-HISSA MODEL:**
\`\`\`
Ingress object        sirf ek API resource. declarative HTTP rules. AKELE KUCH NAHI karta.
Ingress CONTROLLER    ek Deployment (ingress-nginx / Traefik / cloud) jo:
                        - cluster-wide Ingress objects watch karta hai
                        - unse ek reverse-proxy config generate karta hai
                        - khud EK Service type=LoadBalancer se exposed hai
                      koi controller nahi  ->  Ingress objects inert, aapko 404s milte hain
\`\`\`

**YE Service ke upar KYA DETA HAI:**
\`\`\`
- host-based routing      shop... aur api... -> EK IP, alag Services
- path-based routing      /  -> web ,  /api -> api        (longest matching prefix jeetta hai)
- TLS termination         HTTPS controller par terminate hota hai; cert ek Secret mein
- EK LoadBalancer         kai hostnames/apps ek single cloud LB + public IP ke peeche
- L7 features             redirects, rewrites, auth, rate limits (annotations ke through)
\`\`\`

**\`pathType\`:** Prefix (/foo, /foo aur /foo/bar match karta hai) / Exact (SIRF /foo) /
ImplementationSpecific (controller par depend — nginx: regex).

**IngressClass:** \`spec.ingressClassName: nginx\` nginx controller ko batata hai "ye mera
hai" aur baaki sabko ignore karne ko. Ek cluster kai chala sakta hai (ek \`internal\` aur ek
\`external\` nginx).

**GATEWAY API** successor hai: \`Gateway\` + \`HTTPRoute\` CRDs, role-split, typed rules
annotation soup ke bajaay. Ingress stable aur har jagah hai; Gateway API direction of travel hai.`,

    content: `## Why a Service is not enough

A Service routes at layer 4 — it knows an IP and a port, nothing else. It cannot look at an HTTP request. So it cannot send \`shop.example.com\` and \`api.example.com\` to different backends through the same address, cannot route \`/\` to one Service and \`/api\` to another, and cannot terminate TLS. If you expose each HTTP app with its own \`type: LoadBalancer\` Service, every app gets its own cloud load balancer, its own public IP, and its own TLS setup — thirty apps, thirty load balancers, thirty bills.

## The Ingress: HTTP rules

An **Ingress** object is a declarative description of HTTP routing:

- **\`spec.rules[].host\`** — match on the \`Host\` header. Different hostnames, one entry point.
- **\`spec.rules[].http.paths[]\`** — match on the URL path, each path pointing at a backend **Service** (which must be a normal in-cluster Service, usually ClusterIP).
- **\`spec.tls[]\`** — a list of hostnames and the name of a \`kubernetes.io/tls\` Secret holding the certificate and private key for them. HTTPS is terminated here.
- **\`spec.ingressClassName\`** — which controller should act on this Ingress.
- **annotations** — controller-specific behaviour: rewrites, redirects, auth, rate limiting, body size limits, timeouts, canary weighting. These are not portable between controllers.

## The Ingress controller: the thing that does the work

An Ingress object **does nothing by itself**. It is inert configuration. You must run an **Ingress controller** — a Deployment of a reverse proxy plus control logic — which:

1. **Watches all Ingress objects** (and Services and EndpointSlices) across the cluster.
2. **Generates a reverse-proxy configuration** from them — for ingress-nginx, an \`nginx.conf\` with an \`upstream\` per Service and \`server\`/\`location\` blocks per host and path — and reloads the proxy on every change.
3. **Is itself exposed** to the outside world by exactly **one** Service, typically \`type: LoadBalancer\` (one cloud LB, one public IP for the whole cluster) or \`NodePort\` on bare metal / kind.

Common controllers: **ingress-nginx** (the community nginx one), **Traefik**, **HAProxy**, **Envoy-based** ones (Contour, Emissary), and **cloud-native** ones (AWS Load Balancer Controller, GKE Ingress) that provision an ALB/Application Gateway instead of running an in-cluster proxy. If **no controller is installed**, your Ingress objects sit there and every request 404s.

## Request flow

\`\`\`
client --HTTPS--> [cloud LB / NodePort] --> [ingress-nginx Pod]
                                              | reads Host + path, terminates TLS
                                              | picks the matching Ingress rule
                                              v
                                     [ClusterIP Service] --> [a Ready Pod]
\`\`\`

The controller usually routes to **Pod IPs directly** (read from EndpointSlices), using the ClusterIP Service only as a grouping — so its own load balancing, retries, and session affinity apply.

## pathType

- **\`Prefix\`** — path is split on \`/\` and matched element by element. \`/foo\` matches \`/foo\` and \`/foo/bar\` but not \`/foobar\`.
- **\`Exact\`** — matches only the exact path, case-sensitive.
- **\`ImplementationSpecific\`** — the controller decides. ingress-nginx treats the path as a regular expression when \`use-regex\` is on, which is how capture-group rewrites work.

When multiple paths match, the **longest** one wins: \`/api\` beats \`/\`.

## IngressClass

\`spec.ingressClassName\` names an **IngressClass** resource, which identifies a controller. \`nginx\` means "the nginx controller should own this; everyone else ignore it." A cluster can run several controllers — a common pattern is an \`external\` nginx on a public LB and an \`internal\` nginx on a private one, and each Ingress picks its class. An IngressClass annotated \`ingressclass.kubernetes.io/is-default-class: "true"\` picks up Ingresses that specify no class. An Ingress with a class no installed controller claims does nothing — a frequent "why is my route 404ing" cause.

## TLS

Put the certificate and key in a Secret of type \`kubernetes.io/tls\` (keys \`tls.crt\`, \`tls.key\`), reference it from \`spec.tls[].secretName\`, and the controller serves HTTPS for those hosts and terminates it — the connection from the controller to your Pod is plain HTTP inside the cluster. In practice the Secret is created and rotated automatically by **cert-manager**, which talks to Let's Encrypt or an internal CA and renews before expiry.

## Gateway API

**Gateway API** is the newer, more expressive successor to Ingress, built as CRDs: a \`GatewayClass\` (an implementation), a \`Gateway\` (a listener — ports, protocols, TLS — owned by the platform team), and route objects (\`HTTPRoute\`, \`GRPCRoute\`, \`TCPRoute\`) owned by app teams and attached to a Gateway. It replaces the annotation soup with typed fields for header matching, traffic splitting, redirects, and request mirroring, and it separates the infrastructure concern (the Gateway) from the application concern (the routes) with proper RBAC boundaries. Ingress is not deprecated and is universally supported; Gateway API is where new investment goes and is worth adopting for new multi-team platforms.`,

    contentHi: `## Ek Service kaafi kyun nahi hai

Ek Service layer 4 par route karta hai — ye ek IP aur ek port jaanta hai, aur kuch nahi. Ye ek HTTP request dekh nahi sakta. To ye \`shop.example.com\` aur \`api.example.com\` ko same address ke through alag backends par bhej nahi sakta, \`/\` ko ek Service aur \`/api\` ko doosre par route nahi kar sakta, aur TLS terminate nahi kar sakta. Agar aap har HTTP app ko apne \`type: LoadBalancer\` Service se expose karte ho, har app ko apna cloud load balancer, apna public IP milta hai — tees apps, tees load balancers.

## Ingress: HTTP rules

Ek **Ingress** object HTTP routing ka ek declarative description hai:
- **\`spec.rules[].host\`** — \`Host\` header par match. Alag hostnames, ek entry point.
- **\`spec.rules[].http.paths[]\`** — URL path par match, har path ek backend **Service** par point karta hai.
- **\`spec.tls[]\`** — hostnames ki ek list aur ek \`kubernetes.io/tls\` Secret ka naam jismein unke liye certificate aur private key hai. HTTPS yahaan terminate hota hai.
- **\`spec.ingressClassName\`** — kaunsa controller is Ingress par act kare.
- **annotations** — controller-specific behaviour: rewrites, redirects, auth, rate limiting. Ye controllers ke beech portable nahi hain.

## Ingress controller: wo cheez jo kaam karti hai

Ek Ingress object **apne aap kuch nahi karta**. Ye inert configuration hai. Aapko ek **Ingress controller** chalana chahiye — ek reverse proxy plus control logic ka Deployment — jo:
1. Cluster mein **saare Ingress objects watch karta hai**.
2. Unse ek **reverse-proxy configuration generate karta hai** — ingress-nginx ke liye, ek \`nginx.conf\` — aur har change par proxy reload karta hai.
3. Khud outside world ko theek **ek** Service se **exposed** hai, typically \`type: LoadBalancer\` ya bare metal / kind par \`NodePort\`.

Common controllers: **ingress-nginx**, **Traefik**, **HAProxy**, **Envoy-based** (Contour), aur **cloud-native** (AWS Load Balancer Controller, GKE Ingress). Agar **koi controller install nahi hai**, aapke Ingress objects wahaan baithe rehte hain aur har request 404 karti hai.

## Request flow

\`\`\`
client --HTTPS--> [cloud LB / NodePort] --> [ingress-nginx Pod]
                                              | Host + path padhta hai, TLS terminate karta hai
                                              v
                                     [ClusterIP Service] --> [ek Ready Pod]
\`\`\`

## pathType

- **\`Prefix\`** — path \`/\` par split hota hai aur element by element match hota hai. \`/foo\` \`/foo\` aur \`/foo/bar\` match karta hai par \`/foobar\` nahi.
- **\`Exact\`** — sirf exact path match karta hai.
- **\`ImplementationSpecific\`** — controller decide karta hai. ingress-nginx path ko ek regex ki tarah treat karta hai jab \`use-regex\` on hai.

Jab kai paths match karte hain, **sabse lamba** jeetta hai: \`/api\` \`/\` ko harata hai.

## IngressClass

\`spec.ingressClassName\` ek **IngressClass** resource ko name karta hai. \`nginx\` ka matlab "nginx controller ko ismein own karna chahiye; baaki sab ignore karein." Ek cluster kai controllers chala sakta hai. Ek Ingress jiski class koi installed controller claim nahi karta kuch nahi karta.

## TLS

Certificate aur key ko \`kubernetes.io/tls\` type ke ek Secret mein rakho, ise \`spec.tls[].secretName\` se reference karo, aur controller un hosts ke liye HTTPS serve karta hai aur ise terminate karta hai. Practice mein Secret **cert-manager** dwara automatically create aur rotate hota hai.

## Gateway API

**Gateway API** Ingress ka newer, more expressive successor hai, CRDs ke roop mein: ek \`GatewayClass\`, ek \`Gateway\` (ek listener — platform team owns), aur route objects (\`HTTPRoute\`, \`GRPCRoute\`) jo app teams own karti hain. Ye annotation soup ko header matching, traffic splitting, redirects ke liye typed fields se replace karta hai. Ingress deprecated nahi hai aur universally supported hai; Gateway API wahaan hai jahaan naya investment jaata hai.`,

    examples: [
      {
        title: 'Host-based routing: one entry point, one Host header decides the backend',
        titleHi: 'Host-based routing: ek entry point, ek Host header backend decide karta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m8l3-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

for app in shop blog; do
  kubectl -n "$ns" create deployment "$app" --image=registry.k8s.io/e2e-test-images/agnhost:2.47 -- /agnhost netexec --http-port=8080 >/dev/null
  kubectl -n "$ns" expose deployment "$app" --port=80 --target-port=8080 >/dev/null
done
kubectl -n "$ns" rollout status deploy/shop --timeout=120s >/dev/null
kubectl -n "$ns" rollout status deploy/blog --timeout=120s >/dev/null

cat <<YAML | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: site
spec:
  ingressClassName: nginx
  rules:
    - host: shop.example.com
      http:
        paths:
          - { path: /, pathType: Prefix, backend: { service: { name: shop, port: { number: 80 } } } }
    - host: blog.example.com
      http:
        paths:
          - { path: /, pathType: Prefix, backend: { service: { name: blog, port: { number: 80 } } } }
YAML
sleep 5

echo "--- ONE Ingress object, TWO hostnames, TWO Services ---"
kubectl -n "$ns" get ingress site -o jsonpath='{range .spec.rules[*]}{.host} -> {.http.paths[0].backend.service.name}{"\\n"}{end}'

C="http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
echo "--- from a client Pod: curl the SAME controller address, vary only the Host header ---"
kubectl -n "$ns" run c --image=curlimages/curl:8.10.1 --restart=Never --rm -i --quiet -- sh -c "
  echo \\"  Host: shop.example.com    -> svc \\$(curl -s -H 'Host: shop.example.com' \\$0/hostname | sed -E 's/-[a-z0-9]+-[a-z0-9]+\\$//')\\"
  echo \\"  Host: blog.example.com    -> svc \\$(curl -s -H 'Host: blog.example.com' \\$0/hostname | sed -E 's/-[a-z0-9]+-[a-z0-9]+\\$//')\\"
  echo \\"  Host: unknown.example.com -> HTTP \\$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: unknown.example.com' \\$0/)\\"
" "$C"`,
        output: `--- ONE Ingress object, TWO hostnames, TWO Services ---
shop.example.com -> shop
blog.example.com -> blog
--- from a client Pod: curl the SAME controller address, vary only the Host header ---
  Host: shop.example.com    -> svc shop
  Host: blog.example.com    -> svc blog
  Host: unknown.example.com -> HTTP 404`,
        explain: 'Two Deployments, each with its own ClusterIP Service, are placed behind a single Ingress object that has two rules keyed on the Host header. From a client Pod, every request goes to the exact same address — the Ingress controller\'s Service — and the only thing that changes between requests is the Host header. The controller reads that header, matches it against its rules, and forwards shop.example.com to the shop Service and blog.example.com to the blog Service. A request with a hostname that matches no rule gets a 404 straight from the controller, because there is no default backend configured for it. This is name-based virtual hosting: any number of hostnames share one external IP and one TLS-terminating proxy, and each is routed to its own in-cluster Service. Replacing this with one LoadBalancer Service per hostname would mean one cloud load balancer and one public IP per site.',
        explainHi: 'Do Deployments, har ek apne ClusterIP Service ke saath, ek single Ingress object ke peeche rakhe jaate hain jiske do rules Host header par keyed hain. Ek client Pod se, har request bilkul same address par jaati hai — Ingress controller ka Service — aur requests ke beech sirf Host header badalta hai. Controller wo header padhta hai, ise apne rules se match karta hai, aur shop.example.com ko shop Service aur blog.example.com ko blog Service par forward karta hai. Ek hostname jo kisi rule se match nahi karta ise controller se seedhe 404 milta hai. Ye name-based virtual hosting hai: koi bhi sankhya mein hostnames ek external IP aur ek TLS-terminating proxy share karte hain.',
      },
      {
        title: 'Path fanout + the controller requirement: an Ingress with an unowned class does nothing',
        titleHi: 'Path fanout + controller requirement: ek unowned class wala Ingress kuch nahi karta',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m8l3b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

for app in api web; do
  kubectl -n "$ns" create deployment "$app" --image=registry.k8s.io/e2e-test-images/agnhost:2.47 -- /agnhost netexec --http-port=8080 >/dev/null
  kubectl -n "$ns" expose deployment "$app" --port=80 --target-port=8080 >/dev/null
done
kubectl -n "$ns" rollout status deploy/api --timeout=120s >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=120s >/dev/null

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: site-api
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  ingressClassName: nginx
  rules:
    - host: app.example.com
      http:
        paths:
          - { path: /api(/|$)(.*), pathType: ImplementationSpecific, backend: { service: { name: api, port: { number: 80 } } } }
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata: { name: site-web }
spec:
  ingressClassName: nginx
  rules:
    - host: app.example.com
      http:
        paths:
          - { path: /, pathType: Prefix, backend: { service: { name: web, port: { number: 80 } } } }
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata: { name: orphan }
spec:
  ingressClassName: traefik-not-installed
  rules:
    - host: orphan.example.com
      http:
        paths:
          - { path: /, pathType: Prefix, backend: { service: { name: web, port: { number: 80 } } } }
YAML
sleep 6

C="http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
echo "--- ONE host app.example.com, path fanout (/api rewritten to / on the api Service) ---"
kubectl -n "$ns" run c --image=curlimages/curl:8.10.1 --restart=Never --rm -i --quiet -- sh -c "
  echo \\"  /hostname       -> svc \\$(curl -s -H 'Host: app.example.com' \\$0/hostname     | sed -E 's/-[a-z0-9]+-[a-z0-9]+\\$//')   (matched '/'    -> web)\\"
  echo \\"  /api/hostname   -> svc \\$(curl -s -H 'Host: app.example.com' \\$0/api/hostname | sed -E 's/-[a-z0-9]+-[a-z0-9]+\\$//')   (matched '/api' -> api)\\"
  echo \\"  Host orphan.example.com -> HTTP \\$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: orphan.example.com' \\$0/)   (class no controller owns)\\"
" "$C"
echo "--- all three Ingresses are valid API objects; the nginx controller acted on two ---"
kubectl -n "$ns" get ingress --no-headers -o custom-columns=NAME:.metadata.name,CLASS:.spec.ingressClassName | sed -E 's/ +/ /g'`,
        output: `--- ONE host app.example.com, path fanout (/api rewritten to / on the api Service) ---
  /hostname       -> svc web   (matched '/'    -> web)
  /api/hostname   -> svc api   (matched '/api' -> api)
  Host orphan.example.com -> HTTP 404   (class no controller owns)
--- all three Ingresses are valid API objects; the nginx controller acted on two ---
orphan traefik-not-installed
site-api nginx
site-web nginx`,
        explain: 'One hostname is split across two backends by URL path, using two Ingress objects that share the host. A request to the root path matches the "/" prefix rule and is routed to the web Service; a request to "/api/hostname" matches the longer "/api" rule and is routed to the api Service, with a rewrite annotation stripping the "/api" prefix before the request reaches the backend. When both a short and a long path match, the longer one wins. The third Ingress, "orphan", is a well-formed object that the API server accepts, but its ingressClassName names a controller that is not running in this cluster, so nothing ever reads it and turns it into proxy configuration — a request for its hostname 404s exactly as if the Ingress did not exist. The listing at the end confirms all three objects are present; the distinction is not whether the object exists but whether a controller claimed its class. An Ingress with a class no controller owns is the most common cause of a route that "should work" but returns 404.',
        explainHi: 'Ek hostname URL path se do backends mein split kiya jaata hai, do Ingress objects use karke jo host share karte hain. Root path ki ek request "/" prefix rule se match karti hai aur web Service par route hoti hai; "/api/hostname" ki ek request lambe "/api" rule se match karti hai aur api Service par route hoti hai, ek rewrite annotation ke saath jo "/api" prefix strip karta hai. Jab ek chhota aur ek lamba path dono match karte hain, lamba jeetta hai. Teesra Ingress, "orphan", ek well-formed object hai jise API server accept karta hai, par iska ingressClassName ek controller ko name karta hai jo is cluster mein nahi chal raha, to koi kabhi ise padhta nahi. Ek Ingress jiski class koi controller own nahi karta ek route jo "kaam karna chahiye" par 404 return karti hai iska sabse common kaaran hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# expecting an Ingress object alone to route traffic
$ kubectl apply -f ingress.yaml
  ingress.networking.k8s.io/site created
$ curl -H 'Host: shop.example.com' http://<node-ip>/
  curl: (7) Failed to connect  ...   or a 404 from nothing
# "Ingress is broken" — no. there is NO CONTROLLER. the object is just a row in etcd.`,
        right: `# an Ingress needs a CONTROLLER running. install one, and expose IT:
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/.../deploy.yaml
$ kubectl get pods -n ingress-nginx            # the controller Deployment is Running
$ kubectl get svc  -n ingress-nginx            # ONE Service (LoadBalancer/NodePort) = the entry point
$ kubectl get ingressclass                     # 'nginx' now exists
# THEN Ingress objects with ingressClassName: nginx get turned into nginx.conf and served.
# managed clusters: GKE/EKS/AKS each have their own controller to enable or install.`,
        why: 'An Ingress object is only a declarative resource stored in the cluster\'s database. Nothing in the Kubernetes control plane acts on it directly. Turning those rules into actual HTTP routing requires an Ingress controller — a running Deployment, usually a reverse proxy such as nginx together with control logic — that watches Ingress objects, generates proxy configuration from them, and is itself exposed to the outside through a single Service of type LoadBalancer or NodePort. Until such a controller is installed and its Service is reachable, applying an Ingress produces a resource that no component consumes, and requests either fail to connect or return 404. The fix is to install a controller appropriate to the environment — ingress-nginx on a self-managed cluster, or the cloud provider\'s controller on a managed one — confirm its Pods are running and its Service has an address, and only then expect Ingress objects that name its class to take effect.',
        whyHi: 'Ek Ingress object sirf ek declarative resource hai jo cluster ke database mein stored hai. Kubernetes control plane mein kuch bhi ispar directly act nahi karta. Un rules ko actual HTTP routing mein badalne ke liye ek Ingress controller chahiye — ek running Deployment, usually ek reverse proxy jaise nginx control logic ke saath — jo Ingress objects watch karta hai, unse proxy configuration generate karta hai, aur khud ek single Service type LoadBalancer ya NodePort ke through outside ko exposed hai. Jab tak aisa controller install nahi hai, ek Ingress apply karna ek resource banata hai jise koi component consume nahi karta. Fix environment ke liye appropriate controller install karna hai.',
      },
      {
        wrong: `# a per-Ingress rewrite annotation that also mangles the OTHER path rules
metadata:
  name: everything
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2      # for the /api(/|$)(.*) rule
spec:
  rules:
    - host: app.example.com
      http:
        paths:
          - { path: /api(/|$)(.*), ... backend: api }
          - { path: /,             ... backend: web }    # <- ALSO gets rewrite-target /$2 !
# result: '/dashboard' on the web app is rewritten to '/' (capture group $2 is empty).
# the whole SPA breaks and it looks like a frontend bug.`,
        right: `# annotations are PER-INGRESS-OBJECT. isolate rules that need different behaviour:
#   Ingress 'app-api'  -> annotation rewrite-target: /$2 ,  path /api(/|$)(.*)
#   Ingress 'app-web'  -> NO rewrite annotation         ,  path /
# both can share  host: app.example.com  — the controller merges them.
# or use a controller/Gateway-API feature that scopes rewrites per-rule (e.g. Gateway
# API 'URLRewrite' filter on one HTTPRoute rule only).`,
        why: 'Annotations on an Ingress apply to the entire object, not to a single path within it. A rewrite-target annotation added for one regex path is therefore also applied to every other path rule in the same Ingress, including a catch-all prefix rule for the application\'s frontend. For those other paths, the capture groups referenced by the rewrite target do not exist or are empty, so their URLs are rewritten to something unintended — commonly the site root — and the application behaves as if its routing is broken while the actual cause is the shared annotation. The way to keep per-rule behaviour distinct is to split the rules into separate Ingress objects, one carrying the rewrite annotation and matching only the path that needs it, the other carrying no such annotation; both may use the same hostname and the controller combines them. Gateway API avoids the problem structurally by attaching filters such as URL rewriting to an individual route rule rather than to the whole object.',
        whyHi: 'Ek Ingress par annotations poore object par apply hote hain, ismein ek single path par nahi. Ek rewrite-target annotation jo ek regex path ke liye add kiya gaya isliye same Ingress ke har doosre path rule par bhi apply hota hai, application ke frontend ke liye ek catch-all prefix rule sameth. Un doosre paths ke liye, rewrite target dwara referenced capture groups exist nahi karte ya empty hain, to unke URLs kuch unintended mein rewrite hote hain — commonly site root — aur application aisa behave karta hai jaise iska routing toota hai. Per-rule behaviour distinct rakhne ka tarika rules ko alag Ingress objects mein split karna hai.',
      },
      {
        wrong: `# assuming pathType: Prefix does substring matching
paths:
  - path: /app
    pathType: Prefix
    backend: { service: { name: frontend, ... } }
# expecting this to also catch  /application  and  /app-v2  ... it does NOT.
# and assuming '/' with pathType: Exact will match '/anything' — it matches ONLY '/'.`,
        right: `# Prefix matches PATH ELEMENTS split on '/', not raw substring:
#   path: /app  (Prefix)  matches  /app , /app/ , /app/x/y      NOT /application
#   path: /app  (Exact)   matches  /app                          ONLY
#   need regex ('/app.*') -> pathType: ImplementationSpecific + the controller's regex
//   support (ingress-nginx: 'nginx.ingress.kubernetes.io/use-regex: "true"')
# longest matching path wins when several match. put the catch-all '/' LAST conceptually
# (order in YAML doesn't matter — specificity does).`,
        why: 'With pathType Prefix, the request path and the rule path are both split on the slash character and compared one path element at a time. The rule /app matches the request /app and any request whose path begins with the element app followed by a slash, such as /app/ or /app/settings, but it does not match /application or /app-v2, because application and app-v2 are different path elements from app. This is deliberately not substring matching. pathType Exact matches only the one identical path and nothing beneath it. Matching by regular expression — for instance to treat /app and everything under a differently-spelled prefix the same way — requires pathType ImplementationSpecific together with whatever regex support the controller provides, which for ingress-nginx means enabling the use-regex annotation. When several rules match a request, the one with the longest matching path is chosen regardless of the order they appear in the manifest.',
        whyHi: 'pathType Prefix ke saath, request path aur rule path dono slash character par split hote hain aur ek path element ek baar compare hote hain. Rule /app request /app aur koi bhi request jiska path element app ke baad ek slash se shuru hota hai match karta hai, jaise /app/ ya /app/settings, par ye /application ya /app-v2 match nahi karta, kyunki application aur app-v2 app se alag path elements hain. Ye jaan-boojhkar substring matching nahi hai. pathType Exact sirf ek identical path match karta hai. Regular expression se matching ke liye pathType ImplementationSpecific chahiye controller ke regex support ke saath. Jab kai rules match karte hain, sabse lambe matching path wala chuna jaata hai chahe wo manifest mein kis order mein ho.',
      },
    ],

    realWorld: [
      {
        en: '**A staging cluster with 22 `type: LoadBalancer` Services** at ~$18/mo each. Replaced with one ingress-nginx (a single LoadBalancer) + 22 Ingress objects on subdomains; cert-manager issued one wildcard cert. The LB bill went from ~$400/mo to ~$18/mo.',
        hi: '**Ek staging cluster jismein 22 `type: LoadBalancer` Services** ~$18/mo har. Ek ingress-nginx + 22 Ingress objects se replace kiya.',
      },
      {
        en: '**"The whole dashboard 404s after we added the API route."** A `rewrite-target` annotation on the shared Ingress rewrote every frontend deep link to `/`. Split into two Ingress objects — one with the rewrite for `/api`, one plain for `/` — and it was fixed.',
        hi: '**"API route add karne ke baad poora dashboard 404 karta hai."** Shared Ingress par ek `rewrite-target` annotation ne har frontend deep link ko `/` mein rewrite kiya. Do Ingress objects mein split kiya.',
      },
      {
        en: '**A route that 404\'d for a day** because someone set `ingressClassName: nginx-internal` but the cluster only ran the `nginx` class. `kubectl describe ingress` showed no events and no address — no controller had claimed it.',
        hi: '**Ek route jo ek din 404 kiya** kyunki kisi ne `ingressClassName: nginx-internal` set kiya par cluster sirf `nginx` class chalata tha. `kubectl describe ingress` ne koi events nahi dikhaye.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between an Ingress and an Ingress controller, and what happens if you create an Ingress with no controller installed?',
        qHi: 'Ek Ingress aur ek Ingress controller mein kya farak hai, aur agar aap bina controller ke ek Ingress banate ho to kya hota hai?',
        a: 'An Ingress is an API object — a declarative set of HTTP routing rules: match on Host header, match on URL path, point each match at a backend Service, optionally terminate TLS using a named Secret, and select a controller with ingressClassName. It has no behaviour of its own; it is configuration stored in the cluster. An Ingress controller is a running workload — a Deployment of a reverse proxy such as nginx, Traefik, or HAProxy, plus control logic — that watches all Ingress objects across the cluster, compiles them into real proxy configuration, reloads the proxy on every change, and is itself exposed to the outside world through exactly one Service, usually type LoadBalancer on a cloud or NodePort on bare metal. So the Ingress is the rulebook and the controller is the thing that reads it and enforces it. If you create an Ingress with no controller installed, nothing consumes the object. It sits in the database, kubectl get ingress shows it with no address, kubectl describe shows no events, and every request for its hostnames either fails to connect or returns 404. The same happens if a controller is installed but the Ingress names an ingressClassName that no installed controller claims.',
        aHi: 'Ek Ingress ek API object hai — HTTP routing rules ka ek declarative set: Host header par match, URL path par match, har match ko ek backend Service par point karo, optionally ek named Secret use karke TLS terminate karo, aur ingressClassName se ek controller select karo. Iska apna koi behaviour nahi hai. Ek Ingress controller ek running workload hai — nginx, Traefik jaise ek reverse proxy ka Deployment, plus control logic — jo cluster mein saare Ingress objects watch karta hai, unhe real proxy configuration mein compile karta hai, har change par proxy reload karta hai, aur khud theek ek Service ke through outside world ko exposed hai. To Ingress rulebook hai aur controller wo cheez hai jo ise padhti aur enforce karti hai. Agar aap bina controller ke ek Ingress banate ho, koi object consume nahi karta. Ye database mein baithta hai, kubectl get ingress ise bina address ke dikhata hai, aur har request 404 return karti hai.',
      },
      {
        q: 'You have ten HTTP microservices to expose publicly. Compare using ten LoadBalancer Services versus one Ingress, and explain how requests reach the right Pod.',
        qHi: 'Aapke paas publicly expose karne ke liye das HTTP microservices hain. Das LoadBalancer Services versus ek Ingress compare karo.',
        a: 'Ten LoadBalancer Services means, on a cloud, ten separate external load balancers, ten public IPs, ten monthly bills, and ten independent TLS configurations, with no way to share a hostname or route by path — each service is simply on its own address. One Ingress means a single Ingress controller exposed by one LoadBalancer Service, so one external load balancer and one public IP for all ten services, with the ten application Services left as internal ClusterIP. Ingress objects then declare that api.example.com goes to the api Service, app.example.com goes to the frontend Service, example.com/admin goes to the admin Service, and so on, and TLS is terminated once at the controller, typically with certificates issued automatically by cert-manager. A request arrives at the cloud load balancer, which forwards it to the ingress controller Pods. The controller terminates TLS, reads the Host header and URL path, matches them against its compiled rules to pick a backend, then forwards the request — usually straight to a Ready Pod IP that it learned from the backend Service\'s EndpointSlices, using the Service only as a grouping. The result is one entry point, one bill, central TLS and L7 policy, and the same Pod-level load balancing underneath.',
        aHi: 'Das LoadBalancer Services ka matlab, ek cloud par, das alag external load balancers, das public IPs, das monthly bills, aur das independent TLS configurations, ek hostname share karne ya path se route karne ke koi tarike ke bina. Ek Ingress ka matlab ek single Ingress controller jo ek LoadBalancer Service se exposed hai, to saare das services ke liye ek external load balancer aur ek public IP, das application Services internal ClusterIP ke roop mein chhode gaye. Ingress objects phir declare karte hain ki api.example.com api Service par jaata hai, aur TLS ek baar controller par terminate hota hai. Ek request cloud load balancer par aati hai, jo ise ingress controller Pods par forward karta hai. Controller TLS terminate karta hai, Host header aur URL path padhta hai, unhe apne compiled rules se match karta hai ek backend chunne ke liye, phir request forward karta hai — usually seedhe ek Ready Pod IP par.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain the two-part Ingress model (object vs controller), listing the three things a controller does, and what a request 404s for when the object exists but nothing serves it.',
        taskHi: 'Ek comment mein, do-hissa Ingress model samjhao (object vs controller).',
        hint: 'AN INGRESS OBJECT = a declarative API resource: rules matching on `spec.rules[].host` (Host header) and `spec.rules[].http.paths[]` (URL path), each `backend` pointing at a ClusterIP Service; optional `spec.tls[]` (hostnames + a `kubernetes.io/tls` Secret name); `spec.ingressClassName` (which controller); controller-specific `annotations`. It DOES NOTHING alone — it is just config in etcd. AN INGRESS CONTROLLER = a running Deployment (ingress-nginx / Traefik / HAProxy / a cloud one) that (1) WATCHES all Ingress objects + Services + EndpointSlices cluster-wide; (2) GENERATES a reverse-proxy config from them (an `nginx.conf` with an upstream per Service, server/location blocks per host/path) and reloads on every change; (3) is itself EXPOSED by exactly ONE Service (`type: LoadBalancer` on a cloud = one LB + one public IP for the whole cluster, or NodePort on bare metal/kind). NO CONTROLLER (or an `ingressClassName` no installed controller claims) → the object sits inert, `kubectl get ingress` shows no ADDRESS, `describe` shows no events, every request 404s.',
        hintHi: 'EK INGRESS OBJECT = ek declarative API resource: `spec.rules[].host` (Host header) aur `spec.rules[].http.paths[]` (URL path) par matching rules, har `backend` ek ClusterIP Service par; optional `spec.tls[]`; `spec.ingressClassName`; controller-specific `annotations`. Ye AKELE KUCH NAHI karta. EK INGRESS CONTROLLER = ek running Deployment jo (1) cluster-wide saare Ingress objects WATCH karta hai; (2) unse ek reverse-proxy config GENERATE karta hai aur har change par reload karta hai; (3) khud theek EK Service se EXPOSED hai. KOI CONTROLLER NAHI → object inert baithta hai, har request 404 karti hai.',
      },
      {
        task: 'In a comment, describe the three `pathType` values with an example match for each, and state the tie-break rule when multiple paths match.',
        taskHi: 'Ek comment mein, teen `pathType` values describe karo.',
        hint: 'PREFIX — the request path and rule path are BOTH split on `/` and matched ELEMENT BY ELEMENT (not raw substring). `path: /app` matches `/app`, `/app/`, `/app/x/y` — but NOT `/application` or `/app-v2` (different path elements). EXACT — matches ONLY the one identical path, case-sensitive: `path: /app` matches `/app` and nothing under it. IMPLEMENTATIONSPECIFIC — the controller decides; ingress-nginx treats the path as a REGEX when `nginx.ingress.kubernetes.io/use-regex: "true"` (or a `rewrite-target` with capture groups is set), e.g. `path: /api(/|$)(.*)` with `rewrite-target: /$2`. TIE-BREAK: when several rules match one request, the LONGEST matching path wins — `/api` beats `/` — regardless of the order they appear in the YAML. (Also: `rewrite-target` and other annotations are PER-INGRESS-OBJECT, so a rule that needs a rewrite and a plain catch-all `/` rule should live in SEPARATE Ingress objects sharing the same host.)',
        hintHi: 'PREFIX — request path aur rule path DONO `/` par split hote hain aur ELEMENT BY ELEMENT match hote hain. `path: /app` `/app`, `/app/`, `/app/x/y` match karta hai — par `/application` NAHI. EXACT — SIRF ek identical path match karta hai. IMPLEMENTATIONSPECIFIC — controller decide karta hai; ingress-nginx path ko ek REGEX ki tarah treat karta hai jab `use-regex: "true"`. TIE-BREAK: jab kai rules match karte hain, SABSE LAMBA matching path jeetta hai — `/api` `/` ko harata hai — chahe YAML mein kis order mein ho.',
      },
      {
        task: 'In a comment, explain what IngressClass is for, how one cluster runs multiple controllers, and how TLS termination works (including cert-manager\'s role). Add a one-line note on Gateway API.',
        taskHi: 'Ek comment mein, IngressClass kis liye hai samjhao, aur TLS termination kaise kaam karta hai.',
        hint: 'INGRESSCLASS: `spec.ingressClassName: nginx` names an IngressClass resource that identifies ONE controller — it tells the nginx controller "own this" and every other controller "ignore this". ONE cluster can run SEVERAL controllers — a common split is an `external` nginx on a public LoadBalancer and an `internal` nginx on a private one; each Ingress picks its class. An IngressClass annotated `ingressclass.kubernetes.io/is-default-class: "true"` claims Ingresses that name NO class. TLS TERMINATION: put the cert + key in a Secret of type `kubernetes.io/tls` (keys `tls.crt`, `tls.key`), reference it from `spec.tls[].secretName` with its hostnames; the controller serves HTTPS for those hosts and TERMINATES it — the hop from controller to Pod is plain HTTP INSIDE the cluster. In practice CERT-MANAGER creates and rotates that Secret automatically, talking to Let\'s Encrypt or an internal CA and renewing before expiry. GATEWAY API: the typed successor to Ingress — `GatewayClass` / `Gateway` (listener, owned by the platform team) + `HTTPRoute`/`GRPCRoute` (owned by app teams), replacing annotation soup with typed fields and RBAC role-separation; Ingress stays supported, Gateway API is where new work goes.',
        hintHi: 'INGRESSCLASS: `spec.ingressClassName: nginx` ek IngressClass resource ko name karta hai jo EK controller identify karta hai. EK cluster KAI controllers chala sakta hai — ek `external` nginx public LoadBalancer par aur ek `internal` nginx private par. TLS TERMINATION: cert + key ko `kubernetes.io/tls` type ke ek Secret mein rakho, ise `spec.tls[].secretName` se reference karo; controller un hosts ke liye HTTPS serve karta hai aur ise TERMINATE karta hai — controller se Pod tak hop cluster ke ANDAR plain HTTP hai. Practice mein CERT-MANAGER wo Secret automatically create aur rotate karta hai. GATEWAY API: Ingress ka typed successor — `Gateway` (platform team) + `HTTPRoute` (app teams).',
      },
    ],

    keyTakeaways: [
      'A SERVICE routes at L4 (IP + port only) — it cannot read an HTTP request, so it cannot do host-based routing, path-based routing, or TLS termination. AN INGRESS is an HTTP-aware rule set: `spec.rules[].host` (match the Host header), `spec.rules[].http.paths[]` (match the URL path, each → a backend ClusterIP Service), `spec.tls[]` (hostnames + a `kubernetes.io/tls` Secret → HTTPS terminates at the controller), `spec.ingressClassName` (which controller), and controller-specific `annotations` (rewrites, redirects, auth, rate limits — NOT portable between controllers).',
      'THE TWO-PART MODEL: the Ingress OBJECT is inert config in etcd — it DOES NOTHING alone. An Ingress CONTROLLER (ingress-nginx / Traefik / HAProxy / a cloud one) is a running Deployment that (1) watches all Ingress + Service + EndpointSlice objects cluster-wide, (2) compiles them into a live reverse-proxy config (`nginx.conf`) and reloads on every change, (3) is itself exposed by exactly ONE Service — `type: LoadBalancer` (one cloud LB + one public IP for the whole cluster) or NodePort. NO CONTROLLER INSTALLED, or an `ingressClassName` no installed controller claims → the object has no ADDRESS, `describe` shows no events, every request 404s. This is the #1 "my route should work but 404s" cause.',
      'WHAT INGRESS BUYS OVER PER-APP LoadBalancer SERVICES: host-based routing (`shop.example.com` + `api.example.com` → ONE IP, different Services), path-based routing (`/` → web, `/api` → api), TLS termination once at the controller (cert in a Secret, usually issued + rotated by cert-manager via Let\'s Encrypt/an internal CA), ONE LoadBalancer + one public IP + one bill for many apps (vs one LB per app), and L7 features via annotations. The classic anti-pattern is 20+ `type: LoadBalancer` Services (one per microservice) — consolidate to one ingress controller + N ClusterIP Services + Ingress objects.',
      '`pathType`: PREFIX splits both paths on `/` and matches ELEMENT BY ELEMENT — `/app` matches `/app` + `/app/x` but NOT `/application` (not substring matching). EXACT matches ONLY the identical path. IMPLEMENTATIONSPECIFIC = the controller decides (ingress-nginx: regex, needs `use-regex` or a `rewrite-target`). When several paths match, the LONGEST wins (`/api` beats `/`), regardless of YAML order. GOTCHA: annotations like `rewrite-target` are PER-INGRESS-OBJECT — a rewrite rule and a plain catch-all `/` rule belong in SEPARATE Ingress objects (sharing the host) or the rewrite mangles the other paths.',
      'INGRESSCLASS: `spec.ingressClassName` names an IngressClass that identifies one controller ("this is mine, everyone else ignore it"). One cluster can run several (common: `external` nginx on a public LB + `internal` nginx on a private one). An IngressClass annotated `is-default-class: "true"` claims Ingresses naming no class. GATEWAY API is the typed successor: `GatewayClass` / `Gateway` (a listener — ports/protocols/TLS — owned by the platform team) + `HTTPRoute`/`GRPCRoute`/`TCPRoute` (owned by app teams), replacing annotation soup with typed fields (header matching, traffic splitting, redirects, mirroring) and proper RBAC role-separation. Ingress is stable and universal; Gateway API is where new investment goes.',
    ],
    keyTakeawaysHi: [
      'EK SERVICE L4 par route karta hai (sirf IP + port) — ye ek HTTP request padh nahi sakta, to ye host-based routing, path-based routing, ya TLS termination nahi kar sakta. EK INGRESS ek HTTP-aware rule set hai: `spec.rules[].host` (Host header match), `spec.rules[].http.paths[]` (URL path match, har ek → ek backend ClusterIP Service), `spec.tls[]` (hostnames + ek `kubernetes.io/tls` Secret → HTTPS controller par terminate hota hai), `spec.ingressClassName`, aur controller-specific `annotations` (controllers ke beech portable NAHI).',
      'DO-HISSA MODEL: Ingress OBJECT etcd mein inert config hai — AKELE KUCH NAHI karta. Ek Ingress CONTROLLER (ingress-nginx / Traefik / cloud) ek running Deployment hai jo (1) cluster-wide saare Ingress + Service + EndpointSlice objects watch karta hai, (2) unhe ek live reverse-proxy config mein compile karta hai aur har change par reload karta hai, (3) khud theek EK Service se exposed hai — `type: LoadBalancer` ya NodePort. KOI CONTROLLER NAHI, ya ek `ingressClassName` jo koi installed controller claim nahi karta → object ka koi ADDRESS nahi, har request 404 karti hai. Ye #1 "mera route kaam karna chahiye par 404 karta hai" kaaran hai.',
      'INGRESS PER-APP LoadBalancer SERVICES ke upar KYA DETA HAI: host-based routing (`shop...` + `api...` → EK IP), path-based routing (`/` → web, `/api` → api), TLS termination ek baar controller par (cert ek Secret mein, usually cert-manager dwara issued + rotated), EK LoadBalancer + ek public IP + ek bill kai apps ke liye, aur annotations ke through L7 features. Classic anti-pattern 20+ `type: LoadBalancer` Services hai — ek ingress controller + N ClusterIP Services par consolidate karo.',
      '`pathType`: PREFIX dono paths ko `/` par split karta hai aur ELEMENT BY ELEMENT match karta hai — `/app` `/app` + `/app/x` match karta hai par `/application` NAHI. EXACT SIRF identical path match karta hai. IMPLEMENTATIONSPECIFIC = controller decide karta hai (ingress-nginx: regex). Jab kai paths match karte hain, SABSE LAMBA jeetta hai (`/api` `/` ko harata hai), YAML order ki parwah kiye bina. GOTCHA: `rewrite-target` jaise annotations PER-INGRESS-OBJECT hain — ek rewrite rule aur ek plain catch-all `/` rule ALAG Ingress objects mein hone chahiye.',
      'INGRESSCLASS: `spec.ingressClassName` ek IngressClass ko name karta hai jo ek controller identify karta hai ("ye mera hai, baaki sab ignore karo"). Ek cluster kai chala sakta hai (`external` nginx public LB par + `internal` nginx private par). GATEWAY API typed successor hai: `Gateway` (ek listener — platform team owns) + `HTTPRoute`/`GRPCRoute` (app teams own), annotation soup ko typed fields se replace karta hai aur proper RBAC role-separation. Ingress stable aur universal hai; Gateway API wahaan hai jahaan naya investment jaata hai.',
    ],
  },
];
