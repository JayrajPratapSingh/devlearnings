/**
 * Psychology for Developers — Module 11: Error Psychology, lessons 1-3.
 *
 * Lesson 1: Why users reflexively blame themselves for bad error messages.
 * Lesson 2: Norman's slips-vs-mistakes model — two genuinely different error types requiring different fixes.
 * Lesson 3: Designing error states that actually help instead of shaming.
 */

import type { CourseLesson } from './course-js-module1';

export const PSYCH_MODULE_11: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'psych-why-users-blame-themselves-for-errors',
    title: 'Why Users Reflexively Blame Themselves for Bad Error Messages',
    titleHi: 'Users Reflexively Bad Error Messages Ke Liye Khud Ko Kyun Blame Karte Hain',
    description:
      "A well-documented tendency for users encountering a vague or unhelpful error message to assume they personally did something wrong, rather than concluding the system failed to communicate clearly — a specific psychological pattern with direct, actionable design implications.",
    descriptionHi:
      'Ek well-documented tendency users ke liye ek vague ya unhelpful error message encounter karte hue ye assume karna ki unhone personally kuch galat kiya, ye conclude karne ke bajaye ki system clearly communicate karne mein fail hua — ek specific psychological pattern with direct, actionable design implications.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A customer at a foreign bank counter who, when a teller responds to their request with only a confused shrug and a single unexplained stamp on their form, assumes they must have filled something out wrong — rather than concluding the teller simply failed to explain what was actually needed.** A customer handing over a form and receiving nothing back but a confused-looking teller and a cryptic, unexplained stamp has no actual information about what went wrong — but rather than concluding the teller's communication failed, the customer's first, instinctive reaction is almost always to assume THEY made some kind of mistake: filled in the wrong box, brought the wrong document, misunderstood some unstated requirement. This isn't a rational conclusion drawn from evidence — there's no actual evidence pointing toward customer error specifically, since the interaction provided no real information at all — it's a well-documented, near-automatic tendency to fill an information vacuum with self-blame rather than system-blame, especially in an unfamiliar system where the customer has no strong existing model of how things are supposed to work and therefore no confident basis for concluding the SYSTEM is what failed. A vague, unhelpful software error message ('Something went wrong,' an unexplained error code) puts a user in exactly this position: given zero actual information about what happened, users overwhelmingly default to assuming they personally did something wrong, rather than correctly concluding the system failed to communicate — and this default has direct, measurable consequences for how a user responds to the error, including whether they retry, seek help, or simply give up.",
      hi: 'ek foreign bank counter pe ek customer jo, jab ek teller unke request ka response sirf ek confused shrug aur unke form pe ek single unexplained stamp se deta hai, assume karta hai ki unhone kuch galat fill kiya hoga — teller simply ye explain karne mein fail hua ye conclude karne ke bajaye ki actually kya chahiye tha. Ek customer jo ek form handover karta hai aur wapas kuch nahi paata sirf ek confused-looking teller aur ek cryptic, unexplained stamp ke alawa unke paas is baat ki actual information nahi hai ki kya galat hua — par teller ki communication fail hui ye conclude karne ke bajaye, customer ka pehla, instinctive reaction almost hamesha assume karna hota hai ki UNHONE kisi kism ki mistake ki: galat box mein fill kiya, galat document laaye, kisi unstated requirement ko misunderstand kiya. Ye evidence se drawn ek rational conclusion nahi hai — koi actual evidence nahi hai jo specifically customer error ki taraf point kare, kyunki interaction ne koi real information provide hi nahi ki — ye ek well-documented, near-automatic tendency hai ek information vacuum ko self-blame se fill karne ki system-blame ke bajaye, especially ek unfamiliar system mein jahan customer ke paas ye strong existing model nahi hai ki cheezein kaise supposed hain kaam karne ke aur isliye ye conclude karne ka koi confident basis nahi hai ki SYSTEM wo hai jo fail hua. Ek vague, unhelpful software error message (\'Something went wrong,\' ek unexplained error code) ek user ko exactly is position mein rakhta hai: is baat ki zero actual information diye jaane pe ki kya hua, users overwhelmingly default karte hain ye assume karne ke liye ki unhone personally kuch galat kiya, correctly conclude karne ke bajaye ki system communicate karne mein fail hua — aur ye default direct, measurable consequences rakhta hai is baat ke liye ki ek user error ko kaise respond karta hai, including ki kya wo retry karte hain, help seek karte hain, ya simply give up kar dete hain.',
    },

    simple: `**The core, well-documented tendency — self-blame as the default
response to an uninformative error, not a rational conclusion from
evidence:**

\`\`\`
When an error message provides little or no actual information about
what went wrong, users overwhelmingly default to assuming THEY made
a mistake, rather than correctly attributing the failure to the
system's poor communication. This isn't because users have genuine
evidence of their own error — an uninformative message provides no
evidence either way — it's a well-documented default response to
ambiguity, especially pronounced when the user lacks a strong existing
mental model of the system (a new user, an unfamiliar feature).
\`\`\`

**A concrete, checkable comparison — the SAME underlying failure,
presented in a way that either reinforces or corrects this default
self-blame tendency:**

\`\`\`tsx
// Reinforces self-blame — provides zero information, leaving the
// user to fill the vacuum with an assumption of personal error
function ErrorMessageVague() {
  return <p>Something went wrong. Please try again.</p>;
  // The user has no way to distinguish "I made a mistake" from "the
  // system failed" — in this vacuum, self-blame is the documented default
}

// Actively corrects the self-blame default by providing specific,
// attributable information about what actually happened
function ErrorMessageSpecific({ errorContext }) {
  return (
    <p>
      We couldn't reach the payment server (network timeout after 30s).
      This isn't something you did — please try again in a moment.
    </p>
  );
  // Explicitly attributes the failure to a specific system cause,
  // directly countering the default tendency to assume personal fault
}
\`\`\`

**Why this default tendency has direct, measurable behavioral
consequences — not merely a matter of a user's feelings:**

\`\`\`ts
function predictUserResponseToError(errorClarity) {
  if (errorClarity === 'vague_self_blame_inducing') {
    return {
      likelyBehaviors: ['abandons the task entirely, assuming they lack the skill/knowledge to fix "their" mistake',
                         'repeats the exact same failing action without modification, unsure what to change',
                         'avoids the feature in the future, having concluded they "aren\\'t good at this"'],
    };
  }
  return {
    likelyBehaviors: ['retries with an understanding of what actually needs to change',
                       'seeks help with specific, actionable context to share',
                       'doesn\\'t generalize the failure into a belief about their own competence'],
  };
}
\`\`\`

**Why this connects directly to Module 1's Lesson 3 (working memory
and the forgetting curve) and Module 3's Lesson 3 — a user under the
stress of an unexplained failure has REDUCED cognitive capacity to
reason it out themselves:**

\`\`\`
An uninformative error occurs precisely at the moment a user's
cognitive resources are already taxed by the failed task itself — this
is a genuinely bad moment to also demand that the user correctly
infer, with zero information, whether the fault was theirs or the
system's. This is why the burden of correct attribution belongs on
the error message's design, not on the user's own reasoning under
degraded conditions.
\`\`\`

**A concrete, checkable audit for whether an error message actively
reinforces or corrects the self-blame default — a practical review
tool:**

\`\`\`ts
function auditErrorMessageAttribution(errorMessage) {
  return {
    explicitlyStatesWhatHappened: errorMessage.describesTheActualFailureCause,
    explicitlyClearsUserOfBlameWhereApplicable: errorMessage.statesItWasNotUserErrorWhenTrue,
    risksReinforcingSelfBlame: !errorMessage.describesTheActualFailureCause,
  };
}
\`\`\`

**How this lesson opens Module 11:** having completed the cognitive-
load-focused patterns of Module 10, this module turns to a specific,
high-stakes moment in interface design: the error state. This lesson
establishes the psychological default (self-blame under ambiguity)
that makes vague error messages actively harmful, not merely
unhelpful. Lesson 2 introduces Norman's slips-vs-mistakes model as a
framework for understanding what actually went wrong; Lesson 3
assembles concrete patterns for error states that correct, rather than
reinforce, this default.`,

    simpleHi: `**Core, well-documented tendency — self-blame ek uninformative
error ke default response ki tarah, evidence se ek rational conclusion
nahi:**

\`\`\`
Jab ek error message is baare mein bahut kam ya koi actual information
provide nahi karta ki kya galat hua, users overwhelmingly default
karte hain ye assume karne ke liye ki UNHONE ek mistake ki, failure
ko system ki poor communication se correctly attribute karne ke
bajaye. Ye is wajah se nahi hai ki users ke paas apni khud ki error ka
genuine evidence hai — ek uninformative message dono tarike se koi
evidence provide nahi karta — ye ambiguity ka ek well-documented
default response hai, especially pronounced jab user ke paas system ka
ek strong existing mental model nahi hai (ek new user, ek unfamiliar
feature).
\`\`\`

**Ek concrete, checkable comparison — WAHI underlying failure, ek
tarike se present ki gayi jo ya to is default self-blame tendency ko
reinforce ya correct karti hai:**

\`\`\`tsx
// Self-blame reinforce karta hai — zero information provide karta
// hai, user ko vacuum personal error ke ek assumption se fill karne
// chhodte hue
function ErrorMessageVague() {
  return <p>Something went wrong. Please try again.</p>;
  // User ke paas "maine ek mistake ki" ko "system fail hua" se
  // distinguish karne ka koi tareeka nahi hai — is vacuum mein,
  // self-blame documented default hai
}

// Actively self-blame default ko correct karta hai specific,
// attributable information provide karke is baare mein ki actually
// kya hua
function ErrorMessageSpecific({ errorContext }) {
  return (
    <p>
      We couldn't reach the payment server (network timeout after 30s).
      This isn't something you did — please try again in a moment.
    </p>
  );
  // Explicitly failure ko ek specific system cause tak attribute
  // karta hai, directly personal fault assume karne ki default
  // tendency ko counter karte hue
}
\`\`\`

**Ye default tendency ke direct, measurable behavioral consequences
kyun hain — sirf ek user ki feelings ki matter nahi:**

\`\`\`ts
function predictUserResponseToError(errorClarity) {
  if (errorClarity === 'vague_self_blame_inducing') {
    return {
      likelyBehaviors: ['abandons the task entirely, assuming they lack the skill/knowledge to fix "their" mistake',
                         'repeats the exact same failing action without modification, unsure what to change',
                         'avoids the feature in the future, having concluded they "aren\\'t good at this"'],
    };
  }
  return {
    likelyBehaviors: ['retries with an understanding of what actually needs to change',
                       'seeks help with specific, actionable context to share',
                       'doesn\\'t generalize the failure into a belief about their own competence'],
  };
}
\`\`\`

**Ye directly Module 1 ke Lesson 3 (working memory aur forgetting
curve) aur Module 3 ke Lesson 3 se kaise connect karta hai — ek user
jo ek unexplained failure ke stress ke under hai uske paas REDUCED
cognitive capacity hai ise khud reason out karne ke liye:**

\`\`\`
Ek uninformative error exactly us moment pe hota hai jab user ke
cognitive resources already failed task khud se taxed hain — ye ek
genuinely bad moment hai user se ye bhi demand karne ke liye ki wo
correctly infer kare, zero information ke saath, ki fault unka tha ya
system ka. Yahi wajah hai correct attribution ka burden error message
ke design pe belong karta hai, degraded conditions ke under user ke
apne reasoning pe nahi.
\`\`\`

**Ek error message actively self-blame default ko reinforce karta hai
ya correct karta hai iske liye ek concrete, checkable audit — ek
practical review tool:**

\`\`\`ts
function auditErrorMessageAttribution(errorMessage) {
  return {
    explicitlyStatesWhatHappened: errorMessage.describesTheActualFailureCause,
    explicitlyClearsUserOfBlameWhereApplicable: errorMessage.statesItWasNotUserErrorWhenTrue,
    risksReinforcingSelfBlame: !errorMessage.describesTheActualFailureCause,
  };
}
\`\`\`

**Ye lesson Module 11 ko kaise open karta hai:** Module 10 ke
cognitive-load-focused patterns complete karne ke baad, ye module ek
specific, high-stakes moment ki taraf move karta hai interface design
mein: error state. Ye lesson psychological default establish karta
hai (ambiguity ke under self-blame) jo vague error messages ko actively
harmful banata hai, sirf unhelpful nahi. Lesson 2 Norman ka
slips-vs-mistakes model introduce karta hai ek framework ki tarah ye
samajhne ke liye ki actually kya galat hua; Lesson 3 concrete patterns
assemble karta hai un error states ke liye jo is default ko correct
karte hain, reinforce karne ke bajaye.`,

    content: `## Why self-blame under ambiguity is a well-documented default
response, not a rational conclusion drawn from actual evidence

When an error provides little or no genuine information about what
actually went wrong, a user has no real evidence pointing specifically
toward their own error rather than the system's failure — an
uninformative message is, by definition, uninformative about which
party is actually at fault. Despite this absence of evidence, users
overwhelmingly default to self-blame rather than system-blame,
especially when they lack a strong existing mental model of the system
that would give them confidence the failure originated externally.
This default is well-documented across usability research and matters
because it's not a neutral or harmless assumption — it directly shapes
what the user does next.

## Why this default tendency has direct, measurable behavioral
consequences rather than being merely a matter of user sentiment

A user who concludes "I made a mistake" from a vague error typically
responds differently than one who correctly concludes "the system
failed": the self-blaming user is more likely to abandon the task
entirely (assuming they lack the skill to fix what they believe is
their own error), repeat the identical failing action without knowing
what to change, or avoid the feature in the future having drawn a
broader, incorrect conclusion about their own competence. A
system-blaming user, correctly informed, is more likely to retry with
an actual understanding of what needs to change, or seek help with
specific, useful context. This is why error-message clarity has direct
product consequences (task completion, feature adoption, support
burden), not just an abstract effect on how a user feels.

## Why this connects to Module 1's finding that stress and reduced
cognitive resources compound the problem

An error occurs precisely at the moment a user's task has already
failed — a moment when their attention and cognitive resources are
already engaged with (and frustrated by) the failed task itself. Asking
that same user, under this cognitive load, to correctly infer with
zero information whether a failure was their fault or the system's is
asking for accurate reasoning under precisely the conditions least
suited to it. This is why the responsibility for correct attribution
belongs in the error message's design rather than the user's own
in-the-moment reasoning — the system has complete information about
what actually failed, while the user, especially under this cognitive
load, has none.

## Why a specific, checkable pattern (stating what happened, and
explicitly clearing the user of blame when applicable) directly
counters the default

An error message that explicitly describes the actual failure cause
(a network timeout, a server error, a specific validation failure)
gives the user real information to replace the vacuum that would
otherwise default to self-blame. Explicitly stating that a failure
wasn't the user's fault, when that's actually true, goes further —
directly countering the default assumption rather than merely
providing neutral information the user must still interpret
correctly on their own, especially difficult under the cognitive load
this lesson has established accompanies any error state.

## How this lesson opens Module 11

Having completed Module 10's cognitive-load-focused interface patterns,
this module turns to a specific, high-stakes interface moment: the
error state. This lesson establishes why vague errors are actively
harmful, not merely unhelpful, by identifying the specific
psychological default they trigger. Lesson 2 introduces Norman's
slips-vs-mistakes model as a framework for correctly understanding
what actually failed, which is a prerequisite for supplying the
specific, accurate information this lesson establishes is needed.
Lesson 3 assembles concrete error-state design patterns that put both
lessons into practice.`,

    contentHi: `## Ambiguity ke under self-blame ek well-documented default response kyun hai, actual evidence se drawn ek rational conclusion nahi

Jab ek error is baare mein bahut kam ya koi genuine information
provide nahi karta ki actually kya galat hua, ek user ke paas koi real
evidence nahi hai jo specifically unki apni error ki taraf point kare
system ki failure ke bajaye — ek uninformative message, definition se,
uninformative hai is baat ke baare mein ki actually kaunsi party fault
mein hai. Evidence ki is absence ke bawajood, users overwhelmingly
self-blame ki taraf default karte hain system-blame ke bajaye,
especially jab unke paas system ka ek strong existing mental model
nahi hota jo unhe confidence deta ki failure externally originate hui.
Ye default usability research ke across well-documented hai aur matter
karta hai kyunki ye ek neutral ya harmless assumption nahi hai — ye
directly shape karta hai ki user aage kya karta hai.

## Ye default tendency ke direct, measurable behavioral consequences kyun hain sirf user sentiment ki matter hone ke bajaye

Ek user jo ek vague error se "maine ek mistake ki" conclude karta hai
typically differently respond karta hai ek se jo correctly conclude
karta hai "system fail hua": self-blaming user zyada likely hai task
ko poori tarah abandon karne ke liye (assume karte hue ki unke paas
wo skill nahi hai jo wo believe karte hain unki apni error ko fix
karne ke liye), identical failing action ko repeat karne ke liye kya
badalna hai jaane bina, ya feature ko future mein avoid karne ke liye
apni khud ki competence ke baare mein ek broader, incorrect conclusion
draw karte hue. Ek system-blaming user, correctly informed, zyada
likely hai retry karne ke liye ek actual understanding ke saath ki kya
badalna chahiye, ya specific, useful context ke saath help seek karne
ke liye. Yahi wajah hai error-message clarity ke direct product
consequences hain (task completion, feature adoption, support burden),
sirf ek abstract effect nahi is baat pe ki ek user kaisa feel karta
hai.

## Ye Module 1 ki finding se kaise connect karta hai ki stress aur reduced cognitive resources problem ko compound karte hain

Ek error exactly us moment pe occur hota hai jab user ka task already
fail ho chuka hai — ek moment jab unka attention aur cognitive
resources already failed task khud se engaged hain (aur frustrated).
Wahi user se, is cognitive load ke under, correctly infer karne ke
liye poochna zero information ke saath ki kya ek failure unki fault
thi ya system ki accurate reasoning ke liye poochna hai exactly un
conditions ke under jo iske liye least suited hain. Yahi wajah hai
correct attribution ki responsibility error message ke design mein
belong karti hai, user ke apne in-the-moment reasoning mein nahi —
system ke paas complete information hai is baare mein ki actually kya
fail hua, jabki user, especially is cognitive load ke under, ke paas
kuch nahi hai.

## Ek specific, checkable pattern (kya hua batana, aur applicable hone
pe explicitly user ko blame se clear karna) default ko directly kyun
counter karta hai

Ek error message jo explicitly actual failure cause describe karta hai
(ek network timeout, ek server error, ek specific validation failure)
user ko real information deta hai us vacuum ko replace karne ke liye
jo otherwise self-blame ki taraf default karega. Explicitly ye kehna
ki ek failure user ki fault nahi thi, jab ye actually true hai, aur
aage jaata hai — directly default assumption ko counter karte hue sirf
neutral information provide karne ke bajaye jise user ko abhi bhi apne
khud correctly interpret karna chahiye, especially difficult us
cognitive load ke under jise ye lesson establish kar chuka hai kisi
bhi error state ke saath aati hai.

## Ye lesson Module 11 ko kaise open karta hai

Module 10 ke cognitive-load-focused interface patterns complete karne
ke baad, ye module ek specific, high-stakes interface moment ki taraf
move karta hai: error state. Ye lesson establish karta hai ki vague
errors actively harmful kyun hain, sirf unhelpful nahi, us specific
psychological default ko identify karke jise wo trigger karte hain.
Lesson 2 Norman ka slips-vs-mistakes model introduce karta hai ek
framework ki tarah correctly ye samajhne ke liye ki actually kya fail
hua, jo us specific, accurate information supply karne ke liye ek
prerequisite hai jise ye lesson establish karta hai zaroori hai.
Lesson 3 concrete error-state design patterns assemble karta hai jo
dono lessons ko practice mein daalte hain.`,

    examples: [
      {
        title: 'An error-attribution audit and a rewritten error component that corrects the self-blame default',
        titleHi: 'Ek error-attribution audit aur ek rewritten error component jo self-blame default ko correct karta hai',
        codeJs: `function auditErrorMessageAttribution(message) {
  return {
    describesActualCause: message.explainsWhatSpecificallyFailed,
    clearsUserOfBlameWhenApplicable: message.explicitlyStatesNotUserFault,
    risksReinforcingSelfBlame: !message.explainsWhatSpecificallyFailed,
  };
}

// A vague, self-blame-inducing error
const vagueError = { explainsWhatSpecificallyFailed: false, explicitlyStatesNotUserFault: false };
console.log(auditErrorMessageAttribution(vagueError));
// { describesActualCause: false, clearsUserOfBlameWhenApplicable: false, risksReinforcingSelfBlame: true }

function PaymentErrorCorrected({ timeoutSeconds }) {
  return (
    <div className="error-state">
      <p>We couldn't reach the payment server (timed out after {timeoutSeconds}s).</p>
      <p>This wasn't something you did wrong — please try again in a moment.</p>
      <button onClick={retryPayment}>Try again</button>
    </div>
  );
}`,
        codeTs: `interface ErrorMessageProfile {
  explainsWhatSpecificallyFailed: boolean;
  explicitlyStatesNotUserFault: boolean;
}

function auditErrorMessageAttribution(message: ErrorMessageProfile) {
  return {
    describesActualCause: message.explainsWhatSpecificallyFailed,
    clearsUserOfBlameWhenApplicable: message.explicitlyStatesNotUserFault,
    risksReinforcingSelfBlame: !message.explainsWhatSpecificallyFailed,
  };
}

// A vague, self-blame-inducing error
const vagueError: ErrorMessageProfile = { explainsWhatSpecificallyFailed: false, explicitlyStatesNotUserFault: false };
console.log(auditErrorMessageAttribution(vagueError));
// { describesActualCause: false, clearsUserOfBlameWhenApplicable: false, risksReinforcingSelfBlame: true }

function PaymentErrorCorrected({ timeoutSeconds }: { timeoutSeconds: number }) {
  return (
    <div className="error-state">
      <p>We couldn't reach the payment server (timed out after {timeoutSeconds}s).</p>
      <p>This wasn't something you did wrong — please try again in a moment.</p>
      <button onClick={retryPayment}>Try again</button>
    </div>
  );
}`,
        code: `<p>We couldn't reach the payment server (timed out after {timeoutSeconds}s).</p>
<p>This wasn't something you did wrong — please try again in a moment.</p>
// explicitly attributes the cause AND clears the user of blame`,
        output:
          "The audit flags the vague error as risking self-blame reinforcement, while the corrected component explicitly names the actual system-side cause and directly states the failure wasn't the user's fault — giving the user real information to replace what would otherwise default to a self-blaming assumption.",
        explain:
          "This example operationalizes the lesson's core finding directly: rather than leaving attribution ambiguous, the corrected message actively supplies the two specific pieces of information (what happened, and that it wasn't the user's fault) this lesson establishes as necessary to counter the well-documented self-blame default.",
        explainHi:
          "Ye example lesson ki core finding ko directly operationalize karta hai: attribution ko ambiguous chhodne ke bajaye, corrected message actively do specific pieces of information supply karta hai (kya hua, aur ki ye user ki fault nahi thi) jise ye lesson necessary establish karta hai us well-documented self-blame default ko counter karne ke liye.",
      },
    ],

    mistakes: [
      {
        wrong: `// A generic, uninformative error that leaves attribution entirely
// ambiguous, triggering the default self-blame response
function GenericErrorWrong() {
  return <p>An error occurred.</p>;
  // Zero information about what happened or who/what is responsible
  // — the user is left to fill this vacuum, and the documented
  // default is self-blame
}`,
        right: `// A specific error that removes the attribution ambiguity entirely
function SpecificErrorRight({ failedStep, isUserFault }) {
  return (
    <div>
      <p>{\`We couldn't complete \${failedStep} due to a temporary server issue.\`}</p>
      {!isUserFault && <p>This wasn't caused by anything you did.</p>}
    </div>
  );
}`,
        why: "A generic error message provides zero information about what actually happened, leaving the user to fill that vacuum — and the well-documented default is to assume personal fault rather than system fault, even though the message provides no actual evidence supporting either conclusion.",
        whyHi:
          "Ek generic error message is baare mein zero information provide karta hai ki actually kya hua, user ko wo vacuum fill karne ke liye chhodte hue — aur well-documented default personal fault assume karna hai system fault ke bajaye, chahe message koi actual evidence provide nahi karta jo kisi bhi conclusion ko support kare.",
      },
    ],

    realWorld: [
      {
        en: "A production fintech app's support ticket volume for a specific payment failure dropped measurably after the team replaced a generic 'Transaction failed' message with a specific explanation of the actual server-side cause and an explicit statement that the failure wasn't the user's fault — user research afterward confirmed fewer users had concluded they'd 'done something wrong' with their card details.",
        hi: 'Ek production fintech app ki support ticket volume ek specific payment failure ke liye measurably kam hui team ke ek generic \'Transaction failed\' message ko actual server-side cause ke ek specific explanation aur ek explicit statement se replace karne ke baad ki failure user ki fault nahi thi — baad mein user research ne confirm kiya ki kam users ne conclude kiya tha ki unhone apne card details ke saath \'kuch galat kiya.\'',
      },
    ],

    interviewQA: [
      {
        q: 'Why do users default to self-blame when encountering a vague, uninformative error message?',
        qHi: 'Users ek vague, uninformative error message encounter karte waqt self-blame ki taraf kyun default karte hain?',
        a: "This is a well-documented tendency to fill an information vacuum with self-blame rather than system-blame, especially pronounced when the user lacks a strong existing mental model of the system. It isn't a rational conclusion from evidence — an uninformative message provides no actual evidence pointing toward user error specifically — it's the well-documented default response to ambiguity.",
        aHi: 'Ye ek well-documented tendency hai ek information vacuum ko self-blame se fill karne ki system-blame ke bajaye, especially pronounced jab user ke paas system ka ek strong existing mental model nahi hota. Ye evidence se ek rational conclusion nahi hai — ek uninformative message koi actual evidence provide nahi karta jo specifically user error ki taraf point kare — ye ambiguity ka well-documented default response hai.',
      },
      {
        q: "What are the two specific pieces of information an error message should provide to counter the self-blame default?",
        qHi: 'Wo do specific pieces of information kya hain jo ek error message ko self-blame default ko counter karne ke liye provide karni chahiye?',
        a: "First, a description of the actual failure cause (what specifically went wrong), replacing the vacuum a user would otherwise fill with self-blame. Second, when applicable, an explicit statement that the failure wasn't the user's fault — going further than merely providing neutral information the user must still interpret correctly under the cognitive load an error state creates.",
        aHi: 'Pehla, actual failure cause ka ek description (specifically kya galat hua), us vacuum ko replace karte hue jise ek user otherwise self-blame se fill karega. Doosra, jab applicable ho, ek explicit statement ki failure user ki fault nahi thi — sirf neutral information provide karne se aage jaate hue jise user ko abhi bhi ek error state create karne wale cognitive load ke under correctly interpret karna chahiye.',
      },
    ],

    exercises: [
      {
        task: "A file-upload feature shows the message 'Upload failed' with no further detail whenever the uploaded file exceeds a size limit the user was never told about. Using this lesson's framework, predict what a typical user will likely conclude about the cause of this failure, and propose a specific rewrite that corrects this.",
        taskHi: 'Ek file-upload feature \'Upload failed\' message dikhata hai koi further detail ke bina jab bhi uploaded file ek size limit exceed karti hai jise user ko kabhi nahi bataya gaya. Is lesson ke framework use karke, predict karo ki ek typical user is failure ke cause ke baare mein kya conclude karega, aur ek specific rewrite propose karo jo ise correct kare.',
        hint: "Think about what information the user actually has access to at the moment of failure, and whether that information would lead them to correctly identify the file size as the cause, or default to a vaguer, self-directed assumption.",
        hintHi: 'Socho ki failure ke moment pe user ke paas actually kaunsi information ka access hai, aur kya wo information unhe correctly file size ko cause ki tarah identify karne ki taraf le jaayegi, ya ek vaguer, self-directed assumption ki taraf default karayegi.',
      },
    ],

    keyTakeaways: [
      "Users overwhelmingly default to self-blame when an error provides little or no real information — a well-documented response to ambiguity, not a rational conclusion drawn from actual evidence.",
      "This default has direct, measurable behavioral consequences: self-blaming users are more likely to abandon tasks, repeat failing actions unmodified, or avoid a feature entirely — not just an abstract effect on sentiment.",
      "An error occurs exactly when a user's cognitive resources are already taxed by the failed task, making correct self-attribution especially difficult — the burden belongs on the error message's design, not the user's in-the-moment reasoning.",
      "A specific, checkable fix — describing the actual failure cause and explicitly clearing the user of blame when applicable — directly counters the self-blame default rather than merely providing neutral, still-ambiguous information.",
    ],
    keyTakeawaysHi: [
      'Users overwhelmingly self-blame ki taraf default karte hain jab ek error is baare mein bahut kam ya koi real information provide nahi karta — ambiguity ka ek well-documented response, actual evidence se drawn ek rational conclusion nahi.',
      'Is default ke direct, measurable behavioral consequences hain: self-blaming users zyada likely hain tasks abandon karne ke liye, failing actions ko unmodified repeat karne ke liye, ya ek feature ko poori tarah avoid karne ke liye — sirf sentiment pe ek abstract effect nahi.',
      "Ek error exactly tab occur hoti hai jab user ke cognitive resources already failed task se taxed hain, correct self-attribution ko especially difficult banate hue — burden error message ke design pe belong karta hai, user ke in-the-moment reasoning pe nahi.",
      'Ek specific, checkable fix — actual failure cause describe karna aur applicable hone pe explicitly user ko blame se clear karna — directly self-blame default ko counter karta hai sirf neutral, abhi bhi ambiguous information provide karne ke bajaye.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'psych-normans-slips-vs-mistakes',
    title: "Norman's Slips-vs-Mistakes Model",
    titleHi: "Norman's Slips-Vs-Mistakes Model",
    description:
      "Don Norman's foundational distinction between two genuinely different error types — slips (the right intention, executed wrong) and mistakes (the wrong intention entirely) — each requiring a fundamentally different design fix, not one generic 'error handling' approach.",
    descriptionHi:
      'Don Norman ki foundational distinction do genuinely different error types ke beech — slips (right intention, wrong execute kiya gaya) aur mistakes (poori tarah wrong intention) — har ek ko ek fundamentally different design fix chahiye, ek generic "error handling" approach nahi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A skilled pianist who intends to play the correct note but hits the adjacent key by a small physical misjudgment, versus a pianist who confidently and deliberately plays an entirely wrong chord because they genuinely misread the sheet music.** A skilled pianist who knows exactly which note comes next and intends to play it correctly, but whose finger lands one key over due to a small physical misjudgment, has made a fundamentally different kind of error than a pianist who confidently plays an entirely different, wrong chord because they misread the sheet music and genuinely believed that wrong chord was correct. The first pianist's underlying plan was entirely correct — the failure was purely in execution, a slip — and the fix is almost always about the physical interface itself: better key spacing, more practice building muscle memory, clearer tactile feedback distinguishing adjacent keys. The second pianist's execution was flawless — they played exactly what they intended to play — but the underlying plan itself was wrong, a genuine mistake in understanding, and the fix is entirely different: clearer sheet music, better music theory understanding, a different way of teaching how to read the specific passage that was misunderstood. Treating both errors with the same generic fix — telling both pianists to simply \"be more careful\" — addresses neither problem correctly, because a physical practice drill doesn't fix a misunderstanding of the music theory, and a music theory lesson doesn't improve finger precision. Don Norman's slips-vs-mistakes distinction identifies exactly this same split for any error, in any domain: a slip is a correct plan executed incorrectly, calling for interface-level fixes; a mistake is an incorrect plan executed exactly as intended, calling for fixes to the user's actual understanding — and confusing the two, or applying one generic fix to both, solves neither.",
      hi: 'ek skilled pianist jo correct note play karne ka intend karta hai par ek small physical misjudgment ki wajah se adjacent key hit kar deta hai, versus ek pianist jo confidently aur deliberately ek poori tarah wrong chord play karta hai kyunki wo genuinely sheet music misread karta hai. Ek skilled pianist jo exactly jaanta hai ki agla kaunsa note aata hai aur ise correctly play karne ka intend karta hai, par jiski finger ek key over land karti hai ek small physical misjudgment ki wajah se, ek fundamentally different kism ki error ki hai us pianist se jo confidently ek poori tarah alag, wrong chord play karta hai kyunki wo sheet music misread karta hai aur genuinely believe karta hai ki wo wrong chord correct thi. Pehle pianist ka underlying plan poori tarah correct tha — failure purely execution mein thi, ek slip — aur fix almost hamesha physical interface khud ke baare mein hai: better key spacing, zyada practice muscle memory build karna, adjacent keys ko distinguish karti clearer tactile feedback. Doosre pianist ka execution flawless tha — unhone exactly wo play kiya jo unhone intend kiya — par underlying plan khud galat tha, understanding mein ek genuine mistake, aur fix poori tarah different hai: clearer sheet music, better music theory understanding, us specific passage ko padhna sikhane ka ek different tareeka jise misunderstand kiya gaya tha. Dono errors ko wahi generic fix se treat karna — dono pianists ko simply "zyada careful raho" kehna — kisi bhi problem ko correctly address nahi karta, kyunki ek physical practice drill music theory ki ek misunderstanding fix nahi karti, aur ek music theory lesson finger precision improve nahi karta. Don Norman ki slips-vs-mistakes distinction kisi bhi error ke liye exactly ye wahi split identify karti hai, kisi bhi domain mein: ek slip ek correct plan hai jo incorrectly executed hai, interface-level fixes ke liye call karte hue; ek mistake ek incorrect plan hai jo exactly intended ki tarah executed hai, user ki actual understanding mein fixes ke liye call karte hue — aur do ko confuse karna, ya dono pe ek generic fix apply karna, kisi ko bhi solve nahi karta.',
    },

    simple: `**Don Norman's foundational two-category error model — genuinely
different failure types requiring genuinely different fixes:**

\`\`\`
SLIP — the user's underlying intention/plan was CORRECT, but execution
  failed (a typo, clicking the wrong adjacent button, a physical
  misjudgment). The fix targets the INTERFACE: better spacing, clearer
  visual distinction, confirmation for high-consequence actions.

MISTAKE — the user's underlying intention/plan was itself WRONG
  (a genuine misunderstanding of what the system does or what's
  needed). The fix targets UNDERSTANDING: clearer labeling, better
  onboarding, more accurate expectations set by the interface.

The SAME visible error ("clicked the wrong thing") can be either a
slip or a mistake depending on WHY it happened — and the correct fix
is completely different depending on which one it actually was.
\`\`\`

**A concrete, checkable diagnostic for classifying a specific error as
a slip or a mistake — a practical analysis tool:**

\`\`\`ts
function classifyError(errorContext) {
  if (errorContext.userKnewWhatTheyIntendedToDo && errorContext.executionDidNotMatchIntention) {
    return { type: 'slip', fixTarget: 'interface execution — spacing, confirmation, undo' };
  }
  if (errorContext.userExecutedExactlyWhatTheyIntended && errorContext.intentionWasBasedOnIncorrectUnderstanding) {
    return { type: 'mistake', fixTarget: 'user understanding — labeling, onboarding, expectation-setting' };
  }
  return { type: 'unclear', fixTarget: 'investigate further before designing a fix' };
}
\`\`\`

**A concrete example of the SAME visible symptom — an accidental
account deletion — being either a slip or a mistake, with genuinely
different correct fixes for each:**

\`\`\`tsx
// If this was a SLIP (user meant to click "Deactivate," clicked the
// adjacent "Delete" by mistake) — the fix is an interface change
function AccountActionsSlipFix() {
  return (
    <div>
      <button className="safe-action">Deactivate Account</button>
      <div className="visual-separator-and-spacing" />
      <button className="danger-action" onClick={confirmBeforeDelete}>
        Delete Account Permanently
      </button>
      {/* Clearer visual/spatial separation between a low-consequence
          and high-consequence action, plus a confirmation step —
          fixes the EXECUTION problem */}
    </div>
  );
}

// If this was a MISTAKE (user genuinely believed "Delete Account"
// only removed their profile photo, not their whole account) — the
// fix is clearer labeling/understanding, not spacing
function AccountActionsMistakeFix() {
  return (
    <button className="danger-action">
      Delete Account Permanently (removes all your data, cannot be undone)
    </button>
    /* Clarifies what the action ACTUALLY does — fixes the
       UNDERSTANDING problem, which spacing alone would not address */
  );
}
\`\`\`

**Why misdiagnosing a mistake as a slip (or vice versa) produces a
fix that doesn't actually solve the problem — a concrete, checkable
failure mode:**

\`\`\`ts
function diagnoseFixMismatch(actualErrorType, appliedFix) {
  const fixTargetsExecution = appliedFix.type === 'spacing_or_confirmation';
  const fixTargetsUnderstanding = appliedFix.type === 'labeling_or_onboarding';

  if (actualErrorType === 'mistake' && fixTargetsExecution) {
    return 'MISMATCH: adding a confirmation dialog does not fix a genuine misunderstanding of what the action does — the user will still misunderstand and confirm anyway';
  }
  if (actualErrorType === 'slip' && fixTargetsUnderstanding) {
    return 'MISMATCH: better labeling does not fix a physical misclick — the user already understood correctly, they just executed incorrectly';
  }
  return 'MATCH: fix targets the actual error type';
}
\`\`\`

**Why this connects directly to Lesson 1's attribution problem — a
slip and a mistake produce genuinely different appropriate
attributions, which a good error message should reflect:**

\`\`\`
A genuine slip is closer to "the interface made this easy to do by
accident" — legitimately closer to a system-design responsibility than
a user failing. A genuine mistake is closer to "the system didn't
successfully communicate what this does" — also, correctly, closer to
a system-design responsibility rather than user failing, since the
system's labeling or onboarding didn't set accurate expectations. In
BOTH cases, correctly diagnosed, the appropriate attribution leans
toward the system's design — directly supporting Lesson 1's finding
that self-blame is usually the wrong default response, now with a
specific diagnostic for understanding exactly why.
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established that
users default to self-blame under ambiguity and that this default is
usually wrong. This lesson supplies the specific diagnostic framework
for understanding WHY a given error happened — slip or mistake — which
is the necessary prerequisite for Lesson 3's concrete error-design
patterns, since a slip and a mistake require genuinely different
fixes, not one generic "better error message" approach.`,

    simpleHi: `**Don Norman ka foundational two-category error model — genuinely
different failure types jinhe genuinely different fixes chahiye:**

\`\`\`
SLIP — user ka underlying intention/plan CORRECT tha, par execution
  fail hui (ek typo, galat adjacent button click karna, ek physical
  misjudgment). Fix INTERFACE ko target karta hai: better spacing,
  clearer visual distinction, high-consequence actions ke liye
  confirmation.

MISTAKE — user ka underlying intention/plan khud WRONG tha (system
  kya karta hai ya kya chahiye iski ek genuine misunderstanding). Fix
  UNDERSTANDING ko target karta hai: clearer labeling, better
  onboarding, interface dwara set kiye gaye zyada accurate
  expectations.

WAHI visible error ("galat cheez click ki") ya to ek slip ya ek
mistake ho sakti hai is baat pe depend karte hue ki YE KYUN hui — aur
correct fix poori tarah different hai is baat pe depend karte hue ki
ye actually kya thi.
\`\`\`

**Ek specific error ko slip ya mistake ki tarah classify karne ka ek
concrete, checkable diagnostic — ek practical analysis tool:**

\`\`\`ts
function classifyError(errorContext) {
  if (errorContext.userKnewWhatTheyIntendedToDo && errorContext.executionDidNotMatchIntention) {
    return { type: 'slip', fixTarget: 'interface execution — spacing, confirmation, undo' };
  }
  if (errorContext.userExecutedExactlyWhatTheyIntended && errorContext.intentionWasBasedOnIncorrectUnderstanding) {
    return { type: 'mistake', fixTarget: 'user understanding — labeling, onboarding, expectation-setting' };
  }
  return { type: 'unclear', fixTarget: 'investigate further before designing a fix' };
}
\`\`\`

**WAHI visible symptom ka ek concrete example — ek accidental account
deletion — ya to ek slip ya ek mistake hona, har ek ke liye genuinely
different correct fixes ke saath:**

\`\`\`tsx
// Agar ye ek SLIP tha (user "Deactivate" click karna chahta tha,
// mistake se adjacent "Delete" click kiya) — fix ek interface change hai
function AccountActionsSlipFix() {
  return (
    <div>
      <button className="safe-action">Deactivate Account</button>
      <div className="visual-separator-and-spacing" />
      <button className="danger-action" onClick={confirmBeforeDelete}>
        Delete Account Permanently
      </button>
      {/* Ek low-consequence aur high-consequence action ke beech
          clearer visual/spatial separation, plus ek confirmation step
          — EXECUTION problem fix karta hai */}
    </div>
  );
}

// Agar ye ek MISTAKE tha (user genuinely believe karta tha "Delete
// Account" sirf unki profile photo remove karega, poora account
// nahi) — fix clearer labeling/understanding hai, spacing nahi
function AccountActionsMistakeFix() {
  return (
    <button className="danger-action">
      Delete Account Permanently (removes all your data, cannot be undone)
    </button>
    /* Clarify karta hai action ACTUALLY kya karta hai — UNDERSTANDING
       problem fix karta hai, jise akeli spacing address nahi karegi */
  );
}
\`\`\`

**Ek mistake ko slip ki tarah misdiagnose karna (ya vice versa) ek fix
produce kyun karta hai jo actually problem solve nahi karta — ek
concrete, checkable failure mode:**

\`\`\`ts
function diagnoseFixMismatch(actualErrorType, appliedFix) {
  const fixTargetsExecution = appliedFix.type === 'spacing_or_confirmation';
  const fixTargetsUnderstanding = appliedFix.type === 'labeling_or_onboarding';

  if (actualErrorType === 'mistake' && fixTargetsExecution) {
    return 'MISMATCH: adding a confirmation dialog does not fix a genuine misunderstanding of what the action does — the user will still misunderstand and confirm anyway';
  }
  if (actualErrorType === 'slip' && fixTargetsUnderstanding) {
    return 'MISMATCH: better labeling does not fix a physical misclick — the user already understood correctly, they just executed incorrectly';
  }
  return 'MATCH: fix targets the actual error type';
}
\`\`\`

**Ye directly Lesson 1 ke attribution problem se kaise connect karta
hai — ek slip aur ek mistake genuinely different appropriate
attributions produce karte hain, jise ek achha error message reflect
karna chahiye:**

\`\`\`
Ek genuine slip "interface ne ise accident se karna easy bana diya"
ke kaafi close hai — legitimately ek system-design responsibility ke
zyada close ek user failing se. Ek genuine mistake "system ne
successfully communicate nahi kiya ki ye kya karta hai" ke kaafi close
hai — bhi, correctly, ek system-design responsibility ke zyada close
user failing se, kyunki system ki labeling ya onboarding ne accurate
expectations set nahi kiye. DONO cases mein, correctly diagnosed,
appropriate attribution system ke design ki taraf lean karta hai —
directly Lesson 1 ki finding ko support karte hue ki self-blame
usually galat default response hai, ab exactly kyun ye samajhne ke
liye ek specific diagnostic ke saath.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne establish
kiya ki users ambiguity ke under self-blame ki taraf default karte
hain aur ye default usually galat hai. Ye lesson specific diagnostic
framework supply karta hai ye samajhne ke liye ki KYUN ek given error
hui — slip ya mistake — jo Lesson 3 ke concrete error-design patterns
ke liye necessary prerequisite hai, kyunki ek slip aur ek mistake ko
genuinely different fixes chahiye, ek generic "better error message"
approach nahi.`,

    content: `## Why Norman's distinction identifies two genuinely different
error mechanisms, not two labels for the same phenomenon

A slip occurs when a user's underlying plan or intention was correct
but its execution failed — a typo, a misclick on an adjacent element,
a physical action that didn't match the actual intention. A mistake
occurs when execution matched intention exactly, but the underlying
intention itself was based on an incorrect understanding of what the
system does or requires. These are mechanistically distinct failures
occurring at different points in the action sequence — a slip is a
plan-to-execution failure, a mistake is a
understanding-to-plan failure — which is precisely why they require
different fixes rather than one generic "reduce errors" approach.

## Why the correct fix for a slip targets the interface's execution
surface, while the correct fix for a mistake targets understanding

Since a slip means the user's plan was already correct, fixing it
means making correct execution easier and incorrect execution harder:
better spacing between elements with different consequences,
confirmation steps for high-consequence actions, clearer visual and
tactile distinction between similar-looking controls. Since a mistake
means the plan itself was wrong due to a misunderstanding, fixing it
means correcting that misunderstanding: clearer labeling that
accurately describes what an action does, better onboarding that sets
accurate expectations, interface language that doesn't imply
something different from what actually happens. Applying a slip-fix
(confirmation dialog) to a genuine mistake doesn't help, since a user
who fundamentally misunderstands what an action does will simply
confirm their mistaken action anyway — and applying a mistake-fix
(better labeling) to a genuine slip doesn't help either, since the
user already understood correctly and the problem was purely physical
execution.

## Why the same visible symptom can be either error type, making
correct diagnosis a necessary first step

An accidental account deletion could be a slip (the user meant to
click a nearby, lower-consequence button and missed) or a mistake
(the user genuinely believed "delete account" meant something less
severe than it actually does) — the visible outcome is identical, but
the underlying cause, and therefore the correct fix, is completely
different. This is why designing an error-prevention fix requires
first diagnosing which category a specific error actually falls into,
rather than assuming a fix that worked for one type will automatically
help with the other.

## Why correctly diagnosing slips and mistakes both tend to implicate
system design over user failing, connecting directly to Lesson 1

A genuine slip reflects an interface that made an easy execution
mistake possible — arguably a design responsibility more than a user
failing. A genuine mistake reflects an interface that failed to
communicate accurately what an action does — also a design
responsibility, since accurate labeling and expectation-setting are
the system's job. This means that once an error is correctly diagnosed
as either a slip or a mistake, the appropriate attribution in both
cases tends to point toward system design rather than user failing —
directly supporting Lesson 1's finding that self-blame is usually the
wrong default, now with a specific mechanism for understanding exactly
why in each case.

## How this lesson sets up Lesson 3

Lesson 1 established why vague errors trigger harmful, usually
incorrect self-blame. This lesson supplies the specific diagnostic
needed to understand what actually happened in a given error — slip or
mistake — which is the necessary prerequisite for designing an
accurate fix. Lesson 3 assembles concrete error-state design patterns
that put both lessons into practice: clear, non-blaming attribution
(Lesson 1) combined with fixes correctly targeted at either execution
or understanding, depending on the specific error type this lesson's
diagnostic identifies.`,

    contentHi: `## Norman ki distinction do genuinely different error mechanisms identify kyun karti hai, wahi phenomenon ke liye do labels nahi

Ek slip tab hoti hai jab ek user ka underlying plan ya intention
correct tha par uska execution fail hua — ek typo, ek adjacent element
pe ek misclick, ek physical action jo actual intention se match nahi
hui. Ek mistake tab hoti hai jab execution intention se exactly match
hua, par underlying intention khud system kya karta hai ya kya chahiye
iski ek incorrect understanding pe based thi. Ye mechanistically
distinct failures hain jo action sequence mein different points pe
occur hoti hain — ek slip ek plan-to-execution failure hai, ek mistake
ek understanding-to-plan failure hai — yahi exactly wajah hai unhe
different fixes chahiye ek generic "errors kam karo" approach ke
bajaye.

## Ek slip ke liye correct fix interface ki execution surface ko kyun target karta hai, jabki ek mistake ke liye correct fix understanding ko target karta hai

Kyunki ek slip ka matlab hai user ka plan already correct tha, ise fix
karne ka matlab hai correct execution ko aasan banana aur incorrect
execution ko harder banana: different consequences wale elements ke
beech better spacing, high-consequence actions ke liye confirmation
steps, similar-looking controls ke beech clearer visual aur tactile
distinction. Kyunki ek mistake ka matlab hai plan khud ek
misunderstanding ki wajah se galat tha, ise fix karne ka matlab hai us
misunderstanding ko correct karna: clearer labeling jo accurately
describe karti hai ek action kya karta hai, better onboarding jo
accurate expectations set karta hai, interface language jo kuch aisa
imply nahi karti jo actually hota hai us se different ho. Ek
genuine mistake pe ek slip-fix (confirmation dialog) apply karna help
nahi karta, kyunki ek user jo fundamentally misunderstand karta hai ki
ek action kya karta hai simply apni mistaken action ko confirm kar
dega vaise bhi — aur ek genuine slip pe ek mistake-fix (better
labeling) apply karna bhi help nahi karta, kyunki user already
correctly samjhta tha aur problem purely physical execution thi.

## Wahi visible symptom ya to error type ho sakta hai kyun, correct diagnosis ko ek necessary first step banate hue

Ek accidental account deletion ek slip ho sakta hai (user ek nearby,
lower-consequence button click karna chahta tha aur miss kar diya) ya
ek mistake (user genuinely believe karta tha "delete account" ka
matlab kuch less severe hai us se jo ye actually karta hai) — visible
outcome identical hai, par underlying cause, aur isliye correct fix,
poori tarah different hai. Yahi wajah hai ek error-prevention fix
design karne ke liye pehle diagnose karna chahiye ki ek specific error
actually kaunsi category mein aata hai, ye assume karne ke bajaye ki
ek fix jo ek type ke liye kaam kiya automatically doosre ke saath help
karega.

## Slips aur mistakes ko correctly diagnose karna dono kyun typically system design ko implicate karte hain user failing pe, directly Lesson 1 se connect karte hue

Ek genuine slip ek interface reflect karti hai jisne ek aasan execution
mistake possible banayi — arguably ek design responsibility zyada ek
user failing se. Ek genuine mistake ek interface reflect karti hai jo
accurately communicate karne mein fail hui ki ek action kya karta hai
— bhi ek design responsibility, kyunki accurate labeling aur
expectation-setting system ka kaam hai. Iska matlab hai ek baar ek
error correctly ya to slip ya mistake ki tarah diagnose ho jaaye,
dono cases mein appropriate attribution system design ki taraf point
karne ki tendency rakhti hai user failing ke bajaye — directly Lesson
1 ki finding ko support karte hue ki self-blame usually galat default
hai, ab ek specific mechanism ke saath exactly ye samajhne ke liye ki
har case mein kyun.

## Ye lesson Lesson 3 ko kaise set up karta hai

Lesson 1 ne establish kiya ki vague errors kyun harmful, usually
incorrect self-blame trigger karte hain. Ye lesson specific diagnostic
supply karta hai ye samajhne ke liye ki ek given error mein actually
kya hua — slip ya mistake — jo ek accurate fix design karne ke liye
necessary prerequisite hai. Lesson 3 concrete error-state design
patterns assemble karta hai jo dono lessons ko practice mein daalte
hain: clear, non-blaming attribution (Lesson 1) combined execution ya
understanding pe correctly targeted fixes ke saath, is lesson ka
diagnostic identify kiye specific error type pe depend karte hue.`,

    examples: [
      {
        title: 'A slip-vs-mistake classifier applied to two real error reports, driving genuinely different fixes',
        titleHi: 'Ek slip-vs-mistake classifier jo do real error reports pe applied hai, genuinely different fixes ko drive karte hue',
        codeJs: `function classifyError(errorContext) {
  if (errorContext.userKnewWhatTheyIntendedToDo && errorContext.executionDidNotMatchIntention) {
    return { type: 'slip', fixTarget: 'interface execution — spacing, confirmation, undo' };
  }
  if (errorContext.userExecutedExactlyWhatTheyIntended && errorContext.intentionWasBasedOnIncorrectUnderstanding) {
    return { type: 'mistake', fixTarget: 'user understanding — labeling, onboarding, expectation-setting' };
  }
  return { type: 'unclear', fixTarget: 'investigate further before designing a fix' };
}

// Real support ticket 1: "I meant to archive the email but somehow
// deleted it — the buttons are right next to each other"
const ticket1 = classifyError({
  userKnewWhatTheyIntendedToDo: true,
  executionDidNotMatchIntention: true,
});
console.log(ticket1); // { type: 'slip', fixTarget: 'interface execution...' }

// Real support ticket 2: "I clicked 'delete' thinking it would just
// remove the email from my inbox view, not delete it from the server"
const ticket2 = classifyError({
  userExecutedExactlyWhatTheyIntended: true,
  intentionWasBasedOnIncorrectUnderstanding: true,
});
console.log(ticket2); // { type: 'mistake', fixTarget: 'user understanding...' }`,
        codeTs: `interface ErrorContext {
  userKnewWhatTheyIntendedToDo?: boolean;
  executionDidNotMatchIntention?: boolean;
  userExecutedExactlyWhatTheyIntended?: boolean;
  intentionWasBasedOnIncorrectUnderstanding?: boolean;
}

interface ErrorClassification {
  type: 'slip' | 'mistake' | 'unclear';
  fixTarget: string;
}

function classifyError(errorContext: ErrorContext): ErrorClassification {
  if (errorContext.userKnewWhatTheyIntendedToDo && errorContext.executionDidNotMatchIntention) {
    return { type: 'slip', fixTarget: 'interface execution — spacing, confirmation, undo' };
  }
  if (errorContext.userExecutedExactlyWhatTheyIntended && errorContext.intentionWasBasedOnIncorrectUnderstanding) {
    return { type: 'mistake', fixTarget: 'user understanding — labeling, onboarding, expectation-setting' };
  }
  return { type: 'unclear', fixTarget: 'investigate further before designing a fix' };
}

// Real support ticket 1: "I meant to archive the email but somehow
// deleted it — the buttons are right next to each other"
const ticket1 = classifyError({
  userKnewWhatTheyIntendedToDo: true,
  executionDidNotMatchIntention: true,
});
console.log(ticket1); // { type: 'slip', fixTarget: 'interface execution...' }

// Real support ticket 2: "I clicked 'delete' thinking it would just
// remove the email from my inbox view, not delete it from the server"
const ticket2 = classifyError({
  userExecutedExactlyWhatTheyIntended: true,
  intentionWasBasedOnIncorrectUnderstanding: true,
});
console.log(ticket2); // { type: 'mistake', fixTarget: 'user understanding...' }`,
        code: `if (errorContext.userKnewWhatTheyIntendedToDo && errorContext.executionDidNotMatchIntention) {
  return { type: 'slip', fixTarget: 'interface execution...' };
}
// diagnoses based on WHERE in the plan-to-execution sequence the failure occurred`,
        output:
          "Ticket 1 (correct intention, wrong execution — adjacent buttons) is classified as a slip requiring an interface-spacing fix, while ticket 2 (correct execution of an incorrect understanding) is classified as a mistake requiring a labeling fix — despite both tickets describing an accidental deletion, the diagnostic correctly identifies genuinely different underlying causes.",
        explain:
          "This example demonstrates the lesson's core diagnostic value: the same surface-level symptom (an accidental deletion) is correctly routed to two entirely different fix categories based on WHERE in the intention-to-execution sequence the actual failure occurred, preventing a mismatched fix from being applied to either case.",
        explainHi:
          "Ye example lesson ke core diagnostic value ko demonstrate karta hai: wahi surface-level symptom (ek accidental deletion) do poori tarah different fix categories tak correctly route kiya jaata hai is basis pe ki intention-to-execution sequence mein actual failure KAHAN hui, ek mismatched fix ko kisi bhi case pe apply hone se rokte hue.",
      },
    ],

    mistakes: [
      {
        wrong: `// Applying a generic "add a confirmation dialog" fix to every error,
// regardless of whether it's actually a slip or a mistake
function fixAllErrorsWrong(errorReports) {
  // "Users keep deleting things by accident — let's add confirmation
  // dialogs everywhere" — treats every error as if it were a slip,
  // without checking whether some are actually mistakes a
  // confirmation dialog won't fix
  return errorReports.map(() => ({ fix: 'add_confirmation_dialog' }));
}`,
        right: `// Diagnosing each error's actual type before selecting a fix
function fixErrorsCorrectly(errorReports) {
  return errorReports.map((report) => {
    const classification = classifyError(report);
    if (classification.type === 'slip') {
      return { fix: 'improve_spacing_and_add_confirmation' };
    }
    if (classification.type === 'mistake') {
      return { fix: 'clarify_labeling_and_onboarding' };
      // A confirmation dialog would NOT fix this — the user would
      // simply confirm their misunderstanding
    }
    return { fix: 'investigate_further' };
  });
}`,
        why: "Applying a confirmation dialog (a slip-fix) to a genuine mistake doesn't help, since a user who fundamentally misunderstands what an action does will simply confirm their mistaken action when prompted — the fix needs to correct the underlying misunderstanding, not add a checkpoint the user will pass through with the same incorrect belief.",
        whyHi:
          "Ek genuine mistake pe ek confirmation dialog (ek slip-fix) apply karna help nahi karta, kyunki ek user jo fundamentally misunderstand karta hai ki ek action kya karta hai simply prompt hone pe apni mistaken action ko confirm kar dega — fix ko underlying misunderstanding ko correct karna chahiye, ek checkpoint add nahi karna chahiye jise user wahi incorrect belief ke saath pass kar jaayega.",
      },
    ],

    realWorld: [
      {
        en: "A production email client's engineering team, after adding a confirmation dialog to their delete function without measurable improvement, conducted user interviews and discovered most accidental deletions were mistakes (users didn't understand 'delete' meant permanent server-side removal, not local hiding) rather than slips — switching to clearer labeling ('Permanently delete') resolved the issue where the confirmation dialog alone had not.",
        hi: 'Ek production email client ki engineering team, apne delete function mein ek confirmation dialog add karne ke baad koi measurable improvement ke bina, user interviews conduct kiye aur discover kiya ki zyada tar accidental deletions mistakes thi (users samajhte nahi the ki \'delete\' ka matlab permanent server-side removal hai, local hiding nahi) slips ke bajaye — clearer labeling (\'Permanently delete\') pe switch karna issue ko resolve kiya jahan akeli confirmation dialog nahi kar payi thi.',
      },
    ],

    interviewQA: [
      {
        q: "What is the fundamental difference between a slip and a mistake in Norman's model, and why does this distinction determine which fix is correct?",
        qHi: "Norman ke model mein ek slip aur ek mistake ke beech fundamental difference kya hai, aur ye distinction kaunsa fix correct hai ye kyun determine karta hai?",
        a: "A slip is a correct intention executed incorrectly (a typo, a misclick), fixed by improving the interface's execution surface (spacing, confirmation, undo). A mistake is an incorrect intention executed exactly as planned, due to a genuine misunderstanding, fixed by correcting that understanding (clearer labeling, better onboarding). Since these are mechanistically different failures occurring at different points, a fix targeted at one won't address the other.",
        aHi: 'Ek slip ek correct intention hai jo incorrectly executed hai (ek typo, ek misclick), interface ki execution surface improve karke fix ki gayi (spacing, confirmation, undo). Ek mistake ek incorrect intention hai jo exactly planned ki tarah executed hai, ek genuine misunderstanding ki wajah se, us understanding ko correct karke fix ki gayi (clearer labeling, better onboarding). Kyunki ye mechanistically different failures hain jo different points pe occur hoti hain, ek pe targeted fix doosre ko address nahi karega.',
      },
      {
        q: "Why can the identical visible symptom (e.g., an accidental deletion) require completely different fixes depending on whether it was a slip or a mistake?",
        qHi: 'Identical visible symptom (jaise, ek accidental deletion) ko poori tarah different fixes kyun chahiye is baat pe depend karte hue ki ye ek slip thi ya ek mistake?',
        a: "The visible outcome (something got deleted that shouldn't have) is identical either way, but the underlying cause differs completely: a slip means the interface made correct execution too easy to miss (fixed by spacing/confirmation), while a mistake means the user genuinely misunderstood what the action does (fixed by labeling/education). Applying the wrong category's fix leaves the actual cause unaddressed.",
        aHi: 'Visible outcome (kuch delete ho gaya jo nahi hona chahiye tha) dono tarike se identical hai, par underlying cause poori tarah differ karta hai: ek slip ka matlab hai interface ne correct execution ko miss karna bahut aasan bana diya (spacing/confirmation se fixed), jabki ek mistake ka matlab hai user genuinely misunderstand karta tha ki action kya karta hai (labeling/education se fixed). Galat category ka fix apply karna actual cause ko unaddressed chhodta hai.',
      },
    ],

    exercises: [
      {
        task: "Support tickets reveal that users repeatedly click 'Archive Project' when they meant to click 'Duplicate Project,' and the two buttons are adjacent, identically styled, and equally sized. Using this lesson's classification framework, determine whether this is more likely a slip or a mistake, and propose the specific type of fix this lesson's framework indicates.",
        taskHi: 'Support tickets reveal karte hain ki users repeatedly \'Archive Project\' click karte hain jab wo \'Duplicate Project\' click karna chahte the, aur do buttons adjacent hain, identically styled, aur equally sized. Is lesson ke classification framework use karke, determine karo ki ye zyada likely ek slip hai ya ek mistake, aur is lesson ke framework jo specific type ka fix indicate karta hai use propose karo.',
        hint: "Ask whether users report knowing exactly which action they wanted (suggesting correct intention, failed execution) versus genuinely believing 'Archive' would do something it doesn't actually do (suggesting incorrect intention).",
        hintHi: 'Pucho ki kya users report karte hain exactly jaanne ka ki unhe kaunsa action chahiye tha (correct intention, failed execution suggest karte hue) versus genuinely believe karna ki \'Archive\' kuch aisa karega jo ye actually nahi karta (incorrect intention suggest karte hue).',
      },
    ],

    keyTakeaways: [
      "A slip is a correct intention executed incorrectly (fixed by improving interface execution: spacing, confirmation, undo); a mistake is an incorrect intention executed exactly as planned due to a genuine misunderstanding (fixed by correcting understanding: labeling, onboarding).",
      "The identical visible error symptom can be either a slip or a mistake, requiring correct diagnosis of the actual underlying cause before an effective fix can be designed.",
      "Applying a slip-fix to a genuine mistake (or vice versa) fails to solve the problem, since the fix targets a mechanism that wasn't actually what went wrong.",
      "Correctly diagnosing either error type tends to implicate system design (poor execution affordances, or poor communication) rather than user failing — directly supporting Lesson 1's finding that self-blame is usually the wrong default response.",
    ],
    keyTakeawaysHi: [
      'Ek slip ek correct intention hai jo incorrectly executed hai (interface execution improve karke fix ki gayi: spacing, confirmation, undo); ek mistake ek incorrect intention hai jo ek genuine misunderstanding ki wajah se exactly planned ki tarah executed hai (understanding correct karke fix ki gayi: labeling, onboarding).',
      'Identical visible error symptom ya to ek slip ya ek mistake ho sakta hai, ek effective fix design hone se pehle actual underlying cause ki correct diagnosis maangte hue.',
      'Ek genuine mistake pe ek slip-fix apply karna (ya vice versa) problem solve karne mein fail hota hai, kyunki fix ek mechanism ko target karta hai jo actually galat hua hi nahi tha.',
      "Kisi bhi error type ko correctly diagnose karna typically system design ko implicate karta hai (poor execution affordances, ya poor communication) user failing ke bajaye — directly Lesson 1 ki finding ko support karte hue ki self-blame usually galat default response hai.",
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'psych-designing-helpful-error-states',
    title: 'Designing Error States That Actually Help Instead of Shaming',
    titleHi: 'Error States Design Karna Jo Actually Help Karte Hain Shame Karne Ke Bajaye',
    description:
      "Closing this module: concrete, implementable error-state patterns that combine Lesson 1's attribution correction with Lesson 2's slip-vs-mistake diagnosis, producing error states that genuinely help a user recover rather than leaving them confused, blamed, or stuck.",
    descriptionHi:
      'Is module ko close karte hue: concrete, implementable error-state patterns jo Lesson 1 ke attribution correction ko Lesson 2 ke slip-vs-mistake diagnosis ke saath combine karte hain, error states produce karte hue jo genuinely ek user ko recover karne mein help karte hain unhe confused, blamed, ya stuck chhodne ke bajaye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A skilled flight instructor's response to a student pilot's mistake during training — calmly stating exactly what happened, why it happened, and precisely what to do differently next time, versus an instructor who simply shouts 'You did it wrong!' and leaves the student to guess at everything else.** A skilled flight instructor responding to a student's error during a training flight doesn't just declare that something went wrong — they immediately supply the three things the student actually needs to recover and improve: precisely what happened (the specific control input that was off), why it happened (whether it was a habit needing more practice, a genuine misunderstanding of the procedure, or an environmental factor beyond the student's control), and specifically what to do differently right now to correct course. An instructor who only shouts 'you did it wrong' provides none of this — the student is left knowing only that a failure occurred, with no actionable path to correcting it, no understanding of whether it was their execution or their understanding that failed, and every reason to feel generically incompetent rather than specifically informed about one correctable thing. This exact three-part structure — what happened, why (correctly diagnosed), what to do now — is what separates an error state that actually helps a user recover from one that merely announces failure and leaves them stuck, and it's the direct, practical synthesis of everything this module has established: Lesson 1's finding that attribution must be handled explicitly, and Lesson 2's finding that the 'why' must be correctly diagnosed as a slip or a mistake before a genuinely useful 'what to do now' can be supplied.",
      hi: 'ek skilled flight instructor ka response ek student pilot ki mistake training ke dauran ke liye — calmly ye state karna ki exactly kya hua, ye kyun hua, aur precisely next time kya alag karna hai, versus ek instructor jo simply shout karta hai \'You did it wrong!\' aur student ko baaki sab kuch guess karne ke liye chhodta hai. Ek skilled flight instructor jo ek training flight ke dauran ek student ki error ko respond karta hai sirf declare nahi karta ki kuch galat hua — wo immediately teen cheezein supply karta hai jo student ko actually recover aur improve karne ke liye chahiye: precisely kya hua (specific control input jo off tha), ye kyun hua (kya ye ek habit thi jise zyada practice chahiye, ek genuine misunderstanding of the procedure, ya student ke control se bahar ek environmental factor), aur specifically ab right now kya alag karna hai course correct karne ke liye. Ek instructor jo sirf shout karta hai \'you did it wrong\' in mein se kuch provide nahi karta — student sirf ye jaante hue chhoda jaata hai ki ek failure hui, koi actionable path ise correct karne ke liye nahi, koi understanding nahi ki kya ye unka execution tha ya unki understanding jo fail hui, aur generically incompetent feel karne ka har reason ek correctable cheez ke baare mein specifically informed hone ke bajaye. Ye exact three-part structure — kya hua, kyun (correctly diagnosed), ab kya karna hai — wo hai jo ek error state ko jo actually ek user ko recover karne mein help karta hai us se separate karta hai jo sirf failure announce karti hai aur unhe stuck chhod deti hai, aur ye is module ne establish ki har cheez ka direct, practical synthesis hai: Lesson 1 ki finding ki attribution ko explicitly handle karna chahiye, aur Lesson 2 ki finding ki "kyun" ko correctly slip ya mistake ki tarah diagnose kiya jaana chahiye ek genuinely useful "ab kya karna hai" supply hone se pehle.',
    },

    simple: `**The complete, three-part structure this lesson assembles from
Lessons 1-2 — the actual content a genuinely helpful error state must
provide:**

\`\`\`
1. WHAT HAPPENED — a specific, accurate description of the actual
   failure (Lesson 1's correction of vague, self-blame-inducing errors).

2. WHY IT HAPPENED — correctly diagnosed as a slip or a mistake
   (Lesson 2's framework), which determines...

3. WHAT TO DO NOW — a concrete, actionable next step, genuinely
   different depending on whether #2 was a slip (try again, with
   clearer execution guidance) or a mistake (here's what this
   actually does, now that you understand, proceed if you still want to).
\`\`\`

**A concrete, complete implementation combining all three parts for a
genuine SLIP scenario:**

\`\`\`tsx
function SlipErrorState({ intendedAction, actualAction }) {
  return (
    <div className="error-state">
      <p>It looks like "{actualAction}" was triggered instead of "{intendedAction}".</p>
      {/* WHAT: specific, accurate — not "something went wrong" */}
      <p>These two buttons are easy to mix up — we've added more space between them.</p>
      {/* WHY (implicitly, correctly diagnosed as execution-level, not
          blaming the user's understanding) */}
      <button onClick={() => performAction(intendedAction)}>
        Do "{intendedAction}" now
      </button>
      {/* WHAT TO DO NOW: a direct, one-click path to the actually-intended action */}
    </div>
  );
}
\`\`\`

**A concrete, complete implementation combining all three parts for a
genuine MISTAKE scenario:**

\`\`\`tsx
function MistakeErrorState({ actionTaken, actualConsequence }) {
  return (
    <div className="error-state">
      <p>"{actionTaken}" {actualConsequence}.</p>
      {/* WHAT: the actual, accurate consequence, likely different
          from what the user assumed */}
      <p>This is different from what "{actionTaken}" might sound like it does.</p>
      {/* WHY: implicitly, correctly diagnosed as an understanding gap,
          not blaming execution */}
      <div>
        <button onClick={proceedAnyway}>Yes, I understand — proceed</button>
        <button onClick={cancel}>No, cancel this</button>
      </div>
      {/* WHAT TO DO NOW: a genuine choice, now made with accurate
          understanding, rather than either forcing the mistaken
          action through or silently blocking it */}
    </div>
  );
}
\`\`\`

**A concrete, checkable audit combining Lessons 1-2's standards into
one complete error-state quality check:**

\`\`\`ts
function auditErrorStateQuality(errorState) {
  return {
    passesAttributionCheck: errorState.describesActualCause && !errorState.leavesAttributionAmbiguous, // Lesson 1
    hasCorrectDiagnosis: errorState.errorType === 'slip' || errorState.errorType === 'mistake', // Lesson 2
    providesActionableNextStep: errorState.hasSpecificRecoveryAction,
    fixMatchesDiagnosedType: (
      (errorState.errorType === 'slip' && errorState.fixAddressesExecution) ||
      (errorState.errorType === 'mistake' && errorState.fixAddressesUnderstanding)
    ),
  };
}
\`\`\`

**Why leaving out any one of the three parts produces a genuinely
worse error state, even if the other two parts are done well — a
specific, checkable completeness requirement:**

\`\`\`
An error stating WHAT happened without WHY leaves the user informed
but without a path to prevent recurrence. An error correctly diagnosing
WHY (slip vs. mistake) without a concrete WHAT TO DO NOW leaves the
user understanding the problem but stuck without a resolution path. All
three parts are necessary together — this lesson's completeness
requirement, not any single part alone, is what makes an error state
genuinely helpful rather than merely less bad than a vague one.
\`\`\`

**How this lesson closes Module 11:** Lesson 1 established why vague
errors actively harm users through incorrect self-blame. Lesson 2
established the diagnostic framework for correctly understanding why
an error actually happened. This lesson completes the module by
assembling both findings into one concrete, complete, three-part
structure for error-state design — closing the arc from psychological
finding, to diagnostic framework, to fully practical implementation.`,

    simpleHi: `**Complete, three-part structure jise ye lesson Lessons 1-2 se
assemble karta hai — actual content jo ek genuinely helpful error
state ko provide karna chahiye:**

\`\`\`
1. WHAT HAPPENED — actual failure ka ek specific, accurate description
   (Lesson 1 ki vague, self-blame-inducing errors ki correction).

2. WHY IT HAPPENED — correctly ek slip ya ek mistake ki tarah
   diagnosed (Lesson 2 ka framework), jo determine karta hai...

3. WHAT TO DO NOW — ek concrete, actionable next step, genuinely
   different is baat pe depend karte hue ki #2 slip thi (try again,
   clearer execution guidance ke saath) ya mistake (ye actually kya
   karta hai, ab jab aap samajhte hain, agar abhi bhi chahte ho to
   proceed karo).
\`\`\`

**Ek genuine SLIP scenario ke liye sab teen parts ko combine karta ek
concrete, complete implementation:**

\`\`\`tsx
function SlipErrorState({ intendedAction, actualAction }) {
  return (
    <div className="error-state">
      <p>It looks like "{actualAction}" was triggered instead of "{intendedAction}".</p>
      {/* WHAT: specific, accurate — "kuch galat hua" nahi */}
      <p>These two buttons are easy to mix up — we've added more space between them.</p>
      {/* WHY (implicitly, correctly execution-level diagnose kiya
          gaya, user ki understanding ko blame kiye bina) */}
      <button onClick={() => performAction(intendedAction)}>
        Do "{intendedAction}" now
      </button>
      {/* WHAT TO DO NOW: actually-intended action ka ek direct,
          one-click path */}
    </div>
  );
}
\`\`\`

**Ek genuine MISTAKE scenario ke liye sab teen parts ko combine karta
ek concrete, complete implementation:**

\`\`\`tsx
function MistakeErrorState({ actionTaken, actualConsequence }) {
  return (
    <div className="error-state">
      <p>"{actionTaken}" {actualConsequence}.</p>
      {/* WHAT: actual, accurate consequence, likely user ne jo assume
          kiya us se different */}
      <p>This is different from what "{actionTaken}" might sound like it does.</p>
      {/* WHY: implicitly, correctly ek understanding gap diagnose kiya
          gaya, execution ko blame kiye bina */}
      <div>
        <button onClick={proceedAnyway}>Yes, I understand — proceed</button>
        <button onClick={cancel}>No, cancel this</button>
      </div>
      {/* WHAT TO DO NOW: ek genuine choice, ab accurate understanding
          ke saath banayi gayi, mistaken action ko force through karne
          ya silently block karne ke bajaye */}
    </div>
  );
}
\`\`\`

**Lessons 1-2 ke standards ko ek complete error-state quality check
mein combine karta ek concrete, checkable audit:**

\`\`\`ts
function auditErrorStateQuality(errorState) {
  return {
    passesAttributionCheck: errorState.describesActualCause && !errorState.leavesAttributionAmbiguous, // Lesson 1
    hasCorrectDiagnosis: errorState.errorType === 'slip' || errorState.errorType === 'mistake', // Lesson 2
    providesActionableNextStep: errorState.hasSpecificRecoveryAction,
    fixMatchesDiagnosedType: (
      (errorState.errorType === 'slip' && errorState.fixAddressesExecution) ||
      (errorState.errorType === 'mistake' && errorState.fixAddressesUnderstanding)
    ),
  };
}
\`\`\`

**Teen parts mein se kisi ek ko chhodna genuinely worse error state
kyun produce karta hai, chahe doosre do parts achhe se kiye gaye hon —
ek specific, checkable completeness requirement:**

\`\`\`
Ek error jo WHAT hua state karta hai WHY ke bina user ko informed
chhodta hai par recurrence prevent karne ka koi path nahi. Ek error jo
correctly WHY diagnose karta hai (slip vs. mistake) ek concrete WHAT
TO DO NOW ke bina user ko problem samajhte hue chhodta hai par ek
resolution path ke bina stuck. Sab teen parts saath necessary hain —
is lesson ki completeness requirement, koi single part akela nahi, wo
hai jo ek error state ko genuinely helpful banata hai sirf ek vague
wale se less bad hone ke bajaye.
\`\`\`

**Ye lesson Module 11 ko kaise close karta hai:** Lesson 1 ne establish
kiya ki vague errors incorrect self-blame ke through users ko actively
kyun harm karte hain. Lesson 2 ne diagnostic framework establish kiya
correctly ye samajhne ke liye ki ek error actually kyun hua. Ye lesson
dono findings ko ek concrete, complete, three-part structure mein
assemble karke module ko complete karta hai error-state design ke
liye — arc ko psychological finding se, diagnostic framework se,
fully practical implementation tak close karte hue.`,

    content: `## Why a genuinely helpful error state requires all three parts
together, not any single part alone

An error message that accurately states what happened (Lesson 1's
correction) but never explains why or supplies a next step leaves the
user informed but without any path to prevent recurrence or resolve
the current situation. An error correctly diagnosed as a slip or
mistake (Lesson 2) but never communicated to the user, or communicated
without a concrete next action, leaves the correct diagnosis useless
to the person actually experiencing the error. This lesson's
three-part structure — what happened, why (correctly diagnosed), what
to do now — is necessary as a complete unit, since each part addresses
a distinct requirement none of the others fulfill.

## Why the "what to do now" step must genuinely differ based on
whether the error was diagnosed as a slip or a mistake

For a genuine slip, the user's original intention was correct, so the
most helpful next step is typically a direct, low-friction path to
completing that original, correct intention (a one-click "do what I
actually meant" action) alongside a fix to the execution surface that
caused the slip. For a genuine mistake, the user's intention itself
was based on a misunderstanding, so the most helpful next step is
supplying accurate information about what the action actually does and
then presenting a genuine choice — proceed with accurate understanding,
or cancel — rather than either silently completing a now-informed
decision or simply blocking the action without explanation. Offering
the same generic "try again" step regardless of which diagnosis
applies fails to serve either case as specifically as a differentiated
response would.

## Why explicit attribution (Lesson 1) must be woven throughout the
error state, not treated as a separate, optional addition

Since Lesson 1 established that ambiguous attribution defaults to
harmful self-blame, a genuinely helpful error state doesn't merely
avoid stating that the failure was the user's fault — it actively and
specifically communicates the correct attribution throughout the
description of what happened and why, whether that means clarifying
that adjacent buttons made a slip easy (an execution-design issue) or
that ambiguous labeling made a mistake understandable (a
communication-design issue). Both attributions correctly point toward
system design rather than user failing, which is why explicit,
accurate attribution should run through the entire error state rather
than being confined to a single disclaimer sentence.

## Why a complete audit checking all four specific criteria together
is more reliable than checking any single quality in isolation

An error state might pass an attribution check (Lesson 1) while still
failing to provide an actionable next step, or might correctly
diagnose the error type (Lesson 2) while applying a mismatched fix
that doesn't address that diagnosis. A complete audit — checking
attribution clarity, correct diagnosis, actionable next-step presence,
and fix-to-diagnosis matching together — catches failures that
checking any single criterion in isolation would miss, since a
genuinely helpful error state requires all four conditions
simultaneously.

## How this lesson closes Module 11

Lesson 1 established the psychological finding that vague errors
trigger harmful, usually incorrect self-blame. Lesson 2 established
the diagnostic framework for correctly understanding why a specific
error actually occurred. This lesson completes the module by
synthesizing both into one concrete, three-part structure and a
complete quality-audit standard for real error-state design — closing
this module's arc from psychological finding to diagnostic framework
to fully practical, implementable technique.`,

    contentHi: `## Ek genuinely helpful error state ko sab teen parts saath kyun chahiye, koi single part akela nahi

Ek error message jo accurately state karta hai ki kya hua (Lesson 1 ki
correction) par kabhi explain nahi karta kyun ya ek next step supply
nahi karta user ko informed chhodta hai par recurrence prevent karne
ya current situation resolve karne ka koi path nahi. Ek error jo
correctly ek slip ya mistake ki tarah diagnose kiya gaya (Lesson 2) par
kabhi user ko communicate nahi kiya gaya, ya ek concrete next action ke
bina communicate kiya gaya, correct diagnosis ko us insaan ke liye
useless chhodta hai jo actually error experience kar raha hai. Is
lesson ki three-part structure — kya hua, kyun (correctly diagnosed),
ab kya karna hai — ek complete unit ki tarah necessary hai, kyunki har
part ek distinct requirement address karta hai jise doosron mein se
koi fulfill nahi karta.

## "Ab kya karna hai" step genuinely kyun differ karna chahiye is baat pe depend karte hue ki error ko slip ya mistake ki tarah diagnose kiya gaya

Ek genuine slip ke liye, user ki original intention correct thi,
isliye sabse helpful next step typically us original, correct
intention ko complete karne ka ek direct, low-friction path hai (ek
one-click "jo maine actually chaha wo karo" action) execution surface
ke ek fix ke saath jisne slip cause ki. Ek genuine mistake ke liye,
user ki intention khud ek misunderstanding pe based thi, isliye sabse
helpful next step accurate information supply karna hai is baare mein
ki action actually kya karta hai aur phir ek genuine choice present
karna — accurate understanding ke saath proceed karo, ya cancel karo —
silently ek ab-informed decision complete karne ya bina explanation
action ko block karne ke bajaye. Wahi generic "try again" step offer
karna is baat se independently ki kaunsa diagnosis apply hota hai kisi
bhi case ko utna specifically serve karne mein fail hota hai jitna ek
differentiated response karegi.

## Explicit attribution (Lesson 1) ko error state ke through kyun weave kiya jaana chahiye, ek separate, optional addition ki tarah treat nahi kiya jaana chahiye

Kyunki Lesson 1 ne establish kiya ki ambiguous attribution harmful
self-blame ki taraf default karta hai, ek genuinely helpful error
state sirf ye state karne se nahi bachta ki failure user ki fault
nahi thi — ye actively aur specifically correct attribution ko poore
description throughout communicate karta hai is baat ka ki kya hua aur
kyun, chahe iska matlab ho clarify karna ki adjacent buttons ne ek
slip ko aasan banaya (ek execution-design issue) ya ki ambiguous
labeling ne ek mistake ko understandable banaya (ek communication-
design issue). Dono attributions correctly system design ki taraf
point karte hain user failing ke bajaye, yahi wajah hai explicit,
accurate attribution ko poore error state ke through chalna chahiye
ek single disclaimer sentence tak confined hone ke bajaye.

## Sab char specific criteria ko saath check karta ek complete audit kisi single quality ko isolation mein check karne se zyada reliable kyun hai

Ek error state ek attribution check pass kar sakta hai (Lesson 1)
jabki abhi bhi ek actionable next step provide karne mein fail hota hai,
ya correctly error type diagnose kar sakta hai (Lesson 2) jabki ek
mismatched fix apply karta hai jo us diagnosis ko address nahi karta.
Ek complete audit — attribution clarity, correct diagnosis, actionable
next-step presence, aur fix-to-diagnosis matching ko saath check karna
— un failures ko catch karta hai jinhe kisi single criterion ko
isolation mein check karna miss kar dega, kyunki ek genuinely helpful
error state ko sab char conditions simultaneously chahiye.

## Ye lesson Module 11 ko kaise close karta hai

Lesson 1 ne psychological finding establish ki ki vague errors
harmful, usually incorrect self-blame trigger karte hain. Lesson 2 ne
diagnostic framework establish kiya correctly ye samajhne ke liye ki
ek specific error actually kyun hui. Ye lesson dono ko ek concrete,
three-part structure aur real error-state design ke liye ek complete
quality-audit standard mein synthesize karke module ko complete karta
hai — is module ke arc ko psychological finding se diagnostic
framework se fully practical, implementable technique tak close karte
hue.`,

    examples: [
      {
        title: 'A complete, four-criteria error-state audit applied to a fully-assembled slip and mistake scenario',
        titleHi: 'Ek complete, four-criteria error-state audit jo ek fully-assembled slip aur mistake scenario pe applied hai',
        codeJs: `function auditErrorStateQuality(errorState) {
  return {
    passesAttributionCheck: errorState.describesActualCause && !errorState.leavesAttributionAmbiguous,
    hasCorrectDiagnosis: errorState.errorType === 'slip' || errorState.errorType === 'mistake',
    providesActionableNextStep: errorState.hasSpecificRecoveryAction,
    fixMatchesDiagnosedType: (
      (errorState.errorType === 'slip' && errorState.fixAddressesExecution) ||
      (errorState.errorType === 'mistake' && errorState.fixAddressesUnderstanding)
    ),
  };
}

// A fully-assembled slip error state, built from Lessons 1-2's findings
const slipErrorState = {
  describesActualCause: true, // "wrong button triggered instead of intended one"
  leavesAttributionAmbiguous: false, // explicitly attributes to button proximity, not user
  errorType: 'slip',
  hasSpecificRecoveryAction: true, // one-click "do what I meant" button
  fixAddressesExecution: true, // improved spacing/confirmation
};

const auditResult = auditErrorStateQuality(slipErrorState);
// { passesAttributionCheck: true, hasCorrectDiagnosis: true, providesActionableNextStep: true, fixMatchesDiagnosedType: true }`,
        codeTs: `interface ErrorStateDefinition {
  describesActualCause: boolean;
  leavesAttributionAmbiguous: boolean;
  errorType: 'slip' | 'mistake' | 'unclear';
  hasSpecificRecoveryAction: boolean;
  fixAddressesExecution?: boolean;
  fixAddressesUnderstanding?: boolean;
}

function auditErrorStateQuality(errorState: ErrorStateDefinition) {
  return {
    passesAttributionCheck: errorState.describesActualCause && !errorState.leavesAttributionAmbiguous,
    hasCorrectDiagnosis: errorState.errorType === 'slip' || errorState.errorType === 'mistake',
    providesActionableNextStep: errorState.hasSpecificRecoveryAction,
    fixMatchesDiagnosedType: (
      (errorState.errorType === 'slip' && !!errorState.fixAddressesExecution) ||
      (errorState.errorType === 'mistake' && !!errorState.fixAddressesUnderstanding)
    ),
  };
}

// A fully-assembled slip error state, built from Lessons 1-2's findings
const slipErrorState: ErrorStateDefinition = {
  describesActualCause: true, // "wrong button triggered instead of intended one"
  leavesAttributionAmbiguous: false, // explicitly attributes to button proximity, not user
  errorType: 'slip',
  hasSpecificRecoveryAction: true, // one-click "do what I meant" button
  fixAddressesExecution: true, // improved spacing/confirmation
};

const auditResult = auditErrorStateQuality(slipErrorState);
// { passesAttributionCheck: true, hasCorrectDiagnosis: true, providesActionableNextStep: true, fixMatchesDiagnosedType: true }`,
        code: `const auditResult = auditErrorStateQuality(slipErrorState);
// all four criteria checked together — a genuinely complete error state passes all four`,
        output:
          "The fully-assembled slip error state passes all four audit criteria: it describes the actual cause without ambiguity, correctly diagnoses the error as a slip, provides a one-click actionable recovery path, and applies an execution-focused fix matching that diagnosis — demonstrating what a genuinely complete, module-synthesizing error state looks like.",
        explain:
          "This example ties together every element this module established: Lesson 1's attribution clarity, Lesson 2's correct slip/mistake diagnosis, and this lesson's requirement for both an actionable next step and a fix genuinely matched to the diagnosed error type — all four checked together as one complete standard.",
        explainHi:
          "Ye example is module ne establish ki har element ko saath tie karta hai: Lesson 1 ki attribution clarity, Lesson 2 ka correct slip/mistake diagnosis, aur is lesson ka requirement dono ek actionable next step aur ek fix ke liye jo genuinely diagnosed error type se match karta hai — sab char saath ek complete standard ki tarah checked.",
      },
    ],

    mistakes: [
      {
        wrong: `// An error state that gets attribution and diagnosis right but
// provides no actionable next step, leaving the user informed but stuck
function IncompleteErrorStateWrong({ cause }) {
  return (
    <div>
      <p>The upload failed because the file exceeded the 10MB size limit.</p>
      <p>This wasn't something you did wrong — the limit wasn't clearly shown.</p>
      {/* Attribution: correct. Diagnosis: implicitly a mistake (unclear
          expectation). But NO next step — what should the user
          actually DO now? Compress the file? Try a different format?
          The user is informed but still stuck. */}
    </div>
  );
}`,
        right: `// The same accurate attribution and diagnosis, now completed with a
// specific, actionable next step
function CompleteErrorStateRight({ cause, currentSizeMb, limitMb }) {
  return (
    <div>
      <p>{\`The upload failed because the file (\${currentSizeMb}MB) exceeded the \${limitMb}MB limit.\`}</p>
      <p>This wasn't something you did wrong — the limit wasn't clearly shown beforehand.</p>
      <button onClick={openCompressionTool}>Compress this file to fit</button>
      <button onClick={openLimitIncreaseInfo}>Learn about higher limits</button>
      {/* NOW complete: accurate cause, correct attribution, AND
          concrete, specific next steps */}
    </div>
  );
}`,
        why: "An error state with accurate attribution and correct diagnosis but no actionable next step leaves the user informed about the problem but without a clear path to resolve it — this lesson's three-part standard requires all three elements together, since accurate diagnosis without a resolution path still leaves the user stuck.",
        whyHi:
          "Accurate attribution aur correct diagnosis wala ek error state par koi actionable next step ke bina user ko problem ke baare mein informed chhodta hai par ise resolve karne ka ek clear path ke bina — is lesson ka three-part standard sab teen elements saath maangta hai, kyunki accurate diagnosis ek resolution path ke bina abhi bhi user ko stuck chhodta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production cloud storage service redesigned its 'quota exceeded' error to include the specific overage amount, an explicit statement that the limit wasn't clearly communicated during signup, and two concrete next-step buttons (upgrade plan, or delete specific old files with a size-sorted list) — support tickets for this specific error dropped substantially, with the size-sorted deletion option becoming the most-used path to resolution.",
        hi: 'Ek production cloud storage service ne apna \'quota exceeded\' error redesign kiya specific overage amount include karne ke liye, ek explicit statement ki limit signup ke dauran clearly communicate nahi ki gayi thi, aur do concrete next-step buttons (upgrade plan, ya specific old files delete karo ek size-sorted list ke saath) — is specific error ke liye support tickets substantially kam hue, size-sorted deletion option resolution ka sabse-used path ban gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the three parts a genuinely helpful error state must include, and why does missing any one of them leave the state incomplete?',
        qHi: 'Wo teen parts kya hain jo ek genuinely helpful error state ko include karne chahiye, aur inme se kisi ek ko miss karna state ko incomplete kyun chhodta hai?',
        a: "What happened (a specific, accurate description, per Lesson 1), why it happened (correctly diagnosed as a slip or mistake, per Lesson 2), and what to do now (a concrete, actionable next step matched to that diagnosis). Missing 'why' leaves the user informed but unable to prevent recurrence; missing 'what to do now' leaves the user understanding the problem but stuck without a resolution path — all three are necessary together.",
        aHi: 'Kya hua (ek specific, accurate description, Lesson 1 ke hisaab se), ye kyun hua (correctly ek slip ya mistake ki tarah diagnosed, Lesson 2 ke hisaab se), aur ab kya karna hai (ek concrete, actionable next step us diagnosis se matched). "Kyun" miss karna user ko informed chhodta hai par recurrence prevent karne mein unable; "ab kya karna hai" miss karna user ko problem samajhte hue chhodta hai par ek resolution path ke bina stuck — sab teen saath necessary hain.',
      },
      {
        q: "Why must the 'what to do now' step genuinely differ between a diagnosed slip and a diagnosed mistake, rather than using one generic recovery action?",
        qHi: "'Ab kya karna hai' step ek diagnosed slip aur ek diagnosed mistake ke beech genuinely kyun differ karna chahiye, ek generic recovery action use karne ke bajaye?",
        a: "For a slip, the user's original intention was correct, so the helpful step is a direct path to completing that intention (a one-click correct action) alongside an execution fix. For a mistake, the intention itself was wrong due to a misunderstanding, so the helpful step is supplying accurate information and then presenting a genuine choice to proceed or cancel — a generic 'try again' serves neither case as well as a differentiated response.",
        aHi: 'Ek slip ke liye, user ki original intention correct thi, isliye helpful step us intention ko complete karne ka ek direct path hai (ek one-click correct action) ek execution fix ke saath. Ek mistake ke liye, intention khud ek misunderstanding ki wajah se galat thi, isliye helpful step accurate information supply karna hai aur phir proceed ya cancel karne ka ek genuine choice present karna — ek generic "try again" kisi bhi case ko utna achhe se serve nahi karta jitna ek differentiated response karega.',
      },
    ],

    exercises: [
      {
        task: "A form-submission error currently reads 'Validation error. Please check your input.' with no further detail. Using this lesson's three-part structure, rewrite this error for a hypothetical scenario where the actual cause is a phone number field that requires a specific format the user wasn't shown, and specify what error type (slip or mistake) this represents and why.",
        taskHi: 'Ek form-submission error currently \'Validation error. Please check your input.\' padhta hai koi further detail ke bina. Is lesson ke three-part structure use karke, is error ko ek hypothetical scenario ke liye rewrite karo jahan actual cause ek phone number field hai jise ek specific format chahiye jo user ko dikhaya nahi gaya, aur specify karo ki ye kaunsa error type represent karta hai (slip ya mistake) aur kyun.',
        hint: "Consider whether the user's underlying intention (entering their correct phone number) was right but the format expectation was unstated — this shapes both the diagnosis and the specific 'what to do now' step you should write.",
        hintHi: 'Consider karo ki kya user ki underlying intention (unka correct phone number enter karna) sahi thi par format expectation unstated thi — ye dono diagnosis aur specific "ab kya karna hai" step ko shape karta hai jo tumhe likhna chahiye.',
      },
    ],

    keyTakeaways: [
      "A genuinely helpful error state requires three parts together: what happened (Lesson 1's accurate, non-ambiguous attribution), why it happened (Lesson 2's slip-vs-mistake diagnosis), and a concrete, actionable next step.",
      "The 'what to do now' step must genuinely differ based on diagnosis: a slip calls for a direct path to the originally-intended action plus an execution fix; a mistake calls for accurate information followed by a genuine proceed-or-cancel choice.",
      "Explicit, accurate attribution (Lesson 1) should run throughout the error state's description, not be confined to a single disclaimer, since both slips and mistakes correctly implicate system design over user failing.",
      "This lesson closes Module 11 by synthesizing Lessons 1-2 into one complete, four-criteria quality standard for real error-state design — completing the arc from psychological finding to diagnostic framework to practical implementation.",
    ],
    keyTakeawaysHi: [
      'Ek genuinely helpful error state ko teen parts saath chahiye: kya hua (Lesson 1 ki accurate, non-ambiguous attribution), ye kyun hua (Lesson 2 ka slip-vs-mistake diagnosis), aur ek concrete, actionable next step.',
      "'Ab kya karna hai' step diagnosis ke basis pe genuinely differ karna chahiye: ek slip originally-intended action tak ek direct path plus ek execution fix ke liye call karta hai; ek mistake accurate information ke baad ek genuine proceed-or-cancel choice ke liye call karta hai.",
      'Explicit, accurate attribution (Lesson 1) ko error state ke description ke through poori tarah chalna chahiye, ek single disclaimer tak confined nahi, kyunki slips aur mistakes dono correctly system design ko implicate karte hain user failing ke bajaye.',
      'Ye lesson Module 11 ko close karta hai Lessons 1-2 ko ek complete, four-criteria quality standard mein synthesize karke real error-state design ke liye — psychological finding se diagnostic framework se practical implementation tak arc ko complete karte hue.',
    ],
  },
];
