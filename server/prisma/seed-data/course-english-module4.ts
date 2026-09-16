/**
 * English Speaking Complete Course — Module 4: Talking About the Past,
 * lessons 1-3. Opens Part II (Building Real Sentences).
 *
 * Lesson 1: Regular past tense (-ed) and its three real pronunciations.
 * Lesson 2: Irregular past tense verbs — no rule, just memorization,
 *           tackled through the most frequent ones first.
 * Lesson 3: Telling a short story in the past — sequencing events
 *           without switching back to present tense halfway through,
 *           a genuinely common slip once a story gets more than two
 *           sentences long.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_4: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-regular-past-tense',
    title: 'Regular Past Tense — Adding "-ed"',
    titleHi: 'Regular Past Tense — "-ed" Add Karna',
    description:
      'One spelling, three different sounds: why "-ed" in "walked," "played," and "wanted" doesn\'t rhyme the way it looks like it should.',
    descriptionHi:
      'Ek spelling, teen alag sounds: "-ed" "walked," "played," aur "wanted" mein kyun waisa rhyme nahi karta jaisa dikhta hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**"-ed" is one uniform, spelled the same way, worn by three different sounds.** Just like one school uniform doesn\'t tell you which student is which, one spelling ("-ed") doesn\'t tell you which of three real sounds to make — you have to know the underlying word to pick correctly.',
      hi: '"-ed" ek uniform hai, jo same tareeke se spell hota hai, teen alag sounds pehne hue. Jaise ek school uniform tumhe nahi batata kaunsa student kaun hai, ek spelling ("-ed") tumhe nahi batati teen real sounds mein se kaunsa banana hai — sahi choose karne ke liye tumhe underlying word janna padta hai.',
    },

    simple: `**To make a regular verb past tense, add "-ed":**

walk → walk**ed** · play → play**ed** · want → want**ed**

**But "-ed" is pronounced three different ways:**

1. **/t/ sound** after an unvoiced sound: walked, watched, helped,
   talked — sounds like "walkt", "watcht"
2. **/d/ sound** after a voiced sound: played, cleaned, loved,
   opened — sounds like "playd", "cleand"
3. **/id/ sound** after "t" or "d": wanted, needed, started,
   decided — sounds like "want-id", "need-id" — this is the ONLY
   group where "-ed" adds an extra syllable you can actually hear

**A quick way to check**: say the base verb's very last sound. If it's
already a "t" or "d" sound (wan**t**, nee**d**), you'll hear the extra
"-id" syllable. Otherwise, you won't — it just changes the ending
sound to /t/ or /d/.`,
    simpleHi: `**Ek regular verb ko past tense banane ke liye, "-ed" add karo:**

walk → walk**ed** · play → play**ed** · want → want**ed**

**Par "-ed" teen alag tareekon se pronounce hota hai:**

1. **/t/ sound** ek unvoiced sound ke baad: walked, watched, helped,
   talked — "walkt", "watcht" jaisa sound karta hai
2. **/d/ sound** ek voiced sound ke baad: played, cleaned, loved,
   opened — "playd", "cleand" jaisa sound karta hai
3. **/id/ sound** "t" ya "d" ke baad: wanted, needed, started,
   decided — "want-id", "need-id" jaisa sound karta hai — ye ONLY group
   hai jahan "-ed" ek extra syllable add karta hai jo tum actually sun
   sakte ho

**Check karne ka ek quick tareeka**: base verb ki bilkul last sound
bolo. Agar ye already ek "t" ya "d" sound hai (wan**t**, nee**d**), tum
extra "-id" syllable sunoge. Nahi to, nahi sunoge — ye bas ending sound
ko /t/ ya /d/ mein change kar deta hai.`,

    content: `**Why this distinction matters for speaking, specifically.**

Written English never shows this difference — "walked," "played," and
"wanted" all just end in the same four letters. A learner reading
silently never encounters the problem at all. But the moment you speak
these words out loud, pronouncing all three exactly the same way
(adding a full extra syllable to all of them, or none of them) sounds
noticeably unnatural to a native ear, even though the grammar itself
is completely correct.

**The actual rule is about the sound before "-ed", not the spelling.**
"Voiced" sounds (made using your vocal cords, like "play," "clean,"
"love") take the /d/ sound. "Unvoiced" sounds (made with air but no
vocal cord vibration, like "walk," "watch," "help") take the /t/
sound. You don't need to memorize which consonants are voiced or
unvoiced from a chart — the fastest way is simply practicing common
verbs out loud until the correct sound feels automatic.

**"Wanted," "needed," "started," and "decided" are genuinely
different, not just an exception to memorize.** When a verb already
ends in a "t" or "d" sound, English can't squeeze another "t" or "d"
straight onto the end without a vowel between them — that's precisely
why an extra syllable "-id" appears only in this one group. This is
the reason "wanted" has two syllables (want-ID) while "walked" has
only one (walkt).

