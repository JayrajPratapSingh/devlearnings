/**
 * DevOps Complete Course — Module 9: Kubernetes — Scaling, Scheduling, Storage
 * & Production Ops, lessons 4-6.
 *
 * Lesson 4: Stateful workloads — PV / PVC / StorageClass, dynamic provisioning,
 *           access modes, reclaim policy, StatefulSets & per-Pod storage.
 *           VERIFIED against a real cluster (kind + local-path provisioner).
 * Lesson 5: Jobs, CronJobs, RBAC & namespace governance — batch workloads,
 *           Role/ClusterRole/ServiceAccount, ResourceQuota, LimitRange,
 *           NetworkPolicy. VERIFIED (RBAC/quota/limits against kind).
 * Lesson 6: Helm vs Kustomize, managed vs self-managed, and when NOT to use
 *           Kubernetes. VERIFIED (`helm template`, `kubectl kustomize`).
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_9_PART2: CourseLesson[] = [
  {
    slug: 'ops-statefulsets-persistent-volumes-and-storage',
    title: 'Stateful Workloads — PVs, PVCs & StatefulSets',
    titleHi: 'Stateful Workloads — PVs, PVCs & StatefulSets',
    description: 'A Pod\'s filesystem dies with the Pod. A PersistentVolumeClaim is a request for durable storage that outlives any Pod; a StorageClass provisions the real disk on demand; and a StatefulSet gives each replica a stable name and its own PVC so a database cluster\'s members keep their identity and data across restarts and rescheduling.',
    descriptionHi: 'Ek Pod ka filesystem Pod ke saath marta hai. Ek PersistentVolumeClaim durable storage ke liye ek request hai jo kisi bhi Pod se zyada jeeta hai; ek StorageClass real disk on demand provision karta hai; aur ek StatefulSet har replica ko ek stable naam aur iska apna PVC deta hai taaki ek database cluster ke members restarts aur rescheduling ke across apni identity aur data rakhein.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**Hot-desking versus assigned offices with your own filing cabinet.** A normal Deployment Pod is a hot desk: you sit down, work on whatever is on the shared screen, and when you leave the desk is wiped for the next person — nothing you put *on the desk itself* survives (the container filesystem and \`emptyDir\`). A **PersistentVolumeClaim** is renting a filing cabinet from building services: you ask for "one cabinet, 50 litres, lockable" (the claim\'s size and access mode), facilities finds or builds one and gives you the key (dynamic provisioning via a **StorageClass**), and the cabinet stays yours and keeps its contents even when you are out sick and a temp uses your desk. A **StatefulSet** is the assigned-office model for a team: desk-0, desk-1, desk-2, each with a permanent nameplate and its *own* cabinet that is never reassigned — so when the person at desk-1 is replaced, the new hire sits at desk-1 and inherits desk-1\'s cabinet, not a random one.',
      hi: '**Hot-desking versus assigned offices apne filing cabinet ke saath.** Ek normal Deployment Pod ek hot desk hai: aap baithte ho, shared screen par jo hai us par kaam karte ho, aur jab aap jaate ho desk agle vyakti ke liye wipe ho jaata hai — kuch bhi jo aap *desk par khud* rakhte ho survive nahi karta (container filesystem aur \`emptyDir\`). Ek **PersistentVolumeClaim** building services se ek filing cabinet rent karna hai: aap "ek cabinet, 50 litres, lockable" maangte ho, facilities ek dhoondती ya banati hai aur aapko key deti hai (ek **StorageClass** ke through dynamic provisioning), aur cabinet aapka rehta hai. Ek **StatefulSet** ek team ke liye assigned-office model hai: desk-0, desk-1, desk-2, har ek ek permanent nameplate aur *apne* cabinet ke saath jo kabhi reassign nahi hota.',
    },

    simple: `**A POD's filesystem is EPHEMERAL. A PVC is durable storage that OUTLIVES the Pod.**
\`\`\`
container FS   gone on restart/reschedule. writable layer, not for data.
emptyDir      a scratch volume tied to the POD's life — gone when the Pod is deleted.
              (emptyDir.medium: Memory = a tmpfs RAM disk)
hostPath      a path on the NODE — node-specific, a security risk, almost never right.
PVC           a request for a PersistentVolume — SURVIVES Pod delete, reschedule, node loss.
\`\`\`

**THE PV / PVC / StorageClass triangle:**
\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata: { name: data }
spec:
  accessModes: [ ReadWriteOnce ]        # RWO: one node at a time (most block storage)
  storageClassName: fast                # which provisioner; omit -> the default class
  resources: { requests: { storage: 20Gi } }
\`\`\`
\`\`\`
StorageClass   names a PROVISIONER (ebs.csi / pd.csi / local-path / nfs ...) + params
               (type: gp3, iops, fsType) + reclaimPolicy + allowVolumeExpansion +
               volumeBindingMode.
PersistentVolume   the actual piece of storage. with dynamic provisioning you never write
                   one — the StorageClass creates it when a PVC needs it.
PVC -> binds to a PV 1:1. a Pod mounts the PVC by name.
\`\`\`

**ACCESS MODES:** \`ReadWriteOnce\` (RWO — one node), \`ReadWriteOncePod\` (exactly one Pod),
\`ReadOnlyMany\` (ROX), \`ReadWriteMany\` (RWX — needs a shared FS: NFS, EFS, CephFS).
**RECLAIM POLICY:** \`Delete\` (default for dynamic — PV + disk deleted when the PVC is) vs
\`Retain\` (PV kept, data preserved, you clean up manually). **\`volumeBindingMode:
WaitForFirstConsumer\`** — don't provision the disk until a Pod using the PVC is scheduled,
so the disk lands in the same zone as the Pod.

**STATEFULSET** (not Deployment) for anything with per-instance identity or storage:
\`\`\`
- stable network id: pod names are <sts>-0, <sts>-1, ... (ordinal, not random hash)
  + a headless Service -> stable DNS <pod>.<svc>.<ns>.svc.cluster.local
- 'volumeClaimTemplates' -> each Pod gets its OWN PVC (data-<sts>-0, data-<sts>-1)
- ordered, one-at-a-time create/scale-up (0,1,2) and terminate (2,1,0); ordered rolling update
- scaling DOWN does NOT delete the PVCs — deliberate, so you don't lose data by scaling
\`\`\``,

    simpleHi: `**Ek POD ka filesystem EPHEMERAL hai. Ek PVC durable storage hai jo Pod se zyada JEETA hai.**
\`\`\`
container FS   restart/reschedule par gone. writable layer, data ke liye nahi.
emptyDir      ek scratch volume POD ke life se tied — gone jab Pod delete hota hai.
hostPath      NODE par ek path — node-specific, ek security risk, lagbhag kabhi sahi nahi.
PVC           ek PersistentVolume ke liye request — Pod delete, reschedule, node loss SURVIVE karta hai.
\`\`\`

**PV / PVC / StorageClass triangle:**
\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata: { name: data }
spec:
  accessModes: [ ReadWriteOnce ]        # RWO: ek node ek baar mein
  storageClassName: fast                # kaunsa provisioner; omit -> default class
  resources: { requests: { storage: 20Gi } }
\`\`\`
\`\`\`
StorageClass   ek PROVISIONER name karta hai (ebs.csi / pd.csi / local-path / nfs) + params
               + reclaimPolicy + allowVolumeExpansion + volumeBindingMode.
PersistentVolume   storage ka actual piece. dynamic provisioning ke saath aap kabhi ek nahi likhte.
PVC -> ek PV se 1:1 bind hota hai. ek Pod PVC ko naam se mount karta hai.
\`\`\`

**ACCESS MODES:** \`ReadWriteOnce\` (RWO — ek node), \`ReadWriteOncePod\` (theek ek Pod),
\`ReadOnlyMany\` (ROX), \`ReadWriteMany\` (RWX — ek shared FS chahiye: NFS, EFS, CephFS).
**RECLAIM POLICY:** \`Delete\` (dynamic ke liye default) vs \`Retain\` (PV kept, data preserved).
**\`volumeBindingMode: WaitForFirstConsumer\`** — disk provision mat karo jab tak PVC use karne
wala ek Pod schedule na ho, taaki disk Pod ke same zone mein land kare.

**STATEFULSET** (Deployment nahi) kisi bhi cheez ke liye jismein per-instance identity ya storage hai:
\`\`\`
- stable network id: pod names <sts>-0, <sts>-1, ... (ordinal, random hash nahi)
  + ek headless Service -> stable DNS <pod>.<svc>.<ns>.svc.cluster.local
- 'volumeClaimTemplates' -> har Pod ko iska APNA PVC milta hai (data-<sts>-0, data-<sts>-1)
- ordered, ek-baar-mein create/scale-up (0,1,2) aur terminate (2,1,0)
- scaling DOWN PVCs ko DELETE NAHI karta — deliberate
\`\`\``,

    content: `## Ephemeral by default

A container's filesystem is a writable layer on top of the image, and it is discarded when the container is recreated — which happens on every crash, every rollout, every reschedule. An **\`emptyDir\`** volume is scratch space that shares the *Pod's* lifetime: it survives a container restart within the Pod but is deleted when the Pod is. **\`hostPath\`** mounts a directory from the node itself, which ties the Pod to that node, breaks when it reschedules, and is a serious security hole (a Pod can read the node's files) — it is almost never the right answer outside of node-level agents.

For data that must outlive a Pod, you need a **PersistentVolume**.

## PV, PVC, StorageClass

Three objects, working together:

- A **PersistentVolume (PV)** is a real piece of storage in the cluster — an EBS volume, a GCE disk, an NFS export, a local directory.
- A **PersistentVolumeClaim (PVC)** is a namespaced *request* for storage: "I need 20 GiB, ReadWriteOnce, from the \`fast\` class." A Pod references the PVC by name in its \`volumes\`.
- A **StorageClass** defines *how* PVs are made: which **provisioner** (a CSI driver: \`ebs.csi.aws.com\`, \`pd.csi.storage.gke.io\`, \`rancher.io/local-path\`, an NFS provisioner), what **parameters** (disk type \`gp3\`, IOPS, filesystem), the **reclaimPolicy**, whether **volume expansion** is allowed, and the **volumeBindingMode**.

**Dynamic provisioning** is the normal path: you create only the PVC, the StorageClass's provisioner creates a matching PV (and the underlying disk) automatically, and the PVC **binds** to it one-to-one. You almost never write a PV by hand; static PVs exist mainly for pre-existing storage you are importing.

## Access modes

The access mode is a property of the PVC and the PV, describing how it can be mounted:

- **\`ReadWriteOnce\` (RWO)** — mountable read-write by Pods on **a single node**. This is what almost all block storage (EBS, GCE PD, Azure Disk) supports. Multiple Pods can share it *only if they are on the same node*.
- **\`ReadWriteOncePod\`** — read-write by **exactly one Pod** in the whole cluster. Stronger than RWO; use it when two Pods writing the same volume would corrupt data.
- **\`ReadOnlyMany\` (ROX)** — read-only by many nodes.
- **\`ReadWriteMany\` (RWX)** — read-write by many nodes at once. Requires a **shared filesystem** — NFS, AWS EFS, CephFS, Azure Files. Block storage cannot do this. Wanting RWX is often a design smell: prefer object storage or a database.

## Reclaim policy and binding mode

- **\`reclaimPolicy\`** — what happens to the PV when its PVC is deleted. \`Delete\` (the default for dynamically provisioned volumes) removes the PV **and the underlying disk** — convenient, and a data-loss footgun. \`Retain\` keeps the PV and its data; you release and clean it up manually. Production databases usually want \`Retain\` or a StorageClass configured for it.
- **\`volumeBindingMode\`** — \`Immediate\` provisions the disk as soon as the PVC is created; \`WaitForFirstConsumer\` waits until a Pod that uses the PVC is being scheduled, then provisions the disk **in the same zone as the Pod**. On a multi-zone cluster \`WaitForFirstConsumer\` is essential — otherwise the disk can be created in zone A and the Pod forced into zone A forever, or worse, the Pod cannot start because its disk is in a zone it was not scheduled to.
- **\`allowVolumeExpansion: true\`** on the StorageClass lets you grow a PVC by editing \`spec.resources.requests.storage\` upward (never down). The CSI driver resizes the disk and filesystem online for most drivers. Not all provisioners support it — kind's \`local-path\`, for instance, does not.

## StatefulSet

A **Deployment** treats its Pods as interchangeable: random name suffixes, any order, all sharing one PVC if they have one. That is wrong for anything with per-instance state — a database, a message broker, a consensus system. A **StatefulSet** provides:

- **Stable, ordinal identity.** Pods are named \`<name>-0\`, \`<name>-1\`, \`<name>-2\`. A replacement for \`<name>-1\` is also called \`<name>-1\`. Paired with a **headless Service** (\`clusterIP: None\`), each Pod gets a stable DNS name \`<name>-1.<service>.<ns>.svc.cluster.local\`, so peers can address each other directly.
- **Per-Pod storage.** \`volumeClaimTemplates\` is a template from which the StatefulSet creates **one PVC per Pod** — \`data-<name>-0\`, \`data-<name>-1\` — each bound to its own PV. Pod \`<name>-1\` always mounts \`data-<name>-1\`, even after it is rescheduled to a different node.
- **Ordered operations.** Scale-up creates Pods in order 0, 1, 2, each waiting for the previous to be Ready. Scale-down and deletion happen in reverse: 2, 1, 0. Rolling updates go in reverse ordinal order too. (\`podManagementPolicy: Parallel\` opts out of the ordering for create/scale, keeping it for updates.)
- **PVCs are not deleted on scale-down.** Scaling a StatefulSet from 3 to 1 removes Pods \`-2\` and \`-1\` but **keeps** \`data-<name>-2\` and \`data-<name>-1\`, so scaling back up re-attaches the same data. Deleting the PVCs is a deliberate manual step (or opt in via \`persistentVolumeClaimRetentionPolicy\`).

StatefulSets solve identity and storage, not clustering logic — forming a Raft quorum, configuring replication, electing a primary is still the application's or an operator's job.`,

    contentHi: `## Default se ephemeral

Ek container ka filesystem image ke upar ek writable layer hai, aur ye discard hota hai jab container recreate hota hai — jo har crash, har rollout, har reschedule par hota hai. Ek **\`emptyDir\`** volume scratch space hai jo *Pod ka* lifetime share karta hai: ye Pod ke andar ek container restart survive karta hai par delete hota hai jab Pod hota hai. **\`hostPath\`** node se hi ek directory mount karta hai, jo Pod ko us node se tie karta hai, reschedule par tootta hai, aur ek serious security hole hai.

Data ke liye jise ek Pod se zyada jeena chahiye, aapko ek **PersistentVolume** chahiye.

## PV, PVC, StorageClass

Teen objects, saath kaam karte hue:
- Ek **PersistentVolume (PV)** cluster mein storage ka ek real piece hai.
- Ek **PersistentVolumeClaim (PVC)** storage ke liye ek namespaced *request* hai.
- Ek **StorageClass** define karta hai ki PVs *kaise* bante hain: kaunsa **provisioner** (ek CSI driver), kya **parameters**, **reclaimPolicy**, kya **volume expansion** allowed hai, aur **volumeBindingMode**.

**Dynamic provisioning** normal path hai: aap sirf PVC banate ho, StorageClass ka provisioner ek matching PV automatically banata hai, aur PVC ise one-to-one **bind** karta hai.

## Access modes

- **\`ReadWriteOnce\` (RWO)** — **ek single node** par Pods dwara read-write mountable. Ye wo hai jo lagbhag saara block storage support karta hai.
- **\`ReadWriteOncePod\`** — poore cluster mein **theek ek Pod** dwara read-write.
- **\`ReadOnlyMany\` (ROX)** — kai nodes dwara read-only.
- **\`ReadWriteMany\` (RWX)** — ek saath kai nodes dwara read-write. Ek **shared filesystem** chahiye — NFS, EFS, CephFS. Block storage ye nahi kar sakta.

## Reclaim policy aur binding mode

- **\`reclaimPolicy\`** — jab iska PVC delete hota hai to PV ka kya hota hai. \`Delete\` (dynamic ke liye default) PV **aur underlying disk** remove karta hai. \`Retain\` PV aur iska data rakhta hai.
- **\`volumeBindingMode\`** — \`Immediate\` disk ko turant provision karta hai; \`WaitForFirstConsumer\` wait karta hai jab tak PVC use karne wala ek Pod schedule na ho, phir disk ko **Pod ke same zone mein** provision karta hai. Ek multi-zone cluster par \`WaitForFirstConsumer\` essential hai.
- **\`allowVolumeExpansion: true\`** StorageClass par aapko ek PVC ko \`spec.resources.requests.storage\` upar edit karके grow karne deta hai (kabhi neeche nahi).

## StatefulSet

Ek **Deployment** apne Pods ko interchangeable treat karta hai. Ye per-instance state wali kisi bhi cheez ke liye galat hai. Ek **StatefulSet** deta hai:
- **Stable, ordinal identity.** Pods \`<name>-0\`, \`<name>-1\` named hain. Ek **headless Service** ke saath paired, har Pod ko ek stable DNS name milta hai.
- **Per-Pod storage.** \`volumeClaimTemplates\` ek template hai jisse StatefulSet **per Pod ek PVC** banata hai. Pod \`<name>-1\` hamesha \`data-<name>-1\` mount karta hai.
- **Ordered operations.** Scale-up Pods ko order 0, 1, 2 mein banata hai. Scale-down aur deletion reverse mein: 2, 1, 0.
- **PVCs scale-down par delete nahi hote.** Ek StatefulSet ko 3 se 1 scale karna Pods \`-2\` aur \`-1\` remove karta hai par \`data-<name>-2\` aur \`data-<name>-1\` **rakhta hai**.

StatefulSets identity aur storage solve karte hain, clustering logic nahi.`,

    examples: [
      {
        title: 'A PVC survives its Pod: one Pod writes a file, a later Pod on the same claim reads it',
        titleHi: 'Ek PVC apne Pod ko survive karta hai: ek Pod ek file likhta hai, usi claim par ek baad ka Pod ise padhta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m9l4-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: PersistentVolumeClaim
metadata: { name: data }
spec:
  accessModes: [ ReadWriteOnce ]
  resources: { requests: { storage: 64Mi } }
YAML
echo "PVC right after create: $(kubectl -n "$ns" get pvc data -o jsonpath='{.status.phase}')  ('WaitForFirstConsumer' - no disk until a Pod needs it)"

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Pod
metadata: { name: writer }
spec:
  restartPolicy: Never
  containers:
    - name: c
      image: busybox:1.36
      command: [ "sh", "-c", "echo 'state written by writer' > /data/db.txt; sync" ]
      volumeMounts: [ { name: d, mountPath: /data } ]
  volumes: [ { name: d, persistentVolumeClaim: { claimName: data } } ]
YAML
kubectl -n "$ns" wait --for=jsonpath='{.status.phase}'=Succeeded pod/writer --timeout=90s >/dev/null
echo "PVC after the first Pod:  $(kubectl -n "$ns" get pvc data -o jsonpath='{.status.phase}')  (a PV was dynamically provisioned + bound)"
kubectl -n "$ns" delete pod writer >/dev/null

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Pod
metadata: { name: reader }
spec:
  restartPolicy: Never
  containers:
    - name: c
      image: busybox:1.36
      command: [ "cat", "/data/db.txt" ]
      volumeMounts: [ { name: d, mountPath: /data } ]
  volumes: [ { name: d, persistentVolumeClaim: { claimName: data } } ]
YAML
kubectl -n "$ns" wait --for=jsonpath='{.status.phase}'=Succeeded pod/reader --timeout=90s >/dev/null
echo "a brand-new Pod, same PVC, reads: \\"$(kubectl -n "$ns" logs reader)\\""
echo "(the first Pod is long gone - the data is in the PersistentVolume, not the Pod.)"`,
        output: `PVC right after create: Pending  ('WaitForFirstConsumer' - no disk until a Pod needs it)
PVC after the first Pod:  Bound  (a PV was dynamically provisioned + bound)
a brand-new Pod, same PVC, reads: "state written by writer"
(the first Pod is long gone - the data is in the PersistentVolume, not the Pod.)`,
        explain: 'A PersistentVolumeClaim is created asking for a small amount of ReadWriteOnce storage from the default StorageClass. Immediately after creation the claim sits in Pending, because the default class uses WaitForFirstConsumer binding — it will not provision a real disk until a Pod that mounts the claim is actually scheduled, so that the disk is placed in the right zone. A first Pod then mounts the claim, writes a line to a file on it, and exits. That act of scheduling triggers the provisioner: a PersistentVolume and its backing disk are created and the claim moves to Bound. The first Pod is deleted. A second, entirely separate Pod is created that mounts the same claim by name and simply reads the file, and it sees the line the first Pod wrote. The data survived because it lives in the PersistentVolume, which is bound to the claim and independent of any Pod\'s lifecycle — deleting the Pod that wrote it changed nothing. This is the whole point of a PVC: durable storage that Pods attach to and detach from without the data going anywhere.',
        explainHi: 'Ek PersistentVolumeClaim create hota hai jo default StorageClass se ReadWriteOnce storage ki ek chhoti amount maangता hai. Creation ke turant baad claim Pending mein baithta hai, kyunki default class WaitForFirstConsumer binding use karta hai — ye ek real disk provision nahi karega jab tak claim ko mount karne wala ek Pod actually schedule na ho. Ek pehla Pod phir claim mount karta hai, ispar ek file mein ek line likhta hai, aur exit karta hai. Wo scheduling ka act provisioner ko trigger karta hai: ek PersistentVolume aur iski backing disk create hoti hai aur claim Bound ho jaata hai. Pehla Pod delete hota hai. Ek doosra, poori tarah separate Pod create hota hai jo same claim ko naam se mount karta hai aur file padhta hai, aur ye wo line dekhta hai jo pehle Pod ne likhi thi. Data survive kiya kyunki ye PersistentVolume mein rehta hai.',
      },
      {
        title: 'A StatefulSet gives each Pod a stable name and its own PVC; scaling down keeps the PVCs',
        titleHi: 'Ek StatefulSet har Pod ko ek stable naam aur iska apna PVC deta hai; scale down PVCs rakhta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m9l4b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Service
metadata: { name: db }
spec: { clusterIP: None, selector: { app: db }, ports: [ { port: 80 } ] }   # headless
---
apiVersion: apps/v1
kind: StatefulSet
metadata: { name: db }
spec:
  serviceName: db
  replicas: 3
  selector: { matchLabels: { app: db } }
  template:
    metadata: { labels: { app: db } }
    spec:
      containers:
        - name: c
          image: registry.k8s.io/pause:3.9
          volumeMounts: [ { name: data, mountPath: /data } ]
  volumeClaimTemplates:
    - metadata: { name: data }
      spec: { accessModes: [ ReadWriteOnce ], resources: { requests: { storage: 64Mi } } }
YAML
kubectl -n "$ns" rollout status statefulset/db --timeout=120s >/dev/null

echo "Pods (ordinal + stable, NOT random hashes): $(kubectl -n "$ns" get pod -l app=db -o jsonpath='{.items[*].metadata.name}')"
echo "one PVC PER Pod:                            $(kubectl -n "$ns" get pvc -o jsonpath='{.items[*].metadata.name}' | tr ' ' '\\n' | sort | paste -sd' ' -)"

kubectl -n "$ns" scale statefulset db --replicas=1 >/dev/null
for i in $(seq 1 20); do [ "$(kubectl -n "$ns" get pod -l app=db --no-headers 2>/dev/null | grep -c .)" = 1 ] && break; sleep 3; done
echo "--- after scaling 3 -> 1 ---"
echo "Pods now:  $(kubectl -n "$ns" get pod -l app=db -o jsonpath='{.items[*].metadata.name}')  (terminated in reverse: db-2 then db-1)"
echo "PVCs now:  $(kubectl -n "$ns" get pvc -o jsonpath='{.items[*].metadata.name}' | tr ' ' '\\n' | sort | paste -sd' ' -)  <- all 3 KEPT (scaling down never deletes a StatefulSet PVC)"`,
        output: `Pods (ordinal + stable, NOT random hashes): db-0 db-1 db-2
one PVC PER Pod:                            data-db-0 data-db-1 data-db-2
--- after scaling 3 -> 1 ---
Pods now:  db-0  (terminated in reverse: db-2 then db-1)
PVCs now:  data-db-0 data-db-1 data-db-2  <- all 3 KEPT (scaling down never deletes a StatefulSet PVC)`,
        explain: 'A StatefulSet of three replicas is created with a headless Service and a volumeClaimTemplate. The Pods come up named db-0, db-1, and db-2 — ordinal names, not the random suffixes a Deployment uses — and each is created only after the previous one is Ready. The volumeClaimTemplate causes the StatefulSet to create a separate PersistentVolumeClaim for each Pod: data-db-0, data-db-1, data-db-2, each bound to its own volume. Pod db-1 will always mount data-db-1, including after it is deleted and recreated, possibly on a different node. The StatefulSet is then scaled down to one replica. The Pods are removed in reverse ordinal order, db-2 first then db-1, leaving only db-0. But the three PVCs all remain: scaling a StatefulSet down never deletes its claims, because the assumption is that the data is valuable and you may scale back up. If db-1 and db-2 are recreated later they re-bind to the same data-db-1 and data-db-2 and recover their state. Removing that storage is an explicit manual action, or an opt-in retention policy.',
        explainHi: 'Teen replicas ka ek StatefulSet ek headless Service aur ek volumeClaimTemplate ke saath create hota hai. Pods db-0, db-1, aur db-2 named up aate hain — ordinal names, wo random suffixes nahi jo ek Deployment use karta hai — aur har ek sirf tab create hota hai jab pichhla Ready ho. volumeClaimTemplate StatefulSet ko har Pod ke liye ek separate PersistentVolumeClaim banate hai: data-db-0, data-db-1, data-db-2. Pod db-1 hamesha data-db-1 mount karega. StatefulSet phir ek replica par scale down hota hai. Pods reverse ordinal order mein remove hote hain, pehle db-2 phir db-1, sirf db-0 chhodkar. Par teenों PVCs sab rehte hain: ek StatefulSet ko scale down karna kabhi iske claims delete nahi karta.',
      },
    ],

    mistakes: [
      {
        wrong: `# a StatefulSet DB (or any RWO workload) with strategy that assumes shared storage
apiVersion: apps/v1
kind: Deployment                # <-- Deployment, not StatefulSet
metadata: { name: postgres }
spec:
  replicas: 3                    # 3 Pods...
  template:
    spec:
      volumes:
        - name: data
          persistentVolumeClaim: { claimName: pg-data }   # ...all mounting ONE RWO PVC
# RWO = one node. if the scheduler spreads the 3 Pods across nodes, 2 of them can't mount
# and stay ContainerCreating forever. if they land on one node, 3 postgres processes now
# write the same data dir -> instant corruption.`,
        right: `# stateful, per-instance storage -> StatefulSet + volumeClaimTemplates:
apiVersion: apps/v1
kind: StatefulSet
metadata: { name: postgres }
spec:
  serviceName: postgres         # a headless Service for stable DNS
  replicas: 3
  template: { ... }
  volumeClaimTemplates:
    - metadata: { name: data }
      spec: { accessModes: [ ReadWriteOnce ], resources: { requests: { storage: 100Gi } } }
# now each Pod (postgres-0/1/2) gets its OWN PVC + PV. replication between them is
# postgres's job (or an operator's - CloudNativePG, Zalando) - K8s only gives identity+disk.`,
        why: 'A ReadWriteOnce PersistentVolumeClaim can be mounted read-write only by Pods on a single node, and a Deployment schedules its replicas independently, typically spreading them across nodes. Pointing several Deployment replicas at one RWO claim therefore has two failure modes. If the Pods land on different nodes, only the Pod on the node that holds the volume can mount it; the others stay stuck in ContainerCreating because the volume cannot attach to their nodes. If the scheduler happens to place them all on one node, they all mount the same directory and multiple database processes write the same files concurrently, which corrupts the data almost immediately. Stateful workloads with per-instance data need a StatefulSet with volumeClaimTemplates, which gives every Pod its own claim and its own volume, plus stable ordinal identity and a headless Service for peer discovery. Kubernetes then provides identity and storage; making the instances into a working replicated cluster — streaming replication, failover, leader election — remains the responsibility of the database or a dedicated operator.',
        whyHi: 'Ek ReadWriteOnce PersistentVolumeClaim sirf ek single node par Pods dwara read-write mount ho sakta hai, aur ek Deployment apne replicas independently schedule karta hai, typically unhe nodes ke across spread karके. Kई Deployment replicas ko ek RWO claim par point karne ke isliye do failure modes hain. Agar Pods alag nodes par land karte hain, sirf us node par ka Pod jo volume rakhta hai ise mount kar sakta hai; baaki ContainerCreating mein atke rehte hain. Agar scheduler unhe sab ek node par place karta hai, wo sab same directory mount karte hain aur multiple database processes same files concurrently likhte hain, jo data ko corrupt karta hai. Per-instance data wale stateful workloads ko volumeClaimTemplates ke saath ek StatefulSet chahiye.',
      },
      {
        wrong: `# a dynamically provisioned PVC for a production DB, left on the default reclaimPolicy
$ kubectl get sc standard -o jsonpath='{.reclaimPolicy}'
  Delete
# 6 months later, someone cleans up "unused" namespaces:
$ kubectl delete namespace old-staging
# the PVC in it is deleted -> the PV is deleted -> the EBS volume is DELETED ->
# 400GB of the only copy of that data is gone. no undo.`,
        right: `# for anything you can't afford to lose, use Retain (on the SC, or patch the PV):
# option A - a StorageClass with reclaimPolicy: Retain for stateful data
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata: { name: retain-ssd }
provisioner: ebs.csi.aws.com
parameters: { type: gp3 }
reclaimPolicy: Retain
# option B - patch the live PV so deleting the PVC only *releases* it (data kept):
$ kubectl patch pv <pv-name> -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
# and take real backups (Velero / volume snapshots) - Retain protects against the
# accidental 'kubectl delete', not against corruption or a region outage.`,
        why: 'A dynamically provisioned PersistentVolume inherits the reclaimPolicy of its StorageClass, and for most default classes that value is Delete. With Delete, removing the PersistentVolumeClaim — directly, or as a side effect of deleting the namespace that contains it — also deletes the bound PersistentVolume and instructs the CSI driver to delete the underlying cloud disk. There is no confirmation and no recycle bin; a routine namespace cleanup can permanently destroy the only copy of a production dataset. Setting the reclaim policy to Retain breaks that chain: deleting the PVC leaves the PV in a Released state with the disk intact, and an operator must consciously decide to reuse or delete it. Retain should be the default for any storage class used by databases or other data you cannot recreate. It is not a substitute for backups, though — it only protects against accidental deletion of the Kubernetes objects, not against data corruption, a bad migration, ransomware, or the loss of the region the disk lives in, all of which require real, tested, off-site backups such as volume snapshots or a tool like Velero.',
        whyHi: 'Ek dynamically provisioned PersistentVolume apne StorageClass ki reclaimPolicy inherit karta hai, aur zyadaatar default classes ke liye wo value Delete hai. Delete ke saath, PersistentVolumeClaim ko remove karna — directly, ya ise contain karne wale namespace ko delete karne ke ek side effect ke roop mein — bound PersistentVolume ko bhi delete karta hai aur CSI driver ko underlying cloud disk delete karne ka instruct karta hai. Koi confirmation nahi aur koi recycle bin nahi. Reclaim policy ko Retain set karna us chain ko todता hai: PVC delete karna PV ko ek Released state mein chhodता hai disk intact ke saath. Retain databases ke liye default hona chahiye. Ye backups ka substitute nahi hai.',
      },
      {
        wrong: `# reaching for ReadWriteMany because "all the Pods need the files"
spec:
  accessModes: [ ReadWriteMany ]     # on a block-storage StorageClass
# -> the PVC never binds (block storage can't do RWX); Pods stuck Pending.
# or you bolt on an NFS server to get RWX and now have a single-writer bottleneck +
# a SPOF + file-locking bugs, to share what is really just... application state.`,
        right: `# RWX is rarely the right tool. first ask what the shared data actually is:
#   - user uploads / assets / artifacts   -> OBJECT STORAGE (S3/GCS) via the SDK, not a volume
#   - shared application/session state     -> a DATABASE or Redis
#   - read-only config/data bundle         -> bake into the image, or a ConfigMap, or an initContainer
#                                             that pulls it; ReadOnlyMany if it's large + truly static
#   - genuinely need a POSIX shared FS      -> EFS / Filestore / CephFS, eyes open about the
#                                             throughput ceiling and the new SPOF
# most "we need RWX" turns out to be "we haven't picked a datastore".`,
        why: 'ReadWriteMany means many nodes mounting the same volume read-write simultaneously, which block storage — the kind behind almost every default StorageClass — cannot provide, so a PVC that requests it against a block-storage class never binds and its Pods stay Pending. Obtaining RWX requires a shared filesystem such as NFS, EFS, or CephFS, which brings a single-writer coordination point, a new single point of failure, and the file-locking and consistency subtleties of network filesystems. Before taking that on, it is worth identifying what the shared data really is, because each common case has a better home: user-uploaded files and build artifacts belong in object storage accessed through its SDK rather than mounted as a filesystem; shared mutable application or session state belongs in a database or a cache; a read-only bundle of config or reference data can be baked into the image, supplied as a ConfigMap, or fetched by an init container, and only needs ReadOnlyMany if it is large and static. A real POSIX shared filesystem is occasionally the right answer, but most requests for RWX are really an unmade decision about which datastore to use.',
        whyHi: 'ReadWriteMany ka matlab kai nodes same volume ko ek saath read-write mount karte hain, jo block storage nahi de sakta, to ek PVC jo ise ek block-storage class ke against request karta hai kabhi bind nahi hota. RWX paane ke liye ek shared filesystem chahiye jaise NFS, EFS, ya CephFS, jo ek single-writer coordination point, ek naya single point of failure laata hai. Ise lene se pehle, ye identify karna worthwhile hai ki shared data really kya hai: user-uploaded files object storage mein belong karte hain; shared mutable state ek database ya cache mein; ek read-only bundle image mein baked ho sakta hai. Zyadaatar RWX ke requests really ek unmade decision hain.',
      },
    ],

    realWorld: [
      {
        en: '**A "database" running as a 3-replica Deployment on one RWO PVC** — it worked in dev (one node) and corrupted itself the first time the pods spread across two nodes in staging. Rebuilt as a StatefulSet with `volumeClaimTemplates`; the corruption stopped.',
        hi: '**Ek "database" jo ek RWO PVC par ek 3-replica Deployment ke roop mein chal raha tha** — ye dev mein kaam kiya aur pehli baar khud ko corrupt kiya jab pods staging mein do nodes ke across spread hue. Ek StatefulSet ke roop mein rebuild kiya.',
      },
      {
        en: '**400 GB of production data deleted by `kubectl delete namespace`** — the StorageClass was `reclaimPolicy: Delete` and the PVC lived in a namespace someone tidied up. Now every stateful class is `Retain` and there are nightly volume snapshots.',
        hi: '**400 GB production data `kubectl delete namespace` se delete hua** — StorageClass `reclaimPolicy: Delete` tha. Ab har stateful class `Retain` hai aur nightly volume snapshots hain.',
      },
      {
        en: '**Pods stuck `ContainerCreating` for an hour after a zone outage** — `volumeBindingMode: Immediate` had provisioned the disks in `us-east-1a`; when that zone went down the scheduler put the Pods in `1b` but the disks could not follow. Switching the class to `WaitForFirstConsumer` fixed the placement.',
        hi: '**Ek zone outage ke baad Pods ek ghante ke liye `ContainerCreating` atke** — `volumeBindingMode: Immediate` ne disks ko `us-east-1a` mein provision kiya tha. Class ko `WaitForFirstConsumer` par switch karna.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the relationship between a PersistentVolume, a PersistentVolumeClaim, and a StorageClass, and what dynamic provisioning does.',
        qHi: 'Ek PersistentVolume, ek PersistentVolumeClaim, aur ek StorageClass ke beech relationship samjhao.',
        a: 'A PersistentVolume is an actual piece of storage known to the cluster — a cloud disk, an NFS export, a local directory. A PersistentVolumeClaim is a namespaced request that a workload makes: an amount of storage, an access mode, and optionally a StorageClass name. A Pod refers to the claim by name in its volumes. A StorageClass describes how volumes of a given kind are created: which provisioner or CSI driver to call, parameters like disk type and IOPS, the reclaim policy, whether expansion is allowed, and the binding mode. With dynamic provisioning, which is the normal case, you create only the claim; the StorageClass named on it (or the cluster default) invokes its provisioner, which creates a matching PersistentVolume and the real disk behind it, and the claim binds to that volume one to one. You almost never author a PersistentVolume by hand — static PVs are mostly for adopting storage that already exists. When the claim is deleted, the reclaim policy decides the fate of the volume: Delete, the default for dynamic volumes, destroys the PV and the disk; Retain keeps both and leaves cleanup to an operator.',
        aHi: 'Ek PersistentVolume cluster ko known storage ka ek actual piece hai. Ek PersistentVolumeClaim ek namespaced request hai jo ek workload banata hai: storage ki ek amount, ek access mode, aur optionally ek StorageClass name. Ek Pod claim ko naam se refer karta hai. Ek StorageClass describe karta hai ki ek diye gaye kind ke volumes kaise bante hain: kaunsa provisioner call karna hai, parameters, reclaim policy, aur binding mode. Dynamic provisioning ke saath, aap sirf claim banate ho; ispar named StorageClass apne provisioner ko invoke karta hai, jo ek matching PersistentVolume aur iske peeche real disk banata hai. Jab claim delete hota hai, reclaim policy volume ka fate decide karta hai: Delete PV aur disk destroy karta hai; Retain dono rakhta hai.',
      },
      {
        q: 'When do you need a StatefulSet instead of a Deployment, and what does it actually guarantee?',
        qHi: 'Aapko ek Deployment ke bajaay ek StatefulSet kab chahiye, aur ye actually kya guarantee karta hai?',
        a: 'You need a StatefulSet whenever the replicas are not interchangeable — when each one has its own identity or its own data. Databases, message brokers, and consensus systems like etcd or ZooKeeper are the typical cases. A Deployment gives its Pods random name suffixes, starts and stops them in any order, and if they use a volume they all share one claim, none of which works for a member of a cluster. A StatefulSet guarantees three things. First, stable ordinal identity: Pods are named name-0, name-1, name-2, and a replacement for name-1 is again name-1; combined with a headless Service this gives each Pod a stable DNS record so peers can find each other. Second, per-Pod storage through volumeClaimTemplates: the StatefulSet creates one PVC per Pod, and Pod name-1 always mounts its own data-name-1 even after rescheduling. Third, ordered lifecycle: scale-up and rolling updates proceed one Pod at a time in order, scale-down and deletion in reverse order, and scaling down never deletes the PVCs so data is preserved. What it does not do is make the instances a working cluster — replication, failover, and primary election are still the application\'s or an operator\'s job.',
        aHi: 'Aapko ek StatefulSet chahiye jab bhi replicas interchangeable nahi hain — jab har ek ki apni identity ya apna data hai. Databases, message brokers, aur consensus systems typical cases hain. Ek Deployment apne Pods ko random name suffixes deta hai, unhe kisi bhi order mein start aur stop karta hai. Ek StatefulSet teen cheezein guarantee karta hai. Pehla, stable ordinal identity: Pods name-0, name-1 named hain; ek headless Service ke saath combined ye har Pod ko ek stable DNS record deta hai. Doosra, volumeClaimTemplates ke through per-Pod storage: StatefulSet per Pod ek PVC banata hai. Teesra, ordered lifecycle: scale-up ek Pod ek baar mein order mein, scale-down reverse mein, aur scaling down kabhi PVCs delete nahi karta. Jo ye nahi karta wo instances ko ek working cluster banana hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, describe the ephemeral storage options and the PV/PVC/StorageClass triangle, including what dynamic provisioning and `WaitForFirstConsumer` do.',
        taskHi: 'Ek comment mein, ephemeral storage options aur PV/PVC/StorageClass triangle describe karo.',
        hint: 'EPHEMERAL: container FS = a writable layer on the image, GONE on every restart/reschedule. `emptyDir` = scratch tied to the POD\'s life (survives a container restart, gone when the Pod is deleted; `medium: Memory` = tmpfs RAM disk). `hostPath` = a dir from the NODE — ties the Pod to that node, breaks on reschedule, security hole (Pod reads node files) — almost never right. TRIANGLE: **PV** = a real piece of storage (cloud disk / NFS export / local dir). **PVC** = a namespaced REQUEST (size + accessMode + optional storageClassName); a Pod mounts it by name. **StorageClass** = HOW PVs are made — names a provisioner/CSI driver + params (type gp3, iops, fsType) + `reclaimPolicy` + `allowVolumeExpansion` + `volumeBindingMode`. DYNAMIC PROVISIONING (the normal path): you create ONLY the PVC → the StorageClass\'s provisioner creates a matching PV + the real disk → the PVC binds 1:1. You almost never hand-write a PV. `volumeBindingMode: WaitForFirstConsumer` = don\'t provision the disk until a Pod using the PVC is being scheduled, so the disk lands in the SAME ZONE as the Pod (essential on multi-zone clusters; `Immediate` provisions right away and can strand a Pod away from its disk).',
        hintHi: 'EPHEMERAL: container FS = image par ek writable layer, har restart/reschedule par GONE. `emptyDir` = POD ke life se tied scratch. `hostPath` = NODE se ek dir — Pod ko us node se tie karta hai, security hole — lagbhag kabhi sahi nahi. TRIANGLE: **PV** = storage ka ek real piece. **PVC** = ek namespaced REQUEST (size + accessMode + optional storageClassName). **StorageClass** = PVs KAISE bante hain — ek provisioner + params + `reclaimPolicy` + `allowVolumeExpansion` + `volumeBindingMode`. DYNAMIC PROVISIONING: aap SIRF PVC banate ho → provisioner ek matching PV + real disk banata hai → PVC 1:1 bind hota hai. `WaitForFirstConsumer` = disk provision mat karo jab tak PVC use karne wala Pod schedule na ho, taaki disk Pod ke SAME ZONE mein land kare.',
      },
      {
        task: 'In a comment, list the four access modes with what each allows, and explain why RWX is usually the wrong tool with the better alternative per case.',
        taskHi: 'Ek comment mein, chaar access modes list karo.',
        hint: 'ACCESS MODES (a property of the PV+PVC, describing how it can be mounted): **ReadWriteOnce (RWO)** — read-write by Pods on ONE node (multiple Pods OK only if co-located); what almost all block storage (EBS/GCE PD/Azure Disk) supports. **ReadWriteOncePod** — read-write by EXACTLY ONE Pod cluster-wide (use when two writers would corrupt). **ReadOnlyMany (ROX)** — read-only by many nodes. **ReadWriteMany (RWX)** — read-write by many nodes at once; needs a SHARED FS (NFS / AWS EFS / CephFS / Azure Files) — block storage CANNOT do it, so an RWX PVC on a block class never binds. WHY RWX IS USUALLY WRONG + the fix: user uploads / assets / artifacts → OBJECT STORAGE (S3/GCS) via SDK, not a volume; shared mutable app/session state → a DATABASE or Redis; a read-only config/data bundle → bake into the image / a ConfigMap / an initContainer that pulls it (ROX only if large + truly static); genuinely need POSIX shared FS → EFS/Filestore/CephFS, accepting the throughput ceiling + new SPOF. Most "we need RWX" = "we haven\'t picked a datastore".',
        hintHi: 'ACCESS MODES: **ReadWriteOnce (RWO)** — EK node par Pods dwara read-write; jo lagbhag saara block storage support karta hai. **ReadWriteOncePod** — cluster-wide THEEK EK Pod dwara read-write. **ReadOnlyMany (ROX)** — kai nodes dwara read-only. **ReadWriteMany (RWX)** — ek saath kai nodes dwara read-write; ek SHARED FS chahiye (NFS/EFS/CephFS) — block storage NAHI kar sakta. RWX USUALLY GALAT KYUN + fix: user uploads → OBJECT STORAGE via SDK; shared mutable state → ek DATABASE ya Redis; ek read-only bundle → image mein bake / ek ConfigMap / ek initContainer. Zyadaatar "hamein RWX chahiye" = "humne ek datastore nahi chuna".',
      },
      {
        task: 'In a comment, explain the `reclaimPolicy: Delete` data-loss trap and what a StatefulSet does that a Deployment cannot, including PVC behaviour on scale-down.',
        taskHi: 'Ek comment mein, `reclaimPolicy: Delete` data-loss trap samjhao.',
        hint: 'RECLAIM POLICY: a dynamically provisioned PV inherits its StorageClass\'s `reclaimPolicy`; most defaults = `Delete`. With `Delete`, removing the PVC — directly OR as a side effect of `kubectl delete namespace` — deletes the bound PV AND tells the CSI driver to delete the underlying cloud disk. NO confirmation, NO recycle bin → a routine namespace cleanup can permanently destroy the only copy of production data. FIX: `reclaimPolicy: Retain` (on the SC, or `kubectl patch pv ...`) → deleting the PVC leaves the PV `Released` with the disk intact; an operator must consciously reuse/delete it. Retain is NOT a backup — still need volume snapshots / Velero for corruption / bad migration / region loss. STATEFULSET vs DEPLOYMENT: a Deployment = random name suffixes, any order, one shared PVC → wrong for cluster members. A StatefulSet gives: (1) stable ORDINAL identity `name-0/1/2` (a replacement for `name-1` is again `name-1`) + a headless Service → stable per-Pod DNS; (2) `volumeClaimTemplates` → ONE PVC PER Pod (`data-name-0`...), and `name-1` always re-mounts `data-name-1` even after rescheduling to another node; (3) ordered create/scale-up (0,1,2) + reverse terminate (2,1,0) + ordered rolling update; (4) scaling DOWN NEVER deletes the PVCs (data preserved for a scale-back-up) — deletion is a deliberate manual step or `persistentVolumeClaimRetentionPolicy`. It does NOT do replication / failover / primary election — that\'s the app\'s or an operator\'s job.',
        hintHi: 'RECLAIM POLICY: ek dynamically provisioned PV apne StorageClass ki `reclaimPolicy` inherit karta hai; zyadaatar defaults = `Delete`. `Delete` ke saath, PVC ko remove karna — directly YA `kubectl delete namespace` ke ek side effect ke roop mein — bound PV ko delete karta hai AUR CSI driver ko underlying disk delete karne ko kehta hai. KOI confirmation nahi. FIX: `reclaimPolicy: Retain`. Retain ek backup NAHI hai. STATEFULSET vs DEPLOYMENT: ek StatefulSet deta hai: (1) stable ORDINAL identity + headless Service → stable per-Pod DNS; (2) `volumeClaimTemplates` → PER Pod EK PVC; (3) ordered create (0,1,2) + reverse terminate (2,1,0); (4) scaling DOWN kabhi PVCs delete NAHI karta.',
      },
    ],

    keyTakeaways: [
      'A CONTAINER FS is ephemeral (gone on every restart/reschedule). `emptyDir` = scratch tied to the POD\'s life. `hostPath` = a node dir — ties the Pod to the node, security hole, almost never right. For durable data use a PVC. THE TRIANGLE: PV = a real piece of storage; PVC = a namespaced REQUEST (size + accessMode + storageClassName) a Pod mounts by name; STORAGECLASS = HOW PVs are made (provisioner/CSI driver + params + `reclaimPolicy` + `allowVolumeExpansion` + `volumeBindingMode`). DYNAMIC PROVISIONING: create only the PVC → the StorageClass provisions a matching PV + disk → binds 1:1.',
      'ACCESS MODES: `ReadWriteOnce` (one node — what block storage does; multiple Pods only if co-located), `ReadWriteOncePod` (exactly one Pod cluster-wide), `ReadOnlyMany`, `ReadWriteMany` (many nodes RW — needs a shared FS: NFS/EFS/CephFS; block storage CANNOT, so an RWX PVC on a block class never binds). Wanting RWX is usually an unmade datastore decision: uploads → object storage, shared state → a DB/Redis, read-only bundle → image/ConfigMap/initContainer.',
      '`reclaimPolicy: Delete` (the default for dynamic PVs) means deleting the PVC — or `kubectl delete namespace` around it — DELETES the PV AND the underlying cloud disk, no confirmation. Use `reclaimPolicy: Retain` for any data you can\'t recreate (leaves the PV `Released`, disk intact) — but it\'s NOT a backup (still need volume snapshots / Velero). `volumeBindingMode: WaitForFirstConsumer` provisions the disk in the Pod\'s zone (essential multi-zone); `allowVolumeExpansion: true` lets a PVC grow (never shrink).',
      'STATEFULSET (not Deployment) for per-instance identity or storage. Gives: (1) stable ORDINAL names `name-0/1/2` (a replacement for `name-1` is again `name-1`) + a headless Service → stable per-Pod DNS `<pod>.<svc>.<ns>.svc.cluster.local`; (2) `volumeClaimTemplates` → ONE PVC PER Pod, and `name-1` always re-mounts `data-name-1` even after rescheduling; (3) ordered create/scale-up 0→1→2, reverse terminate 2→1→0, ordered rolling update; (4) scaling DOWN NEVER deletes the PVCs (data kept for a scale-back-up).',
      'A DEPLOYMENT pointing several RWO replicas at ONE PVC fails two ways: Pods on different nodes can\'t mount it (stuck `ContainerCreating`), or Pods on the same node all write the same dir → corruption. StatefulSets solve IDENTITY + STORAGE only — replication, failover, and primary election remain the application\'s or an operator\'s job (CloudNativePG, the Zalando operator, etc.).',
    ],
    keyTakeawaysHi: [
      'Ek CONTAINER FS ephemeral hai. `emptyDir` = POD ke life se tied scratch. `hostPath` = ek node dir — security hole, lagbhag kabhi sahi nahi. Durable data ke liye ek PVC use karo. TRIANGLE: PV = storage ka ek real piece; PVC = ek namespaced REQUEST jise ek Pod naam se mount karta hai; STORAGECLASS = PVs KAISE bante hain. DYNAMIC PROVISIONING: sirf PVC banao → StorageClass ek matching PV + disk provision karta hai → 1:1 bind.',
      'ACCESS MODES: `ReadWriteOnce` (ek node — jo block storage karta hai), `ReadWriteOncePod` (cluster-wide theek ek Pod), `ReadOnlyMany`, `ReadWriteMany` (kai nodes RW — ek shared FS chahiye; block storage NAHI kar sakta). RWX chahna usually ek unmade datastore decision hai: uploads → object storage, shared state → ek DB/Redis, read-only bundle → image/ConfigMap.',
      '`reclaimPolicy: Delete` (dynamic PVs ke liye default) ka matlab PVC ko delete karna — ya iske aas-paas `kubectl delete namespace` — PV AUR underlying cloud disk ko DELETE karta hai, koi confirmation nahi. Kisi bhi data ke liye jise aap recreate nahi kar sakte `reclaimPolicy: Retain` use karo — par ye ek backup NAHI hai. `volumeBindingMode: WaitForFirstConsumer` disk ko Pod ke zone mein provision karta hai.',
      'STATEFULSET (Deployment nahi) per-instance identity ya storage ke liye. Deta hai: (1) stable ORDINAL names `name-0/1/2` + ek headless Service → stable per-Pod DNS; (2) `volumeClaimTemplates` → PER Pod EK PVC; (3) ordered create 0→1→2, reverse terminate 2→1→0; (4) scaling DOWN kabhi PVCs delete NAHI karta.',
      'Ek DEPLOYMENT jo kई RWO replicas ko EK PVC par point karta hai do tarikon se fail hota hai: alag nodes par Pods ise mount nahi kar sakte, ya same node par Pods sab same dir likhte hain → corruption. StatefulSets sirf IDENTITY + STORAGE solve karte hain — replication, failover primary election application ka ya ek operator ka kaam rehta hai.',
    ],
  },

  {
    slug: 'ops-jobs-cronjobs-rbac-and-namespace-governance',
    title: 'Jobs, CronJobs, RBAC & Namespace Governance',
    titleHi: 'Jobs, CronJobs, RBAC & Namespace Governance',
    description: 'A Deployment runs forever; a Job runs a task to completion and stops. A CronJob runs a Job on a schedule. RBAC decides who — which user or ServiceAccount — may do what to which resources. ResourceQuota and LimitRange cap what a namespace can consume, and NetworkPolicy controls which Pods may talk to which.',
    descriptionHi: 'Ek Deployment hamesha chalta hai; ek Job ek task ko completion tak chalata hai aur rukता hai. Ek CronJob ek schedule par ek Job chalata hai. RBAC decide karta hai ki kaun — kaunsा user ya ServiceAccount — kis resources ko kya kar sakta hai. ResourceQuota aur LimitRange cap karte hain ki ek namespace kya consume kar sakta hai, aur NetworkPolicy control karta hai ki kaunse Pods kis se baat kar sakte hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**An office building\'s operations.** A **Deployment** is the reception desk — always staffed, always answering. A **Job** is a one-off task on the facilities list: "shred the Q2 archives" — someone does it, it is checked off, done. A **CronJob** is the standing entry in the calendar: "every Monday 6am, empty the recycling." **RBAC** is the badge system: your badge opens the doors your role needs and no others, and the badge belongs to a role, not just to you (a **ServiceAccount** — the identity a program carries). A **ResourceQuota** is the department\'s budget cap — the whole team together may spend up to this much. A **LimitRange** is the per-desk stationery allowance — if you don\'t specify, you get the standard kit, and you can\'t requisition a printer for yourself. A **NetworkPolicy** is the internal door-access map: the finance floor only opens to finance and the auditors, not to whoever wanders up.',
      hi: '**Ek office building ke operations.** Ek **Deployment** reception desk hai — hamesha staffed. Ek **Job** facilities list par ek one-off task hai: "Q2 archives shred karo" — koi ise karta hai, check off ho jaata hai. Ek **CronJob** calendar mein standing entry hai: "har Monday 6am, recycling khaali karo." **RBAC** badge system hai: aapka badge wo doors kholta hai jo aapke role ko chahiye aur koi nahi, aur badge ek role ka hai (ek **ServiceAccount** — ek program jo identity carry karta hai). Ek **ResourceQuota** department ka budget cap hai. Ek **LimitRange** per-desk stationery allowance hai. Ek **NetworkPolicy** internal door-access map hai.',
    },

    simple: `**JOB = run to completion. CRONJOB = a Job on a schedule.**
\`\`\`yaml
apiVersion: batch/v1
kind: Job
metadata: { name: migrate }
spec:
  completions: 1              # how many successful Pods = done
  parallelism: 1             # how many run at once
  backoffLimit: 4            # retries before the Job is marked Failed
  activeDeadlineSeconds: 600 # hard wall-clock cap (then Failed)
  ttlSecondsAfterFinished: 3600   # auto-delete the Job + its Pods 1h after finishing
  template:
    spec:
      restartPolicy: Never    # Never or OnFailure (NOT Always — a Job must be able to end)
      containers: [ { name: c, image: myapp:1.0, command: [ "./migrate" ] } ]
---
apiVersion: batch/v1
kind: CronJob
metadata: { name: nightly }
spec:
  schedule: "0 2 * * *"                 # standard cron, in the cluster's timezone (or spec.timeZone)
  concurrencyPolicy: Forbid             # Allow | Forbid (skip if prev still running) | Replace
  startingDeadlineSeconds: 120          # if a run is missed, how late may it still start
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate: { spec: { template: { ... } } }
\`\`\`

**RBAC — who may do what:**
\`\`\`
Role / ClusterRole        a set of rules: [apiGroups] x [resources] x [verbs]
                          (get list watch create update patch delete + subresources like pods/log)
                          Role = namespaced;  ClusterRole = cluster-wide (nodes, PVs, or reusable)
RoleBinding / ClusterRoleBinding   grant a Role to SUBJECTS: User, Group, or ServiceAccount
ServiceAccount             the identity a Pod runs as (namespaced). every Pod gets one
                           ('default' unless set). its token is auto-mounted (turn off if unused).
verbs are ADDITIVE and there is NO DENY — you can only grant. least privilege = grant narrowly.
check: kubectl auth can-i <verb> <resource> --as <user|system:serviceaccount:ns:name> -n <ns>
\`\`\`

**NAMESPACE GOVERNANCE:**
\`\`\`
ResourceQuota    caps the namespace TOTAL: requests.cpu/memory, limits.*, count/pods,
                 count/services, persistentvolumeclaims, requests.storage.
                 once a quota names a resource, every Pod MUST set it or it's rejected.
LimitRange       per-Container/Pod/PVC: default + defaultRequest (injected when omitted),
                 min / max (reject outside the band), maxLimitRequestRatio.
NetworkPolicy    default is ALL Pods can talk to all Pods. a NP selecting a Pod switches it
                 to default-deny for that direction; rules then ALLOW specific ingress/egress.
                 REQUIRES a CNI that enforces them (Calico, Cilium — NOT stock kindnet/flannel).
\`\`\``,

    simpleHi: `**JOB = completion tak chalao. CRONJOB = ek schedule par ek Job.**
\`\`\`yaml
apiVersion: batch/v1
kind: Job
metadata: { name: migrate }
spec:
  completions: 1
  parallelism: 1
  backoffLimit: 4            # retries Job ke Failed mark hone se pehle
  activeDeadlineSeconds: 600 # hard wall-clock cap
  ttlSecondsAfterFinished: 3600   # finish hone ke 1h baad Job + Pods auto-delete
  template:
    spec:
      restartPolicy: Never    # Never ya OnFailure (Always NAHI)
      containers: [ { name: c, image: myapp:1.0, command: [ "./migrate" ] } ]
---
apiVersion: batch/v1
kind: CronJob
metadata: { name: nightly }
spec:
  schedule: "0 2 * * *"
  concurrencyPolicy: Forbid             # Allow | Forbid | Replace
  startingDeadlineSeconds: 120
\`\`\`

**RBAC — kaun kya kar sakta hai:**
\`\`\`
Role / ClusterRole        rules ka ek set: [apiGroups] x [resources] x [verbs]
                          Role = namespaced;  ClusterRole = cluster-wide
RoleBinding / ClusterRoleBinding   ek Role ko SUBJECTS ko grant karo: User, Group, ya ServiceAccount
ServiceAccount             identity jaisा ek Pod run karta hai (namespaced). har Pod ko ek milta hai.
verbs ADDITIVE hain aur KOI DENY nahi — aap sirf grant kar sakte ho.
check: kubectl auth can-i <verb> <resource> --as <user|system:serviceaccount:ns:name> -n <ns>
\`\`\`

**NAMESPACE GOVERNANCE:**
\`\`\`
ResourceQuota    namespace TOTAL cap karta hai: requests.cpu/memory, count/pods, ...
                 ek baar ek quota ek resource name karta hai, har Pod ko ise set karna CHAHIYE.
LimitRange       per-Container/Pod/PVC: default + defaultRequest (omit karne par injected),
                 min / max (band ke bahar reject).
NetworkPolicy    default SAARE Pods sab se baat kar sakte hain. ek NP jo ek Pod select karta hai
                 use us direction ke liye default-deny mein switch karta hai.
                 ENFORCE karne wale ek CNI ki ZAROORAT (Calico, Cilium — stock kindnet/flannel NAHI).
\`\`\``,

    content: `## Jobs

A **Job** runs one or more Pods until a specified number of them **succeed**, then stops. It is the primitive for anything that finishes: a database migration, a batch import, a report, a one-off backfill.

- **\`completions\`** — how many Pods must exit successfully for the Job to be complete (default 1).
- **\`parallelism\`** — how many Pods may run at once (default 1). With \`completions: 10, parallelism: 3\` the Job runs three at a time until ten have succeeded.
- **\`backoffLimit\`** — how many Pod failures are tolerated before the Job itself is marked \`Failed\` (default 6). Failed Pods are recreated with an exponential back-off. \`backoffLimit: 2\` means three total attempts.
- **\`activeDeadlineSeconds\`** — a hard wall-clock limit; when it passes the Job is terminated and marked \`Failed\` regardless of \`backoffLimit\`.
- **\`ttlSecondsAfterFinished\`** — delete the Job and its Pods this many seconds after it completes or fails, so finished Jobs do not accumulate.
- **\`restartPolicy\`** must be \`Never\` or \`OnFailure\` — never \`Always\`, because a Job needs to be able to end. With \`OnFailure\` the kubelet restarts the container in place; with \`Never\` a new Pod is created for each attempt (better for getting logs of each try).

An **indexed** Job (\`completionMode: Indexed\`) gives each Pod a fixed index in \`0..completions-1\` via an annotation and the \`JOB_COMPLETION_INDEX\` env var, so a batch can be statically partitioned across Pods.

## CronJobs

A **CronJob** creates a Job from its \`jobTemplate\` on a **\`schedule\`** (standard five-field cron). Times are in the cluster's timezone unless \`spec.timeZone\` is set.

- **\`concurrencyPolicy\`** — \`Allow\` (default; overlapping runs are fine), \`Forbid\` (skip the new run if the previous Job is still running), or \`Replace\` (kill the running Job and start the new one).
- **\`startingDeadlineSeconds\`** — if the controller misses a scheduled time (it was down, the cluster was busy), how many seconds late a run may still be started. Without it, a missed run is simply skipped. Set it too high with many missed schedules and the controller may try to run all of them.
- **\`successfulJobsHistoryLimit\`** / **\`failedJobsHistoryLimit\`** — how many finished Jobs to keep for inspection (default 3 and 1).
- **\`suspend: true\`** — stop creating new Jobs without deleting the CronJob.

CronJobs guarantee *at-least-once* execution around a scheduled time, not exactly-once — a job that must not run twice needs its own idempotency or locking.

## RBAC

**Role-Based Access Control** answers "can this identity perform this verb on this resource?"

- A **Role** (namespaced) or **ClusterRole** (cluster-wide) is a list of rules, each combining **\`apiGroups\`**, **\`resources\`** (\`pods\`, \`deployments\`, \`secrets\`, and subresources like \`pods/log\`, \`pods/exec\`), and **\`verbs\`** (\`get\`, \`list\`, \`watch\`, \`create\`, \`update\`, \`patch\`, \`delete\`, \`deletecollection\`). Rules are purely additive and there is **no deny rule** — RBAC can only grant.
- A **RoleBinding** grants a Role (or a ClusterRole, scoped to one namespace) to a list of **subjects**: \`User\`, \`Group\`, or \`ServiceAccount\`. A **ClusterRoleBinding** grants a ClusterRole across the whole cluster.
- A **ServiceAccount** is the identity a Pod authenticates as. Every Pod has one — \`default\` in its namespace unless \`serviceAccountName\` is set — and a short-lived token for it is projected into the Pod. Set \`automountServiceAccountToken: false\` on Pods or ServiceAccounts that never call the API, to shrink the attack surface.

Users and groups are **not** Kubernetes objects — they come from the authentication layer (client certs, OIDC, a cloud IAM mapping). RBAC only binds names.

The essential tool is \`kubectl auth can-i <verb> <resource> [--subresource=…] --as <user> --as-group <group> -n <ns>\`, which evaluates the real rules. \`--as system:serviceaccount:<ns>:<name>\` checks a ServiceAccount.

Least privilege means starting from nothing and granting the narrowest rules a workload actually needs — \`get\`/\`list\` on the two resources it reads, not \`*\` on \`*\`. The built-in ClusterRoles \`view\`, \`edit\`, \`admin\`, and \`cluster-admin\` are convenient but broad; \`cluster-admin\` in particular is total control and should be bound to almost no one.

## ResourceQuota and LimitRange

- A **ResourceQuota** caps aggregate consumption in a namespace: total \`requests.cpu\` and \`requests.memory\`, total \`limits.*\`, and object counts (\`count/pods\`, \`count/services.loadbalancers\`, \`persistentvolumeclaims\`, \`requests.storage\`). Once a quota constrains a compute resource, **every Pod in the namespace must set that request/limit** or the Pod is rejected — which is why quotas and LimitRanges are almost always deployed together.
- A **LimitRange** operates per object within a namespace: it injects \`default\` limits and \`defaultRequest\` requests into containers that omit them, enforces \`min\` and \`max\` bounds (a Pod outside the band is rejected), and can cap the \`maxLimitRequestRatio\`. It also sets min/max sizes for PVCs.

Together they let a platform team hand a namespace to a product team with guaranteed blast-radius limits: the team can deploy freely, but cannot consume more than their quota or ship a Pod with no resources set.

## NetworkPolicy

By default, **every Pod can reach every other Pod** in the cluster, across namespaces, on any port. A **NetworkPolicy** changes that for the Pods it selects:

- The moment a NetworkPolicy selects a Pod for a direction (ingress or egress), that Pod switches to **default-deny** for that direction — only traffic explicitly allowed by some policy's rules is permitted.
- Rules allow traffic to/from Pods matching a \`podSelector\`, Pods in namespaces matching a \`namespaceSelector\`, or IP ranges via \`ipBlock\`, on specified ports.
- A common baseline is a policy selecting all Pods (\`podSelector: {}\`) that denies all ingress, then per-app policies that allow exactly the callers each app expects.

**NetworkPolicy is only enforced if the CNI plugin implements it.** Calico and Cilium do; the default plugins in some local clusters (kindnet, and flannel) do not — the policy objects are accepted and appear to exist, but nothing enforces them. Always confirm enforcement in the target environment.`,

    contentHi: `## Jobs

Ek **Job** ek ya zyada Pods chalata hai jab tak unki ek specified sankhya **succeed** na kare, phir rukta hai. Ye kisi bhi cheez ke liye primitive hai jo khatam hoti hai: ek database migration, ek batch import, ek report.
- **\`completions\`** — Job complete hone ke liye kitne Pods successfully exit karne chahiye (default 1).
- **\`parallelism\`** — ek saath kitne Pods run kar sakte hain (default 1).
- **\`backoffLimit\`** — Job khud ke \`Failed\` mark hone se pehle kitne Pod failures tolerate hote hain (default 6). \`backoffLimit: 2\` ka matlab teen total attempts.
- **\`activeDeadlineSeconds\`** — ek hard wall-clock limit.
- **\`ttlSecondsAfterFinished\`** — Job aur iske Pods ko complete/fail hone ke itne seconds baad delete karo.
- **\`restartPolicy\`** \`Never\` ya \`OnFailure\` hona chahiye — kabhi \`Always\` nahi.

## CronJobs

Ek **CronJob** apne \`jobTemplate\` se ek **\`schedule\`** par ek Job banata hai (standard five-field cron).
- **\`concurrencyPolicy\`** — \`Allow\` (default), \`Forbid\` (naya run skip karo agar pichhla Job abhi bhi run kar raha hai), ya \`Replace\`.
- **\`startingDeadlineSeconds\`** — agar controller ek scheduled time miss karta hai, ek run kitne seconds late abhi bhi start ho sakta hai.
- **\`suspend: true\`** — CronJob delete kiye bina naye Jobs banane band karo.

CronJobs *at-least-once* execution guarantee karte hain, exactly-once nahi.

## RBAC

**Role-Based Access Control** answer karta hai "kya ye identity is resource par ye verb perform kar sakti hai?"
- Ek **Role** (namespaced) ya **ClusterRole** (cluster-wide) rules ki ek list hai, har ek **\`apiGroups\`**, **\`resources\`**, aur **\`verbs\`** combine karke. Rules purely additive hain aur **koi deny rule nahi** hai.
- Ek **RoleBinding** ek Role ko **subjects** ki ek list ko grant karta hai: \`User\`, \`Group\`, ya \`ServiceAccount\`.
- Ek **ServiceAccount** identity hai jaisा ek Pod authenticate karta hai. Har Pod ke paas ek hai. \`automountServiceAccountToken: false\` set karo un Pods par jo kabhi API call nahi karte.

Users aur groups Kubernetes objects **nahi** hain — wo authentication layer se aate hain.

Essential tool \`kubectl auth can-i <verb> <resource> --as <user> -n <ns>\` hai.

Least privilege ka matlab kuch nahi se shuru karna aur sabse narrow rules grant karna jo ek workload actually chahiye.

## ResourceQuota aur LimitRange

- Ek **ResourceQuota** ek namespace mein aggregate consumption cap karta hai: total \`requests.cpu\`, object counts (\`count/pods\`, \`persistentvolumeclaims\`). Ek baar ek quota ek compute resource constrain karta hai, **namespace mein har Pod ko wo request/limit set karna chahiye** ya Pod reject hota hai.
- Ek **LimitRange** ek namespace ke andar per object operate karta hai: ye \`default\` limits aur \`defaultRequest\` requests inject karta hai un containers mein jo unhe omit karte hain, \`min\` aur \`max\` bounds enforce karta hai.

## NetworkPolicy

Default se, **har Pod har doosre Pod tak pahunch sakta hai** cluster mein. Ek **NetworkPolicy** un Pods ke liye ise badalta hai jo ye select karta hai:
- Jis moment ek NetworkPolicy ek direction ke liye ek Pod select karta hai, wo Pod us direction ke liye **default-deny** mein switch ho jaata hai.
- Rules \`podSelector\`, \`namespaceSelector\`, ya \`ipBlock\` se matching traffic allow karte hain.

**NetworkPolicy sirf enforce hoti hai agar CNI plugin ise implement karta hai.** Calico aur Cilium karte hain; kuch local clusters mein default plugins (kindnet, flannel) nahi karte.`,

    examples: [
      {
        title: 'A Job runs to completion in parallel; a failing Job stops at backoffLimit',
        titleHi: 'Ek Job parallel mein completion tak chalta hai; ek failing Job backoffLimit par rukता hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m9l5-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: batch/v1
kind: Job
metadata: { name: import }
spec:
  completions: 3          # 3 Pods must succeed
  parallelism: 2          # 2 at a time
  backoffLimit: 4
  template:
    spec:
      restartPolicy: Never
      containers: [ { name: c, image: busybox:1.36, command: [ sh, -c, "echo processing shard; sleep 2" ] } ]
YAML
kubectl -n "$ns" wait --for=condition=complete job/import --timeout=120s >/dev/null
echo "Job 'import':  completions=$(kubectl -n "$ns" get job import -o jsonpath='{.spec.completions}')  succeeded=$(kubectl -n "$ns" get job import -o jsonpath='{.status.succeeded}')  (parallelism=$(kubectl -n "$ns" get job import -o jsonpath='{.spec.parallelism}'))"

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: batch/v1
kind: Job
metadata: { name: flaky }
spec:
  backoffLimit: 2         # -> 3 total attempts, then Failed
  template:
    spec: { restartPolicy: Never, containers: [ { name: c, image: busybox:1.36, command: [ sh, -c, "exit 1" ] } ] }
YAML
for i in $(seq 1 30); do
  [ "$(kubectl -n "$ns" get job flaky -o jsonpath='{.status.conditions[?(@.type=="Failed")].status}')" = True ] && break
  sleep 3
done
echo "Job 'flaky':   condition=Failed  reason=$(kubectl -n "$ns" get job flaky -o jsonpath='{.status.conditions[?(@.type=="Failed")].reason}')  after $(kubectl -n "$ns" get job flaky -o jsonpath='{.status.failed}') failed Pods (backoffLimit 2 -> 3 attempts)"

kubectl -n "$ns" create cronjob report --image=busybox:1.36 --schedule="0 6 * * *" -- sh -c "echo daily report" >/dev/null
echo "CronJob 'report': schedule='$(kubectl -n "$ns" get cronjob report -o jsonpath='{.spec.schedule}')'  concurrencyPolicy=$(kubectl -n "$ns" get cronjob report -o jsonpath='{.spec.concurrencyPolicy}')"`,
        output: `Job 'import':  completions=3  succeeded=3  (parallelism=2)
Job 'flaky':   condition=Failed  reason=BackoffLimitExceeded  after 3 failed Pods (backoffLimit 2 -> 3 attempts)
CronJob 'report': schedule='0 6 * * *'  concurrencyPolicy=Allow`,
        explain: 'The first Job asks for three successful completions and allows two Pods to run at once. The controller starts two Pods, and as each finishes it starts another until three have succeeded, at which point the Job is marked complete; its status shows three succeeded and its parallelism of two. The second Job runs a command that always exits non-zero, with a backoffLimit of two. Kubernetes creates a Pod, it fails, creates a replacement after a back-off delay, it fails, creates one more, it fails — three attempts total, because backoffLimit counts failures beyond the first — and then stops retrying and marks the Job Failed with the reason BackoffLimitExceeded. The status records three failed Pods. The third command creates a CronJob with a standard cron schedule; it does not run here, but its spec shows the schedule string and the default concurrency policy of Allow, meaning if one scheduled run overruns into the next, both are allowed to run. The key points are that a Job is defined by a success count rather than by running forever, that backoffLimit plus one is the total attempt count, and that a Job must use restartPolicy Never or OnFailure so it can actually terminate.',
        explainHi: 'Pehla Job teen successful completions maangता hai aur do Pods ko ek saath run karne deta hai. Controller do Pods start karta hai, aur jaise har ek khatam hota hai ek aur start karta hai jab tak teen succeed na karein. Doosra Job ek command chalata hai jo hamesha non-zero exit karta hai, backoffLimit do ke saath. Kubernetes ek Pod banata hai, ye fail hota hai, ek back-off delay ke baad ek replacement banata hai, ye fail hota hai, ek aur banata hai, ye fail hota hai — teen attempts total, kyunki backoffLimit pehle ke aage failures count karta hai — aur phir retry karna band karta hai aur Job ko Failed mark karta hai reason BackoffLimitExceeded ke saath. Teesra command ek CronJob banata hai; ye yahan run nahi hota, par iska spec schedule string dikhaata hai.',
      },
      {
        title: 'RBAC scopes a ServiceAccount; a LimitRange injects defaults; a ResourceQuota rejects the overflow',
        titleHi: 'RBAC ek ServiceAccount ko scope karta hai; ek LimitRange defaults inject karta hai; ek ResourceQuota overflow reject karta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m9l5b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

kubectl -n "$ns" create serviceaccount ci >/dev/null
cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata: { name: deploy-manager }
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get","list","watch","update","patch"]
YAML
kubectl -n "$ns" create rolebinding ci-deploys --role=deploy-manager --serviceaccount="$ns:ci" >/dev/null

SA="system:serviceaccount:$ns:ci"
echo "ServiceAccount 'ci' has a Role = {deployments: get/list/watch/update/patch} in its OWN namespace:"
echo "  patch a Deployment here?          $(kubectl auth can-i patch deployments --as=$SA -n $ns)"
echo "  delete a Deployment here?         $(kubectl auth can-i delete deployments --as=$SA -n $ns)"
echo "  list Secrets here?                $(kubectl auth can-i list secrets --as=$SA -n $ns)"
echo "  patch Deployments in kube-system? $(kubectl auth can-i patch deployments --as=$SA -n kube-system)"

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: LimitRange
metadata: { name: defaults }
spec:
  limits:
    - type: Container
      default: { cpu: 200m, memory: 128Mi }
      defaultRequest: { cpu: 100m, memory: 64Mi }
---
apiVersion: v1
kind: ResourceQuota
metadata: { name: team-quota }
spec:
  hard: { requests.cpu: "300m", count/pods: "2" }
YAML
kubectl -n "$ns" run a --image=registry.k8s.io/pause:3.9 >/dev/null 2>&1
echo "LimitRange: Pod 'a' set NO resources -> injected requests = $(kubectl -n "$ns" get pod a -o jsonpath='{.spec.containers[0].resources.requests}')"
kubectl -n "$ns" run b --image=registry.k8s.io/pause:3.9 >/dev/null 2>&1
out=$(kubectl -n "$ns" run c --image=registry.k8s.io/pause:3.9 2>&1)
echo "ResourceQuota count/pods=2: the 3rd Pod -> $(echo "$out" | head -1)"`,
        output: `ServiceAccount 'ci' has a Role = {deployments: get/list/watch/update/patch} in its OWN namespace:
  patch a Deployment here?          yes
  delete a Deployment here?         no
  list Secrets here?                no
  patch Deployments in kube-system? no
LimitRange: Pod 'a' set NO resources -> injected requests = {"cpu":"100m","memory":"64Mi"}
ResourceQuota count/pods=2: the 3rd Pod -> Error from server (Forbidden): pods "c" is forbidden: exceeded quota: team-quota, requested: count/pods=1, used: count/pods=2, limited: count/pods=2`,
        explain: 'A ServiceAccount named ci is created and bound, through a RoleBinding, to a Role that grants only get, list, watch, update, and patch on deployments in this one namespace. Checking its permissions with kubectl auth can-i, impersonating the ServiceAccount, confirms the shape of the grant: it may patch a Deployment in its own namespace, but it may not delete one (delete was not in the verb list), may not list Secrets (a different resource entirely), and may not touch Deployments in kube-system (the Role is namespaced and only bound here). This is least privilege expressed directly. Then a LimitRange and a ResourceQuota are added. The LimitRange has a defaultRequest, so a Pod created with no resources block is admitted with the request values injected — visible on the running Pod. The ResourceQuota caps the namespace at two Pods total; the first two Pods are created fine, and the third is rejected at admission with a Forbidden error stating that the pod count quota is exhausted. Together these three objects let a platform team delegate a namespace with hard, automatic guardrails on both permissions and consumption.',
        explainHi: 'Ci naam ka ek ServiceAccount create hota hai aur, ek RoleBinding ke through, ek Role se bound hota hai jo is ek namespace mein deployments par sirf get, list, watch, update, aur patch grant karta hai. kubectl auth can-i se iski permissions check karna, ServiceAccount ko impersonate karके, grant ka shape confirm karta hai: ye apne namespace mein ek Deployment patch kar sakta hai, par ise delete nahi kar sakta, Secrets list nahi kar sakta, aur kube-system mein Deployments touch nahi kar sakta. Phir ek LimitRange aur ek ResourceQuota add hote hain. LimitRange ka ek defaultRequest hai, to bina resources block ke create hua ek Pod request values injected ke saath admit hota hai. ResourceQuota namespace ko total do Pods par cap karta hai; teesra admission par reject hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a Job (or CronJob's jobTemplate) with restartPolicy: Always
spec:
  template:
    spec:
      restartPolicy: Always      # <-- invalid for a Job
      containers: [ ... ]
# error: Job.batch "x" is invalid: spec.template.spec.restartPolicy:
#   Unsupported value: "Always": supported values: "OnFailure", "Never"
# and the deeper conceptual bug: a batch task that "restarts always" can never COMPLETE.`,
        right: `# a Job MUST be able to end. restartPolicy is Never or OnFailure:
spec:
  backoffLimit: 4                # cap retries so a broken job doesn't loop forever
  activeDeadlineSeconds: 1800    # AND a wall-clock cap (network hang won't retry)
  ttlSecondsAfterFinished: 3600  # clean up after itself
  template:
    spec:
      restartPolicy: OnFailure   # kubelet restarts the container in place, OR
      # restartPolicy: Never     # a fresh Pod per attempt - better for per-attempt logs
      containers: [ ... ]
# OnFailure counts container restarts toward backoffLimit; Never counts Pod failures.`,
        why: 'A Job models work that finishes, so it needs a completion signal, and the API rejects restartPolicy Always for a Job because that policy means "keep this container running no matter what," which is incompatible with the container being allowed to exit successfully. The valid choices are OnFailure, where the kubelet restarts the failed container in place on the same Pod, and Never, where each attempt is a new Pod. Never is usually preferable because the Pod and logs of every attempt remain available for inspection, whereas OnFailure overwrites them. Either way, the Job should also carry a backoffLimit so a permanently broken task stops retrying and is marked Failed rather than looping, an activeDeadlineSeconds so a task that hangs rather than fails is still bounded, and ideally a ttlSecondsAfterFinished so completed Jobs and their Pods are garbage-collected instead of piling up in the namespace.',
        whyHi: 'Ek Job aisा kaam model karta hai jo khatam hota hai, to ise ek completion signal chahiye, aur API ek Job ke liye restartPolicy Always reject karta hai kyunki us policy ka matlab hai "is container ko chahe kuch bhi ho running rakho," jo container ke successfully exit hone ke allowed hone ke साथ incompatible hai. Valid choices OnFailure hain, jahan kubelet failed container ko same Pod par in place restart karta hai, aur Never, jahan har attempt ek naya Pod hai. Never usually preferable hai kyunki har attempt ke Pod aur logs inspection ke liye available rehte hain. Kisi bhi tarah, Job ko ek backoffLimit bhi carry karna chahiye, ek activeDeadlineSeconds, aur ideally ek ttlSecondsAfterFinished.',
      },
      {
        wrong: `# granting broad RBAC "to save time" / because scoping is fiddly
kind: ClusterRoleBinding
subjects: [ { kind: ServiceAccount, name: my-app, namespace: prod } ]
roleRef: { kind: ClusterRole, name: cluster-admin }   # <-- the app's SA is now god
# now any RCE in that one app == full control of the cluster: read every Secret in
# every namespace, create privileged Pods, exfiltrate the CA key, pivot to the nodes.`,
        right: `# start from zero, grant the exact verbs+resources the workload uses, namespaced:
kind: Role                                    # namespaced, not ClusterRole
metadata: { namespace: prod, name: my-app }
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get","list","watch"]              # it only READS its own config
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["create"]                          # it emits events
---
kind: RoleBinding
metadata: { namespace: prod, name: my-app }
subjects: [ { kind: ServiceAccount, name: my-app, namespace: prod } ]
roleRef: { kind: Role, name: my-app }
# verify with: kubectl auth can-i --list --as system:serviceaccount:prod:my-app -n prod
# and set automountServiceAccountToken: false if the app never calls the API at all.`,
        why: 'RBAC is purely additive with no deny rules, so the only lever for safety is how narrowly permissions are granted. Binding a workload\'s ServiceAccount to cluster-admin, or to any broad ClusterRole, means the identity that the application process runs as can do anything in the cluster. Any vulnerability that lets an attacker execute code in that Pod — a deserialization bug, an SSRF that reaches the API server, a compromised dependency — immediately inherits that power: it can read every Secret in every namespace, including cloud credentials and the cluster CA, schedule privileged Pods that mount the host filesystem, and move laterally to the nodes and the control plane. The correct approach is to grant from empty: a namespaced Role listing only the specific apiGroups, resources, and verbs the workload actually calls, bound with a RoleBinding in that namespace. kubectl auth can-i --list for the ServiceAccount shows exactly what it ended up with. Workloads that never talk to the API at all should additionally have token automounting disabled so there is no credential in the Pod to steal.',
        whyHi: 'RBAC purely additive hai bina deny rules ke, to safety ke liye ekmatra lever ye hai ki permissions kitni narrowly grant hote hain. Ek workload ke ServiceAccount ko cluster-admin se bind karna matlab jis identity jaisा application process run karta hai wo cluster mein kuch bhi kar sakta hai. Koi bhi vulnerability jo ek attacker ko us Pod mein code execute karne deti hai turant us power ko inherit karti hai: ye har namespace mein har Secret padh sakta hai, cloud credentials aur cluster CA sameth, privileged Pods schedule kar sakta hai, aur nodes tak laterally move kar sakta hai. Correct approach empty se grant karna hai: ek namespaced Role jo sirf specific apiGroups, resources, aur verbs list karta hai jo workload actually call karta hai.',
      },
      {
        wrong: `# writing NetworkPolicies on a cluster whose CNI doesn't enforce them
# (kind's default kindnet, or plain flannel)
kubectl apply -f default-deny-all.yaml     # "great, we're locked down now"
kubectl get networkpolicy                   # it's there!
kubectl exec app -- curl other-svc:8080     # ...still works. nothing is enforcing it.
# a security audit ticks the "NetworkPolicy present" box; the cluster is wide open.`,
        right: `# 1. confirm the CNI enforces NetworkPolicy BEFORE relying on it:
#    Calico, Cilium, Antrea, Weave -> yes.   kindnet, flannel -> NO.
#    test it: apply a default-deny, then try a connection that SHOULD now fail.
# 2. then build the baseline:
#    - a policy selecting {} (all Pods) that denies all ingress (and ideally egress)
#    - per-app policies that ALLOW exactly: from the ingress controller, from the
#      specific caller Services, to the DB, to kube-dns (port 53), to required externals
# 3. in kind for LEARNING: install Calico (kind --config with disableDefaultCNI) or
#    Cilium so the policies actually do something.`,
        why: 'NetworkPolicy objects are stored and validated by the API server regardless of the environment, so \`kubectl apply\` succeeds and \`kubectl get networkpolicy\` lists them whether or not anything acts on them. The actual packet filtering is the job of the CNI plugin, and only some plugins implement the NetworkPolicy specification — Calico, Cilium, Antrea, and Weave do; the kindnet plugin that kind installs by default, and plain flannel, do not. On a non-enforcing CNI the policies are inert decoration: traffic that a default-deny policy appears to forbid still flows, and a security review that checks only for the presence of NetworkPolicy objects will wrongly conclude the cluster is segmented. Before depending on NetworkPolicy for isolation, verify enforcement directly by applying a deny rule and confirming that a connection which should now be blocked actually fails. For a local learning cluster, that means replacing the default CNI with one that enforces policy, for example by creating the kind cluster with the default CNI disabled and installing Calico or Cilium.',
        whyHi: 'NetworkPolicy objects API server dwara environment ki parwah kiye bina store aur validate hote hain, to \`kubectl apply\` succeed karta hai aur \`kubectl get networkpolicy\` unhe list karta hai chahe kuch un par act kare ya nahi. Actual packet filtering CNI plugin ka kaam hai, aur sirf kuch plugins NetworkPolicy specification implement karte hain — Calico, Cilium, Antrea, Weave karte hain; kindnet jo kind default se install karta hai, aur plain flannel, nahi karte. Ek non-enforcing CNI par policies inert decoration hain. NetworkPolicy par isolation ke liye depend karne se pehle, enforcement ko directly verify karo ek deny rule apply karके.',
      },
    ],

    realWorld: [
      {
        en: '**A CronJob that quietly stopped running for three weeks** — `concurrencyPolicy: Forbid` plus a job that started hanging meant every subsequent run was skipped as "previous still running", with no alert. Added `activeDeadlineSeconds` so a hung job fails and frees the slot, plus an alert on `last_successful_time`.',
        hi: '**Ek CronJob jo teen hafton ke liye chupचाप run karna band ho gaya** — `concurrencyPolicy: Forbid` plus ek job jo hang hone laga. `activeDeadlineSeconds` add kiya.',
      },
      {
        en: '**An SSRF in a minor internal tool led to full cluster compromise** — the tool\'s ServiceAccount was bound to `cluster-admin` "because it needed to list pods once." The attacker read every Secret in the cluster. Post-incident, every SA was re-scoped to a namespaced Role and `automountServiceAccountToken: false` became the default.',
        hi: '**Ek minor internal tool mein ek SSRF ne full cluster compromise ki** — tool ke ServiceAccount ko `cluster-admin` se bind kiya gaya tha. Har SA ko ek namespaced Role par re-scope kiya gaya.',
      },
      {
        en: '**A "zero-trust network" that wasn\'t** — 200 carefully written NetworkPolicies on a cluster running stock flannel. Nothing was enforced; a pentester moved freely between namespaces. Migrated the CNI to Cilium and the same policies started actually blocking traffic.',
        hi: '**Ek "zero-trust network" jo nahi tha** — stock flannel chala raहे cluster par 200 carefully likhi NetworkPolicies. CNI ko Cilium par migrate kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'How does RBAC work — Roles, bindings, ServiceAccounts — and what does "no deny rule" imply for how you design permissions?',
        qHi: 'RBAC kaise kaam karta hai, aur "koi deny rule nahi" permissions design karne ke liye kya imply karta hai?',
        a: 'RBAC grants permissions by combining three kinds of object. A Role, which is namespaced, or a ClusterRole, which is cluster-wide, is a list of rules; each rule names some apiGroups, some resources including subresources like pods/log, and some verbs like get, list, watch, create, update, patch, delete. A RoleBinding attaches a Role, or a ClusterRole scoped to one namespace, to a set of subjects: a User, a Group, or a ServiceAccount. A ClusterRoleBinding attaches a ClusterRole across the whole cluster. Users and groups are not Kubernetes objects; they come from the authentication layer, such as client certificates or an OIDC provider or a cloud IAM mapping, and RBAC only references their names. A ServiceAccount is a real namespaced object and is the identity a Pod runs as, with a token projected into the Pod. Rules are purely additive and there is no way to write a deny; a subject\'s effective permissions are the union of every rule bound to it. That means you cannot grant broadly and then carve out exceptions — the only way to limit access is to never grant it in the first place. So the design approach is to start from zero and add the narrowest rules a workload actually needs, verify with kubectl auth can-i, and reserve broad roles like cluster-admin for almost no one.',
        aHi: 'RBAC teen kinds ke objects combine karke permissions grant karta hai. Ek Role (namespaced) ya ek ClusterRole (cluster-wide) rules ki ek list hai; har rule kuch apiGroups, kuch resources, aur kuch verbs name karta hai. Ek RoleBinding ek Role ko subjects ke ek set se attach karta hai: ek User, ek Group, ya ek ServiceAccount. Users aur groups Kubernetes objects nahi hain; wo authentication layer se aate hain. Ek ServiceAccount ek real namespaced object hai aur identity hai jaisा ek Pod run karta hai. Rules purely additive hain aur ek deny likhne ka koi tarika nahi hai; ek subject ki effective permissions har rule ka union hain jo ise bound hai. Iska matlab aap broadly grant karके phir exceptions carve out nahi kar sakte — access limit karne ka ekmatra tarika ise pehli jagah kabhi grant na karna hai.',
      },
      {
        q: 'What do ResourceQuota and LimitRange each do, and why are they usually deployed together?',
        qHi: 'ResourceQuota aur LimitRange har ek kya karte hain, aur wo usually saath kyun deploy hote hain?',
        a: 'A ResourceQuota constrains the aggregate for a whole namespace: the sum of all Pods\' CPU and memory requests and limits, and counts of objects such as Pods, Services of type LoadBalancer, PersistentVolumeClaims, and total requested storage. It is enforced at admission — a Pod that would push the namespace over any quota it constrains is rejected. A LimitRange operates on individual objects within the namespace: it injects default requests and limits into containers that do not specify them, enforces minimum and maximum values so a single container cannot request an absurd amount or too little, and can bound the ratio between a container\'s limit and its request. They are deployed together because of a specific interaction: once a ResourceQuota constrains a compute resource like requests.cpu, every Pod in the namespace must declare that request or it is rejected for having an undeterminable contribution to the quota. Without a LimitRange, that means every team must remember to set requests and limits on every container by hand, and any omission is a failed deployment. The LimitRange supplies sensible defaults automatically, so Pods that omit resources are still admitted with reasonable values, and the quota still has a number to account for. The combination lets a platform team hand out a namespace with both a spending cap and a guarantee that nothing runs unbounded.',
        aHi: 'Ek ResourceQuota ek poore namespace ke liye aggregate constrain karta hai: saare Pods ke CPU aur memory requests aur limits ka sum, aur objects ki counts jaise Pods, LoadBalancer type Services, PersistentVolumeClaims. Ye admission par enforce hota hai. Ek LimitRange namespace ke andar individual objects par operate karta hai: ye default requests aur limits inject karta hai un containers mein jo unhe specify nahi karte, minimum aur maximum values enforce karta hai. Wo saath deploy hote hain ek specific interaction ke kaaran: ek baar ek ResourceQuota ek compute resource constrain karta hai, namespace mein har Pod ko wo request declare karna chahiye ya ye reject hota hai. Ek LimitRange ke bina, iska matlab har team ko har container par requests aur limits set karna yaad rakhna chahiye. LimitRange sensible defaults automatically supply karta hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, describe the Job spec fields that make a batch task safe, the restartPolicy rule, and how a CronJob\'s concurrencyPolicy and startingDeadlineSeconds work.',
        taskHi: 'Ek comment mein, Job spec fields describe karo jo ek batch task ko safe banate hain.',
        hint: 'A JOB runs Pods until `completions` of them SUCCEED, then stops. `parallelism` = how many run at once (`completions: 10, parallelism: 3` → 3 at a time until 10 done). `backoffLimit` (default 6) = failures tolerated before the Job is marked `Failed`; `backoffLimit: 2` → 3 TOTAL attempts (it counts failures BEYOND the first). `activeDeadlineSeconds` = a HARD wall-clock cap → `Failed` regardless of backoffLimit (catches a HANG, which retries wouldn\'t). `ttlSecondsAfterFinished` = auto-delete the Job + its Pods N seconds after it ends (so finished Jobs don\'t pile up). RESTARTPOLICY must be `Never` or `OnFailure` — NEVER `Always` (API rejects it; a task that "restarts always" can never COMPLETE). `Never` = a fresh Pod per attempt (keeps per-attempt logs — better); `OnFailure` = kubelet restarts the container in place (overwrites logs). `completionMode: Indexed` gives each Pod a fixed `JOB_COMPLETION_INDEX` for static partitioning. CRONJOB: `schedule` (5-field cron, cluster TZ unless `spec.timeZone`); `concurrencyPolicy` = `Allow` (default, overlaps OK) | `Forbid` (skip the new run if the previous Job is still running — a hang then silently blocks ALL future runs) | `Replace` (kill the running one, start fresh); `startingDeadlineSeconds` = if the controller missed the scheduled time, how many seconds late a run may still start (without it a missed run is just skipped). CronJobs are AT-LEAST-ONCE, not exactly-once → the job needs its own idempotency.',
        hintHi: 'Ek JOB Pods chalata hai jab tak `completions` unmein se SUCCEED na karein, phir rukता hai. `parallelism` = ek saath kitne. `backoffLimit` (default 6) = Job ke `Failed` mark hone se pehle tolerated failures; `backoffLimit: 2` → 3 TOTAL attempts. `activeDeadlineSeconds` = ek HARD wall-clock cap (ek HANG catch karta hai). `ttlSecondsAfterFinished` = auto-delete. RESTARTPOLICY `Never` ya `OnFailure` hona chahiye — KABHI `Always` nahi. `Never` = per attempt ek fresh Pod (per-attempt logs — behtar). CRONJOB: `schedule`; `concurrencyPolicy` = `Allow` | `Forbid` (naya run skip agar pichhla abhi bhi run kar raha hai — ek hang phir chupचाप SAARE future runs block karta hai) | `Replace`; `startingDeadlineSeconds`. CronJobs AT-LEAST-ONCE hain.',
      },
      {
        task: 'In a comment, explain the RBAC model (Role/ClusterRole, RoleBinding/ClusterRoleBinding, ServiceAccount, "no deny"), why binding a workload SA to cluster-admin is dangerous, and how to check permissions.',
        taskHi: 'Ek comment mein, RBAC model samjhao.',
        hint: 'ROLE (namespaced) / CLUSTERROLE (cluster-wide, or reusable) = a list of rules, each = `apiGroups` × `resources` (incl. subresources `pods/log`, `pods/exec`) × `verbs` (get/list/watch/create/update/patch/delete/deletecollection). ROLEBINDING grants a Role (or a ClusterRole scoped to ONE namespace) to SUBJECTS: `User`, `Group`, `ServiceAccount`. CLUSTERROLEBINDING grants a ClusterRole cluster-wide. Users/Groups are NOT k8s objects — they come from the auth layer (client certs / OIDC / cloud IAM); RBAC only binds names. SERVICEACCOUNT = a real namespaced object = the identity a Pod runs as (`default` unless `serviceAccountName` set); its token is auto-projected. NO DENY, purely ADDITIVE → effective perms = the UNION of every bound rule → you CANNOT grant broadly then carve exceptions; the only way to limit access is to never grant it. DANGER of `cluster-admin` on a workload SA: any RCE / SSRF / poisoned dependency in that one Pod inherits TOTAL cluster control — read every Secret in every namespace (cloud creds, the CA key), schedule privileged host-mounting Pods, pivot to the nodes + control plane. RIGHT: start from zero, a namespaced Role with only the exact apiGroups/resources/verbs the app calls, a RoleBinding in that namespace; set `automountServiceAccountToken: false` if it never calls the API. CHECK: `kubectl auth can-i <verb> <resource> --as <user | system:serviceaccount:ns:name> -n <ns>`, or `--list` for everything.',
        hintHi: 'ROLE (namespaced) / CLUSTERROLE = rules ki ek list, har ek = `apiGroups` × `resources` × `verbs`. ROLEBINDING ek Role ko SUBJECTS ko grant karta hai: `User`, `Group`, `ServiceAccount`. Users/Groups k8s objects NAHI hain. SERVICEACCOUNT = identity jaisा ek Pod run karta hai. KOI DENY nahi, purely ADDITIVE → effective perms = har bound rule ka UNION → aap broadly grant karके exceptions carve nahi kar sakte. `cluster-admin` ka DANGER ek workload SA par: us ek Pod mein koi bhi RCE/SSRF TOTAL cluster control inherit karta hai. RIGHT: zero se shuru, sirf exact verbs/resources wali ek namespaced Role. CHECK: `kubectl auth can-i <verb> <resource> --as <...> -n <ns>`.',
      },
      {
        task: 'In a comment, explain how a ResourceQuota and a LimitRange interact, and why NetworkPolicy can be present but not enforced.',
        taskHi: 'Ek comment mein, ek ResourceQuota aur ek LimitRange ka interaction samjhao.',
        hint: 'RESOURCEQUOTA caps the namespace AGGREGATE (at admission): `requests.cpu`/`requests.memory`, `limits.*`, `count/pods`, `count/services.loadbalancers`, `persistentvolumeclaims`, `requests.storage`. A Pod that would push the namespace over ANY constrained quota is REJECTED. LIMITRANGE operates PER object in the namespace: injects `default` (limit) + `defaultRequest` into containers that OMIT them; enforces `min`/`max` (reject outside the band); `maxLimitRequestRatio`; also min/max PVC sizes. THE INTERACTION: once a ResourceQuota constrains a compute resource (e.g. `requests.cpu`), EVERY Pod in the namespace MUST declare that request or it\'s rejected (the quota can\'t account for an unset value). Without a LimitRange, every team must hand-set requests/limits on every container and any omission = a failed deploy. The LimitRange supplies the defaults automatically → omitting Pods are still admitted with sane values AND the quota has a number to count. So they ship together: quota = the spending cap, LimitRange = "nothing runs unbounded / undeclared". NETWORKPOLICY PRESENT-BUT-NOT-ENFORCED: the API server stores + validates NP objects regardless of environment, so `apply` succeeds and `get networkpolicy` lists them. The actual packet filtering is the CNI PLUGIN\'s job, and only some implement the spec — Calico / Cilium / Antrea / Weave YES; kindnet (kind\'s default) + plain flannel NO. On a non-enforcing CNI the policies are inert decoration: a default-deny "works" on paper, traffic still flows, and an audit that only checks for NP presence is fooled. ALWAYS verify: apply a deny, confirm a connection that should now fail actually does.',
        hintHi: 'RESOURCEQUOTA namespace AGGREGATE cap karta hai (admission par): `requests.cpu`/`memory`, `count/pods`, `persistentvolumeclaims`, `requests.storage`. LIMITRANGE namespace mein PER object operate karta hai: `default` + `defaultRequest` inject karta hai un containers mein jo unhe OMIT karte hain; `min`/`max` enforce karta hai. INTERACTION: ek baar ek ResourceQuota ek compute resource constrain karta hai, namespace mein HAR Pod ko wo request declare karna CHAHIYE ya ye reject hota hai. LimitRange defaults automatically supply karta hai. NETWORKPOLICY PRESENT-BUT-NOT-ENFORCED: API server NP objects store + validate karta hai environment ki parwah kiye bina. Actual packet filtering CNI PLUGIN ka kaam hai — Calico/Cilium/Antrea/Weave HAAN; kindnet + flannel NAHI. ALWAYS verify: ek deny apply karo, confirm karo ki ek connection jo ab fail hona chahiye actually hota hai.',
      },
    ],

    keyTakeaways: [
      'JOB = run Pods until `completions` SUCCEED, then stop. `parallelism` (how many at once), `backoffLimit` (default 6; `N` → `N+1` total attempts, then `Failed`/`BackoffLimitExceeded`), `activeDeadlineSeconds` (hard wall-clock cap — catches a HANG), `ttlSecondsAfterFinished` (auto-cleanup). `restartPolicy` MUST be `Never` (fresh Pod per attempt, keeps logs — preferred) or `OnFailure` (restart in place) — NEVER `Always` (rejected; can\'t complete). CRONJOB = a Job from `jobTemplate` on a 5-field `schedule`; `concurrencyPolicy` `Allow`|`Forbid`(skip if prev running — a hang then silently blocks all runs)|`Replace`; `startingDeadlineSeconds` (how late a missed run may start). AT-LEAST-ONCE, not exactly-once.',
      'RBAC: ROLE (namespaced) / CLUSTERROLE = rules of `apiGroups × resources (+ subresources) × verbs`. ROLEBINDING grants a Role (or a ClusterRole scoped to one ns) to SUBJECTS (`User`/`Group`/`ServiceAccount`); CLUSTERROLEBINDING is cluster-wide. Users/Groups come from the AUTH layer (certs/OIDC/IAM), not k8s objects. A SERVICEACCOUNT is the identity a Pod runs as (token auto-projected — disable with `automountServiceAccountToken: false` if unused). PURELY ADDITIVE, NO DENY → effective perms = the UNION of bound rules → you can only limit by never granting.',
      'LEAST PRIVILEGE: start from zero, grant a namespaced Role with exactly the verbs+resources the workload calls. Binding a workload SA to `cluster-admin` (or a broad ClusterRole) means any RCE/SSRF/poisoned-dependency in that Pod gets TOTAL cluster control (every Secret everywhere, privileged Pods, the nodes). Verify with `kubectl auth can-i <verb> <resource> --as system:serviceaccount:<ns>:<name> -n <ns>` (or `--list`).',
      'RESOURCEQUOTA caps the namespace AGGREGATE (`requests.*`, `limits.*`, `count/pods`, `count/services.loadbalancers`, `persistentvolumeclaims`, `requests.storage`) at admission. LIMITRANGE operates PER container/Pod/PVC: injects `default`/`defaultRequest` when omitted, enforces `min`/`max`, `maxLimitRequestRatio`. THEY SHIP TOGETHER: once a quota constrains a compute resource, EVERY Pod must declare it or be rejected — the LimitRange supplies the defaults so omitting Pods are still admitted. Quota = spending cap; LimitRange = nothing runs unbounded.',
      'NETWORKPOLICY: the default is ALL Pods can reach ALL Pods (any namespace, any port). A NP selecting a Pod for a direction flips it to DEFAULT-DENY for that direction; rules then ALLOW specific `podSelector`/`namespaceSelector`/`ipBlock` + ports. Baseline = a `podSelector: {}` deny-all-ingress + per-app allow rules (don\'t forget kube-dns :53 for egress). CRITICAL: NP is ONLY enforced if the CNI implements it — Calico/Cilium/Antrea/Weave YES; kindnet & flannel NO (the objects exist but nothing filters). Always test enforcement with a should-fail connection before relying on it.',
    ],
    keyTakeawaysHi: [
      'JOB = Pods chalao jab tak `completions` SUCCEED na karein, phir ruko. `parallelism`, `backoffLimit` (default 6; `N` → `N+1` total attempts), `activeDeadlineSeconds` (hard wall-clock cap — ek HANG catch karta hai), `ttlSecondsAfterFinished`. `restartPolicy` `Never` (per attempt fresh Pod, logs rakhta hai — preferred) ya `OnFailure` hona CHAHIYE — KABHI `Always` nahi. CRONJOB = ek 5-field `schedule` par `jobTemplate` se ek Job; `concurrencyPolicy` `Allow`|`Forbid`(skip agar prev running — ek hang phir chupचाप saare runs block karta hai)|`Replace`. AT-LEAST-ONCE.',
      'RBAC: ROLE (namespaced) / CLUSTERROLE = `apiGroups × resources × verbs` ke rules. ROLEBINDING ek Role ko SUBJECTS (`User`/`Group`/`ServiceAccount`) ko grant karta hai. Users/Groups AUTH layer se aate hain, k8s objects nahi. Ek SERVICEACCOUNT identity hai jaisा ek Pod run karta hai. PURELY ADDITIVE, KOI DENY nahi → effective perms = bound rules ka UNION → aap sirf kabhi grant na karके limit kar sakte ho.',
      'LEAST PRIVILEGE: zero se shuru, ek namespaced Role grant karo exactly un verbs+resources ke saath jo workload call karta hai. Ek workload SA ko `cluster-admin` se bind karna matlab us Pod mein koi bhi RCE/SSRF TOTAL cluster control paata hai. `kubectl auth can-i <verb> <resource> --as system:serviceaccount:<ns>:<name> -n <ns>` se verify karo.',
      'RESOURCEQUOTA namespace AGGREGATE cap karta hai admission par. LIMITRANGE PER container/Pod/PVC operate karta hai: omit karne par `default`/`defaultRequest` inject karta hai, `min`/`max` enforce karta hai. WO SAATH SHIP HOTE HAIN: ek baar ek quota ek compute resource constrain karta hai, HAR Pod ko ise declare karna chahiye ya reject — LimitRange defaults supply karta hai.',
      'NETWORKPOLICY: default SAARE Pods SAARE Pods tak pahunch sakte hain. Ek NP jo ek direction ke liye ek Pod select karta hai use us direction ke liye DEFAULT-DENY mein flip karta hai; rules phir specific `podSelector`/`namespaceSelector`/`ipBlock` + ports ALLOW karte hain. CRITICAL: NP SIRF enforce hoti hai agar CNI ise implement karta hai — Calico/Cilium/Antrea/Weave HAAN; kindnet & flannel NAHI. Rely karne se pehle hamesha ek should-fail connection se enforcement test karo.',
    ],
  },

  {
    slug: 'ops-helm-kustomize-and-when-not-to-use-kubernetes',
    title: 'Helm, Kustomize & When Not to Use Kubernetes',
    titleHi: 'Helm, Kustomize & Kubernetes Kab Use Na Karein',
    description: 'Raw YAML does not scale to many environments. Helm packages a set of manifests as a templated, versioned, installable chart. Kustomize layers plain-YAML overlays on a base without templating. And the last question of the module: given your app, team, and scale, is Kubernetes the right platform at all?',
    descriptionHi: 'Raw YAML kai environments tak scale nahi karta. Helm manifests ke ek set ko ek templated, versioned, installable chart ke roop mein package karta hai. Kustomize ek base par plain-YAML overlays layer karta hai bina templating ke. Aur module ka aakhiri sawaal: aapki app, team, aur scale ke saath, kya Kubernetes sahi platform hai bilkul?',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**Two ways to run a chain of coffee shops from one plan.** **Helm** is a franchise kit: a master blueprint full of blanks — "{{ seating capacity }}", "{{ local health-code clause }}", "{{ menu prices }}" — plus a values sheet per location that fills them in. Head office ships kit version 3.2; a franchisee runs `install` and gets a working shop, or `rollback` to 3.1 if the new layout flops. Powerful, but a blueprint that is 60% blanks and nested conditionals is hard to read. **Kustomize** is different: there is one real, complete, buildable shop design (the base), and each location is described as a short list of *diffs* from it — "this one: 40 seats not 30, add a drive-through, swap the sign." No blanks, no template language; you can read the base as a finished thing and each overlay as an honest changelog. And the meta-question: before franchising at all, is a nationwide chain the right model for what is, so far, one very good corner café?',
      hi: '**Ek plan se coffee shops ki ek chain chalane ke do tarike.** **Helm** ek franchise kit hai: blanks se bhara ek master blueprint — "{{ seating capacity }}", "{{ menu prices }}" — plus per location ek values sheet jo unhe bharti hai. Head office kit version 3.2 ship karta hai; ek franchisee `install` chalata hai. Powerful, par ek blueprint jo 60% blanks aur nested conditionals hai padhna mushkil hai. **Kustomize** alag hai: ek real, complete, buildable shop design hai (base), aur har location ek chhoti list of *diffs* ke roop mein describe hoti hai. Koi blanks nahi, koi template language nahi. Aur meta-question: franchising se pehle, kya ek nationwide chain sahi model hai jo, ab tak, ek bahut acha corner café hai?',
    },

    simple: `**RAW YAML doesn't scale to N environments. HELM templates; KUSTOMIZE overlays.**
\`\`\`
HELM        a CHART = templates/*.yaml (Go template + Sprig) + values.yaml (defaults) +
            Chart.yaml (name/version/deps). 'helm install rel ./chart -f prod.yaml --set x=y'
            renders + applies + records a RELEASE (revisioned). 'helm upgrade' / 'helm rollback N'
            / 'helm uninstall'. 'helm template' = render locally, apply nothing.
            + versioned, packaged, shareable (repos), dependency mgmt, hooks, rollback
            - it's a text templater: whitespace/indent pain, logic-in-templates, {{ }} soup
KUSTOMIZE   a BASE (real, valid, applyable YAML) + OVERLAYS that PATCH it. NO templating.
            overlay kustomization.yaml: resources: [../../base] + patches / images / replicas /
            namePrefix / commonLabels / configMapGenerator. 'kubectl kustomize overlays/prod'
            or 'kubectl apply -k'. built into kubectl.
            + the base is always a readable, valid manifest; diffs are explicit; no new language
            - no packaging/versioning/sharing story; awkward for big conditional variation
\`\`\`

**USE HELM** for third-party software (ingress-nginx, prometheus, cert-manager — you consume
their chart + a values file) and for your own apps if you need packaging/distribution/rollback.
**USE KUSTOMIZE** for your own apps across your own environments when you want plain YAML and
small, legible per-env diffs. **They compose:** \`helm template | kustomize\`, or Helm as a
Kustomize generator. Argo CD & Flux support both natively.

**WHEN *NOT* TO USE KUBERNETES:**
\`\`\`
you probably don't need K8s if:
  - 1-3 services, one team, traffic that fits a couple of VMs  -> a VM + Compose, or a PaaS
    (Render / Fly / Railway / App Runner / Cloud Run / ECS Fargate)
  - no team member whose job includes operating a cluster (upgrades, CNI, etcd, RBAC, CVEs)
  - "we might scale someday" — you can migrate WHEN you get there; the 12-factor app ports fine
K8s earns its complexity when: many services/teams needing self-service, bin-packing at real
  scale saves real money, you need its ecosystem (operators, HPA, multi-region), or you're
  already standardised on it. the platform has a full-time operational cost — budget it.
\`\`\``,

    simpleHi: `**RAW YAML N environments tak scale nahi karta. HELM templates karta hai; KUSTOMIZE overlays.**
\`\`\`
HELM        ek CHART = templates/*.yaml (Go template) + values.yaml (defaults) + Chart.yaml.
            'helm install rel ./chart -f prod.yaml --set x=y' render + apply + ek RELEASE record karta hai.
            'helm upgrade' / 'helm rollback N' / 'helm uninstall'. 'helm template' = locally render.
            + versioned, packaged, shareable, dependency mgmt, hooks, rollback
            - ek text templater hai: whitespace/indent pain, logic-in-templates, {{ }} soup
KUSTOMIZE   ek BASE (real, valid YAML) + OVERLAYS jo ise PATCH karte hain. KOI templating nahi.
            'kubectl kustomize overlays/prod' ya 'kubectl apply -k'. kubectl mein built-in.
            + base hamesha ek readable, valid manifest hai; diffs explicit; koi nai language nahi
            - koi packaging/versioning/sharing story nahi
\`\`\`

**HELM USE KARO** third-party software ke liye (ingress-nginx, prometheus, cert-manager) aur
apni apps ke liye agar packaging/distribution/rollback chahiye. **KUSTOMIZE USE KARO** apni
apps ke liye apne environments ke across jab plain YAML aur chhote per-env diffs chahiye.
**Wo compose karte hain.** Argo CD & Flux dono natively support karte hain.

**KUBERNETES KAB *NAHI* USE KARNA:**
\`\`\`
aapko shायद K8s nahi chahiye agar:
  - 1-3 services, ek team, traffic jo do VMs mein fit hota hai  -> ek VM + Compose, ya ek PaaS
  - koi team member nahi jiska job ek cluster operate karna include karta hai
  - "hum kabhi scale kar sakte hain" — aap migrate kar sakte ho JAB aap wahan pahunche
K8s apni complexity earn karta hai jab: kai services/teams ko self-service chahiye, real scale par
  bin-packing real paisa bachaता hai, aapko iska ecosystem chahiye. platform ka ek full-time
  operational cost hai — ise budget karo.
\`\`\``,

    content: `## Why not raw YAML

A handful of manifests applied with \`kubectl apply -f\` is fine for one environment. It breaks down as soon as you have dev, staging, and prod that differ — different replica counts, image tags, resource sizes, hostnames, feature flags. Copy-pasting the YAML three times and editing means every change has to be made three times and the copies drift. You need a way to express one definition plus a small, controlled set of per-environment differences. Helm and Kustomize are the two dominant answers.

## Helm

A **Helm chart** is a directory:

- **\`templates/*.yaml\`** — Kubernetes manifests with Go template directives (\`{{ .Values.replicaCount }}\`, \`{{ if .Values.ingress.enabled }}\`, plus the Sprig function library and Helm-specific helpers).
- **\`values.yaml\`** — the default values the templates read.
- **\`Chart.yaml\`** — name, version, appVersion, and dependencies on other charts.

You **render and apply** with \`helm install <release-name> <chart> -f values-prod.yaml --set image.tag=1.4.2\`. Helm renders the templates against the merged values, applies the result, and records a **release**: a versioned, named record of what was installed. \`helm upgrade\` rolls out a new revision; \`helm rollback <release> <revision>\` reverts to a previous one; \`helm uninstall\` removes it; \`helm history\` lists revisions. \`helm template\` renders to stdout without touching the cluster — essential for diffing and for feeding other tools.

Helm's strengths: charts are **versioned and packageable**, published to repositories and consumed by others — this is how almost all third-party Kubernetes software is distributed (ingress-nginx, Prometheus, cert-manager, Grafana). It has **dependency management**, **lifecycle hooks** (run a Job before an upgrade), and a real **rollback** built on release history.

Helm's weakness is that it is fundamentally a **text templating engine** operating on YAML. Whitespace and indentation inside templates are fragile, conditional logic accumulates in the templates until they are hard to read, and a heavily parameterised chart can become mostly \`{{ }}\` with the actual resource shape obscured. \`helm template | kubectl apply --dry-run\` and \`helm lint\` help, but the failure mode of "the rendered YAML is subtly wrong" is real.

## Kustomize

**Kustomize** takes the opposite approach: **no templating at all**. You have:

- A **base** — a directory of ordinary, complete, valid Kubernetes manifests plus a \`kustomization.yaml\` listing them. The base applies on its own.
- **Overlays** — directories, one per environment, each with a \`kustomization.yaml\` that references the base (\`resources: [../../base]\`) and declares modifications: strategic-merge or JSON patches, plus built-in transformers for common cases — \`images\` (change a tag or repository), \`replicas\`, \`namePrefix\` / \`nameSuffix\`, \`commonLabels\` / \`commonAnnotations\`, \`namespace\`, and \`configMapGenerator\` / \`secretGenerator\` (which also append a content hash to the name so a config change triggers a rollout).

\`kubectl kustomize overlays/prod\` renders the result; \`kubectl apply -k overlays/prod\` applies it. Kustomize is built into \`kubectl\`.

Kustomize's strength is legibility: the base is always a real manifest you can read and apply, and each overlay is a short, explicit list of differences — effectively a reviewable diff. There is no new language to learn and no rendering surprises. Its weakness is that it has **no packaging, versioning, or distribution story** — there is nothing analogous to a chart repository — and expressing large, branching variation between environments in patches is more awkward than a few \`if\` blocks in a template.

## They compose

The two are not mutually exclusive. A common pattern for third-party software is to run \`helm template\` to render the chart and then apply Kustomize overlays on top for local tweaks the chart does not expose. Kustomize can invoke Helm as a chart generator. Both **Argo CD** and **Flux** natively understand plain manifests, Kustomize overlays, and Helm charts, so a GitOps repo can mix all three.

## When not to use Kubernetes

Kubernetes is a large, powerful platform with a correspondingly large operational surface: cluster and node upgrades, the CNI, etcd, RBAC, admission control, a stream of CVEs, and the accumulated complexity of everything in this module. That cost is worth paying when you get enough back. You probably do **not** yet:

- **Small scale, one team.** One to a few services with traffic that comfortably fits two or three VMs runs fine on a VM with Docker Compose, or on a Platform-as-a-Service — Render, Fly.io, Railway, Google Cloud Run, AWS App Runner, AWS ECS with Fargate — which give you rolling deploys, TLS, autoscaling, and health checks without a cluster to operate.
- **No one to operate it.** If no team member's job description includes running a Kubernetes cluster, adopting one means either that work does not get done — an unpatched, drifting cluster — or it silently consumes an engineer.
- **"We might need to scale."** You can adopt Kubernetes when you actually reach that point. A 12-factor application — stateless, config from the environment, disposable processes — ports to Kubernetes in days, and the earlier years on a simpler platform are cheaper and faster.

Kubernetes earns its complexity when you have **many services and teams that need self-service deployment**, when **bin-packing at real scale** saves meaningful money, when you specifically need its **ecosystem** — operators for stateful systems, HPA, multi-region, a service mesh — or when your organisation is **already standardised** on it and going against that costs more than it saves. The honest framing is that the platform has a permanent, full-time operational cost, and the decision is whether the workload and the team get more than that back.

## The module in one line

Scaling, scheduling, storage, and governance are the tools for running many workloads safely on shared infrastructure — autoscale on the right signal, schedule with intent, treat persistent data as precious, cap every blast radius with RBAC and quotas — and the meta-skill is knowing when that machinery is worth its weight and when a VM and a PaaS will serve the same need for far less.`,

    contentHi: `## Raw YAML kyun nahi

Ek environment ke liye \`kubectl apply -f\` se apply kiye kuch manifests theek hain. Ye tab break hota hai jab aapke paas dev, staging, aur prod hain jo differ karte hain — alag replica counts, image tags, resource sizes, hostnames. YAML ko teen baar copy-paste karke edit karne ka matlab har change teen baar karna hai. Aapko ek definition plus ek chhote, controlled set of per-environment differences express karne ka tarika chahiye.

## Helm

Ek **Helm chart** ek directory hai:
- **\`templates/*.yaml\`** — Go template directives ke saath Kubernetes manifests.
- **\`values.yaml\`** — default values jo templates padhte hain.
- **\`Chart.yaml\`** — name, version, aur doosre charts par dependencies.

Aap \`helm install <release-name> <chart> -f values-prod.yaml --set image.tag=1.4.2\` se **render aur apply** karte ho. Helm merged values ke against templates render karta hai, result apply karta hai, aur ek **release** record karta hai. \`helm upgrade\` ek naya revision roll out karta hai; \`helm rollback\` ek pichhle par reverts; \`helm template\` cluster ko touch kiye bina stdout par render karta hai.

Helm ki strengths: charts **versioned aur packageable** hain — isi tarah lagbhag saara third-party Kubernetes software distribute hota hai. Iske paas **dependency management**, **lifecycle hooks**, aur ek real **rollback** hai.

Helm ki weakness ye hai ki ye fundamentally ek **text templating engine** hai jo YAML par operate karta hai. Templates ke andar whitespace fragile hai, conditional logic templates mein accumulate hoti hai.

## Kustomize

**Kustomize** opposite approach leta hai: **koi templating bilkul nahi**. Aapke paas:
- Ek **base** — ordinary, complete, valid Kubernetes manifests ki ek directory plus ek \`kustomization.yaml\`.
- **Overlays** — directories, per environment ek, har ek ek \`kustomization.yaml\` ke saath jo base ko reference karta hai aur modifications declare karta hai: patches, plus built-in transformers — \`images\`, \`replicas\`, \`namePrefix\`, \`commonLabels\`, aur \`configMapGenerator\`.

\`kubectl kustomize overlays/prod\` result render karta hai. Kustomize \`kubectl\` mein built-in hai.

Kustomize ki strength legibility hai: base hamesha ek real manifest hai jise aap padh sakte ho, aur har overlay differences ki ek chhoti, explicit list hai. Iski weakness ye hai ki iske paas **koi packaging, versioning, ya distribution story nahi** hai.

## Wo compose karte hain

Dono mutually exclusive nahi hain. Both **Argo CD** aur **Flux** natively plain manifests, Kustomize overlays, aur Helm charts samajhte hain.

## Kubernetes kab use na karein

Kubernetes ek bada, powerful platform hai ek correspondingly bade operational surface ke saath. Wo cost tab paying worth hai jab aap kaafi wapas paate ho. Aapko shायद abhi **nahi** chahiye:
- **Small scale, ek team.** Ek se kuch services jo do ya teen VMs mein fit hote hain ek VM par Docker Compose ke saath theek chalti hain, ya ek PaaS par — Render, Fly.io, Railway, Cloud Run, App Runner, ECS Fargate.
- **Ise operate karne ke liye koi nahi.** Agar kisi team member ke job description mein ek Kubernetes cluster chalana include nahi hai, ek adopt karna matlab ya to wo kaam nahi hota ya ye chupचाप ek engineer consume karta hai.
- **"Hum scale kar sakte hain."** Aap Kubernetes tab adopt kar sakte ho jab aap actually us point par pahunchein.

Kubernetes apni complexity tab earn karta hai jab aapke paas **kai services aur teams hain jinhe self-service deployment chahiye**, jab **real scale par bin-packing** meaningful paisa bachaता hai, jab aapko specifically iska **ecosystem** chahiye, ya jab aapka organisation ispar **already standardised** hai.`,

    examples: [
      {
        title: 'Helm renders from values; Kustomize patches a base — same output, opposite mechanism',
        titleHi: 'Helm values se render karta hai; Kustomize ek base patch karta hai — same output, opposite mechanism',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
work=$(mktemp -d); cd "$work"
trap 'rm -rf "$work"' EXIT

# ---- HELM: a tiny chart; values drive the rendered manifest ----
mkdir -p mychart/templates
printf 'apiVersion: v2\\nname: mychart\\nversion: 0.1.0\\n' > mychart/Chart.yaml
printf 'replicaCount: 1\\nimage:\\n  repository: nginx\\n  tag: "1.27-alpine"\\n' > mychart/values.yaml
cat > mychart/templates/deployment.yaml <<'TPL'
apiVersion: apps/v1
kind: Deployment
metadata: { name: {{ .Release.Name }}-web }
spec:
  replicas: {{ .Values.replicaCount }}
  selector: { matchLabels: { app: {{ .Release.Name }}-web } }
  template:
    metadata: { labels: { app: {{ .Release.Name }}-web } }
    spec:
      containers:
        - name: web
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
TPL

echo "HELM, default values : $(helm template rel ./mychart | grep -E 'replicas:|image:' | tr -s ' ' | paste -sd',' - | sed 's/^ //')"
echo "HELM, prod override  : $(helm template rel ./mychart --set replicaCount=4 --set image.tag=1.27 | grep -E 'replicas:|image:' | tr -s ' ' | paste -sd',' - | sed 's/^ //')"

# ---- KUSTOMIZE: a real base + a prod overlay, no templating ----
mkdir -p k/base k/overlays/prod
cat > k/base/deployment.yaml <<'B'
apiVersion: apps/v1
kind: Deployment
metadata: { name: web }
spec:
  replicas: 1
  selector: { matchLabels: { app: web } }
  template:
    metadata: { labels: { app: web } }
    spec: { containers: [ { name: web, image: "nginx:1.27-alpine" } ] }
B
printf 'resources: [ deployment.yaml ]\\n' > k/base/kustomization.yaml
cat > k/overlays/prod/kustomization.yaml <<'O'
resources: [ ../../base ]
replicas:
  - { name: web, count: 4 }
images:
  - { name: nginx, newTag: "1.27" }
O
echo "KUSTOMIZE base       : $(kubectl kustomize k/base | grep -E 'replicas:|image:' | tr -s ' ' | paste -sd',' - | sed 's/^ //')"
echo "KUSTOMIZE prod overlay: $(kubectl kustomize k/overlays/prod | grep -E 'replicas:|image:' | tr -s ' ' | paste -sd',' - | sed 's/^ //')"`,
        output: `HELM, default values : replicas: 1, image: "nginx:1.27-alpine"
HELM, prod override  : replicas: 4, image: "nginx:1.27"
KUSTOMIZE base       : replicas: 1, - image: nginx:1.27-alpine
KUSTOMIZE prod overlay: replicas: 4, - image: nginx:1.27`,
        explain: 'The same two-environment problem — a replica count and an image tag that differ between default and production — is solved twice. The Helm side defines a chart whose deployment template has placeholders for both values and a values file supplying the defaults; rendering with no arguments produces one replica on the alpine tag, and rendering with two set overrides produces four replicas on the production tag. The template is the single source and the values are the variation. The Kustomize side defines a base that is a complete, valid Deployment manifest — it renders and applies exactly as written, with one replica — and a prod overlay that references the base and declares two changes through built-in transformers: set replicas to four, and retag the nginx image. Rendering the base gives the base; rendering the overlay gives the patched result. The output is equivalent, but the mechanisms are opposites: Helm starts from a template full of blanks and fills them, while Kustomize starts from a real manifest and records diffs against it. The practical trade is that the Kustomize base is always directly readable while the Helm template needs rendering to understand, against Helm\'s packaging, versioning, and rollback that Kustomize does not provide.',
        explainHi: 'Wahi do-environment problem — ek replica count aur ek image tag jo default aur production ke beech differ karte hain — do baar solve kiya jaata hai. Helm side ek chart define karta hai jiske deployment template mein dono values ke liye placeholders hain aur ek values file defaults supply karti hai; bina arguments ke render karna alpine tag par ek replica produce karta hai, aur do set overrides ke saath render karna production tag par chaar replicas produce karta hai. Kustomize side ek base define karta hai jo ek complete, valid Deployment manifest hai — ye exactly waise render aur apply hota hai jaise likha hai — aur ek prod overlay jo base ko reference karta hai aur built-in transformers ke through do changes declare karta hai. Output equivalent hai, par mechanisms opposites hain: Helm blanks se bhare ek template se shuru hota hai aur unhe bharता hai, jabki Kustomize ek real manifest se shuru hota hai aur iske against diffs record karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# adopting Kubernetes for a 2-service side project "to learn / to be ready"
# reality 6 months later:
#   - the cluster is on k8s 1.27 (2 versions behind), nobody has time to upgrade
#   - one engineer is the de-facto cluster admin and spends ~1 day/week on it
#   - the monthly bill is 3x what a $20 VM + a managed DB would cost
#   - shipping a change still takes a Helm values PR + a review + a sync
# ...for traffic that peaks at 5 req/s.`,
        right: `# match the platform to the actual need. for 1-3 services, one team, modest traffic:
#   - a VM (or two, behind a load balancer) running docker compose, OR
#   - a PaaS: Render / Fly.io / Railway / Cloud Run / App Runner / ECS Fargate
#     -> rolling deploys, TLS, health checks, autoscaling, logs - no cluster to run
# keep the app 12-factor (stateless, config from env, disposable) so that IF you
# genuinely outgrow the PaaS, the move to Kubernetes is a few days, not a rewrite.
# adopt K8s when: many teams need self-service, bin-packing at scale saves real money,
# you need the ecosystem (operators/HPA/multi-region), or you're already standardised on it.`,
        why: 'Kubernetes carries a fixed operational cost that is independent of how small the workload is: the control plane and nodes need version upgrades on the project\'s cadence, the CNI and ingress and cert management need maintenance, RBAC and admission policies need curation, and a continuous stream of CVEs needs triage. For a two-service project with light traffic, none of that work is offset by a benefit — the bin-packing efficiency is irrelevant at that size, the self-service value needs multiple teams to matter, and the ecosystem features go unused. The result is that a single engineer becomes an unofficial cluster administrator spending a meaningful fraction of their time keeping the platform alive, the infrastructure bill is several times higher than a VM or a PaaS would be, and the deployment process is heavier without being safer. The right choice at that scale is a VM running Compose or a Platform-as-a-Service, both of which provide rolling deploys, TLS, health checks, and autoscaling without a cluster to operate. Keeping the application to twelve-factor principles means that if the project genuinely outgrows that platform later, migrating to Kubernetes is a short project rather than a rebuild, so there is no lock-in cost to deferring the decision.',
        whyHi: 'Kubernetes ek fixed operational cost carry karta hai jo workload kitni chhoti hai us se independent hai: control plane aur nodes ko project ke cadence par version upgrades chahiye, CNI aur ingress aur cert management ko maintenance chahiye, RBAC ko curation chahiye, aur CVEs ki ek continuous stream ko triage chahiye. Ek do-service project ke liye light traffic ke saath, us kaam mein se kuch bhi ek benefit se offset nahi hota. Result ye hai ki ek single engineer ek unofficial cluster administrator ban jaata hai apne samay ka ek meaningful fraction platform ko alive rakhne mein kharch karke, infrastructure bill ek VM ya ek PaaS se kai guna zyada hai. Us scale par sahi choice ek VM jo Compose chalata hai ya ek Platform-as-a-Service hai.',
      },
      {
        wrong: `# a chart that has become 70% template logic - unreadable and unreviewable
{{- if or .Values.ingress.enabled (and .Values.legacy .Values.legacy.ingress) }}
{{- range $host := .Values.ingress.hosts }}
  {{- if $.Values.ingress.tls }}
    {{- /* 40 more lines of nested conditionals and 'indent 8' calls */}}
