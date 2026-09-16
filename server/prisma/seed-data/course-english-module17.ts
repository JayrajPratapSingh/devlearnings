/**
 * English Speaking Complete Course — Module 17: Reported Speech &
 * Storytelling, lessons 1-3.
 *
 * Lesson 1: Reported speech's tense-shift rule — "I am" becomes "she
 *           said she was," and why the shift happens at all.
 * Lesson 2: Reporting questions and requests — the word-order reversal
 *           that reported questions require.
 * Lesson 3: Narrating a real event with dialogue — combining reported
 *           speech with this course's earlier past-tense storytelling
 *           skill (Module 4) for a genuinely complete story.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_17: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-reported-speech-tense-shift',
    title: 'Reported Speech — "I Am" Becomes "She Said She Was"',
    titleHi: 'Reported Speech — "I Am" "She Said She Was" Ban Jaata Hai',
    description:
      'When you report what someone else said, the tense itself shifts back one step — a real, learnable rule, not a random change.',
    descriptionHi:
      'Jab tum report karte ho kisi aur ne kya kaha, tense khud ek step peeche shift ho jaata hai — ek real, learnable rule hai, koi random change nahi.',
    difficulty: 'HARD',
    duration: 25,
    order: 1,

    analogy: {
      en: '**Reporting someone\'s words later is like describing a photo of a moment that has already passed — everything in the description shifts slightly into the past, even things that were "now" when the photo was taken.** "I am happy," said in the moment, becomes "she said she was happy" when you describe it afterward, because the "now" of her sentence is no longer "now" for you.',
      hi: 'Baad mein kisi ke words report karna ek photo describe karne jaisa hai ek moment ka jo already guzar chuka hai — description mein sab kuch thoda past mein shift ho jaata hai, un cheezon ke liye bhi jo "now" thi jab photo li gayi. "I am happy," moment mein bola gaya, "she said she was happy" ban jaata hai jab tum ise baad mein describe karte ho, kyunki uske sentence ka "now" tumhare liye ab "now" nahi raha.',
    },

    simple: `**Reported speech shifts the tense back one step from the original
words:**

- Present → past: "I **am** tired" → She said she **was** tired.
- Present continuous → past continuous: "I **am working**" → He said
  he **was working**.
- Past → past perfect: "I **finished** it" → She said she **had
  finished** it.
- "Will" → "would": "I **will** call you" → He said he **would** call
  me.

**Pronouns also shift to match the new speaker's perspective:**

Original: "**I** am tired." → Reported: She said **she** was tired.

**Time and place words often shift too:**

"today" → "that day" · "tomorrow" → "the next day" · "here" → "there"

**One genuine exception**: if the original statement is still true
right now, or describes a general fact, the tense often does NOT need
to shift: "She said the sun **rises** in the east" (still true, no
shift needed).`,
    simpleHi: `**Reported speech tense ko original words se ek step peeche shift karta hai:**

- Present → past: "I **am** tired" → She said she **was** tired.
- Present continuous → past continuous: "I **am working**" → He said
  he **was working**.
- Past → past perfect: "I **finished** it" → She said she **had
  finished** it.
- "Will" → "would": "I **will** call you" → He said he **would** call
  me.

**Pronouns bhi shift hote hain naye speaker ke perspective ko match
karne ke liye:**

Original: "**I** am tired." → Reported: She said **she** was tired.

**Time aur place words bhi often shift hote hain:**

"today" → "that day" · "tomorrow" → "the next day" · "here" → "there"

**Ek genuine exception**: agar original statement abhi bhi true hai,
ya ek general fact describe karta hai, tense often shift karne ki
zaroorat NAHI hoti: "She said the sun **rises** in the east" (abhi
bhi true, koi shift zaroorat nahi).`,

    content: `**Why the tense genuinely shifts back — this isn't an arbitrary
grammar rule, it reflects something real about time.**

When someone says "I am tired" right now, "am" is accurate at that
exact moment. When you later tell someone else about it — "she said
she was tired" — that moment is no longer now; it's in the past
relative to your current conversation. The tense shift reflects this
real change in temporal perspective: the words move from her "now" to
your "then," and English marks that shift explicitly in the verb.

**Pronoun shifts follow the same logic of changing perspective, not a
separate rule to memorize.** When Priya says "I am tired," she is
"I." When you report her words, she becomes "she" from your
perspective — the pronoun shift isn't really about grammar rules, it's
simply describing the same fact (her tiredness) from a different
person's point of view.

**The "still true" exception exists because the tense shift's whole
purpose is marking a change in temporal perspective — and if nothing
has actually changed, there's nothing to mark.** "She said she loves
coffee" (rather than "loved") is common when the fact is presumably
still true; using "was tired" for a general truth like "the sun rises
in the east" would actually sound strange, since that fact hasn't
moved into the past at all.

**In casual, spoken English, native speakers don't always shift the
tense perfectly, especially when reporting something said just
moments ago.** "She said she's coming" (no full shift) is genuinely
common in relaxed conversation. The full, careful shift matters more
in writing, more formal speech, or when real time has passed since the
original statement — worth knowing both the strict rule and this
common, casual flexibility.`,
    contentHi: `**Tense genuinely peeche kyun shift karta hai — ye ek arbitrary grammar rule nahi hai, ye time ke baare mein kuch real reflect karta hai.**

Jab koi abhi "I am tired" kehta hai, "am" us exact moment pe accurate
hai. Jab tum baad mein kisi aur ko iske baare mein batate ho — "she
said she was tired" — wo moment ab now nahi hai; ye tumhari current
conversation ke relative past mein hai. Tense shift is real change ko
temporal perspective mein reflect karta hai: words uski "now" se
tumhari "then" mein move hote hain, aur English us shift ko verb mein
explicitly mark karti hai.

**Pronoun shifts same logic follow karte hain changing perspective ka,
ek separate rule memorize karne ka nahi.** Jab Priya kehti hai "I am
tired," wo "I" hai. Jab tum uske words report karte ho, wo "she" ban
jaati hai tumhare perspective se — pronoun shift really grammar rules
ke baare mein nahi hai, ye simply same fact (uski tiredness) ko ek
different person ke point of view se describe kar raha hai.

**"Still true" exception exist karta hai kyunki tense shift ka poora
purpose temporal perspective mein ek change mark karna hai — aur agar
actually kuch change nahi hua, mark karne ke liye kuch nahi hai.**
"She said she loves coffee" ("loved" ke bajaye) common hai jab fact
presumably abhi bhi true hai; "was tired" use karna ek general truth
ke liye jaise "the sun rises in the east" actually strange sound
karega, kyunki wo fact bilkul past mein move nahi hua hai.

**Casual, spoken English mein, native speakers hamesha tense ko
perfectly shift nahi karte, especially jab kuch report kar rahe hon
jo abhi kuch moments pehle kaha gaya.** "She said she's coming" (koi
full shift nahi) genuinely common hai relaxed conversation mein. Full,
careful shift zyada matter karta hai writing mein, zyada formal speech
mein, ya jab original statement ke baad real time guzar chuka ho —
dono strict rule aur ye common, casual flexibility janne layak hai.`,

    readingPassage: `My friend called me yesterday. She said she was having a hard week and needed some advice. She told me she had finished her project early, but her manager wasn't happy with it. I said I would help her fix it. She said she would call me back the next day.`,
    readingPassageHi: `Meri friend ne kal mujhe call kiya. She said she was having a hard week and needed some advice. Usne mujhe bataya ki usne apna project early khatam kar liya tha, but her manager wasn't happy with it. I said I would help her fix it. She said she would call me back the next day.`,

    vocabulary: [
      {
        word: 'reported speech',
        wordHi: 'reported speech (parokshit kathan)',
        meaning: 'describing what someone else said, rather than quoting their exact words',
        meaningHi: 'describe karna kisi aur ne kya kaha, unke exact words quote karne ke bajaye',
        example: 'In reported speech, "I am happy" becomes "she said she was happy."',
        exampleHi: 'In reported speech, "I am happy" becomes "she said she was happy."',
        pronunciation: 'ri-POR-tid speech',
      },
      {
        word: 'perspective',
        wordHi: 'perspective (drishtikon)',
        meaning: 'a particular point of view',
        meaningHi: 'ek particular point of view',
        example: 'From her perspective, the plan made sense.',
        exampleHi: 'From her perspective, the plan made sense.',
        pronunciation: 'per-SPEK-tiv',
      },
      {
        word: 'presumably',
        wordHi: 'presumably (sambhavatah)',
        meaning: 'assumed to be true, based on reasonable evidence',
        meaningHi: 'true maana gaya, reasonable evidence ke based pe',
        example: 'Presumably, she still likes tea, since she always has.',
        exampleHi: 'Presumably, she still likes tea, since she always has.',
        pronunciation: 'pri-ZOO-muh-blee',
      },
      {
        word: 'temporal',
        wordHi: 'temporal (samaya sambandhi)',
        meaning: 'relating to time',
        meaningHi: 'time se related',
        example: 'The tense shift reflects a temporal change in perspective.',
        exampleHi: 'The tense shift reflects a temporal change in perspective.',
        pronunciation: 'TEM-per-uhl',
      },
    ],

    examples: [
      {
        title: 'Direct speech vs. reported speech, tense shifted',
        titleHi: 'Direct speech vs. reported speech, tense shifted',
        code: `Direct: "I am learning English," she said.
Reported: She said she was learning English.

Direct: "I will call you tomorrow," he said.
Reported: He said he would call me the next day.`,
        output: 'Both the verb tense and the time word ("tomorrow" → "the next day") shift together.',
        explain:
          'Notice both the tense AND the time reference shift in the same direction — both changes reflect the same underlying idea: this was said at an earlier point in time, from a different "now."',
        explainHi:
          'Notice karo tense AUR time reference dono same direction mein shift karte hain — dono changes same underlying idea reflect karte hain: ye ek earlier point in time pe kaha gaya tha, ek different "now" se.',
      },
      {
        title: 'The "still true" exception',
        titleHi: '"Still true" exception',
        code: `Direct: "I love spicy food," she said.
Reported (still true): She said she loves spicy food.`,
        output: 'No tense shift, because the fact is presumably still true right now.',
        explain:
          'Shifting to "loved" here would suggest she no longer loves spicy food — keeping "loves" correctly signals this is still an accurate, ongoing fact.',
        explainHi:
          'Yahan "loved" mein shift karna suggest karega ki wo ab spicy food pasand nahi karti — "loves" rakhna correctly signal karta hai ki ye abhi bhi ek accurate, ongoing fact hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"She said she loved coffee" for someone who almost certainly still loves coffee (a general, ongoing preference)',
        right: '"She said she loves coffee." (no shift needed, since it\'s presumably still true)',
        why: 'Shifting the tense of a fact that\'s still true implies it might no longer be the case — the "still true" exception exists precisely to avoid this false implication.',
        whyHi: 'Ek fact ka tense shift karna jo abhi bhi true hai imply karta hai ki ye ab case nahi ho sakta — "still true" exception exist karta hai precisely is false implication ko avoid karne ke liye.',
      },
      {
        wrong: '"He said I am coming" (forgetting to shift the pronoun to match the new perspective)',
        right: '"He said he was coming."',
        why: 'Pronouns need to shift along with tense to reflect whose perspective is now speaking — "I" in his original sentence becomes "he" when you report it from your own point of view.',
        whyHi: 'Pronouns ko tense ke saath shift karna zaroori hai ye reflect karne ke liye ki ab kiska perspective bol raha hai — uske original sentence mein "I" "he" ban jaata hai jab tum ise apne khud ke point of view se report karte ho.',
      },
    ],

    realWorld: [
      {
        en: '**Relaying a message from one person to another** ("She said she\'d be late," "He told me he needed the report by Friday") is one of the most frequent everyday uses of reported speech.',
        hi: '**Ek person ka message doosre tak relay karna** ("She said she\'d be late," "He told me he needed the report by Friday") reported speech ke sabse frequent everyday uses mein se ek hai.',
      },
      {
        en: '**Summarizing a conversation or meeting for someone who missed it** relies almost entirely on reported speech to accurately convey what was said without quoting every exact word.',
        hi: '**Kisi ke liye ek conversation ya meeting summarize karna jo isse miss kiya** almost poori tarah reported speech pe rely karta hai accurately convey karne ke liye kya kaha gaya, har exact word quote kiye bina.',
      },
    ],

    interviewQA: [
      {
        q: "Do I really need to shift the tense perfectly every time in casual conversation?",
        qHi: "Kya mujhe casual conversation mein har baar perfectly tense shift karna genuinely zaroori hai?",
        a: "In relaxed, spoken English, especially reporting something said very recently, native speakers often skip the full shift (\"she said she's coming\" instead of \"she said she was coming\") — it's genuinely common and understood. The full shift matters more in writing or more formal, careful speech.",
        aHi: "Relaxed, spoken English mein, especially kuch bahut recently kaha gaya report karte waqt, native speakers often full shift skip karte hain (\"she said she's coming\" \"she said she was coming\" ke bajaye) — ye genuinely common hai aur understood hai. Full shift zyada matter karta hai writing mein ya zyada formal, careful speech mein.",
      },
      {
        q: 'How do I report a command or instruction someone gave?',
        qHi: 'Main ek command ya instruction kaise report karoon jo kisi ne di?',
        a: 'Use "told" with "to" plus the base verb: "Close the door," she said → She told me to close the door. This is a distinct pattern from reporting a statement, using "told...to" rather than "said...that."',
        aHi: '"Told" use karo "to" plus base verb ke saath: "Close the door," she said → She told me to close the door. Ye ek distinct pattern hai ek statement report karne se, "told...to" use karte hue "said...that" ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, convert this direct speech into reported speech: "I am busy right now," he said.',
        taskHi: 'Zor se, is direct speech ko reported speech mein convert karo: "I am busy right now," he said.',
        hint: '"He said he was busy at that moment." (or "right then")',
        hintHi: '"He said he was busy at that moment." (ya "right then")',
      },
      {
        task: 'Out loud, report something a friend genuinely told you recently, correctly shifting tense and pronouns.',
        taskHi: 'Zor se, kuch report karo jo ek friend ne genuinely tumhe recently bataya, tense aur pronouns ko correctly shift karte hue.',
        hint: 'Think of their original words first, then convert: "I love this show" → "She said she loves this show."',
        hintHi: 'Pehle unke original words socho, phir convert karo: "I love this show" → "She said she loves this show."',
      },
    ],

    keyTakeaways: [
      'Reported speech shifts tense back one step: present → past, present continuous → past continuous, past → past perfect, will → would.',
      'The shift reflects a real change in temporal perspective — the words move from the original speaker\'s "now" to your "then."',
      'Pronouns shift too, to reflect whose perspective is now speaking.',
      'If the original statement is still true or a general fact, the tense often doesn\'t need to shift.',
      'In casual spoken English, the full tense shift is often skipped, especially for something said very recently — this is genuinely common, not incorrect.',
    ],
    keyTakeawaysHi: [
      'Reported speech tense ko ek step peeche shift karta hai: present → past, present continuous → past continuous, past → past perfect, will → would.',
      'Shift temporal perspective mein ek real change reflect karta hai — words original speaker ke "now" se tumhare "then" mein move hote hain.',
      'Pronouns bhi shift hote hain, ye reflect karne ke liye ki ab kiska perspective bol raha hai.',
      'Agar original statement abhi bhi true hai ya ek general fact hai, tense often shift karne ki zaroorat nahi hoti.',
      'Casual spoken English mein, full tense shift often skip ho jaata hai, especially kuch bahut recently kaha gaya ke liye — ye genuinely common hai, incorrect nahi.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-reporting-questions-and-requests',
    title: 'Reporting Questions & Requests',
    titleHi: 'Questions Aur Requests Report Karna',
    description:
      '"Where do you live?" becomes "she asked me where I lived" — the question mark disappears, and so does the question word order.',
    descriptionHi:
      '"Where do you live?" "she asked me where I lived" ban jaata hai — question mark gayab ho jaata hai, aur question word order bhi.',
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: '**A reported question is a question wearing a statement\'s clothes.** It still carries the same curiosity underneath, but its outer shape — the word order, the question mark — is dressed as an ordinary sentence, exactly the way an embedded question inside "do you know...?" from Module 6 works.',
      hi: 'Ek reported question ek question hai jo ek statement ke clothes pehne hue hai. Ye abhi bhi wahi curiosity carry karta hai neeche, par uska outer shape — word order, question mark — ek ordinary sentence ki tarah dress kiya gaya hai, exactly jaise Module 6 se "do you know...?" ke andar ek embedded question kaam karta hai.',
    },

    simple: `**Reporting a yes/no question uses "if" or "whether," with normal
statement word order:**

"Are you coming?" → She asked me **if** I was coming. (not "was I
coming")

**Reporting a wh-question keeps the question word but drops the
inversion:**

"Where do you live?" → She asked me **where I lived**. (not "where
did I live")

**Reporting a request or command uses "told...to" + base verb:**

"Close the door," she said. → She **told** me **to** close the door.

**No question mark, ever, in reported questions** — the sentence is
now a statement describing what was asked, not a question itself:

"She asked me where I lived." (full stop, not a question mark)

**This connects directly back to Module 6's embedded questions**:
"Do you know where the station is?" already uses this exact
statement-order pattern — reported questions are the same underlying
skill, applied to describing a past question instead of asking a
polite one.`,
    simpleHi: `**Ek yes/no question report karna "if" ya "whether" use karta hai, normal statement word order ke saath:**

"Are you coming?" → She asked me **if** I was coming. ("was I coming"
nahi)

**Ek wh-question report karna question word rakhta hai par inversion
drop kar deta hai:**

"Where do you live?" → She asked me **where I lived**. ("where did I
live" nahi)

**Ek request ya command report karna "told...to" + base verb use
karta hai:**

"Close the door," she said. → She **told** me **to** close the door.

**Reported questions mein kabhi bhi question mark nahi** — sentence ab
ek statement hai jo describe karta hai kya poocha gaya tha, ek question
khud nahi:

"She asked me where I lived." (full stop, question mark nahi)

**Ye directly Module 6 ke embedded questions se connect hota hai**:
"Do you know where the station is?" already exactly ye statement-
order pattern use karta hai — reported questions same underlying
skill hai, ek past question describe karne pe apply kiya gaya, ek
polite ek poochne ke bajaye.`,

    content: `**Why reported questions genuinely reuse the exact skill from
Module 6, rather than introducing something brand new.**

This course already covered embedding a question inside another
sentence — "Do you know where the station is?" — where the inverted
question word order reverts to normal statement order once it's
embedded. Reporting a question is structurally the identical move:
"Where do you live?" becomes "where I lived" for exactly the same
reason "where is the station" became "where the station is" — once a
question is placed inside a larger sentence, whether a polite request
for information or a report of a past question, it stops behaving
like a standalone question grammatically.

**"If" and "whether" both work for reporting a yes/no question, with a
subtle difference worth knowing.** "She asked if I was coming" and
"she asked whether I was coming" are nearly interchangeable in
everyday use; "whether" can feel slightly more formal or is preferred
when immediately followed by "or not" ("she asked whether or not I
was coming").

**"Told...to" for commands is a genuinely distinct pattern from "said
...that" for statements**, worth learning as its own fixed shape.
"She told me to close the door" uses the base verb after "to," never a
full clause — this mirrors the exact structure of a request or
instruction, distinct from reporting an opinion or fact.

**Losing the question mark reflects something real about what a
reported question actually is grammatically.** "She asked me where I
lived" is, structurally, a statement — it's you telling someone a fact
(that she asked something), not you asking a question yourself. The
punctuation follows the grammar, not the original emotional tone of
curiosity.`,
    contentHi: `**Reported questions genuinely Module 6 se exact skill kyun reuse karte hain, kuch bilkul naya introduce karne ke bajaye.**

Ye course already ek question ko doosre sentence ke andar embed karna
cover kar chuka hai — "Do you know where the station is?" — jahan
inverted question word order normal statement order mein revert hota
hai ek baar ye embed ho jaaye. Ek question report karna structurally
identical move hai: "Where do you live?" "where I lived" ban jaata hai
exactly same reason se jo "where is the station" ko "where the
station is" banaya — ek baar ek question ek badi sentence ke andar
rakha jaata hai, chahe information ke liye ek polite request ho ya
ek past question ka report, ye grammatically ek standalone question ki
tarah behave karna band kar deta hai.

**"If" aur "whether" dono ek yes/no question report karne ke liye kaam
karte hain, ek subtle difference janne layak ke saath.** "She asked if
I was coming" aur "she asked whether I was coming" nearly
interchangeable hain everyday use mein; "whether" thoda zyada formal
feel kar sakta hai ya preferred hai jab immediately "or not" follow
kare ("she asked whether or not I was coming").

**Commands ke liye "told...to" "said...that" se ek genuinely distinct
pattern hai statements ke liye**, apni own fixed shape ki tarah seekhne
layak. "She told me to close the door" "to" ke baad base verb use
karta hai, kabhi ek full clause nahi — ye ek request ya instruction ke
exact structure ko mirror karta hai, ek opinion ya fact report karne
se distinct.

**Question mark khona kuch real reflect karta hai ki ek reported
question actually grammatically kya hai.** "She asked me where I
lived" structurally, ek statement hai — ye tum kisi ko ek fact bata
rahe ho (ki usne kuch poocha), tum khud ek question nahi poochh rahe.
Punctuation grammar follow karta hai, curiosity ka original emotional
tone nahi.`,

    readingPassage: `My neighbor stopped by yesterday. She asked me if I was free that weekend. I said I wasn't sure yet. Then she asked where I usually go on weekends. I told her I usually stay home. Finally, she told me to call her if my plans changed.`,
    readingPassageHi: `Mera neighbor kal ruka. Usne mujhse poocha if I was free that weekend. Maine kaha mujhe abhi sure nahi hai. Then usne poocha where I usually go on weekends. Maine usse bataya I usually stay home. Finally, usne mujhe told to call her if my plans changed.`,

    vocabulary: [
      {
        word: 'whether',
        wordHi: 'whether (chahe/kya)',
        meaning: 'used to report a yes/no question, similar to "if"',
        meaningHi: 'ek yes/no question report karne ke liye use hota hai, "if" jaisa',
        example: 'She asked whether I liked the plan.',
        exampleHi: 'She asked whether I liked the plan.',
        pronunciation: 'WEDH-er',
      },
      {
        word: 'instruction',
        wordHi: 'instruction (nirdesh)',
        meaning: 'a direction telling someone what to do',
        meaningHi: 'ek direction jo kisi ko batata hai kya karna hai',
        example: 'He gave clear instructions on how to fix it.',
        exampleHi: 'He gave clear instructions on how to fix it.',
        pronunciation: 'in-STRUK-shun',
      },
      {
        word: 'embedded',
        wordHi: 'embedded (antarnihit)',
        meaning: 'placed inside something larger, as an integral part',
        meaningHi: 'kisi badi cheez ke andar rakha gaya, ek integral part ki tarah',
        example: 'The question is embedded inside a longer sentence.',
        exampleHi: 'The question is embedded inside a longer sentence.',
        pronunciation: 'em-BED-id',
      },
      {
        word: 'stopped by',
        wordHi: 'stopped by (milne aaya)',
        meaning: 'visited briefly, often without a long advance plan',
        meaningHi: 'briefly visit kiya, often bina ek lambe advance plan ke',
        example: 'My friend stopped by for a quick chat.',
        exampleHi: 'My friend stopped by for a quick chat.',
        pronunciation: 'stopt by',
      },
    ],

    examples: [
      {
        title: 'Reporting a yes/no question and a wh-question',
        titleHi: 'Ek yes/no question aur ek wh-question report karna',
        code: `Direct: "Are you free tomorrow?" she asked.
Reported: She asked if I was free the next day.

Direct: "What time does the meeting start?" he asked.
Reported: He asked what time the meeting started.`,
        output: 'Both reported forms use statement word order, with no question mark.',
        explain:
          'Notice neither reported version has a question mark or inverted word order — both have quietly become statements describing what was asked.',
        explainHi:
          'Notice karo dono reported versions mein koi question mark ya inverted word order nahi hai — dono chupke se statements ban gaye hain jo describe karte hain kya poocha gaya tha.',
      },
      {
        title: 'Reporting a request with "told...to"',
        titleHi: '"Told...to" ke saath ek request report karna',
        code: `Direct: "Please send me the file," she said.
Reported: She told me to send her the file.`,
        output: 'The base verb follows "to," with no full clause.',
        explain:
          'This "told...to" pattern is distinct from "said...that" for statements — it\'s worth practicing as its own fixed shape for reporting requests and commands.',
        explainHi:
          'Ye "told...to" pattern "said...that" se distinct hai statements ke liye — ise apni own fixed shape ki tarah practice karna worth hai requests aur commands report karne ke liye.',
      },
    ],

    mistakes: [
      {
        wrong: '"She asked me where did I live?" (keeping question word order and a question mark)',
        right: '"She asked me where I lived."',
        why: 'A reported question is grammatically a statement — it needs normal statement word order and no question mark, exactly like an embedded question from Module 6.',
        whyHi: 'Ek reported question grammatically ek statement hai — ise normal statement word order chahiye aur koi question mark nahi, exactly Module 6 ke ek embedded question ki tarah.',
      },
      {
        wrong: '"She told me that I close the door." (using "told...that" instead of "told...to" for a command)',
        right: '"She told me to close the door."',
        why: 'Reporting a command or request uses "told...to" plus the base verb, a distinct pattern from "said...that" used for reporting statements or opinions.',
        whyHi: 'Ek command ya request report karna "told...to" plus base verb use karta hai, "said...that" se ek distinct pattern jo statements ya opinions report karne ke liye use hota hai.',
      },
    ],

    realWorld: [
      {
        en: '**Relaying an interview or conversation to someone else** ("She asked me why I wanted the job, and I told her about my experience") relies heavily on correctly reporting questions and answers.',
        hi: '**Ek interview ya conversation kisi aur ko relay karna** ("She asked me why I wanted the job, and I told her about my experience") heavily questions aur answers ko correctly report karne pe rely karta hai.',
      },
      {
        en: '**Passing on instructions from a manager or teacher to someone who missed the original meeting** ("She told us to submit the report by Friday") depends on the "told...to" pattern specifically.',
        hi: '**Ek manager ya teacher se instructions pass karna kisi ko jo original meeting miss kiya** ("She told us to submit the report by Friday") specifically "told...to" pattern pe depend karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Is there a difference between "asked if" and "asked whether"?',
        qHi: '"Asked if" aur "asked whether" mein koi farak hai?',
        a: 'Almost none in everyday use — they\'re genuinely interchangeable for reporting a yes/no question. "Whether" is slightly more common in formal writing and is required (not "if") when followed directly by "or not."',
        aHi: 'Everyday use mein almost koi nahi — wo genuinely interchangeable hain ek yes/no question report karne ke liye. "Whether" thoda zyada common hai formal writing mein aur required hai ("if" nahi) jab directly "or not" ke baad follow kare.',
      },
      {
        q: 'How do I report a negative command, like "Don\'t be late"?',
        qHi: 'Main ek negative command kaise report karoon, jaise "Don\'t be late"?',
        a: 'Add "not" before "to": "Don\'t be late," she said → She told me not to be late. This follows the same "told...to" pattern with a simple negation added.',
        aHi: '"Not" add karo "to" se pehle: "Don\'t be late," she said → She told me not to be late. Ye same "told...to" pattern follow karta hai ek simple negation add kiya gaya.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, convert this into reported speech: "Do you like this song?" she asked.',
        taskHi: 'Zor se, ise reported speech mein convert karo: "Do you like this song?" she asked.',
        hint: '"She asked if I liked that song."',
        hintHi: '"She asked if I liked that song."',
      },
      {
        task: 'Out loud, report a real request or instruction someone recently gave you, using "told...to."',
        taskHi: 'Zor se, ek real request ya instruction report karo jo kisi ne recently tumhe di, "told...to" use karke.',
        hint: '"[Person] told me to [action]."',
        hintHi: '"[Person] told me to [action]."',
      },
    ],

    keyTakeaways: [
      'Reported yes/no questions use "if" or "whether," with normal statement word order — not the original question order.',
      'Reported wh-questions keep the question word but drop the inversion: "where I lived," not "where did I live."',
      'Reported requests and commands use "told...to" + base verb, a distinct pattern from "said...that" for statements.',
      'A reported question never has a question mark — it\'s grammatically a statement describing what was asked.',
      'This directly reuses the embedded-question skill from Module 6 — the same statement-order logic applies to both.',
    ],
    keyTakeawaysHi: [
      'Reported yes/no questions "if" ya "whether" use karte hain, normal statement word order ke saath — original question order nahi.',
      'Reported wh-questions question word rakhte hain par inversion drop karte hain: "where I lived," "where did I live" nahi.',
      'Reported requests aur commands "told...to" + base verb use karte hain, "said...that" se ek distinct pattern jo statements ke liye hai.',
      'Ek reported question mein kabhi question mark nahi hota — ye grammatically ek statement hai jo describe karta hai kya poocha gaya tha.',
      'Ye directly Module 6 ke embedded-question skill ko reuse karta hai — same statement-order logic dono pe apply hoti hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-narrating-with-dialogue',
    title: 'Narrating an Event — Bringing Dialogue Into a Story',
    titleHi: 'Ek Event Narrate Karna — Story Mein Dialogue Laana',
    description:
      'Combining past-tense storytelling with reported speech turns a list of facts into a story someone actually wants to keep listening to.',
    descriptionHi:
      'Past-tense storytelling ko reported speech ke saath combine karna facts ki ek list ko ek aisi story mein badal deta hai jise koi actually sunte rehna chahega.',
    difficulty: 'HARD',
    duration: 25,
    order: 3,

    analogy: {
      en: '**A story without dialogue is a photo; a story with dialogue is a short video clip.** "We talked about the project" tells you a meeting happened. "She said the deadline was too tight, and I told her we could push it back a week" lets you actually hear the moment, not just learn that it occurred.',
      hi: 'Dialogue ke bina ek story ek photo hai; dialogue ke saath ek story ek short video clip hai. "We talked about the project" tumhe batata hai ek meeting hui. "She said the deadline was too tight, and I told her we could push it back a week" tumhe actually us moment ko sunne deta hai, sirf ye seekhne ke bajaye ki ye hua.',
    },

    simple: `**A well-told story combines three things this course has already
covered:**

1. **Past tense for the sequence of events** (Module 4): "I walked
   into the meeting. We sat down."
2. **Sequencing words** (Module 3): "First... then... after that...
   finally"
3. **Reported speech for what people actually said** (this module):
   "She said the deadline was tight, so I told her we'd adjust it."

**Mixing reported speech into a story makes it feel real and specific,
not just summarized:**

Flat: "We discussed the deadline and agreed to change it."
With dialogue: "She said the deadline felt impossible, so I asked her
what timeline would actually work, and she suggested adding one more
week."

**A story doesn't need every single word someone said — pick the one
or two lines that actually matter to the story.**

**Ending with how you felt or what happened next** (echoing Module
4's storytelling lesson) still applies here — dialogue is an addition
to good storytelling, not a replacement for its other parts.`,
    simpleHi: `**Ek achhi tarah batayi gayi story teen cheezein combine karti hai jo ye course already cover kar chuka hai:**

1. **Events ki sequence ke liye Past tense** (Module 4): "I walked
   into the meeting. We sat down."
2. **Sequencing words** (Module 3): "First... then... after that...
   finally"
3. **Log actually kya bole uske liye Reported speech** (ye module):
   "She said the deadline was tight, so I told her we'd adjust it."

**Reported speech ko ek story mein mix karna ise real aur specific feel
karata hai, sirf summarized nahi:**

Flat: "We discussed the deadline and agreed to change it."
Dialogue ke saath: "She said the deadline felt impossible, so I asked
her what timeline would actually work, and she suggested adding one
more week."

**Ek story ko har single word ki zaroorat nahi jo kisi ne kaha — ek ya
do lines choose karo jo actually story ke liye matter karti hain.**

**Kaisa feel hua ya baad mein kya hua pe end karna** (Module 4's
storytelling lesson ko echo karte hue) yahan bhi apply hota hai —
dialogue achhi storytelling mein ek addition hai, uske doosre parts ka
replacement nahi.`,

    content: `**Why bringing dialogue into a story is the natural, final step in
this course's storytelling arc.**

Module 4 taught staying consistently in past tense through a story.
Module 3 added sequencing words to connect events. This lesson adds
the last major piece: reported speech, which lets you bring other
people's actual words into your narrative instead of only summarizing
that a conversation happened. Together, these three skills produce a
genuinely complete, natural-sounding story — exactly the kind a fluent
speaker tells without thinking about the underlying structure at all.

**Dialogue makes a story concrete in a way pure summary cannot.**
"We talked about it and decided to wait" is accurate but abstract —
the listener has no sense of how the conversation actually unfolded.
"She said she was worried about rushing it, and I said I agreed, so we
decided to wait" gives the listener the actual texture of the
exchange, which is what makes a story feel alive rather than merely
reported.

**Selectivity matters here as much as it did in Module 12's lesson on
not overloading a sentence.** A story bogged down with every single
word both people said in a twenty-minute conversation loses its shape
just as easily as an overloaded sentence does — picking the one or two
most important, most illustrative lines of dialogue keeps the story
tight and engaging.

**This lesson closes the "storytelling" skill chain that started with
Module 4's simple past-tense narration**: past tense (Module 4) +
sequencing (Module 3) + reported speech (this module) is genuinely
the complete toolkit for telling a real, natural story in English —
everything after this point in the course builds on being able to
speak fluently and persuasively, assuming this storytelling foundation
is already solid.`,
    contentHi: `**Story mein dialogue laana is course ke storytelling arc mein natural, final step kyun hai.**

Module 4 ne sikhaya ek story ke through consistently past tense mein
rehna. Module 3 ne events ko connect karne ke liye sequencing words
add kiye. Ye lesson last major piece add karta hai: reported speech,
jo tumhe doosre logon ke actual words ko apni narrative mein laane
deta hai, sirf ye summarize karne ke bajaye ki ek conversation hui.
Saath mein, ye teen skills ek genuinely complete, natural-sounding
story produce karti hain — exactly wo tarah jo ek fluent speaker
underlying structure ke baare mein bilkul soche bina batata hai.

**Dialogue ek story ko concrete banata hai ek tareeke se jo pure
summary nahi kar sakti.** "We talked about it and decided to wait"
accurate hai par abstract hai — listener ko koi sense nahi hai ki
conversation actually kaise unfold hui. "She said she was worried
about rushing it, and I said I agreed, so we decided to wait" listener
ko exchange ka actual texture deta hai, jo ek story ko alive feel
karata hai, sirf reported se zyada.

**Selectivity yahan utni hi matter karti hai jitni Module 12 ke lesson
mein ek sentence ko overload na karne ke baare mein.** Ek story jo
twenty-minute conversation mein dono logon ne jo har single word kaha
usse bogged down hai apna shape utni hi easily kho deti hai jitna ek
overloaded sentence — dialogue ki ek ya do sabse important, sabse
illustrative lines choose karna story ko tight aur engaging rakhta hai.

**Ye lesson "storytelling" skill chain ko close karta hai jo Module
4's simple past-tense narration se start hua**: past tense (Module 4)
+ sequencing (Module 3) + reported speech (ye module) genuinely English
mein ek real, natural story batane ka complete toolkit hai — is point
ke baad course mein sab kuch fluently aur persuasively bolne ki ability
pe build karta hai, ye assume karte hue ki ye storytelling foundation
already solid hai.`,

    readingPassage: `Let me tell you what happened at work yesterday. First, my manager called me into her office. She said she was impressed with my recent work, and she asked if I was interested in leading the new project. I said I would love the opportunity. Then she told me to prepare a proposal by Friday. I left feeling really excited, and I immediately called my mom to share the good news.`,
    readingPassageHi: `Main tumhe batata hoon kal kaam pe kya hua. First, mere manager ne mujhe apne office mein bulaya. She said she was impressed with my recent work, aur usne poocha if I was interested in leading the new project. Maine kaha I would love the opportunity. Then usne mujhe told to prepare a proposal by Friday. Main really excited feel karte hue nikla, aur maine immediately apni mom ko call kiya good news share karne ke liye.`,

    vocabulary: [
      {
        word: 'narrate',
        wordHi: 'narrate (varnan karna)',
        meaning: 'to tell a story or describe a sequence of events',
        meaningHi: 'ek story batana ya events ki ek sequence describe karna',
        example: 'She narrated the whole event beautifully.',
        exampleHi: 'She narrated the whole event beautifully.',
        pronunciation: 'NAR-eyt',
      },
      {
        word: 'illustrative',
        wordHi: 'illustrative (udaharan swaroop)',
        meaning: 'serving as a clear, useful example',
        meaningHi: 'ek clear, useful example ki tarah serve karna',
        example: 'She shared one illustrative example from her own experience.',
        exampleHi: 'She shared one illustrative example from her own experience.',
        pronunciation: 'i-LUS-truh-tiv',
      },
      {
        word: 'proposal',
        wordHi: 'proposal (prastav)',
        meaning: 'a formal plan or suggestion put forward for consideration',
        meaningHi: 'ek formal plan ya suggestion consideration ke liye put forward kiya gaya',
        example: 'I need to prepare a proposal for the new project.',
        exampleHi: 'I need to prepare a proposal for the new project.',
        pronunciation: 'pruh-POH-zuhl',
      },
      {
        word: 'impressed',
        wordHi: 'impressed (prabhavit)',
        meaning: 'feeling admiration because something was done well',
        meaningHi: 'admiration feel karna kyunki kuch achhe se kiya gaya',
        example: 'My manager was impressed with the report.',
        exampleHi: 'My manager was impressed with the report.',
        pronunciation: 'im-PREST',
      },
    ],

    examples: [
      {
        title: 'A complete story with past tense, sequencing, and reported speech',
        titleHi: 'Ek complete story past tense, sequencing, aur reported speech ke saath',
        code: `Last week, I visited my old friend. First, we caught up over coffee. She told me she had recently changed jobs and asked if I had any advice. I said I thought she'd made a great choice. Finally, we agreed to meet again soon.`,
        output: 'All three storytelling skills working together in one natural passage.',
        explain:
          'Notice past tense stays consistent throughout, sequencing words ("first," "finally") organize the events, and reported speech ("she told me," "asked if," "I said") brings the actual conversation to life.',
        explainHi:
          'Notice karo past tense poore mein consistent rehta hai, sequencing words ("first," "finally") events ko organize karte hain, aur reported speech ("she told me," "asked if," "I said") actual conversation ko life mein laata hai.',
      },
      {
        title: 'Flat summary vs. story with selective dialogue',
        titleHi: 'Flat summary vs. selective dialogue ke saath story',
        code: `Flat: We discussed the budget and disagreed at first.
With dialogue: I said the budget felt too tight, but she said we had no other choice — eventually, I saw her point.`,
        output: 'The dialogue version gives the listener the actual texture of the disagreement.',
        explain:
          'Only the most essential lines are included — this isn\'t a full transcript, just enough real dialogue to make the story feel concrete and alive.',
        explainHi:
          'Sirf sabse essential lines include ki gayi hain — ye ek full transcript nahi hai, bas itna real dialogue ki story concrete aur alive feel kare.',
      },
    ],

    mistakes: [
      {
        wrong: 'Including every single word of a long conversation in a story, losing the overall shape',
        right: 'Select only the one or two most important or illustrative lines of dialogue.',
        why: 'Just like an overloaded sentence from Module 12, a story crammed with too much unfiltered dialogue becomes hard to follow and loses its point.',
        whyHi: 'Jaise Module 12 se ek overloaded sentence, ek story jo bahut zyada unfiltered dialogue se crammed hai follow karna hard ban jaati hai aur apna point kho deti hai.',
      },
      {
        wrong: 'Drifting into present tense partway through a story that includes dialogue: "She said she is worried" (mid-story)',
        right: '"She said she was worried." — keep the tense shift consistent, exactly as covered in the previous two lessons.',
        why: 'The same tense-drift risk from Module 4\'s storytelling lesson applies here too, now combined with the reported-speech tense shift — both need to stay consistent throughout.',
        whyHi: 'Module 4 ke storytelling lesson se same tense-drift risk yahan bhi apply hota hai, ab reported-speech tense shift ke saath combined — dono ko poore mein consistent rehna chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Sharing an interesting conversation, negotiation, or exchange with a friend or colleague** ("She said this, so I said that...") is one of the most natural, common uses of full storytelling in everyday English.',
        hi: '**Ek friend ya colleague ke saath ek interesting conversation, negotiation, ya exchange share karna** ("She said this, so I said that...") everyday English mein full storytelling ke sabse natural, common uses mein se ek hai.',
      },
      {
        en: '**Recounting a difficult conversation or a resolved conflict**, whether at work or personally, relies on this exact combination of narration and selective dialogue to explain what actually happened and how it was resolved.',
        hi: '**Ek difficult conversation ya ek resolved conflict recount karna**, chahe kaam pe ho ya personally, is exact combination narration aur selective dialogue ke pe rely karta hai explain karne ke liye ki actually kya hua aur ye kaise resolve hua.',
      },
    ],

    interviewQA: [
      {
        q: 'Should I use exact quotation marks when telling a spoken story with dialogue?',
        qHi: 'Kya mujhe exact quotation marks use karni chahiye jab ek spoken story dialogue ke saath bata raha hoon?',
        a: "In speech, quotation marks obviously aren't spoken, but a brief pause or slight change in tone before reported words can signal to the listener that you're recounting what someone said — this is a natural, common storytelling technique in spoken English.",
        aHi: "Speech mein, quotation marks obviously bole nahi jaate, par reported words se pehle ek brief pause ya tone mein slight change listener ko signal kar sakta hai ki tum recount kar rahe ho jo kisi ne kaha — ye spoken English mein ek natural, common storytelling technique hai.",
      },
      {
        q: 'How much dialogue is too much in a spoken story?',
        qHi: 'Ek spoken story mein kitna dialogue too much hai?',
        a: 'A useful guideline: one or two exchanges that capture the key turning point or tension of the story are usually enough. If you find yourself reporting more than three or four lines of back-and-forth, consider summarizing the rest and keeping only the most essential moment as dialogue.',
        aHi: 'Ek useful guideline: ek ya do exchanges jo story ka key turning point ya tension capture karte hain usually kaafi hain. Agar tum khud ko teen ya char lines se zyada back-and-forth report karte paate ho, baaki ko summarize karne aur sirf sabse essential moment ko dialogue ki tarah rakhne pe consider karo.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, tell a short story about a real conversation you had recently, including at least one line of reported dialogue.',
        taskHi: 'Zor se, ek recent real conversation ke baare mein ek chhoti story batao, kam se kam ek line reported dialogue including.',
        hint: 'Use past tense throughout, a sequencing word, and "she said/asked/told me" for the dialogue.',
        hintHi: 'Poore mein past tense use karo, ek sequencing word, aur dialogue ke liye "she said/asked/told me".',
      },
      {
        task: 'Take a flat, summarized sentence and rewrite it out loud with one line of dialogue added: "We talked about the plan and agreed to change it."',
        taskHi: 'Ek flat, summarized sentence lo aur ise zor se rewrite karo ek dialogue line add karke: "We talked about the plan and agreed to change it."',
        hint: '"I said the plan felt rushed, and she agreed, so we decided to change it."',
        hintHi: '"I said the plan felt rushed, and she agreed, so we decided to change it."',
      },
    ],

    keyTakeaways: [
      'A well-told story combines three skills from this course: past-tense consistency (M4), sequencing words (M3), and reported speech (this module).',
      'Dialogue makes a story concrete and alive, giving the listener the actual texture of a conversation rather than just a summary.',
      'Select only the one or two most important lines of dialogue — a story overloaded with every word loses its shape, just like an overloaded sentence.',
      'Tense consistency still matters with dialogue added — both the storytelling tense and the reported-speech tense shift need to stay consistent.',
      'This closes the storytelling skill chain — past tense + sequencing + reported speech is the complete toolkit for a natural, real story in English.',
    ],
    keyTakeawaysHi: [
      'Ek achhi tarah batayi gayi story is course ke teen skills combine karti hai: past-tense consistency (M4), sequencing words (M3), aur reported speech (ye module).',
      'Dialogue ek story ko concrete aur alive banata hai, listener ko ek conversation ka actual texture deta hai, sirf ek summary nahi.',
      'Sirf ek ya do sabse important lines of dialogue choose karo — ek story jo har word se overloaded hai apna shape kho deti hai, ek overloaded sentence ki tarah.',
      'Dialogue add hone ke saath bhi tense consistency matter karti hai — storytelling tense aur reported-speech tense shift dono ko consistent rehna chahiye.',
      'Ye storytelling skill chain ko close karta hai — past tense + sequencing + reported speech English mein ek natural, real story ke liye complete toolkit hai.',
    ],
  },
];