**Spelling changes sometimes happen before adding "-ed"** — doubling a
final consonant (stop → stopped), dropping a silent "e" (like →
liked), or changing "y" to "i" (study → studied). These are spelling
rules, separate from the pronunciation rule above, and worth knowing
for writing even though they don't change how the word sounds.`,
    contentHi: `**Ye distinction specifically speaking ke liye kyun matter karta hai.**

Written English ye difference kabhi nahi dikhati — "walked," "played,"
aur "wanted" sab bas same four letters pe end hote hain. Ek learner
jo silently padh raha hai isse kabhi face hi nahi karta. Par jis pal
tum in words ko zor se bolte ho, teeno ko exactly same tareeke se
pronounce karna (sabko ek full extra syllable add karna, ya kisi ko
nahi) ek native ear ko noticeably unnatural sound karta hai, chahe
grammar khud completely correct ho.

**Actual rule "-ed" se pehle wali sound ke baare mein hai, spelling ke
baare mein nahi.** "Voiced" sounds (vocal cords use karke bane, jaise
"play," "clean," "love") /d/ sound lete hain. "Unvoiced" sounds (air se
bane par vocal cord vibration ke bina, jaise "walk," "watch," "help")
/t/ sound lete hain. Tumhe ek chart se yaad karne ki zaroorat nahi ki
kaunse consonants voiced ya unvoiced hain — sabse fast tareeka simply
common verbs ko zor se practice karna hai jab tak correct sound
automatic na feel ho.

**"Wanted," "needed," "started," aur "decided" genuinely different
hain, sirf yaad karne wala ek exception nahi.** Jab ek verb already ek
"t" ya "d" sound pe end hota hai, English ek aur "t" ya "d" ko end mein
seedha squeeze nahi kar sakti bina beech mein ek vowel ke — yahi
precisely reason hai ki extra syllable "-id" sirf is ek group mein
appear hota hai. Yahi reason hai ki "wanted" ke do syllables hain
(want-ID) jabki "walked" ka sirf ek hai (walkt).

**Kabhi kabhi "-ed" add karne se pehle spelling changes hote hain** —
final consonant double karna (stop → stopped), silent "e" drop karna
(like → liked), ya "y" ko "i" mein change karna (study → studied). Ye
spelling rules hain, upar wale pronunciation rule se separate, aur
writing ke liye janne layak hain chahe ye word ki sound change na
karein.`,

    readingPassage: `Yesterday, I walked to the market. I wanted to buy some fruit, so I looked around for a while. I talked to the shopkeeper, and he helped me choose the best mangoes. I really needed a good snack, and those mangoes were perfect.`,
    readingPassageHi: `Yesterday, main market tak walked. Main kuch fruit buy karna wanted, so main thodi der looked around. Main shopkeeper se talked, aur usne mujhe best mangoes choose karne mein helped. Mujhe genuinely ek achhe snack ki needed thi, aur wo mangoes perfect the.`,

    vocabulary: [
      {
        word: 'yesterday',
        wordHi: 'yesterday (kal - beeta hua)',
        meaning: 'the day before today',
        meaningHi: 'aaj se pehle wala din',
        example: 'I went to the market yesterday.',
        exampleHi: 'I went to the market yesterday.',
        pronunciation: 'YES-ter-day',
      },
      {
        word: 'walked',
        wordHi: 'walked (chala)',
        meaning: 'past tense of "walk"',
        meaningHi: '"walk" ka past tense',
        example: 'I walked to the office this morning.',
        exampleHi: 'I walked to the office this morning.',
        pronunciation: 'wawkt (/t/ sound)',
      },
      {
        word: 'wanted',
        wordHi: 'wanted (chaha)',
        meaning: 'past tense of "want"',
        meaningHi: '"want" ka past tense',
        example: 'I wanted to call you, but I was busy.',
        exampleHi: 'I wanted to call you, but I was busy.',
        pronunciation: 'WAHN-tid (extra syllable)',
      },
      {
        word: 'helped',
        wordHi: 'helped (madad ki)',
        meaning: 'past tense of "help"',
        meaningHi: '"help" ka past tense',
        example: 'She helped me with my homework.',
        exampleHi: 'She helped me with my homework.',
        pronunciation: 'helpt (/t/ sound)',
      },
    ],

    examples: [
      {
        title: 'The three "-ed" sounds side by side',
        titleHi: 'Teen "-ed" sounds side by side',
        code: `/t/ sound:  walked, watched, talked, helped
/d/ sound:  played, cleaned, loved, opened
/id/ sound: wanted, needed, started, decided`,
        output: 'Say each row out loud — notice the third row genuinely gets an extra beat.',
        explain:
          'Reading this list out loud row by row is one of the fastest ways to train your ear and mouth to make the right sound automatically for a new verb you haven\'t practiced yet.',
        explainHi:
          'Is list ko row by row zor se padhna apne kaan aur mooh ko train karne ka sabse fast tareekon mein se ek hai ek naye verb ke liye automatically sahi sound banana jise tumne abhi tak practice nahi kiya.',
      },
      {
        title: 'A short story using regular past tense',
        titleHi: 'Ek chhoti story regular past tense use karte hue',
        code: `Yesterday, I finished work early. I called my friend, and we planned to meet for dinner. We talked for hours and really enjoyed the evening.`,
        output: 'Six regular past-tense verbs, three different "-ed" sounds among them.',
        explain:
          'Notice "finished" and "talked" and "enjoyed" all use "-ed" but sound genuinely different when spoken — this is completely normal and exactly the point of this lesson.',
        explainHi:
          'Notice karo "finished" aur "talked" aur "enjoyed" sab "-ed" use karte hain par bole jaane pe genuinely alag sound karte hain — ye completely normal hai aur exactly is lesson ka point hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Pronouncing every "-ed" the same way, as an extra syllable ("walk-ID", "play-ID")',
        right: 'Only "t/d"-ending verbs (wanted, needed, started) get the extra syllable; others take a plain /t/ or /d/ sound.',
        why: 'Since written English never shows the difference, it\'s natural to assume all "-ed" words are pronounced the same. Adding an extra syllable to every single one is one of the more noticeable, easy-to-fix pronunciation habits in past-tense speech.',
        whyHi: 'Kyunki written English kabhi ye difference nahi dikhati, ye assume karna natural hai ki sab "-ed" words same pronounce hote hain. Har ek mein extra syllable add karna past-tense speech mein ek zyada noticeable, easy-to-fix pronunciation habit hai.',
      },
      {
        wrong: '"I am walked to school yesterday." (mixing "am" with a past-tense verb)',
        right: '"I walked to school yesterday."',
        why: 'Simple past tense stands alone — it never needs a helping "am/is/are" the way continuous tenses do. This mix-up usually comes from over-applying the "am + verb" pattern from present continuous.',
        whyHi: 'Simple past tense akela khada hota hai — ise kabhi ek helping "am/is/are" ki zaroorat nahi hoti jaise continuous tenses ko hoti hai. Ye mix-up usually present continuous ke "am + verb" pattern ko zyada apply karne se aata hai.',
      },
    ],

    realWorld: [
      {
        en: '**Recounting your weekend or your day** ("What did you do yesterday?") is one of the single most common everyday conversation topics, built almost entirely on regular and irregular past tense.',
        hi: '**Apna weekend ya apna din recount karna** ("What did you do yesterday?") sabse common everyday conversation topics mein se ek hai, almost poori tarah regular aur irregular past tense pe bana hai.',
      },
      {
        en: '**Explaining what already happened at work** ("I called the client, and I finished the report") is essential for status updates, handoffs, and daily standups in a professional setting.',
        hi: '**Kaam pe jo already ho chuka hai wo explain karna** ("I called the client, and I finished the report") status updates, handoffs, aur daily standups ke liye essential hai ek professional setting mein.',
      },
    ],

    interviewQA: [
      {
        q: "Do I really need to worry about which of the three '-ed' sounds to use, or will people understand me anyway?",
        qHi: "Kya mujhe genuinely worry karni chahiye teen '-ed' sounds mein se kaunsa use karna hai, ya log mujhe waise bhi samajh jaayenge?",
        a: "You'll be understood either way — this is a fluency and naturalness issue, not a comprehension-breaking one. But it's one of the highest-value, lowest-effort pronunciation fixes in English: a small number of sounds to practice that noticeably improve how natural your past-tense speech sounds.",
        aHi: "Tumhe dono tarah se samjha jaayega — ye ek fluency aur naturalness issue hai, comprehension-breaking nahi. Par ye English mein sabse highest-value, lowest-effort pronunciation fixes mein se ek hai: kuch thodi si sounds practice karne ke liye jo tumhari past-tense speech ko noticeably zyada natural sound karati hain.",
      },
      {
        q: 'How can I tell if a new verb I don\'t know yet will use /t/, /d/, or /id/?',
        qHi: 'Main kaise pata karoon agar ek naya verb jo mujhe abhi nahi pata /t/, /d/, ya /id/ use karega?',
        a: "Say the base verb's very last sound out loud. If it already ends in a \"t\" or \"d\" sound, expect the extra \"-id\" syllable. If it ends in another unvoiced sound (like \"k\", \"p\", \"s\", \"ch\"), expect /t/. If it ends in a voiced sound (most vowels, \"n\", \"l\", \"v\", \"m\"), expect /d/.",
        aHi: "Base verb ki bilkul last sound zor se bolo. Agar ye already ek \"t\" ya \"d\" sound pe end hota hai, extra \"-id\" syllable expect karo. Agar ye ek doosri unvoiced sound pe end hota hai (jaise \"k\", \"p\", \"s\", \"ch\"), /t/ expect karo. Agar ye ek voiced sound pe end hota hai (zyadatar vowels, \"n\", \"l\", \"v\", \"m\"), /d/ expect karo.",
      },
    ],

    exercises: [
      {
        task: 'Out loud, sort these verbs into the three "-ed" sound groups and say each group out loud: cooked, cleaned, painted, watched, loved, decided.',
        taskHi: 'Zor se, in verbs ko teen "-ed" sound groups mein sort karo aur har group ko zor se bolo: cooked, cleaned, painted, watched, loved, decided.',
        hint: '/t/: cooked, watched. /d/: cleaned, loved. /id/: painted, decided.',
        hintHi: '/t/: cooked, watched. /d/: cleaned, loved. /id/: painted, decided.',
      },
      {
        task: 'Out loud, describe three things you did yesterday, using at least one verb from each of the three "-ed" sound groups.',
        taskHi: 'Zor se, teen cheezein describe karo jo tumne kal ki thi, teeno "-ed" sound groups mein se kam se kam ek verb use karke.',
        hint: '"Yesterday, I [walked/cooked/cleaned/wanted/decided/played]..."',
        hintHi: '"Yesterday, I [walked/cooked/cleaned/wanted/decided/played]..."',
      },
    ],

    keyTakeaways: [
      '"-ed" is spelled the same way but pronounced three different ways: /t/, /d/, and /id/.',
      'Only verbs already ending in a "t" or "d" sound (wanted, needed, started) get the extra "-id" syllable.',
      'The choice between /t/ and /d/ depends on whether the sound before "-ed" is voiced or unvoiced, not on spelling.',
      'Simple past tense stands alone — never combine it with "am/is/are" ("I walked", not "I am walked").',
      'This is a genuinely high-value, low-effort pronunciation fix: a small set of sounds that noticeably improves natural-sounding past-tense speech.',
    ],
    keyTakeawaysHi: [
      '"-ed" same tareeke se spell hota hai par teen alag tareekon se pronounce hota hai: /t/, /d/, aur /id/.',
      'Sirf wo verbs jo already ek "t" ya "d" sound pe end hote hain (wanted, needed, started) extra "-id" syllable lete hain.',
      '/t/ aur /d/ ke beech choice is baat pe depend karta hai ki "-ed" se pehle ki sound voiced hai ya unvoiced, spelling pe nahi.',
      'Simple past tense akela khada hota hai — ise kabhi "am/is/are" ke saath combine mat karo ("I walked", "I am walked" nahi).',
      'Ye ek genuinely high-value, low-effort pronunciation fix hai: sounds ka ek chhota set jo natural-sounding past-tense speech ko noticeably improve karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-irregular-past-tense',
    title: 'Irregular Past Tense — No Rule, Just the Common Ones',
    titleHi: 'Irregular Past Tense — Koi Rule Nahi, Bas Common Wale',
    description:
      'Go/went, have/had, see/saw — the most frequent verbs in English happen to be the ones that break the "-ed" rule completely.',
    descriptionHi:
      'Go/went, have/had, see/saw — English ke sabse frequent verbs hi wo hain jo "-ed" rule ko completely tod dete hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**Irregular verbs are like a handful of streets in an otherwise perfectly numbered city that simply have their own names.** Once you learn that this particular street is called "Go→Went" and not "Go-th Street," you just know it — there\'s no formula, only familiarity built from hearing and using them.',
      hi: 'Irregular verbs ek city ke kuch streets jaise hain jo otherwise perfectly numbered hai par unke apne naam hain. Ek baar tumne seekh liya ki ye particular street "Go→Went" kehlata hai, "Go-th Street" nahi, tumhe bas pata hota hai — koi formula nahi hai, sirf familiarity jo sunne aur use karne se banti hai.',
    },

    simple: `**These extremely common verbs do NOT follow the "-ed" rule — they
just change form:**

- go → **went** (not "goed")
- have → **had** (not "haved")
- see → **saw** (not "seed")
- do → **did** (not "doed")
- eat → **ate**
- make → **made**
- take → **took**
- get → **got**
- come → **came**
- say → **said**

**There's no pattern to predict these — they have to be learned
individually,** the same way you already learned Hindi's own irregular
forms without a formula.

**The good news**: these ten verbs alone cover an enormous share of
everyday spoken English, because they're exactly the verbs people use
most — once you're comfortable with this short list, you can describe
almost any typical day.`,
    simpleHi: `**Ye extremely common verbs "-ed" rule follow NAHI karte — wo bas form change kar dete hain:**

- go → **went** ("goed" nahi)
- have → **had** ("haved" nahi)
- see → **saw** ("seed" nahi)
- do → **did** ("doed" nahi)
- eat → **ate**
- make → **made**
- take → **took**
- get → **got**
- come → **came**
- say → **said**

**Inhe predict karne ka koi pattern nahi hai — inhe individually
seekhna padta hai,** jaise tumne already Hindi ke apne irregular forms
bina formula ke seekhe the.

**Achhi khabar**: akele ye das verbs everyday spoken English ka ek
enormous share cover karte hain, kyunki ye exactly wo verbs hain jo log
sabse zyada use karte hain — ek baar tum is chhoti list se comfortable
ho jaao, tum almost koi bhi typical din describe kar sakte ho.`,

    content: `**Why irregular verbs exist at all, briefly.** English's irregular
verbs are mostly survivors from much older forms of the language,
before the "-ed" pattern became the default for new verbs. They
weren't designed to be difficult — they're simply old, and old, very
frequently used words tend to resist regularization over centuries in
any language, including Hindi's own irregular verb forms.

**"Goed" is a genuinely predictable, very common learner mistake —
and a completely reasonable one.** Applying the "-ed" rule to "go"
follows the logic perfectly; English children make exactly this same
mistake while learning to speak and are corrected the same way you're
being corrected here. There is nothing to feel embarrassed about in
this specific error — it is the single most natural mistake possible
in this language.

**Learn irregular verbs in short, frequent bursts tied to real
sentences, not as an isolated list.** "I went to the market. I saw my
friend. We had lunch together." sticks better than memorizing
go-went, see-saw, have-had as disconnected pairs, because you're
practicing the exact shape you'll actually use them in.

**A small number of these verbs are used constantly enough that
mastering just the ten in this lesson meaningfully changes how
fluent you sound**, since "go," "have," "see," "do," "eat," "make,"
"take," "get," "come," and "say" are all among the most frequently
used verbs in the entire English language.`,
    contentHi: `**Irregular verbs bilkul exist kyun karte hain, briefly.** English ke
irregular verbs zyadatar bahut purane forms ke survivors hain, us se
pehle ki "-ed" pattern naye verbs ke liye default ban gaya. Ye
difficult banane ke liye design nahi kiye gaye the — ye simply purane
hain, aur purane, bahut frequently use hone wale words kisi bhi
language mein centuries mein regularization resist karte hain,
including Hindi ke apne irregular verb forms.

**"Goed" ek genuinely predictable, bahut common learner mistake hai —
aur ek completely reasonable bhi.** "go" pe "-ed" rule apply karna
logic ko perfectly follow karta hai; English children exactly yahi
mistake karte hain bolna seekhte waqt aur unhe usi tarah correct kiya
jaata hai jaise tumhe yahan correct kiya ja raha hai. Is specific error
mein embarrassed feel karne layak kuch nahi hai — ye is language mein
sabse natural possible mistake hai.

**Irregular verbs ko short, frequent bursts mein seekho real sentences
ke saath tied, ek isolated list ki tarah nahi.** "I went to the market.
I saw my friend. We had lunch together." better stick karta hai go-
went, see-saw, have-had ko disconnected pairs ki tarah memorize karne
se, kyunki tum exact shape practice kar rahe ho jispe tum inhe actually
use karoge.

**In verbs mein se ek chhota number itna constantly use hota hai ki
sirf is lesson ke das master karna meaningfully change kar deta hai
tum kitne fluent sound karte ho**, kyunki "go," "have," "see," "do,"
"eat," "make," "take," "get," "come," aur "say" sab poori English
language ke sabse frequently used verbs mein se hain.`,

    readingPassage: `Yesterday was a busy day. I went to work early. I saw my colleague, and we had a meeting. I made a presentation, and everyone said it was good. Then I ate lunch with my team. In the evening, I came home and took a short rest. It was a good day.`,
    readingPassageHi: `Yesterday ek busy din tha. I went to work early. I saw my colleague, aur humari ek meeting had. I made a presentation, aur everyone ne said ki ye good thi. Then I ate lunch apni team ke saath. Evening mein, I came home aur took a short rest. It was a good day.`,

    vocabulary: [
      {
        word: 'went',
        wordHi: 'went (gaya)',
        meaning: 'past tense of "go"',
        meaningHi: '"go" ka past tense',
        example: 'I went to the market yesterday.',
        exampleHi: 'I went to the market yesterday.',
        pronunciation: 'went',
      },
      {
        word: 'had',
        wordHi: 'had (tha/tha kiya)',
        meaning: 'past tense of "have"',
        meaningHi: '"have" ka past tense',
        example: 'We had a great time at the party.',
        exampleHi: 'We had a great time at the party.',
        pronunciation: 'had',
      },
      {
        word: 'saw',
        wordHi: 'saw (dekha)',
        meaning: 'past tense of "see"',
        meaningHi: '"see" ka past tense',
        example: 'I saw an old friend today.',
        exampleHi: 'I saw an old friend today.',
        pronunciation: 'saw',
      },
      {
        word: 'took',
        wordHi: 'took (liya)',
        meaning: 'past tense of "take"',
        meaningHi: '"take" ka past tense',
        example: 'I took a break after lunch.',
        exampleHi: 'I took a break after lunch.',
        pronunciation: 'took',
      },
    ],

    examples: [
      {
        title: 'Ten irregular verbs used in real, connected sentences',
        titleHi: 'Das irregular verbs real, connected sentences mein use hue',
        code: `I went to the gym. I did my exercises, and then I had breakfast. I saw a friend on the way home, and we talked for a while. She said she made a new dish yesterday and took a photo of it.`,
        output: 'Nine irregular verbs, none following the "-ed" pattern.',
        explain:
          'Notice none of these use "-ed" at all — this is a good passage to read aloud repeatedly until these ten forms start feeling automatic rather than requiring conscious translation.',
        explainHi:
          'Notice karo in mein se koi bhi "-ed" use nahi karta — ye ek achha passage hai baar-baar zor se padhne ke liye jab tak ye das forms automatic feel na hone lagein conscious translation maangne ke bajaye.',
      },
      {
        title: 'The completely natural "goed" mistake, and its fix',
        titleHi: 'Completely natural "goed" mistake, aur uska fix',
        code: `Wrong (but very logical): I goed to school yesterday.
Right: I went to school yesterday.`,
        output: 'A perfectly logical rule application that English simply doesn\'t allow here.',
        explain:
          'This mistake follows the "-ed" rule perfectly — the problem is entirely that "go" refuses to follow it. This is worth remembering as one specific verb to watch for, not a sign of a deeper misunderstanding.',
        explainHi:
          'Ye mistake "-ed" rule ko perfectly follow karta hai — problem poori tarah ye hai ki "go" ise follow karne se mana kar deta hai. Ise ek specific verb ki tarah yaad rakhna worth hai jispe dhyan dena hai, ek deeper misunderstanding ka sign nahi.',
      },
    ],

    mistakes: [
      {
        wrong: '"I goed to the market." / "I seed my friend." / "I doed my homework."',
        right: '"I went to the market." / "I saw my friend." / "I did my homework."',
        why: 'These verbs are irregular and simply don\'t take "-ed" — there\'s no rule to apply here, only memorization. This mistake is completely logical and extremely common while learning.',
        whyHi: 'Ye verbs irregular hain aur simply "-ed" nahi lete — yahan apply karne ke liye koi rule nahi hai, sirf memorization hai. Ye mistake completely logical hai aur seekhte waqt extremely common hai.',
      },
      {
        wrong: '"I have went to the market yesterday."',
        right: '"I went to the market yesterday." (simple past, no "have")',
        why: 'Mixing "have" with simple past (rather than a proper past participle in present perfect) is a common overlap error. For a simple, finished action at a specific past time ("yesterday"), simple past alone is correct — no "have" needed.',
        whyHi: '"have" ko simple past ke saath mix karna (present perfect mein ek proper past participle ki jagah) ek common overlap error hai. Ek simple, finished action ke liye ek specific past time pe ("yesterday"), akela simple past correct hai — koi "have" ki zaroorat nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Almost every story about your own life** — where you went, what you had, who you saw, what you did — depends on these exact ten irregular verbs, making them some of the highest-value words to memorize in the entire language.',
        hi: '**Apni zindagi ke baare mein almost har story** — tum kahan gaye, tumne kya khaya, tumne kise dekha, tumne kya kiya — exactly in das irregular verbs pe depend karti hai, inhe poori language mein memorize karne ke liye kuch sabse highest-value words banate hue.',
      },
      {
        en: '**Job interviews asking about past experience** ("Tell me about a time you...") are answered almost entirely using irregular past tense — "I saw a problem, I made a plan, and I took action."',
        hi: '**Job interviews jo past experience ke baare mein poochhte hain** ("Tell me about a time you...") almost poori tarah irregular past tense use karke answer hote hain — "I saw a problem, I made a plan, and I took action."',
      },
    ],

    interviewQA: [
      {
        q: 'Is there any trick or pattern to help remember irregular verbs faster?',
        qHi: 'Kya koi trick ya pattern hai jo irregular verbs jaldi yaad karne mein help kare?',
        a: "Not a rule, but a few loose groupings help: some change a vowel sound (sing→sang, drink→drank), some stay exactly the same (put→put, cut→cut), and some change completely (go→went, see→saw). Grouping by these loose patterns, and practicing in real sentences rather than isolated pairs, both help memory more than trying to find a strict rule.",
        aHi: "Ek rule nahi, par kuch loose groupings help karti hain: kuch ek vowel sound change karte hain (sing→sang, drink→drank), kuch exactly same rehte hain (put→put, cut→cut), aur kuch completely change hote hain (go→went, see→saw). In loose patterns se group karna, aur isolated pairs ke bajaye real sentences mein practice karna, dono memory ko ek strict rule dhoondne se zyada help karte hain.",
      },
      {
        q: 'How many irregular verbs are there in total? Do I need to learn all of them?',
        qHi: 'Total kitne irregular verbs hain? Kya mujhe sab seekhne padenge?',
        a: "English has around 150-200 commonly used irregular verbs, but you don't need all of them at once. The roughly 20-30 most frequent ones (like the ten in this lesson) cover the vast majority of everyday spoken conversation — learn those solidly first, and pick up the rest gradually as you encounter them.",
        aHi: "English mein around 150-200 commonly used irregular verbs hain, par tumhe ek saath sab ki zaroorat nahi. Roughly 20-30 sabse frequent wale (jaise is lesson ke das) everyday spoken conversation ka vast majority cover karte hain — pehle unhe solidly seekho, aur baaki gradually pick up karo jaise tum unhe encounter karo.",
      },
    ],

    exercises: [
      {
        task: 'Out loud, say the past tense of all ten verbs from this lesson without looking: go, have, see, do, eat, make, take, get, come, say.',
        taskHi: 'Zor se, is lesson ke sab das verbs ka past tense bina dekhe bolo: go, have, see, do, eat, make, take, get, come, say.',
        hint: 'went, had, saw, did, ate, made, took, got, came, said',
        hintHi: 'went, had, saw, did, ate, made, took, got, came, said',
      },
      {
        task: 'Out loud, describe yesterday using at least five of these ten irregular verbs in real sentences about your own day.',
        taskHi: 'Zor se, kal ko describe karo in das irregular verbs mein se kam se kam paanch use karke apne real din ke sentences mein.',
        hint: '"Yesterday, I went to... I had... I saw... I did... I made..."',
        hintHi: '"Yesterday, I went to... I had... I saw... I did... I made..."',
      },
    ],

    keyTakeaways: [
      'Irregular verbs (go→went, have→had, see→saw...) don\'t follow the "-ed" rule and must be memorized individually.',
      '"Goed," "seed," and "doed" are completely logical, extremely common mistakes — not a sign of deeper confusion.',
      'The ten verbs in this lesson (go, have, see, do, eat, make, take, get, come, say) are among the most frequently used verbs in English.',
      'Learning irregular verbs inside real sentences sticks better than memorizing isolated word pairs.',
      'Simple past never needs "have" in front of it for a finished action at a specific past time — "I went," not "I have went."',
    ],
    keyTakeawaysHi: [
      'Irregular verbs (go→went, have→had, see→saw...) "-ed" rule follow nahi karte aur individually memorize karne padte hain.',
      '"Goed," "seed," aur "doed" completely logical, extremely common mistakes hain — deeper confusion ka sign nahi.',
      'Is lesson ke das verbs (go, have, see, do, eat, make, take, get, come, say) English ke sabse frequently used verbs mein se hain.',
      'Irregular verbs ko real sentences ke andar seekhna isolated word pairs memorize karne se better stick karta hai.',
      'Simple past ko kabhi "have" apne aage ki zaroorat nahi ek finished action ke liye ek specific past time pe — "I went," "I have went" nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-telling-a-story-in-the-past',
    title: 'Telling a Short Story — Staying in the Past',
    titleHi: 'Ek Chhoti Story Batana — Past Mein Rehna',
    description:
      'The specific slip that happens once a story gets past two sentences: sliding back into present tense halfway through without noticing.',
    descriptionHi:
      'Wo specific slip jo hota hai jab ek story do sentences se aage jaati hai: bina notice kiye beech mein present tense mein wapas slide ho jaana.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**Telling a story is driving in one lane — once you\'re in the past-tense lane, every verb should stay in it until the story ends.** Drifting into the present-tense lane halfway through a story is like a car drifting across a road: each individual movement might feel small, but the listener genuinely feels the story lose its footing.',
      hi: 'Ek story batana ek lane mein drive karna hai — ek baar tum past-tense lane mein ho, har verb ko usme rehna chahiye jab tak story khatam na ho. Story ke beech mein present-tense lane mein drift karna ek car ke road pe drift karne jaisa hai: har individual movement chhota feel ho sakta hai, par listener genuinely feel karta hai ki story apna footing kho rahi hai.',
    },

    simple: `**Once a story starts in the past, every main verb stays in the
past — all the way to the end.**

Wrong: "Yesterday, I went to the market. I see my friend there, and
we talk for a while."

Right: "Yesterday, I went to the market. I saw my friend there, and
we talked for a while."

**A story usually needs three parts, all in past tense:**

1. **Set the scene**: "Last weekend, I visited my grandmother's
   house."
2. **What happened**: "We cooked together, and she told me an old
   family story."
3. **How it ended / how you felt**: "It was a wonderful day, and I
   felt really happy."

**Time words help signal you're still in the story, not switching
back to now**: "then," "after that," "later," "finally," "in the
end."`,
    simpleHi: `**Ek baar story past mein start hoti hai, har main verb past mein
rehta hai — bilkul end tak.**

Wrong: "Yesterday, I went to the market. I see my friend there, and
we talk for a while."

Right: "Yesterday, I went to the market. I saw my friend there, and
we talked for a while."

**Ek story ko usually teen parts chahiye, sab past tense mein:**

1. **Scene set karo**: "Last weekend, I visited my grandmother's
   house."
2. **Kya hua**: "We cooked together, and she told me an old family
   story."
3. **Kaise end hui / kaisa feel hua**: "It was a wonderful day, and I
   felt really happy."

**Time words signal karne mein help karte hain ki tum abhi bhi story
mein ho, ab pe switch nahi kiya**: "then," "after that," "later,"
"finally," "in the end."`,

    content: `**Why the tense-drift happens specifically as a story gets longer.**

For a single short sentence ("I went to the market"), staying in past
tense is easy — there's only one verb to keep track of. But as a story
grows to three, four, or five sentences, especially while thinking on
your feet in a second language, it's genuinely common for the mental
effort of finding the next word to pull you back toward present tense,
which usually requires less conscious effort to produce. This isn't a
sign of weak grammar knowledge — it's a natural effect of doing two
hard things at once (recalling events AND managing tense).

**The fix is a habit, not a rule to consciously apply mid-sentence.**
Before telling a longer story, briefly deciding "this whole thing
happened in the past" and holding that frame for the full story —
rather than deciding tense sentence by sentence — measurably reduces
drift. This is the same skill as staying in a single language while
speaking, rather than switching mid-sentence out of habit.

**A well-told short story has a shape, not just a sequence of facts.**
Scene → events → ending/feeling is a structure familiar from Hindi
storytelling too — the skill being taught here is keeping the English
tense consistent throughout that already-familiar shape, not learning
storytelling itself from scratch.

**One exception worth knowing**: a general truth or an unchanging fact
mentioned INSIDE a past-tense story can correctly stay in present
tense. "I told her that Mumbai is a big city" — "is" stays present
because Mumbai being a big city is still true now, even though the
telling happened in the past. This is a genuine exception, not a
mistake, and native speakers do it naturally without thinking about
it.`,
    contentHi: `**Story lambi hone ke saath tense-drift specifically kyun hota hai.**

Ek single short sentence ke liye ("I went to the market"), past tense
mein rehna easy hai — track karne ke liye sirf ek verb hai. Par jaise
jaise story teen, chaar, ya paanch sentences tak badhti hai, especially
ek second language mein apne feet pe thinking karte waqt, ye genuinely
common hai ki next word dhoondhne ka mental effort tumhe present tense
ki taraf wapas kheenche, jise usually produce karne mein kam conscious
effort chahiye hota hai. Ye weak grammar knowledge ka sign nahi hai —
ye ek natural effect hai do hard cheezein ek saath karne ka (events
recall karna AUR tense manage karna).

**Fix ek habit hai, koi rule nahi jise mid-sentence consciously apply
karna hai.** Ek lambi story batane se pehle, briefly decide karna "ye
poori cheez past mein hui thi" aur us frame ko poori story ke liye
hold karna — sentence by sentence tense decide karne ke bajaye —
measurably drift kam karta hai. Ye same skill hai ek single language
mein rehne ki bolte waqt, habit se mid-sentence switch karne ke
bajaye.

**Ek achhi tarah batayi gayi chhoti story ka ek shape hota hai, sirf
facts ki ek sequence nahi.** Scene → events → ending/feeling ek
structure hai jo Hindi storytelling se bhi familiar hai — yahan jo
skill sikhaya ja raha hai wo English tense ko us already-familiar shape
mein consistent rakhna hai, storytelling khud scratch se seekhna nahi.

**Ek exception janne layak**: ek general truth ya ek unchanging fact
jo ek past-tense story ke ANDAR mention hoti hai correctly present
tense mein reh sakti hai. "I told her that Mumbai is a big city" —
"is" present rehta hai kyunki Mumbai ka big city hona ab bhi true hai,
chahe telling past mein hui ho. Ye ek genuine exception hai, mistake
nahi, aur native speakers ise naturally karte hain bina soche.`,

    readingPassage: `Last weekend, I visited my grandmother's house in the village. When I arrived, she was very happy to see me. We cooked together, and she told me an old story about our family. Then we sat outside and watched the sunset. Later, we had dinner together, and we talked for hours. It was a wonderful day, and I felt really happy when I finally went to bed.`,
    readingPassageHi: `Last weekend, main apni grandmother ke ghar village mein visited. Jab main arrived, wo mujhe dekh kar bahut happy thi. We cooked together, aur usne mujhe humari family ke baare mein ek old story batayi. Then hum bahar baithe aur sunset dekha. Later, humne dinner saath mein kiya, aur hum ghanton talked. It was a wonderful day, aur main finally jab bed pe gaya to mujhe really happy feel hua.`,

    vocabulary: [
      {
        word: 'arrived',
        wordHi: 'arrived (pahuncha)',
        meaning: 'past tense of "arrive" — to reach a place',
        meaningHi: '"arrive" ka past tense — ek jagah pahunchna',
        example: 'I arrived at the station on time.',
        exampleHi: 'I arrived at the station on time.',
        pronunciation: 'uh-RYVD',
      },
      {
        word: 'sunset',
        wordHi: 'sunset (sooryast)',
        meaning: 'the time when the sun goes down in the evening',
        meaningHi: 'wo time jab evening mein sooraj dhalta hai',
        example: 'We watched a beautiful sunset together.',
        exampleHi: 'We watched a beautiful sunset together.',
        pronunciation: 'SUN-set',
      },
      {
        word: 'felt',
        wordHi: 'felt (mehsoos hua)',
        meaning: 'past tense of "feel"',
        meaningHi: '"feel" ka past tense',
        example: 'I felt very happy that day.',
        exampleHi: 'I felt very happy that day.',
        pronunciation: 'felt',
      },
      {
        word: 'wonderful',
        wordHi: 'wonderful (adbhut)',
        meaning: 'extremely good or pleasant',
        meaningHi: 'extremely achha ya pleasant',
        example: 'It was a wonderful trip.',
        exampleHi: 'It was a wonderful trip.',
        pronunciation: 'WUN-der-ful',
      },
    ],

    examples: [
      {
        title: 'A complete, tense-consistent short story',
        titleHi: 'Ek complete, tense-consistent chhoti story',
        code: `Last month, I went on a trip to Goa. First, I explored the beaches, and then I tried some local food. I met some interesting people there, and we became good friends. Finally, I came back home with wonderful memories.`,
        output: 'Every single verb stays in past tense from start to finish.',
        explain:
          'Notice the clear three-part shape (scene, events, ending) and that not one verb drifts into present tense — this is the exact pattern to copy for your own stories.',
        explainHi:
          'Notice karo clear three-part shape (scene, events, ending) aur ki ek bhi verb present tense mein drift nahi hota — ye exact pattern hai apni stories ke liye copy karne ka.',
      },
      {
        title: 'The genuine exception: a present-tense fact inside a past story',
        titleHi: 'Genuine exception: ek past story ke andar ek present-tense fact',
        code: `I visited Paris last year. I told my friends that the Eiffel Tower is even bigger than it looks in photos.`,
        output: '"visited" and "told" are past; "is" correctly stays present because it\'s still true now.',
        explain:
          'This is not a mistake — a fact that remains true at the time of speaking correctly stays in present tense even inside a past-tense story, exactly the way it would in Hindi too.',
        explainHi:
          'Ye ek mistake nahi hai — ek fact jo bolte waqt bhi true rehta hai correctly present tense mein rehta hai ek past-tense story ke andar bhi, exactly jaise Hindi mein bhi hota.',
      },
    ],

    mistakes: [
      {
        wrong: '"Yesterday, I went to the market. I see my friend, and we talk for a while."',
        right: '"Yesterday, I went to the market. I saw my friend, and we talked for a while."',
        why: 'Once a story establishes past tense in the first sentence, every following main verb needs to stay in past tense too — drifting to present tense partway through is a very common effect of the extra mental effort of storytelling in a second language, not a sign of weak grammar.',
        whyHi: 'Ek baar ek story pehle sentence mein past tense establish karti hai, har following main verb ko bhi past tense mein rehna chahiye — beech mein present tense mein drift karna ek second language mein storytelling ke extra mental effort ka ek bahut common effect hai, weak grammar ka sign nahi.',
      },
      {
        wrong: 'Never using time words like "then," "after that," or "later" in a multi-event story',
        right: 'Use them to signal you\'re still narrating the same past story: "Then we...", "After that, I..."',
        why: 'Without these connectors, a series of past-tense sentences can feel like disconnected facts rather than one flowing story, even though the tense itself is correct.',
        whyHi: 'In connectors ke bina, past-tense sentences ki ek series disconnected facts jaisi feel ho sakti hai ek flowing story ki jagah, chahe tense khud correct ho.',
      },
    ],

    realWorld: [
      {
        en: '**Sharing a vacation, a weekend, or a memorable event with friends or colleagues** is one of the most natural, frequent uses of storytelling in everyday English — and the single place tense-drift is most likely to happen as excitement builds.',
        hi: '**Ek vacation, ek weekend, ya ek memorable event friends ya colleagues ke saath share karna** everyday English mein storytelling ke sabse natural, frequent uses mein se ek hai — aur wo single jagah jahan excitement badhne ke saath tense-drift sabse zyada hone ki possibility hoti hai.',
      },
      {
        en: '**Answering a behavioral interview question** ("Tell me about a time you solved a difficult problem") is essentially a request for exactly this three-part story structure, told entirely and consistently in the past.',
        hi: '**Ek behavioral interview question answer karna** ("Tell me about a time you solved a difficult problem") essentially exactly is three-part story structure ki request hai, poori tarah aur consistently past mein batayi gayi.',
      },
    ],

    interviewQA: [
      {
        q: "If I catch myself drifting into present tense mid-story, what should I do — stop and correct myself, or keep going?",
        qHi: "Agar main khud ko story ke beech mein present tense mein drift karte hue pakadta hoon, mujhe kya karna chahiye — rukhna aur khud ko correct karna, ya chalte rehna?",
        a: "A quick, brief self-correction (\"I see— I mean, I saw my friend\") is completely normal and actually sounds more natural than freezing up, because it's exactly what native speakers do too when they catch a slip. Don't stop the whole story over it — a fluent speaker corrects small slips on the fly and keeps moving.",
        aHi: "Ek quick, brief self-correction (\"I see— I mean, I saw my friend\") completely normal hai aur actually freeze hone se zyada natural sound karta hai, kyunki ye exactly wahi hai jo native speakers bhi karte hain jab wo ek slip pakadte hain. Poori story ise leke mat roko — ek fluent speaker chhote slips ko on the fly correct karta hai aur aage badhta rehta hai.",
      },
      {
        q: "Why did 'is' stay present tense in \"I told them the Eiffel Tower is huge\" — shouldn't everything in a past story be past tense?",
        qHi: "\"I told them the Eiffel Tower is huge\" mein 'is' present tense mein kyun raha — kya past story mein sab kuch past tense mein nahi hona chahiye?",
        a: "The general rule (stay in past tense) applies to the events of the story itself. A fact that is still true right now, independent of the story, correctly stays in present tense — the Eiffel Tower being huge didn't stop being true just because you're now telling a story about visiting it in the past.",
        aHi: "General rule (past tense mein raho) story ke events pe khud apply hota hai. Ek fact jo abhi bhi true hai, story se independent, correctly present tense mein rehta hai — Eiffel Tower ka huge hona true hona band nahi hua sirf isliye kyunki tum ab usko visit karne ke baare mein ek past story bata rahe ho.",
      },
    ],

    exercises: [
      {
        task: 'Out loud, tell a short, three-part story (scene, events, ending/feeling) about something that happened to you last week, keeping every verb in the past.',
        taskHi: 'Zor se, ek chhoti, three-part story batao (scene, events, ending/feeling) kisi cheez ke baare mein jo pichhle hafte hui, har verb ko past mein rakhte hue.',
        hint: 'Start with a time phrase ("Last week..."), and use at least one connector like "then" or "after that" between events.',
        hintHi: 'Ek time phrase se start karo ("Last week..."), aur events ke beech kam se kam ek connector use karo jaise "then" ya "after that".',
      },
      {
        task: 'Say this corrected out loud: "Last night, I go to a restaurant. I order pizza, and it tastes amazing." Find and fix the tense drift.',
        taskHi: 'Ise zor se correct karke bolo: "Last night, I go to a restaurant. I order pizza, and it tastes amazing." Tense drift dhoondo aur fix karo.',
        hint: '"Last night, I went to a restaurant. I ordered pizza, and it tasted amazing."',
        hintHi: '"Last night, I went to a restaurant. I ordered pizza, and it tasted amazing."',
      },
    ],

    keyTakeaways: [
      'Once a story starts in past tense, every main verb should stay in the past all the way to the end.',
      'Drifting into present tense mid-story is a common, natural effect of the extra mental effort of storytelling in a second language — not a sign of weak grammar.',
      'A short story has a shape: scene, events, ending/feeling — all told in past tense.',
      'Time words (then, after that, later, finally) signal you\'re still narrating the same story.',
      'A fact still true right now can correctly stay in present tense even inside a past-tense story ("I told her Mumbai is a big city").',
    ],
    keyTakeawaysHi: [
      'Ek baar story past tense mein start hoti hai, har main verb ko bilkul end tak past mein rehna chahiye.',
      'Story ke beech present tense mein drift karna ek second language mein storytelling ke extra mental effort ka ek common, natural effect hai — weak grammar ka sign nahi.',
      'Ek chhoti story ka ek shape hota hai: scene, events, ending/feeling — sab past tense mein batayi gayi.',
      'Time words (then, after that, later, finally) signal karte hain ki tum abhi bhi same story narrate kar rahe ho.',
      'Ek fact jo abhi bhi true hai correctly present tense mein reh sakta hai ek past-tense story ke andar bhi ("I told her Mumbai is a big city").',
    ],
  },
];
