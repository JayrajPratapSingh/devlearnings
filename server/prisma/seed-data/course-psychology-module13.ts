/**
 * Psychology for Developers — Module 13: Cognitive Accessibility, lessons 1-3.
 *
 * Lesson 1: Designing for ADHD and attention differences — concrete, implementable patterns.
 * Lesson 2: Designing for dyslexia and reading differences — concrete, implementable patterns.
 * Lesson 3: Designing for anxiety and situational cognitive load — concrete, implementable patterns.
 */

import type { CourseLesson } from './course-js-module1';

export const PSYCH_MODULE_13: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'psych-designing-for-adhd-attention',
    title: 'Designing for ADHD & Attention Differences',
    titleHi: 'ADHD & Attention Differences Ke Liye Design Karna',
    description:
      "Concrete, implementable interface patterns for users with ADHD and other attention differences — not awareness alone, but specific design decisions addressing working-memory limits, distraction sensitivity, and time-perception differences already established in Module 1.",
    descriptionHi:
      'Concrete, implementable interface patterns ADHD aur doosre attention differences wale users ke liye — sirf awareness nahi, balki specific design decisions jo working-memory limits, distraction sensitivity, aur time-perception differences ko address karte hain jo Module 1 mein already establish ki gayi thi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A workshop shared by two woodworkers, one of whom is genuinely more sensitive to background noise and visual clutter and works dramatically better at a bench that's kept clear, with tools returned to fixed spots and one task laid out at a time — the SAME workshop redesigned this way doesn't just help that one woodworker, it makes the whole shop safer and more efficient for everyone.** A shared woodworking shop has two craftspeople working at adjacent benches. One works comfortably regardless of surrounding clutter or noise; the other finds their attention genuinely, involuntarily pulled by every visible half-finished project, every tool left out of place, every unexpected sound, making sustained focus on a single cut or joint measurably harder — not from lack of effort or skill, but from how their attention system is genuinely wired. When the shop owner redesigns the space specifically with that second craftsperson in mind — clear benches, one project visible at a time, tools returned to fixed, predictable spots, a quieter zone away from the main saw — the change doesn't only help that person. Every other woodworker in the shop also finds their tools faster, makes fewer mistakes from misplaced clutter, and works with less unnecessary friction, even though they never struggled the way the first person did. This is exactly the well-documented \"curb-cut effect\" of accessibility design applied to cognitive attention: interfaces genuinely redesigned around ADHD and attention differences — reducing simultaneous demands, making state and next-steps unambiguous, minimizing unnecessary interruption — measurably help users who don't have ADHD too, since sustained, undistracted attention is a scarce resource for everyone, just distributed unevenly and experienced with genuinely different intensity.",
      hi: 'ek workshop jo do woodworkers share karte hain, jinme se ek genuinely background noise aur visual clutter ke liye zyada sensitive hai aur ek bench pe dramatically better kaam karta hai jo clear rakha jaata hai, tools fixed spots pe return kiye jaate hain aur ek time pe ek task layout kiya jaata hai — WAHI workshop is tarike se redesigned sirf us ek woodworker ko help nahi karta, ye poori shop ko sabke liye safer aur zyada efficient banata hai. Ek shared woodworking shop mein do craftspeople adjacent benches pe kaam karte hain. Ek surrounding clutter ya noise ke bawajood comfortably kaam karta hai; doosra paata hai ki unka attention genuinely, involuntarily har visible half-finished project, har tool jo jagah se hata hai, har unexpected sound se pulled ho jaata hai, ek single cut ya joint pe sustained focus ko measurably harder banate hue — effort ya skill ki kami se nahi, balki unka attention system genuinely kaise wired hai us se. Jab shop owner space ko specifically us doosre craftsperson ko dhyaan mein rakhte hue redesign karta hai — clear benches, ek time pe ek project visible, tools fixed, predictable spots pe return kiye jaate hain, main saw se door ek quieter zone — change sirf us insaan ko help nahi karta. Shop ka har doosra woodworker bhi apne tools faster paata hai, misplaced clutter se kam mistakes karta hai, aur kam unnecessary friction ke saath kaam karta hai, chahe woh kabhi pehle insaan ki tarah struggle nahi kiye. Ye exactly wo well-documented "curb-cut effect" hai accessibility design ka jo cognitive attention pe applied hai: interfaces genuinely ADHD aur attention differences ke around redesigned — simultaneous demands kam karte hue, state aur next-steps ko unambiguous banate hue, unnecessary interruption ko minimize karte hue — measurably un users ko bhi help karte hain jinke paas ADHD nahi hai, kyunki sustained, undistracted attention sabke liye ek scarce resource hai, sirf unevenly distributed aur genuinely different intensity ke saath experienced.',
    },

    simple: `**Why designing for ADHD specifically extends Module 1's working-memory
and attention findings, rather than introducing a separate framework:**

\`\`\`
Module 1 established that attention is a genuinely limited resource for
everyone and working memory holds roughly 4 meaningful chunks at once.
ADHD involves genuine, well-documented differences in how attention is
regulated — not a deficit of intelligence or effort, but a difference
in executive function affecting sustained focus, resistance to
distraction, and working-memory management. This means the SAME
patterns that reduce cognitive load for everyone (Module 1, Module 10)
matter more, not differently, for ADHD — the target is the same
underlying resource, just under more pressure.
\`\`\`

**A concrete, checkable pattern — reducing simultaneous demands on a
single screen, directly applying Module 10's chunking to a specific
population:**

\`\`\`tsx
// Presents every field and every decision on one screen at once
function OnboardingFormWrong() {
  return (
    <form>
      <input name="name" placeholder="Full name" />
      <input name="email" placeholder="Email" />
      <input name="company" placeholder="Company" />
      <select name="role"><option>Role</option></select>
      <input name="teamSize" placeholder="Team size" />
      <textarea name="goals" placeholder="What are your goals?" />
      {/* 6 simultaneous demands compete for limited working memory
          and attention at once */}
    </form>
  );
}

// Breaks the same total information into single-focus steps
function OnboardingFormRight({ step }) {
  const steps = ['name', 'email', 'company', 'role', 'teamSize', 'goals'];
  return <SingleFieldStep field={steps[step]} progress={\`\${step + 1}/\${steps.length}\`} />;
  // One decision at a time — reduces the number of things competing
  // for attention at any single moment, per Module 1's chunking limit
}
\`\`\`

**A concrete, checkable pattern — minimizing unnecessary, unpredictable
interruption, since involuntary attention capture is a specific,
well-documented ADHD-relevant sensitivity:**

\`\`\`ts
function shouldShowInterruption(notification, userIsMidTask) {
  // A well-documented ADHD-relevant sensitivity: unpredictable,
  // attention-grabbing interruptions (auto-playing content, popups
  // timed independently of user action) are disproportionately
  // disruptive to sustained focus
  if (userIsMidTask && notification.priority !== 'critical') {
    return { show: false, queueForLater: true };
  }
  return { show: true, queueForLater: false };
}
\`\`\`

**A concrete, checkable pattern — making current state and next steps
explicit rather than requiring the user to reconstruct context from
memory, directly extending Module 1's working-memory findings:**

\`\`\`tsx
function MultiStepWizard({ currentStep, totalSteps, completedData }) {
  return (
    <div>
      {/* Explicit state — doesn't rely on the user holding "where am I
          and what have I already entered" in working memory */}
      <ProgressIndicator current={currentStep} total={totalSteps} />
      <SavedDataSummary data={completedData} />
      <NextStepPrompt />
    </div>
  );
}
\`\`\`

**Why time-perception differences (a well-documented ADHD-relevant
finding) have a specific design implication for time-boxed interface
elements:**

\`\`\`
Research on ADHD documents genuine differences in subjective time
perception and time-estimation accuracy — meaning aggressive,
unexplained countdown timers (a session about to expire, a limited-time
offer with a ticking clock) impose disproportionate stress and
disproportionately often produce an unintended, disruptive outcome
(an abandoned or lost task) for this population, compared to their
intended effect on the general population.
\`\`\`

**A concrete, checkable pattern — replacing an unexplained countdown
with a clear, actionable warning that respects genuine time-estimation
differences:**

\`\`\`tsx
function SessionTimeoutWrong({ secondsLeft }) {
  return <div>Session expires in {secondsLeft}s</div>;
  // A bare countdown with no clear action, disproportionately
  // stressful and disruptive for users with time-perception differences
}

function SessionTimeoutRight({ minutesLeft, onExtend }) {
  return (
    <div>
      <p>Your session will expire in about {minutesLeft} minutes due to inactivity.</p>
      <button onClick={onExtend}>Stay signed in</button>
      {/* A clear, actionable, low-pressure alternative to a bare countdown */}
    </div>
  );
}
\`\`\`

**How this lesson opens Module 13:** having completed Part IV's UX
psychology in practice, this module turns to designing for genuine
cognitive differences directly. This lesson establishes concrete
patterns for ADHD and attention differences, extending rather than
replacing Module 1's and Module 10's cognitive-load findings — Lesson
2 applies the same "concrete pattern, not awareness alone" standard to
dyslexia and reading differences, and Lesson 3 to anxiety and
situational cognitive load.`,

    simpleHi: `**ADHD ke liye specifically design karna Module 1 ke working-memory
aur attention findings ko kaise extend karta hai, ek separate framework
introduce karne ke bajaye:**

\`\`\`
Module 1 ne establish kiya ki attention sabke liye ek genuinely limited
resource hai aur working memory ek time pe roughly 4 meaningful chunks
hold karti hai. ADHD attention regulate karne mein genuine, well-
documented differences involve karta hai — intelligence ya effort ki
kami nahi, balki executive function mein ek difference jo sustained
focus, distraction ka resistance, aur working-memory management ko
affect karta hai. Iska matlab hai ki WAHI patterns jo sabke liye
cognitive load kam karte hain (Module 1, Module 10) ADHD ke liye
differently nahi, zyada matter karte hain — target wahi underlying
resource hai, sirf zyada pressure ke andar.
\`\`\`

**Ek concrete, checkable pattern — ek single screen pe simultaneous
demands kam karna, directly Module 10 ke chunking ko ek specific
population pe apply karte hue:**

\`\`\`tsx
// Ek time pe ek screen pe har field aur har decision present karta hai
function OnboardingFormWrong() {
  return (
    <form>
      <input name="name" placeholder="Full name" />
      <input name="email" placeholder="Email" />
      <input name="company" placeholder="Company" />
      <select name="role"><option>Role</option></select>
      <input name="teamSize" placeholder="Team size" />
      <textarea name="goals" placeholder="What are your goals?" />
      {/* 6 simultaneous demands limited working memory aur attention
          ke liye ek saath compete karte hain */}
    </form>
  );
}

// Wahi total information ko single-focus steps mein break karta hai
function OnboardingFormRight({ step }) {
  const steps = ['name', 'email', 'company', 'role', 'teamSize', 'goals'];
  return <SingleFieldStep field={steps[step]} progress={\`\${step + 1}/\${steps.length}\`} />;
  // Ek time pe ek decision — kisi bhi single moment pe attention ke
  // liye compete karne wali cheezon ki number kam karta hai, Module
  // 1 ki chunking limit ke hisaab se
}
\`\`\`

**Ek concrete, checkable pattern — unnecessary, unpredictable
interruption ko minimize karna, kyunki involuntary attention capture
ek specific, well-documented ADHD-relevant sensitivity hai:**

\`\`\`ts
function shouldShowInterruption(notification, userIsMidTask) {
  // Ek well-documented ADHD-relevant sensitivity: unpredictable,
  // attention-grabbing interruptions (auto-playing content, popups
  // jo user action se independently timed hain) disproportionately
  // sustained focus ke liye disruptive hain
  if (userIsMidTask && notification.priority !== 'critical') {
    return { show: false, queueForLater: true };
  }
  return { show: true, queueForLater: false };
}
\`\`\`

**Ek concrete, checkable pattern — current state aur next steps ko
explicit banana user ko context ko memory se reconstruct karne ki
zaroorat dene ke bajaye, directly Module 1 ke working-memory findings
ko extend karte hue:**

\`\`\`tsx
function MultiStepWizard({ currentStep, totalSteps, completedData }) {
  return (
    <div>
      {/* Explicit state — user ko "main kahan hoon aur maine kya
          already enter kiya" working memory mein hold karne pe rely
          nahi karta */}
      <ProgressIndicator current={currentStep} total={totalSteps} />
      <SavedDataSummary data={completedData} />
      <NextStepPrompt />
    </div>
  );
}
\`\`\`

**Time-perception differences (ek well-documented ADHD-relevant
finding) ka time-boxed interface elements ke liye ek specific design
implication kyun hai:**

\`\`\`
ADHD pe research subjective time perception aur time-estimation
accuracy mein genuine differences document karti hai — matlab
aggressive, unexplained countdown timers (ek session expire hone wala
hai, ek limited-time offer ek ticking clock ke saath) is population ke
liye disproportionate stress aur disproportionately aksar ek unintended,
disruptive outcome (ek abandoned ya lost task) produce karte hain,
general population pe unke intended effect ke compare mein.
\`\`\`

**Ek concrete, checkable pattern — ek unexplained countdown ko ek
clear, actionable warning se replace karna jo genuine time-estimation
differences ko respect karti hai:**

\`\`\`tsx
function SessionTimeoutWrong({ secondsLeft }) {
  return <div>Session expires in {secondsLeft}s</div>;
  // Ek bare countdown koi clear action ke bina, disproportionately
  // stressful aur disruptive time-perception differences wale users
  // ke liye
}

function SessionTimeoutRight({ minutesLeft, onExtend }) {
  return (
    <div>
      <p>Your session will expire in about {minutesLeft} minutes due to inactivity.</p>
      <button onClick={onExtend}>Stay signed in</button>
      {/* Ek clear, actionable, low-pressure alternative ek bare
          countdown ka */}
    </div>
  );
}
\`\`\`

**Ye lesson Module 13 ko kaise open karta hai:** Part IV ke UX
psychology in practice complete karne ke baad, ye module genuine
cognitive differences ke liye directly design karne ki taraf move karta
hai. Ye lesson ADHD aur attention differences ke liye concrete patterns
establish karta hai, Module 1 aur Module 10 ke cognitive-load findings
ko replace karne ke bajaye extend karte hue — Lesson 2 wahi "concrete
pattern, sirf awareness nahi" standard dyslexia aur reading differences
pe apply karta hai, aur Lesson 3 anxiety aur situational cognitive load
pe.`,

    content: `## Why designing for ADHD extends Module 1's cognitive-load findings
rather than requiring a separate framework

ADHD involves genuine, well-documented differences in executive
function affecting sustained attention, distraction resistance, and
working-memory management — not a deficit of intelligence or effort.
Because Module 1 already established that attention and working
memory are genuinely limited resources for everyone, designing for
ADHD is best understood as designing for the same underlying resource
under measurably more pressure, rather than as an entirely separate
design problem requiring its own framework. This framing matters
because it means the patterns this lesson introduces are extensions
and reinforcements of Module 1's and Module 10's existing findings, not
contradictions of them.

## Why reducing simultaneous demands on a single screen has specific,
outsized value for attention differences

Since working memory holds a limited number of meaningful chunks at
once (Module 1), presenting many simultaneous fields, decisions, or
demands on a single screen competes directly for a resource that is
under additional pressure for users with attention differences.
Breaking the same total information into single-focus, sequential
steps — directly applying Module 10's chunking pattern — reduces the
number of things competing for attention at any given moment, a
pattern that helps all users to some degree but has outsized,
measurable value specifically for this population.

## Why minimizing unpredictable interruption addresses a specific,
well-documented ADHD-relevant sensitivity

Involuntary attention capture — the tendency for salient, unexpected
stimuli to pull focus away from a sustained task — is a well-documented
sensitivity relevant to ADHD specifically. This gives a concrete design
implication: notifications, auto-playing content, and popups that
interrupt independent of user action or task state are disproportionately
disruptive to sustained focus for this population. Queuing non-critical
interruptions until a natural break point, rather than firing them
immediately and unpredictably, directly addresses this sensitivity
without meaningfully degrading the experience for users without it.

## Why making state and next steps explicit directly extends Module
1's working-memory findings to a specific, higher-stakes case

Requiring a user to reconstruct "where am I in this process, and what
have I already entered" from memory places a specific demand on
working memory that Module 1 established is a genuinely limited
resource. Making this state explicit — visible progress indicators,
a visible summary of already-entered data, an explicit statement of
the next required action — removes this reconstruction burden entirely,
which matters more, not differently, when working-memory management is
under additional pressure.

## Why time-perception differences require a specific, concrete
alternative to unexplained countdown timers

Research on ADHD documents genuine differences in subjective time
perception and time-estimation accuracy. This gives a specific,
practical implication: an aggressive, context-free countdown (a
session about to expire, a ticking-clock limited-time offer) imposes
disproportionate stress and disproportionately often produces an
unintended, disruptive outcome — an abandoned task, a lost session —
for users with these differences, compared to its intended effect on
users without them. A clear, actionable, low-pressure alternative
(stating the approximate time remaining and providing a straightforward
way to extend it) accomplishes the same underlying goal — informing
the user and prompting timely action — without this disproportionate
cost.

## How this lesson opens Module 13, connecting to the "curb-cut
effect" this module's analogy establishes

Concrete accessibility patterns designed specifically for one
population's genuine, well-documented needs frequently measurably
benefit the broader user base as well, since the underlying resource
being protected (sustained, undistracted attention; accurate time
estimation) is scarce for everyone, just distributed unevenly. This
lesson opens Module 13 by establishing this principle concretely for
ADHD and attention differences; Lesson 2 applies the identical
standard — concrete, implementable patterns rather than awareness
alone — to dyslexia and reading differences, and Lesson 3 to anxiety
and situational cognitive load.`,

    contentHi: `## ADHD ke liye design karna Module 1 ke cognitive-load findings ko kaise extend karta hai ek separate framework ki zaroorat ke bajaye

ADHD executive function mein genuine, well-documented differences
involve karta hai jo sustained attention, distraction resistance, aur
working-memory management ko affect karte hain — intelligence ya
effort ki kami nahi. Kyunki Module 1 ne already establish kiya ki
attention aur working memory sabke liye genuinely limited resources
hain, ADHD ke liye design karna best understand kiya jaata hai us wahi
underlying resource ke liye design karne ki tarah jo measurably zyada
pressure ke andar hai, ek entirely separate design problem ke bajaye
jise apna khud ka framework chahiye. Ye framing matter karta hai
kyunki iska matlab hai ye lesson jo patterns introduce karta hai
Module 1 aur Module 10 ke existing findings ki extensions aur
reinforcements hain, unki contradictions nahi.

## Ek single screen pe simultaneous demands kam karna attention differences ke liye specific, outsized value kyun rakhta hai

Kyunki working memory ek time pe meaningful chunks ki ek limited
number hold karti hai (Module 1), ek single screen pe kai simultaneous
fields, decisions, ya demands present karna directly us resource ke
liye compete karta hai jo attention differences wale users ke liye
additional pressure ke andar hai. Wahi total information ko single-
focus, sequential steps mein break karna — directly Module 10 ke
chunking pattern ko apply karte hue — kisi bhi given moment pe
attention ke liye compete karne wali cheezon ki number kam karta hai,
ek pattern jo kisi had tak sab users ko help karta hai par specifically
is population ke liye outsized, measurable value rakhta hai.

## Unpredictable interruption ko minimize karna ek specific, well-documented ADHD-relevant sensitivity ko kyun address karta hai

Involuntary attention capture — salient, unexpected stimuli ki
tendency ek sustained task se focus khinchne ki — ek well-documented
sensitivity hai jo specifically ADHD se relevant hai. Ye ek concrete
design implication deti hai: notifications, auto-playing content, aur
popups jo user action ya task state se independently interrupt karte
hain is population ke liye sustained focus ke liye disproportionately
disruptive hain. Non-critical interruptions ko ek natural break point
tak queue karna, unhe immediately aur unpredictably fire karne ke
bajaye, directly is sensitivity ko address karta hai bina us population
ke liye experience ko meaningfully degrade kiye jinke paas ye nahi hai.

## State aur next steps ko explicit banana directly Module 1 ke working-memory findings ko ek specific, higher-stakes case pe kyun extend karta hai

Ek user ko "main is process mein kahan hoon, aur maine kya already
enter kiya" ko memory se reconstruct karne ki zaroorat dena working
memory pe ek specific demand rakhta hai jise Module 1 ne ek genuinely
limited resource establish kiya. Is state ko explicit banana — visible
progress indicators, already-entered data ka ek visible summary, next
required action ka ek explicit statement — is reconstruction burden ko
entirely remove karta hai, jo differently nahi, zyada matter karta hai
jab working-memory management additional pressure ke andar ho.

## Time-perception differences ko unexplained countdown timers ke ek specific, concrete alternative ki zaroorat kyun hai

ADHD pe research subjective time perception aur time-estimation
accuracy mein genuine differences document karti hai. Ye ek specific,
practical implication deti hai: ek aggressive, context-free countdown
(ek session expire hone wala hai, ek ticking-clock limited-time offer)
in differences wale users ke liye disproportionate stress aur
disproportionately aksar ek unintended, disruptive outcome — ek
abandoned task, ek lost session — produce karta hai, un users pe unke
intended effect ke compare mein jinke paas ye nahi hain. Ek clear,
actionable, low-pressure alternative (approximate time remaining state
karna aur ise extend karne ka ek straightforward tareeka provide
karna) wahi underlying goal accomplish karta hai — user ko inform karna
aur timely action prompt karna — is disproportionate cost ke bina.

## Ye lesson Module 13 ko kaise open karta hai, is module ke analogy ke "curb-cut effect" se connect karte hue

Concrete accessibility patterns jo specifically ek population ki
genuine, well-documented needs ke liye design kiye gaye hain aksar
broader user base ko bhi measurably benefit karte hain, kyunki jis
underlying resource ko protect kiya ja raha hai (sustained, undistracted
attention; accurate time estimation) sabke liye scarce hai, sirf
unevenly distributed. Ye lesson Module 13 ko open karta hai ye
principle concretely ADHD aur attention differences ke liye establish
karke; Lesson 2 identical standard apply karta hai — concrete,
implementable patterns, sirf awareness nahi — dyslexia aur reading
differences pe, aur Lesson 3 anxiety aur situational cognitive load pe.`,

    examples: [
      {
        title: 'An interruption-queuing function and a multi-step wizard implementing this lesson\'s attention-difference patterns',
        titleHi: "Ek interruption-queuing function aur ek multi-step wizard jo is lesson ke attention-difference patterns implement karte hain",
        codeJs: `function shouldShowInterruption(notification, userIsMidTask) {
  if (userIsMidTask && notification.priority !== 'critical') {
    return { show: false, queueForLater: true };
  }
  return { show: true, queueForLater: false };
}

function SessionTimeoutRight({ minutesLeft, onExtend }) {
  return (
    <div role="alert">
      <p>Your session will expire in about {minutesLeft} minutes due to inactivity.</p>
      <button onClick={onExtend}>Stay signed in</button>
    </div>
  );
}

// Applied: a non-critical "check out this new feature" tooltip fires
// while the user is mid-checkout
console.log(shouldShowInterruption({ priority: 'low' }, true));
// { show: false, queueForLater: true }

// A critical, task-blocking error fires at the same moment
console.log(shouldShowInterruption({ priority: 'critical' }, true));
// { show: true, queueForLater: false }`,
        codeTs: `interface Notification {
  priority: 'low' | 'medium' | 'critical';
}

function shouldShowInterruption(notification: Notification, userIsMidTask: boolean) {
  if (userIsMidTask && notification.priority !== 'critical') {
    return { show: false, queueForLater: true };
  }
  return { show: true, queueForLater: false };
}

function SessionTimeoutRight({ minutesLeft, onExtend }: { minutesLeft: number; onExtend: () => void }) {
  return (
    <div role="alert">
      <p>Your session will expire in about {minutesLeft} minutes due to inactivity.</p>
      <button onClick={onExtend}>Stay signed in</button>
    </div>
  );
}

// Applied: a non-critical "check out this new feature" tooltip fires
// while the user is mid-checkout
console.log(shouldShowInterruption({ priority: 'low' }, true));
// { show: false, queueForLater: true }

// A critical, task-blocking error fires at the same moment
console.log(shouldShowInterruption({ priority: 'critical' }, true));
// { show: true, queueForLater: false }`,
        code: `if (userIsMidTask && notification.priority !== 'critical') {
  return { show: false, queueForLater: true };
}
// non-critical interruptions wait for a natural break point instead of firing immediately`,
        output:
          "The low-priority notification is correctly queued rather than shown immediately, avoiding an unnecessary interruption to sustained focus mid-task, while the critical error is shown immediately since it's task-relevant and can't safely wait — the function distinguishes disruptive interruption from necessary information rather than treating all notifications identically.",
        explain:
          "This example operationalizes the lesson's interruption-minimization pattern directly: rather than firing every notification the instant it's generated, the system defers non-critical ones to a natural break point, addressing the specific, well-documented ADHD-relevant sensitivity to involuntary attention capture without withholding genuinely necessary information.",
        explainHi:
          "Ye example lesson ke interruption-minimization pattern ko directly operationalize karta hai: har notification ko generate hote hi fire karne ke bajaye, system non-critical wale ko ek natural break point tak defer karta hai, involuntary attention capture ki specific, well-documented ADHD-relevant sensitivity ko address karte hue genuinely necessary information ko withhold kiye bina.",
      },
    ],

    mistakes: [
      {
        wrong: `// A "helpful" feature-announcement modal that interrupts
// unconditionally, regardless of what the user is doing
function FeatureAnnouncementWrong({ show }) {
  return show ? (
    <Modal>
      <h2>Check out our new feature!</h2>
      {/* Fires the instant it's triggered, mid-checkout, mid-form,
          mid-anything — an unpredictable, attention-capturing
          interruption regardless of task state */}
    </Modal>
  ) : null;
}`,
        right: `// The same announcement, queued until the user reaches a natural
// break point in their current task
function FeatureAnnouncementRight({ shouldQueue, userAtBreakPoint }) {
  const shouldShow = shouldQueue && userAtBreakPoint;
  return shouldShow ? (
    <Modal>
      <h2>Check out our new feature!</h2>
    </Modal>
  ) : null;
}`,
        why: "An unconditional interruption timed independently of the user's task state is disproportionately disruptive for users with attention differences, per this lesson's finding about involuntary attention capture — deferring non-critical interruptions to a natural break point preserves the same communication goal without this disproportionate cost.",
        whyHi:
          "Ek unconditional interruption jo user ki task state se independently timed hai attention differences wale users ke liye disproportionately disruptive hai, is lesson ki finding ke hisaab se involuntary attention capture ke baare mein — non-critical interruptions ko ek natural break point tak defer karna wahi communication goal preserve karta hai is disproportionate cost ke bina.",
      },
    ],

    realWorld: [
      {
        en: "A production SaaS product's support team found that a significant share of complaints about a multi-field signup form ('I lost my progress,' 'I got confused halfway through') came from users who self-identified as having attention-related difficulties; converting the form to a single-field-per-step wizard with explicit progress tracking measurably reduced abandonment for the ENTIRE user base, not just the group that originally complained — a direct, real-world confirmation of this module's curb-cut-effect analogy.",
        hi: 'Ek production SaaS product ki support team ne paaya ki ek multi-field signup form ke baare mein complaints ka ek significant share (\'maine apni progress kho di,\' \'main halfway mein confused ho gaya\') un users se aaya jinhone attention-related difficulties hone ka self-identify kiya; form ko ek single-field-per-step wizard mein explicit progress tracking ke saath convert karne se ENTIRE user base ke liye abandonment measurably kam hua, sirf wo group nahi jisne originally complain kiya — is module ke curb-cut-effect analogy ka ek direct, real-world confirmation.',
      },
    ],

    interviewQA: [
      {
        q: "Why is designing for ADHD best understood as an extension of Module 1's general cognitive-load findings rather than a separate design problem?",
        qHi: 'ADHD ke liye design karna Module 1 ke general cognitive-load findings ka ek extension kyun samjha jaata hai, ek separate design problem nahi?',
        a: "ADHD involves genuine differences in executive function affecting sustained attention and working-memory management — the same underlying resources Module 1 established are genuinely limited for everyone. Designing for ADHD means protecting that same resource under measurably more pressure, so the same patterns (chunking, explicit state, minimizing distraction) apply with greater, not different, importance.",
        aHi: 'ADHD executive function mein genuine differences involve karta hai jo sustained attention aur working-memory management ko affect karte hain — wahi underlying resources jo Module 1 ne establish kiye sabke liye genuinely limited hain. ADHD ke liye design karna matlab wahi resource ko measurably zyada pressure ke andar protect karna, isliye wahi patterns (chunking, explicit state, distraction minimize karna) greater, differently nahi, importance ke saath apply hote hain.',
      },
      {
        q: 'Why does this lesson recommend replacing an unexplained countdown timer with a clear, actionable warning for session timeouts?',
        qHi: 'Ye lesson session timeouts ke liye ek unexplained countdown timer ko ek clear, actionable warning se replace karne ki recommend kyun karta hai?',
        a: "Research on ADHD documents genuine differences in subjective time perception and time-estimation accuracy. An aggressive, context-free countdown imposes disproportionate stress and disproportionately produces unintended disruptive outcomes (an abandoned task) for this population. A clear statement of approximate time remaining plus a straightforward extend action achieves the same communication goal without this cost.",
        aHi: 'ADHD pe research subjective time perception aur time-estimation accuracy mein genuine differences document karti hai. Ek aggressive, context-free countdown is population ke liye disproportionate stress aur disproportionately unintended disruptive outcomes (ek abandoned task) produce karta hai. Approximate time remaining ka ek clear statement plus ek straightforward extend action wahi communication goal achieve karta hai is cost ke bina.',
      },
    ],

    exercises: [
      {
        task: "A checkout flow shows a bare countdown timer ('Complete checkout in 04:59 or your cart will be cleared') with no other information or action available besides waiting. Using this lesson's framework, redesign this specific element to respect time-perception differences while still communicating genuine urgency.",
        taskHi: "Ek checkout flow ek bare countdown timer dikhata hai ('Complete checkout in 04:59 or your cart will be cleared') koi doosri information ya action available ke bina wait karne ke alawa. Is lesson ke framework use karke, is specific element ko redesign karo time-perception differences ko respect karte hue jabki abhi bhi genuine urgency communicate karte hue.",
        hint: "Think about what specific problem the bare countdown creates (disproportionate stress, inaccurate time estimation) and what concrete alternative (clear approximate time plus a low-pressure action, like 'save my cart') addresses that problem without losing the legitimate underlying goal.",
        hintHi: 'Socho ki bare countdown kaunsa specific problem create karta hai (disproportionate stress, inaccurate time estimation) aur kaunsa concrete alternative (clear approximate time plus ek low-pressure action, jaise \'save my cart\') us problem ko address karta hai legitimate underlying goal khoye bina.',
      },
    ],

    keyTakeaways: [
      "Designing for ADHD extends, rather than replaces, Module 1's finding that attention and working memory are genuinely limited resources — ADHD involves genuine executive-function differences putting the same resources under more pressure.",
      "Concrete patterns include: reducing simultaneous demands via chunking (Module 10), minimizing unpredictable interruption by queuing non-critical notifications, and making state/next-steps explicit rather than requiring memory reconstruction.",
      "Time-perception differences documented in ADHD research mean aggressive, unexplained countdown timers impose disproportionate stress — a clear, actionable, low-pressure alternative achieves the same communication goal without this cost.",
      "This module's curb-cut-effect analogy holds concretely here: patterns designed for ADHD and attention differences measurably benefit the broader user base too, since sustained attention is a scarce resource for everyone.",
    ],
    keyTakeawaysHi: [
      'ADHD ke liye design karna Module 1 ki finding ko replace nahi, extend karta hai ki attention aur working memory genuinely limited resources hain — ADHD genuine executive-function differences involve karta hai jo wahi resources ko zyada pressure ke andar daalte hain.',
      'Concrete patterns mein shamil hai: chunking ke through simultaneous demands kam karna (Module 10), non-critical notifications ko queue karke unpredictable interruption minimize karna, aur memory reconstruction ki zaroorat dene ke bajaye state/next-steps ko explicit banana.',
      'ADHD research mein documented time-perception differences ka matlab hai ki aggressive, unexplained countdown timers disproportionate stress impose karte hain — ek clear, actionable, low-pressure alternative wahi communication goal achieve karta hai is cost ke bina.',
      'Is module ka curb-cut-effect analogy yahan concretely hold karta hai: ADHD aur attention differences ke liye design kiye gaye patterns broader user base ko bhi measurably benefit karte hain, kyunki sustained attention sabke liye ek scarce resource hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'psych-designing-for-dyslexia-reading',
    title: 'Designing for Dyslexia & Reading Differences',
    titleHi: 'Dyslexia & Reading Differences Ke Liye Design Karna',
    description:
      "Concrete, implementable patterns for users with dyslexia and other reading differences — typography, layout, and content-structure decisions grounded in Module 2's perception findings, applying the same 'concrete pattern over awareness' standard Lesson 1 established.",
    descriptionHi:
      'Dyslexia aur doosre reading differences wale users ke liye concrete, implementable patterns — typography, layout, aur content-structure decisions Module 2 ke perception findings mein grounded, wahi "concrete pattern over awareness" standard apply karte hue jise Lesson 1 ne establish kiya.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A road sign designer who learns that a specific font, letter-spacing, and sign layout measurably reduces misreadings for drivers with certain vision differences — and then discovers the same redesigned sign is read correctly, faster, by every driver, in fog, at night, and at highway speed, not just by the group the redesign originally targeted.** Highway sign design has a well-documented history of exactly this pattern: research identifying which letterforms, spacing, and layouts are most reliably legible for drivers with specific vision differences led to redesigned signage (wider letter-spacing, higher-contrast layouts, sans-serif forms chosen for their distinguishability) that then measurably improved legibility for ALL drivers, especially under difficult conditions like fog, rain, or highway speed where everyone's reading is degraded, not just the group with a specific difference. This is exactly the relationship between dyslexia-specific typography research and general readability: research on dyslexia has identified specific factors — certain letterform confusions, dense unbroken text blocks, low contrast, justified text with uneven word-spacing — that create disproportionate reading difficulty for people with dyslexia specifically, and addressing these factors concretely (rather than through vague 'accessibility awareness') produces a text presentation that is measurably easier to read for everyone, especially under the 'difficult conditions' of digital reading: a small mobile screen, a tired reader late at night, a distracted reader skimming quickly — conditions where everyone's reading, like every driver's sign-reading in fog, is already under more strain.",
      hi: 'ek road sign designer jo seekhta hai ki ek specific font, letter-spacing, aur sign layout certain vision differences wale drivers ke liye misreadings ko measurably kam karta hai — aur phir discover karta hai ki wahi redesigned sign har driver dwara correctly, faster padha jaata hai, fog mein, raat mein, aur highway speed pe, sirf us group se nahi jise redesign originally target kar raha tha. Highway sign design ka exactly is pattern ka ek well-documented history hai: research jo identify karti hai ki kaunse letterforms, spacing, aur layouts specific vision differences wale drivers ke liye sabse reliably legible hain redesigned signage ki taraf le gayi (wider letter-spacing, higher-contrast layouts, sans-serif forms unki distinguishability ke liye chuni gayi) jo phir measurably SAB drivers ke liye legibility improve karti hai, especially difficult conditions jaise fog, rain, ya highway speed ke andar jahan sabka reading degraded hai, sirf us group ka nahi jinke paas ek specific difference hai. Ye exactly dyslexia-specific typography research aur general readability ke beech relationship hai: dyslexia pe research ne specific factors identify kiye hain — certain letterform confusions, dense unbroken text blocks, low contrast, justified text uneven word-spacing ke saath — jo specifically dyslexia wale logon ke liye disproportionate reading difficulty create karte hain, aur in factors ko concretely address karna (vague "accessibility awareness" ke through nahi) ek text presentation produce karta hai jo sabke liye measurably padhna aasan hai, especially digital reading ki "difficult conditions" ke andar: ek chhota mobile screen, raat der se ek tired reader, ek distracted reader jo quickly skim kar raha hai — conditions jahan sabki reading, har driver ki fog mein sign-reading ki tarah, already zyada strain ke andar hai.',
    },

    simple: `**Why designing for dyslexia extends Module 2's perception findings,
applying the same concrete-pattern-over-awareness standard Lesson 1
established:**

\`\`\`
Module 2 established Gestalt principles and how eyes scan a screen.
Dyslexia involves well-documented differences in how the visual system
processes written letterforms and text, distinct from general vision
or intelligence. This means specific, identifiable design factors —
not vague "make it more accessible" gestures — reliably reduce reading
difficulty for this population, extending Module 2's perception
findings to the specific case of reading text itself.
\`\`\`

**A concrete, checkable pattern — avoiding justified text, since
uneven word-spacing from justification creates specific, documented
reading difficulty:**

\`\`\`css
/* Creates uneven, unpredictable word-spacing to force each line to
   the same width — documented as a specific dyslexia-relevant reading
   obstacle */
.body-text-wrong {
  text-align: justify;
}

/* Left-aligned with a ragged right edge — consistent, predictable
   word-spacing throughout */
.body-text-right {
  text-align: left;
}
\`\`\`

**A concrete, checkable pattern — sufficient line height and paragraph
spacing, since dense, unbroken text blocks create specific, documented
tracking difficulty:**

\`\`\`css
.body-text-wrong {
  line-height: 1.1;
  /* Tightly packed lines make it easy to lose one's place when
     tracking from the end of one line to the start of the next */
}

.body-text-right {
  line-height: 1.5;
  margin-bottom: 1.2em;
  max-width: 65ch;
  /* Sufficient line height and a bounded line length reduce the
     specific difficulty of tracking across a line of text */
}
\`\`\`

**A concrete, checkable pattern — providing a genuine, functional
text-to-speech alternative, not merely a visual-styling change:**

\`\`\`tsx
function LessonContent({ text, audioUrl }) {
  return (
    <article>
      <p>{text}</p>
      {audioUrl && (
        <audio controls src={audioUrl}>
          {/* A genuine alternative modality — reading isn't the only
              path to the same content, directly addressing dyslexia's
              specific processing difference rather than only adjusting
              visual presentation */}
        </audio>
      )}
    </article>
  );
}
\`\`\`

**A concrete, checkable pattern — avoiding relying on letterform
similarity for meaning, since certain letter confusions (b/d, p/q) are
a specific, well-documented dyslexia-relevant difficulty:**

\`\`\`ts
function auditIconLabelPair(icon, label) {
  // A pattern relying purely on visual similarity between easily
  // confused elements, without a redundant text label, creates a
  // specific and avoidable difficulty
  return {
    hasRedundantTextLabel: Boolean(label),
    recommendation: label
      ? 'passes — icon is reinforced by unambiguous text'
      : 'fails — provide a text label alongside any icon carrying meaning',
  };
}
\`\`\`

**Why this lesson's patterns connect directly to Module 2's scan-
pattern and Gestalt findings — this isn't a separate visual-design
framework, it's the same one under a specific, well-documented
constraint:**

\`\`\`
Module 2 established that legibility, contrast, and layout organization
matter for how effectively anyone scans and processes a screen. This
lesson's patterns (ragged-right text, generous line height, bounded
line length, redundant text-plus-icon labeling) are the SAME
underlying principles, made more strict and more carefully applied
specifically because dyslexia narrows the margin for error in text
processing that exists for the general population.
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established concrete
patterns for attention differences, extending Module 1's cognitive-load
findings. This lesson applies the identical standard to dyslexia and
reading differences, extending Module 2's perception findings — Lesson
3 completes the module by applying the same standard to anxiety and
situational cognitive load.`,

    simpleHi: `**Dyslexia ke liye design karna Module 2 ke perception findings ko
kaise extend karta hai, wahi concrete-pattern-over-awareness standard
apply karte hue jise Lesson 1 ne establish kiya:**

\`\`\`
Module 2 ne Gestalt principles aur eyes screen ko kaise scan karti
hain establish kiya. Dyslexia visual system written letterforms aur
text ko kaise process karta hai usmein well-documented differences
involve karta hai, general vision ya intelligence se distinct. Iska
matlab hai specific, identifiable design factors — vague "ise zyada
accessible banao" gestures nahi — reliably is population ke liye
reading difficulty kam karte hain, Module 2 ke perception findings ko
text padhne ke specific case tak extend karte hue.
\`\`\`

**Ek concrete, checkable pattern — justified text avoid karna, kyunki
justification se uneven word-spacing ek specific, documented reading
difficulty create karti hai:**

\`\`\`css
/* Uneven, unpredictable word-spacing create karta hai har line ko
   same width tak force karne ke liye — ek specific dyslexia-relevant
   reading obstacle ki tarah documented */
.body-text-wrong {
  text-align: justify;
}

/* Left-aligned ek ragged right edge ke saath — consistent, predictable
   word-spacing throughout */
.body-text-right {
  text-align: left;
}
\`\`\`

**Ek concrete, checkable pattern — sufficient line height aur
paragraph spacing, kyunki dense, unbroken text blocks ek specific,
documented tracking difficulty create karte hain:**

\`\`\`css
.body-text-wrong {
  line-height: 1.1;
  /* Tightly packed lines apni jagah kho dena easy banate hain jab
     ek line ke end se agli line ke start tak track karte hain */
}

.body-text-right {
  line-height: 1.5;
  margin-bottom: 1.2em;
  max-width: 65ch;
  /* Sufficient line height aur ek bounded line length text ki ek
     line ke across track karne ki specific difficulty kam karti hain */
}
\`\`\`

**Ek concrete, checkable pattern — ek genuine, functional text-to-
speech alternative provide karna, sirf ek visual-styling change nahi:**

\`\`\`tsx
function LessonContent({ text, audioUrl }) {
  return (
    <article>
      <p>{text}</p>
      {audioUrl && (
        <audio controls src={audioUrl}>
          {/* Ek genuine alternative modality — padhna wahi content
              tak akela path nahi hai, directly dyslexia ke specific
              processing difference ko address karte hue, sirf visual
              presentation adjust karne ke bajaye */}
        </audio>
      )}
    </article>
  );
}
\`\`\`

**Ek concrete, checkable pattern — meaning ke liye letterform
similarity pe rely karne se bachna, kyunki certain letter confusions
(b/d, p/q) ek specific, well-documented dyslexia-relevant difficulty
hain:**

\`\`\`ts
function auditIconLabelPair(icon, label) {
  // Ek pattern jo purely easily confused elements ke beech visual
  // similarity pe rely karta hai, ek redundant text label ke bina,
  // ek specific aur avoidable difficulty create karta hai
  return {
    hasRedundantTextLabel: Boolean(label),
    recommendation: label
      ? 'passes — icon is reinforced by unambiguous text'
      : 'fails — provide a text label alongside any icon carrying meaning',
  };
}
\`\`\`

**Is lesson ke patterns directly Module 2 ke scan-pattern aur Gestalt
findings se kaise connect karte hain — ye ek separate visual-design
framework nahi hai, ye wahi hai ek specific, well-documented constraint
ke andar:**

\`\`\`
Module 2 ne establish kiya ki legibility, contrast, aur layout
organization matter karte hain is baat ke liye ki koi bhi ek screen
ko kitni effectively scan aur process karta hai. Is lesson ke patterns
(ragged-right text, generous line height, bounded line length,
redundant text-plus-icon labeling) WAHI underlying principles hain,
zyada strict aur zyada carefully applied specifically kyunki dyslexia
text processing mein error ka margin narrow karta hai jo general
population ke liye exist karta hai.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne attention
differences ke liye concrete patterns establish kiye, Module 1 ke
cognitive-load findings ko extend karte hue. Ye lesson identical
standard dyslexia aur reading differences pe apply karta hai, Module 2
ke perception findings ko extend karte hue — Lesson 3 module ko
complete karta hai wahi standard anxiety aur situational cognitive
load pe apply karke.`,

    content: `## Why designing for dyslexia extends Module 2's perception findings
to the specific case of reading text

Dyslexia involves well-documented differences in how the visual system
processes written letterforms and text — a specific, identifiable
processing difference, distinct from general vision or intelligence.
Because Module 2 already established how Gestalt principles and
scanning patterns shape screen legibility generally, this lesson
extends that same foundation to the specific mechanics of reading
running text, identifying concrete factors research has linked to
disproportionate reading difficulty for this population.

## Why avoiding justified text addresses a specific, documented
reading obstacle rather than a stylistic preference

Justified text forces every line to the same width by inserting
uneven, unpredictable spacing between words. This uneven spacing is
documented as a specific obstacle for dyslexic readers, who often rely
on consistent visual rhythm to track through text. Left-aligned text
with a ragged right edge preserves consistent, predictable
word-spacing throughout a paragraph, removing this specific obstacle
without any loss of information — this is a concrete, checkable
choice, not a vague aesthetic preference.

## Why sufficient line height and bounded line length address a
specific, documented tracking difficulty

Dense, tightly packed text with long line lengths creates a specific
difficulty: losing one's place when the eye must track from the end of
one line back to the start of the next. Sufficient line height (giving
each line visual separation from its neighbors) and a bounded line
length (keeping each line short enough that the return-sweep is a
short, easy eye movement) directly address this documented mechanism,
extending Module 2's general legibility principles to this specific,
higher-stakes case.

## Why a genuine text-to-speech alternative addresses the underlying
processing difference rather than only its visual symptoms

Since dyslexia involves a difference in processing written text
specifically, purely visual adjustments (font, spacing, contrast) help
but don't eliminate the underlying difficulty for every reader.
Providing a genuine, functional alternative modality — real audio
narration of the same content, not merely a visual styling toggle —
offers a path to the same information that doesn't depend on visual
text processing at all, directly addressing the difference at its
source rather than only mitigating its visual symptoms.

## Why avoiding reliance on easily-confused letterforms for meaning is
a specific, checkable design requirement

Certain letterform confusions (b/d, p/q, and similar visually similar
pairs) are a specific, well-documented dyslexia-relevant difficulty.
A design that relies purely on an icon's visual form to carry meaning,
without a redundant, unambiguous text label, risks this specific
confusion. Pairing icons with clear text labels is a concrete,
checkable requirement that removes this specific risk without
requiring any visual redesign of the icon itself.

## Why this lesson's patterns are the same principles as Module 2's,
made stricter under a specific constraint

Every pattern in this lesson — ragged-right alignment, generous line
height, bounded line length, redundant labeling — is a direct
application of the same legibility and scanning principles Module 2
established for the general population, applied more strictly because
dyslexia narrows the margin for error that exists more broadly. This
lesson doesn't introduce a separate visual-design framework; it applies
this course's existing perception findings under a specific,
well-documented constraint.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established concrete patterns for attention differences,
extending Module 1's cognitive-load findings. This lesson applies the
identical standard — concrete, implementable patterns rather than
awareness alone — to dyslexia and reading differences, extending
Module 2's perception findings. Lesson 3 completes the module by
applying this same standard to anxiety and situational cognitive load,
closing Module 13's three-part treatment of concrete cognitive
accessibility.`,

    contentHi: `## Dyslexia ke liye design karna Module 2 ke perception findings ko text padhne ke specific case tak kaise extend karta hai

Dyslexia visual system written letterforms aur text ko kaise process
karta hai usmein well-documented differences involve karta hai — ek
specific, identifiable processing difference, general vision ya
intelligence se distinct. Kyunki Module 2 ne already establish kiya ki
Gestalt principles aur scanning patterns screen legibility ko generally
kaise shape karte hain, ye lesson wahi foundation ko running text
padhne ke specific mechanics tak extend karta hai, concrete factors
identify karte hue jinhe research ne is population ke liye
disproportionate reading difficulty se link kiya hai.

## Justified text avoid karna ek specific, documented reading obstacle ko kyun address karta hai ek stylistic preference nahi

Justified text har line ko same width tak force karta hai words ke
beech uneven, unpredictable spacing insert karke. Ye uneven spacing
dyslexic readers ke liye ek specific obstacle ki tarah documented hai,
jo aksar text ke through track karne ke liye consistent visual rhythm
pe rely karte hain. Left-aligned text ek ragged right edge ke saath
poore paragraph mein consistent, predictable word-spacing preserve
karta hai, koi information kho diye bina is specific obstacle ko
remove karte hue — ye ek concrete, checkable choice hai, ek vague
aesthetic preference nahi.

## Sufficient line height aur bounded line length ek specific, documented tracking difficulty ko kyun address karte hain

Dense, tightly packed text long line lengths ke saath ek specific
difficulty create karta hai: apni jagah kho dena jab eye ko ek line ke
end se wapas agli line ke start tak track karna padta hai. Sufficient
line height (har line ko apne neighbors se visual separation dete hue)
aur ek bounded line length (har line ko itna short rakhte hue ki
return-sweep ek short, easy eye movement ho) directly is documented
mechanism ko address karte hain, Module 2 ke general legibility
principles ko is specific, higher-stakes case tak extend karte hue.

## Ek genuine text-to-speech alternative underlying processing difference ko kyun address karta hai sirf uske visual symptoms nahi

Kyunki dyslexia specifically written text process karne mein ek
difference involve karta hai, purely visual adjustments (font, spacing,
contrast) help karte hain par har reader ke liye underlying difficulty
ko eliminate nahi karte. Ek genuine, functional alternative modality
provide karna — wahi content ka real audio narration, sirf ek visual
styling toggle nahi — wahi information tak ek path offer karta hai jo
bilkul visual text processing pe depend nahi karta, directly difference
ko uske source pe address karte hue sirf uske visual symptoms ko
mitigate karne ke bajaye.

## Easily-confused letterforms pe meaning ke liye reliance avoid karna ek specific, checkable design requirement kyun hai

Certain letterform confusions (b/d, p/q, aur similar visually similar
pairs) ek specific, well-documented dyslexia-relevant difficulty hain.
Ek design jo purely ek icon ki visual form pe meaning carry karne ke
liye rely karta hai, ek redundant, unambiguous text label ke bina, is
specific confusion ko risk karta hai. Icons ko clear text labels ke
saath pair karna ek concrete, checkable requirement hai jo icon khud ke
kisi bhi visual redesign ki zaroorat ke bina is specific risk ko remove
karta hai.

## Is lesson ke patterns Module 2 ke wahi principles kyun hain, ek specific constraint ke andar stricter banaye gaye

Is lesson mein har pattern — ragged-right alignment, generous line
height, bounded line length, redundant labeling — wahi legibility aur
scanning principles ka ek direct application hai jise Module 2 ne
general population ke liye establish kiya, zyada strictly applied
kyunki dyslexia error ke margin ko narrow karta hai jo broadly exist
karta hai. Ye lesson ek separate visual-design framework introduce
nahi karta; ye is course ke existing perception findings ko ek
specific, well-documented constraint ke andar apply karta hai.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne attention differences ke liye concrete patterns establish
kiye, Module 1 ke cognitive-load findings ko extend karte hue. Ye
lesson identical standard — concrete, implementable patterns, sirf
awareness nahi — dyslexia aur reading differences pe apply karta hai,
Module 2 ke perception findings ko extend karte hue. Lesson 3 module
ko complete karta hai wahi standard anxiety aur situational cognitive
load pe apply karke, Module 13 ke concrete cognitive accessibility ke
three-part treatment ko close karte hue.`,

    examples: [
      {
        title: 'A dyslexia-friendly text component and an icon-label audit applying this lesson\'s concrete patterns',
        titleHi: "Ek dyslexia-friendly text component aur ek icon-label audit jo is lesson ke concrete patterns apply karta hai",
        codeJs: `function ReadableArticle({ text, audioUrl }) {
  return (
    <article style={{ maxWidth: '65ch', lineHeight: 1.5, textAlign: 'left' }}>
      {text.split('\\n\\n').map((paragraph, i) => (
        <p key={i} style={{ marginBottom: '1.2em' }}>{paragraph}</p>
      ))}
      {audioUrl && <audio controls src={audioUrl} />}
    </article>
  );
}

function auditIconLabelPair(icon, label) {
  return {
    hasRedundantTextLabel: Boolean(label),
    recommendation: label
      ? 'passes — icon is reinforced by unambiguous text'
      : 'fails — provide a text label alongside any icon carrying meaning',
  };
}

// A delete icon with no accompanying text
console.log(auditIconLabelPair('trash-icon', null));
// { hasRedundantTextLabel: false, recommendation: 'fails...' }

// The same icon, properly labeled
console.log(auditIconLabelPair('trash-icon', 'Delete'));
// { hasRedundantTextLabel: true, recommendation: 'passes...' }`,
        codeTs: `function ReadableArticle({ text, audioUrl }: { text: string; audioUrl?: string }) {
  return (
    <article style={{ maxWidth: '65ch', lineHeight: 1.5, textAlign: 'left' }}>
      {text.split('\\n\\n').map((paragraph, i) => (
        <p key={i} style={{ marginBottom: '1.2em' }}>{paragraph}</p>
      ))}
      {audioUrl && <audio controls src={audioUrl} />}
    </article>
  );
}

function auditIconLabelPair(icon: string, label: string | null) {
  return {
    hasRedundantTextLabel: Boolean(label),
    recommendation: label
      ? 'passes — icon is reinforced by unambiguous text'
      : 'fails — provide a text label alongside any icon carrying meaning',
  };
}

// A delete icon with no accompanying text
console.log(auditIconLabelPair('trash-icon', null));
// { hasRedundantTextLabel: false, recommendation: 'fails...' }

// The same icon, properly labeled
console.log(auditIconLabelPair('trash-icon', 'Delete'));
// { hasRedundantTextLabel: true, recommendation: 'passes...' }`,
        code: `<article style={{ maxWidth: '65ch', lineHeight: 1.5, textAlign: 'left' }}>
// bounded line length, generous line height, ragged-right alignment — all in one component`,
        output:
          "The article component renders with a bounded line length, generous line height, and left-alignment, directly implementing this lesson's concrete typography patterns; the icon audit correctly flags the unlabeled delete icon as failing (risking a b/d-style letterform-adjacent confusion in meaning) while the labeled version passes.",
        explain:
          "This example operationalizes two of the lesson's concrete patterns together: a text-presentation component that applies the specific typographic factors (line length, line height, alignment) documented to reduce dyslexia-relevant reading difficulty, and an audit function that catches icon-only meaning before it ships without a redundant text label.",
        explainHi:
          "Ye example lesson ke do concrete patterns ko saath mein operationalize karta hai: ek text-presentation component jo specific typographic factors (line length, line height, alignment) apply karta hai jo dyslexia-relevant reading difficulty kam karne ke liye documented hain, aur ek audit function jo icon-only meaning ko ship hone se pehle pakadta hai ek redundant text label ke bina.",
      },
    ],

    mistakes: [
      {
        wrong: `/* A dense, justified text block with tight line spacing —
   optimizing for a compact visual appearance over readability */
.article-body-wrong {
  text-align: justify;
  line-height: 1.1;
  max-width: 100%;
  /* Full-width justified text with tight spacing creates uneven
     word-gaps and makes line-tracking difficult — a specific,
     avoidable obstacle for dyslexic readers, and harder to read for
     everyone under strain (a small screen, a tired reader) */
}`,
        right: `/* A left-aligned text block with generous spacing and a bounded
   line length */
.article-body-right {
  text-align: left;
  line-height: 1.5;
  max-width: 65ch;
  margin-bottom: 1.2em;
  /* Consistent word-spacing, easy line-tracking, and a comfortable
     reading measure — addresses the specific obstacles this lesson
     identifies without sacrificing any content */
}`,
        why: "Justified alignment with tight line spacing creates uneven word gaps and difficult line-tracking — two specific, documented obstacles for dyslexic readers — purely in service of a denser visual appearance, when a left-aligned, generously spaced layout conveys identical content with none of this cost.",
        whyHi:
          "Justified alignment tight line spacing ke saath uneven word gaps aur difficult line-tracking create karta hai — dyslexic readers ke liye do specific, documented obstacles — purely ek denser visual appearance ki service mein, jab ek left-aligned, generously spaced layout identical content convey karta hai is cost ke bina.",
      },
    ],

    realWorld: [
      {
        en: "A production documentation site switched its long-form articles from justified, tightly-spaced text to left-aligned text with generous line height and a bounded 65-character line length, following specific dyslexia-research recommendations; a follow-up analysis found measurably longer average session time and lower bounce rate on long articles across the ENTIRE readership, not just the subset who had reported reading difficulty.",
        hi: 'Ek production documentation site ne apne long-form articles ko justified, tightly-spaced text se left-aligned text mein switch kiya generous line height aur ek bounded 65-character line length ke saath, specific dyslexia-research recommendations follow karte hue; ek follow-up analysis ne paaya long articles pe measurably longer average session time aur lower bounce rate ENTIRE readership ke across, sirf us subset mein nahi jisne reading difficulty report ki thi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does this lesson recommend left-aligned text over justified text specifically for dyslexia-related readability?',
        qHi: 'Ye lesson specifically dyslexia-related readability ke liye justified text se zyada left-aligned text ki recommend kyun karta hai?',
        a: "Justified text forces uneven, unpredictable word-spacing to make every line the same width, and this uneven spacing is documented as a specific obstacle for dyslexic readers who rely on consistent visual rhythm to track through text. Left-aligned text with a ragged right edge preserves consistent word-spacing throughout, removing this specific documented obstacle.",
        aHi: 'Justified text har line ko same width banane ke liye uneven, unpredictable word-spacing force karta hai, aur ye uneven spacing dyslexic readers ke liye ek specific obstacle ki tarah documented hai jo text ke through track karne ke liye consistent visual rhythm pe rely karte hain. Left-aligned text ek ragged right edge ke saath throughout consistent word-spacing preserve karta hai, is specific documented obstacle ko remove karte hue.',
      },
      {
        q: "Why is a genuine text-to-speech alternative considered more effective than purely visual typography adjustments for dyslexia?",
        qHi: 'Dyslexia ke liye ek genuine text-to-speech alternative purely visual typography adjustments se zyada effective kyun mana jaata hai?',
        a: "Since dyslexia involves a specific difference in how the visual system processes written text, purely visual adjustments help but don't eliminate the underlying difficulty. A genuine audio alternative offers a path to the same information that doesn't depend on visual text processing at all, addressing the difference at its source rather than only mitigating its visual symptoms.",
        aHi: 'Kyunki dyslexia visual system written text ko kaise process karta hai usmein ek specific difference involve karta hai, purely visual adjustments help karte hain par underlying difficulty ko eliminate nahi karte. Ek genuine audio alternative wahi information tak ek path offer karta hai jo bilkul visual text processing pe depend nahi karta, difference ko uske source pe address karte hue sirf uske visual symptoms ko mitigate karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "A mobile app displays its terms-of-service text as a single, dense, justified paragraph with no line breaks, using icon-only buttons ('✓' and '✗') for 'Accept' and 'Decline' with no text labels. Using this lesson's framework, identify the two specific, separate issues here and the concrete fix for each.",
        taskHi: "Ek mobile app apna terms-of-service text ek single, dense, justified paragraph ki tarah display karta hai koi line breaks ke bina, icon-only buttons ('✓' aur '✗') use karte hue 'Accept' aur 'Decline' ke liye koi text labels ke bina. Is lesson ke framework use karke, yahan do specific, separate issues aur har ek ka concrete fix identify karo.",
        hint: "One issue concerns the paragraph's typography (justification, density, lack of breaks); the other concerns relying purely on icon shape for a consequential decision (accept vs. decline) without a redundant text label — treat these as two separate, independently fixable problems.",
        hintHi: 'Ek issue paragraph ki typography (justification, density, breaks ki kami) ke baare mein hai; doosra ek consequential decision (accept vs. decline) ke liye purely icon shape pe rely karne ke baare mein hai ek redundant text label ke bina — inhe do separate, independently fixable problems ki tarah treat karo.',
      },
    ],

    keyTakeaways: [
      "Designing for dyslexia extends Module 2's perception findings to the specific mechanics of reading text, identifying concrete, checkable factors rather than relying on vague accessibility awareness.",
      "Specific patterns: avoid justified text (uneven word-spacing), use generous line height and bounded line length (easier line-tracking), and provide a genuine audio alternative (addresses the processing difference at its source).",
      "Avoid relying purely on easily-confused letterforms (icons) for meaning — pair with redundant, unambiguous text labels.",
      "Like the module's curb-cut-effect analogy, these patterns are the same legibility principles Module 2 established, applied more strictly — and they measurably improve readability for everyone, not only dyslexic readers.",
    ],
    keyTakeawaysHi: [
      'Dyslexia ke liye design karna Module 2 ke perception findings ko text padhne ke specific mechanics tak extend karta hai, concrete, checkable factors identify karte hue vague accessibility awareness pe rely karne ke bajaye.',
      'Specific patterns: justified text avoid karo (uneven word-spacing), generous line height aur bounded line length use karo (easier line-tracking), aur ek genuine audio alternative provide karo (processing difference ko uske source pe address karta hai).',
      'Meaning ke liye purely easily-confused letterforms (icons) pe rely karne se bacho — redundant, unambiguous text labels ke saath pair karo.',
      'Module ke curb-cut-effect analogy ki tarah, ye patterns wahi legibility principles hain jise Module 2 ne establish kiya, zyada strictly applied — aur ye sabke liye readability ko measurably improve karte hain, sirf dyslexic readers ko nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'psych-designing-for-anxiety-cognitive-load',
    title: 'Designing for Anxiety & Situational Cognitive Load',
    titleHi: 'Anxiety & Situational Cognitive Load Ke Liye Design Karna',
    description:
      "Closing this module: concrete patterns for anxiety and situational cognitive load, establishing that cognitive accessibility isn't only about permanent traits (Lessons 1-2) but also temporary and situational states everyone experiences, directly previewing Module 14's stress-context focus.",
    descriptionHi:
      'Is module ko close karte hue: anxiety aur situational cognitive load ke liye concrete patterns, establish karte hue ki cognitive accessibility sirf permanent traits (Lessons 1-2) ke baare mein nahi hai balki temporary aur situational states ke baare mein bhi hai jo sab experience karte hain, directly Module 14 ke stress-context focus ko preview karte hue.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A hospital that redesigns its intake forms and wayfinding signage specifically for people arriving in acute distress — a family member who just received frightening news, a patient in genuine pain — and finds that these same clearer, calmer, lower-demand designs also help every other visitor navigate the building, even those who arrive perfectly calm.** A hospital's administrative and wayfinding design faces a specific, unusual challenge: many of the people using it at any given moment are not in their normal cognitive state — a parent who just got a frightening call about their child, a patient managing genuine physical pain, a visitor who has been awake for 30 hours at a relative's bedside all have measurably reduced capacity for complex forms, ambiguous signage, or multi-step processes, not because of any permanent trait, but because of their genuinely temporary, situational state. When the hospital redesigns intake specifically around this reality — shorter forms, one question at a time, clear and redundant wayfinding signage, staff trained to repeat information without visible impatience — every other visitor benefits too, including the ones who arrived perfectly calm and rested, because clear, low-demand design is simply better design, full stop. This is exactly this lesson's finding about anxiety and situational cognitive load: unlike Lessons 1-2's permanent traits, genuinely anyone can experience a temporary state — a stressful life event, a high-stakes moment in the product itself (an error, a large payment, an account-security alert) — where their available cognitive capacity is measurably reduced, and designing concretely for that temporary state (exactly the same patterns this module has built throughout) helps everyone, since everyone passes through such states at some point.",
      hi: 'ek hospital jo apne intake forms aur wayfinding signage ko specifically un logon ke liye redesign karta hai jo acute distress mein aate hain — ek family member jise abhi abhi frightening news mili, ek patient jo genuine pain manage kar raha hai — aur paata hai ki ye wahi clearer, calmer, lower-demand designs har doosre visitor ko bhi building navigate karne mein help karte hain, even un logon ko jo perfectly calm aate hain. Ek hospital ka administrative aur wayfinding design ek specific, unusual challenge face karta hai: kisi bhi given moment pe ise use kar rahe kai log apni normal cognitive state mein nahi hote — ek parent jise abhi apne bachche ke baare mein ek frightening call aayi, ek patient jo genuine physical pain manage kar raha hai, ek visitor jo 30 ghante se ek relative ke bedside pe jaaga hua hai sab measurably reduced capacity rakhte hain complex forms, ambiguous signage, ya multi-step processes ke liye, kisi permanent trait ki wajah se nahi, balki unki genuinely temporary, situational state ki wajah se. Jab hospital intake ko specifically is reality ke around redesign karta hai — shorter forms, ek time pe ek question, clear aur redundant wayfinding signage, staff jo visible impatience ke bina information repeat karne ke liye trained hai — har doosra visitor bhi benefit karta hai, un logon samet jo perfectly calm aur rested aaye, kyunki clear, low-demand design simply better design hai, full stop. Ye exactly is lesson ki finding hai anxiety aur situational cognitive load ke baare mein: Lessons 1-2 ke permanent traits ke unlike, genuinely koi bhi ek temporary state experience kar sakta hai — ek stressful life event, product khud mein ek high-stakes moment (ek error, ek large payment, ek account-security alert) — jahan unki available cognitive capacity measurably reduced hai, aur us temporary state ke liye concretely design karna (exactly wahi patterns jo is module ne throughout build kiye) sabko help karta hai, kyunki sab kisi na kisi point pe aisi states se guzarte hain.',
    },

    simple: `**Why this lesson extends Lessons 1-2's framework to temporary,
situational states rather than only permanent traits:**

\`\`\`
Lessons 1-2 addressed genuine, well-documented, largely permanent
traits (ADHD, dyslexia). This lesson establishes that the SAME
underlying resource — available cognitive capacity — is also
measurably reduced by genuinely temporary situational states: anxiety
from a stressful life event, or a high-stakes moment within the
product itself (an error, a large payment, a security alert). This
means the concrete patterns from Lessons 1-2 apply here too — not
because everyone has these permanent traits, but because everyone
passes through states of reduced capacity at some point.
\`\`\`

**A concrete, checkable pattern — reducing decision complexity
specifically during a high-stakes, anxiety-inducing moment, connecting
directly to Module 6's decision-fatigue findings:**

\`\`\`tsx
// Presents full complexity at the exact moment anxiety is highest
function AccountSecurityAlertWrong() {
  return (
    <div>
      <h2>Suspicious activity detected</h2>
      <p>Choose your response: {/* 6 options, dense technical language */}</p>
    </div>
  );
}

// Reduces decision complexity specifically at this high-stakes moment
function AccountSecurityAlertRight({ onSecure, onReview }) {
  return (
    <div>
      <h2>We noticed an unusual sign-in attempt</h2>
      <p>Your account is safe. Choose one:</p>
      <button onClick={onSecure}>Secure my account now</button>
      <button onClick={onReview}>Review the details first</button>
      {/* Two clear options, plain language — Module 6's sensible-
          defaults pattern applied specifically to a moment of
          situationally elevated anxiety */}
    </div>
  );
}
\`\`\`

**A concrete, checkable pattern — genuine reversibility as an
anxiety-reduction mechanism, since fear of an unrecoverable mistake is
a specific, well-documented anxiety amplifier:**

\`\`\`tsx
function DestructiveActionButton({ onConfirm, isReversible, undoWindowSeconds }) {
  if (isReversible) {
    return (
      <button onClick={onConfirm}>
        Delete (undo available for {undoWindowSeconds}s)
      </button>
      // Genuine reversibility measurably reduces the anxiety of a
      // consequential decision, independent of the decision's actual
      // outcome
    );
  }
  return <ConfirmationDialog onConfirm={onConfirm} warning="This cannot be undone." />;
}
\`\`\`

**A concrete, checkable pattern — explicit, redundant confirmation
that an action succeeded, since anxiety amplifies uncertainty about
whether a consequential action actually completed:**

\`\`\`tsx
function PaymentSubmission({ status }) {
  if (status === 'processing') {
    return <p>Processing your payment — please don't close this window.</p>;
  }
  if (status === 'success') {
    return <p>Payment confirmed. A receipt has been sent to your email.</p>;
    // Explicit, unambiguous confirmation — reduces the specific
    // anxiety of uncertainty about a consequential action's outcome
  }
}
\`\`\`

**Why this lesson closes Module 13 by generalizing its core finding
across all three lessons:**

\`\`\`ts
function identifyAccessibilityScope(designPattern) {
  return {
    helpsPermanentTraitPopulations: true, // Lessons 1-2's direct target
    helpsSituationalStatePopulations: true, // this lesson's direct target
    helpsGeneralPopulationToo: true, // the curb-cut effect, throughout
  };
  // The SAME concrete patterns (reducing simultaneous demands, explicit
  // state, minimizing unpredictable interruption, genuine reversibility)
  // serve all three groups simultaneously — this is the module's
  // unifying finding, not three separate frameworks
}
\`\`\`

**How this lesson closes Module 13 and previews Module 14:** Lesson 1
established concrete patterns for ADHD and attention differences.
Lesson 2 applied the identical standard to dyslexia and reading
differences. This lesson extends the same framework to anxiety and
situational cognitive load, establishing that cognitive accessibility
concerns temporary states as much as permanent traits — directly
previewing Module 14's focus on how cognition degrades under stress in
specifically high-stakes contexts like medical, financial, and
emergency interfaces.`,

    simpleHi: `**Ye lesson Lessons 1-2 ke framework ko temporary, situational
states tak kaise extend karta hai sirf permanent traits ke bajaye:**

\`\`\`
Lessons 1-2 ne genuine, well-documented, largely permanent traits
(ADHD, dyslexia) address kiye. Ye lesson establish karta hai ki WAHI
underlying resource — available cognitive capacity — genuinely
temporary situational states se bhi measurably reduced hoti hai:
ek stressful life event se anxiety, ya product khud ke andar ek
high-stakes moment (ek error, ek large payment, ek security alert).
Iska matlab hai ki Lessons 1-2 ke concrete patterns yahan bhi apply
hote hain — is wajah se nahi ki sabke paas ye permanent traits hain,
balki is wajah se ki sab kisi na kisi point pe reduced capacity ki
states se guzarte hain.
\`\`\`

**Ek concrete, checkable pattern — specifically ek high-stakes,
anxiety-inducing moment ke dauran decision complexity kam karna,
directly Module 6 ke decision-fatigue findings se connect karte hue:**

\`\`\`tsx
// Bilkul us moment pe full complexity present karta hai jab anxiety
// sabse high hoti hai
function AccountSecurityAlertWrong() {
  return (
    <div>
      <h2>Suspicious activity detected</h2>
      <p>Choose your response: {/* 6 options, dense technical language */}</p>
    </div>
  );
}

// Specifically is high-stakes moment pe decision complexity kam karta hai
function AccountSecurityAlertRight({ onSecure, onReview }) {
  return (
    <div>
      <h2>We noticed an unusual sign-in attempt</h2>
      <p>Your account is safe. Choose one:</p>
      <button onClick={onSecure}>Secure my account now</button>
      <button onClick={onReview}>Review the details first</button>
      {/* Do clear options, plain language — Module 6 ka sensible-
          defaults pattern specifically ek situationally elevated
          anxiety ke moment pe applied */}
    </div>
  );
}
\`\`\`

**Ek concrete, checkable pattern — genuine reversibility ek anxiety-
reduction mechanism ki tarah, kyunki ek unrecoverable mistake ka dar
ek specific, well-documented anxiety amplifier hai:**

\`\`\`tsx
function DestructiveActionButton({ onConfirm, isReversible, undoWindowSeconds }) {
  if (isReversible) {
    return (
      <button onClick={onConfirm}>
        Delete (undo available for {undoWindowSeconds}s)
      </button>
      // Genuine reversibility ek consequential decision ki anxiety ko
      // measurably kam karti hai, decision ke actual outcome se
      // independently
    );
  }
  return <ConfirmationDialog onConfirm={onConfirm} warning="This cannot be undone." />;
}
\`\`\`

**Ek concrete, checkable pattern — explicit, redundant confirmation ki
ek action succeed hui, kyunki anxiety is uncertainty ko amplify karti
hai ki kya ek consequential action actually complete hui:**

\`\`\`tsx
function PaymentSubmission({ status }) {
  if (status === 'processing') {
    return <p>Processing your payment — please don't close this window.</p>;
  }
  if (status === 'success') {
    return <p>Payment confirmed. A receipt has been sent to your email.</p>;
    // Explicit, unambiguous confirmation — ek consequential action ke
    // outcome ke baare mein uncertainty ki specific anxiety kam
    // karti hai
  }
}
\`\`\`

**Ye lesson Module 13 ko close karte hue apne core finding ko teeno
lessons ke across kaise generalize karta hai:**

\`\`\`ts
function identifyAccessibilityScope(designPattern) {
  return {
    helpsPermanentTraitPopulations: true, // Lessons 1-2 ka direct target
    helpsSituationalStatePopulations: true, // is lesson ka direct target
    helpsGeneralPopulationToo: true, // curb-cut effect, throughout
  };
  // WAHI concrete patterns (simultaneous demands kam karna, explicit
  // state, unpredictable interruption minimize karna, genuine
  // reversibility) teeno groups ko simultaneously serve karte hain —
  // ye module ki unifying finding hai, teen separate frameworks nahi
}
\`\`\`

**Ye lesson Module 13 ko kaise close karta hai aur Module 14 ko kaise
preview karta hai:** Lesson 1 ne ADHD aur attention differences ke
liye concrete patterns establish kiye. Lesson 2 ne identical standard
dyslexia aur reading differences pe apply kiya. Ye lesson wahi
framework anxiety aur situational cognitive load pe extend karta hai,
establish karte hue ki cognitive accessibility temporary states ke
baare mein utni hi hai jitni permanent traits ke baare mein — directly
Module 14 ke focus ko preview karte hue is baat pe ki cognition stress
ke andar specifically high-stakes contexts jaise medical, financial,
aur emergency interfaces mein kaise degrade hoti hai.`,

    content: `## Why this lesson extends Lessons 1-2's framework from permanent
traits to temporary, situational states

Lessons 1-2 addressed genuine, well-documented, largely permanent
traits: ADHD's effect on attention regulation and dyslexia's effect on
text processing. This lesson establishes that the same underlying
resource — available cognitive capacity — is also measurably reduced
by genuinely temporary, situational states: anxiety from a stressful
life circumstance, or a high-stakes moment created by the product
itself, such as a security alert, an error, or a large financial
transaction. This extension matters because it broadens cognitive
accessibility from "designing for a specific population" to "designing
for a state that everyone passes through at some point," directly
following this module's curb-cut-effect framing.

## Why reducing decision complexity specifically at high-stakes,
anxiety-inducing moments connects directly to Module 6's
decision-fatigue findings

Module 6 established that decision-making capacity is a genuinely
limited resource that degrades under repeated or complex demands. A
moment of situationally elevated anxiety — an account security alert,
an unexpected error during a critical task — represents exactly the
condition under which this limited capacity is under the most strain.
Presenting fewer, clearer choices with plain, non-technical language
specifically at this moment directly applies Module 6's
choice-architecture standard to a moment where it matters more, not
differently, than during ordinary use.

## Why genuine reversibility functions as a specific,
measurable anxiety-reduction mechanism

Fear of making an unrecoverable mistake is a well-documented amplifier
of situational anxiety around a consequential decision. Providing
genuine reversibility — a real, functional undo window, not merely the
appearance of one — measurably reduces this anxiety independent of
whatever the user ultimately decides, since the fear being addressed is
about the decision's permanence, not necessarily its outcome. This is
a concrete, checkable design decision: a destructive action either
genuinely offers a working undo mechanism within a real window, or it
requires a clear, honest confirmation step precisely because no such
recovery exists.

## Why explicit, redundant confirmation of a completed action directly
addresses anxiety's amplification of outcome uncertainty

Anxiety measurably amplifies uncertainty about whether a consequential
action actually completed as intended — a payment, a critical form
submission, an account change. Providing explicit, unambiguous
confirmation (a clear success state, a concrete promise like an emailed
receipt) directly closes this uncertainty gap at the exact moment it
matters most, rather than leaving the user to infer success from an
ambiguous or silent state change.

## Why this lesson's closing generalization ties together Module 13's
entire three-lesson structure

Across all three lessons, the same underlying concrete patterns —
reducing simultaneous demands, making state explicit, minimizing
unpredictable interruption, providing genuine reversibility and
confirmation — serve multiple populations simultaneously: those with
permanent traits like ADHD and dyslexia (Lessons 1-2), those in
temporary situational states like anxiety (this lesson), and the
general population, who benefit from the same clarity and reduced
cognitive demand regardless of their specific circumstance. This is
the module's unifying finding, directly extending the curb-cut-effect
analogy established at Module 13's opening — not three separate,
disconnected design frameworks, but one consistent standard applied
across three different sources of reduced cognitive capacity.

## How this lesson closes Module 13 and directly previews Module 14

Lesson 1 established concrete patterns for ADHD and attention
differences, extending Module 1. Lesson 2 applied the identical
standard to dyslexia and reading differences, extending Module 2. This
lesson extends the same framework to anxiety and situational cognitive
load, establishing that cognitive accessibility concerns temporary
states as much as permanent traits. This directly previews Module 14's
focus: how cognition genuinely degrades under stress, and what that
means specifically for medical, financial, and emergency interface
design, where the stakes of getting this exact lesson's patterns right
are at their highest.`,

    contentHi: `## Ye lesson Lessons 1-2 ke framework ko permanent traits se temporary, situational states tak kaise extend karta hai

Lessons 1-2 ne genuine, well-documented, largely permanent traits
address kiye: ADHD ka attention regulation pe effect aur dyslexia ka
text processing pe effect. Ye lesson establish karta hai ki wahi
underlying resource — available cognitive capacity — genuinely
temporary, situational states se bhi measurably reduced hoti hai: ek
stressful life circumstance se anxiety, ya product khud dwara create
kiya gaya ek high-stakes moment, jaise ek security alert, ek error, ya
ek large financial transaction. Ye extension matter karta hai kyunki
ye cognitive accessibility ko "ek specific population ke liye design
karna" se "ek state ke liye design karna jise sab kisi na kisi point
pe guzarte hain" tak broaden karta hai, directly is module ke
curb-cut-effect framing ko follow karte hue.

## Specifically high-stakes, anxiety-inducing moments pe decision complexity kam karna directly Module 6 ke decision-fatigue findings se kaise connect karta hai

Module 6 ne establish kiya ki decision-making capacity ek genuinely
limited resource hai jo repeated ya complex demands ke andar degrade
hoti hai. Situationally elevated anxiety ka ek moment — ek account
security alert, ek critical task ke dauran ek unexpected error —
exactly wo condition represent karta hai jiske andar ye limited
capacity sabse zyada strain mein hoti hai. Specifically is moment pe
kam, clearer choices plain, non-technical language ke saath present
karna directly Module 6 ke choice-architecture standard ko ek aise
moment pe apply karta hai jahan ye differently nahi, zyada matter
karta hai ordinary use ke dauran se.

## Genuine reversibility ek specific, measurable anxiety-reduction mechanism ki tarah kyun function karti hai

Ek unrecoverable mistake karne ka dar ek consequential decision ke
around situational anxiety ka ek well-documented amplifier hai.
Genuine reversibility provide karna — ek real, functional undo window,
sirf uski appearance nahi — is anxiety ko measurably kam karta hai
chahe user ultimately kya decide kare, kyunki jo dar address kiya ja
raha hai wo decision ki permanence ke baare mein hai, zaroori nahi ki
uske outcome ke baare mein. Ye ek concrete, checkable design decision
hai: ek destructive action ya to genuinely ek real window ke andar ek
working undo mechanism offer karta hai, ya use ek clear, honest
confirmation step ki zaroorat hoti hai precisely kyunki aisi koi
recovery exist nahi karti.

## Ek completed action ka explicit, redundant confirmation directly anxiety ke outcome uncertainty ke amplification ko kyun address karta hai

Anxiety is uncertainty ko measurably amplify karti hai ki kya ek
consequential action actually intended ki tarah complete hui — ek
payment, ek critical form submission, ek account change. Explicit,
unambiguous confirmation provide karna (ek clear success state, ek
concrete promise jaise ek emailed receipt) directly is uncertainty gap
ko bilkul us moment pe close karta hai jab ye sabse zyada matter karta
hai, user ko success ko ek ambiguous ya silent state change se infer
karne ke liye chhodne ke bajaye.

## Is lesson ki closing generalization Module 13 ke entire three-lesson structure ko kaise tie together karti hai

Teeno lessons ke across, wahi underlying concrete patterns —
simultaneous demands kam karna, state ko explicit banana, unpredictable
interruption minimize karna, genuine reversibility aur confirmation
provide karna — multiple populations ko simultaneously serve karte
hain: permanent traits wale jaise ADHD aur dyslexia (Lessons 1-2),
temporary situational states wale jaise anxiety (ye lesson), aur
general population, jo apne specific circumstance se independently
wahi clarity aur reduced cognitive demand se benefit karte hain. Ye
module ki unifying finding hai, directly curb-cut-effect analogy ko
extend karte hue jo Module 13 ke opening pe establish ki gayi thi —
teen separate, disconnected design frameworks nahi, balki ek
consistent standard jo reduced cognitive capacity ke teen different
sources ke across applied hai.

## Ye lesson Module 13 ko kaise close karta hai aur directly Module 14 ko kaise preview karta hai

Lesson 1 ne ADHD aur attention differences ke liye concrete patterns
establish kiye, Module 1 ko extend karte hue. Lesson 2 ne identical
standard dyslexia aur reading differences pe apply kiya, Module 2 ko
extend karte hue. Ye lesson wahi framework anxiety aur situational
cognitive load pe extend karta hai, establish karte hue ki cognitive
accessibility temporary states ke baare mein utni hi hai jitni
permanent traits ke baare mein. Ye directly Module 14 ke focus ko
preview karta hai: cognition stress ke andar genuinely kaise degrade
hoti hai, aur uska specifically medical, financial, aur emergency
interface design ke liye kya matlab hai, jahan is exact lesson ke
patterns ko sahi karne ke stakes apne sabse highest pe hain.`,

    examples: [
      {
        title: 'A security-alert component and a reversible-delete pattern implementing this lesson\'s anxiety-reduction patterns',
        titleHi: "Ek security-alert component aur ek reversible-delete pattern jo is lesson ke anxiety-reduction patterns implement karte hain",
        codeJs: `function AccountSecurityAlert({ onSecure, onReview }) {
  return (
    <div role="alert">
      <h2>We noticed an unusual sign-in attempt</h2>
      <p>Your account is safe. Choose one:</p>
      <button onClick={onSecure}>Secure my account now</button>
      <button onClick={onReview}>Review the details first</button>
    </div>
  );
}

function DestructiveActionButton({ onConfirm, isReversible, undoWindowSeconds }) {
  if (isReversible) {
    return <button onClick={onConfirm}>Delete (undo available for {undoWindowSeconds}s)</button>;
  }
  return <ConfirmationDialog onConfirm={onConfirm} warning="This cannot be undone." />;
}

function identifyAccessibilityScope(designPattern) {
  return {
    helpsPermanentTraitPopulations: true,
    helpsSituationalStatePopulations: true,
    helpsGeneralPopulationToo: true,
  };
}

console.log(identifyAccessibilityScope('reduced-simultaneous-demands'));
// { helpsPermanentTraitPopulations: true, helpsSituationalStatePopulations: true, helpsGeneralPopulationToo: true }`,
        codeTs: `function AccountSecurityAlert({ onSecure, onReview }: { onSecure: () => void; onReview: () => void }) {
  return (
    <div role="alert">
      <h2>We noticed an unusual sign-in attempt</h2>
      <p>Your account is safe. Choose one:</p>
      <button onClick={onSecure}>Secure my account now</button>
      <button onClick={onReview}>Review the details first</button>
    </div>
  );
}

function DestructiveActionButton({
  onConfirm,
  isReversible,
  undoWindowSeconds,
}: {
  onConfirm: () => void;
  isReversible: boolean;
  undoWindowSeconds: number;
}) {
  if (isReversible) {
    return <button onClick={onConfirm}>Delete (undo available for {undoWindowSeconds}s)</button>;
  }
  return <ConfirmationDialog onConfirm={onConfirm} warning="This cannot be undone." />;
}

interface AccessibilityScope {
  helpsPermanentTraitPopulations: boolean;
  helpsSituationalStatePopulations: boolean;
  helpsGeneralPopulationToo: boolean;
}

function identifyAccessibilityScope(designPattern: string): AccessibilityScope {
  return {
    helpsPermanentTraitPopulations: true,
    helpsSituationalStatePopulations: true,
    helpsGeneralPopulationToo: true,
  };
}

console.log(identifyAccessibilityScope('reduced-simultaneous-demands'));
// { helpsPermanentTraitPopulations: true, helpsSituationalStatePopulations: true, helpsGeneralPopulationToo: true }`,
        code: `<button onClick={onConfirm}>Delete (undo available for {undoWindowSeconds}s)</button>
// genuine reversibility reduces anxiety around a consequential decision, independent of outcome`,
        output:
          "The security alert presents exactly two clear options in plain language at a moment of elevated anxiety, correctly applying Module 6's decision-fatigue reduction; the destructive-action button correctly offers a genuine, time-boxed undo when reversibility is real, reducing anxiety about the decision's permanence directly.",
        explain:
          "This example operationalizes the module's closing generalization directly: the same concrete patterns (fewer choices at high-stakes moments, genuine reversibility) that Lessons 1-2 established for permanent traits are shown here serving a temporary, situational anxiety state, with the final function making explicit that all three populations benefit from the identical design decision.",
        explainHi:
          "Ye example module ki closing generalization ko directly operationalize karta hai: wahi concrete patterns (high-stakes moments pe kam choices, genuine reversibility) jinhe Lessons 1-2 ne permanent traits ke liye establish kiya yahan ek temporary, situational anxiety state ko serve karte hue dikhaye gaye hain, final function explicit banate hue ki teeno populations identical design decision se benefit karte hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// A destructive action presented as instantly, silently permanent
// with no confirmation and no recovery path
function DeleteButtonWrong({ onDelete }) {
  return <button onClick={onDelete}>Delete</button>;
  // No confirmation, no undo window, no warning — maximizes the
  // specific anxiety of an unrecoverable mistake, and offers no
  // relief mechanism for a user in a situationally elevated anxiety
  // state (rushing, distracted, upset)
}`,
        right: `// A destructive action with genuine reversibility and a clear warning
function DeleteButtonRight({ onDelete, undoWindowSeconds = 10 }) {
  return (
    <button onClick={onDelete}>
      Delete (undo available for {undoWindowSeconds}s)
    </button>
    // Genuine reversibility directly reduces the anxiety of an
    // unrecoverable mistake, independent of the user's situational state
  );
}`,
        why: "A destructive action with no confirmation and no recovery path maximizes the specific, well-documented anxiety of an unrecoverable mistake, which is disproportionately costly for a user already in a situationally elevated anxiety state — providing genuine, time-boxed reversibility directly addresses this without adding unnecessary friction for users who are not.",
        whyHi:
          "Ek destructive action koi confirmation ya recovery path ke bina ek unrecoverable mistake ki specific, well-documented anxiety ko maximize karta hai, jo ek user ke liye disproportionately costly hai jo already ek situationally elevated anxiety state mein hai — genuine, time-boxed reversibility provide karna directly ise address karta hai un users ke liye unnecessary friction add kiye bina jo aisi state mein nahi hain.",
      },
    ],

    realWorld: [
      {
        en: "A production fintech app redesigned its 'transfer failed' error state after support data showed users in this specific moment (often already anxious about a time-sensitive payment) were disproportionately likely to retry the transfer multiple times, worried the first attempt had silently succeeded — adding an explicit, unambiguous 'this transfer did not go through, no funds were moved' confirmation eliminated the duplicate-retry pattern almost entirely.",
        hi: "Ek production fintech app ne apna 'transfer failed' error state redesign kiya support data ye dikhane ke baad ki is specific moment pe users (aksar already ek time-sensitive payment ke baare mein anxious) disproportionately transfer ko multiple baar retry karne ki tendency rakhte the, worried ki pehla attempt silently succeed ho gaya. Ek explicit, unambiguous 'this transfer did not go through, no funds were moved' confirmation add karne se duplicate-retry pattern almost entirely eliminate ho gaya.",
      },
    ],

    interviewQA: [
      {
        q: "How does this lesson extend the cognitive-accessibility framework Lessons 1-2 established for permanent traits like ADHD and dyslexia?",
        qHi: 'Ye lesson ADHD aur dyslexia jaise permanent traits ke liye Lessons 1-2 ne establish kiye cognitive-accessibility framework ko kaise extend karta hai?',
        a: "This lesson establishes that the same underlying resource — available cognitive capacity — is also measurably reduced by genuinely temporary situational states, like anxiety from a stressful life event or a high-stakes moment within the product itself. This broadens the framework from designing for specific populations to designing for a state everyone passes through, with the same concrete patterns applying to both.",
        aHi: 'Ye lesson establish karta hai ki wahi underlying resource — available cognitive capacity — genuinely temporary situational states se bhi measurably reduced hoti hai, jaise ek stressful life event se anxiety ya product khud ke andar ek high-stakes moment. Ye framework ko specific populations ke liye design karne se ek state ke liye design karne tak broaden karta hai jise sab guzarte hain, wahi concrete patterns dono pe apply hote hue.',
      },
      {
        q: 'Why does genuine reversibility (a real undo window) reduce anxiety around a consequential decision, independent of what the user ultimately decides?',
        qHi: 'Genuine reversibility (ek real undo window) ek consequential decision ke around anxiety kyun kam karti hai, user ultimately kya decide karta hai us se independently?',
        a: "Fear of an unrecoverable mistake is a well-documented amplifier of anxiety around a decision. This fear concerns the decision's permanence, not necessarily its outcome — so providing a genuine, functional undo window removes the source of that specific fear regardless of whether the user ultimately confirms or reverses the action.",
        aHi: 'Ek unrecoverable mistake ka dar ek decision ke around anxiety ka ek well-documented amplifier hai. Ye dar decision ki permanence ke baare mein hai, zaroori nahi ki uske outcome ke baare mein — isliye ek genuine, functional undo window provide karna us specific dar ke source ko remove karta hai chahe user ultimately action confirm kare ya reverse kare.',
      },
    ],

    exercises: [
      {
        task: "A banking app shows 'Transfer submitted' immediately after a user taps 'Send,' with no further status update, while the actual transfer processes in the background for up to 30 seconds. Using this lesson's framework, explain what specific anxiety-related risk this creates and what concrete fix addresses it.",
        taskHi: "Ek banking app 'Transfer submitted' immediately dikhata hai jab user 'Send' tap karta hai, koi further status update ke bina, jabki actual transfer background mein 30 seconds tak process hota hai. Is lesson ke framework use karke, explain karo ki ye kaunsa specific anxiety-related risk create karta hai aur kaunsa concrete fix ise address karta hai.",
        hint: "Think about what happens if the transfer fails silently in the background after the user has already seen 'submitted' and closed the app, and what this lesson's explicit-confirmation pattern would require instead.",
        hintHi: 'Socho ki kya hota hai agar transfer background mein silently fail ho jaaye user ke pehle se \'submitted\' dekhne aur app close karne ke baad, aur is lesson ka explicit-confirmation pattern iske bajaye kya require karega.',
      },
    ],

    keyTakeaways: [
      "Cognitive accessibility extends beyond permanent traits (Lessons 1-2's ADHD and dyslexia) to genuinely temporary situational states like anxiety — everyone passes through states of reduced cognitive capacity at some point.",
      "Reducing decision complexity at high-stakes, anxiety-inducing moments directly applies Module 6's decision-fatigue findings to a moment where they matter most.",
      "Genuine reversibility (a real, working undo window) measurably reduces anxiety about a decision's permanence, independent of the decision's outcome.",
      "This lesson closes Module 13 by generalizing its core finding: the same concrete patterns serve permanent-trait populations, situational-state populations, and the general population simultaneously — directly previewing Module 14's focus on cognition under stress.",
    ],
    keyTakeawaysHi: [
      'Cognitive accessibility permanent traits (Lessons 1-2 ke ADHD aur dyslexia) se aage genuinely temporary situational states jaise anxiety tak extend hoti hai — sab kisi na kisi point pe reduced cognitive capacity ki states se guzarte hain.',
      'High-stakes, anxiety-inducing moments pe decision complexity kam karna directly Module 6 ke decision-fatigue findings ko ek aise moment pe apply karta hai jahan wo sabse zyada matter karte hain.',
      'Genuine reversibility (ek real, working undo window) ek decision ki permanence ke baare mein anxiety ko measurably kam karti hai, decision ke outcome se independently.',
      'Ye lesson Module 13 ko close karta hai apni core finding ko generalize karke: wahi concrete patterns permanent-trait populations, situational-state populations, aur general population ko simultaneously serve karte hain — directly Module 14 ke cognition under stress pe focus ko preview karte hue.',
    ],
  },
];
