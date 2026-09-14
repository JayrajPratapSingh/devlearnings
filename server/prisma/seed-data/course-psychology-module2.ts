/**
 * Psychology for Developers — Module 2: Perception & Visual Processing, lessons 1-3.
 *
 * Lesson 1: Gestalt principles as the actual mechanism behind "this interface feels organized."
 * Lesson 2: How eyes genuinely scan a screen — F-pattern/Z-pattern findings from real eye-tracking.
 * Lesson 3: Color perception and why it is inseparable from accessibility.
 */

import type { CourseLesson } from './course-js-module1';

export const PSYCH_MODULE_2: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'psych-gestalt-principles',
    title: 'Gestalt Principles — the Actual Mechanism Behind "This Feels Organized"',
    titleHi: 'Gestalt Principles — "Ye Organized Feel Karta Hai" Ke Peeche Actual Mechanism',
    description:
      "When a designer says an interface 'feels organized' or 'feels cluttered,' they're describing the measurable output of specific, well-documented perceptual rules the brain applies automatically — proximity, similarity, closure, and continuity — not a vague, unteachable aesthetic instinct.",
    descriptionHi:
      "Jab ek designer kehta hai ek interface 'organized feel karta hai' ya 'cluttered feel karta hai,' wo specific, well-documented perceptual rules ke measurable output ko describe kar raha hai jinhe brain automatically apply karta hai — proximity, similarity, closure, aur continuity — ek vague, unteachable aesthetic instinct nahi.",
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A conductor arranging musicians on stage so the audience instinctively knows the string section is one group and the brass section is another, purely from where each musician physically stands, before a single note is played.** If a conductor scattered every musician randomly across the stage, an audience member would have no visual way to guess which players belong to which section — that grouping information would only become available once the music started and instruments could be told apart by sound. But a conductor who clusters the violins together, seats the brass in a distinct block, and leaves a visible gap between sections gives the audience this grouping information for FREE, through spatial arrangement alone, before any sound happens — the audience's brain does this grouping automatically and instantly, without being told explicitly \"these are the strings.\" Gestalt principles are exactly this automatic grouping mechanism applied to any visual field: proximity (things placed near each other) and similarity (things that look alike) get perceived as belonging together automatically, the same way the audience automatically perceives the clustered violins as one section — not because anyone reasoned it out, but because the visual system performs this grouping as an early, automatic step, before conscious interpretation even begins.",
      hi: 'Ek conductor stage pe musicians ko is tarike se arrange karta hai ki audience instinctively jaanti hai ki string section ek group hai aur brass section doosra, purely is baat se ki har musician physically kahan khada hai, ek bhi note baje se pehle. Agar ek conductor har musician ko stage ke across randomly bikher deta, ek audience member ke paas guess karne ka koi visual tareeka nahi hota ki kaunse players kaunse section ke hain — wo grouping information sirf tab available hoti jab music start ho jaata aur instruments ko sound se alag bataya ja sakta. Par ek conductor jo violins ko saath cluster karta hai, brass ko ek distinct block mein bithata hai, aur sections ke beech ek visible gap chhodta hai audience ko ye grouping information FREE mein deta hai, sirf spatial arrangement se, kisi bhi sound hone se pehle — audience ka brain ye grouping automatically aur instantly karta hai, explicitly bataye jaane ke bina "ye strings hain." Gestalt principles exactly ye automatic grouping mechanism hain jo kisi bhi visual field pe applied hai: proximity (cheezein jo ek doosre ke paas placed hain) aur similarity (cheezein jo alike dikhti hain) automatically saath belong karti hui perceive hoti hain, wahi tarike se jaise audience automatically clustered violins ko ek section ki tarah perceive karti hai — is wajah se nahi ki kisi ne ise reason out kiya, balki is wajah se ki visual system ye grouping ek early, automatic step ki tarah perform karta hai, conscious interpretation shuru hone se bhi pehle.',
    },

    simple: `**The four Gestalt principles that do almost all of the practical
work in interface design:**

\`\`\`
PROXIMITY — items placed close together are perceived as related; items
  placed far apart are perceived as unrelated. This is the single most
  load-bearing Gestalt principle for form and layout design.

SIMILARITY — items that look alike (same color, shape, size) are
  perceived as belonging to the same category, even with no explicit
  grouping. This is why a design system's consistent button styling
  communicates "these are all clickable actions" without a single
  word of explanation.

CLOSURE — the brain automatically completes a slightly incomplete
  shape into a whole, recognizable one. This is why a logo or icon
  doesn't need every line drawn to be recognized — the brain fills the
  gap.

CONTINUITY — the eye follows a smooth line or curve rather than an
  abrupt visual break. This is why elements aligned along a shared edge
  or axis feel connected, even without a visible line drawn between them.
\`\`\`

**Why proximity alone explains a specific, extremely common form-
design bug — a label that's ambiguous purely from spacing:**

\`\`\`css
/* WRONG spacing — proximity groups the label with the WRONG field */
.form-group {
  margin-bottom: 8px;
}
label {
  margin-bottom: 24px; /* pushes the label visually closer to the NEXT field */
}
/* A user's brain, applying proximity automatically, perceives this
   label as describing the field BELOW it, not the one it's
   semantically attached to — a real, measurable source of form errors
   that has nothing to do with the label's wording */

/* CORRECT spacing — proximity now correctly groups label with its field */
.form-group {
  margin-bottom: 24px; /* larger gap BETWEEN groups */
}
label {
  margin-bottom: 4px; /* small gap WITHIN a group, between label and its field */
}
\`\`\`

**A concrete implementation of similarity — grouping interactive
elements by consistent visual treatment, not explanation:**

\`\`\`tsx
// Without similarity — three actions with no visual signal they're
// all clickable, related actions
<span onClick={edit}>Edit</span>
<span onClick={duplicate}>Duplicate</span>
<span onClick={remove}>Delete</span>

// With similarity — consistent button styling signals "these are a
// related group of actions" through appearance alone
<button className="action-btn" onClick={edit}>Edit</button>
<button className="action-btn" onClick={duplicate}>Duplicate</button>
<button className="action-btn action-btn--danger" onClick={remove}>Delete</button>
// The shared .action-btn styling groups the first two via similarity;
// action-btn--danger's DIFFERENT color signals Delete is a related but
// distinct kind of action — communicated purely visually
\`\`\`

**Why these are measured perceptual rules, not a design team's
subjective taste:** Gestalt principles originate from early-20th-century
experimental psychology (Wertheimer, Koffka, Köhler) studying how the
visual system organizes raw sensory input into coherent objects and
groups — this happens as an early, largely automatic stage of visual
processing, before conscious, deliberate interpretation. This is why
two people with wildly different aesthetic tastes will still both
perceive the same badly-spaced form label as ambiguous — the grouping
error isn't a matter of taste, it's a mismatch between the actual visual
grouping cues (spacing) and the intended semantic grouping (which label
belongs to which field).

**Why this connects directly to Module 1:** Gestalt grouping is what
determines how many actual CHUNKS (Module 1, Lesson 1) a visual field
presents to working memory in the first place — a screen with 12
individual, ungrouped elements presents 12 chunks; the same 12 elements
correctly grouped into 3 visually distinct clusters of 4 present roughly
3 chunks to working memory, since a well-formed group is itself
perceived and processed as a single unit. Gestalt principles are the
actual visual mechanism Module 1's chunking concept depends on.`,

    simpleHi: `**Chaar Gestalt principles jo interface design mein almost sara
practical kaam karte hain:**

\`\`\`
PROXIMITY — items jo saath close place kiye gaye hain related perceive
  hote hain; items jo door place kiye gaye hain unrelated perceive hote
  hain. Ye form aur layout design ke liye single sabse load-bearing
  Gestalt principle hai.

SIMILARITY — items jo alike dikhte hain (same color, shape, size) wahi
  category se belong karte hue perceive hote hain, koi explicit
  grouping ke bina bhi. Yahi wajah hai ek design system ki consistent
  button styling "ye sab clickable actions hain" communicate karti hai
  bina explanation ke ek word ke.

CLOSURE — brain automatically ek slightly incomplete shape ko ek poore,
  recognizable wale mein complete kar deta hai. Yahi wajah hai ek logo
  ya icon ko recognize hone ke liye har line drawn hone ki zaroorat
  nahi — brain gap fill kar deta hai.

CONTINUITY — eye ek smooth line ya curve follow karta hai ek abrupt
  visual break ke bajaye. Yahi wajah hai ek shared edge ya axis ke saath
  aligned elements connected feel karte hain, unke beech koi visible
  line drawn hue bina bhi.
\`\`\`

**Proximity akela ek specific, extremely common form-design bug kyun
explain karta hai — ek label jo purely spacing se ambiguous hai:**

\`\`\`css
/* GALAT spacing — proximity label ko GALAT field ke saath group karti hai */
.form-group {
  margin-bottom: 8px;
}
label {
  margin-bottom: 24px; /* label ko visually agle field ke close push karta hai */
}
/* Ek user ka brain, automatically proximity apply karte hue, is label
   ko us se BELOW wale field ko describe karta hua perceive karta hai,
   us se nahi jise ye semantically attached hai — ek real, measurable
   source of form errors jiska label ki wording se koi lena-dena nahi */

/* CORRECT spacing — proximity ab correctly label ko uske field ke saath group karti hai */
.form-group {
  margin-bottom: 24px; /* groups ke BEECH larger gap */
}
label {
  margin-bottom: 4px; /* ek group ke ANDAR chhota gap, label aur uske field ke beech */
}
\`\`\`

**Similarity ka ek concrete implementation — interactive elements ko
consistent visual treatment se group karna, explanation se nahi:**

\`\`\`tsx
// Similarity ke bina — teen actions koi visual signal ke bina ki wo
// sab clickable, related actions hain
<span onClick={edit}>Edit</span>
<span onClick={duplicate}>Duplicate</span>
<span onClick={remove}>Delete</span>

// Similarity ke saath — consistent button styling "ye actions ka ek
// related group hai" signal karti hai appearance akele se
<button className="action-btn" onClick={edit}>Edit</button>
<button className="action-btn" onClick={duplicate}>Duplicate</button>
<button className="action-btn action-btn--danger" onClick={remove}>Delete</button>
// Shared .action-btn styling pehle do ko similarity ke through group
// karti hai; action-btn--danger ka ALAG color signal karta hai Delete
// ek related par distinct kism ka action hai — purely visually
// communicated
\`\`\`

**Ye measured perceptual rules kyun hain, ek design team ka subjective
taste nahi:** Gestalt principles early-20th-century experimental
psychology (Wertheimer, Koffka, Köhler) se originate hote hain jo study
kar rahi thi ki visual system raw sensory input ko coherent objects aur
groups mein kaise organize karta hai — ye ek early, largely automatic
stage of visual processing ki tarah hota hai, conscious, deliberate
interpretation se pehle. Yahi wajah hai do log wildly alag aesthetic
tastes ke saath abhi bhi dono wahi badly-spaced form label ko ambiguous
perceive karenge — grouping error taste ki baat nahi hai, ye actual
visual grouping cues (spacing) aur intended semantic grouping (kaunsa
label kaunse field se belong karta hai) ke beech ek mismatch hai.

**Ye directly Module 1 se kaise connect karta hai:** Gestalt grouping
wo hai jo determine karta hai ki ek visual field working memory ko
pehli jagah kitne actual CHUNKS (Module 1, Lesson 1) present karta hai
— ek screen jiske paas 12 individual, ungrouped elements hain 12 chunks
present karti hai; wahi 12 elements correctly 3 visually distinct
clusters of 4 mein grouped roughly 3 chunks present karte hain working
memory ko, kyunki ek well-formed group khud ek single unit ki tarah
perceive aur process ki jaati hai. Gestalt principles wo actual visual
mechanism hain jispe Module 1 ka chunking concept depend karta hai.`,

    content: `## Why Gestalt principles are perceptual rules, not aesthetic
opinions, and why that distinction matters practically

Gestalt psychology (originating with Wertheimer, Koffka, and Köhler in
the early 20th century) established through controlled experiments that
the visual system performs specific, predictable grouping operations on
raw sensory input as an early, largely automatic stage of processing —
before conscious, deliberate interpretation occurs. This is precisely
why a badly-spaced form label reads as ambiguous to virtually everyone
who encounters it, regardless of their personal design taste: the
grouping error is a mismatch between the actual perceptual grouping cue
(spacing) and the intended semantic relationship, not a matter of
subjective preference. Treating these principles as measured
mechanisms rather than opinions is what makes them teachable, checkable,
and debuggable in the same way any other engineering constraint is.

## Why proximity is disproportionately the highest-leverage principle
for form and layout work specifically

Of the four principles, proximity most directly governs the single most
common and highest-stakes interface task: correctly communicating which
label belongs to which input, which button belongs to which section,
and which piece of related content forms one coherent group. A
proximity error is also unusually insidious because it produces a
functionally correct interface (the label IS technically associated
with the right input via HTML, the code is not broken) that nonetheless
reads incorrectly to a human's automatic perceptual processing — the bug
exists entirely in the visual layer, invisible to any code review that
only checks markup correctness.

## Why closure and continuity matter even though they're less
directly actionable for everyday layout work

Closure (the brain completing an incomplete shape) and continuity (the
eye following implied lines) operate more subtly than proximity and
similarity, but they explain real design decisions: why a minimalist
icon with only a few strokes is still instantly recognizable (closure
fills the rest), and why elements aligned along a shared invisible grid
line feel connected even with substantial visual space between them
(continuity). Understanding these as the SAME category of automatic
perceptual mechanism as proximity and similarity — rather than as vague
"good design sense" — is what lets a developer reason precisely about
why a specific layout choice produces the visual effect it does.

## How this lesson directly extends Module 1's chunking mechanism

Module 1, Lesson 1 established that working memory operates on chunks,
and that chunking is what makes formatted information easier to hold
active than the same information unformatted. Gestalt grouping is the
actual VISUAL mechanism that performs this chunking for anything
presented on screen — a set of elements grouped via proximity and
similarity is perceived and processed as fewer, larger chunks than the
same elements presented without these grouping cues. This lesson
doesn't introduce a new, separate concept from Module 1; it identifies
the specific perceptual mechanism responsible for turning a visual
layout into the chunk count Module 1 already established as the actual
unit of working-memory capacity.`,

    contentHi: `## Gestalt principles perceptual rules kyun hain, aesthetic opinions nahi, aur ye distinction practically kyun matter karti hai

Gestalt psychology (Wertheimer, Koffka, aur Köhler se early 20th century
mein originate hui) ne controlled experiments ke through establish kiya
ki visual system raw sensory input pe specific, predictable grouping
operations perform karta hai ek early, largely automatic stage of
processing ki tarah — conscious, deliberate interpretation hone se
pehle. Yahi exactly wajah hai ek badly-spaced form label almost har us
insaan ko ambiguous padhta hai jo ise encounter karta hai, unki personal
design taste se independently: grouping error actual perceptual
grouping cue (spacing) aur intended semantic relationship ke beech ek
mismatch hai, subjective preference ki baat nahi. In principles ko
opinions ke bajaye measured mechanisms ki tarah treat karna wo hai jo
inhe teachable, checkable, aur debuggable banata hai wahi tarike se jo
kisi bhi doosre engineering constraint ko banata hai.

## Proximity disproportionately form aur layout work ke liye specifically highest-leverage principle kyun hai

Chaar principles mein se, proximity sabse directly single sabse common
aur highest-stakes interface task ko govern karta hai: correctly
communicate karna ki kaunsa label kaunse input se belong karta hai,
kaunsa button kaunse section se belong karta hai, aur related content
ka kaunsa piece ek coherent group banata hai. Ek proximity error bhi
unusually insidious hai kyunki ye ek functionally correct interface
produce karta hai (label technically HTML ke through sahi input se
associated HAI, code broken nahi hai) jo nonetheless ek human ke
automatic perceptual processing ko incorrectly padhta hai — bug poori
tarah visual layer mein exist karta hai, kisi bhi code review ke liye
invisible jo sirf markup correctness check karta hai.

## Closure aur continuity kyun matter karte hain chahe wo everyday layout work ke liye kam directly actionable hon

Closure (brain ek incomplete shape ko complete karta hai) aur continuity
(eye implied lines follow karta hai) proximity aur similarity se zyada
subtly operate karte hain, par wo real design decisions explain karte
hain: kyun ek minimalist icon jiske sirf kuch strokes hain abhi bhi
instantly recognizable hai (closure baaki fill karta hai), aur kyun ek
shared invisible grid line ke saath aligned elements connected feel
karte hain even substantial visual space ke saath unke beech (continuity).
Inhe SAME category ki automatic perceptual mechanism ki tarah samajhna
jo proximity aur similarity hai — vague "good design sense" ke bajaye —
wo hai jo ek developer ko precisely reason karne deta hai ki ek specific
layout choice wahi visual effect kyun produce karta hai jo ye karta hai.

## Ye lesson directly Module 1 ke chunking mechanism ko kaise extend karta hai

Module 1, Lesson 1 ne establish kiya ki working memory chunks pe
operate karti hai, aur chunking wo hai jo formatted information ko
unformatted wahi information se active hold karna aasan banata hai.
Gestalt grouping wo actual VISUAL mechanism hai jo screen pe present
kisi bhi cheez ke liye ye chunking perform karta hai — proximity aur
similarity ke through grouped elements ka ek set un elements se kam,
bade chunks ki tarah perceive aur process kiya jata hai jo in grouping
cues ke bina present kiye jaate. Ye lesson Module 1 se ek naya, separate
concept introduce nahi karta; ye specific perceptual mechanism identify
karta hai jo ek visual layout ko us chunk count mein badalne ke liye
responsible hai jise Module 1 ne already working-memory capacity ki
actual unit ki tarah establish kiya.`,

    examples: [
      {
        title: 'A form component demonstrating correct proximity-based grouping between labels and their fields',
        titleHi: 'Ek form component jo labels aur unke fields ke beech correct proximity-based grouping demonstrate karta hai',
        codeJs: `function ContactForm() {
  return (
    <form>
      {/* Each .field-group is a Gestalt group — small internal gap,
          larger gap between groups — so proximity correctly signals
          which label belongs to which input */}
      <div className="field-group">
        <label htmlFor="name">Full name</label>
        <input id="name" name="name" />
      </div>

      <div className="field-group">
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" />
      </div>
    </form>
  );
}

// The CSS is what actually encodes the Gestalt grouping:
const styles = \`
.field-group {
  margin-bottom: 24px; /* LARGE gap BETWEEN groups */
}
.field-group label {
  display: block;
  margin-bottom: 4px; /* SMALL gap WITHIN a group */
}
\`;`,
        codeTs: `import type { ReactElement } from 'react';

function ContactForm(): ReactElement {
  return (
    <form>
      {/* Each .field-group is a Gestalt group — small internal gap,
          larger gap between groups — so proximity correctly signals
          which label belongs to which input */}
      <div className="field-group">
        <label htmlFor="name">Full name</label>
        <input id="name" name="name" />
      </div>

      <div className="field-group">
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" />
      </div>
    </form>
  );
}

// The CSS is what actually encodes the Gestalt grouping:
const styles = \`
.field-group {
  margin-bottom: 24px; /* LARGE gap BETWEEN groups */
}
.field-group label {
  display: block;
  margin-bottom: 4px; /* SMALL gap WITHIN a group */
}
\`;`,
        code: `.field-group { margin-bottom: 24px; }       /* gap BETWEEN groups */
.field-group label { margin-bottom: 4px; }   /* gap WITHIN a group */`,
        output:
          "A visitor scanning the form perceives 'Full name' as clearly belonging with its input, and 'Email address' as clearly belonging with its own — the smaller internal gap versus the larger between-group gap is what communicates this, entirely through spacing, with zero ambiguity even before reading a single word.",
        explain:
          "This example makes the proximity principle's practical rule concrete and checkable: the internal (within-group) spacing must be meaningfully smaller than the between-group spacing, or the automatic perceptual grouping breaks down regardless of how correct the underlying HTML association (the `for`/`id` pairing) technically is.",
        explainHi:
          "Ye example proximity principle ke practical rule ko concrete aur checkable banata hai: internal (within-group) spacing between-group spacing se meaningfully chhoti honi chahiye, warna automatic perceptual grouping break down ho jaati hai chahe underlying HTML association (`for`/`id` pairing) technically kitna bhi correct ho.",
      },
    ],

    mistakes: [
      {
        wrong: `/* Equal spacing everywhere — proximity gives NO grouping signal at all */
.field {
  margin-bottom: 16px;
}
.field label {
  margin-bottom: 16px; /* SAME gap as between fields — no distinction */
}
/* A user's brain has no proximity cue to distinguish "this label
   belongs to the field right after it" from "this label and that
   field are just two separate, unrelated items sitting nearby" —
   the grouping is genuinely ambiguous, not just unpolished */`,
        right: `/* A clear proximity RATIO — within-group gap meaningfully smaller
   than between-group gap */
.field {
  margin-bottom: 24px; /* between groups */
}
.field label {
  margin-bottom: 4px; /* within a group — 6x smaller */
}
/* The clear size difference is what makes the grouping unambiguous —
   Gestalt proximity works on RELATIVE distance, not any single
   absolute spacing value */`,
        why: "Proximity grouping is perceived based on relative distance, not any single absolute spacing value — if the gap within a group is the same size as the gap between groups, there is no perceptual signal distinguishing the two, and a user's automatic grouping process genuinely cannot tell which label belongs with which field.",
        whyHi:
          "Proximity grouping relative distance ke basis pe perceive hoti hai, kisi single absolute spacing value pe nahi — agar ek group ke andar ka gap groups ke beech ke gap jitna hi hai, do ko distinguish karne wala koi perceptual signal nahi hai, aur ek user ka automatic grouping process genuinely bata nahi sakta ki kaunsa label kaunse field se belong karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production e-commerce checkout form was found, via user testing, to have a measurably higher error rate on its billing-address section specifically because its CSS margins made the 'Same as shipping address' checkbox appear closer to the NEXT section's first field than to the billing fields it actually controlled — a pure proximity-grouping bug invisible in a code review that only checked the checkbox's functional wiring.",
        hi: 'Ek production e-commerce checkout form ko, user testing ke through, apne billing-address section pe ek measurably higher error rate rakhte hue paaya gaya specifically kyunki iske CSS margins ne \'Same as shipping address\' checkbox ko agle section ke pehle field ke zyada close appear karaya un billing fields se jinhe ye actually control karta tha — ek pure proximity-grouping bug jo ek code review mein invisible tha jo sirf checkbox ki functional wiring check karta tha.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is the Gestalt proximity principle considered a measured perceptual mechanism rather than a subjective design preference?',
        qHi: 'Gestalt proximity principle ko ek measured perceptual mechanism kyun mana jaata hai ek subjective design preference ke bajaye?',
        a: "Gestalt psychology's founding experiments demonstrated that the visual system performs grouping based on spatial proximity as an early, largely automatic stage of processing, occurring before conscious interpretation. This is why people with entirely different aesthetic tastes still perceive the same ambiguously-spaced label the same way — the grouping error is a mismatch between the actual perceptual cue and the intended relationship, not a matter of taste.",
        aHi: 'Gestalt psychology ke founding experiments ne demonstrate kiya ki visual system spatial proximity ke basis pe grouping perform karta hai ek early, largely automatic stage of processing ki tarah, conscious interpretation hone se pehle occur karte hue. Yahi wajah hai poori tarah alag aesthetic tastes wale log abhi bhi wahi ambiguously-spaced label ko wahi tarike se perceive karte hain — grouping error actual perceptual cue aur intended relationship ke beech ek mismatch hai, taste ki baat nahi.',
      },
      {
        q: "Why can a form label be technically, functionally correct (properly associated via HTML for/id) while still producing a real user-facing bug?",
        qHi: 'Ek form label technically, functionally correct ho sakta hai (properly HTML for/id ke through associated) jabki abhi bhi ek real user-facing bug produce kar sakta hai kyun?',
        a: "The functional association (HTML for/id) and the perceptual grouping (visual proximity via CSS spacing) are two entirely separate layers. A label can be programmatically linked to the correct input while its visual spacing makes it appear grouped with a different field to a human's automatic Gestalt processing — the bug exists purely in the visual layer, invisible to any check that only validates markup correctness.",
        aHi: 'Functional association (HTML for/id) aur perceptual grouping (CSS spacing ke through visual proximity) do poori tarah separate layers hain. Ek label programmatically correct input se linked ho sakta hai jabki uski visual spacing ise ek human ke automatic Gestalt processing ko ek alag field ke saath grouped dikhati hai — bug poori tarah visual layer mein exist karta hai, kisi bhi check ke liye invisible jo sirf markup correctness validate karta hai.',
      },
    ],

    exercises: [
      {
        task: "A settings page has a series of toggle switches where the vertical spacing above and below each toggle is identical (16px everywhere), with section headings visually indistinguishable in spacing from regular items. Using the proximity principle, explain why users report the page 'feels like one long confusing list' rather than organized sections, and describe the specific CSS change that would fix it.",
        taskHi: 'Ek settings page mein toggle switches ki ek series hai jahan har toggle ke upar aur niche vertical spacing identical hai (16px har jagah), section headings visually regular items se spacing mein indistinguishable hain. Proximity principle use karke, explain karo ki users kyun report karte hain ki page \'ek lambi confusing list jaisa feel karta hai\' organized sections ke bajaye, aur specific CSS change describe karo jo ise fix karega.',
        hint: "Think about what relative spacing ratio would be needed between a section heading and its own items versus between one section's last item and the next section's heading.",
        hintHi: 'Socho ki ek section heading aur uske apne items ke beech kya relative spacing ratio chahiye versus ek section ke last item aur agle section ki heading ke beech.',
      },
    ],

    keyTakeaways: [
      "Gestalt principles (proximity, similarity, closure, continuity) are measured perceptual mechanisms from experimental psychology, not subjective aesthetic preferences — they operate automatically, before conscious interpretation.",
      "Proximity is the highest-leverage principle for form and layout work specifically, since it directly governs whether a label correctly reads as belonging to its field — and a proximity bug can exist purely in the visual layer, invisible to markup-level code review.",
      "Similarity groups elements by shared visual treatment (color, shape, styling) without any explicit labeling, which is why consistent design-system styling communicates category membership on its own.",
      "Gestalt grouping is the actual visual mechanism that produces Module 1's chunking effect — correctly grouped elements are perceived and processed as fewer, larger chunks than the same elements presented without grouping cues.",
    ],
    keyTakeawaysHi: [
      'Gestalt principles (proximity, similarity, closure, continuity) experimental psychology se measured perceptual mechanisms hain, subjective aesthetic preferences nahi — wo automatically operate karte hain, conscious interpretation se pehle.',
      'Proximity form aur layout work ke liye specifically highest-leverage principle hai, kyunki ye directly govern karta hai ki kya ek label correctly apne field se belong karta hua padhta hai — aur ek proximity bug poori tarah visual layer mein exist kar sakta hai, markup-level code review ke liye invisible.',
      'Similarity elements ko shared visual treatment (color, shape, styling) se group karta hai bina kisi explicit labeling ke, yahi wajah hai consistent design-system styling apne aap category membership communicate karti hai.',
      'Gestalt grouping wo actual visual mechanism hai jo Module 1 ka chunking effect produce karta hai — correctly grouped elements un elements se kam, bade chunks ki tarah perceive aur process kiye jaate hain jo grouping cues ke bina present kiye jaate.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'psych-how-eyes-scan-a-screen',
    title: 'How Eyes Genuinely Scan a Screen — F-Pattern & Z-Pattern',
    titleHi: 'Eyes Genuinely Ek Screen Ko Kaise Scan Karti Hain — F-Pattern Aur Z-Pattern',
    description:
      "Gestalt principles (Lesson 1) explain how elements get grouped once seen. This lesson covers a genuinely different question, answered by real eye-tracking research: in what actual order does a person's gaze move across a screen in the first place, and what does that predictable pattern mean for where content should go.",
    descriptionHi:
      'Gestalt principles (Lesson 1) explain karte hain ki elements ek baar dekhe jaane ke baad kaise group hote hain. Ye lesson ek genuinely alag sawaal cover karta hai, real eye-tracking research se answered: ek insaan ki gaze pehli jagah ek screen ke across actual order mein kaise move karti hai, aur us predictable pattern ka matlab hai ki content kahan jaana chahiye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A visitor to an unfamiliar city instinctively glancing at the most prominent landmarks along their most likely path first, before deciding whether to explore any specific side street more closely.** Someone walking down an unfamiliar main street doesn't examine every shop window with equal, careful attention in order — they glance broadly first (which storefronts are even open, which look interesting), typically starting from wherever their path naturally begins and scanning the most prominent, path-adjacent features first, only stopping to look closely at whatever caught their initial broad glance. This isn't random or purely a matter of personal taste — it's a predictable pattern shaped by how the street itself is laid out (what's near the entrance, what's placed at eye level) and by cultural habit (which direction people are used to walking and reading). Real eye-tracking research on how people actually look at a screen found exactly this kind of predictable pattern: gaze tends to move in specific, measurable shapes (an F-pattern for text-heavy pages, a Z-pattern for simpler ones) driven by where reading habits and visual prominence naturally direct the eye first — not because people consciously decide to scan this way, but because it's the path of least resistance their visual system takes by default.",
      hi: 'Ek unfamiliar city ka visitor instinctively apne most likely path ke saath sabse prominent landmarks ko pehle glance karta hai, kisi bhi specific side street ko closely explore karna hai ya nahi decide karne se pehle. Koi jo ek unfamiliar main street pe chal raha hai har shop window ko equal, careful attention ke saath order mein examine nahi karta — wo pehle broadly glance karte hain (kaunse storefronts even open hain, kaunse interesting dikhte hain), typically jahan bhi unka path naturally shuru hota hai wahan se start karte hue aur sabse prominent, path-adjacent features ko pehle scan karte hue, sirf usi cheez ko closely dekhne ke liye rukte hain jo unke initial broad glance ne catch ki. Ye random nahi hai ya purely personal taste ki baat nahi hai — ye ek predictable pattern hai jo khud street kaise laid out hai (entrance ke paas kya hai, eye level pe kya placed hai) aur cultural habit (log kis direction mein chalne aur padhne ke aadi hain) se shaped hai. Real eye-tracking research is baat pe ki log actually ek screen ko kaise dekhte hain exactly ye kism ka predictable pattern find kiya: gaze specific, measurable shapes mein move karti hai (text-heavy pages ke liye ek F-pattern, simpler wale ke liye ek Z-pattern) jo reading habits aur visual prominence se driven hai jo naturally eye ko pehle direct karte hain — is wajah se nahi ki log consciously is tarike se scan karne ka decide karte hain, balki is wajah se ki ye path of least resistance hai jo unka visual system default se leta hai.',
    },

    simple: `**The actual, measured finding — Nielsen Norman Group's eye-tracking
research (2006, replicated many times since):**

\`\`\`
On text-heavy pages (search results, article listings, long-form
content), eye movement traces an F-SHAPED pattern:
  1. A full horizontal sweep along the TOP of the content
  2. A shorter horizontal sweep partway down
  3. A vertical scan down the LEFT SIDE, reading fewer and fewer
     words at each point as attention decreases

Practical implication: the most important words in a heading or the
first sentence of a paragraph get disproportionately more attention
than content further right or further down — this is a MEASURED
attention distribution, not a stylistic suggestion to "front-load"
content.
\`\`\`

**A related, distinct pattern for simpler, less text-dense layouts —
the Z-pattern:**

\`\`\`
On simpler pages (a landing page, a pricing table, a single clear call
to action), gaze traces a Z-SHAPE:
  1. Left to right along the top (logo -> nav -> top-right element,
     often where a "Sign up" button lives)
  2. A diagonal sweep down to the bottom-left
  3. Left to right along the bottom (often where the primary call to
     action sits)

Practical implication: a primary call-to-action button placed at the
END of this path (bottom-right, or top-right for a simpler layout)
aligns with where attention naturally arrives last and lingers —
placing it somewhere the Z-pattern's gaze path doesn't naturally reach
measurably reduces the chance it's even seen.
\`\`\`

**Why this is a testable, checkable design constraint — not just
"put important things near the top":**

\`\`\`tsx
// A pricing page laid out AGAINST the measured Z-pattern — the primary
// CTA sits where gaze DOESN'T naturally travel
function PricingPageWrong() {
  return (
    <div>
      <header>{/* logo, nav */}</header>
      <button className="cta-primary" style={{ float: 'left', marginTop: '4px' }}>
        Start Free Trial
      </button>
      {/* placed top-left, immediately after the logo — NOT where the
          Z-pattern's natural end point is */}
      <PricingTable />
    </div>
  );
}

// Aligned WITH the Z-pattern — CTA at the path's natural endpoint
function PricingPageRight() {
  return (
    <div>
      <header>{/* logo, nav, "Sign up" top-right */}</header>
      <PricingTable />
      <div className="cta-section" style={{ textAlign: 'right' }}>
        <button className="cta-primary">Start Free Trial</button>
      </div>
      {/* bottom-right — the Z-pattern's natural terminal point */}
    </div>
  );
}
\`\`\`

**Why this pattern is a strong tendency shaped by reading habits, not
a rigid law that applies identically everywhere:** the F-pattern and
Z-pattern were measured primarily on left-to-right reading populations
and layouts — the underlying mechanism (gaze follows the path reading
habits and visual prominence make easiest) is general, but its specific
SHAPE genuinely differs for right-to-left reading contexts, and any
individual page's actual visual hierarchy (a large, high-contrast image
placed off-pattern) can override the default scan path. The practical
skill is understanding WHY the pattern exists (habituated reading
direction plus visual prominence) well enough to reason about a specific
page's actual audience and content, not memorizing the F/Z shapes as
universal law.

**How this connects to Lesson 1's Gestalt principles:** scan patterns
determine the ORDER in which a person's gaze encounters Gestalt-grouped
elements; Gestalt principles determine how those elements get perceived
and grouped once the gaze arrives. A perfectly Gestalt-grouped section
of content that sits entirely outside a page's natural scan path can
still go unseen — the two mechanisms operate at different stages of the
same overall visual-processing pipeline.`,

    simpleHi: `**Actual, measured finding — Nielsen Norman Group ka eye-tracking
research (2006, tab se kai baar replicated):**

\`\`\`
Text-heavy pages pe (search results, article listings, long-form
content), eye movement ek F-SHAPED pattern trace karti hai:
  1. Content ke TOP ke saath ek full horizontal sweep
  2. Thodi door niche ek shorter horizontal sweep
  3. LEFT SIDE ke neeche ek vertical scan, har point pe attention kam
     hote hue kam se kam words padhte hue

Practical implication: ek heading mein sabse important words ya ek
paragraph ka pehla sentence content se zyada disproportionately zyada
attention paata hai jo zyada right ya zyada niche hai — ye ek MEASURED
attention distribution hai, content ko "front-load" karne ka ek
stylistic suggestion nahi.
\`\`\`

**Ek related, distinct pattern simpler, less text-dense layouts ke
liye — Z-pattern:**

\`\`\`
Simpler pages pe (ek landing page, ek pricing table, ek single clear
call to action), gaze ek Z-SHAPE trace karti hai:
  1. Top ke saath left se right (logo -> nav -> top-right element,
     aksar jahan ek "Sign up" button rehta hai)
  2. Bottom-left tak ek diagonal sweep down
  3. Bottom ke saath left se right (aksar jahan primary call to
     action baithta hai)

Practical implication: is path ke END pe (bottom-right, ya simpler
layout ke liye top-right) placed ek primary call-to-action button us
jagah align karta hai jahan attention naturally last aata hai aur linger
karta hai — ise kahin aisi jagah rakhna jahan Z-pattern ka gaze path
naturally nahi pahunchta measurably ise dekhe jaane ke chance ko kam
karta hai.
\`\`\`

**Ye ek testable, checkable design constraint kyun hai — sirf "important
cheezein top ke paas rakho" nahi:**

\`\`\`tsx
// Ek pricing page measured Z-pattern KE AGAINST laid out — primary
// CTA wahan baithta hai jahan gaze naturally travel NAHI karti
function PricingPageWrong() {
  return (
    <div>
      <header>{/* logo, nav */}</header>
      <button className="cta-primary" style={{ float: 'left', marginTop: '4px' }}>
        Start Free Trial
      </button>
      {/* top-left placed, logo ke turant baad — Z-pattern ka natural
          end point NAHI hai jahan */}
      <PricingTable />
    </div>
  );
}

// Z-pattern KE SAATH aligned — path ke natural endpoint pe CTA
function PricingPageRight() {
  return (
    <div>
      <header>{/* logo, nav, "Sign up" top-right */}</header>
      <PricingTable />
      <div className="cta-section" style={{ textAlign: 'right' }}>
        <button className="cta-primary">Start Free Trial</button>
      </div>
      {/* bottom-right — Z-pattern ka natural terminal point */}
    </div>
  );
}
\`\`\`

**Ye pattern reading habits se shaped ek strong tendency kyun hai, ek
rigid law nahi jo har jagah identically apply hota hai:** F-pattern aur
Z-pattern primarily left-to-right reading populations aur layouts pe
measure kiye gaye the — underlying mechanism (gaze us path ko follow
karti hai jise reading habits aur visual prominence sabse aasan banate
hain) general hai, par uski specific SHAPE genuinely right-to-left
reading contexts ke liye alag hai, aur kisi bhi individual page ki
actual visual hierarchy (ek bada, high-contrast image jo off-pattern
placed hai) default scan path ko override kar sakti hai. Practical
skill ye samajhna hai ki pattern KYUN exist karta hai (habituated
reading direction plus visual prominence) itni achhi tarah ki ek
specific page ki actual audience aur content ke baare mein reason kiya
ja sake, F/Z shapes ko universal law ki tarah memorize karna nahi.

**Ye Lesson 1 ke Gestalt principles se kaise connect karta hai:** scan
patterns us ORDER ko determine karte hain jisme ek insaan ki gaze
Gestalt-grouped elements ko encounter karti hai; Gestalt principles
determine karte hain ki wo elements gaze ke aane ke baad kaise perceive
aur group hote hain. Ek perfectly Gestalt-grouped content ka section jo
poori tarah ek page ke natural scan path se bahar baithta hai abhi bhi
unseen ja sakta hai — do mechanisms wahi overall visual-processing
pipeline ke alag stages pe operate karte hain.`,

    content: `## Why the F-pattern and Z-pattern are the direct result of real
eye-tracking measurement, not a designer's inference

Nielsen Norman Group's 2006 eye-tracking research (and the substantial
replication since) recorded actual gaze paths across a large number of
real users viewing real pages, producing heat-map data that revealed
these two recurring, statistically common shapes. This is fundamentally
different from a designer's intuition about "where people probably
look" — it's a direct behavioral measurement, which is precisely why it
functions as a genuine design constraint that can be tested against
(via a team's own eye-tracking or click-heat-map data) rather than
argued about as a matter of opinion.

## Why the two patterns correspond to genuinely different content
types, not interchangeable defaults

The F-pattern emerges specifically on text-dense pages where a reader
is scanning for relevant information rather than reading every word
linearly — the pattern reflects a reading strategy optimized for
finding what matters quickly, with attention decaying as the eye moves
down and right from the most information-dense starting point. The
Z-pattern emerges on simpler, less text-dense layouts where there are
fewer discrete pieces of content to scan, making the eye's path more
predictable and closer to the page's actual visual structure (top-left
to bottom-right). Applying the wrong pattern's implications to the wrong
content type — assuming a text-heavy article page will produce
Z-pattern-style perfect corner-to-corner attention, for instance —
produces a genuinely mismatched design decision.

## Why the underlying mechanism, not the specific shape, is what
generalizes across contexts

Both patterns are specific manifestations of a more general mechanism:
gaze follows the path of least resistance created by habituated reading
direction and visual prominence. This is precisely why the SHAPES
themselves are known to differ for right-to-left reading populations
(where the natural sweep direction reverses) and can be overridden
entirely by a sufficiently prominent visual element placed elsewhere on
the page (a large image or strong color contrast can capture initial
attention regardless of the default scan path). Understanding this
underlying mechanism — rather than treating the F/Z shapes as fixed,
universal templates — is what lets a developer or designer reason
correctly about an atypical layout or audience.

## How this lesson's scan-order mechanism combines with Lesson 1's
grouping mechanism

Lesson 1 established how elements get perceived as belonging together
once seen (Gestalt grouping); this lesson establishes the actual order
in which a person's gaze is likely to encounter those groups in the
first place. A page can have flawless Gestalt grouping — every related
element correctly clustered — while still burying its most important
group entirely outside the page's natural scan path, producing a design
that would score well on a "does this look organized" review while
still performing poorly on "does anyone actually see the key
information." Effective layout design requires getting both mechanisms
right: the correct grouping, placed along the path attention will
actually travel.`,

    contentHi: `## F-pattern aur Z-pattern real eye-tracking measurement ka direct result kyun hain, ek designer ki inference nahi

Nielsen Norman Group ki 2006 eye-tracking research (aur tab se
substantial replication) ne bade number of real users ke actual gaze
paths ko record kiya real pages dekhte hue, heat-map data produce karte
hue jisne ye do recurring, statistically common shapes reveal ki. Ye
fundamentally alag hai ek designer ki intuition se "log probably kahan
dekhte hain" ke baare mein — ye ek direct behavioral measurement hai,
jo exactly wajah hai ki ye ek genuine design constraint ki tarah
function karta hai jise test kiya ja sakta hai (ek team ke apne eye-
tracking ya click-heat-map data ke through) opinion ki matter ki tarah
argue karne ke bajaye.

## Do patterns genuinely alag content types se correspond karte hain kyun, interchangeable defaults nahi

F-pattern specifically text-dense pages pe emerge hota hai jahan ek
reader har word linearly padhne ke bajaye relevant information ke liye
scan kar raha hota hai — pattern ek reading strategy reflect karta hai
jo jaldi kya matter karta hai dhundhne ke liye optimized hai, attention
decay karte hue jaise eye sabse information-dense starting point se
niche aur right ki taraf move karti hai. Z-pattern simpler, less
text-dense layouts pe emerge hota hai jahan scan karne ke liye kam
discrete pieces of content hain, eye ke path ko zyada predictable aur
page ke actual visual structure ke zyada close banate hue (top-left se
bottom-right tak). Galat pattern ke implications ko galat content type
pe apply karna — jaise ye assume karna ki ek text-heavy article page
Z-pattern-style perfect corner-to-corner attention produce karegi —
ek genuinely mismatched design decision produce karta hai.

## Underlying mechanism, specific shape nahi, kyun generalize karta hai contexts ke across

Dono patterns ek zyada general mechanism ke specific manifestations
hain: gaze us path of least resistance ko follow karti hai jo habituated
reading direction aur visual prominence create karte hain. Yahi exactly
wajah hai SHAPES khud right-to-left reading populations ke liye alag
hone ke liye jaani jaati hain (jahan natural sweep direction reverse ho
jaati hai) aur ek sufficiently prominent visual element se poori tarah
override ho sakti hain jo page pe kahin aur placed hai (ek bada image
ya strong color contrast default scan path se independently initial
attention capture kar sakta hai). Is underlying mechanism ko samajhna —
F/Z shapes ko fixed, universal templates ki tarah treat karne ke bajaye
— wo hai jo ek developer ya designer ko ek atypical layout ya audience
ke baare mein correctly reason karne deta hai.

## Ye lesson ka scan-order mechanism Lesson 1 ke grouping mechanism ke saath kaise combine hota hai

Lesson 1 ne establish kiya ki elements ek baar dekhe jaane ke baad kaise
saath belong karte hue perceive hote hain (Gestalt grouping); ye lesson
actual order establish karta hai jisme ek insaan ki gaze pehli jagah un
groups ko encounter karti hai. Ek page mein flawless Gestalt grouping ho
sakti hai — har related element correctly clustered — jabki abhi bhi
apne sabse important group ko poori tarah page ke natural scan path se
bahar bury kiya jaaye, ek aisa design produce karte hue jo "kya ye
organized dikhta hai" review pe achha score karega jabki abhi bhi "kya
koi actually key information dekhta hai" pe poorly perform kare.
Effective layout design ko dono mechanisms sahi karne chahiye: correct
grouping, us path ke saath placed jahan attention actually travel
karegi.`,

    examples: [
      {
        title: 'A search-results-style page structured to front-load the highest-attention content per the F-pattern',
        titleHi: 'Ek search-results-style page jo F-pattern ke hisaab se highest-attention content ko front-load karne ke liye structure kiya gaya',
        codeJs: `function SearchResultItem({ title, snippet, url }) {
  return (
    <article className="result-item">
      {/* The F-pattern's top horizontal sweep and left-side vertical
          scan give the FIRST FEW WORDS of the title disproportionate
          attention — the most important, distinguishing word goes first */}
      <h3 className="result-title">{title}</h3>

      {/* Attention decays moving right and down — snippet text placed
          here receives progressively less scanning attention, so the
          most relevant sentence should lead the snippet, not trail it */}
      <p className="result-snippet">{snippet}</p>
      <span className="result-url">{url}</span>
    </article>
  );
}

// Applied: a result about "React Performance Optimization" should have
// its title read "React Performance Optimization" NOT "A Guide to
// Making Your Application Faster with React" — the F-pattern's decaying
// left-to-right attention means the DISTINGUISHING word should appear
// as early as possible in the title, not buried after generic framing`,
        codeTs: `interface SearchResultItemProps {
  title: string;
  snippet: string;
  url: string;
}

function SearchResultItem({ title, snippet, url }: SearchResultItemProps) {
  return (
    <article className="result-item">
      {/* The F-pattern's top horizontal sweep and left-side vertical
          scan give the FIRST FEW WORDS of the title disproportionate
          attention — the most important, distinguishing word goes first */}
      <h3 className="result-title">{title}</h3>

      {/* Attention decays moving right and down — snippet text placed
          here receives progressively less scanning attention, so the
          most relevant sentence should lead the snippet, not trail it */}
      <p className="result-snippet">{snippet}</p>
      <span className="result-url">{url}</span>
    </article>
  );
}

// Applied: a result about "React Performance Optimization" should have
// its title read "React Performance Optimization" NOT "A Guide to
// Making Your Application Faster with React" — the F-pattern's decaying
// left-to-right attention means the DISTINGUISHING word should appear
// as early as possible in the title, not buried after generic framing`,
        code: `<article className="result-item">
  <h3 className="result-title">{title}</h3>  {/* lead with the distinguishing word */}
  <p className="result-snippet">{snippet}</p> {/* most relevant sentence first */}
  <span className="result-url">{url}</span>
</article>`,
        output:
          "A visitor scanning a list of 10 search results in F-pattern fashion reads roughly the first 2-3 words of each title fully, with decreasing attention further right — a title front-loaded with its distinguishing term ('React Performance Optimization...') is far more likely to be correctly evaluated at a glance than one that buries the key term after generic framing ('A Complete Guide to...').",
        explain:
          "This directly applies the F-pattern's measured attention-decay finding to a concrete content-writing decision: since gaze attention measurably decreases moving right along each horizontal sweep, the single highest-value word placement is as early in the title as possible — this isn't a stylistic preference, it's a direct response to where the measured F-pattern places the most attention.",
        explainHi:
          "Ye directly F-pattern ki measured attention-decay finding ko ek concrete content-writing decision pe apply karta hai: kyunki gaze attention measurably kam hoti hai har horizontal sweep ke saath right move karte hue, single highest-value word placement title mein jitna jaldi ho sake hai — ye ek stylistic preference nahi hai, ye ek direct response hai us jagah ka jahan measured F-pattern sabse zyada attention rakhta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Placing a landing page's primary call-to-action at the TOP-LEFT,
// immediately competing with the logo for the Z-pattern's starting point
function LandingPageWrong() {
  return (
    <header style={{ display: 'flex' }}>
      <button className="cta-primary">Get Started Free</button>
      <Logo />
      <Nav />
    </header>
  );
  // The Z-pattern's natural path ENDS at the bottom-right (or, for a
  // simpler header-only layout, at least reaches top-right before the
  // eye moves on) — placing the primary CTA at the very START of the
  // scan path means it competes with the logo for initial attention
  // and is then LEFT BEHIND as gaze continues along the expected path
}`,
        right: `// Aligning the primary CTA with where the Z-pattern's gaze path
// naturally arrives and lingers
function LandingPageRight() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Logo />
      <Nav />
      <button className="cta-primary">Get Started Free</button>
      {/* top-RIGHT — where the first horizontal sweep of the Z-pattern
          naturally concludes, a position that receives sustained
          attention rather than a fleeting initial glance */}
    </header>
  );
}`,
        why: "The Z-pattern's measured gaze path moves left to right along the top before continuing — placing a primary call-to-action at the very start of this path means it's seen only briefly before attention moves on, while placing it at a natural endpoint of the scan path (top-right, or the page's bottom-right) aligns with where attention actually lingers.",
        whyHi:
          "Z-pattern ka measured gaze path top ke saath left se right move karta hai continue karne se pehle — is path ke bilkul start pe ek primary call-to-action rakhna matlab hai ise sirf briefly dekha jata hai attention aage move hone se pehle, jabki ise scan path ke ek natural endpoint pe rakhna (top-right, ya page ka bottom-right) us jagah align karta hai jahan attention actually linger karti hai.",
      },
    ],

    realWorld: [
      {
        en: "A production SaaS marketing site's own heat-map data confirmed a textbook Z-pattern on its pricing page, leading the team to deliberately place the highest-tier plan's 'Most Popular' badge and CTA button at the bottom-right — the pattern's natural terminal point — after A/B testing showed a measurable conversion improvement over its original top-left placement.",
        hi: 'Ek production SaaS marketing site ke apne heat-map data ne apne pricing page pe ek textbook Z-pattern confirm kiya, team ko deliberately highest-tier plan ka \'Most Popular\' badge aur CTA button bottom-right pe rakhne ki taraf le jaate hue — pattern ka natural terminal point — A/B testing ne dikhaya ki ek measurable conversion improvement uski original top-left placement se zyada hui uske baad.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the actual difference between the F-pattern and Z-pattern, and what determines which one applies to a given page?',
        qHi: 'F-pattern aur Z-pattern ke beech actual difference kya hai, aur kya determine karta hai ki ek given page pe kaunsa apply hota hai?',
        a: "The F-pattern emerges on text-dense pages (search results, article listings) where a reader scans for relevant information, producing a full top sweep, a shorter middle sweep, and a decaying left-side vertical scan. The Z-pattern emerges on simpler, less text-dense layouts, producing a top horizontal sweep, a diagonal drop, and a bottom horizontal sweep. Which applies depends on the page's actual content density and structure, not a fixed rule for all pages.",
        aHi: 'F-pattern text-dense pages (search results, article listings) pe emerge hota hai jahan ek reader relevant information ke liye scan karta hai, ek full top sweep, ek shorter middle sweep, aur ek decaying left-side vertical scan produce karte hue. Z-pattern simpler, less text-dense layouts pe emerge hota hai, ek top horizontal sweep, ek diagonal drop, aur ek bottom horizontal sweep produce karte hue. Kaunsa apply hota hai page ki actual content density aur structure pe depend karta hai, sab pages ke liye ek fixed rule nahi.',
      },
      {
        q: "Why should the F-pattern and Z-pattern be understood as behavioral tendencies derived from a specific mechanism, rather than universal, unchangeable laws?",
        qHi: 'F-pattern aur Z-pattern ko ek specific mechanism se derived behavioral tendencies ki tarah kyun samajhna chahiye, universal, unchangeable laws ke bajaye?',
        a: "The underlying mechanism is gaze following the path of least resistance shaped by habituated reading direction and visual prominence. This is why the specific shapes are known to differ for right-to-left reading populations, and why a sufficiently prominent visual element elsewhere on a page can override the default scan path entirely — understanding the mechanism lets a designer reason correctly about atypical layouts or audiences rather than misapplying a fixed template.",
        aHi: 'Underlying mechanism gaze hai jo habituated reading direction aur visual prominence se shaped path of least resistance follow karti hai. Yahi wajah hai specific shapes right-to-left reading populations ke liye alag hone ke liye jaani jaati hain, aur kyun ek page pe kahin aur ek sufficiently prominent visual element default scan path ko poori tarah override kar sakta hai — mechanism samajhna ek designer ko atypical layouts ya audiences ke baare mein correctly reason karne deta hai ek fixed template ko misapply karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "A team redesigns their blog's article-listing page (a text-dense, F-pattern-relevant layout) but writes every article title starting with the generic phrase 'Learn About...' before the actual topic (e.g., 'Learn About React Hooks' instead of 'React Hooks'). Using the F-pattern's mechanism, explain why this specific phrasing choice measurably hurts scannability, and propose a fix.",
        taskHi: 'Ek team apne blog ka article-listing page redesign karti hai (ek text-dense, F-pattern-relevant layout) par har article title ko generic phrase \'Learn About...\' se shuru karke likhti hai actual topic se pehle (jaise, \'React Hooks\' ke bajaye \'Learn About React Hooks\'). F-pattern ke mechanism ka use karke, explain karo ki ye specific phrasing choice measurably scannability ko kyun hurt karti hai, aur ek fix propose karo.',
        hint: "Think about which words receive the most attention under the F-pattern's leading horizontal sweep, and whether 'Learn About' or the actual topic name should occupy that highest-attention position.",
        hintHi: 'Socho ki F-pattern ke leading horizontal sweep ke under kaunse words sabse zyada attention paate hain, aur kya \'Learn About\' ya actual topic name ko us highest-attention position pe occupy karna chahiye.',
      },
    ],

    keyTakeaways: [
      "The F-pattern (text-dense pages) and Z-pattern (simpler layouts) are directly measured behavioral findings from real eye-tracking research (Nielsen Norman Group, 2006), not designer inference about where people probably look.",
      "The F-pattern's key implication is attention decay moving right and down — the most important, distinguishing words should lead a heading or sentence, not trail generic framing.",
      "The Z-pattern's key implication is that a primary call-to-action aligns best with the path's natural endpoint (top-right or bottom-right), not its starting point.",
      "Both patterns are specific manifestations of a general mechanism (habituated reading direction plus visual prominence), which is why they differ for right-to-left reading contexts and can be overridden by sufficiently prominent visual elements — understanding the mechanism matters more than memorizing the shapes.",
    ],
    keyTakeawaysHi: [
      'F-pattern (text-dense pages) aur Z-pattern (simpler layouts) real eye-tracking research (Nielsen Norman Group, 2006) se directly measured behavioral findings hain, designer inference nahi is baare mein ki log probably kahan dekhte hain.',
      'F-pattern ka key implication attention decay hai right aur niche move karte hue — sabse important, distinguishing words ko ek heading ya sentence ka lead karna chahiye, generic framing ko trail nahi karna chahiye.',
      "Z-pattern ka key implication ye hai ki ek primary call-to-action path ke natural endpoint (top-right ya bottom-right) ke saath best align karta hai, uske starting point ke saath nahi.",
      'Dono patterns ek general mechanism (habituated reading direction plus visual prominence) ke specific manifestations hain, yahi wajah hai wo right-to-left reading contexts ke liye alag hain aur sufficiently prominent visual elements se override ho sakte hain — mechanism samajhna shapes memorize karne se zyada matter karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'psych-color-perception-and-accessibility',
    title: 'Color Perception & Why It Is Inseparable From Accessibility',
    titleHi: 'Color Perception Aur Ye Accessibility Se Kyun Inseparable Hai',
    description:
      "Closing this module: how color perception genuinely works (not everyone's visual system processes color identically), why this makes accessibility a direct, mechanical consequence of color science rather than a separate compliance checkbox, and concrete, checkable patterns for using color correctly.",
    descriptionHi:
      'Is module ko close karte hue: color perception genuinely kaise kaam karti hai (har kisi ka visual system color ko identically process nahi karta), ye accessibility ko color science ka ek direct, mechanical consequence kyun banata hai ek separate compliance checkbox ke bajaye, aur color ko correctly use karne ke liye concrete, checkable patterns.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A traffic signal system that relies purely on red versus green, versus one that also varies each light's position and includes a distinct shape or symbol, so it remains fully readable to someone who genuinely cannot distinguish red from green by hue alone.** A traffic light system relying purely on \"red means stop, green means go\" as color hues works perfectly for most people, but a real, substantial fraction of any population has some form of red-green color vision difference and cannot reliably distinguish those two specific hues from each other by color alone. A well-designed traffic signal system doesn't just hope this population figures it out some other way — it uses a FIXED, CONSISTENT POSITION (red always on top, green always on bottom) as a second, position-based channel of information that works completely independently of whether someone can distinguish the colors themselves. Removing either channel would break the system for someone: removing color would slow down everyone who relies on the quick color glance; removing the fixed position would break it entirely for anyone who cannot use color as a reliable signal. Digital interfaces face the exact same real, physiological reality: roughly 8% of men and a smaller percentage of women have some form of color vision difference, most commonly red-green — which is why color alone, as the ONLY channel encoding important information (an error state, a required field, a status indicator), genuinely fails for a real, non-trivial fraction of any user base, the same way a traffic light relying purely on hue would.",
      hi: 'Ek traffic signal system jo purely red versus green pe rely karta hai, versus ek jo har light ki position bhi vary karta hai aur ek distinct shape ya symbol include karta hai, taaki ye kisi ke liye bhi poori tarah readable rahe jo genuinely hue akele se red ko green se distinguish nahi kar sakta. Ek traffic light system jo purely "red matlab stop, green matlab go" color hues pe rely karta hai zyadatar logon ke liye perfectly kaam karta hai, par kisi bhi population ka ek real, substantial fraction kisi form ki red-green color vision difference rakhta hai aur un do specific hues ko akele color se ek doosre se reliably distinguish nahi kar sakta. Ek well-designed traffic signal system sirf ye hope nahi karta ki ye population isse kisi aur tareeke se figure out kar legi — ye ek FIXED, CONSISTENT POSITION use karta hai (red hamesha upar, green hamesha niche) ek doosra, position-based channel of information ki tarah jo poori tarah independently kaam karta hai ki kya koi colors khud ko distinguish kar sakta hai. Kisi bhi channel ko hatana kisi ke liye system ko break kar dega: color hatana har kisi ko slow kar dega jo quick color glance pe rely karta hai; fixed position hatana ise poori tarah break kar dega kisi ke liye bhi jo color ko ek reliable signal ki tarah use nahi kar sakta. Digital interfaces exactly wahi real, physiological reality face karte hain: roughly 8% men aur ek chhota percentage women ki kisi form ki color vision difference hai, most commonly red-green — yahi wajah hai akela color, ek important information (ek error state, ek required field, ek status indicator) encode karne wale EKMATRA channel ki tarah, ek real, non-trivial fraction of any user base ke liye genuinely fail hota hai, wahi tarike se jaise ek traffic light purely hue pe rely karte hue karega.',
    },

    simple: `**The actual, measured physiological fact — color vision
