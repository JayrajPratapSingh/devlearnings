/**
 * Psychology for Developers — Module 7: Motivation Psychology, lessons 1-3.
 *
 * Lesson 1: Intrinsic vs extrinsic motivation and Self-Determination Theory (autonomy/competence/relatedness).
 * Lesson 2: Why naive gamification (points/badges bolted on) reliably backfires.
 * Lesson 3: Designing for intrinsic motivation — concrete patterns that support autonomy, competence, and relatedness.
 */

import type { CourseLesson } from './course-js-module1';

export const PSYCH_MODULE_7: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'psych-intrinsic-extrinsic-motivation-sdt',
    title: 'Intrinsic vs Extrinsic Motivation & Self-Determination Theory',
    titleHi: 'Intrinsic Vs Extrinsic Motivation & Self-Determination Theory',
    description:
      "Self-Determination Theory identifies three genuine psychological needs — autonomy, competence, and relatedness — whose satisfaction produces durable, self-sustaining motivation, in contrast to externally-imposed rewards that motivate only as long as the reward keeps coming.",
    descriptionHi:
      'Self-Determination Theory teen genuine psychological needs identify karti hai — autonomy, competence, aur relatedness — jinki satisfaction durable, self-sustaining motivation produce karti hai, un externally-imposed rewards ke contrast mein jo sirf tab tak motivate karte hain jab tak reward aata rehta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A musician who plays for the genuine love of making music, versus a musician who only practices because a parent pays them per hour — the first keeps playing for a lifetime, the second stops the moment the payments end.** A musician who plays because they genuinely find it satisfying — because they feel a real sense of getting better at something meaningful, because they choose what and how to practice, because playing connects them to other musicians they respect — has a source of motivation that renews itself indefinitely, since the satisfaction comes from the activity itself. A musician who practices purely because a parent pays a fixed amount per hour has a motivation that is entirely dependent on an external condition continuing to hold — the moment the payments stop, or even the moment the per-hour rate feels insufficient, the motivation to practice evaporates, because it was never actually about the music. Neither musician is somehow morally superior, but the two motivations have genuinely different properties: one is self-sustaining and tends to deepen over time, the other requires continuous external maintenance and tends to evaporate the instant that maintenance stops or feels inadequate. This is exactly the distinction Self-Determination Theory formalizes between intrinsic motivation (doing something because the activity itself satisfies genuine psychological needs) and extrinsic motivation (doing something because of an external reward or pressure) — and it's why a product or workplace that only ever motivates through external rewards is building on the second musician's fragile foundation, not the first's durable one.",
      hi: 'ek musician jo music banane ke genuine love ke liye play karta hai, versus ek musician jo sirf isliye practice karta hai kyunki ek parent unhe per hour pay karta hai — pehla lifetime ke liye play karna continue karta hai, doosra payments khatam hote hi rukta hai. Ek musician jo isliye play karta hai kyunki wo genuinely ise satisfying paate hain — kyunki wo kisi meaningful cheez mein behtar hone ka ek real sense feel karte hain, kyunki wo choose karte hain ki kya aur kaise practice karna hai, kyunki playing unhe doosre musicians se connect karta hai jinhe wo respect karte hain — motivation ka ek source rakhta hai jo indefinitely khud renew hota hai, kyunki satisfaction activity khud se aati hai. Ek musician jo purely isliye practice karta hai kyunki ek parent per hour ek fixed amount pay karta hai ek aisa motivation rakhta hai jo poori tarah ek external condition ke continue hone pe depend karta hai — payments rukne ke moment, ya even per-hour rate insufficient feel karne ke moment, practice karne ki motivation evaporate ho jaati hai, kyunki ye kabhi actually music ke baare mein thi hi nahi. Koi bhi musician somehow morally superior nahi hai, par do motivations genuinely different properties rakhte hain: ek self-sustaining hai aur time ke saath deepen hone ki tendency rakhta hai, doosre ko continuous external maintenance chahiye aur wo maintenance rukne ya inadequate feel hone ke instant evaporate hone ki tendency rakhta hai. Ye exactly wo distinction hai jise Self-Determination Theory formalize karti hai intrinsic motivation (kuch karna kyunki activity khud genuine psychological needs satisfy karti hai) aur extrinsic motivation (kuch karna kyunki ek external reward ya pressure hai) ke beech — aur yahi wajah hai ek product ya workplace jo sirf kabhi external rewards ke through motivate karta hai doosre musician ki fragile foundation pe build kar raha hai, pehle ki durable wali pe nahi.',
    },

    simple: `**The core theoretical framework — Self-Determination Theory
(Deci & Ryan, decades of research) identifies three genuine
psychological needs whose satisfaction produces durable motivation:**

\`\`\`
AUTONOMY — feeling that one's actions are genuinely self-chosen, not
  controlled or coerced by an external force.

COMPETENCE — feeling genuinely effective and capable, experiencing
  real growth or mastery at something that matters.

RELATEDNESS — feeling genuinely connected to and cared about by
  other people, part of something beyond oneself alone.

When these three needs are satisfied by an activity itself, the
resulting motivation is INTRINSIC — self-sustaining, requiring no
external reward to persist. When motivation depends instead on an
external reward or pressure unrelated to these needs, it's EXTRINSIC
— dependent on that external condition continuing.
\`\`\`

**Why this distinction is checkable in a real engineering context —
a concrete before/after example of a team's actual motivation shifting
from intrinsic to extrinsic:**

\`\`\`ts
function diagnoseMotivationType(scenario) {
  const intrinsicSignals = [
    scenario.workerChoseTheApproach, // autonomy
    scenario.workerFeelsGenuineSkillGrowth, // competence
    scenario.workerFeelsConnectedToTeamOrMission, // relatedness
  ];
  const extrinsicPressureSignals = [
    scenario.motivatedPrimarilyByBonusOrPenalty,
    scenario.motivatedPrimarilyByAvoidingBlame,
  ];

  if (extrinsicPressureSignals.some(Boolean) && !intrinsicSignals.some(Boolean)) {
    return { type: 'purely_extrinsic', risk: 'motivation likely fragile, dependent on the external pressure continuing' };
  }
  return { type: 'intrinsic_or_mixed', risk: 'more durable, self-sustaining motivation' };
}
\`\`\`

**Why extrinsic motivators aren't inherently bad — the important,
narrow distinction this lesson establishes for later lessons:**

\`\`\`
Extrinsic rewards (a salary, a bonus, a badge) aren't inherently
harmful — most real-world activities involve some mix of intrinsic
and extrinsic motivation, and a fair salary is a legitimate,
reasonable extrinsic factor in any job. The genuine problem this
module's Lesson 2 examines is specifically when an extrinsic reward is
introduced ON TOP OF an already-intrinsically-motivated activity in a
way that actively UNDERMINES the underlying intrinsic motivation — a
well-documented, specific failure mode, not a blanket condemnation of
all external incentives.
\`\`\`

**A concrete, checkable pattern for evaluating a proposed feature or
policy against the three SDT needs — a practical diagnostic tool:**

\`\`\`ts
function evaluateAgainstSdtNeeds(proposedFeature) {
  return {
    autonomySupport: proposedFeature.givesUserGenuineChoiceOverHowToProceed,
    competenceSupport: proposedFeature.providesClearFeedbackOnGenuineProgress,
    relatednessSupport: proposedFeature.connectsUserToOthersOrToAMeaningfulPurpose,
    // A feature that scores well on none of these but relies entirely
    // on points/streaks/leaderboards is building purely on extrinsic
    // motivation — a specific risk this module's Lesson 2 examines
  };
}
\`\`\`

**How this lesson opens Module 7:** having covered biases that distort
decisions (Module 4-6), this module shifts to a genuinely different
psychological territory — not how people make individual decisions,
but what sustains their motivation to engage with a product, a
feature, or their own work over time. This lesson establishes the
theoretical foundation (SDT's three needs); Lesson 2 examines the
specific, well-documented failure mode of naive gamification
undermining these needs; Lesson 3 assembles concrete design patterns
that genuinely support them.`,

    simpleHi: `**Core theoretical framework — Self-Determination Theory (Deci &
Ryan, decades ki research) teen genuine psychological needs identify
karti hai jinki satisfaction durable motivation produce karti hai:**

\`\`\`
AUTONOMY — feel karna ki apne actions genuinely self-chosen hain, ek
  external force se controlled ya coerced nahi.

COMPETENCE — genuinely effective aur capable feel karna, kisi
  meaningful cheez mein real growth ya mastery experience karna.

RELATEDNESS — doosre logon se genuinely connected aur unse cared about
  feel karna, apne akele se aage kisi cheez ka part hona.

Jab ye teen needs ek activity khud se satisfy hoti hain, resulting
motivation INTRINSIC hoti hai — self-sustaining, persist karne ke liye
koi external reward chahiye nahi. Jab motivation iske bajaye ek
external reward ya pressure pe depend karti hai in needs se unrelated,
ye EXTRINSIC hai — us external condition ke continue hone pe dependent.
\`\`\`

**Ye distinction ek real engineering context mein checkable kyun hai
— ek team ki actual motivation ka intrinsic se extrinsic tak shift
hone ka ek concrete before/after example:**

\`\`\`ts
function diagnoseMotivationType(scenario) {
  const intrinsicSignals = [
    scenario.workerChoseTheApproach, // autonomy
    scenario.workerFeelsGenuineSkillGrowth, // competence
    scenario.workerFeelsConnectedToTeamOrMission, // relatedness
  ];
  const extrinsicPressureSignals = [
    scenario.motivatedPrimarilyByBonusOrPenalty,
    scenario.motivatedPrimarilyByAvoidingBlame,
  ];

  if (extrinsicPressureSignals.some(Boolean) && !intrinsicSignals.some(Boolean)) {
    return { type: 'purely_extrinsic', risk: 'motivation likely fragile, dependent on the external pressure continuing' };
  }
  return { type: 'intrinsic_or_mixed', risk: 'more durable, self-sustaining motivation' };
}
\`\`\`

**Extrinsic motivators inherently bad kyun nahi hain — important,
narrow distinction jise ye lesson baad ke lessons ke liye establish
karta hai:**

\`\`\`
Extrinsic rewards (ek salary, ek bonus, ek badge) inherently harmful
nahi hain — zyada tar real-world activities intrinsic aur extrinsic
motivation ka kuch mix involve karti hain, aur ek fair salary kisi bhi
job mein ek legitimate, reasonable extrinsic factor hai. Genuine
problem jise is module ka Lesson 2 examine karta hai specifically tab
hai jab ek extrinsic reward ek already-intrinsically-motivated
activity ke UPAR introduce ki jaati hai ek tarike se jo actively
underlying intrinsic motivation ko UNDERMINE karta hai — ek
well-documented, specific failure mode, sab external incentives ki ek
blanket condemnation nahi.
\`\`\`

**Ek proposed feature ya policy ko teen SDT needs ke against evaluate
karne ka ek concrete, checkable pattern — ek practical diagnostic
tool:**

\`\`\`ts
function evaluateAgainstSdtNeeds(proposedFeature) {
  return {
    autonomySupport: proposedFeature.givesUserGenuineChoiceOverHowToProceed,
    competenceSupport: proposedFeature.providesClearFeedbackOnGenuineProgress,
    relatednessSupport: proposedFeature.connectsUserToOthersOrToAMeaningfulPurpose,
    // Ek feature jo in mein se kisi pe achha score nahi karta par
    // poori tarah points/streaks/leaderboards pe rely karta hai
    // purely extrinsic motivation pe build kar raha hai — ek specific
    // risk jise is module ka Lesson 2 examine karta hai
  };
}
\`\`\`

**Ye lesson Module 7 ko kaise open karta hai:** decisions ko distort
karne wale biases cover karne ke baad (Module 4-6), ye module ek
genuinely different psychological territory ki taraf shift karta hai
— log individual decisions kaise lete hain nahi, balki kya unki
motivation ko sustain karta hai ek product, ek feature, ya apne khud
ke kaam ke saath engage karne ke liye time ke saath. Ye lesson
theoretical foundation establish karta hai (SDT ke teen needs); Lesson
2 naive gamification ke specific, well-documented failure mode ko
examine karta hai jo in needs ko undermine karta hai; Lesson 3
concrete design patterns assemble karta hai jo genuinely inhe support
karte hain.`,

    content: `## Why Self-Determination Theory identifies genuine psychological
needs rather than arbitrary preferences

Deci and Ryan's decades of research established autonomy, competence,
and relatedness as needs in a strong sense — their satisfaction is
consistently associated with well-being and durable motivation across
a wide range of contexts and cultures, and their frustration is
consistently associated with reduced motivation and well-being,
regardless of individual preference. This is why the theory functions
as a genuine diagnostic framework rather than a matter of taste: a
specific feature or workplace practice can be evaluated against these
three needs and will tend to produce similar motivational effects
across different people, in the same way a specific diet can be
evaluated against genuine nutritional needs rather than individual
food preferences.

## Why intrinsic motivation is structurally more durable than
extrinsic motivation, not merely "nicer" in some vague sense

Intrinsic motivation is durable specifically because its source — the
activity itself satisfying a genuine psychological need — persists as
long as the activity does, requiring no ongoing external input.
Extrinsic motivation is structurally fragile because it depends on an
external condition (a reward, a penalty, an evaluator's continued
attention) that must be actively maintained, and that can be withdrawn,
diminished, or simply stop feeling sufficient. This is a structural,
mechanical difference in how each type of motivation is sustained, not
merely a value judgment about which is more admirable.

## Why extrinsic motivators are not inherently harmful — the
important boundary this lesson sets for Lesson 2

Most real activities, including genuinely intrinsically-motivated
ones, involve some degree of extrinsic factor — a fair salary
alongside genuinely engaging work is a normal, unproblematic
combination. The specific, well-documented problem this module's
Lesson 2 examines is a narrower one: introducing an extrinsic reward
on top of an already intrinsically-motivated activity in a way that
actively displaces or undermines the existing intrinsic motivation —
a phenomenon requiring careful examination precisely because it isn't
simply "any extrinsic reward is bad," but a more specific interaction
between the two motivation types under particular conditions.

## Why a diagnostic check against the three SDT needs is a practical,
actionable tool rather than an abstract framework

Because autonomy, competence, and relatedness are specific, separately
identifiable needs, a proposed feature, policy, or workplace practice
can be checked against each independently — does it give genuine
choice (autonomy), does it provide clear feedback on real progress
(competence), does it connect people to others or to meaningful
purpose (relatedness)? A feature or practice that scores poorly on all
three while relying entirely on external rewards is a specific,
identifiable pattern worth flagging, connecting directly to the
gamification failure mode Lesson 2 examines in depth.

## How this lesson opens Module 7

Modules 4-6 examined biases that distort individual decisions and
judgments. This lesson begins Module 7's shift to a different but
related psychological territory: what sustains motivation to engage
with something over time, once a decision to try it has already been
made. This lesson establishes the theoretical foundation (SDT's three
needs and the intrinsic/extrinsic distinction); Lesson 2 examines
gamification's specific, well-documented failure mode; Lesson 3
assembles concrete design patterns that genuinely support the three
needs rather than merely simulating engagement through external
rewards.`,

    contentHi: `## Self-Determination Theory genuine psychological needs kyun identify karti hai arbitrary preferences nahi

Deci aur Ryan ki decades ki research ne autonomy, competence, aur
relatedness ko ek strong sense mein needs ki tarah establish kiya —
inki satisfaction consistently well-being aur durable motivation se
associated hai contexts aur cultures ki ek wide range ke across, aur
inki frustration consistently reduced motivation aur well-being se
associated hai, individual preference se independently. Yahi wajah hai
theory ek genuine diagnostic framework ki tarah function karti hai
taste ki matter ke bajaye: ek specific feature ya workplace practice
in teen needs ke against evaluate ki ja sakti hai aur similar
motivational effects produce karne ki tendency rakhegi different
logon ke across, wahi tarike se jaise ek specific diet ko genuine
nutritional needs ke against evaluate kiya ja sakta hai individual
food preferences ke bajaye.

## Intrinsic motivation structurally extrinsic motivation se zyada durable kyun hai, sirf kisi vague sense mein "nicer" nahi

Intrinsic motivation specifically durable hai kyunki iska source —
activity khud ek genuine psychological need satisfy karti hai —
persist karta hai jab tak activity karti hai, koi ongoing external
input maangte bina. Extrinsic motivation structurally fragile hai
kyunki ye ek external condition pe depend karti hai (ek reward, ek
penalty, ek evaluator ka continued attention) jise actively maintain
kiya jaana chahiye, aur jo withdraw ki ja sakti hai, diminish ki ja
sakti hai, ya simply sufficient feel karna band kar sakti hai. Ye ek
structural, mechanical difference hai is baat mein ki har type ki
motivation kaise sustain ki jaati hai, sirf ek value judgment nahi is
baat pe ki kaunsi zyada admirable hai.

## Extrinsic motivators inherently harmful kyun nahi hain — important boundary jise ye lesson Lesson 2 ke liye set karta hai

Zyada tar real activities, genuinely intrinsically-motivated wali
samet, kuch degree ka extrinsic factor involve karti hain — ek fair
salary genuinely engaging work ke saath ek normal, unproblematic
combination hai. Specific, well-documented problem jise is module ka
Lesson 2 examine karta hai ek narrower wala hai: ek extrinsic reward
ko ek already intrinsically-motivated activity ke upar introduce karna
ek tarike se jo actively existing intrinsic motivation ko displace ya
undermine karta hai — ek phenomenon jise careful examination chahiye
precisely is wajah se ki ye simply "koi bhi extrinsic reward bad hai"
nahi hai, balki do motivation types ke beech ek zyada specific
interaction hai particular conditions ke under.

## Teen SDT needs ke against ek diagnostic check ek practical, actionable tool kyun hai ek abstract framework nahi

Kyunki autonomy, competence, aur relatedness specific, separately
identifiable needs hain, ek proposed feature, policy, ya workplace
practice ko har ek ke against independently check kiya ja sakta hai —
kya ye genuine choice deta hai (autonomy), kya ye real progress pe
clear feedback provide karta hai (competence), kya ye logon ko doosron
se ya meaningful purpose se connect karta hai (relatedness)? Ek
feature ya practice jo teenon pe poorly score karta hai jabki poori
tarah external rewards pe rely karta hai ek specific, identifiable
pattern hai flag karne layak, directly gamification failure mode se
connect karte hue jise Lesson 2 depth mein examine karta hai.

## Ye lesson Module 7 ko kaise open karta hai

Modules 4-6 ne biases examine kiye jo individual decisions aur
judgments ko distort karte hain. Ye lesson Module 7 ke shift ko ek
different par related psychological territory ki taraf shuru karta
hai: kya kisi cheez ke saath engage karne ki motivation ko time ke
saath sustain karta hai, ek baar ise try karne ka decision already ban
chuka hai. Ye lesson theoretical foundation establish karta hai (SDT
ke teen needs aur intrinsic/extrinsic distinction); Lesson 2
gamification ke specific, well-documented failure mode ko examine
karta hai; Lesson 3 concrete design patterns assemble karta hai jo
genuinely teen needs ko support karte hain sirf external rewards ke
through engagement simulate karne ke bajaye.`,

    examples: [
      {
        title: 'An SDT-based feature evaluation checklist applied to two real onboarding designs',
        titleHi: 'Ek SDT-based feature evaluation checklist jo do real onboarding designs pe applied hai',
        codeJs: `function evaluateAgainstSdtNeeds(feature) {
  return {
    autonomySupport: feature.givesUserGenuineChoiceOverHowToProceed,
    competenceSupport: feature.providesClearFeedbackOnGenuineProgress,
    relatednessSupport: feature.connectsUserToOthersOrToAMeaningfulPurpose,
  };
}

// Onboarding A: a forced, linear tutorial with no way to skip steps,
// generic congratulations messages, no connection to other users
const onboardingA = {
  givesUserGenuineChoiceOverHowToProceed: false,
  providesClearFeedbackOnGenuineProgress: false,
  connectsUserToOthersOrToAMeaningfulPurpose: false,
};
console.log(evaluateAgainstSdtNeeds(onboardingA));
// { autonomySupport: false, competenceSupport: false, relatednessSupport: false }

// Onboarding B: users choose which features to explore first, see a
// specific skill they've genuinely gained after each step, and are
// shown how their work connects to teammates' work
const onboardingB = {
  givesUserGenuineChoiceOverHowToProceed: true,
  providesClearFeedbackOnGenuineProgress: true,
  connectsUserToOthersOrToAMeaningfulPurpose: true,
};
console.log(evaluateAgainstSdtNeeds(onboardingB));
// { autonomySupport: true, competenceSupport: true, relatednessSupport: true }`,
        codeTs: `interface FeatureSdtProfile {
  givesUserGenuineChoiceOverHowToProceed: boolean;
  providesClearFeedbackOnGenuineProgress: boolean;
  connectsUserToOthersOrToAMeaningfulPurpose: boolean;
}

interface SdtEvaluation {
  autonomySupport: boolean;
  competenceSupport: boolean;
  relatednessSupport: boolean;
}

function evaluateAgainstSdtNeeds(feature: FeatureSdtProfile): SdtEvaluation {
  return {
    autonomySupport: feature.givesUserGenuineChoiceOverHowToProceed,
    competenceSupport: feature.providesClearFeedbackOnGenuineProgress,
    relatednessSupport: feature.connectsUserToOthersOrToAMeaningfulPurpose,
  };
}

// Onboarding A: a forced, linear tutorial with no way to skip steps,
// generic congratulations messages, no connection to other users
const onboardingA: FeatureSdtProfile = {
  givesUserGenuineChoiceOverHowToProceed: false,
  providesClearFeedbackOnGenuineProgress: false,
  connectsUserToOthersOrToAMeaningfulPurpose: false,
};
console.log(evaluateAgainstSdtNeeds(onboardingA));
// { autonomySupport: false, competenceSupport: false, relatednessSupport: false }

// Onboarding B: users choose which features to explore first, see a
// specific skill they've genuinely gained after each step, and are
// shown how their work connects to teammates' work
const onboardingB: FeatureSdtProfile = {
  givesUserGenuineChoiceOverHowToProceed: true,
  providesClearFeedbackOnGenuineProgress: true,
  connectsUserToOthersOrToAMeaningfulPurpose: true,
};
console.log(evaluateAgainstSdtNeeds(onboardingB));
// { autonomySupport: true, competenceSupport: true, relatednessSupport: true }`,
        code: `return {
  autonomySupport: feature.givesUserGenuineChoiceOverHowToProceed,
  competenceSupport: feature.providesClearFeedbackOnGenuineProgress,
  relatednessSupport: feature.connectsUserToOthersOrToAMeaningfulPurpose,
};`,
        output:
          "Onboarding A scores false on all three SDT needs, flagging it as likely to produce only extrinsic, fragile engagement if it relies on rewards elsewhere. Onboarding B scores true on all three, indicating it's structured to support durable, intrinsic motivation independent of any external reward system.",
        explain:
          "This example operationalizes the lesson's diagnostic framework directly: rather than assessing engagement design through vague intuition, it checks a specific feature against each of the three separately identifiable SDT needs, producing a concrete, comparable result across different design candidates.",
        explainHi:
          "Ye example lesson ke diagnostic framework ko directly operationalize karta hai: engagement design ko vague intuition se assess karne ke bajaye, ye ek specific feature ko teen separately identifiable SDT needs mein se har ek ke against check karta hai, ek concrete, comparable result produce karte hue different design candidates ke across.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming any activity backed by a reward is equally motivating,
// with no distinction between intrinsic and extrinsic sources
function assessEngagementStrategyWrong(feature) {
  // "We're giving points for completing tutorials, so engagement
  // should be strong" — treats the presence of ANY reward as
  // sufficient, with no check on whether the underlying activity
  // itself satisfies any genuine psychological need
  return feature.hasPointsOrBadges ? 'engagement_strong' : 'engagement_weak';
}`,
        right: `// Distinguishing whether the underlying activity satisfies genuine
// SDT needs, treating reward presence as a separate, secondary factor
function assessEngagementStrategyRight(feature) {
  const sdtScore = evaluateAgainstSdtNeeds(feature);
  const hasGenuineIntrinsicSupport = Object.values(sdtScore).some(Boolean);

  return {
    likelyDurable: hasGenuineIntrinsicSupport,
    warning: !hasGenuineIntrinsicSupport && feature.hasPointsOrBadges
      ? 'Engagement may be purely extrinsic and fragile — dependent on the reward system continuing to feel valuable'
      : null,
  };
}`,
        why: "Treating the mere presence of a reward system as equivalent to genuine motivation ignores the structural difference this lesson establishes: extrinsic rewards produce motivation that depends on the reward continuing to feel valuable, while intrinsic motivation from genuine SDT-need satisfaction is self-sustaining — conflating the two leads to overestimating how durable a reward-based engagement strategy actually is.",
        whyHi:
          "Ek reward system ki sirf presence ko genuine motivation ke barabar treat karna us structural difference ko ignore karta hai jise ye lesson establish karta hai: extrinsic rewards ek motivation produce karte hain jo reward ke valuable feel karte rehne pe depend karti hai, jabki genuine SDT-need satisfaction se intrinsic motivation self-sustaining hai — do ko conflate karna is baat ko overestimate karne ki taraf le jaata hai ki ek reward-based engagement strategy actually kitni durable hai.",
      },
    ],

    realWorld: [
      {
        en: "A production developer-tools company redesigned their onboarding after internal research (informed by SDT) revealed their existing badge-based tutorial system produced high initial completion but negligible long-term feature retention — the redesign, emphasizing genuine user choice in what to learn first and clear before/after skill comparisons, measurably improved 90-day retention despite removing most of the original badge system entirely.",
        hi: 'Ek production developer-tools company ne apna onboarding redesign kiya internal research (SDT se informed) ye reveal karne ke baad ki unka existing badge-based tutorial system high initial completion produce karta tha par negligible long-term feature retention — redesign, genuine user choice pe emphasize karte hue is baat mein ki pehle kya seekhna hai aur clear before/after skill comparisons, 90-day retention ko measurably improve kiya original badge system ke zyada tar ko poori tarah remove karne ke bawajood.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the three needs Self-Determination Theory identifies, and why does the theory treat them as genuine needs rather than arbitrary preferences?',
        qHi: 'Self-Determination Theory kaunse teen needs identify karti hai, aur theory unhe genuine needs ki tarah kyun treat karti hai arbitrary preferences ke bajaye?',
        a: "Autonomy (feeling genuinely self-chosen, not controlled), competence (feeling genuinely effective and growing), and relatedness (feeling genuinely connected to others). They're treated as genuine needs because their satisfaction is consistently associated with well-being and durable motivation, and their frustration with reduced motivation, across a wide range of contexts and people — not a matter of individual taste.",
        aHi: 'Autonomy (genuinely self-chosen feel karna, controlled nahi), competence (genuinely effective aur growing feel karna), aur relatedness (doosron se genuinely connected feel karna). Inhe genuine needs ki tarah treat kiya jaata hai kyunki inki satisfaction consistently well-being aur durable motivation se associated hai, aur inki frustration reduced motivation se, contexts aur logon ki ek wide range ke across — individual taste ki matter nahi.',
      },
      {
        q: "Why is intrinsic motivation structurally more durable than extrinsic motivation?",
        qHi: 'Intrinsic motivation structurally extrinsic motivation se zyada durable kyun hai?',
        a: "Intrinsic motivation's source is the activity itself satisfying a genuine psychological need, so it persists as long as the activity does. Extrinsic motivation depends on an external condition (a reward or pressure) that must be actively maintained and can be withdrawn or stop feeling sufficient — a structural difference in what sustains each type, not merely a value judgment.",
        aHi: 'Intrinsic motivation ka source activity khud ek genuine psychological need satisfy karti hai, isliye ye persist karta hai jab tak activity karti hai. Extrinsic motivation ek external condition pe depend karti hai (ek reward ya pressure) jise actively maintain kiya jaana chahiye aur jo withdraw ki ja sakti hai ya sufficient feel karna band kar sakti hai — har type ko kya sustain karta hai isme ek structural difference, sirf ek value judgment nahi.',
      },
    ],

    exercises: [
      {
        task: "A team's internal tool has near-zero voluntary usage, and the team is considering adding a leaderboard showing which employees used it most this month as a fix. Using this lesson's SDT framework, evaluate whether a leaderboard addresses any of the three underlying needs, and propose what question the team should ask first before assuming a leaderboard will fix engagement.",
        taskHi: 'Ek team ke internal tool ka near-zero voluntary usage hai, aur team ek leaderboard add karne ko consider kar rahi hai jo dikhata hai ki kaunse employees ne ise is mahine sabse zyada use kiya ek fix ki tarah. Is lesson ke SDT framework use karke, evaluate karo ki kya ek leaderboard teen underlying needs mein se kisi ko address karta hai, aur propose karo ki team ko pehle kaunsa question poochna chahiye ek leaderboard engagement fix karega assume karne se pehle.',
        hint: "Check a leaderboard against each of autonomy, competence, and relatedness independently — does ranking employees against each other genuinely satisfy any of these, or does it primarily introduce external, comparative pressure?",
        hintHi: 'Ek leaderboard ko autonomy, competence, aur relatedness mein se har ek ke against independently check karo — kya employees ko ek doosre ke against rank karna genuinely in mein se kisi ko satisfy karta hai, ya ye primarily external, comparative pressure introduce karta hai?',
      },
    ],

    keyTakeaways: [
      "Self-Determination Theory identifies autonomy, competence, and relatedness as genuine psychological needs whose satisfaction produces durable, intrinsic motivation.",
      "Intrinsic motivation is structurally more durable than extrinsic motivation because its source (the activity itself) persists without external maintenance, while extrinsic motivation depends on a reward or pressure that must continue.",
      "Extrinsic motivators aren't inherently harmful — most activities involve some mix — the specific concern this module examines is extrinsic rewards actively undermining existing intrinsic motivation, covered in Lesson 2.",
      "A concrete diagnostic checking a feature against all three SDT needs independently is a practical tool for identifying purely extrinsic, potentially fragile engagement strategies.",
    ],
    keyTakeawaysHi: [
      'Self-Determination Theory autonomy, competence, aur relatedness ko genuine psychological needs ki tarah identify karti hai jinki satisfaction durable, intrinsic motivation produce karti hai.',
      'Intrinsic motivation structurally extrinsic motivation se zyada durable hai kyunki iska source (activity khud) external maintenance ke bina persist karta hai, jabki extrinsic motivation ek reward ya pressure pe depend karta hai jise continue karna chahiye.',
      'Extrinsic motivators inherently harmful nahi hain — zyada tar activities kuch mix involve karti hain — specific concern jise ye module examine karta hai extrinsic rewards ka existing intrinsic motivation ko actively undermine karna hai, Lesson 2 mein cover kiya gaya.',
      'Ek concrete diagnostic jo ek feature ko teen SDT needs mein se har ek ke against independently check karta hai purely extrinsic, potentially fragile engagement strategies identify karne ke liye ek practical tool hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'psych-why-naive-gamification-backfires',
    title: 'Why Naive Gamification (Points/Badges Bolted On) Reliably Backfires',
    titleHi: 'Naive Gamification (Points/Badges Bolted On) Reliably Kyun Backfire Karta Hai',
    description:
      "The overjustification effect — a well-documented, specific phenomenon where adding an external reward to an already-intrinsically-motivated activity measurably reduces the underlying intrinsic motivation, even after the reward is removed.",
    descriptionHi:
      'Overjustification effect — ek well-documented, specific phenomenon jahan ek external reward ko ek already-intrinsically-motivated activity mein add karna underlying intrinsic motivation ko measurably kam kar deta hai, reward hataye jaane ke baad bhi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A child who genuinely loves drawing for its own sake, who is then paid a small amount of money every time they draw — and who, once the payments stop, draws noticeably LESS than they did before any payment was ever introduced.** A child who draws purely for the joy of it — no reward involved, just genuine engagement with a satisfying activity — has a stable, self-sustaining reason to keep drawing. If an adult starts paying that child a small amount for each drawing, something specific and measurable happens to the child's own internal explanation for why they draw: instead of \"I draw because I love it,\" the mind quietly shifts toward \"I draw because I get paid for it\" — the external reward has effectively taken over as the explanation for the behavior, displacing the original internal one. The critical, counterintuitive finding is what happens when the payments then stop: the child doesn't simply return to their original, pre-payment level of drawing — they typically draw LESS than they did before any money was ever involved, because the activity's meaning has been genuinely reframed in their own mind from \"something I do because I love it\" to \"something I do for pay,\" and without the pay, the reframed activity has lost its original source of motivation without regaining it. This is the overjustification effect, and it's the specific, well-documented mechanism by which bolting an external reward system onto an already-engaging product feature can leave that feature LESS engaging than it was before the reward system existed, not merely equally engaging once the novelty of the reward wears off.",
      hi: 'ek bachcha jo genuinely drawing ko uski apni khatir pyaar karta hai, jisse phir har baar drawing karne pe thodi si money di jaati hai — aur jo, ek baar payments rukne ke baad, noticeably KAM draw karta hai us se jo wo kisi bhi payment introduce hone se pehle karta tha. Ek bachcha jo purely uski joy ke liye draw karta hai — koi reward involve nahi, sirf ek satisfying activity ke saath genuine engagement — drawing continue karne ka ek stable, self-sustaining reason rakhta hai. Agar ek adult us bachche ko har drawing ke liye thodi si amount pay karna shuru karta hai, kuch specific aur measurable hota hai bachche ke apne internal explanation ko is baat ka ki wo kyun draw karta hai: "main draw karta hoon kyunki main ise pyaar karta hoon" ke bajaye, mind quietly "main draw karta hoon kyunki mujhe iske liye pay kiya jaata hai" ki taraf shift hota hai — external reward ne effectively behavior ke explanation ki tarah takeover kar liya hai, original internal wale ko displace karte hue. Critical, counterintuitive finding ye hai ki kya hota hai jab payments phir rukte hain: bachcha simply apne original, pre-payment level of drawing pe wapas nahi jaata — wo typically us se KAM draw karta hai us se jo wo kisi bhi money involve hone se pehle karta tha, kyunki activity ka meaning unke apne mind mein genuinely "kuch jo main karta hoon kyunki main ise pyaar karta hoon" se "kuch jo main pay ke liye karta hoon" mein reframe ho chuka hai, aur pay ke bina, reframed activity ne apna original source of motivation khoya hai use regain kiye bina. Ye overjustification effect hai, aur ye specific, well-documented mechanism hai jiske through ek already-engaging product feature pe ek external reward system bolt karna us feature ko us se LESS engaging chhod sakta hai jitna ye reward system exist karne se pehle tha, sirf equally engaging nahi ek baar reward ki novelty utar jaane ke baad.',
    },

    simple: `**The core, well-documented finding (Lepper, Greene & Nisbett's
1973 research, extensively replicated since):**

\`\`\`
Introducing an external reward for an activity a person is already
intrinsically motivated to do can measurably REDUCE their subsequent
intrinsic motivation for that same activity — even after the reward is
removed, engagement often drops BELOW its original, pre-reward level,
not merely back to baseline.
\`\`\`

**Why this happens — the specific psychological mechanism, not just
the observed effect:**

\`\`\`
The overjustification effect operates through a shift in a person's
own internal explanation for their behavior: without an external
reward, the natural explanation for engaging in a satisfying activity
is "I do this because I enjoy it." Once a salient external reward is
introduced, the mind has a new, simpler available explanation ("I do
this for the reward"), which can displace the original intrinsic
explanation — and once displaced, removing the reward doesn't restore
the original explanation, it just removes the (now primary) reason
the activity was continuing to happen.
\`\`\`

**A concrete, checkable pattern this produces in gamified product
features — a specific failure mode worth recognizing:**

\`\`\`ts
function predictGamificationRisk(feature) {
  const wasAlreadyIntrinsicallyEngaging = feature.usersEngagedVoluntarilyBeforeRewardsAdded;
  const rewardIsSalientAndExternal = feature.pointsOrBadgesAreProminentAndDisconnectedFromTheActivityItself;

  if (wasAlreadyIntrinsicallyEngaging && rewardIsSalientAndExternal) {
    return {
      risk: 'high',
      warning: 'Adding a salient reward to an already-engaging activity risks the overjustification effect — engagement may DROP below baseline once reward novelty fades or the reward is removed',
    };
  }
  return { risk: 'low', note: 'Feature was not already intrinsically engaging — different considerations apply (see Lesson 3)' };
}
\`\`\`

**Why the effect is specifically about ALREADY-engaging activities —
the important boundary condition that prevents this from being a
blanket "never use rewards" rule:**

\`\`\`
The overjustification effect specifically requires a pre-existing
intrinsic motivation for the reward to undermine — introducing a
reward for an activity nobody found engaging in the first place isn't
subject to this specific failure mode, since there's no existing
intrinsic motivation to displace. This is why the practical guidance
isn't "never use points or badges," it's "be genuinely cautious about
adding a salient external reward on top of a feature users already
engage with voluntarily and enjoyably" — a much more specific,
targeted caution.
\`\`\`

**A concrete, real product example of naive gamification's typical
failure pattern:**

\`\`\`tsx
// A code-review tool that was already genuinely useful and voluntarily
// used — reviewers enjoyed catching real bugs and helping teammates
function CodeReviewToolBefore() {
  return <ReviewInterface />; // used voluntarily, motivated by genuine
  // usefulness and helping colleagues (autonomy, competence, relatedness)
}

// The SAME tool with points bolted on for "reviews completed" —
// a salient external reward introduced on top of already-intrinsic engagement
function CodeReviewToolAfterNaiveGamification() {
  return (
    <div>
      <ReviewInterface />
      <PointsBadge count={userPoints} /> {/* now prominently displayed —
        risks reframing "I review code to help my team" into
        "I review code for points," with the predictable overjustification
        risk once points stop feeling novel or rewarding */}
    </div>
  );
}
\`\`\`

**Why this connects directly to Lesson 1's intrinsic/extrinsic
distinction:** Lesson 1 established that intrinsic motivation is
self-sustaining because it comes from genuine SDT-need satisfaction.
This lesson shows the specific mechanism by which a naively-added
extrinsic reward can actively DAMAGE that self-sustaining source,
rather than simply adding a harmless additional incentive on top of
it — the two motivation types don't just coexist neutrally, one can
actively displace the other under specific, identifiable conditions.`,

    simpleHi: `**Core, well-documented finding (Lepper, Greene & Nisbett ki 1973
research, tab se extensively replicated):**

\`\`\`
Ek activity ke liye ek external reward introduce karna jise ek insaan
already intrinsically motivated hai karne ke liye unki subsequent
intrinsic motivation ko wahi activity ke liye measurably KAM kar
sakta hai — reward hataye jaane ke baad bhi, engagement aksar apne
original, pre-reward level se NEECHE gir jaata hai, sirf baseline pe
wapas nahi.
\`\`\`

**Ye kyun hota hai — specific psychological mechanism, sirf observed
effect nahi:**

\`\`\`
Overjustification effect ek insaan ke apne internal explanation mein
ek shift ke through operate karta hai unke behavior ke liye: ek
external reward ke bina, ek satisfying activity mein engage karne ka
natural explanation hai "main ye karta hoon kyunki mujhe ye enjoy hota
hai." Ek baar ek salient external reward introduce ki jaaye, mind ke
paas ek naya, simpler available explanation hota hai ("main ye reward
ke liye karta hoon"), jo original intrinsic explanation ko displace
kar sakta hai — aur ek baar displaced, reward hatana original
explanation ko restore nahi karta, ye sirf us (ab primary) reason ko
remove karta hai jiski wajah se activity continue ho rahi thi.
\`\`\`

**Ek concrete, checkable pattern jise ye gamified product features
mein produce karta hai — ek specific failure mode jise recognize karna
worth hai:**

\`\`\`ts
function predictGamificationRisk(feature) {
  const wasAlreadyIntrinsicallyEngaging = feature.usersEngagedVoluntarilyBeforeRewardsAdded;
  const rewardIsSalientAndExternal = feature.pointsOrBadgesAreProminentAndDisconnectedFromTheActivityItself;

  if (wasAlreadyIntrinsicallyEngaging && rewardIsSalientAndExternal) {
    return {
      risk: 'high',
      warning: 'Adding a salient reward to an already-engaging activity risks the overjustification effect — engagement may DROP below baseline once reward novelty fades or the reward is removed',
    };
  }
  return { risk: 'low', note: 'Feature was not already intrinsically engaging — different considerations apply (see Lesson 3)' };
}
\`\`\`

**Effect specifically ALREADY-engaging activities ke baare mein kyun
hai — important boundary condition jo ise ek blanket "kabhi rewards
use mat karo" rule banne se rokta hai:**

\`\`\`
Overjustification effect ko specifically ek pre-existing intrinsic
motivation chahiye reward ke undermine karne ke liye — ek activity ke
liye ek reward introduce karna jise pehli jagah koi engaging nahi
paata is specific failure mode ke subject nahi hai, kyunki koi existing
intrinsic motivation nahi hai displace karne ke liye. Yahi wajah hai
practical guidance "kabhi points ya badges use mat karo" nahi hai, ye
"genuinely cautious raho ek salient external reward ko ek feature ke
upar add karne ke baare mein jise users already voluntarily aur
enjoyably use karte hain" hai — ek kaafi zyada specific, targeted
caution.
\`\`\`

**Naive gamification ke typical failure pattern ka ek concrete, real
product example:**

\`\`\`tsx
// Ek code-review tool jo already genuinely useful aur voluntarily
// used tha — reviewers real bugs catch karna aur teammates ki help
// karna enjoy karte the
function CodeReviewToolBefore() {
  return <ReviewInterface />; // voluntarily used, genuine usefulness
  // aur colleagues ki help karne se motivated (autonomy, competence, relatedness)
}

// Wahi tool "reviews completed" ke liye points bolted on ke saath —
// ek salient external reward already-intrinsic engagement ke upar introduce ki gayi
function CodeReviewToolAfterNaiveGamification() {
  return (
    <div>
      <ReviewInterface />
      <PointsBadge count={userPoints} /> {/* ab prominently displayed —
        "main apni team ko help karne ke liye code review karta hoon"
        ko "main points ke liye code review karta hoon" mein reframe
        karne ka risk, predictable overjustification risk ke saath
        ek baar points novel ya rewarding feel karna band kar dete hain */}
    </div>
  );
}
\`\`\`

**Ye directly Lesson 1 ke intrinsic/extrinsic distinction se kaise
connect karta hai:** Lesson 1 ne establish kiya ki intrinsic
motivation self-sustaining hai kyunki ye genuine SDT-need satisfaction
se aata hai. Ye lesson specific mechanism dikhata hai jiske through
ek naively-added extrinsic reward us self-sustaining source ko
actively DAMAGE kar sakta hai, sirf uske upar ek harmless additional
incentive add karne ke bajaye — do motivation types sirf neutrally
coexist nahi karte, ek doosre ko actively displace kar sakta hai
specific, identifiable conditions ke under.`,

    content: `## Why the overjustification effect is a well-documented, specific
finding rather than a general skepticism toward rewards

Lepper, Greene, and Nisbett's foundational 1973 research demonstrated
this effect experimentally: children who were already drawing
voluntarily, without any reward, showed measurably reduced subsequent
engagement with drawing after being given an external reward for it
compared to children who continued drawing without a reward introduced
— a specific, replicated experimental finding, not a general
anti-incentive sentiment. This precision matters because it means the
effect has identifiable boundary conditions (an existing intrinsic
motivation to displace, a salient enough external reward to plausibly
serve as an alternative explanation) rather than applying universally
to any use of rewards.

## Why the mechanism operates through a shift in self-explanation,
not simply through the reward itself being harmful

The overjustification effect's specific mechanism involves a person's
own attribution for their behavior shifting from an internal
explanation ("I do this because I find it satisfying") to an external
one ("I do this because of the reward") once a salient external reward
becomes available as a simpler, more obvious explanation. This
attributional shift is what produces the counterintuitive result that
removing the reward afterward doesn't restore the original intrinsic
motivation — the internal explanation was displaced, not merely
supplemented, so its removal leaves a genuine motivational gap rather
than a return to the original baseline.

## Why the effect specifically requires pre-existing intrinsic
motivation, which is the key boundary condition preventing this from
being a blanket rule against all incentives

Because the mechanism depends on an external reward displacing an
existing internal explanation, the effect cannot occur where no
internal explanation existed in the first place — introducing a reward
for an activity nobody found engaging is a fundamentally different
situation, addressed by different considerations (covered in this
module's Lesson 3) rather than the overjustification risk this lesson
focuses on. This is precisely why the practical guidance is targeted
and specific — genuine caution about adding salient external rewards
on top of already-voluntary, already-enjoyed engagement — rather than
a general prohibition on any use of points, badges, or incentives.

## Why this connects directly to, and extends, Lesson 1's
intrinsic/extrinsic framework

Lesson 1 established that intrinsic motivation is self-sustaining
because it stems from genuine satisfaction of autonomy, competence, or
relatedness needs. This lesson demonstrates that this self-sustaining
source isn't simply immune to external interference — a naively
introduced extrinsic reward can actively displace it through the
attributional mechanism this lesson describes, meaning the two
motivation types aren't always neutrally additive. Recognizing this
specific interaction is what separates a naive "add gamification for
engagement" instinct from a genuinely informed approach to designing
motivating features, which Lesson 3 develops into concrete, safer
patterns.

## How this lesson connects Module 7's arc

Having established the theoretical foundation in Lesson 1 (intrinsic
motivation's durability, extrinsic motivation's fragility), this
lesson identifies the single most consequential practical mistake that
theoretical understanding warns against: naively bolting external
rewards onto features that were already intrinsically engaging.
Lesson 3 completes the module by assembling concrete design patterns
that build genuine intrinsic motivation directly, rather than risking
this specific, well-documented failure mode.`,

    contentHi: `## Overjustification effect ek well-documented, specific finding kyun hai rewards ke against ek general skepticism ke bajaye

Lepper, Greene, aur Nisbett ki foundational 1973 research ne ise
experimentally demonstrate kiya: bachche jo already voluntarily draw
kar rahe the, koi reward ke bina, unhe iske liye ek external reward
diye jaane ke baad drawing ke saath measurably reduced subsequent
engagement dikhayi un bachchon ke compare mein jinhone koi reward
introduce hue bina draw karna continue kiya — ek specific, replicated
experimental finding, ek general anti-incentive sentiment nahi. Ye
precision matter karta hai kyunki iska matlab hai effect ke
identifiable boundary conditions hain (displace karne ke liye ek
existing intrinsic motivation, ek plausibly alternative explanation ki
tarah serve karne ke liye kaafi salient external reward) universally
kisi bhi rewards ke use pe apply hone ke bajaye.

## Mechanism self-explanation mein ek shift ke through kyun operate karta hai, sirf iske through nahi ki reward khud harmful hai

Overjustification effect ka specific mechanism ek insaan ka apna
attribution unke behavior ke liye shift karna involve karta hai ek
internal explanation se ("main ye karta hoon kyunki mujhe ye
satisfying lagta hai") ek external wale ki taraf ("main ye reward ki
wajah se karta hoon") ek baar ek salient external reward ek simpler,
zyada obvious explanation ki tarah available ban jaaye. Ye
attributional shift wo hai jo counterintuitive result produce karta
hai ki baad mein reward hatana original intrinsic motivation ko
restore nahi karta — internal explanation displace ki gayi thi, sirf
supplemented nahi, isliye iska removal ek genuine motivational gap
chhodta hai original baseline pe wapas jaane ke bajaye.

## Effect specifically pre-existing intrinsic motivation kyun maangta hai, jo key boundary condition hai ise sab incentives ke against ek blanket rule banne se rokte hue

Kyunki mechanism ek external reward pe depend karta hai ek existing
internal explanation ko displace karne ke liye, effect wahan occur
nahi ho sakta jahan pehli jagah koi internal explanation exist nahi
karti thi — ek activity ke liye ek reward introduce karna jise koi
engaging nahi paata ek fundamentally different situation hai, different
considerations se address ki gayi (is module ke Lesson 3 mein cover
ki gayi) us overjustification risk ke bajaye jispe ye lesson focus
karta hai. Yahi exactly wajah hai practical guidance targeted aur
specific hai — already-voluntary, already-enjoyed engagement ke upar
salient external rewards add karne ke baare mein genuine caution —
points, badges, ya incentives ke kisi bhi use pe ek general
prohibition ke bajaye.

## Ye directly Lesson 1 ke intrinsic/extrinsic framework se kaise connect karta hai, aur use extend karta hai

Lesson 1 ne establish kiya ki intrinsic motivation self-sustaining hai
kyunki ye autonomy, competence, ya relatedness needs ki genuine
satisfaction se stem karta hai. Ye lesson demonstrate karta hai ki ye
self-sustaining source simply external interference se immune nahi hai
— ek naively introduce ki gayi extrinsic reward ise actively displace
kar sakti hai us attributional mechanism ke through jise ye lesson
describe karta hai, matlab do motivation types hamesha neutrally
additive nahi hote. Is specific interaction ko recognize karna wo hai
jo ek naive "engagement ke liye gamification add karo" instinct ko ek
genuinely informed approach se motivating features design karne ke
liye separate karta hai, jise Lesson 3 concrete, safer patterns mein
develop karta hai.

## Ye lesson Module 7 ke arc ko kaise connect karta hai

Lesson 1 mein theoretical foundation establish karne ke baad
(intrinsic motivation ki durability, extrinsic motivation ki
fragility), ye lesson single sabse consequential practical mistake
identify karta hai jise theoretical understanding warn karti hai:
naively external rewards ko features pe bolt karna jo already
intrinsically engaging the. Lesson 3 module ko complete karta hai
concrete design patterns assemble karke jo genuine intrinsic
motivation ko directly build karte hain, is specific, well-documented
failure mode ko risk karne ke bajaye.`,

    examples: [
      {
        title: 'A gamification-risk checker applied before adding a reward system to an existing feature',
        titleHi: 'Ek gamification-risk checker jo ek existing feature mein ek reward system add karne se pehle applied hai',
        codeJs: `function predictGamificationRisk(feature) {
  const {
    usersEngagedVoluntarilyBeforeRewardsAdded,
    pointsOrBadgesAreProminentAndDisconnectedFromTheActivityItself,
  } = feature;

  if (usersEngagedVoluntarilyBeforeRewardsAdded && pointsOrBadgesAreProminentAndDisconnectedFromTheActivityItself) {
    return {
      risk: 'high',
      warning: 'Overjustification risk — this feature was already intrinsically engaging; a salient external reward could reduce engagement below baseline once its novelty fades or it is removed',
      recommendation: 'Consider whether the reward can be made an integrated, meaningful reflection of genuine progress (competence-supporting) rather than a disconnected point tally',
    };
  }
  return { risk: 'low', note: 'No pre-existing intrinsic engagement to displace — different design considerations apply' };
}

// Applied to a real internal tool decision: adding a leaderboard to
// an already-popular, voluntarily-used code review feature
const reviewToolRisk = predictGamificationRisk({
  usersEngagedVoluntarilyBeforeRewardsAdded: true,
  pointsOrBadgesAreProminentAndDisconnectedFromTheActivityItself: true,
});
// { risk: 'high', warning: 'Overjustification risk...', recommendation: '...' }`,
        codeTs: `interface FeatureGamificationContext {
  usersEngagedVoluntarilyBeforeRewardsAdded: boolean;
  pointsOrBadgesAreProminentAndDisconnectedFromTheActivityItself: boolean;
}

function predictGamificationRisk(feature: FeatureGamificationContext) {
  const {
    usersEngagedVoluntarilyBeforeRewardsAdded,
    pointsOrBadgesAreProminentAndDisconnectedFromTheActivityItself,
  } = feature;

  if (usersEngagedVoluntarilyBeforeRewardsAdded && pointsOrBadgesAreProminentAndDisconnectedFromTheActivityItself) {
    return {
      risk: 'high' as const,
      warning: 'Overjustification risk — this feature was already intrinsically engaging; a salient external reward could reduce engagement below baseline once its novelty fades or it is removed',
      recommendation: 'Consider whether the reward can be made an integrated, meaningful reflection of genuine progress (competence-supporting) rather than a disconnected point tally',
    };
  }
  return { risk: 'low' as const, note: 'No pre-existing intrinsic engagement to displace — different design considerations apply' };
}

// Applied to a real internal tool decision: adding a leaderboard to
// an already-popular, voluntarily-used code review feature
const reviewToolRisk = predictGamificationRisk({
  usersEngagedVoluntarilyBeforeRewardsAdded: true,
  pointsOrBadgesAreProminentAndDisconnectedFromTheActivityItself: true,
});
// { risk: 'high', warning: 'Overjustification risk...', recommendation: '...' }`,
        code: `if (usersEngagedVoluntarilyBeforeRewardsAdded && pointsOrBadgesAreProminentAndDisconnectedFromTheActivityItself) {
  return { risk: 'high', warning: 'Overjustification risk...' };
}`,
        output:
          "The check correctly flags the code-review-leaderboard scenario as high-risk, since the feature was already voluntarily used and the proposed reward is a prominent, disconnected point system — exactly the combination of conditions the overjustification effect requires, prompting the team to reconsider before shipping the change.",
        explain:
          "This example makes the lesson's boundary condition directly checkable in code: the risk assessment specifically requires BOTH pre-existing voluntary engagement AND a salient, disconnected reward, correctly distinguishing the narrow overjustification risk from a blanket anti-gamification stance.",
        explainHi:
          "Ye example lesson ke boundary condition ko directly code mein checkable banata hai: risk assessment specifically DONO pre-existing voluntary engagement AUR ek salient, disconnected reward maangta hai, narrow overjustification risk ko correctly ek blanket anti-gamification stance se distinguish karte hue.",
      },
    ],

    mistakes: [
      {
        wrong: `// Adding a prominent points system to a feature that was already
// genuinely, voluntarily engaging, without considering overjustification risk
function addGamificationWrong(existingFeature) {
  // "Users already love this feature — let's add points to make it
  // even MORE engaging" — the exact reasoning that risks the
  // overjustification effect, since the feature had no engagement
  // problem the reward was actually solving
  return { ...existingFeature, pointsSystem: createPointsSystem() };
}`,
        right: `// Checking overjustification risk before adding a reward to an
// already-engaging feature
function addGamificationRight(existingFeature) {
  const risk = predictGamificationRisk({
    usersEngagedVoluntarilyBeforeRewardsAdded: existingFeature.hasStrongVoluntaryUsage,
    pointsOrBadgesAreProminentAndDisconnectedFromTheActivityItself: true,
  });

  if (risk.risk === 'high') {
    // Reconsider: is there an actual engagement PROBLEM this reward
    // solves, or is this "gamification for its own sake" on a feature
    // that was never struggling to begin with?
    return { ...existingFeature, recommendation: 'Do not add a disconnected reward; consider Lesson 3\\'s integrated approaches instead' };
  }
  return { ...existingFeature, pointsSystem: createPointsSystem() };
}`,
        why: "Adding a reward system to a feature specifically because it's already popular and engaging is the exact scenario the overjustification effect warns against — the feature had no engagement problem the reward was solving, meaning the reward introduces real risk (displacing the existing intrinsic motivation) without addressing any actual need.",
        whyHi:
          "Ek reward system ko ek feature mein add karna specifically is wajah se ki ye already popular aur engaging hai exact scenario hai jise overjustification effect warn karta hai — feature mein koi engagement problem nahi thi jise reward solve kar raha tha, matlab reward real risk introduce karta hai (existing intrinsic motivation ko displace karte hue) kisi actual need ko address kiye bina.",
      },
    ],

    realWorld: [
      {
        en: "A production open-source project's maintainer community, previously motivated purely by genuine interest in the project and peer recognition, saw a measurable decline in voluntary contribution quality after a points-and-badges system was introduced to 'boost engagement' — contributors reported in a follow-up survey that the work started feeling like it was 'for the badges' rather than for the project, and the system was eventually removed after contribution quality failed to recover even after several months.",
        hi: 'Ek production open-source project ki maintainer community, pehle purely project mein genuine interest aur peer recognition se motivated, voluntary contribution quality mein ek measurable decline dekhi ek points-and-badges system introduce kiye jaane ke baad \'engagement boost\' karne ke liye — contributors ne ek follow-up survey mein report kiya ki kaam \'badges ke liye\' feel karna shuru hua project ke liye ke bajaye, aur system ko eventually remove kar diya gaya contribution quality kai mahino ke baad bhi recover na hone ke baad.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the overjustification effect, and what specific research established it?',
        qHi: 'Overjustification effect kya hai, aur kaunsi specific research ne ise establish kiya?',
        a: "The overjustification effect is the finding that introducing an external reward for an activity a person is already intrinsically motivated to do can measurably reduce their subsequent intrinsic motivation for it, even after the reward is removed — often dropping engagement below its original, pre-reward baseline. Lepper, Greene, and Nisbett's 1973 research established this experimentally.",
        aHi: 'Overjustification effect ye finding hai ki ek activity ke liye ek external reward introduce karna jise ek insaan already intrinsically motivated hai karne ke liye unki subsequent intrinsic motivation ko uske liye measurably kam kar sakta hai, reward hataye jaane ke baad bhi — aksar engagement ko uske original, pre-reward baseline se neeche gira dete hue. Lepper, Greene, aur Nisbett ki 1973 research ne ise experimentally establish kiya.',
      },
      {
        q: "Why does the overjustification effect specifically require pre-existing intrinsic motivation, and why does this matter practically?",
        qHi: 'Overjustification effect specifically pre-existing intrinsic motivation kyun maangta hai, aur ye practically kyun matter karta hai?',
        a: "The mechanism involves an external reward displacing an existing internal explanation for behavior — if no internal explanation existed (the activity wasn't already engaging), there's nothing for the reward to displace. This matters because it means the practical guidance is targeted: be cautious about adding salient rewards to already-voluntary, already-enjoyed activities specifically, not a blanket rejection of all incentive systems.",
        aHi: 'Mechanism ek external reward ko ek existing internal explanation for behavior displace karna involve karta hai — agar koi internal explanation exist nahi karti thi (activity already engaging nahi thi), reward ke displace karne ke liye kuch nahi hai. Ye matter karta hai kyunki iska matlab hai practical guidance targeted hai: already-voluntary, already-enjoyed activities mein specifically salient rewards add karne ke baare mein cautious raho, sab incentive systems ki ek blanket rejection nahi.',
      },
    ],

    exercises: [
      {
        task: "A product team notices that a collaborative document-editing feature is already used voluntarily and enthusiastically by most teams, with high satisfaction scores. A stakeholder proposes adding a prominent 'edits this week' leaderboard to 'further boost engagement.' Using this lesson's risk-assessment framework, evaluate this proposal and explain what specific outcome the team should watch for if they proceed anyway.",
        taskHi: 'Ek product team notice karti hai ki ek collaborative document-editing feature already zyada tar teams dwara voluntarily aur enthusiastically use ki jaati hai, high satisfaction scores ke saath. Ek stakeholder ek prominent \'edits this week\' leaderboard add karne ka propose karta hai \'engagement ko further boost\' karne ke liye. Is lesson ke risk-assessment framework use karke, is proposal ko evaluate karo aur explain karo ki team ko kaunsa specific outcome dekhna chahiye agar wo phir bhi proceed karte hain.',
        hint: "Check this scenario against the two required conditions for overjustification risk, and think specifically about what would happen to engagement not immediately, but after the leaderboard's novelty fades or if it were later removed.",
        hintHi: 'Is scenario ko overjustification risk ke liye do required conditions ke against check karo, aur specifically socho ki engagement ka kya hoga immediately nahi, balki leaderboard ki novelty fade hone ke baad ya agar ise baad mein remove kiya jaata.',
      },
    ],

    keyTakeaways: [
      "The overjustification effect (Lepper, Greene & Nisbett, 1973) shows that adding an external reward to an already-intrinsically-motivated activity can measurably reduce subsequent motivation, even below the original pre-reward baseline.",
      "The mechanism operates through a shift in self-explanation — from 'I do this because I enjoy it' to 'I do this for the reward' — which doesn't reverse when the reward is later removed.",
      "The effect specifically requires pre-existing intrinsic motivation to displace, meaning the practical guidance is targeted caution about rewarding already-engaging activities, not a blanket rejection of all incentive systems.",
      "This lesson identifies the key practical mistake Module 7's theoretical foundation (Lesson 1) warns against, setting up Lesson 3's safer, integrated design patterns.",
    ],
    keyTakeawaysHi: [
      'Overjustification effect (Lepper, Greene & Nisbett, 1973) dikhata hai ki ek already-intrinsically-motivated activity mein ek external reward add karna subsequent motivation ko measurably kam kar sakta hai, original pre-reward baseline se bhi neeche.',
      "Mechanism self-explanation mein ek shift ke through operate karta hai — 'main ye karta hoon kyunki mujhe ye enjoy hota hai' se 'main ye reward ke liye karta hoon' tak — jo reverse nahi hota jab reward baad mein hataya jaata hai.",
      'Effect specifically pre-existing intrinsic motivation maangta hai displace karne ke liye, matlab practical guidance already-engaging activities ko reward karne ke baare mein targeted caution hai, sab incentive systems ki ek blanket rejection nahi.',
      'Ye lesson key practical mistake identify karta hai jise Module 7 ki theoretical foundation (Lesson 1) warn karti hai, Lesson 3 ke safer, integrated design patterns ko set up karte hue.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'psych-designing-for-intrinsic-motivation',
    title: 'Designing for Intrinsic Motivation — Concrete Patterns',
    titleHi: 'Intrinsic Motivation Ke Liye Design Karna — Concrete Patterns',
    description:
      "Closing this module: concrete, implementable design patterns that directly support autonomy, competence, and relatedness — the genuine alternative to naive gamification, building durable engagement from the psychological needs SDT identifies rather than external rewards layered on top.",
    descriptionHi:
      'Is module ko close karte hue: concrete, implementable design patterns jo directly autonomy, competence, aur relatedness ko support karte hain — naive gamification ka genuine alternative, durable engagement ko un psychological needs se build karte hue jise SDT identify karti hai external rewards ke upar layered hone ke bajaye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A skilled teacher who builds a student's genuine, lasting love of a subject by giving them real choices in what to explore, honest feedback on real growth, and a sense of belonging to a community of learners — versus a teacher who only ever hands out stickers for correct answers.** A teacher who lets a student choose which topics to dig into more deeply, who gives specific, honest feedback about a skill the student has genuinely improved at, and who makes the student feel like a real member of a classroom community pursuing something meaningful together is building a student's actual, durable love of learning — one that will persist long after that specific teacher, class, or school year ends, because it comes from the student's own experience of autonomy, competence, and relatedness. A teacher who relies purely on handing out stickers for correct answers can produce short-term compliance, but as Lesson 2 established, this approach risks the opposite of durable love for the subject — the student may come to see correct answers as being \"for the sticker\" rather than for genuine understanding, and the moment stickers stop, so might the engagement. The three patterns this lesson assembles — genuine choice, honest feedback on real growth, and genuine connection to others or to meaningful purpose — are the concrete, implementable version of exactly what the first teacher does differently: building engagement from real psychological needs being met, not from a reward system layered on top that risks undermining those needs instead.",
      hi: 'ek skilled teacher jo ek student ka genuine, lasting love ek subject ke liye build karta hai unhe real choices dete hue is baat mein ki kya explore karna hai, honest feedback real growth pe, aur ek community of learners se belonging ka ek sense — versus ek teacher jo sirf kabhi correct answers ke liye stickers hand out karta hai. Ek teacher jo ek student ko choose karne deta hai ki kaunse topics mein zyada deeply dig karna hai, jo specific, honest feedback deta hai ek skill ke baare mein jisme student genuinely improve hua hai, aur jo student ko ek classroom community ka ek real member feel karata hai kuch meaningful saath pursue karte hue ek student ka actual, durable love of learning build kar raha hai — ek jo us specific teacher, class, ya school year khatam hone ke baad bhi persist karega, kyunki ye student ke apne experience of autonomy, competence, aur relatedness se aata hai. Ek teacher jo purely correct answers ke liye stickers hand out karne pe rely karta hai short-term compliance produce kar sakta hai, par jaise Lesson 2 ne establish kiya, ye approach subject ke liye durable love ke opposite ka risk leta hai — student correct answers ko "sticker ke liye" hone ki tarah dekhne aa sakta hai genuine understanding ke liye ke bajaye, aur jaise hi stickers rukte hain, engagement bhi ruk sakta hai. Teen patterns jise ye lesson assemble karta hai — genuine choice, real growth pe honest feedback, aur doosron ya meaningful purpose se genuine connection — exactly wo hain jo pehla teacher differently karta hai ka concrete, implementable version: engagement ko real psychological needs ke met hone se build karna, ek reward system se nahi jo upar layered hai jo un needs ko undermine karne ka risk leta hai iske bajaye.',
    },

    simple: `**The three concrete patterns this lesson assembles from Module
7's theoretical foundation (Lessons 1-2):**

\`\`\`
1. SUPPORT GENUINE AUTONOMY — give users real, meaningful choice over
   how to proceed, not the illusion of choice among options that all
   lead to the same outcome.

2. SUPPORT GENUINE COMPETENCE — provide clear, honest feedback on
   real progress and skill growth, not arbitrary points disconnected
   from actual improvement.

3. SUPPORT GENUINE RELATEDNESS — connect users to other people or to
   a meaningful shared purpose, not an isolated, purely individual
   points tally.
\`\`\`

**Pattern 1 in a concrete product context — genuine autonomy versus
its illusion:**

\`\`\`tsx
// FALSE autonomy — multiple paths that all converge to the identical
// outcome, giving the appearance of choice without the substance
function OnboardingFalseChoice() {
  return (
    <div>
      <button onClick={() => goToStep2WithDefaultSettings()}>Quick setup</button>
      <button onClick={() => goToStep2WithDefaultSettings()}>Custom setup</button>
      {/* Both buttons lead to the SAME outcome — the "choice" is illusory */}
    </div>
  );
}

// GENUINE autonomy — the choice actually leads to meaningfully
// different, user-determined outcomes
function OnboardingGenuineChoice() {
  return (
    <div>
      <button onClick={() => applyRecommendedDefaults()}>Use recommended settings</button>
      <button onClick={() => goToCustomizationFlow()}>Customize every setting myself</button>
      {/* These genuinely lead to different experiences, actually
          determined by the user's own choice */}
    </div>
  );
}
\`\`\`

**Pattern 2 in a concrete product context — genuine competence
feedback versus arbitrary points:**

\`\`\`tsx
// Arbitrary points, disconnected from real skill or progress
function ArbitraryPointsFeedback({ points }) {
  return <p>You earned 50 points!</p>; // no connection to any
  // actual, meaningful improvement the user can recognize in themselves
}

// Genuine competence feedback, tied to real, specific improvement
function GenuineCompetenceFeedback({ skillBefore, skillAfter, specificImprovement }) {
  return (
    <p>
      Your query response time improved from {skillBefore}ms to {skillAfter}ms
      — {specificImprovement} {/* a specific, real, recognizable improvement,
          not an arbitrary number disconnected from actual skill */}
    </p>
  );
}
\`\`\`

**Pattern 3 in a concrete product context — genuine relatedness
versus an isolated leaderboard:**

\`\`\`tsx
// An isolated leaderboard — purely comparative, no genuine connection
function IsolatedLeaderboard({ rankings }) {
  return <ol>{rankings.map((r) => <li key={r.id}>{r.name}: {r.score}</li>)}</ol>;
  // Purely comparative ranking — doesn't connect people to each
  // other or to shared purpose, just ranks them against one another
}

// Genuine relatedness — connecting users to real collaboration and
// shared purpose, not just comparative ranking
function GenuineTeamConnection({ teamContributions, sharedGoal }) {
  return (
    <div>
      <p>Your team is {sharedGoal.progressPercent}% toward: {sharedGoal.description}</p>
      <p>{teamContributions.map((c) => \`\${c.name} contributed \${c.description}\`).join(', ')}</p>
      {/* Genuinely connects individual contributions to a shared,
          meaningful team goal — relatedness, not pure comparison */}
    </div>
  );
}
\`\`\`

**Why all three patterns must pass the SAME legitimacy test Module
6's Lesson 3 established for choice architecture — a direct, explicit
connection between the two modules:**

\`\`\`ts
function isMotivationDesignLegitimate(pattern) {
  return (
    pattern.choiceIsGenuinelyMeaningfulNotIllusory && // Module 6's
    // "genuinely accessible alternatives" principle applied to autonomy
    pattern.feedbackReflectsRealProgressNotArbitraryMetrics &&
    pattern.connectionIsGenuineNotPurelyComparative
  );
  // A pattern that fails this test has drifted from supporting
  // intrinsic motivation into either the overjustification risk
  // (Lesson 2) or the manipulation risk Module 9 examines directly
}
\`\`\`

**How this lesson closes Module 7:** Lesson 1 established the
theoretical foundation (SDT's three needs, the intrinsic/extrinsic
distinction). Lesson 2 established the specific failure mode of naive
gamification undermining that foundation. This lesson completes the
module by assembling the constructive alternative: concrete,
implementable patterns that build genuine, durable engagement from the
three needs directly, each explicitly checked against the same
legitimacy standard this course applies whenever a design pattern
touches on genuinely influencing user behavior — a standard Module 9
examines in much greater depth when it directly addresses the
persuasion/manipulation boundary.`,

    simpleHi: `**Teen concrete patterns jise ye lesson Module 7 ki theoretical
foundation (Lessons 1-2) se assemble karta hai:**

\`\`\`
1. GENUINE AUTONOMY SUPPORT KARO — users ko real, meaningful choice
   do is baat pe ki kaise proceed karna hai, options ke beech choice
   ki illusion nahi jo sab wahi outcome tak le jaate hain.

2. GENUINE COMPETENCE SUPPORT KARO — real progress aur skill growth
   pe clear, honest feedback provide karo, arbitrary points nahi jo
   actual improvement se disconnected hain.

3. GENUINE RELATEDNESS SUPPORT KARO — users ko doosre logon se ya ek
   meaningful shared purpose se connect karo, ek isolated, purely
   individual points tally nahi.
\`\`\`

**Pattern 1 ek concrete product context mein — genuine autonomy
versus uski illusion:**

\`\`\`tsx
// FALSE autonomy — multiple paths jo sab identical outcome tak
// converge karte hain, choice ki appearance dete hue substance ke bina
function OnboardingFalseChoice() {
  return (
    <div>
      <button onClick={() => goToStep2WithDefaultSettings()}>Quick setup</button>
      <button onClick={() => goToStep2WithDefaultSettings()}>Custom setup</button>
      {/* Dono buttons WAHI outcome tak le jaate hain — "choice" illusory hai */}
    </div>
  );
}

// GENUINE autonomy — choice actually meaningfully different, user-
// determined outcomes tak le jaati hai
function OnboardingGenuineChoice() {
  return (
    <div>
      <button onClick={() => applyRecommendedDefaults()}>Use recommended settings</button>
      <button onClick={() => goToCustomizationFlow()}>Customize every setting myself</button>
      {/* Ye genuinely different experiences tak le jaate hain,
          actually user ki apni choice se determined */}
    </div>
  );
}
\`\`\`

**Pattern 2 ek concrete product context mein — genuine competence
feedback versus arbitrary points:**

\`\`\`tsx
// Arbitrary points, real skill ya progress se disconnected
function ArbitraryPointsFeedback({ points }) {
  return <p>You earned 50 points!</p>; // kisi bhi actual, meaningful
  // improvement se koi connection nahi jise user apne mein recognize kar sake
}

// Genuine competence feedback, real, specific improvement se tied
function GenuineCompetenceFeedback({ skillBefore, skillAfter, specificImprovement }) {
  return (
    <p>
      Your query response time improved from {skillBefore}ms to {skillAfter}ms
      — {specificImprovement} {/* ek specific, real, recognizable improvement,
          ek arbitrary number actual skill se disconnected nahi */}
    </p>
  );
}
\`\`\`

**Pattern 3 ek concrete product context mein — genuine relatedness
versus ek isolated leaderboard:**

\`\`\`tsx
// Ek isolated leaderboard — purely comparative, koi genuine connection nahi
function IsolatedLeaderboard({ rankings }) {
  return <ol>{rankings.map((r) => <li key={r.id}>{r.name}: {r.score}</li>)}</ol>;
  // Purely comparative ranking — logon ko ek doosre se ya shared
  // purpose se connect nahi karta, sirf unhe ek doosre ke against rank karta hai
}

// Genuine relatedness — users ko real collaboration aur shared
// purpose se connect karna, sirf comparative ranking nahi
function GenuineTeamConnection({ teamContributions, sharedGoal }) {
  return (
    <div>
      <p>Your team is {sharedGoal.progressPercent}% toward: {sharedGoal.description}</p>
      <p>{teamContributions.map((c) => \`\${c.name} contributed \${c.description}\`).join(', ')}</p>
      {/* Individual contributions ko genuinely ek shared, meaningful
          team goal se connect karta hai — relatedness, pure comparison nahi */}
    </div>
  );
}
\`\`\`

**Sab teen patterns ko wahi legitimacy test kyun pass karna chahiye
jise Module 6 ka Lesson 3 ne choice architecture ke liye establish
kiya — do modules ke beech ek direct, explicit connection:**

\`\`\`ts
function isMotivationDesignLegitimate(pattern) {
  return (
    pattern.choiceIsGenuinelyMeaningfulNotIllusory && // Module 6 ka
    // "genuinely accessible alternatives" principle autonomy pe applied
    pattern.feedbackReflectsRealProgressNotArbitraryMetrics &&
    pattern.connectionIsGenuineNotPurelyComparative
  );
  // Ek pattern jo is test mein fail hota hai intrinsic motivation
  // support karne se ya to overjustification risk (Lesson 2) ya
  // manipulation risk mein drift ho gaya hai jise Module 9 directly
  // examine karta hai
}
\`\`\`

**Ye lesson Module 7 ko kaise close karta hai:** Lesson 1 ne
theoretical foundation establish ki (SDT ke teen needs, intrinsic/
extrinsic distinction). Lesson 2 ne naive gamification ka specific
failure mode establish kiya jo us foundation ko undermine karta hai.
Ye lesson constructive alternative assemble karke module ko complete
karta hai: concrete, implementable patterns jo teen needs se directly
genuine, durable engagement build karte hain, har ek explicitly wahi
legitimacy standard ke against checked jise ye course apply karta hai
jab bhi ek design pattern genuinely user behavior ko influence karne
ko touch karta hai — ek standard jise Module 9 kaafi zyada depth mein
examine karta hai jab ye directly persuasion/manipulation boundary ko
address karta hai.`,

    content: `## Why genuine autonomy support requires meaningfully different
outcomes, not merely the appearance of multiple options

A choice only genuinely supports autonomy if the options actually lead
to different, user-determined outcomes — presenting multiple buttons
or paths that all converge to the identical result provides the
visual appearance of choice without its psychological substance, and
users tend to recognize this at some level even if they can't
articulate why the "choice" felt hollow. Genuine autonomy support
requires the underlying options to actually diverge in a way that
reflects the user's own decision, connecting directly to Module 6's
established principle that legitimate choice architecture requires
alternatives to be genuinely, substantively real, not merely present.

## Why genuine competence feedback must reflect real, specific
progress rather than arbitrary, disconnected metrics

Competence support requires feedback that genuinely reflects a real
change in skill or capability — a specific, recognizable improvement
the person can verify against their own actual experience (their code
runs faster, their queries return more relevant results, a task takes
noticeably less effort than it used to). Arbitrary points disconnected
from any real, verifiable improvement fail to support genuine
competence, since there's no actual skill growth for the person to
recognize in themselves — they can accumulate points without
experiencing any real sense of getting better at something that
matters, which is precisely the risk Lesson 2's overjustification
research identifies.

## Why genuine relatedness requires real connection to people or
shared purpose, not purely comparative ranking

Relatedness is about genuine connection and belonging, not comparison
for its own sake — a pure leaderboard, ranking individuals against
each other with no reference to shared purpose or collaboration, can
actually work against relatedness by framing other people as
competitors rather than as a community. Genuine relatedness support
requires connecting a person's individual contribution to something
shared and meaningful — a team's collective progress toward a goal
that matters, genuine recognition of how one person's work helped
another — rather than a purely individualistic ranking that happens to
display other people's names.

## Why all three patterns must pass Module 6's legitimacy test —
the direct, explicit bridge between the two modules

Module 6 established that any design pattern touching on user choice
must meet a specific legitimacy standard: genuine accessibility of
alternatives, a default serving genuine user interest, and honest,
non-misleading presentation. This lesson's three motivation-supporting
patterns are subject to the identical standard, since they equally
involve shaping user behavior and experience — a "choice" that's
illusory, "feedback" that's fabricated, or a "connection" that's
manufactured to manipulate rather than genuinely serve the user fails
this test in exactly the way Module 6 established, and represents
exactly the line Module 9 examines in much greater depth when it
directly addresses where legitimate persuasion ends and dark patterns
begin.

## How this lesson closes Module 7

This lesson completes Module 7's arc: Lesson 1 established the
theoretical foundation of what genuinely sustains motivation, Lesson 2
established the specific, well-documented way naive engagement design
can undermine that foundation, and this lesson assembles the
constructive alternative — concrete, implementable patterns that build
engagement from the genuine psychological needs SDT identifies, held
to the same legitimacy standard this course applies to any design
pattern that shapes user behavior and experience.`,

    contentHi: `## Genuine autonomy support ko kyun meaningfully different outcomes chahiye, sirf multiple options ki appearance nahi

Ek choice genuinely autonomy ko support karti hai sirf tab jab options
actually different, user-determined outcomes tak le jaayein — multiple
buttons ya paths present karna jo sab identical result tak converge
karte hain choice ki visual appearance provide karta hai uske
psychological substance ke bina, aur users kisi level pe ise recognize
karne ki tendency rakhte hain even agar wo articulate na kar sakein ki
"choice" kyun hollow feel hui. Genuine autonomy support ko underlying
options ko actually is tarike se diverge karna chahiye jo user ke apne
decision ko reflect kare, directly Module 6 ke established principle
se connect karte hue ki legitimate choice architecture ko alternatives
genuinely, substantively real chahiye, sirf present nahi.

## Genuine competence feedback ko real, specific progress reflect karna kyun chahiye arbitrary, disconnected metrics ke bajaye

Competence support ko aisi feedback chahiye jo skill ya capability
mein ek real change ko genuinely reflect kare — ek specific,
recognizable improvement jise insaan apne actual experience ke against
verify kar sake (unka code faster run karta hai, unke queries zyada
relevant results return karte hain, ek task ko noticeably kam effort
lagta hai us se jitna pehle lagta tha). Arbitrary points kisi bhi real,
verifiable improvement se disconnected genuine competence support
karne mein fail hote hain, kyunki koi actual skill growth nahi hai
insaan ke apne mein recognize karne ke liye — wo koi bhi real sense of
getting better at something that matters experience kiye bina points
accumulate kar sakte hain, jo precisely wo risk hai jise Lesson 2 ki
overjustification research identify karti hai.

## Genuine relatedness ko real connection to people ya shared purpose kyun chahiye, purely comparative ranking nahi

Relatedness genuine connection aur belonging ke baare mein hai, apne
aap ke liye comparison ke baare mein nahi — ek pure leaderboard,
individuals ko ek doosre ke against rank karte hue koi shared purpose
ya collaboration ke reference ke bina, actually relatedness ke against
kaam kar sakta hai doosre logon ko competitors ki tarah frame karke ek
community ke bajaye. Genuine relatedness support ko ek insaan ke
individual contribution ko kisi shared aur meaningful cheez se connect
karna chahiye — ek team ki collective progress ek goal ki taraf jo
matter karta hai, genuine recognition ki ek insaan ke kaam ne doosre
ki kaise help ki — ek purely individualistic ranking ke bajaye jo
happen se doosre logon ke naam display karti hai.

## Sab teen patterns ko Module 6 ka legitimacy test kyun pass karna chahiye — do modules ke beech direct, explicit bridge

Module 6 ne establish kiya ki koi bhi design pattern jo user choice ko
touch karta hai ek specific legitimacy standard meet karna chahiye:
alternatives ki genuine accessibility, ek default jo genuine user
interest serve karta hai, aur honest, non-misleading presentation. Is
lesson ke teen motivation-supporting patterns wahi standard ke subject
hain, kyunki wo equally user behavior aur experience ko shape karna
involve karte hain — ek "choice" jo illusory hai, "feedback" jo
fabricated hai, ya ek "connection" jo user ko genuinely serve karne ke
bajaye manipulate karne ke liye manufactured hai exactly us tarike se
is test mein fail hoti hai jise Module 6 ne establish kiya, aur exactly
wo line represent karti hai jise Module 9 kaafi zyada depth mein
examine karta hai jab ye directly address karta hai ki legitimate
persuasion kahan khatam hoti hai aur dark patterns kahan shuru hote
hain.

## Ye lesson Module 7 ko kaise close karta hai

Ye lesson Module 7 ke arc ko complete karta hai: Lesson 1 ne
theoretical foundation establish ki is baat ki ki kya genuinely
motivation ko sustain karta hai, Lesson 2 ne specific, well-documented
tareeka establish kiya jise naive engagement design us foundation ko
undermine kar sakta hai, aur ye lesson constructive alternative
assemble karta hai — concrete, implementable patterns jo genuine
psychological needs se engagement build karte hain jinhe SDT identify
karti hai, wahi legitimacy standard ke against held jise ye course
kisi bhi design pattern pe apply karta hai jo user behavior aur
experience ko shape karta hai.`,

    examples: [
      {
        title: 'A complete feature combining all three motivation-supporting patterns with a legitimacy check',
        titleHi: 'Ek complete feature jo sab teen motivation-supporting patterns ko ek legitimacy check ke saath combine karta hai',
        codeJs: `function isMotivationDesignLegitimate(pattern) {
  return (
    pattern.choiceIsGenuinelyMeaningfulNotIllusory &&
    pattern.feedbackReflectsRealProgressNotArbitraryMetrics &&
    pattern.connectionIsGenuineNotPurelyComparative
  );
}

function LearningPlatformFeature({ user, teamGoal }) {
  return (
    <div>
      {/* AUTONOMY: genuinely different learning paths, not converging options */}
      <PathSelector
        options={[
          { id: 'deep_dive', label: 'Deep dive into one topic', leadsTo: 'specialized_track' },
          { id: 'broad_survey', label: 'Broad survey of many topics', leadsTo: 'general_track' },
        ]}
      />

      {/* COMPETENCE: specific, real, verifiable progress feedback */}
      <ProgressFeedback>
        Your debugging speed on this class of problem improved from
        {user.previousAvgMinutes} to {user.currentAvgMinutes} minutes.
      </ProgressFeedback>

      {/* RELATEDNESS: genuine connection to a shared, meaningful team goal */}
      <TeamContext>
        Your team is {teamGoal.progressPercent}% toward {teamGoal.description}.
        Your recent work on {user.recentContribution} moved this forward.
      </TeamContext>
    </div>
  );
}

const legitimacyCheck = isMotivationDesignLegitimate({
  choiceIsGenuinelyMeaningfulNotIllusory: true, // paths genuinely diverge
  feedbackReflectsRealProgressNotArbitraryMetrics: true, // real, measured skill change
  connectionIsGenuineNotPurelyComparative: true, // tied to shared goal, not just ranking
});`,
        codeTs: `interface MotivationPattern {
  choiceIsGenuinelyMeaningfulNotIllusory: boolean;
  feedbackReflectsRealProgressNotArbitraryMetrics: boolean;
  connectionIsGenuineNotPurelyComparative: boolean;
}

function isMotivationDesignLegitimate(pattern: MotivationPattern): boolean {
  return (
    pattern.choiceIsGenuinelyMeaningfulNotIllusory &&
    pattern.feedbackReflectsRealProgressNotArbitraryMetrics &&
    pattern.connectionIsGenuineNotPurelyComparative
  );
}

interface User {
  previousAvgMinutes: number;
  currentAvgMinutes: number;
  recentContribution: string;
}

interface TeamGoal {
  progressPercent: number;
  description: string;
}

function LearningPlatformFeature({ user, teamGoal }: { user: User; teamGoal: TeamGoal }) {
  return (
    <div>
      {/* AUTONOMY: genuinely different learning paths, not converging options */}
      <PathSelector
        options={[
          { id: 'deep_dive', label: 'Deep dive into one topic', leadsTo: 'specialized_track' },
          { id: 'broad_survey', label: 'Broad survey of many topics', leadsTo: 'general_track' },
        ]}
      />

      {/* COMPETENCE: specific, real, verifiable progress feedback */}
      <ProgressFeedback>
        Your debugging speed on this class of problem improved from
        {user.previousAvgMinutes} to {user.currentAvgMinutes} minutes.
      </ProgressFeedback>

      {/* RELATEDNESS: genuine connection to a shared, meaningful team goal */}
      <TeamContext>
        Your team is {teamGoal.progressPercent}% toward {teamGoal.description}.
        Your recent work on {user.recentContribution} moved this forward.
      </TeamContext>
    </div>
  );
}

const legitimacyCheck = isMotivationDesignLegitimate({
  choiceIsGenuinelyMeaningfulNotIllusory: true, // paths genuinely diverge
  feedbackReflectsRealProgressNotArbitraryMetrics: true, // real, measured skill change
  connectionIsGenuineNotPurelyComparative: true, // tied to shared goal, not just ranking
});`,
        code: `// All three SDT needs addressed with genuine, checkable substance —
// not illusory choice, not arbitrary points, not pure comparison`,
        output:
          "The feature presents a genuine choice with divergent outcomes, feedback tied to a real, measured skill improvement the user can verify against their own experience, and a connection between individual work and a meaningful shared team goal — passing the legitimacy check on all three counts, in contrast to a design relying on converging options, arbitrary points, and a pure leaderboard.",
        explain:
          "This example assembles all three of the lesson's patterns into one coherent feature and explicitly runs the legitimacy check against each, demonstrating the module's full arc: genuine psychological needs, identified in Lesson 1, protected from the specific failure mode in Lesson 2, and supported through concrete, checkable design substance here.",
        explainHi:
          "Ye example lesson ke teenon patterns ko ek coherent feature mein assemble karta hai aur explicitly har ek ke against legitimacy check run karta hai, module ke poore arc ko demonstrate karte hue: genuine psychological needs, Lesson 1 mein identify ki gayi, Lesson 2 mein specific failure mode se protected, aur yahan concrete, checkable design substance ke through supported.",
      },
    ],

    mistakes: [
      {
        wrong: `// A feature that presents the appearance of all three SDT-supporting
// patterns, but each one is hollow on inspection
function HollowMotivationDesignWrong() {
  return (
    <div>
      {/* Fake autonomy — both paths lead to the same place */}
      <button onClick={() => goToStep2()}>Path A</button>
      <button onClick={() => goToStep2()}>Path B</button>

      {/* Fake competence — an arbitrary number with no real meaning */}
      <p>You earned 120 XP!</p>

      {/* Fake relatedness — a pure ranking with no shared purpose */}
      <p>You are #4 out of 200 users this week.</p>
    </div>
  );
}`,
        right: `// Genuine versions of all three patterns, each with real substance
function GenuineMotivationDesignRight({ user, teamGoal }) {
  return (
    <div>
      {/* Genuine autonomy — paths genuinely diverge */}
      <button onClick={() => goToSpecializedTrack()}>Deep dive into one topic</button>
      <button onClick={() => goToGeneralTrack()}>Broad survey of many topics</button>

      {/* Genuine competence — specific, real, verifiable improvement */}
      <p>Your debugging speed improved from {user.before}min to {user.after}min.</p>

      {/* Genuine relatedness — tied to shared, meaningful progress */}
      <p>Your team is {teamGoal.progressPercent}% toward {teamGoal.description}.</p>
    </div>
  );
}`,
        why: "A pattern that superficially resembles autonomy, competence, or relatedness support but lacks genuine substance (converging paths, arbitrary numbers, purely comparative ranking) fails to actually satisfy the underlying psychological need — it risks the same overjustification and manipulation concerns this module and Module 6 both identify, since the design creates an appearance without the reality it's meant to reflect.",
        whyHi:
          "Ek pattern jo superficially autonomy, competence, ya relatedness support jaisa dikhta hai par genuine substance nahi rakhta (converging paths, arbitrary numbers, purely comparative ranking) actually underlying psychological need ko satisfy karne mein fail hota hai — ye wahi overjustification aur manipulation concerns risk karta hai jise ye module aur Module 6 dono identify karte hain, kyunki design ek appearance create karta hai us reality ke bina jise ye reflect karne ke liye tha.",
      },
    ],

    realWorld: [
      {
        en: "A production coding-education platform replaced its generic XP-points system with specific, measured skill-progress feedback (actual time-to-solve improvements on comparable problem types) and genuine peer-collaboration features tied to shared learning goals — the redesign, grounded directly in SDT's three needs, measurably improved both short-term engagement and long-term (6-month) retention compared to the original points-based system.",
        hi: 'Ek production coding-education platform ne apna generic XP-points system replace kiya specific, measured skill-progress feedback ke saath (comparable problem types pe actual time-to-solve improvements) aur genuine peer-collaboration features shared learning goals se tied — redesign, SDT ke teen needs mein directly grounded, dono short-term engagement aur long-term (6-month) retention ko measurably improve kiya original points-based system ke compare mein.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does genuine autonomy support require options to actually diverge, rather than merely presenting multiple choices?',
        qHi: 'Genuine autonomy support ko options actually diverge karne ki kyun zaroorat hai, sirf multiple choices present karne ke bajaye?',
        a: "A choice only supports autonomy if the options lead to genuinely different, user-determined outcomes — multiple paths that all converge to the same result provide the visual appearance of choice without its psychological substance. Users tend to sense this hollowness even without being able to articulate it, connecting directly to Module 6's principle that legitimate choice requires genuinely accessible, substantively real alternatives.",
        aHi: 'Ek choice sirf autonomy support karti hai agar options genuinely different, user-determined outcomes tak le jaayein — multiple paths jo sab wahi result tak converge karte hain choice ki visual appearance provide karte hain uske psychological substance ke bina. Users is hollowness ko sense karne ki tendency rakhte hain ise articulate karne mein able hue bina bhi, directly Module 6 ke principle se connect karte hue ki legitimate choice ko genuinely accessible, substantively real alternatives chahiye.',
      },
      {
        q: "Why must all three motivation-supporting patterns pass the same legitimacy test Module 6 established for choice architecture?",
        qHi: 'Sab teen motivation-supporting patterns ko wahi legitimacy test kyun pass karna chahiye jise Module 6 ne choice architecture ke liye establish kiya?',
        a: "Because these patterns equally involve shaping user behavior and experience, they're subject to the same standard: genuine substance (not illusory choice, fabricated feedback, or manufactured connection) rather than a superficial appearance designed to manipulate. This is the direct bridge to Module 9's deeper examination of where legitimate persuasion ends and dark patterns begin.",
        aHi: 'Kyunki ye patterns equally user behavior aur experience ko shape karna involve karte hain, wo wahi standard ke subject hain: genuine substance (illusory choice, fabricated feedback, ya manufactured connection nahi) ek superficial appearance ke bajaye jo manipulate karne ke liye designed hai. Ye Module 9 ke deeper examination ka direct bridge hai is baat ka ki legitimate persuasion kahan khatam hoti hai aur dark patterns kahan shuru hote hain.',
      },
    ],

    exercises: [
      {
        task: "A fitness app shows users a 'streak' counter for consecutive days of app usage, alongside a generic 'You're on fire!' message with no specific information about actual fitness improvement. Using this lesson's three patterns, evaluate which SDT need (if any) this design genuinely supports, and propose a specific redesign that would better support competence.",
        taskHi: 'Ek fitness app users ko consecutive days of app usage ke liye ek \'streak\' counter dikhata hai, ek generic \'You\'re on fire!\' message ke saath koi specific information ke bina actual fitness improvement ke baare mein. Is lesson ke teen patterns use karke, evaluate karo ki kaunsa SDT need (agar koi hai) ye design genuinely support karta hai, aur ek specific redesign propose karo jo competence ko behtar support kare.',
        hint: "Check the streak counter against the competence pattern specifically: does it reflect any real, verifiable improvement in fitness ability, or does it only measure app-opening frequency, which is a different thing entirely?",
        hintHi: 'Streak counter ko competence pattern ke against specifically check karo: kya ye fitness ability mein koi real, verifiable improvement reflect karta hai, ya ye sirf app-opening frequency measure karta hai, jo ek poori tarah different cheez hai?',
      },
    ],

    keyTakeaways: [
      "Genuine autonomy support requires options that actually lead to different, user-determined outcomes, not the mere appearance of choice among converging paths.",
      "Genuine competence support requires feedback tied to real, verifiable skill or progress improvement, not arbitrary points disconnected from actual growth.",
      "Genuine relatedness support requires connecting individual contribution to shared, meaningful purpose or real collaboration, not purely comparative ranking.",
      "All three patterns must pass Module 6's legitimacy test (genuine substance, not superficial appearance) — the direct bridge to Module 9's deeper treatment of the persuasion/manipulation boundary, closing Module 7's arc from theory (Lesson 1) through failure mode (Lesson 2) to constructive design practice (this lesson).",
    ],
    keyTakeawaysHi: [
      'Genuine autonomy support ko un options ki zaroorat hai jo actually different, user-determined outcomes tak le jaayein, converging paths ke beech choice ki sirf appearance nahi.',
      'Genuine competence support ko real, verifiable skill ya progress improvement se tied feedback chahiye, arbitrary points nahi jo actual growth se disconnected hain.',
      'Genuine relatedness support ko individual contribution ko shared, meaningful purpose ya real collaboration se connect karna chahiye, purely comparative ranking nahi.',
      "Sab teen patterns ko Module 6 ka legitimacy test pass karna chahiye (genuine substance, superficial appearance nahi) — Module 9 ke persuasion/manipulation boundary ke deeper treatment ka direct bridge, Module 7 ke arc ko theory (Lesson 1) se failure mode (Lesson 2) se constructive design practice (ye lesson) tak close karte hue.",
    ],
  },
];