# a reviewer cannot tell what this renders to without running 'helm template' for
# every values permutation. bugs hide in the whitespace.`,
        right: `# keep templates SHALLOW; push variation into values, not template branches:
#   - one code path; optional features are values that add a block, not 'if' pyramids
#   - 'helm template' in CI for every values file you ship, + 'helm lint', + kubeconform
#   - review the RENDERED output in PRs (helm template | git diff), not just the chart
#   - if the variation is genuinely large and structural -> that's a sign to use Kustomize
#     overlays (or separate charts) instead of one mega-chart with a config language in it
# for YOUR OWN apps across YOUR envs, Kustomize's plain-YAML diffs are often the better fit;
# save Helm for packaged, distributed, versioned software.`,
        why: 'Helm templates are Go text templates that emit YAML, and every conditional, loop, and helper added to a template increases the number of distinct outputs it can produce and the difficulty of predicting any one of them by reading the source. A chart that is mostly control flow cannot be reviewed meaningfully, because the reviewer would have to mentally render it for each combination of values, and whitespace-sensitive bugs — a missing or extra indent inside a conditional branch that is only taken in production — are invisible until that branch runs. The mitigations are to keep templates shallow with a single code path and express optional behaviour as values that contribute a block rather than as nested conditionals, to run helm template against every shipped values file plus helm lint and a schema validator in CI, and to review the rendered manifests in pull requests rather than only the template diff. When the variation between environments is genuinely large and structural rather than a few parameters, that is a signal that Kustomize overlays or separate charts fit better than one chart with an embedded configuration language, and for an organisation\'s own applications across its own environments the plain-YAML, explicit-diff model of Kustomize is frequently the better choice, with Helm reserved for software that is packaged and distributed to others.',
        whyHi: 'Helm templates Go text templates hain jo YAML emit karte hain, aur ek template mein add kiya gaya har conditional, loop, aur helper distinct outputs ki sankhya badhaता hai jo ye produce kar sakta hai aur source padhкर kisi ek ko predict karne ki difficulty. Ek chart jo zyadaatar control flow hai meaningfully review nahi ho sakta, kyunki reviewer ko values ke har combination ke liye ise mentally render karna hoga, aur whitespace-sensitive bugs invisible hain jab tak wo branch run na kare. Mitigations templates ko shallow rakhna hain ek single code path ke saath, CI mein har shipped values file ke against helm template chalana, aur pull requests mein rendered manifests review karna. Jab environments ke beech variation genuinely large aur structural hai, wo ek signal hai ki Kustomize overlays behtar fit karte hain.',
      },
      {
        wrong: `# putting real Secret values into a Helm chart or a Kustomize base, committed to git
# values-prod.yaml (in the repo):
database:
  password: "pr0d-p@ssw0rd-2024"        # <-- now in git history forever
# or a Kustomize secretGenerator with literals:
secretGenerator:
  - name: db
    literals: [ "password=pr0d-p@ssw0rd-2024" ]     # <-- same problem`,
        right: `# neither Helm nor Kustomize is a secrets manager. keep secret VALUES out of git:
#   - reference an EXISTING Secret the chart/overlay does not create
#     (created out-of-band by External Secrets Operator, Vault, a cloud CSI driver, or sealed-secrets)
#   - or SOPS-encrypt the values file (helm-secrets plugin / Kustomize ksops) so what's in
#     git is ciphertext, decrypted only at apply time by someone/something with the key
#   - Argo CD / Flux integrate with all of these
# the chart/overlay carries the STRUCTURE (which env var maps to which key); the VALUE
# comes from the secrets layer at deploy time. this ties back to Module 8 (Secrets = base64).`,
        why: 'Helm and Kustomize both render manifests from files that live in version control, and a plaintext credential placed in a values file, a chart default, or a Kustomize generator literal is therefore committed to the repository and preserved in its history indefinitely, readable by anyone with clone access and unremovable without rewriting history. Neither tool is a secrets manager and neither encrypts anything by default. The correct pattern separates structure from value: the chart or overlay defines how a secret is consumed — which environment variable or mounted file maps to which key — and references a Secret object by name that it does not itself create, while the actual Secret is populated by a dedicated secrets layer at or before deploy time. That layer can be the External Secrets Operator or a Vault injector syncing from an external store, a cloud provider\'s CSI secrets driver mounting values directly, or sealed-secrets and SOPS, which keep only ciphertext in git and decrypt at apply time using a key held outside the repository. Argo CD and Flux integrate with all of these. The chart travels with the code; the secret does not.',
        whyHi: 'Helm aur Kustomize dono files se manifests render karte hain jo version control mein rehti hain, aur ek plaintext credential jo ek values file, ek chart default, ya ek Kustomize generator literal mein rakha hai isliye repository mein committed hai aur iski history mein indefinitely preserved hai. Koi bhi tool ek secrets manager nahi hai. Correct pattern structure ko value se separate karta hai: chart ya overlay define karta hai ki ek secret kaise consume hota hai aur ek Secret object ko naam se reference karta hai jo ye khud nahi banata, jabki actual Secret ek dedicated secrets layer dwara populate hota hai. Wo layer External Secrets Operator, ek cloud CSI secrets driver, ya sealed-secrets aur SOPS ho sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**A 4-person startup that spent its first year fighting a self-managed cluster** — one founder was effectively a part-time platform engineer. They moved to a PaaS in a week, cut the infra bill 60%, and shipped features again. Adopted Kubernetes two years later at 40 engineers, when the pain was real.',
        hi: '**Ek 4-person startup jisne apna pehla saal ek self-managed cluster se ladte hue bitaya** — ek founder effectively ek part-time platform engineer tha. Wo ek hafte mein ek PaaS par chale gaye.',
      },
      {
        en: '**A community Helm chart with 900 lines of `values.yaml` and 1500 of templates** — every upgrade broke something subtle in the rendered output. The platform team vendored it, ran `helm template` once, and moved to Kustomize-patching the frozen output; upgrades became a reviewable diff.',
        hi: '**Ek community Helm chart 900 lines `values.yaml` aur 1500 templates ke saath** — har upgrade rendered output mein kuch subtle todता tha. Platform team ne ise vendor kiya aur Kustomize-patching par chale gaye.',
      },
      {
        en: '**A `values-prod.yaml` with the database password in it, in a public-adjacent repo** — caught in a routine secret scan. Rotated the credential, moved every secret to the External Secrets Operator syncing from AWS Secrets Manager, and added `gitleaks` to CI.',
        hi: '**Ek `values-prod.yaml` jismein database password tha, ek public-adjacent repo mein** — ek routine secret scan mein caught. Har secret ko External Secrets Operator par move kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'Compare Helm and Kustomize — how each works, and when you would choose one over the other.',
        qHi: 'Helm aur Kustomize compare karo — har ek kaise kaam karta hai, aur aap kab ek ko doosre par choose karoge.',
        a: 'Helm is a package manager for Kubernetes. A chart is a directory of Go-templated manifests plus a values file of defaults and a Chart.yaml with version and dependencies. You install a chart into the cluster with helm install, supplying environment-specific values, and Helm renders the templates, applies the result, and records a versioned release. helm upgrade rolls a new revision, helm rollback reverts to a previous one, and helm template renders locally without applying. Its strengths are that charts are versioned, packageable, and published to repositories — which is how essentially all third-party Kubernetes software ships — plus dependency management, lifecycle hooks, and real rollback. Its weakness is that it is a text templating engine over YAML, so heavily parameterised charts become hard to read and whitespace bugs hide in conditional branches. Kustomize does no templating. You have a base of ordinary valid manifests and per-environment overlays that reference the base and declare patches plus built-in transformers for images, replicas, name prefixes, labels, and config generation. kubectl kustomize renders it and it is built into kubectl. Its strength is legibility: the base is always a real manifest and each overlay is an explicit, reviewable diff with no new language. Its weakness is no packaging or distribution story and awkwardness with large structural variation. In practice you use Helm to consume third-party software and for your own apps when you need packaging and rollback, and Kustomize for your own apps across your own environments when you want plain YAML and small per-environment diffs; they also compose, and Argo CD and Flux support both.',
        aHi: 'Helm Kubernetes ke liye ek package manager hai. Ek chart Go-templated manifests ki ek directory plus defaults ki ek values file plus ek Chart.yaml hai. Aap ek chart ko cluster mein helm install se install karte ho, environment-specific values supply karke, aur Helm templates render karta hai, result apply karta hai, aur ek versioned release record karta hai. Iski strengths ye hain ki charts versioned, packageable, aur repositories mein published hain, plus dependency management, lifecycle hooks, aur real rollback. Iski weakness ye hai ki ye YAML par ek text templating engine hai. Kustomize koi templating nahi karता. Aapke paas ordinary valid manifests ka ek base aur per-environment overlays hain jo base ko reference karte hain aur patches declare karte hain. Iski strength legibility hai. Practice mein aap Helm ko third-party software consume karne ke liye use karते ho aur Kustomize apni apps ke liye apne environments ke across.',
      },
      {
        q: 'When would you advise a team NOT to use Kubernetes, and what would you suggest instead?',
        qHi: 'Aap ek team ko Kubernetes use NA karne ki salah kab doge, aur iske bajaay kya suggest karoge?',
        a: 'Kubernetes has a fixed operational cost that does not shrink with the workload: cluster and node upgrades on the project\'s cadence, CNI and ingress and certificate maintenance, RBAC and admission curation, and continuous CVE triage. I would advise against it when that cost is not repaid. The clearest cases are a small number of services — one to a few — run by a single team with traffic that fits comfortably on two or three VMs; a team with no one whose actual job is operating a cluster, so adopting one either leaves it unmaintained or quietly consumes an engineer; and a team adopting it speculatively because they might need to scale one day. In those situations I would suggest a VM or a pair of VMs behind a load balancer running Docker Compose, or a Platform-as-a-Service such as Render, Fly.io, Railway, Google Cloud Run, AWS App Runner, or ECS with Fargate, all of which provide rolling deployments, TLS, health checks, autoscaling, and log aggregation without a cluster to operate. The key is to keep the application twelve-factor — stateless, configured from the environment, with disposable processes — so that if it genuinely outgrows the simpler platform later, moving to Kubernetes is a matter of days. Kubernetes becomes the right call when many teams need self-service deployment, when bin-packing at real scale saves meaningful money, when the workload specifically needs the ecosystem such as operators for stateful systems or multi-region capabilities, or when the organisation is already standardised on it.',
        aHi: 'Kubernetes ka ek fixed operational cost hai jo workload ke saath shrink nahi hota. Main iske khilaf salah dunga jab wo cost repaid nahi hota. Sabse clear cases ek chhoti sankhya mein services hain — ek se kuch — ek single team dwara run kiye traffic ke saath jo do ya teen VMs par comfortably fit hota hai; ek team jismein koi nahi jiska actual job ek cluster operate karna hai; aur ek team jo ise speculatively adopt kar rahi hai. Un situations mein main ek VM ya do VMs ek load balancer ke peeche Docker Compose chalate hue suggest karunga, ya ek Platform-as-a-Service jaise Render, Fly.io, Cloud Run, App Runner. Key application ko twelve-factor rakhna hai taaki agar ye baad mein genuinely outgrow kare, Kubernetes par move karna kuch din ki baat hai. Kubernetes sahi call ban jaata hai jab kai teams ko self-service chahiye, jab real scale par bin-packing meaningful paisa bachaता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, describe how Helm and Kustomize each work, their strengths and weaknesses, and the rule of thumb for choosing.',
        taskHi: 'Ek comment mein, describe karo ki Helm aur Kustomize har ek kaise kaam karte hain.',
        hint: 'HELM: a CHART = `templates/*.yaml` (Go template + Sprig) + `values.yaml` (defaults) + `Chart.yaml` (name/version/deps). `helm install <rel> <chart> -f prod.yaml --set x=y` renders against merged values → applies → records a versioned RELEASE. `helm upgrade` (new revision), `helm rollback <rel> <N>` (revert), `helm uninstall`, `helm template` (render to stdout, apply nothing). STRENGTHS: versioned + packageable + published to repos (how ~all third-party k8s software ships — ingress-nginx, prometheus, cert-manager), dependency mgmt, lifecycle hooks, real rollback. WEAKNESS: it\'s a TEXT templater over YAML → whitespace/indent fragility, logic accumulates in templates, a heavily-parameterised chart becomes unreadable `{{ }}` soup. KUSTOMIZE: a BASE (ordinary, complete, VALID manifests + a `kustomization.yaml`) + per-env OVERLAYS that `resources: [../../base]` and declare strategic-merge/JSON patches + built-in transformers (`images`, `replicas`, `namePrefix`, `commonLabels`, `configMapGenerator` — appends a content hash → config change triggers a rollout). `kubectl kustomize <dir>` / `kubectl apply -k` — built into kubectl. STRENGTH: the base is always a readable valid manifest; each overlay is an explicit reviewable diff; NO new language. WEAKNESS: no packaging/versioning/distribution story; awkward for big structural variation. RULE OF THUMB: HELM for third-party software + your own apps needing packaging/distribution/rollback; KUSTOMIZE for your own apps across your own envs wanting plain YAML + small legible per-env diffs. They COMPOSE (`helm template | kustomize`); Argo CD & Flux support both.',
        hintHi: 'HELM: ek CHART = `templates/*.yaml` (Go template) + `values.yaml` + `Chart.yaml`. `helm install` merged values ke against render karta hai → apply → ek versioned RELEASE record karta hai. `helm upgrade` / `helm rollback <rel> <N>` / `helm template`. STRENGTHS: versioned + packageable + repos mein published, dependency mgmt, real rollback. WEAKNESS: YAML par ek TEXT templater → whitespace fragility, `{{ }}` soup. KUSTOMIZE: ek BASE (ordinary, VALID manifests) + per-env OVERLAYS jo patches + built-in transformers declare karte hain (`images`, `replicas`, `configMapGenerator`). kubectl mein built-in. STRENGTH: base hamesha readable valid manifest; har overlay ek explicit diff; KOI nai language nahi. WEAKNESS: koi packaging story nahi. RULE: HELM third-party software ke liye; KUSTOMIZE apni apps ke liye apne envs ke across. Wo COMPOSE karte hain.',
      },
      {
        task: 'In a comment, list the concrete signs a team should NOT adopt Kubernetes yet, what to use instead, and the specific conditions under which K8s does earn its cost.',
        taskHi: 'Ek comment mein, concrete signs list karo ki ek team ko abhi Kubernetes adopt NAHI karna chahiye.',
        hint: 'K8s carries a FIXED operational cost independent of workload size: control-plane + node upgrades on the project\'s cadence, CNI/ingress/cert maintenance, RBAC + admission curation, continuous CVE triage. DON\'T adopt it yet if: (1) 1-3 services, ONE team, traffic that fits comfortably on 2-3 VMs; (2) NO team member whose actual job includes operating a cluster → it goes unpatched/drifting OR silently eats an engineer (~1 day/week is common); (3) "we MIGHT need to scale someday" — speculative adoption; you can migrate WHEN you get there. USE INSTEAD: a VM (or 2 behind a LB) running docker compose, OR a PaaS — Render / Fly.io / Railway / Google Cloud Run / AWS App Runner / ECS Fargate — all give rolling deploys + TLS + health checks + autoscaling + logs with NO cluster to run. Keep the app 12-FACTOR (stateless, config from env, disposable processes) so a later move to K8s is days, not a rewrite → no lock-in cost to deferring. K8S EARNS ITS COST WHEN: many services/teams need self-service deployment; bin-packing at REAL scale saves meaningful money; you specifically need the ecosystem (operators for stateful systems, HPA, multi-region, service mesh); or the org is ALREADY standardised on it and diverging costs more than it saves. The platform has a permanent full-time operational cost — budget it explicitly.',
        hintHi: 'K8s ek FIXED operational cost carry karta hai workload size se independent: control-plane + node upgrades, CNI/ingress/cert maintenance, RBAC curation, continuous CVE triage. ABHI adopt MAT karo agar: (1) 1-3 services, EK team, traffic jo 2-3 VMs par fit hota hai; (2) KOI team member nahi jiska actual job ek cluster operate karna hai → ye unpatched jaata hai YA chupचाप ek engineer khata hai; (3) "hum kabhi scale kar sakte hain" — speculative adoption. USE INSTEAD: ek VM jo docker compose chalata hai, YA ek PaaS — Render / Fly.io / Cloud Run / App Runner / ECS Fargate. App ko 12-FACTOR rakho taaki baad mein K8s par move kuch din hai. K8S APNI COST EARN KARTA HAI JAB: kai teams ko self-service chahiye; REAL scale par bin-packing meaningful paisa bachaता hai; aapko specifically ecosystem chahiye; ya org ALREADY standardised hai.',
      },
      {
        task: 'In a comment, explain why neither Helm nor Kustomize should hold secret values, and the correct pattern for secrets with them.',
        taskHi: 'Ek comment mein, samjhao ki na Helm na Kustomize ko secret values rakhni chahiye.',
        hint: 'Both Helm and Kustomize RENDER from files in VERSION CONTROL. A plaintext credential in a `values-prod.yaml`, a chart default, or a Kustomize `secretGenerator` literal is therefore COMMITTED to the repo and kept in its history INDEFINITELY — readable by anyone with clone access, unremovable without rewriting history. Neither tool is a secrets manager; neither encrypts anything by default (ties to Module 8: a k8s Secret is only base64 too). CORRECT PATTERN — separate STRUCTURE from VALUE: the chart/overlay defines HOW the secret is consumed (which env var / mounted file → which key) and references an EXISTING Secret object BY NAME that it does NOT create; the actual Secret is populated by a dedicated secrets layer at/before deploy time: (a) External Secrets Operator or a Vault Agent injector syncing from Vault / AWS Secrets Manager / GCP Secret Manager; (b) a cloud CSI Secrets Store driver mounting values directly (no Secret object at all); (c) sealed-secrets or SOPS (helm-secrets / Kustomize ksops) → only CIPHERTEXT in git, decrypted at apply time with a key held OUTSIDE the repo. Argo CD / Flux integrate with all of these. The chart travels with the code; the secret VALUE comes from the secrets layer.',
        hintHi: 'Helm aur Kustomize dono VERSION CONTROL mein files se RENDER karte hain. Ek `values-prod.yaml`, ek chart default, ya ek Kustomize `secretGenerator` literal mein ek plaintext credential isliye repo mein COMMITTED hai aur iski history mein INDEFINITELY kept — history rewrite kiye bina unremovable. Koi bhi tool ek secrets manager nahi hai (Module 8 se ties: ek k8s Secret bhi sirf base64 hai). CORRECT PATTERN — STRUCTURE ko VALUE se separate karo: chart/overlay define karta hai ki secret KAISE consume hota hai aur ek EXISTING Secret object ko NAAM se reference karta hai jo ye NAHI banata; actual Secret ek dedicated secrets layer dwara populate hota hai: External Secrets Operator, ek cloud CSI Secrets Store driver, ya sealed-secrets / SOPS (git mein sirf CIPHERTEXT). Argo CD / Flux sab ke saath integrate karte hain.',
      },
    ],

    keyTakeaways: [
      'RAW YAML doesn\'t scale to dev/staging/prod that differ. HELM = a CHART (`templates/*.yaml` Go-templated + `values.yaml` defaults + `Chart.yaml` version/deps); `helm install/upgrade/rollback/uninstall` renders against merged values, applies, and records a VERSIONED RELEASE; `helm template` renders locally. Strengths: versioned, packageable, published to repos (how ~all third-party k8s software ships), dependency mgmt, hooks, real rollback. Weakness: a TEXT templater over YAML → whitespace fragility + `{{ }}` logic soup in over-parameterised charts.',
      'KUSTOMIZE = a BASE (ordinary, complete, VALID manifests) + per-env OVERLAYS that reference the base and declare patches + built-in transformers (`images`, `replicas`, `namePrefix`, `commonLabels`, `configMapGenerator`/`secretGenerator` — hash-suffixed so a config change rolls the workload). `kubectl kustomize` / `kubectl apply -k` — built into kubectl. Strength: the base is always a readable valid manifest, each overlay is an explicit reviewable diff, NO new language. Weakness: no packaging/versioning/distribution; awkward for large structural variation.',
      'CHOOSING: HELM for third-party software and for your own apps needing packaging/distribution/rollback; KUSTOMIZE for your own apps across your own environments wanting plain YAML + small legible per-env diffs. They COMPOSE (`helm template | kustomize`, or Helm as a Kustomize generator); Argo CD and Flux support plain YAML, Kustomize, and Helm natively. NEITHER is a secrets manager — keep secret VALUES out of git: reference an existing Secret populated by External Secrets Operator / Vault / a CSI driver, or SOPS/sealed-secrets (ciphertext in git, decrypted at apply).',
      'DON\'T ADOPT KUBERNETES YET if: 1-3 services + one team + traffic that fits 2-3 VMs; no team member whose job is operating a cluster (→ unpatched drift OR it silently eats an engineer); or speculative "we might scale someday" adoption. USE INSTEAD: a VM (or 2 behind an LB) with docker compose, OR a PaaS (Render / Fly.io / Railway / Cloud Run / App Runner / ECS Fargate) — rolling deploys, TLS, health checks, autoscaling, logs, no cluster to run. Keep the app 12-factor so a later move to K8s is days, not a rewrite.',
      'KUBERNETES EARNS ITS COST when: many services/teams need self-service deployment; bin-packing at REAL scale saves meaningful money; you specifically need the ecosystem (operators for stateful systems, HPA, multi-region, service mesh); or the org is already standardised on it. The platform has a PERMANENT full-time operational cost (upgrades, CNI, etcd, RBAC, CVEs) — budget it explicitly, and decide whether the workload + team get more than that back. THE MODULE IN ONE LINE: run many workloads safely on shared infra — autoscale on the right signal, schedule with intent, treat persistent data as precious, cap every blast radius with RBAC + quotas — and know when a VM + a PaaS serves the same need for far less.',
    ],
    keyTakeawaysHi: [
      'RAW YAML dev/staging/prod tak scale nahi karta. HELM = ek CHART (`templates/*.yaml` Go-templated + `values.yaml` + `Chart.yaml`); `helm install/upgrade/rollback` merged values ke against render karta hai, apply karta hai, ek VERSIONED RELEASE record karta hai; `helm template` locally render karta hai. Strengths: versioned, packageable, repos mein published, dependency mgmt, real rollback. Weakness: YAML par ek TEXT templater → whitespace fragility + `{{ }}` logic soup.',
      'KUSTOMIZE = ek BASE (ordinary, VALID manifests) + per-env OVERLAYS jo base ko reference karte hain aur patches + built-in transformers declare karte hain (`images`, `replicas`, `configMapGenerator` — hash-suffixed). kubectl mein built-in. Strength: base hamesha ek readable valid manifest, har overlay ek explicit diff, KOI nai language nahi. Weakness: koi packaging/versioning nahi.',
      'CHOOSING: HELM third-party software ke liye aur apni apps ke liye jinhe packaging/distribution/rollback chahiye; KUSTOMIZE apni apps ke liye apne environments ke across. Wo COMPOSE karte hain; Argo CD aur Flux dono natively support karte hain. KOI bhi ek secrets manager NAHI hai — secret VALUES ko git se bahar rakho: External Secrets Operator / Vault / ek CSI driver dwara populate ek existing Secret reference karo, ya SOPS/sealed-secrets.',
      'ABHI KUBERNETES ADOPT MAT KARO agar: 1-3 services + ek team + traffic jo 2-3 VMs par fit hota hai; koi team member nahi jiska job ek cluster operate karna hai; ya speculative "hum kabhi scale kar sakte hain" adoption. USE INSTEAD: ek VM docker compose ke saath, YA ek PaaS (Render / Fly.io / Cloud Run / App Runner / ECS Fargate). App ko 12-factor rakho taaki baad mein K8s par move kuch din hai.',
      'KUBERNETES APNI COST EARN KARTA HAI jab: kai services/teams ko self-service chahiye; REAL scale par bin-packing meaningful paisa bachaता hai; aapko specifically ecosystem chahiye; ya org already standardised hai. Platform ka ek PERMANENT full-time operational cost hai — ise explicitly budget karo. MODULE EK LINE MEIN: shared infra par kai workloads safely chalao — sahi signal par autoscale, intent ke saath schedule, persistent data ko precious treat karo, har blast radius ko RBAC + quotas se cap karo — aur jaano kab ek VM + ek PaaS same need ko kaafi kam mein serve karta hai.',
    ],
  },
];
