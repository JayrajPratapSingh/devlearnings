/**
 * English Speaking Complete Course — Module 1: How English Sounds &
 * Meeting People, lessons 1-3.
 *
 * Lesson 1: The specific sounds and rhythm that trip up a Hindi-speaking
 *           learner, and why fixing them changes how confident you sound.
 * Lesson 2: Greetings — the ritual phrases every conversation opens with.
 * Lesson 3: Introducing yourself, cleanly, the first time you meet someone.
 *
 * This is the opening module of the whole course, so vocabulary stays
 * everyday and every sentence is a single clause — the ramp starts here
 * and builds module by module (see scratchpad/ENGLISH-SPEAKING-COURSE-PLAN.md).
 * Mistakes are chosen deliberately: several are real, common patterns that
 * come specifically from Hindi/Hinglish speakers carrying a Hindi sentence
 * shape into English ("Myself Priya", "What is your good name?"), not
 * generic ESL errors — the corrections are the ones this exact audience
 * actually needs.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_1: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-sounds-pronunciation-basics',
    title: 'How English Sounds — Pronunciation Basics for Confident Speaking',
    titleHi: 'English Kaise Sound Karta Hai — Confident Bolne Ke Liye Pronunciation Basics',
    description:
      'The handful of sounds and the rhythm that actually make English feel hard to a Hindi speaker — and simple, practical fixes for each.',
    descriptionHi:
      'Wo mutthi bhar sounds aur rhythm jo ek Hindi speaker ko English mushkil lagti hai — aur har ek ke liye simple, practical fixes.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Your mouth already makes hundreds of sounds — English just asks for a few new ones.** Learning to speak English well is not learning a brand-new instrument; it is learning three or four new notes on an instrument you have played your whole life. Get those few notes right and everything you already know how to say suddenly sounds clearer.',
      hi: 'Tumhara mooh already sainkdon sounds banata hai — English sirf kuch naye sounds maangti hai. English achhe se bolna seekhna koi bilkul naya instrument seekhna nahi hai; ye teen ya chaar naye notes seekhna hai ek instrument pe jo tum poori zindagi bajate aaye ho. Wo kuch notes sahi kar lo aur jo kuch bhi tumhe pehle se kehna aata hai wo achanak zyada clear sunayi dega.',
    },

    simple: `**Three things make English sound different from Hindi — none of them are hard once you know what to fix.**

**1. The "th" sound.** Hindi doesn't have this sound, so it usually
becomes "d" or "t" — "this" becomes "dis", "think" becomes "tink". The
fix: put the tip of your tongue lightly between your teeth and push air
out. Try it on "this", "that", "think", "three".

**2. "V" and "W" are different sounds.** In Hindi these often blend
into one. "V" bites your bottom lip gently with your top teeth (like
starting to say "f"). "W" rounds your lips like blowing out a candle.
Say "vet" and "wet" — your mouth should feel different for each.

**3. English rhythm is uneven on purpose.** Hindi gives most syllables
roughly equal time. English squeezes the small words together and
stretches the important ones: "I want to GO to the STORE" — "want to"
almost disappears, "GO" and "STORE" get the stress. This is why fast
English can sound like it's running words together — it is, on
purpose, and copying that rhythm makes you sound more natural, not
less clear.`,
    simpleHi: `**Teen cheezein English ko Hindi se alag sound karati hain — ek bhi mushkil nahi hai jab pata chal jaye kya fix karna hai.**

**1. "th" sound.** Hindi mein ye sound hai hi nahi, isliye ye usually
"d" ya "t" ban jaata hai — "this" "dis" ban jaata hai, "think" "tink"
ban jaata hai. Fix: apni tongue ki tip halke se apne daanton ke beech
mein rakho aur air push karo. "this", "that", "think", "three" pe try
karo.

**2. "V" aur "W" alag sounds hain.** Hindi mein ye often ek mein blend
ho jaate hain. "V" apne top teeth se bottom lip ko halke se bite karta
hai (jaise "f" bolna start karna). "W" lips ko round karta hai jaise
candle bujha rahe ho. "vet" aur "wet" bolo — tumhara mooh dono ke liye
alag feel hona chahiye.

**3. English ka rhythm jaan-boojh kar uneven hai.** Hindi mostly har
syllable ko roughly equal time deti hai. English chhote words ko squeeze
kar deti hai aur important words ko stretch karti hai: "I want to GO to
the STORE" — "want to" almost gayab ho jaata hai, "GO" aur "STORE" ko
stress milta hai. Isi liye fast English words ko ek saath chalate hue
lagti hai — chalati hai, jaan-boojh kar, aur us rhythm ko copy karna
tumhe zyada natural sound karwata hai, kam clear nahi.`,

    content: `**Why this is the very first lesson, before any grammar.**

You can know every grammar rule in this course and still feel
unconfident speaking if the sounds coming out don't match what you
hear native speakers make. Fixing pronunciation early means every
lesson after this one is practice you can actually hear yourself
improving on — not just words on a page.

**Word stress changes meaning, not just sound.** English has many
words that are spelled the same but stressed differently depending on
whether they're a noun or a verb: **RE**cord (noun, "I bought a
record") vs. re**CORD** (verb, "Please record this"). **PRE**sent
(noun/adjective) vs. pre**SENT** (verb). Getting the stress wrong
doesn't just sound odd — it can genuinely confuse the listener about
which meaning you mean.

**Silent letters are not exceptions to memorize one by one — they
follow patterns.** "kn" at the start of a word is always silent (know,
knee, knife). "wr" at the start is always silent (write, wrong,
wrist). "gh" after a vowel is often silent (though, night, light).
Once you know these three patterns, dozens of "weird" words stop being
surprising.

**Sentence stress carries emotion and emphasis.** "I didn't say she
took the money" can mean six different things depending on which word
you stress — try saying it while stressing a different word each time.
This is a real, powerful tool: you don't need fancier vocabulary to
sound more expressive, you need to stress the right word.`,
    contentHi: `**Ye lesson sabse pehle kyun hai, kisi bhi grammar se pehle.**

Tumhe is course ki har grammar rule pata ho sakti hai aur phir bhi bolte
waqt unconfident feel ho sakta hai agar jo sounds nikal rahe hain wo un
sounds se match nahi karte jo native speakers banate sunayi dete hain.
Pronunciation ko jaldi fix karna matlab is lesson ke baad har lesson
practice hai jispe tum genuinely apne aap ko improve hote sun sakte ho —
sirf page pe words nahi.

**Word stress meaning change karta hai, sirf sound nahi.** English mein
kayi words spelling mein same hote hain par stress alag hota hai depending
ki wo noun hai ya verb: **RE**cord (noun, "I bought a record") vs.
re**CORD** (verb, "Please record this"). Stress galat karna sirf odd
sound nahi karta — ye genuinely listener ko confuse kar sakta hai ki
tumhara matlab kaunsa meaning hai.

**Silent letters ek-ek karke yaad karne wale exceptions nahi hain — ye
patterns follow karte hain.** Word ki shuruaat mein "kn" hamesha silent
hota hai (know, knee, knife). Shuruaat mein "wr" hamesha silent hota hai
(write, wrong, wrist). Vowel ke baad "gh" often silent hota hai (though,
night, light). Ek baar ye teen patterns pata chal jaayein, dozens "weird"
words surprising nahi rehte.

**Sentence stress emotion aur emphasis carry karta hai.** "I didn't say
she took the money" chhe alag cheezein mean kar sakta hai depending ki
kaunsa word stress kiya — har baar alag word stress karke bolo aur try
karo. Ye ek real, powerful tool hai: expressive sound karne ke liye
fancier vocabulary nahi chahiye, sahi word stress karna chahiye.`,

    readingPassage: `Good morning! Today I want to think about three small words: this, that, and three. Say them slowly. Put your tongue between your teeth for the "th" sound. This is not very hard. It just feels strange at first. Very soon, it will feel natural. I know it will, because I have seen it work well for many learners before you.`,
    readingPassageHi: `Good morning! Aaj main teen chhote words ke baare mein sochna chahta hoon: this, that, aur three. Inhe slowly bolo. "Th" sound ke liye apni tongue ko apne daanton ke beech mein rakho. Ye bahut hard nahi hai. Bas shuru mein strange feel hota hai. Bahut jald, ye natural feel karega. Mujhe pata hai ye hoga, kyunki maine ye tumse pehle kayi learners ke liye achhe se kaam karte dekha hai.`,

    vocabulary: [
      {
        word: 'think',
        wordHi: 'think (sochna)',
        meaning: 'to have an idea or opinion in your mind',
        meaningHi: 'mann mein koi idea ya opinion hona',
        example: 'I think this class will help you a lot.',
        exampleHi: 'I think this class will help you a lot. (Mujhe lagta hai ye class tumhari bahut help karegi.)',
        pronunciation: 'thingk (tongue between teeth for "th")',
      },
      {
        word: 'this / that',
        wordHi: 'this / that (ye / wo)',
        meaning: 'this = close to you, that = further away',
        meaningHi: 'this = tumhare paas, that = thoda door',
        example: 'This book is mine, that one is yours.',
        exampleHi: 'This book is mine, that one is yours. (Ye kitaab meri hai, wo tumhari hai.)',
        pronunciation: 'dhis / dhat (voiced "th", tongue between teeth)',
      },
      {
        word: 'very',
        wordHi: 'very (bahut)',
        meaning: 'to a great degree; a lot',
        meaningHi: 'bahut zyada',
        example: 'This sound is very easy once you practice.',
        exampleHi: 'This sound is very easy once you practice. (Ye sound bahut easy hai practice karne ke baad.)',
        pronunciation: 'VEH-ree (top teeth touch bottom lip, not "w")',
      },
      {
        word: 'well',
        wordHi: 'well (achhe se)',
        meaning: 'in a good or satisfactory way',
        meaningHi: 'achhe tareeke se',
        example: 'You are speaking well already.',
        exampleHi: 'You are speaking well already. (Tum already achhe se bol rahe ho.)',
        pronunciation: 'wel (round your lips like blowing a candle)',
      },
      {
        word: 'know',
        wordHi: 'know (jaanna)',
        meaning: 'to have information or understanding about something',
        meaningHi: 'kisi cheez ke baare mein information ya samajh hona',
        example: 'I know this word looks tricky, but the "k" is silent.',
        exampleHi: 'I know this word looks tricky, but the "k" is silent. (Mujhe pata hai ye word tricky lagta hai, par "k" silent hai.)',
        pronunciation: 'noh (the "k" is completely silent)',
      },
    ],

    examples: [
      {
        title: 'Minimal pairs — hearing the difference between V and W',
        titleHi: 'Minimal pairs — V aur W ke beech ka farak sunna',
        code: `vet   →  top teeth touch bottom lip
wet   →  lips round, no teeth touch

vest  →  top teeth touch bottom lip
west  →  lips round, no teeth touch`,
        output: 'Say each pair out loud, feeling where your teeth and lips go.',
        explain:
          'These word pairs sound completely different to a native ear but often collapse into one sound for a Hindi speaker. Practicing pairs like this trains your mouth to make two distinct shapes instead of one in-between shape.',
        explainHi:
          'Ye word pairs native ear ko completely alag sound karte hain par ek Hindi speaker ke liye often ek sound mein collapse ho jaate hain. Aise pairs practice karna tumhare mooh ko do alag shapes banana sikhaata hai, ek beech ka shape nahi.',
      },
      {
        title: 'Word stress changes meaning: noun vs. verb',
        titleHi: 'Word stress meaning change karta hai: noun vs. verb',
        code: `I bought a new REcord.        (noun — the stress is on the FIRST part)
Please reCORD this meeting.   (verb — the stress is on the SECOND part)

I saw the PREsent on the table.   (noun)
I want to preSENT my project.     (verb)`,
        output: 'The spelling never changes — only where the stress falls.',
        explain:
          'Many two-syllable English words follow this exact pattern: noun stress on the first syllable, verb stress on the second. Once you notice it, you start hearing it everywhere.',
        explainHi:
          'Kayi do-syllable English words exactly ye pattern follow karte hain: noun ka stress pehle syllable pe, verb ka stress doosre pe. Ek baar notice karo, phir ye har jagah sunayi dena start ho jaata hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"dis" and "dat" instead of "this" and "that"',
        right: '"this" and "that" — tongue tip lightly between the teeth',
        why: 'This happens because Hindi has no "th" sound, so the mouth substitutes the closest sound it already knows, "d". The fix is purely physical: touch your tongue tip to the back of your top front teeth (or lightly between your teeth) and push air out while making the sound.',
        whyHi: 'Ye hota hai kyunki Hindi mein "th" sound hai hi nahi, isliye mooh apne paas jo closest sound hai, "d", use kar leta hai. Fix purely physical hai: apni tongue ki tip apne top front teeth ke peeche (ya daanton ke beech halke se) touch karo aur sound banate waqt air push karo.',
      },
      {
        wrong: 'Treating every syllable as equally important, like Hindi does',
        right: 'Stress the important word in a sentence and let small words shrink: "I want to GO to the STORE"',
        why: 'Hindi is roughly syllable-timed — each syllable gets similar time. English is stress-timed — stressed syllables land at even intervals and everything else compresses around them. Speaking English with even, syllable-by-syllable timing is a major reason learners feel they sound "flat" or robotic even with correct grammar.',
        whyHi: 'Hindi roughly syllable-timed hai — har syllable ko similar time milta hai. English stress-timed hai — stressed syllables even intervals pe aate hain aur baaki sab unke around compress ho jaata hai. English ko even, syllable-by-syllable timing ke saath bolna ek badi reason hai ki learners "flat" ya robotic sound karte hain sahi grammar hone ke bawajood bhi.',
      },
    ],

    realWorld: [
      {
        en: '**Job interviews and phone calls** are exactly where pronunciation is tested hardest — there is no face, no gestures, and often a bad phone line, so clear "th" and "v/w" sounds, plus the right word stress, directly affect whether you are understood the first time.',
        hi: '**Job interviews aur phone calls** exactly wo jagah hain jahan pronunciation sabse zyada test hoti hai — koi face nahi, koi gestures nahi, aur often ek kharab phone line — isliye clear "th" aur "v/w" sounds, plus sahi word stress, directly affect karte hain ki tumhe pehli baar mein samjha jaata hai ya nahi.',
      },
      {
        en: '**Presentations and meetings** reward correct sentence stress — putting the emphasis on the right word ("we need to finish this by FRIDAY", not "we NEED to finish this by friday") makes your point land the way you intended, without needing louder volume or extra words.',
        hi: '**Presentations aur meetings** sahi sentence stress ko reward karti hain — sahi word pe emphasis dena ("we need to finish this by FRIDAY", "we NEED to finish this by friday" nahi) tumhari baat waise land karati hai jaise tumne intend kiya tha, loudness ya extra words ki zaroorat ke bina.',
      },
    ],

    interviewQA: [
      {
        q: "Why does fast English sound like the speaker is swallowing half the words?",
        qHi: 'Fast English mein aisa kyun lagta hai ki speaker aadhe words nigal raha hai?',
        a: "Because English is stress-timed, not syllable-timed. Small connector words (\"to\", \"a\", \"the\", \"of\") genuinely get compressed and spoken quickly so the stressed, meaningful words can land clearly at even intervals. You are not missing anything — that compression is a real, deliberate feature of spoken English, and copying it (not fighting it) is what makes your own speech sound natural.",
        aHi: 'Kyunki English stress-timed hai, syllable-timed nahi. Chhote connector words ("to", "a", "the", "of") genuinely compress ho jaate hain aur jaldi bole jaate hain taaki stressed, meaningful words even intervals pe clearly land kar sakein. Tum kuch miss nahi kar rahe — wo compression spoken English ka ek real, deliberate feature hai, aur usko copy karna (usse fight nahi karna) hi tumhari apni speech ko natural banata hai.',
      },
      {
        q: 'Do I need to lose my accent completely to sound "good" in English?',
        qHi: 'Kya mujhe English mein "achha" sound karne ke liye apna accent poori tarah kho dena chahiye?',
        a: "No — the goal is clarity, not erasing where you're from. Fixing a handful of sounds that genuinely block understanding (th, v/w, silent letters, word stress) makes you easier to understand everywhere in the world. A visible accent alongside clear, well-stressed speech is completely normal for a fluent speaker.",
        aHi: 'Nahi — goal clarity hai, tum kahan se ho use mitana nahi. Kuch sounds fix karna jo genuinely samajhne mein rukawat daalte hain (th, v/w, silent letters, word stress) tumhe duniya mein har jagah samajhna aasan banata hai. Ek visible accent, clear aur well-stressed speech ke saath, ek fluent speaker ke liye bilkul normal hai.',
      },
    ],

    exercises: [
      {
        task: 'Open the "Read It Out Loud" section above and read the passage three times: once slowly, focusing only on the "th" sound; once at a normal pace; once trying to match natural English rhythm (stress the important words, shrink the small ones).',
        taskHi: 'Upar "Read It Out Loud" section kholo aur passage teen baar padho: ek baar slowly, sirf "th" sound pe focus karke; ek baar normal pace pe; ek baar natural English rhythm match karne ki koshish karke (important words stress karo, chhote words shrink karo).',
        hint: 'Recording yourself on your phone and listening back is the single fastest way to hear the difference between how you think you sound and how you actually sound.',
        hintHi: 'Apne phone pe apne aap ko record karna aur wapas sunna sabse fast tareeka hai ye sunne ka ki tum kaisa sochte ho tum sound karte ho aur actually kaisa sound karte ho.',
      },
      {
        task: 'Say these five word pairs out loud, exaggerating the difference: vet/wet, vest/west, very/wary, vine/wine, van/wan.',
        taskHi: 'In paanch word pairs ko zor se bolo, farak ko exaggerate karte hue: vet/wet, vest/west, very/wary, vine/wine, van/wan.',
        hint: 'For "v", let your top teeth gently touch your bottom lip. For "w", round your lips into an "o" shape with no teeth touching anything.',
        hintHi: '"v" ke liye, apne top teeth ko gently apni bottom lip touch karne do. "w" ke liye, apne lips ko "o" shape mein round karo, koi teeth kisi ko touch na kare.',
      },
    ],

    keyTakeaways: [
      'English has a few sounds Hindi doesn\'t — "th", and a clear "v"/"w" split — and each has a specific, physical fix.',
      'Word stress can change meaning (REcord vs. reCORD) — it is not decoration, it is information.',
      'English is stress-timed: small words compress, stressed words land at even intervals. Copying that rhythm, not fighting it, is what makes speech sound natural.',
      'Silent letters follow patterns ("kn", "wr", "gh") rather than needing to be memorized one at a time.',
      'The goal is clarity, not erasing your accent — a few targeted fixes go a very long way.',
    ],
    keyTakeawaysHi: [
      'English mein kuch sounds hain jo Hindi mein nahi hain — "th", aur ek clear "v"/"w" split — aur har ek ka ek specific, physical fix hai.',
      'Word stress meaning change kar sakta hai (REcord vs. reCORD) — ye decoration nahi hai, ye information hai.',
      'English stress-timed hai: chhote words compress hote hain, stressed words even intervals pe land karte hain. Us rhythm ko copy karna, fight nahi karna, hi speech ko natural banata hai.',
      'Silent letters patterns follow karte hain ("kn", "wr", "gh"), ek-ek karke yaad karne ki zaroorat nahi.',
      'Goal clarity hai, apna accent mitana nahi — kuch targeted fixes bahut door tak le jaate hain.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-greetings-meeting-people',
    title: 'Greetings — Hello, Good Morning & Meeting Someone New',
    titleHi: 'Greetings — Hello, Good Morning Aur Kisi Naye Se Milna',
    description:
      'The ritual phrases every English conversation opens with — and why "How are you?" almost never expects a real answer.',
    descriptionHi:
      'Wo ritual phrases jinse har English conversation shuru hoti hai — aur "How are you?" almost kabhi ek real answer expect kyun nahi karta.',
    difficulty: 'EASY',
    duration: 20,
    order: 2,

    analogy: {
      en: '**Greetings are a handshake, not a form to fill out.** A handshake doesn\'t ask "please describe your current emotional and physical state in detail" — it just says "I see you, we\'re starting this interaction politely." Most English greetings work exactly like that: short, automatic, and about connection, not information.',
      hi: 'Greetings ek handshake hain, koi form nahi jo bharna hai. Ek handshake ye nahi poochta "please apni current emotional aur physical state detail mein describe karo" — ye bas kehta hai "main tumhe dekh raha hoon, hum ye interaction politely start kar rahe hain." Zyadatar English greetings exactly aise hi kaam karti hain: short, automatic, aur connection ke baare mein, information ke baare mein nahi.',
    },

    simple: `**Greetings change with the time of day.**

- Morning (until about noon): **"Good morning!"**
- Afternoon (noon to evening): **"Good afternoon!"**
- Evening: **"Good evening!"**
- Anytime, casual: **"Hi!" / "Hello!" / "Hey!"**

**"How are you?" is a ritual, not a real question.** In almost every
situation, the expected reply is short and positive, then you pass the
question back:

- "How are you?" → **"I'm good, thanks! And you?"**
- "How's it going?" → **"Pretty good, thanks! You?"**

You only give a real, detailed answer if you know the person well and
something is actually wrong — with a stranger, a colleague, or someone
you've just met, keep it short and positive, then move the
conversation forward.

**Saying goodbye also has its own short phrases:**

"See you later!" · "Take care!" · "Have a good day!" · "Bye!"`,
    simpleHi: `**Greetings din ke time ke hisaab se change hoti hain.**

- Morning (dopahar tak): **"Good morning!"**
- Afternoon (dopahar se shaam tak): **"Good afternoon!"**
- Evening: **"Good evening!"**
- Kabhi bhi, casual: **"Hi!" / "Hello!" / "Hey!"**

**"How are you?" ek ritual hai, real question nahi.** Almost har situation
mein, expected reply short aur positive hota hai, phir tum question wapas
pass karte ho:

- "How are you?" → **"I'm good, thanks! And you?"**
- "How's it going?" → **"Pretty good, thanks! You?"**

Tum sirf tab ek real, detailed answer doge jab tum us person ko achhe se
jaante ho aur actually kuch galat hai — ek stranger, colleague, ya kisi
se abhi mile ho unke saath, short aur positive raho, phir conversation ko
aage badhao.

**Goodbye kehne ki bhi apni short phrases hain:**

"See you later!" · "Take care!" · "Have a good day!" · "Bye!"`,

    content: `**Formal vs. informal — reading the room.**

English greetings shift depending on who you're talking to. With a
boss, a client, or someone much older, lean formal: "Good morning,
how are you today?" With a friend or someone your own age in a casual
setting, "Hey! What's up?" is completely normal. Neither is more
"correct" English — they're correct for different situations, exactly
like Hindi shifts between "aap" and "tum".

**"What's up?" doesn't ask what's literally happening.** Like "How are
you?", this is another ritual greeting, usually answered with "Not
much, you?" or "Just working, you?" — a real detailed update is not
expected unless something genuinely new happened.

**A greeting is often followed immediately by a small, harmless
comment** — about the weather, the day, traffic — before getting to
the real topic. "Good morning! Crazy traffic today, right? Anyway, I
wanted to ask you about..." This small bridge is not filler to be
skipped; leaving it out and jumping straight to business can come
across as abrupt, even if your grammar is perfect.

**One real, common trap for Hindi speakers: "What is your good
name?"** This phrase, direct from Hindi's "aapka shubh naam," doesn't
exist in natural English and sounds noticeably odd to a native
listener — "good name" isn't a phrase they use. Simply "What's your
name?" or the more polite "May I know your name?" does the same job
naturally.`,
    contentHi: `**Formal vs. informal — room ko read karna.**

English greetings shift karti hain depending on tum kis se baat kar rahe
ho. Ek boss, client, ya kisi bahut older person ke saath, formal lean
karo: "Good morning, how are you today?" Ek friend ya apni age ke kisi
ke saath casual setting mein, "Hey! What's up?" bilkul normal hai. Koi
bhi zyada "correct" English nahi hai — dono alag situations ke liye
correct hain, exactly jaise Hindi "aap" aur "tum" ke beech shift karti
hai.

**"What's up?" literally nahi poochta ki kya ho raha hai.** "How are
you?" ki tarah, ye bhi ek ritual greeting hai, usually "Not much, you?"
ya "Just working, you?" se answer hoti hai — ek real detailed update
expected nahi hai jab tak genuinely kuch naya na hua ho.

**Ek greeting ke turant baad often ek chhota, harmless comment aata
hai** — weather, din, traffic ke baare mein — asli topic pe pahunchne se
pehle. "Good morning! Crazy traffic today, right? Anyway, I wanted to
ask you about..." Ye chhota bridge skip karne wala filler nahi hai; ise
chhod kar seedha business pe jump karna abrupt lag sakta hai, chahe
tumhari grammar perfect ho.

**Ek real, common trap Hindi speakers ke liye: "What is your good
name?"** Ye phrase, seedha Hindi ke "aapka shubh naam" se, natural
English mein exist hi nahi karta aur ek native listener ko noticeably
odd lagta hai — "good name" ek phrase hi nahi hai jo wo use karte hain.
Simply "What's your name?" ya zyada polite "May I know your name?" wahi
kaam naturally kar deta hai.`,

    readingPassage: `Good morning! It's a nice day today. I see my neighbor near my door. "Good morning!" I say. "How are you?" She says, "I'm good, thanks! And you?" I say, "I'm good too, thanks." We talk for one minute about the weather. Then I say, "Have a good day! See you later." She says, "You too! Take care!"`,
    readingPassageHi: `Good morning! Aaj ek nice day hai. Main apne neighbor ko apne door ke paas dekhta hoon. "Good morning!" main kehta hoon. "How are you?" Wo kehti hai, "I'm good, thanks! And you?" Main kehta hoon, "I'm good too, thanks." Hum ek minute weather ke baare mein baat karte hain. Phir main kehta hoon, "Have a good day! See you later." Wo kehti hai, "You too! Take care!"`,

    vocabulary: [
      {
        word: 'greeting',
        wordHi: 'greeting (abhivadan)',
        meaning: 'a polite word or phrase said when meeting someone',
        meaningHi: 'ek polite word ya phrase jo kisi se milte waqt bola jaata hai',
        example: '"Good morning" is a common greeting.',
        exampleHi: '"Good morning" ek common greeting hai.',
        pronunciation: 'GREE-ting',
      },
      {
        word: 'How are you?',
        wordHi: 'How are you? (Tum kaise ho?)',
        meaning: 'a standard greeting question, usually expecting a short, positive reply',
        meaningHi: 'ek standard greeting question, usually ek short, positive reply expect karta hai',
        example: '"How are you?" — "I\'m good, thanks! And you?"',
        exampleHi: '"How are you?" — "I\'m good, thanks! And you?"',
        pronunciation: 'how ar yoo',
      },
      {
        word: 'take care',
        wordHi: 'take care (khayal rakhna)',
        meaning: 'a friendly way to say goodbye, wishing someone well',
        meaningHi: 'goodbye kehne ka ek friendly tareeka, kisi ke liye achhi kaamna karte hue',
        example: 'Bye, take care! See you tomorrow.',
        exampleHi: 'Bye, take care! See you tomorrow.',
        pronunciation: 'teyk kair',
      },
      {
        word: "what's up",
        wordHi: "what's up (kya chal raha hai)",
        meaning: 'a casual greeting between friends, not a literal question',
        meaningHi: 'friends ke beech ek casual greeting, literal question nahi',
        example: '"Hey, what\'s up?" — "Not much, you?"',
        exampleHi: '"Hey, what\'s up?" — "Not much, you?"',
        pronunciation: 'wuts up',
      },
    ],

    examples: [
      {
        title: 'Formal greeting — meeting a colleague',
        titleHi: 'Formal greeting — ek colleague se milna',
        code: `A: Good morning! How are you today?
B: Good morning! I'm doing well, thank you. And you?
A: I'm well too, thanks.`,
        output: 'Both people stay brief and positive, then move on to the real topic.',
        explain:
          'In a professional setting, keep the greeting short and formal. Notice neither person gives a long, detailed answer — that would actually feel out of place here.',
        explainHi:
          'Ek professional setting mein, greeting short aur formal rakho. Notice karo koi bhi person ek lambi, detailed answer nahi deta — ye yahan actually out of place lagega.',
      },
      {
        title: 'Casual greeting — meeting a friend',
        titleHi: 'Casual greeting — ek friend se milna',
        code: `A: Hey! What's up?
B: Not much, just heading to class. You?
A: Same, let's walk together.`,
        output: 'Short, relaxed, and moves quickly into an actual plan.',
        explain:
          'Between friends, "what\'s up" replaces "how are you", and the reply is usually just as short. Notice how quickly the conversation moves to something real ("let\'s walk together") once the ritual greeting is done.',
        explainHi:
          'Friends ke beech, "what\'s up" "how are you" ki jagah leta hai, aur reply usually utni hi short hoti hai. Notice karo conversation kitni jaldi kisi real cheez ("let\'s walk together") pe move ho jaati hai jab ritual greeting khatam ho jaati hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"What is your good name?"',
        right: '"What\'s your name?" or "May I know your name?"',
        why: 'This is a direct, word-for-word translation of the Hindi phrase "aapka shubh naam", and it doesn\'t exist in natural English — a native speaker will understand you, but it will sound noticeably translated rather than natural.',
        whyHi: 'Ye Hindi phrase "aapka shubh naam" ka ek direct, word-for-word translation hai, aur ye natural English mein exist nahi karta — ek native speaker tumhe samajh jaayega, par ye natural ki jagah noticeably translated sound karega.',
      },
      {
        wrong: '"I am fine only."',
        right: '"I\'m fine, thanks!" or "I\'m doing well, thanks!"',
        why: 'Adding "only" at the end to mean "just fine, nothing more" is a Hinglish habit that doesn\'t carry over into English the same way — in English, "I\'m fine, thanks" already communicates that completely on its own.',
        whyHi: '"only" ko end mein add karna "just fine, nothing more" ka matlab dene ke liye ek Hinglish habit hai jo English mein waise carry over nahi hoti — English mein, "I\'m fine, thanks" already apne aap poori tarah ye communicate kar deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Walking into an office or a meeting room** — a warm but brief greeting ("Good morning, everyone!") before sitting down sets a positive tone without eating into meeting time.',
        hi: '**Ek office ya meeting room mein enter karna** — sitting down se pehle ek warm par brief greeting ("Good morning, everyone!") meeting time khaye bina ek positive tone set karti hai.',
      },
      {
        en: '**Answering a phone call from someone you don\'t know well** — "Hello, good morning, this is [your name] speaking" immediately gives the caller your identity and a polite, professional opening.',
        hi: '**Kisi aise ka phone call answer karna jise tum achhe se nahi jaante** — "Hello, good morning, this is [your name] speaking" caller ko turant tumhari identity aur ek polite, professional opening deta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'If someone asks "How are you?", is it ever OK to actually say I\'m having a bad day?',
        qHi: 'Agar koi "How are you?" poochta hai, kya kabhi actually kehna theek hai ki mera din kharab ja raha hai?',
        a: 'With someone you know well and trust, yes — a real answer can start a genuine conversation. With a stranger, a new colleague, or in a purely professional context, keeping it short and positive ("I\'m okay, thanks — a bit busy today!") is the safer, more natural default; you can always share more with people you\'re close to.',
        aHi: 'Kisi ke saath jise tum achhe se jaante ho aur trust karte ho, haan — ek real answer ek genuine conversation start kar sakti hai. Ek stranger, ek naye colleague, ya purely professional context mein, short aur positive rehna ("I\'m okay, thanks — a bit busy today!") safer, zyada natural default hai; jinke close ho unse hamesha zyada share kar sakte ho.',
      },
      {
        q: 'What do I say if I genuinely don\'t remember someone\'s name when greeting them?',
        qHi: 'Agar mujhe genuinely kisi ka naam yaad nahi hai unhe greet karte waqt, main kya kahoon?',
        a: '"Hi! Good to see you again — remind me of your name?" is completely normal and polite. It\'s far better than avoiding their name entirely or guessing wrong.',
        aHi: '"Hi! Good to see you again — remind me of your name?" bilkul normal aur polite hai. Ye unka naam poori tarah avoid karne ya galat guess karne se kahin behtar hai.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, greet an imaginary colleague in the morning, ask how they are, and reply to their "and you?" — a full four-line exchange, from memory, without reading it.',
        taskHi: 'Zor se, ek imaginary colleague ko morning mein greet karo, poocho wo kaise hain, aur unke "and you?" ka reply do — ek poora four-line exchange, memory se, padhe bina.',
        hint: '"Good morning! How are you today?" → their reply → "I\'m good too, thanks!" → a small comment like "Nice weather today, isn\'t it?"',
        hintHi: '"Good morning! How are you today?" → unka reply → "I\'m good too, thanks!" → ek chhota comment jaise "Nice weather today, isn\'t it?"',
      },
      {
        task: 'Practice saying goodbye three different ways out loud: to a boss, to a friend, and to a neighbor you\'ll see again tomorrow.',
        taskHi: 'Goodbye kehna teen alag tareekon se zor se practice karo: ek boss ko, ek friend ko, aur ek neighbor ko jise tum kal phir dekhoge.',
        hint: 'Boss: "Have a good evening, see you tomorrow." Friend: "Catch you later!" Neighbor: "Take care, see you around!"',
        hintHi: 'Boss: "Have a good evening, see you tomorrow." Friend: "Catch you later!" Neighbor: "Take care, see you around!"',
      },
    ],

    keyTakeaways: [
      'Greetings change with time of day: good morning / afternoon / evening.',
      '"How are you?" and "What\'s up?" are rituals — a short, positive reply is expected, not a detailed answer.',
      'Formal and informal greetings both exist for a reason — match the situation, the way Hindi shifts between "aap" and "tum".',
      'Avoid direct Hindi-to-English translations like "What is your good name?" — use "What\'s your name?" instead.',
      'A small comment (weather, traffic) often bridges the greeting into the real topic — it is not filler to skip.',
    ],
    keyTakeawaysHi: [
      'Greetings din ke time ke saath change hoti hain: good morning / afternoon / evening.',
      '"How are you?" aur "What\'s up?" rituals hain — ek short, positive reply expected hai, detailed answer nahi.',
      'Formal aur informal greetings dono ek reason se exist karti hain — situation match karo, jaise Hindi "aap" aur "tum" ke beech shift karti hai.',
      'Direct Hindi-se-English translations jaise "What is your good name?" avoid karo — "What\'s your name?" use karo.',
      'Ek chhota comment (weather, traffic) often greeting ko real topic mein bridge karta hai — ye skip karne wala filler nahi hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-first-introductions',
    title: 'First Introductions — Nice to Meet You',
    titleHi: 'First Introductions — Nice to Meet You',
    description:
      'Saying your own name clearly, introducing someone else, and the exact phrase to drop: "Myself Priya."',
    descriptionHi:
      'Apna naam clearly bolna, kisi aur ko introduce karna, aur wo exact phrase jise drop karna hai: "Myself Priya."',
    difficulty: 'EASY',
    duration: 20,
    order: 3,

    analogy: {
      en: '**An introduction is a small gift, not a form field.** Handing someone your name well — with a smile, at a normal pace, easy to catch — is a small act of generosity that makes the whole rest of the conversation easier for both people.',
      hi: 'Ek introduction ek chhota gift hai, koi form field nahi. Kisi ko apna naam achhe se dena — ek smile ke saath, normal pace pe, pakadne mein aasan — ek chhota act of generosity hai jo baaki poori conversation dono logon ke liye aasan banata hai.',
    },

    simple: `**Saying your own name:**

- "I'm Priya." (most common, everywhere)
- "My name is Priya."
- "I'm Priya, nice to meet you!" (adding the polite closing phrase)

**Never say "Myself Priya."** This is a very common phrase carried
directly from Hindi ("main Priya") into English, but it is not correct,
natural English — a native speaker would say "I'm Priya" or "My name
is Priya" every time.

**Asking someone else's name, politely:**

- "What's your name?"
- "Sorry, I didn't catch your name?" (if you missed it)

**Introducing someone else to a third person:**

- "This is my friend, Raj."
- "This is Raj, he works with me."

**Closing the introduction:**

"Nice to meet you!" · "Pleasure to meet you!" · "Good to meet you!"`,
    simpleHi: `**Apna naam bolna:**

- "I'm Priya." (sabse common, har jagah)
- "My name is Priya."
- "I'm Priya, nice to meet you!" (polite closing phrase add karte hue)

**Kabhi "Myself Priya" mat kaho.** Ye ek bahut common phrase hai jo seedha
Hindi ("main Priya") se English mein carry hua hai, par ye correct, natural
English nahi hai — ek native speaker har baar "I'm Priya" ya "My name is
Priya" kahega.

**Kisi aur ka naam poochna, politely:**

- "What's your name?"
- "Sorry, I didn't catch your name?" (agar miss ho gaya)

**Kisi aur ko third person se introduce karna:**

- "This is my friend, Raj."
- "This is Raj, he works with me."

**Introduction close karna:**

"Nice to meet you!" · "Pleasure to meet you!" · "Good to meet you!"`,

    content: `**Why "Myself Priya" doesn't work, exactly.**

In Hindi, "main Priya" uses "main" (I) directly followed by the name —
grammatically complete on its own in that sentence structure. Speakers
translate "main" as "myself" because that's a common dictionary
meaning of the word, but "myself" in English is a reflexive pronoun —
it refers back to a subject that already exists ("I hurt myself", "I
did it myself"). It cannot stand in for "I am" the way "main" can.
English needs a real subject and verb: "I am" (I'm) or a full sentence
"My name is."

**The order of a full introduction, put together:**

1. Greet: "Hi!"
2. Give your name: "I'm Priya."
3. Optionally add context: "I'm Priya, I just joined the marketing
   team."
4. Close: "Nice to meet you!"

**Introducing two other people to each other** follows a simple
pattern: name the first person to the second, add one useful detail,
then let them take over.

"Raj, this is Priya — she's the new project manager. Priya, this is
Raj, he's on the design team."

Notice each person gets exactly one small, useful fact — enough to
start a real conversation, not a full biography.

**"Nice to meet you" only works the first time.** If you already know
someone and you're meeting again, say "Good to see you again!" instead
— saying "nice to meet you" to someone you've met before is a small
but noticeable mistake.`,
    contentHi: `**"Myself Priya" exactly kyun kaam nahi karta.**

Hindi mein, "main Priya" "main" (I) ko directly naam ke saath follow
karta hai — us sentence structure mein grammatically apne aap mein
complete hai. Speakers "main" ko "myself" translate karte hain kyunki
ye word ka ek common dictionary meaning hai, par English mein "myself"
ek reflexive pronoun hai — ye ek subject ko refer karta hai jo already
exist karta hai ("I hurt myself", "I did it myself"). Ye "I am" ki
jagah nahi le sakta jaise "main" leta hai. English ko ek real subject
aur verb chahiye: "I am" (I'm) ya poora sentence "My name is."

**Ek poore introduction ka order, saath mein:**

1. Greet karo: "Hi!"
2. Apna naam do: "I'm Priya."
3. Optionally context add karo: "I'm Priya, I just joined the marketing
   team."
4. Close karo: "Nice to meet you!"

**Do doosre logon ko ek doosre se introduce karna** ek simple pattern
follow karta hai: pehle person ka naam doosre ko batao, ek useful
detail add karo, phir unhe le lene do.

"Raj, this is Priya — she's the new project manager. Priya, this is
Raj, he's on the design team."

Notice karo har person ko exactly ek chhota, useful fact milta hai —
itna ki ek real conversation start ho sake, poori biography nahi.

**"Nice to meet you" sirf pehli baar kaam karta hai.** Agar tum kisi ko
already jaante ho aur phir se mil rahe ho, iske bajaye "Good to see you
again!" kaho — kisi ko jise pehle mil chuke ho "nice to meet you" kehna
ek chhota par noticeable mistake hai.`,

    readingPassage: `At the party, I see someone new. I walk over and say, "Hi! I'm Priya." She smiles and says, "Nice to meet you, Priya! I'm Meera." I say, "Nice to meet you too!" Then my friend comes over. I say, "Meera, this is my friend Raj. Raj, this is Meera." They both say, "Nice to meet you!" Now we all talk together.`,
    readingPassageHi: `Party mein, main kisi naye ko dekhti hoon. Main waha jaati hoon aur kehti hoon, "Hi! I'm Priya." Wo smile karti hai aur kehti hai, "Nice to meet you, Priya! I'm Meera." Main kehti hoon, "Nice to meet you too!" Phir mera friend aata hai. Main kehti hoon, "Meera, this is my friend Raj. Raj, this is Meera." Dono kehte hain, "Nice to meet you!" Ab hum sab saath mein baat karte hain.`,

    vocabulary: [
      {
        word: 'introduce',
        wordHi: 'introduce (parichay karana)',
        meaning: 'to tell one person the name of another for the first time',
        meaningHi: 'ek person ko doosre ka naam pehli baar batana',
        example: 'Let me introduce my friend, Raj.',
        exampleHi: 'Let me introduce my friend, Raj.',
        pronunciation: 'in-truh-DOOS',
      },
      {
        word: 'nice to meet you',
        wordHi: 'nice to meet you (aapse milkar khushi hui)',
        meaning: 'a polite phrase said the first time you meet someone',
        meaningHi: 'ek polite phrase jo kisi se pehli baar milte waqt bola jaata hai',
        example: 'I\'m Priya. — Nice to meet you, Priya!',
        exampleHi: 'I\'m Priya. — Nice to meet you, Priya!',
        pronunciation: 'nys too meet yoo',
      },
      {
        word: 'this is',
        wordHi: 'this is (ye hain)',
        meaning: 'used to introduce someone to another person',
        meaningHi: 'kisi ko doosre person se introduce karne ke liye use hota hai',
        example: 'This is my colleague, Meera.',
        exampleHi: 'This is my colleague, Meera.',
        pronunciation: 'dhis iz',
      },
      {
        word: 'catch (a name)',
        wordHi: 'catch (samajh mein aana)',
        meaning: 'to hear and understand something correctly',
        meaningHi: 'kuch sahi se sunna aur samajhna',
        example: "Sorry, I didn't catch your name — could you repeat it?",
        exampleHi: "Sorry, I didn't catch your name — could you repeat it?",
        pronunciation: 'kach',
      },
    ],

    examples: [
      {
        title: 'A complete first introduction',
        titleHi: 'Ek complete first introduction',
        code: `A: Hi! I'm Priya.
B: Hi Priya, I'm Alex. Nice to meet you!
A: Nice to meet you too! What do you do, Alex?
B: I work in design. And you?
A: I'm a project manager.`,
        output: 'Name, closing phrase, then a natural follow-up question.',
        explain:
          'A good introduction doesn\'t stop at names — it flows naturally into a follow-up question ("What do you do?") that keeps the conversation going instead of leaving an awkward silence.',
        explainHi:
          'Ek achhi introduction naam pe hi nahi rukti — ye naturally ek follow-up question ("What do you do?") mein flow karti hai jo conversation ko chalata rehta hai, ek awkward silence chhodne ke bajaye.',
      },
      {
        title: 'Introducing two friends to each other',
        titleHi: 'Do friends ko ek doosre se introduce karna',
        code: `You: Raj, this is my colleague Meera. Meera, this is Raj, my college friend.
Raj: Nice to meet you, Meera!
Meera: Nice to meet you too, Raj!`,
        output: 'Each person gets a name and one useful detail about them.',
        explain:
          'Notice the pattern: name the first person to the second, add a one-line detail about who they are, then repeat in reverse. This gives both people something small to talk about right away.',
        explainHi:
          'Pattern notice karo: pehle person ka naam doosre ko batao, unke baare mein ek one-line detail add karo, phir reverse mein repeat karo. Ye dono logon ko turant baat karne ke liye kuch chhota deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"Myself Priya."',
        right: '"I\'m Priya." or "My name is Priya."',
        why: '"Myself" is a reflexive pronoun in English — it refers back to a subject that already exists in the sentence ("I hurt myself"). It cannot replace "I am" the way Hindi\'s "main" can stand alone before a name.',
        whyHi: '"Myself" English mein ek reflexive pronoun hai — ye ek subject ko refer karta hai jo sentence mein already exist karta hai ("I hurt myself"). Ye "I am" ki jagah nahi le sakta jaise Hindi ka "main" naam se pehle akela khada ho sakta hai.',
      },
      {
        wrong: 'Saying "Nice to meet you!" to someone you already know and have met before',
        right: '"Good to see you again!" or "Great to see you!"',
        why: '"Nice to meet you" specifically marks a first meeting. Using it on someone you\'ve already met is a small but noticeable slip that signals you may have forgotten meeting them before.',
        whyHi: '"Nice to meet you" specifically ek first meeting ko mark karta hai. Ise kisi aise pe use karna jisse tum already mil chuke ho ek chhota par noticeable slip hai jo signal karta hai ki shayad tum bhool gaye ho ki tum unse pehle mil chuke ho.',
      },
    ],

    realWorld: [
      {
        en: '**Networking events and interviews** almost always open with an introduction — a clean "Hi, I\'m [name], I [one line about you]" gives the other person exactly enough to respond to and keep the conversation moving.',
        hi: '**Networking events aur interviews** almost hamesha ek introduction se open hote hain — ek clean "Hi, I\'m [name], I [ek line apne baare mein]" doosre person ko exactly itna deta hai ki wo respond kar sake aur conversation chalta rahe.',
      },
      {
        en: '**Group settings, like a new team at work** — knowing how to introduce two colleagues to each other smoothly ("Raj, this is Meera, she just joined marketing") is a small social skill that makes you look confident and considerate.',
        hi: '**Group settings, jaise kaam pe ek nayi team** — do colleagues ko ek doosre se smoothly introduce karna janna ("Raj, this is Meera, she just joined marketing") ek chhota social skill hai jo tumhe confident aur considerate dikhata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What if I forget the name of someone I\'m supposed to introduce?',
        qHi: 'Agar main us insaan ka naam bhool jaaon jise mujhe introduce karna hai?',
        a: 'Be honest, lightly: "I\'m so sorry, your name has completely slipped my mind — could you remind me?" People forget names all the time; asking is far better than avoiding the introduction altogether or guessing wrong.',
        aHi: 'Halke se honest raho: "I\'m so sorry, your name has completely slipped my mind — could you remind me?" Log naam hamesha bhool jaate hain; poochna introduction ko poori tarah avoid karne ya galat guess karne se kahin behtar hai.',
      },
      {
        q: 'Is it OK to add your job title right when you introduce yourself?',
        qHi: 'Kya apna job title turant introduce karte waqt add karna theek hai?',
        a: 'Yes, in a professional context it\'s common and useful: "I\'m Priya, I work in marketing." It gives the other person immediate, useful context. In a purely social setting, it\'s optional and can come up naturally a little later instead.',
        aHi: 'Haan, ek professional context mein ye common aur useful hai: "I\'m Priya, I work in marketing." Ye doosre person ko immediate, useful context deta hai. Ek purely social setting mein, ye optional hai aur thodi der baad naturally aa sakta hai.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, introduce yourself in three sentences: your name, one thing you do (work or study), and "nice to meet you."',
        taskHi: 'Zor se, apne aap ko teen sentences mein introduce karo: apna naam, ek cheez jo tum karte ho (kaam ya padhai), aur "nice to meet you."',
        hint: '"Hi, I\'m [name]. I [work/study] at [place]. Nice to meet you!"',
        hintHi: '"Hi, I\'m [name]. I [work/study] at [place]. Nice to meet you!"',
      },
      {
        task: 'Imagine two friends who have never met. Introduce them to each other out loud, giving each one a small useful detail.',
        taskHi: 'Do friends imagine karo jo kabhi nahi mile. Unhe zor se ek doosre se introduce karo, har ek ko ek chhota useful detail dete hue.',
        hint: '"[Name 1], this is [Name 2] — [one detail]. [Name 2], this is [Name 1] — [one detail]."',
        hintHi: '"[Name 1], this is [Name 2] — [one detail]. [Name 2], this is [Name 1] — [one detail]."',
      },
    ],

    keyTakeaways: [
      'Say "I\'m [name]" or "My name is [name]" — never "Myself [name]".',
      '"Myself" is reflexive in English and cannot replace "I am" the way Hindi\'s "main" can stand alone.',
      'Introducing two people follows a clear pattern: name each person to the other, add one small useful detail.',
      '"Nice to meet you" is only for the first time you meet someone — use "Good to see you again" afterward.',
      'A good introduction flows into a follow-up question instead of stopping at the names.',
    ],
    keyTakeawaysHi: [
      '"I\'m [name]" ya "My name is [name]" kaho — kabhi "Myself [name]" nahi.',
      '"Myself" English mein reflexive hai aur "I am" ki jagah nahi le sakta jaise Hindi ka "main" akela khada ho sakta hai.',
      'Do logon ko introduce karna ek clear pattern follow karta hai: har person ka naam doosre ko batao, ek chhota useful detail add karo.',
      '"Nice to meet you" sirf pehli baar kisi se milne ke liye hai — baad mein "Good to see you again" use karo.',
      'Ek achhi introduction ek follow-up question mein flow karti hai, naam pe rukne ke bajaye.',
    ],
  },
];
