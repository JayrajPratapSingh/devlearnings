/**
 * DevOps Complete Course — Module 8: Kubernetes — Deployments, Services, Ingress
 * & Config, lessons 4-6.
 *
 * Lesson 4: ConfigMaps & Secrets — env vars vs volume mounts, live updates,
 *           Secrets are only base64, immutable config. VERIFIED against a real cluster (kind).
 * Lesson 5: Probes — liveness / readiness / startup, what each one gates, the
 *           slow-starter trap. VERIFIED.
 * Lesson 6: requests vs limits, QoS classes, OOMKill vs CPU throttling, the
 *           12-factor mapping. VERIFIED.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_8_PART2: CourseLesson[] = [
  {
    slug: 'ops-configmaps-and-secrets',
    title: 'ConfigMaps & Secrets — Externalising Configuration',
    titleHi: 'ConfigMaps & Secrets — Configuration Bahar Nikalna',
    description: 'The same container image must run in dev, staging and prod without a rebuild. A ConfigMap holds non-secret configuration, a Secret holds credentials, and both are injected into a Pod either as environment variables or as files in a mounted volume — each with different update behaviour and different risks.',
    descriptionHi: 'Wahi container image dev, staging aur prod mein bina rebuild ke chalni chahiye. Ek ConfigMap non-secret configuration rakhta hai, ek Secret credentials rakhta hai, aur dono ek Pod mein ya to environment variables ke roop mein ya ek mounted volume mein files ke roop mein inject hote hain — har ek alag update behaviour aur alag risks ke saath.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A stage play\'s script versus the sealed envelopes handed to the leads.** The script (the ConfigMap) is the same printed booklet for every performance — the blocking, the cues, the set list — and any crew member can read it off the table. The sealed envelopes (Secrets) contain the things only certain actors should see, and the theatre pretends they are protected — but the "seal" is a paper flap anyone backstage can lift (base64, not a lock). Both can be handed over two ways: read aloud once at the door as the actor walks in (environment variables — fixed for that entrance, only a fresh entrance picks up a changed line) or left in the dressing room to be re-read whenever (a mounted volume — the crew swaps the pages and the actor sees the new version on their next glance).',
      hi: '**Ek stage play ka script versus leads ko diye gaye sealed envelopes.** Script (ConfigMap) har performance ke liye wahi printed booklet hai — blocking, cues, set list — aur koi bhi crew member ise table se padh sakta hai. Sealed envelopes (Secrets) mein wo cheezein hain jo sirf kuch actors ko dekhni chahiye, aur theatre dikhaava karta hai ki wo protected hain — par "seal" ek paper flap hai jise backstage koi bhi utha sakta hai (base64, ek lock nahi). Dono do tarike se diye ja sakte hain: door par ek baar padha gaya jaise actor andar aata hai (environment variables — us entrance ke liye fixed, sirf ek fresh entrance badli hui line uthata hai) ya dressing room mein chhoda gaya jab bhi dobara padha jaaye (ek mounted volume — crew pages swap karta hai aur actor apni next glance par naya version dekhta hai).',
    },

    simple: `**CONFIGMAP = non-secret config. SECRET = credentials. Both inject into a Pod as ENV or FILES.**
\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata: { name: app-config }
data:
  LOG_LEVEL: "info"                       # simple key -> value
  app.properties: |                        # or a whole file
    greeting=hello
    retries=3
---
apiVersion: v1
kind: Secret
metadata: { name: db-cred }
type: Opaque
data:                                       # values are base64 (NOT encrypted)
  username: YXBw                            # 'app'
  password: czNjcjN0               # echo -n 's3cr3t' | base64
# stringData: { password: s3cr3t }          # <- write plaintext, kubectl encodes it
\`\`\`

**TWO WAYS TO CONSUME (in the Pod spec):**
\`\`\`yaml
containers:
  - name: app
    envFrom:
      - configMapRef: { name: app-config }        # every key -> an env var
    env:
      - name: DB_PASSWORD
        valueFrom:
          secretKeyRef: { name: db-cred, key: password }   # one key -> one env var
    volumeMounts:
      - { name: cfg, mountPath: /etc/app }         # every key -> a file /etc/app/<key>
volumes:
  - name: cfg
    configMap: { name: app-config }
  # - name: sec
  #   secret: { secretName: db-cred }
\`\`\`

**ENV vs VOLUME — the update behaviour differs:**
\`\`\`
ENV VAR         captured ONCE at container start. change the ConfigMap -> env is STALE
                until the Pod is recreated (a rollout). visible in 'kubectl describe pod',
                in crash dumps, leaked to child processes & 'printenv'.
MOUNTED FILE    the kubelet re-syncs the volume (~up to 60s). the app sees the new file
                on its next read IF it re-reads (many apps need SIGHUP / a watch).
                subPath mounts do NOT get updates. safer for secrets (not in env).
\`\`\`

**SECRETS ARE NOT ENCRYPTED AT REST BY DEFAULT** — they are base64 in etcd. Real protection:
\`\`\`
- enable EncryptionConfiguration (KMS) on the API server  -> encrypted in etcd
- RBAC: 'get secrets' in a namespace = read EVERY credential there. lock it down.
- mount as files, not env (env leaks). set 'automountServiceAccountToken: false' if unused.
- external stores: External Secrets Operator / Vault Agent / cloud CSI driver
- 'immutable: true' on a ConfigMap/Secret -> no accidental edits, less apiserver load
\`\`\``,

    simpleHi: `**CONFIGMAP = non-secret config. SECRET = credentials. Dono ek Pod mein ENV ya FILES ke roop mein inject hote hain.**
\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata: { name: app-config }
data:
  LOG_LEVEL: "info"
  app.properties: |
    greeting=hello
    retries=3
---
apiVersion: v1
kind: Secret
metadata: { name: db-cred }
type: Opaque
data:                                       # values base64 hain (encrypted NAHI)
  username: YXBw
  password: czNjcjN0
# stringData: { password: s3cr3t }          # <- plaintext likho, kubectl encode karta hai
\`\`\`

**CONSUME KARNE KE DO TARIKE (Pod spec mein):**
\`\`\`yaml
containers:
  - name: app
    envFrom:
      - configMapRef: { name: app-config }        # har key -> ek env var
    env:
      - name: DB_PASSWORD
        valueFrom:
          secretKeyRef: { name: db-cred, key: password }
    volumeMounts:
      - { name: cfg, mountPath: /etc/app }         # har key -> ek file /etc/app/<key>
volumes:
  - name: cfg
    configMap: { name: app-config }
\`\`\`

**ENV vs VOLUME — update behaviour alag hai:**
\`\`\`
ENV VAR         container start par EK BAAR captured. ConfigMap badlo -> env STALE hai
                jab tak Pod recreate na ho (ek rollout). 'kubectl describe pod' mein,
                crash dumps mein, child processes & 'printenv' mein leaked.
MOUNTED FILE    kubelet volume ko re-sync karta hai (~60s tak). app naya file apni
                next read par dekhta hai AGAR wo re-read kare (kai apps ko SIGHUP chahiye).
                subPath mounts ko updates NAHI milte. secrets ke liye safer (env mein nahi).
\`\`\`

**SECRETS DEFAULT SE AT REST ENCRYPTED NAHI HAIN** — wo etcd mein base64 hain. Real protection:
\`\`\`
- API server par EncryptionConfiguration (KMS) enable karo -> etcd mein encrypted
- RBAC: ek namespace mein 'get secrets' = wahan HAR credential padho. Ise lock karo.
- files ke roop mein mount karo, env nahi. 'automountServiceAccountToken: false' agar unused.
- external stores: External Secrets Operator / Vault Agent / cloud CSI driver
- ConfigMap/Secret par 'immutable: true' -> koi accidental edits nahi, kam apiserver load
\`\`\``,

    content: `## Why externalise config at all

The 12-factor rule is that config — anything that varies between deploys — lives in the environment, not in the image. One image, promoted unchanged from dev to prod, with the database URL, log level, feature flags and credentials supplied at run time. Kubernetes provides two objects for this: **ConfigMap** for non-secret values and **Secret** for credentials.

## ConfigMap

A ConfigMap is a namespaced key-value object. Values can be short strings (\`LOG_LEVEL: info\`) or entire file bodies (\`nginx.conf: |\` followed by the file). It has a 1 MiB size limit — it is for configuration, not data.

## Secret

A Secret has the same shape, with two differences: values under \`data\` are **base64-encoded**, and the object has a \`type\` (\`Opaque\` for arbitrary data, \`kubernetes.io/tls\` for a cert+key, \`kubernetes.io/dockerconfigjson\` for a registry pull secret, and others that make the kubelet validate the keys). You can write plaintext under \`stringData\` and the API server encodes it for you.

**base64 is not encryption.** Anyone who can read the Secret object — through \`kubectl get secret -o yaml\`, or with the RBAC verb \`get\` on \`secrets\` in that namespace — gets the credentials by piping through \`base64 -d\`. By default Secrets are stored in etcd only base64-encoded, so anyone with etcd access or an etcd backup has them too. Turning on an \`EncryptionConfiguration\` (ideally backed by a KMS) makes the API server encrypt Secret values before writing them to etcd.

## Two ways to inject into a Pod

### As environment variables

\`env\` with a \`valueFrom.configMapKeyRef\` / \`secretKeyRef\` pulls one key into one variable; \`envFrom\` pulls every key in the object into a variable of the same name. Environment variables are **read once, when the container starts**. If you edit the ConfigMap afterwards, the running container keeps the old value until the Pod is recreated — which for a Deployment means a rollout. Environment variables also leak easily: they appear in \`kubectl describe pod\`, in a process's \`/proc/<pid>/environ\`, in crash reporters, and are inherited by every child process. This makes env a poor choice for secrets specifically.

### As files in a mounted volume

A \`configMap\` or \`secret\` volume projects each key as a file under the mount path. The kubelet **keeps the mounted files in sync** with the object — after you edit the ConfigMap, the files update within about a minute (it is eventually consistent, not instant). The application still has to notice: many read config only at startup and need a SIGHUP or a file watch to pick up the change; some frameworks watch automatically. Two caveats: a volume mounted with \`subPath\` (to drop a single file into a directory that has other files) does **not** receive updates, and a Secret mounted as a volume is stored in \`tmpfs\` (memory), which is a bit safer than env.

## Immutable ConfigMaps and Secrets

Setting \`immutable: true\` means the \`data\` can never be changed — only the whole object deleted and recreated. This prevents a fat-fingered edit from rolling out to every consumer at once, and it lets the kubelet stop watching the object, which noticeably reduces API-server load in clusters with thousands of them. The trade-off is that a "change" is now delete + recreate + (usually) a Deployment rollout, which is arguably the correct, auditable workflow anyway.

## Beyond the built-ins

Real secret management usually adds: the **External Secrets Operator** or **Vault Agent Injector** to sync secrets from Vault / AWS Secrets Manager / GCP Secret Manager into Kubernetes Secrets or straight into Pods; a **CSI Secrets Store** driver to mount them as volumes without ever creating a Secret object; and **sealed-secrets** or **SOPS** to keep encrypted secrets safely in Git. The Kubernetes Secret is often just the last-mile delivery mechanism.`,

    contentHi: `## Config bahar kyun nikaalein

12-factor rule ye hai ki config — kuch bhi jo deploys ke beech vary karta hai — environment mein rehta hai, image mein nahi. Ek image, dev se prod tak unchanged promoted, database URL, log level, feature flags aur credentials run time par supplied. Kubernetes iske liye do objects deta hai: non-secret values ke liye **ConfigMap** aur credentials ke liye **Secret**.

## ConfigMap

Ek ConfigMap ek namespaced key-value object hai. Values short strings (\`LOG_LEVEL: info\`) ya poore file bodies (\`nginx.conf: |\`) ho sakti hain. Iska 1 MiB size limit hai — ye configuration ke liye hai, data ke liye nahi.

## Secret

Ek Secret ka same shape hai, do differences ke saath: \`data\` ke neeche values **base64-encoded** hain, aur object ka ek \`type\` hai (\`Opaque\`, \`kubernetes.io/tls\`, \`kubernetes.io/dockerconfigjson\`, aur others). Aap \`stringData\` ke neeche plaintext likh sakte ho aur API server ise aapke liye encode karta hai.

**base64 encryption nahi hai.** Koi bhi jo Secret object padh sakta hai — \`kubectl get secret -o yaml\` ke through, ya us namespace mein \`secrets\` par RBAC verb \`get\` ke saath — \`base64 -d\` ke through pipe karke credentials paata hai. Default se Secrets etcd mein sirf base64-encoded stored hain. Ek \`EncryptionConfiguration\` on karna API server ko Secret values encrypt karvaata hai ise etcd mein likhne se pehle.

## Ek Pod mein inject karne ke do tarike

### Environment variables ke roop mein

\`env\` with \`valueFrom.configMapKeyRef\` / \`secretKeyRef\` ek key ko ek variable mein pull karta hai; \`envFrom\` object mein har key ko pull karta hai. Environment variables **ek baar padhe jaate hain, jab container start hota hai**. Agar aap baad mein ConfigMap edit karte ho, running container purani value rakhta hai jab tak Pod recreate na ho. Environment variables aasani se leak bhi hote hain: wo \`kubectl describe pod\` mein, ek process ke \`/proc/<pid>/environ\` mein, crash reporters mein appear hote hain, aur har child process dwara inherited hote hain.

### Ek mounted volume mein files ke roop mein

Ek \`configMap\` ya \`secret\` volume har key ko mount path ke neeche ek file ke roop mein project karta hai. Kubelet **mounted files ko sync mein rakhta hai** object ke saath — aap ConfigMap edit karne ke baad, files ek minute ke andar update hoti hain (ye eventually consistent hai, instant nahi). Application ko phir bhi notice karna hota hai: kai sirf startup par config padhte hain aur change uthane ke liye ek SIGHUP ya file watch chahiye. Do caveats: \`subPath\` se mounted ek volume ko updates NAHI milte, aur ek Secret jo ek volume ke roop mein mounted hai \`tmpfs\` (memory) mein stored hai.

## Immutable ConfigMaps aur Secrets

\`immutable: true\` set karne ka matlab hai \`data\` kabhi change nahi ho sakta — sirf poora object delete aur recreate. Ye ek fat-fingered edit ko ek saath har consumer par roll out hone se rokta hai, aur ye kubelet ko object watch karna band karne deta hai, jo API-server load noticeably kam karta hai.

## Built-ins ke aage

Real secret management usually add karta hai: **External Secrets Operator** ya **Vault Agent Injector** secrets ko Vault / AWS Secrets Manager se sync karne ke liye; ek **CSI Secrets Store** driver unhe volumes ke roop mein mount karne ke liye; aur **sealed-secrets** ya **SOPS** encrypted secrets ko Git mein safely rakhne ke liye. Kubernetes Secret often bas last-mile delivery mechanism hai.`,

    examples: [
      {
        title: 'A mounted ConfigMap tracks live edits; an env var from the same ConfigMap does not',
        titleHi: 'Ek mounted ConfigMap live edits track karta hai; usi ConfigMap se ek env var nahi',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m8l4-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

mkcm() {  # apply cleanly so the apply-annotation is kept for the next apply
  kubectl -n "$ns" create configmap app-config \\
    --from-literal=LOG_LEVEL="$1" \\
    --from-literal=GREETING="$2" \\
    --dry-run=client -o yaml | kubectl -n "$ns" apply -f - >/dev/null
}
mkcm info hello

cat <<YAML | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Pod
metadata: { name: demo }
spec:
  containers:
    - name: c
      image: busybox:1.36
      command: [ "sh", "-c", "sleep 3600" ]
      env:
        - name: LOG_LEVEL
          valueFrom: { configMapKeyRef: { name: app-config, key: LOG_LEVEL } }
      volumeMounts:
        - { name: cfg, mountPath: /etc/app }
  volumes:
    - name: cfg
      configMap: { name: app-config }
YAML
kubectl -n "$ns" wait --for=condition=Ready pod/demo --timeout=90s >/dev/null

echo "start: env LOG_LEVEL=[$(kubectl -n "$ns" exec demo -- printenv LOG_LEVEL)]  file GREETING=[$(kubectl -n "$ns" exec demo -- cat /etc/app/GREETING)]"

mkcm debug hi                                   # <-- change BOTH keys
for i in $(seq 1 40); do
  [ "$(kubectl -n "$ns" exec demo -- cat /etc/app/GREETING 2>/dev/null)" = hi ] && break
  sleep 3
done
echo "after: env LOG_LEVEL=[$(kubectl -n "$ns" exec demo -- printenv LOG_LEVEL)]  file GREETING=[$(kubectl -n "$ns" exec demo -- cat /etc/app/GREETING)]"
echo
echo "the MOUNTED FILE followed the ConfigMap edit (the kubelet re-syncs the volume)."
echo "the ENV VAR did NOT - env is captured once at container start; you must recreate the Pod."`,
        output: `start: env LOG_LEVEL=[info]  file GREETING=[hello]
after: env LOG_LEVEL=[info]  file GREETING=[hi]

the MOUNTED FILE followed the ConfigMap edit (the kubelet re-syncs the volume).
the ENV VAR did NOT - env is captured once at container start; you must recreate the Pod.`,
        explain: 'One ConfigMap with two keys is consumed two ways by the same Pod: LOG_LEVEL is pulled into an environment variable, and the whole ConfigMap is projected as files under /etc/app. At start, both reflect the initial values. The ConfigMap is then rewritten with both keys changed. After waiting for the kubelet to re-sync — which is eventually consistent and takes up to about a minute, not instant — the mounted file shows the new value, because the kubelet keeps configMap and secret volumes in sync with the object. The environment variable still shows the old value, and will keep showing it for the entire life of the container, because environment variables are captured once at exec time and never revisited. This is the single most important operational fact about ConfigMaps: if your app reads config from env, a ConfigMap change is inert until you trigger a rollout; if it reads from a mounted file and re-reads on a signal or a watch, the change propagates on its own. A common pattern is to hash the ConfigMap contents into a Pod annotation so that any change forces a rollout automatically.',
        explainHi: 'Do keys wala ek ConfigMap usi Pod dwara do tarike se consume hota hai: LOG_LEVEL ek environment variable mein pull hota hai, aur poora ConfigMap /etc/app ke neeche files ke roop mein project hota hai. Start par, dono initial values reflect karte hain. ConfigMap phir dono keys badle hue ke saath rewrite hota hai. Kubelet ke re-sync ka wait karne ke baad — jo eventually consistent hai aur lagbhag ek minute tak leta hai — mounted file nayi value dikhaata hai. Environment variable abhi bhi purani value dikhaata hai, aur container ke poore life ke liye ise dikhaata rahega, kyunki environment variables exec time par ek baar captured hote hain. Ye ConfigMaps ke baare mein sabse important operational fact hai: agar aapki app env se config padhti hai, ek ConfigMap change inert hai jab tak aap ek rollout trigger na karein.',
      },
      {
        title: 'A Secret is base64, not encryption: anyone with "get secrets" reads it in cleartext',
        titleHi: 'Ek Secret base64 hai, encryption nahi: "get secrets" wala koi bhi ise cleartext mein padhta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m8l4b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

kubectl -n "$ns" create secret generic db-cred \\
  --from-literal=username=app \\
  --from-literal=password='s3cr3t-P@ss' >/dev/null

echo "--- a Secret stores values as base64: encoding, NOT encryption ---"
enc=$(kubectl -n "$ns" get secret db-cred -o jsonpath='{.data.password}')
echo "  .data.password (stored) : $enc"
echo "  base64 -d               : $(printf %s "$enc" | base64 -d)"
echo "  .type                   : $(kubectl -n "$ns" get secret db-cred -o jsonpath='{.type}')"

echo "--- anyone with RBAC 'get secrets' in the namespace reads it in cleartext ---"
u=$(kubectl -n "$ns" get secret db-cred -o jsonpath='{.data.username}' | base64 -d)
p=$(kubectl -n "$ns" get secret db-cred -o jsonpath='{.data.password}' | base64 -d)
echo "  username=$u  password=$p"

echo "--- immutable: true means data can no longer be edited (only delete + recreate) ---"
kubectl -n "$ns" patch secret db-cred -p '{"immutable":true}' >/dev/null
kubectl -n "$ns" patch secret db-cred -p '{"data":{"password":"bmV3cGFzcw=="}}' 2>&1 || true`,
        output: `--- a Secret stores values as base64: encoding, NOT encryption ---
  .data.password (stored) : czNjcjN0LVBAc3M=
  base64 -d               : s3cr3t-P@ss
  .type                   : Opaque
--- anyone with RBAC 'get secrets' in the namespace reads it in cleartext ---
  username=app  password=s3cr3t-P@ss
--- immutable: true means data can no longer be edited (only delete + recreate) ---
The Secret "db-cred" is invalid: data: Forbidden: field is immutable when \`immutable\` is set`,
        explain: 'The Secret is created with a username and password. Reading it back shows the password stored as the string czNjcjN0LVBAc3M=, which is not a hash or a ciphertext — it is just base64, and piping it through base64 -d returns the original s3cr3t-P@ss immediately. There is no key involved and nothing to crack. This means the security boundary for a Secret is entirely RBAC and etcd access: anyone allowed the get verb on secrets in this namespace can enumerate every credential in it in cleartext, and anyone with a copy of an etcd backup can do the same offline, unless the cluster has encryption-at-rest configured on the API server. The last step sets immutable: true and then attempts to change the password; the API server rejects the edit outright, because an immutable Secret\'s data can only be replaced by deleting and recreating the whole object. Immutability protects against accidental edits fanning out to every consumer and lets the kubelet stop watching the object, but it does nothing to make the stored value less readable.',
        explainHi: 'Secret ek username aur password ke saath create hota hai. Ise wapas padhna password ko string czNjcjN0LVBAc3M= ke roop mein stored dikhaata hai, jo ek hash ya ciphertext nahi hai — ye bas base64 hai, aur ise base64 -d ke through pipe karna original s3cr3t-P@ss turant return karta hai. Koi key involved nahi hai aur crack karne ke liye kuch nahi. Iska matlab hai ek Secret ke liye security boundary poori tarah RBAC aur etcd access hai: koi bhi jise is namespace mein secrets par get verb allowed hai usmein har credential cleartext mein enumerate kar sakta hai, jab tak cluster ke paas API server par encryption-at-rest configured na ho. Aakhiri step immutable: true set karta hai aur phir password change karne ki koshish karta hai; API server edit ko outright reject karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# edit a ConfigMap, expect running Pods to pick it up
$ kubectl edit configmap app-config      # change LOG_LEVEL: info -> debug
# ...nothing happens. the app still logs at info for days.
# because the app reads LOG_LEVEL from an ENV VAR, and env is frozen at container start.`,
        right: `# env-consumed config only changes on a POD RECREATE. force one on any config change:
#   1. mount the ConfigMap as a FILE and have the app watch/reload it (best), OR
#   2. put a hash of the config in the pod template so a change rolls the Deployment:
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ sha256sum of the ConfigMap }}   # Helm/Kustomize do this
#   3. or just 'kubectl rollout restart deploy/app' after editing the ConfigMap.
# tools: Reloader (stakater) watches ConfigMaps/Secrets and rolls dependents automatically.`,
        why: 'A container receives its environment once, at the moment it is started, and that set of variables never changes for the life of the container. Editing the ConfigMap that a variable was sourced from updates the ConfigMap object but does not touch any process that already read it, so an application that takes its log level or any other setting from an environment variable will keep the old behaviour until its Pod is replaced. Making the change take effect therefore requires recreating the Pods. The cleanest approach is to mount the configuration as a file and have the application watch that file or reload on a signal, since the kubelet keeps mounted ConfigMap and Secret volumes synchronised with the object. Where env consumption cannot be avoided, the standard trick is to embed a checksum of the configuration into the Pod template so that any config change alters the template and triggers a rollout, which Helm and Kustomize can generate automatically; failing that, an explicit rollout restart after each edit achieves the same result, and controllers such as Reloader automate it.',
        whyHi: 'Ek container apna environment ek baar receive karta hai, us moment jab ye start hota hai, aur variables ka wo set container ke life ke liye kabhi nahi badalta. Us ConfigMap ko edit karna jisse ek variable sourced tha ConfigMap object ko update karta hai par kisi bhi process ko touch nahi karta jisne ise pehle hi padh liya. Change ko effect mein laane ke liye Pods ko recreate karna chahiye. Sabse cleanest approach configuration ko ek file ke roop mein mount karna aur application ko us file ko watch karna ya ek signal par reload karna hai. Jahan env consumption avoid nahi ki ja sakti, standard trick configuration ka ek checksum Pod template mein embed karna hai taaki koi bhi config change template ko badle aur ek rollout trigger kare.',
      },
      {
        wrong: `# treat a Secret as if base64 were a security control
$ kubectl get secret db-cred -o yaml | grep -A2 'data:'
  data:
    password: czNjcjN0LVBAc3M=
# "it's encoded, that's fine to paste in the ticket / commit to git / share in slack"
# -> it is one 'base64 -d' away from plaintext. and it's unencrypted in etcd by default.`,
        right: `# base64 == cleartext. protect Secrets with the real controls:
#   - RBAC: minimise who has get/list on 'secrets' (per-namespace). audit it.
#   - encryption at rest: API-server EncryptionConfiguration, ideally KMS-backed
#   - don't put Secret YAML in git — use sealed-secrets / SOPS / External Secrets Operator
#   - mount as files (tmpfs), not env vars (env leaks to describe/childprocs/crashdumps)
#   - rotate; set 'automountServiceAccountToken: false' where the SA token isn't needed
#   - consider a CSI Secrets Store driver so no Secret object ever exists`,
        why: 'The values in a Secret\'s data field are base64-encoded, which is a reversible transport encoding with no key and no secrecy property. Decoding is a single command available on every system, so a base64 string in a ticket, a commit, or a chat message is equivalent to posting the plaintext. By default the API server also writes Secret values to etcd with only this encoding, so read access to etcd or to an etcd backup exposes them. Protecting Secrets means applying controls that actually restrict access: tight RBAC on the get and list verbs for secrets, scoped per namespace and audited, because that permission reveals every credential in the namespace; encryption at rest configured on the API server, preferably backed by a KMS; keeping Secret manifests out of version control by using sealed-secrets, SOPS, or an operator that syncs from an external vault; mounting secrets as files rather than environment variables to avoid the many ways env leaks; and rotating credentials and disabling unused service-account token mounts. A CSI Secrets Store driver can deliver secrets to Pods as mounted files without a Secret object existing at all.',
        whyHi: 'Ek Secret ke data field mein values base64-encoded hain, jo ek reversible transport encoding hai bina key aur bina secrecy property ke. Decoding ek single command hai jo har system par available hai, to ek ticket, ek commit, ya ek chat message mein ek base64 string plaintext post karne ke equivalent hai. Default se API server bhi Secret values ko etcd mein sirf is encoding ke saath likhta hai. Secrets ko protect karne ka matlab wo controls apply karna hai jo actually access restrict karte hain: secrets ke liye get aur list verbs par tight RBAC; API server par encryption at rest; Secret manifests ko version control se bahar rakhna; secrets ko environment variables ke bajaay files ke roop mein mount karna; aur credentials rotate karna.',
      },
      {
        wrong: `# mount a single config file with subPath and expect live updates
volumeMounts:
  - name: cfg
    mountPath: /app/config.yaml
    subPath: config.yaml          # drops just this file into /app, keeping the rest
# then 'kubectl edit configmap' ... and the file inside the container NEVER changes.`,
        right: `# subPath mounts are a POINT-IN-TIME COPY — no kubelet sync. options:
#   - mount the whole ConfigMap at a dedicated dir (no subPath): /etc/app/ -> live updates
//     and point the app at /etc/app/config.yaml
#   - if you must keep other files in the dir, use 'projected' volumes or an initContainer
//     that copies the file, and accept a rollout is needed to change it
#   - or embrace it: subPath + a Deployment rollout on every config change (explicit, safe)`,
        why: 'A volume mount with subPath resolves the referenced key at mount time and bind-mounts that single file into place. Unlike a full volume mount, it is not kept in sync by the kubelet, so subsequent edits to the ConfigMap or Secret are never reflected inside the container and the file remains frozen at the value it had when the Pod started. This is often used to place one configuration file into a directory that already contains other files, since a plain volume mount would hide those other files. The consequences are that live updates are lost. If live updates matter, mount the whole object at its own directory without subPath and have the application reference the file there. If other files must share the directory, use a projected volume or an init container that assembles the directory, and accept that changing the configuration requires a rollout. Alternatively, treat the rollout as the intended mechanism and pair subPath with a template checksum so every configuration change deploys a new Pod.',
        whyHi: 'subPath ke saath ek volume mount referenced key ko mount time par resolve karta hai aur us single file ko jagah par bind-mount karta hai. Ek full volume mount ke विपरीत, ise kubelet dwara sync mein nahi rakha jaata, to ConfigMap ya Secret ke baad ke edits kabhi container ke andar reflect nahi hote aur file us value par frozen rehti hai jo Pod start hone par thi. Ye often ek configuration file ko ek directory mein rakhne ke liye use hota hai jismein pehle se other files hain. Consequences ye hain ki live updates lost ho jaate hain. Agar live updates matter karte hain, poore object ko iski apni directory par bina subPath ke mount karo.',
      },
    ],

    realWorld: [
      {
        en: '**A three-day incident where a log-level change "didn\'t work"** — the app read `LOG_LEVEL` from env, the ConfigMap edit was inert, and nobody had triggered a rollout. Fixed permanently by switching to a mounted file plus Reloader to auto-restart on ConfigMap changes.',
        hi: '**Ek teen-din ka incident jahan ek log-level change "kaam nahi kiya"** — app ne `LOG_LEVEL` env se padha, ConfigMap edit inert tha, aur kisi ne rollout trigger nahi kiya tha. Ek mounted file plus Reloader par switch karke permanently fix kiya.',
      },
      {
        en: '**A Secret pasted into a Jira ticket** "because it\'s base64". A security review flagged it; the credential was rotated, RBAC on `secrets` was tightened per-namespace, and encryption-at-rest (KMS) was enabled on the API server.',
        hi: '**Ek Secret jo ek Jira ticket mein paste kiya gaya** "kyunki wo base64 hai". Ek security review ne ise flag kiya; credential rotate kiya gaya, `secrets` par RBAC per-namespace tighten kiya gaya, aur API server par encryption-at-rest (KMS) enable kiya gaya.',
      },
      {
        en: '**A config file that "wouldn\'t update"** for one service while every other service picked up changes fine — it was the only one using a `subPath` mount. Switched to a full-directory mount and the kubelet sync started working.',
        hi: '**Ek config file jo ek service ke liye "update nahi hoti thi"** jabki har doosri service changes theek uthati thi — ye ekmatra thi jo ek `subPath` mount use kar rahi thi. Ek full-directory mount par switch kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between consuming a ConfigMap as environment variables versus as a mounted volume?',
        qHi: 'Ek ConfigMap ko environment variables ke roop mein versus ek mounted volume ke roop mein consume karne mein kya farak hai?',
        a: 'As environment variables, each key is read into the container\'s environment exactly once, at the moment the container starts, using env with a configMapKeyRef for a single key or envFrom for all of them. That set is then frozen for the life of the container: editing the ConfigMap afterwards has no effect on the running process, so the change only takes hold when the Pod is recreated, which for a Deployment means a rollout. Environment variables also leak readily — they show up in kubectl describe pod, in the process environ, in crash reporters, and are inherited by child processes. As a mounted volume, a configMap volume projects each key as a file under the mount path, and the kubelet keeps those files synchronised with the ConfigMap object, so after an edit the files update within about a minute; it is eventually consistent rather than instant. The application still has to re-read the file, on a watch or a signal, to actually use the new value. Files are also the better choice for Secrets because a Secret volume is backed by tmpfs and avoids the env-leak paths. The practical rule is that env-consumed config needs a deliberate rollout on every change, whereas file-consumed config can propagate on its own if the app reloads.',
        aHi: 'Environment variables ke roop mein, har key container ke environment mein theek ek baar padha jaata hai, us moment jab container start hota hai. Wo set phir container ke life ke liye frozen hai: ConfigMap ko baad mein edit karna running process par koi effect nahi karta, to change sirf tab hold karta hai jab Pod recreate hota hai, jo ek Deployment ke liye ek rollout ka matlab hai. Environment variables aasani se leak bhi hote hain. Ek mounted volume ke roop mein, ek configMap volume har key ko mount path ke neeche ek file ke roop mein project karta hai, aur kubelet un files ko ConfigMap object ke saath synchronised rakhta hai, to ek edit ke baad files lagbhag ek minute ke andar update hoti hain. Application ko phir bhi file ko re-read karna hota hai. Practical rule ye hai ki env-consumed config ko har change par ek deliberate rollout chahiye.',
      },
      {
        q: 'Is a Kubernetes Secret encrypted? How should secrets actually be protected?',
        qHi: 'Kya ek Kubernetes Secret encrypted hai? Secrets ko actually kaise protect kiya jaana chahiye?',
        a: 'By default, no. The values in a Secret are base64-encoded, which is a reversible encoding with no key, so decoding is a single base64 -d command and a base64 string is equivalent to plaintext. And by default the API server stores Secret values in etcd with only that encoding, so etcd access or an etcd backup exposes them. Real protection is layered. First, RBAC: the get and list verbs on secrets should be granted to as few subjects as possible and scoped per namespace, because that permission exposes every credential in the namespace, and access should be audited. Second, encryption at rest: configure an EncryptionConfiguration on the API server, ideally backed by a KMS, so Secret values are encrypted before being written to etcd. Third, keep Secret manifests out of Git — use sealed-secrets, SOPS, or the External Secrets Operator syncing from Vault or a cloud secret manager. Fourth, mount secrets as files rather than environment variables, since env leaks through describe, child processes, and crash dumps, and a Secret volume lives in tmpfs. Finally, rotate credentials, set automountServiceAccountToken to false where the token is not needed, and consider a CSI Secrets Store driver so that secrets reach Pods as mounted files without a Secret object existing at all.',
        aHi: 'Default se, nahi. Ek Secret mein values base64-encoded hain, jo ek reversible encoding hai bina key ke, to decoding ek single base64 -d command hai. Aur default se API server Secret values ko etcd mein sirf us encoding ke saath store karta hai. Real protection layered hai. Pehla, RBAC: secrets par get aur list verbs jitne kam subjects ko possible ho grant kiye jaane chahiye aur per namespace scoped. Doosra, encryption at rest: API server par ek EncryptionConfiguration configure karo, ideally ek KMS dwara backed. Teesra, Secret manifests ko Git se bahar rakho — sealed-secrets, SOPS, ya External Secrets Operator use karo. Chautha, secrets ko environment variables ke bajaay files ke roop mein mount karo. Aakhir mein, credentials rotate karo.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, contrast env-var and mounted-volume consumption of a ConfigMap, focusing on update behaviour and on why env is a poor choice for secrets.',
        taskHi: 'Ek comment mein, ek ConfigMap ke env-var aur mounted-volume consumption ka contrast karo.',
        hint: 'ENV VAR (`env` + `valueFrom.configMapKeyRef` for one key, `envFrom` for all): the value is read into the container environment ONCE, at container start, then FROZEN for the container\'s life. Editing the ConfigMap does NOTHING to the running process → the change only lands on a POD RECREATE (a Deployment rollout). Env also LEAKS: visible in `kubectl describe pod`, in `/proc/<pid>/environ`, in crash reporters, inherited by every child process → bad for secrets specifically. MOUNTED VOLUME (`configMap`/`secret` volume → each key becomes a file `<mountPath>/<key>`): the kubelet KEEPS THE FILES IN SYNC with the object — after an edit the files update within ~60s (eventually consistent, not instant). The app must still RE-READ (a file watch or SIGHUP); some frameworks auto-watch. A `subPath` mount is a point-in-time COPY → NO sync. A Secret volume is `tmpfs` (memory) → a bit safer. RULE: env-consumed config needs a deliberate rollout on every change; file-consumed config can propagate on its own if the app reloads. Common trick: hash the ConfigMap into a pod-template annotation so any change forces a rollout (Helm/Kustomize/Reloader).',
        hintHi: 'ENV VAR (`env` + `valueFrom.configMapKeyRef` ek key ke liye, `envFrom` sab ke liye): value container environment mein EK BAAR padha jaata hai, container start par, phir container ke life ke liye FROZEN. ConfigMap edit karna running process ko KUCH NAHI karta → change sirf POD RECREATE par land karta hai. Env LEAK bhi karta hai: `kubectl describe pod` mein visible, child processes dwara inherited → secrets ke liye bura. MOUNTED VOLUME (`configMap`/`secret` volume → har key ek file `<mountPath>/<key>` banti hai): kubelet FILES KO SYNC MEIN RAKHTA hai — ek edit ke baad files ~60s ke andar update hoti hain. App ko phir bhi RE-READ karna hota hai. Ek `subPath` mount ek point-in-time COPY hai → KOI sync nahi. RULE: env-consumed config ko har change par ek deliberate rollout chahiye.',
      },
      {
        task: 'In a comment, explain why "it\'s base64" is not a security property for Secrets, and list the real controls (RBAC, encryption at rest, git hygiene, mount-as-file, rotation).',
        taskHi: 'Ek comment mein, samjhao ki "wo base64 hai" Secrets ke liye ek security property kyun nahi hai.',
        hint: 'A Secret\'s `data` values are BASE64 — a reversible transport encoding with NO key and NO secrecy property. `base64 -d` is one command on every machine, so a base64 string in a ticket/commit/Slack message == posting the plaintext. By DEFAULT the API server also writes Secret values to etcd with only base64 → etcd access or an etcd BACKUP exposes them. REAL CONTROLS: (1) RBAC — minimise who has `get`/`list` on `secrets`, scoped PER NAMESPACE, and audit it (that verb exposes EVERY credential in the namespace); (2) ENCRYPTION AT REST — an API-server `EncryptionConfiguration`, ideally KMS-backed, so values are encrypted before hitting etcd; (3) GIT HYGIENE — never commit Secret YAML; use sealed-secrets / SOPS / External Secrets Operator (syncs from Vault / cloud secret manager); (4) MOUNT AS FILES not env (env leaks via describe / child procs / crash dumps; a Secret volume is tmpfs); (5) ROTATE credentials; set `automountServiceAccountToken: false` where unused; consider a CSI Secrets Store driver so NO Secret object ever exists. `immutable: true` prevents accidental edits + cuts apiserver load but does NOTHING for readability.',
        hintHi: 'Ek Secret ke `data` values BASE64 hain — ek reversible transport encoding bina key ke aur bina secrecy property ke. `base64 -d` har machine par ek command hai. DEFAULT se API server Secret values ko etcd mein sirf base64 ke saath likhta hai → etcd BACKUP unhe expose karta hai. REAL CONTROLS: (1) RBAC — `get`/`list` on `secrets` minimise karo, PER NAMESPACE scoped; (2) ENCRYPTION AT REST — ek API-server `EncryptionConfiguration`, ideally KMS-backed; (3) GIT HYGIENE — kabhi Secret YAML commit mat karo; sealed-secrets / SOPS / External Secrets Operator use karo; (4) FILES ke roop mein MOUNT karo, env nahi; (5) credentials ROTATE karo. `immutable: true` accidental edits rokta hai par readability ke liye KUCH NAHI karta.',
      },
      {
        task: 'In a comment, explain the subPath mount gotcha: what subPath is for, why it breaks live updates, and three ways to handle it.',
        taskHi: 'Ek comment mein, subPath mount gotcha samjhao.',
        hint: 'A `volumeMounts` entry with `subPath` resolves the referenced key AT MOUNT TIME and bind-mounts that ONE file into place — used to drop a single config file into a directory that already has other files (a plain volume mount at that dir would HIDE the others). THE GOTCHA: unlike a full volume mount, a subPath mount is NOT kept in sync by the kubelet — it is a POINT-IN-TIME COPY, frozen at the value the key had when the Pod started. Editing the ConfigMap/Secret afterwards is NEVER reflected inside the container. THREE WAYS TO HANDLE: (1) mount the WHOLE object at its own dedicated directory with NO subPath (e.g. `/etc/app/`) → live updates work; point the app at `/etc/app/config.yaml`; (2) if other files must share the dir, use a `projected` volume or an initContainer that assembles the directory, and accept a rollout is needed to change config; (3) embrace it — subPath + a Deployment rollout (e.g. `kubectl rollout restart` or a template checksum) on every config change: explicit and safe.',
        hintHi: 'Ek `volumeMounts` entry with `subPath` referenced key ko MOUNT TIME par resolve karta hai aur us EK file ko jagah par bind-mount karta hai — ek single config file ko ek directory mein rakhne ke liye jismein pehle se other files hain. THE GOTCHA: ek full volume mount ke विपरीत, ek subPath mount kubelet dwara sync mein NAHI rakha jaata — ye ek POINT-IN-TIME COPY hai, frozen. ConfigMap/Secret ko baad mein edit karna KABHI container ke andar reflect nahi hota. TEEN TARIKE: (1) POORE object ko iski apni dedicated directory par BINA subPath ke mount karo → live updates kaam karte hain; (2) agar other files ko dir share karni hai, ek `projected` volume ya ek initContainer use karo; (3) ise embrace karo — subPath + har config change par ek Deployment rollout.',
      },
    ],

    keyTakeaways: [
      'The 12-factor rule: config (anything that varies between deploys) lives in the ENVIRONMENT, not the image — one image promoted unchanged dev→prod. CONFIGMAP = non-secret key→value (short strings or whole file bodies, 1 MiB cap). SECRET = same shape, but `data` values are BASE64, the object has a `type` (`Opaque` / `kubernetes.io/tls` / `kubernetes.io/dockerconfigjson` / ...), and you can write plaintext under `stringData` for the API server to encode.',
      'TWO WAYS TO CONSUME in the Pod spec: (1) ENV — `env` + `valueFrom.configMapKeyRef`/`secretKeyRef` (one key) or `envFrom` (all keys). Read ONCE at container start, then FROZEN — a ConfigMap edit is inert until a POD RECREATE (Deployment rollout). Env LEAKS (describe pod, `/proc/<pid>/environ`, crash reporters, child processes) → bad for secrets. (2) VOLUME — a `configMap`/`secret` volume projects each key as a file `<mountPath>/<key>`; the kubelet KEEPS IT IN SYNC (eventually consistent, ~up to 60s), the app must re-read on a watch/SIGHUP. `subPath` mounts are a point-in-time COPY → NO sync. Secret volumes are `tmpfs`.',
      'SECRETS ARE NOT ENCRYPTED AT REST BY DEFAULT — base64 in etcd. `base64 -d` is one command; a base64 string in a ticket/commit/chat == plaintext. Anyone with RBAC `get`/`list` on `secrets` in a namespace reads EVERY credential there; an etcd backup does too. REAL PROTECTION: tight per-namespace RBAC (audited) + API-server `EncryptionConfiguration` (KMS-backed) + keep manifests out of git (sealed-secrets / SOPS / External Secrets Operator) + mount as files not env + rotate + `automountServiceAccountToken: false` when unused + optionally a CSI Secrets Store driver (no Secret object at all).',
      'MAKING AN ENV-CONSUMED CONFIG CHANGE ACTUALLY APPLY: mount as a file + app watch/reload (best); OR hash the config into the pod-template (`checksum/config` annotation — Helm/Kustomize generate this) so any change rolls the Deployment; OR `kubectl rollout restart deploy/<name>` after the edit; OR run Reloader (stakater) which watches ConfigMaps/Secrets and rolls dependents automatically.',
      '`immutable: true` on a ConfigMap/Secret → `data` can never be edited (only delete + recreate), which prevents a fat-fingered change fanning out to every consumer at once AND lets the kubelet stop watching the object (big apiserver-load reduction at scale) — but does NOTHING to make the stored value less readable. Beyond the built-ins: External Secrets Operator / Vault Agent Injector (sync from an external vault), CSI Secrets Store (mount without a Secret object), sealed-secrets / SOPS (encrypted secrets safely in Git). The K8s Secret is often just the last-mile delivery mechanism.',
    ],
    keyTakeawaysHi: [
      '12-factor rule: config (kuch bhi jo deploys ke beech vary karta hai) ENVIRONMENT mein rehta hai, image mein nahi. CONFIGMAP = non-secret key→value (1 MiB cap). SECRET = same shape, par `data` values BASE64 hain, object ka ek `type` hai, aur aap `stringData` ke neeche plaintext likh sakte ho.',
      'CONSUME KARNE KE DO TARIKE: (1) ENV — `env` + `valueFrom` (ek key) ya `envFrom` (sab keys). Container start par EK BAAR padha, phir FROZEN — ek ConfigMap edit POD RECREATE tak inert hai. Env LEAK karta hai → secrets ke liye bura. (2) VOLUME — ek `configMap`/`secret` volume har key ko ek file ke roop mein project karta hai; kubelet ISE SYNC MEIN RAKHTA hai (~60s tak), app ko watch/SIGHUP par re-read karna hota hai. `subPath` mounts ek point-in-time COPY hain → KOI sync nahi.',
      'SECRETS DEFAULT SE AT REST ENCRYPTED NAHI HAIN — etcd mein base64. `base64 -d` ek command hai. Koi bhi jise ek namespace mein `secrets` par RBAC `get`/`list` hai wahan HAR credential padhta hai; ek etcd backup bhi. REAL PROTECTION: tight per-namespace RBAC + API-server `EncryptionConfiguration` (KMS-backed) + manifests ko git se bahar rakho + files ke roop mein mount karo env nahi + rotate karo + optionally ek CSI Secrets Store driver.',
      'EK ENV-CONSUMED CONFIG CHANGE KO ACTUALLY APPLY KARNA: ek file ke roop mein mount karo + app watch/reload (best); YA config ko pod-template mein hash karo (`checksum/config` annotation) taaki koi bhi change Deployment ko roll kare; YA edit ke baad `kubectl rollout restart deploy/<name>`; YA Reloader chalao.',
      '`immutable: true` ek ConfigMap/Secret par → `data` kabhi edit nahi ho sakta (sirf delete + recreate), jo ek fat-fingered change ko ek saath har consumer par fan out hone se rokta hai AUR kubelet ko object watch karna band karne deta hai — par stored value ko kam readable banane ke liye KUCH NAHI karta. Built-ins ke aage: External Secrets Operator / Vault Agent Injector, CSI Secrets Store, sealed-secrets / SOPS.',
    ],
  },

  {
    slug: 'ops-liveness-readiness-and-startup-probes',
    title: 'Probes — Liveness, Readiness & Startup',
    titleHi: 'Probes — Liveness, Readiness & Startup',
    description: 'The kubelet cannot tell whether the process inside a container is healthy, still starting, or wedged — it only knows the process is running. Probes are the checks you give it: readiness decides whether a Pod receives traffic, liveness decides whether a stuck container is restarted, and startup protects a slow boot from the other two.',
    descriptionHi: 'Kubelet nahi bata sakta ki ek container ke andar process healthy hai, abhi bhi start ho raha hai, ya atka hua hai — ye sirf jaanta hai ki process running hai. Probes wo checks hain jo aap ise dete ho: readiness decide karta hai ki ek Pod traffic receive kare, liveness decide karta hai ki ek stuck container restart ho, aur startup ek slow boot ko doosre do se bachaata hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A call-centre floor.** A running container is an agent who is clocked in — but that alone tells the supervisor nothing useful. The **readiness** check is "is this agent ready to take a call right now?" — if they are on a break or still logging into the system, the switchboard simply routes calls to other agents and stops sending them here, no drama, and resumes the moment they are back. The **liveness** check is "is this agent responsive at all, or have they fallen asleep at the desk?" — if they stop answering the supervisor entirely, the fix is to send them home and bring in a replacement (restart the container). The **startup** check is the induction period: a brand-new hire is not expected to take calls or pass the responsiveness check for the first hour, so those checks are suspended until onboarding is done — otherwise you would fire every new hire before lunch.',
      hi: '**Ek call-centre floor.** Ek running container ek agent hai jo clocked in hai — par wo akela supervisor ko kuch useful nahi batata. **Readiness** check ye hai "kya ye agent abhi ek call lene ke liye ready hai?" — agar wo break par hain ya abhi bhi system mein log in kar rahe hain, switchboard bas doosre agents ko calls route karta hai aur yahan bhejना band kar deta hai, koi drama nahi, aur jis moment wo wapas aate hain resume karta hai. **Liveness** check ye hai "kya ye agent bilkul responsive hai, ya wo desk par so gaye hain?" — agar wo supervisor ko poori tarah jawab dena band kar dete hain, fix unhe ghar bhejna aur ek replacement laana hai (container restart karo). **Startup** check induction period hai: ek bilkul naya hire pehle ghante ke liye calls lene ya responsiveness check pass karne ki ummeed nahi hai.',
    },

    simple: `**THREE PROBES, THREE JOBS. same check types, different consequences.**
\`\`\`yaml
containers:
  - name: app
    readinessProbe:                 # "should this Pod get traffic?"  fail -> OUT of Service endpoints
      httpGet: { path: /readyz, port: 8080 }
      periodSeconds: 5
      failureThreshold: 3
    livenessProbe:                  # "is this container wedged?"     fail -> RESTART the container
      httpGet: { path: /healthz, port: 8080 }
      periodSeconds: 10
      failureThreshold: 3
    startupProbe:                   # "has it finished booting yet?"   holds off the other two
      httpGet: { path: /healthz, port: 8080 }
      periodSeconds: 5
      failureThreshold: 30          # 30 x 5s = up to 150s to boot before liveness kicks in
\`\`\`

**WHAT EACH ONE GATES:**
\`\`\`
READINESS   fail -> Pod removed from ALL Service EndpointSlices -> no NEW traffic.
            container is NOT restarted. passes again -> added back. use for: warmup,
            a dependency being down, load-shedding, graceful shutdown (fail readiness,
            drain, then exit). a Deployment rollout waits for new Pods to be READY.
LIVENESS    fail -> kubelet kills the container, restartPolicy restarts it, backoff
            grows (10s,20s,40s... max 5m) -> CrashLoopBackOff. use ONLY for
            deadlock/wedged states a restart actually fixes. do NOT check dependencies.
STARTUP     while it is failing, readiness & liveness are SUSPENDED. once it passes
            once, it never runs again and the other two take over. use for slow boots
            (JVM warmup, big cache load, migrations) instead of huge initialDelaySeconds.
\`\`\`

**PROBE TYPES:** \`httpGet\` (2xx/3xx = pass), \`tcpSocket\` (connect = pass), \`exec\`
(exit 0 = pass), \`grpc\` (the gRPC health protocol).

**KNOBS:** \`initialDelaySeconds\` (wait before the first check), \`periodSeconds\` (gap
between checks), \`timeoutSeconds\` (a slow check counts as a failure), \`failureThreshold\`
/ \`successThreshold\` (consecutive results needed to flip).

**THE CLASSIC TRAP:** a liveness probe that checks a downstream dependency. The DB blips
-> every Pod fails liveness -> every Pod restarts -> the restarts hammer the recovering DB
-> cluster-wide outage from a transient blip. dependencies belong in READINESS, not liveness.`,

    simpleHi: `**TEEN PROBES, TEEN KAAM. same check types, alag consequences.**
\`\`\`yaml
containers:
  - name: app
    readinessProbe:                 # "kya is Pod ko traffic milna chahiye?"  fail -> Service endpoints se BAHAR
      httpGet: { path: /readyz, port: 8080 }
      periodSeconds: 5
      failureThreshold: 3
    livenessProbe:                  # "kya ye container atka hua hai?"     fail -> container RESTART
      httpGet: { path: /healthz, port: 8080 }
      periodSeconds: 10
      failureThreshold: 3
    startupProbe:                   # "kya ye boot ho chuka?"   doosre do ko rok kar rakhta hai
      httpGet: { path: /healthz, port: 8080 }
      periodSeconds: 5
      failureThreshold: 30          # 30 x 5s = boot ke liye 150s tak liveness kick in hone se pehle
\`\`\`

**HAR EK KYA GATE KARTA HAI:**
\`\`\`
READINESS   fail -> Pod SAARE Service EndpointSlices se removed -> koi NAYA traffic nahi.
            container RESTART NAHI hota. dobara pass -> wapas added. use for: warmup,
            ek dependency down hona, load-shedding, graceful shutdown. ek Deployment
            rollout naye Pods ke READY hone ka wait karta hai.
LIVENESS    fail -> kubelet container ko kill karta hai, restartPolicy ise restart karta
            hai, backoff badhta hai (10s,20s,40s... max 5m) -> CrashLoopBackOff. use SIRF
            deadlock/wedged states ke liye jo ek restart actually fix karta hai. dependencies check mat karo.
STARTUP     jab tak ye fail ho raha hai, readiness & liveness SUSPENDED hain. ek baar pass
            hone par, ye phir kabhi nahi chalta. slow boots ke liye use karo.
\`\`\`

**PROBE TYPES:** \`httpGet\` (2xx/3xx = pass), \`tcpSocket\` (connect = pass), \`exec\`
(exit 0 = pass), \`grpc\`.

**KNOBS:** \`initialDelaySeconds\`, \`periodSeconds\`, \`timeoutSeconds\`, \`failureThreshold\`
/ \`successThreshold\`.

**CLASSIC TRAP:** ek liveness probe jo ek downstream dependency check karta hai. DB blip
karta hai -> har Pod liveness fail karta hai -> har Pod restart hota hai -> restarts
recovering DB ko hammer karte hain -> ek transient blip se cluster-wide outage. dependencies READINESS mein, liveness mein nahi.`,

    content: `## What the kubelet knows without a probe

By default the kubelet knows one thing about your container: whether its main process is running. If the process is up but deadlocked, stuck in a GC pause, waiting on a lock that will never release, or serving 500s to every request, the kubelet sees a healthy container. Probes are how you tell it what healthy actually means for this workload.

## Readiness — should this Pod receive traffic?

The readiness probe runs on a period for the whole life of the container. While it is failing, the Pod is **removed from every Service's EndpointSlice**, so it receives no new traffic; existing connections are not cut. The container is **not restarted**. When the probe passes again, the Pod is added back.

Readiness is for any condition where the Pod is alive but should not be serving right now:

- **Warmup** — caches to fill, JIT to compile, connection pools to establish.
- **A dependency is down** — if the app genuinely cannot serve without its database, failing readiness sheds load cleanly until the database returns. (Contrast with liveness, below.)
- **Load-shedding** — a Pod under too much load can fail readiness to drop out of rotation briefly.
- **Graceful shutdown** — on SIGTERM, fail readiness first, let in-flight requests finish and the endpoint controllers notice, then exit. This is what \`preStop\` hooks and \`terminationGracePeriodSeconds\` coordinate.

A Deployment rollout uses readiness as its definition of "available": it will not scale down old Pods faster than new Pods become Ready.

## Liveness — is this container wedged?

The liveness probe also runs on a period. While it is failing past its \`failureThreshold\`, the kubelet **kills the container**, and the Pod's \`restartPolicy\` (\`Always\` for a Deployment) restarts it. Repeated failures grow the restart backoff — 10s, 20s, 40s, doubling to a 5-minute cap — and the Pod shows \`CrashLoopBackOff\`.

Liveness is **only** for states that a restart actually fixes: a genuine deadlock, an unrecoverable internal error, a wedged event loop. If a restart would not help, a liveness probe does not belong there.

The classic mistake is a liveness probe that checks a **downstream dependency** — the database, another service, a queue. When that dependency has a brief outage, every Pod fails liveness simultaneously, every Pod is killed and restarted, the mass of restarts and reconnections hits the dependency exactly as it is trying to recover, and a transient blip becomes a full outage. Dependency health belongs in **readiness**, where the consequence is "stop sending traffic" rather than "restart everything."

Many production services run **no liveness probe at all**, or a very shallow one (a static \`/healthz\` that only confirms the HTTP server loop is turning), precisely to avoid this failure mode.

## Startup — has it finished booting?

Some containers take a long time to start — a JVM warming up, a large model or cache loading, database migrations running on boot. Without help, you would need a large \`initialDelaySeconds\` on the liveness probe, which then also delays detection of a real deadlock later.

The startup probe solves this. While it is failing, **both the readiness and liveness probes are suspended**. It has its own generous \`failureThreshold * periodSeconds\` budget (say 30 × 5s = 150s). The moment it passes once, it never runs again and the readiness and liveness probes take over with their normal, tight timings. So you get a long grace period for boot and fast failure detection afterwards, without compromising either.

## The knobs

- \`initialDelaySeconds\` — delay before the first check (prefer a startup probe over a large value here).
- \`periodSeconds\` — seconds between checks.
- \`timeoutSeconds\` — a check that takes longer than this counts as a failure (default 1s, often too low).
- \`failureThreshold\` / \`successThreshold\` — how many consecutive fails/passes flip the state.
- \`terminationGracePeriodSeconds\` can be set on a probe to shorten the kill grace period for a liveness failure specifically.

## Probe types

\`httpGet\` (any 2xx or 3xx is a pass; runs from the kubelet, not inside the container), \`tcpSocket\` (a successful TCP connect is a pass), \`exec\` (runs a command in the container; exit 0 is a pass; the most expensive), and \`grpc\` (uses the standard gRPC health-checking protocol).`,

    contentHi: `## Ek probe ke bina kubelet kya jaanta hai

Default se kubelet aapke container ke baare mein ek cheez jaanta hai: kya iska main process running hai. Agar process up hai par deadlocked hai, ek GC pause mein atka hai, ek lock par wait kar raha hai jo kabhi release nahi hoga, ya har request ko 500s serve kar raha hai, kubelet ek healthy container dekhta hai. Probes wo tarika hain jisse aap ise batate ho ki is workload ke liye healthy ka actually kya matlab hai.

## Readiness — kya is Pod ko traffic milna chahiye?

Readiness probe container ke poore life ke liye ek period par chalta hai. Jab tak ye fail ho raha hai, Pod **har Service ke EndpointSlice se removed** hai, to ise koi naya traffic nahi milta; existing connections cut nahi hote. Container **restart NAHI hota**. Jab probe dobara pass hota hai, Pod wapas added hota hai.

Readiness kisi bhi condition ke liye hai jahan Pod alive hai par abhi serve nahi karna chahiye: warmup; ek dependency down hai; load-shedding; graceful shutdown (SIGTERM par, pehle readiness fail karo, in-flight requests khatam hone do, phir exit karo).

Ek Deployment rollout readiness ko "available" ki apni definition ke roop mein use karta hai: ye old Pods ko naye Pods ke Ready hone se tez scale down nahi karega.

## Liveness — kya ye container atka hua hai?

Liveness probe bhi ek period par chalta hai. Jab tak ye apne \`failureThreshold\` ke aage fail ho raha hai, kubelet **container ko kill karta hai**, aur Pod ka \`restartPolicy\` ise restart karta hai. Repeated failures restart backoff badhate hain — 10s, 20s, 40s, ek 5-minute cap tak double — aur Pod \`CrashLoopBackOff\` dikhaata hai.

Liveness **sirf** un states ke liye hai jo ek restart actually fix karta hai: ek genuine deadlock, ek unrecoverable internal error, ek wedged event loop.

Classic mistake ek liveness probe hai jo ek **downstream dependency** check karta hai. Jab us dependency ka ek brief outage hota hai, har Pod ek saath liveness fail karta hai, har Pod kill aur restart hota hai, restarts aur reconnections ka mass dependency ko theek tab hit karta hai jab wo recover karne ki koshish kar raha hai, aur ek transient blip ek full outage ban jaata hai. Dependency health **readiness** mein belong karta hai.

Kai production services **koi liveness probe bilkul nahi** chalate, ya ek bahut shallow (ek static \`/healthz\` jo sirf confirm karta hai ki HTTP server loop ghoom raha hai).

## Startup — kya ye boot ho chuka?

Kuch containers start hone mein lamba samay lete hain — ek JVM warm up, ek large model ya cache load, database migrations. Bina help ke, aapko liveness probe par ek large \`initialDelaySeconds\` chahiye hoga, jo phir baad mein ek real deadlock ki detection bhi delay karta hai.

Startup probe ise solve karta hai. Jab tak ye fail ho raha hai, **readiness aur liveness dono probes suspended hain**. Iska apna generous \`failureThreshold * periodSeconds\` budget hai. Jis moment ye ek baar pass hota hai, ye phir kabhi nahi chalta aur readiness aur liveness probes apni normal, tight timings ke saath le lete hain.

## Knobs

- \`initialDelaySeconds\` — pehle check se pehle delay (yahan ek large value ke bajaay ek startup probe prefer karo).
- \`periodSeconds\` — checks ke beech seconds.
- \`timeoutSeconds\` — ek check jo isse zyada leta hai ek failure count hota hai (default 1s, often bahut kam).
- \`failureThreshold\` / \`successThreshold\` — kitne consecutive fails/passes state flip karte hain.

## Probe types

\`httpGet\` (koi bhi 2xx ya 3xx ek pass hai; kubelet se chalta hai), \`tcpSocket\` (ek successful TCP connect ek pass hai), \`exec\` (container mein ek command chalata hai; exit 0 ek pass hai), aur \`grpc\`.`,

    examples: [
      {
        title: 'Readiness failing removes a Pod from its Service; liveness failing restarts the container',
        titleHi: 'Readiness fail hona ek Pod ko iske Service se hataata hai; liveness fail hona container restart karta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m8l5-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

# readiness = "cat /tmp/ready" ; liveness = "cat /tmp/alive" ; both created at boot
cat <<YAML | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Pod
metadata: { name: probes, labels: { app: probes } }
spec:
  containers:
    - name: c
      image: busybox:1.36
      command: [ "sh", "-c", "touch /tmp/ready /tmp/alive; sleep 3600" ]
      readinessProbe: { exec: { command: [ "cat", "/tmp/ready" ] }, periodSeconds: 2, failureThreshold: 1 }
      livenessProbe:  { exec: { command: [ "cat", "/tmp/alive" ] }, periodSeconds: 2, failureThreshold: 2 }
YAML
kubectl -n "$ns" expose pod probes --port=80 >/dev/null
kubectl -n "$ns" wait --for=condition=Ready pod/probes --timeout=90s >/dev/null

epcount()  { kubectl -n "$ns" get endpointslices -l kubernetes.io/service-name=probes -o jsonpath='{range .items[*]}{.endpoints[*].conditions.ready}{end}' | grep -o true | grep -c . ; }
restarts() { kubectl -n "$ns" get pod probes -o jsonpath='{.status.containerStatuses[0].restartCount}'; }

echo "healthy:            ready endpoints=$(epcount)  restarts=$(restarts)"

echo "--- fail READINESS only (rm /tmp/ready) ---"
kubectl -n "$ns" exec probes -- rm /tmp/ready
sleep 6
echo "readiness failing:  ready endpoints=$(epcount)  restarts=$(restarts)   (removed from Service; NOT restarted)"

kubectl -n "$ns" exec probes -- touch /tmp/ready
sleep 6
echo "readiness restored: ready endpoints=$(epcount)  restarts=$(restarts)"

echo "--- fail LIVENESS (rm /tmp/alive) ---"
kubectl -n "$ns" exec probes -- rm /tmp/alive
for i in $(seq 1 30); do [ "$(restarts)" = 1 ] && break; sleep 2; done
echo "liveness failed:    restarts=$(restarts)   (kubelet killed & restarted the container)"`,
        output: `healthy:            ready endpoints=1  restarts=0
--- fail READINESS only (rm /tmp/ready) ---
readiness failing:  ready endpoints=0  restarts=0   (removed from Service; NOT restarted)
readiness restored: ready endpoints=1  restarts=0
--- fail LIVENESS (rm /tmp/alive) ---
liveness failed:    restarts=1   (kubelet killed & restarted the container)`,
        explain: 'One Pod has both a readiness and a liveness probe, each an exec check for a file that the container creates at boot. The Pod starts healthy: it has one ready endpoint in its Service and zero restarts. Deleting the readiness file makes only the readiness probe fail. Within a few seconds the Pod is removed from the Service EndpointSlice — it has zero ready endpoints now, so it receives no new traffic — but its restart count stays at zero, because a failing readiness probe never restarts anything. Recreating the file lets readiness pass again and the Pod is added straight back with, still, no restarts. Then the liveness file is deleted. This time the kubelet, after the probe fails its threshold, kills the container; the Pod\'s restartPolicy brings it back, the container\'s boot command re-runs and recreates both files, and the restart count is now one. This is the core distinction: readiness controls traffic and is reversible with no disruption, liveness controls the container lifecycle and its failure mode is a restart.',
        explainHi: 'Ek Pod ke paas readiness aur liveness dono probe hain, har ek ek file ke liye ek exec check jo container boot par banata hai. Pod healthy start hota hai: iske Service mein ek ready endpoint hai aur zero restarts. Readiness file delete karna sirf readiness probe fail karvaata hai. Kuch seconds ke andar Pod Service EndpointSlice se removed hai — iske ab zero ready endpoints hain, to ise koi naya traffic nahi milta — par iska restart count zero par rehta hai, kyunki ek failing readiness probe kabhi kuch restart nahi karta. File dobara banane se readiness dobara pass hota hai. Phir liveness file delete hota hai. Is baar kubelet, probe ke threshold fail karne ke baad, container ko kill karta hai; Pod ka restartPolicy ise wapas laata hai, aur restart count ab ek hai. Ye core distinction hai: readiness traffic control karta hai aur bina disruption ke reversible hai, liveness container lifecycle control karta hai.',
      },
      {
        title: 'A startup probe protects a slow boot that an aggressive liveness probe would kill in a loop',
        titleHi: 'Ek startup probe ek slow boot ko bachaata hai jise ek aggressive liveness probe ek loop mein kill kar deta',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m8l5b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

# BOOT: the container is only "up" (/tmp/up exists) after ~20 seconds
BOOT='i=0; while [ ! -f /tmp/up ]; do i=$((i+1)); [ $i -ge 20 ] && touch /tmp/up; sleep 1; done; sleep 3600'

echo "=== WITHOUT a startupProbe: an aggressive livenessProbe kills the slow boot ==="
cat <<YAML | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Pod
metadata: { name: no-startup }
spec:
  containers:
    - name: c
      image: busybox:1.36
      command: [ "sh", "-c", "$BOOT" ]
      livenessProbe: { exec: { command: [ "sh", "-c", "test -f /tmp/up" ] }, periodSeconds: 2, failureThreshold: 3 }
YAML
r=0
for i in $(seq 1 30); do
  r=$(kubectl -n "$ns" get pod no-startup -o jsonpath='{.status.containerStatuses[0].restartCount}' 2>/dev/null)
  [ "\${r:-0}" -ge 1 ] && break
  sleep 2
done
[ "\${r:-0}" -ge 1 ] && echo "no-startup:   the container was RESTARTED before boot finished (liveness fired at ~6s < 20s boot) -> CrashLoop"

echo
echo "=== WITH a startupProbe: liveness is held off until startup succeeds ==="
cat <<YAML | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Pod
metadata: { name: with-startup }
spec:
  containers:
    - name: c
      image: busybox:1.36
      command: [ "sh", "-c", "$BOOT" ]
      startupProbe:  { exec: { command: [ "sh", "-c", "test -f /tmp/up" ] }, periodSeconds: 2, failureThreshold: 30 }
      livenessProbe: { exec: { command: [ "sh", "-c", "test -f /tmp/up" ] }, periodSeconds: 2, failureThreshold: 3 }
YAML
kubectl -n "$ns" wait --for=condition=Ready pod/with-startup --timeout=120s >/dev/null
echo "with-startup: restarts=$(kubectl -n "$ns" get pod with-startup -o jsonpath='{.status.containerStatuses[0].restartCount}')  ready=$(kubectl -n "$ns" get pod with-startup -o jsonpath='{.status.containerStatuses[0].ready}')  (startupProbe allowed 30x2s=60s; liveness only ran after it passed)"`,
        output: `=== WITHOUT a startupProbe: an aggressive livenessProbe kills the slow boot ===
no-startup:   the container was RESTARTED before boot finished (liveness fired at ~6s < 20s boot) -> CrashLoop

=== WITH a startupProbe: liveness is held off until startup succeeds ===
with-startup: restarts=0  ready=true  (startupProbe allowed 30x2s=60s; liveness only ran after it passed)`,
        explain: 'Both Pods run the same container, which does not finish booting until roughly twenty seconds after it starts. The first Pod has only a liveness probe, with a threshold of three failures at two-second intervals, so the probe gives up about six seconds in — well before the boot completes. The kubelet kills the container, it restarts, the twenty-second boot begins again, the probe kills it again, and the Pod is stuck in a restart loop that it can never escape, even though nothing is actually wrong with it. The second Pod adds a startup probe with the same check but a threshold of thirty, giving the boot up to sixty seconds. While the startup probe is still failing, the liveness probe does not run at all. Once the boot finishes and the startup probe passes its single required success, it is retired for good and the liveness probe takes over with its tight timing. The Pod reaches Ready with zero restarts. The lesson is that slow starts should be handled with a startup probe, not by loosening the liveness probe\'s timing, which would also slow down detection of a real hang later.',
        explainHi: 'Dono Pods same container chalate hain, jo start hone ke lagbhag bees seconds baad tak boot khatam nahi karta. Pehle Pod ke paas sirf ek liveness probe hai, do-second intervals par teen failures ke threshold ke saath, to probe lagbhag chhe seconds mein give up karta hai — boot complete hone se kaafi pehle. Kubelet container ko kill karta hai, ye restart hota hai, bees-second boot dobara shuru hota hai, probe ise dobara kill karta hai, aur Pod ek restart loop mein atka hai jise ye kabhi escape nahi kar sakta, halaanki iske saath actually kuch galat nahi hai. Doosra Pod same check par ek startup probe add karta hai par tees ke threshold ke saath, boot ko saath seconds tak deta hai. Jab tak startup probe abhi bhi fail ho raha hai, liveness probe bilkul nahi chalta. Ek baar boot khatam hone aur startup probe apni single required success pass karne par, ye achhe ke liye retire ho jaata hai. Pod zero restarts ke saath Ready pahunchta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a liveness probe that checks a downstream dependency
livenessProbe:
  httpGet: { path: /healthz, port: 8080 }
# ...and /healthz internally does: SELECT 1 from the database, ping Redis, call the auth service.
# the DB has a 30-second blip ->
#   every Pod's /healthz returns 500 -> every Pod fails liveness -> every Pod restarts
#   -> a thundering herd of reconnections hits the DB as it recovers -> full outage
#   -> now also CrashLoopBackOff, so recovery is delayed by the backoff timer.`,
        right: `# liveness = "is THIS process wedged?" only. dependencies go in READINESS.
livenessProbe:                       # shallow: is the HTTP loop turning?
  httpGet: { path: /livez, port: 8080 }     # returns 200 unless the server is deadlocked
readinessProbe:                      # deep: can I actually serve a request right now?
  httpGet: { path: /readyz, port: 8080 }     # checks the DB/Redis/etc
# DB blip now -> Pods fail READINESS -> traffic stops -> Pods stay up -> when the DB
# returns, readiness passes and traffic resumes. no restarts, no herd, no outage.
# many teams run NO liveness probe at all, or only a trivial one.`,
        why: 'A liveness probe failure causes the kubelet to kill and restart the container, so a liveness probe should only test conditions that a restart can fix — a deadlock, a wedged event loop, an unrecoverable internal state. When the liveness endpoint also checks downstream dependencies such as a database or another service, a brief outage of that dependency makes every replica fail liveness at the same time. The kubelet then restarts all of them together, and the resulting wave of process starts and connection attempts arrives at the dependency precisely while it is trying to recover, turning a short blip into a sustained outage, now compounded by CrashLoopBackOff delaying each Pod\'s return. Dependency checks belong in the readiness probe, whose failure only removes the Pod from Service endpoints. There, a dependency outage causes traffic to stop flowing to Pods that cannot serve, the Pods themselves stay running, and when the dependency recovers the readiness probe passes and traffic resumes with no restarts. The liveness probe, if present at all, should be a shallow check that the process itself is responsive.',
        whyHi: 'Ek liveness probe failure kubelet ko container kill aur restart karvaata hai, to ek liveness probe ko sirf un conditions ko test karna chahiye jo ek restart fix kar sakta hai — ek deadlock, ek wedged event loop, ek unrecoverable internal state. Jab liveness endpoint downstream dependencies jaise ek database bhi check karta hai, us dependency ka ek brief outage har replica ko ek saath liveness fail karvaata hai. Kubelet phir un sabko ek saath restart karta hai, aur process starts aur connection attempts ki resulting wave dependency par theek tab pahunchti hai jab wo recover karne ki koshish kar rahi hai, ek short blip ko ek sustained outage mein badalte hue. Dependency checks readiness probe mein belong karte hain, jiska failure sirf Pod ko Service endpoints se hataata hai.',
      },
      {
        wrong: `# no readiness probe on a Deployment (or readiness == liveness)
spec:
  containers:
    - name: app
      livenessProbe: { httpGet: { path: /, port: 8080 } }
      # no readinessProbe
# on a rollout: a new Pod is "Ready" the instant its process starts listening — before
# caches are warm, before the DB pool is up. the rollout scales down old Pods against it.
# result: ~10s of 502s / cold-cache latency spikes on every single deploy.`,
        right: `# ALWAYS give a Deployment a readiness probe that reflects "can serve a real request":
readinessProbe:
  httpGet: { path: /readyz, port: 8080 }   # 200 only after warmup + deps are reachable
  periodSeconds: 5
  failureThreshold: 3
# also set minReadySeconds on the Deployment (a Pod must stay Ready this long before it
# counts as available) and, for slow starters, a startupProbe. now a rollout only
# proceeds as new Pods genuinely become able to serve.`,
        why: 'A rollout, a scale-up, and Service endpoint membership are all driven by whether a Pod is Ready, and in the absence of a readiness probe a Pod is considered Ready as soon as its container is running. For most applications there is a gap between the process starting to listen and the process being able to serve correctly — caches are cold, connection pools are still being established, lazy initialisation has not run. Without a readiness probe that closes this gap, a Deployment rollout will route traffic to new Pods and scale down old ones during that window, producing a burst of errors or a latency spike on every deploy. Defining a readiness probe that returns success only once the Pod can actually handle a request makes the rollout wait for genuine availability. Adding minReadySeconds requires a Pod to hold its Ready state for a set time before it counts toward the available total, which absorbs Pods that flap Ready briefly and then fail, and a startup probe handles the case where initial readiness legitimately takes a long time.',
        whyHi: 'Ek rollout, ek scale-up, aur Service endpoint membership sab is baat se driven hain ki ek Pod Ready hai ya nahi, aur ek readiness probe ki absence mein ek Pod Ready maana jaata hai jaise hi iska container running hai. Zyadaatar applications ke liye process ke listen karna shuru karne aur process ke correctly serve karne ke able hone ke beech ek gap hai — caches cold hain, connection pools abhi bhi establish ho rahe hain. Is gap ko band karne wale ek readiness probe ke bina, ek Deployment rollout us window ke dauraan naye Pods par traffic route karega aur old ko scale down karega, har deploy par errors ka ek burst ya ek latency spike produce karte hue. Ek readiness probe define karna jo success sirf tab return karta hai jab Pod actually ek request handle kar sakta hai rollout ko genuine availability ke liye wait karvaata hai.',
      },
      {
        wrong: `# using a big initialDelaySeconds on liveness to cover a slow boot
livenessProbe:
  httpGet: { path: /healthz, port: 8080 }
  initialDelaySeconds: 120          # "the JVM takes ~90s to warm up"
  periodSeconds: 10
# problems: (1) if boot actually takes 130s -> still CrashLoops. (2) if the app
# deadlocks at second 5, you don't find out for 2 minutes. one number can't be both
# "long enough for the worst boot" and "short enough to catch a real hang fast".`,
        right: `# split the two concerns with a startupProbe:
startupProbe:
  httpGet: { path: /healthz, port: 8080 }
  failureThreshold: 30             # 30 x periodSeconds
  periodSeconds: 10               # -> up to 300s to boot, checked every 10s
livenessProbe:
  httpGet: { path: /healthz, port: 8080 }
  periodSeconds: 10
  failureThreshold: 3            # -> once booted, a hang is caught in ~30s
# while startupProbe fails, liveness (and readiness) are suspended. after it passes
# once, it never runs again and liveness takes over with tight timing.`,
        why: 'The initialDelaySeconds field delays only the first execution of a probe. Using a large value on the liveness probe to accommodate a slow boot forces a single number to serve two incompatible purposes: it must be long enough to cover the slowest acceptable startup, and short enough that a deadlock occurring after startup is detected quickly. Any value that is safe for boot is too slow for hang detection, and vice versa, and if the boot ever exceeds the chosen delay the container still enters a crash loop. The startup probe separates the concerns. It runs during startup with its own budget, defined as failureThreshold multiplied by periodSeconds, and while it has not yet succeeded the readiness and liveness probes do not run. As soon as it succeeds once it is permanently disabled, and the liveness probe begins running with a short period and low failure threshold suitable for catching a real hang. The result is a long, adjustable grace period for starting and fast detection afterwards, with no compromise between them.',
        whyHi: 'initialDelaySeconds field sirf ek probe ke pehle execution ko delay karta hai. Ek slow boot ko accommodate karne ke liye liveness probe par ek large value use karna ek single number ko do incompatible purposes serve karne ke liye force karta hai: ise slowest acceptable startup cover karne ke liye kaafi lamba hona chahiye, aur itna chhota ki startup ke baad hone wala ek deadlock jaldi detect ho. Koi bhi value jo boot ke liye safe hai hang detection ke liye bahut slow hai. Startup probe concerns ko separate karta hai. Ye startup ke dauraan apne budget ke saath chalta hai, aur jab tak ye abhi tak succeed nahi hua hai readiness aur liveness probes nahi chalte. Jaise hi ye ek baar succeed karta hai ye permanently disabled hai.',
      },
    ],

    realWorld: [
      {
        en: '**A regional outage triggered by a 40-second RDS failover.** Every service had a liveness probe that hit `/health`, which checked the database. All Pods across all services restarted simultaneously; the reconnection storm extended a 40s blip into a 25-minute outage. The fix was a one-line split into `/livez` (shallow) and `/readyz` (deep).',
        hi: '**Ek 40-second RDS failover se trigger hua ek regional outage.** Har service ke paas ek liveness probe tha jo `/health` hit karta tha, jo database check karta tha. Sabhi services ke sabhi Pods ek saath restart hue; reconnection storm ne ek 40s blip ko ek 25-minute outage mein extend kiya. Fix `/livez` aur `/readyz` mein ek one-line split tha.',
      },
      {
        en: '**"Every deploy causes a 10-second error spike."** No readiness probe — new Pods were declared Ready before their in-memory cache loaded, and the rollout shifted traffic onto cold Pods. Adding a `/readyz` that waited for cache warmup + `minReadySeconds: 15` removed the spike entirely.',
        hi: '**"Har deploy ek 10-second error spike causes karta hai."** Koi readiness probe nahi — naye Pods apne in-memory cache load hone se pehle Ready declare hue. Ek `/readyz` add karna jo cache warmup ka wait karta tha + `minReadySeconds: 15` ne spike poori tarah hataya.',
      },
      {
        en: '**A JVM service stuck in CrashLoopBackOff on a bigger dataset** — boot went from 70s to 100s and blew past `livenessProbe.initialDelaySeconds: 90`. Replaced with a `startupProbe` (`failureThreshold: 60`, `periodSeconds: 5` → 300s budget) and it never recurred, even as data grew.',
        hi: '**Ek bigger dataset par CrashLoopBackOff mein atka ek JVM service** — boot 70s se 100s ho gaya aur `livenessProbe.initialDelaySeconds: 90` ke aage nikal gaya. Ek `startupProbe` se replace kiya (300s budget) aur ye phir kabhi nahi hua.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the three probe types and what does each one do when it fails?',
        qHi: 'Teen probe types kya hain aur fail hone par har ek kya karta hai?',
        a: 'Readiness, liveness, and startup. They can use the same check mechanisms — httpGet, tcpSocket, exec, grpc — but the consequence of failure is different for each. A failing readiness probe causes the Pod to be removed from every Service\'s EndpointSlice, so it stops receiving new traffic, but the container is not touched; when the probe passes again the Pod is added back. Readiness is for temporary "alive but should not serve" states: warmup, a dependency being unavailable, load-shedding, and the first phase of graceful shutdown. A failing liveness probe causes the kubelet to kill the container, after which the restartPolicy restarts it, with an exponential backoff that tops out at five minutes and shows as CrashLoopBackOff. Liveness is only for states a restart actually fixes, such as a deadlock, and must not check external dependencies. A failing startup probe means the container has not finished booting; while it is failing, both the readiness and liveness probes are suspended, and it has its own large failureThreshold times periodSeconds budget. The instant it succeeds once, it never runs again and readiness and liveness take over with normal timing. Startup exists so a slow boot does not need a huge initialDelaySeconds on liveness, which would also delay detection of a real hang.',
        aHi: 'Readiness, liveness, aur startup. Wo same check mechanisms use kar sakte hain — httpGet, tcpSocket, exec, grpc — par failure ka consequence har ek ke liye alag hai. Ek failing readiness probe Pod ko har Service ke EndpointSlice se remove karvaata hai, to ye naya traffic receive karna band karta hai, par container touch nahi hota; jab probe dobara pass hota hai Pod wapas added hota hai. Readiness temporary "alive par serve nahi karna chahiye" states ke liye hai. Ek failing liveness probe kubelet ko container kill karvaata hai, jiske baad restartPolicy ise restart karta hai, ek exponential backoff ke saath jo paanch minute par top out karta hai. Liveness sirf un states ke liye hai jo ek restart actually fix karta hai, aur external dependencies check nahi karna chahiye. Ek failing startup probe ka matlab container ne boot khatam nahi kiya; jab tak ye fail ho raha hai, readiness aur liveness dono suspended hain.',
      },
      {
        q: 'Why is a liveness probe that checks the database dangerous, and what should you do instead?',
        qHi: 'Ek liveness probe jo database check karta hai khatarnak kyun hai, aur aapko iske bajaay kya karna chahiye?',
        a: 'Because a liveness failure restarts the container, and the database being briefly unavailable is not something a restart fixes. If the liveness endpoint checks the database, then when the database has even a short outage — a failover, a brief network partition, a few seconds of overload — every replica of every service that shares that database fails its liveness probe at essentially the same moment. The kubelet kills and restarts all of them together. The mass of simultaneous process starts and fresh connection attempts then lands on the database exactly as it is trying to recover, which can prevent it from recovering at all, turning a blip into a prolonged outage. On top of that, the repeated restarts push every Pod into CrashLoopBackOff, so even once the database is healthy the Pods come back slowly, paced by the backoff timer. The correct approach is to check dependencies in the readiness probe instead. A readiness failure only removes the Pod from Service endpoints, so a database outage causes traffic to stop flowing to Pods that cannot serve, the Pods stay running, and when the database returns readiness passes and traffic resumes with no restarts and no herd. The liveness probe should be shallow — often just confirming the HTTP server loop is responsive — or omitted entirely, which many teams do.',
        aHi: 'Kyunki ek liveness failure container ko restart karta hai, aur database ka thodi der ke liye unavailable hona kuch aisa nahi hai jo ek restart fix karta hai. Agar liveness endpoint database check karta hai, to jab database ka ek short outage bhi hota hai, us database ko share karne wali har service ke har replica apna liveness probe essentially same moment par fail karta hai. Kubelet un sabko ek saath kill aur restart karta hai. Simultaneous process starts aur fresh connection attempts ka mass phir database par theek tab land karta hai jab wo recover karne ki koshish kar raha hai. Correct approach dependencies ko readiness probe mein check karna hai. Ek readiness failure sirf Pod ko Service endpoints se hataata hai, to ek database outage traffic ko un Pods par flow karna band karvaata hai jo serve nahi kar sakte, Pods running rehte hain, aur jab database wapas aata hai readiness pass hota hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, state what each of the three probes gates and the failure consequence of each, with one correct use case per probe.',
        taskHi: 'Ek comment mein, batao ki teen probes mein se har ek kya gate karta hai.',
        hint: 'READINESS — "should this Pod get traffic?" FAIL → Pod removed from EVERY Service EndpointSlice → no NEW traffic (existing connections not cut); the container is NOT restarted; passes again → added back. Use for: warmup (caches/JIT/pools), a dependency being down, load-shedding, graceful shutdown (fail readiness → drain → exit). A Deployment rollout uses readiness as its definition of "available". LIVENESS — "is this container wedged?" FAIL past `failureThreshold` → kubelet KILLS the container → `restartPolicy` restarts it → backoff grows 10s/20s/40s...capped 5m → `CrashLoopBackOff`. Use ONLY for states a restart fixes: a real deadlock, a wedged event loop, unrecoverable internal state. Do NOT check dependencies. Many prod services run NO liveness probe or a trivial one. STARTUP — "has it finished booting?" While FAILING, readiness AND liveness are SUSPENDED; it has its own big `failureThreshold * periodSeconds` budget; the instant it passes ONCE it never runs again and the other two take over with tight timing. Use for slow boots (JVM warmup, big cache load, migrations) instead of a huge `initialDelaySeconds`.',
        hintHi: 'READINESS — "kya is Pod ko traffic milna chahiye?" FAIL → Pod HAR Service EndpointSlice se removed → koi NAYA traffic nahi; container RESTART NAHI hota; dobara pass → wapas added. Use for: warmup, ek dependency down, load-shedding, graceful shutdown. LIVENESS — "kya ye container atka hua hai?" `failureThreshold` ke aage FAIL → kubelet container ko KILL karta hai → `restartPolicy` restart karta hai → backoff badhta hai...5m capped → `CrashLoopBackOff`. Use SIRF un states ke liye jo ek restart fix karta hai. dependencies check MAT karo. STARTUP — "kya boot ho chuka?" FAILING ke dauraan, readiness AUR liveness SUSPENDED; iska apna bada budget; ek baar pass → phir kabhi nahi chalta. slow boots ke liye use karo.',
      },
      {
        task: 'In a comment, explain the "liveness probe checks a dependency" cascade failure step by step, and the fix.',
        taskHi: 'Ek comment mein, "liveness probe ek dependency check karta hai" cascade failure step by step samjhao.',
        hint: 'SETUP: `livenessProbe` hits `/healthz`, and `/healthz` internally does `SELECT 1` / pings Redis / calls the auth service. CASCADE: (1) the DB has a brief blip (failover, network partition, 30s overload); (2) `/healthz` returns 500 on EVERY Pod of EVERY service sharing that DB, simultaneously; (3) all those Pods fail liveness at the same moment → the kubelet KILLS + restarts all of them together; (4) the thundering herd of process starts + fresh DB connections lands on the DB exactly as it tries to recover → it can\'t recover → a 30s blip becomes a 25-minute outage; (5) the repeated restarts push every Pod into `CrashLoopBackOff`, so recovery is further delayed by the backoff timer even once the DB is healthy. FIX: dependencies go in READINESS, not liveness. Split the endpoint: `/livez` = shallow (is the HTTP loop turning? returns 200 unless truly deadlocked) for liveness; `/readyz` = deep (checks DB/Redis/etc) for readiness. Now a DB blip → Pods fail READINESS → traffic stops → Pods STAY UP → DB returns → readiness passes → traffic resumes. No restarts, no herd, no outage. Many teams run no liveness probe at all.',
        hintHi: 'SETUP: `livenessProbe` `/healthz` hit karta hai, aur `/healthz` internally `SELECT 1` karta hai / Redis ping karta hai. CASCADE: (1) DB ka ek brief blip; (2) `/healthz` us DB ko share karne wali HAR service ke HAR Pod par 500 return karta hai, ek saath; (3) wo sabhi Pods same moment par liveness fail karte hain → kubelet un sabko KILL + restart karta hai; (4) process starts + fresh DB connections ka thundering herd DB par theek tab land karta hai jab wo recover karne ki koshish kar raha hai → ek 30s blip ek 25-minute outage ban jaata hai; (5) repeated restarts har Pod ko `CrashLoopBackOff` mein push karte hain. FIX: dependencies READINESS mein jaate hain. Endpoint split karo: `/livez` = shallow liveness ke liye; `/readyz` = deep readiness ke liye.',
      },
      {
        task: 'In a comment, explain why a large livenessProbe.initialDelaySeconds is the wrong way to handle a slow boot, and how a startupProbe fixes it.',
        taskHi: 'Ek comment mein, samjhao ki ek large livenessProbe.initialDelaySeconds ek slow boot handle karne ka galat tarika kyun hai.',
        hint: '`initialDelaySeconds` delays ONLY the first execution of a probe. Putting a big value on `livenessProbe` to cover a slow boot forces ONE number to serve TWO incompatible goals: (a) long enough to cover the SLOWEST acceptable startup, and (b) short enough that a deadlock AFTER startup is caught fast. Any value safe for (a) is too slow for (b), and vice versa — and if the boot ever exceeds the chosen delay, the container STILL CrashLoops. A `startupProbe` splits the concerns: it runs during startup with its own budget (`failureThreshold * periodSeconds`, e.g. 30 x 10s = 300s); while it has not yet succeeded, readiness AND liveness do NOT run at all; the instant it succeeds ONCE it is permanently disabled and the `livenessProbe` takes over with a short `periodSeconds` + low `failureThreshold` (e.g. catches a hang in ~30s). Result: a long, adjustable grace period for booting AND fast hang detection afterwards, with no compromise between them. Also pair a `readinessProbe` + `minReadySeconds` so a rollout waits for genuine availability.',
        hintHi: '`initialDelaySeconds` SIRF ek probe ke pehle execution ko delay karta hai. `livenessProbe` par ek bada value dena ek slow boot cover karne ke liye EK number ko DO incompatible goals serve karne ke liye force karta hai: (a) SLOWEST acceptable startup cover karne ke liye kaafi lamba, aur (b) itna chhota ki startup ke BAAD ek deadlock jaldi catch ho. (a) ke liye safe koi bhi value (b) ke liye bahut slow hai. Ek `startupProbe` concerns ko split karta hai: ye startup ke dauraan apne budget ke saath chalta hai; jab tak ye succeed nahi hua, readiness AUR liveness bilkul NAHI chalte; ek baar succeed → permanently disabled aur `livenessProbe` tight timing ke saath le leta hai. Result: booting ke liye ek lamba grace period AUR fast hang detection.',
      },
    ],

    keyTakeaways: [
      'Without a probe the kubelet knows only ONE thing: is the main process running. A deadlocked / GC-paused / 500-serving container still looks healthy. THREE PROBES use the same check types (`httpGet` 2xx-3xx=pass, `tcpSocket` connect=pass, `exec` exit0=pass, `grpc`) but have DIFFERENT failure consequences.',
      'READINESS — "should this Pod get traffic?" FAIL → removed from EVERY Service EndpointSlice → no NEW traffic; container NOT restarted; passes again → re-added. For: warmup, a dependency down, load-shedding, graceful shutdown (fail readiness → drain → exit). A Deployment rollout waits for new Pods to be READY before scaling down old ones — ALWAYS give a Deployment a readiness probe that means "can serve a real request", plus `minReadySeconds`, or every deploy has an error/latency spike.',
      'LIVENESS — "is this container wedged?" FAIL past `failureThreshold` → kubelet KILLS the container → `restartPolicy` restarts it → backoff 10s→20s→40s→...→5m cap → `CrashLoopBackOff`. ONLY for states a restart fixes (real deadlock, wedged loop). THE CLASSIC TRAP: a liveness probe that checks a downstream dependency (DB/Redis/auth) → a brief dependency blip fails liveness on EVERY Pod of EVERY service at once → mass restart → reconnection herd hits the recovering dependency → transient blip becomes a cluster-wide outage. Dependencies belong in READINESS. Many prod services run NO liveness probe, or only a shallow `/livez`.',
      'STARTUP — "has it finished booting?" While FAILING, readiness AND liveness are SUSPENDED; it has its own big `failureThreshold * periodSeconds` budget; the instant it passes ONCE it never runs again and the other two take over with tight timing. Use for slow boots (JVM warmup, big cache/model load, migrations). A large `livenessProbe.initialDelaySeconds` is the WRONG fix — one number can\'t be both "long enough for the worst boot" and "short enough to catch a real hang fast"; and if boot ever exceeds it, CrashLoop anyway.',
      'KNOBS: `initialDelaySeconds` (before first check — prefer a startupProbe), `periodSeconds` (gap between checks), `timeoutSeconds` (a slow check = a failure; default 1s is often too low), `failureThreshold` / `successThreshold` (consecutive results to flip state). PATTERN: `/livez` shallow (HTTP loop turning) for liveness + `/readyz` deep (deps reachable, caches warm) for readiness. On SIGTERM: fail readiness first, drain in-flight, then exit — coordinated by `preStop` + `terminationGracePeriodSeconds`.',
    ],
    keyTakeawaysHi: [
      'Ek probe ke bina kubelet sirf EK cheez jaanta hai: kya main process running hai. Ek deadlocked container abhi bhi healthy dikhta hai. TEEN PROBES same check types use karte hain (`httpGet` 2xx-3xx=pass, `tcpSocket` connect=pass, `exec` exit0=pass, `grpc`) par ALAG failure consequences hain.',
      'READINESS — "kya is Pod ko traffic milna chahiye?" FAIL → HAR Service EndpointSlice se removed → koi NAYA traffic nahi; container RESTART NAHI hota; dobara pass → re-added. For: warmup, ek dependency down, load-shedding, graceful shutdown. Ek Deployment rollout naye Pods ke READY hone ka wait karta hai old ko scale down karne se pehle — HAMESHA ek Deployment ko ek readiness probe do jo "ek real request serve kar sakta hai" ka matlab hai, plus `minReadySeconds`.',
      'LIVENESS — "kya ye container atka hua hai?" `failureThreshold` ke aage FAIL → kubelet container ko KILL karta hai → restart → backoff...5m cap → `CrashLoopBackOff`. SIRF un states ke liye jo ek restart fix karta hai. CLASSIC TRAP: ek liveness probe jo ek downstream dependency check karta hai → ek brief blip HAR service ke HAR Pod par ek saath liveness fail karvaata hai → mass restart → reconnection herd → ek transient blip ek cluster-wide outage ban jaata hai. Dependencies READINESS mein belong karte hain.',
      'STARTUP — "kya boot ho chuka?" FAILING ke dauraan, readiness AUR liveness SUSPENDED; iska apna bada budget; ek baar pass → phir kabhi nahi chalta. slow boots ke liye use karo. Ek large `livenessProbe.initialDelaySeconds` GALAT fix hai — ek number "worst boot ke liye kaafi lamba" aur "ek real hang jaldi catch karne ke liye kaafi chhota" dono nahi ho sakta.',
      'KNOBS: `initialDelaySeconds`, `periodSeconds`, `timeoutSeconds` (ek slow check = ek failure; default 1s often bahut kam), `failureThreshold` / `successThreshold`. PATTERN: `/livez` shallow liveness ke liye + `/readyz` deep readiness ke liye. SIGTERM par: pehle readiness fail karo, in-flight drain karo, phir exit — `preStop` + `terminationGracePeriodSeconds` dwara coordinated.',
    ],
  },

  {
    slug: 'ops-requests-limits-and-qos-classes',
    title: 'Requests, Limits & QoS Classes',
    titleHi: 'Requests, Limits & QoS Classes',
    description: 'A request is what the scheduler reserves for a container and what everything is billed against; a limit is a hard ceiling the kernel enforces. The gap between them, across all your Pods, determines how the node behaves under pressure — which Pod gets throttled, which gets OOM-killed, and which gets evicted first.',
    descriptionHi: 'Ek request wo hai jo scheduler ek container ke liye reserve karta hai aur jiske against sab kuch billed hota hai; ek limit ek hard ceiling hai jise kernel enforce karta hai. Unke beech ka gap, aapke saare Pods mein, decide karta hai ki node pressure mein kaise behave karta hai — kaunsa Pod throttle hota hai, kaunsa OOM-killed hota hai, aur kaunsa pehle evict hota hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 6,

    analogy: {
      en: '**Booking tables at a restaurant versus how much you are allowed to order.** Your *request* is the reservation — the restaurant sets aside a table for four whether or not all four show up, and it will not accept reservations beyond its capacity (the scheduler will not place a Pod on a node that cannot fit its requests). Your *limit* is the tab ceiling: order past it and different things happen for different goods. Run over your wine limit and the waiter simply pours slower — you are throttled but nothing is taken away (CPU is compressible). Run over your food limit and a dish is physically removed from the table (memory is not compressible — the container is OOM-killed). And when the kitchen is slammed and something has to give, the diners who never made a reservation are asked to leave first (BestEffort Pods are evicted before Burstable, which go before Guaranteed).',
      hi: '**Ek restaurant mein tables book karna versus aap kitna order kar sakte ho.** Aapki *request* reservation hai — restaurant chaar ke liye ek table alag rakhta hai chahe chaaron aayein ya nahi, aur ye apni capacity ke aage reservations accept nahi karega (scheduler ek Pod ko ek node par nahi rakhega jo iske requests fit nahi kar sakta). Aapki *limit* tab ceiling hai: iske aage order karo aur alag goods ke liye alag cheezein hoti hain. Apni wine limit se aage jao aur waiter bas slower pour karta hai — aap throttled ho par kuch chheena nahi jaata (CPU compressible hai). Apni food limit se aage jao aur ek dish physically table se hataya jaata hai (memory compressible nahi hai — container OOM-killed hai). Aur jab kitchen slammed hai aur kuch chhodna hai, wo diners jinhone kabhi reservation nahi ki pehle jaane ko kaha jaata hai (BestEffort Pods Burstable se pehle evict hote hain, jo Guaranteed se pehle jaate hain).',
    },

    simple: `**REQUEST = reserved (scheduling + billing). LIMIT = hard ceiling (kernel-enforced).**
\`\`\`yaml
containers:
  - name: app
    resources:
      requests:                      # the SCHEDULER guarantees this much is free on the node
        cpu: "250m"                   # 250 millicores = 0.25 of a core
        memory: "256Mi"
      limits:                        # the KERNEL caps the container here
        cpu: "500m"                   # CPU over limit -> THROTTLED (never killed)
        memory: "512Mi"              # memory over limit -> OOM-KILLED (exit 137)
\`\`\`

**CPU vs MEMORY behave completely differently:**
\`\`\`
CPU     COMPRESSIBLE. request -> a share of CPU time under contention (a weight).
        limit  -> CFS throttling: the container is paused when it exceeds its quota
        per 100ms window. never killed. over-tight CPU limits = mysterious p99 latency.
MEMORY  NOT COMPRESSIBLE. request -> used for scheduling + eviction ranking.
        limit  -> exceed it and the cgroup OOM-killer terminates the container
        (RESTARTS, reason: OOMKilled, exit 137). there is no "throttling" memory.
\`\`\`

**QoS CLASS — derived automatically from the requests/limits shape:**
\`\`\`
Guaranteed   every container has BOTH cpu & memory limits, AND limit == request for each.
             last to be evicted. gets the strongest OOM protection.
Burstable    at least one request or limit is set, but not "all equal". the common case.
             evicted after BestEffort, ranked by how far over its memory request it is.
BestEffort   NO requests and NO limits on ANY container. first to be evicted under
             node memory pressure. gets nothing guaranteed.
\`\`\`

**NODE PRESSURE:** when a node runs low on memory, the kubelet EVICTS Pods to reclaim it,
in order: BestEffort first, then Burstable (most-over-request first), Guaranteed last.
Evicted Pods are re-scheduled elsewhere (if they can fit).

**LIMITRANGE** (per-namespace) sets defaults + min/max so Pods can't omit resources or ask
for absurd amounts. **RESOURCEQUOTA** caps the total requests/limits a namespace may use.`,

    simpleHi: `**REQUEST = reserved (scheduling + billing). LIMIT = hard ceiling (kernel-enforced).**
\`\`\`yaml
containers:
  - name: app
    resources:
      requests:                      # SCHEDULER guarantee karta hai itna node par free hai
        cpu: "250m"                   # 250 millicores = 0.25 core
        memory: "256Mi"
      limits:                        # KERNEL container ko yahan cap karta hai
        cpu: "500m"                   # CPU over limit -> THROTTLED (kabhi killed nahi)
        memory: "512Mi"              # memory over limit -> OOM-KILLED (exit 137)
\`\`\`

**CPU vs MEMORY poori tarah alag behave karte hain:**
\`\`\`
CPU     COMPRESSIBLE. request -> contention ke tahat CPU time ka ek share (ek weight).
        limit  -> CFS throttling: container pause hota hai jab ye apna quota exceed karta hai
        per 100ms window. kabhi killed nahi. over-tight CPU limits = mysterious p99 latency.
MEMORY  COMPRESSIBLE NAHI. request -> scheduling + eviction ranking ke liye use.
        limit  -> ise exceed karo aur cgroup OOM-killer container ko terminate karta hai
        (RESTARTS, reason: OOMKilled, exit 137). memory ko "throttle" karne jaisa kuch nahi.
\`\`\`

**QoS CLASS — requests/limits shape se automatically derived:**
\`\`\`
Guaranteed   har container ke paas DONO cpu & memory limits hain, AUR limit == request har ke liye.
             evict hone mein aakhiri. sabse strong OOM protection.
Burstable    kam se kam ek request ya limit set hai, par "sab equal" nahi. common case.
             BestEffort ke baad evicted, is baat se ranked ki apni memory request se kitna aage hai.
BestEffort   KISI container par KOI requests aur KOI limits nahi. node memory pressure ke tahat
             evict hone mein pehla. kuch guaranteed nahi milta.
\`\`\`

**NODE PRESSURE:** jab ek node memory mein low chalta hai, kubelet Pods ko EVICT karta hai,
order mein: pehle BestEffort, phir Burstable (most-over-request pehle), Guaranteed aakhiri.

**LIMITRANGE** (per-namespace) defaults + min/max set karta hai. **RESOURCEQUOTA** total
requests/limits cap karta hai jo ek namespace use kar sakta hai.`,

    content: `## Request versus limit

Every container can declare, per resource, a **request** and a **limit**.

- The **request** is a reservation. The scheduler only places a Pod on a node if the sum of the Pod's container requests fits in that node's remaining allocatable capacity. The request is also what utilisation, cost allocation, autoscaling, and eviction ranking are all measured against. It is *not* a cap — a container can use more than its request if the node has spare capacity.
- The **limit** is a hard ceiling enforced by the Linux kernel through cgroups. What "enforced" means depends on the resource.

## CPU: compressible

CPU is a **compressible** resource — you can give a container less of it without destroying it, just slowing it down.

- The CPU **request** becomes a CFS scheduler weight. Under contention, containers get CPU time roughly in proportion to their requests. With no contention a container can use whatever is idle.
- The CPU **limit** is a hard quota per 100 ms period. A container that would use more is **throttled** — literally paused until the next period. It is never killed for CPU. Setting CPU limits too tight is a common and hard-to-diagnose cause of p99 latency: average CPU looks fine, but the container is being paused for milliseconds at a time during bursts. Many teams set CPU requests carefully and deliberately set **no CPU limit** (or a very generous one), relying on the request weights to share fairly.

## Memory: not compressible

Memory is **not compressible** — you cannot take a page back from a process without it losing data.

- The memory **request** is used only for scheduling and for eviction ranking. It does not reserve physical RAM in a way that prevents other containers from using it.
- The memory **limit** is enforced by the cgroup: when the container's usage exceeds it, the kernel's OOM-killer terminates a process in the cgroup — almost always the container's main process, so the container dies with **exit code 137** and reason **OOMKilled**, then restarts under its \`restartPolicy\`. There is no throttling for memory. A container that legitimately needs more memory than its limit will OOM-loop forever until the limit is raised.

## QoS classes

Kubernetes assigns each Pod a **Quality of Service class**, derived automatically from the shape of its containers' requests and limits. You do not set it directly.

- **Guaranteed** — *every* container in the Pod has both a CPU limit and a memory limit, and for each resource the limit equals the request. These Pods are the last to be evicted under node pressure and get the most favourable OOM score.
- **Burstable** — at least one container has a request or limit set, but the Pod does not meet the Guaranteed bar. This is the normal case for most workloads. Under memory pressure these are evicted after BestEffort, ranked by how far each Pod's usage exceeds its memory *request* — so a Pod well within its request is safer than one far above it.
- **BestEffort** — no container in the Pod sets any request or limit at all. First to be evicted, and first to be OOM-killed when the node is out of memory.

## Node pressure and eviction

When a node's available memory (or disk) drops below the kubelet's eviction threshold, the kubelet reclaims resources by **evicting Pods**, in QoS order: BestEffort first, then Burstable ordered by memory usage over request, Guaranteed last and only if unavoidable. An evicted Pod is deleted from that node and, if it is managed by a controller, recreated — and the scheduler will try to place it elsewhere. Eviction is node-level and pre-emptive; the per-container memory-limit OOM-kill is a separate, cgroup-level mechanism.

## Governing resources per namespace

- A **LimitRange** in a namespace sets default requests and limits for containers that omit them, and minimum and maximum bounds, so a team cannot ship Pods with no resources or with a 64 Gi memory request by mistake.
- A **ResourceQuota** caps the aggregate the namespace may consume — total CPU/memory requests, total limits, and object counts. Once a ResourceQuota for a resource exists, Pods in that namespace **must** specify that resource or they are rejected.

## The 12-factor connection

Requests and limits are how the 12-factor ideas about **disposability** and **concurrency** land in Kubernetes: processes are cheap, fast to start, and safe to kill (OOM-kill, eviction, rollout all assume this), and you scale by adding more identical Pods rather than growing one — which only works if each Pod's resource footprint is declared so the scheduler can pack them.`,

    contentHi: `## Request versus limit

Har container declare kar sakta hai, per resource, ek **request** aur ek **limit**.
- **request** ek reservation hai. Scheduler ek Pod ko ek node par sirf tab rakhta hai jab Pod ke container requests ka sum us node ki remaining allocatable capacity mein fit hota hai. Request wo bhi hai jiske against utilisation, cost allocation, autoscaling, aur eviction ranking sab measured hain. Ye ek cap *nahi* hai.
- **limit** ek hard ceiling hai jise Linux kernel cgroups ke through enforce karta hai. "Enforced" ka matlab resource par depend karta hai.

## CPU: compressible

CPU ek **compressible** resource hai — aap ek container ko iska kam de sakte ho ise destroy kiye bina, bas ise slow karke.
- CPU **request** ek CFS scheduler weight ban jaata hai. Contention ke tahat, containers ko CPU time lagbhag unke requests ke proportion mein milta hai.
- CPU **limit** ek hard quota hai per 100 ms period. Ek container jo zyada use karega **throttled** hai — literally paused agle period tak. Ise CPU ke liye kabhi kill nahi kiya jaata. CPU limits ko bahut tight set karna p99 latency ka ek common aur hard-to-diagnose kaaran hai. Kai teams CPU requests carefully set karte hain aur deliberately **koi CPU limit nahi** set karte.

## Memory: compressible nahi

Memory **compressible nahi** hai — aap ek process se ek page wapas nahi le sakte bina iske data khoye.
- Memory **request** sirf scheduling aur eviction ranking ke liye use hota hai.
- Memory **limit** cgroup dwara enforced hai: jab container ka usage ise exceed karta hai, kernel ka OOM-killer cgroup mein ek process ko terminate karta hai — lagbhag hamesha container ka main process, to container **exit code 137** aur reason **OOMKilled** ke saath marta hai, phir apne \`restartPolicy\` ke tahat restart hota hai. Memory ke liye koi throttling nahi hai.

## QoS classes

Kubernetes har Pod ko ek **Quality of Service class** assign karta hai, iske containers ke requests aur limits ke shape se automatically derived. Aap ise directly set nahi karte.
- **Guaranteed** — Pod mein *har* container ke paas ek CPU limit aur ek memory limit dono hain, aur har resource ke liye limit request ke barabar hai. Ye Pods node pressure ke tahat evict hone mein aakhiri hain.
- **Burstable** — kam se kam ek container ke paas ek request ya limit set hai, par Pod Guaranteed bar meet nahi karta. Ye zyadaatar workloads ke liye normal case hai. Memory pressure ke tahat ye BestEffort ke baad evicted hain, is baat se ranked ki har Pod ka usage iski memory *request* se kitna exceed karta hai.
- **BestEffort** — Pod mein koi container koi request ya limit bilkul set nahi karta. Evict hone mein pehla.

## Node pressure aur eviction

Jab ek node ki available memory (ya disk) kubelet ke eviction threshold se neeche girti hai, kubelet resources ko **Pods evict karke** reclaim karta hai, QoS order mein: pehle BestEffort, phir Burstable (memory usage over request se ordered), Guaranteed aakhiri. Ek evicted Pod us node se delete hota hai aur, agar ek controller dwara managed hai, recreate hota hai.

## Per namespace resources govern karna

- Ek namespace mein ek **LimitRange** un containers ke liye default requests aur limits set karta hai jo unhe omit karte hain, aur minimum aur maximum bounds.
- Ek **ResourceQuota** aggregate cap karta hai jo namespace consume kar sakta hai. Ek baar ek resource ke liye ek ResourceQuota exist karta hai, us namespace mein Pods ko us resource ko **specify karna chahiye** ya wo rejected hain.

## 12-factor connection

Requests aur limits wo tarika hain jisse **disposability** aur **concurrency** ke baare mein 12-factor ideas Kubernetes mein land karte hain: processes cheap, start hone mein tez, aur kill karne ke liye safe hain, aur aap ek ko grow karne ke bajaay zyada identical Pods add karke scale karte ho.`,

    examples: [
      {
        title: 'QoS class is derived automatically from the requests/limits shape',
        titleHi: 'QoS class requests/limits shape se automatically derived hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m8l6-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

cat <<YAML | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Pod
metadata: { name: guaranteed }
spec:
  containers: [ { name: c, image: busybox:1.36, command: [ sh, -c, "sleep 3600" ],
    resources: { requests: { cpu: 100m, memory: 64Mi }, limits: { cpu: 100m, memory: 64Mi } } } ]
---
apiVersion: v1
kind: Pod
metadata: { name: burstable }
spec:
  containers: [ { name: c, image: busybox:1.36, command: [ sh, -c, "sleep 3600" ],
    resources: { requests: { cpu: 50m, memory: 32Mi }, limits: { memory: 128Mi } } } ]
---
apiVersion: v1
kind: Pod
metadata: { name: besteffort }
spec:
  containers: [ { name: c, image: busybox:1.36, command: [ sh, -c, "sleep 3600" ] } ]
YAML
for p in guaranteed burstable besteffort; do kubectl -n "$ns" wait --for=condition=Ready pod/$p --timeout=90s >/dev/null; done

echo "--- Kubernetes derives a QoS class from the requests/limits shape ---"
for p in guaranteed burstable besteffort; do
  printf '  %-11s -> %s\\n' "$p" "$(kubectl -n "$ns" get pod $p -o jsonpath='{.status.qosClass}')"
done
echo
echo "  limits == requests on EVERY container  -> Guaranteed"
echo "  some request/limit set, not all equal  -> Burstable"
echo "  nothing set anywhere                   -> BestEffort  (evicted FIRST under node pressure)"`,
        output: `--- Kubernetes derives a QoS class from the requests/limits shape ---
  guaranteed  -> Guaranteed
  burstable   -> Burstable
  besteffort  -> BestEffort

  limits == requests on EVERY container  -> Guaranteed
  some request/limit set, not all equal  -> Burstable
  nothing set anywhere                   -> BestEffort  (evicted FIRST under node pressure)`,
        explain: 'Three Pods are created with deliberately different resource specs. The first sets both a CPU limit and a memory limit on its single container, and each limit exactly equals the corresponding request; Kubernetes reports its QoS class as Guaranteed. The second sets a memory request, a CPU request, and a memory limit, but no CPU limit and the memory limit does not equal the request, so it does not clear the Guaranteed bar and is classed as Burstable — which is where most real workloads land. The third sets no resources at all and is classed as BestEffort. Nothing in any manifest names a QoS class; the class is computed by the API server purely from the requests-and-limits shape. This matters because the class is the primary key the kubelet uses when a node runs short of memory: it evicts BestEffort Pods first, then Burstable ordered by how far each is above its memory request, and Guaranteed Pods last. So the difference between these three specs is also the difference in how likely each Pod is to survive a bad night on a busy node.',
        explainHi: 'Teen Pods jaan-boojhkar alag resource specs ke saath create hote hain. Pehla apne single container par ek CPU limit aur ek memory limit dono set karta hai, aur har limit corresponding request ke exactly barabar hai; Kubernetes iski QoS class Guaranteed report karta hai. Doosra ek memory request, ek CPU request, aur ek memory limit set karta hai, par koi CPU limit nahi aur memory limit request ke barabar nahi, to ye Guaranteed bar clear nahi karta aur Burstable classed hai — jahan zyadaatar real workloads land karte hain. Teesra koi resources bilkul set nahi karta aur BestEffort classed hai. Kisi manifest mein kuch bhi ek QoS class name nahi karta; class API server dwara purely requests-and-limits shape se computed hai. Ye matter karta hai kyunki class primary key hai jo kubelet use karta hai jab ek node memory mein short chalta hai.',
      },
      {
        title: 'Over the memory limit: OOMKilled (exit 137). CPU over limit would only throttle',
        titleHi: 'Memory limit ke upar: OOMKilled (exit 137). CPU over limit sirf throttle karta',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m8l6b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

# the process tries to allocate ~150Mi but the container's memory LIMIT is 64Mi
cat <<YAML | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: v1
kind: Pod
metadata: { name: hog }
spec:
  restartPolicy: Never
  containers:
    - name: c
      image: python:3.12-alpine
      command: [ "python", "-c", "x = bytearray(150*1024*1024); import time; time.sleep(300)" ]
      resources:
        requests: { memory: 32Mi }
        limits:   { memory: 64Mi }
YAML

for i in $(seq 1 40); do
  reason=$(kubectl -n "$ns" get pod hog -o jsonpath='{.status.containerStatuses[0].state.terminated.reason}' 2>/dev/null)
  [ -n "$reason" ] && break
  sleep 2
done
echo "memory limit 64Mi, the process tried to allocate 150Mi:"
echo "  terminated.reason  = $reason"
echo "  exitCode           = $(kubectl -n "$ns" get pod hog -o jsonpath='{.status.containerStatuses[0].state.terminated.exitCode}')"
echo
echo "  -> the kernel cgroup OOM-killer enforced the LIMIT. a memory limit is a HARD ceiling."
echo "  -> a CPU limit is different: it THROTTLES the container (pauses it per 100ms window), never kills it."`,
        output: `memory limit 64Mi, the process tried to allocate 150Mi:
  terminated.reason  = OOMKilled
  exitCode           = 137

  -> the kernel cgroup OOM-killer enforced the LIMIT. a memory limit is a HARD ceiling.
  -> a CPU limit is different: it THROTTLES the container (pauses it per 100ms window), never kills it.`,
        explain: 'The container runs a Python process that immediately allocates a 150 MiB byte array, while the container\'s memory limit is set to 64 MiB. The allocation pushes the cgroup past its memory limit, and the Linux kernel\'s OOM-killer responds by terminating the process. Kubernetes records the container state as terminated with reason OOMKilled and exit code 137, which is the conventional 128 plus signal 9. With restartPolicy Never the Pod simply stops here; under a Deployment it would restart and, because the allocation happens again on every start, loop in CrashLoopBackOff until the limit is raised or the application is made to use less. The important contrast is with CPU. A CPU limit is enforced by throttling: a container that would exceed its per-period quota is paused until the next period and then resumes, so exceeding a CPU limit shows up as latency and reduced throughput, never as a kill. Memory has no equivalent — a page cannot be reclaimed from a process without data loss — so the only enforcement available for a memory limit is to kill the container.',
        explainHi: 'Container ek Python process chalata hai jo turant ek 150 MiB byte array allocate karta hai, jabki container ki memory limit 64 MiB set hai. Allocation cgroup ko iski memory limit ke aage push karta hai, aur Linux kernel ka OOM-killer process ko terminate karke respond karta hai. Kubernetes container state ko reason OOMKilled aur exit code 137 ke saath terminated record karta hai, jo conventional 128 plus signal 9 hai. restartPolicy Never ke saath Pod bas yahan ruk jaata hai; ek Deployment ke tahat ye restart hoga aur, kyunki allocation har start par dobara hota hai, limit raise hone tak CrashLoopBackOff mein loop karega. Important contrast CPU ke saath hai. Ek CPU limit throttling dwara enforced hai: ek container jo apna per-period quota exceed karega agle period tak paused hai aur phir resume hota hai. Memory ka koi equivalent nahi hai — ek page ek process se data loss ke bina reclaim nahi ho sakta — to ek memory limit ke liye available ekmatra enforcement container ko kill karna hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# setting CPU limits aggressively "to be safe"
resources:
  requests: { cpu: "100m" }
  limits:   { cpu: "200m" }        # "cap it so one Pod can't hog the node"
# the app is single-threaded and mostly idle, but every request does ~150ms of CPU work.
# under the 200m limit that's throttled: the container gets 20ms of CPU per 100ms window,
# so a 150ms burst is stretched across ~800ms of wall time. p50 looks fine, p99 is awful,
# and 'kubectl top' shows LOW average CPU — the throttling is invisible without cgroup metrics.`,
        right: `# set CPU REQUESTS accurately (for scheduling + fair sharing); be very cautious with CPU LIMITS:
resources:
  requests: { cpu: "200m", memory: "256Mi" }
  limits:   { memory: "256Mi" }         # memory limit YES (== request -> Guaranteed-ish)
  # no CPU limit, OR a generous one (e.g. 1-2 cores) for a latency-sensitive service
# CPU is compressible + the request is already a fair-share weight under contention.
# watch container_cpu_cfs_throttled_periods_total — if it's non-zero, your limit is hurting you.
# (exception: hard multi-tenant isolation, or predictable batch, where throttling is acceptable.)`,
        why: 'A CPU limit is enforced by the kernel as a quota per scheduling period: a container that would use more CPU than its limit allows within a period is paused for the remainder of that period. For a latency-sensitive service whose requests each need a short burst of CPU, a tight limit means those bursts are chopped up and spread across multiple periods, so tail latency rises sharply even though average CPU utilisation stays low and looks healthy in ordinary dashboards. The throttling is only visible in cgroup throttling metrics, so the cause is easy to miss. Because CPU is compressible and the CPU request already acts as a proportional weight when the node is contended, accurate requests are usually enough to share CPU fairly without a limit. The safer pattern is to set CPU requests to reflect real usage, set memory requests and limits (memory being the resource that actually needs a hard ceiling), and either omit the CPU limit or make it generous, while monitoring throttled-period metrics. Tight CPU limits are appropriate mainly for strict multi-tenant isolation or predictable batch work where added latency is acceptable.',
        whyHi: 'Ek CPU limit kernel dwara ek quota per scheduling period ke roop mein enforced hai: ek container jo ek period ke andar apni limit se zyada CPU use karega us period ke baaki ke liye paused hai. Ek latency-sensitive service jiski requests ko har ek ko CPU ka ek short burst chahiye, ek tight limit ka matlab wo bursts chopped up hain aur kai periods mein spread hain, to tail latency sharply badhti hai halaanki average CPU utilisation low rehta hai aur ordinary dashboards mein healthy dikhta hai. Throttling sirf cgroup throttling metrics mein visible hai. Kyunki CPU compressible hai aur CPU request pehle hi ek proportional weight ki tarah act karta hai jab node contended hai, accurate requests usually CPU ko fairly share karne ke liye kaafi hain bina ek limit ke. Safer pattern CPU requests ko real usage reflect karne ke liye set karna hai, memory requests aur limits set karna, aur ya to CPU limit omit karna ya ise generous banana.',
      },
      {
        wrong: `# no memory request -> BestEffort -> first to die, and it dies without warning
spec:
  containers:
    - name: worker
      image: myapp:1.0
      # no resources: block at all
# the Pod schedules fine (it "needs" nothing), runs fine for days, then one evening
# another Pod on the node spikes, the node hits its memory eviction threshold, and the
# kubelet evicts THIS Pod first because it's BestEffort — even though it was behaving.`,
        right: `# set at least memory request == limit on everything you care about (-> Guaranteed or safe Burstable):
resources:
  requests: { cpu: "100m", memory: "256Mi" }
  limits:   { memory: "256Mi" }          # memory limit == request
# now: the scheduler reserves real space for it, its OOM score is favourable, and under
# node pressure BestEffort/over-request Burstable Pods are evicted before it.
# use a LimitRange in the namespace so a forgotten 'resources:' block gets sane defaults
# instead of silently becoming BestEffort.`,
        why: 'A Pod whose containers declare no requests or limits at all is placed in the BestEffort QoS class. It schedules easily because it is recorded as needing nothing, and it runs normally as long as the node has spare memory, which hides the risk. But BestEffort is the first class the kubelet evicts when a node approaches its memory eviction threshold, regardless of whether that particular Pod was consuming much or misbehaving — the eviction order is by QoS class, not by fault. The result is a workload that appears fine for long periods and then is killed abruptly whenever any other Pod on its node causes memory pressure. Declaring at least a memory request, and ideally a memory limit equal to it, moves the Pod into Burstable or Guaranteed, causes the scheduler to reserve actual capacity for it, improves its OOM score, and places it behind BestEffort and over-request Burstable Pods in the eviction order. A LimitRange in the namespace ensures that a Pod submitted with no resources block receives sensible defaults rather than silently becoming BestEffort.',
        whyHi: 'Ek Pod jiske containers koi requests ya limits bilkul declare nahi karte BestEffort QoS class mein rakha jaata hai. Ye aasani se schedule hota hai kyunki ise kuch bhi nahi chahiye record kiya jaata hai, aur ye normally chalta hai jab tak node ke paas spare memory hai, jo risk ko chhupata hai. Par BestEffort pehli class hai jise kubelet evict karta hai jab ek node apne memory eviction threshold ke paas pahunchta hai, is baat ki parwah kiye bina ki wo particular Pod zyada consume kar raha tha ya misbehave kar raha tha. Result ek workload hai jo lambe periods ke liye theek dikhta hai aur phir abruptly killed hota hai jab bhi iske node par koi doosra Pod memory pressure causes karta hai. Kam se kam ek memory request declare karna Pod ko Burstable ya Guaranteed mein le jaata hai.',
      },
      {
        wrong: `# memory limit set well below real usage -> permanent OOM loop
resources:
  requests: { memory: "128Mi" }
  limits:   { memory: "128Mi" }
# the app's steady-state RSS is ~200Mi (heap + buffers + the runtime).
# it starts, allocates, hits 128Mi, gets OOMKilled (137), restarts, repeats FOREVER.
# 'kubectl get pod' shows CrashLoopBackOff; logs look normal right up to the kill.`,
        right: `# size the memory limit from OBSERVED usage + headroom, and know it's a hard wall:
#   1. run with a generous limit first; measure real RSS under load (kubectl top pod,
//      container_memory_working_set_bytes, a load test)
#   2. set limit = observed peak working set * ~1.5 (headroom for spikes, GC, fragmentation)
#   3. set request = typical working set (what the scheduler reserves)
#   4. for the JVM/Node/Go: also cap the RUNTIME heap BELOW the container limit
//      (-Xmx, --max-old-space-size, GOMEMLIMIT) so the runtime GCs instead of the kernel killing it
# a memory limit is not "advisory" — exceeding it by one page kills the container.`,
        why: 'Unlike a CPU limit, a memory limit has no soft-enforcement mode: when a container\'s working set exceeds it, the kernel OOM-killer terminates the process, and there is no throttling or backpressure that would let the application stay under the ceiling. If the limit is set below what the application actually needs in steady state, the container reaches the limit shortly after starting, is killed with exit code 137, restarts, allocates again, and repeats indefinitely, showing as CrashLoopBackOff with logs that look completely normal until each kill. The limit must therefore be derived from measured behaviour: run the workload under realistic load with a generous limit, observe the peak working set, and set the limit to that peak plus meaningful headroom for spikes, garbage collection, and allocator fragmentation, with the request set to typical usage. For managed runtimes it is also necessary to bound the runtime\'s own heap below the container limit — through -Xmx, --max-old-space-size, GOMEMLIMIT and similar — so that memory pressure triggers in-process garbage collection rather than an external kill.',
        whyHi: 'Ek CPU limit ke विपरीत, ek memory limit ka koi soft-enforcement mode nahi hai: jab ek container ka working set ise exceed karta hai, kernel OOM-killer process ko terminate karta hai, aur koi throttling ya backpressure nahi hai jo application ko ceiling ke neeche rehne de. Agar limit us se neeche set hai jo application actually steady state mein chahti hai, container start hone ke thodi der baad limit par pahunchta hai, exit code 137 ke saath killed hota hai, restart hota hai, dobara allocate karta hai, aur indefinitely repeat karta hai. Limit isliye measured behaviour se derived hona chahiye: workload ko realistic load ke tahat ek generous limit ke saath chalao, peak working set observe karo, aur limit ko us peak plus meaningful headroom par set karo. Managed runtimes ke liye runtime ke apne heap ko container limit ke neeche bound karna bhi zaroori hai — -Xmx, --max-old-space-size, GOMEMLIMIT ke through.',
      },
    ],

    realWorld: [
      {
        en: '**A p99 that was 8x the p50 with CPU "at 30%".** Every Pod had `cpu` limit `= request` for a tidy Guaranteed class. `container_cpu_cfs_throttled_seconds_total` was climbing constantly. Removing the CPU limits (keeping requests) cut p99 by 70% overnight; the node was never actually contended.',
        hi: '**Ek p99 jo p50 ka 8x tha CPU "30% par" ke saath.** Har Pod ke paas ek tidy Guaranteed class ke liye `cpu` limit `= request` tha. CPU limits hataane (requests rakhte hue) ne p99 ko 70% overnight kaata.',
      },
      {
        en: '**A nightly batch job that OOM-looped only on month-end** — its memory limit was sized from a normal day. Raised the limit, set `GOMEMLIMIT` to 90% of it so the Go runtime GC\'d harder under pressure, and it stopped dying.',
        hi: '**Ek nightly batch job jo sirf month-end par OOM-loop karta tha** — iski memory limit ek normal din se sized thi. Limit raise ki, `GOMEMLIMIT` ko iske 90% par set kiya.',
      },
      {
        en: '**A "stable" service evicted three times in one week** — no `resources:` block, so BestEffort. Every eviction traced to a *different* noisy neighbour. Adding `requests`/`limits` (→ Burstable, well within request) and a namespace `LimitRange` ended it.',
        hi: '**Ek "stable" service jo ek hafte mein teen baar evicted hui** — koi `resources:` block nahi, to BestEffort. Har eviction ek *alag* noisy neighbour se traced hui. `requests`/`limits` aur ek namespace `LimitRange` add karna.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a resource request and a resource limit, and how do CPU and memory limits differ in enforcement?',
        qHi: 'Ek resource request aur ek resource limit mein kya farak hai, aur CPU aur memory limits enforcement mein kaise alag hain?',
        a: 'A request is a reservation used by the scheduler: a Pod is only placed on a node if the sum of its containers\' requests fits in the node\'s remaining allocatable capacity, and the request is also the baseline that utilisation, cost, autoscaling, and eviction ranking are measured against. It is not a cap — a container may use more than its request when the node has spare capacity. A limit is a hard ceiling enforced by the kernel through cgroups, and what enforcement means depends on the resource. CPU is compressible: the CPU request acts as a scheduling weight so that under contention containers get CPU roughly in proportion to their requests, and the CPU limit is a quota per scheduling period — a container that would exceed it is throttled, meaning paused until the next period, and never killed. Exceeding a CPU limit therefore shows up as latency, not failure. Memory is not compressible: the memory request is used only for scheduling and eviction ranking, and the memory limit is enforced by the cgroup OOM-killer, which terminates the container when its working set exceeds the limit, so the container dies with exit code 137 and reason OOMKilled and then restarts. There is no throttling for memory; the only enforcement is the kill.',
        aHi: 'Ek request scheduler dwara use ki jaane wali ek reservation hai: ek Pod ek node par sirf tab rakha jaata hai jab iske containers ke requests ka sum node ki remaining allocatable capacity mein fit hota hai, aur request wo baseline bhi hai jiske against utilisation, cost, autoscaling, aur eviction ranking measured hain. Ye ek cap nahi hai. Ek limit ek hard ceiling hai jise kernel cgroups ke through enforce karta hai. CPU compressible hai: CPU request ek scheduling weight ki tarah act karta hai, aur CPU limit ek quota per scheduling period hai — ek container jo ise exceed karega throttled hai, matlab agle period tak paused, aur kabhi killed nahi. Memory compressible nahi hai: memory limit cgroup OOM-killer dwara enforced hai, jo container ko terminate karta hai jab iska working set limit exceed karta hai, to container exit code 137 aur reason OOMKilled ke saath marta hai. Memory ke liye koi throttling nahi hai.',
      },
      {
        q: 'How are QoS classes determined, and how do they affect what happens under node memory pressure?',
        qHi: 'QoS classes kaise determine hoti hain, aur wo node memory pressure ke tahat kya hota hai ise kaise affect karti hain?',
        a: 'The QoS class is computed automatically from the shape of a Pod\'s requests and limits; it is never set directly. A Pod is Guaranteed only if every container has both a CPU limit and a memory limit and, for each resource, the limit equals the request. A Pod is BestEffort only if no container sets any request or limit at all. Everything in between — at least one request or limit somewhere, but not meeting the Guaranteed bar — is Burstable, which is where most workloads sit. Under node memory pressure, when available memory drops below the kubelet\'s eviction threshold, the kubelet reclaims memory by evicting Pods in QoS order: BestEffort Pods first, then Burstable Pods ordered by how far each Pod\'s memory usage exceeds its memory request, and Guaranteed Pods last and only if there is no other option. So a Burstable Pod comfortably within its memory request is relatively safe, while one running well above its request is an early eviction candidate. This is separate from the per-container memory-limit OOM-kill, which is a cgroup mechanism triggered by one container exceeding its own limit rather than by node-level pressure. The practical implication is that declaring accurate requests, and a memory limit equal to the request for important workloads, materially changes their survival odds on a busy node.',
        aHi: 'QoS class ek Pod ke requests aur limits ke shape se automatically computed hai; ye kabhi directly set nahi ki jaati. Ek Pod Guaranteed hai sirf tab jab har container ke paas ek CPU limit aur ek memory limit dono hain aur, har resource ke liye, limit request ke barabar hai. Ek Pod BestEffort hai sirf tab jab koi container koi request ya limit bilkul set nahi karta. Beech mein sab kuch Burstable hai, jahan zyadaatar workloads baithte hain. Node memory pressure ke tahat, jab available memory kubelet ke eviction threshold se neeche girti hai, kubelet Pods ko QoS order mein evict karke memory reclaim karta hai: pehle BestEffort Pods, phir Burstable Pods is baat se ordered ki har Pod ka memory usage iski memory request se kitna exceed karta hai, aur Guaranteed Pods aakhiri. Ye per-container memory-limit OOM-kill se alag hai, jo ek cgroup mechanism hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain request vs limit, and then explain precisely how CPU and memory limits differ in what happens when a container exceeds them.',
        taskHi: 'Ek comment mein, request vs limit samjhao, aur phir CPU aur memory limits ke farak ko samjhao.',
        hint: 'REQUEST = a RESERVATION. The scheduler places a Pod on a node ONLY if the sum of its containers\' requests fits the node\'s remaining allocatable capacity. The request is also the baseline for utilisation, cost allocation, autoscaling, and eviction ranking. It is NOT a cap — a container may use more if the node has spare. LIMIT = a HARD CEILING enforced by the Linux kernel via cgroups. CPU (COMPRESSIBLE): request → a CFS scheduler weight (under contention, CPU time is shared ~in proportion to requests); limit → a quota per 100ms period — a container that would exceed it is THROTTLED (paused until the next period), NEVER killed. Over-tight CPU limits → tail-latency (p99) damage that is invisible in average-CPU dashboards (only `container_cpu_cfs_throttled_*` shows it). MEMORY (NOT COMPRESSIBLE): request → scheduling + eviction ranking only; limit → the cgroup OOM-killer TERMINATES the container when its working set exceeds it → exit code 137, reason `OOMKilled`, then restart per `restartPolicy`. No throttling exists for memory — a limit set below real steady-state usage → a permanent OOM loop (`CrashLoopBackOff`). Size memory limits from OBSERVED peak working set + ~50% headroom, and cap the runtime heap (`-Xmx` / `--max-old-space-size` / `GOMEMLIMIT`) BELOW the container limit.',
        hintHi: 'REQUEST = ek RESERVATION. Scheduler ek Pod ko ek node par SIRF tab rakhta hai jab iske containers ke requests ka sum node ki remaining allocatable capacity mein fit hota hai. Ye ek cap NAHI hai. LIMIT = ek HARD CEILING jise Linux kernel cgroups ke through enforce karta hai. CPU (COMPRESSIBLE): request → ek CFS scheduler weight; limit → ek quota per 100ms period — ek container jo ise exceed karega THROTTLED hai, KABHI killed nahi. Over-tight CPU limits → tail-latency (p99) damage jo average-CPU dashboards mein invisible hai. MEMORY (COMPRESSIBLE NAHI): request → scheduling + eviction ranking; limit → cgroup OOM-killer container ko TERMINATE karta hai → exit code 137, reason `OOMKilled`, phir restart. Memory ke liye koi throttling nahi — real usage se neeche set ek limit → ek permanent OOM loop.',
      },
      {
        task: 'In a comment, state the exact rule for each of the three QoS classes and describe the kubelet\'s eviction order under node memory pressure.',
        taskHi: 'Ek comment mein, teen QoS classes mein se har ek ke liye exact rule batao.',
        hint: 'The QoS class is COMPUTED by the API server from the requests/limits shape — never set directly. GUARANTEED: EVERY container in the Pod has BOTH a cpu limit AND a memory limit, AND for each resource limit == request. BESTEFFORT: NO container sets ANY request or limit at all. BURSTABLE: everything else — at least one request/limit is set somewhere, but the Pod doesn\'t clear the Guaranteed bar (the common case for real workloads). EVICTION ORDER under node memory pressure (available memory < the kubelet\'s eviction threshold): (1) BestEffort Pods first; (2) then Burstable Pods, ordered by how far each Pod\'s memory usage exceeds its memory REQUEST (a Pod within its request is safer than one far above); (3) Guaranteed Pods last, only if unavoidable. Evicted Pods are deleted from the node and recreated by their controller, then re-scheduled elsewhere if they fit. NOTE: this node-level eviction is SEPARATE from the per-container memory-limit OOM-kill (a cgroup mechanism triggered by one container exceeding its own limit). Practical upshot: accurate requests + `memory limit == request` on important workloads materially improves their odds of surviving a busy node.',
        hintHi: 'QoS class API server dwara requests/limits shape se COMPUTED hai — kabhi directly set nahi ki jaati. GUARANTEED: Pod mein HAR container ke paas ek cpu limit AUR ek memory limit DONO hain, AUR har resource ke liye limit == request. BESTEFFORT: KOI container KOI request ya limit bilkul set nahi karta. BURSTABLE: baaki sab kuch. EVICTION ORDER node memory pressure ke tahat: (1) pehle BestEffort Pods; (2) phir Burstable Pods, is baat se ordered ki har Pod ka memory usage iski memory REQUEST se kitna exceed karta hai; (3) Guaranteed Pods aakhiri. Ye node-level eviction per-container memory-limit OOM-kill se ALAG hai.',
      },
      {
        task: 'In a comment, explain why setting a CPU limit equal to the CPU request (to get a Guaranteed Pod) can be a mistake for a latency-sensitive service, and what to do instead.',
        taskHi: 'Ek comment mein, samjhao ki CPU limit ko CPU request ke barabar set karna ek latency-sensitive service ke liye ek mistake kyun ho sakta hai.',
        hint: 'To make a Pod GUARANTEED you need `limit == request` for BOTH cpu and memory on EVERY container. Doing that for CPU on a latency-sensitive service is often harmful: the CPU limit is a quota per 100ms period, so if each request needs a short CPU BURST (say 150ms of work), a tight limit (say 200m = 20ms per 100ms window) means that burst is chopped across ~8 windows → ~800ms wall time. p50 can look fine, p99 blows up, and `kubectl top` shows LOW average CPU — the throttling is invisible without `container_cpu_cfs_throttled_periods_total` / `_seconds_total`. WHY it\'s usually safe to skip the CPU limit: CPU is COMPRESSIBLE and the CPU REQUEST already acts as a proportional fair-share weight under contention. INSTEAD: set CPU REQUESTS accurately (scheduling + fair sharing); set memory request AND limit (memory is the resource that genuinely needs a hard wall); OMIT the CPU limit or make it generous (1-2 cores) for latency-sensitive services; monitor the CFS throttled metric. EXCEPTIONS where a CPU limit is fine: hard multi-tenant isolation, or predictable batch work where extra latency is acceptable.',
        hintHi: 'Ek Pod ko GUARANTEED banane ke liye aapko HAR container par cpu aur memory DONO ke liye `limit == request` chahiye. CPU ke liye ek latency-sensitive service par ye karna often harmful hai: CPU limit ek quota per 100ms period hai, to agar har request ko ek short CPU BURST chahiye, ek tight limit ka matlab wo burst kai windows mein chopped hai → zyada wall time. p50 theek dikh sakta hai, p99 blow up hota hai, aur `kubectl top` LOW average CPU dikhata hai. CPU COMPRESSIBLE hai aur CPU REQUEST pehle hi ek proportional fair-share weight ki tarah act karta hai. INSTEAD: CPU REQUESTS accurately set karo; memory request AUR limit set karo; CPU limit OMIT karo ya generous banao; CFS throttled metric monitor karo.',
      },
    ],

    keyTakeaways: [
      'REQUEST = a reservation. The scheduler places a Pod on a node ONLY if the sum of its containers\' requests fits the node\'s remaining allocatable capacity; the request is also the baseline for utilisation, cost, autoscaling and eviction ranking. It is NOT a cap. LIMIT = a hard ceiling enforced by the Linux kernel via cgroups — what "enforced" means depends on the resource.',
      'CPU is COMPRESSIBLE: request → a CFS scheduler weight (under contention, CPU is shared ~in proportion to requests); limit → a quota per 100ms period, a container over it is THROTTLED (paused till next period), NEVER killed. Over-tight CPU limits cause p99 latency damage that is INVISIBLE in average-CPU dashboards (only `container_cpu_cfs_throttled_*` reveals it) — many teams set CPU requests carefully and NO CPU limit (or a generous one). MEMORY is NOT COMPRESSIBLE: request → scheduling + eviction ranking only; limit → the cgroup OOM-killer TERMINATES the container (exit 137, reason `OOMKilled`, then restart). No throttling for memory; a limit below real steady-state usage → a permanent OOM loop. Size it from observed peak working set + headroom, and cap the runtime heap (`-Xmx`/`--max-old-space-size`/`GOMEMLIMIT`) BELOW the container limit.',
      'QoS CLASS is COMPUTED from the requests/limits shape, never set directly. GUARANTEED: EVERY container has BOTH a cpu limit AND a memory limit, AND limit == request for each. BESTEFFORT: NO container sets ANY request or limit. BURSTABLE: everything else (the common case). This is the key the kubelet uses under node memory pressure.',
      'NODE PRESSURE EVICTION (available memory < the kubelet eviction threshold): the kubelet evicts Pods in QoS order — BestEffort FIRST, then Burstable ordered by how far each Pod is OVER its memory REQUEST, Guaranteed LAST and only if unavoidable. Evicted Pods are deleted + recreated by their controller + rescheduled if they fit. This node-level eviction is SEPARATE from the per-container memory-limit OOM-kill (a cgroup mechanism). Accurate requests + `memory limit == request` on important workloads materially improves survival odds.',
      'GOVERNANCE: a LIMITRANGE (per-namespace) sets default requests/limits for containers that omit them + min/max bounds — so a forgotten `resources:` block gets sane defaults instead of silently becoming BestEffort. A RESOURCEQUOTA caps the namespace\'s aggregate requests/limits + object counts; once a quota for a resource exists, Pods MUST specify that resource or they are rejected. 12-FACTOR TIE-IN: requests/limits are how disposability (cheap, fast-starting, safely-killable processes — OOM-kill/eviction/rollout all assume this) and concurrency (scale out with identical Pods, not up) actually work — the scheduler can only pack Pods whose footprint is declared.',
    ],
    keyTakeawaysHi: [
      'REQUEST = ek reservation. Scheduler ek Pod ko ek node par SIRF tab rakhta hai jab iske containers ke requests ka sum node ki remaining allocatable capacity mein fit hota hai; request utilisation, cost, autoscaling aur eviction ranking ke liye baseline bhi hai. Ye ek cap NAHI hai. LIMIT = ek hard ceiling jise Linux kernel cgroups ke through enforce karta hai.',
      'CPU COMPRESSIBLE hai: request → ek CFS scheduler weight; limit → ek quota per 100ms period, ise exceed karne wala container THROTTLED hai, KABHI killed nahi. Over-tight CPU limits p99 latency damage causes karte hain jo average-CPU dashboards mein INVISIBLE hai. MEMORY COMPRESSIBLE NAHI: request → sirf scheduling + eviction ranking; limit → cgroup OOM-killer container ko TERMINATE karta hai (exit 137, reason `OOMKilled`, phir restart). Memory ke liye koi throttling nahi; real usage se neeche ek limit → ek permanent OOM loop. Ise observed peak working set + headroom se size karo, aur runtime heap ko container limit ke NEECHE cap karo.',
      'QoS CLASS requests/limits shape se COMPUTED hai, kabhi directly set nahi. GUARANTEED: HAR container ke paas ek cpu limit AUR ek memory limit DONO, AUR har ke liye limit == request. BESTEFFORT: KOI container KOI request ya limit set nahi karta. BURSTABLE: baaki sab (common case).',
      'NODE PRESSURE EVICTION: kubelet Pods ko QoS order mein evict karta hai — pehle BestEffort, phir Burstable is baat se ordered ki har Pod apni memory REQUEST se kitna OVER hai, Guaranteed AAKHIRI. Ye node-level eviction per-container memory-limit OOM-kill se ALAG hai. Accurate requests + important workloads par `memory limit == request` survival odds ko materially improve karta hai.',
      'GOVERNANCE: ek LIMITRANGE (per-namespace) un containers ke liye default requests/limits set karta hai jo unhe omit karte hain + min/max bounds. Ek RESOURCEQUOTA namespace ke aggregate requests/limits + object counts cap karta hai; ek baar ek resource ke liye ek quota exist karta hai, Pods ko us resource ko specify KARNA CHAHIYE ya wo rejected hain. 12-FACTOR: requests/limits wo tarika hain jisse disposability aur concurrency actually kaam karte hain.',
    ],
  },
];
