/**
 * Psychology for Developers — Module 18: A/B Testing & Behavioral Data, lessons 1-3.
 *
 * Lesson 1: Testing a psychological assumption instead of asserting it — a real, runnable
 *   two-proportion z-test for conversion-rate experiments.
 * Lesson 2: The peeking problem and p-hacking — why checking significance repeatedly inflates
 *   false-positive rate, with a runnable simulation.
 * Lesson 3: Statistical vs. practical significance, and underpowered tests — a runnable
 *   sample-size calculator.
 */

import type { CourseLesson } from './course-js-module1';

export const PSYCH_MODULE_18: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'psych-testing-not-asserting-ab-testing',
    title: 'Testing a Psychological Assumption Instead of Asserting It',
    titleHi: 'Ek Psychological Assumption Ko Assert Karne Ke Bajaye Test Karna',
    description:
      "Opening Part VII's shift to applying this course's findings at scale: every prior module presented well-documented, externally-validated psychological research — this lesson establishes the discipline of testing whether a specific finding actually holds in YOUR product, with a real, runnable statistical test for conversion-rate experiments.",
    descriptionHi:
      'Part VII ke is course ke findings ko scale pe apply karne ki taraf shift ko open karte hue: har prior module ne well-documented, externally-validated psychological research present ki — ye lesson us discipline ko establish karta hai ki test kiya jaaye ki kya ek specific finding actually TUMHARE product mein hold karti hai, conversion-rate experiments ke liye ek real, runnable statistical test ke saath.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A doctor who knows, from well-established general research, that a certain medication works for most patients with a given condition — but who still runs a specific blood test on THIS patient before prescribing it, because general research about people-in-general doesn't guarantee the specific effect in this specific person's specific circumstances.** A competent doctor doesn't dispute or re-derive the entire body of medical research before every prescription — the general finding that a class of medication is effective for a given condition is well-established and doesn't need to be personally re-proven from scratch each time. But the doctor still runs a specific test on this specific patient — checking for a drug interaction, an allergy, a dosage consideration specific to this person's weight or kidney function — because a well-established general finding about people-in-general is not a guarantee about this particular person's particular situation. This is exactly the discipline this lesson establishes for using this entire course's findings in an actual product: every module from 1 through 17 presented genuine, well-documented, externally-validated psychological research — the loss-aversion effect, the aesthetic-usability effect, the planning fallacy, all real, replicated findings, not guesses. But applying any one of them to a SPECIFIC product, with its specific users, its specific context, and its specific implementation of a pattern, is exactly like prescribing a well-established medication to a specific patient: the general finding is a strong, well-justified starting hypothesis, not a substitute for checking whether it actually holds in this specific case, which is exactly what a properly run A/B test does.",
      hi: 'ek doctor jo, well-established general research se jaanta hai, ki ek certain medication ek given condition ke most patients ke liye kaam karti hai — par phir bhi is patient pe ek specific blood test run karta hai use prescribe karne se pehle, kyunki people-in-general ke baare mein general research is specific person ki specific circumstances mein specific effect guarantee nahi karti. Ek competent doctor har prescription se pehle poori medical research ki body ko dispute ya re-derive nahi karta — general finding ki ek class ki medication ek given condition ke liye effective hai well-established hai aur use har baar personally scratch se re-prove karne ki zaroorat nahi hai. Par doctor phir bhi is specific patient pe ek specific test run karta hai — ek drug interaction check karta hai, ek allergy, ek dosage consideration jo is person ke weight ya kidney function ke liye specific hai — kyunki people-in-general ke baare mein ek well-established general finding is particular person ki particular situation ke baare mein ek guarantee nahi hai. Ye exactly wo discipline hai jise ye lesson establish karta hai poore is course ke findings ko ek actual product mein use karne ke liye: 1 se 17 tak har module ne genuine, well-documented, externally-validated psychological research present ki — loss-aversion effect, aesthetic-usability effect, planning fallacy, sab real, replicated findings, guesses nahi. Par unme se kisi ek ko ek SPECIFIC product pe apply karna, uske specific users, uske specific context, aur ek pattern ke uske specific implementation ke saath, exactly ek well-established medication ko ek specific patient ko prescribe karne jaisa hai: general finding ek strong, well-justified starting hypothesis hai, ye check karne ka ek substitute nahi ki kya ye actually is specific case mein hold karta hai, jo exactly wo hai jo ek properly run A/B test karta hai.',
    },

    simple: `**Why this lesson opens Part VII's shift from presenting research
to testing it in a specific product:**

\`\`\`
Modules 1-17 presented genuine, well-documented, externally-validated
psychological findings. This lesson establishes that applying any one
of them to a SPECIFIC product is a strong starting hypothesis, not a
guarantee — the discipline this course now introduces is testing
whether a specific finding actually holds here, rather than simply
asserting it because it's well-documented elsewhere.
\`\`\`

**A real, runnable statistical test for exactly this purpose — a
two-proportion z-test, the standard tool for a conversion-rate
experiment (e.g., testing Module 6's default-bias finding on an actual
signup flow):**

\`\`\`ts
function normalCdf(z) {
  // Standard normal CDF via the Abramowitz-Stegun erf approximation —
  // genuinely computes the actual probability, not a lookup table
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}

function twoProportionZTest(conversionsA, visitorsA, conversionsB, visitorsB) {
  const pA = conversionsA / visitorsA;
  const pB = conversionsB / visitorsB;
  const pPooled = (conversionsA + conversionsB) / (visitorsA + visitorsB);
  const standardError = Math.sqrt(pPooled * (1 - pPooled) * (1 / visitorsA + 1 / visitorsB));
  const zScore = (pB - pA) / standardError;
  const pValue = 2 * (1 - normalCdf(Math.abs(zScore))); // two-tailed
  return { conversionRateA: pA, conversionRateB: pB, zScore, pValue, isSignificantAt95: pValue < 0.05 };
}
\`\`\`

**Why this genuinely tests a specific claim rather than merely
describing an outcome — the test answers "could this difference have
arisen by chance alone," not just "which number was bigger":**

\`\`\`
Simply comparing pA to pB and picking the larger one ignores sample
size entirely — a difference between 50 conversions out of 100 and 55
out of 100 is far less trustworthy than an identical percentage-point
gap measured across 50,000 visitors each. The z-test accounts for this
directly: the standard error shrinks as sample size grows, meaning the
SAME observed gap produces a smaller p-value (more confidence it's
real) with a larger sample.
\`\`\`

**Applying this to a concrete case connecting back to Module 6's
sensible-defaults finding — testing whether a specific default choice
actually improves a specific product's completion rate:**

\`\`\`ts
// Testing Module 6's sensible-default pattern on an actual signup flow:
// variant A had no pre-selected plan, variant B pre-selected the most
// common plan as a genuinely accessible, easily-changed default
const result = twoProportionZTest(420, 5000, 490, 5000);
console.log(result);
// { conversionRateA: 0.084, conversionRateB: 0.098, zScore: ..., pValue: ..., isSignificantAt95: ... }
\`\`\`

**Why this lesson doesn't undermine Modules 1-17's findings but
completes them — the well-documented general research and the
specific-product test serve different, complementary roles:**

\`\`\`
The general research (e.g., default bias is real and well-replicated)
justifies WHY a specific hypothesis is worth testing in the first
place — it's not being discarded or doubted. The specific test then
confirms whether this well-justified hypothesis holds in THIS
product's specific context, exactly the way general medical research
justifies trying a specific medication while a specific test confirms
it's right for this patient.
\`\`\`

**How this lesson opens Module 18 and Part VII:** having completed
Part VI's focus on team psychology, this final part turns to applying
this course's findings rigorously at scale. This lesson establishes
the discipline of testing rather than asserting, with a real, runnable
statistical test — Lesson 2 addresses a specific, well-documented
pitfall in how that test gets misused (the peeking problem), and
Lesson 3 addresses statistical versus practical significance and
underpowered tests.`,

    simpleHi: `**Ye lesson Part VII ke research present karne se use ek specific
product mein test karne tak shift ko kaise open karta hai:**

\`\`\`
Modules 1-17 ne genuine, well-documented, externally-validated
psychological findings present kiye. Ye lesson establish karta hai ki
unme se kisi ek ko ek SPECIFIC product pe apply karna ek strong
starting hypothesis hai, ek guarantee nahi — jo discipline ye course
ab introduce karta hai wo ye test karna hai ki kya ek specific finding
actually yahan hold karti hai, use simply assert karne ke bajaye
kyunki wo doosri jagah well-documented hai.
\`\`\`

**Exactly is purpose ke liye ek real, runnable statistical test — ek
two-proportion z-test, ek conversion-rate experiment ke liye standard
tool (jaise, Module 6 ke default-bias finding ko ek actual signup flow
pe test karna):**

\`\`\`ts
function normalCdf(z) {
  // Standard normal CDF Abramowitz-Stegun erf approximation ke
  // through — genuinely actual probability compute karta hai, ek
  // lookup table nahi
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}

function twoProportionZTest(conversionsA, visitorsA, conversionsB, visitorsB) {
  const pA = conversionsA / visitorsA;
  const pB = conversionsB / visitorsB;
  const pPooled = (conversionsA + conversionsB) / (visitorsA + visitorsB);
  const standardError = Math.sqrt(pPooled * (1 - pPooled) * (1 / visitorsA + 1 / visitorsB));
  const zScore = (pB - pA) / standardError;
  const pValue = 2 * (1 - normalCdf(Math.abs(zScore))); // two-tailed
  return { conversionRateA: pA, conversionRateB: pB, zScore, pValue, isSignificantAt95: pValue < 0.05 };
}
\`\`\`

**Ye genuinely ek specific claim test kyun karta hai sirf ek outcome
describe karne ke bajaye — test answer karta hai "kya ye difference
chance akele se arise ho sakti thi," sirf "kaunsa number bada tha" nahi:**

\`\`\`
Simply pA ko pB se compare karna aur larger wale ko pick karna sample
size ko entirely ignore karta hai — 100 mein se 50 conversions aur 100
mein se 55 ke beech ek difference us identical percentage-point gap se
kaafi kam trustworthy hai jo 50,000 visitors ke across measured hai har
ek ke liye. Z-test isko directly account karta hai: standard error
sample size grow karte hue shrink hota hai, matlab WAHI observed gap ek
larger sample ke saath ek smaller p-value (zyada confidence ki ye real
hai) produce karta hai.
\`\`\`

**Ise ek concrete case pe apply karna directly Module 6 ke sensible-
defaults finding se connect karte hue — test karna ki kya ek specific
default choice actually ek specific product ki completion rate improve
karti hai:**

\`\`\`ts
// Module 6 ke sensible-default pattern ko ek actual signup flow pe
// test karna: variant A mein koi pre-selected plan nahi tha, variant
// B ne sabse common plan ko ek genuinely accessible, easily-changed
// default ki tarah pre-select kiya
const result = twoProportionZTest(420, 5000, 490, 5000);
console.log(result);
// { conversionRateA: 0.084, conversionRateB: 0.098, zScore: ..., pValue: ..., isSignificantAt95: ... }
\`\`\`

**Ye lesson Modules 1-17 ki findings ko kyun undermine nahi karta balki
unhe complete karta hai — well-documented general research aur
specific-product test different, complementary roles serve karte hain:**

\`\`\`
General research (jaise, default bias real hai aur well-replicated hai)
justify karti hai ki ek specific hypothesis pehli jagah pe test karne
layak kyun hai — ise discard ya doubt nahi kiya ja raha. Specific test
phir confirm karta hai ki kya ye well-justified hypothesis is
product ke specific context mein hold karti hai, exactly us tarike se
jaise general medical research ek specific medication try karne ko
justify karti hai jabki ek specific test confirm karta hai ki ye is
patient ke liye sahi hai.
\`\`\`

**Ye lesson Module 18 aur Part VII ko kaise open karta hai:** Part VI
ke team psychology pe focus complete karne ke baad, ye final part is
course ke findings ko rigorously scale pe apply karne ki taraf move
karta hai. Ye lesson assert karne ke bajaye test karne ki discipline
establish karta hai, ek real, runnable statistical test ke saath —
Lesson 2 ek specific, well-documented pitfall ko address karta hai is
baat mein ki wo test kaise misuse hota hai (peeking problem), aur
Lesson 3 statistical versus practical significance aur underpowered
tests ko address karta hai.`,

    content: `## Why this lesson opens Part VII's shift from presenting research
to rigorously testing it in a specific product

Modules 1 through 17 presented genuine, well-documented, externally-
validated psychological findings — the loss-aversion effect, the
aesthetic-usability effect, the planning fallacy, and dozens more, all
real, replicated research rather than guesses. This lesson establishes
that applying any one of these findings to a specific product, with its
specific users and its specific implementation of a pattern, is a
strong, well-justified starting hypothesis rather than a guarantee. The
discipline this final part of the course introduces is testing whether
a specific finding actually holds here, rather than simply asserting it
because it is well-documented elsewhere.

## Why a two-proportion z-test is the correct, genuinely runnable
statistical tool for this purpose

A conversion-rate experiment — comparing whether variant A or variant B
produces a higher completion rate — requires a statistical test that
properly accounts for sample size, not simply a comparison of the two
raw percentages. The two-proportion z-test computes the standard error
of the difference between two observed proportions, converts the
observed difference into a z-score, and derives a p-value using the
standard normal distribution's cumulative distribution function — a
genuine statistical computation, not an approximation or a lookup
table, using the well-established Abramowitz-Stegun approximation for
the error function underlying the normal CDF.

## Why this test answers a fundamentally different question than
simply comparing which number is larger

Comparing two raw conversion percentages and declaring the larger one
the "winner" ignores sample size entirely: a percentage-point gap
measured across a small sample is far less trustworthy than an
identical gap measured across a much larger one, since a small sample
is much more susceptible to producing an apparent difference by chance
alone. The z-test's standard-error calculation directly incorporates
sample size, meaning the same observed gap produces a smaller p-value
— stronger evidence the difference is genuine rather than chance — as
the sample size grows.

## Why applying this test to a specific product feature directly
completes rather than contradicts this course's prior findings

Testing whether a sensible-default pattern (Module 6) actually improves
completion rate on a specific signup flow doesn't dispute or re-derive
the general research establishing that default bias is a real,
well-documented psychological effect. The general research justifies
why this specific hypothesis is worth testing in the first place — it
gives a well-founded reason to expect an effect, rather than testing
patterns at random. The specific test then confirms whether this
well-justified hypothesis holds in this product's specific context,
with its specific users and specific implementation details that the
general research could not have accounted for in advance.

## Why the general research and the specific test serve genuinely
complementary, not competing, roles

This lesson's discipline doesn't mean every psychological finding in
this course needs independent re-validation before it can be trusted
at all — the underlying research is well-established and doesn't need
to be personally re-proven from scratch. Rather, the specific test
confirms that a well-justified expectation actually manifests in this
particular implementation, exactly the way a doctor's specific blood
test confirms that an already well-established medication is right for
this particular patient, without needing to re-run the entire clinical
trial history behind the medication first.

## How this lesson opens Module 18 and Part VII

Having completed Part VI's focus on team psychology, this final part
turns to applying this course's findings rigorously at scale. This
lesson establishes the discipline of testing rather than asserting,
with a real, runnable two-proportion z-test as the concrete tool.
Lesson 2 addresses a specific, well-documented pitfall in how this test
gets misused in practice — the peeking problem — and Lesson 3 addresses
the distinction between statistical and practical significance, along
with the risk of underpowered tests.`,

    contentHi: `## Ye lesson Part VII ke research present karne se ise ek specific product mein rigorously test karne tak shift ko kyun open karta hai

Modules 1 se 17 tak ne genuine, well-documented, externally-validated
psychological findings present kiye — loss-aversion effect, aesthetic-
usability effect, planning fallacy, aur dozens more, sab real,
replicated research guesses ke bajaye. Ye lesson establish karta hai ki
in findings mein se kisi ek ko ek specific product pe apply karna,
uske specific users aur ek pattern ke uske specific implementation ke
saath, ek strong, well-justified starting hypothesis hai ek guarantee
nahi. Discipline jo is course ka final part introduce karta hai wo ye
test karna hai ki kya ek specific finding actually yahan hold karti
hai, use simply assert karne ke bajaye kyunki wo doosri jagah well-
documented hai.

## Ek two-proportion z-test is purpose ke liye correct, genuinely runnable statistical tool kyun hai

Ek conversion-rate experiment — compare karna ki kya variant A ya
variant B ek higher completion rate produce karta hai — ko ek statistical
test chahiye jo properly sample size account karta hai, sirf do raw
percentages ka comparison nahi. Two-proportion z-test do observed
proportions ke beech difference ka standard error compute karta hai,
observed difference ko ek z-score mein convert karta hai, aur standard
normal distribution ke cumulative distribution function use karke ek
p-value derive karta hai — ek genuine statistical computation, ek
approximation ya lookup table nahi, well-established Abramowitz-Stegun
approximation use karte hue normal CDF ke underlying error function ke
liye.

## Ye test simply kaunsa number bada hai compare karne se fundamentally different question kyun answer karta hai

Do raw conversion percentages compare karna aur larger wale ko
"winner" declare karna sample size ko entirely ignore karta hai: ek
small sample ke across measured ek percentage-point gap ek much larger
sample ke across measured identical gap se kaafi kam trustworthy hai,
kyunki ek small sample chance akele se ek apparent difference produce
karne ke liye kaafi zyada susceptible hai. Z-test ki standard-error
calculation directly sample size incorporate karti hai, matlab wahi
observed gap ek smaller p-value produce karta hai — stronger evidence
ki difference genuine hai chance ke bajaye — jaise sample size grow
karta hai.

## Is test ko ek specific product feature pe apply karna directly is course ke prior findings ko contradict karne ke bajaye kyun complete karta hai

Ye test karna ki kya ek sensible-default pattern (Module 6) actually
ek specific signup flow pe completion rate improve karta hai general
research ko dispute ya re-derive nahi karta jo establish karti hai ki
default bias ek real, well-documented psychological effect hai.
General research justify karti hai ki ye specific hypothesis pehli
jagah pe test karne layak kyun hai — ye ek effect expect karne ka ek
well-founded reason deti hai, patterns ko randomly test karne ke
bajaye. Specific test phir confirm karta hai ki kya ye well-justified
hypothesis is product ke specific context mein hold karti hai, uske
specific users aur specific implementation details ke saath jinhe
general research advance mein account nahi kar sakti thi.

## General research aur specific test genuinely complementary, competing nahi, roles kyun serve karte hain

Is lesson ki discipline ka matlab ye nahi hai ki is course ka har
psychological finding ko independent re-validation chahiye us se pehle
ki ise bilkul trust kiya jaaye — underlying research well-established
hai aur use personally scratch se re-prove karne ki zaroorat nahi hai.
Balki, specific test confirm karta hai ki ek well-justified expectation
actually is particular implementation mein manifest hoti hai, exactly
us tarike se jaise ek doctor ka specific blood test confirm karta hai
ki ek already well-established medication is particular patient ke
liye sahi hai, medication ke peeche entire clinical trial history ko
pehle re-run kiye bina.

## Ye lesson Module 18 aur Part VII ko kaise open karta hai

Part VI ke team psychology pe focus complete karne ke baad, ye final
part is course ke findings ko rigorously scale pe apply karne ki taraf
move karta hai. Ye lesson assert karne ke bajaye test karne ki
discipline establish karta hai, ek real, runnable two-proportion z-test
ko concrete tool ki tarah use karte hue. Lesson 2 ek specific, well-
documented pitfall address karta hai is baat mein ki ye test practice
mein kaise misuse hota hai — peeking problem — aur Lesson 3 statistical
aur practical significance ke beech distinction address karta hai,
underpowered tests ke risk ke saath.`,

    examples: [
      {
        title: 'A complete, genuinely runnable two-proportion z-test applied to a real signup-flow default-bias experiment',
        titleHi: "Ek complete, genuinely runnable two-proportion z-test jo ek real signup-flow default-bias experiment pe applied hai",
        codeJs: `function normalCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}

function twoProportionZTest(conversionsA, visitorsA, conversionsB, visitorsB) {
  const pA = conversionsA / visitorsA;
  const pB = conversionsB / visitorsB;
  const pPooled = (conversionsA + conversionsB) / (visitorsA + visitorsB);
  const standardError = Math.sqrt(pPooled * (1 - pPooled) * (1 / visitorsA + 1 / visitorsB));
  const zScore = (pB - pA) / standardError;
  const pValue = 2 * (1 - normalCdf(Math.abs(zScore)));
  return {
    conversionRateA: Number(pA.toFixed(4)),
    conversionRateB: Number(pB.toFixed(4)),
    zScore: Number(zScore.toFixed(3)),
    pValue: Number(pValue.toFixed(4)),
    isSignificantAt95: pValue < 0.05,
  };
}

// Testing Module 6's sensible-default pattern: variant A (no
// pre-selected plan) vs variant B (most common plan pre-selected,
// genuinely easy to change) — a small early sample
console.log(twoProportionZTest(42, 500, 49, 500));
// { conversionRateA: 0.084, conversionRateB: 0.098, zScore: 0.77, pValue: 0.4415, isSignificantAt95: false }

// The same percentage-point gap, but with a 10x larger sample
console.log(twoProportionZTest(420, 5000, 490, 5000));
// { conversionRateA: 0.084, conversionRateB: 0.098, zScore: 2.434, pValue: 0.0149, isSignificantAt95: true }`,
        codeTs: `function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}

interface ZTestResult {
  conversionRateA: number;
  conversionRateB: number;
  zScore: number;
  pValue: number;
  isSignificantAt95: boolean;
}

function twoProportionZTest(
  conversionsA: number,
  visitorsA: number,
  conversionsB: number,
  visitorsB: number
): ZTestResult {
  const pA = conversionsA / visitorsA;
  const pB = conversionsB / visitorsB;
  const pPooled = (conversionsA + conversionsB) / (visitorsA + visitorsB);
  const standardError = Math.sqrt(pPooled * (1 - pPooled) * (1 / visitorsA + 1 / visitorsB));
  const zScore = (pB - pA) / standardError;
  const pValue = 2 * (1 - normalCdf(Math.abs(zScore)));
  return {
    conversionRateA: Number(pA.toFixed(4)),
    conversionRateB: Number(pB.toFixed(4)),
    zScore: Number(zScore.toFixed(3)),
    pValue: Number(pValue.toFixed(4)),
    isSignificantAt95: pValue < 0.05,
  };
}

// Testing Module 6's sensible-default pattern: variant A (no
// pre-selected plan) vs variant B (most common plan pre-selected,
// genuinely easy to change) — a small early sample
console.log(twoProportionZTest(42, 500, 49, 500));
// { conversionRateA: 0.084, conversionRateB: 0.098, zScore: 0.77, pValue: 0.4415, isSignificantAt95: false }

// The same percentage-point gap, but with a 10x larger sample
console.log(twoProportionZTest(420, 5000, 490, 5000));
// { conversionRateA: 0.084, conversionRateB: 0.098, zScore: 2.434, pValue: 0.0149, isSignificantAt95: true }`,
        code: `const zScore = (pB - pA) / standardError;
const pValue = 2 * (1 - normalCdf(Math.abs(zScore)));
// a genuine statistical computation of how likely this gap is to arise by chance alone`,
        output:
          "At n=500 per group, the identical percentage-point gap (8.4% vs 9.8%) produces a p-value of 0.4415, nowhere near the conventional 0.05 significance threshold; at n=5,000 per group, the SAME percentage-point gap becomes clearly significant (p=0.0149), demonstrating concretely that sample size, not just the raw gap, determines confidence.",
        explain:
          "This example operationalizes the lesson's central claim with real numbers: it shows that an identical observed effect size produces dramatically different statistical confidence depending on sample size, directly illustrating why simply comparing two percentages without accounting for sample size is an unreliable way to test whether a psychological finding actually holds in a specific product.",
        explainHi:
          "Ye example lesson ke central claim ko real numbers ke saath operationalize karta hai: ye dikhata hai ki ek identical observed effect size sample size pe depend karte hue dramatically different statistical confidence produce karta hai, directly illustrate karte hue ki simply do percentages compare karna sample size account kiye bina ye test karne ka ek unreliable tareeka hai ki kya ek psychological finding actually ek specific product mein hold karti hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Declaring a "winner" by simply comparing two raw percentages,
// ignoring sample size entirely
function declareWinnerWrong(conversionsA, visitorsA, conversionsB, visitorsB) {
  const pA = conversionsA / visitorsA;
  const pB = conversionsB / visitorsB;
  return pB > pA ? 'B wins' : 'A wins';
  // A tiny sample (say, 5 conversions out of 50) can easily produce a
  // higher raw percentage purely by chance — this comparison provides
  // zero information about whether the difference is genuine
}`,
        right: `// Using a proper statistical test that accounts for sample size
function declareWinnerRight(conversionsA, visitorsA, conversionsB, visitorsB) {
  const result = twoProportionZTest(conversionsA, visitorsA, conversionsB, visitorsB);
  if (!result.isSignificantAt95) {
    return 'no significant difference detected — do not declare a winner yet';
  }
  return result.conversionRateB > result.conversionRateA ? 'B wins' : 'A wins';
}`,
        why: "Simply comparing two raw percentages without a proper statistical test ignores sample size entirely, meaning a difference that arose purely by chance in a small sample can be mistakenly declared a genuine winner — the z-test's p-value specifically quantifies how likely the observed gap is to have arisen by chance alone, which a raw comparison cannot do.",
        whyHi:
          "Simply do raw percentages ko ek proper statistical test ke bina compare karna sample size ko entirely ignore karta hai, matlab ek difference jo purely chance se ek small sample mein arise hui mistakenly ek genuine winner declare ki ja sakti hai — z-test ka p-value specifically quantify karta hai ki observed gap ke chance akele se arise hone ki kitni likelihood hai, jo ek raw comparison nahi kar sakta.",
      },
    ],

    realWorld: [
      {
        en: "A production SaaS company's growth team initially declared a checkout redesign a 'winner' after one week based on a raw 2-percentage-point conversion lift with only a few hundred visitors per variant, then discovered after running a proper z-test that the p-value was 0.31 — far from significant — and the apparent lift disappeared entirely once the sample grew to several thousand visitors per variant, saving the team from shipping a change with no genuine effect.",
        hi: "Ek production SaaS company ki growth team ne initially ek checkout redesign ko ek week ke baad ek 'winner' declare kiya ek raw 2-percentage-point conversion lift ke basis pe sirf kuch sau visitors per variant ke saath, phir ek proper z-test run karne ke baad discover kiya ki p-value 0.31 tha — significant se kaafi door — aur apparent lift entirely disappear ho gaya ek baar sample kai thousand visitors per variant tak grow hua, team ko koi genuine effect wale ek change ko ship karne se bachate hue.",
      },
    ],

    interviewQA: [
      {
        q: "Why is it a mistake to declare an A/B test 'winner' by simply comparing two raw conversion percentages?",
        qHi: 'Ek A/B test "winner" declare karna simply do raw conversion percentages compare karke ek mistake kyun hai?',
        a: "This ignores sample size entirely. A difference between two small samples can easily arise purely by chance, while an identical percentage-point gap measured across a much larger sample is far more trustworthy. A proper statistical test (like a two-proportion z-test) quantifies how likely the observed gap is to be genuine versus chance, which a raw comparison cannot do.",
        aHi: 'Ye sample size ko entirely ignore karta hai. Do small samples ke beech ek difference easily purely chance se arise ho sakti hai, jabki ek much larger sample ke across measured identical percentage-point gap kaafi zyada trustworthy hai. Ek proper statistical test (jaise ek two-proportion z-test) quantify karta hai ki observed gap genuine hai ya chance, jo ek raw comparison nahi kar sakta.',
      },
      {
        q: "Why does testing a specific psychological finding (like default bias) in a specific product not contradict or dispute the general research behind that finding?",
        qHi: 'Ek specific product mein ek specific psychological finding (jaise default bias) test karna us finding ke peeche general research ko contradict ya dispute kyun nahi karta?',
        a: "The general research justifies why a specific hypothesis is worth testing in the first place — it's a well-founded reason to expect an effect, not something being doubted. The specific test then confirms whether this well-justified hypothesis holds in this particular product's specific context, exactly the way a doctor's specific blood test confirms a well-established medication is right for a particular patient without re-running the medication's clinical trial history.",
        aHi: 'General research justify karti hai ki ek specific hypothesis pehli jagah pe test karne layak kyun hai — ye ek effect expect karne ka ek well-founded reason hai, kuch doubt kiya ja raha nahi. Specific test phir confirm karta hai ki kya ye well-justified hypothesis is particular product ke specific context mein hold karti hai, exactly us tarike se jaise ek doctor ka specific blood test confirm karta hai ek well-established medication ek particular patient ke liye sahi hai medication ki clinical trial history re-run kiye bina.',
      },
    ],

    exercises: [
      {
        task: "Using the twoProportionZTest function from this lesson, test whether a variant with 150 conversions out of 2,000 visitors is significantly different from a control with 120 conversions out of 2,000 visitors. Report the p-value and explain whether you would recommend shipping the variant.",
        taskHi: 'Is lesson ke twoProportionZTest function use karke, test karo ki kya ek variant jiske 2,000 visitors mein se 150 conversions hain control se significantly different hai jiske 2,000 visitors mein se 120 conversions hain. p-value report karo aur explain karo ki kya tum variant ko ship karne ki recommend karoge.',
        hint: "Call twoProportionZTest(120, 2000, 150, 2000) and check the isSignificantAt95 field — think about what you'd want to do differently (e.g., run longer to collect more data) if the result is not significant, rather than shipping based on the raw percentage difference alone.",
        hintHi: 'twoProportionZTest(120, 2000, 150, 2000) call karo aur isSignificantAt95 field check karo — socho ki agar result significant nahi hai to tum kya differently karna chahoge (jaise, zyada data collect karne ke liye longer run karna), sirf raw percentage difference ke basis pe ship karne ke bajaye.',
      },
    ],

    keyTakeaways: [
      "This course's findings (Modules 1-17) are genuine, well-documented, externally-validated research — but applying any one to a specific product is a well-justified hypothesis, not a guarantee, requiring an actual test.",
      "A two-proportion z-test is the correct, genuinely runnable statistical tool for a conversion-rate experiment — it properly accounts for sample size, unlike a raw percentage comparison.",
      "The same observed percentage-point gap produces very different statistical confidence depending on sample size — a small sample can easily produce an apparent difference by chance alone.",
      "General research and specific testing serve complementary roles: the research justifies why a hypothesis is worth testing; the test confirms whether it holds in this specific implementation.",
    ],
    keyTakeawaysHi: [
      'Is course ki findings (Modules 1-17) genuine, well-documented, externally-validated research hain — par unme se kisi ek ko ek specific product pe apply karna ek well-justified hypothesis hai, ek guarantee nahi, ek actual test maangte hue.',
      'Ek two-proportion z-test ek conversion-rate experiment ke liye correct, genuinely runnable statistical tool hai — ye properly sample size account karta hai, ek raw percentage comparison ke unlike.',
      'Wahi observed percentage-point gap sample size pe depend karte hue bahut different statistical confidence produce karta hai — ek small sample easily purely chance se ek apparent difference produce kar sakta hai.',
      'General research aur specific testing complementary roles serve karte hain: research justify karti hai ki ek hypothesis test karne layak kyun hai; test confirm karta hai ki kya ye is specific implementation mein hold karti hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'psych-peeking-problem-p-hacking',
    title: 'The Peeking Problem and P-Hacking',
    titleHi: 'The Peeking Problem Aur P-Hacking',
    description:
      "A specific, well-documented statistical pitfall in how Lesson 1's z-test gets misused in practice: checking significance repeatedly during an experiment inflates the false-positive rate far beyond the nominal 5%, demonstrated with a real, runnable simulation.",
    descriptionHi:
      'Ek specific, well-documented statistical pitfall is baat mein ki Lesson 1 ka z-test practice mein kaise misuse hota hai: ek experiment ke dauran repeatedly significance check karna false-positive rate ko nominal 5% se kaafi zyada inflate karta hai, ek real, runnable simulation ke saath demonstrated.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A gambler who agrees to a single coin flip to decide a bet, genuinely accepting a fair 50/50 risk — but who then insists on re-flipping every time the result goes against them, calling it a 'do-over,' until the coin eventually lands their way, at which point they declare victory and stop, having secretly turned a fair 50/50 bet into something they were near-certain to win.** A single, fair coin flip genuinely carries a 50% chance for either side. If a gambler agrees to settle a bet with exactly one flip and simply accepts whatever the single flip shows, that 50/50 risk is genuine. But a gambler who instead flips repeatedly, discarding every unfavorable result as a 'do-over' and stopping the instant a favorable result appears, is running an entirely different process — one where the probability of eventually landing on their preferred side approaches certainty the longer they're willing to keep flipping, even though each INDIVIDUAL flip is still a fair, unbiased 50/50 event. This is exactly the mechanism behind the peeking problem in A/B testing: a properly designed test that checks significance exactly once, after a pre-determined sample size is reached, genuinely has only a 5% chance of a false positive at the standard significance threshold. But a team that instead checks the p-value every day, and stops the experiment the moment it happens to dip below 0.05 — treating each day's check as a fresh, independent 'flip' — is running the equivalent of the dishonest gambler's repeated-flip process: the true probability of a false positive climbs far above 5% the more often the p-value is checked, even though the underlying statistical machinery (Lesson 1's z-test) is being computed correctly at every single check.",
      hi: 'ek gambler jo ek single coin flip ko ek bet decide karne ke liye agree karta hai, genuinely ek fair 50/50 risk accept karte hue — par phir jab bhi result unke against jaata hai re-flip karne pe insist karta hai, ise "do-over" kehte hue, jab tak coin eventually unki taraf land nahi karta, us point pe wo victory declare karta hai aur stop karta hai, secretly ek fair 50/50 bet ko kuch aisa banate hue jise wo near-certain the win karne ke liye. Ek single, fair coin flip genuinely ek 50% chance dono side ke liye carry karta hai. Agar ek gambler exactly ek flip ke saath ek bet settle karne ke liye agree karta hai aur simply jo single flip dikhata hai use accept karta hai, wo 50/50 risk genuine hai. Par ek gambler jo iske bajaye repeatedly flip karta hai, har unfavorable result ko ek "do-over" ki tarah discard karte hue aur ek favorable result appear hone ke instant stop karte hue, ek entirely different process run kar raha hai — ek jahan unki preferred side pe eventually land karne ki probability certainty ke close aati hai jitni der wo keep flipping karne ko willing hain, chahe har INDIVIDUAL flip abhi bhi ek fair, unbiased 50/50 event hai. Ye exactly wo mechanism hai peeking problem ke peeche A/B testing mein: ek properly designed test jo exactly ek baar significance check karta hai, ek pre-determined sample size reach hone ke baad, genuinely standard significance threshold pe ek false positive ka sirf 5% chance rakhta hai. Par ek team jo iske bajaye har din p-value check karti hai, aur experiment ko us moment stop karti hai jab ye 0.05 se neeche dip karta hai — har din ke check ko ek fresh, independent "flip" ki tarah treat karte hue — dishonest gambler ke repeated-flip process ke equivalent run kar rahi hai: false positive ki true probability 5% se kaafi upar climb karti hai jitna zyada aksar p-value check kiya jaata hai, chahe underlying statistical machinery (Lesson 1 ka z-test) har single check pe correctly compute ki ja rahi hai.',
    },

    simple: `**Why this lesson identifies a specific misuse of Lesson 1's
correctly-implemented z-test, not a flaw in the test itself:**

\`\`\`
Lesson 1's z-test, computed correctly once at a predetermined sample
size, genuinely produces a 5% false-positive rate at the standard 0.05
threshold. This lesson establishes a specific, well-documented misuse:
checking significance repeatedly during data collection, and stopping
as soon as it crosses the threshold, inflates the TRUE false-positive
rate far beyond 5%, even though each individual check is computed
correctly.
\`\`\`

**A real, runnable simulation demonstrating the peeking problem's
actual inflation of the false-positive rate — this doesn't just
describe the effect, it computes it directly:**

\`\`\`ts
function simulateNoRealEffectExperiment(dailyVisitorsPerVariant, trueConversionRate, numDays) {
  // Both variants have the IDENTICAL true conversion rate — there is
  // no real effect. Any "significant" result found is, by
  // construction, a genuine false positive
  let conversionsA = 0, conversionsB = 0, visitorsA = 0, visitorsB = 0;
  let foundSignificantEarly = false;
  for (let day = 1; day <= numDays; day++) {
    for (let i = 0; i < dailyVisitorsPerVariant; i++) {
      if (Math.random() < trueConversionRate) conversionsA++;
      if (Math.random() < trueConversionRate) conversionsB++;
    }
    visitorsA += dailyVisitorsPerVariant;
    visitorsB += dailyVisitorsPerVariant;
    const result = twoProportionZTest(conversionsA, visitorsA, conversionsB, visitorsB);
    if (result.isSignificantAt95) {
      foundSignificantEarly = true;
      break; // this is exactly the "peeking and stopping" behavior
    }
  }
  return foundSignificantEarly;
}

function measurePeekingInflation(numSimulations) {
  let falsePositives = 0;
  for (let i = 0; i < numSimulations; i++) {
    if (simulateNoRealEffectExperiment(100, 0.1, 30)) falsePositives++;
  }
  return { observedFalsePositiveRate: falsePositives / numSimulations, nominalRate: 0.05 };
  // With NO real effect and daily peeking, this observed rate comes
  // out well above 0.05 — a direct, computed demonstration
}
\`\`\`

**Why the correct fix is a predetermined sample size (or a
statistically valid sequential-testing method), not simply "checking
less often":**

\`\`\`
The peeking problem isn't solved by checking significance weekly
instead of daily — any repeated checking with a stopping rule based on
crossing the threshold still inflates the false-positive rate,
just less severely. The statistically valid fix is committing to a
sample size in advance (calculated using Lesson 3's methods) and
checking significance exactly once, after that sample size is reached
— or using a purpose-built sequential-testing statistical method
designed specifically to allow valid repeated checking, which ordinary
z-tests are not.
\`\`\`

**A concrete, checkable distinction — p-hacking as the broader pattern
this lesson's peeking problem is one specific instance of:**

\`\`\`ts
function auditForPHacking(experimentProcess) {
  const redFlags = [];
  if (experimentProcess.stoppedAsSoonAsSignificant) redFlags.push('peeking: stopped the moment p < 0.05 appeared');
  if (experimentProcess.testedManyMetricsReportedOnlySignificantOnes) redFlags.push('multiple comparisons without correction');
  if (experimentProcess.excludedDataAfterSeeingResults) redFlags.push('post-hoc data exclusion');
  return { redFlags, isPHacking: redFlags.length > 0 };
}
\`\`\`

**Why this lesson's finding directly connects back to this course's
own standard of intellectual honesty, established across Modules 6-9's
legitimacy arc:**

\`\`\`
Just as Module 9 established that a persuasion technique must be
genuinely honest to be legitimate, this lesson establishes that a
statistical claim of "significance" must be genuinely, validly derived
to be honest — a p-value obtained through peeking is not a
straightforward lie, but it is a specific, well-documented way a
technically-computed number can mislead, and this course holds its own
statistical claims to the same honesty standard it has applied
throughout.
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established the
two-proportion z-test as the correct tool for testing a specific
psychological finding in a specific product. This lesson establishes a
specific, well-documented way that correctly-computed tool gets misused
in practice — the peeking problem — with a runnable simulation directly
demonstrating the inflation. Lesson 3 closes the module with
statistical versus practical significance and underpowered tests.`,

    simpleHi: `**Ye lesson Lesson 1 ke correctly-implemented z-test ka ek specific
misuse kyun identify karta hai, test khud mein ek flaw nahi:**

\`\`\`
Lesson 1 ka z-test, correctly ek predetermined sample size pe ek baar
compute kiya gaya, genuinely standard 0.05 threshold pe ek 5% false-
positive rate produce karta hai. Ye lesson ek specific, well-documented
misuse establish karta hai: data collection ke dauran repeatedly
significance check karna, aur jaise hi ye threshold cross kare stop
karna, TRUE false-positive rate ko 5% se kaafi upar inflate karta hai,
chahe har individual check correctly compute kiya ja raha ho.
\`\`\`

**Ek real, runnable simulation jo peeking problem ke false-positive
rate ke actual inflation ko demonstrate karti hai — ye sirf effect
describe nahi karta, ise directly compute karta hai:**

\`\`\`ts
function simulateNoRealEffectExperiment(dailyVisitorsPerVariant, trueConversionRate, numDays) {
  // Dono variants ki IDENTICAL true conversion rate hai — koi real
  // effect nahi hai. Koi bhi "significant" result jo milta hai,
  // construction se, ek genuine false positive hai
  let conversionsA = 0, conversionsB = 0, visitorsA = 0, visitorsB = 0;
  let foundSignificantEarly = false;
  for (let day = 1; day <= numDays; day++) {
    for (let i = 0; i < dailyVisitorsPerVariant; i++) {
      if (Math.random() < trueConversionRate) conversionsA++;
      if (Math.random() < trueConversionRate) conversionsB++;
    }
    visitorsA += dailyVisitorsPerVariant;
    visitorsB += dailyVisitorsPerVariant;
    const result = twoProportionZTest(conversionsA, visitorsA, conversionsB, visitorsB);
    if (result.isSignificantAt95) {
      foundSignificantEarly = true;
      break; // ye exactly "peeking and stopping" behavior hai
    }
  }
  return foundSignificantEarly;
}

function measurePeekingInflation(numSimulations) {
  let falsePositives = 0;
  for (let i = 0; i < numSimulations; i++) {
    if (simulateNoRealEffectExperiment(100, 0.1, 30)) falsePositives++;
  }
  return { observedFalsePositiveRate: falsePositives / numSimulations, nominalRate: 0.05 };
  // NO real effect aur daily peeking ke saath, ye observed rate 0.05
  // se kaafi upar aata hai — ek direct, computed demonstration
}
\`\`\`

**Correct fix ek predetermined sample size (ya ek statistically valid
sequential-testing method) kyun hai, simply "kam aksar check karna"
nahi:**

\`\`\`
Peeking problem daily ke bajaye weekly significance check karke solve
nahi hoti — koi bhi repeated checking ek stopping rule ke saath jo
threshold cross karne pe based hai abhi bhi false-positive rate inflate
karti hai, sirf less severely. Statistically valid fix advance mein ek
sample size commit karna hai (Lesson 3 ke methods use karke calculated)
aur exactly ek baar significance check karna hai, us sample size reach
hone ke baad — ya ek purpose-built sequential-testing statistical
method use karna jo specifically valid repeated checking allow karne ke
liye design kiya gaya hai, jo ordinary z-tests nahi hain.
\`\`\`

**Ek concrete, checkable distinction — p-hacking us broader pattern ki
tarah jiska is lesson ka peeking problem ek specific instance hai:**

\`\`\`ts
function auditForPHacking(experimentProcess) {
  const redFlags = [];
  if (experimentProcess.stoppedAsSoonAsSignificant) redFlags.push('peeking: stopped the moment p < 0.05 appeared');
  if (experimentProcess.testedManyMetricsReportedOnlySignificantOnes) redFlags.push('multiple comparisons without correction');
  if (experimentProcess.excludedDataAfterSeeingResults) redFlags.push('post-hoc data exclusion');
  return { redFlags, isPHacking: redFlags.length > 0 };
}
\`\`\`

**Ye lesson ki finding directly wapas is course ke intellectual
honesty ke apne standard se kaise connect karti hai, Modules 6-9 ke
legitimacy arc ke across established:**

\`\`\`
Jaise Module 9 ne establish kiya ki ek persuasion technique ko
legitimate hone ke liye genuinely honest hona chahiye, ye lesson
establish karta hai ki "significance" ka ek statistical claim honest
hone ke liye genuinely, validly derive hona chahiye — peeking ke through
obtain kiya gaya ek p-value ek straightforward lie nahi hai, par ye ek
specific, well-documented tareeka hai jise ek technically-computed
number mislead kar sakta hai, aur ye course apne khud ke statistical
claims ko wahi honesty standard pe hold karta hai jo ise throughout
apply kiya hai.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne
two-proportion z-test ko ek specific product mein ek specific
psychological finding test karne ke liye correct tool ki tarah
establish kiya. Ye lesson ek specific, well-documented tareeka
establish karta hai jise wo correctly-computed tool practice mein
misuse hota hai — peeking problem — ek runnable simulation ke saath
directly inflation demonstrate karte hue. Lesson 3 statistical versus
practical significance aur underpowered tests ke saath module ko close
karta hai.`,

    content: `## Why this lesson identifies a specific misuse of Lesson 1's
correctly-implemented statistical test, not a flaw in the test itself

Lesson 1's z-test, computed correctly once at a predetermined sample
size, genuinely produces the advertised false-positive rate (5% at the
standard 0.05 threshold). This lesson establishes a specific,
well-documented pitfall in how the test is often used in practice:
checking significance repeatedly during ongoing data collection, and
stopping the experiment as soon as the p-value happens to cross the
threshold, inflates the true false-positive rate far beyond the
nominal 5%, even though every individual computation of the z-test is
mathematically correct.

## Why a runnable simulation demonstrates the peeking problem's actual
inflation rather than merely asserting it

Simulating many repeated experiments where both variants share an
identical true conversion rate — meaning any detected "significant"
difference is by construction a genuine false positive — and applying
a daily-peeking stopping rule directly computes the actual false-
positive rate this practice produces. This differs from simply
asserting that peeking is problematic: the simulation quantifies the
specific inflation, typically showing an observed false-positive rate
well above the nominal 5% specifically because of the repeated-checking
process.

## Why the correct fix is a predetermined sample size, not simply
reducing how often significance is checked

Checking significance weekly instead of daily reduces, but does not
eliminate, the inflation, since any stopping rule based on crossing the
significance threshold during ongoing data collection still introduces
the same underlying bias, just less severely. The statistically valid
fix is committing to a specific sample size in advance — calculated
using the methods Lesson 3 establishes — and checking significance
exactly once after that predetermined sample size is reached, or using
a purpose-built sequential-testing statistical method specifically
designed to permit valid repeated checking, which an ordinary z-test is
not designed to support.

## Why the peeking problem is one specific instance of the broader
pattern of p-hacking

P-hacking describes a broader family of practices that inflate the true
false-positive rate beyond what a reported p-value implies: peeking
and stopping early is one specific instance, alongside testing many
metrics and reporting only the significant ones without correcting for
multiple comparisons, or excluding data after seeing how it affects the
result. Each of these practices shares the same underlying mechanism —
introducing additional, uncontrolled opportunities for a false positive
to occur, then selecting on the outcome — even when each individual
statistical computation involved is technically correct.

## Why this lesson's finding holds this course's own statistical
claims to the same honesty standard established in Modules 6-9

Module 9 established that a persuasion technique must be genuinely
honest — not merely technically defensible — to be legitimate. This
lesson applies the identical standard to statistical claims: a
p-value obtained through peeking is not a straightforward falsehood,
since every individual computation is correct, but it is a specific,
well-documented way a technically-accurate number can mislead about
what it actually demonstrates. This course holds its own statistical
methodology to the same honesty standard it has applied to persuasion,
trust signals, and every other mechanism covered across all prior
modules.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established the two-proportion z-test as the correct tool for
testing a specific psychological finding in a specific product. This
lesson establishes a specific, well-documented way this correctly-
computed tool gets misused in practice — the peeking problem — with a
runnable simulation directly quantifying the resulting inflation.
Lesson 3 closes the module by addressing statistical versus practical
significance and the risk of underpowered tests.`,

    contentHi: `## Ye lesson Lesson 1 ke correctly-implemented statistical test ka ek specific misuse kyun identify karta hai, test khud mein ek flaw nahi

Lesson 1 ka z-test, correctly ek predetermined sample size pe ek baar
compute kiya gaya, genuinely advertised false-positive rate produce
karta hai (standard 0.05 threshold pe 5%). Ye lesson ek specific,
well-documented pitfall establish karta hai is baat mein ki test
practice mein aksar kaise use hota hai: ongoing data collection ke
dauran repeatedly significance check karna, aur jaise hi p-value
threshold cross kare experiment stop karna, true false-positive rate
ko nominal 5% se kaafi upar inflate karta hai, chahe z-test ki har
individual computation mathematically correct ho.

## Ek runnable simulation peeking problem ke actual inflation ko kyun demonstrate karta hai sirf assert karne ke bajaye

Kai repeated experiments simulate karna jahan dono variants ek
identical true conversion rate share karte hain — matlab koi bhi
detected "significant" difference construction se ek genuine false
positive hai — aur ek daily-peeking stopping rule apply karna directly
us actual false-positive rate ko compute karta hai jise ye practice
produce karta hai. Ye simply ye assert karne se different hai ki
peeking problematic hai: simulation specific inflation ko quantify
karta hai, typically ek observed false-positive rate dikhate hue jo
nominal 5% se kaafi upar hai specifically repeated-checking process ki
wajah se.

## Correct fix ek predetermined sample size kyun hai, simply significance kitni baar check ki jaati hai use kam karna nahi

Daily ke bajaye weekly significance check karna inflation ko kam karta
hai, eliminate nahi, kyunki koi bhi stopping rule jo ongoing data
collection ke dauran significance threshold cross karne pe based hai
abhi bhi wahi underlying bias introduce karta hai, sirf less severely.
Statistically valid fix advance mein ek specific sample size commit
karna hai — Lesson 3 ke establish kiye methods use karke calculated —
aur us predetermined sample size reach hone ke baad exactly ek baar
significance check karna hai, ya ek purpose-built sequential-testing
statistical method use karna jo specifically valid repeated checking
permit karne ke liye design kiya gaya hai, jo ek ordinary z-test ko
support karne ke liye design nahi kiya gaya.

## Peeking problem broader pattern of p-hacking ka ek specific instance kyun hai

P-hacking practices ke ek broader family ko describe karta hai jo true
false-positive rate ko us se aage inflate karti hain jo ek reported
p-value imply karti hai: peeking aur early stop karna ek specific
instance hai, kai metrics test karne aur sirf significant wale report
karne multiple comparisons ke liye correct kiye bina, ya data ko
exclude karna ye dekhne ke baad ki ye result ko kaise affect karta hai
ke saath. In practices mein se har ek wahi underlying mechanism share
karti hai — ek false positive occur hone ke liye additional,
uncontrolled opportunities introduce karna, phir outcome pe select
karna — even jab involved har individual statistical computation
technically correct hai.

## Ye lesson ki finding is course ke apne statistical claims ko Modules 6-9 mein established wahi honesty standard pe kyun hold karti hai

Module 9 ne establish kiya ki ek persuasion technique ko legitimate
hone ke liye genuinely honest hona chahiye — sirf technically
defensible nahi. Ye lesson identical standard statistical claims pe
apply karta hai: peeking ke through obtain kiya gaya ek p-value ek
straightforward falsehood nahi hai, kyunki har individual computation
correct hai, par ye ek specific, well-documented tareeka hai jise ek
technically-accurate number is baat ke baare mein mislead kar sakta
hai ki ye actually kya demonstrate karta hai. Ye course apne khud ke
statistical methodology ko wahi honesty standard pe hold karta hai jo
ise persuasion, trust signals, aur har doosre mechanism pe apply kiya
hai jo sab prior modules ke across covered hai.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne two-proportion z-test ko ek specific product mein ek
specific psychological finding test karne ke liye correct tool ki tarah
establish kiya. Ye lesson ek specific, well-documented tareeka establish
karta hai jise ye correctly-computed tool practice mein misuse hota
hai — peeking problem — ek runnable simulation ke saath directly
resulting inflation quantify karte hue. Lesson 3 module ko close karta
hai statistical versus practical significance aur underpowered tests
ke risk ko address karke.`,

    examples: [
      {
        title: "A complete peeking-problem simulation directly quantifying the false-positive-rate inflation this lesson establishes",
        titleHi: "Ek complete peeking-problem simulation jo directly false-positive-rate inflation quantify karta hai jise ye lesson establish karta hai",
        codeJs: `function normalCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}

function twoProportionZTest(conversionsA, visitorsA, conversionsB, visitorsB) {
  const pA = conversionsA / visitorsA;
  const pB = conversionsB / visitorsB;
  const pPooled = (conversionsA + conversionsB) / (visitorsA + visitorsB);
  const standardError = Math.sqrt(pPooled * (1 - pPooled) * (1 / visitorsA + 1 / visitorsB));
  const zScore = (pB - pA) / standardError;
  const pValue = 2 * (1 - normalCdf(Math.abs(zScore)));
  return { isSignificantAt95: pValue < 0.05 };
}

function simulateNoRealEffectExperiment(dailyVisitorsPerVariant, trueConversionRate, numDays) {
  let conversionsA = 0, conversionsB = 0, visitorsA = 0, visitorsB = 0;
  for (let day = 1; day <= numDays; day++) {
    for (let i = 0; i < dailyVisitorsPerVariant; i++) {
      if (Math.random() < trueConversionRate) conversionsA++;
      if (Math.random() < trueConversionRate) conversionsB++;
    }
    visitorsA += dailyVisitorsPerVariant;
    visitorsB += dailyVisitorsPerVariant;
    if (twoProportionZTest(conversionsA, visitorsA, conversionsB, visitorsB).isSignificantAt95) {
      return true; // peeked, found "significance," stopped early — a false positive by construction
    }
  }
  return false;
}

function measurePeekingInflation(numSimulations) {
  let falsePositives = 0;
  for (let i = 0; i < numSimulations; i++) {
    if (simulateNoRealEffectExperiment(100, 0.1, 30)) falsePositives++;
  }
  return { observedFalsePositiveRate: falsePositives / numSimulations, nominalRate: 0.05 };
}

console.log(measurePeekingInflation(1000));
// { observedFalsePositiveRate: roughly 0.2-0.4, varying by run (well above 0.05), nominalRate: 0.05 }`,
        codeTs: `function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}

function twoProportionZTest(conversionsA: number, visitorsA: number, conversionsB: number, visitorsB: number) {
  const pA = conversionsA / visitorsA;
  const pB = conversionsB / visitorsB;
  const pPooled = (conversionsA + conversionsB) / (visitorsA + visitorsB);
  const standardError = Math.sqrt(pPooled * (1 - pPooled) * (1 / visitorsA + 1 / visitorsB));
  const zScore = (pB - pA) / standardError;
  const pValue = 2 * (1 - normalCdf(Math.abs(zScore)));
  return { isSignificantAt95: pValue < 0.05 };
}

function simulateNoRealEffectExperiment(dailyVisitorsPerVariant: number, trueConversionRate: number, numDays: number): boolean {
  let conversionsA = 0, conversionsB = 0, visitorsA = 0, visitorsB = 0;
  for (let day = 1; day <= numDays; day++) {
    for (let i = 0; i < dailyVisitorsPerVariant; i++) {
      if (Math.random() < trueConversionRate) conversionsA++;
      if (Math.random() < trueConversionRate) conversionsB++;
    }
    visitorsA += dailyVisitorsPerVariant;
    visitorsB += dailyVisitorsPerVariant;
    if (twoProportionZTest(conversionsA, visitorsA, conversionsB, visitorsB).isSignificantAt95) {
      return true;
    }
  }
  return false;
}

function measurePeekingInflation(numSimulations: number) {
  let falsePositives = 0;
  for (let i = 0; i < numSimulations; i++) {
    if (simulateNoRealEffectExperiment(100, 0.1, 30)) falsePositives++;
  }
  return { observedFalsePositiveRate: falsePositives / numSimulations, nominalRate: 0.05 };
}

console.log(measurePeekingInflation(1000));
// { observedFalsePositiveRate: roughly 0.2-0.4, varying by run (well above 0.05), nominalRate: 0.05 }`,
        code: `for (let day = 1; day <= numDays; day++) {
  // ... update conversions ...
  if (twoProportionZTest(...).isSignificantAt95) return true; // peek and stop early
}
// simulating the exact "peek daily, stop at first significance" behavior teams actually use`,
        output:
          "With both variants sharing an identical true conversion rate (10%), meaning zero real effect exists, running 1,000 simulated experiments with daily peeking and early stopping produces an observed false-positive rate well above the nominal 5% — a direct, computed demonstration that peeking inflates false positives even though the underlying z-test computation is correct at every check.",
        explain:
          "This example operationalizes the lesson's central claim through direct simulation rather than assertion: by constructing experiments where the true effect is known to be zero, any detected 'significant' result is unambiguously a false positive, and running many such simulations with a realistic daily-peeking stopping rule quantifies exactly how much this practice inflates the false-positive rate beyond the advertised 5%.",
        explainHi:
          "Ye example lesson ke central claim ko assertion ke bajaye direct simulation ke through operationalize karta hai: experiments construct karke jahan true effect zero hona known hai, koi bhi detected 'significant' result unambiguously ek false positive hai, aur ek realistic daily-peeking stopping rule ke saath kai aise simulations run karna exactly quantify karta hai ki ye practice false-positive rate ko advertised 5% se kitna zyada inflate karti hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Checking significance every day and stopping the experiment the
// moment the p-value crosses the threshold
function runExperimentWrong(getDataForDay, maxDays) {
  let conversionsA = 0, conversionsB = 0, visitorsA = 0, visitorsB = 0;
  for (let day = 1; day <= maxDays; day++) {
    const dayData = getDataForDay(day);
    conversionsA += dayData.conversionsA;
    visitorsA += dayData.visitorsA;
    conversionsB += dayData.conversionsB;
    visitorsB += dayData.visitorsB;
    const result = twoProportionZTest(conversionsA, visitorsA, conversionsB, visitorsB);
    if (result.isSignificantAt95) {
      return { stoppedEarly: true, day, result };
      // Stopping at the first significant reading inflates the true
      // false-positive rate far beyond the nominal 5%
    }
  }
  return { stoppedEarly: false };
}`,
        right: `// Committing to a predetermined sample size in advance, and
// checking significance exactly once after it's reached
function runExperimentRight(requiredSampleSizePerVariant, collectAllData) {
  const { conversionsA, visitorsA, conversionsB, visitorsB } =
    collectAllData(requiredSampleSizePerVariant);
  // Only one check, after the full predetermined sample is collected
  return twoProportionZTest(conversionsA, visitorsA, conversionsB, visitorsB);
}`,
        why: "Checking significance repeatedly and stopping at the first favorable reading is statistically equivalent to a gambler repeatedly re-flipping a coin until it lands their way — it inflates the true false-positive rate far beyond the nominal 5% threshold the test is designed to guarantee, even though each individual z-test computation is mathematically correct.",
        whyHi:
          "Repeatedly significance check karna aur pehle favorable reading pe stop karna ek gambler ke repeatedly ek coin ko re-flip karne ke statistically equivalent hai jab tak ye unki taraf land na kare — ye true false-positive rate ko nominal 5% threshold se kaafi upar inflate karta hai jise test guarantee karne ke liye design kiya gaya hai, chahe har individual z-test computation mathematically correct ho.",
      },
    ],

    realWorld: [
      {
        en: "A production e-commerce team's data science group discovered, after auditing several months of A/B test results, that experiments which had been manually stopped early due to a favorable daily p-value check had a dramatically higher rate of failing to replicate in a follow-up confirmation test compared to experiments run to a predetermined sample size — leading the team to adopt a strict pre-registration policy requiring sample size and stopping rule to be locked in before any experiment began.",
        hi: "Ek production e-commerce team ke data science group ne discover kiya, kai months ke A/B test results audit karne ke baad, ki experiments jo ek favorable daily p-value check ki wajah se manually early stop kiye gaye the ek follow-up confirmation test mein replicate karne mein fail hone ki dramatically higher rate rakhte the compared to experiments jo ek predetermined sample size tak run kiye gaye the — team ko ek strict pre-registration policy adopt karne ki taraf le jaate hue jo require karti hai ki sample size aur stopping rule kisi bhi experiment shuru hone se pehle lock in ki jaaye.",
      },
    ],

    interviewQA: [
      {
        q: "What is the 'peeking problem' in A/B testing, and why does it inflate the false-positive rate even though each individual statistical computation is correct?",
        qHi: '"Peeking problem" A/B testing mein kya hai, aur ye false-positive rate ko kyun inflate karta hai even jab har individual statistical computation correct hai?',
        a: "The peeking problem occurs when significance is checked repeatedly during ongoing data collection, with the experiment stopped as soon as the p-value crosses the threshold. Each individual z-test computation is mathematically correct, but the repeated-checking-and-stopping process itself introduces additional, uncontrolled opportunities for a false positive, inflating the TRUE false-positive rate far beyond the nominal 5% the test would produce if checked only once.",
        aHi: 'Peeking problem tab hota hai jab significance ongoing data collection ke dauran repeatedly check ki jaati hai, experiment ko jaise hi p-value threshold cross kare stop kiya jaata hai. Har individual z-test computation mathematically correct hai, par repeated-checking-and-stopping process khud additional, uncontrolled opportunities introduce karta hai ek false positive ke liye, TRUE false-positive rate ko nominal 5% se kaafi upar inflate karte hue jo test produce karta agar sirf ek baar check kiya jaata.',
      },
      {
        q: "Why doesn't simply checking significance weekly instead of daily solve the peeking problem?",
        qHi: 'Simply weekly significance check karna daily ke bajaye peeking problem ko kyun solve nahi karta?',
        a: "Any stopping rule based on crossing the significance threshold during ongoing data collection introduces the same underlying bias, just less severely with less frequent checking. The statistically valid fix is committing to a predetermined sample size in advance and checking significance exactly once, or using a purpose-built sequential-testing method designed specifically to permit valid repeated checking.",
        aHi: 'Koi bhi stopping rule jo ongoing data collection ke dauran significance threshold cross karne pe based hai wahi underlying bias introduce karta hai, sirf less frequent checking ke saath less severely. Statistically valid fix advance mein ek predetermined sample size commit karna hai aur exactly ek baar significance check karna hai, ya ek purpose-built sequential-testing method use karna jo specifically valid repeated checking permit karne ke liye design kiya gaya hai.',
      },
    ],

    exercises: [
      {
        task: "A team is running an A/B test and plans to check the p-value every morning, stopping the experiment as soon as it drops below 0.05. Using this lesson's framework and the measurePeekingInflation simulation, explain what will actually happen to their true false-positive rate compared to the 5% they believe they're getting, and propose the correct alternative process.",
        taskHi: 'Ek team ek A/B test run kar rahi hai aur har subah p-value check karne ki plan bana rahi hai, experiment ko stop karte hue jaise hi ye 0.05 se neeche drop kare. Is lesson ke framework aur measurePeekingInflation simulation use karke, explain karo ki unki true false-positive rate ke saath actually kya hoga us 5% ke compare mein jo unhe believe hai ki wo pa rahe hain, aur correct alternative process propose karo.',
        hint: "Run measurePeekingInflation with parameters similar to their situation and compare the observed rate to 0.05, then think about what committing to a predetermined sample size (checking only once) would do differently.",
        hintHi: 'Unki situation ke similar parameters ke saath measurePeekingInflation run karo aur observed rate ko 0.05 se compare karo, phir socho ki ek predetermined sample size commit karna (sirf ek baar check karna) differently kya karega.',
      },
    ],

    keyTakeaways: [
      "The peeking problem occurs when significance is checked repeatedly during data collection with a stopping rule based on crossing the threshold — this inflates the true false-positive rate far beyond the nominal 5%, even though each individual computation is correct.",
      "A runnable simulation with a known-zero true effect directly quantifies this inflation, demonstrating rather than merely asserting the pitfall.",
      "The correct fix is committing to a predetermined sample size in advance and checking significance exactly once, or using a purpose-built sequential-testing method.",
      "Peeking is one specific instance of the broader pattern of p-hacking, which this course holds to the same honesty standard established across Modules 6-9's legitimacy arc.",
    ],
    keyTakeawaysHi: [
      'Peeking problem tab hoti hai jab significance data collection ke dauran repeatedly check ki jaati hai ek stopping rule ke saath jo threshold cross karne pe based hai — ye true false-positive rate ko nominal 5% se kaafi upar inflate karta hai, chahe har individual computation correct ho.',
      'Ek known-zero true effect ke saath ek runnable simulation directly is inflation ko quantify karta hai, pitfall ko demonstrate karte hue sirf assert karne ke bajaye.',
      'Correct fix advance mein ek predetermined sample size commit karna aur exactly ek baar significance check karna hai, ya ek purpose-built sequential-testing method use karna hai.',
      'Peeking p-hacking ke broader pattern ka ek specific instance hai, jise ye course Modules 6-9 ke legitimacy arc ke across established wahi honesty standard pe hold karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'psych-statistical-vs-practical-significance',
    title: 'Statistical vs. Practical Significance, and Underpowered Tests',
    titleHi: 'Statistical Vs. Practical Significance, Aur Underpowered Tests',
    description:
      "Closing this module: a specific, checkable distinction between a statistically significant result and one that actually matters, plus a real, runnable sample-size calculator addressing the specific risk of an underpowered test producing a misleading 'no effect' conclusion.",
    descriptionHi:
      'Is module ko close karte hue: ek statistically significant result aur ek jo actually matter karta hai uske beech ek specific, checkable distinction, plus ek real, runnable sample-size calculator jo ek underpowered test ke specific risk ko address karta hai jo ek misleading "no effect" conclusion produce karta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A pharmaceutical trial with an enormous sample size — hundreds of thousands of patients — that detects a statistically genuine, real, non-chance difference between two treatments, where one reduces a symptom's duration by an average of six minutes out of a typical three-day illness — a difference that is completely real and not due to chance, yet clinically meaningless to an actual patient.** With a large enough sample size, even a genuinely real, non-chance difference between two treatments can be detected with high statistical confidence, however small that difference actually is in absolute terms. A trial with hundreds of thousands of participants might detect, with a very small and genuinely trustworthy p-value, that one treatment reduces symptom duration by an average of six minutes across a typical three-day illness — this is a real, statistically significant effect, not a fluke of chance, and a smaller trial genuinely might not have had the statistical power to detect it at all. But six minutes off a three-day illness is not a meaningfully different clinical outcome for an actual patient deciding which treatment to take — the difference, while completely statistically real, is practically negligible. This is exactly the distinction this lesson establishes as the necessary companion to Lesson 1's statistical test: 'statistically significant' answers only the narrow question of whether an observed difference is likely to be genuine rather than chance, and says nothing on its own about whether that genuine difference is large enough to matter for an actual product decision — a question this lesson establishes requires a separate, deliberate judgment about practical significance, alongside a genuinely runnable check for the mirror-image problem, an underpowered test too small to detect even a difference that would matter.",
      hi: 'ek pharmaceutical trial ek enormous sample size ke saath — hundreds of thousands patients — jo do treatments ke beech ek statistically genuine, real, non-chance difference detect karta hai, jahan ek symptom ki duration ko average six minutes se reduce karta hai ek typical three-day illness mein se — ek difference jo completely real hai aur chance ki wajah se nahi hai, phir bhi clinically meaningless hai ek actual patient ke liye. Ek kaafi bada sample size ke saath, even ek genuinely real, non-chance difference do treatments ke beech high statistical confidence ke saath detect kiya ja sakta hai, chahe wo difference absolute terms mein actually kitna bhi chhota ho. Hundreds of thousands participants wale ek trial detect kar sakta hai, ek bahut chhote aur genuinely trustworthy p-value ke saath, ki ek treatment symptom duration ko average six minutes se reduce karta hai ek typical three-day illness ke across — ye ek real, statistically significant effect hai, chance ka ek fluke nahi, aur ek smaller trial genuinely ise bilkul detect karne ki statistical power nahi rakhta hota. Par three-day illness mein se six minutes ek actual patient ke liye ek meaningfully different clinical outcome nahi hai jo decide kar raha hai kaunsa treatment lena hai — difference, chahe completely statistically real ho, practically negligible hai. Ye exactly wo distinction hai jise ye lesson Lesson 1 ke statistical test ke necessary companion ki tarah establish karta hai: "statistically significant" sirf is narrow question ka answer deta hai ki kya ek observed difference genuine hone ki likelihood rakhta hai chance ke bajaye, aur khud kuch nahi kehta is baare mein ki kya wo genuine difference ek actual product decision ke liye matter karne jitna bada hai — ek question jise ye lesson establish karta hai ek separate, deliberate judgment ki zaroorat hai practical significance ke baare mein, ek genuinely runnable check ke saath mirror-image problem ke liye, ek underpowered test jo bahut chhota hai even ek difference detect karne ke liye jo matter karega.',
    },

    simple: `**Why statistical significance and practical significance answer
two genuinely different questions, and why Lesson 1's test alone
doesn't answer the second one:**

\`\`\`
"Statistically significant" (Lesson 1's z-test result) answers only:
is this observed difference likely to be genuine rather than random
chance? It says NOTHING on its own about whether the genuine
difference is large enough to matter for an actual product decision —
with a large enough sample, even a tiny, genuinely real effect becomes
statistically significant, whether or not it's worth acting on.
\`\`\`

**A concrete, checkable practical-significance check, applied
alongside Lesson 1's statistical test rather than instead of it:**

\`\`\`ts
function evaluatePracticalSignificance(conversionRateA, conversionRateB, minimumMeaningfulLift) {
  const observedLift = conversionRateB - conversionRateA;
  return {
    observedLift,
    meetsMinimumMeaningfulThreshold: observedLift >= minimumMeaningfulLift,
    // A statistically significant result can still fail this check —
    // the two questions (is it real? is it big enough to matter?)
    // are genuinely independent
  };
}
\`\`\`

**A real, runnable sample-size calculator addressing the mirror-image
risk — a test too small to detect even a difference that would
genuinely matter:**

\`\`\`ts
function calculateRequiredSampleSize(baselineConversionRate, minimumDetectableEffect, significanceLevel = 0.05, power = 0.8) {
  // Standard formula for a two-proportion test's required sample size
  // per variant, using the normal approximation
  const zAlpha = 1.96; // corresponds to 0.05 two-tailed significance
  const zBeta = 0.84; // corresponds to 80% power
  const p1 = baselineConversionRate;
  const p2 = baselineConversionRate + minimumDetectableEffect;
  const pBar = (p1 + p2) / 2;
  const numerator = Math.pow(zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
  const denominator = Math.pow(p2 - p1, 2);
  return Math.ceil(numerator / denominator);
}
\`\`\`

**Why an underpowered test's "no significant difference" result is
specifically dangerous — it's frequently misread as "no real
difference exists" when it may simply mean "this sample was too small
to detect it":**

\`\`\`ts
function auditTestPower(actualSampleSize, requiredSampleSize) {
  return {
    isUnderpowered: actualSampleSize < requiredSampleSize,
    warning: actualSampleSize < requiredSampleSize
      ? "A 'no significant difference' result from this sample size cannot be trusted as evidence of no real effect — the test may simply lack the power to detect it"
      : 'sample size is adequate for the specified minimum detectable effect',
  };
}
\`\`\`

**Why this lesson's two checks — practical significance and adequate
power — must both be applied alongside Lesson 1's z-test, forming a
complete testing discipline rather than the z-test alone:**

\`\`\`
A complete, honest test of a specific psychological finding in a
specific product requires three things together: Lesson 1's
statistical test (is the difference likely real?), this lesson's
practical-significance check (is it big enough to matter?), and this
lesson's power check (was the sample large enough to trust a null
result?) — using only the first, as many teams do, leaves genuine gaps
this lesson's remaining two checks are specifically designed to close.
\`\`\`

**How this lesson closes Module 18:** Lesson 1 established the
discipline of testing a specific psychological finding with a real
z-test. Lesson 2 established the peeking problem as a specific misuse
of that test. This lesson completes the module's statistical toolkit
with practical significance and a runnable sample-size calculator,
setting up Module 19's shift to the ethics of behavioral design.`,

    simpleHi: `**Statistical significance aur practical significance do genuinely
different questions kyun answer karte hain, aur Lesson 1 ka test akela
doosra question kyun answer nahi karta:**

\`\`\`
"Statistically significant" (Lesson 1 ka z-test result) sirf ye answer
karta hai: kya ye observed difference genuine hone ki likelihood rakhta
hai random chance ke bajaye? Ye khud kuch NAHI kehta is baare mein ki
kya genuine difference ek actual product decision ke liye matter karne
jitna bada hai — ek kaafi bade sample ke saath, even ek tiny, genuinely
real effect statistically significant ban jaata hai, chahe uspe act
karna worth ho ya na ho.
\`\`\`

**Ek concrete, checkable practical-significance check, Lesson 1 ke
statistical test ke saath applied uske bajaye nahi:**

\`\`\`ts
function evaluatePracticalSignificance(conversionRateA, conversionRateB, minimumMeaningfulLift) {
  const observedLift = conversionRateB - conversionRateA;
  return {
    observedLift,
    meetsMinimumMeaningfulThreshold: observedLift >= minimumMeaningfulLift,
    // Ek statistically significant result abhi bhi is check mein fail
    // ho sakta hai — do questions (kya ye real hai? kya ye matter
    // karne jitna bada hai?) genuinely independent hain
  };
}
\`\`\`

**Ek real, runnable sample-size calculator jo mirror-image risk ko
address karta hai — ek test bahut chhota even ek difference detect
karne ke liye jo genuinely matter karega:**

\`\`\`ts
function calculateRequiredSampleSize(baselineConversionRate, minimumDetectableEffect, significanceLevel = 0.05, power = 0.8) {
  // Ek two-proportion test ke required sample size per variant ke
  // liye standard formula, normal approximation use karte hue
  const zAlpha = 1.96; // 0.05 two-tailed significance ke corresponds karta hai
  const zBeta = 0.84; // 80% power ke corresponds karta hai
  const p1 = baselineConversionRate;
  const p2 = baselineConversionRate + minimumDetectableEffect;
  const pBar = (p1 + p2) / 2;
  const numerator = Math.pow(zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
  const denominator = Math.pow(p2 - p1, 2);
  return Math.ceil(numerator / denominator);
}
\`\`\`

**Ek underpowered test ka "no significant difference" result
specifically dangerous kyun hai — ye frequently "koi real difference
exist nahi karta" ki tarah misread kiya jaata hai jab ye simply matlab
ho sakta hai "ye sample ise detect karne ke liye bahut chhota tha":**

\`\`\`ts
function auditTestPower(actualSampleSize, requiredSampleSize) {
  return {
    isUnderpowered: actualSampleSize < requiredSampleSize,
    warning: actualSampleSize < requiredSampleSize
      ? "A 'no significant difference' result from this sample size cannot be trusted as evidence of no real effect — the test may simply lack the power to detect it"
      : 'sample size is adequate for the specified minimum detectable effect',
  };
}
\`\`\`

**Is lesson ke do checks — practical significance aur adequate power —
dono ko Lesson 1 ke z-test ke saath kyun apply hona chahiye, akele
z-test ke bajaye ek complete testing discipline banate hue:**

\`\`\`
Ek specific product mein ek specific psychological finding ka ek
complete, honest test ko teen cheezon ko saath mein chahiye: Lesson 1
ka statistical test (kya difference likely real hai?), is lesson ka
practical-significance check (kya ye matter karne jitna bada hai?), aur
is lesson ka power check (kya sample ek null result ko trust karne ke
liye kaafi bada tha?) — sirf pehla use karna, jaisa kai teams karti
hain, genuine gaps chhod deta hai jise is lesson ke remaining do checks
specifically close karne ke liye design kiye gaye hain.
\`\`\`

**Ye lesson Module 18 ko kaise close karta hai:** Lesson 1 ne ek real
z-test ke saath ek specific psychological finding test karne ki
discipline establish ki. Lesson 2 ne peeking problem ko us test ke ek
specific misuse ki tarah establish kiya. Ye lesson practical
significance aur ek runnable sample-size calculator ke saath module ke
statistical toolkit ko complete karta hai, Module 19 ke behavioral
design ki ethics ki taraf shift ko set up karte hue.`,

    content: `## Why statistical significance and practical significance answer
genuinely different questions

Lesson 1's z-test answers a narrow, specific question: is an observed
difference likely to be genuine rather than the product of random
chance? This lesson establishes that this question is genuinely
separate from a second, equally important question: is the genuine
difference large enough to matter for an actual product decision? With
a sufficiently large sample size, even a tiny, real effect becomes
statistically significant — meaning statistical significance alone
cannot answer whether acting on the result is actually worthwhile.

## Why a deliberate, checkable practical-significance threshold must
be established independently of the statistical test

Since statistical significance says nothing about the magnitude of a
genuine effect relative to what would actually matter, evaluating
practical significance requires a separate, deliberate judgment: a
minimum meaningful lift, decided in advance based on the actual
business or user-experience stakes involved, against which the
observed effect size is compared. A statistically significant result
that falls short of this practical threshold is genuinely real but not
necessarily worth the cost of shipping a change.

## Why a real, runnable sample-size calculator addresses the specific,
mirror-image risk of an underpowered test

An underpowered test — one with too small a sample size to reliably
detect a difference of a specified, meaningful magnitude — carries a
specific risk distinct from the peeking problem: a genuine effect can
go entirely undetected simply because the sample wasn't large enough
to have adequate statistical power. Calculating the required sample
size in advance, using the standard formula relating baseline
conversion rate, the minimum effect size worth detecting, the desired
significance level, and the desired statistical power, ensures the
experiment is actually capable of detecting an effect of the size that
would matter before it begins.

## Why a "no significant difference" result from an underpowered test
cannot be trusted as evidence that no real difference exists

This is the specific, checkable danger this lesson establishes: a
result of "not statistically significant" is frequently, and
incorrectly, interpreted as "no real effect exists," when it may
simply mean the sample size was inadequate to detect an effect that
does exist. Auditing the actual sample size used against the sample
size the calculation established as necessary directly reveals whether
a null result can be trusted as genuine evidence of no meaningful
effect, or whether it may simply reflect an underpowered test.

## Why a complete, honest testing discipline requires all three checks
together, not the z-test alone

A complete and honest test of a specific psychological finding in a
specific product requires Lesson 1's statistical significance test (is
the observed difference likely real?), this lesson's practical-
significance check (is the genuine difference large enough to matter?),
and this lesson's power check (was the sample large enough to trust a
null result?). Using only the first of these three, as is common in
practice, leaves genuine, well-documented gaps that this lesson's
remaining two checks are specifically designed to close.

## How this lesson closes Module 18

Lesson 1 established the discipline of testing a specific psychological
finding with a genuine statistical tool. Lesson 2 established the
peeking problem as a specific, well-documented misuse of that tool.
This lesson completes the module's statistical toolkit with practical
significance and a runnable sample-size calculator addressing
underpowered tests, setting up Module 19's shift to the ethics of
behavioral design.`,

    contentHi: `## Statistical significance aur practical significance genuinely different questions kyun answer karte hain

Lesson 1 ka z-test ek narrow, specific question answer karta hai: kya
ek observed difference genuine hone ki likelihood rakhta hai random
chance ka product hone ke bajaye? Ye lesson establish karta hai ki ye
question genuinely ek second, equally important question se separate
hai: kya genuine difference ek actual product decision ke liye matter
karne jitna bada hai? Ek sufficiently large sample size ke saath, even
ek tiny, real effect statistically significant ban jaata hai — matlab
akela statistical significance answer nahi kar sakta ki result pe act
karna actually worthwhile hai.

## Ek deliberate, checkable practical-significance threshold statistical test se independently kyun establish hona chahiye

Kyunki statistical significance ek genuine effect ki magnitude ke
baare mein kuch nahi kehta us relative se jo actually matter karta,
practical significance evaluate karne ke liye ek separate, deliberate
judgment chahiye: ek minimum meaningful lift, advance mein decide ki
gayi actual business ya user-experience stakes involved ke basis pe,
jiske against observed effect size compare ki jaati hai. Ek statistically
significant result jo is practical threshold se kam padta hai genuinely
real hai par zaroori nahi ki ek change ship karne ki cost worth ho.

## Ek real, runnable sample-size calculator specifically ek underpowered test ke mirror-image risk ko kyun address karta hai

Ek underpowered test — ek jiska sample size ek specified, meaningful
magnitude ke difference ko reliably detect karne ke liye bahut chhota
hai — peeking problem se distinct ek specific risk carry karta hai: ek
genuine effect entirely undetected reh sakta hai simply kyunki sample
adequate statistical power ke liye kaafi bada nahi tha. Advance mein
required sample size calculate karna, standard formula use karke jo
baseline conversion rate, minimum effect size jo detect karne layak hai,
desired significance level, aur desired statistical power ko relate
karta hai, ensure karta hai ki experiment shuru hone se pehle actually
us size ke effect ko detect karne mein capable hai jo matter karega.

## Ek underpowered test se "no significant difference" result koi real difference exist nahi karta uske evidence ki tarah trust kyun nahi kiya ja sakta

Ye wo specific, checkable danger hai jise ye lesson establish karta
hai: "not statistically significant" ka ek result frequently, aur
incorrectly, "koi real effect exist nahi karta" ki tarah interpret kiya
jaata hai, jab iska simply matlab ho sakta hai ki sample size ek effect
detect karne ke liye inadequate tha jo exist karta hai. Use kiya gaya
actual sample size ko us sample size ke against audit karna jo
calculation ne necessary establish kiya directly reveal karta hai ki
kya ek null result koi meaningful effect nahi hai uske genuine evidence
ki tarah trust kiya ja sakta hai, ya kya ye simply ek underpowered test
ko reflect kar sakta hai.

## Ek complete, honest testing discipline ko teeno checks saath mein kyun chahiye, akela z-test nahi

Ek specific product mein ek specific psychological finding ka ek
complete aur honest test ko chahiye Lesson 1 ka statistical significance
test (kya observed difference likely real hai?), is lesson ka
practical-significance check (kya genuine difference matter karne
jitna bada hai?), aur is lesson ka power check (kya sample ek null
result ko trust karne ke liye kaafi bada tha?). In teeno mein se sirf
pehla use karna, jaisa practice mein common hai, genuine, well-documented
gaps chhod deta hai jise is lesson ke remaining do checks specifically
close karne ke liye design kiye gaye hain.

## Ye lesson Module 18 ko kaise close karta hai

Lesson 1 ne ek genuine statistical tool ke saath ek specific psychological
finding test karne ki discipline establish ki. Lesson 2 ne peeking
problem ko us tool ke ek specific, well-documented misuse ki tarah
establish kiya. Ye lesson practical significance aur ek runnable
sample-size calculator ke saath module ke statistical toolkit ko
complete karta hai underpowered tests ko address karte hue, Module 19
ke behavioral design ki ethics ki taraf shift ko set up karte hue.`,

    examples: [
      {
        title: 'A practical-significance evaluator and a sample-size calculator addressing both halves of this lesson\'s core distinction',
        titleHi: "Ek practical-significance evaluator aur ek sample-size calculator jo is lesson ke core distinction ke dono halves ko address karte hain",
        codeJs: `function evaluatePracticalSignificance(conversionRateA, conversionRateB, minimumMeaningfulLift) {
  const observedLift = conversionRateB - conversionRateA;
  return {
    observedLift: Number(observedLift.toFixed(4)),
    meetsMinimumMeaningfulThreshold: observedLift >= minimumMeaningfulLift,
  };
}

function calculateRequiredSampleSize(baselineConversionRate, minimumDetectableEffect, significanceLevel = 0.05, power = 0.8) {
  const zAlpha = 1.96;
  const zBeta = 0.84;
  const p1 = baselineConversionRate;
  const p2 = baselineConversionRate + minimumDetectableEffect;
  const pBar = (p1 + p2) / 2;
  const numerator = Math.pow(zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
  const denominator = Math.pow(p2 - p1, 2);
  return Math.ceil(numerator / denominator);
}

function auditTestPower(actualSampleSize, requiredSampleSize) {
  return {
    isUnderpowered: actualSampleSize < requiredSampleSize,
    warning: actualSampleSize < requiredSampleSize
      ? "A 'no significant difference' result from this sample size cannot be trusted as evidence of no real effect"
      : 'sample size is adequate for the specified minimum detectable effect',
  };
}

// A statistically significant 0.3-percentage-point lift, but the team
// decided in advance that only a 2-point lift is worth the engineering cost
console.log(evaluatePracticalSignificance(0.10, 0.103, 0.02));
// { observedLift: 0.003, meetsMinimumMeaningfulThreshold: false }

// Planning a new test: baseline 10%, want to detect a 2-point lift
const required = calculateRequiredSampleSize(0.10, 0.02);
console.log(required); // e.g., ~3800 per variant

console.log(auditTestPower(500, required));
// { isUnderpowered: true, warning: "A 'no significant difference' result..." }`,
        codeTs: `function evaluatePracticalSignificance(conversionRateA: number, conversionRateB: number, minimumMeaningfulLift: number) {
  const observedLift = conversionRateB - conversionRateA;
  return {
    observedLift: Number(observedLift.toFixed(4)),
    meetsMinimumMeaningfulThreshold: observedLift >= minimumMeaningfulLift,
  };
}

function calculateRequiredSampleSize(
  baselineConversionRate: number,
  minimumDetectableEffect: number,
  significanceLevel: number = 0.05,
  power: number = 0.8
): number {
  const zAlpha = 1.96;
  const zBeta = 0.84;
  const p1 = baselineConversionRate;
  const p2 = baselineConversionRate + minimumDetectableEffect;
  const pBar = (p1 + p2) / 2;
  const numerator = Math.pow(zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
  const denominator = Math.pow(p2 - p1, 2);
  return Math.ceil(numerator / denominator);
}

function auditTestPower(actualSampleSize: number, requiredSampleSize: number) {
  return {
    isUnderpowered: actualSampleSize < requiredSampleSize,
    warning: actualSampleSize < requiredSampleSize
      ? "A 'no significant difference' result from this sample size cannot be trusted as evidence of no real effect"
      : 'sample size is adequate for the specified minimum detectable effect',
  };
}

// A statistically significant 0.3-percentage-point lift, but the team
// decided in advance that only a 2-point lift is worth the engineering cost
console.log(evaluatePracticalSignificance(0.10, 0.103, 0.02));
// { observedLift: 0.003, meetsMinimumMeaningfulThreshold: false }

// Planning a new test: baseline 10%, want to detect a 2-point lift
const required = calculateRequiredSampleSize(0.10, 0.02);
console.log(required); // e.g., ~3800 per variant

console.log(auditTestPower(500, required));
// { isUnderpowered: true, warning: "A 'no significant difference' result..." }`,
        code: `const numerator = Math.pow(zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
const denominator = Math.pow(p2 - p1, 2);
return Math.ceil(numerator / denominator);
// the standard, genuine sample-size formula for a two-proportion test at a given power`,
        output:
          "The practical-significance evaluator correctly flags a real, tiny 0.3-point lift as failing to meet the team's pre-declared 2-point meaningful threshold; the sample-size calculator computes the actual required sample for detecting a 2-point lift, and the power audit correctly warns that a test run with only 500 visitors per variant (well under the ~3,800 required) cannot be trusted if it returns a null result.",
        explain:
          "This example operationalizes both halves of the lesson's core distinction: practical significance (a real effect can still be too small to matter) and statistical power (an underpowered test's null result is not trustworthy evidence of no effect) — together forming the two checks this lesson establishes as necessary alongside Lesson 1's significance test.",
        explainHi:
          "Ye example lesson ke core distinction ke dono halves ko operationalize karta hai: practical significance (ek real effect abhi bhi matter karne ke liye bahut chhota ho sakta hai) aur statistical power (ek underpowered test ka null result koi effect nahi hai uske trustworthy evidence nahi hai) — saath mein wo do checks banate hue jinhe ye lesson Lesson 1 ke significance test ke saath necessary establish karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Treating "not statistically significant" as proof that no real
// difference exists, without checking whether the test had adequate
// power to detect one
function concludeFromNullResultWrong(zTestResult) {
  if (!zTestResult.isSignificantAt95) {
    return 'no real difference — the variants are equivalent';
    // A dangerously overconfident conclusion if the sample size was
    // too small to detect a difference of meaningful size in the
    // first place
  }
}`,
        right: `// Checking test power before drawing any conclusion from a null
// result
function concludeFromNullResultRight(zTestResult, actualSampleSize, requiredSampleSize) {
  if (!zTestResult.isSignificantAt95) {
    if (actualSampleSize < requiredSampleSize) {
      return 'inconclusive — this test lacked the power to reliably detect a meaningful difference';
    }
    return 'no meaningful difference detected, with adequate power to trust this conclusion';
  }
}`,
        why: "Concluding 'no real difference' from a non-significant result without checking whether the sample size was adequate to detect a meaningful effect ignores the specific risk of an underpowered test — a null result from an inadequately sized sample provides no genuine evidence that no meaningful difference exists, only that this particular test failed to detect one.",
        whyHi:
          "Ek non-significant result se 'koi real difference nahi' conclude karna ye check kiye bina ki sample size ek meaningful effect detect karne ke liye adequate tha ek underpowered test ke specific risk ko ignore karta hai — ek inadequately sized sample se ek null result koi genuine evidence provide nahi karta ki koi meaningful difference exist nahi karta, sirf ye ki ye particular test ek detect karne mein fail hua.",
      },
    ],

    realWorld: [
      {
        en: "A production e-commerce team ran an A/B test for a new checkout layout with only 800 visitors per variant, found no statistically significant difference, and initially concluded the layout change 'didn't matter'; a subsequent power analysis revealed the test would have needed roughly 6,000 visitors per variant to reliably detect a 2-percentage-point lift, so the team re-ran the test to the correct sample size and this time found a genuine, meaningful improvement the underpowered first test had simply been unable to detect.",
        hi: "Ek production e-commerce team ne ek naye checkout layout ke liye ek A/B test run kiya sirf 800 visitors per variant ke saath, koi statistically significant difference nahi paaya, aur initially conclude kiya ki layout change 'matter nahi karta'; ek subsequent power analysis ne reveal kiya ki test ko roughly 6,000 visitors per variant chahiye hote ek 2-percentage-point lift ko reliably detect karne ke liye, isliye team ne correct sample size tak test re-run kiya aur is baar ek genuine, meaningful improvement paaya jise underpowered pehla test simply detect karne mein unable tha.",
      },
    ],

    interviewQA: [
      {
        q: "Why can a statistically significant result still fail to be practically significant?",
        qHi: 'Ek statistically significant result practically significant hone mein abhi bhi kyun fail ho sakta hai?',
        a: "Statistical significance only answers whether an observed difference is likely genuine rather than chance — it says nothing about the difference's magnitude relative to what would actually matter for a product decision. With a large enough sample size, even a tiny, real effect becomes statistically significant, so a separate, deliberate judgment about a minimum meaningful threshold is required.",
        aHi: 'Statistical significance sirf ye answer karta hai ki kya ek observed difference genuine hone ki likelihood rakhta hai chance ke bajaye — ye difference ki magnitude ke baare mein kuch nahi kehta us relative se jo ek product decision ke liye actually matter karega. Ek kaafi bade sample size ke saath, even ek tiny, real effect statistically significant ban jaata hai, isliye ek minimum meaningful threshold ke baare mein ek separate, deliberate judgment chahiye.',
      },
      {
        q: "Why is a 'no significant difference' result from an underpowered test dangerous to interpret as 'no real difference exists'?",
        qHi: "Ek underpowered test se ek 'no significant difference' result ko 'koi real difference exist nahi karta' ki tarah interpret karna dangerous kyun hai?",
        a: "An underpowered test has too small a sample to reliably detect a difference of a meaningful size, even if that difference genuinely exists. A null result from such a test simply means the test failed to detect an effect — it provides no genuine evidence that no meaningful effect exists, which is why checking actual sample size against the required sample size is necessary before trusting a null result.",
        aHi: 'Ek underpowered test ka sample bahut chhota hota hai ek meaningful size ke difference ko reliably detect karne ke liye, chahe wo difference genuinely exist kare. Aise test se ek null result simply matlab hai ki test ek effect detect karne mein fail hua — ye koi genuine evidence provide nahi karta ki koi meaningful effect exist nahi karta, yahi wajah hai ki ek null result trust karne se pehle actual sample size ko required sample size ke against check karna necessary hai.',
      },
    ],

    exercises: [
      {
        task: "Using the calculateRequiredSampleSize function from this lesson, determine the required sample size per variant for a baseline conversion rate of 5% and a minimum detectable effect of 1 percentage point. Then, using auditTestPower, evaluate whether a team that only collected 2,000 visitors per variant can trust a 'no significant difference' result from that test.",
        taskHi: 'Is lesson ke calculateRequiredSampleSize function use karke, ek baseline conversion rate 5% aur ek minimum detectable effect 1 percentage point ke liye required sample size per variant determine karo. Phir, auditTestPower use karke, evaluate karo ki kya ek team jisne sirf 2,000 visitors per variant collect kiye ek "no significant difference" result us test se trust kar sakti hai.',
        hint: "Call calculateRequiredSampleSize(0.05, 0.01) to get the required sample size, then pass that result along with 2000 into auditTestPower to check whether the team's actual sample was adequate.",
        hintHi: 'calculateRequiredSampleSize(0.05, 0.01) call karo required sample size paane ke liye, phir wo result 2000 ke saath auditTestPower mein pass karo ye check karne ke liye ki kya team ka actual sample adequate tha.',
      },
    ],

    keyTakeaways: [
      "Statistical significance (is the difference likely real?) and practical significance (is it big enough to matter?) are genuinely separate questions — a large sample can make even a tiny, real effect statistically significant.",
      "Practical significance requires a deliberate, pre-declared minimum meaningful threshold, checked against the observed effect size independently of the statistical test.",
      "A runnable sample-size calculator, using the standard two-proportion power formula, determines whether a planned test can actually detect an effect of the size that would matter.",
      "A 'no significant difference' result from an underpowered test is not trustworthy evidence that no real effect exists — it may simply mean the sample was too small, closing Module 18's complete statistical toolkit alongside Lessons 1-2.",
    ],
    keyTakeawaysHi: [
      'Statistical significance (kya difference likely real hai?) aur practical significance (kya ye matter karne jitna bada hai?) genuinely separate questions hain — ek large sample even ek tiny, real effect ko statistically significant bana sakta hai.',
      'Practical significance ko ek deliberate, pre-declared minimum meaningful threshold chahiye, statistical test se independently observed effect size ke against checked.',
      'Ek runnable sample-size calculator, standard two-proportion power formula use karte hue, determine karta hai ki kya ek planned test actually us size ke effect ko detect kar sakta hai jo matter karega.',
      'Ek underpowered test se "no significant difference" result koi real effect exist nahi karta uska trustworthy evidence nahi hai — iska simply matlab ho sakta hai ki sample bahut chhota tha, Module 18 ke complete statistical toolkit ko Lessons 1-2 ke saath close karte hue.',
    ],
  },
];
