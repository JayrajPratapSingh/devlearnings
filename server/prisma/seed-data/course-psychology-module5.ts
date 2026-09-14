/**
 * Psychology for Developers — Module 5: Cognitive Biases That Affect Developers & Teams, lessons 1-3.
 *
 * Lesson 1: The sunk cost fallacy in technical-debt decisions.
 * Lesson 2: Confirmation bias while debugging.
 * Lesson 3: Overconfidence in estimation — the planning fallacy.
 */

import type { CourseLesson } from './course-js-module1';

export const PSYCH_MODULE_5: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'psych-sunk-cost-fallacy-in-technical-debt',
    title: 'The Sunk Cost Fallacy in Technical-Debt Decisions',
    titleHi: 'Technical-Debt Decisions Mein Sunk Cost Fallacy',
    description:
      "The sunk cost fallacy — continuing to invest in something because of what's already been spent, rather than what it will actually cost and yield going forward — shows up constantly in decisions about whether to keep patching a failing system or rewrite it.",
    descriptionHi:
      'Sunk cost fallacy — kisi cheez mein invest karna continue karna is wajah se ki kya already spend kiya ja chuka hai, is wajah se nahi ki ye aage actually kya cost karega aur yield karega — constantly un decisions mein dikhta hai ki kya ek failing system ko patch karna continue karein ya rewrite karein.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**Sitting through the last hour of a genuinely bad movie purely because you already paid for the ticket and sat through the first ninety minutes, rather than leaving and using that hour for something you'd actually enjoy.** Once the ticket money is spent and the first ninety minutes are watched, that time and money is gone regardless of what happens next — nothing about leaving the theater now gets that money back or un-watches the first ninety minutes. The only decision that actually matters at this point is a fresh one: is the next hour, spent watching the rest of this specific movie, worth more than that same hour spent doing literally anything else? A person who stays purely because they \"already invested this much\" is making a decision based on a cost that can no longer be affected by anything they do now, while ignoring the actual, forward-looking question that should be driving the choice. This is exactly the trap in technical-debt decisions: a team that has already spent six months patching a fragile, poorly-architected system faces the same fresh, forward-looking question a movie-watcher does — given where things actually stand right now, is continuing to patch this specific system a better use of the NEXT unit of effort than an alternative (a partial or full rewrite) would be? The six months already spent, like the movie ticket, cannot be recovered by any choice made today, and letting that unrecoverable past spending drive today's decision is the sunk cost fallacy in its purest engineering form.",
      hi: 'ek genuinely bad movie ke last hour ke through baithna purely is wajah se ki aapne already ticket ke liye pay kiya aur pehle ninety minutes ke through baithe, theater chhodkar us hour ko kisi aisi cheez ke liye use karne ke bajaye jisse aap actually enjoy karte. Ek baar ticket money spend ho jaaye aur pehle ninety minutes dekh liye jaayein, wo time aur money chala gaya chahe aage kuch bhi ho — ab theater chhodne se us money wapas nahi milti ya pehle ninety minutes un-watch nahi hote. Is point pe sirf ek decision hai jo actually matter karta hai, ek fresh wala: kya agla hour, is specific movie ke baaki hisse ko dekhne mein spend kiya gaya, us se zyada worth hai jo wahi hour literally kuch aur karne mein spend kiya gaya? Koi jo purely is wajah se rukta hai ki unhone "itna already invest kiya hai" ek decision banata hai ek cost ke basis pe jise ab unke kisi bhi kaam se affect nahi kiya ja sakta, jabki us actual, forward-looking question ko ignore karte hue jise choice ko drive karna chahiye tha. Ye exactly technical-debt decisions mein trap hai: ek team jisne already chhe mahine spend kiye ek fragile, poorly-architected system ko patch karne mein wahi fresh, forward-looking question face karti hai jo ek movie-watcher karta hai: given ki cheezein actually abhi kahan khadi hain, kya is specific system ko patch karna continue karna NEXT unit of effort ka ek behtar use hai ek alternative se (ek partial ya full rewrite) us se? Already spend kiye gaye chhe mahine, movie ticket ki tarah, aaj banaye gaye kisi bhi choice se recover nahi kiye ja sakte, aur us unrecoverable past spending ko aaj ke decision ko drive karne dena sunk cost fallacy hai apne purest engineering form mein.',
    },

    simple: `**The core finding — sunk costs (time, money, effort already
spent) should have NO bearing on a forward-looking decision, but
humans systematically let them anyway:**

\`\`\`
Rational decision-making says: evaluate a choice based ONLY on its
future costs and future benefits, since past spending cannot be
recovered by any present decision. The sunk cost fallacy is the
well-documented, consistent human tendency to instead factor in what's
ALREADY been spent, continuing to invest specifically because of that
past spending — even when it makes the future outcome worse.
\`\`\`

**A concrete, checkable pattern this produces in technical-debt
decisions — the "we've already put six months into this" trap:**

\`\`\`ts
// WRONG reasoning — the past investment size drives the decision
function shouldContinuePatchingWrong(monthsAlreadySpent, monthsToRewrite) {
  // "We've already spent 6 months, we can't just throw that away"
  return monthsAlreadySpent > monthsToRewrite; // reasoning based on
  // a cost that's already gone regardless of what's chosen now
}

// CORRECT reasoning — only forward-looking costs and benefits matter
function shouldContinuePatchingRight(monthsToContinuePatching, monthsToRewrite, expectedFutureVelocityGain) {
  // The 6 months already spent appear NOWHERE in this calculation —
  // they cannot be affected by today's decision either way
  const patchingCost = monthsToContinuePatching;
  const rewriteCost = monthsToRewrite - expectedFutureVelocityGain;
  return patchingCost < rewriteCost;
}
\`\`\`

**Why "we've come this far" is a specific, recognizable verbal signal
that sunk cost reasoning has entered a technical decision:**

\`\`\`
Phrases like "we've already invested so much," "we can't abandon this
now," or "think of all the work that would be wasted" are direct
verbal markers that a team is weighing PAST cost rather than FUTURE
value — a concrete, listenable-for signal in real architecture and
technical-debt discussions, not an abstract psychological concept.
\`\`\`

**A concrete structural practice this motivates — reframing the
decision to exclude past cost entirely, forcing a fresh comparison:**

\`\`\`ts
function reframeAsForwardLookingDecision(currentSituation) {
  // Deliberately excludes ANY reference to past effort — the decision
  // is framed exactly as it would be framed for a brand-new team
  // encountering this exact codebase for the first time today
  return {
    question: 'Starting from today, with the codebase exactly as it currently is, what is the best path forward?',
    optionA: { name: 'Continue current approach', futureCost: currentSituation.remainingPatchEffort },
    optionB: { name: 'Rewrite the problematic component', futureCost: currentSituation.rewriteEffort },
    // Past effort spent getting to today's state is DELIBERATELY
    // absent from this comparison — it's the same for both options
    // and cannot be changed by either choice
  };
}
\`\`\`

**Why this doesn't mean past effort is always irrelevant — the
important, narrow exception where past investment DOES carry
forward-looking information:**

\`\`\`
Past effort matters when it produces genuine, ongoing FUTURE value —
working, tested code that will continue to function, documented
knowledge the team retains, infrastructure that remains useful
regardless of which path is chosen next. What should NOT factor into
the decision is the raw SIZE of past investment as a reason to
continue, independent of what that investment actually produces going
forward — the distinction is between "this past work created lasting
value we'd lose" (a genuine forward-looking factor) and "we spent a
lot on this so we should keep going" (the fallacy).
\`\`\`

**How this lesson opens Module 5:** Module 4 covered biases that
shape how PRODUCTS and USERS behave; this lesson begins Module 5's
shift to biases that shape how DEVELOPERS AND TEAMS make their own
internal engineering decisions — starting with one of the most
consequential and recognizable: letting past investment, rather than
future value, drive a technical-debt decision.`,

    simpleHi: `**Core finding — sunk costs (time, money, effort jo already spend
kiye ja chuke hain) ka ek forward-looking decision pe koi bearing NAHI
hona chahiye, par humans systematically unhe phir bhi factor karte
hain:**

\`\`\`
Rational decision-making kehti hai: ek choice ko SIRF uske future
costs aur future benefits ke basis pe evaluate karo, kyunki past
spending ko kisi bhi present decision se recover nahi kiya ja sakta.
Sunk cost fallacy well-documented, consistent human tendency hai
iske bajaye is baat ko factor karne ki ki kya ALREADY spend kiya ja
chuka hai, specifically us past spending ki wajah se invest karna
continue karte hue — even jab ye future outcome ko worse banata hai.
\`\`\`

**Ek concrete, checkable pattern jise ye technical-debt decisions mein
produce karta hai — "humne already six mahine isme lagaye hain" trap:**

\`\`\`ts
// GALAT reasoning — past investment size decision ko drive karti hai
function shouldContinuePatchingWrong(monthsAlreadySpent, monthsToRewrite) {
  // "Humne already 6 mahine spend kiye hain, hum bas ise throw away nahi kar sakte"
  return monthsAlreadySpent > monthsToRewrite; // ek cost pe based
  // reasoning jo already gone hai chahe abhi kuch bhi choose kiya jaaye
}

// CORRECT reasoning — sirf forward-looking costs aur benefits matter karte hain
function shouldContinuePatchingRight(monthsToContinuePatching, monthsToRewrite, expectedFutureVelocityGain) {
  // Already spend kiye gaye 6 mahine is calculation mein KAHIN nahi
  // appear karte — unhe aaj ke decision se kisi bhi tarah affect nahi
  // kiya ja sakta
  const patchingCost = monthsToContinuePatching;
  const rewriteCost = monthsToRewrite - expectedFutureVelocityGain;
  return patchingCost < rewriteCost;
}
\`\`\`

**"Hum itni door aa chuke hain" ek specific, recognizable verbal
signal kyun hai ki sunk cost reasoning ek technical decision mein
enter ho chuki hai:**

\`\`\`
"Humne already itna invest kiya hai," "hum ise ab abandon nahi kar
sakte," ya "socho kitna kaam waste ho jaayega" jaisi phrases direct
verbal markers hain is baat ke ki ek team PAST cost weigh kar rahi hai
FUTURE value nahi — real architecture aur technical-debt discussions
mein ek concrete, listenable-for signal, ek abstract psychological
concept nahi.
\`\`\`

**Ek concrete structural practice jise ye motivate karta hai — decision
ko reframe karna past cost ko poori tarah exclude karke, ek fresh
comparison force karte hue:**

\`\`\`ts
function reframeAsForwardLookingDecision(currentSituation) {
  // Deliberately kisi bhi past effort ke reference ko exclude karta
  // hai — decision exactly wahi tarike se framed hai jaise ek brand-
  // new team ke liye framed hoga jo aaj pehli baar is exact codebase
  // ko encounter kar raha hai
  return {
    question: 'Starting from today, with the codebase exactly as it currently is, what is the best path forward?',
    optionA: { name: 'Continue current approach', futureCost: currentSituation.remainingPatchEffort },
    optionB: { name: 'Rewrite the problematic component', futureCost: currentSituation.rewriteEffort },
    // Aaj ki state tak pahunchne mein spend kiya gaya past effort
    // DELIBERATELY is comparison se absent hai — ye dono options ke
    // liye wahi hai aur kisi bhi choice se badla nahi ja sakta
  };
}
\`\`\`

**Iska matlab ye nahi hai ki past effort hamesha irrelevant hai —
important, narrow exception jahan past investment DOES forward-
looking information carry karti hai:**

\`\`\`
Past effort matter karta hai jab ye genuine, ongoing FUTURE value
produce karta hai — working, tested code jo continue function karega,
documented knowledge jo team retain karti hai, infrastructure jo
useful rehta hai chahe agla path koi bhi choose kiya jaaye. Jo
decision mein factor NAHI karna chahiye wo past investment ki raw SIZE
hai continue karne ke ek reason ki tarah, is baat se independently ki
wo investment actually aage kya produce karta hai — distinction ye hai
"is past work ne lasting value create ki jise hum khoenge" (ek genuine
forward-looking factor) aur "humne isme bahut spend kiya isliye humein
continue karna chahiye" (fallacy) ke beech.
\`\`\`

**Ye lesson Module 5 ko kaise open karta hai:** Module 4 ne biases
cover kiye jo shape karte hain ki PRODUCTS aur USERS kaise behave karte
hain; ye lesson Module 5 ke shift ko shuru karta hai un biases ki taraf
jo shape karte hain ki DEVELOPERS AUR TEAMS apne khud ke internal
engineering decisions kaise lete hain — un sabse consequential aur
recognizable mein se ek se shuru karte hue: past investment ko, future
value ke bajaye, ek technical-debt decision ko drive karne dena.`,

    content: `## Why the sunk cost fallacy is a well-documented, consistent
human tendency rather than an occasional lapse in judgment

Rational, purely forward-looking decision theory holds that a choice
should be evaluated only on its future costs and benefits, since past
spending cannot be recovered or affected by any present decision.
Extensive behavioral research has consistently found that people
instead systematically factor in sunk costs — continuing to invest in
something specifically because of what's already been spent on it,
even when doing so produces a worse expected outcome than starting
fresh would. This isn't a rare failure of a particular careless
individual; it's a well-documented, general feature of human decision-
making that shows up reliably across many different contexts,
including technical ones.

## Why "we've already invested so much" is a specific, recognizable
verbal signal worth listening for in real engineering discussions

Because the sunk cost fallacy has a consistent underlying logic — past
investment justifying continued investment — it tends to surface in
predictable verbal patterns: appeals to how much work has already gone
in, how much would be "wasted" by stopping, or how far the team has
"already come." Recognizing these specific phrases as a signal that
sunk cost reasoning has entered a discussion is a practical, concrete
skill distinct from abstractly knowing the bias exists — it's the
difference between understanding a concept and being able to catch it
happening in a real team conversation.

## Why reframing a technical-debt decision to deliberately exclude
past effort is a direct, structural countermeasure

Since the fallacy specifically involves letting the size of past
investment influence a decision it cannot rationally affect, a direct
structural countermeasure is explicitly reframing the decision as if a
brand-new team were encountering the current codebase for the first
time today, with no memory of how much effort it took to get here. This
reframing doesn't require suppressing awareness of history — it
requires excluding history's SIZE (how much was spent) from the
calculation, since that size, however large, cannot be recovered or
changed by today's choice.

## Why past effort isn't universally irrelevant — the genuine
exception this lesson distinguishes from the fallacy

Past work matters when it has produced ongoing, future value: code
that continues to function correctly, documented institutional
knowledge the team retains, infrastructure that remains genuinely
useful under either future path being considered. This is a
fundamentally different claim from "we spent a lot, so we should
continue" — it's "this specific past work created a specific,
identifiable future asset we would lose." Distinguishing between these
two claims — one a legitimate forward-looking factor, one the fallacy
itself — is the practical skill this lesson aims to build.

## How this lesson opens Module 5's shift in focus

Module 4 examined biases (anchoring, loss aversion, confirmation bias)
that shape how users and products behave. This lesson begins Module
5's parallel examination of biases that shape how developers and teams
make their own internal decisions — starting with one of the most
consequential and most easily rationalized: continuing down a
technical path because of what's already been invested in it, rather
than because of what continuing actually promises to yield.`,

    contentHi: `## Sunk cost fallacy ek well-documented, consistent human tendency kyun hai judgment mein ek occasional lapse ke bajaye

Rational, purely forward-looking decision theory kehti hai ki ek
choice ko sirf uske future costs aur benefits pe evaluate karna chahiye,
kyunki past spending ko kisi bhi present decision se recover ya affect
nahi kiya ja sakta. Extensive behavioral research ne consistently
paaya hai ki log iske bajaye systematically sunk costs ko factor karte
hain — kisi cheez mein invest karna continue karte hue specifically is
wajah se ki kya already usme spend kiya gaya, even jab aisa karna
fresh start karne se worse expected outcome produce karta hai. Ye ek
particular careless individual ki rare failure nahi hai; ye human
decision-making ka ek well-documented, general feature hai jo kai
different contexts ke across reliably dikhta hai, technical wale
samet.

## "Humne already itna invest kiya hai" real engineering discussions mein sunne layak ek specific, recognizable verbal signal kyun hai

Kyunki sunk cost fallacy ki ek consistent underlying logic hai — past
investment continued investment ko justify karna — ye predictable
verbal patterns mein surface hone ki tendency rakhta hai: kitna kaam
already ja chuka hai iske appeals, rukne se kitna "waste" ho jaayega,
ya team "already kitni door aa chuki hai." In specific phrases ko ek
signal ki tarah recognize karna ki sunk cost reasoning ek discussion
mein enter ho chuki hai ek practical, concrete skill hai abstractly
bias ke exist karne ko jaanne se distinct — ye ek concept samajhne aur
ise ek real team conversation mein hote hue catch karne mein able hone
ke beech ka difference hai.

## Ek technical-debt decision ko deliberately past effort exclude karne ke liye reframe karna ek direct, structural countermeasure kyun hai

Kyunki fallacy specifically past investment ki size ko ek decision ko
influence karne dena involve karti hai jise ye rationally affect nahi
kar sakti, ek direct structural countermeasure decision ko explicitly
reframe karna hai jaise ek brand-new team aaj pehli baar current
codebase ko encounter kar rahi ho, koi memory ke bina ki yahan
pahunchne mein kitna effort laga. Ye reframing history ki awareness
suppress karne ki maang nahi karti — ye history ki SIZE (kitna spend
kiya gaya) ko calculation se exclude karne ki maang karti hai, kyunki
wo size, chahe kitni bhi badi ho, aaj ki choice se recover ya badli
nahi ja sakti.

## Past effort universally irrelevant kyun nahi hai — genuine exception jise ye lesson fallacy se distinguish karta hai

Past work matter karta hai jab isne ongoing, future value produce ki
ho: code jo correctly function karna continue karta hai, documented
institutional knowledge jo team retain karti hai, infrastructure jo
kisi bhi future path ke under genuinely useful rehta hai jise consider
kiya ja raha hai. Ye "humne bahut spend kiya, isliye humein continue
karna chahiye" se fundamentally alag claim hai — ye "is specific past
work ne ek specific, identifiable future asset create ki jise hum
khoenge" hai. In do claims ke beech distinguish karna — ek legitimate
forward-looking factor, ek fallacy khud — practical skill hai jise ye
lesson build karne ka aim rakhta hai.

## Ye lesson Module 5 ke focus shift ko kaise open karta hai

Module 4 ne biases examine kiye (anchoring, loss aversion, confirmation
bias) jo shape karte hain ki users aur products kaise behave karte
hain. Ye lesson Module 5 ke parallel examination ko shuru karta hai un
biases ka jo shape karte hain ki developers aur teams apne khud ke
internal decisions kaise lete hain — un sabse consequential aur sabse
easily rationalized mein se ek se shuru karte hue: ek technical path pe
continue karna is wajah se ki usme already kya invest kiya gaya hai,
is wajah se nahi ki continue karna actually kya yield karne ka promise
karta hai.`,

    examples: [
      {
        title: 'A forward-looking technical-debt decision framework that structurally excludes sunk cost',
        titleHi: 'Ek forward-looking technical-debt decision framework jo structurally sunk cost ko exclude karta hai',
        codeJs: `function evaluateRewriteDecision({
  remainingPatchEffortMonths,
  rewriteEffortMonths,
  expectedVelocityGainAfterRewrite,
  reusableAssetsFromPastWork, // genuine forward-looking value, NOT sunk cost
}) {
  // Notice: monthsAlreadySpentSoFar is NOT a parameter here at all —
  // it structurally cannot influence this calculation
  const patchingPath = {
    futureCost: remainingPatchEffortMonths,
  };

  const rewritePath = {
    futureCost: rewriteEffortMonths - expectedVelocityGainAfterRewrite,
    // Genuinely reusable assets (tested logic, documented domain
    // knowledge) reduce the REWRITE's future cost — this is the
    // legitimate way past work can matter, not as "don't waste it"
    adjustedCost: rewriteEffortMonths - expectedVelocityGainAfterRewrite - reusableAssetsFromPastWork.effortSaved,
  };

  return {
    recommendation: rewritePath.adjustedCost < patchingPath.futureCost ? 'rewrite' : 'continue_patching',
    reasoning: 'Based entirely on future cost/benefit — past effort already spent does not appear in this comparison',
  };
}`,
        codeTs: `interface ReusableAssets {
  effortSaved: number; // months of future effort genuinely saved by reusable past work
}

interface RewriteDecisionInput {
  remainingPatchEffortMonths: number;
  rewriteEffortMonths: number;
  expectedVelocityGainAfterRewrite: number;
  reusableAssetsFromPastWork: ReusableAssets;
}

function evaluateRewriteDecision({
  remainingPatchEffortMonths,
  rewriteEffortMonths,
  expectedVelocityGainAfterRewrite,
  reusableAssetsFromPastWork,
}: RewriteDecisionInput) {
  // Notice: monthsAlreadySpentSoFar is NOT a parameter here at all —
  // it structurally cannot influence this calculation
  const patchingPath = {
    futureCost: remainingPatchEffortMonths,
  };

  const rewritePath = {
    futureCost: rewriteEffortMonths - expectedVelocityGainAfterRewrite,
    // Genuinely reusable assets (tested logic, documented domain
    // knowledge) reduce the REWRITE's future cost — this is the
    // legitimate way past work can matter, not as "don't waste it"
    adjustedCost: rewriteEffortMonths - expectedVelocityGainAfterRewrite - reusableAssetsFromPastWork.effortSaved,
  };

  return {
    recommendation: rewritePath.adjustedCost < patchingPath.futureCost ? 'rewrite' : 'continue_patching',
    reasoning: 'Based entirely on future cost/benefit — past effort already spent does not appear in this comparison',
  };
}`,
        code: `// monthsAlreadySpentSoFar is deliberately NOT a parameter —
// it cannot influence a forward-looking calculation`,
        output:
          "The function produces a recommendation based entirely on remaining effort, expected future gains, and genuinely reusable assets — a team that already spent 8 months or 8 days on the current approach receives the identical recommendation for the identical future-facing inputs, since past spending has no parameter through which it could change the outcome.",
        explain:
          "This example makes the lesson's structural countermeasure concrete: by simply never accepting 'months already spent' as an input, the function's design itself prevents sunk cost reasoning from entering the calculation, while still correctly accounting for genuinely reusable past work as a legitimate reduction in the rewrite's future cost.",
        explainHi:
          "Ye example lesson ke structural countermeasure ko concrete banata hai: simply 'months already spent' ko kabhi ek input ki tarah accept na karke, function ka design khud sunk cost reasoning ko calculation mein enter hone se rokta hai, jabki abhi bhi genuinely reusable past work ko rewrite ki future cost mein ek legitimate reduction ki tarah correctly account karte hue.",
      },
    ],

    mistakes: [
      {
        wrong: `// A team's actual reasoning in an architecture review, driven by
// sunk cost rather than forward-looking value
function architectureReviewDiscussionWrong() {
  return \`We've put 8 months into this microservices migration.
  We can't back out now — think of all that work going to waste.
  We need to push through and finish it, whatever it takes.\`;
  // This reasoning never asks: given where things stand TODAY, is
  // finishing the migration actually the best use of the NEXT unit
  // of effort, compared to alternatives?
}`,
        right: `// The same situation, reframed as a genuinely forward-looking decision
function architectureReviewDiscussionRight(currentState) {
  return {
    question: 'Given the codebase exactly as it is today, what is the best next step?',
    remainingMigrationCost: currentState.estimatedMonthsToComplete,
    alternativeCost: currentState.estimatedMonthsToRevertAndStabilize,
    // The 8 months already spent is acknowledged as history but
    // deliberately excluded from THIS specific comparison, since it
    // cannot be recovered by either choice
    decision: currentState.estimatedMonthsToComplete < currentState.estimatedMonthsToRevertAndStabilize
      ? 'continue_migration'
      : 'revert_and_stabilize',
  };
}`,
        why: "Reasoning driven by 'we can't waste what we've already spent' evaluates the decision using information (past cost) that cannot be affected by any choice made today, while ignoring the actual forward-looking question of whether continuing is genuinely the best use of future effort — this is the sunk cost fallacy operating directly on a real architectural decision.",
        whyHi:
          "'Humne jo already spend kiya hai use waste nahi kar sakte' se driven reasoning decision ko us information (past cost) use karke evaluate karti hai jise aaj banaye gaye kisi bhi choice se affect nahi kiya ja sakta, jabki us actual forward-looking question ko ignore karte hue ki kya continue karna genuinely future effort ka best use hai — ye sunk cost fallacy hai jo directly ek real architectural decision pe operate kar raha hai.",
      },
    ],

    realWorld: [
      {
        en: "A production engineering team explicitly adopted a 'zero-history' framing rule for major technical-debt decisions after realizing a failed 14-month migration had been kept alive for its final 6 months purely on sunk-cost reasoning — the new rule requires every continuation-vs-pivot decision to be argued as if a fresh team encountered the current state today, with no reference to past effort permitted in the discussion.",
        hi: 'Ek production engineering team ne explicitly ek \'zero-history\' framing rule adopt ki major technical-debt decisions ke liye ye realize karne ke baad ki ek failed 14-month migration ko uske final 6 mahino ke liye purely sunk-cost reasoning pe alive rakha gaya tha — naya rule maangta hai ki har continuation-vs-pivot decision ko is tarike se argue kiya jaaye jaise ek fresh team aaj current state ko encounter kar rahi ho, discussion mein past effort ka koi reference permitted nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the sunk cost fallacy, and why is it considered a well-documented, general feature of decision-making rather than an occasional lapse?',
        qHi: 'Sunk cost fallacy kya hai, aur ise decision-making ka ek well-documented, general feature kyun mana jaata hai ek occasional lapse ke bajaye?',
        a: "The sunk cost fallacy is the tendency to continue investing in something because of what's already been spent on it, rather than evaluating the decision purely on future costs and benefits — even though past spending cannot be recovered or affected by any present choice. Extensive behavioral research has found this pattern consistently across many different contexts, establishing it as a general, reliable feature of human decision-making rather than a rare individual failure.",
        aHi: 'Sunk cost fallacy kisi cheez mein invest karna continue karne ki tendency hai is wajah se ki usme already kya spend kiya gaya hai, decision ko purely future costs aur benefits pe evaluate karne ke bajaye — chahe past spending ko kisi bhi present choice se recover ya affect nahi kiya ja sakta. Extensive behavioral research ne is pattern ko kai different contexts ke across consistently paaya hai, ise human decision-making ka ek general, reliable feature ki tarah establish karte hue ek rare individual failure ke bajaye.',
      },
      {
        q: "Why can past effort still matter in a technical-debt decision, without this contradicting the sunk cost principle?",
        qHi: 'Past effort ek technical-debt decision mein abhi bhi kyun matter kar sakta hai, ise sunk cost principle ko contradict kiye bina?',
        a: "Past work matters when it has produced genuine, ongoing future value — reusable tested code, retained institutional knowledge, infrastructure useful under either future path. This is a fundamentally different claim from 'we spent a lot so we should continue' — it's specifically about identifiable future value the past work created, which is a legitimate forward-looking factor rather than the fallacy itself.",
        aHi: 'Past work matter karta hai jab isne genuine, ongoing future value produce ki ho — reusable tested code, retained institutional knowledge, infrastructure jo kisi bhi future path ke under useful hai. Ye "humne bahut spend kiya isliye humein continue karna chahiye" se fundamentally alag claim hai — ye specifically identifiable future value ke baare mein hai jo past work ne create ki, jo ek legitimate forward-looking factor hai fallacy khud ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "A tech lead argues against abandoning a custom-built internal framework, saying 'we've spent two years building this, we can't just switch to the open-source alternative now.' Using this lesson's reframing technique, rewrite this argument as a genuinely forward-looking question, and identify what specific information (not the two years itself) would actually be needed to make a sound decision.",
        taskHi: 'Ek tech lead ek custom-built internal framework ko abandon karne ke against argue karta hai, kehte hue \'humne do saal isse build karne mein spend kiye hain, hum abhi open-source alternative pe switch nahi kar sakte.\' Is lesson ki reframing technique use karke, is argument ko ek genuinely forward-looking question ki tarah rewrite karo, aur identify karo kaunsi specific information (do saal khud nahi) actually ek sound decision lene ke liye chahiye hogi.',
        hint: "Strip out any reference to the two years already spent, and ask what a brand-new team, encountering both the current framework and the open-source alternative today with no history, would need to know to choose between them.",
        hintHi: 'Already spend kiye gaye do saal ke kisi bhi reference ko strip out karo, aur pucho ki ek brand-new team, jo aaj current framework aur open-source alternative dono ko koi history ke bina encounter kar rahi hai, unke beech choose karne ke liye kya jaanna chahiye.',
      },
    ],

    keyTakeaways: [
      "The sunk cost fallacy is the well-documented tendency to let past, unrecoverable spending influence a decision that can only be affected by future costs and benefits.",
      "Phrases like 'we've already invested so much' or 'think of the wasted work' are concrete, listenable-for verbal signals that sunk cost reasoning has entered a technical discussion.",
      "Reframing a decision to exclude past effort entirely — as if a brand-new team encountered today's codebase for the first time — is a direct structural countermeasure.",
      "Past work still matters when it produces genuine, ongoing future value (reusable code, retained knowledge) — the fallacy is treating the raw size of past investment as a reason to continue, independent of what it actually yields going forward.",
    ],
    keyTakeawaysHi: [
      'Sunk cost fallacy past, unrecoverable spending ko ek decision ko influence karne dene ki well-documented tendency hai jise sirf future costs aur benefits se affect kiya ja sakta hai.',
      "'Humne already itna invest kiya hai' ya 'wasted work ke baare mein socho' jaisi phrases concrete, listenable-for verbal signals hain ki sunk cost reasoning ek technical discussion mein enter ho chuki hai.",
      'Ek decision ko reframe karna past effort ko poori tarah exclude karke — jaise ek brand-new team aaj codebase ko pehli baar encounter kar rahi ho — ek direct structural countermeasure hai.',
      'Past work abhi bhi matter karta hai jab ye genuine, ongoing future value produce karta hai (reusable code, retained knowledge) — fallacy past investment ki raw size ko continue karne ka ek reason ki tarah treat karna hai, is baat se independently ki ye actually aage kya yield karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'psych-confirmation-bias-while-debugging',
    title: 'Confirmation Bias While Debugging',
    titleHi: 'Debug Karte Waqt Confirmation Bias',
    description:
      "The same confirmation bias Module 4 covered for product teams evaluating their own launches applies directly, and with real consequences, to a developer's own debugging process — favoring evidence that confirms an initial hypothesis about a bug's cause while discounting evidence that contradicts it.",
    descriptionHi:
      'Wahi confirmation bias jise Module 4 ne product teams ke liye cover kiya apne launches evaluate karte hue directly, real consequences ke saath, ek developer ke apne debugging process pe apply hoti hai — evidence ko favor karna jo ek bug ke cause ke baare mein ek initial hypothesis ko confirm karta hai jabki evidence ko discount karte hue jo ise contradict karta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A detective who forms a theory about a suspect early in an investigation and then unconsciously interprets every subsequent piece of evidence as supporting that theory, rather than genuinely testing whether the evidence actually points elsewhere.** A detective who decides early on \"it was the business partner\" is at genuine risk of interpreting ambiguous evidence in ways that support this theory — a normal financial disagreement gets read as a motive, an alibi with a small gap gets read as suspicious, while equally ambiguous evidence that doesn't fit the theory gets explained away or under-weighted. This isn't the detective being dishonest; it's the well-documented way confirmation bias operates on anyone holding a working theory, even a careful professional trying to be objective. The specific discipline that counters this in real investigative and scientific work is actively seeking evidence that would DISPROVE the leading theory, not just evidence that supports it — treating the theory as something to be genuinely tested against, not confirmed. A developer debugging an issue is in exactly the detective's position: forming an early hypothesis about a bug's cause ('it's probably the caching layer') and then being at genuine risk of interpreting every subsequent log line, every test result, through that hypothesis's lens — noticing what confirms it, explaining away what doesn't — unless the same discipline of actively trying to disprove the leading theory is deliberately applied.",
      hi: 'ek detective jo ek investigation mein early ek theory banata hai ek suspect ke baare mein aur phir unconsciously har subsequent piece of evidence ko is tarike se interpret karta hai ki wo us theory ko support karta hai, genuinely test karne ke bajaye ki kya evidence actually kahin aur point karta hai. Ek detective jo early decide karta hai "it was the business partner" genuine risk mein hai ambiguous evidence ko un tareekon mein interpret karne ka jo is theory ko support karte hain — ek normal financial disagreement ek motive ki tarah padha jaata hai, ek small gap wale alibi ko suspicious padha jaata hai, jabki equally ambiguous evidence jo theory ko fit nahi karta explain away ya under-weighted ho jaata hai. Ye detective ka dishonest hona nahi hai; ye confirmation bias ke operate karne ka well-documented tareeka hai kisi bhi pe jo ek working theory hold karta hai, ek careful professional bhi jo objective hone ki koshish kar raha hai. Specific discipline jo real investigative aur scientific work mein isse counter karta hai actively evidence dhundhna hai jo leading theory ko DISPROVE karega, sirf evidence nahi jo ise support karta hai — theory ko kuch aisa treat karna jise genuinely test kiya jaana hai, confirm nahi kiya jaana. Ek developer jo ek issue debug kar raha hai exactly detective ki position mein hai: ek bug ke cause ke baare mein ek early hypothesis banata hai (\'it\'s probably the caching layer\') aur phir genuine risk mein hai har subsequent log line, har test result ko us hypothesis ke lens ke through interpret karne ka — jo ise confirm karta hai use notice karte hue, jo nahi karta use explain away karte hue — jab tak leading theory ko actively disprove karne ki koshish karne ki wahi discipline deliberately apply nahi ki jaati.',
    },

    simple: `**The direct extension of Module 4's confirmation bias to a
developer's own debugging process:**

\`\`\`
Once a developer forms an initial hypothesis about a bug's cause, they
are at genuine risk of interpreting subsequent evidence (log output,
test results, stack traces) in ways that confirm that hypothesis,
while discounting or explaining away evidence that would disconfirm
it — the exact same mechanism Module 4 identified for product teams
evaluating their own launches, now operating on an individual
developer's live debugging session.
\`\`\`

**A concrete, recognizable debugging pattern this produces — spending
disproportionate time investigating the FIRST suspected cause while
under-investigating equally plausible alternatives:**

\`\`\`ts
// A debugging log that reveals confirmation bias in action —
// disproportionate time on the FIRST hypothesis, despite ambiguous evidence
const debuggingLog = [
  { time: '10:00', action: 'Bug reported: intermittent data corruption' },
  { time: '10:05', action: 'Hypothesis: caching layer race condition' },
  { time: '10:10', action: 'Checked cache invalidation logic — looks suspicious, could be it' },
  { time: '10:45', action: 'Still investigating cache — added more logging to cache layer' },
  { time: '11:30', action: 'Still investigating cache — race condition theory not confirmed yet but feels close' },
  { time: '12:15', action: 'Finally checked the database write path — found the actual bug in 10 minutes' },
];
// 2+ hours on the first hypothesis, 10 minutes once a genuinely
// alternative explanation was actually investigated
\`\`\`

**A concrete, structural countermeasure — the "disproving" discipline
applied directly to debugging, mirroring Module 4's confirmation-bias
countermeasures:**

\`\`\`ts
function debugWithDisconfirmationDiscipline(hypothesis, evidence) {
  // Instead of asking "does this evidence support my hypothesis?",
  // actively ask the opposite question first
  const disconfirmingTest = designTestThatWouldDisprove(hypothesis);
  const result = runTest(disconfirmingTest);

  if (result.hypothesisSurvived) {
    // The hypothesis survived a genuine attempt to disprove it —
    // meaningfully stronger evidence than merely finding confirming signs
    return { confidence: 'increased', reasoning: 'Survived a genuine disconfirmation attempt' };
  }
  return { confidence: 'decreased', reasoning: 'Failed a disconfirmation test — consider alternative hypotheses' };
}
\`\`\`

**Why time-boxing a hypothesis is a practical, checkable structural
defense — directly analogous to Module 4's pre-registered success
criteria:**

\`\`\`ts
function investigateHypothesisWithTimebox(hypothesis, maxMinutes = 30) {
  const startTime = Date.now();
  let evidence = [];

  while ((Date.now() - startTime) / 60000 < maxMinutes) {
    evidence.push(gatherNextPieceOfEvidence(hypothesis));
    if (isConclusive(evidence)) return { hypothesis, confirmed: true, evidence };
  }

  // Time-box EXPIRED without conclusive evidence — this is the
  // trigger to deliberately switch to investigating an alternative
  // hypothesis, structurally preventing indefinite over-investment
  // in a single unconfirmed theory
  return { hypothesis, confirmed: false, shouldSwitchHypothesis: true };
}
\`\`\`

**Why "it must be X because I already spent so long looking at X" is
the sunk cost fallacy (Lesson 1) and confirmation bias reinforcing
each other in a specific, common debugging trap:**

\`\`\`
A developer who has spent two hours investigating one hypothesis is at
risk of BOTH biases simultaneously: confirmation bias makes ambiguous
evidence feel like it supports the hypothesis they've been focused on,
while sunk cost reasoning makes abandoning that hypothesis feel like
"wasting" the two hours already spent — the two biases compound,
making an unproductive debugging path feel simultaneously well-
supported AND too costly to abandon, when neither feeling reflects the
actual evidence.
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established the sunk
cost fallacy specifically for larger, slower technical-debt decisions;
this lesson shows the same bias, combined with confirmation bias,
operating at the much faster timescale of a single debugging session
— demonstrating that these biases aren't confined to big, occasional
decisions but shape routine, everyday engineering work as well.`,

    simpleHi: `**Module 4 ke confirmation bias ka ek developer ke apne debugging
process tak direct extension:**

\`\`\`
Ek baar ek developer ek bug ke cause ke baare mein ek initial
hypothesis banata hai, wo genuine risk mein hai subsequent evidence
(log output, test results, stack traces) ko un tareekon mein interpret
karne ka jo us hypothesis ko confirm karte hain, jabki evidence ko
discount ya explain away karte hue jo ise disconfirm karega — exact
wahi mechanism jise Module 4 ne product teams ke liye identify kiya
apne launches evaluate karte hue, ab ek individual developer ke live
debugging session pe operate karte hue.
\`\`\`

**Ek concrete, recognizable debugging pattern jise ye produce karta
hai — PEHLE suspected cause ko investigate karne mein disproportionate
time spend karna equally plausible alternatives ko under-investigate
karte hue:**

\`\`\`ts
// Ek debugging log jo confirmation bias ko action mein reveal karta
// hai — pehle hypothesis pe disproportionate time, ambiguous evidence
// ke bawajood
const debuggingLog = [
  { time: '10:00', action: 'Bug reported: intermittent data corruption' },
  { time: '10:05', action: 'Hypothesis: caching layer race condition' },
  { time: '10:10', action: 'Checked cache invalidation logic — looks suspicious, could be it' },
  { time: '10:45', action: 'Still investigating cache — added more logging to cache layer' },
  { time: '11:30', action: 'Still investigating cache — race condition theory not confirmed yet but feels close' },
  { time: '12:15', action: 'Finally checked the database write path — found the actual bug in 10 minutes' },
];
// Pehle hypothesis pe 2+ hours, 10 minutes ek baar genuinely
// alternative explanation actually investigate ki gayi
\`\`\`

**Ek concrete, structural countermeasure — "disproving" discipline
directly debugging pe applied, Module 4 ke confirmation-bias
countermeasures ko mirror karte hue:**

\`\`\`ts
function debugWithDisconfirmationDiscipline(hypothesis, evidence) {
  // "Kya ye evidence meri hypothesis ko support karta hai?" poochne
  // ke bajaye, pehle actively opposite question pucho
  const disconfirmingTest = designTestThatWouldDisprove(hypothesis);
  const result = runTest(disconfirmingTest);

  if (result.hypothesisSurvived) {
    // Hypothesis ek genuine attempt to disprove it se survive hui —
    // meaningfully stronger evidence sirf confirming signs dhundhne se
    return { confidence: 'increased', reasoning: 'Survived a genuine disconfirmation attempt' };
  }
  return { confidence: 'decreased', reasoning: 'Failed a disconfirmation test — consider alternative hypotheses' };
}
\`\`\`

**Ek hypothesis ko time-box karna ek practical, checkable structural
defense kyun hai — directly Module 4 ke pre-registered success
criteria ke analogous:**

\`\`\`ts
function investigateHypothesisWithTimebox(hypothesis, maxMinutes = 30) {
  const startTime = Date.now();
  let evidence = [];

  while ((Date.now() - startTime) / 60000 < maxMinutes) {
    evidence.push(gatherNextPieceOfEvidence(hypothesis));
    if (isConclusive(evidence)) return { hypothesis, confirmed: true, evidence };
  }

  // Time-box koi conclusive evidence ke bina EXPIRE ho gaya — ye
  // trigger hai deliberately ek alternative hypothesis investigate
  // karne pe switch karne ke liye, ek single unconfirmed theory mein
  // indefinite over-investment ko structurally prevent karte hue
  return { hypothesis, confirmed: false, shouldSwitchHypothesis: true };
}
\`\`\`

**"Ye zaroor X hai kyunki maine already X ko itni der dekha" sunk cost
fallacy (Lesson 1) aur confirmation bias ek doosre ko reinforce karte
hue ek specific, common debugging trap mein kyun hai:**

\`\`\`
Ek developer jisne do ghante ek hypothesis investigate karne mein
spend kiye hain DONO biases ke risk mein simultaneously hai:
confirmation bias ambiguous evidence ko is tarah feel karata hai jaise
ye us hypothesis ko support karta hai jispe wo focused rahe hain,
jabki sunk cost reasoning us hypothesis ko abandon karna "waste" karne
jaisa feel karata hai already spend kiye gaye do ghante ko — do biases
compound hote hain, ek unproductive debugging path ko simultaneously
well-supported AUR abandon karne ke liye too costly feel karate hue,
jab koi bhi feeling actual evidence ko reflect nahi karti.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne sunk cost
fallacy ko specifically larger, slower technical-debt decisions ke
liye establish kiya; ye lesson wahi bias, confirmation bias ke saath
combined, ek single debugging session ke kaafi faster timescale pe
operate karte hue dikhata hai — demonstrate karte hue ki ye biases
bade, occasional decisions tak confined nahi hain balki routine,
everyday engineering work ko bhi shape karte hain.`,

    content: `## Why confirmation bias operating during debugging is the same
mechanism Module 4 identified, not a separate phenomenon

Module 4 established confirmation bias as the tendency to notice,
favor, and recall evidence that confirms existing beliefs while
discounting contradicting evidence, and showed this operating on
product teams evaluating their own launches. A developer forming an
early hypothesis about a bug's cause is in exactly the same position:
once "it's probably the caching layer" becomes the working theory,
ambiguous log output and test results are at genuine risk of being
interpreted as supporting that theory, while equally ambiguous evidence
pointing elsewhere gets explained away or under-investigated. This is
the identical cognitive mechanism, simply operating on a much faster
timescale and a more technical domain than the product-launch
evaluation Module 4 originally illustrated it with.

## Why disproportionate time on a first hypothesis is a concrete,
observable symptom worth tracking

Because confirmation bias causes ambiguous evidence to feel more
supportive of an existing hypothesis than it objectively is, a
developer under its influence tends to spend disproportionate time
investigating their first suspected cause, since each new piece of
ambiguous evidence feels like it's getting closer to confirmation
rather than prompting a genuine reconsideration. A debugging log
showing hours spent on an initial hypothesis followed by a
much-faster resolution once an alternative was actually investigated is
a concrete, after-the-fact signature of this bias having operated
during the session — a pattern worth recognizing in retrospectives.

## Why actively seeking disconfirming evidence, not just confirming
evidence, is the direct structural countermeasure

The core discipline that counters confirmation bias in careful
investigative and scientific practice is treating a working hypothesis
as something to be actively tested against — specifically designing a
check that would disprove it, rather than only looking for evidence
that would support it. Applied to debugging, this means asking "what
test would show this ISN'T the caching layer" rather than only "what
evidence suggests it is" — a hypothesis that survives a genuine
disconfirmation attempt is measurably stronger evidence than one that
merely accumulated confirming observations, mirroring Module 4's
pre-registered success criteria discipline applied to a single
debugging session's much shorter timescale.

## Why time-boxing a hypothesis is a practical, checkable version of
this same discipline

Since confirmation bias makes it difficult to recognize, in the
moment, that a hypothesis has stopped accumulating genuine evidence,
a structural time limit — deciding in advance how long to investigate
a specific hypothesis before deliberately switching to an alternative
— provides an external, bias-resistant trigger for reconsideration
that doesn't depend on the developer's own, potentially biased,
in-the-moment judgment about whether the current theory still seems
promising.

## Why sunk cost and confirmation bias compound specifically in
debugging, connecting directly to Lesson 1

A developer several hours into investigating one hypothesis
experiences both biases simultaneously: confirmation bias makes
ambiguous evidence feel supportive of the theory they're invested in,
while sunk cost reasoning (Lesson 1) makes abandoning that theory feel
like wasting the hours already spent — the two biases reinforce each
other, making an unproductive debugging path feel both well-evidenced
and too costly to abandon at once, even when the actual evidence
supports neither feeling. Recognizing this compounding is what makes
the time-boxing countermeasure especially valuable: it provides an
external decision point that doesn't require the developer to
correctly judge, in a moment when both biases are actively distorting
that judgment, whether it's time to switch hypotheses.`,

    contentHi: `## Debugging ke dauran operate karti confirmation bias wahi mechanism kyun hai jise Module 4 ne identify kiya, ek separate phenomenon nahi

Module 4 ne confirmation bias ko establish kiya existing beliefs ko
confirm karne wali evidence ko notice, favor, aur recall karne ki
tendency ki tarah jabki contradicting evidence ko discount karte hue,
aur ise product teams pe operate karte hue dikhaya apne launches
evaluate karte hue. Ek developer jo ek bug ke cause ke baare mein ek
early hypothesis banata hai exactly wahi position mein hai: ek baar
"it's probably the caching layer" working theory ban jaaye, ambiguous
log output aur test results genuine risk mein hain us theory ko
support karta hua interpret hone ka, jabki equally ambiguous evidence
jo kahin aur point karta hai explain away ya under-investigated ho
jaata hai. Ye identical cognitive mechanism hai, simply ek kaafi
faster timescale aur ek zyada technical domain pe operate karte hue
product-launch evaluation se jise Module 4 ne originally illustrate
kiya.

## Ek first hypothesis pe disproportionate time kyun ek concrete, observable symptom hai track karne layak

Kyunki confirmation bias ambiguous evidence ko ek existing hypothesis
ke liye zyada supportive feel karate hai us se jo ye objectively hai,
ek developer jo iske influence mein hai apne first suspected cause ko
investigate karne mein disproportionate time spend karne ki tendency
rakhta hai, kyunki har naya piece of ambiguous evidence feel karta hai
jaise confirmation ke close ja raha hai ek genuine reconsideration
prompt karne ke bajaye. Ek debugging log jo ek initial hypothesis pe
hours dikhata hai ek kaafi-faster resolution ke baad ek baar ek
alternative actually investigate kiya gaya ek concrete, after-the-fact
signature hai is bias ke session ke dauran operate karne ka — ek
pattern jo retrospectives mein recognize karne layak hai.

## Actively disconfirming evidence dhundhna, sirf confirming evidence nahi, direct structural countermeasure kyun hai

Core discipline jo careful investigative aur scientific practice mein
confirmation bias ko counter karta hai ek working hypothesis ko kuch
aisa treat karna hai jise actively test kiya jaana hai — specifically
ek check design karna jo ise disprove kare, sirf evidence dhundhne ke
bajaye jo ise support kare. Debugging pe applied, iska matlab hai
poochna "kaunsa test dikhayega ki ye caching layer NAHI hai" sirf
"kaunsi evidence suggest karti hai ki ye hai" ke bajaye — ek hypothesis
jo ek genuine disconfirmation attempt se survive karti hai measurably
stronger evidence hai us se jo sirf confirming observations
accumulate karti hai, Module 4 ke pre-registered success criteria
discipline ko ek single debugging session ke kaafi shorter timescale
pe applied mirror karte hue.

## Ek hypothesis ko time-box karna wahi discipline ka ek practical, checkable version kyun hai

Kyunki confirmation bias moment mein recognize karna difficult banata
hai ki ek hypothesis ne genuine evidence accumulate karna band kar
diya hai, ek structural time limit — advance mein decide karna ki ek
specific hypothesis ko kitni der investigate karna hai deliberately ek
alternative pe switch karne se pehle — reconsideration ke liye ek
external, bias-resistant trigger provide karta hai jo developer ke
apne, potentially biased, in-the-moment judgment pe depend nahi karta
is baat ka ki kya current theory abhi bhi promising lagti hai.

## Sunk cost aur confirmation bias specifically debugging mein kyun compound hote hain, directly Lesson 1 se connect karte hue

Ek developer jo ek hypothesis investigate karne mein kai ghante door
hai dono biases simultaneously experience karta hai: confirmation bias
ambiguous evidence ko us theory ke liye supportive feel karata hai
jismein wo invested hain, jabki sunk cost reasoning (Lesson 1) us
theory ko abandon karna already spend kiye gaye ghanton ko waste karna
jaisa feel karata hai — do biases ek doosre ko reinforce karte hain, ek
unproductive debugging path ko simultaneously well-evidenced aur
abandon karne ke liye too costly feel karate hue, even jab actual
evidence kisi bhi feeling ko support nahi karti. Is compounding ko
recognize karna wo hai jo time-boxing countermeasure ko especially
valuable banata hai: ye ek external decision point provide karta hai
jise developer ko correctly judge karne ki zaroorat nahi hoti, ek
moment mein jab dono biases actively us judgment ko distort kar rahe
hain, ki kya hypotheses switch karne ka time hai.`,

    examples: [
      {
        title: 'A disconfirmation-driven debugging helper and a time-boxed hypothesis tracker',
        titleHi: 'Ek disconfirmation-driven debugging helper aur ek time-boxed hypothesis tracker',
        codeJs: `function designDisconfirmingTest(hypothesis) {
  // Instead of "what evidence supports this?", explicitly design a
  // test that would FAIL if the hypothesis is wrong — genuinely
  // testing it, not just looking for confirmation
  const disconfirmingTests = {
    'caching layer race condition': () => checkIfBugReproducesWithCacheDisabled(),
    'database write path': () => checkIfBugReproducesWithReadOnlyReplica(),
  };
  return disconfirmingTests[hypothesis];
}

function investigateWithTimebox(hypothesis, maxMinutes) {
  const startTime = Date.now();
  const disconfirmingTest = designDisconfirmingTest(hypothesis);

  while ((Date.now() - startTime) / 60000 < maxMinutes) {
    const result = disconfirmingTest();
    if (result.bugStillReproduces) {
      // The hypothesis SURVIVED an attempt to disprove it —
      // genuinely stronger evidence than a confirming observation
      return { hypothesis, status: 'survived_disconfirmation_attempt' };
    }
    if (result.bugDidNotReproduce) {
      // The hypothesis FAILED the disconfirmation test — this
      // specific theory is likely wrong, switch immediately
      return { hypothesis, status: 'disproven', nextStep: 'investigate_alternative' };
    }
  }
  // Time-box expired inconclusively — structurally forces a switch
  // rather than allowing indefinite investment in one theory
  return { hypothesis, status: 'timeboxed_out', nextStep: 'investigate_alternative' };
}`,
        codeTs: `type DisconfirmingTestResult = { bugStillReproduces: boolean; bugDidNotReproduce: boolean };

function designDisconfirmingTest(hypothesis: string): () => DisconfirmingTestResult {
  // Instead of "what evidence supports this?", explicitly design a
  // test that would FAIL if the hypothesis is wrong — genuinely
  // testing it, not just looking for confirmation
  const disconfirmingTests: Record<string, () => DisconfirmingTestResult> = {
    'caching layer race condition': () => checkIfBugReproducesWithCacheDisabled(),
    'database write path': () => checkIfBugReproducesWithReadOnlyReplica(),
  };
  return disconfirmingTests[hypothesis];
}

interface InvestigationResult {
  hypothesis: string;
  status: 'survived_disconfirmation_attempt' | 'disproven' | 'timeboxed_out';
  nextStep?: string;
}

function investigateWithTimebox(hypothesis: string, maxMinutes: number): InvestigationResult {
  const startTime = Date.now();
  const disconfirmingTest = designDisconfirmingTest(hypothesis);

  while ((Date.now() - startTime) / 60000 < maxMinutes) {
    const result = disconfirmingTest();
    if (result.bugStillReproduces) {
      // The hypothesis SURVIVED an attempt to disprove it —
      // genuinely stronger evidence than a confirming observation
      return { hypothesis, status: 'survived_disconfirmation_attempt' };
    }
    if (result.bugDidNotReproduce) {
      // The hypothesis FAILED the disconfirmation test — this
      // specific theory is likely wrong, switch immediately
      return { hypothesis, status: 'disproven', nextStep: 'investigate_alternative' };
    }
  }
  // Time-box expired inconclusively — structurally forces a switch
  // rather than allowing indefinite investment in one theory
  return { hypothesis, status: 'timeboxed_out', nextStep: 'investigate_alternative' };
}`,
        code: `const disconfirmingTest = designDisconfirmingTest('caching layer race condition');
// designed to FAIL the hypothesis, not confirm it — the discipline
// that counters confirmation bias directly`,
        output:
          "The caching-layer hypothesis is tested by deliberately trying to make it fail (disabling the cache and checking if the bug still reproduces) rather than searching for supporting log evidence. If the bug still reproduces with caching disabled, the hypothesis is disproven quickly and cleanly — far faster than continuing to accumulate ambiguous, seemingly-confirming evidence for an incorrect theory.",
        explain:
          "This example directly implements the lesson's core countermeasure: instead of asking whether evidence supports the leading hypothesis (which confirmation bias will readily seem to confirm), it designs a specific test engineered to disprove the hypothesis, and the time-box ensures an inconclusive investigation doesn't continue indefinitely on bias-driven momentum alone.",
        explainHi:
          "Ye example lesson ke core countermeasure ko directly implement karta hai: ye poochne ke bajaye ki kya evidence leading hypothesis ko support karti hai (jise confirmation bias readily confirm karta hua seem karega), ye ek specific test design karta hai hypothesis ko disprove karne ke liye engineered, aur time-box ensure karta hai ki ek inconclusive investigation sirf bias-driven momentum pe indefinitely continue na kare.",
      },
    ],

    mistakes: [
      {
        wrong: `// Continuing to search only for evidence supporting the initial
// hypothesis, hours into an unresolved investigation
function debugSessionWrong(initialHypothesis) {
  let hoursSpent = 0;
  while (!isConfirmed(initialHypothesis)) {
    hoursSpent++;
    // Keeps looking for MORE confirming evidence for the SAME
    // hypothesis, never designing a test that could disprove it,
    // never considering alternatives — classic confirmation bias
    gatherMoreSupportingEvidence(initialHypothesis);
  }
}`,
        right: `// Actively testing to disprove the hypothesis, with a hard time-box
// forcing reconsideration if it isn't resolved
function debugSessionRight(initialHypothesis) {
  const result = investigateWithTimebox(initialHypothesis, 30);
  if (result.status === 'disproven' || result.status === 'timeboxed_out') {
    const alternativeHypothesis = generateAlternativeHypothesis();
    return investigateWithTimebox(alternativeHypothesis, 30);
  }
  return result;
}`,
        why: "Only searching for evidence that confirms an existing hypothesis, without ever designing a test that could disprove it, is exactly the mechanism that lets confirmation bias extend an unproductive debugging path indefinitely — a hard time-box combined with a genuine disconfirmation attempt provides the structural forcing function that a developer's own in-the-moment judgment, distorted by the bias, cannot reliably provide.",
        whyHi:
          "Sirf us evidence ko dhundhna jo ek existing hypothesis ko confirm karti hai, kabhi ek test design kiye bina jo ise disprove kar sake, exactly wo mechanism hai jo confirmation bias ko ek unproductive debugging path ko indefinitely extend karne deta hai — ek hard time-box ek genuine disconfirmation attempt ke saath combined structural forcing function provide karta hai jo ek developer ka apna in-the-moment judgment, bias se distorted, reliably provide nahi kar sakta.",
      },
    ],

    realWorld: [
      {
        en: "A production engineering team adopted a formal 'disconfirmation-first' debugging practice for any issue unresolved after 45 minutes, requiring the investigating engineer to explicitly design and run a test aimed at disproving their leading theory before continuing — retrospective analysis found this practice cut median time-to-resolution for complex bugs by identifying incorrect leading hypotheses far earlier than the team's previous, purely confirmation-seeking approach had.",
        hi: 'Ek production engineering team ne ek formal \'disconfirmation-first\' debugging practice adopt ki kisi bhi issue ke liye jo 45 minutes ke baad unresolved rehta hai, investigating engineer ko explicitly ek test design aur run karne ki zaroorat karte hue jiska aim unki leading theory ko disprove karna hai continue karne se pehle — retrospective analysis ne paaya ki ye practice complex bugs ke liye median time-to-resolution ko kaat deti hai incorrect leading hypotheses ko team ke previous, purely confirmation-seeking approach se kaafi jaldi identify karke.',
      },
    ],

    interviewQA: [
      {
        q: 'How does confirmation bias operate during debugging, and why is it the same mechanism Module 4 described for product teams?',
        qHi: 'Confirmation bias debugging ke dauran kaise operate karta hai, aur ye wahi mechanism kyun hai jise Module 4 ne product teams ke liye describe kiya?',
        a: "Once a developer forms an initial hypothesis about a bug's cause, ambiguous evidence (logs, test results) is at genuine risk of being interpreted as supporting that hypothesis, while equally ambiguous evidence pointing elsewhere gets discounted or under-investigated. This is the identical cognitive mechanism Module 4 described for teams evaluating their own product launches — noticing confirming evidence and discounting disconfirming evidence — simply operating on a faster timescale within a single debugging session.",
        aHi: 'Ek baar ek developer ek bug ke cause ke baare mein ek initial hypothesis banata hai, ambiguous evidence (logs, test results) genuine risk mein hai us hypothesis ko support karta hua interpret hone ka, jabki equally ambiguous evidence jo kahin aur point karta hai discount ya under-investigated ho jaata hai. Ye identical cognitive mechanism hai jise Module 4 ne teams ke liye describe kiya apne product launches evaluate karte hue — confirming evidence notice karna aur disconfirming evidence discount karna — simply ek faster timescale pe ek single debugging session ke andar operate karte hue.',
      },
      {
        q: "Why is designing a test specifically intended to disprove a debugging hypothesis a stronger practice than searching for confirming evidence?",
        qHi: 'Ek debugging hypothesis ko specifically disprove karne ke liye intended ek test design karna confirming evidence dhundhne se ek stronger practice kyun hai?',
        a: "A hypothesis that survives a genuine attempt to disprove it provides measurably stronger evidence than one that merely accumulated confirming observations, since confirmation bias makes ambiguous evidence readily feel supportive regardless of whether it actually is. Actively trying to disprove the hypothesis removes this bias's ability to distort the evidence being sought.",
        aHi: 'Ek hypothesis jo ek genuine attempt to disprove it se survive karti hai measurably stronger evidence provide karti hai us se jo sirf confirming observations accumulate karti hai, kyunki confirmation bias ambiguous evidence ko readily supportive feel karata hai chahe ye actually ho ya na ho. Hypothesis ko actively disprove karne ki koshish karna is bias ki dhundhi ja rahi evidence ko distort karne ki ability ko remove karta hai.',
      },
    ],

    exercises: [
      {
        task: "A developer has spent three hours convinced a performance bug is caused by an N+1 database query pattern, adding more and more logging around database calls without finding conclusive proof, while a colleague suggests checking a recently-changed caching configuration that could equally explain the symptoms. Using this lesson's disconfirmation-first practice, describe the specific test the developer should design and run, and explain why continuing to add logging around the original hypothesis is a symptom of confirmation bias rather than sound debugging.",
        taskHi: 'Ek developer ne teen ghante spend kiye hain convinced ki ek performance bug ek N+1 database query pattern se caused hai, database calls ke around zyada se zyada logging add karte hue koi conclusive proof paaye bina, jabki ek colleague suggest karta hai ek recently-changed caching configuration check karna jo equally symptoms explain kar sakta hai. Is lesson ki disconfirmation-first practice use karke, us specific test ko describe karo jo developer ko design aur run karna chahiye, aur explain karo ki original hypothesis ke around logging add karna continue karna sound debugging ke bajaye confirmation bias ka ek symptom kyun hai.',
        hint: "Think about what test would specifically try to make the N+1 hypothesis FAIL, rather than another test that merely looks for more evidence supporting it — and consider whether the colleague's caching suggestion should be investigated in parallel rather than dismissed.",
        hintHi: 'Socho ki kaunsa test specifically N+1 hypothesis ko FAIL karne ki koshish karega, ek aur test ke bajaye jo sirf ise support karne wali zyada evidence dhundhta hai — aur consider karo ki kya colleague ka caching suggestion parallel mein investigate kiya jaana chahiye dismiss karne ke bajaye.',
      },
    ],

    keyTakeaways: [
      "Confirmation bias operates on a developer's own debugging process exactly as Module 4 described for product teams — favoring evidence confirming an initial hypothesis while discounting disconfirming evidence.",
      "Disproportionate time spent on a first hypothesis, followed by fast resolution once an alternative is actually investigated, is a concrete, recognizable symptom of this bias having operated.",
      "Actively designing a test intended to disprove the leading hypothesis, rather than only searching for confirming evidence, is the direct structural countermeasure.",
      "Time-boxing hypothesis investigation provides an external, bias-resistant trigger for reconsideration, and directly counters the compounding effect where sunk cost (Lesson 1) and confirmation bias reinforce each other during a stuck debugging session.",
    ],
    keyTakeawaysHi: [
      'Confirmation bias ek developer ke apne debugging process pe exactly wahi tarike se operate karta hai jaise Module 4 ne product teams ke liye describe kiya — ek initial hypothesis ko confirm karti evidence ko favor karte hue jabki disconfirming evidence ko discount karte hue.',
      'Ek first hypothesis pe disproportionate time spend karna, ek fast resolution ke baad ek baar ek alternative actually investigate ki gayi, is bias ke operate karne ka ek concrete, recognizable symptom hai.',
      'Actively ek test design karna jo leading hypothesis ko disprove karne ke liye intended hai, sirf confirming evidence dhundhne ke bajaye, direct structural countermeasure hai.',
      'Hypothesis investigation ko time-box karna reconsideration ke liye ek external, bias-resistant trigger provide karta hai, aur directly us compounding effect ko counter karta hai jahan sunk cost (Lesson 1) aur confirmation bias ek doosre ko reinforce karte hain ek stuck debugging session ke dauran.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'psych-planning-fallacy-in-estimation',
    title: 'Overconfidence in Estimation — the Planning Fallacy',
    titleHi: 'Estimation Mein Overconfidence — The Planning Fallacy',
    description:
      "Closing this module: the planning fallacy — a well-documented, systematic tendency to underestimate how long a task will take, even when the estimator has direct, personal experience with similar tasks running over before — explains why software estimates are chronically, predictably optimistic.",
    descriptionHi:
      'Is module ko close karte hue: planning fallacy — ek task ko kitna time lagega ise underestimate karne ki ek well-documented, systematic tendency, even jab estimator ke paas similar tasks ke pehle over-run hone ka direct, personal experience hai — explain karta hai ki software estimates chronically, predictably optimistic kyun hote hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A person confidently estimating they'll finish a home renovation in two weekends, despite having personally experienced every one of their last five renovation projects running at least twice as long as originally planned.** Someone about to start a new home renovation project sincerely believes THIS specific project will take two weekends — not because they've never been wrong before, but because when they imagine this particular project, they picture the straightforward, no-complications version of events: the materials arrive on time, no wall turns out to have unexpected wiring behind it, no measurement turns out to be slightly off. Their own direct, personal history says this optimistic picture has been wrong five times in a row, yet that history somehow doesn't transfer into their confidence about THIS specific instance, which still feels like a fresh, clean case unburdened by past experience. This isn't a failure to remember the past projects; it's a well-documented, specific cognitive pattern where people estimate a new task by imagining its best-case execution path, rather than by using their own base-rate history of how similar tasks have actually gone. A software team estimating a new feature is in exactly this position: the estimate that feels right is the one that pictures a smooth, no-complications implementation, even when the team's own history of past features shows this same optimistic picture has predictably fallen short before, over and over, in ways their own experience should have taught them to expect.",
      hi: 'ek insaan confidently estimate karta hai ki wo ek home renovation ko do weekends mein finish kar lega, apne last five renovation projects mein se har ek ke personally experience karne ke bawajood ki ye originally planned se kam se kam do guna zyada time laga. Koi jo ek naya home renovation project shuru karne wala hai sincerely believe karta hai ki YE specific project do weekends lega — is wajah se nahi ki wo pehle kabhi galat nahi hue, balki is wajah se ki jab wo is particular project ko imagine karte hain, wo events ke straightforward, no-complications version ko picture karte hain: materials time pe aate hain, koi wall unexpected wiring nikalti nahi uske peeche, koi measurement thodi bhi off nahi nikalta. Unki apni direct, personal history kehti hai ye optimistic picture five baar row mein galat rahi hai, phir bhi wo history somehow IS specific instance ke baare mein unki confidence mein transfer nahi hoti, jo abhi bhi ek fresh, clean case ki tarah feel karta hai past experience se unburdened. Ye past projects ko yaad rakhne mein ek failure nahi hai; ye ek well-documented, specific cognitive pattern hai jahan log ek naya task ko uske best-case execution path ko imagine karke estimate karte hain, apni khud ki base-rate history use karne ke bajaye ki similar tasks actually kaise gaye hain. Ek software team jo ek naya feature estimate kar rahi hai exactly is position mein hai: estimate jo sahi feel karta hai wo hai jo ek smooth, no-complications implementation picture karta hai, chahe team ki apni past features ki history dikhati ho ki wahi optimistic picture predictably pehle short gira hai, baar baar, un tareekon mein jo unke apne experience ko unhe expect karna sikhana chahiye tha.',
    },

    simple: `**The core, well-documented finding (Kahneman & Tversky's original
research, extensively replicated since):**

\`\`\`
The planning fallacy is the tendency to estimate a task's completion
time by imagining its best-case, no-complications execution path,
rather than by using the actual, historical base rate of how similar
tasks have gone. Critically, this happens even when the estimator has
extensive, direct personal experience with similar tasks running over
— past experience with overruns does NOT automatically correct future
estimates, because each new task is imagined afresh rather than
statistically compared to history.
\`\`\`

**A concrete, checkable pattern this explains in software estimation
— why "this time will be different" feels true every single time:**

\`\`\`ts
// The intuitive, planning-fallacy-driven estimation approach
function estimateFeatureWrong(featureDescription) {
  // Imagines the smooth, no-complications path: requirements are
  // clear, no unexpected edge cases, no integration surprises
  return imagineIdealExecutionPath(featureDescription).estimatedDays;
  // This is why estimates feel confident and reasonable in the
  // moment — they're not being fabricated, they're genuinely
  // picturing the best-case scenario as if it were the likely one
}

// A base-rate-driven estimation approach, directly countering the fallacy
function estimateFeatureRight(featureDescription, historicalFeatures) {
  const similarPastFeatures = findSimilarFeatures(historicalFeatures, featureDescription);
  const actualCompletionTimes = similarPastFeatures.map((f) => f.actualDays);
  const initialEstimates = similarPastFeatures.map((f) => f.originalEstimateDays);

  // The historical OVERRUN RATIO, not a fresh imagining of this
  // specific task, drives the estimate
  const averageOverrunRatio = average(actualCompletionTimes.map((actual, i) => actual / initialEstimates[i]));
  const naiveEstimate = imagineIdealExecutionPath(featureDescription).estimatedDays;

  return naiveEstimate * averageOverrunRatio; // corrects the naive,
  // best-case estimate using the team's own actual track record
}
\`\`\`

**Why "reference class forecasting" — deliberately estimating from
a class of similar past projects rather than reasoning about this
specific project's details — is the direct, structural countermeasure:**

\`\`\`
Rather than asking "how long will THIS specific feature take" (a
question the planning fallacy answers with an imagined best-case
path), reference class forecasting asks "how long have features
LIKE THIS actually taken historically" — deliberately substituting a
statistical base rate for an individual, optimistic mental simulation.
This is a direct, practical application of the same "trust the
data, not the vivid mental picture" principle this course has applied
elsewhere.
\`\`\`

**A concrete, structural team practice this motivates — tracking
estimate-vs-actual ratios as a first-class team metric, not just
tracking whether individual tasks were "on time":**

\`\`\`ts
function trackEstimationAccuracy(completedFeatures) {
  const overrunRatios = completedFeatures.map((f) => f.actualDays / f.estimatedDays);
  const teamAverageOverrun = average(overrunRatios);

  // This number, tracked over time, is the team's own reference
  // class — a concrete, checkable correction factor to apply to
  // future naive estimates, rather than hoping "this time" will
  // finally be accurate
  return {
    teamAverageOverrunRatio: teamAverageOverrun,
    recommendation: \`Apply a \${teamAverageOverrun}x multiplier to naive best-case estimates\`,
  };
}
\`\`\`

**Why the planning fallacy connects directly back to the sunk cost
fallacy (Lesson 1) and confirmation bias (Lesson 2) as this module's
third and final example of a bias affecting developers specifically:**

\`\`\`
All three biases in this module share a common shape: each one causes
a developer or team to systematically deviate from what a purely
rational, evidence-based process would conclude — continuing past
investments regardless of future value (Lesson 1), interpreting
evidence to fit an existing belief rather than genuinely testing it
(Lesson 2), and estimating from an imagined ideal rather than actual
historical performance (this lesson). Recognizing all three as
instances of the SAME general category — systematic, predictable
deviations from rational evaluation — is more useful than treating
them as three unrelated quirks.
\`\`\`

**How this lesson closes Module 5:** having covered how biases distort
technical-debt decisions (Lesson 1) and in-the-moment debugging
(Lesson 2), this lesson completes the module by showing the same
underlying pattern — trusting an imagined, idealized scenario over
actual historical data — distorting one of software engineering's
most consequential and consistently underestimated activities:
predicting how long work will actually take.`,

    simpleHi: `**Core, well-documented finding (Kahneman & Tversky ki original
research, tab se extensively replicated):**

\`\`\`
Planning fallacy ek task ke completion time ko uske best-case, no-
complications execution path ko imagine karke estimate karne ki
tendency hai, similar tasks actually kaise gaye hain uski actual,
historical base rate use karne ke bajaye. Critically, ye tab bhi hota
hai jab estimator ke paas similar tasks ke over-run hone ka extensive,
direct personal experience hai — overruns ke saath past experience
automatically future estimates ko correct NAHI karta, kyunki har naya
task freshly imagine kiya jaata hai history se statistically compare
kiye jaane ke bajaye.
\`\`\`

**Ek concrete, checkable pattern jise ye software estimation mein
explain karta hai — "is baar different hoga" har single baar sach kyun
feel hota hai:**

\`\`\`ts
// Intuitive, planning-fallacy-driven estimation approach
function estimateFeatureWrong(featureDescription) {
  // Smooth, no-complications path imagine karta hai: requirements
  // clear hain, koi unexpected edge cases nahi, koi integration
  // surprises nahi
  return imagineIdealExecutionPath(featureDescription).estimatedDays;
  // Yahi wajah hai estimates confident aur reasonable feel karte hain
  // us moment mein — wo fabricate nahi ki ja rahi, wo genuinely
  // best-case scenario ko picture kar rahi hain jaise ye likely wala
  // ho
}

// Ek base-rate-driven estimation approach, directly fallacy ko counter karte hue
function estimateFeatureRight(featureDescription, historicalFeatures) {
  const similarPastFeatures = findSimilarFeatures(historicalFeatures, featureDescription);
  const actualCompletionTimes = similarPastFeatures.map((f) => f.actualDays);
  const initialEstimates = similarPastFeatures.map((f) => f.originalEstimateDays);

  // Historical OVERRUN RATIO, is specific task ka ek fresh imagining
  // nahi, estimate ko drive karta hai
  const averageOverrunRatio = average(actualCompletionTimes.map((actual, i) => actual / initialEstimates[i]));
  const naiveEstimate = imagineIdealExecutionPath(featureDescription).estimatedDays;

  return naiveEstimate * averageOverrunRatio; // naive, best-case
  // estimate ko team ke apne actual track record se correct karta hai
}
\`\`\`

**"Reference class forecasting" — deliberately similar past projects
ki ek class se estimate karna is specific project ki details ke baare
mein reason karne ke bajaye — direct, structural countermeasure kyun
hai:**

\`\`\`
"Ye specific feature kitna time lega" poochne ke bajaye (ek question
jise planning fallacy ek imagined best-case path se answer karta hai),
reference class forecasting poochta hai "IS JAISE features actually
historically kitna time lete hain" — deliberately ek statistical base
rate ko ek individual, optimistic mental simulation ke liye substitute
karte hue. Ye wahi "data pe trust karo, vivid mental picture pe nahi"
principle ka ek direct, practical application hai jise ye course
kahin aur apply kar chuka hai.
\`\`\`

**Ek concrete, structural team practice jise ye motivate karta hai —
estimate-vs-actual ratios ko ek first-class team metric ki tarah track
karna, sirf ye track karna nahi ki individual tasks "on time" the:**

\`\`\`ts
function trackEstimationAccuracy(completedFeatures) {
  const overrunRatios = completedFeatures.map((f) => f.actualDays / f.estimatedDays);
  const teamAverageOverrun = average(overrunRatios);

  // Ye number, time ke saath tracked, team ka apna reference class
  // hai — ek concrete, checkable correction factor jo future naive
  // estimates pe apply kiya jaaye, "is baar" finally accurate hone ki
  // hope karne ke bajaye
  return {
    teamAverageOverrunRatio: teamAverageOverrun,
    recommendation: \`Apply a \${teamAverageOverrun}x multiplier to naive best-case estimates\`,
  };
}
\`\`\`

**Planning fallacy directly sunk cost fallacy (Lesson 1) aur
confirmation bias (Lesson 2) se kaise wapas connect karta hai is
module ke third aur final example ki tarah ek bias ka jo specifically
developers ko affect karta hai:**

\`\`\`
Is module ke teenon biases ek common shape share karte hain: har ek ek
developer ya team ko systematically us se deviate karata hai jo ek
purely rational, evidence-based process conclude karti — past
investments ko continue karna future value se independently (Lesson
1), evidence ko ek existing belief ko fit karne ke liye interpret
karna use genuinely test karne ke bajaye (Lesson 2), aur ek imagined
ideal se estimate karna actual historical performance ke bajaye (ye
lesson). Teenon ko SAME general category ke instances ki tarah
recognize karna — systematic, predictable deviations from rational
evaluation — unhe teen unrelated quirks ki tarah treat karne se zyada
useful hai.
\`\`\`

**Ye lesson Module 5 ko kaise close karta hai:** ye cover karne ke
baad ki biases technical-debt decisions (Lesson 1) aur in-the-moment
debugging (Lesson 2) ko kaise distort karte hain, ye lesson module ko
complete karta hai wahi underlying pattern dikhate hue — ek imagined,
idealized scenario ko actual historical data se zyada trust karna —
software engineering ki sabse consequential aur consistently
underestimated activities mein se ek ko distort karte hue: predict
karna ki work ko actually kitna time lagega.`,

    content: `## Why the planning fallacy persists even for people with direct,
personal experience of past overruns

Kahneman and Tversky's foundational research on the planning fallacy
established that people estimate task duration by imagining a specific
execution path — typically the smooth, best-case version of events —
rather than by drawing on their own statistical history of how similar
tasks have actually gone. Critically, this happens even for people who
have personally experienced repeated overruns on similar past tasks:
each new task is evaluated as a fresh, individual case, and the
imagined best-case scenario for THIS specific instance feels
compelling regardless of what history says about instances like it.
This is why simply reminding a team "we're always late" doesn't fix
the problem — the bias isn't a failure to remember the past, it's a
failure to apply that remembered pattern to the vivid, specific
mental simulation of the current task.

## Why reference class forecasting is the direct, structural
countermeasure to this specific failure mode

Because the planning fallacy specifically involves substituting an
imagined individual scenario for actual historical statistics,
reference class forecasting directly reverses this substitution: instead
of asking how long this specific task will take (a question the mind
answers with an optimistic simulation), it asks how long tasks in the
same reference class have actually taken historically, and uses that
statistical base rate — including its own historical overrun ratio —
as the estimate, or as a correction factor applied to the naive,
best-case estimate. This is a direct, deliberate override of an
individual mental simulation with an actual statistical track record.

## Why tracking a team's own overrun ratio as an explicit metric is
more effective than simply trying to "estimate more carefully"

Since the planning fallacy operates specifically by making the
optimistic scenario feel like the realistic one, simply exhorting a
team to "be more careful" or "think harder" about an estimate doesn't
address the actual mechanism — the optimistic scenario will still feel
compelling no matter how carefully it's considered. Explicitly tracking
the team's own historical ratio of actual-to-estimated time provides an
external, numerical correction factor that doesn't depend on
correctly overriding the bias through effort or willpower in the
moment — it substitutes a concrete number for a felt sense of
confidence, which is precisely what the bias otherwise distorts.

## How this lesson connects the planning fallacy to Lessons 1 and 2
as instances of one general category

The sunk cost fallacy (Lesson 1), confirmation bias in debugging
(Lesson 2), and the planning fallacy (this lesson) share a common
underlying shape: each causes a systematic, predictable deviation from
what a purely rational process, evaluating only the actual relevant
evidence, would conclude. Recognizing this shared structure — rather
than treating each as an isolated, unrelated engineering quirk — is
what makes the general skill of "trust the data over the vivid mental
picture or feeling" transferable across contexts, rather than
requiring a separate, unrelated fix memorized for each specific bias.

## How this lesson closes Module 5

Lesson 1 examined how sunk cost reasoning distorts larger, slower
technical-debt decisions. Lesson 2 examined how confirmation bias
distorts a single, faster debugging session. This lesson completes
the module by examining how the planning fallacy distorts one of
software engineering's most routine and consequential activities —
estimation — closing out this module's argument that developers and
teams are subject to the same category of systematic cognitive bias
this course has documented throughout, requiring the same category of
structural, data-driven countermeasure in each specific case.`,

    contentHi: `## Planning fallacy un logon ke liye bhi kyun persist karta hai jinke paas past overruns ka direct, personal experience hai

Kahneman aur Tversky ki planning fallacy pe foundational research ne
establish kiya ki log task duration ko ek specific execution path
imagine karke estimate karte hain — typically events ka smooth,
best-case version — apni khud ki statistical history draw karne ke
bajaye ki similar tasks actually kaise gaye hain. Critically, ye tab
bhi hota hai un logon ke liye jinhone personally similar past tasks pe
repeated overruns experience kiye hain: har naya task ek fresh,
individual case ki tarah evaluate kiya jaata hai, aur IS specific
instance ke liye imagined best-case scenario compelling feel karta hai
is baat se independently ki history aise instances ke baare mein kya
kehti hai. Yahi wajah hai sirf ek team ko "hum hamesha late hote hain"
yaad dilana problem fix nahi karta — bias past ko yaad rakhne mein ek
failure nahi hai, ye us remembered pattern ko current task ke vivid,
specific mental simulation pe apply karne mein ek failure hai.

## Reference class forecasting is specific failure mode ka direct, structural countermeasure kyun hai

Kyunki planning fallacy specifically ek imagined individual scenario
ko actual historical statistics ke liye substitute karna involve karti
hai, reference class forecasting directly is substitution ko reverse
karti hai: ye poochne ke bajaye ki ye specific task kitna time lega
(ek question jise mind ek optimistic simulation se answer karta hai),
ye poochta hai ki wahi reference class mein tasks actually historically
kitna time lete hain, aur us statistical base rate ko use karta hai —
uska apna historical overrun ratio samet — estimate ki tarah, ya ek
correction factor ki tarah jo naive, best-case estimate pe applied hai.
Ye ek individual mental simulation ka ek actual statistical track
record se ek direct, deliberate override hai.

## Ek team ke apne overrun ratio ko ek explicit metric ki tarah track karna sirf "zyada carefully estimate karo" try karne se zyada effective kyun hai

Kyunki planning fallacy specifically optimistic scenario ko realistic
wale ki tarah feel karake operate karta hai, sirf ek team ko "zyada
careful raho" ya "estimate ke baare mein zyada socho" exhort karna
actual mechanism ko address nahi karta — optimistic scenario abhi bhi
compelling feel karega chahe ise kitni bhi carefully consider kiya
jaaye. Team ke apne historical ratio of actual-to-estimated time ko
explicitly track karna ek external, numerical correction factor
provide karta hai jo moment mein effort ya willpower se bias ko
correctly override karne pe depend nahi karta — ye confidence ke ek
felt sense ke liye ek concrete number substitute karta hai, jo
exactly wo hai jise bias otherwise distort karta hai.

## Ye lesson planning fallacy ko Lessons 1 aur 2 se ek general category ke instances ki tarah kaise connect karta hai

Sunk cost fallacy (Lesson 1), debugging mein confirmation bias (Lesson
2), aur planning fallacy (ye lesson) ek common underlying shape share
karte hain: har ek ek systematic, predictable deviation cause karta hai
us se jo ek purely rational process, sirf actual relevant evidence ko
evaluate karte hue, conclude karegi. Is shared structure ko recognize
karna — har ek ko ek isolated, unrelated engineering quirk ki tarah
treat karne ke bajaye — wo hai jo "data ko vivid mental picture ya
feeling se zyada trust karo" ki general skill ko contexts ke across
transferable banata hai, har specific bias ke liye ek separate,
unrelated fix memorize karne ki zaroorat ke bajaye.

## Ye lesson Module 5 ko kaise close karta hai

Lesson 1 ne examine kiya ki sunk cost reasoning larger, slower
technical-debt decisions ko kaise distort karti hai. Lesson 2 ne
examine kiya ki confirmation bias ek single, faster debugging session
ko kaise distort karti hai. Ye lesson module ko complete karta hai ye
examine karke ki planning fallacy software engineering ki sabse
routine aur consequential activities mein se ek ko kaise distort karta
hai — estimation — is module ke argument ko close karte hue ki
developers aur teams us category ke systematic cognitive bias ke
subject hain jise is course ne throughout document kiya hai, har
specific case mein wahi category ki structural, data-driven
countermeasure maangte hue.`,

    examples: [
      {
        title: 'A reference-class-based estimation function and a team overrun-ratio tracker',
        titleHi: 'Ek reference-class-based estimation function aur ek team overrun-ratio tracker',
        codeJs: `function calculateReferenceClassEstimate(newFeature, historicalFeatures) {
  // Find genuinely comparable past features — same TYPE of work,
  // not just superficially similar names
  const referenceClass = historicalFeatures.filter(
    (f) => f.category === newFeature.category && f.complexity === newFeature.complexity
  );

  if (referenceClass.length === 0) {
    return { estimate: null, warning: 'No reference class available — estimate will be unusually uncertain' };
  }

  const overrunRatios = referenceClass.map((f) => f.actualDays / f.originalEstimateDays);
  const medianOverrunRatio = median(overrunRatios);

  const naiveEstimate = imagineIdealExecutionPath(newFeature).estimatedDays;

  return {
    naiveEstimate,
    referenceClassOverrunRatio: medianOverrunRatio,
    correctedEstimate: naiveEstimate * medianOverrunRatio,
    referenceClassSize: referenceClass.length,
  };
}

function trackTeamEstimationAccuracy(completedFeatures) {
  const ratios = completedFeatures.map((f) => f.actualDays / f.originalEstimateDays);
  return {
    medianOverrunRatio: median(ratios),
    sampleSize: completedFeatures.length,
    // This number becomes the team's own, empirically-grounded
    // correction factor for all future naive estimates
  };
}`,
        codeTs: `interface HistoricalFeature {
  category: string;
  complexity: string;
  originalEstimateDays: number;
  actualDays: number;
}

interface NewFeature {
  category: string;
  complexity: string;
}

function calculateReferenceClassEstimate(newFeature: NewFeature, historicalFeatures: HistoricalFeature[]) {
  // Find genuinely comparable past features — same TYPE of work,
  // not just superficially similar names
  const referenceClass = historicalFeatures.filter(
    (f) => f.category === newFeature.category && f.complexity === newFeature.complexity
  );

  if (referenceClass.length === 0) {
    return { estimate: null, warning: 'No reference class available — estimate will be unusually uncertain' };
  }

  const overrunRatios = referenceClass.map((f) => f.actualDays / f.originalEstimateDays);
  const medianOverrunRatio = median(overrunRatios);

  const naiveEstimate = imagineIdealExecutionPath(newFeature).estimatedDays;

  return {
    naiveEstimate,
    referenceClassOverrunRatio: medianOverrunRatio,
    correctedEstimate: naiveEstimate * medianOverrunRatio,
    referenceClassSize: referenceClass.length,
  };
}

function trackTeamEstimationAccuracy(completedFeatures: HistoricalFeature[]) {
  const ratios = completedFeatures.map((f) => f.actualDays / f.originalEstimateDays);
  return {
    medianOverrunRatio: median(ratios),
    sampleSize: completedFeatures.length,
    // This number becomes the team's own, empirically-grounded
    // correction factor for all future naive estimates
  };
}`,
        code: `const correctedEstimate = naiveEstimate * medianOverrunRatio;
// the team's own historical track record corrects the optimistic,
// best-case-imagined naive estimate`,
        output:
          "A naive estimate of 5 days for a new feature, combined with a reference class showing a historical median overrun ratio of 1.8x across genuinely similar past features, produces a corrected estimate of 9 days — a number grounded in the team's actual track record rather than an optimistic mental simulation of this specific feature's smooth execution.",
        explain:
          "This example directly implements reference class forecasting: rather than relying on an individually-imagined best-case timeline, the function deliberately substitutes the team's own historical overrun ratio for genuinely comparable past work, providing the exact structural countermeasure this lesson establishes.",
        explainHi:
          "Ye example directly reference class forecasting implement karta hai: individually-imagined best-case timeline pe rely karne ke bajaye, function deliberately team ke apne historical overrun ratio ko genuinely comparable past work ke liye substitute karta hai, exact structural countermeasure provide karte hue jise ye lesson establish karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Estimating a new feature by imagining its ideal execution path,
// ignoring the team's own well-documented history of overruns
function estimateNewFeatureWrong(feature) {
  // "This feature is well-understood, requirements are clear, no
  // reason to expect delays" — the exact planning-fallacy reasoning,
  // regardless of how many past features were estimated identically
  // and still ran over
  return imagineIdealExecutionPath(feature).estimatedDays;
}`,
        right: `// Explicitly correcting the naive estimate using the team's own
// historical overrun ratio for comparable work
function estimateNewFeatureRight(feature, teamHistoricalData) {
  const naiveEstimate = imagineIdealExecutionPath(feature).estimatedDays;
  const referenceClassRatio = calculateReferenceClassEstimate(feature, teamHistoricalData).referenceClassOverrunRatio;
  return naiveEstimate * (referenceClassRatio ?? 1.5); // a documented
  // default multiplier if no reference class exists yet, rather than
  // reverting to an uncorrected optimistic estimate
}`,
        why: "Imagining a feature's ideal execution path and treating that as the estimate is exactly the planning fallacy's mechanism, regardless of how confident or well-reasoned the imagined path feels — since the bias persists even for people with direct experience of past overruns, only an explicit, numerical correction based on actual historical data reliably counters it.",
        whyHi:
          "Ek feature ka ideal execution path imagine karna aur use estimate ki tarah treat karna exactly planning fallacy ka mechanism hai, chahe imagined path kitna bhi confident ya well-reasoned feel kare — kyunki bias un logon ke liye bhi persist karta hai jinke paas past overruns ka direct experience hai, sirf actual historical data pe based ek explicit, numerical correction reliably ise counter karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production engineering organization began tracking a quarterly 'estimation accuracy ratio' across all teams after repeated postmortems revealed the same planning-fallacy pattern across dozens of unrelated projects — teams that adopted a documented reference-class multiplier for their specific type of work saw their sprint-planning accuracy improve measurably within two quarters, compared to teams that continued relying on unadjusted, intuition-based estimates.",
        hi: 'Ek production engineering organization ne quarterly \'estimation accuracy ratio\' track karna shuru kiya sab teams ke across repeated postmortems ke baad ye reveal karne pe ki wahi planning-fallacy pattern dozens of unrelated projects ke across tha — teams jinhone apne specific type of work ke liye ek documented reference-class multiplier adopt kiya unki sprint-planning accuracy measurably improve hui do quarters ke andar, un teams ke compare mein jinhone unadjusted, intuition-based estimates pe rely karna continue kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the planning fallacy, and why does personal, direct experience with past overruns fail to correct it?',
        qHi: 'Planning fallacy kya hai, aur past overruns ka personal, direct experience ise correct karne mein kyun fail hota hai?',
        a: "The planning fallacy is the tendency to estimate task duration by imagining a best-case, no-complications execution path rather than by using actual historical base rates. It persists despite direct experience with past overruns because each new task is evaluated as a fresh, individual case — the imagined best-case scenario for this specific instance feels compelling regardless of what happened with similar past instances, since the bias is a failure to apply remembered patterns to a vivid new mental simulation, not a failure to remember the patterns themselves.",
        aHi: 'Planning fallacy task duration ko ek best-case, no-complications execution path imagine karke estimate karne ki tendency hai actual historical base rates use karne ke bajaye. Ye past overruns ke direct experience ke bawajood persist karta hai kyunki har naya task ek fresh, individual case ki tarah evaluate kiya jaata hai — is specific instance ke liye imagined best-case scenario compelling feel karta hai is baat se independently ki similar past instances ke saath kya hua, kyunki bias remembered patterns ko ek vivid new mental simulation pe apply karne mein ek failure hai, patterns ko khud yaad rakhne mein ek failure nahi.',
      },
      {
        q: "What is reference class forecasting, and why is it a direct structural countermeasure to the planning fallacy?",
        qHi: 'Reference class forecasting kya hai, aur ye planning fallacy ka ek direct structural countermeasure kyun hai?',
        a: "Reference class forecasting estimates a task by using the actual historical completion times of genuinely similar past tasks (its 'reference class'), rather than by imagining this specific task's individual execution path. Since the planning fallacy specifically substitutes an imagined scenario for statistical history, reference class forecasting directly reverses this substitution by deliberately grounding the estimate in actual data.",
        aHi: 'Reference class forecasting ek task ko genuinely similar past tasks (uski \'reference class\') ke actual historical completion times use karke estimate karta hai, is specific task ke individual execution path ko imagine karne ke bajaye. Kyunki planning fallacy specifically ek imagined scenario ko statistical history ke liye substitute karta hai, reference class forecasting directly is substitution ko reverse karta hai estimate ko deliberately actual data mein ground karke.',
      },
    ],

    exercises: [
      {
        task: "A team's last six features of similar complexity were estimated at an average of 4 days each but actually took an average of 7 days each. For a new, similarly-complex feature that the team's lead confidently estimates at 3 days because 'this one is simpler than usual,' apply this lesson's reference-class-correction approach and calculate a corrected estimate, explaining why the lead's confidence in 'this one is different' should not be taken at face value.",
        taskHi: 'Ek team ki last chhe similar complexity ki features average 4 days each pe estimate ki gayi thi par actually average 7 days each lagi. Ek naye, similarly-complex feature ke liye jise team lead confidently 3 days pe estimate karta hai kyunki \'ye wala usual se simpler hai,\' is lesson ka reference-class-correction approach apply karo aur ek corrected estimate calculate karo, explain karte hue ki lead ka confidence \'ye wala different hai\' mein face value pe kyun nahi liya jaana chahiye.',
        hint: "Calculate the team's historical overrun ratio from the six past features, and consider whether 'this one feels different' is exactly the kind of individual-case reasoning the planning fallacy predicts will feel compelling regardless of the team's actual track record.",
        hintHi: 'Team ka historical overrun ratio chhe past features se calculate karo, aur consider karo ki kya \'ye wala different feel hota hai\' exactly wo kism ki individual-case reasoning hai jise planning fallacy predict karta hai team ke actual track record se independently compelling feel karegi.',
      },
    ],

    keyTakeaways: [
      "The planning fallacy is the well-documented tendency to estimate task duration by imagining a best-case execution path rather than using actual historical base rates — and it persists even for people with direct personal experience of past overruns.",
      "Reference class forecasting — estimating from genuinely comparable past tasks' actual completion times — is the direct structural countermeasure, substituting statistical history for an optimistic individual mental simulation.",
      "Tracking a team's own overrun ratio as an explicit, numerical metric is more effective than exhorting more careful estimation, since the optimistic scenario feels compelling regardless of effort applied to considering it.",
      "This lesson closes Module 5 by showing the sunk cost fallacy, confirmation bias, and the planning fallacy as instances of one general category: systematic, predictable deviations from rational, evidence-based evaluation that each require a structural, data-driven countermeasure.",
    ],
    keyTakeawaysHi: [
      'Planning fallacy task duration ko ek best-case execution path imagine karke estimate karne ki well-documented tendency hai actual historical base rates use karne ke bajaye — aur ye un logon ke liye bhi persist karta hai jinke paas past overruns ka direct personal experience hai.',
      'Reference class forecasting — genuinely comparable past tasks ke actual completion times se estimate karna — direct structural countermeasure hai, statistical history ko ek optimistic individual mental simulation ke liye substitute karte hue.',
      'Ek team ke apne overrun ratio ko ek explicit, numerical metric ki tarah track karna zyada careful estimation exhort karne se zyada effective hai, kyunki optimistic scenario compelling feel karta hai ise consider karne mein applied effort se independently.',
      'Ye lesson Module 5 ko close karta hai sunk cost fallacy, confirmation bias, aur planning fallacy ko ek general category ke instances ki tarah dikhate hue: rational, evidence-based evaluation se systematic, predictable deviations jinme se har ek ko ek structural, data-driven countermeasure chahiye.',
    ],
  },
];
