import type { CourseLesson } from './course-js-module1';

// DevOps Module 20 — GitOps, Platform Engineering, FinOps & Choosing Your Stack (part 1 of 2). L4-6 in course-devops-module20-part2.ts.
// This is the FINAL module of the DevOps course. ALL PROSE — the examples are realistic hand-written CLI output
// (argocd, kubectl, cost reports, decision tables), not `# VERIFY` blocks. The reasoning and the recap are the content.

export const DEVOPS_MODULE_20: CourseLesson[] = [
  {
    slug: 'ops-gitops-declarative-versioned-pulled-reconciled',
    title: 'GitOps: Declarative, Versioned, Pulled, Reconciled',
    titleHi: 'GitOps: Declarative, Versioned, Pulled, Reconciled',
    description:
      'GitOps is the reconciliation loop from Module 7 applied to delivery: the desired state of the whole system lives in git as declarative config, an in-cluster agent continuously pulls that state and makes reality match it, and drift is detected and corrected automatically. This lesson covers the four principles, why pull beats push for deployment, what Argo CD and Flux actually do, and how self-heal and drift detection change day-to-day operations.',
    descriptionHi:
      'GitOps Module 7 se reconciliation loop hai jo delivery par apply kiya gaya: poore system ka desired state git mein declarative config ke roop mein rehता hai, ek in-cluster agent continuously us state ko pull karता hai aur reality ko match karवाता hai, aur drift automatically detect aur correct hoता hai. Ye lesson chaar principles cover karता hai, kyun pull deployment ke liye push se behtar hai, Argo CD aur Flux actually kya karते hain, aur self-heal aur drift detection roz-ba-roz operations kaise badalते hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A thermostat versus walking over to the furnace and turning a dial.** Pushing a deployment is walking to the furnace: you decide it is cold, you go to the machine, you turn the dial up, and you hope you remember where you left it and that nobody else touched it. GitOps is a thermostat: you write the target temperature on the dial once (that is git), and a device on the wall reads that number continuously, checks the actual room temperature, and drives the furnace to close the gap — forever, without you. If someone opens a window (drift), the thermostat notices and compensates. If you want a different temperature, you change the number on the dial, not the furnace. The desired state is declared in one place; a control loop makes reality match it.',
      hi: '**Ek thermostat versus furnace ke paas jaकर ek dial ghumाना.** Ek deployment push karना furnace ke paas jaना hai: aap decide karते ho ki thanda hai, aap machine ke paas jaते ho, aap dial upar karते ho, aur aap ummeed karते ho ki aapko yaad hai aapne ise kahaan chhoड़a aur kisi aur ne ise touch nahi kiya. GitOps ek thermostat hai: aap target temperature ko dial par ek baar likhते ho (wo git hai), aur wall par ek device us number ko continuously padhता hai, actual room temperature check karता hai, aur furnace ko gap close karने ke liye drive karта hai — hamesha ke liye, aapke bina. Agar koi ek window kholता hai (drift), thermostat notice karता hai aur compensate karता hai.',
    },

    simple: `**GITOPS = the reconciliation loop (Module 7) applied to DELIVERY.**
four principles (from the OpenGitOps project):
\`\`\`
1. DECLARATIVE   the whole system's desired state is expressed as config, not
                 as a script of steps. "3 replicas of image X" - not "run these commands".
2. VERSIONED + IMMUTABLE   that state lives in git. every change is a commit:
                 reviewed, attributed, timestamped, revertable. git is the source of truth.
3. PULLED AUTOMATICALLY   an agent IN the target environment pulls the desired
                 state from git. nothing outside pushes INTO the cluster.
4. CONTINUOUSLY RECONCILED   the agent constantly compares desired (git) to actual
                 (cluster) and corrects any difference. drift is self-healed.
\`\`\`

**PUSH vs PULL deployment:**
\`\`\`
PUSH (classic CD):  CI, after building, runs 'kubectl apply' / 'helm upgrade'
   against the cluster. this means:
   - CI holds cluster CREDENTIALS (prod kubeconfig in the pipeline - Module 18 L1)
   - the cluster is only as up-to-date as the last successful pipeline run
   - drift (a manual 'kubectl edit') is invisible + persists
   - N clusters = N sets of creds in CI, N pipelines
PULL (GitOps):  an in-cluster agent (Argo CD / Flux) reads git and applies it
   FROM INSIDE. this means:
   - NO external system has cluster write creds. the agent's RBAC is scoped + local.
   - the cluster continuously converges on git - even after a node rebuild
   - drift is detected (and optionally auto-reverted)
   - a new cluster just needs the agent + a pointer to the git path
\`\`\`

**WHAT ARGO CD / FLUX ACTUALLY DO:**
\`\`\`
- watch one or more git repos (+ Helm/Kustomize/plain YAML/jsonnet)
- render the manifests, diff against live cluster state
- SYNC: apply the diff (manual click, or automated)
- report per-resource: Synced / OutOfSync, Healthy / Degraded / Progressing
- Argo CD: a UI + API + app-of-apps + SSO + multi-cluster from one control plane
- Flux: a set of controllers (source / kustomize / helm / image / notification),
  CRD-driven, no UI of its own (use Weave GitOps / Capacitor)
\`\`\`

**SELF-HEAL + DRIFT DETECTION change operations:**
\`\`\`
- 'kubectl edit deploy' in prod -> Argo shows OutOfSync -> (if self-heal on)
  reverted within the sync interval. the ONLY way to change prod is a git commit.
- a deleted resource is recreated. a fat-fingered scale-to-0 is undone.
- rollback = 'git revert' + sync (or Argo's "rollback to a previous Sync").
- incident: "what is deployed?" = "read git at this SHA". no drift to reconstruct.
- the trade: you MUST commit even small/urgent changes. break-glass = a documented,
  audited path to disable self-heal briefly (and it's noisy on purpose).
\`\`\``,

    simpleHi: `**GITOPS = reconciliation loop (Module 7) DELIVERY par apply kiya gaya.**
chaar principles (OpenGitOps project se):
\`\`\`
1. DECLARATIVE   poore system ka desired state config ke roop mein express kiya, steps
                 ke ek script ke roop mein nahi. "image X ke 3 replicas" - "ye commands chalाओ" nahi.
2. VERSIONED + IMMUTABLE   wo state git mein rehता hai. har change ek commit: reviewed,
                 attributed, timestamped, revertable. git source of truth hai.
3. PULLED AUTOMATICALLY   target environment MEIN ek agent git se desired state pull
                 karता hai. cluster ke andar kुछ bahar se push nahi karता.
4. CONTINUOUSLY RECONCILED   agent constantly desired (git) ko actual (cluster) se
                 compare karता hai aur kisi bhi difference ko correct karता hai. drift self-healed.
\`\`\`

**PUSH vs PULL deployment:**
\`\`\`
PUSH (classic CD):  CI, build karने ke baad, cluster ke against 'kubectl apply' /
   'helm upgrade' chalाता hai. iska matlab:
   - CI cluster CREDENTIALS rakhता hai (pipeline mein prod kubeconfig - Module 18 L1)
   - cluster sirf last successful pipeline run jitna up-to-date hai
   - drift (ek manual 'kubectl edit') invisible + persist karता hai
   - N clusters = CI mein N sets of creds, N pipelines
PULL (GitOps):  ek in-cluster agent (Argo CD / Flux) git padhता hai aur ise ANDAR SE
   apply karता hai. iska matlab:
   - KOI external system ke paas cluster write creds nahi. agent ki RBAC scoped + local.
   - cluster continuously git par converge karता hai - ek node rebuild ke baad bhi
   - drift detect hoता hai (aur optionally auto-reverted)
   - ek naye cluster ko sirf agent + git path ka ek pointer chahिए
\`\`\`

**ARGO CD / FLUX ACTUALLY KYA KARTE HAIN:**
\`\`\`
- ek ya zyada git repos watch karते hain (+ Helm/Kustomize/plain YAML/jsonnet)
- manifests render karते hain, live cluster state ke against diff karते hain
- SYNC: diff apply karते hain (manual click, ya automated)
- per-resource report: Synced / OutOfSync, Healthy / Degraded / Progressing
- Argo CD: ek UI + API + app-of-apps + SSO + ek control plane se multi-cluster
- Flux: controllers ka ek set (source / kustomize / helm / image / notification),
  CRD-driven, apni koi UI nahi
\`\`\`

**SELF-HEAL + DRIFT DETECTION operations badalते hain:**
\`\`\`
- prod mein 'kubectl edit deploy' -> Argo OutOfSync dikhाता hai -> (agar self-heal on)
  sync interval ke andar reverted. prod change karने ka EKMATRA tareeka ek git commit hai.
- ek deleted resource recreate hoता hai. ek fat-fingered scale-to-0 undo hoता hai.
- rollback = 'git revert' + sync.
- incident: "kya deployed hai?" = "is SHA par git padhो". reconstruct karने ke liye koi drift nahi.
- trade: aapko chhote/urgent changes bhi commit karने HAIN. break-glass = self-heal ko
  briefly disable karने ka ek documented, audited path.
\`\`\``,

    content: `## GitOps is a reconciliation loop for delivery

Module 7 introduced Kubernetes as a set of controllers running reconciliation loops: each one watches a desired state, observes the actual state, and takes action to close the gap, continuously. GitOps applies exactly this pattern to the delivery of the whole system. The desired state of everything — deployments, services, config, ingress, policies, and often the cluster infrastructure itself — is written as declarative configuration and stored in git. An agent running inside the target environment continuously pulls that configuration, compares it to what is actually running, and applies whatever changes are needed to make reality match. The OpenGitOps project distils this into four principles: the state is **declarative**, it is **versioned and immutable** in git, it is **pulled automatically** by an in-environment agent, and it is **continuously reconciled** so that any drift is corrected.

## Push versus pull

Traditional continuous deployment is push-based: after the CI pipeline builds an artifact, a later stage of that same pipeline runs \`kubectl apply\` or \`helm upgrade\` against the cluster. This has several structural weaknesses. The pipeline must hold credentials that can write to the cluster — a production kubeconfig sitting in CI, which is exactly the concentration of access Module 18 warned about. The cluster is only as current as the last time a pipeline ran successfully; if the pipeline is broken, the cluster silently stops receiving updates. Any change made directly to the cluster — a \`kubectl edit\` during an incident — is invisible to the pipeline and persists indefinitely. And every additional cluster means another set of credentials in CI and another pipeline to maintain.

Pull-based delivery inverts this. An agent — Argo CD or Flux — runs inside the cluster, reads the desired state from git, and applies it from within. No external system holds credentials that can write to the cluster; the agent\'s permissions are local and scoped. The cluster continuously converges on what git says, so even after a node is rebuilt or the whole cluster is recreated, it returns to the declared state on its own. Drift is detected because the agent is always comparing. And bringing up a new cluster is just installing the agent and pointing it at a path in git.

## What the tools do

Argo CD and Flux both watch one or more git repositories containing manifests — plain YAML, Kustomize overlays, Helm charts, or jsonnet — render those into concrete Kubernetes resources, and diff the result against the live state of the cluster. When there is a difference the tool can **sync**: apply the diff, either on a manual action or automatically. Both report status per resource along two axes: whether it is **Synced** or **OutOfSync** relative to git, and whether it is **Healthy**, **Progressing**, or **Degraded** as a running thing. Argo CD adds a web UI, an API, single sign-on, the "app of apps" pattern for managing many applications declaratively, and multi-cluster management from one control plane. Flux is a set of composable controllers — source, kustomize, helm, image-automation, notification — driven entirely by custom resources, with no UI of its own, relying on projects like Weave GitOps or Capacitor for visualisation.

## How self-heal and drift detection change operations

With drift detection on, a manual change to production is immediately visible: the moment someone runs \`kubectl edit deployment\` in prod, Argo CD shows that resource as OutOfSync. With self-heal enabled as well, the agent reverts the change within its reconciliation interval, so the only durable way to change production is to commit to git. A resource that is accidentally deleted is recreated; a deployment that is fat-fingered to zero replicas is scaled back up. Rollback becomes \`git revert\` followed by a sync, or Argo CD\'s built-in "roll back to a previous synced revision". During an incident the question "what is actually deployed" is answered by reading git at the deployed SHA, with no drift to reconstruct. The cost of this is real: every change to production, including small and urgent ones, must go through a commit, and there needs to be a documented, audited break-glass procedure for temporarily disabling self-heal — deliberately made noisy so its use is always noticed.`,

    contentHi: `## GitOps delivery ke liye ek reconciliation loop hai

Module 7 ne Kubernetes ko reconciliation loops chalाने wale controllers ke ek set ke roop mein introduce kiya: har ek ek desired state watch karता hai, actual state observe karता hai, aur gap close karने ke liye action leता hai, continuously. GitOps exactly is pattern ko poore system ki delivery par apply karता hai. Sab kुछ ka desired state — deployments, services, config, ingress, policies — declarative configuration ke roop mein likha jaता hai aur git mein store kiya jaता hai. Target environment ke andar chal raha ek agent continuously us configuration ko pull karता hai, ise compare karता hai jо actually running hai, aur jо bhi changes chahिए apply karता hai. OpenGitOps project ise chaar principles mein distil karता hai: state **declarative** hai, ye git mein **versioned aur immutable** hai, ye ek in-environment agent dwara **pulled automatically** hai, aur ye **continuously reconciled** hai.

## Push versus pull

Traditional continuous deployment push-based hai: CI pipeline ke ek artifact build karने ke baad, us same pipeline ka ek later stage cluster ke against \`kubectl apply\` ya \`helm upgrade\` chalाता hai. Iski kई structural weaknesses hain. Pipeline ko credentials rakhने chahिए jо cluster par likh sakें — CI mein baithा ek production kubeconfig. Cluster sirf utna current hai jitna last time ek pipeline successfully run hui. Cluster par directly kiya gaya koi bhi change pipeline ko invisible hai. Aur har additional cluster ka matlab CI mein credentials ka ek aur set hai.

Pull-based delivery ise invert karता hai. Ek agent — Argo CD ya Flux — cluster ke andar chalता hai, git se desired state padhता hai, aur ise andar se apply karता hai. Koi external system ke paas credentials nahi jо cluster par likh sakें. Cluster continuously converge karता hai jо git kehता hai, to ek node rebuild hone ke baad bhi, ye apne aap declared state par lौट aata hai. Drift detect hoता hai. Aur ek naya cluster khada karना sirf agent install karना aur ise git mein ek path par point karना hai.

## Tools kya karते hain

Argo CD aur Flux dono ek ya zyada git repositories watch karते hain jinme manifests hain, unhe concrete Kubernetes resources mein render karते hain, aur result ko cluster ke live state ke against diff karते hain. Jab ek difference hoता hai tool **sync** kar sakта hai. Dono status per resource report karते hain do axes ke saath: kya ye git ke relative **Synced** ya **OutOfSync** hai, aur kya ye ek running thing ke roop mein **Healthy**, **Progressing**, ya **Degraded** hai. Argo CD ek web UI, ek API, single sign-on, "app of apps" pattern, aur ek control plane se multi-cluster management add karता hai. Flux composable controllers ka ek set hai, poori tarah custom resources dwara driven, apni koi UI nahi.

## Self-heal aur drift detection operations kaise badalते hain

Drift detection on ke saath, production par ek manual change immediately visible hai: jिस moment koi prod mein \`kubectl edit deployment\` chalाता hai, Argo CD us resource ko OutOfSync dikhाता hai. Self-heal enabled ke saath bhi, agent apne reconciliation interval ke andar change ko revert karता hai, to production change karने ka ekmatra durable tareeka git mein commit karना hai. Rollback \`git revert\` ban jाता hai jiske baad ek sync. Ek incident ke dauraan sawaal "actually kya deployed hai" deployed SHA par git padhकर answer hoता hai. Iski cost real hai: production ke har change ko ek commit se guzarना chahिए, aur self-heal ko temporarily disable karने ke liye ek documented, audited break-glass procedure chahिए.`,

    examples: [
      {
        title: 'Argo CD showing drift and self-healing it, then a rollback via git revert',
        titleHi: 'Argo CD drift dikhाता aur ise self-heal karता, phir git revert ke via ek rollback',
        code: `# (representative argocd CLI output - GitOps operations against a synced app)
$ argocd app get web
Name:               web
Project:            default
Source:             https://github.com/acme/deploy  path=apps/web/overlays/prod
SyncPolicy:         Automated (self-heal, prune)
Sync Status:        Synced to  9f2c1a0  (HEAD)
Health Status:      Healthy

GROUP  KIND        NAME   STATUS   HEALTH
       Service     web    Synced   Healthy
apps   Deployment  web    Synced   Healthy

# --- someone runs 'kubectl scale deploy/web --replicas=1' in prod, by hand ---
$ argocd app get web
Sync Status:        OutOfSync from  9f2c1a0
  apps  Deployment  web    OutOfSync   Healthy
      spec.replicas:  3 (desired, from git)  ->  1 (live)

# --- ~30s later (self-heal reconciliation interval) ---
$ argocd app get web
Sync Status:        Synced to  9f2c1a0
  apps  Deployment  web    Synced   Healthy
$ kubectl get deploy web -o jsonpath='{.spec.replicas}'
3
# the hand edit was reverted. the ONLY durable change is a git commit.

# --- a bad release: revert it in git, Argo syncs the revert ---
$ git revert --no-edit b1e77af      # "bump web to v2.3.0" - the bad commit
[main c0ffee1] Revert "bump web to v2.3.0"
$ git push
$ argocd app wait web --sync
web  Synced to  c0ffee1   Healthy
# prod is back on v2.2.9. the audit trail is the git history: who, when, why,
# and the exact revert. no console clicks, no drift.`,
        output: `Synced to  9f2c1a0   Healthy
  -> hand edit: replicas 3 -> 1 -> OutOfSync
  -> ~30s later: self-healed back to replicas 3, Synced
  -> bad release: 'git revert' + push -> Argo syncs to c0ffee1 -> Healthy on v2.2.9`,
        explain: 'This is what GitOps operations look like day to day. The application \`web\` is managed by Argo CD with an automated sync policy that includes self-heal and prune. Its status has two dimensions: Sync Status compares the live cluster to git (here Synced to commit 9f2c1a0), and Health Status is the runtime health of the resources (Healthy). When someone scales the deployment by hand in production, Argo CD immediately reports the deployment as OutOfSync and shows exactly which field diverged — \`spec.replicas\` is 3 in git but 1 live. Because self-heal is on, the next reconciliation cycle, within about thirty seconds, applies git\'s version and the replica count returns to 3; the manual change simply does not stick, which enforces the rule that the only way to change production is a commit. Rolling back a bad release is a \`git revert\` of the offending commit followed by a push; Argo CD detects the new commit and syncs the cluster to it, returning the app to the previous version. The entire operational history — the bad change, who made it, the revert, who did that — is the git log, so during an incident "what is deployed and why" is a question git answers directly.',
        explainHi: 'Ye hai jaise GitOps operations roz dikhते hain. Application \`web\` Argo CD dwara ek automated sync policy ke saath managed hai jismein self-heal aur prune shaamil hain. Iski status ke do dimensions hain: Sync Status live cluster ko git se compare karता hai (yahaan commit 9f2c1a0 par Synced), aur Health Status resources ki runtime health hai (Healthy). Jab koi production mein deployment ko hand se scale karता hai, Argo CD immediately deployment ko OutOfSync report karता hai aur exactly dikhाता hai konsा field diverge hua — \`spec.replicas\` git mein 3 hai par live 1. Kyunki self-heal on hai, agla reconciliation cycle, लगभग tees second ke andar, git ka version apply karता hai. Ek bad release rollback karना offending commit ka ek \`git revert\` hai jiske baad ek push. Poori operational history git log hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# "GitOps" = CI runs 'kubectl apply' with a prod kubeconfig, plus a git repo
  # ci.yml (on push to main):
  #   - run: kubectl --kubeconfig=$PROD_KUBECONFIG apply -f k8s/
  # the manifests are in git (good!), but:
  #   - $PROD_KUBECONFIG is a long-lived cluster-admin cred in CI (Module 18 L1)
  #   - if someone 'kubectl edit's prod, nothing notices or reverts it
  #   - if CI is red for a week, prod silently drifts from git for a week
  #   - a rebuilt node / a restored cluster does NOT converge on git
  #   - 5 clusters = 5 kubeconfigs in CI + 5 apply steps
  # this is push-based CD with a git repo. it is not GitOps - it has none of the
  # reconciliation, drift correction, or credential properties that matter.`,
        right: `# an in-cluster agent pulls from git; CI never touches the cluster
  # 1. install Argo CD (or Flux) IN each cluster. its RBAC is LOCAL + scoped.
  # 2. CI's job ends at "build the image, push it, open a PR that bumps the image
  #    tag in the deploy repo". CI has NO cluster credentials at all.
  # 3. the deploy repo (git) is the desired state. a merge to it is a deploy.
  # 4. Argo CD watches the repo, diffs against live, syncs (auto or on approval),
  #    self-heals drift, and reports Synced/Healthy per resource in a UI.
  # 5. a new cluster: install the agent, point it at the repo path. done.
  # now: no external cluster creds, continuous convergence, visible + corrected
  # drift, and 'what's deployed' = 'read git'.`,
        why: 'Putting manifests in a git repository and having CI run \`kubectl apply\` against production is often called GitOps but is missing everything that makes GitOps valuable. It is still push-based: an external system, the CI pipeline, holds a long-lived credential that can do anything to the cluster, which is the exact access concentration to avoid. There is no reconciliation, so a manual change to the cluster is neither noticed nor undone and the cluster can drift arbitrarily far from git. There is no continuous convergence, so if the pipeline is broken the cluster simply stops getting updates, and a rebuilt node or a restored cluster does not return to the declared state on its own. And it scales badly — each additional cluster is another credential and another pipeline step. Real GitOps runs an agent inside the cluster that pulls the desired state from git and applies it locally, so no external system needs cluster write access, the cluster continuously converges on git regardless of pipeline state, drift is detected and optionally corrected, and adding a cluster is just installing the agent and giving it a path. CI\'s responsibility ends at building the image and opening a pull request that updates the desired state.',
        whyHi: 'Manifests ko ek git repository mein daalना aur CI ko production ke against \`kubectl apply\` chalाना aksar GitOps kaha jaता hai par wo sab kुछ miss karता hai jо GitOps ko valuable banाता hai. Ye abhi bhi push-based hai: ek external system, CI pipeline, ek long-lived credential rakhता hai jо cluster ko kुछ bhi kar sakта hai. Koi reconciliation nahi hai, to cluster par ek manual change na notice hoता hai na undo. Koi continuous convergence nahi hai, to agar pipeline broken hai cluster bas updates milना band kar deता hai. Real GitOps cluster ke andar ek agent chalाता hai jо git se desired state pull karता hai aur ise locally apply karता hai, to koi external system ko cluster write access ki zaroorat nahi.',
      },
      {
        wrong: `# self-heal ON, but people still make "quick" manual prod changes constantly
  # the on-call habitually does 'kubectl edit' / 'kubectl scale' / 'kubectl set
  # image' in prod during incidents "to move fast", then "backports to git later".
  # what happens:
  #  - Argo reverts the change in 30-180s, mid-incident, making things WORSE
  #  - the "backport to git later" often doesn't happen -> the fix is lost on the
  #    next reconcile
  #  - people start disabling self-heal per-app "temporarily" and forgetting ->
  #    those apps are now un-managed and drifting
  #  - nobody trusts that git reflects reality anymore -> the core GitOps promise
  #    is broken`,
        right: `# make the git path fast, and make break-glass explicit + rare + loud
  # 1. the FAST path IS git: a one-line PR to bump an image / replicas, with
  #    auto-merge on green CI + required review, syncs in <2 min. optimise THIS.
  # 2. for a genuine emergency where <2 min matters: a documented break-glass -
  #    'argocd app set <app> --sync-policy none' (disables auto-sync/heal),
  #    announced in the incident channel, with a checklist item to re-enable +
  #    reconcile git BEFORE closing the incident. it pages the platform team.
  # 3. an alert on "any app with auto-sync disabled for > 1h".
  # 4. a weekly report of apps that are OutOfSync or have self-heal off.
  # the rule holds: git is the source of truth. the exception is rare, loud, and
  # always reconciled before the incident closes.`,
        why: 'GitOps only delivers its guarantee — that git reflects what is actually running — if that guarantee is maintained even under pressure. If the operational culture is to make quick manual changes in production during incidents and reconcile git afterward, three things break. The agent reverts those manual changes on its reconciliation interval, often in the middle of the incident, which is disruptive and confusing. The intended "reconcile later" step frequently does not happen, so the actual fix is lost the next time the agent syncs, and the incident reopens. And people respond by disabling self-heal on individual applications "temporarily", then forgetting, leaving those applications unmanaged and free to drift, which quietly erodes the property that git is trustworthy. The fix is to make the git path fast enough that it is the natural choice — a one-line pull request with auto-merge on green checks that syncs within a couple of minutes — and to make the break-glass path for genuine sub-two-minute emergencies explicit, loud, and always reconciled: it disables auto-sync through a documented command, is announced in the incident channel, pages the platform team, and has a mandatory checklist item to restore auto-sync and reconcile git before the incident can be closed, backed by an alert on any application left with auto-sync disabled.',
        whyHi: 'GitOps sirf apni guarantee deता hai — ki git reflect karता hai jо actually running hai — agar wo guarantee pressure ke tehat bhi maintained hai. Agar operational culture incidents ke dauraan production mein quick manual changes karना aur baad mein git reconcile karना hai, teen cheezein toot jaती hain. Agent un manual changes ko apne reconciliation interval par revert karता hai, aksar incident ke beech mein. Intended "baad mein reconcile" step aksar nahi hota. Aur log individual applications par self-heal "temporarily" disable karके respond karते hain, phir bhool jaते hain. Fix git path ko itna fast banाना hai ki ye natural choice hai, aur genuine sub-two-minute emergencies ke liye break-glass path ko explicit, loud, aur hamesha reconciled banाना hai.',
      },
      {
        wrong: `# one giant repo, one Argo Application, everything synced together, no structure
  # deploy-repo/
  #   k8s/               <- 200 YAML files: 12 apps x 3 envs, all flat, all in one
  #                         Argo Application 'everything'
  # results:
  #  - a change to app A's dev config re-renders + re-diffs ALL 200 files
  #  - a broken manifest anywhere -> the WHOLE Application is OutOfSync/blocked
  #  - no way to give team A sync rights to only their app
  #  - prod and dev share a path -> a dev change can accidentally hit prod
  #  - the Argo UI is one 200-resource wall`,
        right: `# structure: per-app, per-env, app-of-apps, scoped projects
  # deploy-repo/
  #   apps/
  #     web/     base/  overlays/{dev,staging,prod}/       # Kustomize
  #     api/     base/  overlays/{dev,staging,prod}/
  #   argocd/
  #     projects/         # an AppProject per team: allowed repos, namespaces, clusters
  #     applicationsets/  # generate one Argo Application per (app x env) from a matrix
  # - each (app, env) is its own Argo Application: isolated sync, isolated health,
  #   isolated RBAC. a broken api/dev doesn't block web/prod.
  # - an AppProject scopes team A to their apps + namespaces only.
  # - prod overlays live on a protected path; promotion is a PR from staging -> prod.
  # - ApplicationSet keeps it DRY: add an app to the matrix, get 3 Applications.`,
        why: 'Managing an entire fleet as one flat directory synced by a single Argo Application couples everything together in ways that make operations fragile. A change to one application\'s development configuration triggers a re-render and re-diff of every other application and environment. A single malformed manifest anywhere in the tree puts the whole Application into an error state, blocking unrelated deployments. There is no way to grant a team sync permission for only their own application, because permissions are at the Application level and there is one Application. And putting production and non-production manifests under the same path invites a change intended for dev to reach prod. The better structure separates concerns: each application has a base and per-environment overlays using Kustomize or Helm values, each combination of application and environment is its own Argo Application with isolated sync status, health, and RBAC, and an AppProject scopes each team to exactly the repositories, namespaces, and clusters they should touch. Production overlays live on a protected path so promotion is an explicit pull request from staging to production. An ApplicationSet generates the per-environment Applications from a matrix so the structure stays DRY as applications are added.',
        whyHi: 'Ek poore fleet ko ek flat directory ke roop mein manage karना jо ek single Argo Application dwara synced hai sab kुछ ko couple karता hai un tarीkon se jо operations ko fragile banाते hain. Ek application ki development configuration mein ek change har doosri application aur environment ka ek re-render aur re-diff trigger karता hai. Tree mein kahीं bhi ek single malformed manifest poore Application ko ek error state mein daalता hai. Ek team ko sirf apni application ke liye sync permission grant karने ka koi tareeka nahi hai. Better structure concerns separate karता hai: har application ka ek base aur per-environment overlays hain, application aur environment ka har combination apna Argo Application hai isolated sync status ke saath, aur ek AppProject har team ko exactly un repositories, namespaces, aur clusters tak scope karता hai. Ek ApplicationSet per-environment Applications ko ek matrix se generate karта hai.',
      },
    ],

    realWorld: [
      {
        en: '**Argo CD / Flux as the CNCF-graduated standard** — both are CNCF graduated projects and are the default way to run Kubernetes at scale. Large platform teams describe the shift from push CD as removing the last set of standing production credentials from CI and cutting incident "what is deployed?" investigations to a git blame.',
        hi: '**Argo CD / Flux CNCF-graduated standard ke roop mein** — dono CNCF graduated projects hain aur scale par Kubernetes chalाने ka default tareeka hain. Bade platform teams push CD se shift ko CI se aakhri set of standing production credentials remove karने ke roop mein describe karते hain.',
      },
      {
        en: '**Drift self-heal catching config-map edits** — teams routinely report that within weeks of enabling self-heal, they find (and stop) a steady trickle of undocumented manual prod changes that had been happening for years — replica bumps, env-var tweaks, image pins — none of which were in git and all of which would have been lost on the next node replacement.',
        hi: '**Drift self-heal config-map edits catch karता hua** — teams routinely report karती hain ki self-heal enable karने ke hafton ke andar, wo undocumented manual prod changes ki ek steady trickle paती (aur rोkती) hain jо saalon se ho rahे the.',
      },
      {
        en: '**The "backport to git later" anti-pattern** — multiple postmortems describe an incident made worse when Argo CD reverted an on-call\'s emergency \`kubectl\` fix mid-incident. The fix everywhere: an explicit, paged, checklist-gated break-glass to disable auto-sync, plus making the normal git path fast enough that break-glass is rarely needed.',
        hi: '**"Baad mein git mein backport" anti-pattern** — kई postmortems ek incident describe karते hain jо worse hua jab Argo CD ne ek on-call ke emergency \`kubectl\` fix ko incident ke beech revert kiya. Har jagah fix: auto-sync disable karने ke liye ek explicit, paged, checklist-gated break-glass.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the four principles of GitOps, and how is it different from "manifests in git plus CI running kubectl apply"?',
        qHi: 'GitOps ke chaar principles kya hain, aur ye "git mein manifests plus CI kubectl apply chalाना" se kaise alag hai?',
        a: 'The four principles are: the desired state is declarative, meaning expressed as configuration rather than a script of steps; it is versioned and immutable, living in git so every change is a reviewed, attributed, revertable commit and git is the single source of truth; it is pulled automatically by an agent running inside the target environment; and it is continuously reconciled, so the agent constantly compares the desired state in git to the actual state in the cluster and corrects any difference. The distinction from push-based CD with a git repo is in the last two principles. Push CD has an external system — the CI pipeline — holding long-lived credentials that can write to the cluster and running \`kubectl apply\` from outside; this concentrates access dangerously, means the cluster is only as current as the last successful pipeline run, makes drift invisible and persistent, and scales as one credential set and one pipeline per cluster. GitOps has an in-cluster agent pulling from git and applying locally, so no external system holds cluster write access, the cluster continuously converges on git regardless of pipeline state — including after a node rebuild or a full cluster recreation — drift is detected and optionally auto-corrected, and adding a cluster is just installing the agent and pointing it at a git path. Having manifests in git is necessary for GitOps but is not sufficient; the reconciliation loop and the pull model are what make it GitOps.',
        aHi: 'Chaar principles hain: desired state declarative hai, matlab configuration ke roop mein express kiya gaya; ye versioned aur immutable hai, git mein rehता hai to har change ek reviewed, attributed, revertable commit hai; ye target environment ke andar chal raha ek agent dwara automatically pulled hai; aur ye continuously reconciled hai. Push-based CD se distinction aakhri do principles mein hai. Push CD mein ek external system — CI pipeline — long-lived credentials rakhता hai jо cluster par likh sakें aur bahar se \`kubectl apply\` chalाता hai. GitOps mein ek in-cluster agent git se pull karता hai aur locally apply karता hai, to koi external system ke paas cluster write access nahi, cluster continuously git par converge karता hai pipeline state ke regardless. Git mein manifests hone GitOps ke liye necessary hai par sufficient nahi.',
      },
      {
        q: 'How do drift detection and self-heal change day-to-day operations, and what is the cost?',
        qHi: 'Drift detection aur self-heal roz-ba-roz operations kaise badalते hain, aur cost kya hai?',
        a: 'With drift detection, any change made directly to the cluster is immediately visible — the moment someone runs \`kubectl edit\` or \`kubectl scale\` on a managed resource, the agent reports it as OutOfSync and shows exactly which fields diverged from git. With self-heal enabled, the agent then reverts that change on its next reconciliation cycle, typically within tens of seconds to a couple of minutes, so the manual change does not stick. This makes the only durable way to change production a commit to git, which means every production change is reviewed, attributed, and revertable, and there is no accumulated drift to reconstruct during an incident — "what is deployed" is answered by reading git at the deployed revision. Rollback is a \`git revert\` plus a sync. Accidentally deleted resources are recreated and fat-fingered scaling is undone automatically. The cost is that every change to production must go through a commit, including small and genuinely urgent ones, which adds latency compared to a direct \`kubectl\` command. Managing that cost has two parts: making the git path fast — a one-line pull request with auto-merge on green checks and required review that syncs within a minute or two — and providing a documented, audited, deliberately noisy break-glass procedure for the rare emergency where even that is too slow, which disables auto-sync temporarily, pages the platform team, and requires reconciling git before the incident can be closed.',
        aHi: 'Drift detection ke saath, cluster par directly kiya gaya koi bhi change immediately visible hai — jिस moment koi ek managed resource par \`kubectl edit\` chalाता hai, agent ise OutOfSync report karता hai aur exactly dikhाता hai konse fields git se diverge hue. Self-heal enabled ke saath, agent phir us change ko apne agle reconciliation cycle par revert karता hai. Ye production change karने ka ekmatra durable tareeka git mein ek commit banाता hai. Rollback ek \`git revert\` plus ek sync hai. Cost ye hai ki production ke har change ko ek commit se guzarना chahिए. Us cost ko manage karने ke do parts hain: git path ko fast banाना, aur ek documented, audited, deliberately noisy break-glass procedure provide karना.',
      },
      {
        q: 'How should a GitOps deploy repository be structured for a fleet of applications and environments?',
        qHi: 'Ek GitOps deploy repository ko applications aur environments ke ek fleet ke liye kaise structure kiya jaना chahिए?',
        a: 'The core idea is to avoid coupling everything into one flat directory synced by one Argo Application, because that makes a change to any app re-diff all apps, a broken manifest anywhere block everything, and per-team permissions impossible. Instead, each application has a base and per-environment overlays — using Kustomize overlays or Helm values — so the shared configuration is defined once and each environment expresses only its differences. Each combination of application and environment becomes its own Argo Application, with isolated sync status, isolated health reporting, and isolated RBAC, so a broken \`api/dev\` does not block \`web/prod\` and a team can be granted sync rights for only their applications. An AppProject scopes each team to exactly the repositories, namespaces, and clusters they are allowed to deploy to. Production overlays live on a protected path in the repository so that promotion from staging to production is an explicit, reviewed pull request rather than an accidental side effect of a dev change. And an ApplicationSet generates the per-environment Applications from a matrix definition, so adding a new application to the matrix produces its dev, staging, and production Applications automatically and the structure stays DRY as the fleet grows. Whether the deploy config lives in the same repository as the application code or a separate one is a secondary choice; the separation of base from overlays and of one Application per app-environment is the important part.',
        aHi: 'Core idea sab kुछ ko ek flat directory mein couple karने se bचना hai jо ek Argo Application dwara synced hai, kyunki wo kisi bhi app mein ek change ko saare apps re-diff karवाता hai. Iske bजाy, har application ka ek base aur per-environment overlays hain, to shared configuration ek baar define hoती hai aur har environment sirf apne differences express karता hai. Application aur environment ka har combination apna Argo Application ban jाता hai, isolated sync status, isolated health reporting, aur isolated RBAC ke saath. Ek AppProject har team ko exactly un repositories, namespaces, aur clusters tak scope karता hai. Production overlays repository mein ek protected path par rehते hain. Aur ek ApplicationSet per-environment Applications ko ek matrix definition se generate karता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, state the four GitOps principles and contrast push vs pull deployment across the four dimensions that matter (credentials, currency, drift, scaling).',
        taskHi: 'Ek comment mein, chaar GitOps principles state karो aur push vs pull deployment contrast karो.',
        hint: 'GITOPS = the reconciliation loop (Module 7) applied to DELIVERY. THE FOUR PRINCIPLES (OpenGitOps): (1) DECLARATIVE — the whole system\'s desired state is expressed as CONFIG, not a script of steps ("3 replicas of image X", not "run these commands"). (2) VERSIONED + IMMUTABLE — that state lives in GIT: every change is a commit (reviewed, attributed, timestamped, revertable); git is the SINGLE SOURCE OF TRUTH. (3) PULLED AUTOMATICALLY — an agent IN the target environment pulls the desired state from git; nothing OUTSIDE pushes INTO the cluster. (4) CONTINUOUSLY RECONCILED — the agent constantly compares desired (git) vs actual (cluster) and corrects any difference; drift is SELF-HEALED. PUSH vs PULL — the four dimensions: (a) CREDENTIALS: PUSH — CI holds a long-lived cluster-admin kubeconfig (the exact access concentration M18 L1 warns about); an external system can write anything to prod. PULL — NO external system has cluster write creds; the in-cluster agent\'s RBAC is LOCAL + scoped. (b) CURRENCY: PUSH — the cluster is only as up-to-date as the LAST SUCCESSFUL pipeline run; if CI is red for a week, prod silently stops receiving updates. PULL — the cluster CONTINUOUSLY converges on git, regardless of pipeline state — including after a node rebuild or a full cluster recreation. (c) DRIFT: PUSH — a manual `kubectl edit` in prod is INVISIBLE to the pipeline and PERSISTS indefinitely. PULL — drift is DETECTED (the agent is always comparing) and optionally AUTO-REVERTED. (d) SCALING: PUSH — N clusters = N kubeconfigs in CI + N apply steps to maintain. PULL — a new cluster just needs the agent installed + a pointer to a git path. THE KEY POINT: "manifests in git + CI runs kubectl apply" is NECESSARY but NOT SUFFICIENT — it\'s push-based CD with a git repo, missing the reconciliation loop and the pull model that are what make it GitOps.',
        hintHi: 'GITOPS = reconciliation loop (M7) DELIVERY par apply. CHAAR PRINCIPLES: (1) DECLARATIVE — desired state CONFIG ke roop mein, steps ka script nahi. (2) VERSIONED + IMMUTABLE — GIT mein: har change ek commit; git SINGLE SOURCE OF TRUTH. (3) PULLED AUTOMATICALLY — target environment MEIN ek agent git se pull karता hai; kuch BAHAR se push NAHI karता. (4) CONTINUOUSLY RECONCILED — agent desired (git) vs actual (cluster) compare karता hai aur correct karता hai; drift SELF-HEALED. PUSH vs PULL — chaar dimensions: (a) CREDENTIALS: PUSH — CI ek long-lived kubeconfig rakhता hai. PULL — KOI external system ke paas cluster write creds nahi; agent ki RBAC LOCAL. (b) CURRENCY: PUSH — cluster sirf LAST SUCCESSFUL pipeline run jitna current. PULL — CONTINUOUSLY git par converge, node rebuild ke baad bhi. (c) DRIFT: PUSH — manual `kubectl edit` INVISIBLE + PERSIST. PULL — DETECTED + optionally AUTO-REVERTED. (d) SCALING: PUSH — N clusters = N kubeconfigs + N pipelines. PULL — naye cluster ko sirf agent + git path pointer chahिए. KEY: "git mein manifests + CI kubectl apply" NECESSARY par NOT SUFFICIENT.',
      },
      {
        task: 'In a comment, explain what Argo CD / Flux actually do (watch, render, diff, sync, report), the two status axes, and how self-heal + drift detection change operations (the rule, rollback, incidents, the cost, break-glass).',
        taskHi: 'Ek comment mein, samjhाओ Argo CD / Flux actually kya karते hain aur self-heal + drift detection operations kaise badalते hain.',
        hint: 'WHAT ARGO CD / FLUX DO: (1) WATCH one or more git repos (+ Helm charts / Kustomize overlays / plain YAML / jsonnet). (2) RENDER the manifests into concrete k8s resources. (3) DIFF the rendered result against the LIVE cluster state. (4) SYNC — apply the diff, either on a MANUAL action or AUTOMATICALLY (`syncPolicy: automated`). (5) REPORT status PER RESOURCE. ARGO CD adds: a web UI + API + SSO, the "app-of-apps" pattern, multi-cluster from one control plane. FLUX is: a set of composable CONTROLLERS (source / kustomize / helm / image-automation / notification), CRD-driven, NO UI of its own (use Weave GitOps / Capacitor). THE TWO STATUS AXES: (i) SYNC STATUS — is the resource `Synced` or `OutOfSync` relative to git (at commit X)? (ii) HEALTH STATUS — is the running thing `Healthy` / `Progressing` / `Degraded`? (a resource can be Synced but Degraded, or OutOfSync but Healthy). HOW SELF-HEAL + DRIFT DETECTION CHANGE OPERATIONS: THE RULE — the ONLY durable way to change prod is a GIT COMMIT. A `kubectl edit deploy` / `kubectl scale` / `kubectl set image` in prod → Argo shows `OutOfSync` + the exact field that diverged (`spec.replicas: 3 (git) -> 1 (live)`) → with self-heal on, it\'s REVERTED within the reconcile interval (~30s-2min). A deleted resource is RECREATED; a fat-fingered scale-to-0 is UNDONE. ROLLBACK = `git revert <bad-sha>` + push → Argo syncs the revert (or Argo\'s "roll back to a previous synced revision"). INCIDENTS — "what is deployed?" = "read git at the deployed SHA" — NO drift to reconstruct; the audit trail (who/when/why) IS the git history. THE COST — every prod change, INCLUDING small + urgent ones, must go through a commit → latency vs a direct `kubectl`. MANAGE IT: (a) make the GIT PATH FAST — a one-line PR (bump an image tag / replicas) with auto-merge on green CI + required review, syncs in <2 min — optimise THIS so it\'s the natural choice. (b) BREAK-GLASS for a genuine sub-2-min emergency: a DOCUMENTED command (`argocd app set <app> --sync-policy none`), ANNOUNCED in the incident channel, PAGES the platform team, with a MANDATORY checklist item to re-enable auto-sync + reconcile git BEFORE the incident closes; + an alert on "any app with auto-sync disabled > 1h". The exception is RARE, LOUD, and ALWAYS reconciled. ANTI-PATTERN: habitual "quick manual fix now, backport to git later" → Argo reverts it mid-incident (worse), the backport often doesn\'t happen (fix lost on next reconcile), people disable self-heal "temporarily" and forget (apps drift, git no longer trustworthy).',
        hintHi: 'ARGO CD / FLUX KYA KARTE HAIN: (1) git repos WATCH karो. (2) manifests RENDER karो. (3) LIVE cluster state ke against DIFF karो. (4) SYNC — diff apply karो (MANUAL ya AUTOMATIC). (5) PER RESOURCE status REPORT karो. ARGO CD: UI + API + SSO + app-of-apps + multi-cluster. FLUX: composable CONTROLLERS, CRD-driven, apni UI NAHI. DO STATUS AXES: (i) SYNC — `Synced` / `OutOfSync` vs git. (ii) HEALTH — `Healthy` / `Progressing` / `Degraded`. OPERATIONS: RULE — prod change karने ka EKMATRA durable tareeka ek GIT COMMIT. `kubectl edit` prod mein → `OutOfSync` + exact field → self-heal on → REVERTED ~30s-2min mein. ROLLBACK = `git revert <bad-sha>` + push. INCIDENTS — "kya deployed hai?" = "deployed SHA par git padhो". COST — har prod change ko ek commit se guzarना. MANAGE: (a) GIT PATH FAST banाओ — one-line PR, auto-merge, <2 min sync. (b) BREAK-GLASS — DOCUMENTED command, ANNOUNCED, PAGES platform team, MANDATORY re-enable + reconcile BEFORE incident closes. ANTI-PATTERN: "quick manual fix now, backport later" → Argo reverts mid-incident, backport nahi hota, log self-heal disable karके bhool jaते hain.',
      },
      {
        task: 'In a comment, describe how to structure a GitOps deploy repo (base + per-env overlays, one Argo Application per app-env, AppProjects, protected prod path, ApplicationSet) and what goes wrong with one flat repo + one Application.',
        taskHi: 'Ek comment mein, ek GitOps deploy repo ko kaise structure karें describe karो.',
        hint: 'WHAT GOES WRONG WITH ONE FLAT REPO + ONE ARGO APPLICATION (`k8s/` = 200 YAML files, 12 apps x 3 envs, all in one Application "everything"): (1) a change to app A\'s DEV config re-renders + re-diffs ALL 200 files. (2) a broken manifest ANYWHERE → the WHOLE Application is `OutOfSync` / blocked → unrelated deployments are stuck. (3) NO way to give team A sync rights to ONLY their app (permissions are at the Application level, there\'s ONE Application). (4) prod + dev share a path → a dev change can accidentally hit prod. (5) the Argo UI is one 200-resource wall. THE STRUCTURE: `apps/<name>/base/` + `apps/<name>/overlays/{dev,staging,prod}/` — Kustomize overlays (or Helm base chart + per-env values): the SHARED config is defined ONCE, each env expresses ONLY its differences (image tag, replicas, resource limits, ingress host). `argocd/projects/` — an AppProject PER TEAM: scopes that team to allowed source repos + destination namespaces + clusters (team A literally CANNOT deploy to team B\'s namespace or a cluster they don\'t own). `argocd/applicationsets/` — an ApplicationSet that GENERATES one Argo Application per (app x env) from a MATRIX (or a git-directory / cluster generator) → adding an app to the matrix yields its dev + staging + prod Applications automatically → the structure stays DRY as the fleet grows. EACH (app, env) IS ITS OWN ARGO APPLICATION: ISOLATED sync status, ISOLATED health, ISOLATED RBAC → a broken `api/dev` does NOT block `web/prod`; a team gets sync rights to only their Applications; the UI is per-app not one wall. PROD OVERLAYS live on a PROTECTED PATH (CODEOWNERS + branch protection) → promotion from staging → prod is an EXPLICIT, REVIEWED PR (a one-line image-tag bump), NOT an accidental side effect of a dev change. SECRETS: not in the repo as plaintext — an `ExternalSecret` CR / a SOPS-encrypted file / a SealedSecret (Module 19 L4). (Whether deploy config lives in the SAME repo as the app code or a SEPARATE "deploy repo" is a secondary choice — a separate repo decouples the deploy-history from the code-history and lets an image-updater bot open promotion PRs without touching the app repo; the base/overlay split + one-Application-per-app-env is the part that matters.)',
        hintHi: 'ONE FLAT REPO + ONE APPLICATION KE SAATH KYA GALAT: (1) app A ke DEV config mein ek change SAARE 200 files re-diff karता hai. (2) kahीं bhi ek broken manifest → POORA Application `OutOfSync` / blocked. (3) team A ko SIRF unke app ke liye sync rights dene ka KOI tareeka nahi. (4) prod + dev ek path share karते hain. STRUCTURE: `apps/<name>/base/` + `apps/<name>/overlays/{dev,staging,prod}/` — Kustomize overlays: SHARED config EK BAAR, har env sirf apne differences. `argocd/projects/` — ek AppProject PER TEAM (allowed repos + namespaces + clusters). `argocd/applicationsets/` — ek ApplicationSet jо ek MATRIX se per (app x env) ek Application GENERATE karता hai → DRY. HAR (app, env) APNA ARGO APPLICATION: ISOLATED sync/health/RBAC → broken `api/dev` `web/prod` ko block NAHI karता. PROD OVERLAYS ek PROTECTED PATH par → promotion staging → prod ek EXPLICIT, REVIEWED PR. SECRETS: repo mein plaintext NAHI — `ExternalSecret` / SOPS / SealedSecret (M19 L4).',
      },
    ],

    keyTakeaways: [
      'GITOPS = the reconciliation loop applied to delivery. Four principles: (1) DECLARATIVE state (config, not scripts), (2) VERSIONED + IMMUTABLE in git (git is the source of truth), (3) PULLED by an in-environment agent (nothing outside pushes in), (4) CONTINUOUSLY RECONCILED (drift self-healed).',
      'PULL beats PUSH on four axes: CREDENTIALS (no external system holds cluster write access — the agent\'s RBAC is local), CURRENCY (the cluster converges on git regardless of pipeline state, even after a rebuild), DRIFT (detected and optionally auto-reverted, not invisible), SCALING (a new cluster = install the agent + a git path). "Manifests in git + CI runs kubectl apply" is push CD with a repo, NOT GitOps.',
      'ARGO CD / FLUX watch git → render → diff against live → sync (manual or auto) → report per resource on TWO axes: SYNC status (`Synced`/`OutOfSync` vs git) and HEALTH status (`Healthy`/`Progressing`/`Degraded`). Argo CD adds a UI/API/SSO/multi-cluster; Flux is CRD-driven controllers with no UI.',
      'SELF-HEAL makes a git commit the ONLY durable way to change prod: a manual `kubectl edit` shows OutOfSync and is reverted within the reconcile interval. Rollback = `git revert` + sync. Incidents: "what is deployed?" = "read git at the SHA". COST: every change needs a commit → make the git path fast (one-line auto-merged PR, <2 min) and provide a loud, audited, always-reconciled break-glass for genuine emergencies.',
      'STRUCTURE the deploy repo: base + per-env overlays (Kustomize/Helm), ONE Argo Application per (app, env) with isolated sync/health/RBAC, an AppProject scoping each team to its repos/namespaces/clusters, prod overlays on a protected path (promotion = a reviewed PR), and an ApplicationSet to generate the Applications from a matrix. One flat repo + one Application couples everything and blocks unrelated deploys on any single broken manifest.',
    ],
    keyTakeawaysHi: [
      'GITOPS = reconciliation loop delivery par apply. Chaar principles: (1) DECLARATIVE state (config, scripts nahi), (2) git mein VERSIONED + IMMUTABLE (git source of truth hai), (3) ek in-environment agent dwara PULLED (kुछ bahar se push nahi karता), (4) CONTINUOUSLY RECONCILED (drift self-healed).',
      'PULL chaar axes par PUSH se behtar hai: CREDENTIALS (koi external system ke paas cluster write access nahi — agent ki RBAC local hai), CURRENCY (cluster git par converge karता hai pipeline state ke regardless, rebuild ke baad bhi), DRIFT (detected aur optionally auto-reverted), SCALING (ek naya cluster = agent install + ek git path). "Git mein manifests + CI kubectl apply" ek repo ke saath push CD hai, GitOps NAHI.',
      'ARGO CD / FLUX git watch karते hain → render → live ke against diff → sync (manual ya auto) → per resource DO axes par report: SYNC status (`Synced`/`OutOfSync` vs git) aur HEALTH status (`Healthy`/`Progressing`/`Degraded`). Argo CD ek UI/API/SSO/multi-cluster add karता hai; Flux CRD-driven controllers hai bina UI ke.',
      'SELF-HEAL ek git commit ko prod change karने ka EKMATRA durable tareeka banाता hai: ek manual `kubectl edit` OutOfSync dikhाता hai aur reconcile interval ke andar reverted hoता hai. Rollback = `git revert` + sync. Incidents: "kya deployed hai?" = "SHA par git padhो". COST: har change ko ek commit chahिए → git path ko fast banाओ aur genuine emergencies ke liye ek loud, audited, always-reconciled break-glass provide karो.',
      'Deploy repo STRUCTURE karो: base + per-env overlays (Kustomize/Helm), per (app, env) EK Argo Application isolated sync/health/RBAC ke saath, ek AppProject jо har team ko iske repos/namespaces/clusters tak scope karता hai, prod overlays ek protected path par (promotion = ek reviewed PR), aur ek ApplicationSet Applications ko ek matrix se generate karने ke liye. Ek flat repo + ek Application sab kुछ couple karता hai.',
    ],
  },

  {
    slug: 'ops-gitops-promotion-secrets-and-progressive-delivery',
    title: 'GitOps in Practice: Promotion, Secrets & Progressive Delivery',
    titleHi: 'GitOps Practice Mein: Promotion, Secrets Aur Progressive Delivery',
    description:
      'The operational patterns on top of a GitOps setup: how a build becomes a deploy (an image tag lands in git via an automated PR), how a change moves dev → staging → prod (promotion as a reviewed PR, not a re-run), how secrets are handled when git is the source of truth (references, not values — Module 19), and how progressive delivery (canary, blue-green) works when the rollout is also declarative.',
    descriptionHi:
      'Ek GitOps setup ke upar operational patterns: ek build ek deploy kaise banता hai (ek image tag ek automated PR ke via git mein land karता hai), ek change dev → staging → prod kaise move karता hai (promotion ek reviewed PR ke roop mein, ek re-run nahi), git source of truth hone par secrets kaise handle hote hain (references, values nahi — Module 19), aur progressive delivery (canary, blue-green) kaise kaam karता hai jab rollout bhi declarative hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A recipe binder with a "test kitchen", a "staff meal", and a "menu" section.** A new dish is developed in the test kitchen pages (dev). When it is good, you photocopy that exact page into the staff-meal section (promote to staging) — you do not re-develop it. When the staff have eaten it for a week with no complaints, you photocopy the same page again into the menu section (promote to prod). Every section is the same binder, every move is a photocopy of a known-good page, and the binder — not anyone\'s memory — is what the kitchen cooks from. The ingredient quantities that are secret (the supplier\'s proprietary spice blend) are written as "see the locked box", never as the actual formula, so the binder can be photocopied freely.',
      hi: '**Ek recipe binder ek "test kitchen", ek "staff meal", aur ek "menu" section ke saath.** Ek naya dish test kitchen pages (dev) mein develop hota hai. Jab ye acha hai, aap us exact page ko staff-meal section (staging par promote) mein photocopy karते ho — aap ise re-develop nahi karते. Jab staff ne ise ek hafta bina complaints ke khaya, aap same page ko phir menu section (prod par promote) mein photocopy karते ho. Har section wahi binder hai, har move ek known-good page ki ek photocopy hai. Jо ingredient quantities secret hain wo "locked box dekho" ke roop mein likhी hain, kabhi actual formula ke roop mein nahi.',
    },

    simple: `**HOW A BUILD BECOMES A DEPLOY (git is the trigger, not CI):**
\`\`\`
1. CI builds + pushes the image  registry/web@sha256:...  tagged  git-9f2c1a0 .
2. CI's LAST step: open a PR against the deploy repo that changes ONE line -
   the image tag in  apps/web/overlays/dev/kustomization.yaml .
   (an image-updater bot - Argo CD Image Updater / Flux image-automation / Renovate
    - can do this automatically for dev, watching the registry.)
3. the PR runs CI checks (kustomize build, kubeconform, policy, a diff preview).
4. merge -> Argo CD sees the new commit -> syncs -> web/dev is on the new image.
=> CI has NO cluster access. the deploy is a git merge. the trigger is the commit.
\`\`\`

**PROMOTION = copy a known-good version forward, as a reviewed PR:**
\`\`\`
dev has run  registry/web:git-9f2c1a0  for 2 days, healthy.
promote to staging:  a PR that sets the SAME tag in  overlays/staging/ .
   NOT a rebuild. NOT "run the pipeline against staging". the SAME artifact.
promote to prod:     after staging soak, a PR that sets the same tag in  overlays/prod/ .
   prod path is CODEOWNER-protected -> a human with prod authority approves.
tools: Kargo / Argo CD ApplicationSet PR generator / a simple "promote" GH Action
that opens the next PR. the artifact is immutable; only its PLACEMENT moves.
\`\`\`

**SECRETS WHEN GIT IS THE SOURCE OF TRUTH (recap Module 19 L4):**
\`\`\`
NEVER a plaintext secret in the deploy repo. instead, git holds a REFERENCE:
  - an  ExternalSecret  CR -> the External Secrets Operator pulls the value from
    Vault / a cloud manager into a real k8s Secret. git has only the PATH.
  - a SOPS-encrypted file -> decrypted at apply time (Flux has this built in;
    Argo CD via a plugin / the KSOPS / a sidecar). git has ciphertext.
  - a  SealedSecret  -> encrypted to the cluster controller's key. git has ciphertext.
the deploy repo stays safe to clone, fork, and mirror.
\`\`\`

**PROGRESSIVE DELIVERY, declaratively (Module 11 + GitOps):**
\`\`\`
the rollout strategy is ALSO config in git. an Argo  Rollout  (not a Deployment)
declares:  canary steps [setWeight 10, pause, analysis, setWeight 50, pause, ...] .
- the deploy repo commit bumps the image on the Rollout.
- Argo CD syncs it -> Argo Rollouts executes the canary, running AnalysisRuns
  (query Prometheus for error rate / latency) between steps.
- a failed analysis -> automatic abort + rollback to stable. no human, no console.
- blue-green: the Rollout flips the Service selector after a smoke check.
=> "how it rolls out" is reviewable, versioned, and identical across environments.
\`\`\`

**THE ONE RULE:** every change to any environment is a git commit that a human (or
a policy) approved. the artifact is built once and promoted; it is never rebuilt
per environment.`,

    simpleHi: `**EK BUILD EK DEPLOY KAISE BANTA HAI (git trigger hai, CI nahi):**
\`\`\`
1. CI image build + push karता hai  registry/web@sha256:...  tagged  git-9f2c1a0 .
2. CI ka AAKHRI step: deploy repo ke against ek PR kholना jо EK line change karता hai -
   image tag  apps/web/overlays/dev/kustomization.yaml  mein.
   (ek image-updater bot - Argo CD Image Updater / Flux image-automation / Renovate
    - dev ke liye ye automatically kar sakта hai, registry watch karके.)
3. PR CI checks chalाता hai (kustomize build, kubeconform, policy, ek diff preview).
4. merge -> Argo CD naya commit dekhता hai -> syncs -> web/dev naye image par hai.
=> CI ke paas KOI cluster access nahi. deploy ek git merge hai. trigger commit hai.
\`\`\`

**PROMOTION = ek known-good version aage copy karो, ek reviewed PR ke roop mein:**
\`\`\`
dev ne  registry/web:git-9f2c1a0  2 din chalाya, healthy.
staging par promote:  ek PR jо SAME tag  overlays/staging/  mein set karता hai.
   ek rebuild NAHI. "staging ke against pipeline chalाओ" NAHI. SAME artifact.
prod par promote:     staging soak ke baad, ek PR jо same tag  overlays/prod/  mein set karता hai.
   prod path CODEOWNER-protected hai -> prod authority wala ek human approve karता hai.
tools: Kargo / Argo CD ApplicationSet PR generator / ek simple "promote" GH Action.
artifact immutable hai; sirf iski PLACEMENT move karती hai.
\`\`\`

**SECRETS JAB GIT SOURCE OF TRUTH HAI (Module 19 L4 recap):**
\`\`\`
deploy repo mein KABHI ek plaintext secret nahi. iske bजाy, git ek REFERENCE rakhता hai:
  - ek  ExternalSecret  CR -> External Secrets Operator value ko Vault / ek cloud
    manager se ek real k8s Secret mein pull karता hai. git mein sirf PATH.
  - ek SOPS-encrypted file -> apply time par decrypted. git mein ciphertext.
  - ek  SealedSecret  -> cluster controller ki key par encrypted. git mein ciphertext.
deploy repo clone, fork, aur mirror karने ke liye safe rehता hai.
\`\`\`

**PROGRESSIVE DELIVERY, declaratively (Module 11 + GitOps):**
\`\`\`
rollout strategy BHI git mein config hai. ek Argo  Rollout  (ek Deployment nahi)
declare karता hai:  canary steps [setWeight 10, pause, analysis, setWeight 50, ...] .
- deploy repo commit Rollout par image bump karता hai.
- Argo CD ise syncs karता hai -> Argo Rollouts canary execute karता hai, steps ke
  beech AnalysisRuns chalाता hai (error rate / latency ke liye Prometheus query).
- ek failed analysis -> automatic abort + stable par rollback. koi human nahi.
- blue-green: Rollout ek smoke check ke baad Service selector flip karता hai.
=> "ye kaise roll out hoता hai" reviewable, versioned, aur environments ke across identical hai.
\`\`\`

**EK RULE:** kisi bhi environment ke har change ek git commit hai jise ek human (ya
ek policy) ne approve kiya. artifact ek baar build hota hai aur promote hota hai;
ye kabhi per environment rebuild nahi hota.`,

    content: `## From build to deploy

In a GitOps setup the deploy is a git merge, not a pipeline stage. The CI pipeline builds the image, pushes it to the registry with an immutable tag derived from the commit — \`git-9f2c1a0\` or the digest — and then its final action is to open a pull request against the deploy repository that changes exactly one thing: the image tag referenced in the target environment\'s overlay. For the development environment this pull request can be opened and merged automatically by an image-updater component — Argo CD Image Updater, Flux\'s image-automation controllers, or Renovate watching the registry — so a push to the application repo flows through to the dev cluster with no human step. The pull request still runs checks: rendering the manifests with \`kustomize build\`, validating them with \`kubeconform\`, evaluating policy, and producing a diff preview. On merge, the in-cluster agent sees the new commit and syncs. The CI system never holds cluster credentials; its responsibility ends at the pull request.

## Promotion

Moving a change from one environment to the next is a promotion, and the defining property of a promotion is that it copies a known-good artifact forward rather than rebuilding it. When a version has run in development for a day or two and stayed healthy, promoting it to staging is a pull request that sets the same image tag in the staging overlay — not a rebuild, and not "run the pipeline pointed at staging", but the identical artifact placed in a new location. After a soak in staging, promotion to production is another pull request setting the same tag in the production overlay, and because the production overlay lives on a code-owner-protected path, a person with production authority has to approve it. Tools like Kargo, the Argo CD ApplicationSet pull-request generator, or a simple "promote" GitHub Action that opens the next pull request automate the mechanics, but the model is always the same: the artifact is immutable and only its placement moves through the environments.

## Secrets when git is the source of truth

Because the deploy repository is meant to be freely clonable and is often mirrored, it must never contain a plaintext secret. The patterns from Module 19 Lesson 4 apply directly. The repository can hold an \`ExternalSecret\` custom resource that names a path in Vault or a cloud secrets manager, and the External Secrets Operator pulls the actual value into a Kubernetes Secret at runtime — git contains only the path. Or it can hold a SOPS-encrypted file whose values are ciphertext, decrypted at apply time; Flux has SOPS decryption built in, and Argo CD does it through a plugin, KSOPS, or a sidecar. Or it can hold a \`SealedSecret\` encrypted to the in-cluster controller\'s key. In every case the repository is safe to clone, fork, and mirror because the sensitive material is either a reference or ciphertext.

## Progressive delivery, declaratively

Module 11 covered canary and blue-green deployments; GitOps makes the rollout strategy itself part of the versioned configuration. Instead of a Deployment, the application is defined as an Argo Rollout (or a Flagger Canary), whose spec declares the strategy: a canary with steps such as set weight to 10 percent, pause, run analysis, set weight to 50 percent, pause, run analysis, promote. A commit in the deploy repo bumps the image on the Rollout, the in-cluster agent syncs it, and the progressive-delivery controller executes the canary — shifting traffic in the declared steps and running AnalysisRuns between them that query Prometheus for error rate and latency. If an analysis fails the controller automatically aborts and rolls back to the stable version, with no human involvement and no console. A blue-green strategy flips the Service selector to the new version after a smoke check passes. The important consequence is that "how this rolls out" is now a reviewable, versioned artifact that is identical across every environment, rather than logic embedded in a pipeline that can differ between them.

## The one rule

Everything in this lesson reduces to a single rule: every change to any environment is a git commit that a human or a policy approved, and the artifact is built exactly once and then promoted, never rebuilt per environment. Build-once-promote-many means the thing you tested in staging is bit-for-bit the thing that runs in production; rebuild-per-environment means it might not be.`,

    contentHi: `## Build se deploy tak

Ek GitOps setup mein deploy ek git merge hai, ek pipeline stage nahi. CI pipeline image build karता hai, ise commit se derived ek immutable tag ke saath registry par push karता hai, aur phir iski final action deploy repository ke against ek pull request kholना hai jо exactly ek cheez change karता hai: target environment ke overlay mein referenced image tag. Development environment ke liye ye pull request ek image-updater component dwara automatically khola aur merged ho sakта hai — Argo CD Image Updater, Flux ke image-automation controllers, ya Renovate. Pull request abhi bhi checks chalाता hai: \`kustomize build\` se manifests render karना, \`kubeconform\` se validate karना, policy evaluate karना. Merge par, in-cluster agent naya commit dekhता hai aur syncs karता hai. CI system kabhi cluster credentials nahi rakhता.

## Promotion

Ek change ko ek environment se agle mein move karना ek promotion hai, aur ek promotion ki defining property ye hai ki ye ek known-good artifact ko aage copy karता hai ise rebuild karने ke bजाy. Jab ek version development mein ek din ya do chala aur healthy raha, ise staging par promote karना ek pull request hai jо staging overlay mein same image tag set karता hai — ek rebuild nahi. Staging mein ek soak ke baad, production par promotion ek aur pull request hai jо production overlay mein same tag set karता hai, aur kyunki production overlay ek code-owner-protected path par rehता hai, production authority wale ek vyakti ko ise approve karना hai. Model hamesha same hai: artifact immutable hai aur sirf iski placement environments ke through move karती hai.

## Secrets jab git source of truth hai

Kyunki deploy repository freely clonable hoना chahिए aur aksar mirrored hai, isme kabhi ek plaintext secret nahi hona chahिए. Module 19 Lesson 4 se patterns directly apply hoते hain. Repository ek \`ExternalSecret\` custom resource rakh sakती hai jо Vault ya ek cloud secrets manager mein ek path name karता hai, aur External Secrets Operator actual value ko ek Kubernetes Secret mein runtime par pull karता hai. Ya ye ek SOPS-encrypted file rakh sakती hai jिski values ciphertext hain. Ya ye ek \`SealedSecret\` rakh sakती hai. Har case mein repository clone, fork, aur mirror karने ke liye safe hai.

## Progressive delivery, declaratively

Module 11 ne canary aur blue-green deployments cover kiye; GitOps rollout strategy ko khud versioned configuration ka hissa banाता hai. Ek Deployment ke bजाy, application ek Argo Rollout ke roop mein defined hai, jिska spec strategy declare karता hai. Deploy repo mein ek commit Rollout par image bump karता hai, in-cluster agent ise syncs karता hai, aur progressive-delivery controller canary execute karता hai. Agar ek analysis fail hoती hai controller automatically abort karता hai aur stable version par rollback karता hai. Important consequence ye hai ki "ye kaise roll out hoता hai" ab ek reviewable, versioned artifact hai jо har environment ke across identical hai.

## Ek rule

Is lesson mein sab kुछ ek single rule mein reduce hoता hai: kisi bhi environment ke har change ek git commit hai jise ek human ya ek policy ne approve kiya, aur artifact exactly ek baar build hota hai aur phir promote hota hai. Build-once-promote-many ka matlab jо aapne staging mein test kiya wo bit-for-bit wahi hai jо production mein run hoता hai.`,

    examples: [
      {
        title: 'Build → auto-PR to dev → promote to staging → promote to prod, all as commits',
        titleHi: 'Build → dev ko auto-PR → staging par promote → prod par promote, sab commits ke roop mein',
        code: `# (representative - the flow of ONE change through environments, in git)

# --- 1. app repo: a feature merges to main ---
$ git log --oneline -1   # in acme/web
9f2c1a0 feat: add cart abandonment email

# --- 2. CI builds + pushes, then opens a PR in the DEPLOY repo (acme/deploy) ---
CI: docker build ... && docker push registry/web:git-9f2c1a0
CI: opens PR "chore(dev): web -> git-9f2c1a0"
    apps/web/overlays/dev/kustomization.yaml:
    -  newTag: git-8b3d1f0
    +  newTag: git-9f2c1a0
# (Argo CD Image Updater can auto-merge this for dev on green checks)

# --- 3. dev is healthy for 2 days. promote to staging (a PR, same tag) ---
$ gh pr create --title "promote(staging): web -> git-9f2c1a0" --body "dev soak: 2d, 0 errors"
   apps/web/overlays/staging/kustomization.yaml:
   -  newTag: git-6a1c4e2
   +  newTag: git-9f2c1a0          # <-- the SAME artifact, not a rebuild
# reviewer merges. Argo CD syncs web/staging.

# --- 4. staging is healthy for 3 days. promote to prod (protected path) ---
$ gh pr create --title "promote(prod): web -> git-9f2c1a0"
   apps/web/overlays/prod/kustomization.yaml:  newTag: git-9f2c1a0
# CODEOWNERS: /apps/web/overlays/prod/  @acme/web-leads
# a web-lead reviews + approves. merge -> Argo CD syncs web/prod as an Argo Rollout:
$ argocd app get web-prod
  Rollout  web   Progressing   canary: setWeight 10, analysis running (err<1%, p95<300ms)
  ... 8 min later ...
  Rollout  web   Healthy       canary: promoted 100%, stable=git-9f2c1a0

# the artifact 'registry/web:git-9f2c1a0' was built ONCE (step 2) and is now
# bit-identical in dev, staging, and prod. every move is a reviewed commit.`,
        output: `1. app repo: feat merges (commit 9f2c1a0)
2. CI builds registry/web:git-9f2c1a0, opens a dev PR bumping ONE tag line (auto-merged)
3. after 2d dev soak: a "promote(staging)" PR sets the SAME tag in overlays/staging/ -> synced
4. after 3d staging soak: a "promote(prod)" PR (CODEOWNER-approved) sets the SAME tag in
   overlays/prod/ -> Argo Rollouts runs the canary with Prometheus analysis -> promoted 100%
=> one artifact, built once, promoted by reviewed commits; bit-identical across all three envs`,
        explain: 'One change followed from a feature merge to production, entirely through git. CI builds the image once and tags it immutably from the commit SHA, then its only deploy action is to open a pull request in the separate deploy repository that changes a single line — the image tag in the dev overlay. An image-updater can auto-merge that for the development environment. Promotion to staging is a human-opened pull request that sets the exact same tag in the staging overlay; it is explicitly not a rebuild, so the artifact that soaked in dev is the one that now runs in staging. Promotion to production is another pull request setting the same tag again, but the production overlay path is protected by CODEOWNERS, so a team lead must review and approve. On merge, Argo CD syncs the production application, which is defined as an Argo Rollout, so the progressive-delivery controller runs the canary — shifting ten percent of traffic, running a Prometheus-backed analysis of error rate and latency, and only proceeding if it passes. The single artifact \`registry/web:git-9f2c1a0\` was built once and is bit-for-bit identical in all three environments; every transition between them is a reviewed, attributed, revertable commit.',
        explainHi: 'Ek change ek feature merge se production tak follow kiya gaya, poori tarah git ke through. CI image ko ek baar build karता hai aur ise commit SHA se immutably tag karता hai, phir iski ekmatra deploy action separate deploy repository mein ek pull request kholना hai jо ek single line change karता hai — dev overlay mein image tag. Ek image-updater development environment ke liye ise auto-merge kar sakта hai. Staging par promotion ek human-opened pull request hai jо staging overlay mein exact same tag set karता hai; ye explicitly ek rebuild nahi hai. Production par promotion ek aur pull request hai jо same tag phir set karता hai, par production overlay path CODEOWNERS dwara protected hai. Merge par, Argo CD production application syncs karता hai, jо ek Argo Rollout ke roop mein defined hai. Single artifact ek baar build hua aur teenon environments mein bit-for-bit identical hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# "promote" by re-running the build pipeline against each environment
  # deploy-to-staging.yml:  checkout main, docker build, push registry/web:staging,
  #                         kubectl apply -n staging
  # deploy-to-prod.yml:     checkout main, docker build, push registry/web:prod,
  #                         kubectl apply -n prod
  # problems:
  #  - 3 separate builds of "the same" code -> NOT guaranteed bit-identical
  #    (base image moved, a transitive dep floated, build cache differences)
  #  - the tag ':staging' / ':prod' is MUTABLE -> "what's in prod" is unknowable
  #    from git; you have to inspect the running image digest
  #  - a hotfix to main auto-flows to prod's next build with no promotion gate
  #  - you cannot promote a SPECIFIC known-good version - only "latest main"`,
        right: `# build ONCE, tag immutably, promote by moving that tag through git
  # ci.yml (on merge to main):
  #   TAG=git-$(git rev-parse --short HEAD)
  #   docker build -t registry/web:$TAG .   &&   docker push registry/web:$TAG
  #   # open a PR: overlays/dev/kustomization.yaml  newTag: $TAG
  # promotion is a PR that copies that EXACT $TAG forward:
  #   overlays/staging/kustomization.yaml  newTag: git-9f2c1a0   (a specific, tested build)
  #   overlays/prod/kustomization.yaml     newTag: git-9f2c1a0   (the same one, days later)
  # now: 1 build, 1 immutable artifact. 'what's in prod' = 'read overlays/prod/ in
  # git'. promotion is deliberate + gated. you can promote ANY past known-good tag,
  # and 'git revert' the prod overlay to roll back to the previous one instantly.`,
        why: 'Re-running the build for each environment breaks the core guarantee of a delivery pipeline, which is that what you tested is what you ship. Three separate builds of the same source are not guaranteed to be bit-identical — a base image may have been updated, a floating transitive dependency may have resolved differently, build caches differ — so a bug that did not appear in staging can appear in production from a build difference alone. Using environment-named mutable tags like \`:staging\` and \`:prod\` compounds this: git no longer tells you what is running, because the tag is a moving pointer and you have to inspect the live image digest to know. And a rebuild-per-environment model gives you no way to promote a specific known-good version — every deploy is whatever \`main\` looks like now, so a hotfix flows straight to production\'s next build with no gate. The correct model builds the image exactly once, on merge to main, and tags it immutably from the commit. Promotion is then a pull request that writes that exact tag into the next environment\'s overlay. There is one artifact; git records precisely which tag each environment runs; promotion is a deliberate, reviewable, gated step; you can promote any past known-good tag; and rolling back production is a \`git revert\` of its overlay.',
        whyHi: 'Har environment ke liye build re-run karना ek delivery pipeline ki core guarantee ko toड़ता hai, jо ye hai ki jо aapne test kiya wo hai jо aap ship karते ho. Same source ke teen separate builds bit-identical hone ki guarantee nahi hain — ek base image update ho sakта tha, ek floating transitive dependency alag resolve ho sakती thi — to ek bug jо staging mein appear nahi hua production mein ek build difference se appear ho sakта hai. \`:staging\` aur \`:prod\` jaise environment-named mutable tags use karना ise compound karता hai: git ab aapko nahi batाता kya running hai. Correct model image ko exactly ek baar build karता hai aur ise commit se immutably tag karता hai. Promotion phir ek pull request hai jо us exact tag ko agle environment ke overlay mein likhता hai.',
      },
      {
        wrong: `# a plaintext secret committed into the deploy repo "because Argo needs it"
  # apps/web/overlays/prod/secret.yaml   (committed)
  #   apiVersion: v1
  #   kind: Secret
  #   stringData:
  #     DATABASE_URL: "postgres://app:REALPASSWORD@db.prod:5432/app"
  #     STRIPE_KEY: "sk_live_..."
  # the deploy repo is cloned by every engineer, mirrored to a backup, and its
  # history is forever. this is a plaintext prod secret in git (Module 19 L1) -
  # and GitOps makes it WORSE because the repo is deliberately widely readable.`,
        right: `# git holds a REFERENCE or ciphertext; the value lives in a manager
  # option A - External Secrets Operator (git has the PATH only):
  apiVersion: external-secrets.io/v1
  kind: ExternalSecret
  spec:
    secretStoreRef: { name: vault-prod, kind: ClusterSecretStore }
    target: { name: web-db }
    data:
      - secretKey: DATABASE_URL
        remoteRef: { key: secret/data/prod/web, property: db_url }
  # option B - SOPS (git has ciphertext; Flux decrypts at apply, or Argo via KSOPS):
  #   stringData:
  #     DATABASE_URL: ENC[AES256_GCM,data:...,type:str]
  # option C - SealedSecret (kubeseal to the cluster controller's key).
  # the deploy repo is now safe to clone/fork/mirror. rotation happens in the
  # manager and Argo just re-syncs the (unchanged) reference.`,
        why: 'GitOps intensifies the "no secrets in git" rule from Module 19 rather than relaxing it, because the deploy repository is designed to be widely readable — cloned by every engineer, mirrored for resilience, and often replicated to every cluster\'s local agent. A plaintext Kubernetes Secret committed there is a production credential distributed to everyone with repo access and preserved in history permanently. The three patterns from Module 19 Lesson 4 all keep the deploy repo safe. An \`ExternalSecret\` resource names a path in Vault or a cloud manager, and the External Secrets Operator resolves it to a real Secret at runtime, so git contains only the non-sensitive path. A SOPS-encrypted manifest has ciphertext values decrypted at apply time — Flux does this natively, Argo CD through KSOPS or a plugin. A SealedSecret is encrypted to the in-cluster controller\'s key and can only be decrypted there. In all three the sensitive value never enters version control, rotation is handled in the manager without touching git, and the agent simply re-syncs the unchanged reference.',
        whyHi: 'GitOps Module 19 se "git mein koi secrets nahi" rule ko intensify karता hai ise relax karने ke bजाy, kyunki deploy repository widely readable hone ke liye designed hai — har engineer dwara cloned, resilience ke liye mirrored, aur aksar har cluster ke local agent par replicated. Wahaan committed ek plaintext Kubernetes Secret ek production credential hai jо repo access wale har vyakti ko distributed hai aur history mein permanently preserved hai. Module 19 Lesson 4 se teen patterns sab deploy repo ko safe rakhते hain. Ek \`ExternalSecret\` resource Vault ya ek cloud manager mein ek path name karता hai. Ek SOPS-encrypted manifest ke ciphertext values apply time par decrypted hote hain. Ek SealedSecret in-cluster controller ki key par encrypted hai. Teenon mein sensitive value kabhi version control mein enter nahi karता.',
      },
      {
        wrong: `# progressive delivery logic lives in the CI pipeline, per environment, differently
  # deploy-prod.sh:
  #   kubectl set image deploy/web web=$IMG
  #   kubectl scale deploy/web-canary --replicas=1
  #   sleep 300
  #   ERR=$(curl -s prometheus/api/... | jq ...)
  #   if [ "$ERR" -gt 1 ]; then kubectl rollout undo deploy/web; exit 1; fi
  #   kubectl scale deploy/web-canary --replicas=5 ...
  # - this bash canary exists ONLY in the prod pipeline; staging deploys differently
  # - it's not versioned as config, not reviewable as a spec, not testable
  # - the analysis query, the thresholds, the steps - all buried in a script
  # - a rebuilt cluster / a GitOps sync doesn't know about any of it`,
        right: `# the rollout strategy is declarative config in git (Module 11 + GitOps)
  apiVersion: argoproj.io/v1alpha1
  kind: Rollout
  metadata: { name: web }
  spec:
    strategy:
      canary:
        steps:
          - setWeight: 10
          - pause: { duration: 2m }
          - analysis:
              templates: [{ templateName: web-slo }]   # queries Prometheus
          - setWeight: 50
          - pause: { duration: 5m }
          - analysis:
              templates: [{ templateName: web-slo }]
  # - the SAME Rollout spec is used in every env (weights/pauses can vary via overlay)
  # - a deploy repo commit bumps '.spec.template.spec.containers[0].image'
  # - Argo CD syncs it; Argo Rollouts runs the canary + AnalysisRuns; a failed
  #   analysis auto-aborts to stable. no bash, no console, no per-env drift.
  # - 'how it rolls out' is a reviewed diff, versioned with the app.`,
        why: 'Embedding the canary or blue-green logic in a per-environment shell script in the CI pipeline puts the most safety-critical part of delivery in the least inspectable place. The rollout steps, the analysis queries, the pass thresholds, and the abort behaviour are buried in bash that exists only in the production pipeline and differs from how staging deploys, so the rollout you validated is not the rollout that runs. It is not versioned as configuration, not reviewable as a specification, not unit-testable, and a cluster rebuilt from git has no knowledge of it. Making the rollout declarative fixes all of this. The application is defined as an Argo Rollout (or a Flagger Canary) whose spec contains the strategy — the weight steps, the pauses, the analysis templates that query Prometheus. The same spec is used in every environment, with only parameters like weights and durations varying through overlays. A deploy-repo commit changes the image field, the agent syncs it, and the progressive-delivery controller executes the canary and its analysis runs, automatically aborting to the stable version if analysis fails. "How this rolls out" becomes a reviewed diff that is versioned alongside the application and identical across environments.',
        whyHi: 'Canary ya blue-green logic ko CI pipeline mein ek per-environment shell script mein embed karना delivery ke sabse safety-critical part ko sabse kम inspectable jagah mein daalता hai. Rollout steps, analysis queries, pass thresholds, aur abort behaviour bash mein buried hain jо sirf production pipeline mein exist karता hai. Ye configuration ke roop mein versioned nahi hai, ek specification ke roop mein reviewable nahi hai, aur git se rebuilt ek cluster ko iska koi knowledge nahi hai. Rollout ko declarative banाना is sab ko fix karता hai. Application ek Argo Rollout ke roop mein defined hai jिska spec strategy contain karता hai. Same spec har environment mein use hota hai. Ek deploy-repo commit image field change karता hai, agent ise syncs karता hai, aur progressive-delivery controller canary execute karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Build-once-promote-many at scale** — every mature delivery org converges on this: the image digest that passes CI is the exact digest promoted to staging and then prod, referenced by digest not a moving tag, with promotion as a git PR. "The thing we tested is the thing we shipped" is the whole point, and rebuilding per environment quietly violates it.',
        hi: '**Scale par build-once-promote-many** — har mature delivery org ispar converge karта hai: jо image digest CI pass karता hai wo exact digest staging aur phir prod par promoted hai, digest se referenced ek moving tag nahi. "Jо humne test kiya wo hai jо humne ship kiya" poora point hai.',
      },
      {
        en: '**Kargo and promotion tooling** — the Argo project shipped Kargo specifically to model multi-stage promotion (dev → test → prod, with "freight" = a set of artifact versions moving together) as first-class, reviewable, git-backed transitions, because teams kept hand-rolling brittle promotion scripts.',
        hi: '**Kargo aur promotion tooling** — Argo project ne Kargo specifically multi-stage promotion model karने ke liye ship kiya first-class, reviewable, git-backed transitions ke roop mein, kyunki teams brittle promotion scripts hand-roll karती rahीं.',
      },
      {
        en: '**Flagger / Argo Rollouts + GitOps** — the common production pattern: the Rollout spec (with Prometheus AnalysisTemplates) lives in the deploy repo, Argo CD syncs image bumps, and the canary + automated abort runs with zero pipeline involvement. Rollback of a bad canary is automatic; rollback of a bad promotion is `git revert`.',
        hi: '**Flagger / Argo Rollouts + GitOps** — common production pattern: Rollout spec (Prometheus AnalysisTemplates ke saath) deploy repo mein rehता hai, Argo CD image bumps syncs karता hai, aur canary + automated abort zero pipeline involvement ke saath chalता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'In a GitOps setup, how does a build become a deploy, and where does CI\'s responsibility end?',
        qHi: 'Ek GitOps setup mein, ek build ek deploy kaise banता hai, aur CI ki responsibility kahaan khatam hoती hai?',
        a: 'CI builds the image and pushes it to the registry with an immutable tag derived from the commit — the short SHA or the digest — and then its final action is to open a pull request against the deploy repository that changes exactly one line: the image tag referenced in the target environment\'s overlay. That is where CI\'s responsibility ends. It never runs \`kubectl\` or \`helm\` against a cluster and never holds cluster credentials. The pull request runs its own checks — rendering the manifests, validating them with a schema checker, evaluating policy, showing a diff preview — and on merge, the in-cluster agent (Argo CD or Flux) notices the new commit and syncs the cluster to it. For the development environment this whole loop can be automated: an image-updater component such as Argo CD Image Updater, Flux\'s image-automation controllers, or Renovate watches the registry, opens the tag-bump pull request, and auto-merges it on green checks, so a push to the application repo flows to the dev cluster with no human step. Higher environments require a human-approved pull request. The key property is that the deploy is a git merge and the trigger is the commit, not a pipeline stage with cluster access.',
        aHi: 'CI image build karता hai aur ise commit se derived ek immutable tag ke saath registry par push karता hai, aur phir iski final action deploy repository ke against ek pull request kholना hai jо exactly ek line change karता hai: target environment ke overlay mein referenced image tag. Wahaan CI ki responsibility khatam hoती hai. Ye kabhi ek cluster ke against \`kubectl\` ya \`helm\` nahi chalाता aur kabhi cluster credentials nahi rakhता. Pull request apne checks chalाता hai, aur merge par, in-cluster agent naya commit notice karता hai aur cluster ko ise syncs karता hai. Development environment ke liye ye poora loop automated ho sakता hai. Key property ye hai ki deploy ek git merge hai aur trigger commit hai.',
      },
      {
        q: 'What does "promotion" mean in GitOps, and why is build-once-promote-many better than rebuilding per environment?',
        qHi: 'GitOps mein "promotion" ka matlab kya hai, aur build-once-promote-many per environment rebuild karने se behtar kyun hai?',
        a: 'Promotion is moving a specific, already-built, already-tested artifact from one environment to the next by changing which environment references it, not by rebuilding it. When a version has run healthily in development for a day or two, promoting it to staging is a pull request that sets the identical image tag in the staging overlay; after a soak there, promoting to production is another pull request setting the same tag in the production overlay, on a code-owner-protected path so a person with production authority approves. Build-once-promote-many is better because it preserves the core guarantee of a delivery pipeline: the artifact you validated in staging is bit-for-bit the artifact that runs in production. Rebuilding the same source for each environment does not guarantee that — a base image may have moved, a floating transitive dependency may resolve differently, build caches differ — so a defect can appear in production purely from a build difference. Rebuilding also tends to use environment-named mutable tags like \`:prod\`, which means git no longer tells you what is running; you have to inspect the live digest. And it gives no way to promote a specific known-good version, because every deploy is whatever the main branch is now. Build-once means one artifact, git records exactly which tag each environment runs, promotion is deliberate and gated, and rollback is a \`git revert\` of the overlay.',
        aHi: 'Promotion ek specific, already-built, already-tested artifact ko ek environment se agle mein move karना hai ise change karके ki konsा environment ise reference karता hai, ise rebuild karके nahi. Jab ek version development mein ek din ya do healthily chala, ise staging par promote karना ek pull request hai jо staging overlay mein identical image tag set karта hai. Build-once-promote-many behtar hai kyunki ye ek delivery pipeline ki core guarantee preserve karता hai: jо artifact aapne staging mein validate kiya wo bit-for-bit wahi hai jо production mein run hoता hai. Same source ko har environment ke liye rebuild karना iski guarantee nahi deता. Build-once ka matlab ek artifact, git exactly record karता hai konsा tag har environment run karता hai, promotion deliberate aur gated hai, aur rollback overlay ka ek \`git revert\` hai.',
      },
      {
        q: 'How are secrets and progressive delivery handled when git is the source of truth?',
        qHi: 'Jab git source of truth hai to secrets aur progressive delivery kaise handle hote hain?',
        a: 'Secrets are never committed as plaintext, and GitOps makes this more important, not less, because the deploy repository is deliberately widely readable — cloned by every engineer, mirrored, replicated. The repository holds a reference or ciphertext instead of the value. An \`ExternalSecret\` custom resource names a path in Vault or a cloud secrets manager, and the External Secrets Operator resolves it to a real Kubernetes Secret at runtime, so git contains only the path. A SOPS-encrypted manifest has ciphertext values that are decrypted at apply time — Flux natively, Argo CD through KSOPS or a plugin. A SealedSecret is encrypted to the in-cluster controller\'s key. In all cases the value stays out of version control and rotation happens in the manager. Progressive delivery becomes declarative: instead of a Deployment, the application is an Argo Rollout or a Flagger Canary whose spec contains the strategy — the canary weight steps, the pauses, and analysis templates that query Prometheus for error rate and latency. A deploy-repo commit bumps the image field, the agent syncs it, and the progressive-delivery controller executes the canary and its analysis runs, automatically aborting to the stable version if an analysis fails. The same spec is used across environments, with weights and durations varying through overlays, so "how this rolls out" is a reviewed, versioned artifact rather than logic in a pipeline that can differ between environments.',
        aHi: 'Secrets kabhi plaintext ke roop mein committed nahi hote, aur GitOps ise zyada important banаता hai, kम nahi, kyunki deploy repository deliberately widely readable hai. Repository value ke bजाy ek reference ya ciphertext rakhती hai. Ek \`ExternalSecret\` custom resource Vault ya ek cloud secrets manager mein ek path name karता hai. Ek SOPS-encrypted manifest ke ciphertext values apply time par decrypted hote hain. Ek SealedSecret in-cluster controller ki key par encrypted hai. Progressive delivery declarative ban jाता hai: ek Deployment ke bजाy, application ek Argo Rollout hai jिska spec strategy contain karता hai. Ek deploy-repo commit image field bump karता hai, agent ise syncs karता hai, aur progressive-delivery controller canary execute karता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, walk through how a build becomes a deploy in GitOps (the auto-PR flow), and state the one rule (build once, promote many, every change is an approved commit).',
        taskHi: 'Ek comment mein, GitOps mein ek build ek deploy kaise banता hai chalो, aur ek rule state karो.',
        hint: 'HOW A BUILD BECOMES A DEPLOY (git is the trigger, NOT CI): (1) CI builds + pushes the image `registry/web@sha256:...` tagged IMMUTABLY from the commit (`git-9f2c1a0` / the digest). (2) CI\'s LAST step: open a PR against the DEPLOY repo that changes ONE line — the image tag in `apps/web/overlays/dev/kustomization.yaml` (`newTag: git-8b3d1f0` → `newTag: git-9f2c1a0`). CI does NOT run `kubectl`/`helm`; it has NO cluster credentials. (3) an IMAGE-UPDATER (Argo CD Image Updater / Flux image-automation / Renovate) can OPEN + AUTO-MERGE that PR for DEV on green checks, watching the registry → a push to the app repo flows to the dev cluster with NO human step. (4) the PR runs CI checks: `kustomize build`, `kubeconform`, policy (OPA/Kyverno), a rendered DIFF PREVIEW. (5) on MERGE → the in-cluster agent (Argo CD / Flux) sees the new commit → SYNCS → `web/dev` is on the new image. HIGHER ENVIRONMENTS: a HUMAN-approved PR (no auto-merge). THE ONE RULE: every change to ANY environment is a GIT COMMIT that a HUMAN (or a POLICY) APPROVED; the artifact is BUILT EXACTLY ONCE and then PROMOTED — it is NEVER rebuilt per environment. WHY "build once": build-once-promote-many means the thing you TESTED in staging is BIT-FOR-BIT the thing that RUNS in prod; rebuild-per-environment means it MIGHT NOT be (a base image moved, a floating transitive dep resolved differently, build-cache differences) → a defect can appear in prod purely from a build difference. COROLLARY: reference the image by an IMMUTABLE tag/digest, never a mutable `:prod` / `:latest` (with a moving tag, "what is in prod" is unknowable from git — you\'d have to inspect the live digest).',
        hintHi: 'EK BUILD EK DEPLOY KAISE BANTA HAI (git trigger hai, CI NAHI): (1) CI image build + push karता hai, commit se IMMUTABLY tagged (`git-9f2c1a0` / digest). (2) CI ka AAKHRI step: DEPLOY repo ke against ek PR jо EK line change karता hai — `apps/web/overlays/dev/kustomization.yaml` mein image tag. CI ke paas KOI cluster creds NAHI. (3) ek IMAGE-UPDATER (Argo CD Image Updater / Flux / Renovate) DEV ke liye us PR ko OPEN + AUTO-MERGE kar sakता hai. (4) PR CI checks chalाता hai: `kustomize build`, `kubeconform`, policy, ek DIFF PREVIEW. (5) MERGE par → in-cluster agent naya commit dekhता hai → SYNCS. HIGHER ENVS: ek HUMAN-approved PR. EK RULE: kisi bhi environment ke HAR change ek GIT COMMIT hai jise ek HUMAN (ya POLICY) ne APPROVE kiya; artifact EXACTLY EK BAAR BUILD hota hai aur phir PROMOTE hota hai — KABHI per environment rebuild NAHI. KYUN: jо staging mein TEST kiya wo BIT-FOR-BIT prod mein RUNS; rebuild-per-env → ho sakта hai NAHI ho. IMMUTABLE tag/digest se reference karो, kabhi `:prod`/`:latest` nahi.',
      },
      {
        task: 'In a comment, explain promotion as "copy a known-good version forward" (dev → staging → prod as reviewed PRs), why re-running the build per env is wrong, and the promotion tooling.',
        taskHi: 'Ek comment mein, promotion ko "ek known-good version aage copy karो" ke roop mein samjhाओ.',
        hint: 'PROMOTION = move a SPECIFIC, already-built, already-tested artifact from one env to the next by changing WHICH env references it — NOT by rebuilding it. THE FLOW: dev has run `registry/web:git-9f2c1a0` for 2 days, healthy → PROMOTE TO STAGING: a PR that sets the SAME tag (`newTag: git-9f2c1a0`) in `overlays/staging/kustomization.yaml`, body "dev soak: 2d, 0 errors". NOT a rebuild. NOT "run the pipeline against staging". THE SAME ARTIFACT, placed in a new location. A reviewer merges → Argo CD syncs `web/staging`. → after 3 days healthy in staging → PROMOTE TO PROD: a PR setting the SAME tag in `overlays/prod/kustomization.yaml`. The prod overlay path is CODEOWNER-protected (`/apps/web/overlays/prod/ @acme/web-leads`) → a person with PROD AUTHORITY reviews + approves. Merge → Argo CD syncs `web/prod`. WHY RE-RUNNING THE BUILD PER ENV IS WRONG: (1) 3 separate builds of "the same" code are NOT guaranteed bit-identical (base image moved, a floating transitive dep, build-cache differences) → a bug absent in staging can appear in prod from a BUILD DIFFERENCE alone. (2) it forces environment-named MUTABLE tags (`:staging`, `:prod`) → git no longer tells you what is running; you must inspect the live image DIGEST. (3) NO way to promote a SPECIFIC known-good version — every deploy is "whatever `main` is NOW" → a hotfix to main auto-flows to prod\'s next build with NO promotion gate. THE TOOLING: Kargo (models multi-stage promotion + "freight" = a set of artifact versions moving together, as first-class git-backed transitions), the Argo CD ApplicationSet PR generator, or a simple "promote" GitHub Action that opens the next PR. The model is ALWAYS the same: the artifact is IMMUTABLE; only its PLACEMENT moves through the environments. ROLLBACK: `git revert` the prod overlay → back on the previous tag instantly.',
        hintHi: 'PROMOTION = ek SPECIFIC, already-built, already-tested artifact ko ek env se agle mein move karना ise change karके ki KONSA env ise reference karता hai — ise rebuild karके NAHI. FLOW: dev ne `registry/web:git-9f2c1a0` 2 din chalाya, healthy → STAGING PAR PROMOTE: ek PR jо SAME tag `overlays/staging/kustomization.yaml` mein set karता hai. Rebuild NAHI. SAME ARTIFACT. → 3 din staging mein healthy → PROD PAR PROMOTE: ek PR SAME tag `overlays/prod/` mein. Prod path CODEOWNER-protected → PROD AUTHORITY wala human approve karता hai. PER ENV BUILD RE-RUN KYUN GALAT: (1) 3 separate builds bit-identical NAHI (base image, floating dep, cache) → BUILD DIFFERENCE se bug. (2) MUTABLE tags (`:prod`) → git nahi batाता kya running hai. (3) SPECIFIC known-good version promote karने ka KOI tareeka nahi. TOOLING: Kargo, ApplicationSet PR generator, ek "promote" GH Action. ARTIFACT IMMUTABLE hai; sirf PLACEMENT move karती hai. ROLLBACK: prod overlay `git revert`.',
      },
      {
        task: 'In a comment, explain how secrets are handled in the deploy repo (reference/ciphertext, not values — the 3 patterns) and how progressive delivery becomes declarative config (Argo Rollout spec, analysis, auto-abort).',
        taskHi: 'Ek comment mein, deploy repo mein secrets kaise handle hote hain aur progressive delivery declarative config kaise banता hai.',
        hint: 'SECRETS WHEN GIT IS THE SOURCE OF TRUTH: GitOps makes "no plaintext secrets in git" MORE important, not less — the deploy repo is DELIBERATELY widely readable (cloned by every engineer, mirrored for resilience, replicated to every cluster\'s agent). NEVER a plaintext `kind: Secret` with real `stringData`. Instead git holds a REFERENCE or CIPHERTEXT (Module 19 L4): (A) EXTERNAL SECRETS OPERATOR — an `ExternalSecret` CR names a `secretStoreRef` (Vault / a cloud manager) + a `remoteRef` (the PATH + property); the operator (authing with a workload identity) pulls the value into a real k8s Secret at runtime. Git has ONLY the non-sensitive PATH. Rotation happens in the manager; Argo just re-syncs the UNCHANGED reference. (B) SOPS — the manifest has ciphertext values (`DATABASE_URL: ENC[AES256_GCM,...]`); decrypted AT APPLY TIME — Flux has SOPS decryption BUILT IN, Argo CD via KSOPS / a plugin / a sidecar. Git has ciphertext. (C) SEALED SECRETS — `kubeseal` encrypts to the in-cluster controller\'s key → a `SealedSecret` CR only that controller can decrypt (bound to namespace+name). Git has ciphertext. In ALL THREE the deploy repo stays safe to clone/fork/mirror. PROGRESSIVE DELIVERY AS DECLARATIVE CONFIG (Module 11 + GitOps): the rollout strategy is ALSO config in git. Instead of a `Deployment`, the app is an Argo `Rollout` (or a Flagger `Canary`) whose `spec.strategy.canary.steps` declares: `setWeight: 10` → `pause: {duration: 2m}` → `analysis: {templates: [web-slo]}` (an AnalysisTemplate that QUERIES PROMETHEUS for error rate / p95 latency) → `setWeight: 50` → `pause` → `analysis` → promote. FLOW: a deploy-repo commit bumps `.spec.template.spec.containers[0].image` → Argo CD SYNCS it → Argo Rollouts EXECUTES the canary, shifting traffic in the declared steps and running the AnalysisRuns BETWEEN steps → a FAILED analysis → AUTOMATIC abort + rollback to the STABLE version (NO human, NO console, NO bash). Blue-green: the Rollout flips the Service selector AFTER a smoke check passes. THE SAME spec is used in EVERY env (weights / pause durations can vary via overlay) → "HOW it rolls out" is a REVIEWED, VERSIONED artifact identical across environments, NOT logic buried in a per-env pipeline script (which isn\'t versioned, reviewable, testable, or known to a git-rebuilt cluster).',
        hintHi: 'SECRETS JAB GIT SOURCE OF TRUTH HAI: GitOps "git mein koi plaintext secrets nahi" ko ZYADA important banाता hai — deploy repo DELIBERATELY widely readable hai. KABHI ek plaintext `kind: Secret` real `stringData` ke saath NAHI. Git ek REFERENCE ya CIPHERTEXT rakhता hai (M19 L4): (A) EXTERNAL SECRETS OPERATOR — ek `ExternalSecret` CR ek PATH name karता hai; operator value ko runtime par ek real Secret mein pull karता hai. Git mein SIRF PATH. (B) SOPS — ciphertext values, APPLY TIME par decrypted (Flux BUILT IN, Argo via KSOPS). (C) SEALED SECRETS — `kubeseal` cluster controller ki key par encrypt karता hai. TEENON mein deploy repo safe. PROGRESSIVE DELIVERY DECLARATIVE CONFIG: `Deployment` ke bजाy ek Argo `Rollout` jिska `spec.strategy.canary.steps` declare karता hai: `setWeight: 10` → `pause` → `analysis` (PROMETHEUS QUERY) → `setWeight: 50` → ... FLOW: deploy-repo commit image bump karता hai → Argo CD SYNCS → Argo Rollouts canary EXECUTE karता hai + AnalysisRuns → FAILED analysis → AUTOMATIC abort + STABLE par rollback. SAME spec HAR env mein → "KAISE roll out hoता hai" REVIEWED, VERSIONED artifact hai.',
      },
    ],

    keyTakeaways: [
      'IN GITOPS THE DEPLOY IS A GIT MERGE: CI builds the image, tags it IMMUTABLY from the commit, and its last step opens a PR against the deploy repo bumping ONE tag line. CI has NO cluster credentials. An image-updater can auto-merge for dev; higher envs need a human-approved PR. On merge the in-cluster agent syncs.',
      'PROMOTION = copy a known-good artifact forward, as a reviewed PR: dev → staging → prod each set the SAME immutable tag in the next overlay. NOT a rebuild. Build-once-promote-many guarantees the thing tested in staging is bit-for-bit the thing in prod; rebuild-per-env (and mutable `:prod` tags) breaks that and hides "what is deployed" from git.',
      'THE ONE RULE: every change to any environment is a git commit a human or policy approved; the artifact is built exactly once and promoted, never rebuilt per environment. Reference images by immutable tag/digest. Prod overlays live on a CODEOWNER-protected path so promotion needs prod authority.',
      'SECRETS: never plaintext in the deploy repo (GitOps makes it MORE exposed — widely cloned + mirrored). Git holds a REFERENCE (`ExternalSecret` → the manager resolves it) or CIPHERTEXT (SOPS decrypted at apply; SealedSecret to the cluster key). Rotation happens in the manager; the agent re-syncs the unchanged reference.',
      'PROGRESSIVE DELIVERY becomes declarative: the app is an Argo Rollout whose spec declares the canary steps + pauses + Prometheus-backed analysis. A deploy-repo commit bumps the image; Argo CD syncs; Argo Rollouts runs the canary and auto-aborts to stable on a failed analysis — no bash, no console, identical across environments. Rollback of a bad promotion is `git revert`.',
    ],
    keyTakeawaysHi: [
      'GITOPS MEIN DEPLOY EK GIT MERGE HAI: CI image build karता hai, ise commit se IMMUTABLY tag karता hai, aur iska aakhri step deploy repo ke against ek PR kholता hai jо EK tag line bump karता hai. CI ke paas KOI cluster credentials nahi. Ek image-updater dev ke liye auto-merge kar sakta hai; higher envs ko ek human-approved PR chahिए. Merge par in-cluster agent syncs karता hai.',
      'PROMOTION = ek known-good artifact aage copy karो, ek reviewed PR ke roop mein: dev → staging → prod har ek agle overlay mein SAME immutable tag set karता hai. Ek rebuild NAHI. Build-once-promote-many guarantee karता hai ki jо staging mein test kiya wo bit-for-bit prod mein hai; rebuild-per-env (aur mutable `:prod` tags) ise toड़ता hai.',
      'EK RULE: kisi bhi environment ke har change ek git commit hai jise ek human ya policy ne approve kiya; artifact exactly ek baar build hota hai aur promote hota hai, kabhi per environment rebuild nahi. Images ko immutable tag/digest se reference karो. Prod overlays ek CODEOWNER-protected path par rehते hain.',
      'SECRETS: deploy repo mein kabhi plaintext nahi (GitOps ise ZYADA exposed banाता hai). Git ek REFERENCE (`ExternalSecret` → manager ise resolve karता hai) ya CIPHERTEXT (SOPS apply par decrypted; SealedSecret cluster key par) rakhता hai. Rotation manager mein hoती hai; agent unchanged reference re-syncs karता hai.',
      'PROGRESSIVE DELIVERY declarative ban jाता hai: app ek Argo Rollout hai jिska spec canary steps + pauses + Prometheus-backed analysis declare karता hai. Ek deploy-repo commit image bump karता hai; Argo CD syncs; Argo Rollouts canary chalाता hai aur ek failed analysis par stable par auto-abort karता hai — koi bash nahi, koi console nahi. Ek bad promotion ka rollback `git revert` hai.',
    ],
  },

  {
    slug: 'ops-platform-engineering-and-the-internal-developer-platform',
    title: 'Platform Engineering & the Internal Developer Platform',
    titleHi: 'Platform Engineering Aur Internal Developer Platform',
    description:
      'When "you build it, you run it" meets a hundred engineers, every team re-solving CI, Kubernetes, secrets, and observability from scratch becomes the bottleneck. Platform engineering is the response: a small team builds an internal developer platform — a paved road of self-service golden paths — treated as a product with the stream-aligned teams as its customers. This lesson covers what an IDP actually is, golden paths, the "thinnest viable platform", Backstage, and how to tell a real platform from a wrapper nobody wants.',
    descriptionHi:
      'Jab "you build it, you run it" ek sau engineers se milता hai, har team ka CI, Kubernetes, secrets, aur observability ko scratch se re-solve karना bottleneck ban jाता hai. Platform engineering response hai: ek chhotी team ek internal developer platform build karती hai — self-service golden paths ka ek paved road — jise ek product ki tarah treat kiya jaता hai jिske customers stream-aligned teams hain. Ye lesson cover karता hai ki ek IDP actually kya hai, golden paths, "thinnest viable platform", Backstage, aur ek real platform ko ek wrapper se kaise batाना jise koi nahi chahता.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A well-run kitchen with prep stations versus every cook foraging.** In a bad kitchen, every cook sources their own ingredients, sharpens their own knives, and figures out the oven from scratch — a lot of motion, inconsistent food, and the best cooks spend half their time on logistics. A platform team is the prep crew and the station design: stock stations with mise en place, standard sharp knives at every position, ovens that are calibrated and labelled, and a printed method for the ten dishes that are 80 percent of orders. A cook can still improvise a special, but the default path is fast and consistent, and the chefs spend their time cooking. The platform is not the food — it is everything that makes cooking the food fast, safe, and repeatable.',
      hi: '**Prep stations wali ek well-run kitchen versus har cook foraging.** Ek bad kitchen mein, har cook apne ingredients source karता hai, apne knives sharpen karता hai, aur oven ko scratch se figure out karता hai — bahut motion, inconsistent food, aur best cooks apna aadha time logistics par spend karते hain. Ek platform team prep crew aur station design hai: stations ko mise en place se stock karो, har position par standard sharp knives, calibrated aur labelled ovens, aur un das dishes ke liye ek printed method jо 80 percent orders hain. Ek cook abhi bhi ek special improvise kar sakта hai, par default path fast aur consistent hai, aur chefs apna time cooking mein spend karते hain.',
    },

    simple: `**THE PROBLEM:** "you build it, you run it" (Module 1) is right - but at 100+
engineers, every team independently learning + operating CI, k8s, IaC, secrets,
networking, observability, and on-call tooling is enormous DUPLICATED effort,
inconsistent + insecure by accident, and it buries product work under platform work.

**THE RESPONSE - PLATFORM ENGINEERING:** a small dedicated team builds an INTERNAL
DEVELOPER PLATFORM (IDP): a curated, self-service "paved road" that makes the
right way the EASY way. treated as a PRODUCT; the other teams are its CUSTOMERS.

**WHAT AN IDP ACTUALLY IS (not a single tool - a thin layer over what you have):**
\`\`\`
- SELF-SERVICE       "I need a new service" -> a template/CLI/portal scaffolds the
                     repo, CI, k8s manifests, dashboards, alerts, an on-call rota,
                     a DB - in minutes, no ticket, no platform-team handoff.
- GOLDEN PATHS       an opinionated, supported, documented way to do the common
                     things (a REST service, a cron job, a queue consumer). paved,
                     not walled - you CAN leave it, you just lose the support.
- ABSTRACTION        the developer describes WHAT (a service, 2 CPU, a Postgres,
                     public on this domain); the platform handles HOW (the 400
                     lines of YAML, the IAM, the DNS, the cert, the NetworkPolicy).
- GUARDRAILS         secure + compliant defaults baked in: non-root, network policy,
                     resource limits, cost tags, SBOM, signed images - by DEFAULT.
- GLUE               a catalog (what services exist, who owns them, their docs,
                     dependencies, health) - usually Backstage.
\`\`\`

**"THINNEST VIABLE PLATFORM" (Team Topologies):** build the SMALLEST thing that
removes the current biggest source of friction. do NOT build a giant abstraction
up front. often the TVP is a wiki page + a Terraform module + a scaffolding script.
grow it only where developers actually hit pain.

**HOW TO TELL A REAL PLATFORM FROM A WRAPPER NOBODY WANTS:**
\`\`\`
REAL:    teams ADOPT it because it's faster/easier than rolling their own.
         opt-in wins. it has a roadmap, users, SLOs, and a feedback loop.
         you can measure: time-to-first-deploy for a new service, % on the golden path.
WRAPPER: teams are FORCED onto it by mandate; they route around it; it lags the
         tools it wraps; the platform team is a ticket queue; "the platform" is
         a leaky abstraction that breaks the moment you need something slightly custom.
=> a platform earns adoption. if you have to mandate it, it's not good enough yet.
\`\`\`

**BACKSTAGE** (CNCF, from Spotify): the common base for the "portal" layer - a
software catalog, scaffolder (templates), TechDocs, and plugins (CI status, k8s,
cost, PagerDuty). it is the UI/catalog, NOT the whole platform.`,

    simpleHi: `**PROBLEM:** "you build it, you run it" (Module 1) sahi hai - par 100+ engineers
par, har team ka independently CI, k8s, IaC, secrets, networking, observability,
aur on-call tooling seekhना + operate karना enormous DUPLICATED effort hai,
accidentally inconsistent + insecure, aur ye product work ko platform work ke neeche dabाता hai.

**RESPONSE - PLATFORM ENGINEERING:** ek chhotी dedicated team ek INTERNAL DEVELOPER
PLATFORM (IDP) build karती hai: ek curated, self-service "paved road" jо right way
ko EASY way banाता hai. ek PRODUCT ki tarah treat kiya jaता hai; doosri teams iske CUSTOMERS hain.

**EK IDP ACTUALLY KYA HAI (ek single tool nahi - jо aapke paas hai uske upar ek thin layer):**
\`\`\`
- SELF-SERVICE       "mujhe ek naya service chahिए" -> ek template/CLI/portal repo,
                     CI, k8s manifests, dashboards, alerts, ek on-call rota, ek DB
                     scaffold karता hai - minutes mein, koi ticket nahi, koi handoff nahi.
- GOLDEN PATHS       common cheezein karने ka ek opinionated, supported, documented tareeka
                     (ek REST service, ek cron job, ek queue consumer). paved, walled nahi -
                     aap ise CHHOD sakते ho, aap bas support khो dete ho.
- ABSTRACTION        developer WHAT describe karता hai (ek service, 2 CPU, ek Postgres,
                     is domain par public); platform HOW handle karता hai (400 lines YAML,
                     IAM, DNS, cert, NetworkPolicy).
- GUARDRAILS         secure + compliant defaults baked in: non-root, network policy,
                     resource limits, cost tags, SBOM, signed images - by DEFAULT.
- GLUE               ek catalog (konse services exist karते hain, unhe kaun own karता hai,
                     unke docs, dependencies, health) - usually Backstage.
\`\`\`

**"THINNEST VIABLE PLATFORM" (Team Topologies):** SABSE CHHOTA cheez build karो jо
current biggest source of friction remove karता hai. up front ek giant abstraction
build MAT karो. aksar TVP ek wiki page + ek Terraform module + ek scaffolding script hai.

**EK REAL PLATFORM KO EK WRAPPER SE KAISE BATANA JISE KOI NAHI CHAHTA:**
\`\`\`
REAL:    teams ise ADOPT karती hain kyunki ye apna khud rollan karने se faster/easier hai.
         opt-in jeetता hai. iska ek roadmap, users, SLOs, aur ek feedback loop hai.
WRAPPER: teams ise ek mandate dwara FORCED hain; wo iske around route karती hain; ye
         un tools ke peeche lag karता hai jinhe ye wrap karता hai; platform team ek
         ticket queue hai; "platform" ek leaky abstraction hai.
=> ek platform adoption earn karता hai. agar aapko ise mandate karना padता hai, ye abhi acha nahi hai.
\`\`\`

**BACKSTAGE** (CNCF, Spotify se): "portal" layer ke liye common base - ek software
catalog, scaffolder (templates), TechDocs, aur plugins. ye UI/catalog hai, POORA platform NAHI.`,

    content: `## The problem platform engineering solves

Module 1 argued for "you build it, you run it" — the team that writes a service also operates it, because ownership of production is what makes people build operable software. That principle is sound and does not go away. But past a certain scale — commonly cited around fifty to a hundred engineers — it produces a new problem: every stream-aligned team is independently learning and operating the same underlying platform concerns. Each one sets up its own CI, writes its own Kubernetes manifests, manages its own secrets, configures its own networking and observability, and builds its own on-call tooling. This is enormous duplicated effort; it produces configurations that are inconsistent and often insecure by accident because each team gets the details slightly wrong; and it means the best engineers spend a large fraction of their time on platform plumbing instead of the product they were hired to build. The cognitive load of "everything it takes to run a service in production" is too much to ask every team to carry.

## The internal developer platform

Platform engineering is the response. A small dedicated team builds an internal developer platform: a curated, self-service layer that makes the right way to do things also the easy way. The defining framing is that it is a **product**, not a project or a mandate — the stream-aligned teams are its customers, it has a roadmap driven by their needs, and its success is measured by adoption and by developer outcomes like time to first deploy.

An IDP is not a single tool; it is a thin layer over the infrastructure you already have, providing a few things. **Self-service**: a developer who needs a new service runs a template, a CLI, or a portal action that scaffolds the repository, the CI pipeline, the Kubernetes manifests, the dashboards and alerts, an on-call rotation, and a database, in minutes, with no ticket and no handoff to the platform team. **Golden paths**: an opinionated, supported, documented way to build each of the common kinds of thing — a REST service, a scheduled job, a queue consumer — that is paved rather than walled, meaning a team can deviate from it but gives up the support when they do. **Abstraction**: the developer describes what they want — a service, this much CPU, a Postgres database, publicly reachable on this domain — and the platform generates the how, which is the hundreds of lines of YAML, the IAM policies, the DNS records, the TLS certificate, and the NetworkPolicy. **Guardrails**: the secure and compliant defaults from the rest of this course — non-root containers, network policies, resource limits, cost-allocation tags, SBOM generation, image signing — applied automatically rather than left to each team to remember. And **glue**: a catalog of what services exist, who owns them, where their documentation is, what they depend on, and how healthy they are, which is usually built on Backstage.

## The thinnest viable platform

The main failure mode of platform engineering is building a large, ambitious abstraction before knowing what developers actually need, which produces a platform that is both incomplete and constraining. Team Topologies names the alternative the "thinnest viable platform": build the smallest thing that removes the current single biggest source of friction, ship it, learn, and grow it only where developers demonstrably hit pain. Early on, the thinnest viable platform is often just a well-written wiki page documenting the recommended approach, plus one reusable Terraform module, plus a scaffolding script. That is a legitimate platform if it removes real friction. Sophistication is added in response to evidence, not in anticipation.

## Real platform versus unwanted wrapper

The clearest test of whether a platform is working is whether teams adopt it voluntarily because it is faster and easier than rolling their own. A real platform wins on opt-in: it has a roadmap, real users, service-level objectives for its own availability, and a feedback loop with its customers, and you can measure its value — the time to first deploy for a new service, the percentage of services on the golden path, the reduction in security findings. An unwanted wrapper is the opposite: teams are pushed onto it by mandate rather than choosing it, they route around it wherever they can, it consistently lags behind the tools it wraps because the wrapper has to be updated separately, the platform team functions as a ticket queue rather than a product team, and the abstraction is leaky — it works for the exact cases it anticipated and breaks the moment a team needs something slightly custom. A platform that has to be mandated is not yet good enough; the mandate is a symptom, not a solution.

## Backstage

Backstage, an open-source project from Spotify now under the CNCF, has become the common foundation for the portal and catalog layer of an IDP. It provides a software catalog that tracks services and their ownership, a scaffolder that runs templates to create new components, TechDocs for documentation-as-code, and a plugin ecosystem for surfacing CI status, Kubernetes state, cost data, PagerDuty schedules, and more in one place. It is important to be clear about its scope: Backstage is the user interface and the catalog, not the platform itself. The golden paths, the abstractions, the guardrails, and the actual provisioning are things the platform team still has to build; Backstage is where developers discover and trigger them.`,

    contentHi: `## Jo problem platform engineering solve karता hai

Module 1 ne "you build it, you run it" ke liye argue kiya — jо team ek service likhती hai wo ise operate bhi karती hai, kyunki production ka ownership wo hai jо logon ko operable software build karवाता hai. Wo principle sound hai aur nahi jaता. Par ek certain scale ke past — commonly pachaas se ek sau engineers ke around cited — ye ek naya problem produce karता hai: har stream-aligned team independently same underlying platform concerns seekh aur operate kar rahी hai. Har ek apna CI set up karती hai, apne Kubernetes manifests likhती hai, apne secrets manage karती hai. Ye enormous duplicated effort hai; ye configurations produce karता hai jо inconsistent aur aksar accidentally insecure hain; aur iska matlab best engineers apna bada fraction platform plumbing par spend karते hain.

## Internal developer platform

Platform engineering response hai. Ek chhotी dedicated team ek internal developer platform build karती hai: ek curated, self-service layer jо cheezein karने ka right way bhi easy way banाता hai. Defining framing ye hai ki ye ek **product** hai, ek project ya ek mandate nahi — stream-aligned teams iske customers hain, iska ek roadmap hai jо unki needs dwara driven hai, aur iski success adoption dwara aur developer outcomes dwara measured hai.

Ek IDP ek single tool nahi hai; ye us infrastructure ke upar ek thin layer hai jо aapke paas already hai. **Self-service**: ek developer jise ek naya service chahिए ek template chalाता hai jо repository, CI pipeline, Kubernetes manifests, dashboards aur alerts, ek on-call rotation, aur ek database scaffold karता hai, minutes mein, koi ticket nahi. **Golden paths**: har common kind of thing build karने ka ek opinionated, supported, documented tareeka. **Abstraction**: developer describe karता hai wo kya chahता hai, aur platform how generate karता hai. **Guardrails**: is course ke baaki se secure aur compliant defaults, automatically applied. Aur **glue**: konse services exist karते hain iska ek catalog, usually Backstage par built.

## Thinnest viable platform

Platform engineering ka main failure mode ek bada, ambitious abstraction build karना hai developers ko actually kya chahिए jaanne se pehle. Team Topologies alternative ko "thinnest viable platform" naam deता hai: sabse chhota cheez build karो jо current single biggest source of friction remove karता hai, ship karो, seekhो, aur ise sirf wahaan grow karो jahaan developers demonstrably pain hit karते hain. Early on, thinnest viable platform aksar bas ek well-written wiki page hai, plus ek reusable Terraform module, plus ek scaffolding script.

## Real platform versus unwanted wrapper

Ye ki ek platform kaam kar rahा hai ya nahi ka sabse clear test ye hai ki kya teams ise voluntarily adopt karती hain kyunki ye apna khud rollan karने se faster aur easier hai. Ek real platform opt-in par jeetता hai: iska ek roadmap, real users, apni availability ke liye service-level objectives, aur customers ke saath ek feedback loop hai. Ek unwanted wrapper opposite hai: teams ise ek mandate dwara push kiya jaता hai, wo iske around route karती hain, ye consistently un tools ke peeche lag karता hai jinhe ye wrap karता hai, platform team ek ticket queue ki tarah function karती hai, aur abstraction leaky hai. Ek platform jise mandate karना padता hai abhi acha nahi hai.

## Backstage

Backstage, Spotify se ek open-source project ab CNCF ke under, ek IDP ke portal aur catalog layer ke liye common foundation ban gaya hai. Ye ek software catalog provide karता hai jо services aur unki ownership track karता hai, ek scaffolder jо naye components create karने ke liye templates chalाता hai, documentation-as-code ke liye TechDocs, aur ek plugin ecosystem. Iske scope ke baare mein clear hona important hai: Backstage user interface aur catalog hai, platform khud nahi.`,

    examples: [
      {
        title: 'A golden-path service scaffold: what "I need a new service" produces',
        titleHi: 'Ek golden-path service scaffold: "mujhe ek naya service chahिए" kya produce karता hai',
        code: `# (representative - a platform CLI / Backstage scaffolder action)
$ platform new service --name orders --type rest --owner team-checkout \\
      --db postgres --public-domain orders.acme.com

Creating from golden path 'rest-service' ...
  [git]        created repo  acme/orders  (from template rest-service@v4)
                 - src/ (health + metrics endpoints wired), Dockerfile (distroless,
                   non-root, multi-stage), tests, .pre-commit (gitleaks + lint)
  [ci]         .github/workflows/ci.yml  - build, test, SBOM (syft), scan (trivy),
                 sign (cosign), open a deploy-repo PR. actions SHA-pinned. OIDC, no keys.
  [deploy]     acme/deploy: apps/orders/{base, overlays/dev,staging,prod}
                 - Rollout (canary 10->50->100 + Prometheus analysis)
                 - NetworkPolicy default-deny + allow ingress/DB/DNS
                 - resources: requests+limits set; PodSecurity 'restricted'
                 - ExternalSecret -> vault path secret/data/<env>/orders
  [data]       RDS Postgres (dev: db.t4g.micro; prod: Multi-AZ) via a Terraform module;
                 dynamic creds through Vault (no static password)
  [dns/tls]    orders.acme.com -> ALB, ACM cert, auto-renew
  [observability]  Grafana dashboard (RED), alert rules (SLO burn-rate),
                 logs->Loki, traces->Tempo, all labelled service=orders
  [oncall]     PagerDuty service + a starter rota + a runbook stub
  [catalog]    registered in Backstage: owner=team-checkout, tier=2, links wired

Done in 3m 40s.  First deploy to dev: 'git push' -> auto-synced.
To customise anything: edit the generated files. You keep golden-path support
as long as the CI checks + the PodSecurity/NetworkPolicy/cost-tag guardrails pass.`,
        output: `'platform new service' from the 'rest-service' golden path scaffolds, in one step:
  repo + hardened Dockerfile + wired health/metrics    CI (build/test/SBOM/scan/sign/deploy-PR)
  deploy repo overlays (Rollout + NetworkPolicy + PodSecurity + ExternalSecret)
  an RDS Postgres (Terraform module, dynamic Vault creds)    DNS + TLS
  Grafana dashboard + SLO alerts + logs/traces wiring    a PagerDuty service + runbook stub
  Backstage catalog entry (owner, tier)
=> minutes, no ticket, guardrails by default; deviate freely but keep support only while the checks pass`,
        explain: 'This is what a golden path delivers in practice: a single command (or a Backstage form) that produces everything a new production service needs, with every guardrail from this course already applied. The generated repository has a distroless non-root multi-stage Dockerfile, health and metrics endpoints already wired, and pre-commit secret scanning. The CI pipeline builds, tests, generates an SBOM, scans, signs the image, and opens a pull request against the deploy repository — with actions pinned to SHAs and OIDC instead of static keys. The deploy-repo overlays define an Argo Rollout with a Prometheus-analysed canary, a default-deny NetworkPolicy, resource requests and limits, the restricted Pod Security Standard, and an ExternalSecret pointing at Vault. A database is provisioned through a Terraform module with dynamic credentials. DNS, TLS, a Grafana dashboard, SLO burn-rate alerts, log and trace wiring, a PagerDuty service, a runbook stub, and a Backstage catalog entry are all created. The developer did not write any of this and did not file a ticket. Crucially the path is paved, not walled: they can edit any generated file, and they keep golden-path support as long as the guardrail checks continue to pass.',
        explainHi: 'Ye hai jо ek golden path practice mein deता hai: ek single command jо sab kुछ produce karता hai jо ek naye production service ko chahिए, is course se har guardrail already applied ke saath. Generated repository mein ek distroless non-root multi-stage Dockerfile hai, health aur metrics endpoints already wired, aur pre-commit secret scanning. CI pipeline build, test, ek SBOM generate, scan, image sign karता hai, aur deploy repository ke against ek pull request kholता hai. Deploy-repo overlays ek Argo Rollout define karते hain ek Prometheus-analysed canary ke saath, ek default-deny NetworkPolicy, resource requests aur limits, restricted Pod Security Standard, aur ek ExternalSecret. Ek database ek Terraform module ke through provisioned hai dynamic credentials ke saath. DNS, TLS, ek Grafana dashboard, SLO alerts, ek PagerDuty service, aur ek Backstage catalog entry sab created hain. Developer ne is mein se kुछ nahi likha aur ek ticket file nahi kiya. Path paved hai, walled nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `# the platform is a mandate + a ticket queue, not a product
  # platform team's actual workflow:
  #  - a team wants a new service -> files a JIRA ticket -> waits 3 days -> the
  #    platform team hand-crafts the setup -> hands back a kubeconfig
  #  - a team needs a config change -> another ticket -> another wait
  #  - the "platform" is a set of Confluence pages + tribal knowledge + the
  #    platform team as the only people who can actually deploy
  #  - teams that need anything non-standard are told "that's not supported" (full stop)
  # result: the platform team is the bottleneck it was meant to remove. teams
  # build shadow tooling to route around it. adoption is 100% only because it's mandatory.`,
        right: `# the platform is self-service, opt-in, measured, with an escape hatch
  #  - "new service" = a CLI/portal action -> scaffolded in minutes, zero tickets,
  #    zero platform-team involvement in the common case
  #  - config changes = a PR the team merges themselves (GitOps)
  #  - the platform team's job is building + improving the golden paths + guardrails,
  #    NOT executing deploys. they have a roadmap + office hours + a #platform channel.
  #  - non-standard need? the path is PAVED not WALLED: you can drop to raw
  #    manifests / your own Terraform, you just take on the support burden.
  #  - measured: time-to-first-deploy (target < 1 day), % services on the golden
  #    path, platform NPS, tickets-per-week (should trend to ~0 for provisioning)
  #  - adoption is EARNED: it's the fast path, so teams choose it.`,
        why: 'The most common way platform engineering fails is by recreating the central-ops bottleneck it was supposed to eliminate. If getting a new service still means filing a ticket and waiting for the platform team to hand-craft the setup, if every configuration change is another ticket, and if the platform team are the only people who can actually deploy, then the platform team is now the constraint on every other team\'s delivery — exactly the problem "you build it, you run it" was meant to solve, just relocated. Teams respond by building shadow tooling to avoid the platform, and the only reason adoption looks complete is that it is mandatory. A working platform is self-service in the common case: creating a service and changing its configuration are actions the stream-aligned team performs itself, in minutes, through a CLI or portal and GitOps pull requests, with no platform-team involvement. The platform team\'s work is building and improving the golden paths and guardrails, not executing deployments; they operate as a product team with a roadmap, office hours, and a support channel. The path is paved, not walled — a team with a genuinely non-standard need can drop down to raw manifests or their own Terraform and take on the corresponding support burden. And the platform\'s value is measured: time to first deploy, the share of services on the golden path, developer satisfaction, and a provisioning ticket count that should trend toward zero. Adoption is earned by being the fast path.',
        whyHi: 'Platform engineering fail hone ka sabse common tareeka wo central-ops bottleneck recreate karना hai jise ise eliminate karना tha. Agar ek naya service paना abhi bhi ek ticket file karना aur platform team ke setup hand-craft karने ka wait karना hai, aur agar platform team hi ekmatra log hain jо actually deploy kar sakते hain, to platform team ab har doosri team ki delivery par constraint hai. Teams shadow tooling build karके respond karती hain. Ek working platform common case mein self-service hai: ek service create karना aur iski configuration change karना stream-aligned team khud perform karती hai, minutes mein. Platform team ka kaam golden paths aur guardrails build aur improve karना hai, deployments execute karना nahi. Path paved hai, walled nahi. Aur platform ki value measured hai.',
      },
      {
        wrong: `# build the "perfect" all-encompassing platform for 18 months before shipping
  # the platform team designs a full internal PaaS: a custom DSL for service
  # definitions, a bespoke control plane, a custom UI, abstractions over EVERYTHING
  # (compute, data, messaging, ML, batch). 18 months, 8 engineers, no users yet.
  # when it ships:
  #  - the DSL can't express half of what teams actually need -> escape hatches
  #    everywhere -> teams learn the DSL AND the underlying k8s -> more load, not less
  #  - it's already behind: k8s moved, the cloud added features, the DSL didn't
  #  - the abstractions leak on every non-trivial case
  #  - the platform team is now maintaining a large bespoke system forever`,
        right: `# thinnest viable platform: solve the current biggest friction, then iterate
  #  month 1: the biggest pain is "setting up CI + a Dockerfile takes everyone a
  #    week and they all get it wrong". SHIP: a Cookiecutter template + a wiki page.
  #    measure: time-to-first-green-CI drops from 5 days to 1 hour. done.
  #  month 2: next pain is "everyone hand-writes 300 lines of k8s YAML". SHIP: a
  #    Helm chart / Kustomize base with the guardrails. teams set ~10 values.
  #  month 4: next pain is DB provisioning. SHIP: a Terraform module + a CLI wrapper.
  #  month 6: NOW a portal (Backstage) to tie the catalog + scaffolder together.
  # each step: smallest thing that removes the current #1 friction, shipped in
  # weeks, measured, kept only if used. the platform GROWS from real demand.`,
        why: 'Building a large, all-encompassing platform before it has users is a bet that you can predict what a hundred teams will need across compute, data, messaging, and every other concern, made without the feedback that would tell you whether the bet is right. It almost always loses. A custom domain-specific language for service definitions cannot express the full range of what teams actually require, so it accumulates escape hatches, and teams end up having to learn both the DSL and the underlying Kubernetes — more cognitive load, not less. The bespoke platform is already behind the tools it abstracts by the time it ships, because those tools kept moving during the eighteen-month build. The abstractions leak on every non-trivial case. And the platform team is committed to maintaining a large custom system indefinitely. The thinnest-viable-platform approach inverts this: identify the single biggest source of friction developers face right now, ship the smallest thing that removes it — often a template and a wiki page — in weeks, measure whether it helped, and keep it only if it is used. Then do the same for the next biggest friction. The platform grows in response to demonstrated demand, each increment is small and reversible, and a heavier abstraction like a portal is added only once there is enough underneath it to be worth tying together.',
        whyHi: 'Ek bade, all-encompassing platform ko iske users hone se pehle build karना ek bet hai ki aap predict kar sakते ho ki ek sau teams ko compute, data, messaging ke across kya chahिए, us feedback ke bina jо aapko batाता ki bet sahi hai ya nahi. Ye लगभग hamesha lose karता hai. Ek custom domain-specific language wo full range express nahi kar sakती jо teams actually require karती hain, to ye escape hatches accumulate karती hai, aur teams ko DSL aur underlying Kubernetes dono seekhने padते hain. Bespoke platform ship hone tak already un tools ke peeche hai jinhe ye abstract karता hai. Thinnest-viable-platform approach ise invert karता hai: abhi developers jо single biggest source of friction face karते hain identify karो, sabse chhota cheez ship karो jо ise remove karता hai — aksar ek template aur ek wiki page — weeks mein, measure karो, aur ise sirf tab rakhो agar ye use hoता hai.',
      },
      {
        wrong: `# golden path = walled garden: "supported" means "the ONLY way, no exceptions"
  # the platform enforces: you MUST use the platform's service DSL, you CANNOT
  # write raw k8s manifests, you CANNOT bring your own Terraform, the only
  # database is the one blessed Postgres flavour, the only language runtimes are
  # Node and Go.
  # a team building an ML inference service needs a GPU node pool, a custom
  # runtime, and a vector DB. the platform says "not supported". they either:
  #  - fight the platform team for months, or
  #  - stand up a completely separate, unmanaged, un-guardrailed shadow environment
  # -> the platform's guardrails now protect everything EXCEPT the riskiest workload.`,
        right: `# PAVED not WALLED: the golden path is the easy default; deviation is allowed
  #  - the golden path covers the 80% case brilliantly (a REST/gRPC service on
  #    the standard runtime, standard Postgres) - fast, guarded, supported.
  #  - for the 20%: you can drop to a lower level. use the platform's Terraform
  #    modules directly. write your own manifests in the same deploy repo. the
  #    guardrails (PodSecurity, NetworkPolicy, cost tags, image signing) are
  #    ENFORCED AT ADMISSION regardless of how you got there.
  #  - "off the golden path" costs you the scaffolding + the higher-touch support,
  #    NOT the security baseline and NOT the right to exist.
  #  - the platform team treats a recurring deviation as a signal to pave a new
  #    path (e.g. "ML services" becomes a second golden path once 3 teams need it).`,
        why: 'A golden path only works if it is genuinely a path and not a wall. When "supported" is redefined as "mandatory with no exceptions" — you may only use the platform\'s DSL, you may not write raw manifests, only these two languages and this one database are permitted — then any team whose needs fall outside the anticipated set has two bad options: spend months fighting the platform team for an exception, or build a completely separate, unmanaged environment outside the platform entirely. The second is what usually happens, and its consequence is severe: the workloads that end up outside the platform are disproportionately the unusual, complex, high-risk ones — the ML inference service with GPUs and a vector database, the data pipeline with special networking — so the platform\'s guardrails now protect everything except the riskiest things. The paved-path model keeps the golden path as an excellent default for the common case while allowing deviation. A team with unusual needs can drop to a lower level of abstraction — using the platform\'s Terraform modules directly, writing their own manifests in the shared deploy repo — and the security guardrails, which are enforced at admission control rather than by the scaffolding, still apply no matter how the workload was created. Going off the golden path costs the team the scaffolding convenience and moves them to higher-touch support; it does not cost them the security baseline or their place in the managed environment. And a deviation that several teams keep making is a signal for the platform team to pave a second path.',
        whyHi: 'Ek golden path sirf tab kaam karता hai agar ye genuinely ek path hai aur ek wall nahi. Jab "supported" ko "mandatory bina exceptions" ke roop mein redefine kiya jaता hai, to koi bhi team jिski needs anticipated set ke bahar hain ke do bure options hain: platform team se ek exception ke liye months fight karो, ya platform ke bahar ek completely separate, unmanaged environment build karो. Doosra usually hota hai, aur iska consequence severe hai: jо workloads platform ke bahar end hote hain wo disproportionately unusual, complex, high-risk wale hain — to platform ke guardrails ab sab kुछ protect karते hain except riskiest cheezein. Paved-path model golden path ko common case ke liye ek excellent default rakhता hai jabki deviation allow karता hai. Security guardrails, jо admission control par enforced hain scaffolding dwara nahi, abhi bhi apply hoते hain chahे workload kaise bhi create hua.',
      },
    ],

    realWorld: [
      {
        en: '**Spotify → Backstage → the CNCF** — Spotify built Backstage to tame ~2,000 microservices; open-sourced it in 2020; it is now a CNCF incubating project and the de facto standard portal layer, adopted by thousands of companies as the catalog + scaffolder of their IDP.',
        hi: '**Spotify → Backstage → CNCF** — Spotify ne ~2,000 microservices ko tame karने ke liye Backstage build kiya; 2020 mein open-sourced kiya; ye ab ek CNCF incubating project hai aur de facto standard portal layer hai.',
      },
      {
        en: '**Team Topologies "thinnest viable platform"** — the book and the community consistently report that the platforms that succeed start tiny (a template, a module, a wiki) and grow from developer pull, while the ones that fail start with an 18-month "platform program" and a big-bang launch nobody adopts.',
        hi: '**Team Topologies "thinnest viable platform"** — book aur community consistently report karती hain ki jо platforms succeed karती hain wo tiny start karती hain (ek template, ek module, ek wiki) aur developer pull se grow karती hain.',
      },
      {
        en: '**The internal-PaaS graveyard** — many large companies have a story about a multi-year bespoke internal platform (a custom DSL, a custom control plane) that shipped, leaked on every non-trivial case, fell behind upstream, and was eventually replaced by "just Kubernetes + Argo CD + Backstage + good modules".',
        hi: '**Internal-PaaS graveyard** — kई bade companies ke paas ek multi-year bespoke internal platform ke baare mein ek story hai jо ship hui, har non-trivial case par leak hui, upstream ke peeche gir gayi, aur eventually "bas Kubernetes + Argo CD + Backstage + acche modules" se replace hui.',
      },
    ],

    interviewQA: [
      {
        q: 'What problem does platform engineering solve, and how does it relate to "you build it, you run it"?',
        qHi: 'Platform engineering konsa problem solve karता hai, aur ye "you build it, you run it" se kaise relate karता hai?',
        a: '"You build it, you run it" is still correct — the team that writes a service should own its operation, because production ownership is what drives people to build operable software. Platform engineering does not contradict that; it addresses a scaling problem that appears once an organisation has enough teams. Past roughly fifty to a hundred engineers, every stream-aligned team is independently learning and operating the same underlying concerns: CI, Kubernetes, infrastructure as code, secrets, networking, observability, on-call tooling. That is enormous duplicated effort, it produces configurations that are inconsistent and accidentally insecure because each team gets details slightly wrong, and it means skilled engineers spend a large fraction of their time on platform plumbing rather than product. The cognitive load of everything required to run a service in production is too much to ask every team to carry in full. Platform engineering has a small dedicated team build an internal developer platform — a curated, self-service layer that makes the right way also the easy way — so the stream-aligned teams still own their services and their on-call, but they get the platform concerns as a supported product rather than having to reinvent them. The ownership stays with the product teams; the undifferentiated heavy lifting is centralised and made self-service.',
        aHi: '"You build it, you run it" abhi bhi correct hai — jо team ek service likhती hai use iski operation own karna chahिए. Platform engineering iska contradiction nahi karता; ye ek scaling problem address karता hai jо ek organisation ke paas kaafi teams hone par appear hota hai. Roughly pachaas se ek sau engineers ke past, har stream-aligned team independently same underlying concerns seekh aur operate kar rahी hai: CI, Kubernetes, IaC, secrets, networking, observability. Wo enormous duplicated effort hai, ye inconsistent aur accidentally insecure configurations produce karता hai, aur iska matlab skilled engineers apna bada fraction platform plumbing par spend karते hain. Platform engineering ek chhotी dedicated team ko ek internal developer platform build karवाता hai — ek curated, self-service layer jо right way ko easy way banाता hai. Ownership product teams ke paas rehती hai; undifferentiated heavy lifting centralised aur self-service banाya jaता hai.',
      },
      {
        q: 'What actually makes up an internal developer platform, and what is a "golden path"?',
        qHi: 'Ek internal developer platform actually kya banाता hai, aur ek "golden path" kya hai?',
        a: 'An IDP is not a single tool; it is a thin layer over your existing infrastructure that provides a few capabilities. Self-service: a developer who needs a new service, a database, or a config change performs the action themselves through a CLI, a portal, or a GitOps pull request, in minutes, with no ticket and no handoff. Abstraction: the developer describes what they want — a service, this much CPU, a Postgres, publicly reachable on this domain — and the platform generates the how, which is the hundreds of lines of YAML, the IAM, the DNS, the TLS certificate, the NetworkPolicy. Guardrails: the secure and compliant defaults — non-root, network policy, resource limits, cost tags, SBOM, image signing — applied automatically. And glue: a catalog of what exists, who owns it, and how healthy it is, usually Backstage. A golden path is the opinionated, supported, documented way to build one common kind of thing — a REST service, a scheduled job, a queue consumer. Its defining property is that it is paved, not walled: it makes the recommended approach the fast and easy default, but a team can deviate from it, dropping to a lower level of abstraction, and when they do they give up the scaffolding convenience and the higher-touch support but not the security baseline, which is enforced at admission regardless. A recurring deviation is a signal to pave a new golden path.',
        aHi: 'Ek IDP ek single tool nahi hai; ye aapke existing infrastructure ke upar ek thin layer hai jо kुछ capabilities provide karता hai. Self-service: ek developer jise ek naya service chahिए action khud perform karता hai, minutes mein, koi ticket nahi. Abstraction: developer describe karता hai wo kya chahता hai, aur platform how generate karता hai. Guardrails: secure aur compliant defaults automatically applied. Aur glue: kya exist karता hai iska ek catalog, usually Backstage. Ek golden path ek common kind of thing build karने ka opinionated, supported, documented tareeka hai. Iski defining property ye hai ki ye paved hai, walled nahi: ek team ise chhod sakती hai, aur jab wo aisा karती hai wo scaffolding convenience aur higher-touch support khो deती hai par security baseline nahi.',
      },
      {
        q: 'How do you tell a real internal platform from an unwanted wrapper, and what is the "thinnest viable platform"?',
        qHi: 'Aap ek real internal platform ko ek unwanted wrapper se kaise batाते ho, aur "thinnest viable platform" kya hai?',
        a: 'The clearest test is voluntary adoption. A real platform wins on opt-in — teams choose it because it is faster and easier than rolling their own — and it behaves like a product: a roadmap driven by customer needs, real users, service-level objectives for its own availability, a feedback loop, and measurable outcomes like time to first deploy, the percentage of services on the golden path, and a downward trend in security findings. An unwanted wrapper is the opposite: teams are forced onto it by mandate rather than choosing it, they route around it wherever possible, it consistently lags the tools it wraps because the wrapper is maintained separately, the platform team operates as a ticket queue rather than a product team, and the abstraction is leaky, working only for the exact cases it anticipated and breaking as soon as a team needs something slightly custom. A platform that must be mandated is not yet good enough; the mandate is a symptom. The thinnest viable platform is the antidote to over-building: rather than designing a large abstraction before you know what teams need, you build the smallest thing that removes the current single biggest source of friction, ship it in weeks, measure whether it helped, and keep it only if it is used — then repeat for the next friction. Early on this is often just a template plus a reusable module plus a wiki page, and that is a legitimate platform if it removes real pain. Sophistication is added in response to evidence, not anticipation.',
        aHi: 'Sabse clear test voluntary adoption hai. Ek real platform opt-in par jeetता hai — teams ise choose karती hain kyunki ye faster aur easier hai — aur ye ek product ki tarah behave karता hai: ek roadmap, real users, apni availability ke liye SLOs, ek feedback loop, aur measurable outcomes. Ek unwanted wrapper opposite hai: teams ise ek mandate dwara forced hain, wo iske around route karती hain, ye consistently peeche lag karता hai, platform team ek ticket queue hai, aur abstraction leaky hai. Ek platform jise mandate karना padता hai abhi acha nahi hai. Thinnest viable platform over-building ka antidote hai: ek bade abstraction ko design karने ke bजाy, aap sabse chhota cheez build karते ho jо current single biggest source of friction remove karता hai, ise weeks mein ship karते ho, measure karते ho, aur ise sirf tab rakhते ho agar ye use hoता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain the problem platform engineering solves (why "you build it, you run it" needs support at scale) and the five things an IDP provides (self-service, golden paths, abstraction, guardrails, glue).',
        taskHi: 'Ek comment mein, platform engineering jо problem solve karता hai samjhाओ aur wo paanch cheezein jо ek IDP provide karता hai.',
        hint: 'THE PROBLEM: "you build it, you run it" (Module 1) is RIGHT and does NOT go away — production ownership is what drives people to build OPERABLE software. BUT past ~50-100 engineers it creates a NEW problem: EVERY stream-aligned team is INDEPENDENTLY learning + operating the SAME underlying concerns — CI, Kubernetes, IaC, secrets, networking, observability, on-call tooling. This is (a) ENORMOUS DUPLICATED effort, (b) INCONSISTENT + accidentally INSECURE (each team gets the details slightly wrong), (c) it BURIES product work under platform work — skilled engineers spend a large fraction of their time on plumbing. The COGNITIVE LOAD of "everything it takes to run a service in prod" is too much to ask EVERY team to carry in FULL. THE RESPONSE — PLATFORM ENGINEERING: a SMALL dedicated team builds an INTERNAL DEVELOPER PLATFORM (IDP) — a curated, self-service "paved road" that makes the RIGHT way the EASY way. Framed as a PRODUCT; the stream-aligned teams are its CUSTOMERS; a roadmap driven by their needs; success measured by ADOPTION + developer outcomes. Ownership STAYS with the product teams (they still own their service + their on-call); the UNDIFFERENTIATED heavy lifting is centralised + made self-service. THE FIVE THINGS AN IDP PROVIDES (a thin layer over what you already have, NOT one tool): (1) SELF-SERVICE — "I need a new service / DB / config change" → a template / CLI / portal action / GitOps PR the team does ITSELF in MINUTES, no ticket, no handoff. (2) GOLDEN PATHS — an opinionated, SUPPORTED, DOCUMENTED way to do each common thing (a REST service, a cron job, a queue consumer); PAVED not WALLED — you CAN leave it, you just lose the scaffolding + higher-touch support (NOT the security baseline). (3) ABSTRACTION — the developer describes WHAT (a service, 2 CPU, a Postgres, public on this domain); the platform generates the HOW (the ~400 lines of YAML, the IAM, the DNS, the cert, the NetworkPolicy). (4) GUARDRAILS — the secure + compliant defaults from this whole course (non-root, NetworkPolicy, resource limits, cost tags, SBOM, signed images) applied BY DEFAULT + enforced AT ADMISSION. (5) GLUE — a CATALOG (what services exist, who owns them, their docs, dependencies, health) — usually Backstage.',
        hintHi: 'PROBLEM: "you build it, you run it" (M1) SAHI hai aur nahi jaता. PAR ~50-100 engineers ke past ek NAYA problem: HAR team INDEPENDENTLY SAME concerns seekh + operate kar rahी hai — CI, k8s, IaC, secrets, networking, observability. Ye (a) ENORMOUS DUPLICATED effort, (b) INCONSISTENT + INSECURE, (c) product work ko platform work ke neeche DABAТА hai. COGNITIVE LOAD too much. RESPONSE — PLATFORM ENGINEERING: ek SMALL team ek IDP build karती hai — ek self-service "paved road". PRODUCT ke roop mein framed; teams CUSTOMERS hain; ADOPTION se measured. Ownership product teams ke paas RAHTI hai; UNDIFFERENTIATED heavy lifting centralised. PAANCH CHEEZEIN: (1) SELF-SERVICE — "naya service/DB/config" → template/CLI/portal/GitOps PR, MINUTES mein, no ticket. (2) GOLDEN PATHS — opinionated, SUPPORTED way; PAVED not WALLED — chhod sakte ho, support khो dete ho (security baseline NAHI). (3) ABSTRACTION — developer WHAT describe karता hai; platform HOW generate karта hai. (4) GUARDRAILS — secure defaults BY DEFAULT + AT ADMISSION. (5) GLUE — ek CATALOG (Backstage).',
      },
      {
        task: 'In a comment, explain the "thinnest viable platform" (build the smallest thing that removes the current #1 friction, iterate from demand) and why building the "perfect" platform up front fails.',
        taskHi: 'Ek comment mein, "thinnest viable platform" samjhाओ aur kyun "perfect" platform up front build karना fail hoता hai.',
        hint: 'WHY BUILDING THE "PERFECT" ALL-ENCOMPASSING PLATFORM UP FRONT FAILS: it\'s a BET that you can PREDICT what ~100 teams will need across compute / data / messaging / ML / batch — made WITHOUT the feedback that would tell you if the bet is right. It almost always LOSES: (1) a custom DSL for service definitions can\'t express half of what teams actually need → escape hatches EVERYWHERE → teams learn the DSL AND the underlying k8s → MORE cognitive load, not less. (2) it\'s ALREADY BEHIND the tools it abstracts by the time it ships (k8s moved, the cloud added features, during the 18-month build). (3) the abstractions LEAK on every non-trivial case. (4) the platform team is now committed to maintaining a large BESPOKE system FOREVER. (5) 8 engineers, 18 months, ZERO users, ZERO learning. THE "THINNEST VIABLE PLATFORM" (Team Topologies): build the SMALLEST thing that removes the CURRENT SINGLE BIGGEST source of friction, ship it in WEEKS, MEASURE whether it helped, keep it ONLY if used — then repeat for the next friction. CONCRETE ITERATION: month 1 — biggest pain = "CI + Dockerfile takes everyone a week and they get it wrong" → SHIP a Cookiecutter template + a wiki page → measure: time-to-first-green-CI 5 days → 1 hour. month 2 — "everyone hand-writes 300 lines of k8s YAML" → SHIP a Helm chart / Kustomize base with the guardrails (teams set ~10 values). month 4 — DB provisioning → SHIP a Terraform module + a CLI wrapper. month 6 — NOW a portal (Backstage) to tie the catalog + scaffolder together (only once there\'s enough underneath to be worth tying). EACH STEP: smallest thing, weeks not months, measured, kept only if used. EARLY ON the TVP is often JUST a well-written wiki page + one reusable Terraform module + a scaffolding script — and that IS a legitimate platform if it removes real friction. Sophistication is added in RESPONSE TO EVIDENCE, not in ANTICIPATION.',
        hintHi: '"PERFECT" PLATFORM UP FRONT KYUN FAIL HOTA HAI: ye ek BET hai ki aap PREDICT kar sakते ho ki ~100 teams ko kya chahिए — feedback ke BINA. LOSE karता hai: (1) custom DSL half express nahi kar sakती → escape hatches → teams DSL AUR k8s dono seekhते hain → ZYADA load. (2) ship hone tak ALREADY PEECHE. (3) abstractions LEAK karती hain. (4) platform team ek bespoke system FOREVER maintain karती hai. (5) 8 engineers, 18 months, ZERO users. "THINNEST VIABLE PLATFORM": SABSE CHHOTA cheez jо CURRENT #1 friction remove karता hai, WEEKS mein ship, MEASURE, sirf agar used to keep — phir repeat. ITERATION: month 1 — "CI + Dockerfile ek hafta leता hai" → Cookiecutter template + wiki → 5 din → 1 ghanta. month 2 — "300 lines k8s YAML" → Helm chart / Kustomize base. month 4 — DB provisioning → Terraform module + CLI. month 6 — AB ek portal (Backstage). EARLY ON TVP aksar BAS ek wiki page + ek Terraform module + ek scaffolding script hai. Sophistication EVIDENCE ke RESPONSE mein add hoती hai, ANTICIPATION mein nahi.',
      },
      {
        task: 'In a comment, give the test for "real platform vs unwanted wrapper" (voluntary adoption, product behaviour, measurable outcomes vs mandate + ticket queue + route-around), and explain "paved not walled" + where Backstage fits.',
        taskHi: 'Ek comment mein, "real platform vs unwanted wrapper" ka test do, aur "paved not walled" samjhाओ.',
        hint: 'THE TEST — REAL PLATFORM vs UNWANTED WRAPPER: REAL → teams ADOPT it VOLUNTARILY because it\'s FASTER / EASIER than rolling their own (OPT-IN wins). It behaves like a PRODUCT: a ROADMAP driven by customer needs, REAL USERS, SLOs for its OWN availability, a FEEDBACK LOOP (office hours, a #platform channel), and MEASURABLE outcomes — time-to-first-deploy for a new service (target < 1 day), % of services ON the golden path, platform NPS, provisioning-tickets-per-week (should trend to ~0). WRAPPER → teams are FORCED onto it by MANDATE; they ROUTE AROUND it wherever they can (shadow tooling); it consistently LAGS the tools it wraps (the wrapper is maintained separately); the platform team is a TICKET QUEUE (a new service = a JIRA ticket → 3-day wait → hand-crafted setup → a kubeconfig handed back), not a product team; the abstraction is LEAKY — works for the exact anticipated cases, breaks the moment a team needs something slightly custom. THE PRINCIPLE: a platform EARNS adoption. If you have to MANDATE it, it\'s NOT GOOD ENOUGH YET — the mandate is a SYMPTOM, not a solution. "PAVED NOT WALLED": the golden path covers the 80% case BRILLIANTLY (a REST/gRPC service on the standard runtime + standard Postgres) — fast, guarded, supported. For the 20%: you CAN drop to a lower level — use the platform\'s Terraform modules directly, write your own manifests in the same deploy repo. The GUARDRAILS (PodSecurity `restricted`, NetworkPolicy, cost tags, image signing) are ENFORCED AT ADMISSION regardless of HOW you got there. Going "off the golden path" costs you the SCAFFOLDING + the higher-touch support — NOT the security baseline, NOT the right to exist in the managed environment. WHY IT MATTERS: a WALLED garden ("the DSL is the ONLY way, no raw manifests, only these 2 languages, only this DB") forces the unusual/complex/HIGH-RISK workloads (ML inference + GPUs + a vector DB) OUTSIDE the platform entirely → the guardrails now protect everything EXCEPT the riskiest things. A recurring deviation = a SIGNAL to pave a NEW golden path (e.g. "ML services" once 3 teams need it). WHERE BACKSTAGE FITS: an open-source project from Spotify, now CNCF — the common base for the PORTAL + CATALOG layer: a software catalog (services + ownership + docs + dependencies + health), a SCAFFOLDER (runs templates), TechDocs (docs-as-code), and PLUGINS (CI status, k8s, cost, PagerDuty) in one place. It is the UI + the catalog — NOT the whole platform. The golden paths, abstractions, guardrails, and actual provisioning are things the platform team STILL has to build; Backstage is where developers DISCOVER + TRIGGER them.',
        hintHi: 'TEST — REAL vs WRAPPER: REAL → teams VOLUNTARILY ADOPT karती hain (OPT-IN jeetता hai). PRODUCT ki tarah: ROADMAP, REAL USERS, apni availability ke SLOs, FEEDBACK LOOP, MEASURABLE outcomes (time-to-first-deploy < 1 day, % on golden path, tickets → ~0). WRAPPER → MANDATE dwara FORCED; ROUTE AROUND (shadow tooling); PEECHE LAG karта hai; platform team ek TICKET QUEUE hai; abstraction LEAKY. PRINCIPLE: platform adoption EARN karता hai. MANDATE karना padता hai → ABHI ACHA NAHI. "PAVED NOT WALLED": golden path 80% case BRILLIANTLY cover karता hai. 20% ke liye: lower level par drop kar sakते ho. GUARDRAILS AT ADMISSION enforced hain chahे kaise bhi. "Off the golden path" = SCAFFOLDING + support khो dete ho, security baseline NAHI. WALLED garden → unusual/HIGH-RISK workloads (ML + GPUs) OUTSIDE → guardrails riskiest cheezon ko chhodकर sab protect karते hain. Recurring deviation = ek NAYA golden path pave karने ka SIGNAL. BACKSTAGE: Spotify se, CNCF — PORTAL + CATALOG layer (catalog + SCAFFOLDER + TechDocs + PLUGINS). UI + catalog hai — POORA platform NAHI.',
      },
    ],

    keyTakeaways: [
      '"YOU BUILD IT, YOU RUN IT" stays true, but past ~50-100 engineers every team independently re-solving CI, k8s, IaC, secrets, networking, and observability is enormous duplicated effort, accidentally inconsistent/insecure, and buries product work. PLATFORM ENGINEERING is the response: a small team builds an internal developer platform (IDP) as a PRODUCT with the stream-aligned teams as customers.',
      'AN IDP is a thin layer over your existing infra providing: SELF-SERVICE (new service/DB/config in minutes, no ticket), GOLDEN PATHS (an opinionated supported way to do the common things), ABSTRACTION (describe WHAT, the platform generates the HOW), GUARDRAILS (the secure defaults from this course, applied automatically + enforced at admission), and GLUE (a catalog — usually Backstage).',
      'GOLDEN PATHS are PAVED, NOT WALLED: the recommended way is the fast/easy default, but a team can deviate to raw manifests or their own Terraform — they lose the scaffolding and higher-touch support, NOT the security baseline (which is enforced at admission regardless). A walled garden pushes the riskiest unusual workloads OUTSIDE the platform. A recurring deviation is a signal to pave a new path.',
      'THINNEST VIABLE PLATFORM: build the smallest thing that removes the CURRENT biggest friction, ship in weeks, measure, keep only if used — then iterate. Early on this is often a template + a Terraform module + a wiki page. Building a big bespoke platform (a custom DSL, a control plane) up front fails: it leaks on every non-trivial case, lags upstream, and has no users to learn from.',
      'REAL PLATFORM vs UNWANTED WRAPPER: a real platform earns VOLUNTARY adoption (it\'s the fast path), behaves like a product (roadmap, users, SLOs, feedback loop), and has measurable outcomes (time-to-first-deploy, % on the golden path). A wrapper is mandated, routed-around, lags its tools, and runs the platform team as a ticket queue. If you must mandate it, it is not good enough yet.',
    ],
    keyTakeawaysHi: [
      '"YOU BUILD IT, YOU RUN IT" true rehता hai, par ~50-100 engineers ke past har team ka independently CI, k8s, IaC, secrets, networking re-solve karना enormous duplicated effort hai, accidentally inconsistent/insecure, aur product work ko dabाता hai. PLATFORM ENGINEERING response hai: ek chhotी team ek IDP ko ek PRODUCT ke roop mein build karती hai jिske customers stream-aligned teams hain.',
      'EK IDP aapke existing infra ke upar ek thin layer hai jо provide karता hai: SELF-SERVICE (minutes mein naya service/DB/config, no ticket), GOLDEN PATHS (common cheezein karने ka ek opinionated supported tareeka), ABSTRACTION (WHAT describe karो, platform HOW generate karता hai), GUARDRAILS (is course se secure defaults, automatically applied + admission par enforced), aur GLUE (ek catalog — usually Backstage).',
      'GOLDEN PATHS PAVED hain, WALLED NAHI: recommended way fast/easy default hai, par ek team raw manifests ya apne Terraform par deviate kar sakती hai — wo scaffolding aur higher-touch support khो deती hai, security baseline NAHI (jо admission par enforced hai chahे kaise bhi). Ek walled garden riskiest unusual workloads ko platform ke BAHAR push karता hai.',
      'THINNEST VIABLE PLATFORM: sabse chhota cheez build karो jо CURRENT biggest friction remove karता hai, weeks mein ship karो, measure karो, sirf agar used to keep — phir iterate. Early on ye aksar ek template + ek Terraform module + ek wiki page hai. Ek bada bespoke platform up front build karना fail hoता hai: ye har non-trivial case par leak karता hai, upstream ke peeche lag karता hai.',
      'REAL PLATFORM vs UNWANTED WRAPPER: ek real platform VOLUNTARY adoption earn karता hai (ye fast path hai), ek product ki tarah behave karता hai (roadmap, users, SLOs, feedback loop), aur measurable outcomes hain. Ek wrapper mandated hai, route-around kiya jaता hai, apne tools ke peeche lag karता hai, aur platform team ko ek ticket queue ki tarah chalाता hai. Agar aapko ise mandate karना padता hai, ye abhi acha nahi hai.',
    ],
  },
];
