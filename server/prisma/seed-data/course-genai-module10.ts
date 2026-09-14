/**
 * Generative AI Complete Course — Module 10: Cost, Latency & Model Selection, lessons 1-3.
 *
 * Lesson 1: Token pricing math as a first-class design constraint.
 * Lesson 2: Picking the right model per task — fast/cheap vs slow/accurate.
 * Lesson 3: Prompt caching, batching, and streaming as concrete latency/cost levers.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_10: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-cost-math-as-a-design-constraint',
    title: 'Token Pricing Math as a First-Class Design Constraint',
    titleHi: 'Token Pricing Math Ek First-Class Design Constraint Ki Tarah',
    description:
      "Module 2 introduced basic token cost math. This lesson treats it as what it actually is in production: a design constraint that must be estimated before a feature ships, not a number discovered from a surprising bill after launch.",
    descriptionHi:
      'Module 2 ne basic token cost math introduce ki. Ye lesson ise us cheez ki tarah treat karta hai jo ye production mein actually hai: ek design constraint jise ek feature ship hone se pehle estimate karna zaroori hai, launch ke baad ek surprising bill se discover kiya gaya number nahi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**Designing a physical product's shipping box after the product is already built and mass-produced, versus designing the box's size and weight as a constraint from the very first sketch.** A team that designs a product without ever considering shipping cost might end up with something wonderful that costs more to ship than it's worth — discovering this only after manufacturing thousands of units is a genuinely expensive mistake that a five-minute conversation early on would have prevented. A team that treats shipping weight and dimensions as a real constraint from the first sketch designs a product that's both good AND economically viable to actually deliver. An AI feature's token cost is exactly this shipping constraint: designed without considering it, a feature might work perfectly in a demo and then turn out to cost more per use than the business can sustain at real volume — a mistake discovered from an alarming invoice, when a few minutes of the exact math this lesson covers, done at design time, would have caught it immediately.",
      hi: 'Ek physical product ke shipping box ko design karna product ke already banne aur mass-produced hone ke baad, versus box ke size aur weight ko ek constraint ki tarah bilkul pehle sketch se design karna. Ek team jo ek product design karti hai shipping cost consider kiye bina kuch wonderful ke saath end up ho sakti hai jo ship karne mein iski worth se zyada cost karta hai — ise sirf hazaron units manufacture karne ke baad discover karna ek genuinely expensive mistake hai jise ek five-minute conversation early on prevent kar deti. Ek team jo shipping weight aur dimensions ko pehle sketch se ek real constraint ki tarah treat karti hai ek aisa product design karti hai jo dono achha AUR actually deliver karne ke liye economically viable hai. Ek AI feature ka token cost exactly ye shipping constraint hai: ise consider kiye bina design kiya gaya, ek feature ek demo mein perfectly kaam kar sakta hai aur phir turn out ho sakta hai ki ye per use business ke sustain karne se zyada cost karta hai real volume pe — ek mistake jo ek alarming invoice se discover hui, jab is lesson ne cover kiya exact math ke kuch minutes, design time pe kiye gaye, ise immediately catch kar lete.',
    },

    simple: `**The estimation this lesson makes standard practice — done at
design time, before writing a line of production code:**

\`\`\`ts
function estimateTokens(text) {
  return Math.ceil(text.length / 4); // ~4 chars per token, English
}

function estimateFeatureCost({
  avgInputChars,
  avgOutputTokens,
  requestsPerDay,
  inputPricePerM,
  outputPricePerM,
}) {
  const inputTokens = estimateTokens('x'.repeat(avgInputChars));
  const costPerRequest =
    (inputTokens / 1_000_000) * inputPricePerM +
    (avgOutputTokens / 1_000_000) * outputPricePerM;
  return {
    costPerRequest,
    dailyCost: costPerRequest * requestsPerDay,
    monthlyCost: costPerRequest * requestsPerDay * 30,
  };
}

// A support-ticket summarization feature, estimated BEFORE building it
const estimate = estimateFeatureCost({
  avgInputChars: 2000,      // a typical ticket + conversation history
  avgOutputTokens: 150,     // a concise summary
  requestsPerDay: 5000,     // expected volume
  inputPricePerM: 3,
  outputPricePerM: 15,
});
console.log(estimate);
// { costPerRequest: ~0.00375, dailyCost: ~$18.75, monthlyCost: ~$562.50 }
\`\`\`

**Why this number needs to be compared against the feature's actual
business value, not just checked as "is it small":**

\`\`\`
$562/month might be:
  - Utterly trivial for a feature saving support agents hours of time
    across thousands of tickets — an easy, obvious yes
  - Completely unsustainable for a free-tier feature with no direct
    revenue attached, at a company with thin margins

The number ALONE doesn't tell you whether a feature is viable — it
needs to be weighed against what the feature is actually worth, the
same way a shipping cost needs to be weighed against a product's price
and margin, not evaluated as a number in isolation.
\`\`\`

**Why costs need to be modeled across realistic usage patterns, not
just an average case:**

\`\`\`
Average input length can hide expensive outliers — if 95% of requests
have a 500-character input but 5% have a 50,000-character input (a
user pasting an entire long document), the AVERAGE cost badly
underestimates what a real system will actually spend, since those
outlier requests cost dramatically more per call.

A responsible estimate models the REALISTIC DISTRIBUTION of inputs,
including a reasonable worst case, not just a single average number —
the same "don't just test the happy path" discipline this course's
earlier modules applied to error handling and edge cases, applied here
to cost.
\`\`\`

**Why this estimation must happen BEFORE building, not after:** a
feature built and shipped without this estimate might work perfectly
from a correctness standpoint and still be a business failure once real
usage volume reveals its actual, unsustainable cost — at which point the
options are all expensive (redesigning a shipped feature, absorbing a
loss, or shutting it down) compared to the near-zero cost of running this
lesson's estimate before writing any code.`,

    simpleHi: `**Estimation jise ye lesson standard practice banata hai — design
time pe kiya gaya, production code ki ek line likhne se pehle:**

\`\`\`ts
function estimateTokens(text) {
  return Math.ceil(text.length / 4); // ~4 chars per token, English
}

function estimateFeatureCost({
  avgInputChars,
  avgOutputTokens,
  requestsPerDay,
  inputPricePerM,
  outputPricePerM,
}) {
  const inputTokens = estimateTokens('x'.repeat(avgInputChars));
  const costPerRequest =
    (inputTokens / 1_000_000) * inputPricePerM +
    (avgOutputTokens / 1_000_000) * outputPricePerM;
  return {
    costPerRequest,
    dailyCost: costPerRequest * requestsPerDay,
    monthlyCost: costPerRequest * requestsPerDay * 30,
  };
}

// Ek support-ticket summarization feature, ise banane se PEHLE estimated
const estimate = estimateFeatureCost({
  avgInputChars: 2000,      // ek typical ticket + conversation history
  avgOutputTokens: 150,     // ek concise summary
  requestsPerDay: 5000,     // expected volume
  inputPricePerM: 3,
  outputPricePerM: 15,
});
console.log(estimate);
// { costPerRequest: ~0.00375, dailyCost: ~$18.75, monthlyCost: ~$562.50 }
\`\`\`

**Ye number feature ki actual business value ke against kyun compare
karna chahiye, sirf "kya ye chhota hai" check karne ke bajaye:**

\`\`\`
$562/month ho sakta hai:
  - Ek feature ke liye poori tarah trivial jo support agents ke hazaron
    tickets ke across hours of time bachata hai — ek easy, obvious yes

  - Ek free-tier feature ke liye poori tarah unsustainable koi direct
    revenue attached ke bina, ek company mein thin margins ke saath

Number AKELA aapko ye nahi batata ki ek feature viable hai ya nahi —
ise us cheez ke against weigh karna hai jo feature actually worth hai,
wahi tarike se jaise ek shipping cost ko ek product ki price aur margin
ke against weigh karna hai, isolation mein ek number ki tarah evaluate
nahi karna.
\`\`\`

**Costs ko realistic usage patterns ke across model karna kyun zaroori
hai, sirf ek average case nahi:**

\`\`\`
Average input length expensive outliers ko chhupa sakta hai — agar 95%
requests ka 500-character input hai par 5% ka 50,000-character input
hai (ek user ek poora lamba document paste kar raha hai), AVERAGE cost
badly underestimate karta hai ki ek real system actually kya spend
karega, kyunki wo outlier requests per call dramatically zyada cost
karte hain.

Ek responsible estimate inputs ki REALISTIC DISTRIBUTION model karta hai,
ek reasonable worst case samet, sirf ek single average number nahi —
wahi "sirf happy path test mat karo" discipline jo is course ke earlier
modules ne error handling aur edge cases pe apply ki, yahan cost pe
applied.
\`\`\`

**Ye estimation building se PEHLE hona kyun zaroori hai, baad mein nahi:**
ek feature jo is estimate ke bina banaya aur ship kiya gaya correctness
standpoint se perfectly kaam kar sakta hai aur abhi bhi ek business
failure ho sakta hai ek baar real usage volume iske actual, unsustainable
cost reveal kar de — us point pe options sab expensive hain (ek shipped
feature redesign karna, ek loss absorb karna, ya use band karna) is
lesson ke estimate ko koi code likhne se pehle chalane ke near-zero cost
ke comparison mein.`,

    content: `## Why token cost belongs in the design phase, not the deployment
retrospective

Module 2 established the basic mechanics of token pricing; this lesson's
point is about WHEN that calculation happens. A cost estimate computed
after a feature has already shipped and is running at real volume can
only inform a reactive decision (scale back, redesign, or absorb the
loss) — all of which are more expensive and more disruptive than a
proactive estimate done before any code is written, when the cost
implications of a design choice (how much context to include, which
model tier to use) can still be freely adjusted without disrupting
anything already in production.

## Why a cost number is meaningless without a value comparison

$562/month, by itself, carries no information about whether a feature
is worth building — the same number represents an obvious win for a
high-value internal tool and a potential loss for a low-margin
consumer feature with no direct monetization. The actual design
decision requires comparing the estimated cost against a concrete
measure of the feature's value (time saved, revenue influenced, user
retention improved) — this comparison, not the raw cost number alone,
is what tells a team whether a feature is economically viable at its
planned scale.

## Why modeling a realistic distribution, not just an average, matters

An average-case estimate can be dangerously misleading when a small
fraction of requests are dramatically more expensive than typical ones —
a long-document upload, an unusually long conversation history, or a
user who pastes an entire codebase into a chat feature all produce
per-request costs far above the average, and if these cases are common
enough, they can dominate a feature's actual total cost even though they
represent a minority of requests by count. A responsible estimate
considers the realistic range of inputs a feature will actually
encounter, including a defensible worst case, rather than assuming every
request looks like the typical one — the same principle behind testing
edge cases rather than only the happy path, applied to cost rather than
correctness.

## How this lesson sets up the rest of the module

This lesson establishes cost estimation as the necessary first input to
every subsequent decision in this module: Lesson 2's model-selection
choice (a faster, cheaper model versus a slower, more accurate one) is
fundamentally a cost/quality tradeoff that can't be reasoned about
without knowing the actual cost at stake, and Lesson 3's caching and
batching techniques are concrete levers for reducing a cost this lesson's
estimate first needs to make visible. Nothing in the rest of this module
makes sense as an optimization without first knowing, concretely, what's
being optimized.`,

    contentHi: `## Token cost design phase mein kyun belong karta hai, deployment retrospective mein nahi

Module 2 ne token pricing ki basic mechanics establish ki; is lesson ka
point ye hai ki wo calculation KAB hoti hai. Ek cost estimate jo ek
feature ke already ship hone aur real volume pe chalne ke baad compute
kiya gaya sirf ek reactive decision inform kar sakta hai (scale back,
redesign, ya loss absorb karna) — in mein se sab ek proactive estimate
se zyada expensive aur zyada disruptive hain jo kisi bhi code likhne se
pehle kiya gaya, jab ek design choice ke cost implications (kitna
context include karna hai, kaunsa model tier use karna hai) abhi bhi
freely adjust kiye ja sakte hain bina kisi cheez ko disrupt kiye jo
already production mein hai.

## Ek cost number value comparison ke bina meaningless kyun hai

$562/month, apne aap mein, koi information carry nahi karta is baat ki
ki kya ek feature banane layak hai — wahi number ek high-value internal
tool ke liye ek obvious win represent karta hai aur ek low-margin
consumer feature ke liye ek potential loss koi direct monetization ke
bina. Actual design decision ko estimated cost ko feature ki value ke
ek concrete measure (time saved, revenue influenced, user retention
improved) ke against compare karna chahiye — ye comparison, sirf raw
cost number nahi, wo hai jo ek team ko batata hai ki ek feature apne
planned scale pe economically viable hai ya nahi.

## Ek realistic distribution model karna, sirf average nahi, kyun matter karta hai

Ek average-case estimate dangerously misleading ho sakta hai jab
requests ka ek chhota fraction typical wale se dramatically zyada
expensive ho — ek long-document upload, ek unusually long conversation
history, ya ek user jo ek poora codebase ek chat feature mein paste
karta hai sab per-request costs produce karte hain average se kaafi
zyada, aur agar ye cases kaafi common hain, wo ek feature ki actual
total cost pe dominate kar sakte hain chahe wo count ke hisaab se
requests ka ek minority represent karein. Ek responsible estimate
inputs ki realistic range consider karta hai jo ek feature actually
encounter karega, ek defensible worst case samet, ye assume karne ke
bajaye ki har request typical wale jaisa dikhta hai — wahi principle jo
happy path ke bajaye edge cases test karne ke peeche hai, cost pe
applied correctness ke bajaye.

## Ye lesson baaki module ko kaise set up karta hai

Ye lesson cost estimation ko is module mein har subsequent decision ka
zaroori first input ki tarah establish karta hai: Lesson 2 ka model-
selection choice (ek faster, cheaper model versus ek slower, zyada
accurate wala) fundamentally ek cost/quality tradeoff hai jise stake pe
actual cost jaane bina reason nahi kiya ja sakta, aur Lesson 3 ki caching
aur batching techniques concrete levers hain ek cost kam karne ke liye
jise is lesson ka estimate pehle visible banana chahiye. Baaki is module
mein kuch bhi ek optimization ki tarah sense nahi banata pehle concretely
jaane bina ki kya optimize kiya ja raha hai.`,

    examples: [
      {
        title: 'A cost estimator that models a realistic distribution of input sizes, not just an average',
        titleHi: 'Ek cost estimator jo input sizes ka ek realistic distribution model karta hai, sirf ek average nahi',
        codeJs: `function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function estimateCostForRequest(inputChars, outputTokens, pricing) {
  const inputTokens = estimateTokens('x'.repeat(inputChars));
  return (inputTokens / 1_000_000) * pricing.inputPerM + (outputTokens / 1_000_000) * pricing.outputPerM;
}

function estimateRealisticMonthlyCost({ distribution, requestsPerDay, pricing }) {
  // distribution: an array of { inputChars, outputTokens, probability }
  // representing realistic usage patterns, NOT a single average case
  const expectedCostPerRequest = distribution.reduce(
    (sum, scenario) => sum + scenario.probability * estimateCostForRequest(scenario.inputChars, scenario.outputTokens, pricing),
    0,
  );
  return expectedCostPerRequest * requestsPerDay * 30;
}

const pricing = { inputPerM: 3, outputPerM: 15 };

const monthlyCost = estimateRealisticMonthlyCost({
  distribution: [
    { inputChars: 500, outputTokens: 100, probability: 0.85 },   // typical short request
    { inputChars: 5000, outputTokens: 300, probability: 0.12 },  // a longer conversation
    { inputChars: 50000, outputTokens: 500, probability: 0.03 }, // a pasted long document — rare but expensive
  ],
  requestsPerDay: 5000,
  pricing,
});

console.log('Estimated realistic monthly cost:', monthlyCost.toFixed(2));
// The 3% of requests with a 50,000-character input contribute a
// DISPROPORTIONATE share of total cost, despite being rare — a
// single-average estimate would have badly underestimated this`,
        codeTs: `interface UsageScenario {
  inputChars: number;
  outputTokens: number;
  probability: number;
}

interface Pricing {
  inputPerM: number;
  outputPerM: number;
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function estimateCostForRequest(inputChars: number, outputTokens: number, pricing: Pricing): number {
  const inputTokens = estimateTokens('x'.repeat(inputChars));
  return (inputTokens / 1_000_000) * pricing.inputPerM + (outputTokens / 1_000_000) * pricing.outputPerM;
}

function estimateRealisticMonthlyCost({
  distribution,
  requestsPerDay,
  pricing,
}: {
  distribution: UsageScenario[];
  requestsPerDay: number;
  pricing: Pricing;
}): number {
  // distribution represents realistic usage patterns, NOT a single average case
  const expectedCostPerRequest = distribution.reduce(
    (sum, scenario) => sum + scenario.probability * estimateCostForRequest(scenario.inputChars, scenario.outputTokens, pricing),
    0,
  );
  return expectedCostPerRequest * requestsPerDay * 30;
}

const pricing: Pricing = { inputPerM: 3, outputPerM: 15 };

const monthlyCost = estimateRealisticMonthlyCost({
  distribution: [
    { inputChars: 500, outputTokens: 100, probability: 0.85 },   // typical short request
    { inputChars: 5000, outputTokens: 300, probability: 0.12 },  // a longer conversation
    { inputChars: 50000, outputTokens: 500, probability: 0.03 }, // a pasted long document — rare but expensive
  ],
  requestsPerDay: 5000,
  pricing,
});

console.log('Estimated realistic monthly cost:', monthlyCost.toFixed(2));
// The 3% of requests with a 50,000-character input contribute a
// DISPROPORTIONATE share of total cost, despite being rare — a
// single-average estimate would have badly underestimated this`,
        code: `function estimateRealisticMonthlyCost({ distribution, requestsPerDay, pricing }) {
  const expectedCostPerRequest = distribution.reduce(
    (sum, scenario) => sum + scenario.probability * estimateCostForRequest(scenario.inputChars, scenario.outputTokens, pricing),
    0,
  );
  return expectedCostPerRequest * requestsPerDay * 30;
}`,
        output:
          "The distribution-based estimate reveals that the rare (3% probability) long-document scenario contributes a meaningfully large share of total monthly cost, despite being uncommon — a naive average-case estimate using only the 500-character typical case would have significantly underestimated the feature's real cost at scale.",
        explain:
          "Modeling multiple realistic scenarios with their actual probabilities (rather than one average input size) surfaces exactly the kind of costly outlier this lesson warns about — a single average number would have hidden the fact that a small fraction of expensive requests meaningfully affects the total.",
        explainHi:
          "Multiple realistic scenarios ko unki actual probabilities ke saath model karna (ek average input size ke bajaye) exactly wo kism ka costly outlier surface karta hai jiske baare mein ye lesson warn karta hai — ek single average number is fact ko chhupa deta ki expensive requests ka ek chhota fraction total ko meaningfully affect karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Shipping an AI feature with no cost estimate at all, discovering
// the real cost only from the first month's invoice
async function summarizeTicket(ticketText) {
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    messages: [{ role: 'user', content: \`Summarize: \${ticketText}\` }],
  });
  // Shipped without ever computing expected cost at realistic volume
  // — the team finds out this feature costs $8,000/month only after
  // the first invoice arrives, when redesigning it is far more
  // disruptive than estimating would have been
}`,
        right: `// Estimating cost against realistic volume and value BEFORE building
function estimateBeforeBuilding() {
  const estimate = estimateRealisticMonthlyCost({
    distribution: knownTicketSizeDistribution, // from real historical data
    requestsPerDay: expectedDailyTicketVolume,
    pricing: currentProviderPricing,
  });
  const monthlySupportHoursSaved = estimatedHoursSavedPerMonth;
  console.log(\`Estimated cost: $\${estimate}/month vs. \${monthlySupportHoursSaved} hours saved\`);
  // A concrete number to weigh against value BEFORE writing any
  // production code, while the design can still be freely adjusted
}`,
        why: "A feature shipped without a pre-launch cost estimate can only be evaluated reactively, once real usage reveals its actual cost — at that point, the available responses (redesign, absorb the loss, shut it down) are all more disruptive and expensive than the near-zero cost of estimating before any code was written.",
        whyHi:
          "Ek feature jo bina pre-launch cost estimate ke ship kiya gaya sirf reactively evaluate kiya ja sakta hai, ek baar real usage uski actual cost reveal kar de — us point pe, available responses (redesign, loss absorb karna, ise band karna) sab kisi bhi code likhne se pehle estimate karne ke near-zero cost se zyada disruptive aur expensive hain.",
      },
    ],

    realWorld: [
      {
        en: "A production SaaS company estimates the token cost of every proposed AI feature against its expected business value (support tickets deflected, hours saved, conversion lift) as a required step in feature planning, specifically because a past feature launched without this analysis turned out to cost more per month than the entire product line's profit margin, discovered only from the first invoice.",
        hi: 'Ek production SaaS company har proposed AI feature ki token cost ko uski expected business value (support tickets deflected, hours saved, conversion lift) ke against estimate karti hai feature planning mein ek required step ki tarah, specifically kyunki ek past feature jo is analysis ke bina launch hui poore product line ke profit margin se zyada per month cost karti nikli, sirf pehli invoice se discover kiya gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'Why should token cost estimation happen during feature design rather than after a feature has already shipped?',
        qHi: 'Token cost estimation feature design ke dauran kyun honi chahiye ek feature ke already ship hone ke baad nahi?',
        a: "A cost estimate computed before writing any code can still freely inform design choices (how much context to include, which model to use), while an estimate discovered from a real invoice after launch can only trigger reactive, more disruptive and expensive responses — redesigning a shipped feature, absorbing an ongoing loss, or shutting it down. The proactive estimate costs almost nothing and preserves every option.",
        aHi: 'Koi bhi code likhne se pehle compute kiya gaya ek cost estimate abhi bhi freely design choices ko inform kar sakta hai (kitna context include karna hai, kaunsa model use karna hai), jabki launch ke baad ek real invoice se discover kiya gaya ek estimate sirf reactive, zyada disruptive aur expensive responses trigger kar sakta hai — ek shipped feature ko redesign karna, ek ongoing loss absorb karna, ya use band karna. Proactive estimate almost kuch cost nahi karta aur har option preserve karta hai.',
      },
      {
        q: 'Why can an average-case cost estimate be dangerously misleading, and what should replace it?',
        qHi: 'Ek average-case cost estimate dangerously misleading kyun ho sakta hai, aur ise kya replace karna chahiye?',
        a: "A small fraction of requests (a long document upload, an unusually long conversation) can cost dramatically more than the typical case, and if common enough, these outliers can dominate a feature's actual total cost even as a minority by count. A realistic estimate should model the actual distribution of expected input sizes, including a defensible worst case, rather than assuming every request resembles the average.",
        aHi: 'Requests ka ek chhota fraction (ek long document upload, ek unusually long conversation) typical case se dramatically zyada cost kar sakta hai, aur agar kaafi common hain, ye outliers ek feature ki actual total cost pe dominate kar sakte hain count ke hisaab se ek minority hote hue bhi. Ek realistic estimate ko expected input sizes ki actual distribution model karni chahiye, ek defensible worst case samet, ye assume karne ke bajaye ki har request average jaisa dikhta hai.',
      },
    ],

    exercises: [
      {
        task: "A team estimates their new AI feature's monthly cost using only the average input length across their existing (mostly short) support tickets, arriving at a comfortable $200/month. After launch, the actual bill is $1,800/month. Using this lesson's reasoning, identify the likely flaw in their estimation approach.",
        taskHi: 'Ek team apne naye AI feature ki monthly cost estimate karti hai sirf apne existing (mostly short) support tickets ke average input length use karke, ek comfortable $200/month pe pahunchte hue. Launch ke baad, actual bill $1,800/month hai. Is lesson ki reasoning use karke, unki estimation approach mein likely flaw identify karo.',
        hint: "Consider what kind of requests an average calculation might be hiding, and whether a small fraction of expensive outliers could explain the gap.",
        hintHi: 'Consider karo ki ek average calculation kis kism ki requests ko chhupa sakta hai, aur kya expensive outliers ka ek chhota fraction gap explain kar sakta hai.',
      },
    ],

    keyTakeaways: [
      "Token cost estimation belongs at design time, before any production code is written — an estimate discovered from a post-launch invoice can only trigger expensive, disruptive reactive decisions.",
      'A cost number alone is meaningless — it must be weighed against the feature\'s actual business value (time saved, revenue influenced) to determine whether the feature is economically viable at its planned scale.',
      "An average-case estimate can badly underestimate real cost when a small fraction of requests (long documents, unusually long conversations) are dramatically more expensive than typical ones — model the realistic distribution, not just the average.",
      "This lesson's cost estimate is the necessary first input to Lesson 2's model-selection tradeoff and Lesson 3's cost-reduction techniques — nothing later in this module can be reasoned about without first knowing the actual cost at stake.",
    ],
    keyTakeawaysHi: [
      'Token cost estimation design time pe belong karta hai, kisi bhi production code likhne se pehle — launch ke baad ek invoice se discover kiya gaya ek estimate sirf expensive, disruptive reactive decisions trigger kar sakta hai.',
      'Akela ek cost number meaningless hai — ise feature ki actual business value (time saved, revenue influenced) ke against weigh karna chahiye ye determine karne ke liye ki feature apne planned scale pe economically viable hai ya nahi.',
      'Ek average-case estimate real cost ko badly underestimate kar sakta hai jab requests ka ek chhota fraction (long documents, unusually long conversations) typical wale se dramatically zyada expensive ho — realistic distribution model karo, sirf average nahi.',
      'Is lesson ka cost estimate Lesson 2 ke model-selection tradeoff aur Lesson 3 ki cost-reduction techniques ka zaroori first input hai — is module mein baad mein kuch bhi bina pehle stake pe actual cost jaane reason nahi kiya ja sakta.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-model-selection-fast-cheap-vs-slow-accurate',
    title: 'Model Selection — Fast/Cheap vs Slow/Accurate',
    titleHi: 'Model Selection — Fast/Cheap vs Slow/Accurate',
    description:
      "Given a real, estimated cost (Lesson 1), the concrete decision it feeds: different models offer genuinely different points on a cost/speed/accuracy tradeoff curve, and picking the right one per task — not defaulting to 'the best model for everything' — is a real design decision.",
    descriptionHi:
      'Ek real, estimated cost (Lesson 1) ko dekhte hue, us cheez ka concrete decision jise ye feed karta hai: alag models ek cost/speed/accuracy tradeoff curve pe genuinely alag points offer karte hain, aur per task sahi ek choose karna — "har cheez ke liye best model" pe default na karna — ek real design decision hai.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 2,

    analogy: {
      en: "**A delivery company using a bicycle courier for a document across town and a cargo ship for a container across an ocean, rather than using the cargo ship for everything because it's the most capable vehicle.** A cargo ship can technically carry a single document, but doing so would be absurdly slow and expensive for that specific job — a bicycle courier is faster, cheaper, and perfectly capable of the actual task at hand. Conversely, a bicycle obviously can't move a shipping container across an ocean at all — that job genuinely requires the cargo ship's capacity, regardless of cost. A competent logistics company matches the vehicle to the actual job's requirements, not to whichever vehicle happens to be the most impressive or capable overall. Model selection works exactly this way: a fast, cheap model is the bicycle courier, perfectly suited to tasks like simple classification or short extraction; a slower, more capable model is the cargo ship, genuinely necessary for tasks requiring deep reasoning or nuanced judgment — and defaulting to the most capable model for every single task is exactly the mistake of sending a cargo ship to deliver one document.",
      hi: 'Ek delivery company jo ek bicycle courier use karti hai ek document ke liye town ke across aur ek cargo ship ek container ke liye ek ocean ke across, cargo ship ko har cheez ke liye use karne ke bajaye kyunki ye sabse capable vehicle hai. Ek cargo ship technically ek single document carry kar sakta hai, par aisa karna us specific job ke liye absurdly slow aur expensive hoga — ek bicycle courier faster hai, cheaper hai, aur actual task ke liye perfectly capable hai. Conversely, ek bicycle obviously ek shipping container ko ek ocean ke across bilkul move nahi kar sakta — us job ko genuinely cargo ship ki capacity chahiye, cost se independently. Ek competent logistics company vehicle ko actual job ki requirements se match karti hai, jo bhi vehicle overall sabse impressive ya capable hota hai usse nahi. Model selection exactly is tarike se kaam karta hai: ek fast, cheap model bicycle courier hai, tasks ke liye perfectly suited jaise simple classification ya short extraction; ek slower, zyada capable model cargo ship hai, genuinely zaroori un tasks ke liye jinhe deep reasoning ya nuanced judgment chahiye — aur har single task ke liye sabse capable model pe default karna exactly ek document deliver karne ke liye ek cargo ship bhejne ki mistake hai.',
    },

    simple: `**Why "always use the best model" is a costly default, not a safe
one:**

\`\`\`
The most capable model available is typically also the slowest and
most expensive per token (Module 2's cost math) — using it for a task a
smaller, faster model handles equally well pays that extra cost and
latency for zero corresponding benefit, the exact same "match the tool
to the actual need" reasoning this course applied to RAG (Module 7) and
agents (Module 9).
\`\`\`

**A practical model-tier decision, tied directly to task
characteristics:**

\`\`\`ts
async function classifySentiment(text) {
  // Simple classification — a smaller, faster, cheaper model handles
  // this reliably; no benefit from a larger model's extra capability
  return await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 20,
    messages: [{ role: 'user', content: \`Classify sentiment (positive/negative/neutral): \${text}\` }],
  });
}

async function reviewComplexLegalContract(contractText) {
  // Nuanced, high-stakes reasoning — genuinely benefits from the most
  // capable model's deeper reasoning; the cost is justified by both
  // task complexity and the real consequences of getting it wrong
  return await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: \`Review this contract for risks: \${contractText}\` }],
  });
}
\`\`\`

**The dimensions that actually matter for this decision:**

\`\`\`
Task complexity — does this genuinely require deep, multi-step
  reasoning, or is it a simpler pattern-matching task (classification,
  short extraction, formatting)?

Stakes of an error — what happens if the model gets this wrong? A
  higher-stakes task (legal review, medical information, financial
  calculation) justifies a more capable, more expensive model even at
  higher per-call cost, because an error's cost outweighs the savings.

Volume — a task run millions of times a day makes even a small
  per-call cost difference add up to something significant (Module 2's
  math, multiplied at scale) in a way a rarely-run task doesn't.

Latency requirements — an interactive, real-time feature (Module 4's
  streaming chat) has a much lower tolerance for a slow model's extra
  seconds than a background batch job does.
\`\`\`

**Why this is a genuine engineering decision, revisited over time, not
a one-time choice:** model capabilities, pricing, and speed all change
as providers release new versions — a task that justified the most
capable model a year ago might be handled just as well by a
now-cheaper, faster mid-tier model today. Treating model selection as a
deliberate, periodically-revisited decision (rather than "we picked a
model once and never reconsidered") is part of the same cost-discipline
Lesson 1 established, applied over the feature's ongoing lifetime rather
than only at initial launch.`,

    simpleHi: `**"Hamesha best model use karo" ek costly default kyun hai, ek safe
wala nahi:**

\`\`\`
Available sabse capable model typically per token sabse slow aur sabse
expensive bhi hota hai (Module 2 ka cost math) — ise ek task ke liye
use karna jise ek chhota, faster model equally achhi tarah handle
karta hai wo extra cost aur latency pay karta hai zero corresponding
benefit ke liye, exactly wahi "tool ko actual need se match karo"
reasoning jo is course ne RAG (Module 7) aur agents (Module 9) pe
apply ki.
\`\`\`

**Ek practical model-tier decision, directly task characteristics se
tied:**

\`\`\`ts
async function classifySentiment(text) {
  // Simple classification — ek chhota, faster, cheaper model ise
  // reliably handle karta hai; ek bade model ki extra capability se
  // koi benefit nahi
  return await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 20,
    messages: [{ role: 'user', content: \`Classify sentiment (positive/negative/neutral): \${text}\` }],
  });
}

async function reviewComplexLegalContract(contractText) {
  // Nuanced, high-stakes reasoning — genuinely sabse capable model ke
  // deeper reasoning se benefit karta hai; cost dono task complexity
  // aur galat hone ke real consequences se justify hota hai
  return await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: \`Review this contract for risks: \${contractText}\` }],
  });
}
\`\`\`

**Dimensions jo actually is decision ke liye matter karte hain:**

\`\`\`
Task complexity — kya isko genuinely deep, multi-step reasoning
  chahiye, ya ye ek simpler pattern-matching task hai (classification,
  short extraction, formatting)?

Ek error ki stakes — agar model ise galat karta hai to kya hota hai?
  Ek higher-stakes task (legal review, medical information, financial
  calculation) ek zyada capable, zyada expensive model justify karta
  hai even higher per-call cost pe, kyunki ek error ki cost savings se
  zyada hai.

Volume — ek task jo din mein millions of times chalti hai even ek
  chhota per-call cost difference ko kisi significant cheez mein add up
  karati hai (Module 2 ka math, scale pe multiplied) ek tarike se jo ek
  rarely-run task nahi karta.

Latency requirements — ek interactive, real-time feature (Module 4 ka
  streaming chat) ek slow model ke extra seconds ke liye ek background
  batch job se kaafi kam tolerance rakhta hai.
\`\`\`

**Ye ek genuine engineering decision kyun hai, time ke saath revisited,
ek one-time choice nahi:** model capabilities, pricing, aur speed sab
badalte hain jaise providers naye versions release karte hain — ek task
jo ek saal pehle sabse capable model justify karti thi aaj ek ab-cheaper,
faster mid-tier model se equally achhi tarah handle ho sakti hai. Model
selection ko ek deliberate, periodically-revisited decision ki tarah
treat karna (bas "humne ek baar ek model pick kiya aur kabhi reconsider
nahi kiya" ke bajaye) wahi cost-discipline ka hissa hai jo Lesson 1 ne
establish kiya, feature ki ongoing lifetime ke across applied sirf
initial launch pe nahi.`,

    content: `## Why the most capable model is not, by default, the right
choice for every task

Model capability, speed, and cost are genuinely linked — a more capable
model typically costs more per token and responds more slowly than a
smaller, faster one (Module 2's cost math applies directly). For a task
a smaller model already handles reliably (a well-defined classification,
a short, unambiguous extraction), using the most capable model available
pays this extra cost and latency for a quality improvement that doesn't
actually materialize, since the task was never hard enough to benefit
from the extra capability in the first place.

## Why task complexity, error stakes, volume, and latency are the
actual decision inputs

These four dimensions capture what genuinely determines whether a
faster/cheaper model suffices or a slower/more capable one is warranted:
task complexity determines whether the extra reasoning capability is
even needed; error stakes determine how much a mistake actually costs,
which can outweigh a more expensive model's higher per-call cost;
volume determines how much a per-call cost difference compounds at
scale (Module 2's math, multiplied); and latency requirements determine
how much tolerance a specific feature has for a slower model's extra
response time. A task that's simple, low-stakes, high-volume, and
latency-sensitive is a clear case for the fastest, cheapest model that
still works reliably; a task that's complex, high-stakes, and low-volume
justifies a slower, more expensive model without much hesitation.

## Why this decision needs periodic revisiting, not a one-time choice

Because model pricing, speed, and capability all continue to evolve as
providers release new versions, a decision that was correct when a
feature launched can become outdated — a task that justified the most
capable model a year ago might be handled just as reliably by a
now-available, cheaper, faster option today. Treating model selection
as a static, set-once decision misses these opportunities; treating it
as a decision revisited periodically (alongside Lesson 1's cost
estimates) keeps a feature's cost and latency profile aligned with what's
actually currently available, not what was available when the feature
was first built.

## How this connects to Lesson 1 and forward to Lesson 3

Lesson 1 established that a feature's cost must be estimated before
launch; this lesson gives that estimate a concrete lever to act on —
choosing a cheaper, faster model for tasks that don't need more, which
directly reduces the estimated cost from Lesson 1's calculation. Lesson
3 covers additional levers (caching, batching) that further reduce cost
and latency without changing which model is used at all — model
selection and Lesson 3's techniques are complementary, not alternative,
approaches to the same underlying goal Lesson 1 established: keeping an
AI feature's real cost aligned with its actual value.`,

    contentHi: `## Sabse capable model default se har task ke liye sahi choice kyun nahi hai

Model capability, speed, aur cost genuinely linked hain — ek zyada
capable model typically per token zyada cost karta hai aur ek chhote,
faster wale se zyada slowly respond karta hai (Module 2 ka cost math
directly apply hota hai). Ek task ke liye jise ek chhota model already
reliably handle karta hai (ek well-defined classification, ek short,
unambiguous extraction), available sabse capable model use karna wo
extra cost aur latency pay karta hai ek quality improvement ke liye jo
actually materialize nahi hoti, kyunki task pehli jagah extra capability
se benefit karne layak kabhi hard tha hi nahi.

## Task complexity, error stakes, volume, aur latency actual decision inputs kyun hain

Ye chaar dimensions us cheez ko capture karte hain jo genuinely
determine karti hai ki kya ek faster/cheaper model kaafi hai ya ek
slower/zyada capable wala warranted hai: task complexity determine
karta hai ki kya extra reasoning capability bhi chahiye; error stakes
determine karta hai ki ek mistake actually kitna cost karta hai, jo ek
zyada expensive model ke higher per-call cost se zyada ho sakta hai;
volume determine karta hai ki ek per-call cost difference scale pe kitna
compound karta hai (Module 2 ka math, multiplied); aur latency
requirements determine karti hain ki ek specific feature ko ek slower
model ke extra response time ke liye kitna tolerance hai. Ek task jo
simple, low-stakes, high-volume, aur latency-sensitive hai fastest,
cheapest model ke liye ek clear case hai jo abhi bhi reliably kaam karta
hai; ek task jo complex, high-stakes, aur low-volume hai ek slower, zyada
expensive model ko bina zyada hesitation ke justify karta hai.

## Ye decision periodic revisiting kyun chahta hai, ek one-time choice nahi

Kyunki model pricing, speed, aur capability sab continue evolve karte
hain jaise providers naye versions release karte hain, ek decision jo
ek feature ke launch hone pe correct thi outdated ho sakta hai — ek task
jo ek saal pehle sabse capable model justify karti thi aaj ek ab-available,
cheaper, faster option se equally reliably handle ho sakti hai. Model
selection ko ek static, set-once decision ki tarah treat karna in
opportunities ko miss karta hai; ise ek periodically revisited decision
ki tarah treat karna (Lesson 1 ke cost estimates ke saath) ek feature ke
cost aur latency profile ko us cheez ke saath aligned rakhta hai jo
actually currently available hai, jo feature pehli baar banaya gaya tha
tab available tha usse nahi.

## Ye Lesson 1 se aur forward Lesson 3 se kaise connect hota hai

Lesson 1 ne establish kiya ki ek feature ki cost launch se pehle
estimate ki jaani chahiye; ye lesson us estimate ko act karne ke liye ek
concrete lever deta hai — un tasks ke liye ek cheaper, faster model
choose karna jinhe zyada ki zaroorat nahi, jo directly Lesson 1 ki
calculation se estimated cost ko reduce karta hai. Lesson 3 additional
levers (caching, batching) cover karta hai jo cost aur latency ko aur
kam karte hain bina ye badle ki kaunsa model use kiya jata hai — model
selection aur Lesson 3 ki techniques complementary hain, alternative
nahi, wahi underlying goal ke approaches jise Lesson 1 ne establish kiya:
ek AI feature ki real cost ko uski actual value ke saath aligned rakhna.`,

    examples: [
      {
        title: 'A router that selects a model tier based on task characteristics rather than always using the most capable one',
        titleHi: 'Ek router jo task characteristics ke basis pe ek model tier select karta hai hamesha sabse capable wala use karne ke bajaye',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL_TIERS = {
  fast: 'claude-haiku-4-5',     // cheapest, fastest — simple, high-volume tasks
  balanced: 'claude-sonnet-4-5', // good default for moderate complexity
  powerful: 'claude-opus-4-5',   // most capable, most expensive — complex/high-stakes only
};

function selectModelTier({ isSimpleClassification, isHighStakes, expectedVolume }) {
  if (isHighStakes) return MODEL_TIERS.powerful; // stakes justify the cost, regardless of volume
  if (isSimpleClassification && expectedVolume === 'high') return MODEL_TIERS.fast;
  return MODEL_TIERS.balanced; // a reasonable default for everything else
}

async function processTicket(ticketText, ticketType) {
  const model = selectModelTier({
    isSimpleClassification: ticketType === 'routing',
    isHighStakes: ticketType === 'legal-escalation',
    expectedVolume: 'high',
  });

  return await anthropic.messages.create({
    model,
    max_tokens: ticketType === 'legal-escalation' ? 2000 : 200,
    messages: [{ role: 'user', content: \`Process this \${ticketType} ticket: \${ticketText}\` }],
  });
}

// A routing ticket (simple, high-volume) uses the fast, cheap tier
await processTicket(routingTicketText, 'routing');
// A legal-escalation ticket (high-stakes) uses the powerful tier,
// regardless of the extra per-call cost — the stakes justify it`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL_TIERS = {
  fast: 'claude-haiku-4-5',     // cheapest, fastest — simple, high-volume tasks
  balanced: 'claude-sonnet-4-5', // good default for moderate complexity
  powerful: 'claude-opus-4-5',   // most capable, most expensive — complex/high-stakes only
} as const;

interface ModelSelectionInput {
  isSimpleClassification: boolean;
  isHighStakes: boolean;
  expectedVolume: 'low' | 'high';
}

function selectModelTier({ isSimpleClassification, isHighStakes, expectedVolume }: ModelSelectionInput): string {
  if (isHighStakes) return MODEL_TIERS.powerful; // stakes justify the cost, regardless of volume
  if (isSimpleClassification && expectedVolume === 'high') return MODEL_TIERS.fast;
  return MODEL_TIERS.balanced; // a reasonable default for everything else
}

async function processTicket(ticketText: string, ticketType: string) {
  const model = selectModelTier({
    isSimpleClassification: ticketType === 'routing',
    isHighStakes: ticketType === 'legal-escalation',
    expectedVolume: 'high',
  });

  return await anthropic.messages.create({
    model,
    max_tokens: ticketType === 'legal-escalation' ? 2000 : 200,
    messages: [{ role: 'user', content: \`Process this \${ticketType} ticket: \${ticketText}\` }],
  });
}

// A routing ticket (simple, high-volume) uses the fast, cheap tier
await processTicket(routingTicketText, 'routing');
// A legal-escalation ticket (high-stakes) uses the powerful tier,
// regardless of the extra per-call cost — the stakes justify it`,
        code: `function selectModelTier({ isSimpleClassification, isHighStakes, expectedVolume }) {
  if (isHighStakes) return MODEL_TIERS.powerful;
  if (isSimpleClassification && expectedVolume === 'high') return MODEL_TIERS.fast;
  return MODEL_TIERS.balanced;
}`,
        output:
          "A high-volume routing task uses the fast, cheap model tier, keeping per-request cost low for a task that doesn't need more capability. A rare, high-stakes legal escalation uses the powerful tier despite its higher per-call cost, since the cost of an error there genuinely outweighs the savings from a cheaper model.",
        explain:
          "This router encodes the four decision dimensions from this lesson directly into code: stakes override volume considerations (a high-stakes task always gets the powerful tier), and volume/complexity together determine the fast-tier eligibility for everything else — a concrete implementation of matching the model to the actual task rather than defaulting to one tier for everything.",
        explainHi:
          "Ye router is lesson ke four decision dimensions ko directly code mein encode karta hai: stakes volume considerations ko override karti hain (ek high-stakes task hamesha powerful tier paata hai), aur volume/complexity saath mein baaki sab kuch ke liye fast-tier eligibility determine karte hain — model ko actual task se match karne ka ek concrete implementation, har cheez ke liye ek tier pe default karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using the most capable (and most expensive) model for every task
// regardless of actual complexity or stakes
async function classifySentiment(text) {
  return await anthropic.messages.create({
    model: 'claude-opus-4-5', // the most capable, most expensive tier
    max_tokens: 20,
    messages: [{ role: 'user', content: \`Classify sentiment: \${text}\` }],
  });
  // A simple three-way classification task gets zero measurable
  // quality benefit from the most capable model, while paying its
  // full extra cost and latency on every single call, at real volume
}`,
        right: `// Matching model tier to actual task complexity
async function classifySentiment(text) {
  return await anthropic.messages.create({
    model: 'claude-haiku-4-5', // fast, cheap, fully sufficient for this task
    max_tokens: 20,
    messages: [{ role: 'user', content: \`Classify sentiment: \${text}\` }],
  });
}`,
        why: "A more capable model's extra cost and latency only pays off when a task genuinely needs the additional reasoning capability. For a simple, well-defined classification task, the most capable model provides no measurable quality improvement over a faster, cheaper one — the extra cost is pure waste at real volume.",
        whyHi:
          "Ek zyada capable model ka extra cost aur latency sirf tab pay off karta hai jab ek task ko genuinely additional reasoning capability chahiye. Ek simple, well-defined classification task ke liye, sabse capable model ek faster, cheaper wale se koi measurable quality improvement provide nahi karta — extra cost real volume pe pure waste hai.",
      },
    ],

    realWorld: [
      {
        en: "A production content-moderation pipeline uses a fast, cheap model tier for an initial pass classifying the vast majority of clearly-fine content, escalating only the small fraction of ambiguous or borderline cases to a slower, more capable model — matching each tier to the actual difficulty of the specific case rather than running every piece of content through the most expensive model available.",
        hi: 'Ek production content-moderation pipeline ek fast, cheap model tier use karta hai ek initial pass ke liye jo clearly-fine content ke vast majority ko classify karta hai, sirf ambiguous ya borderline cases ke chhote fraction ko ek slower, zyada capable model tak escalate karte hue — har tier ko specific case ki actual difficulty se match karte hue har piece of content ko available sabse expensive model ke through chalane ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: "Why is 'always use the most capable model available' generally the wrong default for a production AI system?",
        qHi: "'Hamesha available sabse capable model use karo' generally ek production AI system ke liye galat default kyun hai?",
        a: "A more capable model typically costs more per token and responds more slowly than a smaller, faster option. For tasks a smaller model already handles reliably (simple classification, short extraction), using the most capable model pays this extra cost and latency for a quality improvement that never materializes, since the task wasn't hard enough to need the extra capability.",
        aHi: 'Ek zyada capable model typically per token zyada cost karta hai aur ek chhote, faster option se zyada slowly respond karta hai. Un tasks ke liye jinhe ek chhota model already reliably handle karta hai (simple classification, short extraction), sabse capable model use karna wo extra cost aur latency pay karta hai ek quality improvement ke liye jo kabhi materialize nahi hota, kyunki task extra capability ki zaroorat rakhne ke liye kabhi hard tha hi nahi.',
      },
      {
        q: 'What four dimensions should determine whether a task warrants a faster/cheaper model or a slower/more capable one?',
        qHi: 'Kaunse chaar dimensions determine karne chahiye ki ek task ko ek faster/cheaper model warrant karta hai ya ek slower/zyada capable wala?',
        a: "Task complexity (does it genuinely need deep reasoning, or is it simpler pattern-matching), the stakes of an error (a high-stakes mistake can outweigh a more expensive model's cost), volume (a per-call cost difference compounds significantly at high volume), and latency requirements (an interactive feature has less tolerance for a slower model than a background job).",
        aHi: 'Task complexity (kya isko genuinely deep reasoning chahiye, ya ye simpler pattern-matching hai), ek error ki stakes (ek high-stakes mistake ek zyada expensive model ke cost se zyada ho sakti hai), volume (ek per-call cost difference high volume pe significantly compound karta hai), aur latency requirements (ek interactive feature ka ek slower model ke liye ek background job se kam tolerance hai).',
      },
    ],

    exercises: [
      {
        task: "A team uses their most capable, most expensive model for both (1) classifying incoming support tickets into 5 fixed categories and (2) drafting nuanced, empathetic responses to escalated complaints from angry customers. Using this lesson's four dimensions, decide which task should keep the powerful model and which should switch to a faster, cheaper tier.",
        taskHi: 'Ek team apna sabse capable, sabse expensive model dono ke liye use karti hai (1) incoming support tickets ko 5 fixed categories mein classify karna aur (2) angry customers ki escalated complaints ke liye nuanced, empathetic responses draft karna. Is lesson ke chaar dimensions use karke, decide karo ki kaunsa task powerful model rakhna chahiye aur kaunsa ek faster, cheaper tier pe switch karna chahiye.',
        hint: "Evaluate each task separately against complexity, error stakes, volume, and latency needs, rather than assuming both tasks need the same tier.",
        hintHi: 'Har task ko separately complexity, error stakes, volume, aur latency needs ke against evaluate karo, ye assume karne ke bajaye ki dono tasks ko wahi tier chahiye.',
      },
    ],

    keyTakeaways: [
      "The most capable model available is typically also the most expensive and slowest per call — using it for a task a smaller model already handles reliably pays that cost for zero corresponding quality benefit.",
      "Task complexity, error stakes, volume, and latency requirements are the four dimensions that actually determine whether a faster/cheaper model suffices or a slower/more capable one is genuinely warranted.",
      "A high-stakes task can justify a more expensive model even at low volume, since the cost of an error can outweigh the model's higher per-call cost.",
      "Model selection needs periodic revisiting, not a one-time choice, since model pricing, speed, and capability continue to evolve — a decision correct at launch can become outdated as better/cheaper options become available.",
    ],
    keyTakeawaysHi: [
      'Available sabse capable model typically per call sabse expensive aur sabse slow bhi hota hai — ise ek task ke liye use karna jise ek chhota model already reliably handle karta hai wo cost pay karta hai zero corresponding quality benefit ke liye.',
      'Task complexity, error stakes, volume, aur latency requirements wo chaar dimensions hain jo actually determine karte hain ki ek faster/cheaper model kaafi hai ya ek slower/zyada capable wala genuinely warranted hai.',
      'Ek high-stakes task ek zyada expensive model ko justify kar sakta hai even low volume pe, kyunki ek error ki cost model ke higher per-call cost se zyada ho sakti hai.',
      'Model selection ko periodic revisiting chahiye, ek one-time choice nahi, kyunki model pricing, speed, aur capability continue evolve karte hain — launch pe ek correct decision outdated ho sakta hai jaise better/cheaper options available hote hain.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-prompt-caching-batching-streaming-as-cost-levers',
    title: 'Prompt Caching, Batching & Streaming as Concrete Cost/Latency Levers',
    titleHi: 'Prompt Caching, Batching Aur Streaming Concrete Cost/Latency Levers Ki Tarah',
    description:
      "Closing this module: three concrete, complementary techniques for reducing cost and improving perceived latency without changing which model is used at all — repeated-context caching, batching non-urgent requests, and revisiting Module 4's streaming as a genuine cost/latency lever, not just a UX nicety.",
    descriptionHi:
      'Is module ko close karte hue: teen concrete, complementary techniques cost kam karne aur perceived latency improve karne ke liye bina ye badle ki kaunsa model use kiya jata hai — repeated-context caching, non-urgent requests ko batch karna, aur Module 4 ki streaming ko ek genuine cost/latency lever ki tarah revisit karna, sirf ek UX nicety nahi.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 3,

    analogy: {
      en: "**A restaurant kitchen that re-reads an entire recipe book from page one before cooking every single dish, versus one that keeps the current recipe bookmarked and open — plus a kitchen that cooks fifty identical catering orders as one coordinated batch instead of fifty separate, individually-rushed jobs.** A cook who closes the recipe book and starts from page one for every single dish, even the tenth identical order of the same dish that evening, wastes real time re-finding the same page over and over — keeping it bookmarked and open for repeated dishes is a direct, obvious efficiency gain that changes nothing about the recipe itself. Separately, a kitchen preparing fifty identical catering meals can prepare them together as one coordinated batch — sharing setup, prep, and oven time — far more efficiently than treating each as its own individually-rushed, from-scratch order. Prompt caching is exactly the bookmarked recipe: repeated context (a long system prompt, a large document included in every call) doesn't need to be fully reprocessed from scratch every single time. Batching is the coordinated catering order: many non-urgent requests processed together are more efficient than each being rushed through individually. Neither technique changes the model being used or the actual content of any individual response — both are pure efficiency gains on top of decisions already made.",
      hi: 'Ek restaurant kitchen jo har single dish cook karne se pehle ek poori recipe book ko page one se re-read karti hai, versus ek jo current recipe ko bookmarked aur open rakhti hai — plus ek kitchen jo fifty identical catering orders ko ek coordinated batch ki tarah cook karti hai fifty separate, individually-rushed jobs ke bajaye. Ek cook jo recipe book band karta hai aur har single dish ke liye page one se shuru karta hai, even us shaam ki wahi dish ke tenth identical order ke liye, wahi page baar baar re-find karne mein real time waste karta hai — ise bookmarked aur open rakhna repeated dishes ke liye ek direct, obvious efficiency gain hai jo recipe khud ke baare mein kuch nahi badalta. Separately, ek kitchen jo fifty identical catering meals prepare kar rahi hai unhe ek coordinated batch ki tarah saath prepare kar sakti hai — setup, prep, aur oven time share karte hue — har ek ko apna khud ka individually-rushed, from-scratch order treat karne se kaafi zyada efficiently. Prompt caching exactly wo bookmarked recipe hai: repeated context (ek lamba system prompt, ek bada document jo har call mein include hota hai) ko har single baar scratch se poori tarah reprocess karne ki zaroorat nahi hai. Batching wo coordinated catering order hai: kai non-urgent requests ek saath process kiye gaye har ek ko individually rush kiye jaane se zyada efficient hain. Koi bhi technique na model badalta hai jo use ho raha hai na kisi bhi individual response ka actual content — dono already liye gaye decisions ke upar pure efficiency gains hain.',
    },

    simple: `**Prompt caching — avoiding reprocessing the SAME context
repeatedly:**

\`\`\`ts
// Without caching — a large system prompt or document is fully
// reprocessed on EVERY single call, even when it's identical every time
async function askAboutDocument(question, largeDocumentText) {
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    system: \`Reference document:\n\${largeDocumentText}\`, // reprocessed every call
    messages: [{ role: 'user', content: question }],
  });
}

// With prompt caching — the provider caches the processed representation
// of repeated content, avoiding redundant reprocessing on subsequent calls
async function askAboutDocumentCached(question, largeDocumentText) {
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    system: [
      {
        type: 'text',
        text: \`Reference document:\n\${largeDocumentText}\`,
        cache_control: { type: 'ephemeral' }, // marks this content as cacheable
      },
    ],
    messages: [{ role: 'user', content: question }],
  });
  // Subsequent calls reusing this SAME document content pay a
  // significantly reduced cost for the cached portion — genuinely
  // reduced compute, not just a pricing discount
}
\`\`\`

**Batching — processing many non-urgent requests together instead of
individually, for tasks with no real-time requirement:**

\`\`\`ts
// Real-time chat (Module 4) genuinely needs an immediate response —
// batching would be the wrong tool here entirely

// A nightly job classifying yesterday's 50,000 support tickets has NO
// real-time requirement — this is exactly what batching is for
async function batchClassifyTickets(tickets) {
  const batchRequests = tickets.map((t) => ({
    custom_id: t.id,
    params: {
      model: 'claude-haiku-4-5',
      max_tokens: 20,
      messages: [{ role: 'user', content: \`Classify: \${t.text}\` }],
    },
  }));
  // Many providers offer a genuinely lower per-token price for batched,
  // non-urgent requests processed together rather than individually
  return await anthropic.batches.create({ requests: batchRequests });
}
\`\`\`

**Streaming, revisited as a cost/latency lever, not just a UX
nicety (Module 4's original framing extended):**

\`\`\`
Module 4 covered streaming's PERCEIVED-latency benefit — a visitor
sees the first token almost immediately rather than waiting for the
full response. In this module's cost/latency context, that same
mechanism is also a genuine LEVER a team can choose to use or not use
based on the actual feature's requirements — an interactive chat
feature needs it (Module 4's original case), while an unattended batch
job gains nothing from it (Module 2, Lesson 2's original point about
when non-streaming remains correct) — the SAME decision framework
Module 4 established, now explicitly grouped with caching and batching
as one of several concrete levers available for managing an AI
feature's real-world cost and latency profile.
\`\`\`

**Why these three techniques are complementary, addressing different
parts of the cost/latency picture:** caching reduces the cost of
REPEATED context across many calls; batching reduces the cost of
MANY non-urgent requests processed together; streaming improves
PERCEIVED latency for real-time features without changing actual cost
at all. A production system frequently uses more than one simultaneously
— a chat feature (streaming, for perceived latency) with a cached system
prompt (caching, for repeated-context cost) alongside a separate nightly
batch job (batching, for a genuinely non-urgent bulk task) — each lever
applied to the specific part of the system it actually helps.`,

    simpleHi: `**Prompt caching — WAHI context ko repeatedly reprocess karne se
bachna:**

\`\`\`ts
// Caching ke bina — ek bada system prompt ya document har single call
// pe poori tarah reprocess hota hai, even jab ye har baar identical ho
async function askAboutDocument(question, largeDocumentText) {
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    system: \`Reference document:\n\${largeDocumentText}\`, // har call reprocessed
    messages: [{ role: 'user', content: question }],
  });
}

// Prompt caching ke saath — provider repeated content ki processed
// representation cache karta hai, subsequent calls pe redundant
// reprocessing se bachte hue
async function askAboutDocumentCached(question, largeDocumentText) {
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    system: [
      {
        type: 'text',
        text: \`Reference document:\n\${largeDocumentText}\`,
        cache_control: { type: 'ephemeral' }, // is content ko cacheable mark karta hai
      },
    ],
    messages: [{ role: 'user', content: question }],
  });
  // Subsequent calls jo wahi document content reuse karte hain cached
  // portion ke liye ek significantly reduced cost pay karte hain —
  // genuinely reduced compute, sirf ek pricing discount nahi
}
\`\`\`

**Batching — kai non-urgent requests ko individually ke bajaye saath
process karna, un tasks ke liye jinki koi real-time requirement nahi:**

\`\`\`ts
// Real-time chat (Module 4) ko genuinely ek immediate response chahiye
// — batching yahan poori tarah galat tool hoga

// Ek nightly job jo kal ke 50,000 support tickets classify karti hai
// koi real-time requirement nahi rakhta — ye exactly wo hai jiske liye
// batching hai
async function batchClassifyTickets(tickets) {
  const batchRequests = tickets.map((t) => ({
    custom_id: t.id,
    params: {
      model: 'claude-haiku-4-5',
      max_tokens: 20,
      messages: [{ role: 'user', content: \`Classify: \${t.text}\` }],
    },
  }));
  // Kai providers batched, non-urgent requests ke liye jo saath process
  // ki gayi hain individually ke bajaye genuinely lower per-token price
  // offer karte hain
  return await anthropic.batches.create({ requests: batchRequests });
}
\`\`\`

**Streaming, ek cost/latency lever ki tarah revisited, sirf ek UX
nicety nahi (Module 4 ka original framing extended):**

\`\`\`
Module 4 ne streaming ka PERCEIVED-latency benefit cover kiya — ek
visitor pehla token almost immediately dekhta hai poore response ka
wait karne ke bajaye. Is module ke cost/latency context mein, wahi
mechanism ek genuine LEVER bhi hai jise ek team use ya use na karne ka
choice kar sakti hai actual feature ki requirements ke basis pe — ek
interactive chat feature ko ye chahiye (Module 4 ka original case),
jabki ek unattended batch job ise kuch nahi paata (Module 2, Lesson 2
ka original point ki kab non-streaming correct rehta hai) — WAHI
decision framework jo Module 4 ne establish kiya, ab explicitly caching
aur batching ke saath grouped ek AI feature ke real-world cost aur
latency profile manage karne ke liye available kai concrete levers mein
se ek ki tarah.
\`\`\`

**Ye teen techniques complementary kyun hain, cost/latency picture ke
alag hisson ko address karte hue:** caching kai calls ke across
REPEATED context ki cost kam karti hai; batching MANY non-urgent
requests ki cost kam karti hai saath process kiye gaye; streaming
PERCEIVED latency improve karta hai real-time features ke liye bina
actual cost bilkul badle. Ek production system aksar ek se zyada
simultaneously use karta hai — ek chat feature (streaming, perceived
latency ke liye) ek cached system prompt ke saath (caching, repeated-
context cost ke liye) ek separate nightly batch job ke saath (batching,
ek genuinely non-urgent bulk task ke liye) — har lever system ke us
specific hisse pe applied jise ye actually help karta hai.`,

    content: `## Why prompt caching addresses a genuinely different cost source
than model selection

Lesson 2's model selection reduces cost by choosing a cheaper model for
tasks that don't need a more capable one — a decision made once per
task type. Prompt caching addresses a different source of cost
entirely: repeated content sent across MANY calls (a long system
prompt, a reference document included in every request to the same
feature) that would otherwise be fully reprocessed from scratch every
single time despite being identical. These are complementary, not
competing, levers — a feature can use both a cheaper model AND caching
for its repeated context simultaneously, each addressing a distinct
source of cost.

## Why batching is specifically about removing a real-time
requirement that was never actually needed

Batching's cost benefit comes from processing many requests together
rather than each individually and urgently — this only makes sense for
tasks with no genuine real-time requirement, since batching typically
trades some latency (results may not be immediate) for a lower
per-request cost. Applying batching to a task that genuinely needs an
immediate response (a live chat feature) would be a clear mismatch —
identifying whether a specific task has a real-time requirement at all
is the actual judgment call, the same "does this specific case need
this specific property" reasoning Module 4 applied to streaming and
Module 9 applied to when an agent is warranted.

## Why streaming's role in this module extends, rather than repeats,
Module 4's lesson

Module 4 established streaming's perceived-latency mechanism in the
context of building a chat UI. This module's contribution is framing:
streaming is one of several concrete, deliberate levers (alongside
caching and batching) a team chooses to apply based on a specific
feature's actual requirements, not a default to apply everywhere or
skip everywhere. The underlying mechanism is unchanged from Module 4 —
what's new here is placing it alongside caching and batching as part of
a coherent cost/latency toolkit, each lever suited to a different part
of the problem.

## How these three techniques, plus Lessons 1-2, form a complete
cost/latency discipline

Lesson 1 established that cost must be estimated realistically before
launch; Lesson 2 established that model selection should match the
actual task's requirements rather than defaulting to the most capable
option; this lesson adds three concrete levers — caching for repeated
context, batching for non-urgent bulk work, and streaming for
perceived latency on real-time features — that further reduce cost and
improve latency without necessarily changing which model is used at
all. Together, these three lessons form the practical, first-class
design discipline this module opened with: an AI feature's cost and
latency profile is something actively designed and managed, not an
afterthought discovered from a surprising bill or a slow feature after
launch.`,

    contentHi: `## Prompt caching model selection se genuinely alag cost source kyun address karta hai

Lesson 2 ka model selection cost ko un tasks ke liye ek cheaper model
choose karke kam karta hai jinhe ek zyada capable wale ki zaroorat nahi
— ek decision jo per task type ek baar liya jata hai. Prompt caching
cost ka ek poori tarah alag source address karta hai: repeated content
jo MANY calls ke across bheja jata hai (ek lamba system prompt, ek
reference document jo wahi feature ki har request mein include hota
hai) jo otherwise identical hote hue bhi har single baar scratch se
poori tarah reprocess hoga. Ye complementary levers hain, competing
nahi — ek feature ek saath ek cheaper model AUR apne repeated context
ke liye caching dono use kar sakta hai, har ek cost ka ek distinct
source address karte hue.

## Batching specifically ek real-time requirement hatane ke baare mein kyun hai jo actually kabhi chahiye hi nahi thi

Batching ka cost benefit kai requests ko saath process karne se aata hai
har ek ko individually aur urgently ke bajaye — ye sirf un tasks ke liye
sense banata hai jinki koi genuine real-time requirement nahi, kyunki
batching typically kuch latency trade karta hai (results immediate
nahi ho sakte) ek lower per-request cost ke liye. Batching ko ek aise
task pe apply karna jise genuinely ek immediate response chahiye (ek
live chat feature) ek clear mismatch hoga — ye identify karna ki kya ek
specific task ko bilkul real-time requirement hai actual judgment call
hai, wahi "kya is specific case ko is specific property ki zaroorat
hai" reasoning jo Module 4 ne streaming pe aur Module 9 ne is baat pe
apply ki ki ek agent kab warranted hai.

## Is module mein streaming ka role Module 4 ke lesson ko kyun extend karta hai, repeat nahi

Module 4 ne streaming ka perceived-latency mechanism ek chat UI banane
ke context mein establish kiya. Is module ka contribution framing hai:
streaming ek concrete, deliberate lever hai kai mein se (caching aur
batching ke saath) jise ek team ek specific feature ki actual
requirements ke basis pe apply karne ka choose karti hai, ek default nahi
jise har jagah apply karna hai ya har jagah skip karna hai. Underlying
mechanism Module 4 se unchanged hai — yahan naya kya hai ise caching
aur batching ke saath ek coherent cost/latency toolkit ke hisse ki tarah
rakhna hai, har lever problem ke ek alag hisse ke liye suited.

## Ye teen techniques, plus Lessons 1-2, ek complete cost/latency discipline kaise banate hain

Lesson 1 ne establish kiya ki cost ko launch se pehle realistically
estimate karna chahiye; Lesson 2 ne establish kiya ki model selection ko
actual task ki requirements se match karna chahiye available sabse
capable option pe default karne ke bajaye; ye lesson teen concrete
levers add karta hai — repeated context ke liye caching, non-urgent bulk
work ke liye batching, aur real-time features pe perceived latency ke
liye streaming — jo cost aur latency ko aur kam karte hain bina
necessarily ye badle ki kaunsa model use kiya jata hai. Saath mein, ye
teen lessons wo practical, first-class design discipline banate hain
jise ye module ne shuru kiya: ek AI feature ka cost aur latency profile
kuch aisa hai jo actively design aur manage kiya jata hai, ek afterthought
nahi jo launch ke baad ek surprising bill ya ek slow feature se discover
kiya jaata hai.`,

    examples: [
      {
        title: 'A feature combining a cheaper model, prompt caching, and streaming, with a separate batched job for non-urgent bulk work',
        titleHi: 'Ek feature jo ek cheaper model, prompt caching, aur streaming combine karta hai, ek separate batched job ke saath non-urgent bulk work ke liye',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const PRODUCT_CATALOG_TEXT = '...'; // a large, mostly-static reference document

// A real-time customer-facing chat feature — needs streaming (perceived
// latency), benefits from caching (the catalog is identical every call),
// and uses a balanced model tier (moderate complexity, real-time latency need)
async function streamProductChat(userMessage) {
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-5', // Lesson 2: balanced tier for this complexity
    max_tokens: 500,
    system: [
      {
        type: 'text',
        text: \`Product catalog reference:\n\${PRODUCT_CATALOG_TEXT}\`,
        cache_control: { type: 'ephemeral' }, // Lesson 3: repeated context, cached
      },
    ],
    messages: [{ role: 'user', content: userMessage }],
  });
  return stream; // streamed (Module 4 / Lesson 3) for perceived latency
}

// A SEPARATE nightly job with no real-time requirement — batched
// (Lesson 3), and uses the fast/cheap tier (Lesson 2: simple classification)
async function nightlyClassifyAllTickets(tickets) {
  const batchRequests = tickets.map((t) => ({
    custom_id: t.id,
    params: {
      model: 'claude-haiku-4-5', // Lesson 2: fast/cheap tier for simple classification
      max_tokens: 20,
      messages: [{ role: 'user', content: \`Classify: \${t.text}\` }],
    },
  }));
  return await anthropic.batches.create({ requests: batchRequests });
}`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const PRODUCT_CATALOG_TEXT = '...'; // a large, mostly-static reference document

// A real-time customer-facing chat feature — needs streaming (perceived
// latency), benefits from caching (the catalog is identical every call),
// and uses a balanced model tier (moderate complexity, real-time latency need)
async function streamProductChat(userMessage: string) {
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-5', // Lesson 2: balanced tier for this complexity
    max_tokens: 500,
    system: [
      {
        type: 'text',
        text: \`Product catalog reference:\n\${PRODUCT_CATALOG_TEXT}\`,
        cache_control: { type: 'ephemeral' }, // Lesson 3: repeated context, cached
      },
    ],
    messages: [{ role: 'user', content: userMessage }],
  });
  return stream; // streamed (Module 4 / Lesson 3) for perceived latency
}

interface Ticket { id: string; text: string; }

// A SEPARATE nightly job with no real-time requirement — batched
// (Lesson 3), and uses the fast/cheap tier (Lesson 2: simple classification)
async function nightlyClassifyAllTickets(tickets: Ticket[]) {
  const batchRequests = tickets.map((t) => ({
    custom_id: t.id,
    params: {
      model: 'claude-haiku-4-5', // Lesson 2: fast/cheap tier for simple classification
      max_tokens: 20,
      messages: [{ role: 'user' as const, content: \`Classify: \${t.text}\` }],
    },
  }));
  return await anthropic.batches.create({ requests: batchRequests });
}`,
        code: `// Real-time: streamed + cached + balanced model
const stream = anthropic.messages.stream({
  model: 'claude-sonnet-4-5',
  system: [{ type: 'text', text: catalogText, cache_control: { type: 'ephemeral' } }],
  messages: [{ role: 'user', content: userMessage }],
});

// Non-urgent bulk: batched + fast/cheap model
const batch = await anthropic.batches.create({ requests: batchRequests });`,
        output:
          "The customer-facing chat feature responds with the first token almost instantly (streaming) and pays a reduced cost for the repeated catalog content on every subsequent call (caching), while the entirely separate nightly job processes 50,000 tickets overnight at a lower per-request cost (batching) — three different levers, each applied to the part of the system it actually addresses.",
        explain:
          "This demonstrates that all three techniques from this lesson, plus Lesson 2's model selection, are independent, composable decisions — the chat feature and the nightly job are architected completely differently because their actual requirements (real-time vs. not, repeated context vs. not) are genuinely different, not because one approach is universally better.",
        explainHi:
          "Ye demonstrate karta hai ki is lesson ki teenon techniques, plus Lesson 2 ka model selection, independent, composable decisions hain — chat feature aur nightly job poori tarah alag architected hain kyunki unki actual requirements (real-time vs. nahi, repeated context vs. nahi) genuinely alag hain, is wajah se nahi ki ek approach universally better hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Reprocessing a large, identical reference document on every single
// call with no caching, even though it never changes
async function askAboutCatalog(question) {
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    system: \`Product catalog:\n\${LARGE_CATALOG_TEXT}\`, // reprocessed EVERY call
    messages: [{ role: 'user', content: question }],
  });
  // Thousands of daily calls all pay full cost for reprocessing the
  // exact same catalog content, which never actually changes
}`,
        right: `// Marking the repeated, unchanging content as cacheable
async function askAboutCatalog(question) {
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    system: [
      { type: 'text', text: \`Product catalog:\n\${LARGE_CATALOG_TEXT}\`, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: question }],
  });
  // Subsequent calls reusing this identical content pay significantly
  // less for the cached portion
}`,
        why: "Content that's identical across many calls (a static reference document, a long system prompt) is a clear candidate for caching — reprocessing it from scratch on every single call pays real, avoidable cost at scale for content that never actually changes.",
        whyHi:
          "Content jo kai calls ke across identical hai (ek static reference document, ek lamba system prompt) caching ke liye ek clear candidate hai — ise har single call pe scratch se reprocess karna real, avoidable cost pay karta hai scale pe us content ke liye jo actually kabhi badalta hi nahi.",
      },
    ],

    realWorld: [
      {
        en: "A production legal-research AI tool caches its lengthy, unchanging system prompt (containing formatting instructions and domain context used identically across thousands of daily queries), streams responses to its interactive research interface for perceived responsiveness, and runs a completely separate nightly batch job to pre-classify newly published case law with no real-time requirement — all three levers from this lesson applied to the specific part of the system each one actually helps.",
        hi: 'Ek production legal-research AI tool apna lengthy, unchanging system prompt cache karta hai (formatting instructions aur domain context contain karta hai jo hazaron daily queries ke across identically use hota hai), apne interactive research interface ko responses stream karta hai perceived responsiveness ke liye, aur ek poori tarah separate nightly batch job chalata hai newly published case law ko pre-classify karne ke liye koi real-time requirement ke bina — is lesson ke teenon levers system ke us specific hisse pe applied jise har ek actually help karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How does prompt caching address a genuinely different cost source than choosing a cheaper model (Lesson 2)?',
        qHi: 'Prompt caching ek cheaper model choose karne se (Lesson 2) genuinely alag cost source kaise address karta hai?',
        a: "Model selection reduces cost by using a less expensive model for tasks that don't need more capability — a per-task-type decision. Prompt caching instead reduces the cost of REPEATED content sent across many calls (a static system prompt or document) that would otherwise be fully reprocessed every single time despite being identical — a complementary, not competing, lever addressing a different source of cost entirely.",
        aHi: 'Model selection un tasks ke liye ek less expensive model use karke cost kam karta hai jinhe zyada capability ki zaroorat nahi — ek per-task-type decision. Prompt caching iske bajaye REPEATED content ki cost kam karta hai jo kai calls ke across bheja jata hai (ek static system prompt ya document) jo otherwise identical hote hue bhi har single baar poori tarah reprocess hoga — ek complementary, competing nahi, lever jo cost ka ek poori tarah alag source address karta hai.',
      },
      {
        q: "Why is batching the wrong technique to apply to a real-time chat feature?",
        qHi: 'Ek real-time chat feature pe batching apply karna galat technique kyun hai?',
        a: "Batching's cost benefit comes from processing many requests together rather than each urgently, which typically trades some latency (results aren't immediate) for lower per-request cost. A chat feature genuinely needs an immediate response, so batching's latency tradeoff would directly conflict with the feature's actual requirement — batching is suited specifically to tasks with no real-time requirement, like an overnight bulk-processing job.",
        aHi: 'Batching ka cost benefit kai requests ko saath process karne se aata hai har ek ko urgently ke bajaye, jo typically kuch latency trade karta hai (results immediate nahi hote) lower per-request cost ke liye. Ek chat feature ko genuinely ek immediate response chahiye, isliye batching ka latency tradeoff directly feature ki actual requirement se conflict karega — batching specifically un tasks ke liye suited hai jinki koi real-time requirement nahi, jaise ek overnight bulk-processing job.',
      },
    ],

    exercises: [
      {
        task: "A team's AI feature sends the same 3,000-word company policy document as part of the system prompt on every single one of its 10,000 daily requests, using no caching. Using this lesson's reasoning, explain what's being wasted and how to fix it.",
        taskHi: 'Ek team ka AI feature apne 10,000 daily requests mein se har single ek ke hisse ki tarah system prompt mein wahi 3,000-word company policy document bhejta hai, koi caching use kiye bina. Is lesson ki reasoning use karke, explain karo ki kya waste ho raha hai aur ise kaise fix karein.',
        hint: "Consider whether this document's content changes between requests, and what specific technique from this lesson exists exactly for repeated, unchanging content.",
        hintHi: 'Consider karo ki kya is document ka content requests ke beech badalta hai, aur kaunsi specific technique is lesson se exactly repeated, unchanging content ke liye exist karti hai.',
      },
    ],

    keyTakeaways: [
      "Prompt caching reduces the cost of repeated, unchanging content (a static system prompt or document) sent across many calls — a different cost source than model selection, and complementary to it.",
      'Batching processes many non-urgent requests together for a lower per-request cost, typically trading some latency — the right tool specifically for tasks with no genuine real-time requirement, wrong for interactive features.',
      "Streaming's perceived-latency benefit (Module 4) is, in this module's framing, one deliberate lever among several — applied when a feature has a genuine real-time requirement, skipped when it doesn't (an unattended batch job).",
      'These three techniques, combined with Lesson 1\'s cost estimation and Lesson 2\'s model selection, form a complete, first-class cost/latency design discipline — actively managed throughout a feature\'s life, not discovered reactively from a bill or a slow experience.',
    ],
    keyTakeawaysHi: [
      'Prompt caching repeated, unchanging content (ek static system prompt ya document) ki cost kam karta hai jo kai calls ke across bheja jata hai — model selection se ek alag cost source, aur uske complementary.',
      'Batching kai non-urgent requests ko saath process karta hai ek lower per-request cost ke liye, typically kuch latency trade karte hue — un tasks ke liye specifically sahi tool jinki koi genuine real-time requirement nahi, interactive features ke liye galat.',
      "Streaming ka perceived-latency benefit (Module 4), is module ki framing mein, kai levers mein se ek deliberate lever hai — applied jab ek feature ko genuine real-time requirement hai, skipped jab nahi hai (ek unattended batch job).",
      'Ye teen techniques, Lesson 1 ke cost estimation aur Lesson 2 ke model selection ke saath combined, ek complete, first-class cost/latency design discipline banate hain — ek feature ki life mein actively managed, reactively ek bill ya ek slow experience se discover nahi kiya gaya.',
    ],
  },
];
