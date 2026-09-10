import type { CourseLesson } from './course-js-module1';

// DevOps Module 19 — DevSecOps: Secrets, Identity & Runtime Hardening (part 1 of 2). L4-6 in course-devops-module19-part2.ts.
// `# VERIFY` examples run against REAL tools, offline:
//   vault v2.1.0  - `vault server -dev` on a random port + KV v2, ACL policies, token TTLs, the transit engine
//   sops  v3.13.3 + age v1.2.1 - encrypt/decrypt a k8s Secret manifest with an age key (L4)
// L1 (the anti-patterns) and L5/L6 (workload identity, runtime hardening + breach IR) are prose + realistic output.

export const DEVOPS_MODULE_19: CourseLesson[] = [
  {
    slug: 'ops-secrets-never-in-git-images-or-plaintext-env',
    title: 'Secrets: Never in Git, Images, or Plaintext Env',
    titleHi: 'Secrets: Kabhi Git, Images, Ya Plaintext Env Mein Nahi',
    description:
      'A secret is any value that grants access — a password, an API key, a token, a private key, a connection string. This lesson is about where secrets must not live: committed to git (where history is forever), baked into an image layer (where a "deleted" secret is still recoverable), passed as a plaintext environment variable (visible to every process and often logged), or printed to a build log. It covers the secret lifecycle, the "twelve-factor" nuance, and what to do when one leaks.',
    descriptionHi:
      'Ek secret koi bhi value hai jо access grant karती hai — ek password, ek API key, ek token, ek private key, ek connection string. Ye lesson iske baare mein hai ki secrets kahaan nahi rehने chahिए: git mein committed (jahaan history hamesha ke liye hai), ek image layer mein baked (jahaan ek "deleted" secret abhi bhi recoverable hai), ek plaintext environment variable ke roop mein passed (har process ko visible aur aksar logged), ya ek build log mein printed. Ye secret lifecycle cover karता hai, "twelve-factor" nuance, aur jab ek leak hota hai to kya karna.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**House keys.** You would not tape a spare key to the front door, write the alarm code on the door in marker, or mail a copy of the key to everyone who has ever visited. But committing a secret to git tapes it to the door for anyone who clones the repo; baking it into an image layer writes it on the door in a way that survives painting over it; and a plaintext environment variable is a key left on the hall table where every person and pet in the house can pick it up, and where the cleaner writes down everything on the table in their notebook. The safe version is a key safe with a code: the key lives in one controlled place, you fetch it when you need to open the door, access is logged, and you can change the code without re-cutting every key in circulation.',
      hi: '**Ghar ki keys.** Aap ek spare key front door par tape nahi karोge, alarm code door par marker se nahi likhोge, ya har visitor ko key ki ek copy mail nahi karोge. Par ek secret ko git mein commit karना ise repo clone karने wale kisi bhi vyakti ke liye door par tape kar deता hai; ise ek image layer mein bake karना ise door par ek tarah likhता hai jо iske upar paint karने se survive karता hai; aur ek plaintext environment variable ek key hai jо hall table par chhoड़ी gayi hai jahaan ghar mein har vyakti aur pet ise utha sakта hai, aur jahaan cleaner table par sab kुछ apni notebook mein likh leता hai. Safe version ek code ke saath ek key safe hai: key ek controlled jagah mein rehती hai, aap ise fetch karते ho jab aapko door kholना ho, access logged hai, aur aap code change kar sakते ho bina circulation mein har key ko re-cut kiye.',
    },

    simple: `**A SECRET = any value that grants access.** password, API key, token, private
key, DB connection string, webhook signing secret, cloud credentials, a TLS key.

**WHERE SECRETS MUST NOT LIVE:**
\`\`\`
GIT              committed once = in history FOREVER. \`git rm\` doesn't help - it's
                 in every clone, fork, the reflog, PR "files changed", CI cache.
                 public repo -> scraped by bots in SECONDS. (this is Lesson M18-L3.)
IMAGE LAYER      \`COPY .env\` then \`RUN rm .env\` in a later layer = the .env is STILL
                 in the earlier layer. \`docker history\` / extract the tar -> there it is.
                 same for a secret in an \`ENV\` or \`ARG\` line.
PLAINTEXT ENV    visible to: every process in the container (\`/proc/1/environ\`), every
                 \`docker inspect\` / \`kubectl describe pod\`, crash dumps, and any code
                 that logs \`process.env\` / does \`env | ...\`. NOT encrypted anywhere.
BUILD / APP LOGS \`echo $TOKEN\`, a stack trace with the connection string, a debug
                 log of the request headers. logs get shipped, indexed, retained, shared.
CONFIG FILES IN THE REPO   \`config/production.yml\` with the real password. same as git.
CLIENT-SIDE      anything in a browser bundle, a mobile app binary, or a public JS file.
\`\`\`

**WHERE SECRETS SHOULD LIVE — a secrets manager (Lesson 2):**
\`\`\`
HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault.
the app holds NO secret at rest. at startup (or per-request) it AUTHENTICATES with
a workload identity (Lesson 5) and FETCHES the secret over TLS. the manager:
  - encrypts at rest, controls access by policy, LOGS every read,
  - supports versioning + rotation without redeploying the app,
  - can issue DYNAMIC, short-lived secrets (Lesson 3).
\`\`\`

**THE "TWELVE-FACTOR" NUANCE — "config in the environment" ≠ "secrets in plaintext env vars":**
\`\`\`
the 12-factor app says config (incl. secrets) should come from the environment, NOT
be hardcoded. that is right. it does NOT mean "put the raw secret in a \`.env\` file
committed to the repo" or "set it as a literal in the k8s Deployment YAML".
modern practice: the environment variable holds a REFERENCE the platform resolves
from a manager at launch (\`valueFrom: secretKeyRef\`, an injected file, an init
sidecar), or the app fetches directly. the secret is in the env of the RUNNING
process only, never in a file, an image, or a repo.
\`\`\`

**IF A SECRET LEAKS (recap from M18-L3, it bears repeating):**
\`\`\`
1. ROTATE the credential NOW. assume it is compromised the instant it was exposed.
2. check audit logs for use of the old one since exposure.
3. THEN purge it from history / images / logs (stops re-discovery, not the exposure).
4. move it to a manager so it can't happen again. add secret scanning (M18-L3).
\`\`\``,

    simpleHi: `**EK SECRET = koi bhi value jо access grant karती hai.** password, API key, token,
private key, DB connection string, webhook signing secret, cloud credentials, ek TLS key.

**SECRETS KAHAAN NAHI REHNE CHAHIYE:**
\`\`\`
GIT              ek baar committed = history mein HAMESHA ke liye. \`git rm\` madad
                 nahi karता - ye har clone, fork, reflog, PR "files changed", CI cache mein hai.
                 public repo -> bots dwara SECONDS mein scraped. (ye M18-L3 hai.)
IMAGE LAYER      \`COPY .env\` phir ek later layer mein \`RUN rm .env\` = .env abhi bhi
                 earlier layer mein hai. \`docker history\` / tar extract -> wahaan hai.
PLAINTEXT ENV    visible: container mein har process ko (\`/proc/1/environ\`), har
                 \`docker inspect\` / \`kubectl describe pod\`, crash dumps, aur koi bhi code
                 jо \`process.env\` log karता hai. KAHIN encrypted NAHI.
BUILD / APP LOGS \`echo $TOKEN\`, connection string wala ek stack trace, request headers
                 ka ek debug log. logs shipped, indexed, retained, shared hote hain.
REPO MEIN CONFIG FILES   \`config/production.yml\` real password ke saath. git jaisा hi.
CLIENT-SIDE      ek browser bundle, ek mobile app binary, ya ek public JS file mein kuch bhi.
\`\`\`

**SECRETS KAHAAN REHNE CHAHIYE — ek secrets manager (Lesson 2):**
\`\`\`
HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault.
app ke paas at rest KOI secret nahi. startup par (ya per-request) ye ek workload
identity (Lesson 5) se AUTHENTICATE karता hai aur secret ko TLS par FETCH karता hai. manager:
  - at rest encrypt karता hai, access ko policy se control karता hai, har read LOG karता hai,
  - versioning + rotation support karता hai bina app redeploy kiye,
  - DYNAMIC, short-lived secrets issue kar sakта hai (Lesson 3).
\`\`\`

**"TWELVE-FACTOR" NUANCE — "config in the environment" ≠ "plaintext env vars mein secrets":**
\`\`\`
12-factor app kehта hai config (secrets sahit) environment se aana chahिए, hardcoded
NAHI. wo sahi hai. iska matlab NAHI hai "raw secret ko ek \`.env\` file mein daalो jо
repo mein committed hai" ya "ise k8s Deployment YAML mein ek literal ke roop mein set karो".
modern practice: environment variable ek REFERENCE rakhता hai jise platform launch par
ek manager se resolve karता hai (\`valueFrom: secretKeyRef\`, ek injected file, ek init
sidecar), ya app directly fetch karता hai. secret sirf RUNNING process ke env mein hai.
\`\`\`

**AGAR EK SECRET LEAK HOTA HAI (M18-L3 se recap):**
\`\`\`
1. credential ko ABHI ROTATE karो. maan lो ye us instant compromised hai jab ye exposed hua.
2. exposure ke baad se purane ke use ke liye audit logs check karो.
3. PHIR ise history / images / logs se purge karो (re-discovery rोkता hai, exposure nahi).
4. ise ek manager mein move karो. secret scanning add karो (M18-L3).
\`\`\``,

    content: `## What counts as a secret

A secret is any value whose disclosure grants someone access they should not have: a database password, an API key, an OAuth token, a private signing or TLS key, a full connection string, a webhook signing secret, a set of cloud credentials. The defining property is that possession equals access — there is no second factor, no additional check — so a secret that is readable by the wrong party is already a breach in waiting. The rest of this lesson is about the places a secret ends up by accident and why each one is unsafe.

## Git

Committing a secret to a repository puts it in the history permanently. Removing it in a later commit, or force-pushing over it, does not undo this: the object still exists in every existing clone and fork, in the reflog, in the pull request\'s recorded diff, and in CI caches, and platform APIs can still serve the old commit. For a public repository the exposure is effectively instant — automated scrapers watch the public commit stream and test new credentials within seconds to minutes. This is the same material as Module 18 Lesson 3, and the response is the same: rotate first, purge second.

## Image layers

A container image is a stack of layers, and each layer is immutable. If a Dockerfile does \`COPY .env /app/\` in one instruction and \`RUN rm /app/.env\` in a later one, the final running container does not show the file — but the layer that added it is still in the image, and anyone who pulls the image can list the layers with \`docker history\` or simply extract the layer tarballs and read the file. The same is true of a secret written into an \`ENV\` or \`ARG\` instruction: it is visible in the image metadata forever. Build-time secrets need a mechanism that does not persist into a layer — BuildKit\'s \`--mount=type=secret\`, which makes the secret available to a single \`RUN\` step without writing it to the layer — and runtime secrets should never be in the image at all.

## Plaintext environment variables

Setting a secret as a plaintext environment variable is common and is much weaker than it feels. The value is readable by every process in the container through \`/proc/<pid>/environ\`, it appears in \`docker inspect\` and \`kubectl describe pod\` output, it is captured in core dumps and crash reports, and it is exposed by any code that logs \`process.env\` wholesale or runs \`env\` in a diagnostic path. It is not encrypted anywhere along the way. Environment variables are acceptable as the delivery mechanism only when the value placed there is resolved at launch from a secrets manager and exists solely in the memory of the running process — not when the literal secret is written into a Deployment manifest, a Compose file, or a committed \`.env\`.

## Logs

Logs are the most underestimated leak path because they are designed to be collected, indexed, retained for months, and shared with anyone debugging. A secret reaches the logs through an explicit \`echo $TOKEN\` in a script, a stack trace that includes a database connection string, a request-logging middleware that dumps headers including \`Authorization\`, or a debug statement someone left in. Once a secret is in a log aggregation system it has been copied to storage, replicated, and possibly forwarded to a third-party observability vendor, and removing it from all of those is far harder than preventing it. Scrub secrets from log output at the source, and configure logging libraries to redact known-sensitive keys.

## The twelve-factor nuance

The twelve-factor app methodology says configuration, including secrets, should come from the environment rather than being hardcoded in the source. That guidance is correct and often misapplied. "From the environment" does not mean "in a \`.env\` file committed to the repository" or "as a literal string in the Kubernetes Deployment YAML" — both of those are just hardcoding in a different file. The modern interpretation is that the environment variable or config file the application reads contains a reference that the platform resolves at launch time from a secrets manager: a Kubernetes \`secretKeyRef\` backed by an external secret, a file mounted by a CSI secrets driver, an init container or sidecar that fetches and writes the value, or the application authenticating to the manager and fetching directly. The secret exists in the environment of the running process and nowhere else — not in a file on disk, not in an image, not in a repository.

## When a secret leaks

The response, repeated from Module 18 because it is the part people get wrong: rotate the credential immediately, on the assumption that it is compromised from the moment it was exposed; check the relevant audit logs for any use of the old credential since exposure; then purge it from git history, image layers, and log stores, understanding that this step prevents re-discovery but does not undo the exposure; and move the secret into a manager so the same mistake cannot recur, adding secret scanning to the pre-commit hook and CI to catch the next attempt before it lands.`,

    contentHi: `## Kya ek secret counts karता hai

Ek secret koi bhi value hai jिska disclosure kisi ko access grant karता hai jо unhe nahi hona chahिए: ek database password, ek API key, ek OAuth token, ek private signing ya TLS key, ek full connection string, ek webhook signing secret, cloud credentials ka ek set. Defining property ye hai ki possession access ke barabar hai — koi second factor nahi, koi additional check nahi — to ek secret jо galat party dwara readable hai already ek breach in waiting hai.

## Git

Ek repository mein ek secret commit karना ise history mein permanently daal deता hai. Ise ek later commit mein remove karना, ya iske upar force-push karना, ise undo nahi karता: object abhi bhi har existing clone aur fork mein, reflog mein, pull request ke recorded diff mein, aur CI caches mein exist karता hai. Ek public repository ke liye exposure effectively instant hai. Ye Module 18 Lesson 3 ka same material hai, aur response same hai: pehle rotate karो, purge doosra.

## Image layers

Ek container image layers ka ek stack hai, aur har layer immutable hai. Agmar ek Dockerfile ek instruction mein \`COPY .env /app/\` karता hai aur ek later one mein \`RUN rm /app/.env\`, final running container file nahi dikhाता — par jо layer ise add karता hai wo abhi bhi image mein hai, aur jо bhi image pull karता hai layers ko \`docker history\` se list kar sakता hai ya simply layer tarballs extract karके file padh sakता hai. Build-time secrets ko ek mechanism chahिए jо ek layer mein persist nahi karता — BuildKit ka \`--mount=type=secret\` — aur runtime secrets kabhi image mein hone hi nahi chahिए.

## Plaintext environment variables

Ek secret ko ek plaintext environment variable ke roop mein set karना common hai aur jitna feel hoता hai usse kahीं weaker hai. Value container mein har process dwara \`/proc/<pid>/environ\` ke through readable hai, ye \`docker inspect\` aur \`kubectl describe pod\` output mein appear hoती hai, ye core dumps aur crash reports mein captured hai, aur ye kisi bhi code dwara exposed hai jо \`process.env\` wholesale log karता hai. Environment variables delivery mechanism ke roop mein sirf tab acceptable hain jab wahaan rakhी value launch par ek secrets manager se resolved hai.

## Logs

Logs sabse underestimated leak path hain kyunki wo collected, indexed, mahinon retained, aur kisi bhi debugging vyakti ke saath shared hone ke liye designed hain. Ek secret logs tak ek script mein ek explicit \`echo $TOKEN\` ke through pahunchता hai, ek stack trace jо ek database connection string include karता hai, ek request-logging middleware jо \`Authorization\` sahit headers dump karता hai. Ek baar ek secret ek log aggregation system mein hai ise storage mein copy kiya gaya hai. Source par log output se secrets scrub karो.

## Twelve-factor nuance

Twelve-factor app methodology kehती hai configuration, secrets sahit, environment se aana chahिए source mein hardcoded hone ke bजाy. Wo guidance correct hai aur aksar misapplied hai. "Environment se" ka matlab NAHI hai "repository mein committed ek \`.env\` file mein" ya "Kubernetes Deployment YAML mein ek literal string ke roop mein". Modern interpretation ye hai ki environment variable ya config file jо application padhती hai ek reference contain karता hai jise platform launch time par ek secrets manager se resolve karता hai. Secret running process ke environment mein exist karता hai aur kahीं nahi.

## Jab ek secret leak hota hai

Response, Module 18 se repeated: credential ko immediately rotate karो, is assumption par ki ye us moment se compromised hai jab ye exposed hua; relevant audit logs check karो; phir ise git history, image layers, aur log stores se purge karो, ye samajhते hue ki ye step re-discovery prevent karता hai par exposure undo nahi karता; aur secret ko ek manager mein move karो.`,

    examples: [
      {
        title: 'Where a secret hides after you "removed" it: git history and image layers',
        titleHi: 'Ek secret kahaan chhupता hai jab aap ise "remove" karते ho: git history aur image layers',
        code: `# VERIFY
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null
export GIT_AUTHOR_NAME=d GIT_AUTHOR_EMAIL=d@e GIT_COMMITTER_NAME=d GIT_COMMITTER_EMAIL=d@e
export GIT_AUTHOR_DATE='2024-01-01T00:00:00Z' GIT_COMMITTER_DATE='2024-01-01T00:00:00Z'
root=$PWD; rm -rf demo; git init -q demo; cd demo

# commit 1: a secret goes in
SK="sk_live_"; SK="\${SK}abcdefghij0123456789ABCD"
printf 'STRIPE_KEY=%s\\n' "\$SK" > .env
git add .env && git commit -qm "add config"

# commit 2: "remove" the secret
git rm -q .env && echo ".env" > .gitignore && git add .gitignore
git commit -qm "remove secret, gitignore it"

echo "--- working tree: clean, no .env ---"
ls -a | grep -c '\\.env$' || true

echo "--- but git history still has it: ---"
git log --oneline --all | wc -l | sed 's/^/commits: /'
git show HEAD~1:.env | sed 's/=.*/=<REDACTED_FOR_OUTPUT>/'
echo "--- and 'git log -p' / any clone / the reflog can recover it ---"
git rev-list --all --objects | grep -c '\\.env' | sed 's/^/objects referencing .env: /'

echo ""
echo "--- image layers: a 'deleted' file is still in an earlier layer ---"
cd "\$root"; mkdir -p imgdemo/layerA imgdemo/layerB
echo "TOKEN=ghp_realtokenhere" > imgdemo/layerA/secret.txt      # layer A adds it
rm -f imgdemo/layerB/secret.txt                                 # layer B "removes" it (tombstone)
echo "layer A tar still contains:"; tar -C imgdemo/layerA -cf - . | tar -tf - | grep secret
echo "=> 'docker history <img>' + extracting layer A's tarball recovers TOKEN,"
echo "   even though the running container's filesystem shows nothing."`,
        output: `--- working tree: clean, no .env ---
0
--- but git history still has it: ---
commits: 2
STRIPE_KEY=<REDACTED_FOR_OUTPUT>
--- and 'git log -p' / any clone / the reflog can recover it ---
objects referencing .env: 1

--- image layers: a 'deleted' file is still in an earlier layer ---
layer A tar still contains:
./secret.txt
=> 'docker history <img>' + extracting layer A's tarball recovers TOKEN,
   even though the running container's filesystem shows nothing.`,
        explain: 'Two demonstrations of the same principle: "removing" a secret from the current state does not remove it from the history of states. In the git case, the first commit adds a \`.env\` containing a Stripe-shaped key, and the second commit deletes the file and adds a \`.gitignore\`. The working tree is now clean — \`ls\` finds no \`.env\` — but \`git show HEAD~1:.env\` retrieves the file directly from the parent commit, \`git rev-list --all --objects\` confirms the blob is still reachable, and anyone who cloned before the deletion, or who runs \`git log -p\`, has the full value. Purging it requires rewriting history with \`git filter-repo\` or BFG, and even that does not reach existing clones and forks. In the image case, layer A adds \`secret.txt\` and layer B represents a later instruction that deletes it; the deletion is a whitetout marker in layer B, but layer A\'s tarball still contains the file in full, so \`docker history\` plus extracting that layer recovers the token regardless of what the assembled container filesystem shows. In both cases the only safe assumption once a secret has been committed or built in is that it is compromised.',
        explainHi: 'Same principle ke do demonstrations: current state se ek secret "remove" karना ise states ki history se remove nahi karता. Git case mein, pehla commit ek Stripe-shaped key wala ek \`.env\` add karता hai, aur doosra commit file delete karता hai aur ek \`.gitignore\` add karता hai. Working tree ab clean hai — \`ls\` koi \`.env\` nahi paता — par \`git show HEAD~1:.env\` file ko directly parent commit se retrieve karता hai, \`git rev-list --all --objects\` confirm karता hai blob abhi bhi reachable hai, aur jisne bhi deletion se pehle clone kiya uske paas full value hai. Image case mein, layer A \`secret.txt\` add karता hai aur layer B ek later instruction represent karता hai jо ise delete karता hai; deletion layer B mein ek whiteout marker hai, par layer A ka tarball abhi bhi file poori tarah contain karता hai. Dono cases mein ekmatra safe assumption ye hai ki ek secret compromised hai jab ye committed ya built in ho gaya.',
      },
    ],

    mistakes: [
      {
        wrong: `# the secret is a literal in the Deployment YAML (checked into git)
  apiVersion: apps/v1
  kind: Deployment
  spec:
    template:
      spec:
        containers:
          - name: api
            env:
              - name: DATABASE_URL
                value: "postgres://app:S3cr3tP@ss@db.prod:5432/app"   # <-- literal
              - name: STRIPE_SECRET_KEY
                value: "sk_live_<the-real-24-char-key-here>"           # <-- literal
  # this file is in git (history forever), in every 'kubectl get deploy -o yaml',
  # in 'kubectl describe' (readable by anyone with get on Deployments), in the
  # cluster's audit log, and in any GitOps repo mirror. it is "in the environment"
  # in the worst possible way.`,
        right: `# the env var holds a REFERENCE the platform resolves from a manager
  env:
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef: { name: api-db, key: url }        # a k8s Secret...
    - name: STRIPE_SECRET_KEY
      valueFrom:
        secretKeyRef: { name: api-stripe, key: secret }
  # ...and the k8s Secret is NOT hand-written either - it's produced by the
  # External Secrets Operator from Vault / AWS Secrets Manager (Lesson 4):
  ---
  apiVersion: external-secrets.io/v1
  kind: ExternalSecret
  spec:
    secretStoreRef: { name: vault-backend, kind: ClusterSecretStore }
    target: { name: api-db }
    data:
      - secretKey: url
        remoteRef: { key: secret/data/prod/api, property: db_url }
  # git contains only the REFERENCE (path 'secret/data/prod/api'). the value lives
  # in Vault, is fetched over TLS by a workload identity, rotates without a redeploy,
  # and every read is in Vault's audit log.`,
        why: 'Putting the raw secret as a \`value:\` in a Deployment manifest satisfies the letter of "configuration comes from the environment" while violating its intent completely. That YAML file is committed to git, so the secret is in history forever with all the recovery paths that implies; it is returned by \`kubectl get deployment -o yaml\` to anyone with read access to Deployments, which is a much wider group than should see production database credentials; it is in the Kubernetes audit log; and if you run GitOps, it is mirrored into the GitOps repository as well. The correct structure keeps only a reference in git. The Deployment references a Kubernetes Secret by name and key, and the Secret itself is not authored by hand but generated by the External Secrets Operator, which authenticates to Vault or a cloud secrets manager and materialises the value from a path. What lives in version control is the path — \`secret/data/prod/api\` — which is not sensitive. The actual value is stored encrypted in the manager, fetched over TLS by a workload identity, rotated centrally without redeploying the application, and logged on every access.',
        whyHi: 'Ek Deployment manifest mein raw secret ko ek \`value:\` ke roop mein daalना "configuration environment se aati hai" ke letter ko satisfy karता hai jabki iske intent ko completely violate karता hai. Wo YAML file git mein committed hai, to secret history mein hamesha ke liye hai; ye \`kubectl get deployment -o yaml\` dwara Deployments par read access wale kisi bhi vyakti ko return kiya jaता hai; ye Kubernetes audit log mein hai. Correct structure git mein sirf ek reference rakhता hai. Deployment ek Kubernetes Secret ko name aur key se reference karता hai, aur Secret khud hand se authored nahi hai balki External Secrets Operator dwara generated hai, jо Vault ya ek cloud secrets manager se authenticate karता hai. Version control mein jо rehता hai wo path hai — \`secret/data/prod/api\` — jо sensitive nahi hai.',
      },
      {
        wrong: `# a request-logging middleware that dumps everything, including Authorization
  app.use((req, res, next) => {
    logger.info('incoming request', {
      method: req.method, path: req.path,
      headers: req.headers,          // <-- includes Authorization: Bearer <token>,
                                     //     Cookie: session=..., X-Api-Key: ...
      query: req.query,              // <-- ?api_key=... ?token=...
      body: req.body,               // <-- { password: "...", card_number: "..." }
    });
    next();
  });
  # every bearer token, session cookie, and API key that hits the service is now
  # in the log store - shipped to the aggregator, indexed, retained 90 days,
  # and visible to everyone with log access + the observability vendor.`,
        right: `# log what you need; redact known-sensitive fields at the source
  const REDACT = new Set(['authorization', 'cookie', 'x-api-key', 'set-cookie']);
  const safeHeaders = Object.fromEntries(
    Object.entries(req.headers).map(([k, v]) =>
      [k, REDACT.has(k.toLowerCase()) ? '[REDACTED]' : v]));
  app.use((req, res, next) => {
    logger.info('incoming request', {
      method: req.method, path: req.path,
      headers: safeHeaders,
      // query/body: log a whitelist of non-sensitive fields, or a hash, or nothing
    });
    next();
  });
  # + configure the logging library's built-in redaction (pino 'redact', winston
  #   format) as a backstop, + a log-pipeline scrubber (Fluent Bit / Vector) that
  #   drops known secret patterns before storage.`,
        why: 'Diagnostic logging that captures whole request objects is one of the most common ways secrets end up in a place they cannot be pulled back from. Request headers routinely carry an \`Authorization\` bearer token, a session cookie, or an API key; query strings sometimes carry a token; request bodies carry passwords and payment details. A middleware that logs \`req.headers\` wholesale copies all of that into the log stream, and once it reaches a log aggregation system it has been written to durable storage, replicated across nodes, indexed for search, retained according to policy for weeks or months, and in many setups forwarded to an external observability vendor — so a single logged bearer token is now in a dozen places, readable by everyone with log access. The fix is to redact at the source: maintain a set of known-sensitive header and field names and replace their values with a placeholder before logging, log only a whitelist of non-sensitive request fields, and add two backstops — the logging library\'s own redaction configuration, and a scrubbing stage in the log pipeline that drops known secret patterns before anything is stored.',
        whyHi: 'Diagnostic logging jо poore request objects capture karता hai un sabse common tareekon mein se ek hai jinse secrets ek aisी jagah end hote hain jahaan se unhe wapas nahi khींchа ja sakता. Request headers routinely ek \`Authorization\` bearer token, ek session cookie, ya ek API key carry karते hain; request bodies passwords aur payment details carry karते hain. Ek middleware jо \`req.headers\` wholesale log karता hai wo sab log stream mein copy karता hai, aur ek baar ye ek log aggregation system tak pahunchता hai ise durable storage mein likha gaya hai, nodes ke across replicated, search ke liye indexed, weeks ya months retained, aur aksar ek external observability vendor ko forwarded. Fix source par redact karना hai: known-sensitive header aur field names ka ek set maintain karो aur logging se pehle unki values ko ek placeholder se replace karो.',
      },
      {
        wrong: `# build-time secret baked into a layer via COPY / ENV / ARG
  # Dockerfile:
  ARG NPM_TOKEN                          # <-- passed with --build-arg NPM_TOKEN=...
  RUN echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > ~/.npmrc \\
   && npm ci \\
   && rm ~/.npmrc                        # <-- "cleaned up"
  # 'docker history --no-trunc <img>' shows the full RUN line WITH the token value
  # substituted in (ARG values are recorded). the rm doesn't help - the token is
  # in the image metadata AND the ~/.npmrc was in the layer before the rm.`,
        right: `# BuildKit secret mount: available to one RUN, never written to a layer
  # syntax=docker/dockerfile:1
  FROM node:20-slim
  COPY package*.json ./
  RUN --mount=type=secret,id=npmtoken \\
      NPM_TOKEN="$(cat /run/secrets/npmtoken)" \\
      sh -c 'echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > ~/.npmrc \\
             && npm ci \\
             && rm ~/.npmrc'
  # build:  DOCKER_BUILDKIT=1 docker build --secret id=npmtoken,env=NPM_TOKEN .
  # the token is mounted as a tmpfs file for the duration of that ONE RUN, is not
  # in any layer, not in 'docker history', not in the image metadata.
  # (runtime secrets, by contrast, never touch the image at all - Lesson 2.)`,
        why: 'Passing a build-time secret through \`ARG\` or writing it to a file with \`COPY\` or \`RUN echo\` bakes it into the image. \`ARG\` values are recorded in the image history, so \`docker history --no-trunc\` shows the \`RUN\` command with the token substituted in; and a file written in one \`RUN\` and deleted in the same or a later one still existed in the layer filesystem when that layer was committed, so it is recoverable from the layer tarball. Deleting the file is cosmetic. The correct mechanism for a secret that is needed only during the build — a private registry token, a license key for a compile step — is BuildKit\'s secret mount: \`RUN --mount=type=secret,id=...\` makes the secret available as a file under \`/run/secrets/\` for the duration of that single \`RUN\` instruction, backed by tmpfs, and it is never written into the layer, never recorded in the history, and never present in the final image. Runtime secrets are a separate concern and should not be in the image under any mechanism — they are fetched from a manager when the container starts.',
        whyHi: 'Ek build-time secret ko \`ARG\` ke through pass karना ya ise ek file mein \`COPY\` ya \`RUN echo\` se likhना ise image mein bake karता hai. \`ARG\` values image history mein recorded hain, to \`docker history --no-trunc\` \`RUN\` command ko token substituted ke saath dikhाता hai; aur ek file jо ek \`RUN\` mein likhी aur usi ya ek later one mein deleted abhi bhi layer filesystem mein existed jab wo layer committed hua. File delete karना cosmetic hai. Ek secret ke liye correct mechanism jо sirf build ke dauraan chahिए BuildKit ka secret mount hai: \`RUN --mount=type=secret,id=...\` secret ko us single \`RUN\` instruction ke duration ke liye \`/run/secrets/\` ke under ek file ke roop mein available banाता hai, tmpfs se backed, aur ye kabhi layer mein likha nahi jaता. Runtime secrets ek separate concern hain.',
      },
    ],

    realWorld: [
      {
        en: '**AWS keys in public Docker images** — repeated studies scanning Docker Hub find thousands of images with live AWS keys, private keys, and API tokens baked into layers, usually from a `COPY . .` that swept up a `.env` or `.aws/credentials`, or an `ENV AWS_SECRET_ACCESS_KEY=`. Many are recoverable even when a later layer "removed" them.',
        hi: '**Public Docker images mein AWS keys** — Docker Hub scan karने wali repeated studies hazaron images live AWS keys, private keys, aur API tokens ke saath layers mein baked paती hain, usually ek `COPY . .` se jisne ek `.env` ya `.aws/credentials` sweep kiya. Kई recoverable hain jab ek later layer ne unhe "removed" kiya.',
      },
      {
        en: '**Uber 2016** — attackers found AWS credentials in a private GitHub repo used by Uber engineers, and used them to access an S3 bucket with data on 57 million riders and drivers. The credentials should have been short-lived and fetched from a manager, not sitting in a repo.',
        hi: '**Uber 2016** — attackers ne Uber engineers dwara use kiye गए ek private GitHub repo mein AWS credentials paye, aur unhe 57 million riders aur drivers ke data wale ek S3 bucket tak access karने ke liye use kiya. Credentials short-lived aur ek manager se fetched hone chahिए the.',
      },
      {
        en: '**Logged bearer tokens at multiple SaaS vendors** — several companies (including a well-known auth provider and a payments company) have disclosed incidents where request-logging or error-tracking captured customer API tokens or session cookies into an internal log store or a third-party APM, requiring mass token rotation. The fix in every postmortem: redact at the source + a pipeline scrubber.',
        hi: '**Kई SaaS vendors par logged bearer tokens** — kई companies ne incidents disclose kiye hain jahaan request-logging ya error-tracking ne customer API tokens ya session cookies ko ek internal log store ya ek third-party APM mein capture kiya, mass token rotation require karता tha. Har postmortem mein fix: source par redact + ek pipeline scrubber.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is committing a secret to git a permanent problem even after you delete the file, and what is the correct response?',
        qHi: 'Ek secret ko git mein commit karна file delete karने ke baad bhi ek permanent problem kyun hai, aur correct response kya hai?',
        a: 'Git stores history as a chain of immutable commits, and a file you delete in a later commit still exists in full in the commit that added it. So after "removing" a secret, \`git show <old-commit>:path\` retrieves it directly, \`git log -p\` shows it in a diff, the blob is still reachable through \`git rev-list --all\`, and it sits in the reflog. Beyond your local copy, the object is in every clone and fork that was taken while it was present, in the pull request\'s recorded diff, in CI caches, and platform APIs can still serve the old commit. Force-pushing over it does not reach any of those. For a public repository the exposure is effectively immediate because automated scrapers watch the public commit stream and test new credentials within seconds to minutes. The correct response, in order: rotate the credential immediately on the assumption it is already compromised — revoke the old one, issue a new one, update wherever the app reads it; check the audit logs for the affected system for any use of the old credential since it was exposed; then rewrite history with \`git filter-repo\` or BFG to remove the object, coordinating a re-clone, while understanding that this prevents re-discovery and re-flagging but does not undo the exposure; and finally move the secret into a secrets manager and add pre-commit and CI secret scanning so it cannot happen again.',
        aHi: 'Git history ko immutable commits ki ek chain ke roop mein store karता hai, aur ek file jise aap ek later commit mein delete karते ho abhi bhi us commit mein poori tarah exist karती hai jisne ise add kiya. To ek secret "remove" karने ke baad, \`git show <old-commit>:path\` ise directly retrieve karता hai, \`git log -p\` ise ek diff mein dikhाता hai, blob abhi bhi reachable hai, aur ye reflog mein baithता hai. Aapki local copy ke aage, object har clone aur fork mein hai jо tab liya gaya jab ye present tha. Force-pushing un mein se kisi tak nahi pahunchता. Correct response, order mein: credential ko immediately rotate karो is assumption par ki ye already compromised hai; affected system ke audit logs check karो; phir history rewrite karो \`git filter-repo\` ya BFG se; aur finally secret ko ek secrets manager mein move karो aur pre-commit aur CI secret scanning add karो.',
      },
      {
        q: 'The twelve-factor app says config should come from the environment. Does that mean plaintext environment variables are the right place for secrets?',
        qHi: 'Twelve-factor app kehता hai config environment se aani chahिए. Kya iska matlab plaintext environment variables secrets ke liye sahi jagah hain?',
        a: 'No — that is a common misreading. The twelve-factor point is that configuration, including secrets, should not be hardcoded in the source code, so that the same build can run in different environments with different config. It is a statement about coupling, not an endorsement of any particular storage mechanism. Putting a raw secret in a \`.env\` file committed to the repository, or as a literal \`value:\` in a Kubernetes Deployment manifest, satisfies the words while breaking the intent — those are just hardcoding in a different file, with all the git-history and access-control problems that brings. A plaintext environment variable on the running process is also weaker than it appears: it is readable by every process in the container through \`/proc\`, shows up in \`docker inspect\` and \`kubectl describe\`, is captured in crash dumps, and leaks through any code that logs the environment. The modern interpretation is that the config the application reads contains a reference, and the platform resolves that reference at launch from a secrets manager: a Kubernetes \`secretKeyRef\` backed by an external secret, a file mounted by a CSI driver, an init container that fetches the value, or the app authenticating to the manager directly. The secret ends up in the memory of the running process and nowhere else — not in a file, not in an image, not in a repo.',
        aHi: 'Nahi — wo ek common misreading hai. Twelve-factor point ye hai ki configuration, secrets sahit, source code mein hardcoded nahi hona chahिए, taaki same build alag environments mein alag config ke saath run kar sake. Ye coupling ke baare mein ek statement hai, kisi particular storage mechanism ka endorsement nahi. Ek raw secret ko ek \`.env\` file mein daalना jо repository mein committed hai, ya ek Kubernetes Deployment manifest mein ek literal \`value:\` ke roop mein, words ko satisfy karता hai jabki intent ko break karता hai. Ek plaintext environment variable running process par bhi jitna appear hoता hai usse weaker hai. Modern interpretation ye hai ki config jо application padhती hai ek reference contain karता hai, aur platform us reference ko launch par ek secrets manager se resolve karता hai. Secret running process ki memory mein end hota hai aur kahीं nahi.',
      },
      {
        q: 'How do build-time secrets differ from runtime secrets, and how should each be handled in a container build?',
        qHi: 'Build-time secrets runtime secrets se kaise alag hain, aur ek container build mein har ek ko kaise handle karna chahिए?',
        a: 'A build-time secret is needed only while the image is being built — a token for a private package registry, a license key for a compilation step, credentials to fetch a proprietary dependency. A runtime secret is needed by the application while it runs — the database password, an API key for an upstream service. They must be handled completely differently. A build-time secret must not persist into any layer: passing it via \`ARG\` records it in the image history where \`docker history --no-trunc\` reveals it, and writing it to a file with \`RUN echo\` or \`COPY\` leaves it in the layer even if a later instruction deletes the file, because the file existed when that layer was committed. The correct mechanism is BuildKit\'s secret mount — \`RUN --mount=type=secret,id=x\` — which exposes the secret as a tmpfs-backed file under \`/run/secrets/\` for the duration of that one \`RUN\` and never writes it to a layer, records it in history, or includes it in the final image. A runtime secret should never be in the image at all, under any mechanism. It is fetched when the container starts — by an init container or sidecar that authenticates to a secrets manager and writes the value to a shared volume, by a CSI secrets driver that mounts it as a file, or by the application authenticating and fetching directly — so it exists only in the running container\'s memory or an ephemeral mount.',
        aHi: 'Ek build-time secret sirf tab chahिए jab image build ho rahी hai — ek private package registry ke liye ek token, ek compilation step ke liye ek license key. Ek runtime secret application ko chahिए jab ye run karता hai — database password, ek upstream service ke liye ek API key. Unhe completely differently handle karna chahिए. Ek build-time secret kisi bhi layer mein persist nahi hona chahिए: ise \`ARG\` ke via pass karना ise image history mein record karता hai; aur ise ek file mein likhना ise layer mein chhod deता hai. Correct mechanism BuildKit ka secret mount hai — \`RUN --mount=type=secret,id=x\` — jо secret ko us ek \`RUN\` ke duration ke liye ek tmpfs-backed file ke roop mein expose karता hai aur ise kabhi ek layer mein nahi likhता. Ek runtime secret kabhi image mein hona hi nahi chahिए. Ye tab fetch hota hai jab container start hota hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list the six places a secret must not live (git, image layers, plaintext env, logs, repo config files, client-side) and explain precisely why each one is unsafe.',
        taskHi: 'Ek comment mein, wo chhe jagah list karो jahaan ek secret nahi rehना chahिए aur samjhाओ har ek asafe kyun hai.',
        hint: 'A SECRET = any value where POSSESSION == ACCESS (no second factor): password, API key, OAuth/bearer token, private signing/TLS key, DB connection string, webhook signing secret, cloud credentials. THE SIX PLACES IT MUST NOT LIVE: (1) GIT — committed once = in history FOREVER. `git rm` / force-push does NOT help: the blob is in the commit that added it (`git show <old>:path`), in `git log -p`, reachable via `git rev-list --all`, in the reflog, in EVERY clone/fork taken while present, in the PR\'s recorded diff, in CI caches, and platform APIs still serve the old commit. Public repo -> automated scrapers test it within SECONDS-TO-MINUTES. (2) IMAGE LAYER — `COPY .env` then `RUN rm .env` in a later layer: the .env is STILL in the earlier layer (the rm is a whiteout marker; the file was present when that layer was committed). `docker history --no-trunc` shows `ARG`/`ENV` values and `RUN` lines; extracting the layer tarball recovers the file. The running container\'s filesystem showing nothing is irrelevant. (3) PLAINTEXT ENV VAR — readable by EVERY process in the container (`/proc/<pid>/environ`), shows in `docker inspect` + `kubectl describe pod` (wider read access than should see prod DB creds), captured in core dumps / crash reports, leaked by any code that logs `process.env` or runs `env`. NOT encrypted anywhere. (4) LOGS — the most underestimated path: designed to be COLLECTED, indexed, retained for months, shared with anyone debugging, often forwarded to a 3rd-party APM. Reaches logs via `echo $TOKEN`, a stack trace with a connection string, a request-logging middleware dumping `Authorization`/`Cookie` headers or a password in the body. Once in a log store it is on durable storage, replicated, indexed, and in a dozen places. (5) CONFIG FILES IN THE REPO — `config/production.yml` with the real password is identical to git (it IS git). (6) CLIENT-SIDE — anything in a browser bundle, a mobile app binary, or a public JS file is downloadable and trivially extractable by anyone; "obfuscation" is not encryption.',
        hintHi: 'EK SECRET = koi bhi value jahaan POSSESSION == ACCESS (koi second factor nahi). CHHE JAGAH: (1) GIT — ek baar committed = history mein HAMESHA. `git rm` / force-push madad NAHI karता: blob us commit mein hai jisne ise add kiya, `git log -p` mein, reflog mein, HAR clone/fork mein jо present hone par liya gaya. Public repo -> scrapers SECONDS mein test karते hain. (2) IMAGE LAYER — `COPY .env` phir later layer mein `RUN rm .env`: .env ABHI BHI earlier layer mein hai. `docker history --no-trunc` + layer tarball extract -> file wapas. (3) PLAINTEXT ENV — container mein HAR process ko readable (`/proc/<pid>/environ`), `docker inspect` + `kubectl describe pod` mein, core dumps mein, `process.env` log karने wale kisi bhi code se leaked. KAHIN encrypted NAHI. (4) LOGS — sabse underestimated: COLLECTED, indexed, mahinon retained, shared, aksar 3rd-party APM ko forwarded. `echo $TOKEN`, connection string wala stack trace, `Authorization` headers dump karने wala middleware. (5) REPO CONFIG FILES — `config/production.yml` = git. (6) CLIENT-SIDE — browser bundle / mobile binary / public JS mein kuch bhi downloadable + extractable; "obfuscation" encryption nahi hai.',
      },
      {
        task: 'In a comment, explain the twelve-factor "config from the environment" nuance: what it actually means, the two ways it is misapplied, and the modern reference-resolution pattern.',
        taskHi: 'Ek comment mein, twelve-factor "config from the environment" nuance samjhाओ.',
        hint: 'WHAT TWELVE-FACTOR ACTUALLY SAYS: configuration (including secrets) should NOT be HARDCODED IN THE SOURCE CODE, so the SAME BUILD can run in dev/staging/prod with DIFFERENT config. It is a statement about COUPLING (build artifact independent of environment), NOT an endorsement of any storage mechanism, and NOT "put the raw secret in an env var". THE TWO MISAPPLICATIONS: (1) a `.env` file with real values committed to the repo — "it\'s from the environment!" — no, that IS hardcoding, just in a different file, with every git-history + access-control problem. (2) a literal `value: "sk_live_..."` / `value: "postgres://app:pass@..."` in the Kubernetes Deployment YAML (which is in git, in `kubectl get deploy -o yaml`, in `kubectl describe` for anyone with `get` on Deployments, in the cluster audit log, and mirrored into the GitOps repo). ALSO: a plaintext env var on the RUNNING process is itself weak (readable via `/proc`, `docker inspect`, `kubectl describe`, crash dumps, `env`-logging code). THE MODERN REFERENCE-RESOLUTION PATTERN: the config the app reads holds a REFERENCE; the platform RESOLVES it at LAUNCH from a secrets manager. Concretely: (a) k8s `env: valueFrom: secretKeyRef: {name, key}` where the Secret is itself produced by the External Secrets Operator from Vault/AWS SM/Azure KV (git contains only the PATH, e.g. `secret/data/prod/api` — not sensitive); (b) a file mounted by the Secrets Store CSI driver; (c) an init container / sidecar that authenticates (workload identity, Lesson 5) and writes the value to a shared `emptyDir`; (d) the app authenticating to the manager and fetching directly at startup / per-request. IN ALL CASES the secret exists ONLY in the memory of the running process (or an ephemeral tmpfs mount) — never in a file on disk, an image layer, or a repo — and it rotates centrally without a redeploy, with every read in the manager\'s audit log.',
        hintHi: 'TWELVE-FACTOR ACTUALLY KYA KEHTA HAI: configuration (secrets sahit) SOURCE CODE mein HARDCODED NAHI hona chahिए, taaki SAME BUILD dev/staging/prod mein ALAG config ke saath chale. Ye COUPLING ke baare mein hai, kisi storage mechanism ka endorsement NAHI. DO MISAPPLICATIONS: (1) real values wali ek `.env` file repo mein committed — "environment se hai!" — nahi, wo hardcoding HAI. (2) k8s Deployment YAML mein ek literal `value: "sk_live_..."` (jо git mein hai, `kubectl get deploy -o yaml` mein, `kubectl describe` mein, audit log mein). ALSO: RUNNING process par ek plaintext env var khud weak hai. MODERN PATTERN: config jо app padhती hai ek REFERENCE rakhता hai; platform ise LAUNCH par ek secrets manager se RESOLVE karता hai: (a) k8s `valueFrom: secretKeyRef` jahaan Secret khud External Secrets Operator dwara Vault/AWS SM se produced hai (git mein sirf PATH); (b) CSI driver se mounted file; (c) ek init container / sidecar jо authenticate karके value ek shared `emptyDir` mein likhता hai; (d) app directly manager se fetch karता hai. SAB CASES mein secret SIRF running process ki memory mein hai, aur bina redeploy ke centrally rotate hota hai.',
      },
      {
        task: 'In a comment, distinguish build-time from runtime secrets, explain why COPY/ENV/ARG bake a secret into the image, and describe the BuildKit secret mount and how runtime secrets are delivered instead.',
        taskHi: 'Ek comment mein, build-time ko runtime secrets se distinguish karो aur BuildKit secret mount describe karो.',
        hint: 'BUILD-TIME SECRET — needed ONLY while the image is being built: a private package-registry token (`.npmrc` auth, pip `--index-url` creds), a license key for a compile step, credentials to fetch a proprietary dependency. RUNTIME SECRET — needed by the APP while it RUNS: the DB password, an API key for an upstream service, a signing key. HANDLE THEM COMPLETELY DIFFERENTLY. WHY COPY/ENV/ARG BAKE IT IN: (a) `ARG NPM_TOKEN` + `--build-arg` -> the VALUE is recorded in the image history; `docker history --no-trunc <img>` shows the `RUN` line WITH the substituted token. (b) `RUN echo "$TOKEN" > ~/.npmrc && npm ci && rm ~/.npmrc` -> `~/.npmrc` EXISTED in the layer filesystem when that layer was committed; the `rm` is a later state; extracting the layer tarball recovers it. (c) `ENV SECRET=` -> in the image metadata forever. Deleting the file / unsetting the var later is COSMETIC. THE BUILDKIT SECRET MOUNT (the correct mechanism for build-time): `# syntax=docker/dockerfile:1` then a `RUN --mount=type=secret,id=npmtoken` step whose script does `NPM_TOKEN="$(cat /run/secrets/npmtoken)"` then `npm ci`. Build with `docker build --secret id=npmtoken,env=NPM_TOKEN .` (or `,src=./token.txt`). The secret is mounted as a TMPFS-backed file under `/run/secrets/` for the duration of THAT ONE `RUN` instruction ONLY — never written to a layer, never in `docker history`, never in the image metadata, never in the final image. RUNTIME SECRETS — never in the image under ANY mechanism. Delivered when the CONTAINER STARTS: an init container / sidecar authenticates to a secrets manager (via workload identity) and writes the value to a shared `emptyDir`; OR the Secrets Store CSI driver mounts it as a file; OR the app authenticates and fetches directly at startup / per-request. The secret exists only in the running container\'s memory or an ephemeral mount, is fetched over TLS, is logged on every read, and rotates without rebuilding the image.',
        hintHi: 'BUILD-TIME SECRET — SIRF jab image build ho rahी hai: ek private registry token (`.npmrc` auth), ek compile step ke liye ek license key. RUNTIME SECRET — APP ko jab ye RUN karता hai: DB password, ek upstream API key. COMPLETELY DIFFERENTLY handle karो. COPY/ENV/ARG KYUN BAKE KARTE HAIN: (a) `ARG NPM_TOKEN` -> VALUE image history mein recorded; `docker history --no-trunc` `RUN` line ko substituted token ke saath dikhाता hai. (b) `RUN echo "$TOKEN" > ~/.npmrc && ... && rm ~/.npmrc` -> `~/.npmrc` layer filesystem mein EXISTED jab layer committed hua; tarball extract -> wapas. File delete karना COSMETIC hai. BUILDKIT SECRET MOUNT: `# syntax=docker/dockerfile:1` phir `RUN --mount=type=secret,id=npmtoken ...`. Build: `docker build --secret id=npmtoken,env=NPM_TOKEN .`. Secret ek TMPFS file ke roop mein `/run/secrets/` ke under US EK `RUN` ke duration ke liye mounted — kabhi layer / history / metadata / final image mein NAHI. RUNTIME SECRETS — kabhi image mein NAHI. CONTAINER START par delivered: ek init container / sidecar manager se authenticate karके value ek shared `emptyDir` mein likhता hai; ya CSI driver; ya app directly fetch karता hai. TLS par fetched, har read par logged, bina rebuild ke rotates.',
      },
    ],

    keyTakeaways: [
      'A SECRET = any value where possession IS access (no second factor): password, API key, bearer token, private key, connection string, cloud creds. Once the wrong party can read it, you have a breach-in-waiting.',
      'SIX PLACES IT MUST NOT LIVE: (1) GIT — history is forever; `git rm`/force-push reaches no clone, fork, reflog, or CI cache. (2) IMAGE LAYERS — `COPY .env` + a later `RUN rm` leaves it in the earlier layer, recoverable via `docker history` / the layer tar. (3) PLAINTEXT ENV — readable via `/proc`, `docker inspect`, `kubectl describe`, crash dumps. (4) LOGS — collected, indexed, retained, forwarded to vendors. (5) REPO CONFIG FILES. (6) CLIENT-SIDE bundles.',
      'SECRETS BELONG IN A MANAGER (Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault): encrypted at rest, access by policy, every read logged, versioned + rotatable without a redeploy, able to issue dynamic short-lived secrets. The app holds NO secret at rest — it authenticates with a workload identity and fetches over TLS.',
      'THE TWELVE-FACTOR NUANCE: "config from the environment" means "not hardcoded in the source", NOT "raw secret in a `.env` file / a `value:` in Deployment YAML" (both are just hardcoding elsewhere, with git-history + `kubectl describe` exposure). Modern pattern: the env var / config holds a REFERENCE the platform resolves at launch (`secretKeyRef` from an ExternalSecret, a CSI-mounted file, an init sidecar) — the secret exists only in the running process.',
      'BUILD-TIME vs RUNTIME SECRETS: build-time (a registry token, a license key) → BuildKit `RUN --mount=type=secret,id=x` (tmpfs, one RUN, never in a layer or `docker history`) — NEVER `ARG`/`ENV`/`COPY` (baked into the image forever). Runtime secrets → never in the image at all; fetched from a manager when the container starts. IF A SECRET LEAKS: rotate first, check audit logs, then purge history/layers/logs, then move it to a manager.',
    ],
    keyTakeawaysHi: [
      'EK SECRET = koi bhi value jahaan possession HI access hai (koi second factor nahi): password, API key, bearer token, private key, connection string, cloud creds. Ek baar galat party ise padh sakती hai, aapke paas ek breach-in-waiting hai.',
      'CHHE JAGAH JAHAAN YE NAHI REHNA CHAHIYE: (1) GIT — history hamesha ke liye; `git rm`/force-push kisi clone, fork, reflog, ya CI cache tak nahi pahunchता. (2) IMAGE LAYERS — `COPY .env` + ek later `RUN rm` ise earlier layer mein chhod deता hai, `docker history` / layer tar se recoverable. (3) PLAINTEXT ENV — `/proc`, `docker inspect`, `kubectl describe`, crash dumps se readable. (4) LOGS — collected, indexed, retained, vendors ko forwarded. (5) REPO CONFIG FILES. (6) CLIENT-SIDE bundles.',
      'SECRETS EK MANAGER MEIN BELONG KARTE HAIN (Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault): at rest encrypted, policy se access, har read logged, versioned + bina redeploy ke rotatable, dynamic short-lived secrets issue kar sakта hai. App ke paas at rest KOI secret nahi — ye ek workload identity se authenticate karता hai aur TLS par fetch karता hai.',
      'TWELVE-FACTOR NUANCE: "config from the environment" ka matlab "source mein hardcoded nahi", NAHI "ek `.env` file mein raw secret / Deployment YAML mein ek `value:`" (dono kahीं aur hardcoding hain, git-history + `kubectl describe` exposure ke saath). Modern pattern: env var / config ek REFERENCE rakhता hai jise platform launch par resolve karता hai (`secretKeyRef` ek ExternalSecret se, ek CSI-mounted file, ek init sidecar) — secret sirf running process mein hai.',
      'BUILD-TIME vs RUNTIME SECRETS: build-time (ek registry token, ek license key) → BuildKit `RUN --mount=type=secret,id=x` (tmpfs, ek RUN, kabhi ek layer ya `docker history` mein nahi) — KABHI `ARG`/`ENV`/`COPY` nahi (image mein hamesha ke liye baked). Runtime secrets → kabhi image mein nahi; container start par ek manager se fetched. AGAR EK SECRET LEAK HOTA HAI: pehle rotate karो, audit logs check karो, phir history/layers/logs purge karो, phir ise ek manager mein move karो.',
    ],
  },

  {
    slug: 'ops-a-secrets-manager-in-practice-policies-leases-and-audit',
    title: 'A Secrets Manager in Practice: Policies, Leases & Audit',
    titleHi: 'Ek Secrets Manager Practice Mein: Policies, Leases Aur Audit',
    description:
      'What a secrets manager actually gives you beyond "somewhere encrypted to put a string": a path-structured store with fine-grained access policies, an authentication layer that maps a workload identity to a policy, a full audit log of every read, versioning, and leased credentials that expire. This lesson works through HashiCorp Vault as the model — KV v2, ACL policies, tokens with a TTL and limited capabilities — and maps it to AWS Secrets Manager, GCP Secret Manager, and Azure Key Vault.',
    descriptionHi:
      'Ek secrets manager aapko "ek string daalne ke liye kahीं encrypted" ke aage actually kya deता hai: fine-grained access policies ke saath ek path-structured store, ek authentication layer jо ek workload identity ko ek policy se map karता hai, har read ka ek full audit log, versioning, aur leased credentials jо expire hote hain. Ye lesson HashiCorp Vault ke through model ke roop mein kaam karता hai — KV v2, ACL policies, ek TTL aur limited capabilities wale tokens — aur ise AWS Secrets Manager, GCP Secret Manager, aur Azure Key Vault se map karता hai.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 2,

    analogy: {
      en: '**A bank vault versus a locked drawer.** A locked drawer keeps casual hands off your valuables, and that is roughly what "encrypted at rest" gives you on its own. A bank vault does much more: it knows exactly who you are before it opens, it only opens the specific box you are entitled to, it records the time of every visit and who authorised it, it can issue you a temporary access card that stops working at 5pm, and if a card is lost the bank cancels that one card without re-keying the building. A secrets manager is the vault — identity-checked access, per-path authorisation, a complete access log, and time-limited credentials — and using one only as "a place to store an encrypted string" is using a bank vault as a locked drawer.',
      hi: '**Ek bank vault versus ek locked drawer.** Ek locked drawer aapke valuables se casual haathon ko door rakhता hai, aur wo roughly wo hai jо "encrypted at rest" aapko apne aap deता hai. Ek bank vault bahut zyada karता hai: ye exactly jaنता hai ki aap kaun ho iske kholने se pehle, ye sirf wo specific box kholता hai jिske aap entitled ho, ye har visit ka time aur kisne authorise kiya record karता hai, ye aapko ek temporary access card issue kar sakта hai jо 5pm par kaam karना band kar deता hai, aur agar ek card lost hoता hai bank us ek card ko cancel karता hai bina building ko re-key kiye. Ek secrets manager vault hai.',
    },

    simple: `**A SECRETS MANAGER = a store + policies + auth + audit + leases. Not just "encrypted string storage".**

**1. THE STORE — path-structured, versioned:**
\`\`\`
secret/data/prod/api        { db_url: ..., stripe_key: ... }   version 3 (v1, v2 kept)
secret/data/prod/worker     { queue_url: ..., s3_key: ... }
secret/data/staging/api     { db_url: ... }
paths are the unit of access control. structure them by env + app + purpose.
KV v2 keeps version history + soft-delete + a check-and-set write guard.
\`\`\`

**2. POLICIES — capabilities per path (default-deny):**
\`\`\`
# policy "prod-api-ro"
path "secret/data/prod/api"     { capabilities = ["read"] }
path "secret/metadata/prod/api" { capabilities = ["read", "list"] }
# everything not listed -> DENIED. capabilities: create/read/update/delete/list/patch.
# grant the NARROWEST: the prod-api app gets read on secret/data/prod/api and
# nothing else - not staging, not other apps, not write.
\`\`\`

**3. AUTH — map a workload identity to policies (NOT a shared token):**
\`\`\`
Kubernetes auth:  the app's ServiceAccount JWT -> Vault verifies it with the
   cluster's API -> issues a token bound to policy "prod-api-ro", TTL 1h.
AWS IAM auth:      the pod's IRSA role -> Vault verifies via STS -> a scoped token.
AppRole:          a role_id (config) + a secret_id (delivered securely, short-lived)
   -> for CI / VMs / non-k8s workloads.
=> the app never holds a long-lived Vault token. it proves WHO it is; Vault decides WHAT it gets.
\`\`\`

**4. AUDIT — every request, hashed, append-only:**
\`\`\`
enable an audit device (file / syslog / socket). EVERY auth + read + write is
logged: timestamp, client identity, path, operation, response status. secret
VALUES are HMAC'd (not plaintext) so the log itself isn't a secret store.
this is how you answer "who read the prod DB password, and when" after an incident.
\`\`\`

**5. LEASES / TTL — credentials that expire:**
\`\`\`
a Vault token has a TTL (e.g. 1h) and can be renewable up to a max_ttl. when it
expires, it's dead - a leaked token is only useful for its remaining TTL.
dynamic secrets (Lesson 3) take this further: the SECRET ITSELF is leased and
auto-revoked. 'vault lease revoke -prefix ...' kills a whole batch instantly.
\`\`\`

**CLOUD EQUIVALENTS (same five ideas, different names):**
\`\`\`
                  store            policy              auth              audit
AWS Secrets Mgr   secret + version resource policy +   IAM role (IRSA)   CloudTrail
                                   IAM identity policy
GCP Secret Mgr    secret + version IAM binding on the  workload identity Cloud Audit Logs
                                   secret / project    federation
Azure Key Vault   secret + version RBAC or access      managed identity  Azure Monitor
                                   policy on the vault                    / diagnostic logs
AWS/GCP also auto-rotate via a Lambda / rotation function. Vault issues dynamic creds.
\`\`\``,

    simpleHi: `**EK SECRETS MANAGER = ek store + policies + auth + audit + leases. Sirf "encrypted string storage" nahi.**

**1. THE STORE — path-structured, versioned:**
\`\`\`
secret/data/prod/api        { db_url: ..., stripe_key: ... }   version 3 (v1, v2 kept)
secret/data/prod/worker     { queue_url: ..., s3_key: ... }
secret/data/staging/api     { db_url: ... }
paths access control ki unit hain. inhe env + app + purpose se structure karो.
KV v2 version history + soft-delete + ek check-and-set write guard rakhता hai.
\`\`\`

**2. POLICIES — per path capabilities (default-deny):**
\`\`\`
# policy "prod-api-ro"
path "secret/data/prod/api"     { capabilities = ["read"] }
path "secret/metadata/prod/api" { capabilities = ["read", "list"] }
# jо listed nahi -> DENIED. capabilities: create/read/update/delete/list/patch.
# SABSE NARROW grant karो: prod-api app ko secret/data/prod/api par read milता hai
# aur kुछ nahi - staging nahi, doosre apps nahi, write nahi.
\`\`\`

**3. AUTH — ek workload identity ko policies se map karो (ek shared token NAHI):**
\`\`\`
Kubernetes auth:  app ki ServiceAccount JWT -> Vault ise cluster ke API se verify
   karता hai -> policy "prod-api-ro" se bound ek token issue karता hai, TTL 1h.
AWS IAM auth:      pod ki IRSA role -> Vault STS ke via verify karता hai -> ek scoped token.
AppRole:          ek role_id (config) + ek secret_id (securely delivered, short-lived)
   -> CI / VMs / non-k8s workloads ke liye.
=> app kabhi ek long-lived Vault token nahi rakhता. ye saabit karता hai ki ye KAUN hai; Vault decide karता hai ye KYA paता hai.
\`\`\`

**4. AUDIT — har request, hashed, append-only:**
\`\`\`
ek audit device enable karो (file / syslog / socket). HAR auth + read + write
logged hai: timestamp, client identity, path, operation, response status. secret
VALUES HMAC'd hain (plaintext nahi) taaki log khud ek secret store na ho.
ye hai jaise aap ek incident ke baad "prod DB password kisne padha, aur kab" answer karते ho.
\`\`\`

**5. LEASES / TTL — credentials jо expire hoते hain:**
\`\`\`
ek Vault token ki ek TTL hoती hai (e.g. 1h) aur ek max_ttl tak renewable ho sakती hai.
jab ye expire hoती hai, ye dead hai - ek leaked token sirf iski remaining TTL ke liye useful hai.
dynamic secrets (Lesson 3) ise aur aage le jaते hain: SECRET KHUD leased aur
auto-revoked hai. 'vault lease revoke -prefix ...' ek poore batch ko instantly kill karता hai.
\`\`\`

**CLOUD EQUIVALENTS (same paanch ideas, alag naam):**
\`\`\`
                  store            policy              auth              audit
AWS Secrets Mgr   secret + version resource policy +   IAM role (IRSA)   CloudTrail
                                   IAM identity policy
GCP Secret Mgr    secret + version secret / project    workload identity Cloud Audit Logs
                                   par IAM binding     federation
Azure Key Vault   secret + version vault par RBAC ya   managed identity  Azure Monitor
                                   access policy                         / diagnostic logs
AWS/GCP ek Lambda / rotation function ke via auto-rotate bhi karते hain. Vault dynamic creds issue karता hai.
\`\`\``,

    content: `## More than encrypted storage

The minimum a secrets manager does is store values encrypted at rest, but if that were all it did you would gain little over an encrypted file. The value is in the four capabilities layered on top: fine-grained access control by path, an authentication layer that maps a workload\'s identity to what it is allowed to read, a complete audit log of every access, and credentials that expire. HashiCorp Vault is a useful model because it exposes all four explicitly; the major cloud managers provide the same concepts with their own names and some are less configurable.

## The store

Vault\'s key-value store is organised as a path tree, and paths are the unit of access control, so you structure them deliberately — typically by environment, then application, then purpose: \`secret/data/prod/api\`, \`secret/data/prod/worker\`, \`secret/data/staging/api\`. The \`data\` segment is specific to KV version 2, which also keeps a version history of each secret, supports soft-delete and undelete, and offers a check-and-set option so a write fails if the secret changed since you read it. Each path holds a set of key-value pairs — a database URL, an API key, a signing secret — that logically belong together.

## Policies

A Vault policy is a list of paths, each with a set of capabilities: \`create\`, \`read\`, \`update\`, \`delete\`, \`list\`, \`patch\`. Anything not named in a policy is denied — the default is deny, and access is only ever granted, never removed by a policy. The discipline is to grant the narrowest set that works: the production API service gets \`read\` on \`secret/data/prod/api\` and its metadata path, and nothing else — not the staging path, not other applications\' paths, not write access to its own. A separate policy exists for each distinct access need, and an identity is associated with one or more policies whose grants are unioned.

## Authentication

The critical design point is that the application does not hold a long-lived Vault token. Instead it authenticates by proving its identity, and Vault issues a short-lived token bound to the appropriate policy. With the Kubernetes auth method, the application presents its ServiceAccount JWT, Vault validates that token against the cluster\'s API server, confirms the ServiceAccount is mapped to a role, and issues a token bound to that role\'s policies with a TTL of, say, one hour. With the AWS IAM auth method, the workload\'s IAM role — delivered through IRSA — is verified via STS. The AppRole method covers CI jobs and non-Kubernetes workloads: a \`role_id\` that can live in configuration plus a \`secret_id\` that is delivered separately, is short-lived, and is often single-use. In every case the application proves who it is and Vault decides what it may access; there is no shared secret that grants blanket access.

## Audit

Vault can write an audit log to a file, syslog, or a socket, and once enabled every request — every authentication, every read, every write — is recorded with a timestamp, the client\'s identity, the path, the operation, and the response status. Secret values in the log are HMAC-hashed rather than stored in plaintext, so the audit log is not itself a place secrets leak. This log is what lets you answer, after an incident, exactly which identity read the production database password and when, and whether an anomalous access happened before the alert fired. Running without an audit device is running blind.

## Leases and TTL

Every Vault token has a time-to-live and, optionally, a maximum TTL up to which it can be renewed. When the TTL elapses the token is dead and any request with it fails, so a token that leaks is only useful for its remaining lifetime — minutes or hours, not indefinitely. Dynamic secrets, covered in the next lesson, extend this to the secret itself: Vault generates the credential on demand with its own lease, and revokes it — deletes the database user, invalidates the cloud key — when the lease expires or is explicitly revoked. \`vault lease revoke -prefix\` can invalidate an entire class of issued credentials at once, which is the containment action during an incident.

## Cloud equivalents

AWS Secrets Manager stores a secret with versions, controls access with a resource policy on the secret plus IAM identity policies, authenticates workloads via their IAM role (IRSA on EKS), and logs every call to CloudTrail; it can rotate a secret automatically by invoking a Lambda function. GCP Secret Manager stores versioned secrets, controls access with IAM bindings at the secret or project level, authenticates via Workload Identity Federation, and logs to Cloud Audit Logs. Azure Key Vault stores versioned secrets, controls access with either Azure RBAC or a vault access policy, authenticates via managed identities, and logs to Azure Monitor diagnostic settings. The five ideas — store, policy, auth, audit, expiry — are present in all of them; Vault additionally issues dynamic credentials for databases and cloud providers directly, which the cloud managers approximate with scheduled rotation.`,

    contentHi: `## Encrypted storage se zyada

Ek secrets manager jо minimum karता hai wo values ko at rest encrypted store karना hai, par agar wo sab hoता jо ye karता to aap ek encrypted file ke upar bahut kम gain karते. Value un chaar capabilities mein hai jо upar layered hain: path se fine-grained access control, ek authentication layer jо ek workload ki identity ko us se map karता hai jо ise padhने ki permission hai, har access ka ek complete audit log, aur credentials jо expire hoते hain. HashiCorp Vault ek useful model hai kyunki ye chaaron ko explicitly expose karता hai.

## The store

Vault ka key-value store ek path tree ke roop mein organised hai, aur paths access control ki unit hain, to aap unhe deliberately structure karते ho — typically environment se, phir application, phir purpose: \`secret/data/prod/api\`, \`secret/data/prod/worker\`. \`data\` segment KV version 2 ke liye specific hai, jо har secret ki ek version history bhi rakhता hai, soft-delete aur undelete support karता hai, aur ek check-and-set option offer karता hai.

## Policies

Ek Vault policy paths ki ek list hai, har ek capabilities ke ek set ke saath: \`create\`, \`read\`, \`update\`, \`delete\`, \`list\`, \`patch\`. Jо ek policy mein named nahi wo denied hai — default deny hai. Discipline sabse narrow set grant karना hai jо kaam karता hai: production API service ko \`secret/data/prod/api\` par \`read\` milता hai aur kुछ nahi.

## Authentication

Critical design point ye hai ki application ek long-lived Vault token nahi rakhती. Iske bजाy ye apni identity saabit karके authenticate karती hai, aur Vault ek short-lived token issue karता hai jо appropriate policy se bound hai. Kubernetes auth method ke saath, application apni ServiceAccount JWT present karती hai, Vault us token ko cluster ke API server ke against validate karता hai, aur us role ki policies se bound ek token issue karता hai ek TTL ke saath. AWS IAM auth method ke saath, workload ki IAM role STS ke via verified hai. AppRole method CI jobs aur non-Kubernetes workloads cover karता hai. Har case mein application saabit karती hai ki ye kaun hai aur Vault decide karता hai ye kya access kar sakती hai.

## Audit

Vault ek audit log ek file, syslog, ya ek socket mein likh sakта hai, aur ek baar enabled har request — har authentication, har read, har write — ek timestamp, client ki identity, path, operation, aur response status ke saath recorded hai. Log mein secret values plaintext mein store hone ke bजाy HMAC-hashed hain. Ye log wo hai jо aapko ek incident ke baad answer karने deता hai ki exactly konsी identity ne production database password padha aur kab.

## Leases aur TTL

Har Vault token ki ek time-to-live hoती hai aur, optionally, ek maximum TTL jिस tak ise renew kiya ja sakता hai. Jab TTL elapse hoती hai token dead hai, to ek token jо leak hoता hai sirf iski remaining lifetime ke liye useful hai. Dynamic secrets, agli lesson mein covered, ise secret khud tak extend karते hain: Vault credential ko demand par apni lease ke saath generate karता hai, aur ise revoke karता hai jab lease expire hoती hai. \`vault lease revoke -prefix\` ek poori class of issued credentials ko ek saath invalidate kar sakта hai.

## Cloud equivalents

AWS Secrets Manager ek secret ko versions ke saath store karता hai, secret par ek resource policy plus IAM identity policies se access control karता hai, workloads ko unki IAM role ke via authenticate karता hai, aur har call ko CloudTrail mein log karता hai. GCP Secret Manager versioned secrets store karता hai, IAM bindings se access control karता hai, Workload Identity Federation ke via authenticate karता hai. Azure Key Vault versioned secrets store karता hai, ya Azure RBAC ya ek vault access policy se access control karता hai, managed identities ke via authenticate karता hai. Paanch ideas — store, policy, auth, audit, expiry — un sab mein present hain.`,

    examples: [
      {
        title: 'Vault: a read-only policy, a short-lived token bound to it, and what it cannot do',
        titleHi: 'Vault: ek read-only policy, is se bound ek short-lived token, aur ye kya nahi kar sakta',
        code: `# VERIFY
PORT=$(( (RANDOM % 20000) + 20000 ))
export VAULT_ADDR="http://127.0.0.1:\$PORT" VAULT_TOKEN=root
vault server -dev -dev-root-token-id=root -dev-listen-address="127.0.0.1:\$PORT" > /tmp/vault-dev.log 2>&1 &
VPID=\$!
trap 'kill \$VPID 2>/dev/null' EXIT
for i in \$(seq 1 20); do vault status >/dev/null 2>&1 && break; sleep 0.5; done

# a policy: read-only, and ONLY under secret/data/prod/api/*
# (write the .hcl in the CWD - a native tool can't open an MSYS /tmp path)
cat > prod-api-ro.hcl <<'HCL'
path "secret/data/prod/api/*" {
  capabilities = ["read"]
}
HCL
vault policy write prod-api-ro prod-api-ro.hcl > /dev/null

# seed two secrets: one the app should reach, one it should not
vault kv put secret/prod/api/db  url="postgres://app:pw@db/app" > /dev/null
vault kv put secret/prod/worker/queue url="amqp://mq/jobs"       > /dev/null

# mint a token for the app: bound to the policy, TTL 15m (NOT the root token)
APP_TOKEN=\$(vault token create -policy=prod-api-ro -ttl=15m -field=token)
echo "minted app token: policy=prod-api-ro ttl=15m"

echo "--- app token READS its own secret: ---"
VAULT_TOKEN=\$APP_TOKEN vault kv get -field=url secret/prod/api/db; echo

echo "--- app token READS the worker's secret: ---"
VAULT_TOKEN=\$APP_TOKEN vault kv get secret/prod/worker/queue 2>&1 | head -1

echo "--- app token WRITES its own secret: ---"
VAULT_TOKEN=\$APP_TOKEN vault kv put secret/prod/api/db url="hacked" 2>&1 | head -1

echo "--- the token's policies + that its TTL is bounded: ---"
VAULT_TOKEN=\$APP_TOKEN vault token lookup -format=json \\
  | python3 -c "import json,sys; d=json.load(sys.stdin)['data']; print('policies:', sorted(d['policies'])); print('ttl bounded (<= 900s):', d['ttl'] <= 900)"`,
        output: `minted app token: policy=prod-api-ro ttl=15m
--- app token READS its own secret: ---
postgres://app:pw@db/app
--- app token READS the worker's secret: ---
Error reading secret/data/prod/worker/queue: Error making API request.
--- app token WRITES its own secret: ---
Error writing data to secret/data/prod/api/db: Error making API request.
--- the token's policies + that its TTL is bounded: ---
policies: ['default', 'prod-api-ro']
ttl bounded (<= 900s): True`,
        explain: 'A running Vault (dev mode, on a random port, torn down by the trap) shows the four capabilities that make a secrets manager more than encrypted storage. A policy \`prod-api-ro\` grants exactly one thing: \`read\` under \`secret/data/prod/api/*\`. Two secrets are seeded — one for the API, one for the worker. The application is then given a token created with that policy and a fifteen-minute TTL, not the all-powerful root token. That token reads the API\'s own database URL successfully. It fails to read the worker\'s queue URL, because that path is not in its policy and the default is deny — the error is a permission denial, not a "not found". It fails to write even its own secret, because the policy grants \`read\` and not \`update\`. And \`token lookup\` shows the token carries only the \`prod-api-ro\` policy (plus the always-present \`default\`) and its own bounded TTL — at most 900 seconds, after which it stops working regardless of anything else — so if this token is captured from a log or a memory dump, it is useful to an attacker for at most the remaining fraction of fifteen minutes. In production the token would not be minted by hand at all: the pod would authenticate with its Kubernetes ServiceAccount and Vault would issue exactly this kind of scoped, short-lived token automatically.',
        explainHi: 'Ek running Vault (dev mode, ek random port par, trap dwara torn down) wo chaar capabilities dikhाता hai jо ek secrets manager ko encrypted storage se zyada banाती hain. Ek policy \`prod-api-ro\` exactly ek cheez grant karती hai: \`secret/data/prod/api/*\` ke under \`read\`. Do secrets seeded hain — ek API ke liye, ek worker ke liye. Application ko phir us policy aur ek pandrah-minute TTL ke saath created ek token diya jaता hai, all-powerful root token nahi. Wo token API ki apni database URL successfully padhता hai. Ye worker ki queue URL padhने mein fail hoता hai, kyunki wo path iski policy mein nahi hai aur default deny hai. Ye apna hi secret write karने mein bhi fail hoता hai, kyunki policy \`read\` grant karती hai \`update\` nahi. Aur \`token lookup\` dikhाता hai token apni TTL of 900 seconds carry karта hai. Production mein token hand se mint hoता hi nahi: pod apni Kubernetes ServiceAccount se authenticate karता aur Vault exactly is tarah ka scoped, short-lived token automatically issue karता.',
      },
    ],

    mistakes: [
      {
        wrong: `# one Vault token, generated once, shared by every service, never expiring
  # ops runs:  vault token create -policy=default -ttl=0    (0 = no expiry)
  # the token is dropped into a shared 1Password vault + a Terraform var +
  #   half a dozen CI secret stores + a few .env files "for local dev".
  # every service authenticates to Vault with THE SAME token, which has broad
  # policy because "it needs to cover everyone".
  # -> the token is now in ~15 places, never rotates, and grants access to
  #    every secret. one leak (a CI log, a laptop, a screenshot) = total compromise,
  #    and you cannot even tell which service or person leaked it - the audit log
  #    just says "the shared token" for every single read.`,
        right: `# each workload authenticates as ITSELF; Vault issues a scoped, short-lived token
  # 1. enable the Kubernetes auth method, bind ServiceAccounts to roles:
  vault write auth/kubernetes/role/prod-api \\
    bound_service_account_names=api \\
    bound_service_account_namespaces=prod \\
    policies=prod-api-ro \\
    ttl=1h
  # 2. the app (via the Vault Agent sidecar / CSI provider / SDK) does:
  #    - reads its own ServiceAccount JWT from /var/run/secrets/...
  #    - POST auth/kubernetes/login  role=prod-api  jwt=<that JWT>
  #    - gets back a token: policy=prod-api-ro, ttl=1h, renewable to max 24h
  # now: no shared secret. the audit log shows "serviceaccount prod/api read
  # secret/data/prod/api/db at <time>". a compromised pod's token dies in <=1h and
  # only ever had prod-api-ro. revoke one role without touching anything else.`,
        why: 'A single shared, non-expiring token with a broad policy is the anti-pattern that undoes every benefit of running a secrets manager. Because it never expires, a copy that leaks is valid forever. Because it is shared, it must be distributed to many places — CI stores, config management, developer machines — each of which is an exposure surface, and it cannot be rotated without a coordinated change across all of them, so in practice it never is. Because its policy is broad enough to serve every consumer, a single leak grants access to every secret. And because every service presents the same token, the audit log cannot attribute a read to a specific workload or person — it records "the shared token" for everything, which destroys the forensic value that is a main reason to have audit logging. The correct model is that each workload authenticates as its own identity. Vault\'s Kubernetes auth method binds a ServiceAccount in a namespace to a role with a specific policy and a short TTL; the workload logs in by presenting its ServiceAccount JWT and receives a token scoped to exactly its needs, valid for an hour, renewable to a bounded maximum. Nothing is shared, every token expires quickly, the audit log names the actual identity, and a single role can be revoked in isolation.',
        whyHi: 'Ek single shared, non-expiring token ek broad policy ke saath wo anti-pattern hai jо ek secrets manager chalाने ka har benefit undo karta hai. Kyunki ye kabhi expire nahi hoती, ek copy jо leak hoती hai hamesha ke liye valid hai. Kyunki ye shared hai, ise kई jagah distribute karना padता hai — CI stores, config management, developer machines — har ek ek exposure surface. Kyunki iski policy har consumer ko serve karने ke liye broad hai, ek single leak har secret tak access grant karता hai. Aur kyunki har service same token present karती hai, audit log ek read ko ek specific workload ya vyakti ko attribute nahi kar sakता. Correct model ye hai ki har workload apni identity ke roop mein authenticate karता hai. Vault ka Kubernetes auth method ek namespace mein ek ServiceAccount ko ek specific policy aur ek short TTL wali ek role se bind karता hai.',
      },
      {
        wrong: `# policy grants far more than the app needs, "to be safe" / "for future use"
  path "secret/*"        { capabilities = ["read", "list"] }   # <-- ALL secrets
  path "secret/data/*"   { capabilities = ["create","read","update","delete"] }  # <-- + write
  path "auth/token/create" { capabilities = ["update"] }       # <-- can mint MORE tokens
  path "sys/*"           { capabilities = ["read"] }            # <-- read Vault's own config
  # the app only ever reads secret/data/prod/api/db. but this policy lets a
  # compromised instance: enumerate + read EVERY secret in Vault, modify or delete
  # them, mint itself new tokens (persistence), and read Vault's mount config to
  # map out what else exists. the blast radius of an RCE just went from
  # "one DB URL" to "the entire secrets estate".`,
        right: `# grant exactly the paths + capabilities in use, nothing else
  path "secret/data/prod/api/db" {
    capabilities = ["read"]
  }
  path "secret/metadata/prod/api/db" {          # so the app can check versions
    capabilities = ["read"]
  }
  # that's it. no list on the parent (can't enumerate siblings), no write,
  # no token creation, no sys access, no other environments or apps.
  # if the app later needs a second secret, add that ONE path in a reviewed change.
  # test the policy: 'vault policy read', and in CI 'vault token create -policy=X'
  # then assert the negative cases (reading a sibling path -> 403).`,
        why: 'A policy that grants broad access "to be safe" inverts the purpose of policies, which is to bound what a compromised workload can do. If the application only reads one secret path but its policy grants read and list across the entire secret store, then an attacker who achieves code execution in that application can enumerate and exfiltrate every secret the organisation has, not just the one URL the app legitimately uses. Adding write capability lets them tamper with or destroy secrets; granting \`auth/token/create\` lets them mint fresh tokens for persistence even after the original is revoked; granting \`sys\` read lets them map Vault\'s configuration to find what else is worth attacking. Each surplus grant multiplies the blast radius of a single application compromise. The correct policy names exactly the paths the application reads and the exact capabilities it uses — typically just \`read\` on one data path and its metadata path — with no \`list\` on the parent so siblings cannot be enumerated, and it is expanded only through a reviewed change when a genuine new need appears. Policies should be tested like code: read them back, and in CI assert both that the intended access works and that the adjacent forbidden access is denied.',
        whyHi: 'Ek policy jо broad access "to be safe" grant karती hai policies ke purpose ko invert karती hai, jо ye bound karना hai ki ek compromised workload kya kar sakता hai. Agar application sirf ek secret path padhती hai par iski policy poore secret store mein read aur list grant karती hai, to ek attacker jо us application mein code execution achieve karता hai har secret enumerate aur exfiltrate kar sakта hai. Write capability add karना unhe secrets tamper ya destroy karने deता hai; \`auth/token/create\` grant karना unhe persistence ke liye fresh tokens mint karने deता hai; \`sys\` read grant karना unhe Vault ki configuration map karने deता hai. Har surplus grant ek single application compromise ke blast radius ko multiply karता hai. Correct policy exactly wo paths name karती hai jо application padhती hai — typically ek data path aur iske metadata path par sirf \`read\` — parent par koi \`list\` nahi.',
      },
      {
        wrong: `# no audit device enabled - Vault is running "silently"
  # vault audit list  ->  (nothing)
  # 6 months later: an alert fires that the prod Stripe key is being used from an
  # unknown IP. the question: "was the key read from Vault by something it
  # shouldn't have been, and when?" cannot be answered - there is NO record of
  # any read, ever. you don't know if it leaked from Vault, from a pod's memory,
  # from a log, or was never in Vault. the incident timeline has a blank where
  # the most important evidence should be.`,
        right: `# enable an audit device on day one; ship it somewhere immutable
  vault audit enable file file_path=/vault/audit/audit.log
  # (or 'socket' -> a log pipeline, or 'syslog'). every request is now recorded:
  #   {"time":"...","auth":{"display_name":"serviceaccount/prod/api",...},
  #    "request":{"operation":"read","path":"secret/data/prod/api/stripe",...},
  #    "response":{"status":200}}   # secret VALUES are HMAC'd, not plaintext
  # ship audit.log to a WORM / append-only store (S3 Object Lock, a SIEM) so a
  # compromised Vault admin can't erase their tracks.
  # now the incident question is a query: "grep the audit log for reads of
  # secret/data/prod/api/stripe, list the identities and timestamps."
  # Vault REFUSES to service requests if ALL audit devices fail to log -
  # audit is treated as mandatory, not best-effort.`,
        why: 'An audit device is not optional infrastructure for a secrets manager; it is the component that makes the manager useful during an incident. Without it, Vault stores and serves secrets but keeps no record of who read what, so when a credential is later found to be misused, the single most important question — was it read from Vault, by which identity, and at what time — has no answer, and the incident responders cannot distinguish a Vault compromise from a leak that happened entirely downstream. Enabling an audit device from the start records every authentication and every secret access with the client identity, the path, the operation, and the result, HMAC-hashing the secret values so the log is not itself sensitive. Shipping that log to an append-only or write-once store means a compromised Vault operator cannot delete the evidence of their own activity. Vault treats audit as mandatory rather than best-effort: if every configured audit device fails to write, Vault stops servicing requests rather than operating without a record. The incident question then becomes a simple query over the log.',
        whyHi: 'Ek audit device ek secrets manager ke liye optional infrastructure nahi hai; ye wo component hai jо manager ko ek incident ke dauraan useful banाता hai. Iske bina, Vault secrets store aur serve karता hai par kisne kya padha iska koi record nahi rakhता, to jab ek credential baad mein misused paya jaता hai, single sabse important sawaal — kya ise Vault se padha gaya, konsी identity dwara, aur kis time — ka koi answer nahi hai. Shuru se ek audit device enable karना har authentication aur har secret access ko client identity, path, operation, aur result ke saath record karता hai, secret values ko HMAC-hash karके. Us log ko ek append-only ya write-once store mein ship karना ka matlab ek compromised Vault operator apni activity ka evidence delete nahi kar sakता. Vault audit ko mandatory treat karता hai: agar har configured audit device likhने mein fail hoता hai, Vault requests service karना band kar deता hai.',
      },
    ],

    realWorld: [
      {
        en: '**The CircleCI breach (2023)** — malware on an engineer\'s laptop stole a session token, letting the attacker exfiltrate customers\' stored secrets and environment variables. CircleCI\'s guidance to every customer was: rotate ALL secrets stored in CircleCI. Customers who used short-lived OIDC tokens instead of long-lived stored credentials had far less to rotate — the case for leased credentials over stored ones.',
        hi: '**CircleCI breach (2023)** — ek engineer ke laptop par malware ne ek session token chुraya, attacker ko customers ke stored secrets aur environment variables exfiltrate karने deता tha. CircleCI ki guidance har customer ko: CircleCI mein stored SAARE secrets rotate karो. Jinhone short-lived OIDC tokens use kiye unke paas rotate karने ke liye bahut kम tha.',
      },
      {
        en: '**Vault Kubernetes auth as the standard pattern** — most Vault-on-Kubernetes deployments use the Vault Agent Injector: a mutating webhook adds a sidecar that authenticates with the pod\'s ServiceAccount, fetches secrets per the pod\'s annotations, and writes them to a shared in-memory volume, renewing leases automatically. The app reads a file; it never sees a Vault token.',
        hi: '**Vault Kubernetes auth as the standard pattern** — zyादातर Vault-on-Kubernetes deployments Vault Agent Injector use karते hain: ek mutating webhook ek sidecar add karता hai jо pod ki ServiceAccount se authenticate karता hai, pod ke annotations ke hisaab se secrets fetch karता hai, aur unhe ek shared in-memory volume mein likhता hai. App ek file padhती hai; ye kabhi ek Vault token nahi dekhती.',
      },
      {
        en: '**Audit-log gaps in postmortems** — a recurring theme in breach postmortems (across cloud and self-hosted) is that the affected secrets store either had no audit logging enabled or had it going only to a location the attacker could also reach and wipe. The consistent recommendation: audit on by default, shipped to an immutable external store.',
        hi: '**Postmortems mein audit-log gaps** — breach postmortems mein ek recurring theme ye hai ki affected secrets store ya to koi audit logging enabled nahi tha ya ise sirf ek aisी location par jaता tha jise attacker bhi reach aur wipe kar sakта tha. Consistent recommendation: audit by default on, ek immutable external store par shipped.',
      },
    ],

    interviewQA: [
      {
        q: 'What does a secrets manager give you beyond "encrypted storage for a string"?',
        qHi: 'Ek secrets manager aapko "ek string ke liye encrypted storage" ke aage kya deता hai?',
        a: 'Four things layered on top of encryption at rest. First, fine-grained access control by path: the store is a path tree, paths are the unit of authorisation, and a policy grants specific capabilities — read, write, list — on specific paths, with everything else denied by default. Second, an authentication layer that maps a workload\'s identity to a policy, so the application does not hold a standing credential — it proves who it is, using its Kubernetes ServiceAccount, its cloud IAM role, or an AppRole, and the manager issues a short-lived token scoped to what that identity is allowed. Third, a complete audit log: every authentication and every secret access is recorded with the identity, path, operation, timestamp, and result, with secret values hashed so the log is not sensitive, which is what lets you reconstruct after an incident exactly who read a given secret and when. Fourth, expiry: tokens have a TTL and stop working when it elapses, so a leaked token has a bounded useful lifetime, and dynamic secrets extend this to the credential itself, which is generated on demand and revoked when its lease ends. Using a secrets manager only as encrypted key-value storage — one shared token, a broad policy, no audit device — discards all four and leaves you with little more than an encrypted file plus a network hop.',
        aHi: 'Encryption at rest ke upar layered chaar cheezein. Pehle, path se fine-grained access control: store ek path tree hai, paths authorisation ki unit hain, aur ek policy specific paths par specific capabilities grant karती hai. Doosre, ek authentication layer jо ek workload ki identity ko ek policy se map karता hai, to application ek standing credential nahi rakhती — ye saabit karती hai ki ye kaun hai aur manager ek short-lived token issue karta hai. Teesre, ek complete audit log: har authentication aur har secret access identity, path, operation, timestamp, aur result ke saath recorded hai. Chौthe, expiry: tokens ki ek TTL hoती hai aur jab ye elapse hoती hai tab kaam karना band kar dete hain. Ek secrets manager ko sirf encrypted key-value storage ke roop mein use karना chaaron ko discard karता hai.',
      },
      {
        q: 'Why is a single shared, long-lived Vault token an anti-pattern, and what is the correct authentication model?',
        qHi: 'Ek single shared, long-lived Vault token ek anti-pattern kyun hai, aur correct authentication model kya hai?',
        a: 'It undoes every benefit of the manager. A token that does not expire is valid forever if it leaks. A token that is shared has to be copied to every consumer — CI stores, config management, developer laptops — each an exposure point, and it cannot be rotated without a coordinated change everywhere, so it never is. A token whose policy is broad enough to serve every service grants an attacker who obtains it access to every secret. And because every workload presents the same token, the audit log attributes every read to "the shared token" and cannot tell you which service or person was the source of a leak — it destroys the forensic value of auditing. The correct model is per-workload identity-based authentication. With Vault\'s Kubernetes auth method you bind a ServiceAccount in a namespace to a role that carries a specific narrow policy and a short TTL; the workload authenticates by presenting its ServiceAccount JWT, Vault validates it against the cluster API, and issues a token scoped to exactly that role\'s policy, valid for an hour and renewable only up to a bounded maximum. Nothing is shared, tokens expire fast, the audit log names the real ServiceAccount, and one role can be revoked without touching any other. Cloud managers do the equivalent through IAM roles, Workload Identity Federation, or managed identities.',
        aHi: 'Ye manager ka har benefit undo karता hai. Ek token jо expire nahi hoती hamesha ke liye valid hai agar ye leak hoती hai. Ek token jо shared hai har consumer ko copy karना padता hai, aur ise har jagah ek coordinated change ke bina rotate nahi kiya ja sakта, to ye kabhi nahi hota. Ek token jiski policy har service ko serve karने ke liye broad hai ek attacker ko jo ise obtain karता hai har secret tak access grant karता hai. Aur kyunki har workload same token present karता hai, audit log har read ko "the shared token" ko attribute karता hai. Correct model per-workload identity-based authentication hai. Vault ke Kubernetes auth method ke saath aap ek namespace mein ek ServiceAccount ko ek role se bind karते ho jо ek specific narrow policy aur ek short TTL carry karती hai. Kुछ shared nahi hai, tokens fast expire hoते hain, audit log real ServiceAccount name karता hai.',
      },
      {
        q: 'Why is an audit device essential, and what makes an audit log trustworthy during an incident?',
        qHi: 'Ek audit device essential kyun hai, aur ek incident ke dauraan ek audit log ko trustworthy kya banाता hai?',
        a: 'An audit device is what makes a secrets manager useful when something goes wrong. Without one, the manager stores and serves secrets but keeps no record of access, so when a credential is later found to be misused, the central question — was it read from the manager, by which identity, at what time, and was there anomalous access before the alert — simply has no answer, and responders cannot distinguish a compromise of the manager from a leak that happened entirely downstream in a pod\'s memory or a log. With an audit device enabled, every authentication and every secret access is recorded with the client identity, the path, the operation, the timestamp, and the response status. What makes that log trustworthy during an incident is three properties. It must be complete: Vault treats audit as mandatory and stops servicing requests if all audit devices fail to write, rather than operating silently. Secret values in it are HMAC-hashed rather than stored in plaintext, so the log is not itself a secret store and can be handled more freely. And it must be shipped to an append-only or write-once destination — S3 Object Lock, a SIEM with immutable retention — so that an attacker who compromises a Vault operator account cannot delete the record of their own activity. Then the incident question becomes a grep over the log.',
        aHi: 'Ek audit device wo hai jо ek secrets manager ko useful banाता hai jab kुछ galat hoता hai. Iske bina, manager secrets store aur serve karता hai par access ka koi record nahi rakhता, to jab ek credential baad mein misused paya jaता hai, central sawaal — kya ise manager se padha gaya, konsी identity dwara, kis time — ka koi answer nahi hai. Ek audit device enabled ke saath, har authentication aur har secret access client identity, path, operation, timestamp, aur response status ke saath recorded hai. Us log ko ek incident ke dauraan trustworthy teen properties banाती hain. Ye complete hona chahिए: Vault audit ko mandatory treat karता hai. Isme secret values HMAC-hashed hain. Aur ise ek append-only destination par ship kiya jaना chahिए taaki ek attacker apni activity ka record delete na kar sake.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, lay out the five things a secrets manager provides (store, policies, auth, audit, leases/TTL) with a concrete Vault detail for each, and map each to AWS Secrets Manager / GCP Secret Manager / Azure Key Vault.',
        taskHi: 'Ek comment mein, wo paanch cheezein layout karो jо ek secrets manager provide karता hai aur har ek ko cloud managers se map karो.',
        hint: 'A SECRETS MANAGER = STORE + POLICIES + AUTH + AUDIT + LEASES — NOT "just encrypted string storage" (that alone barely beats an encrypted file). (1) THE STORE — path-structured + versioned. Vault: a path tree, e.g. `secret/data/prod/api`, `secret/data/prod/worker`, `secret/data/staging/api` — structure by env -> app -> purpose; `data` is KV v2 (version history, soft-delete/undelete, check-and-set write guard). Each path holds a set of k/v pairs that belong together. (2) POLICIES — capabilities per path, DEFAULT-DENY. Vault: an HCL policy listing paths, each with `capabilities = ["read"|"create"|"update"|"delete"|"list"|"patch"]`; anything not named -> DENIED; policies only ever GRANT (unioned across an identity\'s policies). Grant the NARROWEST that works: prod-api gets `read` on `secret/data/prod/api/*` + its metadata path, NOTHING else (no list on the parent -> can\'t enumerate siblings). (3) AUTH — map a WORKLOAD IDENTITY to policies, NOT a shared token. Vault: Kubernetes auth (the pod\'s ServiceAccount JWT -> Vault validates vs the cluster API -> a token bound to the role\'s policy, TTL 1h), AWS IAM auth (the IRSA role -> verified via STS), AppRole (role_id in config + a short-lived/single-use secret_id, for CI/VMs). The app proves WHO it is; Vault decides WHAT it gets; no standing credential. (4) AUDIT — every request, append-only, secret values HMAC\'d. Vault: `vault audit enable file|socket|syslog`; records {time, auth identity, path, operation, response status}; Vault REFUSES requests if ALL audit devices fail to log (mandatory, not best-effort); ship to a WORM store (S3 Object Lock) so a compromised admin can\'t wipe it. This answers "who read the prod DB password, and when". (5) LEASES / TTL — credentials expire. Vault: every token has a TTL + optional max_ttl (renew up to it); an expired token is dead -> a leaked token is useful only for its remaining TTL. Dynamic secrets (Lesson 3) lease the SECRET ITSELF; `vault lease revoke -prefix` kills a whole batch instantly. CLOUD MAPPING — same 5 ideas: AWS Secrets Manager = secret+versions / resource policy + IAM identity policy / IAM role (IRSA) / CloudTrail / auto-rotate via a Lambda. GCP Secret Manager = secret+versions / IAM binding on the secret or project / Workload Identity Federation / Cloud Audit Logs. Azure Key Vault = secret+versions / Azure RBAC or a vault access policy / managed identity / Azure Monitor diagnostic logs. Vault additionally issues DYNAMIC creds directly; the cloud managers approximate that with SCHEDULED rotation.',
        hintHi: 'EK SECRETS MANAGER = STORE + POLICIES + AUTH + AUDIT + LEASES — "sirf encrypted string storage" NAHI. (1) STORE — path-structured + versioned. Vault: ek path tree (`secret/data/prod/api`), env -> app -> purpose se structure karो; `data` = KV v2 (version history, soft-delete, check-and-set). (2) POLICIES — per path capabilities, DEFAULT-DENY. Vault: ek HCL policy, `capabilities = ["read"...]`; jо named nahi -> DENIED; policies sirf GRANT karती hain. SABSE NARROW grant karो (parent par koi `list` nahi). (3) AUTH — ek WORKLOAD IDENTITY ko policies se map karो, shared token NAHI. Vault: Kubernetes auth (ServiceAccount JWT -> token, TTL 1h), AWS IAM auth (IRSA role -> STS), AppRole (role_id + short-lived secret_id). App saabit karта hai KAUN; Vault decide karta hai KYA. (4) AUDIT — har request, append-only, values HMAC\'d. Vault: `vault audit enable`; SAARE audit devices fail -> Vault requests REFUSE karта hai; WORM store par ship karो. (5) LEASES / TTL — credentials expire. Vault: har token ki TTL + max_ttl; expired token dead. CLOUD: AWS Secrets Manager (resource+IAM policy / IAM role / CloudTrail / Lambda rotation), GCP Secret Manager (IAM binding / Workload Identity Federation / Cloud Audit Logs), Azure Key Vault (RBAC/access policy / managed identity / Azure Monitor).',
      },
      {
        task: 'In a comment, explain why a single shared long-lived Vault token is an anti-pattern (four distinct failures) and describe the per-workload Kubernetes auth flow that replaces it.',
        taskHi: 'Ek comment mein, samjhाओ ek single shared long-lived Vault token ek anti-pattern kyun hai aur per-workload Kubernetes auth flow describe karो.',
        hint: 'A SINGLE SHARED, NON-EXPIRING, BROAD-POLICY TOKEN undoes EVERY benefit of running a manager — FOUR DISTINCT FAILURES: (1) NEVER EXPIRES -> a copy that leaks (a CI log, a laptop, a screenshot, a memory dump) is valid FOREVER. (2) SHARED -> must be distributed to ~15 places (CI secret stores, Terraform vars, config management, `.env` files "for local dev", a shared password vault) — each an exposure surface — and can\'t be rotated without a coordinated change across ALL of them, so IN PRACTICE IT NEVER IS. (3) BROAD POLICY (because "it needs to cover everyone") -> a SINGLE leak grants access to EVERY secret, not just the one the leaker\'s service uses. (4) EVERY SERVICE PRESENTS THE SAME TOKEN -> the audit log attributes every read to "the shared token" and CANNOT tell you which service or person was the source -> it DESTROYS the forensic value that is a main reason to have audit logging. THE PER-WORKLOAD KUBERNETES AUTH FLOW THAT REPLACES IT: (a) enable the Kubernetes auth method; bind a role: `vault write auth/kubernetes/role/prod-api bound_service_account_names=api bound_service_account_namespaces=prod policies=prod-api-ro ttl=1h`. (b) the workload (via the Vault Agent Injector sidecar / the Secrets Store CSI provider / an SDK) reads its own ServiceAccount JWT from `/var/run/secrets/kubernetes.io/serviceaccount/token`. (c) it calls `POST auth/kubernetes/login` with `role=prod-api` and that JWT. (d) Vault validates the JWT against the cluster\'s TokenReview API, confirms the SA+namespace match the role\'s bounds, and issues a token: `policy=prod-api-ro`, `ttl=1h`, renewable to a bounded `max_ttl` (e.g. 24h). (e) the sidecar renews the lease automatically and writes the fetched secrets to a shared in-memory (`emptyDir` / tmpfs) volume; THE APP READS A FILE and never sees a Vault token. RESULT: no shared secret; a compromised pod\'s token dies in <=1h and only ever had `prod-api-ro`; the audit log says "serviceaccount prod/api read secret/data/prod/api/db at <time>"; revoke ONE role without touching anything else. (Cloud equivalents: IAM roles / IRSA, GCP Workload Identity Federation, Azure managed identities.)',
        hintHi: 'EK SINGLE SHARED, NON-EXPIRING, BROAD-POLICY TOKEN — CHAAR DISTINCT FAILURES: (1) KABHI EXPIRE NAHI -> ek leak (CI log, laptop, screenshot, memory dump) HAMESHA valid. (2) SHARED -> ~15 jagah distribute (CI stores, Terraform vars, `.env`), har ek exposure surface, coordinated change ke bina rotate nahi ho sakta -> PRACTICE MEIN KABHI NAHI HOTA. (3) BROAD POLICY -> ek SINGLE leak HAR secret tak access. (4) HAR SERVICE SAME TOKEN -> audit log "the shared token" attribute karta hai, source nahi bata sakta -> forensic value DESTROY. REPLACEMENT — KUBERNETES AUTH FLOW: (a) `vault write auth/kubernetes/role/prod-api bound_service_account_names=api bound_service_account_namespaces=prod policies=prod-api-ro ttl=1h`. (b) workload apni ServiceAccount JWT `/var/run/secrets/...` se padhta hai. (c) `POST auth/kubernetes/login role=prod-api jwt=<JWT>`. (d) Vault JWT ko TokenReview API se validate karta hai, ek token issue karta hai (`policy=prod-api-ro`, `ttl=1h`, renewable to max_ttl). (e) sidecar lease renew karta hai + secrets ek shared tmpfs volume mein likhta hai; APP EK FILE PADHTI HAI. RESULT: no shared secret; compromised pod token <=1h mein dead; audit log real SA name karta hai.',
      },
      {
        task: 'In a comment, explain the audit device: what it records, why Vault treats it as mandatory, why values are HMAC-hashed, why it must ship to an immutable store, and the incident question it answers.',
        taskHi: 'Ek comment mein, audit device samjhाओ: kya record karta hai, Vault ise mandatory kyun treat karta hai, values HMAC-hashed kyun hain.',
        hint: 'AN AUDIT DEVICE is the component that makes a secrets manager USEFUL DURING AN INCIDENT — without it, Vault stores + serves secrets but keeps NO record of access. WHAT IT RECORDS: every request — every authentication, every read, every write — as a JSON line: `{time, auth: {display_name: "serviceaccount/prod/api", policies, ...}, request: {operation: "read", path: "secret/data/prod/api/stripe", ...}, response: {status: 200}}`. Enable with `vault audit enable file file_path=/vault/audit/audit.log` (or `socket` -> a log pipeline, or `syslog`). WHY VAULT TREATS IT AS MANDATORY, NOT BEST-EFFORT: if ALL configured audit devices fail to write, Vault STOPS SERVICING REQUESTS rather than operating silently — the reasoning is that a secrets manager with no audit trail is worse than one that\'s briefly unavailable, because you\'d be handing out credentials with no record. (Configure 2+ devices so one failing doesn\'t halt Vault.) WHY VALUES ARE HMAC-HASHED (not plaintext): so the audit log is NOT ITSELF A SECRET STORE — you can ship it, index it, grant broad read access to responders, and store it long-term without it becoming the highest-value target in your estate. You can still CORRELATE (the same secret value hashes to the same HMAC) without exposing the value. WHY IT MUST SHIP TO AN IMMUTABLE / APPEND-ONLY STORE (S3 Object Lock, a SIEM with immutable retention, a WORM volume): a compromised Vault OPERATOR account (or an attacker who pivots to the Vault host) could otherwise DELETE the record of their own activity — the evidence lives outside their reach. THE INCIDENT QUESTION IT ANSWERS: "an alert fires that the prod Stripe key is being used from an unknown IP — was the key read from Vault by something it shouldn\'t have been, and when?" WITH audit: a query — `grep` the audit log for reads of `secret/data/prod/api/stripe`, list the identities + timestamps, check for anomalous access before the alert. WITHOUT audit: NO ANSWER — you can\'t tell if it leaked from Vault, from a pod\'s memory, from a log, or was never in Vault; the incident timeline has a blank where the most important evidence should be.',
        hintHi: 'EK AUDIT DEVICE wo component hai jо ek secrets manager ko INCIDENT KE DAURAAN USEFUL banata hai — iske bina Vault secrets store+serve karta hai par access ka KOI record nahi. KYA RECORD KARTA HAI: har request (auth, read, write) ek JSON line ke roop mein: `{time, auth identity, path, operation, response status}`. `vault audit enable file|socket|syslog`. VAULT ISE MANDATORY KYUN: agar SAARE audit devices likhne mein fail -> Vault requests SERVICE KARNA BAND karta hai (2+ devices configure karo). VALUES HMAC-HASHED KYUN: taaki log KHUD EK SECRET STORE NA HO — ship/index/broad-read kar sakte ho; correlate kar sakte ho (same value -> same HMAC) bina value expose kiye. IMMUTABLE STORE PAR KYUN (S3 Object Lock, WORM): ek compromised Vault OPERATOR apni activity ka record DELETE na kar sake. JO SAWAAL YE ANSWER KARTA HAI: "prod Stripe key ek unknown IP se use ho rahi hai — kya ise Vault se kisi galat cheez ne padha, aur kab?" AUDIT KE SAATH: ek query. AUDIT KE BINA: KOI ANSWER NAHI — timeline mein blank.',
      },
    ],

    keyTakeaways: [
      'A SECRETS MANAGER = store + policies + auth + audit + leases, NOT "encrypted string storage". Using one with a shared token, a broad policy, and no audit device throws away every benefit and leaves you with an encrypted file plus a network hop.',
      'THE STORE is a path tree (`secret/data/prod/api`) — structure by env → app → purpose; paths are the unit of access control. POLICIES grant specific capabilities (`read`/`write`/`list`) on specific paths, DEFAULT-DENY; grant the NARROWEST that works (no `list` on the parent so siblings can\'t be enumerated), expand only via reviewed change, and test policies like code (assert the negative cases).',
      'AUTH: the app never holds a long-lived token. It proves its identity — a Kubernetes ServiceAccount JWT, an AWS IAM role (IRSA), or an AppRole — and Vault issues a token scoped to that identity\'s policy with a short TTL. A single shared long-lived token never expires, must be copied everywhere (so never rotates), grants everything on one leak, and makes the audit log say "the shared token" for every read.',
      'AUDIT is mandatory, not optional: every auth + read + write recorded with identity/path/operation/result; secret values HMAC-hashed so the log isn\'t sensitive; shipped to an append-only store so a compromised admin can\'t wipe it; Vault refuses requests if all audit devices fail. This is how you answer "who read the prod DB password and when" after an incident.',
      'LEASES/TTL: tokens expire, so a leaked token is useful only for its remaining lifetime (minutes/hours). Dynamic secrets (Lesson 3) lease the credential itself. CLOUD EQUIVALENTS map the same five ideas: AWS Secrets Manager (resource+IAM policy / IAM role / CloudTrail), GCP Secret Manager (IAM binding / Workload Identity Federation / Cloud Audit Logs), Azure Key Vault (RBAC or access policy / managed identity / Azure Monitor).',
    ],
    keyTakeawaysHi: [
      'EK SECRETS MANAGER = store + policies + auth + audit + leases, "encrypted string storage" NAHI. Ise ek shared token, ek broad policy, aur koi audit device ke saath use karna har benefit phenk deta hai.',
      'STORE ek path tree hai (`secret/data/prod/api`) — env → app → purpose se structure karo; paths access control ki unit hain. POLICIES specific paths par specific capabilities grant karti hain (`read`/`write`/`list`), DEFAULT-DENY; SABSE NARROW grant karo (parent par koi `list` nahi), sirf reviewed change se expand karo, policies ko code ki tarah test karo (negative cases assert karo).',
      'AUTH: app kabhi ek long-lived token nahi rakhti. Ye apni identity saabit karti hai — ek Kubernetes ServiceAccount JWT, ek AWS IAM role (IRSA), ya ek AppRole — aur Vault us identity ki policy se scoped ek token issue karta hai ek short TTL ke saath. Ek single shared long-lived token kabhi expire nahi hota, har jagah copy karna padta hai (to kabhi rotate nahi hota), ek leak par sab kuch grant karta hai, aur audit log ko har read ke liye "the shared token" kehne par majboor karta hai.',
      'AUDIT mandatory hai, optional nahi: har auth + read + write identity/path/operation/result ke saath recorded; secret values HMAC-hashed taaki log sensitive na ho; ek append-only store par shipped taaki ek compromised admin ise wipe na kar sake; Vault requests refuse karta hai agar saare audit devices fail hote hain. Ye hai jaise aap ek incident ke baad "prod DB password kisne padha aur kab" answer karte ho.',
      'LEASES/TTL: tokens expire hote hain, to ek leaked token sirf iski remaining lifetime ke liye useful hai. Dynamic secrets (Lesson 3) credential khud ko lease karte hain. CLOUD EQUIVALENTS same paanch ideas map karte hain: AWS Secrets Manager (resource+IAM policy / IAM role / CloudTrail), GCP Secret Manager (IAM binding / Workload Identity Federation / Cloud Audit Logs), Azure Key Vault (RBAC ya access policy / managed identity / Azure Monitor).',
    ],
  },

  {
    slug: 'ops-dynamic-secrets-short-lived-credentials-and-rotation',
    title: 'Dynamic Secrets, Short-Lived Credentials & Rotation',
    titleHi: 'Dynamic Secrets, Short-Lived Credentials Aur Rotation',
    description:
      'A static secret is one you create once and hope nobody copies. A dynamic secret is generated on demand for one consumer, carries a lease, and is automatically revoked when the lease ends — so a leaked credential is useless within minutes and there is nothing to rotate. This lesson covers dynamic database and cloud credentials, leases and TTLs, encryption-as-a-service (so the app never holds the key), the "secret zero" bootstrap problem, and how rotation works for the secrets that must stay static.',
    descriptionHi:
      'Ek static secret wo hai jise aap ek baar create karte ho aur ummeed karte ho koi copy na kare. Ek dynamic secret ek consumer ke liye demand par generated hai, ek lease carry karta hai, aur lease khatam hone par automatically revoked hai — to ek leaked credential minutes ke andar useless hai aur rotate karne ke liye kuch nahi hai. Ye lesson dynamic database aur cloud credentials cover karta hai, leases aur TTLs, encryption-as-a-service (taaki app kabhi key na rakhe), "secret zero" bootstrap problem, aur un secrets ke liye rotation kaise kaam karta hai jinhe static rehna hai.',
    difficulty: 'HARD',
    duration: 26,
    order: 3,

    analogy: {
      en: '**A hotel key card versus a house key.** A house key is a static secret: it is cut once, everyone who has ever held it can copy it, and if one goes missing you have to re-key the lock and re-issue every copy. A hotel key card is a dynamic secret: the front desk generates a fresh one for you when you check in, it only works for your room, it stops working automatically at checkout, and if you lose it the desk deactivates that one card and prints another in ten seconds without touching anyone else\'s. A leaked hotel card found next week opens nothing. That is the whole point of dynamic, leased credentials — the blast radius of a leak is bounded by the lease, and revocation is instant and surgical.',
      hi: '**Ek hotel key card versus ek ghar ki key.** Ek ghar ki key ek static secret hai: ise ek baar cut kiya jata hai, har koi jisne ise kabhi hold kiya copy kar sakta hai, aur agar ek gum ho jati hai to aapko lock re-key karna aur har copy re-issue karna padta hai. Ek hotel key card ek dynamic secret hai: front desk aapke check in karne par ek fresh generate karta hai, ye sirf aapke room ke liye kaam karta hai, ye checkout par automatically kaam karna band kar deta hai, aur agar aap ise kho dete ho desk us ek card ko deactivate karta hai aur das seconds mein doosra print karta hai. Ek leaked hotel card jo agle hafte mila kuch nahi kholta. Ye dynamic, leased credentials ka poora point hai.',
    },

    simple: `**STATIC vs DYNAMIC SECRET:**
\`\`\`
STATIC   one long-lived value. created once, shared, lives in the manager + the
         app's memory + maybe a cache. leak = it's valid until someone rotates it
         (often "never"). you rotate on a schedule + after every suspected leak.
DYNAMIC  generated ON DEMAND, per consumer, with a LEASE (TTL). Vault creates a
         NEW database user / cloud key / SSH cert each time an app asks. when the
         lease expires (or is revoked), Vault DELETES that user / key.
         leak = useless in <= the lease TTL. nothing to rotate - it self-destructs.
         and each consumer has its OWN creds -> the audit trail is per-consumer.
\`\`\`

**DYNAMIC DATABASE CREDENTIALS (the classic example):**
\`\`\`
1. configure once: Vault gets an ADMIN db connection + a "role" =
   a CREATE USER template + a default_ttl (e.g. 1h) + max_ttl (24h).
2. app authenticates (Lesson 2) -> 'vault read database/creds/app-role'
   -> Vault runs  CREATE USER "v-app-x8Kd2" ... GRANT SELECT ON app.* ...
   -> returns { username: v-app-x8Kd2, password: <random>, lease_id: ..., ttl: 3600 }
3. app connects with those. the sidecar renews the lease before it lapses.
4. lease ends / pod dies / 'vault lease revoke' -> Vault runs  DROP USER "v-app-x8Kd2".
=> a stolen DB password is dead within the hour AND only ever had that role's grants.
\`\`\`

**DYNAMIC CLOUD CREDENTIALS:** Vault's AWS/GCP/Azure secrets engines issue
short-lived IAM users/STS tokens / service-account keys the same way. an app that
needs S3 access for 20 minutes gets a 20-minute credential, not a standing key.

**ENCRYPTION AS A SERVICE (transit engine) — the app never holds the key:**
\`\`\`
the app sends PLAINTEXT to Vault -> gets CIPHERTEXT back (\`vault:v1:...\`). to read,
it sends the ciphertext -> gets plaintext. the AES key NEVER leaves Vault.
- a DB dump / a stolen backup is useless without Vault.
- KEY ROTATION: 'rotate' bumps to v2. NEW writes use v2; OLD \`vault:v1:\` blobs
  still decrypt. 'rewrap' upgrades an old blob to v2 WITHOUT the app seeing plaintext.
- 'min_decryption_version' can then retire v1 entirely.
\`\`\`

**"SECRET ZERO" — the bootstrap problem:**
\`\`\`
the app needs a secret to authenticate to Vault to get its secrets. what protects
THAT one? answers, best to worst:
  - a PLATFORM-PROVIDED identity: the k8s ServiceAccount token / cloud instance
    metadata (IMDSv2) / SPIFFE SVID. NOT a secret you manage - the platform mints
    + rotates it, and it's only valid from that workload. (this is Lesson 5.)
  - a SHORT-LIVED, SINGLE-USE token delivered out-of-band at deploy (AppRole secret_id
    with num_uses=1, ttl=few min) - a "response wrapping" token is opened once.
  - WORST: a long-lived AppRole secret_id / token baked into config. avoid.
\`\`\`

**ROTATING THE SECRETS THAT MUST STAY STATIC (a 3rd-party API key with no dynamic option):**
\`\`\`
- Vault / AWS Secrets Manager / GCP can run a ROTATION function on a schedule:
  call the provider's "create new key" API, write the new value as a new version,
  verify it works, then disable the old one (overlap window = zero downtime).
- consumers read "the current version" each time (or get pushed an update) - they
  are not pinned to a version.
- rotation is only real if you've TESTED that consumers pick up the new value
  without a redeploy. an untested rotation is a scheduled outage.
\`\`\``,

    simpleHi: `**STATIC vs DYNAMIC SECRET:**
\`\`\`
STATIC   ek long-lived value. ek baar created, shared, manager + app ki memory +
         shायद ek cache mein rehta hai. leak = ye tab tak valid hai jab tak koi rotate
         na kare (aksar "kabhi nahi"). aap ek schedule par + har suspected leak ke baad rotate karte ho.
DYNAMIC  DEMAND par generated, per consumer, ek LEASE (TTL) ke saath. Vault ek NAYA
         database user / cloud key / SSH cert har baar create karta hai jab ek app poochta hai.
         jab lease expire hoti hai (ya revoked), Vault us user / key ko DELETE karta hai.
         leak = <= lease TTL mein useless. rotate karne ke liye kuch nahi - ye self-destruct karta hai.
         aur har consumer ke apne creds hain -> audit trail per-consumer hai.
\`\`\`

**DYNAMIC DATABASE CREDENTIALS (classic example):**
\`\`\`
1. ek baar configure: Vault ek ADMIN db connection + ek "role" paata hai =
   ek CREATE USER template + ek default_ttl (e.g. 1h) + max_ttl (24h).
2. app authenticate karti hai (Lesson 2) -> 'vault read database/creds/app-role'
   -> Vault chalata hai  CREATE USER "v-app-x8Kd2" ... GRANT SELECT ON app.* ...
   -> returns { username: v-app-x8Kd2, password: <random>, lease_id: ..., ttl: 3600 }
3. app un se connect karti hai. sidecar lease ke lapse hone se pehle renew karta hai.
4. lease khatam / pod marta hai / 'vault lease revoke' -> Vault chalata hai  DROP USER "v-app-x8Kd2".
=> ek stolen DB password ek ghante ke andar dead hai AUR sirf us role ke grants the.
\`\`\`

**DYNAMIC CLOUD CREDENTIALS:** Vault ke AWS/GCP/Azure secrets engines short-lived IAM
users/STS tokens / service-account keys usi tarah issue karte hain. ek app jise 20
minute ke liye S3 access chahiye ek 20-minute credential paata hai, ek standing key nahi.

**ENCRYPTION AS A SERVICE (transit engine) — app kabhi key nahi rakhti:**
\`\`\`
app PLAINTEXT Vault ko bhejti hai -> CIPHERTEXT wapas paati hai (\`vault:v1:...\`). padhne ke liye,
ye ciphertext bhejti hai -> plaintext paati hai. AES key KABHI Vault nahi chhodti.
- ek DB dump / ek stolen backup Vault ke bina useless hai.
- KEY ROTATION: 'rotate' v2 par bump karta hai. NAYE writes v2 use karte hain; PURANE
  \`vault:v1:\` blobs abhi bhi decrypt hote hain. 'rewrap' ek purane blob ko v2 mein
  upgrade karta hai BINA app ke plaintext dekhe.
- 'min_decryption_version' phir v1 ko poori tarah retire kar sakta hai.
\`\`\`

**"SECRET ZERO" — bootstrap problem:**
\`\`\`
app ko Vault se authenticate karne ke liye ek secret chahiye apne secrets paane ke liye.
US ek ko kya protect karta hai? answers, best se worst:
  - ek PLATFORM-PROVIDED identity: k8s ServiceAccount token / cloud instance metadata
    (IMDSv2) / SPIFFE SVID. NAHI ek secret jo aap manage karte ho - platform ise mint
    + rotate karta hai, aur ye sirf us workload se valid hai. (ye Lesson 5 hai.)
  - ek SHORT-LIVED, SINGLE-USE token deploy par out-of-band delivered (AppRole secret_id
    num_uses=1, ttl=few min) - ek "response wrapping" token ek baar khola jaata hai.
  - WORST: ek long-lived AppRole secret_id / token config mein baked. avoid karo.
\`\`\`

**UN SECRETS KO ROTATE KARNA JINHE STATIC REHNA HAI (ek 3rd-party API key bina dynamic option ke):**
\`\`\`
- Vault / AWS Secrets Manager / GCP ek ROTATION function ek schedule par chala sakte hain:
  provider ki "create new key" API call karo, naya value ek nayi version ke roop mein likho,
  verify karo ye kaam karta hai, phir purane ko disable karo (overlap window = zero downtime).
- consumers har baar "current version" padhte hain (ya ek update pushed milta hai) - wo
  ek version se pinned nahi hain.
- rotation sirf tab real hai jab aapne TEST kiya ki consumers naya value bina ek redeploy ke
  pick karte hain. ek untested rotation ek scheduled outage hai.
\`\`\``,

    content: `## Static versus dynamic

A static secret is a single long-lived value: you create it once, distribute it to the consumers that need it, and it sits in the manager, in each application\'s memory, and possibly in caches and config. If it leaks, it stays valid until someone actively rotates it, which in practice is often much later than it should be, and while it is valid an attacker holding it has whatever access it grants. A dynamic secret is generated on demand, uniquely for the consumer that requested it, and it carries a lease with a time-to-live. Vault creates a brand-new credential — a database user, a cloud access key, an SSH certificate — each time an application asks, and when the lease expires or is explicitly revoked, Vault destroys that credential: it runs \`DROP USER\`, deletes the cloud key, invalidates the certificate. A leaked dynamic credential is therefore useless once its short lease elapses, there is nothing to rotate because it self-destructs, and because every consumer gets its own credential, the audit trail attributes activity to a specific consumer rather than to a shared account.

## Dynamic database credentials

This is the canonical example. You configure it once: Vault is given an administrative connection to the database and a "role" that consists of a \`CREATE USER\` statement template, a default lease TTL such as one hour, and a maximum TTL such as a day. When an application needs database access, it authenticates to Vault with its workload identity and reads the role\'s credentials path. Vault executes the template — \`CREATE USER "v-app-x8Kd2..." WITH PASSWORD '...'; GRANT SELECT ON app.* TO ...\` — and returns a fresh username, a random password, a lease ID, and the TTL. The application connects with those credentials, and a sidecar or the application\'s own logic renews the lease before it lapses. When the lease finally ends — because the pod was deleted, or the max TTL was reached, or an operator ran \`vault lease revoke\` — Vault runs \`DROP USER "v-app-x8Kd2..."\` and that credential is gone. A database password stolen from this system is dead within the hour and only ever carried that one role\'s grants.

## Dynamic cloud credentials

Vault\'s AWS, GCP, and Azure secrets engines apply the same pattern to cloud access. Instead of giving an application a standing IAM user with an access key, you configure a role that maps to an IAM policy, and the application requests credentials when it needs them and receives a short-lived IAM user or an STS token scoped to that policy, with a lease. A batch job that needs to write to an S3 bucket for twenty minutes gets a twenty-minute credential, and there is no long-lived key sitting in its environment for an attacker to find.

## Encryption as a service

Vault\'s transit engine lets an application encrypt and decrypt data without ever possessing the encryption key. The application sends plaintext to Vault and receives ciphertext prefixed with a key version, like \`vault:v1:...\`; to read the data back it sends the ciphertext and receives the plaintext. The AES key never leaves Vault, so a stolen database dump or backup file is meaningless without also compromising Vault. Key rotation is a single operation: \`rotate\` advances the key to version 2, after which new encryptions use v2 while existing \`vault:v1:\` values still decrypt because Vault retains old key versions. The \`rewrap\` operation re-encrypts an old ciphertext to the current version without the application ever seeing the plaintext, so you can migrate stored data forward, and once everything is rewrapped, \`min_decryption_version\` can retire the old key version entirely.

## Secret zero

Every scheme for delivering secrets to an application has a bootstrap problem: the application needs some credential to authenticate to the secrets manager in the first place, and something has to protect that one. The answers, from best to worst. The best is a platform-provided identity that is not a secret you manage at all: the Kubernetes ServiceAccount token that the kubelet injects, the cloud instance identity available through the instance metadata service (with IMDSv2 to prevent SSRF abuse), or a SPIFFE SVID issued by the platform. These are minted and rotated by the platform, are only valid from the specific workload they were issued to, and are covered in Lesson 5. Next best is a short-lived, single-use token delivered out of band at deploy time — an AppRole \`secret_id\` created with \`num_uses=1\` and a TTL of a few minutes, or a response-wrapping token that can be unwrapped exactly once and reveals tampering if intercepted. The worst option, to be avoided, is a long-lived AppRole \`secret_id\` or Vault token baked into configuration or an image, which just moves secret zero to the same insecure places this whole module is about not using.

## Rotating the secrets that must stay static

Some secrets cannot be dynamic — a third-party API key for a service that only issues long-lived keys, for instance. For these, rotation is the mitigation, and a secrets manager can automate it. Vault, AWS Secrets Manager, and GCP Secret Manager can run a rotation function on a schedule that calls the provider\'s "create a new key" API, writes the new value as a new secret version, verifies the new key works, and then disables the old key — with an overlap window during which both keys are valid so there is no moment when requests fail. Consumers must read the current version each time they need the secret, or receive a push notification of the change, rather than being pinned to a specific version. And rotation is only real if you have actually tested that consumers pick up the new value without being redeployed — an automated rotation against consumers that cache the old value forever is a scheduled outage, not a security control.`,

    contentHi: `## Static versus dynamic

Ek static secret ek single long-lived value hai: aap ise ek baar create karte ho, ise un consumers ko distribute karte ho jinhe iski zaroorat hai, aur ye manager mein, har application ki memory mein, aur shायद caches aur config mein baithta hai. Agar ye leak hota hai, ye tab tak valid rehta hai jab tak koi actively rotate na kare, jo practice mein aksar bahut baad mein hota hai. Ek dynamic secret demand par generated hai, uniquely us consumer ke liye jisne ise request kiya, aur ye ek TTL wali ek lease carry karta hai. Vault ek brand-new credential — ek database user, ek cloud access key, ek SSH certificate — har baar create karta hai jab ek application poochti hai, aur jab lease expire hoti hai ya explicitly revoked hai, Vault us credential ko destroy karta hai. Ek leaked dynamic credential isliye useless hai jab iski short lease elapse hoti hai, rotate karne ke liye kuch nahi hai kyunki ye self-destruct karta hai.

## Dynamic database credentials

Ye canonical example hai. Aap ise ek baar configure karte ho: Vault ko database ke liye ek administrative connection diya jata hai aur ek "role" jo ek \`CREATE USER\` statement template, ek default lease TTL jaise ek ghanta, aur ek maximum TTL jaise ek din se banti hai. Jab ek application ko database access chahiye, ye Vault ko apni workload identity se authenticate karti hai aur role ke credentials path ko padhti hai. Vault template execute karta hai — \`CREATE USER "v-app-x8Kd2..." WITH PASSWORD '...'; GRANT SELECT ON app.* ...\` — aur ek fresh username, ek random password, ek lease ID, aur TTL return karta hai. Jab lease finally khatam hoti hai, Vault \`DROP USER "v-app-x8Kd2..."\` chalata hai aur wo credential chala gaya.

## Dynamic cloud credentials

Vault ke AWS, GCP, aur Azure secrets engines same pattern cloud access par apply karte hain. Ek application ko ek standing IAM user ek access key ke saath dene ke bजाy, aap ek role configure karte ho jo ek IAM policy se map hota hai, aur application credentials request karti hai jab ise chahiye aur ek short-lived IAM user ya ek STS token receive karti hai. Ek batch job jise 20 minute ke liye ek S3 bucket par write karna hai ek 20-minute credential paata hai.

## Encryption as a service

Vault ka transit engine ek application ko data encrypt aur decrypt karne deta hai bina kabhi encryption key possess kiye. Application plaintext Vault ko bhejti hai aur ek key version se prefixed ciphertext receive karti hai, jaise \`vault:v1:...\`. AES key kabhi Vault nahi chhodti, to ek stolen database dump ya backup file Vault ko bhi compromise kiye bina meaningless hai. Key rotation ek single operation hai: \`rotate\` key ko version 2 par advance karta hai, jiske baad naye encryptions v2 use karte hain jabki existing \`vault:v1:\` values abhi bhi decrypt hote hain. \`rewrap\` operation ek purane ciphertext ko current version par re-encrypt karta hai bina application ke kabhi plaintext dekhe.

## Secret zero

Ek application ko secrets deliver karne ki har scheme ki ek bootstrap problem hoti hai: application ko pehli jagah secrets manager ko authenticate karne ke liye kuch credential chahiye, aur kuch ko us ek ko protect karna hai. Best ek platform-provided identity hai jo ek secret nahi hai jo aap manage karte ho: Kubernetes ServiceAccount token jo kubelet inject karta hai, cloud instance identity jo instance metadata service ke through available hai (IMDSv2 ke saath), ya ek SPIFFE SVID. Next best ek short-lived, single-use token hai jo deploy time par out of band delivered hai. Worst option, avoid karne ke liye, ek long-lived AppRole \`secret_id\` ya Vault token hai jo configuration ya ek image mein baked hai.

## Un secrets ko rotate karna jinhe static rehna hai

Kuch secrets dynamic nahi ho sakte — ek third-party API key ek service ke liye jo sirf long-lived keys issue karti hai. Inke liye, rotation mitigation hai. Vault, AWS Secrets Manager, aur GCP Secret Manager ek rotation function ek schedule par chala sakte hain jo provider ki "create a new key" API call karta hai, naye value ko ek nayi secret version ke roop mein likhta hai, verify karta hai naya key kaam karta hai, aur phir purane key ko disable karta hai — ek overlap window ke saath jiske dauraan dono keys valid hain. Rotation sirf tab real hai jab aapne actually test kiya ki consumers naya value bina redeployed hue pick karte hain.`,

    examples: [
      {
        title: 'Transit engine: encrypt without holding the key, rotate it, and rewrap old data',
        titleHi: 'Transit engine: key rakhe bina encrypt karo, ise rotate karo, aur purana data rewrap karo',
        code: `# VERIFY
PORT=$(( (RANDOM % 20000) + 20000 ))
export VAULT_ADDR="http://127.0.0.1:\$PORT" VAULT_TOKEN=root
vault server -dev -dev-root-token-id=root -dev-listen-address="127.0.0.1:\$PORT" > /tmp/vault-dev.log 2>&1 &
VPID=\$!
trap 'kill \$VPID 2>/dev/null' EXIT
for i in \$(seq 1 20); do vault status >/dev/null 2>&1 && break; sleep 0.5; done

vault secrets enable transit > /dev/null
vault write -f transit/keys/orders > /dev/null           # the AES key is created IN Vault

# the app encrypts card data - it sends plaintext, gets ciphertext. it never sees the key.
PT=\$(printf 'card=4111111111111111' | base64)
CT=\$(vault write -field=ciphertext transit/encrypt/orders plaintext="\$PT")
echo "app stores this in its DB: \$(echo "\$CT" | grep -oE '^vault:v[0-9]+:')<opaque base64>"

echo "--- to read it back, the app asks Vault to decrypt: ---"
vault write -field=plaintext transit/decrypt/orders ciphertext="\$CT" | base64 -d; echo

echo "--- key rotation: bump to v2, v3. NEW writes use the latest; OLD blobs still decrypt ---"
vault write -f transit/keys/orders/rotate > /dev/null
vault write -f transit/keys/orders/rotate > /dev/null
echo "latest key version: \$(vault read -field=latest_version transit/keys/orders)"
NEW=\$(vault write -field=ciphertext transit/encrypt/orders plaintext="\$PT")
echo "a new encryption now uses: \$(echo "\$NEW" | grep -oE '^vault:v[0-9]+:')"
echo "the old v1 blob still decrypts: \$(vault write -field=plaintext transit/decrypt/orders ciphertext="\$CT" | base64 -d)"

echo "--- rewrap: upgrade the old blob to the current key WITHOUT the app seeing plaintext ---"
RW=\$(vault write -field=ciphertext transit/rewrap/orders ciphertext="\$CT")
echo "the rewrapped blob is now: \$(echo "\$RW" | grep -oE '^vault:v[0-9]+:')"`,
        output: `app stores this in its DB: vault:v1:<opaque base64>
--- to read it back, the app asks Vault to decrypt: ---
card=4111111111111111
--- key rotation: bump to v2, v3. NEW writes use the latest; OLD blobs still decrypt ---
latest key version: 3
a new encryption now uses: vault:v3:
the old v1 blob still decrypts: card=4111111111111111
--- rewrap: upgrade the old blob to the current key WITHOUT the app seeing plaintext ---
the rewrapped blob is now: vault:v3:`,
        explain: 'The transit engine is encryption as a service: the application delegates the cryptography to Vault and never holds the key. Here a key \`orders\` is created inside Vault. The application encrypts a card number by sending the plaintext and getting back a ciphertext string tagged \`vault:v1:\` — it stores that opaque string in its database, and a stolen copy of that database is useless to anyone who cannot also call Vault, because the AES key that would decrypt it never left Vault. Reading the value back means asking Vault to decrypt. Rotating the key is one command run twice here, taking it to version 3: from that point new encryptions are tagged \`vault:v3:\`, but the old \`vault:v1:\` blob still decrypts because Vault keeps prior key versions. The \`rewrap\` operation then re-encrypts the old blob to version 3 without the plaintext ever being exposed to the caller — the application can run this over its stored data as a background migration, and once everything is on the current version, the old key version can be disabled so a compromise of an archived v1 key protects nothing. All of this runs against a real Vault in dev mode on a random port, torn down by the trap.',
        explainHi: 'Transit engine encryption as a service hai: application cryptography ko Vault ko delegate karti hai aur kabhi key nahi rakhti. Yahaan ek key \`orders\` Vault ke andar create hoti hai. Application ek card number encrypt karti hai plaintext bhej kar aur ek ciphertext string wapas paakar jo \`vault:v1:\` tagged hai — ye us opaque string ko apne database mein store karti hai, aur us database ki ek stolen copy kisi ke liye useless hai jo Vault call nahi kar sakta, kyunki AES key jo ise decrypt karti kabhi Vault nahi chhodi. Key rotate karna yahaan do baar chalaya gaya ek command hai, ise version 3 par le jata hai: us point se naye encryptions \`vault:v3:\` tagged hain, par purana \`vault:v1:\` blob abhi bhi decrypt hota hai. \`rewrap\` operation phir purane blob ko version 3 par re-encrypt karta hai bina plaintext ke kabhi caller ko exposed hue.',
      },
    ],

    mistakes: [
      {
        wrong: `# a static DB password for the app, shared, rotated "annually" (in practice never)
  # secret/data/prod/api  { db_password: "P@ssw0rd-set-in-2021" }
  # every app instance uses it. it's in Vault, in each pod's memory, in a cache
  # layer's config, in the DBA's password manager, and in an old runbook.
  # a pod is compromised via an RCE. the attacker reads /proc/1/environ, gets the
  # DB password, and now has FULL app-user access to the production database -
  # for as long as they want, because nobody will rotate it until the annual
  # review, and even then "carefully, it's used everywhere".`,
        right: `# dynamic DB credentials: a fresh, leased, least-privilege user per request
  # configure once:
  vault write database/config/appdb \\
     plugin_name=postgresql-database-plugin \\
     connection_url="postgresql://{{username}}:{{password}}@db:5432/app" \\
     allowed_roles="app-ro" username="vault-admin" password="<admin-pw>"
  vault write database/roles/app-ro \\
     db_name=appdb \\
     creation_statements="CREATE ROLE \\"{{name}}\\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; \\
                          GRANT SELECT ON ALL TABLES IN SCHEMA public TO \\"{{name}}\\";" \\
     default_ttl=1h max_ttl=24h
  # the app (authenticated per Lesson 2) then:
  #   vault read database/creds/app-ro
  #   -> username=v-app-ro-x8Kd2..., password=<random>, lease_id=..., lease_duration=3600
  # a compromised pod's stolen creds: DROP'd within 1h (or instantly via
  # 'vault lease revoke -prefix database/creds/app-ro'), and only ever had SELECT.`,
        why: 'A static database password shared across every instance of an application is a single high-value target with an unbounded exposure window. It ends up copied into many places over time — pod memory, cache configuration, a DBA\'s password store, old runbooks — and once an attacker obtains it through any of them, they have the application\'s full database access for as long as the password remains valid, which for a static secret that "everything uses" is usually a very long time because rotating it feels risky. Dynamic credentials remove both problems. Vault is configured once with an admin connection and a role that templates a least-privilege user with an expiry; each application instance, after authenticating as itself, requests its own credential and receives a unique username and random password with a one-hour lease. A credential stolen from a compromised pod is automatically dropped when its lease ends, can be revoked instantly for the whole role with one command during an incident, carries only the grants the role specifies rather than full app-user rights, and is attributable in the audit log to the specific instance that requested it. There is no shared long-lived password to find.',
        whyHi: 'Ek static database password jo ek application ke har instance ke across shared hai ek single high-value target hai ek unbounded exposure window ke saath. Ye samay ke saath kई jagah copy ho jata hai — pod memory, cache configuration, ek DBA ka password store, purane runbooks — aur ek baar ek attacker ise kisi bhi se obtain karta hai, unke paas application ka full database access hai jab tak password valid rehta hai. Dynamic credentials dono problems remove karte hain. Vault ek baar ek admin connection aur ek role ke saath configure hota hai jo ek expiry wale ek least-privilege user ko template karta hai; har application instance, apne aap ko authenticate karne ke baad, apna credential request karti hai aur ek unique username aur random password ek one-hour lease ke saath receive karti hai. Ek compromised pod se churaya gaya credential automatically drop hota hai jab iski lease khatam hoti hai.',
      },
      {
        wrong: `# "secret zero": a long-lived Vault token baked into the image / a k8s Secret
  # Dockerfile:  ENV VAULT_TOKEN=hvs.CAESIJ...longtoken...    # <-- in the image forever
  # or:  a hand-created k8s Secret 'vault-token' mounted into every pod, containing
  #      a token with a 768h TTL "so we don't have to deal with renewal"
  # the whole point of Vault was to not have long-lived secrets in images/manifests.
  # this token IS one, it grants Vault access, and it's now in the image layers,
  # the manifest in git, and every pod's filesystem. secret zero defeated the design.`,
        right: `# bootstrap with a platform identity - a thing the platform mints, not a secret
  # k8s: the app's ServiceAccount token (auto-injected at /var/run/secrets/...),
  #      exchanged at Vault's kubernetes auth endpoint for a short-lived token.
  #      NOTHING is baked in - the SA token is minted per-pod by the kubelet,
  #      audience-scoped, and short-lived (projected token, e.g. 1h, auto-rotated).
  serviceAccountName: api
  # (+ vault.hashicorp.com/role: prod-api annotation for the Agent Injector)
  #
  # non-k8s (a VM / CI): AppRole with a SINGLE-USE, short-TTL secret_id:
  vault write -f auth/approle/role/ci-job/secret-id  \\
     num_uses=1 ttl=2m    # <-- valid for one login, for 2 minutes
  # delivered to the job via the CI's own OIDC->Vault trust, or response-wrapped:
  vault write -wrap-ttl=90s -f auth/approle/role/ci-job/secret-id
  # -> a single-use wrapping token; if anyone unwraps it first, the job's unwrap
  #    fails loudly and you know it was intercepted.`,
        why: 'Baking a long-lived Vault token into an image or a hand-written Kubernetes Secret recreates exactly the problem the secrets manager was adopted to solve. That token grants access to Vault, and now it lives in the image layers where \`docker history\` and layer extraction reach it, in the manifest committed to git with permanent history, and on the filesystem of every pod. Giving it a very long TTL to avoid dealing with renewal makes it worse — a leaked copy is valid for weeks. The correct bootstrap uses an identity the platform issues and manages, not a secret you place. On Kubernetes that is the pod\'s ServiceAccount token: the kubelet injects a projected token that is scoped to a specific audience, short-lived, and automatically rotated, and the application exchanges it at Vault\'s Kubernetes auth endpoint for a scoped Vault token — nothing is baked in anywhere. For workloads without a platform identity, such as a CI job or a standalone VM, an AppRole \`secret_id\` created with \`num_uses=1\` and a two-minute TTL is valid for exactly one login within a tiny window, and delivering it response-wrapped means that if it is intercepted, the legitimate consumer\'s unwrap fails and the interception is detected.',
        whyHi: 'Ek long-lived Vault token ko ek image ya ek hand-written Kubernetes Secret mein bake karna exactly wo problem recreate karta hai jise secrets manager solve karne ke liye adopt kiya gaya tha. Wo token Vault tak access grant karta hai, aur ab ye image layers mein rehta hai jahaan \`docker history\` aur layer extraction ise reach karte hain, git mein committed manifest mein, aur har pod ke filesystem par. Ise ek bahut lambi TTL dena ise worse banaता hai. Correct bootstrap ek identity use karta hai jo platform issue aur manage karta hai, ek secret nahi jo aap place karte ho. Kubernetes par wo pod ka ServiceAccount token hai: kubelet ek projected token inject karta hai jo ek specific audience se scoped hai, short-lived, aur automatically rotated. Platform identity ke bina workloads ke liye, ek AppRole \`secret_id\` jo \`num_uses=1\` aur ek two-minute TTL ke saath created hai exactly ek login ke liye valid hai.',
      },
      {
        wrong: `# automated rotation configured, but consumers cache the secret at startup forever
  # AWS Secrets Manager rotation: every 30 days, a Lambda creates a new DB password,
  # updates the secret, disables the old one. looks great in the console.
  # BUT the app reads the secret ONCE, in its constructor, at pod startup:
  #   const dbPass = await secretsManager.getSecretValue({SecretId: 'prod/db'});
  #   this.pool = new Pool({ password: dbPass });   // held for the pod's lifetime
  # day 30: rotation runs. old password disabled. every running pod is still using
  # the OLD password -> connection errors on every new connection -> a partial
  # outage that gets worse as the pool churns, until someone restarts every pod.
  # "rotation" was a scheduled incident.`,
        right: `# consumers must re-fetch on a schedule / on auth failure, with an overlap window
  # 1. the rotation function keeps BOTH passwords valid for an overlap window
  #    (e.g. 1h): create new -> set on the DB user -> update the secret ->
  #    WAIT the overlap -> only THEN remove the old.
  # 2. the app re-reads the secret periodically (a cache with a short TTL) AND
  #    on a connection-auth failure:
  #    - cache the secret for ~5 min, not forever
  #    - on 'password authentication failed', invalidate the cache, re-fetch, retry
  #    - (or: use a client that supports credential providers - AWS RDS IAM auth,
  #       the Secrets Manager JDBC/SDK wrapper, Vault Agent templating a file the
  #       app watches)
  # 3. TEST it: trigger a rotation in staging and confirm ZERO errors. an
  #    untested rotation path is not a control.`,
        why: 'Automated rotation only reduces risk if the consumers of the secret actually adopt the new value; a rotation schedule with consumers that read the secret once at startup and hold it forever is not a security improvement, it is a recurring self-inflicted outage. When the rotation function disables the old credential, every process still using it starts failing authentication, and because connection pools establish new connections continuously the failure spreads until the processes are restarted. Making rotation safe has three parts. The rotation function must maintain an overlap window in which both the old and new credentials are valid — create the new one, apply it, update the stored secret, wait, and only then revoke the old — so there is never an instant when a consumer holding either value fails. The consumers must not treat the secret as immutable: they cache it with a short TTL and re-fetch periodically, and they invalidate the cache and re-fetch on an authentication failure before retrying. And the whole path must be tested by triggering a real rotation in a staging environment and confirming that no errors occur, because a rotation mechanism that has never been exercised against live consumers is an assumption, not a control.',
        whyHi: 'Automated rotation sirf tab risk reduce karta hai agar secret ke consumers actually naya value adopt karte hain; ek rotation schedule un consumers ke saath jo secret ko startup par ek baar padhte hain aur ise hamesha ke liye hold karte hain ek security improvement nahi hai, ye ek recurring self-inflicted outage hai. Jab rotation function purane credential ko disable karta hai, har process jo abhi bhi ise use kar rahi hai authentication fail karna shuru karti hai. Rotation ko safe banaने ke teen parts hain. Rotation function ko ek overlap window maintain karna chahiye jismein purana aur naya dono credentials valid hain. Consumers ko secret ko immutable treat nahi karna chahiye: wo ise ek short TTL ke saath cache karte hain aur periodically re-fetch karte hain. Aur poore path ko ek staging environment mein ek real rotation trigger karke test kiya jana chahिए.',
      },
    ],

    realWorld: [
      {
        en: '**Vault dynamic DB creds at scale** — organisations that move from a shared static DB password to Vault dynamic credentials routinely report that incident response for a compromised service goes from "rotate the shared password and coordinate every consumer" (hours, risky) to "`vault lease revoke -prefix database/creds/<role>`" (seconds, surgical), plus per-service attribution in the audit log.',
        hi: '**Scale par Vault dynamic DB creds** — jo organisations ek shared static DB password se Vault dynamic credentials par move karti hain routinely report karti hain ki ek compromised service ke liye incident response "shared password rotate karo aur har consumer coordinate karo" (hours, risky) se "`vault lease revoke -prefix ...`" (seconds, surgical) tak jata hai.',
      },
      {
        en: '**Cloudflare\'s use of the transit engine pattern** — many companies encrypt sensitive columns (PII, tokens) via an encryption-as-a-service layer so that a database compromise alone yields ciphertext. The recurring lesson: keep the key out of the app and the DB, make rotation a `rewrap` job, and the blast radius of a stolen backup drops to zero.',
        hi: '**Transit engine pattern ka use** — kई companies sensitive columns (PII, tokens) ko ek encryption-as-a-service layer ke via encrypt karti hain taaki ek database compromise akele ciphertext yield kare. Recurring lesson: key ko app aur DB se bahar rakho, rotation ko ek `rewrap` job banao, aur ek stolen backup ka blast radius zero par gir jata hai.',
      },
      {
        en: '**Rotation that caused outages** — multiple postmortems describe an automated secret rotation (AWS Secrets Manager, or a home-grown cron) that disabled the old credential while long-running services still held it, causing a partial outage until a fleet restart. Every fix adds an overlap window + a short client-side cache + a staging rotation test.',
        hi: '**Rotation jisne outages cause kiye** — kई postmortems ek automated secret rotation describe karte hain jisne purane credential ko disable kiya jab long-running services abhi bhi ise hold kar rahi thीं, ek partial outage cause karta hua. Har fix ek overlap window + ek short client-side cache + ek staging rotation test add karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a static and a dynamic secret, and why are dynamic credentials better for incident response?',
        qHi: 'Ek static aur ek dynamic secret mein kya farak hai, aur dynamic credentials incident response ke liye behtar kyun hain?',
        a: 'A static secret is one long-lived value created once and shared among the consumers that need it. It accumulates copies over time — in application memory, caches, config, password stores, runbooks — and if it leaks it stays valid until someone actively rotates it, which for a widely-used secret is usually much later than it should be because rotation feels risky. A dynamic secret is generated on demand, uniquely for the consumer that asked, and carries a lease with a short TTL. Vault creates a fresh database user, cloud key, or certificate each time, and when the lease expires or is revoked, Vault destroys it — runs \`DROP USER\`, deletes the key. For incident response this changes everything. With a static secret, containing a compromised service means rotating the shared credential and coordinating the change across every consumer, which takes hours and risks breaking things. With dynamic credentials, you run one command — \`vault lease revoke -prefix database/creds/<role>\` — and every credential that role ever issued is invalidated in seconds, while the pods re-authenticate and get fresh ones. The stolen credential was also going to expire on its own within the hour regardless, it only ever carried that role\'s least-privilege grants rather than full access, and the audit log attributes it to the specific instance that requested it rather than to a shared account. There is nothing to rotate because the credential self-destructs.',
        aHi: 'Ek static secret ek long-lived value hai jo ek baar create hoti hai aur un consumers ke beech shared hoti hai jinhe iski zaroorat hai. Ye samay ke saath copies accumulate karti hai — application memory, caches, config, password stores, runbooks mein — aur agar ye leak hoti hai ye tab tak valid rehti hai jab tak koi actively rotate na kare. Ek dynamic secret demand par generated hai, uniquely us consumer ke liye jisne poocha, aur ek short TTL wali ek lease carry karta hai. Vault har baar ek fresh database user, cloud key, ya certificate create karta hai, aur jab lease expire hoti hai ya revoked hai, Vault ise destroy karta hai. Incident response ke liye ye sab kuch badalता hai. Ek static secret ke saath, ek compromised service ko contain karne ka matlab shared credential rotate karna aur change ko har consumer ke across coordinate karna hai. Dynamic credentials ke saath, aap ek command chalाते ho aur har credential jo us role ne kabhi issue kiya seconds mein invalidated hai.',
      },
      {
        q: 'What is the "secret zero" problem, and what are the good and bad ways to solve it?',
        qHi: '"Secret zero" problem kya hai, aur ise solve karne ke acche aur bure tareeke kya hain?',
        a: 'Secret zero is the bootstrap problem: an application needs some credential to authenticate to the secrets manager before it can fetch any of its actual secrets, and something has to protect that first credential. If you protect it by putting it in the image or a hand-written Kubernetes Secret, you have recreated exactly the problem the manager was supposed to solve — that credential grants access to the manager and now lives in image layers, in git, and on every pod\'s disk. The best solution is a platform-provided identity that is not a secret you manage at all. On Kubernetes that is the pod\'s ServiceAccount token — the kubelet injects a projected token scoped to a specific audience, short-lived and auto-rotated, and the application exchanges it at Vault\'s Kubernetes auth endpoint for a scoped Vault token, with nothing baked in. On cloud VMs it is the instance identity from the metadata service, using IMDSv2. In a service mesh it can be a SPIFFE SVID. The next-best solution, for workloads without a platform identity like a CI job, is a short-lived single-use bootstrap token: an AppRole \`secret_id\` created with \`num_uses=1\` and a TTL of a couple of minutes, valid for exactly one login in a small window, ideally delivered response-wrapped so that interception is detectable — if someone unwraps it first, the legitimate consumer\'s unwrap fails loudly. The worst option is a long-lived AppRole \`secret_id\` or Vault token in configuration or an image, which just moves the problem to an insecure place.',
        aHi: 'Secret zero bootstrap problem hai: ek application ko apne actual secrets fetch karne se pehle secrets manager ko authenticate karne ke liye kuch credential chahिए, aur kuch ko us pehle credential ko protect karna hai. Agar aap ise image ya ek hand-written Kubernetes Secret mein daal kar protect karte ho, aapne exactly wo problem recreate ki hai jise manager solve karna tha. Best solution ek platform-provided identity hai jo ek secret nahi hai jo aap manage karte ho. Kubernetes par wo pod ka ServiceAccount token hai. Cloud VMs par wo metadata service se instance identity hai, IMDSv2 use karke. Next-best solution ek short-lived single-use bootstrap token hai: ek AppRole \`secret_id\` jo \`num_uses=1\` aur ek couple of minutes ki TTL ke saath created hai, ideally response-wrapped delivered. Worst option ek long-lived token config ya ek image mein hai.',
      },
      {
        q: 'How does the transit engine (encryption as a service) work, and how do you rotate its key without re-encrypting everything at once or exposing plaintext?',
        qHi: 'Transit engine kaise kaam karta hai, aur aap iski key ko sab kuch ek saath re-encrypt kiye bina ya plaintext expose kiye bina kaise rotate karte ho?',
        a: 'The transit engine performs encryption and decryption on behalf of the application so the application never holds the key. The application sends plaintext to Vault and gets back a ciphertext string prefixed with a key version, like \`vault:v1:\`; it stores that opaque string wherever it would store the data, and to read it back it sends the ciphertext to Vault and gets the plaintext. The AES key is generated inside Vault and never leaves, so a stolen database dump or backup file is just ciphertext to anyone who cannot also authenticate to Vault. Rotation is designed to be non-disruptive. The \`rotate\` operation advances the key to a new version — v2, v3 — and from that point new encryptions are tagged with the new version, but Vault retains the previous key versions, so all the existing \`vault:v1:\` values continue to decrypt normally. There is no need to re-encrypt anything immediately. To actually migrate stored data forward, the \`rewrap\` operation takes an old ciphertext and re-encrypts it to the current key version, and critically it does this inside Vault without ever returning the plaintext to the caller — so a background job can walk the stored data and rewrap it with no exposure. Once everything has been rewrapped to the current version, setting \`min_decryption_version\` above the old versions retires them, so that even a compromise of an archived old key value cannot decrypt anything.',
        aHi: 'Transit engine application ki taraf se encryption aur decryption perform karta hai taaki application kabhi key na rakhe. Application plaintext Vault ko bhejti hai aur ek key version se prefixed ek ciphertext string wapas paati hai, jaise \`vault:v1:\`; ye us opaque string ko store karti hai, aur ise wapas padhne ke liye ye ciphertext Vault ko bhejti hai aur plaintext paati hai. AES key Vault ke andar generated hai aur kabhi nahi chhodti. Rotation non-disruptive hone ke liye designed hai. \`rotate\` operation key ko ek nayi version par advance karta hai, aur us point se naye encryptions nayi version se tagged hain, par Vault previous key versions retain karta hai, to saare existing \`vault:v1:\` values normally decrypt karte rehte hain. Stored data ko aage migrate karne ke liye, \`rewrap\` operation ek purane ciphertext ko current key version par re-encrypt karta hai bina kabhi plaintext caller ko return kiye. Ek baar sab kuch rewrapped ho gaya, \`min_decryption_version\` set karna purane versions ko retire karta hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, contrast static and dynamic secrets, walk through the dynamic-database-credential flow end to end, and explain why the incident-response story is fundamentally better.',
        taskHi: 'Ek comment mein, static aur dynamic secrets contrast karo aur dynamic-database-credential flow ke through chalo.',
        hint: 'STATIC SECRET — ONE long-lived value, created once, SHARED among consumers, lives in the manager + each app\'s memory + caches + config + a DBA\'s password store + old runbooks. LEAK = valid until someone ACTIVELY rotates it (in practice "never", or the annual review, because rotating a thing "everything uses" feels risky). You rotate on a schedule + after every suspected leak. DYNAMIC SECRET — generated ON DEMAND, PER CONSUMER, with a LEASE (TTL). Vault creates a NEW database user / cloud key / SSH cert EACH time an app asks; when the lease expires (or is revoked), Vault DELETES that user/key. LEAK = useless within <= the lease TTL; NOTHING to rotate (it self-destructs); each consumer has its OWN creds -> per-consumer audit trail. THE DYNAMIC-DB-CREDENTIAL FLOW END TO END: (1) CONFIGURE ONCE — `vault write database/config/appdb plugin_name=postgresql-database-plugin connection_url="postgresql://{{username}}:{{password}}@db:5432/app" username="vault-admin" password="<admin-pw>" allowed_roles="app-ro"` + `vault write database/roles/app-ro db_name=appdb creation_statements="CREATE ROLE \\"{{name}}\\" WITH LOGIN PASSWORD \'{{password}}\' VALID UNTIL \'{{expiration}}\'; GRANT SELECT ON ALL TABLES IN SCHEMA public TO \\"{{name}}\\";" default_ttl=1h max_ttl=24h`. Vault holds the ADMIN connection; the role is a CREATE-USER TEMPLATE + a TTL. (2) THE APP authenticates as ITSELF (Lesson 2 — k8s SA / IAM role / AppRole), then `vault read database/creds/app-ro` -> Vault runs the template: `CREATE USER "v-app-ro-x8Kd2..." WITH PASSWORD \'<random>\'...; GRANT SELECT...` -> returns `{username: v-app-ro-x8Kd2..., password: <random>, lease_id: ..., lease_duration: 3600}`. (3) THE APP connects with those; a sidecar (or the app) RENEWS the lease before it lapses. (4) LEASE ENDS (pod deleted / max_ttl hit / `vault lease revoke`) -> Vault runs `DROP USER "v-app-ro-x8Kd2..."` -> the credential is GONE. WHY INCIDENT RESPONSE IS FUNDAMENTALLY BETTER: static -> "rotate the shared password + coordinate EVERY consumer" = hours, risky, might break things. dynamic -> `vault lease revoke -prefix database/creds/app-ro` = SECONDS, surgical; every credential that role ever issued dies at once; pods just re-auth and get fresh ones. PLUS: the stolen cred was going to expire in <=1h anyway; it only ever had SELECT (least privilege), not full app-user rights; and the audit log names the SPECIFIC instance that requested it, not "the shared account".',
        hintHi: 'STATIC SECRET — EK long-lived value, ek baar created, SHARED, manager + har app ki memory + caches + config + DBA ka password store + purane runbooks mein. LEAK = tab tak valid jab tak koi ACTIVELY rotate na kare ("kabhi nahi"). DYNAMIC SECRET — DEMAND par generated, PER CONSUMER, ek LEASE (TTL) ke saath. Vault har baar ek NAYA user/key/cert create karta hai; lease expire -> Vault ise DELETE karta hai. LEAK = <= lease TTL mein useless; rotate karne ke liye KUCH NAHI; per-consumer audit trail. DYNAMIC-DB-CREDENTIAL FLOW: (1) EK BAAR CONFIGURE — `vault write database/config/appdb ...` (Vault ADMIN connection rakhta hai) + `vault write database/roles/app-ro creation_statements="CREATE ROLE ...; GRANT SELECT ...;" default_ttl=1h max_ttl=24h`. (2) APP apne aap ko authenticate karti hai, phir `vault read database/creds/app-ro` -> Vault template chalata hai -> `{username, password: <random>, lease_id, lease_duration: 3600}`. (3) APP connect karti hai; sidecar lease RENEW karta hai. (4) LEASE KHATAM -> Vault `DROP USER` chalata hai. INCIDENT RESPONSE KYUN BEHTAR: static -> "shared password rotate karo + HAR consumer coordinate karo" = hours. dynamic -> `vault lease revoke -prefix ...` = SECONDS; sirf SELECT tha; audit log SPECIFIC instance name karta hai.',
      },
      {
        task: 'In a comment, explain the transit engine (encryption as a service): the encrypt/decrypt flow, why the app never holding the key matters, and how rotate + rewrap + min_decryption_version work together.',
        taskHi: 'Ek comment mein, transit engine samjhाओ aur rotate + rewrap + min_decryption_version kaise ek saath kaam karte hain.',
        hint: 'THE TRANSIT ENGINE = ENCRYPTION AS A SERVICE — Vault does the crypto so the app NEVER HOLDS THE KEY. THE FLOW: `vault secrets enable transit`; `vault write -f transit/keys/orders` (the AES key is created IN Vault). ENCRYPT: the app sends base64 PLAINTEXT -> `vault write transit/encrypt/orders plaintext=<b64>` -> gets back CIPHERTEXT: `vault:v1:<opaque base64>`. It stores that string wherever it would store the data (a DB column, a file). DECRYPT: `vault write transit/decrypt/orders ciphertext=vault:v1:...` -> gets the plaintext back. WHY THE APP NEVER HOLDING THE KEY MATTERS: a stolen DB DUMP / a leaked BACKUP FILE / an exfiltrated disk is JUST CIPHERTEXT to anyone who cannot ALSO authenticate to Vault (Lesson 2 — a workload identity, policy-scoped). The key never leaves Vault\'s memory + storage. Encryption is now an ACCESS-CONTROLLED, AUDITED operation (every encrypt/decrypt is in the audit log). ROTATE + REWRAP + min_decryption_version TOGETHER: (1) `vault write -f transit/keys/orders/rotate` -> advances the key to v2, v3, ... `latest_version` increments. From that point, NEW encryptions are tagged with the LATEST version (`vault:v3:`), but Vault RETAINS all prior key versions, so EXISTING `vault:v1:` blobs STILL DECRYPT normally -> rotation is NON-DISRUPTIVE, nothing needs immediate re-encryption. (2) `vault write transit/rewrap/orders ciphertext=vault:v1:...` -> takes an OLD ciphertext and re-encrypts it to the CURRENT key version, INSIDE Vault, WITHOUT ever returning the plaintext to the caller -> a BACKGROUND JOB can walk all stored data and rewrap it with ZERO plaintext exposure and no app logic change. (3) once EVERYTHING is rewrapped to the current version, set `min_decryption_version` above the old versions -> Vault will now REFUSE to decrypt anything still tagged with a retired version -> even a compromise of an ARCHIVED old key value decrypts NOTHING. Net: rotate anytime (cheap, safe), migrate lazily via rewrap, retire old keys once migration is complete.',
        hintHi: 'TRANSIT ENGINE = ENCRYPTION AS A SERVICE — Vault crypto karta hai taaki app KABHI KEY NA RAKHE. FLOW: `vault secrets enable transit`; `vault write -f transit/keys/orders` (AES key Vault MEIN create hoti hai). ENCRYPT: app base64 PLAINTEXT bhejti hai -> CIPHERTEXT paati hai: `vault:v1:<opaque>`. Ise store karti hai. DECRYPT: `vault write transit/decrypt/orders ciphertext=vault:v1:...` -> plaintext wapas. APP KEY NA RAKHE KYUN MATTER KARTA HAI: ek stolen DB DUMP / leaked BACKUP kisi ke liye SIRF CIPHERTEXT hai jo Vault ko AUTHENTICATE nahi kar sakta. Key kabhi Vault nahi chhodti. Encryption ab ek ACCESS-CONTROLLED, AUDITED operation hai. ROTATE + REWRAP + min_decryption_version: (1) `rotate` -> key v2, v3 par advance; NAYE encryptions LATEST version se tagged, par Vault SAARE prior versions RETAIN karta hai -> PURANE `vault:v1:` blobs ABHI BHI DECRYPT hote hain -> NON-DISRUPTIVE. (2) `rewrap` -> ek PURANE ciphertext ko CURRENT version par re-encrypt karta hai, Vault ke ANDAR, BINA plaintext caller ko return kiye -> ek BACKGROUND JOB sab data walk karke rewrap kar sakta hai. (3) sab rewrapped -> `min_decryption_version` set karo -> Vault ab retired version se tagged kuch bhi decrypt karne se REFUSE karega.',
      },
      {
        task: 'In a comment, explain the "secret zero" problem, rank the solutions (platform identity > single-use bootstrap token > long-lived token), and explain what makes automated rotation of a truly-static secret safe vs a scheduled outage.',
        taskHi: 'Ek comment mein, "secret zero" problem samjhाओ, solutions rank karo, aur samjhाओ ek truly-static secret ki automated rotation kya safe banati hai.',
        hint: '"SECRET ZERO" = the BOOTSTRAP problem: the app needs SOME credential to authenticate to the secrets manager BEFORE it can fetch any of its actual secrets. What protects THAT one? SOLUTIONS, BEST -> WORST: (1) BEST — a PLATFORM-PROVIDED IDENTITY that is NOT a secret you manage at all: the k8s ServiceAccount token (the kubelet injects a PROJECTED token at `/var/run/secrets/kubernetes.io/serviceaccount/token` — audience-scoped, short-lived e.g. 1h, AUTO-ROTATED), exchanged at Vault\'s `auth/kubernetes/login` for a scoped Vault token — NOTHING baked in; OR the cloud instance identity via the metadata service (IMDSv2 — hop-limit + session-token, to stop SSRF from reading it); OR a SPIFFE SVID in a service mesh. The platform MINTS + ROTATES it and it\'s ONLY valid from that specific workload. (Lesson 5.) (2) NEXT-BEST — a SHORT-LIVED, SINGLE-USE bootstrap token delivered OUT-OF-BAND at deploy, for workloads with no platform identity (a CI job, a standalone VM): an AppRole `secret_id` created with `num_uses=1 ttl=2m` — valid for EXACTLY ONE login in a tiny window — ideally delivered RESPONSE-WRAPPED (`vault write -wrap-ttl=90s -f auth/approle/role/x/secret-id`): a single-use wrapping token; if anyone unwraps it FIRST, the legitimate consumer\'s unwrap FAILS LOUDLY and you KNOW it was intercepted. (3) WORST (avoid) — a LONG-LIVED AppRole `secret_id` / Vault token baked into config / an image / a hand-written k8s Secret. This IS a long-lived secret granting manager access, now in image layers + git + every pod\'s disk — it just MOVES secret zero to the exact insecure places this whole module is about NOT using, and a long TTL "to avoid renewal" makes a leaked copy valid for WEEKS. AUTOMATED ROTATION OF A TRULY-STATIC SECRET (a 3rd-party API key with no dynamic option) — SAFE requires THREE things: (a) the rotation function keeps an OVERLAP WINDOW where BOTH old and new are valid: create new -> apply it -> update the stored secret -> WAIT the overlap -> ONLY THEN revoke old. Never an instant where a consumer holding either value fails. (b) consumers must NOT cache the secret forever: cache with a SHORT TTL (~5 min) + re-fetch periodically, AND invalidate + re-fetch + retry on an AUTH FAILURE. (or use a credential-provider client: RDS IAM auth, the Secrets Manager SDK wrapper, Vault Agent templating a file the app watches). (c) TEST IT: trigger a real rotation in STAGING and confirm ZERO errors. WITHOUT all three -> when rotation disables the old credential, every process still holding it fails auth, connection pools churn, and it spreads into a PARTIAL OUTAGE until a fleet restart -> "rotation" = a scheduled incident.',
        hintHi: '"SECRET ZERO" = BOOTSTRAP problem: app ko apne actual secrets fetch karne se PEHLE secrets manager ko authenticate karne ke liye KUCH credential chahिए. US EK ko kya protect karta hai? SOLUTIONS, BEST -> WORST: (1) BEST — ek PLATFORM-PROVIDED IDENTITY jo ek secret NAHI hai: k8s ServiceAccount token (kubelet ek PROJECTED token inject karta hai — audience-scoped, short-lived, AUTO-ROTATED), `auth/kubernetes/login` par exchange; YA cloud instance identity via metadata (IMDSv2); YA ek SPIFFE SVID. Platform ise MINT + ROTATE karta hai. (2) NEXT-BEST — ek SHORT-LIVED, SINGLE-USE bootstrap token OUT-OF-BAND delivered (CI job / VM): ek AppRole `secret_id` `num_uses=1 ttl=2m`, ideally RESPONSE-WRAPPED — agar koi ise PEHLE unwrap karta hai, legitimate unwrap FAIL hota hai. (3) WORST — ek LONG-LIVED token config / image / hand-written k8s Secret mein. Secret zero ko exact insecure jagah MOVE karta hai. AUTOMATED ROTATION SAFE — TEEN cheezein: (a) OVERLAP WINDOW jahaan purana + naya DONO valid hain. (b) consumers SHORT TTL (~5 min) se cache karo + AUTH FAILURE par re-fetch + retry. (c) STAGING mein TEST karo, ZERO errors confirm karo. BINA teenon ke -> PARTIAL OUTAGE tak fleet restart -> "rotation" = ek scheduled incident.',
      },
    ],

    keyTakeaways: [
      'STATIC vs DYNAMIC: a static secret is one shared long-lived value that accumulates copies and stays valid until someone rotates it (often "never"). A DYNAMIC secret is generated on demand, per consumer, with a lease — Vault creates a fresh DB user / cloud key / cert each request and DELETES it when the lease ends. A leaked dynamic credential is useless within its short TTL, self-destructs (nothing to rotate), and is attributable per-consumer in the audit log.',
      'DYNAMIC DB CREDENTIALS: configure Vault once with an admin connection + a role (a CREATE USER template + `default_ttl`/`max_ttl`). The app authenticates as itself → `vault read database/creds/<role>` → a unique username + random password + a lease. Incident response becomes `vault lease revoke -prefix database/creds/<role>` — seconds, surgical — vs "rotate the shared password and coordinate every consumer".',
      'TRANSIT ENGINE = encryption as a service: the app sends plaintext, gets `vault:v1:<ciphertext>`, and NEVER holds the AES key (it stays in Vault). A stolen DB dump / backup is just ciphertext. `rotate` bumps the key version (new writes use it; old blobs still decrypt); `rewrap` upgrades an old blob to the current version WITHOUT exposing plaintext; `min_decryption_version` then retires the old key.',
      '"SECRET ZERO" (the credential to auth to the manager): BEST = a platform-provided identity that is not a secret you manage — a k8s ServiceAccount projected token, a cloud instance identity (IMDSv2), a SPIFFE SVID (all minted + rotated by the platform, workload-bound). NEXT = a single-use short-TTL AppRole `secret_id` delivered response-wrapped (interception is detectable). WORST = a long-lived token baked into an image or manifest — that just moves the problem to an insecure place.',
      'AUTOMATED ROTATION of a must-stay-static secret is safe only with THREE things: an OVERLAP WINDOW where both old and new are valid (create → apply → update → wait → revoke old); consumers that DON\'T cache forever (short TTL + re-fetch on auth failure); and a TESTED rotation path (trigger it in staging, confirm zero errors). Without them, disabling the old value while services still hold it is a scheduled partial outage.',
    ],
    keyTakeawaysHi: [
      'STATIC vs DYNAMIC: ek static secret ek shared long-lived value hai jo copies accumulate karta hai aur tab tak valid rehta hai jab tak koi rotate na kare ("kabhi nahi"). Ek DYNAMIC secret demand par generated hai, per consumer, ek lease ke saath — Vault har request ek fresh DB user / cloud key / cert create karta hai aur lease khatam hone par ise DELETE karta hai. Ek leaked dynamic credential iski short TTL ke andar useless hai, self-destruct karta hai, aur audit log mein per-consumer attributable hai.',
      'DYNAMIC DB CREDENTIALS: Vault ko ek baar ek admin connection + ek role (ek CREATE USER template + `default_ttl`/`max_ttl`) ke saath configure karo. App apne aap ko authenticate karti hai → `vault read database/creds/<role>` → ek unique username + random password + ek lease. Incident response `vault lease revoke -prefix ...` ban jata hai — seconds, surgical.',
      'TRANSIT ENGINE = encryption as a service: app plaintext bhejti hai, `vault:v1:<ciphertext>` paati hai, aur KABHI AES key nahi rakhti (ye Vault mein rehti hai). Ek stolen DB dump / backup sirf ciphertext hai. `rotate` key version bump karta hai (naye writes ise use karte hain; purane blobs abhi bhi decrypt hote hain); `rewrap` ek purane blob ko current version par upgrade karta hai BINA plaintext expose kiye; `min_decryption_version` phir purani key ko retire karta hai.',
      '"SECRET ZERO": BEST = ek platform-provided identity jo ek secret nahi hai jo aap manage karte ho — ek k8s ServiceAccount projected token, ek cloud instance identity (IMDSv2), ek SPIFFE SVID. NEXT = ek single-use short-TTL AppRole `secret_id` response-wrapped delivered. WORST = ek long-lived token ek image ya manifest mein baked.',
      ' zaroor-static-rehne-wale secret ki AUTOMATED ROTATION sirf TEEN cheezon ke saath safe hai: ek OVERLAP WINDOW jahaan purana aur naya dono valid hain; consumers jo HAMESHA cache nahi karte (short TTL + auth failure par re-fetch); aur ek TESTED rotation path (staging mein trigger karo, zero errors confirm karo). Inke bina, purane value ko disable karna jab services abhi bhi ise hold karti hain ek scheduled partial outage hai.',
    ],
  },
];
