/**
 * Psychology for Developers — Module 6: Decision Fatigue & Choice Architecture, lessons 1-3.
 *
 * Lesson 1: Hick's Law — why the time to decide grows with the number of options.
 * Lesson 2: The paradox of choice — why more options can reduce satisfaction and completion.
 * Lesson 3: Concrete choice-architecture patterns for forms, settings, and menus.
 */

import type { CourseLesson } from './course-js-module1';

export const PSYCH_MODULE_6: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'psych-hicks-law-decision-time',
    title: "Hick's Law — Why Decision Time Grows With the Number of Options",
    titleHi: "Hick's Law — Options Ki Number Ke Saath Decision Time Kyun Badhta Hai",
    description:
      "A measured, quantifiable relationship between the number of choices presented and how long a person takes to choose between them — not a linear relationship, but a specific, well-documented logarithmic one with direct implications for menu and navigation design.",
    descriptionHi:
      'Presented choices ki number aur ek insaan unke beech choose karne mein kitna time leta hai iske beech ek measured, quantifiable relationship — ek linear relationship nahi, balki ek specific, well-documented logarithmic wala menu aur navigation design ke liye direct implications ke saath.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A diner handed a single-page menu with eight dishes decides quickly, while the same diner handed a forty-page menu with hundreds of dishes takes dramatically longer — and the slowdown isn't just proportional to the extra options, it compounds as the menu keeps growing.** A diner scanning eight dishes can hold most of the menu's structure in mind at once (echoing Module 1's working-memory chunking limits) and reach a decision quickly. Handed a forty-page menu with hundreds of items, the same diner doesn't simply take five times longer for five times the options — the decision often drags out disproportionately, since each additional option doesn't just add its own consideration time, it also makes comparing every existing option against every new one require more mental work. This is why restaurants with genuinely enormous menus often report slower table turnover and more customer indecision than restaurants with a smaller, curated selection, even though the enormous menu technically offers strictly more of what any individual customer could possibly want. This is exactly the mathematical relationship Hick's Law describes for choice more generally: decision time doesn't grow proportionally with the number of options, it grows with the LOGARITHM of the number of options — meaning going from 2 options to 4 adds meaningfully to decision time, but going from 32 options to 34 adds comparatively little, yet the raw item count climbing into the dozens or hundreds still produces a real, measurable, and often disproportionate slowdown compared to a short, curated list.",
      hi: 'ek diner ko ek single-page menu diya jaata hai aath dishes ke saath jaldi decide karta hai, jabki wahi diner ko ek forty-page menu diya jaata hai hundreds of dishes ke saath dramatically zyada time leta hai — aur slowdown sirf extra options ke proportional nahi hai, ye compound hota hai jaise menu badhta rehta hai. Aath dishes scan karta ek diner menu ke zyada tar structure ko ek saath mind mein rakh sakta hai (Module 1 ke working-memory chunking limits ko echo karte hue) aur jaldi ek decision pe pahunch sakta hai. Ek forty-page menu diya gaya hundreds of items ke saath, wahi diner simply paanch guna zyada time nahi leta paanch guna options ke liye — decision aksar disproportionately drag out karta hai, kyunki har additional option sirf apna khud ka consideration time add nahi karta, ye bhi banata hai ki har existing option ko har naye ke against compare karne ke liye zyada mental work chahiye. Yahi wajah hai genuinely enormous menus wale restaurants aksar slower table turnover aur zyada customer indecision report karte hain un restaurants se jinke paas ek smaller, curated selection hai, chahe enormous menu technically strictly zyada offer kare us cheez ka jo koi individual customer possibly chahta ho. Ye exactly wo mathematical relationship hai jise Hick\'s Law choice ke liye zyada generally describe karta hai: decision time options ki number ke saath proportionally nahi badhta, ye options ki number ke LOGARITHM ke saath badhta hai — matlab 2 options se 4 tak jaana decision time mein meaningfully add karta hai, par 32 options se 34 tak jaana comparatively kam add karta hai, phir bhi raw item count dozens ya hundreds tak climb karna abhi bhi ek real, measurable, aur aksar disproportionate slowdown produce karta hai ek short, curated list ke compare mein.',
    },

    simple: `**The precise, measured finding (Hick, 1952, and Hyman's related
1953 work — extensively replicated since):**

\`\`\`
Reaction time to choose among N options grows LOGARITHMICALLY with N,
not linearly: RT = a + b * log2(N + 1)

Practical translation: doubling the number of options does NOT double
decision time — it adds a roughly CONSTANT amount of additional time.
But this constant addition compounds as options keep being added, and
crucially, MORE options never reduces decision time — the relationship
is monotonically increasing, just at a shrinking rate.
\`\`\`

**A concrete, checkable implication for navigation menu design — why
a flat menu with 30 items is measurably worse than a well-organized
menu with the same 30 items grouped into 5 categories of 6:**

\`\`\`ts
function estimateDecisionTimeHicksLaw(numOptions) {
  const a = 200; // baseline reaction time in ms (illustrative constant)
  const b = 150; // scaling constant (illustrative)
  return a + b * Math.log2(numOptions + 1);
}

// A flat menu: choosing among all 30 items directly
const flatMenuTime = estimateDecisionTimeHicksLaw(30); // ~200 + 150*4.95 ≈ 942ms

// A grouped menu: choosing among 5 categories, THEN among 6 items —
// two smaller decisions in sequence, each with far fewer options
const groupedMenuTime =
  estimateDecisionTimeHicksLaw(5) + estimateDecisionTimeHicksLaw(6);
// ~(200 + 150*2.58) + (200 + 150*2.81) ≈ 787 + 821 ≈ 1608ms for BOTH steps combined
// — but each individual step is a much faster, easier decision, and
// perceived effort/confusion (not just raw time) tends to be lower
\`\`\`

**Why the practical lesson isn't simply "fewer options are always
better" — Hick's Law describes decision TIME, not decision QUALITY or
satisfaction, which Lesson 2 covers separately:**

\`\`\`
Hick's Law is specifically about how long a choice takes to make, based
on measured reaction-time experiments. It does NOT by itself say
whether having more options makes someone happier or less happy with
their eventual choice — that's a related but genuinely distinct
finding (the paradox of choice, Lesson 2's focus). This lesson's
practical scope is narrower and more mechanical: predicting and
reducing decision TIME through the number and organization of options
presented at once.
\`\`\`

**A concrete design pattern this directly motivates — progressive
disclosure, breaking one large choice into a sequence of smaller ones:**

\`\`\`tsx
// A flat settings page with 40 individual options — high N, slow
// per this lesson's math, at the exact moment a user is scanning it
function SettingsPageFlat({ options }) {
  return <ul>{options.map((opt) => <SettingItem key={opt.id} {...opt} />)}</ul>;
}

// The same 40 options organized into 6 categories — each category
// choice and each within-category choice is a much smaller N
function SettingsPageGrouped({ categories }) {
  const [activeCategory, setActiveCategory] = useState(null);
  if (!activeCategory) {
    // Step 1: choose among ~6 categories — small N, fast per Hick's Law
    return (
      <ul>
        {categories.map((cat) => (
          <li key={cat.id} onClick={() => setActiveCategory(cat.id)}>{cat.name}</li>
        ))}
      </ul>
    );
  }
  // Step 2: choose among ~7 items within the selected category — also small N
  const category = categories.find((c) => c.id === activeCategory);
  return <ul>{category.options.map((opt) => <SettingItem key={opt.id} {...opt} />)}</ul>;
}
\`\`\`

**Why this connects directly to Module 1's chunking and Module 2's
Gestalt grouping:** Hick's Law gives a PRECISE, quantified reason for
why chunking and grouping (established in earlier modules as
qualitative principles) actually work — reducing the number of options
visible and comparable AT ONCE, whether through Gestalt grouping's
visual clustering or through progressive disclosure's sequential
steps, directly reduces the N in Hick's Law's formula, which directly
and measurably reduces decision time.`,

    simpleHi: `**Precise, measured finding (Hick, 1952, aur Hyman ka related 1953
work — tab se extensively replicated):**

\`\`\`
N options ke beech choose karne ka reaction time N ke saath
LOGARITHMICALLY badhta hai, linearly nahi: RT = a + b * log2(N + 1)

Practical translation: options ki number ko double karna decision time
ko double NAHI karta — ye roughly ek CONSTANT amount ka additional
time add karta hai. Par ye constant addition compound hota hai jaise
options add hote rehte hain, aur crucially, ZYADA options kabhi
decision time kam nahi karte — relationship monotonically increasing
hai, sirf ek shrinking rate pe.
\`\`\`

**Navigation menu design ke liye ek concrete, checkable implication —
ek flat menu 30 items ke saath ek well-organized menu se wahi 30 items
5 categories of 6 mein grouped se measurably worse kyun hai:**

\`\`\`ts
function estimateDecisionTimeHicksLaw(numOptions) {
  const a = 200; // baseline reaction time ms mein (illustrative constant)
  const b = 150; // scaling constant (illustrative)
  return a + b * Math.log2(numOptions + 1);
}

// Ek flat menu: sab 30 items ke beech directly choose karna
const flatMenuTime = estimateDecisionTimeHicksLaw(30); // ~200 + 150*4.95 ≈ 942ms

// Ek grouped menu: 5 categories ke beech choose karna, PHIR 6 items
// ke beech — sequence mein do smaller decisions, har ek ke paas kaafi kam options
const groupedMenuTime =
  estimateDecisionTimeHicksLaw(5) + estimateDecisionTimeHicksLaw(6);
// ~(200 + 150*2.58) + (200 + 150*2.81) ≈ 787 + 821 ≈ 1608ms DONO steps ke liye combined
// — par har individual step ek kaafi faster, easier decision hai, aur
// perceived effort/confusion (sirf raw time nahi) kam hone ki tendency rakhta hai
\`\`\`

**Practical lesson simply "kam options hamesha behtar hain" kyun nahi
hai — Hick's Law decision TIME describe karta hai, decision QUALITY
ya satisfaction nahi, jise Lesson 2 separately cover karta hai:**

\`\`\`
Hick's Law specifically is baare mein hai ki ek choice banane mein
kitna time lagta hai, measured reaction-time experiments ke basis pe.
Ye khud se ye NAHI kehta ki zyada options hone se koi zyada khush ya
kam khush hoga apni eventual choice se — wo ek related par genuinely
distinct finding hai (paradox of choice, Lesson 2 ka focus). Is
lesson ka practical scope narrower aur zyada mechanical hai: decision
TIME ko predict aur kam karna ek saath present kiye gaye options ki
number aur organization ke through.
\`\`\`

**Ek concrete design pattern jise ye directly motivate karta hai —
progressive disclosure, ek bade choice ko smaller ones ki ek sequence
mein todna:**

\`\`\`tsx
// Ek flat settings page 40 individual options ke saath — high N, slow
// is lesson ke math ke hisaab se, exact moment pe jab ek user ise scan kar raha hai
function SettingsPageFlat({ options }) {
  return <ul>{options.map((opt) => <SettingItem key={opt.id} {...opt} />)}</ul>;
}

// Wahi 40 options 6 categories mein organized — har category choice
// aur har within-category choice ek kaafi smaller N hai
function SettingsPageGrouped({ categories }) {
  const [activeCategory, setActiveCategory] = useState(null);
  if (!activeCategory) {
    // Step 1: ~6 categories ke beech choose karo — small N, Hick's Law ke hisaab se fast
    return (
      <ul>
        {categories.map((cat) => (
          <li key={cat.id} onClick={() => setActiveCategory(cat.id)}>{cat.name}</li>
        ))}
      </ul>
    );
  }
  // Step 2: selected category ke andar ~7 items ke beech choose karo — bhi small N
  const category = categories.find((c) => c.id === activeCategory);
  return <ul>{category.options.map((opt) => <SettingItem key={opt.id} {...opt} />)}</ul>;
}
\`\`\`

**Ye directly Module 1 ke chunking aur Module 2 ke Gestalt grouping se
kaise connect karta hai:** Hick's Law ek PRECISE, quantified reason
deta hai is baat ka ki chunking aur grouping (earlier modules mein
qualitative principles ki tarah established) actually kyun kaam karte
hain — options ki number ko kam karna jo EK SAATH visible aur
comparable hain, chahe Gestalt grouping ke visual clustering ke
through ho ya progressive disclosure ke sequential steps ke through,
directly Hick's Law ke formula mein N ko kam karta hai, jo directly
aur measurably decision time ko kam karta hai.`,

    content: `## Why Hick's Law is a precise, measured relationship rather than a
vague "fewer choices are simpler" intuition

Hick's original 1952 research (extended by Hyman's related 1953 work)
measured reaction time as a function of the number of available choices
across controlled experiments, finding a specific logarithmic
relationship: RT = a + b × log2(N + 1). This precision matters because
it makes a specific, falsifiable, and useful prediction — decision time
grows with the logarithm, not the raw count, of available options —
rather than offering only the vague, unquantified intuition that
"fewer options are simpler," which wouldn't support the specific design
tradeoffs this lesson and Lesson 3 examine.

## Why the logarithmic relationship means the FIRST additional options
matter more than later ones, but more options never help

Because the relationship is logarithmic, moving from 2 options to 4
adds meaningfully more decision time than moving from 32 options to 64
adds, even though both represent a doubling — the marginal cost of each
additional option decreases as the total grows. But critically, the
relationship remains monotonically increasing throughout: there is no
point at which adding more options reduces decision time. This is why
consolidating a small number of already-few options rarely produces a
meaningful speed benefit, while breaking up a large, unwieldy option
set into meaningfully smaller groups produces a substantial one.

## Why progressive disclosure and grouping are direct, mathematical
applications of Hick's Law, not just generically "good UX"

Since decision time depends on the number of options considered at
once, restructuring one large decision (choosing among 30 flat options)
into a sequence of smaller decisions (choosing among 5 categories, then
among roughly 6 items within the chosen category) directly reduces the
N in each individual step of Hick's Law's formula. This isn't merely a
stylistic preference for "cleaner" interfaces — it's a direct,
calculable application of a measured psychological relationship,
connecting concretely to the qualitative grouping principles Module 2
established (Gestalt clustering) and giving them a precise, quantified
mechanism.

## Why this lesson's scope is deliberately narrower than "more choice
is bad" — Hick's Law is about time, not satisfaction

Hick's Law specifically predicts and explains decision TIME as a
function of option count — it makes no direct claim about whether more
options make a person happier or less happy with their eventual choice,
or whether they complete the choice at all versus abandoning it. That
related but distinct question — whether abundant choice reduces
satisfaction and completion rates — is Lesson 2's focus (the paradox of
choice). Keeping these two findings distinct is important: a design
change justified by reducing decision time (Hick's Law) is a different
claim from one justified by increasing satisfaction or completion rate
(the paradox of choice), even though both point toward similar
practical recommendations.

## How this lesson opens Module 6

This lesson establishes the precise, quantitative relationship between
option count and decision speed — the mechanical foundation Module 6
builds on. Lesson 2 extends the picture from speed to satisfaction and
completion, and Lesson 3 assembles both findings into concrete,
implementable choice-architecture patterns for real forms, settings
pages, and menus.`,

    contentHi: `## Hick's Law ek precise, measured relationship kyun hai ek vague "kam choices simpler hain" intuition ke bajaye

Hick ki original 1952 research (Hyman ke related 1953 work se extended)
ne reaction time ko available choices ki number ke function ki tarah
measure kiya controlled experiments ke across, ek specific logarithmic
relationship find karte hue: RT = a + b × log2(N + 1). Ye precision
matter karta hai kyunki ye ek specific, falsifiable, aur useful
prediction banata hai — decision time available options ke logarithm
se badhta hai, raw count se nahi — sirf vague, unquantified intuition
offer karne ke bajaye ki "kam options simpler hain," jo specific design
tradeoffs ko support nahi karega jinhe ye lesson aur Lesson 3 examine
karte hain.

## Logarithmic relationship ka matlab kyun hai ki FIRST additional options zyada matter karte hain later ones se, par zyada options kabhi help nahi karte

Kyunki relationship logarithmic hai, 2 options se 4 tak move karna
meaningfully zyada decision time add karta hai us se jo 32 options se
64 tak move karna add karta hai, chahe dono ek doubling represent
karte hon — har additional option ki marginal cost decrease hoti hai
jaise total badhta hai. Par critically, relationship poori tarah
monotonically increasing rehta hai: koi point nahi hai jahan zyada
options add karna decision time kam kare. Yahi wajah hai already-few
options ki ek small number ko consolidate karna rarely ek meaningful
speed benefit produce karta hai, jabki ek large, unwieldy option set
ko meaningfully smaller groups mein todna ek substantial wala produce
karta hai.

## Progressive disclosure aur grouping Hick's Law ke direct, mathematical applications kyun hain, generically "good UX" nahi

Kyunki decision time us options ki number pe depend karta hai jo ek
saath consider ki jaati hain, ek bade decision (30 flat options ke
beech choose karna) ko smaller decisions ki ek sequence mein
restructure karna (5 categories ke beech choose karna, phir chosen
category ke andar roughly 6 items ke beech) directly Hick's Law ke
formula ke har individual step mein N ko kam karta hai. Ye sirf
"cleaner" interfaces ke liye ek stylistic preference nahi hai — ye ek
measured psychological relationship ka ek direct, calculable
application hai, directly qualitative grouping principles se connect
karte hue jise Module 2 ne establish kiya (Gestalt clustering) aur
unhe ek precise, quantified mechanism dete hue.

## Is lesson ka scope deliberately "zyada choice bad hai" se narrower kyun hai — Hick's Law time ke baare mein hai, satisfaction ke baare mein nahi

Hick's Law specifically decision TIME ko predict aur explain karta hai
option count ke function ki tarah — ye koi direct claim nahi karta is
baat pe ki kya zyada options ek insaan ko zyada khush ya kam khush
banate hain unki eventual choice se, ya kya wo choice complete karte
hain bilkul us abandon karne ke bajaye. Wo related par distinct
question — kya abundant choice satisfaction aur completion rates kam
karta hai — Lesson 2 ka focus hai (paradox of choice). In do findings
ko distinct rakhna important hai: ek design change jo decision time
kam karke justified hai (Hick's Law) ek different claim hai us se jo
satisfaction ya completion rate badhane se justified hai (paradox of
choice), chahe dono similar practical recommendations ki taraf point
karte hon.

## Ye lesson Module 6 ko kaise open karta hai

Ye lesson option count aur decision speed ke beech precise,
quantitative relationship establish karta hai — mechanical foundation
jispe Module 6 build karta hai. Lesson 2 picture ko speed se
satisfaction aur completion tak extend karta hai, aur Lesson 3 dono
findings ko concrete, implementable choice-architecture patterns mein
assemble karta hai real forms, settings pages, aur menus ke liye.`,

    examples: [
      {
        title: "A Hick's Law estimator applied to a flat vs grouped navigation menu comparison",
        titleHi: "Ek Hick's Law estimator jo ek flat vs grouped navigation menu comparison pe applied hai",
        codeJs: `function estimateDecisionTimeMs(numOptions) {
  const baselineMs = 200;
  const scalingConstant = 150;
  return baselineMs + scalingConstant * Math.log2(numOptions + 1);
}

function compareFlatVsGroupedMenu(flatOptionCount, numCategories, itemsPerCategory) {
  const flatTime = estimateDecisionTimeMs(flatOptionCount);

  // Grouped: one decision among categories, then one among items
  // within the chosen category — two much-smaller-N decisions
  const categoryStepTime = estimateDecisionTimeMs(numCategories);
  const itemStepTime = estimateDecisionTimeMs(itemsPerCategory);
  const groupedTime = categoryStepTime + itemStepTime;

  return {
    flatOptionCount,
    flatDecisionTimeMs: Math.round(flatTime),
    groupedDecisionTimeMs: Math.round(groupedTime),
    // Even though the grouped version is two sequential decisions,
    // each individual decision is far faster and less overwhelming
    perStepComplexityReduced: numCategories < flatOptionCount && itemsPerCategory < flatOptionCount,
  };
}

const comparison = compareFlatVsGroupedMenu(30, 5, 6);`,
        codeTs: `function estimateDecisionTimeMs(numOptions: number): number {
  const baselineMs = 200;
  const scalingConstant = 150;
  return baselineMs + scalingConstant * Math.log2(numOptions + 1);
}

interface MenuComparison {
  flatOptionCount: number;
  flatDecisionTimeMs: number;
  groupedDecisionTimeMs: number;
  perStepComplexityReduced: boolean;
}

function compareFlatVsGroupedMenu(
  flatOptionCount: number,
  numCategories: number,
  itemsPerCategory: number,
): MenuComparison {
  const flatTime = estimateDecisionTimeMs(flatOptionCount);

  // Grouped: one decision among categories, then one among items
  // within the chosen category — two much-smaller-N decisions
  const categoryStepTime = estimateDecisionTimeMs(numCategories);
  const itemStepTime = estimateDecisionTimeMs(itemsPerCategory);
  const groupedTime = categoryStepTime + itemStepTime;

  return {
    flatOptionCount,
    flatDecisionTimeMs: Math.round(flatTime),
    groupedDecisionTimeMs: Math.round(groupedTime),
    // Even though the grouped version is two sequential decisions,
    // each individual decision is far faster and less overwhelming
    perStepComplexityReduced: numCategories < flatOptionCount && itemsPerCategory < flatOptionCount,
  };
}

const comparison = compareFlatVsGroupedMenu(30, 5, 6);`,
        code: `const flatTime = estimateDecisionTimeMs(30);       // one big decision, high N
const groupedTime = estimateDecisionTimeMs(5) + estimateDecisionTimeMs(6); // two small decisions`,
        output:
          "The flat 30-option menu is estimated at roughly 942ms for a single decision. The grouped version's total across both steps is somewhat higher in raw combined time (~1608ms), but each individual step involves a far smaller N (5 or 6 rather than 30), meaning each step is measurably faster and less cognitively demanding than the single large decision — illustrating why grouping reduces per-step complexity even when total sequential time isn't strictly lower.",
        explain:
          "This example makes Hick's Law's logarithmic formula directly computable and comparable across a realistic flat-versus-grouped menu design decision, showing precisely how breaking a large option set into smaller sequential steps changes the N in each individual calculation.",
        explainHi:
          "Ye example Hick's Law ke logarithmic formula ko directly computable aur comparable banata hai ek realistic flat-versus-grouped menu design decision ke across, precisely dikhate hue ki ek large option set ko smaller sequential steps mein todna har individual calculation mein N ko kaise badalta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming decision time scales linearly with option count, leading
// to an underestimate of how much a large flat list actually slows users
function estimateTimeWrong(numOptions) {
  const timePerOption = 30; // ms — a LINEAR assumption
  return numOptions * timePerOption;
  // For 30 options: 900ms. For 60 options: 1800ms — implies doubling
  // options exactly doubles time, which measured research does not support
}`,
        right: `// Using the actual measured logarithmic relationship
function estimateTimeRight(numOptions) {
  const baselineMs = 200;
  const scalingConstant = 150;
  return baselineMs + scalingConstant * Math.log2(numOptions + 1);
  // For 30 options: ~942ms. For 60 options: ~1114ms — doubling
  // options does NOT double time, consistent with measured research
}`,
        why: "Assuming a linear relationship between option count and decision time both overestimates the cost of doubling an already-large option set and, more importantly, obscures the real, measured logarithmic relationship that actually determines how much a specific design change (like grouping) will help — an incorrect model produces incorrect predictions about which interventions are actually worth the engineering effort.",
        whyHi:
          "Option count aur decision time ke beech ek linear relationship assume karna dono ek already-large option set ko double karne ki cost ko overestimate karta hai aur, zyada importantly, us real, measured logarithmic relationship ko obscure karta hai jo actually determine karti hai ki ek specific design change (jaise grouping) kitna help karega — ek incorrect model incorrect predictions produce karta hai is baat ke baare mein ki kaunse interventions actually engineering effort ke layak hain.",
      },
    ],

    realWorld: [
      {
        en: "A production e-commerce site's category-navigation redesign, grouping a flat list of 45 product categories into 7 top-level groups, was validated with real click-timing telemetry that matched Hick's Law's predicted pattern closely enough that the team adopted the logarithmic model directly in their own internal navigation-design guidelines for estimating the impact of future menu restructuring.",
        hi: 'Ek production e-commerce site ka category-navigation redesign, 45 product categories ki ek flat list ko 7 top-level groups mein group karte hue, real click-timing telemetry ke saath validate kiya gaya jo Hick\'s Law ke predicted pattern se itni closely match hui ki team ne logarithmic model ko directly apne internal navigation-design guidelines mein adopt kiya future menu restructuring ke impact ko estimate karne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: "What does Hick's Law actually predict, and why is the logarithmic relationship important rather than assuming a linear one?",
        qHi: "Hick's Law actually kya predict karta hai, aur logarithmic relationship important kyun hai ek linear wala assume karne ke bajaye?",
        a: "Hick's Law predicts that decision time grows with the logarithm of the number of available options (RT = a + b × log2(N+1)), not linearly. This matters because it means doubling options doesn't double decision time — the marginal cost of each additional option decreases as the total grows — while still being monotonically increasing, meaning more options never reduce decision time. A linear assumption would misestimate both the cost of large option sets and the benefit of specific design interventions like grouping.",
        aHi: "Hick's Law predict karta hai ki decision time available options ki number ke logarithm ke saath badhta hai (RT = a + b × log2(N+1)), linearly nahi. Ye matter karta hai kyunki iska matlab hai options ko double karna decision time ko double nahi karta — har additional option ki marginal cost decrease hoti hai jaise total badhta hai — jabki poori tarah monotonically increasing rehte hue, matlab zyada options kabhi decision time kam nahi karte. Ek linear assumption dono large option sets ki cost aur grouping jaise specific design interventions ke benefit ko misestimate karega.",
      },
      {
        q: "Why is it important to distinguish Hick's Law (this lesson) from the paradox of choice (Lesson 2) as two separate findings?",
        qHi: "Hick's Law (ye lesson) ko paradox of choice (Lesson 2) se do separate findings ki tarah distinguish karna important kyun hai?",
        a: "Hick's Law specifically concerns decision TIME as a function of option count, based on measured reaction-time experiments. The paradox of choice concerns satisfaction and completion rates, a related but genuinely distinct question. Keeping them separate matters because a design justification based on reducing decision time is a different, independently checkable claim from one based on increasing satisfaction or completion — even though both often point toward similar practical recommendations.",
        aHi: "Hick's Law specifically decision TIME se concerned hai option count ke function ki tarah, measured reaction-time experiments ke basis pe. Paradox of choice satisfaction aur completion rates se concerned hai, ek related par genuinely distinct question. Unhe separate rakhna matter karta hai kyunki decision time kam karne pe based ek design justification ek different, independently checkable claim hai satisfaction ya completion badhane pe based ek se — chahe dono aksar similar practical recommendations ki taraf point karte hon.",
      },
    ],

    exercises: [
      {
        task: "A settings page currently presents 24 options in a single flat list. Using the estimateDecisionTimeMs formula from this lesson's examples, calculate the estimated decision time for the flat list, then calculate the total for a regrouped version with 4 categories of 6 items each. Explain what the result shows about the actual time savings versus the per-step complexity reduction.",
        taskHi: 'Ek settings page currently 24 options ko ek single flat list mein present karta hai. Is lesson ke examples se estimateDecisionTimeMs formula use karke, flat list ke liye estimated decision time calculate karo, phir 4 categories of 6 items each wale ek regrouped version ke liye total calculate karo. Explain karo ki result actual time savings versus per-step complexity reduction ke baare mein kya dikhata hai.',
        hint: "Compute estimateDecisionTimeMs(24) for the flat version, and estimateDecisionTimeMs(4) + estimateDecisionTimeMs(6) for the grouped version, then compare not just the totals but the size of N at each individual decision point.",
        hintHi: 'Flat version ke liye estimateDecisionTimeMs(24) compute karo, aur grouped version ke liye estimateDecisionTimeMs(4) + estimateDecisionTimeMs(6), phir sirf totals nahi balki har individual decision point pe N ka size compare karo.',
      },
    ],

    keyTakeaways: [
      "Hick's Law establishes a precise, measured logarithmic relationship between the number of options and decision time (RT = a + b × log2(N+1)), not a linear one.",
      "More options never reduce decision time, but the marginal cost of each additional option shrinks as the total grows — meaning breaking up a large option set into smaller groups produces a real, calculable time reduction.",
      "Progressive disclosure and grouping are direct, mathematical applications of Hick's Law, giving Module 2's qualitative Gestalt-grouping principle a precise, quantified mechanism.",
      "Hick's Law is specifically about decision speed, not satisfaction or completion — a genuinely distinct question this module's Lesson 2 addresses separately.",
    ],
    keyTakeawaysHi: [
      "Hick's Law options ki number aur decision time ke beech ek precise, measured logarithmic relationship establish karta hai (RT = a + b × log2(N+1)), ek linear wala nahi.",
      'Zyada options kabhi decision time kam nahi karte, par har additional option ki marginal cost shrink hoti hai jaise total badhta hai — matlab ek large option set ko smaller groups mein todna ek real, calculable time reduction produce karta hai.',
      'Progressive disclosure aur grouping Hick\'s Law ke direct, mathematical applications hain, Module 2 ke qualitative Gestalt-grouping principle ko ek precise, quantified mechanism dete hue.',
      "Hick's Law specifically decision speed ke baare mein hai, satisfaction ya completion ke baare mein nahi — ek genuinely distinct question jise is module ka Lesson 2 separately address karta hai.",
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'psych-paradox-of-choice',
    title: 'The Paradox of Choice — When More Options Reduce Satisfaction',
    titleHi: 'The Paradox of Choice — Zyada Options Satisfaction Kab Kam Karte Hain',
    description:
      "A genuinely distinct finding from Hick's Law: beyond a certain point, more options don't just slow decisions down, they measurably reduce the likelihood of completing a choice at all and reduce satisfaction with whatever choice is eventually made.",
    descriptionHi:
      'Hick\'s Law se ek genuinely distinct finding: ek certain point ke aage, zyada options sirf decisions ko slow nahi karte, wo ek choice ko bilkul complete karne ki likelihood ko measurably kam karte hain aur jo bhi choice eventually banayi jaati hai uske saath satisfaction ko kam karte hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A grocery store's famous jam-tasting experiment: a table offering 24 different jam flavors attracted more browsers, but a table offering only 6 flavors produced dramatically more actual purchases — abundance drew attention but suppressed completed decisions.** A grocery store setting up a tasting table with 24 jam varieties genuinely attracted more people to stop and look, curious about the sheer range on display. But when it came time to actually buy, only a small fraction of those browsers completed a purchase — faced with 24 similar options, comparing all of them well enough to feel confident in a choice felt overwhelming, and many browsers walked away having tasted several jams but purchased none, effectively defaulting to no decision at all. The same store's table with only 6 varieties attracted somewhat fewer curious browsers, but a dramatically higher percentage of those browsers actually completed a purchase, and follow-up surveys found they also reported feeling more confident and satisfied with what they'd bought. This is the actual, measured shape of the paradox of choice: abundant options can increase initial interest and browsing while simultaneously decreasing both the rate of actually completing a decision and satisfaction with whatever decision does get made — a finding genuinely distinct from Hick's Law's point about raw decision speed, since here the practical failure mode isn't just \"it took longer,\" it's \"many people simply gave up and chose nothing at all, and those who did choose felt less good about it.\"",
      hi: 'ek grocery store ka famous jam-tasting experiment: ek table jo 24 different jam flavors offer karti hai zyada browsers attract karti hai, par ek table jo sirf 6 flavors offer karti hai dramatically zyada actual purchases produce karti hai — abundance attention khinchta hai par completed decisions suppress karta hai. Ek grocery store jo 24 jam varieties ke saath ek tasting table set up karta hai genuinely zyada logon ko rukne aur dekhne ke liye attract karta hai, display pe range ke baare mein curious hote hue. Par jab actually khareedne ka time aata hai, sirf un browsers ka ek small fraction purchase complete karta hai — 24 similar options ke saamne, unhe sab ko itna achhe se compare karna ki ek choice mein confident feel kiya jaaye overwhelming feel karta hai, aur kai browsers kai jams taste karke koi bhi purchase kiye bina chale jaate hain, effectively koi decision hi nahi lete. Wahi store ki table sirf 6 varieties ke saath thode kam curious browsers attract karti hai, par un browsers ka ek dramatically higher percentage actually ek purchase complete karta hai, aur follow-up surveys ne paaya ki wo bhi report karte hain ki wo zyada confident aur satisfied feel karte hain jo unhone khareeda uske saath. Ye paradox of choice ka actual, measured shape hai: abundant options initial interest aur browsing ko badha sakte hain jabki simultaneously actually ek decision complete karne ki rate aur jo bhi decision banayi jaati hai uski satisfaction ko kam karte hue — ek finding jo Hick\'s Law ke raw decision speed ke point se genuinely distinct hai, kyunki yahan practical failure mode sirf "isme zyada time laga" nahi hai, ye "kai log simply give up kar diye aur kuch bhi choose nahi kiya, aur jinhone choose kiya wo iske baare mein less good feel kiya."',
    },

    simple: `**The core finding — a real, measured study (Iyengar & Lepper's
2000 jam-tasting research, extensively cited and replicated in
variations since):**

\`\`\`
A tasting table with 24 jam varieties attracted more browsers than one
with 6 varieties, but the 24-variety table produced a MUCH LOWER
purchase completion rate — roughly 3% of browsers versus roughly 30%
for the 6-variety table. Beyond a certain point, more options actively
suppress completed decisions, not merely slow them down.
\`\`\`

**Why this is a genuinely distinct finding from Lesson 1's Hick's
Law — a checkable, practical distinction:**

\`\`\`ts
function distinguishHicksLawFromParadoxOfChoice(observedEffect) {
  if (observedEffect.type === 'took_longer_but_completed') {
    return 'Hick\\'s Law — decision TIME increased, but the decision was still made';
  }
  if (observedEffect.type === 'abandoned_without_deciding') {
    return 'Paradox of choice — the decision was never completed at all';
  }
  if (observedEffect.type === 'completed_but_less_satisfied') {
    return 'Paradox of choice — completed, but satisfaction with the outcome dropped';
  }
}
\`\`\`

**A concrete, checkable pattern in product design — why an e-commerce
category page with 200 unfiltered products often converts worse than
one with a well-curated 20-30 "recommended" subset:**

\`\`\`tsx
// A category page showing all 200 raw results, unfiltered
function ProductCategoryPageWrong({ allProducts }) {
  return <ProductGrid products={allProducts} />; // 200 items — a genuine
  // paradox-of-choice risk, distinct from and beyond Hick's Law's
  // pure speed concern
}

// A curated default view, with the full catalog still genuinely
// accessible for users who specifically want to browse everything
function ProductCategoryPageRight({ allProducts, recommendedSubset }) {
  const [showAll, setShowAll] = useState(false);
  return (
    <div>
      <ProductGrid products={showAll ? allProducts : recommendedSubset} />
      {!showAll && (
        <button onClick={() => setShowAll(true)}>
          Show all {allProducts.length} results
        </button>
      )}
    </div>
  );
}
\`\`\`

**Why the paradox of choice does NOT mean "always minimize options
regardless of context" — the genuine, important boundary conditions:**

\`\`\`
The effect is strongest when: options are numerous AND genuinely
similar to each other (making careful comparison feel necessary but
exhausting), the decision feels consequential or hard to reverse, and
the chooser lacks strong pre-existing preferences to quickly narrow
the field. A choice among a few genuinely distinct, easily
differentiated options, or a decision an expert user makes routinely
with clear preferences, is much less susceptible to this specific
effect — this lesson's finding is a real, measured tendency, not a
universal law with no exceptions.
\`\`\`

**A concrete, testable prediction this lesson's finding makes —
genuinely checkable with real product data, connecting to Module 18's
A/B testing discipline:**

\`\`\`ts
function predictParadoxOfChoiceRisk(context) {
  const riskFactors = [
    context.numOptions > 15,
    context.optionsAreSimilarToEachOther,
    context.decisionFeelsConsequentialOrIrreversible,
    !context.userHasStrongExistingPreference,
  ];
  const riskScore = riskFactors.filter(Boolean).length;
  return {
    riskLevel: riskScore >= 3 ? 'high' : riskScore >= 2 ? 'moderate' : 'low',
    recommendation: riskScore >= 2 ? 'Test a curated default view against the full option set' : 'Full option set likely fine as-is',
  };
}
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established that
decision TIME grows with option count, quantified precisely by Hick's
Law. This lesson establishes a related but genuinely separate cost:
beyond a certain point, abundant options don't just slow a decision
down, they measurably reduce the chance the decision gets made at all,
and reduce satisfaction with whatever choice does get made — two
distinct findings that, taken together, motivate Lesson 3's concrete
choice-architecture patterns.`,

    simpleHi: `**Core finding — ek real, measured study (Iyengar & Lepper ki 2000
jam-tasting research, extensively cited aur tab se variations mein
replicated):**

\`\`\`
Ek tasting table 24 jam varieties ke saath zyada browsers attract kiya
ek table se jiske paas 6 varieties thi, par 24-variety table ne
KAAFI KAM purchase completion rate produce ki — roughly 3% browsers
versus roughly 30% 6-variety table ke liye. Ek certain point ke aage,
zyada options actively completed decisions ko suppress karte hain,
sirf unhe slow nahi karte.
\`\`\`

**Ye Lesson 1 ke Hick's Law se ek genuinely distinct finding kyun hai
— ek checkable, practical distinction:**

\`\`\`ts
function distinguishHicksLawFromParadoxOfChoice(observedEffect) {
  if (observedEffect.type === 'took_longer_but_completed') {
    return 'Hick\\'s Law — decision TIME increased, but the decision was still made';
  }
  if (observedEffect.type === 'abandoned_without_deciding') {
    return 'Paradox of choice — the decision was never completed at all';
  }
  if (observedEffect.type === 'completed_but_less_satisfied') {
    return 'Paradox of choice — completed, but satisfaction with the outcome dropped';
  }
}
\`\`\`

**Product design mein ek concrete, checkable pattern — ek e-commerce
category page 200 unfiltered products ke saath aksar ek well-curated
20-30 "recommended" subset wale se kyun worse convert karta hai:**

\`\`\`tsx
// Ek category page sab 200 raw results dikhate hue, unfiltered
function ProductCategoryPageWrong({ allProducts }) {
  return <ProductGrid products={allProducts} />; // 200 items — ek genuine
  // paradox-of-choice risk, Hick's Law ke pure speed concern se
  // distinct aur uske aage
}

// Ek curated default view, poore catalog ke saath abhi bhi genuinely
// accessible un users ke liye jo specifically sab kuch browse karna
// chahte hain
function ProductCategoryPageRight({ allProducts, recommendedSubset }) {
  const [showAll, setShowAll] = useState(false);
  return (
    <div>
      <ProductGrid products={showAll ? allProducts : recommendedSubset} />
      {!showAll && (
        <button onClick={() => setShowAll(true)}>
          Show all {allProducts.length} results
        </button>
      )}
    </div>
  );
}
\`\`\`

**Paradox of choice ka matlab "hamesha context se independently
options minimize karo" NAHI hai — genuine, important boundary
conditions:**

\`\`\`
Effect sabse strong hai jab: options numerous AUR genuinely ek doosre
se similar hain (careful comparison ko necessary par exhausting feel
karate hue), decision consequential ya hard to reverse feel karta hai,
aur chooser ke paas field ko quickly narrow karne ke liye strong
pre-existing preferences nahi hain. Kuch genuinely distinct, easily
differentiated options ke beech ek choice, ya ek decision jo ek expert
user routinely clear preferences ke saath leta hai, is specific effect
ke liye kaafi kam susceptible hai — is lesson ki finding ek real,
measured tendency hai, ek universal law nahi koi exceptions ke bina.
\`\`\`

**Ek concrete, testable prediction jise is lesson ki finding banati
hai — real product data ke saath genuinely checkable, Module 18 ke
A/B testing discipline se connect karte hue:**

\`\`\`ts
function predictParadoxOfChoiceRisk(context) {
  const riskFactors = [
    context.numOptions > 15,
    context.optionsAreSimilarToEachOther,
    context.decisionFeelsConsequentialOrIrreversible,
    !context.userHasStrongExistingPreference,
  ];
  const riskScore = riskFactors.filter(Boolean).length;
  return {
    riskLevel: riskScore >= 3 ? 'high' : riskScore >= 2 ? 'moderate' : 'low',
    recommendation: riskScore >= 2 ? 'Test a curated default view against the full option set' : 'Full option set likely fine as-is',
  };
}
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne establish
kiya ki decision TIME option count ke saath badhta hai, Hick's Law se
precisely quantified. Ye lesson ek related par genuinely separate cost
establish karta hai: ek certain point ke aage, abundant options sirf
ek decision ko slow nahi karte, wo measurably us chance ko kam karte
hain ki decision bilkul banayi jaaye, aur jo bhi choice banayi jaati
hai uski satisfaction ko kam karte hain — do distinct findings jo,
saath liye jaane pe, Lesson 3 ke concrete choice-architecture patterns
ko motivate karte hain.`,

    content: `## Why the jam-tasting study established a genuinely distinct
finding from Hick's Law, not merely a restatement of it

Iyengar and Lepper's 2000 research found that a table offering 24 jam
varieties attracted more initial interest but produced a dramatically
lower purchase rate than a table offering 6 varieties — roughly 3%
versus roughly 30%. This is a fundamentally different measurement from
Hick's Law's reaction-time studies: rather than measuring how long a
completed decision took, this research measured whether a decision got
completed at all, and separately, how satisfied people were with
decisions they did complete. The paradox of choice is specifically
about these two outcomes — completion rate and satisfaction — which
are conceptually and empirically distinct from raw decision speed.

## Why the effect is strongest under specific, identifiable conditions
rather than being a universal "fewer options always better" law

The paradox of choice effect is most pronounced when options are both
numerous and genuinely similar to each other, making careful comparison
feel both necessary (since the options aren't easily distinguished at a
glance) and exhausting (since there are many of them to compare
carefully). It's further amplified when the decision feels
consequential or difficult to reverse, and when the chooser lacks a
strong existing preference that would let them quickly narrow the field
without full comparison. This means the effect doesn't apply uniformly
to every choice scenario — an expert user with clear, strong
preferences choosing among familiar options is considerably less
susceptible than a novice facing many unfamiliar, similar alternatives
for a decision that feels high-stakes.

## Why distinguishing "took longer but got decided" from "never got
decided" matters practically for diagnosing a real product problem

A team investigating why a feature or page underperforms needs to know
which of these two genuinely different problems it's facing: users
taking measurably longer to decide but still completing their choice
(a Hick's Law concern, addressed by grouping and progressive
disclosure) versus users abandoning the decision entirely without
choosing anything (a paradox-of-choice concern, addressed by curation
and defaults). These call for different interventions, and conflating
them risks applying the wrong fix — Lesson 1's grouping techniques
address decision speed but won't necessarily fix an abandonment
problem if the underlying issue is genuinely about the sheer number of
similar options overwhelming the chooser's confidence.

## Why this lesson's finding is directly testable, connecting to
Module 18's A/B testing discipline

Because the paradox of choice makes a specific, falsifiable prediction
— that a curated subset will produce a higher completion rate and
higher reported satisfaction than the full option set, under the
specific conditions this lesson identifies — a team doesn't need to
accept the finding on faith. A genuine A/B test comparing completion
rates and satisfaction between a curated default and the full catalog,
following Module 18's rigorous evaluation discipline, directly tests
whether this lesson's finding applies to a specific product's specific
context, rather than assuming the general research result transfers
automatically.

## How this lesson sets up Lesson 3

Having established two genuinely distinct costs of excessive
choice — Hick's Law's decision-speed cost (Lesson 1) and the paradox
of choice's completion-rate and satisfaction cost (this lesson) —
Lesson 3 assembles both findings into concrete, implementable
choice-architecture patterns: specific techniques for forms, settings
pages, and menus that address both the speed problem and the
completion/satisfaction problem simultaneously.`,

    contentHi: `## Jam-tasting study Hick's Law se ek genuinely distinct finding kyun establish karti hai, sirf uska restatement nahi

Iyengar aur Lepper ki 2000 research ne paaya ki 24 jam varieties offer
karne wali ek table ne zyada initial interest attract kiya par ek
dramatically kam purchase rate produce ki us table se jo 6 varieties
offer karti thi — roughly 3% versus roughly 30%. Ye Hick's Law ke
reaction-time studies se ek fundamentally different measurement hai:
ye measure karne ke bajaye ki ek completed decision mein kitna time
laga, is research ne measure kiya ki kya ek decision bilkul complete
hui, aur separately, log apne complete kiye gaye decisions se kitne
satisfied the. Paradox of choice specifically in do outcomes ke baare
mein hai — completion rate aur satisfaction — jo conceptually aur
empirically raw decision speed se distinct hain.

## Effect specific, identifiable conditions ke under sabse strong kyun hai ek universal "kam options hamesha behtar" law hone ke bajaye

Paradox of choice effect sabse pronounced hai jab options numerous
AUR genuinely ek doosre se similar hote hain, careful comparison ko
dono necessary (kyunki options ek glance mein easily distinguished
nahi hain) aur exhausting (kyunki carefully compare karne ke liye kai
hain) feel karate hue. Ye further amplified hota hai jab decision
consequential ya reverse karna difficult feel karta hai, aur jab
chooser ke paas ek strong existing preference nahi hai jo unhe poori
comparison ke bina field ko quickly narrow karne de. Iska matlab hai
effect har choice scenario pe uniformly apply nahi hota — ek expert
user jiske paas clear, strong preferences hain familiar options ke
beech choose kar raha hai considerably kam susceptible hai ek novice
se jo kai unfamiliar, similar alternatives face kar raha hai ek aisi
decision ke liye jo high-stakes feel karti hai.

## "Zyada time laga par decide ho gaya" ko "kabhi decide hi nahi hua" se distinguish karna ek real product problem diagnose karne ke liye practically kyun matter karta hai

Ek team jo investigate kar rahi hai ki ek feature ya page kyun
underperform karta hai jaanna hoga ki wo in do genuinely different
problems mein se kaunsa face kar rahi hai: users jo measurably zyada
time lete hain decide karne mein par abhi bhi apni choice complete
karte hain (ek Hick's Law concern, grouping aur progressive disclosure
se address kiya gaya) versus users jo decision ko poori tarah abandon
kar dete hain kuch bhi choose kiye bina (ek paradox-of-choice concern,
curation aur defaults se address kiya gaya). Inhe different
interventions chahiye, aur unhe conflate karna galat fix apply karne
ka risk leta hai — Lesson 1 ki grouping techniques decision speed
address karti hain par necessarily ek abandonment problem fix nahi
karengi agar underlying issue genuinely similar options ki sheer
number ke baare mein hai jo chooser ke confidence ko overwhelm kar
rahi hai.

## Ye lesson ki finding directly testable kyun hai, Module 18 ke A/B testing discipline se connect karte hue

Kyunki paradox of choice ek specific, falsifiable prediction banata
hai — ki ek curated subset ek higher completion rate aur higher
reported satisfaction produce karega full option set se, is lesson ke
identify kiye specific conditions ke under — ek team ko finding ko
faith pe accept karne ki zaroorat nahi hai. Ek genuine A/B test jo ek
curated default aur full catalog ke beech completion rates aur
satisfaction compare karta hai, Module 18 ke rigorous evaluation
discipline follow karte hue, directly test karta hai ki kya ye lesson
ki finding ek specific product ke specific context pe apply hoti hai,
general research result automatically transfer hone ko assume karne
ke bajaye.

## Ye lesson Lesson 3 ko kaise set up karta hai

Excessive choice ke do genuinely distinct costs establish karne ke
baad — Hick's Law ka decision-speed cost (Lesson 1) aur paradox of
choice ka completion-rate aur satisfaction cost (ye lesson) — Lesson 3
dono findings ko concrete, implementable choice-architecture patterns
mein assemble karta hai: forms, settings pages, aur menus ke liye
specific techniques jo speed problem aur completion/satisfaction
problem dono ko simultaneously address karte hain.`,

    examples: [
      {
        title: 'A paradox-of-choice risk assessment applied to a real product decision, plus a curated-default component',
        titleHi: 'Ek paradox-of-choice risk assessment ek real product decision pe applied, plus ek curated-default component',
        codeJs: `function predictParadoxOfChoiceRisk(context) {
  const riskFactors = [
    context.numOptions > 15,
    context.optionsAreSimilarToEachOther,
    context.decisionFeelsConsequentialOrIrreversible,
    !context.userHasStrongExistingPreference,
  ];
  const riskScore = riskFactors.filter(Boolean).length;
  return {
    riskLevel: riskScore >= 3 ? 'high' : riskScore >= 2 ? 'moderate' : 'low',
    recommendation: riskScore >= 2
      ? 'Test a curated default view against the full option set'
      : 'Full option set likely fine as-is',
  };
}

// Applied to a real scenario: a health-insurance plan picker with 40
// similar plans, a genuinely consequential and hard-to-reverse choice
const planPickerRisk = predictParadoxOfChoiceRisk({
  numOptions: 40,
  optionsAreSimilarToEachOther: true,
  decisionFeelsConsequentialOrIrreversible: true,
  userHasStrongExistingPreference: false,
});
// { riskLevel: 'high', recommendation: 'Test a curated default view...' }

function CuratedPlanPicker({ allPlans, recommendedPlans }) {
  const [showAll, setShowAll] = useState(false);
  const plansToShow = showAll ? allPlans : recommendedPlans;
  return (
    <div>
      <h3>{showAll ? 'All available plans' : 'Recommended plans for you'}</h3>
      <PlanList plans={plansToShow} />
      {!showAll && <button onClick={() => setShowAll(true)}>See all {allPlans.length} plans</button>}
    </div>
  );
}`,
        codeTs: `interface ParadoxRiskContext {
  numOptions: number;
  optionsAreSimilarToEachOther: boolean;
  decisionFeelsConsequentialOrIrreversible: boolean;
  userHasStrongExistingPreference: boolean;
}

function predictParadoxOfChoiceRisk(context: ParadoxRiskContext) {
  const riskFactors = [
    context.numOptions > 15,
    context.optionsAreSimilarToEachOther,
    context.decisionFeelsConsequentialOrIrreversible,
    !context.userHasStrongExistingPreference,
  ];
  const riskScore = riskFactors.filter(Boolean).length;
  return {
    riskLevel: riskScore >= 3 ? 'high' : riskScore >= 2 ? 'moderate' : 'low',
    recommendation: riskScore >= 2
      ? 'Test a curated default view against the full option set'
      : 'Full option set likely fine as-is',
  };
}

// Applied to a real scenario: a health-insurance plan picker with 40
// similar plans, a genuinely consequential and hard-to-reverse choice
const planPickerRisk = predictParadoxOfChoiceRisk({
  numOptions: 40,
  optionsAreSimilarToEachOther: true,
  decisionFeelsConsequentialOrIrreversible: true,
  userHasStrongExistingPreference: false,
});
// { riskLevel: 'high', recommendation: 'Test a curated default view...' }

interface Plan {
  id: string;
  name: string;
}

function CuratedPlanPicker({ allPlans, recommendedPlans }: { allPlans: Plan[]; recommendedPlans: Plan[] }) {
  const [showAll, setShowAll] = useState(false);
  const plansToShow = showAll ? allPlans : recommendedPlans;
  return (
    <div>
      <h3>{showAll ? 'All available plans' : 'Recommended plans for you'}</h3>
      <PlanList plans={plansToShow} />
      {!showAll && <button onClick={() => setShowAll(true)}>See all {allPlans.length} plans</button>}
    </div>
  );
}`,
        code: `const riskScore = riskFactors.filter(Boolean).length;
// scores a specific decision context against the lesson's four
// identified risk conditions, rather than applying a blanket rule`,
        output:
          "The 40-plan health-insurance scenario scores 'high' risk on all four factors, triggering a recommendation to test a curated default against the full list — while a hypothetical low-risk scenario (5 clearly different options, low stakes, strong user preference) would correctly recommend leaving the full option set as-is.",
        explain:
          "This example operationalizes the lesson's key nuance directly: rather than applying a blanket 'reduce all options' rule, the risk function checks for the specific conditions research shows amplify the paradox of choice, producing a targeted recommendation only where the effect is actually likely to apply.",
        explainHi:
          "Ye example lesson ke key nuance ko directly operationalize karta hai: ek blanket 'sab options kam karo' rule apply karne ke bajaye, risk function un specific conditions ko check karta hai jinhe research paradox of choice ko amplify karte hue dikhati hai, ek targeted recommendation produce karte hue sirf wahan jahan effect actually apply hone ki likelihood hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Reducing options everywhere in the product, regardless of whether
// the specific context actually shows paradox-of-choice risk factors
function applyChoiceReductionEverywhereWrong(allFeatures) {
  // Blanket rule: "fewer options are always better" — applied even to
  // a simple, low-stakes settings toggle with only 3 already-distinct
  // options, where there's no actual research-backed reason to expect
  // this specific effect
  return allFeatures.map((feature) => limitToTopNOptions(feature, 3));
}`,
        right: `// Applying choice-reduction techniques specifically where the
// identified risk factors are actually present
function applyChoiceReductionTargetedRight(allFeatures) {
  return allFeatures.map((feature) => {
    const risk = predictParadoxOfChoiceRisk(feature.context);
    if (risk.riskLevel === 'high' || risk.riskLevel === 'moderate') {
      return { ...feature, recommendation: 'curate_default_view' };
    }
    return { ...feature, recommendation: 'no_change_needed' };
  });
}`,
        why: "Applying choice-reduction techniques uniformly, regardless of whether a specific decision context actually exhibits the conditions (numerous, similar options, high stakes, weak existing preference) that amplify the paradox of choice, risks unnecessarily degrading a feature where full options were never actually causing a completion or satisfaction problem.",
        whyHi:
          "Choice-reduction techniques ko uniformly apply karna, is baat se independently ki kya ek specific decision context actually un conditions ko exhibit karta hai (numerous, similar options, high stakes, weak existing preference) jo paradox of choice ko amplify karte hain, ek feature ko unnecessarily degrade karne ka risk leta hai jahan full options actually kabhi ek completion ya satisfaction problem cause nahi kar rahe the.",
      },
    ],

    realWorld: [
      {
        en: "A production streaming service's content browse page, showing all available titles in a genre with no curation, was A/B tested against a curated 'top picks' default with a full-catalog option still available — the curated default measurably increased both selection completion rate and post-selection satisfaction scores, directly replicating the jam-tasting study's pattern on a real product surface.",
        hi: 'Ek production streaming service ka content browse page, ek genre mein sab available titles dikhate hue koi curation ke bina, ek curated \'top picks\' default ke against A/B tested kiya gaya poore-catalog option ke saath abhi bhi available hote hue — curated default ne measurably selection completion rate aur post-selection satisfaction scores dono ko increase kiya, directly jam-tasting study ke pattern ko ek real product surface pe replicate karte hue.',
      },
    ],

    interviewQA: [
      {
        q: 'What did the Iyengar and Lepper jam-tasting study find, and why is this a genuinely different finding from Hick\'s Law?',
        qHi: 'Iyengar aur Lepper ki jam-tasting study ne kya paaya, aur ye Hick\'s Law se genuinely different finding kyun hai?',
        a: "The study found that a 24-jam-variety table attracted more browsers but produced a dramatically lower purchase completion rate (roughly 3%) than a 6-variety table (roughly 30%). This differs from Hick's Law because it measures completion rate and satisfaction, not decision speed — Hick's Law describes how long a completed decision takes, while this finding describes whether a decision gets completed at all and how satisfied people are with it.",
        aHi: 'Study ne paaya ki ek 24-jam-variety table ne zyada browsers attract kiye par ek dramatically kam purchase completion rate produce ki (roughly 3%) ek 6-variety table se (roughly 30%). Ye Hick\'s Law se differ karta hai kyunki ye completion rate aur satisfaction measure karta hai, decision speed nahi — Hick\'s Law describe karta hai ki ek completed decision mein kitna time lagta hai, jabki ye finding describe karta hai ki kya ek decision bilkul complete hoti hai aur log usse kitne satisfied hain.',
      },
      {
        q: "Under what specific conditions is the paradox of choice effect strongest, and why does this matter for applying the finding correctly?",
        qHi: 'Paradox of choice effect kaunse specific conditions ke under sabse strong hai, aur ye finding ko correctly apply karne ke liye kyun matter karta hai?',
        a: "The effect is strongest when options are numerous and genuinely similar, the decision feels consequential or hard to reverse, and the chooser lacks a strong existing preference. This matters because it means the finding shouldn't be applied as a blanket 'always reduce options' rule — a choice among few, clearly distinct options, or one made routinely by an expert with clear preferences, is much less susceptible, and unnecessary curation there could remove genuinely useful choice without any real benefit.",
        aHi: 'Effect sabse strong hai jab options numerous aur genuinely similar hain, decision consequential ya reverse karna hard feel karta hai, aur chooser ke paas strong existing preference nahi hai. Ye matter karta hai kyunki iska matlab hai finding ko ek blanket "hamesha options kam karo" rule ki tarah apply nahi karna chahiye — kuch, clearly distinct options ke beech ek choice, ya ek jo routinely ek expert dwara clear preferences ke saath banayi jaati hai, kaafi kam susceptible hai, aur wahan unnecessary curation genuinely useful choice ko koi real benefit ke bina remove kar sakti hai.',
      },
    ],

    exercises: [
      {
        task: "A team is deciding whether to curate a dropdown of 8 clearly-named, easily-distinguished shipping speed options (e.g., 'Standard,' 'Express,' 'Overnight') down to a smaller default set. Using this lesson's risk-assessment factors, evaluate whether this scenario is a strong candidate for the paradox of choice, and explain your reasoning against each of the four risk factors.",
        taskHi: 'Ek team decide kar rahi hai ki kya ek dropdown ko 8 clearly-named, easily-distinguished shipping speed options ka (jaise, \'Standard,\' \'Express,\' \'Overnight\') ek smaller default set tak curate karna hai. Is lesson ke risk-assessment factors use karke, evaluate karo ki kya ye scenario paradox of choice ke liye ek strong candidate hai, aur apna reasoning chaaron risk factors ke against explain karo.',
        hint: "Walk through each of the four risk factors (option count, similarity, stakes/reversibility, existing preference strength) against this specific scenario's actual characteristics, rather than assuming curation is automatically beneficial.",
        hintHi: 'Chaaron risk factors (option count, similarity, stakes/reversibility, existing preference strength) mein se har ek ko is specific scenario ki actual characteristics ke against walk through karo, curation ko automatically beneficial assume karne ke bajaye.',
      },
    ],

    keyTakeaways: [
      "The paradox of choice (Iyengar & Lepper, 2000) shows that beyond a certain point, more options reduce decision completion rate and satisfaction — a finding genuinely distinct from Hick's Law's decision-speed concern.",
      "The effect is strongest when options are numerous AND similar, the decision feels consequential or irreversible, and the chooser lacks a strong existing preference — not a universal rule for every choice scenario.",
      "Distinguishing 'took longer but got decided' (Hick's Law) from 'never got decided' or 'decided but less satisfied' (paradox of choice) matters for correctly diagnosing and fixing a real product problem.",
      "The finding is directly, rigorously testable via A/B testing (Module 18), rather than something to accept on faith or apply as a blanket rule.",
    ],
    keyTakeawaysHi: [
      "Paradox of choice (Iyengar & Lepper, 2000) dikhata hai ki ek certain point ke aage, zyada options decision completion rate aur satisfaction ko kam karte hain — ek finding jo Hick's Law ke decision-speed concern se genuinely distinct hai.",
      'Effect sabse strong hai jab options numerous AUR similar hain, decision consequential ya irreversible feel karta hai, aur chooser ke paas strong existing preference nahi hai — har choice scenario ke liye ek universal rule nahi.',
      "'Zyada time laga par decide ho gaya' (Hick's Law) ko 'kabhi decide hi nahi hua' ya 'decide hua par less satisfied' (paradox of choice) se distinguish karna ek real product problem ko correctly diagnose aur fix karne ke liye matter karta hai.",
      'Finding directly, rigorously testable hai A/B testing (Module 18) ke through, faith pe accept karne ya ek blanket rule ki tarah apply karne ke bajaye.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'psych-choice-architecture-patterns',
    title: 'Choice-Architecture Patterns for Forms, Settings & Menus',
    titleHi: 'Forms, Settings & Menus Ke Liye Choice-Architecture Patterns',
    description:
      "Closing this module: concrete, implementable design patterns that directly apply Hick's Law and the paradox of choice — progressive disclosure, sensible defaults, and curated views — to real forms, settings pages, and menus.",
    descriptionHi:
      'Is module ko close karte hue: concrete, implementable design patterns jo directly Hick\'s Law aur paradox of choice ko apply karte hain — progressive disclosure, sensible defaults, aur curated views — real forms, settings pages, aur menus pe.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A well-designed hospital triage system that handles the vast majority of patients through a small set of clear, well-signposted pathways, while still keeping a genuine path open to a specialist for the rare patient whose situation doesn't fit any standard pathway.** A hospital emergency department that forced every single patient through the exact same, fully general intake process — regardless of whether they had a broken finger or a heart attack — would be simultaneously slow for routine cases and dangerously undifferentiated for urgent ones. A well-designed triage system instead sorts patients quickly into a small number of well-defined categories, each with its own clear, appropriate pathway, while still preserving a genuine escalation path to a specialist or a fuller workup for the rare patient whose situation doesn't fit any of the standard categories cleanly. This is exactly the shape a well-designed choice-architecture pattern takes: a small number of sensible, clearly-labeled default paths that handle the large majority of cases quickly and with reduced cognitive burden (directly addressing both Hick's Law's speed concern and the paradox of choice's completion/satisfaction concern), combined with a genuinely accessible, not hidden or crippled, path to the full range of options for the real minority of cases that need it — never forcing every single case through the fully general, maximally-optioned path by default.",
      hi: 'ek well-designed hospital triage system jo majority patients ko ek small set of clear, well-signposted pathways ke through handle karta hai, jabki abhi bhi ek genuine path open rakhta hai ek specialist ke liye us rare patient ke liye jiski situation kisi bhi standard pathway ko fit nahi karti. Ek hospital emergency department jo har single patient ko exact wahi, fully general intake process ke through force karta — chahe unki broken finger ho ya heart attack — simultaneously routine cases ke liye slow aur urgent ones ke liye dangerously undifferentiated hoga. Ek well-designed triage system iske bajaye patients ko jaldi ek small number of well-defined categories mein sort karta hai, har ek apna khud ka clear, appropriate pathway rakhته hue, jabki abhi bhi ek genuine escalation path preserve karte hue ek specialist ya ek fuller workup tak us rare patient ke liye jiski situation koi bhi standard categories cleanly fit nahi karti. Ye exactly wo shape hai jo ek well-designed choice-architecture pattern leta hai: sensible, clearly-labeled default paths ki ek small number jo majority cases ko jaldi aur reduced cognitive burden ke saath handle karte hain (directly Hick\'s Law ke speed concern aur paradox of choice ke completion/satisfaction concern dono ko address karte hue), poore range of options tak ek genuinely accessible, hidden ya crippled nahi, path ke saath combined un real minority of cases ke liye jinhe iski zaroorat hai — kabhi default se har single case ko fully general, maximally-optioned path ke through force nahi karte.',
    },

    simple: `**The three concrete, implementable patterns this lesson assembles
from Lessons 1 and 2's findings:**

\`\`\`
1. PROGRESSIVE DISCLOSURE — breaking one large decision into a
   sequence of smaller ones (Lesson 1's Hick's Law: reduces N at each
   individual step).

2. SENSIBLE DEFAULTS — pre-selecting the option most users would
   actually want, while keeping other options genuinely, easily
   accessible (reduces BOTH the effective decision Hick's Law
   measures AND the paradox-of-choice risk Lesson 2 covers, for the
   majority of users who accept the default).

3. CURATED VIEWS — showing a smaller, well-chosen subset by default,
   with an easy, unhidden path to the full option set (directly
   addresses Lesson 2's completion-rate and satisfaction findings).
\`\`\`

**Pattern 1 in a concrete form-design context — progressive
disclosure applied to a complex signup form:**

\`\`\`tsx
function ProgressiveSignupForm() {
  const [step, setStep] = useState(1);
  // Instead of one form with 15 fields visible at once (high N per
  // Hick's Law), break it into 3 steps of ~5 fields each
  return (
    <div>
      {step === 1 && <BasicInfoStep onNext={() => setStep(2)} />}
      {step === 2 && <PreferencesStep onNext={() => setStep(3)} />}
      {step === 3 && <ConfirmationStep />}
      <ProgressIndicator current={step} total={3} />
    </div>
  );
}
\`\`\`

**Pattern 2 in a concrete settings context — a sensible default with
genuinely accessible alternatives, not a buried or crippled "advanced"
option:**

\`\`\`tsx
function NotificationFrequencySettings({ currentSetting, onSave }) {
  // A sensible default ("Daily digest") pre-selected for most users,
  // with the full range of options genuinely, easily available —
  // not hidden behind multiple clicks or a confusing label
  return (
    <div>
      <RadioOption value="daily_digest" defaultChecked label="Daily digest (recommended)" />
      <RadioOption value="realtime" label="Real-time notifications" />
      <RadioOption value="weekly" label="Weekly summary" />
      <RadioOption value="off" label="Turn off notifications" />
      {/* All options are equally visible and one click away —
          "sensible default" does not mean "hidden alternatives" */}
    </div>
  );
}
\`\`\`

**Pattern 3 in a concrete product-browsing context — a curated view
with a genuinely accessible, not hidden, path to everything:**

\`\`\`tsx
function CuratedCategoryView({ allProducts, curatedSubset }) {
  const [viewMode, setViewMode] = useState('curated');
  return (
    <div>
      <ToggleButtons
        options={[
          { value: 'curated', label: 'Recommended' },
          { value: 'all', label: \`All \${allProducts.length} results\` },
        ]}
        value={viewMode}
        onChange={setViewMode}
      />
      <ProductGrid products={viewMode === 'curated' ? curatedSubset : allProducts} />
    </div>
  );
}
\`\`\`

**A critical, non-negotiable constraint on ALL three patterns — the
line that separates legitimate choice architecture from manipulation,
directly connecting to this course's later coverage of dark patterns:**

\`\`\`ts
function isChoiceArchitectureLegitimate(pattern) {
  return (
    pattern.alternativesAreGenuinelyAccessible && // not hidden, not
    // requiring excessive clicks or confusing navigation to find
    pattern.defaultServesUserInterest && // not chosen to benefit the
    // business at the user's expense (revisited directly in Module 9)
    !pattern.usesConfusingOrMisleadingLabels
  );
  // A "curated view" that hides 90% of options behind a deliberately
  // obscure link, or a "default" that's actually the most profitable
  // option rather than the most useful one, fails this test —
  // choice architecture done well REDUCES burden; done badly, it
  // manipulates
}
\`\`\`

**Why these three patterns work together rather than being
alternatives to choose between:**

\`\`\`
A well-designed complex settings page often uses ALL three
simultaneously: progressive disclosure to organize categories,
sensible defaults within each category so most users never need to
open it at all, and a curated "most common settings" view up front
with genuine access to the full, categorized settings underneath for
users who want it. The three patterns address complementary aspects
of the same underlying problem (decision speed and completion/
satisfaction), not competing solutions to choose between.
\`\`\`

**How this lesson closes Module 6:** Lesson 1 established the precise,
quantified relationship between option count and decision speed.
Lesson 2 established the related but distinct completion-rate and
satisfaction cost of excessive similar options. This lesson closes the
module by turning both findings into concrete, implementable patterns
— with an explicit, checkable constraint ensuring these patterns
genuinely serve the user's decision-making rather than covertly
constraining it, a distinction this course returns to directly when
covering dark patterns in Module 9.`,

    simpleHi: `**Teen concrete, implementable patterns jise ye lesson Lessons 1 aur
2 ki findings se assemble karta hai:**

\`\`\`
1. PROGRESSIVE DISCLOSURE — ek bade decision ko smaller ones ki ek
   sequence mein todna (Lesson 1 ka Hick's Law: har individual step
   pe N kam karta hai).

2. SENSIBLE DEFAULTS — us option ko pre-select karna jo zyada tar
   users actually chahte, jabki doosre options ko genuinely, easily
   accessible rakhte hue (Hick's Law jo effective decision measure
   karta hai AUR paradox-of-choice risk jise Lesson 2 cover karta hai
   dono ko kam karta hai, majority users ke liye jo default accept
   karte hain).

3. CURATED VIEWS — default se ek smaller, well-chosen subset dikhate
   hue, full option set tak ek easy, unhidden path ke saath (directly
   Lesson 2 ki completion-rate aur satisfaction findings ko address
   karta hai).
\`\`\`

**Pattern 1 ek concrete form-design context mein — progressive
disclosure ek complex signup form pe applied:**

\`\`\`tsx
function ProgressiveSignupForm() {
  const [step, setStep] = useState(1);
  // Ek form ke bajaye 15 fields ke saath ek saath visible (high N
  // Hick's Law ke hisaab se), ise 3 steps mein todo ~5 fields each
  return (
    <div>
      {step === 1 && <BasicInfoStep onNext={() => setStep(2)} />}
      {step === 2 && <PreferencesStep onNext={() => setStep(3)} />}
      {step === 3 && <ConfirmationStep />}
      <ProgressIndicator current={step} total={3} />
    </div>
  );
}
\`\`\`

**Pattern 2 ek concrete settings context mein — ek sensible default
genuinely accessible alternatives ke saath, ek buried ya crippled
"advanced" option nahi:**

\`\`\`tsx
function NotificationFrequencySettings({ currentSetting, onSave }) {
  // Ek sensible default ("Daily digest") zyada tar users ke liye
  // pre-selected, poore range of options ke saath genuinely, easily
  // available — multiple clicks ya ek confusing label ke peeche
  // hidden nahi
  return (
    <div>
      <RadioOption value="daily_digest" defaultChecked label="Daily digest (recommended)" />
      <RadioOption value="realtime" label="Real-time notifications" />
      <RadioOption value="weekly" label="Weekly summary" />
      <RadioOption value="off" label="Turn off notifications" />
      {/* Sab options equally visible hain aur ek click door hain —
          "sensible default" ka matlab "hidden alternatives" nahi hai */}
    </div>
  );
}
\`\`\`

**Pattern 3 ek concrete product-browsing context mein — ek curated
view sab kuch tak ek genuinely accessible, hidden nahi, path ke saath:**

\`\`\`tsx
function CuratedCategoryView({ allProducts, curatedSubset }) {
  const [viewMode, setViewMode] = useState('curated');
  return (
    <div>
      <ToggleButtons
        options={[
          { value: 'curated', label: 'Recommended' },
          { value: 'all', label: \`All \${allProducts.length} results\` },
        ]}
        value={viewMode}
        onChange={setViewMode}
      />
      <ProductGrid products={viewMode === 'curated' ? curatedSubset : allProducts} />
    </div>
  );
}
\`\`\`

**Sab teen patterns pe ek critical, non-negotiable constraint — wo
line jo legitimate choice architecture ko manipulation se separate
karti hai, directly is course ke baad ke dark patterns coverage se
connect karte hue:**

\`\`\`ts
function isChoiceArchitectureLegitimate(pattern) {
  return (
    pattern.alternativesAreGenuinelyAccessible && // hidden nahi, excessive
    // clicks ya confusing navigation maangte nahi dhundhne ke liye
    pattern.defaultServesUserInterest && // business ko user ke expense
    // pe benefit karne ke liye choose nahi kiya gaya (directly Module 9
    // mein revisit kiya gaya)
    !pattern.usesConfusingOrMisleadingLabels
  );
  // Ek "curated view" jo 90% options ko ek deliberately obscure link
  // ke peeche chhupata hai, ya ek "default" jo actually sabse
  // profitable option hai sabse useful ke bajaye, is test mein fail
  // hota hai — choice architecture achhi tarike se kiya gaya BURDEN
  // KAM karta hai; badly kiya gaya, ye manipulate karta hai
}
\`\`\`

**Ye teen patterns saath kyun kaam karte hain, unke beech choose
karne ke alternatives hone ke bajaye:**

\`\`\`
Ek well-designed complex settings page aksar SAB TEEN ko simultaneously
use karta hai: categories organize karne ke liye progressive
disclosure, har category ke andar sensible defaults taaki zyada tar
users ko ise bilkul open karne ki zaroorat na pade, aur ek curated
"most common settings" view upfront full, categorized settings tak
genuine access ke saath uske neeche un users ke liye jo ise chahte
hain. Teenon patterns wahi underlying problem ke complementary
aspects address karte hain (decision speed aur completion/satisfaction),
competing solutions nahi jinke beech choose karna hai.
\`\`\`

**Ye lesson Module 6 ko kaise close karta hai:** Lesson 1 ne option
count aur decision speed ke beech precise, quantified relationship
establish kiya. Lesson 2 ne excessive similar options ka related par
distinct completion-rate aur satisfaction cost establish kiya. Ye
lesson dono findings ko concrete, implementable patterns mein badalte
hue module ko close karta hai — ek explicit, checkable constraint ke
saath ensure karte hue ki ye patterns genuinely user ke decision-making
ko serve karte hain covertly ise constrain karne ke bajaye, ek
distinction jispe ye course directly return karta hai jab Module 9
mein dark patterns cover kiya jaata hai.`,

    content: `## Why progressive disclosure, sensible defaults, and curated
views are complementary applications of the same two findings, not
three independent techniques

Each of these three patterns directly addresses the mechanisms Lessons
1 and 2 established: progressive disclosure reduces the N in Hick's
Law's formula at each individual decision step; sensible defaults let
the majority of users bypass an explicit decision entirely, avoiding
both the speed cost and the completion/satisfaction risk for anyone
content with a well-chosen default; curated views directly target the
paradox of choice's completion-rate and satisfaction findings by
reducing the effective option count most users actually consider. A
well-designed complex interface typically layers all three together,
since they address complementary aspects of the same underlying
cognitive constraints rather than being mutually exclusive design
choices.

## Why "genuinely accessible alternatives" is the specific, checkable
requirement that separates legitimate choice architecture from
manipulation

The critical, non-negotiable constraint this lesson establishes is
that reducing the options a user must actively consider is legitimate
only when the full range of options remains genuinely, easily
accessible for anyone who wants it — a curated view with a clearly
visible path to "see everything," a sensible default with clearly
visible, one-click alternatives, progressive disclosure with clear
navigation back to skipped steps. The moment an alternative becomes
hidden, buried behind confusing navigation, or effectively unusable,
the pattern has crossed from genuinely reducing cognitive burden into
covertly constraining choice — a distinction this course examines in
much greater depth in Module 9's treatment of dark patterns, but one
that must be established as a firm boundary here, at the point these
patterns are first introduced as implementable techniques.

## Why "the default serves user interest" is an equally important,
separate check from "alternatives are accessible"

A pattern can technically keep alternatives accessible while still
choosing a default that serves the product's business interest rather
than the typical user's actual interest — for instance, defaulting a
user into a more expensive subscription tier or into sharing more data
than most users would actually want, while technically leaving cheaper
or more private options visible and one click away. This is why this
lesson's legitimacy check requires both conditions independently:
accessible alternatives alone don't make a default legitimate if the
default itself was chosen to benefit the business at the typical
user's expense rather than to genuinely represent what most users
would actually want if asked.

## How this lesson closes Module 6

This lesson doesn't introduce new psychological findings — its role is
translating Lesson 1's Hick's Law and Lesson 2's paradox of choice into
concrete, implementable interface patterns, while establishing the
critical, non-negotiable boundary that keeps these patterns genuinely
serving users rather than covertly manipulating them. This boundary is
the direct bridge to Module 9's deeper treatment of persuasion versus
manipulation and dark patterns — the same mechanisms this lesson
establishes as legitimate, applied without the accessibility and
user-interest constraints this lesson insists on, are exactly what
Module 9 examines as crossing into manipulation.`,

    contentHi: `## Progressive disclosure, sensible defaults, aur curated views wahi do findings ke complementary applications kyun hain, teen independent techniques nahi

In teen patterns mein se har ek directly un mechanisms ko address
karta hai jise Lessons 1 aur 2 ne establish kiya: progressive
disclosure Hick's Law ke formula mein N ko har individual decision
step pe kam karta hai; sensible defaults majority users ko ek explicit
decision poori tarah bypass karne dete hain, dono speed cost aur
completion/satisfaction risk avoid karte hue kisi ke liye jo ek
well-chosen default se content hai; curated views directly paradox of
choice ki completion-rate aur satisfaction findings ko target karte
hain effective option count kam karke jo zyada tar users actually
consider karte hain. Ek well-designed complex interface typically sab
teen ko saath layer karta hai, kyunki wo wahi underlying cognitive
constraints ke complementary aspects address karte hain mutually
exclusive design choices hone ke bajaye.

## "Genuinely accessible alternatives" specific, checkable requirement kyun hai jo legitimate choice architecture ko manipulation se separate karta hai

Critical, non-negotiable constraint jise ye lesson establish karta hai
ye hai ki ek user ko actively consider karne chahiye options ko kam
karna sirf tab legitimate hai jab full range of options genuinely,
easily accessible rahe kisi ke liye bhi jo ise chahta hai — ek curated
view "sab kuch dekho" tak ek clearly visible path ke saath, ek
sensible default clearly visible, one-click alternatives ke saath,
progressive disclosure skipped steps tak clear navigation ke saath. Us
moment jab ek alternative hidden ban jaata hai, confusing navigation
ke peeche buried, ya effectively unusable, pattern genuinely cognitive
burden kam karne se covertly choice ko constrain karne tak cross ho
gaya hai — ek distinction jise ye course Module 9 ke dark patterns ke
treatment mein kaafi zyada depth mein examine karta hai, par ek jise
yahan ek firm boundary ki tarah establish kiya jaana chahiye, us point
pe jahan ye patterns pehli baar implementable techniques ki tarah
introduce kiye jaate hain.

## "Default user interest serve karta hai" "alternatives accessible hain" se ek equally important, separate check kyun hai

Ek pattern technically alternatives ko accessible rakh sakta hai
jabki abhi bhi ek default choose karta hai jo product ke business
interest ko serve karta hai typical user ke actual interest ke bajaye
— for instance, ek user ko ek zyada expensive subscription tier mein
ya zyada data share karne mein default karna us se jo zyada tar users
actually chahenge, jabki technically cheaper ya zyada private options
ko visible aur ek click door chhodte hue. Yahi wajah hai is lesson ka
legitimacy check dono conditions ko independently maangta hai:
accessible alternatives akele ek default ko legitimate nahi banate
agar default khud ko business ko benefit karne ke liye choose kiya
gaya tha typical user ke expense pe genuinely represent karne ke
bajaye ki zyada tar users kya actually chahenge agar pucha jaaye.

## Ye lesson Module 6 ko kaise close karta hai

Ye lesson naye psychological findings introduce nahi karta — iska role
Lesson 1 ke Hick's Law aur Lesson 2 ke paradox of choice ko concrete,
implementable interface patterns mein translate karna hai, jabki
critical, non-negotiable boundary establish karte hue jo in patterns
ko genuinely users ko serve karte rehne deti hai covertly unhe
manipulate karne ke bajaye. Ye boundary Module 9 ke persuasion versus
manipulation aur dark patterns ke deeper treatment ka direct bridge
hai — wahi mechanisms jise ye lesson legitimate ki tarah establish
karta hai, accessibility aur user-interest constraints ke bina applied
jinpe ye lesson insist karta hai, exactly wo hain jise Module 9
manipulation mein cross karte hue examine karta hai.`,

    examples: [
      {
        title: 'A complete settings page combining all three choice-architecture patterns with a legitimacy check',
        titleHi: 'Ek complete settings page teenon choice-architecture patterns ko ek legitimacy check ke saath combine karte hue',
        codeJs: `function isChoiceArchitectureLegitimate(pattern) {
  return (
    pattern.alternativesAreGenuinelyAccessible &&
    pattern.defaultServesUserInterest &&
    !pattern.usesConfusingOrMisleadingLabels
  );
}

function PrivacySettingsPage({ categories, currentSettings }) {
  const [activeCategory, setActiveCategory] = useState(null); // Progressive disclosure
  const [showAdvanced, setShowAdvanced] = useState(false); // Curated view

  const commonSettings = categories.flatMap((c) => c.settings).filter((s) => s.isCommonlyChanged);

  if (!activeCategory) {
    return (
      <div>
        <h2>Privacy Settings</h2>
        {/* Curated view: most commonly changed settings shown first */}
        <SettingsList settings={commonSettings} />
        <button onClick={() => setShowAdvanced(true)}>
          {/* Genuinely accessible — one click, clearly labeled, not hidden */}
          Show all privacy settings by category
        </button>
        {showAdvanced && (
          <ul>
            {categories.map((cat) => (
              <li key={cat.id} onClick={() => setActiveCategory(cat.id)}>{cat.name}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  const category = categories.find((c) => c.id === activeCategory);
  return (
    <div>
      <button onClick={() => setActiveCategory(null)}>Back</button>
      {/* Sensible defaults within each setting — pre-selected to what
          most users would actually want, alternatives clearly visible */}
      <SettingsList settings={category.settings} showDefaults />
    </div>
  );
}`,
        codeTs: `interface ChoiceArchitecturePattern {
  alternativesAreGenuinelyAccessible: boolean;
  defaultServesUserInterest: boolean;
  usesConfusingOrMisleadingLabels: boolean;
}

function isChoiceArchitectureLegitimate(pattern: ChoiceArchitecturePattern): boolean {
  return (
    pattern.alternativesAreGenuinelyAccessible &&
    pattern.defaultServesUserInterest &&
    !pattern.usesConfusingOrMisleadingLabels
  );
}

interface Setting {
  id: string;
  name: string;
  isCommonlyChanged: boolean;
}

interface Category {
  id: string;
  name: string;
  settings: Setting[];
}

function PrivacySettingsPage({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null); // Progressive disclosure
  const [showAdvanced, setShowAdvanced] = useState(false); // Curated view

  const commonSettings = categories.flatMap((c) => c.settings).filter((s) => s.isCommonlyChanged);

  if (!activeCategory) {
    return (
      <div>
        <h2>Privacy Settings</h2>
        {/* Curated view: most commonly changed settings shown first */}
        <SettingsList settings={commonSettings} />
        <button onClick={() => setShowAdvanced(true)}>
          {/* Genuinely accessible — one click, clearly labeled, not hidden */}
          Show all privacy settings by category
        </button>
        {showAdvanced && (
          <ul>
            {categories.map((cat) => (
              <li key={cat.id} onClick={() => setActiveCategory(cat.id)}>{cat.name}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  const category = categories.find((c) => c.id === activeCategory)!;
  return (
    <div>
      <button onClick={() => setActiveCategory(null)}>Back</button>
      {/* Sensible defaults within each setting — pre-selected to what
          most users would actually want, alternatives clearly visible */}
      <SettingsList settings={category.settings} showDefaults />
    </div>
  );
}`,
        code: `// All three patterns layered: curated common-settings view (top),
// progressive disclosure into categories (on demand), sensible
// defaults within each category's individual settings`,
        output:
          "A user managing privacy settings sees the most commonly changed options immediately, without navigating any category structure. A user who needs a less common setting can access the full categorized list in one click, then drill into a specific category — at every level, defaults are pre-selected sensibly and alternatives remain clearly visible and easily reachable.",
        explain:
          "This example demonstrates all three patterns working together on one real interface, exactly as the lesson describes — the legitimacy check function makes explicit and verifiable the constraint (genuine accessibility, user-serving defaults, honest labeling) that keeps this combination in the category of helpful choice architecture rather than manipulation.",
        explainHi:
          "Ye example teenon patterns ko ek real interface pe saath kaam karte hue demonstrate karta hai, exactly jaise lesson describe karta hai — legitimacy check function us constraint ko explicit aur verifiable banata hai (genuine accessibility, user-serving defaults, honest labeling) jo is combination ko helpful choice architecture ki category mein rakhta hai manipulation ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// A "curated view" that technically has an "all options" link, but
// buries it in a way that fails the genuine-accessibility check
function FakeCuratedViewWrong({ allProducts, curatedSubset }) {
  return (
    <div>
      <ProductGrid products={curatedSubset} />
      {/* Buried at the bottom of a long page, in small gray text,
          with a vague label — technically present, not genuinely
          accessible */}
      <footer style={{ fontSize: '10px', color: '#ccc' }}>
        <a href="/all-products-legacy-view">other options</a>
      </footer>
    </div>
  );
}`,
        right: `// A genuinely accessible alternative — clearly labeled, prominently
// placed, one click away
function GenuineCuratedViewRight({ allProducts, curatedSubset }) {
  return (
    <div>
      <ProductGrid products={curatedSubset} />
      <button className="prominent-cta" onClick={() => navigateToAllResults()}>
        See all {allProducts.length} results
      </button>
    </div>
  );
}`,
        why: "A link that's technically present but visually buried, vaguely labeled, or hard to find fails this lesson's genuine-accessibility requirement — this is precisely the pattern that crosses from legitimate curation (reducing burden while preserving real access) into manipulation (appearing to preserve choice while effectively removing it), the exact line Module 9 examines in depth.",
        whyHi:
          "Ek link jo technically present hai par visually buried hai, vaguely labeled hai, ya dhundhna mushkil hai is lesson ke genuine-accessibility requirement mein fail hota hai — ye exactly wo pattern hai jo legitimate curation se (burden kam karte hue real access preserve karte hue) manipulation mein cross karta hai (choice preserve karta hua appear karte hue jabki effectively ise remove karte hue), exact line jise Module 9 depth mein examine karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production SaaS product's settings redesign initially received internal pushback for using a curated 'common settings' default view, until the team demonstrated that the full settings list remained one prominent, clearly-labeled click away and ran an A/B test showing both faster task completion and unchanged (not reduced) usage of the advanced settings by users who genuinely needed them.",
        hi: 'Ek production SaaS product ki settings redesign ko initially internal pushback mila ek curated \'common settings\' default view use karne ke liye, jab tak team ne demonstrate nahi kiya ki full settings list ek prominent, clearly-labeled click door reheti hai aur ek A/B test run kiya jo dono faster task completion aur unchanged (kam nahi) usage of advanced settings dikhaya un users dwara jinhe genuinely unki zaroorat thi.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the specific, checkable constraint that separates legitimate choice architecture from a dark pattern?',
        qHi: 'Wo specific, checkable constraint kya hai jo legitimate choice architecture ko ek dark pattern se separate karta hai?',
        a: "Genuine accessibility of alternatives (not hidden, not buried behind excessive clicks or confusing navigation) combined with a default that serves the typical user's actual interest rather than the business's interest at the user's expense, without confusing or misleading labels. A pattern that technically keeps alternatives present but makes them hard to find, or chooses a default that benefits the business over the user, has crossed from legitimate choice architecture into manipulation.",
        aHi: 'Alternatives ki genuine accessibility (hidden nahi, excessive clicks ya confusing navigation ke peeche buried nahi) ek default ke saath combined jo typical user ke actual interest ko serve karta hai business ke interest ko user ke expense pe serve karne ke bajaye, confusing ya misleading labels ke bina. Ek pattern jo technically alternatives ko present rakhta hai par unhe dhundhna mushkil banata hai, ya ek default choose karta hai jo user pe business ko benefit karta hai, legitimate choice architecture se manipulation mein cross ho chuka hai.',
      },
      {
        q: "Why do progressive disclosure, sensible defaults, and curated views work together rather than being alternatives to choose between?",
        qHi: 'Progressive disclosure, sensible defaults, aur curated views saath kyun kaam karte hain unke beech choose karne ke alternatives hone ke bajaye?',
        a: "Each addresses a complementary aspect of the same underlying constraints: progressive disclosure reduces N at each step (Hick's Law), sensible defaults let most users bypass an explicit decision entirely, and curated views reduce the effective option count most users actually consider (paradox of choice). A well-designed complex interface typically layers all three, since they're not competing solutions but different applications of the same two findings.",
        aHi: 'Har ek wahi underlying constraints ka ek complementary aspect address karta hai: progressive disclosure har step pe N kam karta hai (Hick\'s Law), sensible defaults zyada tar users ko ek explicit decision poori tarah bypass karne dete hain, aur curated views effective option count kam karte hain jo zyada tar users actually consider karte hain (paradox of choice). Ek well-designed complex interface typically sab teen ko layer karta hai, kyunki wo competing solutions nahi hain balki wahi do findings ke different applications hain.',
      },
    ],

    exercises: [
      {
        task: "A team implements a 'quick checkout' default that pre-selects the most expensive shipping option (framed as 'Premium — recommended') while making the standard, cheaper shipping option available only after clicking a small 'more shipping options' link in light gray text at the bottom of the page. Using this lesson's legitimacy check, evaluate this pattern against each of its three conditions, and identify specifically which condition(s) it fails.",
        taskHi: 'Ek team ek \'quick checkout\' default implement karti hai jo sabse expensive shipping option ko pre-select karta hai (\'Premium — recommended\' ki tarah framed) jabki standard, cheaper shipping option ko sirf ek chhota \'more shipping options\' link click karne ke baad available banaته hue light gray text mein page ke bottom pe. Is lesson ka legitimacy check use karke, is pattern ko uski teen conditions mein se har ek ke against evaluate karo, aur specifically identify karo ki kaunsi condition(s) ye fail karta hai.',
        hint: "Check each condition independently: is the cheaper alternative genuinely, easily accessible? Does the default (most expensive option) serve the typical user's interest or the business's? Is the 'recommended' label honest or potentially misleading?",
        hintHi: 'Har condition ko independently check karo: kya cheaper alternative genuinely, easily accessible hai? Kya default (sabse expensive option) typical user ke interest ko serve karta hai ya business ke? Kya \'recommended\' label honest hai ya potentially misleading?',
      },
    ],

    keyTakeaways: [
      "Progressive disclosure, sensible defaults, and curated views are complementary applications of Hick's Law (Lesson 1) and the paradox of choice (Lesson 2), typically layered together rather than chosen between.",
      "Genuine accessibility of alternatives — not hidden, not buried, not requiring excessive effort to find — is a non-negotiable, checkable requirement for any of these patterns to remain legitimate.",
      "A default must also serve the typical user's actual interest, not just keep alternatives technically present, since a default chosen to benefit the business over the user fails legitimacy even with accessible alternatives.",
      "This lesson closes Module 6 by turning Lessons 1-2's findings into implementable patterns while establishing the exact boundary Module 9 later examines in depth: the line between helpful choice architecture and manipulation.",
    ],
    keyTakeawaysHi: [
      "Progressive disclosure, sensible defaults, aur curated views Hick's Law (Lesson 1) aur paradox of choice (Lesson 2) ke complementary applications hain, typically saath layered unke beech choose karne ke bajaye.",
      'Alternatives ki genuine accessibility — hidden nahi, buried nahi, dhundhne ke liye excessive effort maangte nahi — in patterns mein se kisi ke bhi legitimate rehne ke liye ek non-negotiable, checkable requirement hai.',
      'Ek default ko bhi typical user ke actual interest ko serve karna chahiye, sirf alternatives ko technically present rakhna nahi, kyunki ek default jo business ko user pe benefit karne ke liye choose kiya gaya legitimacy fail karta hai accessible alternatives ke saath bhi.',
      'Ye lesson Module 6 ko close karta hai Lessons 1-2 ki findings ko implementable patterns mein badalte hue jabki exact boundary establish karte hue jise Module 9 baad mein depth mein examine karta hai: helpful choice architecture aur manipulation ke beech ki line.',
    ],
  },
];
