/**
 * Psychology for Developers — Module 10: Cognitive Load in Interface Design, lessons 1-3.
 *
 * Lesson 1: Reducing extraneous load — concrete interface patterns derived directly from Module 1's cognitive load theory.
 * Lesson 2: Progressive disclosure as a cognitive-load management technique, revisited and deepened.
 * Lesson 3: Chunking in interface design — concrete, implementable patterns beyond the conceptual foundation.
 */

import type { CourseLesson } from './course-js-module1';

export const PSYCH_MODULE_10: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'psych-reducing-extraneous-cognitive-load',
    title: 'Reducing Extraneous Load — Concrete Interface Patterns',
    titleHi: 'Extraneous Load Kam Karna — Concrete Interface Patterns',
    description:
      "Module 1 established intrinsic, extraneous, and germane load as the three components of cognitive load theory. This lesson returns to that foundation with concrete, implementable interface patterns specifically targeting extraneous load — the only component a designer should ever try to eliminate entirely.",
    descriptionHi:
      'Module 1 ne intrinsic, extraneous, aur germane load ko cognitive load theory ke teen components ki tarah establish kiya. Ye lesson us foundation pe wapas aata hai concrete, implementable interface patterns ke saath specifically extraneous load ko target karte hue — ekmatra component jise ek designer ko kabhi poori tarah eliminate karne ki koshish karni chahiye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A recipe card cluttered with decorative fonts, unnecessary backstory about the dish's origin, and inconsistent measurement units, versus the exact same recipe rewritten with a clean, consistent layout and standardized units — the actual cooking task hasn't changed, but one version makes it measurably harder to execute correctly.** A recipe that's genuinely difficult to cook (a complex, multi-stage sauce requiring precise timing) has real, irreducible difficulty that no amount of clean formatting removes — that's the dish's actual, intrinsic complexity, and a good recipe card organizes it clearly rather than pretending it doesn't exist. But a recipe card that ALSO uses three different decorative fonts that are hard to scan quickly, mixes teaspoons and grams inconsistently within the same instructions, and buries the actual next step in a paragraph of unrelated backstory adds an entirely different, avoidable kind of difficulty — none of this decorative clutter or inconsistency makes the dish itself any harder to cook, it just makes the recipe harder to follow while cooking it. Rewriting the exact same recipe with a clean, single font, consistent units throughout, and clearly numbered steps changes nothing about the dish's actual difficulty, but it removes a real, measurable source of difficulty that was never inherent to the cooking task itself. This is exactly what reducing extraneous cognitive load means in interface design: the task's genuine, irreducible complexity (Module 1's intrinsic load) stays exactly as complex as it actually is, while everything about how that complexity is PRESENTED — inconsistent patterns, unnecessary decoration, poorly organized layout — is a separate, entirely avoidable source of difficulty that a well-designed interface eliminates without changing what the user is actually trying to accomplish.",
      hi: 'ek recipe card jo decorative fonts se cluttered hai, dish ke origin ke baare mein unnecessary backstory, aur inconsistent measurement units, versus exact wahi recipe ek clean, consistent layout aur standardized units ke saath rewritten — actual cooking task nahi badla, par ek version ise correctly execute karna measurably harder banata hai. Ek recipe jo genuinely cook karna difficult hai (ek complex, multi-stage sauce jise precise timing chahiye) real, irreducible difficulty rakhti hai jise koi bhi amount ki clean formatting remove nahi karti — ye dish ki actual, intrinsic complexity hai, aur ek achha recipe card ise clearly organize karta hai ye pretend karne ke bajaye ki ye exist nahi karti. Par ek recipe card jo BHI teen different decorative fonts use karta hai jinhe quickly scan karna hard hai, teaspoons aur grams ko wahi instructions ke andar inconsistently mix karta hai, aur actual next step ko unrelated backstory ke ek paragraph mein bury karta hai ek poori tarah alag, avoidable kism ki difficulty add karta hai — is decorative clutter ya inconsistency mein se koi bhi dish ko khud cook karna kisi bhi zyada hard nahi banata, ye sirf recipe ko cook karte waqt follow karna harder banata hai. Exact wahi recipe ko ek clean, single font, throughout consistent units, aur clearly numbered steps ke saath rewrite karna dish ki actual difficulty ke baare mein kuch nahi badalta, par ye difficulty ka ek real, measurable source remove karta hai jo cooking task ke khud ke liye kabhi inherent nahi tha. Ye exactly wo hai jo interface design mein extraneous cognitive load kam karne ka matlab hai: task ki genuine, irreducible complexity (Module 1 ka intrinsic load) exactly utni hi complex rehti hai jitni ye actually hai, jabki us complexity ko PRESENT kaise kiya jaata hai iske baare mein sab kuch — inconsistent patterns, unnecessary decoration, poorly organized layout — difficulty ka ek separate, poori tarah avoidable source hai jise ek well-designed interface eliminate karta hai ye badle bina ki user actually kya accomplish karne ki koshish kar raha hai.',
    },

    simple: `**A direct return to Module 1's cognitive load theory — this
lesson's entire scope is the ONE component that should always be
minimized toward zero:**

\`\`\`
INTRINSIC LOAD (Module 1) — the task's genuine, irreducible
  complexity. Organize it, never pretend it doesn't exist.
EXTRANEOUS LOAD (Module 1, this lesson's focus) — complexity from
  poor presentation, unrelated to the task's actual difficulty. ALWAYS
  minimize this toward zero — it serves no purpose.
GERMANE LOAD (Module 1) — productive effort that builds genuine
  understanding. Preserve deliberately.

This lesson is entirely about concrete, implementable ways to
eliminate EXTRANEOUS load specifically, without touching intrinsic or
germane load.
\`\`\`

**A concrete, checkable pattern — inconsistent UI conventions across
a single flow, a pure source of extraneous load with zero connection
to task difficulty:**

\`\`\`tsx
// EXTRANEOUS LOAD: inconsistent button placement and labeling across
// steps of the SAME flow — the task's difficulty hasn't changed, but
// the user must re-learn the interface at every step
function CheckoutStepInconsistent({ step }) {
  if (step === 1) return <button className="btn-primary-right">Continue</button>;
  if (step === 2) return <button className="btn-secondary-left">Next Step</button>;
  if (step === 3) return <button className="cta-green">Proceed →</button>;
  // Three different labels, positions, and styles for the IDENTICAL
  // action — pure extraneous load, adding difficulty the checkout
  // task itself never required
}

// REDUCED EXTRANEOUS LOAD: identical action, identical label,
// position, and style at every step
function CheckoutStepConsistent({ step }) {
  return <button className="btn-primary">Continue</button>;
  // The task's actual complexity (entering shipping info, payment
  // info) is completely unchanged — only the presentation consistency improved
}
\`\`\`

**A concrete, checkable pattern for eliminating decorative complexity
that provides no functional value — visual noise that adds load
without adding meaning:**

\`\`\`tsx
// Extraneous load from unnecessary visual decoration competing for
// attention with the actual task
function FormFieldOverDecorated() {
  return (
    <div className="gradient-border animated-icon shadow-glow">
      <label className="fancy-cursive-font">Email Address</label>
      <input type="email" />
    </div>
  );
  // None of this decoration makes entering an email address any
  // easier — it's pure extraneous load competing for the same
  // limited attention Module 1 established working memory has
}

function FormFieldClean() {
  return (
    <div>
      <label>Email Address</label>
      <input type="email" />
    </div>
  );
  // Identical task, zero decorative extraneous load
}
\`\`\`

**A concrete, checkable audit function for identifying extraneous
load sources in an existing interface — a practical review tool:**

\`\`\`ts
function auditExtraneousLoad(interfaceElement) {
  const extraneousLoadSources = [
    { check: 'inconsistentWithRestOfFlow', present: interfaceElement.divergesFromEstablishedPatterns },
    { check: 'purelyDecorativeComplexity', present: interfaceElement.hasVisualElementsWithNoFunctionalPurpose },
    { check: 'unnecessaryCognitiveTranslation', present: interfaceElement.requiresUserToMentallyConvertOrRemap },
  ];
  return extraneousLoadSources.filter((source) => source.present);
  // Each identified source is, by definition, removable without
  // changing the actual task's intrinsic difficulty
}
\`\`\`

**Why the critical discipline is distinguishing extraneous load from
intrinsic load BEFORE attempting to simplify — a mistake this lesson
specifically guards against:**

\`\`\`
Removing a field from a genuinely complex tax form because it "adds
load" without checking whether that field is legally REQUIRED
information (intrinsic to the task) rather than merely poorly
presented (extraneous) risks breaking the task itself, not just
simplifying its presentation. Module 1's three-way distinction is what
prevents "simplification" from accidentally removing intrinsic
complexity that genuinely needs to be there — this lesson's patterns
apply specifically and only to load that adds difficulty WITHOUT
serving the task.
\`\`\`

**How this lesson opens Module 10:** having established a four-module
arc on the ethics of shaping behavior (Modules 6-9), this module shifts
to practical UX psychology applications. This lesson returns directly
to Module 1's cognitive load theory — the single most load-bearing
concept this course established for UI design — and supplies the
concrete, implementable patterns for its most actionable component:
eliminating extraneous load. Lesson 2 deepens progressive disclosure as
a specific extraneous-load-reduction technique; Lesson 3 does the same
for chunking.`,

    simpleHi: `**Module 1 ke cognitive load theory ki taraf ek direct return — is
lesson ka poora scope ekmatra wo component hai jise hamesha zero ki
taraf minimize kiya jaana chahiye:**

\`\`\`
INTRINSIC LOAD (Module 1) — task ki genuine, irreducible complexity.
  Ise organize karo, kabhi pretend mat karo ki ye exist nahi karti.
EXTRANEOUS LOAD (Module 1, is lesson ka focus) — poor presentation se
  complexity, task ki actual difficulty se unrelated. Ise HAMESHA
  zero ki taraf minimize karo — ye koi purpose serve nahi karti.
GERMANE LOAD (Module 1) — productive effort jo genuine understanding
  build karta hai. Deliberately preserve karo.

Ye lesson poori tarah concrete, implementable tareekon ke baare mein
hai specifically EXTRANEOUS load ko eliminate karne ke, intrinsic ya
germane load ko touch kiye bina.
\`\`\`

**Ek concrete, checkable pattern — ek single flow ke across
inconsistent UI conventions, ek pure source of extraneous load task
difficulty se zero connection ke saath:**

\`\`\`tsx
// EXTRANEOUS LOAD: WAHI flow ke steps ke across inconsistent button
// placement aur labeling — task ki difficulty badli nahi, par user
// ko har step pe interface dobara seekhni padti hai
function CheckoutStepInconsistent({ step }) {
  if (step === 1) return <button className="btn-primary-right">Continue</button>;
  if (step === 2) return <button className="btn-secondary-left">Next Step</button>;
  if (step === 3) return <button className="cta-green">Proceed →</button>;
  // IDENTICAL action ke liye teen different labels, positions, aur
  // styles — pure extraneous load, us difficulty ko add karte hue jo
  // checkout task ko khud kabhi chahiye hi nahi thi
}

// REDUCED EXTRANEOUS LOAD: identical action, identical label, position, aur style har step pe
function CheckoutStepConsistent({ step }) {
  return <button className="btn-primary">Continue</button>;
  // Task ki actual complexity (shipping info, payment info enter
  // karna) completely unchanged hai — sirf presentation consistency improve hui
}
\`\`\`

**Decorative complexity ko eliminate karne ke liye ek concrete,
checkable pattern jo koi functional value provide nahi karti — visual
noise jo meaning add kiye bina load add karti hai:**

\`\`\`tsx
// Unnecessary visual decoration se extraneous load jo actual task ke
// saath attention ke liye compete karti hai
function FormFieldOverDecorated() {
  return (
    <div className="gradient-border animated-icon shadow-glow">
      <label className="fancy-cursive-font">Email Address</label>
      <input type="email" />
    </div>
  );
  // Is decoration mein se koi bhi email address enter karna kisi bhi
  // zyada aasan nahi banata — ye pure extraneous load hai wahi limited
  // attention ke liye compete karte hue jise Module 1 ne working memory
  // ki tarah establish kiya
}

function FormFieldClean() {
  return (
    <div>
      <label>Email Address</label>
      <input type="email" />
    </div>
  );
  // Identical task, zero decorative extraneous load
}
\`\`\`

**Ek existing interface mein extraneous load sources identify karne ka
ek concrete, checkable audit function — ek practical review tool:**

\`\`\`ts
function auditExtraneousLoad(interfaceElement) {
  const extraneousLoadSources = [
    { check: 'inconsistentWithRestOfFlow', present: interfaceElement.divergesFromEstablishedPatterns },
    { check: 'purelyDecorativeComplexity', present: interfaceElement.hasVisualElementsWithNoFunctionalPurpose },
    { check: 'unnecessaryCognitiveTranslation', present: interfaceElement.requiresUserToMentallyConvertOrRemap },
  ];
  return extraneousLoadSources.filter((source) => source.present);
  // Har identified source, definition se, remove ki ja sakti hai
  // actual task ki intrinsic difficulty ko badle bina
}
\`\`\`

**Critical discipline extraneous load ko intrinsic load se distinguish
karna simplify karne ki koshish karne SE PEHLE kyun hai — ek mistake
jise ye lesson specifically guard karta hai:**

\`\`\`
Ek genuinely complex tax form se ek field remove karna kyunki ye
"load add karta hai" ye check kiye bina ki kya wo field legally
REQUIRED information hai (task ke liye intrinsic) merely poorly
presented (extraneous) hone ke bajaye task khud ko break karne ka risk
leta hai, sirf uski presentation simplify karne ka nahi. Module 1 ki
three-way distinction wo hai jo "simplification" ko accidentally
intrinsic complexity remove karne se rokti hai jise genuinely wahan
hona chahiye — is lesson ke patterns specifically aur sirf us load pe
apply hote hain jo task ko serve kiye bina difficulty add karta hai.
\`\`\`

**Ye lesson Module 10 ko kaise open karta hai:** behavior ko shape
karne ki ethics pe ek four-module arc establish karne ke baad (Modules
6-9), ye module practical UX psychology applications ki taraf shift
karta hai. Ye lesson directly Module 1 ke cognitive load theory pe
wapas aata hai — single sabse load-bearing concept jise ye course UI
design ke liye establish kar chuka hai — aur uske sabse actionable
component ke liye concrete, implementable patterns supply karta hai:
extraneous load eliminate karna. Lesson 2 progressive disclosure ko ek
specific extraneous-load-reduction technique ki tarah deepen karta
hai; Lesson 3 chunking ke liye wahi karta hai.`,

    content: `## Why this lesson's entire scope is deliberately narrow —
extraneous load specifically, not cognitive load in general

Module 1 established that intrinsic load (a task's genuine complexity)
should be organized but never eliminated, germane load (productive
learning effort) should be deliberately preserved, and extraneous load
(complexity from poor presentation) should always be minimized toward
zero, since it serves no purpose. This lesson deliberately restricts
its scope to concrete patterns for the third category specifically —
extraneous load is the only one of the three where "always minimize
it" is unambiguously the correct guidance, making it the component
where concrete, universally-applicable design patterns can be safely
prescribed without needing to first assess whether a specific task
genuinely requires the complexity being reduced.

## Why inconsistency across a single flow is a pure, checkable
example of extraneous load with zero connection to task difficulty

When identical actions (confirming a step, proceeding to the next
stage) are presented with different labels, positions, or visual
treatments at different points in the same flow, the user must
relearn the interface at each step — effort spent purely on
interpreting presentation, contributing nothing to accomplishing the
actual underlying task. This is precisely why consistency is one of
the most reliable, checkable extraneous-load reductions available: it
can be verified mechanically (does this element look and behave the
same way every time it performs the same function?) without requiring
any judgment call about the task's genuine complexity.

## Why decorative complexity that serves no functional purpose is
extraneous load in the most direct sense

Visual elements that don't communicate information relevant to the
task — decorative animations, unnecessary stylistic flourishes,
competing visual emphasis — consume a portion of the same limited
attention and working-memory capacity Module 1 established as
genuinely scarce, without contributing anything toward completing the
task. This is why removing purely decorative complexity is one of the
lowest-risk, highest-confidence extraneous-load reductions: since the
decoration was never serving the task in the first place, its removal
cannot accidentally strip out genuine, needed intrinsic complexity.

## Why the discipline of distinguishing extraneous from intrinsic
load must come before attempting any simplification

The single most consequential mistake this lesson guards against is
treating something as extraneous load and removing it when it was
actually intrinsic load the task genuinely required — removing a
legally mandated field from a tax form because it "adds complexity"
doesn't simplify presentation, it breaks the actual task. This is why
Module 1's three-way distinction is a prerequisite for applying this
lesson's patterns correctly: each pattern here (consistency, removing
decoration, avoiding unnecessary cognitive translation) is safe
specifically because it targets complexity that never served the
task's genuine requirements, and applying these patterns requires
first confirming that the complexity being removed is actually
extraneous rather than mistakenly assumed to be.

## How this lesson opens Module 10

Having closed a four-module arc on the ethics of shaping user behavior
(Modules 6-9), this module returns to practical UX psychology
grounded directly in Module 1's foundational cognitive load theory.
This lesson establishes concrete patterns for extraneous load
specifically; Lesson 2 revisits and deepens progressive disclosure
(already introduced conceptually in earlier modules) as a targeted
extraneous-load technique, and Lesson 3 does the same for chunking,
completing this module's translation of Module 1's theoretical
foundation into a complete set of actionable interface-design
patterns.`,

    contentHi: `## Is lesson ka poora scope deliberately narrow kyun hai — specifically extraneous load, general cognitive load nahi

Module 1 ne establish kiya ki intrinsic load (ek task ki genuine
complexity) ko organize karna chahiye par kabhi eliminate nahi, germane
load (productive learning effort) ko deliberately preserve karna
chahiye, aur extraneous load (poor presentation se complexity) ko
hamesha zero ki taraf minimize karna chahiye, kyunki ye koi purpose
serve nahi karta. Ye lesson deliberately apna scope specifically third
category ke concrete patterns tak restrict karta hai — extraneous load
teenon mein se ekmatra hai jahan "ise hamesha minimize karo" unambiguously
correct guidance hai, ise wo component banate hue jahan concrete,
universally-applicable design patterns safely prescribe kiye ja sakte
hain pehle assess kiye bina ki kya ek specific task genuinely reduce ki
ja rahi complexity require karta hai.

## Ek single flow ke across inconsistency ek pure, checkable example kyun hai extraneous load ka task difficulty se zero connection ke saath

Jab identical actions (ek step confirm karna, next stage tak proceed
karna) different labels, positions, ya visual treatments ke saath
present kiye jaate hain wahi flow ke different points pe, user ko har
step pe interface relearn karna padta hai — effort purely presentation
interpret karne mein spend, actual underlying task accomplish karne
mein kuch bhi contribute kiye bina. Yahi exactly wajah hai consistency
sabse reliable, checkable extraneous-load reductions mein se ek hai
available: ise mechanically verify kiya ja sakta hai (kya ye element
har baar wahi function perform karte hue wahi tarike se dikhta aur
behave karta hai?) task ki genuine complexity ke baare mein koi
judgment call require kiye bina.

## Decorative complexity jo koi functional purpose serve nahi karti extraneous load kyun hai sabse direct sense mein

Visual elements jo task ke liye relevant information communicate nahi
karte — decorative animations, unnecessary stylistic flourishes,
competing visual emphasis — wahi limited attention aur working-memory
capacity ka ek portion consume karte hain jise Module 1 ne genuinely
scarce establish kiya, task complete karne ki taraf kuch bhi contribute
kiye bina. Yahi wajah hai purely decorative complexity ko remove karna
sabse lowest-risk, highest-confidence extraneous-load reductions mein
se ek hai: kyunki decoration pehli jagah kabhi task ko serve nahi kar
raha tha, iska removal accidentally genuine, needed intrinsic
complexity ko strip out nahi kar sakta.

## Extraneous ko intrinsic load se distinguish karne ki discipline kisi bhi simplification try karne se pehle kyun aani chahiye

Single sabse consequential mistake jise ye lesson guard karta hai kisi
cheez ko extraneous load ki tarah treat karna hai aur ise remove karna
hai jab ye actually intrinsic load thi jo task ko genuinely chahiye
thi — ek tax form se ek legally mandated field remove karna kyunki ye
"complexity add karta hai" presentation simplify nahi karta, ye actual
task ko break karta hai. Yahi wajah hai Module 1 ki three-way
distinction is lesson ke patterns ko correctly apply karne ke liye ek
prerequisite hai: yahan har pattern (consistency, decoration remove
karna, unnecessary cognitive translation avoid karna) specifically safe
hai kyunki ye us complexity ko target karta hai jo kabhi task ki genuine
requirements ko serve nahi karti thi, aur in patterns ko apply karne ke
liye pehle confirm karna chahiye ki remove ki ja rahi complexity actually
extraneous hai mistakenly assume kiye jaane ke bajaye.

## Ye lesson Module 10 ko kaise open karta hai

User behavior ko shape karne ki ethics pe ek four-module arc close
karne ke baad (Modules 6-9), ye module practical UX psychology ki
taraf wapas aata hai Module 1 ke foundational cognitive load theory mein
directly grounded. Ye lesson specifically extraneous load ke liye
concrete patterns establish karta hai; Lesson 2 progressive disclosure
ko revisit aur deepen karta hai (earlier modules mein already
conceptually introduce kiya gaya) ek targeted extraneous-load technique
ki tarah, aur Lesson 3 chunking ke liye wahi karta hai, is module ke
Module 1 ke theoretical foundation ko interface-design patterns ke ek
complete set mein translate karne ko complete karte hue.`,

    examples: [
      {
        title: 'An extraneous-load audit function applied to a real multi-step form',
        titleHi: 'Ek extraneous-load audit function jo ek real multi-step form pe applied hai',
        codeJs: `function auditExtraneousLoad(interfaceElement) {
  const extraneousLoadSources = [
    { check: 'inconsistentWithRestOfFlow', present: interfaceElement.divergesFromEstablishedPatterns },
    { check: 'purelyDecorativeComplexity', present: interfaceElement.hasVisualElementsWithNoFunctionalPurpose },
    { check: 'unnecessaryCognitiveTranslation', present: interfaceElement.requiresUserToMentallyConvertOrRemap },
  ];
  return extraneousLoadSources.filter((source) => source.present).map((s) => s.check);
}

const checkoutSteps = [
  { name: 'shipping', divergesFromEstablishedPatterns: false, hasVisualElementsWithNoFunctionalPurpose: false, requiresUserToMentallyConvertOrRemap: false },
  { name: 'payment', divergesFromEstablishedPatterns: true, hasVisualElementsWithNoFunctionalPurpose: false, requiresUserToMentallyConvertOrRemap: false }, // different button style than step 1
  { name: 'review', divergesFromEstablishedPatterns: false, hasVisualElementsWithNoFunctionalPurpose: true, requiresUserToMentallyConvertOrRemap: false }, // unnecessary decorative animation
];

const auditResults = checkoutSteps.map((step) => ({
  step: step.name,
  extraneousLoadIssues: auditExtraneousLoad(step),
}));`,
        codeTs: `interface InterfaceElement {
  name: string;
  divergesFromEstablishedPatterns: boolean;
  hasVisualElementsWithNoFunctionalPurpose: boolean;
  requiresUserToMentallyConvertOrRemap: boolean;
}

function auditExtraneousLoad(interfaceElement: InterfaceElement): string[] {
  const extraneousLoadSources = [
    { check: 'inconsistentWithRestOfFlow', present: interfaceElement.divergesFromEstablishedPatterns },
    { check: 'purelyDecorativeComplexity', present: interfaceElement.hasVisualElementsWithNoFunctionalPurpose },
    { check: 'unnecessaryCognitiveTranslation', present: interfaceElement.requiresUserToMentallyConvertOrRemap },
  ];
  return extraneousLoadSources.filter((source) => source.present).map((s) => s.check);
}

const checkoutSteps: InterfaceElement[] = [
  { name: 'shipping', divergesFromEstablishedPatterns: false, hasVisualElementsWithNoFunctionalPurpose: false, requiresUserToMentallyConvertOrRemap: false },
  { name: 'payment', divergesFromEstablishedPatterns: true, hasVisualElementsWithNoFunctionalPurpose: false, requiresUserToMentallyConvertOrRemap: false }, // different button style than step 1
  { name: 'review', divergesFromEstablishedPatterns: false, hasVisualElementsWithNoFunctionalPurpose: true, requiresUserToMentallyConvertOrRemap: false }, // unnecessary decorative animation
];

const auditResults = checkoutSteps.map((step) => ({
  step: step.name,
  extraneousLoadIssues: auditExtraneousLoad(step),
}));`,
        code: `const auditResults = checkoutSteps.map((step) => ({
  step: step.name,
  extraneousLoadIssues: auditExtraneousLoad(step),
}));
// each step's presentation-based issues are surfaced independently of the underlying task's actual complexity`,
        output:
          "The audit flags the payment step for inconsistency with the rest of the flow and the review step for unnecessary decorative complexity, while the shipping step passes cleanly — each flagged issue is specifically a presentation problem, entirely separable from whatever genuine complexity the checkout task itself requires.",
        explain:
          "This example operationalizes the lesson's core diagnostic tool: rather than assessing a form's overall 'complexity' as one undifferentiated quality, it checks each step specifically for the three extraneous-load sources this lesson identifies, correctly isolating presentation issues from the underlying task's real requirements.",
        explainHi:
          "Ye example lesson ke core diagnostic tool ko operationalize karta hai: ek form ki overall 'complexity' ko ek undifferentiated quality ki tarah assess karne ke bajaye, ye har step ko specifically un teen extraneous-load sources ke liye check karta hai jise ye lesson identify karta hai, presentation issues ko underlying task ki real requirements se correctly isolate karte hue.",
      },
    ],

    mistakes: [
      {
        wrong: `// Removing a form field to "reduce complexity" without checking
// whether it's actually intrinsic (required) or extraneous (decorative/redundant)
function simplifyFormWrong(taxForm) {
  // "This form has too many fields, let's cut some to reduce load" —
  // without checking which fields are legally required (intrinsic)
  // versus which are genuinely redundant or poorly presented (extraneous)
  return taxForm.fields.slice(0, taxForm.fields.length / 2);
}`,
        right: `// Distinguishing intrinsic from extraneous complexity before
// removing anything
function simplifyFormRight(taxForm) {
  const extraneousFields = taxForm.fields.filter((f) => f.isRedundantOrDecorative && !f.isLegallyRequired);
  const consolidatedFields = taxForm.fields.filter((f) => !extraneousFields.includes(f));
  // Only genuinely extraneous fields are removed; intrinsic
  // (legally required) complexity remains, organized more clearly
  return consolidatedFields;
}`,
        why: "Removing form fields purely to reduce a raw field count, without first checking whether each field is intrinsically required by the task (a legal requirement, in a tax form's case) or genuinely extraneous, risks breaking the task's actual function — Module 1's three-way load distinction exists specifically to prevent this category of mistake.",
        whyHi:
          "Form fields ko purely ek raw field count kam karne ke liye remove karna, pehle ye check kiye bina ki kya har field task se intrinsically required hai (ek legal requirement, ek tax form ke case mein) ya genuinely extraneous hai, task ke actual function ko break karne ka risk leta hai — Module 1 ki three-way load distinction specifically is category ki mistake ko prevent karne ke liye exist karti hai.",
      },
    ],

    realWorld: [
      {
        en: "A production insurance company's claims-submission form redesign initially planned to remove several fields to 'reduce complexity,' but a Module-1-style intrinsic-vs-extraneous audit revealed most of those fields were legally required documentation — the team instead focused entirely on consistency and layout improvements, reducing perceived difficulty and abandonment rate without removing any legally necessary information.",
        hi: 'Ek production insurance company ke claims-submission form redesign ne initially kai fields remove karne ki plan banayi \'complexity kam karne\' ke liye, par ek Module-1-style intrinsic-vs-extraneous audit ne reveal kiya ki zyada tar wo fields legally required documentation the — team ne iske bajaye poori tarah consistency aur layout improvements pe focus kiya, koi legally necessary information remove kiye bina perceived difficulty aur abandonment rate ko kam karte hue.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is extraneous load, specifically, the one component of Module 1\'s cognitive load framework where "always minimize it" is unambiguous guidance?',
        qHi: 'Extraneous load, specifically, Module 1 ke cognitive load framework ka wo ekmatra component kyun hai jahan "ise hamesha minimize karo" unambiguous guidance hai?',
        a: "Intrinsic load reflects the task's genuine complexity and should be organized, not eliminated; germane load is productive learning effort that should be preserved. Extraneous load, by definition, comes purely from poor presentation and serves no purpose — it can always be minimized toward zero without risk of removing something the task genuinely needs, which is why concrete, universally-applicable design patterns can safely target it specifically.",
        aHi: 'Intrinsic load task ki genuine complexity reflect karta hai aur organize kiya jaana chahiye, eliminate nahi; germane load productive learning effort hai jise preserve kiya jaana chahiye. Extraneous load, definition se, purely poor presentation se aata hai aur koi purpose serve nahi karta — ise hamesha zero ki taraf minimize kiya ja sakta hai kisi cheez ko remove karne ke risk ke bina jo task ko genuinely chahiye, yahi wajah hai concrete, universally-applicable design patterns safely specifically ise target kar sakte hain.',
      },
      {
        q: "Why must a designer distinguish extraneous from intrinsic load BEFORE attempting to simplify an interface?",
        qHi: 'Ek designer ko ek interface simplify karne ki koshish karne SE PEHLE extraneous ko intrinsic load se distinguish kyun karna chahiye?',
        a: "Because removing something that's actually intrinsic load (a legally required form field, a genuinely necessary step) rather than extraneous load (poor presentation) doesn't simplify the interface — it breaks the underlying task. This distinction is the prerequisite for safely applying any extraneous-load-reduction pattern.",
        aHi: 'Kyunki kuch aisa remove karna jo actually intrinsic load hai (ek legally required form field, ek genuinely necessary step) extraneous load ke bajaye (poor presentation) interface ko simplify nahi karta — ye underlying task ko break karta hai. Ye distinction kisi bhi extraneous-load-reduction pattern ko safely apply karne ke liye prerequisite hai.',
      },
    ],

    exercises: [
      {
        task: "A settings page uses three different toggle-switch visual styles (a slider, a checkbox, and a radio button pair) to represent the exact same kind of on/off setting across different sections. Using this lesson's framework, classify this specifically as extraneous or intrinsic load, and explain what change would reduce it without affecting the actual settings being configured.",
        taskHi: 'Ek settings page teen different toggle-switch visual styles use karta hai (ek slider, ek checkbox, aur ek radio button pair) exact wahi kism ki on/off setting represent karne ke liye different sections ke across. Is lesson ke framework use karke, ise specifically extraneous ya intrinsic load ki tarah classify karo, aur explain karo kaunsa change ise kam karega actual settings ko affect kiye bina jo configure ki ja rahi hain.',
        hint: "Ask whether the underlying task (turning a setting on or off) has genuinely different complexity across the three sections, or whether the difficulty is purely coming from having to recognize three different visual conventions for the identical action.",
        hintHi: 'Pucho ki kya underlying task (ek setting ko on ya off karna) teen sections ke across genuinely different complexity rakhta hai, ya kya difficulty purely identical action ke liye teen different visual conventions ko recognize karne se aa rahi hai.',
      },
    ],

    keyTakeaways: [
      "This lesson's scope is deliberately narrow: concrete patterns for eliminating extraneous load specifically — the only one of Module 1's three load types that should always be minimized toward zero.",
      "Inconsistency across a single flow and purely decorative complexity are two concrete, mechanically-checkable sources of extraneous load with zero connection to a task's actual difficulty.",
      "Distinguishing extraneous from intrinsic load must happen before any simplification attempt, since removing genuine intrinsic complexity (mistaken for extraneous) breaks the task rather than simplifying its presentation.",
      "This lesson returns directly to Module 1's foundational cognitive load theory, opening this module's translation of that theory into concrete, implementable interface-design patterns, continued in Lessons 2 and 3.",
    ],
    keyTakeawaysHi: [
      "Is lesson ka scope deliberately narrow hai: specifically extraneous load eliminate karne ke concrete patterns — Module 1 ke teen load types mein se ekmatra jise hamesha zero ki taraf minimize kiya jaana chahiye.",
      'Ek single flow ke across inconsistency aur purely decorative complexity extraneous load ke do concrete, mechanically-checkable sources hain ek task ki actual difficulty se zero connection ke saath.',
      'Extraneous ko intrinsic load se distinguish karna kisi bhi simplification attempt se pehle hona chahiye, kyunki genuine intrinsic complexity (extraneous ke liye mistaken) remove karna task ko break karta hai uski presentation simplify karne ke bajaye.',
      'Ye lesson directly Module 1 ke foundational cognitive load theory pe wapas aata hai, is module ka us theory ko concrete, implementable interface-design patterns mein translation open karte hue, Lessons 2 aur 3 mein continued.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'psych-progressive-disclosure-deepened',
    title: 'Progressive Disclosure as a Cognitive-Load Management Technique',
    titleHi: 'Progressive Disclosure Ek Cognitive-Load Management Technique Ki Tarah',
    description:
      "A specific extraneous-load-reduction technique this course has already used (Module 6's choice architecture), now examined directly through Module 1's cognitive load lens — revealing exactly which component of load progressive disclosure actually reduces, and which it deliberately doesn't touch.",
    descriptionHi:
      'Ek specific extraneous-load-reduction technique jise ye course already use kar chuka hai (Module 6 ka choice architecture), ab directly Module 1 ke cognitive load lens ke through examine kiya gaya — exactly ye reveal karte hue ki progressive disclosure load ka kaunsa component actually kam karta hai, aur kaunsa ye deliberately touch nahi karta.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A museum tour guide who reveals one room at a time, in a deliberate sequence, rather than opening every door simultaneously and leaving visitors to wander a fully-exposed maze of forty rooms at once — the museum's actual content hasn't shrunk, only how much of it demands attention at any single moment.** A museum with forty rooms of genuinely rich, worthwhile content doesn't become less rich by being toured one room at a time — a good guide reveals rooms in a deliberate sequence, letting visitors give full attention to what's actually in front of them before moving to the next room, rather than flinging open every door at once and leaving visitors standing in a hallway trying to process forty rooms' worth of exhibits simultaneously. The total content is identical either way; what changes is how much of it demands cognitive attention at any given moment. This is exactly what progressive disclosure does to interface complexity: it doesn't reduce a task's genuine complexity (the museum's actual content, Module 1's intrinsic load) at all — it changes how much of that complexity is presented for attention at any single moment, revealing it in a deliberate, manageable sequence instead of all at once. This is precisely why progressive disclosure is specifically an EXTRANEOUS-load technique in Module 1's exact terms: the difficulty of processing forty simultaneously-presented rooms rather than one at a time was never part of the museum's actual content — it was an avoidable difficulty created purely by presenting everything at once, which sequential revelation removes without changing the museum itself in any way.",
      hi: 'ek museum tour guide jo ek time pe ek room reveal karta hai, ek deliberate sequence mein, har door ko simultaneously kholne aur visitors ko chalis rooms ke ek fully-exposed maze mein ek saath wander karne dene ke bajaye — museum ka actual content shrink nahi hua, sirf ye ki kitna attention kisi bhi single moment pe demand karta hai. Ek museum jiske paas genuinely rich, worthwhile content ke chalis rooms hain ek time pe ek room tour kiye jaane se less rich nahi banta — ek achha guide rooms ko ek deliberate sequence mein reveal karta hai, visitors ko full attention dete hue jo actually unke saamne hai agle room mein move karne se pehle, har door ko ek saath kholne aur visitors ko ek hallway mein khada karke chalis rooms worth ke exhibits ko simultaneously process karne ki koshish karne dene ke bajaye. Total content dono tarike se identical hai; jo badalta hai ye hai ki kisi bhi given moment pe kitna cognitive attention demand karta hai. Ye exactly wo hai jo progressive disclosure interface complexity ke saath karta hai: ye ek task ki genuine complexity ko bilkul kam nahi karta (museum ka actual content, Module 1 ka intrinsic load) — ye badalta hai ki kitni us complexity ko kisi bhi single moment pe attention ke liye present kiya jaata hai, ise ek deliberate, manageable sequence mein reveal karte hue ek saath ke bajaye. Yahi exactly wajah hai progressive disclosure specifically ek EXTRANEOUS-load technique hai Module 1 ke exact terms mein: chalis simultaneously-presented rooms ko process karne ki difficulty ek time pe ek ke bajaye museum ke actual content ka kabhi part nahi thi — ye ek avoidable difficulty thi jo purely sab kuch ek saath present karke create ki gayi, jise sequential revelation remove karta hai museum ko khud kisi bhi tarike se badle bina.',
    },

    simple: `**The precise, checkable claim this lesson establishes — progressive
disclosure targets extraneous load exclusively, leaving intrinsic and
germane load completely untouched:**

\`\`\`
Progressive disclosure changes WHEN and HOW MUCH of a task's actual
complexity is presented for attention at once — it does NOT reduce
the task's genuine, underlying complexity (intrinsic load) at all.
Revealing 40 settings across 4 sequential screens instead of 1 screen
doesn't make configuring those 40 settings intrinsically easier — it
reduces the EXTRANEOUS difficulty of processing all 40 simultaneously.
\`\`\`

**A concrete, checkable re-examination of the exact pattern this
course introduced in Module 6 — now analyzed specifically through
Module 1's load-type lens:**

\`\`\`ts
function analyzeProgressiveDisclosureLoadEffect(flatVersion, progressiveVersion) {
  return {
    intrinsicLoadChange: 'none — the same 40 settings must ultimately be configured either way',
    extraneousLoadChange: 'reduced — at most, only 10 settings are visible and demanding attention at once, rather than 40',
    germaneLoadChange: 'none — this technique doesn\\'t change how much genuine learning effort a user invests',
  };
}
\`\`\`

**A concrete, implementable pattern demonstrating exactly where the
line falls — progressive disclosure applied correctly (reducing
extraneous load) versus incorrectly (accidentally hiding intrinsic
complexity the user actually needs to see):**

\`\`\`tsx
// CORRECT: progressive disclosure hides EXTRANEOUS complexity (settings
// most users never need) while keeping intrinsically necessary
// information immediately visible
function AdvancedSettingsCorrect({ commonSettings, advancedSettings }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <div>
      <SettingsList settings={commonSettings} /> {/* intrinsically
        relevant to most users — always visible */}
      <button onClick={() => setShowAdvanced(true)}>Show advanced settings</button>
      {showAdvanced && <SettingsList settings={advancedSettings} />}
    </div>
  );
}

// INCORRECT: hiding information the user intrinsically needs to see
// RIGHT NOW behind an extra click, mistaking necessary complexity for
// extraneous complexity
function CriticalWarningHiddenIncorrectly({ dataLossWarning }) {
  const [showWarning, setShowWarning] = useState(false);
  return (
    <div>
      <button onClick={() => setShowWarning(true)}>Show details</button>
      {showWarning && <Warning>{dataLossWarning}</Warning>}
      {/* A data-loss warning is intrinsically necessary for THIS
          decision — hiding it behind a click doesn't reduce
          extraneous load, it obscures required information */}
    </div>
  );
}
\`\`\`

**A concrete, checkable heuristic for deciding what belongs behind
progressive disclosure versus what must remain immediately visible —
directly derived from the intrinsic/extraneous distinction:**

\`\`\`ts
function shouldBeProgressivelyDisclosed(informationOrControl) {
  const isNeededByMostUsersRightNow = informationOrControl.relevantToTypicalImmediateTask;
  const isCriticalRegardlessOfFrequency = informationOrControl.consequenceOfMissingItIsSevere;

  if (isCriticalRegardlessOfFrequency) {
    return false; // NEVER hide genuinely critical information behind
    // progressive disclosure, regardless of how rarely it applies —
    // this would hide intrinsic necessity, not reduce extraneous load
  }
  return !isNeededByMostUsersRightNow; // hide only what's genuinely
  // not needed by most users in the immediate task
}
\`\`\`

**Why this lesson revisits rather than merely repeats Module 6's
choice-architecture treatment of progressive disclosure:**

\`\`\`
Module 6 introduced progressive disclosure primarily through Hick's
Law (decision TIME as a function of option count). This lesson
re-examines the identical technique through Module 1's cognitive load
lens specifically, which reveals a related but distinct benefit:
Hick's Law explains why fewer simultaneous OPTIONS speeds up a
DECISION; this lesson's cognitive-load framing explains why less
simultaneous INFORMATION reduces the EFFORT of processing a complex
INTERFACE more broadly, whether or not a decision is actually being
made at that moment.
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established general
patterns (consistency, removing decoration) for eliminating extraneous
load. This lesson deepens one specific, powerful technique — already
introduced in Module 6 but now analyzed precisely through Module 1's
three-way load framework — establishing exactly which load type it
affects and, critically, the heuristic for avoiding its most common
misapplication: hiding genuinely necessary information rather than
merely extraneous complexity.`,

    simpleHi: `**Precise, checkable claim jise ye lesson establish karta hai —
progressive disclosure exclusively extraneous load ko target karta
hai, intrinsic aur germane load ko completely untouched chhodte hue:**

\`\`\`
Progressive disclosure badalta hai ki KAB aur KITNI ek task ki actual
complexity ek saath attention ke liye present ki jaati hai — ye task
ki genuine, underlying complexity (intrinsic load) ko bilkul kam nahi
karta. 40 settings ko 4 sequential screens ke across reveal karna 1
screen ke bajaye un 40 settings ko configure karna intrinsically
aasan nahi banata — ye sab 40 ko simultaneously process karne ki
EXTRANEOUS difficulty ko kam karta hai.
\`\`\`

**Ek concrete, checkable re-examination us exact pattern ka jise ye
course Module 6 mein introduce kar chuka hai — ab specifically Module
1 ke load-type lens ke through analyzed:**

\`\`\`ts
function analyzeProgressiveDisclosureLoadEffect(flatVersion, progressiveVersion) {
  return {
    intrinsicLoadChange: 'none — the same 40 settings must ultimately be configured either way',
    extraneousLoadChange: 'reduced — at most, only 10 settings are visible and demanding attention at once, rather than 40',
    germaneLoadChange: 'none — this technique doesn\\'t change how much genuine learning effort a user invests',
  };
}
\`\`\`

**Ek concrete, implementable pattern jo exactly dikhata hai ki line
kahan girti hai — progressive disclosure correctly applied (extraneous
load kam karte hue) versus incorrectly (accidentally intrinsic
complexity chhupate hue jise user ko actually dekhne ki zaroorat hai):**

\`\`\`tsx
// CORRECT: progressive disclosure EXTRANEOUS complexity chhupata hai
// (settings jinhe zyada tar users ko kabhi chahiye nahi) jabki
// intrinsically necessary information ko immediately visible rakhte hue
function AdvancedSettingsCorrect({ commonSettings, advancedSettings }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <div>
      <SettingsList settings={commonSettings} /> {/* zyada tar users
        ke liye intrinsically relevant — hamesha visible */}
      <button onClick={() => setShowAdvanced(true)}>Show advanced settings</button>
      {showAdvanced && <SettingsList settings={advancedSettings} />}
    </div>
  );
}

// INCORRECT: information ko chhupana jise user ko ABHI intrinsically
// dekhne ki zaroorat hai ek extra click ke peeche, necessary complexity
// ko extraneous complexity ke liye mistake karte hue
function CriticalWarningHiddenIncorrectly({ dataLossWarning }) {
  const [showWarning, setShowWarning] = useState(false);
  return (
    <div>
      <button onClick={() => setShowWarning(true)}>Show details</button>
      {showWarning && <Warning>{dataLossWarning}</Warning>}
      {/* Ek data-loss warning IS decision ke liye intrinsically
          necessary hai — ise ek click ke peeche chhupana extraneous
          load kam nahi karta, ye required information ko obscure karta hai */}
    </div>
  );
}
\`\`\`

**Ye decide karne ka ek concrete, checkable heuristic ki kya progressive
disclosure ke peeche belong karta hai versus kya immediately visible
rehna chahiye — directly intrinsic/extraneous distinction se derived:**

\`\`\`ts
function shouldBeProgressivelyDisclosed(informationOrControl) {
  const isNeededByMostUsersRightNow = informationOrControl.relevantToTypicalImmediateTask;
  const isCriticalRegardlessOfFrequency = informationOrControl.consequenceOfMissingItIsSevere;

  if (isCriticalRegardlessOfFrequency) {
    return false; // KABHI genuinely critical information ko
    // progressive disclosure ke peeche mat chhupaao, ye kitni rarely
    // apply hota hai isse independently — ye intrinsic necessity ko
    // chhupayega, extraneous load kam nahi karega
  }
  return !isNeededByMostUsersRightNow; // sirf wo chhupaao jo genuinely
  // zyada tar users ko immediate task mein nahi chahiye
}
\`\`\`

**Ye lesson Module 6 ke progressive disclosure ke choice-architecture
treatment ko revisit kyun karta hai sirf repeat karne ke bajaye:**

\`\`\`
Module 6 ne progressive disclosure ko primarily Hick's Law ke through
introduce kiya (decision TIME option count ke function ki tarah). Ye
lesson identical technique ko specifically Module 1 ke cognitive load
lens ke through re-examine karta hai, jo ek related par distinct
benefit reveal karta hai: Hick's Law explain karta hai ki kam
simultaneous OPTIONS ek DECISION ko kyun speed up karte hain; is
lesson ka cognitive-load framing explain karta hai ki kam simultaneous
INFORMATION ek complex INTERFACE ko process karne ke EFFORT ko zyada
broadly kyun kam karta hai, chahe us moment pe koi decision actually
banayi ja rahi ho ya nahi.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne general
patterns establish kiye (consistency, decoration remove karna)
extraneous load eliminate karne ke liye. Ye lesson ek specific,
powerful technique ko deepen karta hai — already Module 6 mein
introduce ki gayi par ab precisely Module 1 ke three-way load framework
ke through analyzed — exactly establish karte hue ki ye kaunsa load
type affect karta hai aur, critically, uski sabse common misapplication
avoid karne ka heuristic: genuinely necessary information ko chhupana
merely extraneous complexity ke bajaye.`,

    content: `## Why progressive disclosure targets extraneous load exclusively,
leaving intrinsic and germane load entirely unchanged

Progressive disclosure changes when and how much of a task's actual
content is presented for attention at any given moment — it does not
reduce the underlying complexity of the task itself. Configuring 40
genuinely necessary settings remains a 40-setting task whether those
settings appear on one screen or across four sequential screens; what
changes is purely how much of that unchanged complexity demands
simultaneous attention. This is precisely why progressive disclosure
belongs specifically in the extraneous-load category of Module 1's
framework: the difficulty of processing many things simultaneously,
rather than in a manageable sequence, was never part of the task's
genuine content — it was an avoidable difficulty of presentation that
sequential revelation removes.

## Why this lesson revisits rather than duplicates Module 6's
treatment of the identical technique

Module 6 introduced progressive disclosure primarily through Hick's
Law, explaining why reducing simultaneously-presented options speeds
up a specific decision. This lesson examines the same technique
through a related but distinct lens: Module 1's cognitive load theory,
which applies more broadly than decision-making specifically — it
concerns the effort of processing and comprehending an interface at
all, not only the speed of choosing among options. Together, these two
framings (Hick's Law's decision-speed benefit, this lesson's general
cognitive-load benefit) provide a more complete account of why
progressive disclosure works than either framing provides alone.

## Why the critical failure mode is hiding genuinely necessary
information rather than merely extraneous complexity

The most consequential mistake in applying progressive disclosure is
hiding information a user intrinsically needs for their current
decision or task behind an additional interaction step — a data-loss
warning, a critical safety notice, information whose absence carries
severe consequences. This isn't a reduction in extraneous load at
all; it's an accidental removal of intrinsic necessity, mistaking
"this information isn't needed by most users most of the time" for
"this information is never critical," when the correct test is
whether the specific consequence of missing it is severe regardless
of how rarely it applies.

## Why a specific, checkable heuristic (frequency of need versus
severity of consequence) correctly distinguishes safe from unsafe
disclosure

Information genuinely safe to hide behind progressive disclosure is
both infrequently needed by the typical user AND has a low-severity
consequence if occasionally missed by someone who did need it.
Information that fails either condition — needed frequently, or
carrying severe consequences even if rarely relevant — should remain
immediately visible regardless of how it affects the interface's
overall apparent complexity. This two-part check operationalizes the
intrinsic/extraneous distinction specifically for progressive
disclosure decisions.

## How this lesson connects to and deepens Lesson 1

Lesson 1 established general-purpose techniques (consistency, removing
decoration) for reducing extraneous load broadly. This lesson takes
one specific, already-familiar technique from Module 6 and re-examines
it precisely through Module 1's load-type framework, establishing
exactly which load type it targets and supplying the specific
heuristic needed to apply it correctly without accidentally hiding
genuine, necessary complexity — setting up Lesson 3's parallel
treatment of chunking as this module's third concrete
extraneous-load-reduction pattern.`,

    contentHi: `## Progressive disclosure exclusively extraneous load ko kyun target karta hai, intrinsic aur germane load ko poori tarah unchanged chhodte hue

Progressive disclosure badalta hai ki task ka actual content kab aur
kitna kisi bhi given moment pe attention ke liye present kiya jaata
hai — ye task khud ki underlying complexity ko kam nahi karta. 40
genuinely necessary settings configure karna ek 40-setting task rehta
hai chahe wo settings ek screen pe appear karein ya char sequential
screens ke across; jo badalta hai ye purely hai ki us unchanged
complexity ka kitna simultaneous attention demand karta hai. Yahi
exactly wajah hai progressive disclosure specifically Module 1 ke
framework ki extraneous-load category mein belong karta hai: kai
cheezon ko simultaneously process karne ki difficulty, ek manageable
sequence mein hone ke bajaye, kabhi task ke genuine content ka part
nahi thi — ye presentation ki ek avoidable difficulty thi jise
sequential revelation remove karta hai.

## Ye lesson Module 6 ke identical technique ke treatment ko revisit kyun karta hai duplicate karne ke bajaye

Module 6 ne progressive disclosure ko primarily Hick's Law ke through
introduce kiya, explain karte hue ki simultaneously-presented options
kam karna ek specific decision ko kyun speed up karta hai. Ye lesson
wahi technique ko ek related par distinct lens ke through examine
karta hai: Module 1 ka cognitive load theory, jo decision-making se
specifically zyada broadly apply hota hai — ye ek interface ko poori
tarah process aur comprehend karne ke effort ke baare mein hai, sirf
options ke beech choose karne ki speed nahi. Saath, ye do framings
(Hick's Law ka decision-speed benefit, is lesson ka general
cognitive-load benefit) progressive disclosure kaam kyun karta hai
iska ek zyada complete account provide karte hain kisi bhi ek framing
akele se zyada.

## Critical failure mode genuinely necessary information ko chhupana kyun hai sirf extraneous complexity ke bajaye

Progressive disclosure apply karne mein sabse consequential mistake
ek user ko unke current decision ya task ke liye intrinsically chahiye
information ko ek additional interaction step ke peeche chhupana hai —
ek data-loss warning, ek critical safety notice, information jiski
absence severe consequences carry karti hai. Ye extraneous load mein
koi reduction bilkul nahi hai; ye intrinsic necessity ka ek accidental
removal hai, "ye information zyada tar users ko zyada tar time nahi
chahiye" ko "ye information kabhi critical nahi hai" ke liye mistake
karte hue, jab correct test ye hai ki kya use miss karne ka specific
consequence severe hai chahe ye kitna bhi rarely apply hota ho.

## Ek specific, checkable heuristic (need ki frequency versus consequence ki severity) safe ko unsafe disclosure se correctly kyun distinguish karta hai

Information jo genuinely progressive disclosure ke peeche chhupane ke
liye safe hai typical user ko infrequently chahiye HAI AUR agar
occasionally kisi ko miss ho jaaye jise chahiye tha to low-severity
consequence rakhti hai. Information jo kisi bhi condition mein fail
hoti hai — frequently chahiye, ya rarely relevant hone ke bawajood
severe consequences carry karti hai — ko immediately visible rehna
chahiye chahe ye interface ki overall apparent complexity ko kaise
affect kare. Ye two-part check specifically progressive disclosure
decisions ke liye intrinsic/extraneous distinction ko operationalize
karta hai.

## Ye lesson Lesson 1 se kaise connect karta hai aur ise deepen karta hai

Lesson 1 ne general-purpose techniques establish kiye (consistency,
decoration remove karna) extraneous load ko broadly reduce karne ke
liye. Ye lesson Module 6 se ek specific, already-familiar technique
leta hai aur ise precisely Module 1 ke load-type framework ke through
re-examine karta hai, exactly establish karte hue ki ye kaunsa load
type target karta hai aur us specific heuristic ko supply karte hue jo
ise correctly apply karne ke liye chahiye genuine, necessary complexity
ko accidentally chhupaye bina — Lesson 3 ke chunking ke parallel
treatment ko set up karte hue is module ke third concrete
extraneous-load-reduction pattern ki tarah.`,

    examples: [
      {
        title: 'A disclosure-safety checker distinguishing safe extraneous-load hiding from unsafe intrinsic-necessity hiding',
        titleHi: 'Ek disclosure-safety checker jo safe extraneous-load hiding ko unsafe intrinsic-necessity hiding se distinguish karta hai',
        codeJs: `function shouldBeProgressivelyDisclosed(item) {
  if (item.consequenceOfMissingItIsSevere) {
    return { hide: false, reason: 'Critical regardless of frequency — hiding this would obscure intrinsic necessity, not reduce extraneous load' };
  }
  if (!item.relevantToTypicalImmediateTask) {
    return { hide: true, reason: 'Not needed by most users right now — safe to disclose progressively' };
  }
  return { hide: false, reason: 'Relevant to the typical immediate task — keep visible' };
}

const dataLossWarning = { consequenceOfMissingItIsSevere: true, relevantToTypicalImmediateTask: false };
console.log(shouldBeProgressivelyDisclosed(dataLossWarning));
// { hide: false, reason: 'Critical regardless of frequency...' }

const advancedFormattingOption = { consequenceOfMissingItIsSevere: false, relevantToTypicalImmediateTask: false };
console.log(shouldBeProgressivelyDisclosed(advancedFormattingOption));
// { hide: true, reason: 'Not needed by most users right now...' }`,
        codeTs: `interface DisclosureCandidate {
  consequenceOfMissingItIsSevere: boolean;
  relevantToTypicalImmediateTask: boolean;
}

interface DisclosureDecision {
  hide: boolean;
  reason: string;
}

function shouldBeProgressivelyDisclosed(item: DisclosureCandidate): DisclosureDecision {
  if (item.consequenceOfMissingItIsSevere) {
    return { hide: false, reason: 'Critical regardless of frequency — hiding this would obscure intrinsic necessity, not reduce extraneous load' };
  }
  if (!item.relevantToTypicalImmediateTask) {
    return { hide: true, reason: 'Not needed by most users right now — safe to disclose progressively' };
  }
  return { hide: false, reason: 'Relevant to the typical immediate task — keep visible' };
}

const dataLossWarning: DisclosureCandidate = { consequenceOfMissingItIsSevere: true, relevantToTypicalImmediateTask: false };
console.log(shouldBeProgressivelyDisclosed(dataLossWarning));
// { hide: false, reason: 'Critical regardless of frequency...' }

const advancedFormattingOption: DisclosureCandidate = { consequenceOfMissingItIsSevere: false, relevantToTypicalImmediateTask: false };
console.log(shouldBeProgressivelyDisclosed(advancedFormattingOption));
// { hide: true, reason: 'Not needed by most users right now...' }`,
        code: `if (item.consequenceOfMissingItIsSevere) {
  return { hide: false, reason: 'Critical regardless of frequency...' };
}
// severity check comes FIRST, overriding frequency — a rare but
// severe-consequence item is never hidden`,
        output:
          "The data-loss warning, despite being rarely relevant, is correctly kept visible because its consequence severity overrides its low frequency. The advanced formatting option, being both infrequent and low-consequence, is correctly flagged safe to hide behind progressive disclosure.",
        explain:
          "This example implements the lesson's core safety heuristic directly: severity is checked before frequency, ensuring a rare-but-critical item is never accidentally hidden — the specific safeguard against this lesson's identified failure mode of confusing infrequent-need with safe-to-hide.",
        explainHi:
          "Ye example lesson ke core safety heuristic ko directly implement karta hai: severity frequency se pehle check ki jaati hai, ye ensure karte hue ki ek rare-but-critical item kabhi accidentally hidden na ho — is lesson ke identified failure mode ke against specific safeguard infrequent-need ko safe-to-hide ke saath confuse karne ke.",
      },
    ],

    mistakes: [
      {
        wrong: `// Hiding a critical, rarely-triggered warning behind progressive
// disclosure purely because it's infrequently relevant
function DeleteConfirmationWrong({ willPermanentlyDeleteAllData }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div>
      <button onClick={() => setShowDetails(true)}>More info</button>
      {showDetails && <p>This will permanently delete all your data.</p>}
      <button onClick={confirmDelete}>Delete</button>
      {/* The consequence is severe (permanent data loss) — hiding it
          behind a click because "most users won't click More info
          anyway" mistakes infrequent attention for safe-to-hide */}
    </div>
  );
}`,
        right: `// Keeping severe-consequence information immediately visible,
// regardless of how rarely a user might need to consider it
function DeleteConfirmationRight() {
  return (
    <div>
      <p className="critical-warning">This will permanently delete all your data.</p>
      <button onClick={confirmDelete}>Delete</button>
      {/* Severity of consequence, not frequency of relevance, determines
          visibility here — this information is never progressively disclosed */}
    </div>
  );
}`,
        why: "Hiding information behind progressive disclosure purely because most users won't need to consider it carefully mistakes low frequency of attention for low severity of consequence — this lesson's heuristic requires checking severity first, since a rare but catastrophic consequence (permanent data loss) must remain immediately visible regardless of how often it's actually consulted.",
        whyHi:
          "Information ko progressive disclosure ke peeche chhupana purely is wajah se ki zyada tar users ko ise carefully consider karne ki zaroorat nahi hogi low frequency of attention ko low severity of consequence ke liye mistake karta hai — is lesson ka heuristic pehle severity check karna maangta hai, kyunki ek rare par catastrophic consequence (permanent data loss) ko immediately visible rehna chahiye chahe ise actually kitni baar consult kiya jaata ho.",
      },
    ],

    realWorld: [
      {
        en: "A production cloud infrastructure tool's 'irreversible action' confirmation dialogs were audited using this lesson's severity-first heuristic after a customer accidentally deleted production data that had been described in a collapsed, progressively-disclosed section — the audit resulted in a policy that any action with severe or irreversible consequences must remain immediately visible, regardless of how infrequently that specific action is taken.",
        hi: 'Ek production cloud infrastructure tool ke \'irreversible action\' confirmation dialogs ka audit is lesson ke severity-first heuristic use karke kiya gaya ek customer ke accidentally production data delete karne ke baad jise ek collapsed, progressively-disclosed section mein describe kiya gaya tha — audit ka result ek policy tha ki severe ya irreversible consequences wali koi bhi action ko immediately visible rehna chahiye, chahe wo specific action kitni bhi infrequently li jaati ho.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does progressive disclosure specifically target extraneous load rather than intrinsic load, per Module 1\'s framework?',
        qHi: "Progressive disclosure Module 1 ke framework ke hisaab se specifically extraneous load ko kyun target karta hai intrinsic load ko nahi?",
        a: "Progressive disclosure changes when and how much of a task's content is presented for simultaneous attention — it doesn't reduce the underlying complexity of the task itself. The same amount of genuine complexity must ultimately be addressed either way; only the difficulty of processing it all at once, rather than sequentially, is eliminated, which is precisely the definition of extraneous load.",
        aHi: 'Progressive disclosure badalta hai ki task ka content simultaneous attention ke liye kab aur kitna present kiya jaata hai — ye task khud ki underlying complexity ko kam nahi karta. Wahi amount ki genuine complexity ko ultimately dono tarike se address karna chahiye; sirf ise sab ek saath process karne ki difficulty, sequentially ke bajaye, eliminate ki jaati hai, jo precisely extraneous load ki definition hai.',
      },
      {
        q: "What is the specific heuristic that prevents progressive disclosure from accidentally hiding intrinsically necessary information?",
        qHi: 'Wo specific heuristic kya hai jo progressive disclosure ko accidentally intrinsically necessary information chhupane se rokta hai?',
        a: "Check severity of consequence before frequency of need — if missing a piece of information carries a severe consequence, it must remain immediately visible regardless of how rarely it's relevant. Only information that is both infrequently needed AND low-severity if missed is safe to hide behind progressive disclosure.",
        aHi: 'Need ki frequency se pehle consequence ki severity check karo — agar information ka ek piece miss karna ek severe consequence carry karta hai, ise immediately visible rehna chahiye chahe ye kitna bhi rarely relevant ho. Sirf wo information jo infrequently needed HAI AUR miss hone pe low-severity hai progressive disclosure ke peeche chhupane ke liye safe hai.',
      },
    ],

    exercises: [
      {
        task: "A file-upload feature hides the maximum file size limit behind a small 'i' info icon that most users never click, and users occasionally attempt uploads that silently fail because they exceed this hidden limit. Using this lesson's severity-first heuristic, evaluate whether hiding this specific information behind progressive disclosure was appropriate, and propose a fix.",
        taskHi: 'Ek file-upload feature maximum file size limit ko ek chhote \'i\' info icon ke peeche chhupata hai jise zyada tar users kabhi click nahi karte, aur users occasionally uploads attempt karte hain jo silently fail hote hain kyunki wo is hidden limit ko exceed karte hain. Is lesson ke severity-first heuristic use karke, evaluate karo ki kya is specific information ko progressive disclosure ke peeche chhupana appropriate tha, aur ek fix propose karo.',
        hint: "Think about the consequence of a user not knowing the size limit before attempting an upload that then silently fails — is this a low-severity inconvenience or does it meet this lesson's bar for information that should remain immediately visible?",
        hintHi: 'Socho ki ek user ko size limit na pata hone ka consequence kya hai ek upload attempt karne se pehle jo phir silently fail ho jaata hai — kya ye ek low-severity inconvenience hai ya ye is lesson ke bar ko meet karta hai us information ke liye jise immediately visible rehna chahiye?',
      },
    ],

    keyTakeaways: [
      "Progressive disclosure targets extraneous load exclusively — it changes when and how much complexity is presented at once, without reducing the task's genuine, underlying (intrinsic) complexity at all.",
      "This lesson deepens Module 6's decision-speed framing (Hick's Law) with Module 1's broader cognitive-load framing, showing the same technique reduces general interface-processing effort, not just decision time.",
      "The critical failure mode is hiding genuinely necessary (intrinsic) information behind progressive disclosure, mistaking infrequent relevance for safe-to-hide.",
      "A severity-first heuristic (check consequence severity before frequency of need) correctly distinguishes safe extraneous-load hiding from unsafe intrinsic-necessity hiding.",
    ],
    keyTakeawaysHi: [
      'Progressive disclosure exclusively extraneous load ko target karta hai — ye badalta hai ki kab aur kitni complexity ek saath present ki jaati hai, task ki genuine, underlying (intrinsic) complexity ko bilkul kam kiye bina.',
      "Ye lesson Module 6 ke decision-speed framing (Hick's Law) ko Module 1 ke broader cognitive-load framing se deepen karta hai, dikhate hue ki wahi technique general interface-processing effort kam karti hai, sirf decision time nahi.",
      'Critical failure mode genuinely necessary (intrinsic) information ko progressive disclosure ke peeche chhupana hai, infrequent relevance ko safe-to-hide ke liye mistake karte hue.',
      'Ek severity-first heuristic (need ki frequency se pehle consequence severity check karo) safe extraneous-load hiding ko unsafe intrinsic-necessity hiding se correctly distinguish karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'psych-chunking-in-interface-design',
    title: 'Chunking in Interface Design — Concrete, Implementable Patterns',
    titleHi: 'Interface Design Mein Chunking — Concrete, Implementable Patterns',
    description:
      "Closing this module: chunking, first established in Module 1 as the mechanism behind working memory's effective capacity, given its own concrete, checkable interface-design patterns — completing this module's translation of cognitive load theory into a full, practical toolkit.",
    descriptionHi:
      'Is module ko close karte hue: chunking, jo pehle Module 1 mein working memory ki effective capacity ke peeche mechanism ki tarah establish ki gayi, ko apne khud ke concrete, checkable interface-design patterns diye gaye — is module ka cognitive load theory ka ek full, practical toolkit mein translation complete karte hue.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**Reading a phone number formatted as 555-867-5309 versus the identical ten digits presented as 5558675309 — the exact same information, but one version is grouped into a small number of meaningful chunks while the other demands processing ten individual, ungrouped digits.** The digits 5, 5, 5, 8, 6, 7, 5, 3, 0, 9 are exactly the same information whether they're written with hyphens or without — nothing about the actual number has changed. But 555-867-5309 is processed by the mind as roughly three chunks (Module 1's chunking mechanism, applied concretely) while 5558675309 is processed as ten individual digits pushing right up against working memory's actual capacity limits established in Module 1. The formatting adds zero new information and removes zero real information — it purely changes how many discrete units the same information is organized into for the mind's actual processing, and this organizational choice alone measurably affects how easily the number can be held in mind, read back correctly, or remembered briefly. This is exactly what chunking-based interface design does at a larger scale: a genuinely complex interface's actual information content stays completely identical, but organizing that content into a small number of meaningful, well-labeled groups — rather than presenting it as one long undifferentiated list — measurably changes how much effort processing it actually requires, for precisely the same reason a hyphenated phone number is easier to hold in mind than the identical ten ungrouped digits.",
      hi: 'ek phone number ko 555-867-5309 ki tarah formatted padhna versus identical ten digits ko 5558675309 ki tarah present kiya gaya — exact wahi information, par ek version ek chhoti number of meaningful chunks mein grouped hai jabki doosra ten individual, ungrouped digits process karne ki demand karta hai. Digits 5, 5, 5, 8, 6, 7, 5, 3, 0, 9 exactly wahi information hain chahe wo hyphens ke saath likhe jaayein ya bina — number ke baare mein kuch nahi badla. Par 555-867-5309 mind dwara roughly teen chunks ki tarah process kiya jaata hai (Module 1 ka chunking mechanism, concretely applied) jabki 5558675309 ten individual digits ki tarah process kiya jaata hai working memory ki actual capacity limits ke bilkul against push karte hue jo Module 1 mein established hain. Formatting zero new information add karti hai aur zero real information remove karti hai — ye purely badalti hai ki wahi information kitne discrete units mein organize ki jaati hai mind ki actual processing ke liye, aur ye organizational choice akela measurably affect karti hai ki number ko mind mein hold karna, correctly read back karna, ya briefly yaad rakhna kitna aasan hai. Ye exactly wo hai jo chunking-based interface design ek larger scale pe karta hai: ek genuinely complex interface ka actual information content poori tarah identical rehta hai, par us content ko meaningful, well-labeled groups ki ek chhoti number mein organize karna — ek long undifferentiated list ki tarah present karne ke bajaye — measurably badalta hai ki ise process karna actually kitna effort maangta hai, precisely wahi wajah se ki ek hyphenated phone number ten ungrouped digits se mind mein hold karna aasan hai.',
    },

    simple: `**A direct return to Module 1's chunking mechanism — this lesson's
scope is translating it into concrete interface-design patterns:**

\`\`\`
Module 1 established: working memory holds roughly 4 meaningful
CHUNKS, not a fixed number of raw items — grouping raw items into
fewer, larger chunks effectively increases how much information can
be held in mind at once.

This lesson: concrete patterns for deliberately organizing interface
content into well-formed chunks, directly reducing the extraneous
load of processing many individual, ungrouped items.
\`\`\`

**A concrete, checkable pattern — grouping a long, flat list of form
fields into labeled sections, converting many individual items into a
small number of meaningful chunks:**

\`\`\`tsx
// UNCHUNKED: 12 individual fields, each processed as a separate item
function AddressFormUnchunked() {
  return (
    <form>
      <input placeholder="Street" />
      <input placeholder="Apt" />
      <input placeholder="City" />
      <input placeholder="State" />
      <input placeholder="Zip" />
      <input placeholder="Country" />
      <input placeholder="Card number" />
      <input placeholder="Expiry" />
      <input placeholder="CVV" />
      <input placeholder="Name on card" />
      <input placeholder="Phone" />
      <input placeholder="Email" />
      {/* 12 individually-processed items — well beyond Module 1's
          working-memory chunk capacity */}
    </form>
  );
}

// CHUNKED: the SAME 12 fields organized into 3 meaningful, labeled
// groups — 3 chunks instead of 12 individual items
function AddressFormChunked() {
  return (
    <form>
      <fieldset>
        <legend>Shipping Address</legend>
        <input placeholder="Street" /><input placeholder="Apt" />
        <input placeholder="City" /><input placeholder="State" />
        <input placeholder="Zip" /><input placeholder="Country" />
      </fieldset>
      <fieldset>
        <legend>Payment</legend>
        <input placeholder="Card number" /><input placeholder="Expiry" />
        <input placeholder="CVV" /><input placeholder="Name on card" />
      </fieldset>
      <fieldset>
        <legend>Contact</legend>
        <input placeholder="Phone" /><input placeholder="Email" />
      </fieldset>
      {/* Identical 12 fields — zero information added or removed —
          but organized into 3 meaningful chunks instead of 12 items */}
    </form>
  );
}
\`\`\`

**A concrete, checkable heuristic for what makes a "good" chunk — not
merely any grouping, but a grouping that reflects genuine, meaningful
structure:**

\`\`\`ts
function isGoodChunk(proposedGroup) {
  return (
    proposedGroup.itemsShareAGenuineConceptualRelationship && // NOT an
    // arbitrary grouping — items belong together because of what
    // they actually represent (all shipping-related, all payment-related)
    proposedGroup.hasAClearLabelReflectingThatRelationship && // the
    // group's purpose is immediately legible, not just visually boxed
    proposedGroup.sizeIsItselfWithinChunkingLimits // a "chunk" with 15
    // items inside it isn't a genuine chunk — it's just a smaller
    // unchunked list wearing a label
  );
}
\`\`\`

**Why a chunk's internal size matters just as much as the number of
chunks — a specific, checkable nuance this lesson adds beyond the
basic pattern:**

\`\`\`
A page organized into 3 labeled sections, each containing 15
ungrouped fields, has NOT actually solved the chunking problem — it's
moved the same raw-item processing burden one level down, from "12
ungrouped fields" to "15 ungrouped fields within one section." Genuine
chunking requires the CONTENTS of each chunk, not just the top-level
grouping, to also respect reasonable size limits — chunking is a
principle to apply recursively, not a one-time top-level grouping
exercise.
\`\`\`

**A concrete, checkable audit function combining this lesson's two
criteria — good grouping AND appropriately-sized chunks:**

\`\`\`ts
function auditChunkingQuality(interfaceSection) {
  const issues = [];
  if (!isGoodChunk(interfaceSection)) {
    issues.push('Grouping does not reflect a genuine conceptual relationship');
  }
  if (interfaceSection.items.length > 7) {
    issues.push(\`Chunk contains \${interfaceSection.items.length} items — likely needs further sub-chunking\`);
  }
  return issues;
}
\`\`\`

**How this lesson closes Module 10:** Lesson 1 established general
patterns for eliminating extraneous load; Lesson 2 deepened progressive
disclosure as one specific technique. This lesson completes the
module's translation of Module 1's cognitive load theory into a full,
practical toolkit by giving chunking — the mechanism underlying
working memory's effective capacity — its own concrete, implementable
interface patterns, closing the loop from this course's foundational
Module 1 concept to a complete set of applied UX techniques.`,

    simpleHi: `**Module 1 ke chunking mechanism ki taraf ek direct return — is
lesson ka scope ise concrete interface-design patterns mein translate
karna hai:**

\`\`\`
Module 1 ne establish kiya: working memory roughly 4 meaningful
CHUNKS hold karti hai, raw items ki ek fixed number nahi — raw items
ko kam, larger chunks mein group karna effectively badhata hai ki
kitna information ek saath mind mein hold ki ja sakti hai.

Ye lesson: interface content ko deliberately well-formed chunks mein
organize karne ke concrete patterns, directly kai individual,
ungrouped items ko process karne ki extraneous load kam karte hue.
\`\`\`

**Ek concrete, checkable pattern — ek long, flat list of form fields
ko labeled sections mein group karna, kai individual items ko
meaningful chunks ki ek small number mein convert karte hue:**

\`\`\`tsx
// UNCHUNKED: 12 individual fields, har ek ek separate item ki tarah process
function AddressFormUnchunked() {
  return (
    <form>
      <input placeholder="Street" />
      <input placeholder="Apt" />
      <input placeholder="City" />
      <input placeholder="State" />
      <input placeholder="Zip" />
      <input placeholder="Country" />
      <input placeholder="Card number" />
      <input placeholder="Expiry" />
      <input placeholder="CVV" />
      <input placeholder="Name on card" />
      <input placeholder="Phone" />
      <input placeholder="Email" />
      {/* 12 individually-processed items — Module 1 ki working-memory
          chunk capacity se kaafi aage */}
    </form>
  );
}

// CHUNKED: WAHI 12 fields 3 meaningful, labeled groups mein organized
// — 12 individual items ke bajaye 3 chunks
function AddressFormChunked() {
  return (
    <form>
      <fieldset>
        <legend>Shipping Address</legend>
        <input placeholder="Street" /><input placeholder="Apt" />
        <input placeholder="City" /><input placeholder="State" />
        <input placeholder="Zip" /><input placeholder="Country" />
      </fieldset>
      <fieldset>
        <legend>Payment</legend>
        <input placeholder="Card number" /><input placeholder="Expiry" />
        <input placeholder="CVV" /><input placeholder="Name on card" />
      </fieldset>
      <fieldset>
        <legend>Contact</legend>
        <input placeholder="Phone" /><input placeholder="Email" />
      </fieldset>
      {/* Identical 12 fields — zero information add ya remove ki gayi
          — par 3 meaningful chunks mein organized 12 items ke bajaye */}
    </form>
  );
}
\`\`\`

**Ek "good" chunk kya banata hai iske liye ek concrete, checkable
heuristic — sirf koi bhi grouping nahi, ek grouping jo genuine,
meaningful structure reflect karti hai:**

\`\`\`ts
function isGoodChunk(proposedGroup) {
  return (
    proposedGroup.itemsShareAGenuineConceptualRelationship && // ek
    // arbitrary grouping NAHI — items ek saath belong karte hain
    // kyunki wo actually kya represent karte hain (sab shipping-
    // related, sab payment-related)
    proposedGroup.hasAClearLabelReflectingThatRelationship && // group
    // ka purpose immediately legible hai, sirf visually boxed nahi
    proposedGroup.sizeIsItselfWithinChunkingLimits // ek "chunk" jismein
    // 15 items andar hain genuine chunk nahi hai — ye sirf ek smaller
    // unchunked list hai ek label pehne hue
  );
}
\`\`\`

**Ek chunk ka internal size chunks ki number jitna hi kyun matter
karta hai — ek specific, checkable nuance jise ye lesson basic pattern
se aage add karta hai:**

\`\`\`
Ek page jo 3 labeled sections mein organized hai, har ek mein 15
ungrouped fields, ne actually chunking problem solve NAHI kiya hai —
ye wahi raw-item processing burden ko ek level neeche move kiya hai,
"12 ungrouped fields" se "ek section ke andar 15 ungrouped fields."
Genuine chunking ko har chunk ke CONTENTS, sirf top-level grouping
nahi, ko bhi reasonable size limits respect karna chahiye — chunking
ek principle hai jise recursively apply karna hai, ek one-time
top-level grouping exercise nahi.
\`\`\`

**Is lesson ke do criteria ko combine karta ek concrete, checkable
audit function — good grouping AUR appropriately-sized chunks:**

\`\`\`ts
function auditChunkingQuality(interfaceSection) {
  const issues = [];
  if (!isGoodChunk(interfaceSection)) {
    issues.push('Grouping does not reflect a genuine conceptual relationship');
  }
  if (interfaceSection.items.length > 7) {
    issues.push(\`Chunk contains \${interfaceSection.items.length} items — likely needs further sub-chunking\`);
  }
  return issues;
}
\`\`\`

**Ye lesson Module 10 ko kaise close karta hai:** Lesson 1 ne general
patterns establish kiye extraneous load eliminate karne ke; Lesson 2
ne progressive disclosure ko ek specific technique ki tarah deepen
kiya. Ye lesson module ke Module 1 ke cognitive load theory ko ek
full, practical toolkit mein translation complete karta hai chunking
ko — working memory ki effective capacity ke peeche mechanism — apne
khud ke concrete, implementable interface patterns dete hue, is course
ke foundational Module 1 concept se applied UX techniques ke ek
complete set tak loop close karte hue.`,

    content: `## Why chunking-based interface patterns are a direct application
of Module 1's working-memory mechanism, not a separate design theory

Module 1 established that working memory's effective capacity is best
understood in terms of meaningful chunks (roughly four) rather than a
fixed number of raw items, and that the same information organized
into fewer, larger chunks is measurably easier to hold in mind than
identical information presented as many individual items. This lesson
directly applies that established mechanism to interface design: an
interface's actual information content remains completely unchanged
when items are grouped, but the number of discrete units the mind must
process — and therefore the effective load — changes substantially
based purely on how that content is organized.

## Why a "good" chunk requires genuine conceptual relationship, not
merely visual grouping

Simply drawing a box around a set of items and giving it a label
doesn't automatically create a genuine chunk in Module 1's sense —
the items within the group need to share an actual, meaningful
relationship the label accurately reflects (all shipping-related, all
payment-related), so the grouping itself is legible and makes sense to
the person processing it. An arbitrary or unclear grouping fails to
provide the genuine cognitive benefit chunking is meant to produce,
even if it superficially resembles a well-chunked interface.

## Why a chunk's internal size matters as much as the number of
top-level chunks — the specific, easy-to-miss nuance this lesson adds

A common mistake in applying chunking is treating it as a one-time,
top-level grouping exercise — organizing a long list into a few labeled
sections and considering the job done, even if each individual section
still contains far more items than working memory's effective chunk
capacity. Genuine chunking requires applying the same principle
recursively: each chunk's own contents should themselves respect
reasonable size limits, since a labeled section containing fifteen
ungrouped items has simply relocated the same raw-item processing
burden rather than actually reducing it.

## Why a two-part audit (genuine relationship, appropriate internal
size) provides a complete, checkable standard for chunking quality

Checking only whether items are grouped at all misses cases where the
grouping is arbitrary or where a chunk's internal size has grown too
large to function as a genuine chunk. A complete audit requires both
conditions: does the grouping reflect an actual, meaningful
relationship the label accurately conveys, and does each resulting
chunk itself stay within reasonable size limits — both are necessary
for a chunk to provide the actual cognitive benefit Module 1's
mechanism describes.

## How this lesson closes Module 10

Lesson 1 established general-purpose patterns for eliminating
extraneous load; Lesson 2 deepened progressive disclosure as one
specific technique, examined through Module 1's cognitive load lens.
This lesson completes the module by giving chunking — Module 1's
working-memory mechanism — its own concrete, implementable interface
patterns and a specific, checkable quality standard. Together, these
three lessons complete this course's translation of Module 1's
foundational cognitive load theory into a full, practical toolkit for
interface design, closing this module's arc from theoretical
foundation to applied technique.`,

    contentHi: `## Chunking-based interface patterns Module 1 ke working-memory mechanism ka ek direct application kyun hain, ek separate design theory nahi

Module 1 ne establish kiya ki working memory ki effective capacity ko
meaningful chunks (roughly four) ke terms mein best samjha jaata hai
ek fixed number of raw items ke bajaye, aur ki wahi information kam,
larger chunks mein organized identical information se measurably
easier hai mind mein hold karna jo kai individual items ki tarah
present ki jaati hai. Ye lesson directly us established mechanism ko
interface design pe apply karta hai: ek interface ka actual information
content poori tarah unchanged rehta hai jab items ko group kiya jaata
hai, par discrete units ki number jise mind ko process karna chahiye —
aur isliye effective load — substantially badalta hai purely is basis
pe ki us content ko kaise organize kiya jaata hai.

## Ek "good" chunk genuine conceptual relationship kyun maangta hai, sirf visual grouping nahi

Sirf items ke ek set ke around ek box drawing karna aur ise ek label
dena automatically Module 1 ke sense mein ek genuine chunk create nahi
karta — group ke andar items ko ek actual, meaningful relationship
share karni chahiye jise label accurately reflect karta hai (sab
shipping-related, sab payment-related), taaki grouping khud legible
ho aur us insaan ke liye sense banaye jo ise process kar raha hai. Ek
arbitrary ya unclear grouping genuine cognitive benefit provide karne
mein fail hoti hai jise chunking produce karne ke liye maani gayi hai,
chahe ye superficially ek well-chunked interface se resemble kare.

## Ek chunk ka internal size top-level chunks ki number jitna hi kyun matter karta hai — specific, easy-to-miss nuance jise ye lesson add karta hai

Chunking apply karne mein ek common mistake ise ek one-time, top-level
grouping exercise ki tarah treat karna hai — ek long list ko kuch
labeled sections mein organize karna aur job done consider karna, even
agar har individual section abhi bhi working memory ki effective
chunk capacity se kaafi zyada items rakhta hai. Genuine chunking ko
wahi principle recursively apply karna chahiye: har chunk ke apne
contents ko khud reasonable size limits respect karni chahiye, kyunki
ek labeled section jismein fifteen ungrouped items hain ne simply
wahi raw-item processing burden ko relocate kiya hai actually kam
karne ke bajaye.

## Ek two-part audit (genuine relationship, appropriate internal size) chunking quality ke liye ek complete, checkable standard kyun provide karta hai

Sirf ye check karna ki kya items bilkul grouped hain un cases ko miss
karta hai jahan grouping arbitrary hai ya jahan ek chunk ka internal
size ek genuine chunk ki tarah function karne ke liye bahut bada ho
gaya hai. Ek complete audit ko dono conditions chahiye: kya grouping
ek actual, meaningful relationship reflect karti hai jise label
accurately convey karta hai, aur kya resulting har chunk khud
reasonable size limits ke andar rehta hai — dono ek chunk ke liye
necessary hain us actual cognitive benefit provide karne ke liye jise
Module 1 ka mechanism describe karta hai.

## Ye lesson Module 10 ko kaise close karta hai

Lesson 1 ne general-purpose patterns establish kiye extraneous load
eliminate karne ke liye; Lesson 2 ne progressive disclosure ko ek
specific technique ki tarah deepen kiya, Module 1 ke cognitive load
lens ke through examined. Ye lesson module ko complete karta hai
chunking ko — Module 1 ka working-memory mechanism — apne khud ke
concrete, implementable interface patterns aur ek specific, checkable
quality standard dete hue. Saath, ye teen lessons is course ke Module
1 ke foundational cognitive load theory ka ek full, practical toolkit
mein translation complete karte hain interface design ke liye, is
module ke arc ko theoretical foundation se applied technique tak
close karte hue.`,

    examples: [
      {
        title: 'A two-part chunking quality auditor applied to a real settings page',
        titleHi: 'Ek two-part chunking quality auditor jo ek real settings page pe applied hai',
        codeJs: `function isGoodChunk(group) {
  return (
    group.itemsShareAGenuineConceptualRelationship &&
    group.hasAClearLabelReflectingThatRelationship &&
    group.items.length <= 7
  );
}

function auditChunkingQuality(interfaceSection) {
  const issues = [];
  if (!interfaceSection.itemsShareAGenuineConceptualRelationship) {
    issues.push('Grouping does not reflect a genuine conceptual relationship');
  }
  if (interfaceSection.items.length > 7) {
    issues.push(\`Chunk contains \${interfaceSection.items.length} items — likely needs further sub-chunking\`);
  }
  return { section: interfaceSection.name, issues, isWellFormed: issues.length === 0 };
}

const settingsSections = [
  { name: 'Notifications', itemsShareAGenuineConceptualRelationship: true, hasAClearLabelReflectingThatRelationship: true, items: new Array(5) },
  { name: 'Miscellaneous', itemsShareAGenuineConceptualRelationship: false, hasAClearLabelReflectingThatRelationship: false, items: new Array(18) },
];

const auditResults = settingsSections.map(auditChunkingQuality);`,
        codeTs: `interface ChunkGroup {
  name: string;
  itemsShareAGenuineConceptualRelationship: boolean;
  hasAClearLabelReflectingThatRelationship: boolean;
  items: unknown[];
}

function isGoodChunk(group: ChunkGroup): boolean {
  return (
    group.itemsShareAGenuineConceptualRelationship &&
    group.hasAClearLabelReflectingThatRelationship &&
    group.items.length <= 7
  );
}

interface ChunkAuditResult {
  section: string;
  issues: string[];
  isWellFormed: boolean;
}

function auditChunkingQuality(interfaceSection: ChunkGroup): ChunkAuditResult {
  const issues: string[] = [];
  if (!interfaceSection.itemsShareAGenuineConceptualRelationship) {
    issues.push('Grouping does not reflect a genuine conceptual relationship');
  }
  if (interfaceSection.items.length > 7) {
    issues.push(\`Chunk contains \${interfaceSection.items.length} items — likely needs further sub-chunking\`);
  }
  return { section: interfaceSection.name, issues, isWellFormed: issues.length === 0 };
}

const settingsSections: ChunkGroup[] = [
  { name: 'Notifications', itemsShareAGenuineConceptualRelationship: true, hasAClearLabelReflectingThatRelationship: true, items: new Array(5) },
  { name: 'Miscellaneous', itemsShareAGenuineConceptualRelationship: false, hasAClearLabelReflectingThatRelationship: false, items: new Array(18) },
];

const auditResults = settingsSections.map(auditChunkingQuality);`,
        code: `if (interfaceSection.items.length > 7) {
  issues.push(\`Chunk contains \${interfaceSection.items.length} items — likely needs further sub-chunking\`);
}
// checks the CHUNK'S OWN internal size, not just whether top-level grouping exists`,
        output:
          "The Notifications section passes the audit cleanly with 5 well-related items, while the Miscellaneous section fails both checks — its 18 items exceed reasonable chunk size, and its lack of a genuine conceptual relationship (a common 'catch-all' anti-pattern) is flagged as needing restructuring into more meaningful, appropriately-sized groups.",
        explain:
          "This example implements the lesson's complete two-part standard: it doesn't just check whether items are grouped, but verifies both that the grouping is conceptually genuine and that each resulting chunk's own size stays within working-memory-appropriate limits, catching the common 'miscellaneous' anti-pattern that superficially looks chunked but isn't.",
        explainHi:
          "Ye example lesson ke complete two-part standard ko implement karta hai: ye sirf check nahi karta ki kya items grouped hain, balki verify karta hai ki grouping conceptually genuine hai AUR ki resulting har chunk ka apna size working-memory-appropriate limits ke andar rehta hai, common 'miscellaneous' anti-pattern ko catch karte hue jo superficially chunked dikhta hai par hai nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Creating a "Miscellaneous" or "Other" catch-all section as a
// substitute for genuine chunking
function organizeFieldsWrong(allFields) {
  const shipping = allFields.filter((f) => f.category === 'shipping');
  const payment = allFields.filter((f) => f.category === 'payment');
  const everythingElse = allFields.filter((f) => f.category !== 'shipping' && f.category !== 'payment');
  // "Everything else" is not a genuine conceptual chunk — it's an
  // arbitrary bucket that fails this lesson's "genuine relationship" test
  return { shipping, payment, miscellaneous: everythingElse };
}`,
        right: `// Identifying the ACTUAL conceptual categories present, rather than
// defaulting unmatched items into a meaningless catch-all
function organizeFieldsRight(allFields) {
  const shipping = allFields.filter((f) => f.category === 'shipping');
  const payment = allFields.filter((f) => f.category === 'payment');
  const contact = allFields.filter((f) => f.category === 'contact');
  const preferences = allFields.filter((f) => f.category === 'preferences');
  // Each group reflects an actual, distinct conceptual category —
  // no arbitrary "everything else" bucket
  return { shipping, payment, contact, preferences };
}`,
        why: "A 'miscellaneous' or 'other' catch-all fails this lesson's genuine-relationship test — items in it don't share an actual conceptual connection, meaning the label provides no meaningful information about what's actually inside, and the grouping fails to deliver the real cognitive benefit chunking is meant to provide.",
        whyHi:
          "Ek 'miscellaneous' ya 'other' catch-all is lesson ke genuine-relationship test mein fail hota hai — usme items ek actual conceptual connection share nahi karte, matlab label is baare mein koi meaningful information provide nahi karta ki actually andar kya hai, aur grouping us real cognitive benefit deliver karne mein fail hoti hai jise chunking provide karne ke liye maani gayi hai.",
      },
    ],

    realWorld: [
      {
        en: "A production project-management tool's settings page was audited using this lesson's two-part standard and found that its 'General' section — intended as a catch-all — had grown to 23 unrelated items over several years of incremental feature additions; the redesign split it into four genuinely coherent categories (Display, Notifications, Team Defaults, Integrations), measurably reducing reported time-to-find for specific settings in user testing.",
        hi: 'Ek production project-management tool ke settings page ka audit is lesson ke two-part standard use karke kiya gaya aur paaya gaya ki uska \'General\' section — ek catch-all ki tarah intended — several years ki incremental feature additions ke saath 23 unrelated items tak badh gaya tha; redesign ne ise char genuinely coherent categories mein split kiya (Display, Notifications, Team Defaults, Integrations), user testing mein specific settings ke liye reported time-to-find ko measurably kam karte hue.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does grouping items into a labeled section not automatically create a genuine "chunk" in Module 1\'s sense?',
        qHi: 'Items ko ek labeled section mein group karna Module 1 ke sense mein automatically ek genuine "chunk" kyun create nahi karta?',
        a: "A genuine chunk requires the grouped items to share an actual, meaningful conceptual relationship the label accurately reflects, and the group itself must stay within reasonable size limits. A visually-boxed group with an arbitrary or unclear relationship (a 'miscellaneous' catch-all) or one containing far more items than working memory's effective chunk capacity fails to provide the actual cognitive benefit chunking is meant to produce, despite superficially resembling a well-chunked interface.",
        aHi: 'Ek genuine chunk maangta hai ki grouped items ek actual, meaningful conceptual relationship share karein jise label accurately reflect karta hai, aur group khud reasonable size limits ke andar rehna chahiye. Ek visually-boxed group ek arbitrary ya unclear relationship ke saath (ek "miscellaneous" catch-all) ya ek jo working memory ki effective chunk capacity se kaafi zyada items rakhta hai us actual cognitive benefit provide karne mein fail hota hai jise chunking produce karne ke liye maani gayi hai, superficially ek well-chunked interface se resemble karne ke bawajood.',
      },
      {
        q: "Why is checking a chunk's own internal size, not just whether top-level grouping exists, necessary for a complete chunking audit?",
        qHi: 'Ek chunk ke apne internal size ko check karna, sirf ye nahi ki kya top-level grouping exist karti hai, ek complete chunking audit ke liye kyun necessary hai?',
        a: "A common mistake treats chunking as a one-time, top-level exercise — organizing a long list into a few labeled sections without checking whether each section itself still contains far more items than working memory's effective capacity. Genuine chunking must be applied recursively: a labeled section with fifteen ungrouped items has simply relocated the same raw-item processing burden rather than actually reducing it.",
        aHi: 'Ek common mistake chunking ko ek one-time, top-level exercise ki tarah treat karta hai — ek long list ko kuch labeled sections mein organize karna ye check kiye bina ki kya har section khud abhi bhi working memory ki effective capacity se kaafi zyada items rakhta hai. Genuine chunking ko recursively apply kiya jaana chahiye: fifteen ungrouped items wala ek labeled section ne simply wahi raw-item processing burden ko relocate kiya hai actually kam karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "A settings page has a section labeled 'Account' containing 16 individual settings ranging from password change to email preferences to billing address to two-factor authentication. Using this lesson's two-part audit, evaluate this section, and propose a specific restructuring into genuinely well-formed chunks.",
        taskHi: 'Ek settings page mein \'Account\' label wala ek section hai jismein 16 individual settings hain password change se email preferences se billing address se two-factor authentication tak. Is lesson ke two-part audit use karke, is section ko evaluate karo, aur genuinely well-formed chunks mein ek specific restructuring propose karo.',
        hint: "Check whether all 16 items genuinely share one conceptual relationship (they probably don't — password/2FA relates to security, billing relates to payments, email preferences relates to communication), then think about how many meaningful sub-categories would each stay within a reasonable chunk size.",
        hintHi: 'Check karo ki kya sab 16 items genuinely ek conceptual relationship share karte hain (probably nahi karte — password/2FA security se relate karta hai, billing payments se relate karta hai, email preferences communication se relate karta hai), phir socho ki kitne meaningful sub-categories har ek ek reasonable chunk size ke andar rahenge.',
      },
    ],

    keyTakeaways: [
      "Chunking-based interface patterns directly apply Module 1's working-memory mechanism — organizing identical content into fewer, larger chunks measurably reduces effective processing load without changing the underlying information at all.",
      "A genuine chunk requires items to share an actual conceptual relationship the label accurately reflects — a 'miscellaneous' or arbitrary catch-all fails this test even if visually grouped.",
      "A chunk's own internal size matters as much as top-level grouping — chunking must be applied recursively, since a labeled section with too many items has just relocated the processing burden, not reduced it.",
      "This lesson closes Module 10's three-lesson arc (general extraneous-load patterns, progressive disclosure, chunking), completing this course's translation of Module 1's cognitive load theory into a full, practical interface-design toolkit.",
    ],
    keyTakeawaysHi: [
      "Chunking-based interface patterns directly Module 1 ke working-memory mechanism ko apply karte hain — identical content ko kam, larger chunks mein organize karna measurably effective processing load kam karta hai underlying information ko bilkul badle bina.",
      "Ek genuine chunk ko items ke ek actual conceptual relationship share karne ki zaroorat hai jise label accurately reflect karta hai — ek 'miscellaneous' ya arbitrary catch-all is test mein fail hota hai chahe visually grouped ho.",
      'Ek chunk ka apna internal size top-level grouping jitna hi matter karta hai — chunking ko recursively apply karna chahiye, kyunki bahut saare items wala ek labeled section ne sirf processing burden ko relocate kiya hai, kam nahi kiya.',
      'Ye lesson Module 10 ke three-lesson arc ko close karta hai (general extraneous-load patterns, progressive disclosure, chunking), is course ke Module 1 ke cognitive load theory ka ek full, practical interface-design toolkit mein translation complete karte hue.',
    ],
  },
];