differences are common, not a rare edge case:**

\`\`\`
Roughly 8% of men and approximately 0.5% of women have some form of
color vision difference, most commonly a red-green variant (deuteranomaly
and protanomaly are the most common specific types).

This is not a rare accessibility edge case affecting a tiny minority —
in a user base of any meaningful size, color-vision differences affect
a real, statistically predictable, non-trivial percentage of visitors,
every single time, without exception.
\`\`\`

**Why "color alone" as an information channel genuinely fails for
this population — a concrete, checkable example:**

\`\`\`css
/* WRONG — color is the ONLY signal distinguishing a valid from an
   invalid form field */
.field.valid { border-color: green; }
.field.invalid { border-color: red; }
/* For someone with red-green color vision difference, these two
   states can be genuinely indistinguishable — the interface FAILS
   to communicate validity status at all for this population, not
   just "looks less polished" */
\`\`\`

\`\`\`css
/* CORRECT — a second, non-color channel (icon/shape) carries the
   SAME information, working independently of color perception */
.field.valid::after { content: '✓'; color: green; }
.field.invalid::after { content: '✗'; color: red; }
/* Now the icon SHAPE (checkmark vs. X) distinguishes the states even
   if the color itself cannot be reliably distinguished — this is the
   traffic-light's "fixed position" principle applied to form validation */
\`\`\`

**A concrete, testable rule this makes actionable — the "grayscale
test":**

\`\`\`ts
function passesColorIndependenceTest(uiState) {
  // If you can convert a screenshot to pure grayscale and STILL
  // correctly distinguish every meaningfully different state, color
  // is not the sole information channel — the interface passes.
  // If any two meaningfully different states become indistinguishable
  // in grayscale, color was the ONLY channel, and the interface fails
  // for anyone who cannot perceive that specific color distinction.
  return uiState.hasNonColorDistinguisher; // icon, shape, position, text label
}
\`\`\`

**Why WCAG's contrast-ratio requirements are the SAME underlying
physiological reality, applied to a different but related problem:**

\`\`\`
Color vision differences (this lesson's main focus) are about
DISTINGUISHING one color/hue from another. Contrast ratio (a separate
but closely related WCAG requirement) is about whether text is
perceivable AT ALL against its background, relevant even for someone
with entirely typical color vision under bad lighting, on a low-quality
screen, or with any degree of low vision.

WCAG AA requires a 4.5:1 contrast ratio for normal text, 3:1 for large
text — a measurable, checkable number, not a subjective "does this look
readable" judgment call.
\`\`\`

\`\`\`ts
function getContrastRatio(foregroundHex, backgroundHex) {
  // A real, standard formula (relative luminance calculation per WCAG)
  const fgLuminance = getRelativeLuminance(foregroundHex);
  const bgLuminance = getRelativeLuminance(backgroundHex);
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

getContrastRatio('#767676', '#FFFFFF'); // ~4.54 — passes WCAG AA for normal text
getContrastRatio('#AAAAAA', '#FFFFFF'); // ~2.32 — FAILS, genuinely too low
\`\`\`

**Why this lesson frames accessibility as inseparable from color
perception, not a separate compliance layer added afterward:** every
example in this lesson is a direct, mechanical consequence of how color
vision actually works across a real population — designing with a
non-color-dependent second channel and sufficient contrast isn't a
"nice to have" checked after the main design work is done; it's simply
correctly accounting for the actual, physiological range of how color
is perceived by a real user base, the same way correctly handling a
range of screen sizes is simply accounting for the actual range of
devices in use, not an optional "responsive design" add-on.`,

    simpleHi: `**Actual, measured physiological fact — color vision differences
common hain, ek rare edge case nahi:**

\`\`\`
Roughly 8% men aur approximately 0.5% women ki kisi form ki color
vision difference hai, most commonly ek red-green variant (deuteranomaly
aur protanomaly sabse common specific types hain).

Ye ek rare accessibility edge case nahi hai jo ek tiny minority ko
affect karta hai — kisi bhi meaningful size ke user base mein,
color-vision differences ek real, statistically predictable, non-
trivial percentage of visitors ko affect karti hain, har single baar,
bina exception ke.
\`\`\`

**"Akela color" ek information channel ki tarah is population ke liye
genuinely kyun fail hota hai — ek concrete, checkable example:**

\`\`\`css
/* GALAT — color EKMATRA signal hai jo ek valid ko invalid form field
   se distinguish karta hai */
.field.valid { border-color: green; }
.field.invalid { border-color: red; }
/* Red-green color vision difference wale kisi ke liye, ye do states
   genuinely indistinguishable ho sakte hain — interface is population
   ke liye validity status communicate karne mein bilkul FAIL karta
   hai, sirf "kam polished dikhta hai" nahi */
\`\`\`

\`\`\`css
/* CORRECT — ek second, non-color channel (icon/shape) WAHI information
   carry karta hai, color perception se independently kaam karte hue */
.field.valid::after { content: '✓'; color: green; }
.field.invalid::after { content: '✗'; color: red; }
/* Ab icon SHAPE (checkmark vs. X) states ko distinguish karta hai
   chahe color khud reliably distinguish na ki ja sake — ye traffic-
   light ke "fixed position" principle ka form validation pe applied
   version hai */
\`\`\`

**Ek concrete, testable rule jise ye actionable banata hai — "grayscale
test":**

\`\`\`ts
function passesColorIndependenceTest(uiState) {
  // Agar aap ek screenshot ko pure grayscale mein convert kar sakte ho
  // aur ABHI BHI har meaningfully different state ko correctly
  // distinguish kar sakte ho, color ekmatra information channel nahi
  // hai — interface pass karta hai. Agar koi do meaningfully different
  // states grayscale mein indistinguishable ban jaate hain, color
  // EKMATRA channel tha, aur interface fail hota hai kisi ke liye bhi
  // jo us specific color distinction ko perceive nahi kar sakta.
  return uiState.hasNonColorDistinguisher; // icon, shape, position, text label
}
\`\`\`

**WCAG ke contrast-ratio requirements wahi underlying physiological
reality kyun hain, ek alag par related problem pe applied:**

\`\`\`
Color vision differences (is lesson ka main focus) ek color/hue ko
doosre se DISTINGUISH karne ke baare mein hain. Contrast ratio (ek
separate par closely related WCAG requirement) is baare mein hai ki kya
text apne background ke against BILKUL perceivable hai, even kisi ke
liye jiski entirely typical color vision hai bad lighting ke under, ek
low-quality screen pe, ya kisi degree ki low vision ke saath.

WCAG AA ko ek 4.5:1 contrast ratio chahiye normal text ke liye, 3:1
large text ke liye — ek measurable, checkable number, ek subjective
"kya ye readable dikhta hai" judgment call nahi.
\`\`\`

\`\`\`ts
function getContrastRatio(foregroundHex, backgroundHex) {
  // Ek real, standard formula (relative luminance calculation WCAG ke hisaab se)
  const fgLuminance = getRelativeLuminance(foregroundHex);
  const bgLuminance = getRelativeLuminance(backgroundHex);
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

getContrastRatio('#767676', '#FFFFFF'); // ~4.54 — normal text ke liye WCAG AA pass karta hai
getContrastRatio('#AAAAAA', '#FFFFFF'); // ~2.32 — FAIL, genuinely bahut kam
\`\`\`

**Ye lesson accessibility ko color perception se inseparable ki tarah
kyun frame karta hai, baad mein add ki gayi ek separate compliance
layer nahi:** is lesson ka har example color vision ke real population
ke across actually kaam karne ke tareeke ka ek direct, mechanical
consequence hai — ek non-color-dependent second channel aur sufficient
contrast ke saath design karna main design work ho jaane ke baad check
kiya gaya ek "nice to have" nahi hai; ye simply correctly account karna
hai us actual, physiological range ka ki color ek real user base dwara
kaise perceive kiya jata hai, wahi tarike se jaise screen sizes ki ek
range ko correctly handle karna simply devices ki actual range ko
account karna hai jo use mein hain, ek optional "responsive design"
add-on nahi.`,

    content: `## Why the statistical prevalence of color vision differences
matters for how this is framed

The roughly 8% figure for men (and the smaller but real percentage for
women) means color vision differences affect a large, predictable,
non-trivial fraction of any sufficiently large user base — this is a
statistical certainty for any real product, not a rare edge case that
might theoretically matter for one unlucky user. Framing this as a
common, expected variation in how color is physiologically perceived —
rather than as a rare disability requiring special-case accommodation
— is what correctly motivates designing for it as a default practice
rather than an optional add-on considered only after the "real" design
work is finished.

## Why color as a sole information channel is a structural design
failure, not a matter of degree

When a specific pair of hues (most commonly red and green) is the ONLY
signal distinguishing two meaningfully different states, someone unable
to reliably distinguish those specific hues experiences a genuine
failure of the interface to communicate that information at all — not
a minor aesthetic inconvenience, but a complete breakdown of a specific
communication channel for a predictable fraction of users. The
grayscale test operationalizes this precisely: if converting a design
to pure grayscale erases a meaningful distinction, color was carrying
information no other channel backed up, and the design fails for
exactly the population this lesson establishes is a real, substantial
percentage of any audience.

## Why contrast ratio is a related but mechanistically distinct
accessibility concern from color-distinction

Color vision differences are about distinguishing one hue from another;
contrast ratio is about whether content is visible against its
background at all, a concern relevant even to someone with entirely
typical color vision under non-ideal viewing conditions (glare, an
older or lower-quality screen, any degree of low vision unrelated to
color perception specifically). WCAG's specific numeric thresholds
(4.5:1 for normal text, 3:1 for large text under the AA standard)
convert this into a directly measurable, checkable engineering
requirement rather than a subjective aesthetic judgment — the same
category of concrete, checkable constraint this lesson's grayscale test
provides for color-independence.

## How this lesson closes Module 1 by combining all three lessons'
mechanisms into one accessibility argument

A genuinely accessible interface applies Lesson 1's Gestalt grouping
using cues that don't rely on color distinction alone (shape, position,
and text alongside color), respects Lesson 2's scan-pattern findings
while ensuring critical information isn't conveyed by color placement
alone, and accounts for this lesson's color-perception reality by never
making a single hue distinction the sole carrier of meaningfully
different information. This is why accessibility, correctly understood,
isn't a separate module bolted onto perception and visual processing —
it's the direct, necessary consequence of taking this module's actual
findings about how human vision works seriously for the full range of
human visual systems, not an idealized "typical" one.`,

    contentHi: `## Color vision differences ki statistical prevalence is lesson ke framing ke liye kyun matter karti hai

Men ke liye roughly 8% figure (aur women ke liye smaller par real
percentage) ka matlab hai color vision differences kisi bhi sufficiently
bade user base ke ek bade, predictable, non-trivial fraction ko affect
karti hain — ye kisi bhi real product ke liye ek statistical certainty
hai, ek rare edge case nahi jo theoretically ek unlucky user ke liye
matter kar sakta hai. Ise ek common, expected variation ki tarah frame
karna is baat mein ki color physiologically kaise perceive kiya jata hai
— ek rare disability ki tarah nahi jise special-case accommodation
chahiye — wo hai jo correctly motivate karta hai ise ek default practice
ki tarah design karna ek optional add-on ke bajaye jo sirf "real" design
work khatam hone ke baad consider kiya jaata hai.

## Color ko sole information channel ki tarah use karna ek structural design failure kyun hai, degree ki baat nahi

Jab ek specific pair of hues (most commonly red aur green) EKMATRA
signal hai jo do meaningfully different states ko distinguish karta
hai, koi jo un specific hues ko reliably distinguish nahi kar sakta
experience karta hai interface ki ek genuine failure us information ko
bilkul communicate karne mein — ek minor aesthetic inconvenience nahi,
balki users ke ek predictable fraction ke liye ek specific communication
channel ka ek complete breakdown. Grayscale test ise precisely
operationalize karta hai: agar ek design ko pure grayscale mein convert
karna ek meaningful distinction ko erase kar deta hai, color us
information carry kar raha tha jise koi doosra channel back up nahi
karta tha, aur design exactly us population ke liye fail hota hai jise
ye lesson establish karta hai kisi bhi audience ka ek real, substantial
percentage hai.

## Contrast ratio color-distinction se ek related par mechanistically distinct accessibility concern kyun hai

Color vision differences ek hue ko doosre se distinguish karne ke baare
mein hain; contrast ratio is baare mein hai ki kya content apne
background ke against bilkul visible hai, ek concern jo entirely
typical color vision wale kisi ke liye bhi relevant hai non-ideal
viewing conditions ke under (glare, ek older ya lower-quality screen,
color perception se specifically unrelated kisi bhi degree ki low
vision). WCAG ke specific numeric thresholds (AA standard ke under
normal text ke liye 4.5:1, large text ke liye 3:1) ise ek directly
measurable, checkable engineering requirement mein convert karte hain
ek subjective aesthetic judgment ke bajaye — wahi category ka concrete,
checkable constraint jo is lesson ka grayscale test color-independence
ke liye provide karta hai.

## Ye lesson Module 1 ko teenon lessons ke mechanisms ko ek accessibility argument mein combine karke kaise close karta hai

Ek genuinely accessible interface Lesson 1 ki Gestalt grouping ko un
cues use karke apply karta hai jo akele color distinction pe rely nahi
karte (shape, position, aur color ke saath text), Lesson 2 ke scan-
pattern findings ko respect karta hai jabki ye ensure karte hue ki
critical information sirf color placement se convey nahi hoti, aur is
lesson ki color-perception reality ko account karta hai kabhi ek single
hue distinction ko meaningfully different information ka sole carrier
banaye bina. Yahi wajah hai accessibility, correctly samjhi gayi,
perception aur visual processing pe bolt ki gayi ek separate module
nahi hai — ye is module ki actual findings ko human vision kaise kaam
karta hai iske baare mein seriously lene ka direct, necessary consequence
hai human visual systems ki poori range ke liye, ek idealized "typical"
wale ke liye nahi.`,

    examples: [
      {
        title: 'A form-validation component and a contrast-checking utility, both applying this lesson\'s physiological findings directly',
        titleHi: 'Ek form-validation component aur ek contrast-checking utility, dono is lesson ki physiological findings ko directly apply karte hue',
        codeJs: `// A validation indicator using BOTH color and a shape-based icon —
// color-independent, per the grayscale test
function ValidationIndicator({ isValid }) {
  return (
    <span className={isValid ? 'indicator valid' : 'indicator invalid'}>
      {isValid ? '✓' : '✗'} {/* the SHAPE carries the meaning */}
      {isValid ? ' Looks good' : ' Please check this field'} {/* text as a THIRD channel */}
    </span>
  );
}

// A contrast-ratio checker implementing WCAG's actual formula
function getRelativeLuminance(hex) {
  const rgb = [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16) / 255);
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function meetsWcagAA(foreground, background, isLargeText = false) {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= (isLargeText ? 3 : 4.5);
}

console.log(meetsWcagAA('#767676', '#FFFFFF')); // true — ratio ~4.54
console.log(meetsWcagAA('#AAAAAA', '#FFFFFF')); // false — ratio ~2.32`,
        codeTs: `interface ValidationIndicatorProps {
  isValid: boolean;
}

// A validation indicator using BOTH color and a shape-based icon —
// color-independent, per the grayscale test
function ValidationIndicator({ isValid }: ValidationIndicatorProps) {
  return (
    <span className={isValid ? 'indicator valid' : 'indicator invalid'}>
      {isValid ? '✓' : '✗'} {/* the SHAPE carries the meaning */}
      {isValid ? ' Looks good' : ' Please check this field'} {/* text as a THIRD channel */}
    </span>
  );
}

// A contrast-ratio checker implementing WCAG's actual formula
function getRelativeLuminance(hex: string): number {
  const rgb = [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16) / 255);
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function meetsWcagAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= (isLargeText ? 3 : 4.5);
}

console.log(meetsWcagAA('#767676', '#FFFFFF')); // true — ratio ~4.54
console.log(meetsWcagAA('#AAAAAA', '#FFFFFF')); // false — ratio ~2.32`,
        code: `function meetsWcagAA(foreground, background, isLargeText = false) {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= (isLargeText ? 3 : 4.5);
}`,
        output:
          "The ValidationIndicator communicates its state through THREE independent channels (color, icon shape, text label) — converting it to grayscale still leaves the checkmark/X shape and the text distinguishing the states. The contrast checker correctly flags '#AAAAAA on white' as failing WCAG AA (ratio ~2.32, below the 4.5:1 threshold) while '#767676 on white' passes (~4.54).",
        explain:
          "Both examples make this lesson's principles directly checkable in code rather than left as a subjective design judgment: the indicator's color-independence can be verified with the grayscale test, and the contrast ratio is a specific, computed number checked against a specific, documented WCAG threshold — no ambiguity about whether either passes.",
        explainHi:
          "Dono examples is lesson ke principles ko directly code mein checkable banate hain ek subjective design judgment ki tarah chhode jaane ke bajaye: indicator ki color-independence grayscale test se verify ki ja sakti hai, aur contrast ratio ek specific, computed number hai jo ek specific, documented WCAG threshold ke against check kiya gaya — koi ambiguity nahi ki kya koi bhi pass karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `/* Using color as the ONLY signal for a chart's data categories */
.chart-line-revenue { stroke: #e74c3c; } /* red */
.chart-line-costs { stroke: #2ecc71; }   /* green */
/* For someone with red-green color vision difference, these two lines
   can be genuinely indistinguishable on the chart — a real information
   failure, not a minor aesthetic issue, since the chart's entire
   purpose (distinguishing two data series) fails for this population */`,
        right: `/* Using color AS ONE channel alongside a shape/pattern-based second one */
.chart-line-revenue { stroke: #e74c3c; stroke-dasharray: none; }
.chart-line-costs { stroke: #2ecc71; stroke-dasharray: 6 3; } /* dashed */
/* Now line STYLE (solid vs. dashed) distinguishes the series
   independently of color — passing the grayscale test: converted to
   grayscale, the dash pattern still clearly distinguishes the two lines */`,
        why: "A chart distinguishing data series purely by color (especially a red/green pair) genuinely fails to communicate that distinction to the real, statistically predictable percentage of users with red-green color vision differences. Adding a second, non-color channel (line style, marker shape) preserves the information for everyone regardless of color perception.",
        whyHi:
          "Ek chart jo data series ko purely color se distinguish karta hai (especially ek red/green pair) genuinely un users ke real, statistically predictable percentage ko wo distinction communicate karne mein fail karta hai jinki red-green color vision differences hain. Ek second, non-color channel add karna (line style, marker shape) sabke liye information preserve karta hai unki color perception se independently.",
      },
    ],

    realWorld: [
      {
        en: "A production financial dashboard redesigned its profit/loss indicators after user feedback revealed that a genuinely non-trivial fraction of its own user base — consistent with the documented ~8% prevalence of color vision differences in men — could not reliably distinguish its red 'loss' and green 'profit' indicators, adding arrow icons (up/down) as a second, color-independent channel that resolved the issue completely.",
        hi: 'Ek production financial dashboard ne apne profit/loss indicators ko redesign kiya user feedback ke baad ye reveal hone pe ki apne user base ka ek genuinely non-trivial fraction — men mein color vision differences ki documented ~8% prevalence ke consistent — reliably apne red \'loss\' aur green \'profit\' indicators ko distinguish nahi kar sakta tha, arrow icons (up/down) ko ek second, color-independent channel ki tarah add karte hue jisne issue ko poori tarah resolve kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'Why should color vision differences be treated as a common, expected variation to design for by default, rather than a rare edge case?',
        qHi: 'Color vision differences ko ek common, expected variation ki tarah kyun treat kiya jaana chahiye default se design karne ke liye, ek rare edge case ke bajaye?',
        a: "Roughly 8% of men and approximately 0.5% of women have some form of color vision difference, most commonly red-green — this is a statistical certainty for any sufficiently large user base, not a rare occurrence affecting one unlucky user. This prevalence is what motivates designing for it as a default engineering practice rather than an optional accommodation considered only after the main design is finished.",
        aHi: 'Roughly 8% men aur approximately 0.5% women ki kisi form ki color vision difference hai, most commonly red-green — ye kisi bhi sufficiently bade user base ke liye ek statistical certainty hai, ek rare occurrence nahi jo ek unlucky user ko affect kare. Ye prevalence wo hai jo ise ek default engineering practice ki tarah design karne ko motivate karta hai ek optional accommodation ke bajaye jo sirf main design khatam hone ke baad consider kiya jaata hai.',
      },
      {
        q: "What is the 'grayscale test' and what does it actually check for?",
        qHi: "'Grayscale test' kya hai aur ye actually kya check karta hai?",
        a: "The grayscale test converts a design to pure grayscale and checks whether every meaningfully different state remains distinguishable. If two states become indistinguishable once color is removed, color was the sole information channel distinguishing them, meaning the design fails for anyone unable to perceive that specific color distinction — a concrete, checkable operationalization of 'don't use color alone.'",
        aHi: 'Grayscale test ek design ko pure grayscale mein convert karta hai aur check karta hai ki kya har meaningfully different state distinguishable rehta hai. Agar do states color hatane ke baad indistinguishable ban jaate hain, color unhe distinguish karne wala sole information channel tha, matlab design us kisi ke liye bhi fail hota hai jo us specific color distinction ko perceive nahi kar sakta — "akele color use mat karo" ka ek concrete, checkable operationalization.',
      },
    ],

    exercises: [
      {
        task: "A dashboard uses only a colored dot (red/yellow/green) with no accompanying icon, text, or shape difference to indicate a server's health status. Using this lesson's grayscale test and the documented prevalence of color vision differences, evaluate this design and propose a fix that passes the test.",
        taskHi: 'Ek dashboard ek server ki health status indicate karne ke liye sirf ek colored dot (red/yellow/green) use karta hai koi accompanying icon, text, ya shape difference ke bina. Is lesson ke grayscale test aur color vision differences ki documented prevalence use karke, is design ko evaluate karo aur ek fix propose karo jo test pass kare.',
        hint: "Apply the grayscale test directly: if this dot were converted to grayscale, could you still distinguish healthy from degraded from down? What second channel would fix that?",
        hintHi: 'Grayscale test directly apply karo: agar ye dot grayscale mein convert kiya jaata, kya aap abhi bhi healthy ko degraded se down se distinguish kar sakte the? Kaunsa second channel ise fix karega?',
      },
    ],

    keyTakeaways: [
      "Color vision differences affect roughly 8% of men and approximately 0.5% of women, most commonly a red-green variant — a statistical certainty for any sufficiently large user base, not a rare edge case.",
      "Using color as the sole channel distinguishing two meaningfully different states is a structural design failure for this real, predictable percentage of users — verifiable directly with the grayscale test.",
      "Contrast ratio (WCAG's 4.5:1/3:1 thresholds) is a related but mechanistically distinct concern from color-distinction, governing whether content is perceivable at all against its background regardless of color vision.",
      "This lesson closes Module 1 by showing accessibility as the direct, necessary consequence of taking the module's own perception findings seriously for the full range of human visual systems, not a separate compliance layer.",
    ],
    keyTakeawaysHi: [
      'Color vision differences roughly 8% men aur approximately 0.5% women ko affect karti hain, most commonly ek red-green variant — kisi bhi sufficiently bade user base ke liye ek statistical certainty, ek rare edge case nahi.',
      'Color ko do meaningfully different states distinguish karne wale sole channel ki tarah use karna users ke is real, predictable percentage ke liye ek structural design failure hai — grayscale test se directly verifiable.',
      'Contrast ratio (WCAG ke 4.5:1/3:1 thresholds) color-distinction se ek related par mechanistically distinct concern hai, ye govern karte hue ki kya content apne background ke against bilkul perceivable hai color vision se independently.',
      'Ye lesson Module 1 ko close karta hai accessibility ko module ki apni perception findings ko human visual systems ki poori range ke liye seriously lene ke direct, necessary consequence ki tarah dikhate hue, ek separate compliance layer nahi.',
    ],
  },
];
