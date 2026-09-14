/**
 * Psychology for Developers — Module 14: Designing for Stress & High-Stakes Contexts, lessons 1-3.
 *
 * Lesson 1: How cognition genuinely degrades under acute stress — the Yerkes-Dodson law and cognitive tunneling.
 * Lesson 2: Concrete design implications for medical and emergency interfaces specifically.
 * Lesson 3: Concrete design implications for financial and other high-stakes-transaction interfaces specifically.
 */

import type { CourseLesson } from './course-js-module1';

export const PSYCH_MODULE_14: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'psych-how-cognition-degrades-under-stress',
    title: 'How Cognition Genuinely Degrades Under Acute Stress',
    titleHi: 'Acute Stress Ke Andar Cognition Genuinely Kaise Degrade Hoti Hai',
    description:
      "The Yerkes-Dodson law and cognitive tunneling — well-documented findings that acute stress doesn't just make people 'less careful,' it measurably narrows attention, degrades working memory, and impairs decision quality in specific, predictable ways, extending Module 13's situational-state framing to its most extreme case.",
    descriptionHi:
      'Yerkes-Dodson law aur cognitive tunneling — well-documented findings ki acute stress logon ko sirf "less careful" nahi banata, ye specific, predictable tareekon se attention ko measurably narrow karta hai, working memory ko degrade karta hai, aur decision quality ko impair karta hai, Module 13 ke situational-state framing ko uske most extreme case tak extend karte hue.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A pilot's field of vision narrowing dramatically during a genuine in-flight emergency — well-documented as 'tunnel vision' in aviation psychology — where a normally observant pilot fails to notice an instrument or warning light directly in their peripheral view, not from carelessness or lack of training, but because acute stress genuinely, physiologically narrows the field of attentional focus.** Aviation psychology has extensively documented a specific, measurable phenomenon during genuine in-flight emergencies: pilots' effective field of attention narrows dramatically, a well-studied effect often literally called 'tunnel vision.' A pilot who would normally notice a secondary warning light or an instrument reading well within their peripheral awareness can genuinely fail to register it during an acute emergency — not because they became careless or forgot their training, but because acute stress produces a genuine, measurable narrowing of the scope of attention, concentrating cognitive resources on the perceived primary threat at the direct cost of peripheral awareness. This is precisely why aviation checklists, emergency procedures, and cockpit design are built around this well-documented finding rather than simply trusting pilots to 'stay focused' through willpower — physical checklists that force attention back to specific, sequential items, warning systems designed for maximum salience specifically because peripheral awareness cannot be relied upon under stress, and training that rehearses procedures until they require minimal working memory. This lesson establishes the same well-documented mechanism — the Yerkes-Dodson law's inverted-U relationship between stress and performance, and the specific phenomenon of cognitive tunneling — as it applies directly to software interfaces used during genuinely high-stakes, high-stress moments: a medical alert, a financial emergency, a security breach in progress, where a user's cognition is measurably narrowed in exactly the same well-documented way as that pilot's field of vision.",
      hi: 'ek pilot ka field of vision dramatically narrow hona ek genuine in-flight emergency ke dauran — aviation psychology mein "tunnel vision" ki tarah well-documented — jahan ek normally observant pilot ek instrument ya warning light ko notice karne mein fail hota hai jo directly unke peripheral view mein hai, carelessness ya training ki kami se nahi, balki kyunki acute stress genuinely, physiologically attentional focus ke field ko narrow karta hai. Aviation psychology ne extensively ek specific, measurable phenomenon document kiya hai genuine in-flight emergencies ke dauran: pilots ka effective field of attention dramatically narrow hota hai, ek well-studied effect jise aksar literally "tunnel vision" kaha jaata hai. Ek pilot jo normally ek secondary warning light ya ek instrument reading ko unke peripheral awareness ke andar hi notice karta, ek acute emergency ke dauran genuinely ise register karne mein fail ho sakta hai — is wajah se nahi ki wo careless ho gaye ya apni training bhool gaye, balki kyunki acute stress attention ke scope ka ek genuine, measurable narrowing produce karta hai, cognitive resources ko perceived primary threat pe concentrate karte hue peripheral awareness ki direct cost pe. Yahi exactly wajah hai aviation checklists, emergency procedures, aur cockpit design is well-documented finding ke around banaye jaate hain simply pilots pe trust karne ke bajaye ki wo willpower se "focused rahenge" — physical checklists jo attention ko specific, sequential items ki taraf force karti hain, warning systems jo maximum salience ke liye design kiye gaye hain specifically kyunki peripheral awareness pe stress ke andar rely nahi kiya ja sakta, aur training jo procedures ko tab tak rehearse karti hai jab tak unhe minimum working memory ki zaroorat na ho. Ye lesson wahi well-documented mechanism establish karta hai — Yerkes-Dodson law ka stress aur performance ke beech inverted-U relationship, aur cognitive tunneling ka specific phenomenon — jaise ye directly software interfaces pe apply hota hai jo genuinely high-stakes, high-stress moments ke dauran use hote hain: ek medical alert, ek financial emergency, ek security breach in progress, jahan ek user ki cognition exactly wahi well-documented tareeke se measurably narrowed hai jaise us pilot ka field of vision.',
    },

    simple: `**Why this lesson extends Module 13's situational-state framing to
its most extreme, well-documented case:**

\`\`\`
Module 13 established that temporary situational states (anxiety)
measurably reduce cognitive capacity, the same way permanent traits do.
Acute stress represents the most extreme end of this same spectrum —
well-documented, extensively studied, and predictable enough to have
its own named psychological principle (the Yerkes-Dodson law) and
named phenomenon (cognitive tunneling), rather than being a vague or
unpredictable degradation.
\`\`\`

**The Yerkes-Dodson law — a specific, well-documented inverted-U
relationship between stress/arousal and performance, not a simple
"more stress is always worse":**

\`\`\`
Performance improves as stress/arousal increases from very low levels
(mild alertness helps focus), peaks at a moderate level, then
DEGRADES as stress continues to increase beyond that point. This means
the relevant design question for a high-stakes interface is not "how
do I reduce all stress to zero" but specifically "how do I design for
users already past the peak, in the degrading region of this curve" —
exactly the situation in medical, financial, and emergency contexts.
\`\`\`

**A concrete, checkable model of cognitive tunneling's effect on
interface interaction — attention narrows specifically toward the
perceived primary task, at the direct cost of peripheral information:**

\`\`\`ts
function predictNoticedElements(interfaceElements, userStressLevel) {
  if (userStressLevel === 'acute') {
    // Cognitive tunneling: only the perceived primary task/threat
    // remains reliably noticed — everything else is at genuine risk
    // of being missed, not through carelessness
    return interfaceElements.filter((el) => el.isPerceivedPrimaryFocus);
  }
  return interfaceElements; // under normal stress, full attention scope
}
\`\`\`

**Why working memory collapses specifically under acute stress,
directly extending Module 1's working-memory findings to this extreme
case:**

\`\`\`
Under acute stress, the already-limited working-memory capacity Module
1 established (roughly 4 meaningful chunks) is further reduced — a
well-documented finding, not a metaphor. This means a multi-step
process requiring the user to hold several pieces of information in
mind simultaneously is measurably more likely to fail specifically
during the acute-stress moments where getting it right matters most.
\`\`\`

**A concrete, checkable implication — decision quality itself degrades
under acute stress, not just attention and memory, meaning a design
that requires careful evaluation of multiple options is specifically
mismatched to this state:**

\`\`\`ts
function assessDecisionCapacity(userStressLevel, decisionComplexity) {
  if (userStressLevel === 'acute' && decisionComplexity === 'high') {
    return {
      mismatch: true,
      recommendation: 'reduce to the single, clearest necessary action; defer complex choices to a calmer moment',
    };
  }
  return { mismatch: false };
}
\`\`\`

**Why this lesson doesn't contradict Module 6's decision-fatigue
findings but applies them at their most extreme, highest-stakes point:**

\`\`\`
Module 6 established that decision-making capacity is a limited
resource under ordinary conditions. This lesson establishes that the
SAME capacity is further, more severely reduced under acute stress —
the same underlying finding, at a more extreme point on the same
curve, requiring more aggressive application of the same
choice-architecture principles, not a different set of principles.
\`\`\`

**How this lesson opens Module 14:** having established in Module 13
that cognitive accessibility concerns situational states as much as
permanent traits, this lesson takes that principle to its most
extreme, well-documented case: acute stress. Lesson 2 applies these
findings concretely to medical and emergency interfaces specifically;
Lesson 3 applies them to financial and other high-stakes-transaction
interfaces, closing Part V.`,

    simpleHi: `**Ye lesson Module 13 ke situational-state framing ko uske most
extreme, well-documented case tak kaise extend karta hai:**

\`\`\`
Module 13 ne establish kiya ki temporary situational states (anxiety)
cognitive capacity ko measurably kam karte hain, wahi tareeke se jaise
permanent traits karte hain. Acute stress wahi spectrum ka most
extreme end represent karta hai — well-documented, extensively
studied, aur predictable enough ki iska apna named psychological
principle ho (Yerkes-Dodson law) aur named phenomenon (cognitive
tunneling), ek vague ya unpredictable degradation hone ke bajaye.
\`\`\`

**Yerkes-Dodson law — stress/arousal aur performance ke beech ek
specific, well-documented inverted-U relationship, ek simple "zyada
stress hamesha worse hai" nahi:**

\`\`\`
Performance improve hoti hai jaise stress/arousal bahut low levels se
increase hota hai (mild alertness focus mein help karti hai), ek
moderate level pe peak karta hai, phir DEGRADE hoti hai jaise stress
us point se aage continue increase karta hai. Iska matlab hai ki ek
high-stakes interface ke liye relevant design question "main sab stress
ko zero tak kaise kam karoon" nahi hai balki specifically "main un
users ke liye kaise design karoon jo already is curve ke peak se aage,
degrading region mein hain" — exactly wo situation jo medical,
financial, aur emergency contexts mein hoti hai.
\`\`\`

**Cognitive tunneling ke interface interaction pe effect ka ek
concrete, checkable model — attention specifically perceived primary
task ki taraf narrow hoti hai, peripheral information ki direct cost
pe:**

\`\`\`ts
function predictNoticedElements(interfaceElements, userStressLevel) {
  if (userStressLevel === 'acute') {
    // Cognitive tunneling: sirf perceived primary task/threat reliably
    // noticed rehta hai — baaki sab genuine risk mein hai miss hone ka,
    // carelessness se nahi
    return interfaceElements.filter((el) => el.isPerceivedPrimaryFocus);
  }
  return interfaceElements; // normal stress ke andar, full attention scope
}
\`\`\`

**Working memory specifically acute stress ke andar kyun collapse hoti
hai, directly Module 1 ke working-memory findings ko is extreme case
tak extend karte hue:**

\`\`\`
Acute stress ke andar, already-limited working-memory capacity jise
Module 1 ne establish kiya (roughly 4 meaningful chunks) further reduce
hoti hai — ek well-documented finding, ek metaphor nahi. Iska matlab hai
ek multi-step process jise user ko several pieces of information ek
saath mind mein hold karne ki zaroorat hai measurably zyada likely hai
fail hone ke liye specifically un acute-stress moments ke dauran jahan
sahi karna sabse zyada matter karta hai.
\`\`\`

**Ek concrete, checkable implication — decision quality khud acute
stress ke andar degrade hoti hai, sirf attention aur memory nahi,
matlab ek design jise multiple options ki careful evaluation chahiye
specifically is state se mismatched hai:**

\`\`\`ts
function assessDecisionCapacity(userStressLevel, decisionComplexity) {
  if (userStressLevel === 'acute' && decisionComplexity === 'high') {
    return {
      mismatch: true,
      recommendation: 'reduce to the single, clearest necessary action; defer complex choices to a calmer moment',
    };
  }
  return { mismatch: false };
}
\`\`\`

**Ye lesson Module 6 ke decision-fatigue findings ko kyun contradict
nahi karta balki unhe apne most extreme, highest-stakes point pe apply
karta hai:**

\`\`\`
Module 6 ne establish kiya ki decision-making capacity ordinary
conditions ke andar ek limited resource hai. Ye lesson establish karta
hai ki WAHI capacity acute stress ke andar further, more severely
reduce hoti hai — wahi underlying finding, wahi curve pe ek zyada
extreme point pe, wahi choice-architecture principles ka zyada
aggressive application maangte hue, ek different set of principles nahi.
\`\`\`

**Ye lesson Module 14 ko kaise open karta hai:** Module 13 mein ye
establish karne ke baad ki cognitive accessibility situational states
ke baare mein utni hi hai jitni permanent traits ke baare mein, ye
lesson us principle ko uske most extreme, well-documented case tak le
jaata hai: acute stress. Lesson 2 in findings ko specifically medical
aur emergency interfaces pe concretely apply karta hai; Lesson 3 unhe
financial aur doosre high-stakes-transaction interfaces pe apply karta
hai, Part V ko close karte hue.`,

    content: `## Why this lesson extends Module 13's situational-state framing to
its most extreme, well-documented case

Module 13 established that temporary situational states like anxiety
measurably reduce cognitive capacity in the same way permanent traits
do. Acute stress represents the most extreme point on this same
spectrum — extensively studied enough to have its own named
psychological principle (the Yerkes-Dodson law) and named phenomenon
(cognitive tunneling), rather than being a vague, unpredictable, or
purely anecdotal degradation. This lesson establishes these specific,
well-documented mechanisms as the foundation for Lessons 2-3's
concrete design implications.

## Why the Yerkes-Dodson law's inverted-U relationship reframes the
relevant design question for high-stakes interfaces

The Yerkes-Dodson law documents a specific, non-linear relationship:
performance improves as arousal or stress increases from low levels,
peaks at a moderate point, then measurably degrades as stress continues
to rise beyond that peak. This reframes the relevant question for
designers of high-stakes interfaces — the goal isn't to reduce all
stress to zero, since some baseline alertness genuinely helps
performance, but specifically to design for users who are already past
the peak, in the measurably degrading region of this curve, which is
the predictable condition in medical, financial, and emergency
contexts specifically.

## Why cognitive tunneling narrows attention specifically toward a
perceived primary focus, at a direct, measurable cost to peripheral
information

Cognitive tunneling, well-documented in aviation psychology and
related high-stakes fields, describes a genuine narrowing of the scope
of attention under acute stress: cognitive resources concentrate on
the perceived primary task or threat, at a direct and measurable cost
to peripheral awareness. This isn't a matter of carelessness or
insufficient training — it's a predictable, physiological response to
acute stress. The direct design implication is that any interface
element not within a user's perceived primary focus during an acute-
stress moment carries a genuine, elevated risk of being missed
entirely, regardless of its visual prominence under calmer conditions.

## Why working memory collapses specifically under acute stress,
extending Module 1's findings to this extreme case

Module 1 established that working memory holds a genuinely limited
number of meaningful chunks even under ordinary conditions. Acute
stress further reduces this already-limited capacity — a well-
documented finding, not a loose metaphor. This means any multi-step
process requiring a user to hold several pieces of information in mind
simultaneously is measurably more likely to fail specifically during
the acute-stress moments where succeeding matters most, directly
extending Module 1's foundational finding to its highest-stakes case.

## Why decision quality itself, not merely attention and memory,
degrades under acute stress

Beyond narrowed attention and reduced working memory, acute stress
measurably impairs the quality of decisions themselves — careful
weighing of multiple options becomes specifically harder precisely
when stress is highest. This means an interface requiring careful
evaluation of several choices is fundamentally mismatched to a user's
actual cognitive state during an acute-stress moment; the corrective
implication is to reduce the required decision to the single, clearest
necessary action and defer any genuinely complex choice to a calmer
moment when that's possible.

## Why this lesson extends, rather than contradicts, Module 6's
decision-fatigue findings

Module 6 established that decision-making capacity is a limited
resource even under ordinary conditions. This lesson doesn't introduce
a separate or contradictory principle — it establishes that the same
underlying capacity is further, more severely reduced under acute
stress, requiring the same choice-architecture principles Module 6
established to be applied more aggressively, not replaced with a
different framework.

## How this lesson opens Module 14

Having established in Module 13 that cognitive accessibility concerns
situational states as much as permanent traits, this lesson extends
that principle to its most extreme, well-documented case: acute
stress, via the Yerkes-Dodson law and cognitive tunneling. Lesson 2
applies these findings concretely to medical and emergency interfaces
specifically; Lesson 3 applies them to financial and other
high-stakes-transaction interfaces, closing Part V (Accessibility &
Inclusive Cognition).`,

    contentHi: `## Ye lesson Module 13 ke situational-state framing ko uske most extreme, well-documented case tak kyun extend karta hai

Module 13 ne establish kiya ki anxiety jaisi temporary situational
states cognitive capacity ko measurably kam karti hain wahi tareeke se
jaise permanent traits karte hain. Acute stress wahi spectrum ka most
extreme point represent karta hai — extensively studied enough ki
iska apna named psychological principle ho (Yerkes-Dodson law) aur
named phenomenon (cognitive tunneling), ek vague, unpredictable, ya
purely anecdotal degradation hone ke bajaye. Ye lesson in specific,
well-documented mechanisms ko Lessons 2-3 ke concrete design
implications ke liye foundation ki tarah establish karta hai.

## Yerkes-Dodson law ka inverted-U relationship high-stakes interfaces ke liye relevant design question ko kyun reframe karta hai

Yerkes-Dodson law ek specific, non-linear relationship document karta
hai: performance improve hoti hai jaise arousal ya stress low levels
se increase hota hai, ek moderate point pe peak karta hai, phir
measurably degrade hoti hai jaise stress us peak se aage rise continue
karta hai. Ye high-stakes interfaces ke designers ke liye relevant
question ko reframe karta hai — goal sab stress ko zero tak kam karna
nahi hai, kyunki kuch baseline alertness genuinely performance ko help
karta hai, balki specifically un users ke liye design karna hai jo
already peak se aage hain, is curve ke measurably degrading region
mein, jo specifically medical, financial, aur emergency contexts mein
predictable condition hai.

## Cognitive tunneling attention ko specifically ek perceived primary focus ki taraf kyun narrow karta hai, peripheral information ki ek direct, measurable cost pe

Cognitive tunneling, aviation psychology aur related high-stakes
fields mein well-documented, attention ke scope ka ek genuine
narrowing describe karta hai acute stress ke andar: cognitive
resources perceived primary task ya threat pe concentrate karte hain,
peripheral awareness ki ek direct aur measurable cost pe. Ye
carelessness ya insufficient training ka matter nahi hai — ye acute
stress ka ek predictable, physiological response hai. Direct design
implication ye hai ki koi bhi interface element jo ek user ke perceived
primary focus ke andar nahi hai ek acute-stress moment ke dauran ek
genuine, elevated risk carry karta hai completely miss hone ka,
calmer conditions ke andar uski visual prominence se independently.

## Working memory specifically acute stress ke andar kyun collapse hoti hai, Module 1 ke findings ko is extreme case tak extend karte hue

Module 1 ne establish kiya ki working memory ordinary conditions ke
andar bhi meaningful chunks ki ek genuinely limited number hold karti
hai. Acute stress is already-limited capacity ko further reduce karta
hai — ek well-documented finding, ek loose metaphor nahi. Iska matlab
hai koi bhi multi-step process jise ek user ko several pieces of
information ek saath mind mein hold karne ki zaroorat hai measurably
zyada likely hai fail hone ke liye specifically un acute-stress
moments ke dauran jahan succeed karna sabse zyada matter karta hai,
directly Module 1 ki foundational finding ko uske highest-stakes case
tak extend karte hue.

## Decision quality khud, sirf attention aur memory nahi, acute stress ke andar kyun degrade hoti hai

Narrowed attention aur reduced working memory ke aage, acute stress
decisions ki quality ko khud measurably impair karta hai — multiple
options ko carefully weigh karna specifically harder ban jaata hai
precisely jab stress sabse highest hai. Iska matlab hai ek interface
jise several choices ki careful evaluation chahiye ek user ki actual
cognitive state se ek acute-stress moment ke dauran fundamentally
mismatched hai; corrective implication ye hai ki required decision ko
single, clearest necessary action tak reduce karo aur koi bhi genuinely
complex choice ko ek calmer moment tak defer karo jab ye possible ho.

## Ye lesson Module 6 ke decision-fatigue findings ko kyun contradict nahi karta, unhe extend karta hai

Module 6 ne establish kiya ki decision-making capacity ordinary
conditions ke andar bhi ek limited resource hai. Ye lesson ek separate
ya contradictory principle introduce nahi karta — ye establish karta
hai ki wahi underlying capacity acute stress ke andar further, more
severely reduce hoti hai, wahi choice-architecture principles jise
Module 6 ne establish kiya zyada aggressively apply karne ki zaroorat
hote hue, ek different framework se replace kiye jaane ke bajaye.

## Ye lesson Module 14 ko kaise open karta hai

Module 13 mein ye establish karne ke baad ki cognitive accessibility
situational states ke baare mein utni hi hai jitni permanent traits ke
baare mein, ye lesson us principle ko uske most extreme, well-
documented case tak extend karta hai: acute stress, Yerkes-Dodson law
aur cognitive tunneling ke through. Lesson 2 in findings ko
specifically medical aur emergency interfaces pe concretely apply
karta hai; Lesson 3 unhe financial aur doosre high-stakes-transaction
interfaces pe apply karta hai, Part V (Accessibility & Inclusive
Cognition) ko close karte hue.`,

    examples: [
      {
        title: 'A cognitive-tunneling attention predictor and a decision-capacity assessor applied to a real emergency-alert scenario',
        titleHi: "Ek cognitive-tunneling attention predictor aur ek decision-capacity assessor jo ek real emergency-alert scenario pe applied hai",
        codeJs: `function predictNoticedElements(interfaceElements, userStressLevel) {
  if (userStressLevel === 'acute') {
    return interfaceElements.filter((el) => el.isPerceivedPrimaryFocus);
  }
  return interfaceElements;
}

function assessDecisionCapacity(userStressLevel, decisionComplexity) {
  if (userStressLevel === 'acute' && decisionComplexity === 'high') {
    return {
      mismatch: true,
      recommendation: 'reduce to the single, clearest necessary action; defer complex choices to a calmer moment',
    };
  }
  return { mismatch: false };
}

// A medical alert screen with a primary "call for help" button and
// three secondary informational links
const elements = [
  { name: 'call-for-help-button', isPerceivedPrimaryFocus: true },
  { name: 'medication-history-link', isPerceivedPrimaryFocus: false },
  { name: 'insurance-info-link', isPerceivedPrimaryFocus: false },
];

console.log(predictNoticedElements(elements, 'acute'));
// only 'call-for-help-button' — the secondary links are at genuine risk of being missed

console.log(assessDecisionCapacity('acute', 'high'));
// { mismatch: true, recommendation: '...' }`,
        codeTs: `interface InterfaceElement {
  name: string;
  isPerceivedPrimaryFocus: boolean;
}

type StressLevel = 'normal' | 'acute';
type DecisionComplexity = 'low' | 'high';

function predictNoticedElements(interfaceElements: InterfaceElement[], userStressLevel: StressLevel) {
  if (userStressLevel === 'acute') {
    return interfaceElements.filter((el) => el.isPerceivedPrimaryFocus);
  }
  return interfaceElements;
}

function assessDecisionCapacity(userStressLevel: StressLevel, decisionComplexity: DecisionComplexity) {
  if (userStressLevel === 'acute' && decisionComplexity === 'high') {
    return {
      mismatch: true,
      recommendation: 'reduce to the single, clearest necessary action; defer complex choices to a calmer moment',
    };
  }
  return { mismatch: false };
}

// A medical alert screen with a primary "call for help" button and
// three secondary informational links
const elements: InterfaceElement[] = [
  { name: 'call-for-help-button', isPerceivedPrimaryFocus: true },
  { name: 'medication-history-link', isPerceivedPrimaryFocus: false },
  { name: 'insurance-info-link', isPerceivedPrimaryFocus: false },
];

console.log(predictNoticedElements(elements, 'acute'));
// only 'call-for-help-button' — the secondary links are at genuine risk of being missed

console.log(assessDecisionCapacity('acute', 'high'));
// { mismatch: true, recommendation: '...' }`,
        code: `if (userStressLevel === 'acute') {
  return interfaceElements.filter((el) => el.isPerceivedPrimaryFocus);
}
// models cognitive tunneling: under acute stress, only the perceived primary focus is reliably noticed`,
        output:
          "The predictor correctly identifies that under acute stress, only the call-for-help button (the perceived primary focus) is reliably noticed, while the secondary informational links carry a genuine risk of being missed entirely — and the decision-capacity assessor correctly flags a high-complexity decision as mismatched to an acute-stress state, recommending the choice be reduced to a single clear action.",
        explain:
          "This example operationalizes both of the lesson's core mechanisms together: cognitive tunneling's narrowing of noticed elements, and the Yerkes-Dodson-law-driven degradation of decision quality — showing concretely why a medical alert screen with secondary links and multiple options would fail exactly the users it's designed to help most.",
        explainHi:
          "Ye example lesson ke dono core mechanisms ko saath mein operationalize karta hai: cognitive tunneling ka noticed elements ka narrowing, aur Yerkes-Dodson-law-driven decision quality ka degradation — concretely dikhate hue ki ek medical alert screen secondary links aur multiple options ke saath exactly un users ke liye kyun fail hoga jinhe ye sabse zyada help karne ke liye design kiya gaya hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// A medical emergency screen presenting multiple equally-weighted
// options and secondary information, assuming a user under acute
// stress will carefully read and evaluate all of it
function EmergencyScreenWrong() {
  return (
    <div>
      <button>Call emergency services</button>
      <button>View my medical history</button>
      <button>Contact my emergency contact</button>
      <button>Check my insurance coverage</button>
      <p>Note: response times may vary by region. See our FAQ for details.</p>
      {/* 4 equally-weighted options plus a secondary informational
          note — assumes full attentional scope and careful decision-
          making, both of which are compromised under acute stress */}
    </div>
  );
}`,
        right: `// A single, clear primary action, with secondary options
// deliberately de-emphasized and deferred
function EmergencyScreenRight() {
  return (
    <div>
      <button className="primary-huge">Call emergency services now</button>
      <details>
        <summary>Other options</summary>
        <button>View my medical history</button>
        <button>Contact my emergency contact</button>
      </details>
      {/* One unmistakable primary action matching cognitive tunneling's
          narrowed focus; secondary options are available but
          deliberately de-emphasized, not competing for attention */}
    </div>
  );
}`,
        why: "Presenting multiple equally-weighted options and secondary information assumes a user's full attentional scope and normal decision-making capacity, both of which are measurably compromised during an acute-stress moment per this lesson's findings — reducing to one unmistakable primary action, with everything else deliberately de-emphasized, matches the user's actual cognitive state.",
        whyHi:
          "Multiple equally-weighted options aur secondary information present karna ek user ke full attentional scope aur normal decision-making capacity ko assume karta hai, dono is lesson ki findings ke hisaab se ek acute-stress moment ke dauran measurably compromised hain — ek unmistakable primary action tak reduce karna, baaki sab deliberately de-emphasized ke saath, user ki actual cognitive state ke saath match karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A medical-alert wearable's companion app redesigned its emergency screen after user-research sessions simulating acute distress found participants consistently failed to notice or use secondary features (medical history, insurance info) that were visually present but not the primary focus — confirming cognitive tunneling directly and leading to a redesign with one dominant call-for-help action and everything else deliberately deferred behind a secondary disclosure.",
        hi: 'Ek medical-alert wearable ka companion app ne apna emergency screen redesign kiya user-research sessions ke baad jo acute distress simulate karte the paaya ki participants consistently secondary features (medical history, insurance info) ko notice ya use karne mein fail hue jo visually present the par primary focus nahi the — cognitive tunneling ko directly confirm karte hue aur ek redesign ki taraf le jaate hue ek dominant call-for-help action ke saath aur baaki sab deliberately ek secondary disclosure ke peeche deferred.',
      },
    ],

    interviewQA: [
      {
        q: "What does the Yerkes-Dodson law establish, and why does it reframe the design question for high-stakes interfaces from 'eliminate all stress' to something more specific?",
        qHi: 'Yerkes-Dodson law kya establish karta hai, aur ye high-stakes interfaces ke liye design question ko "sab stress eliminate karo" se kuch zyada specific mein kyun reframe karta hai?',
        a: "The Yerkes-Dodson law establishes a specific, non-linear inverted-U relationship: performance improves as stress rises from low levels, peaks at a moderate point, then measurably degrades beyond it. This reframes the design question specifically to how to design for users already past the peak, in the degrading region — the predictable condition in medical, financial, and emergency contexts.",
        aHi: 'Yerkes-Dodson law ek specific, non-linear inverted-U relationship establish karta hai: performance improve hoti hai jaise stress low levels se rise karta hai, ek moderate point pe peak karta hai, phir uske aage measurably degrade hoti hai. Ye design question ko specifically is baat mein reframe karta hai ki un users ke liye kaise design karein jo already peak se aage hain, degrading region mein — medical, financial, aur emergency contexts mein predictable condition.',
      },
      {
        q: "What is cognitive tunneling, and what specific design implication does it have for interface elements outside a user's perceived primary focus?",
        qHi: 'Cognitive tunneling kya hai, aur ek user ke perceived primary focus ke bahar interface elements ke liye iska kya specific design implication hai?',
        a: "Cognitive tunneling is a well-documented narrowing of attentional scope under acute stress, concentrating cognitive resources on the perceived primary task or threat at a direct cost to peripheral awareness. This means any interface element outside the perceived primary focus carries a genuine, elevated risk of being missed entirely during acute stress, regardless of its visual prominence under calmer conditions.",
        aHi: 'Cognitive tunneling attentional scope ka ek well-documented narrowing hai acute stress ke andar, cognitive resources ko perceived primary task ya threat pe concentrate karte hue peripheral awareness ki ek direct cost pe. Iska matlab hai koi bhi interface element jo perceived primary focus ke bahar hai acute stress ke dauran completely miss hone ka ek genuine, elevated risk carry karta hai, calmer conditions ke andar uski visual prominence se independently.',
      },
    ],

    exercises: [
      {
        task: "A password-reset flow for a financial app, designed to be used calmly at a desk, requires the user to simultaneously reference a code sent to their email, enter it correctly, remember their new password requirements, and confirm a security question — all on one screen. Using this lesson's framework, explain why this same flow would specifically fail a user in a genuine account-lockout emergency (acute stress), and what concrete redesign would address it.",
        taskHi: "Ek financial app ke liye ek password-reset flow, jo calmly ek desk pe use hone ke liye design kiya gaya hai, user ko simultaneously ek code reference karne ki zaroorat hai jo unke email pe bheja gaya, ise correctly enter karna, apni nayi password requirements yaad rakhna, aur ek security question confirm karna — sab ek screen pe. Is lesson ke framework use karke, explain karo ki wahi flow specifically ek user ko ek genuine account-lockout emergency (acute stress) mein kyun fail karega, aur kaunsa concrete redesign ise address karega.",
        hint: "Think about the specific working-memory demand of holding multiple pieces of information simultaneously (Module 1, extended by this lesson to acute stress), and how breaking the flow into sequential, single-focus steps would reduce that demand.",
        hintHi: 'Socho ki multiple pieces of information ko simultaneously hold karne ki specific working-memory demand kya hai (Module 1, is lesson dwara acute stress tak extend kiya gaya), aur flow ko sequential, single-focus steps mein break karna us demand ko kaise kam karega.',
      },
    ],

    keyTakeaways: [
      "Acute stress is the most extreme, well-documented point on the situational-cognitive-load spectrum Module 13 established — extensively studied enough to have named principles: the Yerkes-Dodson law and cognitive tunneling.",
      "The Yerkes-Dodson law's inverted-U relationship means the design goal isn't eliminating stress entirely, but designing specifically for users already past the performance peak, in the measurably degrading region.",
      "Cognitive tunneling narrows attention to a perceived primary focus, putting any peripheral interface element at genuine, elevated risk of being missed during acute stress, regardless of its visual prominence otherwise.",
      "Working memory and decision quality both degrade further under acute stress, extending Module 1's and Module 6's findings to their most extreme case — requiring more aggressive, not different, application of the same principles.",
    ],
    keyTakeawaysHi: [
      'Acute stress us situational-cognitive-load spectrum ka most extreme, well-documented point hai jise Module 13 ne establish kiya — extensively studied enough ki iske named principles hon: Yerkes-Dodson law aur cognitive tunneling.',
      'Yerkes-Dodson law ka inverted-U relationship ka matlab hai ki design goal stress ko entirely eliminate karna nahi hai, balki specifically un users ke liye design karna hai jo already performance peak se aage hain, measurably degrading region mein.',
      'Cognitive tunneling attention ko ek perceived primary focus tak narrow karta hai, kisi bhi peripheral interface element ko acute stress ke dauran completely miss hone ka genuine, elevated risk mein daalte hue, otherwise uski visual prominence se independently.',
      'Working memory aur decision quality dono acute stress ke andar further degrade hoti hain, Module 1 aur Module 6 ki findings ko unke most extreme case tak extend karte hue — wahi principles ka zyada aggressive, different nahi, application maangte hue.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'psych-medical-emergency-interface-design',
    title: 'Concrete Design for Medical & Emergency Interfaces',
    titleHi: 'Medical & Emergency Interfaces Ke Liye Concrete Design',
    description:
      "Applying Lesson 1's stress-cognition findings to their highest-stakes case: interfaces used during genuine medical emergencies, where cognitive tunneling and working-memory collapse have life-consequential design implications, not merely inconvenient ones.",
    descriptionHi:
      'Lesson 1 ke stress-cognition findings ko unke highest-stakes case pe apply karte hue: interfaces jo genuine medical emergencies ke dauran use hote hain, jahan cognitive tunneling aur working-memory collapse ke life-consequential design implications hain, sirf inconvenient wale nahi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**An emergency room's defibrillator, deliberately designed with a single large button, spoken step-by-step voice guidance, and unambiguous visual indicators — designed this way specifically because it must be usable correctly by a bystander with zero training, in the single most acute-stress moment a person can experience.** Automated external defibrillators are a deliberate, well-documented design case study in exactly this lesson's principles: the device must be usable correctly by an untrained bystander in a genuine cardiac emergency — arguably the single most acute-stress scenario an ordinary person can face — where cognitive tunneling and working-memory collapse are at their most extreme. Rather than assuming the bystander will calmly read a multi-step instruction manual, the device is engineered around exactly the opposite assumption: it speaks step-by-step instructions aloud in plain language, presents a single unmistakable action at each step, and uses unambiguous, high-salience visual and audio indicators rather than subtle cues that could easily be missed under tunneled attention. This isn't a hypothetical design ideal — it's a documented, life-or-death engineering decision made specifically because designers understood Lesson 1's findings about acute stress and built the device around the user's ACTUAL cognitive state in the moment of use, not an idealized calm state. This lesson applies that identical principle to software interfaces used during genuine medical and emergency moments — a health app's emergency contact flow, a hospital patient-portal's urgent-symptom reporting, an insurance app's claims process after an accident — treating the same well-documented stress-cognition findings as load-bearing design requirements, not optional nice-to-haves.",
      hi: 'ek emergency room ka defibrillator, deliberately ek single large button, spoken step-by-step voice guidance, aur unambiguous visual indicators ke saath design kiya gaya — is tarike se specifically is wajah se design kiya gaya kyunki ise correctly usable hona chahiye ek bystander dwara zero training ke saath, us single most acute-stress moment mein jo ek insaan experience kar sakta hai. Automated external defibrillators exactly is lesson ke principles ka ek deliberate, well-documented design case study hain: device ko ek untrained bystander dwara correctly usable hona chahiye ek genuine cardiac emergency mein — arguably wo single most acute-stress scenario jo ek ordinary insaan face kar sakta hai — jahan cognitive tunneling aur working-memory collapse apne most extreme pe hain. Bystander calmly ek multi-step instruction manual padhega ye assume karne ke bajaye, device exactly opposite assumption ke around engineered hai: ye plain language mein step-by-step instructions aloud speak karta hai, har step pe ek unmistakable action present karta hai, aur unambiguous, high-salience visual aur audio indicators use karta hai subtle cues ke bajaye jo tunneled attention ke andar easily miss ho sakte the. Ye ek hypothetical design ideal nahi hai — ye ek documented, life-or-death engineering decision hai jo specifically is wajah se liya gaya kyunki designers ne Lesson 1 ki findings acute stress ke baare mein samjhi aur device ko user ke ACTUAL cognitive state ke around banaya use ke moment mein, ek idealized calm state nahi. Ye lesson wahi identical principle software interfaces pe apply karta hai jo genuine medical aur emergency moments ke dauran use hote hain — ek health app ka emergency contact flow, ek hospital patient-portal ka urgent-symptom reporting, ek insurance app ka claims process ek accident ke baad — wahi well-documented stress-cognition findings ko load-bearing design requirements ki tarah treat karte hue, optional nice-to-haves nahi.',
    },

    simple: `**Why AED design is a concrete, deliberate case study in this
lesson's stress-cognition findings, rather than a hypothetical ideal:**

\`\`\`
An automated external defibrillator must be usable correctly by an
untrained bystander during a genuine cardiac emergency — the most
acute-stress scenario an ordinary person is likely to face. Its design
(single large button, spoken step-by-step guidance, unambiguous
indicators) is engineered specifically around Lesson 1's findings
about cognitive tunneling and working-memory collapse, not around an
idealized calm user.
\`\`\`

**A concrete, checkable pattern — a single, unmistakable primary
action per screen, directly applying Lesson 1's cognitive-tunneling
finding to a medical-app emergency flow:**

\`\`\`tsx
function EmergencyContactFlowWrong() {
  return (
    <div>
      <button>Call 911</button>
      <button>Text my emergency contact</button>
      <button>Open my medical ID</button>
      <button>Share my location</button>
      {/* 4 competing options, none visually dominant — mismatched to
          a cognitively-tunneled user who will reliably notice only
          their perceived primary focus */}
    </div>
  );
}

function EmergencyContactFlowRight() {
  return (
    <div>
      <button className="primary-huge" autoFocus>Call 911 now</button>
      <p className="secondary-small">Or: text contact, share location, view medical ID</p>
      {/* One unmistakable primary action matches the user's actual,
          narrowed attentional scope under acute stress */}
    </div>
  );
}
\`\`\`

**A concrete, checkable pattern — step-by-step guidance requiring
minimal working memory, directly extending Lesson 1's working-memory
collapse finding:**

\`\`\`tsx
function CPRGuidanceWrong({ allSteps }) {
  return <ol>{allSteps.map((s) => <li key={s.id}>{s.text}</li>)}</ol>;
  // Presents the full sequence at once, requiring the user to hold
  // their place in a multi-step list under acute stress
}

function CPRGuidanceRight({ currentStep, totalSteps }) {
  return (
    <div>
      <p className="step-count">Step {currentStep.number} of {totalSteps}</p>
      <p className="step-instruction-huge">{currentStep.text}</p>
      <button onClick={currentStep.onComplete}>Done — next step</button>
      {/* One step at a time — zero working-memory burden of tracking
          position in a longer sequence */}
    </div>
  );
}
\`\`\`

**A concrete, checkable pattern — high-salience, redundant indicators
rather than subtle visual cues, since subtle cues are specifically at
risk of being missed under cognitive tunneling:**

\`\`\`ts
function auditAlertSalience(alert) {
  const isHighSalience = alert.hasAudio && alert.hasVisualFlash && alert.hasHapticFeedback;
  return {
    isHighSalience,
    recommendation: isHighSalience
      ? 'passes — redundant across multiple senses, robust to narrowed attention'
      : 'fails — a single subtle channel risks being missed under cognitive tunneling',
  };
}
\`\`\`

**A concrete, checkable pattern — plain, unambiguous language over
clinical or technical jargon, since interpreting ambiguous terminology
requires cognitive capacity that's specifically degraded under stress:**

\`\`\`tsx
function ErrorMessageWrong() {
  return <p>Error: geolocation permission denied (code 1)</p>;
}

function ErrorMessageRight() {
  return <p>We can't find your location. Tap here to turn on location access, or enter your address manually.</p>;
  // Plain language plus a clear, immediate next action — doesn't
  // require the user to interpret a technical error code under stress
}
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established the
Yerkes-Dodson law and cognitive tunneling as the mechanisms by which
acute stress degrades cognition. This lesson applies those mechanisms
concretely to medical and emergency interfaces, using the AED as a
deliberate, real-world design precedent — Lesson 3 applies the
identical standard to financial and other high-stakes-transaction
interfaces, closing Part V.`,

    simpleHi: `**AED design is lesson ke stress-cognition findings ka ek concrete,
deliberate case study kyun hai, ek hypothetical ideal nahi:**

\`\`\`
Ek automated external defibrillator ko correctly usable hona chahiye
ek untrained bystander dwara ek genuine cardiac emergency ke dauran —
wo most acute-stress scenario jo ek ordinary insaan face karne ki
likelihood rakhta hai. Iska design (single large button, spoken
step-by-step guidance, unambiguous indicators) specifically Lesson 1
ki findings ke around engineered hai cognitive tunneling aur working-
memory collapse ke baare mein, ek idealized calm user ke around nahi.
\`\`\`

**Ek concrete, checkable pattern — ek single, unmistakable primary
action per screen, directly Lesson 1 ke cognitive-tunneling finding
ko ek medical-app emergency flow pe apply karte hue:**

\`\`\`tsx
function EmergencyContactFlowWrong() {
  return (
    <div>
      <button>Call 911</button>
      <button>Text my emergency contact</button>
      <button>Open my medical ID</button>
      <button>Share my location</button>
      {/* 4 competing options, koi bhi visually dominant nahi —
          ek cognitively-tunneled user se mismatched jo reliably sirf
          apna perceived primary focus notice karega */}
    </div>
  );
}

function EmergencyContactFlowRight() {
  return (
    <div>
      <button className="primary-huge" autoFocus>Call 911 now</button>
      <p className="secondary-small">Or: text contact, share location, view medical ID</p>
      {/* Ek unmistakable primary action user ki actual, narrowed
          attentional scope se match karta hai acute stress ke andar */}
    </div>
  );
}
\`\`\`

**Ek concrete, checkable pattern — step-by-step guidance jise minimal
working memory chahiye, directly Lesson 1 ke working-memory collapse
finding ko extend karte hue:**

\`\`\`tsx
function CPRGuidanceWrong({ allSteps }) {
  return <ol>{allSteps.map((s) => <li key={s.id}>{s.text}</li>)}</ol>;
  // Full sequence ek saath present karta hai, user ko acute stress
  // ke andar ek multi-step list mein apni jagah hold karne ki zaroorat
  // dete hue
}

function CPRGuidanceRight({ currentStep, totalSteps }) {
  return (
    <div>
      <p className="step-count">Step {currentStep.number} of {totalSteps}</p>
      <p className="step-instruction-huge">{currentStep.text}</p>
      <button onClick={currentStep.onComplete}>Done — next step</button>
      {/* Ek time pe ek step — ek longer sequence mein position track
          karne ka zero working-memory burden */}
    </div>
  );
}
\`\`\`

**Ek concrete, checkable pattern — high-salience, redundant indicators
subtle visual cues ke bajaye, kyunki subtle cues specifically cognitive
tunneling ke andar miss hone ke risk mein hain:**

\`\`\`ts
function auditAlertSalience(alert) {
  const isHighSalience = alert.hasAudio && alert.hasVisualFlash && alert.hasHapticFeedback;
  return {
    isHighSalience,
    recommendation: isHighSalience
      ? 'passes — redundant across multiple senses, robust to narrowed attention'
      : 'fails — a single subtle channel risks being missed under cognitive tunneling',
  };
}
\`\`\`

**Ek concrete, checkable pattern — plain, unambiguous language
clinical ya technical jargon ke upar, kyunki ambiguous terminology ko
interpret karne ke liye cognitive capacity chahiye jo specifically
stress ke andar degraded hai:**

\`\`\`tsx
function ErrorMessageWrong() {
  return <p>Error: geolocation permission denied (code 1)</p>;
}

function ErrorMessageRight() {
  return <p>We can't find your location. Tap here to turn on location access, or enter your address manually.</p>;
  // Plain language plus ek clear, immediate next action — user ko ek
  // technical error code interpret karne ki zaroorat nahi hai stress
  // ke andar
}
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne
Yerkes-Dodson law aur cognitive tunneling ko un mechanisms ki tarah
establish kiya jinse acute stress cognition ko degrade karta hai. Ye
lesson un mechanisms ko concretely medical aur emergency interfaces pe
apply karta hai, AED ko ek deliberate, real-world design precedent ki
tarah use karte hue — Lesson 3 identical standard financial aur doosre
high-stakes-transaction interfaces pe apply karta hai, Part V ko close
karte hue.`,

    content: `## Why AED design is a concrete, real-world case study in this
lesson's stress-cognition principles, not a hypothetical ideal

Automated external defibrillators must be usable correctly by
untrained bystanders during a genuine cardiac emergency — arguably the
single most acute-stress scenario an ordinary person can face. Their
design (a single large button, spoken step-by-step guidance,
unambiguous indicators) is a deliberate, documented engineering
response to exactly Lesson 1's findings about cognitive tunneling and
working-memory collapse. This lesson treats this as a load-bearing
design precedent, applying the identical principles to software used
in genuine medical and emergency moments.

## Why a single, unmistakable primary action per screen directly
applies Lesson 1's cognitive-tunneling finding

Since cognitive tunneling narrows attention to a perceived primary
focus under acute stress, presenting several competing, similarly
weighted options is fundamentally mismatched to the user's actual
cognitive state during a medical emergency. A single, visually
dominant primary action — matching the user's narrowed attentional
scope — ensures the most critical action is the one reliably noticed
and acted on, with secondary options available but deliberately
de-emphasized rather than competing for the same limited attention.

## Why step-by-step guidance requiring minimal working memory directly
extends Lesson 1's working-memory-collapse finding

Since working memory collapses further under acute stress, presenting
an entire multi-step procedure at once requires the user to track
their position within it — a specific, avoidable demand on an already
severely reduced resource. Presenting one step at a time, with the
next step only appearing once the current one is confirmed complete,
eliminates this position-tracking burden entirely, directly addressing
Lesson 1's finding at its highest-stakes point.

## Why high-salience, redundant indicators are required rather than
subtle visual cues

Since cognitive tunneling and narrowed attention put anything outside
a user's perceived primary focus at genuine risk of being missed, a
subtle, single-channel indicator (a small color change, a quiet sound)
is specifically vulnerable to this risk. Redundant indicators across
multiple sensory channels — audio, visual, and haptic together — are
robust to this narrowing in a way a single subtle channel cannot be,
directly addressing the mechanism Lesson 1 established.

## Why plain, unambiguous language matters more, not just as a
general best practice, in these specific contexts

Interpreting ambiguous or technical terminology requires cognitive
capacity that Lesson 1 established is specifically degraded under
acute stress. A technical error code or clinical jargon that a calm
user could look up or reason through becomes a genuine obstacle for a
user in a medical emergency. Plain language paired with an immediate,
concrete next action removes this specific interpretive burden at
exactly the moment it matters most.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established the Yerkes-Dodson law and cognitive tunneling as
the specific mechanisms by which acute stress degrades cognition. This
lesson applies those mechanisms concretely to medical and emergency
interfaces, treating the AED as a deliberate, real-world design
precedent for load-bearing decisions rather than optional
nice-to-haves. Lesson 3 applies the identical standard to financial
and other high-stakes-transaction interfaces, closing Part V
(Accessibility & Inclusive Cognition).`,

    contentHi: `## AED design is lesson ke stress-cognition principles ka ek concrete, real-world case study kyun hai, ek hypothetical ideal nahi

Automated external defibrillators ko untrained bystanders dwara
correctly usable hona chahiye ek genuine cardiac emergency ke dauran —
arguably wo single most acute-stress scenario jo ek ordinary insaan
face kar sakta hai. Unka design (ek single large button, spoken
step-by-step guidance, unambiguous indicators) exactly Lesson 1 ki
findings ka ek deliberate, documented engineering response hai
cognitive tunneling aur working-memory collapse ke baare mein. Ye
lesson ise ek load-bearing design precedent ki tarah treat karta hai,
identical principles genuine medical aur emergency moments mein use
hone wale software pe apply karte hue.

## Ek single, unmistakable primary action per screen directly Lesson 1 ke cognitive-tunneling finding ko kyun apply karta hai

Kyunki cognitive tunneling attention ko ek perceived primary focus tak
narrow karta hai acute stress ke andar, kai competing, similarly
weighted options present karna ek medical emergency ke dauran user ki
actual cognitive state se fundamentally mismatched hai. Ek single,
visually dominant primary action — user ke narrowed attentional scope
se match karte hue — ensure karta hai ki sabse critical action wahi
hai jo reliably notice aur act kiya jaata hai, secondary options
available hote hue par deliberately de-emphasized wahi limited
attention ke liye compete karne ke bajaye.

## Step-by-step guidance jise minimal working memory chahiye directly Lesson 1 ke working-memory-collapse finding ko kyun extend karta hai

Kyunki working memory acute stress ke andar further collapse hoti hai,
ek entire multi-step procedure ek saath present karne se user ko usme
apni position track karne ki zaroorat padti hai — ek specific,
avoidable demand ek already severely reduced resource pe. Ek time pe
ek step present karna, next step sirf current one confirmed complete
hone ke baad appear karte hue, is position-tracking burden ko entirely
eliminate karta hai, directly Lesson 1 ki finding ko uske
highest-stakes point pe address karte hue.

## High-salience, redundant indicators subtle visual cues ke bajaye kyun required hain

Kyunki cognitive tunneling aur narrowed attention kisi bhi cheez ko jo
ek user ke perceived primary focus ke bahar hai completely miss hone ke
genuine risk mein daalte hain, ek subtle, single-channel indicator
(ek chhota color change, ek quiet sound) specifically is risk ke liye
vulnerable hai. Multiple sensory channels ke across redundant
indicators — audio, visual, aur haptic saath mein — is narrowing ke
robust hain ek tarike se jo ek single subtle channel nahi ho sakta,
directly us mechanism ko address karte hue jise Lesson 1 ne establish
kiya.

## Plain, unambiguous language in specific contexts mein differently nahi, zyada kyun matter karti hai, sirf ek general best practice ki tarah nahi

Ambiguous ya technical terminology ko interpret karna cognitive
capacity maangta hai jise Lesson 1 ne establish kiya specifically acute
stress ke andar degraded hai. Ek technical error code ya clinical
jargon jise ek calm user look up ya reason through kar sakta, ek
medical emergency mein ek user ke liye ek genuine obstacle ban jaata
hai. Plain language ek immediate, concrete next action ke saath paired
is specific interpretive burden ko bilkul us moment pe remove karta hai
jab ye sabse zyada matter karta hai.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne Yerkes-Dodson law aur cognitive tunneling ko un specific
mechanisms ki tarah establish kiya jinse acute stress cognition ko
degrade karta hai. Ye lesson un mechanisms ko concretely medical aur
emergency interfaces pe apply karta hai, AED ko ek deliberate,
real-world design precedent ki tarah treat karte hue load-bearing
decisions ke liye, optional nice-to-haves ke bajaye. Lesson 3 identical
standard financial aur doosre high-stakes-transaction interfaces pe
apply karta hai, Part V (Accessibility & Inclusive Cognition) ko close
karte hue.`,

    examples: [
      {
        title: 'An emergency-flow component and an alert-salience auditor implementing this lesson\'s medical-context patterns',
        titleHi: "Ek emergency-flow component aur ek alert-salience auditor jo is lesson ke medical-context patterns implement karte hain",
        codeJs: `function EmergencyContactFlow({ onCall911 }) {
  return (
    <div>
      <button className="primary-huge" autoFocus onClick={onCall911}>
        Call 911 now
      </button>
      <p className="secondary-small">Or: text contact, share location, view medical ID</p>
    </div>
  );
}

function CPRGuidance({ currentStep, totalSteps, onStepComplete }) {
  return (
    <div>
      <p className="step-count">Step {currentStep.number} of {totalSteps}</p>
      <p className="step-instruction-huge">{currentStep.text}</p>
      <button onClick={onStepComplete}>Done — next step</button>
    </div>
  );
}

function auditAlertSalience(alert) {
  const isHighSalience = alert.hasAudio && alert.hasVisualFlash && alert.hasHapticFeedback;
  return {
    isHighSalience,
    recommendation: isHighSalience
      ? 'passes — redundant across multiple senses, robust to narrowed attention'
      : 'fails — a single subtle channel risks being missed under cognitive tunneling',
  };
}

// A critical low-battery alert with only a small icon color change
console.log(auditAlertSalience({ hasAudio: false, hasVisualFlash: false, hasHapticFeedback: false }));
// { isHighSalience: false, recommendation: 'fails...' }`,
        codeTs: `interface Step {
  number: number;
  text: string;
}

function EmergencyContactFlow({ onCall911 }: { onCall911: () => void }) {
  return (
    <div>
      <button className="primary-huge" autoFocus onClick={onCall911}>
        Call 911 now
      </button>
      <p className="secondary-small">Or: text contact, share location, view medical ID</p>
    </div>
  );
}

function CPRGuidance({
  currentStep,
  totalSteps,
  onStepComplete,
}: {
  currentStep: Step;
  totalSteps: number;
  onStepComplete: () => void;
}) {
  return (
    <div>
      <p className="step-count">Step {currentStep.number} of {totalSteps}</p>
      <p className="step-instruction-huge">{currentStep.text}</p>
      <button onClick={onStepComplete}>Done — next step</button>
    </div>
  );
}

interface Alert {
  hasAudio: boolean;
  hasVisualFlash: boolean;
  hasHapticFeedback: boolean;
}

function auditAlertSalience(alert: Alert) {
  const isHighSalience = alert.hasAudio && alert.hasVisualFlash && alert.hasHapticFeedback;
  return {
    isHighSalience,
    recommendation: isHighSalience
      ? 'passes — redundant across multiple senses, robust to narrowed attention'
      : 'fails — a single subtle channel risks being missed under cognitive tunneling',
  };
}

// A critical low-battery alert with only a small icon color change
console.log(auditAlertSalience({ hasAudio: false, hasVisualFlash: false, hasHapticFeedback: false }));
// { isHighSalience: false, recommendation: 'fails...' }`,
        code: `<button className="primary-huge" autoFocus onClick={onCall911}>Call 911 now</button>
// one unmistakable primary action, matching cognitive tunneling's narrowed attentional scope`,
        output:
          "The emergency flow presents one unmistakable primary action, correctly matching the narrowed attentional scope cognitive tunneling produces, while the CPR guidance shows only the current step, eliminating position-tracking burden; the alert audit correctly flags a visual-only low-battery alert as failing, since a single channel is specifically vulnerable to being missed.",
        explain:
          "This example operationalizes three of the lesson's concrete patterns together — a single primary action, single-step guidance, and multi-channel alert redundancy — all directly derived from Lesson 1's cognitive-tunneling and working-memory-collapse mechanisms applied to a genuine medical-emergency context.",
        explainHi:
          "Ye example lesson ke teen concrete patterns ko saath mein operationalize karta hai — ek single primary action, single-step guidance, aur multi-channel alert redundancy — sab directly Lesson 1 ke cognitive-tunneling aur working-memory-collapse mechanisms se derive kiye gaye ek genuine medical-emergency context pe applied.",
      },
    ],

    mistakes: [
      {
        wrong: `// A hospital patient-portal urgent-symptom form using clinical
// terminology and requiring several fields before submission
function SymptomReportWrong() {
  return (
    <form>
      <label>Onset (hh:mm)</label>
      <input name="onset" />
      <label>Severity (1-10 NRS)</label>
      <input name="severity" />
      <label>Associated symptoms (select all)</label>
      <select multiple>{/* 12 clinical terms */}</select>
      <button>Submit</button>
      {/* Clinical jargon and multiple simultaneous fields — mismatched
          to a user in acute distress reporting an urgent symptom */}
    </form>
  );
}`,
        right: `// The same report, reduced to one plain-language question at a time
function SymptomReportRight({ step }) {
  const steps = [
    { question: 'When did this start?', field: 'onset' },
    { question: 'How bad is the pain right now, from mild to severe?', field: 'severity' },
    { question: 'Are you having any other symptoms?', field: 'associated' },
  ];
  return <SingleQuestionStep {...steps[step]} />;
  // Plain language, one question at a time — matches both the
  // narrowed attention and reduced working memory of a user in
  // acute distress
}`,
        why: "Clinical jargon and multiple simultaneous fields require both interpretive cognitive capacity and working memory that Lesson 1 established are specifically degraded under acute stress — reducing to one plain-language question at a time directly matches the user's actual cognitive state during a genuine urgent-symptom report.",
        whyHi:
          "Clinical jargon aur multiple simultaneous fields dono interpretive cognitive capacity aur working memory maangte hain jise Lesson 1 ne establish kiya specifically acute stress ke andar degraded hai — ek time pe ek plain-language question tak reduce karna directly ek genuine urgent-symptom report ke dauran user ki actual cognitive state se match karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A telehealth app's urgent-care intake flow was redesigned from a dense, clinical-terminology form into a single-question, plain-language sequence after usability testing under simulated distress (loud noise, time pressure) showed a majority of test participants abandoned or made data-entry errors on the original form — the redesigned flow measurably reduced both abandonment and error rate under the same simulated conditions.",
        hi: 'Ek telehealth app ka urgent-care intake flow ek dense, clinical-terminology form se ek single-question, plain-language sequence mein redesign kiya gaya usability testing ke baad simulated distress (loud noise, time pressure) ke andar ye dikhane ke baad ki test participants ka ek majority original form ko abandon ya usme data-entry errors karte the — redesigned flow ne wahi simulated conditions ke andar dono abandonment aur error rate ko measurably kam kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does this lesson treat AED (defibrillator) design as a load-bearing precedent for medical-app interface design, rather than an unrelated hardware example?',
        qHi: 'Ye lesson AED (defibrillator) design ko medical-app interface design ke liye ek load-bearing precedent ki tarah kyun treat karta hai, ek unrelated hardware example nahi?',
        a: "AEDs must be usable correctly by untrained bystanders during arguably the most acute-stress scenario an ordinary person can face, and their design (single button, spoken guidance, unambiguous indicators) is a deliberate, documented engineering response to cognitive tunneling and working-memory collapse — the same mechanisms this lesson applies to software used during genuine medical and emergency moments.",
        aHi: 'AEDs ko untrained bystanders dwara correctly usable hona chahiye arguably us most acute-stress scenario ke dauran jo ek ordinary insaan face kar sakta hai, aur unka design (single button, spoken guidance, unambiguous indicators) cognitive tunneling aur working-memory collapse ka ek deliberate, documented engineering response hai — wahi mechanisms jise ye lesson genuine medical aur emergency moments ke dauran use hone wale software pe apply karta hai.',
      },
      {
        q: "Why does this lesson recommend multi-channel (audio, visual, haptic) redundancy for critical alerts rather than a single, well-designed visual indicator?",
        qHi: 'Ye lesson critical alerts ke liye multi-channel (audio, visual, haptic) redundancy ki recommend kyun karta hai ek single, well-designed visual indicator ke bajaye?',
        a: "Cognitive tunneling puts anything outside a user's perceived primary focus at genuine risk of being missed, and a single-channel indicator, however well-designed visually, is specifically vulnerable to this risk. Redundancy across multiple sensory channels is robust to this narrowing in a way a single channel, no matter how well designed, cannot be.",
        aHi: 'Cognitive tunneling kisi bhi cheez ko jo ek user ke perceived primary focus ke bahar hai completely miss hone ke genuine risk mein daalta hai, aur ek single-channel indicator, chahe visually kitna bhi well-designed ho, specifically is risk ke liye vulnerable hai. Multiple sensory channels ke across redundancy is narrowing ke robust hai ek tarike se jo ek single channel, chahe kitna bhi well designed ho, nahi ho sakta.',
      },
    ],

    exercises: [
      {
        task: "A hospital's patient-portal shows a critical lab-result alert as a small red dot on a notification bell icon in the corner of the screen, with no sound or other indicator. Using this lesson's framework, explain the specific risk this creates for a patient checking results during a moment of genuine medical anxiety, and propose a concrete redesign.",
        taskHi: 'Ek hospital ka patient-portal ek critical lab-result alert ko screen ke corner mein ek notification bell icon pe ek chhoti red dot ki tarah dikhata hai, koi sound ya doosra indicator ke bina. Is lesson ke framework use karke, explain karo ki ye ek patient ke liye kya specific risk create karta hai jo genuine medical anxiety ke ek moment ke dauran results check kar raha hai, aur ek concrete redesign propose karo.',
        hint: "Think about which mechanism from Lesson 1 (cognitive tunneling) makes a small, single-channel visual indicator specifically likely to be missed, and what this lesson's multi-channel-redundancy pattern would require instead.",
        hintHi: 'Socho ki Lesson 1 ka kaunsa mechanism (cognitive tunneling) ek chhota, single-channel visual indicator ko specifically miss hone ki likelihood deta hai, aur is lesson ka multi-channel-redundancy pattern iske bajaye kya require karega.',
      },
    ],

    keyTakeaways: [
      "AED design is a deliberate, real-world engineering precedent for this lesson's principles: usable correctly by an untrained bystander during arguably the most acute-stress scenario an ordinary person can face.",
      "A single, unmistakable primary action per screen, with secondary options deliberately de-emphasized, directly matches cognitive tunneling's narrowed attentional scope.",
      "Step-by-step guidance requiring minimal working memory (one step visible at a time) directly addresses working-memory collapse under acute stress.",
      "High-salience, multi-channel (audio, visual, haptic) redundant indicators and plain, unambiguous language are required rather than subtle cues or technical jargon, since both are specifically vulnerable to acute-stress degradation.",
    ],
    keyTakeawaysHi: [
      'AED design is lesson ke principles ke liye ek deliberate, real-world engineering precedent hai: ek untrained bystander dwara correctly usable arguably us most acute-stress scenario ke dauran jo ek ordinary insaan face kar sakta hai.',
      'Ek single, unmistakable primary action per screen, secondary options deliberately de-emphasized ke saath, directly cognitive tunneling ke narrowed attentional scope se match karta hai.',
      'Step-by-step guidance jise minimal working memory chahiye (ek time pe ek step visible) directly acute stress ke andar working-memory collapse ko address karta hai.',
      'High-salience, multi-channel (audio, visual, haptic) redundant indicators aur plain, unambiguous language required hain subtle cues ya technical jargon ke bajaye, kyunki dono specifically acute-stress degradation ke liye vulnerable hain.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'psych-financial-high-stakes-interface-design',
    title: 'Concrete Design for Financial & High-Stakes Transaction Interfaces',
    titleHi: 'Financial & High-Stakes Transaction Interfaces Ke Liye Concrete Design',
    description:
      "Closing this module and Part V: applying Lesson 1's stress-cognition findings and Module 12's trust-signal framework together to financial emergencies and other high-stakes transactions, where acute stress and genuine consequence combine.",
    descriptionHi:
      'Is module aur Part V ko close karte hue: Lesson 1 ke stress-cognition findings aur Module 12 ke trust-signal framework ko saath mein financial emergencies aur doosre high-stakes transactions pe apply karte hue, jahan acute stress aur genuine consequence combine hote hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A bank's fraud-alert phone line, deliberately designed so the very first thing a genuinely panicked customer hears is a calm, explicit statement of what's already true — \"your account is protected, no unauthorized charges will be your responsibility\" — before asking them to do anything at all.** A well-designed fraud-response phone system understands something specific about the customer calling in: they are very likely calling during a moment of genuine acute stress — they've just noticed a suspicious charge, they fear their savings are at risk, they may have been awake worrying about it for hours. A poorly designed system launches immediately into a menu of options or a request for account verification, treating the caller as if they're in a calm, ordinary state. A well-designed one leads with a calm, explicit, reassuring statement of fact — their account is protected, they won't be held responsible for unauthorized charges — specifically because a panicked customer's working memory and decision-making capacity are measurably compromised, and giving them one clear, load-bearing piece of reassurance before any request reduces their acute stress enough that the SUBSEQUENT steps (verification, choices about next actions) can actually be processed and acted on correctly. This is exactly this lesson's synthesis of Lesson 1's stress-cognition findings with Module 12's trust-signal framework: a financial interface used during a genuine high-stakes moment — a suspected fraud alert, an unexpected large withdrawal notification, an urgent payment failure — must lead with the SAME calm, explicit, genuinely reassuring information, reduce the required decision to its simplest form, and treat every trust signal with the same honesty standard Module 12 established, since a panicked user is if anything MORE vulnerable to being deceived by a dishonest trust signal, not less.",
      hi: 'ek bank ki fraud-alert phone line, deliberately is tarike se design ki gayi ki bilkul pehli cheez jo ek genuinely panicked customer sunta hai ek calm, explicit statement hai jo already true hai — "aapka account protected hai, koi unauthorized charges aapki responsibility nahi honge" — unse kuch bhi karne ko kehne se pehle. Ek well-designed fraud-response phone system us customer ke baare mein kuch specific samajhta hai jo call kar raha hai: wo very likely genuine acute stress ke ek moment ke dauran call kar raha hai — unhone abhi ek suspicious charge notice kiya, unhe dar hai ki unki savings risk mein hain, wo ghanton se ise leke jaage hue ho sakte hain. Ek poorly designed system immediately options ke ek menu ya account verification ke request mein launch karta hai, caller ko treat karte hue jaise wo ek calm, ordinary state mein hai. Ek well-designed system ek calm, explicit, reassuring fact ke statement ke saath lead karta hai — unka account protected hai, unhe unauthorized charges ke liye responsible nahi thehraya jaayega — specifically kyunki ek panicked customer ki working memory aur decision-making capacity measurably compromised hai, aur unhe koi bhi request se pehle ek clear, load-bearing piece of reassurance dena unke acute stress ko itna kam karta hai ki SUBSEQUENT steps (verification, next actions ke baare mein choices) actually process aur correctly act kiye ja sakte hain. Ye exactly is lesson ka Lesson 1 ke stress-cognition findings ka Module 12 ke trust-signal framework ke saath synthesis hai: ek financial interface jo ek genuine high-stakes moment ke dauran use hota hai — ek suspected fraud alert, ek unexpected large withdrawal notification, ek urgent payment failure — ko wahi calm, explicit, genuinely reassuring information ke saath lead karna chahiye, required decision ko uske simplest form tak reduce karna chahiye, aur har trust signal ko wahi honesty standard ke saath treat karna chahiye jise Module 12 ne establish kiya, kyunki ek panicked user agar kuch hai to ek dishonest trust signal se deceive hone ke liye ZYADA vulnerable hai, kam nahi.',
    },

    simple: `**Why this lesson synthesizes Lesson 1's stress-cognition findings
with Module 12's trust-signal framework, rather than introducing a
separate framework:**

\`\`\`
A financial emergency (suspected fraud, an unexpected large charge, a
failed urgent payment) combines Lesson 1's acute-stress cognitive
degradation with Module 12's trust-formation dynamics — the user is
BOTH cognitively compromised AND actively forming a trust judgment
about the institution, at the same moment. This means both frameworks
apply simultaneously, not separately.
\`\`\`

**A concrete, checkable pattern — leading with calm, explicit
reassurance before any request, directly applying Lesson 1's
decision-capacity finding to reduce acute stress first:**

\`\`\`tsx
function FraudAlertScreenWrong() {
  return (
    <div>
      <h2>Verify your identity</h2>
      <form>{/* immediately requests account verification */}</form>
      {/* No reassurance first — assumes full decision-making capacity
          from a likely-panicked user */}
    </div>
  );
}

function FraudAlertScreenRight() {
  return (
    <div>
      <h2>Your account is protected</h2>
      <p>You will not be responsible for any unauthorized charges. Let's quickly confirm a few details.</p>
      <form>{/* verification follows the reassurance */}</form>
      {/* Explicit reassurance FIRST — reduces acute stress before
          requesting the decision-capacity-demanding next step */}
    </div>
  );
}
\`\`\`

**A concrete, checkable pattern — reducing the required decision to
its simplest form, directly applying Lesson 1's decision-quality
finding to a financial-emergency moment:**

\`\`\`tsx
function SuspiciousChargeAlert({ charge, onConfirmFraud, onConfirmLegitimate }) {
  return (
    <div>
      <p>We noticed a charge of {charge.amount} at {charge.merchant}. Was this you?</p>
      <button onClick={onConfirmLegitimate}>Yes, this was me</button>
      <button onClick={onConfirmFraud}>No, I don't recognize this</button>
      {/* Two clear options in plain language — not a dense form
          requiring careful evaluation under acute stress */}
    </div>
  );
}
\`\`\`

**A concrete, checkable pattern — applying Module 12's honesty test
with heightened stakes, since a panicked user is more, not less,
vulnerable to a dishonest trust signal:**

\`\`\`ts
function auditFinancialEmergencyTrustSignal(signal, userStressLevel) {
  const passesHonestyTest = signal.claimCanBeIndependentlyChecked && signal.describesWhatActuallyHappens;
  return {
    passesHonestyTest,
    stakesMultiplier: userStressLevel === 'acute' ? 'heightened — a panicked user cannot easily verify a dishonest claim' : 'standard',
    verdict: passesHonestyTest ? 'legitimate' : 'unacceptable — especially at heightened stakes',
  };
}
\`\`\`

**A concrete, checkable pattern — explicit, redundant confirmation of
outcome, directly extending Module 13's anxiety-reduction finding to
this specific high-stakes case:**

\`\`\`tsx
function FraudResolutionStatus({ status }) {
  if (status === 'resolved') {
    return <p>Resolved: the charge has been reversed and a new card is on its way to you.</p>;
    // A specific, concrete, checkable statement of outcome — not a
    // vague "we're looking into it," which leaves outcome uncertainty
    // unresolved for an already-anxious user
  }
}
\`\`\`

**How this lesson closes Module 14 and Part V:** Lesson 1 established
the Yerkes-Dodson law and cognitive tunneling as the mechanisms of
acute-stress cognitive degradation. Lesson 2 applied these findings to
medical and emergency interfaces, using the AED as a concrete design
precedent. This lesson completes the module by applying the identical
findings to financial and other high-stakes-transaction interfaces,
synthesizing them directly with Module 12's trust-signal framework —
closing Part V (Accessibility & Inclusive Cognition) and setting up
Part VI's shift to the psychology of engineering teams themselves.`,

    simpleHi: `**Ye lesson Lesson 1 ke stress-cognition findings ko Module 12 ke
trust-signal framework ke saath kyun synthesize karta hai, ek separate
framework introduce karne ke bajaye:**

\`\`\`
Ek financial emergency (suspected fraud, ek unexpected large charge,
ek failed urgent payment) Lesson 1 ke acute-stress cognitive
degradation ko Module 12 ke trust-formation dynamics ke saath combine
karti hai — user DONO cognitively compromised hai AUR actively
institution ke baare mein ek trust judgment bana raha hai, ek hi
moment pe. Iska matlab hai dono frameworks simultaneously apply hote
hain, separately nahi.
\`\`\`

**Ek concrete, checkable pattern — kisi bhi request se pehle calm,
explicit reassurance ke saath lead karna, directly Lesson 1 ke
decision-capacity finding ko apply karke pehle acute stress kam karna:**

\`\`\`tsx
function FraudAlertScreenWrong() {
  return (
    <div>
      <h2>Verify your identity</h2>
      <form>{/* immediately account verification request karta hai */}</form>
      {/* Pehle koi reassurance nahi — ek likely-panicked user se full
          decision-making capacity assume karta hai */}
    </div>
  );
}

function FraudAlertScreenRight() {
  return (
    <div>
      <h2>Your account is protected</h2>
      <p>You will not be responsible for any unauthorized charges. Let's quickly confirm a few details.</p>
      <form>{/* verification reassurance ke baad follow karta hai */}</form>
      {/* Explicit reassurance PEHLE — decision-capacity-demanding next
          step request karne se pehle acute stress kam karta hai */}
    </div>
  );
}
\`\`\`

**Ek concrete, checkable pattern — required decision ko uske simplest
form tak reduce karna, directly Lesson 1 ke decision-quality finding
ko ek financial-emergency moment pe apply karte hue:**

\`\`\`tsx
function SuspiciousChargeAlert({ charge, onConfirmFraud, onConfirmLegitimate }) {
  return (
    <div>
      <p>We noticed a charge of {charge.amount} at {charge.merchant}. Was this you?</p>
      <button onClick={onConfirmLegitimate}>Yes, this was me</button>
      <button onClick={onConfirmFraud}>No, I don't recognize this</button>
      {/* Do clear options plain language mein — acute stress ke andar
          careful evaluation maangne wala ek dense form nahi */}
    </div>
  );
}
\`\`\`

**Ek concrete, checkable pattern — Module 12 ke honesty test ko
heightened stakes ke saath apply karna, kyunki ek panicked user ek
dishonest trust signal ke liye zyada, kam nahi, vulnerable hai:**

\`\`\`ts
function auditFinancialEmergencyTrustSignal(signal, userStressLevel) {
  const passesHonestyTest = signal.claimCanBeIndependentlyChecked && signal.describesWhatActuallyHappens;
  return {
    passesHonestyTest,
    stakesMultiplier: userStressLevel === 'acute' ? 'heightened — a panicked user cannot easily verify a dishonest claim' : 'standard',
    verdict: passesHonestyTest ? 'legitimate' : 'unacceptable — especially at heightened stakes',
  };
}
\`\`\`

**Ek concrete, checkable pattern — outcome ka explicit, redundant
confirmation, directly Module 13 ke anxiety-reduction finding ko is
specific high-stakes case tak extend karte hue:**

\`\`\`tsx
function FraudResolutionStatus({ status }) {
  if (status === 'resolved') {
    return <p>Resolved: the charge has been reversed and a new card is on its way to you.</p>;
    // Outcome ka ek specific, concrete, checkable statement — ek
    // vague "hum dekh rahe hain" nahi, jo ek already-anxious user ke
    // liye outcome uncertainty ko unresolved chhod deta
  }
}
\`\`\`

**Ye lesson Module 14 aur Part V ko kaise close karta hai:** Lesson 1
ne Yerkes-Dodson law aur cognitive tunneling ko acute-stress cognitive
degradation ke mechanisms ki tarah establish kiya. Lesson 2 ne in
findings ko medical aur emergency interfaces pe apply kiya, AED ko ek
concrete design precedent ki tarah use karte hue. Ye lesson module ko
complete karta hai identical findings ko financial aur doosre
high-stakes-transaction interfaces pe apply karke, unhe directly
Module 12 ke trust-signal framework ke saath synthesize karte hue —
Part V (Accessibility & Inclusive Cognition) ko close karte hue aur
Part VI ke engineering teams ki psychology ki taraf shift ko set up
karte hue.`,

    content: `## Why this lesson synthesizes Lesson 1's stress-cognition findings
with Module 12's trust-signal framework rather than treating them
separately

A genuine financial emergency — suspected fraud, an unexpected large
charge, a failed urgent payment — combines two things at once: the
acute-stress cognitive degradation Lesson 1 established, and the
active trust-formation process Module 12 established. The user is
simultaneously cognitively compromised and actively forming or
revising a trust judgment about the institution. This lesson treats
both frameworks as jointly applicable, since neither alone captures
the full reality of the moment.

## Why leading with calm, explicit reassurance before any request
directly applies Lesson 1's decision-capacity finding

Since acute stress measurably reduces decision-making capacity,
launching immediately into a verification request or a complex menu
assumes a level of capacity the user likely doesn't have in the
moment. Leading instead with a calm, explicit, factually accurate
statement of reassurance — the account is protected, the user won't be
held responsible — reduces acute stress specifically before requesting
anything that requires the user's compromised decision-making capacity,
making the subsequent steps more likely to be processed correctly.

## Why reducing the required decision to its simplest form directly
applies Lesson 1's decision-quality finding to this specific context

Lesson 1 established that decision quality itself degrades under
acute stress, making complex evaluation specifically harder exactly
when it matters most. A financial-emergency interface should reduce
the immediate required decision to its simplest possible form — a
clear yes-or-no confirmation in plain language, rather than a dense
form requiring careful reading and evaluation — directly matching the
user's actual, reduced decision-making capacity in the moment.

## Why Module 12's honesty test applies with heightened, not equal,
stakes in a financial emergency

Module 12 established that every trust signal must be genuinely
verifiable and accurately reflect actual practice. In a financial
emergency specifically, this standard carries heightened stakes: a
panicked user has reduced capacity to carefully scrutinize or verify a
claim, making them more, not less, vulnerable to being deceived by a
dishonest or exaggerated trust signal. This means the honesty
requirement doesn't relax under acute stress — it becomes more
critical, since the user's own capacity to catch a dishonest claim is
itself compromised.

## Why explicit, redundant confirmation of outcome directly extends
Module 13's anxiety-reduction finding to this specific case

Module 13 established that anxiety amplifies uncertainty about whether
a consequential action actually completed. In a financial-emergency
resolution specifically, a vague status update ("we're looking into
it") leaves this uncertainty unresolved for an already-anxious user,
while a specific, concrete, checkable statement of outcome (the charge
was reversed, a new card is being sent) directly closes that
uncertainty gap at the exact moment it matters most.

## How this lesson closes Module 14 and Part V

Lesson 1 established the Yerkes-Dodson law and cognitive tunneling as
the mechanisms of acute-stress cognitive degradation. Lesson 2 applied
these findings concretely to medical and emergency interfaces, using
the AED as a real-world design precedent. This lesson completes the
module by applying the identical findings to financial and other
high-stakes-transaction interfaces, synthesized directly with Module
12's trust-signal framework — closing Part V (Accessibility &
Inclusive Cognition) and setting up Part VI's shift to the psychology
of engineering teams themselves, beginning with psychological safety.`,

    contentHi: `## Ye lesson Lesson 1 ke stress-cognition findings ko Module 12 ke trust-signal framework ke saath kyun synthesize karta hai unhe separately treat karne ke bajaye

Ek genuine financial emergency — suspected fraud, ek unexpected large
charge, ek failed urgent payment — do cheezon ko ek saath combine
karti hai: Lesson 1 ne establish kiya acute-stress cognitive
degradation, aur Module 12 ne establish kiya active trust-formation
process. User simultaneously cognitively compromised hai aur actively
institution ke baare mein ek trust judgment bana ya revise kar raha
hai. Ye lesson dono frameworks ko jointly applicable ki tarah treat
karta hai, kyunki koi bhi akela moment ki poori reality ko capture
nahi karta.

## Kisi bhi request se pehle calm, explicit reassurance ke saath lead karna directly Lesson 1 ke decision-capacity finding ko kyun apply karta hai

Kyunki acute stress decision-making capacity ko measurably kam karta
hai, immediately ek verification request ya ek complex menu mein
launch karna ek level of capacity assume karta hai jo user ke paas us
moment mein likely nahi hai. Iske bajaye ek calm, explicit, factually
accurate reassurance ke statement ke saath lead karna — account
protected hai, user ko responsible nahi thehraya jaayega — specifically
kuch bhi request karne se pehle acute stress kam karta hai jise user
ki compromised decision-making capacity chahiye, subsequent steps ko
correctly process hone ki zyada likelihood dete hue.

## Required decision ko uske simplest form tak reduce karna directly Lesson 1 ke decision-quality finding ko is specific context pe kyun apply karta hai

Lesson 1 ne establish kiya ki decision quality khud acute stress ke
andar degrade hoti hai, complex evaluation ko specifically harder
banate hue exactly jab ye sabse zyada matter karta hai. Ek
financial-emergency interface ko immediate required decision ko uske
simplest possible form tak reduce karna chahiye — plain language mein
ek clear yes-or-no confirmation, ek dense form ke bajaye jise careful
reading aur evaluation chahiye — directly user ki actual, reduced
decision-making capacity se us moment mein match karte hue.

## Module 12 ka honesty test ek financial emergency mein heightened, equal nahi, stakes ke saath kyun apply hota hai

Module 12 ne establish kiya ki har trust signal genuinely verifiable
hona chahiye aur actual practice ko accurately reflect karna chahiye.
Specifically ek financial emergency mein, ye standard heightened
stakes carry karta hai: ek panicked user ke paas ek claim ko carefully
scrutinize ya verify karne ki reduced capacity hai, unhe ek dishonest
ya exaggerated trust signal se deceive hone ke liye zyada, kam nahi,
vulnerable banate hue. Iska matlab hai honesty requirement acute stress
ke andar relax nahi hoti — ye zyada critical ban jaati hai, kyunki
user ki khud ki ek dishonest claim pakadne ki capacity khud compromised
hai.

## Outcome ka explicit, redundant confirmation directly Module 13 ki anxiety-reduction finding ko is specific case tak kaise extend karta hai

Module 13 ne establish kiya ki anxiety is uncertainty ko amplify karti
hai ki kya ek consequential action actually complete hui. Specifically
ek financial-emergency resolution mein, ek vague status update ("hum
dekh rahe hain") ek already-anxious user ke liye ye uncertainty
unresolved chhod deta hai, jabki outcome ka ek specific, concrete,
checkable statement (charge reverse ho gaya, ek naya card bheja ja
raha hai) directly us uncertainty gap ko bilkul us moment pe close
karta hai jab ye sabse zyada matter karta hai.

## Ye lesson Module 14 aur Part V ko kaise close karta hai

Lesson 1 ne Yerkes-Dodson law aur cognitive tunneling ko acute-stress
cognitive degradation ke mechanisms ki tarah establish kiya. Lesson 2
ne in findings ko concretely medical aur emergency interfaces pe apply
kiya, AED ko ek real-world design precedent ki tarah use karte hue. Ye
lesson module ko complete karta hai identical findings ko financial
aur doosre high-stakes-transaction interfaces pe apply karke, unhe
directly Module 12 ke trust-signal framework ke saath synthesize karte
hue — Part V (Accessibility & Inclusive Cognition) ko close karte hue
aur Part VI ke engineering teams ki psychology ki taraf shift ko set
up karte hue, psychological safety se shuru hote hue.`,

    examples: [
      {
        title: 'A fraud-alert screen and a heightened-stakes trust-signal auditor synthesizing Lessons 1-2 and Module 12',
        titleHi: "Ek fraud-alert screen aur ek heightened-stakes trust-signal auditor jo Lessons 1-2 aur Module 12 ko synthesize karta hai",
        codeJs: `function FraudAlertScreen({ charge, onConfirmFraud, onConfirmLegitimate }) {
  return (
    <div>
      <h2>Your account is protected</h2>
      <p>You will not be responsible for any unauthorized charges.</p>
      <p>We noticed a charge of {charge.amount} at {charge.merchant}. Was this you?</p>
      <button onClick={onConfirmLegitimate}>Yes, this was me</button>
      <button onClick={onConfirmFraud}>No, I don't recognize this</button>
    </div>
  );
}

function auditFinancialEmergencyTrustSignal(signal, userStressLevel) {
  const passesHonestyTest = signal.claimCanBeIndependentlyChecked && signal.describesWhatActuallyHappens;
  return {
    passesHonestyTest,
    stakesMultiplier: userStressLevel === 'acute'
      ? 'heightened — a panicked user cannot easily verify a dishonest claim'
      : 'standard',
    verdict: passesHonestyTest ? 'legitimate' : 'unacceptable — especially at heightened stakes',
  };
}

console.log(auditFinancialEmergencyTrustSignal(
  { claimCanBeIndependentlyChecked: false, describesWhatActuallyHappens: false },
  'acute'
));
// { passesHonestyTest: false, stakesMultiplier: 'heightened...', verdict: 'unacceptable...' }`,
        codeTs: `interface Charge {
  amount: string;
  merchant: string;
}

function FraudAlertScreen({
  charge,
  onConfirmFraud,
  onConfirmLegitimate,
}: {
  charge: Charge;
  onConfirmFraud: () => void;
  onConfirmLegitimate: () => void;
}) {
  return (
    <div>
      <h2>Your account is protected</h2>
      <p>You will not be responsible for any unauthorized charges.</p>
      <p>We noticed a charge of {charge.amount} at {charge.merchant}. Was this you?</p>
      <button onClick={onConfirmLegitimate}>Yes, this was me</button>
      <button onClick={onConfirmFraud}>No, I don't recognize this</button>
    </div>
  );
}

interface TrustSignal {
  claimCanBeIndependentlyChecked: boolean;
  describesWhatActuallyHappens: boolean;
}

type StressLevel = 'normal' | 'acute';

function auditFinancialEmergencyTrustSignal(signal: TrustSignal, userStressLevel: StressLevel) {
  const passesHonestyTest = signal.claimCanBeIndependentlyChecked && signal.describesWhatActuallyHappens;
  return {
    passesHonestyTest,
    stakesMultiplier: userStressLevel === 'acute'
      ? 'heightened — a panicked user cannot easily verify a dishonest claim'
      : 'standard',
    verdict: passesHonestyTest ? 'legitimate' : 'unacceptable — especially at heightened stakes',
  };
}

console.log(auditFinancialEmergencyTrustSignal(
  { claimCanBeIndependentlyChecked: false, describesWhatActuallyHappens: false },
  'acute'
));
// { passesHonestyTest: false, stakesMultiplier: 'heightened...', verdict: 'unacceptable...' }`,
        code: `<h2>Your account is protected</h2>
<p>You will not be responsible for any unauthorized charges.</p>
// calm, explicit reassurance leads, before any request — reduces acute stress first`,
        output:
          "The fraud alert screen leads with explicit reassurance before the simple, two-option confirmation request, correctly matching a panicked user's reduced decision-making capacity; the trust-signal auditor correctly flags an unverifiable, inaccurate claim as unacceptable, with the stakes explicitly noted as heightened rather than standard given the user's acute stress.",
        explain:
          "This example operationalizes the module's closing synthesis directly: the fraud screen combines Lesson 1's decision-simplification and Lesson 2's calm-reassurance-first patterns, while the audit function explicitly applies Module 12's honesty test with a heightened-stakes multiplier specific to acute-stress contexts, showing the frameworks working together rather than separately.",
        explainHi:
          "Ye example module ki closing synthesis ko directly operationalize karta hai: fraud screen Lesson 1 ke decision-simplification aur Lesson 2 ke calm-reassurance-first patterns ko combine karta hai, jabki audit function explicitly Module 12 ke honesty test ko ek heightened-stakes multiplier ke saath apply karta hai jo specifically acute-stress contexts ke liye hai, frameworks ko separately ke bajaye saath mein kaam karte hue dikhate hue.",
      },
    ],

    mistakes: [
      {
        wrong: `// A large-withdrawal security alert that launches immediately into
// a dense verification form, with a vague, unverifiable trust claim
function WithdrawalAlertWrong() {
  return (
    <div>
      <h2>Verify this transaction</h2>
      <p>Our bank-level security keeps your money safe.</p>
      {/* Vague, unverifiable trust claim — fails Module 12's honesty
          test, and especially risky here since a panicked user can't
          easily verify it */}
      <form>{/* dense verification form, no reassurance first */}</form>
    </div>
  );
}`,
        right: `// The same alert, leading with reassurance, a specific and
// verifiable trust claim, and a simplified decision
function WithdrawalAlertRight({ withdrawal, onConfirm, onDispute }) {
  return (
    <div>
      <h2>Your account is protected</h2>
      <p>
        We use FDIC-insured accounts and monitor withdrawals with
        real-time fraud detection (details).
      </p>
      <p>We noticed a withdrawal of {withdrawal.amount}. Was this you?</p>
      <button onClick={onConfirm}>Yes, this was me</button>
      <button onClick={onDispute}>No, I need to dispute this</button>
    </div>
  );
}`,
        why: "A vague, unverifiable trust claim like 'bank-level security' fails Module 12's honesty test in any context, but is especially risky in a financial emergency because a panicked user has reduced capacity to scrutinize or verify it — combined with launching immediately into a dense form without reassurance, this compounds Lesson 1's decision-capacity finding with a dishonest trust signal at the worst possible moment.",
        whyHi:
          "'Bank-level security' jaisa ek vague, unverifiable trust claim kisi bhi context mein Module 12 ke honesty test mein fail hota hai, par ek financial emergency mein especially risky hai kyunki ek panicked user ke paas ise scrutinize ya verify karne ki reduced capacity hai — immediately ek dense form mein launch karne ke saath combined, koi reassurance ke bina, ye Lesson 1 ke decision-capacity finding ko ek dishonest trust signal ke saath worst possible moment pe compound karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production bank's fraud-detection SMS/app flow was redesigned after customer-research interviews revealed that customers receiving a fraud alert often re-read the message multiple times out of anxiety before acting, unable to process a dense paragraph; the redesign led with a one-line reassurance ('You're protected — no action lost you money') followed by a single yes/no confirmation, and follow-up data showed measurably faster and more accurate customer responses.",
        hi: "Ek production bank ka fraud-detection SMS/app flow redesign kiya gaya customer-research interviews ke baad ye reveal karne ke baad ki customers ek fraud alert receive karte hue anxiety ki wajah se aksar message ko multiple baar re-read karte the act karne se pehle, ek dense paragraph process karne mein unable. Redesign ek one-line reassurance ('You're protected — no action lost you money') ke saath lead kiya ek single yes/no confirmation follow karte hue, aur follow-up data ne measurably faster aur more accurate customer responses dikhaye.",
      },
    ],

    interviewQA: [
      {
        q: "Why does this lesson recommend leading a financial-emergency alert with calm, explicit reassurance before requesting any user action?",
        qHi: 'Ye lesson ek financial-emergency alert ko kisi bhi user action request karne se pehle calm, explicit reassurance ke saath lead karne ki recommend kyun karta hai?',
        a: "Since acute stress (Lesson 1) measurably reduces decision-making capacity, launching immediately into a request assumes a capacity the user likely doesn't have. Reassurance specifically reduces acute stress before the request, making the subsequent decision-capacity-demanding step more likely to be processed correctly.",
        aHi: 'Kyunki acute stress (Lesson 1) decision-making capacity ko measurably kam karta hai, immediately ek request mein launch karna ek capacity assume karta hai jo user ke paas likely nahi hai. Reassurance specifically request se pehle acute stress kam karti hai, subsequent decision-capacity-demanding step ko correctly process hone ki zyada likelihood dete hue.',
      },
      {
        q: "Why does this lesson argue that Module 12's honesty test applies with heightened, not equal, stakes during a financial emergency specifically?",
        qHi: 'Ye lesson kyun argue karta hai ki Module 12 ka honesty test specifically ek financial emergency ke dauran heightened, equal nahi, stakes ke saath apply hota hai?',
        a: "A panicked user has reduced capacity to carefully scrutinize or verify a trust claim, making them more, not less, vulnerable to being deceived by a dishonest or exaggerated one. The honesty requirement doesn't relax under acute stress — it becomes more critical, since the user's own ability to catch a dishonest claim is itself compromised.",
        aHi: 'Ek panicked user ke paas ek trust claim ko carefully scrutinize ya verify karne ki reduced capacity hai, unhe ek dishonest ya exaggerated wale se deceive hone ke liye zyada, kam nahi, vulnerable banate hue. Honesty requirement acute stress ke andar relax nahi hoti — ye zyada critical ban jaati hai, kyunki user ki khud ki ek dishonest claim pakadne ki ability khud compromised hai.',
      },
    ],

    exercises: [
      {
        task: "A payment app shows 'Something went wrong. Please try again.' after a failed urgent bill payment, with no further detail about whether money was actually deducted. Using this lesson's synthesis of Lesson 1 and Module 13's anxiety findings, explain the specific risk this vague message creates and propose the concrete fix.",
        taskHi: "Ek payment app 'Something went wrong. Please try again.' dikhata hai ek failed urgent bill payment ke baad, koi further detail ke bina ki kya money actually deduct hui. Is lesson ke Lesson 1 aur Module 13 ki anxiety findings ke synthesis use karke, explain karo ki ye vague message kya specific risk create karta hai aur concrete fix propose karo.",
        hint: "Think about what a user under acute stress (worried about a missed bill deadline) will do with genuine uncertainty about whether money was deducted — connect this to Module 13's finding about anxiety amplifying outcome uncertainty and this lesson's explicit-confirmation pattern.",
        hintHi: 'Socho ki acute stress ke andar ek user (ek missed bill deadline ke baare mein worried) genuine uncertainty ke saath kya karega is baare mein ki kya money deduct hui — ise Module 13 ki finding se connect karo anxiety ke outcome uncertainty ko amplify karne ke baare mein aur is lesson ke explicit-confirmation pattern se.',
      },
    ],

    keyTakeaways: [
      "A financial emergency combines Lesson 1's acute-stress cognitive degradation with Module 12's active trust-formation process simultaneously, requiring both frameworks to apply together.",
      "Leading with calm, explicit reassurance before any request reduces acute stress first, making the subsequent decision-capacity-demanding step more likely to succeed.",
      "Module 12's honesty test applies with heightened, not equal, stakes here — a panicked user is more vulnerable to a dishonest trust signal, not less, since their capacity to verify claims is itself reduced.",
      "This lesson closes Module 14 and Part V by synthesizing stress-cognition findings with the trust-signal and anxiety-reduction frameworks from Modules 12-13, previewing Part VI's shift to the psychology of engineering teams.",
    ],
    keyTakeawaysHi: [
      'Ek financial emergency Lesson 1 ke acute-stress cognitive degradation ko Module 12 ke active trust-formation process ke saath simultaneously combine karti hai, dono frameworks ko saath mein apply hone ki zaroorat hote hue.',
      'Kisi bhi request se pehle calm, explicit reassurance ke saath lead karna pehle acute stress kam karta hai, subsequent decision-capacity-demanding step ko succeed hone ki zyada likelihood dete hue.',
      'Module 12 ka honesty test yahan heightened, equal nahi, stakes ke saath apply hota hai — ek panicked user ek dishonest trust signal ke liye zyada vulnerable hai, kam nahi, kyunki claims verify karne ki unki capacity khud reduced hai.',
      'Ye lesson Module 14 aur Part V ko close karta hai stress-cognition findings ko Modules 12-13 ke trust-signal aur anxiety-reduction frameworks ke saath synthesize karke, Part VI ke engineering teams ki psychology ki taraf shift ko preview karte hue.',
    ],
  },
];
