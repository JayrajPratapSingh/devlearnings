/**
 * English Speaking Complete Course — Module 2: Talking About Yourself,
 * lessons 1-3.
 *
 * Lesson 1: Where you're from — country, city, nationality.
 * Lesson 2: What you do — job or study, and the article ("a"/"an") that
 *           Hindi has no equivalent for and therefore gets dropped.
 * Lesson 3: Combining it all into one full, natural self-introduction
 *           without stringing everything together with "and... and...".
 *
 * Grammar stays first-person, simple present — the same tense Module 1
 * used — so nothing here outruns what the learner has actually been
 * taught yet (see the ramp rules in
 * scratchpad/ENGLISH-SPEAKING-COURSE-PLAN.md).
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_2: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-where-youre-from',
    title: "Where You're From — Country, City & Nationality",
    titleHi: 'Tum Kahan Se Ho — Country, City Aur Nationality',
    description:
      '"I\'m from India" vs. "I\'m Indian" vs. "I live in Mumbai" — three related but different sentences, and the one phrase to stop using: "I belong from."',
    descriptionHi:
      '"I\'m from India" vs. "I\'m Indian" vs. "I live in Mumbai" — teen related par alag sentences, aur wo ek phrase jo use karna band karna hai: "I belong from."',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Your origin, your nationality, and your current address are three different labels on the same envelope.** "From India" is where the letter started, "Indian" is the return address printed on it, and "I live in Mumbai" is where it currently sits — all true at once, all said differently.',
      hi: 'Tumhara origin, nationality, aur current address ek hi envelope pe teen alag labels hain. "From India" wo jagah hai jahan se letter shuru hua, "Indian" wo return address hai jo usme print hai, aur "I live in Mumbai" wo jagah hai jahan wo abhi rakha hai — sab ek saath true hain, sab alag tareeke se kahe jaate hain.',
    },

    simple: `**Three ways to talk about where you're connected to:**

- **Country of origin**: "I'm from India."
- **Nationality (an adjective)**: "I'm Indian."
- **Where you currently live**: "I live in Mumbai." / "I'm based in Mumbai."

**You can combine them naturally:**

"I'm from India — I'm Indian — but I currently live in Mumbai."

**Nationality words usually end in a small set of patterns:**

- -an: Indian, American, Australian, Canadian
- -ish: British, Spanish, Turkish
- -ese: Japanese, Chinese, Vietnamese
- irregular: French, Dutch, Thai, Swiss

There's no single rule that predicts which pattern a country uses —
these are learned individually, the same way you learned them in your
own language.`,
    simpleHi: `**Teen tareeke jinse tum bata sakte ho tumhara connection kahan hai:**

- **Country of origin**: "I'm from India."
- **Nationality (ek adjective)**: "I'm Indian."
- **Tum currently kahan rehte ho**: "I live in Mumbai." / "I'm based in Mumbai."

**Tum inhe naturally combine kar sakte ho:**

"I'm from India — I'm Indian — but I currently live in Mumbai."

**Nationality words usually ek chhoti list ke patterns mein end hote hain:**

- -an: Indian, American, Australian, Canadian
- -ish: British, Spanish, Turkish
- -ese: Japanese, Chinese, Vietnamese
- irregular: French, Dutch, Thai, Swiss

Koi ek rule nahi predict karta ki kaunsa country kaunsa pattern use
karega — ye individually seekhe jaate hain, jaise tumne apni language
mein bhi seekhe the.`,

    content: `**"I belong from Mumbai" — why this specific phrase stands out.**

This is one of the most recognizable Indian-English phrases to a
native speaker, and it comes from a very reasonable place: Hindi's
"main Mumbai se hoon" or "mera Mumbai se sambandh hai" naturally
translates toward "belong." But in natural English, "belong" almost
always needs an object you belong TO, not a place you belong FROM:
"I belong to a large family," "This book belongs to me." For your
hometown, English simply uses "from": "I'm from Mumbai" or "I come
from Mumbai." Neither uses "belong" at all.

**"Native place" is another one worth knowing about.** "What's your
native place?" is common, natural Indian English but sounds unfamiliar
to many native English speakers outside India — "Where are you from
originally?" or "Where's your hometown?" carries the same meaning more
universally.

**Country vs. nationality vs. language are three separate words that
often get merged by mistake.** "I speak India" is wrong on two counts —
you don't "speak" a country, and the language isn't automatically named
after the country. "I speak Hindi. I'm from India. I'm Indian." — three
separate, correct sentences, each doing one job.

**"Live in" vs. "come from" can both be true for different reasons.**
Someone who grew up in Delhi but now works in Bangalore genuinely says
both: "I'm originally from Delhi, but I live in Bangalore now." This
single sentence — origin plus current location, joined with "but" —
is one of the most useful sentences in this entire lesson.`,
    contentHi: `**"I belong from Mumbai" — ye specific phrase kyun stand out karta hai.**

Ye ek most recognizable Indian-English phrases mein se hai ek native
speaker ke liye, aur ye ek bahut reasonable jagah se aata hai: Hindi ka
"main Mumbai se hoon" ya "mera Mumbai se sambandh hai" naturally
"belong" ki taraf translate hota hai. Par natural English mein,
"belong" almost hamesha ek object maangta hai jise tum belong karte ho,
ek jagah nahi jahan se tum belong karte ho: "I belong to a large
family," "This book belongs to me." Apne hometown ke liye, English
simply "from" use karti hai: "I'm from Mumbai" ya "I come from
Mumbai." Dono mein "belong" bilkul use nahi hota.

**"Native place" ek aur hai jise janna zaroori hai.** "What's your
native place?" common, natural Indian English hai par bahut se native
English speakers ko India ke bahar unfamiliar lagta hai — "Where are
you from originally?" ya "Where's your hometown?" same meaning zyada
universally carry karta hai.

**Country vs. nationality vs. language teen alag words hain jo often
galti se merge ho jaate hain.** "I speak India" do wajah se galat hai —
tum ek country ko "speak" nahi karte, aur language automatically
country ke naam pe nahi hoti. "I speak Hindi. I'm from India. I'm
Indian." — teen alag, correct sentences, har ek ek kaam karta hai.

**"Live in" vs. "come from" dono alag reasons se true ho sakte hain.**
Koi jo Delhi mein bada hua par ab Bangalore mein kaam karta hai
genuinely dono kehta hai: "I'm originally from Delhi, but I live in
Bangalore now." Ye single sentence — origin plus current location,
"but" se joined — is poore lesson ke sabse useful sentences mein se ek
hai.`,

    readingPassage: `Hi, let me tell you about myself. I'm from India. I'm Indian. I grew up in a small town, but now I live in a big city. I love my hometown, and I also love my new city. Both places feel like home to me now.`,
    readingPassageHi: `Hi, main apne baare mein batata hoon. I'm from India. I'm Indian. Main ek chhote town mein bada hua, par ab main ek badi city mein rehta hoon. Mujhe apna hometown pasand hai, aur mujhe apni nayi city bhi pasand hai. Ab dono jagah mujhe ghar jaisi lagti hain.`,

    vocabulary: [
      {
        word: 'nationality',
        wordHi: 'nationality (rashtriyata)',
        meaning: 'the country you legally belong to as a citizen',
        meaningHi: 'wo country jiske tum legally citizen ho',
        example: 'My nationality is Indian.',
        exampleHi: 'My nationality is Indian.',
        pronunciation: 'na-shuh-NAL-i-tee',
      },
      {
        word: 'hometown',
        wordHi: 'hometown (janmasthan/apna sheher)',
        meaning: 'the city or town where you grew up',
        meaningHi: 'wo city ya town jahan tum bade hue',
        example: 'My hometown is a small, quiet place.',
        exampleHi: 'My hometown is a small, quiet place.',
        pronunciation: 'HOHM-town',
      },
      {
        word: 'originally',
        wordHi: 'originally (mool roop se)',
        meaning: 'at first, or in the beginning — used to describe where you started before something changed',
        meaningHi: 'shuruaat mein — use hota hai ye describe karne ke liye ki kuch change hone se pehle tum kahan the',
        example: "I'm originally from Delhi, but I live in Bangalore now.",
        exampleHi: "I'm originally from Delhi, but I live in Bangalore now.",
        pronunciation: 'oh-RIJ-uh-nuh-lee',
      },
      {
        word: 'based in',
        wordHi: 'based in (mein sthit)',
        meaning: 'currently living or working in a place',
        meaningHi: 'currently kisi jagah rehna ya kaam karna',
        example: "I'm based in Mumbai for work.",
        exampleHi: "I'm based in Mumbai for work.",
        pronunciation: 'beyst in',
      },
    ],

    examples: [
      {
        title: 'Combining origin and current location',
        titleHi: 'Origin aur current location ko combine karna',
        code: `A: Where are you from?
B: I'm originally from Kerala, but I live in Pune now.
A: Oh nice! How long have you been in Pune?
B: About three years now.`,
        output: 'One clean sentence covers both origin and current home.',
        explain:
          'Notice the pattern: "I\'m originally from [place], but I live in [place] now." This single sentence answers the question completely and naturally invites a follow-up.',
        explainHi:
          'Pattern notice karo: "I\'m originally from [place], but I live in [place] now." Ye single sentence question ko completely aur naturally answer karta hai aur ek follow-up invite karta hai.',
      },
      {
        title: 'Country, nationality, and language as three separate facts',
        titleHi: 'Country, nationality, aur language teen alag facts ke roop mein',
        code: `I'm from India.
I'm Indian.
I speak Hindi and English.`,
        output: 'Three short, correct sentences instead of one confused one.',
        explain:
          'Keeping these as three separate, simple sentences is clearer and more natural than trying to combine them into one complex sentence — especially while you\'re still building confidence.',
        explainHi:
          'In teeno ko alag, simple sentences rakhna clearer aur zyada natural hai ek complex sentence mein combine karne ki koshish karne se — especially jab tak tum confidence bana rahe ho.',
      },
    ],

    mistakes: [
      {
        wrong: '"I belong from Mumbai."',
        right: '"I\'m from Mumbai." or "I come from Mumbai."',
        why: '"Belong" in English needs something you belong TO (a family, a group, a place you belong to), not a place you belong FROM. This phrase is a direct translation of a Hindi sentence structure that doesn\'t carry over.',
        whyHi: 'English mein "belong" ko kuch chahiye jise tum belong karte ho (ek family, ek group, ek jagah jise tum belong karte ho), na ki ek jagah jahan se tum belong karte ho. Ye phrase ek Hindi sentence structure ka direct translation hai jo carry over nahi hota.',
      },
      {
        wrong: '"I speak India."',
        right: '"I speak Hindi." / "I\'m from India."',
        why: 'A country is not a language. India has many languages spoken in it (Hindi, Tamil, Bengali, and more) — "speak" needs an actual language name, not the country\'s name.',
        whyHi: 'Ek country language nahi hoti. India mein kayi languages boli jaati hain (Hindi, Tamil, Bengali, aur bhi) — "speak" ko ek actual language ka naam chahiye, country ka naam nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Meeting international colleagues or clients** — a clear "I\'m from India, based in Mumbai" gives immediately useful context in a work introduction, especially in a remote or global team.',
        hi: '**International colleagues ya clients se milna** — ek clear "I\'m from India, based in Mumbai" ek work introduction mein turant useful context deta hai, especially ek remote ya global team mein.',
      },
      {
        en: '**Traveling or studying abroad** — "Where are you from?" is one of the very first questions you\'ll be asked, repeatedly, by many different people — having a clean, natural answer ready removes one small source of nervousness.',
        hi: '**Travel karna ya abroad padhai karna** — "Where are you from?" un sabse pehle questions mein se ek hai jo tumse baar-baar, kayi alag logon se poocha jaayega — ek clean, natural answer ready hona ek chhota source nervousness ka hata deta hai.',
      },
    ],

    interviewQA: [
      {
        q: "What's the difference between saying \"I'm Indian\" and \"I'm from India\"?",
        qHi: '"I\'m Indian" aur "I\'m from India" kehne mein kya farak hai?',
        a: 'They usually mean the same thing in casual conversation, but grammatically "I\'m Indian" states your nationality directly (an adjective), while "I\'m from India" states your origin (a place). Both are completely correct and commonly interchangeable for everyday speaking.',
        aHi: 'Casual conversation mein ye usually same cheez mean karte hain, par grammatically "I\'m Indian" tumhari nationality directly state karta hai (ek adjective), jabki "I\'m from India" tumhara origin state karta hai (ek jagah). Dono completely correct hain aur everyday speaking ke liye commonly interchangeable hain.',
      },
      {
        q: 'Is it OK to say "my native place" in English conversation?',
        qHi: 'Kya English conversation mein "my native place" kehna theek hai?',
        a: 'It will be understood, especially by other Indian English speakers, but it sounds distinctly Indian-English to speakers from elsewhere. "My hometown" or "where I\'m originally from" communicates the same idea more universally.',
        aHi: 'Ye samjha jaayega, especially doosre Indian English speakers ke through, par ye kahin aur ke speakers ko distinctly Indian-English sound karta hai. "My hometown" ya "where I\'m originally from" same idea zyada universally communicate karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, say the three-sentence pattern for yourself: your country, your nationality, and a language you speak.',
        taskHi: 'Zor se, apne liye teen-sentence pattern bolo: tumhari country, tumhari nationality, aur ek language jo tum bolte ho.',
        hint: '"I\'m from [country]. I\'m [nationality]. I speak [language]."',
        hintHi: '"I\'m from [country]. I\'m [nationality]. I speak [language]."',
      },
      {
        task: 'Practice the "originally from... but live in..." sentence using your own real hometown and current city (or an imagined one if they\'re the same).',
        taskHi: '"Originally from... but live in..." sentence practice karo apne real hometown aur current city use karke (ya ek imagined city agar dono same hain).',
        hint: '"I\'m originally from [hometown], but I live in [current city] now."',
        hintHi: '"I\'m originally from [hometown], but I live in [current city] now."',
      },
    ],

    keyTakeaways: [
      'Country of origin, nationality, and current location are three separate, useful sentences: "I\'m from...", "I\'m [nationality]", "I live in...".',
      'Never say "I belong from" — use "I\'m from" or "I come from" instead.',
      'A country is not a language — "I speak India" is wrong; name the actual language.',
      '"I\'m originally from [place], but I live in [place] now" is one of the most useful combined sentences for this topic.',
      '"My native place" is understood but sounds distinctly Indian-English — "my hometown" is more universal.',
    ],
    keyTakeawaysHi: [
      'Country of origin, nationality, aur current location teen alag, useful sentences hain: "I\'m from...", "I\'m [nationality]", "I live in...".',
      'Kabhi "I belong from" mat kaho — "I\'m from" ya "I come from" use karo.',
      'Ek country language nahi hoti — "I speak India" galat hai; actual language ka naam lo.',
      '"I\'m originally from [place], but I live in [place] now" is topic ke liye sabse useful combined sentences mein se ek hai.',
      '"My native place" samjha jaata hai par distinctly Indian-English sound karta hai — "my hometown" zyada universal hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-what-you-do-job-study',
    title: 'What You Do — Job, Study & the Missing Article',
    titleHi: 'Tum Kya Karte Ho — Job, Study Aur Wo Missing Article',
    description:
      'I work AT a company, I work AS an engineer, I am AN engineer — the small words Hindi has no equivalent for, and exactly where they go missing.',
    descriptionHi:
      'I work AT a company, I work AS an engineer, I am AN engineer — wo chhote words jinka Hindi mein koi equivalent nahi hai, aur exactly kahan ye missing ho jaate hain.',
    difficulty: 'EASY',
    duration: 20,
    order: 2,

    analogy: {
      en: '**"A" and "an" are like the small screws holding a shelf together — invisible when they\'re there, but the whole thing feels obviously wrong the moment one is missing.** Hindi doesn\'t use articles at all, so a Hindi speaker\'s ear doesn\'t automatically notice their absence in English the way a native speaker\'s ear does instantly.',
      hi: '"A" aur "an" ek shelf ko jode rakhne wale chhote screws jaise hain — jab wahan hote hain to invisible hote hain, par jis pal ek missing hota hai poori cheez obviously galat feel hoti hai. Hindi articles bilkul use nahi karti, isliye ek Hindi speaker ka kaan English mein unki absence ko automatically notice nahi karta jaise ek native speaker ka kaan turant karta hai.',
    },

    simple: `**Job vs. work — two different words, often mixed up.**

"Job" is a noun (a thing you have): "I have a good job."
"Work" is usually a verb (a thing you do): "I work at a bank."

Say "I work at [company]," not "I am doing job in [company]."

**"A" and "an" before a job title — never skip them.**

- "I am **an** engineer." (not "I am engineer")
- "I am **a** teacher." (not "I am teacher")
- "She is **an** artist." "He is **a** doctor."

Rule: use "an" before a vowel sound (an engineer, an artist, an
hour), "a" before a consonant sound (a teacher, a doctor, a
university — "university" starts with a "y" sound, so it takes "a").

**Talking about study, the same pattern:**

"I'm studying computer science." · "I'm a student." · "I study at
[college/university name]."`,
    simpleHi: `**Job vs. work — do alag words, often mix ho jaate hain.**

"Job" ek noun hai (ek cheez jo tumhare paas hai): "I have a good job."
"Work" usually ek verb hai (ek cheez jo tum karte ho): "I work at a
bank."

"I work at [company]" kaho, "I am doing job in [company]" nahi.

**"A" aur "an" job title se pehle — kabhi skip mat karo.**

- "I am **an** engineer." ("I am engineer" nahi)
- "I am **a** teacher." ("I am teacher" nahi)
- "She is **an** artist." "He is **a** doctor."

Rule: "an" use karo ek vowel sound se pehle (an engineer, an artist,
an hour), "a" use karo ek consonant sound se pehle (a teacher, a
doctor, a university — "university" "y" sound se start hota hai,
isliye ye "a" leta hai).

**Study ke baare mein baat karna, same pattern:**

"I'm studying computer science." · "I'm a student." · "I study at
[college/university name]."`,

    content: `**Why "I am engineer" specifically stands out to a native ear.**

Hindi has no articles ("a", "an", "the") — "main engineer hoon"
translates word-for-word to "I am engineer," and that translation is
completely natural in Hindi's grammar. But in English, almost every
singular, countable job title or profession needs "a" or "an" in
front of it. Skipping it is one of the single most common, most
noticeable signals of a Hindi-speaker's English — worth fixing early
because it appears in almost every sentence about your own profession.

**The rule is about SOUND, not spelling.** "An hour" uses "an" even
though "hour" starts with the letter "h", because the "h" is silent —
you hear a vowel sound. "A university" uses "a" even though
"university" starts with the letter "u", because you hear a "y" sound
at the start. Say the word out loud, not the letter, to pick correctly.

**"Doing job" vs. "working" — a specific, common substitution.**
"I am doing job in TCS" is understandable but noticeably non-native;
"I work at TCS" or "I'm working at TCS" is the natural version. "Job"
as a noun pairs naturally with "have" ("I have a job") or "get" ("I
got a new job"), while the ongoing activity itself is "work," used as
a verb.

**Describing study uses the exact same article rule.** "I am
student" needs "a": "I am a student." "I study in engineering" should
be "I'm studying engineering" (no "in") or "I'm an engineering
student."`,
    contentHi: `**"I am engineer" specifically native ear ko kyun stand out karta hai.**

Hindi mein articles nahi hote ("a", "an", "the") — "main engineer hoon"
word-for-word "I am engineer" mein translate hota hai, aur wo
translation Hindi ki grammar mein completely natural hai. Par English
mein, almost har singular, countable job title ya profession ko "a" ya
"an" apne aage chahiye. Isse skip karna ek sabse common, sabse
noticeable signals mein se ek hai ek Hindi-speaker ki English ka —
jaldi fix karne layak hai kyunki ye almost har sentence mein appear
hota hai jo tumhari apni profession ke baare mein hai.

**Rule SOUND ke baare mein hai, spelling ke baare mein nahi.** "An
hour" "an" use karta hai chahe "hour" letter "h" se start hota hai,
kyunki "h" silent hai — tum ek vowel sound sunte ho. "A university"
"a" use karta hai chahe "university" letter "u" se start hota hai,
kyunki tum shuruaat mein ek "y" sound sunte ho. Sahi choose karne ke
liye word ko zor se bolo, letter nahi.

**"Doing job" vs. "working" — ek specific, common substitution.**
"I am doing job in TCS" samajh mein aata hai par noticeably non-native
hai; "I work at TCS" ya "I'm working at TCS" natural version hai.
"Job" as a noun naturally "have" ("I have a job") ya "get" ("I got a
new job") ke saath pair hota hai, jabki ongoing activity khud "work"
hai, verb ke roop mein use hota hai.

**Study describe karna exactly same article rule use karta hai.** "I
am student" ko "a" chahiye: "I am a student." "I study in
engineering" "I'm studying engineering" hona chahiye (koi "in" nahi)
ya "I'm an engineering student."`,

    readingPassage: `Let me tell you what I do. I am a student. I study computer science at a university. It's an interesting subject, and I enjoy it a lot. In the future, I want to work as an engineer. I think it's a good career, and I'm working hard to reach that goal.`,
    readingPassageHi: `Main tumhe batata hoon main kya karta hoon. I am a student. I study computer science at a university. Ye ek interesting subject hai, aur mujhe ye bahut pasand hai. Future mein, I want to work as an engineer. Mujhe lagta hai ye ek achha career hai, aur main us goal tak pahunchne ke liye hard kaam kar raha hoon.`,

    vocabulary: [
      {
        word: 'career',
        wordHi: 'career (career)',
        meaning: 'the type of work someone does over a long period of their life',
        meaningHi: 'wo type ka kaam jo koi apni zindagi ke lambe period mein karta hai',
        example: "I'm building a career in software engineering.",
        exampleHi: "I'm building a career in software engineering.",
        pronunciation: 'kuh-REER',
      },
      {
        word: 'university',
        wordHi: 'university (vishwavidyalaya)',
        meaning: 'a school for higher education after school',
        meaningHi: 'school ke baad higher education ke liye ek school',
        example: "I'm studying at a university in Pune.",
        exampleHi: "I'm studying at a university in Pune.",
        pronunciation: 'yoo-nih-VER-sih-tee (starts with a "y" sound)',
      },
      {
        word: 'colleague',
        wordHi: 'colleague (sahyogi)',
        meaning: 'a person you work with',
        meaningHi: 'ek insaan jiske saath tum kaam karte ho',
        example: 'My colleague sits next to me in the office.',
        exampleHi: 'My colleague sits next to me in the office.',
        pronunciation: 'KOL-eeg',
      },
      {
        word: 'goal',
        wordHi: 'goal (lakshya)',
        meaning: 'something you are trying to achieve',
        meaningHi: 'kuch jise tum achieve karne ki koshish kar rahe ho',
        example: 'My goal is to become a good engineer.',
        exampleHi: 'My goal is to become a good engineer.',
        pronunciation: 'gohl',
      },
    ],

    examples: [
      {
        title: 'Introducing your job with articles in the right place',
        titleHi: 'Apni job introduce karna articles sahi jagah pe rakhte hue',
        code: `A: What do you do?
B: I'm a software engineer. I work at a tech company.
A: Oh nice, how long have you worked there?
B: About two years now.`,
        output: 'Every job title and workplace mention carries its article.',
        explain:
          'Notice "a software engineer" and "a tech company" — both need the article. Practicing this exact pattern out loud until it feels automatic is the fastest way to stop dropping it.',
        explainHi:
          '"a software engineer" aur "a tech company" notice karo — dono ko article chahiye. Ye exact pattern zor se practice karna jab tak automatic na feel ho, ise drop karna rokne ka sabse fast tareeka hai.',
      },
      {
        title: 'Introducing your studies',
        titleHi: 'Apni studies introduce karna',
        code: `A: Are you working or studying?
B: I'm studying. I'm a final-year student at a university in Delhi.
A: What are you studying?
B: I'm studying mechanical engineering.`,
        output: '"a final-year student" and "a university" both keep their article.',
        explain:
          'The same article rule applies to describing your studies as it does to describing a job — it doesn\'t change based on topic.',
        explainHi:
          'Same article rule apply hota hai apni studies describe karne mein jaise ek job describe karne mein hota hai — topic ke hisaab se change nahi hota.',
      },
    ],

    mistakes: [
      {
        wrong: '"I am engineer." / "I am doctor."',
        right: '"I am an engineer." / "I am a doctor."',
        why: 'Hindi has no articles, so this word is simply never missed when translating a Hindi sentence directly. In English, almost every singular job title needs "a" or "an" in front of it — this is one of the single most noticeable gaps to a native listener.',
        whyHi: 'Hindi mein articles nahi hote, isliye ek Hindi sentence directly translate karte waqt ye word simply kabhi miss nahi hota. English mein, almost har singular job title ko apne aage "a" ya "an" chahiye — ye ek native listener ke liye sabse noticeable gaps mein se ek hai.',
      },
      {
        wrong: '"I am doing job in a software company."',
        right: '"I work at a software company." / "I have a job at a software company."',
        why: '"Job" is a noun (a thing you have or get), and "work" is the verb for the ongoing activity. "Doing job" mixes the two in a way that doesn\'t occur in natural English.',
        whyHi: '"Job" ek noun hai (ek cheez jo tumhare paas hai ya milti hai), aur "work" ongoing activity ke liye verb hai. "Doing job" dono ko ek tarah se mix karta hai jo natural English mein occur nahi hota.',
      },
    ],

    realWorld: [
      {
        en: '**Job interviews specifically** — the interviewer will almost always ask "What do you do?" or "Tell me about your current role" early on, and a clean, article-correct answer creates an immediate impression of fluency before a single technical question is asked.',
        hi: '**Specifically job interviews** — interviewer almost hamesha jaldi "What do you do?" ya "Tell me about your current role" poochega, aur ek clean, article-correct answer ek immediate impression banata hai fluency ka, ek bhi technical question poochhe jaane se pehle.',
      },
      {
        en: '**LinkedIn and professional bios** — "I am a [job title] at [company]" is the exact opening sentence pattern used in countless professional profiles; getting the article right here is a small detail that reads as careful and polished.',
        hi: '**LinkedIn aur professional bios** — "I am a [job title] at [company]" exact opening sentence pattern hai jo countless professional profiles mein use hota hai; yahan article sahi karna ek chhota detail hai jo careful aur polished padhta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How do I quickly check whether a word needs "a" or "an"?',
        qHi: 'Main jaldi kaise check karoon ki ek word ko "a" chahiye ya "an"?',
        a: 'Say the word out loud and listen to its very first sound, not its first letter. If it starts with a vowel SOUND (a, e, i, o, u, or a silent h like in "hour"), use "an". If it starts with a consonant SOUND (including a "y" sound, like in "university"), use "a".',
        aHi: 'Word ko zor se bolo aur uski bilkul pehli sound suno, pehla letter nahi. Agar ye ek vowel SOUND se start hota hai (a, e, i, o, u, ya ek silent h jaise "hour" mein), "an" use karo. Agar ye ek consonant SOUND se start hota hai (including ek "y" sound, jaise "university" mein), "a" use karo.',
      },
      {
        q: 'Is "job" ever used as a verb in English?',
        qHi: 'Kya "job" kabhi English mein verb ke roop mein use hota hai?',
        a: 'Not in everyday speech — "job" stays a noun ("I have a job", "I got a job"). The verb you want for the ongoing activity is always "work" ("I work", "I\'m working").',
        aHi: 'Everyday speech mein nahi — "job" ek noun rehta hai ("I have a job", "I got a job"). Ongoing activity ke liye jo verb chahiye wo hamesha "work" hai ("I work", "I\'m working").',
      },
    ],

    exercises: [
      {
        task: 'Out loud, say your own job or study title correctly with its article: "I am a/an [title]."',
        taskHi: 'Zor se, apna job ya study title sahi se apne article ke saath bolo: "I am a/an [title]."',
        hint: 'Say the title out loud first to hear its starting sound before deciding between "a" and "an".',
        hintHi: 'Pehle title ko zor se bolo uski starting sound sunne ke liye "a" aur "an" ke beech decide karne se pehle.',
      },
      {
        task: 'Correct this sentence out loud: "I am doing job in bank, I am accountant." Say the fixed version three times.',
        taskHi: 'Ye sentence zor se correct karo: "I am doing job in bank, I am accountant." Fixed version teen baar bolo.',
        hint: '"I work at a bank. I am an accountant."',
        hintHi: '"I work at a bank. I am an accountant."',
      },
    ],

    keyTakeaways: [
      '"Job" is a noun you have; "work" is the verb for the ongoing activity — say "I work at...", not "I do job in...".',
      'Almost every singular job title or profession needs "a" or "an" — "I am an engineer," never "I am engineer."',
      'The a/an choice depends on the SOUND at the start of the next word, not its spelling.',
      'The same article rule applies equally to describing study: "I am a student," "an engineering student."',
      'This is one of the single most noticeable gaps in Hindi-speaker English precisely because it shows up in almost every sentence about yourself.',
    ],
    keyTakeawaysHi: [
      '"Job" ek noun hai jo tumhare paas hai; "work" ongoing activity ke liye verb hai — "I work at..." kaho, "I do job in..." nahi.',
      'Almost har singular job title ya profession ko "a" ya "an" chahiye — "I am an engineer," kabhi "I am engineer" nahi.',
      'a/an ka choice next word ki shuruaat ki SOUND pe depend karta hai, spelling pe nahi.',
      'Same article rule study describe karne mein equally apply hota hai: "I am a student," "an engineering student."',
      'Ye Hindi-speaker English mein sabse noticeable gaps mein se ek hai kyunki ye almost har sentence mein appear hota hai jo tumhare baare mein hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-full-self-introduction',
    title: 'Putting It All Together — a Full Self-Introduction',
    titleHi: 'Sab Kuch Saath Mein — Ek Poora Self-Introduction',
    description:
      'Combining name, origin, and work or study into one natural introduction — without stringing every sentence together with "and... and... and".',
    descriptionHi:
      'Naam, origin, aur work ya study ko ek natural introduction mein combine karna — har sentence ko "and... and... and" se jode bina.',
    difficulty: 'EASY',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A good self-introduction is a short walk, not a list read off a form.** A list reads: "Name: Priya. From: Mumbai. Job: engineer." A walk sounds like: "Hi, I\'m Priya — I\'m from Mumbai, and I work as an engineer here in the city." Same facts, completely different feeling.',
      hi: 'Ek achha self-introduction ek chhoti walk hai, ek form se padha hua list nahi. Ek list aisi padhti hai: "Name: Priya. From: Mumbai. Job: engineer." Ek walk aisi sunayi deti hai: "Hi, I\'m Priya — I\'m from Mumbai, and I work as an engineer here in the city." Same facts, completely different feeling.',
    },

    simple: `**The three building blocks you already have, from this module:**

1. Name — "I'm Priya."
2. Origin/nationality — "I'm from Mumbai. I'm Indian."
3. Job or study — "I work as an engineer." / "I'm a student."

**Joining them without repeating "and" every time:**

Instead of: "I am Priya and I am from Mumbai and I am Indian and I
work as an engineer and I like my job."

Try: "Hi, I'm Priya. I'm from Mumbai, and I currently work as an
engineer here. I really enjoy it."

**What changed:**

- Broken into two or three separate sentences (full stops, not endless
  "and"s)
- One natural connector ("and") instead of four
- Ends with a genuine, short personal comment ("I really enjoy it") —
  this is what makes it sound like a real person, not a form`,
    simpleHi: `**Teen building blocks jo tumhare paas already hain, is module se:**

1. Naam — "I'm Priya."
2. Origin/nationality — "I'm from Mumbai. I'm Indian."
3. Job ya study — "I work as an engineer." / "I'm a student."

**Inhe join karna har baar "and" repeat kiye bina:**

Iske bajaye: "I am Priya and I am from Mumbai and I am Indian and I
work as an engineer and I like my job."

Try karo: "Hi, I'm Priya. I'm from Mumbai, and I currently work as an
engineer here. I really enjoy it."

**Kya change hua:**

- Do ya teen alag sentences mein tod diya (full stops, endless "and"s
  nahi)
- Ek natural connector ("and") chaar ki jagah
- Ek genuine, short personal comment pe end hota hai ("I really enjoy
  it") — ye hi ise ek real person jaisa sound karata hai, form nahi`,

    content: `**Why stringing sentences with "and" feels unnatural, specifically.**

In Hindi, joining several facts in one flowing sentence with "aur"
feels completely natural and conversational. In English, doing the
same with "and" repeatedly creates something native speakers call a
"run-on" feeling — each fact loses its own weight because none of them
get their own sentence. Breaking facts into two or three short
sentences, each ending with a full stop, actually sounds MORE
confident and fluent, not less — it signals you're choosing your words
deliberately rather than rushing through a memorized list.

**A closing personal comment changes everything.** Compare "I'm
Priya. I'm from Mumbai. I work as an engineer" to the same three facts
plus one honest line: "I really enjoy it" or "I've been doing it for
about two years now." The facts alone sound like a form being read
aloud; one small personal addition makes it sound like an actual
person talking, and it also gives the listener something easy to ask
a follow-up question about.

**Order matters, but not strictly.** Name first is nearly universal.
After that, origin-then-work and work-then-origin are both completely
natural — choose whichever flows better for your specific facts.
What matters more than order is variety: don't start every single
sentence with "I am."

**A introduction should always leave a door open for the other
person.** Ending with a small question — "What about you?" or "Are
you from around here?" — turns a monologue into the start of an
actual two-way conversation, which is really the whole point of an
introduction in the first place.`,
    contentHi: `**Sentences ko "and" se string karna specifically kyun unnatural feel karta hai.**

Hindi mein, kayi facts ko ek flowing sentence mein "aur" se jodna
completely natural aur conversational feel karta hai. English mein,
same cheez "and" se repeatedly karna kuch aisa banata hai jise native
speakers "run-on" feeling kehte hain — har fact apna weight kho deta
hai kyunki koi bhi apna sentence nahi paata. Facts ko do ya teen chhote
sentences mein todna, har ek full stop pe end karte hue, actually MORE
confident aur fluent sound karta hai, kam nahi — ye signal karta hai ki
tum apne words deliberately choose kar rahe ho ek memorized list ke
through rush karne ke bajaye.

**Ek closing personal comment sab kuch change kar deta hai.** Compare
karo "I'm Priya. I'm from Mumbai. I work as an engineer" ko same teen
facts plus ek honest line ke saath: "I really enjoy it" ya "I've been
doing it for about two years now." Sirf facts ek form padhe jaane
jaisa sound karte hain; ek chhota personal addition ise ek actual
person baat karte hue jaisa sound karata hai, aur ye listener ko ek
easy cheez bhi deta hai jispe follow-up question poochh sake.

**Order matter karta hai, par strictly nahi.** Naam pehle nearly
universal hai. Uske baad, origin-then-work aur work-then-origin dono
completely natural hain — jo bhi tumhare specific facts ke liye better
flow kare wo choose karo. Order se zyada important variety hai: har
single sentence "I am" se start mat karo.

**Ek introduction ko hamesha doosre person ke liye ek door open
chhodna chahiye.** Ek chhote question pe end karna — "What about you?"
ya "Are you from around here?" — ek monologue ko ek actual two-way
conversation ki shuruaat mein badal deta hai, jo really ek
introduction ka poora point hai first place mein.`,

    readingPassage: `Hi, I'm Priya. I'm originally from Mumbai, and I currently work as a software engineer here in Bangalore. I've been working in tech for about three years now, and I really enjoy solving problems every day. In my free time, I like reading and going for long walks. So, what about you? What do you do?`,
    readingPassageHi: `Hi, I'm Priya. Main originally Mumbai se hoon, aur main currently Bangalore mein ek software engineer ke roop mein kaam karti hoon. Maine tech mein karib teen saal se kaam kiya hai, aur mujhe har din problems solve karna genuinely pasand hai. Apne free time mein, mujhe padhna aur lambi walks pe jaana pasand hai. So, what about you? What do you do?`,

    vocabulary: [
      {
        word: 'currently',
        wordHi: 'currently (abhi/vartaman mein)',
        meaning: 'at this present time',
        meaningHi: 'is present time pe',
        example: "I currently work as a teacher.",
        exampleHi: "I currently work as a teacher.",
        pronunciation: 'KUR-ent-lee',
      },
      {
        word: 'free time',
        wordHi: 'free time (khaali samay)',
        meaning: 'time when you are not working or studying',
        meaningHi: 'wo time jab tum kaam ya padhai nahi kar rahe ho',
        example: 'In my free time, I like painting.',
        exampleHi: 'In my free time, I like painting.',
        pronunciation: 'free tym',
      },
      {
        word: 'enjoy',
        wordHi: 'enjoy (aanand lena)',
        meaning: 'to get pleasure from doing something',
        meaningHi: 'kuch karne se pleasure milna',
        example: 'I really enjoy my job.',
        exampleHi: 'I really enjoy my job.',
        pronunciation: 'en-JOY',
      },
      {
        word: 'What about you?',
        wordHi: 'What about you? (Tumhara kya?)',
        meaning: 'a phrase used to pass a question back to the other person',
        meaningHi: 'ek phrase jo question wapas doosre person ko pass karne ke liye use hota hai',
        example: "I'm from Delhi. What about you?",
        exampleHi: "I'm from Delhi. What about you?",
        pronunciation: 'wut uh-bowt yoo',
      },
    ],

    examples: [
      {
        title: 'A full, natural introduction with a closing question',
        titleHi: 'Ek poora, natural introduction ek closing question ke saath',
        code: `Hi, I'm Raj. I'm from Chennai, and I currently work as a graphic designer in Mumbai. I've been doing it for about four years, and I love the creative side of it. So, what do you do?`,
        output: 'Name → origin/work → one personal comment → a question back.',
        explain:
          'Notice each piece gets its own short sentence, there\'s exactly one personal comment ("I love the creative side of it"), and it ends by handing the conversation back — a complete, natural pattern to reuse for yourself.',
        explainHi:
          'Notice karo har piece ko apna chhota sentence milta hai, exactly ek personal comment hai ("I love the creative side of it"), aur ye conversation wapas hand karke end hota hai — ek complete, natural pattern jo apne liye reuse karo.',
      },
      {
        title: 'Same facts, badly strung together — for comparison',
        titleHi: 'Same facts, badly strung together — comparison ke liye',
        code: `I am Raj and I am from Chennai and I work as a graphic designer and I am in Mumbai and I like my job and I have been doing it for four years.`,
        output: 'Understandable, but every fact carries equal, flat weight.',
        explain:
          'This version uses every fact from the good example above, but strung into one long "and" sentence it sounds rushed and flat, and gives the listener nowhere natural to respond.',
        explainHi:
          'Ye version upar wale achhe example ka har fact use karta hai, par ek lambe "and" sentence mein string kiya gaya ye rushed aur flat sound karta hai, aur listener ko respond karne ke liye koi natural jagah nahi deta.',
      },
    ],

    mistakes: [
      {
        wrong: 'Stringing every fact together with "and": "I am X and I am from Y and I work as Z and..."',
        right: 'Break facts into two or three short sentences, each ending with a full stop.',
        why: 'This mirrors a completely natural Hindi sentence structure ("main X hoon aur main Y se hoon aur main Z karta hoon"), but in English it reads as a run-on and makes every fact feel equally unimportant. Short, separate sentences sound more deliberate and confident.',
        whyHi: 'Ye ek completely natural Hindi sentence structure ko mirror karta hai ("main X hoon aur main Y se hoon aur main Z karta hoon"), par English mein ye ek run-on jaisa padhta hai aur har fact ko equally unimportant feel karata hai. Short, separate sentences zyada deliberate aur confident sound karte hain.',
      },
      {
        wrong: 'Ending an introduction abruptly with no question back: "...I work as an engineer." (full stop, silence)',
        right: '"...I work as an engineer. What about you?"',
        why: 'An introduction that doesn\'t hand the conversation back can leave an awkward gap, forcing the other person to think of a question themselves. A small closing question keeps the exchange natural and balanced.',
        whyHi: 'Ek introduction jo conversation wapas hand nahi karta ek awkward gap chhod sakta hai, doosre person ko khud ek question sochne pe majboor karte hue. Ek chhota closing question exchange ko natural aur balanced rakhta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Networking events, first days at a new job, and video-call introductions** all reward exactly this three-part pattern (name, origin/work, one personal line) plus a question back — it\'s short enough not to bore anyone and complete enough to sound confident.',
        hi: '**Networking events, ek nayi job ke first days, aur video-call introductions** sab exactly is three-part pattern (naam, origin/work, ek personal line) ko plus ek question back reward karte hain — ye kisi ko bore karne ke liye kaafi short hai aur confident sound karne ke liye kaafi complete hai.',
      },
      {
        en: '**A job interview\'s classic opening question, "Tell me about yourself"** — is essentially a request for exactly this pattern, stretched slightly longer with one or two more sentences about relevant experience.',
        hi: '**Ek job interview ka classic opening question, "Tell me about yourself"** — essentially exactly is pattern ki request hai, thoda lamba stretch kiya hua ek ya do aur sentences relevant experience ke baare mein.',
      },
    ],

    interviewQA: [
      {
        q: 'How long should a self-introduction actually be in a casual setting?',
        qHi: 'Ek casual setting mein self-introduction actually kitna lamba hona chahiye?',
        a: "Three to five sentences is usually enough: name, origin or role, one personal detail, and a question back. Longer than that in a casual setting risks turning an introduction into a monologue — save more detail for follow-up questions the other person actually asks.",
        aHi: 'Teen se paanch sentences usually kaafi hain: naam, origin ya role, ek personal detail, aur ek question back. Ek casual setting mein isse lamba hona introduction ko monologue mein badalne ka risk uthata hai — zyada detail follow-up questions ke liye bacha kar rakho jo doosra person actually poochhe.',
      },
      {
        q: 'Is it rude to end my introduction with a question, like I\'m avoiding talking more about myself?',
        qHi: 'Kya apna introduction ek question pe end karna rude hai, jaise main apne baare mein aur baat karne se avoid kar raha hoon?',
        a: 'Not at all — it\'s the opposite. Ending with a genuine question ("What about you?") signals real interest in the other person and turns your introduction into the start of a two-way conversation, which is generally seen as more socially skilled, not less.',
        aHi: 'Bilkul nahi — ye opposite hai. Ek genuine question ("What about you?") pe end karna doosre person mein real interest signal karta hai aur tumhare introduction ko ek two-way conversation ki shuruaat mein badal deta hai, jo generally zyada socially skilled dekha jaata hai, kam nahi.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, give your own full introduction: name, origin, work or study, one personal comment, and a question back — five sentences total.',
        taskHi: 'Zor se, apna poora introduction do: naam, origin, work ya study, ek personal comment, aur ek question back — total paanch sentences.',
        hint: '"Hi, I\'m [name]. I\'m from [place], and I [work as / study] [role]. I [personal comment]. What about you?"',
        hintHi: '"Hi, I\'m [name]. I\'m from [place], and I [work as / study] [role]. I [personal comment]. What about you?"',
      },
      {
        task: 'Take the "badly strung together" example from this lesson and say your own version of it out loud — one long sentence with too many "and"s — then immediately say the fixed version. Notice how different they feel.',
        taskHi: 'Is lesson ka "badly strung together" example lo aur apna version usko zor se bolo — ek lamba sentence bahut saare "and"s ke saath — phir turant fixed version bolo. Notice karo ye kitne alag feel karte hain.',
        hint: 'Say both versions back to back and notice which one you\'d rather listen to for thirty seconds.',
        hintHi: 'Dono versions ek ke baad ek bolo aur notice karo tum kaunsa version tees second sunna pasand karoge.',
      },
    ],

    keyTakeaways: [
      'A good introduction combines name, origin/work, one personal comment, and a question back — five short sentences, not one long one.',
      'Stringing facts together with repeated "and" feels natural in Hindi but reads as a run-on in English — use full stops instead.',
      'One honest personal comment ("I really enjoy it") makes the difference between a form being read and a real person talking.',
      'Ending with a small question hands the conversation back and turns a monologue into an exchange.',
      'This exact pattern — name, facts, comment, question — scales up directly into answering "Tell me about yourself" in an interview.',
    ],
    keyTakeawaysHi: [
      'Ek achha introduction naam, origin/work, ek personal comment, aur ek question back combine karta hai — paanch chhote sentences, ek lamba nahi.',
      'Facts ko repeated "and" se string karna Hindi mein natural feel karta hai par English mein run-on jaisa padhta hai — full stops use karo.',
      'Ek honest personal comment ("I really enjoy it") farak banata hai ek form padhe jaane aur ek real person baat karne ke beech.',
      'Ek chhote question pe end karna conversation wapas hand karta hai aur monologue ko exchange mein badal deta hai.',
      'Ye exact pattern — naam, facts, comment, question — directly scale up hota hai "Tell me about yourself" answer karne mein ek interview mein.',
    ],
  },
];
