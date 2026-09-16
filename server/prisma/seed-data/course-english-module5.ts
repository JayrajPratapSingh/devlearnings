/**
 * English Speaking Complete Course — Module 5: Talking About the
 * Future, lessons 1-3.
 *
 * Lesson 1: "going to" for plans and intentions already decided.
 * Lesson 2: "will" for predictions, offers, and in-the-moment
 *           decisions — genuinely different territory from "going to",
 *           not an interchangeable synonym.
 * Lesson 3: Present continuous used for a fixed future arrangement
 *           ("I'm meeting her tomorrow") — a third, real way to talk
 *           about the future that surprises many learners.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_5: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-going-to-future-plans',
    title: '"Going To" — Plans You\'ve Already Decided',
    titleHi: '"Going To" — Wo Plans Jo Tum Already Decide Kar Chuke Ho',
    description:
      '"I am going to visit my parents this weekend" — a decision already made before the moment of speaking, not a prediction or a spontaneous offer.',
    descriptionHi:
      '"I am going to visit my parents this weekend" — ek decision jo bolte waqt se pehle already li ja chuki hai, ek prediction ya spontaneous offer nahi.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**"Going to" is a ticket already bought in your pocket, not a wish.** Saying "I\'m going to visit my parents this weekend" means the decision already happened — like a train ticket sitting in your pocket right now, before the train even leaves.',
      hi: '"Going to" ek ticket hai jo already tumhari pocket mein khareeda hua hai, koi wish nahi. "I\'m going to visit my parents this weekend" kehne ka matlab hai decision already ho chuki hai — jaise ek train ticket abhi tumhari pocket mein hai, train ke chalne se bhi pehle.',
    },

    simple: `**"Going to" + base verb talks about a plan you've already decided
on:**

"I am going to visit my parents this weekend." (already decided,
before this moment)

**The structure:**

am/is/are + going to + base verb

- I **am going to** call him later.
- She **is going to** start a new job next month.
- We **are going to** travel to Goa in December.

**A quick test**: if someone asks "have you decided?" and the answer
is genuinely "yes, already," "going to" is the right choice. If the
answer is "no, I'm deciding right now," a different future form fits
better (covered in the next lesson).

**Negative and question forms follow the normal be-verb pattern:**

"I am not going to attend the party." · "Are you going to come with
us?"`,
    simpleHi: `**"Going to" + base verb ek plan ke baare mein baat karta hai jo tumne already decide kar liya hai:**

"I am going to visit my parents this weekend." (already decided, is
moment se pehle)

**Structure:**

am/is/are + going to + base verb

- I **am going to** call him later.
- She **is going to** start a new job next month.
- We **are going to** travel to Goa in December.

**Ek quick test**: agar koi poochta hai "have you decided?" aur answer
genuinely hai "yes, already," "going to" sahi choice hai. Agar answer
hai "no, I'm deciding right now," ek different future form better fit
karta hai (next lesson mein cover hoga).

**Negative aur question forms normal be-verb pattern follow karte
hain:**

"I am not going to attend the party." · "Are you going to come with
us?"`,

    content: `**Why "going to" is specifically for pre-made decisions.**

"Going to" literally comes from physically moving toward something —
"I am going to [do something]" originally meant heading somewhere with
that purpose. That physical origin still shapes the meaning today: you
use "going to" when the plan already exists in your mind before you
say the sentence, exactly like already being physically on the way
somewhere. This is genuinely different from a prediction you're making
up in the moment or an offer you're deciding on as you speak — both of
which use a different future form covered in the next lesson.

**Evidence in the world often accompanies "going to" naturally.**
"Look at those clouds — it's going to rain" uses "going to" because
there's visible evidence right now supporting the prediction, not just
a guess pulled from nowhere. This is a genuinely useful, separate use
of "going to" beyond personal plans: a confident prediction based on
present evidence.

**"Going to" plans can still change — that's normal, not a
contradiction.** Saying "I'm going to visit my parents this weekend"
and then not going doesn't mean you lied; plans change. "Going to"
describes your intention at the time of speaking, not an unbreakable
promise.

**Time expressions pair naturally with "going to": "this weekend,"
"next month," "later today," "tomorrow."** These words signal a
specific point when the already-decided plan will happen, and using
one alongside "going to" makes the sentence feel complete and
concrete rather than vague.`,
    contentHi: `**"Going to" specifically pre-made decisions ke liye kyun hai.**

"Going to" literally physically kisi cheez ki taraf move karne se aata
hai — "I am going to [do something]" originally us purpose ke saath
kahin heading karna matlab tha. Wo physical origin aaj bhi meaning ko
shape karta hai: tum "going to" tab use karte ho jab plan tumhare mind
mein already exist karta hai sentence bolne se pehle, exactly jaise
already physically kahin jaane ke raste pe hona. Ye genuinely different
hai ek prediction se jo tum moment mein bana rahe ho ya ek offer se jo
tum bolte waqt decide kar rahe ho — dono ek different future form use
karte hain jo next lesson mein cover hoga.

**World mein evidence often "going to" ke saath naturally aata hai.**
"Look at those clouds — it's going to rain" "going to" use karta hai
kyunki abhi visible evidence hai jo prediction ko support karta hai,
sirf kahin se ek guess nahi. Ye personal plans se aage "going to" ka ek
genuinely useful, separate use hai: present evidence pe based ek
confident prediction.

**"Going to" plans phir bhi change ho sakte hain — ye normal hai, ek
contradiction nahi.** "I'm going to visit my parents this weekend"
kehna aur phir na jaana matlab nahi ki tumne lie bola; plans change hote
hain. "Going to" bolte waqt tumhara intention describe karta hai, ek
unbreakable promise nahi.

**Time expressions naturally "going to" ke saath pair hote hain: "this
weekend," "next month," "later today," "tomorrow."** Ye words signal
karte hain ek specific point jab already-decided plan hoga, aur ek use
karna "going to" ke saath sentence ko complete aur concrete feel karata
hai, vague nahi.`,

    readingPassage: `I have some plans for this weekend. I am going to visit my parents on Saturday. We are going to cook a big meal together. On Sunday, I am going to relax and watch a movie. I already decided all of this last week, so I am really looking forward to it.`,
    readingPassageHi: `Mere paas is weekend ke liye kuch plans hain. I am going to visit my parents Saturday ko. We are going to cook a big meal together. Sunday ko, I am going to relax and watch a movie. Maine ye sab pichhle hafte hi decide kar liya tha, so main genuinely isse wait kar raha hoon.`,

    vocabulary: [
      {
        word: 'plan',
        wordHi: 'plan (yojana)',
        meaning: 'a decision about what you will do in the future',
        meaningHi: 'ek decision ki tum future mein kya karoge',
        example: "I have a plan for the weekend.",
        exampleHi: "I have a plan for the weekend.",
        pronunciation: 'plan',
      },
      {
        word: 'already',
        wordHi: 'already (pehle se)',
        meaning: 'before now; before this moment',
        meaningHi: 'ab se pehle; is moment se pehle',
        example: 'I already decided what to do this weekend.',
        exampleHi: 'I already decided what to do this weekend.',
        pronunciation: 'awl-RED-ee',
      },
      {
        word: 'look forward to',
        wordHi: 'look forward to (bekarni se intezaar karna)',
        meaning: 'to feel happy and excited about something that will happen',
        meaningHi: 'kisi cheez ke baare mein happy aur excited feel karna jo hone wali hai',
        example: "I'm looking forward to the trip.",
        exampleHi: "I'm looking forward to the trip.",
        pronunciation: 'look FOR-werd too',
      },
      {
        word: 'intention',
        wordHi: 'intention (irada)',
        meaning: 'what you plan or mean to do',
        meaningHi: 'jo tum plan ya karne ka soch rahe ho',
        example: 'My intention is to finish this by Friday.',
        exampleHi: 'My intention is to finish this by Friday.',
        pronunciation: 'in-TEN-shun',
      },
    ],

    examples: [
      {
        title: 'A weekend plan already decided',
        titleHi: 'Ek weekend plan already decided',
        code: `A: What are you going to do this weekend?
B: I'm going to visit my grandmother. We already planned it last week.
A: That sounds nice!`,
        output: '"going to" signals a decision made before the conversation.',
        explain:
          'The phrase "already planned it last week" confirms exactly why "going to" is the right choice here — the decision genuinely predates this conversation.',
        explainHi:
          'Phrase "already planned it last week" exactly confirm karta hai ki yahan "going to" sahi choice kyun hai — decision genuinely is conversation se predate karta hai.',
      },
      {
        title: 'A confident prediction based on visible evidence',
        titleHi: 'Visible evidence pe based ek confident prediction',
        code: `Look at those dark clouds — it's going to rain soon. We should go inside.`,
        output: '"going to" used for a prediction grounded in present evidence.',
        explain:
          'This isn\'t a personal plan at all — it\'s a prediction, but "going to" still fits because there\'s clear, visible evidence (dark clouds) supporting it right now.',
        explainHi:
          'Ye bilkul ek personal plan nahi hai — ye ek prediction hai, par "going to" phir bhi fit karta hai kyunki abhi clear, visible evidence hai (dark clouds) jo isse support karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Using "going to" for a decision made right at the moment of speaking, like offering to help someone who just dropped something',
        right: '"I\'ll help you!" (using "will" — covered in the next lesson)',
        why: '"Going to" specifically signals a plan that existed before this moment. A decision made spontaneously, right now, in reaction to something, uses a different future form ("will"), not "going to".',
        whyHi: '"Going to" specifically ek plan signal karta hai jo is moment se pehle exist karta tha. Ek decision jo spontaneously, abhi, kisi cheez ke reaction mein li gayi, ek different future form use karta hai ("will"), "going to" nahi.',
      },
      {
        wrong: '"I going to visit my parents." (missing "am")',
        right: '"I am going to visit my parents." / "I\'m going to visit my parents."',
        why: '"Going to" always needs its helping be-verb (am/is/are) in front of it — dropping it is a common slip when the sentence is said quickly.',
        whyHi: '"Going to" ko hamesha apne aage apna helping be-verb chahiye (am/is/are) — jaldi bolte waqt ise drop karna ek common slip hai.',
      },
    ],

    realWorld: [
      {
        en: '**Making weekend or holiday plans with friends and family** — "What are you going to do this weekend?" is one of the most common casual questions in everyday English, and answering it well is a genuinely frequent need.',
        hi: '**Friends aur family ke saath weekend ya holiday plans banana** — "What are you going to do this weekend?" everyday English mein sabse common casual questions mein se ek hai, aur ise achhe se answer karna genuinely ek frequent need hai.',
      },
      {
        en: '**Describing your career or life plans in an interview** ("I am going to complete this certification next month") signals a decision already in motion, which reads as more concrete and credible than a vague hope.',
        hi: '**Ek interview mein apne career ya life plans describe karna** ("I am going to complete this certification next month") ek decision signal karta hai jo already motion mein hai, jo ek vague hope se zyada concrete aur credible padhta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What\'s the real difference between "going to" and "will" for the future?',
        qHi: '"Going to" aur "will" future ke liye mein real farak kya hai?',
        a: '"Going to" is for a decision already made before this moment, often with visible plans or evidence behind it. "Will" is for a decision made right now, in the moment of speaking, or a general prediction without specific evidence. The next lesson covers "will" in full detail.',
        aHi: '"Going to" ek decision ke liye hai jo is moment se pehle already li gayi hai, often visible plans ya evidence ke saath. "Will" ek decision ke liye hai jo abhi, bolte waqt li gayi hai, ya ek general prediction bina specific evidence ke. Next lesson "will" ko full detail mein cover karta hai.',
      },
      {
        q: 'Can "going to" be used for something that already has clear evidence, not just a personal decision?',
        qHi: 'Kya "going to" kisi aisi cheez ke liye use ho sakta hai jiske paas already clear evidence hai, sirf personal decision nahi?',
        a: 'Yes — this is genuinely one of "going to"\'s two main uses. "She\'s going to have a baby" (visible fact) and "It\'s going to rain" (visible clouds) both use "going to" for confident predictions grounded in present evidence, separate from personal plans.',
        aHi: 'Haan — ye genuinely "going to" ke do main uses mein se ek hai. "She\'s going to have a baby" (visible fact) aur "It\'s going to rain" (visible clouds) dono "going to" use karte hain confident predictions ke liye jo present evidence mein grounded hain, personal plans se separate.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, say three things you are genuinely going to do this week, using "I am going to..." for each.',
        taskHi: 'Zor se, teen cheezein bolo jo tum is hafte genuinely karne wale ho, "I am going to..." use karke har ek ke liye.',
        hint: 'Pick real plans, even small ones: "I am going to call my friend on Saturday."',
        hintHi: 'Real plans choose karo, chhote bhi: "I am going to call my friend on Saturday."',
      },
      {
        task: 'Look outside or think about the current weather, and make a "going to" prediction based on what you see.',
        taskHi: 'Bahar dekho ya current weather ke baare mein socho, aur jo dekho uske base pe ek "going to" prediction banao.',
        hint: '"Look at the sky — it\'s going to be a hot day." / "Those clouds mean it\'s going to rain."',
        hintHi: '"Look at the sky — it\'s going to be a hot day." / "Those clouds mean it\'s going to rain."',
      },
    ],

    keyTakeaways: [
      '"Going to" + base verb describes a plan already decided before the moment of speaking.',
      'Structure: am/is/are + going to + base verb — the be-verb is never dropped.',
      '"Going to" also covers confident predictions based on visible present evidence ("It\'s going to rain").',
      'A "going to" plan can still change later — it describes intention at the time of speaking, not an unbreakable promise.',
      'A spontaneous, in-the-moment decision (like offering help) uses a different future form, "will," not "going to."',
    ],
    keyTakeawaysHi: [
      '"Going to" + base verb ek plan describe karta hai jo bolte waqt se pehle already decide ho chuka hai.',
      'Structure: am/is/are + going to + base verb — be-verb kabhi drop nahi hota.',
      '"Going to" confident predictions bhi cover karta hai jo visible present evidence pe based hain ("It\'s going to rain").',
      'Ek "going to" plan baad mein bhi change ho sakta hai — ye bolte waqt intention describe karta hai, ek unbreakable promise nahi.',
      'Ek spontaneous, in-the-moment decision (jaise help offer karna) ek different future form use karta hai, "will," "going to" nahi.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-will-predictions-offers-decisions',
    title: '"Will" — Predictions, Offers & In-the-Moment Decisions',
    titleHi: '"Will" — Predictions, Offers Aur In-the-Moment Decisions',
    description:
      '"I think it will rain tomorrow," "I\'ll help you," "I\'ll have the pasta" — three genuinely different jobs "will" does, none of them a pre-made plan.',
    descriptionHi:
      '"I think it will rain tomorrow," "I\'ll help you," "I\'ll have the pasta" — teen genuinely different kaam jo "will" karta hai, koi bhi ek pre-made plan nahi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**"Will" is a decision made at the exact moment your hand moves, not one made back at home.** Ordering food when the waiter arrives ("I\'ll have the pasta") is a decision made right there, at the table — completely different from a plan you packed a bag for this morning.',
      hi: '"Will" ek decision hai jo exactly us moment li jaati hai jab tumhara haath move karta hai, ghar pe pehle se li hui nahi. Waiter aane pe khana order karna ("I\'ll have the pasta") wahin, table pe liya gaya decision hai — completely different ek plan se jiske liye tumne aaj subah bag pack kiya tha.',
    },

    simple: `**"Will" + base verb has three main, genuinely different jobs:**

1. **A general prediction, without specific present evidence**: "I
   think it will rain tomorrow." (a guess about the future, not based
   on visible clouds right now)
2. **A decision made right at the moment of speaking**: "The phone is
   ringing — I'll get it!" (you decide as it happens, not before)
3. **An offer or a promise**: "I'll help you carry that." · "I'll call
   you later, I promise."

**The structure is simple — "will" never changes form:**

I will · you will · he/she/it will · we will · they will

(Often shortened to "I'll," "you'll," "she'll," "we'll," "they'll" in
speech.)

**Contrast directly with "going to":**

"I'm going to watch a movie tonight" (already decided) vs. "I'll
watch whatever you want" (deciding right now, in response to you).`,
    simpleHi: `**"Will" + base verb ke teen main, genuinely different kaam hain:**

1. **Ek general prediction, bina specific present evidence ke**: "I
   think it will rain tomorrow." (future ke baare mein ek guess, abhi
   visible clouds pe based nahi)
2. **Ek decision jo bolte waqt exactly us moment li jaati hai**: "The
   phone is ringing — I'll get it!" (tum decide karte ho jab ye ho
   raha hai, pehle nahi)
3. **Ek offer ya promise**: "I'll help you carry that." · "I'll call
   you later, I promise."

**Structure simple hai — "will" kabhi form change nahi karta:**

I will · you will · he/she/it will · we will · they will

(Often speech mein "I'll," "you'll," "she'll," "we'll," "they'll" mein
shorten hota hai.)

**Directly "going to" ke saath contrast karo:**

"I'm going to watch a movie tonight" (already decided) vs. "I'll watch
whatever you want" (abhi, tumhare response mein decide kar raha hoon).`,

    content: `**Why "will" and "going to" genuinely aren't interchangeable, despite
both being "future tense" in a loose sense.**

The real difference isn't grammatical complexity — it's timing of the
decision. "Going to" always looks backward to a decision already made;
"will" always looks at the exact moment of speaking, either for a
fresh decision, a general prediction, or a promise made right then. A
learner who treats them as simple synonyms will occasionally produce
a sentence that\'s grammatically fine but pragmatically strange — like
using "going to" to offer spontaneous help, which sounds like you
somehow planned to help before the problem even happened.

**The "in-the-moment decision" use is the one most often missed.**
"The phone is ringing — I'll get it" captures a decision made in
literally the same second as the situation appears. This is genuinely
common in everyday English: reacting to something just noticed,
offering to help right as you see someone struggling, agreeing to
something just proposed. None of these existed as plans five minutes
earlier.

**Predictions with "will" don't need evidence the way "going to"
predictions often do.** "I think she'll do well in the exam" is a
belief or opinion about the future, not based on something visible
right now — contrast this with "look at those clouds, it's going to
rain," which is grounded in present evidence. Both are valid
predictions; they just come from different sources.

**"I promise I will..." is one of the strongest, most sincere-sounding
commitments in English**, precisely because "will" at the moment of
speaking carries real weight — it signals you're committing right now,
not just describing a plan you already had.`,
    contentHi: `**"Will" aur "going to" genuinely interchangeable kyun nahi hain,
dono ek loose sense mein "future tense" hone ke bawajood.**

Real difference grammatical complexity nahi hai — ye decision ki
timing hai. "Going to" hamesha ek already li hui decision ki taraf
peeche dekhta hai; "will" hamesha bolte waqt ke exact moment ki taraf
dekhta hai, ya to ek fresh decision, ek general prediction, ya ek
promise jo usi waqt li gayi ho. Ek learner jo inhe simple synonyms ki
tarah treat karta hai occasionally ek sentence produce karega jo
grammatically fine hai par pragmatically strange — jaise "going to" use
karna spontaneous help offer karne ke liye, jo aisa sound karta hai
jaise tumne somehow help karne ka plan kiya problem hone se bhi pehle.

**"In-the-moment decision" use wo hai jo sabse zyada miss hoti hai.**
"The phone is ringing — I'll get it" ek decision capture karta hai jo
literally usi second mein li gayi jab situation appear hoti hai. Ye
everyday English mein genuinely common hai: kisi cheez pe react karna
jo abhi notice hui, help offer karna theek waqt jab koi struggle karte
dikhe, kisi cheez pe agree karna jo abhi propose hui. In mein se koi
bhi paanch minute pehle plan ki tarah exist nahi karta tha.

**"Will" ke saath predictions ko evidence ki zaroorat nahi hoti jaise
"going to" predictions ko often hoti hai.** "I think she'll do well in
the exam" ek belief ya opinion hai future ke baare mein, abhi visible
kisi cheez pe based nahi — contrast karo isse "look at those clouds,
it's going to rain," jo present evidence mein grounded hai. Dono valid
predictions hain; wo bas different sources se aate hain.

**"I promise I will..." English mein sabse strongest, sabse sincere-
sounding commitments mein se ek hai**, precisely kyunki bolte waqt
"will" real weight carry karta hai — ye signal karta hai ki tum abhi
commit kar rahe ho, sirf ek plan describe nahi kar rahe jo tumhare
paas already tha.`,

    readingPassage: `I don't have any plans for tomorrow yet. I think I will visit the museum, but I'm not sure. Oh wait, my phone is ringing — I'll answer it. Hello? Okay, sure, I'll come at five. I promise I will be there on time.`,
    readingPassageHi: `Mere paas kal ke koi plans abhi tak nahi hain. I think main museum visit karunga, but main sure nahi hoon. Oh wait, mera phone ring kar raha hai — I'll answer it. Hello? Okay, sure, main paanch baje aa jaunga. I promise main time pe wahan hounga.`,

    vocabulary: [
      {
        word: 'promise',
        wordHi: 'promise (vaada)',
        meaning: 'to say firmly that you will definitely do something',
        meaningHi: 'firmly kehna ki tum definitely kuch karoge',
        example: 'I promise I will call you tonight.',
        exampleHi: 'I promise I will call you tonight.',
        pronunciation: 'PROM-is',
      },
      {
        word: 'offer',
        wordHi: 'offer (peshkash)',
        meaning: 'to say you are willing to do something for someone',
        meaningHi: 'kehna ki tum kisi ke liye kuch karne ke liye willing ho',
        example: "I'll offer to help her with the boxes.",
        exampleHi: "I'll offer to help her with the boxes.",
        pronunciation: 'OF-er',
      },
      {
        word: 'prediction',
        wordHi: 'prediction (bhavishyavani)',
        meaning: 'a statement about what you think will happen',
        meaningHi: 'ek statement ki tumhe kya lagta hai hoga',
        example: 'My prediction is that they will win the match.',
        exampleHi: 'My prediction is that they will win the match.',
        pronunciation: 'pree-DIK-shun',
      },
      {
        word: 'ring (a phone)',
        wordHi: 'ring (bajna)',
        meaning: 'to make a sound to signal an incoming call',
        meaningHi: 'ek sound banana ek incoming call signal karne ke liye',
        example: 'The phone is ringing — I\'ll get it.',
        exampleHi: 'The phone is ringing — I\'ll get it.',
        pronunciation: 'ring',
      },
    ],

    examples: [
      {
        title: 'A spontaneous, in-the-moment offer',
        titleHi: 'Ek spontaneous, in-the-moment offer',
        code: `A: Oh no, I forgot my wallet at home.
B: Don't worry, I'll pay for lunch today.
A: Thank you so much!`,
        output: 'The decision to pay is made right as the problem appears.',
        explain:
          'Notice B didn\'t plan this before lunch — the offer is made the instant the problem is noticed, which is exactly the situation "will" is built for.',
        explainHi:
          'Notice karo B ne lunch se pehle ye plan nahi kiya — offer exactly us instant mein banta hai jab problem notice hota hai, jo exactly wo situation hai jiske liye "will" banaya gaya hai.',
      },
      {
        title: 'A general prediction with no specific evidence',
        titleHi: 'Ek general prediction bina specific evidence ke',
        code: `A: Do you think the team will win tomorrow?
B: I think they will — they've been playing really well this season.`,
        output: 'A belief about the future, not based on anything visible right now.',
        explain:
          'Compare this to "it\'s going to rain" (visible clouds) — this prediction is based on a general belief and reasoning ("playing well this season"), not on something you can currently see or point to.',
        explainHi:
          'Ise "it\'s going to rain" (visible clouds) se compare karo — ye prediction ek general belief aur reasoning pe based hai ("playing well this season"), kisi aisi cheez pe nahi jo tum currently dekh ya point kar sakte ho.',
      },
    ],

    mistakes: [
      {
        wrong: 'Using "going to" for an offer made right at the moment: "The phone is ringing — I am going to get it."',
        right: '"The phone is ringing — I\'ll get it!"',
        why: 'This decision is made the instant the phone rings, not before — "will" is the natural choice for a genuinely spontaneous, in-the-moment reaction, not "going to."',
        whyHi: 'Ye decision phone ring hone ke instant li jaati hai, pehle nahi — "will" ek genuinely spontaneous, in-the-moment reaction ke liye natural choice hai, "going to" nahi.',
      },
      {
        wrong: '"I will to help you." (adding "to" after "will")',
        right: '"I will help you."',
        why: '"Will" is followed directly by the base verb with no "to" in between — unlike some other structures in English that do need "to," "will" never takes it.',
        whyHi: '"Will" ke turant baad base verb aata hai bina "to" beech mein — English ke kuch doosre structures ke unlike jinhe "to" chahiye, "will" ise kabhi nahi leta.',
      },
    ],

    realWorld: [
      {
        en: '**Ordering food, replying to a sudden request, or reacting to something unexpected** — nearly all spontaneous, in-the-moment English decisions use "will" ("I\'ll have the chicken," "I\'ll take care of it").',
        hi: '**Khana order karna, ek achanak request ka reply dena, ya kisi unexpected cheez pe react karna** — nearly sab spontaneous, in-the-moment English decisions "will" use karte hain ("I\'ll have the chicken," "I\'ll take care of it").',
      },
      {
        en: '**Making a genuine promise to someone** ("I will finish this report by tomorrow, I promise") relies specifically on "will" carrying real, in-the-moment weight — using "going to" here would sound like describing an old plan rather than a fresh commitment.',
        hi: '**Kisi se ek genuine promise karna** ("I will finish this report by tomorrow, I promise") specifically "will" pe rely karta hai real, in-the-moment weight carry karne ke liye — yahan "going to" use karna ek old plan describe karne jaisa sound karega, fresh commitment nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'If I\'m not sure whether to use "will" or "going to," is there a simple test?',
        qHi: 'Agar mujhe sure nahi hai "will" use karoon ya "going to," kya koi simple test hai?',
        a: 'Ask yourself: did this decision exist before this exact conversation/moment? If yes, use "going to." If the decision is happening as you speak — reacting, offering, promising, or guessing without hard evidence — use "will."',
        aHi: 'Apne aap se poocho: kya ye decision is exact conversation/moment se pehle exist karta tha? Agar haan, "going to" use karo. Agar decision bolte waqt ho raha hai — react karna, offer karna, promise karna, ya bina hard evidence ke guess karna — "will" use karo.',
      },
      {
        q: 'Can "will" be used for something that will definitely, certainly happen, like the sun rising?',
        qHi: 'Kya "will" kisi aisi cheez ke liye use ho sakta hai jo definitely, certainly hogi, jaise sooraj ka ugna?',
        a: 'Yes — "will" comfortably expresses certainty too: "The sun will rise at 6am tomorrow." This is simply a very confident version of a prediction, still fitting naturally within "will"\'s core job.',
        aHi: 'Haan — "will" certainty bhi comfortably express karta hai: "The sun will rise at 6am tomorrow." Ye simply ek bahut confident version hai ek prediction ka, phir bhi "will" ke core job ke andar naturally fit hota hai.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, make a genuine promise to yourself about something you will do tomorrow, using "I promise I will..."',
        taskHi: 'Zor se, apne aap se ek genuine promise karo kal ke baare mein jo tum karoge, "I promise I will..." use karke.',
        hint: 'Pick something small and real: "I promise I will drink more water tomorrow."',
        hintHi: 'Kuch chhota aur real choose karo: "I promise I will drink more water tomorrow."',
      },
      {
        task: 'Imagine a friend just told you they lost their keys. Out loud, offer to help using "will," made right in that moment.',
        taskHi: 'Imagine karo ek friend ne abhi tumhe bataya ki unki keys kho gayi. Zor se, "will" use karke help offer karo, us moment mein hi banayi hui.',
        hint: '"Don\'t worry, I\'ll help you look for them."',
        hintHi: '"Don\'t worry, I\'ll help you look for them."',
      },
    ],

    keyTakeaways: [
      '"Will" has three jobs: general predictions without hard evidence, spontaneous in-the-moment decisions, and offers/promises.',
      'The core difference from "going to": "will" is decided at the moment of speaking; "going to" was decided before.',
      '"Will" never changes form (I will, she will, they will) and is directly followed by the base verb — never "will to."',
      '"The phone is ringing — I\'ll get it" is the clearest example of "will"\'s in-the-moment-decision job.',
      'A genuine promise ("I promise I will...") relies specifically on "will"\'s in-the-moment weight, not "going to."',
    ],
    keyTakeawaysHi: [
      '"Will" ke teen kaam hain: general predictions bina hard evidence ke, spontaneous in-the-moment decisions, aur offers/promises.',
      '"Going to" se core difference: "will" bolte waqt decide hota hai; "going to" pehle decide ho chuka tha.',
      '"Will" kabhi form change nahi karta (I will, she will, they will) aur directly base verb follow karta hai — kabhi "will to" nahi.',
      '"The phone is ringing — I\'ll get it" "will" ke in-the-moment-decision job ka sabse clear example hai.',
      'Ek genuine promise ("I promise I will...") specifically "will" ke in-the-moment weight pe rely karta hai, "going to" pe nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-present-continuous-for-future',
    title: 'A Third Way to Talk About the Future: Fixed Arrangements',
    titleHi: 'Future Ke Baare Mein Baat Karne Ka Teesra Tareeka: Fixed Arrangements',
    description:
      '"I\'m meeting her tomorrow at 5" — present continuous used for the future, for a plan with a specific, fixed time and place already arranged.',
    descriptionHi:
      '"I\'m meeting her tomorrow at 5" — present continuous future ke liye use hua, ek plan ke liye jiska specific, fixed time aur place already arranged hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A fixed arrangement is a calendar entry, not just an intention in your head.** "I\'m going to see a doctor sometime" is a loose intention. "I\'m seeing the doctor at 4pm on Thursday" is something you could point to on a calendar — a real, confirmed slot, which is exactly what present continuous signals here.',
      hi: 'Ek fixed arrangement ek calendar entry hai, sirf tumhare mind mein ek intention nahi. "I\'m going to see a doctor sometime" ek loose intention hai. "I\'m seeing the doctor at 4pm on Thursday" kuch aisa hai jise tum calendar pe point kar sakte ho — ek real, confirmed slot, jo exactly wo hai jo present continuous yahan signal karta hai.',
    },

    simple: `**Present continuous (am/is/are + verb-ing) can describe a fixed
future arrangement, not just something happening right now:**

"I'm meeting my dentist tomorrow at 3pm." (a confirmed, specific
appointment — not happening right now, but fixed and arranged)

**This is different from "going to" in one key way: a specific time
and often another person are usually already confirmed.**

- "I'm having dinner with Raj on Friday." (a real, arranged plan with
  another person and a specific day)
- "We're flying to Delhi next Tuesday." (tickets already booked — a
  confirmed arrangement)

**A useful comparison, all three future forms together:**

- "I'm going to travel more this year." (a general intention, going
  to)
- "I think I'll travel to Europe someday." (a loose future prediction,
  will)
- "I'm traveling to Delhi next Tuesday." (a fixed, arranged plan,
  present continuous)`,
    simpleHi: `**Present continuous (am/is/are + verb-ing) ek fixed future arrangement describe kar sakta hai, sirf abhi ho rahi koi cheez nahi:**

"I'm meeting my dentist tomorrow at 3pm." (ek confirmed, specific
appointment — abhi nahi ho rahi, par fixed aur arranged hai)

**Ye "going to" se ek key tareeke se different hai: ek specific time
aur often ek doosra person usually already confirmed hota hai.**

- "I'm having dinner with Raj on Friday." (ek real, arranged plan ek
  doosre person ke saath aur ek specific din)
- "We're flying to Delhi next Tuesday." (tickets already booked — ek
  confirmed arrangement)

**Ek useful comparison, teeno future forms saath mein:**

- "I'm going to travel more this year." (ek general intention, going
  to)
- "I think I'll travel to Europe someday." (ek loose future
  prediction, will)
- "I'm traveling to Delhi next Tuesday." (ek fixed, arranged plan,
  present continuous)`,

    content: `**Why present continuous can describe the future at all — this
genuinely surprises many learners.**

Present continuous's core job is describing something happening right
now. But English extends it to a second job: a future event so
concretely arranged — a specific time, often another person or a
booking involved — that it feels almost as certain as something
already happening. The logic is that the ARRANGING happened, and is
still true right now, even though the event itself is in the future.

**The clearest signal for this use is a specific time plus, often,
another person or a booking.** "I'm meeting Raj at 5" (a person and a
time) or "We're flying to Delhi on Tuesday" (a booking and a day) both
carry that concreteness. A vague future idea ("I'm traveling more this
year") doesn't fit this pattern — that\'s "going to" territory instead.

**All three future forms can describe similar events with a genuinely
different feel.** "I'm going to see a movie this weekend" (a loose
personal plan) versus "I'm seeing a movie with Priya at 7pm on
Saturday" (a specific, confirmed arrangement) — both are grammatically
correct, and a fluent speaker picks based on how fixed and specific
the plan actually is, not at random.

**This use only applies to a genuinely fixed, specific arrangement —
not every plan qualifies.** "I'm going to get married someday" cannot
switch to present continuous, because there's no fixed date yet. Once
a real date is set — "I'm getting married in December" — present
continuous becomes not just possible but often the more natural
choice.`,
    contentHi: `**Present continuous future describe kyun kar sakta hai bilkul —
ye genuinely kayi learners ko surprise karta hai.**

Present continuous ka core job abhi ho rahi kisi cheez ko describe
karna hai. Par English ise ek doosre job tak extend karti hai: ek
future event itna concretely arranged hai — ek specific time, often ek
doosra person ya ek booking involved — ki ye almost utna hi certain
feel karta hai jitna kuch already ho raha ho. Logic ye hai ki
ARRANGING ho chuka hai, aur abhi bhi true hai, chahe event khud future
mein ho.

**Is use ka sabse clear signal ek specific time hai plus, often, ek
doosra person ya booking.** "I'm meeting Raj at 5" (ek person aur ek
time) ya "We're flying to Delhi on Tuesday" (ek booking aur ek din)
dono wo concreteness carry karte hain. Ek vague future idea ("I'm
traveling more this year") is pattern mein fit nahi hota — wo "going
to" territory hai.

**Teeno future forms similar events describe kar sakte hain ek
genuinely different feel ke saath.** "I'm going to see a movie this
weekend" (ek loose personal plan) versus "I'm seeing a movie with
Priya at 7pm on Saturday" (ek specific, confirmed arrangement) — dono
grammatically correct hain, aur ek fluent speaker choose karta hai is
baat pe based ki plan actually kitna fixed aur specific hai, random
nahi.

**Ye use sirf ek genuinely fixed, specific arrangement pe apply hota
hai — har plan qualify nahi karta.** "I'm going to get married someday"
present continuous mein switch nahi ho sakta, kyunki abhi koi fixed
date nahi hai. Ek baar ek real date set ho jaaye — "I'm getting
married in December" — present continuous sirf possible nahi ban
jaata balki often zyada natural choice ban jaata hai.`,

    readingPassage: `I have a busy week ahead. I'm meeting my old friend on Wednesday at noon. On Thursday, I'm having a meeting with my manager at 10am. And on Friday evening, I'm flying to Mumbai for a family event. Everything is already arranged, so I just need to follow my calendar.`,
    readingPassageHi: `Mera ek busy week aage hai. I'm meeting my old friend Wednesday ko noon pe. Thursday ko, I'm having a meeting apne manager ke saath 10am pe. Aur Friday evening ko, I'm flying to Mumbai ek family event ke liye. Sab kuch already arranged hai, so mujhe bas apna calendar follow karna hai.`,

    vocabulary: [
      {
        word: 'arrangement',
        wordHi: 'arrangement (vyavastha)',
        meaning: 'a plan that has been organized in advance, often with a fixed time',
        meaningHi: 'ek plan jo pehle se organize kiya gaya hai, often ek fixed time ke saath',
        example: 'We have an arrangement to meet at the cafe at 5.',
        exampleHi: 'We have an arrangement to meet at the cafe at 5.',
        pronunciation: 'uh-REYNJ-ment',
      },
      {
        word: 'confirmed',
        wordHi: 'confirmed (confirm kiya hua)',
        meaning: 'made certain; officially agreed',
        meaningHi: 'certain banaya gaya; officially agree kiya gaya',
        example: 'The meeting time is confirmed for 3pm.',
        exampleHi: 'The meeting time is confirmed for 3pm.',
        pronunciation: 'kuhn-FERMD',
      },
      {
        word: 'booking',
        wordHi: 'booking (booking)',
        meaning: 'a reservation made in advance, like for travel or a table',
        meaningHi: 'ek reservation jo pehle se ki gayi hai, jaise travel ya ek table ke liye',
        example: 'I have a flight booking for next Tuesday.',
        exampleHi: 'I have a flight booking for next Tuesday.',
        pronunciation: 'BOOK-ing',
      },
      {
        word: 'ahead',
        wordHi: 'ahead (aage)',
        meaning: 'in the future, still to come',
        meaningHi: 'future mein, abhi aana baaki hai',
        example: "I have a busy week ahead.",
        exampleHi: "I have a busy week ahead.",
        pronunciation: 'uh-HED',
      },
    ],

    examples: [
      {
        title: 'Three future forms compared in one context',
        titleHi: 'Teen future forms compare kiye gaye ek context mein',
        code: `I'm going to travel more this year. (general intention)
I think I'll visit somewhere new. (loose prediction)
I'm flying to Goa on the 14th — I already booked the tickets. (fixed arrangement)`,
        output: 'Same general topic, three genuinely different levels of certainty and fixedness.',
        explain:
          'Notice how the third sentence includes both a specific date and confirming evidence ("already booked the tickets") — this is exactly the combination that signals present continuous is the right choice.',
        explainHi:
          'Notice karo kaise teesra sentence ek specific date aur confirming evidence dono include karta hai ("already booked the tickets") — ye exactly wo combination hai jo signal karta hai present continuous sahi choice hai.',
      },
      {
        title: 'A fixed arrangement with another person',
        titleHi: 'Ek fixed arrangement ek doosre person ke saath',
        code: `A: Are you free on Saturday?
B: Sorry, I'm meeting my cousin for lunch at 1pm. What about Sunday?`,
        output: 'A specific person, time, and day all confirm this is a fixed arrangement.',
        explain:
          'This response wouldn\'t work as well with "I am going to meet my cousin" — the specific time and the fact it\'s already set makes present continuous the more natural, precise choice here.',
        explainHi:
          'Ye response "I am going to meet my cousin" ke saath utna achha kaam nahi karega — specific time aur ye fact ki ye already set hai present continuous ko yahan zyada natural, precise choice banata hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"I am seeing a doctor someday." (using present continuous for a vague, unfixed future idea)',
        right: '"I am going to see a doctor someday." or "I want to see a doctor at some point."',
        why: 'Present continuous for the future needs a genuinely fixed, specific arrangement — a vague, undated idea like "someday" doesn\'t carry the concreteness this structure signals.',
        whyHi: 'Future ke liye present continuous ko ek genuinely fixed, specific arrangement chahiye — ek vague, undated idea jaise "someday" wo concreteness carry nahi karta jo ye structure signal karta hai.',
      },
      {
        wrong: '"I meeting Raj tomorrow." (missing the be-verb)',
        right: '"I am meeting Raj tomorrow." / "I\'m meeting Raj tomorrow."',
        why: 'Present continuous always needs its be-verb (am/is/are) — this is easy to drop when speaking quickly, but the sentence is incomplete without it.',
        whyHi: 'Present continuous ko hamesha apna be-verb chahiye (am/is/are) — jaldi bolte waqt ise drop karna aasan hai, par uske bina sentence incomplete hai.',
      },
    ],

    realWorld: [
      {
        en: '**Confirming plans with friends, family, or colleagues** ("I\'m picking you up at 6," "We\'re having the call at 10am") relies heavily on this exact structure precisely because it signals the plan is genuinely settled, not just hoped for.',
        hi: '**Friends, family, ya colleagues ke saath plans confirm karna** ("I\'m picking you up at 6," "We\'re having the call at 10am") heavily is exact structure pe rely karta hai precisely kyunki ye signal karta hai plan genuinely settled hai, sirf hope nahi ki gayi.',
      },
      {
        en: '**Discussing your travel or work schedule** — "I\'m flying out on Tuesday" or "I\'m starting the new project next week" both sound confident and organized, exactly the impression this structure is built to give.',
        hi: '**Apna travel ya work schedule discuss karna** — "I\'m flying out on Tuesday" ya "I\'m starting the new project next week" dono confident aur organized sound karte hain, exactly wo impression jo ye structure dene ke liye bana hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How is "I\'m meeting him tomorrow" different from "I\'m going to meet him tomorrow" — don\'t they mean the same thing?',
        qHi: '"I\'m meeting him tomorrow" "I\'m going to meet him tomorrow" se kaise different hai — kya inka matlab same nahi hai?',
        a: "They're extremely close in meaning and often interchangeable in casual speech. The subtle difference: present continuous leans slightly more toward a confirmed arrangement with another person involved, while \"going to\" leans slightly more toward your own personal intention. In everyday conversation, don't worry too much about choosing perfectly between them.",
        aHi: "Meaning mein ye extremely close hain aur often casual speech mein interchangeable hain. Subtle difference: present continuous thoda zyada ek confirmed arrangement ki taraf lean karta hai jisme doosra person involved ho, jabki \"going to\" thoda zyada tumhare apne personal intention ki taraf lean karta hai. Everyday conversation mein, inke beech perfectly choose karne ki bahut zyada worry mat karo.",
      },
      {
        q: 'Can present continuous be used for the future without any time word at all?',
        qHi: 'Kya present continuous bina kisi time word ke bhi future ke liye use ho sakta hai?',
        a: "It's rare and can be genuinely confusing without a time signal, since present continuous's default meaning is happening right now. Almost always include a future time word or phrase (tomorrow, next week, at 5, on Friday) to make clear you mean the future, not this exact moment.",
        aHi: "Ye rare hai aur bina ek time signal ke genuinely confusing ho sakta hai, kyunki present continuous ka default meaning abhi ho raha hai. Almost hamesha ek future time word ya phrase include karo (tomorrow, next week, at 5, on Friday) clear karne ke liye ki tumhara matlab future hai, ye exact moment nahi.",
      },
    ],

    exercises: [
      {
        task: 'Out loud, describe one genuinely fixed plan you have this week using present continuous, including a specific day or time.',
        taskHi: 'Zor se, is hafte ka ek genuinely fixed plan describe karo present continuous use karke, ek specific din ya time include karte hue.',
        hint: '"I\'m [doing something] on [day] at [time]."',
        hintHi: '"I\'m [doing something] on [day] at [time]."',
      },
      {
        task: 'Say all three future forms out loud about the same general topic (traveling, or eating out): one with "going to," one with "will," and one with present continuous.',
        taskHi: 'Same general topic (travel, ya bahar khana khana) ke baare mein teeno future forms zor se bolo: ek "going to" ke saath, ek "will" ke saath, aur ek present continuous ke saath.',
        hint: '"I\'m going to try a new restaurant sometime." "I think I\'ll enjoy it." "I\'m eating there with Priya on Friday at 8."',
        hintHi: '"I\'m going to try a new restaurant sometime." "I think I\'ll enjoy it." "I\'m eating there with Priya on Friday at 8."',
      },
    ],

    keyTakeaways: [
      'Present continuous can describe the future when a plan is genuinely fixed and specific — often with a set time and another person.',
      'This differs from "going to": present continuous signals a confirmed arrangement, "going to" signals a personal intention or general plan.',
      'A vague, undated future idea ("someday") doesn\'t fit this structure — it needs real concreteness (a day, a time, a booking).',
      'All three future forms can describe similar events with a genuinely different feel: going to (intention), will (prediction/spontaneous), present continuous (fixed arrangement).',
      'Always include a future time word (tomorrow, next week, at 5) when using present continuous for the future, to avoid confusion with something happening right now.',
    ],
    keyTakeawaysHi: [
      'Present continuous future describe kar sakta hai jab ek plan genuinely fixed aur specific ho — often ek set time aur ek doosre person ke saath.',
      'Ye "going to" se different hai: present continuous ek confirmed arrangement signal karta hai, "going to" ek personal intention ya general plan signal karta hai.',
      'Ek vague, undated future idea ("someday") is structure mein fit nahi hota — isko real concreteness chahiye (ek din, ek time, ek booking).',
      'Teeno future forms similar events describe kar sakte hain ek genuinely different feel ke saath: going to (intention), will (prediction/spontaneous), present continuous (fixed arrangement).',
      'Hamesha ek future time word include karo (tomorrow, next week, at 5) present continuous ko future ke liye use karte waqt, abhi ho rahi kisi cheez se confusion avoid karne ke liye.',
    ],
  },
];
