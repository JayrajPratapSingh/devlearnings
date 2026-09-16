/**
 * English Speaking Complete Course — Module 6: Asking Questions
 * Naturally, lessons 1-3. Closes Part II (Building Real Sentences).
 *
 * Lesson 1: Yes/no questions and the do/does/did that Hindi has no
 *           equivalent for, so it frequently goes missing.
 * Lesson 2: Wh-questions (what/where/when/who/why/how) and their word
 *           order, which inverts compared to a Hindi question.
 * Lesson 3: Question intonation and softer, less interrogation-like
 *           ways to ask things in natural conversation.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_6: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-yes-no-questions-do-does-did',
    title: 'Yes/No Questions — The Missing "Do"',
    titleHi: 'Yes/No Questions — Wo Missing "Do"',
    description:
      '"You like tea?" works, but "Do you like tea?" is the natural English shape — where "do/does/did" comes from and why it disappears in translation.',
    descriptionHi:
      '"You like tea?" kaam kar jaata hai, par "Do you like tea?" natural English shape hai — "do/does/did" kahan se aata hai aur translation mein kyun disappear ho jaata hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**"Do" is a small flag you raise at the front of a sentence to say "this is a question coming."** Hindi raises that flag with your voice going up at the end and word order barely changing; English usually raises it with a specific word — "do," "does," or "did" — right at the start.',
      hi: '"Do" ek chhota flag hai jo tum sentence ke shuru mein raise karte ho ye kehne ke liye "ye ek question aa raha hai." Hindi wo flag tumhari voice se raise karti hai jo end mein upar jaati hai aur word order barely change hota hai; English usually ise ek specific word se raise karti hai — "do," "does," ya "did" — bilkul shuru mein.',
    },

    simple: `**Most yes/no questions in English start with "do," "does," or
"did":**

- Present, I/you/we/they: **Do** you like tea?
- Present, he/she/it: **Does** she like tea? (note: "does," not "do,"
  and the main verb loses its own "-s": "does she like," not "does
  she likes")
- Past, any subject: **Did** you finish the report? (note: the main
  verb goes back to base form: "did you finish," not "did you
  finished")

**The structure:**

Do/Does/Did + subject + base verb + ...?

**Answering short and naturally:**

"Do you like tea?" → "Yes, I do." / "No, I don't."
"Does she work here?" → "Yes, she does." / "No, she doesn't."
"Did you call him?" → "Yes, I did." / "No, I didn't."

**Verbs "be" and "have" (as a main verb) and modal verbs (can, will,
should) don't need "do" — they simply move to the front themselves**:
"Are you ready?" not "Do you are ready?" · "Can you help?" not "Do you
can help?"`,
    simpleHi: `**Zyadatar yes/no questions English mein "do," "does," ya "did" se start hote hain:**

- Present, I/you/we/they: **Do** you like tea?
- Present, he/she/it: **Does** she like tea? (note: "do" nahi, "does,"
  aur main verb apna "-s" kho deta hai: "does she like," "does she
  likes" nahi)
- Past, koi bhi subject: **Did** you finish the report? (note: main
  verb base form mein wapas jaata hai: "did you finish," "did you
  finished" nahi)

**Structure:**

Do/Does/Did + subject + base verb + ...?

**Short aur naturally answer dena:**

"Do you like tea?" → "Yes, I do." / "No, I don't."
"Does she work here?" → "Yes, she does." / "No, she doesn't."
"Did you call him?" → "Yes, I did." / "No, I didn't."

**Verbs "be" aur "have" (main verb ki tarah) aur modal verbs (can,
will, should) ko "do" ki zaroorat nahi hoti — wo khud simply front
mein move ho jaate hain**: "Are you ready?" "Do you are ready?" nahi ·
"Can you help?" "Do you can help?" nahi.`,

    content: `**Why "do" specifically has no Hindi equivalent to translate from.**

Hindi turns a statement into a yes/no question mostly through rising
intonation and sometimes a particle like "kya" — "tum chai pasand
karte ho" becomes a question with "kya tum chai pasand karte ho?" or
just a rising tone, with no separate helping word inserted mid-
sentence the way English inserts "do." Since there's no direct word-
for-word equivalent to translate, "do" is one of the easiest words to
simply forget when forming an English question, producing "You like
tea?" — understandable, but noticeably non-standard.

**"You like tea?" isn't wrong exactly — it's a different, more casual
register.** Rising intonation alone CAN form a question in casual
English too ("You're coming, right?" said with rising tone). But
relying on this as your only method, rather than knowing the "do"
structure, limits you to sounding casual/uncertain in situations (an
interview, a formal email spoken aloud) that call for the standard
structure.

**"Does" quietly removes the "-s" from the main verb — a specific,
easy-to-miss detail.** "She likes tea" becomes "Does she like tea?"
(not "Does she likes tea?") — the "-s" moved from the main verb onto
"does" itself, and a sentence can't have it in both places.

**"Do/does/did" also power negative statements, using the exact same
logic.** "I don't like coffee," "She doesn't work here," "I didn't
see him" — this is the same helping-verb mechanism, just paired with
"not" instead of moved to the front of a question. Learning both
together reinforces the same underlying pattern.`,
    contentHi: `**"Do" specifically translate karne ke liye koi Hindi equivalent kyun nahi rakhta.**

Hindi ek statement ko yes/no question mein mostly rising intonation se
aur kabhi kabhi ek particle jaise "kya" se badalti hai — "tum chai
pasand karte ho" "kya tum chai pasand karte ho?" ban jaata hai ya bas
ek rising tone se, bina koi separate helping word mid-sentence insert
kiye jaise English "do" insert karti hai. Kyunki koi direct word-for-
word equivalent translate karne ke liye nahi hai, "do" ek sabse easy
words mein se ek hai simply bhoolne ke liye ek English question banate
waqt, "You like tea?" produce karte hue — understandable, par
noticeably non-standard.

**"You like tea?" exactly galat nahi hai — ye ek different, zyada
casual register hai.** Rising intonation akele bhi casual English mein
ek question form kar SAKTI hai ("You're coming, right?" rising tone ke
saath bola gaya). Par isi pe akele rely karna, "do" structure jaane ke
bajaye, tumhe casual/uncertain sound karne tak limit karta hai un
situations mein (ek interview, ek formal email zor se bola gaya) jinhe
standard structure chahiye.

**"Does" chupke se main verb se "-s" hata deta hai — ek specific,
easy-to-miss detail.** "She likes tea" "Does she like tea?" ban jaata
hai ("Does she likes tea?" nahi) — "-s" main verb se "does" pe khud
move ho gaya, aur ek sentence mein ye dono jagah nahi ho sakta.

**"Do/does/did" negative statements ko bhi power karte hain, exact
same logic use karke.** "I don't like coffee," "She doesn't work
here," "I didn't see him" — ye same helping-verb mechanism hai, bas
"not" ke saath paired, question ke front mein move hone ke bajaye.
Dono ko saath seekhna same underlying pattern ko reinforce karta hai.`,

    readingPassage: `Do you like coffee? I do, but my sister doesn't. She prefers tea. Did you try the new cafe near our house? I didn't go there yet, but I think I will this weekend. Does it open early in the morning? I'm not sure, but I will find out.`,
    readingPassageHi: `Do you like coffee? I do, but meri sister doesn't. She prefers tea. Did you try the new cafe near our house? Main wahan abhi didn't gaya, but I think main is weekend jaunga. Does it open early in the morning? Main sure nahi hoon, but I will find out.`,

    vocabulary: [
      {
        word: 'prefer',
        wordHi: 'prefer (tarjeeh dena)',
        meaning: 'to like one thing more than another',
        meaningHi: 'ek cheez ko doosri se zyada pasand karna',
        example: 'I prefer tea over coffee.',
        exampleHi: 'I prefer tea over coffee.',
        pronunciation: 'pri-FUR',
      },
      {
        word: 'find out',
        wordHi: 'find out (pata karna)',
        meaning: 'to discover or get information about something',
        meaningHi: 'kisi cheez ke baare mein discover karna ya information paana',
        example: "I'll find out what time the shop opens.",
        exampleHi: "I'll find out what time the shop opens.",
        pronunciation: 'fynd owt',
      },
      {
        word: 'yet',
        wordHi: 'yet (abhi tak)',
        meaning: 'until now, used with negative sentences about something not done',
        meaningHi: 'ab tak, negative sentences ke saath use hota hai kisi cheez ke liye jo nahi hui',
        example: "I haven't tried that restaurant yet.",
        exampleHi: "I haven't tried that restaurant yet.",
        pronunciation: 'yet',
      },
      {
        word: 'sure',
        wordHi: 'sure (pakka)',
        meaning: 'certain, without doubt',
        meaningHi: 'certain, doubt ke bina',
        example: "I'm not sure what time it opens.",
        exampleHi: "I'm not sure what time it opens.",
        pronunciation: 'shoor',
      },
    ],

    examples: [
      {
        title: 'Do/does/did in a natural back-and-forth',
        titleHi: 'Do/does/did ek natural back-and-forth mein',
        code: `A: Do you like spicy food?
B: Yes, I do! Does your family like it too?
A: My mom does, but my dad doesn't — he prefers mild food.
B: Did you cook something spicy recently?
A: Yes, I did! I made a spicy curry last night.`,
        output: 'Every question and short answer uses do/does/did correctly.',
        explain:
          'Notice how naturally do/does/did repeats throughout this exchange — practicing a back-and-forth like this out loud builds the pattern into automatic speech faster than studying the rule alone.',
        explainHi:
          'Notice karo kaise naturally do/does/did is exchange mein baar-baar aata hai — is tarah ka back-and-forth zor se practice karna pattern ko automatic speech mein banata hai sirf rule padhne se faster.',
      },
      {
        title: 'Short, natural answers',
        titleHi: 'Short, natural answers',
        code: `Do you speak French? — Yes, I do. / No, I don't.
Does he play cricket? — Yes, he does. / No, he doesn't.
Did they arrive on time? — Yes, they did. / No, they didn't.`,
        output: 'A short "yes/no + subject + do/does/did" answer, no repeated verb needed.',
        explain:
          'A short answer like this is much more natural than repeating the full sentence ("Yes, I speak French") — native speakers almost always use this shortened pattern in casual conversation.',
        explainHi:
          'Ek short answer jaisa ye poore sentence ko repeat karne se ("Yes, I speak French") kahin zyada natural hai — native speakers almost hamesha casual conversation mein ye shortened pattern use karte hain.',
      },
    ],

    mistakes: [
      {
        wrong: '"You like tea?" (as your only way of asking, in formal or unclear contexts)',
        right: '"Do you like tea?"',
        why: 'Rising intonation alone can work in very casual speech, but the standard "do" structure is expected in most situations, especially anything slightly formal — relying only on intonation limits how naturally you\'ll be understood.',
        whyHi: 'Rising intonation akele bahut casual speech mein kaam kar sakta hai, par standard "do" structure zyadatar situations mein expected hai, especially koi bhi thodi si formal cheez — sirf intonation pe rely karna limit karta hai tum kitna naturally samjhe jaoge.',
      },
      {
        wrong: '"Does she likes tea?" (keeping the "-s" on both "does" and the main verb)',
        right: '"Does she like tea?"',
        why: 'The "-s" moves entirely onto "does" — the main verb goes back to its base form. Having "-s" in both places is a common overcorrection while learning this structure.',
        whyHi: '"-s" poori tarah "does" pe move ho jaata hai — main verb apne base form mein wapas chala jaata hai. Dono jagah "-s" hona ye structure seekhte waqt ek common overcorrection hai.',
      },
    ],

    realWorld: [
      {
        en: '**Small talk and getting to know someone** ("Do you live nearby?", "Do you have any siblings?") is built almost entirely on yes/no questions using this exact structure.',
        hi: '**Small talk aur kisi ko jaanna** ("Do you live nearby?", "Do you have any siblings?") almost poori tarah is exact structure use karke yes/no questions pe bana hai.',
      },
      {
        en: '**Confirming details at work** ("Did you send the email?", "Does the client know about this?") relies on quick, correctly formed yes/no questions to keep a team coordinated.',
        hi: '**Kaam pe details confirm karna** ("Did you send the email?", "Does the client know about this?") quick, correctly formed yes/no questions pe rely karta hai ek team ko coordinated rakhne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why don\'t "Are you ready?" or "Can you help?" need "do" in front of them?',
        qHi: '"Are you ready?" ya "Can you help?" ko apne aage "do" ki zaroorat kyun nahi hoti?',
        a: '"Be" (am/is/are/was/were) and modal verbs (can, will, should, must, may) are special — they can move to the front of a question by themselves, without needing "do" to help. "Do" only steps in for ordinary main verbs like "like," "work," "go," and "eat."',
        aHi: '"Be" (am/is/are/was/were) aur modal verbs (can, will, should, must, may) special hain — wo khud question ke front mein move ho sakte hain, "do" ki help ke bina. "Do" sirf ordinary main verbs ke liye step in karta hai jaise "like," "work," "go," aur "eat."',
      },
      {
        q: 'Is it OK to answer just "Yes" or "No" without adding "I do" or "she doesn\'t"?',
        qHi: 'Kya sirf "Yes" ya "No" answer dena theek hai bina "I do" ya "she doesn\'t" add kiye?',
        a: 'A bare "Yes" or "No" is understood but can sound a little blunt or abrupt in conversation. Adding the short "I do" / "I don\'t" softens it and sounds more natural and complete, without needing the full original sentence repeated.',
        aHi: 'Ek bare "Yes" ya "No" samjha jaata hai par conversation mein thoda blunt ya abrupt sound kar sakta hai. Short "I do" / "I don\'t" add karna ise soften karta hai aur zyada natural aur complete sound karata hai, poore original sentence ko repeat kiye bina.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, turn these three statements into yes/no questions: "You like pizza." "She works on weekends." "They finished the project."',
        taskHi: 'Zor se, in teen statements ko yes/no questions mein badlo: "You like pizza." "She works on weekends." "They finished the project."',
        hint: '"Do you like pizza?" "Does she work on weekends?" "Did they finish the project?"',
        hintHi: '"Do you like pizza?" "Does she work on weekends?" "Did they finish the project?"',
      },
      {
        task: 'Ask a friend or family member three real yes/no questions out loud, using "do," "does," and "did" — one each — and give them time to answer.',
        taskHi: 'Ek friend ya family member se teen real yes/no questions zor se poocho, "do," "does," aur "did" use karke — ek-ek — aur unhe answer karne ka time do.',
        hint: 'Real, curious questions work best: "Do you like this song?" "Does your job keep you busy?" "Did you sleep well?"',
        hintHi: 'Real, curious questions sabse achhe kaam karte hain: "Do you like this song?" "Does your job keep you busy?" "Did you sleep well?"',
      },
    ],

    keyTakeaways: [
      'Most yes/no questions start with do (I/you/we/they), does (he/she/it), or did (past, any subject).',
      'The main verb goes back to base form when "do/does/did" is used — "does she like," not "does she likes."',
      '"Be" and modal verbs (can, will, should) don\'t need "do" — they move to the front of the question themselves.',
      'Short answers ("Yes, I do." "No, she doesn\'t.") are the natural way to respond, not repeating the full sentence.',
      'Relying only on rising intonation ("You like tea?") works casually but isn\'t the standard structure expected in most situations.',
    ],
    keyTakeawaysHi: [
      'Zyadatar yes/no questions do (I/you/we/they), does (he/she/it), ya did (past, koi bhi subject) se start hote hain.',
      'Main verb base form mein wapas jaata hai jab "do/does/did" use hota hai — "does she like," "does she likes" nahi.',
      '"Be" aur modal verbs (can, will, should) ko "do" ki zaroorat nahi — wo khud question ke front mein move ho jaate hain.',
      'Short answers ("Yes, I do." "No, she doesn\'t.") respond karne ka natural tareeka hai, poora sentence repeat karna nahi.',
      'Sirf rising intonation pe rely karna ("You like tea?") casually kaam karta hai par zyadatar situations mein expected standard structure nahi hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-wh-questions-word-order',
    title: 'Wh-Questions — What, Where, When, Who, Why, How',
    titleHi: 'Wh-Questions — What, Where, When, Who, Why, How',
    description:
      '"Where you live?" vs. "Where do you live?" — the question word alone doesn\'t swap the sentence into question order; "do" is still needed underneath it.',
    descriptionHi:
      '"Where you live?" vs. "Where do you live?" — question word akela sentence ko question order mein swap nahi karta; "do" abhi bhi uske neeche chahiye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A wh-word is a label on a box, not a replacement for opening it correctly.** Putting "Where" at the front of a sentence is like sticking a label on a box — it tells you what\'s being asked about, but you still have to open the box (invert the verb with do/does/did or be) the normal way underneath.',
      hi: 'Ek wh-word ek box pe label hai, ek box ko sahi se kholne ka replacement nahi. "Where" ko sentence ke front mein rakhna ek box pe label chipkane jaisa hai — ye batata hai kis baare mein poocha ja raha hai, par tumhe phir bhi box ko normal tareeke se kholna padta hai (verb ko do/does/did ya be ke saath invert karna) uske neeche.',
    },

    simple: `**The six main question words:**

what · where · when · who · why · how

**A wh-question still needs the do/does/did (or be/modal) inversion
underneath it — the wh-word alone isn't enough:**

- "Where **do** you live?" (not "Where you live?")
- "What **does** she want?" (not "What she want?")
- "When **did** they arrive?" (not "When they arrived?")
- "Who **is** your teacher?" (be-verb, no "do" needed here)
- "Why **can't** you come?" (modal, no "do" needed here)

**The structure:**

Wh-word + do/does/did/be/modal + subject + base verb + ...?

**"How" combines with other words for more specific questions:**

"How much?" (quantity, uncountable) · "How many?" (quantity,
countable) · "How often?" (frequency) · "How long?" (duration)`,
    simpleHi: `**Chhe main question words:**

what · where · when · who · why · how

**Ek wh-question ko phir bhi apne neeche do/does/did (ya be/modal)
inversion chahiye — sirf wh-word kaafi nahi hai:**

- "Where **do** you live?" ("Where you live?" nahi)
- "What **does** she want?" ("What she want?" nahi)
- "When **did** they arrive?" ("When they arrived?" nahi)
- "Who **is** your teacher?" (be-verb, yahan "do" ki zaroorat nahi)
- "Why **can't** you come?" (modal, yahan "do" ki zaroorat nahi)

**Structure:**

Wh-word + do/does/did/be/modal + subject + base verb + ...?

**"How" doosre words ke saath combine hota hai zyada specific
questions ke liye:**

"How much?" (quantity, uncountable) · "How many?" (quantity,
countable) · "How often?" (frequency) · "How long?" (duration)`,

    content: `**Why "Where you live?" feels natural but isn't the standard form.**

Hindi forms a wh-question by simply placing the question word where
the answer would go, with almost no other change to word order:
"tum kahan rehte ho" (you where live) becomes "tum kahan rehte ho?"
with the same structure, question word inserted directly. English
requires an additional step — inverting the subject and helping verb —
that Hindi's structure doesn't ask for, which is exactly why the
inversion is easy to skip when translating in your head.

**The wh-word replaces the answer's position, but the rest of the
sentence still needs the yes/no-question machinery from the previous
lesson.** Think of it as building a yes/no question first ("Do you
live in Delhi?") and then swapping the specific piece being asked
about with the wh-word, moved to the front ("Where do you live?").
This two-step mental process is a genuinely reliable way to build any
wh-question correctly.

**"Who" is a partial exception worth knowing about.** When "who" is
the SUBJECT of the question (asking about the person doing the
action), no "do" is needed at all: "Who called you?" (not "Who did
call you?"). But when "who" is the OBJECT (asking about the person the
action happens to), the normal "do" rule applies: "Who did you call?"

**"How" plus another word creates an entire family of precise,
commonly needed questions** — "how much does it cost," "how many
people are coming," "how often do you exercise," "how long does it
take" — each combination worth practicing as its own fixed phrase
rather than reconstructing from scratch every time.`,
    contentHi: `**"Where you live?" natural kyun feel karta hai par standard form nahi hai.**

Hindi ek wh-question ko simply question word ko wahan rakh kar banati
hai jahan answer jaata, almost koi doosra word order change ke bina:
"tum kahan rehte ho" "tum kahan rehte ho?" ban jaata hai same
structure ke saath, question word directly insert kiya gaya. English
ko ek additional step chahiye — subject aur helping verb ko invert
karna — jo Hindi ka structure nahi maangta, jo exactly wo reason hai
ki inversion apne mind mein translate karte waqt skip karna aasan hai.

**Wh-word answer ki position replace karta hai, par sentence ke baaki
hisse ko phir bhi previous lesson ki yes/no-question machinery chahiye.**
Ise ek two-step mental process ki tarah socho: pehle ek yes/no question
banao ("Do you live in Delhi?") aur phir jispe poocha ja raha hai us
specific piece ko wh-word se swap karo, front mein move karte hue
("Where do you live?"). Ye genuinely reliable tareeka hai koi bhi
wh-question sahi se banane ka.

**"Who" ek partial exception hai janne layak.** Jab "who" question ka
SUBJECT hota hai (action karne wale person ke baare mein poochna), koi
"do" bilkul zaroorat nahi hoti: "Who called you?" ("Who did call you?"
nahi). Par jab "who" OBJECT hota hai (us person ke baare mein poochna
jise action hota hai), normal "do" rule apply hota hai: "Who did you
call?"

**"How" plus ek doosra word ek poori family banata hai precise,
commonly needed questions ki** — "how much does it cost," "how many
people are coming," "how often do you exercise," "how long does it
take" — har combination apne own fixed phrase ki tarah practice karne
layak hai, har baar scratch se reconstruct karne ke bajaye.`,

    readingPassage: `Let me ask you a few questions. Where do you live? What do you do for work? How often do you exercise? Who is your best friend? Why do you like your job? These questions help me get to know you better.`,
    readingPassageHi: `Main tumse kuch questions poochta hoon. Where do you live? What do you do for work? How often do you exercise? Who is your best friend? Why do you like your job? Ye questions mujhe tumhe better janne mein help karte hain.`,

    vocabulary: [
      {
        word: 'get to know',
        wordHi: 'get to know (jaanna/pehchanna)',
        meaning: 'to gradually learn about a person',
        meaningHi: 'ek person ke baare mein gradually seekhna',
        example: "I'd like to get to know you better.",
        exampleHi: "I'd like to get to know you better.",
        pronunciation: 'get too noh',
      },
      {
        word: 'quantity',
        wordHi: 'quantity (matra)',
        meaning: 'an amount of something',
        meaningHi: 'kisi cheez ki matra',
        example: 'What quantity of rice do you need?',
        exampleHi: 'What quantity of rice do you need?',
        pronunciation: 'KWAN-tih-tee',
      },
      {
        word: 'frequency',
        wordHi: 'frequency (aavritti)',
        meaning: 'how often something happens',
        meaningHi: 'koi cheez kitni baar hoti hai',
        example: 'What frequency do you check your email at?',
        exampleHi: 'What frequency do you check your email at?',
        pronunciation: 'FREE-kwen-see',
      },
      {
        word: 'duration',
        wordHi: 'duration (avadhi)',
        meaning: 'how long something lasts',
        meaningHi: 'koi cheez kitni der chalti hai',
        example: 'What is the duration of the flight?',
        exampleHi: 'What is the duration of the flight?',
        pronunciation: 'doo-REY-shun',
      },
    ],

    examples: [
      {
        title: 'Building a wh-question in two steps',
        titleHi: 'Ek wh-question do steps mein banana',
        code: `Step 1 (yes/no question): Do you work in Mumbai?
Step 2 (swap the piece being asked about with a wh-word): Where do you work?`,
        output: 'The same "do" inversion, just with the answer\'s position replaced by "where".',
        explain:
          'This two-step method works for almost any wh-question: build the yes/no version first, then swap in the wh-word for whatever you actually want to know.',
        explainHi:
          'Ye two-step method almost kisi bhi wh-question ke liye kaam karta hai: pehle yes/no version banao, phir jo tum actually jaanna chahte ho uske liye wh-word swap karo.',
      },
      {
        title: '"Who" as subject vs. object',
        titleHi: '"Who" subject vs. object ki tarah',
        code: `Who called you? (who = subject, no "do" needed)
Who did you call? (who = object, "do" needed)`,
        output: 'Same word "who", genuinely different structure depending on its role.',
        explain:
          'Ask yourself: is "who" doing the action, or receiving it? "Who called you" — who did the calling. "Who did you call" — who received the call. That distinction decides whether "do" appears.',
        explainHi:
          'Apne aap se poocho: kya "who" action kar raha hai, ya receive kar raha hai? "Who called you" — who ne calling ki. "Who did you call" — who ne call receive ki. Wo distinction decide karta hai ki "do" appear karega ya nahi.',
      },
    ],

    mistakes: [
      {
        wrong: '"Where you live?" / "What she wants?"',
        right: '"Where do you live?" / "What does she want?"',
        why: 'The wh-word alone doesn\'t create question word order — the do/does/did inversion is still required underneath it, exactly as it would be in a plain yes/no question.',
        whyHi: 'Sirf wh-word question word order create nahi karta — do/does/did inversion phir bhi uske neeche required hai, exactly jaise ek plain yes/no question mein hota.',
      },
      {
        wrong: '"Who did call you?" (adding "do" when "who" is the subject)',
        right: '"Who called you?"',
        why: 'When "who" itself is doing the action (the subject of the sentence), no "do" is inserted — this is the one wh-question type that skips the usual inversion entirely.',
        whyHi: 'Jab "who" khud action kar raha hai (sentence ka subject), koi "do" insert nahi hota — ye ek wh-question type hai jo usual inversion ko poori tarah skip karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Interviews of any kind — a job interview, meeting someone new, or interviewing a candidate yourself** — are built almost entirely on wh-questions: what, where, when, why, how.',
        hi: '**Kisi bhi tarah ke interviews — ek job interview, kisi naye se milna, ya khud ek candidate ko interview karna** — almost poori tarah wh-questions pe bane hain: what, where, when, why, how.',
      },
      {
        en: '**Troubleshooting a problem at work** ("What went wrong?", "Why did this happen?", "How long will the fix take?") depends entirely on forming wh-questions cleanly and quickly.',
        hi: '**Kaam pe ek problem troubleshoot karna** ("What went wrong?", "Why did this happen?", "How long will the fix take?") poori tarah wh-questions ko cleanly aur quickly banane pe depend karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why doesn\'t "Who is your teacher?" need "do"?',
        qHi: '"Who is your teacher?" ko "do" ki zaroorat kyun nahi hoti?',
        a: 'Because the main verb here is "is" (a form of "be"), and "be" moves to the front of a question by itself, exactly like in yes/no questions — "do" is never needed alongside "be."',
        aHi: 'Kyunki yahan main verb "is" hai ("be" ka ek form), aur "be" khud question ke front mein move hota hai, exactly jaise yes/no questions mein — "do" kabhi "be" ke saath zaroorat nahi hota.',
      },
      {
        q: 'Is there a quick way to know if "who" needs "do" or not?',
        qHi: 'Kya koi quick tareeka hai janne ka ki "who" ko "do" chahiye ya nahi?',
        a: 'Try answering your own question with "who" replaced by a name in that exact spot. "Who called you?" → "Raj called you" (who = subject, no do). "Who did you call?" → "You called Raj" (who = object, needs do). If the name fits where "who" started the sentence, skip "do."',
        aHi: 'Apne khud ke question ko answer karne ki koshish karo "who" ko us exact spot pe ek naam se replace karke. "Who called you?" → "Raj called you" (who = subject, do nahi). "Who did you call?" → "You called Raj" (who = object, do chahiye). Agar naam wahan fit hota hai jahan "who" ne sentence start kiya, "do" skip karo.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, turn these into correct wh-questions: "You work ___ (where)." "She wants ___ (what)." "They left ___ (when)."',
        taskHi: 'Zor se, inhe correct wh-questions mein badlo: "You work ___ (where)." "She wants ___ (what)." "They left ___ (when)."',
        hint: '"Where do you work?" "What does she want?" "When did they leave?"',
        hintHi: '"Where do you work?" "What does she want?" "When did they leave?"',
      },
      {
        task: 'Out loud, ask five real wh-questions to someone (or imagine asking them): one each with what, where, when, why, and how.',
        taskHi: 'Zor se, kisi se paanch real wh-questions poocho (ya imagine karo unse poochna): ek-ek what, where, when, why, aur how ke saath.',
        hint: 'Use the two-step method: build the yes/no version in your head first, then swap in the wh-word.',
        hintHi: 'Two-step method use karo: pehle apne mind mein yes/no version banao, phir wh-word swap karo.',
      },
    ],

    keyTakeaways: [
      'A wh-word (what, where, when, who, why, how) still needs the do/does/did (or be/modal) inversion underneath it.',
      'Build a wh-question in two steps: form the yes/no version first, then swap in the wh-word for what\'s being asked about.',
      'When "who" is the subject (doing the action), no "do" is needed: "Who called you?" not "Who did call you?"',
      'When "who" is the object (receiving the action), "do" is needed as usual: "Who did you call?"',
      '"How" combines with other words for precise questions: how much, how many, how often, how long.',
    ],
    keyTakeawaysHi: [
      'Ek wh-word (what, where, when, who, why, how) ko phir bhi apne neeche do/does/did (ya be/modal) inversion chahiye.',
      'Ek wh-question do steps mein banao: pehle yes/no version banao, phir jispe poocha ja raha hai uske liye wh-word swap karo.',
      'Jab "who" subject hai (action kar raha hai), koi "do" zaroorat nahi: "Who called you?" "Who did call you?" nahi.',
      'Jab "who" object hai (action receive kar raha hai), "do" usual ki tarah zaroorat hai: "Who did you call?"',
      '"How" doosre words ke saath combine hota hai precise questions ke liye: how much, how many, how often, how long.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-softer-natural-questions',
    title: 'Softer, More Natural Ways to Ask',
    titleHi: 'Poochne Ke Softer, Zyada Natural Tareeke',
    description:
      'Turning "What is your name?" into "Could you tell me your name?" — the polite framing that makes a direct question feel like conversation, not interrogation.',
    descriptionHi:
      '"What is your name?" ko "Could you tell me your name?" mein badalna — wo polite framing jo ek direct question ko conversation jaisa feel karati hai, interrogation jaisa nahi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A direct question is a knock on the door; a softened question is the same knock with a smile attached.** "Where is the station?" gets the same information as "Could you tell me where the station is?" — the second version just knocks more gently, especially useful with a stranger or in a formal setting.',
      hi: 'Ek direct question ek door pe knock hai; ek softened question wahi knock hai jiske saath ek smile attached hai. "Where is the station?" wahi information paata hai jo "Could you tell me where the station is?" — doosra version bas zyada gently knock karta hai, especially useful ek stranger ke saath ya ek formal setting mein.',
    },

    simple: `**Direct wh-questions are completely fine, especially with people
you know:**

"What time is it?" · "Where do you live?" · "Why did you leave early?"

**But softer framings feel more polite, especially with strangers, in
formal settings, or for a sensitive topic:**

- "Could you tell me what time it is?"
- "Do you know where the station is?"
- "I was wondering why you left early." (a statement, not even a
  question in form, but functions as one)

**A genuinely useful, tricky detail: after a softening phrase, word
order goes back to NORMAL statement order, not question order:**

"Where is the station?" → "Do you know **where the station is**?"
(not "where is the station")

**Common softening starters:**

"Could you tell me...?" · "Do you know...?" · "I was wondering...?" ·
"Would you mind telling me...?"`,
    simpleHi: `**Direct wh-questions completely fine hain, especially un logon ke saath jinhe tum jaante ho:**

"What time is it?" · "Where do you live?" · "Why did you leave early?"

**Par softer framings zyada polite feel karte hain, especially
strangers ke saath, formal settings mein, ya ek sensitive topic ke
liye:**

- "Could you tell me what time it is?"
- "Do you know where the station is?"
- "I was wondering why you left early." (ek statement, question form
  mein bhi nahi, par ek ki tarah function karta hai)

**Ek genuinely useful, tricky detail: ek softening phrase ke baad,
word order NORMAL statement order mein wapas jaata hai, question order
mein nahi:**

"Where is the station?" → "Do you know **where the station is**?"
("where is the station" nahi)

**Common softening starters:**

"Could you tell me...?" · "Do you know...?" · "I was wondering...?" ·
"Would you mind telling me...?"`,

    content: `**Why softening a question changes the internal word order —
this genuinely surprises many learners at first.**

Once a wh-question is embedded inside a larger sentence ("Do you know
where the station is?"), it stops behaving like a standalone question
grammatically and starts behaving like a regular statement clause,
even though the whole sentence is still, functionally, a question. The
inverted order ("where is the station") only exists for a standalone
question; embedded inside another sentence, it reverts to normal
subject-verb order ("where the station is").

**This softening isn't about grammar correctness — the direct version
was never wrong.** It's entirely about social register: a stranger on
the street, a customer service call, or a formal email all tend to
feel more comfortable being asked something with a small polite frame
around it, rather than a bare, direct question, even though both
versions ask for exactly the same information.

**"I was wondering..." is a genuinely interesting case: it's a
statement in form, but a question in function.** "I was wondering if
you could help me" never uses question word order or a question mark
in strict grammar, yet everyone understands it as a request — this is
a real, natural pattern worth recognizing both when you hear it and
when you want to sound gently indirect yourself.

**Knowing when NOT to soften matters just as much as knowing how.**
With close friends, family, or in a fast-moving work conversation,
consistently over-softening every question ("Would you possibly be
able to tell me, if it's not too much trouble, what time it is?") can
sound stiff or even slightly insincere. Reserve the softer forms for
genuinely appropriate moments — strangers, formal writing, or a
sensitive topic — and use direct questions everywhere else.`,
    contentHi: `**Ek question ko soften karna internal word order kyun change karta hai —
ye genuinely kayi learners ko pehle surprise karta hai.**

Ek baar ek wh-question ek badi sentence ke andar embed ho jaata hai
("Do you know where the station is?"), ye grammatically ek standalone
question ki tarah behave karna band kar deta hai aur ek regular
statement clause ki tarah behave karna start kar deta hai, chahe poora
sentence abhi bhi, functionally, ek question ho. Inverted order ("where
is the station") sirf ek standalone question ke liye exist karta hai;
ek doosre sentence ke andar embed hone pe, ye normal subject-verb order
mein wapas chala jaata hai ("where the station is").

**Ye softening grammar correctness ke baare mein nahi hai — direct
version kabhi galat nahi tha.** Ye poori tarah social register ke
baare mein hai: sadak pe ek stranger, ek customer service call, ya ek
formal email sab thodi si polite frame ke saath kuch poochhe jaane mein
zyada comfortable feel karte hain, ek bare, direct question se, chahe
dono versions exactly same information maangte hon.

**"I was wondering..." ek genuinely interesting case hai: ye form mein
ek statement hai, par function mein ek question.** "I was wondering if
you could help me" kabhi strict grammar mein question word order ya
question mark use nahi karta, phir bhi sab ise ek request ki tarah
samajhte hain — ye ek real, natural pattern hai jise recognize karna
zaroori hai jab tum ise suno aur jab tum khud gently indirect sound
karna chaho.

**Kab NOT soften karna hai janna utna hi zaroori hai jitna kaise
soften karna hai janna.** Close friends, family, ya ek fast-moving work
conversation ke saath, consistently har question ko over-soften karna
("Would you possibly be able to tell me, if it's not too much trouble,
what time it is?") stiff ya even thoda insincere sound kar sakta hai.
Softer forms ko genuinely appropriate moments ke liye reserve karo —
strangers, formal writing, ya ek sensitive topic — aur baaki har jagah
direct questions use karo.`,

    readingPassage: `Excuse me, could you tell me where the nearest bus stop is? I'm new to this area, and I was wondering how far it is from here. Also, do you know what time the buses usually run? Thank you so much for your help.`,
    readingPassageHi: `Excuse me, could you tell me where the nearest bus stop is? Main is area mein naya hoon, aur I was wondering ye yahan se kitni door hai. Also, do you know what time the buses usually run? Tumhari help ke liye bahut bahut shukriya.`,

    vocabulary: [
      {
        word: 'wonder',
        wordHi: 'wonder (sochna/jaanna chahna)',
        meaning: 'to want to know something, expressed gently',
        meaningHi: 'kuch jaanna chahna, gently express kiya gaya',
        example: "I was wondering if you're free later.",
        exampleHi: "I was wondering if you're free later.",
        pronunciation: 'WUN-der',
      },
      {
        word: 'mind (would you mind...)',
        wordHi: 'mind (bura maanna)',
        meaning: 'used in a polite request to ask if something bothers someone',
        meaningHi: 'ek polite request mein use hota hai poochne ke liye ki kya kuch kisi ko bother karta hai',
        example: 'Would you mind closing the window?',
        exampleHi: 'Would you mind closing the window?',
        pronunciation: 'mynd',
      },
      {
        word: 'nearest',
        wordHi: 'nearest (sabse kareeb)',
        meaning: 'closest in distance',
        meaningHi: 'distance mein sabse close',
        example: "Where's the nearest pharmacy?",
        exampleHi: "Where's the nearest pharmacy?",
        pronunciation: 'NEER-ist',
      },
      {
        word: 'appreciate',
        wordHi: 'appreciate (sarahna/aabhari hona)',
        meaning: 'to be genuinely grateful for something',
        meaningHi: 'kisi cheez ke liye genuinely grateful hona',
        example: "I'd really appreciate your help.",
        exampleHi: "I'd really appreciate your help.",
        pronunciation: 'uh-PREE-shee-eyt',
      },
    ],

    examples: [
      {
        title: 'Softening a direct question for a stranger',
        titleHi: 'Ek stranger ke liye ek direct question ko soften karna',
        code: `Direct: Where is the train station?
Softer: Excuse me, could you tell me where the train station is?`,
        output: 'Same information requested, gentler framing, normal word order inside.',
        explain:
          'Notice "where the train station is" — not "where is the train station" — once the question is embedded inside "could you tell me," the internal word order reverts to normal statement order.',
        explainHi:
          'Notice karo "where the train station is" — "where is the train station" nahi — ek baar question "could you tell me" ke andar embed ho jaata hai, internal word order normal statement order mein wapas chala jaata hai.',
      },
      {
        title: '"I was wondering" as an indirect request',
        titleHi: '"I was wondering" ek indirect request ki tarah',
        code: `I was wondering if you could help me move this table.`,
        output: 'A statement in grammatical form, understood as a polite request.',
        explain:
          'This sentence has no question mark and no inverted word order at all, yet every native speaker understands it as a genuine, polite request for help — a completely natural pattern worth recognizing.',
        explainHi:
          'Is sentence mein koi question mark nahi hai aur koi inverted word order bilkul nahi hai, phir bhi har native speaker ise ek genuine, polite help ki request ki tarah samajhta hai — ek completely natural pattern jise recognize karna zaroori hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"Could you tell me where is the station?" (keeping inverted question order after the softening phrase)',
        right: '"Could you tell me where the station is?"',
        why: 'Once a wh-question is embedded inside another sentence like "could you tell me," the word order goes back to normal (subject before verb) — the inversion only applies to a standalone question.',
        whyHi: 'Ek baar ek wh-question doosre sentence ke andar embed hota hai jaise "could you tell me," word order normal mein wapas chala jaata hai (subject verb se pehle) — inversion sirf ek standalone question pe apply hota hai.',
      },
      {
        wrong: 'Over-softening every single question, even with close friends: "Would you possibly be able to tell me what time it is?"',
        right: 'With close friends and family, a direct question is completely natural: "What time is it?"',
        why: 'Constant over-softening in casual relationships can sound stiff, distant, or even slightly insincere — softening is a tool for specific situations (strangers, formal settings), not a rule to apply everywhere.',
        whyHi: 'Casual relationships mein constant over-softening stiff, distant, ya even thoda insincere sound kar sakta hai — softening specific situations ke liye ek tool hai (strangers, formal settings), har jagah apply karne ka rule nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Asking a stranger for directions, help, or information** — exactly the situation this lesson\'s reading passage models — almost always benefits from a softer framing like "Could you tell me...?" or "Do you know...?"',
        hi: '**Ek stranger se directions, help, ya information poochna** — exactly wo situation jo is lesson ka reading passage model karta hai — almost hamesha ek softer framing se benefit hota hai jaise "Could you tell me...?" ya "Do you know...?"',
      },
      {
        en: '**Customer service calls and formal emails** rely heavily on softened questions ("I was wondering if you could clarify...", "Would it be possible to know...") to stay professional and polite.',
        hi: '**Customer service calls aur formal emails** heavily softened questions pe rely karte hain ("I was wondering if you could clarify...", "Would it be possible to know...") professional aur polite rehne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: "Is it rude to just ask a direct question, like \"Where's the bathroom?\", without softening it?",
        qHi: "Kya sirf ek direct question poochna rude hai, jaise \"Where's the bathroom?\", use soften kiye bina?",
        a: 'Not at all for a short, practical question like that — direct questions are completely normal and expected in most everyday situations. Softening becomes more valuable for longer requests, sensitive topics, or genuinely formal contexts, not every single question you ask.',
        aHi: 'Bilkul nahi ek short, practical question ke liye jaisa ye — direct questions zyadatar everyday situations mein completely normal aur expected hain. Softening zyada valuable ban jaata hai lambe requests, sensitive topics, ya genuinely formal contexts ke liye, har single question ke liye nahi jo tum poochte ho.',
      },
      {
        q: 'Can "I was wondering" be used for something other than a request for help?',
        qHi: 'Kya "I was wondering" ek help ki request ke alawa kisi aur cheez ke liye use ho sakta hai?',
        a: 'Yes — it also softens a curious question about someone\'s opinion or plans: "I was wondering what you thought of the movie" or "I was wondering if you have any plans this weekend." It works anywhere a direct question might feel slightly too forward.',
        aHi: 'Haan — ye kisi ki opinion ya plans ke baare mein ek curious question ko bhi soften karta hai: "I was wondering what you thought of the movie" ya "I was wondering if you have any plans this weekend." Ye kahin bhi kaam karta hai jahan ek direct question thoda too forward feel ho sakta hai.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, soften these three direct questions using "Could you tell me...?": "What time does the shop close?" "Where is the nearest ATM?" "How much does this cost?"',
        taskHi: 'Zor se, in teen direct questions ko soften karo "Could you tell me...?" use karke: "What time does the shop close?" "Where is the nearest ATM?" "How much does this cost?"',
        hint: 'Remember: word order goes back to normal inside the softened version. "Could you tell me what time the shop closes?"',
        hintHi: 'Yaad rakho: word order softened version ke andar normal mein wapas jaata hai. "Could you tell me what time the shop closes?"',
      },
      {
        task: 'Out loud, make a polite request using "I was wondering if..." for something you\'d genuinely like to ask someone this week.',
        taskHi: 'Zor se, ek polite request banao "I was wondering if..." use karke kisi aisi cheez ke liye jo tum genuinely is hafte kisi se poochna chahte ho.',
        hint: '"I was wondering if you could help me with..." or "I was wondering if you\'d like to..."',
        hintHi: '"I was wondering if you could help me with..." or "I was wondering if you\'d like to..."',
      },
    ],

    keyTakeaways: [
      'Direct wh-questions are completely fine, especially with people you know well.',
      'Softer framings ("Could you tell me...?", "Do you know...?") feel more polite with strangers, in formal settings, or for sensitive topics.',
      'Once a wh-question is embedded inside a softening phrase, its word order reverts to normal statement order — "where the station is," not "where is the station."',
      '"I was wondering if..." is grammatically a statement but functions as a genuine, polite request.',
      'Over-softening every question in casual relationships can sound stiff — reserve softer forms for genuinely appropriate moments.',
    ],
    keyTakeawaysHi: [
      'Direct wh-questions completely fine hain, especially un logon ke saath jinhe tum achhe se jaante ho.',
      'Softer framings ("Could you tell me...?", "Do you know...?") strangers ke saath, formal settings mein, ya sensitive topics ke liye zyada polite feel karte hain.',
      'Ek baar ek wh-question ek softening phrase ke andar embed hota hai, uska word order normal statement order mein revert hota hai — "where the station is," "where is the station" nahi.',
      '"I was wondering if..." grammatically ek statement hai par ek genuine, polite request ki tarah function karta hai.',
      'Casual relationships mein har question ko over-soften karna stiff sound kar sakta hai — softer forms ko genuinely appropriate moments ke liye reserve karo.',
    ],
  },
];
