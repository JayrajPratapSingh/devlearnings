/**
 * Generative AI Complete Course — Module 17: Open-Source & Local Models, lessons 1-3.
 *
 * Lesson 1: Open vs closed models — a genuine tradeoff, not a philosophical stance.
 * Lesson 2: Running models locally with Ollama — the practical mechanics.
 * Lesson 3: When local inference genuinely makes sense for a product.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_17: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-open-vs-closed-models-tradeoffs',
    title: 'Open vs Closed Models — a Genuine Tradeoff, Not a Philosophical Stance',
    titleHi: 'Open Vs Closed Models — Ek Genuine Tradeoff, Ek Philosophical Stance Nahi',
    description:
      "Open-weight models (downloadable, runnable on infrastructure you control) and closed, API-only models (Claude, GPT) trade off along concrete, measurable dimensions — capability, cost structure, data control, and operational burden — not along an ideological open-vs-proprietary line.",
    descriptionHi:
      'Open-weight models (downloadable, aisi infrastructure pe runnable jise aap control karte ho) aur closed, API-only models (Claude, GPT) concrete, measurable dimensions ke across trade off karte hain — capability, cost structure, data control, aur operational burden — ek ideological open-vs-proprietary line ke across nahi.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 1,

    analogy: {
      en: "**Buying a fully-assembled, professionally-maintained car with a service contract versus buying the raw components and building/maintaining the car yourself in your own garage — a genuine tradeoff between convenience and control, not a moral choice between good and bad car ownership.** Someone who buys a fully-assembled car with a manufacturer service contract gets convenience: they don't need a garage, mechanical expertise, or ongoing maintenance effort — they pay for that convenience through the manufacturer's markup and lose the ability to inspect or modify what's actually inside the engine. Someone who buys raw components and assembles the car themselves gains real control — they know exactly what's inside, can modify anything, and aren't dependent on the manufacturer staying in business or keeping prices reasonable — but they take on real, ongoing responsibility for maintenance, need actual mechanical skill and a garage to work in, and bear the consequences if something goes wrong that they don't know how to fix. Neither choice is objectively correct; a daily commuter with no interest in mechanics is well-served by the service contract, while someone building a highly customized vehicle for a specific purpose that off-the-shelf cars don't serve well needs the raw components. Closed, API-only models (Claude, GPT) are the fully-assembled car — convenient, professionally maintained, but you don't control the infrastructure or see inside. Open-weight models (Llama, Mistral, and others) are the raw components — full control over where they run and what happens to your data, at the real cost of needing the infrastructure and expertise to run and maintain them yourself.",
      hi: 'ek fully-assembled, professionally-maintained car ko ek service contract ke saath khareedna versus raw components khareedna aur car ko khud apne garage mein build/maintain karna — convenience aur control ke beech ek genuine tradeoff, achhe aur bure car ownership ke beech ek moral choice nahi. Koi jo ek manufacturer service contract ke saath ek fully-assembled car khareedta hai convenience paata hai: unhe koi garage, mechanical expertise, ya ongoing maintenance effort nahi chahiye — wo us convenience ke liye manufacturer ke markup ke through pay karte hain aur engine ke andar actually kya hai use inspect ya modify karne ki ability khote hain. Koi jo raw components khareedta hai aur car ko khud assemble karta hai real control gain karta hai — unhe exactly pata hai andar kya hai, kuch bhi modify kar sakte hain, aur manufacturer ke business mein rehne ya prices reasonable rakhne pe dependent nahi hain — par wo maintenance ke liye real, ongoing responsibility lete hain, unhe actual mechanical skill aur kaam karne ke liye ek garage chahiye, aur consequences bear karte hain agar kuch galat ho jaaye jise fix karna unhe nahi aata. Koi bhi choice objectively correct nahi hai; ek daily commuter jise mechanics mein koi interest nahi service contract se well-served hai, jabki koi jo ek highly customized vehicle build kar raha hai ek specific purpose ke liye jo off-the-shelf cars achhe se serve nahi karti unhe raw components chahiye. Closed, API-only models (Claude, GPT) fully-assembled car hain — convenient, professionally maintained, par aap infrastructure control nahi karte ya andar nahi dekh sakte. Open-weight models (Llama, Mistral, aur doosre) raw components hain — jahan wo run karte hain aur aapke data ka kya hota hai iske upar full control, real cost ke saath ki unhe khud run aur maintain karne ke liye infrastructure aur expertise chahiye.',
    },

    simple: `**The concrete, measurable dimensions this tradeoff actually
happens along — not an ideological preference:**

\`\`\`
CAPABILITY: the largest, most capable closed models (frontier models
  from Anthropic, OpenAI, Google) typically lead on the hardest,
  most nuanced tasks. Open-weight models have closed much of this
  gap for many practical tasks, but a genuine capability difference
  can still exist for the most demanding use cases.

COST STRUCTURE: closed models are usage-based (pay per token via
  API) — no infrastructure to manage, but cost scales directly with
  usage. Open-weight models require upfront infrastructure investment
  (GPUs, hosting) but usage beyond that infrastructure's capacity is
  effectively free — the economics favor closed models at LOW,
  variable volume and open models at HIGH, predictable volume.

DATA CONTROL: with a closed, API-only model, request data leaves
  your infrastructure and goes to the provider (subject to their data
  usage policies). With a self-hosted open-weight model, data never
  leaves infrastructure you control — a genuine, structural difference
  for regulated industries or specific data-residency requirements.

OPERATIONAL BURDEN: a closed API requires zero infrastructure
  management from you. A self-hosted open-weight model requires
  you to provision, monitor, scale, and maintain the serving
  infrastructure yourself — real, ongoing operational work.
\`\`\`

**A concrete decision-support function making these dimensions
explicit, rather than leaving the choice as a vague preference:**

\`\`\`ts
interface ModelChoiceFactors {
  requestVolumeIsHighAndPredictable: boolean;
  dataResidencyIsHardRequirement: boolean; // e.g., healthcare, government, EU-only
  taskNeedsFrontierCapability: boolean; // the hardest, most nuanced reasoning tasks
  teamHasInfraCapacity: boolean; // GPUs, MLOps expertise, on-call capacity
}

function recommendModelType(factors: ModelChoiceFactors): 'closed_api' | 'open_self_hosted' {
  if (factors.dataResidencyIsHardRequirement && factors.teamHasInfraCapacity) {
    return 'open_self_hosted'; // data control is a hard requirement, not a preference
  }
  if (factors.taskNeedsFrontierCapability) {
    return 'closed_api'; // capability need outweighs the other factors
  }
  if (factors.requestVolumeIsHighAndPredictable && factors.teamHasInfraCapacity) {
    return 'open_self_hosted'; // the cost-structure crossover favors self-hosting at scale
  }
  return 'closed_api'; // the default for most teams at most stages
}
\`\`\`

**Why "open-source" is a genuinely useful but imprecise umbrella
term — most "open" models are open-WEIGHT, not open-DATA or
open-TRAINING-CODE:**

\`\`\`
Most models described as "open-source" (Llama, Mistral, and similar)
release the trained model WEIGHTS for download and local use, but
typically do NOT release the full training dataset or complete
training code — meaning "open-weight" is the more precise term for
what's actually available. This distinction matters for anyone doing
genuine research reproducibility, but for the practical, production-
usage tradeoffs this lesson focuses on, weight availability (can I
download and run this myself) is the dimension that actually matters.
\`\`\`

**Why this decision connects directly to Module 10's cost/latency
framework and Module 12's security framework, not just to abstract
open-source values:**

\`\`\`
The cost-structure difference (usage-based vs infrastructure-based) is
a direct extension of Module 10's cost-estimation discipline — the
"right" choice depends on YOUR actual usage volume, not a general rule.
The data-control difference connects directly to Module 12's data-
handling and privacy principles — for some products, data never
leaving your own infrastructure is a genuine, non-negotiable security
or compliance requirement, not a preference.
\`\`\``,

    simpleHi: `**Concrete, measurable dimensions jinke across ye tradeoff actually
hota hai — ek ideological preference nahi:**

\`\`\`
CAPABILITY: sabse bade, sabse capable closed models (Anthropic,
  OpenAI, Google se frontier models) typically hardest, sabse
  nuanced tasks pe lead karte hain. Open-weight models ne is gap ka
  zyada tar close kar diya hai kai practical tasks ke liye, par ek
  genuine capability difference abhi bhi sabse demanding use cases
  ke liye exist kar sakta hai.

COST STRUCTURE: closed models usage-based hain (per token pay karo
  API ke through) — koi infrastructure manage nahi karna, par cost
  directly usage ke saath scale karti hai. Open-weight models ko
  upfront infrastructure investment chahiye (GPUs, hosting) par us
  infrastructure ki capacity se aage usage effectively free hai —
  economics LOW, variable volume pe closed models ko favor karta hai
  aur HIGH, predictable volume pe open models ko.

DATA CONTROL: ek closed, API-only model ke saath, request data
  aapki infrastructure chhod deta hai aur provider ko jaata hai
  (unki data usage policies ke subject). Ek self-hosted open-weight
  model ke saath, data kabhi aapki control ki infrastructure nahi
  chhodta — regulated industries ya specific data-residency
  requirements ke liye ek genuine, structural difference.

OPERATIONAL BURDEN: ek closed API ko aap se zero infrastructure
  management chahiye. Ek self-hosted open-weight model ko aapko
  serving infrastructure khud provision, monitor, scale, aur
  maintain karna chahiye — real, ongoing operational work.
\`\`\`

**Ek concrete decision-support function jo in dimensions ko explicit
banata hai, choice ko ek vague preference ki tarah chhodne ke bajaye:**

\`\`\`ts
interface ModelChoiceFactors {
  requestVolumeIsHighAndPredictable: boolean;
  dataResidencyIsHardRequirement: boolean; // e.g., healthcare, government, EU-only
  taskNeedsFrontierCapability: boolean; // hardest, sabse nuanced reasoning tasks
  teamHasInfraCapacity: boolean; // GPUs, MLOps expertise, on-call capacity
}

function recommendModelType(factors: ModelChoiceFactors): 'closed_api' | 'open_self_hosted' {
  if (factors.dataResidencyIsHardRequirement && factors.teamHasInfraCapacity) {
    return 'open_self_hosted'; // data control ek hard requirement hai, preference nahi
  }
  if (factors.taskNeedsFrontierCapability) {
    return 'closed_api'; // capability need doosre factors se zyada weigh karta hai
  }
  if (factors.requestVolumeIsHighAndPredictable && factors.teamHasInfraCapacity) {
    return 'open_self_hosted'; // cost-structure crossover self-hosting ko scale pe favor karta hai
  }
  return 'closed_api'; // zyada tar teams ke liye zyada tar stages pe default
}
\`\`\`

**"Open-source" ek genuinely useful par imprecise umbrella term kyun
hai — zyada tar "open" models open-WEIGHT hain, open-DATA ya
open-TRAINING-CODE nahi:**

\`\`\`
Zyada tar "open-source" describe kiye gaye models (Llama, Mistral, aur
similar) trained model WEIGHTS ko download aur local use ke liye
release karte hain, par typically poora training dataset ya complete
training code release NAHI karte — matlab "open-weight" zyada precise
term hai us cheez ke liye jo actually available hai. Ye distinction
kisi bhi ke liye matter karta hai jo genuine research reproducibility
kar raha hai, par practical, production-usage tradeoffs ke liye jispe
ye lesson focus karta hai, weight availability (kya main ise khud
download aur run kar sakta hoon) wo dimension hai jo actually matter
karta hai.
\`\`\`

**Ye decision directly Module 10 ke cost/latency framework aur Module
12 ke security framework se kaise connect karta hai, sirf abstract
open-source values se nahi:**

\`\`\`
Cost-structure difference (usage-based vs infrastructure-based) Module
10 ke cost-estimation discipline ka ek direct extension hai — "sahi"
choice AAPKI actual usage volume pe depend karti hai, ek general rule
pe nahi. Data-control difference directly Module 12 ke data-handling
aur privacy principles se connect karta hai — kuch products ke liye,
data kabhi aapki apni infrastructure nahi chhodna ek genuine, non-
negotiable security ya compliance requirement hai, ek preference nahi.
\`\`\``,

    content: `## Why the open-vs-closed model decision is a concrete engineering
tradeoff, not an ideological or moral choice

Framing the choice between open-weight and closed, API-only models as
a matter of principle (open-source is inherently better, or proprietary
is inherently more reliable) obscures the actual, measurable dimensions
the decision turns on: capability for the specific task at hand, cost
structure relative to actual usage volume, data-control requirements,
and the team's real operational capacity to run infrastructure. Two
teams with genuinely different constraints can correctly arrive at
opposite choices — this is a sign the framework is working, not a sign
one team made a philosophically wrong call.

## Why the cost-structure crossover point is a direct application of
Module 10's cost-estimation discipline, not a separate calculation

Closed, API-only models bill per unit of usage (tokens processed),
meaning cost scales linearly and predictably with volume but never
requires upfront infrastructure investment. Open-weight, self-hosted
models require real upfront infrastructure cost (GPU provisioning,
hosting) that is largely fixed regardless of usage volume within that
infrastructure's capacity. This means there is a genuine crossover
point — at sufficiently high, sustained volume, self-hosting becomes
cheaper per request than API usage — and finding that crossover point
for a specific team's actual (not hypothetical) usage volume is a
direct, concrete application of Module 10's broader cost-estimation
principle: understand your actual usage pattern before choosing an
approach.

## Why data control is sometimes a hard, non-negotiable requirement
rather than a soft preference, connecting directly to Module 12

For some products — healthcare data subject to specific regulatory
requirements, government contracts with data-residency mandates,
companies in jurisdictions with strict data-sovereignty rules — data
never leaving infrastructure the team directly controls is a genuine,
non-negotiable compliance requirement, not a matter of preference.
This connects directly to Module 12's data-handling and privacy
principles: for these specific cases, a self-hosted open-weight model
may be the only architecture that satisfies the actual constraint,
regardless of what capability or cost tradeoffs would otherwise favor.

## Why "open-source" is an imprecise term worth being careful with in
production discussions

Most models commonly called "open-source" (Llama, Mistral, and similar)
release trained model weights for download and local use, but typically
withhold the full training dataset and complete training pipeline code
— meaning "open-weight" is the more accurate term for what's actually
available. This distinction matters significantly for anyone attempting
genuine research reproducibility, but for the practical production
tradeoffs this lesson addresses, weight availability (whether the model
can be downloaded and run independently) is the dimension that actually
drives the capability, cost, and data-control tradeoffs discussed
above — which is why this course uses "open-weight" as the precise term
throughout, while acknowledging "open-source" as the common, if
imprecise, industry usage.`,

    contentHi: `## Open-vs-closed model decision ek concrete engineering tradeoff kyun hai, ek ideological ya moral choice nahi

Open-weight aur closed, API-only models ke beech choice ko principle
ki matter ki tarah frame karna (open-source inherently behtar hai, ya
proprietary inherently zyada reliable hai) actual, measurable
dimensions ko obscure karta hai jinpe decision turn karta hai: hath
mein specific task ke liye capability, actual usage volume ke relative
cost structure, data-control requirements, aur team ki infrastructure
run karne ki real operational capacity. Do teams genuinely different
constraints ke saath correctly opposite choices pe pahunch sakte hain
— ye ek sign hai ki framework kaam kar raha hai, ek sign nahi ki ek
team ne philosophically galat call li.

## Cost-structure crossover point Module 10 ke cost-estimation discipline ka ek direct application kyun hai, ek separate calculation nahi

Closed, API-only models per unit of usage bill karte hain (processed
tokens), matlab cost linearly aur predictably volume ke saath scale
karti hai par kabhi upfront infrastructure investment nahi maangti.
Open-weight, self-hosted models ko real upfront infrastructure cost
chahiye (GPU provisioning, hosting) jo largely fixed hai us
infrastructure ki capacity ke andar usage volume se independently. Iska
matlab hai ek genuine crossover point hai — sufficiently high,
sustained volume pe, self-hosting API usage se per request cheaper ban
jaata hai — aur ek specific team ki actual (hypothetical nahi) usage
volume ke liye us crossover point ko dhundhna Module 10 ke broader
cost-estimation principle ka ek direct, concrete application hai: ek
approach choose karne se pehle apna actual usage pattern samjho.

## Data control kabhi kabhi ek hard, non-negotiable requirement kyun hai ek soft preference ke bajaye, directly Module 12 se connect karte hue

Kuch products ke liye — healthcare data jo specific regulatory
requirements ke subject hai, government contracts jinke paas data-
residency mandates hain, companies un jurisdictions mein jinke strict
data-sovereignty rules hain — data kabhi team ki directly controlled
infrastructure nahi chhodna ek genuine, non-negotiable compliance
requirement hai, preference ki matter nahi. Ye directly Module 12 ke
data-handling aur privacy principles se connect karta hai: in specific
cases ke liye, ek self-hosted open-weight model ekmatra architecture ho
sakta hai jo actual constraint satisfy karta hai, chahe capability ya
cost tradeoffs otherwise kya favor karte.

## "Open-source" production discussions mein careful hone layak ek imprecise term kyun hai

Zyada tar models jo commonly "open-source" kahe jaate hain (Llama,
Mistral, aur similar) trained model weights ko download aur local use
ke liye release karte hain, par typically poora training dataset aur
complete training pipeline code withhold karte hain — matlab "open-
weight" zyada accurate term hai us cheez ke liye jo actually available
hai. Ye distinction significantly matter karta hai kisi ke liye jo
genuine research reproducibility attempt kar raha hai, par practical
production tradeoffs ke liye jinhe ye lesson address karta hai, weight
availability (kya model independently download aur run kiya ja sakta
hai) wo dimension hai jo actually upar discuss kiye gaye capability,
cost, aur data-control tradeoffs ko drive karti hai — yahi wajah hai ye
course "open-weight" ko throughout precise term ki tarah use karta hai,
"open-source" ko common, chahe imprecise, industry usage ki tarah
acknowledge karte hue.`,

    examples: [
      {
        title: 'A model-choice recommendation function applied to three real product scenarios',
        titleHi: 'Ek model-choice recommendation function jo teen real product scenarios pe applied hai',
        codeJs: `function recommendModelType({
  requestVolumeIsHighAndPredictable,
  dataResidencyIsHardRequirement,
  taskNeedsFrontierCapability,
  teamHasInfraCapacity,
}) {
  if (dataResidencyIsHardRequirement && teamHasInfraCapacity) return 'open_self_hosted';
  if (taskNeedsFrontierCapability) return 'closed_api';
  if (requestVolumeIsHighAndPredictable && teamHasInfraCapacity) return 'open_self_hosted';
  return 'closed_api';
}

// Scenario 1: an early-stage startup with a novel, complex reasoning
// task, low and unpredictable volume, no dedicated MLOps team
console.log(recommendModelType({
  requestVolumeIsHighAndPredictable: false,
  dataResidencyIsHardRequirement: false,
  taskNeedsFrontierCapability: true,
  teamHasInfraCapacity: false,
})); // "closed_api"

// Scenario 2: a healthcare company with a hard requirement that
// patient data never leaves their own infrastructure, and a real
// platform engineering team
console.log(recommendModelType({
  requestVolumeIsHighAndPredictable: true,
  dataResidencyIsHardRequirement: true,
  taskNeedsFrontierCapability: false,
  teamHasInfraCapacity: true,
})); // "open_self_hosted"

// Scenario 3: a high-volume, well-understood classification task
// (not frontier-capability-demanding) with a mature infra team
console.log(recommendModelType({
  requestVolumeIsHighAndPredictable: true,
  dataResidencyIsHardRequirement: false,
  taskNeedsFrontierCapability: false,
  teamHasInfraCapacity: true,
})); // "open_self_hosted"`,
        codeTs: `interface ModelChoiceFactors {
  requestVolumeIsHighAndPredictable: boolean;
  dataResidencyIsHardRequirement: boolean;
  taskNeedsFrontierCapability: boolean;
  teamHasInfraCapacity: boolean;
}

type ModelChoice = 'closed_api' | 'open_self_hosted';

function recommendModelType(factors: ModelChoiceFactors): ModelChoice {
  const { requestVolumeIsHighAndPredictable, dataResidencyIsHardRequirement, taskNeedsFrontierCapability, teamHasInfraCapacity } = factors;

  if (dataResidencyIsHardRequirement && teamHasInfraCapacity) return 'open_self_hosted';
  if (taskNeedsFrontierCapability) return 'closed_api';
  if (requestVolumeIsHighAndPredictable && teamHasInfraCapacity) return 'open_self_hosted';
  return 'closed_api';
}

// Scenario 1: an early-stage startup with a novel, complex reasoning
// task, low and unpredictable volume, no dedicated MLOps team
console.log(recommendModelType({
  requestVolumeIsHighAndPredictable: false,
  dataResidencyIsHardRequirement: false,
  taskNeedsFrontierCapability: true,
  teamHasInfraCapacity: false,
})); // "closed_api"

// Scenario 2: a healthcare company with a hard requirement that
// patient data never leaves their own infrastructure, and a real
// platform engineering team
console.log(recommendModelType({
  requestVolumeIsHighAndPredictable: true,
  dataResidencyIsHardRequirement: true,
  taskNeedsFrontierCapability: false,
  teamHasInfraCapacity: true,
})); // "open_self_hosted"

// Scenario 3: a high-volume, well-understood classification task
// (not frontier-capability-demanding) with a mature infra team
console.log(recommendModelType({
  requestVolumeIsHighAndPredictable: true,
  dataResidencyIsHardRequirement: false,
  taskNeedsFrontierCapability: false,
  teamHasInfraCapacity: true,
})); // "open_self_hosted"`,
        code: `if (dataResidencyIsHardRequirement && teamHasInfraCapacity) return 'open_self_hosted';
if (taskNeedsFrontierCapability) return 'closed_api';
if (requestVolumeIsHighAndPredictable && teamHasInfraCapacity) return 'open_self_hosted';
return 'closed_api';`,
        output:
          "Three genuinely different scenarios produce three different, individually correct recommendations — a startup with novel reasoning needs and no infra team correctly lands on a closed API, while a healthcare company with hard data-residency requirements and real infra capacity correctly lands on self-hosting, even though both are building AI features.",
        explain:
          "This example makes the lesson's core point concrete: the recommendation follows mechanically from a team's actual constraints (data requirements, capability needs, volume, infra capacity), not from a general preference for openness or convenience — which is exactly why two reasonable teams can correctly choose oppositely.",
        explainHi:
          "Ye example lesson ke core point ko concrete banata hai: recommendation ek team ke actual constraints se mechanically follow karti hai (data requirements, capability needs, volume, infra capacity), openness ya convenience ke liye ek general preference se nahi — yahi exactly wajah hai do reasonable teams correctly oppositely choose kar sakti hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Choosing a model type based on ideological preference ("open
// source is always better") rather than the team's actual constraints
function chooseModelWrong() {
  // No consideration of actual usage volume, infra capacity, data
  // requirements, or task difficulty — just a general principle
  return 'open_self_hosted'; // "because open source is better"
}`,
        right: `// Choosing based on the team's actual, measured constraints
function chooseModelRight(factors) {
  if (factors.dataResidencyIsHardRequirement && factors.teamHasInfraCapacity) {
    return 'open_self_hosted';
  }
  if (factors.taskNeedsFrontierCapability) {
    return 'closed_api';
  }
  if (factors.requestVolumeIsHighAndPredictable && factors.teamHasInfraCapacity) {
    return 'open_self_hosted';
  }
  return 'closed_api'; // the honest default absent a specific reason to self-host
}`,
        why: "Choosing a model architecture based on a general ideological preference, rather than the team's actual usage volume, data requirements, capability needs, and infrastructure capacity, risks either overpaying for infrastructure a low-volume team doesn't need, or accepting a capability gap a high-stakes task can't tolerate — the correct choice is genuinely situational, not fixed.",
        whyHi:
          "Ek model architecture ko ek general ideological preference ke basis pe choose karna, team ki actual usage volume, data requirements, capability needs, aur infrastructure capacity ke bajaye, ya to ek low-volume team ke liye infrastructure ke liye overpay karne ka risk leta hai jo unhe chahiye nahi, ya ek capability gap accept karta hai jise ek high-stakes task tolerate nahi kar sakta — correct choice genuinely situational hai, fixed nahi.",
      },
    ],

    realWorld: [
      {
        en: "A production fintech company initially defaulted to a closed API for all AI features out of convenience, then migrated a specific, high-volume, well-understood document-classification feature to a self-hosted open-weight model after a genuine cost analysis showed the crossover point had been reached — while keeping their frontier-capability customer-facing reasoning features on the closed API, illustrating that the right architecture can genuinely differ across features within the same company.",
        hi: 'Ek production fintech company ne initially convenience ke liye sab AI features ke liye ek closed API default kiya, phir ek specific, high-volume, well-understood document-classification feature ko ek self-hosted open-weight model mein migrate kiya ek genuine cost analysis ke baad jisne dikhaya ki crossover point pahunch chuka tha — jabki apne frontier-capability customer-facing reasoning features ko closed API pe rakhte hue, illustrate karte hue ki correct architecture genuinely wahi company ke andar features ke across differ kar sakta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the four concrete dimensions along which the open-weight vs closed-API model decision should actually be made?',
        qHi: 'Kaunse chaar concrete dimensions hain jinke across open-weight vs closed-API model decision actually banaya jaana chahiye?',
        a: "Capability (whether the task needs frontier-level reasoning), cost structure (usage-based API pricing versus upfront infrastructure investment, which crosses over at high enough sustained volume), data control (whether data must never leave infrastructure the team controls), and operational burden (whether the team has the infrastructure and expertise to self-host and maintain a model).",
        aHi: 'Capability (kya task ko frontier-level reasoning chahiye), cost structure (usage-based API pricing versus upfront infrastructure investment, jo sufficiently high sustained volume pe crossover karta hai), data control (kya data ko kabhi bhi team ki controlled infrastructure nahi chhodna chahiye), aur operational burden (kya team ke paas ek model ko self-host aur maintain karne ke liye infrastructure aur expertise hai).',
      },
      {
        q: "Why is 'open-source' an imprecise term for most models commonly described that way, and what is the more accurate term?",
        qHi: "'Open-source' zyada tar un models ke liye ek imprecise term kyun hai jinhe commonly is tarah describe kiya jaata hai, aur zyada accurate term kya hai?",
        a: "Most models called 'open-source' (Llama, Mistral, etc.) release the trained model weights for download and local use, but typically don't release the full training dataset or complete training pipeline code. 'Open-weight' is the more accurate term for what's actually available, and it's the dimension (can I download and run this model myself) that drives the practical production tradeoffs.",
        aHi: 'Zyada tar models jo \'open-source\' kahe jaate hain (Llama, Mistral, etc.) trained model weights ko download aur local use ke liye release karte hain, par typically poora training dataset ya complete training pipeline code release nahi karte. \'Open-weight\' zyada accurate term hai us cheez ke liye jo actually available hai, aur ye wo dimension hai (kya main is model ko khud download aur run kar sakta hoon) jo practical production tradeoffs ko drive karta hai.',
      },
    ],

    exercises: [
      {
        task: "A team processes 50 million tokens per day through a closed API at a steady, predictable rate, and calculates that the equivalent self-hosted GPU infrastructure would cost less per month than their current API bill, while their task doesn't require frontier-level capability and they have an experienced infrastructure team. Using this lesson's decision framework, what should they do, and what single factor would change this recommendation?",
        taskHi: 'Ek team roz 50 million tokens process karti hai ek closed API ke through ek steady, predictable rate pe, aur calculate karti hai ki equivalent self-hosted GPU infrastructure unke current API bill se per month kam cost karegi, jabki unka task frontier-level capability nahi maangta aur unke paas ek experienced infrastructure team hai. Is lesson ke decision framework use karke, unhe kya karna chahiye, aur kaunsa single factor is recommendation ko badal dega?',
        hint: "Walk through each of the four dimensions with the specifics given — volume, capability need, data requirements (not mentioned — assume no hard requirement), and infra capacity — and see which choice the framework produces.",
        hintHi: 'Diye gaye specifics ke saath chaaron dimensions mein se har ek ko walk through karo — volume, capability need, data requirements (mention nahi kiye gaye — assume karo koi hard requirement nahi hai), aur infra capacity — aur dekho framework kaunsi choice produce karta hai.',
      },
    ],

    keyTakeaways: [
      "The open-weight vs closed-API decision should be made on four concrete, measurable dimensions — capability, cost structure, data control, and operational burden — not ideological preference.",
      "Cost structure has a genuine crossover point: API pricing favors low/unpredictable volume, while self-hosting favors high, sustained, predictable volume, directly extending Module 10's cost-estimation discipline.",
      "Data control can be a hard, non-negotiable requirement for regulated industries or data-residency mandates, connecting directly to Module 12's data-handling principles.",
      "\"Open-source\" is an imprecise term for most models described that way — \"open-weight\" is more accurate, since most release trained weights without the full training dataset or pipeline code.",
    ],
    keyTakeawaysHi: [
      'Open-weight vs closed-API decision chaar concrete, measurable dimensions pe banaya jaana chahiye — capability, cost structure, data control, aur operational burden — ideological preference pe nahi.',
      'Cost structure ka ek genuine crossover point hai: API pricing low/unpredictable volume ko favor karta hai, jabki self-hosting high, sustained, predictable volume ko favor karta hai, directly Module 10 ke cost-estimation discipline ko extend karte hue.',
      'Data control regulated industries ya data-residency mandates ke liye ek hard, non-negotiable requirement ho sakta hai, directly Module 12 ke data-handling principles se connect karte hue.',
      '"Open-source" zyada tar un models ke liye ek imprecise term hai jinhe is tarah describe kiya jaata hai — "open-weight" zyada accurate hai, kyunki zyada tar trained weights release karte hain poora training dataset ya pipeline code ke bina.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-running-models-locally-with-ollama',
    title: 'Running Models Locally With Ollama — the Practical Mechanics',
    titleHi: 'Ollama Ke Saath Models Ko Locally Run Karna — Practical Mechanics',
    description:
      "Ollama packages the genuinely fiddly parts of running an open-weight model locally (model download, quantization, a serving API) behind a simple command-line and HTTP interface — turning what used to require deep ML infrastructure expertise into a straightforward developer tool.",
    descriptionHi:
      'Ollama ek open-weight model ko locally run karne ke genuinely fiddly parts ko package karta hai (model download, quantization, ek serving API) ek simple command-line aur HTTP interface ke peeche — jo pehle deep ML infrastructure expertise maangta tha use ek straightforward developer tool mein badalte hue.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 2,

    analogy: {
      en: "**A single-serve coffee machine that handles grinding, precise water temperature, and brew timing behind one button press, versus manually sourcing green coffee beans, roasting them yourself, and calibrating a professional espresso machine from scratch.** Making genuinely good coffee from raw green beans requires real expertise across multiple, quite different skills — roasting profiles, grind consistency, water temperature and pressure, timing — and getting any one of these wrong produces a noticeably worse cup. A single-serve machine doesn't eliminate any of that underlying complexity; it packages expert-calibrated defaults for grinding, temperature, and timing behind a single button, so someone with zero specialized coffee expertise can still get a genuinely decent cup without learning any of the underlying craft. This is exactly what a tool like Ollama does for running an open-weight AI model locally: the underlying complexity (downloading the correct model files, choosing an appropriate quantization level to fit available hardware memory, running an efficient inference server, exposing a usable API) doesn't disappear — it gets packaged behind a single command, so a developer without deep ML infrastructure expertise can genuinely run a capable model on their own machine, the same way the coffee machine lets someone without barista training make a genuinely good cup.",
      hi: 'ek single-serve coffee machine jo grinding, precise water temperature, aur brew timing ko ek button press ke peeche handle karti hai, versus manually green coffee beans source karna, unhe khud roast karna, aur ek professional espresso machine ko scratch se calibrate karna. Raw green beans se genuinely achhi coffee banana multiple, kaafi different skills ke across real expertise maangta hai — roasting profiles, grind consistency, water temperature aur pressure, timing — aur inme se kisi ek ko galat karna ek noticeably worse cup produce karta hai. Ek single-serve machine us underlying complexity mein se kisi ko eliminate nahi karti; ye grinding, temperature, aur timing ke liye expert-calibrated defaults ko ek single button ke peeche package karti hai, taaki koi bhi zero specialized coffee expertise ke saath abhi bhi ek genuinely decent cup paa sake underlying craft mein se kuch bhi seekhe bina. Ye exactly wo hai jo ek tool jaisa Ollama ek open-weight AI model ko locally run karne ke liye karta hai: underlying complexity (correct model files download karna, available hardware memory ko fit karne ke liye ek appropriate quantization level choose karna, ek efficient inference server run karna, ek usable API expose karna) disappear nahi hoti — ye ek single command ke peeche package ho jaati hai, taaki deep ML infrastructure expertise ke bina ek developer genuinely apne khud ke machine pe ek capable model run kar sake, wahi tarike se jaise coffee machine kisi ko barista training ke bina ek genuinely achhi cup banane deti hai.',
    },

    simple: `**The basic Ollama workflow — pulling and running a model:**

\`\`\`bash
# Downloads the model (weights + configuration) — this is a one-time
# step, cached locally afterward
ollama pull llama3.2

# Runs the model interactively in a terminal chat session
ollama run llama3.2
\`\`\`

**Why Ollama's real value is exposing a local HTTP API compatible
with this course's existing patterns — not just the CLI chat
experience:**

\`\`\`ts
// Ollama runs a local server (default: http://localhost:11434) with
// an API shape close enough to what this course has already covered
// that switching between a cloud provider and a local model requires
// minimal code changes
async function queryLocalModel(prompt: string) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt,
      stream: false, // Module 4's streaming pattern also works here,
                      // with stream: true and reading the response body incrementally
    }),
  });
  const data = await response.json();
  return data.response;
}
\`\`\`

**Why quantization is the practical mechanism that makes local
inference feasible on ordinary hardware — a concrete, checkable
tradeoff between size and quality:**

\`\`\`
A model's full-precision weights require substantial memory — often
more than a typical developer machine has available. Quantization
reduces the numeric precision used to store each weight (e.g., from
16-bit to 4-bit), shrinking the model's memory footprint substantially
at the cost of a small, generally measurable quality reduction. Ollama
handles this automatically, typically offering multiple quantization
levels per model — this is a genuine size/quality tradeoff worth
understanding, not an invisible implementation detail.
\`\`\`

\`\`\`bash
# Different quantization levels of the same underlying model — smaller
# file size and lower memory requirement at each step, with a
# corresponding, measurable quality tradeoff
ollama pull llama3.2:latest      # a reasonable default quantization
ollama pull llama3.2:q4_0        # more aggressive quantization — smaller, faster, less precise
\`\`\`

**A concrete pattern for wiring Ollama into this course's existing
structured-output discipline (Module 6) — showing that local models
aren't a separate universe of technique:**

\`\`\`ts
import { z } from 'zod';

const SentimentSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  confidence: z.number(),
});

async function classifySentimentLocally(text: string) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt: \`Classify the sentiment of this text as JSON: {"sentiment": "positive"|"negative"|"neutral", "confidence": number}.\nText: "\${text}"\nReturn ONLY the JSON.\`,
      stream: false,
      format: 'json', // Ollama's structured-output support
    }),
  });
  const data = await response.json();
  // The SAME validate-and-parse discipline from Module 6 applies —
  // local model output needs schema validation just like a cloud
  // provider's output does
  return SentimentSchema.parse(JSON.parse(data.response));
}
\`\`\`

**Why hardware requirements are the practical constraint that
actually determines which models are feasible to run locally — a
direct, checkable limit, not a vague "it depends":**

\`\`\`
A model's parameter count roughly determines its memory requirement
(a 7-billion-parameter model needs meaningfully less memory than a
70-billion-parameter one, even after quantization). Available RAM (or
GPU VRAM) is the hard, checkable ceiling on which models a given
machine can run at all — this is a concrete hardware-planning exercise,
not a matter of trial and error.
\`\`\`

**How this lesson connects to Lesson 1's tradeoff framework:** Ollama
is the practical mechanism that makes the "open_self_hosted"
branch of Lesson 1's decision function actually achievable for an
individual developer or small team — it doesn't change the underlying
tradeoffs Lesson 1 established (capability, cost, data control,
operational burden), it substantially lowers the operational-burden
cost of exercising the self-hosted option, which is precisely why
tools like this have made local-model experimentation dramatically
more accessible than it was a few years earlier.`,

    simpleHi: `**Basic Ollama workflow — ek model pull aur run karna:**

\`\`\`bash
# Model download karta hai (weights + configuration) — ye ek one-time
# step hai, baad mein locally cached
ollama pull llama3.2

# Model ko interactively ek terminal chat session mein run karta hai
ollama run llama3.2
\`\`\`

**Ollama ki real value is course ke existing patterns ke saath
compatible ek local HTTP API expose karna kyun hai — sirf CLI chat
experience nahi:**

\`\`\`ts
// Ollama ek local server run karta hai (default: http://localhost:11434)
// ek API shape ke saath jo is course ne already cover ki hai us se
// itna close hai ki ek cloud provider aur ek local model ke beech
// switch karne ke liye minimal code changes chahiye
async function queryLocalModel(prompt: string) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt,
      stream: false, // Module 4 ka streaming pattern bhi yahan kaam
                      // karta hai, stream: true ke saath aur response
                      // body ko incrementally padhte hue
    }),
  });
  const data = await response.json();
  return data.response;
}
\`\`\`

**Quantization practical mechanism kyun hai jo local inference ko
ordinary hardware pe feasible banata hai — size aur quality ke beech
ek concrete, checkable tradeoff:**

\`\`\`
Ek model ke full-precision weights ko substantial memory chahiye —
aksar ek typical developer machine ke paas available se zyada.
Quantization har weight ko store karne ke liye use ki gayi numeric
precision ko kam karta hai (jaise, 16-bit se 4-bit tak), model ke
memory footprint ko substantially shrink karte hue ek small, generally
measurable quality reduction ki cost pe. Ollama ise automatically
handle karta hai, typically har model ke liye multiple quantization
levels offer karte hue — ye ek genuine size/quality tradeoff hai
samajhne layak, ek invisible implementation detail nahi.
\`\`\`

\`\`\`bash
# Wahi underlying model ke different quantization levels — smaller
# file size aur lower memory requirement har step pe, ek corresponding,
# measurable quality tradeoff ke saath
ollama pull llama3.2:latest      # ek reasonable default quantization
ollama pull llama3.2:q4_0        # zyada aggressive quantization — smaller, faster, less precise
\`\`\`

**Ollama ko is course ke existing structured-output discipline (Module
6) mein wire karne ka ek concrete pattern — dikhate hue ki local
models technique ka ek separate universe nahi hain:**

\`\`\`ts
import { z } from 'zod';

const SentimentSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  confidence: z.number(),
});

async function classifySentimentLocally(text: string) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt: \`Classify the sentiment of this text as JSON: {"sentiment": "positive"|"negative"|"neutral", "confidence": number}.\nText: "\${text}"\nReturn ONLY the JSON.\`,
      stream: false,
      format: 'json', // Ollama ka structured-output support
    }),
  });
  const data = await response.json();
  // Module 6 se WAHI validate-and-parse discipline yahan apply hoti
  // hai — local model output ko wahi schema validation chahiye jaise
  // ek cloud provider ke output ko chahiye
  return SentimentSchema.parse(JSON.parse(data.response));
}
\`\`\`

**Hardware requirements practical constraint kyun hain jo actually
determine karte hain kaunse models locally run karne ke liye feasible
hain — ek direct, checkable limit, ek vague "it depends" nahi:**

\`\`\`
Ek model ka parameter count roughly uski memory requirement determine
karta hai (ek 7-billion-parameter model ko meaningfully kam memory
chahiye ek 70-billion-parameter wale se, quantization ke baad bhi).
Available RAM (ya GPU VRAM) hard, checkable ceiling hai is baat pe ki
ek given machine kaunse models bilkul run kar sakti hai — ye ek
concrete hardware-planning exercise hai, trial and error ki matter
nahi.
\`\`\`

**Ye lesson Lesson 1 ke tradeoff framework se kaise connect karta hai:**
Ollama practical mechanism hai jo Lesson 1 ke decision function ki
"open_self_hosted" branch ko ek individual developer ya small team ke
liye actually achievable banata hai — ye underlying tradeoffs ko nahi
badalta jo Lesson 1 ne establish kiye (capability, cost, data control,
operational burden), ye self-hosted option exercise karne ki
operational-burden cost ko substantially kam karta hai, yahi exactly
wajah hai is jaise tools ne local-model experimentation ko dramatically
zyada accessible bana diya hai us se jo ye kuch saal pehle tha.`,

    content: `## Why Ollama's real value is a locally-exposed API compatible with
this course's existing patterns, not just a convenient CLI

While "ollama run" provides a convenient interactive chat experience,
the more significant capability for building actual features is
Ollama's local HTTP server (typically on port 11434), which exposes an
API shape close enough to conventions this course has already covered
that switching a feature between a cloud provider and a local model
requires minimal structural changes — the same streaming pattern from
Module 4, the same structured-output discipline from Module 6, and the
same output-validation practices from Module 11 all apply with only
minor adjustments to the request/response shape.

## Why quantization is a genuine, checkable engineering tradeoff worth
understanding rather than an invisible implementation detail

A model's weights, stored at full precision, require substantial
memory — often more than typical consumer hardware provides. Quantization
reduces the numeric precision used to represent each weight, which
shrinks the model's memory footprint substantially at the cost of a
generally small, measurable reduction in output quality. Because Ollama
typically offers multiple quantization levels for the same underlying
model, understanding this tradeoff — rather than treating quantization
level as an arbitrary setting — lets a developer make a genuinely
informed choice between a smaller, faster, slightly-less-precise model
and a larger, slower, more precise one, based on the actual hardware
available and the actual quality bar the task requires.

## Why hardware requirements form a concrete, checkable planning
constraint rather than a matter of experimentation

A model's parameter count is a reasonably direct predictor of its
memory requirements, even accounting for quantization's effect — this
means the question "can my machine run this model" is a concrete,
answerable planning question based on available RAM or GPU VRAM,
rather than something that can only be discovered through trial and
error after significant setup effort. This is a practical, checkable
constraint worth verifying before attempting to run a specific model
locally, the same way checking a server's available memory before
deploying a memory-intensive application is standard practice.

## How Ollama connects directly to Lesson 1's tradeoff framework as a
practical enabler, not a replacement for that framework

Lesson 1 established that the choice between closed-API and
open-weight, self-hosted models depends on capability, cost structure,
data control, and operational burden. Ollama doesn't change any of
these underlying tradeoffs — it specifically reduces the operational-
burden cost of exercising the self-hosted option, by packaging model
download, quantization selection, and API serving behind a simple,
well-documented interface. This is precisely why tools like Ollama have
made local-model experimentation and, in some cases, genuine production
self-hosting dramatically more accessible than it was when doing so
required deep, specialized ML infrastructure expertise — the tradeoffs
are unchanged, but the cost of acting on a self-hosting decision has
dropped substantially.`,

    contentHi: `## Ollama ki real value is course ke existing patterns ke saath compatible ek locally-exposed API kyun hai, sirf ek convenient CLI nahi

Jabki \`ollama run\` ek convenient interactive chat experience provide
karta hai, actual features banane ke liye zyada significant capability
Ollama ka local HTTP server hai (typically port 11434 pe), jo ek API
shape expose karta hai conventions se itna close jo is course ne
already cover ki hain ki ek feature ko cloud provider aur ek local
model ke beech switch karne ke liye minimal structural changes chahiye
— Module 4 ka wahi streaming pattern, Module 6 ka wahi structured-
output discipline, aur Module 11 ki wahi output-validation practices
sab apply hoti hain sirf request/response shape mein minor adjustments
ke saath.

## Quantization ek genuine, checkable engineering tradeoff kyun hai samajhne layak ek invisible implementation detail ke bajaye

Ek model ke weights, full precision pe stored, ko substantial memory
chahiye — aksar typical consumer hardware provide karta hai use zyada.
Quantization numeric precision ko kam karta hai jo har weight ko
represent karne ke liye use ki jaati hai, jo model ke memory footprint
ko substantially shrink karta hai generally ek small, measurable
reduction in output quality ki cost pe. Kyunki Ollama typically wahi
underlying model ke liye multiple quantization levels offer karta hai,
is tradeoff ko samajhna — quantization level ko ek arbitrary setting
ki tarah treat karne ke bajaye — ek developer ko ek genuinely informed
choice karne deta hai ek smaller, faster, slightly-less-precise model
aur ek larger, slower, more precise wale ke beech, actual available
hardware aur task ko chahiye actual quality bar ke basis pe.

## Hardware requirements ek concrete, checkable planning constraint kyun form karte hain experimentation ki matter ke bajaye

Ek model ka parameter count uski memory requirements ka ek reasonably
direct predictor hai, quantization ke effect ko account karte hue bhi
— iska matlab hai question "kya mera machine ye model run kar sakta
hai" ek concrete, answerable planning question hai available RAM ya
GPU VRAM ke basis pe, ek aisi cheez ke bajaye jo sirf trial and error
se discover ki ja sakti hai significant setup effort ke baad. Ye ek
practical, checkable constraint hai verify karne layak ek specific
model ko locally run karne ki koshish karne se pehle, wahi tarike se
jaise ek server ka available memory check karna ek memory-intensive
application deploy karne se pehle standard practice hai.

## Ollama directly Lesson 1 ke tradeoff framework se ek practical enabler ki tarah kaise connect karta hai, us framework ka replacement nahi

Lesson 1 ne establish kiya ki closed-API aur open-weight, self-hosted
models ke beech choice capability, cost structure, data control, aur
operational burden pe depend karti hai. Ollama in underlying tradeoffs
mein se kisi ko nahi badalta — ye specifically self-hosted option
exercise karne ki operational-burden cost ko kam karta hai, model
download, quantization selection, aur API serving ko ek simple,
well-documented interface ke peeche package karke. Yahi exactly wajah
hai Ollama jaisi tools ne local-model experimentation aur, kuch cases
mein, genuine production self-hosting ko dramatically zyada accessible
bana diya hai us se jo ye tha jab aisa karne ke liye deep, specialized
ML infrastructure expertise chahiye thi — tradeoffs unchanged hain, par
ek self-hosting decision pe act karne ki cost substantially kam ho
gayi hai.`,

    examples: [
      {
        title: 'A local-model client wired into this course\'s existing structured-output and streaming patterns',
        titleHi: 'Ek local-model client jo is course ke existing structured-output aur streaming patterns mein wired hai',
        codeJs: `// A local-model client that mirrors this course's cloud-provider
// patterns closely enough to be a near drop-in replacement
async function queryOllama(prompt, { stream = false, format = null } = {}) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama3.2', prompt, stream, format }),
  });

  if (!stream) {
    const data = await response.json();
    return data.response;
  }

  // Streaming works the same conceptual way as Module 4's
  // Server-Sent-Events pattern — reading the response body incrementally
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = JSON.parse(decoder.decode(value));
    fullText += chunk.response;
  }
  return fullText;
}

// Structured output — Module 6's discipline, applied to a local model
import { z } from 'zod';
const ClassificationSchema = z.object({ category: z.string(), confidence: z.number() });

async function classifyLocally(text) {
  const raw = await queryOllama(
    \`Classify this support ticket as JSON {"category": string, "confidence": number}: "\${text}"\`,
    { format: 'json' }
  );
  return ClassificationSchema.parse(JSON.parse(raw));
}`,
        codeTs: `interface OllamaOptions {
  stream?: boolean;
  format?: 'json' | null;
}

// A local-model client that mirrors this course's cloud-provider
// patterns closely enough to be a near drop-in replacement
async function queryOllama(prompt: string, { stream = false, format = null }: OllamaOptions = {}): Promise<string> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama3.2', prompt, stream, format }),
  });

  if (!stream) {
    const data = await response.json();
    return data.response;
  }

  // Streaming works the same conceptual way as Module 4's
  // Server-Sent-Events pattern — reading the response body incrementally
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = JSON.parse(decoder.decode(value));
    fullText += chunk.response;
  }
  return fullText;
}

// Structured output — Module 6's discipline, applied to a local model
import { z } from 'zod';
const ClassificationSchema = z.object({ category: z.string(), confidence: z.number() });

async function classifyLocally(text: string) {
  const raw = await queryOllama(
    \`Classify this support ticket as JSON {"category": string, "confidence": number}: "\${text}"\`,
    { format: 'json' }
  );
  return ClassificationSchema.parse(JSON.parse(raw));
}`,
        code: `const result = await classifyLocally("My order hasn't arrived in 2 weeks");
// { category: "shipping_delay", confidence: 0.91 }
// runs entirely on local infrastructure, no data leaves the machine`,
        output:
          "The classification runs entirely against a locally-hosted model, with the same schema-validated output shape this course has used for cloud-provider requests throughout — the underlying code structure barely changes between a local and a cloud-hosted model, only the endpoint and a few request parameters differ.",
        explain:
          "This example demonstrates the lesson's core practical point: because Ollama's API is deliberately close in shape to conventions this course has already established, applying Module 6's structured-output discipline and Module 4's streaming pattern to a local model requires minimal adaptation, not a separate set of techniques.",
        explainHi:
          "Ye example lesson ke core practical point ko demonstrate karta hai: kyunki Ollama ka API deliberately shape mein un conventions ke close hai jo is course ne already establish ki hain, Module 6 ke structured-output discipline aur Module 4 ke streaming pattern ko ek local model pe apply karna minimal adaptation maangta hai, techniques ka ek separate set nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Attempting to run a large model without checking whether the
// machine's available memory can actually support it
async function runModelWrong() {
  // Attempts to pull and run a 70-billion-parameter model on a
  // machine with 16GB of RAM — likely to fail or perform unusably
  // slowly, discovered only after the download completes
  await exec('ollama pull llama3.1:70b');
  await exec('ollama run llama3.1:70b');
}`,
        right: `// Checking hardware capacity against the model's requirements
// BEFORE attempting to download and run it
function checkHardwareCompatibility(availableRamGb, modelParamsBillions) {
  // A rough rule of thumb: roughly 1GB of RAM per billion parameters
  // at a moderate quantization level — a real planning calculation,
  // not a substitute for checking the model's actual documented
  // requirements, but a useful first filter
  const roughEstimateGb = modelParamsBillions * 1;
  return {
    likelyFits: availableRamGb >= roughEstimateGb,
    recommendation: availableRamGb >= roughEstimateGb
      ? 'proceed'
      : 'choose a smaller model or a more aggressive quantization level',
  };
}`,
        why: "Attempting to run a model without first checking whether available hardware can support it wastes significant download time and bandwidth discovering a failure that a rough, upfront memory calculation would have predicted — hardware compatibility is a checkable planning question, not something that should be discovered only through trial and error.",
        whyHi:
          "Pehle check kiye bina ek model run karne ki koshish karna ki available hardware ise support kar sakta hai significant download time aur bandwidth waste karta hai ek failure discover karne mein jise ek rough, upfront memory calculation predict kar deti — hardware compatibility ek checkable planning question hai, kuch aisa nahi jo sirf trial and error se discover kiya jaana chahiye.",
      },
    ],

    realWorld: [
      {
        en: "A production team building an internal document-classification tool prototyped entirely against a locally-run Ollama model on developer laptops before committing to any cloud infrastructure decision, validating the approach's feasibility and quality at effectively zero incremental cost before scaling to a production self-hosted or API-based deployment.",
        hi: 'Ek production team ek internal document-classification tool banate hue poori tarah ek locally-run Ollama model ke against developer laptops pe prototype kiya kisi bhi cloud infrastructure decision ke liye commit karne se pehle, approach ki feasibility aur quality ko effectively zero incremental cost pe validate karte hue ek production self-hosted ya API-based deployment tak scale karne se pehle.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is quantization a genuine engineering tradeoff worth understanding, rather than an implementation detail that can be ignored?',
        qHi: 'Quantization ek genuine engineering tradeoff kyun hai samajhne layak, ek implementation detail nahi jise ignore kiya ja sakta hai?',
        a: "Quantization reduces the numeric precision used to store model weights, substantially shrinking memory footprint at the cost of a generally small, measurable quality reduction. Since this is a real tradeoff between resource requirements and output quality, understanding it lets a developer make an informed choice suited to their actual hardware and quality needs, rather than treating quantization level as an arbitrary default.",
        aHi: 'Quantization model weights store karne ke liye use ki gayi numeric precision ko kam karta hai, memory footprint ko substantially shrink karte hue generally ek small, measurable quality reduction ki cost pe. Kyunki ye resource requirements aur output quality ke beech ek real tradeoff hai, ise samajhna ek developer ko unke actual hardware aur quality needs ke suited ek informed choice karne deta hai, quantization level ko ek arbitrary default ki tarah treat karne ke bajaye.',
      },
      {
        q: "How does Ollama relate to the open-vs-closed model decision framework from Lesson 1?",
        qHi: 'Ollama Lesson 1 ke open-vs-closed model decision framework se kaise related hai?',
        a: "Ollama doesn't change the underlying tradeoffs Lesson 1 established (capability, cost, data control, operational burden) — it specifically reduces the operational-burden cost of the self-hosted option by packaging model download, quantization, and API serving behind a simple interface, making the self-hosted branch of that decision framework dramatically more achievable in practice.",
        aHi: 'Ollama Lesson 1 ne establish kiye underlying tradeoffs ko nahi badalta (capability, cost, data control, operational burden) — ye specifically self-hosted option ki operational-burden cost ko kam karta hai model download, quantization, aur API serving ko ek simple interface ke peeche package karke, us decision framework ki self-hosted branch ko practice mein dramatically zyada achievable banate hue.',
      },
    ],

    exercises: [
      {
        task: "A developer wants to run a 13-billion-parameter model on a machine with 8GB of RAM, using the rough estimate of ~1GB per billion parameters at moderate quantization from this lesson's mistake example. Using that estimate, evaluate whether this is likely to work, and explain what options the developer has if it doesn't.",
        taskHi: 'Ek developer ek 13-billion-parameter model ko ek machine pe run karna chahta hai 8GB RAM ke saath, is lesson ke mistake example se rough estimate ~1GB per billion parameters at moderate quantization use karte hue. Us estimate ka use karke, evaluate karo ki kya ye likely kaam karega, aur explain karo developer ke paas kya options hain agar ye nahi karta.',
        hint: "Compare the rough memory estimate for a 13-billion-parameter model against the 8GB available, and think about what levers this lesson discussed for reducing a model's memory footprint.",
        hintHi: 'Ek 13-billion-parameter model ke liye rough memory estimate ko available 8GB ke against compare karo, aur socho ki is lesson ne ek model ke memory footprint ko kam karne ke liye kaunse levers discuss kiye.',
      },
    ],

    keyTakeaways: [
      "Ollama's real value is a locally-exposed HTTP API compatible with patterns this course has already covered (streaming, structured output), not just a convenient CLI chat experience.",
      "Quantization is a genuine, checkable engineering tradeoff — reducing weight precision shrinks memory footprint at the cost of a generally small, measurable quality reduction.",
      "Hardware requirements (RAM/VRAM relative to a model's parameter count) form a concrete, checkable planning constraint worth verifying before attempting to run a specific model locally.",
      "Ollama doesn't change Lesson 1's underlying tradeoffs — it specifically lowers the operational-burden cost of exercising the self-hosted option, making local-model experimentation dramatically more accessible.",
    ],
    keyTakeawaysHi: [
      'Ollama ki real value ek locally-exposed HTTP API hai jo is course ne already cover kiye patterns (streaming, structured output) ke saath compatible hai, sirf ek convenient CLI chat experience nahi.',
      'Quantization ek genuine, checkable engineering tradeoff hai — weight precision kam karna memory footprint ko shrink karta hai generally ek small, measurable quality reduction ki cost pe.',
      'Hardware requirements (RAM/VRAM ek model ke parameter count ke relative) ek concrete, checkable planning constraint form karte hain verify karne layak ek specific model ko locally run karne ki koshish karne se pehle.',
      'Ollama Lesson 1 ke underlying tradeoffs ko nahi badalta — ye specifically self-hosted option exercise karne ki operational-burden cost ko kam karta hai, local-model experimentation ko dramatically zyada accessible banate hue.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-when-local-inference-makes-sense',
    title: 'When Local Inference Genuinely Makes Sense for a Product',
    titleHi: 'Local Inference Genuinely Ek Product Ke Liye Kab Sense Banata Hai',
    description:
      "Closing this module: local inference is the right call in a genuinely identifiable, narrower set of production scenarios — offline/edge requirements, hard data-residency constraints, and high sustained volume past the cost crossover — not a universal upgrade over API-based models.",
    descriptionHi:
      'Is module ko close karte hue: local inference production scenarios ke ek genuinely identifiable, narrower set mein correct call hai — offline/edge requirements, hard data-residency constraints, aur cost crossover se aage high sustained volume — API-based models pe ek universal upgrade nahi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A remote research station that generates its own electricity because no power grid reaches it, versus a downtown office building generating its own electricity purely to avoid paying the local utility company.** A remote research station with no access to any power grid has a genuine, structural reason to generate its own electricity — it's not a matter of comparing costs, since the alternative (grid power) simply isn't available at all. A downtown office building sits in the exact opposite situation: reliable grid power is fully available, and generating electricity on-site would require significant upfront equipment investment, ongoing maintenance, and specialized staff, all to avoid a utility bill that, for nearly any realistic level of usage, costs less than running an independent power plant. The research station's self-generation is genuinely justified by a hard constraint (no alternative exists); the office building's would be justified only in a narrow, specific case — extremely high, sustained, predictable usage at a scale where the economics genuinely favor it, which is rare for a typical office. Local AI inference follows exactly this pattern: it's genuinely the right call when a hard constraint makes API access impossible or unacceptable (a fully offline environment, a hard data-residency requirement), or in the narrower case where usage volume is high and predictable enough that the cost crossover point from Lesson 1 has genuinely been reached — not as a default preference over a perfectly available, well-functioning API.",
      hi: 'ek remote research station jo apni khud ki electricity generate karta hai kyunki koi power grid wahan tak nahi pahunchta, versus ek downtown office building jo apni khud ki electricity generate karta hai purely local utility company ko pay karne se bachne ke liye. Ek remote research station jiske paas kisi bhi power grid tak access nahi hai apni khud ki electricity generate karne ka ek genuine, structural reason rakhta hai — ye costs compare karne ki matter nahi hai, kyunki alternative (grid power) bilkul available hi nahi hai. Downtown office building exactly opposite situation mein baithta hai: reliable grid power poori tarah available hai, aur on-site electricity generate karna significant upfront equipment investment, ongoing maintenance, aur specialized staff maangega, ye sab ek utility bill avoid karne ke liye jo, almost kisi bhi realistic level of usage ke liye, ek independent power plant chalane se kam cost karta hai. Research station ki self-generation genuinely ek hard constraint se justified hai (koi alternative exist nahi karta); office building ki sirf ek narrow, specific case mein justified hogi — extremely high, sustained, predictable usage ek scale pe jahan economics genuinely ise favor karte hain, jo ek typical office ke liye rare hai. Local AI inference exactly ye pattern follow karta hai: ye genuinely correct call hai jab ek hard constraint API access ko impossible ya unacceptable banata hai (ek fully offline environment, ek hard data-residency requirement), ya us narrower case mein jahan usage volume itna high aur predictable hai ki Lesson 1 ka cost crossover point genuinely pahunch chuka hai — ek default preference ki tarah nahi ek perfectly available, well-functioning API pe.',
    },

    simple: `**The genuinely identifiable scenarios where local inference is
the right call, and why each one is a specific, checkable reason
rather than a general preference:**

\`\`\`
1. OFFLINE / EDGE REQUIREMENTS: the feature must work with no network
   connectivity at all (a field application, an embedded device, an
   air-gapped environment) — an API-based model is structurally
   impossible here, not just less convenient.

2. HARD DATA-RESIDENCY CONSTRAINTS: regulatory or contractual
   requirements mandate data never leaves specific infrastructure —
   covered in Lesson 1, this is a hard requirement, not a preference.

3. COST CROSSOVER AT SCALE: sustained, predictable, high-volume usage
   where the self-hosting infrastructure cost (Lesson 1's framework)
   is genuinely lower than the equivalent API cost over a realistic
   time horizon.

4. LATENCY-CRITICAL, CO-LOCATED PROCESSING: a scenario where
   round-trip network latency to a cloud API is genuinely
   unacceptable for the feature's requirements, and co-locating
   inference with the application removes that latency entirely.
\`\`\`

**A concrete, checkable function distinguishing these genuine
scenarios from the common mistake of defaulting to local inference
without a specific, checkable reason:**

\`\`\`ts
interface LocalInferenceJustification {
  requiresOfflineOperation: boolean;
  hasHardDataResidencyRequirement: boolean;
  volumeExceedsCostCrossoverPoint: boolean; // computed per Lesson 1's framework
  networkLatencyIsUnacceptableForUseCase: boolean;
}

function isLocalInferenceJustified(factors: LocalInferenceJustification): boolean {
  return (
    factors.requiresOfflineOperation ||
    factors.hasHardDataResidencyRequirement ||
    factors.volumeExceedsCostCrossoverPoint ||
    factors.networkLatencyIsUnacceptableForUseCase
  );
  // If NONE of these apply, a well-functioning API is very likely the
  // simpler, cheaper, lower-maintenance-burden choice — this function
  // returning false is a meaningful, useful result, not a non-answer
}
\`\`\`

**Why "we could self-host, so we should" is the specific reasoning
error this lesson corrects — the mere ABILITY to run a model locally
doesn't make it the right choice absent one of the four genuine
reasons above:**

\`\`\`
Ollama (Lesson 2) has made local inference dramatically more
accessible, which creates a real risk of teams reaching for it simply
because it's newly convenient to try, rather than because a specific,
checkable requirement from the list above actually applies. The
operational burden Lesson 1 identified (provisioning, monitoring,
scaling, maintaining serving infrastructure) doesn't disappear just
because Ollama made the INITIAL setup easier — it's a genuine, ongoing
cost that needs a genuine, ongoing justification.
\`\`\`

**A realistic worked example showing the framework applied to a
product decision:**

\`\`\`ts
// A field-inspection app used by technicians in locations with
// unreliable or no internet connectivity
const fieldInspectionApp: LocalInferenceJustification = {
  requiresOfflineOperation: true, // genuinely offline in the field
  hasHardDataResidencyRequirement: false,
  volumeExceedsCostCrossoverPoint: false,
  networkLatencyIsUnacceptableForUseCase: false,
};
console.log(isLocalInferenceJustified(fieldInspectionApp)); // true —
// the offline requirement alone is sufficient justification

// A typical SaaS customer-support chatbot with reliable connectivity
// and moderate, unpredictable volume
const supportChatbot: LocalInferenceJustification = {
  requiresOfflineOperation: false,
  hasHardDataResidencyRequirement: false,
  volumeExceedsCostCrossoverPoint: false,
  networkLatencyIsUnacceptableForUseCase: false,
};
console.log(isLocalInferenceJustified(supportChatbot)); // false —
// a closed API is the simpler, well-justified default here
\`\`\`

**How this lesson closes Module 17:** Lesson 1 established the
concrete dimensions the open-vs-closed decision turns on. Lesson 2
showed how Ollama has substantially lowered the operational-burden
cost of the self-hosted option. This lesson makes the closing,
practical point: lowering that cost makes self-hosting more
ACHIEVABLE, but doesn't change whether it's actually JUSTIFIED for a
given product — that still depends on one of a genuinely narrow,
checkable set of reasons, not on local inference having recently
become more convenient to try.`,

    simpleHi: `**Genuinely identifiable scenarios jahan local inference correct
call hai, aur har ek kyun ek specific, checkable reason hai ek general
preference ke bajaye:**

\`\`\`
1. OFFLINE / EDGE REQUIREMENTS: feature ko bina kisi network
   connectivity ke bilkul kaam karna chahiye (ek field application,
   ek embedded device, ek air-gapped environment) — ek API-based
   model yahan structurally impossible hai, sirf less convenient
   nahi.

2. HARD DATA-RESIDENCY CONSTRAINTS: regulatory ya contractual
   requirements mandate karte hain ki data kabhi specific
   infrastructure nahi chhodta — Lesson 1 mein cover kiya gaya, ye ek
   hard requirement hai, ek preference nahi.

3. COST CROSSOVER AT SCALE: sustained, predictable, high-volume usage
   jahan self-hosting infrastructure cost (Lesson 1 ka framework)
   genuinely equivalent API cost se kam hai ek realistic time
   horizon ke across.

4. LATENCY-CRITICAL, CO-LOCATED PROCESSING: ek scenario jahan ek
   cloud API tak round-trip network latency feature ki requirements
   ke liye genuinely unacceptable hai, aur inference ko application
   ke saath co-locate karna us latency ko poori tarah remove karta
   hai.
\`\`\`

**Ek concrete, checkable function jo in genuine scenarios ko common
mistake se distinguish karta hai bina ek specific, checkable reason ke
local inference ko default karne ki:**

\`\`\`ts
interface LocalInferenceJustification {
  requiresOfflineOperation: boolean;
  hasHardDataResidencyRequirement: boolean;
  volumeExceedsCostCrossoverPoint: boolean; // Lesson 1 ke framework ke hisaab se computed
  networkLatencyIsUnacceptableForUseCase: boolean;
}

function isLocalInferenceJustified(factors: LocalInferenceJustification): boolean {
  return (
    factors.requiresOfflineOperation ||
    factors.hasHardDataResidencyRequirement ||
    factors.volumeExceedsCostCrossoverPoint ||
    factors.networkLatencyIsUnacceptableForUseCase
  );
  // Agar in mein se KOI bhi apply nahi hota, ek well-functioning API
  // bahut likely simpler, cheaper, lower-maintenance-burden choice
  // hai — is function ka false return karna ek meaningful, useful
  // result hai, ek non-answer nahi
}
\`\`\`

**"Hum self-host kar sakte hain, isliye humein karna chahiye" ye
specific reasoning error kyun hai jise ye lesson correct karta hai —
akeli ABILITY ek model ko locally run karne ki ise correct choice nahi
banati upar wale chaar genuine reasons mein se ek ke absent:**

\`\`\`
Ollama (Lesson 2) ne local inference ko dramatically zyada accessible
bana diya hai, jo teams ke isliye reach karne ka ek real risk create
karta hai kyunki ye newly convenient hai try karna, is wajah se nahi
ki upar wali list se ek specific, checkable requirement actually
apply hoti hai. Operational burden jo Lesson 1 ne identify ki
(provisioning, monitoring, scaling, serving infrastructure maintain
karna) disappear nahi hoti sirf is wajah se ki Ollama ne INITIAL setup
ko aasan bana diya — ye ek genuine, ongoing cost hai jise ek genuine,
ongoing justification chahiye.
\`\`\`

**Ek realistic worked example jo framework ko ek product decision pe
applied dikhata hai:**

\`\`\`ts
// Ek field-inspection app jo technicians use karte hain unreliable ya
// no internet connectivity wale locations mein
const fieldInspectionApp: LocalInferenceJustification = {
  requiresOfflineOperation: true, // genuinely field mein offline
  hasHardDataResidencyRequirement: false,
  volumeExceedsCostCrossoverPoint: false,
  networkLatencyIsUnacceptableForUseCase: false,
};
console.log(isLocalInferenceJustified(fieldInspectionApp)); // true —
// akeli offline requirement sufficient justification hai

// Ek typical SaaS customer-support chatbot reliable connectivity aur
// moderate, unpredictable volume ke saath
const supportChatbot: LocalInferenceJustification = {
  requiresOfflineOperation: false,
  hasHardDataResidencyRequirement: false,
  volumeExceedsCostCrossoverPoint: false,
  networkLatencyIsUnacceptableForUseCase: false,
};
console.log(isLocalInferenceJustified(supportChatbot)); // false —
// ek closed API yahan simpler, well-justified default hai
\`\`\`

**Ye lesson Module 17 ko kaise close karta hai:** Lesson 1 ne concrete
dimensions establish kiye jinpe open-vs-closed decision turn karta
hai. Lesson 2 ne dikhaya ki Ollama ne self-hosted option ki
operational-burden cost ko kaise substantially kam kar diya hai. Ye
lesson closing, practical point banata hai: us cost ko kam karna
self-hosting ko zyada ACHIEVABLE banata hai, par ye nahi badalta ki
kya ye actually ek given product ke liye JUSTIFIED hai — wo abhi bhi
ek genuinely narrow, checkable set of reasons mein se ek pe depend
karta hai, is baat pe nahi ki local inference recently try karne mein
zyada convenient ban gayi hai.`,

    content: `## Why local inference is correctly framed as justified by
specific, checkable requirements rather than as a general upgrade

Framing local inference as an upgrade over API-based models — faster,
more private, more under your control by default — obscures the fact
that each of those properties comes with a genuine cost (operational
burden, upfront infrastructure investment, ongoing maintenance) that
is only worth paying when a specific requirement actually demands it.
This lesson's four scenarios (offline/edge requirements, hard
data-residency constraints, cost crossover at scale, and
latency-critical co-located processing) are each independently
checkable against a specific product's actual requirements — the
right mental model is "does one of these specific things apply to us,"
not "is local inference generally better."

## Why offline/edge requirements are a structural impossibility for
API-based models, not merely an inconvenience

When a feature must genuinely function with no network connectivity —
a field application in an area with no reliable signal, an embedded
device, an air-gapped secure environment — an API-based model is not
simply less convenient, it is structurally impossible to use, since
the network round-trip an API call requires cannot happen at all. This
is the clearest, least ambiguous case for local inference, precisely
because there's no tradeoff calculation involved — the alternative
genuinely doesn't exist as an option.

## Why "we now CAN self-host easily" (thanks to Lesson 2's tools) is
not the same question as "we SHOULD self-host"

Ollama and similar tools have substantially lowered the operational
barrier to running a model locally, which creates a specific reasoning
risk this lesson directly addresses: a team might reach for local
inference simply because it recently became easy to try, without one
of the four genuine justifying scenarios actually applying to their
situation. The ongoing operational burden Lesson 1 identified —
provisioning, monitoring, scaling, and maintaining serving
infrastructure — doesn't disappear just because initial setup got
easier; it remains a real, recurring cost that needs a real, recurring
justification, not a one-time "we tried it and it worked" rationale.

## How this lesson's decision function operationalizes fair, honest
evaluation rather than a foregone local-first or API-first conclusion

The "isLocalInferenceJustified" function returns false as a meaningful,
useful answer when none of the four scenarios apply — this is a
deliberate design choice reflecting the lesson's central claim: absent
a specific, checkable reason, a well-functioning, low-maintenance API
is very likely the simpler and cheaper choice, and that conclusion
deserves the same respect as a "yes, self-host" conclusion when the
facts genuinely support it. Neither answer is privileged by default;
both follow mechanically from the actual facts of a specific product's
requirements.

## How this lesson completes Module 17's arc

Lesson 1 established the concrete dimensions (capability, cost
structure, data control, operational burden) the open-vs-closed
decision turns on. Lesson 2 showed how tools like Ollama have
substantially reduced the practical cost of exercising the self-hosted
option. This lesson closes the module with the crucial distinction
between accessibility and justification: local inference being easier
to try than ever before is a genuine, positive development, but it
answers a different question than whether a specific product's actual
requirements genuinely call for it — and conflating the two is the
single most common reasoning error this module aims to prevent.`,

    contentHi: `## Local inference specific, checkable requirements se justified ki tarah correctly kyun frame kiya jaata hai ek general upgrade ki tarah nahi

Local inference ko API-based models pe ek upgrade ki tarah frame karna
— faster, zyada private, default se zyada aapke control mein — is fact
ko obscure karta hai ki in properties mein se har ek ek genuine cost
(operational burden, upfront infrastructure investment, ongoing
maintenance) ke saath aati hai jo sirf tab pay karne layak hai jab ek
specific requirement actually ise demand kare. Is lesson ke chaar
scenarios (offline/edge requirements, hard data-residency constraints,
cost crossover at scale, aur latency-critical co-located processing)
har ek independently ek specific product ki actual requirements ke
against checkable hai — correct mental model "kya in mein se ek
specific cheez humpe apply hoti hai," hai "kya local inference
generally behtar hai" nahi.

## Offline/edge requirements API-based models ke liye ek structural impossibility kyun hain, sirf ek inconvenience nahi

Jab ek feature ko genuinely koi network connectivity ke bina function
karna chahiye — ek field application jahan reliable signal nahi hai,
ek embedded device, ek air-gapped secure environment — ek API-based
model sirf less convenient nahi hai, ye use karna structurally
impossible hai, kyunki network round-trip jo ek API call maangti hai
bilkul ho hi nahi sakta. Ye local inference ke liye sabse clearest,
least ambiguous case hai, precisely is wajah se ki isme koi tradeoff
calculation involve nahi hai — alternative genuinely ek option ki
tarah exist nahi karta.

## "Hum ab self-host easily kar SAKTE hain" (Lesson 2 ke tools ki wajah se) "humein self-host karna CHAHIYE" wahi question kyun nahi hai

Ollama aur similar tools ne ek model ko locally run karne ke
operational barrier ko substantially kam kar diya hai, jo ek specific
reasoning risk create karta hai jise ye lesson directly address karta
hai: ek team local inference ko sirf is wajah se reach kar sakti hai
kyunki ye recently try karna aasan ban gaya, bina chaar genuine
justifying scenarios mein se ek ke unki situation pe actually apply
hote hue. Ongoing operational burden jo Lesson 1 ne identify ki —
provisioning, monitoring, scaling, aur serving infrastructure maintain
karna — disappear nahi hoti sirf is wajah se ki initial setup aasan ho
gaya; ye ek real, recurring cost rehti hai jise ek real, recurring
justification chahiye, ek one-time "humne try kiya aur ye kaam kiya"
rationale nahi.

## Ye lesson ka decision function fair, honest evaluation ko kaise operationalize karta hai ek foregone local-first ya API-first conclusion ke bajaye

\`isLocalInferenceJustified\` function false return karta hai ek
meaningful, useful answer ki tarah jab chaar scenarios mein se koi
apply nahi hota — ye ek deliberate design choice hai jo lesson ke
central claim ko reflect karta hai: ek specific, checkable reason ke
absent, ek well-functioning, low-maintenance API bahut likely simpler
aur cheaper choice hai, aur us conclusion ko wahi respect deserve
karni chahiye jo ek "haan, self-host karo" conclusion ko milti hai
jab facts genuinely use support karte hain. Koi bhi answer default se
privileged nahi hai; dono ek specific product ki requirements ke
actual facts se mechanically follow karte hain.

## Ye lesson Module 17 ke arc ko kaise complete karta hai

Lesson 1 ne concrete dimensions establish kiye (capability, cost
structure, data control, operational burden) jinpe open-vs-closed
decision turn karta hai. Lesson 2 ne dikhaya ki Ollama jaisi tools ne
self-hosted option exercise karne ki practical cost ko substantially
kaise kam kiya hai. Ye lesson module ko accessibility aur justification
ke beech crucial distinction ke saath close karta hai: local inference
ka pehle se kabhi zyada try karna aasan hona ek genuine, positive
development hai, par ye ek alag question answer karta hai us se ki kya
ek specific product ki actual requirements genuinely ise call karti
hain — aur do ko conflate karna single sabse common reasoning error
hai jise ye module prevent karne ka aim rakhta hai.`,

    examples: [
      {
        title: 'A decision function evaluated against four realistic product scenarios',
        titleHi: 'Ek decision function jo chaar realistic product scenarios ke against evaluate ki gayi',
        codeJs: `function isLocalInferenceJustified(factors) {
  return (
    factors.requiresOfflineOperation ||
    factors.hasHardDataResidencyRequirement ||
    factors.volumeExceedsCostCrossoverPoint ||
    factors.networkLatencyIsUnacceptableForUseCase
  );
}

const scenarios = {
  fieldInspectionApp: {
    requiresOfflineOperation: true,
    hasHardDataResidencyRequirement: false,
    volumeExceedsCostCrossoverPoint: false,
    networkLatencyIsUnacceptableForUseCase: false,
  },
  hospitalPatientRecordsAssistant: {
    requiresOfflineOperation: false,
    hasHardDataResidencyRequirement: true, // HIPAA-scoped data residency
    volumeExceedsCostCrossoverPoint: false,
    networkLatencyIsUnacceptableForUseCase: false,
  },
  highVolumeContentModerationAtScale: {
    requiresOfflineOperation: false,
    hasHardDataResidencyRequirement: false,
    volumeExceedsCostCrossoverPoint: true, // millions of requests/day, sustained
    networkLatencyIsUnacceptableForUseCase: false,
  },
  typicalSupportChatbot: {
    requiresOfflineOperation: false,
    hasHardDataResidencyRequirement: false,
    volumeExceedsCostCrossoverPoint: false,
    networkLatencyIsUnacceptableForUseCase: false,
  },
};

for (const [name, factors] of Object.entries(scenarios)) {
  console.log(name, '->', isLocalInferenceJustified(factors));
}
// fieldInspectionApp -> true
// hospitalPatientRecordsAssistant -> true
// highVolumeContentModerationAtScale -> true
// typicalSupportChatbot -> false`,
        codeTs: `interface LocalInferenceJustification {
  requiresOfflineOperation: boolean;
  hasHardDataResidencyRequirement: boolean;
  volumeExceedsCostCrossoverPoint: boolean;
  networkLatencyIsUnacceptableForUseCase: boolean;
}

function isLocalInferenceJustified(factors: LocalInferenceJustification): boolean {
  return (
    factors.requiresOfflineOperation ||
    factors.hasHardDataResidencyRequirement ||
    factors.volumeExceedsCostCrossoverPoint ||
    factors.networkLatencyIsUnacceptableForUseCase
  );
}

const scenarios: Record<string, LocalInferenceJustification> = {
  fieldInspectionApp: {
    requiresOfflineOperation: true,
    hasHardDataResidencyRequirement: false,
    volumeExceedsCostCrossoverPoint: false,
    networkLatencyIsUnacceptableForUseCase: false,
  },
  hospitalPatientRecordsAssistant: {
    requiresOfflineOperation: false,
    hasHardDataResidencyRequirement: true, // HIPAA-scoped data residency
    volumeExceedsCostCrossoverPoint: false,
    networkLatencyIsUnacceptableForUseCase: false,
  },
  highVolumeContentModerationAtScale: {
    requiresOfflineOperation: false,
    hasHardDataResidencyRequirement: false,
    volumeExceedsCostCrossoverPoint: true, // millions of requests/day, sustained
    networkLatencyIsUnacceptableForUseCase: false,
  },
  typicalSupportChatbot: {
    requiresOfflineOperation: false,
    hasHardDataResidencyRequirement: false,
    volumeExceedsCostCrossoverPoint: false,
    networkLatencyIsUnacceptableForUseCase: false,
  },
};

for (const [name, factors] of Object.entries(scenarios)) {
  console.log(name, '->', isLocalInferenceJustified(factors));
}
// fieldInspectionApp -> true
// hospitalPatientRecordsAssistant -> true
// highVolumeContentModerationAtScale -> true
// typicalSupportChatbot -> false`,
        code: `return (
  factors.requiresOfflineOperation ||
  factors.hasHardDataResidencyRequirement ||
  factors.volumeExceedsCostCrossoverPoint ||
  factors.networkLatencyIsUnacceptableForUseCase
);`,
        output:
          "Three of the four scenarios return true for genuinely different, specific reasons (offline requirement, data residency, cost crossover), while the typical support chatbot correctly returns false — no single one of these scenarios is treated as more 'valid' than another, and the absence of any applicable reason is itself a clear, actionable answer.",
        explain:
          "This example demonstrates the lesson's core practical framework: local inference justification is evaluated scenario-by-scenario against specific, checkable criteria, and a 'no, use the API' result is exactly as legitimate an outcome as a 'yes, self-host' result when the facts support it.",
        explainHi:
          "Ye example lesson ke core practical framework ko demonstrate karta hai: local inference justification scenario-by-scenario specific, checkable criteria ke against evaluate ki jaati hai, aur ek 'nahi, API use karo' result exactly utna hi legitimate outcome hai jitna ek 'haan, self-host karo' result jab facts use support karte hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Adopting local inference because it recently became easy to try
// (thanks to Ollama), without checking whether any genuine
// justification actually applies
function decideArchitectureWrong() {
  // "We got Ollama running on a dev laptop in 10 minutes, so let's
  // just self-host in production" — no offline requirement, no data
  // residency mandate, no volume analysis, no latency requirement
  return 'self_host'; // decided by ease of initial setup, not by
                        // whether self-hosting is actually justified
}`,
        right: `// Checking the actual, specific justifying factors before deciding
function decideArchitectureRight(factors) {
  const justified = (
    factors.requiresOfflineOperation ||
    factors.hasHardDataResidencyRequirement ||
    factors.volumeExceedsCostCrossoverPoint ||
    factors.networkLatencyIsUnacceptableForUseCase
  );
  // The ease of TRYING Ollama has no bearing on whether self-hosting
  // is the right ONGOING architectural decision for this product
  return justified ? 'self_host' : 'closed_api';
}`,
        why: "The operational burden of running production inference infrastructure (monitoring, scaling, maintenance) is a genuine, ongoing cost regardless of how easy the initial setup was — deciding to self-host because trying it was easy, rather than because a specific, checkable requirement actually demands it, commits the team to that ongoing cost without a genuine justification.",
        whyHi:
          "Production inference infrastructure chalane ka operational burden (monitoring, scaling, maintenance) ek genuine, ongoing cost hai chahe initial setup kitna bhi aasan raha ho — self-host karne ka decision lena kyunki ise try karna aasan tha, is wajah se nahi ki ek specific, checkable requirement actually ise demand karti hai, team ko us ongoing cost ke liye commit karta hai bina ek genuine justification ke.",
      },
    ],

    realWorld: [
      {
        en: "A production team that had experimented enthusiastically with a locally-hosted model after finding Ollama easy to set up ultimately decided against production self-hosting when a rigorous review found none of the four justifying scenarios actually applied to their moderate-volume, well-connected, non-regulated use case — they kept the closed API in production and used the local setup purely for offline development and testing, a genuinely appropriate use for local inference that this lesson's framework doesn't cover as a production justification but which is a real, legitimate use on its own.",
        hi: 'Ek production team jisne Ollama ko setup karna aasan paane ke baad enthusiastically ek locally-hosted model ke saath experiment kiya ultimately production self-hosting ke against decide kiya jab ek rigorous review ne paaya ki chaar justifying scenarios mein se koi bhi actually unke moderate-volume, well-connected, non-regulated use case pe apply nahi hota — unhone closed API ko production mein rakha aur local setup ko purely offline development aur testing ke liye use kiya, local inference ke liye ek genuinely appropriate use jise ye lesson ka framework production justification ki tarah cover nahi karta par jo apne aap mein ek real, legitimate use hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the four genuinely checkable scenarios where local inference is the justified choice, according to this lesson?',
        qHi: 'Is lesson ke hisaab se, wo kaunse chaar genuinely checkable scenarios hain jahan local inference justified choice hai?',
        a: "Offline/edge requirements (the feature must work with no network connectivity at all), hard data-residency constraints (regulatory or contractual mandates that data never leave specific infrastructure), cost crossover at scale (sustained, predictable, high-volume usage where self-hosting is genuinely cheaper than the equivalent API cost), and latency-critical co-located processing (where network round-trip latency is genuinely unacceptable for the use case).",
        aHi: 'Offline/edge requirements (feature ko bilkul koi network connectivity ke bina kaam karna chahiye), hard data-residency constraints (regulatory ya contractual mandates ki data kabhi specific infrastructure nahi chhode), cost crossover at scale (sustained, predictable, high-volume usage jahan self-hosting genuinely equivalent API cost se cheaper hai), aur latency-critical co-located processing (jahan network round-trip latency use case ke liye genuinely unacceptable hai).',
      },
      {
        q: "Why is 'we can now self-host easily thanks to Ollama' not sufficient justification for choosing local inference in production?",
        qHi: "'Hum ab Ollama ki wajah se easily self-host kar sakte hain' production mein local inference choose karne ke liye sufficient justification kyun nahi hai?",
        a: "Ollama lowers the operational barrier to trying local inference, but the ongoing operational burden of running production inference infrastructure — provisioning, monitoring, scaling, maintenance — doesn't disappear just because initial setup got easier. That recurring cost needs a recurring justification tied to one of the four genuine scenarios, not merely the fact that trying it was convenient.",
        aHi: 'Ollama local inference try karne ke operational barrier ko kam karta hai, par production inference infrastructure chalane ka ongoing operational burden — provisioning, monitoring, scaling, maintenance — disappear nahi hota sirf is wajah se ki initial setup aasan ho gaya. Us recurring cost ko chaar genuine scenarios mein se ek se tied ek recurring justification chahiye, sirf ye fact nahi ki ise try karna convenient tha.',
      },
    ],

    exercises: [
      {
        task: "A team building a document-search feature for a law firm client discovers the client has no specific data-residency requirement, uses the feature at low-to-moderate, unpredictable volume, has reliable internet access at all offices, and has no offline requirement. Using this lesson's decision function, determine what architecture is justified, and explain what single fact, if changed, would flip the recommendation.",
        taskHi: 'Ek team jo ek law firm client ke liye ek document-search feature banati hai discover karti hai ki client ki koi specific data-residency requirement nahi hai, feature ko low-to-moderate, unpredictable volume pe use karta hai, sab offices mein reliable internet access hai, aur koi offline requirement nahi hai. Is lesson ke decision function use karke, determine karo kaunsi architecture justified hai, aur explain karo kaunsa single fact, agar badla jaaye, recommendation ko flip kar dega.',
        hint: "Run through all four factors in the decision function with the facts given, and think about what would need to change about volume, data requirements, connectivity, or latency to make a different factor true.",
        hintHi: 'Diye gaye facts ke saath decision function mein chaaron factors ko run through karo, aur socho ki volume, data requirements, connectivity, ya latency ke baare mein kya badalna hoga ek alag factor ko true banane ke liye.',
      },
    ],

    keyTakeaways: [
      "Local inference is justified by four genuinely checkable scenarios — offline/edge requirements, hard data-residency constraints, cost crossover at scale, and latency-critical co-located processing — not by general preference.",
      "Offline/edge requirements make API-based models structurally impossible to use, not merely inconvenient, making this the clearest justifying case.",
      "Tools like Ollama making local inference easier to TRY doesn't answer whether a specific product's requirements actually justify the ongoing operational burden of self-hosting in production.",
      "A 'no, use the API' conclusion is exactly as legitimate an outcome of this lesson's decision framework as a 'yes, self-host' conclusion — closing Module 17 with a fair, requirement-driven evaluation process rather than a default preference in either direction.",
    ],
    keyTakeawaysHi: [
      'Local inference chaar genuinely checkable scenarios se justified hai — offline/edge requirements, hard data-residency constraints, cost crossover at scale, aur latency-critical co-located processing — general preference se nahi.',
      'Offline/edge requirements API-based models ko structurally impossible bana dete hain use karna, sirf inconvenient nahi, ise sabse clearest justifying case banate hue.',
      'Ollama jaisi tools ka local inference ko TRY karna aasan banana ye answer nahi karta ki kya ek specific product ki requirements actually production mein self-hosting ke ongoing operational burden ko justify karti hain.',
      "Ek 'nahi, API use karo' conclusion exactly utna hi legitimate outcome hai is lesson ke decision framework ka jitna ek 'haan, self-host karo' conclusion, Module 17 ko ek fair, requirement-driven evaluation process ke saath close karte hue kisi bhi direction mein ek default preference ke bajaye.",
    ],
  },
];
