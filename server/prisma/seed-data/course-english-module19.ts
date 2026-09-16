/**
 * English Speaking Complete Course — Module 19: Debate, Persuasion &
 * Presenting, lessons 1-3. Opens Part VII (Mastery), the final part
 * before the capstone.
 *
 * Lesson 1: Structuring a persuasive argument — claim, reason,
 *           evidence, and addressing the other side.
 * Lesson 2: Presentation openings and closings — the two moments that
 *           shape how the whole talk is remembered.
 * Lesson 3: Handling disagreement and pushback live, in real time,
 *           combining Module 10's disagreement skill with the
 *           pressure of speaking to a group.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_19: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-structuring-a-persuasive-argument',
    title: 'Structuring a Persuasive Argument',
    titleHi: 'Ek Persuasive Argument Structure Karna',
    description:
      'Claim, reason, evidence — and addressing the other side before they have to bring it up themselves.',
    descriptionHi:
      'Claim, reason, evidence — aur doosri side ko address karna unke khud usse uthane se pehle.',
    difficulty: 'HARD',
    duration: 25,
    order: 1,

    analogy: {
      en: '**A persuasive argument is a table, and evidence is its legs — a claim without support is a tabletop floating in the air.** "We should adopt this tool" (the claim) needs legs underneath it — reasons and evidence — or it simply has nothing holding it up when someone leans on it with a question.',
      hi: 'Ek persuasive argument ek table hai, aur evidence uski legs hain — support ke bina ek claim ek tabletop hai jo hawa mein float kar raha hai. "We should adopt this tool" (claim) ko apne neeche legs chahiye — reasons aur evidence — nahi to jab koi ek question ke saath lean karta hai to ise kuch hold up nahi karta.',
    },

    simple: `**A reliable four-part structure for a persuasive point:**

1. **Claim**: your main point, stated clearly. "We should switch to
   the new software."
2. **Reason**: why. "Because it will save the team significant time."
3. **Evidence**: something concrete backing the reason. "In the
   trial, it cut our reporting time by 30%."
4. **Address the other side**: acknowledge a counterpoint before
   someone else raises it. "Yes, there's a learning curve, but the
   time savings make it worth it."

**Useful phrases for each part:**

- Claim: "I believe..." / "I'd argue that..."
- Reason: "This is because..." / "The main reason is..."
- Evidence: "For example..." / "In fact..." / "The data shows..."
- Addressing the other side: "Some might say..., but..." / "While
  it's true that..., ..."

**Addressing the other side FIRST, before they bring it up, makes you
look more credible, not less confident.**`,
    simpleHi: `**Ek persuasive point ke liye ek reliable four-part structure:**

1. **Claim**: tumhara main point, clearly stated. "We should switch to
   the new software."
2. **Reason**: kyun. "Because it will save the team significant time."
3. **Evidence**: kuch concrete jo reason ko back kare. "In the trial,
   it cut our reporting time by 30%."
4. **Doosri side ko address karo**: ek counterpoint acknowledge karo
   kisi aur ke raise karne se pehle. "Yes, there's a learning curve,
   but the time savings make it worth it."

**Har part ke liye useful phrases:**

- Claim: "I believe..." / "I'd argue that..."
- Reason: "This is because..." / "The main reason is..."
- Evidence: "For example..." / "In fact..." / "The data shows..."
- Doosri side address karna: "Some might say..., but..." / "While
  it's true that..., ..."

**Doosri side ko FIRST address karna, unke isse uthane se pehle,
tumhe zyada credible dikhata hai, kam confident nahi.**`,

    content: `**Why a claim alone, without reason and evidence, genuinely
persuades almost nobody.**

A bare assertion — "we should do this" — asks the listener to simply
trust you, with nothing to evaluate. Reason answers "why should I
believe that?" and evidence answers "how do I know that reason is
actually true?" Each layer removes one more reason for the listener to
doubt the claim, which is precisely why skipping straight from claim
to conclusion, without the middle layers, persuades far less
effectively even when the underlying point is genuinely correct.

**Addressing the other side proactively is a genuinely counterintuitive
but powerful move — it signals confidence, not weakness.** A listener
who is already thinking "but what about the learning curve?" while you
speak will trust you more, not less, when you raise and answer that
exact concern yourself, before they have to interrupt or silently
doubt you. Ignoring an obvious counterpoint, hoping nobody notices, is
the actual credibility risk.

**Evidence doesn't need to be a formal statistic to be effective —
concrete specificity is what matters, not formality.** "It saved us
time" is a claim restated; "it cut our reporting time from three
hours to two" is genuine evidence, specific and checkable. A single,
concrete, specific example is often more persuasive than a vague
appeal to general benefit.

**This four-part structure scales from a single sentence in
conversation up to a full presentation** — the same claim-reason-
evidence-counterpoint shape works whether you're making a quick point
in a meeting or building an entire argument across several minutes of
speaking, which is exactly why it's worth learning as a genuinely
flexible, reusable template.`,
    contentHi: `**Ek claim akela, bina reason aur evidence ke, genuinely almost kisi ko kyun persuade nahi karta.**

Ek bare assertion — "we should do this" — listener se simply trust
karne ko poochta hai, evaluate karne ke liye kuch nahi. Reason answer
karta hai "why should I believe that?" aur evidence answer karta hai
"how do I know that reason is actually true?" Har layer listener ke
liye claim ko doubt karne ka ek aur reason hataata hai, yahi exactly
reason hai ki claim se seedha conclusion tak jump karna, middle layers
ke bina, kahin kam effectively persuade karta hai even jab underlying
point genuinely correct ho.

**Doosri side ko proactively address karna ek genuinely
counterintuitive par powerful move hai — ye confidence signal karta
hai, weakness nahi.** Ek listener jo already soch raha hai "but what
about the learning curve?" jabki tum bolte ho tumpe zyada trust karega,
kam nahi, jab tum us exact concern ko khud raise aur answer karo,
unhe interrupt karne ya silently doubt karne se pehle. Ek obvious
counterpoint ko ignore karna, hope karte hue koi notice na kare, actual
credibility risk hai.

**Evidence ko effective hone ke liye ek formal statistic hone ki
zaroorat nahi — concrete specificity matter karti hai, formality
nahi.** "It saved us time" ek restated claim hai; "it cut our
reporting time from three hours to two" genuine evidence hai,
specific aur checkable. Ek single, concrete, specific example often
general benefit ke liye ek vague appeal se zyada persuasive hota hai.

**Ye four-part structure scale karti hai conversation ke ek single
sentence se leke ek poori presentation tak** — same claim-reason-
evidence-counterpoint shape kaam karti hai chahe tum ek meeting mein
ek quick point bana rahe ho ya kayi minutes ki speaking mein ek poora
argument build kar rahe ho, yahi exactly reason hai ki ye ek genuinely
flexible, reusable template ki tarah seekhne layak hai.`,

    readingPassage: `I believe we should move our team meetings to the morning. This is because people are generally more focused earlier in the day. In fact, when we tried it for two weeks last month, our meetings finished 15 minutes faster on average. Some might say mornings are too rushed, but I think a slightly earlier start is worth the extra focus we gain.`,
    readingPassageHi: `I believe humein apni team meetings ko morning mein move karna chahiye. This is because log generally din mein pehle zyada focused hote hain. In fact, jab humne ise pichhle mahine do hafte ke liye try kiya, humari meetings on average 15 minutes faster khatam hui. Some might say mornings too rushed hain, but I think thoda earlier start extra focus ke worth hai jo hum gain karte hain.`,

    vocabulary: [
      {
        word: 'claim',
        wordHi: 'claim (dava)',
        meaning: 'a statement asserting something is true, which needs support to be believed',
        meaningHi: 'ek statement jo assert karta hai kuch true hai, jise believe karne ke liye support chahiye',
        example: 'Her main claim was that the new process is more efficient.',
        exampleHi: 'Her main claim was that the new process is more efficient.',
        pronunciation: 'kleym',
      },
      {
        word: 'evidence',
        wordHi: 'evidence (pramaan)',
        meaning: 'concrete facts or information supporting a claim',
        meaningHi: 'concrete facts ya information jo ek claim ko support karti hai',
        example: 'The evidence clearly supports her argument.',
        exampleHi: 'The evidence clearly supports her argument.',
        pronunciation: 'EV-i-duhns',
      },
      {
        word: 'counterpoint',
        wordHi: 'counterpoint (virudh tark)',
        meaning: 'an opposing argument or point of view',
        meaningHi: 'ek opposing argument ya point of view',
        example: 'A good speaker addresses the counterpoint directly.',
        exampleHi: 'A good speaker addresses the counterpoint directly.',
        pronunciation: 'KOWN-ter-poynt',
      },
      {
        word: 'credible',
        wordHi: 'credible (vishwasniya)',
        meaning: 'believable, trustworthy',
        meaningHi: 'believable, trustworthy',
        example: 'Addressing counterarguments makes you more credible.',
        exampleHi: 'Addressing counterarguments makes you more credible.',
        pronunciation: 'KRED-i-buhl',
      },
    ],

    examples: [
      {
        title: 'The full four-part structure',
        titleHi: 'Poori four-part structure',
        code: `Claim: I'd argue we should offer remote work options.
Reason: This is because it genuinely improves employee satisfaction.
Evidence: In fact, our survey showed a 25% increase in satisfaction after the trial.
Counterpoint: Some might say it hurts collaboration, but our team's output actually stayed the same.`,
        output: 'A single, clear point built up in four connected steps.',
        explain:
          'Notice each part directly supports the one before it — this is the exact shape to reuse for any persuasive point, big or small.',
        explainHi:
          'Notice karo har part directly ussse pehle wale ko support karta hai — ye exact shape hai kisi bhi persuasive point ke liye reuse karne layak, bada ho ya chhota.',
      },
      {
        title: 'A claim alone vs. the full structure',
        titleHi: 'Ek claim akela vs. poori structure',
        code: `Weak: We should use this vendor.
Strong: We should use this vendor because their pricing is 15% lower, and even though onboarding takes a week, the long-term savings make it worthwhile.`,
        output: 'The same claim, dramatically more persuasive with reason, evidence, and a counterpoint addressed.',
        explain:
          'The weak version gives the listener nothing to evaluate — the strong version gives them everything they need to actually be convinced.',
        explainHi:
          'Weak version listener ko evaluate karne ke liye kuch nahi deta — strong version unhe wo sab deta hai jo unhe actually convinced hone ke liye chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: 'Stating only a claim with no reason or evidence: "We should definitely do this."',
        right: 'Add a reason and evidence: "We should do this because it will reduce costs — in fact, similar teams saved about 10% last quarter."',
        why: 'A bare claim asks the listener to simply trust you, with nothing to evaluate — reason and evidence give them something concrete to be persuaded by.',
        whyHi: 'Ek bare claim listener se simply trust karne ko poochta hai, evaluate karne ke liye kuch nahi — reason aur evidence unhe kuch concrete deta hai jisse persuade hona hai.',
      },
      {
        wrong: 'Ignoring an obvious counterpoint, hoping nobody brings it up',
        right: 'Address it proactively: "Some might say X, but..."',
        why: 'A listener who is already thinking of the counterpoint will trust you more, not less, when you raise and answer it yourself first — avoiding it is the actual credibility risk.',
        whyHi: 'Ek listener jo already counterpoint ke baare mein soch raha hai tumpe zyada trust karega, kam nahi, jab tum ise khud pehle raise aur answer karo — ise avoid karna actual credibility risk hai.',
      },
    ],

    realWorld: [
      {
        en: '**Pitching an idea, a project, or a change at work** relies directly on this exact four-part structure to move from "I think we should..." to genuinely convincing colleagues or a manager.',
        hi: '**Kaam pe ek idea, ek project, ya ek change pitch karna** directly is exact four-part structure pe rely karta hai "I think we should..." se genuinely colleagues ya ek manager ko convince karne tak jaane ke liye.',
      },
      {
        en: '**Negotiating anything** — a price, a deadline, a role — benefits enormously from stating a clear claim backed by concrete evidence, and addressing the other side\'s likely objection before they raise it.',
        hi: '**Kuch bhi negotiate karna** — ek price, ek deadline, ek role — enormously benefit hota hai ek clear claim state karne se concrete evidence ke saath backed, aur doosri side ke likely objection ko address karne se unke ise raise karne se pehle.',
      },
    ],

    interviewQA: [
      {
        q: 'What if I genuinely don\'t have strong evidence for my point?',
        qHi: 'Agar mere paas genuinely mere point ke liye strong evidence nahi hai?',
        a: 'Honest, modest evidence ("in my own experience...", "from what I\'ve observed...") is still more persuasive than none at all. Overstating weak evidence as if it were strong data can backfire — it\'s better to be honestly modest about the strength of your support than to claim more certainty than you actually have.',
        aHi: 'Honest, modest evidence ("in my own experience...", "from what I\'ve observed...") phir bhi bilkul kuch na hone se zyada persuasive hai. Weak evidence ko strong data jaisa overstate karna backfire kar sakta hai — apne support ki strength ke baare mein honestly modest hona better hai jitna certainty tumhare paas actually hai usse zyada claim karne se.',
      },
      {
        q: 'How do I choose which counterpoint to address if there are several?',
        qHi: 'Agar kayi hain to main kaunsa counterpoint address karoon?',
        a: "Address the single most obvious or strongest objection someone in your audience would likely think of — you don't need to cover every possible objection, just the one that would most undermine your credibility if left unaddressed.",
        aHi: "Sabse obvious ya strongest objection address karo jo tumhari audience mein koi likely sochega — tumhe har possible objection cover karne ki zaroorat nahi, sirf wo ek jo tumhari credibility ko sabse zyada undermine karega agar unaddressed chhoda jaaye.",
      },
    ],

    exercises: [
      {
        task: 'Out loud, build a full persuasive argument (claim, reason, evidence, counterpoint) for a real opinion you hold.',
        taskHi: 'Zor se, ek poora persuasive argument banao (claim, reason, evidence, counterpoint) ek real opinion ke liye jo tum rakhte ho.',
        hint: 'Pick something small and genuine, like a preference for a certain way of doing something at work or home.',
        hintHi: 'Kuch chhota aur genuine choose karo, jaise kaam ya ghar pe kuch karne ke ek certain tareeke ke liye ek preference.',
      },
      {
        task: 'Rewrite this weak claim out loud into a full four-part argument: "We should change our morning routine."',
        taskHi: 'Is weak claim ko zor se ek full four-part argument mein rewrite karo: "We should change our morning routine."',
        hint: 'Add why (reason), a concrete example (evidence), and address one likely objection.',
        hintHi: 'Why (reason) add karo, ek concrete example (evidence), aur ek likely objection address karo.',
      },
    ],

    keyTakeaways: [
      'A persuasive argument needs four parts: claim, reason, evidence, and addressing the other side.',
      'A bare claim with no reason or evidence gives the listener nothing to evaluate and rarely persuades.',
      'Addressing a counterpoint proactively signals confidence and credibility, not weakness.',
      'Evidence works best when it\'s concrete and specific, not just a restated, vaguer version of the claim.',
      'This four-part structure scales from a single sentence in conversation to a full presentation.',
    ],
    keyTakeawaysHi: [
      'Ek persuasive argument ko char parts chahiye: claim, reason, evidence, aur doosri side ko address karna.',
      'Ek bare claim bina reason ya evidence ke listener ko evaluate karne ke liye kuch nahi deta aur rarely persuade karta hai.',
      'Ek counterpoint ko proactively address karna confidence aur credibility signal karta hai, weakness nahi.',
      'Evidence best kaam karta hai jab ye concrete aur specific ho, sirf claim ka ek restated, vaguer version nahi.',
      'Ye four-part structure conversation ke ek single sentence se leke ek poori presentation tak scale karti hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-presentation-openings-closings',
    title: 'Presentation Openings & Closings',
    titleHi: 'Presentation Openings Aur Closings',
    description:
      'The first thirty seconds and the last thirty seconds shape how an entire presentation is remembered, disproportionate to how much content lives there.',
    descriptionHi:
      'Pehle tees seconds aur last tees seconds ek poori presentation ko kaise yaad rakha jaata hai wo shape karte hain, disproportionate to kitna content wahan rehta hai.',
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: '**An opening and closing are a book\'s cover and final page — most people decide their overall impression from disproportionately little material.** A reader can forget the middle chapters\' details but still remember exactly how a book started and ended; a presentation works the same way in an audience\'s memory.',
      hi: 'Ek opening aur closing ek book ka cover aur final page hain — zyadatar log apni overall impression disproportionately kam material se decide karte hain. Ek reader middle chapters ke details bhool sakta hai par phir bhi exactly yaad rakh sakta hai ki book kaise start hui aur end hui; ek presentation audience ki memory mein same tareeke se kaam karti hai.',
    },

    simple: `**Strong opening options:**

- **A question**: "How many of you have ever felt overwhelmed by
  email?"
- **A surprising fact**: "Our team spends 40% of its time in
  meetings."
- **A short, relevant story**: "Last month, a client told me
  something that changed how I think about this."
- **A clear roadmap**: "Today, I'll cover three things: the problem,
  our solution, and the results."

**Strong closing options:**

- **Summarize the key point**: "So, to sum up, this approach saves
  time and reduces errors."
- **A call to action**: "I'd like us to start the trial next week."
- **Return to the opening**: if you opened with a question or story,
  circle back to it at the end.

**Avoid opening with an apology or excessive hedging**: "Sorry, I'm
not great at presentations, but..." undermines the audience's
confidence in you before you've said anything substantive.

**Avoid trailing off vaguely at the end**: "So... yeah, that's
basically it, I guess." A clear, deliberate closing line leaves a far
stronger final impression than an uncertain fade-out.`,
    simpleHi: `**Strong opening options:**

- **Ek question**: "How many of you have ever felt overwhelmed by
  email?"
- **Ek surprising fact**: "Our team spends 40% of its time in
  meetings."
- **Ek short, relevant story**: "Last month, a client told me
  something that changed how I think about this."
- **Ek clear roadmap**: "Today, I'll cover three things: the problem,
  our solution, and the results."

**Strong closing options:**

- **Key point summarize karo**: "So, to sum up, this approach saves
  time and reduces errors."
- **Ek call to action**: "I'd like us to start the trial next week."
- **Opening pe wapas jaao**: agar tumne ek question ya story se open
  kiya, end mein usko circle back karo.

**Ek apology ya excessive hedging se open karne se bacho**: "Sorry,
I'm not great at presentations, but..." audience ki tumpe confidence
ko undermine karta hai kuch bhi substantive kehne se pehle.

**End mein vaguely trail off hone se bacho**: "So... yeah, that's
basically it, I guess." Ek clear, deliberate closing line ek uncertain
fade-out se kahin zyada strong final impression chhodti hai.`,

    content: `**Why the opening and closing carry disproportionate weight in how
a presentation is remembered — this is a genuine, well-documented
pattern in how attention and memory work.**

Audiences tend to pay closest attention at the very start (deciding
whether this is worth listening to) and the very end (the part that
stays freshest in memory afterward), with attention naturally dipping
somewhat in the middle. This isn't a reason to neglect the middle
content, but it does mean the opening and closing deserve
disproportionate preparation and polish relative to how much of the
actual talk they represent.

**A strong opening does two jobs at once: capturing attention and
setting expectations.** A question or surprising fact captures
attention by creating curiosity; a clear roadmap ("I'll cover three
things...") sets expectations, letting the audience mentally organize
what's coming. The best openings often do both — starting with a
hook, then briefly stating the structure.

**Apologizing or hedging at the start is a genuinely common but
costly mistake, because it actively primes the audience to doubt
you before you've said anything of substance.** "I'm not great at
this, but..." plants a seed of doubt that colors how the rest of the
presentation is received, even if the actual content that follows is
strong — the opening sets a frame the rest of the talk has to work
against.

**Circling back to the opening at the close creates a genuine sense
of completion, a structural echo the audience feels even if they
couldn't name why.** If you opened with a question, answering it
explicitly at the end ("So, going back to that question I asked at
the start...") gives the whole talk a satisfying shape, rather than
feeling like a list of points that simply stopped.`,
    contentHi: `**Opening aur closing ek presentation kaise yaad rakhi jaati hai usme disproportionate weight kyun carry karte hain — ye ek genuine, well-documented pattern hai ki attention aur memory kaise kaam karte hain.**

Audiences bilkul start mein sabse closest attention dete hain (decide
karte hue ki ye sunne layak hai ya nahi) aur bilkul end mein (wo part
jo baad mein memory mein sabse fresh rehta hai), attention naturally
middle mein somewhat dip karte hue. Ye middle content ko neglect karne
ka reason nahi hai, par iska matlab hai opening aur closing
disproportionate preparation aur polish deserve karte hain relative to
actual talk ka wo kitna represent karte hain.

**Ek strong opening ek saath do kaam karta hai: attention capture
karna aur expectations set karna.** Ek question ya surprising fact
curiosity create karke attention capture karta hai; ek clear roadmap
("I'll cover three things...") expectations set karta hai, audience ko
mentally organize karne dete hue ki kya aa raha hai. Best openings
often dono karte hain — ek hook se start karte hue, phir briefly
structure state karte hue.

**Start mein apologize karna ya hedge karna ek genuinely common par
costly mistake hai, kyunki ye actively audience ko tumpe doubt karne
ke liye prime karta hai kuch bhi substance ka kehne se pehle.** "I'm
not great at this, but..." doubt ka ek seed plant karta hai jo
color karta hai baaki presentation kaise receive hoti hai, chahe jo
content follow karta hai wo genuinely strong ho — opening ek frame set
karta hai jiske against baaki talk ko kaam karna padta hai.

**Close mein opening pe circle back karna ek genuine sense of
completion create karta hai, ek structural echo jo audience feel
karti hai chahe wo naam na de sakein kyun.** Agar tumne ek question se
open kiya, ise explicitly end mein answer karna ("So, going back to
that question I asked at the start...") poori talk ko ek satisfying
shape deta hai, ek list of points ki tarah feel karne ke bajaye jo bas
ruk gayi.`,

    readingPassage: `Let me start with a question: how many of you have felt like there just aren't enough hours in the day? Today, I'll show you three simple habits that helped me get back two hours every week. So, to sum up, small changes really do add up. And going back to that question I asked at the start — I think you'll find you have more hours than you realize.`,
    readingPassageHi: `Let me start with a question: kitne logon ne feel kiya hai ki din mein enough hours hi nahi hain? Today, I'll show you three simple habits jinhone mujhe har week do hours wapas paane mein help ki. So, to sum up, small changes really add up karti hain. And going back to that question I asked at the start — I think tumhe pata chalega tumhare paas tumhe realize hone se zyada hours hain.`,

    vocabulary: [
      {
        word: 'roadmap',
        wordHi: 'roadmap (yojana ka rooprekha)',
        meaning: 'an outline of what a talk or presentation will cover',
        meaningHi: 'ek outline ki ek talk ya presentation kya cover karegi',
        example: "Let me give you a quick roadmap of today's talk.",
        exampleHi: "Let me give you a quick roadmap of today's talk.",
        pronunciation: 'ROHD-map',
      },
      {
        word: 'hook',
        wordHi: 'hook (dhyaan kheenchne wali baat)',
        meaning: 'something at the start of a talk that captures attention',
        meaningHi: 'ek talk ki shuruaat mein kuch jo attention capture karta hai',
        example: 'Her opening story was a great hook.',
        exampleHi: 'Her opening story was a great hook.',
        pronunciation: 'hook',
      },
      {
        word: 'sum up',
        wordHi: 'sum up (sankshep mein batana)',
        meaning: 'to briefly summarize the main points',
        meaningHi: 'main points ko briefly summarize karna',
        example: 'To sum up, our plan has three main benefits.',
        exampleHi: 'To sum up, our plan has three main benefits.',
        pronunciation: 'sum up',
      },
      {
        word: 'call to action',
        wordHi: 'call to action (karyavahi ke liye ahvaan)',
        meaning: 'a specific request for the audience to do something',
        meaningHi: 'audience ke liye kuch karne ki ek specific request',
        example: 'Her call to action was to sign up by Friday.',
        exampleHi: 'Her call to action was to sign up by Friday.',
        pronunciation: 'kawl too AK-shun',
      },
    ],

    examples: [
      {
        title: 'A strong opening with a hook and a roadmap',
        titleHi: 'Ek strong opening ek hook aur ek roadmap ke saath',
        code: `Have you ever wondered why some meetings feel productive and others feel like a waste of time? Today, I'll walk you through what we learned from studying 50 team meetings, and three changes that made the biggest difference.`,
        output: 'A question hook followed immediately by a clear roadmap.',
        explain:
          'Notice the question creates curiosity, and the roadmap immediately follows to set expectations — both jobs done in just two sentences.',
        explainHi:
          'Notice karo question curiosity create karta hai, aur roadmap immediately follow karta hai expectations set karne ke liye — dono kaam sirf do sentences mein ho gaye.',
      },
      {
        title: 'A closing that circles back to the opening',
        titleHi: 'Ek closing jo opening pe circle back karta hai',
        code: `Opening: "Have you ever wondered why some meetings feel productive?"
Closing: "So, going back to that question — the meetings that felt productive all shared these three habits."`,
        output: 'The talk feels complete, with a satisfying structural echo.',
        explain:
          'This callback gives the whole presentation a sense of closure, rather than the talk simply running out of points.',
        explainHi:
          'Ye callback poori presentation ko ek sense of closure deta hai, talk ka simply points khatam ho jaane ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: '"Sorry, I\'m not really a great public speaker, but let me try..." as an opening line',
        right: 'Start directly with your hook or roadmap, skipping the apology entirely.',
        why: 'An apologetic opening actively primes the audience to doubt you before you\'ve said anything substantive — it sets a negative frame the rest of the talk has to work against.',
        whyHi: 'Ek apologetic opening actively audience ko tumpe doubt karne ke liye prime karta hai kuch bhi substantive kehne se pehle — ye ek negative frame set karta hai jiske against baaki talk ko kaam karna padta hai.',
      },
      {
        wrong: 'Trailing off vaguely at the end: "So yeah, that\'s pretty much it, I think."',
        right: '"So, to sum up, [clear restatement of the main point]." followed by a deliberate final sentence.',
        why: 'A vague, uncertain ending undermines the impression left by strong content — a clear, deliberate closing line leaves a far stronger final impression.',
        whyHi: 'Ek vague, uncertain ending strong content se banayi gayi impression ko undermine karta hai — ek clear, deliberate closing line ek kahin zyada strong final impression chhodti hai.',
      },
    ],

    realWorld: [
      {
        en: '**Any work presentation, pitch, or talk**, no matter the topic, benefits enormously from disproportionate attention to how it opens and closes, relative to how much of the actual content lives there.',
        hi: '**Kisi bhi work presentation, pitch, ya talk mein**, topic ki parwah kiye bina, disproportionate attention se enormously benefit hota hai ki ye kaise open aur close hota hai, relative to kitna actual content wahan rehta hai.',
      },
      {
        en: '**A wedding toast, an award acceptance speech, or any short public remarks** rely on the exact same principle — a strong opening and closing are remembered far more than the middle detail.',
        hi: '**Ek wedding toast, ek award acceptance speech, ya koi bhi short public remarks** exact same principle pe rely karte hain — ek strong opening aur closing middle detail se kahin zyada yaad rakhi jaati hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Is it OK to memorize my opening and closing lines word for word, even if the rest of my talk is more flexible?',
        qHi: 'Kya apni opening aur closing lines ko word for word memorize karna theek hai, chahe baaki talk zyada flexible ho?',
        a: 'Yes, this is a genuinely common, effective practice — memorizing just the first and last few sentences gives you a confident, polished start and finish, while leaving room to speak more naturally and adaptively through the middle content.',
        aHi: 'Haan, ye ek genuinely common, effective practice hai — sirf pehle aur last kuch sentences memorize karna tumhe ek confident, polished start aur finish deta hai, jabki middle content ke through zyada naturally aur adaptively bolne ke liye room chhodta hai.',
      },
      {
        q: 'What if my presentation doesn\'t naturally lend itself to a question or story opening?',
        qHi: 'Agar meri presentation naturally ek question ya story opening ke liye lend nahi karti?',
        a: 'A surprising fact or a clear, confident roadmap statement works well for more technical or data-driven presentations where a story might feel forced. The goal is capturing attention and setting expectations — there\'s more than one legitimate way to do both.',
        aHi: 'Ek surprising fact ya ek clear, confident roadmap statement achha kaam karta hai zyada technical ya data-driven presentations ke liye jahan ek story forced feel kar sakti hai. Goal attention capture karna aur expectations set karna hai — dono karne ke ek se zyada legitimate tareeke hain.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, write and say a strong opening (hook + roadmap) for a presentation about a topic you know well.',
        taskHi: 'Zor se, ek strong opening likho aur bolo (hook + roadmap) ek topic ke baare mein ek presentation ke liye jise tum achhe se jaante ho.',
        hint: 'Start with a question or surprising fact, then briefly state what you\'ll cover.',
        hintHi: 'Ek question ya surprising fact se start karo, phir briefly state karo tum kya cover karoge.',
      },
      {
        task: 'Out loud, say a closing for that same presentation that summarizes the point and circles back to your opening.',
        taskHi: 'Zor se, us same presentation ke liye ek closing bolo jo point summarize kare aur apni opening pe circle back kare.',
        hint: '"So, to sum up... And going back to [opening hook]..."',
        hintHi: '"So, to sum up... And going back to [opening hook]..."',
      },
    ],

    keyTakeaways: [
      'Audiences remember the opening and closing disproportionately, relative to how much of the actual content lives there.',
      'A strong opening does two jobs: capturing attention (a question, surprising fact, or story) and setting expectations (a roadmap).',
      'Avoid opening with an apology or excessive hedging — it primes the audience to doubt you before you\'ve said anything substantive.',
      'A strong closing summarizes the key point, often with a call to action, and avoids trailing off vaguely.',
      'Circling back to the opening at the close creates a satisfying sense of completion for the whole talk.',
    ],
    keyTakeawaysHi: [
      'Audiences opening aur closing ko disproportionately yaad rakhte hain, relative to actual content wahan kitna rehta hai.',
      'Ek strong opening do kaam karta hai: attention capture karna (ek question, surprising fact, ya story) aur expectations set karna (ek roadmap).',
      'Ek apology ya excessive hedging se open karne se bacho — ye audience ko tumpe doubt karne ke liye prime karta hai kuch bhi substantive kehne se pehle.',
      'Ek strong closing key point summarize karta hai, often ek call to action ke saath, aur vaguely trail off hone se bachta hai.',
      'Close mein opening pe circle back karna poori talk ke liye ek satisfying sense of completion create karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-handling-live-pushback',
    title: 'Handling Disagreement & Pushback, Live',
    titleHi: 'Live Disagreement Aur Pushback Handle Karna',
    description:
      'A tough question in front of a group is Module 10\'s disagreement skill under real pressure — the same tools, with less time to think.',
    descriptionHi:
      'Ek group ke saamne ek tough question Module 10 ke disagreement skill ka real pressure ke neeche version hai — same tools, sochne ka kam time.',
    difficulty: 'HARD',
    duration: 25,
    order: 3,

    analogy: {
      en: '**Handling live pushback is catching a ball someone throws hard and fast, rather than one gently tossed — the technique is identical, only the speed changes what you need ready in advance.** Module 10\'s disagreement skills are the technique; this lesson is about having them ready fast enough for a live moment.',
      hi: 'Live pushback handle karna ek ball catch karna hai jo koi hard aur fast throw karta hai, ek gently tossed ke bajaye — technique identical hai, sirf speed change karti hai ki tumhe advance mein kya ready chahiye. Module 10 ke disagreement skills technique hain; ye lesson unhe ek live moment ke liye kaafi fast ready rakhne ke baare mein hai.',
    },

    simple: `**A reliable pattern for handling a tough question or pushback
live:**

1. **Pause briefly** — a short pause is fine and shows you're
   thinking, not stalling.
2. **Acknowledge the question**: "That's a fair point." / "Good
   question."
3. **Respond using Module 10's disagree-with-the-idea skill, if
   needed**: "I see it a bit differently, and here's why..."
4. **Stay calm and factual**, even if the question feels
   challenging or aggressive.

**If you genuinely don't know the answer, say so directly and offer a
next step:**

"That's a great question — I don't have that number in front of me,
but I'll find out and follow up."

**Never guess or make something up to avoid admitting you don't
know** — a wrong answer discovered later damages credibility far more
than an honest "I don't know, but I'll find out."

**A brief pause before answering is a sign of thoughtfulness, not
weakness** — resist the urge to fill every silence immediately.`,
    simpleHi: `**Ek tough question ya pushback ko live handle karne ka ek
reliable pattern:**

1. **Briefly pause karo** — ek short pause fine hai aur dikhata hai
   tum soch rahe ho, stall nahi kar rahe.
2. **Question ko acknowledge karo**: "That's a fair point." / "Good
   question."
3. **Module 10 ke disagree-with-the-idea skill use karke respond
   karo, agar zaroorat ho**: "I see it a bit differently, and here's
   why..."
4. **Calm aur factual raho**, chahe question challenging ya
   aggressive feel ho.

**Agar tumhe genuinely answer nahi pata, directly kaho aur ek next
step offer karo:**

"That's a great question — I don't have that number in front of me,
but I'll find out and follow up."

**Kabhi guess mat karo ya kuch banao ye admit karne se bachne ke liye
ki tumhe nahi pata** — ek galat answer jo baad mein discover hota hai
credibility ko kahin zyada damage karta hai ek honest "I don't know,
but I'll find out" se.

**Answer karne se pehle ek brief pause thoughtfulness ka sign hai,
weakness ka nahi** — har silence ko immediately bharne ki urge resist
karo.`,

    content: `**Why live pushback genuinely just requires Module 10's skills, made
fast enough for real time — there's no separate new technique needed
here.**

Module 10 already covered acknowledging a view before disagreeing,
and disagreeing with the idea rather than the person. Live pushback
in front of a group adds only one new variable: speed and social
pressure. The underlying tools are identical — this lesson is about
having them ready quickly enough to use under the pressure of an
audience watching, not about learning a fundamentally different skill.

**A brief pause before responding is genuinely, measurably more
effective than rushing to fill silence.** Rushing an answer under
pressure often produces a worse, less considered response, while a
short pause signals composure and thoughtfulness to the audience — the
pause itself is doing real communicative work, not just buying time.

**Admitting "I don't know" is a genuinely strong, credibility-
building move, not a weak one, as long as it's paired with a concrete
next step.** A guessed or fabricated answer that turns out wrong later
does far more damage to your credibility than an honest admission —
"I don't know, but I'll find out and follow up" demonstrates
integrity and reliability, both of which matter more in the long run
than appearing to have every answer immediately.

**Staying calm when a question feels aggressive or challenging is a
genuine skill worth practicing deliberately, since the natural
instinct under social pressure is often to become defensive.** A calm,
factual response — even to a pointed or hostile-feeling question —
tends to de-escalate the interaction and makes you look more credible
to the rest of the audience than a defensive or flustered reaction
would.`,
    contentHi: `**Live pushback genuinely Module 10 ke skills ko kyun require karta hai, real time ke liye kaafi fast banaya gaya — yahan koi separate naya technique ki zaroorat nahi.**

Module 10 already ek view ko disagree karne se pehle acknowledge karna
cover kar chuka hai, aur idea se disagree karna, person se nahi. Ek
group ke saamne live pushback sirf ek naya variable add karta hai:
speed aur social pressure. Underlying tools identical hain — ye lesson
unhe kaafi jaldi ready rakhne ke baare mein hai use karne ke liye ek
audience watching ke pressure ke neeche, ek fundamentally different
skill seekhne ke baare mein nahi.

**Respond karne se pehle ek brief pause genuinely, measurably zyada
effective hai silence bharne ke liye rush karne se.** Pressure ke
neeche ek answer ko rush karna often ek worse, less considered
response produce karta hai, jabki ek short pause audience ko composure
aur thoughtfulness signal karta hai — pause khud real communicative
kaam kar raha hai, sirf time buy karne ke liye nahi.

**"I don't know" admit karna ek genuinely strong, credibility-
building move hai, weak nahi, jab tak ye ek concrete next step ke
saath paired ho.** Ek guessed ya fabricated answer jo baad mein galat
nikalta hai tumhari credibility ko kahin zyada damage karta hai ek
honest admission se — "I don't know, but I'll find out and follow up"
integrity aur reliability demonstrate karta hai, dono jo long run mein
zyada matter karte hain immediately har answer hone ke dikhne se.

**Jab ek question aggressive ya challenging feel karta hai calm rehna
ek genuine skill hai deliberately practice karne layak, kyunki social
pressure ke neeche natural instinct often defensive banna hota hai.**
Ek calm, factual response — even ek pointed ya hostile-feeling
question ke liye — interaction ko de-escalate karta hai aur tumhe
baaki audience ko zyada credible dikhata hai ek defensive ya flustered
reaction se.`,

    readingPassage: `During the Q&A, someone challenged my proposal directly. I paused for a moment, then said, "That's a fair point, and I understand the concern." I explained that I saw it a bit differently, and gave my reasoning calmly. When someone asked a number I didn't have, I said, "Great question — I don't have that exact figure, but I'll follow up with it." The audience seemed satisfied with my honesty.`,
    readingPassageHi: `Q&A ke dauran, kisi ne mere proposal ko directly challenge kiya. Main ek moment ke liye paused, phir kaha, "That's a fair point, and I understand the concern." Maine explain kiya ki main isse thoda differently dekhta hoon, aur apna reasoning calmly diya. Jab kisi ne ek number poocha jo mere paas nahi tha, maine kaha, "Great question — I don't have that exact figure, but I'll follow up with it." Audience meri honesty se satisfied lagi.`,

    vocabulary: [
      {
        word: 'pushback',
        wordHi: 'pushback (virodh)',
        meaning: 'resistance or disagreement expressed against a point or plan',
        meaningHi: 'ek point ya plan ke against express ki gayi resistance ya disagreement',
        example: 'She handled the pushback calmly.',
        exampleHi: 'She handled the pushback calmly.',
        pronunciation: 'POOSH-bak',
      },
      {
        word: 'composure',
        wordHi: 'composure (sanyam)',
        meaning: 'staying calm and controlled, especially under pressure',
        meaningHi: 'calm aur controlled rehna, especially pressure ke neeche',
        example: 'He kept his composure during the tough questions.',
        exampleHi: 'He kept his composure during the tough questions.',
        pronunciation: 'kuhm-POH-zher',
      },
      {
        word: 'de-escalate',
        wordHi: 'de-escalate (tanav kam karna)',
        meaning: 'to reduce the intensity or tension of a situation',
        meaningHi: 'ek situation ki intensity ya tension ko kam karna',
        example: 'A calm response can de-escalate a tense moment.',
        exampleHi: 'A calm response can de-escalate a tense moment.',
        pronunciation: 'dee-ES-kuh-leyt',
      },
      {
        word: 'follow up',
        wordHi: 'follow up (aage jaankari dena)',
        meaning: 'to provide additional information after the fact',
        meaningHi: 'baad mein additional information provide karna',
        example: "I'll follow up with the exact numbers by email.",
        exampleHi: "I'll follow up with the exact numbers by email.",
        pronunciation: 'FOL-oh up',
      },
    ],

    examples: [
      {
        title: 'Handling a challenging question calmly',
        titleHi: 'Ek challenging question ko calmly handle karna',
        code: `Audience member: I don't think this plan accounts for the budget constraints.
Speaker: That's a fair point. I see it a bit differently — we did build in a 10% buffer specifically for that. Happy to share the detailed breakdown afterward.`,
        output: 'Acknowledgment, a calm disagreement with reasoning, and an offer to follow up.',
        explain:
          'Notice this reuses Module 10\'s exact pattern (acknowledge, then disagree with the idea, with a reason) — the only new element is doing it live, in front of a group.',
        explainHi:
          'Notice karo ye Module 10 ke exact pattern ko reuse karta hai (acknowledge karo, phir idea se disagree karo, ek reason ke saath) — sirf naya element ise live karna hai, ek group ke saamne.',
      },
      {
        title: 'Honestly admitting you don\'t know',
        titleHi: 'Honestly admit karna ki tumhe nahi pata',
        code: `Audience member: What's the exact cost savings over five years?
Speaker: Great question — I don't have that exact figure in front of me right now, but I'll calculate it and send it to everyone by tomorrow.`,
        output: 'A confident, credible admission paired with a concrete next step.',
        explain:
          'This response builds trust rather than damaging it — the speaker is honest about the limit of what they know right now, while still being helpful and responsive.',
        explainHi:
          'Ye response trust build karta hai, damage nahi karta — speaker honest hai us limit ke baare mein jo unhe abhi pata hai, phir bhi helpful aur responsive rehte hue.',
      },
    ],

    mistakes: [
      {
        wrong: 'Guessing or making up a number or fact to avoid admitting you don\'t know, in front of a group',
        right: '"I don\'t have that exact figure right now, but I\'ll find out and follow up."',
        why: 'A fabricated answer that turns out wrong later damages credibility far more than an honest admission paired with a concrete next step.',
        whyHi: 'Ek fabricated answer jo baad mein galat nikalta hai credibility ko kahin zyada damage karta hai ek honest admission se jo ek concrete next step ke saath paired ho.',
      },
      {
        wrong: 'Becoming visibly defensive or flustered in response to a pointed or challenging question',
        right: 'Pause briefly, acknowledge the point, and respond calmly and factually.',
        why: 'A defensive reaction tends to escalate tension and can make you look less credible to the rest of the audience, even if your underlying point is correct.',
        whyHi: 'Ek defensive reaction tension ko escalate karta hai aur tumhe baaki audience ko less credible dikha sakta hai, chahe tumhara underlying point correct ho.',
      },
    ],

    realWorld: [
      {
        en: '**Q&A sessions after any presentation, pitch, or public talk** are exactly where this skill gets tested — a well-handled tough question can genuinely strengthen the overall impression of the whole talk.',
        hi: '**Kisi bhi presentation, pitch, ya public talk ke baad Q&A sessions** exactly wahan hain jahan ye skill test hoti hai — ek well-handled tough question genuinely poori talk ki overall impression ko strengthen kar sakta hai.',
      },
      {
        en: '**Defending a decision or a piece of work in a meeting**, when a colleague or manager pushes back, relies on the exact same calm, structured response this lesson builds.',
        hi: '**Ek meeting mein ek decision ya kaam ke ek piece ko defend karna**, jab ek colleague ya manager pushback karta hai, exactly same calm, structured response pe rely karta hai jo ye lesson build karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How long should I pause before answering a tough question without it feeling awkward?',
        qHi: 'Mujhe ek tough question ka answer dene se pehle kitni der pause karna chahiye bina awkward feel kiye?',
        a: "A pause of one or two seconds — enough to genuinely gather your thoughts — reads as thoughtful, not awkward. It only starts to feel uncomfortable if it stretches much longer than that with no verbal or visual signal that you're thinking, like a brief \"let me think about that for a second.\"",
        aHi: "Ek ya do seconds ka pause — genuinely apne thoughts gather karne ke liye kaafi — thoughtful padhta hai, awkward nahi. Ye tab hi uncomfortable feel karna start karta hai jab ye usse zyada lamba stretch ho bina kisi verbal ya visual signal ke ki tum soch rahe ho, jaise ek brief \"let me think about that for a second.\"",
      },
      {
        q: 'What if the question feels genuinely hostile or unfair, not just challenging?',
        qHi: 'Agar question genuinely hostile ya unfair feel karta hai, sirf challenging nahi?',
        a: 'Staying calm and factual is still the strongest response — responding to hostility with hostility rarely helps your credibility with the rest of the audience. A composed, respectful answer, even to an unfair question, tends to reflect well on you specifically because of the contrast.',
        aHi: 'Calm aur factual rehna phir bhi strongest response hai — hostility ko hostility se respond karna rarely baaki audience ke saath tumhari credibility mein help karta hai. Ek composed, respectful answer, even ek unfair question ke liye, specifically contrast ki wajah se tumpe achha reflect karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, imagine someone pushing back on a real opinion of yours in front of a group, and respond using the acknowledge-then-disagree pattern.',
        taskHi: 'Zor se, imagine karo koi tumhare ek real opinion pe ek group ke saamne pushback kar raha hai, aur acknowledge-then-disagree pattern use karke respond karo.',
        hint: '"That\'s a fair point. I see it a bit differently, and here\'s why..."',
        hintHi: '"That\'s a fair point. I see it a bit differently, and here\'s why..."',
      },
      {
        task: 'Out loud, practice admitting you don\'t know something, paired with a concrete next step, as if answering a question in front of a group.',
        taskHi: 'Zor se, practice karo admit karna ki tumhe kuch nahi pata, ek concrete next step ke saath paired, jaise ek group ke saamne ek question answer kar rahe ho.',
        hint: '"That\'s a great question — I don\'t have that right now, but I\'ll find out and get back to you."',
        hintHi: '"That\'s a great question — I don\'t have that right now, but I\'ll find out and get back to you."',
      },
    ],

    keyTakeaways: [
      'Handling live pushback reuses Module 10\'s disagreement skills — acknowledge, then disagree with the idea, with a reason — under time pressure.',
      'A brief pause before answering signals thoughtfulness, not weakness — resist the urge to fill silence immediately.',
      'Admitting "I don\'t know," paired with a concrete next step, builds credibility far more than a guessed or fabricated answer.',
      'Staying calm and factual, even with a challenging or hostile-feeling question, tends to de-escalate tension and preserve credibility.',
      'This lesson adds no new technique — it\'s Module 10\'s skills made fast and steady enough for real, live pressure.',
    ],
    keyTakeawaysHi: [
      'Live pushback handle karna Module 10 ke disagreement skills ko reuse karta hai — acknowledge karo, phir idea se disagree karo, ek reason ke saath — time pressure ke neeche.',
      'Answer karne se pehle ek brief pause thoughtfulness signal karta hai, weakness nahi — silence ko immediately bharne ki urge resist karo.',
      '"I don\'t know" admit karna, ek concrete next step ke saath paired, credibility ko ek guessed ya fabricated answer se kahin zyada build karta hai.',
      'Calm aur factual rehna, even ek challenging ya hostile-feeling question ke saath, tension ko de-escalate karta hai aur credibility preserve karta hai.',
      'Ye lesson koi naya technique add nahi karta — ye Module 10 ke skills hain jo real, live pressure ke liye kaafi fast aur steady banaye gaye.',
    ],
  },
];
