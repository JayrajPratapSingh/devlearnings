import type { CourseLesson } from './course-js-module1';

// DevOps Module 13 — Cloud Fundamentals: The Model, Compute & Identity
// Lessons 4-6 (part 2 of 2). Lessons 1-3 are in course-devops-module13.ts.
//
// VERIFICATION: PROSE + realistic hand-written CLI output. No live cloud account;
// every `aws` / `az` transcript is representative, not executed. No `# VERIFY`
// markers, so verify-bash.mjs scans structurally only. AWS is the worked example
// with concrete Azure equivalents in every lesson (GCP noted briefly).

export const DEVOPS_MODULE_13_PART2: CourseLesson[] = [
  {
    slug: 'ops-workload-identity-roles-and-oidc-federation',
    title: 'Workload Identity, Roles & OIDC Federation',
    titleHi: 'Workload Identity, Roles Aur OIDC Federation',
    description:
      'How code proves who it is to the cloud without any stored secret: instance and task roles that the platform injects, per-workload identities inside Kubernetes, cross-account role assumption with an external ID, and OIDC federation that lets a CI pipeline or another cloud authenticate with a short-lived token instead of a long-lived key. AWS IAM roles and Azure managed identities side by side.',
    descriptionHi:
      'Code cloud ko kaise prove karta hai wo kaun hai bina kisi stored secret ke: instance aur task roles jo platform inject karta hai, Kubernetes ke andar per-workload identities, ek external ID ke saath cross-account role assumption, aur OIDC federation jo ek CI pipeline ya doosre cloud ko ek long-lived key ke bajaay ek short-lived token ke saath authenticate karne deta hai. AWS IAM roles aur Azure managed identities side by side.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A staff pass that only works while you are on the clock.** Instead of a permanent key that opens the building forever (a static access key), you badge in when your shift starts and the system prints you a paper wristband that stops working at the end of the day (temporary role credentials). You never carry a key home; there is nothing to lose. If a supplier\'s courier needs to drop something in your loading bay, they do not get a wristband to your building — their own company vouches for them at your gate, and only for that one delivery, and only if they say the code word you agreed in advance (OIDC federation with an audience and a subject condition). The whole point is that no long-lived key to anything is ever sitting in someone\'s pocket or a text file.',
      hi: '**Ek staff pass jo sirf tab kaam karta hai jab aap clock par ho.** Ek permanent key ke bajaay jo building ko hamesha kholti hai (ek static access key), aap badge in karte ho jab aapki shift shuru hoti hai aur system aapko ek paper wristband print karta hai jo din ke ant mein kaam karna band kar deta hai (temporary role credentials). Aap kabhi ek key ghar nahi le jaate; khone ke liye kuch nahi hai. Agar ek supplier ke courier ko aapki loading bay mein kuch drop karna hai, unhe aapki building ka wristband nahi milta — unki apni company aapke gate par unke liye vouch karti hai, aur sirf us ek delivery ke liye, aur sirf agar wo code word kehte hain jo aapne pehle agree kiya (OIDC federation ek audience aur ek subject condition ke saath).',
    },

    simple: `**THE GOAL: no long-lived credentials anywhere.** Workloads and pipelines prove
identity with short-lived tokens the platform mints, not stored keys.

**WORKLOAD IDENTITY on a VM / container:**
\`\`\`
EC2       an INSTANCE PROFILE wraps a role. the SDK reads temp creds from the
          Instance Metadata Service (use IMDSv2 - token-required - to resist SSRF).
ECS       a TASK ROLE per task definition. (+ a separate task EXECUTION role for
          pulling the image / writing logs.)
Lambda    the EXECUTION ROLE.  App Runner / Beanstalk: an instance/service role.
\`\`\`

**WORKLOAD IDENTITY inside Kubernetes:**
\`\`\`
AWS   IRSA or EKS Pod Identity: a K8s ServiceAccount is mapped to an IAM role;
      pods using that SA get role creds - per-app, not per-node.
Azure AKS Workload Identity: a K8s SA <-> a user-assigned managed identity via an
      OIDC issuer + a federated credential.
GCP   GKE Workload Identity: a K8s SA <-> a Google service account.
\`\`\`

**CROSS-ACCOUNT ACCESS:** account B's role has a TRUST POLICY naming a principal
in account A; A calls \`sts:AssumeRole\` and gets B's temp creds.
\`\`\`
for a THIRD PARTY assuming your role: REQUIRE an  sts:ExternalId  (a shared
secret they must pass) -> defeats the "confused deputy" attack.
\`\`\`

**OIDC FEDERATION** — an external identity provider (GitHub Actions, GitLab, another
cloud, an on-prem IdP) issues a signed JWT; the cloud trusts that issuer and
exchanges the JWT for its own short-lived creds. NO stored key.
\`\`\`
GitHub Actions -> AWS:
  1. create an IAM OIDC provider for  token.actions.githubusercontent.com
  2. an IAM role whose trust policy checks:
       aud = sts.amazonaws.com
       sub = repo:acme/web:ref:refs/heads/main       <- pin repo + branch/env/tag!
  3. workflow:  permissions: id-token: write
       uses: aws-actions/configure-aws-credentials@v4
         with: { role-to-assume: arn:...:role/gha-deploy, aws-region: eu-west-1 }
  -> the job runs with a ~1h role session. nothing in GitHub secrets.
GitHub Actions -> Azure:  azure/login@v2 with a federated credential on an app
  registration / user-assigned managed identity (same idea).
\`\`\`
**The \`sub\` claim is the security boundary** - \`repo:acme/web:*\` trusts every
branch and every PR; pin it to a branch, a tag pattern, or a GitHub Environment.

**AZURE MANAGED IDENTITIES:**
\`\`\`
SYSTEM-ASSIGNED   1:1 with one resource, lifecycle tied to it, can't be shared
USER-ASSIGNED     a standalone identity you attach to many resources; survives them
both: no secret; the resource gets tokens from the Azure IMDS endpoint.
grant access with a role assignment on the identity (Lesson 3).
\`\`\``,

    simpleHi: `**GOAL: kahin koi long-lived credentials nahi.** Workloads aur pipelines identity
prove karte hain short-lived tokens se jo platform mint karta hai, stored keys se nahi.

**WORKLOAD IDENTITY ek VM / container par:**
\`\`\`
EC2       ek INSTANCE PROFILE ek role wrap karta hai. SDK Instance Metadata
          Service se temp creds read karta hai (IMDSv2 use karo - token-required - SSRF resist karne ke liye).
ECS       per task definition ek TASK ROLE. (+ image pull / logs write ke liye ek
          separate task EXECUTION role.)
Lambda    EXECUTION ROLE.  App Runner / Beanstalk: ek instance/service role.
\`\`\`

**WORKLOAD IDENTITY Kubernetes ke andar:**
\`\`\`
AWS   IRSA ya EKS Pod Identity: ek K8s ServiceAccount ek IAM role se mapped;
      us SA ka use karne wale pods role creds paate hain - per-app, per-node nahi.
Azure AKS Workload Identity: ek K8s SA <-> ek user-assigned managed identity ek
      OIDC issuer + ek federated credential ke through.
GCP   GKE Workload Identity: ek K8s SA <-> ek Google service account.
\`\`\`

**CROSS-ACCOUNT ACCESS:** account B ke role ki ek TRUST POLICY account A mein ek
principal name karti hai; A \`sts:AssumeRole\` call karta hai aur B ki temp creds paata hai.
\`\`\`
ek THIRD PARTY jo aapki role assume karta hai ke liye: ek  sts:ExternalId  REQUIRE
karo (ek shared secret jo unhe pass karna chahiye) -> "confused deputy" attack defeat karta hai.
\`\`\`

**OIDC FEDERATION** — ek external identity provider (GitHub Actions, GitLab, doosra
cloud, ek on-prem IdP) ek signed JWT issue karta hai; cloud us issuer par trust karta
hai aur JWT ko apni short-lived creds ke liye exchange karta hai. KOI stored key nahi.
\`\`\`
GitHub Actions -> AWS:
  1. token.actions.githubusercontent.com ke liye ek IAM OIDC provider banao
  2. ek IAM role jiski trust policy check karti hai:
       aud = sts.amazonaws.com
       sub = repo:acme/web:ref:refs/heads/main       <- repo + branch/env/tag pin karo!
  3. workflow:  permissions: id-token: write
       uses: aws-actions/configure-aws-credentials@v4
  -> job ek ~1h role session ke saath chalta hai. GitHub secrets mein kuch nahi.
GitHub Actions -> Azure:  azure/login@v2 ek app registration / user-assigned managed
  identity par ek federated credential ke saath (same idea).
\`\`\`
**\`sub\` claim security boundary hai** - \`repo:acme/web:*\` har branch aur har PR par
trust karta hai; ise ek branch, ek tag pattern, ya ek GitHub Environment par pin karo.

**AZURE MANAGED IDENTITIES:**
\`\`\`
SYSTEM-ASSIGNED   ek resource ke saath 1:1, lifecycle ise se tied, share nahi ho sakti
USER-ASSIGNED     ek standalone identity jo aap kई resources se attach karte ho; unhe survive karti hai
dono: koi secret nahi; resource Azure IMDS endpoint se tokens paata hai.
identity par ek role assignment se access grant karo (Lesson 3).
\`\`\``,

    content: `## The goal: eliminate stored credentials

Lesson 3 established that long-lived access keys are the dominant source of cloud credential leaks. This lesson is about the mechanisms that replace them. In every case the pattern is the same: the workload or pipeline does not hold a secret; instead, the platform it runs on vouches for its identity, and it exchanges that for short-lived credentials that expire on their own.

## Workload identity on VMs and containers

An **EC2 instance profile** attaches an IAM role to an instance. The AWS SDK, running on the instance, automatically retrieves temporary credentials for that role from the **Instance Metadata Service** (IMDS), a link-local endpoint at \`169.254.169.254\`. Always require **IMDSv2**, which needs a session token obtained by a \`PUT\` request before the credentials can be read — this defeats the common server-side-request-forgery attack where an attacker tricks the application into fetching \`http://169.254.169.254/...\` and leaking the role\'s credentials.

**ECS** gives each task definition a **task role** for the application\'s own AWS calls, plus a separate **task execution role** that the ECS agent uses to pull the image and write logs. **Lambda** has an **execution role**. **App Runner**, **Elastic Beanstalk**, and similar services each have an instance or service role. In all of these the credentials are injected by the platform, rotated automatically, and never written to disk.

## Workload identity in Kubernetes

A Kubernetes node has its own cloud identity, but you do not want every pod on a node to share the node\'s permissions — you want each application to have exactly its own. The mechanism is to bind a **Kubernetes ServiceAccount** to a cloud identity:

- **AWS**: **IRSA** (IAM Roles for Service Accounts) or the newer **EKS Pod Identity**. The cluster has an OIDC provider; a ServiceAccount is annotated with an IAM role ARN; pods using that ServiceAccount receive that role\'s temporary credentials, projected as a token file the SDK reads.
- **Azure**: **AKS Workload Identity**. The cluster exposes an OIDC issuer; a ServiceAccount is linked to a **user-assigned managed identity** through a **federated credential** that trusts \`system:serviceaccount:<namespace>:<name>\`.
- **GCP**: **GKE Workload Identity** maps a Kubernetes ServiceAccount to a Google service account.

The result is per-application least privilege inside the cluster: the payments pod can reach the payments queue and nothing else, regardless of what other pods on the same node can do.

## Cross-account access

To let a principal in account A act in account B, you create a **role in account B** whose **trust policy** names the principal in account A as allowed to assume it. Account A calls \`sts:AssumeRole\` against that role ARN and receives account B\'s temporary credentials for the session. This is how a central logging account is written to by many workload accounts, how an audit account reads across an organisation, and how a tooling account deploys into environment accounts.

When the principal assuming your role belongs to a **third party** — a monitoring vendor, a data platform, a backup service — add an **\`sts:ExternalId\` condition** to the trust policy: a shared secret string that the third party must present on every \`AssumeRole\` call. Without it, the "confused deputy" problem applies: the third party\'s system can be tricked by one of its other customers into assuming *your* role on that customer\'s behalf, because from the third party\'s side all it has is your role ARN. The external ID, which only you and that third party know, ties the assumption to your specific relationship.

## OIDC federation

**OIDC federation** lets an identity that lives entirely outside the cloud authenticate to it without any pre-shared secret. An external OpenID Connect provider — GitHub Actions, GitLab CI, another cloud, an enterprise identity provider — issues a short-lived signed JWT describing the caller (which repository, which branch, which workflow, which pipeline). The cloud is configured to trust that provider\'s issuer URL and public keys, and to exchange a valid JWT for its own short-lived credentials, subject to conditions on the JWT\'s claims.

The canonical example is **GitHub Actions deploying to AWS** without storing an access key:

1. Create an **IAM OIDC identity provider** for \`token.actions.githubusercontent.com\`.
2. Create an IAM role whose **trust policy** requires the JWT\'s \`aud\` claim to be \`sts.amazonaws.com\` and its \`sub\` claim to match a specific pattern such as \`repo:acme/web:ref:refs/heads/main\` or \`repo:acme/web:environment:production\`.
3. In the workflow, grant \`permissions: id-token: write\` and use \`aws-actions/configure-aws-credentials@v4\` with the role ARN. The action fetches the OIDC token from GitHub, presents it to STS, and gets back a role session valid for about an hour.

Nothing is stored in GitHub secrets. The **\`sub\` claim condition is the security boundary**: \`repo:acme/web:*\` would trust every branch and every pull request build, so a fork PR could assume your deploy role. Pin it to a specific branch, a tag pattern, or — best — a **GitHub Environment** with its own protection rules, so only a run targeting that environment can assume the role.

The same pattern works for **GitHub Actions to Azure** with \`azure/login@v2\` and a **federated credential** on an app registration or user-assigned managed identity, and for **GitLab, Terraform Cloud, Buildkite, and CircleCI** to any of the clouds.

## Azure managed identities

Azure\'s equivalent of instance and task roles is the **managed identity**:

- A **system-assigned** managed identity is created with a specific resource, shares its lifecycle (deleted when the resource is deleted), and cannot be shared with another resource. Use it for a one-to-one identity that should not outlive its resource.
- A **user-assigned** managed identity is a standalone resource you create once and attach to many resources (VMs, App Services, AKS pods, Container Apps), and it survives them. Use it when several workloads share an identity or when the identity must persist across resource recreation.

Either way there is no secret: the resource obtains tokens from the Azure Instance Metadata Service endpoint, and you grant it permissions with a normal role assignment (Lesson 3) on the identity.`,

    contentHi: `## Goal: stored credentials eliminate karo

Lesson 3 ne establish kiya ki long-lived access keys cloud credential leaks ka dominant source hain. Ye lesson un mechanisms ke baare mein hai jo unhe replace karti hain. Har case mein pattern same hai: workload ya pipeline ek secret nahi rakhta; instead, platform jis par ye run karta hai iski identity ke liye vouch karta hai, aur ye ise short-lived credentials ke liye exchange karta hai jo apne aap expire hoti hain.

## Workload identity VMs aur containers par

Ek **EC2 instance profile** ek IAM role ek instance se attach karta hai. AWS SDK, instance par running, us role ke liye temporary credentials automatically **Instance Metadata Service** (IMDS) se retrieve karta hai. Hamesha **IMDSv2** require karo, jise credentials read hone se pehle ek \`PUT\` request se obtained ek session token chahiye — ye common server-side-request-forgery attack ko defeat karta hai.

**ECS** har task definition ko ek **task role** deta hai application ki apni AWS calls ke liye, plus ek separate **task execution role** jo ECS agent image pull aur logs write karne ke liye use karta hai. **Lambda** ke paas ek **execution role** hai. In sab mein credentials platform dwara injected hain, automatically rotated, aur kabhi disk par nahi likhे jaate.

## Workload identity Kubernetes ke andar

Ek Kubernetes node ki apni cloud identity hai, par aap nahi chahte ki ek node par har pod node ki permissions share kare — aap chahte ho har application ke paas exactly iski apni ho. Mechanism ek **Kubernetes ServiceAccount** ko ek cloud identity se bind karna hai:
- **AWS**: **IRSA** ya newer **EKS Pod Identity**.
- **Azure**: **AKS Workload Identity**. Ek ServiceAccount ek **user-assigned managed identity** se ek **federated credential** ke through linked hai.
- **GCP**: **GKE Workload Identity** ek Kubernetes ServiceAccount ko ek Google service account se map karti hai.

Result cluster ke andar per-application least privilege hai.

## Cross-account access

Account A mein ek principal ko account B mein act karne dene ke liye, aap **account B mein ek role** banate ho jiski **trust policy** account A mein principal ko assume karne ke liye allowed name karti hai. Account A us role ARN ke against \`sts:AssumeRole\` call karta hai.

Jab aapki role assume karne wala principal ek **third party** ka hai — ek monitoring vendor, ek data platform — trust policy mein ek **\`sts:ExternalId\` condition** add karo: ek shared secret string jo third party ko har \`AssumeRole\` call par present karna chahiye. Iske bina, "confused deputy" problem apply hoti hai.

## OIDC federation

**OIDC federation** ek identity ko jo poori tarah cloud ke bahar rehti hai use authenticate karne deti hai bina kisi pre-shared secret ke. Ek external OpenID Connect provider — GitHub Actions, GitLab CI, doosra cloud — caller ko describe karta hua ek short-lived signed JWT issue karta hai. Cloud us provider ke issuer URL par trust karne ke liye configured hai aur ek valid JWT ko apni short-lived credentials ke liye exchange karne ke liye.

Canonical example **GitHub Actions AWS par deploying** hai bina ek access key store kiye:
1. \`token.actions.githubusercontent.com\` ke liye ek **IAM OIDC identity provider** banao.
2. Ek IAM role banao jiski **trust policy** JWT ke \`aud\` claim ko \`sts.amazonaws.com\` aur iske \`sub\` claim ko ek specific pattern jaise \`repo:acme/web:ref:refs/heads/main\` match karne ki require karti hai.
3. Workflow mein, \`permissions: id-token: write\` grant karo aur \`aws-actions/configure-aws-credentials@v4\` use karo.

GitHub secrets mein kuch store nahi hai. **\`sub\` claim condition security boundary hai**: \`repo:acme/web:*\` har branch aur har pull request build par trust karega. Ise ek specific branch, ek tag pattern, ya — best — ek **GitHub Environment** par pin karo.

## Azure managed identities

Azure ka instance aur task roles ka equivalent **managed identity** hai:
- Ek **system-assigned** managed identity ek specific resource ke saath banayi jaati hai, iska lifecycle share karti hai, aur doosre resource se share nahi ho sakti.
- Ek **user-assigned** managed identity ek standalone resource hai jo aap ek baar banate ho aur kई resources se attach karte ho, aur ye unhe survive karti hai.

Kisi bhi tarah koi secret nahi hai: resource Azure Instance Metadata Service endpoint se tokens obtain karta hai, aur aap ise identity par ek normal role assignment se permissions grant karte ho.`,

    examples: [
      {
        title: 'GitHub Actions to AWS with OIDC — the trust policy is where the security lives',
        titleHi: 'OIDC ke saath GitHub Actions AWS par — trust policy wahaan hai jahaan security rehti hai',
        code: `# 1) one-time: an OIDC provider for GitHub in the AWS account
$ aws iam create-open-id-connect-provider \\
    --url https://token.actions.githubusercontent.com \\
    --client-id-list sts.amazonaws.com \\
    --thumbprint-list <github's-cert-thumbprint>

# 2) the deploy role's TRUST POLICY - who may assume it:
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::1234:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        "token.actions.githubusercontent.com:sub": "repo:acme/web:environment:production"
      }
    }
  }]
}
#   ^ 'environment:production' means: ONLY a job that declared
#     'environment: production' (which has required-reviewer protection) can assume
#     this role. a fork PR, a feature branch, a different repo -> denied.

# 3) the workflow (no secrets):
jobs:
  deploy:
    environment: production
    permissions:
      id-token: write        # <- lets the runner request an OIDC token
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::1234:role/gha-web-deploy
          aws-region: eu-west-1
      - run: aws sts get-caller-identity
        #   -> Arn: arn:aws:sts::1234:assumed-role/gha-web-deploy/GitHubActions
        #      (a ~1h session; expires on its own; nothing to leak)

# Azure equivalent: a federated credential on a user-assigned managed identity,
#   subject = repo:acme/web:environment:production, then  azure/login@v2  with
#   client-id + tenant-id + subscription-id (all non-secret).`,
        output: `The access key that used to sit in GitHub secrets is gone. What replaced it is a
trust relationship: AWS trusts GitHub's OIDC issuer, and the CONDITION block pins
exactly which GitHub context may assume the role. The 'sub' claim is the whole
security boundary - 'environment:production' + a protected environment means a
human approves before any run can touch prod, and no other branch or repo or fork
can get in at all.`,
        explain: 'The setup has three parts. First, a one-time registration in the AWS account of GitHub\'s OIDC issuer as a trusted identity provider. Second, the deploy role\'s trust policy, which is where all the security decisions are made: it allows the federated GitHub principal to assume the role, but only when the presented token\'s audience is sts.amazonaws.com and its subject is exactly repo:acme/web:environment:production. That subject condition means a workflow job must have declared environment: production to assume the role — and because that GitHub Environment is configured with required reviewers, a human must approve the run first. A job on a feature branch, a build of a pull request from a fork, or a workflow in a different repository presents a different subject and is denied. Third, the workflow itself, which stores no credentials: it requests permission to mint an OIDC token, hands that token to the configure-aws-credentials action, and receives a role session valid for about an hour that expires on its own. The final sts get-caller-identity confirms the job is running as an assumed-role session, not as any stored user. The Azure path is structurally identical: a federated credential on a managed identity with the same subject string, then azure/login with only non-secret identifiers.',
        explainHi: 'Setup ke teen parts hain. Pehle, AWS account mein GitHub ke OIDC issuer ka ek one-time registration ek trusted identity provider ke roop mein. Doosre, deploy role ki trust policy, jahaan saare security decisions banaye jaate hain: ye federated GitHub principal ko role assume karne allow karti hai, par sirf jab presented token ka audience sts.amazonaws.com hai aur iska subject exactly repo:acme/web:environment:production hai. Wo subject condition ka matlab ek workflow job ne environment: production declare kiya hona chahiye role assume karne ke liye — aur kyunki wo GitHub Environment required reviewers ke saath configured hai, ek human ko run pehle approve karna chahiye. Ek feature branch par ek job, ek fork se ek pull request ka ek build, ya ek alag repository mein ek workflow ek alag subject present karta hai aur denied hai. Teesre, workflow khud, jo koi credentials store nahi karta.',
      },
      {
        title: 'Per-pod identity in Kubernetes: two pods on one node, two different permission sets',
        titleHi: 'Kubernetes mein per-pod identity: ek node par do pods, do alag permission sets',
        code: `# --- AWS: IRSA / EKS Pod Identity ---
# the payments app's ServiceAccount is mapped to a narrowly-scoped IAM role:
apiVersion: v1
kind: ServiceAccount
metadata:
  name: payments
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::1234:role/payments-app
    #  role 'payments-app' can:  sqs:SendMessage on the payments-queue,
    #                            secretsmanager:GetSecretValue on payments/*
---
apiVersion: apps/v1
kind: Deployment
metadata: { name: payments }
spec:
  template:
    spec:
      serviceAccountName: payments        # <- pods get the payments-app role
      containers: [ { name: app, image: acme/payments:1.9 } ]

# the reporting app runs on the SAME nodes but a different SA -> a different role
# ('reporting-ro': s3:GetObject on acme-reports/* and nothing else).

$ kubectl exec deploy/payments -- aws sts get-caller-identity
{ "Arn": "arn:aws:sts::1234:assumed-role/payments-app/botocore-session-..." }

$ kubectl exec deploy/reporting -- aws sts get-caller-identity
{ "Arn": "arn:aws:sts::1234:assumed-role/reporting-ro/botocore-session-..." }

$ kubectl exec deploy/reporting -- aws sqs send-message --queue-url .../payments-queue --message-body x
An error occurred (AccessDenied) ... not authorized to perform: sqs:SendMessage

# --- Azure: AKS Workload Identity ---
#   ServiceAccount annotated  azure.workload.identity/client-id: <UAMI client id>
#   + a FederatedIdentityCredential on that user-assigned managed identity whose
#     subject = system:serviceaccount:prod:payments
#   the pod's SDK exchanges the projected SA token for an Entra token for the UAMI.`,
        output: `Two pods, same nodes, same cluster - and the reporting pod physically cannot send
to the payments queue, because its identity (the 'reporting-ro' role, via its
ServiceAccount) was never granted sqs:SendMessage. Without per-pod identity, every
pod would inherit the NODE's role, and you would be forced to make the node role
the union of everything every pod needs - a large, blunt grant.`,
        explain: 'Two applications run on the same Kubernetes nodes in the same cluster. The payments deployment uses a ServiceAccount annotated with an IAM role that permits exactly sending to the payments queue and reading payments secrets. The reporting deployment uses a different ServiceAccount mapped to a role that permits only reading report objects from one bucket. When a shell in the payments pod calls get-caller-identity it reports the payments-app assumed role; the reporting pod reports the reporting-ro role. When the reporting pod attempts to send a message to the payments queue, it is denied, because the role its ServiceAccount maps to was never granted that action — even though the two pods share physical nodes. The Azure equivalent binds the ServiceAccount to a user-assigned managed identity through a federated identity credential whose subject is the fully-qualified ServiceAccount name. The alternative, which is what you get without workload identity, is that every pod inherits the node instance role, which forces that single role to be the union of every permission any pod on the cluster needs — a broad grant where a compromise of any one pod yields all of it. Per-pod identity restores least privilege inside the cluster.',
        explainHi: 'Do applications same Kubernetes nodes par same cluster mein run karte hain. Payments deployment ek ServiceAccount use karta hai jo ek IAM role se annotated hai jo exactly payments queue par send karne aur payments secrets read karne ko permit karti hai. Reporting deployment ek alag ServiceAccount use karta hai ek role se mapped jo sirf ek bucket se report objects read karne ko permit karti hai. Jab payments pod mein ek shell get-caller-identity call karta hai ye payments-app assumed role report karta hai; reporting pod reporting-ro role report karta hai. Jab reporting pod payments queue par ek message send karne ki koshish karta hai, ye denied hai, kyunki jo role iska ServiceAccount map karta hai use wo action kabhi grant nahi kiya gaya — even though do pods physical nodes share karte hain. Alternative, jo aapko workload identity ke bina milta hai, ye hai ki har pod node instance role inherit karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# an OIDC trust policy that trusts the whole repo (every branch, every PR)
"Condition": {
  "StringLike": {
    "token.actions.githubusercontent.com:sub": "repo:acme/web:*"
  }
}
# now:
#   - a PR from a fork runs a workflow that assumes your deploy role
#   - a feature branch can deploy to prod
#   - a compromised contributor account opens a PR that exfiltrates via the role
# the OIDC setup removed the static key but left the door wide open.`,
        right: `# pin 'sub' to the exact context that is allowed to deploy:
"StringEquals": {
  "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
  "token.actions.githubusercontent.com:sub": "repo:acme/web:environment:production"
}
#   - only a job with  environment: production  (protected, required reviewers)
#   - fork PRs can't set a protected environment -> can't assume the role
#   - separate roles per environment:  :environment:staging  -> a staging-only role
# also acceptable, more specific than a wildcard:
#   "repo:acme/web:ref:refs/heads/main"        (main branch only)
#   "repo:acme/web:ref:refs/tags/v*"           (release tags only)
# NEVER  repo:acme/web:*  or  repo:acme/*:*`,
        why: 'OIDC federation removes the stored access key, which is a real improvement, but it replaces the question "who has the key" with the question "which external contexts does the trust policy accept" — and if that condition is a wildcard, the answer is "far too many". A \`sub\` claim of \`repo:acme/web:*\` matches the subject of every workflow run in that repository: every branch, every tag, and critically every pull request build, including pull requests opened from forks by people who are not on your team. Any of those runs can assume your deploy role and do whatever it permits. The fix is to make the subject condition as specific as the deployment it authorises. The strongest form is \`repo:acme/web:environment:production\`, which only matches a job that declared \`environment: production\`; because a GitHub Environment can require reviewers and cannot be targeted by fork pull requests, this ties the ability to assume the role to an approved deployment. Pinning to \`ref:refs/heads/main\` or \`ref:refs/tags/v*\` is also acceptable and far better than a wildcard. Use a separate role per environment so that a staging deployment cannot touch production. A wildcard subject is the OIDC equivalent of committing the key to the repo.',
        whyHi: 'OIDC federation stored access key hata deta hai, jo ek real improvement hai, par ye "kiske paas key hai" question ko "trust policy kaun se external contexts accept karti hai" question se replace karta hai — aur agar wo condition ek wildcard hai, answer "bahut zyada" hai. \`repo:acme/web:*\` ka ek \`sub\` claim us repository mein har workflow run ke subject ko match karta hai: har branch, har tag, aur critically har pull request build, including forks se opened pull requests. In runs mein se koi bhi aapki deploy role assume kar sakta hai. Fix subject condition ko utna specific banana hai jitni wo deployment jise ye authorise karti hai. Strongest form \`repo:acme/web:environment:production\` hai. Har environment ke liye ek separate role use karo.',
      },
      {
        wrong: `# leaving IMDSv1 enabled on EC2 instances (the SSRF -> credential-theft path)
# an app has an "image URL" feature. an attacker submits:
#   http://169.254.169.254/latest/meta-data/iam/security-credentials/app-role
# with IMDSv1 the instance happily returns the role's temp credentials in the
# HTTP response, which the attacker now has for ~6 hours. this is how the 2019
# Capital One breach worked.`,
        right: `# require IMDSv2 (token-gated) - and hop-limit 1 so containers can't reach it easily:
resource "aws_instance" "app" {
  metadata_options {
    http_tokens                 = "required"   # IMDSv2 only - a PUT for a token first
    http_put_response_hop_limit = 1            # the token TTL can't traverse to a pod
    http_endpoint               = "enabled"
  }
}
# account-wide default:  aws ec2 modify-instance-metadata-defaults --http-tokens required
# EKS: set it on the launch template / node group.
# and STILL apply least privilege to the instance/pod role - IMDSv2 raises the bar
# for stealing the creds; least privilege bounds what they're worth.`,
        why: 'The Instance Metadata Service is a link-local HTTP endpoint that hands out the instance role\'s live credentials to anything on the instance that asks. IMDSv1 answers a plain \`GET\`, which means any code that can make an outbound HTTP request from the instance — including an application vulnerable to server-side request forgery, where an attacker controls a URL the server fetches — can retrieve those credentials by pointing the request at \`169.254.169.254\`. This is precisely the mechanism of the 2019 Capital One breach. IMDSv2 requires the caller to first obtain a session token with a \`PUT\` request carrying a specific header, and then present that token on the \`GET\`; most SSRF primitives can only perform a \`GET\`, so this closes the common path. Setting the PUT response hop limit to 1 additionally prevents the token from being routed to a container on the host, tightening it against a compromised pod. Requiring IMDSv2 should be the account-wide default and set explicitly on every instance and node group. It is not a substitute for least privilege on the role — IMDSv2 makes the credentials harder to steal, and least privilege makes them less valuable if stolen; you want both.',
        whyHi: 'Instance Metadata Service ek link-local HTTP endpoint hai jo instance role ke live credentials instance par kisi bhi cheez ko deta hai jo poochti hai. IMDSv1 ek plain \`GET\` answer karta hai, jiska matlab koi bhi code jo instance se ek outbound HTTP request bana sakta hai — including ek application jo server-side request forgery ke liye vulnerable hai — un credentials ko \`169.254.169.254\` par request point karke retrieve kar sakta hai. Ye 2019 Capital One breach ka precisely mechanism hai. IMDSv2 caller ko pehle ek \`PUT\` request se ek session token obtain karne ki require karta hai, aur phir us token ko \`GET\` par present karne ki; zyadaatar SSRF primitives sirf ek \`GET\` perform kar sakte hain, to ye common path close karta hai. IMDSv2 require karna account-wide default hona chahiye.',
      },
      {
        wrong: `# a cross-account trust policy with no ExternalId for a third-party vendor
# your role 'vendor-metrics-read' trusts the monitoring vendor:
{ "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::<vendor-account>:root" },
  "Action": "sts:AssumeRole" }
# the vendor's platform assumes roles for ALL its customers. an attacker who is
# also a customer of that vendor tells the vendor's system "assume THIS role ARN"
# (yours) - and the vendor's deputy dutifully does it, because all it checks is
# "is this a role ARN a customer configured". now the attacker reads your metrics
# (or worse, if the role is over-scoped).`,
        right: `# require an ExternalId that only you and the vendor know:
{ "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::<vendor-account>:role/their-collector" },
  "Action": "sts:AssumeRole",
  "Condition": { "StringEquals": {
    "sts:ExternalId": "acme-a7f3c1e9-...-shared-with-vendor-only"
  } } }
#   - the vendor stores your ExternalId against YOUR account in their system
#   - when their deputy assumes your role, it must pass YOUR ExternalId
#   - another customer can't make the deputy pass a value they don't have
# also: scope Principal to the vendor's SPECIFIC role, not their :root, and
# scope the role's PERMISSIONS to read-only on exactly the resources they need.`,
        why: 'When you configure a role that a third-party service can assume, you are trusting that service\'s system to only assume your role on your behalf. But that service assumes roles for all of its customers using the same infrastructure, and from its side the only input is a role ARN that a customer configured. The "confused deputy" attack exploits this: an attacker who is also a customer of the vendor supplies *your* role ARN in their own configuration, and the vendor\'s system — the "deputy" — assumes your role, because it has no way to know that ARN is not the attacker\'s. The \`sts:ExternalId\` condition fixes it by requiring a secret string, unique to your relationship with the vendor, to be presented on every assume call. The vendor stores your external ID associated with your account and passes it when acting for you; an attacker configuring your ARN cannot make the vendor pass an external ID they were never given. Alongside the external ID, scope the trust to the vendor\'s specific collector role rather than their whole account, and scope the role\'s own permissions to read-only on exactly the resources the integration needs, so that even a successful confused-deputy assumption yields very little.',
        whyHi: 'Jab aap ek role configure karte ho jise ek third-party service assume kar sakti hai, aap us service ke system par trust kar rahe ho ki wo aapki role sirf aapki taraf se assume kare. Par wo service apne saare customers ke liye same infrastructure use karke roles assume karti hai, aur iski side se ekmatra input ek role ARN hai jo ek customer ne configure kiya. "Confused deputy" attack ise exploit karta hai: ek attacker jo vendor ka bhi customer hai apni khud ki configuration mein *aapka* role ARN supply karta hai, aur vendor ka system — "deputy" — aapki role assume karta hai. \`sts:ExternalId\` condition ise fix karti hai ek secret string require karke, aapke vendor ke saath relationship ke unique, har assume call par present kiya jaana. Iske alongside, trust ko vendor ke specific collector role par scope karo, aur role ki apni permissions ko read-only par scope karo.',
      },
    ],

    realWorld: [
      {
        en: '**A wildcard OIDC `sub`** — a team migrated off static keys to GitHub OIDC but set `sub` to `repo:org/*:*` "to cover all our repos". A contributor\'s account was phished; the attacker opened a PR whose workflow assumed the deploy role and pushed a backdoored image. Fixed by per-repo roles pinned to `environment:production` with required reviewers.',
        hi: '**Ek wildcard OIDC `sub`** — ek team static keys se GitHub OIDC par migrate hui par `sub` ko `repo:org/*:*` set kiya "hamare saare repos cover karne ke liye". Ek contributor ka account phished tha; attacker ne ek PR khola jiska workflow deploy role assume karta tha. Per-repo roles se fix kiya `environment:production` par pinned.',
      },
      {
        en: '**IMDSv1 and an SSRF** — a fintech\'s "fetch avatar from URL" endpoint let an attacker hit `169.254.169.254`; IMDSv1 returned the EC2 role\'s creds, which had `s3:*`. 3 TB of documents were listed and partly copied before the ~2-hour session expired. Now: IMDSv2 required account-wide, hop-limit 1, and the instance role scoped to two buckets.',
        hi: '**IMDSv1 aur ek SSRF** — ek fintech ke "URL se avatar fetch karo" endpoint ne ek attacker ko `169.254.169.254` hit karne diya; IMDSv1 ne EC2 role ki creds return ki, jinke paas `s3:*` tha. 3 TB documents list kiye gaye. Ab: IMDSv2 account-wide required, hop-limit 1.',
      },
      {
        en: '**No ExternalId, a vendor breach** — a company\'s analytics vendor was compromised. The attacker enumerated the vendor\'s customer role ARNs and assumed into dozens of accounts, including one where the "read-only" role had been quietly widened to include `dynamodb:*`. The company that had set an `sts:ExternalId` on its trust policy was not reachable this way.',
        hi: '**Koi ExternalId nahi, ek vendor breach** — ek company ka analytics vendor compromised tha. Attacker ne vendor ke customer role ARNs enumerate kiye aur dozens accounts mein assume kiya. Jis company ne apni trust policy par ek `sts:ExternalId` set kiya tha wo is tarah reachable nahi thi.',
      },
    ],

    interviewQA: [
      {
        q: 'How does a workload on EC2, ECS, or in Kubernetes get cloud credentials without a stored key, and why is per-pod identity important?',
        qHi: 'EC2, ECS, ya Kubernetes mein ek workload bina ek stored key ke cloud credentials kaise paata hai, aur per-pod identity kyun important hai?',
        a: 'On EC2, an instance profile attaches an IAM role to the instance, and the SDK retrieves temporary credentials for that role from the Instance Metadata Service, a link-local endpoint; you require IMDSv2 so a session token is needed before the credentials can be read, which blocks the common SSRF-to-credential-theft path. On ECS, each task definition has a task role for the application\'s calls and a separate task execution role for pulling the image and writing logs. Lambda has an execution role. In all cases the platform injects the credentials, rotates them automatically, and never writes them to disk. In Kubernetes the node has its own identity, but you do not want every pod to inherit the node\'s permissions, so you bind a Kubernetes ServiceAccount to a cloud identity: IRSA or EKS Pod Identity on AWS, AKS Workload Identity via a federated credential on Azure, GKE Workload Identity on GCP. Pods using that ServiceAccount get that specific identity\'s short-lived credentials. Per-pod identity matters because the alternative is that every pod on a node shares the node role, which forces that one role to be the union of every permission any pod needs — a broad grant where compromising any single pod yields all of it. Binding identity to the ServiceAccount restores least privilege inside the cluster: the payments pod can reach the payments queue and nothing the reporting pod on the same node can do.',
        aHi: 'EC2 par, ek instance profile ek IAM role instance se attach karta hai, aur SDK us role ke liye temporary credentials Instance Metadata Service se retrieve karta hai; aap IMDSv2 require karte ho taaki credentials read hone se pehle ek session token chahiye. ECS par, har task definition ke paas application ki calls ke liye ek task role aur image pull aur logs write karne ke liye ek separate task execution role hai. In sab cases mein platform credentials inject karta hai, unhe automatically rotate karta hai. Kubernetes mein node ki apni identity hai, par aap nahi chahte har pod node ki permissions inherit kare, to aap ek Kubernetes ServiceAccount ko ek cloud identity se bind karte ho: AWS par IRSA ya EKS Pod Identity, Azure par AKS Workload Identity. Per-pod identity matter karti hai kyunki alternative ye hai ki ek node par har pod node role share karta hai, jo us ek role ko har permission ka union banne ke liye force karta hai.',
      },
      {
        q: 'Explain OIDC federation for CI. What does it replace, and where does the security actually live?',
        qHi: 'CI ke liye OIDC federation samjhao. Ye kya replace karta hai, aur security actually kahaan rehti hai?',
        a: 'OIDC federation lets an identity that lives outside the cloud — a GitHub Actions workflow, a GitLab pipeline, another cloud — authenticate to the cloud without any pre-shared secret. The external OpenID Connect provider issues a short-lived signed JWT describing the caller: which repository, which branch or tag or environment, which workflow. The cloud is configured to trust that provider\'s issuer and to exchange a valid JWT for its own short-lived credentials, subject to conditions on the token\'s claims. For GitHub Actions to AWS: you register an IAM OIDC provider for token.actions.githubusercontent.com, create a role whose trust policy requires the aud claim to be sts.amazonaws.com and the sub claim to match a specific pattern, and in the workflow grant id-token: write and use configure-aws-credentials with the role ARN — the action fetches the token, presents it to STS, and gets a role session for about an hour. It replaces a long-lived access key stored in GitHub secrets, which was a static credential that worked forever from anywhere until someone rotated it. The security now lives entirely in the trust policy\'s condition on the sub claim. A wildcard like repo:acme/web:* trusts every branch and every pull request including fork PRs, which is nearly as bad as the key. The correct form pins sub to a specific branch, a tag pattern, or best a GitHub Environment with required reviewers, so only an approved deployment context can assume the role. Azure works the same way with a federated credential on a managed identity.',
        aHi: 'OIDC federation ek identity ko jo cloud ke bahar rehti hai — ek GitHub Actions workflow, ek GitLab pipeline — use cloud ko authenticate karne deti hai bina kisi pre-shared secret ke. External OpenID Connect provider caller ko describe karta hua ek short-lived signed JWT issue karta hai. Cloud us provider ke issuer par trust karne ke liye configured hai. GitHub Actions AWS par ke liye: aap token.actions.githubusercontent.com ke liye ek IAM OIDC provider register karte ho, ek role banate ho jiski trust policy aud claim ko sts.amazonaws.com aur sub claim ko ek specific pattern match karne ki require karti hai. Ye GitHub secrets mein stored ek long-lived access key replace karta hai. Security ab poori tarah trust policy ki sub claim par condition mein rehti hai. Ek wildcard jaise repo:acme/web:* har branch aur har pull request par trust karta hai. Correct form sub ko ek specific branch, ek tag pattern, ya best ek GitHub Environment par pin karta hai.',
      },
      {
        q: 'What is the confused-deputy problem in cross-account access, and how does sts:ExternalId solve it?',
        qHi: 'Cross-account access mein confused-deputy problem kya hai, aur sts:ExternalId ise kaise solve karta hai?',
        a: 'When you create a role that a third-party service can assume — a monitoring vendor, a data platform, a backup provider — you are trusting that service\'s system to only assume your role when acting on your behalf. But that service assumes roles for all of its customers using shared infrastructure, and the only input it has from its side is a role ARN that a customer entered into its configuration. The confused-deputy attack exploits this: an attacker who is also a customer of that vendor enters *your* role ARN into their own vendor configuration, and the vendor\'s system — the deputy — assumes your role, because it has no way to tell that the ARN belongs to you and not to the attacker. If your role is over-scoped, the attacker now has that access. The sts:ExternalId condition on the trust policy solves it by requiring a secret string, unique to your relationship with the vendor, to be presented on every AssumeRole call. The vendor stores your external ID associated with your account and passes it whenever it acts for you. An attacker who enters your ARN cannot also make the vendor pass an external ID they were never issued, so the assumption fails. Alongside the external ID you should scope the trust to the vendor\'s specific role rather than their whole account, and scope the role\'s permissions to exactly what the integration needs, so a confused-deputy assumption that somehow succeeded still yields almost nothing.',
        aHi: 'Jab aap ek role banate ho jise ek third-party service assume kar sakti hai — ek monitoring vendor, ek data platform — aap us service ke system par trust kar rahe ho ki wo aapki role sirf tab assume kare jab aapki taraf se act kar rahi ho. Par wo service apne saare customers ke liye shared infrastructure use karke roles assume karti hai, aur iski side se ekmatra input ek role ARN hai jo ek customer ne iski configuration mein enter kiya. Confused-deputy attack ise exploit karta hai: ek attacker jo us vendor ka bhi customer hai apni khud ki vendor configuration mein *aapka* role ARN enter karta hai, aur vendor ka system — deputy — aapki role assume karta hai. sts:ExternalId condition ise solve karti hai ek secret string require karke, aapke vendor ke saath relationship ke unique, har AssumeRole call par present kiya jaana. Ek attacker jo aapka ARN enter karta hai vendor ko ek external ID pass nahi karwa sakta jo unhe kabhi issued nahi kiya gaya.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list the workload-identity mechanism for EC2, ECS, Lambda, and Kubernetes (AWS + Azure + GCP), and explain IMDSv2.',
        taskHi: 'Ek comment mein, EC2, ECS, Lambda, aur Kubernetes ke liye workload-identity mechanism list karo.',
        hint: 'GOAL: no long-lived credentials anywhere — the platform vouches for the workload, which exchanges that for SHORT-LIVED auto-rotating creds. EC2: an INSTANCE PROFILE wraps an IAM role; the SDK reads temp creds from the INSTANCE METADATA SERVICE (link-local `169.254.169.254`). ECS: a TASK ROLE per task definition (the app\'s calls) + a separate TASK EXECUTION ROLE (the ECS agent pulling the image, writing logs). LAMBDA: the EXECUTION ROLE. App Runner / Beanstalk: an instance/service role. KUBERNETES — bind a K8s ServiceAccount to a cloud identity so it is per-APP not per-NODE: AWS = IRSA or EKS Pod Identity (SA annotated with a role ARN; pods using that SA get the role\'s creds via a projected token); Azure = AKS Workload Identity (SA ⇄ a user-assigned managed identity via an OIDC issuer + a FederatedIdentityCredential whose subject = `system:serviceaccount:<ns>:<name>`); GCP = GKE Workload Identity (K8s SA ⇄ a Google service account). Why per-pod: without it, every pod inherits the NODE role → that one role must be the UNION of every pod\'s permissions → compromising any pod yields all of it. IMDSv2: the metadata service hands out the instance role\'s LIVE credentials to anything on the instance that asks. IMDSv1 answers a plain `GET` → an SSRF (attacker controls a URL the server fetches) can point at `169.254.169.254/latest/meta-data/iam/security-credentials/<role>` and steal them (the 2019 Capital One breach). IMDSv2 requires a `PUT` first to get a session token, then that token on the `GET` — most SSRF primitives only do `GET`, so this closes it. Also set `http_put_response_hop_limit = 1` so the token can\'t route to a container. Require it account-wide; it is NOT a substitute for least privilege on the role.',
        hintHi: 'GOAL: kahin koi long-lived credentials nahi. EC2: ek INSTANCE PROFILE ek IAM role wrap karta hai; SDK INSTANCE METADATA SERVICE (`169.254.169.254`) se temp creds read karta hai. ECS: per task definition ek TASK ROLE + ek separate TASK EXECUTION ROLE. LAMBDA: EXECUTION ROLE. KUBERNETES — ek K8s ServiceAccount ko ek cloud identity se bind karo per-APP: AWS = IRSA / EKS Pod Identity; Azure = AKS Workload Identity (SA ⇄ user-assigned managed identity ek FederatedIdentityCredential ke through); GCP = GKE Workload Identity. Per-pod kyun: iske bina har pod NODE role inherit karta hai → wo role har pod ki permissions ka UNION. IMDSv2: metadata service instance role ke LIVE credentials deta hai. IMDSv1 ek plain `GET` answer karta hai → ek SSRF unhe steal kar sakta hai (2019 Capital One breach). IMDSv2 pehle ek `PUT` require karta hai session token ke liye. `http_put_response_hop_limit = 1` set karo. Account-wide require karo.',
      },
      {
        task: 'In a comment, walk through setting up GitHub Actions → AWS OIDC, and explain why the `sub` claim condition is the entire security boundary.',
        taskHi: 'Ek comment mein, GitHub Actions → AWS OIDC set up karna walk karo.',
        hint: 'SETUP: (1) ONE-TIME: create an IAM OIDC identity provider for `https://token.actions.githubusercontent.com` with client-id `sts.amazonaws.com`. (2) Create an IAM ROLE whose TRUST POLICY: `Principal: { Federated: <the oidc-provider ARN> }`, `Action: sts:AssumeRoleWithWebIdentity`, `Condition.StringEquals`: `token.actions.githubusercontent.com:aud` = `sts.amazonaws.com` AND `token.actions.githubusercontent.com:sub` = a PINNED pattern. (3) In the workflow: `permissions: { id-token: write, contents: read }`, then `uses: aws-actions/configure-aws-credentials@v4` `with: { role-to-assume: <role ARN>, aws-region: ... }`. The action fetches the OIDC JWT from GitHub, calls STS with it, gets back a ~1-hour role session. NOTHING in GitHub secrets. WHY `sub` IS THE WHOLE BOUNDARY: OIDC removed the static key but replaced "who holds the key" with "which external contexts does the trust policy accept". The `sub` claim IS that context. `repo:acme/web:*` (StringLike / wildcard) matches EVERY workflow run in the repo — every branch, every tag, AND every pull-request build INCLUDING fork PRs from people not on your team → any of them can assume your deploy role. PIN IT: strongest = `repo:acme/web:environment:production` (only a job that declared `environment: production` — a protected GitHub Environment with required reviewers that fork PRs cannot target); also fine = `repo:acme/web:ref:refs/heads/main` (main only) or `repo:acme/web:ref:refs/tags/v*` (release tags). NEVER `repo:acme/web:*` or `repo:acme/*:*`. Use a SEPARATE role per environment (`:environment:staging` → a staging-only role) so a staging deploy cannot touch prod. Azure: the same idea — a FederatedIdentityCredential on a user-assigned managed identity with `subject = repo:acme/web:environment:production`, then `azure/login@v2` with client-id + tenant-id + subscription-id (all non-secret).',
        hintHi: 'SETUP: (1) ONE-TIME: `https://token.actions.githubusercontent.com` ke liye ek IAM OIDC identity provider banao. (2) Ek IAM ROLE banao jiski TRUST POLICY: `Action: sts:AssumeRoleWithWebIdentity`, `Condition`: `:aud` = `sts.amazonaws.com` AUR `:sub` = ek PINNED pattern. (3) workflow mein: `permissions: { id-token: write }`, phir `uses: aws-actions/configure-aws-credentials@v4`. GitHub secrets mein KUCH NAHI. `sub` PURA BOUNDARY KYUN: OIDC ne static key hatai par "kaun key rakhta hai" ko "trust policy kaun se contexts accept karti hai" se replace kiya. `repo:acme/web:*` HAR workflow run match karta hai — har branch, har PR build INCLUDING fork PRs. PIN KARO: strongest = `repo:acme/web:environment:production`; bhi theek = `repo:acme/web:ref:refs/heads/main`. KABHI `repo:acme/web:*` nahi. Har environment ke liye SEPARATE role.',
      },
      {
        task: 'In a comment, explain cross-account role assumption and the confused-deputy problem, and describe Azure managed identities (system- vs user-assigned).',
        taskHi: 'Ek comment mein, cross-account role assumption aur confused-deputy problem samjhao.',
        hint: 'CROSS-ACCOUNT: to let a principal in account A act in account B, create a ROLE IN B whose TRUST POLICY names the A principal as allowed to `sts:AssumeRole`; A calls AssumeRole against that ARN and gets B\'s temp creds for the session. Uses: a central logging account written by many workload accounts, an audit account reading org-wide, a tooling account deploying into env accounts. CONFUSED DEPUTY: when the assuming principal is a THIRD-PARTY SERVICE (a monitoring vendor, a data platform), that service assumes roles for ALL its customers on shared infrastructure, and its only input is a role ARN a customer typed into its config. An attacker who is ALSO a customer of that vendor types YOUR role ARN into THEIR vendor config → the vendor\'s system (the "deputy") assumes YOUR role, because it cannot tell the ARN is yours not the attacker\'s → if your role is over-scoped, the attacker now has that access. FIX: `sts:ExternalId` condition on the trust policy — a secret string unique to your relationship with the vendor, which the vendor stores against your account and passes on every AssumeRole for you; an attacker who typed your ARN cannot also make the vendor pass an ExternalId they were never issued. ALSO: scope `Principal` to the vendor\'s SPECIFIC collector role (not their `:root`), and scope the role\'s PERMISSIONS to read-only on exactly what they need. AZURE MANAGED IDENTITIES (= the instance/task-role equivalent, no secret; the resource gets tokens from the Azure IMDS endpoint): SYSTEM-ASSIGNED = created WITH one resource, 1:1, shares its lifecycle (deleted with it), cannot be shared — for a one-to-one identity that should not outlive its resource. USER-ASSIGNED = a standalone resource you create once and attach to MANY resources (VMs, App Service, AKS pods, Container Apps); it SURVIVES them — for a shared identity or one that must persist across resource recreation. Grant either permissions with a normal role assignment (Lesson 3) at a scope.',
        hintHi: 'CROSS-ACCOUNT: account A mein ek principal ko account B mein act karne dene ke liye, B MEIN EK ROLE banao jiski TRUST POLICY A principal ko `sts:AssumeRole` allowed name karti hai. CONFUSED DEPUTY: jab assuming principal ek THIRD-PARTY SERVICE hai, wo service apne SAARE customers ke liye shared infrastructure par roles assume karti hai, aur iska ekmatra input ek role ARN hai jo ek customer ne type kiya. Ek attacker jo us vendor ka bhi customer hai APNI vendor config mein AAPKA role ARN type karta hai → vendor ka system AAPKI role assume karta hai. FIX: `sts:ExternalId` condition — ek secret string aapke vendor ke saath relationship ke unique. ALSO: `Principal` ko vendor ke SPECIFIC role par scope karo, permissions read-only par. AZURE MANAGED IDENTITIES: SYSTEM-ASSIGNED = ek resource ke saath 1:1, iska lifecycle share karti hai, share nahi ho sakti. USER-ASSIGNED = ek standalone resource, KAI resources se attach, unhe SURVIVE karti hai.',
      },
    ],

    keyTakeaways: [
      'THE GOAL is no long-lived credentials anywhere. Workloads get SHORT-LIVED auto-rotated creds from the platform: EC2 → an INSTANCE PROFILE (role) read via the Instance Metadata Service; ECS → a TASK ROLE (+ a separate task EXECUTION role); Lambda → the EXECUTION ROLE. Require IMDSv2 (`http_tokens = required`, hop-limit 1) — IMDSv1 lets an SSRF steal the role\'s live creds (the Capital One breach).',
      'PER-POD IDENTITY in Kubernetes binds a K8s ServiceAccount to a cloud identity so each app gets exactly its own permissions, not the node\'s: AWS IRSA / EKS Pod Identity, Azure AKS Workload Identity (via a federated credential), GKE Workload Identity. Without it every pod inherits the node role, which must then be the union of every pod\'s needs.',
      'CROSS-ACCOUNT: account B\'s role has a TRUST POLICY naming an account-A principal; A calls `sts:AssumeRole`. For a THIRD PARTY assuming your role, REQUIRE an `sts:ExternalId` (a shared secret) to defeat the CONFUSED-DEPUTY attack, scope the trust to their specific role (not `:root`), and scope the role\'s permissions tightly.',
      'OIDC FEDERATION lets CI (GitHub Actions, GitLab, …) or another cloud authenticate with a short-lived signed JWT instead of a stored key. GitHub → AWS: an IAM OIDC provider for `token.actions.githubusercontent.com` + a role whose trust policy checks `aud = sts.amazonaws.com` and `sub`. The `sub` CONDITION IS THE SECURITY BOUNDARY — never `repo:org/*:*`; pin it to a branch, a tag pattern, or (best) `environment:production` with required reviewers. Azure: `azure/login@v2` + a federated credential.',
      'AZURE MANAGED IDENTITIES are the instance/task-role equivalent — no secret, tokens from the Azure IMDS endpoint. SYSTEM-ASSIGNED: 1:1 with a resource, shares its lifecycle, not shareable. USER-ASSIGNED: standalone, attach to many resources, survives them. Grant permissions with a normal role assignment at a scope (Lesson 3).',
    ],
    keyTakeawaysHi: [
      'GOAL kahin koi long-lived credentials nahi hai. Workloads platform se SHORT-LIVED auto-rotated creds paate hain: EC2 → ek INSTANCE PROFILE (role) Instance Metadata Service ke through read; ECS → ek TASK ROLE (+ ek separate task EXECUTION role); Lambda → EXECUTION ROLE. IMDSv2 require karo (`http_tokens = required`, hop-limit 1) — IMDSv1 ek SSRF ko role ki live creds steal karne deta hai (Capital One breach).',
      'PER-POD IDENTITY Kubernetes mein ek K8s ServiceAccount ko ek cloud identity se bind karti hai taaki har app ko exactly iski apni permissions milein, node ki nahi: AWS IRSA / EKS Pod Identity, Azure AKS Workload Identity, GKE Workload Identity. Iske bina har pod node role inherit karta hai.',
      'CROSS-ACCOUNT: account B ke role ki ek TRUST POLICY ek account-A principal ko name karti hai; A `sts:AssumeRole` call karta hai. Ek THIRD PARTY ke liye jo aapki role assume karta hai, ek `sts:ExternalId` (ek shared secret) REQUIRE karo CONFUSED-DEPUTY attack defeat karne ke liye, trust ko unke specific role par scope karo (`:root` nahi).',
      'OIDC FEDERATION CI (GitHub Actions, GitLab, …) ya doosre cloud ko ek short-lived signed JWT se authenticate karne deti hai ek stored key ke bajaay. GitHub → AWS: `token.actions.githubusercontent.com` ke liye ek IAM OIDC provider + ek role jiski trust policy `aud = sts.amazonaws.com` aur `sub` check karti hai. `sub` CONDITION SECURITY BOUNDARY HAI — kabhi `repo:org/*:*` nahi; ise ek branch, ek tag pattern, ya (best) `environment:production` par pin karo.',
      'AZURE MANAGED IDENTITIES instance/task-role equivalent hain — koi secret nahi, tokens Azure IMDS endpoint se. SYSTEM-ASSIGNED: ek resource ke saath 1:1, iska lifecycle share karti hai, shareable nahi. USER-ASSIGNED: standalone, kई resources se attach, unhe survive karti hai. Permissions ek scope par ek normal role assignment se grant karo (Lesson 3).',
    ],
  },

  {
    slug: 'ops-instance-types-pricing-models-and-autoscaling',
    title: 'Instance Types, Pricing Models & Autoscaling',
    titleHi: 'Instance Types, Pricing Models Aur Autoscaling',
    description:
      'Cloud compute comes in families tuned for different ratios of CPU, memory, storage and accelerators, and in several pricing models that trade commitment and interruptibility for large discounts. Autoscaling groups then add and remove capacity automatically against a scaling policy. Getting the family, the size, the pricing mix and the scaling signal right is most of what "using the cloud efficiently" means.',
    descriptionHi:
      'Cloud compute families mein aata hai jo CPU, memory, storage aur accelerators ke alag ratios ke liye tuned hain, aur kई pricing models mein jo commitment aur interruptibility ko badhe discounts ke liye trade karti hain. Autoscaling groups phir ek scaling policy ke against capacity automatically add aur remove karti hain. Family, size, pricing mix aur scaling signal sahi karna zyadaatar wo hai jo "cloud ko efficiently use karna" ka matlab hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**Hiring a fleet of vans.** Vans come in shapes: a small city van (compute-optimised), a big box van for bulky-but-light loads (memory-optimised), a flatbed for heavy machinery (storage/accelerated). You pick the shape that fits the cargo, not the biggest one. On price: pay full day-rate for a van you hail on the spot (on-demand); commit to keeping three vans for a year and the rate drops a third (reserved / savings plan); or take whatever spare van the depot has right now at a 70% discount, on the condition they can recall it with two minutes\' notice (spot). And instead of guessing how many vans you need at 9am, a dispatcher watches the loading dock and calls in or sends home vans as the queue grows and shrinks (autoscaling).',
      hi: '**Ek fleet of vans hire karna.** Vans shapes mein aati hain: ek small city van (compute-optimised), bulky-but-light loads ke liye ek big box van (memory-optimised), heavy machinery ke liye ek flatbed (storage/accelerated). Aap wo shape pick karte ho jo cargo fit kare, sabse badhi nahi. Price par: ek van ke liye full day-rate pay karo jise aap spot par hail karte ho (on-demand); ek saal ke liye teen vans rakhne ke liye commit karo aur rate ek-tihai gir jaata hai (reserved / savings plan); ya jo bhi spare van depot ke paas abhi hai le lo 70% discount par, is condition par ki wo ise do minute ke notice ke saath recall kar sakte hain (spot). Aur 9am par kitni vans chahiye guess karne ke bajaay, ek dispatcher loading dock dekhta hai aur vans call in ya send home karta hai jaise queue badhti aur ghatti hai (autoscaling).',
    },

    simple: `**INSTANCE FAMILIES** (AWS letter / Azure series — ratio of CPU:memory:extras):
\`\`\`
GENERAL PURPOSE   ~1 vCPU : 4 GB      web/app servers, small DBs, most things
                  AWS m-series (m7i, m7g)   Azure D-series (Dsv5)
COMPUTE OPTIMISED  ~1 vCPU : 2 GB      batch, encoding, game servers, HPC, CI
                  AWS c-series (c7i, c7g)   Azure F-series (Fsv2)
MEMORY OPTIMISED   ~1 vCPU : 8-16 GB   in-memory DBs, caches, big JVM heaps, analytics
                  AWS r/x/u-series          Azure E/M-series
STORAGE OPTIMISED  huge fast local NVMe  data warehouses, big Elastic/Kafka, log stores
                  AWS i/d-series            Azure L-series
ACCELERATED       GPU / inference chips   ML training + inference, rendering, transcode
                  AWS p/g/inf/trn          Azure N-series
BURSTABLE         cheap, earns CPU credits when idle, throttles when spent
                  AWS t-series (t3, t4g)    Azure B-series   -> dev, low-traffic, spiky
\`\`\`
**\`g\` = ARM (Graviton) - ~20% cheaper + more efficient if your image is arm64.**
Size up/down within a family: \`.large\` -> \`.xlarge\` -> \`.2xlarge\` (linear price).

**PRICING MODELS** (biggest lever on the compute bill):
\`\`\`
ON-DEMAND      pay per second/hour, no commitment, full price. baseline + spikes.
SPOT           spare capacity at 60-90% off; the cloud can RECLAIM it with ~2 min
               notice. for fault-tolerant, interruptible, stateless, retryable work:
               batch, CI runners, big-data, stateless web behind an LB with mixed
               capacity, dev. NOT for: a stateful primary, a job that can't checkpoint.
RESERVED /     commit to a specific instance type + region for 1 or 3 years -> ~40-60% off.
CAPACITY RES.  less flexible. Azure "Reserved VM Instances".
SAVINGS PLANS  commit to $X/hour of compute spend for 1/3 years -> ~30-65% off, and it
(AWS) /        applies flexibly across instance families, sizes, regions, even Fargate/
COMMITTED USE  Lambda. usually the better commitment vehicle now. Azure/GCP have equivalents.
\`\`\`
**Typical mix:** commitment (Savings Plan / reserved) for the steady baseline +
on-demand for the predictable daytime bump + spot for the burst/batch on top.

**AUTOSCALING** — an Auto Scaling group / VM Scale Set adds & removes instances
against a policy:
\`\`\`
TARGET TRACKING   "keep average CPU at 50%" / "keep 1000 req per instance" - the ASG
                  computes the delta. the default, and usually right.
STEP SCALING      "if CPU > 70% for 3 min, +2 instances; if > 90%, +4" - for known
                  non-linear responses.
SCHEDULED         "min 20 at 08:00 Mon-Fri, min 4 otherwise" - for known cycles.
PREDICTIVE        ML forecasts the daily/weekly curve and pre-scales ahead of it.
\`\`\`
Also set: a WARM-UP / cooldown (don't count a booting instance), a health check
(replace unhealthy), and min/MAX (the max is your cost ceiling AND your outage
risk if a real spike hits it).`,

    simpleHi: `**INSTANCE FAMILIES** (AWS letter / Azure series — CPU:memory:extras ka ratio):
\`\`\`
GENERAL PURPOSE   ~1 vCPU : 4 GB      web/app servers, chhote DBs, zyadaatar cheezen
                  AWS m-series (m7i, m7g)   Azure D-series (Dsv5)
COMPUTE OPTIMISED  ~1 vCPU : 2 GB      batch, encoding, game servers, HPC, CI
                  AWS c-series (c7i, c7g)   Azure F-series (Fsv2)
MEMORY OPTIMISED   ~1 vCPU : 8-16 GB   in-memory DBs, caches, badhे JVM heaps, analytics
                  AWS r/x/u-series          Azure E/M-series
STORAGE OPTIMISED  huge fast local NVMe  data warehouses, badha Elastic/Kafka, log stores
                  AWS i/d-series            Azure L-series
ACCELERATED       GPU / inference chips   ML training + inference, rendering, transcode
                  AWS p/g/inf/trn          Azure N-series
BURSTABLE         sasta, idle hone par CPU credits earn karta hai, spent hone par throttle
                  AWS t-series (t3, t4g)    Azure B-series   -> dev, low-traffic, spiky
\`\`\`
**\`g\` = ARM (Graviton) - ~20% sasta + zyada efficient agar aapka image arm64 hai.**
Ek family ke andar size up/down: \`.large\` -> \`.xlarge\` -> \`.2xlarge\` (linear price).

**PRICING MODELS** (compute bill par sabse badha lever):
\`\`\`
ON-DEMAND      per second/hour pay karo, koi commitment nahi, full price. baseline + spikes.
SPOT           spare capacity 60-90% off; cloud ise ~2 min notice ke saath RECLAIM kar
               sakta hai. fault-tolerant, interruptible, stateless, retryable work ke liye:
               batch, CI runners, big-data, ek LB ke peeche stateless web mixed capacity ke
               saath, dev. NOT for: ek stateful primary, ek job jo checkpoint nahi kar sakta.
RESERVED /     ek specific instance type + region ke liye 1 ya 3 saal commit -> ~40-60% off.
CAPACITY RES.  kam flexible. Azure "Reserved VM Instances".
SAVINGS PLANS  1/3 saal ke liye $X/hour of compute spend commit -> ~30-65% off, aur ye
(AWS) /        instance families, sizes, regions, even Fargate/Lambda ke across flexibly
COMMITTED USE  apply karta hai. ab aam taur par better commitment vehicle. Azure/GCP ke equivalents.
\`\`\`
**Typical mix:** steady baseline ke liye commitment (Savings Plan / reserved) +
predictable daytime bump ke liye on-demand + upar burst/batch ke liye spot.

**AUTOSCALING** — ek Auto Scaling group / VM Scale Set ek policy ke against
instances add & remove karti hai:
\`\`\`
TARGET TRACKING   "average CPU 50% par rakho" / "per instance 1000 req rakho" - ASG
                  delta compute karta hai. default, aur aam taur par sahi.
STEP SCALING      "agar CPU > 70% 3 min ke liye, +2 instances; agar > 90%, +4" - known
                  non-linear responses ke liye.
SCHEDULED         "min 20 at 08:00 Mon-Fri, min 4 otherwise" - known cycles ke liye.
PREDICTIVE        ML daily/weekly curve forecast karta hai aur uske aage pre-scale karta hai.
\`\`\`
Bhi set karo: ek WARM-UP / cooldown, ek health check, aur min/MAX (max aapka cost
ceiling HAI AUR aapka outage risk agar ek real spike ise hit kare).`,

    content: `## Instance families

Cloud VMs are grouped into **families** that fix the ratio between vCPU, memory, and other resources so you can pick a shape that matches your workload instead of over-buying one dimension to get enough of another.

- **General purpose** (AWS \`m\`, Azure D-series) sit at roughly 1 vCPU to 4 GB of memory and are the right default for web and application servers, small databases, and most workloads whose resource profile you have not specifically measured.
- **Compute optimised** (AWS \`c\`, Azure F-series) shift the ratio toward CPU, around 1 vCPU to 2 GB, for batch processing, media encoding, game servers, scientific computing, and CI runners.
- **Memory optimised** (AWS \`r\`, \`x\`, \`u\`; Azure E, M) go the other way, 8 to 16 GB or more per vCPU, for in-memory databases, large caches, big JVM heaps, and in-memory analytics.
- **Storage optimised** (AWS \`i\`, \`d\`; Azure L) attach large, fast local NVMe storage for data warehouses, large Elasticsearch or Kafka clusters, and high-throughput log stores.
- **Accelerated** (AWS \`p\`, \`g\`, \`inf\`, \`trn\`; Azure N-series) add GPUs or purpose-built AI chips for machine-learning training and inference, rendering, and transcoding.
- **Burstable** (AWS \`t\`, Azure B-series) are cheap instances that accumulate CPU credits while idle and can burst above their baseline by spending them, throttling to the baseline when credits run out. They fit development environments, low-traffic services, and spiky workloads where sustained full CPU is rare — and are a trap for anything that runs hot continuously, because it will run out of credits and be throttled.

Within a family you scale by size — \`.large\`, \`.xlarge\`, \`.2xlarge\` — with price scaling roughly linearly. A suffix of \`g\` on AWS (\`m7g\`, \`c7g\`) means the instance runs on **Graviton**, AWS\'s ARM processors, which are typically around 20 percent cheaper and more power-efficient for the same work — worth taking whenever your container images or binaries are built for \`arm64\`.

## Pricing models

The pricing model is the single largest lever on the compute bill, often a 3-4x difference for the same instances.

- **On-demand** is pay-as-you-go per second or hour with no commitment, at the full rate. It is the right choice for unpredictable load, short-lived experiments, and the spiky top of a workload where you cannot commit.
- **Spot instances** are spare capacity the cloud sells at a 60-90 percent discount on the condition that it can reclaim the instance with about two minutes\' notice when it needs the capacity back. Spot is ideal for work that is fault-tolerant and interruptible: batch and big-data jobs that checkpoint, CI runners, stateless web servers behind a load balancer where a mix of spot and on-demand keeps the service up through reclamations, and development. It is wrong for a stateful database primary, a job that cannot checkpoint and would have to restart from scratch, or anything where a two-minute eviction is an outage.
- **Reserved instances / capacity reservations** are a commitment to a specific instance type in a specific region for one or three years, in exchange for roughly 40-60 percent off. They are the least flexible commitment.
- **Savings Plans** (AWS) and **committed use discounts** (GCP), and Azure\'s reservation model with instance-size flexibility, are a commitment to a dollar-per-hour level of compute spend for one or three years, for roughly 30-65 percent off, and the discount applies flexibly across instance families, sizes, regions, and even Fargate and Lambda. For most organisations a Savings Plan is now the better commitment vehicle than classic reserved instances because it does not lock you to a specific instance type.

The standard approach is a **mix**: cover the steady 24/7 baseline with a commitment (a Savings Plan or reservation sized to the trough of your usage), run the predictable daytime increase on on-demand, and put the burst and batch work on top on spot. This gets most of the discount without over-committing to capacity you might not use.

## Autoscaling

An **Auto Scaling group** (AWS) or **VM Scale Set** (Azure) manages a pool of identical instances, adding and removing them automatically according to a **scaling policy** and a min/max range. The policy types:

- **Target tracking** keeps a metric at a target value — "average CPU at 50 percent", "1000 requests per instance", "an SQS queue depth of 100 per instance" — and the group computes how many instances to add or remove to hit it. This is the default and is correct for most services.
- **Step scaling** defines discrete steps — "if CPU is above 70 percent for three minutes add two instances; if above 90 percent add four" — for workloads with a known non-linear relationship between the metric and the capacity needed.
- **Scheduled scaling** sets the min and desired capacity by time — "minimum 20 instances from 08:00 to 20:00 on weekdays, minimum 4 otherwise" — for workloads with a predictable daily or weekly cycle, often layered under a reactive policy as a floor.
- **Predictive scaling** uses a forecast of the recurring load curve to add capacity *before* the demand arrives, avoiding the lag where reactive scaling is always chasing a rise.

Around the policy you configure a few things that matter as much as the policy itself. A **warm-up** or cooldown period tells the group to ignore a newly launched instance\'s metrics until it has finished booting and warming caches, so it does not over-scale while capacity is on the way. A **health check** — an ELB or application health check, not just "is the VM running" — lets the group replace instances that are up but not serving. And the **minimum and maximum** bound the group: the minimum is your always-on floor, and the maximum is simultaneously your cost ceiling and, if a genuine spike hits it, your outage — a maximum set too low to protect the budget will cap you below the traffic you actually need to serve.`,

    contentHi: `## Instance families

Cloud VMs **families** mein grouped hain jo vCPU, memory, aur doosre resources ke beech ratio fix karti hain taaki aap ek shape pick kar sako jo aapke workload se match kare.
- **General purpose** (AWS \`m\`, Azure D-series) roughly 1 vCPU se 4 GB memory par baithti hain aur web aur application servers, chhote databases, aur zyadaatar workloads ke liye sahi default hain.
- **Compute optimised** (AWS \`c\`, Azure F-series) ratio ko CPU ki taraf shift karti hain, batch processing, media encoding, game servers, aur CI runners ke liye.
- **Memory optimised** (AWS \`r\`, \`x\`, \`u\`; Azure E, M) doosri taraf jaati hain, per vCPU 8 se 16 GB ya zyada, in-memory databases, badhे caches ke liye.
- **Storage optimised** (AWS \`i\`, \`d\`; Azure L) badha, fast local NVMe storage attach karti hain data warehouses ke liye.
- **Accelerated** (AWS \`p\`, \`g\`, \`inf\`, \`trn\`; Azure N-series) GPUs ya purpose-built AI chips add karti hain machine-learning training aur inference ke liye.
- **Burstable** (AWS \`t\`, Azure B-series) sasti instances hain jo idle hone par CPU credits accumulate karti hain. Development environments, low-traffic services ke liye fit hain — aur kisi bhi cheez ke liye ek trap jo continuously hot chalta hai.

Ek family ke andar aap size se scale karte ho. AWS par ek \`g\` suffix (\`m7g\`, \`c7g\`) ka matlab instance **Graviton** par chalta hai, AWS ke ARM processors, jo typically ~20 percent saste aur zyada power-efficient hain.

## Pricing models

Pricing model compute bill par sabse badha single lever hai, aksar same instances ke liye ek 3-4x difference.
- **On-demand** per second ya hour pay-as-you-go hai bina commitment ke, full rate par.
- **Spot instances** spare capacity hain jo cloud ek 60-90 percent discount par bechta hai is condition par ki wo instance ko ~2 min notice ke saath reclaim kar sakta hai. Spot fault-tolerant aur interruptible work ke liye ideal hai. Ye ek stateful database primary ke liye galat hai.
- **Reserved instances** ek specific instance type ke liye ek specific region mein 1 ya 3 saal ke liye ek commitment hain, ~40-60 percent off ke exchange mein.
- **Savings Plans** (AWS) aur **committed use discounts** (GCP) 1 ya 3 saal ke liye compute spend ke ek dollar-per-hour level ke liye ek commitment hain, ~30-65 percent off ke liye, aur discount instance families, sizes, regions, aur even Fargate aur Lambda ke across flexibly apply hota hai.

Standard approach ek **mix** hai: steady 24/7 baseline ko ek commitment se cover karo, predictable daytime increase ko on-demand par chalao, aur burst aur batch work ko upar spot par rakho.

## Autoscaling

Ek **Auto Scaling group** (AWS) ya **VM Scale Set** (Azure) identical instances ka ek pool manage karti hai, ek **scaling policy** aur ek min/max range ke according unhe automatically add aur remove karti hai:
- **Target tracking** ek metric ko ek target value par rakhti hai — "average CPU 50 percent par". Ye default hai aur zyadaatar services ke liye sahi hai.
- **Step scaling** discrete steps define karti hai.
- **Scheduled scaling** min aur desired capacity ko time se set karti hai — predictable daily ya weekly cycle wale workloads ke liye.
- **Predictive scaling** recurring load curve ka ek forecast use karti hai demand aane se pehle capacity add karne ke liye.

Policy ke aas-paas aap kuch cheezen configure karte ho jo policy jitni matter karti hain. Ek **warm-up** period group ko batata hai ki ek newly launched instance ke metrics ignore kare. Ek **health check** group ko instances replace karne deta hai jo up hain par serve nahi kar rahe. Aur **minimum aur maximum** group ko bound karte hain: maximum simultaneously aapka cost ceiling hai aur, agar ek genuine spike ise hit kare, aapka outage.`,

    examples: [
      {
        title: 'Right-sizing a workload: from an over-bought instance to the correct family and a commitment',
        titleHi: 'Ek workload right-size karna: ek over-bought instance se sahi family aur ek commitment tak',
        code: `# a message-processing service, running 24/7. current: 6 x m5.2xlarge (8 vCPU, 32 GB)
# on-demand, chosen because "we needed more memory once".

$ # what is it actually using? (CloudWatch / the agent, over 2 weeks)
  avg CPU:        68%      p95 CPU:  81%
  avg mem used:   5.1 GB   p95 mem:  6.3 GB      <- 32 GB provisioned, ~6 used
  network:        moderate, no local disk

# STEP 1  wrong family. it's CPU-bound, not memory-bound -> compute-optimised.
#   c7g.xlarge = 4 vCPU, 8 GB, Graviton. the app is a Go binary -> rebuild arm64.
#   at 68% avg on 8 vCPU it needs ~5.5 vCPU -> 2 x c7g.xlarge covers it with headroom
#   (test first: c7g is a newer gen + ARM, per-vCPU perf differs).

# STEP 2  count. 6 boxes were sized for the memory red herring. real need at
#   steady state: 3 x c7g.xlarge (12 vCPU total, ~75% target). autoscale 3 -> 8.

# STEP 3  pricing. this is a steady 24/7 baseline -> commit it.
#   3 x c7g.xlarge baseline -> a Compute Savings Plan covering that $/hr (~55% off)
#   the autoscale headroom (instances 4-8) -> on-demand, occasional
#   a batch reprocessing job that also runs -> a separate spot ASG

# BEFORE:  6 x m5.2xlarge on-demand   ~ $1,660/mo
# AFTER:   3 x c7g.xlarge (Savings Plan) + burst on-demand   ~ $210/mo
#          (~87% less, same throughput, now autoscaled instead of static)`,
        output: `Three independent mistakes compounded: the WRONG FAMILY (memory-optimised sizing
for a CPU-bound job), the WRONG COUNT (fixed at 6, sized for a one-time memory
need that never recurred), and the WRONG PRICING (on-demand for a workload that
runs every hour of every day). Fixing all three - measure, pick the family from
the real bottleneck, size to a target with autoscaling for the rest, and commit
the steady baseline - is where the large savings are.`,
        explain: 'A service running around the clock on six large general-purpose instances is examined against two weeks of real metrics. The instances average 68 percent CPU but use only about six of their thirty-two gigabytes of memory — the workload is CPU-bound, and the memory-heavy general-purpose family was chosen years earlier to solve a one-off memory problem that never recurred. The correction is three separate changes. First, the family: a compute-optimised instance with a CPU-to-memory ratio that matches the actual profile, on Graviton because the application is a Go binary that can be rebuilt for ARM, cutting per-vCPU cost. Second, the count: six was sized for the memory red herring; the real steady-state need is three instances at a sensible CPU target, with an autoscaling group handling the rest between three and eight. Third, the pricing: a workload that runs every hour of every day is a textbook case for a commitment, so the three-instance baseline goes under a Compute Savings Plan at roughly 55 percent off, the autoscale headroom stays on-demand because it is occasional, and a separate batch job moves to a spot group. The combined effect is an 87 percent reduction in cost for the same throughput, with the added benefit that capacity now tracks load instead of being a fixed guess.',
        explainHi: 'Ek service jo chhah large general-purpose instances par ghadi ke around chal rahi hai do hafton ke real metrics ke against examine ki jaati hai. Instances average 68 percent CPU karti hain par apne battees gigabyte memory mein se sirf lagbhag chhah use karti hain — workload CPU-bound hai, aur memory-heavy general-purpose family saal pehle ek one-off memory problem solve karne ke liye chuna gaya tha jo kabhi recur nahi hui. Correction teen separate changes hain. Pehle, family: ek compute-optimised instance ek CPU-to-memory ratio ke saath jo actual profile se match kare, Graviton par kyunki application ek Go binary hai. Doosre, count: chhah memory red herring ke liye sized tha; real steady-state need teen instances hai. Teesre, pricing: ek workload jo har din ke har hour chalta hai ek commitment ke liye ek textbook case hai. Combined effect same throughput ke liye cost mein ek 87 percent reduction hai.',
      },
      {
        title: 'A mixed-capacity autoscaling group: spot for the body, on-demand for the floor',
        titleHi: 'Ek mixed-capacity autoscaling group: body ke liye spot, floor ke liye on-demand',
        code: `# a stateless API behind an ALB. steady ~40 req/s daytime, ~8 at night,
# occasional 4x spikes. it can lose an instance any time (LB drains it, others cover).

# AWS: an ASG with a mixed instances policy
resource "aws_autoscaling_group" "api" {
  min_size = 2 ; max_size = 30 ; desired_capacity = 6
  vpc_zone_identifier = [subnet_1a, subnet_1b, subnet_1c]   # 3 AZs

  mixed_instances_policy {
    instances_distribution {
      on_demand_base_capacity                  = 2     # always >=2 on-demand (the floor)
      on_demand_percentage_above_base_capacity  = 20    # of the rest, 20% on-demand
      spot_allocation_strategy                  = "price-capacity-optimized"
    }
    launch_template {
      override { instance_type = "c7g.large" }           # <- several types so spot
      override { instance_type = "c7i.large" }           #    can always find capacity
      override { instance_type = "c6g.large" }
      override { instance_type = "m7g.large" }
    }
  }
  # + a target-tracking policy: keep ALB requests-per-target at 250
  # + capacity rebalancing: proactively replace a spot instance BEFORE it's reclaimed
}
# Azure equivalent: a VM Scale Set with  priority_mix { base_regular_count = 2,
#   regular_percentage_above_base = 20 }  + Spot eviction policy = Deallocate/Delete,
#   + autoscale rules on CPU or the ALB metric.

# steady state (6 instances): 2 on-demand + 4 spot  -> ~65% cheaper than all on-demand
# a spike to 24:  2 on-demand + ~3 more on-demand (20% of 22) + ~17 spot
# a spot reclamation: the ALB drains that target, target-tracking launches a replacement
#   from whichever of the 4 types has capacity. no user impact.`,
        output: `The pattern: a small ALWAYS-ON on-demand floor (on_demand_base_capacity) so the
service can never be fully evicted, a mostly-spot body for the bulk of capacity at
a large discount, several interchangeable instance types so spot can always source
capacity, and 3 AZs. Capacity rebalancing replaces a spot instance just BEFORE the
2-minute eviction rather than reacting to it. Result: ~60-70% off the compute bill
for a service that is genuinely interruptible, with no availability cost.`,
        explain: 'A stateless API behind a load balancer is a good fit for spot capacity because losing any single instance is a non-event — the load balancer drains it and the others absorb the traffic. The autoscaling group is configured with a mixed instances policy that expresses exactly that. An on-demand base capacity of two guarantees the service always has at least two instances that cannot be reclaimed, so a broad spot reclamation event can never take the service fully down. Above that base, only twenty percent of additional capacity is on-demand and the rest is spot. Several interchangeable instance types are listed so that when spot capacity for one type is scarce, the group can launch another — a single instance type would leave the group unable to scale during a shortage. The group spans three availability zones. A target-tracking policy keeps requests-per-instance at a set level, and capacity rebalancing proactively replaces a spot instance in the short window before AWS reclaims it, rather than reacting after it is gone. The Azure equivalent is a scale set with a priority mix and an eviction policy. The net effect is sixty to seventy percent off the compute cost of the service with no loss of availability, because the workload genuinely tolerates the interruptions spot imposes.',
        explainHi: 'Ek load balancer ke peeche ek stateless API spot capacity ke liye ek achha fit hai kyunki koi single instance khona ek non-event hai — load balancer ise drain karta hai aur doosre traffic absorb karte hain. Autoscaling group ek mixed instances policy ke saath configured hai jo exactly wo express karti hai. Do ki ek on-demand base capacity guarantee karti hai ki service ke paas hamesha kam se kam do instances hain jo reclaim nahi ho sakti. Us base ke upar, additional capacity ka sirf bees percent on-demand hai aur baaki spot hai. Kई interchangeable instance types listed hain taaki jab ek type ke liye spot capacity scarce hai, group doosra launch kar sake. Group teen availability zones span karti hai. Ek target-tracking policy requests-per-instance ko ek set level par rakhti hai, aur capacity rebalancing proactively ek spot instance ko replace karta hai us short window mein us se pehle AWS ise reclaim kare. Net effect service ke compute cost se saath se sattar percent off hai bina availability ke loss ke.',
      },
    ],

    mistakes: [
      {
        wrong: `# picking an instance by "it has enough of everything" and never revisiting it
# an app needs 6 GB of RAM -> someone picks r5.xlarge (4 vCPU, 32 GB) "to be safe".
# the app is single-threaded and uses ~1.2 vCPU. so you are paying for:
#   - 26 GB of RAM you will never touch
#   - 2.8 vCPU that idle
# 40 of these across the fleet = ~$8k/mo of air. and nobody looks again because
# "it's working".`,
        right: `# measure, then size to the REAL bottleneck with headroom:
#   $ aws cloudwatch get-metric-statistics ... CPUUtilization / mem_used_percent
#   $ # or Compute Optimizer / Azure Advisor - they recommend a size from history
#   6 GB RAM + ~1.2 vCPU sustained, single-threaded ->
#     m7g.large (2 vCPU, 8 GB) or even a burstable t4g.large if traffic is spiky
#   -> ~1/4 the cost, still 2x headroom on both axes
# put a quarterly "rightsizing" review on the calendar (or automate it):
#   Compute Optimizer findings -> a ticket per over-provisioned resource.`,
        why: 'Choosing an instance by making sure it has a comfortable surplus of every resource is how fleets end up paying for enormous amounts of idle capacity. A workload that needs six gigabytes of memory and just over one vCPU does not need a thirty-two-gigabyte, four-vCPU memory-optimised instance — it needs a small general-purpose or burstable instance sized to its actual profile with a reasonable margin. The "to be safe" instinct feels prudent but compounds: multiply a four-times-oversized instance by a fleet of forty and the waste is thousands of dollars a month for resources that are never used, and because the service is working nobody has a trigger to look again. The discipline is to size from measurement, not from a guess: pull the CPU and memory utilisation history, or let the provider\'s rightsizing advisor (AWS Compute Optimizer, Azure Advisor) recommend a size from that history, and choose the smallest instance that covers the observed peak with headroom. Then make rightsizing recurring — a quarterly review, or an automated job that turns Compute Optimizer findings into tickets — so the fleet does not silently drift back to oversized as workloads change.',
        whyHi: 'Ek instance choose karna har resource ka ek comfortable surplus ensure karke wo hai jaise fleets enormous amounts of idle capacity ke liye pay karti hain. Ek workload jise chhah gigabyte memory aur ek vCPU se thoda zyada chahiye ise ek battees-gigabyte, chaar-vCPU memory-optimised instance ki zaroorat nahi hai — ise ek chhota general-purpose ya burstable instance chahiye iske actual profile ke liye sized. "Safe rehne ke liye" instinct prudent feel karta hai par compound hota hai: ek chaar-times-oversized instance ko chalees ke ek fleet se multiply karo aur waste ek mahine hazaron dollar hai. Discipline measurement se size karna hai, ek guess se nahi: CPU aur memory utilisation history pull karo, ya provider ke rightsizing advisor ko us history se ek size recommend karne do. Phir rightsizing ko recurring banao.',
      },
      {
        wrong: `# running a stateful primary (or a can't-be-interrupted job) on spot
# a self-managed PostgreSQL primary on a spot instance "because spot is 70% off"
#   -> AWS reclaims it with 2 minutes' notice during a Tuesday capacity crunch
#   -> the DB goes down; if you have a replica the failover is rushed and lossy;
#      if you don't, you're restoring from a backup
# same story: a 3-hour ETL job with no checkpointing, evicted at hour 2.5.`,
        right: `# spot is for INTERRUPTIBLE work. match the model to the workload:
#   STATEFUL PRIMARY   -> on-demand or reserved, Multi-AZ. never spot.
#     (or better: a managed DB - RDS/Aurora/Azure SQL - which handles this for you)
#   LONG JOB           -> either on-demand, OR make it checkpoint every N minutes
#     and THEN run it on spot with automatic resume (AWS Batch does this)
#   STATELESS WEB      -> spot for the body + an on-demand floor (previous example)
#   CI RUNNERS         -> spot; a killed job just re-queues
# the test: "if this instance vanishes in 2 minutes, is that a shrug or an incident?"`,
        why: 'Spot instances trade a large discount for the cloud\'s right to reclaim the instance with roughly two minutes\' notice whenever it needs the capacity for on-demand customers. That is a perfectly acceptable trade for work that tolerates an instance disappearing — a stateless web server that the load balancer drains, a CI job that re-queues, a batch task that checkpoints and resumes. It is unacceptable for a stateful database primary, where a two-minute eviction is an unplanned failover at best and a restore-from-backup at worst, and for a long-running job with no checkpointing, which loses all its progress and starts over. The rule is to ask, for any instance, whether its sudden disappearance in two minutes would be a shrug or an incident. If a shrug, spot is free money. If an incident, use on-demand or a reservation, and for a database prefer a managed service that handles high availability for you. A long job can be made spot-eligible by adding checkpointing so it can resume, which is exactly what orchestration systems like AWS Batch do automatically.',
        whyHi: 'Spot instances ek badha discount cloud ke instance ko roughly do minute ke notice ke saath reclaim karne ke right ke liye trade karti hain jab bhi ise on-demand customers ke liye capacity chahiye. Wo work ke liye ek perfectly acceptable trade hai jo ek instance ke disappear hone ko tolerate karta hai — ek stateless web server jise load balancer drain karta hai, ek CI job jo re-queue karta hai, ek batch task jo checkpoint aur resume karta hai. Ye ek stateful database primary ke liye unacceptable hai, jahaan ek do-minute eviction best case mein ek unplanned failover hai aur worst case mein ek restore-from-backup. Rule ye poochna hai, kisi bhi instance ke liye, kya iska sudden disappearance do minute mein ek shrug hoga ya ek incident. Agar ek shrug, spot free money hai.',
      },
      {
        wrong: `# an autoscaling group with a max too low, discovered during the incident
resource "aws_autoscaling_group" "api" {
  min_size = 4
  max_size = 8         # "8 should be plenty" - set 2 years ago, traffic has 3x'd
}
# Black Friday: traffic hits 5x normal. the ASG scales 4 -> 8 and STOPS. it is
# pinned at max while CPU sits at 98% and the queue backs up. the scaling policy
# is working perfectly; the ceiling is the outage.
# also seen: max is fine but the SUBNETS only have /28s -> runs out of IP addresses
# at 12 instances regardless of the ASG max.`,
        right: `# set max from "what's the most traffic we could plausibly need to serve", not
# from "what feels like a lot", and alarm on approaching it:
  min_size = 4
  max_size = 40            # headroom for a real spike + a safety margin
  # CloudWatch alarm: GroupInServiceInstances >= 0.8 * max_size  -> page someone
  # (you're about to hit the ceiling - either it's an attack, or raise the max NOW)
# check the surrounding limits too:
#   - subnet CIDR size (enough IPs for max_size across 3 AZs + overhead)
#   - the instance-type vCPU quota in the region (raise it ahead of need)
#   - target group / ALB limits, NAT gateway throughput
# the max is a cost control AND a blast-radius control - not a capacity plan.`,
        why: 'An autoscaling group\'s maximum is often set once, early, at a number that felt generous at the time, and then never revisited as traffic grows. When a real spike arrives — a sale, a launch, a viral moment, or an attack — the scaling policy does its job and drives the group straight to that maximum, where it stops. From then on the service is running at capacity with the metric pegged and requests queuing, and the scaling policy is working exactly as designed; the ceiling is the outage. The maximum should be derived from a real answer to "what is the most traffic we could plausibly be asked to serve", with a safety margin on top, not from a number that sounds like a lot. It should also have an alarm that fires when the group reaches, say, eighty percent of the maximum, so someone is paged while there is still headroom to either raise the limit or investigate an attack. And the maximum is not the only ceiling: the subnets must have enough IP address space for that many instances across the availability zones, the account must have a high enough vCPU quota for the instance type in the region, and the load balancer, target group, and NAT gateway must not have their own lower limits. The autoscaling maximum is a cost and blast-radius control, and it must be checked against every other limit around it.',
        whyHi: 'Ek autoscaling group ka maximum aksar ek baar, jaldi, ek number par set hota hai jo us samay generous laga, aur phir kabhi revisit nahi hota jaise traffic badhta hai. Jab ek real spike aata hai — ek sale, ek launch, ek viral moment, ya ek attack — scaling policy apna kaam karti hai aur group ko seedhे us maximum tak drive karti hai, jahaan ye rukti hai. Us se aage service capacity par chal rahi hai metric pegged ke saath aur requests queuing, aur scaling policy exactly design ke roop mein kaam kar rahi hai; ceiling outage hai. Maximum ek real answer se derived hona chahiye "sabse zyada traffic kya hai jise humse plausibly serve karne ko kaha ja sakta hai" ke liye. Ise ek alarm bhi hona chahiye jo fire karta hai jab group maximum ka assi percent reach karta hai. Aur maximum ekmatra ceiling nahi hai: subnets ke paas kaafi IP address space hona chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Memory-optimised for a CPU job** — a video-transcode fleet ran on `r5` instances "for the buffers". It was 90% CPU, 15% memory. Moving to `c7g` (compute-optimised, Graviton, arm64 rebuild) plus a Savings Plan on the baseline cut the monthly bill from ~$22k to ~$6k for the same output.',
        hi: '**Ek CPU job ke liye memory-optimised** — ek video-transcode fleet `r5` instances par chala "buffers ke liye". Ye 90% CPU, 15% memory tha. `c7g` par move karna plus baseline par ek Savings Plan ne monthly bill ~$22k se ~$6k tak kata.',
      },
      {
        en: '**Spot under a Postgres primary** — a startup ran its self-managed PG primary on spot to save money. A regional capacity event reclaimed it at 14:00 on a weekday; the async replica was 40 seconds behind. They lost 40 seconds of writes and had a 12-minute outage. The primary moved to on-demand Multi-AZ that day; a month later to RDS.',
        hi: '**Ek Postgres primary ke neeche spot** — ek startup ne paisa bachane ke liye apna self-managed PG primary spot par chalaya. Ek regional capacity event ne ise ek weekday 14:00 par reclaim kiya. Unhone 40 seconds ke writes khoye. Primary us din on-demand Multi-AZ par move hua.',
      },
      {
        en: '**The max that was the outage** — an ASG max of 10, set at launch, was hit during a product-launch traffic surge two years later. The site was degraded for 90 minutes while an engineer raised the limit, waited for a vCPU quota increase, and discovered the subnets were also too small. Post-incident: max 60, quota pre-raised, /22 subnets, an 80%-of-max alarm.',
        hi: '**Wo max jo outage tha** — ek ASG max of 10, launch par set, do saal baad ek product-launch traffic surge ke dauraan hit hua. Site 90 minute ke liye degraded thi jab ek engineer ne limit raise ki. Post-incident: max 60, quota pre-raised, /22 subnets, ek 80%-of-max alarm.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you choose an instance family and size for a workload, and what is Graviton / ARM about?',
        qHi: 'Aap ek workload ke liye ek instance family aur size kaise choose karte ho, aur Graviton / ARM kya hai?',
        a: 'Instance families fix the ratio between vCPU, memory, and other resources so you can match the shape of the workload rather than over-buying one dimension. General purpose, roughly one vCPU to four gigabytes, is the default for web and application servers and most things you have not measured. Compute optimised shifts toward CPU for batch, encoding, game servers, and CI. Memory optimised goes the other way for in-memory databases, large caches, and big JVM heaps. Storage optimised attaches large fast local NVMe for data warehouses and large search or streaming clusters. Accelerated adds GPUs or AI chips for training and inference. Burstable instances are cheap, accumulate CPU credits while idle and burst by spending them, and suit development and low-traffic spiky services but are a trap for anything continuously hot. You choose by measuring the real CPU and memory utilisation over a representative period, or letting the provider\'s rightsizing advisor recommend from that history, then picking the smallest instance in the family that matches your bottleneck with reasonable headroom, and you make that a recurring review because workloads drift. Graviton is AWS\'s line of ARM-based processors; instances with a "g" in the name run on it, and for the same work they are typically around twenty percent cheaper and more power-efficient than the x86 equivalent. The catch is that your container images and compiled binaries must be built for arm64, so it is an easy win for interpreted languages and Go, and a small porting exercise for others.',
        aHi: 'Instance families vCPU, memory, aur doosre resources ke beech ratio fix karti hain taaki aap workload ke shape ko match kar sako. General purpose, roughly ek vCPU se chaar gigabytes, web aur application servers ke liye default hai. Compute optimised CPU ki taraf shift karti hai batch, encoding, CI ke liye. Memory optimised doosri taraf jaati hai in-memory databases ke liye. Burstable instances sasti hain, idle hone par CPU credits accumulate karti hain, aur development aur low-traffic spiky services ke liye suit karti hain par continuously hot kisi bhi cheez ke liye ek trap hain. Aap real CPU aur memory utilisation ko ek representative period par measure karke choose karte ho, phspecific bottleneck se match karne wale family mein sabse chhota instance pick karte ho. Graviton AWS ke ARM-based processors ki line hai; "g" wale instances ispar chalti hain, aur same work ke liye typically ~20 percent sasti hain.',
      },
      {
        q: 'Compare on-demand, spot, reserved instances and Savings Plans. What workload goes on each?',
        qHi: 'On-demand, spot, reserved instances aur Savings Plans compare karo. Kaun sा workload har ek par jaata hai?',
        a: 'On-demand is pay-per-second with no commitment at the full rate — for unpredictable load, short experiments, and the spiky top of a workload you cannot commit to. Spot is spare capacity at sixty to ninety percent off, with the condition that the cloud can reclaim the instance with about two minutes\' notice; it fits fault-tolerant, interruptible work — batch and big-data jobs that checkpoint, CI runners, stateless web servers behind a load balancer with a mix of spot and on-demand, and development — and is wrong for a stateful database primary or a long job that cannot checkpoint. Reserved instances are a one or three year commitment to a specific instance type in a specific region for roughly forty to sixty percent off, the least flexible option. Savings Plans (and GCP committed use, and Azure reservations with size flexibility) commit to a dollar-per-hour level of compute spend for one or three years for roughly thirty to sixty-five percent off, with the discount applying flexibly across instance families, sizes, regions, and even Fargate and Lambda — which makes them the better commitment vehicle for most organisations because you are not locked to a specific instance type as your fleet evolves. The standard approach is a mix: a Savings Plan or reservation sized to your steady twenty-four-seven baseline, on-demand for the predictable daytime increase, and spot for the burst and batch work on top.',
        aHi: 'On-demand koi commitment nahi ke saath pay-per-second hai full rate par — unpredictable load, short experiments ke liye. Spot saath se navve percent off spare capacity hai, is condition ke saath ki cloud instance ko ~2 min notice ke saath reclaim kar sakta hai; ye fault-tolerant, interruptible work fit karta hai — batch jobs jo checkpoint karte hain, CI runners, stateless web servers — aur ek stateful database primary ke liye galat hai. Reserved instances ek 1 ya 3 saal ki commitment hain ek specific instance type ke liye ~40-60 percent off ke liye. Savings Plans 1 ya 3 saal ke liye compute spend ke ek dollar-per-hour level ke liye commit karti hain ~30-65 percent off ke liye, discount instance families, sizes, regions ke across flexibly apply hote hue. Standard approach ek mix hai: steady baseline ke liye ek Savings Plan, predictable daytime increase ke liye on-demand, aur upar burst work ke liye spot.',
      },
      {
        q: 'Explain autoscaling policies and the settings around them that matter as much as the policy.',
        qHi: 'Autoscaling policies aur unke aas-paas ki settings samjhao jo policy jitni matter karti hain.',
        a: 'An autoscaling group manages a pool of identical instances against a min and max and a scaling policy. Target tracking keeps a metric at a target — average CPU at fifty percent, a thousand requests per instance, an SQS queue depth of a hundred per instance — and the group computes the instance count to hit it; this is the default and is right for most services. Step scaling defines discrete steps for workloads with a known non-linear relationship between the metric and needed capacity. Scheduled scaling sets capacity by time for predictable daily or weekly cycles, often as a floor under a reactive policy. Predictive scaling forecasts the recurring load curve and adds capacity before demand arrives, removing the lag of always chasing a rise. The settings around the policy matter just as much. A warm-up or cooldown tells the group to ignore a new instance\'s metrics until it has booted and warmed caches, so it does not over-scale while capacity is already on the way. A proper health check — an application or load-balancer health check, not just "is the VM running" — lets the group replace instances that are up but not serving. And the minimum and maximum bound everything: the minimum is your always-on floor, and the maximum is simultaneously your cost ceiling and, if a genuine spike reaches it, your outage — so it should be set from the most traffic you could plausibly need to serve with margin, alarmed when the group approaches it, and checked against the surrounding limits like subnet IP space and vCPU quotas.',
        aHi: 'Ek autoscaling group identical instances ka ek pool manage karti hai ek min aur max aur ek scaling policy ke against. Target tracking ek metric ko ek target par rakhti hai — average CPU pachas percent — aur group instance count compute karti hai; ye default hai. Step scaling discrete steps define karti hai. Scheduled scaling capacity ko time se set karti hai predictable cycles ke liye. Predictive scaling recurring load curve forecast karti hai aur demand aane se pehle capacity add karti hai. Policy ke aas-paas ki settings utni hi matter karti hain. Ek warm-up group ko batati hai ki ek naye instance ke metrics ignore kare jab tak ye boot na ho jaaye. Ek proper health check group ko instances replace karne deta hai jo up hain par serve nahi kar rahe. Aur minimum aur maximum sab kuch bound karte hain: maximum simultaneously aapka cost ceiling hai aur, agar ek genuine spike ise reach kare, aapka outage.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list the instance families with their AWS/Azure names and the workloads each fits, and explain the burstable trap and the Graviton win.',
        taskHi: 'Ek comment mein, instance families list karo unke AWS/Azure names ke saath.',
        hint: 'FAMILIES (ratio of vCPU : memory : extras — AWS letter / Azure series): GENERAL PURPOSE ~1 vCPU : 4 GB — AWS `m` (m7i, m7g) / Azure D-series — web/app servers, small DBs, anything unmeasured (the default). COMPUTE OPTIMISED ~1 vCPU : 2 GB — AWS `c` (c7i, c7g) / Azure F-series — batch, media encoding, game servers, HPC, CI runners. MEMORY OPTIMISED ~1 vCPU : 8-16+ GB — AWS `r`/`x`/`u` / Azure E/M — in-memory DBs, big caches, large JVM heaps, in-memory analytics. STORAGE OPTIMISED — large fast local NVMe — AWS `i`/`d` / Azure L — data warehouses, big Elasticsearch/Kafka, log stores. ACCELERATED — GPU / AI chips — AWS `p`/`g`/`inf`/`trn` / Azure N — ML training + inference, rendering, transcode. BURSTABLE — cheap, earns CPU credits while idle, bursts by spending them — AWS `t` (t3, t4g) / Azure B — dev, low-traffic, spiky. Within a family scale by size: `.large` → `.xlarge` → `.2xlarge` (~linear price). THE BURSTABLE TRAP: `t`/B instances throttle HARD to their (low) baseline once credits run out — great for spiky/idle, a disaster for anything continuously hot (it will exhaust credits and then crawl). THE GRAVITON WIN: an AWS `g` suffix (m7g, c7g, t4g) = ARM (Graviton) processors — typically ~20% cheaper + more power-efficient for the same work; the catch is your images/binaries must be built for `arm64` (free for interpreted languages + Go, a small port for others). Azure has Ampere Altra ARM (Dpsv5/Epsv5); GCP has Tau T2A / Axion.',
        hintHi: 'FAMILIES (vCPU : memory : extras ka ratio): GENERAL PURPOSE ~1 vCPU : 4 GB — AWS `m` / Azure D — web/app servers, chhote DBs (default). COMPUTE OPTIMISED ~1 vCPU : 2 GB — AWS `c` / Azure F — batch, encoding, CI. MEMORY OPTIMISED ~1 vCPU : 8-16+ GB — AWS `r`/`x`/`u` / Azure E/M — in-memory DBs, caches. STORAGE OPTIMISED — local NVMe — AWS `i`/`d` / Azure L. ACCELERATED — GPU — AWS `p`/`g`/`inf`/`trn` / Azure N — ML. BURSTABLE — sasta, CPU credits earn karta hai — AWS `t` / Azure B — dev, spiky. BURSTABLE TRAP: `t`/B instances credits khatam hone par HARD throttle karti hain — continuously hot kisi cheez ke liye disaster. GRAVITON WIN: AWS `g` suffix = ARM — ~20% sasta; catch: images `arm64` mein build hone chahiye.',
      },
      {
        task: 'In a comment, contrast on-demand / spot / reserved / Savings Plans on discount, commitment, flexibility and interruptibility, and give the standard mix.',
        taskHi: 'Ek comment mein, on-demand / spot / reserved / Savings Plans ka contrast karo.',
        hint: 'ON-DEMAND: pay per second/hour, NO commitment, FULL price, fully flexible, never interrupted. For: unpredictable load, short experiments, the spiky top you cannot commit to. SPOT: spare capacity, 60-90% OFF, no commitment, BUT the cloud can RECLAIM the instance with ~2 min notice. For: FAULT-TOLERANT + INTERRUPTIBLE + stateless + retryable work — batch/big-data jobs that CHECKPOINT, CI runners (a killed job re-queues), stateless web behind an LB with a mix of spot + an on-demand floor, dev. NOT for: a stateful DB primary (a 2-min eviction = an unplanned lossy failover or a restore), a long job with no checkpointing. RESERVED INSTANCES / capacity reservations: commit to a SPECIFIC instance type + region for 1 or 3 years → ~40-60% off. LEAST flexible (locked to the type). Azure "Reserved VM Instances". SAVINGS PLANS (AWS) / committed use discounts (GCP) / Azure reservations with instance-size flexibility: commit to $X/hour of compute SPEND for 1/3 years → ~30-65% off, and the discount applies FLEXIBLY across instance families, sizes, regions, even Fargate + Lambda → the BETTER commitment vehicle for most orgs because your fleet can evolve without losing the discount. THE STANDARD MIX: (1) a Savings Plan / reservation sized to the steady 24/7 BASELINE (the trough of usage); (2) ON-DEMAND for the predictable daytime bump above baseline; (3) SPOT for the burst + batch work on top. This captures most of the discount without over-committing to capacity you might not use. THE TEST for spot: "if this instance vanishes in 2 minutes, is that a shrug or an incident?"',
        hintHi: 'ON-DEMAND: per second/hour pay, KOI commitment nahi, FULL price, fully flexible, kabhi interrupted nahi. SPOT: spare capacity, 60-90% OFF, koi commitment nahi, PAR cloud instance ~2 min notice ke saath RECLAIM kar sakta hai. For: FAULT-TOLERANT + INTERRUPTIBLE work — batch jobs jo CHECKPOINT karte hain, CI runners, LB ke peeche stateless web + ek on-demand floor. NOT for: ek stateful DB primary, ek long job bina checkpointing ke. RESERVED: ek SPECIFIC instance type + region ke liye 1/3 saal commit → ~40-60% off. LEAST flexible. SAVINGS PLANS: $X/hour compute SPEND ke liye 1/3 saal commit → ~30-65% off, FLEXIBLY apply. STANDARD MIX: (1) steady BASELINE ke liye ek Savings Plan; (2) daytime bump ke liye ON-DEMAND; (3) burst + batch ke liye SPOT. TEST for spot: "agar ye instance 2 min mein gayab ho jaaye, ye ek shrug hai ya ek incident?"',
      },
      {
        task: 'In a comment, explain the four autoscaling policy types and the surrounding settings (warm-up, health check, min/max), being specific about why a too-low max is an outage.',
        taskHi: 'Ek comment mein, chaar autoscaling policy types aur surrounding settings samjhao.',
        hint: 'POLICY TYPES (an ASG / VM Scale Set adds+removes instances between min and max): (1) TARGET TRACKING — "keep average CPU at 50%" / "keep 1000 req per instance" / "SQS depth 100 per instance"; the group computes the instance delta to hit the target. THE DEFAULT, usually right. (2) STEP SCALING — discrete steps: "CPU > 70% for 3 min → +2; > 90% → +4" — for a known NON-LINEAR relationship between the metric and needed capacity. (3) SCHEDULED — set min/desired by time: "min 20 at 08:00 Mon-Fri, min 4 otherwise" — for a known daily/weekly cycle, often as a FLOOR layered under a reactive policy. (4) PREDICTIVE — ML forecasts the recurring load curve and pre-scales AHEAD of demand, removing the lag where a reactive policy is always chasing a rise. SURROUNDING SETTINGS that matter as much: WARM-UP / cooldown — ignore a newly launched instance\'s metrics until it has booted + warmed caches, so the group does not over-scale while capacity is already on the way. HEALTH CHECK — use an APPLICATION / load-balancer health check, not just "is the VM running", so the group replaces instances that are Up but not serving. MIN/MAX — the min is your always-on floor; the MAX is BOTH your cost ceiling AND, if a genuine spike reaches it, your OUTAGE: the scaling policy drives the group straight to max and STOPS, the metric pegs, requests queue, and the policy is working perfectly — the ceiling is the incident. Set max from "the most traffic we could plausibly need to serve" + margin, alarm at ~80% of max (so someone is paged with headroom left — raise it or it\'s an attack), and check the SURROUNDING limits: subnet CIDR (enough IPs for max across 3 AZs), the region\'s vCPU quota for the instance type (pre-raise it), ALB/target-group limits, NAT gateway throughput.',
        hintHi: 'POLICY TYPES: (1) TARGET TRACKING — "average CPU 50% par rakho"; group instance delta compute karta hai. DEFAULT. (2) STEP SCALING — discrete steps: "CPU > 70% 3 min → +2" — known NON-LINEAR relationship ke liye. (3) SCHEDULED — min/desired time se: "min 20 at 08:00 Mon-Fri" — known cycle ke liye, aksar ek FLOOR. (4) PREDICTIVE — ML load curve forecast karta hai aur demand se PEHLE pre-scale karta hai. SURROUNDING SETTINGS: WARM-UP — ek naye instance ke metrics ignore karo jab tak boot na ho. HEALTH CHECK — APPLICATION / LB health check use karo. MIN/MAX — min always-on floor; MAX DONO cost ceiling AUR, agar ek genuine spike ise reach kare, aapka OUTAGE: policy group ko seedhे max tak drive karti hai aur RUKTI hai. Max ko "sabse zyada traffic jise serve karne ki zaroorat ho sakti hai" + margin se set karo, ~80% par alarm, aur SURROUNDING limits check karo: subnet CIDR, vCPU quota, ALB limits, NAT gateway throughput.',
      },
    ],

    keyTakeaways: [
      'INSTANCE FAMILIES fix the CPU:memory:extras ratio — GENERAL PURPOSE (m / D-series, ~1:4, the default), COMPUTE OPTIMISED (c / F, batch/encoding/CI), MEMORY OPTIMISED (r/x/u / E/M, in-memory DBs/caches), STORAGE OPTIMISED (i/d / L, warehouses/Kafka), ACCELERATED (p/g/inf/trn / N, ML/GPU), BURSTABLE (t / B, dev/spiky — throttles hard once credits run out). Size within a family (`.large`→`.xlarge`, ~linear). `g` = Graviton ARM, ~20% cheaper if your image is arm64.',
      'RIGHT-SIZE FROM MEASUREMENT, not "enough of everything": pull CPU + memory history (or Compute Optimizer / Azure Advisor), pick the smallest instance in the family that matches the real bottleneck with headroom, and make it a recurring review — a 4x-oversized instance × a fleet is thousands per month of idle capacity.',
      'PRICING is a 3-4x lever: ON-DEMAND (no commitment, full price — spiky/unpredictable), SPOT (60-90% off, reclaimed with ~2 min notice — only fault-tolerant/interruptible/stateless work; NEVER a stateful primary or an uncheckpointed long job), RESERVED (1-3 yr, specific type+region, ~40-60% off, least flexible), SAVINGS PLANS / committed use (1-3 yr $/hr commitment, ~30-65% off, flexible across families/sizes/regions/Fargate/Lambda — the better commitment vehicle).',
      'STANDARD MIX: a Savings Plan sized to the steady 24/7 baseline + on-demand for the predictable daytime bump + spot for the burst/batch on top. Stateless web can run mostly spot behind an LB with a small on-demand floor and several interchangeable instance types (~60-70% off, no availability cost).',
      'AUTOSCALING: TARGET TRACKING (keep a metric at a target — the default), STEP (known non-linear response), SCHEDULED (known cycle, often a floor), PREDICTIVE (forecast + pre-scale). Around it: a WARM-UP so booting instances don\'t cause over-scaling, an APPLICATION health check (replace Up-but-not-serving), and MIN/MAX — the MAX is your cost ceiling AND your outage if a real spike hits it, so set it from plausible peak traffic + margin, alarm at ~80%, and check subnet IPs + vCPU quotas + LB limits around it.',
    ],
    keyTakeawaysHi: [
      'INSTANCE FAMILIES CPU:memory:extras ratio fix karti hain — GENERAL PURPOSE (m / D-series, ~1:4, default), COMPUTE OPTIMISED (c / F, batch/encoding/CI), MEMORY OPTIMISED (r/x/u / E/M, in-memory DBs/caches), STORAGE OPTIMISED (i/d / L), ACCELERATED (p/g/inf/trn / N, ML/GPU), BURSTABLE (t / B, dev/spiky — credits khatam hone par hard throttle). `g` = Graviton ARM, ~20% sasta agar image arm64 hai.',
      'MEASUREMENT SE RIGHT-SIZE karo, "har cheez ka enough" se nahi: CPU + memory history pull karo (ya Compute Optimizer / Azure Advisor), family mein sabse chhota instance pick karo jo real bottleneck se match kare, aur ise ek recurring review banao.',
      'PRICING ek 3-4x lever hai: ON-DEMAND (koi commitment nahi, full price — spiky), SPOT (60-90% off, ~2 min notice ke saath reclaimed — sirf fault-tolerant/interruptible work; KABHI ek stateful primary nahi), RESERVED (1-3 yr, specific type+region, ~40-60% off, least flexible), SAVINGS PLANS (1-3 yr $/hr commitment, ~30-65% off, flexible — better commitment vehicle).',
      'STANDARD MIX: steady 24/7 baseline ke liye ek Savings Plan + predictable daytime bump ke liye on-demand + upar burst/batch ke liye spot. Stateless web zyadaatar spot par ek LB ke peeche ek chhote on-demand floor + kई interchangeable instance types ke saath chal sakta hai (~60-70% off).',
      'AUTOSCALING: TARGET TRACKING (ek metric ko target par rakho — default), STEP (known non-linear response), SCHEDULED (known cycle), PREDICTIVE (forecast + pre-scale). Iske aas-paas: ek WARM-UP, ek APPLICATION health check, aur MIN/MAX — MAX aapka cost ceiling HAI AUR aapka outage agar ek real spike ise hit kare, to ise plausible peak traffic + margin se set karo, ~80% par alarm, aur subnet IPs + vCPU quotas + LB limits check karo.',
    ],
  },

  {
    slug: 'ops-the-cloud-bill-cost-drivers-and-controls',
    title: 'The Cloud Bill: Cost Drivers & Controls',
    titleHi: 'Cloud Bill: Cost Drivers Aur Controls',
    description:
      'What a cloud bill is actually made of — compute, storage tiers and IOPS, the data-transfer charges that surprise everyone (cross-AZ, cross-region, internet egress, NAT gateway), and the managed-service premium — and the controls that keep it from drifting: tagging and cost allocation, budgets and anomaly alerts, rightsizing, and the FinOps loop of inform, optimise, operate.',
    descriptionHi:
      'Ek cloud bill actually kis se bana hai — compute, storage tiers aur IOPS, wo data-transfer charges jo sabko surprise karte hain (cross-AZ, cross-region, internet egress, NAT gateway), aur managed-service premium — aur wo controls jo ise drift karne se rokte hain: tagging aur cost allocation, budgets aur anomaly alerts, rightsizing, aur inform, optimise, operate ki FinOps loop.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A utility bill for a workshop you share with other teams.** The big line items are obvious — the machines running (compute), the material stored in the warehouse (storage). But there is a charge nobody expected: every time you move a pallet from your bench to the loading dock, or across town to another site, there is a haulage fee (data transfer), and it adds up to more than the electricity. There is also a premium for the machines the landlord maintains for you versus the ones you run yourself (managed-service premium). To control it you first have to know which team\'s work each cost belongs to (tagging), set a monthly ceiling with an alarm before you hit it (budgets), turn off machines left running overnight (rightsizing and scheduling), and make reviewing the bill a habit rather than a panic once a quarter (the FinOps loop).',
      hi: '**Ek workshop ke liye ek utility bill jo aap doosri teams ke saath share karte ho.** Badhे line items obvious hain — machines chal rahi (compute), warehouse mein stored material (storage). Par ek charge hai jise kisi ne expect nahi kiya: har baar jab aap ek pallet apne bench se loading dock tak move karte ho, ya doosre site tak town ke across, ek haulage fee hai (data transfer), aur ye electricity se zyada tak add hota hai. Ek premium bhi hai un machines ke liye jo landlord aapke liye maintain karta hai versus jinhe aap khud chalate ho (managed-service premium). Ise control karne ke liye aapko pehle jaanna hai har cost kaun si team ke work ki hai (tagging), ek monthly ceiling set karna ek alarm ke saath (budgets), overnight chalti chhodi machines band karna (rightsizing), aur bill review karna ek panic ke bajaay ek habit banana (FinOps loop).',
    },

    simple: `**WHAT THE BILL IS MADE OF:**
\`\`\`
COMPUTE        VMs / containers / functions (Lesson 5). usually the biggest line.
              priced per second/hour x size, minus your commitments.
STORAGE        - object (S3/Blob): per GB-month PER TIER (hot -> infrequent -> archive
                -> deep archive; cheaper storage, pricier + slower retrieval), plus
                per-request charges, plus retrieval + early-deletion fees on cold tiers
              - block (EBS/Disks): per GB-month by type (gp3/io2/...) + PROVISIONED
                IOPS + throughput. an idle 1TB gp3 volume still costs ~$80/mo.
              - snapshots + backups: per GB, and they pile up silently
DATA TRANSFER  the one that surprises everyone. INGRESS is ~free; EGRESS is not:
              - within one AZ                : free
              - cross-AZ (same region)      : ~$0.01/GB each way  <- chatty microservices!
              - cross-region                : ~$0.02/GB
              - to the internet             : ~$0.05-0.09/GB (first ~10TB), tiered down
              - via a NAT GATEWAY           : ~$0.045/GB PROCESSED + hourly  <- huge if
                                              private subnets pull lots from the internet
              - CloudFront/CDN egress       : cheaper than direct, and cache hits are free
MANAGED PREMIUM you pay more for RDS than raw EC2+Postgres - you're buying the ops.
              real question: is the ops time you save worth the premium? (usually yes)
OTHER         load balancers (hourly + per-LCU), public IPv4 (now ~$3.60/mo EACH),
              logs/metrics ingestion + retention, KMS, Route 53 queries, support plan
\`\`\`

**THE CONTROLS:**
\`\`\`
TAG EVERYTHING     team / service / env / cost-center on every resource, ENFORCED
                  (a tag policy / Azure Policy that denies untagged creates). without
                  tags you cannot answer "why did the bill go up" or charge teams back.
BUDGETS + ALERTS   a monthly budget per team/account with alerts at 50/80/100% of
                  actual AND forecast. + ANOMALY DETECTION (ML flags a sudden jump).
RIGHTSIZE         Compute Optimizer / Azure Advisor -> a ticket per over-provisioned
                  thing. delete unattached volumes, old snapshots, idle LBs, orphaned IPs.
SCHEDULE          stop non-prod at night + weekends (~70% of the week) - "instance
                  scheduler" / start-stop automation. dev doesn't need to run at 3am Sunday.
COMMIT            Savings Plans / reservations for the steady baseline (Lesson 5).
ARCHITECT        cache at the edge (CDN) to cut egress; keep chatty services in ONE AZ
                  for the hot path (accept the AZ risk) or co-locate; use VPC endpoints
                  / Private Link so S3/DynamoDB traffic skips the NAT gateway;
                  pick the right storage tier + lifecycle rules to age data down.
\`\`\`

**FINOPS** (Module 20 goes deeper) — a practice, not a tool. The loop:
\`\`\`
INFORM    give every team visibility into ITS spend (tagged, shown in a dashboard)
OPTIMISE  rightsize, commit, delete waste, re-architect the expensive paths
OPERATE   make it continuous - budgets, anomaly alerts, a cost check in code review,
          a monthly cost review, unit economics ($ per customer / per request / per GB)
\`\`\`
Cost is a non-functional requirement like latency or availability - owned by the
team that ships the service, not bolted on by finance afterwards.`,

    simpleHi: `**BILL KIS SE BANA HAI:**
\`\`\`
COMPUTE        VMs / containers / functions (Lesson 5). aam taur par sabse badhi line.
              per second/hour x size priced, aapki commitments minus.
STORAGE        - object (S3/Blob): per GB-month PER TIER (hot -> infrequent -> archive;
                sasta storage, mehnga + slower retrieval), plus per-request charges,
                plus cold tiers par retrieval + early-deletion fees
              - block (EBS/Disks): per GB-month by type + PROVISIONED IOPS + throughput.
                ek idle 1TB gp3 volume abhi bhi ~$80/mo cost karta hai.
              - snapshots + backups: per GB, aur wo silently pile up hote hain
DATA TRANSFER  wo jo sabko surprise karta hai. INGRESS ~free hai; EGRESS nahi:
              - ek AZ ke andar               : free
              - cross-AZ (same region)       : ~$0.01/GB each way  <- chatty microservices!
              - cross-region                 : ~$0.02/GB
              - internet ko                  : ~$0.05-0.09/GB (pehle ~10TB), tiered down
              - ek NAT GATEWAY ke through     : ~$0.045/GB PROCESSED + hourly  <- huge agar
                                               private subnets internet se bahut pull karte hain
              - CloudFront/CDN egress        : direct se sasta, aur cache hits free hain
MANAGED PREMIUM aap RDS ke liye raw EC2+Postgres se zyada pay karte ho - aap ops khareed rahe ho.
              real question: jo ops time aap bachate ho kya wo premium ke worth hai? (aam taur par haan)
OTHER         load balancers (hourly + per-LCU), public IPv4 (ab ~$3.60/mo HAR EK),
              logs/metrics ingestion + retention, KMS, Route 53 queries, support plan
\`\`\`

**CONTROLS:**
\`\`\`
TAG EVERYTHING     har resource par team / service / env / cost-center, ENFORCED (ek
                  tag policy / Azure Policy jo untagged creates deny karti hai). tags ke
                  bina aap "bill kyun badha" answer nahi kar sakte ya teams ko charge back.
BUDGETS + ALERTS   per team/account ek monthly budget alerts ke saath 50/80/100% actual
                  AUR forecast par. + ANOMALY DETECTION (ML ek sudden jump flag karta hai).
RIGHTSIZE         Compute Optimizer / Azure Advisor -> per over-provisioned cheez ek ticket.
                  unattached volumes, purane snapshots, idle LBs, orphaned IPs delete karo.
SCHEDULE          non-prod ko raat + weekends band karo (~70% of the week) - "instance
                  scheduler". dev ko Sunday 3am par run karne ki zaroorat nahi.
COMMIT            steady baseline ke liye Savings Plans / reservations (Lesson 5).
ARCHITECT        egress kaatne ke liye edge par cache karo (CDN); hot path ke liye chatty
                  services ek AZ mein rakho; VPC endpoints / Private Link use karo taaki
                  S3/DynamoDB traffic NAT gateway skip kare; sahi storage tier + lifecycle rules.
\`\`\`

**FINOPS** (Module 20 deeper jaata hai) — ek practice, ek tool nahi. Loop:
\`\`\`
INFORM    har team ko USKE spend mein visibility do (tagged, ek dashboard mein shown)
OPTIMISE  rightsize, commit, waste delete, expensive paths re-architect
OPERATE   ise continuous banao - budgets, anomaly alerts, code review mein ek cost check,
          ek monthly cost review, unit economics ($ per customer / per request / per GB)
\`\`\`
Cost ek non-functional requirement hai latency ya availability ki tarah - us team dwara
owned jo service ship karti hai, baad mein finance dwara bolted on nahi.`,

    content: `## What the bill is made of

A cloud bill is the sum of many metered line items, but a handful dominate and a couple of them surprise almost everyone.

**Compute** — VMs, containers, functions — is usually the largest line, priced per second or hour times the instance size, reduced by whatever Savings Plans or reservations you hold (Lesson 5).

**Storage** has several sub-types with distinct pricing shapes:

- **Object storage** (S3, Azure Blob, GCS) is priced per gigabyte-month, but at a rate that depends on the **storage class**: a hot/standard tier for frequently accessed data, an infrequent-access tier that is cheaper to store but adds a per-gigabyte retrieval charge, and archive and deep-archive tiers that are very cheap to store but slow and expensive to retrieve and carry a minimum storage duration. On top of the per-gigabyte cost there are per-request charges (PUTs cost more than GETs) and, on the cold tiers, retrieval fees and early-deletion penalties.
- **Block storage** (EBS volumes, Azure managed disks) is priced per gigabyte-month by volume type, plus separate charges for **provisioned IOPS and throughput** above the baseline. A one-terabyte general-purpose volume costs around eighty dollars a month whether it is attached to a running instance or sitting unattached after the instance was terminated.
- **Snapshots and backups** are priced per gigabyte of stored data and accumulate silently — a daily snapshot schedule with no retention limit is a slowly growing bill.

**Data transfer** is the line that surprises teams, because ingress into the cloud is generally free and egress is not, and the internal transfer charges are easy to overlook:

- Traffic within a single availability zone is free.
- Traffic **between availability zones in the same region** costs roughly a cent per gigabyte in each direction — which means a set of chatty microservices spread across three AZs, each call crossing a zone boundary, generates a continuous transfer bill.
- Traffic **between regions** is roughly two cents per gigabyte.
- Traffic **to the internet** is the expensive one, roughly five to nine cents per gigabyte for the first several terabytes, tiering down at volume.
- Traffic through a **NAT gateway** — which private-subnet resources use to reach the internet — is charged at roughly four and a half cents per gigabyte *processed*, plus an hourly rate, so a fleet in private subnets pulling large amounts of data from the internet (container images, package downloads, third-party APIs) can run up a NAT bill larger than the compute it supports.
- Traffic served through a **CDN** (CloudFront, Front Door, Cloud CDN) is cheaper per gigabyte than direct egress, and content served from the cache incurs no origin transfer at all.

**The managed-service premium** is the difference between what you pay for a managed service and what the raw infrastructure underneath would cost — RDS versus an EC2 instance running Postgres yourself, a managed Kafka versus self-hosted. You are buying the operational work: patching, backups, failover, monitoring, upgrades. The right question is whether the engineering time that premium saves is worth more than the premium, and for most teams on most services the answer is yes.

**Other lines** add up: load balancers charge an hourly rate plus a usage rate; public IPv4 addresses now carry a small monthly charge each; logs and metrics are charged on ingestion volume and retention period; key management, DNS queries, and the support plan all appear.

## The controls

**Tag everything.** Every resource carries tags for team, service, environment, and cost centre, and the tagging is **enforced** — a tag policy or Azure Policy that denies the creation of an untagged resource. Without consistent tags you cannot attribute a cost increase to a team or a change, and you cannot show each team its own spend, which is the precondition for anyone caring about it.

**Budgets and alerts.** Each team or account has a monthly budget with alerts at, say, fifty, eighty, and a hundred percent of both actual and forecast spend, so someone is notified while there is still time to act rather than after the invoice. Layer **anomaly detection** on top — a service that flags a sudden unexplained jump in a particular cost dimension, which catches a runaway process or a misconfiguration that a fixed threshold would miss.

**Rightsize and clean up.** Run the provider\'s rightsizing advisor and turn each finding into a ticket. Separately, sweep for pure waste: block volumes not attached to anything, snapshots older than the retention policy, load balancers with no targets, elastic IPs not associated with a running instance, old machine images.

**Schedule non-production.** Development, staging, and test environments do not need to run overnight or at weekends — roughly seventy percent of the week. An instance scheduler that stops them outside working hours and starts them in the morning removes most of their cost with no downside.

**Commit the baseline.** Cover the steady twenty-four-seven usage with Savings Plans or reservations (Lesson 5).

**Architect for cost.** Serve cacheable content through a CDN to cut internet egress and origin load. Keep the chatty request path within a single availability zone where the cross-zone transfer would otherwise dominate, accepting the availability trade for that path, or co-locate the services that talk most. Use VPC endpoints or Private Link so that traffic to S3, DynamoDB, and other cloud services goes over the provider\'s private network instead of out through the NAT gateway. Choose the storage class that matches the access pattern and set lifecycle rules that age data down to cheaper tiers automatically.

## FinOps

**FinOps** is the practice of making cloud cost a shared, managed concern rather than a quarterly surprise. It is covered in depth in Module 20; the core is a continuous loop:

- **Inform**: give every team clear visibility into its own spend, made possible by consistent tagging and surfaced in a dashboard the team actually looks at.
- **Optimise**: rightsize instances, buy commitments for the baseline, delete waste, and re-architect the paths that cost the most.
- **Operate**: make cost management continuous rather than episodic — budgets and anomaly alerts running all the time, a cost consideration in code review for infrastructure changes, a short monthly cost review per team, and unit-economics metrics that express cost as dollars per customer, per request, or per gigabyte processed so that a rising bill can be judged against rising value.

The underlying principle is that cost is a non-functional requirement in the same category as latency, availability, and security — owned by the team that builds and runs the service, considered in design and review, not something finance discovers and pushes back on after the fact.`,

    contentHi: `## Bill kis se bana hai

Ek cloud bill kई metered line items ka sum hai, par ek handful dominate karte hain aur unme se ek-do lagbhag sabko surprise karte hain.

**Compute** — VMs, containers, functions — aam taur par sabse badhi line hai, per second ya hour times instance size priced, jo bhi Savings Plans ya reservations aap rakhte ho usse reduced (Lesson 5).

**Storage** ke kई sub-types hain distinct pricing shapes ke saath:
- **Object storage** (S3, Azure Blob, GCS) per gigabyte-month priced hai, par ek rate par jo **storage class** par depend karta hai: frequently accessed data ke liye ek hot/standard tier, ek infrequent-access tier jo store karne ke liye sasta hai par ek per-gigabyte retrieval charge add karta hai, aur archive aur deep-archive tiers jo store karne ke liye bahut saste hain par slow aur mehnga retrieve.
- **Block storage** (EBS volumes, Azure managed disks) per gigabyte-month volume type se priced hai, plus **provisioned IOPS aur throughput** ke liye separate charges. Ek one-terabyte general-purpose volume ek mahine lagbhag assi dollar cost karta hai chahe ye ek running instance se attached ho ya unattached baitha ho.
- **Snapshots aur backups** stored data ke per gigabyte priced hain aur silently accumulate hote hain.

**Data transfer** wo line hai jo teams ko surprise karti hai, kyunki cloud mein ingress generally free hai aur egress nahi:
- Ek single availability zone ke andar traffic free hai.
- **Same region mein availability zones ke beech** traffic roughly ek cent per gigabyte har direction mein cost karta hai — jiska matlab teen AZs ke across spread chatty microservices ka ek set ek continuous transfer bill generate karta hai.
- **Regions ke beech** traffic roughly do cents per gigabyte hai.
- **Internet ko** traffic mehnga wala hai, roughly paanch se nau cents per gigabyte.
- Ek **NAT gateway** ke through traffic roughly saade chaar cents per gigabyte *processed* par charged hai, plus ek hourly rate.
- Ek **CDN** ke through served traffic direct egress se sasta hai.

**Managed-service premium** ek managed service ke liye jo aap pay karte ho aur neeche raw infrastructure kya cost karega ke beech ka difference hai. Aap operational work khareed rahe ho. Right question ye hai ki kya wo premium jo engineering time bachaता hai wo premium se zyada worth hai, aur zyadaatar teams ke liye answer haan hai.

## Controls

**Tag everything.** Har resource team, service, environment, aur cost centre ke liye tags carry karta hai, aur tagging **enforced** hai. Consistent tags ke bina aap ek cost increase ko ek team ya ek change ko attribute nahi kar sakte.

**Budgets aur alerts.** Har team ya account ka ek monthly budget hai alerts ke saath actual aur forecast spend dono ke pachas, assi, aur sau percent par. Upar **anomaly detection** layer karo.

**Rightsize aur clean up.** Provider ke rightsizing advisor chalao aur har finding ko ek ticket banao. Alag se, pure waste ke liye sweep karo: kisi cheez se attached na block volumes, retention policy se purane snapshots, koi targets na wale load balancers.

**Schedule non-production.** Development, staging, aur test environments ko overnight ya weekends par run karne ki zaroorat nahi.

**Commit the baseline.** Steady 24/7 usage ko Savings Plans ya reservations se cover karo (Lesson 5).

**Architect for cost.** Cacheable content ko ek CDN ke through serve karo internet egress kaatne ke liye. Chatty request path ko ek single availability zone ke andar rakho. VPC endpoints ya Private Link use karo taaki S3, DynamoDB ko traffic NAT gateway ke bahar jaane ke bajaay provider ke private network par jaaye.

## FinOps

**FinOps** cloud cost ko ek shared, managed concern banane ki practice hai ek quarterly surprise ke bajaay. Ye Module 20 mein depth mein hai; core ek continuous loop hai:
- **Inform**: har team ko iske apne spend mein clear visibility do, consistent tagging dwara possible banaya gaya.
- **Optimise**: instances rightsize karo, baseline ke liye commitments khareedo, waste delete karo, aur wo paths re-architect karo jo sabse zyada cost karte hain.
- **Operate**: cost management ko continuous banao — budgets aur anomaly alerts har samay running, infrastructure changes ke liye code review mein ek cost consideration, per team ek short monthly cost review, aur unit-economics metrics.

Underlying principle ye hai ki cost latency, availability, aur security ke same category mein ek non-functional requirement hai — us team dwara owned jo service build aur run karti hai.`,

    examples: [
      {
        title: 'Anatomy of a surprising bill: where the money actually went',
        titleHi: 'Ek surprising bill ki anatomy: paisa actually kahaan gaya',
        code: `# a team expected ~$4,000/mo. the invoice was $11,200. the breakdown (Cost Explorer,
# grouped by service, then by usage type):

  EC2 - instances (on-demand + a small SP)          $3,900   (~as expected)
  EC2 - other:
    NAT Gateway - data processed                    $2,650   <-- ?!
    NAT Gateway - hours                             $   99
    cross-AZ data transfer                          $1,180   <-- ?!
  S3 - storage (Standard)                           $  610
  S3 - requests (PUT/GET)                           $  240
  RDS - instance + storage + Multi-AZ               $1,050
  data transfer out to internet                     $  520
  EBS - volumes                                     $  380
    ...of which UNATTACHED volumes                  $  190   <-- ?!
  EBS - snapshots                                   $  260   <-- growing every month
  CloudWatch - logs ingestion + storage             $  410   <-- verbose debug logging
  Elastic IPs not attached                          $   36
  ---
  TOTAL                                             $11,200

# ROOT CAUSES:
#  - every pod pulls its container image + npm/pip packages + calls 2 third-party
#    APIs THROUGH THE NAT GATEWAY on every scale-up. -> $2,750/mo of NAT.
#  - the 3 microservices are spread across 3 AZs and call each other synchronously
#    ~8x per request. every hop is cross-AZ. -> $1,180/mo.
#  - a batch job creates + deletes EBS volumes but the delete sometimes fails
#    silently -> 12 orphaned 1TB volumes.
#  - snapshot schedule has NO retention -> 400+ snapshots, oldest 14 months.
#  - log level left at DEBUG in prod -> 6x the log volume.`,
        output: `~$5,000/mo - almost half the bill - was in lines the team didn't know to look at:
NAT gateway processing, cross-AZ transfer, orphaned volumes, unbounded snapshots,
and debug logs. The compute they watched closely was fine. FIXES: VPC endpoints
for S3 + a pull-through image cache (kills most NAT), co-locate the chatty
services / make the calls async (kills cross-AZ), a lifecycle rule + a cleanup
job for volumes and snapshots, and log level -> INFO. Projected new bill: ~$4,600.`,
        explain: 'A team budgeting four thousand dollars a month receives an invoice for eleven thousand two hundred, and grouping the cost by service and then by usage type reveals that the compute they had been watching is almost exactly on target — the overage is entirely in lines they did not think to monitor. The largest single item after instances is NAT gateway data processing at over two and a half thousand dollars, because every pod, on every scale-up, pulls its container image and language packages and calls third-party APIs through the NAT gateway, and NAT charges per gigabyte processed. The next is cross-availability-zone transfer at nearly twelve hundred dollars, because three microservices are spread across three zones and call each other synchronously many times per request, so most internal hops cross a zone boundary and are billed in both directions. Then a set of smaller silent costs: a hundred and ninety dollars of block volumes left unattached because a batch job\'s cleanup step fails silently, two hundred and sixty dollars of snapshots from a schedule with no retention limit that has accumulated over a year, and four hundred dollars of log ingestion because the log level was left at debug in production. The compute was fine; the bill was made of the things around it. The fixes are architectural and operational: private endpoints and an image cache to remove the NAT traffic, co-location or asynchrony to remove the cross-zone traffic, lifecycle and cleanup automation for the storage waste, and a log-level change.',
        explainHi: 'Ek team jo ek mahine chaar hazaar dollar budget kar rahi hai gyarah hazaar do sau ke liye ek invoice receive karti hai, aur cost ko service se aur phir usage type se group karna reveal karta hai ki jo compute wo dekh rahe the wo lagbhag exactly target par hai — overage poori tarah un lines mein hai jinhe monitor karne ke baare mein unhone nahi socha. Instances ke baad sabse badha single item NAT gateway data processing hai dhai hazaar dollar se zyada, kyunki har pod, har scale-up par, apna container image aur language packages pull karta hai aur third-party APIs ko NAT gateway ke through call karta hai. Agla cross-availability-zone transfer hai barah sau dollar ke kareeb, kyunki teen microservices teen zones ke across spread hain aur ek doosre ko synchronously call karte hain per request kई baar. Phir chhoti silent costs ka ek set. Compute theek tha; bill iske aas-paas ki cheezon se bana tha.',
      },
      {
        title: 'The controls in code: enforced tags, a budget alert, and a scheduled shutdown',
        titleHi: 'Code mein controls: enforced tags, ek budget alert, aur ek scheduled shutdown',
        code: `# 1) ENFORCED TAGGING - an Organizations tag policy (or Azure Policy) that
#    DENIES creating a resource without the required tags:
{
  "tags": {
    "team":        { "tag_key": { "@@assign": "team" },
                     "enforced_for": { "@@assign": ["ec2:instance","rds:db","s3:bucket","..."] } },
    "environment": { "tag_key": { "@@assign": "environment" },
                     "tag_value": { "@@assign": ["prod","staging","dev"] },
                     "enforced_for": { "@@assign": ["ec2:instance","..."] } }
  }
}
# now an untagged 'terraform apply' fails at create time - tags can't be forgotten.

# 2) A BUDGET with actual + forecast alerts (Terraform, AWS):
resource "aws_budgets_budget" "team_platform" {
  name         = "platform-monthly"
  budget_type  = "COST"
  limit_amount = "5000"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"
  cost_filter { name = "TagKeyValue" values = ["user:team$platform"] }

  notification {                          # 80% of ACTUAL spend
    comparison_operator = "GREATER_THAN" ; threshold = 80 ; threshold_type = "PERCENTAGE"
    notification_type   = "ACTUAL" ; subscriber_email_addresses = ["platform-oncall@acme.io"]
  }
  notification {                          # 100% of FORECAST (pace, not just total)
    comparison_operator = "GREATER_THAN" ; threshold = 100 ; threshold_type = "PERCENTAGE"
    notification_type   = "FORECASTED" ; subscriber_email_addresses = ["platform-oncall@acme.io"]
  }
}
# + AWS Cost Anomaly Detection on the same tag -> Slack on any ML-detected spike.

# 3) SCHEDULED SHUTDOWN of non-prod (an EventBridge rule -> a Lambda, or the
#    AWS Instance Scheduler; Azure: Start/Stop VMs during off-hours):
#    stop   all  environment=dev|staging   at 20:00 weekdays + all Fri 20:00 -> Mon 07:00
#    start  them at 07:00 weekdays
#    -> non-prod runs ~50 of 168 hours/week instead of 168  = ~70% off non-prod compute`,
        output: `Three cheap, high-leverage controls: tagging that CANNOT be skipped (so every
later question about cost has an answer), a budget that alerts on both the total
AND the forecast pace (so you hear about a runaway on day 4, not day 30), and a
scheduler that stops dev/staging outside working hours (the single easiest ~70%
cut on non-prod spend). None of these require re-architecting anything.`,
        explain: 'Three inexpensive controls, each expressed as configuration. The first is an organisation-level tag policy that enforces the presence of a team tag and an environment tag from a fixed set on the resource types that drive cost, so that a create request without those tags fails — tags become impossible to forget rather than a convention people drift away from, and every future cost question has the data to answer it. The second is a budget scoped by the team tag with two notifications: one at eighty percent of actual month-to-date spend, and one at a hundred percent of the forecast, which projects the current run rate to month end. The forecast alert is the important one because it fires early — if spending is on track to double the budget, you hear about it on day four rather than discovering it on the invoice. Anomaly detection on the same tag adds a machine-learning layer that catches a sudden jump in any dimension. The third is a scheduler that stops development and staging environments outside working hours and on weekends and restarts them in the morning, which reduces their running time from a hundred and sixty-eight hours a week to about fifty — roughly a seventy percent cut on all non-production compute, with no architectural change and no impact on anyone, because nobody needs the dev environment at three in the morning on a Sunday.',
        explainHi: 'Teen inexpensive controls, har ek configuration ke roop mein express kiya gaya. Pehla ek organisation-level tag policy hai jo cost drive karne wale resource types par ek team tag aur ek fixed set se ek environment tag ki presence enforce karti hai, taaki un tags ke bina ek create request fail ho jaaye — tags bhoolना impossible ban jaate hain. Doosra team tag se scoped ek budget hai do notifications ke saath: ek actual month-to-date spend ke assi percent par, aur ek forecast ke sau percent par, jo current run rate ko month end tak project karta hai. Forecast alert important wala hai kyunki ye jaldi fire karta hai. Teesra ek scheduler hai jo development aur staging environments ko working hours ke bahar aur weekends par stop karta hai aur unhe subah restart karta hai, jo unke running time ko ek sau athsath ghante ek hafte se lagbhag pachas tak reduce karta hai — roughly ek sattar percent cut.',
      },
    ],

    mistakes: [
      {
        wrong: `# watching the compute line, ignoring data transfer and storage cruft
# monthly cost review: "EC2 is $3,900, about right. RDS $1,050, fine. Done."
# meanwhile, unlooked-at:
#   - NAT gateway processing has grown to $2,600 as the fleet scaled
#   - cross-AZ transfer is $900 and climbing with every new microservice
#   - 40 orphaned EBS volumes and 600 snapshots = $700
#   - CloudWatch logs at DEBUG = $500
# the bill is 40% larger than "the parts we look at" and drifting up every month.`,
        right: `# review the bill grouped by USAGE TYPE, not just by service:
#   Cost Explorer -> group by "Usage Type" (or "API Operation")
#   -> the NAT-DataProcessing-Bytes, DataTransfer-Regional-Bytes, EBS:VolumeUsage,
#      EBS:SnapshotUsage lines become visible
# set up, once:
#   - a monthly report that lists the top 20 usage types + their MoM change
#   - anomaly detection (flags a jump in ANY dimension automatically)
#   - Trusted Advisor / Cost Optimization Hub (idle + unattached + underused)
# the goal: no line item is invisible. a cost that no one can see always grows.`,
        why: 'Cost reviews that look at the bill grouped by service — EC2, RDS, S3 — naturally focus attention on the named compute and database lines and skip past the aggregated "EC2 - Other" and "data transfer" categories, which is exactly where the surprising growth tends to hide. NAT gateway data processing, cross-availability-zone transfer, unattached block volumes, an unbounded snapshot schedule, and verbose logging are all real recurring costs that scale with the fleet and rarely get a dedicated look, so a bill can be forty percent larger than "the parts we review" and drifting upward every month without anyone noticing. The fix is to review grouped by usage type or API operation rather than only by service, which surfaces those lines individually, and to set up a standing monthly report of the top twenty usage types with their month-over-month change plus anomaly detection that flags a jump in any dimension automatically. The operating principle is that a cost nobody can see is a cost that grows unchecked — visibility is the precondition for control.',
        whyHi: 'Cost reviews jo bill ko service se grouped dekhte hain — EC2, RDS, S3 — naturally attention named compute aur database lines par focus karte hain aur aggregated "EC2 - Other" aur "data transfer" categories ke aage skip karte hain, jo exactly wahaan hai jahaan surprising growth chhupti hai. NAT gateway data processing, cross-availability-zone transfer, unattached block volumes, ek unbounded snapshot schedule, aur verbose logging sab real recurring costs hain jo fleet ke saath scale karte hain aur rarely ek dedicated look paate hain. Fix usage type ya API operation se grouped review karna hai sirf service se nahi, jo un lines ko individually surface karta hai. Operating principle ye hai ki ek cost jise koi nahi dekh sakta ek cost hai jo unchecked badhti hai.',
      },
      {
        wrong: `# reacting to a big bill by cutting things that were already efficient
# the CFO sees the bill, panic ensues, and the team:
#   - downsizes the prod database to a smaller instance -> it thrashes, p99 doubles
#   - drops the Multi-AZ standby to save 50% on RDS -> no failover, one bad AZ = outage
#   - shortens log retention to 3 days -> the next incident has no history to debug
#   - cancels the Savings Plan renewal -> reverts to on-demand, bill goes UP
# meanwhile the $2,600/mo NAT gateway waste is untouched because nobody looked there.`,
        right: `# cut waste and inefficiency FIRST, in priority order, keep the safety margins:
#   1. delete pure waste (orphaned volumes, old snapshots, idle LBs/IPs) - $0 risk
#   2. schedule non-prod off-hours - $0 risk
#   3. rightsize from MEASURED utilisation with headroom - low risk, test it
#   4. fix the expensive architecture (NAT -> VPC endpoints, cross-AZ -> co-locate)
#   5. commit the (now-smaller) baseline with Savings Plans
#   only THEN, if still over budget, have the hard conversation about scope -
#   with data, not panic. never trade away availability or debuggability blindly.`,
        why: 'A large bill triggers a panic response, and panic cuts the visible, easy-to-change things rather than the wasteful ones — which are visible only if someone has done the analysis. Downsizing a production database that was correctly sized makes it thrash and doubles tail latency. Dropping the multi-AZ standby halves the RDS cost and removes the automatic failover, converting a routine zone incident into an outage. Shortening log retention to a few days saves a little and leaves the next incident with no history to investigate. Cancelling a Savings Plan renewal reverts the baseline to on-demand and increases the bill. All of this happens while the genuine waste — the NAT gateway processing, the orphaned volumes, the unbounded snapshots — sits untouched because nobody grouped the bill by usage type. The correct response is ordered: delete pure waste first because it carries no risk, then schedule non-production off-hours because that also carries no risk, then rightsize from measured utilisation with headroom, then fix the expensive architectural patterns, then commit the now-smaller baseline. Only after all of that, if the spend is still above budget, is it time for a data-driven conversation about scope — and even then, availability and debuggability are not things to trade away without a deliberate decision.',
        whyHi: 'Ek badha bill ek panic response trigger karta hai, aur panic visible, easy-to-change cheezein cut karta hai wasteful walon ke bajaay — jo visible sirf tab hain agar kisi ne analysis kiya. Ek production database ko downsize karna jo correctly sized tha ise thrash karta hai aur tail latency double karta hai. Multi-AZ standby drop karna RDS cost aadha karta hai aur automatic failover hataता hai. Log retention kuch din tak chhota karna thoda bachaता hai aur agle incident ko investigate karne ke liye koi history ke bina chhodता hai. Ye sab tab hota hai jab genuine waste — NAT gateway processing, orphaned volumes — untouched baitha hai. Correct response ordered hai: pehle pure waste delete karo kyunki isme koi risk nahi hai, phir non-production off-hours schedule karo, phir measured utilisation se rightsize karo, phir expensive architectural patterns fix karo, phir now-smaller baseline commit karo.',
      },
      {
        wrong: `# no unit-economics view -> can't tell "growing because successful" from "leaking"
# leadership: "cloud spend is up 30% this quarter - cut it."
# reality (which nobody can show because there's no metric): revenue is up 45%,
# and cost-per-customer actually FELL from $0.82 to $0.71. the spend growth is
# healthy. but with no unit metric, every cost conversation is a blunt "spend less".`,
        right: `# track cost as a RATIO to a business unit, per team/service:
#   $ per active customer      $ per 1000 API requests
#   $ per GB processed         $ per order / per build / per tenant
# compute it monthly from the tagged bill + a business number:
#   platform: $11,200 / 15,800 active customers = $0.71/customer  (was $0.82 - improving)
#   search:   $4,100  / 62M queries             = $0.066/1k queries (was $0.058 - watch this)
# now: "search unit cost rose 14%" is an actionable signal; "the bill went up" is not.
# a rising TOTAL with a falling or flat UNIT cost is success, not a problem.`,
        why: 'A cloud bill in absolute terms conveys almost nothing about whether spending is healthy, because a growing business should have a growing bill. Without a unit-economics view, a thirty percent quarterly increase reads as a problem and prompts a cost-cutting exercise, even when revenue grew forty-five percent in the same period and the cost to serve each customer actually fell. Conversely, a flat total bill can be hiding a service whose per-request cost is quietly climbing as it accumulates inefficiency. The fix is to express cost as a ratio to a meaningful business quantity, computed per team or service each month from the tagged bill and a business number: dollars per active customer, per thousand API requests, per gigabyte processed, per order, per build. This turns cost into an actionable signal — "search\'s unit cost rose fourteen percent this month" points at something specific to investigate — and it correctly distinguishes a rising bill that reflects growth, where the unit cost is flat or falling, from a rising bill that reflects a leak, where the unit cost is climbing. It is the metric that lets a cost conversation be about efficiency rather than a blunt instruction to spend less.',
        whyHi: 'Absolute terms mein ek cloud bill lagbhag kuch nahi convey karta ki spending healthy hai ya nahi, kyunki ek growing business ka ek growing bill hona chahiye. Ek unit-economics view ke bina, ek tees percent quarterly increase ek problem ki tarah padhता hai aur ek cost-cutting exercise prompt karता hai, even jab revenue same period mein pachees percent badha aur har customer ko serve karne ki cost actually giri. Fix cost ko ek meaningful business quantity ke ek ratio ke roop mein express karना hai, per team ya service har mahine tagged bill aur ek business number se computed: dollars per active customer, per thousand API requests, per gigabyte processed. Ye cost ko ek actionable signal mein badalता hai aur ek rising bill jo growth reflect karता hai ko ek rising bill jo ek leak reflect karता hai se sahi tarah distinguish karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**The $2.6k NAT surprise** — a Kubernetes platform team\'s bill jumped as the fleet grew; the growth was almost entirely NAT gateway data processing, from every pod pulling images and packages and calling third-party APIs through it. Adding S3/ECR VPC endpoints and a pull-through image cache cut NAT processing by ~85%.',
        hi: '**$2.6k NAT surprise** — ek Kubernetes platform team ka bill jump hua jaise fleet badha; growth lagbhag poori tarah NAT gateway data processing thi. S3/ECR VPC endpoints aur ek pull-through image cache add karne se NAT processing ~85% kata.',
      },
      {
        en: '**Panic cuts, kept the waste** — after a board comment on cloud spend, a team downsized prod RDS and dropped Multi-AZ. Two weeks later a zone event caused a 40-minute outage. The actual waste — 600 unretained snapshots, DEBUG logging, a dead staging cluster — was found later and was 3x the "savings" from the risky cuts.',
        hi: '**Panic cuts, waste rakha** — cloud spend par ek board comment ke baad, ek team ne prod RDS downsize kiya aur Multi-AZ drop kiya. Do hafte baad ek zone event ne ek 40-minute outage cause kiya. Actual waste baad mein mila aur risky cuts se "savings" ka 3x tha.',
      },
      {
        en: '**Unit cost told the real story** — a startup\'s cloud bill grew 4x in a year and finance wanted an audit. The team built a "$ per active tenant" metric: it had fallen from $6.10 to $3.40 as they scaled. The growth was pure success. The metric ended the recurring "why is cloud so expensive" argument.',
        hi: '**Unit cost ne real story batayi** — ek startup ka cloud bill ek saal mein 4x badha aur finance ne ek audit chaha. Team ne ek "$ per active tenant" metric banaya: ye $6.10 se $3.40 tak gira tha jaise unhone scale kiya. Growth pure success thi.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the main components of a cloud bill, and which ones typically surprise teams?',
        qHi: 'Ek cloud bill ke main components kya hain, aur kaun se typically teams ko surprise karte hain?',
        a: 'The main components are compute, storage, data transfer, the managed-service premium, and a tail of smaller items. Compute — VMs, containers, functions — is usually the largest line, priced per second or hour by size and reduced by commitments. Storage breaks down into object storage priced per gigabyte-month by storage class with per-request and cold-tier retrieval charges, block storage priced per gigabyte-month by type plus provisioned IOPS and throughput, and snapshots priced per gigabyte that accumulate silently. The managed-service premium is what you pay above raw infrastructure for a managed database or queue, in exchange for the operational work. The items that surprise teams are almost always data transfer and storage cruft. Ingress is free but egress is not, and the internal charges are easy to miss: traffic between availability zones in the same region costs about a cent per gigabyte each way, which a set of chatty microservices spread across zones runs up continuously; NAT gateway traffic is charged per gigabyte processed, so a private-subnet fleet pulling container images and packages and calling external APIs can generate a NAT bill larger than its compute; and internet egress is five to nine cents per gigabyte. On the storage side, block volumes left unattached after an instance is terminated keep billing, and an unbounded snapshot schedule grows every month. These lines hide in the aggregated "other" categories and rarely get a dedicated review.',
        aHi: 'Main components compute, storage, data transfer, managed-service premium, aur chhote items ki ek tail hain. Compute aam taur par sabse badhi line hai. Storage object storage mein breaks down hota hai per gigabyte-month storage class se priced, block storage per gigabyte-month type se plus provisioned IOPS, aur snapshots per gigabyte jo silently accumulate hote hain. Jo items teams ko surprise karte hain wo lagbhag hamesha data transfer aur storage cruft hain. Ingress free hai par egress nahi: same region mein availability zones ke beech traffic lagbhag ek cent per gigabyte har taraf cost karta hai; NAT gateway traffic per gigabyte processed charged hai, to ek private-subnet fleet jo container images aur packages pull karta hai ek NAT bill generate kar sakti hai jo iske compute se badha hai; aur internet egress paanch se nau cents per gigabyte hai. Storage side par, unattached block volumes billing rakhte hain, aur ek unbounded snapshot schedule har mahine badhta hai.',
      },
      {
        q: 'What controls keep a cloud bill from drifting, and in what order would you apply cost cuts?',
        qHi: 'Kaun se controls ek cloud bill ko drift karne se rokte hain, aur kis order mein aap cost cuts apply karoge?',
        a: 'The controls are enforced tagging so every resource is attributable to a team, service, and environment; per-team budgets with alerts at fractions of both actual and forecast spend plus anomaly detection for sudden jumps; regular rightsizing driven by the provider\'s advisor turned into tickets; a scheduler that stops non-production environments outside working hours; commitments for the steady baseline; and architectural choices that cut the expensive lines — CDN for cacheable content, single-zone hot paths, VPC endpoints so cloud-service traffic skips the NAT gateway, and storage classes matched to access patterns with lifecycle rules. The order for actually cutting cost matters because a panic response cuts the wrong things. First delete pure waste — unattached volumes, old snapshots, idle load balancers and IPs — which carries no risk. Second schedule non-production off-hours, also no risk and often a seventy percent cut on those environments. Third rightsize from measured utilisation with headroom, low risk but test it. Fourth fix the expensive architecture, like moving NAT traffic to private endpoints and co-locating chatty services. Fifth commit the now-smaller baseline with Savings Plans. Only after all of that, if still over budget, have the scope conversation, with data. And never trade away availability, like a multi-AZ standby, or debuggability, like log retention, blindly under pressure.',
        aHi: 'Controls enforced tagging hain taaki har resource ek team, service, aur environment ko attributable ho; per-team budgets alerts ke saath actual aur forecast spend dono ke fractions par plus anomaly detection; provider ke advisor dwara driven regular rightsizing tickets mein badla; ek scheduler jo non-production environments ko working hours ke bahar stop karta hai; steady baseline ke liye commitments; aur architectural choices jo expensive lines cut karte hain. Actually cost cut karne ka order matter karta hai kyunki ek panic response galat cheezein cut karta hai. Pehle pure waste delete karo. Doosre non-production off-hours schedule karo. Teesre measured utilisation se rightsize karo. Chauthe expensive architecture fix karo. Paanchve now-smaller baseline commit karo. Us sab ke baad hi, agar abhi bhi budget se upar, scope conversation karo, data ke saath. Aur kabhi availability ya debuggability blindly trade mat karo.',
      },
      {
        q: 'What is FinOps, and why is unit-economics tracking important?',
        qHi: 'FinOps kya hai, aur unit-economics tracking kyun important hai?',
        a: 'FinOps is the practice of making cloud cost a shared, continuously managed concern owned by the teams that build and run services, rather than a quarterly surprise that finance discovers and pushes back on. It runs as a loop: inform, meaning give every team clear visibility into its own spend, which requires consistent tagging and a dashboard the team actually uses; optimise, meaning rightsize, buy commitments for the baseline, delete waste, and re-architect the paths that cost the most; and operate, meaning make it continuous with always-on budgets and anomaly alerts, a cost consideration in code review for infrastructure changes, and a regular per-team cost review. The principle is that cost is a non-functional requirement in the same category as latency, availability, and security. Unit-economics tracking is central to this because an absolute bill tells you almost nothing about whether spending is healthy. A growing business should have a growing bill. Expressing cost as a ratio to a business quantity — dollars per active customer, per thousand requests, per gigabyte processed, per order — computed per service each month, turns cost into an actionable signal and distinguishes a rising bill that reflects growth, where unit cost is flat or falling, from a rising bill that reflects a leak, where unit cost is climbing. It lets a cost conversation be about efficiency and value rather than a blunt instruction to spend less, and it can end the recurring argument about why the cloud is expensive by showing that the cost to serve each unit of business is actually improving.',
        aHi: 'FinOps cloud cost ko ek shared, continuously managed concern banane ki practice hai jo un teams dwara owned hai jo services build aur run karti hain, ek quarterly surprise ke bajaay. Ye ek loop ke roop mein chalta hai: inform, matlab har team ko iske apne spend mein clear visibility do; optimise, matlab rightsize karo, baseline ke liye commitments khareedo, waste delete karo; aur operate, matlab ise continuous banao always-on budgets aur anomaly alerts ke saath. Principle ye hai ki cost latency, availability, aur security ke same category mein ek non-functional requirement hai. Unit-economics tracking iske liye central hai kyunki ek absolute bill aapko lagbhag kuch nahi batata ki spending healthy hai ya nahi. Cost ko ek business quantity ke ek ratio ke roop mein express karna — dollars per active customer, per thousand requests — cost ko ek actionable signal mein badalta hai aur ek rising bill jo growth reflect karta hai ko ek rising bill jo ek leak reflect karta hai se distinguish karta hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, break down the components of a cloud bill, with special attention to every data-transfer charge and where it applies.',
        taskHi: 'Ek comment mein, ek cloud bill ke components break down karo.',
        hint: 'COMPUTE: VMs / containers / functions — usually the biggest line; per second/hour × size, minus commitments (Lesson 5). STORAGE: (a) OBJECT (S3/Blob/GCS) — per GB-month PER STORAGE CLASS (hot/standard → infrequent-access → archive → deep-archive: cheaper to store, pricier + slower to retrieve, plus a minimum storage duration) + per-REQUEST charges (PUT > GET) + retrieval + early-deletion fees on cold tiers; (b) BLOCK (EBS/managed disks) — per GB-month by volume type + separate PROVISIONED IOPS + throughput charges; an idle unattached 1 TB gp3 still costs ~$80/mo; (c) SNAPSHOTS/BACKUPS — per GB, accumulate silently with no retention limit. DATA TRANSFER (the surprise): ingress ≈ FREE, egress is NOT — within one AZ: FREE; cross-AZ same region: ~$0.01/GB EACH WAY (chatty microservices across 3 AZs run this up continuously); cross-region: ~$0.02/GB; to the INTERNET: ~$0.05-0.09/GB for the first ~10 TB, tiering down; via a NAT GATEWAY: ~$0.045/GB PROCESSED + an hourly rate (a private-subnet fleet pulling images/packages/3rd-party APIs can exceed its compute bill); via a CDN: cheaper than direct egress, and cache hits incur NO origin transfer. MANAGED PREMIUM: RDS vs raw EC2+Postgres — you\'re buying patching/backups/failover/upgrades; the question is whether the eng time saved > the premium (usually yes). OTHER: load balancers (hourly + per-LCU/capacity-unit), PUBLIC IPv4 (~$3.60/mo EACH now), logs/metrics ingestion + retention, KMS, DNS queries, the support plan.',
        hintHi: 'COMPUTE: VMs / containers / functions — usually sabse badhi line; per second/hour × size, commitments minus. STORAGE: (a) OBJECT — per GB-month PER STORAGE CLASS + per-REQUEST charges + cold tiers par retrieval/early-deletion fees; (b) BLOCK — per GB-month type se + PROVISIONED IOPS + throughput; ek idle 1 TB gp3 ~$80/mo; (c) SNAPSHOTS — per GB, silently accumulate. DATA TRANSFER (surprise): ingress ≈ FREE, egress NAHI — ek AZ ke andar: FREE; cross-AZ same region: ~$0.01/GB EACH WAY (chatty microservices); cross-region: ~$0.02/GB; INTERNET ko: ~$0.05-0.09/GB; NAT GATEWAY ke through: ~$0.045/GB PROCESSED + hourly; CDN ke through: sasta, cache hits par KOI origin transfer nahi. MANAGED PREMIUM: RDS vs raw EC2+Postgres. OTHER: load balancers, PUBLIC IPv4 (~$3.60/mo HAR EK), logs ingestion + retention, KMS, DNS.',
      },
      {
        task: 'In a comment, list the cost controls (tagging, budgets, rightsizing, scheduling, commitment, architecture) and give the priority order for applying cost cuts.',
        taskHi: 'Ek comment mein, cost controls list karo aur cost cuts apply karne ka priority order do.',
        hint: 'CONTROLS: (1) TAG EVERYTHING — team / service / env / cost-center on every resource, ENFORCED (an Organizations tag policy / Azure Policy that DENIES an untagged create) → without it you cannot attribute a cost rise or charge teams back. (2) BUDGETS + ALERTS — per team/account, alerts at 50/80/100% of ACTUAL and of FORECAST (forecast fires early — day 4, not day 30) + ANOMALY DETECTION (ML flags a jump in ANY dimension). (3) RIGHTSIZE + CLEAN UP — Compute Optimizer / Azure Advisor → a ticket per over-provisioned thing; sweep for pure waste (unattached volumes, snapshots past retention, idle LBs, orphaned IPs, old AMIs). (4) SCHEDULE non-prod off-hours — stop dev/staging nights + weekends (~70% of 168 h/week) via an instance scheduler. (5) COMMIT the steady baseline — Savings Plans / reservations (Lesson 5). (6) ARCHITECT — CDN to cut internet egress; single-AZ hot path (accept the AZ risk) or co-locate chatty services / make calls async (cut cross-AZ); VPC endpoints / Private Link so S3/DynamoDB traffic skips the NAT gateway; the right storage class + lifecycle rules to age data down. PRIORITY ORDER FOR CUTS (a panic response cuts the wrong things — visible-but-efficient stuff — and leaves the waste): (1) delete PURE WASTE — $0 risk; (2) SCHEDULE non-prod off-hours — $0 risk, ~70% off those envs; (3) RIGHTSIZE from MEASURED utilisation with headroom — low risk, test it; (4) fix the EXPENSIVE ARCHITECTURE (NAT → endpoints, cross-AZ → co-locate); (5) COMMIT the now-smaller baseline; (6) ONLY THEN, if still over, a data-driven SCOPE conversation. NEVER blindly trade away availability (a Multi-AZ standby) or debuggability (log retention) under pressure.',
        hintHi: 'CONTROLS: (1) TAG EVERYTHING — har resource par team/service/env/cost-center, ENFORCED (untagged create DENY). (2) BUDGETS + ALERTS — per team, 50/80/100% ACTUAL aur FORECAST par + ANOMALY DETECTION. (3) RIGHTSIZE + CLEAN UP — Compute Optimizer → tickets; pure waste sweep. (4) SCHEDULE non-prod off-hours — ~70% of week. (5) COMMIT baseline — Savings Plans. (6) ARCHITECT — CDN, single-AZ hot path, VPC endpoints (NAT skip), storage class + lifecycle. PRIORITY ORDER FOR CUTS: (1) PURE WASTE delete — $0 risk; (2) SCHEDULE non-prod — $0 risk; (3) RIGHTSIZE from MEASURED util; (4) EXPENSIVE ARCHITECTURE fix; (5) COMMIT baseline; (6) SIRF PHIR data-driven SCOPE conversation. KABHI availability ya debuggability blindly trade mat karo.',
      },
      {
        task: 'In a comment, explain the FinOps loop (inform / optimise / operate) and unit economics — how you compute a unit cost and what a rising total with a falling unit cost means.',
        taskHi: 'Ek comment mein, FinOps loop aur unit economics samjhao.',
        hint: 'FINOPS = a PRACTICE (not a tool) that makes cloud cost a SHARED, continuously-managed concern OWNED BY THE TEAM that ships the service — a non-functional requirement like latency / availability / security, considered in design + review, NOT bolted on by finance afterwards. THE LOOP: INFORM — give every team clear visibility into ITS OWN spend (requires consistent enforced tagging + a dashboard the team actually looks at). OPTIMISE — rightsize instances, buy commitments for the baseline, delete waste, re-architect the paths that cost the most. OPERATE — make it CONTINUOUS not episodic: always-on budgets + anomaly alerts, a cost consideration in code review for infra changes, a short monthly per-team cost review, and unit-economics metrics. UNIT ECONOMICS = cost expressed as a RATIO to a meaningful business quantity, computed per team/service each month from (the tagged bill ÷ a business number): $ per active customer, $ per 1000 API requests, $ per GB processed, $ per order / per build / per tenant. Example: platform $11,200 / 15,800 active customers = $0.71/customer (was $0.82 → improving); search $4,100 / 62M queries = $0.066/1k (was $0.058 → watch it). WHY: an ABSOLUTE bill tells you almost nothing — a growing business SHOULD have a growing bill. A rising TOTAL with a FLAT or FALLING unit cost = SUCCESS (you\'re serving more, more efficiently) — not a problem. A rising total with a RISING unit cost = a LEAK — something specific to investigate. A flat total can hide a service whose per-request cost is quietly climbing. The unit metric turns "the bill went up, spend less" (blunt, unactionable) into "search\'s unit cost rose 14% this month" (specific, actionable) and can end the recurring "why is cloud so expensive" argument.',
        hintHi: 'FINOPS = ek PRACTICE (tool nahi) jo cloud cost ko ek SHARED, continuously-managed concern banati hai jo US TEAM dwara OWNED hai jo service ship karti hai — latency / availability / security jaisa ek non-functional requirement. LOOP: INFORM — har team ko ISKE APNE spend mein visibility do (enforced tagging + ek dashboard). OPTIMISE — rightsize, baseline ke liye commitments, waste delete, expensive paths re-architect. OPERATE — ise CONTINUOUS banao: always-on budgets + anomaly alerts, code review mein cost check, monthly per-team review, unit-economics metrics. UNIT ECONOMICS = cost ek meaningful business quantity ke RATIO ke roop mein (tagged bill ÷ ek business number): $ per active customer, $ per 1000 requests, $ per GB. WHY: ek ABSOLUTE bill lagbhag kuch nahi batata. Rising TOTAL + FLAT/FALLING unit cost = SUCCESS. Rising total + RISING unit cost = ek LEAK.',
      },
    ],

    keyTakeaways: [
      'A cloud bill = COMPUTE (usually biggest, per s/hr × size minus commitments) + STORAGE (object per GB-month PER TIER + per-request + cold retrieval fees; block per GB-month + provisioned IOPS/throughput — an idle 1 TB volume ≈ $80/mo; snapshots pile up) + DATA TRANSFER + MANAGED PREMIUM + a tail (LBs, public IPv4 ~$3.60/mo each, logs ingestion, KMS, DNS).',
      'DATA TRANSFER is the line that surprises everyone: ingress free, egress not. Within an AZ free; CROSS-AZ ~$0.01/GB each way (chatty microservices across zones run this up); cross-region ~$0.02/GB; INTERNET ~$0.05-0.09/GB; NAT GATEWAY ~$0.045/GB PROCESSED + hourly (a private-subnet fleet pulling images/packages/APIs can exceed its compute bill); CDN cheaper, cache hits free at origin.',
      'CONTROLS: ENFORCED tagging (team/service/env, denied if missing — the precondition for every cost question), per-team BUDGETS with actual + FORECAST alerts + anomaly detection, RIGHTSIZING advisor → tickets + a waste sweep (unattached volumes, old snapshots, idle LBs/IPs), SCHEDULE non-prod off-hours (~70% off those envs), COMMIT the baseline, and ARCHITECT for cost (CDN, single-AZ hot paths, VPC endpoints to skip NAT, storage tiers + lifecycle).',
      'CUT COSTS IN ORDER — a panic response cuts efficient-but-visible things and leaves the waste: (1) delete pure waste ($0 risk), (2) schedule non-prod off-hours ($0 risk), (3) rightsize from MEASURED utilisation with headroom, (4) fix the expensive architecture, (5) commit the now-smaller baseline, (6) only then a data-driven scope conversation. Never blindly trade away a Multi-AZ standby or log retention under pressure.',
      'FINOPS is a practice: INFORM (per-team spend visibility via tags), OPTIMISE (rightsize/commit/delete/re-architect), OPERATE (continuous budgets + anomaly alerts + cost in code review + a monthly review). Track UNIT ECONOMICS — $ per customer / per 1000 requests / per GB — because a rising total with a flat-or-falling unit cost is SUCCESS, and a rising unit cost is the actionable leak. Cost is a non-functional requirement owned by the shipping team.',
    ],
    keyTakeawaysHi: [
      'Ek cloud bill = COMPUTE (usually sabse badha) + STORAGE (object per GB-month PER TIER + per-request + cold retrieval fees; block per GB-month + provisioned IOPS — ek idle 1 TB volume ≈ $80/mo; snapshots pile up) + DATA TRANSFER + MANAGED PREMIUM + ek tail (LBs, public IPv4 ~$3.60/mo har ek, logs ingestion, KMS, DNS).',
      'DATA TRANSFER wo line hai jo sabko surprise karti hai: ingress free, egress nahi. Ek AZ ke andar free; CROSS-AZ ~$0.01/GB each way (chatty microservices); cross-region ~$0.02/GB; INTERNET ~$0.05-0.09/GB; NAT GATEWAY ~$0.045/GB PROCESSED + hourly (ek private-subnet fleet iske compute bill se zyada ho sakti hai); CDN sasta, cache hits origin par free.',
      'CONTROLS: ENFORCED tagging (team/service/env, missing hone par denied), per-team BUDGETS actual + FORECAST alerts + anomaly detection ke saath, RIGHTSIZING advisor → tickets + ek waste sweep, non-prod off-hours SCHEDULE (~70% off), baseline COMMIT karo, aur cost ke liye ARCHITECT karo (CDN, single-AZ hot paths, VPC endpoints NAT skip karne ke liye, storage tiers + lifecycle).',
      'COSTS ORDER MEIN CUT KARO — ek panic response efficient-but-visible cheezein cut karta hai aur waste chhodता hai: (1) pure waste delete ($0 risk), (2) non-prod off-hours schedule ($0 risk), (3) MEASURED utilisation se rightsize, (4) expensive architecture fix, (5) now-smaller baseline commit, (6) sirf phir ek data-driven scope conversation. Kabhi ek Multi-AZ standby ya log retention blindly trade mat karo.',
      'FINOPS ek practice hai: INFORM (tags ke through per-team spend visibility), OPTIMISE (rightsize/commit/delete/re-architect), OPERATE (continuous budgets + anomaly alerts + code review mein cost + ek monthly review). UNIT ECONOMICS track karo — $ per customer / per 1000 requests / per GB — kyunki ek rising total ek flat-ya-falling unit cost ke saath SUCCESS hai, aur ek rising unit cost actionable leak hai. Cost ek non-functional requirement hai jo shipping team dwara owned hai.',
    ],
  },
];
