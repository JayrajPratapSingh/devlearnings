/**
 * DevOps Complete Course — Module 10: CI/CD Pipelines, lessons 4-6.
 *
 * Lesson 4: Secrets, OIDC & pipeline security — secret scoping + masking,
 *           `pull_request_target`, OIDC to AWS *and* Azure (no stored keys),
 *           pinning actions by SHA, least-privilege `permissions:`, script
 *           injection. VERIFIED (actionlint + act).
 * Lesson 5: Environments, protection rules & promotion — `environment:`,
 *           required reviewers / wait timers, build-once/deploy-many, manual
 *           promotion via `workflow_dispatch`. VERIFIED (actionlint + act).
 * Lesson 6: Runners, reusable workflows & CI at scale — hosted vs self-hosted,
 *           `workflow_call` reusable workflows vs composite actions, `actionlint`
 *           in CI, flaky-test policy, monorepo path filters. VERIFIED.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_10_PART2: CourseLesson[] = [
  {
    slug: 'ops-secrets-oidc-and-pipeline-security',
    title: 'Secrets, OIDC & Pipeline Security',
    titleHi: 'Secrets, OIDC & Pipeline Security',
    description: 'A CI runner briefly holds enormous power: a token that can push to the repo and secrets that can deploy to production. Three things keep that safe — never storing long-lived cloud keys (use OIDC to mint a short-lived token per run), pinning every third-party action to an immutable commit, and never letting untrusted pull-request code run with your secrets.',
    descriptionHi: 'Ek CI runner thodi der ke liye enormous power rakhta hai: ek token jo repo mein push kar sakta hai aur secrets jo production mein deploy kar sakte hain. Teen cheezein use safe rakhti hain — kabhi long-lived cloud keys store na karna (per run ek short-lived token mint karne ke liye OIDC use karo), har third-party action ko ek immutable commit par pin karna, aur kabhi untrusted pull-request code ko apne secrets ke saath run na karne dena.',
    difficulty: 'HARD',
    duration: 26,
    order: 4,

    analogy: {
      en: '**A courier who is given the vault keys for exactly one delivery.** The old way: every courier carries a permanent master key (a long-lived `AWS_SECRET_ACCESS_KEY` in repo secrets) — lose one courier\'s bag and the whole vault is compromised until someone notices and rekeys. **OIDC** is the modern way: the courier shows up at the vault with a signed, photographed work order stamped "job #4471, today only, this route only" (a signed token proving *which repo, which branch, which workflow*), the vault checks it against the day\'s schedule and hands over a key that dissolves in fifteen minutes. **Pinning actions by SHA** is refusing to accept a tool from a supplier by its label ("the blue wrench") and instead by its serial number, because labels can be swapped onto a different tool overnight. And **`pull_request_target`** is the trap door: it is the one setup where you hand the vault keys to a courier whose work order was written by a stranger.',
      hi: '**Ek courier jise theek ek delivery ke liye vault keys diye jaate hain.** Purana tarika: har courier ek permanent master key carry karta hai (repo secrets mein ek long-lived `AWS_SECRET_ACCESS_KEY`) — ek courier ka bag khoja aur poora vault compromised hai jab tak koi notice na kare. **OIDC** modern tarika hai: courier vault par ek signed work order ke saath aata hai jismein stamp hai "job #4471, aaj only, ye route only" (ek signed token jo prove karta hai *kaunsा repo, kaunसी branch, kaunसा workflow*), vault ise din ke schedule ke against check karta hai aur ek key deta hai jo pandrah minute mein dissolve ho jaati hai. **SHA se actions pin karna** ek supplier se ek tool ko iske label se ("blue wrench") accept karne se inkaar karna hai. Aur **`pull_request_target`** trap door hai.',
    },

    simple: `**A CI RUN briefly holds: the \`GITHUB_TOKEN\` + every secret you exposed to the step.**
Protect it on three axes:

**1. SECRETS — scoping + the fork rule + masking:**
\`\`\`
scope       repo secrets  |  environment secrets (only jobs targeting that env)  |  org secrets
masking     any value registered as a secret is auto-\`***\`-ed in logs. but 'echo $S | base64'
            defeats it -> masking is a safety net, not a control.
FORK RULE   on 'pull_request' from a FORK, secrets are NOT passed and GITHUB_TOKEN is read-only.
            this is deliberate: a stranger's PR must not get your secrets.
GITHUB_TOKEN least privilege it explicitly:
              permissions:
                contents: read        # default to read
                packages: write       # grant only what THIS workflow needs
\`\`\`

**2. OIDC — stop storing long-lived cloud keys:**
\`\`\`yaml
permissions:
  id-token: write          # REQUIRED - lets the job request a signed OIDC token
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # --- AWS ---
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gha-deploy   # NO access keys anywhere
          aws-region: us-east-1
      # --- Azure ---
      - uses: azure/login@v2
        with:
          client-id:       \${{ vars.AZURE_CLIENT_ID }}
          tenant-id:       \${{ vars.AZURE_TENANT_ID }}
          subscription-id: \${{ vars.AZURE_SUBSCRIPTION_ID }}   # a federated credential, no secret
\`\`\`
The job presents a **signed JWT** proving \`repo:acme/app:ref:refs/heads/main\` etc; the cloud's
trust policy checks that claim and returns **temporary** credentials. Nothing to leak, nothing to rotate.

**3. THIRD-PARTY ACTIONS — pin by immutable SHA, not a tag:**
\`\`\`
BAD   uses: some-org/deploy@v3          # 'v3' is a MUTABLE tag - the owner (or an attacker
                                        # who compromised them) can repoint it to malware
GOOD  uses: some-org/deploy@a1b2c3d...  # a 40-char commit SHA - immutable. + Dependabot to bump it.
\`\`\`

**THE BIG FOOTGUN — \`pull_request_target\`:** it runs the workflow from the **base branch**
but with a **read-write token AND secrets**, in the context of an untrusted PR. If you then
\`checkout\` the PR's head and run its code / its build scripts / its \`npm install\` -> that code
runs **with your secrets and write access**. Use plain \`pull_request\` for anything touching PR
code; reserve \`pull_request_target\` for labelling/triage that never executes PR content.

**SCRIPT INJECTION** (Lesson 2): never put \`\${{ github.event.* }}\` straight into \`run:\` — bind
it to \`env:\`. \`actionlint\` flags it.`,

    simpleHi: `**Ek CI RUN thodi der ke liye rakhta hai: \`GITHUB_TOKEN\` + har secret jo aapne step ko exposed kiya.**
Ise teen axes par protect karo:

**1. SECRETS — scoping + fork rule + masking:**
\`\`\`
scope       repo secrets | environment secrets | org secrets
masking     koi bhi value jo ek secret ke roop mein registered hai logs mein auto-\`***\`-ed hai.
            par 'echo $S | base64' ise defeat karta hai -> masking ek safety net hai, ek control nahi.
FORK RULE   ek FORK se 'pull_request' par, secrets NAHI pass hote aur GITHUB_TOKEN read-only hai.
GITHUB_TOKEN ise explicitly least privilege karo:
              permissions: { contents: read, packages: write }
\`\`\`

**2. OIDC — long-lived cloud keys store karna band karo:**
\`\`\`yaml
permissions:
  id-token: write          # REQUIRED
  contents: read
jobs:
  deploy:
    steps:
      # --- AWS ---
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gha-deploy   # kahin koi access keys nahi
          aws-region: us-east-1
      # --- Azure ---
      - uses: azure/login@v2
        with:
          client-id:       \${{ vars.AZURE_CLIENT_ID }}
          tenant-id:       \${{ vars.AZURE_TENANT_ID }}
          subscription-id: \${{ vars.AZURE_SUBSCRIPTION_ID }}   # ek federated credential, koi secret nahi
\`\`\`
Job ek **signed JWT** present karta hai jo \`repo:acme/app:ref:refs/heads/main\` prove karta hai;
cloud ki trust policy us claim ko check karti hai aur **temporary** credentials return karti hai.

**3. THIRD-PARTY ACTIONS — immutable SHA se pin karo, ek tag se nahi:**
\`\`\`
BAD   uses: some-org/deploy@v3          # 'v3' ek MUTABLE tag hai
GOOD  uses: some-org/deploy@a1b2c3d...  # ek 40-char commit SHA - immutable
\`\`\`

**BADA FOOTGUN — \`pull_request_target\`:** ye workflow ko **base branch** se chalata hai par
ek **read-write token AUR secrets** ke saath, ek untrusted PR ke context mein. Agar aap phir
PR ke head ko \`checkout\` karके iska code chalate ho -> wo code **aapke secrets aur write access
ke saath** chalta hai. PR code ko touch karne wali kisi bhi cheez ke liye plain \`pull_request\` use karo.

**SCRIPT INJECTION** (Lesson 2): kabhi \`\${{ github.event.* }}\` seedha \`run:\` mein mat rakho.`,

    content: `## What a CI run can do

For the few minutes a job runs, the runner holds:

- **\`GITHUB_TOKEN\`** — an automatically-issued token, scoped to the repository, whose permissions you control with \`permissions:\`. By default on many repos it can write to the repo, create releases, and push packages.
- **Every secret you referenced** in that job's steps — database passwords, deploy keys, cloud credentials.

If an attacker can get code to execute in that job, they inherit all of it for that window: they can push commits, publish a malicious package version, or exfiltrate the secrets. The whole of pipeline security is about shrinking what the runner holds and controlling what can execute there.

## Secrets

**Scope.** Secrets can be defined at three levels: **repository** (available to all workflows in the repo), **environment** (available only to jobs that declare \`environment: <name>\`, which lets you gate production credentials behind an environment's protection rules — Lesson 5), and **organisation** (shared across repos, optionally restricted to selected repos). Prefer the narrowest scope: a production deploy key belongs on the \`production\` environment, not as a repo secret every PR workflow can see.

**Masking.** Any value registered as a secret is automatically replaced with \`***\` if it appears in the logs. This is a safety net against accidental \`echo\`, not a security boundary — a step can trivially transform a secret (\`base64\`, reverse it, split it) so the transformed form is not recognised and prints in clear. Never rely on masking to protect a secret that untrusted code can reach.

**The fork rule.** On a \`pull_request\` event **from a fork**, GitHub does **not** pass secrets to the workflow and makes \`GITHUB_TOKEN\` read-only. This is deliberate and important: a pull request from a stranger runs code you have not reviewed, and it must not be handed your secrets or write access. Workflows that need secrets to test a PR (a preview deployment, say) have to be designed around this — typically with a maintainer applying a label that triggers a separate, reviewed workflow.

**Least-privilege \`GITHUB_TOKEN\`.** Set \`permissions:\` explicitly at the workflow or job level. Start from \`contents: read\` and add only the scopes a workflow actually uses (\`packages: write\` to publish, \`id-token: write\` for OIDC, \`pull-requests: write\` to comment). A workflow that only runs tests needs \`contents: read\` and nothing else.

## OIDC: no more stored cloud keys

The traditional way to let CI deploy to AWS was to create an IAM user, generate a long-lived access key pair, and paste it into repo secrets. That key never expires on its own, is copied into every runner that uses it, and if it leaks — a compromised action, a logged value, an insider — an attacker has standing access to your cloud until a human notices and rotates it.

**OpenID Connect (OIDC)** removes the stored key entirely. GitHub Actions can issue a **short-lived, signed JSON Web Token** for a job, containing verifiable claims about the run: the repository, the branch or tag (\`ref\`), the workflow, the environment, the actor. The cloud provider is configured to **trust GitHub's OIDC issuer** and to accept that token, checking the claims against a policy — "allow this only for \`repo:acme/app\`, only on \`ref:refs/heads/main\`" — and in exchange returns **temporary credentials** valid for the job.

\`\`\`yaml
permissions:
  id-token: write        # REQUIRED — without this the job cannot request the OIDC token
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-deployer
          aws-region: eu-west-1
      - run: aws s3 sync ./dist s3://prod-assets       # uses the temporary creds
\`\`\`

The AWS side is an IAM role whose trust policy names GitHub's OIDC provider and constrains the \`sub\` claim to your repo and branch. **No access key exists anywhere.** Nothing to leak, nothing to rotate, and the blast radius of a compromised run is one short-lived credential scoped to one role.

**Azure** works the same way with **federated credentials** on an Entra ID app registration:

\`\`\`yaml
      - uses: azure/login@v2
        with:
          client-id:       \${{ vars.AZURE_CLIENT_ID }}
          tenant-id:       \${{ vars.AZURE_TENANT_ID }}
          subscription-id: \${{ vars.AZURE_SUBSCRIPTION_ID }}
      - run: az webapp deploy --name prod-app --src-path ./dist.zip
\`\`\`

The \`client-id\`, \`tenant-id\`, and \`subscription-id\` are not secrets — they are identifiers, fine to store as \`vars\`. The trust is the federated credential on the Azure side, scoped to your repo and branch. GCP has the equivalent via Workload Identity Federation.

## Pin third-party actions by SHA

\`uses: some-org/some-action@v3\` references a Git **tag**, and a tag is **mutable** — the action's owner can move \`v3\` to point at a different commit at any time, and if the owner's account is compromised, an attacker can repoint \`v3\` at a commit that steals your secrets. Every CI run would then execute the malicious version. The defence is to pin to a **full 40-character commit SHA**: \`uses: some-org/some-action@a1b2c3d4e5f6...\`. A SHA is immutable; the code you reviewed is the code that runs. Use Dependabot or Renovate to raise pull requests bumping the SHA so you stay current deliberately, with a review, rather than automatically. Pin \`actions/checkout\` and the other first-party actions too — GitHub's own account is not immune.

## The \`pull_request_target\` trap

A normal \`pull_request\` workflow runs the workflow file **from the pull request** and, for forks, with no secrets and a read-only token — safe, because untrusted code runs with no privileges.

\`pull_request_target\` is different: it runs the workflow file **from the base branch** (which a maintainer controls) but **with full read-write \`GITHUB_TOKEN\` and access to secrets**, in the context of the incoming PR. Its intended use is safe automation that never touches the PR's code — applying labels, posting a welcome comment, checking the PR's metadata.

The catastrophic mistake is to use \`pull_request_target\` and then explicitly check out the pull request's head and run something from it — its tests, its build, its \`npm install\` (which runs arbitrary \`postinstall\` scripts). Now untrusted code from a stranger's fork is executing **with your write token and your secrets**. This exact pattern has been the root cause of numerous real supply-chain compromises. The rule: if a workflow will execute, build, or install anything from the PR, it must be \`pull_request\`, not \`pull_request_target\`.

## Bringing it together

Run \`actionlint\` in CI as a required check — it catches script injection, malformed action refs, and expression errors automatically. Keep \`permissions:\` minimal and explicit. Use OIDC for every cloud interaction. Pin every action to a SHA. Never let PR code run with secrets. These are not optional hardening for large orgs — a public repo with a careless workflow is a target within hours of being pushed.`,

    contentHi: `## Ek CI run kya kar sakta hai

Un kuch minutes ke liye jab ek job chalti hai, runner rakhta hai:
- **\`GITHUB_TOKEN\`** — ek automatically-issued token, repository ke liye scoped, jiski permissions aap \`permissions:\` se control karte ho.
- **Har secret jo aapne reference kiya** us job ke steps mein.

Agar ek attacker us job mein code execute karvा sakta hai, wo us window ke liye ye sab inherit karta hai. Poora pipeline security ke baare mein ye hai ki runner kya rakhta hai use shrink karna.

## Secrets

**Scope.** Secrets teen levels par define ho sakte hain: **repository**, **environment** (sirf un jobs ke liye jo \`environment: <name>\` declare karte hain), aur **organisation**. Sabse narrow scope prefer karo.

**Masking.** Koi bhi value jo ek secret ke roop mein registered hai automatically \`***\` se replace hoti hai agar ye logs mein appear hoti hai. Ye ek safety net hai, ek security boundary nahi — ek step trivially ek secret transform kar sakta hai (\`base64\`).

**Fork rule.** Ek FORK se ek \`pull_request\` event par, GitHub secrets **NAHI** pass karta aur \`GITHUB_TOKEN\` read-only banata hai. Ye deliberate aur important hai.

**Least-privilege \`GITHUB_TOKEN\`.** \`permissions:\` ko workflow ya job level par explicitly set karo. \`contents: read\` se shuru karo aur sirf wo scopes add karo jo ek workflow actually use karta hai.

## OIDC: ab stored cloud keys nahi

CI ko AWS mein deploy karne dene ka traditional tarika ek IAM user banana, ek long-lived access key pair generate karna, aur ise repo secrets mein paste karna tha. Wo key apne aap kabhi expire nahi hota, aur agar ye leak hota hai — ek attacker ke paas aapke cloud tak standing access hai.

**OpenID Connect (OIDC)** stored key poori tarah hata deta hai. GitHub Actions ek job ke liye ek **short-lived, signed JSON Web Token** issue kar sakta hai, jismein run ke baare mein verifiable claims hain: repository, branch ya tag, workflow. Cloud provider **GitHub ke OIDC issuer ko trust karne** ke liye configured hai aur us token ko accept karta hai, claims ko ek policy ke against check karके, aur badle mein **temporary credentials** return karta hai.

\`\`\`yaml
permissions:
  id-token: write        # REQUIRED
  contents: read
jobs:
  deploy:
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-deployer
          aws-region: eu-west-1
\`\`\`

**Kahin koi access key exist nahi karta.** Leak karne ke liye kuch nahi, rotate karne ke liye kuch nahi.

**Azure** same tarike se **federated credentials** ke saath kaam karta hai ek Entra ID app registration par. \`client-id\`, \`tenant-id\`, aur \`subscription-id\` secrets nahi hain — wo identifiers hain, \`vars\` ke roop mein store karne ke liye theek. GCP ka equivalent Workload Identity Federation ke through hai.

## Third-party actions ko SHA se pin karo

\`uses: some-org/some-action@v3\` ek Git **tag** reference karta hai, aur ek tag **mutable** hai — action ka owner \`v3\` ko kisi bhi samay ek alag commit par point karने ke liye move kar sakta hai. Defence ek **full 40-character commit SHA** par pin karna hai. Ek SHA immutable hai. Dependabot ya Renovate use karo SHA bump karne wale pull requests raise karne ke liye.

## \`pull_request_target\` trap

Ek normal \`pull_request\` workflow workflow file ko **pull request se** chalata hai aur, forks ke liye, no secrets aur ek read-only token ke saath — safe.

\`pull_request_target\` alag hai: ye workflow file ko **base branch se** chalata hai par **full read-write \`GITHUB_TOKEN\` aur secrets tak access** ke saath, incoming PR ke context mein. Iska intended use safe automation hai jo kabhi PR ke code ko touch nahi karti.

Catastrophic mistake \`pull_request_target\` use karna aur phir explicitly pull request ke head ko checkout karna aur isse kuch chalana hai. Ab ek stranger ke fork se untrusted code **aapke write token aur aapke secrets ke saath** execute kar raha hai. Rule: agar ek workflow PR se kuch execute, build, ya install karega, ise \`pull_request\` hona chahiye, \`pull_request_target\` nahi.`,

    examples: [
      {
        title: 'OIDC to AWS and Azure with no stored keys; secrets are masked in logs',
        titleHi: 'Bina stored keys ke AWS aur Azure ko OIDC; secrets logs mein masked hain',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
git init -q; git config user.email ci@example.com; git config user.name ci; git config core.autocrlf false
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml <<'YAML'
name: deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  id-token: write          # REQUIRED for OIDC - lets the job mint a signed token
jobs:
  to-aws:
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gha-deployer   # no access keys anywhere
          aws-region: us-east-1
      - run: echo "aws creds are now temporary + role-scoped"
  to-azure:
    runs-on: ubuntu-latest
    steps:
      - uses: azure/login@v2
        with:
          client-id:       \${{ vars.AZURE_CLIENT_ID }}       # identifiers, not secrets
          tenant-id:       \${{ vars.AZURE_TENANT_ID }}
          subscription-id: \${{ vars.AZURE_SUBSCRIPTION_ID }}
      - run: echo "azure login via a federated credential - nothing stored"
  masking-demo:
    runs-on: ubuntu-latest
    steps:
      - run: 'echo "the deploy key is \${{ secrets.DEPLOY_KEY }}"'   # GitHub masks it
YAML
git add -A >/dev/null; git commit -qm ci >/dev/null

echo "--- actionlint: the OIDC + permissions structure is valid ---"
actionlint -no-color 2>&1 | grep -E '\\.yml:' || echo "actionlint: no problems found"
echo "--- act: a secret value never appears in the log ---"
act push -P ubuntu-latest=node:20-bullseye-slim --pull=false -j masking-demo -s DEPLOY_KEY=super-secret-value 2>&1 \\
  | sed -n 's/^\\[[^]]*\\] *| //p' | grep 'the deploy key is'`,
        output: `--- actionlint: the OIDC + permissions structure is valid ---
actionlint: no problems found
--- act: a secret value never appears in the log ---
the deploy key is ***`,
        explain: 'One workflow shows both cloud providers configured for keyless authentication. The workflow declares permissions with id-token write, which is the switch that lets a job request a signed OIDC token from GitHub; without it neither cloud login works. The AWS job uses the official credentials action with only a role ARN and a region — there is no access key or secret key anywhere in the workflow or in repo secrets, because the job authenticates by presenting its OIDC token to AWS, whose IAM role trusts GitHub\'s issuer and returns temporary credentials. The Azure job does the same with a client id, tenant id, and subscription id, which are not secrets but plain identifiers stored as configuration variables; the trust lives in a federated credential on the Azure side. actionlint validates that this structure is well-formed. The third job demonstrates masking: it echoes a value that was provided as a secret, and in the log that value is replaced with three asterisks. Masking is a backstop against an accidental print, not a control — a step could transform the secret to evade it — but the keyless OIDC pattern is the real win, because there is simply no long-lived credential to leak or rotate.',
        explainHi: 'Ek workflow dono cloud providers ko keyless authentication ke liye configured dikhaता hai. Workflow permissions declare karta hai id-token write ke saath, jo wo switch hai jo ek job ko GitHub se ek signed OIDC token request karne deta hai. AWS job official credentials action use karta hai sirf ek role ARN aur ek region ke saath — workflow ya repo secrets mein kahin koi access key ya secret key nahi hai, kyunki job apne OIDC token ko AWS ko present karके authenticate karta hai. Azure job same karta hai ek client id, tenant id, aur subscription id ke saath, jo secrets nahi balki plain identifiers hain. actionlint validate karta hai ki ye structure well-formed hai. Teesra job masking demonstrate karta hai: ye ek value echo karta hai jo ek secret ke roop mein provided thi, aur log mein wo value teen asterisks se replace hoti hai.',
      },
      {
        title: 'Script injection: actionlint flags an untrusted value in run:, the env-var version is clean',
        titleHi: 'Script injection: actionlint ek untrusted value ko run: mein flag karta hai, env-var version clean hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
git init -q; git config user.email ci@example.com; git config user.name ci; git config core.autocrlf false
mkdir -p .github/workflows

cat > .github/workflows/unsafe.yml <<'YAML'
name: unsafe
on:
  issue_comment:
    types: [created]
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "comment received:"
          echo \${{ github.event.comment.body }}       # <-- attacker controls this text
YAML

cat > .github/workflows/safe.yml <<'YAML'
name: safe
on:
  issue_comment:
    types: [created]
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - env:
          BODY: \${{ github.event.comment.body }}       # bind to an env var - GitHub sets the literal
        run: |
          echo "comment received:"
          echo "$BODY"                                  # the shell treats it as DATA, not code
YAML
git add -A >/dev/null; git commit -qm ci >/dev/null

echo "--- actionlint over both files ---"
actionlint -no-color 2>&1 | grep -oE '"github.event.comment.body" is potentially untrusted' | head -1
echo "unsafe.yml flagged: $(actionlint -no-color 2>&1 | grep -c 'unsafe\\.yml.*potentially untrusted')"
echo "safe.yml   flagged: $(actionlint -no-color 2>&1 | grep -c 'workflows.safe\\.yml.*potentially untrusted')"
echo "-> only the version that interpolates the value straight into 'run:' is flagged."`,
        output: `--- actionlint over both files ---
"github.event.comment.body" is potentially untrusted
unsafe.yml flagged: 1
safe.yml   flagged: 0
-> only the version that interpolates the value straight into 'run:' is flagged.`,
        explain: 'Two workflows respond to a new issue comment. The unsafe one drops the comment body — text an outside user fully controls — directly into a run script via a dollar-brace expression. Because GitHub substitutes that expression into the script source before the shell parses it, a comment containing shell metacharacters becomes executable code on the runner, with the workflow\'s token and any secrets in scope; this is command injection. The safe one binds the same value to an environment variable in the step\'s env block. GitHub sets that variable to the literal comment text, and the script reads it as a normal shell variable, so the shell treats the content as a string of data with no interpretation. Running actionlint over both, it flags exactly one line — the interpolation in the unsafe workflow — and reports zero problems for the safe workflow. This is why actionlint belongs in CI as a required check: the rule "never put an attacker-controllable context value directly in run text" is easy to violate by habit, and a linter catches every instance mechanically, including the many other fields a contributor can influence such as branch names, PR titles, and issue bodies.',
        explainHi: 'Do workflows ek naye issue comment ka response dete hain. Unsafe wala comment body ko — text jo ek outside user poori tarah control karta hai — ek run script mein directly ek dollar-brace expression ke through daalता hai. Kyunki GitHub us expression ko script source mein substitute karta hai shell ke parse karne se pehle, shell metacharacters wala ek comment runner par executable code ban jaata hai. Safe wala same value ko step ke env block mein ek environment variable se bind karta hai. GitHub us variable ko literal comment text set karta hai, aur script ise ek normal shell variable ke roop mein padhता hai. Dono par actionlint chalाना theek ek line flag karta hai — unsafe workflow mein interpolation — aur safe workflow ke liye zero problems report karta hai. Isliye actionlint CI mein ek required check ke roop mein belong karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# long-lived AWS keys in repo secrets
# repo secrets: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY  (created 2 years ago, never rotated)
- uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id:     \${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1
# the key is copied into every runner, never expires, and if it leaks (a compromised
# 3rd-party action, a logged env dump, an ex-employee) an attacker has your AWS until
# a human notices. rotation is a painful cross-team scramble.`,
        right: `# OIDC: no stored key. the job proves its identity and gets TEMPORARY creds:
permissions:
  id-token: write            # the enabling switch
  contents: read
steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::ACCT:role/gha-deploy   # trust policy pins repo + branch
      aws-region: us-east-1
# AWS side: an IAM OIDC identity provider for token.actions.githubusercontent.com, and a
# role whose trust policy constrains the 'sub' claim to 'repo:org/app:ref:refs/heads/main'.
# Azure: azure/login@v2 + a federated credential. GCP: Workload Identity Federation.
# result: nothing to leak, nothing to rotate, blast radius = one 15-min credential.`,
        why: 'A long-lived cloud access key stored in CI secrets is a standing liability. It does not expire, so it remains valid until someone deliberately rotates it. It is materialised into the environment of every runner that uses it, so any code that executes in those jobs — including a third-party action that was compromised, or a step that dumps the environment to a log — can read it. And if it is exfiltrated, the attacker has whatever that key can do in the cloud account, indefinitely, until a human notices anomalous activity and coordinates a rotation, which across a team is slow and error-prone. OIDC eliminates the stored key. The job asks GitHub for a short-lived signed token that asserts verifiable facts about the run, the cloud provider is configured to trust GitHub\'s token issuer and to accept only tokens whose claims match a policy scoped to the specific repository and branch, and it returns temporary credentials that expire with the job. There is no secret in the repository, nothing to leak, nothing to rotate, and a compromised run yields at most one short-lived credential bound to one narrowly-scoped role. Every major cloud supports this — AWS via an IAM OIDC provider and role, Azure via a federated credential, GCP via Workload Identity Federation.',
        whyHi: 'CI secrets mein stored ek long-lived cloud access key ek standing liability hai. Ye expire nahi hota, to ye valid rehta hai jab tak koi deliberately ise rotate na kare. Ye har runner ke environment mein materialised hota hai jo ise use karta hai, to koi bhi code jo un jobs mein execute karta hai ise padh sakta hai. Aur agar ye exfiltrate hota hai, attacker ke paas wo hai jo wo key cloud account mein kar sakta hai, indefinitely. OIDC stored key eliminate karta hai. Job GitHub se ek short-lived signed token maangता hai jo run ke baare mein verifiable facts assert karta hai, cloud provider GitHub ke token issuer ko trust karne ke liye configured hai aur sirf un tokens ko accept karta hai jinke claims ek specific repository aur branch ke liye scoped ek policy se match karte hain, aur ye temporary credentials return karta hai jo job ke saath expire hote hain.',
      },
      {
        wrong: `# pull_request_target + checking out and running the PR's code
on: pull_request_target       # <-- runs with WRITE token + secrets
jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>
        with:
          ref: \${{ github.event.pull_request.head.sha }}   # <-- the UNTRUSTED PR code
      - run: npm ci && npm run build && npm run deploy:preview
# 'npm ci' runs the PR's postinstall scripts. 'npm run build' runs the PR's build config.
# a fork PR now executes arbitrary code WITH your deploy secrets and a write token.
# this exact pattern is behind multiple real-world supply-chain breaches.`,
        right: `# if the workflow executes ANYTHING from the PR -> use plain 'pull_request':
on: pull_request              # fork PRs: NO secrets, read-only token. safe to run PR code.
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>          # checks out the PR head by default - fine, no secrets
      - run: npm ci && npm run build          # untrusted code, but zero privileges
# need a preview deploy that requires secrets? split it:
#   - a maintainer reviews the PR, then applies a label
#   - a SEPARATE 'on: pull_request_target' (or workflow_dispatch) workflow, triggered by that
//     label, checks out the BASE branch's trusted deploy script and deploys the pre-built artifact
#   - it NEVER runs build/test/install from the PR.`,
        why: 'The pull_request_target event exists so that automation can react to a pull request with elevated privileges — a write token and secrets — while running only workflow code from the trusted base branch. It is safe precisely because the code it runs was written and reviewed by maintainers, not by the PR author. Explicitly checking out the pull request\'s head commit and then running its install, build, or test commands breaks that safety completely: those commands execute code from the untrusted fork, and because the event granted a write token and secrets, that untrusted code now runs with them. An attacker opens a pull request whose postinstall script or build configuration exfiltrates the secrets or pushes a commit, and the workflow does it for them. The correct approach for anything that runs PR code is the plain pull_request event, where fork pull requests get no secrets and a read-only token, so executing untrusted code is harmless. When a PR genuinely needs a privileged action such as a preview deployment, it is split into two workflows: the unprivileged one builds and tests the PR, and a separate privileged workflow, gated behind a maintainer action like applying a label, runs only trusted scripts from the base branch against the already-built artifact and never invokes anything from the PR.',
        whyHi: 'pull_request_target event isliye exist karta hai taaki automation ek pull request ka response elevated privileges ke saath de sake — ek write token aur secrets — jabki sirf trusted base branch se workflow code chalाते hue. Ye theek isliye safe hai kyunki jo code ye chalाता hai wo maintainers dwara likha aur reviewed tha. Explicitly pull request ke head commit ko checkout karna aur phir iske install, build, ya test commands chalana us safety ko poori tarah todता hai: wo commands untrusted fork se code execute karte hain, aur kyunki event ne ek write token aur secrets grant kiye, wo untrusted code ab unke saath chalta hai. Correct approach kuch bhi jo PR code chalाता hai ke liye plain pull_request event hai. Jab ek PR ko genuinely ek privileged action chahiye, ise do workflows mein split kiya jaata hai.',
      },
      {
        wrong: `# pinning third-party actions to a moving tag
- uses: tj-actions/changed-files@v35        # a tag - the owner can move it
- uses: some-marketplace/deploy@v2
# in a real 2024 incident, a popular action's tag was repointed to a commit that dumped
# CI secrets to a remote server. every workflow using '@v<n>' ran the malicious code on
# its next run, before anyone noticed. tags are not a security boundary.`,
        right: `# pin to a full commit SHA - immutable - and let a bot propose bumps:
- uses: tj-actions/changed-files@<40-char-sha>   # e.g. 4f3f9...  (the commit you reviewed)
- uses: some-marketplace/deploy@<40-char-sha>
# .github/dependabot.yml:
#   updates:
#     - package-ecosystem: "github-actions"
#       directory: "/"
#       schedule: { interval: "weekly" }
# now a SHA bump is a reviewed PR, not a silent change. pin first-party actions too
# (actions/checkout@<sha>) - GitHub's account can be compromised as well.`,
        why: 'A uses reference with a tag such as @v2 resolves the tag to whatever commit it currently points at, and Git tags are mutable — the owner of the action repository, or anyone who compromises that owner\'s account, can move the tag to a different commit at any time. Because CI resolves the tag fresh on every run, a repointed tag means every workflow that references it executes the new commit on its next run, with whatever token and secrets that workflow exposes, before any human is aware anything changed. This has happened in practice: a widely-used action had its tag moved to a commit that harvested CI secrets, and every consumer pinned to the tag ran it. Pinning to a full forty-character commit SHA removes the mutability — a SHA identifies exactly one immutable commit, so the code that was reviewed when the pin was added is the code that runs until the pin is deliberately changed. Keeping pins current is then a matter of a bot such as Dependabot opening a pull request to bump the SHA, which a human reviews and merges, making every update an intentional, auditable event. First-party actions from GitHub itself should be pinned the same way; no account is beyond compromise.',
        whyHi: 'Ek uses reference ek tag jaise @v2 ke saath tag ko us commit par resolve karta hai jispar ye currently point karta hai, aur Git tags mutable hain — action repository ka owner, ya koi bhi jo us owner ke account ko compromise karta hai, tag ko kisi bhi samay ek alag commit par move kar sakta hai. Kyunki CI tag ko har run par fresh resolve karta hai, ek repointed tag ka matlab har workflow jo ise reference karta hai apne next run par naya commit execute karta hai. Ye practice mein hua hai. Ek full forty-character commit SHA par pin karna mutability hataता hai — ek SHA theek ek immutable commit identify karta hai. Pins ko current rakhna phir Dependabot jaise ek bot ka SHA bump karne ke liye ek pull request kholne ka maamla hai.',
      },
    ],

    realWorld: [
      {
        en: '**A leaked `AWS_SECRET_ACCESS_KEY` from a CI log** — a debug step ran `env | sort` during an incident and the key was in a screenshot pasted into Slack. Rotation touched 14 workflows across 6 repos. Post-incident, every cloud auth moved to OIDC; there are now zero long-lived cloud keys in the org.',
        hi: '**Ek CI log se ek leaked `AWS_SECRET_ACCESS_KEY`** — ek debug step ne `env | sort` chalाya aur key ek screenshot mein thi. Har cloud auth OIDC par move hua.',
      },
      {
        en: '**A `pull_request_target` workflow that checked out and `npm ci`-ed the PR** — a security researcher opened a PR whose `postinstall` printed `${{ secrets }}` (base64-encoded to dodge masking) to a paste site. Fixed by splitting: `pull_request` builds/tests the PR with no secrets; a label-gated `workflow_dispatch` does the privileged preview deploy from trusted scripts.',
        hi: '**Ek `pull_request_target` workflow jisne PR ko checkout aur `npm ci` kiya** — ek security researcher ne ek PR khola jiska `postinstall` secrets print karta tha. Split karके fix kiya.',
      },
      {
        en: '**A moved action tag ran secret-stealing code in ~200 repos** (a real 2025-era incident class) — orgs pinned to `@v<n>` executed the malicious commit on their next run. Those pinned to a SHA were unaffected. The remediation everywhere was SHA-pinning + `actionlint` + Dependabot for github-actions.',
        hi: '**Ek moved action tag ne ~200 repos mein secret-stealing code chalाya** — `@v<n>` par pinned orgs ne apne next run par malicious commit execute kiya. SHA par pinned unaffected the.',
      },
    ],

    interviewQA: [
      {
        q: 'What is OIDC in the context of CI/CD, and why is it better than storing cloud access keys?',
        qHi: 'CI/CD ke context mein OIDC kya hai, aur ye cloud access keys store karne se behtar kyun hai?',
        a: 'OIDC lets a CI job authenticate to a cloud provider without any stored credential. GitHub Actions issues a short-lived, signed JSON Web Token for the job containing verifiable claims about the run — the repository, the branch or tag, the workflow, the environment, the actor. The cloud provider is configured to trust GitHub\'s OIDC token issuer and to accept a token only if its claims match a policy you define, typically constraining it to one repository and one branch. In exchange the provider returns temporary credentials that expire when the job ends. On AWS this is an IAM OIDC identity provider plus a role whose trust policy pins the subject claim; on Azure it is a federated credential on an app registration; on GCP it is Workload Identity Federation. This is better than a stored access key on several fronts. There is no secret in the repository to leak. The key cannot be exfiltrated by a compromised action or a logged environment dump because it does not exist until the job requests it and it expires minutes later. There is nothing to rotate. And the blast radius of a compromised run is a single short-lived credential scoped to one narrowly-defined role, rather than standing access to the cloud account that persists until a human notices and coordinates a rotation.',
        aHi: 'OIDC ek CI job ko bina kisi stored credential ke ek cloud provider ke saath authenticate karne deta hai. GitHub Actions job ke liye ek short-lived, signed JSON Web Token issue karta hai jismein run ke baare mein verifiable claims hain — repository, branch ya tag, workflow. Cloud provider GitHub ke OIDC token issuer ko trust karne ke liye configured hai aur ek token ko sirf tab accept karta hai jab iske claims ek policy se match karte hain jo aap define karte ho. Badle mein provider temporary credentials return karta hai jo job ke khatam hone par expire hote hain. Ye ek stored access key se kई fronts par behtar hai. Repository mein leak karne ke liye koi secret nahi hai. Key ko exfiltrate nahi kiya ja sakta. Rotate karne ke liye kuch nahi. Aur ek compromised run ka blast radius ek single short-lived credential hai.',
      },
      {
        q: 'Explain the difference between pull_request and pull_request_target, and the mistake that makes the latter dangerous.',
        qHi: 'pull_request aur pull_request_target mein farak samjhao.',
        a: 'A pull_request workflow runs the workflow file as it exists in the pull request, and for a pull request from a fork it runs with no access to secrets and a read-only GITHUB_TOKEN. This makes it safe to check out and run the PR\'s code — build it, test it — because untrusted code executes with no privileges. A pull_request_target workflow runs the workflow file from the base branch, which maintainers control, but with a full read-write token and access to secrets, in the context of the incoming pull request. Its legitimate purpose is privileged automation that never touches the PR\'s code — applying labels, posting a comment, reading the PR\'s metadata. The dangerous mistake is to use pull_request_target and then explicitly check out the pull request\'s head commit and run something from it, such as npm ci, which executes arbitrary postinstall scripts, or the PR\'s build or test commands. At that point untrusted code from a fork is executing with your write token and your secrets, and an attacker can craft a PR whose install or build step exfiltrates the secrets or pushes a commit. The rule is simple: if the workflow will build, test, install, or otherwise execute anything from the pull request, it must be a plain pull_request workflow. Privileged operations like a preview deployment are split into a separate workflow gated behind a maintainer action that runs only trusted base-branch scripts.',
        aHi: 'Ek pull_request workflow workflow file ko chalाता hai jaisा ye pull request mein exist karta hai, aur ek fork se ek pull request ke liye ye secrets tak koi access aur ek read-only GITHUB_TOKEN ke saath chalta hai. Ye PR ke code ko checkout aur run karne ke liye safe banata hai. Ek pull_request_target workflow workflow file ko base branch se chalाता hai, par ek full read-write token aur secrets tak access ke saath. Iska legitimate purpose privileged automation hai jo kabhi PR ke code ko touch nahi karti. Dangerous mistake pull_request_target use karna aur phir explicitly pull request ke head commit ko checkout karna aur isse kuch chalana hai. Us point par ek fork se untrusted code aapke write token aur aapke secrets ke saath execute kar raha hai. Rule simple hai: agar workflow PR se kuch execute karega, ise ek plain pull_request workflow hona chahiye.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, describe the three axes of secret protection (scope, the fork rule, masking) and least-privilege `permissions:`.',
        taskHi: 'Ek comment mein, secret protection ke teen axes describe karo.',
        hint: 'A CI run briefly holds `GITHUB_TOKEN` + every secret referenced in the job. SCOPE — 3 levels, prefer the NARROWEST: repo secrets (all workflows), ENVIRONMENT secrets (only jobs with `environment: <name>` → gate prod creds behind that env\'s protection rules, Lesson 5), org secrets (across repos, optionally restricted to selected repos). MASKING — any value registered as a secret is auto-replaced with `***` in logs; but a step can trivially transform it (`base64`, reverse, split) so the transformed form prints in clear → masking is a SAFETY NET against an accidental `echo`, NOT a security boundary; never rely on it against code that can reach the secret. THE FORK RULE — on `pull_request` FROM A FORK, GitHub passes NO secrets and makes `GITHUB_TOKEN` READ-ONLY (deliberate: a stranger\'s unreviewed code must not get your secrets/write access). Workflows needing secrets to test a PR must be redesigned around this (e.g. maintainer applies a label → a separate reviewed workflow). LEAST-PRIVILEGE `permissions:` — set it EXPLICITLY at workflow/job level, start from `contents: read`, add ONLY what this workflow uses (`packages: write` to publish, `id-token: write` for OIDC, `pull-requests: write` to comment). A test-only workflow needs `contents: read` and nothing else.',
        hintHi: 'Ek CI run thodi der ke liye `GITHUB_TOKEN` + job mein referenced har secret rakhta hai. SCOPE — 3 levels, NARROWEST prefer karo: repo secrets, ENVIRONMENT secrets (sirf `environment: <name>` wale jobs), org secrets. MASKING — koi bhi value jo ek secret ke roop mein registered hai logs mein auto `***`; par ek step ise trivially transform kar sakta hai → masking ek SAFETY NET hai, ek security boundary NAHI. FORK RULE — ek FORK se `pull_request` par, GitHub KOI secrets nahi pass karta aur `GITHUB_TOKEN` READ-ONLY banata hai. LEAST-PRIVILEGE `permissions:` — ise EXPLICITLY set karo, `contents: read` se shuru karo, SIRF wo add karo jo ye workflow use karta hai.',
      },
      {
        task: 'In a comment, explain OIDC for AWS and Azure — the enabling permission, what the token proves, what the cloud side needs, and why there is nothing to leak or rotate.',
        taskHi: 'Ek comment mein, AWS aur Azure ke liye OIDC samjhao.',
        hint: 'THE OLD WAY: an IAM user + a long-lived `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` pasted into repo secrets — never expires, copied into every runner, leak = standing cloud access until a human rotates. OIDC removes the stored key. ENABLING PERMISSION: `permissions: { id-token: write }` at workflow/job level — without it the job CANNOT request the OIDC token. WHAT THE TOKEN PROVES: GitHub issues a SHORT-LIVED, SIGNED JWT with verifiable claims about the run — `repository`, `ref` (branch/tag), `workflow`, `environment`, `actor` — e.g. `sub = repo:acme/app:ref:refs/heads/main`. AWS SIDE: an IAM OIDC identity provider for `token.actions.githubusercontent.com` + an IAM role whose TRUST POLICY constrains the `sub` claim to your repo + branch; the job runs `aws-actions/configure-aws-credentials@v4` with only `role-to-assume` + `aws-region` (NO keys) and gets TEMPORARY creds that expire with the job. AZURE SIDE: a FEDERATED CREDENTIAL on an Entra ID app registration; `azure/login@v2` with `client-id` + `tenant-id` + `subscription-id` — these are IDENTIFIERS, not secrets, fine as `vars`. (GCP: Workload Identity Federation.) WHY NOTHING TO LEAK/ROTATE: no secret in the repo; the credential doesn\'t exist until the job requests it and expires minutes later; a compromised run yields at most ONE short-lived credential scoped to ONE narrow role.',
        hintHi: 'PURANA TARIKA: ek IAM user + ek long-lived key pair repo secrets mein — kabhi expire nahi, har runner mein copied, leak = standing cloud access. OIDC stored key hataता hai. ENABLING PERMISSION: `permissions: { id-token: write }` — iske bina job OIDC token request NAHI kar sakta. TOKEN KYA PROVE KARTA HAI: GitHub ek SHORT-LIVED, SIGNED JWT issue karta hai verifiable claims ke saath — `repository`, `ref`, `workflow` — e.g. `sub = repo:acme/app:ref:refs/heads/main`. AWS SIDE: ek IAM OIDC provider + ek role jiski TRUST POLICY `sub` claim ko aapke repo + branch tak constrain karti hai; `role-to-assume` + `aws-region` (KOI keys nahi) → TEMPORARY creds. AZURE: ek FEDERATED CREDENTIAL; `azure/login@v2` with `client-id`/`tenant-id`/`subscription-id` — IDENTIFIERS, secrets nahi.',
      },
      {
        task: 'In a comment, explain the `pull_request_target` trap and why third-party actions must be pinned by SHA.',
        taskHi: 'Ek comment mein, `pull_request_target` trap aur SHA pinning samjhao.',
        hint: '`pull_request` = runs the workflow file FROM THE PR; for a FORK PR: NO secrets + READ-ONLY token → safe to checkout + build + test the PR\'s code (untrusted code, zero privileges). `pull_request_target` = runs the workflow file FROM THE BASE BRANCH (maintainer-controlled) but WITH a full READ-WRITE `GITHUB_TOKEN` + SECRETS, in the incoming PR\'s context. Legit use: privileged automation that NEVER touches PR code — labels, a welcome comment, reading PR metadata. THE TRAP: use `pull_request_target` AND then `actions/checkout` the PR\'s `head.sha` AND run something from it — `npm ci` (arbitrary `postinstall` scripts!), the PR\'s build/test config → untrusted fork code now executes WITH your write token + secrets. An attacker crafts a PR whose install/build step exfiltrates `${{ secrets }}` (base64 to dodge masking) or pushes a commit. This exact pattern is behind multiple real supply-chain breaches. RULE: if the workflow will build/test/install/execute ANYTHING from the PR → it MUST be plain `pull_request`. Need a privileged preview deploy? SPLIT: unprivileged `pull_request` builds+tests; a SEPARATE label-gated `pull_request_target`/`workflow_dispatch` runs only TRUSTED base-branch scripts against the already-built artifact, never invoking PR code. SHA PINNING: `uses: org/action@v3` resolves a MUTABLE tag — the owner (or an attacker who compromised them) can repoint `v3` to a malicious commit, and every consumer runs it on the NEXT run before anyone notices (this has happened, harvesting CI secrets across ~200 repos). Pin to a FULL 40-char commit SHA (immutable — the reviewed code is what runs) + Dependabot (`package-ecosystem: "github-actions"`) to raise SHA-bump PRs. Pin FIRST-PARTY actions too (`actions/checkout@<sha>`) — GitHub\'s account isn\'t immune.',
        hintHi: '`pull_request` = workflow file PR SE chalाता hai; FORK PR ke liye: KOI secrets + READ-ONLY token → PR ke code ko checkout + build + test karne ke liye safe. `pull_request_target` = workflow file BASE BRANCH SE chalाता hai par ek full READ-WRITE token + SECRETS ke saath, PR ke context mein. Legit use: privileged automation jo KABHI PR code ko touch nahi karti. THE TRAP: `pull_request_target` use karo AUR phir PR ke `head.sha` ko `actions/checkout` karo AUR isse kuch chalao — `npm ci` (`postinstall` scripts!) → untrusted fork code ab aapke write token + secrets ke saath execute karta hai. RULE: agar workflow PR se KUCH BHI build/test/install/execute karega → ise plain `pull_request` HONA CHAHIYE. SHA PINNING: `uses: org/action@v3` ek MUTABLE tag resolve karta hai — owner ise ek malicious commit par repoint kar sakta hai. FULL 40-char SHA par pin karo + Dependabot. FIRST-PARTY actions bhi pin karo.',
      },
    ],

    keyTakeaways: [
      'A CI RUN briefly holds `GITHUB_TOKEN` + every secret referenced in the job — if attacker code executes there, it can push commits, publish packages, or exfiltrate secrets. SECRETS: scope narrowest (repo → ENVIRONMENT → org — prod creds go on the `production` environment); MASKING (`***` in logs) is a safety net against accidental `echo`, NOT a boundary (a step can `base64` a secret past it); THE FORK RULE — `pull_request` from a fork gets NO secrets + a READ-ONLY token (deliberate); set `permissions:` EXPLICITLY, start `contents: read`, add only what the workflow uses.',
      'OIDC = no stored cloud keys. `permissions: { id-token: write }` lets the job get a SHORT-LIVED SIGNED JWT proving `repo:org/app:ref:refs/heads/main` etc; the cloud trusts GitHub\'s issuer and returns TEMPORARY creds. AWS: an IAM OIDC provider + a role whose trust policy pins the `sub` claim; `aws-actions/configure-aws-credentials@v4` with `role-to-assume` + `aws-region`, NO keys. AZURE: a FEDERATED CREDENTIAL + `azure/login@v2` with `client-id`/`tenant-id`/`subscription-id` (identifiers, not secrets — store as `vars`). GCP: Workload Identity Federation. Nothing to leak, nothing to rotate, blast radius = one 15-min credential.',
      'PIN THIRD-PARTY ACTIONS BY FULL 40-CHAR COMMIT SHA, not a tag. `@v3` is a MUTABLE tag — the owner (or an attacker who compromised them) can repoint it to malware, and every consumer runs it on the next run before anyone notices (real incidents have harvested CI secrets across hundreds of repos). A SHA is immutable → the reviewed code is what runs. Add Dependabot (`package-ecosystem: "github-actions"`) so bumps are reviewed PRs. Pin FIRST-PARTY actions too (`actions/checkout@<sha>`).',
      'THE `pull_request_target` TRAP: it runs the workflow from the BASE BRANCH but WITH a read-write token AND secrets, in an untrusted PR\'s context. Legit use = automation that NEVER touches PR code (labels, comments). CATASTROPHIC: `pull_request_target` + `checkout` the PR head + run its `npm ci` / build / tests → untrusted fork code executes WITH your write token + secrets (behind multiple real supply-chain breaches). RULE: anything that builds/tests/installs/executes PR code MUST be plain `pull_request`. Privileged preview deploys → split into a label-gated separate workflow running only trusted base-branch scripts.',
      'SCRIPT INJECTION (Lesson 2): never interpolate an attacker-controllable `${{ github.event.* }}` / `github.head_ref` directly into `run:` text — GitHub substitutes it into the script SOURCE before the shell parses it, so shell metacharacters in a PR title / comment / branch name execute on the runner. Bind it to an `env:` var instead (GitHub sets the literal value; `$VAR` is data, not code). RUN `actionlint` IN CI AS A REQUIRED CHECK — it catches script injection, malformed/unpinned action refs, and expression/context type errors automatically. None of this is optional hardening: a public repo with a careless workflow is targeted within hours.',
    ],
    keyTakeawaysHi: [
      'Ek CI RUN thodi der ke liye `GITHUB_TOKEN` + job mein referenced har secret rakhta hai. SECRETS: scope narrowest (repo → ENVIRONMENT → org); MASKING (`***`) ek safety net hai, ek boundary NAHI; FORK RULE — ek fork se `pull_request` KOI secrets + ek READ-ONLY token paata hai; `permissions:` EXPLICITLY set karo, `contents: read` se shuru.',
      'OIDC = koi stored cloud keys nahi. `permissions: { id-token: write }` job ko ek SHORT-LIVED SIGNED JWT paane deta hai jo `repo:org/app:ref:refs/heads/main` prove karta hai; cloud GitHub ke issuer ko trust karta hai aur TEMPORARY creds return karta hai. AWS: ek IAM OIDC provider + ek role; `role-to-assume` + `aws-region`, KOI keys nahi. AZURE: ek FEDERATED CREDENTIAL + `azure/login@v2` (`client-id`/`tenant-id`/`subscription-id` — identifiers, `vars` ke roop mein store). Leak/rotate karne ke liye kuch nahi.',
      'THIRD-PARTY ACTIONS KO FULL 40-CHAR COMMIT SHA SE PIN KARO, ek tag se nahi. `@v3` ek MUTABLE tag hai — owner ise malware par repoint kar sakta hai, aur har consumer ise next run par chalाता hai. Ek SHA immutable hai. Dependabot add karo. FIRST-PARTY actions bhi pin karo.',
      '`pull_request_target` TRAP: ye workflow ko BASE BRANCH se chalाता hai par ek read-write token AUR secrets ke saath. Legit use = automation jo KABHI PR code ko touch nahi karti. CATASTROPHIC: `pull_request_target` + PR head `checkout` + iske `npm ci` / build chalao → untrusted fork code aapke write token + secrets ke saath execute karta hai. RULE: kuch bhi jo PR code build/test/install karta hai plain `pull_request` HONA CHAHIYE.',
      'SCRIPT INJECTION (Lesson 2): kabhi ek attacker-controllable `${{ github.event.* }}` seedha `run:` text mein interpolate mat karo — GitHub ise script SOURCE mein substitute karta hai shell ke parse karne se pehle. Ise ek `env:` var se bind karo. CI mein `actionlint` ek REQUIRED CHECK ke roop mein CHALAO — ye script injection, malformed/unpinned action refs, aur expression errors automatically catch karta hai.',
    ],
  },

  {
    slug: 'ops-environments-protection-rules-and-promotion',
    title: 'Environments, Protection Rules & Promotion',
    titleHi: 'Environments, Protection Rules & Promotion',
    description: 'An environment is a named deployment target — staging, production — that can carry its own secrets and its own protection rules: required reviewers, a wait timer, a branch restriction. The pipeline builds one artifact and promotes that same artifact through the environments, with a human gate wherever you choose to put one.',
    descriptionHi: 'Ek environment ek named deployment target hai — staging, production — jo apne secrets aur apne protection rules carry kar sakta hai: required reviewers, ek wait timer, ek branch restriction. Pipeline ek artifact build karta hai aur wahi artifact environments ke through promote karta hai, ek human gate ke saath jahaan bhi aap ek rakhne ka chunte ho.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**Moving one master film print through a chain of screening rooms.** The lab develops the print **once** (the build). It goes to the internal preview room (staging) — anyone on the crew can walk in. Then to the executive screening room (production), which has a locked door: the projectionist will not start until two named executives have badged in (**required reviewers**), and there is a mandatory five-minute wait after the request so someone can shout "stop" (**wait timer**). Crucially, every room screens the **exact same print** — nobody re-develops the film for the executive room, so what the executives approve is bit-for-bit what preview watched. And there is a manual override: a producer can call the projection booth and say "run reel 4471 now" (**manual promotion**) for a specific, named print.',
      hi: '**Ek master film print ko screening rooms ki ek chain ke through move karna.** Lab print ko **ek baar** develop karta hai (build). Ye internal preview room (staging) jaata hai — crew par koi bhi andar aa sakta hai. Phir executive screening room (production), jiska ek locked door hai: projectionist tab tak start nahi karega jab tak do named executives badge in na karein (**required reviewers**), aur request ke baad ek mandatory paanch-minute wait hai (**wait timer**). Crucially, har room **exact same print** screen karta hai — koi executive room ke liye film re-develop nahi karta. Aur ek manual override hai: ek producer projection booth ko call karके keh sakta hai "reel 4471 ab chalao" (**manual promotion**).',
    },

    simple: `**AN ENVIRONMENT = a named deploy target + its own secrets + protection RULES.**
\`\`\`yaml
jobs:
  deploy-prod:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.example.com     # shown in the GitHub UI + deployment record
    steps:
      - run: ./deploy.sh
\`\`\`
Configure the \`production\` environment (repo Settings) with:
\`\`\`
required reviewers        job PAUSES until one of the named people/teams approves in the UI
wait timer                job PAUSES for N minutes before it can start (a "shout stop" window)
deployment branch policy  only 'main' (or tags matching 'v*') may deploy to this environment
environment SECRETS        only jobs that target 'environment: production' can read them
\`\`\`
A job with \`environment:\` shows as a **deployment** in GitHub, with a status and history.

**BUILD ONCE, PROMOTE THE SAME ARTIFACT** (Lesson 1) through the environments:
\`\`\`yaml
jobs:
  build:            # runs ONCE. uploads the release artifact.
  deploy-staging:   { needs: build,          environment: staging }
  deploy-prod:      { needs: deploy-staging,  environment: production }   # gated by prod's rules
# each deploy job DOWNLOADS the build artifact - never rebuilds. staging and prod run the
# identical bytes. what you approve for prod is exactly what staging validated.
\`\`\`

**MANUAL PROMOTION** — a human triggers the prod deploy of a specific version:
\`\`\`yaml
on:
  workflow_dispatch:
    inputs:
      version:   { description: "artifact version to ship", required: true }
      approver:  { description: "who is approving",         required: true }
jobs:
  promote:
    environment: production      # still subject to the environment's protection rules
    steps:
      - run: 'echo "promoting \${{ inputs.version }} approved by \${{ inputs.approver }}"'
\`\`\`

**GitHub Deployments** — the API/record behind \`environment:\`. Each deploy creates a
deployment object with a status (in_progress -> success / failure) you can query and that
shows on the repo, PRs, and the environment page.`,

    simpleHi: `**EK ENVIRONMENT = ek named deploy target + apne secrets + protection RULES.**
\`\`\`yaml
jobs:
  deploy-prod:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.example.com
    steps:
      - run: ./deploy.sh
\`\`\`
\`production\` environment ko configure karo:
\`\`\`
required reviewers        job PAUSE hota hai jab tak named log/teams UI mein approve na karein
wait timer                job start hone se pehle N minutes PAUSE hota hai
deployment branch policy  sirf 'main' (ya 'v*' matching tags) is environment mein deploy kar sakte hain
environment SECRETS        sirf 'environment: production' target karne wale jobs unhe padh sakte hain
\`\`\`
\`environment:\` wala ek job GitHub mein ek **deployment** ke roop mein dikhta hai.

**BUILD ONCE, WAHI ARTIFACT PROMOTE KARO** (Lesson 1) environments ke through:
\`\`\`yaml
jobs:
  build:            # EK BAAR chalta hai. release artifact upload karta hai.
  deploy-staging:   { needs: build,          environment: staging }
  deploy-prod:      { needs: deploy-staging,  environment: production }
# har deploy job build artifact DOWNLOAD karta hai - kabhi rebuild nahi. staging aur prod
# identical bytes chalाते hain.
\`\`\`

**MANUAL PROMOTION** — ek human ek specific version ka prod deploy trigger karta hai:
\`\`\`yaml
on:
  workflow_dispatch:
    inputs:
      version:   { description: "artifact version to ship", required: true }
      approver:  { description: "who is approving",         required: true }
jobs:
  promote:
    environment: production
    steps:
      - run: 'echo "promoting \${{ inputs.version }} approved by \${{ inputs.approver }}"'
\`\`\`

**GitHub Deployments** — \`environment:\` ke peeche API/record. Har deploy ek deployment object
banaता hai ek status ke saath.`,

    content: `## What an environment is

An **environment** in GitHub Actions is a named deployment target that a job attaches to with \`environment: <name>\`. Environments are configured in the repository settings, and they give you three things that a bare job does not have.

### Environment secrets and variables

A secret or variable defined **on an environment** is only available to jobs that declare that environment. This is the mechanism for keeping production credentials away from everything else: the \`production\` environment holds the production deploy key, and only a job with \`environment: production\` can read it — a pull-request test workflow, or a staging deploy, cannot. It is a stronger boundary than repository secrets, which every workflow can see.

### Protection rules

An environment can require conditions to be met before a job targeting it will run:

- **Required reviewers** — the job **pauses** and GitHub requests approval from named people or teams. It does not start until one of them approves in the UI (and up to a configurable number must approve). This is the human gate for production.
- **Wait timer** — the job pauses for a configured number of minutes before it is allowed to start, giving a window to cancel a deploy that should not go out.
- **Deployment branch and tag policy** — restrict which refs may deploy to this environment: only \`main\`, or only branches matching a pattern, or only tags matching \`v*\`. A deploy attempt from any other ref is rejected.

While a job is waiting on a reviewer or a timer, the whole workflow run is paused at that job; downstream jobs do not proceed.

### The deployment record

A job with \`environment:\` is registered as a **deployment** in GitHub. It appears on the environment's page with a history, its status moves through \`in_progress\` to \`success\` or \`failure\`, the \`url\` you set is linked, and the deployment shows up on the repository and on any associated pull request. This is the audit trail of what was deployed where and when, and it is queryable through the **Deployments API**.

## Build once, promote the same artifact

The environment structure is where the *build once* principle from Lesson 1 becomes concrete. The pipeline has one \`build\` job that compiles the application and uploads it as an artifact. Then:

\`\`\`yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>
      - run: make release            # produces dist/
      - uses: actions/upload-artifact@<sha>
        with: { name: release, path: dist/ }

  deploy-staging:
    needs: build
    environment: { name: staging, url: https://staging.example.com }
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@<sha>
        with: { name: release, path: dist/ }
      - run: ./deploy.sh dist/ staging

  deploy-prod:
    needs: deploy-staging
    environment: { name: production, url: https://app.example.com }
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@<sha>
        with: { name: release, path: dist/ }
      - run: ./deploy.sh dist/ production
\`\`\`

Both deploy jobs **download** the artifact that \`build\` produced; neither rebuilds. Staging runs the exact bytes that production will run. When a reviewer approves the \`production\` job, they are approving a version that staging has already exercised — same digest, same behaviour. If instead each environment ran its own build, "it worked in staging" would carry no guarantee about production, because production would be running a different, separately-produced binary.

The chain \`build -> deploy-staging -> deploy-prod\` via \`needs\` means production only deploys after staging succeeded, and the \`production\` environment's protection rules add the human gate at exactly the right point.

## Manual promotion

Sometimes you do not want the prod deploy to trigger automatically from a merge — you want a person to decide *when* a specific, already-built version ships. That is \`workflow_dispatch\` with inputs:

\`\`\`yaml
on:
  workflow_dispatch:
    inputs:
      version:
        description: "release version / artifact tag to promote"
        required: true
      approver:
        description: "who authorised this promotion"
        required: true
jobs:
  promote:
    runs-on: ubuntu-latest
    environment: production        # the environment's rules STILL apply
    steps:
      - run: |
          echo "promoting version \${{ inputs.version }}"
          echo "authorised by \${{ inputs.approver }}"
          ./deploy.sh "\${{ inputs.version }}" production
\`\`\`

A person opens the workflow in the GitHub UI, fills in the version and their name, and runs it. The environment's protection rules still apply on top — so a promotion can require both a form submission *and* a second reviewer's approval. This pattern suits release trains, coordinated launches, and any situation where the deploy timing is a deliberate decision rather than a consequence of merging.

## Where to put the gate

- **Continuous deployment** (Module 1): no manual gate at all — merge to main, and \`deploy-prod\` runs automatically after staging, relying on tests, canary, and automated rollback for safety.
- **One approval** — the \`production\` environment requires a reviewer; every prod deploy pauses for a human to click approve. Common and reasonable.
- **Manual promotion** — prod does not deploy on merge at all; a person runs a \`workflow_dispatch\` when they decide to ship. For teams that batch releases or coordinate with other groups.

These are not mutually exclusive across services — a mature org often runs continuous deployment for low-risk services and a manual gate for the payments service.`,

    contentHi: `## Ek environment kya hai

GitHub Actions mein ek **environment** ek named deployment target hai jisse ek job \`environment: <name>\` se attach hota hai. Environments repository settings mein configured hote hain, aur wo aapko teen cheezein dete hain jo ek bare job ke paas nahi hain.

### Environment secrets aur variables

Ek secret ya variable jo **ek environment par** defined hai sirf un jobs ke liye available hai jo us environment ko declare karte hain. Ye production credentials ko baaki sab se door rakhne ka mechanism hai: \`production\` environment production deploy key rakhta hai, aur sirf ek job \`environment: production\` ke saath ise padh sakta hai.

### Protection rules

Ek environment require kar sakta hai ki conditions meet ho iske pehle ki ise target karne wala ek job chale:
- **Required reviewers** — job **pause** hota hai aur GitHub named log ya teams se approval request karta hai. Ye start nahi hota jab tak unmein se ek UI mein approve na kare.
- **Wait timer** — job ek configured number of minutes ke liye pause hota hai iske pehle ki ise start hone ki allowed ho.
- **Deployment branch aur tag policy** — restrict karo ki kaunse refs is environment mein deploy kar sakte hain: sirf \`main\`, ya sirf \`v*\` matching tags.

Jab ek job ek reviewer ya ek timer par wait kar raha hai, poora workflow run us job par paused hai.

### Deployment record

\`environment:\` wala ek job GitHub mein ek **deployment** ke roop mein registered hai. Ye environment ke page par ek history ke saath appear hota hai, iska status \`in_progress\` se \`success\` ya \`failure\` move karta hai. Ye kya deploy hua kahan aur kab ka audit trail hai, aur ye **Deployments API** ke through queryable hai.

## Build once, wahi artifact promote karo

Environment structure wo jagah hai jahan Lesson 1 se *build once* principle concrete ban jaata hai. Pipeline ke paas ek \`build\` job hai jo application compile karta hai aur ise ek artifact ke roop mein upload karta hai. Phir dono deploy jobs us artifact ko **download** karte hain jo \`build\` ne produce kiya; koi rebuild nahi karta. Staging exact bytes chalाता hai jo production chalाega. Jab ek reviewer \`production\` job approve karta hai, wo ek version approve kar rahe hain jise staging ne already exercise kiya hai.

## Manual promotion

Kभी-kभी aap nahi chahte ki prod deploy ek merge se automatically trigger ho — aap chahte ho ki ek person decide kare *kab* ek specific, already-built version ships. Wo \`workflow_dispatch\` inputs ke saath hai. Ek person GitHub UI mein workflow kholta hai, version aur apna naam bharता hai, aur ise chalाता hai. Environment ke protection rules abhi bhi upar apply hote hain.

## Gate kahan rakhna hai

- **Continuous deployment**: koi manual gate bilkul nahi.
- **Ek approval** — \`production\` environment ek reviewer require karta hai; har prod deploy ek human ke approve click karne ke liye pause hota hai.
- **Manual promotion** — prod merge par bilkul deploy nahi karta; ek person ek \`workflow_dispatch\` chalाता hai jab wo ship karने ka decide karte hain.`,

    examples: [
      {
        title: 'Build once → deploy staging → deploy prod: the same artifact bytes through every environment',
        titleHi: 'Build once → staging → prod: har environment ke through wahi artifact bytes',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
git init -q; git config user.email ci@example.com; git config user.name ci; git config core.autocrlf false
mkdir -p .github/workflows
cat > .github/workflows/release.yml <<'YAML'
name: release
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: |
          mkdir -p dist
          printf 'release build - produced exactly once\\n' > dist/app.tar
          echo "BUILD    digest \$(sha256sum dist/app.tar | cut -c1-12)"
      - uses: actions/upload-artifact@v4
        with: { name: release, path: dist/ }
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: staging, url: 'https://staging.example.com' }
    steps:
      - uses: actions/download-artifact@v4
        with: { name: release, path: dist/ }
      - run: 'echo "STAGING  digest \$(sha256sum dist/app.tar | cut -c1-12)  deployed to \${{ github.job }}"'
  deploy-prod:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: { name: production, url: 'https://app.example.com' }
    steps:
      - uses: actions/download-artifact@v4
        with: { name: release, path: dist/ }
      - run: 'echo "PROD     digest \$(sha256sum dist/app.tar | cut -c1-12)  <- identical, never rebuilt"'
YAML
git add -A >/dev/null; git commit -qm ci >/dev/null

echo "--- actionlint ---"
actionlint -no-color 2>&1 | grep -E '\\.yml:' || echo "actionlint: no problems found"
echo "--- act: same digest at build, staging, and prod ---"
act push -P ubuntu-latest=node:20-bullseye-slim --pull=false --artifact-server-path "\$PWD/_a" 2>&1 \\
  | sed -n 's/^\\[[^]]*\\] *| //p' | grep -E '(BUILD|STAGING|PROD) +digest' \\
  | sed -E 's/digest [0-9a-f]{12}/digest <sha12>/'`,
        output: `--- actionlint ---
actionlint: no problems found
--- act: same digest at build, staging, and prod ---
BUILD    digest <sha12>
STAGING  digest <sha12>  deployed to deploy-staging
PROD     digest <sha12>  <- identical, never rebuilt`,
        explain: 'The workflow has a single build job that produces a release file and uploads it as an artifact, then two deploy jobs chained with needs — staging first, then production — each attached to a named environment. Both deploy jobs download the artifact that build produced and neither one rebuilds anything. The three jobs each print a truncated digest of the file, and all three digests are identical, which is the concrete proof that the bytes running in production are exactly the bytes that were built once and then exercised in staging. The environment attribute on the deploy jobs is what makes them appear as deployments in GitHub and what lets the repository owner attach protection rules to production — required reviewers, a wait timer, a branch restriction — so that the transition from staging to production can carry a human gate. The needs chain guarantees production only proceeds after staging succeeded, and because the artifact is the same, a staging success is meaningful evidence about production rather than an unrelated data point. actionlint confirms the environment blocks and the overall structure are valid.',
        explainHi: 'Workflow ke paas ek single build job hai jo ek release file produce karta hai aur ise ek artifact ke roop mein upload karta hai, phir needs ke saath chained do deploy jobs — pehle staging, phir production — har ek ek named environment se attached. Dono deploy jobs us artifact ko download karte hain jo build ne produce kiya aur koi bhi kuch rebuild nahi karta. Teen jobs har ek file ka ek truncated digest print karte hain, aur teenों digests identical hain, jo concrete proof hai ki production mein chal rahe bytes theek wo bytes hain jo ek baar build kiye gaye aur phir staging mein exercise kiye gaye. Deploy jobs par environment attribute wo hai jo unhe GitHub mein deployments ke roop mein appear karvाता hai aur jo repository owner ko production par protection rules attach karne deta hai.',
      },
      {
        title: 'Manual promotion: a person triggers the prod deploy of a chosen version via workflow_dispatch',
        titleHi: 'Manual promotion: ek person workflow_dispatch ke through ek chosen version ka prod deploy trigger karta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
git init -q; git config user.email ci@example.com; git config user.name ci; git config core.autocrlf false
mkdir -p .github/workflows
cat > .github/workflows/promote.yml <<'YAML'
name: promote-to-prod
on:
  workflow_dispatch:
    inputs:
      version:
        description: "release version / artifact tag to promote"
        required: true
      approver:
        description: "who authorised this promotion"
        required: true
        default: release-manager
jobs:
  promote:
    runs-on: ubuntu-latest
    environment:
      name: production           # the environment's protection rules ALSO apply here
      url: 'https://app.example.com'
    steps:
      - run: |
          echo "promoting version \${{ inputs.version }}"
          echo "authorised by   \${{ inputs.approver }}"
          echo "(environment 'production' rules - reviewers / wait timer - still gate this)"
YAML
git add -A >/dev/null; git commit -qm ci >/dev/null

actionlint -no-color 2>&1 | grep -E '\\.yml:' || echo "actionlint: no problems found"
echo "--- act: run it as a manual dispatch with inputs ---"
act workflow_dispatch -P ubuntu-latest=node:20-bullseye-slim --pull=false \\
  --input version=2025.09.3 --input approver=priya 2>&1 \\
  | sed -n 's/^\\[[^]]*\\] *| //p' | grep -E 'promoting version|authorised by'`,
        output: `actionlint: no problems found
--- act: run it as a manual dispatch with inputs ---
promoting version 2025.09.3
authorised by   priya`,
        explain: 'This workflow does not deploy on push. Its only trigger is workflow_dispatch, which puts a "Run workflow" button in the GitHub UI, and it declares two inputs: the version to promote and the name of the person authorising it, the second with a default. When a release manager decides a particular already-built version should go to production, they open the workflow, fill in the form, and run it; the job echoes back the version and approver it was given. In the real workflow the run step would deploy that specific version. The job also attaches the production environment, so on top of the person deliberately triggering the run, the environment\'s protection rules still apply — if production requires two reviewers, the dispatched run still pauses for their approval. This layering gives a promotion that is both an explicit human decision about timing and subject to the same review gate as any other production deploy. The pattern fits release trains and coordinated launches, where the merge that produced the artifact and the decision to ship it are deliberately separate events. act runs the workflow in its workflow_dispatch mode with the two inputs supplied, and the job reports them.',
        explainHi: 'Ye workflow push par deploy nahi karta. Iska ekmatra trigger workflow_dispatch hai, jo GitHub UI mein ek "Run workflow" button rakhta hai, aur ye do inputs declare karta hai: promote karne ke liye version aur ise authorise karne wale person ka naam. Jab ek release manager decide karta hai ki ek particular already-built version production mein jaana chahiye, wo workflow kholte hain, form bharते hain, aur ise chalाते hain; job wapas version aur approver echo karta hai jo ise diya gaya. Job production environment bhi attach karta hai, to person ke deliberately run trigger karne ke upar, environment ke protection rules abhi bhi apply hote hain. Ye layering ek promotion deता hai jo timing ke baare mein ek explicit human decision aur kisi bhi doosre production deploy jaise same review gate ke subject dono hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# each environment runs its own build -> staging and prod are different binaries
jobs:
  deploy-staging:
    steps:
      - uses: actions/checkout@<sha>
      - run: make release && ./deploy.sh staging        # build #1
  deploy-prod:
    needs: deploy-staging
    steps:
      - uses: actions/checkout@<sha>
      - run: make release && ./deploy.sh production     # build #2 - a DIFFERENT artifact
# staging validated build #1. production runs build #2, produced in a different job at a
# different time, possibly with a different cached layer or tool version. "it passed in
# staging" now guarantees nothing about prod.`,
        right: `# build ONCE, then every environment deploys the SAME artifact:
jobs:
  build:
    steps:
      - uses: actions/checkout@<sha>
      - run: make release
      - uses: actions/upload-artifact@<sha>
        with: { name: release, path: dist/ }
  deploy-staging:
    needs: build
    environment: staging
    steps:
      - uses: actions/download-artifact@<sha>
        with: { name: release }
      - run: ./deploy.sh dist/ staging
  deploy-prod:
    needs: deploy-staging
    environment: production
    steps:
      - uses: actions/download-artifact@<sha>
        with: { name: release }
      - run: ./deploy.sh dist/ production
# staging and prod now run byte-identical artifacts. approving prod = approving what staging tested.`,
        why: 'The purpose of a staging environment is to be a faithful rehearsal for production, so that a successful staging deployment is evidence the same change will work in production. That evidence only holds if production runs the same artifact staging ran. When each environment\'s job performs its own build, the two artifacts are produced by separate job runs, at different times, potentially with different cache state, different transient dependency resolution, or a different runner image, and there is no guarantee they are identical. A defect that the second build introduces, or that only manifests with the exact bytes of the second build, will not have been caught by anything staging did. The fix is to build the release artifact exactly once in a dedicated job, upload it, and have every deployment job download and deploy that same artifact. Then a staging deployment exercises the precise bytes that production will run, a reviewer approving the production job is approving a version that has already been validated, and the digest of what is in production can be checked to match the digest of what was tested.',
        whyHi: 'Ek staging environment ka purpose production ke liye ek faithful rehearsal hona hai, taaki ek successful staging deployment evidence ho ki same change production mein kaam karega. Wo evidence sirf tab hold karta hai agar production wahi artifact chalाता hai jo staging ne chalाya. Jab har environment ka job apna build perform karta hai, do artifacts separate job runs dwara produced hote hain, alag times par, potentially alag cache state ke saath. Fix release artifact ko theek ek baar ek dedicated job mein build karna, ise upload karna, aur har deployment job ko wahi artifact download aur deploy karvाना hai.',
      },
      {
        wrong: `# putting the production deploy secret as a REPO secret
# repo secret: PROD_DEPLOY_KEY
# ...now EVERY workflow can read it, including:
- name: run PR tests
  run: ./test.sh
  env:
    KEY: \${{ secrets.PROD_DEPLOY_KEY }}   # a PR test workflow shouldn't have this AT ALL
# a malicious PR (or a script-injection, or a compromised test dependency) in ANY workflow
# can now reach the production deploy key. the blast radius is the whole repo.`,
        right: `# put it on the 'production' ENVIRONMENT - only environment:production jobs can read it:
# environment 'production' secret: PROD_DEPLOY_KEY
jobs:
  deploy-prod:
    environment: production        # <-- required to access the environment's secrets
    steps:
      - run: ./deploy.sh
        env:
          KEY: \${{ secrets.PROD_DEPLOY_KEY }}   # resolves ONLY because this job targets 'production'
# the PR test workflow has no 'environment: production' -> it literally cannot see the key.
# add required-reviewers on the environment and the key is also gated behind human approval.`,
        why: 'A repository secret is readable by every workflow and every job in the repository. Placing a production deployment credential there means that any workflow — a pull-request test job, a lint job, a scheduled task, a workflow that runs code from forks — can reference it, and any vulnerability in any of those workflows, such as a script injection or a compromised build dependency, has a path to the production credential. The blast radius of a mistake anywhere in the repository\'s automation includes production. An environment secret is scoped: it is only resolvable in a job that declares environment with that environment\'s name. So a production deploy key placed on the production environment is invisible to the pull-request test workflow, the lint workflow, and everything else that does not explicitly target production. Combined with the environment\'s protection rules, the key is not only hidden from unrelated jobs but also gated behind required-reviewer approval before the one job that can use it runs. This is the correct place for any credential whose misuse would be serious.',
        whyHi: 'Ek repository secret repository mein har workflow aur har job dwara readable hai. Wahan ek production deployment credential rakhna matlab koi bhi workflow ise reference kar sakta hai, aur un workflows mein se kisi mein bhi koi vulnerability, jaise ek script injection ya ek compromised build dependency, ke paas production credential tak ek path hai. Ek environment secret scoped hai: ye sirf ek job mein resolvable hai jo us environment ke naam ke saath environment declare karta hai. To production environment par rakhi ek production deploy key pull-request test workflow ke liye invisible hai. Environment ke protection rules ke saath combined, key ko required-reviewer approval ke peeche bhi gated kiya jaata hai.',
      },
      {
        wrong: `# a wait timer / required reviewer on a job that DOWNSTREAM jobs need, with no plan for it
jobs:
  deploy-prod:
    environment: production        # required-reviewers: 2, wait-timer: 30 min
    ...
  run-migrations:
    needs: deploy-prod
    ...
  smoke-tests:
    needs: run-migrations
    ...
# every prod release now stalls the ENTIRE workflow for 30 min + waiting on 2 humans,
# including at 2am during an incident when you need the migration + smoke tests to run NOW.
# and the reviewers get a notification with no context about what they're approving.`,
        right: `# be deliberate about WHERE the gate sits and what it protects:
#   - gate the RISKY, irreversible step (the prod deploy itself), not the whole chain
#   - for incident hotfixes, have a separate fast-lane workflow (still reviewed, shorter timer)
#   - give reviewers CONTEXT: the environment 'url', a deployment description, a link to the diff
#   - a wait timer is for "cancel window", not "make people wait" - keep it short (2-5 min) or
//     use required-reviewers instead (a human decision beats a fixed delay)
#   - never gate automated recovery steps (rollback, smoke tests) behind a human`,
        why: 'Protection rules pause the workflow run at the gated job, and every job downstream of it via needs waits for that gate to clear. If the gate is placed on a job that a chain of operational steps depends on — running database migrations, executing smoke tests, triggering monitoring — then those steps, some of which are exactly what you need to happen quickly during a problem, are all held behind the human approval and the timer. A thirty-minute wait timer and a two-reviewer requirement are reasonable for a routine release but are actively harmful at 2am when a hotfix needs to deploy and its migrations and verification need to run now. The gate should sit specifically on the risky, hard-to-reverse action and not span the whole operational sequence. Incident response needs its own path — a separate workflow with a shorter timer or a single on-call approver — and automated recovery actions such as rollback and smoke tests must never be behind a human gate at all. Reviewers also need enough context in the approval request, via the environment URL and a deployment description, to make a real decision rather than rubber-stamping.',
        whyHi: 'Protection rules workflow run ko gated job par pause karte hain, aur iske needs ke through har downstream job us gate ke clear hone ka wait karta hai. Agar gate ek job par rakha hai jispar operational steps ki ek chain depend karti hai — database migrations chalाना, smoke tests execute karna — to wo steps, jinmें se kuch theek wo hain jo aapko ek problem ke dauraan jaldi chahiye, sab human approval aur timer ke peeche held hain. Ek thirty-minute wait timer ek routine release ke liye reasonable hai par 2am par actively harmful hai. Gate specifically risky, hard-to-reverse action par baithना chahiye. Incident response ko apna path chahiye, aur automated recovery actions kabhi ek human gate ke peeche nahi hone chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**"It worked in staging" meant nothing** — staging and prod each ran `docker build` in their own job. A base-image change landed between the two builds; prod got a different image. Switched to build-once-push-to-registry, deploy the digest everywhere; staging became a real signal again.',
        hi: '**"Staging mein kaam kiya" ka matlab kuch nahi tha** — staging aur prod har ek apne job mein `docker build` chalाते the. Build-once-push-to-registry par switch kiya.',
      },
      {
        en: '**A `PROD_API_KEY` repo secret reached a fork PR** via a `pull_request_target` lint job that referenced it "for consistency". Moved it to the `production` environment; the lint job (no `environment:`) could no longer see it, and required-reviewers now gate it too.',
        hi: '**Ek `PROD_API_KEY` repo secret ek fork PR tak pahuncha** ek `pull_request_target` lint job ke through. Ise `production` environment mein move kiya.',
      },
      {
        en: '**A 3am incident stalled 30 minutes** because the hotfix\'s `run-migrations` and `smoke-tests` jobs were `needs: deploy-prod`, and `production` had a 30-min wait timer. Added an `emergency-deploy` workflow: same review, 2-min timer, migrations not gated.',
        hi: '**Ek 3am incident 30 minute ruka** kyunki hotfix ke `run-migrations` aur `smoke-tests` jobs `needs: deploy-prod` the. Ek `emergency-deploy` workflow add kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What does a GitHub Actions environment give you that a plain job does not?',
        qHi: 'Ek GitHub Actions environment aapko kya deता hai jo ek plain job nahi?',
        a: 'Three things. First, scoped secrets and variables: a secret defined on an environment is only resolvable in a job that declares that environment, so a production deploy key on the production environment is invisible to a pull-request test workflow or a staging job, which is a much tighter boundary than a repository secret that every workflow can read. Second, protection rules that must be satisfied before a job targeting the environment runs: required reviewers, where the job pauses and named people or teams must approve in the UI; a wait timer, where the job pauses for a set number of minutes giving a cancel window; and a deployment branch and tag policy restricting which refs can deploy to the environment. While a job waits on a reviewer or timer the whole run is paused at that job. Third, a deployment record: a job with an environment is registered as a deployment in GitHub, appears on the environment page with a history and a status that moves from in_progress to success or failure, links the url you configured, and shows on the repository and associated pull requests, giving an audit trail queryable through the Deployments API. Together these let a job be a controlled, gated, audited production deployment rather than just a script that runs.',
        aHi: 'Teen cheezein. Pehla, scoped secrets aur variables: ek environment par defined ek secret sirf ek job mein resolvable hai jo us environment ko declare karta hai. Doosra, protection rules jo satisfy hone chahiye iske pehle ki environment ko target karne wala ek job chale: required reviewers, jahan job pause hota hai aur named log ya teams ko UI mein approve karna chahiye; ek wait timer; aur ek deployment branch aur tag policy. Teesra, ek deployment record: ek environment wala ek job GitHub mein ek deployment ke roop mein registered hai, environment page par ek history ke saath appear hota hai, ek status jo in_progress se success ya failure move karta hai. Saath mein ye ek job ko ek controlled, gated, audited production deployment hone dete hain.',
      },
      {
        q: 'How do you structure a pipeline so that what you approve for production is exactly what staging tested?',
        qHi: 'Aap ek pipeline ko kaise structure karte ho taaki jo aap production ke liye approve karte ho theek wo hai jo staging ne test kiya?',
        a: 'Build the release artifact exactly once, in a dedicated build job, and upload it. Then have every deployment job — staging, then production, chained with needs — download that same artifact and deploy it, with no job rebuilding anything. Attach each deploy job to a named environment. Now staging deploys the exact bytes that production will deploy, so a successful staging run is genuine evidence about production rather than an unrelated result. Put the human gate on the production environment as a required-reviewer rule: when the production deploy job is reached, the run pauses and a reviewer approves in the UI, and what they are approving is a version whose digest matches what staging exercised. Optionally verify that explicitly by recording the artifact digest and checking it is identical at each stage. If instead each environment ran its own build, the production artifact would be a separate binary produced in a different job at a different time, and staging success would carry no guarantee. For teams that want the deploy timing to be a deliberate decision rather than automatic on merge, replace or supplement the environment gate with a workflow_dispatch workflow that takes the version as an input, so a person chooses when a specific already-built artifact is promoted, still subject to the environment\'s rules.',
        aHi: 'Release artifact ko theek ek baar build karo, ek dedicated build job mein, aur ise upload karo. Phir har deployment job — staging, phir production, needs ke saath chained — ko wahi artifact download aur deploy karvाओ, koi job kuch rebuild nahi karta. Har deploy job ko ek named environment se attach karo. Ab staging exact bytes deploy karta hai jo production deploy karega. Human gate ko production environment par ek required-reviewer rule ke roop mein rakho: jab production deploy job reach hota hai, run pause hota hai aur ek reviewer UI mein approve karta hai, aur jo wo approve kar rahe hain wo ek version hai jiska digest us se match karta hai jo staging ne exercise kiya. Agar iske bajaay har environment apna build chalाता, production artifact ek separate binary hoता.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, describe the three things an environment provides (scoped secrets, protection rules, the deployment record) with what each protects against.',
        taskHi: 'Ek comment mein, teen cheezein describe karo jo ek environment provide karta hai.',
        hint: 'An ENVIRONMENT is a named deploy target a job attaches to via `environment: <name>` (configured in repo Settings). (1) SCOPED SECRETS/VARIABLES — a secret defined ON an environment is only resolvable in a job that declares that environment → a `production` deploy key is INVISIBLE to a PR-test workflow, a lint job, a staging job. Much tighter than a REPO secret (every workflow can read those → any script-injection / compromised dependency in ANY workflow has a path to it). (2) PROTECTION RULES (must pass before a job targeting the env runs): REQUIRED REVIEWERS — the job PAUSES, named people/teams approve in the UI (the human gate for prod); WAIT TIMER — the job pauses N minutes (a "shout stop" / cancel window — keep it short, 2-5 min); DEPLOYMENT BRANCH/TAG POLICY — only `main` / `v*` tags / a pattern may deploy here (rejects any other ref). While a job waits on a reviewer/timer the WHOLE run is paused at that job → don\'t gate a job that automated recovery steps (`needs: deploy-prod` → migrations, smoke tests, rollback) depend on. (3) DEPLOYMENT RECORD — a job with `environment:` registers as a DEPLOYMENT: shows on the env page with history + a status (`in_progress` → `success`/`failure`), links the `url:`, appears on the repo + associated PRs, queryable via the Deployments API → the audit trail of what shipped where + when + who approved.',
        hintHi: 'Ek ENVIRONMENT ek named deploy target hai jisse ek job `environment: <name>` se attach hota hai. (1) SCOPED SECRETS — ek environment PAR defined ek secret sirf ek job mein resolvable hai jo us environment ko declare karta hai → ek `production` deploy key ek PR-test workflow ke liye INVISIBLE. REPO secret se bahut tighter. (2) PROTECTION RULES: REQUIRED REVIEWERS — job PAUSE hota hai; WAIT TIMER — N minutes pause (chhota rakho); DEPLOYMENT BRANCH POLICY — sirf `main`/`v*`. Jab ek job reviewer/timer par wait karta hai POORA run paused hai → ek job gate mat karo jispar automated recovery steps depend karte hain. (3) DEPLOYMENT RECORD — audit trail.',
      },
      {
        task: 'In a comment, explain "build once, promote the same artifact" through environments and why running a build per environment breaks the value of staging.',
        taskHi: 'Ek comment mein, "build once, wahi artifact promote karo" samjhao.',
        hint: 'A STAGING environment\'s purpose is to be a FAITHFUL REHEARSAL for prod → a successful staging deploy should be EVIDENCE the same change works in prod. That evidence ONLY holds if prod runs the SAME artifact staging ran. STRUCTURE: one `build` job compiles + `actions/upload-artifact` (runs ONCE); then `deploy-staging` (`needs: build`, `environment: staging`) and `deploy-prod` (`needs: deploy-staging`, `environment: production`) each `actions/download-artifact` the SAME artifact and deploy it — NEITHER rebuilds. Verify: the artifact digest is identical at build, staging, and prod. WHY PER-ENVIRONMENT BUILD BREAKS IT: two separate `make release` / `docker build` runs, in different jobs, at different times, with possibly different cache state / transient dependency resolution / a changed base image between them → the two artifacts are NOT guaranteed identical. A defect the second build introduces (or that only manifests with its exact bytes) was never exercised by anything staging did → "it passed in staging" guarantees NOTHING about prod. With build-once: a reviewer approving the `production` job is approving a version whose digest MATCHES what staging validated (Lesson 1: BUILD ONCE, and Module 5/11).',
        hintHi: 'Ek STAGING environment ka purpose prod ke liye ek FAITHFUL REHEARSAL hona hai → ek successful staging deploy EVIDENCE hona chahiye ki same change prod mein kaam karta hai. Wo evidence SIRF tab hold karta hai agar prod WAHI artifact chalाता hai jo staging ne chalाya. STRUCTURE: ek `build` job compile + `actions/upload-artifact` (EK BAAR chalta hai); phir `deploy-staging` aur `deploy-prod` har ek WAHI artifact `download-artifact` karके deploy karta hai — KOI rebuild nahi. WHY PER-ENVIRONMENT BUILD BREAKS IT: do separate build runs, alag jobs mein, alag times par → do artifacts identical guaranteed NAHI. "Staging mein pass hua" prod ke baare mein KUCH guarantee NAHI karta.',
      },
      {
        task: 'In a comment, describe manual promotion via `workflow_dispatch` and the three common places to put the production gate.',
        taskHi: 'Ek comment mein, `workflow_dispatch` ke through manual promotion describe karo.',
        hint: 'MANUAL PROMOTION = the prod deploy does NOT trigger on merge; a person decides WHEN a specific, already-built version ships. `on: workflow_dispatch: { inputs: { version: {required: true}, approver: {required: true} } }` → puts a "Run workflow" button in the GitHub UI; a person opens it, fills the version + their name, runs it. The `promote` job still declares `environment: production` → the environment\'s protection rules (reviewers, wait timer) STILL apply ON TOP of the person triggering it (so a promotion can require a form submission AND a second reviewer). Fits release trains, coordinated launches — where the merge that produced the artifact and the decision to ship it are deliberately SEPARATE events. THREE PLACES FOR THE PROD GATE: (1) NO GATE = continuous deployment (Module 1) — merge → `deploy-prod` runs automatically after staging; relies on tests + canary + automated rollback. (2) ONE APPROVAL — the `production` environment has a required-reviewer rule; every prod deploy pauses for a human to click approve (common + reasonable). (3) MANUAL PROMOTION — prod doesn\'t deploy on merge at all; a person runs a `workflow_dispatch` when they decide to ship. NOT mutually exclusive across services — a mature org runs continuous deployment for low-risk services + a manual gate for payments.',
        hintHi: 'MANUAL PROMOTION = prod deploy merge par trigger NAHI hota; ek person decide karta hai KAB ek specific, already-built version ships. `on: workflow_dispatch: { inputs: {...} }` → GitHub UI mein ek "Run workflow" button. `promote` job abhi bhi `environment: production` declare karta hai → environment ke protection rules ABHI BHI person ke trigger karne ke UPAR apply hote hain. THREE PLACES: (1) NO GATE = continuous deployment; (2) ONE APPROVAL — `production` environment ka ek required-reviewer rule; (3) MANUAL PROMOTION — prod merge par deploy nahi karta. Services ke across mutually exclusive NAHI.',
      },
    ],

    keyTakeaways: [
      'AN ENVIRONMENT (`environment: <name>` on a job, configured in repo Settings) gives 3 things a plain job lacks: (1) SCOPED SECRETS — a secret defined ON the environment is only readable by a job declaring it → a `production` deploy key is invisible to PR-test / lint / staging jobs (a REPO secret is readable by EVERY workflow → any injection/compromised dep anywhere can reach it). (2) PROTECTION RULES. (3) A DEPLOYMENT RECORD — status (`in_progress`→`success`/`failure`), history, `url`, shown on the repo + PRs, queryable via the Deployments API.',
      'PROTECTION RULES (must pass before a job targeting the env runs): REQUIRED REVIEWERS — the job PAUSES, named people/teams approve in the UI (the human gate for prod); WAIT TIMER — the job pauses N minutes (a cancel window — keep it 2-5 min, not "make people wait"); DEPLOYMENT BRANCH/TAG POLICY — only `main` / `v*` / a pattern may deploy here. While a job waits on a reviewer/timer the WHOLE run is paused at it → NEVER gate a job that automated recovery steps (`needs: deploy-prod` → migrations, smoke tests, rollback) depend on; give incident hotfixes a fast-lane workflow.',
      'BUILD ONCE, PROMOTE THE SAME ARTIFACT: one `build` job compiles + uploads (runs ONCE); `deploy-staging` (`needs: build`) and `deploy-prod` (`needs: deploy-staging`) each DOWNLOAD the SAME artifact and deploy — NEITHER rebuilds → staging runs the exact bytes prod will run → a staging success is real evidence about prod, and a reviewer approving `deploy-prod` is approving a digest staging already validated. Per-environment builds = two separate binaries at different times → "it passed in staging" guarantees NOTHING.',
      'MANUAL PROMOTION: `on: workflow_dispatch: { inputs: { version, approver } }` → a "Run workflow" button; a person picks WHEN a specific already-built version ships. The `promote` job still declares `environment: production` → the env\'s protection rules ALSO apply on top (form submission AND a reviewer). Fits release trains / coordinated launches where the merge and the ship decision are deliberately separate events.',
      'WHERE THE PROD GATE GOES (not mutually exclusive across services): (1) NO GATE = continuous deployment — merge → auto-deploy after staging, relying on tests + canary + automated rollback (Module 1); (2) ONE APPROVAL = the `production` environment requires a reviewer, every prod deploy pauses (common, reasonable); (3) MANUAL PROMOTION = prod doesn\'t deploy on merge, a person runs a `workflow_dispatch`. A mature org runs continuous deployment for low-risk services + a manual gate for payments. Environment secrets + required reviewers together mean the prod credential is BOTH hidden from unrelated jobs AND gated behind human approval.',
    ],
    keyTakeawaysHi: [
      'EK ENVIRONMENT (`environment: <name>` ek job par) 3 cheezein deta hai jo ek plain job ke paas nahi: (1) SCOPED SECRETS — ek environment PAR defined ek secret sirf ise declare karne wale job dwara readable → ek `production` deploy key PR-test/lint/staging jobs ke liye invisible (ek REPO secret HAR workflow dwara readable). (2) PROTECTION RULES. (3) EK DEPLOYMENT RECORD — status, history, `url`, Deployments API se queryable.',
      'PROTECTION RULES: REQUIRED REVIEWERS — job PAUSE hota hai, named log/teams UI mein approve karte hain; WAIT TIMER — job N minutes pause (ek cancel window — 2-5 min); DEPLOYMENT BRANCH/TAG POLICY — sirf `main`/`v*`. Jab ek job reviewer/timer par wait karta hai POORA run us par paused hai → KABHI ek job gate mat karo jispar automated recovery steps depend karte hain.',
      'BUILD ONCE, WAHI ARTIFACT PROMOTE KARO: ek `build` job compile + upload (EK BAAR); `deploy-staging` aur `deploy-prod` har ek WAHI artifact DOWNLOAD karके deploy karta hai — KOI rebuild nahi → staging exact bytes chalाता hai jo prod chalाega → ek staging success prod ke baare mein real evidence hai. Per-environment builds = alag times par do separate binaries → "staging mein pass hua" KUCH guarantee NAHI karta.',
      'MANUAL PROMOTION: `on: workflow_dispatch: { inputs: { version, approver } }` → ek "Run workflow" button; ek person chunta hai KAB ek specific already-built version ships. `promote` job abhi bhi `environment: production` declare karta hai → env ke protection rules BHI upar apply hote hain. Release trains ke liye fits.',
      'PROD GATE KAHAN JAATA HAI: (1) NO GATE = continuous deployment; (2) ONE APPROVAL = `production` environment ek reviewer require karta hai; (3) MANUAL PROMOTION = prod merge par deploy nahi karta. Ek mature org low-risk services ke liye continuous deployment + payments ke liye ek manual gate chalाता hai. Environment secrets + required reviewers saath mein matlab prod credential unrelated jobs se hidden AUR human approval ke peeche gated DONO hai.',
    ],
  },

  {
    slug: 'ops-runners-reusable-workflows-and-ci-at-scale',
    title: 'Runners, Reusable Workflows & CI at Scale',
    titleHi: 'Runners, Reusable Workflows & CI at Scale',
    description: 'As an organisation grows past a few repos, three problems appear: where the jobs run (hosted vs self-hosted runners), how to stop copy-pasting the same pipeline into every repo (reusable workflows and composite actions — which are not the same thing), and how to keep a large monorepo\'s CI fast and its flaky tests from eroding trust.',
    descriptionHi: 'Jaise ek organisation kuch repos se aage badhती hai, teen problems appear hoti hain: jobs kahaan chalते hain (hosted vs self-hosted runners), har repo mein same pipeline copy-paste karna kaise band karein (reusable workflows aur composite actions — jo same cheez nahi hain), aur ek bade monorepo ki CI ko fast aur iske flaky tests ko trust erode karne se kaise rokein.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**Running one recipe across a chain of fifty restaurants.** The **runner** is whose kitchen you cook in: the corporate-provided kitchen that is clean, standard, and billed by the minute (**hosted runner**), or your own kitchen on-site that you built and maintain — worth it if you have special equipment (a GPU), a private pantry (VPC-only databases), or you cook so much that the per-minute bill exceeds the cost of owning the kitchen (**self-hosted**). A **reusable workflow** is head office publishing the *entire dinner-service procedure* — "run this whole sequence, here are the parameters" — that each restaurant invokes as one line. A **composite action** is smaller: a pre-bundled *sub-routine* ("the plating sequence: sauce, protein, garnish, wipe rim") that a restaurant drops into the middle of its own procedure. And the **flaky-test policy** is the rule for a dish that fails inspection one time in twenty for no reason: you do not ignore it and you do not let it block every other dish — you move it to a "watch" list, cap how many times you re-cook it, and track the rate.',
      hi: '**Ek recipe ko pachaas restaurants ki ek chain ke across chalाना.** **Runner** wo hai jiski kitchen mein aap cook karte ho: corporate-provided kitchen jo clean, standard, aur per-minute billed hai (**hosted runner**), ya on-site apni kitchen jo aapne banayी aur maintain karte ho — worth it agar aapke paas special equipment (ek GPU), ek private pantry (VPC-only databases), ya aap itna cook karते ho ki per-minute bill kitchen own karne ki cost se zyada hai (**self-hosted**). Ek **reusable workflow** head office ka *poori dinner-service procedure* publish karna hai. Ek **composite action** chhota hai: ek pre-bundled *sub-routine*. Aur **flaky-test policy** ek dish ke liye rule hai jo bina reason ke bees mein ek baar inspection fail karta hai.',
    },

    simple: `**RUNNERS — where a job's steps actually execute (\`runs-on\`):**
\`\`\`
HOSTED (GitHub-provided)      ubuntu-latest / windows-latest / macos-latest
  fresh clean VM per job, wide toolchain preinstalled, billed per-minute (Linux cheapest).
  the default. use unless you have a specific reason not to.
SELF-HOSTED (you run it)      runs-on: [self-hosted, linux, gpu]   (label-matched)
  worth it for: special hardware (GPU), access to a private network / VPC-only resources,
  very high volume where per-minute billing > owning capacity, custom OS/base image.
  cost: YOU patch it, secure it, and — critically — make it EPHEMERAL (one job then destroyed)
  or a malicious PR can poison a persistent runner for the next job. use the ARC (Actions
  Runner Controller) on k8s for autoscaled, ephemeral self-hosted runners.
\`\`\`

**STOP COPY-PASTING PIPELINES — two mechanisms, NOT the same:**
\`\`\`yaml
# REUSABLE WORKFLOW — a whole workflow called as one JOB. own runner(s), own jobs.
# .github/workflows/deploy.yml
on:
  workflow_call:
    inputs:   { environment: { required: true, type: string } }
    secrets:  { token: { required: true } }
    outputs:  { url: { value: \${{ jobs.run.outputs.url }} } }
# caller:
jobs:
  ship:
    uses: my-org/ci/.github/workflows/deploy.yml@<sha>     # or ./.github/workflows/deploy.yml
    with:    { environment: production }
    secrets: { token: \${{ secrets.DEPLOY_TOKEN }} }

# COMPOSITE ACTION — several STEPS bundled, run INSIDE the caller's job (same runner).
# .github/actions/setup/action.yml
runs:
  using: composite
  steps:
    - uses: actions/setup-node@<sha>
      with: { node-version: 20 }
    - shell: bash
      run: npm ci
# caller (a step, not a job):
    - uses: my-org/actions/setup@<sha>
\`\`\`
\`\`\`
REUSABLE WORKFLOW   replaces a whole pipeline. has jobs, needs, its own runners, matrix.
                    call it as 'uses:' at JOB level. inputs / secrets / outputs typed.
COMPOSITE ACTION    replaces a repeated sequence of STEPS. no jobs of its own. runs on the
                    caller's runner, sharing its filesystem. call it as 'uses:' at STEP level.
\`\`\`

**MONOREPO CI:** path filters (\`on: { push: { paths: ['services/api/**'] } }\` or
\`dorny/paths-filter\`) so a change only runs the affected service's pipeline; a dynamic
matrix (\`fromJSON\`) for "one job per changed package"; required status checks per path.

**FLAKY TESTS:** a test that passes/fails non-deterministically. policy: (1) QUARANTINE it
(move to a non-blocking suite) fast — a flake in the blocking suite trains people to re-run
CI blindly; (2) a bounded RETRY budget (retry once or twice, not infinitely); (3) TRACK the
flake rate per test and fix or delete the worst; (4) a flake is a BUG, not noise.

**\`actionlint\` as a required check** on \`.github/**\` — catches the whole class of workflow
mistakes (syntax, injection, bad refs) before they merge.`,

    simpleHi: `**RUNNERS — ek job ke steps actually kahaan execute hote hain (\`runs-on\`):**
\`\`\`
HOSTED (GitHub-provided)      ubuntu-latest / windows-latest / macos-latest
  per job ek fresh clean VM, wide toolchain preinstalled, per-minute billed. default.
SELF-HOSTED (aap chalाते ho)  runs-on: [self-hosted, linux, gpu]   (label-matched)
  worth it: special hardware (GPU), ek private network tak access, bahut high volume, custom OS.
  cost: AAP ise patch karte ho, secure karte ho, aur — critically — ise EPHEMERAL banate ho
  (ek job phir destroyed) ya ek malicious PR ek persistent runner ko poison kar sakta hai.
  ARC (Actions Runner Controller) k8s par use karo autoscaled, ephemeral self-hosted runners ke liye.
\`\`\`

**PIPELINES COPY-PASTE KARNA BAND KARO — do mechanisms, SAME NAHI:**
\`\`\`yaml
# REUSABLE WORKFLOW — ek poora workflow ek JOB ke roop mein called. apne runner(s), apne jobs.
on:
  workflow_call:
    inputs:   { environment: { required: true, type: string } }
    secrets:  { token: { required: true } }
    outputs:  { url: { value: \${{ jobs.run.outputs.url }} } }
# caller:
jobs:
  ship:
    uses: my-org/ci/.github/workflows/deploy.yml@<sha>
    with:    { environment: production }
    secrets: { token: \${{ secrets.DEPLOY_TOKEN }} }

# COMPOSITE ACTION — kई STEPS bundled, caller ke job ke ANDAR run hote hain (same runner).
runs:
  using: composite
  steps:
    - uses: actions/setup-node@<sha>
      with: { node-version: 20 }
    - shell: bash
      run: npm ci
# caller (ek step):
    - uses: my-org/actions/setup@<sha>
\`\`\`
\`\`\`
REUSABLE WORKFLOW   ek poora pipeline replace karta hai. jobs, needs, apne runners, matrix hai.
                    ise JOB level par 'uses:' ke roop mein call karo.
COMPOSITE ACTION    STEPS ka ek repeated sequence replace karta hai. apne jobs nahi. caller ke
                    runner par run hota hai. ise STEP level par 'uses:' ke roop mein call karo.
\`\`\`

**MONOREPO CI:** path filters taaki ek change sirf affected service ki pipeline chalाye; ek
dynamic matrix (\`fromJSON\`) "per changed package ek job" ke liye.

**FLAKY TESTS:** ek test jo non-deterministically pass/fail hota hai. policy: (1) ise jaldi
QUARANTINE karo (ek non-blocking suite mein move); (2) ek bounded RETRY budget; (3) per test
flake rate TRACK karo aur worst ko fix ya delete karo; (4) ek flake ek BUG hai, noise nahi.

**\`actionlint\` ek required check** ke roop mein \`.github/**\` par.`,

    content: `## Runners: hosted versus self-hosted

\`runs-on\` chooses the machine a job runs on.

**Hosted runners** — \`ubuntu-latest\`, \`windows-latest\`, \`macos-latest\` — are provisioned by GitHub: a fresh clean virtual machine per job, with a broad toolchain preinstalled (multiple language versions, Docker, common CLIs), destroyed after the job. You are billed per minute, with Linux the cheapest and macOS the most expensive. This is the default and the right choice unless you have a concrete reason otherwise.

**Self-hosted runners** — machines you register with GitHub and select via labels (\`runs-on: [self-hosted, linux, x64, gpu]\`) — make sense when:

- You need **hardware GitHub does not offer**: a GPU, a lot of RAM, a specific CPU architecture.
- Jobs need **access to a private network** — internal package registries, VPC-only databases, on-prem systems — that a hosted runner cannot reach.
- Your **volume is high enough** that per-minute billing exceeds the cost of owning and running the capacity.
- You need a **custom base image** with your toolchain baked in for speed.

The cost of self-hosted runners is operational: you patch the OS, secure the host, and manage capacity. The critical security requirement is that a self-hosted runner used for **public repositories or fork PRs must be ephemeral** — created for one job and destroyed after — because a persistent runner that just executed untrusted PR code can have been tampered with (a planted binary, a modified PATH) and would carry that into the next job. The standard way to run self-hosted runners at scale is the **Actions Runner Controller (ARC)** on Kubernetes, which autoscales a pool of ephemeral runners.

## Reusable workflows versus composite actions

Once you have more than a handful of repositories, copy-pasting the same CI YAML into each one means every change has to be made everywhere and the copies drift. There are two mechanisms to factor out shared pipeline logic, and they operate at different levels.

### Reusable workflow

A **reusable workflow** is an entire workflow file that another workflow calls **as a job**. It declares \`on: workflow_call\` with typed \`inputs\`, \`secrets\`, and \`outputs\`:

\`\`\`yaml
# my-org/ci-workflows/.github/workflows/node-ci.yml
on:
  workflow_call:
    inputs:
      node-version: { type: string, default: '20' }
    secrets:
      npm-token: { required: false }
    outputs:
      coverage: { value: \${{ jobs.test.outputs.coverage }} }
jobs:
  test:
    runs-on: ubuntu-latest
    outputs: { coverage: \${{ steps.c.outputs.pct }} }
    steps:
      - uses: actions/checkout@<sha>
      - uses: actions/setup-node@<sha>
        with: { node-version: \${{ inputs.node-version }} }
      - run: npm ci && npm test
      - id: c
        run: echo "pct=$(cat coverage/pct.txt)" >> "$GITHUB_OUTPUT"
\`\`\`

A caller uses it at the **job** level:

\`\`\`yaml
jobs:
  ci:
    uses: my-org/ci-workflows/.github/workflows/node-ci.yml@<sha>
    with: { node-version: '22' }
    secrets: { npm-token: \${{ secrets.NPM_TOKEN }} }
\`\`\`

The reusable workflow brings its **own jobs, its own \`needs\` graph, its own runners, its own matrix**. It is the right tool when you want to standardise a whole pipeline — "every Node service runs this exact build-test-scan-publish sequence."

### Composite action

A **composite action** bundles several **steps** into one reusable unit that runs **inside the caller's job**, on the caller's runner, sharing its filesystem. It is defined by an \`action.yml\` with \`runs.using: composite\`:

\`\`\`yaml
# my-org/actions/setup-project/action.yml
name: setup-project
inputs:
  node-version: { default: '20' }
runs:
  using: composite
  steps:
    - uses: actions/setup-node@<sha>
      with: { node-version: \${{ inputs.node-version }} }
    - shell: bash
      run: npm ci
    - shell: bash
      run: npm run codegen
\`\`\`

A caller uses it at the **step** level, inside a job:

\`\`\`yaml
    steps:
      - uses: actions/checkout@<sha>
      - uses: my-org/actions/setup-project@<sha>
        with: { node-version: '22' }
      - run: npm test
\`\`\`

A composite action has **no jobs of its own**; every step in it runs on whatever runner the calling job is using. It is the right tool for a **repeated sequence of steps** — "the five steps every job does to set up the project."

### Choosing

| | reusable workflow | composite action |
|---|---|---|
| replaces | a whole pipeline | a repeated step sequence |
| called at | job level (\`uses:\` as a job) | step level (\`uses:\` as a step) |
| has its own | jobs, needs, runners, matrix | nothing — runs in the caller's job |
| inputs/secrets | typed \`workflow_call\` | action \`inputs\` (secrets via \`env\`) |
| local ref | \`./.github/workflows/x.yml\` | \`./.github/actions/x\` (needs \`checkout\` first) |

Both should be pinned by SHA when referenced across repos (Lesson 4). Both Argo CD and Flux — sorry, both GitHub-native mechanisms — are supported by Dependabot for bumps.

## Monorepo CI

A monorepo with many services and packages should not run every service's full pipeline on every commit. The levers:

- **Path filters** — \`on: { push: { paths: ['services/api/**', 'libs/shared/**'] } }\` so a workflow only triggers when files it cares about changed. Or \`dorny/paths-filter\` inside a job to compute which areas changed and gate later jobs on that.
- **Dynamic matrix** — a setup job diffs the changed paths, emits a JSON list of affected packages, and a downstream job does \`strategy: { matrix: { pkg: \${{ fromJSON(needs.setup.outputs.pkgs) }} } }\` to run one job per changed package (Lesson 3).
- **Per-path required checks** — branch protection can require different status checks depending on which paths a PR touches, so a docs PR is not blocked on the backend test suite.
- **Shared setup** as a composite action so every package's job does not re-specify the toolchain steps.

## Flaky tests

A **flaky test** passes and fails non-deterministically on the same code. Flakes are corrosive: a flake in the blocking suite teaches developers that a red pipeline might not be their fault, so they re-run CI reflexively, and eventually a real failure gets re-run away too. A policy:

1. **Quarantine fast.** The moment a test is identified as flaky, move it out of the blocking suite into a separate non-blocking job. This stops it from eroding trust in the pipeline while it is being fixed. Do not leave a known flake gating merges.
2. **Bounded retries.** Automatic retry of a failed test once or twice can paper over genuine flakiness, but only with a hard cap — retrying until green hides real failures. Retry is a stopgap, not a fix.
3. **Track the rate.** Record pass/fail per test over time; a dashboard of the flakiest tests directs effort. A test flaking above a threshold gets fixed or deleted.
4. **Treat a flake as a bug.** A non-deterministic test usually indicates a real race, an order dependency, a time or timezone assumption, or a shared-state leak — often the same class of bug that will eventually bite in production.

## actionlint as a required check

A workflow to lint the workflows themselves — \`actionlint\` over \`.github/**\` — set as a required status check on pull requests, catches the entire class of workflow mistakes covered in this module: YAML and schema errors, invalid or unpinned action references, expression and context type errors, and script injection via untrusted context values. It runs in seconds and turns "someone will notice in review" into "it cannot merge."`,

    contentHi: `## Runners: hosted versus self-hosted

\`runs-on\` wo machine chunta hai jispar ek job chalti hai.

**Hosted runners** — \`ubuntu-latest\`, \`windows-latest\`, \`macos-latest\` — GitHub dwara provisioned hain: per job ek fresh clean virtual machine, ek broad toolchain preinstalled ke saath, job ke baad destroyed. Aapko per minute billed kiya jaata hai. Ye default aur sahi choice hai jab tak aapke paas ek concrete reason na ho.

**Self-hosted runners** — machines jo aap GitHub ke saath register karte ho aur labels ke through select karte ho — tab sense banate hain jab:
- Aapko **hardware chahiye jo GitHub offer nahi karta**: ek GPU, bahut RAM.
- Jobs ko ek **private network tak access** chahiye jo ek hosted runner reach nahi kar sakta.
- Aapka **volume itna high hai** ki per-minute billing capacity own karne ki cost se zyada hai.

Self-hosted runners ki cost operational hai: aap OS patch karte ho, host secure karte ho. Critical security requirement ye hai ki **public repositories ya fork PRs ke liye use kiya gaya ek self-hosted runner EPHEMERAL hona chahiye** — ek job ke liye created aur baad mein destroyed — kyunki ek persistent runner jo abhi untrusted PR code execute kiya tamper kiya gaya ho sakta hai. Scale par self-hosted runners chalाne ka standard tarika **Actions Runner Controller (ARC)** Kubernetes par hai.

## Reusable workflows versus composite actions

Ek baar aapke paas ek handful se zyada repositories hain, same CI YAML ko har ek mein copy-paste karna matlab har change everywhere karna chahiye. Do mechanisms hain shared pipeline logic factor out karne ke liye, aur wo alag levels par operate karte hain.

### Reusable workflow

Ek **reusable workflow** ek entire workflow file hai jise ek doosra workflow **ek job ke roop mein** call karta hai. Ye \`on: workflow_call\` declare karta hai typed \`inputs\`, \`secrets\`, aur \`outputs\` ke saath. Ek caller ise **job** level par use karta hai. Reusable workflow apne **jobs, apna \`needs\` graph, apne runners, apni matrix** laता hai. Ye sahi tool hai jab aap ek poora pipeline standardise karna chahte ho.

### Composite action

Ek **composite action** kई **steps** ko ek reusable unit mein bundle karta hai jo **caller ke job ke andar** run hota hai, caller ke runner par, iska filesystem sharing. Ye ek \`action.yml\` se defined hai \`runs.using: composite\` ke saath. Ek caller ise **step** level par use karta hai. Ek composite action ke **apne jobs nahi** hain. Ye ek **repeated sequence of steps** ke liye sahi tool hai.

### Choosing

| | reusable workflow | composite action |
|---|---|---|
| replaces | ek poora pipeline | ek repeated step sequence |
| called at | job level | step level |
| apne | jobs, needs, runners, matrix | kuch nahi |
| local ref | \`./.github/workflows/x.yml\` | \`./.github/actions/x\` (pehle \`checkout\` chahiye) |

## Monorepo CI

Kई services aur packages wale ek monorepo ko har commit par har service ka full pipeline nahi chalाना chahiye. Levers: path filters, dynamic matrix (\`fromJSON\`), per-path required checks, shared setup as a composite action.

## Flaky tests

Ek **flaky test** same code par non-deterministically pass aur fail hota hai. Flakes corrosive hain: blocking suite mein ek flake developers ko sikhाता hai ki ek red pipeline unki fault nahi ho sakti. Policy: (1) **Jaldi quarantine karo** — ek non-blocking job mein move; (2) **Bounded retries** — ek hard cap ke saath; (3) **Rate track karo**; (4) **Ek flake ko ek bug treat karo** — usually ek real race, ek order dependency, ek time assumption indicate karta hai.

## actionlint ek required check ke roop mein

\`actionlint\` \`.github/**\` par, pull requests par ek required status check ke roop mein set, is module mein cover kiye workflow mistakes ki poori class catch karta hai: YAML aur schema errors, invalid ya unpinned action references, expression errors, aur script injection. Ye seconds mein chalta hai.`,

    examples: [
      {
        title: 'A reusable workflow: called as a job, with typed inputs and an output passed back',
        titleHi: 'Ek reusable workflow: ek job ke roop mein called, typed inputs aur ek output wapas passed ke saath',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
git init -q; git config user.email ci@example.com; git config user.name ci; git config core.autocrlf false
mkdir -p .github/workflows

cat > .github/workflows/deploy-lib.yml <<'YAML'
name: deploy-lib                    # the REUSABLE workflow
on:
  workflow_call:
    inputs:
      target: { required: true, type: string }
    outputs:
      url: { description: deployed url, value: "\${{ jobs.run.outputs.url }}" }
jobs:
  run:
    runs-on: ubuntu-latest
    outputs:
      url: \${{ steps.d.outputs.url }}
    steps:
      - id: d
        shell: bash
        run: |
          echo "reusable workflow deploying to \${{ inputs.target }}"
          echo "url=https://\${{ inputs.target }}.example.com" >> "\$GITHUB_OUTPUT"
YAML

cat > .github/workflows/app.yml <<'YAML'
name: app                           # the CALLER
on: [push]
jobs:
  deploy:
    uses: ./.github/workflows/deploy-lib.yml     # call it as a JOB (across repos: @<sha>)
    with: { target: staging }
  announce:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - run: 'echo "caller received output: \${{ needs.deploy.outputs.url }}"'
YAML
git add -A >/dev/null; git commit -qm ci >/dev/null

actionlint -no-color 2>&1 | grep -E '\\.yml:' || echo "actionlint: no problems found"
act push -P ubuntu-latest=node:20-bullseye-slim --pull=false 2>&1 \\
  | sed -n 's/^\\[[^]]*\\] *| //p' | grep -E 'reusable workflow deploying to|caller received output'`,
        output: `actionlint: no problems found
reusable workflow deploying to staging
caller received output: https://staging.example.com`,
        explain: 'Two workflow files are involved. The first, deploy-lib.yml, is a reusable workflow: its only trigger is workflow_call, it declares a typed input named target and a typed output named url, and it contains a full job that does the deployment and writes the resulting URL to its output. The second, app.yml, is the caller: its deploy job has no steps of its own — instead it has a uses that points at the reusable workflow file and a with block supplying the target input. When the caller runs, the reusable workflow executes as that job, on its own runner, and the log shows it deploying to the target it was given. The announce job then needs deploy and reads the reusable workflow\'s declared output through the needs context, and the log shows it received the URL the reusable workflow produced. Across repositories the uses reference would be my-org/repo/.github/workflows/deploy-lib.yml pinned to a SHA, and this same pattern lets an organisation define one canonical build-test-deploy pipeline and have every service repo invoke it in a few lines, so improving the pipeline is one change in one place.',
        explainHi: 'Do workflow files involved hain. Pehli, deploy-lib.yml, ek reusable workflow hai: iska ekmatra trigger workflow_call hai, ye ek typed input target aur ek typed output url declare karta hai, aur ismein ek full job hai jo deployment karta hai aur resulting URL ko iske output mein likhता hai. Doosri, app.yml, caller hai: iske deploy job ke apne koi steps nahi hain — iske bajaay ismein ek uses hai jo reusable workflow file par point karta hai. Jab caller chalता hai, reusable workflow us job ke roop mein execute hota hai, apne runner par. announce job phir deploy ke needs karta hai aur reusable workflow ke declared output ko needs context ke through padhta hai. Repositories ke across uses reference ek SHA par pinned hoगा.',
      },
      {
        title: 'A composite action: several steps bundled, running inside the caller\'s job',
        titleHi: 'Ek composite action: kई steps bundled, caller ke job ke andar running',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
git init -q; git config user.email ci@example.com; git config user.name ci; git config core.autocrlf false
mkdir -p .github/workflows .github/actions/setup

cat > .github/actions/setup/action.yml <<'YAML'
name: setup-project                 # a COMPOSITE action - a bundle of STEPS
description: the steps every job repeats to prepare the project
inputs:
  profile: { required: true }
runs:
  using: composite
  steps:
    - shell: bash
      run: 'echo "composite step 1 - configure toolchain for profile=\${{ inputs.profile }}"'
    - shell: bash
      run: 'echo "composite step 2 - install deps, on the calling job runner, same filesystem"'
YAML

cat > .github/workflows/ci.yml <<'YAML'
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4                 # local composite actions need the repo checked out
      - uses: ./.github/actions/setup             # call it as a STEP
        with: { profile: ci }
      - run: 'echo "job continues with the project prepared"'
YAML
git add -A >/dev/null; git commit -qm ci >/dev/null

actionlint -no-color 2>&1 | grep -E '\\.yml:|metadata' || echo "actionlint: no problems found"
act push -P ubuntu-latest=node:20-bullseye-slim --pull=false 2>&1 \\
  | sed -n 's/^\\[[^]]*\\] *| //p' | grep -E 'composite step [12] |job continues with'`,
        output: `actionlint: no problems found
composite step 1 - configure toolchain for profile=ci
composite step 2 - install deps, on the calling job runner, same filesystem
job continues with the project prepared`,
        explain: 'The composite action is defined in an action.yml under .github/actions/setup, with runs.using set to composite and a list of steps. It takes one input and its steps just echo what they would do. The CI workflow has a single build job that first checks out the repository — required because a local composite action referenced by path has to be present on disk — then uses the composite action as one step, passing the input, and then continues with its own steps. The output shows all of the composite action\'s steps executing, each prefixed with the same job name as the surrounding steps, because a composite action does not create a job or a runner of its own: every step inside it runs on the calling job\'s runner and shares that job\'s filesystem, so a dependency the composite installs is available to the steps after it in the same job. This is the difference from a reusable workflow, which runs as its own job on its own runner. A composite action is the right factoring for a sequence of steps repeated across many jobs, such as the standard toolchain-and-dependency setup, where you want the effect to land in the caller\'s workspace.',
        explainHi: 'Composite action ek action.yml mein defined hai .github/actions/setup ke neeche, runs.using composite set ke saath aur steps ki ek list. Ye ek input leta hai. CI workflow ke paas ek single build job hai jo pehle repository checkout karta hai — required kyunki path se referenced ek local composite action disk par present hona chahiye — phir composite action ko ek step ke roop mein use karta hai, input pass karता hai, aur phir apne steps ke saath continue karता hai. Output composite action ke saare steps executing dikhाता hai, har ek surrounding steps jaise same job name se prefixed, kyunki ek composite action apna job ya runner nahi banaता: iske andar har step calling job ke runner par run hota hai aur us job ka filesystem share karta hai. Ye ek reusable workflow se farak hai, jo apne job ke roop mein apne runner par chalता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a persistent self-hosted runner serving a PUBLIC repo (or fork PRs)
# runs-on: [self-hosted]     # the same long-lived VM, reused for every job
# a fork PR runs 'npm ci' (arbitrary postinstall) on it, plants a binary in ~/.local/bin
# or edits ~/.bashrc / the PATH. the NEXT job on that runner - maybe a trusted deploy from
# main - picks up the tampered environment. persistent + untrusted code = compromised.`,
        right: `# self-hosted runners for public / fork traffic MUST be ephemeral:
#   - one job, then the runner is destroyed and a clean one registered (no reuse)
#   - Actions Runner Controller (ARC) on k8s: each runner is a fresh pod, autoscaled
#   - or GitHub's "ephemeral" runner mode (--ephemeral) with an autoscaler
# also:  - never give fork PRs a self-hosted runner if you can avoid it
#        - isolate the runner's network; give it a minimal IAM role
#        - for PRIVATE repos with only trusted contributors, persistent is lower-risk
#          but ephemeral is still the better default.`,
        why: 'A self-hosted runner is a machine you own that persists between jobs unless you deliberately make it otherwise. When such a runner executes a job triggered by a pull request from a fork, it runs code that an untrusted contributor wrote — including package install scripts that run automatically. That code can modify the runner: drop an executable somewhere on the PATH, alter shell startup files, change environment defaults, install a background process. If the runner is then reused for a subsequent job, that job inherits the tampered state, and if the subsequent job is a trusted one — a deployment from the main branch with real credentials — the attacker\'s planted code runs in that trusted context. The defence is that any self-hosted runner exposed to untrusted code must be ephemeral: it exists for exactly one job and is destroyed afterward, with a fresh runner registered for the next job, so there is no state to carry a compromise forward. The Actions Runner Controller on Kubernetes implements this by making each runner a short-lived pod. For private repositories where every contributor is trusted the risk is lower, but ephemeral runners remain the safer default, and fork pull requests should not be given a self-hosted runner at all where it can be avoided.',
        whyHi: 'Ek self-hosted runner ek machine hai jo aap own karte ho jo jobs ke beech persist karti hai jab tak aap deliberately ise nahi banate. Jab aisा ek runner ek fork se ek pull request dwara triggered ek job execute karta hai, ye code chalाता hai jo ek untrusted contributor ne likha — package install scripts sameth jo automatically chalते hain. Wo code runner ko modify kar sakta hai: PATH par kahin ek executable drop karna, shell startup files alter karna. Agar runner phir ek subsequent job ke liye reused hota hai, wo job tampered state inherit karता hai, aur agar subsequent job ek trusted hai — main branch se ek deployment real credentials ke saath — attacker ka planted code us trusted context mein chalता hai. Defence ye hai ki untrusted code ke exposed koi bhi self-hosted runner ephemeral hona chahiye.',
      },
      {
        wrong: `# using a composite action where you needed a reusable workflow (or vice versa)
# want: "every repo runs the same build -> test -> scan -> publish PIPELINE"
# .github/actions/full-ci/action.yml  (a composite action)
runs:
  using: composite
  steps:
    - run: npm ci
    - run: npm test
    - run: trivy fs .
    - run: npm publish
# problems: it all runs in ONE job on ONE runner (no parallel test/scan), you can't use
# a matrix, and it can't have its own 'needs' graph. a composite action is not a pipeline.`,
        right: `# a whole PIPELINE -> reusable workflow (job-level 'uses:'), which HAS jobs/needs/matrix:
# my-org/ci/.github/workflows/full-ci.yml
on: { workflow_call: { inputs: {...}, secrets: {...} } }
jobs:
  test:  { runs-on: ubuntu-latest, strategy: { matrix: { shard: [1,2,3] } }, steps: [...] }
  scan:  { runs-on: ubuntu-latest, steps: [...] }               # parallel with test
  publish: { needs: [test, scan], runs-on: ubuntu-latest, steps: [...] }
# caller:  jobs: { ci: { uses: my-org/ci/.github/workflows/full-ci.yml@<sha>, with: {...} } }

# a repeated STEP SEQUENCE (toolchain setup) -> composite action (step-level 'uses:'):
# my-org/actions/setup/action.yml  ->  used as one step inside each job that needs it.`,
        why: 'The two mechanisms operate at different structural levels and are not interchangeable. A composite action bundles a sequence of steps that run inside a single job on a single runner; it has no ability to define multiple jobs, a needs dependency graph, a matrix, or per-job runner selection. Trying to express a whole pipeline as a composite action collapses everything into one serial job — the tests cannot be sharded across parallel runners, the scan cannot run concurrently with the tests, and there is no structure to gate publish behind both. A reusable workflow is an entire workflow invoked as a job by the caller, and it carries its own jobs, its own needs graph, its own matrices, and its own runner choices, so it can express a real multi-stage pipeline with parallelism. The correct division is that a reusable workflow standardises a whole pipeline across repositories, invoked with a job-level uses, while a composite action standardises a repeated sequence of steps within a job, invoked with a step-level uses. Choosing the wrong one either loses the pipeline structure or wraps a simple step sequence in unnecessary job overhead.',
        whyHi: 'Do mechanisms alag structural levels par operate karte hain aur interchangeable nahi hain. Ek composite action steps ka ek sequence bundle karta hai jo ek single job ke andar ek single runner par run hote hain; iske paas multiple jobs, ek needs dependency graph, ek matrix define karne ki koi ability nahi hai. Ek poora pipeline ek composite action ke roop mein express karne ki koshish sab kuch ek serial job mein collapse karti hai — tests parallel runners ke across shard nahi ho sakte. Ek reusable workflow ek entire workflow hai jo caller dwara ek job ke roop mein invoked hai, aur ye apne jobs, apna needs graph, apni matrices carry karता hai. Correct division ye hai ki ek reusable workflow ek poora pipeline standardise karta hai, jabki ek composite action ek job ke andar steps ka ek repeated sequence standardise karता hai.',
      },
      {
        wrong: `# leaving a known-flaky test in the BLOCKING suite "until we get to it"
# test_checkout_flow  fails ~1 run in 8, always passes on re-run.
# team behaviour after 2 weeks: everyone hits "Re-run failed jobs" on ANY red pipeline
# without looking. then a REAL regression in test_payment_capture goes red, gets re-run
# (still red), re-run again (a transient infra blip makes it pass), and merges. incident.`,
        right: `# a flaky-test policy, applied the moment a flake is identified:
#   1. QUARANTINE now: move it to a non-blocking 'flaky' job (still runs, doesn't gate merge)
#   2. open a ticket; the test's owner has N days to fix or delete it
#   3. bounded auto-retry (1-2x) ONLY as a stopgap, with the retry count logged
#   4. track flake rate per test (a dashboard); anything above the threshold is fix-or-delete
#   5. root-cause it: flakes are almost always a real race / order-dep / time / shared-state bug
# never let a known flake train the team to re-run CI blindly.`,
        why: 'A flaky test in the suite that gates merges produces red pipelines that are not the developer\'s fault, and after enough of those, the rational response is to re-run the pipeline without investigating, because it is probably just the flake again. This habit is the danger: once re-running a red pipeline is reflexive, a genuine regression that turns the pipeline red is also re-run without investigation, and if a subsequent run happens to pass — a transient infrastructure issue, a timing coincidence — the regression merges. The flaky test has trained the team to ignore exactly the signal CI exists to provide. The policy that prevents this is to remove a known flake from the blocking suite immediately, into a separate job that still runs and reports but does not gate merges, so the pipeline\'s red-means-broken signal is restored while the flake is fixed on a deadline. Bounded automatic retries can be a short-term mitigation but only with a hard cap and visibility, never retry-until-green. And because a non-deterministic test almost always reflects a real defect — a race condition, an order dependency, a time or timezone assumption, leaked shared state — fixing the flake usually fixes a bug that would otherwise surface in production.',
        whyHi: 'Merges ko gate karne wale suite mein ek flaky test red pipelines produce karta hai jo developer ki fault nahi hain, aur enough un ke baad, rational response bina investigate kiye pipeline re-run karna hai. Ye habit danger hai: ek baar ek red pipeline re-run karna reflexive hai, ek genuine regression jo pipeline ko red karता hai bhi bina investigation ke re-run hota hai, aur agar ek subsequent run pass hota hai, regression merge hota hai. Flaky test ne team ko theek wo signal ignore karne ke liye train kiya jo CI provide karne ke liye exist karta hai. Policy jo ise prevent karti hai ek known flake ko blocking suite se turant remove karна hai, ek separate job mein jo abhi bhi chalता hai par merges ko gate nahi karता.',
      },
    ],

    realWorld: [
      {
        en: '**A planted binary from a fork PR ran in a trusted deploy** — a persistent self-hosted runner executed a fork PR\'s `npm ci`, whose `postinstall` dropped a script on the PATH; the next job (a `main` deploy with prod creds) invoked it. Moved to ARC ephemeral pod runners; each job now gets a fresh pod.',
        hi: '**Ek fork PR se ek planted binary ek trusted deploy mein chalा** — ek persistent self-hosted runner ne ek fork PR ka `npm ci` execute kiya. ARC ephemeral pod runners par move kiya.',
      },
      {
        en: '**40 repos, one pipeline change = 40 PRs** — the CI YAML was copy-pasted everywhere. Extracted a reusable workflow in a central repo; the 40 repos now have a 5-line caller and a pipeline improvement is one PR. Composite actions factored the shared setup steps.',
        hi: '**40 repos, ek pipeline change = 40 PRs** — CI YAML everywhere copy-pasted tha. Ek central repo mein ek reusable workflow extract kiya.',
      },
      {
        en: '**A real regression merged past a re-run** — a known flake had trained everyone to click "Re-run failed jobs". A payment bug went red, was re-run twice, passed on an infra blip, and shipped. Post-incident: a strict quarantine policy, a flake dashboard, and no known flake allowed in the required suite.',
        hi: '**Ek real regression ek re-run ke paar merge hua** — ek known flake ne sabko "Re-run failed jobs" click karne ke liye train kiya tha. Ek strict quarantine policy.',
      },
    ],

    interviewQA: [
      {
        q: 'When would you use a self-hosted runner, and what is the critical security requirement?',
        qHi: 'Aap ek self-hosted runner kab use karoge, aur critical security requirement kya hai?',
        a: 'Hosted runners are the default — a fresh clean VM per job, broad toolchain, billed per minute. You move to self-hosted runners for specific reasons: you need hardware GitHub does not offer such as a GPU or a particular architecture; your jobs need to reach a private network like an internal registry or a VPC-only database that a hosted runner cannot; your volume is high enough that per-minute billing exceeds the cost of running your own capacity; or you want a custom base image with your toolchain baked in for speed. The cost is that you own the operational burden — patching, securing, capacity. The critical security requirement is that a self-hosted runner exposed to untrusted code, meaning public repositories or pull requests from forks, must be ephemeral: created for exactly one job and destroyed afterward, with a clean runner registered for the next job. This is because a persistent runner that just executed untrusted PR code — including automatic package install scripts — may have been tampered with, a planted binary on the PATH or a modified shell profile, and the next job on that runner would inherit the compromise. If that next job is a trusted deployment with real credentials, the attacker\'s code runs in that context. The standard way to run ephemeral self-hosted runners at scale is the Actions Runner Controller on Kubernetes, where each runner is a short-lived pod.',
        aHi: 'Hosted runners default hain — per job ek fresh clean VM, broad toolchain, per minute billed. Aap self-hosted runners par specific reasons ke liye move karte ho: aapko hardware chahiye jo GitHub offer nahi karता jaise ek GPU; aapke jobs ko ek private network reach karna hai; aapka volume itna high hai ki per-minute billing apni capacity chalाne ki cost se zyada hai. Critical security requirement ye hai ki untrusted code ke exposed ek self-hosted runner, matlab public repositories ya forks se pull requests, ephemeral hona chahiye: theek ek job ke liye created aur baad mein destroyed. Ye isliye kyunki ek persistent runner jo abhi untrusted PR code execute kiya tamper kiya gaya ho sakta hai, aur us runner par agla job compromise inherit karता. Standard tarika Actions Runner Controller Kubernetes par hai.',
      },
      {
        q: 'What is the difference between a reusable workflow and a composite action?',
        qHi: 'Ek reusable workflow aur ek composite action mein kya farak hai?',
        a: 'They factor out shared pipeline logic at different structural levels. A reusable workflow is an entire workflow file, declaring on workflow_call with typed inputs, secrets, and outputs, that another workflow invokes as a job with a job-level uses. It brings its own jobs, its own needs dependency graph, its own runner selection, and its own matrices, so it can express a complete multi-stage pipeline with parallelism — the right tool when you want every repository to run the same build, test, scan, publish sequence and to improve that sequence in one place. A composite action is smaller: an action.yml with runs.using set to composite and a list of steps, invoked with a step-level uses inside a job. It has no jobs of its own; every step in it runs on the calling job\'s runner and shares that job\'s filesystem, so its effects land in the caller\'s workspace. It is the right tool for a repeated sequence of steps within a job, such as the standard toolchain and dependency setup that many jobs perform. Choosing wrongly matters: expressing a whole pipeline as a composite action collapses it into one serial job with no parallelism or matrix, and wrapping a simple step sequence as a reusable workflow adds unnecessary job overhead. Across repositories both should be pinned by commit SHA.',
        aHi: 'Wo shared pipeline logic ko alag structural levels par factor out karte hain. Ek reusable workflow ek entire workflow file hai, on workflow_call declare karता hai typed inputs, secrets, aur outputs ke saath, jise ek doosra workflow ek job ke roop mein ek job-level uses se invoke karता hai. Ye apne jobs, apna needs graph, apni runner selection, aur apni matrices laता hai, to ye ek complete multi-stage pipeline express kar sakta hai. Ek composite action chhota hai: ek action.yml runs.using composite ke saath aur steps ki ek list, ek step-level uses se ek job ke andar invoked. Iske apne jobs nahi hain; ismें har step calling job ke runner par run hota hai. Ye ek job ke andar steps ke ek repeated sequence ke liye sahi tool hai. Galat choose karna matter karता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain hosted vs self-hosted runners — when self-hosted is worth it, its cost, and the ephemeral requirement.',
        taskHi: 'Ek comment mein, hosted vs self-hosted runners samjhao.',
        hint: 'HOSTED (`runs-on: ubuntu-latest`/`windows-latest`/`macos-latest`) — GitHub provisions a FRESH CLEAN VM per job, broad toolchain preinstalled, destroyed after; billed PER MINUTE (Linux cheapest, macOS priciest). The DEFAULT — use unless a concrete reason not to. SELF-HOSTED (`runs-on: [self-hosted, linux, gpu]` — label-matched, you register the machine) is worth it for: (1) HARDWARE GitHub doesn\'t offer — a GPU, lots of RAM, a specific arch; (2) access to a PRIVATE NETWORK a hosted runner can\'t reach — internal registries, VPC-only DBs, on-prem; (3) VOLUME high enough that per-minute billing > the cost of owning the capacity; (4) a CUSTOM BASE IMAGE with your toolchain baked in for speed. COST: you patch the OS, secure the host, manage capacity. THE EPHEMERAL REQUIREMENT: a self-hosted runner exposed to UNTRUSTED code (public repos / fork PRs) MUST be ephemeral — created for ONE job, destroyed after, a clean one registered next. Why: a persistent runner that just ran a fork PR\'s `npm ci` (arbitrary `postinstall`) may be TAMPERED — a planted binary on the PATH, an edited `~/.bashrc` — and the NEXT job (maybe a trusted `main` deploy with prod creds) inherits it. Standard: Actions Runner Controller (ARC) on k8s — each runner a short-lived pod, autoscaled. Private repos with only trusted contributors are lower-risk but ephemeral is still the better default; avoid giving fork PRs a self-hosted runner at all.',
        hintHi: 'HOSTED (`runs-on: ubuntu-latest`/...) — GitHub per job ek FRESH CLEAN VM provision karta hai, PER MINUTE billed. DEFAULT. SELF-HOSTED (`runs-on: [self-hosted, ...]` — label-matched) worth it: (1) HARDWARE jo GitHub offer nahi karता — ek GPU; (2) ek PRIVATE NETWORK tak access; (3) VOLUME itna high ki per-minute billing > capacity own karne ki cost; (4) ek CUSTOM BASE IMAGE. COST: aap OS patch karte ho, host secure karte ho. EPHEMERAL REQUIREMENT: UNTRUSTED code ke exposed ek self-hosted runner (public repos / fork PRs) ephemeral HONA CHAHIYE — ek job ke liye created, baad mein destroyed. Kyun: ek persistent runner jo abhi ek fork PR ka `npm ci` chalाya TAMPERED ho sakta hai, aur AGLA job (maybe ek trusted `main` deploy) ise inherit karता hai. Standard: ARC on k8s.',
      },
      {
        task: 'In a comment, build the full comparison table for reusable workflow vs composite action (what it replaces, call level, what it owns, local ref) and the mistake of using the wrong one.',
        taskHi: 'Ek comment mein, reusable workflow vs composite action ki poori comparison table banao.',
        hint: 'REUSABLE WORKFLOW: replaces A WHOLE PIPELINE. Declared `on: workflow_call` with TYPED `inputs` / `secrets` / `outputs`. Called at the JOB level (`jobs.<id>.uses: ...`). OWNS its own jobs, `needs` graph, RUNNERS, matrices → can express a real multi-stage pipeline with parallelism. Local ref: `./.github/workflows/x.yml`; cross-repo: `my-org/repo/.github/workflows/x.yml@<sha>`. Pass data: `with:` for inputs, `secrets:` block, read back via `needs.<job>.outputs.<x>`. COMPOSITE ACTION: replaces A REPEATED STEP SEQUENCE. Defined by an `action.yml` with `runs.using: composite` + a `steps:` list. Called at the STEP level (`steps: - uses: ...`). OWNS NOTHING — every step runs on the CALLER\'S runner, sharing its filesystem → effects land in the caller\'s workspace (e.g. installed deps are there for later steps in that job). Local ref: `./.github/actions/x` — needs `actions/checkout` FIRST (a path-referenced local action must be on disk). Inputs via `inputs:`; secrets passed via `env:`. THE MISTAKE: a whole pipeline as a COMPOSITE ACTION → collapses into ONE serial job on ONE runner — no sharded/parallel tests, no matrix, no `needs` gating → not a pipeline. A simple setup sequence as a REUSABLE WORKFLOW → unnecessary job/runner overhead and it can\'t leave its effect in the caller\'s workspace. RULE: pipeline → reusable workflow (job-level); repeated steps → composite action (step-level). Both pinned by SHA across repos; both bumpable by Dependabot.',
        hintHi: 'REUSABLE WORKFLOW: EK POORA PIPELINE replace karta hai. `on: workflow_call` TYPED `inputs`/`secrets`/`outputs` ke saath. JOB level par called. Apne jobs, `needs` graph, RUNNERS, matrices OWN karta hai. Local ref: `./.github/workflows/x.yml`. COMPOSITE ACTION: EK REPEATED STEP SEQUENCE replace karta hai. `action.yml` `runs.using: composite` ke saath. STEP level par called. KUCH NAHI OWN karता — har step CALLER ke runner par run hota hai. Local ref: `./.github/actions/x` — PEHLE `actions/checkout` chahiye. THE MISTAKE: ek poora pipeline ek COMPOSITE ACTION ke roop mein → EK serial job mein collapse → not a pipeline. RULE: pipeline → reusable workflow; repeated steps → composite action.',
      },
      {
        task: 'In a comment, describe the monorepo-CI levers and a flaky-test policy (quarantine, bounded retries, track the rate, treat as a bug).',
        taskHi: 'Ek comment mein, monorepo-CI levers aur ek flaky-test policy describe karo.',
        hint: 'MONOREPO CI — don\'t run every service\'s full pipeline on every commit: (1) PATH FILTERS — `on: { push: { paths: [\'services/api/**\'] } }` so a workflow only triggers on files it cares about; or `dorny/paths-filter` inside a job to compute which areas changed and gate later jobs; (2) DYNAMIC MATRIX — a setup job diffs the changed paths, emits a JSON list of affected packages, a downstream job does `matrix: ${{ fromJSON(needs.setup.outputs.pkgs) }}` → one job per changed package (Lesson 3); (3) PER-PATH REQUIRED CHECKS — branch protection requires different status checks depending on which paths a PR touches (a docs PR isn\'t blocked on the backend suite); (4) SHARED SETUP as a composite action so every package job doesn\'t re-specify the toolchain. FLAKY-TEST POLICY (a test that passes/fails non-deterministically on the SAME code) — flakes are corrosive: a flake in the BLOCKING suite trains devs to hit "Re-run failed jobs" reflexively → a REAL regression gets re-run away too → incident. (1) QUARANTINE FAST — the moment it\'s identified, move it to a NON-blocking job (still runs + reports, doesn\'t gate merge); never leave a known flake gating merges. (2) BOUNDED RETRIES — auto-retry 1-2x ONLY as a stopgap, with a hard cap + the retry count logged; NEVER retry-until-green. (3) TRACK THE RATE — pass/fail per test over time, a dashboard of the flakiest; above a threshold → fix or delete. (4) A FLAKE IS A BUG — almost always a real race / order-dependency / time-or-timezone assumption / shared-state leak — the same class that bites in prod. Plus: `actionlint` as a REQUIRED check on `.github/**` — catches workflow syntax / injection / bad refs before merge.',
        hintHi: 'MONOREPO CI: (1) PATH FILTERS — `on: { push: { paths: [...] } }`; (2) DYNAMIC MATRIX — `matrix: ${{ fromJSON(needs.setup.outputs.pkgs) }}` → per changed package ek job; (3) PER-PATH REQUIRED CHECKS; (4) SHARED SETUP as a composite action. FLAKY-TEST POLICY: (1) QUARANTINE FAST — ek NON-blocking job mein move; kabhi ek known flake merges ko gate karne mat do. (2) BOUNDED RETRIES — 1-2x ONLY as a stopgap; NEVER retry-until-green. (3) TRACK THE RATE. (4) A FLAKE IS A BUG — usually ek real race / order-dependency / time assumption. Plus: `actionlint` ek REQUIRED check ke roop mein.',
      },
    ],

    keyTakeaways: [
      'RUNNERS (`runs-on`): HOSTED (`ubuntu-latest`/`windows-latest`/`macos-latest`) = a fresh clean VM per job, broad toolchain, billed per-minute — the default. SELF-HOSTED (label-matched) is worth it for hardware GitHub lacks (GPU), private-network access (VPC-only DBs), very high volume, or a custom base image — but YOU patch/secure/scale it, and a runner exposed to public repos / fork PRs MUST be EPHEMERAL (one job then destroyed) or a fork PR\'s `npm ci` can tamper the box and the next (trusted) job inherits it. Use ARC on k8s for autoscaled ephemeral pod runners.',
      'REUSABLE WORKFLOW = a whole PIPELINE: `on: workflow_call` with typed `inputs`/`secrets`/`outputs`, called at the JOB level (`jobs.<id>.uses:`), OWNS its own jobs / `needs` / runners / matrix → real multi-stage parallelism. Cross-repo ref `org/repo/.github/workflows/x.yml@<sha>`; local `./.github/workflows/x.yml`. Read results via `needs.<job>.outputs`.',
      'COMPOSITE ACTION = a repeated STEP SEQUENCE: an `action.yml` with `runs.using: composite` + `steps:`, called at the STEP level (`steps: - uses:`), OWNS NOTHING — every step runs on the CALLER\'S runner sharing its filesystem (effects land in the caller\'s workspace). Local ref `./.github/actions/x` needs `actions/checkout` FIRST. DON\'T MIX THEM UP: a pipeline-as-composite-action collapses into one serial job (no matrix, no parallel, no `needs`); a setup-sequence-as-reusable-workflow is pointless job overhead.',
      'MONOREPO CI — don\'t run everything on every commit: PATH FILTERS (`on: { push: { paths: [...] } }` / `dorny/paths-filter`), a DYNAMIC MATRIX (`fromJSON(needs.setup.outputs.pkgs)` → one job per changed package), PER-PATH REQUIRED CHECKS (a docs PR isn\'t blocked on the backend suite), and SHARED SETUP as a composite action.',
      'FLAKY TESTS (pass/fail non-deterministically on the same code) erode trust: a flake in the BLOCKING suite trains devs to re-run CI reflexively → a real regression gets re-run past too → incident. POLICY: (1) QUARANTINE FAST — move it to a non-blocking job the moment it\'s identified; never let a known flake gate merges. (2) BOUNDED auto-retries (1-2x, logged) as a stopgap only — never retry-until-green. (3) TRACK the per-test flake rate; above a threshold → fix or delete. (4) A FLAKE IS A BUG — usually a real race / order-dep / time assumption / shared-state leak. Plus: run `actionlint` as a REQUIRED check on `.github/**` — it catches workflow syntax, injection, and bad/unpinned action refs before merge.',
    ],
    keyTakeawaysHi: [
      'RUNNERS (`runs-on`): HOSTED (`ubuntu-latest`/...) = per job ek fresh clean VM, per-minute billed — default. SELF-HOSTED (label-matched) worth it: hardware jo GitHub ke paas nahi (GPU), private-network access, bahut high volume, ya ek custom base image — par AAP ise patch/secure/scale karte ho, aur public repos / fork PRs ke exposed ek runner EPHEMERAL HONA CHAHIYE. ARC on k8s use karo.',
      'REUSABLE WORKFLOW = ek poora PIPELINE: `on: workflow_call` typed `inputs`/`secrets`/`outputs` ke saath, JOB level par called, apne jobs / `needs` / runners / matrix OWN karta hai. Cross-repo ref `org/repo/.github/workflows/x.yml@<sha>`.',
      'COMPOSITE ACTION = ek repeated STEP SEQUENCE: `action.yml` `runs.using: composite` + `steps:` ke saath, STEP level par called, KUCH NAHI OWN karता — har step CALLER ke runner par run hota hai. Local ref `./.github/actions/x` ko PEHLE `actions/checkout` chahiye. INHE MIX MAT KARO: ek pipeline-as-composite-action EK serial job mein collapse hota hai.',
      'MONOREPO CI: PATH FILTERS, ek DYNAMIC MATRIX (`fromJSON(...)` → per changed package ek job), PER-PATH REQUIRED CHECKS, aur SHARED SETUP as a composite action.',
      'FLAKY TESTS trust erode karte hain: BLOCKING suite mein ek flake devs ko CI reflexively re-run karne ke liye train karta hai → ek real regression bhi re-run ho jaata hai → incident. POLICY: (1) QUARANTINE FAST — ek non-blocking job mein move; kabhi ek known flake merges ko gate mat karne do. (2) BOUNDED auto-retries (1-2x) sirf ek stopgap. (3) per-test flake rate TRACK karo. (4) A FLAKE IS A BUG. Plus: `actionlint` ek REQUIRED check ke roop mein `.github/**` par.',
    ],
  },
];
