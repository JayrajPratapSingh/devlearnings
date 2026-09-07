/**
 * DevOps Complete Course — Module 1: What DevOps Is & The Delivery Lifecycle, lessons 1-3.
 * Part I of the course: Foundations.
 *
 * Lesson 1: The problem DevOps solves — the dev/ops incentive conflict, the wall
 *           of confusion, shared ownership, and CALMS.
 * Lesson 2: The path from commit to production — the delivery pipeline, environments,
 *           promotion, and "build once, deploy many".
 * Lesson 3: Feedback loops & "you build it, you run it" — tightening every loop,
 *           on-call for your own code, and blameless culture.
 *
 * NOTE: This module is conceptual. Its examples are illustrative — pipeline
 * sketches, metric calculations, before/after scenarios — not machine-verified.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_1: CourseLesson[] = [
  {
    slug: 'ops-the-problem-devops-solves',
    title: 'The Problem DevOps Solves',
    titleHi: 'DevOps Jo Problem Solve Karta Hai',
    description: 'Historically, developers were paid to ship change and operators were paid to keep things stable — directly opposed incentives, with a wall between them over which work was thrown. DevOps is the removal of that wall: shared ownership of the whole path from idea to running software, supported by culture, automation, lean flow, measurement, and sharing (CALMS).',
    descriptionHi: 'Historically, developers change ship karne ke liye pay hote the aur operators cheezen stable rakhne ke liye — directly opposed incentives, unke beech ek wall ke saath jiske upar kaam phenka jata tha. DevOps us wall ka removal hai: idea se running software tak poore path ki shared ownership, culture, automation, lean flow, measurement, aur sharing (CALMS) se supported.',
    difficulty: 'EASY',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A restaurant where the chefs and the waiters have a locked door between the kitchen and the dining room, and pass plates through a hatch.** The chefs are judged on how many new dishes they invent; the waiters are judged on how few complaints they get. A chef invents a spectacular dish, shoves it through the hatch, and moves on. If it arrives cold, or the waiter cannot describe it, or a diner is allergic — that is the waiter\'s problem now. The waiters, tired of surprises, start refusing anything they did not see plated. Dishes pile up at the hatch. DevOps is taking the door off its hinges: the same people plan the menu, cook it, carry it out, watch diners eat it, and hear the feedback — so a dish that travels badly gets fixed by the person who made it.',
      hi: '**Ek restaurant jahaan chefs aur waiters ke beech kitchen aur dining room ke beech ek locked door hai, aur wo ek hatch ke through plates pass karte hain.** Chefs judge hote hain ki wo kitne naye dishes invent karte hain; waiters judge hote hain ki unhe kitni kam complaints milti hain. Ek chef ek spectacular dish invent karta hai, ise hatch ke through dhakelता hai, aur aage badh jata hai. Agar ye cold aata hai, ya waiter ise describe nahi kar sakta — ab wo waiter ki problem hai. Waiters, surprises se thak kar, kुछ bhi refuse karna shuru karte hain jo unhone plated nahi dekha. Dishes hatch par pile up hote hain. DevOps door ko iske hinges se hata dena hai: wahi log menu plan karte hain, ise cook karte hain, ise bahar carry karte hain, diners ko khate dekhते hain, aur feedback sunते hain.',
    },

    simple: `**THE OLD SPLIT — two teams, two goals, one wall:**
\`\`\`
DEVELOPERS            |  OPERATIONS
paid to: ship change  |  paid to: keep it stable / up
success = features    |  success = no incidents
wants: deploy often   |  wants: deploy rarely (every change is risk)
\`\`\`
=> the incentives POINT IN OPPOSITE DIRECTIONS. Work is "thrown over the wall":
dev finishes -> hands a build to ops -> "not my problem anymore".

**WHAT THE WALL CAUSED:**
\`\`\`
- slow releases (ops batches changes into a risky quarterly "big bang")
- blame after every incident ("dev's bug" vs "ops's server")
- devs never learn how their code fails in production
- ops never learn why a change was made
- a manual, tribal-knowledge handoff that breaks under load
\`\`\`

**DEVOPS = TAKE THE WALL DOWN.** One team owns the whole path: build it, ship it,
run it, watch it, fix it. Not a tool. Not a job title you hire. A way of working.

**CALMS — the five pillars:**
\`\`\`
Culture      | shared ownership, blameless, "you build it you run it"
Automation   | the path from commit to prod is scripted, repeatable, not manual
Lean         | small batches, fast flow, limit work-in-progress, reduce handoffs
Measurement  | you can SEE lead time, deploy frequency, failure rate, recovery time
Sharing      | knowledge, tools, on-call, and incident learnings are shared, not siloed
\`\`\`

**DEVOPS IS NOT:** a person called "the DevOps guy" who does deploys for everyone;
a specific tool (Docker/Jenkins/K8s are *how*, not *what*); a separate team you add
between dev and ops (that is just a new, third wall).`,

    simpleHi: `**PURANA SPLIT — do teams, do goals, ek wall:**
\`\`\`
DEVELOPERS            |  OPERATIONS
pay hote: change ship |  pay hote: stable / up rakhna
success = features    |  success = koi incidents nahi
chahte: aksar deploy  |  chahte: kabhi-kabhi deploy (har change risk hai)
\`\`\`
=> incentives OPPOSITE DIRECTIONS mein POINT karte hain. Kaam "wall ke upar phenka jata hai".

**WALL NE KYA CAUSE KIYA:**
\`\`\`
- slow releases (ops changes ko ek risky quarterly "big bang" mein batch karta hai)
- har incident ke baad blame ("dev ka bug" vs "ops ka server")
- devs kabhi nahi seekhते ki unka code production mein kaise fail hota hai
- ops kabhi nahi seekhते ki ek change kyun kiya gaya
- ek manual, tribal-knowledge handoff jo load ke under toot jata hai
\`\`\`

**DEVOPS = WALL GIRA DO.** Ek team poora path own karti hai: build karo, ship karo,
run karo, watch karo, fix karo. Ek tool nahi. Ek job title nahi jise aap hire karte ho.

**CALMS — paanch pillars:**
\`\`\`
Culture      | shared ownership, blameless, "you build it you run it"
Automation   | commit se prod tak ka path scripted, repeatable hai, manual nahi
Lean         | chhote batches, fast flow, work-in-progress limit, handoffs kam
Measurement  | aap lead time, deploy frequency, failure rate, recovery time DEKH sakते ho
Sharing      | knowledge, tools, on-call, aur incident learnings shared hain, siloed nahi
\`\`\`

**DEVOPS YE NAHI HAI:** ek vyakti jise "the DevOps guy" kehte hain jo sabke liye deploys
karta hai; ek specific tool; ek alag team jo aap dev aur ops ke beech add karते ho.`,

    content: `## Where the split came from

For most of software history, the people who **wrote** software and the people who **ran** it were different teams with different bosses, different tools, and — crucially — different definitions of success.

- A **developer** was measured by the change they delivered: features shipped, tickets closed, the roadmap advanced. Every deploy was progress.
- An **operator** (sysadmin, ops engineer) was measured by stability: uptime, no pages at 3am, no data loss. Every deploy was a **threat**, because the vast majority of incidents are triggered by a change.

These are not just different priorities; they are **opposed** ones. The developer's job is to introduce change; the operator's job is to resist it. Put them on separate teams and you get a structural conflict.

## The wall of confusion

The interface between the two teams became a **handoff**: the developer finishes, packages a build (or a deploy ticket, or a runbook), and hands it to operations. From that moment, in the old model, it is "ops's problem".

The results were predictable:

- **Releases got slow and big.** Because each deploy is risk, ops batches changes together and releases rarely — a "big bang" every month or quarter. Large releases are *more* likely to fail and *harder* to debug, so this made things worse, not better.
- **Every incident ended in blame.** Was it the developer's bug or the operator's misconfigured server? Both teams had incentive to point at the other, and neither had full visibility.
- **Developers never saw production.** They didn't know how their code behaved under real load, real data, real failures — so they kept writing code that behaved badly there.
- **Operators never saw the code.** They were handed an artifact with no context about why a change was made or how it was supposed to work.
- **The handoff itself was fragile.** It relied on documents, tickets, and tribal knowledge, and it broke down under pressure.

This friction-filled interface is often called the **wall of confusion**.

## DevOps: remove the wall

DevOps is, at its core, the decision to **stop handing work across a wall** and instead have the same people (or the same closely-collaborating team) own the entire path: designing a change, building it, testing it, deploying it, operating it in production, observing it, and responding when it breaks.

The phrase that captures it is **"you build it, you run it"** (Werner Vogels, Amazon, 2006): the team that writes a service is on call for it. This aligns the incentives — if your 2am page is caused by your own flaky code, you have a strong reason to make the code less flaky, add better health checks, and improve the deploy process.

Note what DevOps is **not**:

- It is **not a tool.** Docker, Kubernetes, Jenkins, Terraform, and Prometheus are things you might use to *do* DevOps, but buying them does not make an organisation "DevOps" any more than buying an oven makes you a chef.
- It is **not a job title you hire.** A single "DevOps engineer" who does everyone's deploys is just the old ops role with a new name — the wall is still there, it just moved.
- It is **not a third team** inserted between dev and ops. That creates *two* walls where there was one.

DevOps is a **way of working**: shared ownership, automated delivery, small fast changes, visible metrics, and shared learning.

## CALMS: the five dimensions

The common framework for what "doing DevOps" actually involves is **CALMS**:

**C — Culture.** Shared ownership of outcomes, not just outputs. Blameless response to failure (the goal is to learn, not to punish). Cross-functional teams. Psychological safety to say "I broke it" or "this is risky".

**A — Automation.** The path from a merged commit to running production code is a **script**, not a checklist a human follows. Builds, tests, security scans, packaging, provisioning, deployment, rollback — all automated, repeatable, and version-controlled. Humans approve; machines execute.

**L — Lean.** Ideas from lean manufacturing: work in **small batches** (a small change is easy to review, test, deploy, and debug), keep flow moving (limit work-in-progress, remove handoffs and wait states), and optimise for the whole pipeline's throughput, not any single stage's local efficiency.

**M — Measurement.** You cannot improve what you cannot see. Track how long a change takes to reach production (lead time), how often you deploy (frequency), how often a deploy causes a problem (change failure rate), and how fast you recover (time to restore). These are the DORA metrics (Lesson 4).

**S — Sharing.** Knowledge, tooling, and responsibility flow across the team and the organisation. Incident learnings are written up and read. On-call is rotated, not dumped on one person. Internal tools are documented and reusable. The opposite of siloed tribal knowledge.

## The point

DevOps did not appear because someone invented a cool tool. It appeared because the **organisational structure** of "developers throw code to operators" produced slow, fragile, blame-ridden software delivery — and the fix was structural: one team, one set of aligned incentives, owning the whole lifecycle, with automation and measurement making that ownership practical.`,

    contentHi: `## Split kahaan se aaya

Software history ke zyaादातर samay ke liye, jo log software **likhते** the aur jo ise **chalाते** the alag teams the alag bosses, alag tools, aur — crucially — success ki alag definitions ke saath.

- Ek **developer** us change se measure hota tha jo unhone deliver kiya: features shipped, tickets closed. Har deploy progress tha.
- Ek **operator** stability se measure hota tha: uptime, 3am par koi pages nahi. Har deploy ek **threat** tha, kyunki zyaादातर incidents ek change se trigger hote hain.

Ye sirf alag priorities nahi; ye **opposed** hain. Developer ka kaam change introduce karna hai; operator ka kaam ise resist karna hai.

## Wall of confusion

Do teams ke beech interface ek **handoff** ban gaya: developer finish karta hai, ek build package karta hai, aur ise operations ko hand karta hai. Us moment se, purane model mein, ye "ops ki problem" hai.

Results predictable the:
- **Releases slow aur big ho gaye.** Har deploy risk hai, to ops changes ko batch karta hai aur kabhi-kabhi release karta hai. Large releases *zyada* fail hone likely hain.
- **Har incident blame mein khatam hua.**
- **Developers ne kabhi production nahi dekha.**
- **Operators ne kabhi code nahi dekha.**
- **Handoff khud fragile tha.**

## DevOps: wall hata do

DevOps apne core mein, **ek wall ke aar-paar kaam handing band karne** ka decision hai aur iske bजाy wahi log poora path own karते hain: ek change design karna, ise build karna, test karna, deploy karna, production mein operate karna, observe karna, aur respond karna jab ye break hota hai.

Jo phrase ise capture karता hai wo hai **"you build it, you run it"**: jo team ek service likhती hai wo iske liye on call hai.

DevOps YE **nahi** hai: ek tool; ek job title jise aap hire karते ho; dev aur ops ke beech insert ki gayi ek teesri team.

## CALMS: paanch dimensions

**C — Culture.** Outcomes ki shared ownership. Failure ka blameless response. Cross-functional teams.

**A — Automation.** Ek merged commit se running production code tak ka path ek **script** hai, ek checklist nahi jo ek human follow karता hai.

**L — Lean.** **Chhote batches** mein kaam karो, flow moving rakhो, poore pipeline ke throughput ke liye optimise karो.

**M — Measurement.** Track karो ek change ko production tak pahunchne mein kitni der lagती hai, aap kitni baar deploy karте ho, ek deploy kitni baar ek problem cause karता hai, aur aap kitni jaldi recover karте ho.

**S — Sharing.** Knowledge, tooling, aur responsibility team aur organisation ke aar-paar flow karते hain.`,

    examples: [
      {
        title: 'Opposed incentives: the same deploy, two scorecards',
        titleHi: 'Opposed incentives: wahi deploy, do scorecards',
        code: `// a developer merges a feature and wants it live today.

// DEV scorecard for "deploy the feature now":
//   + roadmap item done, ticket closed, stakeholder happy      -> WIN

// OPS scorecard for "deploy the feature now":
//   - an untested change enters a system that is currently stable
//   - if it pages someone tonight, that's on ops
//   - ops had no input into the change and can't easily reason about it  -> RISK

// old model resolution: ops delays it into the monthly release with 40 other
//   changes -> the release is huge -> it breaks -> nobody can tell which of the
//   41 changes did it -> 6-hour incident -> both teams blame each other.

// DevOps resolution: the change is small, went through an automated pipeline
//   (tests + scan + canary), the team that wrote it is on call for it, and if it
//   misbehaves it's auto-rolled-back in minutes and fixed by its author tomorrow.`,
        output: `The old split makes every deploy a tug-of-war between "ship" and "stay stable", resolved by batching into rare, large, high-risk releases. DevOps aligns the incentives (one team owns build + run) so small changes flow continuously with automated safety.`,
        explain: 'When the people who benefit from a change and the people who bear its operational risk are on separate teams with separate success metrics, every deployment is a negotiation between opposed interests. The developer\'s incentive is to ship, because that is what they are measured on; the operator\'s incentive is to delay, because an unreviewed change to a stable system is pure downside for them and a page they will answer. The old resolution is to accumulate changes and release them together on a schedule, which is worse on every axis: a release containing dozens of changes is far more likely to contain a defect, and when it fails, isolating which change caused it is slow because they all landed at once. DevOps removes the negotiation by putting build and run under one team with one set of incentives, so the person deciding to ship is also the person who gets paged, which makes them care about the safety of the pipeline. Small changes can then flow continuously because each one is individually reviewable, testable, and reversible, and an automated pipeline enforces the checks that the operator used to enforce by refusing the handoff.',
        explainHi: 'Jab jo log ek change se benefit karते hain aur jo iska operational risk bear karते hain alag teams par hain alag success metrics ke saath, har deployment opposed interests ke beech ek negotiation hai. Developer ka incentive ship karna hai; operator ka incentive delay karna hai. Purana resolution changes accumulate karna aur unhe ek schedule par saath release karna hai, jo har axis par worse hai: dozens of changes waala ek release ek defect contain karne ke liye kahin zyada likely hai. DevOps negotiation ko hataता hai build aur run ko ek team ke under ek set of incentives ke saath rakhkर, to jo vyakti ship karne ka decide karता hai wahi vyakti page bhi hota hai.',
      },
      {
        title: 'CALMS as a checklist: is this actually DevOps?',
        titleHi: 'CALMS ek checklist ke roop mein: kya ye actually DevOps hai?',
        code: `// a company says "we do DevOps — we have Kubernetes and a Jenkins server".
// run it through CALMS:

// Culture:     devs file a ticket for the "DevOps team" to deploy.        [FAIL]
// Automation:  the pipeline exists but a human runs 6 manual steps after.  [PARTIAL]
// Lean:        releases are monthly, ~50 changes bundled.                  [FAIL]
// Measurement: nobody can say the lead time or change-failure rate.        [FAIL]
// Sharing:     only the "DevOps team" can touch prod; no shared on-call.   [FAIL]

// verdict: they bought DevOps TOOLS and kept the wall. This is "ops with
// extra steps", not DevOps. The tools are necessary but nowhere near sufficient.`,
        output: `Having container and CI tooling is not doing DevOps. CALMS is the test: shared ownership (not a gatekeeper team), a genuinely automated path, small frequent batches, visible delivery metrics, and shared responsibility including on-call. Tools enable these; they don't create them.`,
        explain: 'The most common misunderstanding of DevOps is to equate it with a toolset, so an organisation adopts containers, a CI server, and an orchestrator and declares the transformation complete while the underlying structure is unchanged. CALMS is useful precisely because it tests the structure rather than the tooling. If developers still request deploys from a separate team, the culture is unchanged and the wall has only been renamed. If the pipeline requires manual steps to complete a deployment, it is not automated in the sense that matters, because the manual steps are where errors and delays live. If releases are still large and infrequent, the lean principle of small batches is absent and the associated risk reduction is not being realised. If nobody can state the delivery metrics, there is no measurement and therefore no basis for improvement. If production access and on-call are confined to one group, responsibility is not shared. Tools are a prerequisite for doing these things at scale, but an organisation can own every fashionable tool and still be operating the old model with more moving parts.',
        explainHi: 'DevOps ki sabse common misunderstanding ise ek toolset ke barabar maनna hai, to ek organisation containers, ek CI server, aur ek orchestrator adopt karti hai aur transformation ko complete declare karti hai jab underlying structure unchanged hai. CALMS useful hai kyunki ye tooling ke bजाy structure ko test karता hai. Agar developers abhi bhi ek alag team se deploys request karते hain, culture unchanged hai. Agar pipeline ko ek deployment complete karne ke liye manual steps chahiye, ye automated nahi hai. Agar releases abhi bhi large aur infrequent hain, small batches ka lean principle absent hai. Tools in cheezon ke liye ek prerequisite hain, par ek organisation har fashionable tool own kar sakti hai aur abhi bhi purana model operate kar rahi ho.',
      },
      {
        title: '"You build it, you run it" changes what code gets written',
        titleHi: '"You build it, you run it" badalta hai ki kaunsा code likhа jata hai',
        code: `// BEFORE (dev throws to ops): a service with no timeout on an outbound call.
//   dev's view: "it works in my tests, ship it."
//   ops's view: when the dependency slows down, threads pile up, the service
//   hangs, ops gets paged, ops restarts it, ops files a ticket, dev deprioritises it.

// AFTER (the authoring team is on call): the same dev, now knowing THEY get the
//   3am page, writes:
//     - a 2s timeout + retry-with-backoff on the outbound call
//     - a circuit breaker so a dead dependency fails fast instead of hanging
//     - a /healthz that reflects dependency health
//     - a dashboard + an alert on the error rate
//   because the cost of NOT doing this now lands on them, not on a faceless
//   "ops" team.`,
        output: `When the team that writes a service also operates it, operational concerns - timeouts, retries, health checks, observability, safe rollout - stop being "ops's job to figure out later" and become part of writing the feature, because the author bears the cost of getting them wrong.`,
        explain: 'Code that is written by one team and operated by another tends to be optimised for passing the author\'s tests and satisfying the feature requirement, because that is what the author is accountable for, while the properties that matter in production — bounded resource use under a slow dependency, graceful failure, observability, a health signal that reflects reality — are left implicit, on the assumption that operations will handle whatever happens. When the same team operates the code, those properties become the author\'s problem directly, and specifically their problem at an inconvenient hour, which is a strong incentive to build them in from the start. A timeout on every outbound call, a circuit breaker around a fragile dependency, a health endpoint that fails when the service genuinely cannot serve traffic, a metric and an alert on the error rate: these are cheap to add while writing the feature and expensive to retrofit during an incident, and the team that is on call for the service is the team that will reliably remember to add them.',
        explainHi: 'Code jo ek team dwara likha jata hai aur doosri dwara operated hota hai author ke tests pass karne ke liye optimised hota hai, kyunki wahi hai jiske liye author accountable hai, jab wo properties jo production mein matter karती hain — ek slow dependency ke under bounded resource use, graceful failure, observability — implicit chhod di jati hain. Jab wahi team code operate karती hai, wo properties directly author ki problem ban jati hain, aur specifically ek inconvenient hour par unki problem, jo unhe start se build karne ka ek strong incentive hai. Har outbound call par ek timeout, ek fragile dependency ke around ek circuit breaker, ek health endpoint: ye ek feature likhते samay add karna sasta hai aur ek incident ke dauran retrofit karna mehnga.',
      },
    ],

    mistakes: [
      {
        wrong: `// "We're adopting DevOps" — so the company creates a DevOps team, moves the
// three ops people into it, renames them "DevOps Engineers", and routes all
// deploy requests to their Jira board.
// -> developers still don't own production. The DevOps team is now a bottleneck
//    AND a blame sink. Nothing structural changed; the wall just has a new sign.`,
        right: `// give each product team ownership of its own delivery and on-call. The
// central "platform" team (if you have one) builds the paved road — the shared
// pipeline, the deploy tooling, the observability stack — that product teams
// use SELF-SERVICE. They enable; they don't gatekeep. (Module 20.)`,
        why: 'Creating a team named "DevOps" and routing all deployment work to it reproduces the exact structure DevOps exists to dismantle: a separate group that stands between developers and production, receives work as a handoff, and is accountable for operational outcomes that the developers can influence but not own. The developers still do not experience how their code behaves in production, still are not paged when it fails, and still have no direct incentive to make it operable, while the new team becomes a queue that every change waits in and the party blamed when anything breaks. The structural change DevOps calls for is the opposite: each team that builds a service also deploys and operates it, so ownership and accountability sit together. Where a central team is useful, its role is to build and maintain the shared infrastructure — the pipeline, the deployment tooling, the monitoring platform — as a self-service product that the product teams consume without asking permission, which is the platform-engineering model. That team enables the product teams to own their delivery; it does not perform their delivery for them.',
        whyHi: '"DevOps" naam ki ek team banana aur saara deployment kaam ise route karna theek wo structure reproduce karता hai jise dismantle karne ke liye DevOps exist karता hai: ek alag group jo developers aur production ke beech khada hota hai, kaam ek handoff ke roop mein receive karता hai, aur operational outcomes ke liye accountable hai. Developers abhi bhi experience nahi karते ki unka code production mein kaise behave karता hai, abhi bhi page nahi hote. Structural change jo DevOps call karता hai wo opposite hai: har team jo ek service build karती hai ise deploy aur operate bhi karती hai. Jahaan ek central team useful hai, iski role shared infrastructure build aur maintain karna hai ek self-service product ke roop mein.',
      },
      {
        wrong: `// treating DevOps as purely a tooling project: "once we've migrated to
// Kubernetes and set up Argo CD, we'll be a DevOps org."
// -> 18 months later: the tools are in place, but releases are still monthly,
//    devs still can't see production logs, incidents still end in a blame
//    meeting, and nobody tracks lead time. The tools are underused because the
//    culture and incentives never changed.`,
        right: `// lead with the CALMS dimensions that aren't tooling:
//   - give teams production access + on-call for their services (Culture)
//   - agree to release small and often, measure it (Lean + Measurement)
//   - run blameless postmortems (Culture + Sharing)
// THEN the tools have a reason to exist and get used properly. Tools follow
// the way of working, not the other way around.`,
        why: 'A DevOps transformation framed as a migration to a set of technologies will install those technologies and stop, because the project has a clear finish line that is reached when the tools are running. But the tools only deliver value when they are used within a particular way of working: a continuous deployment pipeline is wasted if the organisation still chooses to release monthly, a monitoring platform is wasted if developers have no access to it or no responsibility for what it shows, and blameless postmortem tooling is wasted if the culture still runs blame meetings. The dimensions of CALMS that are not about tooling — shared ownership and on-call, the decision to work in small batches, blameless response to failure, tracking the delivery metrics — are what create demand for the tools and determine whether they are used well. Leading with those changes, and adopting tools as they become necessary to sustain them at scale, produces a transformation; leading with the tools produces an expensive stack that is operated in the old style.',
        whyHi: 'Ek DevOps transformation jo technologies ke ek set ki migration ke roop mein framed hai un technologies ko install karegi aur ruk jaegi, kyunki project ki ek clear finish line hai. Par tools sirf tab value deते hain jab wo ek particular way of working ke andar istemal hote hain: ek continuous deployment pipeline waste hai agar organisation abhi bhi monthly release karne ka choose karता hai, ek monitoring platform waste hai agar developers ke paas iska access nahi. CALMS ke wo dimensions jo tooling ke baare mein nahi hain — shared ownership aur on-call, small batches mein kaam karne ka decision, failure ka blameless response — wo hain jo tools ke liye demand create karते hain.',
      },
      {
        wrong: `// keeping developers away from production "for safety" — no prod access, no
// prod logs, ops runs all deploys.
// -> the people best positioned to diagnose and fix a bug in a service are
//    locked out of the environment where it's failing. Every prod issue becomes
//    a game of telephone: dev asks ops to run a query, ops pastes output, dev
//    asks for more, hours pass. MTTR is terrible and the fix is often blind.`,
        right: `// give developers scoped, audited production access: read logs/metrics/traces
// for their own services, run their own deploys and rollbacks, exec into their
// own pods. Guard rails (RBAC, audit logs, break-glass for the rest) make this
// safe. The team that wrote the code is the fastest at fixing it — if you let them.`,
        why: 'A common instinct is to protect production by restricting who can touch it, which in practice means the developers who wrote a service cannot see its logs, inspect its state, or run a deployment. During an incident this is directly counterproductive: the people with the deepest understanding of the code are the ones best able to interpret an error, form a hypothesis, and apply a fix, and cutting them off forces every diagnostic step to go through an intermediary who lacks that context, turning a minutes-long investigation into an hours-long relay. The safety the restriction was meant to provide is better achieved with scoped, audited access: a developer can read the observability data for their own services, deploy and roll back their own services, and get a shell in their own pods, with role-based access control limiting the blast radius, audit logging recording who did what, and a break-glass procedure for the rare case that someone needs broader access. This makes production access both safe and available to the people who can act on it fastest.',
        whyHi: 'Ek common instinct production ko protect karna hai restrict karke kaun ise touch kar sakta hai, jo practice mein matlab developers jinhone ek service likhी uske logs nahi dekh sakते, iski state inspect nahi kar sakते, ya ek deployment nahi chala sakते. Ek incident ke dauran ye directly counterproductive hai: code ki sabse deep understanding waale log ek error interpret karne, ek hypothesis form karne, aur ek fix apply karne ke liye sabse able hain, aur unhe cut off karna har diagnostic step ko ek intermediary ke through force karता hai. Jo safety restriction dene ke liye tha wo scoped, audited access se behtar achieve hoती hai: RBAC blast radius limit karта hai, audit logging record karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Amazon\'s "you build it, you run it" (2006)** — teams that write a service carry the pager for it, which is credited with driving the operational quality of their internal services and, later, AWS.',
        hi: '**Amazon ka "you build it, you run it" (2006)** — jo teams ek service likhती hain wo iske liye pager carry karती hain.',
      },
      {
        en: '**A company that ran quarterly "release weekends"** — 12-hour maintenance windows, all-hands, frequent rollbacks — moving to per-team continuous deployment over two years, cutting lead time from ~90 days to under a day.',
        hi: '**Ek company jo quarterly "release weekends" chalाती thi** — 12-hour maintenance windows — do saal mein per-team continuous deployment par move hui.',
      },
      {
        en: '**A "DevOps team" anti-pattern in the wild** — a central team of six that owned all deploys became a 3-week queue; the fix was disbanding it into embedded platform engineers and giving product teams their own pipelines.',
        hi: '**Wild mein ek "DevOps team" anti-pattern** — chah ki ek central team jo saare deploys own karती thi ek 3-week queue ban gayi.',
      },
    ],

    interviewQA: [
      {
        q: 'What problem does DevOps actually solve, and why did splitting dev and ops cause it?',
        qHi: 'DevOps actually kaunsी problem solve karता hai, aur dev aur ops ko split karna ise kyun cause karता tha?',
        a: 'DevOps solves the slow, fragile, blame-ridden software delivery that results from developers and operators being separate teams with opposed success metrics. Developers are measured on delivering change, so every deploy is progress for them; operators are measured on stability, and since most incidents are triggered by change, every deploy is a threat to them. That is a structural conflict, not just a difference in priorities. With the teams separated, the interface between them becomes a handoff — the developer finishes and passes a build to operations, after which it is operations\' problem — and this handoff, often called the wall of confusion, produces several bad outcomes. Operators batch changes into rare large releases to control risk, but large releases fail more often and are harder to debug. Every incident ends in blame because neither team has full visibility and both have incentive to point at the other. Developers never learn how their code fails in production, so they keep writing code that fails there, and operators never learn why a change was made. DevOps addresses this by removing the handoff: one team owns the whole path from building a change to operating it in production, so the incentives align, and automation plus measurement make that end-to-end ownership practical.',
        aHi: 'DevOps us slow, fragile, blame-ridden software delivery ko solve karता hai jo developers aur operators ke alag teams hone se opposed success metrics ke saath result hoती hai. Developers change deliver karne par measure hote hain, to har deploy unke liye progress hai; operators stability par measure hote hain, aur kyunki zyaादातर incidents change se trigger hote hain, har deploy unke liye ek threat hai. Teams separated ke saath, unke beech interface ek handoff ban jata hai — developer finish karता hai aur ek build operations ko pass karता hai — aur ye handoff кई bure outcomes produce karता hai. Operators changes ko rare large releases mein batch karते hain, par large releases zyada fail hote hain. Har incident blame mein khatam hota hai. DevOps ise handoff hatakar address karता hai: ek team poora path own karती hai.',
      },
      {
        q: 'What is CALMS, and how does it distinguish real DevOps from just having the tools?',
        qHi: 'CALMS kya hai, aur ye real DevOps ko sirf tools hone se kaise distinguish karता hai?',
        a: 'CALMS is a five-part framework for what a DevOps way of working actually consists of: Culture, Automation, Lean, Measurement, and Sharing. Culture means shared ownership of outcomes, blameless response to failure, and teams that both build and run their services. Automation means the path from a merged commit to running production code is a repeatable script rather than a checklist a human works through. Lean means working in small batches so each change is easy to review, test, deploy, and debug, and keeping flow moving by limiting work in progress and removing handoffs. Measurement means tracking the delivery metrics — how long a change takes to reach production, how often you deploy, how often a deploy causes a problem, how fast you recover — so you have a basis for improvement. Sharing means knowledge, tooling, and responsibility including on-call flow across the team rather than being siloed. CALMS distinguishes real DevOps from tooling because it tests the structure and the way of working, not the technology. An organisation can run containers, a CI server, and an orchestrator while developers still request deploys from a gatekeeper team, releases are still monthly, the pipeline still needs manual steps, nobody tracks lead time, and only one group has production access. That organisation has bought DevOps tools and kept the wall. The tools are necessary to do these things at scale but they do not by themselves change how the organisation works.',
        aHi: 'CALMS ek five-part framework hai ki ek DevOps way of working actually kis cheez se banता hai: Culture, Automation, Lean, Measurement, aur Sharing. Culture matlab outcomes ki shared ownership, failure ka blameless response, aur teams jo apni services dono build aur run karती hain. Automation matlab ek merged commit se running production code tak ka path ek repeatable script hai. Lean matlab small batches mein kaam karna. Measurement matlab delivery metrics track karna. Sharing matlab knowledge, tooling, aur responsibility including on-call team ke aar-paar flow karते hain. CALMS real DevOps ko tooling se distinguish karता hai kyunki ye structure aur way of working ko test karता hai, technology ko nahi. Ek organisation containers aur ek CI server chala sakती hai jab developers abhi bhi ek gatekeeper team se deploys request karते hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list the four bad outcomes the dev/ops "wall of confusion" produces, and for each, explain the mechanism that causes it.',
        taskHi: 'Ek comment mein, chaar bure outcomes list karo jo dev/ops "wall of confusion" produce karता hai.',
        hint: '(1) Slow/large releases — ops batches changes to control risk, but large releases fail more and are harder to debug. (2) Blame after incidents — neither team has full visibility, both are incentivised to point at the other. (3) Devs write code that fails in prod — they never see how it behaves there. (4) Fragile handoff — relies on docs/tickets/tribal knowledge, breaks under pressure.',
        hintHi: '(1) Slow/large releases — ops risk control ke liye batch karता hai. (2) Blame — koi team ki full visibility nahi. (3) Devs prod-mein-fail code likhते hain — wo kabhi nahi dekhते. (4) Fragile handoff — docs/tickets/tribal knowledge par relies.',
      },
      {
        task: 'A company has Kubernetes, GitHub Actions, and Prometheus, and calls itself a DevOps org. In a comment, write the 5 CALMS questions you\'d ask to check whether that\'s true, and what a "fail" answer looks like for each.',
        taskHi: 'Ek company ke paas Kubernetes, GitHub Actions, aur Prometheus hai, aur khud ko ek DevOps org kehती hai. Ek comment mein, 5 CALMS questions likho.',
        hint: 'Culture: do devs own deploy + on-call, or is there a gatekeeper team? (fail: they file a ticket). Automation: is the commit→prod path fully scripted? (fail: manual steps after the pipeline). Lean: how big/frequent are releases? (fail: monthly, 50 changes). Measurement: can they state lead time + change-fail rate? (fail: no). Sharing: is prod access + on-call shared? (fail: one team only).',
        hintHi: 'Culture: devs deploy + on-call own karते hain? Automation: commit→prod path fully scripted? Lean: releases kitni big/frequent? Measurement: lead time + change-fail rate state kar sakते hain? Sharing: prod access + on-call shared?',
      },
      {
        task: 'In a comment, explain how "you build it, you run it" changes what code a developer writes, using a concrete example of an operational property they\'d add once they\'re the one on call.',
        taskHi: 'Ek comment mein, samjhao ki "you build it, you run it" kaise badalta hai ki ek developer kaunsा code likhता hai.',
        hint: 'Example: an outbound HTTP call. Thrown-over-the-wall version has no timeout — when the dependency slows, threads pile up and the service hangs; ops gets paged and restarts it. On-call-for-your-own-code version adds a timeout + retry-with-backoff + circuit breaker + a /healthz reflecting dependency health + an alert on the error rate — because the 3am page is now theirs.',
        hintHi: 'Example: ek outbound HTTP call. Thrown-over-the-wall version mein koi timeout nahi. On-call version timeout + retry-with-backoff + circuit breaker + /healthz + error-rate alert add karता hai — kyunki 3am page ab unka hai.',
      },
    ],

    keyTakeaways: [
      'The dev/ops split created OPPOSED INCENTIVES: developers are measured on shipping change (every deploy = progress), operators on stability (every deploy = risk, since most incidents are change-triggered). Separate teams ⇒ a structural conflict, not just different priorities.',
      'The "WALL OF CONFUSION" (the handoff between the teams) causes: slow/large batched releases (which fail more and are harder to debug), blame after every incident (no team has full visibility), devs who never see how their code fails in prod, ops who never see why a change was made, and a fragile docs/tickets/tribal-knowledge handoff.',
      'DEVOPS = remove the wall: ONE team owns the whole path — build it, ship it, run it, watch it, fix it. "YOU BUILD IT, YOU RUN IT" (the authoring team is on call) aligns the incentives — your own 3am page makes you build in timeouts, health checks, observability, and safe rollout from the start.',
      'DEVOPS IS NOT: a tool (Docker/K8s/Jenkins are HOW, not WHAT); a job title you hire ("the DevOps guy" = the old ops role renamed, wall intact); a third team inserted between dev and ops (= two walls). It\'s a WAY OF WORKING.',
      'CALMS — the five pillars, and the test for whether an org actually does DevOps vs just owning the tools: CULTURE (shared ownership, blameless, you-build-it-you-run-it), AUTOMATION (commit→prod is a scripted repeatable path, not a manual checklist), LEAN (small batches, fast flow, fewer handoffs), MEASUREMENT (lead time / deploy frequency / change-fail rate / recovery time are visible), SHARING (knowledge, tooling, on-call, incident learnings are shared, not siloed).',
    ],
    keyTakeawaysHi: [
      'Dev/ops split ne OPPOSED INCENTIVES banaye: developers change shipping par measure hote hain (har deploy = progress), operators stability par (har deploy = risk). Alag teams ⇒ ek structural conflict.',
      '"WALL OF CONFUSION" (teams ke beech handoff) cause karता hai: slow/large batched releases (jo zyada fail hote hain), har incident ke baad blame, devs jo kabhi nahi dekhते unka code prod mein kaise fail hota hai, ops jo kabhi nahi dekhते ek change kyun kiya gaya, aur ek fragile handoff.',
      'DEVOPS = wall hatao: EK team poora path own karती hai — build, ship, run, watch, fix. "YOU BUILD IT, YOU RUN IT" (authoring team on call hai) incentives align karता hai — aapка apna 3am page aapko start se timeouts, health checks, observability build karवाता hai.',
      'DEVOPS YE NAHI HAI: ek tool (Docker/K8s HOW hain, WHAT nahi); ek job title jise aap hire karते ho; dev aur ops ke beech insert ki gayi ek teesri team. Ye ek WAY OF WORKING hai.',
      'CALMS — paanch pillars, aur test ki ek org actually DevOps karती hai vs sirf tools own karती hai: CULTURE (shared ownership, blameless), AUTOMATION (commit→prod ek scripted repeatable path hai), LEAN (small batches, fast flow), MEASUREMENT (lead time / deploy frequency / change-fail rate / recovery time visible hain), SHARING (knowledge, tooling, on-call shared hain).',
    ],
  },

  {
    slug: 'ops-commit-to-production-path',
    title: 'The Path from Commit to Production',
    titleHi: 'Commit Se Production Tak Ka Path',
    description: 'A change travels through a sequence of stages and environments — local, CI, then progressively more production-like environments — each adding confidence. The core discipline is "build once, promote the same artifact", with only configuration changing between environments.',
    descriptionHi: 'Ek change stages aur environments ke ek sequence ke through travel karता hai — local, CI, phir progressively zyada production-jaisे environments — har ek confidence add karता hai. Core discipline "ek baar build karo, wahi artifact promote karo" hai, sirf configuration environments ke beech badalti hai.',
    difficulty: 'EASY',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A new aircraft part doesn\'t go straight from the workshop onto a passenger flight.** It goes: bench test → ground rig → a test airframe → a few flights with no passengers → then the fleet. Each stage is more realistic and more expensive to run, and each is a filter — a part that fails on the bench never reaches the test flight. Crucially, it is the *same physical part* moving through the stages, not a new one rebuilt each time; only the conditions around it change. Shipping software works the same way: the identical build moves through progressively more production-like environments, and only its configuration (which database, which secrets, how much traffic) changes along the way.',
      hi: '**Ek naya aircraft part workshop se seedhे ek passenger flight par nahi jata.** Ye jata hai: bench test → ground rig → ek test airframe → bina passengers ke kुछ flights → phir fleet. Har stage zyada realistic aur run karne mein zyada mehngा hai, aur har ek ek filter hai — ek part jo bench par fail hota hai kabhi test flight tak nahi pahunchता. Crucially, ye *wahi physical part* hai jo stages ke through move karता hai, har baar rebuild kiya gaya ek naya nahi; sirf iske around conditions badalti hain. Software shipping wahi tarike se kaam karता hai: identical build progressively zyada production-jaisे environments ke through move karता hai, aur sirf iski configuration badalti hai.',
    },

    simple: `**THE PIPELINE — a change flows through STAGES, gaining confidence at each:**
\`\`\`
commit ─▶ BUILD ─▶ UNIT TESTS ─▶ LINT + SECURITY SCAN ─▶ PACKAGE (one artifact)
       ─▶ deploy to DEV/INTEGRATION ─▶ INTEGRATION/E2E TESTS
       ─▶ deploy to STAGING ─▶ smoke tests + manual check (optional)
       ─▶ deploy to PRODUCTION ─▶ smoke tests + watch metrics
\`\`\`
A failure at any stage STOPS the change. Earlier stages are fast + cheap; later
stages are slow + realistic. Catch bugs as early (and left) as possible.

**ENVIRONMENTS — progressively more production-like:**
\`\`\`
local        | your laptop. fake/seed data. fastest loop.
CI           | ephemeral, clean, per-commit. runs tests in isolation.
dev / integ  | shared, always-on. services talk to each other. real-ish data.
staging      | a mirror of prod (same infra, scaled down). last check before prod.
production   | real users, real data, real traffic, real money.
preview/PR   | ephemeral, one per pull request. auto-created, auto-destroyed.
\`\`\`

**BUILD ONCE, PROMOTE THE SAME ARTIFACT.**
\`\`\`
BAD:  rebuild from source for each environment  -> "works in staging, broken in prod"
      because the two builds differ (dep versions, build host, timing)
GOOD: build ONE immutable artifact (a container image by digest) -> deploy that
      EXACT artifact to dev, then staging, then prod. Only CONFIG changes.
\`\`\`

**CONFIG IS PER-ENVIRONMENT, injected at deploy time (12-factor):**
\`\`\`
same image  +  DEV config   (dev db url, debug logging, test payment keys)
same image  +  PROD config  (prod db url, warn logging, live payment keys)
\`\`\`
Never bake environment-specific values into the artifact.`,

    simpleHi: `**PIPELINE — ek change STAGES ke through flow karता hai, har par confidence gain karते hue:**
\`\`\`
commit ─▶ BUILD ─▶ UNIT TESTS ─▶ LINT + SECURITY SCAN ─▶ PACKAGE (ek artifact)
       ─▶ DEV/INTEGRATION deploy ─▶ INTEGRATION/E2E TESTS
       ─▶ STAGING deploy ─▶ smoke tests + manual check (optional)
       ─▶ PRODUCTION deploy ─▶ smoke tests + metrics watch
\`\`\`
Kisi bhi stage par ek failure change ko ROK deta hai. Pehle stages fast + saste;
baad ke stages slow + realistic. Bugs ko jitna jaldi possible catch karo.

**ENVIRONMENTS — progressively zyada production-jaisे:**
\`\`\`
local        | aapका laptop. fake/seed data. fastest loop.
CI           | ephemeral, clean, per-commit.
dev / integ  | shared, always-on. services ek doosre se baat karते hain.
staging      | prod ka ek mirror (same infra, scaled down).
production   | real users, real data, real traffic, real money.
preview/PR   | ephemeral, prati pull request ek. auto-created, auto-destroyed.
\`\`\`

**EK BAAR BUILD KARO, WAHI ARTIFACT PROMOTE KARO.**
\`\`\`
BURA:  har environment ke liye source se rebuild karo  -> "staging mein kaam karता hai, prod mein toota"
ACHHA: EK immutable artifact build karo (digest se ek container image) -> WAHI EXACT
       artifact dev, phir staging, phir prod deploy karo. Sirf CONFIG badalti hai.
\`\`\`

**CONFIG PER-ENVIRONMENT hai, deploy time par injected (12-factor):**
\`\`\`
same image  +  DEV config   (dev db url, debug logging, test payment keys)
same image  +  PROD config  (prod db url, warn logging, live payment keys)
\`\`\`
Kabhi environment-specific values ko artifact mein bake mat karo.`,

    content: `## The delivery pipeline

Getting a change from a developer's editor to running in production is a **pipeline**: an ordered sequence of automated stages, each of which must pass before the next runs. If any stage fails, the change stops there and does not proceed.

A typical pipeline:

1. **Build** — compile / bundle / assemble the code into a runnable form.
2. **Unit tests** — fast, isolated tests of individual functions and modules.
3. **Static analysis** — linting, type checking, formatting, and security scanning (SAST, dependency vulnerabilities, secret detection).
4. **Package** — produce a single immutable **artifact**: most commonly a container image, tagged by a content digest. This is the thing that will be deployed everywhere.
5. **Deploy to an integration environment** and run **integration / end-to-end tests** — slower tests that exercise the service against real dependencies (a real database, other services).
6. **Deploy to staging** — a production-like environment. Optionally run smoke tests and a manual check.
7. **Deploy to production** — run smoke tests (a handful of critical-path checks), then watch metrics and error rates closely for a while.

The stages are ordered by **cost and realism**: unit tests run in seconds and catch simple bugs; end-to-end tests take minutes and catch integration bugs; production is the only fully realistic environment but the most expensive place to discover a problem. The principle is **shift left** — move each check as early in the pipeline as it can meaningfully run, so failures are caught when they are cheap.

## Environments

An **environment** is a complete running copy of the system: the application, its databases, its configuration, its infrastructure. Changes move through a series of them, each more production-like than the last:

- **Local** — the developer's own machine. Fake or seeded data, mocked external services, the fastest possible edit-run-check loop. Not shared.
- **CI** — a clean, ephemeral environment created per commit to run the build and tests in isolation, then thrown away. Guarantees "it doesn't just work on my machine".
- **Dev / integration** — a shared, always-on environment where the team's services run together and talk to each other, with realistic (but not real-user) data. Where integration issues surface.
- **Staging (a.k.a. pre-prod, UAT)** — a close mirror of production: the same infrastructure, the same deployment process, ideally a sanitised copy of production data, usually scaled down. The last gate before real users. A change that works in staging and fails in production means staging is not faithful enough.
- **Production** — real users, real data, real traffic, real revenue. The environment that actually matters.
- **Preview / ephemeral environments** — a full, temporary environment spun up automatically for a single pull request, so reviewers and stakeholders can click through the change before it merges, then destroyed when the PR closes. Requires infrastructure-as-code and cheap provisioning.

Not every organisation has all of these, and more environments means more to maintain and keep in sync. A common minimal set is **local → CI → staging → production**.

## Build once, promote the same artifact

The single most important discipline in the pipeline: **build the deployable artifact exactly once, and promote that identical artifact through every environment.**

The wrong way is to rebuild from source separately for each environment — build for staging, test it, then build again for production and deploy that. The two builds are **not guaranteed to be identical**: dependency versions can resolve differently, the build host or toolchain can differ, timestamps and ordering can vary, a transient network issue can pull a different package. So "it passed all tests in staging" tells you nothing reliable about the artifact now running in production, because it is a *different artifact*.

The right way:

- The pipeline builds **one immutable artifact** — a container image, identified by its **digest** (a content hash like \`sha256:abc123...\`), not just a mutable tag.
- That exact artifact — same bytes, same digest — is deployed to the integration environment, then staging, then production. Each environment "promotes" the artifact it tested.
- The tests in each environment are therefore testing **the thing that will actually run in production**.

This is why container images (immutable, content-addressed, portable) became the standard unit of deployment.

## Configuration is per-environment

If the artifact is identical everywhere, how does it connect to the staging database in staging and the production database in production? **Configuration is injected at deploy time, from outside the artifact.**

Following the **twelve-factor** principle of strict separation of config from code:

- Anything that differs between environments — database URLs, API endpoints, credentials, feature flags, log levels, resource limits, the payment provider's test-vs-live keys — is **not in the artifact**. It is supplied as environment variables, mounted config files, or fetched from a secret store when the container starts.
- The same image, given dev config, is a dev instance; given production config, is a production instance.
- Secrets in particular are never baked into an image (anyone who can pull the image can extract them) — they come from a secret manager (Module 19).

The test for whether config is properly externalised: **could you open-source the artifact without leaking anything, and could the same artifact run in a completely different environment given only new config?** If yes, you have done it right.

## Putting it together

A change flows: commit → CI builds and tests one artifact → that artifact deploys to integration and passes integration tests → the same artifact deploys to staging and passes smoke tests → the same artifact deploys to production, configured for production, and is watched. Every environment tests the real artifact; only configuration changes between them; and a failure at any stage halts the change before it can affect users.`,

    contentHi: `## Delivery pipeline

Ek change ko ek developer ke editor se production mein running tak lana ek **pipeline** hai: automated stages ka ek ordered sequence, har ek jise agle ke chalne se pehle pass hona chahiye. Agar koi stage fail hota hai, change wahaan ruk jata hai.

Ek typical pipeline: Build → Unit tests → Static analysis (lint, type check, security scan) → Package (ek immutable artifact) → integration environment deploy + integration/E2E tests → staging deploy → production deploy + smoke tests + metrics watch.

Stages **cost aur realism** se ordered hain. Principle **shift left** hai — har check ko pipeline mein jitni jaldi possible move karो.

## Environments

Ek **environment** system ki ek complete running copy hai:
- **Local** — developer ki apni machine. Fake/seeded data. Fastest loop. Shared nahi.
- **CI** — ek clean, ephemeral environment prati commit created.
- **Dev / integration** — ek shared, always-on environment jahaan team ki services saath chalती hain.
- **Staging** — production ka ek close mirror. Real users se pehle last gate.
- **Production** — real users, real data, real traffic, real revenue.
- **Preview / ephemeral** — ek single pull request ke liye automatically spun up ek full temporary environment.

Ek common minimal set **local → CI → staging → production** hai.

## Ek baar build karo, wahi artifact promote karo

Pipeline mein sabse important discipline: **deployable artifact ko theek ek baar build karो, aur wahi identical artifact har environment ke through promote karो.**

Galat tarika har environment ke liye source se alag se rebuild karna hai. Do builds **identical hone ke liye guaranteed nahi hain**: dependency versions alag resolve ho sakती hain, build host alag ho sakta hai. To "staging mein saare tests pass hue" production mein ab running artifact ke baare mein kुछ reliable nahi bताता, kyunki ye ek *alag artifact* hai.

Sahi tarika: pipeline **ek immutable artifact** build karता hai — ek container image, iske **digest** se identified. Wahi exact artifact integration, phir staging, phir production deploy hota hai.

## Configuration per-environment hai

Agar artifact har jagah identical hai, ye staging mein staging database se aur production mein production database se kaise connect hota hai? **Configuration deploy time par inject hoती hai, artifact ke bahar se.**

**Twelve-factor** principle follow karте hue: jo bhi environments ke beech differ karता hai — database URLs, credentials, feature flags, log levels — **artifact mein nahi hai**. Ye environment variables, mounted config files, ya ek secret store se supplied hai. Secrets kabhi ek image mein bake nahi hote.`,

    examples: [
      {
        title: 'Build once: the same image digest through every environment',
        titleHi: 'Ek baar build karo: har environment ke through wahi image digest',
        code: `# CI builds ONE image and records its digest:
$ docker build -t registry.example.com/api:git-4f9a2c1 .
$ docker push registry.example.com/api:git-4f9a2c1
  digest: sha256:9c1e...c0ffee

# every environment deploys THAT digest — not a rebuild, not "latest":
#   integration:  image: registry.example.com/api@sha256:9c1e...c0ffee
#   staging:      image: registry.example.com/api@sha256:9c1e...c0ffee
#   production:   image: registry.example.com/api@sha256:9c1e...c0ffee

# the integration and staging tests ran against sha256:9c1e...c0ffee,
# so "it passed staging" is a real statement about what's now in production.`,
        output: `The pipeline produces exactly one artifact, addressed by its content digest, and every environment deploys that same digest. Tests in each environment therefore validate the identical bytes that will run in production - unlike a per-environment rebuild, where "passed staging" describes a different artifact.`,
        explain: 'Deploying by content digest rather than by a mutable tag or a fresh build guarantees that the bytes running in each environment are identical. A digest is a hash of the image contents, so two deployments referencing the same digest are provably the same image, whereas a tag like a version number or the word latest can be repointed to a different image at any time, and a rebuild from source can silently differ because dependency resolution, the build environment, and timing are not perfectly reproducible. When the same digest flows from integration through staging to production, every test that ran in an earlier environment ran against exactly what production is now serving, so the accumulated confidence is real. When each environment rebuilds, that chain is broken: the artifact that passed staging and the artifact in production are two separate builds that happen to come from the same commit, and any difference between them is undetected until it causes an incident.',
        explainHi: 'Content digest se deploy karna ek mutable tag ya ek fresh build ke bजाy guarantee karता hai ki har environment mein running bytes identical hain. Ek digest image contents ka ek hash hai, to same digest reference karने waali do deployments provably same image hain, jabki version number ya latest jaisा ek tag kisi bhi samay ek alag image par repoint kiya ja sakता hai, aur source se ek rebuild silently differ kar sakता hai. Jab same digest integration se staging se production tak flow karता hai, har test jo ek earlier environment mein chala theek uske against chala jo production ab serve kar rahा hai. Jab har environment rebuild karता hai, wo chain toot jaती hai.',
      },
      {
        title: 'Config externalised: one image, two environments',
        titleHi: 'Config externalised: ek image, do environments',
        code: `# the SAME image (sha256:9c1e...) started with different environment config:

# --- staging ---
DATABASE_URL=postgres://staging-db.internal:5432/app
LOG_LEVEL=debug
STRIPE_KEY=sk_test_51H...          # test-mode key, no real charges
FEATURE_NEW_CHECKOUT=true          # trying it in staging first
RATE_LIMIT_RPS=1000

# --- production ---
DATABASE_URL=postgres://prod-db.internal:5432/app
LOG_LEVEL=warn
STRIPE_KEY=sk_live_51H...          # from the secret manager, not the file
FEATURE_NEW_CHECKOUT=false         # not enabled for real users yet
RATE_LIMIT_RPS=200

# the image contains NONE of these values. It reads them from the environment
# at startup. Open-sourcing the image would leak nothing.`,
        output: `Everything that differs between environments - connection strings, log level, third-party test-vs-live keys, feature flags, limits - lives in per-environment config injected at deploy time, never in the image. The image is a pure function of (code); the running instance is a function of (image, config).`,
        explain: 'Separating configuration from the artifact is what makes "build once, promote everywhere" possible, because it is the configuration, not the code, that must differ between a staging instance and a production instance. If environment-specific values were compiled into the image, each environment would need its own image, which reintroduces per-environment builds and their divergence. With configuration externalised, the image is a pure artifact determined only by the source code, and a running instance is that image combined with a set of environment values supplied when it starts. This also contains secrets correctly: a live payment key or a database password placed in an image is readable by anyone who can pull the image, whereas a value fetched from a secret manager at startup exists only in the running process. The practical test is whether the artifact could be made public without leaking anything and whether the same artifact could run in an unrelated environment given only new configuration; if both are true, the separation is complete.',
        explainHi: 'Configuration ko artifact se separate karna wo hai jo "ek baar build karo, har jagah promote karo" possible banaता hai, kyunki ye configuration hai, code nahi, jo ek staging instance aur ek production instance ke beech differ karना chahiye. Agar environment-specific values image mein compiled hote, har environment ko apni image chahiye hoती. Configuration externalised ke saath, image ek pure artifact hai jo sirf source code se determined hai. Ye secrets ko bhi correctly contain karता hai: ek image mein rakhी ek live payment key kisi bhi vyakti dwara readable hai jo image pull kar sakता hai, jabki startup par ek secret manager se fetched ek value sirf running process mein exist karती hai.',
      },
      {
        title: 'Shift left: the same bug caught at four different costs',
        titleHi: 'Shift left: wahi bug chaar alag costs par caught',
        code: `// bug: a function returns undefined for an empty list, and a caller does .length on it.

// caught by a UNIT TEST in CI (seconds, $0):
//   test fails, dev fixes it before the PR is even reviewed.

// caught by an E2E TEST in the integration env (minutes, low $):
//   pipeline goes red, dev looks at the trace, fixes it, re-pushes.

// caught in STAGING by a smoke test (~10 min, moderate $):
//   deploy blocked, a Slack alert fires, someone context-switches to investigate.

// caught in PRODUCTION by users hitting 500s (hours, high $ + reputation):
//   pager fires at 2am, incident channel, rollback, customer complaints,
//   a postmortem, and a day of follow-up work.

// SAME BUG. The cost of finding it multiplies at every stage you miss it.`,
        output: `A defect's cost to fix rises sharply the later it is caught: a failing unit test is a minor edit before review; the same defect in production is a page, an incident, a rollback, unhappy users, and a postmortem. "Shift left" means running each check as early as it can meaningfully run.`,
        explain: 'The cost of a defect is not fixed; it grows with how far the defect travels before it is detected. Caught by a unit test, it is a localised change the author makes in minutes, before anyone else has looked at the work. Caught by an integration or end-to-end test, it still stops the pipeline automatically and the author fixes it, but the feedback took longer to arrive and more of the pipeline\'s resources were spent. Caught in staging, a human has to notice, investigate, and coordinate, and the deployment is blocked for others. Caught in production, it has affected real users, triggered an alert and possibly a page, required an emergency rollback, generated support load and reputational cost, and will consume follow-up time in a postmortem and remediation. Because the multiplier is large, the economically correct design runs every check at the earliest pipeline stage where it can produce a meaningful result, which is what shifting left means: fast cheap checks first, and a defect that a unit test could have caught should never reach staging.',
        explainHi: 'Ek defect ki cost fixed nahi hai; ye badhती hai iske saath ki defect detect hone se pehle kitni door travel karता hai. Ek unit test se caught, ye ek localised change hai jo author minutes mein karता hai. Ek integration test se caught, ye abhi bhi pipeline ko automatically rok deता hai. Staging mein caught, ek human ko notice, investigate, aur coordinate karना padता hai. Production mein caught, isne real users ko affect kiya, ek alert trigger kiya, ek emergency rollback require kiya, support load generate kiya, aur ek postmortem mein follow-up time consume karega. Kyunki multiplier large hai, economically correct design har check ko earliest pipeline stage par chalाता hai jahaan ye ek meaningful result produce kar sakता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# rebuilding the artifact separately for each environment
# .github/workflows/deploy-staging.yml:  docker build ... && deploy to staging
# .github/workflows/deploy-prod.yml:     docker build ... && deploy to prod
# -> the prod build is a DIFFERENT build from the one tested in staging.
#    a dependency published a patch between the two builds; staging is fine,
#    prod crashes on startup, and "but it passed staging!" is now meaningless.`,
        right: `# build ONCE in CI, push by digest, promote that digest:
#   ci.yml:            docker build -t api:$SHA . && docker push  -> record digest
#   deploy-staging:    deploy api@sha256:<digest>
#   deploy-prod:       deploy the SAME api@sha256:<digest>  (gated on staging passing)
# the artifact in prod is byte-identical to the one that passed staging.`,
        why: 'Building the deployable artifact once and promoting that exact artifact is what gives the pipeline\'s accumulated test results their meaning. Two builds from the same source are not guaranteed to be identical: package managers can resolve a dependency to a newer patch version, a base image tag can have been updated, the build toolchain or host can differ, and build steps that are not bit-for-bit reproducible can produce different output. So when staging runs one build and production runs another, the fact that staging passed says nothing definitive about the artifact in production, because they are different artifacts that merely share a commit. Building once in continuous integration, pushing the image, and referencing it everywhere by its content digest eliminates this: the digest is a hash of the exact bytes, every environment that deploys that digest runs identical code, and the tests that passed in staging validated precisely what production now runs. Promotion to production is then a decision to ship an already-tested artifact, not a fresh build with fresh risk.',
        whyHi: 'Deployable artifact ko ek baar build karna aur wahi exact artifact promote karna wo hai jo pipeline ke accumulated test results ko unka meaning deता hai. Same source se do builds identical hone ke liye guaranteed nahi hain: package managers ek dependency ko ek newer patch version par resolve kar sakते hain, ek base image tag update ho sakता hai. To jab staging ek build chalाता hai aur production doosra, ye fact ki staging pass hua production mein artifact ke baare mein kुछ definitive nahi kehта. CI mein ek baar build karना, image push karna, aur ise har jagah iske content digest se reference karना ise eliminate karता hai.',
      },
      {
        wrong: `// baking environment config (and worse, secrets) into the image
// Dockerfile:
//   ENV DATABASE_URL=postgres://prod-db:5432/app
//   ENV STRIPE_SECRET_KEY=sk_live_51H...
// -> now there's a "prod image" and a "staging image" (breaks build-once), AND
//    the live Stripe key is in an image layer — anyone who can pull the image,
//    or read the registry, has it. It's also in the layer cache and image history.`,
        right: `// image has NO environment values. Inject at runtime:
//   docker run -e DATABASE_URL=... -e STRIPE_SECRET_KEY=$(vault read ...) api@sha256:...
// or via the orchestrator's config + secret objects (Module 8), or a secret
// manager the app calls on startup (Module 19).
// one image, all environments; secrets never touch the artifact.`,
        why: 'Compiling environment-specific configuration into the image defeats build-once, because a value that differs between staging and production forces a separate image per environment, and it re-creates exactly the divergence risk that promoting one artifact was meant to remove. When the baked-in value is a secret, the problem is more serious: an image layer is not a private place. Anyone who can pull the image can inspect its layers and environment, the value is retained in the build cache and the image history, and it may be pushed to a registry that more people can read than should ever see a production credential. Configuration and secrets belong outside the artifact, supplied when the container starts: non-sensitive config as environment variables or mounted files set per environment, and secrets fetched from a dedicated secret manager so they exist only in the running process\'s memory and never in a stored artifact. This keeps one image usable in every environment and keeps credentials out of anything that is stored or shared.',
        whyHi: 'Environment-specific configuration ko image mein compile karna build-once ko defeat karता hai, kyunki ek value jo staging aur production ke beech differ karती hai prati environment ek alag image force karती hai. Jab baked-in value ek secret hai, problem zyada serious hai: ek image layer ek private jagah nahi hai. Koi bhi jo image pull kar sakта hai iske layers aur environment inspect kar sakта hai, value build cache aur image history mein retained hai. Configuration aur secrets artifact ke bahar rehते hain, container start hone par supplied: non-sensitive config environment variables ke roop mein, aur secrets ek dedicated secret manager se fetched.',
      },
      {
        wrong: `// a "staging" environment that isn't actually like production
// staging: SQLite, 1 app instance, no load balancer, synthetic data, no CDN
// prod:    Postgres, 12 instances behind an ALB, real data volume, CloudFront
// -> "it works in staging" tells you almost nothing. The Postgres-specific query
//    bug, the load-balancer session issue, the CDN cache header mistake, the
//    slow query on real data volume — none of them can appear in staging.`,
        right: `// make staging a faithful (scaled-down) mirror: same database engine, same
// deployment topology (LB + multiple instances), same CDN, and a sanitised
// copy of production data at a representative volume. Provision it with the
// SAME infrastructure-as-code as prod (Module 12), just with smaller sizes.`,
        why: 'A staging environment earns its place in the pipeline only to the extent that it resembles production, because its purpose is to surface problems that unit and integration tests cannot — problems that depend on the real database engine, the real deployment topology, real data characteristics, and the real network path. If staging uses a different database, a single instance instead of a load-balanced fleet, tiny synthetic data, and no content delivery network, then an entire category of production defects is invisible to it: a query that behaves differently on the production database engine, a session-affinity bug that only appears with multiple instances behind a load balancer, a caching header mistake that only matters with a CDN in front, a query that is fast on a thousand rows and slow on ten million. Making staging a faithful scaled-down mirror — same engines, same topology, same CDN, sanitised production-like data at representative volume, provisioned from the same infrastructure code as production — is what allows a pass in staging to genuinely reduce the risk of the production deployment.',
        whyHi: 'Ek staging environment pipeline mein apni jagah sirf us hद tak earn karता hai jitna ye production ko resemble karता hai, kyunki iska purpose wo problems surface karna hai jo unit aur integration tests nahi kar sakते — problems jo real database engine, real deployment topology, real data characteristics par depend karती hain. Agar staging ek alag database istemal karता hai, ek load-balanced fleet ke bजाy ek single instance, tiny synthetic data, aur koi CDN nahi, to production defects ki ek poori category iske liye invisible hai. Staging ko ek faithful scaled-down mirror banana wo hai jo staging mein ek pass ko genuinely production deployment ke risk ko reduce karने deता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A CI pipeline that tags each image `app:<git-sha>` and pushes it, then every deploy references `app@sha256:<digest>`** — the deploy manifest for prod is a one-line digest change, reviewed in a PR, and provably the artifact that passed staging.',
        hi: '**Ek CI pipeline jo har image ko `app:<git-sha>` tag karता hai aur push karता hai, phir har deploy `app@sha256:<digest>` reference karता hai** — prod ka deploy manifest ek one-line digest change hai.',
      },
      {
        en: '**Preview environments per pull request** — a merge to a PR branch spins up a full stack at `pr-1234.preview.example.com`, product and design review the actual change, and it\'s torn down on merge; built entirely from the same IaC as production.',
        hi: '**Prati pull request preview environments** — ek PR branch par ek merge `pr-1234.preview.example.com` par ek full stack spin up karता hai.',
      },
      {
        en: '**A team that found their "staging is fine, prod is broken" pattern was caused by staging running MySQL while prod ran Aurora** — they switched staging to Aurora (smallest instance) and the class of surprise disappeared.',
        hi: '**Ek team jisne paया ki unka "staging fine, prod broken" pattern staging ke MySQL chalाने se caused tha jab prod Aurora chalाता tha**.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through the stages a code change goes through from commit to production, and what each stage adds.',
        qHi: 'Ek code change commit se production tak jo stages ke through jata hai walk through karo, aur har stage kya add karता hai.',
        a: 'A change starts as a commit and enters a pipeline of automated stages, each of which must pass before the next runs. First the code is built into a runnable form. Then unit tests run — fast, isolated checks of individual functions — catching simple logic errors in seconds. Then static analysis runs: linting, type checking, and security scanning for known-vulnerable dependencies, hardcoded secrets, and unsafe patterns. Then the pipeline produces a single immutable artifact, typically a container image identified by its content digest, which is the thing that will be deployed everywhere. That artifact is deployed to an integration environment where end-to-end tests exercise it against real dependencies like an actual database and other services, catching integration problems that unit tests cannot. The same artifact is then deployed to staging, a close mirror of production, where smoke tests and optionally a manual check run — the last gate before real users. Finally the same artifact is deployed to production, configured for production, smoke-tested, and watched closely on metrics and error rates. Each stage is more realistic and more expensive to run than the last, and each is a filter: a failure anywhere stops the change. The design principle is to shift left — run every check as early as it can meaningfully run, so defects are caught when they are cheap to fix.',
        aHi: 'Ek change ek commit ke roop mein shuru hota hai aur automated stages ki ek pipeline mein enter karता hai. Pehle code ek runnable form mein build hota hai. Phir unit tests chalते hain — individual functions ke fast, isolated checks. Phir static analysis: linting, type checking, aur security scanning. Phir pipeline ek single immutable artifact produce karता hai, typically ek container image iske content digest se identified. Wo artifact ek integration environment mein deploy hota hai jahaan end-to-end tests ise real dependencies ke against exercise karते hain. Wahi artifact phir staging mein deploy hota hai, production ka ek close mirror. Aakhir mein wahi artifact production mein deploy hota hai, production ke liye configured, smoke-tested, aur closely watched. Design principle shift left karna hai.',
      },
      {
        q: 'Why is "build once and promote the same artifact" important, and how does configuration fit in?',
        qHi: '"Ek baar build karo aur wahi artifact promote karo" kyun important hai, aur configuration kaise fit hoती hai?',
        a: 'Building the deployable artifact exactly once and promoting that identical artifact through every environment is what makes the pipeline\'s test results meaningful. Two builds from the same source code are not guaranteed to be identical, because dependency resolution, base images, the build toolchain, and non-reproducible build steps can all vary between runs. So if staging tests one build and production runs a separate build from the same commit, "it passed staging" does not reliably describe the artifact in production, because it is a different artifact. Building once in CI, pushing the image, and deploying it everywhere by its content digest — a hash of the exact bytes — eliminates this, so every environment runs identical code and the accumulated confidence from testing is real. Configuration fits in because the one thing that legitimately must differ between environments is not the code but the settings: database URLs, credentials, feature flags, log levels, third-party test-versus-live keys, resource limits. Following the twelve-factor principle, all of that lives outside the artifact and is injected when the container starts, as environment variables, mounted files, or values fetched from a secret manager. The same image given development configuration is a development instance; given production configuration, a production instance. Secrets in particular are never baked into an image, because anyone who can pull the image can extract them.',
        aHi: 'Deployable artifact ko theek ek baar build karna aur wahi identical artifact har environment ke through promote karna wo hai jo pipeline ke test results ko meaningful banaता hai. Same source code se do builds identical hone ke liye guaranteed nahi hain. To agar staging ek build test karता hai aur production same commit se ek alag build chalाता hai, "ye staging pass hua" production mein artifact ko reliably describe nahi karता. CI mein ek baar build karna aur ise har jagah iske content digest se deploy karna ise eliminate karता hai. Configuration fit hoती hai kyunki ek cheez jo legitimately environments ke beech differ karني chahiye wo code nahi balki settings hain. Twelve-factor principle follow karте hue, wo sab artifact ke bahar rehта hai aur container start hone par injected hota hai. Secrets kabhi ek image mein bake nahi hote.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list a minimal but real set of environments (local → CI → staging → production) and, for each, state: who/what uses it, what data it has, and what class of problem it is meant to catch.',
        taskHi: 'Ek comment mein, environments ka ek minimal but real set list karo aur har ek ke liye batao: kaun ise istemal karता hai, iska kya data hai, aur ye kaunसी problem class catch karता hai.',
        hint: 'Local: the developer; fake/seed data; logic errors in the fastest loop. CI: the pipeline, per commit, ephemeral; no persistent data; "works beyond my machine" + unit/lint/scan failures. Staging: the team, pre-release; sanitised prod-like data at representative volume; production-topology problems (real DB engine, LB, CDN, slow queries on real volume). Production: real users; real data; the real thing.',
        hintHi: 'Local: developer; fake/seed data; logic errors. CI: pipeline, prati commit, ephemeral; unit/lint/scan failures. Staging: team, pre-release; sanitised prod-like data; production-topology problems. Production: real users; real data.',
      },
      {
        task: 'A team\'s deploy workflows do `docker build` separately for staging and for production. In a comment, explain the specific failure mode this creates and rewrite the flow to "build once, promote by digest".',
        taskHi: 'Ek team ke deploy workflows staging aur production ke liye alag se `docker build` karते hain. Ek comment mein, specific failure mode samjhao.',
        hint: 'Failure: the prod build ≠ the staging build (a dep resolved to a new patch, base image moved, non-reproducible step) → staging passes, prod breaks, "it passed staging" is meaningless. Fix: CI builds once → `docker push api:$SHA` → record `sha256:<digest>` → staging deploys `api@sha256:<digest>` → prod deploys the SAME digest, gated on staging passing.',
        hintHi: 'Failure: prod build ≠ staging build → staging pass, prod break. Fix: CI ek baar build → `docker push api:$SHA` → `sha256:<digest>` record → staging `api@sha256:<digest>` deploy → prod SAME digest deploy.',
      },
      {
        task: 'In a comment, take an app that currently has `DATABASE_URL` and `STRIPE_SECRET_KEY` hardcoded in its Dockerfile and describe how to externalise both correctly, and the test for "is my config properly separated from my artifact".',
        taskHi: 'Ek comment mein, ek app lo jismein `DATABASE_URL` aur `STRIPE_SECRET_KEY` Dockerfile mein hardcoded hain aur batao dono ko correctly kaise externalise karna.',
        hint: 'Remove both `ENV` lines. `DATABASE_URL`: inject per-environment as an env var / mounted config at deploy time. `STRIPE_SECRET_KEY`: never an env literal — fetch from a secret manager at startup (or the orchestrator\'s secret object). Test: (a) could you open-source the image with nothing leaked? (b) could the same image run in a totally different env given only new config? Both yes = done.',
        hintHi: 'Dono `ENV` lines hatao. `DATABASE_URL`: deploy time par per-environment env var / mounted config. `STRIPE_SECRET_KEY`: startup par ek secret manager se fetch. Test: (a) image open-source kar sakते ho bina kुछ leak? (b) same image ek alag env mein chal sakती hai sirf naye config ke saath?',
      },
    ],

    keyTakeaways: [
      'A change flows through a PIPELINE of ordered automated stages — build → unit tests → lint + security scan → package (ONE artifact) → deploy to integration + integration/E2E tests → deploy to staging + smoke tests → deploy to production + smoke tests + watch metrics. A failure at ANY stage HALTS the change. Stages are ordered by cost + realism; "SHIFT LEFT" = run every check as early as it can meaningfully run (a bug caught by a unit test costs a minor edit; the same bug in prod costs a page + incident + rollback + postmortem).',
      'ENVIRONMENTS, progressively more production-like: LOCAL (laptop, fake data, fastest loop) → CI (ephemeral, per-commit, isolated) → DEV/INTEGRATION (shared, always-on, services talk) → STAGING (a faithful scaled-down MIRROR of prod — same DB engine, same topology, sanitised prod-like data) → PRODUCTION (real users/data/traffic/money). Optionally PREVIEW/PR envs (ephemeral, one per PR, auto-created + destroyed). Minimal real set: local → CI → staging → production. A staging that isn\'t like prod (different DB, single instance, synthetic data) catches almost nothing.',
      'BUILD ONCE, PROMOTE THE SAME ARTIFACT — the #1 pipeline discipline. Per-environment rebuilds are NOT guaranteed identical (dep resolution, base image, toolchain, non-reproducible steps), so "passed staging" describes a DIFFERENT artifact than the one in prod. Fix: CI builds ONE immutable artifact (a container image by CONTENT DIGEST `sha256:...`, not a mutable tag / not `latest`), and that exact digest is deployed to integration → staging → production.',
      'CONFIGURATION IS PER-ENVIRONMENT, injected at deploy/startup time, NEVER baked into the artifact (12-factor). Everything that differs between environments — DB URLs, credentials, feature flags, log levels, third-party test-vs-live keys, resource limits — comes from env vars / mounted files / a secret manager. Same image + dev config = dev instance; same image + prod config = prod instance.',
      'SECRETS are never in an image (anyone who can pull it can extract them; they persist in the layer cache + image history) — fetch them from a secret manager at startup. TEST for proper config separation: (a) could you open-source the artifact with nothing leaked? (b) could the same artifact run in a completely different environment given only new config? Both yes ⇒ done right.',
    ],
    keyTakeawaysHi: [
      'Ek change ordered automated stages ki ek PIPELINE ke through flow karता hai — build → unit tests → lint + security scan → package (EK artifact) → integration deploy + E2E tests → staging deploy + smoke tests → production deploy + smoke tests + metrics watch. KISI bhi stage par ek failure change ko ROK deता hai. "SHIFT LEFT" = har check jitni jaldi possible chalाओ.',
      'ENVIRONMENTS, progressively zyada production-jaisे: LOCAL → CI (ephemeral, per-commit) → DEV/INTEGRATION (shared, always-on) → STAGING (prod ka ek faithful scaled-down MIRROR — same DB engine, same topology) → PRODUCTION (real users/data/traffic/money). Optionally PREVIEW/PR envs. Minimal real set: local → CI → staging → production. Ek staging jo prod jaisा nahi hai kुछ nahi catch karता.',
      'EK BAAR BUILD KARO, WAHI ARTIFACT PROMOTE KARO — #1 pipeline discipline. Per-environment rebuilds identical hone ke liye guaranteed NAHI hain, to "staging pass hua" prod mein artifact se ek ALAG artifact describe karता hai. Fix: CI EK immutable artifact build karता hai (ek container image CONTENT DIGEST `sha256:...` se, ek mutable tag / `latest` nahi).',
      'CONFIGURATION PER-ENVIRONMENT hai, deploy/startup time par injected, KABHI artifact mein baked nahi (12-factor). Jo bhi environments ke beech differ karता hai — DB URLs, credentials, feature flags, log levels — env vars / mounted files / ek secret manager se aata hai. Same image + dev config = dev instance.',
      'SECRETS kabhi ek image mein nahi (koi bhi jo ise pull kar sakта hai extract kar sakта hai; wo layer cache + image history mein persist karते hain) — startup par ek secret manager se fetch karो. TEST: (a) artifact open-source kar sakते ho bina kुछ leak? (b) same artifact ek alag environment mein chal sakती hai sirf naye config ke saath? Dono yes ⇒ sahi.',
    ],
  },

  {
    slug: 'ops-feedback-loops-and-ownership',
    title: 'Feedback Loops & "You Build It, You Run It"',
    titleHi: 'Feedback Loops Aur "You Build It, You Run It"',
    description: 'Software delivery is a set of nested feedback loops — from the sub-second edit-save-test loop to the multi-day incident-to-fix loop. The faster each loop, the faster you learn. Team ownership of production, including on-call, closes the outermost loops that a handoff breaks.',
    descriptionHi: 'Software delivery nested feedback loops ka ek set hai — sub-second edit-save-test loop se multi-day incident-to-fix loop tak. Har loop jitna fast, aap utna fast seekhते ho. Production ki team ownership, including on-call, wo outermost loops close karती hai jinhe ek handoff todता hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**Learning to throw darts blindfolded versus with the lights on.** Blindfolded, you throw, walk over, feel where it landed, walk back, adjust, throw again — minutes per attempt, and you barely improve. Lights on, you see each throw land instantly and correct on the next one — dozens of attempts a minute, and you get good fast. The quality of your dart-throwing is bounded by how quickly you find out where the last dart went. Every part of software delivery is a feedback loop like this: how fast does a failing test tell you? how fast does a bad deploy tell you? how fast does a production regression tell you? Shorten each loop and the whole system learns faster; a handoff to another team is a blindfold on the outer loops.',
      hi: '**Blindfolded darts throw karna seekhna versus lights on ke saath.** Blindfolded, aap throw karते ho, chalkar jaते ho, feel karते ho ye kahaan landa, wapas chalते ho, adjust karते ho, phir throw karते ho — prati attempt minutes, aur aap barely improve karते ho. Lights on, aap har throw ko instantly land hote dekhते ho aur agle par correct karते ho — prati minute dozens of attempts, aur aap jaldi achhे ho jाते ho. Aapki dart-throwing ki quality is se bounded hai ki aap kitni jaldi pata lagाते ho ki last dart kahaan gaya. Software delivery ka har part is jaisा ek feedback loop hai. Ek doosri team ko ek handoff outer loops par ek blindfold hai.',
    },

    simple: `**DELIVERY = NESTED FEEDBACK LOOPS. Each: act → observe → learn → adjust.**
\`\`\`
LOOP                        TYPICAL LATENCY   "did it work?"
edit → save → hot reload    < 1 second         did my change render?
run unit tests locally      seconds            did I break a function?
push → CI pipeline          minutes            did I break the build / other tests?
PR review                   minutes–hours      is the approach right?
deploy → staging smoke      minutes            does it run in a prod-like env?
deploy → prod + watch       minutes–hours      is it healthy with real traffic?
prod regression → alert     seconds–minutes    did a released change break something?
incident → root cause → fix hours–days         what actually went wrong + prevent it
\`\`\`
**Faster loop = faster learning = less risk carried forward.** Every hour a loop
takes is an hour of uncertainty and an hour more work piled behind it.

**HOW TO TIGHTEN EACH LOOP:**
\`\`\`
inner (edit/test)  | hot reload, fast test runner, run only affected tests, good local env
CI                 | parallelise, cache deps, split tests, fail fast on the cheapest check
review             | small PRs, clear description, automated checks pass before a human looks
deploy             | automated pipeline, small changes, canary + auto-rollback
prod feedback      | dashboards, alerts on symptoms, structured logs, tracing, SLOs
incident           | runbooks, blameless postmortems, action items that actually ship
\`\`\`

**"YOU BUILD IT, YOU RUN IT" closes the OUTER loops:**
\`\`\`
the team that wrote the service:
  - is ON CALL for it (the prod-feedback + incident loops now close on the author)
  - has prod access to logs/metrics/traces for their services
  - runs their own deploys + rollbacks
=> the person who can fix it fastest is the person who finds out first.
\`\`\`

**BLAMELESS:** postmortems ask "what in the SYSTEM let this happen?" not "who
did it?". People who fear blame hide problems -> the loop never closes.`,

    simpleHi: `**DELIVERY = NESTED FEEDBACK LOOPS. Har: act → observe → learn → adjust.**
\`\`\`
LOOP                        TYPICAL LATENCY   "kya ye kaam kiya?"
edit → save → hot reload    < 1 second         mera change render hua?
locally unit tests run      seconds            maine ek function toda?
push → CI pipeline          minutes            maine build / other tests toda?
PR review                   minutes–hours      approach sahi hai?
deploy → staging smoke      minutes            ye ek prod-jaisे env mein chalता hai?
deploy → prod + watch       minutes–hours      real traffic ke saath healthy hai?
prod regression → alert     seconds–minutes    ek released change ne kुछ toda?
incident → root cause → fix hours–days         actually kya galat hua + prevent karo
\`\`\`
**Faster loop = faster learning = kam risk forward carried.**

**HAR LOOP KO KAISE TIGHTEN KARE:**
\`\`\`
inner (edit/test)  | hot reload, fast test runner, sirf affected tests run karo
CI                 | parallelise, deps cache, tests split, cheapest check par fail fast
review             | small PRs, clear description, human dekhne se pehle automated checks pass
deploy             | automated pipeline, small changes, canary + auto-rollback
prod feedback      | dashboards, symptoms par alerts, structured logs, tracing, SLOs
incident           | runbooks, blameless postmortems, action items jo actually ship hote hain
\`\`\`

**"YOU BUILD IT, YOU RUN IT" OUTER loops close karता hai:**
\`\`\`
jo team ne service likhी:
  - iske liye ON CALL hai
  - apni services ke logs/metrics/traces ka prod access hai
  - apne deploys + rollbacks chalाती hai
=> jo vyakti ise sabse jaldi fix kar sakта hai wo vyakti pehle pata lagाता hai.
\`\`\`

**BLAMELESS:** postmortems poochते hain "SYSTEM mein kya cheez ne ise hone diya?"
"kisne kiya?" nahi. Jo log blame se darते hain problems chhupाते hain.`,

    content: `## Delivery is feedback loops all the way down

Every step of building and shipping software is a **feedback loop**: you take an action, you observe a result, you learn something, and you adjust. Software delivery is many such loops **nested** inside each other, from tiny and fast to large and slow:

| Loop | Latency | The question it answers |
|---|---|---|
| Edit → save → hot reload | sub-second | Did my change do what I expected on screen? |
| Run unit tests locally | seconds | Did I break a function? |
| Push → CI pipeline | minutes | Did I break the build, or another test, or a lint/security rule? |
| Pull request review | minutes to hours | Is this the right approach? Did I miss an edge case? |
| Deploy → staging smoke tests | minutes | Does it actually run in a production-like environment? |
| Deploy → production, then observe | minutes to hours | Is it healthy under real traffic and real data? |
| Production regression → alert fires | seconds to minutes | Did a released change break something users depend on? |
| Incident → root cause → fix → prevention | hours to days | What actually went wrong, and how do we stop it recurring? |

The **speed of each loop bounds how fast you can learn and correct** at that level. A test suite that takes 40 minutes means you find out about a broken function 40 minutes after you wrote it — by which time you have moved on and lost context. A deploy that takes a day to observe means a regression sits in production for a day. Slow loops also cause work to **pile up**: while you wait for slow feedback, you start the next thing, so when the feedback finally arrives you have to context-switch back.

## Tightening the loops

Each loop has known techniques for making it faster:

**Inner loop (edit / test).** Hot reload so a code change is visible in under a second. A fast test runner. Run only the tests affected by your change, not the whole suite, during development. A local environment that closely matches production (containers help) so "works locally" means something.

**CI.** Parallelise independent jobs. Cache dependencies between runs. Split the test suite across runners. Order checks cheapest-first and **fail fast** — if linting fails in 10 seconds, don't spend 15 minutes running the full test suite. Aim for the whole pipeline to finish in the time it takes to get a coffee.

**Review.** Keep pull requests **small** — a 50-line PR is reviewed properly in minutes; a 2000-line PR gets a rubber stamp. Write a clear description of what and why. Make all automated checks pass *before* a human is asked to look, so review time is spent on judgment, not on catching mechanical errors.

**Deploy.** An automated pipeline (no manual steps). Small changes (a small deploy is a small blast radius). Progressive rollout — canary a change to a fraction of traffic, watch, then proceed or auto-roll-back (Module 11).

**Production feedback.** Dashboards showing the health of each service. Alerts on **symptoms** users feel (error rate, latency, saturation) rather than on causes. Structured logs and distributed traces so you can go from "something is wrong" to "here is the failing request and why" quickly. SLOs that define "healthy" numerically (Module 15).

**Incident.** Runbooks so responders don't improvise. **Blameless postmortems** (below). Action items that are tracked and actually completed, not filed and forgotten.

## "You build it, you run it" closes the outer loops

The inner loops (edit, test, CI, review) already close on the developer in almost any model. The **outer** loops — production health, regressions, incidents — are the ones a dev/ops handoff breaks, because in the handoff model the developer is not the one watching production or holding the pager.

"You build it, you run it" means the team that writes a service **owns its operation**:

- The team is **on call** for the service. When it pages, the people who understand the code respond. The production-feedback and incident loops now close directly on the authors.
- The team has **production access** — scoped and audited — to read logs, metrics, and traces for their own services, so diagnosis is direct rather than relayed through another team.
- The team **runs its own deploys and rollbacks**, so the deploy loop is theirs to make fast and safe.

The effect: **the person best placed to fix a problem is the person who finds out about it first**, and the cost of shipping something operationally fragile lands on the team that shipped it, which is a powerful incentive to build in resilience, observability, and safe deployment from the start.

The trade-off is real — on-call is a burden, and it must be humane: a sustainable rotation, compensation or time-off-in-lieu, a rule that a night page generates a fix so it doesn't recur, and enough automation that most issues self-heal. A team drowning in pages is a signal that the system needs investment, not that the team needs to try harder.

## Blameless culture

The incident loop only closes if people tell the truth about what happened, and people only tell the truth if they will not be punished for it.

A **blameless postmortem** asks *"what about the system — the code, the process, the tooling, the defaults, the missing guardrail — allowed this to happen, and made it hard to catch or recover from?"* It does **not** ask "who ran the command?" The person who ran the command is almost never the root cause; the root cause is that a dangerous command was easy to run by mistake, or that there was no confirmation step, or that the staging environment didn't catch it.

When people fear blame, they hide near-misses, delay reporting problems, and avoid touching risky areas — so the organisation stops learning exactly where it most needs to. Blamelessness is not "no accountability"; it is directing accountability at improving the system rather than at punishing an individual for a systemic weakness.`,

    contentHi: `## Delivery neeche tak feedback loops hai

Software build aur ship karne ka har step ek **feedback loop** hai: aap ek action lेते ho, ek result observe karते ho, kुछ seekhते ho, aur adjust karते ho. Software delivery aisे kई loops ek doosre ke andar **nested** hain, tiny aur fast se large aur slow tak: edit→save→hot reload (sub-second), locally unit tests (seconds), push→CI (minutes), PR review (minutes–hours), staging smoke (minutes), prod deploy + observe (minutes–hours), prod regression→alert (seconds–minutes), incident→root cause→fix (hours–days).

**Har loop ki speed bound karती hai ki aap us level par kitni jaldi seekh aur correct kar sakते ho.** Slow loops kaam ko **pile up** bhi karवाते hain.

## Loops tighten karna

**Inner loop (edit/test).** Hot reload, ek fast test runner, sirf affected tests run karो.

**CI.** Parallelise, deps cache karो, tests split karो, checks cheapest-first order karो aur **fail fast**.

**Review.** PRs **small** rakhो. Clear description likhो. Human ko dekhने se pehle saare automated checks pass karें.

**Deploy.** Ek automated pipeline, small changes, progressive rollout (canary + auto-rollback).

**Production feedback.** Dashboards, **symptoms** par alerts (error rate, latency), structured logs aur traces, SLOs.

**Incident.** Runbooks, **blameless postmortems**, tracked action items.

## "You build it, you run it" outer loops close karता hai

Inner loops already developer par close hote hain. **Outer** loops — production health, regressions, incidents — wo hain jinhe ek dev/ops handoff todता hai.

"You build it, you run it" matlab jo team ek service likhती hai wo **iska operation own karती hai**:
- Team service ke liye **on call** hai.
- Team ke paas **production access** hai — scoped aur audited.
- Team **apne deploys aur rollbacks chalाती hai**.

Effect: **ek problem ko fix karने ke liye sabse achhी jagah waala vyakti wo vyakti hai jo iske baare mein pehle pata lagाता hai**.

Trade-off real hai — on-call ek burden hai, aur ise humane hona chahiye: ek sustainable rotation, compensation, ek rule ki ek night page ek fix generate karता hai.

## Blameless culture

Incident loop sirf tab close hota hai agar log sach bताते hain ki kya hua, aur log sirf tab sach bताते hain agar unhe iske liye punish nahi kiya jaega.

Ek **blameless postmortem** poochता hai *"system ke baare mein kya — code, process, tooling, defaults, missing guardrail — ne ise hone diya?"* Ye ye NAHI poochता "command kisne chalाya?"

Jab log blame se darते hain, wo near-misses chhupाते hain, problems reporting delay karते hain. Blamelessness "koi accountability nahi" nahi hai; ye accountability ko system improve karने ki taraf direct karना hai.`,

    examples: [
      {
        title: 'The cost of a slow CI loop',
        titleHi: 'Ek slow CI loop ki cost',
        code: `// CI pipeline: 38 minutes. A dev pushes 6 times a day.

// what actually happens each push:
//   push -> switch to another task (can't wait 38 min idle)
//   ~38 min later -> notification: "build failed, lint error on line 12"
//   -> context-switch BACK: re-open the branch, recall what you were doing,
//      fix the one-line issue, push again, switch away again, wait again...

// 6 pushes x 2 context switches x ~15 min of switching cost = ~3 hours/day of
// pure overhead, PLUS changes sitting un-merged longer = bigger merge conflicts.

// after tightening: lint+typecheck run first and fail in 40s; tests parallelised
// to 6 min; the whole loop is 7 min -> you can wait for it -> no context switch.`,
        output: `A 38-minute CI loop forces a context switch on every push, and the switching cost (re-loading mental state) often exceeds the fix itself. Ordering cheap checks first (fail in seconds) and parallelising tests to fit in a short break removes the switch entirely.`,
        explain: 'The latency of the continuous-integration loop determines whether a developer waits for its result or moves on to something else. A loop measured in tens of minutes cannot reasonably be waited on, so the developer starts another task, and when the result arrives they must reconstruct the mental context of the original change before they can act on the feedback, which frequently costs more time and attention than the fix. A loop of a few minutes can be waited on, so the feedback arrives while the change is still loaded in the developer\'s head and is acted on immediately. Two techniques bring the loop into that range. Ordering the checks so the fastest ones run first, and stopping the pipeline as soon as one fails, means a lint or type error is reported in seconds rather than after a full test run. Parallelising the test suite across multiple runners compresses the slowest stage to fit within a short break. Together these turn a loop that forces context switching into one that does not, which removes a recurring cost that scales with how often the developer pushes.',
        explainHi: 'CI loop ki latency determine karती hai ki ek developer iske result ke liye wait karता hai ya kुछ aur par move karता hai. Tens of minutes mein measured ek loop reasonably wait nahi kiya ja sakta, to developer ek doosरा task shuru karता hai, aur jab result aata hai unhe original change ka mental context reconstruct karना padता hai, jo aksar fix se zyada time aur attention cost karता hai. Kुछ minutes ka ek loop wait kiya ja sakta hai. Do techniques loop ko us range mein laती hain: checks ko order karना taaki fastest pehle chalें aur ek fail hote hi pipeline rok dena; test suite ko multiple runners ke across parallelise karна.',
      },
      {
        title: 'Which loop closes on whom: handoff vs "you run it"',
        titleHi: 'Kaunsा loop kis par close hota hai: handoff vs "you run it"',
        code: `// a memory leak ships. It takes ~6 hours to exhaust RAM and OOM-kill the pod.

// --- HANDOFF MODEL ---
//   03:10  ops gets paged: pod restarting in a loop
//   03:15  ops restarts it, memory climbs again
//   03:40  ops files a ticket, tags the team, mitigates by bumping the memory limit
//   09:30  dev sees the ticket, can't reproduce locally, asks ops for a heap dump
//   14:00  ops provides it; dev starts investigating
//   next day  fix merged
//   -> the "prod regression" and "incident" loops took ~30 hours to close,
//      most of it waiting on a handoff.

// --- YOU BUILD IT, YOU RUN IT ---
//   03:10  the authoring team's on-call is paged, with a link to the dashboard
//   03:20  they see memory sawtoothing, correlate to this morning's deploy,
//          roll back (one command), pod is healthy
//   03:35  back to sleep; a ticket auto-created with the rollback context
//   10:00  the author reads their own heap profile, finds the retained closure,
//          fixes it, ships it through the pipeline
//   -> both loops closed in hours, by the people who understood the code.`,
        output: `The inner loops close on the developer either way. The outer loops - noticing a production regression, diagnosing it, fixing it - close fast only when the team that wrote the code is the team watching production and holding the pager. A handoff inserts wait states into exactly the loops that matter most during an incident.',`,
        explain: 'A production regression and the incident it causes are feedback that the outer loops are supposed to deliver, but where those loops close depends on who operates the service. Under a handoff model the operator is paged, and the operator can mitigate — restart, raise a limit, roll back if they know how — but cannot diagnose a code-level defect, so the loop stalls waiting for the authoring team to pick up a ticket, fail to reproduce it without production data, request artifacts, and eventually investigate, stretching a fix over more than a day of mostly waiting. When the authoring team operates the service, the same page reaches someone who can correlate the symptom to a recent deploy, roll back immediately, and then read their own profiling data to find and fix the defect, closing both loops in hours. The handoff does not add work so much as insert wait states into the loops that are most time-sensitive, because an incident is precisely when the cost of relaying information between teams is highest.',
        explainHi: 'Ek production regression aur wo incident jo ye cause karता hai feedback hai jo outer loops deliver karne wale hain, par wo loops kahaan close hote hain ye is par depend karता hai ki service kaun operate karता hai. Handoff model ke under operator paged hota hai, aur operator mitigate kar sakta hai par ek code-level defect diagnose nahi kar sakta, to loop stall hota hai authoring team ke ek ticket pick karne, production data ke bina reproduce fail karne, aur eventually investigate karne ka wait karते hue. Jab authoring team service operate karती hai, wahi page kisi tak pahunchता hai jo symptom ko ek recent deploy se correlate kar sakта hai, turant roll back kar sakта hai, aur phir apna profiling data padh sakта hai.',
      },
      {
        title: 'A blameless postmortem: the question you ask',
        titleHi: 'Ek blameless postmortem: jo sawal aap poochते ho',
        code: `// incident: an engineer ran a data-cleanup script against prod instead of
// staging and deleted 40k rows. Restored from backup in 90 min.

// BLAMEFUL framing (wrong):
//   "Priya ran the wrong script. Priya will be more careful. Add Priya to a
//    review process."  -> Priya hides her next near-miss; nobody else learns.

// BLAMELESS framing (right) — ask what the SYSTEM allowed:
//   - the script took an env via a flag that DEFAULTED to prod              -> fix: no default, must be explicit
//   - staging and prod configs looked nearly identical in the terminal      -> fix: colored prompt + env name in PS1
//   - the script had no dry-run mode and no "type the env name to confirm"  -> fix: add both
//   - the prod DB user the script used had DELETE on that table at all      -> fix: least privilege
//   - there was no "are you sure? this affects 40,000 rows" guard           -> fix: add a row-count confirmation
//   - the runbook said "run cleanup weekly" with no safety notes            -> fix: rewrite it

// 6 systemic fixes ship. The next person literally cannot make this mistake.`,
        output: `A blameless postmortem treats the human action as the trigger, not the cause, and asks what in the system - defaults, ambiguous UI, missing confirmations, excess privilege, a thin runbook - made the mistake easy to make and hard to catch. The output is systemic fixes, not a promise to be careful.`,
        explain: 'When an incident is traced to a human action, the blameful response stops at that action, attributes the incident to the individual\'s carelessness, and prescribes more care or more oversight for that person. This produces no durable improvement, because the same conditions that let one person make the mistake are still present for everyone else, and it teaches people that admitting error is costly, so they stop surfacing the near-misses that are the cheapest learning opportunities. The blameless response treats the human action as the point where a latent systemic weakness became visible and asks what those weaknesses were: a dangerous default, an interface that made two environments hard to tell apart, the absence of a dry-run mode or a confirmation step, a database account with more privilege than the task required, a runbook that omitted the safety context. Each of those is fixable, and fixing them means the next person in the same situation cannot make the same mistake regardless of how careful they are. Accountability is not removed; it is pointed at improving the system rather than at punishing someone for a weakness the system contained.',
        explainHi: 'Jab ek incident ek human action tak traced hota hai, blameful response us action par rukता hai, incident ko individual ki carelessness ko attribute karता hai, aur us vyakti ke liye zyada care ya zyada oversight prescribe karता hai. Ye koi durable improvement produce nahi karता, kyunki wahi conditions jo ek vyakti ko galti karने diya abhi bhi sabke liye present hain, aur ye logon ko sikhाता hai ki error admit karna costly hai. Blameless response human action ko wo point manता hai jahaan ek latent systemic weakness visible bani aur poochता hai wo weaknesses kya thी: ek dangerous default, ek interface jo do environments ko distinguish karना mushkil banाता tha, ek dry-run mode ki absence. Har ek fixable hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// letting the CI loop grow unbounded because "it still passes"
// 12 min -> 25 min -> 47 min over a year, nobody owns the number.
// -> devs stop waiting for it, push speculative fixes, merge on a green they
//    didn't actually watch, and the feedback value of CI quietly evaporates.`,
        right: `// treat pipeline duration as a tracked metric with a budget (e.g. "p95 under
// 10 minutes"). When it regresses: profile the slow stage, parallelise, cache,
// split the suite, move slow E2E tests to a post-merge stage. A fast loop that
// people actually wait for is worth more than a thorough loop they ignore.`,
        why: 'The value of a continuous-integration pipeline comes from developers acting on its feedback while the change is still fresh, which requires them to wait for the result, which requires the pipeline to be fast enough to wait for. A pipeline that grows without anyone tracking its duration crosses the threshold where waiting is no longer reasonable, and past that point developers push and move on, merge on a result they did not watch, and route around the feedback the pipeline was built to provide. The pipeline still runs and still reports failures, but the failures are found later and with less context, so its practical value has fallen even though it appears to be working. Managing this means treating pipeline duration as a metric with an explicit target, and when the target is breached, investing in the specific fix — profiling to find the slow stage, parallelising across runners, caching dependencies, splitting the test suite, or moving the slowest end-to-end tests to run after merge rather than before. A loop developers wait for delivers more value than a more exhaustive loop they have learned to ignore.',
        whyHi: 'Ek CI pipeline ki value developers ke iski feedback par act karne se aati hai jab change abhi bhi fresh hai, jiske liye unhe result ke liye wait karना chahiye, jiske liye pipeline ko wait karने ke liye fast enough hona chahiye. Ek pipeline jo bina kisi ke iski duration track kiye badhती hai us threshold ko cross karती hai jahaan wait karna ab reasonable nahi, aur us point ke baad developers push karके move on karते hain. Pipeline abhi bhi chalता hai par failures baad mein aur kam context ke saath mile jाते hain. Ise manage karना matlab pipeline duration ko ek explicit target waale metric ke roop mein treat karna.',
      },
      {
        wrong: `// "you build it you run it" with no support: dump on-call on a team that has
// no dashboards, no runbooks, no rollback automation, and a 1-in-3 rotation.
// -> the team is paged constantly, can't diagnose fast, burns out, and starts
//    avoiding risky-but-valuable work to keep the pager quiet. Ownership without
//    tooling is just punishment.`,
        right: `// ownership comes WITH the platform to exercise it: per-service dashboards +
// SLO-based alerts, runbooks for known failure modes, one-command rollback,
// a rotation of at least ~6 so nobody is always on call, comp/TOIL for nights,
// and a hard rule that every page produces a fix or a suppression. A team
// buried in pages is a signal to invest, not to try harder.`,
        why: 'Making a team responsible for operating its service only improves outcomes if the team has the means to operate it well. Ownership without observability, runbooks, safe rollback, and a humane rotation is responsibility for outcomes the team cannot efficiently influence: they are paged for problems they cannot quickly diagnose, mitigate slowly because rollback is manual and risky, and carry the pager too often because the rotation is small. The predictable result is burnout and defensive behaviour, where the team avoids valuable changes that carry any operational risk in order to keep the pager quiet, which is the opposite of what the model is meant to encourage. The support that must accompany ownership is concrete: dashboards and alerts tied to service-level objectives so the team sees health at a glance and is paged only on real user impact, runbooks that capture how to handle known failure modes, automated one-command rollback, a rotation large enough that on-call is occasional, compensation or time off for night work, and a standing rule that every page results in either a fix or a deliberate suppression so the same page does not recur. A team that is constantly paged is evidence that the system needs investment.',
        whyHi: 'Ek team ko iski service operate karने ke liye responsible banana sirf tab outcomes improve karता hai agar team ke paas ise achhी tarah operate karने ka means hai. Observability, runbooks, safe rollback, aur ek humane rotation ke bina ownership un outcomes ke liye responsibility hai jinhe team efficiently influence nahi kar sakती. Predictable result burnout aur defensive behaviour hai. Jo support ownership ke saath aana chahiye wo concrete hai: SLO-tied dashboards aur alerts, runbooks, automated one-command rollback, ek rotation jo large enough hai, night work ke liye compensation, aur ek standing rule ki har page ek fix ya ek deliberate suppression mein result hoती hai.',
      },
      {
        wrong: `// a postmortem that ends with "human error — X will be more careful" and a
// single action item: "add a training session".
// -> nothing about the system changed. The next person, equally careful, hits
//    the same sharp edge. And X, now publicly blamed, will downplay the next
//    incident they're involved in.`,
        right: `// a postmortem ends with 3-8 SYSTEMIC action items, each with an owner and a
// due date, that make the failure mode harder to hit or easier to catch:
// remove the dangerous default, add a confirmation, tighten the DB privilege,
// improve the alert, make staging catch it, rewrite the runbook. Track them to
// completion. "Be more careful" is never an action item.`,
        why: 'A postmortem that concludes with human error and a resolution to be more careful produces no change in the conditions that led to the incident, so the failure mode remains and will be encountered again by someone equally diligent. It also damages the reporting culture: an individual who has been named as the cause of an incident has an incentive to minimise their involvement in the next one, which reduces the quality of information available for learning. A useful postmortem identifies the systemic factors that made the mistake easy to make and hard to detect or recover from, and produces concrete action items that address those factors — removing an unsafe default, adding a confirmation prompt, reducing a database account\'s privileges to what the task needs, improving an alert so the problem is caught sooner, making the staging environment able to detect the class of failure, rewriting a runbook to include the safety context. Each action item has an owner and a deadline and is tracked to completion, because a postmortem whose action items are filed and forgotten has not closed the loop. The instruction to be more careful is never a valid action item, because it is not a change to the system.',
        whyHi: 'Ek postmortem jo human error aur zyada careful hone ke resolution ke saath conclude hota hai un conditions mein koi change produce nahi karता jo incident tak le gayीं, to failure mode remain karता hai. Ye reporting culture ko bhi damage karता hai. Ek useful postmortem un systemic factors ko identify karता hai jo galti ko easy banाya aur detect ya recover karना hard, aur concrete action items produce karता hai — ek unsafe default hataना, ek confirmation prompt add karना, ek database account ke privileges reduce karना, ek alert improve karना. Har action item ka ek owner aur ek deadline hai. Zyada careful hone ka instruction kabhi ek valid action item nahi hai.',
      },
    ],

    realWorld: [
      {
        en: '**A team that set a "CI p95 under 8 minutes" budget and defends it** — when a new integration test suite pushed it to 14 min, they moved that suite to a post-merge nightly run and kept the pre-merge loop fast.',
        hi: '**Ek team jisne ek "CI p95 8 minute ke under" budget set kiya aur ise defend karती hai** — jab ek naya integration test suite ise 14 min tak dhakela, unhone us suite ko ek post-merge nightly run mein move kiya.',
      },
      {
        en: '**Per-service dashboards linked directly from the alert** — every page includes a URL to the exact dashboard and the runbook, so the on-call engineer is looking at the right graph within 30 seconds of waking up.',
        hi: '**Alert se directly linked per-service dashboards** — har page mein exact dashboard aur runbook ka ek URL hota hai.',
      },
      {
        en: '**A company with a public blameless-postmortem repo** — every incident write-up is readable by the whole company, action items are tracked in the same tool as feature work, and "human error" is a banned root cause.',
        hi: '**Ek company ek public blameless-postmortem repo ke saath** — har incident write-up poori company dwara readable hai, aur "human error" ek banned root cause hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does it mean to think of software delivery as feedback loops, and how do you make the system learn faster?',
        qHi: 'Software delivery ko feedback loops ke roop mein sochna ka kya matlab hai, aur aap system ko kaise faster learn karवाते ho?',
        a: 'Every step of delivering software is a loop in which you take an action, observe a result, learn from it, and adjust, and delivery as a whole is many such loops nested from fast to slow: the sub-second edit-and-hot-reload loop, the seconds-long local test loop, the minutes-long CI loop, the review loop, the deploy-to-staging loop, the deploy-to-production-and-observe loop, the regression-to-alert loop, and the incident-to-root-cause-to-prevention loop that can span days. The latency of each loop bounds how quickly you can learn and correct at that level, and slow loops also cause work to pile up because you start the next task while waiting and then have to context-switch back when feedback arrives. Making the system learn faster means shortening each loop with techniques appropriate to it: hot reload and running only affected tests for the inner loop; parallelising, caching, splitting the suite, and failing fast on the cheapest check for CI; small pull requests with passing automated checks for review; an automated pipeline with small changes and progressive rollout for deploy; dashboards, symptom-based alerts, structured logs, traces, and SLOs for production feedback; and runbooks plus blameless postmortems with tracked action items for incidents. The outer loops in particular close fast only when the team that built a service also operates it, because a handoff to another team inserts wait states into exactly the loops that are most time-sensitive.',
        aHi: 'Software deliver karने ka har step ek loop hai jismें aap ek action lेte ho, ek result observe karते ho, isse seekhते ho, aur adjust karते ho, aur delivery as a whole aisे kई loops fast se slow tak nested hain. Har loop ki latency bound karती hai ki aap us level par kitni jaldi seekh aur correct kar sakते ho, aur slow loops kaam ko pile up bhi karवाते hain. System ko faster learn karवाना matlab har loop ko iske appropriate techniques se shorten karना: inner loop ke liye hot reload; CI ke liye parallelising, caching, fail fast; review ke liye small PRs; deploy ke liye ek automated pipeline; production feedback ke liye dashboards, symptom-based alerts, SLOs; incidents ke liye runbooks aur blameless postmortems. Outer loops specifically sirf tab fast close hote hain jab jo team ne ek service build ki wo ise operate bhi karती hai.',
      },
      {
        q: 'What is a blameless postmortem, and why does blame break the learning process?',
        qHi: 'Ek blameless postmortem kya hai, aur blame learning process ko kyun todता hai?',
        a: 'A blameless postmortem is an incident review that treats any human action involved as the trigger that made a latent systemic weakness visible, not as the cause, and asks what about the system — the code, the process, the tooling, the defaults, the interface, the missing guardrail — allowed the incident to happen and made it hard to detect or recover from. It deliberately does not ask who performed the action, because the person who ran a command or made a change is almost never the root cause; the root cause is that the command was easy to run by mistake, or there was no confirmation step, or two environments were hard to tell apart, or an account had more privilege than the task needed, or the staging environment could not catch the class of failure. The output is a set of concrete systemic fixes, each with an owner and a deadline, tracked to completion. Blame breaks the learning process because the incident loop only closes if people report honestly what happened, and people report honestly only when doing so is safe. When individuals are named as causes and prescribed more care or oversight, they learn that admitting error is costly, so they hide near-misses, delay reporting problems, and avoid working in risky areas — which stops the organisation from learning precisely where it most needs to. Blamelessness is not the absence of accountability; it directs accountability at improving the system rather than at punishing a person for a weakness the system contained.',
        aHi: 'Ek blameless postmortem ek incident review hai jo kisi bhi involved human action ko wo trigger manता hai jisne ek latent systemic weakness ko visible banाya, cause nahi, aur poochता hai ki system ke baare mein kya — code, process, tooling, defaults, interface, missing guardrail — ne incident ko hone diya. Ye deliberately nahi poochता ki action kisne perform kiya, kyunki jis vyakti ne ek command chalाya wo lagभag kabhi root cause nahi hai. Output concrete systemic fixes ka ek set hai, har ek ek owner aur ek deadline ke saath. Blame learning process ko todता hai kyunki incident loop sirf tab close hota hai agar log honestly report karें ki kya hua, aur log sirf tab honestly report karें jab aisा karna safe ho. Blamelessness accountability ki absence nahi hai; ye accountability ko system improve karने ki taraf direct karता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list at least six feedback loops in software delivery from fastest to slowest, with a rough latency and the question each answers. Then pick the two you\'d invest in tightening first for a team shipping daily, and say why.',
        taskHi: 'Ek comment mein, software delivery mein kam se kam chah feedback loops fastest se slowest list karo, ek rough latency aur har ek jo sawal answer karता hai ke saath.',
        hint: 'edit→hot reload (<1s: did it render?), local tests (s: broke a function?), CI (min: broke the build/other tests?), review (min–hr: right approach?), staging deploy (min: runs prod-like?), prod deploy+observe (min–hr: healthy under real traffic?), regression→alert (s–min: did a release break something?), incident→fix (hr–day: what went wrong + prevent). Invest first in CI (blocks every merge) and prod feedback/alerting (bounds MTTR).',
        hintHi: 'edit→hot reload (<1s), local tests (s), CI (min), review (min–hr), staging deploy (min), prod deploy+observe (min–hr), regression→alert (s–min), incident→fix (hr–day). Pehle CI aur prod feedback/alerting mein invest karo.',
      },
      {
        task: 'A memory leak ships and takes 6 hours to OOM the pod. In a comment, contrast how the "regression" and "incident" loops close under a dev/ops handoff versus "you build it, you run it", and identify exactly where the handoff inserts delay.',
        taskHi: 'Ek memory leak ship hoti hai aur pod ko OOM karने mein 6 ghante leती hai. Ek comment mein, contrast karo ki "regression" aur "incident" loops kaise close hote hain.',
        hint: 'Handoff: ops is paged, can mitigate (restart, bump limit) but not diagnose code → ticket → dev can\'t repro locally → asks for a heap dump → waits → investigates next day (~30h). YBIYRI: authoring on-call is paged with a dashboard link → correlates to the deploy → one-command rollback (healthy in ~10 min) → author reads their own heap profile next morning, fixes it. Delay is inserted at every dev↔ops relay: ticket pickup, repro attempts, artifact requests.',
        hintHi: 'Handoff: ops paged, mitigate kar sakta hai par diagnose nahi → ticket → dev repro nahi kar sakta → heap dump maangता hai → wait → next day investigate (~30h). YBIYRI: authoring on-call paged → deploy se correlate → one-command rollback → author apna heap profile padhta hai. Delay har dev↔ops relay par insert hoती hai.',
      },
      {
        task: 'An engineer ran a cleanup script against prod (it defaulted to prod) and deleted 40k rows. In a comment, write the blameless postmortem: 5+ systemic factors that made this easy/undetectable, and the concrete fix for each. State why "the engineer will be more careful" is not on the list.',
        taskHi: 'Ek engineer ne prod ke against ek cleanup script chalाया (ye prod default kiya) aur 40k rows delete kiye. Ek comment mein, blameless postmortem likho.',
        hint: 'Factors + fixes: script defaulted to prod → no default, require explicit `--env`; staging/prod terminals look identical → colored prompt + env in PS1; no dry-run / no "type the env to confirm" → add both; the DB user had DELETE on that table → least privilege; no row-count confirmation → "this affects 40,000 rows, continue?"; thin runbook → rewrite with safety notes. "Be more careful" isn\'t a change to the system, so it can\'t prevent recurrence.',
        hintHi: 'Factors + fixes: script prod default → explicit `--env` require karो; staging/prod terminals identical → colored prompt; koi dry-run nahi → add karो; DB user ke paas DELETE tha → least privilege; koi row-count confirmation nahi → add karो; thin runbook → rewrite. "Zyada careful" system mein ek change nahi hai.',
      },
    ],

    keyTakeaways: [
      'Delivery = NESTED FEEDBACK LOOPS (act → observe → learn → adjust), fast to slow: edit→hot reload (<1s) · local tests (s) · CI (min) · PR review (min–hr) · staging deploy (min) · prod deploy + observe (min–hr) · regression→alert (s–min) · incident→root cause→prevention (hr–day). Each loop\'s LATENCY bounds how fast you learn at that level; slow loops also pile up work (you context-switch away while waiting, then have to switch back).',
      'TIGHTEN each loop with loop-specific techniques: INNER (edit/test) — hot reload, fast runner, run only affected tests, prod-like local env. CI — parallelise, cache deps, split the suite, order checks cheapest-first + FAIL FAST, budget the pipeline duration (e.g. p95 < 10 min) and defend it. REVIEW — small PRs, clear description, all automated checks green before a human looks. DEPLOY — automated pipeline, small changes, canary + auto-rollback. PROD FEEDBACK — dashboards, alerts on SYMPTOMS (error rate/latency/saturation) not causes, structured logs + traces, SLOs. INCIDENT — runbooks, blameless postmortems, tracked action items.',
      'The INNER loops close on the developer in any model. The OUTER loops (prod regression, diagnosis, incident) close fast ONLY under "YOU BUILD IT, YOU RUN IT": the authoring team is ON CALL for the service, has scoped+audited PROD ACCESS to its own logs/metrics/traces, and runs its own deploys/rollbacks ⇒ the person who can fix it fastest finds out first. A handoff inserts wait states into exactly the loops that matter most during an incident.',
      'Ownership MUST come with support or it\'s just punishment: per-service dashboards + SLO-based alerts, runbooks for known failure modes, ONE-COMMAND rollback, a rotation of ~6+ so on-call is occasional, comp/time-off for nights, and a hard rule that EVERY page produces a fix or a suppression. A team buried in pages = a signal to invest, not to try harder.',
      'BLAMELESS POSTMORTEM asks "what in the SYSTEM — defaults, ambiguous UI, missing confirmation, excess privilege, thin runbook, staging that couldn\'t catch it — let this happen and made it hard to detect/recover?" NOT "who did it?". The human action is the TRIGGER, not the cause. Output = 3–8 systemic fixes, each with an owner + due date, tracked to completion. "Be more careful" is NEVER an action item. Blame ⇒ people hide near-misses ⇒ the loop never closes.',
    ],
    keyTakeawaysHi: [
      'Delivery = NESTED FEEDBACK LOOPS (act → observe → learn → adjust), fast se slow: edit→hot reload (<1s) · local tests (s) · CI (min) · PR review (min–hr) · staging deploy (min) · prod deploy + observe (min–hr) · regression→alert (s–min) · incident→prevention (hr–day). Har loop ki LATENCY bound karती hai ki aap us level par kitni fast seekhते ho.',
      'Har loop ko loop-specific techniques se TIGHTEN karो: INNER — hot reload, fast runner, sirf affected tests. CI — parallelise, cache, split, cheapest-first + FAIL FAST, pipeline duration budget karो. REVIEW — small PRs, human se pehle saare automated checks green. DEPLOY — automated pipeline, small changes, canary + auto-rollback. PROD FEEDBACK — dashboards, SYMPTOMS par alerts, logs + traces, SLOs. INCIDENT — runbooks, blameless postmortems.',
      'INNER loops kisi bhi model mein developer par close hote hain. OUTER loops (prod regression, diagnosis, incident) SIRF "YOU BUILD IT, YOU RUN IT" ke under fast close hote hain: authoring team service ke liye ON CALL hai, apni logs/metrics/traces ka scoped PROD ACCESS hai, apne deploys/rollbacks chalाती hai. Ek handoff un loops mein wait states insert karता hai jo ek incident ke dauran sabse zyada matter karते hain.',
      'Ownership ke saath support AANA CHAHIYE ya ye sirf punishment hai: per-service dashboards + SLO-based alerts, runbooks, ONE-COMMAND rollback, ~6+ ki ek rotation, nights ke liye comp, aur ek hard rule ki HAR page ek fix ya suppression produce karता hai. Pages mein dabी ek team = invest karने ka signal.',
      'BLAMELESS POSTMORTEM poochता hai "SYSTEM mein kya — defaults, ambiguous UI, missing confirmation, excess privilege, thin runbook — ne ise hone diya?" "kisne kiya?" NAHI. Human action TRIGGER hai, cause nahi. Output = 3–8 systemic fixes, har ek ek owner + due date ke saath. "Zyada careful" KABHI ek action item nahi. Blame ⇒ log near-misses chhupाते hain ⇒ loop kabhi close nahi hota.',
    ],
  },
];
