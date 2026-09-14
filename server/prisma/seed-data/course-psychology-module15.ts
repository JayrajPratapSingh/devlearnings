/**
 * Psychology for Developers — Module 15: Psychological Safety & High-Performing Teams, lessons 1-3.
 *
 * Lesson 1: Amy Edmondson's psychological safety research and why it predicts team performance.
 * Lesson 2: Blameless postmortems as a concrete practice built on psychological safety.
 * Lesson 3: What makes code review feedback land instead of triggering defensiveness.
 */

import type { CourseLesson } from './course-js-module1';

export const PSYCH_MODULE_15: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'psych-amy-edmondson-psychological-safety',
    title: "Amy Edmondson's Psychological Safety Research",
    titleHi: "Amy Edmondson Ki Psychological Safety Research",
    description:
      "Opening Part VI's shift from user psychology to team psychology: Amy Edmondson's well-documented finding that psychological safety — not skill, effort, or resources alone — is the strongest predictor of team performance, and why it works through a specific, checkable mechanism.",
    descriptionHi:
      'Part VI ke user psychology se team psychology tak shift ko open karte hue: Amy Edmondson ki well-documented finding ki psychological safety — sirf skill, effort, ya resources nahi — team performance ka sabse strong predictor hai, aur ye ek specific, checkable mechanism ke through kyun kaam karta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**Two hospital wards with identical staff skill levels, identical equipment, and identical patient loads, where one ward reports measurably MORE medication errors than the other — and the counterintuitive finding that the 'worse' ward is actually safer, because its nurses feel safe enough to report near-misses and mistakes while the 'better' ward's nurses are quietly hiding theirs.** In a landmark early study, Amy Edmondson set out to measure whether better hospital teams made fewer medication errors, and initially found something that seemed backwards: teams she'd independently rated as higher-functioning reported MORE errors, not fewer. Deeper investigation revealed the real mechanism: the higher-functioning teams had genuinely higher psychological safety — nurses felt safe admitting a mistake, reporting a near-miss, or flagging a colleague's error without fear of punishment or humiliation — so these teams' error RATES weren't actually higher, their error REPORTING was. The lower-functioning teams had the same or worse actual error rates, but fear of blame kept those errors hidden, undiscussed, and consequently unfixed and likely to recur. This is exactly Edmondson's core, well-documented finding: psychological safety — a shared team belief that it's safe to take interpersonal risks like admitting a mistake, asking a question that might seem obvious, or challenging a colleague's approach — isn't a soft, feel-good extra. It's a specific, measurable mechanism that determines whether a team's real problems surface and get fixed, or stay hidden and compound, making it one of the strongest documented predictors of genuine team performance across many fields, engineering very much included.",
      hi: 'do hospital wards identical staff skill levels, identical equipment, aur identical patient loads ke saath, jahan ek ward doosre se measurably ZYADA medication errors report karta hai — aur ye counterintuitive finding ki "worse" ward actually safer hai, kyunki uski nurses near-misses aur mistakes report karne ke liye kaafi safe feel karti hain jabki "better" ward ki nurses quietly apni chhupa rahi hain. Ek landmark early study mein, Amy Edmondson ne measure karne ki koshish ki ki kya better hospital teams kam medication errors karti hain, aur initially kuch backwards jaisa dikhne wala paaya: teams jinhe unhone independently higher-functioning rate kiya ZYADA errors report kiye, kam nahi. Deeper investigation ne real mechanism reveal kiya: higher-functioning teams ki genuinely higher psychological safety thi — nurses ek mistake admit karne, ek near-miss report karne, ya ek colleague ki error flag karne mein safe feel karti thi punishment ya humiliation ke dar ke bina — isliye in teams ki error RATES actually higher nahi thi, unki error REPORTING thi. Lower-functioning teams ki wahi ya worse actual error rates thi, par blame ka dar un errors ko hidden, undiscussed, aur consequently unfixed aur recur hone ki likelihood mein rakhta tha. Ye exactly Edmondson ki core, well-documented finding hai: psychological safety — ek shared team belief ki interpersonal risks lena safe hai jaise ek mistake admit karna, ek question poochna jo obvious lag sakta hai, ya ek colleague ke approach ko challenge karna — ek soft, feel-good extra nahi hai. Ye ek specific, measurable mechanism hai jo determine karta hai ki kya ek team ke real problems surface hote hain aur fix hote hain, ya hidden reh jaate hain aur compound hote hain, ise genuine team performance ke sabse strong documented predictors mein se ek banate hue kai fields ke across, engineering bahut hi shamil.',
    },

    simple: `**Why this lesson opens Part VI's shift from user psychology to team
psychology:**

\`\`\`
Parts I-V applied cognitive and behavioral psychology to how users
experience and interact with software. Part VI applies the same
rigorous, evidence-based standard to how engineering TEAMS function —
starting with Edmondson's psychological safety, one of the most
extensively documented findings in team-performance research.
\`\`\`

**Edmondson's core, counterintuitive finding — higher-performing teams
reported MORE errors, not fewer, because they were safe enough to
report them:**

\`\`\`
Edmondson's hospital research initially seemed backwards: teams
independently rated as higher-functioning reported more medication
errors. The real mechanism: these teams had higher psychological
safety, so errors were reported and could be discussed and fixed.
Lower-functioning teams had the same or worse actual error rates, but
fear of blame kept them hidden — meaning REPORTED error count measured
safety, not actual error rate.
\`\`\`

**A concrete, checkable definition of psychological safety — not
"niceness" or absence of disagreement, but specifically the safety to
take interpersonal risk:**

\`\`\`ts
function definesPsychologicalSafety(teamBehavior) {
  return {
    isPsychologicalSafety: teamBehavior.membersCanAdmitMistakesWithoutPunishment
      && teamBehavior.membersCanAskBasicQuestionsWithoutJudgment
      && teamBehavior.membersCanChallengeApproachesRespectfully,
    isNotPsychologicalSafety: teamBehavior.avoidsAllDisagreement
      || teamBehavior.prioritizesComfortOverHonesty,
    // Psychological safety is specifically about interpersonal RISK-
    // TAKING being safe, not about the absence of friction or
    // disagreement — a team can have vigorous technical debate and
    // still be highly psychologically safe
  };
}
\`\`\`

**A concrete, checkable implication for engineering teams specifically
— why psychological safety directly determines whether bugs, technical
debt, and process problems surface early or stay hidden:**

\`\`\`ts
function predictProblemVisibility(teamPsychSafety, actualProblemRate) {
  if (teamPsychSafety === 'low') {
    // Low safety doesn't reduce actual problems — it reduces
    // REPORTED problems, letting real issues compound silently
    return { reportedProblems: 'artificially low', actualProblems: actualProblemRate, risk: 'compounding, undiscussed technical debt' };
  }
  return { reportedProblems: 'reflects reality', actualProblems: actualProblemRate, risk: 'visible and addressable' };
}
\`\`\`

**Why psychological safety is a specific, measurable team property,
not an individual personality trait or a vague "culture" descriptor:**

\`\`\`
Edmondson's research measures psychological safety at the TEAM level,
via specific, validated survey items (e.g., "if you make a mistake on
this team, it is not held against you," "it is safe to take a risk on
this team") — it's a property of the team's shared beliefs and
interaction patterns, not a fixed trait of any individual member,
meaning it can be deliberately built and measurably changed.
\`\`\`

**Why this lesson connects directly back to Module 11's slips-vs-
mistakes framework, applied now at the team level instead of the user
level:**

\`\`\`
Module 11 established that a well-designed error state requires
correctly diagnosing what went wrong before fixing it — punishing a
slip as if it were a mistake makes things worse. Psychological safety
is the team-level precondition for this same diagnostic honesty: a
team can only accurately distinguish a genuine slip from a genuine
misunderstanding, and fix the real cause, if admitting the error in
the first place carries no punishment.
\`\`\`

**How this lesson opens Module 15:** having completed Part V's focus
on designing for user cognition, this module shifts to the psychology
of the engineering team itself. This lesson establishes Edmondson's
psychological safety as a specific, measurable, team-level mechanism —
Lesson 2 applies it concretely to blameless postmortems, and Lesson 3
to what makes code review feedback land rather than trigger
defensiveness.`,

    simpleHi: `**Ye lesson Part VI ke user psychology se team psychology tak shift
ko kaise open karta hai:**

\`\`\`
Parts I-V ne cognitive aur behavioral psychology ko is baat pe apply
kiya ki users software ko kaise experience aur interact karte hain.
Part VI wahi rigorous, evidence-based standard engineering TEAMS kaise
function karti hain us pe apply karta hai — Edmondson ki psychological
safety se shuru hote hue, team-performance research mein sabse
extensively documented findings mein se ek.
\`\`\`

**Edmondson ki core, counterintuitive finding — higher-performing
teams ne ZYADA errors report kiye, kam nahi, kyunki wo unhe report
karne ke liye kaafi safe thi:**

\`\`\`
Edmondson ki hospital research initially backwards jaisi lagti thi:
teams jinhe independently higher-functioning rate kiya gaya zyada
medication errors report kiya. Real mechanism: in teams ki higher
psychological safety thi, isliye errors report kiye ja sakte the aur
discuss aur fix kiye ja sakte the. Lower-functioning teams ki wahi ya
worse actual error rates thi, par blame ka dar unhe hidden rakhta tha
— matlab REPORTED error count ne safety measure ki, actual error rate
nahi.
\`\`\`

**Psychological safety ki ek concrete, checkable definition — "niceness"
ya disagreement ki absence nahi, balki specifically interpersonal risk
lene ki safety:**

\`\`\`ts
function definesPsychologicalSafety(teamBehavior) {
  return {
    isPsychologicalSafety: teamBehavior.membersCanAdmitMistakesWithoutPunishment
      && teamBehavior.membersCanAskBasicQuestionsWithoutJudgment
      && teamBehavior.membersCanChallengeApproachesRespectfully,
    isNotPsychologicalSafety: teamBehavior.avoidsAllDisagreement
      || teamBehavior.prioritizesComfortOverHonesty,
    // Psychological safety specifically interpersonal RISK-TAKING ke
    // safe hone ke baare mein hai, friction ya disagreement ki
    // absence ke baare mein nahi — ek team vigorous technical debate
    // rakh sakta hai aur abhi bhi highly psychologically safe ho
    // sakta hai
  };
}
\`\`\`

**Specifically engineering teams ke liye ek concrete, checkable
implication — psychological safety directly kyun determine karta hai
ki bugs, technical debt, aur process problems early surface hote hain
ya hidden rehte hain:**

\`\`\`ts
function predictProblemVisibility(teamPsychSafety, actualProblemRate) {
  if (teamPsychSafety === 'low') {
    // Low safety actual problems kam nahi karti — ye REPORTED
    // problems kam karti hai, real issues ko silently compound karne
    // deti hai
    return { reportedProblems: 'artificially low', actualProblems: actualProblemRate, risk: 'compounding, undiscussed technical debt' };
  }
  return { reportedProblems: 'reflects reality', actualProblems: actualProblemRate, risk: 'visible and addressable' };
}
\`\`\`

**Psychological safety ek specific, measurable team property kyun hai,
ek individual personality trait ya ek vague "culture" descriptor nahi:**

\`\`\`
Edmondson ki research psychological safety ko TEAM level pe measure
karti hai, specific, validated survey items ke through (jaise, "agar
aap is team pe ek mistake karte hain, ye aapke against hold nahi kiya
jaata," "is team pe risk lena safe hai") — ye team ke shared beliefs
aur interaction patterns ki ek property hai, kisi bhi individual
member ka ek fixed trait nahi, matlab ise deliberately build aur
measurably change kiya ja sakta hai.
\`\`\`

**Ye lesson directly wapas Module 11 ke slips-vs-mistakes framework se
kaise connect karta hai, ab team level pe applied user level ke bajaye:**

\`\`\`
Module 11 ne establish kiya ki ek well-designed error state ko fix
karne se pehle correctly diagnose karna chahiye ki kya galat hua —
ek slip ko punish karna jaise wo ek mistake ho cheezon ko worse banata
hai. Psychological safety wahi diagnostic honesty ke liye team-level
precondition hai: ek team accurately ek genuine slip ko ek genuine
misunderstanding se sirf tabhi distinguish kar sakti hai, aur real
cause fix kar sakti hai, agar error admit karna pehli jagah pe koi
punishment carry nahi karta.
\`\`\`

**Ye lesson Module 15 ko kaise open karta hai:** Part V ke user
cognition ke liye design karne pe focus complete karne ke baad, ye
module engineering team ki psychology ki taraf shift karta hai. Ye
lesson Edmondson ki psychological safety ko ek specific, measurable,
team-level mechanism ki tarah establish karta hai — Lesson 2 ise
blameless postmortems pe concretely apply karta hai, aur Lesson 3 is
baat pe ki code review feedback kya land karta hai defensiveness
trigger karne ke bajaye.`,

    content: `## Why this lesson opens Part VI's shift from user psychology to
team psychology

Parts I-V applied rigorous, evidence-based psychology to how users
experience and interact with software. Part VI applies the identical
standard to how engineering teams themselves function, opening with
Edmondson's psychological safety research — one of the most
extensively documented and replicated findings in team-performance
research across many fields, engineering included.

## Why Edmondson's counterintuitive early finding reveals the real
mechanism behind psychological safety

Edmondson's landmark hospital research initially found something that
seemed backwards: teams independently rated as higher-functioning
reported MORE medication errors, not fewer. Deeper investigation
revealed the actual mechanism: these teams had higher psychological
safety, meaning members felt safe admitting mistakes and reporting
near-misses, so their reported error count reflected genuine
transparency rather than a genuinely higher error rate. Lower-
functioning teams likely had the same or worse actual error rates, but
fear of blame kept them hidden, undiscussed, and unresolved. This
reveals that psychological safety isn't a soft or optional cultural
nicety — it directly determines whether a team's real problems surface
and get addressed.

## Why psychological safety has a specific, checkable definition
distinct from "niceness" or the absence of disagreement

Psychological safety specifically concerns whether it's safe to take
interpersonal risks — admitting a mistake, asking a question that
might seem basic, or challenging a colleague's approach — without fear
of punishment or humiliation. This is a distinct, checkable property
from mere agreeableness or conflict avoidance: a team can engage in
vigorous, direct technical debate and still have high psychological
safety, while a team that avoids all friction to maintain surface-level
comfort may actually have low psychological safety if genuine mistakes
or disagreements are never voiced.

## Why psychological safety directly determines whether engineering
problems surface early or compound silently

Applying Edmondson's hospital finding directly to engineering: low
psychological safety doesn't reduce a team's actual rate of bugs,
technical debt, or process problems — it reduces the rate at which
those problems get reported and discussed, allowing real issues to
compound silently and resurface later at higher cost. High
psychological safety means the reported problem rate more accurately
reflects the actual problem rate, making genuine issues visible and
addressable while they're still small.

## Why psychological safety is a measurable team property, not a
fixed individual trait

Edmondson's research measures psychological safety at the team level
using specific, validated survey items (for example, whether making a
mistake on the team is held against a person, or whether it's safe to
take a risk on the team). This means psychological safety is a
property of a team's shared beliefs and interaction patterns —
something that can be deliberately built, measured, and changed over
time — rather than a fixed trait belonging to any particular
individual on the team.

## Why this lesson connects directly to Module 11's slips-vs-mistakes
framework, now applied at the team level

Module 11 established that correctly diagnosing whether an error is a
slip or a mistake, before attempting to fix it, requires that the
error be admitted and examined honestly in the first place. Psychological
safety is the team-level precondition for this same diagnostic
honesty: a team can only accurately distinguish a genuine slip from a
genuine misunderstanding — and address the real underlying cause — if
admitting the error carries no punishment, directly extending Module
11's individual-error framework to the team context.

## How this lesson opens Module 15

Having completed Part V's focus on designing for user cognition, this
module shifts to the psychology of the engineering team itself. This
lesson establishes Edmondson's psychological safety as a specific,
measurable, team-level mechanism underlying whether real problems get
surfaced and fixed. Lesson 2 applies this concretely to blameless
postmortems as a specific practice built directly on this foundation,
and Lesson 3 applies it to what makes code review feedback land rather
than trigger defensiveness.`,

    contentHi: `## Ye lesson Part VI ke user psychology se team psychology tak shift ko kyun open karta hai

Parts I-V ne rigorous, evidence-based psychology ko is baat pe apply
kiya ki users software ko kaise experience aur interact karte hain.
Part VI wahi identical standard engineering teams khud kaise function
karti hain us pe apply karta hai, Edmondson ki psychological safety
research se open hote hue — kai fields ke across, engineering shamil,
team-performance research mein sabse extensively documented aur
replicated findings mein se ek.

## Edmondson ki counterintuitive early finding psychological safety ke peeche real mechanism ko kyun reveal karti hai

Edmondson ki landmark hospital research ne initially kuch backwards
jaisa dikhne wala paaya: teams jinhe independently higher-functioning
rate kiya gaya ZYADA medication errors report kiye, kam nahi. Deeper
investigation ne actual mechanism reveal kiya: in teams ki higher
psychological safety thi, matlab members mistakes admit karne aur
near-misses report karne mein safe feel karte the, isliye unka reported
error count genuine transparency reflect karta tha, ek genuinely
higher error rate nahi. Lower-functioning teams ki likely wahi ya
worse actual error rates thi, par blame ka dar unhe hidden, undiscussed,
aur unresolved rakhta tha. Ye reveal karta hai ki psychological safety
ek soft ya optional cultural nicety nahi hai — ye directly determine
karta hai ki kya team ke real problems surface hote hain aur address
kiye jaate hain.

## Psychological safety ki ek specific, checkable definition kyun hai jo "niceness" ya disagreement ki absence se distinct hai

Psychological safety specifically is baare mein concerned hai ki kya
interpersonal risks lena safe hai — ek mistake admit karna, ek question
poochna jo basic lag sakta hai, ya ek colleague ke approach ko
challenge karna — punishment ya humiliation ke dar ke bina. Ye ek
distinct, checkable property hai mere agreeableness ya conflict
avoidance se: ek team vigorous, direct technical debate mein engage
kar sakti hai aur abhi bhi high psychological safety rakh sakti hai,
jabki ek team jo surface-level comfort maintain karne ke liye sab
friction avoid karti hai actually low psychological safety rakh sakti
hai agar genuine mistakes ya disagreements kabhi voice nahi kiye jaate.

## Psychological safety directly kyun determine karti hai ki engineering problems early surface hote hain ya silently compound hote hain

Edmondson ki hospital finding ko directly engineering pe apply karte
hue: low psychological safety ek team ki bugs, technical debt, ya
process problems ki actual rate kam nahi karti — ye us rate ko kam
karti hai jispe wo problems report aur discuss kiye jaate hain, real
issues ko silently compound hone dete hue aur baad mein higher cost pe
resurface karne dete hue. High psychological safety ka matlab hai ki
reported problem rate actual problem rate ko zyada accurately reflect
karta hai, genuine issues ko visible aur addressable banate hue jab wo
abhi bhi chhote hain.

## Psychological safety ek measurable team property kyun hai, ek fixed individual trait nahi

Edmondson ki research psychological safety ko team level pe measure
karti hai specific, validated survey items use karke (jaise, kya team
pe ek mistake karna ek insaan ke against hold kiya jaata hai, ya kya
team pe risk lena safe hai). Iska matlab hai psychological safety ek
team ke shared beliefs aur interaction patterns ki ek property hai —
kuch jise deliberately build, measure, aur time ke saath change kiya ja
sakta hai — team pe kisi particular individual ka ek fixed trait hone
ke bajaye.

## Ye lesson directly Module 11 ke slips-vs-mistakes framework se kaise connect karta hai, ab team level pe applied

Module 11 ne establish kiya ki correctly diagnose karna ki kya ek error
ek slip hai ya ek mistake, use fix karne ki koshish karne se pehle,
maangta hai ki error ko honestly admit aur examine kiya jaaye pehli
jagah pe. Psychological safety wahi diagnostic honesty ke liye
team-level precondition hai: ek team accurately ek genuine slip ko ek
genuine misunderstanding se sirf tabhi distinguish kar sakti hai — aur
real underlying cause address kar sakti hai — agar error admit karna
koi punishment carry nahi karta, directly Module 11 ke individual-error
framework ko team context tak extend karte hue.

## Ye lesson Module 15 ko kaise open karta hai

Part V ke user cognition ke liye design karne pe focus complete karne
ke baad, ye module engineering team ki psychology ki taraf shift karta
hai. Ye lesson Edmondson ki psychological safety ko ek specific,
measurable, team-level mechanism ki tarah establish karta hai jo
underlying karta hai ki kya real problems surface hote hain aur fix
hote hain. Lesson 2 ise blameless postmortems pe concretely apply
karta hai ek specific practice ki tarah jo directly is foundation pe
built hai, aur Lesson 3 ise is baat pe apply karta hai ki code review
feedback kya land karta hai defensiveness trigger karne ke bajaye.`,

    examples: [
      {
        title: "A psychological-safety definer and a problem-visibility predictor applied to a real engineering-team scenario",
        titleHi: "Ek psychological-safety definer aur ek problem-visibility predictor jo ek real engineering-team scenario pe applied hai",
        codeJs: `function definesPsychologicalSafety(teamBehavior) {
  return {
    isPsychologicalSafety: teamBehavior.membersCanAdmitMistakesWithoutPunishment
      && teamBehavior.membersCanAskBasicQuestionsWithoutJudgment
      && teamBehavior.membersCanChallengeApproachesRespectfully,
    isNotPsychologicalSafety: teamBehavior.avoidsAllDisagreement
      || teamBehavior.prioritizesComfortOverHonesty,
  };
}

function predictProblemVisibility(teamPsychSafety, actualProblemRate) {
  if (teamPsychSafety === 'low') {
    return { reportedProblems: 'artificially low', actualProblems: actualProblemRate, risk: 'compounding, undiscussed technical debt' };
  }
  return { reportedProblems: 'reflects reality', actualProblems: actualProblemRate, risk: 'visible and addressable' };
}

// A team where engineers openly debate architecture choices but never
// punish a teammate for a production incident
const teamA = {
  membersCanAdmitMistakesWithoutPunishment: true,
  membersCanAskBasicQuestionsWithoutJudgment: true,
  membersCanChallengeApproachesRespectfully: true,
  avoidsAllDisagreement: false,
  prioritizesComfortOverHonesty: false,
};
console.log(definesPsychologicalSafety(teamA));
// { isPsychologicalSafety: true, isNotPsychologicalSafety: false }

console.log(predictProblemVisibility('low', 'moderate'));
// { reportedProblems: 'artificially low', actualProblems: 'moderate', risk: 'compounding, undiscussed technical debt' }`,
        codeTs: `interface TeamBehavior {
  membersCanAdmitMistakesWithoutPunishment: boolean;
  membersCanAskBasicQuestionsWithoutJudgment: boolean;
  membersCanChallengeApproachesRespectfully: boolean;
  avoidsAllDisagreement: boolean;
  prioritizesComfortOverHonesty: boolean;
}

function definesPsychologicalSafety(teamBehavior: TeamBehavior) {
  return {
    isPsychologicalSafety: teamBehavior.membersCanAdmitMistakesWithoutPunishment
      && teamBehavior.membersCanAskBasicQuestionsWithoutJudgment
      && teamBehavior.membersCanChallengeApproachesRespectfully,
    isNotPsychologicalSafety: teamBehavior.avoidsAllDisagreement
      || teamBehavior.prioritizesComfortOverHonesty,
  };
}

type PsychSafetyLevel = 'low' | 'high';

function predictProblemVisibility(teamPsychSafety: PsychSafetyLevel, actualProblemRate: string) {
  if (teamPsychSafety === 'low') {
    return { reportedProblems: 'artificially low', actualProblems: actualProblemRate, risk: 'compounding, undiscussed technical debt' };
  }
  return { reportedProblems: 'reflects reality', actualProblems: actualProblemRate, risk: 'visible and addressable' };
}

const teamA: TeamBehavior = {
  membersCanAdmitMistakesWithoutPunishment: true,
  membersCanAskBasicQuestionsWithoutJudgment: true,
  membersCanChallengeApproachesRespectfully: true,
  avoidsAllDisagreement: false,
  prioritizesComfortOverHonesty: false,
};
console.log(definesPsychologicalSafety(teamA));
// { isPsychologicalSafety: true, isNotPsychologicalSafety: false }

console.log(predictProblemVisibility('low', 'moderate'));
// { reportedProblems: 'artificially low', actualProblems: 'moderate', risk: 'compounding, undiscussed technical debt' }`,
        code: `if (teamPsychSafety === 'low') {
  return { reportedProblems: 'artificially low', actualProblems: actualProblemRate, risk: '...' };
}
// models Edmondson's core finding: low safety suppresses REPORTED problems, not actual ones`,
        output:
          "Team A correctly registers as psychologically safe since it satisfies all three positive criteria and neither negative one; the visibility predictor correctly shows that low psychological safety produces an artificially low reported-problem count even when the actual problem rate is moderate, directly modeling Edmondson's core hospital finding.",
        explain:
          "This example operationalizes Edmondson's central, counterintuitive finding directly: psychological safety is checked against specific behavioral criteria rather than vague 'niceness,' and the visibility predictor makes explicit that low safety suppresses reporting, not the underlying problem rate itself.",
        explainHi:
          "Ye example Edmondson ki central, counterintuitive finding ko directly operationalize karta hai: psychological safety ko specific behavioral criteria ke against check kiya jaata hai vague 'niceness' ke bajaye, aur visibility predictor explicit banata hai ki low safety reporting ko suppress karti hai, underlying problem rate ko khud nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Treating a quiet, conflict-free team as automatically
// psychologically safe
function assessTeamHealthWrong(team) {
  return {
    isHealthy: team.hasNoVisibleConflict && team.meetingsAreCalm,
    // Mistakes the ABSENCE of visible friction for genuine
    // psychological safety — a team avoiding all disagreement or
    // honest feedback can look calm while actually suppressing real
    // problems
  };
}`,
        right: `// Assessing psychological safety via the specific, checkable
// criteria Edmondson's research actually measures
function assessTeamHealthRight(team) {
  return {
    isHealthy: team.membersCanAdmitMistakesWithoutPunishment
      && team.membersCanAskBasicQuestionsWithoutJudgment
      && team.membersCanChallengeApproachesRespectfully,
    // Checks the actual mechanism: safety to take interpersonal risk,
    // not surface-level calm
  };
}`,
        why: "A quiet, conflict-free team can appear healthy while actually suppressing real disagreement and hidden mistakes out of fear, exactly the failure mode Edmondson's research identified — genuine psychological safety is specifically about the safety to take interpersonal risk, which a calm surface can either reflect or conceal.",
        whyHi:
          "Ek quiet, conflict-free team healthy dikh sakta hai jabki actually real disagreement aur hidden mistakes ko dar ki wajah se suppress kar raha ho, exactly wo failure mode jise Edmondson ki research ne identify kiya — genuine psychological safety specifically interpersonal risk lene ki safety ke baare mein hai, jise ek calm surface ya to reflect kar sakta hai ya conceal kar sakta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production engineering org's leadership was initially alarmed when a newly formed team started reporting significantly more incidents and near-misses than its peer teams after a reorg — until an Edmondson-informed review revealed the new team simply had higher psychological safety and was surfacing issues that peer teams, with lower safety, were quietly absorbing and hiding, leading leadership to invest in safety-building practices across the org rather than penalizing the more transparent team.",
        hi: "Ek production engineering org ki leadership initially alarmed hui jab ek newly formed team ne significantly zyada incidents aur near-misses report karna shuru kiya apni peer teams se ek reorg ke baad — jab tak ek Edmondson-informed review ne reveal nahi kiya ki nayi team ki simply higher psychological safety thi aur wo issues surface kar rahi thi jinhe peer teams, lower safety ke saath, quietly absorb aur hide kar rahi thi, leadership ko org ke across safety-building practices mein invest karne ki taraf le jaate hue us zyada transparent team ko penalize karne ke bajaye.",
      },
    ],

    interviewQA: [
      {
        q: "What did Amy Edmondson's hospital research initially find that seemed counterintuitive, and what was the actual explanation?",
        qHi: 'Amy Edmondson ki hospital research ne initially kya paaya jo counterintuitive lagta tha, aur actual explanation kya thi?',
        a: "Teams independently rated as higher-functioning reported MORE medication errors, not fewer. The actual explanation: these teams had higher psychological safety, so errors were reported and could be discussed and fixed, while lower-functioning teams had the same or worse actual error rates but hid them out of fear of blame.",
        aHi: 'Teams jinhe independently higher-functioning rate kiya gaya ZYADA medication errors report kiye, kam nahi. Actual explanation: in teams ki higher psychological safety thi, isliye errors report kiye ja sakte the aur discuss aur fix kiye ja sakte the, jabki lower-functioning teams ki wahi ya worse actual error rates thi par unhone blame ke dar ki wajah se unhe hide kiya.',
      },
      {
        q: 'Why is psychological safety specifically about the safety to take interpersonal risk, rather than the absence of disagreement or friction?',
        qHi: 'Psychological safety specifically interpersonal risk lene ki safety ke baare mein kyun hai, disagreement ya friction ki absence ke baare mein nahi?',
        a: "A team can engage in vigorous, direct technical debate and still have high psychological safety, while a team that avoids all friction to maintain surface comfort may have low psychological safety if genuine mistakes or disagreements are never voiced. The mechanism is specifically whether admitting a mistake or challenging an approach carries a risk of punishment or humiliation.",
        aHi: 'Ek team vigorous, direct technical debate mein engage kar sakti hai aur abhi bhi high psychological safety rakh sakti hai, jabki ek team jo surface comfort maintain karne ke liye sab friction avoid karti hai low psychological safety rakh sakti hai agar genuine mistakes ya disagreements kabhi voice nahi kiye jaate. Mechanism specifically ye hai ki kya ek mistake admit karna ya ek approach challenge karna punishment ya humiliation ka risk carry karta hai.',
      },
    ],

    exercises: [
      {
        task: "A team lead notices their team reports very few bugs or incidents in retrospectives, and initially interprets this as evidence of high code quality. Using this lesson's framework, explain what alternative explanation should be investigated before accepting that conclusion, and what a low-cost way to check it might be.",
        taskHi: "Ek team lead notice karta hai ki unki team retrospectives mein bahut kam bugs ya incidents report karti hai, aur initially ise high code quality ka evidence ki tarah interpret karta hai. Is lesson ke framework use karke, explain karo ki us conclusion ko accept karne se pehle kaunsa alternative explanation investigate kiya jaana chahiye, aur ise check karne ka ek low-cost tareeka kya ho sakta hai.",
        hint: "Recall Edmondson's core finding: a low reported-problem count can mean either genuinely low problems OR low psychological safety suppressing reporting — think about what a private, anonymous survey using Edmondson's actual measurement items could reveal.",
        hintHi: 'Edmondson ki core finding yaad karo: ek low reported-problem count ka matlab ya to genuinely low problems ho sakta hai YA low psychological safety jo reporting ko suppress kar rahi hai — socho ki ek private, anonymous survey jo Edmondson ke actual measurement items use karta hai kya reveal kar sakta hai.',
      },
    ],

    keyTakeaways: [
      "Edmondson's landmark finding: teams rated as higher-functioning reported MORE errors, because higher psychological safety meant errors were surfaced rather than hidden — reported error count measured safety, not actual error rate.",
      "Psychological safety is specifically about the safety to take interpersonal risk (admitting mistakes, asking basic questions, challenging approaches) — not the absence of disagreement or surface-level niceness.",
      "Low psychological safety doesn't reduce a team's actual problem rate — it reduces the rate at which problems are reported and discussed, letting real issues compound silently.",
      "Psychological safety is a measurable, team-level property that can be deliberately built and changed — not a fixed individual trait — setting up Lesson 2's blameless postmortems and Lesson 3's code-review feedback patterns.",
    ],
    keyTakeawaysHi: [
      'Edmondson ki landmark finding: teams jinhe higher-functioning rate kiya gaya ZYADA errors report kiye, kyunki higher psychological safety ka matlab tha errors hidden hone ke bajaye surface hue — reported error count ne safety measure ki, actual error rate nahi.',
      'Psychological safety specifically interpersonal risk lene ki safety ke baare mein hai (mistakes admit karna, basic questions poochna, approaches challenge karna) — disagreement ya surface-level niceness ki absence nahi.',
      'Low psychological safety ek team ki actual problem rate kam nahi karti — ye us rate ko kam karti hai jispe problems report aur discuss kiye jaate hain, real issues ko silently compound hone dete hue.',
      'Psychological safety ek measurable, team-level property hai jise deliberately build aur change kiya ja sakta hai — ek fixed individual trait nahi — Lesson 2 ke blameless postmortems aur Lesson 3 ke code-review feedback patterns ko set up karte hue.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'psych-blameless-postmortems',
    title: 'Blameless Postmortems as Psychological Safety in Practice',
    titleHi: "Blameless Postmortems Psychological Safety In Practice Ki Tarah",
    description:
      "A concrete engineering practice built directly on Lesson 1's psychological safety findings and Module 11's slips-vs-mistakes framework: how blameless postmortems structurally separate 'what happened and why' from 'who is at fault,' and why this structure — not merely good intentions — is what makes them work.",
    descriptionHi:
      'Ek concrete engineering practice jo directly Lesson 1 ke psychological safety findings aur Module 11 ke slips-vs-mistakes framework pe built hai: blameless postmortems structurally "kya hua aur kyun" ko "kaun fault mein hai" se kaise separate karte hain, aur ye structure — sirf good intentions nahi — unhe kaam karne wala kya banata hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**Aviation crash investigation, which is deliberately structured so a pilot involved in an incident can report it, and even testify to investigators, without it being used to punish them — because the field learned, at real cost, that punishing honest reports simply teaches everyone to stop making them.** Aviation safety investigation is built on a specific, deliberate structural choice: in many voluntary reporting systems, a pilot who reports their own near-miss or error is granted a real, structural protection from punitive consequences for that specific report, precisely so the information reaches investigators instead of staying hidden. This isn't leniency for its own sake — it's a hard-won, well-documented recognition that punishing honest self-reporting doesn't reduce errors, it only reduces REPORTS of errors, exactly Edmondson's hospital finding applied to aviation. A pilot who fears career-ending consequences for reporting a genuine mistake will, entirely predictably, stop reporting mistakes, and the systemic pattern behind that mistake — a confusing cockpit layout, an ambiguous procedure, a training gap — stays invisible and keeps causing the same failure in other pilots. This is exactly the structural insight behind a blameless postmortem: it deliberately, structurally separates the question \"what happened, and what in the system allowed it to happen\" from the question \"whose fault was it,\" not because individual accountability doesn't matter, but because a genuine investigation into systemic causes requires the same honest, judgment-free reporting aviation learned to protect — and this lesson establishes that the SPECIFIC STRUCTURE of the practice, not merely good intentions or a stated blameless policy, is what actually determines whether it works.",
      hi: 'aviation crash investigation, jo deliberately is tarike se structured hai ki ek pilot jo ek incident mein involved hai ise report kar sakta hai, aur investigators ko testify bhi kar sakta hai, ise unhe punish karne ke liye use kiye bina — kyunki field ne, real cost pe, seekha ki honest reports ko punish karna simply sabko sikha deta hai unhe banana band karna. Aviation safety investigation ek specific, deliberate structural choice pe built hai: kai voluntary reporting systems mein, ek pilot jo apna khud ka near-miss ya error report karta hai use us specific report ke liye punitive consequences se ek real, structural protection di jaati hai, precisely isliye ki information investigators tak pahunche hidden rehne ke bajaye. Ye apni khud ki khatir leniency nahi hai — ye ek hard-won, well-documented recognition hai ki honest self-reporting ko punish karna errors kam nahi karta, ye sirf errors ki REPORTS kam karta hai, exactly Edmondson ki hospital finding aviation pe applied. Ek pilot jo ek genuine mistake report karne ke liye career-ending consequences se darta hai, entirely predictably, mistakes report karna band kar dega, aur us mistake ke peeche systemic pattern — ek confusing cockpit layout, ek ambiguous procedure, ek training gap — invisible reh jaata hai aur doosre pilots mein wahi failure cause karta rehta hai. Ye exactly wo structural insight hai ek blameless postmortem ke peeche: ye deliberately, structurally question "kya hua, aur system mein kya cheez ne ise hone diya" ko question "kiski fault thi" se separate karta hai, is wajah se nahi ki individual accountability matter nahi karti, balki is wajah se ki systemic causes ki ek genuine investigation ko wahi honest, judgment-free reporting chahiye jise aviation ne protect karna seekha — aur ye lesson establish karta hai ki practice ka SPECIFIC STRUCTURE, sirf good intentions ya ek stated blameless policy nahi, wo hai jo actually determine karta hai ki ye kaam karta hai ya nahi.',
    },

    simple: `**Why blameless postmortems apply Lesson 1's psychological safety
findings as a concrete, structural engineering practice:**

\`\`\`
Lesson 1 established that psychological safety determines whether a
team's real problems surface and get fixed, or stay hidden. A
blameless postmortem is a specific, structured practice built directly
on this finding — deliberately separating "what happened and why" from
"who is at fault" to preserve the honest reporting Edmondson's research
identified as the actual mechanism behind safety.
\`\`\`

**A concrete, checkable structural difference between a blame-oriented
and a genuinely blameless postmortem — the STRUCTURE, not stated
intent, is what determines the outcome:**

\`\`\`ts
function auditPostmortemStructure(postmortemQuestions) {
  const asksWhoNotWhat = postmortemQuestions.some((q) => q.includes('who') || q.includes('whose fault'));
  const asksSystemicWhy = postmortemQuestions.some((q) => q.includes('what allowed this') || q.includes('what in our process'));
  return {
    isStructurallyBlameless: !asksWhoNotWhat && asksSystemicWhy,
    // A stated "we're blameless here" policy doesn't matter if the
    // actual questions asked in the room still target individuals
  };
}
\`\`\`

**Why blameless postmortems directly apply Module 11's slips-vs-
mistakes framework at the team level:**

\`\`\`
Module 11 established that a slip (correct intention, failed
execution) and a mistake (incorrect intention, executed as planned)
require different fixes, and correctly diagnosing which occurred
requires honest examination. A blameless postmortem creates the
psychological-safety precondition for this same diagnosis at the team
level — asking "what made this error easy to make" rather than "why
didn't you just do it right" surfaces the real, fixable systemic
cause.
\`\`\`

**A concrete, checkable pattern for postmortem questions — targeting
the system and process, not the individual, while still capturing what
specifically happened:**

\`\`\`ts
function reframePostmortemQuestion(blameOrientedQuestion) {
  const reframes = {
    'why didn\\'t you check the config before deploying?':
      'what in our deploy process made it possible to ship without this check?',
    'why did you miss that edge case?':
      'what about our test coverage or review process let this edge case through?',
  };
  return reframes[blameOrientedQuestion] || blameOrientedQuestion;
}
\`\`\`

**Why blameless doesn't mean consequence-free or accountability-free —
a specific, important boundary directly addressing a common
misunderstanding:**

\`\`\`
Blameless specifically means the INVESTIGATION separates fault-finding
from cause-finding — it doesn't mean genuine, repeated negligence or
bad-faith actions are never addressed. The distinction is: a genuine
slip or an honest mistake made under reasonable circumstances gets
examined for systemic cause, not punished; a pattern of genuine
negligence is a separate, legitimate management concern handled
through a different process, not folded into the incident
investigation itself.
\`\`\`

**Why this structural separation directly parallels aviation's
voluntary-reporting protections, and why that parallel is instructive
rather than merely decorative:**

\`\`\`
Aviation's voluntary reporting systems grant real, structural
protection from punitive consequences specifically for the report
itself, precisely because punishing honest reporting doesn't reduce
errors — it only reduces reports of errors, exactly Edmondson's
finding. A blameless postmortem's structural separation of cause from
fault is the software-engineering equivalent of this same, hard-won
lesson.
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established Edmondson's
psychological safety as the team-level mechanism determining whether
real problems surface. This lesson applies that finding concretely as
a specific, structural practice — the blameless postmortem — directly
extending Module 11's slips-vs-mistakes framework to the team level.
Lesson 3 completes the module by applying the identical safety
foundation to what makes code review feedback land rather than trigger
defensiveness.`,

    simpleHi: `**Blameless postmortems Lesson 1 ke psychological safety findings ko
ek concrete, structural engineering practice ki tarah kaise apply
karte hain:**

\`\`\`
Lesson 1 ne establish kiya ki psychological safety determine karti hai
ki kya team ke real problems surface hote hain aur fix hote hain, ya
hidden reh jaate hain. Ek blameless postmortem ek specific, structured
practice hai jo directly is finding pe built hai — deliberately "kya
hua aur kyun" ko "kaun fault mein hai" se separate karte hue wahi
honest reporting preserve karne ke liye jise Edmondson ki research ne
safety ke peeche actual mechanism ki tarah identify kiya.
\`\`\`

**Ek blame-oriented aur ek genuinely blameless postmortem ke beech ek
concrete, checkable structural difference — STRUCTURE, stated intent
nahi, wo hai jo outcome determine karta hai:**

\`\`\`ts
function auditPostmortemStructure(postmortemQuestions) {
  const asksWhoNotWhat = postmortemQuestions.some((q) => q.includes('who') || q.includes('whose fault'));
  const asksSystemicWhy = postmortemQuestions.some((q) => q.includes('what allowed this') || q.includes('what in our process'));
  return {
    isStructurallyBlameless: !asksWhoNotWhat && asksSystemicWhy,
    // Ek stated "hum yahan blameless hain" policy matter nahi karti
    // agar room mein poochhe gaye actual questions abhi bhi
    // individuals ko target karte hain
  };
}
\`\`\`

**Blameless postmortems directly Module 11 ke slips-vs-mistakes
framework ko team level pe kaise apply karte hain:**

\`\`\`
Module 11 ne establish kiya ki ek slip (correct intention, failed
execution) aur ek mistake (incorrect intention, executed as planned)
ko different fixes chahiye, aur correctly diagnose karna ki kya hua
honest examination maangta hai. Ek blameless postmortem wahi
psychological-safety precondition create karta hai isi diagnosis ke
liye team level pe — "is error ko banana kya easy banaya" poochna
"tumne sahi kyun nahi kiya" ke bajaye real, fixable systemic cause
surface karta hai.
\`\`\`

**Postmortem questions ke liye ek concrete, checkable pattern —
system aur process ko target karna, individual ko nahi, jabki abhi bhi
specifically kya hua ise capture karte hue:**

\`\`\`ts
function reframePostmortemQuestion(blameOrientedQuestion) {
  const reframes = {
    'why didn\\'t you check the config before deploying?':
      'what in our deploy process made it possible to ship without this check?',
    'why did you miss that edge case?':
      'what about our test coverage or review process let this edge case through?',
  };
  return reframes[blameOrientedQuestion] || blameOrientedQuestion;
}
\`\`\`

**Blameless ka matlab consequence-free ya accountability-free nahi hai
— ek specific, important boundary jo directly ek common
misunderstanding ko address karta hai:**

\`\`\`
Blameless specifically ka matlab hai ki INVESTIGATION fault-finding ko
cause-finding se separate karti hai — iska matlab ye nahi hai ki
genuine, repeated negligence ya bad-faith actions kabhi address nahi
kiye jaate. Distinction ye hai: ek genuine slip ya ek honest mistake jo
reasonable circumstances ke andar hua systemic cause ke liye examine
kiya jaata hai, punish nahi; genuine negligence ka ek pattern ek
separate, legitimate management concern hai jise ek different process
ke through handle kiya jaata hai, incident investigation mein khud fold
nahi kiya jaata.
\`\`\`

**Ye structural separation directly aviation ke voluntary-reporting
protections ke saath kyun parallel karta hai, aur wo parallel merely
decorative ke bajaye instructive kyun hai:**

\`\`\`
Aviation ke voluntary reporting systems specifically report khud ke
liye punitive consequences se ek real, structural protection dete
hain, precisely kyunki honest reporting ko punish karna errors kam
nahi karta — ye sirf errors ki reports kam karta hai, exactly
Edmondson ki finding. Ek blameless postmortem ka cause ko fault se
structural separation software-engineering ka equivalent hai isi
hard-won lesson ka.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne
Edmondson ki psychological safety ko team-level mechanism ki tarah
establish kiya jo determine karta hai ki kya real problems surface
hote hain. Ye lesson us finding ko concretely ek specific, structural
practice ki tarah apply karta hai — blameless postmortem — directly
Module 11 ke slips-vs-mistakes framework ko team level tak extend karte
hue. Lesson 3 module ko complete karta hai identical safety foundation
ko is baat pe apply karke ki code review feedback kya land karta hai
defensiveness trigger karne ke bajaye.`,

    content: `## Why blameless postmortems apply Lesson 1's psychological safety
findings as a concrete engineering practice

Lesson 1 established that psychological safety determines whether a
team's real problems surface and get fixed, or stay hidden and
compound. A blameless postmortem is a specific, structured practice
built directly on this finding: it deliberately separates the
investigation into "what happened and why" from any determination of
"who is at fault," preserving exactly the honest, judgment-free
reporting Edmondson's research identified as the actual mechanism
behind team safety and performance.

## Why the postmortem's structure, not its stated intent, is what
actually determines whether it works

A team can declare itself "blameless" while the actual questions asked
during an incident review still implicitly or explicitly target
individuals ("why didn't you check this," "whose change caused this").
This lesson establishes that the specific structure of the questions
asked — targeting systemic, process-level causes rather than individual
fault — is what determines the practice's real effect, not a stated
policy alone. A genuinely blameless postmortem can be audited concretely
by checking whether its questions target the system or the person.

## Why blameless postmortems directly extend Module 11's
slips-vs-mistakes framework from the individual to the team level

Module 11 established that correctly distinguishing a slip from a
mistake, and fixing the actual underlying cause, requires honest
examination of what happened. A blameless postmortem creates the
team-level psychological-safety precondition for this same honest
diagnosis: asking "what made this error easy to make" rather than "why
didn't you do it correctly" surfaces the real, fixable systemic cause
— a confusing process, an ambiguous interface, insufficient tooling —
rather than stopping at an individual's failure to overcome a poorly
designed system.

## Why reframing postmortem questions toward systemic causes is a
concrete, checkable practice

A blame-oriented question ("why didn't you check the config before
deploying?") implicitly locates the cause in an individual's judgment
or diligence. The systemic reframe ("what in our deploy process made
it possible to ship without this check?") locates the same underlying
event in the process or system that allowed it, which is both more
likely to be the genuinely fixable cause and less likely to suppress
honest reporting the next time a similar situation arises.

## Why "blameless" doesn't mean consequence-free, addressing a common
and important misunderstanding directly

Blameless specifically refers to how the investigation into a specific
incident is structured — separating cause-finding from fault-finding
for that incident. It does not mean that a genuine, repeated pattern of
negligence or bad-faith action is never addressed; that concern is a
separate, legitimate management matter handled through a different
process, not folded into the incident investigation itself. This
distinction matters because conflating the two either wrongly excuses
genuine negligence or wrongly punishes honest, good-faith error — both
of which undermine the practice's actual purpose.

## Why the aviation parallel is instructive, not merely decorative

Aviation's voluntary reporting systems grant real, structural
protection from punitive consequences specifically for a pilot's own
honest report, precisely because the field learned that punishing
honest reporting doesn't reduce errors — it only reduces reports of
them, directly paralleling Edmondson's hospital finding. A blameless
postmortem's structural separation of cause from fault is the direct
software-engineering equivalent of this same hard-won, cross-industry
lesson, reinforcing that this is a well-documented pattern across
multiple high-stakes fields, not an isolated engineering practice.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established Edmondson's psychological safety as the
team-level mechanism determining whether real problems surface. This
lesson applies that finding concretely through the blameless
postmortem, directly extending Module 11's slips-vs-mistakes framework
to the team level. Lesson 3 completes the module by applying the
identical psychological-safety foundation to what makes code review
feedback land rather than trigger defensiveness.`,

    contentHi: `## Blameless postmortems Lesson 1 ke psychological safety findings ko ek concrete engineering practice ki tarah kyun apply karte hain

Lesson 1 ne establish kiya ki psychological safety determine karti hai
ki kya team ke real problems surface hote hain aur fix hote hain, ya
hidden reh jaate hain aur compound hote hain. Ek blameless postmortem
ek specific, structured practice hai jo directly is finding pe built
hai: ye deliberately investigation ko "kya hua aur kyun" se "kaun
fault mein hai" ke kisi determination se separate karta hai, exactly
wahi honest, judgment-free reporting preserve karte hue jise Edmondson
ki research ne team safety aur performance ke peeche actual mechanism
ki tarah identify kiya.

## Postmortem ka structure, uski stated intent nahi, actually determine karta hai ki ye kaam karta hai ya nahi

Ek team khud ko "blameless" declare kar sakti hai jabki ek incident
review ke dauran poochhe gaye actual questions abhi bhi implicitly ya
explicitly individuals ko target karte hain ("tumne ye check kyun nahi
kiya," "kiske change ne ye cause kiya"). Ye lesson establish karta hai
ki poochhe gaye questions ka specific structure — systemic, process-
level causes ko target karna individual fault ke bajaye — practice ke
real effect ko determine karta hai, ek stated policy akele nahi. Ek
genuinely blameless postmortem ko concretely audit kiya ja sakta hai ye
check karke ki kya uske questions system ko target karte hain ya
person ko.

## Blameless postmortems directly Module 11 ke slips-vs-mistakes framework ko individual se team level tak kyun extend karte hain

Module 11 ne establish kiya ki correctly ek slip ko ek mistake se
distinguish karna, aur actual underlying cause fix karna, kya hua uski
honest examination maangta hai. Ek blameless postmortem wahi team-level
psychological-safety precondition create karta hai isi honest diagnosis
ke liye: "is error ko banana kya easy banaya" poochna "tumne correctly
kyun nahi kiya" ke bajaye real, fixable systemic cause surface karta
hai — ek confusing process, ek ambiguous interface, insufficient
tooling — ek individual ki ek poorly designed system ko overcome karne
mein failure pe rukne ke bajaye.

## Postmortem questions ko systemic causes ki taraf reframe karna ek concrete, checkable practice kyun hai

Ek blame-oriented question ("tumne deploy karne se pehle config check
kyun nahi kiya?") implicitly cause ko ek individual ke judgment ya
diligence mein locate karta hai. Systemic reframe ("hamare deploy
process mein kya cheez ne is check ke bina ship karna possible banaya?")
wahi underlying event ko process ya system mein locate karta hai jisne
ise allow kiya, jo dono zyada likely hai genuinely fixable cause hone
ke liye aur kam likely hai next time ek similar situation arise hone pe
honest reporting suppress karne ke liye.

## "Blameless" ka matlab consequence-free nahi hai, ek common aur important misunderstanding ko directly address karte hue

Blameless specifically refer karta hai is baat ko ki ek specific
incident ki investigation kaise structured hai — us incident ke liye
cause-finding ko fault-finding se separate karte hue. Iska matlab ye
nahi hai ki genuine, repeated negligence ya bad-faith action ka ek
pattern kabhi address nahi kiya jaata; wo concern ek separate,
legitimate management matter hai jise ek different process ke through
handle kiya jaata hai, incident investigation mein khud fold nahi kiya
jaata. Ye distinction matter karta hai kyunki dono ko conflate karna
ya to genuine negligence ko wrongly excuse karta hai ya honest,
good-faith error ko wrongly punish karta hai — dono practice ke actual
purpose ko undermine karte hain.

## Aviation parallel instructive kyun hai, merely decorative nahi

Aviation ke voluntary reporting systems specifically ek pilot ki khud
ki honest report ke liye punitive consequences se ek real, structural
protection dete hain, precisely kyunki field ne seekha ki honest
reporting ko punish karna errors kam nahi karta — ye sirf unki reports
kam karta hai, directly Edmondson ki hospital finding ko parallel karte
hue. Ek blameless postmortem ka cause ko fault se structural separation
software-engineering ka direct equivalent hai isi hard-won,
cross-industry lesson ka, reinforce karte hue ki ye multiple high-stakes
fields ke across ek well-documented pattern hai, ek isolated engineering
practice nahi.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne Edmondson ki psychological safety ko team-level mechanism
ki tarah establish kiya jo determine karta hai ki kya real problems
surface hote hain. Ye lesson us finding ko concretely blameless
postmortem ke through apply karta hai, directly Module 11 ke
slips-vs-mistakes framework ko team level tak extend karte hue. Lesson
3 module ko complete karta hai identical psychological-safety
foundation ko is baat pe apply karke ki code review feedback kya land
karta hai defensiveness trigger karne ke bajaye.`,

    examples: [
      {
        title: 'A postmortem-structure auditor and a question reframer implementing this lesson\'s blameless-practice patterns',
        titleHi: "Ek postmortem-structure auditor aur ek question reframer jo is lesson ke blameless-practice patterns implement karte hain",
        codeJs: `function auditPostmortemStructure(postmortemQuestions) {
  const asksWhoNotWhat = postmortemQuestions.some((q) => q.toLowerCase().includes('who') || q.toLowerCase().includes('whose fault'));
  const asksSystemicWhy = postmortemQuestions.some((q) => q.toLowerCase().includes('what allowed this') || q.toLowerCase().includes('what in our process'));
  return {
    isStructurallyBlameless: !asksWhoNotWhat && asksSystemicWhy,
  };
}

function reframePostmortemQuestion(blameOrientedQuestion) {
  const reframes = {
    "why didn't you check the config before deploying?":
      'what in our deploy process made it possible to ship without this check?',
    'why did you miss that edge case?':
      'what about our test coverage or review process let this edge case through?',
  };
  return reframes[blameOrientedQuestion] || blameOrientedQuestion;
}

const badQuestions = ["who deployed the broken config?", "whose fault was this?"];
console.log(auditPostmortemStructure(badQuestions));
// { isStructurallyBlameless: false }

const goodQuestions = ["what allowed this config to reach production?", "what in our process could have caught this earlier?"];
console.log(auditPostmortemStructure(goodQuestions));
// { isStructurallyBlameless: true }

console.log(reframePostmortemQuestion("why didn't you check the config before deploying?"));
// "what in our deploy process made it possible to ship without this check?"`,
        codeTs: `function auditPostmortemStructure(postmortemQuestions: string[]) {
  const asksWhoNotWhat = postmortemQuestions.some((q) => q.toLowerCase().includes('who') || q.toLowerCase().includes('whose fault'));
  const asksSystemicWhy = postmortemQuestions.some((q) => q.toLowerCase().includes('what allowed this') || q.toLowerCase().includes('what in our process'));
  return {
    isStructurallyBlameless: !asksWhoNotWhat && asksSystemicWhy,
  };
}

function reframePostmortemQuestion(blameOrientedQuestion: string): string {
  const reframes: Record<string, string> = {
    "why didn't you check the config before deploying?":
      'what in our deploy process made it possible to ship without this check?',
    'why did you miss that edge case?':
      'what about our test coverage or review process let this edge case through?',
  };
  return reframes[blameOrientedQuestion] || blameOrientedQuestion;
}

const badQuestions = ["who deployed the broken config?", "whose fault was this?"];
console.log(auditPostmortemStructure(badQuestions));
// { isStructurallyBlameless: false }

const goodQuestions = ["what allowed this config to reach production?", "what in our process could have caught this earlier?"];
console.log(auditPostmortemStructure(goodQuestions));
// { isStructurallyBlameless: true }

console.log(reframePostmortemQuestion("why didn't you check the config before deploying?"));
// "what in our deploy process made it possible to ship without this check?"`,
        code: `const asksWhoNotWhat = postmortemQuestions.some((q) => q.includes('who') || q.includes('whose fault'));
// audits the actual questions asked, not a stated "we're blameless" policy`,
        output:
          "The auditor correctly flags a postmortem asking 'who deployed the broken config' as NOT structurally blameless, while one asking 'what allowed this config to reach production' passes — confirming that the specific questions asked, not a stated policy, determine the practice's real character; the reframer converts a blame-oriented question into its systemic equivalent.",
        explain:
          "This example operationalizes the lesson's central claim that structure, not stated intent, determines whether a postmortem is genuinely blameless — the audit function checks the actual question content, and the reframer demonstrates the concrete mechanical transformation from a fault-locating question to a cause-locating one.",
        explainHi:
          "Ye example lesson ke central claim ko operationalize karta hai ki structure, stated intent nahi, determine karta hai ki ek postmortem genuinely blameless hai ya nahi — audit function actual question content check karta hai, aur reframer ek fault-locating question se ek cause-locating question tak concrete mechanical transformation demonstrate karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// A postmortem template that declares itself "blameless" in its
// header but still structures its questions around individual actions
function PostmortemTemplateWrong() {
  return {
    title: 'Blameless Postmortem',
    questions: [
      'Who made the change that caused the outage?',
      'Why didn\\'t they test it first?',
    ],
    // The stated label doesn't match the actual structure — these
    // questions still target the individual, undermining the honest
    // reporting the practice is meant to protect
  };
}`,
        right: `// A postmortem template whose actual questions target the system
// and process, matching its stated blameless intent
function PostmortemTemplateRight() {
  return {
    title: 'Blameless Postmortem',
    questions: [
      'What in our deploy process allowed this change to reach production without being tested?',
      'What would need to be true for this class of error to be caught automatically next time?',
    ],
    // Questions target the system and process, structurally matching
    // the stated blameless intent
  };
}`,
        why: "A postmortem labeled 'blameless' whose actual questions still target individual actions ('who,' 'why didn't they') undermines the honest reporting the practice depends on, since a team member facing individually-targeted questions experiences the same risk of blame regardless of the document's title — the questions' actual structure, not the label, determines the real effect.",
        whyHi:
          "Ek postmortem jise 'blameless' label kiya gaya hai jiske actual questions abhi bhi individual actions ('kaun,' 'unhone kyun nahi') ko target karte hain us honest reporting ko undermine karta hai jis pe practice depend karti hai, kyunki ek team member jo individually-targeted questions face karta hai wahi blame ka risk experience karta hai document ke title se independently — questions ka actual structure, label nahi, real effect determine karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production engineering team's incident-review process was audited after several engineers privately admitted to a manager that they felt anxious before postmortems despite the company's stated 'blameless' policy; reviewing transcripts revealed the facilitator consistently opened with 'who was on call' and 'who made the change,' and simply changing the opening questions to 'what happened' and 'what allowed it to happen' measurably increased the detail and honesty of subsequent incident reports.",
        hi: 'Ek production engineering team ka incident-review process audit kiya gaya kai engineers ke ek manager ko privately admit karne ke baad ki wo postmortems se pehle anxious feel karte the company ki stated \'blameless\' policy ke bawajood; transcripts review karne se reveal hua ki facilitator consistently \'kaun on call tha\' aur \'kisne change kiya\' se open karta tha, aur simply opening questions ko \'kya hua\' aur \'kya cheez ne ise hone diya\' mein badalne se subsequent incident reports ki detail aur honesty measurably increase hui.',
      },
    ],

    interviewQA: [
      {
        q: "What makes a postmortem genuinely blameless — a stated policy, or something more specific?",
        qHi: 'Ek postmortem ko genuinely blameless kya banata hai — ek stated policy, ya kuch zyada specific?',
        a: "The specific structure of the questions asked during the investigation determines its real character, not a stated policy alone. Questions targeting who did something or why an individual didn't act differently keep the investigation blame-oriented regardless of its label; questions targeting what in the system or process allowed the event are what make it structurally blameless.",
        aHi: 'Investigation ke dauran poochhe gaye questions ka specific structure uska real character determine karta hai, ek stated policy akele nahi. Questions jo target karte hain ki kisne kya kiya ya ek individual ne alag kyun act nahi kiya investigation ko blame-oriented rakhte hain uske label se independently; questions jo target karte hain ki system ya process mein kya cheez ne event ko allow kiya wo hain jo ise structurally blameless banate hain.',
      },
      {
        q: "Does 'blameless' mean a genuine pattern of negligence is never addressed? Why or why not?",
        qHi: 'Kya \'blameless\' ka matlab hai ki genuine negligence ka ek pattern kabhi address nahi kiya jaata? Kyun ya kyun nahi?',
        a: "No — blameless specifically refers to how the investigation into a specific incident is structured, separating cause-finding from fault-finding for that incident. A genuine, repeated pattern of negligence or bad-faith action is a separate, legitimate management matter handled through a different process, not folded into the incident investigation itself.",
        aHi: 'Nahi — blameless specifically refer karta hai is baat ko ki ek specific incident ki investigation kaise structured hai, us incident ke liye cause-finding ko fault-finding se separate karte hue. Genuine, repeated negligence ya bad-faith action ka ek pattern ek separate, legitimate management matter hai jise ek different process ke through handle kiya jaata hai, incident investigation mein khud fold nahi kiya jaata.',
      },
    ],

    exercises: [
      {
        task: "A postmortem document opens with the question 'Why did the on-call engineer not notice the alert for 40 minutes?' Using this lesson's framework, identify why this question is structurally blame-oriented despite not naming a specific person, and propose a systemic reframe that would surface the same underlying issue.",
        taskHi: "Ek postmortem document is question ke saath open hota hai 'On-call engineer ne 40 minutes tak alert kyun notice nahi kiya?' Is lesson ke framework use karke, identify karo ki ye question structurally blame-oriented kyun hai ek specific person ka naam liye bina bhi, aur ek systemic reframe propose karo jo wahi underlying issue surface karega.",
        hint: "Notice that the question still locates the cause in an individual's attentiveness or judgment ('why did [a person] not notice'), even without naming them — think about what question would instead ask about the alerting system's design, escalation policy, or on-call workload.",
        hintHi: 'Notice karo ki question abhi bhi cause ko ek individual ki attentiveness ya judgment mein locate karta hai (\'kyun [ek person] ne notice nahi kiya\'), unhe naam liye bina bhi — socho ki kaunsa question iske bajaye alerting system ke design, escalation policy, ya on-call workload ke baare mein poochhega.',
      },
    ],

    keyTakeaways: [
      "Blameless postmortems apply Lesson 1's psychological safety findings as a concrete engineering practice, deliberately separating cause-finding ('what happened and why') from fault-finding ('who is to blame').",
      "The postmortem's actual question structure, not a stated 'blameless' label, determines whether it genuinely functions this way — questions must target the system/process, not the individual.",
      "This directly extends Module 11's slips-vs-mistakes framework to the team level: honest diagnosis of the real cause requires the same psychological safety to admit and examine what happened.",
      "Blameless doesn't mean consequence-free — it means the incident investigation itself is structurally separated from any separate, legitimate handling of genuine negligence patterns.",
    ],
    keyTakeawaysHi: [
      'Blameless postmortems Lesson 1 ke psychological safety findings ko ek concrete engineering practice ki tarah apply karte hain, deliberately cause-finding (\'kya hua aur kyun\') ko fault-finding (\'kaun blame mein hai\') se separate karte hue.',
      'Postmortem ka actual question structure, ek stated \'blameless\' label nahi, determine karta hai ki kya ye genuinely is tarike se function karta hai — questions ko system/process ko target karna chahiye, individual ko nahi.',
      'Ye directly Module 11 ke slips-vs-mistakes framework ko team level tak extend karta hai: real cause ki honest diagnosis ko wahi psychological safety chahiye kya hua use admit aur examine karne ke liye.',
      'Blameless ka matlab consequence-free nahi hai — iska matlab hai ki incident investigation khud structurally genuine negligence patterns ke kisi separate, legitimate handling se separated hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'psych-code-review-feedback-that-lands',
    title: 'What Makes Code Review Feedback Land Instead of Trigger Defensiveness',
    titleHi: 'Code Review Feedback Kya Land Karta Hai Defensiveness Trigger Karne Ke Bajaye',
    description:
      "Closing this module: applying Lessons 1-2's psychological safety foundation to the specific, recurring engineering interaction of code review — why identical technical feedback lands very differently depending on its framing, and concrete patterns for the difference.",
    descriptionHi:
      'Is module ko close karte hue: Lessons 1-2 ke psychological safety foundation ko code review ke specific, recurring engineering interaction pe apply karte hue — identical technical feedback bahut differently kyun land karta hai uski framing pe depend karte hue, aur us difference ke liye concrete patterns.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**Two surgeons observing the same operation and offering the identical technical correction to a resident — one framing it as 'you did this wrong,' the other framing it as 'here's what I've found works better for this specific situation, and here's why' — where the resident's actual ability to hear, retain, and apply the correction differs dramatically despite the underlying technical content being identical.** Surgical training has documented this exact phenomenon: the same precise technical correction, delivered with a framing that implies personal deficiency versus a framing that shares specific, situational expertise, produces measurably different outcomes in whether the resident actually integrates the feedback into their practice or becomes defensively focused on justifying their original choice. This isn't about being gentle for its own sake, or avoiding all direct correction — a resident absolutely needs to know their technique needs to change, with real specificity about how. It's about the fact that a framing implying \"you are deficient\" activates the resident's need to defend their competence, consuming cognitive resources that should be going toward actually processing and integrating the technical content, while a framing that separates the person from the specific technical choice — treating the choice as something anyone could have reasonably made, now being refined with additional information — allows the same technical content to be heard and applied without that defensive tax. This is exactly the mechanism behind why identical code review feedback lands so differently depending on its framing: 'this is wrong' versus 'here's an edge case this doesn't handle, and here's why it matters' deliver the same technical correction, but only one of them avoids triggering the identical defensive response the resident experienced, for the identical psychological reason Lessons 1-2 have already established at the team level.",
      hi: 'do surgeons wahi operation observe karte hain aur ek resident ko identical technical correction offer karte hain — ek ise "tumne ye galat kiya" ki tarah frame karta hai, doosra ise "yahan wo hai jo maine paaya is specific situation ke liye better kaam karta hai, aur yahan wajah hai" ki tarah frame karta hai — jahan resident ki actual ability sunne, retain karne, aur correction apply karne ki dramatically differ karti hai underlying technical content identical hone ke bawajood. Surgical training ne exactly is phenomenon ko document kiya hai: wahi precise technical correction, ek framing ke saath deliver ki gayi jo personal deficiency imply karti hai versus ek framing jo specific, situational expertise share karti hai, resident ke actually feedback ko apni practice mein integrate karne ya apni original choice justify karne pe defensively focused hone mein measurably different outcomes produce karti hai. Ye apni khud ki khatir gentle hone ke baare mein nahi hai, ya sab direct correction avoid karne ke baare mein — ek resident ko absolutely jaanne ki zaroorat hai ki unki technique ko change hone ki zaroorat hai, kaise ke baare mein real specificity ke saath. Ye is fact ke baare mein hai ki ek framing jo imply karti hai "tum deficient ho" resident ki apni competence defend karne ki zaroorat ko activate karti hai, cognitive resources consume karte hue jo actually technical content process aur integrate karne ki taraf jaane chahiye, jabki ek framing jo person ko specific technical choice se separate karti hai — choice ko treat karte hue kuch aisa jo koi bhi reasonably kar sakta tha, ab additional information ke saath refine ho raha hai — wahi technical content ko sunne aur apply hone deti hai us defensive tax ke bina. Ye exactly wo mechanism hai jo explain karta hai ki identical code review feedback itna differently kyun land karta hai uski framing pe depend karte hue: "ye galat hai" versus "yahan ek edge case hai jo ye handle nahi karta, aur yahan wajah hai ye kyun matter karta hai" wahi technical correction deliver karte hain, par sirf ek unme se identical defensive response trigger karne se bachta hai jo resident ne experience kiya, identical psychological reason ke liye jise Lessons 1-2 ne already team level pe establish kiya hai.',
    },

    simple: `**Why this lesson applies Lessons 1-2's psychological safety
foundation to the specific, recurring case of code review:**

\`\`\`
Lesson 1 established psychological safety as the mechanism determining
whether real problems surface. Lesson 2 applied this to blameless
postmortems. Code review is a recurring, everyday version of the same
underlying dynamic: whether a specific piece of feedback triggers
honest engagement with the technical content, or a defensive reaction
that consumes cognitive resources without improving anything.
\`\`\`

**A concrete, checkable distinction — framing that implies personal
deficiency versus framing that separates the person from the specific
technical choice:**

\`\`\`ts
function classifyFeedbackFraming(feedbackText) {
  const impliesPersonalDeficiency = /you (did|made|wrote) this wrong/i.test(feedbackText);
  const separatesPersonFromChoice = /here's an edge case|here's why|this doesn't handle/i.test(feedbackText);
  return {
    impliesPersonalDeficiency,
    separatesPersonFromChoice,
    likelyToTriggerDefensiveness: impliesPersonalDeficiency && !separatesPersonFromChoice,
  };
}
\`\`\`

**A concrete, checkable pattern — reframing identical technical
content from a deficiency-framing to a choice-framing, without
softening or hiding the actual correction:**

\`\`\`ts
function reframeCodeReviewComment(deficiencyFramedComment) {
  const reframes = {
    'This is wrong, you need to handle null here.':
      "Heads up — this doesn't handle the case where the value is null, which would throw here. Worth adding a check.",
    "You didn't think about concurrent requests.":
      'This looks like it could race under concurrent requests — here\\'s a specific scenario where that would cause a bug.',
  };
  return reframes[deficiencyFramedComment] || deficiencyFramedComment;
  // Same technical correction, same specificity — the target of the
  // sentence shifts from the person's judgment to the code's behavior
}
\`\`\`

**Why this pattern isn't about being vague, gentle, or avoiding
direct correction — a specific, important boundary:**

\`\`\`
The reframed feedback is NOT less specific or less direct about what
needs to change — it still names the exact problem (null handling, a
race condition) with the same technical precision. What changes is
specifically the grammatical and conceptual subject of the criticism:
the code's behavior in a specific scenario, not the author's judgment
or competence.
\`\`\`

**A concrete, checkable pattern — distinguishing a genuine question
from an implied criticism, since phrasing a suggestion as a real
question versus a rhetorical one changes whether it invites discussion
or shuts it down:**

\`\`\`ts
function auditQuestionSincerity(reviewComment) {
  // "Why would you do it this way?" often functions as a rhetorical
  // criticism, not a genuine question
  const isLikelyRhetorical = /why (would|did) you/i.test(reviewComment);
  return {
    isLikelyRhetorical,
    recommendation: isLikelyRhetorical
      ? 'reframe as a specific, genuine question or a direct statement of the concern'
      : 'passes as a genuine, discussion-inviting question',
  };
}
\`\`\`

**How this lesson closes Module 15:** Lesson 1 established Edmondson's
psychological safety as the team-level mechanism determining whether
real problems surface. Lesson 2 applied this concretely to blameless
postmortems. This lesson completes the module by applying the identical
foundation to code review — the most frequent, recurring site where a
team's psychological safety is either reinforced or eroded, one
comment at a time — setting up Module 16's focus on cognitive biases in
code review and estimation specifically.`,

    simpleHi: `**Ye lesson Lessons 1-2 ke psychological safety foundation ko code
review ke specific, recurring case pe kaise apply karta hai:**

\`\`\`
Lesson 1 ne psychological safety ko us mechanism ki tarah establish
kiya jo determine karta hai ki kya real problems surface hote hain.
Lesson 2 ne ise blameless postmortems pe apply kiya. Code review wahi
underlying dynamic ka ek recurring, everyday version hai: kya ek
specific piece of feedback honest engagement with technical content
trigger karta hai, ya ek defensive reaction jo kisi cheez ko improve
kiye bina cognitive resources consume karta hai.
\`\`\`

**Ek concrete, checkable distinction — framing jo personal deficiency
imply karti hai versus framing jo person ko specific technical choice
se separate karti hai:**

\`\`\`ts
function classifyFeedbackFraming(feedbackText) {
  const impliesPersonalDeficiency = /you (did|made|wrote) this wrong/i.test(feedbackText);
  const separatesPersonFromChoice = /here's an edge case|here's why|this doesn't handle/i.test(feedbackText);
  return {
    impliesPersonalDeficiency,
    separatesPersonFromChoice,
    likelyToTriggerDefensiveness: impliesPersonalDeficiency && !separatesPersonFromChoice,
  };
}
\`\`\`

**Ek concrete, checkable pattern — identical technical content ko
deficiency-framing se choice-framing tak reframe karna, actual
correction ko soften ya hide kiye bina:**

\`\`\`ts
function reframeCodeReviewComment(deficiencyFramedComment) {
  const reframes = {
    'This is wrong, you need to handle null here.':
      "Heads up — this doesn't handle the case where the value is null, which would throw here. Worth adding a check.",
    "You didn't think about concurrent requests.":
      'This looks like it could race under concurrent requests — here\\'s a specific scenario where that would cause a bug.',
  };
  return reframes[deficiencyFramedComment] || deficiencyFramedComment;
  // Wahi technical correction, wahi specificity — sentence ka target
  // person ke judgment se code ke behavior ki taraf shift hota hai
}
\`\`\`

**Ye pattern vague, gentle, ya direct correction avoid karne ke baare
mein kyun nahi hai — ek specific, important boundary:**

\`\`\`
Reframed feedback kya change karne ki zaroorat hai us baare mein LESS
specific ya less direct NAHI hai — ye abhi bhi exact problem (null
handling, ek race condition) ko wahi technical precision ke saath name
karta hai. Jo change hota hai wo specifically criticism ka grammatical
aur conceptual subject hai: code ka behavior ek specific scenario mein,
author ka judgment ya competence nahi.
\`\`\`

**Ek concrete, checkable pattern — ek genuine question ko ek implied
criticism se distinguish karna, kyunki ek suggestion ko ek real
question ki tarah phrase karna versus ek rhetorical one ye change karta
hai ki kya ye discussion invite karta hai ya ise shut down karta hai:**

\`\`\`ts
function auditQuestionSincerity(reviewComment) {
  // "Tumne is tarike se kyun kiya?" aksar ek rhetorical criticism ki
  // tarah function karta hai, ek genuine question nahi
  const isLikelyRhetorical = /why (would|did) you/i.test(reviewComment);
  return {
    isLikelyRhetorical,
    recommendation: isLikelyRhetorical
      ? 'reframe as a specific, genuine question or a direct statement of the concern'
      : 'passes as a genuine, discussion-inviting question',
  };
}
\`\`\`

**Ye lesson Module 15 ko kaise close karta hai:** Lesson 1 ne Edmondson
ki psychological safety ko team-level mechanism ki tarah establish
kiya jo determine karta hai ki kya real problems surface hote hain.
Lesson 2 ne ise concretely blameless postmortems pe apply kiya. Ye
lesson module ko complete karta hai identical foundation ko code review
pe apply karke — sabse frequent, recurring site jahan ek team ki
psychological safety ya to reinforce hoti hai ya erode hoti hai, ek
comment ek time pe — Module 16 ke focus ko set up karte hue code review
aur estimation mein cognitive biases pe specifically.`,

    content: `## Why this lesson applies Lessons 1-2's psychological safety
foundation to the specific, recurring case of code review

Lesson 1 established psychological safety as the mechanism determining
whether real problems surface. Lesson 2 applied this concretely to
blameless postmortems. Code review is the most frequent, recurring
engineering interaction where this same underlying dynamic plays out:
whether a specific piece of feedback triggers honest engagement with
technical content, or a defensive reaction that consumes cognitive
resources without improving the actual code or the reviewer-author
relationship.

## Why framing that implies personal deficiency triggers a specific,
measurable defensive cost, distinct from the technical content itself

Research on feedback delivery in high-stakes technical training (such
as surgical education) documents that identical technical corrections
produce measurably different outcomes depending on whether the framing
implies personal deficiency or separates the person from the specific
choice being corrected. A framing implying deficiency activates a need
to defend one's competence, consuming cognitive resources that would
otherwise go toward processing and integrating the technical content
itself — the same underlying cost, applied to the recurring context of
code review.

## Why reframing toward the code's behavior, not the author's
judgment, preserves the same technical specificity without the
defensive cost

The key distinction is not softening or vagueness — a well-reframed
comment remains exactly as specific and direct about what needs to
change. What shifts is the grammatical and conceptual subject of the
criticism: from the author's judgment or competence ("you didn't think
about this") to the code's behavior in a specific, concrete scenario
("this doesn't handle X, which would cause Y"). This preserves the
full technical value of the feedback while removing the personal-
deficiency framing that triggers a defensive response.

## Why this pattern is explicitly not about avoiding direct or firm
correction

This lesson doesn't argue for gentleness at the expense of clarity — a
reviewer must still communicate exactly what's wrong and why with full
technical precision. The distinction is entirely about the target of
the criticism: pointing at the code's behavior in a specific scenario
is both more actionable and less likely to trigger defensiveness than
pointing at the author's judgment, while conveying identical
information about what needs to change.

## Why distinguishing a genuine question from a rhetorical one matters
for whether feedback invites discussion or shuts it down

A question like "why would you do it this way?" frequently functions
as a rhetorical criticism rather than a genuine invitation to explain
reasoning, and is often received as such regardless of the reviewer's
intent. Reframing as either a specific, genuine question (inviting an
actual answer) or a direct statement of the concern removes this
ambiguity, making the interaction more likely to produce honest
technical discussion rather than a defensive justification of the
original choice.

## How this lesson closes Module 15

Lesson 1 established Edmondson's psychological safety as the
team-level mechanism determining whether real problems surface and get
addressed. Lesson 2 applied this concretely to blameless postmortems.
This lesson completes the module by applying the identical foundation
to code review — arguably the most frequent, recurring site where a
team's psychological safety is either reinforced or eroded, one
comment at a time — directly setting up Module 16's focus on cognitive
biases specifically within code review and estimation.`,

    contentHi: `## Ye lesson Lessons 1-2 ke psychological safety foundation ko code review ke specific, recurring case pe kyun apply karta hai

Lesson 1 ne psychological safety ko us mechanism ki tarah establish
kiya jo determine karta hai ki kya real problems surface hote hain.
Lesson 2 ne ise concretely blameless postmortems pe apply kiya. Code
review wo sabse frequent, recurring engineering interaction hai jahan
wahi underlying dynamic play out hoti hai: kya ek specific piece of
feedback technical content ke saath honest engagement trigger karta
hai, ya ek defensive reaction jo actual code ya reviewer-author
relationship ko improve kiye bina cognitive resources consume karta
hai.

## Framing jo personal deficiency imply karti hai ek specific, measurable defensive cost kyun trigger karti hai, technical content khud se distinct

High-stakes technical training (jaise surgical education) mein
feedback delivery pe research document karti hai ki identical technical
corrections measurably different outcomes produce karte hain is baat
pe depend karte hue ki kya framing personal deficiency imply karti hai
ya person ko us specific choice se separate karti hai jise correct
kiya ja raha hai. Ek framing jo deficiency imply karti hai apni
competence defend karne ki ek zaroorat activate karti hai, cognitive
resources consume karte hue jo otherwise technical content ko process
aur integrate karne ki taraf jaate — wahi underlying cost, code review
ke recurring context pe applied.

## Code ke behavior ki taraf reframe karna, author ke judgment ki taraf nahi, defensive cost ke bina wahi technical specificity kyun preserve karta hai

Key distinction softening ya vagueness nahi hai — ek well-reframed
comment kya change hone ki zaroorat hai us baare mein exactly utna hi
specific aur direct rehta hai. Jo shift hota hai wo criticism ka
grammatical aur conceptual subject hai: author ke judgment ya
competence ("tumne is baare mein socha nahi") se code ke behavior ki
taraf ek specific, concrete scenario mein ("ye X handle nahi karta, jo
Y cause karega"). Ye feedback ki full technical value ko preserve
karta hai personal-deficiency framing ko remove karte hue jo ek
defensive response trigger karti hai.

## Ye pattern explicitly direct ya firm correction avoid karne ke baare mein kyun nahi hai

Ye lesson clarity ki cost pe gentleness ke liye argue nahi karta — ek
reviewer ko abhi bhi exactly communicate karna chahiye ki kya galat hai
aur kyun full technical precision ke saath. Distinction entirely
criticism ke target ke baare mein hai: code ke behavior pe point karna
ek specific scenario mein author ke judgment pe point karne se dono
zyada actionable hai aur kam likely hai defensiveness trigger karne ke
liye, identical information convey karte hue is baare mein ki kya
change hone ki zaroorat hai.

## Ek genuine question ko ek rhetorical one se distinguish karna kyun matter karta hai is baat ke liye ki kya feedback discussion invite karta hai ya ise shut down karta hai

Ek question jaise "tumne is tarike se kyun kiya?" aksar reasoning
explain karne ke ek genuine invitation ke bajaye ek rhetorical
criticism ki tarah function karta hai, aur aksar aise hi receive kiya
jaata hai reviewer ki intent se independently. Ise ya to ek specific,
genuine question ki tarah (ek actual answer invite karte hue) ya
concern ke ek direct statement ki tarah reframe karna is ambiguity ko
remove karta hai, interaction ko honest technical discussion produce
karne ki zyada likelihood dete hue original choice ki ek defensive
justification ke bajaye.

## Ye lesson Module 15 ko kaise close karta hai

Lesson 1 ne Edmondson ki psychological safety ko team-level mechanism
ki tarah establish kiya jo determine karta hai ki kya real problems
surface hote hain aur address kiye jaate hain. Lesson 2 ne ise
concretely blameless postmortems pe apply kiya. Ye lesson module ko
complete karta hai identical foundation ko code review pe apply karke
— arguably sabse frequent, recurring site jahan ek team ki
psychological safety ya to reinforce hoti hai ya erode hoti hai, ek
comment ek time pe — directly Module 16 ke focus ko set up karte hue
specifically code review aur estimation ke andar cognitive biases pe.`,

    examples: [
      {
        title: 'A feedback-framing classifier and a comment reframer implementing this lesson\'s code-review patterns',
        titleHi: "Ek feedback-framing classifier aur ek comment reframer jo is lesson ke code-review patterns implement karte hain",
        codeJs: `function classifyFeedbackFraming(feedbackText) {
  const impliesPersonalDeficiency = /you (did|made|wrote) this wrong/i.test(feedbackText);
  const separatesPersonFromChoice = /here's an edge case|here's why|this doesn't handle/i.test(feedbackText);
  return {
    impliesPersonalDeficiency,
    separatesPersonFromChoice,
    likelyToTriggerDefensiveness: impliesPersonalDeficiency && !separatesPersonFromChoice,
  };
}

function auditQuestionSincerity(reviewComment) {
  const isLikelyRhetorical = /why (would|did) you/i.test(reviewComment);
  return {
    isLikelyRhetorical,
    recommendation: isLikelyRhetorical
      ? 'reframe as a specific, genuine question or a direct statement of the concern'
      : 'passes as a genuine, discussion-inviting question',
  };
}

console.log(classifyFeedbackFraming('You did this wrong, null values will crash it.'));
// { impliesPersonalDeficiency: true, separatesPersonFromChoice: false, likelyToTriggerDefensiveness: true }

console.log(classifyFeedbackFraming("This doesn't handle null values, which would throw here."));
// { impliesPersonalDeficiency: false, separatesPersonFromChoice: true, likelyToTriggerDefensiveness: false }

console.log(auditQuestionSincerity('Why would you do it this way?'));
// { isLikelyRhetorical: true, recommendation: 'reframe as...' }`,
        codeTs: `function classifyFeedbackFraming(feedbackText: string) {
  const impliesPersonalDeficiency = /you (did|made|wrote) this wrong/i.test(feedbackText);
  const separatesPersonFromChoice = /here's an edge case|here's why|this doesn't handle/i.test(feedbackText);
  return {
    impliesPersonalDeficiency,
    separatesPersonFromChoice,
    likelyToTriggerDefensiveness: impliesPersonalDeficiency && !separatesPersonFromChoice,
  };
}

function auditQuestionSincerity(reviewComment: string) {
  const isLikelyRhetorical = /why (would|did) you/i.test(reviewComment);
  return {
    isLikelyRhetorical,
    recommendation: isLikelyRhetorical
      ? 'reframe as a specific, genuine question or a direct statement of the concern'
      : 'passes as a genuine, discussion-inviting question',
  };
}

console.log(classifyFeedbackFraming('You did this wrong, null values will crash it.'));
// { impliesPersonalDeficiency: true, separatesPersonFromChoice: false, likelyToTriggerDefensiveness: true }

console.log(classifyFeedbackFraming("This doesn't handle null values, which would throw here."));
// { impliesPersonalDeficiency: false, separatesPersonFromChoice: true, likelyToTriggerDefensiveness: false }

console.log(auditQuestionSincerity('Why would you do it this way?'));
// { isLikelyRhetorical: true, recommendation: 'reframe as...' }`,
        code: `const impliesPersonalDeficiency = /you (did|made|wrote) this wrong/i.test(feedbackText);
const separatesPersonFromChoice = /here's an edge case|here's why|this doesn't handle/i.test(feedbackText);
// classifies the SAME technical concern by where it locates the criticism: person vs. code behavior`,
        output:
          "The classifier correctly flags 'You did this wrong' as likely to trigger defensiveness, while the technically-equivalent 'This doesn't handle null values' passes since it locates the criticism in the code's behavior rather than the person; the sincerity auditor correctly flags a rhetorical-sounding 'why would you' question for reframing.",
        explain:
          "This example operationalizes the lesson's central distinction directly: two functions classify feedback by its actual linguistic framing rather than its underlying technical accuracy, demonstrating concretely that identical technical concerns can be expressed in a form more or less likely to trigger the defensive response this lesson identifies.",
        explainHi:
          "Ye example lesson ke central distinction ko directly operationalize karta hai: do functions feedback ko uski actual linguistic framing se classify karte hain uski underlying technical accuracy se nahi, concretely demonstrate karte hue ki identical technical concerns ek aisi form mein express kiye ja sakte hain jo is lesson ke identify kiye defensive response ko trigger karne ki zyada ya kam likelihood rakhti hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// A code review comment that is technically accurate but framed
// around the author's judgment rather than the code's behavior
function reviewCommentWrong() {
  return "You clearly didn't think about what happens when this list is empty.";
  // Technically correct concern, but framed as a judgment about the
  // author's thought process, likely to trigger a defensive response
  // that has nothing to do with the actual technical issue
}`,
        right: `// The same technical concern, framed around the code's behavior in
// a specific scenario
function reviewCommentRight() {
  return "This throws if the list is empty — worth adding a check for that case.";
  // Identical technical specificity, but the subject of the sentence
  // is the code's behavior in a scenario, not the author's thought
  // process
}`,
        why: "Both comments identify the exact same technical issue with equal precision, but framing it as a judgment about what the author 'clearly didn't think about' locates the criticism in the person rather than the code, activating a defensive response that consumes cognitive resources without adding any technical value the reframed version doesn't already provide.",
        whyHi:
          "Dono comments exact wahi technical issue ko equal precision ke saath identify karte hain, par ise ek judgment ki tarah frame karna ki author ne 'clearly nahi socha' criticism ko person mein locate karta hai code mein nahi, ek defensive response activate karte hue jo koi technical value add kiye bina cognitive resources consume karta hai jo reframed version already provide nahi karta.",
      },
    ],

    realWorld: [
      {
        en: "A production engineering team's code-review guidelines were updated after a retrospective found that junior engineers were significantly more likely to push back defensively or leave a PR open unresolved for days when review comments used 'you' + a judgment word ('you missed,' 'you should have') versus comments that named the code's behavior directly — the team adopted a lightweight linting-style checklist for reviewers and measurably reduced both defensive back-and-forth and PR resolution time.",
        hi: "Ek production engineering team ki code-review guidelines update ki gayi ek retrospective ke baad jisne paaya ki junior engineers significantly zyada likely the defensively push back karne ya ek PR ko din tak unresolved open chhodne ke liye jab review comments 'you' + ek judgment word use karte the ('tumne miss kiya,' 'tumhe karna chahiye tha') versus comments jo code ke behavior ko directly naam dete the — team ne reviewers ke liye ek lightweight linting-style checklist adopt ki aur measurably dono defensive back-and-forth aur PR resolution time kam kiya.",
      },
    ],

    interviewQA: [
      {
        q: "Why does framing that implies personal deficiency ('you did this wrong') tend to reduce the effectiveness of otherwise correct technical feedback?",
        qHi: 'Framing jo personal deficiency imply karti hai (\'tumne ye galat kiya\') otherwise correct technical feedback ki effectiveness kam karne ki tendency kyun rakhti hai?',
        a: "This framing activates the recipient's need to defend their competence, consuming cognitive resources that would otherwise go toward processing and integrating the technical content itself — a specific, measurable cost documented in high-stakes technical training contexts, distinct from the accuracy of the underlying correction.",
        aHi: 'Ye framing recipient ki apni competence defend karne ki zaroorat activate karti hai, cognitive resources consume karte hue jo otherwise technical content khud ko process aur integrate karne ki taraf jaate — ek specific, measurable cost jo high-stakes technical training contexts mein documented hai, underlying correction ki accuracy se distinct.',
      },
      {
        q: "Is reframing code review feedback around the code's behavior instead of the author's judgment about being 'nicer' or less direct? Why or why not?",
        qHi: 'Kya code review feedback ko author ke judgment ke bajaye code ke behavior ke around reframe karna \'nicer\' ya less direct hone ke baare mein hai? Kyun ya kyun nahi?',
        a: "No — the reframed feedback remains exactly as specific and direct about what needs to change, with identical technical precision. What shifts is only the grammatical and conceptual subject of the criticism: the code's behavior in a specific scenario, not the author's competence or thought process.",
        aHi: 'Nahi — reframed feedback exactly utna hi specific aur direct rehta hai is baare mein ki kya change hone ki zaroorat hai, identical technical precision ke saath. Jo shift hota hai wo sirf criticism ka grammatical aur conceptual subject hai: code ka behavior ek specific scenario mein, author ki competence ya thought process nahi.',
      },
    ],

    exercises: [
      {
        task: "A reviewer leaves the comment 'Why would you use a for loop here instead of .map()?' on a pull request. Using this lesson's framework, explain why this phrasing is ambiguous between a genuine question and a rhetorical criticism, and propose two alternative phrasings — one for each actual intent.",
        taskHi: "Ek reviewer ek pull request pe comment chhodta hai 'Tumne yahan .map() ke bajaye for loop kyun use kiya?' Is lesson ke framework use karke, explain karo ki ye phrasing ek genuine question aur ek rhetorical criticism ke beech ambiguous kyun hai, aur do alternative phrasings propose karo — har actual intent ke liye ek.",
        hint: "Think about how the same words could either be a sincere attempt to understand the author's reasoning (perhaps there's a good reason) or a rhetorical way of saying '.map() would clearly be better here' — the fix is to make the intent explicit rather than leaving it ambiguous.",
        hintHi: 'Socho ki wahi words ya to author ki reasoning samajhne ka ek sincere attempt ho sakte hain (shayad koi achhi wajah hai) ya ye kehne ka ek rhetorical tareeka ho sakte hain ki \'.map() clearly yahan better hoga\' — fix intent ko explicit banana hai use ambiguous chhodne ke bajaye.',
      },
    ],

    keyTakeaways: [
      "Code review is the most frequent, recurring engineering interaction where a team's psychological safety (Lesson 1) is reinforced or eroded, one comment at a time.",
      "Feedback framing that implies personal deficiency activates a defensive response that consumes cognitive resources, reducing engagement with the technical content itself — a specific, measurable cost documented in other high-stakes technical training contexts too.",
      "Reframing toward the code's behavior in a specific scenario, rather than the author's judgment, preserves full technical specificity and directness while removing this defensive cost.",
      "This lesson closes Module 15 by applying the psychological safety foundation from Lessons 1-2 to code review specifically, setting up Module 16's focus on cognitive biases in code review and estimation.",
    ],
    keyTakeawaysHi: [
      'Code review sabse frequent, recurring engineering interaction hai jahan ek team ki psychological safety (Lesson 1) reinforce ya erode hoti hai, ek comment ek time pe.',
      'Feedback framing jo personal deficiency imply karti hai ek defensive response activate karti hai jo cognitive resources consume karta hai, technical content khud ke saath engagement kam karte hue — ek specific, measurable cost jo doosre high-stakes technical training contexts mein bhi documented hai.',
      'Code ke behavior ki taraf ek specific scenario mein reframe karna, author ke judgment ki taraf nahi, full technical specificity aur directness preserve karta hai is defensive cost ko remove karte hue.',
      'Ye lesson Module 15 ko close karta hai Lessons 1-2 se psychological safety foundation ko specifically code review pe apply karke, Module 16 ke focus ko set up karte hue code review aur estimation mein cognitive biases pe.',
    ],
  },
];
