/**
 * Generative AI Complete Course — Module 16: Fine-tuning vs Prompting vs RAG, lessons 1-3.
 *
 * Lesson 1: The decision tree — when each lever is genuinely the right one to pull.
 * Lesson 2: When fine-tuning helps vs wastes money — a realistic, unromantic look.
 * Lesson 3: The fine-tuning workflow at a conceptual level — dataset prep through evaluation.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_16: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-decision-tree-prompting-rag-finetuning',
    title: 'The Decision Tree — Prompting, RAG, or Fine-Tuning?',
    titleHi: 'The Decision Tree — Prompting, RAG, Ya Fine-Tuning?',
    description:
      "Three genuinely different levers exist for adapting a model's behavior to a specific task, each solving a different underlying problem — reaching for the wrong one is one of the most common, expensive mistakes teams make when building AI features.",
    descriptionHi:
      'Ek model ke behavior ko ek specific task ke liye adapt karne ke liye teen genuinely different levers exist karte hain, har ek ek different underlying problem solve karte hue — galat wale ko reach karna un sabse common, expensive mistakes mein se ek hai jo teams AI features banate waqt karti hain.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 1,

    analogy: {
      en: "**A new employee who needs instructions for a specific task (a sticky note on their desk), access to the company's internal reference documents (a shared drive they can look things up in), or months of on-the-job training that reshapes how they think about the work entirely (an apprenticeship) — three genuinely different interventions for three genuinely different problems, not three versions of the same fix.** If a new employee just needs to know today's specific formatting preference for a report, a sticky note with that instruction is exactly right — writing it down anywhere more permanent is wasted effort, and sending them through months of training for a one-time preference would be absurd. If the employee needs facts that live in a constantly-updated internal wiki (current pricing, this week's inventory levels), the fix isn't writing those facts on more sticky notes — it's giving them access to look the wiki up directly, since the facts change too often and are too voluminous to write down repeatedly. But if the employee's fundamental approach to the work itself needs to change — not what facts they know, but how they reason through a category of problem — no amount of sticky notes or wiki access fixes that; it genuinely requires sustained training that reshapes their underlying skill. Prompting is the sticky note (task-specific instructions, cheap and immediate). RAG is wiki access (current, voluminous, frequently-changing facts). Fine-tuning is the apprenticeship (reshaping the model's underlying behavior for a category of task) — and using the wrong one for a given problem is either wasteful or simply doesn't work.",
      hi: 'ek naya employee jise ek specific task ke liye instructions chahiye (unke desk pe ek sticky note), company ke internal reference documents tak access (ek shared drive jismein wo cheezein lookup kar sakte hain), ya months ki on-the-job training jo poori tarah reshape karti hai ki wo work ke baare mein kaise sochte hain (ek apprenticeship) — teen genuinely different interventions teen genuinely different problems ke liye, wahi fix ke teen versions nahi. Agar ek naya employee ko sirf ek report ke liye aaj ki specific formatting preference jaanni hai, us instruction ke saath ek sticky note exactly right hai — ise kisi zyada permanent jagah likhna wasted effort hai, aur unhe ek one-time preference ke liye months ki training se guzarna absurd hoga. Agar employee ko aise facts chahiye jo ek constantly-updated internal wiki mein rehte hain (current pricing, is hafte ke inventory levels), fix un facts ko zyada sticky notes pe likhna nahi hai — ye unhe wiki directly lookup karne ka access dena hai, kyunki facts bahut baar badalte hain aur baar baar likhne ke liye bahut voluminous hain. Par agar employee ka work ke prati fundamental approach khud badalne ki zaroorat hai — kya facts wo jaante hain nahi, balki wo ek category ke problem ke through kaise reason karte hain — koi bhi amount of sticky notes ya wiki access ise fix nahi karta; ise genuinely sustained training chahiye jo unki underlying skill ko reshape kare. Prompting sticky note hai (task-specific instructions, cheap aur immediate). RAG wiki access hai (current, voluminous, frequently-changing facts). Fine-tuning apprenticeship hai (model ke underlying behavior ko ek category ke task ke liye reshape karna) — aur ek given problem ke liye galat wale ko use karna ya to wasteful hai ya simply kaam nahi karta.',
    },

    simple: `**The three levers, and the genuinely different problem each one
solves:**

\`\`\`
PROMPTING: instructing the model, per-request, how to behave for THIS
  specific task — cheap, immediate, no training required, but limited
  by the context window and doesn't persist knowledge the model
  wasn't already trained on.

RAG: giving the model access to CURRENT, EXTERNAL, potentially
  large or frequently-changing information at query time — solves
  the "the model doesn't know this specific fact, or the fact
  changes" problem (Module 7-8 covered this in depth).

FINE-TUNING: additional training that changes the model's underlying
  weights — solves the "the model's default BEHAVIOR (not knowledge)
  needs to change for a category of task" problem — a genuinely
  different kind of intervention from the other two.
\`\`\`

**A concrete decision framework — the questions that actually
determine which lever is correct:**

\`\`\`ts
function chooseLever(problem) {
  // Question 1: is the issue that the model doesn't know a SPECIFIC,
  // CURRENT fact (pricing, inventory, a user's own documents)?
  if (problem.needsCurrentOrProprietaryFacts) {
    return 'RAG'; // the model needs access to information, not retraining
  }

  // Question 2: is the issue that the model doesn't know HOW to
  // approach a task, but a clear set of instructions would fix it?
  if (problem.canBeFixedWithClearInstructions) {
    return 'PROMPTING'; // start here — it's nearly always the cheapest fix
  }

  // Question 3: does the model need to reliably adopt a specific
  // STYLE, FORMAT, or REASONING PATTERN across thousands of varied
  // inputs, where prompting alone hasn't achieved sufficient
  // consistency even after real iteration?
  if (problem.needsConsistentBehaviorChange && problem.promptingProvenInsufficient) {
    return 'FINE_TUNING'; // the last resort, not the first instinct
  }

  return 'PROMPTING'; // the default starting point in nearly all cases
}
\`\`\`

**Why prompting should almost always be tried FIRST, even when the
end goal might genuinely require fine-tuning:**

\`\`\`
Prompting requires no training data, no training run, no additional
infrastructure, and can be iterated on in seconds. A well-engineered
prompt (Module 3's techniques: few-shot examples, explicit format
instructions, chain-of-thought scaffolding) resolves a large fraction
of behavior problems teams initially assume require fine-tuning. Only
after genuinely exhausting prompting (and RAG, if the problem involves
external facts) does fine-tuning's much higher cost and complexity
become justified.
\`\`\`

**Why RAG and fine-tuning solve genuinely different problems, and why
combining them is common rather than an either/or choice:**

\`\`\`
RAG addresses WHAT the model knows (giving it access to current,
specific facts at query time). Fine-tuning addresses HOW the model
behaves (its default reasoning style, format adherence, tone,
domain-specific judgment). A production system can genuinely need
both simultaneously — a customer-support assistant fine-tuned to
consistently follow a company's specific tone and escalation logic,
while ALSO using RAG to pull each customer's actual current account
details. Neither lever substitutes for the other's specific strength.
\`\`\`

\`\`\`ts
// A concrete illustration — the SAME underlying need for "know our
// current return policy" solved differently depending on WHY the
// model is getting it wrong
async function diagnoseReturnPolicyFailure(failureMode) {
  if (failureMode === 'policy_changed_last_week_model_has_stale_info') {
    return 'RAG — retrieve the current policy document at query time';
  }
  if (failureMode === 'model_knows_policy_but_explains_it_inconsistently') {
    return 'PROMPTING — a clearer system prompt with explicit examples of the desired explanation style';
  }
  if (failureMode === 'model_needs_to_apply_a_complex_escalation_ruleset_consistently_across_thousands_of_tickets') {
    return 'FINE_TUNING — if extensive prompting has already been tried and consistency is still insufficient';
  }
}
\`\`\`

**How this lesson opens Module 16:** the rest of this module (Lesson
2: when fine-tuning genuinely helps vs wastes money, Lesson 3: the
fine-tuning workflow) assumes this lesson's framework — that
fine-tuning is evaluated as the LAST lever considered, specifically
because it's the most expensive and slowest to iterate on, not because
it's inherently inferior for the narrow set of problems it's actually
suited to.`,

    simpleHi: `**Teen levers, aur har ek jo genuinely different problem solve karta
hai:**

\`\`\`
PROMPTING: model ko, per-request, instruct karna ki IS specific task
  ke liye kaise behave karna hai — cheap, immediate, koi training
  chahiye nahi, par context window se limited hai aur us knowledge ko
  persist nahi karta jispe model already trained nahi tha.

RAG: model ko CURRENT, EXTERNAL, potentially large ya frequently-
  changing information tak access dena query time pe — "model ko ye
  specific fact nahi pata, ya fact badalta hai" problem solve karta
  hai (Module 7-8 ne ise depth mein cover kiya).

FINE-TUNING: additional training jo model ke underlying weights ko
  badalti hai — "model ka default BEHAVIOR (knowledge nahi) ek
  category of task ke liye badalna chahiye" problem solve karta hai —
  doosre do se ek genuinely different kism ka intervention.
\`\`\`

**Ek concrete decision framework — questions jo actually determine
karte hain kaunsa lever correct hai:**

\`\`\`ts
function chooseLever(problem) {
  // Question 1: kya issue ye hai ki model ko ek SPECIFIC, CURRENT fact
  // nahi pata (pricing, inventory, ek user ke apne documents)?
  if (problem.needsCurrentOrProprietaryFacts) {
    return 'RAG'; // model ko information tak access chahiye, retraining nahi
  }

  // Question 2: kya issue ye hai ki model ko nahi pata ki ek task ko
  // KAISE approach karna hai, par instructions ka ek clear set ise
  // fix kar dega?
  if (problem.canBeFixedWithClearInstructions) {
    return 'PROMPTING'; // yahan se start karo — ye almost hamesha cheapest fix hai
  }

  // Question 3: kya model ko reliably ek specific STYLE, FORMAT, ya
  // REASONING PATTERN adopt karna hai thousands of varied inputs ke
  // across, jahan sirf prompting ne sufficient consistency achieve
  // nahi ki even real iteration ke baad?
  if (problem.needsConsistentBehaviorChange && problem.promptingProvenInsufficient) {
    return 'FINE_TUNING'; // last resort, first instinct nahi
  }

  return 'PROMPTING'; // almost sab cases mein default starting point
}
\`\`\`

**Prompting ko almost hamesha PEHLE kyun try karna chahiye, even jab
end goal genuinely fine-tuning require kare:**

\`\`\`
Prompting ko koi training data, koi training run, koi additional
infrastructure nahi chahiye, aur seconds mein iterate ki ja sakti hai.
Ek well-engineered prompt (Module 3 ki techniques: few-shot examples,
explicit format instructions, chain-of-thought scaffolding) behavior
problems ka ek bada fraction resolve karta hai jinhe teams initially
assume karti hain ki fine-tuning chahiye. Sirf genuinely prompting
(aur RAG, agar problem external facts involve karta hai) exhaust karne
ke baad hi fine-tuning ki kaafi zyada higher cost aur complexity
justified ban jaati hai.
\`\`\`

**RAG aur fine-tuning genuinely different problems kyun solve karte
hain, aur unhe combine karna common kyun hai ek either/or choice ke
bajaye:**

\`\`\`
RAG address karta hai model KYA jaanta hai (ise current, specific
facts tak query time pe access dena). Fine-tuning address karta hai
model KAISE behave karta hai (uska default reasoning style, format
adherence, tone, domain-specific judgment). Ek production system
genuinely dono ek saath chahiye ho sakta hai — ek customer-support
assistant jo consistently ek company ki specific tone aur escalation
logic follow karne ke liye fine-tuned hai, jabki BHI RAG use karta hai
har customer ke actual current account details pull karne ke liye.
Koi bhi lever doosre ki specific strength ka substitute nahi hai.
\`\`\`

\`\`\`ts
// Ek concrete illustration — "hamari current return policy jaano" ki
// WAHI underlying need alag tarike se solve ki gayi is baat pe depend
// karte hue ki model ise WHY galat kar raha hai
async function diagnoseReturnPolicyFailure(failureMode) {
  if (failureMode === 'policy_changed_last_week_model_has_stale_info') {
    return 'RAG — retrieve the current policy document at query time';
  }
  if (failureMode === 'model_knows_policy_but_explains_it_inconsistently') {
    return 'PROMPTING — a clearer system prompt with explicit examples of the desired explanation style';
  }
  if (failureMode === 'model_needs_to_apply_a_complex_escalation_ruleset_consistently_across_thousands_of_tickets') {
    return 'FINE_TUNING — if extensive prompting has already been tried and consistency is still insufficient';
  }
}
\`\`\`

**Ye lesson Module 16 ko kaise open karta hai:** is module ka baaki
hissa (Lesson 2: fine-tuning genuinely kab help karta hai vs paisa
waste karta hai, Lesson 3: fine-tuning workflow) is lesson ke
framework ko assume karta hai — ki fine-tuning ko LAST lever ki tarah
evaluate kiya jaata hai, specifically is wajah se ki ye sabse expensive
aur slowest to iterate hai, is wajah se nahi ki ye inherently inferior
hai us narrow set of problems ke liye jise ye actually suited hai.`,

    content: `## Why prompting, RAG, and fine-tuning solve genuinely different
underlying problems, not three difficulty levels of the same fix

Prompting adjusts model behavior per-request through instructions in
the context window — fast, cheap, and reversible, but limited to what
fits in context and to knowledge the model already has. RAG addresses
a knowledge-access problem: the model needs specific, current, or
proprietary information it wasn't trained on, retrieved and injected at
query time (the full mechanics of this were covered in Modules 7-8).
Fine-tuning addresses a behavior-shaping problem: the model's default
tendencies (tone, format adherence, domain-specific reasoning patterns)
need to change durably, across many future requests, in a way that
prompting alone hasn't achieved even after genuine iteration. Treating
these as interchangeable "levels of effort" rather than solutions to
different problems is what leads teams to reach for the wrong,
often needlessly expensive tool.

## Why prompting should be the default first attempt, even when the
underlying goal might eventually require fine-tuning

Because prompting requires no training data, no training infrastructure,
and can be iterated on in seconds, it has an extremely low cost of
experimentation compared to fine-tuning, which requires assembling a
quality dataset, running and monitoring a training job, and evaluating
the result — each with real time and cost. Module 3's prompt-
engineering techniques (few-shot examples, explicit format instructions,
chain-of-thought scaffolding) resolve a substantial fraction of behavior
problems that might initially seem to require deeper intervention. This
is why the responsible practice is to genuinely exhaust prompting (and
RAG, where the problem is about facts rather than behavior) before
concluding fine-tuning is actually necessary — not because fine-tuning
is inferior, but because verifying the cheaper levers are insufficient
first avoids a costly, premature commitment.

## Why RAG and fine-tuning are frequently combined rather than
mutually exclusive choices

Because RAG solves a knowledge-access problem and fine-tuning solves a
behavior-shaping problem, a single production system can genuinely need
both: a fine-tuned model that has durably learned a company's specific
tone, escalation logic, and domain-specific reasoning patterns, while
still using RAG to retrieve each individual customer's current,
specific account data at query time. Neither lever substitutes for the
other's specific strength — fine-tuning a model to memorize an
individual customer's account details would be absurd (the data is
specific to one customer and constantly changing, exactly RAG's use
case), while relying on RAG alone to consistently enforce a company's
tone and complex escalation rules across every interaction is far less
reliable than fine-tuning for that specific, durable behavior pattern.

## How this lesson's framework sets up the rest of Module 16

This lesson establishes fine-tuning's correct position in the decision
tree: the last lever considered, evaluated only once prompting and RAG
have been genuinely tried and found insufficient for a durable
behavior-change problem specifically (not a knowledge-access problem).
Lesson 2 builds directly on this by examining, concretely, what
distinguishes a genuine fine-tuning use case from a wasteful one, and
Lesson 3 walks through what the fine-tuning workflow actually involves
once this lesson's decision tree has genuinely pointed there.`,

    contentHi: `## Prompting, RAG, aur fine-tuning genuinely different underlying problems kyun solve karte hain, wahi fix ke teen difficulty levels nahi

Prompting model behavior ko per-request instructions ke through
context window mein adjust karta hai — fast, cheap, aur reversible,
par context mein jo fit hota hai aur us knowledge tak limited jo model
ke paas already hai. RAG ek knowledge-access problem address karta
hai: model ko specific, current, ya proprietary information chahiye
jispe wo trained nahi tha, query time pe retrieve aur inject ki gayi
(iski poori mechanics Modules 7-8 mein cover ki gayi thi). Fine-tuning
ek behavior-shaping problem address karta hai: model ki default
tendencies (tone, format adherence, domain-specific reasoning patterns)
ko durably badalna chahiye, kai future requests ke across, ek tarike
se jise sirf prompting achieve nahi kar paayi even genuine iteration
ke baad. Inhe interchangeable "levels of effort" ki tarah treat karna
different problems ke solutions ke bajaye wo hai jo teams ko galat,
aksar needlessly expensive tool tak le jaata hai.

## Prompting ko default first attempt kyun hona chahiye, even jab underlying goal eventually fine-tuning require kare

Kyunki prompting ko koi training data, koi training infrastructure
nahi chahiye, aur seconds mein iterate ki ja sakti hai, iska
experimentation ka cost fine-tuning se extremely kam hai, jise ek
quality dataset assemble karna, ek training job run aur monitor karna,
aur result evaluate karna chahiye — har ek ke saath real time aur
cost. Module 3 ki prompt-engineering techniques (few-shot examples,
explicit format instructions, chain-of-thought scaffolding) behavior
problems ka ek substantial fraction resolve karti hain jo initially
zyada deep intervention require karte hue lag sakte hain. Yahi wajah
hai responsible practice genuinely prompting (aur RAG, jahan problem
facts ke baare mein hai behavior ke bajaye) exhaust karna hai
conclude karne se pehle ki fine-tuning actually necessary hai — is
wajah se nahi ki fine-tuning inferior hai, balki is wajah se ki pehle
verify karna ki cheaper levers insufficient hain ek costly, premature
commitment avoid karta hai.

## RAG aur fine-tuning frequently combined kyun hote hain mutually exclusive choices ke bajaye

Kyunki RAG ek knowledge-access problem solve karta hai aur fine-tuning
ek behavior-shaping problem solve karta hai, ek single production
system genuinely dono chahiye ho sakta hai: ek fine-tuned model jisne
durably ek company ki specific tone, escalation logic, aur domain-
specific reasoning patterns seekhi hain, jabki abhi bhi RAG use karta
hai har individual customer ka current, specific account data query
time pe retrieve karne ke liye. Koi bhi lever doosre ki specific
strength ka substitute nahi hai — ek model ko ek individual customer
ke account details memorize karne ke liye fine-tune karna absurd hoga
(data ek customer ke specific hai aur constantly changing hai, exactly
RAG ka use case), jabki akele RAG pe rely karna ek company ki tone aur
complex escalation rules ko consistently enforce karne ke liye har
interaction ke across us specific, durable behavior pattern ke liye
fine-tuning se kaafi kam reliable hai.

## Ye lesson ka framework Module 16 ke baaki hisse ko kaise set up karta hai

Ye lesson fine-tuning ki decision tree mein correct position establish
karta hai: last lever consider kiya gaya, sirf tab evaluate kiya gaya
jab prompting aur RAG genuinely try kiye ja chuke hain aur ek durable
behavior-change problem specifically ke liye insufficient paaye gaye
(ek knowledge-access problem nahi). Lesson 2 isi pe directly build
karta hai ye examine karke, concretely, ki kya ek genuine fine-tuning
use case ko ek wasteful wale se distinguish karta hai, aur Lesson 3
walk through karta hai ki fine-tuning workflow actually kya involve
karta hai ek baar is lesson ki decision tree genuinely wahan point kar
chuki ho.`,

    examples: [
      {
        title: 'A decision-tree function applied to three real product scenarios',
        titleHi: 'Ek decision-tree function jo teen real product scenarios pe applied hai',
        codeJs: `function chooseLever(scenario) {
  const {
    needsCurrentOrProprietaryFacts,
    canBeFixedWithClearInstructions,
    needsConsistentBehaviorChange,
    promptingProvenInsufficient,
  } = scenario;

  if (needsCurrentOrProprietaryFacts) return 'RAG';
  if (canBeFixedWithClearInstructions) return 'PROMPTING';
  if (needsConsistentBehaviorChange && promptingProvenInsufficient) return 'FINE_TUNING';
  return 'PROMPTING';
}

// Scenario 1: a support bot needs today's actual shipping delays,
// which change daily and aren't something the base model knows
console.log(chooseLever({
  needsCurrentOrProprietaryFacts: true,
  canBeFixedWithClearInstructions: false,
  needsConsistentBehaviorChange: false,
  promptingProvenInsufficient: false,
})); // "RAG"

// Scenario 2: outputs are inconsistently formatted, but a clear
// system prompt with an example has never actually been tried
console.log(chooseLever({
  needsCurrentOrProprietaryFacts: false,
  canBeFixedWithClearInstructions: true,
  needsConsistentBehaviorChange: false,
  promptingProvenInsufficient: false,
})); // "PROMPTING"

// Scenario 3: a legal-document classifier needs a nuanced, domain-
// specific judgment applied consistently across 50,000 documents/day,
// and six weeks of prompt iteration hasn't gotten consistency above 80%
console.log(chooseLever({
  needsCurrentOrProprietaryFacts: false,
  canBeFixedWithClearInstructions: false,
  needsConsistentBehaviorChange: true,
  promptingProvenInsufficient: true,
})); // "FINE_TUNING"`,
        codeTs: `interface LeverScenario {
  needsCurrentOrProprietaryFacts: boolean;
  canBeFixedWithClearInstructions: boolean;
  needsConsistentBehaviorChange: boolean;
  promptingProvenInsufficient: boolean;
}

type Lever = 'RAG' | 'PROMPTING' | 'FINE_TUNING';

function chooseLever(scenario: LeverScenario): Lever {
  const {
    needsCurrentOrProprietaryFacts,
    canBeFixedWithClearInstructions,
    needsConsistentBehaviorChange,
    promptingProvenInsufficient,
  } = scenario;

  if (needsCurrentOrProprietaryFacts) return 'RAG';
  if (canBeFixedWithClearInstructions) return 'PROMPTING';
  if (needsConsistentBehaviorChange && promptingProvenInsufficient) return 'FINE_TUNING';
  return 'PROMPTING';
}

// Scenario 1: a support bot needs today's actual shipping delays,
// which change daily and aren't something the base model knows
console.log(chooseLever({
  needsCurrentOrProprietaryFacts: true,
  canBeFixedWithClearInstructions: false,
  needsConsistentBehaviorChange: false,
  promptingProvenInsufficient: false,
})); // "RAG"

// Scenario 2: outputs are inconsistently formatted, but a clear
// system prompt with an example has never actually been tried
console.log(chooseLever({
  needsCurrentOrProprietaryFacts: false,
  canBeFixedWithClearInstructions: true,
  needsConsistentBehaviorChange: false,
  promptingProvenInsufficient: false,
})); // "PROMPTING"

// Scenario 3: a legal-document classifier needs a nuanced, domain-
// specific judgment applied consistently across 50,000 documents/day,
// and six weeks of prompt iteration hasn't gotten consistency above 80%
console.log(chooseLever({
  needsCurrentOrProprietaryFacts: false,
  canBeFixedWithClearInstructions: false,
  needsConsistentBehaviorChange: true,
  promptingProvenInsufficient: true,
})); // "FINE_TUNING"`,
        code: `if (needsCurrentOrProprietaryFacts) return 'RAG';
if (canBeFixedWithClearInstructions) return 'PROMPTING';
if (needsConsistentBehaviorChange && promptingProvenInsufficient) return 'FINE_TUNING';
return 'PROMPTING';`,
        output:
          "Scenario 1 returns 'RAG' (a current-facts problem), Scenario 2 returns 'PROMPTING' (an untried, likely-sufficient cheap fix), and Scenario 3 returns 'FINE_TUNING' (a genuine, extensively-tested behavior-consistency problem) — the same function structure applied to three qualitatively different underlying problems, arriving at three different, each individually correct, answers.",
        explain:
          "This example operationalizes the lesson's decision tree directly in code, making explicit that the choice between the three levers follows from identifying which underlying problem (missing current facts, an easily-instructable behavior, or a genuinely resistant behavior-consistency need) is actually present, rather than defaulting to whichever lever is most familiar or exciting to the team.",
        explainHi:
          "Ye example lesson ki decision tree ko directly code mein operationalize karta hai, explicit karte hue ki teen levers ke beech choice is baat ko identify karne se follow karti hai ki kaunsa underlying problem (missing current facts, ek easily-instructable behavior, ya ek genuinely resistant behavior-consistency need) actually present hai, jo bhi lever team ko sabse familiar ya exciting lage use default karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Jumping straight to fine-tuning to fix an inconsistent output
// format, without first trying a clearer prompt
async function fixFormattingWrong() {
  // Assembles a training dataset, runs a fine-tuning job, waits hours,
  // pays for training compute — to fix something a better prompt
  // might have solved in five minutes
  return await startFineTuningJob({
    baseModel: 'gpt-4o-mini',
    trainingData: assembleFormattingExamples(),
  });
}`,
        right: `// Trying a clearer, example-driven prompt FIRST — the cheap,
// fast-to-iterate lever, before considering the expensive one
async function fixFormattingRight() {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    system: \`Always respond in this exact format:
{"summary": "...", "confidence": "high"|"medium"|"low"}
Example: {"summary": "Order shipped on time", "confidence": "high"}\`,
    messages: [{ role: 'user', content: userQuery }],
  });
  // Only if THIS, genuinely iterated on, fails to achieve sufficient
  // consistency does fine-tuning become worth considering
  return response;
}`,
        why: "Fine-tuning requires assembling a training dataset, running and monitoring a training job, and paying for training compute — real time and cost that's frequently unnecessary, since a substantial fraction of formatting and behavior-consistency problems are resolved by better prompt engineering (explicit format instructions, few-shot examples) alone, at a small fraction of the cost and iteration time.",
        whyHi:
          "Fine-tuning ko ek training dataset assemble karna, ek training job run aur monitor karna, aur training compute ke liye pay karna chahiye — real time aur cost jo aksar unnecessary hoti hai, kyunki formatting aur behavior-consistency problems ka ek substantial fraction sirf behtar prompt engineering (explicit format instructions, few-shot examples) se resolve ho jaata hai, cost aur iteration time ke ek chhote fraction pe.",
      },
    ],

    realWorld: [
      {
        en: "A production content-moderation team initially planned a fine-tuning project to improve classification consistency, but discovered — after actually trying a more detailed, few-shot-example-driven prompt as a cheap first experiment — that prompting alone closed most of the consistency gap, and the fine-tuning project was scoped down to a narrower, genuinely justified subset of edge cases where prompting had demonstrably plateaued.",
        hi: 'Ek production content-moderation team ne initially classification consistency improve karne ke liye ek fine-tuning project plan kiya, par discover kiya — actually ek zyada detailed, few-shot-example-driven prompt ko ek cheap first experiment ki tarah try karne ke baad — ki akeli prompting ne zyada tar consistency gap close kar diya, aur fine-tuning project ko ek narrower, genuinely justified subset of edge cases tak scope down kar diya gaya jahan prompting demonstrably plateau ho chuki thi.',
      },
    ],

    interviewQA: [
      {
        q: 'What genuinely different problem does each of prompting, RAG, and fine-tuning solve?',
        qHi: 'Prompting, RAG, aur fine-tuning mein se har ek genuinely kaunsa different problem solve karta hai?',
        a: "Prompting adjusts behavior per-request via context-window instructions, addressing tasks a clear instruction can fix. RAG solves a knowledge-access problem — the model needs current, specific, or proprietary facts it wasn't trained on, retrieved at query time. Fine-tuning solves a behavior-shaping problem — the model's underlying tendencies (tone, format, domain-specific reasoning) need to durably change across many future requests, in a way prompting alone hasn't achieved.",
        aHi: 'Prompting behavior ko per-request context-window instructions ke through adjust karta hai, un tasks ko address karte hue jinhe ek clear instruction fix kar sakti hai. RAG ek knowledge-access problem solve karta hai — model ko current, specific, ya proprietary facts chahiye jispe wo trained nahi tha, query time pe retrieve kiye gaye. Fine-tuning ek behavior-shaping problem solve karta hai — model ki underlying tendencies (tone, format, domain-specific reasoning) ko durably badalna chahiye kai future requests ke across, ek tarike se jise sirf prompting achieve nahi kar paayi.',
      },
      {
        q: "Why should a team almost always try prompting before considering fine-tuning, even if they suspect fine-tuning will ultimately be necessary?",
        qHi: 'Ek team ko fine-tuning consider karne se pehle almost hamesha prompting kyun try karni chahiye, chahe unhe shak ho ki fine-tuning ultimately necessary hogi?',
        a: "Prompting requires no training data, no training infrastructure, and can be iterated on in seconds, making its cost of experimentation far lower than fine-tuning, which requires assembling a dataset and running a real training job. A substantial fraction of behavior problems are resolved by prompt engineering alone, so genuinely exhausting that cheap option first avoids an unnecessary, costly commitment to fine-tuning.",
        aHi: 'Prompting ko koi training data, koi training infrastructure nahi chahiye, aur seconds mein iterate ki ja sakti hai, iski experimentation cost ko fine-tuning se kaafi kam banate hue, jise ek dataset assemble karna aur ek real training job run karna chahiye. Behavior problems ka ek substantial fraction akeli prompt engineering se resolve ho jaata hai, isliye pehle us cheap option ko genuinely exhaust karna fine-tuning ke liye ek unnecessary, costly commitment avoid karta hai.',
      },
    ],

    exercises: [
      {
        task: "A team wants their AI assistant to always know their company's current employee headcount (which changes weekly) and also to always respond in a specific, branded tone regardless of the question. Using this lesson's decision tree, identify which lever (or combination) fits each of these two requirements, and explain why they're different kinds of problems.",
        taskHi: 'Ek team apni AI assistant ko chahati hai ki wo hamesha unki company ka current employee headcount jaane (jo weekly badalta hai) aur hamesha ek specific, branded tone mein respond kare kisi bhi question se independently. Is lesson ki decision tree use karke, identify karo ki kaunsa lever (ya combination) in do requirements mein se har ek ko fit karta hai, aur explain karo ki wo kis tarah ke different problems hain.',
        hint: "One requirement is about a specific, frequently-changing fact; the other is about a durable, consistent style applied across every interaction regardless of content. Which lever addresses knowledge, and which addresses behavior?",
        hintHi: 'Ek requirement ek specific, frequently-changing fact ke baare mein hai; doosri ek durable, consistent style ke baare mein hai jo har interaction ke across content se independently applied hai. Kaunsa lever knowledge address karta hai, aur kaunsa behavior address karta hai?',
      },
    ],

    keyTakeaways: [
      "Prompting, RAG, and fine-tuning solve genuinely different problems: prompting handles task-specific instructions, RAG handles knowledge access to current/proprietary facts, and fine-tuning handles durable behavior change.",
      "Prompting should almost always be tried first, since it requires no training data or infrastructure and can be iterated on in seconds — a large fraction of apparent 'behavior problems' are resolved this way.",
      "RAG and fine-tuning are frequently combined rather than mutually exclusive, since one addresses what the model knows and the other addresses how it behaves.",
      "Fine-tuning should be evaluated last in the decision tree, specifically because it's the most expensive and slowest to iterate on — not because it's inherently inferior for the narrow problems it genuinely suits.",
    ],
    keyTakeawaysHi: [
      'Prompting, RAG, aur fine-tuning genuinely different problems solve karte hain: prompting task-specific instructions handle karta hai, RAG current/proprietary facts tak knowledge access handle karta hai, aur fine-tuning durable behavior change handle karta hai.',
      'Prompting ko almost hamesha pehle try karna chahiye, kyunki isko koi training data ya infrastructure nahi chahiye aur seconds mein iterate ki ja sakti hai — apparent "behavior problems" ka ek bada fraction is tarike se resolve ho jaata hai.',
      'RAG aur fine-tuning frequently combined hote hain mutually exclusive hone ke bajaye, kyunki ek address karta hai model kya jaanta hai aur doosra address karta hai ye kaise behave karta hai.',
      'Fine-tuning ko decision tree mein last evaluate karna chahiye, specifically is wajah se ki ye sabse expensive aur slowest to iterate hai — is wajah se nahi ki ye inherently inferior hai un narrow problems ke liye jinhe ye genuinely suit karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-when-finetuning-helps-vs-wastes-money',
    title: 'When Fine-Tuning Genuinely Helps vs Wastes Money',
    titleHi: 'Fine-Tuning Genuinely Kab Help Karti Hai Vs Paisa Waste Karti Hai',
    description:
      "A realistic, unromantic look at fine-tuning's actual economics and failure modes — it is not a magic upgrade, it has real, recurring costs beyond the training run itself, and a substantial fraction of fine-tuning projects fail to outperform a well-engineered prompt.",
    descriptionHi:
      'Fine-tuning ki actual economics aur failure modes ka ek realistic, unromantic look — ye ek magic upgrade nahi hai, iske real, recurring costs hain training run se aage bhi, aur fine-tuning projects ka ek substantial fraction ek well-engineered prompt ko outperform karne mein fail hota hai.',
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: "**Sending an employee to a six-month specialized certification program to fix a problem that a one-page checklist taped to their monitor would have solved just as well.** A company that discovers an employee makes a specific, recurring formatting mistake has two very different options: give them a one-page checklist to follow (cheap, immediate, easily updated if the format requirements change next month), or enroll them in a six-month specialized certification program (expensive, slow, and — critically — much harder to update if requirements change, since the training already happened and can't be un-learned). Sending someone through months of specialized training to fix a problem a checklist would have solved isn't just wasteful in the obvious, immediate sense — it also leaves the company with an employee whose training is now MISMATCHED the moment requirements change, since a new checklist can be handed out in minutes but new training takes months to redo. This is exactly fine-tuning's real economic trap: its upfront cost (data preparation, the training run itself, evaluation) is often only the beginning, and its output is a static asset that becomes stale the moment the underlying task requirements shift — unlike a prompt, which can be edited and redeployed in minutes, or a RAG index, which naturally stays current as its source documents are updated.",
      hi: 'ek employee ko ek six-month specialized certification program mein bhejna ek problem fix karne ke liye jise unke monitor pe taped ek one-page checklist utna hi achhe se solve kar deti. Ek company jo discover karti hai ki ek employee ek specific, recurring formatting mistake karta hai do bahut different options rakhti hai: unhe follow karne ke liye ek one-page checklist do (cheap, immediate, easily updated agar format requirements agle mahine badal jaayein), ya unhe ek six-month specialized certification program mein enroll karo (expensive, slow, aur — critically — update karna kaafi zyada harder agar requirements badal jaayein, kyunki training already ho chuki hai aur un-learn nahi ki ja sakti). Kisi ko months ki specialized training se guzarna ek problem fix karne ke liye jise ek checklist solve kar deti sirf obvious, immediate sense mein wasteful nahi hai — ye company ko ek employee ke saath bhi chhodta hai jiski training ab MISMATCHED hai us moment jab requirements badalti hain, kyunki ek nayi checklist minutes mein di ja sakti hai par nayi training redo hone mein months lagte hain. Ye exactly fine-tuning ka real economic trap hai: iska upfront cost (data preparation, training run khud, evaluation) aksar sirf shuruaat hai, aur iska output ek static asset hai jo stale ban jaata hai us moment jab underlying task requirements shift hote hain — ek prompt ke unlike, jise minutes mein edit aur redeploy kiya ja sakta hai, ya ek RAG index, jo naturally current rehta hai jaise iske source documents update hote hain.',
    },

    simple: `**The genuine costs of fine-tuning that go beyond "the training
run itself" — this is where most cost underestimates happen:**

\`\`\`
1. DATA PREPARATION — assembling, cleaning, and labeling a genuinely
   representative training dataset is frequently the most
   time-consuming part of the entire project, not the training run.

2. THE TRAINING RUN — real compute cost, and typically requires
   MULTIPLE runs (hyperparameter tuning, fixing dataset issues
   discovered only after seeing results) rather than one clean pass.

3. EVALUATION — a genuinely rigorous evaluation (Module 14's eval-
   dataset discipline, applied here) to confirm the fine-tuned model
   actually outperforms the baseline, not just "feels different."

4. ONGOING MAINTENANCE — the fine-tuned model becomes STALE the
   moment underlying requirements change, and updating it means
   re-running much of the above process, unlike a prompt edit
   (minutes) or a RAG index update (automatic as source docs change).
\`\`\`

**A concrete cost-comparison function — making the TOTAL cost of
each approach explicit, not just the obvious sticker price:**

\`\`\`ts
function estimateTotalCost(approach) {
  if (approach === 'prompting') {
    return {
      upfrontCost: 'minutes of engineer time',
      ongoingCost: 'near-zero — edits are free and instant',
      staleness Risk: 'none — always reflects the current prompt',
    };
  }
  if (approach === 'fine_tuning') {
    return {
      upfrontCost: 'data prep (often weeks) + training runs + evaluation',
      ongoingCost: 're-run much of the above whenever requirements change',
      stalenessRisk: 'high — the model doesn\\'t know about a requirement change until re-trained',
    };
  }
}
\`\`\`

**Why a genuine baseline comparison against a well-engineered prompt
is non-negotiable before committing to fine-tuning — this is where
Module 14's evaluation discipline becomes directly load-bearing:**

\`\`\`
A fine-tuning project that skips rigorously comparing its result
against a genuinely well-engineered prompt (not a lazy, first-draft
prompt used as a strawman) risks declaring victory over a baseline
that was never given a fair chance. Module 14's eval-dataset and
golden-dataset discipline applies directly here: the SAME evaluation
set should be run against both the best achievable prompt AND the
fine-tuned model, using the SAME success criteria, before concluding
fine-tuning was worth its cost.
\`\`\`

\`\`\`ts
// A structured comparison — preventing the common mistake of
// comparing a fine-tuned model against an unfairly weak prompt baseline
async function compareApproaches(evalDataset, bestPrompt, fineTunedModel) {
  const promptResults = await runEval(evalDataset, bestPrompt);
  const fineTunedResults = await runEval(evalDataset, fineTunedModel);

  return {
    promptAccuracy: promptResults.accuracy,
    fineTunedAccuracy: fineTunedResults.accuracy,
    // Only proceed with fine-tuning in production if the improvement
    // is large enough to justify its ongoing maintenance burden —
    // a marginal gain rarely clears that bar
    genuineImprovement: fineTunedResults.accuracy - promptResults.accuracy,
  };
}
\`\`\`

**Why fine-tuning genuinely does help in a specific, narrower set of
cases — this isn't an argument that fine-tuning is never worth it:**

\`\`\`
Fine-tuning is genuinely justified when: the required behavior needs
to be applied with high consistency across a very large volume of
requests where prompting has demonstrably plateaued below an acceptable
accuracy after real iteration; the task requires a narrow, specialized
style or domain judgment that's expensive to re-specify in every
prompt (versus baked into model weights); or per-request latency/cost
matters enough that a smaller fine-tuned model can replace a larger,
more expensive general-purpose model for a narrow task at acceptable
quality.
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established fine-
tuning's correct position as the last-considered lever. This lesson
makes the economic case for that ordering concrete: fine-tuning's true
cost extends well past the training run itself, its output goes stale
in a way prompts and RAG indexes don't, and a substantial fraction of
projects that skip a rigorous prompt-baseline comparison end up unable
to prove the investment was actually worth it.`,

    simpleHi: `**Fine-tuning ke genuine costs jo "training run khud" se aage jaate
hain — yahan zyada tar cost underestimates hote hain:**

\`\`\`
1. DATA PREPARATION — ek genuinely representative training dataset
   assemble, clean, aur label karna aksar poore project ka sabse
   time-consuming hissa hai, training run nahi.

2. THE TRAINING RUN — real compute cost, aur typically MULTIPLE runs
   chahiye hote hain (hyperparameter tuning, dataset issues fix
   karna jo sirf results dekhne ke baad discover hote hain) ek clean
   pass ke bajaye.

3. EVALUATION — ek genuinely rigorous evaluation (Module 14 ki eval-
   dataset discipline, yahan applied) confirm karne ke liye ki
   fine-tuned model actually baseline ko outperform karta hai, sirf
   "different feel karta hai" nahi.

4. ONGOING MAINTENANCE — fine-tuned model us moment STALE ban jaata
   hai jab underlying requirements badalte hain, aur ise update karne
   ka matlab hai upar wale ka zyada tar re-run karna, ek prompt edit
   (minutes) ya ek RAG index update (automatic jaise source docs
   badalte hain) ke unlike.
\`\`\`

**Ek concrete cost-comparison function — har approach ki TOTAL cost
ko explicit banate hue, sirf obvious sticker price nahi:**

\`\`\`ts
function estimateTotalCost(approach) {
  if (approach === 'prompting') {
    return {
      upfrontCost: 'minutes of engineer time',
      ongoingCost: 'near-zero — edits are free and instant',
      stalenessRisk: 'none — always reflects the current prompt',
    };
  }
  if (approach === 'fine_tuning') {
    return {
      upfrontCost: 'data prep (often weeks) + training runs + evaluation',
      ongoingCost: 're-run much of the above whenever requirements change',
      stalenessRisk: 'high — the model doesn\\'t know about a requirement change until re-trained',
    };
  }
}
\`\`\`

**Ek genuine baseline comparison ek well-engineered prompt ke against
fine-tuning ke liye commit karne se pehle non-negotiable kyun hai —
yahan Module 14 ki evaluation discipline directly load-bearing ban
jaati hai:**

\`\`\`
Ek fine-tuning project jo rigorously apne result ko ek genuinely
well-engineered prompt ke against compare karna skip karta hai (ek
lazy, first-draft prompt nahi jo strawman ki tarah use kiya gaya) us
baseline ke against victory declare karne ka risk lete hain jise kabhi
fair chance nahi diya gaya. Module 14 ki eval-dataset aur golden-
dataset discipline directly yahan apply hoti hai: WAHI evaluation set
best achievable prompt AUR fine-tuned model dono ke against run kiya
jaana chahiye, WAHI success criteria use karke, ye conclude karne se
pehle ki fine-tuning uske cost ke layak thi.
\`\`\`

\`\`\`ts
// Ek structured comparison — common mistake ko prevent karte hue ek
// fine-tuned model ko ek unfairly weak prompt baseline ke against
// compare karne ka
async function compareApproaches(evalDataset, bestPrompt, fineTunedModel) {
  const promptResults = await runEval(evalDataset, bestPrompt);
  const fineTunedResults = await runEval(evalDataset, fineTunedModel);

  return {
    promptAccuracy: promptResults.accuracy,
    fineTunedAccuracy: fineTunedResults.accuracy,
    // Production mein fine-tuning ke saath sirf tab proceed karo agar
    // improvement itna bada hai ki iska ongoing maintenance burden
    // justify ho — ek marginal gain rarely us bar ko clear karta hai
    genuineImprovement: fineTunedResults.accuracy - promptResults.accuracy,
  };
}
\`\`\`

**Fine-tuning genuinely ek specific, narrower set of cases mein kyun
help karti hai — ye ek argument nahi hai ki fine-tuning kabhi worth
it nahi hai:**

\`\`\`
Fine-tuning genuinely justified hai jab: required behavior ko high
consistency ke saath apply karna chahiye ek bahut large volume of
requests ke across jahan prompting ne demonstrably plateau kiya ek
acceptable accuracy se neeche real iteration ke baad; task ko ek
narrow, specialized style ya domain judgment chahiye jo har prompt
mein re-specify karna expensive hai (model weights mein baked hone
versus); ya per-request latency/cost itna matter karta hai ki ek
smaller fine-tuned model ek larger, zyada expensive general-purpose
model ko replace kar sake ek narrow task ke liye acceptable quality
pe.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne fine-
tuning ki correct position last-considered lever ki tarah establish
ki. Ye lesson us ordering ke liye economic case ko concrete banata
hai: fine-tuning ka true cost training run khud se kaafi aage extend
karta hai, iska output stale ban jaata hai ek tarike se jo prompts aur
RAG indexes nahi karte, aur projects ka ek substantial fraction jo ek
rigorous prompt-baseline comparison skip karte hain end up unable
prove karne mein ki investment actually worth it thi.`,

    content: `## Why fine-tuning's total cost extends well past "the training
run itself," and why this is where cost estimates most commonly go
wrong

Teams frequently budget for fine-tuning by estimating training compute
cost alone, which is often the smallest line item in the actual total.
Assembling a genuinely representative, well-labeled training dataset is
frequently the most time-consuming part of the project — quality
training data doesn't typically already exist in a ready-to-use form,
and preparing it well is a substantial undertaking in its own right.
Training itself usually requires multiple runs (hyperparameter
adjustments, fixing dataset problems only discovered after seeing
initial results), not a single clean pass. Rigorous evaluation against
a genuine baseline (discussed further below) adds real additional
effort. And ongoing maintenance — re-running much of this process
whenever the underlying task requirements shift — is a genuinely
recurring cost that a prompt edit or a RAG index update largely avoids.

## Why comparing a fine-tuned model against a weak or unoptimized
prompt baseline produces a systematically misleading result

A fine-tuning project that declares success by comparing its result
against a first-draft, unoptimized prompt is comparing against a
strawman — the honest question isn't "did fine-tuning beat SOME
prompt," it's "did fine-tuning beat the BEST prompt genuinely
achievable with real, serious effort." This is precisely why Module
14's evaluation discipline — a fixed eval dataset, consistent success
criteria, applied identically to every approach under comparison — is
non-negotiable here: without it, a team can convince itself an
expensive fine-tuning investment was worthwhile when a fraction of that
effort spent on prompt engineering might have closed most or all of
the gap.

## Why a fine-tuned model's staleness is a structurally different
kind of maintenance burden from a prompt's or a RAG index's

A prompt can be edited and redeployed in minutes when requirements
change. A RAG index (Modules 7-8) naturally reflects updated
information as its underlying documents are updated, without any
retraining. A fine-tuned model's learned behavior is comparatively
frozen at training time — when the task's requirements shift, the model
doesn't know about the change until it goes through another round of
data preparation, training, and evaluation. This staleness risk is a
genuine, ongoing cost that needs to be weighed against fine-tuning's
benefits for a specific use case, not merely a one-time setup cost to
budget for once.

## Why fine-tuning genuinely is the right call for a specific, narrower
set of cases — the lesson closes by being fair to the tool, not just
critical of misuse

Fine-tuning is justified when a behavior needs to be applied with high
consistency across a very large volume of requests, and prompting has
demonstrably plateaued below an acceptable quality bar after genuine,
serious iteration; when a narrow, specialized domain judgment is
expensive to re-specify in every single prompt and is instead worth
baking into the model's weights directly; or when a smaller fine-tuned
model can replace a larger, more expensive general-purpose model for a
narrow task, at acceptable quality, producing a genuine per-request
cost or latency win at scale. Recognizing these genuine cases alongside
the common misuse pattern is what makes this lesson's framework
balanced rather than simply anti-fine-tuning.`,

    contentHi: `## Fine-tuning ka total cost "training run khud" se kaafi aage kyun extend karta hai, aur cost estimates yahan sabse commonly galat kyun ho jaate hain

Teams frequently fine-tuning ke liye budget banate hain sirf training
compute cost estimate karke, jo aksar actual total mein sabse chhota
line item hota hai. Ek genuinely representative, well-labeled training
dataset assemble karna aksar project ka sabse time-consuming hissa hai
— quality training data typically already ek ready-to-use form mein
exist nahi karti, aur ise achhi tarah prepare karna apne aap mein ek
substantial undertaking hai. Training ko usually multiple runs chahiye
hote hain (hyperparameter adjustments, dataset problems fix karna jo
sirf initial results dekhne ke baad discover hote hain), ek single
clean pass nahi. Ek genuine baseline ke against rigorous evaluation
(neeche further discussed) real additional effort add karti hai. Aur
ongoing maintenance — is process ka zyada tar re-run karna jab bhi
underlying task requirements shift hoti hain — ek genuinely recurring
cost hai jise ek prompt edit ya ek RAG index update zyada tar avoid
karte hain.

## Ek fine-tuned model ko ek weak ya unoptimized prompt baseline ke against compare karna ek systematically misleading result kyun produce karta hai

Ek fine-tuning project jo apne result ko ek first-draft, unoptimized
prompt ke against compare karke success declare karta hai ek strawman
ke against compare kar raha hai — honest question ye nahi hai ki "kya
fine-tuning ne KOI prompt ko beat kiya," ye hai ki "kya fine-tuning ne
BEST prompt ko beat kiya jo genuinely real, serious effort se achievable
hai." Yahi exactly wajah hai Module 14 ki evaluation discipline — ek
fixed eval dataset, consistent success criteria, har approach pe
identically applied jo compare kiya ja raha hai — yahan non-negotiable
hai: iske bina, ek team khud ko convince kar sakti hai ki ek expensive
fine-tuning investment worthwhile thi jab prompt engineering pe spend
kiya gaya us effort ka ek fraction gap ka zyada tar ya sab close kar
sakta tha.

## Ek fine-tuned model ki staleness ek prompt ya ek RAG index se structurally alag kism ka maintenance burden kyun hai

Ek prompt ko minutes mein edit aur redeploy kiya ja sakta hai jab
requirements badalti hain. Ek RAG index (Modules 7-8) naturally
updated information reflect karta hai jaise iske underlying documents
update hote hain, koi retraining ke bina. Ek fine-tuned model ka
learned behavior comparatively training time pe frozen hai — jab task
ki requirements shift hoti hain, model ko us change ke baare mein tab
tak pata nahi chalta jab tak ye data preparation, training, aur
evaluation ka ek aur round guzarta hai. Ye staleness risk ek genuine,
ongoing cost hai jise fine-tuning ke benefits ke against weigh karna
chahiye ek specific use case ke liye, sirf ek one-time setup cost nahi
jise ek baar budget karna hai.

## Fine-tuning genuinely ek specific, narrower set of cases ke liye correct call kyun hai — lesson tool ke saath fair hote hue close hota hai, sirf misuse pe critical hone ke bajaye

Fine-tuning justified hai jab ek behavior ko high consistency ke saath
apply karna chahiye ek bahut large volume of requests ke across, aur
prompting ne demonstrably plateau kiya hai ek acceptable quality bar
se neeche genuine, serious iteration ke baad; jab ek narrow,
specialized domain judgment har single prompt mein re-specify karna
expensive hai aur uske bajaye model ke weights mein directly bake
karna worth hai; ya jab ek smaller fine-tuned model ek larger, zyada
expensive general-purpose model ko replace kar sakta hai ek narrow
task ke liye, acceptable quality pe, ek genuine per-request cost ya
latency win produce karte hue scale pe. In genuine cases ko common
misuse pattern ke saath recognize karna wo hai jo is lesson ke
framework ko balanced banata hai, sirf anti-fine-tuning nahi.`,

    examples: [
      {
        title: 'A total-cost-of-ownership estimator and a rigorous baseline comparison function',
        titleHi: 'Ek total-cost-of-ownership estimator aur ek rigorous baseline comparison function',
        codeJs: `function estimateFineTuningTCO({ datasetPrepWeeks, trainingRunsNeeded, expectedRequirementChangesPerYear }) {
  const dataPrepCost = datasetPrepWeeks * 40; // engineer-hours, rough estimate
  const trainingCost = trainingRunsNeeded * 8; // hours of iteration per run
  const annualMaintenanceCost = expectedRequirementChangesPerYear * (datasetPrepWeeks * 40 + trainingRunsNeeded * 8);

  return {
    oneTimeSetupHours: dataPrepCost + trainingCost,
    recurringAnnualHours: annualMaintenanceCost,
    // The recurring cost is often the part teams forget to budget for
    // — a fine-tuned model isn't a "set it and forget it" asset
  };
}

async function compareApproachesRigorously(evalDataset, bestEngineeredPrompt, fineTunedModel) {
  // Both approaches are run against the SAME eval dataset with the
  // SAME success criteria — Module 14's discipline applied directly
  const promptResults = await runEval(evalDataset, bestEngineeredPrompt);
  const fineTunedResults = await runEval(evalDataset, fineTunedModel);

  const improvement = fineTunedResults.accuracy - promptResults.accuracy;
  const worthIt = improvement > 0.1; // a threshold reflecting fine-tuning's
                                       // real ongoing maintenance cost —
                                       // a marginal gain rarely clears it

  return { promptAccuracy: promptResults.accuracy, fineTunedAccuracy: fineTunedResults.accuracy, improvement, worthIt };
}`,
        codeTs: `interface TCOInput {
  datasetPrepWeeks: number;
  trainingRunsNeeded: number;
  expectedRequirementChangesPerYear: number;
}

function estimateFineTuningTCO({ datasetPrepWeeks, trainingRunsNeeded, expectedRequirementChangesPerYear }: TCOInput) {
  const dataPrepCost = datasetPrepWeeks * 40; // engineer-hours, rough estimate
  const trainingCost = trainingRunsNeeded * 8; // hours of iteration per run
  const annualMaintenanceCost = expectedRequirementChangesPerYear * (datasetPrepWeeks * 40 + trainingRunsNeeded * 8);

  return {
    oneTimeSetupHours: dataPrepCost + trainingCost,
    recurringAnnualHours: annualMaintenanceCost,
    // The recurring cost is often the part teams forget to budget for
    // — a fine-tuned model isn't a "set it and forget it" asset
  };
}

interface EvalResult {
  accuracy: number;
}

async function compareApproachesRigorously(
  evalDataset: unknown,
  bestEngineeredPrompt: unknown,
  fineTunedModel: unknown,
) {
  // Both approaches are run against the SAME eval dataset with the
  // SAME success criteria — Module 14's discipline applied directly
  const promptResults: EvalResult = await runEval(evalDataset, bestEngineeredPrompt);
  const fineTunedResults: EvalResult = await runEval(evalDataset, fineTunedModel);

  const improvement = fineTunedResults.accuracy - promptResults.accuracy;
  const worthIt = improvement > 0.1; // a threshold reflecting fine-tuning's
                                       // real ongoing maintenance cost —
                                       // a marginal gain rarely clears it

  return { promptAccuracy: promptResults.accuracy, fineTunedAccuracy: fineTunedResults.accuracy, improvement, worthIt };
}`,
        code: `const tco = estimateFineTuningTCO({ datasetPrepWeeks: 3, trainingRunsNeeded: 4, expectedRequirementChangesPerYear: 6 });
// { oneTimeSetupHours: 152, recurringAnnualHours: 912 }`,
        output:
          "The TCO estimator surfaces that a fine-tuning project expecting 6 requirement changes per year would spend roughly 912 engineer-hours annually on re-training alone — a recurring cost easy to miss when only the one-time setup cost is budgeted for. The comparison function requires a genuine improvement margin (not just any positive number) before declaring fine-tuning worthwhile.",
        explain:
          "Both functions operationalize this lesson's core caution: fine-tuning's real cost includes a recurring maintenance burden most initial estimates omit, and a fine-tuning project should only be judged a success against a genuinely strong prompt baseline with a margin large enough to justify that ongoing cost.",
        explainHi:
          "Dono functions is lesson ki core caution ko operationalize karte hain: fine-tuning ki real cost mein ek recurring maintenance burden include hai jise zyada tar initial estimates omit karte hain, aur ek fine-tuning project ko sirf ek genuinely strong prompt baseline ke against success ki tarah judge karna chahiye ek margin ke saath jo itna bada ho ki us ongoing cost ko justify kare.",
      },
    ],

    mistakes: [
      {
        wrong: `// Declaring fine-tuning a success by comparing against a lazy,
// unoptimized prompt that was never given a real chance
async function evaluateFineTuningWrong() {
  const lazyPrompt = 'Classify this document.'; // a first-draft, minimal prompt
  const promptResults = await runEval(evalDataset, lazyPrompt);
  const fineTunedResults = await runEval(evalDataset, fineTunedModel);

  // This "improvement" is likely mostly attributable to the prompt
  // being weak, not to fine-tuning being genuinely necessary
  return fineTunedResults.accuracy > promptResults.accuracy;
}`,
        right: `// Comparing against the BEST achievable prompt, with real engineering
// effort invested, before crediting the improvement to fine-tuning
async function evaluateFineTuningRight() {
  const bestPrompt = \`You are an expert document classifier. Categories: [...].
Examples: [3-5 few-shot examples covering edge cases]
Think step by step, then output the category as JSON: {"category": "..."}\`;

  const promptResults = await runEval(evalDataset, bestPrompt);
  const fineTunedResults = await runEval(evalDataset, fineTunedModel);

  const improvement = fineTunedResults.accuracy - promptResults.accuracy;
  // Only a genuine, substantial improvement over the BEST prompt
  // justifies fine-tuning's ongoing maintenance cost
  return { improvement, worthIt: improvement > 0.1 };
}`,
        why: "Comparing a fine-tuned model against a weak, unoptimized prompt produces a systematically inflated sense of fine-tuning's value — the honest comparison is against the best prompt genuinely achievable with real effort, since that's the actual alternative fine-tuning needs to beat to justify its higher, ongoing cost.",
        whyHi:
          "Ek fine-tuned model ko ek weak, unoptimized prompt ke against compare karna fine-tuning ki value ka ek systematically inflated sense produce karta hai — honest comparison us best prompt ke against hai jo genuinely real effort se achievable hai, kyunki wahi actual alternative hai jise fine-tuning ko beat karna chahiye apni higher, ongoing cost justify karne ke liye.",
      },
    ],

    realWorld: [
      {
        en: "A production team's fine-tuning project was cancelled mid-way after a rigorous baseline comparison (run only after a stakeholder insisted on it) revealed that their 'best' prompt had never actually been iterated on seriously — once a properly engineered prompt with few-shot examples was tested, it matched the partially-trained fine-tuned model's accuracy at a fraction of the ongoing cost.",
        hi: 'Ek production team ka fine-tuning project mid-way pe cancel kar diya gaya ek rigorous baseline comparison ke baad (jo sirf ek stakeholder ke insist karne ke baad run kiya gaya) ye reveal karte hue ki unka \'best\' prompt kabhi actually seriously iterate nahi kiya gaya tha — ek baar ek properly engineered prompt few-shot examples ke saath test kiya gaya, isne partially-trained fine-tuned model ki accuracy match ki ongoing cost ke ek fraction pe.',
      },
    ],

    interviewQA: [
      {
        q: "What costs beyond the training run itself does a fine-tuning project's total cost of ownership typically include, and which of these is most commonly underestimated?",
        qHi: 'Training run khud se aage kaunse costs ek fine-tuning project ki total cost of ownership typically include karti hai, aur inme se kaunsa sabse commonly underestimate kiya jaata hai?',
        a: "Data preparation (assembling and cleaning a representative dataset), multiple training runs (hyperparameter tuning, fixing discovered dataset issues), rigorous evaluation, and ongoing maintenance (re-running much of the process whenever requirements change) all add real cost beyond the training compute itself. Data preparation and ongoing maintenance are the most commonly underestimated, since teams frequently budget only for the training run.",
        aHi: 'Data preparation (ek representative dataset assemble aur clean karna), multiple training runs (hyperparameter tuning, discovered dataset issues fix karna), rigorous evaluation, aur ongoing maintenance (jab bhi requirements badalti hain process ka zyada tar re-run karna) sab training compute khud se aage real cost add karte hain. Data preparation aur ongoing maintenance sabse commonly underestimate kiye jaate hain, kyunki teams frequently sirf training run ke liye budget banate hain.',
      },
      {
        q: "Why is comparing a fine-tuned model against an unoptimized, first-draft prompt a methodologically flawed way to justify fine-tuning?",
        qHi: 'Ek fine-tuned model ko ek unoptimized, first-draft prompt ke against compare karna fine-tuning ko justify karne ka ek methodologically flawed tareeka kyun hai?',
        a: "The honest question is whether fine-tuning beats the best prompt genuinely achievable with real engineering effort, not whether it beats some arbitrary weak prompt. Comparing against an unoptimized baseline systematically inflates the apparent benefit of fine-tuning, since much of the 'improvement' may simply reflect the baseline never having been given a fair chance — this is why Module 14's rigorous, consistent evaluation discipline is essential here.",
        aHi: 'Honest question ye hai ki kya fine-tuning us best prompt ko beat karti hai jo genuinely real engineering effort se achievable hai, ye nahi ki kya ye kisi arbitrary weak prompt ko beat karti hai. Ek unoptimized baseline ke against compare karna fine-tuning ke apparent benefit ko systematically inflate karta hai, kyunki "improvement" ka zyada tar simply reflect kar sakta hai ki baseline ko kabhi fair chance nahi diya gaya — yahi wajah hai Module 14 ki rigorous, consistent evaluation discipline yahan essential hai.',
      },
    ],

    exercises: [
      {
        task: "A team reports their fine-tuned model achieves 94% accuracy on a classification task and concludes the project was a clear success, without mentioning what accuracy their best prompt-based approach achieved. Using this lesson's framework, explain what critical piece of information is missing from this report, and why the 94% figure alone cannot support their conclusion.",
        taskHi: 'Ek team report karti hai ki unka fine-tuned model ek classification task pe 94% accuracy achieve karta hai aur conclude karti hai ki project ek clear success tha, ye mention kiye bina ki unka best prompt-based approach kaunsi accuracy achieve karta. Is lesson ke framework use karke, explain karo ki is report se kaunsi critical piece of information missing hai, aur 94% figure akela unke conclusion ko support kyun nahi kar sakta.',
        hint: "Ask what the comparison point was. Without knowing what a genuinely well-engineered prompt would have achieved on the same evaluation set, is 94% impressive, unimpressive, or simply unknowable in relative terms?",
        hintHi: 'Pucho ki comparison point kya tha. Ye jaane bina ki ek genuinely well-engineered prompt wahi evaluation set pe kya achieve karta, kya 94% impressive hai, unimpressive hai, ya simply relative terms mein unknowable hai?',
      },
    ],

    keyTakeaways: [
      "Fine-tuning's real cost extends well beyond the training run itself — data preparation, multiple training runs, rigorous evaluation, and ongoing maintenance as requirements change all add substantial, often underestimated cost.",
      "Comparing a fine-tuned model against a weak, unoptimized prompt baseline systematically inflates fine-tuning's apparent value — the honest comparison is against the best prompt genuinely achievable with real effort.",
      "A fine-tuned model's staleness when requirements change is a structurally different, more expensive maintenance burden than a prompt edit or an automatically-current RAG index.",
      "Fine-tuning is genuinely justified in narrower cases: high-volume behavior consistency prompting has demonstrably failed to achieve, domain judgment too expensive to re-specify per-prompt, or a smaller fine-tuned model replacing a larger one for cost/latency at scale.",
    ],
    keyTakeawaysHi: [
      'Fine-tuning ki real cost training run khud se kaafi aage extend karti hai — data preparation, multiple training runs, rigorous evaluation, aur requirements badalne pe ongoing maintenance sab substantial, aksar underestimated cost add karte hain.',
      'Ek fine-tuned model ko ek weak, unoptimized prompt baseline ke against compare karna fine-tuning ki apparent value ko systematically inflate karta hai — honest comparison us best prompt ke against hai jo genuinely real effort se achievable hai.',
      'Ek fine-tuned model ki staleness jab requirements badalti hain ek structurally different, zyada expensive maintenance burden hai ek prompt edit ya ek automatically-current RAG index se.',
      'Fine-tuning genuinely narrower cases mein justified hai: high-volume behavior consistency jise prompting demonstrably achieve karne mein fail hui, domain judgment jo per-prompt re-specify karna bahut expensive hai, ya ek smaller fine-tuned model jo ek larger wale ko replace karta hai cost/latency ke liye scale pe.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-finetuning-workflow-conceptual',
    title: 'The Fine-Tuning Workflow at a Conceptual Level',
    titleHi: 'The Fine-Tuning Workflow Ek Conceptual Level Pe',
    description:
      "Closing this module: once Lessons 1-2 have genuinely justified fine-tuning for a specific use case, this lesson walks through what the actual workflow involves — dataset preparation, running the training job, and evaluation — at a conceptual level applicable across providers.",
    descriptionHi:
      'Is module ko close karte hue: ek baar Lessons 1-2 ne genuinely ek specific use case ke liye fine-tuning ko justify kar diya, ye lesson walk through karta hai ki actual workflow mein kya involve hai — dataset preparation, training job run karna, aur evaluation — ek conceptual level pe jo providers ke across applicable hai.',
    difficulty: 'HARD',
    duration: 25,
    order: 3,

    analogy: {
      en: "**Training a new specialist by showing them a large, carefully curated set of real worked examples of the exact judgment calls they'll need to make, rather than by giving them a general textbook and hoping they generalize correctly.** A specialist being trained to make consistent judgment calls (an insurance claims adjuster, a content moderator handling nuanced edge cases) doesn't primarily learn from abstract textbook principles — the training that actually sticks is reviewing hundreds of REAL, WORKED examples: here is a specific case, here is exactly what the correct judgment was, and here is why. If the training examples are sloppy, inconsistent, or don't genuinely represent the range of cases the specialist will actually encounter, the specialist learns a distorted or incomplete version of the judgment they were supposed to acquire — garbage in, garbage out, in a very literal sense. Fine-tuning works on exactly this principle: the model doesn't learn from abstract instructions the way a prompt provides them, it learns from a curated set of real input-output example pairs, and the QUALITY, CONSISTENCY, and REPRESENTATIVENESS of those examples is the single biggest determinant of whether the resulting fine-tuned behavior is actually good — which is precisely why dataset preparation, not the training run itself, is usually where a fine-tuning project's real effort and risk concentrate.",
      hi: 'ek naye specialist ko train karna unhe exact judgment calls ke real worked examples ka ek bada, carefully curated set dikhakar jo unhe karne honge, ek general textbook dekar aur hope karke ki wo correctly generalize karenge ke bajaye. Ek specialist jo consistent judgment calls banane ke liye trained ho raha hai (ek insurance claims adjuster, ek content moderator jo nuanced edge cases handle karta hai) primarily abstract textbook principles se nahi seekhta — training jo actually stick karti hai hundreds of REAL, WORKED examples review karna hai: yahan ek specific case hai, yahan exactly wo hai jo correct judgment tha, aur yahan wajah hai kyun. Agar training examples sloppy, inconsistent hain, ya genuinely un cases ki range represent nahi karte jinhe specialist actually encounter karega, specialist us judgment ka ek distorted ya incomplete version seekhta hai jise unhe acquire karna tha — garbage in, garbage out, ek very literal sense mein. Fine-tuning exactly is principle pe kaam karti hai: model abstract instructions se nahi seekhta jaise ek prompt unhe provide karta hai, ye ek curated set of real input-output example pairs se seekhta hai, aur un examples ki QUALITY, CONSISTENCY, aur REPRESENTATIVENESS single sabse bada determinant hai ki kya resulting fine-tuned behavior actually achha hai — yahi exactly wajah hai dataset preparation, training run khud nahi, usually wo jagah hai jahan ek fine-tuning project ka real effort aur risk concentrate hote hain.',
    },

    simple: `**The four-stage conceptual workflow, applicable across providers
(OpenAI, Anthropic, or open-source fine-tuning tooling):**

\`\`\`
1. DATASET PREPARATION — assembling representative input-output
   example pairs, the exact format the model should learn to produce.

2. FORMATTING & VALIDATION — converting examples into the provider's
   required format (typically JSONL — one JSON example per line) and
   validating structure before submitting for training.

3. THE TRAINING RUN — submitting the dataset, choosing a base model
   to fine-tune, and monitoring the job (loss curves, training
   progress) until it completes.

4. EVALUATION — testing the fine-tuned model against a held-out set
   NOT used in training, using the SAME rigorous discipline Module 14
   established for evaluating any AI system.
\`\`\`

**Stage 1 & 2 in code — this is where the real effort and risk
actually concentrate, per this module's Lesson 2:**

\`\`\`ts
interface TrainingExample {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
}

function buildTrainingExample(userQuery: string, idealResponse: string): TrainingExample {
  return {
    messages: [
      { role: 'system', content: 'You are a customer support agent for Acme Corp.' },
      { role: 'user', content: userQuery },
      { role: 'assistant', content: idealResponse }, // the "correct answer"
      // the model should learn to produce for inputs LIKE this one
    ],
  };
}

function validateTrainingDataset(examples: TrainingExample[]) {
  const issues: string[] = [];
  if (examples.length < 50) {
    issues.push('Dataset likely too small — most providers recommend at least 50-100 examples minimum');
  }
  const emptyResponses = examples.filter((e) =>
    e.messages.some((m) => m.role === 'assistant' && m.content.trim() === '')
  );
  if (emptyResponses.length > 0) {
    issues.push(\`\${emptyResponses.length} examples have an empty assistant response\`);
  }
  return issues;
}
\`\`\`

**Stage 3 in code — submitting and monitoring a training job:**

\`\`\`ts
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function submitFineTuningJob(trainingFilePath: string, baseModel: string) {
  const file = await openai.files.create({
    file: fs.createReadStream(trainingFilePath),
    purpose: 'fine-tune',
  });

  const job = await openai.fineTuning.jobs.create({
    training_file: file.id,
    model: baseModel,
  });

  return job.id; // used to poll job status until training completes
}

async function pollJobStatus(jobId: string) {
  const job = await openai.fineTuning.jobs.retrieve(jobId);
  // status moves through: validating_files -> queued -> running -> succeeded/failed
  return { status: job.status, fineTunedModel: job.fine_tuned_model };
}
\`\`\`

**Stage 4 — why evaluation here is IDENTICAL in discipline to Module
14's general evaluation framework, not a fine-tuning-specific
afterthought:**

\`\`\`ts
async function evaluateFineTunedModel(fineTunedModelId: string, heldOutEvalSet: TrainingExample[]) {
  // The held-out set was NEVER shown during training — this is the
  // same train/test separation discipline as any ML evaluation,
  // and the same golden-dataset stability principle Module 14 covers
  let correct = 0;
  for (const example of heldOutEvalSet) {
    const response = await openai.chat.completions.create({
      model: fineTunedModelId,
      messages: example.messages.slice(0, -1), // everything except the expected answer
    });
    const actual = response.choices[0].message.content;
    const expected = example.messages[example.messages.length - 1].content;
    if (isAcceptableMatch(actual, expected)) correct++; // Module 14's
    // "acceptable output" criteria, not brittle exact-string matching
  }
  return { accuracy: correct / heldOutEvalSet.length };
}
\`\`\`

**Why the held-out evaluation set must be genuinely separate from the
training data — a train/test contamination mistake that would
silently produce a falsely optimistic accuracy number:**

\`\`\`
If any example used to evaluate the fine-tuned model was also used
during training, the reported accuracy reflects memorization, not
generalization to genuinely new inputs — a fine-tuning-specific
instance of Module 14's broader point that a stable, untouched golden
dataset is what makes an evaluation trustworthy.
\`\`\`

**How this lesson closes Module 16:** Lesson 1 established when to
reach for fine-tuning at all; Lesson 2 established fine-tuning's real
economics and the discipline of a fair baseline comparison; this
lesson shows that once those two lessons have genuinely justified the
decision, the actual workflow is a disciplined, four-stage process
where dataset quality — not the training run's mechanics — is the
dominant factor determining whether the resulting model is actually
good.`,

    simpleHi: `**Four-stage conceptual workflow, providers ke across applicable
(OpenAI, Anthropic, ya open-source fine-tuning tooling):**

\`\`\`
1. DATASET PREPARATION — representative input-output example pairs
   assemble karna, exact format jo model ko produce karna seekhna
   chahiye.

2. FORMATTING & VALIDATION — examples ko provider ke required format
   mein convert karna (typically JSONL — ek line pe ek JSON example)
   aur training ke liye submit karne se pehle structure validate
   karna.

3. THE TRAINING RUN — dataset submit karna, fine-tune karne ke liye
   ek base model choose karna, aur job monitor karna (loss curves,
   training progress) jab tak ye complete na ho jaaye.

4. EVALUATION — fine-tuned model ko ek held-out set ke against test
   karna jo training mein use NAHI kiya gaya, wahi rigorous
   discipline use karke jo Module 14 ne kisi bhi AI system evaluate
   karne ke liye establish ki.
\`\`\`

**Stage 1 & 2 code mein — yahan real effort aur risk actually
concentrate hote hain, is module ke Lesson 2 ke hisaab se:**

\`\`\`ts
interface TrainingExample {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
}

function buildTrainingExample(userQuery: string, idealResponse: string): TrainingExample {
  return {
    messages: [
      { role: 'system', content: 'You are a customer support agent for Acme Corp.' },
      { role: 'user', content: userQuery },
      { role: 'assistant', content: idealResponse }, // "correct answer"
      // jo model ko is jaisi inputs ke liye produce karna seekhna chahiye
    ],
  };
}

function validateTrainingDataset(examples: TrainingExample[]) {
  const issues: string[] = [];
  if (examples.length < 50) {
    issues.push('Dataset likely too small — most providers recommend at least 50-100 examples minimum');
  }
  const emptyResponses = examples.filter((e) =>
    e.messages.some((m) => m.role === 'assistant' && m.content.trim() === '')
  );
  if (emptyResponses.length > 0) {
    issues.push(\`\${emptyResponses.length} examples have an empty assistant response\`);
  }
  return issues;
}
\`\`\`

**Stage 3 code mein — ek training job submit aur monitor karna:**

\`\`\`ts
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function submitFineTuningJob(trainingFilePath: string, baseModel: string) {
  const file = await openai.files.create({
    file: fs.createReadStream(trainingFilePath),
    purpose: 'fine-tune',
  });

  const job = await openai.fineTuning.jobs.create({
    training_file: file.id,
    model: baseModel,
  });

  return job.id; // job status poll karne ke liye use kiya jaata hai jab tak training complete na ho
}

async function pollJobStatus(jobId: string) {
  const job = await openai.fineTuning.jobs.retrieve(jobId);
  // status move karta hai: validating_files -> queued -> running -> succeeded/failed
  return { status: job.status, fineTunedModel: job.fine_tuned_model };
}
\`\`\`

**Stage 4 — evaluation yahan discipline mein Module 14 ke general
evaluation framework se IDENTICAL kyun hai, ek fine-tuning-specific
afterthought nahi:**

\`\`\`ts
async function evaluateFineTunedModel(fineTunedModelId: string, heldOutEvalSet: TrainingExample[]) {
  // Held-out set training ke dauran KABHI nahi dikhaya gaya — ye wahi
  // train/test separation discipline hai kisi bhi ML evaluation ki
  // tarah, aur wahi golden-dataset stability principle jo Module 14
  // cover karta hai
  let correct = 0;
  for (const example of heldOutEvalSet) {
    const response = await openai.chat.completions.create({
      model: fineTunedModelId,
      messages: example.messages.slice(0, -1), // expected answer ke alawa sab kuch
    });
    const actual = response.choices[0].message.content;
    const expected = example.messages[example.messages.length - 1].content;
    if (isAcceptableMatch(actual, expected)) correct++; // Module 14 ka
    // "acceptable output" criteria, brittle exact-string matching nahi
  }
  return { accuracy: correct / heldOutEvalSet.length };
}
\`\`\`

**Held-out evaluation set ko training data se genuinely separate
hona kyun zaroori hai — ek train/test contamination mistake jo
silently ek falsely optimistic accuracy number produce karegi:**

\`\`\`
Agar fine-tuned model ko evaluate karne ke liye use kiya gaya koi bhi
example training ke dauran bhi use kiya gaya tha, reported accuracy
memorization reflect karti hai, genuinely naye inputs tak
generalization nahi — Module 14 ke broader point ka ek fine-tuning-
specific instance ki ek stable, untouched golden dataset wo hai jo ek
evaluation ko trustworthy banata hai.
\`\`\`

**Ye lesson Module 16 ko kaise close karta hai:** Lesson 1 ne
establish kiya kab fine-tuning tak bilkul reach karna hai; Lesson 2 ne
fine-tuning ki real economics aur ek fair baseline comparison ki
discipline establish ki; ye lesson dikhata hai ki ek baar in do
lessons ne genuinely decision ko justify kar diya, actual workflow ek
disciplined, four-stage process hai jahan dataset quality — training
run ki mechanics nahi — dominant factor hai ye determine karne mein ki
resulting model actually achha hai.`,

    content: `## Why dataset preparation, not the training run's mechanics, is
where a fine-tuning project's real effort and risk concentrate

Fine-tuning doesn't teach a model from abstract instructions the way a
prompt does — it teaches from a curated set of real input-output
example pairs, and the model learns to generalize the pattern those
examples demonstrate. This means the quality, consistency, and
genuine representativeness of the training dataset is the dominant
factor determining whether the resulting behavior is actually good —
sloppy, inconsistent, or unrepresentative examples produce a model
that has learned a distorted or incomplete version of the intended
behavior, regardless of how well the training run itself is executed
mechanically. This is precisely why this lesson's code examples devote
more attention to dataset construction and validation than to the
training-job submission itself.

## Why validating a training dataset before submission (size, format,
completeness) catches problems far more cheaply than discovering them
after a training run completes

A dataset that's too small, has malformed entries, or contains a
meaningful fraction of empty or low-quality examples will produce a
poor fine-tuned model — but this is far cheaper to catch and fix
before submitting a training job than after waiting for a run to
complete only to discover the result is unusable. Basic, automatable
validation (checking minimum example count, checking for
empty/malformed fields, spot-checking for consistency) is a direct,
practical way to avoid wasting a training run's real time and compute
cost on a dataset that was never going to produce good results.

## Why the training job itself, mechanically, is the most
provider-standardized part of this entire workflow

Submitting a validated dataset, selecting a base model, and monitoring
job status through stages like queued, running, and succeeded/failed
is a comparatively mechanical, well-documented process across major
providers — this is precisely why it's NOT where this lesson concentrates
its attention, in direct contrast to dataset preparation, which varies
enormously in difficulty and quality based on the specific task and how
carefully the team executes it.

## Why evaluating a fine-tuned model demands exactly the same
discipline Module 14 established for evaluating any AI system, with
one fine-tuning-specific addition

The held-out evaluation set must genuinely never have been used during
training — a subtle but critical requirement, since any overlap between
training and evaluation data produces an inflated accuracy number that
reflects memorization of specific examples rather than genuine
generalization to new inputs the model hasn't seen. Beyond this
fine-tuning-specific train/test separation requirement, everything else
Module 14 established applies unchanged: acceptable-output criteria
rather than brittle exact-match comparison, a stable dataset used
consistently across comparisons, and — connecting directly back to
Lesson 2 — the same evaluation set and criteria applied to both the
fine-tuned model and the best achievable prompt baseline, so the
comparison that ultimately justified this entire workflow remains fair.

## How this lesson completes Module 16's overall arc

Lesson 1 established the decision tree for choosing fine-tuning at
all; Lesson 2 established the real economics and the rigor a fair
baseline comparison requires. This lesson shows that once those two
lessons have genuinely pointed toward fine-tuning, the workflow itself
is a disciplined four-stage process — and that the actual determinant
of success is overwhelmingly dataset quality, not the comparatively
standardized mechanics of submitting and monitoring the training job.`,

    contentHi: `## Dataset preparation, training run ki mechanics nahi, kyun wo jagah hai jahan ek fine-tuning project ka real effort aur risk concentrate hote hain

Fine-tuning ek model ko abstract instructions se nahi sikhati jaise ek
prompt karta hai — ye ek curated set of real input-output example
pairs se sikhati hai, aur model us pattern ko generalize karna seekhta
hai jo wo examples demonstrate karte hain. Iska matlab hai training
dataset ki quality, consistency, aur genuine representativeness
dominant factor hai ye determine karne mein ki resulting behavior
actually achha hai — sloppy, inconsistent, ya unrepresentative
examples ek model produce karte hain jisne intended behavior ka ek
distorted ya incomplete version seekha hai, chahe training run khud
mechanically kitna bhi achhe se execute kiya gaya ho. Yahi exactly
wajah hai is lesson ke code examples dataset construction aur
validation ko training-job submission khud se zyada attention dete
hain.

## Submission se pehle ek training dataset validate karna (size, format, completeness) kyun problems ko ek training run complete hone ke baad discover karne se kaafi zyada cheaply catch karta hai

Ek dataset jo bahut chhota hai, malformed entries rakhta hai, ya empty
ya low-quality examples ka ek meaningful fraction contain karta hai
ek poor fine-tuned model produce karega — par ise ek training job
submit karne se pehle catch aur fix karna kaafi zyada cheap hai ek run
complete hone ka wait karne se sirf ye discover karne ke liye ki
result unusable hai. Basic, automatable validation (minimum example
count check karna, empty/malformed fields ke liye check karna,
consistency ke liye spot-check karna) ek direct, practical tareeka
hai ek training run ke real time aur compute cost ko ek dataset pe
waste karne se bachne ka jo kabhi achhe results produce karne wala
nahi tha.

## Training job khud, mechanically, is poore workflow ka sabse provider-standardized part kyun hai

Ek validated dataset submit karna, ek base model select karna, aur
job status ko stages ke through monitor karna jaise queued, running,
aur succeeded/failed comparatively ek mechanical, well-documented
process hai major providers ke across — yahi exactly wajah hai ye NAHI
hai jahan ye lesson apna attention concentrate karta hai, dataset
preparation ke direct contrast mein, jo enormously vary karta hai
difficulty aur quality mein specific task aur team kitni carefully
execute karti hai iske basis pe.

## Ek fine-tuned model ko evaluate karna exactly wahi discipline kyun demand karta hai jise Module 14 ne kisi bhi AI system evaluate karne ke liye establish kiya, ek fine-tuning-specific addition ke saath

Held-out evaluation set ko genuinely training ke dauran kabhi use nahi
kiya jaana chahiye — ek subtle par critical requirement, kyunki
training aur evaluation data ke beech koi bhi overlap ek inflated
accuracy number produce karta hai jo specific examples ki memorization
reflect karta hai un naye inputs tak genuine generalization nahi
jinhe model ne nahi dekha. Is fine-tuning-specific train/test
separation requirement se aage, baaki sab kuch jo Module 14 ne
establish kiya unchanged apply hota hai: acceptable-output criteria
brittle exact-match comparison ke bajaye, ek stable dataset jo
comparisons ke across consistently use kiya jaata hai, aur — directly
Lesson 2 se connect karte hue — wahi evaluation set aur criteria dono
fine-tuned model aur best achievable prompt baseline pe applied, taaki
wo comparison jo ultimately is poore workflow ko justify karta hai
fair rahe.

## Ye lesson Module 16 ke overall arc ko kaise complete karta hai

Lesson 1 ne fine-tuning ko bilkul choose karne ki decision tree
establish ki; Lesson 2 ne real economics aur ek fair baseline
comparison ki rigor establish ki jo chahiye. Ye lesson dikhata hai ki
ek baar in do lessons ne genuinely fine-tuning ki taraf point kar
diya, workflow khud ek disciplined four-stage process hai — aur actual
determinant of success overwhelmingly dataset quality hai, training
job submit aur monitor karne ki comparatively standardized mechanics
nahi.`,

    examples: [
      {
        title: 'An end-to-end fine-tuning pipeline: dataset validation, submission, and held-out evaluation',
        titleHi: 'Ek end-to-end fine-tuning pipeline: dataset validation, submission, aur held-out evaluation',
        codeJs: `import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function validateDataset(examples) {
  const issues = [];
  if (examples.length < 50) issues.push('Too few examples (minimum ~50-100 recommended)');
  const malformed = examples.filter((e) => !e.messages || e.messages.length < 2);
  if (malformed.length > 0) issues.push(\`\${malformed.length} malformed examples\`);
  return issues;
}

async function runFineTuningPipeline(allExamples, baseModel) {
  // Split into training and held-out evaluation sets BEFORE anything
  // else — this separation must happen first to avoid contamination
  const splitIndex = Math.floor(allExamples.length * 0.85);
  const trainingExamples = allExamples.slice(0, splitIndex);
  const heldOutExamples = allExamples.slice(splitIndex);

  const issues = validateDataset(trainingExamples);
  if (issues.length > 0) throw new Error(\`Dataset validation failed: \${issues.join(', ')}\`);

  const jsonlContent = trainingExamples.map((e) => JSON.stringify(e)).join('\\n');
  fs.writeFileSync('training_data.jsonl', jsonlContent);

  const file = await openai.files.create({
    file: fs.createReadStream('training_data.jsonl'),
    purpose: 'fine-tune',
  });
  const job = await openai.fineTuning.jobs.create({ training_file: file.id, model: baseModel });

  return { jobId: job.id, heldOutExamples }; // heldOutExamples reserved for evaluation later
}`,
        codeTs: `import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface TrainingExample {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
}

function validateDataset(examples: TrainingExample[]): string[] {
  const issues: string[] = [];
  if (examples.length < 50) issues.push('Too few examples (minimum ~50-100 recommended)');
  const malformed = examples.filter((e) => !e.messages || e.messages.length < 2);
  if (malformed.length > 0) issues.push(\`\${malformed.length} malformed examples\`);
  return issues;
}

async function runFineTuningPipeline(allExamples: TrainingExample[], baseModel: string) {
  // Split into training and held-out evaluation sets BEFORE anything
  // else — this separation must happen first to avoid contamination
  const splitIndex = Math.floor(allExamples.length * 0.85);
  const trainingExamples = allExamples.slice(0, splitIndex);
  const heldOutExamples = allExamples.slice(splitIndex);

  const issues = validateDataset(trainingExamples);
  if (issues.length > 0) throw new Error(\`Dataset validation failed: \${issues.join(', ')}\`);

  const jsonlContent = trainingExamples.map((e) => JSON.stringify(e)).join('\\n');
  fs.writeFileSync('training_data.jsonl', jsonlContent);

  const file = await openai.files.create({
    file: fs.createReadStream('training_data.jsonl'),
    purpose: 'fine-tune',
  });
  const job = await openai.fineTuning.jobs.create({ training_file: file.id, model: baseModel });

  return { jobId: job.id, heldOutExamples }; // heldOutExamples reserved for evaluation later
}`,
        code: `const splitIndex = Math.floor(allExamples.length * 0.85);
const trainingExamples = allExamples.slice(0, splitIndex);
const heldOutExamples = allExamples.slice(splitIndex);
// split happens BEFORE validation or submission — preventing any
// possibility of evaluation-set contamination`,
        output:
          "The pipeline splits data into training and held-out sets first, validates only the training portion, and reserves the held-out examples untouched for later evaluation — a job ID and a genuinely uncontaminated evaluation set are returned, ready for the rigorous, Module-14-style comparison this module's Lesson 2 requires before declaring success.",
        explain:
          "This example makes the lesson's train/test separation discipline concrete in code: the split happens as the very first step, before validation or submission, which is what guarantees the held-out set can later produce a trustworthy, uninflated accuracy measurement rather than one contaminated by prior exposure during training.",
        explainHi:
          "Ye example lesson ki train/test separation discipline ko code mein concrete banata hai: split bilkul pehla step ki tarah hota hai, validation ya submission se pehle, jo guarantee karta hai ki held-out set baad mein ek trustworthy, uninflated accuracy measurement produce kar sake training ke dauran prior exposure se contaminated ek ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Evaluating a fine-tuned model using examples that were ALSO used
// during training — a train/test contamination mistake
async function evaluateWrong(fineTunedModelId, allExamples) {
  // Using the SAME examples for both training and evaluation —
  // the model has already "seen the answers"
  let correct = 0;
  for (const example of allExamples) { // the FULL set, including training examples
    const response = await runModel(fineTunedModelId, example);
    if (isMatch(response, example.expectedOutput)) correct++;
  }
  return correct / allExamples.length; // an inflated, meaningless number
}`,
        right: `// Splitting BEFORE training, and evaluating only against the
// genuinely held-out portion the model never saw
async function evaluateRight(fineTunedModelId, allExamples) {
  const splitIndex = Math.floor(allExamples.length * 0.85);
  const heldOutExamples = allExamples.slice(splitIndex); // reserved, never used in training

  let correct = 0;
  for (const example of heldOutExamples) {
    const response = await runModel(fineTunedModelId, example);
    if (isMatch(response, example.expectedOutput)) correct++;
  }
  return correct / heldOutExamples.length; // a genuine generalization measurement
}`,
        why: "Evaluating a model against examples it was trained on measures memorization, not generalization to genuinely new inputs — the resulting accuracy figure is systematically inflated and doesn't reflect how the model will actually perform on real, unseen requests in production.",
        whyHi:
          "Ek model ko un examples ke against evaluate karna jinpe ye trained tha memorization measure karta hai, genuinely naye inputs tak generalization nahi — resulting accuracy figure systematically inflated hai aur reflect nahi karta ki model actually production mein real, unseen requests pe kaisa perform karega.",
      },
    ],

    realWorld: [
      {
        en: "A production ML team discovered, during an audit, that a previously 'successful' fine-tuning project had reported 96% accuracy using an evaluation set with substantial overlap with the training data — after correcting the split and re-evaluating against a genuinely held-out set, true accuracy was closer to 78%, prompting a full re-assessment of whether the project was still worth its ongoing maintenance cost.",
        hi: 'Ek production ML team ne, ek audit ke dauran, discover kiya ki ek previously \'successful\' fine-tuning project ne 96% accuracy report ki thi ek evaluation set use karke jiska training data ke saath substantial overlap tha — split correct karne aur ek genuinely held-out set ke against re-evaluate karne ke baad, true accuracy 78% ke close thi, project ka poora re-assessment prompt karte hue ki kya ye abhi bhi apni ongoing maintenance cost ke layak thi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is dataset preparation typically the highest-effort, highest-risk part of a fine-tuning project, rather than the training run itself?',
        qHi: 'Dataset preparation typically ek fine-tuning project ka highest-effort, highest-risk part kyun hai, training run khud nahi?',
        a: "Fine-tuning teaches the model from a curated set of real input-output examples, so the model learns to generalize whatever pattern those examples demonstrate — sloppy, inconsistent, or unrepresentative examples produce a model with a distorted or incomplete version of the intended behavior, regardless of how well the training run itself executes mechanically. Submitting a job and monitoring its status is comparatively standardized across providers; ensuring dataset quality is not.",
        aHi: 'Fine-tuning model ko real input-output examples ke ek curated set se sikhati hai, isliye model us pattern ko generalize karna seekhta hai jo wo examples demonstrate karte hain — sloppy, inconsistent, ya unrepresentative examples ek model produce karte hain intended behavior ke ek distorted ya incomplete version ke saath, chahe training run khud mechanically kitna bhi achhe se execute ho. Ek job submit karna aur uska status monitor karna providers ke across comparatively standardized hai; dataset quality ensure karna nahi hai.',
      },
      {
        q: "Why must the held-out evaluation set genuinely never have been used during training, and what happens if this rule is violated?",
        qHi: 'Held-out evaluation set ko genuinely training ke dauran kabhi use kyun nahi hona chahiye, aur agar ye rule violate ki jaaye to kya hota hai?',
        a: "If evaluation examples overlap with training examples, the reported accuracy reflects the model's memorization of those specific examples rather than its genuine ability to generalize to new, unseen inputs — producing a systematically inflated, misleading accuracy figure that doesn't predict real production performance.",
        aHi: 'Agar evaluation examples training examples ke saath overlap karte hain, reported accuracy model ki un specific examples ki memorization reflect karti hai naye, unseen inputs tak uski genuine ability to generalize nahi — ek systematically inflated, misleading accuracy figure produce karte hue jo real production performance predict nahi karta.',
      },
    ],

    exercises: [
      {
        task: "A team fine-tunes a model using 200 examples, then evaluates its accuracy using 20 examples randomly sampled from that SAME set of 200. Explain specifically what's wrong with this evaluation methodology, and describe the minimum change needed to make the resulting accuracy figure trustworthy.",
        taskHi: 'Ek team 200 examples use karke ek model fine-tune karti hai, phir uski accuracy evaluate karti hai 20 examples use karke jo wahi 200 ke set se randomly sample kiye gaye. Specifically explain karo ki is evaluation methodology mein kya galat hai, aur describe karo minimum change kya chahiye resulting accuracy figure ko trustworthy banane ke liye.',
        hint: "Think about what the model has and hasn't 'seen' by the time it's evaluated, and what that means for whether the accuracy number reflects genuine generalization or just memorization.",
        hintHi: 'Socho ki model ne evaluate hone tak kya \'dekha\' hai aur kya nahi dekha, aur iska matlab kya hai is baat ke liye ki kya accuracy number genuine generalization reflect karta hai ya sirf memorization.',
      },
    ],

    keyTakeaways: [
      "The fine-tuning workflow has four conceptual stages: dataset preparation, formatting and validation, the training run, and evaluation — applicable across providers.",
      "Dataset quality, consistency, and representativeness is the dominant factor determining fine-tuned model quality — the training run's mechanics are comparatively standardized and lower-risk.",
      "Validating a dataset (size, format, completeness) before submission catches problems far more cheaply than discovering them after a training run completes.",
      "The held-out evaluation set must genuinely never have been used during training — any overlap produces an inflated accuracy figure reflecting memorization rather than real generalization, directly connecting to Lesson 2's requirement of a fair, rigorous comparison.",
    ],
    keyTakeawaysHi: [
      'Fine-tuning workflow ke chaar conceptual stages hain: dataset preparation, formatting aur validation, training run, aur evaluation — providers ke across applicable.',
      'Dataset quality, consistency, aur representativeness dominant factor hai jo fine-tuned model quality determine karta hai — training run ki mechanics comparatively standardized aur lower-risk hain.',
      'Ek dataset ko validate karna (size, format, completeness) submission se pehle problems ko ek training run complete hone ke baad discover karne se kaafi zyada cheaply catch karta hai.',
      'Held-out evaluation set ko genuinely training ke dauran kabhi use nahi hona chahiye — koi bhi overlap ek inflated accuracy figure produce karta hai jo memorization reflect karti hai real generalization nahi, directly Lesson 2 ke ek fair, rigorous comparison ke requirement se connect karte hue.',
    ],
  },
];
